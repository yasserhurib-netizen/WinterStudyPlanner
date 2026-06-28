import { loadData } from "./data.js";
import { renderWeeks } from "../modules/weeks.js";

document.addEventListener("DOMContentLoaded", async () => {
    await loadData();
    renderWeeks();

    console.log("App Started 🚀");
});
