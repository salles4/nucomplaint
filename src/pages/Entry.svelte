<script>
  import { auth, user_id } from "../store";
  import { replace } from "svelte-spa-router"
  import { supabase } from "../supabase";
  export const params = "";

  let authType = "staff";
  let emailInput, passwordInput;

  replace("/")
  async function login(){
    const {data, error} = await supabase
    .from("access_data")
    .select("account_type, user_id")
    .eq("email", emailInput)
    .eq("password", passwordInput)
    .maybeSingle()

    if (error) {
      console.error(error);
      return;
    }
    if (!data) {
      alert("Wrong Credentials.");
      return;
    } 

    localStorage.setItem("v0Auth", data.account_type);
    localStorage.setItem("user_id", data.user_id);
    auth.set(data.account_type)
    user_id.set(data.user_id)
  }
</script>

<div class="entry flex justify-center items-center min-h-[100svh] min-w-full">
  <div class="flex flex-col w-fit gap-4 bg-white p-12 rounded-md shadow-lg">
    <label>
      Email: <input type="text" bind:value={emailInput}>
    </label>
    <label>
      Password: <input type="password" bind:value={passwordInput}>
    </label>
    <button on:click={login} class="p-2 bg-nu-yellow rounded-lg">Log In</button>
  </div>
</div>

<style>
  .entry{
    background-image: url("./img/numoa.png");
    background-size: cover;
  }
  input{
    @apply border
  }
</style>