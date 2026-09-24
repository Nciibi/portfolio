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

    if (prefersReduced || alreadyBooted) {
      boot.classList.add("is-done");
      setTimeout(() => { if (boot.parentNode) boot.parentNode.removeChild(boot); }, 600);
      return;
    }

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
  }  function initStageScroll() {
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
     SCROLL-SPY + SECTION RAIL + PROGRESS
     ---------------------------------------------------------------------- */
  const SECTION_IDS = ["home", "about", "skills", "projects", "github", "experience", "journey", "contact"];

  function initSpy() {
    const spyLinks = Array.from(document.querySelectorAll("[data-spy]"));
    if (!spyLinks.length) return;

    let current = "home";
    const setActive = (id) => {
      if (id === current) return;
      current = id;
      spyLinks.forEach((l) => l.classList.toggle("active", l.getAttribute("data-spy") === id));
    };

    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean);

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { threshold: [0.2, 0.45, 0.7], rootMargin: "-15% 0px -35% 0px" }
    );
    sections.forEach((s) => io.observe(s));

    // Fallback on scroll for very tall sections
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const header = document.getElementById("hud-top-bar");
        const doc = document.documentElement;
        const max = doc.scrollHeight - window.innerHeight;
        const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
        if (header) header.style.setProperty("--scroll-pct", pct.toFixed(2) + "%");
        checkReveals();
        runMeters();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* -------------------------------------------------------------------------
     MOBILE HUB MENU
     ---------------------------------------------------------------------- */
  function initMobileMenu() {
    const toggle = document.getElementById("menu-toggle");
    const menu = document.getElementById("mobile-menu");
    if (!toggle || !menu) return;

    const close = () => {
      menu.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    };

    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
      if (open && typeof cyberAudio !== "undefined") cyberAudio.playTab();
    });

    menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menu.classList.contains("open")) close();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 992) close();
    });
  }

  /* -------------------------------------------------------------------------
     KEYBOARD NAVIGATION (legend: ↑↓ NAVIGATE / M MENU)
     ---------------------------------------------------------------------- */
  function initKeys() {
    document.addEventListener("keydown", (e) => {
      const t = e.target;
      const typing =
        t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
      if (typing) return;

      if (e.key === "m" || e.key === "M") {
        const toggle = document.getElementById("menu-toggle");
        if (toggle && getComputedStyle(toggle).display !== "none") toggle.click();
        return;
      }

      if (e.key !== "ArrowDown" && e.key !== "ArrowUp" && e.key !== "PageDown" && e.key !== "PageUp")
        return;

      const modal = document.getElementById("gig-modal") || document.getElementById("netlinks");
      if (modal && modal.classList.contains("active")) return;
      const boot = document.getElementById("boot-screen");
      if (boot && !boot.classList.contains("is-done")) return;

      e.preventDefault();
      const forward = e.key === "ArrowDown" || e.key === "PageDown";
      const tops = SECTION_IDS.map((id) => {
        const el = document.getElementById(id);
        return el ? { id, y: el.getBoundingClientRect().top + window.scrollY } : null;
      }).filter(Boolean);

      const y = window.scrollY + 70;
      let idx = tops.findIndex((s, i) =>
        forward ? s.y > y + 40 : i === tops.length - 1 || s.y >= y - 40
      );
      if (!forward) {
        // previous section whose top is above current position
        idx = -1;
        for (let i = tops.length - 1; i >= 0; i--) {
          if (tops[i].y < y - 40) { idx = i; break; }
        }
        if (idx < 0) idx = 0;
      } else {
        if (idx < 0) idx = tops.length - 1;
      }
      const target = document.getElementById(tops[idx].id);
      if (target) target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
    });
  }

  /* -------------------------------------------------------------------------
     INIT
     ---------------------------------------------------------------------- */
  function bootAll() {
    initBoot();
    scanReveals();
    runMeters();
     initSpy();
     initStageScroll();
     initMobileMenu();

     /* Re-check after fonts, images and 3D assets settle. */
    [120, 400, 900, 1600, 2600].forEach((ms) => {
      setTimeout(() => { checkReveals(); runMeters(); }, ms);
    });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => { checkReveals(); runMeters(); });
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
