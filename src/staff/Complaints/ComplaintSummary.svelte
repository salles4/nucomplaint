<script>
  import { ChevronUp, X } from "lucide-svelte";
  import { fade, fly } from "svelte/transition";
  import { supabase } from "../../supabase";
  import { onDestroy, onMount } from "svelte";
  import Loader from "../../lib/Loader.svelte";
  import { badge } from "../../customCss";
  import RightModal from "../../lib/RightModal.svelte";

  export let complaint_id, closeDetails = null;
  let details;

  let currentStatus;
  let newStatusSelected;
  async function getDetails(){
    const {data, error} = await supabase
    .from("complaints")
    .select("*, sender_id(*)")
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
      .update({status: "Unsettled"})
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

<RightModal title="Complaint Details" {closeDetails}>
    
    {#if details}
    <div class="px-6 flex-grow">
      <div class="row">
        <div class="name">Sender: </div>
        <div class="content">
          {details.sender_id.first_name} {details.sender_id.last_name}
          <div class="text-sm text-gray-600">
            {details.sender_id.email} - {details.sender_id.user_id}
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
      <a href="./#/complaint/{complaint_id}" class="btn btn-sm btn-primary">
        Reply
      </a>
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
      </div>
    </div>
    {:else}
    <Loader />
    {/if}

</RightModal>

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