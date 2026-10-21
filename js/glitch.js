/* ==========================================================================
   glitch.js — signal-fault engine.

   Two cooperating techniques:

   1. SVG FILTER (the expensive one, used only during short bursts)
      A filter graph is built in the DOM and attached to the menu stage:
        feTurbulence  -> coherent noise field
        feDisplacementMap -> real horizontal/vertical tearing of the DOM
        feColorMatrix + feOffset + feBlend(screen) -> true RGB channel split
      The displacement scale and channel offsets are driven from JS every
      frame with STEPPED random values, so the fault reads as digital
      corruption rather than a smooth wobble.

   2. CSS TEAR LAYERS (the cheap one, used for the rest)
      Horizontal slice bands and chromatic text shadows handled purely in
      CSS via classes, so hover-level faults cost nothing.

   The SVG filter is attached only while a burst is active, so the idle
   cost of the page is unchanged.
   ========================================================================== */
(function () {
  "use strict";

  const FILTER_ID = "fx-glitch";

  const FILTER_MARKUP = [
    '<svg class="fx-defs" aria-hidden="true" focusable="false" width="0" height="0">',
    "<defs>",
    '<filter id="' + FILTER_ID + '" x="-12%" y="-12%" width="124%" height="124%" color-interpolation-filters="sRGB">',
    '<feTurbulence id="fx-noise" type="fractalNoise" baseFrequency="0.021 0.085" numOctaves="1" seed="11" result="noise"/>',
    '<feDisplacementMap id="fx-displace" in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" result="disp"/>',
    '<feColorMatrix id="fx-m-red" in="disp" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r"/>',
    '<feColorMatrix id="fx-m-green" in="disp" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g"/>',
    '<feColorMatrix id="fx-m-blue" in="disp" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b"/>',
    '<feOffset id="fx-off-red" in="r" dx="0" dy="0" result="ro"/>',
    '<feOffset id="fx-off-blue" in="b" dx="0" dy="0" result="bo"/>',
    '<feBlend id="fx-blend-rg" in="ro" in2="g" mode="screen" result="rg"/>',
    '<feBlend id="fx-blend-rgb" in="rg" in2="bo" mode="screen"/>',
    "</filter>",
    "</defs>",
    "</svg>"
  ].join("");

  const Glitch = {
    _defs: null,
    _displace: null,
    _offRed: null,
    _offBlue: null,
    _target: null,
    _active: false,
    _ticker: null,
    _timeout: 0
  };

  function ensureDefs() {
    if (Glitch._defs) return true;
    if (!document.body) return false;
    const host = document.createElement("div");
    host.innerHTML = FILTER_MARKUP;
    const svg = host.firstElementChild;
    document.body.appendChild(svg);
    Glitch._defs = svg;
    Glitch._displace = svg.querySelector("#fx-displace");
    Glitch._offRed = svg.querySelector("#fx-off-red");
    Glitch._offBlue = svg.querySelector("#fx-off-blue");
    return Boolean(Glitch._displace);
  }

  function settings() {
    return window.FX ? window.FX.settings : { glitch: true, crtIntensity: 1 };
  }

  function enabled() {
    if (!window.FX) return false;
    if (window.FX.reduced) return false;
    if (!settings().glitch) return false;
    return true;
  }

  /* --- The burst -----------------------------------------------------------
     options: { intensity 0..1, duration ms, target element, type } */
  function burst(options) {
    const opts = Object.assign({ intensity: 0.55, duration: 320, target: null, type: "signal" }, options);
    if (!enabled()) return;

    const target = opts.target || document.querySelector(".menu-stage");
    if (!target) return;

    if (!ensureDefs()) return;

    const start = performance.now();
    const duration = Math.max(90, opts.duration);
    const peak = Math.max(0, Math.min(1, opts.intensity));
    let seeded = false;

    Glitch._target = target;
    Glitch._active = true;
    target.classList.add("is-glitching");
    target.style.filter = "url(#" + FILTER_ID + ")";

    if (window.CRT && window.CRT.ready) {
      window.CRT.pulse(peak * 0.9, duration);
    }

    const stop = window.FX.onTick((delta, now) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);

      /* Stepped randomness: hold each fault value for ~45ms so the eye
         reads discrete corruption frames rather than a smooth wobble. */
      const step = Math.floor(elapsed / 45);
      if (!seeded || step !== Glitch._lastStep) {
        Glitch._lastStep = step;
        const decay = 1 - t;
        const spike = (0.35 + Math.random() * 0.65) * peak * decay;
        const shear = Math.round((Math.random() * 2 - 1) * 26 * spike);
        const lift = Math.round((Math.random() * 2 - 1) * 9 * spike);

        Glitch._displace.setAttribute("scale", (spike * 42).toFixed(2));
        Glitch._offRed.setAttribute("dx", String(-shear));
        Glitch._offRed.setAttribute("dy", String(lift));
        Glitch._offBlue.setAttribute("dx", String(shear));
        Glitch._offBlue.setAttribute("dy", String(-lift));
      }

      if (t >= 1) finish();
    });

    Glitch._ticker = stop;

    function finish() {
      if (!Glitch._active) return;
      Glitch._active = false;
      if (Glitch._ticker) {
        Glitch._ticker();
        Glitch._ticker = null;
      }
      if (Glitch._target) {
        Glitch._target.style.filter = "";
        Glitch._target.classList.remove("is-glitching");
      }
      Glitch._displace.setAttribute("scale", "0");
      Glitch._offRed.setAttribute("dx", "0");
      Glitch._offRed.setAttribute("dy", "0");
      Glitch._offBlue.setAttribute("dx", "0");
      Glitch._offBlue.setAttribute("dy", "0");
    }
  }

  /* --- Cheap CSS-only faults ------------------------------------------------
     Used for hover and focus feedback where a full filter pass would be
     wasteful. */
  function shake(element, className, duration) {
    if (!element || !enabled()) return;
    const name = className || "fx-shake";
    element.classList.remove(name);
    void element.offsetWidth;
    element.classList.add(name);
    window.setTimeout(() => element.classList.remove(name), duration || 260);
  }

  window.Glitch = { burst, shake, ensureDefs, get active() { return Glitch._active; } };

  /* React to a settings change: cancel any running burst cleanly. */
  if (window.FX) {
    window.FX.on("settings", (state) => {
      if (!state.glitch && Glitch._active) {
        if (Glitch._ticker) {
          Glitch._ticker();
          Glitch._ticker = null;
        }
        if (Glitch._target) {
          Glitch._target.style.filter = "";
          Glitch._target.classList.remove("is-glitching");
        }
        Glitch._active = false;
        if (Glitch._displace) Glitch._displace.setAttribute("scale", "0");
      }
    });
  }
})();
