import { state } from "../core/state.js";

export function openWeek(id){

    const week = state.weeks.find(w => w.id === id);

    if(!week) return;

    const modal = document.getElementById("modal");
    const body = document.getElementById("modal-body");

    let html = `
        <h2>${week.title}</h2>
        <table class="lesson-table">
            <thead>
                <tr>
                    <th>الحالة</th>
                    <th>الدرس</th>
                </tr>
            </thead>
            <tbody>
    `;

    if(week.lessons && week.lessons.length){

        week.lessons.forEach((lesson,index)=>{

            html += `
                <tr>
                    <td>
                        <input
                            type="checkbox"
                            ${lesson.completed ? "checked" : ""}
                            onchange="toggleLesson(${week.id},${index})"
                        >
                    </td>

                    <td>${lesson.title}</td>
                </tr>
            `;

        });

    }else{

        html += `
            <tr>
                <td colspan="2">
                    لا توجد دروس
                </td>
            </tr>
        `;

    }

    html += `
            </tbody>
        </table>
    `;

    body.innerHTML = html;

    modal.classList.remove("hidden");

}

window.closeModal = function(){

    document
        .getElementById("modal")
        .classList.add("hidden");

};

window.toggleLesson = function(weekId,lessonIndex){

    console.log(
        "Week:",
        weekId,
        "Lesson:",
        lessonIndex
    );

};
