import { state } from "../core/state.js";

export function openWeek(id) {

    const week = state.weeks.find(w => w.id === id);
    const modal = document.getElementById("modal");
    const body = document.getElementById("modal-body");

    if (!week) return;

    let html = `<h2>📅 ${week.title}</h2><ul>`;

    if (week.lessons.length === 0) {
        html += "<li>لا توجد دروس</li>";
    } else {
        week.lessons.forEach(l => {
            html += `<li>${l.completed ? "✔" : "❌"} ${l.title}</li>`;
        });
    }

    html += "</ul>";

    body.innerHTML = html;
    modal.classList.remove("hidden");
}

window.closeModal = function () {
    document.getElementById("modal").classList.add("hidden");
};
