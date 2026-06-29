export function createWeekCard(week) {

    const card = document.createElement("div");

    card.className = "card";

    card.innerHTML = `
        <h3>${week.title}</h3>

        <p>التقدم ${week.progress}%</p>

        <div class="progress">
            <div style="width:${week.progress}%"></div>
        </div>
    `;

    return card;
}
