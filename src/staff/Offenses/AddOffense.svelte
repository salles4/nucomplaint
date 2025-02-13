<script>
  import { supabase } from "../../supabase";
  import { auth, user_id } from "../../store";
  import { replace } from "svelte-spa-router";
  import { CirclePlus, List } from "lucide-svelte";
  import { pop } from "svelte-spa-router";
  import StudentLookup from "../../lib/StudentLookup.svelte";
  import moment from "moment";
  import { addNotification } from "../../lib/addNotif";

  let idInput, timeInput, violationInput, categoryInput, noteInput, counselingTime;
  let lookUpStudent = false;
  let buttonDisabled = false;
  let majorOffenses = 0;
  let minorOffenses = 0;

  async function submit() {
    buttonDisabled = true;
    if (`${idInput}`.includes("-")) {
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
    const { data:insertedData, error } = await supabase.from("offenses").insert({
      staff_id: $user_id,
      violation: violationInput,
      category: categoryInput,
      student_id: idInput,
      valid_until: timeInput,
      notes: noteInput,
    }).select("*");

    if (error) {
      alert(error.message);
      buttonDisabled = false;
      return;
    }
    if(minorOffenses%3 == 2){
      addNotification(idInput, "new offense", `You violated a minor offense about **${violationInput}**, You've now violated **${majorOffenses + 1}** major offense`, insertedData[0].offense_id)
    }else{
      addNotification(idInput, "new offense", `You have been identified to violate the university's policy on **${violationInput}**`, insertedData[0].offense_id)
    }
    if((majorOffenses > 0 && categoryInput != "Minor Offense") || (majorOffenses > 0 && categoryInput == "Minor Offense" && minorOffenses % 3 == 2)){
      const { data:insertedAppoinntment, error } = await supabase.from("appointments").insert({
        status:"For Counseling",
        staff_id: $user_id,
        reason: "Multiple Offenses",
        message: `This student already has ${majorOffenses + 1} offenses`,
        student_id: idInput,
        time: counselingTime,
      }).select()
      
      addNotification(idInput, "new appointment", `You have a scheduled counseling appointemnt in the **Guidance Office** at **${moment(counselingTime).format("MMMM DD, YYYY hh:mma")}**`, insertedAppoinntment[0].appointment_id)

      const {data: student_num, error: numError} = await supabase
      .from("secondary_details")
      .select("contact")
      .eq("user_id", idInput)
      console.log(student_num);
      const num = student_num[0].contact
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
            sendername:"NUMOAxSDAO",
            message: `You have a scheduled counseling appointemnt in the Guidance Office at ${moment(counselingTime).format("MM/DD/YY hh:mma")} because of your multiple offenses. \n\nPlease attend on time.`
          }),
        }
      );
    } catch (error) {
      console.error(error);
    }
    }
    alert("Added Successfully");
    replace("/offenses");
  }
  const checkOffenses = async () => {
    minorOffenses = 0;
    majorOffenses = 0;
    if(idInput.length < 5 || idInput.length > 11){
      return;
    }
    if (`${idInput}`.includes("-")) {
      idInput = idInput.split("-").join("");
    }
    
    const {data, error} = await supabase.rpc("countoffenses", {user_id:idInput})
    
    if(error){
      console.error(error);
      return;
    }
    minorOffenses = data[0].minor_offenses
    majorOffenses = data[0].major_offenses + Math.floor(minorOffenses / 3)
    
    idInput = `${idInput.toString().substring(0, 4)}-${idInput.toString().slice(4)}`;
  }
</script>

<div class="h-full flex justify-center items-center flex-wrap">
  <form
    on:submit|preventDefault={submit}
    class="max-w-[600px] min-w-[256px] w-full bg-white px-12 pb-8 p-4 m-auto mt-12 h-fit shadow-lg rounded flex flex-col justify-center items-center gap-4"
  >
    <div class="text-center p-4">
      <span class="text-2xl font-bold"> Add Offense </span>
    </div>
    <div class="row">
      <label for="student_id">Student ID: </label>
      <div class="md:w-[70%] flex">
        <input
          bind:value={idInput}
          on:input={checkOffenses}
          required
          class="input-bordered !grow rounded-e-none"
          type="text"
          name="student_id"
          id="student_id"
        />
        <button
          class="btn btn-sm btn-primary rounded-s-none h-full"
          type="button"
          on:click={() => (lookUpStudent = true)}><List /></button
        >
      </div>
    </div>
    <div class="row">
      <label for="violation">Violation: </label>
      <select
        bind:value={violationInput}
        required
        class=" input-bordered"
        name="violation"
        id="violation"
      >
        <option disabled selected value="">--</option>
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
      <label for="category">Category: </label>
      <select
        bind:value={categoryInput}
        required
        class=" input-bordered"
        name="category"
        id="category"
      >
      <option disabled selected value="">--</option>
        <option>Minor Offense</option>
        <option>Category 1 - Probation</option>
        <option>Category 2 - Formative Intervention</option>
        <option>Category 3 - Non-Readmission</option>
        <option>Category 4 - Exclusion</option>
        <option>Category 5 - Expulsion</option>
      </select>
    </div>
    <div class="row">
      <label for="validDate">Valid Until: </label>
      <input
        bind:value={timeInput}
        required
        class="input-bordered"
        type="datetime-local"
        min={moment().add(1, "d").format("YYYY-MM-DDT12:00")}
        max={moment().add(3, "M").format("YYYY-MM-DDT12:00")}
        name="validDate"
        id="validDate"
      />
    </div>
    <div class="row">
      <label for="note">Note: </label>
      <textarea
        bind:value={noteInput}
        class=" textarea-bordered"
        name="note"
        id="note"
        rows="4"
      ></textarea>
    </div>
    {#if minorOffenses % 3 == 2 && categoryInput == "Minor Offense"}
      <hr class="border-b w-full">
      <div class="text-center">
        <span class="font-semibold">
          This is 3rd minor offense of this student.
        </span>
        <br>
        <span class="text-sm">
          They will be notified that they will now have {majorOffenses + 1} major offense.
        </span>
      </div>
    {/if}
    {#if (majorOffenses > 0 && categoryInput != "Minor Offense") || (majorOffenses > 0 && categoryInput == "Minor Offense" && minorOffenses % 3 == 2)}
      <hr class="border-b w-full">
      <div class=" text-center">
        <span class="font-semibold">
          This student has already offended {majorOffenses} major violation.
        </span>
        <br>
        <span class="font-normal text-sm">
          Upon adding the offense, The student will be appointed to counseling.
        </span>
      </div>
      <div class="row">
        <label for="time">Time for counseling: </label>
        <input class="input-bordered" type="datetime-local" bind:value={counselingTime} required min={moment().add(1, "d").format("YYYY-MM-DDT12:00")} name="time" id="time">
      </div>
    {/if}
    <hr class="border-b w-full">
    <div class="flex gap-4">
      <button
      class="btn btn-secondary w-[128px]"
        type="submit"
        disabled={buttonDisabled}>Add Offense</button
      >
      <button
        class="btn btn-primary w-[128px]"
        type="button"
        on:click={() => pop()}>Cancel</button
      >
    </div>
  </form>
</div>
{#if lookUpStudent}
  <StudentLookup
    closeModal={(student_id = idInput) => {
      lookUpStudent = false;
      idInput = student_id;
      checkOffenses();
    }}
  />
{/if}

<style>
</style>
