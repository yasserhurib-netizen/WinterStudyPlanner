// ============================================================
//  app.js  –  منطق التطبيق الرئيسي
// ============================================================

// ── State ──────────────────────────────────────────────────
let state = {
  currentWeek: 0,   // index in SCHEDULE
  currentPage: 'home',
  progress: {},     // lessonId → { done, notes }
};

// ── Init ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadProgress();
  renderWeekTabs();
  renderAllWeeksGrid();
  renderSubjectsPage();
  renderExamsPage();
  renderReviewPage();
  renderProgressPage();
  selectWeek(0);
  updateRing();
  applyThemeFromStorage();
  setupNavButtons();
});

// ── NAV ────────────────────────────────────────────────────
function setupNavButtons() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = btn.dataset.page;
      showPage(page);
    });
  });
}

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  const page = document.getElementById('page-' + pageId);
  if (page) page.classList.add('active');

  const btn = document.querySelector(`.nav-btn[data-page="${pageId}"]`);
  if (btn) btn.classList.add('active');

  state.currentPage = pageId;
}

// ── WEEK TABS ──────────────────────────────────────────────
function renderWeekTabs() {
  const container = document.getElementById('weeksTabs');
  container.innerHTML = '';
  SCHEDULE.forEach((wk, idx) => {
    const btn = document.createElement('button');
    btn.className = 'week-tab';
    btn.dataset.idx = idx;
    btn.innerHTML = `
      <span class="wt-name">${wk.name}</span>
      <span class="wt-dates">${wk.dates}</span>
    `;
    btn.addEventListener('click', () => selectWeek(idx));
    container.appendChild(btn);
  });
}

function selectWeek(idx) {
  state.currentWeek = idx;

  document.querySelectorAll('.week-tab').forEach((t, i) => {
    t.classList.toggle('active', i === idx);
  });

  renderWeekDetail(SCHEDULE[idx]);
}

function scrollWeeks(dir) {
  const next = state.currentWeek + dir;
  if (next >= 0 && next < SCHEDULE.length) {
    selectWeek(next);
    // Scroll the tab into view
    const tabs = document.querySelectorAll('.week-tab');
    if (tabs[next]) tabs[next].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }
}

// ── WEEK DETAIL ────────────────────────────────────────────
function renderWeekDetail(wk) {
  document.getElementById('weekTitle').textContent = wk.name;
  document.getElementById('weekDates').textContent = '📅 ' + wk.dates;

  // Count exams & lessons
  let examCount = 0, lessonCount = 0;
  const dayCount = wk.days.length;
  wk.days.forEach(d => {
    d.lessons.forEach(l => {
      if (l.subject === 'exam') examCount++;
      else lessonCount++;
    });
  });

  document.getElementById('wkExams').textContent   = examCount;
  document.getElementById('wkLessons').textContent = lessonCount;
  document.getElementById('wkDays').textContent    = dayCount;

  renderLessonGrid(wk);
}

function renderLessonGrid(wk) {
  const grid = document.getElementById('lessonGrid');
  grid.innerHTML = '';

  // Figure out unique subjects (columns)
  const subjectKeys = [];
  wk.days.forEach(d => {
    d.lessons.forEach(l => {
      const key = l.subject;
      if (!subjectKeys.includes(key)) subjectKeys.push(key);
    });
  });

  // Limit columns to 6 for layout
  const cols = subjectKeys.slice(0, 6);
  const colCount = cols.length;

  // Update grid columns
  grid.style.gridTemplateColumns = `auto repeat(${colCount}, 1fr)`;

  // Header row: "اليوم" + subjects
  const dayHeader = document.createElement('div');
  dayHeader.className = 'grid-header';
  dayHeader.textContent = 'اليوم';
  grid.appendChild(dayHeader);

  cols.forEach(key => {
    const subj = SUBJECTS[key];
    const hdr = document.createElement('div');
    hdr.className = 'grid-header';
    hdr.innerHTML = `<span style="color:${subj ? subj.color : '#666'}">${subj ? subj.icon + ' ' + subj.name : key}</span>`;
    grid.appendChild(hdr);
  });

  // Rows: one per day
  wk.days.forEach(d => {
    // Day label
    const lbl = document.createElement('div');
    lbl.className = 'grid-day-label';
    lbl.innerHTML = `<span class="day-name">${d.day}</span><span class="day-date">${d.date}</span>`;
    if (d.type === 'exam') lbl.style.background = 'rgba(239,68,68,0.08)';
    if (d.type === 'review') lbl.style.background = 'rgba(16,185,129,0.08)';
    grid.appendChild(lbl);

    // One cell per subject column
    cols.forEach(key => {
      const cell = document.createElement('div');
      cell.className = 'grid-cell';

      const lesson = d.lessons.find(l => l.subject === key);
      if (lesson) {
        const prog = state.progress[lesson.id] || {};
        const isDone = prog.done || false;
        const subj = SUBJECTS[key];

        cell.innerHTML = `
          <div class="lesson-card${isDone ? ' is-done' : ''}${lesson.subject === 'exam' ? ' is-exam' : ''}${lesson.subject === 'review' ? ' is-review' : ''}"
               data-id="${lesson.id}" onclick="openLessonModal('${lesson.id}')">
            <span class="lc-subject ${subj ? subj.cls : ''}">${subj ? subj.icon + ' ' + subj.name : ''}</span>
            <span class="lc-title">${lesson.title}</span>
            <span class="lc-desc">${lesson.description}</span>
            <button class="lc-status ${isDone ? 'done' : 'pending'}"
                    onclick="event.stopPropagation(); toggleLesson('${lesson.id}')">
              ${isDone ? '✓ مكتمل' : '○ مكتمل'}
            </button>
          </div>
        `;
      } else {
        cell.innerHTML = '<div style="min-height:115px"></div>';
      }

      grid.appendChild(cell);
    });
  });
}

// ── TOGGLE LESSON ──────────────────────────────────────────
function toggleLesson(lessonId) {
  if (!state.progress[lessonId]) state.progress[lessonId] = { done: false, notes: '' };
  state.progress[lessonId].done = !state.progress[lessonId].done;
  saveProgress();
  renderWeekDetail(SCHEDULE[state.currentWeek]);
  updateRing();
  renderAllWeeksGrid();
  renderProgressPage();
}

// ── LESSON MODAL ───────────────────────────────────────────
function openLessonModal(lessonId) {
  // Find lesson
  let lesson = null;
  for (const wk of SCHEDULE) {
    for (const d of wk.days) {
      lesson = d.lessons.find(l => l.id === lessonId);
      if (lesson) break;
    }
    if (lesson) break;
  }
  if (!lesson) return;

  const prog = state.progress[lessonId] || {};
  const isDone = prog.done || false;
  const notes = prog.notes || '';
  const subj = SUBJECTS[lesson.subject];

  document.getElementById('modalBody').innerHTML = `
    <div class="modal-subject-name">
      ${subj ? subj.icon + ' ' + subj.name : ''} &nbsp; ${lesson.title}
    </div>
    <p class="modal-desc">${lesson.description}</p>
    <div class="modal-actions">
      <button class="modal-btn done-btn" onclick="toggleLesson('${lessonId}'); closeModal()">
        ${isDone ? '↩ إلغاء الإكمال' : '✓ تعليم كمكتمل'}
      </button>
      <button class="modal-btn undo-btn" onclick="closeModal()">إغلاق</button>
    </div>
    <label class="modal-notes-label">ملاحظاتك الخاصة:</label>
    <textarea class="modal-notes" id="modalNotes" placeholder="أضف ملاحظاتك هنا...">${notes}</textarea>
    <div style="margin-top:8px">
      <button class="modal-btn done-btn" onclick="saveNotes('${lessonId}')">💾 حفظ الملاحظات</button>
    </div>
  `;

  document.getElementById('lessonModal').classList.remove('hidden');
}

function saveNotes(lessonId) {
  const notes = document.getElementById('modalNotes').value;
  if (!state.progress[lessonId]) state.progress[lessonId] = { done: false, notes: '' };
  state.progress[lessonId].notes = notes;
  saveProgress();
  closeModal();
}

function closeModal() {
  document.getElementById('lessonModal').classList.add('hidden');
}

// Close on overlay click
document.getElementById('lessonModal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeModal();
});

// ── ALL WEEKS GRID ─────────────────────────────────────────
function renderAllWeeksGrid() {
  const grid = document.getElementById('allWeeksGrid');
  grid.innerHTML = '';
  SCHEDULE.forEach((wk, idx) => {
    const { total, done } = weekProgress(wk);
    const pct = total ? Math.round((done / total) * 100) : 0;
    const full = pct === 100;

    const card = document.createElement('div');
    card.className = `week-card${full ? ' completed' : ''}`;
    card.innerHTML = `
      <div class="wc-number">${wk.week}</div>
      <div class="wc-name">${wk.name}</div>
      <div class="wc-dates">${wk.dates}</div>
      <div class="wc-bar">
        <div class="wc-bar-fill${full ? ' full' : ''}" style="width:${pct}%"></div>
      </div>
      <div class="wc-pct">${pct}% (${done}/${total})</div>
    `;
    card.addEventListener('click', () => {
      showPage('home');
      selectWeek(idx);
      const tabs = document.querySelectorAll('.week-tab');
      if (tabs[idx]) tabs[idx].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    });
    grid.appendChild(card);
  });
}

// ── PROGRESS PAGE ──────────────────────────────────────────
function renderProgressPage() {
  const container = document.getElementById('progressPageContent');
  container.innerHTML = '';
  SCHEDULE.forEach((wk) => {
    const { total, done } = weekProgress(wk);
    const pct = total ? Math.round((done / total) * 100) : 0;
    const full = pct === 100;

    const card = document.createElement('div');
    card.className = 'prog-week-card';
    card.innerHTML = `
      <div class="pwc-name">${wk.name}</div>
      <div class="pwc-dates">${wk.dates}</div>
      <div class="pwc-bar">
        <div class="pwc-bar-fill${full ? ' full' : ''}" style="width:${pct}%"></div>
      </div>
      <div class="pwc-pct">${pct}% · ${done} من ${total} درس</div>
    `;
    container.appendChild(card);
  });
}

// ── SUBJECTS PAGE ──────────────────────────────────────────
function renderSubjectsPage() {
  const grid = document.getElementById('subjectsGrid');
  grid.innerHTML = '';
  const counts = {};

  SCHEDULE.forEach(wk => {
    wk.days.forEach(d => {
      d.lessons.forEach(l => {
        counts[l.subject] = (counts[l.subject] || 0) + 1;
      });
    });
  });

  Object.entries(SUBJECTS).forEach(([key, subj]) => {
    if (!counts[key]) return;
    const card = document.createElement('div');
    card.className = 'subject-card';
    card.style.borderTopColor = subj.color;
    card.innerHTML = `
      <div class="sc-icon">${subj.icon}</div>
      <div class="sc-name" style="color:${subj.color}">${subj.name}</div>
      <div class="sc-count">${counts[key]} حصة في الخطة</div>
    `;
    grid.appendChild(card);
  });
}

// ── EXAMS PAGE ─────────────────────────────────────────────
function renderExamsPage() {
  const list = document.getElementById('examsList');
  list.innerHTML = '';

  SCHEDULE.forEach(wk => {
    wk.days.forEach(d => {
      d.lessons.filter(l => l.subject === 'exam').forEach(l => {
        const prog = state.progress[l.id] || {};
        const item = document.createElement('div');
        item.className = 'exam-item';
        item.innerHTML = `
          <div class="exam-info">
            <div class="exam-title">📝 ${l.title}</div>
            <div class="exam-detail">${l.description} · ${d.day} ${d.date}</div>
          </div>
          <span class="exam-week">${wk.name}</span>
        `;
        list.appendChild(item);
      });
    });
  });
}

// ── REVIEW PAGE ────────────────────────────────────────────
function renderReviewPage() {
  const container = document.getElementById('reviewContent');
  container.innerHTML = '';

  SCHEDULE.forEach(wk => {
    wk.days.filter(d => d.type === 'review').forEach(d => {
      const item = document.createElement('div');
      item.className = 'review-item';
      item.innerHTML = `
        <h3>🔄 ${wk.name} · ${d.day} ${d.date}</h3>
        <p>${d.lessons.map(l => l.title).join(' | ')}</p>
      `;
      container.appendChild(item);
    });
  });
}

// ── PROGRESS RING ──────────────────────────────────────────
function updateRing() {
  let totalAll = 0, doneAll = 0;
  SCHEDULE.forEach(wk => {
    const p = weekProgress(wk);
    totalAll += p.total;
    doneAll  += p.done;
  });

  const pct = totalAll ? Math.round((doneAll / totalAll) * 100) : 0;
  const circumference = 314;
  const offset = circumference - (pct / 100) * circumference;

  document.getElementById('ringFill').style.strokeDashoffset  = offset;
  document.getElementById('ringPercent').textContent          = pct + '%';
  document.getElementById('overallPct').textContent           = pct + '%';
  document.getElementById('overallBar').style.width           = pct + '%';

  // Count completed weeks
  let completedWeeks = 0;
  SCHEDULE.forEach(wk => {
    const { total, done } = weekProgress(wk);
    if (total && done === total) completedWeeks++;
  });
  document.getElementById('weeksDoneText').textContent = `تم إنجاز ${completedWeeks} من 27 أسبوع`;
}

function weekProgress(wk) {
  let total = 0, done = 0;
  wk.days.forEach(d => {
    d.lessons.forEach(l => {
      total++;
      if (state.progress[l.id] && state.progress[l.id].done) done++;
    });
  });
  return { total, done };
}

// ── STORAGE ────────────────────────────────────────────────
function saveProgress() {
  try { localStorage.setItem('wsp_progress', JSON.stringify(state.progress)); } catch(e) {}
}

function loadProgress() {
  try {
    const raw = localStorage.getItem('wsp_progress');
    if (raw) state.progress = JSON.parse(raw);
  } catch(e) { state.progress = {}; }
}

function resetAllProgress() {
  if (!confirm('هل أنت متأكد من إعادة تعيين كل التقدم؟')) return;
  state.progress = {};
  saveProgress();
  renderWeekDetail(SCHEDULE[state.currentWeek]);
  updateRing();
  renderAllWeeksGrid();
  renderProgressPage();
}

// ── THEME ──────────────────────────────────────────────────
function toggleTheme() {
  const isDark = document.body.classList.toggle('dark');
  localStorage.setItem('wsp_theme', isDark ? 'dark' : 'light');
  document.getElementById('themeIcon').textContent  = isDark ? '🌙' : '☀️';
  document.getElementById('themeLabel').textContent = isDark ? 'الوضع الفاتح' : 'الوضع الداكن';
  const darkToggle = document.getElementById('darkToggle');
  if (darkToggle) darkToggle.checked = isDark;
}

function applyThemeFromStorage() {
  const theme = localStorage.getItem('wsp_theme');
  if (theme === 'dark') {
    document.body.classList.add('dark');
    document.getElementById('themeIcon').textContent  = '🌙';
    document.getElementById('themeLabel').textContent = 'الوضع الفاتح';
    const darkToggle = document.getElementById('darkToggle');
    if (darkToggle) darkToggle.checked = true;
  }
}
