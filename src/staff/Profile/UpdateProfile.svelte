<script>
  import { fade } from "svelte/transition";
  import { supabase } from "../../supabase";
  import { onMount } from "svelte";
  import { user_id } from "../../store";
  export let data;
  export let updateFunction;
  let studentID = $user_id, emailVal, password, confirmPassword, fNameVal, lNameVal, contactVal, addressVal, genderVal;

  async function getData() {
    const {first_name, last_name, access_data:{email}, secondary_details: {contact, address, gender}} = data
    emailVal = email;
    fNameVal = first_name;
    lNameVal = last_name;
    contactVal = contact;
    addressVal = address;
    genderVal = gender;
  }
  function updateClicked(){
    if(password != confirmPassword){
      alert("Password is not the same")
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(emailVal)){
      alert("Invalid email")
      return;
    }else if(!emailVal.endsWith("@nu-moa.edu.ph")){
      alert("Email should end with '@nu-moa.edu.ph'")
      return;
    }

    const newData = {
      email: emailVal,
      studentID: studentID,
      password: password,
      fName: fNameVal,
      lName: lNameVal,
      address: addressVal,
      contact: contactVal,
      gender: genderVal
    }
    updateFunction(newData)
  }
  onMount(getData)
</script>

<div class="h-full flex" in:fade>
  <div class="bg-white min-w-[200px] max-w-[900px] p-4 md:p-12 py-6 h-fit m-auto flex flex-col gap-3">
      <h2 class="text-center text-2xl font-bold">Update Profile</h2>
      <hr class="py-1">
      <div class="row">
        <div class="w-full lg:!w-1/2 px-4">
        <div class="row">
          <label for="studID"> Student ID: </label>
          <input required type="number" id="studID" disabled bind:value={studentID} />
        </div>
        <div class="row">
          <label for="email"> Email: </label>
          <input required type="text" id="email" bind:value={emailVal} />
        </div>
        <div class="row">
          <label for="password"> Password: </label>
          <input required type="password" id="password" bind:value={password} />
        </div>
        <div class="row">
          <label for="confirmPassword"> Confirm Password: </label>
          <input required type="password" id="confirmPassword" bind:value={confirmPassword} />
        </div>
        </div>
        <div class="w-full lg:!w-1/2 px-4">
         <div class="row">
          <label for="fName"> First Name: </label>
          <input required type="text" id="fName" bind:value={fNameVal} />
        </div>
        <div class="row">
          <label for="lName"> Last Name: </label>
          <input required type="text" id="lName" bind:value={lNameVal} />
        </div>
        <div class="row">
          <label for="contact"> Contact: </label>
          <input required type="text" id="contact" bind:value={contactVal} />
        </div>
        <div class="row">
          <label for="address"> Address: </label>
          <input required type="text" id="address" bind:value={addressVal} />
        </div>
        <div class="row">
          <label for="gender"> Gender: </label>
          <select name="gender" id="gender" required bind:value={genderVal}>
            <option value="" selected disabled>Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        </div>
      </div>
      
       
      <hr>
      
    <div class="ms-auto gap-4">
      <button class="btn btn-secondary" on:click={updateClicked}>Update</button>
      <button class="btn btn-secondary btn-outline" on:click>Cancel</button>
    </div>
  </div>
</div>
<style>
  
  label{
    margin: auto;
  }
</style>