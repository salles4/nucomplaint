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

  replace("/");
  let credentials;
  async function getAccessData() {
    const { data, error } = await supabase
      .from("access_data")
      .select("*")

      credentials = data
  }
  onMount(() => {getAccessData()})
  async function login() {
    disableButton = true
    emailInput = emailInput.trim();
    const { data, error } = await supabase
      .from("access_data")
      .select("account_type, user_id")
      .eq("email", emailInput)
      .eq("password", passwordInput)
      .maybeSingle();

    if (error) {
      console.error(error);
      return;
    }
    if (!data) {
      disableButton = false
      alert("Wrong Credentials.");
      return;
    }

    localStorage.setItem("v0Auth", data.account_type);
    localStorage.setItem("user_id", data.user_id);
    auth.set(data.account_type);
    user_id.set(data.user_id);
  }
  async function register() {
    const { data: id_data, error: id_error } = await supabase
      .from("access_data")
      .select()
      .eq("user_id", studentID);

    if (id_data.length != 0) {
      alert("Student ID already exists");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(regEmail)){
      alert("Invalid email")
      return;
    }else if(!regEmail.endsWith("@nu-moa.edu.ph")){
      alert("Email should end with '@nu-moa.edu.ph'")
      return;
    }

    const { data: email_data, error:email_error } = await supabase
      .from("access_data")
      .select()
      .eq("email", regEmail);
    if (email_data.length != 0) {
      alert("Email already exists");
      return;
    }
    if(regPass != confirmPass){
      alert("Password does not match.")
      return;
    }

    const { error: registerError } = await supabase.rpc("register_student", {
      emailinput: regEmail,
      passwordinput: regPass,
      idinput: studentID,
      fnameinput: fName,
      lnameinput: lName,
      addressinput: address,
      contactinput: contact,
      genderinput: gender
    });
    if (registerError){
      console.error(registerError);
      return;
    }
    alert("Successfully created an account! Please Log in!")
    loginPage = true;
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
  <div class="field bg-white rounded-xl shadow-lg {loginPage ? "md:h-[320px] h-[380px] w-[400px] p-12" : "p-8 h-[620px] md:w-[550px] max-w-svw"}">
    {#if loginPage}
      <form
        class="flex flex-col gap-2 my-auto"
        on:submit|preventDefault={() => login()}
      >
        <div class="text-2xl text-center">Log In</div>
        <div class="row">
          <label for="username"> Email: </label>
          <input required type="text" id="username" bind:value={emailInput} />
        </div>
        <div class="row">
          <label for="password"> Password: </label>
          <div class="md:w-[70%] flex">
            <input class="!grow rounded-e-none border-e" required type={showPass ? "text" : "password"} id="password" on:input={(e) => passwordInput = onInput(e)} />
            <button class="btn btn-sm rounded-s-none border-black/20 border-2 border-s px-1" type="button" on:click={() => showPass = !showPass}>{#if showPass}<EyeOff />{:else}<Eye />{/if}</button>
          </div>
        </div>
        <button type="submit" class="btn btn-secondary" disabled={disableButton}
          >{#if disableButton}
          <Loader />
          {:else}
          Log In
          {/if}</button
        >
        <div class="text-center">
          Don't have an account yet? <a
            on:click|preventDefault={() => {
              loginPage = false;
            }}
            href="./#/register">Register</a
          >
        </div>
      </form>
    {:else}
      <form
        class="field register flex gap-2 flex-col"
        on:submit|preventDefault={() => register()}
      >
        <div class="text-2xl text-center">Register</div>
        
        <div class="row">
          <label for="studID"> Student ID: </label>
          <input required type="number" id="studID" bind:value={studentID} />
        </div>
        <div class="row">
          <label for="email"> Email: </label>
          <input required type="email" id="email" bind:value={regEmail} />
        </div>
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
        <div class="row">
          <label for="fName"> First Name: </label>
          <input required type="text" id="fName" bind:value={fName} />
        </div>
        <div class="row">
          <label for="lName"> Last Name: </label>
          <input required type="text" id="lName" bind:value={lName} />
        </div>
        <div class="row">
          <label for="contact"> Contact: </label>
          <input required type="text" id="contact" bind:value={contact} />
        </div>
        <div class="row">
          <label for="address"> Address: </label>
          <input required type="text" id="address" bind:value={address} />
        </div>
        <div class="row">
          <label for="gender"> Gender: </label>
          <select name="gender" id="gender" required bind:value={gender}>
            <option value="" selected disabled>Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <button type="submit" class="btn btn-secondary" disabled={disableButton}
          >Register</button
        >
        <div class="text-center">
          Already have an account? <a
            on:click|preventDefault={() => {
              loginPage = true;
            }}
            href="./#/register">Login</a
          >
        </div>
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
  input, select {
    @apply border-2 p-0.5;
  }
  .register label{
    @apply md:w-[35%]
  }
  .register input, .register select{
     @apply md:w-[65%]
  }
</style>
