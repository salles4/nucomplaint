<script>
  import { Ellipsis, Eye, PlusCircle, Trash } from "lucide-svelte";
  import { supabase } from "../../supabase";
  import { pop } from "svelte-spa-router";
  import { onMount } from "svelte";
  import Loader from "../../lib/Loader.svelte";
  import { user_id } from "../../store";
  import ComplaintsDetails from "./ComplaintsDetails.svelte";

  let complaints;
  let selectedComplaint;

  async function getComplaints() {
    const {data, error} = await supabase
    .from("complaints")
    .select("*")
    .eq("sender_id", localStorage.getItem("user_id"));

    if(error){
      alert(error.message);
      return
    }
    complaints = data;
    console.log(complaints)
  }
  supabase
      .channel("complaints")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "complaints", filter: `sender_id=eq.${$user_id}` },
        ()=>{
          getComplaints();
        }
      )
      .subscribe();
  onMount(()=>{getComplaints()})
</script>

<div>
  <div class="text-center relative p-4 z-0">
    <span class="text-3xl font-bold">
      Complaints
    </span>
    <a
      class="btn btn-primary absolute py-2 h-auto btn-sm right-4 top-4"
      href="./#/addComplaint"> <PlusCircle /> Add New</a
    >
  </div>
  {#if complaints && complaints.length > 0}
  <table class="table table-lg">
    <thead class="text-lg">
      <tr>
        <th>Status</th>
        <th>Message</th>
        <th>Date Sent</th>
        <th>Type</th>
      </tr>
    </thead>
    <tbody>
      {#each complaints as {status, sent_date, type, message, complaint_id}}
        <tr class="hover:bg-black/10 hover:cursor-pointer" on:click={() => selectedComplaint = complaint_id}>
          <td>
            <span class="badge {status == "Unread" ? "badge-neutral" : "badge-success badge-outline"}">{status}</span>
          </td>
          <td class="truncate max-w-[300px]">{message}</td>
          <td>{new Date(sent_date).toDateString()} - {new Date(sent_date).toLocaleTimeString()}</td>
          <td>{type}</td>
          <td class="align-middle self-center">
              <span class="dropdown dropdown-left ">
                <div tabindex="0" role="button" class="m-auto">
                  <Ellipsis />
                </div>
                <ul
                  class="dropdown-content menu menu-xs bg-base-100 absolute rounded-box border w-52 p-2 shadow"
                >
                  <li><button><Eye /> View Profile</button></li>
                  <li>
                    <button><Trash /> Delete</button
                    >
                  </li>
                </ul>
              </span>
            </td>
        </tr>
        {/each}
      </tbody>
    </table>
    {:else if complaints && complaints.length == 0}
    <table class="table table-lg">
    <thead class="text-lg">
      <tr>
        <th>Status</th>
        <th>Message</th>
        <th>Date Sent</th>
        <th>Type</th>
      </tr>
    </thead>
    <tbody>
    <div class="text-center w-full my-4 absolute text-xl">Nothing to show here...</div>
  </tbody>
</table>
      {:else}
      <Loader />
      {/if}
</div>
{#if selectedComplaint}
  <ComplaintsDetails complaint_id={selectedComplaint} on:click={() => selectedComplaint = null} />
{/if}