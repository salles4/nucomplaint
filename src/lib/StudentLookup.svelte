<script>
  import { ArrowRightCircle, QrCode, Search } from "lucide-svelte";
  import RightModal from "./RightModal.svelte";
  import { supabase } from "../supabase"
  import ProfilePic from "./ProfilePic.svelte";
  import { onDestroy, onMount } from "svelte";
  import { createReader, stopScanner } from "../scanner";
  import Loader from "./Loader.svelte";
  export let closeModal = (id) => {};

  let searchInput = "";
  let studentList;
  let filteredStudentList = []; 
  let scannerDiv;

  async function getStudentList() {
    studentList = null
    filteredStudentList = []
    const {data, error} = await supabase
    .from("users")
    .select("*")
    .eq("account_type", "student")
    .order("first_name", {ascending:true})
    if(error){
      alert(error.message)
      console.error(error);
    }
    studentList = data
    updateList()
  }
  function updateList(){
    filteredStudentList = []
    if(searchInput == ""){
      filteredStudentList = studentList;
      return;
    }
    filteredStudentList = studentList.filter(({user_id, first_name, last_name, email}) => (
      (first_name + last_name).includes(searchInput) ||
      email.includes(searchInput) ||
      (user_id.toString()).includes(searchInput) ||
      ((user_id.toString().substring(0, 4)+"-"+user_id.toString().slice(4))).includes(searchInput)
    ))
  }

  function toggleQR() {
    scannerDiv = !scannerDiv;
    if (scannerDiv) {
      createReader(onScan);
    } else {
      stopScanner();
    }
  }
  function onScan(id) {
    let scannedID = id;
    searchInput = scannedID;
    toggleQR();
    updateList();
  }
  onDestroy(() => scannerDiv && stopScanner());
  onMount(getStudentList)
</script>
<RightModal title="Find Student" closeDetails={closeModal} >
  <div class="flex p-4 gap-1" >
    <div class="flex flex-grow ">
      <input bind:value={searchInput} class="flex-grow rounded-e-none" type="text" placeholder="Student by Name/ID">
      <button class="btn btn-primary rounded-s-none" on:click={getStudentList}><Search /></button>
    </div>
    <button class="btn {scannerDiv ? "btn-secondary":"btn-primary"}" on:click={toggleQR}><QrCode /></button>
  </div>
  <div class="px-4 overflow-y-auto">

    {#if studentList && !scannerDiv}
    {#each filteredStudentList as {user_id, first_name, last_name, email}}
    <button name={user_id} on:click={() => closeModal(user_id)} class="flex w-full gap-4 mb-1 p-4 border justify-center items-center hover:bg-black/10 hover:cursor-pointer">
      
      <ProfilePic {user_id} style="size-[60px]" />
      
      <div class="flex-grow text-left">
        <div>
          {first_name} {last_name}
        </div>
        <div class="text-gray-500 text-sm">
        {user_id.toString().substring(0, 4)}-{user_id.toString().slice(4)} | {email}
        </div>
      </div>
      <div><ArrowRightCircle /></div>
    </button>
    {/each}
    {:else if !searchInput}
    <div class="text-center">
      Search for Student ID, Name, or Email.
    </div>
    {:else if !scannerDiv}
    <Loader />
    {/if}
  </div>
  <div
    id="reader"
    class="flex-col items-center justify-center min-w-[400px] m-auto mt-12 h-fit {scannerDiv
      ? 'flex'
      : 'hidden'}"
  ></div>
</RightModal>