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
    List,
  } from "lucide-svelte";
  import Tab from "../../lib/Tab.svelte";
  import { supabase } from "../../supabase";
  import Loader from "../../lib/Loader.svelte";
  import { onMount } from "svelte";
  import AppointmentDetails from "./AppointmentDetails.svelte";
  import { badge } from "../../customCss";

  export let changeMode;

  let appointments;
  let active = "All";
  let selectedAppointment;

  async function getAppointments() {
    const { data, error } = await supabase
      .from("appointments")
      .select(
        "*, primary_details!appointments_student_id_fkey(user_id, first_name, last_name)"
      )
      .order("time", { ascending: false });

    if (error) {
      alert(error.message);
      console.error(error);
      return;
    }
    appointments = data;
    console.log(data);
  }
  supabase
    .channel("appointments")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "appointments" },
      (payload) => {
        console.log("Realtime Update", payload);
        getAppointments();
      }
    )
    .subscribe();

  function changeFilter(e) {
    active = e.target.closest("[data-condition]").dataset.condition;
    console.log(active);

    console.log(e.target.closest(".dropdown"));
    if(e.target.closest(".dropdown")){
      e.target.closest(".dropdown").removeAttribute("open");
    }
  }
  const filters = [
    {
      name: "All",
      icon: List,
    },
    {
      name: "Due Date",
      icon: CalendarDays,
    },
    {
      name: "Upcoming",
      icon: CalendarClock,
    },
    {
      name: "Cancelled",
      icon: CalendarX,
    },
    {
      name: "Done",
      icon: CalendarCheck,
    },
    {
      name: "Archive",
      icon: Archive,
    }
  ];
  onMount(getAppointments);
</script>

<div class="bg-white m-6 h-fit relative mt-10 overflow-visible">
  <div class="w-full relative -top-5">
    <div
      class="bg-nu-blue text-white text-xl mx-8 py-6 p-8 flex justify-between items-center"
    >
      <div class="">Appointments:</div>
      <div class="hidden lg:flex flex-wrap gap-1 text-base items-center">
        {#each filters as {name, icon}}
          <Tab
          label={name}
          icon={icon}
          {active}
          condition={name}
          on:click={changeFilter}
          />
        {/each}
      </div>
      <div class="block lg:hidden">
        <details class="dropdown dropdown-end">
          <summary class="btn m-1 w-[20vw] max-w-32">{active}</summary>
          <ul
            class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow text-black"
          >
          {#each filters as {name, icon}}
          <li class="{name == active ? "bg-black/10":""}">
            <button data-condition={name} on:click={changeFilter}
              ><svelte:component this={icon} class="inline text-primary" /> {name}</button
            >
          </li>
          {/each}
          </ul>
        </details>
      </div>
    </div>
    <div class="flex items-center justify-between mx-12">
      <button
        class="btn btn-primary btn-sm"
        on:click={() => {
          changeMode("add");
        }}><CirclePlus class="text-yellow-300" /> Add Apppointment</button
      >
      <div class="search flex justify-end items-center gap-2 text-blue-800 m-2">
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
    <div class="overflow-x-auto overflow-y-hidden">
      {#if appointments}
        <table class="table text-center">
          <thead class="text-lg">
            <tr>
              <th class="">Status</th>
              <!-- <th class="">Student ID</th> -->
              <th class="">Name</th>
              <th class="">Reason</th>
              <th class="">Message</th>
              <th class="">Time</th>
            </tr>
          </thead>
          <tbody>
            {#each appointments as { appointment_id, status, message, reason, time, primary_details: { first_name, last_name, user_id } }}
              <tr
                class="border-black/20 hover:bg-black/5 hover:cursor-pointer"
                on:click={() => (selectedAppointment = appointment_id)}
              >
                <td class="p-2"><span class="badge {badge(status)}">{status}</span></td>
                <!-- <td>{user_id}</td> -->
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
</div>
{#if selectedAppointment}
  <AppointmentDetails
    appointment_id={selectedAppointment}
    closeDetails={() => (selectedAppointment = null)}
  />
{/if}

<style>
  .search button {
    @apply bg-nu-blue text-yellow-300 p-2 text-2xl rounded-lg;
  }
  .dropdown-content li:hover {
    background-color: rgba(0 0 0 / 0.1);
  }
</style>
