/* ==========================================================================
 * archive.js — Orbital project archive: an interactive 3D constellation of
 * the 9 case files. Drag to rotate, click a node to inspect its brief,
 * filter by track, locate the full card below. Data comes straight from
 * PORTFOLIO_DATA.projects — no duplication. Degrades to the index list
 * when WebGL is unavailable.
 * ========================================================================== */
(function () {
  'use strict';

  const section = document.getElementById('archive');
  const view = document.getElementById('archive-view');
  const detail = document.getElementById('archive-detail');
  const indexBox = document.getElementById('archive-index');
  const tip = document.getElementById('archive-tip');
  if (!section || !view || !detail || !indexBox) return;
  if (!window.PORTFOLIO_DATA || !PORTFOLIO_DATA.projects) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const projects = PORTFOLIO_DATA.projects.slice(0, 9);

  const GROUP_COLORS = { HACKATHON: 0xf0b537, BUILD: 0x5ef6ff, AI: 0xf75049 };
  const GROUP_CSS = { HACKATHON: '#F0B537', BUILD: '#5EF6FF', AI: '#F75049' };

  function groupOf(p) {
    const s = (p.category || '') + ' ' + (p.title || '');
    if (/hackathon/i.test(s)) return 'HACKATHON';
    if (/AI|agentic|chatbot/i.test(s)) return 'AI';
    return 'BUILD';
  }
  projects.forEach((p) => { p._group = groupOf(p); });

  const iconFor = (t) => {
    const slug = (typeof ICON_SLUGS !== 'undefined' && ICON_SLUGS) ? ICON_SLUGS[t] : null;
    return slug && typeof icon === 'function' ? icon(slug) : '';
  };

  /* ---- detail panel -------------------------------------------------------- */
  function renderOverview() {
    const likes = projects.reduce((a, p) => a + (p.likes || 0), 0);
    const wins = projects.filter((p) => /winner|best/i.test((p.summary || '') + ' ' + (p.category || ''))).length;
    detail.innerHTML = `
      <div class="arch-kicker">ORBITAL ARCHIVE // OVERVIEW</div>
      <h3 class="arch-title">9 CASE FILES <em>IN ORBIT</em></h3>
      <div class="arch-stats">
        <span><b>${likes}</b> TOTAL LIKES</span>
        <span><b>${wins}</b> AWARD WINS</span>
        <span><b>03</b> TRACKS</span>
      </div>
      <p class="arch-text">Drag the field to rotate. Click any node — or pick from the index — to open its mission brief.</p>`;
  }

  function renderDetail(i) {
    const p = projects[i];
    if (!p) return;
    const idx = String(i + 1).padStart(2, '0');
    const tags = (p.tags || []).map((t) => `<span class="gig-tag">${iconFor(t)}${t}</span>`).join('');
    detail.innerHTML = `
      <div class="arch-kicker" style="color:${GROUP_CSS[p._group]}">${p._group} // FILE ${idx}</div>
      <h3 class="arch-title">${p.title}</h3>
      <div class="arch-meta">${p.period} · ${p.category}</div>
      <p class="arch-text">${p.summary}</p>
      <div class="arch-tags">${tags}</div>
      <div class="arch-actions">
        <span class="pc-likes">♥ ${p.likes || 0}</span>
        <a href="${p.url}" target="_blank" rel="noopener" class="btn-cyber btn-cyber-sm btn-cyber-yellow">OPEN FILE →</a>
        <button type="button" class="btn-cyber btn-cyber-sm btn-cyber-ghost" data-locate="${p.id}">LOCATE ↓</button>
      </div>`;
    const loc = detail.querySelector('[data-locate]');
    if (loc) {
      loc.addEventListener('click', () => {
        const card = document.querySelector(`.project-card[data-id="${p.id}"]`);
        if (!card) return;
        card.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
        card.classList.remove('arch-flash');
        void card.offsetWidth;
        card.classList.add('arch-flash');
        setTimeout(() => card.classList.remove('arch-flash'), 1800);
        if (typeof cyberAudio !== 'undefined' && cyberAudio.playTab) {
          try { cyberAudio.playTab(); } catch (e) {}
        }
      });
    }
  }

  /* ---- accessible index list ------------------------------------------------- */
  function renderIndex(filter) {
    indexBox.innerHTML = projects
      .map((p, i) => {
        if (filter !== 'ALL' && p._group !== filter) return '';
        const idx = String(i + 1).padStart(2, '0');
        return `<button type="button" class="arch-idx${i === selected ? ' active' : ''}" data-node="${i}">
          <span class="ai-num" style="color:${GROUP_CSS[p._group]}">${idx}</span>
          <span class="ai-title">${p.title}</span>
        </button>`;
      })
      .join('');
    indexBox.querySelectorAll('[data-node]').forEach((b) => {
      b.addEventListener('click', () => selectNode(parseInt(b.getAttribute('data-node'), 10), true));
    });
  }

  /* ---- filter buttons ---------------------------------------------------------- */
  let activeFilter = 'ALL';
  document.querySelectorAll('.arch-filter').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.arch-filter').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.getAttribute('data-filter') || 'ALL';
      if (typeof cyberAudio !== 'undefined' && cyberAudio.playTab) {
        try { cyberAudio.playTab(); } catch (e) {}
      }
      applyFilter();
      renderIndex(activeFilter);
    });
  });

  /* ---- 3D constellation (progressive enhancement) ------------------------------- */
  let selected = -1;
  const nodes = [];
  let api = null;

  function selectNode(i, fromList) {
    if (i < 0 || i >= projects.length) return;
    selected = i;
    renderDetail(i);
    renderIndex(activeFilter);
    if (api) api.focus(i);
    if (!fromList && typeof cyberAudio !== 'undefined' && cyberAudio.playClick) {
      try { cyberAudio.playClick(); } catch (e) {}
    }
  }

  function applyFilter() {
    if (!api) return;
    api.filter(activeFilter);
  }

  renderOverview();
  renderIndex('ALL');

  if (typeof THREE === 'undefined') {
    section.classList.add('no-webgl');
    return;
  }

  try {
    api = buildScene();
  } catch (e) {
    section.classList.add('no-webgl');
    return;
  }
  applyFilter();

  /* tiny hook for automated verification */
  window.ArchiveUI = { select: (i) => selectNode(i, true) };

  function buildScene() {
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05060a, 0.02);
    const camera = new THREE.PerspectiveCamera(46, 16 / 9, 0.1, 140);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    try {
      if ('outputEncoding' in renderer && THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;
      if ('toneMapping' in renderer && THREE.ACESFilmicToneMapping) {
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.15;
      }
    } catch (e) {}
    view.insertBefore(renderer.domElement, view.firstChild);

    scene.add(new THREE.AmbientLight(0x8a9cc0, 0.4));
    const key = new THREE.PointLight(0x5ef6ff, 1.1, 0);
    key.position.set(6, 5, 7);
    scene.add(key);
    const rim = new THREE.PointLight(0xf75049, 1.2, 0);
    rim.position.set(-7, -2, 5);
    scene.add(rim);

    const root = new THREE.Group();
    scene.add(root);

    /* anchor core + faint guide orbits */
    const anchor = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.05, 1),
      new THREE.MeshStandardMaterial({ color: 0x11141c, metalness: 0.85, roughness: 0.3, flatShading: true })
    );
    root.add(anchor);
    const anchorWire = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.05, 1)),
      new THREE.LineBasicMaterial({ color: 0x5ef6ff, transparent: true, opacity: 0.28 })
    );
    root.add(anchorWire);
    [[4.4, 0.25], [6.2, -0.2]].forEach(([r, tilt]) => {
      const g = new THREE.Mesh(
        new THREE.TorusGeometry(r, 0.012, 8, 128),
        new THREE.MeshBasicMaterial({ color: 0x5ef6ff, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false })
      );
      g.rotation.x = Math.PI / 2.15 + tilt;
      root.add(g);
    });

    /* glow sprite texture */
    const glowTex = (() => {
      const c = document.createElement('canvas');
      c.width = c.height = 64;
      const g = c.getContext('2d');
      const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.3, 'rgba(255,255,255,0.5)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = grad;
      g.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(c);
    })();

    function textSprite(text) {
      const c = document.createElement('canvas');
      c.width = 128; c.height = 64;
      const g = c.getContext('2d');
      g.font = '600 34px "Share Tech Mono", monospace';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillStyle = '#E9EEF7';
      g.fillText(text, 64, 34);
      const tex = new THREE.CanvasTexture(c);
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.9, depthWrite: false }));
      sp.scale.set(1.15, 0.58, 1);
      return sp;
    }

    /* deterministic golden-spiral shell positions */
    const GOLD = Math.PI * (3 - Math.sqrt(5));
    const maxLikes = Math.max(...projects.map((p) => p.likes || 1));
    const spheres = [];
    projects.forEach((p, i) => {
      const y = 1 - ((i + 0.5) / projects.length) * 2;
      const rad = Math.sqrt(Math.max(0, 1 - y * y));
      const th = GOLD * i;
      const R = 5.1 + (i % 3) * 0.55;
      const pos = new THREE.Vector3(Math.cos(th) * rad * R, y * R * 0.62, Math.sin(th) * rad * R);
      const col = GROUP_COLORS[p._group];
      const r = 0.3 + ((p.likes || 1) / maxLikes) * 0.3;
      const pivot = new THREE.Group();
      pivot.position.copy(pos);
      const ball = new THREE.Mesh(
        new THREE.SphereGeometry(r, 24, 24),
        new THREE.MeshStandardMaterial({
          color: 0x141821, emissive: col, emissiveIntensity: 0.5,
          metalness: 0.8, roughness: 0.35, transparent: true
        })
      );
      const wire = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(r * 1.02, 1)),
        new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.4 })
      );
      const halo = new THREE.Sprite(new THREE.SpriteMaterial({
        map: glowTex, color: col, transparent: true, opacity: 0.4,
        blending: THREE.AdditiveBlending, depthWrite: false
      }));
      halo.scale.setScalar(r * 4.2);
      const label = textSprite(String(i + 1).padStart(2, '0'));
      label.position.y = r + 0.55;
      const selRing = new THREE.Mesh(
        new THREE.TorusGeometry(r + 0.28, 0.02, 8, 48),
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
      );
      pivot.add(ball, wire, halo, label, selRing);
      root.add(pivot);
      nodes.push({ pivot, ball, halo, label, selRing, color: col, baseEmissive: 0.5 });
      spheres.push(ball);
      ball.userData.nodeIndex = i;
    });

    /* faint starfield */
    const starGeo = new THREE.BufferGeometry();
    const sp = new Float32Array(220 * 3);
    for (let i = 0; i < 220; i++) {
      const r = 14 + Math.random() * 16;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      sp[i * 3] = r * Math.sin(ph) * Math.cos(th);
      sp[i * 3 + 1] = r * Math.cos(ph) * 0.7;
      sp[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(sp, 3));
    const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({
      size: 0.09, map: glowTex, color: 0x9bf6ff, transparent: true, opacity: 0.7,
      blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true
    }));
    scene.add(stars);

    /* ---- camera + interaction ------------------------------------------------ */
    let dist = 12.5;
    let distTarget = 12.5;
    function resize() {
      const w = view.clientWidth || 800;
      const h = view.clientHeight || 420;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize);

    const ray = new THREE.Raycaster();
    const ptr = new THREE.Vector2();
    let hovered = -1;
    let dragging = false;
    let moved = 0;
    let lastX = 0;
    let lastY = 0;
    let velX = 0;
    let velY = 0;
    let idleT = 0;

    function castAt(e) {
      const r = renderer.domElement.getBoundingClientRect();
      ptr.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      ptr.y = -((e.clientY - r.top) / r.height) * 2 + 1;
      ray.setFromCamera(ptr, camera);
      const hits = ray.intersectObjects(spheres, false);
      return hits.length ? hits[0].object.userData.nodeIndex : -1;
    }

    function showTip(e, i) {
      if (i < 0 || !tip) { if (tip) tip.classList.remove('on'); return; }
      const p = projects[i];
      const r = view.getBoundingClientRect();
      tip.innerHTML = `<b>${p.title}</b><span>♥ ${p.likes || 0} · ${p._group}</span>`;
      tip.style.left = Math.min(r.width - 170, Math.max(8, e.clientX - r.left + 16)) + 'px';
      tip.style.top = Math.max(8, e.clientY - r.top - 10) + 'px';
      tip.classList.add('on');
    }

    renderer.domElement.style.touchAction = 'pan-y';
    renderer.domElement.addEventListener('pointermove', (e) => {
      if (dragging) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        moved += Math.abs(dx) + Math.abs(dy);
        root.rotation.y += dx * 0.005;
        root.rotation.x = Math.max(-0.6, Math.min(0.6, root.rotation.x + dy * 0.003));
        velX = dx * 0.005;
        velY = dy * 0.003;
        lastX = e.clientX;
        lastY = e.clientY;
        idleT = 0;
        return;
      }
      hovered = castAt(e);
      renderer.domElement.style.cursor = hovered >= 0 ? 'pointer' : 'grab';
      showTip(e, hovered);
    }, { passive: true });
    renderer.domElement.addEventListener('pointerdown', (e) => {
      dragging = true;
      moved = 0;
      lastX = e.clientX;
      lastY = e.clientY;
      idleT = 0;
      renderer.domElement.setPointerCapture && renderer.domElement.setPointerCapture(e.pointerId);
    });
    const endDrag = (e) => {
      if (dragging && moved < 6 && e && e.clientX !== undefined) {
        const i = castAt(e);
        if (i >= 0) selectNode(i, false);
      }
      dragging = false;
    };
    renderer.domElement.addEventListener('pointerup', endDrag);
    renderer.domElement.addEventListener('pointercancel', () => { dragging = false; });
    renderer.domElement.addEventListener('pointerleave', () => {
      dragging = false;
      hovered = -1;
      if (tip) tip.classList.remove('on');
    });

    const zin = document.getElementById('arch-zoom-in');
    const zout = document.getElementById('arch-zoom-out');
    if (zin) zin.addEventListener('click', () => { distTarget = Math.max(8, distTarget - 1.6); });
    if (zout) zout.addEventListener('click', () => { distTarget = Math.min(18, distTarget + 1.6); });

    /* ---- frame ----------------------------------------------------------------- */
    let t = 0;
    let visible = true;
    let rafId = 0;

    function render() {
      dist += (distTarget - dist) * 0.08;
      camera.position.set(0, 1.4, dist);
      camera.lookAt(0, 0, 0);
      if (!reduceMotion && !dragging) {
        idleT += 0.016;
        const spin = idleT > 2.5 ? 0.0016 : 0.0006;
        root.rotation.y += spin;
        velX *= 0.94;
        velY *= 0.94;
        root.rotation.y += velX;
        root.rotation.x = Math.max(-0.6, Math.min(0.6, root.rotation.x + velY));
      }
      t += 0.016;
      anchor.rotation.y += 0.002;
      anchorWire.rotation.y -= 0.0015;
      stars.rotation.y += 0.0004;
      nodes.forEach((n, i) => {
        const isSel = i === selected;
        const isHov = i === hovered;
        const target = isSel ? 1.5 : isHov ? 1.1 : n.baseEmissive;
        const m = n.ball.material;
        m.emissiveIntensity += (target - m.emissiveIntensity) * 0.15;
        n.selRing.material.opacity += ((isSel ? 0.9 : 0) - n.selRing.material.opacity) * 0.15;
        n.selRing.rotation.x = t * 0.8;
        n.selRing.rotation.y = t * 0.5;
        const s = isSel ? 1.18 : 1;
        n.pivot.scale.setScalar(n.pivot.scale.x + (s - n.pivot.scale.x) * 0.12);
      });
      renderer.render(scene, camera);
    }

    function frame() {
      rafId = 0;
      if (!visible) return;
      render();
      rafId = requestAnimationFrame(frame);
    }
    function kick() {
      if (!rafId && visible && !reduceMotion) rafId = requestAnimationFrame(frame);
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries) => {
        visible = entries[0].isIntersecting;
        kick();
      }, { rootMargin: '15% 0px 15% 0px' }).observe(view);
    }
    render();

    return {
      focus(i) {
        render();
        kick();
      },
      filter(f) {
        nodes.forEach((n, idx) => {
          const on = f === 'ALL' || projects[idx]._group === f;
          n.ball.material.opacity = on ? 1 : 0.12;
          n.ball.material.transparent = true;
          n.halo.material.opacity = on ? 0.4 : 0.05;
          n.label.material.opacity = on ? 0.9 : 0.12;
        });
        render();
        kick();
      }
    };
  }
})();
