<script>
  import { onMount } from "svelte";
  import ComplaintDetails from "./ComplaintDetails.svelte";
  import ComplaintMessages from "./ComplaintMessages.svelte";
  import { supabase } from "../../supabase";

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
    details = data
  }
  onMount(getDetails)
</script>
<div class="flex h-full overflow-hidden">
  <div class="flex-1 bg-white md:w-[550px] overflow-y-auto flex-col lg:flex hidden">
    <ComplaintDetails complaint_id={params.id} {details} />
  </div>
  <div class="flex-[2] flex flex-col overflow-y-auto">
    <ComplaintMessages complaint_id={params.id} {details} />
  </div>
</div>
