<script>
  import { Clock } from "lucide-svelte";

  export let icon, label, number, time;
</script>
<div class="bg-white shadow-xl p-4 mb-2 relative  min-w-[240px] w-[20%]">
  <div class="text-4xl text-gray-800 bg-yellow-400 w-min p-3 shadow-lg absolute -top-6">
    <!-- <i class="bi bi-bell-fill"></i> -->
    <svelte:component this={icon} class="icon" size="36" />
  </div>
  <div class="text-end pb-2">
    <span class="text-slate-400 block font-normal">
      {label}
    </span>
    <span class="text-5xl">{number}</span>
  </div>
  <hr>
  <div class="font-normal text-lg pt-1 text-gray-400">
    <Clock class="inline" size="18" />
    {time}
  </div>
</div>