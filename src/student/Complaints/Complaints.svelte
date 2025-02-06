<script>
  import { Archive, Ellipsis, Eye, List, MailCheck, MailWarning, PlusCircle, Trash } from "lucide-svelte";
  import { supabase } from "../../supabase";
  import { replace, querystring } from "svelte-spa-router";
  import { onMount } from "svelte";
  import Loader from "../../lib/Loader.svelte";
  import { user_id } from "../../store";
  import ComplaintsDetails from "./ComplaintsSummary.svelte";
  import { badge } from "../../customCss";
  import Table from "../../lib/Table.svelte";
  
  
  let active = "All";
  let complaints;
  let selectedComplaint;
  let filterComplaints = [];
  
  export let params;
  if(params && params.id && params.id != "-"){
    selectedComplaint = params.id
  }
  querystring.subscribe((id)=> {
    const searchparams = new URLSearchParams(id)
    selectedComplaint = searchparams.get('id')
  })

  async function getComplaints() {
    const {data, error} = await supabase
    .from("complaints")
    .select("*")
    .eq("sender_id", $user_id);

    if(error){
      alert(error.message);
      return
    }
    complaints = data;
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
        { event: "*", schema: "public", table: "complaints", filter: `sender_id=eq.${$user_id}` },
        ()=>{
          getComplaints();
        }
      )
      .subscribe();
  onMount(()=>{getComplaints()})
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
    { name: "Message", value: "message" },
    { name: "Type", value: "type" },
    { name: "Date Sent", value: "sent_date" },
  ];
</script>
<Table
  title="Your Complaints"
  addText="New Complaint"
  addLink="./#/addComplaint"
  {columns}
  {onSearch}
  {filterList}
  {filters}
  activeFilter={active}
  list={complaints}
  filteredList={filterComplaints}
>
{#each filterComplaints as { complaint_id, status, type, message, sent_date, sender_id:{first_name, last_name}}}
  <tr class="border-black/20 hover:bg-black/5 hover:cursor-pointer" on:click={() => {replace(`/complaints?id=${complaint_id}`); selectedComplaint=complaint_id }}>
    <td><span class="badge {badge(status)}">{status}</span></td>
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
  <ComplaintsDetails complaint_id={selectedComplaint} closeDetails={() => {replace('/complaints'); selectedComplaint = null }} />
{/if}