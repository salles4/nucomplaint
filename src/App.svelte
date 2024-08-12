<script>
  import Routes, { location } from "svelte-spa-router";
  import NavbarItem from "./lib/NavbarItem.svelte";
  import Header from "./lib/Header.svelte";
  import Dashboard from "./pages/Dashboard.svelte";
  import Profile from "./pages/Profile.svelte";
</script>

<div class="flex">
  <!-- hidden lg: -->
  <aside
    class="flex flex-col h-[100vh] col-span-2 overflow-y-auto shadow-xl bg-white relative" 
  >
    <div class="p-2 text-lg self-end m-2 rounded-lg w-min">
      <i class="bi bi-arrow-bar-left"></i>
    </div>
    <div class="flex-shrink-0 flex flex-col px-14 pb-4 items-center">
      <img
        class="h-[120px] rounded-full"
        src="https://ctwbdevl.vercel.app/lab/img/Salles.jpg"
        alt=""
      />
      <div>Francis Salles</div>
      <div>Student No. 2022-129371</div>
    </div>
    <div class="border mx-8"></div>
    <div class="flex-grow">
      <NavbarItem icon="house-door" label="Dashboard" to="dashboard" />
      <NavbarItem icon="person" label="Profile" to="profile" />
      <NavbarItem
        icon="envelope-exclamation"
        label="Complaints"
        to="complaints"
      />
      <NavbarItem icon="envelope-exclamation" label="Offenses" to="offenses" />
      <NavbarItem icon="calendar-check" label="Appointments" to="appointment" />
      <NavbarItem icon="flag" label="Reports" to="reports" />
      <NavbarItem icon="card-text" label="Surveys" to="surveys" />
    </div>
    <div>
      <NavbarItem icon="door-open" label="Logout" to="logout" />
    </div>
  </aside>

  <main class="flex-1 text-2xl font-bold col-span-10 lg:col-span-8">
    {#if !["/dashboard", "/profile"].includes($location)}
      <Header />
    {/if}
    <div>
      <Routes
        routes={{
          "/dashboard": Dashboard,
          "/profile": Profile,
        }}
      />
      {$location}
    </div>
  </main>
</div>
