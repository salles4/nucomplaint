<script>
  import { location, replace } from 'svelte-spa-router'
  import Input from '../lib/Input.svelte';

  if($location == "/"){
    replace("/offense")
  }

</script>

<div class="flex justify-center items-center h-full">
  <div class="min-w-[600px] bg-white p-12 rounded-lg shadow-lg relative">
    <div class="absolute -top-8 left-8 bg-nu-blue text-white p-4 rounded-lg shadow-lg">
      Add Offense
    </div>
    <div class="text-xl font-semibold text-center">
      Student Record
    </div>
    <div class="flex flex-col gap-2 my-4">
      <Input label="Student No." />
      <Input label="First Name:" />
      <Input label="Last Name:" />
    </div>
    <div class="grid grid-cols-2 w-full gap-4">
      <button class="bg-yellow-500 p-3 rounded-md w-full">Update</button>
      <button class="bg-yellow-500 p-3 rounded-md w-full">Cancel</button>
    </div>  
  </div>

</div>

<datalist>
  <option>No Uniform</option>
  <option>No ID</option>
  <option>Using property without authority</option>
  <option>Loitering</option>
  <option>Eating in classroom</option>
  <option>Wrong use of lockers</option>
  <option>Hiding library materials</option>
  <option>Dyeing hair inappropriately</option>
  <option>Presence of opposite sex in designated sex's room</option>
  <option>Bringing phobited item</option>
</datalist>