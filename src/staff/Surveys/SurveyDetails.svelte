<script>
  import moment from "moment";
  import { supabase } from "../../supabase";
  import { onMount } from "svelte";
  import Chart from "chart.js/auto";
  import Loader from "../../lib/Loader.svelte";

  export let selected;

  let answers;
  let votes;
  let chart, displayChart = false;
  let drawing
    function init(){
      drawing = new Chart(chart, {
      type: "pie",
      data: null,
      options: {
        plugins:{
          legend:{
            position:"bottom",
            title:{
              display:true,
              padding:10,
              text:"Votes Percentage",
            }
          }
        }
      },
    });
    }
    onMount(init)
  $: {
    answers = null;
    votes = null;
    displayChart = false;
    if(selected.type == "Survey"){
      getAnswers()
    }else{
      getVotes()
    }
  }
  async function getAnswers() {
    const {data, error} = await supabase
    .from("survey_answers")
    .select("*")
    .eq("survey_id", selected.survey_id)
    console.log(selected,data);
    
    answers = data
  }
  async function getVotes() {
    const {data, error} = await supabase.rpc("get_option_results", {selected_survey: selected.survey_id})
    console.log(data);
    if (error){
      console.error(error);
      alert("Failed getting answers.")
      return;
    }
    let counts = [0, 0, 0, 0, 0, 0];
    let total = 0;
    data.forEach((option) => {
      counts[option.answer] = option.count
      total += option.count
    })
    // let percentage = counts.map(count => Math.floor((Number(count) / total) * 100))
    console.log(counts);
    
    votes = counts
    draw()
    if(total != 0){
      displayChart = true
    }
  }
  function draw(){
    drawing.data = {
        labels: selected.options.map(option => option),
        datasets: [{
          data: selected.options.map((_, index) => votes[index])
        }]
    }
    drawing.update()
    console.log(selected.options.map(option => option));
    console.log(selected.options.map((_, index) => votes[index]));
  }
</script>

<div>
  <div class="flex items-center justify-between p-4 border-b">
    <div class="text-lg font-bold">{selected.type}</div>
    <div class="text-gray-500 text-sm">{moment(selected.created_at).format("MM/DD/YYYY | hh:mm a")}</div>
  </div>
  <div class="border-b text-center p-4 font-bold">
    {selected.question}
  </div>
  <canvas bind:this={chart} class="max-h-[250px] 2xl:max-h-[400px] {displayChart ? "!block" : "!hidden"}"> </canvas>
  {#if ["Poll", "Rating"].includes(selected.type) && votes}
  {#if votes && !displayChart}
  <div class="text-center py-6">
    There are currently no votes in this {selected.type}
  </div>  
  {/if}
  <div class="w-75% mx-auto">
    {#each selected.options as option, index}
    <div class="">
      {option}: {votes[index]}
    </div>
    {/each}
  </div>
  {:else if selected.type == "Survey" && answers}
    <div class="max-w-[40rem] mx-auto px-6">
      <ul class="list-decimal list-outside">
        {#each answers as {answer}}
        <li class="py-3 border-b">{answer}</li>
        {/each}
      </ul>
  </div>
  {:else}
  <Loader />
  {/if}
</div>