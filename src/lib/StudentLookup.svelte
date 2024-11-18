<script>
  import { ArrowRightCircle, QrCode, Search } from "lucide-svelte";
  import RightModal from "./RightModal.svelte";
  import { supabase } from "../supabase"
  import ProfilePic from "./ProfilePic.svelte";
  import { onDestroy, onMount } from "svelte";
  import { createReader, stopScanner } from "../scanner";
  export let closeModal = (id) => {};

  let searchInput;
  let studentList;
  let scannerDiv;

  async function getStudentList() {
    const {data, error} = await supabase
    .from("users")
    .select("*")
    .eq("account_type", "student")
    if(error){
      alert(error.message)
      console.error(error);
    }
    studentList = data
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
  }
  onDestroy(() => scannerDiv && stopScanner());

  onMount(getStudentList)
</script>
<RightModal title="Find Student" closeDetails={closeModal} >
  <div class="flex p-4 gap-1" >
    <div class="flex flex-grow ">
      <input bind:value={searchInput} class="flex-grow rounded-e-none" type="text" placeholder="Student by Name/ID">
      <button class="btn btn-primary rounded-s-none"><Search /></button>
    </div>
    <button class="btn {scannerDiv ? "btn-secondary":"btn-primary"}" on:click={toggleQR}><QrCode /></button>
  </div>
  <div class="px-4 overflow-y-auto">

    {#if studentList && !scannerDiv}
    {#each studentList as {user_id, first_name, last_name, email}}
    <button on:click={() => closeModal(user_id)} class="flex w-full gap-4 mb-1 p-4 border justify-center items-center hover:bg-black/10 hover:cursor-pointer">
      
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
    {/if}
  </div>
  <div
    id="reader"
    class="flex-col items-center justify-center min-w-[400px] m-auto mt-12 h-fit {scannerDiv
      ? 'flex'
      : 'hidden'}"
  ></div>
</RightModal>