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
    CalendarOff,
    MessagesSquare,
  } from "lucide-svelte";
  import Tab from "../../lib/Tab.svelte";
  import { supabase } from "../../supabase";
  import Loader from "../../lib/Loader.svelte";
  import { onMount } from "svelte";
  import AppointmentDetails from "./AppointmentDetails.svelte";
  import { badge } from "../../customCss";
  import moment from "moment";
  import Table from "../../lib/Table.svelte";
  import {querystring, replace} from 'svelte-spa-router'

  export let changeMode;
  
  let appointments;
  let filteredAppointments = [];
  let active = "All";
  let selectedAppointment;
  
  querystring.subscribe((id)=> {
    const searchparams = new URLSearchParams(id)
    selectedAppointment = searchparams.get('id')
  })

  async function getAppointments() {
    const { data, error } = await supabase
      .from("appointments")
      .select("*, student_id(*)")
      .order("time", { ascending: false });

    if (error) {
      alert(error.message);
      console.error(error);
      return;
    }
    appointments = data;
    console.log(data);
    filterList(active)
  }
  async function missed() {
    const {data, error} = await supabase
    .from("appointments")
    .update({
      status: "Missed"
    })
    .eq("status", "Scheduled")
    .lt("time", "now()")
    if(error){
      console.error(error);
    }
  }
  function filterList(activeFilter = "All"){
    active = activeFilter;
    filteredAppointments = appointments.filter((offense) => (offense.status == active || active == "All"));
    console.log(active, filteredAppointments);
  }
  function onSearch(col, text){
    filterList(active)
    console.log(col, text);
    if(!text){
      return;
    }

    const searchedAppointments = filteredAppointments.filter((data) => {
      //TODO: accomodate other cols
      if(col == 'name'){
        const {student_id: {first_name, last_name}} = data
        return `${first_name} ${last_name}`.toLowerCase().includes(text.toLowerCase())  
      }
      return data[col].toLowerCase().includes(text.toLowerCase())
    })
    filteredAppointments = searchedAppointments;
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

  const filters = [
    {
      name: "All",
      icon: List,
    },
    {
      name: "Scheduled",
      icon: CalendarClock,
    },
    {
      name: "For Counseling",
      icon: MessagesSquare,
    },
    {
      name: "Cancelled",
      icon: CalendarX,
    },
    {
      name: "Missed",
      icon: CalendarOff,
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
  const columns = [
    { name: "Status" },
    { name: "Name", value: "name" },
    { name: "Reason", value: "reason" },
    { name: "Message", value: "message" },
    { name: "Time", value: "time_created" },
  ];
  onMount(missed);
  onMount(getAppointments);
</script>

<Table
  title="Student Appointments"
  addText="Add Appointment"
  addFunction={() => changeMode("add")}
  {filters}
  {columns}
  {onSearch}
  {filterList}
  activeFilter={active}
  list={appointments}
  filteredList={filteredAppointments}
>
 {#each filteredAppointments as { appointment_id, status, message, reason, time, student_id: { first_name, last_name, user_id } }}
  <tr
    class="border-black/20 hover:bg-black/5 hover:cursor-pointer"
    on:click={() => (selectedAppointment = appointment_id)}
  >
    <td class="p-2"><span class="badge {badge(status)}">{status}</span></td>
    <!-- <td>{user_id}</td> -->
    <td class="text-nowrap">{first_name} {last_name}</td>
    <td>{reason}</td>
    <td class="truncate text-start max-w-[300px]">{message}</td>
    <td class="text-nowrap">{moment(time).format("MMM DD, YYYY - hh:mm a")}</td>
    <td class="">
      <div>
        <Ellipsis class="mx-auto" />
      </div>
    </td>
  </tr>
{/each}
</Table>
{#if selectedAppointment}
  <AppointmentDetails
    appointment_id={selectedAppointment}
    closeDetails={() => {replace("/appointments"); selectedAppointment = null}}
  />
{/if}

