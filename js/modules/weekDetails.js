import { state } from "../core/state.js";

export function openWeek(id) {

    const week = state.weeks.find(w => w.id === id);

    if (!week) return;

    let content = 📅 ${week.title}\n\n;

    if (week.lessons.length === 0) {
        content += "لا توجد دروس بعد";
    } else {
        week.lessons.forEach(l => {
            content += - ${l.title} ${l.completed ? "✔" : "❌"}\n;
        });
    }

    alert(content);
}
