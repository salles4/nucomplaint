import { writable } from "svelte/store";

export const sidebarLabel = writable(true)
export const auth = writable(localStorage.getItem("v0Auth" || "staff"))