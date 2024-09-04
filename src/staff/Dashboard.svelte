<script>
  import { CalendarCheck, Gavel, MessageSquareWarning } from "lucide-svelte";
  import AccMng from "../lib/AccMng.svelte";
  import Stat from "../lib/Stat.svelte";
  import { location, replace } from 'svelte-spa-router'

  if($location == "/"){
    replace("/dashboard")
  }

  function students(){
    console.log("asd");
    
  }
</script>

<div class="flex flex-col h-full">
  <div class="flex justify-center mt-12 mb-2 gap-3 flex-wrap text-2xl font-bold">
    <Stat icon={MessageSquareWarning} label="Complaints" number={0} time="Last 24 Hours" />
    <Stat icon={Gavel} label="Offenses" number={0} time="Last 24 Hours" />
    <Stat icon={CalendarCheck} label="Appointments" number={0} time="Today" />
  </div>
  <div class="m-4 flex-grow bg-white text-center flex flex-col h-full shadow-lg">
    <div class="mt-4 text-2xl font-bold">Account Management</div>
    <div class="flex-grow flex gap-4 justify-center items-center flex-wrap">
    <AccMng title="Students" src="./img/student.png" description="Get an access to the student's profile." on:click={students} />
    <AccMng title="Guards" src="./img/guard.png" description="Get an access to the guard's profile." />
    </div>
  </div>
</div>
