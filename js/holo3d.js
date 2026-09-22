/* ==========================================================================
 * holo3d.js — Interactive 3D hologram centerpiece (replaces koi background)
 * Wireframe icosahedron + orbiting data rings + point field.
 * Mouse parallax + drag-to-spin; rendered on a fixed, pointer-transparent
 * layer so page interaction is unaffected.
 * ========================================================================== */
(function () {
  'use strict';

  const mount = document.getElementById('three-canvas-container');
  if (!mount || typeof THREE === 'undefined') return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0e0e17, 0.035);

  const camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(0, 0.4, 9.5);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);
  mount.appendChild(renderer.domElement);

  const CYAN = 0x5ef6ff;
  const RED = 0xf75049;
  const YELLOW = 0xf0b537;

  const root = new THREE.Group();
  scene.add(root);

  /* ---- core: icosahedron wireframe ------------------------------------- */
  const coreGeo = new THREE.IcosahedronGeometry(2.1, 1);
  const coreEdges = new THREE.EdgesGeometry(coreGeo);
  const core = new THREE.LineSegments(
    coreEdges,
    new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0.55 })
  );
  root.add(core);

  const innerGeo = new THREE.OctahedronGeometry(1.05, 0);
  const inner = new THREE.LineSegments(
    new THREE.EdgesGeometry(innerGeo),
    new THREE.LineBasicMaterial({ color: RED, transparent: true, opacity: 0.8 })
  );
  root.add(inner);

  /* ---- orbiting rings ---------------------------------------------------- */
  const rings = [];
  function makeRing(radius, color, opacity, tiltX, tiltZ) {
    const geo = new THREE.TorusGeometry(radius, 0.012, 8, 128);
    const mat = new THREE.MeshBasicMaterial({
      color, transparent: true, opacity, depthWrite: false
    });
    const ring = new THREE.Mesh(geo, mat);
    ring.rotation.x = tiltX;
    ring.rotation.z = tiltZ;
    root.add(ring);
    rings.push(ring);
  }
  makeRing(3.1, CYAN, 0.45, Math.PI / 2.2, 0.2);
  makeRing(3.6, RED, 0.3, Math.PI / 3, -0.5);
  makeRing(4.2, YELLOW, 0.22, Math.PI / 1.7, 0.9);

  /* ---- ring tick marks (diagonal hatch feel) ----------------------------- */
  const tickGroup = new THREE.Group();
  const tickMat = new THREE.MeshBasicMaterial({
    color: CYAN, transparent: true, opacity: 0.5, depthWrite: false
  });
  for (let i = 0; i < 36; i++) {
    const angle = (i / 36) * Math.PI * 2;
    const tick = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.16, 0.01), tickMat);
    tick.position.set(Math.cos(angle) * 3.35, 0, Math.sin(angle) * 3.35);
    tick.lookAt(0, 0, 0);
    tickGroup.add(tick);
  }
  tickGroup.rotation.x = Math.PI / 2.4;
  root.add(tickGroup);

  /* ---- point field -------------------------------------------------------- */
  const N = 900;
  const positions = new Float32Array(N * 3);
  const colors = new Float32Array(N * 3);
  const cCyan = new THREE.Color(CYAN);
  const cRed = new THREE.Color(RED);
  for (let i = 0; i < N; i++) {
    const r = 5 + Math.random() * 9;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7;
    positions[i * 3 + 2] = r * Math.cos(phi);
    const c = Math.random() > 0.75 ? cRed : cCyan;
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const points = new THREE.Points(pGeo, new THREE.PointsMaterial({
    size: 0.045, vertexColors: true, transparent: true, opacity: 0.75,
    depthWrite: false, sizeAttenuation: true
  }));
  root.add(points);

  /* ---- connecting arcs (constellation lines) ------------------------------ */
  const arcMat = new THREE.LineBasicMaterial({
    color: RED, transparent: true, opacity: 0.14, depthWrite: false
  });
  for (let i = 0; i < 18; i++) {
    const a = new THREE.Vector3(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 7,
      (Math.random() - 0.5) * 8
    );
    const b = a.clone().add(new THREE.Vector3(
      (Math.random() - 0.5) * 4,
      (Math.random() - 0.5) * 3,
      (Math.random() - 0.5) * 3
    ));
    const g = new THREE.BufferGeometry().setFromPoints([a, b]);
    root.add(new THREE.Line(g, arcMat));
  }

  /* ---- interaction: pointer parallax + drag-to-spin ---------------------- */
  let targetRotX = 0;
  let targetRotY = 0;
  let pointerX = 0;
  let pointerY = 0;
  let dragging = false;
  let lastPX = 0;
  let lastPY = 0;
  let spinVelX = 0;
  let spinVelY = 0;

  window.addEventListener('pointermove', (e) => {
    pointerX = (e.clientX / window.innerWidth) * 2 - 1;
    pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    targetRotY = pointerX * 0.45;
    targetRotX = pointerY * 0.3;
    if (dragging) {
      spinVelY += (e.clientX - lastPX) * 0.00035;
      spinVelX += (e.clientY - lastPY) * 0.00035;
      lastPX = e.clientX;
      lastPY = e.clientY;
    }
  }, { passive: true });

  window.addEventListener('pointerdown', (e) => {
    if (e.target && e.target.closest && e.target.closest('a,button,input,textarea,select,.gig-row,.attribute-card,.filter-btn,.dlg-opt,.hud-header,.rail,.legend,.mobile-menu,.cyber-modal'))
      return;
    dragging = true;
    lastPX = e.clientX;
    lastPY = e.clientY;
  });
  window.addEventListener('pointerup', () => { dragging = false; });
  window.addEventListener('pointercancel', () => { dragging = false; });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  /* ---- animate ------------------------------------------------------------- */
  let t = 0;
  function frame() {
    requestAnimationFrame(frame);
    t += 0.016;

    if (!reduceMotion) {
      spinVelY *= 0.96;
      spinVelX *= 0.96;
      root.rotation.y += spinVelY + 0.0022;
      root.rotation.x += spinVelX;

      // blend toward pointer parallax
      root.rotation.y += (targetRotY * 0.35 - (root.rotation.y % (Math.PI * 2)) * 0) * 0;
      camera.position.x += (pointerX * 1.4 - camera.position.x) * 0.03;
      camera.position.y += (-pointerY * 0.9 + 0.4 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);

      inner.rotation.x += 0.006;
      inner.rotation.y -= 0.008;
      core.rotation.y -= 0.0015;

      rings[0].rotation.z += 0.004;
      rings[1].rotation.x += 0.0025;
      rings[2].rotation.y += 0.003;
      tickGroup.rotation.z -= 0.0035;

      points.rotation.y -= 0.0008;

      const pulse = 1 + Math.sin(t * 2.2) * 0.03;
      core.scale.setScalar(pulse);
      inner.scale.setScalar(1 + Math.sin(t * 3.1) * 0.05);
    }

    renderer.render(scene, camera);
  }
  frame();
})();
