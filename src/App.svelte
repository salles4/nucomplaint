<script>
  import { location } from "svelte-spa-router";
  import NavbarItem from "./lib/NavbarItem.svelte";


</script>

<div class="grid grid-cols-10">
  <aside class="flex-col col-span-2 max-h-[100vh] hidden lg:flex">
    <div class="flex flex-col items-center border-black border">
      <img class="h-[120px] rounded-full" src="https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=" alt="">
      <div>
        Francis Salles
      </div>
      <div>
        Student No. 2022-129371
      </div>
    </div>
    <NavbarItem icon="house-door" label="Dashboard" to="dashboard" />
    <NavbarItem icon="person" label="Profile" to="profile" />
    <NavbarItem icon="envelope-exclamation" label="Complaints" to="complaints" />
    <NavbarItem icon="envelope-exclamation" label="Offenses" to="offenses" />
    <NavbarItem icon="calendar-check" label="Appointments" to="appointment" />
    <NavbarItem icon="flag" label="Reports" to="reports" />
    <NavbarItem icon="card-text" label="Surveys" to="surveys" />
  </aside>
  
  <main class="text-2xl font-bold  col-span-10 lg:col-span-8">
    <div class="bg-blue-700 w-full flex justify-end p-6 gap-2 text-white">
      <a href="./#/notif">
        <i class="bi bi-bell"></i>
      </a>
      <a href="./#/logout">
        <i class="bi bi-power"></i>
      </a>
    </div>
    { $location }
  </main>

</div>
