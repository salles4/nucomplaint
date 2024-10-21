<script>
  import { onMount } from "svelte";
  import { supabase } from "../../supabase";
  import { pop } from "svelte-spa-router";

  let studentList;
  async function getList() {
    const {data, error} = await supabase
    .from("access_data")
    .select("email, primary_details(*), secondary_details(*)")
    .eq("account_type", "student")

    if(error){
      alert(error.message)
    }
    studentList = data;
    console.log(studentList);
    
  }
  onMount(()=>{getList()})
</script>

{#if studentList}
<button class="w-fit self-start" on:click={() => pop()}>Back</button>
<table>
  Students
  {#each studentList as {email, primary_details: details, secondary_details: sDetails}}
  <tr>
    <td>{details.user_id}</td>
    <td>{details.last_name}, {details.first_name}</td>
    <td>{email}</td>
    <td>{sDetails.contact}</td>
    <td>{sDetails.address}</td>
    <td>{sDetails.gender}</td>
  </tr>
  {/each}
</table>

{/if}