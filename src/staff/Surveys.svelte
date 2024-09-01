<script>
  import vite from "../assets/svelte.svg"
</script>

<div class="bg-white">
  <select name="create" id="create" class="p-2 px-4 bg-nu-blue rounded-lg m-2 absolute right-12 text-white">
    <option value="create" disabled selected>Create New</option>
    <option value="survey"> Survey</option>
    <option value="poll"><i class="bi bi-card-checklist"></i>Poll</option>
    <option value="rating"><i class="bi bi-card-checklist"></i>Rating</option>
  </select>
  <div class="p-32">
    <div class="max-w-lg m-auto text-center border border-black">
      <div class="p-16" contenteditable>
        Enter Question Here...
      </div>
      <div class="grid grid-cols-2">
        <button contenteditable class="p-2">
          Option 1
        </button>
        <button contenteditable>
          Option 2
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  option{
    @apply bg-white text-black
  }
  button{
    @apply border
  }
</style>