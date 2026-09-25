/**
 * CYBERPUNK 2077 UI — MOTION & CHROME LAYER
 * Boot sequence, reveal-on-scroll, animated counters/bars,
 * scroll-spy, section rail, scroll progress, mobile hub menu,
 * and keyboard navigation.
 */

(function () {
  "use strict";

  const prefersReduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* -------------------------------------------------------------------------
     BOOT SEQUENCE
     ---------------------------------------------------------------------- */
  function initBoot() {
    const boot = document.getElementById("boot-screen");
    const fill = document.getElementById("boot-fill");
    const log = document.getElementById("boot-log");
    const skip = document.getElementById("boot-skip");
    if (!boot) return;

    let finished = false;
    const requestedBoot = /[?&]boot\b/.test(location.search);
    const alreadyBooted = (() => {
      try {
        if (sessionStorage.getItem("cp_booted") === "1") return true;
        return /[?&]skipboot\b/.test(location.search);
      } catch (e) {
        return /[?&]skipboot\b/.test(location.search);
      }
    })();

    const finish = () => {
      if (finished) return;
      finished = true;
      boot.classList.add("is-done");
      document.body.style.overflow = "";
      try { sessionStorage.setItem("cp_booted", "1"); } catch (e) {}
      setTimeout(() => { if (boot.parentNode) boot.parentNode.removeChild(boot); }, 700);
      window.removeEventListener("keydown", onKey);
    };

    const onKey = (e) => { if (e.key === "Escape") finish(); };

    if (!requestedBoot || prefersReduced || alreadyBooted) {
      if (boot.parentNode) boot.parentNode.removeChild(boot);
      return;
    }

    document.body.classList.add("boot-enabled");
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    if (skip) skip.addEventListener("click", finish);

    const lines = [
      "MOUNTING NEURAL INTERFACE ......... <b>OK</b>",
      "DECRYPTING DOSSIER #77-MIL-8849 ... <b>OK</b>",
      "CALIBRATING KIROSHI OPTICS ........ <b>OK</b>",
      "ESTABLISHING NETWATCH UPLINK ...... <b>SECURE</b>",
      "LOADING USER INTERFACE ............ <b>READY</b>"
    ];

    let pct = 0;
    let li = 0;
    const tick = () => {
      pct = Math.min(100, pct + (6 + Math.random() * 11));
      if (fill) fill.style.width = pct + "%";
      const want = Math.floor((pct / 100) * lines.length);
      while (li < want && li < lines.length) {
        if (log) log.innerHTML += lines[li] + "<br/>";
        li++;
      }
      if (pct >= 100) {
        while (li < lines.length) { if (log) log.innerHTML += lines[li] + "<br/>"; li++; }
        setTimeout(finish, 520);
      } else {
        setTimeout(tick, 130 + Math.random() * 130);
      }
    };
    setTimeout(tick, 240);
  }

  /* -------------------------------------------------------------------------
     REVEAL ON SCROLL
     Rect-based check (robust against late font/image layout shifts),
     with IntersectionObserver as the fast path.
     ---------------------------------------------------------------------- */
  let revealObserver = null;

  function checkReveals() {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    document.querySelectorAll("[data-reveal]:not(.is-in)").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > -40) el.classList.add("is-in");
    });
  }

  function scanReveals() {
    if (prefersReduced) {
      document.querySelectorAll("[data-reveal]").forEach((n) => n.classList.add("is-in"));
      runMeters();
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-in");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
      );
    }
    document.querySelectorAll("[data-reveal]:not(.is-in)").forEach((n) => revealObserver.observe(n));
    checkReveals();
  }

  /* -------------------------------------------------------------------------
     COUNTERS + PROGRESS BARS (fire when their host section is reached)
     ---------------------------------------------------------------------- */
  function animateCount(el) {
    const target = parseFloat(el.getAttribute("data-count"));
    if (isNaN(target)) return;
    if (prefersReduced) { el.textContent = String(target); return; }
    const dur = 1100;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = String(target);
    };
    requestAnimationFrame(step);
  }

  function runMeters() {
    document.querySelectorAll("[data-count]").forEach((el) => {
      if (el.dataset.counted) return;
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.95 && r.bottom > 0) {
        el.dataset.counted = "1";
        animateCount(el);
      }
    });
    document.querySelectorAll("[data-fill]").forEach((el) => {
      if (el.dataset.filled) return;
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.95 && r.bottom > 0) {
        el.dataset.filled = "1";
        el.style.width = el.getAttribute("data-fill") + "%";
      }
    });
  }

  function initStageScroll() {
    const stage = document.querySelector(".menu-stage");
    if (!stage) return;
    let ticking = false;
    stage.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        checkReveals();
        runMeters();
      });
    }, { passive: true });
  }

  /* -------------------------------------------------------------------------
     INIT
     ---------------------------------------------------------------------- */
  function bootAll() {
    initBoot();
    scanReveals();
    runMeters();
    initStageScroll();

    const settle = () => { checkReveals(); runMeters(); };
    window.setTimeout(settle, 900);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(settle);
    }
  }

  /* -------------------------------------------------------------------------
     DEEP-LINK CAPTURE (?goto=section-id) — instant jump, force reveals.
     ---------------------------------------------------------------------- */
  function applyGoto() {
    const m = /[?&]goto=([\w-]+)/.exec(location.search);
    if (!m) return;
    const el = document.getElementById(m[1]);
    if (!el) return;
    if (el.matches("[data-menu-panel]")) return;
    document.documentElement.style.scrollBehavior = "auto";
    el.scrollIntoView({ behavior: "auto", block: "start" });
    // absolute fallback in case smooth scroll raced us
    const y = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, y);
    document.querySelectorAll("[data-reveal]").forEach((n) => n.classList.add("is-in"));
    document.querySelectorAll("[data-count]").forEach((n) => {
      if (!n.dataset.counted) {
        n.dataset.counted = "1";
        n.textContent = n.getAttribute("data-count");
      }
    });
    document.querySelectorAll("[data-fill]").forEach((n) => {
      if (!n.dataset.filled) {
        n.dataset.filled = "1";
        n.style.width = n.getAttribute("data-fill") + "%";
      }
    });
    // second pass after layout settles
    setTimeout(() => {
      window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY);
      checkReveals();
      runMeters();
    }, 250);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootAll);
  } else {
    bootAll();
  }

  // Re-scan after main.js finishes rendering dynamic sections
  document.addEventListener("portfolio:rendered", () => {
    scanReveals();
    runMeters();
    setTimeout(() => { checkReveals(); runMeters(); applyGoto(); }, 80);
  });

  window.addEventListener("load", () => {
    scanReveals();
    runMeters();
    checkReveals();
    applyGoto();
  });

  applyGoto();
})();
