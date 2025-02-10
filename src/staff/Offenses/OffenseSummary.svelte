<script>
  import { ChevronUp, Printer, X } from "lucide-svelte";
  import { fade, fly } from "svelte/transition";
  import { supabase } from "../../supabase";
  import { onDestroy, onMount } from "svelte";
  import Loader from "../../lib/Loader.svelte";
  import { badge } from "../../customCss";
  import moment from "moment";
  import RightModal from "../../lib/RightModal.svelte";
  import { modal, user_id, user_name } from "../../store";
  import { addNotification } from "../../lib/addNotif";
  import { replace } from 'svelte-spa-router'
  import { generateQRByID } from "../../scanner";

  export let offense_id, closeDetails;
  let details;
  let currentStatus;
  let newStatusSelected;
  async function getDetails(){
    const {data, error} = await supabase
    .from("offenses")
    .select("*, student_id(user_id, first_name, last_name)")
    .eq("offense_id", offense_id)
    .single()

    if(error){
      alert(error.message)
      return;
    }
    
    details = data

    currentStatus = data.status;
    newStatusSelected = data.status;
    generatedQR()
  }
  function generatedQR (){
    generateQRByID(`https://www.nucomplaint.xyz/#/offenses?id=${offense_id}`, "qrOffense")
  }
  async function updateStatus() {
    if(newStatusSelected && currentStatus != newStatusSelected){
      const {error} = await supabase
      .from("offenses")
      .update({status: newStatusSelected})
      .eq("offense_id", offense_id)
      
      if(error){
        alert(error.message)
        console.error(error);
        return;
      }
      addNotification(
        details.sender_id.user_id,
        "offense status",
        `The status of your offense about **${details.violation}** has been updated from <span class="badge ${badge(currentStatus)}">${currentStatus}</span> to <span class="badge ${badge(newStatusSelected)}">${newStatusSelected}</span>`,
        offense_id
      )
    }
  }
  async function deleteOffense() {
    const {error} = await supabase
    .from('offenses')
    .delete()
    .eq('offense_id', offense_id)

    if(error){
      alert(error.message)
      console.error(error);
      return;
    }
    closeDetails();
  }
  function openDeleteModal(){
    modal.set({
      title: "Delete?",
      description: "Are you sure you want to delete this?",
      pOption: "Confirm",
      sOption: "Cancel",
      primaryFn: () => {deleteOffense(); modal.set(null);}
    })
  }
  onMount(getDetails)
  onDestroy(updateStatus)
  
</script>

<RightModal title="Offense Details" {closeDetails}>
    {#if details}
    <div class="px-6 flex-grow print:flex-grow-0">
      <div class="row">
        <div class="name">Student Name: </div>
        <div class="content">
          {details.student_id.first_name} {details.student_id.last_name}
          <div class="text-sm text-gray-600">
            <!-- {details.access_data.email} -->
          </div>
        </div>
      </div>
      <div class="row">
        <div class="name">Status: </div>
        <div class="content">
          <span class="badge print:badge-neutral {badge(details.status)}">{details.status}</span>
        </div>
      </div>
      <div class="row">
        <div class="name">Category: </div>
        <div class="content">
          {details.category}
        </div>
      </div>
      <div class="row">
        <div class="name">Violation: </div>
        <div class="content">
          {details.violation}
        </div>
      </div>
      <div class="row">
        <div class="name">Time Reported: </div>
        <div class="content">
          {moment(details.time_created).format("ddd - MMM DD, YYYY - hh:mm a")}
        </div>
      </div>
      <div class="row">
        <div class="name">Valid Until: </div>
        <div class="content">
          {moment(details.valid_until).format("ddd - MMM DD, YYYY - hh:mm a")}
        </div>
      </div>
      {#if details.notes}
      <div class="row">
        <div class="name">Note: </div>
        <div class="content">
          {details.notes}
        </div>
      </div>
      {/if}
    </div>
    <div class="sticky print:hidden bottom-0 px-6 py-4 bg-white border-t-2 flex gap-2">
      <a href="./#/offense/{offense_id}" class="btn btn-sm btn-primary">
        Reply
      </a>
      <button class="btn btn-sm btn-primary" on:click={()=> print()}><Printer size=20 /> Print Slip</button>
      <button class="btn btn-sm btn-error btn-outline" on:click={() => openDeleteModal()}>
        Delete
      </button>
      <div class="ms-auto">
        Status:
        <select class=" px-2 min-w-fit max-w-xs select-sm" name="status" id="status" bind:value={newStatusSelected}>
          <option value="Reported">Reported</option>
          <option value="Investigating">Investigating</option>
          <option value="Guilty">Guilty</option>
          <option value="Dismissed">Dismissed</option>
          <option value="Archive">Archive</option>
        </select> 
      </div>
    </div>
    {:else}
    <Loader />
    {/if}
    <div class="hidden print:block">
      <canvas
      id="qrOffense"
      class="w-[120px] mx-auto"
      ></canvas>
      <div class="text-xs text-center">Generated by: {$user_name}</div>
    </div>
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