<script>
  import { pop } from "svelte-spa-router";
  import { supabase } from "../../supabase";
  import { user_id } from "../../store";

  let typeInput, messageInput;
  let buttonDisabled = false

  async function submit(){
    buttonDisabled = true
    const {error} = await supabase
    .from("complaints")
    .insert({
      sender_id: $user_id,
      type: typeInput,
      message: messageInput
    })

    if(error){
      alert(error.message)
      buttonDisabled = false;
      return;
    }

    pop()
  }
</script>

<div class="h-full">
  <div class="text-center p-4">
    <span class="text-2xl"> Add Complaint </span>
  </div>

  <form
    on:submit|preventDefault={submit}
    class="max-w-[600px] px-12 m-auto flex flex-col justify-center items-center gap-4"
  >
    <div class="row">
      <label for="type">Category: </label>
      <select
        bind:value={typeInput}
        required
        class="input input-bordered"
        name="type"
        id="type"
      > 
        <option>Bullying</option>
        <option>Fighting</option>
        <option>Vandalism</option>
        <option>Theft</option>
        <option>Substance Abuse</option>
        <option>Academic Dishonesty</option>
        <option>Loitering</option>
        <option>Faculty</option>
        <option>Institution</option>
        <option>Other</option>
    </select>
    </div>
    <div class="row">
      <label for="message">Message: </label>
      <textarea
        bind:value={messageInput}
        required
        class="textarea textarea-bordered"
        name="message"
        id="message"
        rows="4"
      ></textarea>
    </div>
    <div class="flex gap-4">
      <button class="btn btn-secondary w-[128px]" type="submit" disabled={buttonDisabled}>Submit</button>
      <button class="btn btn-primary w-[128px]" on:click={() => pop()}
        >Cancel</button
      >
    </div>
  </form>
</div>

<!-- <datalist id="categories">
  <option>Bullying</option>
  <option>Fighting</option>
  <option>Vandalism</option>
  <option>Theft</option>
  <option>Substance Abuse</option>
  <option>Academic Dishonesty</option>
  <option>Loitering</option>
  <option>Faculty</option>
  <option>Institution</option>
  <option>Other</option>
  </datalist
> -->

<style>
</style>
