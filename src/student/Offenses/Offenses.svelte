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
  import OffenseSummary from "./OffenseSummary.svelte";
  import { auth, user_id } from "../../store";
  import Loader from "../../lib/Loader.svelte";
  import Table from "../../lib/Table.svelte";
  import {replace} from 'svelte-spa-router';

  let offenses;
  let active = "All";
  let selectedOffense;
  let searchText;
  let filteredOffenses = [];
  
  export let params;
  if(params && params.id && params.id != "-"){
    selectedOffense = params.id
  }else{
    replace("/offenses/-")
  }

  async function getOffenses() {
    const { data, error } = await supabase
      .from("offenses")
      .select("*, student_id(*)")
      .eq("student_id", $user_id)
      .order("time_created", { ascending: false })

    if (error) {
      alert(error.message);
      console.error(error);
      return;
    }
    offenses = data;
    filterList()
  }
  function filterList(activeFilter = "All"){
    active = activeFilter;
    filteredOffenses = offenses.filter((offense) => (offense.status == active || active == "All"));
    console.log(active, filteredOffenses);
  }
  function onSearch(col, text){
    filterList(active)
    console.log(col, text);
    if(!text){
      return;
    }

    const searchedOffenses = filteredOffenses.filter((data) => {
      //TODO: accomodate other cols
      if(col == 'name'){
        const {student_id: {first_name, last_name}} = data
        return `${first_name} ${last_name}`.toLowerCase().includes(text.toLowerCase())  
      }
      return data[col].toLowerCase().includes(text.toLowerCase())
    })
    filteredOffenses = searchedOffenses;
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
  const columns = [
    { name: "Status" },
    { name: "Violation", value: "violation" },
    { name: "Category", value: "category" },
    { name: "Valid To", value: "valid_until" },
    { name: "Date Sent", value: "time_created" }
  ];
  onMount(getOffenses);
</script>

<Table
  title="Your Offenses"
  filters = {[]}
  {columns}
  {onSearch}
  {filterList}
  activeFilter={active}
  list={offenses}
  filteredList={filteredOffenses}
>
  {#each filteredOffenses as { offense_id, status, violation, category, valid_until, time_created }}
    <tr
      class="border-black/20 hover:bg-black/5 hover:cursor-pointer"
      on:click={() => (selectedOffense = offense_id)}
    >
      <td class="p-2"
        ><span class="badge text-nowrap {badge(status)}">{status}</span></td
      >
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
  <OffenseSummary
    offense_id={selectedOffense}
    closeDetails={() => (selectedOffense = null)}
  />
{/if}
