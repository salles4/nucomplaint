<script>
  import { Clock } from "lucide-svelte";

  export let icon, label, number, time;
</script>
<div class="bg-white shadow-xl p-4 relative min-w-[300px] sm:w-[20%] w-full">
  <div class="text-gray-800 bg-yellow-400 w-min p-3 shadow-lg absolute sm:-top-6">
    <svelte:component this={icon} class="icon sm:size-[36px]" />
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