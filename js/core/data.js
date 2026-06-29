import { state } from "./state.js";

export async function loadData(){

    const response = await fetch("data/plan.json");

    const data = await response.json();

    state.weeks = data.weeks || [];

    state.tests = data.tests || [];

    state.settings = data.settings || {};

    console.log("Data Loaded ✔");

}
