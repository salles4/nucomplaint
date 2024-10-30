<script>
  import { ChevronUp, X } from "lucide-svelte";
  import { fade, fly } from "svelte/transition";
  import { supabase } from "../../supabase";
  import { onDestroy, onMount } from "svelte";
  import Loader from "../../lib/Loader.svelte";

  export let complaint_id, closeDetails;
  let details;

  let currentStatus;
  let newStatusSelected;
  async function getDetails(){
    const {data, error} = await supabase
    .from("complaints")
    .select("*, primary_details(first_name, last_name), access_data(email)")
    .eq("complaint_id", complaint_id)
    .single()

    if(error){
      alert(error.message)
      return;
    }
    details = data
    if(data.status == "Unread"){
      const {error} = await supabase
      .from("complaints")
      .update({status: "Read"})
      .eq("complaint_id", complaint_id)
      
      if(error){
        alert(error)
        console.error(error);
        return;
      }
      getDetails()
      return;
    }
    currentStatus = data.status;
    newStatusSelected = data.status;
  }
  async function updateStatus() {
    if(newStatusSelected && currentStatus != newStatusSelected){
      console.log("run", `cur${currentStatus}`, newStatusSelected)
      const {error} = await supabase
      .from("complaints")
      .update({status: newStatusSelected})
      .eq("complaint_id", complaint_id)
      
      if(error){
        alert(error)
        console.error(error);
        return;
      }
    }
  }
  async function deleteComplaint() {
    const {error} = await supabase
    .from('complaints')
    .delete()
    .eq('complaint_id', complaint_id)

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
            {details.access_data.email}
          </div>
        </div>
      </div>
      <div class="row">
        <div class="name">Date Sent: </div>
        <div class="content">
          {new Date(details.sent_date).toDateString()} - {new Date(details.sent_date).toLocaleTimeString()}
        </div>
      </div>
      <div class="row">
        <div class="name">Type: </div>
        <div class="content">
          {details.type}
        </div>
      </div>
      <div class="row">
        <div class="name">Status: </div>
        <div class="content">
          <span class="badge {status == "Unread" ? "badge-neutral" : "badge-success badge-outline"}">{details.status}</span>
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
      <button class="btn btn-sm btn-error btn-outline" on:click={() => deleteComplaint()}>
        Delete
      </button>
      <div class="ms-auto">
        Status:
        <select class="select-success px-2 min-w-fit max-w-xs select-sm" name="status" id="status" bind:value={newStatusSelected}>
          <option value="Read">Read</option>
          <option value="Unread">Unread</option>
          <option value="Unsettled">Unsettled</option>
          <option value="Settled">Settled</option>
          <option value="Archive">Archive</option>
        </select> 
        <!-- <details class="dropdown dropdown-top dropdown-end ms-2">
          <summary class="btn btn-sm btn-success btn-outline" >{newStatusSelected || details.status} <ChevronUp /> </summary>
          <ul class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow-2xl text-black">
            <li><button data-condition="Unsettled">Unsettled</button></li>
            <li><button data-condition="Settled">Settled</button></li>
            <li><button data-condition="Archive">Archive</button></li>
          </ul>
        </details> -->
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