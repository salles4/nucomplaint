<script>
  import { supabase } from "../../supabase";
  import { user_id } from "../../store";
  import { onDestroy } from "svelte";
  import { createReader, stopScanner } from "../../scanner";
  import { Info, List, QrCode } from "lucide-svelte";
  import StudentLookup from "../../lib/StudentLookup.svelte";
  import moment from "moment";
  import { addNotification } from "../../lib/addNotif";

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

    const { data:insertedData, error } = await supabase.from("appointments").insert({
      staff_id: $user_id,
      reason: typeInput,
      message: messageInput,
      student_id: idInput,
      time: timeInput,
    }).select()

    if (error) {
      alert(error.message);
      buttonDisabled = false;
      return;
    }

    const {data: student_num, error: numError} = await supabase
    .from("secondary_details")
    .select("contact")
    .eq("user_id", idInput)
    console.log(student_num);
    const num = student_num[0].contact

    const {data: staffName, error: nameError} = await supabase
    .from("users")
    .select("first_name, last_name")
    .eq("user_id", $user_id)
    console.log(staffName);
    const {first_name, last_name} = staffName[0];
    try {
      await fetch(
        "https://api.semaphore.co/api/v4/messages",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            apikey: import.meta.env.VITE_MESSENGER,
            number: num,
            sendername:"CODEVERSE",
            message: `You have a scheduled appointemnt with ${first_name} ${last_name} at ${moment(timeInput).format("MM/DD/YY hh:mma")} because of "${typeInput}" \n\n-SDAO, NU Complaint`
          }),
        }
      );
    } catch (error) {
      console.error(error);
    }
    
    addNotification(idInput, "new appointment", `You have a new scheduled appointment about **${typeInput}**`, insertedData[0].appointment_id)
    alert("Added Successfully");
    changeMode("display");
  }
  
</script>

<div class="h-full flex">
  <form
    on:submit|preventDefault={submit}
    class="max-w-[600px] min-w-[256px] w-full h-fit m-auto mt-12 px-12 p-4 flex flex-col justify-center items-center gap-4 bg-white rounded shadow-lg"
  >
    <div class="text-center p-4">
      <span class="text-2xl font-bold"> Add Appointment </span>
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
      <select
        bind:value={typeInput}
        required
        class=" input-bordered"
        name="type"
        id="type"
      >
      <option selected disabled>--</option>
      <option>Complaint</option>
      <option>Violation</option>
      <option>Offense</option>
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
        class=" textarea-bordered"
        name="message"
        id="message"
        rows="4"
      ></textarea>
    </div>
    <div class="flex flex-wrap justify-end items-center gap-4 w-full">
      <span class="text-gray-400 text-xs text-wrap w-[8rem] me-auto"><Info class="inline" size="12" /> This will notify the student through SMS</span>
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
<!-- <datalist id="categories">
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
</datalist> -->

<style>
</style>
