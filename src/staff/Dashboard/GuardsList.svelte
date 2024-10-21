<script>
  import { onMount } from "svelte";
  import { supabase } from "../../supabase";
  import { pop } from "svelte-spa-router";
  import Loader from "../../lib/Loader.svelte";
  import ConfirmDelete from "./ConfirmDelete.svelte";

  let studentList;
  async function getList() {
    const {data, error} = await supabase
    .from("access_data")
    .select("email, primary_details(*), secondary_details(*)")
    .eq("account_type", "guard")

    if(error){
      alert(error)
    }
    studentList = data;
    console.log(studentList);
    
  }
  let deleting;
  async function deleteUser(id, name, email) {
    deleting = {
      user_id: id,
      name: name,
      email: email
    }
  }
  onMount(()=>{getList()})
</script>


<div class="text-center relative p-4">
  <button class="w-fit self-start p-2 border-2 border-slate-500 absolute left-0 top-0" on:click={() => pop()}>Back</button>
  <span class="text-2xl">
    Guards List
  </span>
</div>
{#if studentList}
<table>
  {#each studentList as {email, primary_details: pDetails, secondary_details: sDetails}}
  <tr>
    <td>{pDetails.user_id}</td>
    <td>{pDetails.last_name}, {pDetails.first_name}</td>
    <td>{email}</td>
    <td>{sDetails.contact}</td>
    <td>{sDetails.address}</td>
    <td>{sDetails.gender}</td>
    <td><button class="text-red-600 underline" on:click={()=>{deleteUser(pDetails.user_id, `${pDetails.first_name} ${pDetails.last_name}` , email)}}>Delete</button></td>
    
  </tr>
  {/each}
</table>
{:else}
<Loader />
{/if}

{#if deleting}
  <ConfirmDelete userName={deleting.name} userEmail={deleting.email} userID={deleting.user_id} on:cancel={() => deleting = null} />
{/if}