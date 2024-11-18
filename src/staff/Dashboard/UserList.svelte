<script>
  import { onMount } from "svelte";
  import { supabase } from "../../supabase";
  import { pop, replace } from "svelte-spa-router";
  import Loader from "../../lib/Loader.svelte";
  import ConfirmDelete from "./ConfirmDelete.svelte";
  import { Eye, Trash, Ellipsis } from "lucide-svelte";

  export let params;
  if (!["student", "guard"].includes(params.type)) {
    replace("/dashboard");
  }
  let userList;
  async function getList() {
    const { data, error } = await supabase
      .from("users")
      .select("*, secondary_details(*)")
      .eq("account_type", params.type);

    if (error) {
      alert(error.message);
    }
    userList = data;
    console.log(userList);
  }
  let deleting;
  async function deleteUser(id, name, email) {
    deleting = {
      user_id: id,
      name: name,
      email: email,
    };
  }
  onMount(() => {
    getList();
  });
</script>

<div class="bg-white px-4 h-full overflow-x-auto">
  <div class="text-center relative p-4 z-0">
    <button
      class="btn btn-secondary btn-sm btn-outline absolute left-2 top-4"
      on:click={() => pop()}>Back</button
    >
    <span class="text-2xl">
      {params.type == "student" ? "Students" : "Guards"} List
    </span>
  </div>
  <div class="">
    {#if userList}
      <table class="table">
        <thead class="text-lg">
          <tr>
            <th>Student ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Contact</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {#each userList as { email, first_name, user_id, last_name, secondary_details: others }}
            <tr class="hover:bg-black/10 hover:cursor-pointer">
              <td>{user_id}</td>
              <td>{last_name}, {first_name}</td>
              <td>{email}</td>
              <td>{others.contact}</td>
              <td class="align-middle self-center">
                <span class="dropdown dropdown-left">
                  <div tabindex="0" role="button" class="m-auto">
                    <Ellipsis />
                  </div>
                  <ul
                    class="dropdown-content menu menu-xs bg-base-100 absolute rounded-box border w-52 p-2 shadow"
                  >
                    <li><button><Eye /> View Profile</button></li>
                    <li>
                      <a
                        href="./"
                        on:click|preventDefault={() => {
                          deleteUser(
                            user_id,
                            `${first_name} ${last_name}`,
                            email
                          );
                        }}><Trash /> Delete</a
                      >
                    </li>
                  </ul>
                </span>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {:else}
      <Loader />
    {/if}
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
  a {
    @apply text-red-600;
  }
</style>
