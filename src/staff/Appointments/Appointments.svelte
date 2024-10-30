<script>
  import AddAppointment from "./AddAppointment.svelte";
import AppointmentsTable from "./AppointmentsTable.svelte";

  let mode = "display";

  const changeMode = (newMode) => {
    console.log("run", newMode)
    mode = newMode
  }
</script>
  
{#if mode == "display"}
  <AppointmentsTable {changeMode} />
{:else if mode == "add"}
  <AddAppointment {changeMode} />
{/if}
