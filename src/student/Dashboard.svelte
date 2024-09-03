<script>
  import { location, replace } from 'svelte-spa-router'
  import Stat from '../lib/Stat.svelte';

  if($location == "/"){
    replace("/dashboard")
  }

</script>

<div class="flex h-full">
  <div class="w-1/2 flex flex-col justify-center items-center gap-12">
    <Stat />
    <Stat />
  </div>
  <div class="bg-white m-12 w-1/2">
    Survey
  </div>
</div>

<div></div>
