// Hero entropy field with a configurable coherence cycle:
// entropy -> signal -> hold -> release -> entropy.

const VERT = `#version 300 es
in vec2 a_pos;
in float a_calm;
uniform vec2 u_res;
uniform float u_dpr;
out float v_calm;
out float v_signal;
void main() {
  float calm = clamp(a_calm, 0.0, 1.0);
  float signal = smoothstep(0.12, 0.9, pow(calm, 1.2));
  vec2 clip = (a_pos / u_res) * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
  gl_PointSize = (3.85 + signal * 1.45 + pow(calm, 1.35) * 7.35) * u_dpr;
  v_calm = calm;
  v_signal = signal;
}`;

const FRAG = `#version 300 es
precision mediump float;
in float v_calm;
in float v_signal;
out vec4 out_color;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = dot(c, c);
  if (d > 0.25) discard;
  float edge = smoothstep(0.25, 0.08, d);
  vec3 ink = vec3(0.106, 0.122, 0.086);
  vec3 hub = vec3(0.094, 0.318, 0.078);
  float signal = mix(v_calm, v_signal, 0.7);
  vec3 col = mix(ink, hub, signal);
  float a = edge * (0.42 + signal * 0.5);
  out_color = vec4(col, a);
}`;

function easeOutQuart(t) {
  return 1 - (1 - t) ** 4;
}

function easeInOutSine(t) {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function flowField(x, y, t) {
  const k1 = 0.005;
  const w1 = 0.11;
  const k2 = 0.009;
  const w2 = 0.07;
  const vx = Math.sin(k1 * x + t * w1) * Math.cos(k1 * y)
    + 0.55 * Math.sin(k2 * x + t * w2 * 0.8) * Math.cos(k2 * y);
  const vy = -(Math.cos(k1 * x + t * w1) * Math.sin(k1 * y))
    - 0.55 * (Math.cos(k2 * x + t * w2 * 0.8) * Math.sin(k2 * y));
  return [vx / 1.55, vy / 1.55];
}

const N_DESKTOP = 1400;
const N_MOBILE = 420;
const ATTRACT_R = 190;
const CALM_IN = 0.05;
const CALM_OUT = 0.018;
const NOISE_SPEED = 0.65;
const SWEEP_MS = 9000;
const ENTRY_MS = 4000;
const RESUME_DELAY = 3000;
const POST_CTA_SWEEP_DELAY_MS = 10000;
const SWEEP_PAUSE_MS = 6000;
const CURSOR_IDLE_MS = 1100;
const HOME_RETURN_DELAY = 3200;
const HOME_RETURN_LERP = 0.006;

// Central visual-direction layer. Change this block to retune the effect.
const COHERENCE_DIRECTION = {
  trigger: {
    interactionThreshold: 0.92,
    moveNormalizer: 170,
    cooldownMs: 3000,
    energyDecayActive: 0.92,
    energyDecayIdle: 0.975,
  },
  timing: {
    revealMs: 1600,
    holdMs: 7500,
    releaseMs: 1500,
  },
  text: {
    overlayOpacityPower: 0.86,
    headlineBlurPx: 18,
    headlineLiftPx: 20,
    auxDelay: 0.22,
    auxBlurPx: 10,
    auxLiftPx: 12,
  },
  particles: {
    // pull zone: how far out particles start converging
    influenceRadius: 340,
    // strength of inward pull (scales with liveProgress)
    pullStrength: 0.048,
    // distance at which calm peaks (particle glows brightest)
    glowRadius: 130,
    // distance at which particle is absorbed into the text and recycled
    absorbRadius: 32,
    // how much calm to assign at the glow peak
    glowPeak: 1.0,
  },
};

export function init(canvasId, textOverlayEl, headlineEl, options = {}) {
  const canvas = document.getElementById(canvasId);
  if (!(canvas instanceof HTMLCanvasElement)) return;

  const gl = canvas.getContext('webgl2', {
    alpha: true,
    premultipliedAlpha: false,
    antialias: false,
  });

  if (!gl) {
    if (textOverlayEl) textOverlayEl.style.opacity = '1';
    return;
  }

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let isPaused = Boolean(options.paused);
  const isMobile = window.innerWidth < 768;
  const n = isMobile ? N_MOBILE : N_DESKTOP;

  let dpr = 1;
  let W = 0;
  let H = 0;

  function resize(preservePositions = false) {
    const prevW = W || 1;
    const prevH = H || 1;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    W = r.width;
    H = r.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);

    if (!preservePositions || !prevW || !prevH) return;

    const sx = W / prevW;
    const sy = H / prevH;
    for (let i = 0; i < n; i++) {
      px_[i] *= sx;
      py_[i] *= sy;
      homeX_[i] *= sx;
      homeY_[i] *= sy;
    }

    curX *= sx;
    curY *= sy;
    refreshHeadlineZone();
  }

  resize();

  function makeShader(type, src) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    return shader;
  }

  const prog = gl.createProgram();
  gl.attachShader(prog, makeShader(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, makeShader(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const aPos = gl.getAttribLocation(prog, 'a_pos');
  const aCalm = gl.getAttribLocation(prog, 'a_calm');
  const uRes = gl.getUniformLocation(prog, 'u_res');
  const uDpr = gl.getUniformLocation(prog, 'u_dpr');
  gl.uniform2f(uRes, W, H);
  gl.uniform1f(uDpr, dpr);

  const STRIDE = 3 * 4;
  const data = new Float32Array(n * 3);

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, STRIDE, 0);
  gl.enableVertexAttribArray(aCalm);
  gl.vertexAttribPointer(aCalm, 1, gl.FLOAT, false, STRIDE, 8);
  gl.bindVertexArray(null);

  const px_ = new Float32Array(n);
  const py_ = new Float32Array(n);
  const vx_ = new Float32Array(n);
  const vy_ = new Float32Array(n);
  const calm_ = new Float32Array(n);
  const evx_ = new Float32Array(n);
  const evy_ = new Float32Array(n);
  const homeX_ = new Float32Array(n);
  const homeY_ = new Float32Array(n);

  // Headline convergence zone — replaces per-particle glyph targets.
  let zoneX = 0;
  let zoneY = 0;
  let zoneReady = false;

  const auxTextEls = textOverlayEl
    ? Array.from(textOverlayEl.querySelectorAll('[data-hero-aux]'))
    : [];

  function refreshHeadlineZone() {
    zoneReady = false;
    if (!headlineEl) return;
    const headlineRect = headlineEl.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    if (!headlineRect.width || !headlineRect.height || !canvasRect.width || !canvasRect.height) return;
    zoneX = headlineRect.left - canvasRect.left + headlineRect.width * 0.5;
    zoneY = headlineRect.top - canvasRect.top + headlineRect.height * 0.5;
    zoneReady = true;
  }

  const cx0 = W * 0.5;
  const cy0 = H * 0.5;
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = Math.random() * Math.max(W, H) * 0.48;
    px_[i] = cx0 + Math.cos(a) * r;
    py_[i] = cy0 + Math.sin(a) * r;
    const ea = Math.random() * Math.PI * 2;
    const es = 1.5 + Math.random() * 4;
    evx_[i] = Math.cos(ea) * es;
    evy_[i] = Math.sin(ea) * es;
  }

  let curX = -9999;
  let curY = -9999;
  let hasCursor = false;
  let lastCursorMoveAt = 0;
  let sweepPaused = false;
  let sweepStart = 0;
  let resumeTimer = null;
  let homeReady = false;
  let interactionEnergy = 0;
  let stage = 'entropy';
  let stageStartedAt = 0;
  let coherenceCooldownUntil = 0;
  let sweepResumeAfterCTA = 0;
  let lastSweepHalf = -1;

  function clearTextStyles() {
    if (!textOverlayEl) return;
    textOverlayEl.style.opacity = '0';
    textOverlayEl.style.filter = 'none';
  }

  function clearHeadlineStyles() {
    if (!headlineEl) return;
    headlineEl.style.webkitMaskImage = 'none';
    headlineEl.style.maskImage = 'none';
    headlineEl.style.opacity = '';
    headlineEl.style.filter = 'none';
    headlineEl.style.transform = 'none';
  }

  function clearAuxiliaryStyles() {
    for (const el of auxTextEls) {
      el.style.opacity = '0';
      el.style.filter = 'none';
      el.style.transform = 'none';
    }
  }

  function getStageProgress(now) {
    if (stage === 'entropy') return 0;
    if (stage === 'hold') return 1;
    const elapsed = now - stageStartedAt;
    if (stage === 'signal') {
      return easeOutQuart(clamp01(elapsed / COHERENCE_DIRECTION.timing.revealMs));
    }
    return 1 - easeInOutSine(clamp01(elapsed / COHERENCE_DIRECTION.timing.releaseMs));
  }

  function applyHeadlineState(progress) {
    if (!headlineEl) return;
    if (prefersReduced || isPaused) {
      clearHeadlineStyles();
      headlineEl.style.opacity = '1';
      return;
    }
    if (progress <= 0.001) {
      clearHeadlineStyles();
      return;
    }

    const blur = (1 - progress) * COHERENCE_DIRECTION.text.headlineBlurPx;
    const lift = (1 - progress) * COHERENCE_DIRECTION.text.headlineLiftPx;
    headlineEl.style.webkitMaskImage = 'none';
    headlineEl.style.maskImage = 'none';
    headlineEl.style.opacity = `${clamp01(progress)}`;
    headlineEl.style.filter = `blur(${blur.toFixed(2)}px)`;
    headlineEl.style.transform = `translate3d(0, ${lift.toFixed(2)}px, 0)`;
  }

  function applyAuxiliaryState(progress) {
    if (!auxTextEls.length) return;

    const auxProgress = prefersReduced || isPaused
      ? 1
      : clamp01((progress - COHERENCE_DIRECTION.text.auxDelay) / (1 - COHERENCE_DIRECTION.text.auxDelay));
    const blur = (1 - auxProgress) * COHERENCE_DIRECTION.text.auxBlurPx;
    const lift = (1 - auxProgress) * COHERENCE_DIRECTION.text.auxLiftPx;

    for (const el of auxTextEls) {
      el.style.opacity = `${auxProgress}`;
      el.style.filter = `blur(${blur.toFixed(2)}px)`;
      el.style.transform = `translate3d(0, ${lift.toFixed(2)}px, 0)`;
    }
  }

  function applyTextState(progress) {
    if (!textOverlayEl) return;
    if (prefersReduced || isPaused) {
      textOverlayEl.style.opacity = '1';
      textOverlayEl.style.filter = 'none';
      applyHeadlineState(1);
      applyAuxiliaryState(1);
      return;
    }
    if (progress <= 0.001) {
      clearTextStyles();
      clearHeadlineStyles();
      clearAuxiliaryStyles();
      return;
    }

    textOverlayEl.style.opacity = `${Math.pow(clamp01(progress), COHERENCE_DIRECTION.text.overlayOpacityPower)}`;
    textOverlayEl.style.filter = 'none';
    applyHeadlineState(progress);
    applyAuxiliaryState(progress);
  }

  function setStage(nextStage, now) {
    stage = nextStage;
    stageStartedAt = now;
    if (nextStage === 'entropy') {
      interactionEnergy = 0;
      coherenceCooldownUntil = now + COHERENCE_DIRECTION.trigger.cooldownMs;
      sweepResumeAfterCTA = now + POST_CTA_SWEEP_DELAY_MS;
      sweepStart = now + POST_CTA_SWEEP_DELAY_MS;
      lastSweepHalf = -1;
      for (let j = 0; j < n; j++) { vx_[j] = 0; vy_[j] = 0; calm_[j] = 0; }
      applyTextState(0);
    }
  }

  function startSignal(now) {
    if (prefersReduced || isPaused || !zoneReady || stage !== 'entropy') return;
    setStage('signal', now);
  }

  function sweepPos(now) {
    const halfCycle = SWEEP_MS + SWEEP_PAUSE_MS;
    const elapsed = (now - sweepStart) % (halfCycle * 2);
    const half = elapsed < halfCycle ? 0 : 1;
    const halfElapsed = elapsed - half * halfCycle;

    if (halfElapsed >= SWEEP_MS) {
      // Pause period between sweeps — attractor inactive.
      return [-9999, -9999, false, half];
    }

    const t = easeInOutSine(halfElapsed / SWEEP_MS);
    const span = W + ATTRACT_R * 2;
    const x = half === 0
      ? t * span - ATTRACT_R          // left → right
      : (1 - t) * span - ATTRACT_R;  // right → left
    return [x, zoneReady ? zoneY : H * 0.46, true, half];
  }

  let rafId = null;
  let isVisible = true;
  let isInView = true;
  const startTime = Date.now();
  sweepStart = startTime + ENTRY_MS;

  function frame() {
    rafId = requestAnimationFrame(frame);
    if (isPaused || !isVisible || !isInView) return;

    const now = Date.now();
    const elapsed = now - startTime;
    const t = elapsed / 1000;
    const entryRaw = Math.min(1, elapsed / ENTRY_MS);
    const entryFactor = prefersReduced ? 0 : 1 - easeOutQuart(entryRaw);
    const cursorActive = hasCursor && now - lastCursorMoveAt < CURSOR_IDLE_MS;
    const restoreHome = homeReady && lastCursorMoveAt > 0 && !cursorActive && now - lastCursorMoveAt >= HOME_RETURN_DELAY;

    interactionEnergy *= cursorActive
      ? COHERENCE_DIRECTION.trigger.energyDecayActive
      : COHERENCE_DIRECTION.trigger.energyDecayIdle;

    const stageProgress = getStageProgress(now);
    const coherenceActive = stage !== 'entropy';

    if (!coherenceActive && !prefersReduced && homeReady && zoneReady && now >= coherenceCooldownUntil) {
      if (interactionEnergy >= COHERENCE_DIRECTION.trigger.interactionThreshold) {
        startSignal(now);
      }
    } else if (stage === 'signal' && stageProgress >= 0.999) {
      setStage('hold', now);
    } else if (stage === 'hold' && now - stageStartedAt >= COHERENCE_DIRECTION.timing.holdMs) {
      setStage('release', now);
    } else if (stage === 'release') {
      if (now - stageStartedAt >= COHERENCE_DIRECTION.timing.releaseMs) {
        setStage('entropy', now);
      }
    }

    const liveProgress = stage === 'entropy' ? 0 : getStageProgress(now);

    let ex;
    let ey;
    let active;

    if (coherenceActive) {
      ex = -9999;
      ey = -9999;
      active = false;
    } else if (cursorActive) {
      ex = curX;
      ey = curY;
      active = true;
    } else if (!sweepPaused && !prefersReduced && elapsed > ENTRY_MS && now >= sweepResumeAfterCTA) {
      const [sx, sy, sweepActive, sweepHalf] = sweepPos(now);
      ex = sx;
      ey = sy;
      active = sweepActive;

      // Reset velocities at the leading edge of each new sweep pass.
      if (sweepActive && sweepHalf !== lastSweepHalf) {
        for (let j = 0; j < n; j++) { vx_[j] = 0; vy_[j] = 0; }
        lastSweepHalf = sweepHalf;
      }
    } else {
      ex = -9999;
      ey = -9999;
      active = false;
    }

    const {
      influenceRadius,
      pullStrength,
      glowRadius,
      absorbRadius,
      glowPeak,
    } = COHERENCE_DIRECTION.particles;

    for (let i = 0; i < n; i++) {
      let x = px_[i];
      let y = py_[i];

      if (entryFactor > 0) {
        x += evx_[i] * entryFactor * 3.2;
        y += evy_[i] * entryFactor * 3.2;
      } else if (restoreHome) {
        x += (homeX_[i] - x) * HOME_RETURN_LERP;
        y += (homeY_[i] - y) * HOME_RETURN_LERP;
      } else {
        const fieldScale = 1 - entryFactor * 0.85;
        const [fx, fy] = flowField(x, y, t);
        vx_[i] = vx_[i] * 0.88 + fx * NOISE_SPEED * fieldScale * 0.12;
        vy_[i] = vy_[i] * 0.88 + fy * NOISE_SPEED * fieldScale * 0.12;
      }

      const dx = ex - x;
      const dy = ey - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      let targetCalm = 0;

      if (active && dist < ATTRACT_R) {
        const ratio = 1 - dist / ATTRACT_R;
        targetCalm = ratio * ratio;
        const f = targetCalm * 0.072;
        vx_[i] += dx * f;
        vy_[i] += dy * f;
      }

      // Convergence mechanic: particles feed into the headline zone.
      if (coherenceActive && zoneReady) {
        const zdx = zoneX - x;
        const zdy = zoneY - y;
        const zdist = Math.sqrt(zdx * zdx + zdy * zdy);

        if (stage !== 'release') {
          // Signal / hold: pull particles toward the zone.
          if (zdist < influenceRadius) {
            const ratio = 1 - zdist / influenceRadius;
            const pull = ratio * ratio * pullStrength * liveProgress;
            vx_[i] += zdx * pull;
            vy_[i] += zdy * pull;
          }

          // Glow brightens as particle closes in.
          if (zdist < glowRadius) {
            const glowRatio = 1 - zdist / glowRadius;
            targetCalm = Math.max(targetCalm, glowRatio * glowRatio * glowPeak * liveProgress);
          }

          // Absorb: recycle particle when it reaches the text block.
          if (zdist < absorbRadius) {
            const edge = Math.floor(Math.random() * 4);
            if (edge === 0) { px_[i] = Math.random() * W; py_[i] = -15; }
            else if (edge === 1) { px_[i] = W + 15; py_[i] = Math.random() * H; }
            else if (edge === 2) { px_[i] = Math.random() * W; py_[i] = H + 15; }
            else { px_[i] = -15; py_[i] = Math.random() * H; }
            vx_[i] = 0;
            vy_[i] = 0;
            calm_[i] = 0;
            x = px_[i];
            y = py_[i];
            targetCalm = 0;
          }
        }
      }

      const vcap = active ? 3.2 : 2.1;
      const vmag = Math.hypot(vx_[i], vy_[i]);
      if (vmag > vcap) {
        vx_[i] *= vcap / vmag;
        vy_[i] *= vcap / vmag;
      }
      x += vx_[i];
      y += vy_[i];

      if (x < -20) x = W + 20;
      if (x > W + 20) x = -20;
      if (y < -20) y = H + 20;
      if (y > H + 20) y = -20;

      px_[i] = x;
      py_[i] = y;
      const cs = calm_[i] < targetCalm ? CALM_IN : CALM_OUT;
      calm_[i] = calm_[i] + (targetCalm - calm_[i]) * cs;

      data[i * 3] = x;
      data[i * 3 + 1] = y;
      data[i * 3 + 2] = calm_[i];
    }

    if (!homeReady && elapsed >= ENTRY_MS) {
      homeX_.set(px_);
      homeY_.set(py_);
      homeReady = true;
      refreshHeadlineZone();
    }

    applyTextState(liveProgress);

    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, data);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.uniform2f(uRes, W, H);
    gl.drawArrays(gl.POINTS, 0, n);
    gl.bindVertexArray(null);
  }

  const section = canvas.parentElement;

  function onMouseMove(e) {
    if (isPaused) return;
    const r = canvas.getBoundingClientRect();
    const nextX = e.clientX - r.left;
    const nextY = e.clientY - r.top;
    const moveDist = hasCursor ? Math.hypot(nextX - curX, nextY - curY) : 0;
    curX = nextX;
    curY = nextY;
    hasCursor = true;
    lastCursorMoveAt = Date.now();
    if (!sweepPaused) sweepStart = Date.now();
    sweepPaused = true;
    lastSweepHalf = -1;
    interactionEnergy = Math.min(
      1.4,
      interactionEnergy + moveDist / COHERENCE_DIRECTION.trigger.moveNormalizer,
    );
    clearTimeout(resumeTimer);
  }

  function onMouseLeave() {
    if (isPaused) return;
    hasCursor = false;
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => {
      sweepPaused = false;
      sweepStart = Date.now();
      lastSweepHalf = -1;
    }, RESUME_DELAY);
  }

  function onTouchMove(e) {
    if (isPaused) return;
    const touch = e.touches[0];
    if (!touch) return;
    const r = canvas.getBoundingClientRect();
    const nextX = touch.clientX - r.left;
    const nextY = touch.clientY - r.top;
    const moveDist = hasCursor ? Math.hypot(nextX - curX, nextY - curY) : 0;
    curX = nextX;
    curY = nextY;
    hasCursor = true;
    lastCursorMoveAt = Date.now();
    if (!sweepPaused) sweepStart = Date.now();
    sweepPaused = true;
    lastSweepHalf = -1;
    interactionEnergy = Math.min(
      1.4,
      interactionEnergy + moveDist / COHERENCE_DIRECTION.trigger.moveNormalizer,
    );
    clearTimeout(resumeTimer);
  }

  function onTouchEnd() {
    if (isPaused) return;
    hasCursor = false;
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => {
      sweepPaused = false;
      sweepStart = Date.now();
      lastSweepHalf = -1;
    }, RESUME_DELAY);
  }

  let resizeTimer = null;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize(true);
      gl.uniform2f(uRes, W, H);
      gl.uniform1f(uDpr, dpr);
    }, 100);
  }

  function onVisibilityChange() {
    isVisible = !document.hidden;
  }

  function setPaused(nextPaused) {
    isPaused = Boolean(nextPaused);
    hasCursor = false;
    sweepPaused = false;
    clearTimeout(resumeTimer);
    if (isPaused) {
      applyTextState(1);
      return;
    }
    setStage('entropy', Date.now());
    applyTextState(0);
    sweepStart = Date.now();
  }

  let observer = null;
  if (section && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver(([entry]) => {
      isInView = entry.isIntersecting;
    }, { threshold: 0 });
    observer.observe(section);
  }

  let fontReadyCancelled = false;
  document.fonts?.ready?.then(() => {
    if (fontReadyCancelled) return;
    refreshHeadlineZone();
  });
  refreshHeadlineZone();

  section?.addEventListener('mousemove', onMouseMove);
  section?.addEventListener('mouseleave', onMouseLeave);
  section?.addEventListener('touchmove', onTouchMove, { passive: true });
  section?.addEventListener('touchend', onTouchEnd);
  window.addEventListener('resize', onResize);
  document.addEventListener('visibilitychange', onVisibilityChange);

  if (prefersReduced) applyTextState(1);
  else applyTextState(0);

  rafId = requestAnimationFrame(frame);

  return {
    setPaused,
    triggerCoherence() {
      startSignal(Date.now());
    },
    destroy() {
      cancelAnimationFrame(rafId);
      clearTimeout(resumeTimer);
      clearTimeout(resizeTimer);
      fontReadyCancelled = true;
      section?.removeEventListener('mousemove', onMouseMove);
      section?.removeEventListener('mouseleave', onMouseLeave);
      section?.removeEventListener('touchmove', onTouchMove);
      section?.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      observer?.disconnect();
    },
  };
}
