(function () {
  "use strict";

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
  const stage = document.querySelector(".menu-stage");
  const interactiveSelector = ".profile-visual, .btn-cyber, .menu-tab, .chrome-control, .mobile-menu-toggle, .lvl, .exp-tab, .project-card, .dlg-opt, .netlink-btn, .social-link, .gh-repo, .gh-refresh, .option-row";
  const tiltSelector = ".profile-visual, .project-card, .bento-card, .skill-group, .exp-card, .journey-card, .gh-repo";
  let prefersReduced = motionQuery.matches;
  let revealObserver;
  let meterObserver;
  let journeyObserver;
  let hudFrame = 0;
  let pendingPointer = null;
  let reticle;
  let reticleLabel;
  let activeTiltTarget;
  let signalTimer;
  let initialModule = true;

  function animateCount(element) {
    const target = Number.parseFloat(element.getAttribute("data-count"));
    if (Number.isNaN(target)) return;
    if (prefersReduced) {
      element.textContent = String(target);
      return;
    }
    const start = performance.now();
    const duration = 650;
    const step = (now) => {
      if (prefersReduced) {
        element.textContent = String(target);
        return;
      }
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = String(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(step);
      else element.textContent = String(target);
    };
    requestAnimationFrame(step);
  }

  function revealAll() {
    document.querySelectorAll("[data-reveal], .journey-timeline").forEach((element) => element.classList.add("is-in"));
    document.querySelectorAll("[data-count]").forEach((element) => {
      if (element.dataset.counted) return;
      element.dataset.counted = "1";
      animateCount(element);
    });
    document.querySelectorAll("[data-fill]").forEach((element) => {
      if (element.dataset.filled) return;
      element.dataset.filled = "1";
      element.style.width = `${element.getAttribute("data-fill")}%`;
    });
  }

  function scan() {
    if (prefersReduced || typeof IntersectionObserver === "undefined") {
      revealAll();
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          revealObserver.unobserve(entry.target);
        });
      }, { root: stage, threshold: 0.08, rootMargin: "0px 0px -6% 0px" });
    }
    if (!meterObserver) {
      meterObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const element = entry.target;
          if (element.hasAttribute("data-count")) {
            element.dataset.counted = "1";
            animateCount(element);
          }
          if (element.hasAttribute("data-fill")) {
            element.dataset.filled = "1";
            element.style.width = `${element.getAttribute("data-fill")}%`;
          }
          meterObserver.unobserve(element);
        });
      }, { root: stage, threshold: 0.12 });
    }
    if (!journeyObserver) {
      journeyObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          journeyObserver.unobserve(entry.target);
        });
      }, { root: stage, threshold: 0.12 });
    }
    document.querySelectorAll("[data-reveal]:not(.is-in)").forEach((element) => revealObserver.observe(element));
    document.querySelectorAll("[data-count]:not([data-counted]), [data-fill]:not([data-filled])").forEach((element) => meterObserver.observe(element));
    document.querySelectorAll(".journey-timeline:not(.is-in)").forEach((element) => journeyObserver.observe(element));
  }

  function getTargetLabel(target) {
    if (!target) return "TARGET // STANDBY";
    if (target.matches(".profile-visual")) return "OPTICAL FEED // 07";
    const named = target.getAttribute("aria-label") || target.getAttribute("data-hud-label");
    if (named) return `TARGET // ${named.toUpperCase()}`;
    const text = target.querySelector(".pc-title, .tab-label, .bento-title, .sg-head h3, .exp-role, .gh-repo-name")?.textContent || target.textContent || "";
    const clean = text.trim().replace(/\s+/g, " ");
    return `TARGET // ${(clean.slice(0, 24) || "LOCK").toUpperCase()}`;
  }

  function setReticleTarget(target) {
    if (!reticle) return;
    if (!target || prefersReduced) {
      reticle.classList.remove("is-visible");
      return;
    }
    const rect = target.getBoundingClientRect();
    const inset = 4;
    reticle.style.setProperty("--reticle-x", `${Math.max(4, rect.left - inset)}px`);
    reticle.style.setProperty("--reticle-y", `${Math.max(4, rect.top - inset)}px`);
    reticle.style.setProperty("--reticle-width", `${Math.max(0, rect.width + inset * 2)}px`);
    reticle.style.setProperty("--reticle-height", `${Math.max(0, rect.height + inset * 2)}px`);
    if (reticleLabel) reticleLabel.textContent = getTargetLabel(target);
    reticle.classList.add("is-visible");
  }

  function resetTiltTarget(target) {
    if (!target) return;
    target.style.removeProperty("--card-tilt-x");
    target.style.removeProperty("--card-tilt-y");
    target.style.removeProperty("--hero-x");
    target.style.removeProperty("--hero-y");
    target.style.removeProperty("--hero-rotate-x");
    target.style.removeProperty("--hero-rotate-y");
    target.classList.remove("is-pointer");
  }

  function setTiltTarget(nextTarget) {
    if (activeTiltTarget === nextTarget) return;
    resetTiltTarget(activeTiltTarget);
    activeTiltTarget = nextTarget;
    if (!nextTarget || prefersReduced) return;
    nextTarget.classList.add("is-pointer");
  }

  function updateTilt(target, x, y) {
    if (!target || prefersReduced) return;
    if (target.matches(".profile-visual")) {
      const rect = target.getBoundingClientRect();
      const px = (x - rect.left) / rect.width - 0.5;
      const py = (y - rect.top) / rect.height - 0.5;
      target.style.setProperty("--hero-x", `${(px * 8).toFixed(2)}px`);
      target.style.setProperty("--hero-y", `${(py * 8).toFixed(2)}px`);
      target.style.setProperty("--hero-rotate-x", `${(-py * 2.4).toFixed(2)}deg`);
      target.style.setProperty("--hero-rotate-y", `${(px * 3.2).toFixed(2)}deg`);
      return;
    }
    if (!target.matches(tiltSelector)) return;
    const rect = target.getBoundingClientRect();
    const px = (x - rect.left) / rect.width - 0.5;
    const py = (y - rect.top) / rect.height - 0.5;
    target.style.setProperty("--card-tilt-x", `${(-py * 3.2).toFixed(2)}deg`);
    target.style.setProperty("--card-tilt-y", `${(px * 4.2).toFixed(2)}deg`);
  }

  function processPointer() {
    hudFrame = 0;
    if (!pendingPointer || !stage) return;
    const { x, y, target } = pendingPointer;
    pendingPointer = null;
    stage.classList.add("is-pointer-active");
    stage.style.setProperty("--spot-x", `${x}px`);
    stage.style.setProperty("--spot-y", `${y}px`);
    setReticleTarget(target);
    setTiltTarget(target && target.matches(".profile-visual") ? target : target?.closest(tiltSelector));
    updateTilt(target?.matches(".profile-visual") ? target : target?.closest(tiltSelector), x, y);
  }

  function queuePointer(event) {
    const pointerType = event.pointerType || "mouse";
    if (!stage || prefersReduced || (pointerType !== "mouse" && pointerType !== "pen") || (pointerType === "pen" && !finePointerQuery.matches)) return;
    pendingPointer = {
      x: event.clientX,
      y: event.clientY,
      target: event.target instanceof Element ? event.target.closest(interactiveSelector) : null,
    };
    if (!hudFrame) hudFrame = requestAnimationFrame(processPointer);
  }

  function hideHud() {
    if (!stage) return;
    stage.classList.remove("is-pointer-active");
    setReticleTarget(null);
    resetTiltTarget(activeTiltTarget);
    activeTiltTarget = null;
    pendingPointer = null;
    if (hudFrame) cancelAnimationFrame(hudFrame);
    hudFrame = 0;
  }

  function initHud() {
    if (!stage) return;
    reticle = document.createElement("div");
    reticle.className = "hud-reticle";
    reticle.setAttribute("aria-hidden", "true");
    reticle.innerHTML = '<span class="hud-reticle-label">TARGET // STANDBY</span>';
    stage.append(reticle);
    reticleLabel = reticle.querySelector(".hud-reticle-label");
    stage.classList.add("hud-ready");
    stage.addEventListener("pointermove", queuePointer, { passive: true });
    stage.addEventListener("pointerleave", hideHud);
    stage.addEventListener("focusin", (event) => {
      const target = event.target instanceof Element ? event.target.closest(interactiveSelector) : null;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      stage.classList.add("is-pointer-active");
      stage.style.setProperty("--spot-x", `${rect.left + rect.width / 2}px`);
      stage.style.setProperty("--spot-y", `${rect.top + rect.height / 2}px`);
      setReticleTarget(target);
    });
    stage.addEventListener("focusout", (event) => {
      if (event.relatedTarget instanceof Element && stage.contains(event.relatedTarget)) return;
      window.setTimeout(() => {
        if (document.activeElement && stage.contains(document.activeElement)) return;
        hideHud();
      }, 0);
    });
    window.addEventListener("blur", hideHud);
    window.addEventListener("resize", hideHud);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) hideHud();
    });
  }

  function initPanelTitles() {
    document.querySelectorAll(".panel-title").forEach((title) => {
      title.dataset.text = title.textContent.trim().replace(/\s+/g, " ");
    });
  }

  function showModuleSignal(event) {
    if (!stage || prefersReduced) return;
    if (initialModule) {
      initialModule = false;
      return;
    }
    const id = event.detail?.id || "profile";
    stage.querySelector(".module-signal")?.remove();
    window.clearTimeout(signalTimer);
    const signal = document.createElement("div");
    signal.className = "module-signal";
    signal.dataset.label = `SIGNAL // ${id.toUpperCase()}`;
    signal.setAttribute("aria-hidden", "true");
    stage.append(signal);
    requestAnimationFrame(() => signal.classList.add("is-active"));
    signalTimer = window.setTimeout(() => signal.remove(), 520);
  }

  function handleMotionChange() {
    prefersReduced = motionQuery.matches;
    if (prefersReduced || !finePointerQuery.matches) hideHud();
    if (prefersReduced) revealAll();
  }

  function init() {
    initHud();
    initPanelTitles();
    scan();
    if (document.fonts?.ready) document.fonts.ready.then(scan);
  }

  document.addEventListener("portfolio:module-shown", showModuleSignal);
  document.addEventListener("portfolio:rendered", scan);
  window.addEventListener("load", scan);
  if (motionQuery.addEventListener) motionQuery.addEventListener("change", handleMotionChange);
  else motionQuery.addListener(handleMotionChange);
  if (finePointerQuery.addEventListener) finePointerQuery.addEventListener("change", handleMotionChange);
  else finePointerQuery.addListener(handleMotionChange);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
