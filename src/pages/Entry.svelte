<script>
  import { firebase_uid } from "../store";
  import { replace } from "svelte-spa-router";
  import Loader from "../lib/Loader.svelte";
  import numoa from "/img/numoa.png";
  import { Eye, EyeOff } from "lucide-svelte";
  import { firebaseAuth } from "../firebase";
  import { onAuthStateChanged, signOut } from "firebase/auth";
  import { supabase } from "../supabase";
  import Login from "./EntryForms/Login.svelte";
  import Register from "./EntryForms/Register.svelte";
  import Reset from "./EntryForms/Reset.svelte";
  import Verify from "./EntryForms/Verify.svelte";
  import CompleteDetails from "./EntryForms/CompleteDetails.svelte";

  export let params = "";
  console.log(params);
  replace("/");

  let activePage = "";
  let loggedUser;
  let userName;

  onAuthStateChanged(firebaseAuth, (user) => {
    loggedUser = user;
    console.log(loggedUser);

    if (!user) {
      activePage = "login";
      return;
    }
    const verified = user.emailVerified;
    const uid = user.uid;
    
    if (!verified) {
      activePage = "verify";
      return;
    }
    
    getName(uid)
    checkDetails(uid);
  });
  async function getName(uid) {
    const { data: name, error: nameError } = await supabase
      .from("users")
      .select("*")
      .eq("firebase_uid", uid)
      .maybeSingle();

    if (nameError) {
      console.error("Getting Name", nameError);
    } else if (!name) {
      alert("Database Error!");
      console.error("Existing firebase account doesn't exist in supabase");
    } else {
      userName = `${name.first_name} ${name.last_name}`;
    }
  }
  async function checkDetails(uid) {
    const { data, error } = await supabase
      .from("secondary_details")
      .select("*")
      .eq("firebase_uid", uid)
      .maybeSingle();

    if (error) {
      console.error("Error checking ID:", error);
    } else if (data) {
      console.log("ID exists");
    } else {
      console.log("ID does not exist");
      activePage = "completeDetails";
    }
  }
  // logout
  async function logout() {
    try {
      await signOut(firebaseAuth);
      console.log("Logged Out.");
      firebase_uid.set(null);
      // location.reload()
    } catch (error) {
      console.error(error);
      alert(error.message || error);
    }
  }

  function changePage(page) {
    activePage = page;
  }
  const formSize = {
    login: "md:h-[350px] h-[410px] w-[400px] p-12 pt-10",
    register: "p-8 h-full md:h-[520px] md:w-[500px] max-w-svw",
    reset: "md:h-[320px] h-[350px] w-[400px] p-12 pt-10",
    verify: "md:h-[240px] h-[260px] w-[400px] p-12 pt-10",
    completeDetails: "p-8 h-fit md:w-[490px] max-w-svw",
  };
  let warning = true;
</script>
<!-- <div class="{warning ? "block" : "hidden"} absolute bottom-0 w-full p-1 text-sm text-center bg-white overflow-auto">
  This is for a student's school project. This website is used for educational purposes only.
  <button class="btn btn-primary btn-outline btn-xs ms-2" on:click={() => warning = false}>Close</button>
</div> -->
<div
  class="entry flex flex-col justify-center items-center min-h-[100svh] min-w-full"
  style="background-image: url({numoa});"
>
  <div class="field bg-white rounded-xl shadow-lg {formSize[activePage]}">
    {#if activePage == "login"}
      <Login {changePage} />
    {:else if activePage == "register"}
      <Register {changePage} />
    {:else if activePage == "reset"}
      <Reset {changePage} />
    {:else if activePage == "verify"}
      <Verify {changePage} />
    {:else if activePage == "completeDetails"}
      <CompleteDetails />
    {:else}
      <div class="bg-white p-12 rounded-lg">
        <Loader />
      </div>
    {/if}
  </div>
  {#if loggedUser && userName}
    <div
      class="bg-white rounded-xl !p-4 my-2 !h-fit flex gap-8 justify-between items-center {formSize[
        activePage
      ]}"
    >
      Signed in as {userName || "..."}
      <button class="btn btn-error btn-sm" on:click={logout}>Log Out</button>
    </div>
  {/if}
</div>

<style>
</style>
