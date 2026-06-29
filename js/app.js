// ============================================================
// app.js – Refactored Clean Architecture (Phase 1)
// ============================================================

// ===================== STATE =====================
const store = {
  currentWeek: 0,
  currentPage: 'home',
  progress: {},
  theme: 'light'
};

// ===================== INIT =====================
document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
  loadProgress();
  loadTheme();

  UI.initNavigation();
 renderWeekTabs();
  UI.renderAllPages();

  Week.select(0);
  Progress.updateRing();
}

// ============================================================
// 🧭 NAVIGATION MODULE
// ============================================================
const UI = {

  initNavigation() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.showPage(btn.dataset.page);
      });
    });
  },

  showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    document.getElementById('page-' + pageId)?.classList.add('active');
    document.querySelector(`[data-page="${pageId}"]`)?.classList.add('active');

    store.currentPage = pageId;
  },

  renderAllPages() {
    Subject.render();
    Exam.render();
    Review.render();
    Progress.renderPage();
  }
};

// ============================================================
// 📅 WEEK MODULE
// ============================================================
const Week = {

  initWeeks() {
    const container = document.getElementById('weeksTabs');
    container.innerHTML = '';

    SCHEDULE.forEach((wk, idx) => {
      const btn = document.createElement('button');
      btn.className = 'week-tab';
      btn.innerHTML = `
        <span>${wk.name}</span>
        <small>${wk.dates}</small>
      `;

      btn.addEventListener('click', () => this.select(idx));
      container.appendChild(btn);
    });
  },

  select(idx) {
    store.currentWeek = idx;

    document.querySelectorAll('.week-tab')
      .forEach((t, i) => t.classList.toggle('active', i === idx));

    this.renderDetail(SCHEDULE[idx]);
  },

  renderDetail(week) {
    document.getElementById('weekTitle').textContent = week.name;
    document.getElementById('weekDates').textContent = week.dates;

    const stats = this.calculateStats(week);

    document.getElementById('wkExams').textContent = stats.exams;
    document.getElementById('wkLessons').textContent = stats.lessons;
    document.getElementById('wkDays').textContent = stats.days;

    Grid.render(week);
  },

  calculateStats(week) {
    let lessons = 0, exams = 0;

    week.days.forEach(d => {
      d.lessons.forEach(l => {
        if (l.subject === 'exam') exams++;
        else lessons++;
      });
    });

    return {
      lessons,
      exams,
      days: week.days.length
    };
  }
};

// ============================================================
// 📊 GRID MODULE
// ============================================================
const Grid = {

  render(week) {
    const grid = document.getElementById('lessonGrid');
    grid.innerHTML = '';

    const subjects = this.getSubjects(week);
    grid.style.gridTemplateColumns = `auto repeat(${subjects.length}, 1fr)`;

    this.renderHeader(grid, subjects);
    this.renderRows(grid, week, subjects);
  },

  getSubjects(week) {
    const set = new Set();

    week.days.forEach(d => {
      d.lessons.forEach(l => set.add(l.subject));
    });

    return Array.from(set).slice(0, 6);
  },

  renderHeader(grid, subjects) {
    grid.appendChild(this.cell('grid-header', 'اليوم'));

    subjects.forEach(key => {
      const s = SUBJECTS[key];
      grid.appendChild(this.cell(
        'grid-header',
        `<span style="color:${s?.color}">${s?.icon} ${s?.name}</span>`
      ));
    });
  },

  renderRows(grid, week, subjects) {
    week.days.forEach(day => {

      const label = this.cell('grid-day-label', `
        <b>${day.day}</b><br>
        <small>${day.date}</small>
      `);

      grid.appendChild(label);

      subjects.forEach(key => {

        const lesson = day.lessons.find(l => l.subject === key);

        if (!lesson) {
          grid.appendChild(this.cell('grid-cell', ''));
          return;
        }

        const prog = store.progress[lesson.id];
        const done = prog?.done;

        const subj = SUBJECTS[key];

        const el = document.createElement('div');
        el.className = `lesson-card ${done ? 'is-done' : ''}`;
        el.innerHTML = `
          <div>${subj?.icon} ${lesson.title}</div>
          <small>${lesson.description}</small>
          <button onclick="Actions.toggle('${lesson.id}')">
            ${done ? '✔' : '○'}
          </button>
        `;

        el.onclick = () => Modal.open(lesson.id);
        grid.appendChild(el);
      });
    });
  },

  cell(cls, html) {
    const div = document.createElement('div');
    div.className = cls;
    div.innerHTML = html;
    return div;
  }
};

// ============================================================
// ⚡ ACTIONS
// ============================================================
const Actions = {

  toggle(id) {
    if (!store.progress[id]) {
      store.progress[id] = { done: false, notes: '' };
    }

    store.progress[id].done = !store.progress[id].done;

    saveProgress();

    Week.renderDetail(SCHEDULE[store.currentWeek]);
    Progress.updateRing();
  }
};

// ============================================================
// 🪟 MODAL
// ============================================================
const Modal = {

  open(id) {
    const lesson = findLesson(id);
    if (!lesson) return;

    const subj = SUBJECTS[lesson.subject];
    const prog = store.progress[id] || {};

    document.getElementById('modalBody').innerHTML = `
      <h2>${subj?.icon} ${lesson.title}</h2>
      <p>${lesson.description}</p>

      <button onclick="Actions.toggle('${id}')">
        ${prog.done ? 'إلغاء الإكمال' : 'تعليم كمكتمل'}
      </button>

      <textarea id="notes">${prog.notes || ''}</textarea>
      <button onclick="Modal.save('${id}')">حفظ</button>
    `;

    document.getElementById('lessonModal').classList.remove('hidden');
  },

  save(id) {
    if (!store.progress[id]) store.progress[id] = {};
    store.progress[id].notes = document.getElementById('notes').value;

    saveProgress();
    this.close();
  },

  close() {
    document.getElementById('lessonModal').classList.add('hidden');
  }
};

// ============================================================
// 📈 PROGRESS
// ============================================================
const Progress = {

  updateRing() {
    let total = 0, done = 0;

    SCHEDULE.forEach(w => {
      w.days.forEach(d => {
        d.lessons.forEach(l => {
          total++;
          if (store.progress[l.id]?.done) done++;
        });
      });
    });

    const pct = total ? Math.round((done / total) * 100) : 0;

    document.getElementById('ringPercent').textContent = pct + '%';
    document.getElementById('overallPct').textContent = pct + '%';
    document.getElementById('overallBar').style.width = pct + '%';
  },

  renderPage() {
    // تبسيط (نطورها لاحقاً)
    const container = document.getElementById('progressPageContent');
    if (!container) return;
    container.innerHTML = '';
  }
};

// ============================================================
// 🔧 HELPERS
// ============================================================
function findLesson(id) {
  for (const w of SCHEDULE) {
    for (const d of w.days) {
      const l = d.lessons.find(x => x.id === id);
      if (l) return l;
    }
  }
}

function saveProgress() {
  localStorage.setItem('wsp_progress', JSON.stringify(store.progress));
}

function loadProgress() {
  const data = localStorage.getItem('wsp_progress');
  if (data) store.progress = JSON.parse(data);
}

function toggleTheme() {
  document.body.classList.toggle('dark');
}

function loadTheme() {}
