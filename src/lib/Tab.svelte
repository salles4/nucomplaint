<script>
  export let label,
    icon,
    condition = "",
    active = "";
</script>

<button
  class="cursor-pointer p-2 rounded transition-all duration-200
    {condition == active
    ? 'bg-white/15 shadow-md hover:bg-white/15'
    : 'active:bg-yellow-300/60 hover:bg-white/15'}"
    on:click
    data-condition={condition}
>
  <i class="bi bi-{icon} text-yellow-300" data-condition={condition}></i>
  {label}
</button>
