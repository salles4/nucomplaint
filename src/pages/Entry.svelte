<script>
  import { auth } from "../store";
  import { replace } from "svelte-spa-router"

  let authType = "staff";

  replace("/")
  function login(){
    localStorage.setItem("v0Auth", authType)
    auth.set(authType)
  }
</script>

<div class="entry flex justify-center items-center min-h-[100svh] min-w-full">
  <div class="flex flex-col w-fit gap-4 bg-white p-12 rounded-md shadow-lg">
    <label>
      Username: <input type="text">
    </label>
    <label>
      Password: <input type="password">
    </label>
    <div class="radio flex justify-around">
      <label>
        <input type="radio" name="auth" bind:group={authType} value="staff">
        Staff
      </label>
      <label>
        <input type="radio" name="auth" bind:group={authType} value="student">
        Student
      </label>
      <label>
        <input type="radio" name="auth" bind:group={authType} value="guard">
        Guard
      </label>
    </div>
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
  input[type=radio], .radio label{
    cursor: pointer;
  }
</style>