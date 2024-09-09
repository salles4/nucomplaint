<script>
  import { location, replace } from 'svelte-spa-router'
  import Stat from '../lib/Stat.svelte';
  import {MessageSquareWarning, Gavel} from 'lucide-svelte'

  if($location == "/"){
    replace("/dashboard")
  }

</script>

<div class="flex h-full">
  <div class="w-1/2 flex flex-col justify-center items-center gap-12">
    <Stat icon={MessageSquareWarning} label="Complaints" number={0} time="Last 24 Hours" />
    <Stat icon={Gavel} label="Offenses" number={0} time="Last 24 Hours" />
  </div>
  <div class="bg-white m-12 w-1/2">
    Survey
  </div>
</div>

<div></div>
