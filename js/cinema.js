/* ==========================================================================
 * cinema.js — Pinned scroll-driven 3D showcase ("signal core" chapter).
 * A tall track pins a fullscreen viewport while scroll progress drives the
 * camera dolly, construct rotation, ring emphasis and chapter crossfades —
 * Apple-keynote style, cyberpunk dress. Pauses offscreen; renders a single
 * static frame under reduced-motion.
 * ========================================================================== */
(function () {
  'use strict';

  const track = document.getElementById('cinema-track');
  const mount = document.getElementById('cinema-stage');
  const fill = document.getElementById('cinema-progress-fill');
  if (!track || !mount || typeof THREE === 'undefined') return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const chapters = Array.from(track.querySelectorAll('.cin-chapter'));
  const dots = Array.from(track.querySelectorAll('.cin-dot'));

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x05060a, 0.028);

  const camera = new THREE.PerspectiveCamera(46, 16 / 9, 0.1, 120);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch (e) {
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  mount.appendChild(renderer.domElement);

  const CYAN = 0x5ef6ff;
  const RED = 0xf75049;
  const YELLOW = 0xf0b537;

  const root = new THREE.Group();
  scene.add(root);

  const core = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(2.2, 1)),
    new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0.62 })
  );
  root.add(core);

  const inner = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.OctahedronGeometry(1.1, 0)),
    new THREE.LineBasicMaterial({ color: RED, transparent: true, opacity: 0.9 })
  );
  root.add(inner);

  const rings = [];
  function makeRing(radius, color, opacity, tiltX, tiltZ) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(radius, 0.014, 8, 140),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity, depthWrite: false })
    );
    ring.rotation.x = tiltX;
    ring.rotation.z = tiltZ;
    root.add(ring);
    rings.push({ mesh: ring, base: opacity });
  }
  makeRing(3.2, CYAN, 0.5, Math.PI / 2.2, 0.2);
  makeRing(3.8, RED, 0.34, Math.PI / 3, -0.5);
  makeRing(4.4, YELLOW, 0.26, Math.PI / 1.7, 0.9);

  /* floor grid — keynote stage feel */
  const grid = new THREE.GridHelper(34, 34, CYAN, 0x1a2233);
  grid.position.y = -3.6;
  grid.material.transparent = true;
  grid.material.opacity = 0.16;
  grid.material.depthWrite = false;
  scene.add(grid);

  /* point field */
  const N = 320;
  const positions = new Float32Array(N * 3);
  const colors = new Float32Array(N * 3);
  const cCyan = new THREE.Color(CYAN);
  const cRed = new THREE.Color(RED);
  const cYellow = new THREE.Color(YELLOW);
  for (let i = 0; i < N; i++) {
    const r = 5 + Math.random() * 7;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = Math.abs(r * Math.sin(phi) * Math.sin(theta)) * 0.6 - 1;
    positions[i * 3 + 2] = r * Math.cos(phi);
    const pick = Math.random();
    const c = pick > 0.85 ? cRed : pick > 0.7 ? cYellow : cCyan;
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const points = new THREE.Points(pGeo, new THREE.PointsMaterial({
    size: 0.055, vertexColors: true, transparent: true, opacity: 0.85,
    depthWrite: false, sizeAttenuation: true
  }));
  root.add(points);

  /* ---- sizing ------------------------------------------------------------ */
  function resize() {
    const w = mount.clientWidth || window.innerWidth;
    const h = mount.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  /* ---- scroll progress ---------------------------------------------------- */
  let progress = 0;
  let activeCh = -1;

  function readProgress() {
    const r = track.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    const total = Math.max(1, r.height - vh);
    const p = (vh * 0.5 - r.top) / total;
    progress = Math.min(1, Math.max(0, p));
  }

  function setChapter(idx) {
    if (idx === activeCh) return;
    activeCh = idx;
    chapters.forEach((c, i) => c.classList.toggle('is-active', i === idx));
    dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
  }

  const lerp = (a, b, t) => a + (b - a) * t;

  function applyState(t) {
    const p = progress;
    /* camera dolly + settle */
    camera.position.z = lerp(13.5, 6.2, p);
    camera.position.y = lerp(1.6, 0.5, p);
    camera.position.x = Math.sin(p * Math.PI) * 1.2;
    camera.lookAt(0, -0.2, 0);
    /* construct rotation driven by scroll */
    root.rotation.y = p * Math.PI * 2.4;
    root.rotation.x = lerp(0.12, -0.1, p);
    /* idle life */
    core.rotation.y -= 0.0012;
    inner.rotation.x += 0.003;
    inner.rotation.y -= 0.004;
    points.rotation.y -= 0.0011;
    const breathe = 1 + Math.sin(t * 1.8) * 0.025;
    core.scale.setScalar(breathe);
    /* ring emphasis follows the active chapter */
    const chFloat = p * 3;
    rings.forEach((r, i) => {
      const heat = Math.max(0, 1 - Math.abs(chFloat - 0.5 - i));
      r.mesh.material.opacity = r.base * (0.45 + heat * 1.3);
      const s = 1 + heat * 0.06;
      r.mesh.scale.setScalar(s);
    });
    grid.material.opacity = 0.1 + p * 0.12;
    if (fill) fill.style.width = (p * 100).toFixed(2) + '%';
    setChapter(Math.min(2, Math.floor(p * 3)));
  }

  /* ---- loop (gated by visibility) ----------------------------------------- */
  let visible = true;
  let rafId = 0;
  let t = 0;

  /* Synchronous update: keeps state exact even when frames stall. */
  function updateNow() {
    readProgress();
    applyState(t);
    renderer.render(scene, camera);
  }

  function frame() {
    rafId = 0;
    if (!visible) return;
    t += 0.016;
    readProgress();
    applyState(t);
    renderer.render(scene, camera);
    rafId = requestAnimationFrame(frame);
  }
  function kick() {
    if (!rafId && visible && !reduceMotion) rafId = requestAnimationFrame(frame);
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting;
        kick();
      },
      { rootMargin: '20% 0px 20% 0px' }
    ).observe(track);
  }
  window.addEventListener('scroll', () => { updateNow(); kick(); }, { passive: true });

  if (reduceMotion) {
    resize();
    progress = 0.35;
    applyState(0);
    renderer.render(scene, camera);
    chapters.forEach((c, i) => c.classList.toggle('is-active', i === 1));
  } else {
    readProgress();
    applyState(0);
    renderer.render(scene, camera);
    kick();
  }
})();
