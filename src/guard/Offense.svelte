<script>
  import { location, replace } from 'svelte-spa-router'

  if($location == "/"){
    replace("/offense")
  }

</script>

<div>Add Offense</div>