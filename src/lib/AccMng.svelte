<script>
  export let title;
  export let description;
  export let src;
</script>

<div class="pt-4 flex pb-2 items-center justify-evenly w-full">
  <img
    class="w-24 rounded-full object-contain"
    src={src}
    alt=""
  />
  <div>
    <div class="pt-2 text-lg font-bold">{title}</div>
    <div class="">{description}</div>
  </div>
  <button class="btn btn-secondary btn-sm my-2 shadow-lg" on:click>Manage</button>
</div>