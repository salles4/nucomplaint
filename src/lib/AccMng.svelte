<script>
  export let title;
  export let description;
  export let src;
</script>

<div class="px-14 pt-4 flex-shrink-0 flex flex-col pb-2 items-center max-w-xs">
  <img
    class="w-36 rounded-full object-contain"
    src={src}
    alt=""
  />
  <div>
    <div class="pt-2 text-xl font-bold">{title}</div>
    <div>{description}</div>
  </div>
  <button class="w-full bg-yellow-400 shadow-lg p-1 m-2" on:click>Manage</button>
</div>