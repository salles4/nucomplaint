<script>
  import { auth, sidebarLabel, user_id } from "../store";
  import { ArrowLeftFromLine, ArrowRightFromLine, CalendarCheck, FileChartLine, Gavel, House, LogOut, MessageSquareWarning, Newspaper, User } from 'lucide-svelte';
  import NavbarItem from "./NavbarItem.svelte";
  import { supabase } from "../supabase";
  import { onMount } from "svelte";
  import Loader from "./Loader.svelte";

  let name, id, img = "https://ctwbdevl.vercel.app/lab/img/Salles.jpg";

  const tabs = {
    staff: [
      { "icon": House, label: "Dashboard", to: "dashboard", routes: ["/students", "/guards"] },
      { "icon": User, label: "Profile", to: "profile" },
      { "icon": MessageSquareWarning, label: "Complaints", to: "complaints" },
      { "icon": Gavel, label: "Offenses", to: "offenses", routes: ["/offense/add"] },
      { "icon": CalendarCheck, label: "Appointments", to: "appointments" },
      { "icon": FileChartLine, label: "Reports", to: "reports" },
      { "icon": Newspaper, label: "Surveys", to: "surveys" },
    ],
    student: [
      { icon: House, label: "Dashboard", to: "dashboard" },
      { icon: User, label: "Profile", to: "profile" },
      { icon: MessageSquareWarning, label: "Complaints", to: "complaints", routes: ["/addComplaint"] },
      { icon: Gavel, label: "Offenses", to: "offenses" },
    ],
    guard: [
      { icon: Gavel, label: "Add Offense", to: "offense", routes: ["/offense/add"] },
      { icon: Newspaper, label: "Record", to: "record" },
    ]
  };
  async function getDetails() {
    const {data, error} = await supabase
    .from("primary_details")
    .select("*")
    .eq("user_id", $user_id)
    .single()
    
    if(error){
      alert(error.message);
      console.error(error)
    }
    const {first_name, last_name, user_id: loggedID} = data
    name = `${first_name} ${last_name}`;
    id = ` ${loggedID.toString().substring(0, 4)}-${loggedID.toString().slice(4)}`
  }
  onMount(getDetails)

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
    ? 'sm:min-w-[300px] min-w-full'
    : 'sm:min-w-[70px] min-w-0 max-w-0 sm:max-w-[70px]'} flex flex-col h-[100svh] overflow-y-auto w-fit shadow-xl bg-white absolute z-[100] sm:sticky top-0"
>
  <!-- Toggle Sidebar Button -->
  <button
    on:click={toggleSidebar}
    class="{$sidebarLabel
      ? 'absolute self-end sm:top-0 top-6'
      : 'self-center sm:static fixed top-6 left-0'} p-2 px-3 text-lg m-2 rounded-lg border hover:cursor-pointer bg-white"
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
      : 'px-2'} flex flex-col pb-2 items-center"
  >
  {#if img && id}
    <img
      class="{$sidebarLabel ? 'w-[120px]' : 'w-[48px]'} rounded-full"
      src={img}
      alt=""
    />
    <div class="{$sidebarLabel ? 'block' : 'hidden'} text-center">
      <div class="pt-2 text-nowrap">{name}</div>
      <div>{id}</div>
    </div>
  {:else}
  <Loader />
  {/if}
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
    transition: all 0.3s ease, height 0s;
  }
  aside div {
    transition: all 0.3s ease;
  }
  aside img {
    transition: all 0.1s linear;
  }
</style>
