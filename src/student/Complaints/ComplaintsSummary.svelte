<script>
  import { X } from "lucide-svelte";
  import { fade, fly } from "svelte/transition";
  import { supabase } from "../../supabase";
  import { onMount } from "svelte";
  import Loader from "../../lib/Loader.svelte";
  import {badge} from "../../customCss"
  import RightModal from "../../lib/RightModal.svelte";

  export let complaint_id, closeDetails;
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
<RightModal title="Complaint Details" {closeDetails}>

    {#if details}
    <div class="px-6 flex-grow">
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
    </div>
    <div class="sticky bottom-0 p-4 bg-white border-t-2">
      <a href="./#/complaint/{complaint_id}" class="btn btn-sm btn-primary">
        Reply
      </a>
      <button class="btn btn-sm btn-error">
        Delete
      </button>
    </div>
      {:else}
      <Loader />
      {/if}
</RightModal>

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