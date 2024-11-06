<script>
  import { ChevronUp, X } from "lucide-svelte";
  import { fade, fly } from "svelte/transition";
  import { supabase } from "../../supabase";
  import { onDestroy, onMount } from "svelte";
  import Loader from "../../lib/Loader.svelte";
  import { badge } from "../../customCss";

  export let appointment_id, closeDetails;
  let details;

  let currentStatus;
  let newStatusSelected;
  async function getDetails(){
    const {data, error} = await supabase
    .from("appointments")
    .select("*, primary_details!appointments_student_id_fkey(user_id, first_name, last_name)")
    .eq("appointment_id", appointment_id)
    .single()

    if(error){
      alert(error.message)
      return;
    }
    details = data

    currentStatus = data.status;
    newStatusSelected = data.status;
  }
  async function updateStatus() {
    if(newStatusSelected && currentStatus != newStatusSelected){
      const {error} = await supabase
      .from("appointments")
      .update({status: newStatusSelected})
      .eq("appointment_id", appointment_id)
      
      if(error){
        alert(error.message)
        console.error(error);
        return;
      }
    }
  }
  async function deleteAppointment() {
    const {error} = await supabase
    .from('appointments')
    .delete()
    .eq('appointment_id', appointment_id)

    if(error){
      alert(error.message)
      console.error(error);
      return;
    }
    closeDetails();
  }
  onMount(getDetails)
  onDestroy(updateStatus)
</script>
<div class="overflow-hidden absolute w-[100svw] h-[100svh] top-0 left-0">
  <button transition:fade class="bg-black/20 absolute w-[100svw] h-[100svh] top-0 left-0 cursor-default z-10" on:click={closeDetails}>
  </button>
  <div transition:fly={{ duration: 500, x: 1000 }} class="absolute h-[100svh] right-0 top-0 bg-white w-full md:w-[550px] rounded-s-2xl z-20 overflow-y-auto flex flex-col">
    <div class="p-6 pb-2 flex items-center justify-between">
      <h1 class="text-2xl font-bold">Complaint</h1>
      <button class="btn btn-ghost" on:click={closeDetails}>
        <X />
      </button>  
    </div>
    <hr>
    {#if details}
    <div class="px-6 flex-grow">
      <div class="row">
        <div class="name">Sender: </div>
        <div class="content">
          {details.primary_details.first_name} {details.primary_details.last_name}
          <div class="text-sm text-gray-600">
            <!-- {details.access_data.email} -->
          </div>
        </div>
      </div>
      <div class="row">
        <div class="name">Scheduled: </div>
        <div class="content">
          {new Date(details.time).toDateString()} - {new Date(details.time).toLocaleTimeString()}
        </div>
      </div>
      <div class="row">
        <div class="name">Reason: </div>
        <div class="content">
          {details.reason}
        </div>
      </div>
      <div class="row">
        <div class="name">Status: </div>
        <div class="content">
          <span class="badge {badge(details.status)}">{details.status}</span>
        </div>
      </div>
      <div class="row">
        <div class="name">Message: </div>
        <div class="content">
          {details.message}
        </div>
      </div>
    </div>
    <div class="sticky bottom-0 px-6 py-4 bg-white border-t-2 flex gap-2">
      <button class="btn btn-sm btn-primary">
        Reply
      </button>
      <button class="btn btn-sm btn-error btn-outline" on:click={() => deleteAppointment()}>
        Delete
      </button>
      <div class="ms-auto">
        Status:
        <select class="select-success px-2 min-w-fit max-w-xs select-sm" name="status" id="status" bind:value={newStatusSelected}>
          <option value="Scheduled">Scheduled</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Done">Done</option>
          <option value="Archive">Archive</option>
        </select> 
      </div>
    </div>
    {:else}
    <Loader />
    {/if}
    
  </div>  
</div>

<style>
    .row .name {
      width: 30%;
      flex: 0 0 auto;
    }
    .row .content {
      width: 70%;
      flex: 0 0 auto;
    }
 
  .row{
    margin: 0.5rem 0;
  }
  .row .name{
    font-weight: 600;
  }
  /* li button:hover{
    background-color: rgba(0, 0, 0, 0.123);
  } */
</style>