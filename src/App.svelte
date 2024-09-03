<script>
  import Routes, { location, replace } from "svelte-spa-router";
  import Sidebar from "./lib/Sidebar.svelte";
  import Header from "./lib/Header.svelte";
  import Dashboard from "./staff/Dashboard.svelte";
  import Profile from "./staff/Profile.svelte";
  import Complaints from "./staff/Complaints.svelte";
  import Offenses from "./staff/Offenses.svelte";
  import Appointments from "./staff/Appointments.svelte";
  import Reports from "./staff/Reports.svelte";
  import Surveys from "./staff/Surveys.svelte";
  import Error from "./pages/Error.svelte";
  import Entry from "./pages/Entry.svelte";
  
  import StudentDashboard from "./student/Dashboard.svelte";
  import StudentProfile from "./student/Profile.svelte";
  import StudentComplaints from "./student/Complaints.svelte";
  import StudentOffenses from "./student/Offenses.svelte";
  
  import Offense from "./guard/Offense.svelte";
  import Record from "./guard/Record.svelte";

  import { auth } from "./store";
</script>

<div class="flex">
  {#if $auth == "staff"}
    <Sidebar name="Francis James Salles" id="2022-153827" img="https://ctwbdevl.vercel.app/lab/img/Salles.jpg" />
    <main>
      {#if !["/dashboard", "/profile"].includes($location)}
        <Header />
      {/if}
      <Routes
        routes={{
          "/": Dashboard,
          "/dashboard": Dashboard,
          "/profile": Profile,
          "/complaints": Complaints,
          "/offenses": Offenses,
          "/appointments": Appointments,
          "/reports": Reports,
          "/surveys": Surveys,
          // "*": Error,
        }}
      />
    </main>
  {:else if $auth == "student"}
  <Sidebar name="Francis James Salles" id="2022-153827" img="https://ctwbdevl.vercel.app/lab/img/Salles.jpg" />
  <main>
    <Header />
    <Routes routes={{
      "/": Dashboard,
      "/dashboard": StudentDashboard,
      "/profile": StudentProfile,
      "/complaints": StudentComplaints,
      "/offenses": StudentOffenses,
    }} />
  </main>
  {:else if $auth == "guard"}
  <Sidebar name="Francis James Salles" id="2022-153827" img="https://ctwbdevl.vercel.app/lab/img/Salles.jpg" />
  <main>
    <Header />
    <Routes routes={{
      "/": Offense,
      "/offense": Offense,
      "/record": Record,
    }} />
  </main>
  {:else}
    <Routes
      routes={{
        "*": Entry,
      }}
    />
  {/if}
  {#if [].includes($location)}
    <div>
      <img src="./{$location.substring(1)}.png" alt="placeholder" />
    </div>
  {/if}
</div>
<style>
  main{
    @apply flex-grow min-h-[100svh] max-h-[100svh] overflow-y-auto flex flex-col;
  }
</style>