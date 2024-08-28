<script>
  import Routes, { location, replace } from "svelte-spa-router";
  import Header from "./lib/Header.svelte";
  import Dashboard from "./pages/Dashboard.svelte";
  import Profile from "./pages/Profile.svelte";
  import Sidebar from "./lib/Sidebar.svelte";
  import Complaints from "./pages/Complaints.svelte";
  import Error from "./pages/Error.svelte";
  import Offenses from "./pages/Offenses.svelte";
  import Appointments from "./pages/Appointments.svelte";

  function redirect(){
    replace("/dashboard")
  }
</script>

<div class="flex">
  <Sidebar />
  <main class="flex-grow min-h-[100svh] flex flex-col">
    {#if !["/dashboard", "/profile"].includes($location)}
      <Header />
    {/if}

    <Routes
      routes={{
        "/dashboard": Dashboard,
        "/profile": Profile,
        "/complaints": Complaints,
        "/offenses": Offenses,
        "/appointments": Appointments,
        // "*": Error,
      }}
    />

    {#if !["/dashboard", "/profile", "/complaints", "/offenses", "/appointments"].includes($location)}
    <div>
      <img src="./{$location.substring(1)}.png" alt="placeholder">
    </div>
    {/if}
    
  </main>
</div>
