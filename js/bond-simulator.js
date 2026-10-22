/**
 * ChemPulse — Chemical Bond Interactive Simulator
 * Dynamic Canvas 2D simulation of Ionic, Covalent Polar/Nonpolar, and Metallic bonds.
 */

class BondSimulator {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.atom1 = null;
    this.atom2 = null;
    this.bondData = null;
    this.time = 0;
    this.animProgress = 0;
    this.isSynthesizing = false;

    // Metallic cloud particles
    this.metallicElectrons = [];
    for (let i = 0; i < 40; i++) {
      this.metallicElectrons.push({
        x: Math.random() * 600 + 100,
        y: Math.random() * 200 + 90,
        vx: (Math.random() - 0.5) * 2.5,
        vy: (Math.random() - 0.5) * 1.5,
        size: Math.random() * 2.5 + 2
      });
    }

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    this.animate();
  }

  resizeCanvas() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width > 0 && Math.abs(this.canvas.width - rect.width) > 2) {
      this.canvas.width = rect.width;
      this.canvas.height = rect.height || 380;
    }
  }

  setBond(atom1, atom2, presetData = null) {
    this.atom1 = atom1;
    this.atom2 = atom2;

    if (presetData) {
      this.bondData = presetData;
    } else {
      this.bondData = calculateBondInfo(atom1, atom2);
    }

    this.triggerSynthesis();
    this.updateUI();
  }

  triggerSynthesis() {
    this.animProgress = 0;
    this.isSynthesizing = true;
    if (window.soundManager) {
      window.soundManager.playBond();
    }
  }

  updateUI() {
    if (!this.bondData || !this.atom1 || !this.atom2) return;

    // Badges & Labels
    const typeLabel = document.getElementById('stage-bond-type-label');
    const atom1Label = document.getElementById('stage-atom1-label');
    const atom2Label = document.getElementById('stage-atom2-label');
    const diffVal = document.getElementById('diff-val');
    const resultBadge = document.getElementById('result-bond-badge');
    const resultFormula = document.getElementById('result-formula');
    const resultMechanism = document.getElementById('result-mechanism');
    const resultProps = document.getElementById('result-properties');
    const lewisDiagram = document.getElementById('lewis-diagram');

    if (atom1Label) atom1Label.textContent = `${this.atom1.name} (${this.atom1.symbol})`;
    if (atom2Label) atom2Label.textContent = `${this.atom2.name} (${this.atom2.symbol})`;
    if (typeLabel) typeLabel.textContent = this.bondData.typeName;
    
    const deltaEn = this.bondData.deltaEn !== undefined ? this.bondData.deltaEn : Math.abs(this.atom1.en - this.atom2.en).toFixed(2);
    if (diffVal) diffVal.textContent = deltaEn;

    if (resultBadge) {
      resultBadge.textContent = this.bondData.typeName;
      resultBadge.className = `bond-type-badge ${this.bondData.type}`;
    }

    if (resultFormula) {
      resultFormula.textContent = this.bondData.formula || `${this.atom1.symbol}${this.atom2.symbol}`;
    }

    if (resultMechanism) {
      resultMechanism.textContent = this.bondData.mechanism;
    }

    if (resultProps && this.bondData.properties) {
      resultProps.innerHTML = this.bondData.properties.map(p => `<li>${p}</li>`).join('');
    }

    if (lewisDiagram) {
      lewisDiagram.textContent = this.bondData.lewis || `${this.atom1.symbol} : ${this.atom2.symbol}`;
    }
  }

  animate() {
    this.time += 0.03;
    if (this.isSynthesizing && this.animProgress < 1) {
      this.animProgress += 0.025;
      if (this.animProgress >= 1) {
        this.animProgress = 1;
        this.isSynthesizing = false;
      }
    }

    this.render();
    requestAnimationFrame(() => this.animate());
  }

  render() {
    if (!this.ctx || !this.atom1 || !this.atom2) return;
    this.resizeCanvas();

    const w = this.canvas.width;
    const h = this.canvas.height;
    this.ctx.clearRect(0, 0, w, h);

    const type = this.bondData ? this.bondData.type : 'nonpolar';

    if (type === 'metallic') {
      this.renderMetallicBond(w, h);
    } else if (type === 'ionic') {
      this.renderIonicBond(w, h);
    } else if (type === 'polar') {
      this.renderPolarCovalentBond(w, h);
    } else {
      this.renderNonpolarCovalentBond(w, h);
    }
  }

  // 1. IONIC BOND VISUALIZATION
  renderIonicBond(w, h) {
    const cy = h / 2;
    const distance = 280 - this.animProgress * 50;
    const cx1 = w / 2 - distance / 2;
    const cx2 = w / 2 + distance / 2;

    const isMetal1 = ["alkali", "alkaline-earth", "transition", "post-transition"].includes(this.atom1.category);
    const donorX = isMetal1 ? cx1 : cx2;
    const acceptX = isMetal1 ? cx2 : cx1;
    const donorAtom = isMetal1 ? this.atom1 : this.atom2;
    const acceptAtom = isMetal1 ? this.atom2 : this.atom1;

    // Draw electrostatic attraction waves
    if (this.animProgress > 0.6) {
      const alpha = (this.animProgress - 0.6) * 2.5;
      this.ctx.save();
      this.ctx.strokeStyle = `rgba(0, 242, 254, ${alpha * 0.4})`;
      this.ctx.lineWidth = 2;
      this.ctx.setLineDash([6, 6]);
      this.ctx.beginPath();
      this.ctx.moveTo(cx1 + 45, cy);
      this.ctx.lineTo(cx2 - 45, cy);
      this.ctx.stroke();
      this.ctx.restore();

      // Coulomb attraction label
      this.ctx.fillStyle = `rgba(0, 242, 254, ${alpha})`;
      this.ctx.font = '13px Outfit';
      this.ctx.textAlign = 'center';
      this.ctx.fillText("Кулонівське електростатичне притягання (+ 🧲 -)", w / 2, Math.max(30, cy - 65));
    }

    // Atom 1
    this.drawAtomCore(cx1, cy, this.atom1, 44, this.animProgress > 0.7 ? (isMetal1 ? '+' : '–') : '');
    // Atom 2
    this.drawAtomCore(cx2, cy, this.atom2, 48, this.animProgress > 0.7 ? (isMetal1 ? '–' : '+') : '');

    // Transferring Electron
    if (this.animProgress < 0.95) {
      const p = this.animProgress;
      const ex = donorX + (acceptX - donorX) * p;
      const ey = cy - Math.sin(p * Math.PI) * 65; // Arced flight

      // Glowing trail
      this.ctx.beginPath();
      this.ctx.arc(ex, ey, 7, 0, Math.PI * 2);
      this.ctx.fillStyle = '#00f2fe';
      this.ctx.shadowColor = '#00f2fe';
      this.ctx.shadowBlur = 15;
      this.ctx.fill();
      this.ctx.shadowBlur = 0;

      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = 'bold 11px JetBrains Mono';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('e⁻', ex, ey - 12);
    }
  }

  // 2. POLAR COVALENT BOND VISUALIZATION
  renderPolarCovalentBond(w, h) {
    const cy = h / 2;
    const distance = 250 - this.animProgress * 70;
    const cx1 = w / 2 - distance / 2;
    const cx2 = w / 2 + distance / 2;

    const moreEn = this.atom1.en >= this.atom2.en ? this.atom1 : this.atom2;
    const moreX = this.atom1.en >= this.atom2.en ? cx1 : cx2;
    const lessX = this.atom1.en >= this.atom2.en ? cx2 : cx1;

    // Electron Cloud Distortion (Shifted toward more EN atom)
    const midX = (cx1 + cx2) / 2 + (moreX - lessX) * 0.18;
    
    // Draw shared electron cloud
    this.ctx.save();
    const grad = this.ctx.createRadialGradient(midX, cy, 5, midX, cy, 75);
    grad.addColorStop(0, 'rgba(0, 242, 254, 0.45)');
    grad.addColorStop(0.6, 'rgba(56, 189, 248, 0.2)');
    grad.addColorStop(1, 'rgba(56, 189, 248, 0)');

    this.ctx.beginPath();
    this.ctx.ellipse(midX, cy, 65, 38, 0, 0, Math.PI * 2);
    this.ctx.fillStyle = grad;
    this.ctx.fill();
    this.ctx.restore();

    // Two orbiting shared electrons in figure-8
    const t = this.time * 2;
    for (let i = 0; i < 2; i++) {
      const angle = t + i * Math.PI;
      const ex = midX + Math.sin(angle) * 32;
      const ey = cy + Math.sin(angle * 2) * 16;

      this.ctx.beginPath();
      this.ctx.arc(ex, ey, 4.5, 0, Math.PI * 2);
      this.ctx.fillStyle = '#ffffff';
      this.ctx.shadowColor = '#00f2fe';
      this.ctx.shadowBlur = 10;
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    }

    // Atom cores with delta charges (δ⁺ and δ⁻)
    const charge1 = this.atom1.en > this.atom2.en ? 'δ⁻' : 'δ⁺';
    const charge2 = this.atom2.en > this.atom1.en ? 'δ⁻' : 'δ⁺';
    this.drawAtomCore(cx1, cy, this.atom1, 42, charge1);
    this.drawAtomCore(cx2, cy, this.atom2, 42, charge2);
  }

  // 3. NONPOLAR COVALENT BOND VISUALIZATION
  renderNonpolarCovalentBond(w, h) {
    const cy = h / 2;
    const distance = 240 - this.animProgress * 75;
    const cx1 = w / 2 - distance / 2;
    const cx2 = w / 2 + distance / 2;
    const midX = w / 2;

    // Perfectly symmetrical electron cloud
    this.ctx.save();
    const grad = this.ctx.createRadialGradient(midX, cy, 5, midX, cy, 70);
    grad.addColorStop(0, 'rgba(16, 185, 129, 0.45)');
    grad.addColorStop(0.6, 'rgba(16, 185, 129, 0.18)');
    grad.addColorStop(1, 'transparent');

    this.ctx.beginPath();
    this.ctx.ellipse(midX, cy, 60, 36, 0, 0, Math.PI * 2);
    this.ctx.fillStyle = grad;
    this.ctx.fill();
    this.ctx.restore();

    // Symmetrical shared pairs
    const t = this.time * 2.2;
    for (let i = 0; i < 2; i++) {
      const angle = t + i * Math.PI;
      const ex = midX + Math.cos(angle) * 22;
      const ey = cy + Math.sin(angle) * 16;

      this.ctx.beginPath();
      this.ctx.arc(ex, ey, 4.5, 0, Math.PI * 2);
      this.ctx.fillStyle = '#ffffff';
      this.ctx.shadowColor = '#10b981';
      this.ctx.shadowBlur = 12;
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    }

    this.drawAtomCore(cx1, cy, this.atom1, 42, '');
    this.drawAtomCore(cx2, cy, this.atom2, 42, '');

    // Symmetrical label
    this.ctx.fillStyle = 'rgba(16, 185, 129, 0.9)';
    this.ctx.font = '13px Outfit';
    this.ctx.textAlign = 'center';
    this.ctx.fillText("Ідеально симетрична електронна хмара (Δχ = 0)", midX, Math.max(30, cy - 65));
  }

  // 4. METALLIC BOND VISUALIZATION (Lattice & electron sea)
  renderMetallicBond(w, h) {
    const rows = 2;
    const cols = 5;
    const startX = 140;
    const startY = 120;
    const stepX = (w - 280) / (cols - 1);
    const stepY = 140;

    // Free electron gas particles flowing freely
    this.ctx.fillStyle = 'rgba(245, 158, 11, 0.8)';
    this.ctx.shadowColor = '#f59e0b';
    this.ctx.shadowBlur = 8;
    this.metallicElectrons.forEach(el => {
      el.x += el.vx;
      el.y += el.vy;

      if (el.x < 100) el.x = w - 100;
      if (el.x > w - 100) el.x = 100;
      if (el.y < 80) el.y = h - 80;
      if (el.y > h - 80) el.y = 80;

      this.ctx.beginPath();
      this.ctx.arc(el.x, el.y, el.size, 0, Math.PI * 2);
      this.ctx.fill();
    });
    this.ctx.shadowBlur = 0;

    // Metal Cations in crystal lattice nodes
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const nx = startX + c * stepX;
        const ny = startY + r * stepY;

        // Lattice connecting line
        if (c < cols - 1) {
          this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
          this.ctx.beginPath();
          this.ctx.moveTo(nx, ny);
          this.ctx.lineTo(nx + stepX, ny);
          this.ctx.stroke();
        }
        if (r < rows - 1) {
          this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
          this.ctx.beginPath();
          this.ctx.moveTo(nx, ny);
          this.ctx.lineTo(nx, ny + stepY);
          this.ctx.stroke();
        }

        // Cation Node
        const grad = this.ctx.createRadialGradient(nx, ny, 2, nx, ny, 26);
        grad.addColorStop(0, '#fde68a');
        grad.addColorStop(0.7, '#f59e0b');
        grad.addColorStop(1, '#b45309');

        this.ctx.beginPath();
        this.ctx.arc(nx, ny, 24, 0, Math.PI * 2);
        this.ctx.fillStyle = grad;
        this.ctx.fill();

        this.ctx.fillStyle = '#1e1b4b';
        this.ctx.font = 'bold 12px Outfit';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(`${this.atom1.symbol}ⁿ⁺`, nx, ny);
      }
    }

    // Label
    this.ctx.fillStyle = '#f59e0b';
    this.ctx.font = 'bold 13px Outfit';
    this.ctx.textAlign = 'center';
    this.ctx.fillText("Кристалічна ґратка металу та рухливий 'електронний газ' e⁻", w / 2, 45);
  }

  // Core drawing helper
  drawAtomCore(x, y, atom, radius, charge) {
    const grad = this.ctx.createRadialGradient(x - 5, y - 5, 2, x, y, radius);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.3, '#38bdf8');
    grad.addColorStop(0.9, '#1e293b');
    grad.addColorStop(1, '#0f172a');

    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fillStyle = grad;
    this.ctx.shadowColor = 'rgba(0, 242, 254, 0.4)';
    this.ctx.shadowBlur = 18;
    this.ctx.fill();
    this.ctx.shadowBlur = 0;

    // Border
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    this.ctx.lineWidth = 1.5;
    this.ctx.stroke();

    // Symbol
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 20px Outfit';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(atom.symbol, x, y - 2);

    // Charge badge
    if (charge) {
      this.ctx.fillStyle = charge.includes('+') ? '#f43f5e' : '#00f2fe';
      this.ctx.font = 'bold 13px JetBrains Mono';
      this.ctx.fillText(charge, x + radius - 6, y - radius + 8);
    }
  }
}
