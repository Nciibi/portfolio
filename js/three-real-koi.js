/**
 * CYBERPUNK 2077 REAL 3D ANIMATED HOLOGRAPHIC KOI FISH
 * Loads user's authentic 3D koi fish GLB model (assets/koi_fish.glb).
 * Features AnimationMixer for the built-in 3D swimming animation,
 * dual holographic shaders (Electric Cyan-Blue & Sunburst Amber-Orange),
 * 3D orbital swimming paths, and floating neon data embers.
 */

class Real3DKoiScene {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.clock = new THREE.Clock();
    this.mixers = [];
    this.koiFishes = [];
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    this.initThree();
    this.loadKoiModel();
    this.createDataEmbers();
    this.bindEvents();

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initThree() {
    // 1. Transparent Scene (NO opaque fog or dark background)
    this.scene = new THREE.Scene();

    // 2. Camera with clean perspective
    this.camera = new THREE.PerspectiveCamera(50, this.width / this.height, 0.1, 500);
    this.camera.position.set(0, 4, 38);

    // 3. WebGL Renderer with Alpha = true (100% transparent background)
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0); // Completely transparent
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.container.appendChild(this.renderer.domElement);

    // 4. Vibrant Cyberpunk Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    this.scene.add(ambientLight);

    // Cyan key light
    const lightCyan = new THREE.PointLight(0x00f0ff, 3.5, 90);
    lightCyan.position.set(-20, 15, 20);
    this.scene.add(lightCyan);

    // Orange/Gold fill light
    const lightOrange = new THREE.PointLight(0xff7700, 3.5, 90);
    lightOrange.position.set(20, -10, 20);
    this.scene.add(lightOrange);
  }

  loadKoiModel() {
    const loader = new THREE.GLTFLoader();

    loader.load(
      'assets/koi_fish.glb',
      (gltf) => {
        const model = gltf.scene;
        const animations = gltf.animations;

        // Compute model bounding box for optimal scaling
        const bbox = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        bbox.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        const scaleFactor = 16.0 / maxDim; // Normalize fish size

        // --- KOI 1: THE FAMOUS BLUE / CYAN HOLOGRAPHIC KOI ---
        const koiBlue = model.clone();
        koiBlue.scale.set(scaleFactor, scaleFactor, scaleFactor);

        // Apply Holographic Electric Cyan Glow Material
        koiBlue.traverse((child) => {
          if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({
              color: 0x00d4ff,
              emissive: 0x0088ff,
              emissiveIntensity: 0.85,
              roughness: 0.25,
              metalness: 0.65,
              transparent: true,
              opacity: 0.92,
              wireframe: false
            });
          }
        });

        // Set up Animation Mixer for Blue Koi
        if (animations && animations.length > 0) {
          const mixerBlue = new THREE.AnimationMixer(koiBlue);
          const actionBlue = mixerBlue.clipAction(animations[0]);
          actionBlue.timeScale = 1.15;
          actionBlue.play();
          this.mixers.push(mixerBlue);
        }

        this.scene.add(koiBlue);
        this.koiFishes.push({
          mesh: koiBlue,
          radiusX: 24,
          radiusY: 9,
          radiusZ: 14,
          speed: 0.42,
          phase: 0,
          baseY: 2
        });

        // --- KOI 2: THE FAMOUS ORANGE / AMBER HOLOGRAPHIC KOI ---
        const koiOrange = model.clone();
        koiOrange.scale.set(scaleFactor * 0.94, scaleFactor * 0.94, scaleFactor * 0.94);

        // Apply Holographic Sunburst Amber Glow Material
        koiOrange.traverse((child) => {
          if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({
              color: 0xff7700,
              emissive: 0xff5500,
              emissiveIntensity: 0.85,
              roughness: 0.25,
              metalness: 0.65,
              transparent: true,
              opacity: 0.92,
              wireframe: false
            });
          }
        });

        // Set up Animation Mixer for Orange Koi
        if (animations && animations.length > 0) {
          const mixerOrange = new THREE.AnimationMixer(koiOrange);
          const actionOrange = mixerOrange.clipAction(animations[0]);
          actionOrange.timeScale = 1.05;
          // Offset animation phase slightly for natural desynchronization
          actionOrange.time = 0.5;
          actionOrange.play();
          this.mixers.push(mixerOrange);
        }

        this.scene.add(koiOrange);
        this.koiFishes.push({
          mesh: koiOrange,
          radiusX: 26,
          radiusY: 10,
          radiusZ: 16,
          speed: 0.38,
          phase: Math.PI, // Opposite orbital phase
          baseY: -3
        });
      },
      undefined,
      (error) => {
        console.warn("Could not load 3D koi GLB model:", error);
      }
    );
  }

  createDataEmbers() {
    const count = 350;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 45;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 35;

      const isCyan = Math.random() > 0.5;
      if (isCyan) {
        colors[i * 3] = 0.0;
        colors[i * 3 + 1] = 0.94;
        colors[i * 3 + 2] = 1.0;
      } else {
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.45;
        colors[i * 3 + 2] = 0.0;
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    this.dataParticles = new THREE.Points(geometry, material);
    this.scene.add(this.dataParticles);
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX / this.width) * 2 - 1;
      this.mouse.targetY = -(e.clientY / this.height) * 2 + 1;
    });
  }

  animate() {
    requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // 1. Update Skeletal / Morph Swimming Animations
    for (let i = 0; i < this.mixers.length; i++) {
      this.mixers[i].update(delta);
    }

    // 2. Camera Parallax Tilt
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.04;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.04;

    this.camera.position.x = this.mouse.x * 4.5;
    this.camera.position.y = 4 + this.mouse.y * 3.0;
    this.camera.lookAt(0, 0, 0);

    // 3. Swimming Trajectories in 3D Space
    for (let i = 0; i < this.koiFishes.length; i++) {
      const koi = this.koiFishes[i];
      const t = elapsedTime * koi.speed + koi.phase;

      // Sinuous 3D figure-8 orbital curve
      const posX = Math.sin(t) * koi.radiusX;
      const posZ = Math.cos(t * 0.9) * koi.radiusZ - 4;
      const posY = koi.baseY + Math.sin(t * 1.8) * koi.radiusY * 0.45;

      // Lookahead point for natural heading orientation
      const dt = 0.04;
      const nextT = t + dt;
      const nextX = Math.sin(nextT) * koi.radiusX;
      const nextZ = Math.cos(nextT * 0.9) * koi.radiusZ - 4;
      const nextY = koi.baseY + Math.sin(nextT * 1.8) * koi.radiusY * 0.45;

      koi.mesh.position.set(posX, posY, posZ);
      koi.mesh.lookAt(nextX, nextY, nextZ);

      // Organic banking roll when curving
      const rollAngle = (nextX - posX) * 0.035;
      koi.mesh.rotation.z += rollAngle;
    }

    // 4. Drift Data Particles
    if (this.dataParticles) {
      const positions = this.dataParticles.geometry.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        let y = positions.getY(i) - 0.08;
        if (y < -22) y = 22;
        positions.setY(i, y);
      }
      positions.needsUpdate = true;
      this.dataParticles.rotation.y = elapsedTime * 0.02;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// Initialize upon DOM readiness
window.addEventListener('DOMContentLoaded', () => {
  if (typeof THREE !== 'undefined') {
    window.real3DKoiScene = new Real3DKoiScene('three-canvas-container');
  }
});
