<script>
  import Chart from "chart.js/auto";
  import { onMount } from "svelte";
  import { supabase } from "../../supabase";
  import { Stars } from "lucide-svelte";
  import AiReport from "./AIReport..svelte";
  import moment from "moment";
  import 'chartjs-adapter-moment';
  let chart1, chart2;
  let data = [];
  let lineData = [];
  let complaintData;
  let dataContext;

  async function get_complaints_30d(){
    const {data:complaints, error} = await supabase.rpc("get_complaints_last30");

    if(error){
      console.error(error);
      return;
    }
    console.log(complaints);
    
    const complaintMap = {};
    const complaintDates = {};
    complaints.map(({sent_date, type}) => {
      if(!complaintMap[type]){
        complaintMap[type] = 0
      }
      complaintMap[type] += 1
      const date = moment(sent_date).format("YYYYMMDD");
      if(!complaintDates[date]){
        complaintDates[date] = 0
      }
      complaintDates[date] += 1
    });
    console.log(complaintDates);

    // complaintMap["Faculty"] = 11
    // complaintMap["Academic Dishonesoty"] = 11
    complaintData = "";
    Object.entries(complaintMap).forEach(([type, amt]) => {
      data.push({type, amt})
      complaintData += `${amt} ${type},`
    })
    dataContext = complaintData;
    
    data.sort((a,b) => b.amt - a.amt)
    data = data
    console.log(data);

    Object.entries(complaintDates).forEach(([date, amt]) => {
      lineData.push({date, amt})
    })
    lineData.sort((a,b) => b.date - a.date)

    lineData = lineData;
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
              text:"Complaint Types",
            }
          }
        }
      },
    });
    new Chart(chart2, {
      type: "line",
      data: {
        labels: lineData.map((row) => row.date),
        datasets: 
        [
          {
            label: "Complaints",
            data: lineData.map((row) => row.amt),
            fill:'origin',
            spanGaps: true
          },
        ],
      },
      options:{
        scales:{
          x:{
            // suggestedMin:moment().subtract(30, 'days').format("YYYYMMDD"),
            // suggestedMax:moment().format("YYYYMMDD"),
            type:"time",
            time: {
              tooltipFormat:"MMM DD, YYYY",
              minUnit: 'day',
              parser: "YYYYMMDD",
            },
          },
          y:{
            suggestedMin: 0,
            suggestedMax: 10,
            min:0
          }
        },
        plugins:{
          tooltip:{
            callbacks:{
              // title: context => {
              //   const title = context[0].parsed.x || "";
              //   return moment(title).format("MMM DD, YYYY");
              // }
            }
          }
        }
      }
    });
  }

  onMount(get_complaints_30d);
</script>

<div class="flex flex-wrap justify-center items-center">
  {#if dataContext && dataContext != ""}
    <AiReport {dataContext} />
  {/if}
  
  <div class="sm:w-[45%] w-full sm:min-w-[500px] sm:p-10 p-4 m-4 mx-2 bg-white shadow-lg">
    <canvas bind:this={chart1} class="sm:max-h-[300px]"> </canvas>
    <div class="font-semibold text-xl pt-5">Complaints Report <span class="text-gray-400 text-sm">Last 30 Days</span></div>
    {#if data.length > 0}
    <div>
      Most Complained:
      <span class="text-red-400"> {data.filter(complaint => complaint.amt == data[0].amt && complaint.type).map(comp => comp.type).join(", ")} with {data[0].amt} complaints</span>
    </div>
    <div>
      Least Complained:
      <span class="text-blue-400"> {data.filter(complaint => complaint.amt == data[data.length - 1].amt && complaint.type).map(comp => comp.type).join(", ")} </span>
    </div>
    {/if}
  </div>
  <div class="sm:w-[45%] w-full sm:min-w-[500px] sm:p-10 p-4 m-4 mx-2 bg-white shadow-lg">
    <canvas bind:this={chart2} class="max-h-[400px]"> </canvas>

    <div class="font-semibold text-xl pt-5">Monthly Complaints</div>
    <div>0 increase in today's complaints</div>
    <div>Because students have zero complaints for today</div>
    <div>Most Complained Today: None</div>
    <div>Least Complained Today: None</div>
  </div>
</div>