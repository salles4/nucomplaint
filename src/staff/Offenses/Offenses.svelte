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
    Trash,
    Reply,
    CirclePlus,
    Ellipsis,
  } from "lucide-svelte";
  import Tab from "../../lib/Tab.svelte";
  import { onMount } from "svelte";
  import { supabase } from "../../supabase";
  import { badge } from "../../customCss";
  import OffenseDetails from "./OffenseDetails.svelte";

  let offenses;
  let active = "All";
  let selectedOffense;

  async function getOffenses() {
    const { data, error } = await supabase
      .from("offenses")
      .select("*, student_id(*)")
      .order("time_created", { ascending: false });

    if (error) {
      alert(error.message);
      console.error(error);
      return;
    }
    offenses = data;
    console.log(data);
  }
  supabase
    .channel("offenses")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "offenses" },
      (payload) => {
        console.log("Realtime Update", payload);
        getOffenses();
      }
    )
    .subscribe();

  function changeFilter(e) {
    active = e.target.closest("[data-condition]").dataset.condition;
    console.log(active);

    console.log(e.target.closest(".dropdown"));
    if (e.target.closest(".dropdown")) {
      e.target.closest(".dropdown").removeAttribute("open");
    }
  }
  const filters = [
    {
      name: "All",
      icon: FileClock,
    },
    {
      name: "Unsettled",
      icon: MailWarning,
    },
    {
      name: "Settled",
      icon: MailCheck,
    },
    {
      name: "Archive",
      icon: Archive,
    },
  ];
  onMount(getOffenses);
</script>

<div class="bg-white m-6 h-fit relative mt-10 overflow-visible">
  <div class="w-full relative -top-5">
    <div
      class="bg-nu-blue text-white text-xl mx-8 py-6 p-8 flex justify-between items-center"
    >
      <div class="">Student Offenses:</div>
      <div class="hidden lg:flex flex-wrap gap-1 text-base items-center">
        {#each filters as { name, icon }}
          <Tab
            label={name}
            {icon}
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
            {#each filters as { name, icon }}
              <li class={name == active ? "bg-black/10" : ""}>
                <button data-condition={name} on:click={changeFilter}
                  ><svelte:component this={icon} class="inline text-primary" />
                  {name}</button
                >
              </li>
            {/each}
          </ul>
        </details>
      </div>
    </div>
    <div class="flex items-center justify-between mx-12">
      <a
        href="./#/offense/add"
        class="btn btn-primary btn-sm"
        on:click={() => {}}
        ><CirclePlus class="text-yellow-300" /> Add Offense</a
      >
      <div
        class="search flex justify-end items-center gap-2 text-blue-800 m-2"
      >
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
      {#if offenses}
        <table class="table text-center">
          <thead class="text-lg">
            <tr>
              <th class="">Status</th>
              <th class="">Student ID</th>
              <th class="">Full Name</th>
              <th class="">Type</th>
              <th class="">Category</th>
              <th class="">Valid To</th>
              <th class="">Date Sent</th>
              <th class="">Action</th>
            </tr>
          </thead>
          <tbody>
            {#each offenses as { offense_id, status, student_id: { first_name, last_name, user_id }, violation, category, valid_until, time_created }}
              <tr class="border-black/20 hover:bg-black/5 hover:cursor-pointer"
                on:click={() => (selectedOffense = offense_id)}>
                <td class="p-2"
                  ><span class="badge {badge(status)}">{status}</span></td
                >
                <td>
                  {user_id}
                </td>
                <td>
                  {first_name} {last_name}
                </td>
                <td class="truncate">
                  {violation}
                </td>
                <td>
                  {category}
                </td>
                <td>
                  {new Date(valid_until).toDateString()}
                </td>
                <td>
                  {new Date(time_created).toDateString()}
                </td>
                <td>
                  <div>
                    <Ellipsis class="mx-auto" />
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      {/if}
    </div>
  </div>
</div>
{#if selectedOffense}
  <OffenseDetails
    offense_id={selectedOffense}
    closeDetails={() => (selectedOffense = null)}
  />
{/if}
<style>
  .search button {
    @apply bg-nu-blue text-yellow-300 p-2 text-2xl rounded-lg;
  }
</style>
