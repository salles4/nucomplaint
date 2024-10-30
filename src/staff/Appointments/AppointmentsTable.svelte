<script>
  import {
    Archive,
    ArrowDownAZ,
    CalendarCheck,
    CalendarClock,
    CalendarDays,
    CalendarX,
    RotateCw,
    Search,
    History,
    Eye,
    Reply,
    Trash,
    CirclePlus,
    Ellipsis,
  } from "lucide-svelte";
  import Tab from "../../lib/Tab.svelte";
  import { supabase } from "../../supabase";
  import Loader from "../../lib/Loader.svelte";
  import { onMount } from "svelte";

  export let changeMode;

  let appointments;
  const filters = [];
  let active = "due";
  async function getAppointments() {
    const {data, error} = await supabase
    .from("appointments")
    .select("*, student_id(user_id, first_name, last_name)")
    .order("time", {ascending:false})

    if(error){
      alert(error.message)
      console.error(error);
      return
    }
    appointments = data
    console.log(data);
  }
  function changeFilter(e) {
    active = e.target.closest("[data-condition]").dataset.condition;
    console.log(active);
  }
  onMount(getAppointments)
</script>

<div class="bg-white m-6 h-fit relative mt-10 overflow-visible">
  <div class="w-full relative -top-5">
    <div
      class="bg-nu-blue text-white text-xl mx-8 py-6 p-8 flex justify-between items-center"
    >
      <div class="">Appointments:</div>
      <div class="flex flex-wrap gap-1 text-base items-center">
        <Tab
          label="Due Date"
          icon={CalendarDays}
          {active}
          condition="due"
          on:click={changeFilter}
        />
        <Tab
          label="Upcoming"
          icon={CalendarClock}
          {active}
          condition="upcoming"
          on:click={changeFilter}
        />
        <Tab
          label="Cancelled"
          icon={CalendarX}
          {active}
          condition="cancelled"
          on:click={changeFilter}
        />
        <Tab
          label="Done"
          icon={CalendarCheck}
          {active}
          condition="done"
          on:click={changeFilter}
        />
        <Tab
          label="Archive"
          icon={Archive}
          {active}
          condition="archive"
          on:click={changeFilter}
        />
      </div>
    </div>
    <div class="flex items-center justify-between mx-12">
      <button class="btn btn-primary btn-sm" on:click={() => {changeMode("add")}}><CirclePlus class="text-yellow-300" /> Add Apppointment</button>
      <div class="search flex justify-end items-center gap-2 text-blue-800  m-2">
        <label>
          <Search strokeWidth="3" class="inline" />
          <input
            id="search"
            autocomplete="off"
            type="text"
            placeholder="Search"
            class="border-b-2 border-b-blue-800 px-2 p-1 active:border-none focus:border-0"
          />
        </label>
        <button><RotateCw /></button>
        <button><ArrowDownAZ /></button>
        <button><History /></button>
      </div>

    </div>

    {#if appointments }
    <table class="table text-center">
      <thead class="text-lg">
        <tr>
          <th class="">Status</th>
          <th class="">Student ID</th>
          <th class="">Full Name</th>
          <th class="">Reason</th>
          <th class="">Message</th>
          <th class="">Time</th>
        </tr>
      </thead>
      <tbody>
        {#each appointments as { status, message, reason, time, student_id:{first_name, last_name, user_id}}}
          <tr class="border-black/20 hover:bg-black/5 hover:cursor-pointer" on:click={() => {}}>
            <td class="p-2"
              ><span class="badge">{status}</span></td
            >
            <td>{user_id}</td>
            <td>{first_name} {last_name}</td>
            <td>{reason}</td>
            <td class="truncate text-start max-w-[300px]">{message}</td>
            <td>{new Date(time).toDateString()}</td>
            <td>
              <div>
                <Ellipsis class="mx-auto" />
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
    {:else}
    <Loader />
    {/if}
  </div>
</div>

<style>
  .search button {
    @apply bg-nu-blue text-yellow-300 p-2 text-2xl rounded-lg;
  }
  td button {
    @apply inline-block align-middle p-2 px-1 hover:bg-nu-blue rounded-lg hover:text-white transition-all duration-100;
  }
</style>
