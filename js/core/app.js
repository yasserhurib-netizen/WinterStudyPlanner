import { loadData } from "./data.js";
import { renderWeeks } from "../modules/weeks.js";

async function init() {

    await loadData();

    renderWeeks();

    updateDashboard();

    console.log("Winter Study Planner Started 🚀");

}

function updateDashboard(){

    const weeks = window.state?.weeks || [];

    const weeksCount =
        document.getElementById("weeks-count");

    if(weeksCount){

        weeksCount.textContent = weeks.length;

    }

    let lessons = 0;

    let completed = 0;

    weeks.forEach(week=>{

        if(!week.lessons) return;

        lessons += week.lessons.length;

        week.lessons.forEach(l=>{

            if(l.completed) completed++;

        });

    });

    const lessonsCount =
        document.getElementById("lessons-count");

    if(lessonsCount){

        lessonsCount.textContent = lessons;

    }

    const testsCount =
        document.getElementById("tests-count");

    if(testsCount){

        testsCount.textContent = "--";

    }

    const percent =
        lessons===0
        ?0
        :Math.round(completed/lessons*100);

    document.getElementById("progress-percent").textContent =
        percent+"%";

    document.getElementById("progress-text").textContent =
        percent+"%";

    document.getElementById("progress-bar").style.width =
        percent+"%";

}

document.addEventListener(
    "DOMContentLoaded",
    init
);
