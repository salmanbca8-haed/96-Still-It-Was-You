/* ==========================================================================
   96 (2018) — AMBIENT PARTICLES & FILM GRAIN SYSTEM
   Simulates glowing dust motes, warm memory embers, and cinema rain
   ========================================================================== */

class ParticleAtmosphere {
  constructor() {
    this.canvas = document.getElementById('particles-canvas');
    this.grainCanvas = document.getElementById('grain-canvas');
    
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.rainDrops = [];
    this.mouseX = window.innerWidth / 2;
    this.mouseY = window.innerHeight / 2;
    this.targetMouseX = this.mouseX;
    this.targetMouseY = this.mouseY;
    this.particleCount = window.innerWidth < 768 ? 40 : 85;
    this.rainCount = 60;
    this.isRainSectionActive = false;

    this.init();
  }

  init() {
    this.resize();
    this.createParticles();
    this.createRain();
    this.initGrain();

    window.addEventListener('resize', () => {
      this.resize();
      this.initGrain();
    });

    window.addEventListener('mousemove', (e) => {
      this.targetMouseX = e.clientX;
      this.targetMouseY = e.clientY;
    });

    this.animate();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 2.2 + 0.6,
        baseAlpha: Math.random() * 0.45 + 0.15,
        alpha: 0,
        speedX: (Math.random() - 0.5) * 0.35,
        speedY: (Math.random() - 0.5) * 0.35 - 0.15, // Slight upward drift
        color: Math.random() > 0.4 ? 'rgba(223, 177, 91,' : 'rgba(245, 197, 56,', // Warm gold
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseVal: Math.random() * Math.PI * 2
      });
    }
  }

  createRain() {
    this.rainDrops = [];
    for (let i = 0; i < this.rainCount; i++) {
      this.rainDrops.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        length: Math.random() * 25 + 15,
        speed: Math.random() * 8 + 12,
        opacity: Math.random() * 0.25 + 0.05
      });
    }
  }

  initGrain() {
    if (!this.grainCanvas) return;
    const gctx = this.grainCanvas.getContext('2d');
    this.grainCanvas.width = 256;
    this.grainCanvas.height = 256;

    const imgData = gctx.createImageData(256, 256);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
      const val = Math.floor(Math.random() * 255);
      data[i] = val;
      data[i + 1] = val;
      data[i + 2] = val;
      data[i + 3] = 255;
    }
    gctx.putImageData(imgData, 0, 0);
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Smooth mouse lerp
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

    // Draw Dust Motes
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Update positions
      p.pulseVal += p.pulseSpeed;
      p.alpha = p.baseAlpha + Math.sin(p.pulseVal) * 0.15;
      p.x += p.speedX;
      p.y += p.speedY;

      // Mouse subtle magnetic push
      const dx = this.mouseX - p.x;
      const dy = this.mouseY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 180) {
        const force = (180 - dist) / 180;
        p.x -= (dx / dist) * force * 0.8;
        p.y -= (dy / dist) * force * 0.8;
      }

      // Wrap edges
      if (p.x < -10) p.x = this.width + 10;
      if (p.x > this.width + 10) p.x = -10;
      if (p.y < -10) p.y = this.height + 10;
      if (p.y > this.height + 10) p.y = -10;

      // Render
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `${p.color} ${Math.max(0, p.alpha)})`;
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = 'rgba(223, 177, 91, 0.4)';
      this.ctx.fill();
    }
    this.ctx.shadowBlur = 0;

    // Optional Rain Overlay on Dark/Night sections
    const nightSection = document.getElementById('section-night');
    if (nightSection) {
      const rect = nightSection.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;

      if (inView) {
        this.ctx.strokeStyle = 'rgba(220, 230, 245, 0.2)';
        this.ctx.lineWidth = 1;
        for (let j = 0; j < this.rainDrops.length; j++) {
          const r = this.rainDrops[j];
          this.ctx.beginPath();
          this.ctx.moveTo(r.x, r.y);
          this.ctx.lineTo(r.x - 2, r.y + r.length);
          this.ctx.stroke();

          r.y += r.speed;
          r.x -= 0.8;
          if (r.y > this.height) {
            r.y = -r.length;
            r.x = Math.random() * this.width;
          }
        }
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

window.ParticleAtmosphere = ParticleAtmosphere;
