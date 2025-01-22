<script>
  import { supabase } from "../../supabase";
  import { auth, user_id } from "../../store";
  import { replace } from "svelte-spa-router";
  import { List } from "lucide-svelte";
  import {pop} from 'svelte-spa-router'
  import StudentLookup from "../../lib/StudentLookup.svelte";
  import moment from "moment";

  let idInput, timeInput, violationInput, categoryInput, noteInput;
  let lookUpStudent = false;
  let buttonDisabled = false;


  async function submit() {
    buttonDisabled = true;
    if(`${idInput}`.includes("-")){
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
    const { error } = await supabase.from("offenses").insert({
      staff_id: $user_id,
      violation: violationInput,
      category: categoryInput,
      student_id: idInput,
      valid_until: timeInput,
      notes: noteInput,
    });

    if (error) {
      alert(error.message);
      buttonDisabled = false;
      return;
    }
    alert("Added Successfully");
    if($auth == "guard"){
      replace("/records")
    }
    replace("/offenses");
  }
</script>

<div class="h-full flex justify-center items-center flex-wrap">
  <form
    on:submit|preventDefault={submit}
    class="max-w-[600px] min-w-[256px] w-full bg-white px-12 pb-8 p-4 m-auto h-fit flex flex-col justify-center items-center gap-4"
  >
    <div class="text-center p-4">
      <span class="text-2xl"> Add Offense </span>
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
      <label for="violation">Violation: </label>
      <input
        bind:value={violationInput}
        required
        class=" input-bordered"
        type="text"
        name="violation"
        id="violation"
        list="violations"
      />
    </div>
    <div class="row">
      <label for="category">Category: </label>
      <input
        bind:value={categoryInput}
        required
        class=" input-bordered"
        type="text"
        name="category"
        id="category"
        list="categories"
      />
    </div>
    <div class="row">
      <label for="validDate">Valid Until: </label>
      <input
        bind:value={timeInput}
        required
        class="input-bordered"
        type="datetime-local"
        min="{moment().add(1, "d").format("YYYY-MM-DDT12:00")}"
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
    <div class="flex gap-4">
      <button class="btn btn-secondary w-[128px]" type="submit" disabled={buttonDisabled}>Submit</button>
      <button class="btn btn-primary w-[128px]" type="button" on:click={()=> pop()}
        >Cancel</button
      >
    </div>
  </form>
</div>
{#if lookUpStudent}
  <StudentLookup closeModal={(student_id = idInput) => {lookUpStudent = false; idInput = student_id}} />
{/if}
<datalist id="categories">
  <option value="Minor Offense"> </option>
  <option value="Category 1 - Probation"> </option>
  <option value="Category 2 - Formative Intervention"> </option>
  <option value="Category 3 - Non-Readmission"> </option>
  <option value="Category 4 - Exclusion"> </option>
  <option value="Category 5 - Expulsion"> </option>
</datalist>

<datalist id="violations">
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
