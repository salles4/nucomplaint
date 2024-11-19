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
<div class="flex h-full justify-around items-center">
  <div class="w-1/4 flex flex-col justify-center items-center gap-12">
    {#if dashboard}
    <Stat icon={MessageSquareWarning} label="Your Complaints" number={dashboard.complaints} time="" />
    <Stat icon={Gavel} label="Offenses" number={dashboard.offenses} time="" />
    {/if}
  </div>
  <div class="flex justify-around items-center gap-8">
    <iframe title="facebook" src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2FNUMOAph%2Fposts%2Fpfbid0renaZ3WfrFB6LfrWcuKLaPNpryjUvhmBxFzjSYLtVEUZa7683nXnHN2DS9676WD3l&width=750&show_text=false&height=660&appId" width="400" height="420" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
    <iframe title="fbpost" src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2FNUMOAph%2Fposts%2Fpfbid0278cUKZRZ1evkqtikcDAzvRX68G8uh4tvGPMJe5cUrSUijh4VqJ4X1UcRX1ojXpQxl&show_text=false&width=500" width="400" height="420" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
  </div>
    
</div>

<div></div>
