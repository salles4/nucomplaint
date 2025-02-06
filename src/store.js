import { writable } from "svelte/store";

export const sidebarLabel = writable(false)
export const modal = writable(null);
export const auth = writable(localStorage.getItem("v0Auth") || undefined)
export const user_id = writable(localStorage.getItem("user_id"))
export const user_name = writable("")
export const user_details = writable(null)
export const firebase_uid = writable()