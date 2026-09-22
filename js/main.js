/**
 * CYBERPUNK PORTFOLIO CONTROLLER
 * Renders hero socials/stats, bento about, skills, projects,
 * experience tabs, journey timeline, contact netlinks.
 */

document.addEventListener("DOMContentLoaded", () => {
  renderHeroSocials();
  renderStats();
  renderBento();
  renderEducation();
  renderSkills();
  renderProjects();
  initExpTabs();
  renderExperience("CAREER");
  renderJourney();
  renderNetlinks();
  initTyping();
  initAudioEvents();
  initHUDControls();
  initDialogueOptions();
  initTilt();

  document.dispatchEvent(new Event("portfolio:rendered"));
});

/* ---------- Pointer tilt for cards (scoped, rAF-throttled) ---------- */
function initTilt() {
  const SEL = ".bento-card, .exp-card, .edu-card";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;
  let current = null;
  let raf = 0;
  let tx = 0;
  let ty = 0;
  const apply = () => {
    raf = 0;
    if (!current) return;
    current.style.transform =
      `perspective(900px) rotateX(${(-ty * 7).toFixed(2)}deg) rotateY(${(tx * 9).toFixed(2)}deg) translateZ(0)`;
  };
  document.addEventListener("pointermove", (e) => {
    const card = e.target && e.target.closest ? e.target.closest(SEL) : null;
    if (card !== current) {
      if (current) {
        current.style.transition = "";
        current.style.transform = "";
      }
      current = card;
      if (current) current.style.transition = "transform .08s ease-out";
    }
    if (!current) return;
    const r = current.getBoundingClientRect();
    if (!r.width || !r.height) return;
    tx = ((e.clientX - r.left) / r.width) * 2 - 1;
    ty = ((e.clientY - r.top) / r.height) * 2 - 1;
    if (!raf) raf = requestAnimationFrame(apply);
  }, { passive: true });
  document.addEventListener("pointerout", (e) => {
    if (current && !(e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest(SEL) === current)) {
      current.style.transition = "transform .35s var(--ease-out, ease)";
      current.style.transform = "";
      const done = current;
      setTimeout(() => { if (current === done) { done.style.transition = ""; current = null; } }, 360);
    }
  }, { passive: true });
}

/* ---------- Typing taglines (Kartavya changing-text) ---------- */
function initTyping() {
  const el = document.getElementById("type-target");
  if (!el || !PORTFOLIO_DATA.profile?.taglines?.length) return;
  const lines = PORTFOLIO_DATA.profile.taglines;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) { el.textContent = lines[0]; return; }

  let li = 0, ci = 0, deleting = false;
  const tick = () => {
    const line = lines[li];
    if (!deleting) {
      ci++;
      el.textContent = line.slice(0, ci);
      if (ci >= line.length) {
        deleting = true;
        setTimeout(tick, 1800);
        return;
      }
      setTimeout(tick, 42 + Math.random() * 40);
    } else {
      ci--;
      el.textContent = line.slice(0, ci);
      if (ci <= 0) {
        deleting = false;
        li = (li + 1) % lines.length;
        setTimeout(tick, 320);
        return;
      }
      setTimeout(tick, 22);
    }
  };
  setTimeout(tick, 600);
}

/* ---------- Hero socials ---------- */
function renderHeroSocials() {
  const wrap = document.getElementById("hero-socials");
  if (!wrap || !PORTFOLIO_DATA.profile?.socials) return;
  wrap.innerHTML = PORTFOLIO_DATA.profile.socials
    .map((s) => {
      const slug = ICON_SLUGS ? ICON_SLUGS[s.name] || s.icon : s.icon;
      const ic = slug && typeof icon === "function" ? icon(slug) : "";
      return `<a href="${s.url}" target="_blank" rel="noopener" class="social-orb" title="${s.name}">${ic}<span>${s.name}</span></a>`;
    })
    .join("");
}

/* ---------- Stat strip counters ---------- */
function renderStats() {
  const wrap = document.getElementById("stat-strip");
  if (!wrap || !PORTFOLIO_DATA.stats) return;
  wrap.innerHTML = PORTFOLIO_DATA.stats
    .map(
      (st) => `
    <div class="stat-cell big">
      <div class="stat-num" data-count="${st.value}">0</div>
      <div class="stat-suffix">${st.suffix || ""}</div>
      <div class="stat-label">${st.label}</div>
    </div>`
    )
    .join("");
}

/* ---------- Bento about grid ---------- */
function renderBento() {
  const wrap = document.getElementById("bento-container");
  if (!wrap || !PORTFOLIO_DATA.about) return;
  wrap.innerHTML = PORTFOLIO_DATA.about
    .map((b) => {
      const tags = (b.tags || [])
        .map((t) => {
          const slug = ICON_SLUGS ? ICON_SLUGS[t] : null;
          const ic = slug && typeof icon === "function" ? icon(slug) : "";
          return `<span class="bento-tag">${ic}${t}</span>`;
        })
        .join("");
      return `
      <article class="bento-card span-${b.span || "normal"}" data-reveal>
        <div class="bento-kicker">${b.kicker}</div>
        <h3 class="bento-title">${b.title}</h3>
        ${b.body ? `<p class="bento-body">${b.body}</p>` : ""}
        ${tags ? `<div class="bento-tags">${tags}</div>` : ""}
      </article>`;
    })
    .join("");
}

/* ---------- Education ---------- */
function renderEducation() {
  const wrap = document.getElementById("edu-container");
  if (!wrap || !PORTFOLIO_DATA.education) return;
  wrap.innerHTML = PORTFOLIO_DATA.education
    .map(
      (e) => `
    <article class="edu-card" data-reveal>
      <div class="edu-top">
        <h4>${e.title}</h4>
        <span class="edu-score">${e.score}</span>
      </div>
      <div class="edu-period">${e.period}</div>
      <p class="edu-org">${e.org}</p>
    </article>`
    )
    .join("");
}

/* ---------- Skills ---------- */
let activeSkillLevel = "PROFICIENT";

function initSkillLevels() {
  document.querySelectorAll(".skill-levels .lvl").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".skill-levels .lvl").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeSkillLevel = btn.getAttribute("data-level") || "PROFICIENT";
      cyberAudio.playTab();
      document.querySelectorAll(".skill-group").forEach((g) => {
        const lvl = g.getAttribute("data-level") || activeSkillLevel;
        g.classList.toggle("dimmed", lvl !== activeSkillLevel);
      });
    });
  });
}

function renderSkills() {
  const wrap = document.getElementById("skills-container");
  if (!wrap || !PORTFOLIO_DATA.skills) return;
  wrap.innerHTML = PORTFOLIO_DATA.skills
    .map((grp, gi) => {
      const chips = grp.items
        .map((s, i) => {
          const slug = ICON_SLUGS ? ICON_SLUGS[s] : null;
          const ic = slug && typeof icon === "function" ? icon(slug) : "";
          const delay = (i * 0.05).toFixed(2);
          return `<span class="skill-chip" style="--d:${delay}s" data-level="${grp.level}">${ic}${s}</span>`;
        })
        .join("");
      const dimmed = grp.level !== activeSkillLevel ? " dimmed" : "";
      return `
      <article class="skill-group${dimmed}" data-level="${grp.level}" data-reveal style="--d:${gi * 0.08}s">
        <div class="sg-head">
          <span class="sg-level lvl-${grp.level.toLowerCase()}">${grp.level}</span>
          <h3>${grp.category}</h3>
        </div>
        <p class="sg-desc">${grp.desc}</p>
        <div class="sg-chips">${chips}</div>
      </article>`;
    })
    .join("");
  initSkillLevels();
}

/* ---------- Projects (kartavya feed style) ---------- */
function renderProjects() {
  const wrap = document.getElementById("projects-container");
  if (!wrap || !PORTFOLIO_DATA.projects) return;
  wrap.innerHTML = PORTFOLIO_DATA.projects
    .map((p, i) => {
      const tags = (p.tags || [])
        .map((t) => {
          const slug = ICON_SLUGS ? ICON_SLUGS[t] : null;
          const ic = slug && typeof icon === "function" ? icon(slug) : "";
          return `<span class="gig-tag">${ic}${t}</span>`;
        })
        .join("");
      const idx = String(i + 1).padStart(2, "0");
      return `
      <article class="project-card" data-reveal style="--d:${(i % 4) * 0.06}s" data-id="${p.id}">
        <div class="pc-meta">
          <span class="pc-idx">${idx}</span>
          <span class="pc-period">${p.period}</span>
          <span class="pc-cat">${p.category}</span>
        </div>
        <h3 class="pc-title">${p.title}</h3>
        <p class="pc-summary">${p.summary}</p>
        <div class="pc-footer">
          <div class="gig-tags">${tags}</div>
          <div class="pc-actions">
            <span class="pc-likes">♥ ${p.likes}</span>
            <a href="${p.url}" target="_blank" rel="noopener" class="btn-cyber btn-cyber-sm btn-cyber-ghost">LEARN MORE →</a>
          </div>
        </div>
      </article>`;
    })
    .join("");
}

/* ---------- Experience tabs ---------- */
let activeExpTab = "CAREER";

function initExpTabs() {
  document.querySelectorAll(".exp-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".exp-tab").forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      activeExpTab = btn.getAttribute("data-tab") || "CAREER";
      cyberAudio.playTab();
      renderExperience(activeExpTab);
      document.dispatchEvent(new Event("portfolio:rendered"));
    });
  });
}

function renderExperience(tab) {
  const wrap = document.getElementById("experience-container");
  if (!wrap || !PORTFOLIO_DATA.experience) return;
  const rows = PORTFOLIO_DATA.experience.filter((e) => e.tab === tab);
  if (!rows.length) {
    wrap.innerHTML = `<div class="exp-empty">NO RECORDS FOR THIS CHANNEL</div>`;
    return;
  }
  wrap.innerHTML = rows
    .map(
      (e, i) => `
    <article class="exp-card" data-reveal style="--d:${i * 0.07}s">
      <div class="exp-period">${e.period}</div>
      <h3 class="exp-role">${e.role}</h3>
      <div class="exp-org">${e.org}</div>
      <p class="exp-desc">${e.desc}</p>
      ${e.likes ? `<div class="pc-likes">♥ ${e.likes}</div>` : ""}
    </article>`
    )
    .join("");
}

/* ---------- Journey report timeline ---------- */
function renderJourney() {
  const wrap = document.getElementById("journey-container");
  if (!wrap || !PORTFOLIO_DATA.journey) return;
  wrap.innerHTML = PORTFOLIO_DATA.journey
    .map((j, i) => {
      const list = (j.list || [])
        .map((li) => `<li>${li}</li>`)
        .join("");
      return `
      <div class="journey-item" data-reveal style="--d:${i * 0.08}s">
        <div class="journey-year">
          <span class="jy-dot"></span>
          <span class="jy-label">${j.year}</span>
        </div>
        <div class="journey-card">
          <p class="jy-text">${j.text}</p>
          ${list ? `<ul class="jy-list">${list}</ul>` : ""}
        </div>
      </div>`;
    })
    .join("");
}

/* ---------- Netlinks ---------- */
function renderNetlinks() {
  const wrap = document.getElementById("netlinks-container");
  if (!wrap || !PORTFOLIO_DATA.contact?.channels) return;
  wrap.innerHTML = PORTFOLIO_DATA.contact.channels
    .map((ch) => {
      const slug = ICON_SLUGS ? ICON_SLUGS[ch.name.toLowerCase()] || ch.icon : ch.icon;
      const ic = slug && typeof icon === "function" ? icon(slug) : "";
      return `
      <a href="${ch.url}" target="_blank" rel="noopener" class="netlink-btn">
        ${ic}<span>${ch.name}</span><span class="hint">${ch.hint || "OPEN"}</span>
      </a>`;
    })
    .join("");
}

/* ---------- Audio bindings ---------- */
function initAudioEvents() {
  document.body.addEventListener("mouseover", (e) => {
    if (e.target.closest(".btn-cyber, .nav-link, .exp-tab, .hud-ctrl-btn, .netlink-btn, .dlg-opt, .skill-chip, .social-orb, .project-card, .gh-repo, .gh-refresh")) {
      cyberAudio.playHover();
    }
  });
  document.body.addEventListener("click", (e) => {
    if (e.target.closest(".btn-cyber, .nav-link, .hud-ctrl-btn, .netlink-btn, .dlg-opt, .exp-tab")) {
      cyberAudio.playClick();
    }
  });
  document.querySelectorAll("input, textarea").forEach((inp) => {
    inp.addEventListener("keydown", () => cyberAudio.playKeypress());
  });
}

/* ---------- HUD controls ---------- */
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

/* ---------- Dialogue / form ---------- */
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

  const form = document.getElementById("terminal-contact-form");
  const logEl = document.getElementById("terminal-console-log");
  if (form && logEl) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      cyberAudio.playClick();
      const nameVal = document.getElementById("agent-name").value.trim() || "UNKNOWN";
      const freqVal = document.getElementById("agent-freq").value.trim() || "SECURE_RELAY";
      logEl.classList.add("active");
      logEl.innerHTML = `
        <div>>> [UPLINK INITIATED] Connecting to proxy node...</div>
        <div>>> Sender: ${nameVal} [${freqVal}]</div>
        <div>>> Encrypting payload with 2048-bit ICE...</div>
        <div>>> Relay ping: 14ms [OK]</div>
        <div style="color:var(--c-yellow);font-weight:bold">>> [TRANSMISSION CONFIRMED] Logged.</div>
      `;
      cyberAudio.playSuccess();
      form.reset();
    });
  }
}
