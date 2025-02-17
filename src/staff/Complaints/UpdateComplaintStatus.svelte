<script>
  import { pop } from "svelte-spa-router";
  import { supabase } from "../../supabase";
  import { onMount } from "svelte";
  import { badge } from "../../customCss";
  import { addNotification } from "../../lib/addNotif";

  let complaint_id;
  let details;
  let currentStatus, newStatus, messageInput;
  let buttonDisabled = false;
  
  let options = ["Unsettled", "Settled", "Archive"]

  export let params;
  if(params && params.id && params.id != "-"){
    complaint_id = params.id
  }

  async function getStatus() {
    const {data, error} = await supabase
    .from("complaints")
    .select("*, sender_id(*)")
    .eq("complaint_id", complaint_id)
    .maybeSingle()

    if(error){
      alert(error)
      console.error(error);
      return;
    }
    details = data;
    currentStatus = data.status
    options = options.filter(opt => opt != currentStatus)
  }
  onMount(getStatus);
  async function submit() {
    buttonDisabled = true;

    const {error} = await supabase
    .from("status_updates")
    .insert({
      complaint_id: complaint_id,
      title:`Updated status from ${currentStatus} to ${newStatus}`,
      description: messageInput
    })

    const {error:error2} = await supabase
      .from("complaints")
      .update({status: newStatus})
      .eq("complaint_id", complaint_id)
      
      if(error2){
        alert(error.message)
        console.error(error2);
        return;
      }
      addNotification(
        details.sender_id.user_id,
        "complaint status",
        `The status of your complaint about **${details.type}** has been updated from <span class="badge ${badge(currentStatus)}">${currentStatus}</span> to <span class="badge ${badge(newStatus)}">${newStatus}</span>`,
        complaint_id
      )

    if(error){
      alert(error);
      console.error(error);
      buttonDisabled = false;
      return;
    }
    alert("Successfully Updated!")
    pop();
  }
</script>


<div class="h-full flex">
  <form
    on:submit|preventDefault={submit}
    class="max-w-[600px] min-w-[256px] w-full h-fit m-auto mt-12 px-12 p-4 flex flex-col justify-center items-center gap-4 bg-white rounded shadow-lg"
  >
    <div class="text-center p-4">
      <span class="text-2xl font-bold"> Complaint Status </span>
    </div>
    <div class="row">
      <label for="appointment_time">Current Status: </label>
      <input
        bind:value={currentStatus}
        required
        disabled
        class="input-bordered"
        type="text"
        name="appointment_time"
        id="appointment_time"
      />
    </div>
    <div class="row">
      <label for="type">New Status: </label>
      <select
        bind:value={newStatus}
        required
        class=" input-bordered"
        name="type"
        id="type"
      >
      <option value="">--</option>
      {#each options as option}
      <option>{option}</option>
      {/each}
        <!-- <option value="Reported">Reported</option>
        <option value="Processing">Processing</option>
        <option value="Guilty">Guilty</option>
        <option value="Dismissed">Dismissed</option>
        <option value="Archive">Archive</option> -->
      </select>
    </div>
    <div class="row">
      <label for="message">Message: </label>
      <textarea
        bind:value={messageInput}
        required
        class=" textarea-bordered"
        name="message"
        id="message"
        rows="4"
      ></textarea>
    </div>
    <div class="flex flex-wrap justify-end items-center gap-4 w-full">
      <button class="btn btn-secondary w-[120px]" type="submit" disabled={buttonDisabled}>Submit</button>
      <button
        class="btn btn-primary w-[120px]"
        type="button"
        on:click={() => pop()}>Cancel</button
      >
    </div>
  </form>

  
</div>