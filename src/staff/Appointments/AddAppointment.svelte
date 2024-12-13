<script>
  import { supabase } from "../../supabase";
  import { user_id } from "../../store";
  import { onDestroy } from "svelte";
  import { createReader, stopScanner } from "../../scanner";
  import { List, QrCode } from "lucide-svelte";
  import StudentLookup from "../../lib/StudentLookup.svelte";
  import moment from "moment";
  export let changeMode;

  let idInput, timeInput, typeInput, messageInput;
  let scannerDiv, lookUpStudent = false;
  let buttonDisabled = false;

  async function submit() { 
    buttonDisabled = true
    idInput = idInput.toString()
    if(idInput.includes("-")){
      idInput = idInput.split("-").join("");
    }

    
    const { data, error: checkingIDError } = await supabase
    .from("users")
      .select("*")
      .eq("user_id", idInput)
      .eq("account_type", "student");
    if (checkingIDError) {
      console.error(checkingIDError);
      buttonDisabled = false;
      return;
    }

    if (data.length == 0) {
      alert(`${idInput} is invalid student_id`);
      buttonDisabled = false;
      return;
    }
    
    
    const {data: schedCheck, error: schedCheckError} = await supabase
    .from("appointments")
    .select("*, student_id(*)")
    .eq("student_id", idInput)
    .eq("status", "Scheduled")
    .gt("time", "now()")
    if (schedCheckError) {
      console.error(checkingIDError);
      buttonDisabled = false;
      return;
    }

    if (schedCheck.length != 0) {
      console.log(schedCheck);
      
      alert(`${schedCheck[0].student_id.first_name} ${schedCheck[0].student_id.last_name} already has a scheduled appoinemnt`);
      buttonDisabled = false;
      return;
    }

    const { error } = await supabase.from("appointments").insert({
      staff_id: $user_id,
      reason: typeInput,
      message: messageInput,
      student_id: idInput,
      time: timeInput,
    });

    if (error) {
      alert(error.message);
      buttonDisabled = false;
      return;
    }
    alert("Added Successfully");
    changeMode("display");
  }
  console.log(moment().add(3, 'M').toISOString());
  
</script>

<div class="h-full flex">
  <form
    on:submit|preventDefault={submit}
    class="max-w-[600px] min-w-[256px] w-full h-fit m-auto px-12 p-4 flex flex-col justify-center items-center gap-4 bg-white rounded-lg"
  >
    <div class="text-center p-4">
      <span class="text-2xl"> Add Appointment </span>
    </div>
    <div class="row">
      <label for="student_id">Student ID: </label>
      <div class="md:w-[70%] flex">
        <input
          bind:value={idInput}
          required
          class="input-bordered !grow rounded-e-none"
          type="text"
          name="student_id"
          id="student_id"
        />
        <button
          class="btn btn-sm btn-primary rounded-s-none h-full"
          type="button"
          on:click={() => lookUpStudent = true}><List /></button
        >
      </div>
    </div>
    <div class="row">
      <label for="appointment_time">Time: </label>
      <input
        bind:value={timeInput}
        required
        class="input-bordered"
        type="datetime-local"
        name="appointment_time"
        min="{moment().add(1, "d").format("YYYY-MM-DDT12:00")}"
        max={moment().add(3, "M").format("YYYY-MM-DDT12:00")}
        id="appointment_time"
      />
    </div>
    <div class="row">
      <label for="type">Category: </label>
      <input
        bind:value={typeInput}
        required
        class=" input-bordered"
        type="text"
        name="type"
        id="type"
        list="categories"
      />
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
    <div class="flex flex-wrap justify-center gap-4">
      <button class="btn btn-secondary w-[120px]" type="submit" disabled={buttonDisabled}>Submit</button>
      <button
        class="btn btn-primary w-[120px]"
        type="button"
        on:click={() => changeMode("display")}>Cancel</button
      >
    </div>
  </form>

  
</div>
{#if lookUpStudent}
  <StudentLookup closeModal={(student_id = "") => {lookUpStudent = false; idInput = student_id}} />
{/if}
<datalist id="categories">
  <option value="Complaint"> </option>
  <option value="Violation"> </option>
  <option value="Offense"> </option>
  <option value="Bullying"> </option>
  <option value="Fighting"> </option>
  <option value="Vandalism"> </option>
  <option value="Theft"> </option>
  <option value="Substance Abuse"> </option>
  <option value="Academic Dishonesty"> </option>
  <option value="Loitering"> </option>
  <option value="Faculty"> </option>
  <option value="Institution"> </option>
  <option value="Other"> </option>
</datalist>

<style>
</style>
