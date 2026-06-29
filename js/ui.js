// ===============================
// UI CONTROLLER
// ===============================

const weekSelect = document.getElementById("weekSelect");
const body = document.getElementById("scheduleBody");
const title = document.getElementById("weekTitle");
const dates = document.getElementById("weekDates");

// -------------------------------
// Load weeks into dropdown
// -------------------------------
function initWeeks() {
    weekSelect.innerHTML = "";

    SCHEDULE.forEach(w => {
        const option = document.createElement("option");
        option.value = w.week;
        option.textContent = `${w.name}`;
        weekSelect.appendChild(option);
    });

    weekSelect.addEventListener("change", () => {
        renderWeek(parseInt(weekSelect.value));
    });

    // default load first week
    renderWeek(SCHEDULE[0].week);
}

// -------------------------------
// Render selected week
// -------------------------------
function renderWeek(weekNumber) {

    const week = SCHEDULE.find(w => w.week === weekNumber);
    if (!week) return;

    title.textContent = week.name;
    dates.textContent = week.dates;

    body.innerHTML = "";

    week.days.forEach(day => {
        day.lessons.forEach(lesson => {

            const subject = SUBJECTS[lesson.subject];

            const row = `
                <tr>
                    <td>${day.day}</td>
                    <td>
                        <span style="color:${subject.color}">
                            ${subject.icon} ${subject.name}
                        </span>
                    </td>
                    <td>${lesson.title}</td>
                    <td>${lesson.description}</td>
                </tr>
            `;

            body.innerHTML += row;
        });
    });
}

// -------------------------------
// INIT
// -------------------------------
initWeeks();
