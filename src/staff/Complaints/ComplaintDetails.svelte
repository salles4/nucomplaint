<script>
  import { onDestroy, onMount } from "svelte";
  import ComplaintsDetails from "./ComplaintSummary.svelte";
  import { supabase } from "../../supabase";
  import { badge } from "../../customCss";
  import Loader from "../../lib/Loader.svelte";
  import { pop } from "svelte-spa-router";
  import { ArrowLeftCircle, Circle, Printer } from "lucide-svelte";
  import { modal } from "../../store";
  import { addNotification } from "../../lib/addNotif";
  import moment from "moment";
  import { generateQRByID } from "../../scanner";
  export let complaint_id
  export let details;
  let timelineData = []
  let currentStatus;
  let newStatusSelected;
  async function getDetails(){

    const {data:timeline, error:timelineError} = await supabase
    .from("status_updates")
    .select("*")
    .order('created_at', {ascending: false})
    .eq("complaint_id", complaint_id)

    if(timelineError){
      alert("cant load timeline")
      console.error(timelineError);
      return;
    }
    timelineData = timeline


    if(details.status == "Unread"){
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
    currentStatus = details.status;
    newStatusSelected = details.status;
  generatedQR()
  }
  function generatedQR (){
    generateQRByID(`https://www.nucomplaint.xyz/#/complaints?id=${complaint_id}`, "qrOffense")
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
      addNotification(
        details.sender_id.user_id,
        "complaint status",
        `The status of your complaint about **${details.type}** has been updated from <span class="badge ${badge(currentStatus)}">${currentStatus}</span> to <span class="badge ${badge(newStatusSelected)}">${newStatusSelected}</span>`,
        complaint_id
      )
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
  }
  function openDeleteModal(){
    modal.set({
      title: "Delete?",
      description: "Are you sure you want to delete this?",
      pOption: "Confirm",
      sOption: "Cancel",
      primaryFn: () => {deleteComplaint(); modal.set(null);}
    })
  }
  onMount(getDetails)
  onDestroy(updateStatus)
</script>
<div class="p-6 pb-2 flex items-center justify-start gap-2">
  <!-- <button on:click={pop}><ArrowLeftCircle /></button> -->
  <h1 class="text-2xl font-bold">Complaint</h1>
</div>
<hr>
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
  <button class="btn btn-sm btn-error btn-outline" on:click={() => openDeleteModal()}>
    Delete
  </button>
  <button class="btn btn-sm btn-primary" on:click={()=> print()}><Printer size=20 /> Print</button>
      <a href="./#/complaint/status/{complaint_id}" class="btn btn-sm btn-primary ms-auto">Change Status</a>

  <!-- <div class="ms-auto">
    Status:
    <select class="select-success px-2 min-w-fit max-w-xs select-sm" name="status" id="status" bind:value={newStatusSelected}>
      <option value="Unsettled">Unsettled</option>
      <option value="Settled">Settled</option>
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
</style>