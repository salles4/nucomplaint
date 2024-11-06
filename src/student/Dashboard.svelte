<script>
  import { location, replace } from 'svelte-spa-router'
  import Stat from '../lib/Stat.svelte';
  import {MessageSquareWarning, Gavel, Info} from 'lucide-svelte'
  import { supabase } from '../supabase';
  import { user_id } from '../store';
  import { onMount } from 'svelte';

  if($location == "/"){
    replace("/dashboard")
  }

  let appointment;

  async function checkAppointment() {
    const {data, error} = await supabase
    .from("appointments")
    .select("*, staff_id(first_name, last_name)")
    .eq("student_id", $user_id)

    if(error){
      alert(error.message);
      console.error(error);
      return;
    }
    appointment = data;
  }
  onMount(checkAppointment)
</script>
{#if appointment}
{#each appointment as {reason, time, staff_id:{first_name, last_name}}}
<div class="p-4 px-12">
  <div class="alert">
    <Info />
    <div>
      You have scheduled meeting at 
      <span class="text-primary font-bold">{new Date(time).toDateString()} - {new Date(time).toLocaleTimeString()}</span>
      with 
      <span class="font-bold">
        {first_name} {last_name}
      </span>
      because of a 
      <span class="text-error font-bold">
        {reason}
      </span>
    </div>
  </div>
</div>
{/each}
{/if}
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
