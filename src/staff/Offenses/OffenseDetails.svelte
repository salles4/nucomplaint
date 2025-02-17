<script>
  import { ChevronUp, Circle, Printer, X } from "lucide-svelte";
  import { fade, fly } from "svelte/transition";
  import { supabase } from "../../supabase";
  import { onDestroy, onMount } from "svelte";
  import Loader from "../../lib/Loader.svelte";
  import { badge } from "../../customCss";
  import moment from "moment";
  import {pop} from 'svelte-spa-router'
  import { addNotification } from "../../lib/addNotif";
  import { generateQRByID } from "../../scanner";

  export let offense_id;
  export let details;
  let currentStatus = details.status;
  let newStatusSelected = details.status;

  let timelineData = []
    async function getTimeline() {
    
    const {data:timeline, error:timelineError} = await supabase
    .from("status_updates")
    .select("*")
    .order('created_at', {ascending: false})
    .eq("offense_id", offense_id)

    if(timelineError){
      alert("cant load timeline")
      console.error(timelineError);
      return;
    }
    timelineData = timeline

  generatedQR()
  }
  function generatedQR (){
    generateQRByID(`https://www.nucomplaint.xyz/#/offenses?id=${offense_id}`, "qrOffense")
  }
  onMount(getTimeline)

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
        details.student_id.user_id,
        "offense status",
        `The status of your offense about **${details.violation}** has been updated from <span class="badge ${badge(currentStatus)}">${currentStatus}</span> to <span class="badge ${badge(newStatusSelected)}">${newStatusSelected}</span>`,
        offense_id
      )
    }
  }
  async function deleteAppointment() {
    const {error} = await supabase
    .from('offenses')
    .delete()
    .eq('offense_id', offense_id)

    if(error){
      alert(error.message)
      console.error(error);
      return;
    }
    pop()
  }
  
  onDestroy(updateStatus)
</script>

<div class="p-6 pb-2 flex items-center justify-between">
  <h1 class="text-2xl font-bold">Offense Details</h1> 
</div>
<hr>

{#if details}
<div class="px-6 flex-grow">
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
      <span class="badge {badge(details.status)}">{details.status}</span>
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
        <!------------------------------------------- Timeline------------------------------------------- -->
      <hr>
      <div class="text-center font-bold text-lg my-2">Updates</div>
      <ul class="timeline timeline-vertical timeline-compact timeline-snap-icon">
        {#each timelineData as data,index}
        <li>
          {#if index != 0}
            <hr>
          {/if}
          <div class="timeline-middle"><Circle fill="black" /></div>
          <div class="timeline-end">
            <div class="font-bold">
              {data.title}
              <div class="text-gray-400 text-sm font-light">{moment(data.time_created).format("MMM DD, YYYY - hh:mm a")}</div>
            </div>
            {data.description}
            <br><br>
          </div>
          <hr />
        </li>
        {/each}
        <li>
        <hr />
          <div class="timeline-middle"><Circle fill="black" /></div>
          <div class="timeline-end">
            <div class="font-bold">
              Offense Created
              <div class="text-gray-400 text-sm font-light">{moment(details.time_created).format("MMM DD, YYYY - hh:mm a")}</div>
            </div>
          </div>
        </li>
      </ul>
</div>
<div class="sticky bottom-0 px-6 py-4 bg-white border-t-2 flex gap-2 print:hidden">
  <button class="btn btn-sm btn-error btn-outline" on:click={() => deleteAppointment()}>
    Delete
  </button>
  <button class="btn btn-sm btn-primary" on:click={()=> print()}><Printer size=20 /> Print</button>
      <a href="./#/offense/status/{offense_id}" class="btn btn-sm btn-primary ms-auto">Change Status</a>
  
  <!-- <div class="ms-auto">
    Status:
    <select class="select-success px-2 min-w-fit max-w-xs select-sm" name="status" id="status" bind:value={newStatusSelected}>
      <option value="Reported">Reported</option>
      <option value="Processing">Processing</option>
      <option value="Guilty">Guilty</option>
      <option value="Dismissed">Dismissed</option>
      <option value="Archive">Archive</option>
    </select> 
  </div> -->
</div>
{:else}
<Loader />
{/if}


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