<script>
  import { fade } from "svelte/transition";
  import { supabase } from "../../supabase";
  import { onMount } from "svelte";
  import { replace } from "svelte-spa-router";
  import moment from "moment";
  import { auth, user_id } from "../../store";
  import ChangeProfilePic from "../../lib/ChangeProfilePic.svelte";

  export let data;
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
  let department, course, year;
  let changeProfile;
  let studentData;
  async function getData() {
    const {
      first_name,
      last_name,
      middle_initial,
      email,
      secondary_details: { contact, gender, birth_date },
      user_address: {
        region,
        province,
        city,
        barangay,
        house_number,
        postal_code,
      },
    } = data;
    emailVal = email;
    nameVal = `${first_name} ${middle_initial}${!middle_initial.endsWith(".") ? "." : ""} ${last_name}`;
    contactVal = contact;
    birthdateVal = moment(birth_date).format("MMMM DD, YYYY");
    genderVal = gender;
    provinceVal = province;
    cityVal = city;
    regionVal = region;
    barangayVal = barangay;
    houseNumVal = house_number;
    postalVal = postal_code;
    
    const {data:dataa, error} = await supabase
    .from("student_details")
    .select("*")
    .eq("student_id", $user_id)
    .single()
    
    if(error){
      console.error(error);
    }
    console.log(dataa);
    
    studentData = dataa;
    department = dataa.department
    course = dataa.course
    year = dataa.year

  }
  onMount(getData);
</script>

<div class="h-full flex" in:fade>
  <div
    class="bg-white min-w-[500px] w-full lg:max-w-[900px] max-w-[500px] p-4 py-6 h-fit m-auto flex flex-col gap-3"
  >
    <h2 class="text-center text-2xl font-bold">Your Profile</h2>
    
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
        {#if studentData}
        <hr class="my-2">
        <div class="row">
          <label for="department"> Department: </label>
          <input
            required
            type="text"
            id="department"
            bind:value={department}
            disabled
          />
        </div>
        <div class="row">
          <label for="course"> Course: </label>
          <textarea
            required
            rows="2"
            id="course"
            bind:value={course}
            disabled
          />
        </div>
        <div class="row">
          <label for="year"> Year Level: </label>
          <input
            required
            type="text"
            id="year"
            bind:value={year}
            disabled
          />
        </div>
        {/if}
      </div>
      <div class="sect">
        
          <hr class="my-3 lg:hidden block">
        
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
        {#if $auth == "staff"}
        <button class="btn btn-ghost text-secondary underline btn-sm" on:click={()=>changeProfile = true}>Change Picture</button>
        <a href="./#/update/{$user_id}" class="btn btn-secondary btn-sm" >Edit Profile</a>
        {:else}
        <button class="btn btn-secondary btn-sm" on:click={()=>changeProfile = true}>Change Picture</button>
         {/if}
        <button
          class="btn btn-primary btn-outline btn-sm"
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
  input, textarea {
    width: 60% !important;
  }
  label {
    width: 40% !important;
  }
  .sect{
    @apply lg:w-[50%] w-full px-2
  }
</style>
