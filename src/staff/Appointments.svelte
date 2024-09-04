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
  } from "lucide-svelte";
  import Tab from "../lib/Tab.svelte";

  const data = [
    {
      status: true,
      student_id: "2022-153827",
      name: "Mark Anthony Gipit",
      type: "Equipments",
      message: "lorem kjasd ahjskdhkjsdujdh kjghasd kjh has hjkhasd",
      sentDate: "09-13-2024",
    },
  ];
  const filters = [];
  let active = "due";

  function changeFilter(e) {
    active = e.target.closest("[data-condition]").dataset.condition;
    console.log(active);
  }
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

    <div class="search flex justify-end items-center gap-2 text-blue-800 me-12 m-2">
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

    <table class="table-fixed w-full text-center">
      <thead class="text-lg border-b-2">
        <tr>
          <th class="w-[10%]">Status</th>
          <th class="w-[10%]">Student ID</th>
          <th class="w-[20%]">Full Name</th>
          <th class="w-[10%]">Type</th>
          <th class="w-[30%]">Message</th>
          <th class="w-[10%]">Date Sent</th>
          <th class="w-[15%]">Action</th>
        </tr>
      </thead>
      <tbody>
        {#each data as { status, student_id, name, type, message, sentDate }}
          <tr class="border-b hover:bg-black/5 h-14">
            <td class="p-2"
              ><input
                class="size-5"
                type="checkbox"
                name="status"
                bind:checked={status}
              /></td
            >
            <td>{student_id}</td>
            <td>{name}</td>
            <td>{type}</td>
            <td class="truncate">{message}</td>
            <td>{sentDate}</td>
            <td>
              <button on:click|preventDefault={() => {}}>
                <Eye />
              </button>
              <button on:click|preventDefault={() => {}}>
                <Reply />
              </button>
              <button class="hover:!bg-red-600" on:click|preventDefault={() => {}}>
                <Trash />
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
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
