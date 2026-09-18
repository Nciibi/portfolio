/**
 * CYBERPUNK 2077 THREE.JS 3D JAPANTOWN PARADE & HOLOGRAPHIC KOI SIMULATION
 * Recreates the famous Arasaka parade / Corpo Plaza in Night City:
 * - 3D Night City Megastructure Skyscrapers with neon windows & Arasaka logos
 * - Floating Holographic Japanese Festival Lanterns
 * - Volumetric Neon Light Beams & Floating Digital Data Embers
 * - Two Giant 3D Holographic Koi Fish (Blue/Cyan & Orange/Amber)
 *   with procedural 3D swimming spine wave shaders, glowing Fresnel rims,
 *   flowing fins, and mouse parallax camera controls.
 */

class NightCityParadeScene {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.clock = new THREE.Clock();

    this.initScene();
    this.createSkyline();
    this.createLanterns();
    this.createLightBeams();
    this.createDataParticles();
    this.createHolographicKoi();

    this.bindEvents();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initScene() {
    // 1. Scene & Fog
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x04060a, 0.0085);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(55, this.width / this.height, 1, 1000);
    this.camera.position.set(0, 15, 65);

    // 3. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;
    this.container.appendChild(this.renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0x0f172a, 1.4);
    this.scene.add(ambientLight);

    // Directional cyan street bounce
    const dirCyan = new THREE.DirectionalLight(0x00f0ff, 1.2);
    dirCyan.position.set(30, 60, 40);
    this.scene.add(dirCyan);

    // Directional amber neon bounce
    const dirAmber = new THREE.DirectionalLight(0xff7700, 1.0);
    dirAmber.position.set(-30, 40, -20);
    this.scene.add(dirAmber);
  }

  /* --------------------------------------------------------------------------
     1. NIGHT CITY MEGASTRUCTURE SKYSCRAPERS & NEON ADVERTISEMENTS
     -------------------------------------------------------------------------- */
  createSkyline() {
    this.buildingGroup = new THREE.Group();

    // Procedural glowing window texture
    const windowTex = this.generateWindowTexture();
    const buildingMat = new THREE.MeshStandardMaterial({
      color: 0x07090f,
      roughness: 0.85,
      metalness: 0.25,
      map: windowTex,
      emissive: 0x00f0ff,
      emissiveMap: windowTex,
      emissiveIntensity: 0.55
    });

    const buildingMatAmber = new THREE.MeshStandardMaterial({
      color: 0x07090f,
      roughness: 0.85,
      metalness: 0.25,
      map: windowTex,
      emissive: 0xff7700,
      emissiveMap: windowTex,
      emissiveIntensity: 0.5
    });

    const towerGeoms = [
      new THREE.BoxGeometry(14, 110, 14),
      new THREE.BoxGeometry(18, 140, 18),
      new THREE.BoxGeometry(22, 180, 22),
      new THREE.BoxGeometry(16, 95, 16),
      new THREE.BoxGeometry(24, 160, 20)
    ];

    // Distribute skyscrapers around the parade corridor
    const buildingConfigs = [
      { x: -55, z: -40, h: 140, mat: buildingMat },
      { x: -35, z: -80, h: 180, mat: buildingMatAmber },
      { x: -70, z: 10, h: 110, mat: buildingMat },
      { x: -45, z: 40, h: 95, mat: buildingMatAmber },
      { x: 55, z: -50, h: 160, mat: buildingMatAmber },
      { x: 75, z: -20, h: 130, mat: buildingMat },
      { x: 45, z: 30, h: 100, mat: buildingMat },
      { x: 70, z: 60, h: 150, mat: buildingMatAmber },
      { x: 0, z: -110, h: 220, mat: buildingMat } // Main Arasaka Central Spire
    ];

    buildingConfigs.forEach((cfg, i) => {
      const geom = towerGeoms[i % towerGeoms.length];
      const mesh = new THREE.Mesh(geom, cfg.mat);
      mesh.position.set(cfg.x, cfg.h * 0.5 - 20, cfg.z);
      this.buildingGroup.add(mesh);

      // Add Glowing Roof Beacon / Hologram Antenna
      const antGeom = new THREE.CylinderGeometry(0.3, 0.3, 20, 8);
      const antMat = new THREE.MeshBasicMaterial({ color: (i % 2 === 0) ? 0x00f0ff : 0xff003c });
      const antenna = new THREE.Mesh(antGeom, antMat);
      antenna.position.set(cfg.x, cfg.h - 10, cfg.z);
      this.buildingGroup.add(antenna);
    });

    // Hologram Billboard Sign ("荒坂 // ARASAKA" & "夜市 // NIGHT CITY")
    const signTex = this.generateHologramSignTexture();
    const signMat = new THREE.MeshBasicMaterial({
      map: signTex,
      transparent: true,
      opacity: 0.92,
      side: THREE.DoubleSide
    });
    const signMesh = new THREE.Mesh(new THREE.PlaneGeometry(28, 14), signMat);
    signMesh.position.set(0, 55, -95);
    this.buildingGroup.add(signMesh);

    this.scene.add(this.buildingGroup);
  }

  generateWindowTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#05070A';
    ctx.fillRect(0, 0, 256, 512);

    // Draw grid of futuristic windows
    for (let y = 10; y < 512; y += 14) {
      for (let x = 8; x < 256; x += 12) {
        if (Math.random() > 0.42) {
          const isCyan = Math.random() > 0.35;
          ctx.fillStyle = isCyan ? 'rgba(0, 240, 255, 0.85)' : 'rgba(255, 230, 0, 0.9)';
          ctx.fillRect(x, y, 7, 8);
        }
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 4);
    return tex;
  }

  generateHologramSignTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, 512, 256);
    ctx.fillStyle = 'rgba(255, 0, 60, 0.2)';
    ctx.fillRect(0, 0, 512, 256);

    ctx.strokeStyle = '#FF003C';
    ctx.lineWidth = 6;
    ctx.strokeRect(8, 8, 496, 240);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 58px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('荒 坂  ARASAKA', 256, 110);

    ctx.fillStyle = '#FCEE0A';
    ctx.font = 'bold 36px monospace';
    ctx.fillText('JAPANTOWN PARADE // V.2.0.77', 256, 175);

    return new THREE.CanvasTexture(canvas);
  }

  /* --------------------------------------------------------------------------
     2. FLOATING HOLOGRAPHIC JAPANESE FESTIVAL LANTERNS
     -------------------------------------------------------------------------- */
  createLanterns() {
    this.lanterns = [];
    const lanternMat = new THREE.MeshBasicMaterial({
      color: 0xff3300,
      wireframe: true,
      transparent: true,
      opacity: 0.65
    });

    const lanternGeom = new THREE.CylinderGeometry(1.8, 1.8, 3.8, 8);

    for (let i = 0; i < 16; i++) {
      const mesh = new THREE.Mesh(lanternGeom, lanternMat);
      mesh.position.set(
        (Math.random() - 0.5) * 80,
        15 + Math.random() * 35,
        (Math.random() - 0.5) * 70
      );
      mesh.userData = {
        baseY: mesh.position.y,
        speed: 0.6 + Math.random() * 0.8,
        drift: Math.random() * Math.PI * 2
      };
      this.scene.add(mesh);
      this.lanterns.push(mesh);
    }
  }

  /* --------------------------------------------------------------------------
     3. VOLUMETRIC HOLOGRAM LIGHT BEAMS
     -------------------------------------------------------------------------- */
  createLightBeams() {
    const beamGeom = new THREE.ConeGeometry(8, 90, 16, 1, true);
    beamGeom.translate(0, 45, 0);

    const beamMatCyan = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.08,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });

    const beamMatAmber = new THREE.MeshBasicMaterial({
      color: 0xff8800,
      transparent: true,
      opacity: 0.08,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });

    const beam1 = new THREE.Mesh(beamGeom, beamMatCyan);
    beam1.position.set(-25, -15, -10);
    beam1.rotation.x = 0.2;
    beam1.rotation.z = -0.15;
    this.scene.add(beam1);

    const beam2 = new THREE.Mesh(beamGeom, beamMatAmber);
    beam2.position.set(25, -15, -20);
    beam2.rotation.x = -0.15;
    beam2.rotation.z = 0.2;
    this.scene.add(beam2);
  }

  /* --------------------------------------------------------------------------
     4. FLOATING DIGITAL EMBERS & HOLOGRAM DATA SPARKS
     -------------------------------------------------------------------------- */
  createDataParticles() {
    const count = 750;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 140;
      positions[i * 3 + 1] = Math.random() * 90;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 140;

      const isCyan = Math.random() > 0.45;
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
      size: 1.4,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    this.particleSystem = new THREE.Points(geometry, material);
    this.scene.add(this.particleSystem);
  }

  /* --------------------------------------------------------------------------
     5. TWO GIANT 3D HOLOGRAPHIC KOI FISH (BLUE & ORANGE)
     -------------------------------------------------------------------------- */
  createHolographicKoi() {
    this.koiFishList = [];

    // Custom Hologram Shader Material Builder
    const createHologramMaterial = (colorCore, colorGlow) => {
      return new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColorCore: { value: new THREE.Color(colorCore) },
          uColorGlow: { value: new THREE.Color(colorGlow) }
        },
        vertexShader: `
          uniform float uTime;
          varying vec3 vNormal;
          varying vec3 vPosition;
          varying vec2 vUv;

          void main() {
            vNormal = normalize(normalMatrix * normal);
            vUv = uv;

            // Sinuous organic spine undulation along the fish Z-axis
            vec3 pos = position;
            float wave = sin(uTime * 4.5 + pos.z * 0.22) * 1.8;
            // Dampen undulation at head (z > 0), amplify towards caudal tail (z < 0)
            float taper = clamp(-pos.z * 0.07 + 0.3, 0.1, 1.6);
            pos.x += wave * taper;

            vPosition = (modelViewMatrix * vec4(pos, 1.0)).xyz;
            gl_Position = projectionMatrix * vec4(vPosition, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uTime;
          uniform vec3 uColorCore;
          uniform vec3 uColorGlow;
          varying vec3 vNormal;
          varying vec3 vPosition;
          varying vec2 vUv;

          void main() {
            // Fresnel Edge Rim Calculation
            vec3 viewDir = normalize(-vPosition);
            float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 2.2);

            // Holographic Horizontal Scanline Raster
            float scanline = sin(vPosition.y * 14.0 + uTime * 6.0) * 0.5 + 0.5;
            scanline = pow(scanline, 2.0) * 0.35 + 0.65;

            // Cyber wireframe glitch pulses
            float glitchPulse = sin(uTime * 3.0 + vPosition.z * 0.1) * 0.2 + 0.8;

            vec3 finalColor = mix(uColorGlow, uColorCore, fresnel * 0.85);
            float alpha = (fresnel * 0.75 + 0.28) * scanline * glitchPulse;

            gl_FragColor = vec4(finalColor, clamp(alpha, 0.12, 0.95));
          }
        `,
        transparent: true,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
    };

    // Construct 3D Koi Fish Model Hierarchy
    const build3DKoiMesh = (material, scale = 1.0) => {
      const koiGroup = new THREE.Group();

      // 1. Aerodynamic Curved Body (Tapered Cylinder / Lathe)
      const bodyPoints = [];
      for (let i = 0; i <= 24; i++) {
        const t = i / 24;
        let r = 0;
        if (t < 0.2) {
          r = Math.sin((t / 0.2) * Math.PI * 0.5) * 3.2; // Head
        } else {
          r = Math.cos(((t - 0.2) / 0.8) * Math.PI * 0.48) * 3.2; // Tapering tail
        }
        const z = (t - 0.5) * 26;
        bodyPoints.push(new THREE.Vector2(Math.max(r, 0.3), z));
      }
      const bodyGeom = new THREE.LatheGeometry(bodyPoints, 18);
      // Align lengthwise along Z
      bodyGeom.rotateX(Math.PI * 0.5);
      const bodyMesh = new THREE.Mesh(bodyGeom, material);
      koiGroup.add(bodyMesh);

      // 2. Large Translucent Pectoral Fins (Left & Right)
      const finGeom = new THREE.PlaneGeometry(6, 12, 6, 8);
      finGeom.translate(3, -6, 0);

      const leftFin = new THREE.Mesh(finGeom, material);
      leftFin.position.set(2.8, -0.4, 4);
      leftFin.rotation.set(0.3, 0.6, -0.4);
      koiGroup.add(leftFin);

      const rightFin = new THREE.Mesh(finGeom, material);
      rightFin.position.set(-2.8, -0.4, 4);
      rightFin.rotation.set(0.3, -0.6, 0.4);
      koiGroup.add(rightFin);

      // 3. Dorsal Fin (Top Spine)
      const dorsalGeom = new THREE.PlaneGeometry(0.8, 14, 4, 8);
      dorsalGeom.translate(0, 2.5, -2);
      const dorsalFin = new THREE.Mesh(dorsalGeom, material);
      dorsalFin.position.set(0, 2.6, 0);
      koiGroup.add(dorsalFin);

      // 4. Large Sinuous Caudal Tail Fin
      const tailGeom = new THREE.PlaneGeometry(10, 16, 6, 10);
      tailGeom.translate(0, 0, -8);
      const tailFin = new THREE.Mesh(tailGeom, material);
      tailFin.position.set(0, 0, -13);
      koiGroup.add(tailFin);

      koiGroup.scale.set(scale, scale, scale);
      return { group: koiGroup, material: material, leftFin: leftFin, rightFin: rightFin };
    };

    // 1. The Iconic Blue / Cyan Koi Fish
    this.koiBlue = build3DKoiMesh(createHologramMaterial(0x00f0ff, 0x0044ff), 1.25);
    this.scene.add(this.koiBlue.group);
    this.koiFishList.push({
      data: this.koiBlue,
      orbitRadiusX: 38,
      orbitRadiusZ: 32,
      baseY: 18,
      speed: 0.45,
      offset: 0
    });

    // 2. The Legendary Orange / Amber Koi Fish
    this.koiOrange = build3DKoiMesh(createHologramMaterial(0xff7700, 0xffaa00), 1.15);
    this.scene.add(this.koiOrange.group);
    this.koiFishList.push({
      data: this.koiOrange,
      orbitRadiusX: 44,
      orbitRadiusZ: 36,
      baseY: 28,
      speed: 0.40,
      offset: Math.PI // opposite orbital phase
    });
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
      // Normalized device coordinates (-1 to 1)
      this.mouse.targetX = (e.clientX / this.width) * 2 - 1;
      this.mouse.targetY = -(e.clientY / this.height) * 2 + 1;

      // Update Top HUD Compass Tape
      const compassTrack = document.getElementById("hud-compass-track");
      if (compassTrack) {
        const offsetDeg = this.mouse.targetX * 60;
        compassTrack.style.transform = `translateX(${-offsetDeg}px)`;
      }
    });
  }

  animate() {
    requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // 1. Smooth Camera Parallax Response to Mouse Cursor
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.04;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.04;

    this.camera.position.x = this.mouse.x * 12;
    this.camera.position.y = 15 + this.mouse.y * 8;
    this.camera.lookAt(0, 22, -15);

    // 2. Animate 3D Holographic Swimming Koi Fish
    for (let i = 0; i < this.koiFishList.length; i++) {
      const koiObj = this.koiFishList[i];
      const meshGroup = koiObj.data.group;
      const mat = koiObj.data.material;

      // Update shader uniform time
      mat.uniforms.uTime.value = elapsedTime;

      // Calculate 3D Lissajous orbital swimming curve
      const angle = elapsedTime * koiObj.speed + koiObj.offset;
      const targetX = Math.sin(angle) * koiObj.orbitRadiusX;
      const targetZ = Math.cos(angle * 0.9) * koiObj.orbitRadiusZ;
      const targetY = koiObj.baseY + Math.sin(angle * 1.8) * 8.0;

      // Compute heading angle and banking
      const nextAngle = angle + 0.03;
      const nextX = Math.sin(nextAngle) * koiObj.orbitRadiusX;
      const nextZ = Math.cos(nextAngle * 0.9) * koiObj.orbitRadiusZ;
      const nextY = koiObj.baseY + Math.sin(nextAngle * 1.8) * 8.0;

      meshGroup.position.set(targetX, targetY, targetZ);

      // Orient fish heading smoothly in 3D direction of travel
      meshGroup.lookAt(nextX, nextY, nextZ);

      // Organic banking roll
      const rollAngle = (nextX - targetX) * 0.04;
      meshGroup.rotation.z += rollAngle;

      // Pectoral fin flapping
      const flap = Math.sin(elapsedTime * 5.0) * 0.35;
      koiObj.data.leftFin.rotation.z = -0.4 + flap;
      koiObj.data.rightFin.rotation.z = 0.4 - flap;
    }

    // 3. Animate Floating Japanese Lanterns
    for (let i = 0; i < this.lanterns.length; i++) {
      const lant = this.lanterns[i];
      lant.position.y = lant.userData.baseY + Math.sin(elapsedTime * lant.userData.speed + lant.userData.drift) * 2.5;
      lant.rotation.y += 0.008;
    }

    // 4. Animate Data Embers
    if (this.particleSystem) {
      const posAttr = this.particleSystem.geometry.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        let y = posAttr.getY(i) - 0.15;
        if (y < -5) y = 85;
        posAttr.setY(i, y);
      }
      posAttr.needsUpdate = true;
      this.particleSystem.rotation.y = elapsedTime * 0.012;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// Initialize upon DOM readiness
window.addEventListener('DOMContentLoaded', () => {
  if (typeof THREE !== 'undefined') {
    window.nightCityParade = new NightCityParadeScene('three-canvas-container');
  }
});
