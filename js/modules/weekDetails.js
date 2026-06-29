import { state } from "../core/state.js";

export function openWeek(id) {

    const week = state.weeks.find(w => w.id === id);

    if (!week) return;

    const modal = document.getElementById("modal");
    const body = document.getElementById("modal-body");

    let html = `<h2>📅 ${week.title}</h2>`;

    if (!week.lessons || week.lessons.length === 0) {

        html += `<p>لا توجد دروس.</p>`;

    } else {

     html += "<ul>";

week.lessons.forEach((lesson, index) => {

    html += `
        <li>
            <label>
                <input
                    type="checkbox"
                    ${lesson.completed ? "checked" : ""}
                    onchange="toggleLesson(${week.id}, ${index})"
                >
                ${lesson.title}
            </label>
        </li>
    `;

});

html += "</ul>"; 
    }

    body.innerHTML = html;

    modal.classList.remove("hidden");
}

window.closeModal = function () {
    document.getElementById("modal").classList.add("hidden");
};
