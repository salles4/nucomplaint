<script>
  export let label;
</script>
<div class="row">
  <div class="name">{label}</div>
  <div class="content">
    <slot />
  </div>
</div>
<style>
  .row .name {
    width: 30%;
    flex: 0 0 auto;
  }
  .row .content {
    width: 70%;
    flex: 0 0 auto;
  }

  .row {
    margin: 0.5rem 0;
  }
  .row .name {
    font-weight: 600;
  }
</style>