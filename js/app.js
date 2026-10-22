/**
 * ChemPulse — Main Application Controller
 * Wires together UI components, periodic grid, bond simulator, AI helper, and modals.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Safe DOM References
  const periodicGrid = document.getElementById('periodic-table-grid');
  const modal = document.getElementById('element-modal');
  const closeInspectorBtn = document.getElementById('close-inspector-btn');
  const inspectorBackdrop = document.getElementById('inspector-backdrop');
  const sendToBondBtn = document.getElementById('send-to-bond-btn');
  const trendBanner = document.getElementById('trend-banner');
  const trendBannerText = document.getElementById('trend-banner-text');
  const trendButtons = document.querySelectorAll('.trend-btn');
  const searchInput = document.getElementById('element-search');
  const categoryFilter = document.getElementById('category-filter');
  const select1 = document.getElementById('atom1-select');
  const select2 = document.getElementById('atom2-select');
  const animateBondBtn = document.getElementById('animate-bond-btn');
  const presetBtns = document.querySelectorAll('.preset-btn');

  let currentInspectedElement = ELEMENTS_DATA[0]; // Default: Hydrogen
  let currentTrend = 'none';

  // 2. Initialize Visualizers & Engines
  const heroVisualizer = new HeroAtomVisualizer('hero-atom-canvas');
  const bohrVisualizer = new BohrVisualizer('bohr-canvas');
  const bondSimulator = new BondSimulator('bond-canvas');
  const chemikusAI = new ChemikusAI('chat-messages', 'chat-input', 'chat-form');
  const chemQuiz = new ChemQuiz();

  // 3. Helper: Category Translation
  function getCategoryNameUk(cat) {
    const dict = {
      'alkali': 'Лужний метал',
      'alkaline-earth': 'Лужноземельний метал',
      'transition': 'Перехідний метал',
      'post-transition': 'Постперехідний метал',
      'metalloid': 'Напівметал',
      'nonmetal': 'Реактивний неметал',
      'halogen': 'Галоген',
      'noble': 'Благородний (інертний) газ'
    };
    return dict[cat] || cat;
  }

  // 4. Render Periodic Table Grid
  function renderPeriodicTable(elements) {
    if (!periodicGrid) return;
    periodicGrid.innerHTML = '';

    elements.forEach(el => {
      const card = document.createElement('div');
      card.className = `element-card cat-${el.category}`;
      card.dataset.number = el.number;
      card.dataset.symbol = el.symbol;
      card.dataset.category = el.category;
      card.dataset.en = el.en;
      card.dataset.radius = el.radius;
      card.dataset.valence = el.valence;

      // Periodic Grid Coordinates placement
      card.style.gridColumn = el.group;
      card.style.gridRow = el.period;

      card.innerHTML = `
        <div class="el-top">
          <span class="el-num">${el.number}</span>
          <span class="el-en">${el.en > 0 ? el.en.toFixed(1) : ''}</span>
        </div>
        <div class="el-symbol">${el.symbol}</div>
        <div class="el-name">${el.name}</div>
      `;

      card.addEventListener('click', () => {
        openElementInspector(el);
        if (window.soundManager) window.soundManager.playClick();
      });

      periodicGrid.appendChild(card);
    });

    applyTrendVisualization(currentTrend);
  }

  // 5. Element Inspector Modal
  function openElementInspector(el) {
    currentInspectedElement = el;

    const atomicNumEl = document.getElementById('info-atomic-number');
    const symbolEl = document.getElementById('info-symbol');
    const nameEl = document.getElementById('info-name');
    const catEl = document.getElementById('info-category');
    const massEl = document.getElementById('info-mass');
    const enEl = document.getElementById('info-en');
    const pgEl = document.getElementById('info-period-group');
    const valenceEl = document.getElementById('info-valence');
    const configEl = document.getElementById('info-config');
    const oxidationEl = document.getElementById('info-oxidation');
    const factEl = document.getElementById('info-fact');
    const bohrTitleEl = document.getElementById('bohr-element-title');
    const shellsEl = document.getElementById('shells-summary');

    if (atomicNumEl) atomicNumEl.textContent = el.number;
    if (symbolEl) symbolEl.textContent = el.symbol;
    if (nameEl) nameEl.textContent = el.name;
    if (catEl) catEl.textContent = getCategoryNameUk(el.category);
    if (massEl) massEl.textContent = el.mass;
    if (enEl) enEl.textContent = el.en > 0 ? el.en.toFixed(2) : 'Не визначено (інертний)';
    if (pgEl) pgEl.textContent = `Період ${el.period}, Група ${el.group}`;
    if (valenceEl) valenceEl.textContent = `${el.valence} e⁻`;
    if (configEl) configEl.textContent = el.config;
    if (oxidationEl) oxidationEl.textContent = el.oxidation;
    if (factEl) factEl.textContent = el.fact;
    if (bohrTitleEl) bohrTitleEl.textContent = `${el.symbol} — ${el.name}`;

    // Shells breakdown (K, L, M, N...)
    const shellNames = ['K', 'L', 'M', 'N', 'O', 'P'];
    const shellsText = el.shells.map((count, i) => `${shellNames[i]}: ${count}`).join(' • ');
    if (shellsEl) shellsEl.innerHTML = `Електронні шари: <span>${shellsText}</span>`;

    // Start Bohr model rendering
    bohrVisualizer.setElement(el);

    if (modal) {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
    }
  }

  function closeInspector() {
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    }
    bohrVisualizer.stop();
  }

  if (closeInspectorBtn) closeInspectorBtn.addEventListener('click', closeInspector);
  if (inspectorBackdrop) inspectorBackdrop.addEventListener('click', closeInspector);

  // Send element from inspector directly to bond constructor
  if (sendToBondBtn) {
    sendToBondBtn.addEventListener('click', () => {
      closeInspector();
      if (select1) {
        select1.value = currentInspectedElement.symbol;
        updateBondFromSelects();
      }
      const bondSec = document.getElementById('bonds-section');
      if (bondSec) {
        bondSec.scrollIntoView({ behavior: 'smooth' });
      }
      if (window.soundManager) window.soundManager.playBond();
    });
  }

  // 6. Trend Visualizer Toggles
  trendButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      trendButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTrend = btn.getAttribute('data-trend');
      applyTrendVisualization(currentTrend);
      if (window.soundManager) window.soundManager.playClick();
    });
  });

  function applyTrendVisualization(trend) {
    const cards = document.querySelectorAll('.element-card');

    if (trend === 'none') {
      if (trendBanner) trendBanner.style.display = 'none';
      cards.forEach(card => {
        card.style.background = '';
        card.style.borderColor = '';
        const enEl = card.querySelector('.el-en');
        if (enEl) enEl.style.color = '';
      });
      return;
    }

    if (trendBanner) trendBanner.style.display = 'flex';

    if (trend === 'electronegativity') {
      if (trendBannerText) {
        trendBannerText.innerHTML = `<strong>📈 Електронегативність (χ):</strong> Зростає зліва направо у періодах та знизу вгору у головних підгрупах. Найвища у Флуору (<strong>3.98</strong>), найнижча у важких лужних металів (Францій <strong>0.7</strong>, Цезій <strong>0.79</strong>). Інертні гази мають нульову або невизначену електронегативність.`;
      }

      cards.forEach(card => {
        const en = parseFloat(card.dataset.en) || 0;
        if (en === 0) {
          card.style.background = 'rgba(255, 255, 255, 0.02)';
        } else {
          const pct = Math.min(1, Math.max(0, (en - 0.7) / (3.98 - 0.7)));
          const r = Math.round(244 * pct);
          const g = Math.round(63 + 150 * (1 - pct));
          const b = Math.round(94 + 160 * (1 - pct));
          card.style.background = `rgba(${r}, ${g}, ${b}, 0.28)`;
          card.style.borderColor = `rgba(${r}, ${g}, ${b}, 0.7)`;
        }
      });
    } else if (trend === 'radius') {
      if (trendBannerText) {
        trendBannerText.innerHTML = `<strong>🌐 Атомний радіус (pm):</strong> Збільшується зверху вниз по групах (зростає число електронних шарів) та справа наліво по періодах (зменшується заряд ядра, що слабше стягує електрони). Найбільші радіуси мають лужні метали (Калій, Цезій), а найменші — Неон, Гелій та Флуор.`;
      }

      cards.forEach(card => {
        const rad = parseFloat(card.dataset.radius) || 50;
        const pct = Math.min(1, Math.max(0, (rad - 30) / (250 - 30)));
        card.style.background = `rgba(59, 130, 246, ${0.1 + pct * 0.4})`;
        card.style.borderColor = `rgba(59, 130, 246, ${0.3 + pct * 0.5})`;
      });
    } else if (trend === 'valence') {
      if (trendBannerText) {
        trendBannerText.innerHTML = `<strong>⚡ Валентні електрони:</strong> Кількість електронів на зовнішньому енергетичному рівні для елементів головних підгруп дорівнює <strong>номеру групи</strong> (від 1 e⁻ у лужних металів до 8 e⁻ у благородних газів). Саме вони беруть участь в утворенні хімічних зв'язків!`;
      }

      cards.forEach(card => {
        const val = parseInt(card.dataset.valence, 10) || 0;
        const pct = val / 8;
        card.style.background = `rgba(16, 185, 129, ${0.1 + pct * 0.4})`;
        card.style.borderColor = `rgba(16, 185, 129, ${0.3 + pct * 0.5})`;
      });
    }
  }

  // 7. Search & Category Filter
  function filterElements() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const category = categoryFilter ? categoryFilter.value : 'all';

    const cards = document.querySelectorAll('.element-card');
    cards.forEach(card => {
      const num = card.dataset.number;
      const sym = card.dataset.symbol.toLowerCase();
      const elData = ELEMENTS_DATA.find(e => e.number == num);
      const name = elData ? elData.name.toLowerCase() : '';
      const cat = card.dataset.category;

      const matchesSearch = !query || sym.includes(query) || name.includes(query) || num === query;
      const matchesCategory = category === 'all' || cat === category;

      if (matchesSearch && matchesCategory) {
        card.classList.remove('dimmed');
        if (category !== 'all' || query) {
          card.classList.add('highlighted');
        } else {
          card.classList.remove('highlighted');
        }
      } else {
        card.classList.add('dimmed');
        card.classList.remove('highlighted');
      }
    });
  }

  if (searchInput) searchInput.addEventListener('input', filterElements);
  if (categoryFilter) categoryFilter.addEventListener('change', () => {
    filterElements();
    if (window.soundManager) window.soundManager.playClick();
  });

  // 8. Bond Simulator Dropdowns & Presets
  function populateBondDropdowns() {
    if (!select1 || !select2) return;
    select1.innerHTML = '';
    select2.innerHTML = '';

    ELEMENTS_DATA.forEach(el => {
      const opt1 = document.createElement('option');
      opt1.value = el.symbol;
      opt1.textContent = `${el.symbol} — ${el.name} (χ=${el.en > 0 ? el.en.toFixed(1) : '—'})`;
      select1.appendChild(opt1);

      const opt2 = document.createElement('option');
      opt2.value = el.symbol;
      opt2.textContent = `${el.symbol} — ${el.name} (χ=${el.en > 0 ? el.en.toFixed(1) : '—'})`;
      select2.appendChild(opt2);
    });

    // Defaults: Na & Cl
    select1.value = 'Na';
    select2.value = 'Cl';
    updateBondFromSelects();
  }

  function updateBondFromSelects() {
    if (!select1 || !select2) return;
    const sym1 = select1.value;
    const sym2 = select2.value;
    const el1 = ELEMENTS_DATA.find(e => e.symbol === sym1);
    const el2 = ELEMENTS_DATA.find(e => e.symbol === sym2);

    if (!el1 || !el2) return;

    // Update pod preview badges
    const b1 = document.getElementById('atom1-badge');
    const b2 = document.getElementById('atom2-badge');
    const en1 = document.getElementById('atom1-en-val');
    const en2 = document.getElementById('atom2-en-val');
    const t1 = document.getElementById('atom1-type-label');
    const t2 = document.getElementById('atom2-type-label');

    if (b1) b1.textContent = el1.symbol;
    if (b2) b2.textContent = el2.symbol;
    if (en1) en1.textContent = el1.en > 0 ? el1.en.toFixed(2) : '—';
    if (en2) en2.textContent = el2.en > 0 ? el2.en.toFixed(2) : '—';

    const isMetal1 = ["alkali", "alkaline-earth", "transition", "post-transition"].includes(el1.category);
    const isMetal2 = ["alkali", "alkaline-earth", "transition", "post-transition"].includes(el2.category);

    if (t1) {
      t1.textContent = isMetal1 ? 'Метал' : 'Неметал';
      t1.className = `type-pill ${isMetal1 ? 'metal' : 'nonmetal'}`;
    }
    if (t2) {
      t2.textContent = isMetal2 ? 'Метал' : 'Неметал';
      t2.className = `type-pill ${isMetal2 ? 'metal' : 'nonmetal'}`;
    }

    // Check if preset matches
    const presetKey = Object.keys(BOND_PRESETS).find(key => {
      const p = BOND_PRESETS[key];
      return (p.atom1 === el1.symbol && p.atom2 === el2.symbol) ||
             (p.atom1 === el2.symbol && p.atom2 === el1.symbol);
    });

    if (presetKey) {
      bondSimulator.setBond(el1, el2, BOND_PRESETS[presetKey]);
      presetBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.preset === presetKey);
      });
    } else {
      bondSimulator.setBond(el1, el2);
      presetBtns.forEach(btn => btn.classList.remove('active'));
    }
  }

  if (select1) select1.addEventListener('change', () => {
    updateBondFromSelects();
    if (window.soundManager) window.soundManager.playClick();
  });

  if (select2) select2.addEventListener('change', () => {
    updateBondFromSelects();
    if (window.soundManager) window.soundManager.playClick();
  });

  if (animateBondBtn) {
    animateBondBtn.addEventListener('click', () => {
      bondSimulator.triggerSynthesis();
    });
  }

  // Presets
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-preset');
      const preset = BOND_PRESETS[key];
      if (!preset) return;

      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const el1 = ELEMENTS_DATA.find(e => e.symbol === preset.atom1);
      const el2 = ELEMENTS_DATA.find(e => e.symbol === preset.atom2);

      if (select1 && select2 && el1 && el2) {
        select1.value = el1.symbol;
        select2.value = el2.symbol;
        updateBondFromSelects();
      }
    });
  });

  // 9. Smooth Section Scrolling Highlight
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const navLink = document.querySelector(`.nav-link[data-target="${id}"]`);

      if (scrollY >= top && scrollY < top + height) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        if (navLink) navLink.classList.add('active');
      }
    });
  });

  // 10. Initial Render
  renderPeriodicTable(ELEMENTS_DATA);
  populateBondDropdowns();
});
