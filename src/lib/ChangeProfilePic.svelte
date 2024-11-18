<script>
  import { user_id } from "../store";
  import { supabase } from "../supabase";
  import RightModal from "./RightModal.svelte";
  export let closeModal;
  let files;
  let fileInput;
  let previewSrc = `https://nlkprjuuixtprwiqypcy.supabase.co/storage/v1/object/public/profile_pics/${$user_id}.jpg`;

  $: if (files && files[0]) {
    console.log(files);
    const img = URL.createObjectURL(files[0]);
    previewSrc = img;
  } else {
    console.log(files);
  }
  async function onSubmit() {
    //upload image
    if (files && files[0]) {
      const { data: imageData, error: imageError } = await supabase.storage
        .from("profile_pics")
        .upload(`/${$user_id}.jpg`, files[0], { upsert: true });
      if (imageError) {
        console.error(imageError);
      } else {
        closeModal();
      }
    } else {
      if (previewSrc != "") {
        const { data: imageData, error: imageError } = await supabase.storage
          .from("profile_pics")
          .remove([`/${$user_id}.jpg`]);
        if (imageError) {
          console.error(imageError);
        } else {
          closeModal();
        }
      }
    }
  }
</script>

<RightModal title="Change Profile Picture" closeDetails={closeModal}>
  {#if previewSrc}
    <div class="flex flex-grow flex-col justify-center items-center my-4">
      <div class="" id="preview-div">
        <img
          class="object-contain size-[300px] rounded-full border-2"
          src={previewSrc}
          on:error={() => (previewSrc = "")}
          alt="Preview"
          id="cover-preview"
          height="150"
        />
      </div>
      <button
        class="btn btn-sm btn-danger"
        on:click={() => {
          fileInput.value = "";
          files = "";
          previewSrc = "";
        }}>Remove</button
      >
    </div>
  {/if}
  <div class="row px-6 my-2">
    <label for="pic"> Upload Photo: </label>
    <input
      class=""
      type="file"
      id="pic"
      accept="image/*"
      bind:files
      bind:this={fileInput}
    />
  </div>
  <div
    class="sticky bottom-0 px-6 py-4 bg-white border-t-2 flex gap-2 justify-end"
  >
    <button class="btn btn-sm btn-primary" on:click={onSubmit}> Update </button>
    <button class="btn btn-sm btn-error btn-outline" on:click={closeModal}>
      Cancel
    </button>
  </div>
</RightModal>
