<script>
  import { PencilLine, PlusCircle } from "lucide-svelte";
  import { supabase } from "../../supabase";
  import { onMount } from "svelte";
  import SurveyDetails from "./SurveyDetails.svelte";
  import moment from "moment";
  import CreateSurvey from "./CreateSurvey.svelte";
  import Loader from "../../lib/Loader.svelte";

  let selected;
  let surveys;

  async function getSurveys() {
    const {data, error} = await supabase
    .from("surveys")
    .select("*")
    .order("created_at", {ascending: false})

    if (error) {
      console.error(error);
      return
    }
    surveys = data;
    console.log(data);
  }
  supabase
    .channel("surveys")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "surveys" },
      (payload) => {
        console.log("Realtime Update", payload);
        getSurveys();
      }
    )
    .subscribe();
  onMount(getSurveys)
</script>

<div class="flex p-2 gap-2 min-h-full">
  <div class="surveylist bg-white flex-[1] overflow-auto border justify-center min-w-[250px] text-center">
    <button
      class="p-4 flex justify-center gap-2 border-b w-full {selected == "create" ? "bg-secondary/40 border-e-8 border-primary":"hover:bg-gray-100 hover:cursor-pointer"}"
      on:click={()=> {selected = "create"}}
    >
      <PlusCircle /> Create New
    </button>
    {#if surveys}
    {#each surveys as survey (survey.survey_id)}
      <button class="p-4 flex w-full justify-center items-center border-b {selected && selected.survey_id == survey.survey_id ? "bg-secondary/40 border-e-8 border-primary":"hover:bg-gray-100 hover:cursor-pointer"}"
      on:click={() => selected = survey}>
        <div class="flex-[4] flex flex-col text-start max-w-full truncate">
          <div class="text-base truncate me-2">{survey.question}</div>
          <div class="text-xs text-gray-500">{moment(survey.created_at).format("MM/DD")} - {moment(survey.valid_until).format("MM/DD")}</div>
        </div>
        <div class="flex-[1] flex flex-col text-end">
          <div class="text-lg">{survey.type}</div>
          <div class="text-sm flex gap-1 justify-end items-center">{12} <PencilLine size="14"/> </div>
        </div>
      </button>
    {/each}
    {:else}
    <div class="mt-4">
      <Loader />
    </div>
    {/if}
  </div>
  <div class="bg-white flex-[2] overflow-y-auto">
    {#if selected == "create" || selected == null}
      <CreateSurvey />
    {:else}
      <SurveyDetails {selected} />
    {/if}
  </div>
</div>

<style>
button{
  transition: all 0.2s;
}
</style>
