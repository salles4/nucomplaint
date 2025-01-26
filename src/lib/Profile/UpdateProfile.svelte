<script>
  import { fade } from "svelte/transition";
  import { supabase } from "../../supabase";
  import { onMount } from "svelte";
  import { user_id } from "../../store";
  import { pop } from 'svelte-spa-router'
  import moment from "moment";
  import { UserX } from "lucide-svelte";
  import Loader from "../Loader.svelte";

  export let params;
  let error;
  const id = params.id;
  let studentID = id,
    emailVal,
    fNameVal,
    lNameVal,
    mNameVal,
    contactVal,
    birthdateVal,
    genderVal,
    provinceVal,
    cityVal,
    regionVal,
    barangayVal,
    houseNumVal,
    postalVal;

  let regions = [];
  let provinces = [];
  let cities = [];
  let barangays = [];

  async function getData() {
    const { data, error:dataError } = await supabase
      .from("users")
      .select("*, secondary_details(*), user_address(*)")
      .eq("user_id", id)
      .single();

    if (dataError) {
      error = dataError
      console.error(error);
      return;
    }

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
    fNameVal = first_name;
    lNameVal = last_name;
    mNameVal = middle_initial;
    contactVal = contact;
    genderVal = gender;
    birthdateVal = moment(birth_date).format("YYYY-MM-DD");
    houseNumVal = house_number;
    postalVal = postal_code;

    getRegions();
    regionVal = region_code;
    getProvinces();
    provinceVal = province_code;
    getCities();
    cityVal = city_code;
    getBarangays();
    barangayVal = barangay_code;
  }
  async function getRegions() {
    fetch("https://psgc.gitlab.io/api/regions/")
      .then((response) => response.json())
      .then((data) => {
        regions = data;
        console.log(data);
      });
  }
  function getProvinces() {
    provinces = [];
    cities = [];
    barangays = [];
    provinceVal = "";
    cityVal = "";
    barangayVal = "";
    fetch(`https://psgc.gitlab.io/api/regions/${regionVal}/provinces/`)
      .then((response) => response.json())
      .then((data) => {
        provinces = data;
        console.log(data);
      });
  }
  function getCities() {
    cities = [];
    barangays = [];
    cityVal = "";
    barangayVal = "";
    fetch(
      `https://psgc.gitlab.io/api/provinces/${provinceVal}/cities-municipalities/`
    )
      .then((response) => response.json())
      .then((data) => {
        cities = data;
        console.log(data);
      });
  }
  function getBarangays() {
    barangays = [];
    barangayVal = "";
    fetch(
      `https://psgc.gitlab.io/api/cities-municipalities/${cityVal}/barangays/`
    )
      .then((response) => response.json())
      .then((data) => {
        barangays = data;
        console.log(data);
      });
  }
  async function updateClicked() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailVal)) {
      alert("Invalid email");
      return;
    } 
    // else if (!emailVal.endsWith("@nu-moa.edu.ph")) {
    //   alert("Email should end with '@nu-moa.edu.ph'");
    //   return;
    // }

    const {error} = await supabase.rpc("update_user", {
      'id': id,
      fnameinput: fNameVal,
      lnameinput: lNameVal,
      mnameinput: mNameVal,
      contactinput: contactVal,
      genderinput: genderVal,
      birthinput: moment(birthdateVal).format("YYYYMMDDT00:00"),
      regioninput: regionVal,
      provinceinput: provinceVal,
      cityinput: cityVal,
      barangayinput: barangayVal,
      houseinput: houseNumVal,
      postalinput: postalVal
    })

    if(error) {
      console.error(error);
      return;
    }
    alert("Successfully Updated!")
    pop()
  }
  onMount(getData);
</script>

<div class="h-full flex" in:fade>
  {#if error}
    <div class="bg-white min-w-[200px] max-w-[900px] p-4 md:p-12 py-6 h-fit m-auto flex flex-col gap-3 shadow-lg">
      <h2 class="text-center text-2xl font-bold">Update Information</h2>
    <hr class="py-1" />
    <div class="p-8 pt-2">
      <div class="w-fit mx-auto p-4">
        <UserX size={64} />
      </div>
      <div class="text-center">Can't find the user. Check for typos and refresh the page.</div>  
      <div class="text-sm text-center text-black/30">Error: {error.message} {error.code}</div>
    </div>
    </div>
  {/if}
  {#if barangays.length == 0}
    <div class="bg-white min-w-[200px] max-w-[900px] p-4 md:p-12 py-6 h-fit m-auto flex flex-col gap-3 shadow-lg">
      <Loader />
    </div>
  {/if}
  <form
    class="bg-white min-w-[200px] max-w-[900px] p-4 md:p-12 py-6 h-fit m-auto flex-col gap-3 shadow-lg {error || barangays.length == 0 ? "hidden" : "flex"}"
    on:submit|preventDefault={updateClicked}
  >
    <h2 class="text-center text-2xl font-bold">Update Profile</h2>
    <hr class="py-1" />
    <div class="row">
      <div class="sect">
        <div class="row">
          <label for="studID"> Student ID: </label>
          <input
            required
            type="number"
            id="studID"
            bind:value={studentID}
            disabled
          />
        </div>
        <div class="row">
          <label for="email"> Email: </label>
          <input
            required
            type="text"
            id="email"
            bind:value={emailVal}
            disabled
          />
        </div>

        <div class="row">
          <label for="fName"> First Name: </label>
          <input required type="text" id="fName" bind:value={fNameVal} />
        </div>
        <div class="row">
          <label for="lName"> Last Name: </label>
          <input required type="text" id="lName" bind:value={lNameVal} />
        </div>
        <div class="row">
          <label for="middle_initial"> Middle Initial: </label>
          <input
            required
            type="text"
            id="middle_initial"
            bind:value={mNameVal}
          />
        </div>
        <div class="row">
          <label for="contact"> Contact: </label>
          <input required type="text" id="contact" bind:value={contactVal} />
        </div>
        <div class="row">
          <label for="birth_date"> Birth Date: </label>
          <input
            required
            type="date"
            id="birth_date"
            bind:value={birthdateVal}
          />
        </div>
        <div class="row">
          <label for="gender"> Gender: </label>
          <input id="gender" required bind:value={genderVal} />
        </div>
      </div>
      <div class="sect">
        <div class="row">
          <label for="region"> Region: </label>
          <select
            name="region"
            id="region"
            bind:value={regionVal}
            on:change={getProvinces}
            disabled={regions.length == 0}
            required
          >
            <option disabled>Select Region</option>
            {#each regions as region}
              <option value={region.code}>{region.regionName}</option>
            {/each}
          </select>
        </div>
        <div class="row">
          <label for="province"> Province: </label>
          <select
            name="province"
            id="province"
            bind:value={provinceVal}
            on:change={getCities}
            disabled={provinces.length == 0}
            required
          >
            <option disabled value=""
              >{provinces.length == 0 ? "---" : "Select Province"}</option
            >
            {#each provinces as province}
              <option value={province.code}>{province.name}</option>
            {/each}
          </select>
        </div>
        <div class="row">
          <label for="city"> City/Municipality: </label>
          <select
            name="city"
            id="city"
            bind:value={cityVal}
            on:change={getBarangays}
            required
            disabled={cities.length == 0}
          >
            <option disabled value=""
              >{cities.length == 0 ? "---" : "Select City/Municipality"}</option
            >
            {#each cities as city}
              <option value={city.code}>{city.name}</option>
            {/each}
          </select>
        </div>
        <div class="row">
          <label for="barangay"> Barangay: </label>
          <select
            name="barangay"
            id="barangay"
            bind:value={barangayVal}
            disabled={barangays.length == 0}
            required
          >
            <option disabled value=""
              >{barangays.length == 0 ? "---" : "Select Barangay"}</option
            >
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
      </div>
    </div>

    <hr />

    <div class="ms-auto gap-4">
      <button class="btn btn-secondary" type="submit"
        >Update</button
      >
      <button class="btn btn-secondary btn-outline" type="button" on:click={() => pop()}
        >Cancel</button
      >
    </div>
  </form>
</div>

<style>
  input,
  select {
    width: 60% !important;
  }
  label {
    width: 40% !important;
  }
  .sect {
    @apply lg:w-[50%] w-full px-2;
  }
</style>
