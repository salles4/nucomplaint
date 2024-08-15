<script>
  import AccMng from "../lib/AccMng.svelte";
import Stat from "../lib/Stat.svelte";
</script>

<div class="flex flex-col h-full">
  <div class="flex justify-center mt-12 mb-2 gap-3 flex-wrap text-2xl font-bold">
    <Stat />
    <Stat />
    <Stat />
  </div>
  <div class="m-4 flex-grow bg-white text-center flex flex-col h-full shadow-lg">
    <div class="mt-4 text-2xl font-bold">Account Management</div>
    <div class="flex-grow flex gap-4 justify-center items-center flex-wrap">
    <AccMng title="Students" src="./img/student.png" description="Get an access to the student's profile." />
    <AccMng title="Guards" src="./img/guard.png" description="Get an access to the guard's profile." />
    </div>
  </div>
</div>
