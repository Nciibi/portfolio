/* ==========================================================================
 * holo3d.js — Contained interactive 3D hero viewport ("signal core").
 * Wireframe icosahedron + inner octahedron + orbit rings + point field,
 * mounted inside #hero-stage only. No fullscreen background layer.
 * Interactions (scoped to the stage): hover parallax, drag-to-spin,
 * click/tap pulse. Single static frame when reduced-motion is set or
 * when WebGL is unavailable.
 * ========================================================================== */
(function () {
  'use strict';

  const mount = document.getElementById('hero-stage');
  if (!mount || typeof THREE === 'undefined') return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(46, 16 / 9, 0.1, 100);
  camera.position.set(0, 0.5, 9.2);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch (e) {
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.classList.add('stage-canvas');
  mount.insertBefore(renderer.domElement, mount.firstChild);

  const CYAN = 0x5ef6ff;
  const RED = 0xf75049;
  const YELLOW = 0xf0b537;

  const root = new THREE.Group();
  scene.add(root);

  /* ---- core: icosahedron wireframe ------------------------------------- */
  const core = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(2.0, 1)),
    new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0.6 })
  );
  root.add(core);

  const inner = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.OctahedronGeometry(1.0, 0)),
    new THREE.LineBasicMaterial({ color: RED, transparent: true, opacity: 0.85 })
  );
  root.add(inner);

  /* ---- orbit rings ------------------------------------------------------ */
  const rings = [];
  function makeRing(radius, color, opacity, tiltX, tiltZ) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(radius, 0.012, 8, 128),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity, depthWrite: false })
    );
    ring.rotation.x = tiltX;
    ring.rotation.z = tiltZ;
    root.add(ring);
    rings.push(ring);
  }
  makeRing(2.9, CYAN, 0.5, Math.PI / 2.2, 0.2);
  makeRing(3.4, RED, 0.32, Math.PI / 3, -0.5);
  makeRing(3.9, YELLOW, 0.24, Math.PI / 1.7, 0.9);

  /* ---- tick dial --------------------------------------------------------- */
  const tickGroup = new THREE.Group();
  const tickMat = new THREE.MeshBasicMaterial({
    color: CYAN, transparent: true, opacity: 0.5, depthWrite: false
  });
  for (let i = 0; i < 36; i++) {
    const angle = (i / 36) * Math.PI * 2;
    const tick = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.16, 0.01), tickMat);
    tick.position.set(Math.cos(angle) * 3.15, 0, Math.sin(angle) * 3.15);
    tick.lookAt(0, 0, 0);
    tickGroup.add(tick);
  }
  tickGroup.rotation.x = Math.PI / 2.4;
  root.add(tickGroup);

  /* ---- point field -------------------------------------------------------- */
  const N = 420;
  const positions = new Float32Array(N * 3);
  const colors = new Float32Array(N * 3);
  const cCyan = new THREE.Color(CYAN);
  const cRed = new THREE.Color(RED);
  for (let i = 0; i < N; i++) {
    const r = 4.5 + Math.random() * 6;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
    positions[i * 3 + 2] = r * Math.cos(phi);
    const c = Math.random() > 0.78 ? cRed : cCyan;
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const points = new THREE.Points(pGeo, new THREE.PointsMaterial({
    size: 0.05, vertexColors: true, transparent: true, opacity: 0.8,
    depthWrite: false, sizeAttenuation: true
  }));
  root.add(points);

  /* ---- pulse shockwave ring (click feedback) ------------------------------ */
  const shock = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.02, 8, 96),
    new THREE.MeshBasicMaterial({ color: YELLOW, transparent: true, opacity: 0, depthWrite: false })
  );
  shock.rotation.x = Math.PI / 2.3;
  root.add(shock);
  let shockT = -1;
  let pulse = 0;

  /* ---- sizing -------------------------------------------------------------- */
  function resize() {
    const w = mount.clientWidth || 800;
    const h = mount.clientHeight || 380;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(resize).observe(mount);
  }
  window.addEventListener('resize', resize);

  /* ---- interaction (scoped to the stage) ---------------------------------- */
  let hoverX = 0;
  let hoverY = 0;
  let dragging = false;
  let lastPX = 0;
  let lastPY = 0;
  let spinVelX = 0;
  let spinVelY = 0;

  mount.addEventListener('pointermove', (e) => {
    const r = mount.getBoundingClientRect();
    hoverX = ((e.clientX - r.left) / r.width) * 2 - 1;
    hoverY = ((e.clientY - r.top) / r.height) * 2 - 1;
    if (dragging) {
      spinVelY += (e.clientX - lastPX) * 0.004;
      spinVelX += (e.clientY - lastPY) * 0.004;
      lastPX = e.clientX;
      lastPY = e.clientY;
    }
  }, { passive: true });

  mount.addEventListener('pointerdown', (e) => {
    dragging = true;
    lastPX = e.clientX;
    lastPY = e.clientY;
    mount.setPointerCapture && mount.setPointerCapture(e.pointerId);
  });
  const endDrag = () => { dragging = false; };
  mount.addEventListener('pointerup', endDrag);
  mount.addEventListener('pointercancel', endDrag);
  mount.addEventListener('pointerleave', () => {
    dragging = false;
    hoverX = 0;
    hoverY = 0;
  });

  mount.addEventListener('click', () => {
    shockT = 0;
    pulse = 1;
    if (typeof cyberAudio !== 'undefined' && cyberAudio.playClick) {
      try { cyberAudio.playClick(); } catch (err) {}
    }
  });

  /* ---- animate (paused while offscreen) -------------------------------------- */
  let t = 0;
  let stageVisible = true;
  let stageRaf = 0;
  function frame() {
    stageRaf = 0;
    if (!stageVisible) return;
    requestAnimationFrame(frame);
    stageRaf = 1;
    t += 0.016;

    if (!reduceMotion) {
      spinVelY *= 0.95;
      spinVelX *= 0.95;
      root.rotation.y += spinVelY + 0.0025 + hoverX * 0.002;
      root.rotation.x += spinVelX * 0.6;

      camera.position.x += (hoverX * 1.1 - camera.position.x) * 0.04;
      camera.position.y += (-hoverY * 0.7 + 0.5 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      inner.rotation.x += 0.006;
      inner.rotation.y -= 0.008;
      core.rotation.y -= 0.0016;

      rings[0].rotation.z += 0.004;
      rings[1].rotation.x += 0.0025;
      rings[2].rotation.y += 0.003;
      tickGroup.rotation.z -= 0.0035;
      points.rotation.y -= 0.0009;

      const breathe = 1 + Math.sin(t * 2.2) * 0.03 + pulse * 0.12;
      core.scale.setScalar(breathe);
      inner.scale.setScalar(1 + Math.sin(t * 3.1) * 0.05 + pulse * 0.2);
      pulse *= 0.93;

      if (shockT >= 0) {
        shockT += 0.03;
        const s = 1 + shockT * 4.2;
        shock.scale.setScalar(s);
        shock.material.opacity = Math.max(0, 0.7 * (1 - shockT));
        if (shockT >= 1) {
          shockT = -1;
          shock.material.opacity = 0;
        }
      }
    }

    renderer.render(scene, camera);
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(
      (entries) => {
        stageVisible = entries[0].isIntersecting;
        if (stageVisible && !stageRaf && !reduceMotion) frame();
      },
      { rootMargin: '15% 0px 15% 0px' }
    ).observe(mount);
  }

  if (reduceMotion) {
    resize();
    renderer.render(scene, camera);
  } else {
    frame();
  }
})();
