<script>
  import { auth } from "../store";
  import { replace } from "svelte-spa-router"

  replace("/")
  function login(){
    localStorage.setItem("v0Auth", "staff")
    auth.set("staff")
  }
</script>

<div class="flex justify-center items-center min-h-[100svh] min-w-full">
  <div class="flex flex-col w-fit gap-4">
    <label>
      Username: <input type="text">
    </label>
    <label>
      Password: <input type="password">
    </label>
    <button on:click={login} class="p-2 bg-nu-yellow rounded-lg">Log In</button>
  </div>
</div>