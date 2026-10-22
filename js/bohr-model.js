/**
 * ChemPulse — Dynamic Bohr Atom Canvas Visualizer
 * Real-time 2D Canvas rendering of atomic nuclei and electron orbits.
 */

class BohrVisualizer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.currentElement = null;
    this.animationFrameId = null;
    this.time = 0;
  }

  setElement(element) {
    this.currentElement = element;
    if (!this.animationFrameId) {
      this.animate();
    }
  }

  animate() {
    this.time += 0.02;
    this.render();
    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  render() {
    if (!this.ctx || !this.currentElement) return;

    const width = this.canvas.width;
    const height = this.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    this.ctx.clearRect(0, 0, width, height);

    const shells = this.currentElement.shells || [1];
    const numShells = shells.length;
    const maxRadius = Math.min(centerX, centerY) - 24;
    const baseRadius = 35;
    const shellStep = numShells > 1 ? (maxRadius - baseRadius) / (numShells) : 40;

    // 1. Draw glowing orbits and electrons
    shells.forEach((electronCount, shellIdx) => {
      const radius = baseRadius + (shellIdx + 1) * shellStep;

      // Orbit circle
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      this.ctx.strokeStyle = 'rgba(0, 242, 254, 0.18)';
      this.ctx.lineWidth = 1.5;
      this.ctx.setLineDash([4, 4]);
      this.ctx.stroke();
      this.ctx.setLineDash([]);

      // Shell label (K, L, M, N...)
      const shellNames = ['K', 'L', 'M', 'N', 'O', 'P', 'Q'];
      this.ctx.fillStyle = 'rgba(148, 163, 184, 0.5)';
      this.ctx.font = '10px JetBrains Mono';
      this.ctx.fillText(`${shellNames[shellIdx] || ''}`, centerX + radius + 4, centerY - 4);

      // Electrons on this shell
      const speed = (shellIdx % 2 === 0 ? 1 : -1) * (0.8 / (shellIdx + 1));
      const angleOffset = this.time * speed;

      for (let i = 0; i < electronCount; i++) {
        const angle = angleOffset + (i * 2 * Math.PI) / electronCount;
        const eX = centerX + radius * Math.cos(angle);
        const eY = centerY + radius * Math.sin(angle);

        // Electron glow
        const glowGrad = this.ctx.createRadialGradient(eX, eY, 0, eX, eY, 8);
        glowGrad.addColorStop(0, 'rgba(0, 242, 254, 0.9)');
        glowGrad.addColorStop(1, 'rgba(0, 242, 254, 0)');
        this.ctx.beginPath();
        this.ctx.arc(eX, eY, 8, 0, Math.PI * 2);
        this.ctx.fillStyle = glowGrad;
        this.ctx.fill();

        // Electron core
        this.ctx.beginPath();
        this.ctx.arc(eX, eY, 3.5, 0, Math.PI * 2);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.shadowColor = '#00f2fe';
        this.ctx.shadowBlur = 10;
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
      }
    });

    // 2. Draw Nucleus (Protons & Neutrons)
    const nucleusRadius = 24;
    const nucleusGrad = this.ctx.createRadialGradient(
      centerX - 4, centerY - 4, 2,
      centerX, centerY, nucleusRadius
    );
    nucleusGrad.addColorStop(0, '#f43f5e');
    nucleusGrad.addColorStop(0.7, '#9d4edd');
    nucleusGrad.addColorStop(1, '#3b82f6');

    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, nucleusRadius, 0, Math.PI * 2);
    this.ctx.fillStyle = nucleusGrad;
    this.ctx.shadowColor = 'rgba(157, 78, 221, 0.7)';
    this.ctx.shadowBlur = 16;
    this.ctx.fill();
    this.ctx.shadowBlur = 0;

    // Nucleus text (Atomic Symbol & Protons)
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 15px Outfit';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(this.currentElement.symbol, centerX, centerY - 3);

    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    this.ctx.font = '9px JetBrains Mono';
    this.ctx.fillText(`+${this.currentElement.number}`, centerX, centerY + 11);
  }
}

// Hero Atom Canvas (Interactive 3D-like orbital spin)
class HeroAtomVisualizer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.time = 0;
    this.animate();
  }

  animate() {
    this.time += 0.015;
    this.render();
    requestAnimationFrame(() => this.animate());
  }

  render() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    this.ctx.clearRect(0, 0, w, h);

    const orbits = [
      { r: 160, tiltX: 0.8, tiltY: 0.35, rot: 0.6, color: '#00f2fe', speed: 1.2 },
      { r: 160, tiltX: -0.7, tiltY: 0.45, rot: -0.8, color: '#9d4edd', speed: -1.0 },
      { r: 160, tiltX: 0.3, tiltY: 0.9, rot: 1.4, color: '#10b981', speed: 1.4 }
    ];

    orbits.forEach((orb, idx) => {
      this.ctx.save();
      this.ctx.translate(cx, cy);
      this.ctx.rotate(orb.rot);
      this.ctx.scale(orb.tiltX, orb.tiltY);

      // Orbit line
      this.ctx.beginPath();
      this.ctx.arc(0, 0, orb.r, 0, Math.PI * 2);
      this.ctx.strokeStyle = `${orb.color}33`;
      this.ctx.lineWidth = 2;
      this.ctx.stroke();

      // Electron
      const angle = this.time * orb.speed + (idx * Math.PI) / 1.5;
      const ex = orb.r * Math.cos(angle);
      const ey = orb.r * Math.sin(angle);

      this.ctx.beginPath();
      this.ctx.arc(ex, ey, 6, 0, Math.PI * 2);
      this.ctx.fillStyle = orb.color;
      this.ctx.shadowColor = orb.color;
      this.ctx.shadowBlur = 15;
      this.ctx.fill();

      this.ctx.restore();
    });

    // Central pulsing nucleus
    const pulse = Math.sin(this.time * 3) * 3;
    const grad = this.ctx.createRadialGradient(cx, cy, 2, cx, cy, 28 + pulse);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.3, '#00f2fe');
    grad.addColorStop(0.8, '#8b5cf6');
    grad.addColorStop(1, 'transparent');

    this.ctx.beginPath();
    this.ctx.arc(cx, cy, 28 + pulse, 0, Math.PI * 2);
    this.ctx.fillStyle = grad;
    this.ctx.fill();
  }
}
