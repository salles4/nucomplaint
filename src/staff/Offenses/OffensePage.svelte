<script>
  import OffenseDetails from "./OffenseDetails.svelte";
  import OffenseMessages from "./OffenseMessages.svelte";

  export let params;

</script>
<div class="flex h-full overflow-hidden">
  <div class="flex-1 bg-white md:w-[550px] overflow-y-auto flex-col lg:flex hidden">
    <OffenseDetails offense_id={params.id} />
  </div>
  <div class="flex-[2] flex flex-col overflow-y-auto">
    <OffenseMessages offense_id={params.id} />
  </div>
</div>
