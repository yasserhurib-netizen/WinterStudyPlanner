/**
 * State Manager Module
 * Manages application state and navigation
 */

class StateManager {
    constructor() {
        this.currentPage = 'home';
        this.currentWeek = 1;
        this.selectedSubject = null;
        this.searchQuery = '';
        this.theme = localStorage.getItem('theme') || 'light';
        this.filters = {
            status: null,
            subject: null
        };
    }

    getCurrentPage() {
        return this.currentPage;
    }

    setCurrentPage(page) {
        this.currentPage = page;
        this.notifyStateChange('page', page);
    }

    getCurrentWeek() {
        return this.currentWeek;
    }

    setCurrentWeek(weekId) {
        this.currentWeek = weekId;
        this.notifyStateChange('week', weekId);
    }

    nextWeek() {
        this.currentWeek++;
        this.notifyStateChange('week', this.currentWeek);
    }

    previousWeek() {
        if (this.currentWeek > 1) {
            this.currentWeek--;
            this.notifyStateChange('week', this.currentWeek);
        }
    }

    setSelectedSubject(subjectId) {
        this.selectedSubject = subjectId;
        this.notifyStateChange('subject', subjectId);
    }

    setSearchQuery(query) {
        this.searchQuery = query;
        this.notifyStateChange('search', query);
    }

    setTheme(theme) {
        this.theme = theme;
        localStorage.setItem('theme', theme);
        this.notifyStateChange('theme', theme);
    }

    setFilter(filterName, value) {
        this.filters[filterName] = value;
        this.notifyStateChange('filter', { name: filterName, value });
    }

    getFilters() {
        return this.filters;
    }

    notifyStateChange(key, value) {
        const event = new CustomEvent('stateChange', {
            detail: { key, value }
        });
        window.dispatchEvent(event);
    }
}

export default StateManager;