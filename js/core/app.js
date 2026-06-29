import { loadData } from "./data.js";
import { renderWeeks } from "../modules/weeks.js";

async function init() {

    await loadData();

    renderWeeks();

    if (window.state.weeks.length) {
        window.openWeek(window.state.weeks[0].id);
    }

}

document.addEventListener("DOMContentLoaded", init);
