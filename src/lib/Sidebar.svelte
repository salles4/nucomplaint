<script>
  import { auth, sidebarLabel, user_id, user_name } from "../store";
  import {
    ArrowLeftFromLine,
    ArrowRightFromLine,
    CalendarCheck,
    FileChartLine,
    Gavel,
    House,
    Image,
    List,
    LogOut,
    MessageSquareWarning,
    Newspaper,
    QrCode,
    User,
    X,
  } from "lucide-svelte";
  import NavbarItem from "./NavbarItem.svelte";
  import { supabase } from "../supabase";
  import { onMount } from "svelte";
  import Loader from "./Loader.svelte";
  import { generateQR } from "../scanner";
  import { signOut } from "firebase/auth";
  import { firebaseAuth } from "../firebase";
  import { initSession } from "../session-timeout";

  let name,
    id,
    img = "https://ctwbdevl.vercel.app/lab/img/Salles.jpg";
  let showQR = false;

  const tabs = {
    staff: [
      {
        icon: House,
        label: "Dashboard",
        to: "dashboard",
        routes: ["/students", "/update/"],
      },
      { icon: User, label: "Profile", to: "profile", routes:["/updatepass"] },
      { icon: MessageSquareWarning, label: "Complaints", to: "complaints/", routes: ["/complaint/", "/complaints"], },
      {
        icon: Gavel,
        label: "Offenses",
        to: "offenses",
        routes: ["/offense/add", "/offense/"],
      },
      { icon: CalendarCheck, label: "Appointments", to: "appointments" },
      { icon: FileChartLine, label: "Reports", to: "reports" },
      { icon: Newspaper, label: "Surveys", to: "surveys" },
    ],
    student: [
      { icon: House, label: "Dashboard", to: "dashboard" },
      { icon: User, label: "Profile", to: "profile" },
      {
        icon: MessageSquareWarning,
        label: "Complaints",
        to: "complaints",
        routes: ["/addComplaint", "/complaint/"],
      },
      { icon: Gavel, label: "Offenses", to: "offenses" , routes: ["/offense/"],},
    ],
    guard: [
      {
        icon: Gavel,
        label: "Add Offense",
        to: "offense/add",
        routes: ["/offense/add"],
      },
      { icon: Newspaper, label: "Records", to: "records" },
    ],
  };
  async function getDetails() {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", $user_id)
      .single();

    if (error) {
      alert(error.message);
      console.error(error);
    }
    const { first_name, last_name, user_id: loggedID } = data;
    // name = `${first_name} ${last_name}`;
    name = $user_name
    id = ` ${loggedID.toString().substring(0, 4)}-${loggedID.toString().slice(4)}`;
  }
  onMount(getDetails);

  function toggleSidebar() {
    sidebarLabel.set(!$sidebarLabel);
  }
  function toggleQR() {
    showQR = !showQR;
    if (showQR) {
      generateQR(id);
    }
  }
  function logout() {
    sidebarLabel.set(false);
    auth.set(null);
    localStorage.removeItem("v0Auth");
    signOut(firebaseAuth);
  }
  initSession();
  let defaultImg;
</script>

<aside
  class="{$sidebarLabel
    ? 'sm:min-w-[300px] min-w-full'
    : 'sm:min-w-[70px] min-w-0 max-w-0 sm:max-w-[70px]'} flex flex-col h-[100svh] overflow-y-auto w-fit shadow-xl bg-white absolute z-[20] sm:sticky top-0 print:hidden"
>
  <!-- Toggle Sidebar Button -->
  <button
    on:click={toggleSidebar}
    class="{$sidebarLabel
      ? 'absolute self-end sm:top-0 top-1'
      : 'self-center sm:static fixed top-1 left-0'} p-2 px-3 text-lg m-2 rounded-lg border hover:cursor-pointer bg-white"
  >
    {#if $sidebarLabel}
    <X size="20" class="sm:hidden" />
    <ArrowLeftFromLine size="20" class="hidden sm:block" />
    {:else}
    <List size="20" class="sm:hidden" />
    <ArrowRightFromLine size="20" class="hidden sm:block" />
    {/if}
  </button>

  <!-- Profile -->
  <div
    class="{$sidebarLabel
      ? 'px-14 pt-4'
      : 'px-2'} flex flex-col pb-2 items-center"
  >
    {#if img && id}
      <button on:click={() => toggleQR()}>
        {#if defaultImg}
          <img
            id="img-cover"
            class="{$sidebarLabel ? 'w-[120px] h-[120px]' : 'w-[48px] h-[48px]'} {!showQR ||
          !$sidebarLabel
            ? 'block'
            : 'hidden'} rounded-full"
            src="./img/default_profile.jpg"
            alt="book cover"
            style="object-fit: contain"
          />
        {:else}
          <img
            id="img-cover"
            class="{$sidebarLabel ? 'w-[120px] h-[120px]' : 'w-[48px] h-[48px]'} {!showQR ||
          !$sidebarLabel
            ? 'block'
            : 'hidden'} rounded-full border"
            src="https://nlkprjuuixtprwiqypcy.supabase.co/storage/v1/object/public/profile_pics/{$user_id}.jpg"
            on:error={() => {defaultImg = true; console.log($user_id)}}
            alt="book cover"
            style="object-fit: contain"
          />
        {/if}
      </button>
      <button on:click={() => toggleQR()}>
        <canvas
          id="IDQR"
          class="{$sidebarLabel ? 'w-[120px]' : 'w-[48px]'} {showQR &&
          $sidebarLabel
            ? 'block'
            : 'hidden'}"
        ></canvas>
      </button>
      <div class="{$sidebarLabel ? 'block' : 'hidden'} text-center">
        <div class="pt-2 text-nowrap">{name}</div>
        <button class="" on:click={() => toggleQR()}>
          {id}
          {#if showQR}
            <Image class="mx-auto" />
          {:else}
            <QrCode class="mx-auto" />
          {/if}
        </button>
      </div>
    {:else}
      <div class="min-h-[150px] flex">
        <Loader />
      </div>
    {/if}
  </div>
  <div class="border self-center w-[75%] mb-2"></div>
  <!-- Sidebar Tabs -->
  {#if $auth}
    <div class="flex-grow">
      {#each tabs[$auth] as { icon, label, to, routes = [] }}
        <NavbarItem {icon} {label} {to} {routes} />
      {/each}
    </div>
  {/if}
  <div>
    <NavbarItem onclick={logout} icon={LogOut} label="Logout" />
  </div>
</aside>

<style>
  aside {
    transition:
      all 0.3s ease,
      height 0s;
  }
  aside div {
    transition: all 0.3s ease;
  }
  aside img {
    transition: all 0.1s linear;
  }
</style>
