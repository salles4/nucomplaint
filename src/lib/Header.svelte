<script>
  import { auth} from "../store";
  import logo from '../assets/NU_shield.svg'
  import { Bell, MessageSquareMore, Power, X } from "lucide-svelte";
  import { signOut } from "firebase/auth";
  import { firebaseAuth } from "../firebase";
  import RightModal from "./RightModal.svelte";
  import {user_id} from '../store'
  import { supabase } from "../supabase";
  import { onMount } from "svelte";
  import { push } from 'svelte-spa-router'
  import { slide } from "svelte/transition";

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

<div class="hidden print:flex flex-col mt-3 justify-center items-center">
  <div class="flex gap-2 items-center font-bold text-xl">
    <img
       src={logo}
       alt="nu logo"
       class="h-12 ms-10 sm:m-0"
     /><span>NU Complaint</span>
  </div>
  <div class="font-bold">Complaint Reports</div>
  <div>Printed by: {$user_id}</div>
</div>

{#if notificationOpen}
  <RightModal title="Notifications" closeDetails={() => notificationOpen = false}>
  {#each notificationList as notif}
    <div class="flex m-4 p-2 border-2 rounded items-center" transition:slide>
      <div class="px-4 h-full border-e flex items-center"><MessageSquareMore size=32 /></div>
      <div class="flex-col flex-1 px-4">
        <div class="">{notif.message}</div>
        <button on:click={()=> {
            push(`/complaints/${notif.related_id}`)
          }}>View Details</button>
      </div>
      <button class="px-2 h-full border-s" on:click={() => deleteNotif(notif.notification_id)}><X /></button>
    </div>
  {/each}
  </RightModal>
{/if}
