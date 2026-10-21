/* ==========================================================================
   crt.js — WebGL CRT / phosphor overlay.

   A single fullscreen transparent canvas sits above the DOM and composites
   the physical artefacts of a cathode-ray display:
     · scanlines (with a slight vertical roll)
     · aperture-grille phosphor triad
     · a slow rolling refresh bar
     · animated film grain
     · edge vignette
     · mains flicker
     · a "pulse" channel the glitch engine drives during signal faults

   Everything is drawn as a TRANSLUCENT OVERLAY, not as a filter on the page
   content — the DOM itself is never re-rasterised. The page's own pixels
   are warped only by the SVG filter layer in glitch.js, and only during
   short bursts, so idle cost stays at one cheap fullscreen quad.
   ========================================================================== */
(function () {
  "use strict";

  const VERTEX_SOURCE = [
    "attribute vec2 aPosition;",
    "varying vec2 vUv;",
    "void main() {",
    "  vUv = aPosition * 0.5 + 0.5;",
    "  gl_Position = vec4(aPosition, 0.0, 1.0);",
    "}"
  ].join("\n");

  const FRAGMENT_SOURCE = [
    "precision mediump float;",
    "varying vec2 vUv;",
    "uniform vec2 uResolution;",
    "uniform float uTime;",
    "uniform float uIntensity;",
    "uniform float uPulse;",
    "uniform float uGrain;",
    "uniform float uScanline;",
    "",
    "float hash(vec2 p) {",
    "  p = fract(p * vec2(443.897, 441.423));",
    "  p += dot(p, p + 19.19);",
    "  return fract(p.x * p.y);",
    "}",
    "",
    "void main() {",
    "  vec2 c = vUv - 0.5;",
    "",
    "  /* --- vignette: black over the edges --- */",
    "  float edge = smoothstep(0.32, 0.98, length(c) * 1.34);",
    "  float vigA = edge * 0.58 * uIntensity;",
    "  vec3 col = vec3(0.0);",
    "  float alpha = vigA;",
    "",
    "  /* --- scanlines: soft black bands, slowly rolling --- */",
    "  float roll = uTime * 0.09;",
    "  float s = 0.5 + 0.5 * sin((vUv.y + roll) * uResolution.y * 1.42);",
    "  float scanA = (1.0 - s) * uScanline * uIntensity;",
    "  col = col * (1.0 - scanA);",
    "  alpha = scanA + alpha * (1.0 - scanA);",
    "",
    "  /* --- rolling refresh bar --- */",
    "  float barY = fract(uTime * 0.048 + 0.15);",
    "  float d = abs(vUv.y - barY);",
    "  d = min(d, 1.0 - d);",
    "  float bar = smoothstep(0.10, 0.0, d) * (0.028 + uPulse * 0.13);",
    "  float barA = bar * uIntensity;",
    "  col = vec3(0.42, 0.92, 1.0) * barA + col * (1.0 - barA);",
    "  alpha = barA + alpha * (1.0 - barA);",
    "",
    "  /* --- aperture grille: faint RGB triads --- */",
    "  float triad = vUv.x * uResolution.x * 3.14159265 / 1.6;",
    "  vec3 mask = 0.5 + 0.5 * cos(triad + vec3(0.0, 2.0944, 4.1888));",
    "  float maskA = 0.030 * uIntensity;",
    "  col = mask * maskA + col * (1.0 - maskA);",
    "  alpha = maskA + alpha * (1.0 - maskA);",
    "",
    "  /* --- film grain --- */",
    "  float n = hash(vUv * uResolution * 0.63 + fract(uTime) * 131.7);",
    "  float grainA = uGrain * (0.35 + n * 0.65) * uIntensity;",
    "  col = vec3(n * 0.92, n * 0.96, n) * grainA + col * (1.0 - grainA);",
    "  alpha = grainA + alpha * (1.0 - grainA);",
    "",
    "  /* --- mains flicker --- */",
    "  float flick = 1.0 + (hash(vec2(floor(uTime * 13.0), 3.7)) - 0.5) * 0.11 * uIntensity;",
    "  col *= flick;",
    "  alpha *= flick;",
    "",
    "  /* --- signal fault: horizontal tear bands driven by the glitch engine --- */",
    "  if (uPulse > 0.001) {",
    "    float tearBand = step(0.965 - uPulse * 0.22, hash(vec2(floor(vUv.y * 46.0), floor(uTime * 22.0))));",
    "    float tearA = tearBand * uPulse * 0.5;",
    "    col = vec3(1.0, 0.16, 0.42) * tearA + col * (1.0 - tearA);",
    "    alpha = tearA + alpha * (1.0 - tearA);",
    "  }",
    "",
    "  gl_FragColor = vec4(col, alpha);",
    "}"
  ].join("\n");

  const MAX_PIXELS = { high: 4.2e6, medium: 2.1e6, low: 1.1e6 };
  const DPR_CAP = { high: 1.75, medium: 1.25, low: 1 };

  function compile(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn("[crt] shader compile failed:", gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  function createProgram(gl) {
    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX_SOURCE);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SOURCE);
    if (!vs || !fs) return null;
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn("[crt] program link failed:", gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }
    return program;
  }

  const CRT = {
    canvas: null,
    gl: null,
    program: null,
    ready: false,
    enabled: true,
    pulseValue: 0,
    pulseTarget: 0,
    pulseDecay: 1,
    uniforms: {},
    _ticker: null,
    _startTime: 0,
    _renderScale: 1
  };

  function resolveScale(quality) {
    const cap = DPR_CAP[quality] || DPR_CAP.medium;
    const budget = MAX_PIXELS[quality] || MAX_PIXELS.medium;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const wanted = Math.min(window.devicePixelRatio || 1, cap);
    let scale = wanted;
    const pixels = w * h * scale * scale;
    if (pixels > budget) scale = Math.max(0.5, Math.sqrt(budget / (w * h)));
    return scale;
  }

  function resize() {
    if (!CRT.gl) return;
    const quality = (window.FX && window.FX.quality) || "medium";
    const scale = resolveScale(quality);
    const w = Math.max(1, Math.round(window.innerWidth * scale));
    const h = Math.max(1, Math.round(window.innerHeight * scale));
    if (CRT.canvas.width !== w || CRT.canvas.height !== h) {
      CRT.canvas.width = w;
      CRT.canvas.height = h;
      CRT._renderScale = scale;
    }
    CRT.gl.viewport(0, 0, w, h);
  }

  function init() {
    if (CRT.ready) return CRT.ready;
    if (!window.FX) return null;
    if (window.FX.reduced) return null;
    if (window.FX.quality === "low" && window.FX.settings.quality === "low") {
      document.documentElement.classList.add("fx-crt-css-only");
      return null;
    }

    const canvas = document.createElement("canvas");
    canvas.className = "crt-overlay";
    canvas.setAttribute("aria-hidden", "true");
    document.body.appendChild(canvas);
    CRT.canvas = canvas;

    let gl = null;
    try {
      gl =
        canvas.getContext("webgl", {
          alpha: true,
          premultipliedAlpha: true,
          antialias: false,
          depth: false,
          stencil: false,
          preserveDrawingBuffer: false,
          powerPreference: "low-power"
        }) ||
        canvas.getContext("experimental-webgl", { alpha: true, premultipliedAlpha: true });
    } catch (error) {
      console.warn("[crt] context unavailable", error);
    }

    if (!gl) {
      document.documentElement.classList.add("fx-crt-css-only");
      canvas.remove();
      CRT.canvas = null;
      return null;
    }

    const program = createProgram(gl);
    if (!program) {
      document.documentElement.classList.add("fx-crt-css-only");
      canvas.remove();
      CRT.canvas = null;
      return null;
    }

    CRT.gl = gl;
    CRT.program = program;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    CRT.uniforms = {
      resolution: gl.getUniformLocation(program, "uResolution"),
      time: gl.getUniformLocation(program, "uTime"),
      intensity: gl.getUniformLocation(program, "uIntensity"),
      pulse: gl.getUniformLocation(program, "uPulse"),
      grain: gl.getUniformLocation(program, "uGrain"),
      scanline: gl.getUniformLocation(program, "uScanline")
    };

    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    canvas.addEventListener("webglcontextlost", (event) => {
      event.preventDefault();
      CRT.ready = false;
      if (CRT._ticker) {
        CRT._ticker();
        CRT._ticker = null;
      }
    });

    CRT.ready = true;
    resize();
    window.addEventListener("resize", resize, { passive: true });
    return CRT;
  }

  function render(now) {
    const gl = CRT.gl;
    if (!gl || !CRT.ready) return;
    const settings = window.FX ? window.FX.settings : { crtIntensity: 1, grain: true, scanlines: true, crt: true };

    CRT.pulseValue += (CRT.pulseTarget - CRT.pulseValue) * 0.22;
    CRT.pulseTarget *= CRT.pulseDecay;
    if (CRT.pulseTarget < 0.001) CRT.pulseTarget = 0;

    const time = (now - CRT._startTime) / 1000;
    gl.uniform2f(CRT.uniforms.resolution, CRT.canvas.width, CRT.canvas.height);
    gl.uniform1f(CRT.uniforms.time, time);
    gl.uniform1f(CRT.uniforms.intensity, settings.crt ? settings.crtIntensity : 0);
    gl.uniform1f(CRT.uniforms.pulse, CRT.pulseValue);
    gl.uniform1f(CRT.uniforms.grain, settings.grain ? 0.055 : 0);
    gl.uniform1f(CRT.uniforms.scanline, settings.scanlines ? 0.11 : 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function start() {
    if (CRT._ticker) return;
    if (!init()) return;
    CRT._startTime = performance.now();
    CRT._ticker = window.FX.onTick((delta, now) => render(now));
  }

  function stop() {
    if (CRT._ticker) {
      CRT._ticker();
      CRT._ticker = null;
    }
  }

  /* Public: drive a signal fault. `strength` 0..1, decays over `duration` ms. */
  function pulse(strength, duration) {
    if (!CRT.ready) return;
    const amount = Math.max(0, Math.min(1, strength || 0.4));
    CRT.pulseTarget = Math.max(CRT.pulseTarget, amount);
    CRT.pulseDecay = Math.pow(0.02, 1 / Math.max(120, duration || 420));
  }

  function setEnabled(on) {
    CRT.enabled = Boolean(on);
    if (!CRT.canvas) return;
    CRT.canvas.style.display = on ? "block" : "none";
    if (on) start();
  }

  function destroy() {
    stop();
    if (CRT.canvas) {
      CRT.canvas.remove();
      CRT.canvas = null;
    }
    CRT.ready = false;
  }

  /* React to page visibility: a backgrounded tab should not burn GPU. */
  document.addEventListener("visibilitychange", () => {
    if (!CRT.ready) return;
    if (document.hidden) stop();
    else if (CRT.enabled) start();
  });

  if (window.FX) {
    window.FX.on("settings", (settings) => {
      if (!CRT.canvas) return;
      if (!settings.crt) {
        CRT.canvas.style.display = "none";
      } else {
        CRT.canvas.style.display = "block";
        pulse(0.3, 260);
      }
    });
  }

  window.CRT = { init, start, stop, pulse, setEnabled, destroy, get ready() { return CRT.ready; } };
})();
