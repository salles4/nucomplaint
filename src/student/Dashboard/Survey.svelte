<script>
  import { fly } from "svelte/transition";
  import { quadOut } from "svelte/easing";
  import { supabase } from "../../supabase";
  import { user_id } from "../../store";
  import { onMount } from "svelte";
  import Loader from "../../lib/Loader.svelte";
  import logo from '../../assets/NU_shield.svg'
  import { CheckCircle2 } from "lucide-svelte";
  import moment from "moment";

  let survey;
  let rangeAnswer = 2,
    pollAnswer,
    surveyAnswer;
  let isAnswering = true;

  let results, studentAnswer;

  async function getSurvey() {
    const { data, error } = await supabase.rpc("getsurvey", {
      logged_student: $user_id,
    });

    if (error) {
      console.error(error);
      return;
    }
    console.log("retrieved", data);
    
    if(data.length == 0){
      getPreviousAnswered()
      return
    }
    console.log(data);
    survey = data[0];
  }
  async function getPreviousAnswered(){
    const {data,error} = await supabase
    .from("survey_answers")
    .select("*, surveys(*)")
    .eq("student_id", $user_id)
    // .lt("time", moment().subtract(10, "minutes").format("YYYY-MM-DDTHH:mm"))
    .order("time", {ascending: false})
    console.log(data);
    
    if(error){
      console.error(error);
      return;
    }
    if(data.length == 0){
      isAnswering = false
      survey = {type:null}
      return
    }
    console.log(data);
    survey = data[0].surveys
    await getResults()
    isAnswering = false

  }
  async function submitAnswer() {
    let answer;
    switch (survey.type) {
      case "Poll":
        answer = pollAnswer;
        break;
      case "Survey":
        answer = surveyAnswer;
        break;
      case "Rating":
        answer = rangeAnswer;
        break;
    }

    const { data, error } = await supabase
      .from("survey_answers")
      .insert({
        survey_id: survey.survey_id,
        student_id: $user_id,
        answer: answer
      })
      .select("*");

    if (error) {
      console.error(error);
      return;
    }
    
    //if poll or rating
    getResults()
  }
  async function getResults() {
    const {data, error} = await supabase.rpc("get_option_results", {selected_survey: survey.survey_id});
    if (error) {
      console.error(error);
      return;
    }
    await getStudentAnswer();
    console.log(data);
    let counts = [0, 0, 0, 0, 0, 0];
    let total = 0;
    data.forEach((option) => {
      counts[option.answer] = option.count
      total += option.count
    })
    let percentage = counts.map(count => Math.floor((Number(count) / total) * 100))
    console.log(percentage);
    
    results = percentage
    isAnswering = false
    return;
  }
  async function getStudentAnswer() {
    const {data, error} = await supabase
    .from("survey_answers")
    .select("answer")
    .eq("survey_id", survey.survey_id)
    .eq("student_id", $user_id)

    studentAnswer = data[0].answer
  }
  onMount(getSurvey);
</script>

<div class="bg-white w-full h-fit py-6 pt-0 mt-8 mb-8 max-w-[700px] rounded">
  <div class="bg-primary text-white h-fit relative -top-5 mx-6 p-4 rounded-lg">
    Survey Poll
  </div>
  <div
    class="bg-primary rounded-lg text-white mx-16 text-center flex flex-col gap-2"
  >
    {#if survey && isAnswering}
      <div class="font-bold mt-8">Question for Today</div>
      <div class="pb-4">{survey.question}</div>
      <!-- Answer -->
      {#if survey.type == "Poll"}
        <div class="flex gap-2 px-12 flex-col">
          {#each survey.options as option, index}
            <button
              class="w-full btn btn-sm btn-secondary {pollAnswer == index
                ? 'border-white border-2'
                : ''}"
              on:click={() => (pollAnswer = index)}>{option}</button
            >
          {/each}
          <!-- <button class="flex-1 btn btn-secondary btn-sm">1-2 times a week</button>
          <button class="flex-1 btn btn-secondary btn-sm">3-5 times a week</button> -->
        </div>
      {:else if survey.type == "Survey"}
        <div class="px-8 flex flex-col gap-4 text-black">
          <textarea
            rows="4"
            placeholder="Type your answer here"
            bind:value={surveyAnswer}
          ></textarea>
          <!-- <button class="btn btn-secondary btn-sm w-fit ms-auto">Submit</button> -->
        </div>
      {:else if survey.type == "Rating"}
        <div class="px-8 flex flex-col gap-4 justify-center items-center">
          <input
            class="w-2/3 range range-secondary bg-white/40"
            type="range"
            min="0"
            max="4"
            bind:value={rangeAnswer}
          />
          <div>{rangeAnswer + 1} - {survey.options[rangeAnswer]}</div>
          <!-- <button class="btn btn-secondary btn-sm w-fit ms-auto">Submit</button> -->
        </div>
      {/if}
      <hr />
      <button
        class="btn btn-secondary btn-sm ms-auto mb-4 mt-2 me-12"
        on:click={submitAnswer}>Submit</button
      >
    {:else if survey && !isAnswering}
      {#if survey.type == "Poll" || survey.type == "Rating"}
        <div class="font-bold mt-8">Poll Percentage</div>
        <div class="pb-4">{survey.question}</div>
        <div class="flex gap-2 px-12 flex-col mb-8">
          <div class="flex flex-col gap-3 rounded-lg">
            {#each survey.options as option, index}
              <div class=" bg-black/20 relative rounded-lg overflow-hidden border border-black">
                <div class="h-[2rem] {studentAnswer == index ? "bg-yellow-300" : "bg-yellow-400"}" style="width: {results[index]}%;" in:fly={{x:-100, delay:200, easing: quadOut}}>
                </div>
                <span class="left-4 top-1/2 -translate-y-1/2 absolute drop-shadow-md flex gap-2">
                  {option}
                  {#if studentAnswer == index}
                    <CheckCircle2 />
                  {/if}
                </span>
                <span class="right-4 top-1/2 -translate-y-1/2 absolute font-bold">
                  {results[index]}%
                </span>
              </div>
            {/each}
          </div>
        </div>
      {:else if survey.type == "Survey"}
      <div class="py-12">
        <span class="font-bold"> Thank you for answering the survey! </span>
        <div class="text-sm mx-auto mt-4 w-[60%]">
          The university are always trying to improve our services to serve
          Education that Works.
        </div>
        <img src={logo} class="size-12 mx-auto mt-4" alt="NU Logo">
      </div>
      {:else}
      <div class="py-12">
        <span class="font-bold"> Welcome to NU Complaint! </span>
        <div class="text-sm mx-auto mt-4 w-[60%]">
          This is where you can quickly access your university offenses and complaints.
        </div>
        <div class="text-sm text-gray-300 mx-auto mt-4 w-[60%]">
          There are currently no available surveys.
        </div>
        <img src={logo} class="size-12 mx-auto mt-4" alt="NU Logo">
      </div>
      {/if}
    {:else}
      <Loader />
    {/if}
  </div>
</div>
