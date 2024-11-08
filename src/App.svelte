<script>
// @ts-nocheck

  import Routes, { location, replace } from "svelte-spa-router";
  import Sidebar from "./lib/Sidebar.svelte";
  import Header from "./lib/Header.svelte";
  import Dashboard from "./staff/Dashboard/Dashboard.svelte";
  import Profile from "./staff/Profile/Profile.svelte";
  import Complaints from "./staff/Complaints/Complaints.svelte";
  import Offenses from "./staff/Offenses/Offenses.svelte";
  import Appointments from "./staff/Appointments/Appointments.svelte";
  import Reports from "./staff/Reports.svelte";
  import Surveys from "./staff/Surveys.svelte";
  import Error from "./pages/Error.svelte";
  import Entry from "./pages/Entry.svelte";
  
  import StudentDashboard from "./student/Dashboard.svelte";
  import StudentProfile from "./student/Profile/Profile.svelte";
  import StudentComplaints from "./student/Complaints/Complaints.svelte";
  import StudentOffenses from "./student/Offenses.svelte";
  
  import { auth } from "./store";
  import UserList from "./staff/Dashboard/UserList.svelte";
  import GuardsList from "./staff/Dashboard/GuardsList.svelte";
  import AddComplaint from "./student/Complaints/AddComplaint.svelte";
  import AddOffense from "./staff/Offenses/AddOffense.svelte";
  let warning = true;
</script>
<div class="{warning ? "block" : "hidden"} absolute bottom-0 w-full p-2 text-center bg-white overflow-auto">
  This is for a student's school project. This website is used for educational purposes only.
  <button class="btn btn-primary btn-outline btn-sm ms-2" on:click={() => warning = false}>Close</button>
</div>
<div class="flex">
  {#if $auth == "staff"}
    <Sidebar />
    <main>
      {#if !["/dashboard", "/profile"].includes($location)}
        <Header />
      {/if}
        <Routes
        routes={{
          "/": Dashboard,
          "/dashboard": Dashboard,
            "/dashboard/:type": UserList,
            "/guards": GuardsList,
          "/profile": Profile,
          "/complaints": Complaints,
          "/offenses": Offenses,
          "/offense/add": AddOffense,
          "/appointments": Appointments,
          "/reports": Reports,
          "/surveys": Surveys,
          // "*": Error,
        }}
      />
    </main>
  {:else if $auth == "student"}
  <Sidebar />
  <main>
    {#if !["/profile"].includes($location)}
        <Header />
      {/if}
    <Routes routes={{
      "/": Dashboard,
      "/dashboard": StudentDashboard,
      "/profile": StudentProfile,
      "/complaints": StudentComplaints,
      "/addComplaint": AddComplaint,
      "/offenses": StudentOffenses,
    }} />
  </main>
  {:else if $auth == "guard"}
  <Sidebar />
  <main>
    <Header />
    <Routes routes={{
      "/": Offenses,
      "/offense/add": AddOffense,
      "/records": Offenses,
    }} />
  </main>
  {:else}
    <Routes
      routes={{
        "*": Entry,
      }}
    />
  {/if}
</div>
<style>
  main{
    @apply flex-grow min-h-[100svh] max-h-[100svh] overflow-y-auto flex flex-col;
  }
</style>