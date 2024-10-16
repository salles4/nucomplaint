<script>
  import { location, replace } from "svelte-spa-router";
  import { sidebarLabel } from "../store";
  import { onMount } from "svelte";
  export let icon;
  export let label = "";
  export let to = null;
  export let onclick = null;
  export let routes = [];
  $: isActive = $location == `/${to}` || routes.includes($location);

  function clicked(e) {
    rippleEffect(e);
    if (onclick) {
      onclick();
    }
  }

  let span = false;
  let x = 0,
    y = 0;
  function rippleEffect(event) {
    if (isActive) {
      return;
    }
    if (to) {
      replace(`/${to}`);
    }

    x = event.clientX;
    y = event.clientY;
    span = true;

    // Remove span after 0.3s
    setTimeout(() => {
      span = false;
    }, 300);
  }
</script>

<button
  on:click|preventDefault={clicked}
  class="navItem {isActive
    ? 'bg-yellow-500'
    : 'bg-white hover:bg-gray-50 hovLight'} {$sidebarLabel
    ? 'grid-cols-4 py-2'
    : 'grid-cols-1 py-3'} text-left grid gap-5 font-semibold w-full  relative overflow-hidden"
>
  {#if span}
    <span class="ripple left-[{x}px] top-[{y}px]"></span>
  {/if}
  <div class="font-black relative">
    <!-- <i class="bi bi-{icon}"></i> -->
    <svelte:component
      this={icon}
      class={$sidebarLabel ? "ms-auto" : "m-auto"}
      size={$sidebarLabel ? "32" : "28"}
      strokeWidth="1.75"
    />
  </div>
  <div class="{$sidebarLabel ? 'col-span-3' : 'hidden'} my-auto text-xl">
    {label}
  </div>
</button>

<style>
  .navItem {
    transition: background-color 0.15s 0.15s;
  }
  button span {
    position: absolute;
    border-radius: 50%;
    /* To make it round */
    background-color: rgba(234, 179, 8, 0.7);

    width: 100px;
    height: 100px;
    animation: ripple 1s;
    opacity: 0;
  }

  /* Add animation */
  @keyframes ripple {
    from {
      opacity: 1;
      transform: scale(0);
    }

    to {
      opacity: 0;
      transform: scale(10);
    }
  }
  .hovLight {
    transition: background-color 0.05s;
  }
</style>
