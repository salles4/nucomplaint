<script>
  import { location } from 'svelte-spa-router'
  export let icon = "";
  export let label = "";
  export let to = "";
  let isActive = false;
  $: isActive =  $location == `/${to}`

</script>

<a
  href="./#/{to}"
  class="{isActive ? "bg-yellow-500" : "bg-white hover:bg-slate-200"} flex justify-center text-2xl gap-2 font-semibold p-4 w-full text-center border-black border"
><span class="font-black">
  <i class="bi bi-{icon}"></i>
</span>
  {label}
</a>
