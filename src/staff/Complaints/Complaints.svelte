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
    Ellipsis,
  } from "lucide-svelte";
  import Tab from "../../lib/Tab.svelte";
  import { supabase } from "../../supabase";
  import { onMount } from "svelte";
  import Loader from "../../lib/Loader.svelte";
  import ComplaintsDetails from "./ComplaintsDetails.svelte";

  let active = "All";
  let complaints;
  let filterComplaints = [];
  let selectedComplaint;

  function filterList(){
    filterComplaints = complaints.filter((complaint) => (complaint.status == active || active == "All"));
    console.log(filterComplaints);
    
  }
  async function getComplaints() {
    const {data, error} = await supabase
    .from("complaints")
    .select("*, primary_details(first_name, last_name)")
    .order("sent_date", {ascending:false})

    if(error){
      alert(error.message)
      console.error(error);
      return
    }
    complaints = data
    console.log(data);
    filterList()
  }

  supabase
      .channel("complaints")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "complaints" },
        (payload)=>{
          console.log("Realtime Update", payload);
          getComplaints();
        }
      )
      .subscribe();

  function viewDetails(complaint_id){
    selectedComplaint = complaint_id;
  }
  function changeFilter(e) {
    active = e.target.dataset.condition;
    filterList()
    console.log(active);
    
    console.log(e.target.closest(".dropdown"));
    if(e.target.closest(".dropdown")){
      e.target.closest(".dropdown").removeAttribute("open");
    }
    
  }
  onMount(getComplaints)
</script>

<div class="bg-white m-6 h-fit relative mt-10 overflow-visible">
  <div class="w-full relative -top-5">
    <div
      class="bg-nu-blue text-white text-xl sm:mx-8 py-6 sm:p-8 p-4 flex justify-between items-center"
    >
      <div class="">Student Complaints:</div>
      <div class="hidden lg:flex flex-wrap gap-1 text-base items-center">
        <Tab
          label="All"
          icon={FileClock}
          {active}
          condition="All"
          on:click={changeFilter}
        />
        <Tab
          label="Unsettled"
          icon={MailWarning}
          {active}
          condition="Unsettled"
          on:click={changeFilter}
        />
        <Tab
          label="Settled"
          icon={MailCheck}
          {active}
          condition="Settled"
          on:click={changeFilter}
        />
        <Tab
          label="Archive"
          icon={Archive}
          {active}
          condition="Archive"
          on:click={changeFilter}
        />
      </div>
      <div class="block lg:hidden">
        <details class="dropdown dropdown-end">
        <summary class="btn m-1 ">{active}</summary>
          <ul class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow text-black">
            <li><button data-condition="All" on:click={changeFilter}><FileClock /> All</button></li>
            <li><button data-condition="Unsettled" on:click={changeFilter}><MailWarning /> Unsettled</button></li>
            <li><button data-condition="Settled" on:click={changeFilter}><MailCheck /> Settled</button></li>
            <li><button data-condition="Archive" on:click={changeFilter}><Archive /> Archive</button></li>
          </ul>
        </details>
      </div>
    </div>

    <div
      class="search flex justify-end items-center gap-2 text-blue-800 me-12 m-2"
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
    <div class="overflow-x-auto overflow-y-hidden">
    {#if filterComplaints.length != 0 || (complaints && filterComplaints.length == 0) }
    <table class="table table-sm">
      <thead class="text-lg text-center">
        <tr>
          <th class="w-[10%] min-w-[90px]">Status</th>
          <th class="w-[20%] min-w-[200px]">Sender</th>
          <th class="w-[30%] max-w-[300px]">Message</th>
          <th class="">Type</th>
          <th class="w-[10%] max-w-[200px]">Date Sent</th>
          <!-- <th class="w-[10%] min-w-[100px]"></th> -->
        </tr>
      </thead>
      <tbody class="text-center">
        {#each filterComplaints as { complaint_id, status, type, message, sent_date, primary_details:{first_name, last_name}}}
          <tr class="border-black/20 hover:bg-black/5 hover:cursor-pointer" on:click={() => viewDetails(complaint_id)}>
            <td><span class="badge {status == "Unread" ? "badge-neutral" : "badge-success badge-outline"}">{status}</span></td>
            <td>{first_name} {last_name}</td>
            <td class="truncate text-start max-w-[300px]">{message}</td>
            <td>{type}</td>
            <td class="text-nowrap">{new Date(sent_date).toDateString()}</td>
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
{#if selectedComplaint}
  <ComplaintsDetails complaint_id={selectedComplaint} closeDetails={() => selectedComplaint = null}/>
{/if}
<style>
  .search button {
    @apply bg-nu-blue text-yellow-300 p-2 text-2xl rounded-lg;
  }
  .dropdown-content li:hover{
    background-color: rgba(0, 0, 0, 0.062);
  }
</style>
