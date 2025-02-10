<script>
  import { sendPasswordResetEmail } from "firebase/auth";
  import { firebaseAuth } from "../../firebase";
  import Loader from "../../lib/Loader.svelte";
  import { supabase } from "../../supabase";

  export let changePage;
  let resetEmail
  let disableButton = false;
  
    // reset Password
  async function resetPass() {
    disableButton = true
    try {
      const {data, error} = await supabase
      .from("users")
      .select("*")
      .eq("email", resetEmail)
      .maybeSingle()
      if(error){
        console.error(error);
        alert("Failed to send, Please try again.")
      }else if(!data){
        console.error(data);
        throw new Error("Invalid Email");
      }
      
      await sendPasswordResetEmail(firebaseAuth, resetEmail);
      alert("Email Sent! Check your email to reset your password!");
      changePage("login")
    } catch (error) {
      console.error(error);
      alert(error.message || error);
    }
    disableButton = false
  }
</script>

<form
  class="flex flex-col gap-2 my-auto"
  on:submit|preventDefault={() => resetPass()}
>
  <div class="text-2xl text-center font-bold">Reset Password</div>
  <div class="text-center text-sm mb-2">We will send a reset password link to your email.</div>
  <div class="row">
    <label for="username"> Email: </label>
    <input
      type="text"
      name="resetEmail"
      id="resetEmail"
      bind:value={resetEmail}
      placeholder="Email"
    />
  </div>
  <button type="submit" class="btn btn-secondary" disabled={disableButton}
    >{#if disableButton}
      <Loader />
    {:else}
      Reset Password
    {/if}</button
  >
  <div class="text-center">
    <a
      on:click|preventDefault={() => {
        changePage("login");
      }}
      href="./#/register">Back</a
    >
  </div>
</form>
