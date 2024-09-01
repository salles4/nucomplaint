<script>
  import { auth, sidebarLabel } from "../store";
  import NavbarItem from "./NavbarItem.svelte";

  function toggleSidebar() {
    sidebarLabel.set(!$sidebarLabel);
  }
  function logout(){
    auth.set(null)
    localStorage.removeItem("v0Auth")
  }
</script>

<aside
  class="{$sidebarLabel
      ? "min-w-[300px]"
      : "min-w-[64px]"} flex flex-col h-[100vh] overflow-y-auto w-fit shadow-xl bg-white sticky top-0"
>
  <!-- Toggle Sidebar Button -->
  <button
    on:click={toggleSidebar}
    class="{$sidebarLabel
      ? 'absolute self-end'
      : 'self-center'} p-2 px-3 text-lg m-2 rounded-lg w-min border hover:cursor-pointer"
  >
    <i class="bi bi-arrow-bar-{$sidebarLabel ? 'left' : 'right'}"></i>
  </button>
  <!-- Profile -->
  <div
    class="{$sidebarLabel
      ? 'px-14 pt-4'
      : 'px-2'}  flex-shrink-0 flex flex-col pb-2 items-center"
  >
    <img
      class="{$sidebarLabel ? 'w-[120px]' : 'w-[48px]'} rounded-full "
      src="https://ctwbdevl.vercel.app/lab/img/Salles.jpg"
      alt=""
    />
    <div class="{$sidebarLabel ? "block" : "hidden"} text-center">
      <div class="pt-2">Francis Salles</div>
      <div>2022-129371</div>
    </div>
  </div>
  <div class="border self-center w-[75%] mb-2"></div>
  <div class="flex-grow">
    <NavbarItem icon="house-door" label="Dashboard" to="dashboard" />
    <NavbarItem icon="person" label="Profile" to="profile" />
    <NavbarItem
      icon="envelope-exclamation"
      label="Complaints"
      to="complaints"
    />
    <NavbarItem icon="envelope-exclamation" label="Offenses" to="offenses" />
    <NavbarItem icon="calendar-check" label="Appointments" to="appointments" />
    <NavbarItem icon="flag" label="Reports" to="reports" />
    <NavbarItem icon="card-text" label="Surveys" to="surveys" />
  </div>
  <div>
    <NavbarItem onclick={logout} icon="door-open" label="Logout" />
  </div>
</aside>

<style>
  aside {
    transition: all 0.3s ease;
  }
  aside div {
    transition: all 0.3s ease;
  }
  aside img {
    transition: all 0.1s linear;
  }
</style>
