<script>
  import { ArrowLeftCircle, Circle, Printer, X } from "lucide-svelte";
  import { fade, fly } from "svelte/transition";
  import { supabase } from "../../supabase";
  import { onMount } from "svelte";
  import Loader from "../../lib/Loader.svelte";
  import {badge} from "../../customCss"
  import {pop, replace} from "svelte-spa-router";
  import { user_id } from "../../store";
  import moment from "moment";
  import { generateQRByID } from "../../scanner";

  export let details;
  let timelineData = []
  async function getTimeline() {
        const {data:timeline, error:timelineError} = await supabase
    .from("status_updates")
    .select("*")
    .order('created_at', {ascending: false})
    .eq("complaint_id", details.complaint_id)

    if(timelineError){
      alert("cant load timeline")
      console.error(timelineError);
      return;
    }
    timelineData = timeline
    generatedQR()
  }
  function generatedQR (){
    generateQRByID(`https://www.nucomplaint.xyz/#/complaints?id=${details.complaint_id}`, "qrOffense")
  }
  onMount(getTimeline)
</script>

  <div  class="bg-white h-full w-full rounded-s-2xl overflow-y-auto flex flex-col">
    <div class="p-6 pb-2 flex items-center justify-start gap-2">
      <button on:click={pop} ><ArrowLeftCircle /></button>
      <h1 class="text-2xl font-bold">Complaint</h1>
    </div>
    <hr>
    <div class="px-6 flex-grow">
      {#if details}
      <div class="row">
        <div class="name">Sender: </div>
        <div class="content">
          {details.sender_id.first_name} {details.sender_id.last_name}
          <div class="text-sm text-gray-600">
            {details.sender_id.email}
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
      {:else}
      <Loader />
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
              Complaint Created
              <div class="text-gray-400 text-sm font-light">{moment(details.sent_date).format("MMM DD, YYYY - hh:mm a")}</div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="sticky bottom-0 p-4 bg-white border-t-2 print:hidden">
      <button class="btn btn-sm btn-primary" on:click={()=> print()}><Printer size=20 /> Print</button>
      <!-- <button class="btn btn-sm btn-error">
        Delete
      </button> -->
    </div>
    
  </div>  


<style>
  @media (min-width: 768px) {
    .row .name {
      width: 30%;
      flex: 0 0 auto;
    }
    .row .content {
      width: 70%;
      flex: 0 0 auto;
    }
  }
  .row{
    margin: 0.5rem 0;
  }
  .row .name{
    font-weight: 600;
  }
</style>