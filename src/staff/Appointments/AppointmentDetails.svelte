<script>
  import { ChevronUp, X } from "lucide-svelte";
  import { fade, fly } from "svelte/transition";
  import { supabase } from "../../supabase";
  import { onDestroy, onMount } from "svelte";
  import Loader from "../../lib/Loader.svelte";
  import { badge } from "../../customCss";
  import moment from "moment";
  import RightModal from "../../lib/RightModal.svelte";
  import RowData from "../../lib/RowData.svelte";

  export let appointment_id, closeDetails;
  let details;

  let currentStatus;
  let newStatusSelected;
  async function getDetails() {
    const { data, error } = await supabase
      .from("appointments")
      .select("*, student_id(*)")
      .eq("appointment_id", appointment_id)
      .single();

    if (error) {
      alert(error.message);
      return;
    }
    details = data;

    currentStatus = data.status;
    newStatusSelected = data.status;
  }
  async function updateStatus() {
    if (newStatusSelected && currentStatus != newStatusSelected) {
      const { error } = await supabase
        .from("appointments")
        .update({ status: newStatusSelected })
        .eq("appointment_id", appointment_id);

      if (error) {
        alert(error.message);
        console.error(error);
        return;
      }
    }
  }
  async function deleteAppointment() {
    const { error } = await supabase
      .from("appointments")
      .delete()
      .eq("appointment_id", appointment_id);

    if (error) {
      alert(error.message);
      console.error(error);
      return;
    }
    closeDetails();
  }
  onMount(getDetails);
  onDestroy(updateStatus);
</script>

<RightModal {closeDetails} title="Appointment Details">
  {#if details}
    <div class="px-6 flex-grow">
      <RowData label="Sender">
        {details.student_id.first_name}
        {details.student_id.last_name}
        <div class="text-sm text-gray-600">
          {details.student_id.email}
        </div>
      </RowData>
      <RowData label="Scheduled">
        {moment(details.time).format("MMMM DD, YYYY - hh:mm A")}
      </RowData>
      <RowData label="Reason">
        {details.reason}
      </RowData>
      <RowData label="Status">
        <span class="badge {badge(details.status)}">{details.status}</span>
      </RowData>
      <RowData label="Message">
        {details.message}
      </RowData>
    </div>
    <!-- Buttons -->
    <div class="sticky bottom-0 px-6 py-4 bg-white border-t-2 flex gap-2">
      <!-- <button class="btn btn-sm btn-primary"> Reply </button> -->
      <button
        class="btn btn-sm btn-error btn-outline"
        on:click={() => deleteAppointment()}
      >
        Delete
      </button>
      <div class="ms-auto">
        Status:
        <select
          class="select-success px-2 min-w-fit max-w-xs select-sm"
          name="status"
          id="status"
          bind:value={newStatusSelected}
        >
          <option value="Scheduled">Scheduled</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Done">Done</option>
          <option value="Archive">Archive</option>
        </select>
      </div>
    </div>
  {:else}
    <Loader />
  {/if}
</RightModal>

