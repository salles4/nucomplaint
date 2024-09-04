<script>
  import {
    Archive,
    ArrowDownAZ,
    FileClock,
    MailCheck,
    MailWarning,
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
      type: "Equipments",
      sender: "Mark Anthony Gipit",
      message: "lorem kjasd ahjskdhkjsdujdh kjghasd kjh has hjkhasd",
      sentDate: "09-13-2024",
    },
    {
      status: true,
      type: "Equipments",
      sender: "Mark Anthony Gipit",
      message: "Test Message",
      sentDate: "09-13-2024",
    },
    {
      status: true,
      type: "Equipments",
      sender: "Mark Anthony Gipit",
      message: "Test Message",
      sentDate: "09-13-2024",
    },
    {
      status: true,
      type: "Equipments",
      sender: "Mark Anthony Gipit",
      message: "Test Message",
      sentDate: "09-13-2024",
    },
    {
      status: true,
      type: "Equipments",
      sender: "Mark Anthony Gipit",
      message: "Test Message",
      sentDate: "09-13-2024",
    },
    {
      status: true,
      type: "Equipments",
      sender: "Mark Anthony Gipit",
      message: "Test Message",
      sentDate: "09-13-2024",
    },
    {
      status: true,
      type: "Equipments",
      sender: "Mark Anthony Gipit",
      message: "Test Message",
      sentDate: "09-13-2024",
    },
    {
      status: true,
      type: "Equipments",
      sender: "Mark Anthony Gipit",
      message: "Test Message",
      sentDate: "09-13-2024",
    },
    {
      status: true,
      type: "Equipments",
      sender: "Mark Anthony Gipit",
      message: "Test Message",
      sentDate: "09-13-2024",
    },
    {
      status: true,
      type: "Equipments",
      sender: "Mark Anthony Gipit",
      message: "Test Message",
      sentDate: "09-13-2024",
    },
    {
      status: true,
      type: "Equipments",
      sender: "Mark Anthony Gipit",
      message: "Test Message",
      sentDate: "09-13-2024",
    },
    {
      status: true,
      type: "Equipments",
      sender: "Mark Anthony Gipit",
      message: "Test Message",
      sentDate: "09-13-2024",
    },
    {
      status: true,
      type: "Equipments",
      sender: "Mark Anthony Gipit",
      message: "Test Message",
      sentDate: "09-13-2024",
    },
    {
      status: true,
      type: "Equipments",
      sender: "Mark Anthony Gipit",
      message: "Test Message",
      sentDate: "09-13-2024",
    },
    {
      status: true,
      type: "Equipments",
      sender: "Mark Anthony Gipit",
      message: "Test Message",
      sentDate: "09-13-2024",
    },
    {
      status: true,
      type: "Equipments",
      sender: "Mark Anthony Gipit",
      message: "Test Message",
      sentDate: "09-13-2024",
    },
    {
      status: true,
      type: "Equipments",
      sender: "Mark Anthony Gipit",
      message: "Test Message",
      sentDate: "09-13-2024",
    },
    {
      status: true,
      type: "Equipments",
      sender: "Mark Anthony Gipit",
      message: "Test Message",
      sentDate: "09-13-2024",
    },
    {
      status: true,
      type: "Equipments",
      sender: "Mark Anthony Gipit",
      message: "Test Message",
      sentDate: "09-13-2024",
    },
    {
      status: true,
      type: "Equipments",
      sender: "Mark Anthony Gipit",
      message: "Test Message",
      sentDate: "09-13-2024",
    },
    {
      status: true,
      type: "Equipments",
      sender: "Mark Anthony Gipit",
      message: "Test Message",
      sentDate: "09-13-2024",
    },
    {
      status: true,
      type: "Equipments",
      sender: "Mark Anthony Gipit",
      message: "Test Message",
      sentDate: "09-13-2024",
    },
    {
      status: true,
      type: "Equipments",
      sender: "Mark Anthony Gipit",
      message: "Test Message",
      sentDate: "09-13-2024",
    },
    {
      status: true,
      type: "Equipments",
      sender: "Mark Anthony Gipit",
      message: "Test Message",
      sentDate: "09-13-2024",
    },
    {
      status: true,
      type: "Equipments",
      sender: "Mark Anthony Gipit",
      message: "Test Message",
      sentDate: "09-13-2024",
    },
  ];
  const filters = [];
  let active = "unsettled";

  function changeFilter(e) {
    active = e.target.dataset.condition;
  }
</script>

<div class="bg-white m-6 h-fit relative mt-10 overflow-visible">
  <div class="w-full relative -top-5">
    <div
      class="bg-nu-blue text-white text-xl mx-8 py-6 p-8 flex justify-between items-center"
    >
      <div class="">Student Complaints:</div>
      <div class="flex flex-wrap gap-1 text-base items-center">
        <Tab
          label="Unsettled"
          icon={MailWarning}
          {active}
          condition="unsettled"
          on:click={changeFilter}
        />
        <Tab
          label="Settled"
          icon={MailCheck}
          {active}
          condition="settled"
          on:click={changeFilter}
        />
        <Tab
          label="Archive"
          icon={Archive}
          {active}
          condition="archive"
          on:click={changeFilter}
        />
        <Tab
          label="Manage Complaint History"
          icon={FileClock}
          {active}
          condition="history"
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
      <thead class="text-lg border-b-2 sticky bg-white">
        <tr>
          <th class="w-[10%]">Status</th>
          <th class="w-[10%]">Type</th>
          <th class="w-[20%]">Sender</th>
          <th class="w-[35%]">Message</th>
          <th class="w-[10%]">Date Sent</th>
          <th class="w-[15%]">Action</th>
        </tr>
      </thead>
      <tbody>
        {#each data as { status, type, sender, message, sentDate }}
          <tr class="border-b hover:bg-black/5 h-14">
            <td class="p-2"
              ><input
                class="size-5"
                type="checkbox"
                name="status"
                bind:checked={status}
              /></td
            >
            <td>{type}</td>
            <td>{sender}</td>
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
