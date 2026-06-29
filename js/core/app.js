let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function save() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
    let input = document.getElementById("taskInput");
    if (!input.value) return;

    tasks.push({
        text: input.value,
        status: "pending"
    });

    input.value = "";
    save();
    render();
}

function toggleStatus(index) {
    tasks[index].status =
        tasks[index].status === "done" ? "pending" : "done";

    save();
    render();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    save();
    render();
}

function render() {
    let table = document.getElementById("taskTable");
    table.innerHTML = "";

    let done = 0;

    tasks.forEach((t, i) => {

        if (t.status === "done") done++;

        table.innerHTML += `
            <tr>
                <td>${t.text}</td>
                <td>${t.status}</td>
                <td>
                    <button onclick="toggleStatus(${i})">Toggle</button>
                    <button onclick="deleteTask(${i})">Delete</button>
                </td>
            </tr>
        `;
    });

    document.getElementById("total").innerText = tasks.length;
    document.getElementById("done").innerText = done;
    document.getElementById("pending").innerText = tasks.length - done;
    document.getElementById("progress").innerText =
        tasks.length ? Math.round((done / tasks.length) * 100) + "%" : "0%";
}

render();
