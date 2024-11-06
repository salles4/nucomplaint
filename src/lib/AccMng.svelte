<script>
  export let title;
  export let description;
  export let src;
</script>

<div class="sm:px-14 pt-4 flex-shrink-0 flex sm:flex-col pb-2 items-center max-w-xs">
  <img
    class="w-24 sm:w-36 rounded-full object-contain"
    src={src}
    alt=""
  />
  <div>
    <div class="pt-2 text-lg sm:text-xl font-bold">{title}</div>
    <div class="text-xs sm:text-base">{description}</div>
  </div>
  <button class="sm:w-full btn btn-secondary btn-sm my-2 shadow-lg" on:click>Manage</button>
</div>