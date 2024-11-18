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
    userData = data;
  }
  async function updateData(data){
    const { error: updateError } = await supabase.rpc("update_profile", {
      emailinput: data.email,
      passwordinput: data.password,
      idinput: $user_id,
      fnameinput: data.fName,
      lnameinput: data.lName,
      addressinput: data.address,
      contactinput: data.contact,
      genderinput: data.gender
    });
    if(updateError){
      alert(updateError.message)
      console.error(updateError);
    }
    update = false
  }
  onMount(getData)
</script>
{#if userData}
  {#if !update}
  <ViewProfile data={userData} on:click={() => update = true} />
  {:else}
  <UpdateProfile data={userData} updateFunction={updateData} on:click={() => update = false} />
  {/if}
{:else}
  <Loader />
{/if}