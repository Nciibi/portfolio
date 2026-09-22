/**
 * CYBERPUNK 2077 PORTFOLIO CONTROLLER
 * Renders data-driven sections, the journal master/detail view,
 * the dialogue contact terminal, and the shard reader modal.
 */

document.addEventListener("DOMContentLoaded", () => {
  initHUDClock();
  renderAttributes();
  renderCyberware();
  renderGigs("all");
  renderBraindance();
  renderNetlinks();
  initAttributeExpand();
  initGigFilters();
  initAudioEvents();
  initHUDControls();
  initModalEvents();
  initTerminalTransmission();
  initDialogueOptions();

  /* Let the motion layer scan freshly-rendered nodes. */
  document.dispatchEvent(new Event("portfolio:rendered"));
});

/* ---------------------------------------------------------------------------
   1. REAL-TIME NIGHT CITY HUD CLOCK
   --------------------------------------------------------------------------- */
function initHUDClock() {
  const clockEl = document.getElementById("hud-clock");
  if (!clockEl) return;

  function update() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, "0");
    const m = String(now.getMinutes()).padStart(2, "0");
    const s = String(now.getSeconds()).padStart(2, "0");
    clockEl.textContent = `2077.10.24 // ${h}:${m}:${s}`;
  }
  update();
  setInterval(update, 1000);
}

/* ---------------------------------------------------------------------------
   2. RENDER ATTRIBUTES (CHARACTER SCREEN)
   --------------------------------------------------------------------------- */
function renderAttributes() {
  const container = document.getElementById("attributes-container");
  if (!container || !PORTFOLIO_DATA.attributes) return;

  container.innerHTML =
    PORTFOLIO_DATA.attributes
      .map((attr) => {
        const glyph = (ATTR_GLYPHS && ATTR_GLYPHS[attr.glyph]) || "";
        return `
      <button type="button" class="attribute-card" data-attr="${attr.id}" aria-expanded="false">
        <span class="attr-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
               stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${glyph}</svg>
        </span>
        <span class="attr-name">${attr.name}</span>
        <span class="attr-spec">${attr.spec}</span>
        <span class="attr-level">
          <b data-count="${attr.level}">0</b><span>/ ${attr.max}</span>
        </span>
        <span class="attr-bar-wrap"><span class="attr-bar-fill" data-fill="${attr.meter}"></span></span>
      </button>`;
      })
      .join("") +
    `
    <div class="attr-detail" id="attr-detail" aria-live="polite">
      <div class="attr-detail-inner">
        <div class="attr-detail-idx" id="attr-detail-idx">01</div>
        <div>
          <h4 id="attr-detail-title">—</h4>
          <p id="attr-detail-desc">—</p>
        </div>
        <div class="attr-detail-meta" id="attr-detail-meta"></div>
      </div>
    </div>`;
}

function initAttributeExpand() {
  const container = document.getElementById("attributes-container");
  const detail = document.getElementById("attr-detail");
  if (!container || !detail) return;

  container.addEventListener("click", (e) => {
    const card = e.target.closest(".attribute-card");
    if (!card) return;

    const id = card.getAttribute("data-attr");
    const attr = PORTFOLIO_DATA.attributes.find((a) => a.id === id);
    if (!attr) return;

    const wasActive = card.classList.contains("active");
    container.querySelectorAll(".attribute-card").forEach((c) => {
      c.classList.remove("active");
      c.setAttribute("aria-expanded", "false");
    });

    if (wasActive) {
      detail.classList.remove("open");
      cyberAudio.playTab();
      return;
    }

    card.classList.add("active");
    card.setAttribute("aria-expanded", "true");

    const idx = PORTFOLIO_DATA.attributes.indexOf(attr) + 1;
    document.getElementById("attr-detail-idx").textContent = String(idx).padStart(2, "0");
    document.getElementById("attr-detail-title").textContent = attr.name + " // " + attr.perk;
    document.getElementById("attr-detail-desc").textContent = attr.desc;
    document.getElementById("attr-detail-meta").innerHTML =
      `<b>${attr.level}/${attr.max}</b>${attr.perkNote || attr.spec}`;

    detail.classList.remove("open");
    void detail.offsetWidth; /* restart animation */
    detail.classList.add("open");
    cyberAudio.playTab();
  });
}

/* ---------------------------------------------------------------------------
   3. RENDER CYBERWARE & SKILLS MATRIX
   --------------------------------------------------------------------------- */
function renderCyberware() {
  const container = document.getElementById("cyberware-container");
  if (!container || !PORTFOLIO_DATA.cyberware) return;

  container.innerHTML = PORTFOLIO_DATA.cyberware
    .map((cw) => {
      const emblemSlug = ICON_SLUGS && cw.emblem ? ICON_SLUGS[cw.emblem] || cw.emblem : null;
      const emblem = emblemSlug && typeof icon === "function" ? icon(emblemSlug) : "";

      const tags = cw.skills
        .map((s) => {
          const slug = ICON_SLUGS ? ICON_SLUGS[s] : null;
          const ic = slug && typeof icon === "function" ? icon(slug) : "";
          return `<span class="skill-tag">${ic}${s}</span>`;
        })
        .join("");

      return `
      <article class="cyberware-card rarity-${cw.rarity}" data-reveal="scale">
        <div class="cw-header">
          <span class="cw-category">${cw.category}</span>
          <span class="cw-rarity-badge">${cw.rarity}</span>
        </div>
        <div class="cw-head-row">
          <span class="cw-emblem">${emblem}</span>
          <div>
            <h3 class="cw-name">${cw.name}</h3>
            <div class="cw-slot">${cw.slot}</div>
          </div>
        </div>
        <p class="cw-desc">${cw.desc}</p>
        <div class="cw-skills-tags">${tags}</div>
      </article>`;
    })
    .join("");
}

/* ---------------------------------------------------------------------------
   4. RENDER FIXER GIGS — JOURNAL MASTER / DETAIL
   --------------------------------------------------------------------------- */
let activeGigFilter = "all";
let activeGigId = null;

function getFilteredGigs() {
  const gigs = PORTFOLIO_DATA.gigs || [];
  return activeGigFilter === "all"
    ? gigs
    : gigs.filter((g) => g.category === activeGigFilter);
}

function renderGigs(filterCategory = "all") {
  activeGigFilter = filterCategory;

  const list = document.getElementById("gigs-container");
  const detail = document.getElementById("gig-detail");
  const count = document.getElementById("gig-count");
  if (!list || !detail) return;

  const filtered = getFilteredGigs();
  if (count) count.textContent = String(filtered.length).padStart(2, "0") + " RECORDS";

  if (!filtered.length) {
    list.innerHTML = `<div class="gig-row" style="cursor:default">NO CONTRACTS MATCH FILTER</div>`;
    detail.innerHTML = "";
    return;
  }

  if (!filtered.some((g) => g.id === activeGigId)) {
    activeGigId = filtered[0].id;
  }

  list.innerHTML = filtered
    .map(
      (gig, i) => `
    <button type="button" class="gig-row ${gig.id === activeGigId ? "active" : ""}"
            data-id="${gig.id}" role="option" aria-selected="${gig.id === activeGigId}">
      <span class="gig-row-idx">${String(i + 1).padStart(2, "0")}</span>
      <span>
        <span class="gig-row-title">${gig.title}</span>
        <span class="gig-row-fixer">${gig.fixer}</span>
      </span>
      <span class="gig-row-reward">${gig.reward}</span>
    </button>`
    )
    .join("");

  list.querySelectorAll(".gig-row[data-id]").forEach((row) => {
    row.addEventListener("click", () => {
      const id = row.getAttribute("data-id");
      if (id === activeGigId) return;
      activeGigId = id;
      cyberAudio.playTab();
      list.querySelectorAll(".gig-row").forEach((r) => {
        r.classList.toggle("active", r.getAttribute("data-id") === id);
        r.setAttribute("aria-selected", String(r.getAttribute("data-id") === id));
      });
      renderGigDetail(id);
    });
  });

  renderGigDetail(activeGigId);
}

function renderGigDetail(gigId) {
  const detail = document.getElementById("gig-detail");
  const gig = (PORTFOLIO_DATA.gigs || []).find((g) => g.id === gigId);
  if (!detail || !gig) return;

  const tags = gig.tags
    .map((t) => {
      const slug = ICON_SLUGS ? ICON_SLUGS[t] : null;
      const ic = slug && typeof icon === "function" ? icon(slug) : "";
      return `<span class="gig-tag">${ic}${t}</span>`;
    })
    .join("");

  detail.innerHTML = `
    <div class="gig-detail-media">
      <img src="${gig.image}" alt="${gig.title}" />
      <span class="gig-danger-badge">THREAT: ${gig.dangerLevel}</span>
      <span class="gig-detail-status">${gig.status}</span>
      <div class="gig-detail-heading"><h3>${gig.title}</h3></div>
    </div>
    <div class="gig-detail-body">
      <div class="gig-meta">
        <div class="gig-meta-item"><div class="k">FIXER</div><div class="v cyan">${gig.fixer}</div></div>
        <div class="gig-meta-item"><div class="k">PAYOUT</div><div class="v yellow">${gig.reward}</div></div>
        <div class="gig-meta-item"><div class="k">STATUS</div><div class="v">${gig.status}</div></div>
        <div class="gig-meta-item"><div class="k">THREAT</div><div class="v" style="color:var(--c-red)">${gig.dangerLevel}</div></div>
      </div>
      <p class="gig-summary">${gig.summary}</p>
      <div class="gig-brief">
        <h4>// ARCHIVAL MISSION BRIEF &amp; DEEP SPECIFICATIONS</h4>
        <p>${gig.details}</p>
      </div>
      <div class="gig-tags">${tags}</div>
      <div class="gig-card-actions">
        <button type="button" class="btn-cyber btn-cyber-red btn-cyber-sm gig-modal-trigger" data-id="${gig.id}">
          VIEW DOSSIER
        </button>
        <a href="${gig.repoUrl}" target="_blank" rel="noopener" class="btn-cyber btn-cyber-ghost btn-cyber-sm">
          SOURCE CODE
        </a>
        <a href="${gig.demoUrl}" target="_blank" rel="noopener" class="btn-cyber btn-cyber-ghost btn-cyber-sm">
          LIVE INTERFACE
        </a>
      </div>
    </div>`;

  const trigger = detail.querySelector(".gig-modal-trigger");
  if (trigger) trigger.addEventListener("click", () => openGigModal(gig.id));
}

function initGigFilters() {
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      cyberAudio.playTab();
      renderGigs(btn.getAttribute("data-filter"));
    });
  });
}

/* ---------------------------------------------------------------------------
   5. RENDER BRAINDANCE CAREER TIMELINE
   --------------------------------------------------------------------------- */
function renderBraindance() {
  const container = document.getElementById("braindance-container");
  if (!container || !PORTFOLIO_DATA.braindance) return;

  container.innerHTML = PORTFOLIO_DATA.braindance
    .map(
      (bd, i) => `
    <div class="bd-track-item" data-reveal style="--d:${i * 0.07}s">
      <div class="bd-track-dot">${String(i + 1).padStart(2, "0")}</div>
      <div class="bd-item-card">
        <div class="bd-item-meta">
          <span class="bd-period">${bd.period}</span>
          <span class="bd-track-id">${bd.track}</span>
        </div>
        <h3 class="bd-role">${bd.role}</h3>
        <div class="bd-org">${bd.organization}</div>
        <ul class="bd-highlights">
          ${bd.highlights.map((h) => `<li>${h}</li>`).join("")}
        </ul>
      </div>
    </div>`
    )
    .join("");
}

/* ---------------------------------------------------------------------------
   6. RENDER SOCIAL NETLINKS
   --------------------------------------------------------------------------- */
function renderNetlinks() {
  const container = document.getElementById("netlinks-container");
  if (!container || !PORTFOLIO_DATA.uplink) return;

  container.innerHTML = PORTFOLIO_DATA.uplink.commChannels
    .map((ch) => {
      const slug = ICON_SLUGS ? ICON_SLUGS[ch.name.toLowerCase()] || ch.icon : ch.icon;
      const ic = slug && typeof icon === "function" ? icon(slug) : "";
      return `
    <a href="${ch.url}" target="_blank" rel="noopener" class="netlink-btn">
      ${ic}
      <span>${ch.name}</span>
      <span class="hint">${ch.hint || "OPEN"}</span>
    </a>`;
    })
    .join("");
}

/* ---------------------------------------------------------------------------
   7. SHARD READER MODAL
   --------------------------------------------------------------------------- */
function openGigModal(gigId) {
  const gig = (PORTFOLIO_DATA.gigs || []).find((g) => g.id === gigId);
  if (!gig) return;

  const modal = document.getElementById("gig-modal");
  const modalBody = document.getElementById("modal-body-content");
  if (!modal || !modalBody) return;

  const tags = gig.tags
    .map((t) => {
      const slug = ICON_SLUGS ? ICON_SLUGS[t] : null;
      const ic = slug && typeof icon === "function" ? icon(slug) : "";
      return `<span class="gig-tag">${ic}${t}</span>`;
    })
    .join("");

  modalBody.innerHTML = `
    <div class="modal-img-wrap"><img src="${gig.image}" alt="${gig.title}" /></div>
    <div class="modal-meta">
      <span class="fixer">FIXER: ${gig.fixer}</span>
      <span class="payout">PAYOUT: ${gig.reward}</span>
    </div>
    <h2>${gig.title}</h2>
    <p>${gig.summary}</p>
    <div class="modal-block">
      <h4>// ARCHIVAL MISSION BRIEF &amp; DEEP SPECIFICATIONS</h4>
      <p>${gig.details}</p>
    </div>
    <div style="margin-bottom:1.4rem">
      <div style="font-family:var(--font-mono);font-size:.66rem;letter-spacing:.16em;color:var(--txt-4);margin-bottom:.5rem">
        DEPLOYED CYBER TECH:
      </div>
      <div class="gig-tags">${tags}</div>
    </div>
    <div style="display:flex;gap:.75rem;flex-wrap:wrap">
      <a href="${gig.demoUrl}" target="_blank" rel="noopener" class="btn-cyber btn-cyber-yellow btn-cyber-sm">LAUNCH LIVE INTERFACE</a>
      <a href="${gig.repoUrl}" target="_blank" rel="noopener" class="btn-cyber btn-cyber-ghost btn-cyber-sm">ACCESS SOURCE CODE</a>
    </div>`;

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
  cyberAudio.playClick();
}

function closeGigModal() {
  const modal = document.getElementById("gig-modal");
  if (!modal) return;
  modal.classList.remove("active");
  document.body.style.overflow = "";
}

function initModalEvents() {
  const modal = document.getElementById("gig-modal");
  const closeBtn = document.getElementById("modal-close");
  if (!modal || !closeBtn) return;

  closeBtn.addEventListener("click", () => {
    closeGigModal();
    cyberAudio.playClick();
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeGigModal();
      cyberAudio.playClick();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeGigModal();
    }
  });
}

/* ---------------------------------------------------------------------------
   8. AUDIO EVENT BINDINGS
   --------------------------------------------------------------------------- */
function initAudioEvents() {
  document.body.addEventListener("mouseover", (e) => {
    if (e.target.closest(".btn-cyber, .nav-link, .filter-btn, .hud-ctrl-btn, .netlink-btn, .dlg-opt, .gig-row, .attribute-card")) {
      cyberAudio.playHover();
    }
  });

  document.body.addEventListener("click", (e) => {
    if (e.target.closest(".btn-cyber, .nav-link, .hud-ctrl-btn, .netlink-btn, .dlg-opt, .attribute-card")) {
      cyberAudio.playClick();
    }
  });

  document.querySelectorAll("input, textarea").forEach((inp) => {
    inp.addEventListener("keydown", () => cyberAudio.playKeypress());
  });
}

/* ---------------------------------------------------------------------------
   9. HUD CONTROLS (SFX + CRT)
   --------------------------------------------------------------------------- */
function initHUDControls() {
  const audioBtn = document.getElementById("btn-toggle-audio");
  if (audioBtn) {
    const sync = () => {
      audioBtn.textContent = cyberAudio.isMuted ? "SFX OFF" : "SFX ON";
      audioBtn.classList.toggle("on", !cyberAudio.isMuted);
      audioBtn.setAttribute("aria-pressed", String(!cyberAudio.isMuted));
    };
    sync();
    audioBtn.addEventListener("click", () => {
      cyberAudio.toggleMute();
      sync();
    });
  }

  const crtBtn = document.getElementById("btn-toggle-crt");
  if (crtBtn) {
    crtBtn.addEventListener("click", () => {
      document.body.classList.toggle("crt-disabled");
      const disabled = document.body.classList.contains("crt-disabled");
      crtBtn.textContent = disabled ? "CRT OFF" : "CRT ON";
      crtBtn.classList.toggle("on", !disabled);
      crtBtn.setAttribute("aria-pressed", String(!disabled));
    });
  }
}

/* ---------------------------------------------------------------------------
   10. NETWATCH JACK-IN / CONTACT TRANSMISSION LOG
   --------------------------------------------------------------------------- */
function initTerminalTransmission() {
  const form = document.getElementById("terminal-contact-form");
  const logEl = document.getElementById("terminal-console-log");
  if (!form || !logEl) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    cyberAudio.playClick();

    const nameVal = document.getElementById("agent-name").value.trim() || "UNKNOWN_MERC";
    const freqVal = document.getElementById("agent-freq").value.trim() || "SECURE_RELAY";

    logEl.classList.add("active");
    logEl.innerHTML = `
      <div>>> [NETWATCH LINK INITIATED] Connecting to proxy node...</div>
      <div>>> Sender: ${nameVal} [${freqVal}]</div>
      <div>>> Encrypting payload with 2048-bit Militech ICE...</div>
      <div>>> Relay ping: 14ms latency [OK]</div>
      <div style="color:var(--c-yellow);font-weight:bold">>> [TRANSMISSION CONFIRMED] Logged in V's neural queue.</div>
    `;

    cyberAudio.playSuccess();
    form.reset();
  });
}

/* ---------------------------------------------------------------------------
   11. DIALOGUE OPTIONS
   --------------------------------------------------------------------------- */
function initDialogueOptions() {
  document.querySelectorAll("[data-scroll-to]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = document.querySelector(btn.getAttribute("data-scroll-to"));
      if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => {
        const first = target.querySelector("input, textarea");
        if (first) first.focus({ preventScroll: true });
      }, 500);
    });
  });

  const netlinksBtn = document.getElementById("dlg-netlinks");
  const netlinks = document.getElementById("netlinks-container");
  if (netlinksBtn && netlinks) {
    netlinksBtn.addEventListener("click", () => {
      netlinks.scrollIntoView({ behavior: "smooth", block: "center" });
      netlinks.querySelectorAll(".netlink-btn").forEach((el, i) => {
        el.style.animation = "none";
        void el.offsetWidth;
        el.style.animation = `fade-line .4s ${i * 0.07}s forwards`;
        el.style.opacity = "0";
      });
    });
  }
}
