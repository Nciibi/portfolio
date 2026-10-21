/* ==========================================================================
   main.js — renderer + router for the NCIIBI_OS interface.
   ========================================================================== */

const renderedModules = new Set(["profile"]);
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
const sessionStarted = Date.now();
const visitedPanels = new Set(["profile"]);

let activePanelId = "profile";
let switchToken = 0;
let activePerkId = null;

const NAV_ICONS = {
  profile: "dia-user",
  character: "dia-idcard",
  projects: "dia-folder",
  perks: "dia-chip",
  experience: "dia-briefcase",
  journey: "dia-route",
  github: "dia-github",
  codex: "dia-book",
  netrun: "dia-terminal",
  contact: "dia-signal",
  options: "dia-sliders",
  exit: "dia-power"
};

function prefersReducedMotion() {
  return motionPreference.matches || (window.FX && window.FX.reduced);
}

function reduced() {
  return prefersReducedMotion();
}

/* ==========================================================================
   BOOT
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initNavIcons();
  renderHeroSocials();
  renderProfileReadouts();
  renderStats();
  renderBento();
  renderEducation();
  initMenuTabs();
  initMobileMenu();
  initAudioEvents();
  initInterfaceControls();
  initDialogueOptions();
  initOptionsPanel();
  initTopbarReadouts();
  initExitPanel();
  initEasterEggs();
  initBinaryColumn();
  startEngine();
  document.dispatchEvent(new Event("portfolio:rendered"));
});

function startEngine() {
  if (!window.CRT) return;
  window.CRT.init();
  window.CRT.start();
  if (window.Glitch) window.Glitch.ensureDefs();
}

/* ==========================================================================
   HELPERS
   ========================================================================== */

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
  if (typeof icon !== "function" || !slug) return "";
  return icon(slug) || icon("node");
}

function getIconColored(name) {
  const slugs = typeof ICON_SLUGS !== "undefined" ? ICON_SLUGS : null;
  const slug = slugs && name ? slugs[name] || name : name;
  if (typeof iconColored !== "function" || !slug) return getIcon(name);
  return iconColored(slug) || icon(slug) || icon("node");
}

function initNavIcons() {
  document.querySelectorAll("[data-menu-tab]").forEach((tab, index) => {
    tab.style.setProperty("--d", `${140 + index * 42}ms`);
    const holder = tab.querySelector(".tab-icon");
    if (!holder) return;
    const slug = NAV_ICONS[tab.getAttribute("data-menu-tab")];
    holder.innerHTML = typeof icon === "function" && slug ? icon(slug) : "";
  });
}

function ensureModuleRendered(id) {
  if (renderedModules.has(id)) return;
  renderedModules.add(id);
  if (id === "character") renderCharacter();
  if (id === "projects") renderProjects();
  if (id === "perks") renderPerks();
  if (id === "experience") {
    initExpTabs();
    renderExperience(activeExpTab);
  }
  if (id === "journey") renderJourney();
  if (id === "codex") renderCodex();
  if (id === "netrun") initNetrun();
  if (id === "contact") renderNetlinks();
}

/* ==========================================================================
   01 — PROFILE
   ========================================================================== */

function renderHeroSocials() {
  const wrap = document.getElementById("hero-socials");
  if (!wrap || !PORTFOLIO_DATA.profile?.socials) return;
  wrap.innerHTML = PORTFOLIO_DATA.profile.socials
    .map(
      (social) =>
        `<a class="social-link" href="${safeHref(social.url)}" target="_blank" rel="noopener">${getIcon(social.name || social.icon)}<span>${escapeHtml(social.name)}</span></a>`
    )
    .join("");
}

function renderProfileReadouts() {
  const wrap = document.getElementById("profile-readouts");
  const p = PORTFOLIO_DATA.profile;
  if (!wrap || !p) return;
  const rows = [
    { k: "STATUS", v: p.status, tone: "good" },
    { k: "LOCATION", v: p.location, tone: "cyan" },
    { k: "FOCUS", v: p.title, tone: "cyan" },
    { k: "HANDLE", v: "@" + (p.alias || "").toLowerCase(), tone: "cyan" }
  ];
  wrap.innerHTML = rows
    .map(
      (row) => `
    <div class="profile-readout">
      <span class="pr-k">${escapeHtml(row.k)}</span>
      <span class="pr-v is-${escapeHtml(row.tone)}">${escapeHtml(row.v)}</span>
    </div>`
    )
    .join("");
}

function renderStats() {
  const wrap = document.getElementById("stat-strip");
  if (!wrap || !PORTFOLIO_DATA.stats) return;
  wrap.innerHTML = PORTFOLIO_DATA.stats
    .map(
      (stat, index) => `
    <div class="stat-cell" data-reveal style="--d:${(index * 0.06).toFixed(2)}s">
      <div><span class="stat-num" data-count="${Number(stat.value) || 0}">0</span>${stat.suffix ? `<span class="stat-suffix">${escapeHtml(stat.suffix)}</span>` : ""}</div>
      <div class="stat-label">${escapeHtml(stat.label)}</div>
    </div>`
    )
    .join("");
}

function renderBento() {
  const wrap = document.getElementById("bento-container");
  if (!wrap || !PORTFOLIO_DATA.about) return;
  wrap.innerHTML = PORTFOLIO_DATA.about
    .map((item, index) => {
      const tags = (item.tags || []).map((tag) => `<span class="bento-tag">${getIcon(tag)}${escapeHtml(tag)}</span>`).join("");
      return `
      <article class="bento-card row-glitch span-${escapeHtml(item.span || "normal")}" data-reveal style="--d:${(index * 0.05).toFixed(2)}s;--code:'D-${String(index + 1).padStart(2, "0")}'">
        <div class="bento-kicker">${escapeHtml(item.kicker)}</div>
        <h3 class="bento-title">${escapeHtml(item.title)}</h3>
        ${item.body ? `<p class="bento-body">${escapeHtml(item.body)}</p>` : ""}
        ${tags ? `<div class="bento-tags">${tags}</div>` : ""}
      </article>`;
    })
    .join("");
}

function renderEducation() {
  const wrap = document.getElementById("edu-container");
  if (!wrap || !PORTFOLIO_DATA.education) return;
  wrap.innerHTML = PORTFOLIO_DATA.education
    .map(
      (item, index) => `
    <article class="edu-card" data-reveal style="--d:${(0.2 + index * 0.06).toFixed(2)}s">
      <div class="edu-top"><h4>${escapeHtml(item.title)}</h4><span class="edu-score">${escapeHtml(item.score)}</span></div>
      <div class="edu-period">${escapeHtml(item.period)}</div>
      <p class="edu-org">${escapeHtml(item.org)}</p>
    </article>`
    )
    .join("");
}

/* ==========================================================================
   02 — CHARACTER SHEET
   ========================================================================== */

function renderCharacter() {
  const wrap = document.getElementById("character-container");
  const c = PORTFOLIO_DATA.character;
  if (!wrap || !c) return;

  const attrRows = c.attributes
    .map(
      (attr) => `
    <div class="attr-row" data-reveal style="--d:0.05s">
      <div class="attr-name">${escapeHtml(attr.key)} <small lang="ja">${escapeHtml(attr.jp)}</small></div>
      <div class="meter">
        <div class="meter-track"><span class="meter-fill" data-fill="${Math.round((attr.value / attr.max) * 100)}"></span></div>
      </div>
      <div class="attr-val">${attr.value}<small>/${attr.max}</small></div>
    </div>`
    )
    .join("");

  const effects = c.statusEffects
    .map(
      (effect) =>
        `<span class="status-effect${effect.tone ? ` is-${escapeHtml(effect.tone)}` : ""}"><i aria-hidden="true"></i>${escapeHtml(effect.label)}</span>`
    )
    .join("");

  wrap.innerHTML = `
    <div class="char-id" data-reveal>
      <div class="char-portrait">
        <picture>
          <source srcset="assets/avatar.webp" type="image/webp" />
          <img src="assets/avatar.webp" width="256" height="256" decoding="async" alt="Portrait of Ahmed Nciibi" />
        </picture>
      </div>
      <div class="char-level-row">
        <div class="hex-badge" aria-label="Level ${c.level}"><span>${String(c.level).padStart(2, "0")}</span></div>
        <div class="char-level-meta">
          <div class="cl-k">LEVEL</div>
          <div class="cl-v">${escapeHtml(c.realName)}</div>
          <div class="char-alias">${escapeHtml(c.alias)} · ${escapeHtml(c.title)} · ${escapeHtml(c.affiliation)}</div>
        </div>
      </div>
      <div class="char-xp">
        <div class="char-xp-head"><span>EXPERIENCE</span><b>${c.xp} / ${c.xpNext}</b></div>
        <div class="meter"><div class="meter-track"><span class="meter-fill" data-fill="${Math.round((c.xp / c.xpNext) * 100)}"></span></div></div>
      </div>
      <div class="char-xp">
        <div class="char-xp-head"><span>STREET CRED</span><b>${escapeHtml(c.cred)}</b></div>
        <div class="meter"><div class="meter-track"><span class="meter-fill is-cyan" data-fill="38"></span></div></div>
      </div>
    </div>

    <div class="char-main">
      <div class="char-panel" data-reveal>
        <div class="char-panel-head"><h3>ATTRIBUTES</h3><span>6 AXES</span></div>
        <div class="attr-list">${attrRows}</div>
      </div>

      <div class="char-panel" data-reveal>
        <div class="char-panel-head"><h3>VITALS</h3><span>BIOMETRIC</span></div>
        <div class="char-vitals">
          <div class="vital">
            <div class="vital-head"><span>HUMANITY</span><b>${c.humanity}%</b></div>
            <div class="meter"><div class="meter-track"><span class="meter-fill" data-fill="${c.humanity}"></span></div></div>
          </div>
          <div class="vital">
            <div class="vital-head"><span>CYBERPSYCHOSIS</span><b>${c.cyberpsychosis}%</b></div>
            <div class="meter"><div class="meter-track"><span class="meter-fill is-magenta" data-fill="${c.cyberpsychosis}"></span></div></div>
          </div>
        </div>
      </div>

      <div class="char-panel" data-reveal>
        <div class="char-panel-head"><h3>STATUS EFFECTS</h3><span>ACTIVE</span></div>
        <div class="status-effects">${effects}</div>
      </div>
    </div>
  `;
}

/* ==========================================================================
   03 — PROJECTS
   ========================================================================== */

const projectArtworkMap = Object.freeze({
  "gh-seagles": "assets/proj-netrunner.webp",
  "gh-m2m": "assets/proj-citymap.webp",
  "gh-aios": "assets/proj-neural.webp",
  "gh-hider": "assets/proj-netrunner.webp"
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
  return `<div class="project-detail-visual" style="background-image: url('${artwork}')"></div>`;
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
    </div>`;
}

function projectCardMarkup(project, index) {
  const tags = (project.tags || []).slice(0, 3).map((tag) => `<span class="gig-tag">${getIcon(tag)}${escapeHtml(tag)}</span>`).join("");
  const idx = String(index + 1).padStart(2, "0");
  const artwork = escapeHtml(projectArtwork(project));
  return `
    <article class="project-card row-glitch project-select${index === 0 ? " selected" : ""}" data-project-id="${escapeHtml(project.id)}" data-hud-label="${escapeHtml(project.title)}" data-reveal style="--d:${(index * 0.07).toFixed(2)}s" role="option" aria-selected="${index === 0}" tabindex="${index === 0 ? 0 : -1}">
      <div class="project-card-visual" style="background-image: linear-gradient(180deg, rgba(5,5,7,.04) 0%, rgba(5,5,7,.28) 38%, rgba(5,5,7,.94) 100%), url('${artwork}')"></div>
      <span class="pc-ghost-index" aria-hidden="true">${idx}</span>
      <span class="pc-open" aria-hidden="true">↗</span>
      <div class="project-card-content">
        <div class="pc-meta"><span class="pc-idx">${idx}</span><span class="pc-period">${escapeHtml(project.period)}</span><span class="pc-cat">${escapeHtml(project.category)}</span></div>
        <h3 class="pc-title">${escapeHtml(project.title)}</h3>
        <p class="pc-summary">${escapeHtml(project.summary)}</p>
        <div class="pc-footer"><div class="gig-tags">${tags}</div><div class="pc-actions"><span class="pc-likes">♥ ${Number(project.likes) || 0}</span><a class="btn-cyber btn-cyber-sm btn-cyber-ghost" href="${safeHref(project.url)}" target="_blank" rel="noopener">OPEN FILE <span aria-hidden="true">↗</span></a></div></div>
      </div>
    </article>`;
}

function renderProjects() {
  const wrap = document.getElementById("projects-container");
  const detail = document.getElementById("project-detail");
  const initialProject = PORTFOLIO_DATA.projects?.[0];
  if (!wrap || !detail || !initialProject) return;

  detail.innerHTML = `
    <div class="project-detail-media-stack">
      <div class="project-detail-layer is-current">${projectVisualMarkup(initialProject)}</div>
      <canvas class="project-detail-mosh" aria-hidden="true"></canvas>
    </div>
    ${projectCopyMarkup(initialProject)}`;

  const mediaStack = detail.querySelector(".project-detail-media-stack");
  const moshCanvas = detail.querySelector(".project-detail-mosh");
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

    const commit = () => {
      if (committed || token !== transitionToken) return;
      committed = true;

      const currentLayer = mediaStack.querySelector(".project-detail-layer.is-current");
      const nextLayer = document.createElement("div");
      nextLayer.className = "project-detail-layer is-next";
      nextLayer.innerHTML = projectVisualMarkup(project);
      mediaStack.append(nextLayer);

      /* Swap the copy block */
      const nextCopy = document.createElement("div");
      nextCopy.innerHTML = projectCopyMarkup(project);
      const copyEl = nextCopy.firstElementChild;
      copyEl.classList.add("is-entering");
      detail.querySelector(".project-detail-copy")?.remove();
      detail.append(copyEl);

      activeProjectId = project.id;

      /* Datamosh the incoming artwork, then settle to the clean frame. */
      const image = new Image();
      image.decoding = "async";
      image.src = projectArtwork(project);
      const finish = () => {
        if (token !== transitionToken) return;
        detail.setAttribute("aria-busy", "false");
        nextLayer.classList.remove("is-next");
        nextLayer.classList.add("is-current");
        currentLayer?.remove();
      };

      const showClean = () => {
        nextLayer.classList.add("is-current");
        nextLayer.classList.remove("is-next");
        window.setTimeout(() => currentLayer?.remove(), 260);
      };

      if (reduced() || typeof Datamosh === "undefined" || !moshCanvas) {
        nextLayer.classList.add("is-visible");
        window.setTimeout(finish, 300);
      } else {
        const runMosh = () => {
          moshCanvas.classList.add("is-active");
          Datamosh.run(moshCanvas, image, {
            duration: 520,
            intensity: 1,
            onDone: () => {
              moshCanvas.classList.remove("is-active");
              finish();
            }
          });
        };
        if (image.complete && image.naturalWidth) runMosh();
        else {
          image.onload = runMosh;
          image.onerror = () => {
            nextLayer.classList.add("is-visible");
            window.setTimeout(finish, 300);
          };
        }
      }

      if (window.innerWidth <= 1050) {
        window.requestAnimationFrame(() => detail.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "nearest" }));
      }
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

  wrap.innerHTML = PORTFOLIO_DATA.projects.map((project, index) => projectCardMarkup(project, index)).join("");
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
      const next = event.key === "ArrowDown" ? Math.min(cards.length - 1, index + 1) : Math.max(0, index - 1);
      cards[next].focus();
      selectProject(cards[next].getAttribute("data-project-id"));
    });
  });
}

/* ==========================================================================
   04 — PERKS
   ========================================================================== */

function renderPerks() {
  const wrap = document.getElementById("perks-container");
  const detail = document.getElementById("perk-detail");
  if (!wrap || !PORTFOLIO_DATA.skills) return;

  const cells = PORTFOLIO_DATA.skills
    .map((group, index) => {
      const state =
        group.level === "PROFICIENT" ? "is-resolved" : group.level === "BEGINNER" ? "is-pending" : "is-inprogress";
      const watermark =
        group.level === "PROFICIENT" ? "RESOLVED" : group.level === "BEGINNER" ? "NO ACCESS" : "IN PROGRESS";
      const locked = group.level === "BEGINNER";
      const nodes = group.items
        .map((item) => {
          const iconMarkup = getIconColored(item.name);
          return `<button class="hex-node${locked ? " is-locked" : ""}" type="button" data-perk="${escapeHtml(group.id)}:${escapeHtml(item.name)}" data-hud-label="${escapeHtml(item.name)}" aria-label="${escapeHtml(item.name)}">${iconMarkup}</button>`;
        })
        .join('<span class="perk-connector" aria-hidden="true"></span>');

      return `
      <section class="perk-cell ${state}" data-tree="${escapeHtml(group.id)}" data-level="${escapeHtml(group.level)}" data-reveal style="--d:${(index * 0.07).toFixed(2)}s">
        <div class="perk-cell-head">
          <span class="perk-cell-icon" aria-hidden="true">${getIcon(group.id === "core" ? "dia-chip" : group.id === "software" ? "dia-folder" : group.id === "systems" ? "dia-signal" : "dia-sliders")}</span>
          <h3>${escapeHtml(group.category)}</h3>
          <span class="perk-cell-tier">${escapeHtml(group.tier || group.level)}</span>
        </div>
        <p class="perk-cell-desc">${escapeHtml(group.desc)}</p>
        <div class="perk-nodes">${nodes}</div>
        <span class="perk-watermark" aria-hidden="true">${escapeHtml(watermark)}</span>
      </section>`;
    })
    .join("");

  wrap.innerHTML = `<div class="boxtree">${cells}</div>`;
  initPerkFilters();
  initPerkNodes();

  const first = PORTFOLIO_DATA.skills[0];
  if (first && first.items[0]) selectPerk(`${first.id}:${first.items[0].name}`);
}

function initPerkFilters() {
  const buttons = Array.from(document.querySelectorAll(".perk-filter"));
  buttons.forEach((button, index) => {
    button.setAttribute("tabindex", index === 0 ? "0" : "-1");
    button.addEventListener("click", () => {
      const level = button.getAttribute("data-level") || "PROFICIENT";
      buttons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
        item.setAttribute("tabindex", active ? "0" : "-1");
      });
      document.querySelectorAll(".perk-cell").forEach((tree) => {
        const visible = tree.getAttribute("data-level") === level;
        tree.classList.toggle("is-hidden", !visible);
      });
      /* If the open perk is now filtered out, open the first visible node. */
      const visibleTree = document.querySelector('.perk-cell:not(.is-hidden)');
      if (visibleTree && !visibleTree.contains(document.querySelector(".hex-node.is-active"))) {
        const node = visibleTree.querySelector(".hex-node");
        if (node) selectPerk(node.getAttribute("data-perk"));
      }
      try {
        cyberAudio.playTab();
      } catch (error) {
        /* ignore */
      }
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

function initPerkNodes() {
  document.querySelectorAll(".hex-node").forEach((node) => {
    node.addEventListener("click", () => selectPerk(node.getAttribute("data-perk")));
    node.addEventListener("mouseenter", () => {
      const detail = document.getElementById("perk-detail");
      const id = node.getAttribute("data-perk");
      const found = findPerk(id);
      if (detail && found) {
        const title = detail.querySelector(".pd-title");
        if (title) title.textContent = found.item.name;
      }
    });
  });
}

function findPerk(id) {
  if (!id || !PORTFOLIO_DATA.skills) return null;
  const [groupId, name] = id.split(":");
  const group = PORTFOLIO_DATA.skills.find((g) => g.id === groupId);
  if (!group) return null;
  const item = group.items.find((i) => i.name === name);
  if (!item) return null;
  return { group, item };
}

function selectPerk(id) {
  const found = findPerk(id);
  const detail = document.getElementById("perk-detail");
  if (!found || !detail) return;
  activePerkId = id;

  document.querySelectorAll(".hex-node").forEach((node) => {
    node.classList.toggle("is-active", node.getAttribute("data-perk") === id);
  });

  detail.innerHTML = `
    <div class="pd-kicker">${escapeHtml(found.group.category)}</div>
    <h3 class="pd-title">${escapeHtml(found.item.name)}</h3>
    <p>${escapeHtml(found.item.note)}</p>
    <div class="pd-meta">
      <span class="pd-tier">${escapeHtml(found.group.tier || found.group.level)}</span>
      <span class="pd-tier">${escapeHtml(found.group.level)}</span>
    </div>`;

  try {
    cyberAudio.playHover();
  } catch (error) {
    /* ignore */
  }
}

/* ==========================================================================
   05 — WORK LOG
   ========================================================================== */

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
      try {
        cyberAudio.playTab();
      } catch (error) {
        /* ignore */
      }
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
    wrap.innerHTML = '<div class="empty-state">NO RECORDS FOR THIS CHANNEL</div>';
    return;
  }
  wrap.innerHTML = rows
    .map(
      (item, index) => `
    <article class="exp-card row-glitch" data-reveal style="--d:${(index * 0.07).toFixed(2)}s">
      <div>
        <div class="exp-period">${escapeHtml(item.period)}</div>
        <div class="exp-org">${escapeHtml(item.org)}</div>
      </div>
      <div>
        <h3 class="exp-role">${escapeHtml(item.role)}</h3>
        <p class="exp-desc">${escapeHtml(item.desc)}</p>
      </div>
    </article>`
    )
    .join("");
  wrap.classList.remove("is-refreshing");
  void wrap.offsetWidth;
  wrap.classList.add("is-refreshing");
  document.dispatchEvent(new Event("portfolio:rendered"));
}

/* ==========================================================================
   06 — THE ROAD
   ========================================================================== */

function renderJourney() {
  const wrap = document.getElementById("journey-container");
  if (!wrap || !PORTFOLIO_DATA.journey) return;
  wrap.innerHTML = PORTFOLIO_DATA.journey
    .map(
      (item, index) => {
        const list = (item.list || []).map((entry) => `<li>${escapeHtml(entry)}</li>`).join("");
        return `
      <article class="journey-item" data-reveal style="--d:${(index * 0.07).toFixed(2)}s">
        <div class="journey-year"><span class="jy-label">${escapeHtml(item.year)}</span></div>
        <div class="journey-card"><p class="jy-text">${escapeHtml(item.text)}</p>${list ? `<ul class="jy-list">${list}</ul>` : ""}</div>
      </article>`;
      }
    )
    .join("");
}

/* ==========================================================================
   08 — CODEX
   ========================================================================== */

function renderCodex() {
  const wrap = document.getElementById("codex-container");
  if (!wrap || !PORTFOLIO_DATA.codex) return;
  wrap.innerHTML = PORTFOLIO_DATA.codex
    .map(
      (entry, index) => `
    <article class="codex-entry row-glitch" data-cat="${escapeHtml(entry.cat)}" data-reveal style="--d:${(index * 0.04).toFixed(2)}s">
      <div class="codex-mark" aria-hidden="true">${getIcon(entry.icon)}</div>
      <div class="codex-main">
        <div class="codex-cat">${escapeHtml(entry.cat)}</div>
        <h3 class="codex-title">${escapeHtml(entry.title)}</h3>
        <p class="codex-note">${escapeHtml(entry.note)}</p>
      </div>
      <div class="codex-meta">
        <span class="codex-year">${escapeHtml(entry.year)}</span>
        <span class="codex-badge">${escapeHtml(entry.badge)}</span>
      </div>
      <span class="expand-chevron" aria-hidden="true"></span>
    </article>`
    )
    .join("");

  const filters = Array.from(document.querySelectorAll(".codex-filter"));
  filters.forEach((button) => {
    button.addEventListener("click", () => {
      const cat = button.getAttribute("data-cat") || "ALL";
      filters.forEach((item) => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      document.querySelectorAll(".codex-entry").forEach((entry) => {
        const visible = cat === "ALL" || entry.getAttribute("data-cat") === cat;
        entry.classList.toggle("is-hidden", !visible);
      });
      try {
        cyberAudio.playTab();
      } catch (error) {
        /* ignore */
      }
    });
  });
}

/* ==========================================================================
   09 — NETRUN TERMINAL
   ========================================================================== */

function initNetrun() {
  const out = document.getElementById("netrun-out");
  const form = document.getElementById("netrun-form");
  const input = document.getElementById("netrun-cmd");
  const status = document.getElementById("netrun-status");
  if (!out || !form || !input) return;

  const table = PORTFOLIO_DATA.netrun?.commands || {};
  const banner = PORTFOLIO_DATA.netrun?.banner || [];

  function print(lines, type) {
    const frag = document.createDocumentFragment();
    (Array.isArray(lines) ? lines : [lines]).forEach((line) => {
      const span = document.createElement("span");
      span.className = `netrun-line${type ? ` is-${type}` : ""}`;
      span.textContent = line + "\n";
      frag.appendChild(span);
    });
    out.appendChild(frag);
    out.scrollTop = out.scrollHeight;
  }

  function uptime() {
    const seconds = Math.floor((Date.now() - sessionStarted) / 1000);
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  }

  function run(raw) {
    const cmd = String(raw || "").trim().toLowerCase();
    if (!cmd) return;
    print(`> ${raw.trim()}`, "cmd");

    const alias = { dir: "projects", ls: "projects", man: "help", cat: "help", git: "github", "?": "help" }[cmd];
    const key = table[cmd] ? cmd : alias;
    const entry = table[key];

    if (!entry) {
      print(`command not found: ${cmd}`, "err");
      print("  type 'help' for the command index", "dim");
      try { cyberAudio.playDeny(); } catch (error) { /* ignore */ }
      return;
    }
    if (entry.type === "clear") {
      out.innerHTML = "";
      return;
    }
    if (cmd === "konami") {
      triggerOverride();
    }
    if (entry.type === "err") {
      try { cyberAudio.playDeny(); } catch (error) { /* ignore */ }
    }
    const lines = (entry.out || []).map((line) =>
      line.replace("{UPTIME}", uptime()).replace("{MEM}", `${Math.round(38 + Math.random() * 14)}M`)
    );
    print(lines, entry.type);
  }

  print(banner, "head");
  print("  the ice is listening. type 'help' for the command index.", "dim");
  print("  hint: 'neofetch' prints a system summary. 'sudo' is a joke.", "dim");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    run(input.value);
    input.value = "";
    try {
      cyberAudio.playKeypress();
    } catch (error) {
      /* ignore */
    }
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "l" && event.ctrlKey) {
      event.preventDefault();
      out.innerHTML = "";
    }
  });

  if (status) status.textContent = "READY";
}

/* ==========================================================================
   10 — CONTACT
   ========================================================================== */

function renderNetlinks() {
  const wrap = document.getElementById("netlinks-container");
  if (!wrap || !PORTFOLIO_DATA.contact?.channels) return;
  wrap.innerHTML = PORTFOLIO_DATA.contact.channels
    .map(
      (channel) => `
    <a class="netlink-btn" href="${safeHref(channel.url)}" target="_blank" rel="noopener">${getIcon(channel.icon || channel.name.toLowerCase())}<span>${escapeHtml(channel.name)}</span><span class="hint">${escapeHtml(channel.hint || "OPEN")}</span></a>`
    )
    .join("");
}

/* ==========================================================================
   11 — OPTIONS
   ========================================================================== */

function initOptionsPanel() {
  const sliders = document.getElementById("crt-intensity");
  const sliderValue = document.getElementById("crt-intensity-value");

  const syncToggles = () => {
    const state = window.FX ? window.FX.settings : null;
    if (!state) return;
    document.querySelectorAll("[data-setting]").forEach((button) => {
      const key = button.getAttribute("data-setting");
      const on = Boolean(state[key]);
      button.setAttribute("aria-pressed", String(on));
      const value = button.querySelector("[data-setting-value]");
      if (value) value.textContent = on ? "ON" : "OFF";
    });
  };

  document.querySelectorAll("[data-setting]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.getAttribute("data-setting");
      if (!window.FX) return;
      const next = !window.FX.settings[key];
      window.FX.setSetting(key, next);
      syncToggles();
      if (key === "ambient") {
        try {
          cyberAudio.setAmbient(next);
        } catch (error) {
          /* ignore */
        }
      }
      try {
        cyberAudio.playClick();
      } catch (error) {
        /* ignore */
      }
    });
  });

  if (sliders) {
    const initial = Math.round((window.FX ? window.FX.settings.crtIntensity : 1) * 100);
    sliders.value = String(initial);
    if (sliderValue) sliderValue.textContent = `${initial}%`;
    sliders.addEventListener("input", () => {
      const value = Number(sliders.value);
      if (sliderValue) sliderValue.textContent = `${value}%`;
      if (window.FX) window.FX.setSetting("crtIntensity", value / 100);
    });
  }

  syncToggles();
  if (window.FX) window.FX.on("settings", syncToggles);
}

/* ==========================================================================
   12 — EXIT
   ========================================================================== */

function initExitPanel() {
  const time = document.getElementById("exit-time");
  const visits = document.getElementById("exit-visits");
  const tick = () => {
    if (!time) return;
    const seconds = Math.floor((Date.now() - sessionStarted) / 1000);
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    time.textContent = `${h}:${m}:${s}`;
    if (visits) visits.textContent = String(Math.min(99, visitedPanels.size)).padStart(2, "0");
  };
  tick();
  window.setInterval(tick, 1000);
}

/* ==========================================================================
   TOPBAR READOUTS
   ========================================================================== */

function initTopbarReadouts() {
  const level = document.getElementById("top-level");
  const cred = document.getElementById("top-cred");
  const clock = document.getElementById("top-clock");
  const c = PORTFOLIO_DATA.character;
  if (level && c) level.textContent = String(c.level).padStart(2, "0");
  if (cred && c) cred.textContent = c.cred;

  if (clock) {
    const update = () => {
      const now = new Date();
      clock.textContent = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    };
    update();
    window.setInterval(update, 20000);
  }
}

/* ==========================================================================
   ROUTER
   ========================================================================== */

function createShardLayer() {
  const stage = document.querySelector(".menu-stage");
  if (!stage) return null;
  const layer = document.createElement("div");
  layer.className = "shard-layer";
  layer.setAttribute("aria-hidden", "true");
  const count = window.FX && window.FX.quality === "low" ? 4 : 7;
  for (let i = 0; i < count; i += 1) {
    const shard = document.createElement("span");
    shard.className = "shard";
    /* Deterministic but uneven vertical slices so the sweep reads as broken
       glass rather than a set of parallel bars. */
    const top = ((i * 37) % 100) * 0.92 - 6;
    const height = 22 + ((i * 53) % 5) * 9;
    shard.style.clipPath = `polygon(0 ${top}%, 100% ${top - 7}%, 100% ${top + height}%, 0 ${top + height - 5}%)`;
    shard.style.animationDelay = `${i * 26}ms`;
    layer.appendChild(shard);
  }
  stage.appendChild(layer);
  requestAnimationFrame(() => layer.querySelectorAll(".shard").forEach((shard) => shard.classList.add("is-active")));
  return layer;
}

function moveNavCursor(tab) {
  /* The active row carries its own 1px cyan parallelogram frame, so there
     is no separate cursor element to move. We only re-trigger the hatch
     animation so the selection always reads as freshly acquired. */
  if (!tab) return;
  const hatch = tab.querySelector(".tab-hatch");
  if (!hatch) return;
  hatch.style.animation = "none";
  void hatch.offsetWidth;
  hatch.style.animation = "";
}

/* The column of binary digits down the right edge of the stage. */
function initBinaryColumn() {
  const host = document.getElementById("stage-binary");
  if (!host) return;
  const rows = [];
  for (let i = 0; i < 90; i += 1) {
    let row = "";
    for (let j = 0; j < 5; j += 1) row += Math.random() > 0.5 ? "1" : "0";
    rows.push(row);
  }
  host.textContent = rows.join("\n");
}

function initMenuTabs() {
  const tabs = Array.from(document.querySelectorAll("[data-menu-tab]"));
  const panels = Array.from(document.querySelectorAll("[data-menu-panel]"));
  const validIds = new Set(tabs.map((tab) => tab.getAttribute("data-menu-tab")));
  const stage = document.querySelector(".menu-stage");
  let firstActivation = true;

  const paint = (id) => {
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
    });
    panels.forEach((panel) => {
      const active = panel.getAttribute("data-menu-panel") === id;
      panel.classList.toggle("active", active);
      panel.setAttribute("aria-hidden", String(!active));
    });
  };

  const activate = (id, focusTab = false, updateHash = true) => {
    if (!validIds.has(id)) id = "profile";
    const focusedPanel = document.activeElement?.closest?.("[data-menu-panel]");
    const previous = activePanelId;
    activePanelId = id;
    visitedPanels.add(id);

    const finish = () => {
      paint(id);
      ensureModuleRendered(id);
      if (stage) stage.scrollTop = 0;
      const activeTab = tabs.find((tab) => tab.getAttribute("data-menu-tab") === id);
      if (activeTab) moveNavCursor(activeTab);
      if (focusTab && activeTab) activeTab.focus();
      if (focusedPanel && !focusedPanel.classList.contains("active")) {
        window.requestAnimationFrame(() => stage?.focus({ preventScroll: true }));
      }
      if (typeof setMobileMenuOpen === "function" && window.innerWidth <= 980) {
        setMobileMenuOpen(false);
        window.requestAnimationFrame(() => stage?.focus({ preventScroll: true }));
      }
      if (updateHash && window.history && window.history.replaceState) window.history.replaceState(null, "", `#${id}`);
      document.dispatchEvent(new CustomEvent("portfolio:module-shown", { detail: { id } }));
      document.dispatchEvent(new Event("portfolio:rendered"));
    };

    if (firstActivation || previous === id || reduced()) {
      firstActivation = false;
      finish();
    } else {
      /* Shard wipe: the sweep covers the swap, then resolves. */
      const layer = createShardLayer();
      const token = ++switchToken;
      const swap = () => {
        if (token !== switchToken) return;
        finish();
        if (window.Glitch) window.Glitch.burst({ intensity: 0.4, duration: 240 });
        try {
          cyberAudio.playGlitch(0.45);
        } catch (error) {
          /* ignore */
        }
      };
      window.setTimeout(swap, 240);
      window.setTimeout(() => {
        layer?.remove();
      }, 760);
    }

    try {
      cyberAudio.playTab();
    } catch (error) {
      /* ignore */
    }
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
    if (id && id !== activePanelId) activate(id);
  });

  document.addEventListener("keydown", (event) => {
    const target = event.target;
    const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
    if (typing || event.defaultPrevented) return;

    if (event.key === "m" || event.key === "M") {
      event.preventDefault();
      if (window.innerWidth <= 980 && typeof setMobileMenuOpen === "function") setMobileMenuOpen(true);
      else tabs.find((tab) => tab.getAttribute("data-menu-tab") === activePanelId)?.focus();
      return;
    }

    if (event.key === "Escape") {
      if (window.innerWidth <= 980 && document.querySelector(".main-menu.is-mobile-open")) return;
      event.preventDefault();
      if (window.innerWidth <= 980 && typeof setMobileMenuOpen === "function") setMobileMenuOpen(false);
      if (activePanelId !== "profile") activate("profile", true);
      else stage?.focus({ preventScroll: true });
      return;
    }

    const isTab = target?.closest?.("[data-menu-tab]");
    const isWidget = target?.closest?.("button, a, input, textarea, select, [role='option'], [role='tab'], .project-card, .skill-chip, .hex-node, .codex-filter, .perk-filter");
    if (!isTab && isWidget) return;
    /* While a Konami sequence is in progress the arrows belong to the
       sequence, not to the navigation rail. */
    if (konamiIndex > 0 && ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(event.key)) return;
    if (!["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Home", "End", "Enter"].includes(event.key)) return;
    event.preventDefault();
    const focusedIndex = isTab ? tabs.indexOf(isTab) : tabs.findIndex((tab) => tab.getAttribute("data-menu-tab") === activePanelId);
    const current = focusedIndex < 0 ? 0 : focusedIndex;
    let next = current;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") next = (current + 1) % tabs.length;
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = (current - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = tabs.length - 1;
    if (event.key === "Enter") {
      activate(activePanelId, false);
      stage?.focus({ preventScroll: true });
      return;
    }
    activate(tabs[next].getAttribute("data-menu-tab"), true);
  });

  const initialId = window.__INITIAL_ROUTE || window.location.hash.slice(1);
  activate(validIds.has(initialId) ? initialId : "profile", false, false);
  const gotoId = new URLSearchParams(window.location.search).get("goto");
  if (gotoId && validIds.has(gotoId)) activate(gotoId, false, false);

  /* Put the fragment back so the route stays shareable. */
  if (validIds.has(initialId)) {
    window.history.replaceState(null, "", `#${initialId}`);
  }

  const resetScroll = () => {
    if (stage) stage.scrollTop = 0;
    if (window.scrollY) window.scrollTo(0, 0);
    if (document.documentElement.scrollTop) document.documentElement.scrollTop = 0;
    if (document.body.scrollTop) document.body.scrollTop = 0;
  };
  window.requestAnimationFrame(resetScroll);
  window.setTimeout(resetScroll, 60);
  window.setTimeout(resetScroll, 320);
  window.addEventListener("load", resetScroll);
  window.addEventListener("hashchange", resetScroll);
}

/* ==========================================================================
   EASTER EGGS
   ========================================================================== */

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
let konamiIndex = 0;

function triggerOverride() {
  if (reduced()) return;

  const flash = document.createElement("div");
  flash.className = "override-flash";
  flash.setAttribute("aria-hidden", "true");
  flash.innerHTML = "<span>NEURAL OVERRIDE // GHOST MODE</span>";
  document.body.appendChild(flash);
  requestAnimationFrame(() => flash.classList.add("is-active"));

  if (window.Glitch) {
    window.Glitch.burst({ intensity: 1, duration: 900, target: document.querySelector(".menu-stage") });
  }
  if (window.CRT && window.CRT.ready) window.CRT.pulse(1, 900);
  try {
    cyberAudio.playGlitch(1);
    setTimeout(() => cyberAudio.playSuccess(), 180);
  } catch (error) {
    /* ignore */
  }

  window.setTimeout(() => flash.remove(), 2400);
}

function initEasterEggs() {
  document.addEventListener("keydown", (event) => {
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    if (key === KONAMI[konamiIndex]) {
      konamiIndex += 1;
      if (konamiIndex === KONAMI.length) {
        konamiIndex = 0;
        triggerOverride();
      }
    } else {
      konamiIndex = key === KONAMI[0] ? 1 : 0;
    }
  });

  /* Clicking the brand mark five times is a second route in. */
  const brand = document.querySelector(".brand-badge");
  if (brand) {
    let clicks = 0;
    brand.addEventListener("click", () => {
      clicks += 1;
      if (clicks >= 5) {
        clicks = 0;
        triggerOverride();
      }
    });
  }
}

/* ==========================================================================
   MOBILE MENU
   ========================================================================== */

let mobileReturnFocus = null;

function setMobileMenuOpen(open) {
  const toggle = document.getElementById("menu-toggle");
  const menu = document.querySelector(".main-menu");
  const scrim = document.getElementById("menu-scrim");
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
  if (scrim) {
    const mobile = window.innerWidth <= 980;
    scrim.hidden = !mobile;
    if (mobile) {
      requestAnimationFrame(() => scrim.classList.toggle("is-open", next));
    } else {
      scrim.classList.remove("is-open");
    }
  }
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
  const scrim = document.getElementById("menu-scrim");
  if (!toggle || !menu) return;
  toggle.addEventListener("click", () => setMobileMenuOpen(!menu.classList.contains("is-mobile-open")));
  scrim?.addEventListener("click", () => setMobileMenuOpen(false));
  document.addEventListener("keydown", (event) => {
    if (!menu.classList.contains("is-mobile-open")) return;
    if (event.key === "Escape") {
      event.preventDefault();
      setMobileMenuOpen(false);
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = [toggle, ...Array.from(menu.querySelectorAll("a, button, input, textarea, select, [tabindex]:not([tabindex='-1'])"))].filter((element) => !element.disabled);
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
    if (window.innerWidth > 980) setMobileMenuOpen(false);
  });
  setMobileMenuOpen(false);
}

/* ==========================================================================
   AUDIO + CONTROLS
   ========================================================================== */

function initAudioEvents() {
  const interactive = ".btn-cyber, .menu-tab, .mobile-menu-toggle, .exp-tab, .perk-filter, .codex-filter, .chrome-control, .netlink-btn, .dlg-opt, .social-link, .project-card, .gh-repo, .gh-refresh, .option-row, .hex-node";
  document.body.addEventListener("pointerover", (event) => {
    if (event.pointerType && event.pointerType !== "mouse") return;
    if (event.relatedTarget && event.relatedTarget.closest && event.relatedTarget.closest(interactive) === event.target.closest(interactive)) return;
    if (event.target.closest(interactive)) {
      try {
        cyberAudio.playHover();
      } catch (error) {
        /* ignore */
      }
    }
  });
  document.body.addEventListener("click", (event) => {
    if (event.target.closest(".btn-cyber, .menu-tab, .mobile-menu-toggle, .chrome-control, .netlink-btn, .dlg-opt, .exp-tab, .perk-filter, .codex-filter, .option-row, .project-card, .gh-refresh, .hex-node")) {
      try {
        cyberAudio.playClick();
      } catch (error) {
        /* ignore */
      }
    }
  });
  document.querySelectorAll("input, textarea").forEach((input) => {
    input.addEventListener("keydown", () => {
      try {
        cyberAudio.playKeypress();
      } catch (error) {
        /* ignore */
      }
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
  audioButtons.forEach((button) =>
    button.addEventListener("click", () => {
      cyberAudio.toggleMute();
      syncAudio();
    })
  );
}

function initDialogueOptions() {
  document.querySelectorAll("[data-scroll-to]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.querySelector(button.getAttribute("data-scroll-to"));
      if (!target) return;
      target.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "center" });
      window.setTimeout(() => target.querySelector("input, textarea")?.focus({ preventScroll: true }), reduced() ? 0 : 350);
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
      try {
        cyberAudio.playSuccess();
      } catch (error) {
        /* ignore */
      }
    });
  }
}
