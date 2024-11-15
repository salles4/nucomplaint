<script>
  import { Eye, EyeOff } from "lucide-svelte";
  import Loader from "../../lib/Loader.svelte";
  import { signInWithEmailAndPassword } from "firebase/auth";
  import { firebaseAuth } from "../../firebase";

  export let changePage;
  let emailInput, passwordInput;
  let disableButton;
  let showPass = false;

  // login
  async function login() {
    disableButton = true;
    emailInput = emailInput.trim();
    try {
      const userCredential = await signInWithEmailAndPassword(
        firebaseAuth,
        emailInput,
        passwordInput
      );
      console.log(userCredential);
      changePage("")
    } catch (error) {
      console.error(error);
      alert("Error signing in: "+error.code)
    }
    disableButton = false;
  }
  function onInput(event) {
    return event.target.value;
  }
</script>

<form
  class="flex flex-col gap-2 my-auto"
  on:submit|preventDefault={() => login()}
>
  <div class="text-2xl text-center">Log In</div>
  <div class="row">
    <label for="email"> Email: </label>
    <input required type="email" id="email" autocomplete="email" bind:value={emailInput} />
  </div>
  <div class="row">
    <label for="password"> Password: </label>
    <div class="md:w-[70%] flex">
      <input
        class="!grow rounded-e-none border-e"
        required
        type={showPass ? "text" : "password"}
        id="password"
        on:input={(e) => (passwordInput = onInput(e))}
      />
      <button
        class="btn btn-sm rounded-s-none border-black/20 border-2 border-s px-1"
        type="button"
        on:click={() => (showPass = !showPass)}
        >{#if showPass}<EyeOff />{:else}<Eye />{/if}</button
      >
    </div>
  </div>
  <button type="submit" class="btn btn-secondary" disabled={disableButton}
    >{#if disableButton}
      <Loader />
    {:else}
      Log In
    {/if}</button
  >
  <div class="text-center">
    Don't have an account yet? <a
      on:click|preventDefault={() => {
        changePage("register");
      }}
      href="./#/register">Register</a
    >
  </div>
  <div class="text-center">
    <a
      on:click|preventDefault={() => {
        changePage("reset");
      }}
      href="./#/register">Forgot your password?</a
    >
  </div>
</form>
