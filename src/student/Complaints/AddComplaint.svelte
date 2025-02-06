<script>
  import { pop } from "svelte-spa-router";
  import { supabase } from "../../supabase";
  import { user_id, user_name } from "../../store";
  import { addNotification, notifyStaff } from "../../lib/addNotif";

  let typeInput, messageInput;
  let buttonDisabled = false

  async function submit(){
    buttonDisabled = true
    const {data, error} = await supabase
    .from("complaints")
    .insert({
      sender_id: $user_id,
      type: typeInput,
      message: messageInput
    }).select("*");

    if(error){
      alert(error.message)
      buttonDisabled = false;
      return;
    }
    
    notifyStaff("new complaint", `${$user_name} issued a complaint about ${typeInput}`, data[0].complaint_id)

    pop()
  }
</script>

<div class="max-w-[600px] min-w-[256px] w-full bg-white px-6 pb-8 p-4 m-auto mt-12 shadow-lg rounded h-fit flex flex-col justify-center items-center gap-4">
  <div class="text-center p-4">
    <span class="text-2xl font-bold"> Add Complaint </span>
  </div>

  <form
    on:submit|preventDefault={submit}
    class="flex flex-col w-full px-12 justify-center items-center gap-4"
  >
    <div class="row">
      <label for="type">Category: </label>
      <select
        bind:value={typeInput}
        required
        class="select select-bordered"
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
