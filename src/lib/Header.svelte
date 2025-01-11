<script>
  import { auth} from "../store";
  import logo from '../assets/NU_shield.svg'
  import { Bell, Power } from "lucide-svelte";
  import { signOut } from "firebase/auth";
  import { firebaseAuth } from "../firebase";
  import RightModal from "./RightModal.svelte";
  import {user_id} from '../store'

  let notificationOpen = false;

  function logout() {
    auth.set(null);
    localStorage.removeItem("v0Auth");
    signOut(firebaseAuth)
  }
</script>

<div
  class="bg-nu-blue w-full flex justify-between items-center py-2 px-6 sm:p-6 gap-2 text-white print:hidden"
>
  <img
    src={logo}
    alt="nu logo"
    class="h-12 ms-10 sm:m-0"
  />
  <div class="flex gap-2">
    <button on:click={() => {notificationOpen = true}}>
      <Bell />
    </button>
    <button on:click={logout}>
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
  
  </RightModal>
{/if}