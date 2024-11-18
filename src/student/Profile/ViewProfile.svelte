<script>
  import { fade } from "svelte/transition";
  import { supabase } from "../../supabase";
  import { onMount } from "svelte";
  import { replace } from "svelte-spa-router";
  import moment from "moment";
  import ChangeProfilePic from "../../lib/ChangeProfilePic.svelte";
  import { user_id } from "../../store";

  export let data;
  let changeProfile = false;
  let studentID = $user_id,
    emailVal,
    nameVal,
    lNameVal,
    contactVal,
    birthdateVal,
    genderVal,
    provinceVal,
    cityVal,
    regionVal,
    barangayVal,
    houseNumVal,
    postalVal;

  function getData() {
    const {
      first_name,
      last_name,
      middle_initial,
      email,
      secondary_details: { contact, gender, birth_date },
      user_address: {
        region_code,
        province_code,
        city_code,
        barangay_code,
        house_number,
        postal_code,
      },
    } = data;
    emailVal = email;
    nameVal = `${first_name} ${middle_initial}${!middle_initial.endsWith(".") ? "." : ""} ${last_name}`;
    contactVal = contact;
    birthdateVal = moment(birth_date).format("MMMM DD, YYYY");
    genderVal = gender;
    provinceVal = province_code;
    cityVal = city_code;
    regionVal = region_code;
    barangayVal = barangay_code;
    houseNumVal = house_number;
    postalVal = postal_code;
  }
  onMount(getData);
</script>

<div class="h-full flex" in:fade>
  <div
    class="bg-white min-w-[300px] w-full lg:max-w-[900px] max-w-[500px] p-4 py-6 h-fit m-auto flex flex-col gap-3"
  >
    <h2 class="text-center text-2xl font-bold">Your Profile</h2>
    <hr class="py-1" />
    
    <hr class="py-1">
    <div class="row">
      <div class="sect">
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
          <input
            disabled
            required
            type="text"
            id="email"
            bind:value={emailVal}
          />
        </div>

        <div class="row">
          <label for="fName"> Name: </label>
          <input
            disabled
            required
            type="text"
            id="fName"
            bind:value={nameVal}
          />
        </div>
        <div class="row">
          <label for="contact"> Contact: </label>
          <input
            disabled
            required
            type="text"
            id="contact"
            bind:value={contactVal}
          />
        </div>
        <div class="row">
          <label for="birth_date"> Birth Date: </label>
          <input
            disabled
            required
            type="text"
            id="birth_date"
            bind:value={birthdateVal}
          />
        </div>
        <div class="row">
          <label for="gender"> Gender: </label>
          <input id="gender" disabled required bind:value={genderVal} />
        </div>
      </div>
      <div class="sect">
        <div class="row">
          <label for="region"> Region: </label>
          <input
            name="region"
            id="region"
            bind:value={regionVal}
            required
            disabled
          />
        </div>
        <div class="row">
          <label for="province"> Province: </label>
          <input
            name="province"
            id="province"
            bind:value={provinceVal}
            required
            disabled
          />
        </div>
        <div class="row">
          <label for="city"> City/Municipality: </label>
          <input name="city" id="city" bind:value={cityVal} required disabled />
        </div>
        <div class="row">
          <label for="barangay"> Barangay: </label>
          <input
            name="barangay"
            id="barangay"
            bind:value={barangayVal}
            required
            disabled
          />
        </div>
        <div class="row">
          <label for="house"> House No./St.: </label>
          <input
            required
            type="text"
            id="house"
            bind:value={houseNumVal}
            disabled
          />
        </div>
        <div class="row">
          <label for="postal"> Postal Code: </label>
          <input
            required
            type="text"
            id="postal"
            bind:value={postalVal}
            disabled
          />
        </div>
      </div>
    </div>
    <hr />
    <div class="flex items-center">
      <!-- <div class="link link-secondary">Change Password</div> -->
      <div class="ms-auto gap-4">
        <!-- <button class="btn btn-secondary" on:click>Edit Profile</button> -->
         <button class="btn btn-secondary btn-sm" on:click={()=>changeProfile = true}>Change Picture</button>
        <button
          class="btn btn-secondary btn-outline btn-sm"
          on:click={() => replace("/")}>Back</button
        >
      </div>
    </div>
  </div>
</div>
{#if changeProfile}
<ChangeProfilePic closeModal={()=>changeProfile = false} />
{/if}
<style>
  input {
    width: 60% !important;
  }
  label {
    width: 40% !important;
  }
  .sect{
    @apply lg:w-[50%] w-full px-2
  }
</style>
