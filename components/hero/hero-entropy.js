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

function parsePx(value, fallback = 0) {
  const n = Number.parseFloat(value);
  return Number.isFinite(n) ? n : fallback;
}

function measureTextWidth(ctx, text, letterSpacingPx) {
  if (!text) return 0;
  let width = 0;
  for (let i = 0; i < text.length; i++) {
    width += ctx.measureText(text[i]).width;
    if (i < text.length - 1) width += letterSpacingPx;
  }
  return width;
}

function wrapText(ctx, text, maxWidth, letterSpacingPx) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const lines = [];
  let current = words[0];
  for (let i = 1; i < words.length; i++) {
    const candidate = `${current} ${words[i]}`;
    if (measureTextWidth(ctx, candidate, letterSpacingPx) <= maxWidth) {
      current = candidate;
    } else {
      lines.push(current);
      current = words[i];
    }
  }
  lines.push(current);
  return lines;
}

function drawSpacedText(ctx, text, x, y, letterSpacingPx) {
  let dx = x;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    ctx.fillText(ch, dx, y);
    dx += ctx.measureText(ch).width + letterSpacingPx;
  }
}

const N_DESKTOP = 1400;
const N_MOBILE = 420;
const ATTRACT_R = 190;
const CALM_IN = 0.05;
const CALM_OUT = 0.018;
const NOISE_SPEED = 0.65;
const SWEEP_MS = 9000;
const ENTRY_MS = 1800;
const RESUME_DELAY = 3000;
const CURSOR_IDLE_MS = 1100;
const HOME_RETURN_DELAY = 3200;
const HOME_RETURN_LERP = 0.006;
const TARGET_SAMPLE_STEP_DESKTOP = 4;
const TARGET_SAMPLE_STEP_MOBILE = 6;
const TARGET_POINT_RATIO = 0.72;

// Central visual-direction layer. Change this block to retune the effect.
const COHERENCE_DIRECTION = {
  trigger: {
    interactionThreshold: 0.92,
    moveNormalizer: 170,
    ambientDelayMs: 6400,
    cooldownMs: 3000,
    energyDecayActive: 0.92,
    energyDecayIdle: 0.975,
  },
  timing: {
    revealMs: 880,
    holdMs: 1650,
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
    pull: 0.15,
    releasePull: 0.08,
    stickRadius: 22,
    snapRadius: 7,
    snapLerp: 0.34,
    burstMin: 1.1,
    burstMax: 2.3,
    glowBoost: 0.85,
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
      targetX_[i] *= sx;
      targetY_[i] *= sy;
    }

    curX *= sx;
    curY *= sy;
    refreshHeadlineTargets();
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
  const targetX_ = new Float32Array(n);
  const targetY_ = new Float32Array(n);
  const targetRank_ = new Float32Array(n).fill(2);

  let targetCount = 0;
  const auxTextEls = textOverlayEl
    ? Array.from(textOverlayEl.querySelectorAll('[data-hero-aux]'))
    : [];

  function refreshHeadlineTargets() {
    targetCount = 0;
    targetRank_.fill(2);
    if (!headlineEl) return;

    const headlineRect = headlineEl.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    if (!headlineRect.width || !headlineRect.height || !canvasRect.width || !canvasRect.height) return;

    const sampleCanvas = document.createElement('canvas');
    sampleCanvas.width = Math.max(1, Math.ceil(headlineRect.width));
    sampleCanvas.height = Math.max(1, Math.ceil(headlineRect.height));
    const sampleCtx = sampleCanvas.getContext('2d', { willReadFrequently: true });
    if (!sampleCtx) return;

    const styles = window.getComputedStyle(headlineEl);
    const fontSizePx = parsePx(styles.fontSize, 72);
    const lineHeightPx = parsePx(styles.lineHeight, fontSizePx * 1.05);
    const letterSpacingPx = parsePx(styles.letterSpacing, 0);
    const fontStyle = styles.fontStyle || 'normal';
    const fontWeight = styles.fontWeight || '600';
    const fontFamily = styles.fontFamily || 'serif';
    const text = headlineEl.textContent?.trim() ?? '';
    if (!text) return;

    sampleCtx.clearRect(0, 0, sampleCanvas.width, sampleCanvas.height);
    sampleCtx.fillStyle = '#000';
    sampleCtx.textBaseline = 'top';
    sampleCtx.font = `${fontStyle} ${fontWeight} ${fontSizePx}px ${fontFamily}`;

    const lines = wrapText(sampleCtx, text, Math.max(1, headlineRect.width), letterSpacingPx);
    for (let i = 0; i < lines.length; i++) {
      drawSpacedText(sampleCtx, lines[i], 0, i * lineHeightPx, letterSpacingPx);
    }

    const image = sampleCtx.getImageData(0, 0, sampleCanvas.width, sampleCanvas.height);
    const alpha = image.data;
    const step = isMobile ? TARGET_SAMPLE_STEP_MOBILE : TARGET_SAMPLE_STEP_DESKTOP;
    const points = [];

    for (let y = 1; y < sampleCanvas.height - 1; y += step) {
      for (let x = 1; x < sampleCanvas.width - 1; x += step) {
        const idx = (y * sampleCanvas.width + x) * 4 + 3;
        if (alpha[idx] < 24) continue;
        const top = alpha[((y - 1) * sampleCanvas.width + x) * 4 + 3];
        const right = alpha[(y * sampleCanvas.width + x + 1) * 4 + 3];
        const bottom = alpha[((y + 1) * sampleCanvas.width + x) * 4 + 3];
        const left = alpha[(y * sampleCanvas.width + x - 1) * 4 + 3];
        if (top > 24 && right > 24 && bottom > 24 && left > 24) continue;
        points.push({
          x: headlineRect.left - canvasRect.left + x,
          y: headlineRect.top - canvasRect.top + y,
        });
      }
    }

    if (!points.length) return;

    points.sort((a, b) => {
      const rowA = Math.round(a.y / Math.max(1, lineHeightPx));
      const rowB = Math.round(b.y / Math.max(1, lineHeightPx));
      return (rowA - rowB) || (a.x - b.x);
    });

    const maxPoints = Math.min(points.length, Math.floor(n * TARGET_POINT_RATIO));
    const particleOrder = Array.from({ length: n }, (_, i) => i).sort((a, b) => {
      const ax = homeReady ? homeX_[a] : px_[a];
      const bx = homeReady ? homeX_[b] : px_[b];
      const ay = homeReady ? homeY_[a] : py_[a];
      const by = homeReady ? homeY_[b] : py_[b];
      return (ax - bx) || (ay - by);
    });

    for (let i = 0; i < maxPoints; i++) {
      const point = points[Math.floor((i / maxPoints) * points.length)];
      const particleIndex = particleOrder[Math.floor((i / maxPoints) * particleOrder.length)];
      targetX_[particleIndex] = point.x;
      targetY_[particleIndex] = point.y;
      targetRank_[particleIndex] = maxPoints <= 1 ? 0 : i / (maxPoints - 1);
    }

    targetCount = maxPoints;
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
  let releaseBurstDone = false;
  let ambientTriggerAt = Date.now() + COHERENCE_DIRECTION.trigger.ambientDelayMs;

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

  function burstSignalParticles() {
    for (let i = 0; i < n; i++) {
      if (targetRank_[i] > 1) continue;
      const angle = Math.atan2(py_[i] - targetY_[i], px_[i] - targetX_[i]) + ((Math.random() - 0.5) * 0.8);
      const speed = COHERENCE_DIRECTION.particles.burstMin
        + Math.random() * (COHERENCE_DIRECTION.particles.burstMax - COHERENCE_DIRECTION.particles.burstMin);
      vx_[i] += Math.cos(angle) * speed;
      vy_[i] += Math.sin(angle) * speed;
    }
  }

  function setStage(nextStage, now) {
    stage = nextStage;
    stageStartedAt = now;
    if (nextStage === 'signal') {
      releaseBurstDone = false;
      return;
    }
    if (nextStage === 'release') {
      releaseBurstDone = false;
      return;
    }
    if (nextStage === 'entropy') {
      interactionEnergy = 0;
      ambientTriggerAt = now + COHERENCE_DIRECTION.trigger.cooldownMs + COHERENCE_DIRECTION.trigger.ambientDelayMs;
      applyTextState(0);
      return;
    }
    releaseBurstDone = false;
  }

  function startSignal(now) {
    if (prefersReduced || isPaused || !targetCount || stage !== 'entropy') return;
    setStage('signal', now);
  }

  function sweepPos(now) {
    const elapsed = (now - sweepStart) % (SWEEP_MS * 2);
    const raw = elapsed / SWEEP_MS;
    const ping = raw <= 1 ? raw : 2 - raw;
    const x = (easeInOutSine(ping) * (W + ATTRACT_R * 2)) - ATTRACT_R;
    return [x, H * 0.46];
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

    if (!coherenceActive && !prefersReduced && homeReady && targetCount) {
      if (interactionEnergy >= COHERENCE_DIRECTION.trigger.interactionThreshold) {
        startSignal(now);
      } else if (now >= ambientTriggerAt) {
        startSignal(now);
      }
    } else if (stage === 'signal' && stageProgress >= 0.999) {
      setStage('hold', now);
    } else if (stage === 'hold' && now - stageStartedAt >= COHERENCE_DIRECTION.timing.holdMs) {
      setStage('release', now);
    } else if (stage === 'release') {
      if (!releaseBurstDone) {
        burstSignalParticles();
        releaseBurstDone = true;
      }
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
    } else if ((!sweepPaused || hasCursor) && !prefersReduced && elapsed > ENTRY_MS) {
      [ex, ey] = sweepPos(now);
      active = true;
    } else {
      ex = -9999;
      ey = -9999;
      active = false;
    }

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

      if (coherenceActive && targetRank_[i] <= 1) {
        const tdx = targetX_[i] - x;
        const tdy = targetY_[i] - y;
        const targetDist = Math.sqrt(tdx * tdx + tdy * tdy);
        const pullStrength = stage === 'release'
          ? liveProgress * COHERENCE_DIRECTION.particles.releasePull
          : liveProgress * COHERENCE_DIRECTION.particles.pull;

        vx_[i] += tdx * pullStrength;
        vy_[i] += tdy * pullStrength;

        if (targetDist < COHERENCE_DIRECTION.particles.stickRadius) {
          const settle = 1 - targetDist / COHERENCE_DIRECTION.particles.stickRadius;
          targetCalm = Math.max(targetCalm, settle * settle * (0.25 + liveProgress * COHERENCE_DIRECTION.particles.glowBoost));
        }

        if (targetDist < COHERENCE_DIRECTION.particles.snapRadius) {
          x += tdx * COHERENCE_DIRECTION.particles.snapLerp * liveProgress;
          y += tdy * COHERENCE_DIRECTION.particles.snapLerp * liveProgress;
          vx_[i] *= 0.72;
          vy_[i] *= 0.72;
          targetCalm = Math.max(targetCalm, liveProgress);
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
      refreshHeadlineTargets();
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
    sweepPaused = true;
    interactionEnergy = Math.min(
      1.4,
      interactionEnergy + moveDist / COHERENCE_DIRECTION.trigger.moveNormalizer,
    );
    ambientTriggerAt = Date.now() + COHERENCE_DIRECTION.trigger.ambientDelayMs;
    clearTimeout(resumeTimer);
  }

  function onMouseLeave() {
    if (isPaused) return;
    hasCursor = false;
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => {
      sweepPaused = false;
      sweepStart = Date.now();
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
    sweepPaused = true;
    interactionEnergy = Math.min(
      1.4,
      interactionEnergy + moveDist / COHERENCE_DIRECTION.trigger.moveNormalizer,
    );
    ambientTriggerAt = Date.now() + COHERENCE_DIRECTION.trigger.ambientDelayMs;
    clearTimeout(resumeTimer);
  }

  function onTouchEnd() {
    if (isPaused) return;
    hasCursor = false;
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => {
      sweepPaused = false;
      sweepStart = Date.now();
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
    ambientTriggerAt = Date.now() + COHERENCE_DIRECTION.trigger.ambientDelayMs;
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
    refreshHeadlineTargets();
  });
  refreshHeadlineTargets();

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
