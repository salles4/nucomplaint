<script>
  import { onMount } from "svelte";
  import { supabase } from "../../supabase";
  import { pop } from "svelte-spa-router";

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
  onMount(()=>{getList()})
</script>


<button class="w-fit self-start" on:click={() => pop()}>Back</button>
{#if studentList}
<table>
  Guards
  {#each studentList as {email, primary_details: pDetails, secondary_details: sDetails}}
  <tr>
    <td>{pDetails.user_id}</td>
    <td>{pDetails.last_name}, {pDetails.first_name}</td>
    <td>{email}</td>
    <td>{sDetails.contact}</td>
    <td>{sDetails.address}</td>
    <td>{sDetails.gender}</td>
    
  </tr>
  {/each}
</table>

{/if}