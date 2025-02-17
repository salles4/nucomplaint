<script>
  import ComplaintMessages from "../../staff/Complaints/ComplaintMessages.svelte";
  import ComplaintDetails from "./ComplaintDetails.svelte";
  import { supabase } from "../../supabase";
  import { onMount } from "svelte";
  import { user_id } from "../../store";
  import { replace } from 'svelte-spa-router'

  export let params;
  let complaint_id = params.id
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
    if(data.sender_id.user_id != $user_id){
      replace("/complaints")
      alert("No permission to access that")
    }
    details = data
  }
  onMount(getDetails)

</script>
<div class="flex h-full overflow-hidden">
  {#if details}
  <div class="flex-1 bg-white md:w-[550px] overflow-y-auto flex-col lg:flex hidden print:block">
    <ComplaintDetails {details}/>
  </div>
  <div class="flex-[2] flex flex-col print:hidden">
    <ComplaintMessages complaint_id={params.id} {details}/>
  </div>
  {/if}
</div>
