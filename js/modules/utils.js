/**
 * Utilities Module
 * Helper functions and utilities
 */

class Utils {
    /**
     * Format a date to a readable string
     */
    static formatDate(date, format = 'YYYY-MM-DD') {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');

        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day);
    }

    /**
     * Format time duration
     */
    static formatDuration(minutes) {
        if (minutes < 60) return `${minutes} دقيقة`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}س ${mins}د` : `${hours} ساعة`;
    }

    /**
     * Parse ISO date
     */
    static parseDate(dateString) {
        return new Date(dateString);
    }

    /**
     * Check if date is today
     */
    static isToday(date) {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    }

    /**
     * Check if date is in the past
     */
    static isPast(date) {
        return new Date(date) < new Date();
    }

    /**
     * Check if date is in the future
     */
    static isFuture(date) {
        return new Date(date) > new Date();
    }

    /**
     * Get days between two dates
     */
    static daysBetween(date1, date2) {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        const diffTime = Math.abs(d2 - d1);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    /**
     * Debounce function
     */
    static debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    /**
     * Throttle function
     */
    static throttle(func, limit) {
        let inThrottle;
        return function (...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Deep clone object
     */
    static deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    /**
     * Merge objects
     */
    static merge(...objects) {
        return Object.assign({}, ...objects);
    }

    /**
     * Calculate percentage
     */
    static percentage(current, total) {
        return Math.round((current / total) * 100);
    }

    /**
     * Storage management
     */
    static storage = {
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.error('Storage set error:', e);
                return false;
            }
        },

        get(key) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : null;
            } catch (e) {
                console.error('Storage get error:', e);
                return null;
            }
        },

        remove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                console.error('Storage remove error:', e);
                return false;
            }
        },

        clear() {
            try {
                localStorage.clear();
                return true;
            } catch (e) {
                console.error('Storage clear error:', e);
                return false;
            }
        }
    };
}

export default Utils;