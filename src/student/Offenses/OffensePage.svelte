<script>
    import { onMount } from "svelte";
  import OffenseMessages from "../../staff/Offenses/OffenseMessages.svelte";
    import { user_id } from "../../store";
  import { supabase } from "../../supabase";
  import OffenseDetails from "./OffenseDetails.svelte";
  import { replace } from 'svelte-spa-router'
  
  export let params;
  const offense_id = params.id
  let details;
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
    if(data.student_id.user_id != $user_id){
      replace("/offenses")
      alert("No permission to access that.")
    }
    details = data
  }
  onMount(getDetails)
</script>
<div class="flex h-full">
  {#if details}
  <div class="flex-1 bg-white md:w-[550px] overflow-y-auto flex-col lg:flex hidden">
    <OffenseDetails offense_id={params.id} {details}/>
  </div>
  <div class="flex-[2] flex flex-col">
    <OffenseMessages offense_id={params.id} {details} />
  </div>
  {/if}
</div>
