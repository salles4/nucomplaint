<script>
  import { Eye, EyeOff } from "lucide-svelte";
  import {
    getAuth,
    reauthenticateWithCredential,
    EmailAuthProvider,
    updatePassword,
  } from "firebase/auth";
  import { fade } from "svelte/transition";
  import Loader from "../Loader.svelte";
  import { pop } from 'svelte-spa-router'
  import { modal } from "../../store";

  let emailInput, oldPassInput, newPassInput, confirmPassInput;
  let disableButton;
  let showPass = false, showConfirmPass = false, showNewPass = false;

  function changePass() {
    const auth = getAuth();
    const user = auth.currentUser;

    // TODO(you): prompt the user to re-provide their sign-in credentials
    const credential = EmailAuthProvider.credential(user.email, oldPassInput);

    if (newPassInput != confirmPassInput) {
      alert("Password does not match.");
      return;
    }
    reauthenticateWithCredential(user, credential)
      .then(() => {
        // User re-authenticated.
        updatePassword(user, newPassInput)
          .then(() => {
            modal.set({
              title: "Successful",
              description: "Password successfully changed",
              pOption: "Ok",
              sOption: "Cancel",
              primaryFn: () => {modal.set(null); pop()}
            })
          })
          .catch((error) => {
            alert(`Error while changing password: ${error}`)
          });
      })
      .catch((error) => {
        alert(`Invalid Credentials: ${error}`)
      });
  }

  function onInput(event) {
    return event.target.value;
  }
</script>

<div class="h-full flex " in:fade>
  <form
    class="bg-white min-w-[300px] w-full lg:max-w-[500px] max-w-[500px] p-4 py-6 h-fit m-auto flex flex-col gap-3"
    on:submit|preventDefault={changePass}
  >
    <h2 class="text-center text-2xl font-bold">Change Password</h2>

    <hr class="py-1" />

    <div class="row">
      <label for="email"> Email: </label>
      <input
        required
        type="email"
        id="email"
        autocomplete="email"
        bind:value={emailInput}
      />
    </div>
    <div class="row">
      <label for="password"> Password: </label>
      <div class="md:w-[60%] flex">
        <input
          class="!grow rounded-e-none border-e"
          required
          type={showPass ? "text" : "password"}
          id="password"
          on:input={(e) => (oldPassInput = onInput(e))}
        />
        <button
          class="btn btn-sm rounded-s-none border-black/20 border-2 border-s px-1"
          type="button"
          on:click={() => (showPass = !showPass)}
          >{#if showPass}<EyeOff />{:else}<Eye />{/if}</button
        >
      </div>
    </div>
    <div class="row">
      <label for="new password">New Password: </label>
      <div class="md:w-[60%] flex">
        <input
          class="!grow rounded-e-none border-e"
          required
          type={showNewPass ? "text" : "password"}
          id="new password"
          on:input={(e) => (newPassInput = onInput(e))}
        />
        <button
          class="btn btn-sm rounded-s-none border-black/20 border-2 border-s px-1"
          type="button"
          on:click={() => (showNewPass = !showNewPass)}
          >{#if showNewPass}<EyeOff />{:else}<Eye />{/if}</button
        >
      </div>
    </div>
    <div class="row">
      <label for="confirmPass">Confirm Password: </label>
      <div class="md:w-[60%] flex">
        <input
          class="!grow rounded-e-none border-e"
          required
          type={showConfirmPass ? "text" : "password"}
          id="confirmPass"
          on:input={(e) => (confirmPassInput = onInput(e))}
        />
        <button
          class="btn btn-sm rounded-s-none border-black/20 border-2 border-s px-1"
          type="button"
          on:click={() => (showConfirmPass = !showConfirmPass)}
          >{#if showConfirmPass}<EyeOff />{:else}<Eye />{/if}</button
        >
      </div>
    </div>
    <div class="flex gap-4">

      <button type="submit" class="btn btn-secondary w-1/2" disabled={disableButton}
      >{#if disableButton}
        <Loader />
        {:else}
        Change Password
        {/if}</button
        >
        <button type="button" on:click={()=>{pop()}} class="btn btn-primary w-1/2">
          Cancel
        </button>
    </div>
  </form>
</div>
<style>
  input {
    /* width: 60% !important; */
    @apply md:!w-[60%] w-full
  }
  label {
    /* width: 40% !important; */
    @apply md:!w-[40%] w-full
  }

</style>
