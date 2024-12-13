<script>
  import { onMount } from "svelte";

  export let user_id;
  export let style = "size-[72px]";
  let placeholderImg = false;
  onMount(()=> placeholderImg = false)
</script>

{#if !placeholderImg}
  <img
    class="rounded-full object-contain border {style}"
    on:error={() => (placeholderImg = true)}
    src={`https://nlkprjuuixtprwiqypcy.supabase.co/storage/v1/object/public/profile_pics/${user_id}.jpg`}
    alt="profile pic"
  />
{:else}
  <img
    class="rounded-full object-contain border {style}"
    src="./img/default_profile.jpg"
    alt="profile pic"
  />
{/if}
