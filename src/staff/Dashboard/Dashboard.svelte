<script>
  import { CalendarCheck, Gavel, MessageSquareWarning } from "lucide-svelte";
  import AccMng from "../../lib/AccMng.svelte";
  import Stat from "../../lib/Stat.svelte";
  import { location, replace, push } from 'svelte-spa-router'
  import { onMount } from "svelte";
  import { supabase } from "../../supabase";
  if($location == "/"){
    replace("/dashboard")
  }
  let countData;
  async function getCounts() {
    const {data, error} = await supabase.rpc("get_count");
    if(error){
      alert(error.message)
      console.error(error);
      
      return;
    }

    console.log(data);
    countData = data[0];
  }

  function changePath(path){
    push(path)
  }
  onMount(getCounts);
</script>

<div class="flex flex-col h-full">
  <div class="flex justify-center mt-12 mb-2 gap-3 flex-wrap text-2xl font-bold">
    {#if countData}
      <Stat icon={MessageSquareWarning} label="Complaints" number={countData.complaints} time="Last 24 Hours" />
      <Stat icon={Gavel} label="Offenses" number={countData.offenses} time="Last 24 Hours" />
      <Stat icon={CalendarCheck} label="Appointments" number={countData.appointments} time="Today" />
    {/if}
  </div>
  <div class="m-4 flex-grow bg-white text-center flex flex-col h-full shadow-lg">
    <div class="mt-4 text-2xl font-bold">Account Management</div>
    <div class="flex-grow flex gap-4 justify-center items-center flex-wrap">
    <AccMng title="Students" src="./img/student.png" description="Get an access to the student's profile." on:click={() => changePath("/dashboard/student")} />
    <AccMng title="Guards" src="./img/guard.png" description="Get an access to the guard's profile." on:click={() => changePath("/dashboard/guard")} />
    </div>
  </div>
</div>
