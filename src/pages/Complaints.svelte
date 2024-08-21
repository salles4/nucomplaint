<script>
  const data = [{status:true, type:"Equipments", sender:"Mark Anthony Gipit", message:"Test Message", sentDate:"09-13-2024"}]
</script>

<div class="bg-white m-6 h-full relative mt-10">
  <div class="w-full absolute -top-5">
    <div
      class="tableHead text-white text-xl mx-8 py-6 p-8 flex justify-between items-center"
    >
      <div class="">Student Complaints:</div>
      <div class="flex flex-wrap gap-1 text-base items-center">
        <div class="tableTab active">
          <i class="bi bi-bell text-yellow-300"></i> Unsettled
        </div>
        <div class="tableTab rounded">
          <i class="bi bi-bell text-yellow-300"></i> Settled
        </div>
        <div class="tableTab rounded">
          <i class="bi bi-bell text-yellow-300"></i> Archive
        </div>
        <div class="tableTab rounded">
          <i class="bi bi-bell text-yellow-300"></i> Manage Complaint History
        </div>
      </div>
    </div>
    
    <div class="flex justify-end items-center gap-2 text-blue-800 me-12 m-2">
      <i class="bi bi-search text-lg"></i>
      <input id="search" autocomplete="off" type="text" placeholder="Search" class="border-b-2 border-b-blue-800 px-2 p-1 active:border-none focus:border-0">
      <button><i class="bi bi-arrow-clockwise"></i></button>
      <button><i class="bi bi-sort-alpha-down"></i></button>
      <button><i class="bi bi-clock-history"></i></button>
    </div>
    <table class="table-auto w-full text-center">
      <thead class="text-lg border-b-2 ">
        <tr>
          <th>Status</th>
          <th>Type</th>
          <th>Sender</th>
          <th>Message</th>
          <th>Date Sent</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {#each data as {status, type, sender, message, sentDate}}
        <tr>
          <td class="p-2"><input class="size-5" type="checkbox" name="status" bind:checked={status}></td>
          <td>{type}</td>
          <td>{sender}</td>
          <td>{message}</td>
          <td>{sentDate}</td>
          <td>
            <a href="./#/" on:click|preventDefault={()=>{}}>View</a>
            <a href="./#/" on:click|preventDefault={()=>{}}>Reply</a>
            <a href="./#/" on:click|preventDefault={()=>{}}>Trash</a>
          </td>
        </tr>
        {/each}
      </tbody>
      </table>
  </div>
</div>

<style>
  .tableHead {
    background-color: rgb(53 64 142);
  }
  button{
    @apply tableHead text-yellow-300 px-2 p-1 text-2xl rounded-lg
  }
  .tableTab{
    @apply hover:bg-white/35 cursor-pointer p-2 rounded
  }
  .active{
    @apply bg-white/15 shadow-lg hover:bg-white/15
  }
  a{
    @apply hover:underline
  }
</style>
