/**
 * Winter Study Planner - Main Application Module
 * Manages the overall application logic and orchestration
 */

import DataManager from '../modules/data.js';
import UIManager from '../modules/ui.js';
import StateManager from '../modules/state.js';
import EventBus from '../modules/events.js';

class App {
    constructor() {
        this.data = null;
        this.ui = null;
        this.state = null;
        this.events = null;
    }

    async init() {
        console.log('🚀 Initializing Winter Study Planner...');

        try {
            // Initialize core modules
            this.events = new EventBus();
            this.state = new StateManager();
            this.data = new DataManager();
            this.ui = new UIManager(this.state, this.events);

            // Load data
            await this.data.load();
            console.log('✅ Data loaded successfully');

            // Initialize UI
            this.ui.init();
            console.log('✅ UI initialized');

            // Render initial state
            this.render();
            console.log('✅ Application ready!');

            // Setup event listeners
            this.setupEventListeners();
            console.log('✅ Event listeners attached');

        } catch (error) {
            console.error('❌ Initialization error:', error);
            this.showError('خطأ في تحميل التطبيق');
        }
    }

    setupEventListeners() {
        // Navigation events
        document.querySelectorAll('.nav button').forEach((btn, index) => {
            btn.addEventListener('click', () => this.handleNavigation(index));
        });

        // Theme toggle
        document.querySelectorAll('.theme-toggle button').forEach((btn, index) => {
            btn.addEventListener('click', () => this.toggleTheme(index));
        });

        // Search
        const searchInput = document.querySelector('.search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }

        // Week navigation
        const prevWeekBtn = document.querySelector('.weeks-nav button:first-child');
        const nextWeekBtn = document.querySelector('.weeks-nav button:last-child');
        
        if (prevWeekBtn) prevWeekBtn.addEventListener('click', () => this.previousWeek());
        if (nextWeekBtn) nextWeekBtn.addEventListener('click', () => this.nextWeek());
    }

    render() {
        const currentWeek = this.state.getCurrentWeek();
        this.ui.renderStats(this.data.getStats());
        this.ui.renderProgress(this.data.getProgress());
        this.ui.renderWeeks(this.data.getWeeks(), currentWeek?.id);
        this.ui.renderSchedule(currentWeek);
    }

    handleNavigation(index) {
        const navButtons = document.querySelectorAll('.nav button');
        navButtons.forEach(btn => btn.classList.remove('active'));
        navButtons[index].classList.add('active');

        const pages = ['home', 'weeks', 'progress', 'subjects', 'tests', 'review', 'settings'];
        const page = pages[index];
        this.state.setCurrentPage(page);
    }

    toggleTheme(mode) {
        const isDark = mode === 1;
        document.body.classList.toggle('dark', isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }

    handleSearch(query) {
        const results = this.data.search(query);
        this.ui.renderSearchResults(results);
    }

    previousWeek() {
        this.state.previousWeek();
        this.render();
    }

    nextWeek() {
        this.state.nextWeek();
        this.render();
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger';
        errorDiv.innerHTML = `
            <span class="alert-icon">⚠️</span>
            <div class="alert-content">
                <h4>خطأ</h4>
                <p>${message}</p>
            </div>
        `;
        document.querySelector('.main').insertBefore(errorDiv, document.querySelector('.main').firstChild);
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const app = new App();
        app.init();
        window.app = app; // For debugging
    });
} else {
    const app = new App();
    app.init();
    window.app = app;
}