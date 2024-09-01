<script>
  import Routes, { location, replace } from "svelte-spa-router";
  import Header from "./lib/Header.svelte";
  import Dashboard from "./staff/Dashboard.svelte";
  import Profile from "./staff/Profile.svelte";
  import StaffSidebar from "./lib/StaffSidebar.svelte";
  import Complaints from "./staff/Complaints.svelte";
  import Error from "./pages/Error.svelte";
  import Offenses from "./staff/Offenses.svelte";
  import Appointments from "./staff/Appointments.svelte";
  import Reports from "./staff/Reports.svelte";
  import Surveys from "./staff/Surveys.svelte";
  import Entry from "./pages/Entry.svelte";
  import { auth } from "./store";
</script>

<div class="flex">
  {#if $auth == "staff"}
    <StaffSidebar />
  {/if}

  {#if $auth == "staff"}
    <main class="flex-grow min-h-[100svh] flex flex-col">
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
