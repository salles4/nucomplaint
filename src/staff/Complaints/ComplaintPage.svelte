<script>
  import ComplaintDetails from "./ComplaintDetails.svelte";
  import ComplaintMessages from "./ComplaintMessages.svelte";

  export let params;

</script>
<div class="flex h-full overflow-hidden">
  <div class="flex-1 bg-white md:w-[550px] overflow-y-auto flex-col lg:flex hidden">
    <ComplaintDetails complaint_id={params.id} />
  </div>
  <div class="flex-[2] flex flex-col overflow-y-auto">
    <ComplaintMessages complaint_id={params.id} />
  </div>
</div>
