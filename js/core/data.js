import { state } from "./state.js";

export async function loadData() {
    const res = await fetch("./data/plan.json");
    const data = await res.json();

    state.weeks = data.weeks;
    state.meta = data.meta;

    console.log("Data Loaded", state);
}