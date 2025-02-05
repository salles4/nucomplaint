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
    List,
  } from "lucide-svelte";
  import Tab from "../../lib/Tab.svelte";
  import { supabase } from "../../supabase";
  import { onMount } from "svelte";
  import Loader from "../../lib/Loader.svelte";
  import ComplaintSummary from "./ComplaintSummary.svelte";
  import { badge } from "../../customCss";
  import { replace } from "svelte-spa-router";
  import Table from "../../lib/Table.svelte";

  let active = "All";
  let complaints;
  let filterComplaints = [];
  let selectedComplaint;
  export let params;
  if(params && params.id && params.id != "-"){
    selectedComplaint = params.id
  }else{
    replace("/complaints/-")
  }

  async function getComplaints() {
    const {data, error} = await supabase
    .from("complaints")
    .select("*, sender_id(*)")
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
  function filterList(activeFilter = "All"){
    active = activeFilter;
    filterComplaints = complaints.filter((complaint) => (complaint.status == active || active == "All"));
    console.log(filterComplaints);
  }

  function onSearch(col, text){
    filterList(active)
    console.log(col, text);
    if(!text){
      return;
    }

    const searchedComplaints = filterComplaints.filter((data) => {
      //TODO: accomodate other cols
      if(col == 'name'){
        const {student_id: {first_name, last_name}} = data
        return `${first_name} ${last_name}`.toLowerCase().includes(text.toLowerCase())  
      }
      return data[col].toLowerCase().includes(text.toLowerCase())
    })
    filterComplaints = searchedComplaints;
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

  function changeFilter(e) {
    active = e.target.dataset.condition;
    filterList()
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
    }
  ];
  const columns = [
    { name: "Status" },
    { name: "Sender", value: "name" },
    { name: "Message", value: "message" },
    { name: "Type", value: "type" },
    { name: "Date Sent", value: "sent_date" },
  ];
  onMount(getComplaints)
</script>
<Table
  title="Student Complaints"
  {filters}
  {columns}
  {onSearch}
  {filterList}
  activeFilter={active}
  list={complaints}
  filteredList={filterComplaints}
>
{#each filterComplaints as { complaint_id, status, type, message, sent_date, sender_id:{first_name, last_name}}}
  <tr class="border-black/20 hover:bg-black/5 hover:cursor-pointer" on:click={() => {replace(`/complaints/${complaint_id}`); selectedComplaint = complaint_id}}>
    <td><span class="badge {badge(status)}">{status}</span></td>
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
</Table>
{#if selectedComplaint}
  <ComplaintSummary complaint_id={selectedComplaint} closeDetails={() => {selectedComplaint = null; replace("/complaints")}}/>
{/if}

