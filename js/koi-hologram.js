/**
 * CYBERPUNK 2077 HOLOGRAPHIC BLUE & ORANGE KOI FISH SIMULATION
 * Inspired by the iconic Arasaka parade floating hologram koi in Night City.
 * Features 24-segment spine inverse kinematics, fluid fin drag,
 * wireframe hologram aesthetics, luminous blooms, and particle wake trails.
 */

class HolographicKoiCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.particles = [];
    this.mouse = { x: this.width * 0.5, y: this.height * 0.4, active: false };
    this.time = 0;

    this.resize();
    window.addEventListener("resize", () => this.resize());
    window.addEventListener("mousemove", (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.mouse.active = true;
    });
    window.addEventListener("mouseleave", () => {
      this.mouse.active = false;
    });

    // Initialize the Two Legendary Holographic Koi Fish
    this.fishes = [
      new HologramKoi({
        name: "BLUE_CYAN_KOI",
        colorCore: "rgba(0, 240, 255, 0.95)",
        colorGlow: "rgba(0, 140, 255, 0.8)",
        colorWire: "rgba(160, 245, 255, 0.65)",
        colorFin: "rgba(0, 200, 255, 0.22)",
        particleColor: "rgba(0, 240, 255, ",
        startX: this.width * 0.25,
        startY: this.height * 0.35,
        targetOffset: 0,
        speed: 2.1,
        bodyScale: 1.05
      }),
      new HologramKoi({
        name: "ORANGE_GOLD_KOI",
        colorCore: "rgba(255, 120, 0, 0.95)",
        colorGlow: "rgba(255, 185, 0, 0.8)",
        colorWire: "rgba(255, 220, 140, 0.65)",
        colorFin: "rgba(255, 130, 20, 0.22)",
        particleColor: "rgba(255, 140, 0, ",
        startX: this.width * 0.75,
        startY: this.height * 0.65,
        targetOffset: Math.PI,
        speed: 1.95,
        bodyScale: 0.98
      })
    ];

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.resetTransform();
    this.ctx.scale(dpr, dpr);
  }

  animate() {
    this.time += 0.016;
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Update & Render Particles
    this.renderParticles();

    // Update & Render each Koi
    for (let i = 0; i < this.fishes.length; i++) {
      const koi = this.fishes[i];
      koi.update(this.width, this.height, this.mouse, this.time, (px, py, color) => {
        if (this.particles.length < 120) {
          this.particles.push(new HologramParticle(px, py, color));
        }
      });
      koi.draw(this.ctx, this.time);
    }

    requestAnimationFrame(this.animate);
  }

  renderParticles() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.update();
      p.draw(this.ctx);
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }
}

/**
 * Single Holographic Koi Fish
 */
class HologramKoi {
  constructor(config) {
    this.name = config.name;
    this.colorCore = config.colorCore;
    this.colorGlow = config.colorGlow;
    this.colorWire = config.colorWire;
    this.colorFin = config.colorFin;
    this.particleColor = config.particleColor;
    this.targetOffset = config.targetOffset;
    this.speed = config.speed;
    this.bodyScale = config.bodyScale;

    this.numSegments = 22;
    this.segmentLength = 9 * this.bodyScale;
    this.x = config.startX;
    this.y = config.startY;
    this.angle = Math.random() * Math.PI * 2;
    this.angularVelocity = 0;

    // Body segment points for inverse-kinematic spine
    this.segments = [];
    for (let i = 0; i < this.numSegments; i++) {
      this.segments.push({
        x: this.x - Math.cos(this.angle) * i * this.segmentLength,
        y: this.y - Math.sin(this.angle) * i * this.segmentLength,
        angle: this.angle,
        radius: this.calculateRadius(i)
      });
    }

    // Fin oscillation angles
    this.finCycle = 0;
  }

  calculateRadius(idx) {
    // Elegant koi fish tapered silhouette
    const t = idx / (this.numSegments - 1);
    let r = 0;
    if (t < 0.22) {
      r = Math.sin((t / 0.22) * (Math.PI * 0.5)) * 18;
    } else {
      r = Math.cos(((t - 0.22) / 0.78) * (Math.PI * 0.48)) * 18;
    }
    return Math.max(r * this.bodyScale, 1.8);
  }

  update(width, height, mouse, time, emitParticle) {
    this.finCycle += 0.08;

    // Smooth sweeping autonomous target across the screen
    const cx = width * 0.5;
    const cy = height * 0.5;
    const radiusX = width * 0.38;
    const radiusY = height * 0.32;

    const orbitT = time * 0.45 + this.targetOffset;
    // Lissajous 3D-like figure-8 path
    let targetX = cx + Math.sin(orbitT) * radiusX;
    let targetY = cy + Math.sin(orbitT * 2) * radiusY * 0.75;

    // Subtle attraction to mouse when cursor is active in viewport
    if (mouse.active) {
      const dxm = mouse.x - this.x;
      const dym = mouse.y - this.y;
      const distM = Math.sqrt(dxm * dxm + dym * dym);
      if (distM < 320 && distM > 40) {
        // Gently steer towards mouse
        targetX = targetX * 0.55 + mouse.x * 0.45;
        targetY = targetY * 0.55 + mouse.y * 0.45;
      }
    }

    // Steer towards target
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const targetAngle = Math.atan2(dy, dx);

    let angleDiff = targetAngle - this.angle;
    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

    // Natural turn inertia
    this.angularVelocity += angleDiff * 0.025;
    this.angularVelocity *= 0.88;
    this.angle += this.angularVelocity;

    // Move head forward with swimming sine undulation
    const swimWave = Math.sin(this.finCycle * 2) * 0.22;
    const actualHeading = this.angle + swimWave;

    this.x += Math.cos(actualHeading) * this.speed;
    this.y += Math.sin(actualHeading) * this.speed;

    // Update spine segments
    this.segments[0].x = this.x;
    this.segments[0].y = this.y;
    this.segments[0].angle = actualHeading;

    for (let i = 1; i < this.numSegments; i++) {
      const prev = this.segments[i - 1];
      const cur = this.segments[i];

      const segDx = cur.x - prev.x;
      const segDy = cur.y - prev.y;
      cur.angle = Math.atan2(segDy, segDx);

      cur.x = prev.x + Math.cos(cur.angle) * this.segmentLength;
      cur.y = prev.y + Math.sin(cur.angle) * this.segmentLength;

      // Particle wake emitted from tail
      if (i === this.numSegments - 1 && Math.random() < 0.35) {
        emitParticle(cur.x, cur.y, this.particleColor);
      }
    }
  }

  draw(ctx, time) {
    ctx.save();

    // 1. Draw Translucent Glowing Fins
    this.drawFins(ctx);

    // 2. Draw Wireframe Body Ribs & Outer Hull
    this.drawBodyHull(ctx);

    // 3. Draw Holographic Spine & Cyber Nodes
    this.drawSpine(ctx, time);

    ctx.restore();
  }

  drawBodyHull(ctx) {
    const leftPoints = [];
    const rightPoints = [];

    for (let i = 0; i < this.numSegments; i++) {
      const seg = this.segments[i];
      const normalAngle = seg.angle + Math.PI * 0.5;
      const lx = seg.x + Math.cos(normalAngle) * seg.radius;
      const ly = seg.y + Math.sin(normalAngle) * seg.radius;
      const rx = seg.x - Math.cos(normalAngle) * seg.radius;
      const ry = seg.y - Math.sin(normalAngle) * seg.radius;

      leftPoints.push({ x: lx, y: ly });
      rightPoints.push({ x: rx, y: ry });
    }

    // Outer Body Holographic Fill
    ctx.beginPath();
    ctx.moveTo(leftPoints[0].x, leftPoints[0].y);
    for (let i = 1; i < leftPoints.length; i++) {
      ctx.lineTo(leftPoints[i].x, leftPoints[i].y);
    }
    for (let i = rightPoints.length - 1; i >= 0; i--) {
      ctx.lineTo(rightPoints[i].x, rightPoints[i].y);
    }
    ctx.closePath();

    ctx.fillStyle = this.colorFin;
    ctx.fill();

    // Glowing Hologram Perimeter Edge
    ctx.shadowBlur = 12;
    ctx.shadowColor = this.colorGlow;
    ctx.strokeStyle = this.colorCore;
    ctx.lineWidth = 1.4;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Translucent Internal Ribs (Holographic Cyber Wireframe)
    ctx.strokeStyle = this.colorWire;
    ctx.lineWidth = 0.8;
    for (let i = 1; i < this.numSegments - 1; i += 2) {
      ctx.beginPath();
      ctx.moveTo(leftPoints[i].x, leftPoints[i].y);
      ctx.lineTo(rightPoints[i].x, rightPoints[i].y);
      ctx.stroke();
    }
  }

  drawFins(ctx) {
    // Pectoral Fins attached at segment 4
    const segPect = this.segments[3];
    const pectAngle = segPect.angle;
    const flap = Math.sin(this.finCycle * 1.5) * 0.35;

    this.drawSingleFin(ctx, segPect.x, segPect.y, pectAngle + Math.PI * 0.55 + flap, 32 * this.bodyScale, 16);
    this.drawSingleFin(ctx, segPect.x, segPect.y, pectAngle - Math.PI * 0.55 - flap, 32 * this.bodyScale, 16);

    // Ventral Fins attached at segment 12
    const segVent = this.segments[11];
    this.drawSingleFin(ctx, segVent.x, segVent.y, segVent.angle + Math.PI * 0.65, 20 * this.bodyScale, 10);
    this.drawSingleFin(ctx, segVent.x, segVent.y, segVent.angle - Math.PI * 0.65, 20 * this.bodyScale, 10);

    // Sinuous Caudal Tail Fin attached to the end
    const tailSeg = this.segments[this.numSegments - 1];
    const tailAngle = tailSeg.angle + Math.PI;
    const tailWiggle = Math.sin(this.finCycle * 2) * 0.45;

    ctx.save();
    ctx.translate(tailSeg.x, tailSeg.y);
    ctx.rotate(tailAngle + tailWiggle);

    // Dual-lobed flowing holographic tail
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(24 * this.bodyScale, -18 * this.bodyScale, 48 * this.bodyScale, -26 * this.bodyScale, 55 * this.bodyScale, -10 * this.bodyScale);
    ctx.bezierCurveTo(36 * this.bodyScale, -2 * this.bodyScale, 36 * this.bodyScale, 2 * this.bodyScale, 55 * this.bodyScale, 10 * this.bodyScale);
    ctx.bezierCurveTo(48 * this.bodyScale, 26 * this.bodyScale, 24 * this.bodyScale, 18 * this.bodyScale, 0, 0);
    ctx.closePath();

    ctx.fillStyle = this.colorFin;
    ctx.fill();

    ctx.shadowBlur = 10;
    ctx.shadowColor = this.colorGlow;
    ctx.strokeStyle = this.colorCore;
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Tail fin ray filaments
    ctx.strokeStyle = this.colorWire;
    ctx.lineWidth = 0.7;
    for (let r = -8; r <= 8; r += 4) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(28 * this.bodyScale, r * 2, 48 * this.bodyScale, r * 2.8);
      ctx.stroke();
    }

    ctx.restore();
  }

  drawSingleFin(ctx, x, y, angle, length, width) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(length * 0.5, -width, length, 0);
    ctx.quadraticCurveTo(length * 0.5, width * 0.6, 0, 0);
    ctx.closePath();

    ctx.fillStyle = this.colorFin;
    ctx.fill();

    ctx.strokeStyle = this.colorCore;
    ctx.lineWidth = 0.9;
    ctx.stroke();

    ctx.restore();
  }

  drawSpine(ctx, time) {
    // Glowing central nerve cord
    ctx.beginPath();
    ctx.moveTo(this.segments[0].x, this.segments[0].y);
    for (let i = 1; i < this.numSegments; i++) {
      ctx.lineTo(this.segments[i].x, this.segments[i].y);
    }
    ctx.strokeStyle = this.colorCore;
    ctx.lineWidth = 1.6;
    ctx.shadowBlur = 8;
    ctx.shadowColor = this.colorGlow;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Glowing Vertebral Nodes
    for (let i = 0; i < this.numSegments; i += 3) {
      const seg = this.segments[i];
      ctx.beginPath();
      ctx.arc(seg.x, seg.y, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
    }

    // Cyber Whisker barbels at the mouth
    const head = this.segments[0];
    const hAngle = head.angle;
    const wFlap = Math.sin(this.finCycle * 2.5) * 0.25;

    ctx.strokeStyle = this.colorCore;
    ctx.lineWidth = 1.0;
    // Left whisker
    ctx.beginPath();
    ctx.moveTo(head.x, head.y);
    ctx.quadraticCurveTo(
      head.x + Math.cos(hAngle + 0.6 + wFlap) * 16,
      head.y + Math.sin(hAngle + 0.6 + wFlap) * 16,
      head.x + Math.cos(hAngle + 0.8 + wFlap) * 26,
      head.y + Math.sin(hAngle + 0.8 + wFlap) * 26
    );
    ctx.stroke();

    // Right whisker
    ctx.beginPath();
    ctx.moveTo(head.x, head.y);
    ctx.quadraticCurveTo(
      head.x + Math.cos(hAngle - 0.6 - wFlap) * 16,
      head.y + Math.sin(hAngle - 0.6 - wFlap) * 16,
      head.x + Math.cos(hAngle - 0.8 - wFlap) * 26,
      head.y + Math.sin(hAngle - 0.8 - wFlap) * 26
    );
    ctx.stroke();
  }
}

/**
 * Holographic Floating Spark / Particle Wake
 */
class HologramParticle {
  constructor(x, y, colorPrefix) {
    this.x = x + (Math.random() - 0.5) * 8;
    this.y = y + (Math.random() - 0.5) * 8;
    this.vx = (Math.random() - 0.5) * 0.9;
    this.vy = (Math.random() - 0.5) * 0.9 - 0.3;
    this.size = Math.random() * 2.2 + 0.8;
    this.maxLife = Math.random() * 45 + 30;
    this.life = this.maxLife;
    this.colorPrefix = colorPrefix;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
  }

  draw(ctx) {
    const alpha = (this.life / this.maxLife) * 0.75;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `${this.colorPrefix}${alpha})`;
    ctx.fill();
  }
}

// Instantiate upon DOM ready
window.addEventListener("DOMContentLoaded", () => {
  window.koiCanvas = new HolographicKoiCanvas("koi-canvas");
});
