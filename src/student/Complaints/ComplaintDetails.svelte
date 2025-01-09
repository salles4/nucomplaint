<script>
  import { ArrowLeftCircle, X } from "lucide-svelte";
  import { fade, fly } from "svelte/transition";
  import { supabase } from "../../supabase";
  import { onMount } from "svelte";
  import Loader from "../../lib/Loader.svelte";
  import {badge} from "../../customCss"
  import {pop} from "svelte-spa-router";

  export let complaint_id;
  let details;
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
  }
  onMount(getDetails)
</script>

  <div  class="bg-white h-full w-full md:w-[550px] rounded-s-2xl overflow-y-auto flex flex-col">
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
    </div>
    <div class="sticky bottom-0 p-4 bg-white border-t-2">
      <button class="btn btn-sm btn-error">
        Delete
      </button>
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