<script>
  import { X } from "lucide-svelte";
  import { fade, fly } from "svelte/transition";
  import { supabase } from "../../supabase";
  import { onMount } from "svelte";
  import Loader from "../../lib/Loader.svelte";

  export let complaint_id;
  let details;
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
  }
  onMount(getDetails)
</script>
<div class="overflow-hidden absolute w-[100svw] h-[100svh] top-0 left-0">
  <button transition:fade class="bg-black/20 absolute w-[100svw] h-[100svh] top-0 left-0 cursor-default z-10" on:click>
  </button>
  <div transition:fly={{ duration: 500, x: 1000 }} class="absolute h-[100svh] right-0 top-0 bg-white w-full md:w-[550px] rounded-s-2xl z-20 overflow-y-auto flex flex-col">
    <div class="p-6 pb-2 flex items-center justify-between">
      <h1 class="text-2xl font-bold">Complaint</h1>
      <button class="btn btn-ghost" on:click>
        <X />
      </button>  
    </div>
    <hr>
    <div class="px-6 flex-grow">
      {#if details}
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
      {:else}
      <Loader />
      {/if}
    </div>
    <div class="sticky bottom-0 p-4 bg-white border-t-2">
      <button class="btn btn-sm btn-primary">
        Reply
      </button>
      <button class="btn btn-sm btn-error">
        Delete
      </button>
    </div>
    
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