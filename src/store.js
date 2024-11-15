import { writable } from "svelte/store";

export const sidebarLabel = writable(true)
export const auth = writable(localStorage.getItem("v0Auth") || undefined)
export const user_id = writable(localStorage.getItem("user_id"))
export const user_details = writable(null)
export const firebase_uid = writable()