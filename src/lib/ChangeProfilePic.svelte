<script>
  import { user_id } from "../store";
  import { supabase } from "../supabase";

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
  async function onSubmit(){
    //upload image
    if(files && files[0]){
      const {data:imageData, error:imageError} = await supabase.storage
      .from('books').upload(`${$user_id}.jpg`, files[0], {upsert:true})
      if(imageError) console.error(imageError);
    }else{
      if(previewSrc != ""){
        const {data:imageData, error:imageError} = await supabase.storage
        .from('books').remove([`${$user_id}.jpg`])
        if(imageError) console.error(imageError);
      }
    }
  }
</script>

<div class="row">
  <label for="pic">
    Profile Picture
  </label>
  <input
    class=""
    type="file"
    id="pic"
    accept="image/*"
    bind:files
    bind:this={fileInput}
  />
</div>
{#if previewSrc}
  <div class="my-3 row">
    <label
      for="cover-preview"
      class="col-sm-4 col-md-3 col-form-label align-self-center"
    >
      Preview:
    </label>
    <div class="col-sm-8 col-md-9" id="preview-div">
      <img
        src={previewSrc}
        on:error={() => (previewSrc = "")}
        alt="Preview"
        id="cover-preview"
        height="150"
      />
      <button
        class="btn btn-sm btn-danger"
        on:click={() => {
          fileInput.value = "";
          files = "";
          previewSrc = "";
        }}>Remove</button
      >
    </div>
  </div>
{/if}
