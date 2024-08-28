<script>
  import { onMount } from 'svelte';
  import { replace, push } from 'svelte-spa-router'
  onMount( ()=> 
  push("/dashboard")
)
</script>