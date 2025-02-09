<script>
  import { MessageSquareMore, X, Gavel, CalendarClockIcon } from "lucide-svelte";
  import { slide } from "svelte/transition";
  import { replace } from 'svelte-spa-router'

  export let notif, deleteNotif

  const redirect = (id) => {
    switch (notif.type) {
      case "complaint status":
      case "new complaint":
        replace(`/complaints?id=${id}`)
        break;
      case "offense status":
      case "new offense":
        replace(`/offenses?id=${id}`)
        break;
      case "new appointment":
      case "appointment status":  
        replace(`/dashboard`)
        break;
      default:
        break;
    }
  }
  /**
   * @param {string} message
   */
  function formatText(message) {
    return message
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      // .replace(/\*(.+?)/g, '<b class="pt-6">• </b>')
      // .replace(/\n/g, "<br>");
  }
</script>

<div class="flex mt-2 mx-4 p-2 border-2 rounded items-center" transition:slide>
  <div class="px-4 h-full border-e flex items-center">
    {#if ["complaint status", "new complaint"].includes(notif.type)}
      <MessageSquareMore size=32 />
    {:else if ["offense status", "new offense"].includes(notif.type)}
      <Gavel size=32 />
    {:else if ["new appointment", "appointment status"].includes(notif.type)}
      <CalendarClockIcon size=32 />
    {/if}
  </div>
  <div class="flex-col flex-1 px-4">
    <div class="">{@html formatText(notif.message)}</div>
    {#if !notif.type.includes("appointment")}
    <button class="link text-sm text-secondary" on:click={()=> {redirect(notif.related_id)}}>View Details</button>
    {/if}
  </div>
  <button class="px-2 h-full border-s" on:click={() => deleteNotif(notif.notification_id)}><X /></button>
</div>