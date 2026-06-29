/**
 * State Manager Module
 * Manages application state and navigation
 */

class StateManager {
    constructor() {
        this.currentPage = 'home';
        this.currentWeekId = 1; // Changed from currentWeek to currentWeekId
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

    // Fixed: Returns ID instead of trying to return week object
    getCurrentWeekId() {
        return this.currentWeekId;
    }

    setCurrentWeek(weekId) {
        this.currentWeekId = weekId;
        this.notifyStateChange('week', weekId);
    }

    nextWeek() {
        this.currentWeekId++;
        this.notifyStateChange('week', this.currentWeekId);
    }

    previousWeek() {
        if (this.currentWeekId > 1) {
            this.currentWeekId--;
            this.notifyStateChange('week', this.currentWeekId);
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