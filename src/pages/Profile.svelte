<script>
  import { fade } from "svelte/transition";
  import Input from "../lib/Input.svelte";

</script>
<div class="h-full flex justify-center items-center " in:fade>
  <div class="bg-white min-h-72 min-w-72 p-12 flex flex-col gap-3 items-center">
    <div class="grid-cols-1 grid gap-3">
      <Input label="Full Name" />
      <Input label="Current Password" />
      <Input label="New Password" />
    </div>
    <div class="grid grid-cols-2 w-full gap-4">
      <button class="bg-yellow-500 p-3 rounded-md w-full">Update</button>
      <button class="bg-yellow-500 p-3 rounded-md w-full">Cancel</button>
    </div>
  </div>
</div>