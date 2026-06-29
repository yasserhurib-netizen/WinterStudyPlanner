/**
 * Event Bus Module
 * Centralized event management system
 */

class EventBus {
    constructor() {
        this.events = {};
    }

    on(eventName, handler) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(handler);

        // Return unsubscribe function
        return () => {
            this.off(eventName, handler);
        };
    }

    off(eventName, handler) {
        if (!this.events[eventName]) return;
        this.events[eventName] = this.events[eventName].filter(h => h !== handler);
    }

    emit(eventName, data) {
        if (!this.events[eventName]) return;
        this.events[eventName].forEach(handler => {
            handler(data);
        });
    }

    once(eventName, handler) {
        const wrappedHandler = (data) => {
            handler(data);
            this.off(eventName, wrappedHandler);
        };
        this.on(eventName, wrappedHandler);
    }
}

export default EventBus;