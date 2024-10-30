<script>
  import { fade } from "svelte/transition";
  import { supabase } from "../../supabase";
  import { onMount } from "svelte";
  import { replace } from 'svelte-spa-router';

  export let data;
  let studentID = localStorage.getItem("user_id"),
    emailVal,
    fNameVal,
    lNameVal,
    contactVal,
    addressVal,
    genderVal;

  function getData() {
    const {
      first_name,
      last_name,
      access_data: { email },
      secondary_details: { contact, address, gender },
    } = data;
    emailVal = email;
    fNameVal = first_name;
    lNameVal = last_name;
    contactVal = contact;
    addressVal = address;
    genderVal = gender;
  }
  onMount(getData);
</script>

<div class="h-full flex" in:fade>
  <div
    class="bg-white min-w-[200px] max-w-[500px] p-4 md:p-12 py-6 h-fit m-auto flex flex-col gap-3"
  >
    <h2 class="text-center text-2xl font-bold">Your Profile</h2>
    <hr class="py-1" />
    <div class="row">
      <div class="row">
        <label for="studID"> Student ID: </label>
        <input
          required
          type="number"
          id="studID"
          disabled
          bind:value={studentID}
        />
      </div>
      <div class="row">
        <label for="email"> Email: </label>
        <input disabled required type="text" id="email" bind:value={emailVal} />
      </div>

      <div class="row">
        <label for="fName"> First Name: </label>
        <input disabled required type="text" id="fName" bind:value={fNameVal} />
      </div>
      <div class="row">
        <label for="lName"> Last Name: </label>
        <input disabled required type="text" id="lName" bind:value={lNameVal} />
      </div>
      <div class="row">
        <label for="contact"> Contact: </label>
        <input disabled required type="text" id="contact" bind:value={contactVal} />
      </div>
      <div class="row">
        <label for="address"> Address: </label>
        <input disabled required type="text" id="address" bind:value={addressVal} />
      </div>
      <div class="row">
        <label for="gender"> Gender: </label>
        <select name="gender" id="gender" disabled required bind:value={genderVal}>
          <option value="" selected disabled>Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>
    </div>

    <hr />
    <div class="flex items-center">
      <!-- <div class="link link-secondary">Change Password</div> -->
      <div class="ms-auto gap-4">
        <button class="btn btn-secondary" on:click>Edit Profile</button>
        <button class="btn btn-secondary btn-outline" on:click={() => replace("/")}>Back</button>
      </div>
    </div>
  </div>
</div>

<style>

</style>
