<script>
  import Routes, { location } from "svelte-spa-router";
  import NavbarItem from "./lib/NavbarItem.svelte";
  import Header from "./lib/Header.svelte";
  import Dashboard from "./pages/Dashboard.svelte";
  import Profile from "./pages/Profile.svelte";
  import { sidebarLabel } from "./store";
  import Sidebar from "./lib/Sidebar.svelte";
</script>

<div class="flex">
  <Sidebar />
  <main class="flex-grow min-h-[100svh]">
    {#if !["/dashboard", "/profile"].includes($location)}
      <Header />
    {/if}
    <Routes
      routes={{
        "/dashboard": Dashboard,
        "/profile": Profile,
      }}
    />
    {#if !["/dashboard", "/profile"].includes($location)}
      <img src="./{$location.substring(1)}.png" alt="placeholder">
    {/if}
  </main>
</div>
