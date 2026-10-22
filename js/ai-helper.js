/**
 * ChemPulse — AI Chemistry Tutor "Chemikus" (Хемікус)
 * Intelligent chemical dialogue engine with natural language pattern matching.
 */

class ChemikusAI {
  constructor(messagesContainerId, inputId, formId) {
    this.container = document.getElementById(messagesContainerId);
    this.input = document.getElementById(inputId);
    this.form = document.getElementById(formId);

    this.initEvents();
  }

  initEvents() {
    if (this.form) {
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleUserSubmit();
      });
    }

    // Chip buttons
    document.querySelectorAll('.chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const query = btn.getAttribute('data-query');
        if (query) {
          this.sendQuery(query);
        }
      });
    });

    const clearBtn = document.getElementById('clear-chat-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.clearChat();
      });
    }
  }

  clearChat() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="message ai-message">
        <div class="msg-bubble">
          Чат очищено! Запитай мене будь-що з теми Періодичного закону та хімічного зв'язку 🧪
        </div>
        <span class="msg-time">Зараз</span>
      </div>
    `;
    if (window.soundManager) window.soundManager.playClick();
  }

  handleUserSubmit() {
    const text = this.input.value.trim();
    if (!text) return;
    this.input.value = '';
    this.sendQuery(text);
  }

  sendQuery(userText) {
    this.addMessage(userText, 'user');
    if (window.soundManager) window.soundManager.playClick();

    // Show typing placeholder
    const typingId = this.showTypingIndicator();

    setTimeout(() => {
      this.removeTypingIndicator(typingId);
      const reply = this.generateResponse(userText);
      this.addMessage(reply, 'ai');
      if (window.soundManager) window.soundManager.playBond();
    }, 600 + Math.random() * 400);
  }

  addMessage(text, sender) {
    if (!this.container) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}-message`;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    msgDiv.innerHTML = `
      <div class="msg-bubble">${text}</div>
      <span class="msg-time">${timeStr}</span>
    `;

    this.container.appendChild(msgDiv);
    this.container.scrollTop = this.container.scrollHeight;
  }

  showTypingIndicator() {
    const id = 'typing-' + Date.now();
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message ai-message';
    msgDiv.id = id;
    msgDiv.innerHTML = `
      <div class="msg-bubble" style="color: var(--cyan); font-style: italic;">
        Хемікус думає над відповіддю... ⚡
      </div>
    `;
    this.container.appendChild(msgDiv);
    this.container.scrollTop = this.container.scrollHeight;
    return id;
  }

  removeTypingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  generateResponse(query) {
    const q = query.toLowerCase();

    // 1. Water (H2O)
    if (q.includes('h2o') || q.includes('води') || q.includes('вода')) {
      return `У молекулі води <strong>H₂O</strong> тип зв'язку — <strong>ковалентний полярний</strong>.<br><br>
      • Електронегативність Гідрогену: 2.20, Оксигену: 3.44.<br>
      • Різниця Δχ = 1.24.<br>
      Оскільки Оксиген сильніше притягує спільні електронні пари, на ньому утворюється частковий негативний заряд (δ⁻), а на атомах Гідрогену — позитивний (δ⁺). Молекула кутова (104.5°) і є вираженим диполем!`;
    }

    // 2. Salt (NaCl)
    if (q.includes('nacl') || (q.includes('кухон') && q.includes('сіл')) || (q.includes('натрій') && q.includes('хлор'))) {
      return `У кухонній солі <strong>NaCl</strong> реалізується <strong>йонний зв'язок</strong>.<br><br>
      • Електронегативність Na = 0.93 (типовий метал), Cl = 3.16 (галоген).<br>
      • Різниця Δχ = 2.23 (це значно більше за поріг 1.7!).<br>
      Натрій повністю віддає свій єдиний 3s¹ електрон Хлору, утворюючи катіон <strong>Na⁺</strong> і аніон <strong>Cl⁻</strong>. Йони притягуються електростатичними силами Кулона в тривимірну кристалічну ґратку.`;
    }

    // 3. Ammonia (NH3)
    if (q.includes('nh3') || q.includes('аміак')) {
      return `У молекулі аміаку <strong>NH₃</strong> тип зв'язку — <strong>ковалентний полярний</strong>.<br><br>
      • Електронегативність N = 3.04, H = 2.20 (Δχ = 0.84).<br>
      • Атом Нітрогену утворює 3 спільні електронні пари з трьома атомами Гідрогену та має одну неподілену пару електронів. Форма молекули — тригональна піраміда.`;
    }

    // 4. Methane (CH4)
    if (q.includes('ch4') || q.includes('метан')) {
      return `У молекулі метану <strong>CH₄</strong> зв'язки C–H є <strong>ковалентними слабополярними</strong> (Δχ = 2.55 - 2.20 = 0.35).<br><br>
      Завдяки ідеальній симетричній формі тетраедра вектори дипольних моментів компенсують один одного, тому вся молекула метану в цілому є <strong>неполярною</strong>!`;
    }

    // 5. Oxygen / Nitrogen / Hydrogen gases (O2, N2, H2, Cl2)
    if (q.includes('o2') || q.includes('кисень') || q.includes('n2') || q.includes('h2') || q.includes('cl2')) {
      return `У простих речовинах неметалів (<strong>O₂, N₂, H₂, Cl₂</strong>) діє <strong>ковалентний неполярний зв'язок</strong>.<br><br>
      Оскільки сполучаються однакові атоми, їхні електронегативності рівні (Δχ = 0). Спільні електронні хмари розташовані точно посередині між ядрами. У O₂ зв'язок подвійний (O=O), а в N₂ — надзвичайно міцний потрійний (N≡N).`;
    }

    // 6. Metals / Iron / Copper
    if (q.includes('fe') || q.includes('заліз') || q.includes('купрум') || q.includes('мід') || q.includes('метал')) {
      return `У простих речовинах-металах існує <strong>металічний зв'язок</strong>.<br><br>
      Атоми металів легко віддають валентні електрони, які стають спільними для всього кристалу — це так званий <strong>'електронний газ'</strong>. Завдяки вільному руху цих електронів метали мають блиск, пластичність і чудово проводять електричний струм і тепло!`;
    }

    // 7. Why Fluorine is most electronegative
    if (q.includes('флуор') || q.includes('найбільш') || q.includes('fluorine')) {
      return `<strong>Флуор (F)</strong> — найсильніший неметал та чемпіон за електронегативністю (<strong>χ = 3.98</strong>)! 🥇<br><br>
      <strong>Чому саме він?</strong><br>
      1. Має лише 2 енергетичні рівні (надзвичайно малий атомний радіус — 42 пм).<br>
      2. Ядро із зарядом +9 розташоване дуже близько до зовнішньої оболонки.<br>
      3. Йому бракує всього <strong>1 електрона</strong> до заповітного стійкого октету Неону (2s² 2p⁵ ➔ 2s² 2p⁶). Тому він жадібно відбирає електрони у будь-якого іншого атома!`;
    }

    // 8. Octet rule
    if (q.includes('октет') || q.includes('правило октету') || q.includes('octet')) {
      return `<strong>Правило октету</strong> — це фундаментальний хімічний принцип, згідно з яким атоми прагнуть мати <strong>8 електронів</strong> на зовнішньому енергетичному рівні (як у благородних газів).<br><br>
      Щоб досягти цієї максимальної стабільності:<br>
      • Метали <em>віддають</em> зайві валентні електрони;<br>
      • Неметали <em>приєднують</em> відсутні електрони або об'єднують їх у <em>спільні пари</em>.<br>
      <em>Виняток:</em> Гідроген і Гелій прагнуть до завершеного дублету (2 електрони, 1s²).`;
    }

    // 9. Periodic Trends (Radius, Electronegativity)
    if (q.includes('радіус') || q.includes('період') || q.includes('група') || q.includes('тренд') || q.includes('закономірност')) {
      return `Ось головні закони зміни властивостей у Періодичній системі:<br><br>
      📈 <strong>У періодах (зліва направо):</strong><br>
      • Заряд ядра зростає (+1, +2...);<br>
      • Кількість шарів однакова ➔ електрони сильніше притягуються до ядра ➔ <strong>атомний радіус зменшується</strong>;<br>
      • <strong>Електронегативність та неметалічні властивості зростають</strong>.<br><br>
      📉 <strong>У головних підгрупах (зверху вниз):</strong><br>
      • Додаються нові енергетичні шари ➔ <strong>радіус атома збільшується</strong>;<br>
      • Зовнішні електрони слабше тримаються ➔ <strong>металічні властивості зростають</strong>, а електронегативність спадає.`;
    }

    // 10. Differences between Ionic and Covalent
    if (q.includes('йонн') && q.includes('ковалент')) {
      return `<strong>Головна відмінність між йонним та ковалентним зв'язком:</strong><br><br>
      1. <strong>Йонний (Δχ > 1.7):</strong> Електрон <em>повністю переходить</em> від металу до неметалу. Утворюються автономні йони (+ та -). Приклад: NaCl, CaO.<br>
      2. <strong>Ковалентний полярний (0.4 < Δχ ≤ 1.7):</strong> Електрони <em>не переходять повністю</em>, а усуспільнюються, але пара зміщена до сильнішого. Приклад: H₂O, HCl.<br>
      3. <strong>Ковалентний неполярний (Δχ ≤ 0.4):</strong> Спільні пари розташовані <em>симетрично</em>. Приклад: O₂, N₂, Cl₂.`;
    }

    // 11. Generic chemical help
    return `Цікаве запитання! З точки зору хімії будова атома та положення елемента в Періодичній системі безпосередньо визначають тип утвореного хімічного зв'язку.<br><br>
    💡 <strong>Підказка для аналізу:</strong><br>
    1. Знайди елементи в Періодичній системі в Модулі 1.<br>
    2. Поглянь на їх електронегативності (χ): якщо зв'язок між металом і неметалом і різниця Δχ > 1.7 — зв'язок <strong>йонний</strong>. Між різними неметалами — <strong>ковалентний полярний</strong>, а між однаковими — <strong>неполярний</strong>.<br><br>
    Спробуй також протестувати цю пару в нашому <strong>Конструкторі зв'язку (Модуль 2)</strong>!`;
  }
}
