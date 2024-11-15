<script>
  import { createUserWithEmailAndPassword } from "firebase/auth";
  import { Eye, EyeOff } from "lucide-svelte";
  import { firebaseAuth } from "../../firebase";
  import { supabase } from "../../supabase";

  export let changePage;
  let studentID, fName, lName, middleInitial, regEmail, regPass, confirmPass;
  let disableButton = false;
  let showRegpass = false,
    showConfirmPass = false;

  //register
  async function register() {
    let intStudentID = studentID.split("-").join("")
    const { data: id_data, error: id_error } = await supabase
      .from("users")
      .select()
      .eq("user_id", intStudentID)
      .maybeSingle();

    if(id_error){
      alert("Having trouble connecting to server, please try again!")
      console.error(id_error);
    }
    if (id_data) {
      alert("Student ID already exists");
      return;
    }
    const { data: email_data, error: email_error } = await supabase
      .from("users")
      .select()
      .eq("email", regEmail)
      .maybeSingle();

    if(email_error){
      alert("Having trouble connecting to server, please try again!")
      console.error(email_error);
    }
    if (email_data) {
      alert("Email already exists");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(regEmail)) {
      alert("Invalid email");
      return;
    }
    // else if(!regEmail.endsWith("@nu-moa.edu.ph")){
    //   alert("Email should end with '@nu-moa.edu.ph'")
    //   return;
    // }

    if (regPass != confirmPass) {
      alert("Password does not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        firebaseAuth,
        regEmail,
        regPass
      );
      const user = userCredential.user;
      console.log(user);

      const { data, error } = await supabase
        .from("users")
        .insert({
          firebase_uid: user.uid,
          user_id: intStudentID,
          email: regEmail,
          account_type: "student",
          first_name: fName,
          last_name: lName,
          middle_initial: middleInitial,
        })
        .select();

      if (error) {
        console.error(error);
        alert(error.message);
      }
      console.log("INSERTED TO SUPABASE", data);
    } catch (error) {
      console.error(error);
      console.error(error.message);
      console.error(error.code);
      alert("Failed to register: " + error.code);
    }
  }

  function onInput(event) {
    return event.target.value;
  }
</script>

<form
  class="field register flex gap-2 flex-col"
  on:submit|preventDefault={() => register()}
>
  <div class="text-2xl text-center">Register</div>

  <div class="row">
    <label for="studID"> Student ID: </label>
    <input placeholder="20xx-xxxxxx" pattern="^20\d{"{2}"}-\d{"{6}"}|20\d{"{8}"}$" required type="text" id="studID" bind:value={studentID} />
  </div>
  <div class="row">
    <label for="fName"> First Name: </label>
    <input required type="text" id="fName" bind:value={fName} />
  </div>
  <div class="row">
    <label for="lName"> Last Name: </label>
    <input required type="text" id="lName" bind:value={lName} />
  </div>
  <div class="row">
    <label for="middle"> Middle Initial: </label>
    <input required type="text" id="middle" bind:value={middleInitial} />
  </div>
  <div class="row">
    <label for="email"> Email: </label>
    <input required type="email" id="email" bind:value={regEmail} />
  </div>
  <div class="row">
    <label for="password"> Password: </label>
    <div class="md:w-[65%] flex">
      <input
        class="!grow"
        required
        minlength="6"
        maxlength="16"
        type={showRegpass ? "text" : "password"}
        id="password"
        on:input={(e) => (regPass = onInput(e))}
      />
      <button
        class="btn btn-sm btn-ghost"
        type="button"
        on:click={() => (showRegpass = !showRegpass)}
        >{#if showRegpass}<EyeOff />{:else}<Eye />{/if}</button
      >
    </div>
  </div>
  <div class="row text-nowrap">
    <label for="confirmPassword"> Confirm Password: </label>
    <div class="md:w-[65%] flex">
      <input
        class="!grow"
        required
        minlength="6"
        maxlength="16"
        type={showConfirmPass ? "text" : "password"}
        id="confirmPassword"
        on:input={(e) => (confirmPass = onInput(e))}
      />
      <button
        class="btn btn-sm btn-ghost"
        type="button"
        on:click={() => (showConfirmPass = !showConfirmPass)}
        >{#if showConfirmPass}<EyeOff />{:else}<Eye />{/if}</button
      >
    </div>
  </div>

  <button type="submit" class="btn btn-secondary" disabled={disableButton}
    >Register</button
  >
  <div class="text-center">
    Already have an account? <a
      on:click|preventDefault={() => {
        changePage("login");
      }}
      href="./#/register">Login</a
    >
  </div>
</form>
