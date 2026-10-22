/**
 * ChemPulse — Interactive Chemistry Quiz & Quest
 * Tracks scores, gives instant pedagogical explanations, and triggers confetti celebration.
 */

class ChemQuiz {
  constructor() {
    this.questions = QUIZ_QUESTIONS;
    this.currentIndex = 0;
    this.score = 0;
    this.hasAnswered = false;

    // DOM Elements
    this.startView = document.getElementById('quiz-start-view');
    this.activeView = document.getElementById('quiz-active-view');
    this.finishView = document.getElementById('quiz-finish-view');

    this.startBtn = document.getElementById('start-quiz-btn');
    this.nextBtn = document.getElementById('next-q-btn');
    this.restartBtn = document.getElementById('restart-quiz-btn');

    this.qNumSpan = document.getElementById('current-q-num');
    this.totalNumSpan = document.getElementById('total-q-num');
    this.liveScoreSpan = document.getElementById('live-score');
    this.progressFill = document.getElementById('quiz-progress-fill');

    this.questionText = document.getElementById('quiz-question-text');
    this.optionsList = document.getElementById('quiz-options-list');
    this.explanationBox = document.getElementById('quiz-explanation-box');
    this.expText = document.getElementById('exp-text');

    this.finalScore = document.getElementById('final-score');
    this.finalPercent = document.getElementById('final-percent');
    this.rankName = document.getElementById('rank-name');

    this.initEvents();
  }

  initEvents() {
    if (this.startBtn) {
      this.startBtn.addEventListener('click', () => this.start());
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.nextQuestion());
    }
    if (this.restartBtn) {
      this.restartBtn.addEventListener('click', () => this.start());
    }
  }

  start() {
    this.currentIndex = 0;
    this.score = 0;
    this.hasAnswered = false;

    if (this.startView) this.startView.classList.add('hidden');
    if (this.finishView) this.finishView.classList.add('hidden');
    if (this.activeView) this.activeView.classList.remove('hidden');

    if (this.totalNumSpan) this.totalNumSpan.textContent = this.questions.length;
    if (this.liveScoreSpan) this.liveScoreSpan.textContent = '0';

    if (window.soundManager) window.soundManager.playClick();
    this.renderCurrentQuestion();
  }

  renderCurrentQuestion() {
    this.hasAnswered = false;
    const q = this.questions[this.currentIndex];
    if (!q) return;

    if (this.qNumSpan) this.qNumSpan.textContent = this.currentIndex + 1;
    if (this.questionText) this.questionText.textContent = q.question;

    const progressPct = ((this.currentIndex + 1) / this.questions.length) * 100;
    if (this.progressFill) this.progressFill.style.width = `${progressPct}%`;

    if (this.explanationBox) this.explanationBox.classList.add('hidden');
    if (this.nextBtn) this.nextBtn.classList.add('hidden');

    // Render options
    if (this.optionsList) {
      this.optionsList.innerHTML = '';
      const letters = ['A', 'B', 'C', 'D'];

      q.options.forEach((optText, idx) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option-btn';
        btn.innerHTML = `
          <span class="option-letter">${letters[idx]}</span>
          <span class="option-text">${optText}</span>
        `;

        btn.addEventListener('click', () => this.handleOptionClick(idx, btn));
        this.optionsList.appendChild(btn);
      });
    }
  }

  handleOptionClick(selectedIdx, clickedBtn) {
    if (this.hasAnswered) return;
    this.hasAnswered = true;

    const q = this.questions[this.currentIndex];
    const isCorrect = selectedIdx === q.correctIndex;

    const allButtons = this.optionsList.querySelectorAll('.quiz-option-btn');
    allButtons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === q.correctIndex) {
        btn.classList.add('correct');
      } else if (idx === selectedIdx && !isCorrect) {
        btn.classList.add('wrong');
      }
    });

    if (isCorrect) {
      this.score++;
      if (this.liveScoreSpan) this.liveScoreSpan.textContent = this.score;
      if (window.soundManager) window.soundManager.playSuccess();
    } else {
      if (window.soundManager) window.soundManager.playWrong();
    }

    // Show pedagogical explanation
    if (this.explanationBox && this.expText) {
      this.expText.innerHTML = `<strong>${isCorrect ? 'Правильно! 🎉' : 'Зверни увагу: 🧐'}</strong> ${q.explanation}`;
      this.explanationBox.classList.remove('hidden');
    }

    if (this.nextBtn) {
      this.nextBtn.classList.remove('hidden');
      if (this.currentIndex === this.questions.length - 1) {
        this.nextBtn.querySelector('span').textContent = 'Побачити результати 🏆';
      } else {
        this.nextBtn.querySelector('span').textContent = 'Наступне питання ➜';
      }
    }
  }

  nextQuestion() {
    if (window.soundManager) window.soundManager.playClick();
    this.currentIndex++;

    if (this.currentIndex < this.questions.length) {
      this.renderCurrentQuestion();
    } else {
      this.showFinishView();
    }
  }

  showFinishView() {
    if (this.activeView) this.activeView.classList.add('hidden');
    if (this.finishView) this.finishView.classList.remove('hidden');

    const total = this.questions.length;
    const pct = Math.round((this.score / total) * 100);

    if (this.finalScore) this.finalScore.textContent = `${this.score}/${total}`;
    if (this.finalPercent) this.finalPercent.textContent = `${pct}%`;

    let rank = "Початківець у світі хімічних зв'язків 🧪";
    if (this.score === 6) {
      rank = "Магістр Хімічного Зв'язку 🥇";
    } else if (this.score >= 4) {
      rank = "Дослідник хімічних зв'язків вищої категорії 🥈";
    } else if (this.score >= 2) {
      rank = "Молодший Лаборант з хімічних зв'язків 🥉";
    }

    if (this.rankName) this.rankName.textContent = rank;

    if (this.score >= 4) {
      triggerConfetti();
      if (window.soundManager) window.soundManager.playSuccess();
    }
  }
}

// Confetti Particle System for Canvas celebration
function triggerConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = [];
  const colors = ['#00f2fe', '#38bdf8', '#8b5cf6', '#10b981', '#f59e0b', '#f43f5e', '#ffffff'];

  for (let i = 0; i < 120; i++) {
    pieces.push({
      x: canvas.width / 2,
      y: canvas.height * 0.4,
      vx: (Math.random() - 0.5) * 18,
      vy: (Math.random() - 0.5) * 18 - 4,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rSpeed: (Math.random() - 0.5) * 10,
      alpha: 1
    });
  }

  let frames = 0;
  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let activePieces = 0;

    pieces.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.25; // gravity
      p.vx *= 0.98; // drag
      p.rotation += p.rSpeed;
      if (frames > 40) {
        p.alpha -= 0.015;
      }

      if (p.alpha > 0) {
        activePieces++;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.4);
        ctx.restore();
      }
    });

    frames++;
    if (activePieces > 0 && frames < 160) {
      requestAnimationFrame(update);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  update();
}
