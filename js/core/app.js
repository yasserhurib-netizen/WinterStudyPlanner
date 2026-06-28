import { loadData } from "./data.js";
import { renderWeeks } from "../modules/weeks.js";

async function init() {
    await loadData();   // لازم ننتظر البيانات
    renderWeeks();      // بعدها نرسم UI

    console.log("App Started 🚀");
}

document.addEventListener("DOMContentLoaded", init);
