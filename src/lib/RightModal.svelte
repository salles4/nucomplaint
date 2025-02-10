<script>
  import { X } from "lucide-svelte";
  import { fade, fly } from "svelte/transition";
  export let title,
    closeDetails = () => {};
</script>

<div class="overflow-hidden absolute w-[100svw] h-[100svh] top-0 left-0">
  <button
    transition:fade
    class="bg-black/20 absolute w-[100svw] h-[100svh] top-0 left-0 cursor-default z-50"
    on:click={() => closeDetails()}
  >
  </button>
  <div
    transition:fly={{ duration: 500, x: 1000 }}
    class="absolute h-[100svh] print:h-fit right-0 top-0 bg-white w-full sm:w-[550px] print:w-full rounded-s-2xl z-[60] overflow-y-auto flex flex-col"
  >
    <div class="print:block hidden">
      <img class="m-auto h-12 object-contain " src="./img/nu_logo.png" alt="National University Logo">
    </div>
    <div class="sm:p-6 pb-2 pt-2 flex items-center justify-between print:justify-center">
      <h1 class="text-2xl font-bold ps-16 sm:p-0">{title}</h1>
      <button class="print:hidden btn btn-ghost" on:click={() => closeDetails()}>
        <X />
      </button>
    </div>
    <hr />
    <slot />
  </div>
</div>
