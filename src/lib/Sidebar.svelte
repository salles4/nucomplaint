<script>
  import { auth, sidebarLabel } from "../store";
  import { ArrowLeftFromLine, ArrowRightFromLine, CalendarCheck, FileChartLine, Gavel, House, LogOut, MessageSquareWarning, Newspaper, User } from 'lucide-svelte';
  import NavbarItem from "./NavbarItem.svelte";

  export let name, img, id;

  const tabs = {
    staff: [
      { "icon": House, label: "Dashboard", to: "dashboard", routes: ["/students", "/guards"] },
      { "icon": User, label: "Profile", to: "profile" },
      { "icon": MessageSquareWarning, label: "Complaints", to: "complaints" },
      { "icon": Gavel, label: "Offenses", to: "offenses" },
      { "icon": CalendarCheck, label: "Appointments", to: "appointments" },
      { "icon": FileChartLine, label: "Reports", to: "reports" },
      { "icon": Newspaper, label: "Surveys", to: "surveys" },
    ],
    student: [
      { icon: House, label: "Dashboard", to: "dashboard" },
      { icon: User, label: "Profile", to: "profile" },
      { icon: MessageSquareWarning, label: "Complaints", to: "complaints" },
      { icon: Gavel, label: "Offenses", to: "offenses" },
    ],
    guard: [
      { icon: Gavel, label: "Add Offense", to: "offense" },
      { icon: Newspaper, label: "Record", to: "record" },
    ]
  };
  function toggleSidebar() {
    sidebarLabel.set(!$sidebarLabel);
  }
  function logout() {
    auth.set(null);
    localStorage.removeItem("v0Auth");
  }
</script>

<aside
  class="{$sidebarLabel
    ? 'min-w-[300px]'
    : 'min-w-[70px]'} flex flex-col h-[100vh] overflow-y-auto w-fit shadow-xl bg-white sticky top-0"
>
  <!-- Toggle Sidebar Button -->
  <button
    on:click={toggleSidebar}
    class="{$sidebarLabel
      ? 'absolute self-end'
      : 'self-center'} p-2 px-3 text-lg m-2 rounded-lg border hover:cursor-pointer"
  >
  {#if $sidebarLabel}
    <ArrowLeftFromLine size="20" />
  {:else}
    <ArrowRightFromLine size="20" />
  {/if}
  </button>
 
  <!-- Profile -->
  <div
    class="{$sidebarLabel
      ? 'px-14 pt-4'
      : 'px-2'}  flex-shrink-0 flex flex-col pb-2 items-center"
  >
    <img
      class="{$sidebarLabel ? 'w-[120px]' : 'w-[48px]'} rounded-full"
      src={img}
      alt=""
    />
    <div class="{$sidebarLabel ? 'block' : 'hidden'} text-center">
      <div class="pt-2">{name}</div>
      <div>{id}</div>
    </div>
  </div>
  <div class="border self-center w-[75%] mb-2"></div>
  <!-- Sidebar Tabs -->
  <div class="flex-grow">
    {#each tabs[$auth] as { icon, label, to, routes = [] }}
      <NavbarItem {icon} {label} {to} {routes} />
    {/each}
  </div>
  <div>
    <NavbarItem onclick={logout} icon={LogOut} label="Logout" />
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
