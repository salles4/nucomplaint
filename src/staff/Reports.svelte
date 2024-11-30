<script>
  import Chart from "chart.js/auto";
  import { onMount } from "svelte";
  import { supabase } from "../supabase";
  let chart1, chart2;
  let data = [];
  let lineData = [];
  // let data = [
  //   { year: "January", category1: 14, category2: 12 },
  //   { year: "February", category1: 20, category2: 26 },
  //   { year: "March", category1: 15, category2: 19 },
  //   { year: "April", category1: 25, category2: 8 },
  //   { year: "May", category1: 22, category2: 9 },
  //   { year: "June", category1: 30, category2: 1 },
  //   { year: "July", category1: 28, category2: 4 },
  //   { year: "August", category1: 21, category2: 12 },
  // ];
  
  async function get_complaints_30d(){
    const {data:complaints, error} = await supabase.rpc("get_complaints_last30");
    if(error){
      console.error(error);
      return;
    }

    // console.log(complaints);
    // const complaintMap = {};
    // const complaintData = complaints.map(({sent_date, type}) => {
    //   if(!complaintMap[sent_date]){
    //     complaintMap[sent_date] = {};
    //   }
    //   if(!complaintMap[sent_date][type]){
    //     complaintMap[sent_date][type] = 0
    //   }
    //   complaintMap[sent_date][type] += 1
    // });
    // console.log(complaintMap);
    // Object.entries(complaintMap).forEach(([date, val]) => {data.push({date, val})})
    // console.log(data);
    
    console.log(complaints);
    const complaintMap = {};
    complaints.map(({sent_date, type}) => {
      if(!complaintMap[type]){
        complaintMap[type] = 0
      }
      complaintMap[type] += 1
    });
    console.log(complaintMap);
    Object.entries(complaintMap).forEach(([type, amt]) => {data.push({type, amt})})
    data.sort((a,b) => b.amt - a.amt)
    data = data
    console.log(data);
    draw()
  }

  async function draw() {
    new Chart(chart1, {
      type: "pie",
      data: {
        labels: data.map((row) => row.type),
        datasets: [{
          data: data.map((row) => row.amt)
        }]
      },
      options: {
        plugins:{
          legend:{
            position:"bottom",
            title:{
              display:true,
              padding:10,
              text:"Complaint Types"
            }
          }
        }
      },
    });
    new Chart(chart2, {
      type: "bar",
      data: {
        labels: data.map((row) => row.date),
        datasets: 
        [
          {
            label: "Category 1",
            data: data.map((row) => row.category1),
          },
          {
            label: "Category 2",
            data: data.map((row) => row.category2),
          },
        ],
      },
    });
  }

  onMount(get_complaints_30d);
</script>

<div class="flex flex-wrap justify-center items-center">
  
  <div class="sm:w-[45%] w-full min-w-[400px] p-10 m-12 mx-2 bg-white shadow-lg">
    <canvas bind:this={chart1} class="max-h-[40svh]"> </canvas>
    <div class="font-semibold text-xl pt-5">Complaints Report <span class="text-gray-400 text-sm">Last 30 Days</span></div>
    <!-- <div>
      {data[data.length - 2].category1 +
        data[data.length - 2].category2 -
        (data[data.length - 1].category1 + data[data.length - 1].category2)} ({data[
        data.length - 2
      ].category1 + data[data.length - 2].category2} yesterday) in today's complaints
    </div>
    <div>
      Because students have {data[data.length - 1].category1 +
        data[data.length - 1].category2} complaints for today
    </div> -->
    {#if data.length > 0}
    <div>
      Most Complained:
      <span class="text-blue-400"> {data[0].type} {data[0].amt / data.reduce((a,b) => a + b.amt, 0) * 100}%</span>
    </div>
    <div>
      Least Complained:
      <span class="text-red-400"> {data.filter(complaint => complaint.amt == data[data.length - 1].amt && complaint.type).map(comp => comp.type).join(", ")} </span>
    </div>
    {/if}
  </div>
  <div class="w-[45%] min-w-[500px] p-10 m-12 mx-2 bg-white shadow-lg">
    <canvas bind:this={chart2}> </canvas>

    <div class="font-semibold text-xl pt-5">Monthly Complaints</div>
    <div>0 increase in today's complaints</div>
    <div>Because students have zero complaints for today</div>
    <div>Most Complained Today: None</div>
    <div>Least Complained Today: None</div>
  </div>
  
</div>
