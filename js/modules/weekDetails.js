import { state } from "../core/state.js";

export function openWeek(id) {

    const week = state.weeks.find(w => w.id === id);

    if (!week) return;

    let content = `📅 ${week.title}\n\n`;

    if (!week.lessons || week.lessons.length === 0) {
        content += "لا توجد دروس";
    } else {
        week.lessons.forEach(lesson => {
            content += `• ${lesson.title}\n`;
        });
    }

    alert(content);
}
