<script>
  import { fade, fly, scale } from "svelte/transition";
  import { modal } from "../store";
  import { X } from "lucide-svelte";
  import { bounceIn } from "svelte/easing";
  let modalDetails = {
    title: null,
    description: null,
    primaryFn: null,
    secondaryFn: () => modal.set(null),
  };

  modal.subscribe((details) => {
    if (details && !Object.hasOwn(details, "secondaryFn")) {
      details.secondaryFn = () => modal.set(null);
    }
    console.log(details);
    
    modalDetails = details;
  });
  // {
  //   title: "Delete?",
  //   description: "Are you sure you want to delete this data?",
  //   primaryFn: () => {},
  //   secondaryFn: () => {modal.set(null)}
  // }
</script>

{#if modalDetails && modalDetails.title}
<div class="overflow-hidden absolute w-[100svw] h-[100svh] top-0 left-0">
  <button
  transition:fade
  class="bg-black/20 absolute w-[100svw] h-[100svh] top-0 left-0 cursor-default z-[98]"
  on:click={() => modalDetails.secondaryFn()}
  >
</button>
<div
transition:scale={{ duration: 300 }}
class="absolute h-fit left-1/2 -translate-x-1/2 top-[40%] bg-white w-3/4 sm:w-[550px] rounded-2xl z-[99] overflow-y-auto flex flex-col"
>
<div class="flex items-center justify-center">
        <h1 class="text-2xl font-bold p-4 pt-6">{modalDetails.title}</h1>
      </div>
      <hr />
      <div class="p-4 text-center">
        {modalDetails.description}
      </div>
      <hr />
      <div class="grid grid-cols-2 gap-2 p-2">
        {#if modalDetails.pOption}
        <button
        class="btn btn-primary btn-sm"
        on:click={modalDetails.primaryFn}>{modalDetails.pOption}</button
        >
        {/if}
        <button
          class="btn btn-primary btn-outline btn-sm"
          on:click={modalDetails.secondaryFn}>{modalDetails.sOption}</button
        >
      </div>
    </div>
  </div>
{/if}
