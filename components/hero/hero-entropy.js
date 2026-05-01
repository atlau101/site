// "Entropy Field" — hero WebGL2 particle attractor
// 1200 particles drift in a flow field (noise). Cursor acts as signal attractor:
// particles crystallize near cursor, turning forest green, growing in size.
// Signal strength (avg calm) drives text overlay opacity.

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
  // INK  ≈ oklch(0.18 0.005 120)
  // HUB  ≈ oklch(0.30 0.09 140)
  vec3 ink = vec3(0.106, 0.122, 0.086);
  vec3 hub = vec3(0.094, 0.318, 0.078);
  float signal = mix(v_calm, v_signal, 0.7);
  vec3 col = mix(ink, hub, signal);
  float a = edge * (0.42 + signal * 0.5);
  out_color = vec4(col, a);
}`;

function easeOutQuart(t) { return 1 - (1 - t) ** 4; }
function easeInOutSine(t) { return -(Math.cos(Math.PI * t) - 1) / 2; }

// Curl noise (divergence-free): stream function ψ = sin(kx) * sin(ky)
// → vx = ∂ψ/∂y = sin(kx + φt) * cos(ky), vy = -∂ψ/∂x = -cos(kx + φt) * sin(ky)
// Returns normalized ±1 values. Particles stay uniformly distributed over time.
function flowField(x, y, t) {
  const k1 = 0.005, w1 = 0.11;
  const k2 = 0.009, w2 = 0.07;
  const vx = Math.sin(k1 * x + t * w1) * Math.cos(k1 * y)
           + 0.55 * Math.sin(k2 * x + t * w2 * 0.8) * Math.cos(k2 * y);
  const vy = -(Math.cos(k1 * x + t * w1) * Math.sin(k1 * y))
           - 0.55 * (Math.cos(k2 * x + t * w2 * 0.8) * Math.sin(k2 * y));
  return [vx / 1.55, vy / 1.55]; // normalize to ±1
}

const N_DESKTOP    = 1400;
const N_MOBILE     = 420;
const ATTRACT_R    = 190;
const CALM_IN      = 0.05;
const CALM_OUT     = 0.018;
const NOISE_SPEED  = 0.65;
const SWEEP_MS     = 9000;
const ENTRY_MS     = 1800;
const RESUME_DELAY = 3000;
const CURSOR_IDLE_MS = 1100;
const HOME_RETURN_DELAY = 3200;
const HOME_RETURN_LERP = 0.006;
const REVEAL_R     = 340;   // mask circle radius at full cursor reveal
const MASK_LERP_IN  = 0.006; // slow expand — ~3s to reach REVEAL_R at 60fps
const MASK_LERP_OUT = 0.004; // slower collapse — ~5s to fully hidden

export function init(canvasId, textOverlayEl, options = {}) {
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

  // ── Canvas sizing ────────────────────────────────────────────────────────
  let dpr = 1, W = 0, H = 0;
  function resize(preservePositions = false) {
    const prevW = W || 1;
    const prevH = H || 1;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    W = r.width; H = r.height;
    canvas.width  = Math.round(W * dpr);
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
    maskX *= sx;
    maskY *= sy;
  }
  resize();

  // ── Compile + link shaders ───────────────────────────────────────────────
  function makeShader(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  }
  const prog = gl.createProgram();
  gl.attachShader(prog, makeShader(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, makeShader(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const aPos  = gl.getAttribLocation(prog, 'a_pos');
  const aCalm = gl.getAttribLocation(prog, 'a_calm');
  const uRes  = gl.getUniformLocation(prog, 'u_res');
  const uDpr  = gl.getUniformLocation(prog, 'u_dpr');
  gl.uniform2f(uRes, W, H);
  gl.uniform1f(uDpr, dpr);

  // Interleaved: [x, y, calm] per particle
  const STRIDE = 3 * 4;
  const data = new Float32Array(n * 3);

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos,  2, gl.FLOAT, false, STRIDE, 0);
  gl.enableVertexAttribArray(aCalm);
  gl.vertexAttribPointer(aCalm, 1, gl.FLOAT, false, STRIDE, 8);
  gl.bindVertexArray(null);

  // ── Particle state ───────────────────────────────────────────────────────
  const px_   = new Float32Array(n);
  const py_   = new Float32Array(n);
  const vx_   = new Float32Array(n);
  const vy_   = new Float32Array(n);
  const calm_ = new Float32Array(n);
  const evx_  = new Float32Array(n);
  const evy_  = new Float32Array(n);
  const homeX_ = new Float32Array(n);
  const homeY_ = new Float32Array(n);

  const cx0 = W * 0.5, cy0 = H * 0.5;
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = Math.random() * 20;
    px_[i] = cx0 + Math.cos(a) * r;
    py_[i] = cy0 + Math.sin(a) * r;
    const ea = Math.random() * Math.PI * 2;
    const es = 1.5 + Math.random() * 4;
    evx_[i] = Math.cos(ea) * es;
    evy_[i] = Math.sin(ea) * es;
  }

  // Reduced motion: skip entry, show text immediately
  if (prefersReduced) {
    if (textOverlayEl) textOverlayEl.style.opacity = '1';
    // scatter particles across canvas statically
    for (let i = 0; i < n; i++) {
      px_[i] = Math.random() * W;
      py_[i] = Math.random() * H;
    }
  }

  // ── Cursor / sweep state ─────────────────────────────────────────────────
  let curX = -9999, curY = -9999, hasCursor = false;
  let lastCursorMoveAt = 0;
  let sweepPaused = false, sweepStart = 0;
  let resumeTimer = null;
  let maskX = 0, maskY = 0, maskRadius = 0, maskReady = false;
  let homeReady = false;

  function clearMask() {
    if (!textOverlayEl) return;
    textOverlayEl.style.webkitMaskImage = 'none';
    textOverlayEl.style.maskImage = 'none';
  }

  function applyTextState() {
    if (!textOverlayEl) return;
    if (prefersReduced || isPaused) {
      clearMask();
      textOverlayEl.style.opacity = '1';
      return;
    }
    if (maskRadius > 1) {
      const m = `radial-gradient(circle ${maskRadius.toFixed(1)}px at ${maskX.toFixed(1)}px ${maskY.toFixed(1)}px, black 35%, transparent 100%)`;
      textOverlayEl.style.webkitMaskImage = m;
      textOverlayEl.style.maskImage = m;
      if (textOverlayEl.style.opacity !== '1') textOverlayEl.style.opacity = '1';
      return;
    }
    clearMask();
    textOverlayEl.style.opacity = '0';
  }

  function setPaused(nextPaused) {
    isPaused = Boolean(nextPaused);
    hasCursor = false;
    sweepPaused = false;
    clearTimeout(resumeTimer);
    if (isPaused) {
      maskReady = false;
      maskRadius = 0;
      applyTextState();
      return;
    }
    if (!prefersReduced) {
      maskReady = false;
      maskRadius = 0;
      applyTextState();
    }
    sweepStart = Date.now();
  }

  function sweepPos(now) {
    const elapsed = (now - sweepStart) % (SWEEP_MS * 2);
    const raw = elapsed / SWEEP_MS;
    const ping = raw <= 1 ? raw : 2 - raw;
    const x = (easeInOutSine(ping) * (W + ATTRACT_R * 2)) - ATTRACT_R;
    return [x, H * 0.46];
  }

  // ── RAF ──────────────────────────────────────────────────────────────────
  let rafId = null, isVisible = true, isInView = true;
  const startTime = Date.now();
  sweepStart = startTime + ENTRY_MS;

  function frame() {
    rafId = requestAnimationFrame(frame);
    if (!isVisible || !isInView) return;

    const now = Date.now();
    const elapsed = now - startTime;
    const t = elapsed / 1000;
    const entryRaw = Math.min(1, elapsed / ENTRY_MS);
    const entryFactor = prefersReduced ? 0 : 1 - easeOutQuart(entryRaw);
    const cursorActive = !isPaused && hasCursor && now - lastCursorMoveAt < CURSOR_IDLE_MS;
    const restoreHome = homeReady && !isPaused && lastCursorMoveAt > 0 && !cursorActive && now - lastCursorMoveAt >= HOME_RETURN_DELAY;

    // Effective attractor
    let ex, ey, active;
    if (cursorActive) {
      ex = curX; ey = curY; active = true;
    } else if ((!sweepPaused || hasCursor) && !isPaused && !prefersReduced && elapsed > ENTRY_MS) {
      [ex, ey] = sweepPos(now);
      active = true;
    } else {
      ex = -9999; ey = -9999; active = false;
    }

    for (let i = 0; i < n; i++) {
      let x = px_[i], y = py_[i];

      // Entry burst
      if (entryFactor > 0) {
        x += evx_[i] * entryFactor * 3.2;
        y += evy_[i] * entryFactor * 3.2;
      }

      // Flow field drift
      if (!prefersReduced) {
        const fieldScale = 1 - entryFactor * 0.85;
        const [fx, fy] = flowField(x, y, t);
        vx_[i] = vx_[i] * 0.88 + fx * NOISE_SPEED * fieldScale * 0.12;
        vy_[i] = vy_[i] * 0.88 + fy * NOISE_SPEED * fieldScale * 0.12;
      }

      // Attractor spring
      const dx = ex - x, dy = ey - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      let targetCalm = 0;

      if (active && dist < ATTRACT_R) {
        const ratio = 1 - dist / ATTRACT_R;
        targetCalm = ratio * ratio;
        const f = targetCalm * 0.072;
        vx_[i] += dx * f;
        vy_[i] += dy * f;
      }

      // Velocity cap + damping
      vx_[i] *= 0.93;
      vy_[i] *= 0.93;
      const spd = Math.sqrt(vx_[i] ** 2 + vy_[i] ** 2);
      if (spd > 5) { const sc = 5 / spd; vx_[i] *= sc; vy_[i] *= sc; }

      x += vx_[i];
      y += vy_[i];

      if (restoreHome) {
        x += (homeX_[i] - x) * HOME_RETURN_LERP;
        y += (homeY_[i] - y) * HOME_RETURN_LERP;
      }

      // Wrap at edges
      if (x < -60)    x += W + 120;
      if (x > W + 60) x -= W + 120;
      if (y < -60)    y += H + 120;
      if (y > H + 60) y -= H + 120;

      px_[i] = x; py_[i] = y;

      const cs = targetCalm > calm_[i] ? CALM_IN : CALM_OUT;
      calm_[i] = calm_[i] + (targetCalm - calm_[i]) * cs;

      data[i * 3]     = x;
      data[i * 3 + 1] = y;
      data[i * 3 + 2] = calm_[i];
    }

    if (!homeReady && elapsed >= ENTRY_MS) {
      homeX_.set(px_);
      homeY_.set(py_);
      homeReady = true;
    }

    // Radial mask reveal — text materializes only where cursor sweeps
    if (textOverlayEl && !prefersReduced) {
      if (isPaused) {
        applyTextState();
      } else if (cursorActive) {
        if (!maskReady) { maskX = curX; maskY = curY; maskReady = true; }
        maskX += (curX - maskX) * 0.12;
        maskY += (curY - maskY) * 0.12;
        maskRadius += (REVEAL_R - maskRadius) * MASK_LERP_IN;
      } else {
        maskRadius += (0 - maskRadius) * MASK_LERP_OUT;
      }
      applyTextState();
    }

    // Upload + draw
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

  // ── Events ───────────────────────────────────────────────────────────────
  const section = canvas.parentElement;

  function onMouseMove(e) {
    if (isPaused) return;
    const r = canvas.getBoundingClientRect();
    curX = e.clientX - r.left;
    curY = e.clientY - r.top;
    hasCursor = true;
    lastCursorMoveAt = Date.now();
    sweepPaused = true;
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
    const r = canvas.getBoundingClientRect();
    curX = touch.clientX - r.left;
    curY = touch.clientY - r.top;
    hasCursor = true;
    lastCursorMoveAt = Date.now();
    sweepPaused = true;
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
    resizeTimer = setTimeout(() => { resize(true); gl.uniform2f(uRes, W, H); gl.uniform1f(uDpr, dpr); }, 100);
  }

  function onVisibilityChange() { isVisible = !document.hidden; }

  let observer = null;
  if (section && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver(([e]) => { isInView = e.isIntersecting; }, { threshold: 0 });
    observer.observe(section);
  }

  section?.addEventListener('mousemove', onMouseMove);
  section?.addEventListener('mouseleave', onMouseLeave);
  section?.addEventListener('touchmove', onTouchMove, { passive: true });
  section?.addEventListener('touchend', onTouchEnd);
  window.addEventListener('resize', onResize);
  document.addEventListener('visibilitychange', onVisibilityChange);

  rafId = requestAnimationFrame(frame);

  applyTextState();

  return {
    setPaused,
    destroy() {
      cancelAnimationFrame(rafId);
      observer?.disconnect();
      clearTimeout(resumeTimer);
      clearTimeout(resizeTimer);
      section?.removeEventListener('mousemove', onMouseMove);
      section?.removeEventListener('mouseleave', onMouseLeave);
      section?.removeEventListener('touchmove', onTouchMove);
      section?.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
      gl.deleteVertexArray(vao);
    },
  };
}
