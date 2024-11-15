<script>
  import { onMount } from "svelte";
  import { supabase } from "../../supabase";
  import { firebase_uid, user_id } from "../../store";
  import { firebaseAuth } from "../../firebase";

  let contactVal, birthdateVal, genderVal, provinceVal, cityVal, regionVal, barangayVal, houseNumVal, postalVal;
  let disableButton = false;
  let regions = [];
  let provinces = []
  let cities = [];
  let barangays = [];
  async function getRegions() {
    fetch("https://psgc.gitlab.io/api/regions/")
    .then(response => response.json())
    .then(data => {
      regions = data
      console.log(data);
    })
  }
  function getProvinces(){
    provinceVal = ""
    fetch(`https://psgc.gitlab.io/api/regions/${regionVal}/provinces/`)
    .then(response => response.json())
    .then(data => {
      provinces = data
      console.log(data);
    })
  }
  function getCities(){
    cityVal = ""
    fetch(`https://psgc.gitlab.io/api/provinces/${provinceVal}/cities-municipalities/`)
    .then(response => response.json())
    .then(data => {
      cities = data
      console.log(data);
    })
  }
  function getBarangays(){
    barangayVal = ""
    fetch(`https://psgc.gitlab.io/api/cities-municipalities/${cityVal}/barangays/`)
    .then(response => response.json())
    .then(data => {
      barangays = data
      console.log(data);
    })
  }
  async function submitAdditionalDetails(){
    disableButton = true
    const {error} = await supabase.rpc("insert_details", {
      logged_firebase_uid: firebaseAuth.currentUser.uid,
      contact_input: contactVal,
      birth_date_input: birthdateVal,
      gender_input: genderVal,
      region: regionVal,
      province: provinceVal,
      city: cityVal,
      barangay: barangayVal,
      house_num: houseNumVal,
      postal: postalVal,
    })

    if(error){
      alert(error.message)
      console.error(error);
      disableButton = false;
      return;
    }
    location.reload()
  }
  onMount(getRegions)
</script>


<form
  class="field register flex gap-2 flex-col"
  on:submit|preventDefault={() => submitAdditionalDetails()}
>
  <div class="text-2xl text-center">Additional Information</div>
  <div class="text-center text-sm mb-4">Please complete your profile information to proceed.</div>
  <div class="row">
    <label for="contact"> Contact: </label>
    <input placeholder="09xxxxxxxxx" pattern="^(09|\+639)\d{"{9}"}$" required type="tel" id="contact" bind:value={contactVal} />
  </div>
  <div class="row">
    <label for="birthdate"> Birthdate: </label>
    <input required type="date" id="birthdate" bind:value={birthdateVal} max={new Date().toISOString().slice(0, 10)} />
  </div>
  <div class="row">
    <label for="gender"> Gender: </label>
    <select name="gender" id="gender" bind:value={genderVal}>
      <option value="" disabled selected>Select Gender</option>
      <option value="Male">Male</option>
      <option value="Female">Female</option>
      <option value="Other">Other</option>
    </select>
  </div>
  <div class="row">
    <label for="region"> Region: </label>
    <select name="region" id="region" bind:value={regionVal} on:change={getProvinces} required disabled={regions.length == 0}>
      <option selected disabled>Select Region</option>
      {#each regions as region}
        <option value={region.code}>{region.regionName}</option>
      {/each}
    </select>
  </div>
  <div class="row">
    <label for="province"> Province: </label>
    <select name="province" id="province" bind:value={provinceVal} on:change={getCities} required disabled={provinces.length == 0}>
      <option selected disabled value="">{provinces.length == 0 ? "---" : "Select Province"}</option>
      {#each provinces as province}
        <option value={province.code}>{province.name}</option>
      {/each}
    </select>
  </div>
  <div class="row">
    <label for="city"> City/Municipality: </label>
    <select name="city" id="city" bind:value={cityVal} on:change={getBarangays} required disabled={cities.length == 0}>
      <option selected disabled value="">{cities.length == 0 ? "---" : "Select City/Municipality"}</option>
      {#each cities as city}
        <option value={city.code}>{city.name}</option>
      {/each}
    </select>
  </div>
  <div class="row">
    <label for="barangay"> Barangay: </label>
    <select name="barangay" id="barangay" bind:value={barangayVal} required disabled={barangays.length == 0}>
      <option selected disabled value="">{barangays.length == 0 ? "---" : "Select Barangay"}</option>
      {#each barangays as barangay}
        <option value={barangay.code}>{barangay.name}</option>
      {/each}
    </select>
  </div>
  <div class="row">
    <label for="house"> House No./St.: </label>
    <input required type="text" id="house" bind:value={houseNumVal} />
  </div>
  <div class="row">
    <label for="postal"> Postal Code: </label>
    <input required type="text" id="postal" bind:value={postalVal} />
  </div>

  <button type="submit" class="btn btn-secondary" disabled={disableButton}
    >Submit</button
  >
</form>
