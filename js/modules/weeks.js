import { state } from "../core/state.js";
import { createWeekCard } from "../components/weekCard.js";
import { openWeek } from "./weekDetails.js";

export function renderWeeks() {

    const container = document.getElementById("weeks-container");

    if (!container) return;

    container.innerHTML = "";

    state.weeks.forEach(week => {

        const card = createWeekCard(week);

        card.addEventListener("click", () => {
            openWeek(week.id);
        });

        container.appendChild(card);

    });

    console.log("Weeks rendered ✔");
}
