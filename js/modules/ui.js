/**
 * UI Manager Module
 * Handles all rendering and DOM manipulation
 */

class UIManager {
    constructor(stateManager, eventBus) {
        this.state = stateManager;
        this.events = eventBus;
    }

    init() {
        this.applyTheme();
        this.setupSidebar();
    }

    applyTheme() {
        if (this.state.theme === 'dark') {
            document.body.classList.add('dark');
        }
    }

    setupSidebar() {
        const sidebar = document.querySelector('.sidebar');
        if (!sidebar) return;

        // Add sidebar bottom section
        const sidebarBottom = document.createElement('div');
        sidebarBottom.className = 'sidebar-bottom';
        sidebarBottom.innerHTML = `
            <div class="theme-toggle">
                <button title="الوضع النهاري" onclick="window.app?.ui.setTheme('light')">☀️</button>
                <button title="الوضع الليلي" onclick="window.app?.ui.setTheme('dark')">🌙</button>
            </div>
            <div class="progress-section">
                <h4>نسبة الإنجاز</h4>
                <div class="progress-circle">
                    <svg viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--gray-200)" stroke-width="3"></circle>
                        <circle id="progress-circle-fill" cx="18" cy="18" r="15.915" fill="none" stroke="var(--primary)" stroke-width="3" stroke-dasharray="0 100" stroke-linecap="round" transform="rotate(-90 18 18)"></circle>
                    </svg>
                    <div class="progress-circle-text">
                        <div class="progress-circle-percent" id="progress-circle-percent">0%</div>
                        <div class="progress-circle-label">إنجاز</div>
                    </div>
                </div>
                <div class="progress-info" id="progress-info">من اليوم 12/27</div>
            </div>
        `;
        sidebar.appendChild(sidebarBottom);
    }

    renderStats(stats) {
        const statsContainer = document.querySelector('#stats');
        if (!statsContainer) return;

        statsContainer.innerHTML = `
            <div class="card stat-card">
                <span class="stat-icon">📅</span>
                <h3>الأسابيع</h3>
                <h2>${stats.totalWeeks || 0}</h2>
            </div>
            <div class="card stat-card">
                <span class="stat-icon">📚</span>
                <h3>الدروس</h3>
                <h2>${stats.totalLessons || 0}</h2>
            </div>
            <div class="card stat-card">
                <span class="stat-icon">📝</span>
                <h3>الاختبارات</h3>
                <h2>${stats.totalTests || 0}</h2>
            </div>
            <div class="card stat-card">
                <span class="stat-icon">📈</span>
                <h3>الإنجاز</h3>
                <h2 id="stats-progress">${stats.progressPercent || 0}%</h2>
            </div>
        `;
    }

    renderProgress(progressPercent) {
        const progressBar = document.querySelector('#progress-bar');
        const progressText = document.querySelector('#progress-text');
        const circlePercent = document.querySelector('#progress-circle-percent');
        const circleFill = document.querySelector('#progress-circle-fill');

        if (progressBar) {
            progressBar.style.width = `${progressPercent}%`;
        }
        if (progressText) {
            progressText.textContent = `${progressPercent}%`;
        }
        if (circlePercent) {
            circlePercent.textContent = `${progressPercent}%`;
        }
        if (circleFill) {
            circleFill.style.strokeDasharray = `${progressPercent} 100`;
        }
    }

    renderWeeks(weeks, activeWeekId) {
        const container = document.querySelector('#weeks-container');
        if (!container) return;

        // Create wrapper if it doesn't exist
        let wrapper = document.querySelector('.weeks-wrapper');
        if (!wrapper) {
            wrapper = document.createElement('div');
            wrapper.className = 'weeks-wrapper';
            container.parentElement.insertBefore(wrapper, container);
        }

        wrapper.innerHTML = `
            <div class="weeks-header">
                <h2>📅 اختر الأسبوع</h2>
                <div class="weeks-nav">
                    <button class="prev-week" onclick="window.app?.previousWeek()">←</button>
                    <button class="next-week" onclick="window.app?.nextWeek()">→</button>
                </div>
            </div>
            <div class="weeks-slider" id="weeks-slider">
                ${weeks.map(week => `
                    <div class="week-item ${week.id === activeWeekId ? 'active' : ''}" 
                         onclick="window.app?.state.setCurrentWeek(${week.id}); window.app?.render();">
                        <div class="week-number">الأسبوع ${week.number}</div>
                        <div class="week-label">${this.formatDate(week.startDate)} - ${this.formatDate(week.endDate)}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderSchedule(week) {
        if (!week) {
            console.warn('No week data available');
            return;
        }

        // Get stats for this week
        const stats = this.getWeekStats(week);

        // Render week details
        const detailsHtml = `
            <div class="week-details">
                <div class="detail-item">
                    <div class="detail-icon">📚</div>
                    <div class="detail-label">دروس</div>
                    <div class="detail-value">${stats.lessons}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-icon">✅</div>
                    <div class="detail-label">مكتملة</div>
                    <div class="detail-value">${stats.completed}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-icon">📅</div>
                    <div class="detail-label">أيام</div>
                    <div class="detail-value">${week.days.length}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-icon">⏱️</div>
                    <div class="detail-label">ساعات</div>
                    <div class="detail-value">${stats.hours}</div>
                </div>
            </div>
        `;

        // Insert details before table
        const table = document.querySelector('.lessons-card');
        let detailsDiv = table.querySelector('.week-details');
        if (!detailsDiv) {
            detailsDiv = document.createElement('div');
            table.insertBefore(detailsDiv, table.querySelector('.lesson-table'));
        }
        detailsDiv.innerHTML = detailsHtml.trim();

        // Render day schedule
        const scheduleHtml = `
            <div class="day-schedule">
                ${week.days.map(day => this.renderDay(day, week.id)).join('')}
            </div>
        `;

        const scheduleContainer = document.querySelector('.lessons-card');
        let dayScheduleDiv = scheduleContainer.querySelector('.day-schedule');
        if (!dayScheduleDiv) {
            dayScheduleDiv = document.createElement('div');
            scheduleContainer.appendChild(dayScheduleDiv);
        }
        dayScheduleDiv.innerHTML = scheduleHtml;
    }

    renderDay(day, weekId) {
        const lessonsHtml = day.lessons && day.lessons.length > 0
            ? day.lessons.map(lesson => this.renderLesson(lesson, day.id, weekId)).join('')
            : '<div class="day-content empty">لا توجد دروس</div>';

        return `
            <div class="day-card">
                <div class="day-header">
                    <h3>${day.name}</h3>
                    <small>${this.formatDate(day.date)}</small>
                </div>
                <div class="day-content">
                    ${lessonsHtml}
                </div>
            </div>
        `;
    }

    renderLesson(lesson, dayId, weekId) {
        const subject = this.getSubjectInfo(lesson.subject);
        const statusIcons = {
            'completed': '✅',
            'pending': '⏳',
            'not-started': '⭕'
        };

        return `
            <div class="lesson-item" data-lesson-id="${lesson.id}">
                <div class="lesson-header">
                    <span class="lesson-subject" style="color: ${subject.color}">
                        ${subject.icon} ${subject.name}
                    </span>
                    <span class="status-badge ${lesson.status}">
                        ${statusIcons[lesson.status] || '❓'}
                    </span>
                </div>
                <div class="lesson-title">${lesson.title}</div>
                <div class="lesson-description">${lesson.description}</div>
                <div class="lesson-footer">
                    <span style="font-size: 0.85rem; color: var(--gray-500);">
                        ⏱️ ${lesson.duration} دقيقة
                    </span>
                    <input 
                        type="checkbox" 
                        class="lesson-checkbox"
                        ${lesson.status === 'completed' ? 'checked' : ''}
                        onchange="window.app?.toggleLesson(${lesson.id}, ${weekId}, this.checked)"
                    >
                </div>
            </div>
        `;
    }

    renderSearchResults(results) {
        console.log('Search results:', results);
    }

    setTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
        this.state.setTheme(theme);
    }

    getSubjectInfo(subjectId) {
        const subjects = {
            'math': { name: 'الرياضيات', icon: '📐', color: '#3b82f6' },
            'arabic': { name: 'اللغة العربية', icon: '📖', color: '#a855f7' },
            'english': { name: 'English', icon: '📕', color: '#f59e0b' },
            'science': { name: 'العلوم', icon: '🔬', color: '#10b981' },
            'history': { name: 'التاريخ', icon: '📜', color: '#ef4444' },
            'islamic': { name: 'التربية الإسلامية', icon: '☪️', color: '#06b6d4' }
        };
        return subjects[subjectId] || { name: 'Unknown', icon: '❓', color: '#6b7280' };
    }

    getWeekStats(week) {
        let lessons = 0;
        let completed = 0;
        let hours = 0;

        week.days.forEach(day => {
            day.lessons?.forEach(lesson => {
                lessons++;
                if (lesson.status === 'completed') completed++;
                hours += Math.ceil((lesson.duration || 0) / 60);
            });
        });

        return { lessons, completed, hours };
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-SA', {
            month: 'numeric',
            day: 'numeric'
        });
    }
}

export default UIManager;