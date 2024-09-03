<script>
  import Tab from "../lib/Tab.svelte";

  const data = [
    {status:true, type:"Equipments", sender:"Mark Anthony Gipit", message:"lorem kjasd ahjskdhkjsdujdh kjghasd kjh has hjkhasd", sentDate:"09-13-2024"},
    {status:true, type:"Equipments", sender:"Mark Anthony Gipit", message:"Test Message", sentDate:"09-13-2024"},
    {status:true, type:"Equipments", sender:"Mark Anthony Gipit", message:"Test Message", sentDate:"09-13-2024"},
    {status:true, type:"Equipments", sender:"Mark Anthony Gipit", message:"Test Message", sentDate:"09-13-2024"},
    {status:true, type:"Equipments", sender:"Mark Anthony Gipit", message:"Test Message", sentDate:"09-13-2024"},
    {status:true, type:"Equipments", sender:"Mark Anthony Gipit", message:"Test Message", sentDate:"09-13-2024"},
    {status:true, type:"Equipments", sender:"Mark Anthony Gipit", message:"Test Message", sentDate:"09-13-2024"},
    {status:true, type:"Equipments", sender:"Mark Anthony Gipit", message:"Test Message", sentDate:"09-13-2024"},
    {status:true, type:"Equipments", sender:"Mark Anthony Gipit", message:"Test Message", sentDate:"09-13-2024"},
    {status:true, type:"Equipments", sender:"Mark Anthony Gipit", message:"Test Message", sentDate:"09-13-2024"},
    {status:true, type:"Equipments", sender:"Mark Anthony Gipit", message:"Test Message", sentDate:"09-13-2024"},
    {status:true, type:"Equipments", sender:"Mark Anthony Gipit", message:"Test Message", sentDate:"09-13-2024"},
    {status:true, type:"Equipments", sender:"Mark Anthony Gipit", message:"Test Message", sentDate:"09-13-2024"},
    {status:true, type:"Equipments", sender:"Mark Anthony Gipit", message:"Test Message", sentDate:"09-13-2024"},
    {status:true, type:"Equipments", sender:"Mark Anthony Gipit", message:"Test Message", sentDate:"09-13-2024"},
    {status:true, type:"Equipments", sender:"Mark Anthony Gipit", message:"Test Message", sentDate:"09-13-2024"},
    {status:true, type:"Equipments", sender:"Mark Anthony Gipit", message:"Test Message", sentDate:"09-13-2024"},
    {status:true, type:"Equipments", sender:"Mark Anthony Gipit", message:"Test Message", sentDate:"09-13-2024"},
    {status:true, type:"Equipments", sender:"Mark Anthony Gipit", message:"Test Message", sentDate:"09-13-2024"},
    {status:true, type:"Equipments", sender:"Mark Anthony Gipit", message:"Test Message", sentDate:"09-13-2024"},
    {status:true, type:"Equipments", sender:"Mark Anthony Gipit", message:"Test Message", sentDate:"09-13-2024"},
    {status:true, type:"Equipments", sender:"Mark Anthony Gipit", message:"Test Message", sentDate:"09-13-2024"},
    {status:true, type:"Equipments", sender:"Mark Anthony Gipit", message:"Test Message", sentDate:"09-13-2024"},
    {status:true, type:"Equipments", sender:"Mark Anthony Gipit", message:"Test Message", sentDate:"09-13-2024"},
    {status:true, type:"Equipments", sender:"Mark Anthony Gipit", message:"Test Message", sentDate:"09-13-2024"},

  ]
  const filters = []
  let active = "unsettled"

  function changeFilter(e){
    active = e.target.dataset.condition
  }
</script>

<div class="bg-white m-6 h-fit relative mt-10 overflow-visible">
  <div class="w-full relative -top-5">
    <div
      class="bg-nu-blue text-white text-xl mx-8 py-6 p-8 flex justify-between items-center"
    >
      <div class="">Student Complaints:</div>
      <div class="flex flex-wrap gap-1 text-base items-center">
        <Tab label="Unsettled" icon="bell" active={active} condition="unsettled" on:click={changeFilter} />
        <Tab label="Settled" icon="bell" active={active} condition="settled" on:click={changeFilter} />
        <Tab label="Archive" icon="bell" active={active} condition="archive" on:click={changeFilter} />
        <Tab label="Manage Complaint History" icon="bell" active={active} condition="history" on:click={changeFilter} />
      </div>
    </div>
    
    <div class="flex justify-end items-center gap-2 text-blue-800 me-12 m-2">
      <i class="bi bi-search text-lg"></i>
      <input id="search" autocomplete="off" type="text" placeholder="Search" class="border-b-2 border-b-blue-800 px-2 p-1 active:border-none focus:border-0">
      <button><i class="bi bi-arrow-clockwise"></i></button>
      <button><i class="bi bi-sort-alpha-down"></i></button>
      <button><i class="bi bi-clock-history"></i></button>
    </div>

    <table class="table-fixed w-full text-center">
      <thead class="text-lg border-b-2 sticky  bg-white">
        <tr>
          <th class="w-[10%]">Status</th>
          <th class="w-[10%]">Type</th>
          <th class="w-[20%]">Sender</th>
          <th class="w-[35%]">Message</th>
          <th class="w-[10%]">Date Sent</th>
          <th class="w-[15%]">Action</th>
        </tr>
      </thead>
      <tbody>
        {#each data as {status, type, sender, message, sentDate}}
        <tr class="border-b hover:bg-black/5">
          <td class="p-2"><input class="size-5" type="checkbox" name="status" bind:checked={status}></td>
          <td>{type}</td>
          <td>{sender}</td>
          <td class="truncate">{message}</td>
          <td>{sentDate}</td>
          <td>
            <a href="./#/" on:click|preventDefault={()=>{}}>
              <i class="bi bi-eye"></i>
            </a>
            <a href="./#/" on:click|preventDefault={()=>{}}>
              <i class="bi bi-reply"></i>
            </a>
            <a href="./#/" on:click|preventDefault={()=>{}}>
              <i class="bi bi-trash"></i>
            </a>
          </td>
        </tr>
        {/each}
      </tbody>
      </table>
  </div>
</div>

<style>
  button{
    @apply bg-nu-blue text-yellow-300 px-2 p-1 text-2xl rounded-lg
  }
  a{
    @apply hover:bg-nu-blue text-2xl p-1 rounded-lg hover:text-white transition-all duration-100
  }
</style>
