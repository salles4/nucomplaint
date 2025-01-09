<script>
  import { auth, user_id } from "../store";
  import { replace } from "svelte-spa-router";
  import { supabase } from "../supabase";
  import { fly } from "svelte/transition";
  import { onMount } from "svelte";
  import Loader from "../lib/Loader.svelte";
  import numoa from '/img/numoa.png'
  import { Eye, EyeOff } from "lucide-svelte";
  
  export let params = "";
  console.log(params)

  let loginPage = true;
  let disableButton = false;

  let emailInput, passwordInput;
  let studentID, regEmail, regPass, confirmPass, fName, lName, contact, address, gender;
  
  let showPass = false, showRegpass = false, showConfirmPass = false

  let credentials;

  async function changePassword() {

    if(regPass != confirmPass){
      alert("Password does not match.")
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    console.log(user);

    await supabase.auth.updateUser({ password: regPass })

    alert("Successfully changed Password!")
  }
  function onInput(event) {
  return event.target.value;
  }
</script>
{#if credentials}
<div class="absolute top-0 right-0 text-center h-[100px] overflow-auto">
  <table>
    <tr>
      <th class="px-2">Email</th>
      <th class="px-2">Password</th>
      <th class="px-2">Account Type</th>
    </tr>
    {#each credentials as account}
    <tr>
      <td>{account.email}</td>
      <td>{account.password}</td>
      <td>{account.account_type}</td>
    </tr>
    {/each}
  </table>
</div>
{/if}
<div class="entry flex justify-center items-center min-h-[100svh] min-w-full " style="background-image: url({numoa});">
  <div class="field bg-white rounded-xl shadow-lg {loginPage ? "md:h-[320px] h-[380px] w-[550px] p-12" : "p-8 h-[620px] md:w-[550px] max-w-svw"}">
    {#if loginPage}
      <form
        class="flex flex-col gap-2 my-auto"
        on:submit|preventDefault={() => changePassword()}
      >
        <div class="text-2xl text-center">Reset password</div>
        <div class="row">
          <label for="password"> Password: </label>
          <div class="md:w-[65%] flex">
            <input class="!grow " required type={showRegpass ? "text" : "password"} id="password" on:input={(e) => regPass = onInput(e)} />
            <button class="btn btn-sm btn-ghost" type="button" on:click={() => showRegpass = !showRegpass}>{#if showRegpass}<EyeOff />{:else}<Eye />{/if}</button>
          </div>
        </div>
        <div class="row text-nowrap">
          <label for="confirmPassword"> Confirm Password: </label>
          <div class="md:w-[65%] flex">
            <input class="!grow " required type={showConfirmPass ? "text" : "password"} id="confirmPassword" on:input={(e) => confirmPass = onInput(e)} />
            <button class="btn btn-sm btn-ghost" type="button" on:click={() => showConfirmPass = !showConfirmPass}>{#if showConfirmPass}<EyeOff />{:else}<Eye />{/if}</button>
          </div>
        </div>
        <button type="submit" class="btn btn-secondary" disabled={disableButton}
          >{#if disableButton}
          <Loader />
          {:else}
          Reset
          {/if}</button
        >
      </form>
    {/if}
  </div>
</div>

<style>
  .entry {
    background-size: cover;
  }
  .field {
    transition: all 400ms ease;
    overflow-y: auto;
  }
  label{
    margin: auto;
  }
  input {
    @apply border-2 p-0.5;
  }
</style>
