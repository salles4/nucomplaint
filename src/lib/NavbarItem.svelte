<script>
  import { location } from "svelte-spa-router";
  export let icon = "";
  export let label = "";
  export let to = "";
  let isActive = $location == `/${to}`;
  
  $: if($location != `/${to}`){
    isActive = false
  }
    
  
  let span = false
  let x = 0, y = 0;
  function rippleEffect(event) {
    
    x = event.clientX;
    y = event.clientY;
    span = true
    
    // Remove span after 0.3s
    setTimeout(() => {
      isActive = true
    }, 190);
    setTimeout(() => {
      span = false
    }, 300);
  }
</script>

<a
  on:click={rippleEffect}
  href="./#/{to}"
  class="{isActive
    ? 'bg-yellow-500'
    : 'bg-white hover:bg-gray-50'} grid grid-cols-4 text-2xl gap-5 font-semibold p-4 w-full overflow-hidden relative"
>
  {#if span}
    <span class="ripple left-[{x}px] top-[{y}px]"></span>
  {/if}
  <div class="font-black text-right text-3xl">
    <i class="bi bi-{icon}"></i>
  </div>
  <div class="col-span-3 my-auto">
    {label}
  </div>
</a>

<style>
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
