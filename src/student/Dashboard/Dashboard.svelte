<script>
  import { location, replace } from 'svelte-spa-router'
  import Stat from '../../lib/Stat.svelte';
  import {MessageSquareWarning, Gavel, Info, AlertCircle, FileWarning} from 'lucide-svelte'
  import { supabase } from '../../supabase';
  import { user_id } from '../../store';
  import { onMount } from 'svelte';
  import moment from 'moment';
  import Survey from './Survey.svelte';

  if($location == "/"){
    replace("/dashboard")
  }

  let majorOffenses = 0, minorOffenses = 0
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

    const {data:offensesData, error:offensesError} = await supabase.rpc("countoffenses", {user_id:$user_id})
    
    if(offensesError){
      console.error(error);
      return;
    }
    minorOffenses = offensesData[0].minor_offenses
    majorOffenses = offensesData[0].major_offenses + Math.floor(minorOffenses / 3)

  }
  async function checkAppointment() {
    const {data, error} = await supabase
    .from("appointments")
    .select("*, staff_id(first_name, last_name)")
    .eq("student_id", $user_id)
    .in("status", ["Scheduled", "For Counseling"])
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
{#each appointment as {status, reason, time, staff_id:{first_name, last_name}}}
<div class="p-4 px-12">
  {#if status == "Scheduled"}
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
  {:else if status == "For Counseling"}
  <div class="alert bg-red-700 text-white">
    <AlertCircle />
    <div class="">
      You have a scheduled appointment in the Guidance Office at <span class="text-secondary font-bold">{moment(time).format("dddd, MMM DD, YYYY - hh:mma")}</span> because of your multiple violation of offense. 
      <br>
      <br>
      <b>
        Please attend on time.
      </b>

    </div>
  </div>
  {/if}
</div>
{/each}
{/if}
<div class="flex h-full justify-evenly items-center lg:flex-row flex-col">
  <div class=" flex-wrap p-12 flex lg:flex-col justify-center items-center gap-12 mt-4">
    {#if dashboard}
    <Stat icon={MessageSquareWarning} label="Your Complaints" number={dashboard.complaints} time="" />
    <Stat icon={Gavel} label="Major Offenses" number={majorOffenses} time="" />
    <Stat icon={FileWarning} label="Minor Offenses" number={minorOffenses} time="" />
    {/if}
  </div>
  
    <Survey />
  
    
</div>

<div></div>
