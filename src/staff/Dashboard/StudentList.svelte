<script>
  import { onMount } from "svelte";
  import { supabase } from "../../supabase";

  let studentList;
  async function getList() {
    const {data, error} = await supabase
    .from("primary_details")
    .select("*")
    .eq("account_type", "student")

    if(error){
      alert(error)
    }
    studentList = data;
    console.log(studentList);
    
  }
  onMount(()=>{getList()})
</script>

{#if studentList}
<table>
  {#each studentList as student}
  <tr>
    <td>{student.user_id}</td>
    <td>{student.last_name}, {student.first_name}</td>
    <td>{student.email}</td>
    
  </tr>
  {/each}
</table>

{/if}