<script>
  import { onMount } from "svelte";
  import { supabase } from "../../supabase";
  import { pop, replace, push } from "svelte-spa-router";
  import Loader from "../../lib/Loader.svelte";
  import ConfirmDelete from "./ConfirmDelete.svelte";
  import { Eye, Trash, Ellipsis, X, Search, PencilLine } from "lucide-svelte";

  let searchText = "";
  let list = [],
    filteredList = [];
  function onSearchChange() {
    filteredList = list.filter((student) => {
      const name = `${student.first_name} ${student.last_name}`;
      if (
        student.email.includes(searchText) ||
        name.toLowerCase().includes(searchText.toLowerCase()) ||
        `${student.user_id}`.includes(searchText) ||
        student.email.toLowerCase().includes(searchText.toLowerCase()) ||
        searchText == ""
      ) {
        return student;
      }
    });
  }
  async function getList() {
    const { data, error } = await supabase.rpc("get_student_list");
    if (error) console.error(error);
    list = data;
    filteredList = list
  }
  let deleting;

  onMount(() => {
    getList();
  });
</script>

<div
  class="bg-white m-8 mb-4 h-full relative overflow-visible max-w-[1300px] w-full mx-auto px-8"
>
  <div class="w-full relative -top-5">
    <div
      class="rounded-lg bg-nu-blue text-white text-xl sm:mx-8 py-6 sm:p-6 p-4 flex justify-between items-center"
    >
      <div class="">Student List:</div>
    </div>
    <div
      class="flex sm:flex-nowrap py-2 flex-wrap justify-center sm:items-center sm:justify-end mx-4 md:mx-12"
    >
      <div class="search flex justify-end items-center gap-2 text-blue-800">
        <label class="flex justify-center items-center">
          <input
            bind:value={searchText}
            on:input={onSearchChange}
            id="search"
            autocomplete="off"
            type="text"
            placeholder="Search"
            class=" rounded-e-none border-b-2 px-2 active:border-none focus:border-0"
          />
          <button
            on:click={() => {
              searchText = "";
              onSearchChange();
            }}
            class="bg-nu-blue text-yellow-300 p-1.5 rounded-s-none rounded-lg"
          >
            {#if searchText}
              <X strokeWidth="3" />
            {:else}
              <Search strokeWidth="3" />
            {/if}
          </button>
        </label>
      </div>
    </div>
    <div class="overflow-x-auto overflow-y-hidden">
      {#if filteredList.length != 0 || (list && filteredList.length == 0)}
        <table class="table text-center">
          <thead class="text-lg">
            <tr>
              <th class="">Student ID</th>
              <th class="">Name</th>
              <th class="">Email</th>
              <th class="">Complaints</th>
              <th class="">Offenses</th>
              <th class="">Appointments</th>
              <th class="">Actions</th>
            </tr>
          </thead>
          <tbody>
            {#each filteredList as { first_name, last_name, middle_initial, user_id, complaints, offenses, appointments, email }}
              <tr>
                <td>{user_id}</td>
                <td>{first_name} {middle_initial} {last_name}</td>
                <td>{email}</td>
                <td>{complaints}</td>
                <td>{offenses}</td>
                <td>{appointments}</td>
                <td>
                  <button
                    class="btn btn-ghost btn-xs"
                    on:click={() => push(`/update/${user_id}`)}
                  >
                    <PencilLine class="mx-auto" />
                  </button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
        {#if list && filteredList.length == 0}
          <div class="text-center m-2">No results</div>
        {/if}
      {:else}
        <Loader />
      {/if}
    </div>
  </div>
</div>

{#if deleting}
  <ConfirmDelete
    userName={deleting.name}
    userEmail={deleting.email}
    userID={deleting.user_id}
    on:cancel={() => (deleting = null)}
  />
{/if}

<style>
  td {
    @apply !border-0;
  }
  /* a {
    @apply text-red-600;
  }
  .dropdown-content li:hover {
    background-color: rgba(0 0 0 / 0.1);
  } */
</style>
