/* ==========================================================================
 * cinema.js — Pinned scroll-driven 3D showcase ("signal core" chapter).
 * Premium render: lit faceted core + wire overlay + additive glow shell,
 * emissive inner crystal, glowing orbit rings with travelling beads,
 * sprite-based particle field + dust, lit floor grid, cinematic camera
 * dolly/roll driven by scroll. Pauses offscreen; single static frame
 * under reduced-motion.
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
  scene.fog = new THREE.FogExp2(0x05060a, 0.02);

  const camera = new THREE.PerspectiveCamera(46, 16 / 9, 0.1, 140);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch (e) {
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  try {
    if ('outputEncoding' in renderer && THREE.sRGBEncoding) {
      renderer.outputEncoding = THREE.sRGBEncoding;
    }
    if ('toneMapping' in renderer && THREE.ACESFilmicToneMapping) {
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
    }
  } catch (e) {}
  mount.appendChild(renderer.domElement);

  const CYAN = 0x5ef6ff;
  const RED = 0xf75049;
  const YELLOW = 0xf0b537;

  /* ---- studio lighting ----------------------------------------------------- */
  scene.add(new THREE.AmbientLight(0x8a9cc0, 0.35));
  const keyLight = new THREE.PointLight(CYAN, 1.15, 0);
  keyLight.position.set(6, 5, 7);
  scene.add(keyLight);
  const rimLight = new THREE.PointLight(RED, 1.35, 0);
  rimLight.position.set(-7, -1, 5);
  scene.add(rimLight);
  const fillLight = new THREE.PointLight(YELLOW, 0.65, 0);
  fillLight.position.set(0, 6, -7);
  scene.add(fillLight);

  const root = new THREE.Group();
  scene.add(root);

  /* ---- faceted solid core + wire overlay + glow shell ---------------------- */
  const coreSolid = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2.2, 1),
    new THREE.MeshStandardMaterial({
      color: 0x11141c, metalness: 0.85, roughness: 0.28, flatShading: true
    })
  );
  root.add(coreSolid);

  const core = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(2.2, 1)),
    new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0.5 })
  );
  root.add(core);

  const shell = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2.58, 1),
    new THREE.MeshBasicMaterial({
      color: CYAN, transparent: true, opacity: 0.05,
      side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false
    })
  );
  root.add(shell);

  /* ---- emissive inner crystal + red cage ------------------------------------ */
  const crystal = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.55, 0),
    new THREE.MeshStandardMaterial({
      color: 0x1a0d0d, emissive: RED, emissiveIntensity: 1.0,
      metalness: 0.4, roughness: 0.4, flatShading: true
    })
  );
  root.add(crystal);

  const inner = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.OctahedronGeometry(1.1, 0)),
    new THREE.LineBasicMaterial({ color: RED, transparent: true, opacity: 0.85 })
  );
  root.add(inner);

  /* ---- glowing orbit rings + travelling beads -------------------------------- */
  const rings = [];
  const beads = [];
  function makeRing(radius, color, opacity, tiltX, tiltZ, beadColor) {
    const pivot = new THREE.Group();
    pivot.rotation.x = tiltX;
    pivot.rotation.z = tiltZ;
    root.add(pivot);
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(radius, 0.02, 10, 160),
      new THREE.MeshBasicMaterial({
        color, transparent: true, opacity,
        blending: THREE.AdditiveBlending, depthWrite: false
      })
    );
    pivot.add(ring);
    rings.push({ mesh: ring, base: opacity });
    if (beadColor !== null) {
      const bead = new THREE.Mesh(
        new THREE.SphereGeometry(0.09, 12, 12),
        new THREE.MeshBasicMaterial({ color: beadColor, transparent: true, opacity: 0.95 })
      );
      const halo = new THREE.Sprite(new THREE.SpriteMaterial({
        map: glowTexture(beadColor), transparent: true, opacity: 0.7,
        blending: THREE.AdditiveBlending, depthWrite: false
      }));
      halo.scale.setScalar(0.85);
      bead.add(halo);
      pivot.add(bead);
      beads.push({ mesh: bead, radius, speed: 0.35 + Math.random() * 0.3, phase: Math.random() * Math.PI * 2 });
    }
  }

  /* soft round sprite texture (generated, no assets) */
  let glowTexCache = {};
  function glowTexture(colorHex) {
    if (glowTexCache[colorHex]) return glowTexCache[colorHex];
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d');
    const col = '#' + ('000000' + colorHex.toString(16)).slice(-6);
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.25, col);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(c);
    glowTexCache[colorHex] = tex;
    return tex;
  }

  makeRing(3.2, CYAN, 0.55, Math.PI / 2.2, 0.2, CYAN);
  makeRing(3.8, RED, 0.4, Math.PI / 3, -0.5, RED);
  makeRing(4.4, YELLOW, 0.32, Math.PI / 1.7, 0.9, YELLOW);

  /* ---- floor grid — keynote stage -------------------------------------------- */
  const grid = new THREE.GridHelper(40, 40, CYAN, 0x1a2233);
  grid.position.y = -3.8;
  grid.material.transparent = true;
  grid.material.opacity = 0.18;
  grid.material.depthWrite = false;
  scene.add(grid);

  /* ---- particle field (additive sprites) + ambient dust ------------------------ */
  function makeParticles(count, rMin, rMax, size, opacity) {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const cCyan = new THREE.Color(CYAN);
    const cRed = new THREE.Color(RED);
    const cYellow = new THREE.Color(YELLOW);
    const cWhite = new THREE.Color(0xdfe9ff);
    for (let i = 0; i < count; i++) {
      const r = rMin + Math.random() * (rMax - rMin);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = Math.abs(r * Math.sin(phi) * Math.sin(theta)) * 0.6 - 1;
      positions[i * 3 + 2] = r * Math.cos(phi);
      const pick = Math.random();
      const c = pick > 0.9 ? cWhite : pick > 0.8 ? cRed : pick > 0.66 ? cYellow : cCyan;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const mat = new THREE.PointsMaterial({
      size, map: glowTexture(0xffffff), vertexColors: true, transparent: true,
      opacity, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true
    });
    return new THREE.Points(geo, mat);
  }
  const points = makeParticles(340, 5, 12, 0.16, 0.9);
  root.add(points);
  const dust = makeParticles(150, 3.5, 9, 0.34, 0.26);
  root.add(dust);

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
  let pulse = 0;

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
    pulse = 1;
    chapters.forEach((c, i) => c.classList.toggle('is-active', i === idx));
    dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
  }

  const lerp = (a, b, t) => a + (b - a) * t;

  function applyState(t) {
    const p = progress;
    /* cinematic dolly + settle + gentle banking */
    camera.position.z = lerp(13.5, 6.2, p);
    camera.position.y = lerp(1.7, 0.5, p);
    camera.position.x = Math.sin(p * Math.PI) * 1.2;
    camera.lookAt(0, -0.2, 0);
    camera.rotateZ(Math.sin(p * Math.PI * 2) * 0.045);
    /* construct motion: scroll-driven turn + idle float */
    root.rotation.y = p * Math.PI * 2.4;
    root.rotation.x = lerp(0.12, -0.1, p);
    root.position.y = Math.sin(t * 0.9) * 0.1;
    /* idle life */
    coreSolid.rotation.y -= 0.0012;
    core.rotation.y -= 0.0012;
    shell.rotation.y += 0.0009;
    crystal.rotation.x += 0.004;
    crystal.rotation.y += 0.006;
    inner.rotation.x += 0.003;
    inner.rotation.y -= 0.004;
    points.rotation.y -= 0.0011;
    dust.rotation.y += 0.0007;
    /* chapter pulse flash on the glow shell */
    pulse *= 0.94;
    const breathe = 1 + Math.sin(t * 1.8) * 0.022 + pulse * 0.1;
    coreSolid.scale.setScalar(breathe);
    core.scale.setScalar(breathe);
    shell.scale.setScalar(1 + Math.sin(t * 1.4) * 0.02 + pulse * 0.16);
    shell.material.opacity = 0.05 + pulse * 0.14;
    crystal.material.emissiveIntensity = 0.9 + Math.sin(t * 2.6) * 0.25 + pulse * 1.2;
    /* travelling beads */
    beads.forEach((b) => {
      const a = t * b.speed + p * 5 + b.phase;
      b.mesh.position.set(Math.cos(a) * b.radius, Math.sin(a) * b.radius, 0);
    });
    /* ring emphasis follows the active chapter */
    const chFloat = p * 3;
    rings.forEach((r, i) => {
      const heat = Math.max(0, 1 - Math.abs(chFloat - 0.5 - i));
      r.mesh.material.opacity = Math.min(1, r.base * (0.5 + heat * 1.4));
      r.mesh.scale.setScalar(1 + heat * 0.05);
    });
    /* lights breathe with the journey */
    keyLight.intensity = 1.05 + Math.sin(t * 1.8) * 0.12 + p * 0.25;
    rimLight.intensity = 1.25 + Math.cos(t * 1.5) * 0.12 + (1 - p) * 0.2;
    grid.material.opacity = 0.12 + p * 0.14;
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
