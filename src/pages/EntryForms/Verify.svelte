<script>
  import { sendEmailVerification, deleteUser, getAuth, signOut } from "firebase/auth";
  import { firebaseAuth } from "../../firebase";
  import Loader from "../../lib/Loader.svelte";
  import { onMount } from "svelte";
  import { supabase } from "../../supabase";

  export let changePage;
  let disableButton = false;
  let failedSupabase = false;
  async function verifyEmail() {
    try {
      await sendEmailVerification(firebaseAuth.currentUser);
      alert("Sucessfull! Please check your email to email verification.");
    } catch (error) {
      console.error(error);
      alert(error.code);
    }
  }
  async function getName() {
    const { data: name, error: nameError } = await supabase
      .from("users")
      .select("*")
      .eq("firebase_uid", firebaseAuth.currentUser.uid)
      .maybeSingle();
    
    if (nameError) {
      console.error("Getting Name", nameError);
    } else if (!name) {
      console.error("Existing firebase account doesn't exist in supabase");
      changePage("verify")
      failedSupabase = true;
    }
  }
  function registerAgain(){
    deleteUser(getAuth().currentUser)
    .then(() => {
      location.reload()
    })
    .catch((error) => {
      alert(error)
    })
  }
  onMount(getName)
</script>

<div class="flex flex-col gap-2 my-auto relative">
  <div class="text-2xl text-center">Verify Email</div>
  <div class="text-center text-sm">To ensure the security of your account, A verification link will be sent to your email.</div>
  <button
    class="btn btn-secondary"
    disabled={disableButton}
    on:click={verifyEmail}
    >{#if disableButton}
      <Loader />
    {:else}
      Send verfication
    {/if}</button
  >
  {#if failedSupabase}
  <div class="absolute bg-white top-0 h-full z-20 text-center">
    <div class="text-2xl text-center">Retry</div>
    <div class="text-center text-sm mt-2">
      Something went wrong while creating your account. Log in again. if problem persists, reset your account and register again.
    </div>
    <div class="grid grid-cols-2 gap-4 mt-4">
      <button class="btn btn-primary" on:click={() => signOut(firebaseAuth).catch(error => console.error(error))}>Log Out</button>
      <button class="btn btn-error btn-outline" on:click={registerAgain}>Reset Account</button>
    </div>
  </div>
  {/if}
</div>
