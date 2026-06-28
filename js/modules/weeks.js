import { state } from "../core/state.js";

export function renderWeeks() {
    const container = document.getElementById("weeks-container");

    if (!container) return;

    container.innerHTML = "";

    state.weeks.forEach(week => {

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <h3>📅 ${week.title}</h3>
            <p>التقدم: ${week.progress}%</p>
            <div class="progress">
                <div style="width:${week.progress}%"></div>
            </div>
        `;

        container.appendChild(card);
    });

    console.log("Weeks rendered ✔");
}
