<script>
  import ComplaintMessages from "../../staff/Complaints/ComplaintMessages.svelte";
  import ComplaintDetails from "./ComplaintDetails.svelte";
  

  export let params;

</script>
<div class="flex h-full">
  <div class="flex-1 bg-white md:w-[550px] overflow-y-auto flex-col lg:flex hidden">
    <ComplaintDetails complaint_id={params.id} />
  </div>
  <div class="flex-[2] flex flex-col">
    <ComplaintMessages complaint_id={params.id} />
  </div>
</div>
