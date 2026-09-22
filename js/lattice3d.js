/* ==========================================================================
 * lattice3d.js — Interactive 3D Neural Lattice (Three.js)
 * Replaces the koi background. A field of nodes + bonds in a slow-turning
 * octahedron core; mouse parallax (page-level, since the mount ignores
 * pointer events) and drag-spin keep it interactive without blocking clicks.
 * ========================================================================== */
(function () {
  'use strict';

  var mount = document.getElementById('lattice-mount');
  if (!mount || typeof THREE === 'undefined') return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  var RED = 0xf75049;
  var CYAN = 0x5ef6ff;
  var GOLD = 0xf0b537;

  var scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0e0e17, 0.055);

  var camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 14);

  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);
  mount.appendChild(renderer.domElement);

  var group = new THREE.Group();
  scene.add(group);

  // ---- inner core: wireframe octahedron + solid core ----------------------
  var coreGeo = new THREE.OctahedronGeometry(2.4, 1);
  var coreWire = new THREE.LineSegments(
    new THREE.EdgesGeometry(coreGeo),
    new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0.85 })
  );
  group.add(coreWire);

  var coreSolid = new THREE.Mesh(
    new THREE.OctahedronGeometry(1.15, 0),
    new THREE.MeshBasicMaterial({ color: RED, transparent: true, opacity: 0.55, wireframe: true })
  );
  group.add(coreSolid);

  // ---- orbiting rings ------------------------------------------------------
  var rings = [];
  function makeRing(radius, color, tilt) {
    var geo = new THREE.TorusGeometry(radius, 0.03, 8, 96);
    var mat = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.55 });
    var mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = tilt;
    group.add(mesh);
    rings.push(mesh);
    return mesh;
  }
  makeRing(3.6, CYAN, Math.PI / 2.4);
  makeRing(4.4, RED, Math.PI / 3.2);
  makeRing(5.2, GOLD, Math.PI / 1.8);

  // ---- node field + bonds --------------------------------------------------
  var NODE_COUNT = 140;
  var positions = [];
  var i, x, y, z;
  for (i = 0; i < NODE_COUNT; i++) {
    // spherical-ish scatter
    var r = 5 + Math.random() * 5;
    var theta = Math.random() * Math.PI * 2;
    var phi = Math.acos(2 * Math.random() - 1);
    x = r * Math.sin(phi) * Math.cos(theta);
    y = r * Math.sin(phi) * Math.sin(theta) * 0.7;
    z = r * Math.cos(phi);
    positions.push(new THREE.Vector3(x, y, z));
  }

  // points cloud
  var ptsGeo = new THREE.BufferGeometry();
  var ptsArr = new Float32Array(NODE_COUNT * 3);
  for (i = 0; i < NODE_COUNT; i++) {
    ptsArr[i * 3] = positions[i].x;
    ptsArr[i * 3 + 1] = positions[i].y;
    ptsArr[i * 3 + 2] = positions[i].z;
  }
  ptsGeo.setAttribute('position', new THREE.BufferAttribute(ptsArr, 3));
  var pts = new THREE.Points(
    ptsGeo,
    new THREE.PointsMaterial({ color: CYAN, size: 0.09, transparent: true, opacity: 0.9 })
  );
  group.add(pts);

  // bonds between near neighbours
  var linePos = [];
  var MAX_BONDS = 220;
  var bonds = 0;
  for (i = 0; i < NODE_COUNT && bonds < MAX_BONDS; i++) {
    for (var j = i + 1; j < NODE_COUNT && bonds < MAX_BONDS; j++) {
      if (positions[i].distanceTo(positions[j]) < 2.1) {
        linePos.push(
          positions[i].x, positions[i].y, positions[i].z,
          positions[j].x, positions[j].y, positions[j].z
        );
        bonds++;
      }
    }
  }
  var lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePos), 3));
  var lines = new THREE.LineSegments(
    lineGeo,
    new THREE.LineBasicMaterial({ color: RED, transparent: true, opacity: 0.35 })
  );
  group.add(lines);

  // ---- interaction state ---------------------------------------------------
  var targetRotX = 0.18;
  var targetRotY = 0;
  var curRotX = 0.18;
  var curRotY = 0;
  var autoSpin = 0.0022;
  var dragging = false;
  var lastX = 0;
  var lastY = 0;

  window.addEventListener('pointermove', function (e) {
    var nx = (e.clientX / window.innerWidth) * 2 - 1;
    var ny = (e.clientY / window.innerHeight) * 2 - 1;
    targetRotY = nx * 0.55;
    targetRotX = 0.18 + ny * 0.35;
    if (dragging) {
      targetRotY += (e.clientX - lastX) * 0.005;
      targetRotX += (e.clientY - lastY) * 0.005;
      lastX = e.clientX;
      lastY = e.clientY;
    }
  }, { passive: true });

  window.addEventListener('pointerdown', function (e) {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
  });
  window.addEventListener('pointerup', function () { dragging = false; });
  window.addEventListener('pointercancel', function () { dragging = false; });

  window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  var t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.016;

    if (!dragging) targetRotY += autoSpin;

    curRotX += (targetRotX - curRotX) * 0.05;
    curRotY += (targetRotY - curRotY) * 0.05;
    group.rotation.x = curRotX;
    group.rotation.y = curRotY;

    coreSolid.rotation.y -= 0.006;
    coreSolid.rotation.x += 0.004;

    for (var k = 0; k < rings.length; k++) {
      rings[k].rotation.z += 0.003 * (k + 1);
      rings[k].rotation.y = Math.sin(t * 0.4 + k) * 0.25;
    }

    // gentle breathing on the point cloud
    var s = 1 + Math.sin(t * 1.4) * 0.03;
    pts.scale.set(s, s, s);

    // subtle camera parallax toward pointer
    camera.position.x += (targetRotY * 1.2 - camera.position.x) * 0.04;
    camera.position.y += (-targetRotX * 1.0 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }
  animate();
})();
