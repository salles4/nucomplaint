import { writable } from "svelte/store";

export const sidebarLabel = writable(true)
export const auth = writable(localStorage.getItem("v0Auth"))
export const user_id = writable(localStorage.getItem("user_id"))