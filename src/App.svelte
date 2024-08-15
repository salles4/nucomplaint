<script>
  import Routes, { location } from "svelte-spa-router";
  import Header from "./lib/Header.svelte";
  import Dashboard from "./pages/Dashboard.svelte";
  import Profile from "./pages/Profile.svelte";
  import Sidebar from "./lib/Sidebar.svelte";
  import Complaints from "./pages/Complaints.svelte";
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
      }}
    />

    {#if !["/dashboard", "/profile", "/complaints"].includes($location)}
    <div>
      <img src="./{$location.substring(1)}.png" alt="placeholder">
    </div>
    {/if}
    
  </main>
</div>
