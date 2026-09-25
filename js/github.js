/* ==========================================================================
 * github.js — Open-source section for Nciibi.
 * Renders a baked snapshot instantly, then tries a live refresh of the
 * public GitHub API (repo/user endpoints support CORS). Any failure keeps
 * the snapshot — the section never renders empty.
 * ========================================================================== */
(function () {
  'use strict';

  const section = document.getElementById('github');
  if (!section || typeof GITHUB_SNAPSHOT === 'undefined') return;

  const reposBox = document.getElementById('gh-repos');
  const langsBox = document.getElementById('gh-langs');
  const feedBox = document.getElementById('gh-feed');
  const liveDot = document.getElementById('gh-live-dot');
  const liveText = document.getElementById('gh-live-text');
  const refreshBtn = document.getElementById('gh-refresh');
  if (!reposBox || !langsBox || !feedBox) return;

  const USER = 'Nciibi';
  const CACHE_KEY = 'gh_live_v1';
  const CACHE_MS = 30 * 60 * 1000;
  let hasRendered = false;
  let syncStarted = false;
  let syncScheduled = false;

  const LANG_COLORS = {
    Python: '#3572A5', Rust: '#DEA584', JavaScript: '#F1E05A', Go: '#00ADD8',
    Kotlin: '#A97BFF', TypeScript: '#3178C6', C: '#8A8F98', 'C++': '#F34B7D',
    Makefile: '#427819', Dart: '#00B4AB'
  };

  const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  function timeAgo(iso) {
    const t = new Date(iso).getTime();
    if (isNaN(t)) return '';
    const s = Math.max(0, (Date.now() - t) / 1000);
    if (s < 3600) return Math.max(1, Math.floor(s / 60)) + 'm ago';
    if (s < 86400) return Math.floor(s / 3600) + 'h ago';
    if (s < 86400 * 30) return Math.floor(s / 86400) + 'd ago';
    return new Date(t).toISOString().slice(0, 10);
  }

  function setBadge(mode, label) {
    if (liveDot) liveDot.className = 'gh-live-dot ' + (mode === 'live' ? 'on' : mode === 'sync' ? 'sync' : 'off');
    if (liveText) liveText.textContent = label;
  }

  function setCounter(id, n) {
    const el = document.getElementById(id);
    if (!el) return;
    delete el.dataset.counted;
    el.setAttribute('data-count', String(n));
  }

  function render(data, badge) {
    const repos = (data.repos || []).slice();
    const user = data.user || {};
    const stars = repos.reduce((a, r) => a + (r.stars || 0), 0);

    setBadge(badge.mode, badge.label);
    setCounter('gh-c-repos', user.public_repos != null ? user.public_repos : repos.length);
    setCounter('gh-c-stars', stars);
    setCounter('gh-c-followers', user.followers || 0);
    setCounter('gh-c-following', user.following || 0);

    /* top repos by stars, then most recently updated */
    const top = repos
      .slice()
      .sort((a, b) => (b.stars - a.stars) || String(b.updated).localeCompare(String(a.updated)))
      .slice(0, 6);
    reposBox.innerHTML = top
      .map((r, i) => {
        const lang = r.lang || 'Other';
        const col = LANG_COLORS[lang] || '#6E7C92';
        return `
        <a class="gh-repo" data-reveal style="--d:${(i * 0.06).toFixed(2)}s" href="${esc(r.url)}" target="_blank" rel="noopener">
          <div class="gh-repo-top">
            <span class="gh-lang"><i style="background:${col}"></i>${esc(lang)}</span>
            <span class="gh-repo-stats">★ ${r.stars} · ⑂ ${r.forks}</span>
          </div>
          <h4 class="gh-repo-name">${esc(r.name)}</h4>
          <p class="gh-repo-desc">${esc(r.desc || 'No description yet — code speaks.')}</p>
          <div class="gh-repo-foot"><span>UPDATED ${esc(r.updated || '—')}</span><span class="gh-open">OPEN →</span></div>
        </a>`;
      })
      .join('');

    /* languages by repository count */
    const counts = {};
    repos.forEach((r) => { if (r.lang) counts[r.lang] = (counts[r.lang] || 0) + 1; });
    const langs = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8);
    const total = Math.max(1, repos.filter((r) => r.lang).length);
    langsBox.innerHTML = langs
      .map(([lang, n], i) => {
        const col = LANG_COLORS[lang] || '#6E7C92';
        const pct = Math.round((n / total) * 100);
        return `
        <div class="gh-lang-row" data-reveal style="--d:${(i * 0.05).toFixed(2)}s">
          <span class="gh-lang-name"><i style="background:${col}"></i>${esc(lang)}</span>
          <span class="gh-bar"><i data-fill="${pct}" style="background:${col}"></i></span>
          <span class="gh-lang-n">${n} · ${pct}%</span>
        </div>`;
      })
      .join('');

    /* recent pushes */
    const feed = (data.events || []).slice(0, 8);
    feedBox.innerHTML = feed.length
      ? feed.map((e, i) => {
          const repo = esc(String(e.repo || '?').replace(/^Nciibi\//, ''));
          const n = e.size > 1 ? `${e.size} commits` : 'a commit';
          return `
          <div class="gh-event" data-reveal style="--d:${(i * 0.05).toFixed(2)}s">
            <span class="gh-ev-dot"></span>
            <div><div class="gh-ev-text">Pushed ${n} to <b>${repo}</b></div>
            <div class="gh-ev-time">${esc(timeAgo(e.at))}</div></div>
          </div>`;
        }).join('')
      : '<div class="gh-event"><span class="gh-ev-dot"></span><div><div class="gh-ev-text">Activity feed unavailable offline.</div></div></div>';

    document.dispatchEvent(new Event('portfolio:rendered'));
  }

  async function fetchLive(signal) {
    const get = async (url) => {
      const r = await fetch(url, { headers: { Accept: 'application/vnd.github.v3+json' }, signal });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    };
    const [u, repos, events] = await Promise.all([
      get(`https://api.github.com/users/${USER}`),
      get(`https://api.github.com/users/${USER}/repos?per_page=100&sort=updated`),
      get(`https://api.github.com/users/${USER}/events/public?per_page=10`).catch(() => null)
    ]);
    return {
      fetched_at: new Date().toISOString().slice(0, 16).replace('T', ' '),
      user: {
        login: u.login, avatar_url: u.avatar_url, html_url: u.html_url,
        public_repos: u.public_repos, followers: u.followers, following: u.following,
        created_at: u.created_at
      },
      repos: repos.map((r) => ({
        name: r.name, desc: r.description, lang: r.language,
        stars: r.stargazers_count || 0, forks: r.forks_count || 0,
        url: r.html_url, updated: (r.updated_at || '').slice(0, 10)
      })),
      events: events
        ? events.slice(0, 10).map((e) => ({
            type: e.type, repo: (e.repo || {}).name || '?',
            at: e.created_at, size: ((e.payload || {}).size || 0)
          }))
        : GITHUB_SNAPSHOT.events
    };
  }

  function readCache() {
    try {
      const c = JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null');
      if (c && Date.now() - c.at < CACHE_MS && c.data) return c.data;
    } catch (e) {}
    return null;
  }

  function ensureRendered() {
    if (hasRendered) return;
    hasRendered = true;
    const cached = readCache();
    if (cached) render(cached, { mode: 'live', label: '● LIVE — cached session' });
    else render(GITHUB_SNAPSHOT, { mode: 'off', label: '● SNAPSHOT — ' + (GITHUB_SNAPSHOT.fetched_at || '') });
  }

  function scheduleSync() {
    if (syncScheduled || syncStarted) return;
    syncScheduled = true;
    const start = () => {
      syncScheduled = false;
      sync(false);
    };
    if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(start, { timeout: 1200 });
    else window.setTimeout(start, 0);
  }

  async function sync(manual) {
    if (!manual && syncStarted) return;
    syncStarted = true;
    ensureRendered();
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 9000);
    if (manual) setBadge('sync', 'SYNCING WITH GITHUB…');
    try {
      const data = await fetchLive(ctrl.signal);
      clearTimeout(timer);
      try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data })); } catch (e) {}
      const label = 'LIVE — synced ' + (data.fetched_at || '').slice(11);
      render(data, { mode: 'live', label: '● ' + label });
    } catch (e) {
      clearTimeout(timer);
      setBadge('off', '● OFFLINE — showing snapshot');
    }
  }

  if (refreshBtn) refreshBtn.addEventListener('click', () => sync(true));

  document.addEventListener('portfolio:module-shown', (event) => {
    if (!event.detail || event.detail.id !== 'github') return;
    ensureRendered();
    scheduleSync();
  });
})();
