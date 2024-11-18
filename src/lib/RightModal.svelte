<script>
  import { X } from "lucide-svelte";
  import { fade, fly } from "svelte/transition";
  export let title,
    closeDetails = () => {};
</script>

<div class="overflow-hidden absolute w-[100svw] h-[100svh] top-0 left-0">
  <button
    transition:fade
    class="bg-black/20 absolute w-[100svw] h-[100svh] top-0 left-0 cursor-default z-10"
    on:click={() => closeDetails()}
  >
  </button>
  <div
    transition:fly={{ duration: 500, x: 1000 }}
    class="absolute h-[100svh] right-0 top-0 bg-white w-full md:w-[550px] rounded-s-2xl z-20 overflow-y-auto flex flex-col"
  >
    <div class="p-6 pb-2 flex items-center justify-between">
      <h1 class="text-2xl font-bold">{title}</h1>
      <button class="btn btn-ghost" on:click={() => closeDetails()}>
        <X />
      </button>
    </div>
    <hr />
    <slot />
  </div>
</div>
