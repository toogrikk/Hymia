/**
 * ChemPulse — Main Application Controller
 * Optimized for Topic: "Хімічний зв'язок" (11 клас)
 * Coordinates Hero canvas, Bond Simulator Arena, Periodic Table & Bohr Model, and Quiz.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. DOM References
  const periodicGrid = document.getElementById('periodic-table-grid');
  const modal = document.getElementById('element-modal');
  const closeInspectorBtn = document.getElementById('close-inspector-btn');
  const closeInspectorActionBtn = document.getElementById('close-inspector-action-btn');
  const inspectorBackdrop = document.getElementById('inspector-backdrop');
  const useInBondBtn = document.getElementById('use-in-bond-btn');

  const trendBanner = document.getElementById('trend-banner');
  const trendBannerText = document.getElementById('trend-banner-text');
  const trendButtons = document.querySelectorAll('.trend-btn');
  const searchInput = document.getElementById('element-search');
  const categoryFilter = document.getElementById('category-filter');

  // Bond Simulator DOM Elements
  const select1 = document.getElementById('atom1-select');
  const select2 = document.getElementById('atom2-select');
  const badge1 = document.getElementById('atom1-badge');
  const badge2 = document.getElementById('atom2-badge');
  const enVal1 = document.getElementById('atom1-en-val');
  const enVal2 = document.getElementById('atom2-en-val');
  const typeLabel1 = document.getElementById('atom1-type-label');
  const typeLabel2 = document.getElementById('atom2-type-label');
  const animateBondBtn = document.getElementById('animate-bond-btn');
  const presetBtns = document.querySelectorAll('.preset-btn');

  let currentTrend = 'none';
  let currentlyInspectedElement = null;

  // 2. Initialize Visualizers & Engines
  const heroVisualizer = typeof HeroAtomVisualizer !== 'undefined' ? new HeroAtomVisualizer('hero-atom-canvas') : null;
  const bohrVisualizer = typeof BohrVisualizer !== 'undefined' ? new BohrVisualizer('bohr-canvas') : null;
  const bondSimulator = typeof BondSimulator !== 'undefined' ? new BondSimulator('bond-canvas') : null;
  const chemQuiz = typeof ChemQuiz !== 'undefined' ? new ChemQuiz() : null;

  // 3. Category Translation Helper
  function getCategoryNameUk(cat) {
    const dict = {
      'alkali': 'Лужний метал',
      'alkaline-earth': 'Лужноземельний метал',
      'transition': 'Перехідний метал',
      'post-transition': 'Постперехідний метал',
      'metalloid': 'Напівметал',
      'nonmetal': 'Реактивний неметал',
      'halogen': 'Галоген (неметал)',
      'noble': 'Благородний (інертний) газ'
    };
    return dict[cat] || cat;
  }

  function isMetalCategory(cat) {
    return ['alkali', 'alkaline-earth', 'transition', 'post-transition'].includes(cat);
  }

  // 4. Bond Simulator Initialization & Logic
  function initBondSimulator() {
    if (!select1 || !select2 || typeof ELEMENTS_DATA === 'undefined') return;

    select1.innerHTML = '';
    select2.innerHTML = '';

    ELEMENTS_DATA.forEach(el => {
      const opt1 = document.createElement('option');
      opt1.value = el.symbol;
      opt1.textContent = `${el.number}. ${el.symbol} — ${el.name} (χ = ${el.en > 0 ? el.en.toFixed(2) : '—'})`;
      select1.appendChild(opt1);

      const opt2 = document.createElement('option');
      opt2.value = el.symbol;
      opt2.textContent = `${el.number}. ${el.symbol} — ${el.name} (χ = ${el.en > 0 ? el.en.toFixed(2) : '—'})`;
      select2.appendChild(opt2);
    });

    // Default selection: Na + Cl (NaCl)
    select1.value = 'Na';
    select2.value = 'Cl';
    updateBondFromSelects('nacl');

    // Change listeners
    select1.addEventListener('change', () => {
      updateBondFromSelects();
      if (window.soundManager) window.soundManager.playClick();
    });

    select2.addEventListener('change', () => {
      updateBondFromSelects();
      if (window.soundManager) window.soundManager.playClick();
    });

    // Animate Synthesis button
    if (animateBondBtn && bondSimulator) {
      animateBondBtn.addEventListener('click', () => {
        bondSimulator.triggerSynthesis();
        if (window.soundManager) window.soundManager.playBond();
      });
    }

    // Presets buttons
    presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const presetKey = btn.getAttribute('data-preset');
        if (typeof BOND_PRESETS === 'undefined' || !BOND_PRESETS[presetKey]) return;

        presetBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const preset = BOND_PRESETS[presetKey];
        select1.value = preset.atom1;
        select2.value = preset.atom2;

        updateBondFromSelects(presetKey);
        if (window.soundManager) window.soundManager.playClick();
      });
    });
  }

  function updateBondFromSelects(forcedPresetKey = null) {
    if (!select1 || !select2 || typeof ELEMENTS_DATA === 'undefined') return;

    const sym1 = select1.value;
    const sym2 = select2.value;

    const el1 = ELEMENTS_DATA.find(e => e.symbol === sym1);
    const el2 = ELEMENTS_DATA.find(e => e.symbol === sym2);
    if (!el1 || !el2) return;

    // Update atom 1 badges
    if (badge1) badge1.textContent = el1.symbol;
    if (enVal1) enVal1.textContent = el1.en > 0 ? el1.en.toFixed(2) : '—';
    if (typeLabel1) {
      const isM1 = isMetalCategory(el1.category);
      typeLabel1.textContent = el1.category === 'noble' ? 'Інертний' : (isM1 ? 'Метал' : 'Неметал');
      typeLabel1.className = `type-pill ${isM1 ? 'metal' : (el1.category === 'noble' ? 'noble' : 'nonmetal')}`;
    }

    // Update atom 2 badges
    if (badge2) badge2.textContent = el2.symbol;
    if (enVal2) enVal2.textContent = el2.en > 0 ? el2.en.toFixed(2) : '—';
    if (typeLabel2) {
      const isM2 = isMetalCategory(el2.category);
      typeLabel2.textContent = el2.category === 'noble' ? 'Інертний' : (isM2 ? 'Метал' : 'Неметал');
      typeLabel2.className = `type-pill ${isM2 ? 'metal' : (el2.category === 'noble' ? 'noble' : 'nonmetal')}`;
    }

    // Determine preset or dynamic calculation
    let preset = null;
    if (forcedPresetKey && typeof BOND_PRESETS !== 'undefined') {
      preset = BOND_PRESETS[forcedPresetKey];
    } else if (typeof BOND_PRESETS !== 'undefined') {
      const foundKey = Object.keys(BOND_PRESETS).find(key => {
        const p = BOND_PRESETS[key];
        return (p.atom1 === el1.symbol && p.atom2 === el2.symbol) ||
               (p.atom1 === el2.symbol && p.atom2 === el1.symbol);
      });
      if (foundKey) {
        preset = BOND_PRESETS[foundKey];
        presetBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-preset') === foundKey));
      } else {
        presetBtns.forEach(b => b.classList.remove('active'));
      }
    }

    if (bondSimulator) {
      bondSimulator.setBond(el1, el2, preset);
    }
  }

  // 5. Render Periodic Table Grid
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

      // Periodic Coordinates
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

  // 6. Element Inspector Modal
  function openElementInspector(el) {
    currentlyInspectedElement = el;

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

    // Shells breakdown
    const shellNames = ['K', 'L', 'M', 'N', 'O', 'P'];
    const shellsText = el.shells.map((count, i) => `${shellNames[i]}: ${count}`).join(' • ');
    if (shellsEl) shellsEl.innerHTML = `Електронні шари: <span>${shellsText}</span>`;

    // Start Bohr model rendering
    if (bohrVisualizer) {
      bohrVisualizer.setElement(el);
    }

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
    if (bohrVisualizer) {
      bohrVisualizer.stop();
    }
  }

  if (closeInspectorBtn) closeInspectorBtn.addEventListener('click', closeInspector);
  if (closeInspectorActionBtn) closeInspectorActionBtn.addEventListener('click', closeInspector);
  if (inspectorBackdrop) inspectorBackdrop.addEventListener('click', closeInspector);

  // Use in Bond Simulator button inside Modal
  if (useInBondBtn) {
    useInBondBtn.addEventListener('click', () => {
      if (!currentlyInspectedElement || !select1 || !select2) return;

      closeInspector();

      // Set atom 1 to inspected element
      select1.value = currentlyInspectedElement.symbol;

      // Smart complementary atom for atom 2
      if (select1.value === select2.value && currentlyInspectedElement.symbol !== 'O') {
        const isM = isMetalCategory(currentlyInspectedElement.category);
        select2.value = isM ? 'Cl' : 'Na';
      }

      updateBondFromSelects();

      // Smooth scroll to bonds section
      const bondsSection = document.getElementById('bonds-section');
      if (bondsSection) {
        bondsSection.scrollIntoView({ behavior: 'smooth' });
      }

      if (window.soundManager) window.soundManager.playSuccess();
    });
  }

  // 7. Trend Visualizer Toggles
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
        trendBannerText.innerHTML = `<strong>📈 Електронегативність (χ):</strong> Зростає зліва направо у періодах та знизу вгору у головних підгрупах. Найвища у Флуору (<strong>3.98</strong>), найнижча у Францію (<strong>0.7</strong>). Різниця електронегативностей (Δχ) між елементами безпосередньо визначає тип зв'язку: при Δχ > 1.7 виникає йонний зв'язок, при 0.4 < Δχ ≤ 1.7 — ковалентний полярний, а при Δχ ≤ 0.4 — ковалентний неполярний.`;
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
    } else if (trend === 'valence') {
      if (trendBannerText) {
        trendBannerText.innerHTML = `<strong>⚡ Валентні електрони (Правило октету):</strong> Кількість електронів на зовнішньому енергетичному рівні дорівнює номеру групи головних підгруп. Атоми прагнуть завершити свій рівень до 8 електронів (або 2 для H), утворюючи спільні електронні пари або віддаючи/приєднуючи електрони.`;
      }

      cards.forEach(card => {
        const val = parseInt(card.dataset.valence, 10) || 0;
        const pct = val / 8;
        card.style.background = `rgba(16, 185, 129, ${0.1 + pct * 0.4})`;
        card.style.borderColor = `rgba(16, 185, 129, ${0.3 + pct * 0.5})`;
      });
    } else if (trend === 'radius') {
      if (trendBannerText) {
        trendBannerText.innerHTML = `<strong>🌐 Атомний радіус (pm):</strong> Збільшується зверху вниз по групах (зростає число електронних шарів) та справа наліво по періодах (зменшується заряд ядра). Чим менший радіус неметалу, тим сильніше він притягує чужі електрони (вища ЕН).`;
      }

      cards.forEach(card => {
        const rad = parseFloat(card.dataset.radius) || 50;
        const pct = Math.min(1, Math.max(0, (rad - 30) / (250 - 30)));
        card.style.background = `rgba(59, 130, 246, ${0.1 + pct * 0.4})`;
        card.style.borderColor = `rgba(59, 130, 246, ${0.3 + pct * 0.5})`;
      });
    }
  }

  // 8. Search & Category Filter
  function filterElements() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const category = categoryFilter ? categoryFilter.value : 'all';

    const cards = document.querySelectorAll('.element-card');
    cards.forEach(card => {
      const num = card.dataset.number;
      const sym = card.dataset.symbol.toLowerCase();
      const elData = typeof ELEMENTS_DATA !== 'undefined' ? ELEMENTS_DATA.find(e => e.number == num) : null;
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

  // 10. Initial Runs
  if (typeof ELEMENTS_DATA !== 'undefined') {
    renderPeriodicTable(ELEMENTS_DATA);
  }
  initBondSimulator();
});
