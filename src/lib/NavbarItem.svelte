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
  class="{isActive ? "bg-yellow-500" : "bg-white hover:bg-slate-200"} grid grid-cols-4 text-2xl gap-5 font-semibold p-4 w-full"
><div class="font-black text-right text-3xl">
  <i class="bi bi-{icon}"></i>
</div>
<div class="col-span-3 my-auto">
  {label}
</div>
</a>
