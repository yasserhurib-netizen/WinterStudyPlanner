/**
 * Data Manager Module
 * Handles loading, processing, and managing application data
 */

class DataManager {
    constructor() {
        this.schedule = null;
        this.subjects = null;
        this.tests = null;
        this.stats = null;
    }

    async load() {
        try {
            const response = await fetch('data/schedule.json');
            if (!response.ok) throw new Error('Failed to load schedule');
            
            const data = await response.json();
            this.schedule = data.weeks;
            this.subjects = data.subjects;
            this.tests = data.tests;
            this.stats = data.stats;
            
            return data;
        } catch (error) {
            console.error('Error loading data:', error);
            throw error;
        }
    }

    getWeeks() {
        return this.schedule || [];
    }

    getWeek(id) {
        return this.schedule?.find(w => w.id === id);
    }

    getStats() {
        return this.stats || {};
    }

    getProgress() {
        if (!this.stats) return 0;
        return Math.round((this.stats.completedLessons / this.stats.totalLessons) * 100);
    }

    getSubjects() {
        return this.subjects || [];
    }

    getTests() {
        return this.tests || [];
    }

    getSubject(id) {
        return this.subjects?.find(s => s.id === id);
    }

    getLessonsBySubject(subjectId) {
        const lessons = [];
        this.schedule?.forEach(week => {
            week.days?.forEach(day => {
                day.lessons?.forEach(lesson => {
                    if (lesson.subject === subjectId) {
                        lessons.push({ ...lesson, week: week.number, day: day.name });
                    }
                });
            });
        });
        return lessons;
    }

    getCompletedLessonsCount() {
        let count = 0;
        this.schedule?.forEach(week => {
            week.days?.forEach(day => {
                day.lessons?.forEach(lesson => {
                    if (lesson.status === 'completed') count++;
                });
            });
        });
        return count;
    }

    getUpcomingTests() {
        return this.tests?.filter(t => t.status === 'upcoming') || [];
    }

    markLessonComplete(lessonId, weekId) {
        const week = this.getWeek(weekId);
        if (!week) return false;

        const lesson = this.findLesson(lessonId, weekId);
        if (lesson) {
            // Toggle status
            lesson.status = lesson.status === 'completed' ? 'pending' : 'completed';
            this.updateStats();
            console.log(`Lesson ${lessonId} status: ${lesson.status}`);
            return true;
        }
        return false;
    }

    findLesson(lessonId, weekId) {
        const week = this.getWeek(weekId);
        if (!week) return null;

        for (const day of week.days) {
            const lesson = day.lessons?.find(l => l.id === lessonId);
            if (lesson) return lesson;
        }
        return null;
    }

    updateStats() {
        this.stats.completedLessons = this.getCompletedLessonsCount();
        this.stats.progressPercent = Math.round(
            (this.stats.completedLessons / this.stats.totalLessons) * 100
        );
    }

    search(query) {
        const results = {
            lessons: [],
            subjects: [],
            tests: []
        };

        if (!query.trim()) return results;

        const q = query.toLowerCase();

        // Search lessons
        this.schedule?.forEach(week => {
            week.days?.forEach(day => {
                day.lessons?.forEach(lesson => {
                    if (
                        lesson.title.toLowerCase().includes(q) ||
                        lesson.description?.toLowerCase().includes(q)
                    ) {
                        results.lessons.push({
                            ...lesson,
                            weekNumber: week.number,
                            dayName: day.name
                        });
                    }
                });
            });
        });

        // Search subjects
        this.subjects?.forEach(subject => {
            if (subject.name.toLowerCase().includes(q)) {
                results.subjects.push(subject);
            }
        });

        // Search tests
        this.tests?.forEach(test => {
            if (test.name.toLowerCase().includes(q)) {
                results.tests.push(test);
            }
        });

        return results;
    }
}

export default DataManager;