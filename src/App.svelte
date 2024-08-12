<script>
  import { location } from "svelte-spa-router";
  import NavbarItem from "./lib/NavbarItem.svelte";
</script>

<div class="flex min-h-[100vh]">
  <aside
    class="flex-col w-auto col-span-2 hidden lg:flex my-auto h-auto border-black"
  >
    <div class="fixed top-0 flex flex-col px-14 items-center">
      <img
        class="h-[120px] rounded-full"
        src="https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
        alt=""
      />
      <div>Francis Salles</div>
      <div>Student No. 2022-129371</div>
    </div>
    <div class="h-full">
      <NavbarItem icon="house-door" label="Dashboard" to="dashboard" />
      <NavbarItem icon="person" label="Profile" to="profile" />
      <NavbarItem
        icon="envelope-exclamation"
        label="Complaints"
        to="complaints"
      />
      <NavbarItem icon="envelope-exclamation" label="Offenses" to="offenses" />
      <NavbarItem icon="calendar-check" label="Appointments" to="appointment" />
      <NavbarItem icon="flag" label="Reports" to="reports" />
      <NavbarItem icon="card-text" label="Surveys" to="surveys" />
    </div>
  </aside>

  <main class="flex-1 text-2xl font-bold col-span-10 lg:col-span-8 border-s-2">
    <div class="bg-blue-700 w-full flex justify-end p-6 gap-2 text-white">
      <a href="./#/notif">
        <i class="bi bi-bell"></i>
      </a>
      <a href="./#/logout">
        <i class="bi bi-power"></i>
      </a>
    </div>
    {$location}
  </main>
</div>
