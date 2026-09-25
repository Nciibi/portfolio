(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const stage = document.querySelector(".menu-stage");
  let revealObserver;
  let meterObserver;

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
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = String(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(step);
      else element.textContent = String(target);
    };
    requestAnimationFrame(step);
  }

  function revealAll() {
    document.querySelectorAll("[data-reveal]").forEach((element) => element.classList.add("is-in"));
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
    document.querySelectorAll("[data-reveal]:not(.is-in)").forEach((element) => revealObserver.observe(element));
    document.querySelectorAll("[data-count]:not([data-counted]), [data-fill]:not([data-filled])").forEach((element) => meterObserver.observe(element));
  }

  function init() {
    scan();
    if (document.fonts?.ready) document.fonts.ready.then(scan);
  }

  document.addEventListener("portfolio:rendered", scan);
  window.addEventListener("load", scan);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
