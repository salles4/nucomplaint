<script>
  import OffenseMessages from "../../staff/Offenses/OffenseMessages.svelte";
  import OffenseDetails from "./OffenseDetails.svelte";


  

  export let params;

</script>
<div class="flex h-full">
  <div class="flex-1 bg-white md:w-[550px] overflow-y-auto flex-col lg:flex hidden">
    <OffenseDetails offense_id={params.id} />
  </div>
  <div class="flex-[2] flex flex-col">
    <OffenseMessages offense_id={params.id} />
  </div>
</div>
