<script>
  import { CalendarCheck, Gavel, MessageSquareWarning } from "lucide-svelte";
  import AccMng from "../../lib/AccMng.svelte";
  import Stat from "../../lib/Stat.svelte";
  import { location, replace, push } from "svelte-spa-router";
  import { onMount } from "svelte";
  import { supabase } from "../../supabase";
  import Loader from "../../lib/Loader.svelte";
  import ComplaintsCharts from "./ComplaintsCharts.svelte";
  import OffensesCharts from "./OffensesCharts.svelte";
  if ($location == "/") {
    replace("/dashboard");
  }
  let countData;
  async function getCounts() {
    const { data, error } = await supabase.rpc("get_count");
    if (error) {
      alert(error.message);
      console.error(error);

      return;
    }

    console.log(data);
    countData = data[0];
  }

  function changePath(path) {
    push(path);
  }
  onMount(getCounts);
</script>

<div class="flex flex-col justify-center">
  {#if countData}
    <div
      class="hidden lg:flex justify-center mt-12 gap-3 flex-wrap text-2xl font-bold"
    >
      <Stat
        icon={MessageSquareWarning}
        label="Complaints"
        number={countData.complaints}
        time="Last 90 days"
      />
      <Stat
        icon={Gavel}
        label="Offenses"
        number={countData.offenses}
        time="Last 90 days"
      />
      <Stat
        icon={CalendarCheck}
        label="Appointments"
        number={countData.appointments}
        time="Today"
      />
    </div>
    <div class="mt-8 !mx-auto w-full sm:w-fit lg:hidden">
      <div class="stats stats-vertical sm:stats-horizontal md:w-fit shadow-xl w-full ">
        <div class="stat">
          <div class="stat-figure bg-yellow-400 w-min p-2 shadow-lg rounded">
            <MessageSquareWarning />
          </div>
          <div class="stat-title">Complaints</div>
          <div class="stat-value">
            {countData.complaints || "..."}
          </div>
          <div class="stat-desc">Last 24 hours</div>
        </div>

        <div class="stat">
          <div class="stat-figure bg-yellow-400 w-min p-2 shadow-lg rounded">
            <Gavel />
          </div>
          <div class="stat-title">Offenses</div>
          <div class="stat-value">{countData.offenses}</div>
          <div class="stat-desc">Last 24 hours</div>
        </div>

        <div class="stat">
          <div class="stat-figure bg-yellow-400 w-min p-2 shadow-lg rounded">
            <CalendarCheck />
          </div>
          <div class="stat-title">Appointments</div>
          <div class="stat-value">{countData.appointments}</div>
          <div class="stat-desc">Today</div>
        </div>
      </div>
    </div>
    {:else}
    <Loader />
  {/if}

  <div
    class="m-4 bg-white text-center flex flex-col shadow-lg"
  >
    <!-- <div class="mt-4 text-2xl font-bold">Account Management</div> -->
    <div class="flex gap-4 justify-center items-center flex-wrap">
      <AccMng
        title="Students"
        src="./img/student.png"
        description="Get an access to the student's profile."
        on:click={() => changePath("/dashboard/student")}
      />
    </div>
  </div>
  <div class="h-fit bg-white m-4 mt-0 shadow-lg flex-col max-w-full">
    <div class="font-bold text-center text-xl p-4">Complaints</div>
    <ComplaintsCharts />
    <hr class="p-2">
    <div class="font-bold text-center text-xl my-4">Offenses</div>
    <OffensesCharts />
  </div>
</div>
