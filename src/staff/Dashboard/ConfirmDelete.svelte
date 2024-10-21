<script>
  import { fly } from "svelte/transition";
  import { createEventDispatcher } from 'svelte';
  import { supabase } from "../../supabase";
  import {replace} from "svelte-spa-router"
  export let userEmail;
  export let userID;
  export let userName;

	const dispatch = createEventDispatcher();

  let passwordValue;
  let emailValue;

  async function deleteUser(){
    const {data, error} = await supabase
    .from("access_data")
    .select("password")
    .eq("user_id", localStorage.getItem("user_id"))
    .maybeSingle()
    
    if(passwordValue != data.password || emailValue != userEmail){
      alert("Wrong email or password")
      return
    }
    
    const response = await supabase
    .from('access_data')
    .delete()
    .eq('email', userEmail)
    .eq("user_id", userID)

    alert(`"${userEmail}" has been successfully deleted!`)
    replace("/students")
  }

</script>
<div
  class="fixed top-0 left-0 z-2"
  style="background-color: white; width:100vw; height:100vh; padding:0;"
  transition:fly={{ duration: 600, y: -900 }}
>
  <div
    class="flex flex-col items-center justify-center gap-2"
    style="height: 90vh"
  >
    <h1 class="text-red-600 text-5xl font-bold">User Deletion</h1>
    <div class="text-center mb-4">
      <p class="my-0">
        This action will delete all records of <b>{userName} ({userID})</b> in the database including their personal infos and reports.
      </p>
      <div class="text-gray-600">This action is not highly recommended to prevent having missing records.</div>
    </div>
    <div class="mb-4">Please enter your password and email of the user <b>"{userEmail}"</b> to confirm deletion.</div>

    <div class="row">
      <label for="email">Email:</label>
      <input type="text" id="email" bind:value={emailValue}>
    </div>
    <div class="row">
      <label for="password">Password:</label>
      <input type="password" id="password" bind:value={passwordValue}>
    </div>
    <div>
      <button class="bg-red-600" on:click={deleteUser}>Confirm</button>
      <button class="bg-green-500" on:click={()=>dispatch('cancel')}>Cancel</button>
    </div>
  </div>
</div>

<style>
  input{
    @apply border-2
  }
  .row {
    display: flex;
    align-items: center;
    width: 20%;
    min-width: 300px;
  }
  .row label {
    width: 30%;
  }
  .row input {
    width: 70%;
  }
  button{
    @apply p-2 rounded-md text-white m-2
  }
</style>