/**
 * Analytics Module
 * Tracks user interactions and learning progress
 */

class Analytics {
    constructor() {
        this.sessionStart = new Date();
        this.events = [];
        this.lessonHistory = [];
    }

    /**
     * Track event
     */
    trackEvent(eventName, eventData = {}) {
        const event = {
            name: eventName,
            timestamp: new Date(),
            data: eventData
        };

        this.events.push(event);
        this.persistEvent(event);
        console.log(`📊 Event tracked: ${eventName}`, eventData);
    }

    /**
     * Track lesson completion
     */
    trackLessonCompletion(lessonId, duration, weekNumber) {
        const completion = {
            lessonId,
            duration,
            weekNumber,
            completedAt: new Date()
        };

        this.lessonHistory.push(completion);
        this.trackEvent('lesson_completed', { lessonId, duration, weekNumber });
    }

    /**
     * Get learning statistics
     */
    getStatistics() {
        const totalLessons = this.lessonHistory.length;
        const totalMinutes = this.lessonHistory.reduce((sum, l) => sum + l.duration, 0);
        const averagePerDay = totalMinutes / this.getDaysSinceStart();

        return {
            totalLessons,
            totalMinutes,
            averagePerDay,
            sessionDuration: new Date() - this.sessionStart
        };
    }

    /**
     * Get days since session start
     */
    getDaysSinceStart() {
        const diff = new Date() - this.sessionStart;
        return Math.ceil(diff / (1000 * 60 * 60 * 24)) || 1;
    }

    /**
     * Persist event to localStorage
     */
    persistEvent(event) {
        try {
            let savedEvents = JSON.parse(localStorage.getItem('analytics_events')) || [];
            savedEvents.push(event);
            // Keep only last 100 events
            if (savedEvents.length > 100) {
                savedEvents = savedEvents.slice(-100);
            }
            localStorage.setItem('analytics_events', JSON.stringify(savedEvents));
        } catch (e) {
            console.error('Failed to persist event:', e);
        }
    }

    /**
     * Get saved events from localStorage
     */
    getSavedEvents() {
        try {
            return JSON.parse(localStorage.getItem('analytics_events')) || [];
        } catch (e) {
            console.error('Failed to get saved events:', e);
            return [];
        }
    }
}

export default Analytics;