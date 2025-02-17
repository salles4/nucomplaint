<script>
    import { onMount } from "svelte";
  import OffenseDetails from "./OffenseDetails.svelte";
  import OffenseMessages from "./OffenseMessages.svelte";
    import { supabase } from "../../supabase";

  export let params;
  let offense_id = params.id
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
    details = data
  }
  onMount(getDetails)

</script>
<div class="flex h-full overflow-hidden">
{#if details}
<div class="flex-1 bg-white md:w-[550px] overflow-y-auto flex-col lg:flex hidden print:block">
  <OffenseDetails offense_id={params.id} {details}/>
</div>
<div class="flex-[2] flex flex-col overflow-y-auto print:hidden">
  <OffenseMessages offense_id={params.id} {details}/>
</div>
{/if}
</div>
