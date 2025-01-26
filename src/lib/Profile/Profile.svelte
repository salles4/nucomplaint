<script>
  import { onMount } from "svelte";
  import UpdateProfile from "./UpdateProfile.svelte";
  import ViewProfile from "./ViewProfile.svelte";
  import { supabase } from "../../supabase";
  import Loader from "../../lib/Loader.svelte";
  import { user_id } from "../../store";

  let update = false;
  
  let userData
  async function getData() {
    const {data, error} = await supabase
    .from("users")
    .select("*, secondary_details(*), user_address(*)")
    .eq("user_id", $user_id)
    .single()

    if(error){
      alert(error.message)
      return;
    }
    const regionData = await fetch(`https://psgc.gitlab.io/api/regions/${data.user_address.region_code}`)
    const region = await regionData.json()
    console.log(region.regionName);

    const provinceData = await fetch(`https://psgc.gitlab.io/api/provinces/${data.user_address.province_code}`)
    const province = await provinceData.json()
    console.log(province.name);
    
    const cityData = await fetch(`https://psgc.gitlab.io/api/cities-municipalities/${data.user_address.city_code}`);
    const city = await cityData.json()
    console.log(city.name);

    const barangayData = await fetch(`https://psgc.gitlab.io/api/barangays/${data.user_address.barangay_code}`);
    const barangay = await barangayData.json()
    console.log(data);
    const address_names = {
      "region": region.regionName,
      "province": province.name,
      "city": city.name,
      "barangay": barangay.name,
    }
    data["user_address"] = {...data.user_address, ...address_names}
    userData = data;
    console.log(userData);
  }
  onMount(getData)
</script>
{#if userData}
  {#if !update}
  <ViewProfile data={userData} on:click={() => update = true} />
  {/if}
{:else}
  <Loader />
{/if}