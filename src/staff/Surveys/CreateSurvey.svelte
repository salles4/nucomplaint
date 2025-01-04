<script>
  import { PlusCircle, X } from "lucide-svelte";
  import moment from "moment";
  import { supabase } from "../../supabase";

  let type, question;
  let pollOptions = ["", ""];
  let ratingOptions = ["", "", "", "", ""];
  let validity;

  function changeValidity(days) {
    validity = moment()
      .add(days, "d")
      .set({ hour: 18, minute: 0 })
      .format("YYYY-MM-DDTHH:mm");
  }

  function addOption() {
    pollOptions = [...pollOptions, ""];
  }

  function removeOption(removedIndex) {
    pollOptions = pollOptions.filter((option, index) => index != removedIndex);
    console.log(pollOptions);
  }
  function onTypeChange() {
    pollOptions = ["", ""];
    ratingOptions = ["", "", "", "", ""];
  }

  async function createSurvey() {
    let options;
    switch (type) {
      case "Poll":
        options = pollOptions;
        break;
      case "Rating":
        options = ratingOptions;
        break;
      case "Survey":
        options = null;
        break;
      default:
        console.error("No type selected");
        return;
    }

    const { data, error } = await supabase
      .from("surveys")
      .insert({
        question: question,
        options: options,
        type: type,
        valid_until: validity,
      })
      .select("*");

    if (error) {
      console.error(error);
      return;
    }
    console.log(data);

    question = "";
    pollOptions = ["", ""];
    ratingOptions = ["", "", "", "", ""];
    validity = null;
  }
</script>

<form
  on:submit|preventDefault={createSurvey}
  class="flex flex-col md:w-2/3 md:min-w-[400px] max-w-[550px] w-full justify-center items-center mx-auto p-4"
>
  <div class="text-xl font-bold my-6">Create New</div>
  <div class="row border-b pb-4">
    <label for="type">Type:</label>
    <select name="type" id="type" bind:value={type} on:change={onTypeChange}>
      <option>Poll</option>
      <option>Rating</option>
      <option>Survey</option>
    </select>
  </div>
  <div class="row mt-2">
    <label for="question" class="!mt-0">Question:</label>
    <textarea
      name="question"
      rows="3"
      required
      id="question"
      bind:value={question}
    ></textarea>
  </div>
  {#if type == "Poll"}
    <div class="row mt-2">
      <label for="options">Options:</label>
      <input
        type="text"
        name="options"
        required
        placeholder="Option 1"
        id="options"
        bind:value={pollOptions[0]}
      />
    </div>
    <div class="row">
      <label for="option2"></label>
      <input
        type="text"
        name="options"
        required
        placeholder="Option 2"
        id="option2"
        bind:value={pollOptions[1]}
      />
    </div>
    {#each pollOptions as pollOption, index}
      {#if index > 1}
        <div class="row mt-0">
          <div class="!w-[30%]"></div>
          <div class="md:w-[70%] flex">
            <input
              class="!grow rounded-e-none"
              required
              placeholder="Option {index + 1}"
              name="option"
              type="text"
              bind:value={pollOptions[index]}
            />
            <button
              type="button"
              class="btn btn-xs btn-primary btn-outline rounded-s-none h-full"
              on:click={() => removeOption(index)}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      {/if}
    {/each}
    {#if pollOptions.length < 6}
      <button
        type="button"
        class="btn btn-primary btn-outline btn-sm ms-auto md:w-[70%] w-full"
        on:click={addOption}
      >
        Add Option +
      </button>
    {/if}
    <!-- Rating -------------------------->
  {:else if type == "Rating"}
    <div class="row mt-2">
      <label for="options">Options:</label>
      <div class="md:w-[70%] flex">
        <div
          class="border-2 rounded px-4 rounded-e-none border-e-0 bg-black/5 h-full"
        >
          1
        </div>
        <input
          class="!grow rounded-s-none"
          type="text"
          required
          placeholder="e.g. Disagree"
          id="options"
          bind:value={ratingOptions[0]}
        />
      </div>
    </div>
    {#each ratingOptions as ratingOption, index}
      {#if index > 0}
        <div class="row mt-0">
          <div class="!w-[30%]"></div>
          <div class="md:w-[70%] flex">
            <div
              class="border-2 rounded p-2 px-4 rounded-e-none border-e-0 bg-black/5 h-full"
            >
              {index + 1}
            </div>
            <input
              class="!grow rounded-s-none"
              required
              placeholder={index == 4 ? "Agree" : index == 2 ? "Neutral" : ""}
              type="text"
              bind:value={ratingOptions[index]}
            />
          </div>
        </div>
      {/if}
    {/each}
  {/if}
  <div class="row mt-4 border-t pt-4">
    <label for="validity">Valid Until</label>
    <input
      type="datetime-local"
      min={moment().add(1, "h").format("YYYY-MM-DDTHH:mm")}
      max={moment().add(3, "M").format("YYYY-MM-DDT12:00")}
      name="validity"
      id="validity"
      required
      bind:value={validity}
    />
  </div>
  <div class="row">
    <div class="!w-[30%]"></div>
    <div class="md:w-[70%] flex gap-2">
      <button
        type="button"
        class="btn btn-primary btn-outline btn-xs flex-1"
        on:click={() => changeValidity(1)}>1 day</button
      >
      <button
        type="button"
        class="btn btn-primary btn-outline btn-xs flex-1"
        on:click={() => changeValidity(7)}>7 days</button
      >
      <button
        type="button"
        class="btn btn-primary btn-outline btn-xs flex-1"
        on:click={() => changeValidity(15)}>15 days</button
      >
    </div>
  </div>
  <button class="btn btn-primary btn-sm ms-auto px-6 mt-4" type="submit"
    ><PlusCircle class="text-secondary" /> Create Survey</button
  >
</form>
