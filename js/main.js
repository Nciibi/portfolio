const renderedModules = new Set(["profile"]);
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

function prefersReducedMotion() {
  return motionPreference.matches;
}

document.addEventListener("DOMContentLoaded", () => {
  renderHeroSocials();
  renderStats();
  renderBento();
  renderEducation();
  initMenuTabs();
  initMobileMenu();
  initAudioEvents();
  initInterfaceControls();
  initDialogueOptions();
  document.dispatchEvent(new Event("portfolio:rendered"));
});

function ensureModuleRendered(id) {
  if (renderedModules.has(id)) return;
  renderedModules.add(id);
  if (id === "projects") renderProjects();
  if (id === "skills") renderSkills();
  if (id === "experience") {
    initExpTabs();
    renderExperience(activeExpTab);
  }
  if (id === "journey") renderJourney();
  if (id === "contact") renderNetlinks();
}

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function safeHref(value) {
  const href = String(value || "");
  return /^(https?:|mailto:|#)/i.test(href) ? escapeHtml(href) : "#";
}

function getIcon(name) {
  const slugs = typeof ICON_SLUGS !== "undefined" ? ICON_SLUGS : null;
  const slug = slugs && name ? slugs[name] || name : name;
  return typeof icon === "function" && slug ? icon(slug) : "";
}

function renderHeroSocials() {
  const wrap = document.getElementById("hero-socials");
  if (!wrap || !PORTFOLIO_DATA.profile?.socials) return;
  wrap.innerHTML = PORTFOLIO_DATA.profile.socials.map((social) => `
    <a class="social-link" href="${safeHref(social.url)}" target="_blank" rel="noopener">${getIcon(social.name || social.icon)}<span>${escapeHtml(social.name)}</span></a>
  `).join("");
}

function renderStats() {
  const wrap = document.getElementById("stat-strip");
  if (!wrap || !PORTFOLIO_DATA.stats) return;
  wrap.innerHTML = PORTFOLIO_DATA.stats.map((stat, index) => `
    <div class="stat-cell" data-reveal style="--d:${(index * 0.06).toFixed(2)}s">
      <div><span class="stat-num" data-count="${Number(stat.value) || 0}">0</span>${stat.suffix ? `<span class="stat-suffix">${escapeHtml(stat.suffix)}</span>` : ""}</div>
      <div class="stat-label">${escapeHtml(stat.label)}</div>
    </div>
  `).join("");
}

function renderBento() {
  const wrap = document.getElementById("bento-container");
  if (!wrap || !PORTFOLIO_DATA.about) return;
  wrap.innerHTML = PORTFOLIO_DATA.about.map((item, index) => {
    const tags = (item.tags || []).map((tag) => `<span class="bento-tag">${getIcon(tag)}${escapeHtml(tag)}</span>`).join("");
    return `
      <article class="bento-card span-${escapeHtml(item.span || "normal")}" data-reveal style="--d:${(index * 0.05).toFixed(2)}s">
        <div class="bento-kicker">${escapeHtml(item.kicker)}</div>
        <h3 class="bento-title">${escapeHtml(item.title)}</h3>
        ${item.body ? `<p class="bento-body">${escapeHtml(item.body)}</p>` : ""}
        ${tags ? `<div class="bento-tags">${tags}</div>` : ""}
      </article>
    `;
  }).join("");
}

function renderEducation() {
  const wrap = document.getElementById("edu-container");
  if (!wrap || !PORTFOLIO_DATA.education) return;
  wrap.innerHTML = PORTFOLIO_DATA.education.map((item, index) => `
    <article class="edu-card" data-reveal style="--d:${(0.2 + index * 0.06).toFixed(2)}s">
      <div class="edu-top"><h4>${escapeHtml(item.title)}</h4><span class="edu-score">${escapeHtml(item.score)}</span></div>
      <div class="edu-period">${escapeHtml(item.period)}</div>
      <p class="edu-org">${escapeHtml(item.org)}</p>
    </article>
  `).join("");
}

let activeSkillLevel = "PROFICIENT";

function renderSkills() {
  const wrap = document.getElementById("skills-container");
  if (!wrap || !PORTFOLIO_DATA.skills) return;
  wrap.innerHTML = PORTFOLIO_DATA.skills.map((group, index) => {
    const hidden = group.level !== activeSkillLevel ? " hidden" : "";
    const chips = group.items.map((skill, chipIndex) => `<span class="skill-chip" data-reveal style="--d:${(chipIndex * 0.035).toFixed(2)}s">${getIcon(skill)}${escapeHtml(skill)}</span>`).join("");
    return `
      <article class="skill-group${hidden}" data-level="${escapeHtml(group.level)}" data-reveal aria-hidden="${hidden ? "true" : "false"}"${hidden ? " inert" : ""} style="--d:${(index * 0.06).toFixed(2)}s">
        <div class="sg-head"><span class="sg-level lvl-${escapeHtml(group.level.toLowerCase())}">${escapeHtml(group.level)}</span><h3>${escapeHtml(group.category)}</h3></div>
        <p class="sg-desc">${escapeHtml(group.desc)}</p>
        <div class="sg-chips">${chips}</div>
      </article>
    `;
  }).join("");
  initSkillLevels();
}

function initSkillLevels() {
  const buttons = Array.from(document.querySelectorAll(".skill-levels .lvl"));
  buttons.forEach((button, index) => button.setAttribute("tabindex", index === 0 ? "0" : "-1"));
  buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
      activeSkillLevel = button.getAttribute("data-level") || "PROFICIENT";
      buttons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
        item.setAttribute("tabindex", active ? "0" : "-1");
      });
      document.querySelectorAll(".skill-group").forEach((group) => {
        const visible = group.getAttribute("data-level") === activeSkillLevel;
        group.classList.toggle("hidden", !visible);
        group.setAttribute("aria-hidden", String(!visible));
        group.inert = !visible;
        if (visible) {
          group.classList.remove("is-entering");
          window.requestAnimationFrame(() => group.classList.add("is-entering"));
        }
      });
      try { cyberAudio.playTab(); } catch (error) {}
      document.dispatchEvent(new Event("portfolio:rendered"));
    });
    button.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === "ArrowLeft") next = (index - 1 + buttons.length) % buttons.length;
      if (event.key === "ArrowRight") next = (index + 1) % buttons.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = buttons.length - 1;
      buttons[next].click();
      buttons[next].focus();
    });
  });
}

const projectArtworkMap = Object.freeze({
  "gh-seagles": "assets/proj-netrunner.webp",
  "gh-m2m": "assets/proj-citymap.webp",
  "gh-aios": "assets/proj-neural.webp",
  "gh-hider": "assets/proj-netrunner.webp",
});

function projectArtwork(project) {
  const mapped = project?.id ? projectArtworkMap[project.id] : "";
  if (mapped) return mapped;
  const category = String(project?.category || "").toLowerCase();
  if (category.includes("ai")) return "assets/proj-neural.webp";
  if (category.includes("p2p") || category.includes("security")) return "assets/proj-netrunner.webp";
  return "assets/proj-citymap.webp";
}

function projectVisualMarkup(project) {
  const artwork = escapeHtml(projectArtwork(project));
  return `<div class="project-detail-visual" style="background-image: linear-gradient(180deg, rgba(8, 10, 15, 0.08), rgba(8, 10, 15, 0.92)), url('${artwork}')"></div>`;
}

function projectCopyMarkup(project) {
  const tags = (project.tags || []).map((tag) => `<span class="gig-tag">${getIcon(tag)}${escapeHtml(tag)}</span>`).join("");
  return `
    <div class="project-detail-copy">
      <div class="project-detail-meta"><span>${escapeHtml(project.period)}</span><span>${escapeHtml(project.category)}</span></div>
      <h3>${escapeHtml(project.title)}</h3>
      <p>${escapeHtml(project.summary)}</p>
      <div class="gig-tags">${tags}</div>
      <a class="btn-cyber btn-cyber-sm btn-cyber-red" href="${safeHref(project.url)}" target="_blank" rel="noopener">OPEN CASE FILE <span aria-hidden="true">↗</span></a>
    </div>
  `;
}

function renderProjects() {
  const wrap = document.getElementById("projects-container");
  const detail = document.getElementById("project-detail");
  const initialProject = PORTFOLIO_DATA.projects?.[0];
  if (!wrap || !detail || !initialProject) return;
  detail.innerHTML = `<div class="project-detail-media-stack"><div class="project-detail-layer is-current">${projectVisualMarkup(initialProject)}</div></div>${projectCopyMarkup(initialProject)}`;
  const mediaStack = detail.querySelector(".project-detail-media-stack");
  let activeProjectId = initialProject.id;
  let transitionToken = 0;

  const selectProject = (id) => {
    const project = PORTFOLIO_DATA.projects.find((item) => item.id === id) || initialProject;
    if (!project) return;
    wrap.querySelectorAll(".project-select").forEach((card) => {
      const active = card.getAttribute("data-project-id") === project.id;
      card.classList.toggle("selected", active);
      card.setAttribute("aria-selected", String(active));
      card.setAttribute("tabindex", active ? "0" : "-1");
    });
    if (activeProjectId === project.id) {
      transitionToken += 1;
      mediaStack.querySelectorAll(".project-detail-layer:not(.is-current)").forEach((layer) => layer.remove());
      mediaStack.classList.remove("is-switching");
      detail.setAttribute("aria-busy", "false");
      return;
    }
    const token = ++transitionToken;
    detail.setAttribute("aria-busy", "true");
    let committed = false;
    const nextLayer = document.createElement("div");
    nextLayer.className = "project-detail-layer is-next";
    nextLayer.innerHTML = projectVisualMarkup(project);
    const nextCopy = document.createElement("div");
    nextCopy.innerHTML = projectCopyMarkup(project);
    nextCopy.firstElementChild.classList.add("is-entering");
    const commit = () => {
      if (committed || token !== transitionToken) return;
      committed = true;
      const currentLayer = mediaStack.querySelector(".project-detail-layer.is-current");
      mediaStack.querySelectorAll(".project-detail-layer:not(.is-current)").forEach((layer) => layer.remove());
      mediaStack.classList.add("is-switching");
      mediaStack.append(nextLayer);
      nextLayer.classList.add("is-visible");
      detail.querySelector(".project-detail-copy")?.remove();
      detail.append(nextCopy.firstElementChild);
      activeProjectId = project.id;
      if (window.innerWidth <= 1050) {
        const reduced = prefersReducedMotion();
        window.requestAnimationFrame(() => detail.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "nearest" }));
      }
      const settle = () => {
        if (token !== transitionToken) return;
        currentLayer?.remove();
        nextLayer.classList.remove("is-visible");
        nextLayer.classList.add("is-current");
        mediaStack.classList.remove("is-switching");
      };
      if (prefersReducedMotion()) settle();
      else window.setTimeout(settle, 300);
    };
    const image = new Image();
    image.decoding = "async";
    image.src = projectArtwork(project);
    if (typeof image.decode === "function") image.decode().then(commit).catch(commit);
    else {
      image.onload = commit;
      image.onerror = commit;
    }
  };

  wrap.innerHTML = PORTFOLIO_DATA.projects.map((project, index) => {
    const tags = (project.tags || []).map((tag) => `<span class="gig-tag">${getIcon(tag)}${escapeHtml(tag)}</span>`).join("");
    const idx = String(index + 1).padStart(2, "0");
    return `
      <article class="project-card project-select${index === 0 ? " selected" : ""}" data-project-id="${escapeHtml(project.id)}" data-hud-label="${escapeHtml(project.title)}" data-reveal style="--d:${(index * 0.07).toFixed(2)}s" role="option" aria-selected="${index === 0}" tabindex="${index === 0 ? 0 : -1}">
        <div class="pc-meta"><span class="pc-idx">${idx}</span><span class="pc-period">${escapeHtml(project.period)}</span><span class="pc-cat">${escapeHtml(project.category)}</span></div>
        <h3 class="pc-title">${escapeHtml(project.title)}</h3>
        <p class="pc-summary">${escapeHtml(project.summary)}</p>
        <div class="pc-footer"><div class="gig-tags">${tags}</div><div class="pc-actions"><span class="pc-likes">♥ ${Number(project.likes) || 0}</span><a class="btn-cyber btn-cyber-sm btn-cyber-ghost" href="${safeHref(project.url)}" target="_blank" rel="noopener">OPEN FILE <span aria-hidden="true">↗</span></a></div></div>
      </article>
    `;
  }).join("");
  wrap.querySelectorAll(".project-select").forEach((card) => {
    const choose = (event) => {
      if (event.target.closest("a")) return;
      selectProject(card.getAttribute("data-project-id"));
    };
    card.addEventListener("click", choose);
    card.addEventListener("keydown", (event) => {
      if (event.target.closest("a")) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectProject(card.getAttribute("data-project-id"));
        return;
      }
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
      event.preventDefault();
      const cards = Array.from(wrap.querySelectorAll(".project-select"));
      const index = cards.indexOf(card);
      const next = event.key === "ArrowDown"
        ? Math.min(cards.length - 1, index + 1)
        : Math.max(0, index - 1);
      cards[next].focus();
      selectProject(cards[next].getAttribute("data-project-id"));
    });
  });
}

let activeExpTab = "CAREER";

function initExpTabs() {
  const buttons = Array.from(document.querySelectorAll(".exp-tab"));
  buttons.forEach((button, index) => button.setAttribute("tabindex", index === 0 ? "0" : "-1"));
  buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
      activeExpTab = button.getAttribute("data-tab") || "CAREER";
      buttons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-selected", String(active));
        item.setAttribute("tabindex", active ? "0" : "-1");
      });
      renderExperience(activeExpTab);
      try { cyberAudio.playTab(); } catch (error) {}
    });
    button.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === "ArrowLeft") next = (index - 1 + buttons.length) % buttons.length;
      if (event.key === "ArrowRight") next = (index + 1) % buttons.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = buttons.length - 1;
      buttons[next].click();
      buttons[next].focus();
    });
  });
}

function renderExperience(tab) {
  const wrap = document.getElementById("experience-panel");
  if (!wrap || !PORTFOLIO_DATA.experience) return;
  const rows = PORTFOLIO_DATA.experience.filter((item) => item.tab === tab);
  if (!rows.length) {
    wrap.innerHTML = '<div class="exp-empty">NO RECORDS FOR THIS CHANNEL</div>';
    return;
  }
  wrap.innerHTML = rows.map((item, index) => `
    <article class="exp-card" data-reveal style="--d:${(index * 0.07).toFixed(2)}s">
      <div class="exp-period">${escapeHtml(item.period)}</div>
      <h3 class="exp-role">${escapeHtml(item.role)}</h3>
      <div class="exp-org">${escapeHtml(item.org)}</div>
      <p class="exp-desc">${escapeHtml(item.desc)}</p>
      ${item.likes ? `<span class="pc-likes">♥ ${Number(item.likes) || 0}</span>` : ""}
    </article>
  `).join("");
  wrap.classList.remove("is-refreshing");
  void wrap.offsetWidth;
  wrap.classList.add("is-refreshing");
  document.dispatchEvent(new Event("portfolio:rendered"));
}

function renderJourney() {
  const wrap = document.getElementById("journey-container");
  if (!wrap || !PORTFOLIO_DATA.journey) return;
  wrap.innerHTML = PORTFOLIO_DATA.journey.map((item, index) => {
    const list = (item.list || []).map((entry) => `<li>${escapeHtml(entry)}</li>`).join("");
    return `
      <article class="journey-item" data-reveal style="--d:${(index * 0.07).toFixed(2)}s">
        <div class="journey-year"><span class="jy-label">${escapeHtml(item.year)}</span></div>
        <div class="journey-card"><p class="jy-text">${escapeHtml(item.text)}</p>${list ? `<ul class="jy-list">${list}</ul>` : ""}</div>
      </article>
    `;
  }).join("");
}

function renderNetlinks() {
  const wrap = document.getElementById("netlinks-container");
  if (!wrap || !PORTFOLIO_DATA.contact?.channels) return;
  wrap.innerHTML = PORTFOLIO_DATA.contact.channels.map((channel) => `
    <a class="netlink-btn" href="${safeHref(channel.url)}" target="_blank" rel="noopener">${getIcon(channel.name.toLowerCase() || channel.icon)}<span>${escapeHtml(channel.name)}</span><span class="hint">${escapeHtml(channel.hint || "OPEN")}</span></a>
  `).join("");
}

function initMenuTabs() {
  const tabs = Array.from(document.querySelectorAll("[data-menu-tab]"));
  const panels = Array.from(document.querySelectorAll("[data-menu-panel]"));
  const validIds = new Set(tabs.map((tab) => tab.getAttribute("data-menu-tab")));
  const stage = document.querySelector(".menu-stage");
  let activeId = "profile";

  const activate = (id, focusTab = false, updateHash = true) => {
    if (!validIds.has(id)) id = "profile";
    activeId = id;
    const focusedPanel = document.activeElement?.closest?.("[data-menu-panel]");
    tabs.forEach((tab) => {
      const active = tab.getAttribute("data-menu-tab") === id;
      tab.classList.toggle("active", active);
      if (active) {
        tab.setAttribute("aria-current", "page");
        tab.setAttribute("aria-selected", "true");
        tab.setAttribute("tabindex", "0");
      } else {
        tab.removeAttribute("aria-current");
        tab.setAttribute("aria-selected", "false");
        tab.setAttribute("tabindex", "-1");
      }
      if (active && focusTab) tab.focus();
    });
    panels.forEach((panel) => {
      const active = panel.getAttribute("data-menu-panel") === id;
      panel.classList.toggle("active", active);
      panel.setAttribute("aria-hidden", String(!active));
    });
    ensureModuleRendered(id);
    if (stage) stage.scrollTop = 0;
    if (focusedPanel && !focusedPanel.classList.contains("active")) {
      window.requestAnimationFrame(() => stage?.focus({ preventScroll: true }));
    }
    if (typeof setMobileMenuOpen === "function" && window.innerWidth <= 900) {
      setMobileMenuOpen(false);
      window.requestAnimationFrame(() => stage?.focus({ preventScroll: true }));
    }
    if (updateHash && window.history && window.history.replaceState) window.history.replaceState(null, "", `#${id}`);
    document.dispatchEvent(new CustomEvent("portfolio:module-shown", { detail: { id } }));
    document.dispatchEvent(new Event("portfolio:rendered"));
    try { cyberAudio.playTab(); } catch (error) {}
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", (event) => {
      event.preventDefault();
      activate(tab.getAttribute("data-menu-tab"), false);
    });
  });

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-menu-target]");
    if (!trigger) return;
    event.preventDefault();
    activate(trigger.getAttribute("data-menu-target"));
  });

  window.addEventListener("hashchange", () => {
    const id = window.location.hash.slice(1);
    if (id && id !== activeId) activate(id);
  });

  document.addEventListener("keydown", (event) => {
    const target = event.target;
    const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
    if (typing || event.defaultPrevented) return;

    if (event.key === "m" || event.key === "M") {
      event.preventDefault();
      if (window.innerWidth <= 900 && typeof setMobileMenuOpen === "function") setMobileMenuOpen(true);
      else tabs.find((tab) => tab.getAttribute("data-menu-tab") === activeId)?.focus();
      return;
    }

    if (event.key === "Escape") {
      if (window.innerWidth <= 900 && document.querySelector(".main-menu.is-mobile-open")) return;
      event.preventDefault();
      if (window.innerWidth <= 900 && typeof setMobileMenuOpen === "function") setMobileMenuOpen(false);
      if (activeId !== "profile") activate("profile", true);
      else stage?.focus({ preventScroll: true });
      return;
    }

    const isTab = target?.closest?.("[data-menu-tab]");
    const isWidget = target?.closest?.("button, a, input, textarea, select, [role='option'], [role='tab'], .project-card, .skill-chip");
    if (!isTab && isWidget) return;
    if (!["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Home", "End", "Enter"].includes(event.key)) return;
    event.preventDefault();
    const focusedIndex = isTab ? tabs.indexOf(isTab) : tabs.findIndex((tab) => tab.getAttribute("data-menu-tab") === activeId);
    const current = focusedIndex < 0 ? 0 : focusedIndex;
    let next = current;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") next = (current + 1) % tabs.length;
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = (current - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = tabs.length - 1;
    if (event.key === "Enter") {
      activate(activeId, false);
      stage?.focus({ preventScroll: true });
      return;
    }
    activate(tabs[next].getAttribute("data-menu-tab"), true);
  });

  const initialId = window.location.hash.slice(1);
  activate(validIds.has(initialId) ? initialId : "profile", false, false);
  const gotoId = new URLSearchParams(window.location.search).get("goto");
  if (gotoId && validIds.has(gotoId)) activate(gotoId, false, false);
}

let mobileReturnFocus = null;

function setMobileMenuOpen(open) {
  const toggle = document.getElementById("menu-toggle");
  const menu = document.querySelector(".main-menu");
  const stage = document.querySelector(".menu-stage");
  if (!toggle || !menu) return;
  const wasOpen = menu.classList.contains("is-mobile-open");
  const next = Boolean(open);
  if (next && !wasOpen) mobileReturnFocus = document.activeElement;
  menu.classList.toggle("is-mobile-open", next);
  toggle.classList.toggle("is-open", next);
  toggle.setAttribute("aria-expanded", String(next));
  toggle.setAttribute("aria-label", next ? "Close navigation menu" : "Open navigation menu");
  document.body.classList.toggle("mobile-menu-open", next);
  if (stage) stage.inert = next;
  if (next) {
    window.requestAnimationFrame(() => menu.querySelector(".menu-tab")?.focus());
  } else if (wasOpen) {
    const restore = mobileReturnFocus;
    mobileReturnFocus = null;
    if (restore?.isConnected) window.requestAnimationFrame(() => restore.focus());
  }
}

function initMobileMenu() {
  const toggle = document.getElementById("menu-toggle");
  const menu = document.querySelector(".main-menu");
  if (!toggle || !menu) return;
  toggle.addEventListener("click", () => setMobileMenuOpen(!menu.classList.contains("is-mobile-open")));
  document.addEventListener("keydown", (event) => {
    if (!menu.classList.contains("is-mobile-open")) return;
    if (event.key === "Escape") {
      event.preventDefault();
      setMobileMenuOpen(false);
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = [toggle, ...Array.from(menu.querySelectorAll("a, button, input, textarea, select, [tabindex]:not([tabindex='-1'])")).filter((element) => !element.disabled)];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const current = focusable.indexOf(document.activeElement);
    if (current < 0) {
      event.preventDefault();
      first.focus();
    } else if (event.shiftKey && current === 0) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && current === focusable.length - 1) {
      event.preventDefault();
      first.focus();
    } else if (!event.shiftKey && current === 0) {
      event.preventDefault();
      focusable[1]?.focus();
    } else if (event.shiftKey && current === focusable.length - 1) {
      event.preventDefault();
      focusable[focusable.length - 2]?.focus();
    }
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) setMobileMenuOpen(false);
  });
  setMobileMenuOpen(false);
}

function initAudioEvents() {
  const interactive = ".btn-cyber, .menu-tab, .mobile-menu-toggle, .exp-tab, .lvl, .chrome-control, .netlink-btn, .dlg-opt, .skill-chip, .social-link, .project-card, .gh-repo, .gh-refresh, .option-row";
  document.body.addEventListener("pointerover", (event) => {
    if (event.pointerType && event.pointerType !== "mouse") return;
    if (event.relatedTarget && event.relatedTarget.closest && event.relatedTarget.closest(interactive) === event.target.closest(interactive)) return;
    if (event.target.closest(interactive)) {
      try { cyberAudio.playHover(); } catch (error) {}
    }
  });
  document.body.addEventListener("click", (event) => {
    if (event.target.closest(".btn-cyber, .menu-tab, .mobile-menu-toggle, .chrome-control, .netlink-btn, .dlg-opt, .exp-tab, .lvl, .option-row, .project-card, .gh-refresh")) {
      try { cyberAudio.playClick(); } catch (error) {}
    }
  });
  document.querySelectorAll("input, textarea").forEach((input) => {
    input.addEventListener("keydown", () => {
      try { cyberAudio.playKeypress(); } catch (error) {}
    });
  });
}

function initInterfaceControls() {
  const audioButtons = Array.from(document.querySelectorAll('[data-control="audio"]'));
  const syncAudio = () => {
    const enabled = !cyberAudio.isMuted;
    audioButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(enabled));
      button.dataset.controlValue = enabled ? "ON" : "OFF";
      const value = button.querySelector("[data-control-value]");
      if (value) value.textContent = enabled ? "ON" : "OFF";
    });
  };
  syncAudio();
  audioButtons.forEach((button) => button.addEventListener("click", () => {
    cyberAudio.toggleMute();
    syncAudio();
  }));
}

function initDialogueOptions() {
  document.querySelectorAll("[data-scroll-to]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.querySelector(button.getAttribute("data-scroll-to"));
      if (!target) return;
      const reduced = prefersReducedMotion();
      target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
      window.setTimeout(() => target.querySelector("input, textarea")?.focus({ preventScroll: true }), reduced ? 0 : 350);
    });
  });

  const netlinksButton = document.getElementById("dlg-netlinks");
  const netlinks = document.getElementById("netlinks-container");
  if (netlinksButton && netlinks) {
    netlinks.inert = true;
    netlinks.setAttribute("aria-hidden", "true");
    netlinksButton.addEventListener("click", () => {
      const open = netlinks.classList.toggle("is-open");
      netlinks.inert = !open;
      netlinks.setAttribute("aria-hidden", String(!open));
      netlinksButton.setAttribute("aria-expanded", String(open));
    });
  }

  const form = document.getElementById("terminal-contact-form");
  const log = document.getElementById("terminal-console-log");
  if (form && log) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = document.getElementById("agent-name").value.trim() || "UNKNOWN";
      const email = document.getElementById("agent-freq").value.trim() || "NO FREQUENCY";
      const message = document.getElementById("agent-msg").value.trim() || "NO BRIEF";
      log.textContent = `LOCAL PREVIEW ONLY\n> Sender: ${name} [${email}]\n> Brief: ${message}\n> Delivery endpoint: NOT CONNECTED`;
      log.classList.add("active");
      try { cyberAudio.playSuccess(); } catch (error) {}
    });
  }
}

