<script>
  import { location, replace } from "svelte-spa-router";
  import { sidebarLabel } from "../store";
  import { onMount } from "svelte";
  export let icon = "";
  export let label = "";
  export let to = "";
  $: isActive = $location == `/${to}`;
  
  // $: if($location != `/${to}`){
  //   isActive = false
  //   console.log($location)
  // }
  
  let span = false
  let x = 0, y = 0;
  function rippleEffect(event) {
    if(isActive){
      return;
    }
    replace(`/${to}`)

    x = event.clientX;
    y = event.clientY;
    span = true
    
    // Remove span after 0.3s
    setTimeout(() => {
      span = false
    }, 300);
  }
</script>

<a
  on:click|preventDefault={rippleEffect}
  href="./#/{to}"
  class="navItem {isActive
    ? 'bg-yellow-500'
    : 'bg-white hover:bg-gray-50'} {$sidebarLabel ? "grid-cols-4" : "grid-cols-1"} py-2 grid gap-5 font-semibold  w-full overflow-hidden relative"
>
  {#if span}
    <span class="ripple left-[{x}px] top-[{y}px]"></span>
  {/if}
  <div class="font-black  {$sidebarLabel ? "text-right text-3xl" : "text-center text-2xl"}  ">
    <i class="bi bi-{icon}"></i>
  </div>
  <div class="{$sidebarLabel ? "col-span-3" : "hidden"} my-auto text-xl">
    {label}
  </div>
</a>

<style>
  .navItem{
    transition: background-color 0.2s 0.15s;
  }
  a span {
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
</style>
