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
  import { auth, user_id } from "../../store";
  import Loader from "../../lib/Loader.svelte";
  import Table from "../../lib/Table.svelte";

  let offenses;
  let active = "All";
  let selectedOffense;
  let searchText;
  let filteredOffenses = [];
  
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
    if ($auth == "guard") {
      offenses = data.filter((offense) => offense.staff_id == $user_id);
    } else {
      offenses = data;
    }
    console.log(data);
    filterList()
  }
  function filterList(activeFilter = "All"){
    active = activeFilter;
    filteredOffenses = offenses.filter((offense) => (offense.status == active || active == "All"));
    console.log(active, filteredOffenses);
  }
  function onSearch(col, text){
    console.log(col, text);
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

  const filters = [
    {
      name: "All",
      icon: FileClock,
    },
    {
      name: "Investigating",
      icon: Search,
    },
    {
      name: "Reported",
      icon: MailWarning,
    },
    {
      name: "Guilty",
      icon: MailCheck,
    },
    {
      name: "Dismissed",
      icon: MailCheck,
    },
    {
      name: "Archive",
      icon: Archive,
    },
  ];
  const columns = [
    { name: "Status" },
    { name: "Student ID", value: "user_id" },
    { name: "Full Name", value: "name" },
    { name: "Violation", value: "violation" },
    { name: "Category", value: "category" },
    { name: "Valid To", value: "valid_until" },
    { name: "Date Sent", value: "time_created" }
  ];
  onMount(getOffenses);
</script>

<Table
  title="Student Offenses"
  addText="Add Offense"
  addLink="./#/offense/add"
  {filters}
  {columns}
  {onSearch}
  {filterList}
  activeFilter={active}
  list={offenses}
  filteredList={filteredOffenses}
>
  {#each filteredOffenses as { offense_id, status, student_id: { first_name, last_name, user_id }, violation, category, valid_until, time_created }}
    <tr
      class="border-black/20 hover:bg-black/5 hover:cursor-pointer"
      on:click={() => (selectedOffense = offense_id)}
    >
      <td class="p-2"
        ><span class="badge text-nowrap {badge(status)}">{status}</span></td
      >
      <td>
        {user_id}
      </td>
      <td>
        {first_name}
        {last_name}
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
</Table>

{#if selectedOffense}
  <OffenseDetails
    offense_id={selectedOffense}
    closeDetails={() => (selectedOffense = null)}
  />
{/if}
