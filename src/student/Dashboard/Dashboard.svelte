<script>
  import { location, replace } from 'svelte-spa-router'
  import Stat from '../../lib/Stat.svelte';
  import {MessageSquareWarning, Gavel, Info} from 'lucide-svelte'
  import { supabase } from '../../supabase';
  import { user_id } from '../../store';
  import { onMount } from 'svelte';
  import moment from 'moment';
  import Survey from './Survey.svelte';

  if($location == "/"){
    replace("/dashboard")
  }

  let appointment;
  let dashboard;

  async function getCounts(){
    const {data, error} = await supabase.rpc("get_student_count", {id:$user_id})
    if(error){
      alert(error.message);
      console.error(error);
      return;
      
    }
    console.log(data);
    dashboard = data[0]
  }
  async function checkAppointment() {
    const {data, error} = await supabase
    .from("appointments")
    .select("*, staff_id(first_name, last_name)")
    .eq("student_id", $user_id)
    .gt("time", "now()");

    if(error){
      alert(error.message);
      console.error(error);
      return;
    }
    appointment = data;
  }
  onMount(getCounts)
  onMount(checkAppointment)
</script>
{#if appointment}
{#each appointment as {reason, time, staff_id:{first_name, last_name}}}
<div class="p-4 px-12">
  <div class="alert">
    <Info />
    <div>
      You have scheduled meeting at 
      <span class="text-primary font-bold">{moment(time).format("dddd, MMM DD, YYYY - hh:mma")}</span>
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
<div class="flex h-full justify-evenly items-center lg:flex-row flex-col">
  <div class=" flex lg:flex-col justify-center items-center gap-12 mt-4">
    {#if dashboard}
    <Stat icon={MessageSquareWarning} label="Your Complaints" number={dashboard.complaints} time="" />
    <Stat icon={Gavel} label="Offenses" number={dashboard.offenses} time="" />
    {/if}
  </div>
  
    <Survey />
  
    
</div>

<div></div>
