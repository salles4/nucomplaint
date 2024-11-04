<script>
  import { supabase } from "../../supabase";
  import { user_id } from "../../store";
  export let changeMode;

  let idInput, timeInput, typeInput, categoryInput, messageInput;

  async function submit() {
    const {data, error: checkingIDError} = await supabase
    .from("access_data")
    .select("*")
    .eq("user_id", idInput)
    .eq("account_type", "student")
    if (checkingIDError) {
      console.error(checkingIDError) 
      return;
    }
    
    if(data.length == 0){
      alert(`${idInput} is invalid student_id`)
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
      return;
    }
    alert("Added Successfully")
    changeMode("display")
  }
</script>

<div class="h-full flex">
  <form
  on:submit|preventDefault={submit}
  class="max-w-[600px] min-w-[256px] w-full bg-white px-12 p-4 m-auto h-fit flex flex-col justify-center items-center gap-4"
  >
  <div class="text-center p-4">
    <span class="text-2xl"> Add Offense </span>
  </div>
    <div class="row">
      <label for="student_id">Student ID: </label>
      <input
        bind:value={idInput}
        required
        class="input-bordered"
        type="text"
        name="student_id"
        id="student_id"
      />
    </div>
    <div class="row">
      <label for="type">Type: </label>
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
      <label for="student_id">Valid Until: </label>
      <input
        bind:value={timeInput}
        required
        class="input-bordered"
        type="datetime-local"
        name="student_id"
        id="student_id"
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
    <div class="flex gap-4">
      <button class="btn btn-secondary w-[128px]" type="submit">Submit</button>
      <a
        class="btn btn-primary w-[128px]"
        type="button"
        href="./#/offenses">Cancel</a
      >
    </div>
  </form>
</div>

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
