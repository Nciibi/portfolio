/**
 * CYBERPUNK 2077 PORTFOLIO CONTROLLER & INTERACTIONS
 * Connects portfolio data, HUD clocks, audio synthesis,
 * project modals, and interactive terminal transmissions.
 */

document.addEventListener("DOMContentLoaded", () => {
  initHUDClock();
  renderAttributes();
  renderCyberware();
  renderGigs("all");
  renderBraindance();
  renderNetlinks();
  initAudioEvents();
  initHUDControls();
  initModalEvents();
  initTerminalTransmission();
});

/* --------------------------------------------------------------------------
   1. REAL-TIME NIGHT CITY HUD CLOCK & SYSTEM MONITOR
   -------------------------------------------------------------------------- */
function initHUDClock() {
  const clockEl = document.getElementById("hud-clock");
  if (!clockEl) return;

  function update() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    clockEl.textContent = `2077.10.24 // ${h}:${m}:${s}`;
  }
  update();
  setInterval(update, 1000);
}

/* --------------------------------------------------------------------------
   2. RENDER ATTRIBUTES (CHARACTER SHEET)
   -------------------------------------------------------------------------- */
function renderAttributes() {
  const container = document.getElementById("attributes-container");
  if (!container || !PORTFOLIO_DATA.attributes) return;

  container.innerHTML = PORTFOLIO_DATA.attributes.map(attr => `
    <div class="attribute-card">
      <div class="attribute-top">
        <span class="attr-name">${attr.name}</span>
        <span class="attr-lvl">${attr.level}/${attr.max}</span>
      </div>
      <div class="attr-spec">${attr.spec}</div>
      <p class="attr-desc">${attr.desc}</p>
      <div class="attr-bar-wrap">
        <div class="attr-bar-fill" style="width: ${attr.meter}%;"></div>
      </div>
    </div>
  `).join("");
}

/* --------------------------------------------------------------------------
   3. RENDER CYBERWARE & SKILLS MATRIX
   -------------------------------------------------------------------------- */
function renderCyberware() {
  const container = document.getElementById("cyberware-container");
  if (!container || !PORTFOLIO_DATA.cyberware) return;

  container.innerHTML = PORTFOLIO_DATA.cyberware.map(cw => `
    <div class="cyberware-card rarity-${cw.rarity}">
      <div class="cw-header">
        <span class="cw-category">${cw.category} [${cw.slot}]</span>
        <span class="cw-rarity-badge">${cw.rarity}</span>
      </div>
      <h3 class="cw-name">${cw.name}</h3>
      <p class="cw-desc">${cw.desc}</p>
      <div class="cw-skills-tags">
        ${cw.skills.map(s => `<span class="skill-tag">${s}</span>`).join("")}
      </div>
    </div>
  `).join("");
}

/* --------------------------------------------------------------------------
   4. RENDER FIXER GIGS & FILTERING
   -------------------------------------------------------------------------- */
function renderGigs(filterCategory = "all") {
  const container = document.getElementById("gigs-container");
  if (!container || !PORTFOLIO_DATA.gigs) return;

  const filtered = filterCategory === "all"
    ? PORTFOLIO_DATA.gigs
    : PORTFOLIO_DATA.gigs.filter(g => g.category === filterCategory);

  container.innerHTML = filtered.map(gig => `
    <div class="gig-card" data-id="${gig.id}">
      <div class="gig-image-wrap">
        <img src="${gig.image}" alt="${gig.title}" loading="lazy" />
        <span class="gig-danger-badge">THREAT: ${gig.dangerLevel}</span>
      </div>
      <div class="gig-content">
        <div class="gig-meta">
          <span class="gig-fixer">${gig.fixer}</span>
          <span class="gig-reward">${gig.reward}</span>
        </div>
        <h3 class="gig-title">${gig.title}</h3>
        <p class="gig-summary">${gig.summary}</p>
        <div class="gig-tags">
          ${gig.tags.map(t => `<span class="gig-tag">${t}</span>`).join("")}
        </div>
        <div class="gig-card-actions">
          <button class="btn-cyber btn-cyber-yellow btn-cyber-sm gig-modal-trigger" data-id="${gig.id}">
            <span class="corner-bracket-tl"></span>
            <span class="corner-bracket-br"></span>
            VIEW DOSSIER
          </button>
          <a href="${gig.repoUrl}" target="_blank" rel="noopener" class="btn-cyber btn-cyber-ghost btn-cyber-sm">
            <span class="corner-bracket-tl"></span>
            <span class="corner-bracket-br"></span>
            SOURCE CODE
          </a>
        </div>
      </div>
    </div>
  `).join("");

  // Re-bind modal buttons
  document.querySelectorAll(".gig-modal-trigger").forEach(btn => {
    btn.addEventListener("click", () => {
      const gigId = btn.getAttribute("data-id");
      openGigModal(gigId);
    });
  });
}

// Setup Filter Buttons
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    cyberAudio.playTab();
    const cat = btn.getAttribute("data-filter");
    renderGigs(cat);
  });
});

/* --------------------------------------------------------------------------
   5. RENDER BRAINDANCE CAREER TIMELINE
   -------------------------------------------------------------------------- */
function renderBraindance() {
  const container = document.getElementById("braindance-container");
  if (!container || !PORTFOLIO_DATA.braindance) return;

  container.innerHTML = PORTFOLIO_DATA.braindance.map((bd, i) => `
    <div class="bd-track-item">
      <div class="bd-track-dot">0${i + 1}</div>
      <div class="bd-item-card">
        <div class="bd-item-meta">
          <span class="bd-period">${bd.period}</span>
          <span class="bd-track-id">${bd.track}</span>
        </div>
        <h3 class="bd-role">${bd.role}</h3>
        <div class="bd-org">${bd.organization}</div>
        <ul class="bd-highlights">
          ${bd.highlights.map(h => `<li>${h}</li>`).join("")}
        </ul>
      </div>
    </div>
  `).join("");
}

/* --------------------------------------------------------------------------
   6. RENDER SOCIAL NETLINKS
   -------------------------------------------------------------------------- */
function renderNetlinks() {
  const container = document.getElementById("netlinks-container");
  if (!container || !PORTFOLIO_DATA.uplink) return;

  container.innerHTML = PORTFOLIO_DATA.uplink.commChannels.map(ch => `
    <a href="${ch.url}" target="_blank" rel="noopener" class="netlink-btn">
      <span>[NET]</span>
      <span>${ch.name}</span>
    </a>
  `).join("");
}

/* --------------------------------------------------------------------------
   7. GIG MODAL CONTROLLER
   -------------------------------------------------------------------------- */
function openGigModal(gigId) {
  const gig = PORTFOLIO_DATA.gigs.find(g => g.id === gigId);
  if (!gig) return;

  const modal = document.getElementById("gig-modal");
  const modalBody = document.getElementById("modal-body-content");
  if (!modal || !modalBody) return;

  modalBody.innerHTML = `
    <div class="modal-img-wrap">
      <img src="${gig.image}" alt="${gig.title}" />
    </div>
    <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1rem;">
      <span style="font-family: var(--font-mono); color: var(--cyber-yellow); font-size: 0.85rem;">
        FIXER: ${gig.fixer}
      </span>
      <span style="font-family: var(--font-mono); color: var(--cyber-cyan); font-weight: bold; font-size: 1rem;">
        PAYOUT: ${gig.reward}
      </span>
    </div>
    <h2 style="font-family: var(--font-display); color: #FFF; font-size: 1.5rem; margin-bottom: 1rem;">
      ${gig.title}
    </h2>
    <p style="color: #CBD5E1; font-size: 1rem; line-height: 1.6; margin-bottom: 1.25rem;">
      ${gig.summary}
    </p>
    <div style="background: rgba(8, 10, 14, 0.85); border-left: 3px solid var(--cyber-yellow); padding: 1rem; margin-bottom: 1.5rem;">
      <h4 style="font-family: var(--font-mono); color: var(--cyber-yellow); font-size: 0.8rem; margin-bottom: 0.5rem; text-transform: uppercase;">
        // ARCHIVAL MISSION BRIEF & DEEP SPECIFICATIONS:
      </h4>
      <p style="color: #94A3B8; font-size: 0.9rem; line-height: 1.5;">
        ${gig.details}
      </p>
    </div>
    <div style="margin-bottom: 1.5rem;">
      <div style="font-family: var(--font-mono); font-size: 0.75rem; color: #64748B; margin-bottom: 0.5rem;">DEPLOYED CYBER TECH:</div>
      <div class="gig-tags">
        ${gig.tags.map(t => `<span class="gig-tag">${t}</span>`).join("")}
      </div>
    </div>
    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
      <a href="${gig.demoUrl}" target="_blank" rel="noopener" class="btn-cyber btn-cyber-yellow">
        <span class="corner-bracket-tl"></span>
        <span class="corner-bracket-br"></span>
        LAUNCH LIVE INTERFACE
      </a>
      <a href="${gig.repoUrl}" target="_blank" rel="noopener" class="btn-cyber btn-cyber-ghost">
        <span class="corner-bracket-tl"></span>
        <span class="corner-bracket-br"></span>
        ACCESS SOURCE CODE
      </a>
    </div>
  `;

  modal.classList.add("active");
  cyberAudio.playClick();
}

function initModalEvents() {
  const modal = document.getElementById("gig-modal");
  const closeBtn = document.getElementById("modal-close");
  if (!modal || !closeBtn) return;

  closeBtn.addEventListener("click", () => {
    modal.classList.remove("active");
    cyberAudio.playClick();
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
      cyberAudio.playClick();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      modal.classList.remove("active");
    }
  });
}

/* --------------------------------------------------------------------------
   8. AUDIO & INTERACTION EVENT BINDINGS
   -------------------------------------------------------------------------- */
function initAudioEvents() {
  // Delegate hover sound on buttons, links, and cards
  document.body.addEventListener("mouseover", (e) => {
    if (e.target.closest(".btn-cyber, .nav-link, .filter-btn, .hud-ctrl-btn, .netlink-btn")) {
      cyberAudio.playHover();
    }
  });

  // Delegate click sound
  document.body.addEventListener("click", (e) => {
    if (e.target.closest(".btn-cyber, .nav-link, .hud-ctrl-btn, .netlink-btn")) {
      cyberAudio.playClick();
    }
  });

  // Typing sound on form inputs
  const inputs = document.querySelectorAll("input, textarea");
  inputs.forEach(inp => {
    inp.addEventListener("keydown", () => {
      cyberAudio.playKeypress();
    });
  });
}

/* --------------------------------------------------------------------------
   9. HUD CONTROLS (AUDIO TOGGLE & CRT SCANLINE TOGGLE)
   -------------------------------------------------------------------------- */
function initHUDControls() {
  const audioBtn = document.getElementById("btn-toggle-audio");
  if (audioBtn) {
    audioBtn.textContent = cyberAudio.isMuted ? "SFX: OFF" : "SFX: ON";
    audioBtn.addEventListener("click", () => {
      const muted = cyberAudio.toggleMute();
      audioBtn.textContent = muted ? "SFX: OFF" : "SFX: ON";
    });
  }

  const crtBtn = document.getElementById("btn-toggle-crt");
  if (crtBtn) {
    crtBtn.addEventListener("click", () => {
      document.body.classList.toggle("crt-disabled");
      const disabled = document.body.classList.contains("crt-disabled");
      crtBtn.textContent = disabled ? "CRT: OFF" : "CRT: ON";
    });
  }
}

/* --------------------------------------------------------------------------
   10. NETWATCH JACK-IN / CONTACT TRANSMISSION LOG
   -------------------------------------------------------------------------- */
function initTerminalTransmission() {
  const form = document.getElementById("terminal-contact-form");
  const logEl = document.getElementById("terminal-console-log");
  if (!form || !logEl) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    cyberAudio.playClick();

    const nameVal = document.getElementById("agent-name").value.trim() || "UNKNOWN_MERC";
    const freqVal = document.getElementById("agent-freq").value.trim() || "SECURE_RELAY";
    const msgVal = document.getElementById("agent-msg").value.trim();

    logEl.classList.add("active");
    logEl.innerHTML = `
      <div>>> [NETWATCH LINK INITIATED] Connecting to proxy node...</div>
      <div>>> Sender: ${nameVal} [${freqVal}]</div>
      <div>>> Encrypting transmission payload with 2048-bit Militech ICE...</div>
    `;

    setTimeout(() => {
      logEl.innerHTML += `<div>>> Pinging Night City Netrunner relay: 14ms latency [OK]</div>`;
    }, 450);

    setTimeout(() => {
      logEl.innerHTML += `
        <div style="color: var(--cyber-yellow); font-weight: bold; margin-top: 6px;">
          >> [TRANSMISSION CONFIRMED] Message logged in V's cyberdeck neural queue. Stand by for contact.
        </div>
      `;
      cyberAudio.playSuccess();
      form.reset();
    }, 1000);
  });
}
