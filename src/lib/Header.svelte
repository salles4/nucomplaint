<script>
  import { auth, user_name} from "../store";
  import logo from '../assets/NU_shield.svg'
  import { Bell, MessageSquareMore, Power, X } from "lucide-svelte";
  import { signOut } from "firebase/auth";
  import { firebaseAuth } from "../firebase";
  import RightModal from "./RightModal.svelte";
  import {user_id} from '../store'
  import { supabase } from "../supabase";
  import { onMount } from "svelte";
  import { push, replace } from 'svelte-spa-router'
  import { slide } from "svelte/transition";
  import NotificationItem from "./NotificationItem.svelte";
  import notif from '../assets/notif.wav'
  import moment from "moment";
  let notificationOpen = false;
  let notificationList = [];
  function logout() {
    auth.set(null);
    localStorage.removeItem("v0Auth");
    signOut(firebaseAuth)
  }
  const getNotifications = async () => {
    const {data, error} = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", $user_id)
    .order('time_created', {ascending: false})

    if(error){
      console.error(error);
      return;
    }
    notificationList = data
  }
  const deleteNotif = async (notif_id) => {
    const {error} = await supabase
    .from("notifications")
    .delete()
    .eq("notification_id", notif_id)
    if(error){
      console.error(error);
    }
  }
  supabase
  .channel("notifications")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "notifications" },
    (payload) => {
      console.log("Realtime Update", payload);
      if((payload.eventType == "INSERT" || payload.eventType == "UPDATE") && payload.new.user_id == $user_id){
        let notifSound = new Audio(notif)
        notifSound.volume = 0.8
        notifSound.play();
      }
      getNotifications();
    }
  )
  .subscribe();
  
  onMount(getNotifications);
</script>

<div
  class="bg-nu-blue w-full flex justify-between items-center py-2 px-6 sm:p-6 gap-2 text-white print:hidden"
>
  <img
    src={logo}
    alt="nu logo"
    class="h-12 ms-10 sm:m-0"
  />
  <div class="flex gap-4">
    <div class="indicator">
      <span class="indicator-item badge-sm font-bold badge badge-secondary">{notificationList.length}</span>
      <button class="btn btn-ghost btn-xs" on:click={() => {notificationOpen = true}}>
        <Bell />
      </button>
    </div>
    <button class="btn btn-ghost btn-xs" on:click={logout}>
      <Power />
    </button>
  </div>
</div>

<div class="print:block hidden">
  <img class="m-auto h-12 object-contain " src="./img/nu_logo.png" alt="National University Logo">
  <div class="text-xs text-center pt-3">{$user_name} ({$user_id.toString().substring(0, 4)}-{$user_id.toString().slice(4)})</div>
  <div class="text-xs text-center pb-4">{moment().format("MM/DD/YYYY hh:mma")}</div>
</div>

{#if notificationOpen}
  <RightModal title="Notifications" closeDetails={() => notificationOpen = false}>
    {#if notificationList.length == 0}
      <div class="text-center p-4">You got zero notification</div>
    {/if}
  {#each notificationList as notif}
    <NotificationItem {notif} {deleteNotif} />
  {/each}
  </RightModal>
{/if}
