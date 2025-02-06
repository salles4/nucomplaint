<script>
  import { Unlink } from 'lucide-svelte';
import { onMount } from 'svelte';
  import { replace, push } from 'svelte-spa-router'
</script>

<div class="bg-white p-12 m-auto mt-12 flex flex-col justify-center items-center">
  <div class=""><Unlink size=64 /></div>
  <div class="text-2xl font-bold mb-8 mt-2">Missing Link</div>
  <div class="">It look like the link is not working. Check for typos in URL or return to dashboard.</div>
  <div class="mt-8">
    <button class="btn btn-sm btn-primary" on:click={() => replace("/dashboard")}>Return to Dashboard</button>
  </div>
</div>