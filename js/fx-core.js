/* ==========================================================================
   fx-core.js — shared runtime for the NCIIBI_OS visual engine.
   Owns the animation ticker, motion preference, quality tiering, the
   persisted display settings, the text-scramble decoder and FLIP helpers.
   Every other fx module talks to this one.
   ========================================================================== */
(function () {
  "use strict";

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
  const SETTINGS_KEY = "nciibi_fx_settings";

  /* --- Quality tiering -----------------------------------------------------
     Base it on what the machine can actually sustain: pixel throughput
     (viewport x DPR) is the real cost driver for a fullscreen shader. */
  function detectQuality() {
    const cores = navigator.hardwareConcurrency || 4;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const area = window.innerWidth * window.innerHeight;
    const pixels = area * dpr * dpr;
    if (cores <= 2 || pixels > 6.5e6) return "low";
    if (cores <= 4 || pixels > 3.2e6) return "medium";
    return "high";
  }

  /* --- Persisted settings -------------------------------------------------- */
  const defaults = {
    crt: true,
    crtIntensity: 1,
    grain: true,
    scanlines: true,
    glitch: true,
    bloom: true,
    ambient: false,
    quality: "auto"
  };

  const settings = Object.assign({}, defaults);
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) Object.assign(settings, JSON.parse(raw));
  } catch (error) {
    /* storage blocked — defaults are fine */
  }

  let quality = settings.quality === "auto" ? detectQuality() : settings.quality;
  let reduced = motionQuery.matches;

  function persist() {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      /* ignore */
    }
  }

  /* --- Animation ticker ---------------------------------------------------- */
  const tickers = new Set();
  let frameHandle = 0;
  let lastTime = 0;

  function loop(now) {
    const delta = lastTime ? Math.min(now - lastTime, 64) : 16;
    lastTime = now;
    tickers.forEach((fn) => {
      try {
        fn(delta, now);
      } catch (error) {
        console.warn("[fx] ticker error", error);
      }
    });
    frameHandle = tickers.size ? requestAnimationFrame(loop) : 0;
    lastTime = now;
  }

  function onTick(fn) {
    tickers.add(fn);
    if (!frameHandle) {
      lastTime = 0;
      frameHandle = requestAnimationFrame(loop);
    }
    return () => tickers.delete(fn);
  }

  /* --- Motion preference --------------------------------------------------- */
  const motionListeners = new Set();

  function applyMotionState() {
    motionListeners.forEach((fn) => {
      try {
        fn(reduced);
      } catch (error) {
        console.warn("[fx] motion listener error", error);
      }
    });
  }

  function onMotionChange(fn) {
    motionListeners.add(fn);
    fn(reduced);
    return () => motionListeners.delete(fn);
  }

  /* --- Tiny event bus ------------------------------------------------------ */
  const busListeners = new Map();

  function emit(name, detail) {
    const set = busListeners.get(name);
    if (!set) return;
    set.forEach((fn) => {
      try {
        fn(detail);
      } catch (error) {
        console.warn("[fx] bus error", error);
      }
    });
  }

  function on(name, fn) {
    if (!busListeners.has(name)) busListeners.set(name, new Set());
    busListeners.get(name).add(fn);
    return () => busListeners.get(name).delete(fn);
  }

  /* --- Settings application ------------------------------------------------ */
  function applySettings() {
    const root = document.documentElement;
    root.style.setProperty("--fx-crt-intensity", String(settings.crtIntensity));
    root.style.setProperty("--fx-grain-opacity", settings.grain ? "0.05" : "0");
    root.style.setProperty("--fx-scanline-opacity", settings.scanlines ? "0.1" : "0");
    root.style.setProperty("--fx-glitch-enabled", settings.glitch ? "1" : "0");
    root.style.setProperty("--fx-bloom", settings.bloom ? "1" : "0");
    root.classList.toggle("fx-no-glitch", !settings.glitch);
    root.classList.toggle("fx-no-crt", !settings.crt);
    root.classList.toggle("fx-no-bloom", !settings.bloom);
    persist();
  }

  function setSetting(key, value) {
    if (!(key in defaults)) return;
    settings[key] = value;
    if (key === "quality") {
      quality = value === "auto" ? detectQuality() : value;
      emit("quality", quality);
    }
    applySettings();
    emit("settings", settings);
  }

  /* --- Text scramble / decode ---------------------------------------------
     The CP2077 "data resolve" effect: glyphs cycle through a katakana +
     hex charset before locking into the real string. */
  const SCRAMBLE_GLYPHS = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ0123456789ABCDEF<>/\\[]{}=+*#%&$";

  function scramble(element, finalText, options) {
    if (!element) return;
    const opts = Object.assign({ duration: 520, stagger: 18, glyphs: SCRAMBLE_GLYPHS }, options);
    const text = String(finalText == null ? element.textContent : finalText);
    if (reduced || !opts.duration) {
      element.textContent = text;
      return;
    }
    const chars = Array.from(text);
    const total = chars.length;
    const revealStep = Math.max(1, Math.floor(total / 14));
    const started = performance.now();
    let frame = 0;

    function paint(now) {
      const elapsed = now - started;
      const progress = Math.min(1, elapsed / opts.duration);
      let out = "";
      for (let i = 0; i < total; i += 1) {
        const ch = chars[i];
        if (ch === " ") {
          out += " ";
          continue;
        }
        const revealAt = (i * opts.stagger) / Math.max(1, total);
        if (progress * opts.duration >= revealAt + 120) {
          out += ch;
        } else if (progress * opts.duration >= revealAt) {
          out += ch;
        } else {
          const glyph = opts.glyphs[Math.floor(Math.random() * opts.glyphs.length)];
          out += glyph;
        }
      }
      element.textContent = out;
      if (progress < 1) {
        frame = requestAnimationFrame(paint);
      } else {
        element.textContent = text;
        frame = 0;
      }
    }

    if (frame) cancelAnimationFrame(frame);
    frame = requestAnimationFrame(paint);
    void revealStep;
  }

  /* --- FLIP helper ---------------------------------------------------------
     Used by the nav cursor so the bracket morphs between tabs instead of
     teleporting. */
  function fly(elements, mutate, options) {
    const opts = Object.assign({ duration: 320, easing: "cubic-bezier(.16,1,.3,1)" }, options);
    const list = Array.isArray(elements) ? elements : [elements];
    const first = list.map((el) => el.getBoundingClientRect());
    mutate();
    const last = list.map((el) => el.getBoundingClientRect());

    if (reduced) return;

    list.forEach((el, index) => {
      const a = first[index];
      const b = last[index];
      if (!a || !b) return;
      const dx = a.left - b.left;
      const dy = a.top - b.top;
      const sx = a.width / (b.width || 1);
      const sy = a.height / (b.height || 1);
      if (!dx && !dy && Math.abs(sx - 1) < 0.01 && Math.abs(sy - 1) < 0.01) return;
      el.animate(
        [
          { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})` },
          { transform: "translate(0, 0) scale(1, 1)" }
        ],
        { duration: opts.duration, easing: opts.easing, composite: "replace" }
      );
    });
  }

  /* --- Reduced-motion live response ---------------------------------------- */
  function handleMotionChange() {
    reduced = motionQuery.matches;
    applyMotionState();
    emit("motion", reduced);
  }

  if (motionQuery.addEventListener) motionQuery.addEventListener("change", handleMotionChange);
  else motionQuery.addListener(handleMotionChange);

  window.addEventListener("resize", () => {
    if (settings.quality === "auto") {
      const next = detectQuality();
      if (next !== quality) {
        quality = next;
        emit("quality", quality);
      }
    }
  });

  document.addEventListener("visibilitychange", () => {
    emit("visibility", !document.hidden);
  });

  /* --- Public API ---------------------------------------------------------- */
  const FX = {
    get reduced() {
      return reduced;
    },
    get quality() {
      return quality;
    },
    get finePointer() {
      return finePointerQuery.matches;
    },
    get settings() {
      return settings;
    },
    onTick,
    onMotionChange,
    on,
    emit,
    scramble,
    fly,
    setSetting,
    applySettings,
    persist
  };

  window.FX = FX;
  applySettings();
})();
