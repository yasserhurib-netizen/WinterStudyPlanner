import { toggleLessonStatus, getProgress } from './storage.js';

// 1. دالة لتحديث العدادات وشريط التقدم في لوحة التحكم
export function updateStatsAndProgress(planData) {
    const progress = getProgress();
    
    let totalLessonsCount = 0;
    let totalTestsCount = 0;
    
    planData.weeks.forEach(week => {
        week.days.forEach(day => {
            totalLessonsCount += day.lessons.length;
            if(day.type === 'test-day') {
                totalTestsCount += day.lessons.length;
            }
        });
    });

    const completedCount = progress.filter(id => id.startsWith('ls_')).length;
    const percent = totalLessonsCount > 0 ? Math.round((completedCount / totalLessonsCount) * 100) : 0;

    const statsContainer = document.getElementById('stats');
    if (statsContainer) {
        statsContainer.innerHTML = `
            <div class="card">📚 أسابيع الخطة: ${planData.weeks.length} من 27</div>
            <div class="card">📖 الدروس المحملة: ${totalLessonsCount} درس</div>
            <div class="card">🧪 اختبارات مدمجة: ${totalTestsCount}</div>
            <div class="card">📊 الإنجاز الحالي: ${completedCount} درس مـكتمل</div>
        `;
    }

    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        progressBar.style.width = `${percent}%`;
        progressBar.innerText = `${percent}%`;
    }
}

// 2. دالة لبناء كروت الأسابيع التفاعلية في الصفحة الرئيسية
export function renderWeeksGrid(planData, onWeekClickCallback) {
    const container = document.getElementById('weeks-container');
    if (!container) return;

    container.innerHTML = '';

    planData.weeks.forEach(week => {
        const card = document.createElement('div');
        card.className = 'card week-card';
        card.style.cursor = 'pointer';
        card.innerHTML = `
            <h3>📅 ${week.title}</h3>
            <p>${week.date}</p>
            <button class="btn-open-week" style="margin-top:10px; padding:6px 12px; background:#4f46e5; color:white; border:none; border-radius:6px; cursor:pointer;">عرض الجدول</button>
        `;
        
        card.addEventListener('click', () => onWeekClickCallback(week));
        container.appendChild(card);
    });
}

// 3. دالة لبناء جدول الحصص الأفقي المريح داخل النافذة المنبثقة
export function renderWeekTableInModal(week) {
    const modalBody = document.getElementById('modal-body');
    const progress = getProgress();

    let tableHTML = `
        <h2 class="modal-title">📅 ${week.title}: ${week.date}</h2>
        <div class="table-responsive">
            <table>
                <thead>
                    <tr>
                        <th>اليوم</th>
                        <th colspan="4">الحصص والدروس المقررة</th>
                    </tr>
                </thead>
                <tbody>
    `;

    week.days.forEach(day => {
        let rowClass = day.type ? day.type : '';
        tableHTML += `
            <tr class="${rowClass}">
                <td class="day-column">${day.name}</td>
        `;

        day.lessons.forEach(lesson => {
            const isDone = progress.includes(lesson.id);
            const doneClass = isDone ? 'is-done' : '';
            const btnText = isDone ? 'مكتمل ✓' : 'تمت الدراسة';

            tableHTML += `
                <td>
                    <div class="subject-container ${doneClass}" id="card_${lesson.id}">
                        <div class="subject-title">${lesson.subject}</div>
                        <div class="subject-desc">${lesson.desc}</div>
                        <button class="done-toggle-btn" data-id="${lesson.id}">${btnText}</button>
                    </div>
                </td>
            `;
        });

        for(let k = day.lessons.length; k < 4; k++) {
            tableHTML += `<td></td>`;
        }

        tableHTML += `</tr>`;
    });

    tableHTML += `
                </tbody>
            </table>
        </div>
    `;

    modalBody.innerHTML = tableHTML;

    // ربط أزرار "تمت الدراسة" بحدث الضغط التفاعلي تلقائياً
    modalBody.querySelectorAll('.done-toggle-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const lessonId = e.target.getAttribute('data-id');
            const card = document.getElementById(`card_${lessonId}`);
            
            const isNowCompleted = toggleLessonStatus(lessonId);
            
            if (isNowCompleted) {
                card.classList.add('is-done');
                e.target.innerText = "مكتمل ✓";
            } else {
                card.classList.remove('is-done');
                e.target.innerText = "تمت الدراسة";
            }
            
            updateStatsAndProgress(window.currentPlanData);
        });
    });
}
