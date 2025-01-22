<script>
  import Chart from "chart.js/auto";
  import { onMount } from "svelte";
  import { supabase } from "../../supabase";
  import AiReport from "./AIReport..svelte";
  import moment from "moment";
  import "chartjs-adapter-moment";
  import { ArrowRight, Clock, Printer } from "lucide-svelte";
  let chart1, chart2;
  let data = [];
  let lineData = [];
  let complaintData;
  let dataContext;
  let timeRange;
  let pie, line;
  let date1, date2

  async function get_complaints() {
    data = [];
    lineData = []
    complaintData = null;
    dataContext = null;
    if(timeRange == "Custom"){
      return;
    }
    let complaints
    let error;
    if(timeRange != "Custom"){
      const { data, error } = await supabase.rpc(
        "get_complaints_last_custom_days",
        {
          days: timeRange,
        }
      );
      if (error) {
        console.error(error);
        return;
      }
      complaints = data
    }else if (date1 && date2){
      
    }else{
      return;
    }
   

    
    console.log(complaints);

    const complaintMap = {};
    const complaintDates = {};
    complaints.map(({ sent_date, type }) => {
      if (!complaintMap[type]) {
        complaintMap[type] = 0;
      }
      complaintMap[type] += 1;
      const date = moment(sent_date).format("YYYYMMDD");
      if (!complaintDates[date]) {
        complaintDates[date] = 0;
      }
      complaintDates[date] += 1;
    });
    console.log(complaintDates);

    // complaintMap["Faculty"] = 11
    // complaintMap["Academic Dishonesoty"] = 11
    complaintData = "";
    Object.entries(complaintMap).forEach(([type, amt]) => {
      data.push({ type, amt });
      complaintData += `${type}:${amt}, `;
    });
    dataContext = complaintData;

    data.sort((a, b) => b.amt - a.amt);
    data = data;
    console.log(data);

    Object.entries(complaintDates).forEach(([date, amt]) => {
      lineData.push({ date, amt });
    });
    lineData.sort((a, b) => b.date - a.date);

    lineData = lineData;
    draw();
  }

  async function draw() {
    pie.data = {
      labels: data.map((row) => row.type),
      datasets: [
        {
          data: data.map((row) => row.amt),
        },
      ],
    };
    (line.data = {
      labels: lineData.map((row) => row.date),
      datasets: [
        {
          label: "Complaints",
          data: lineData.map((row) => row.amt),
          fill: "origin",
          spanGaps: true,
        },
      ],
    }),
      console.log(data.map((row) => row.type));
    console.log(data.map((row) => row.amt));
    pie.update();
    line.update();
  }
  function initCharts() {
    pie = new Chart(chart1, {
      type: "pie",
      data: null,
      options: {
        plugins: {
          legend: {
            position: "bottom",
            title: {
              display: true,
              padding: 10,
              text: "Complaint Types",
            },
          },
        },
      },
    });
    line = new Chart(chart2, {
      type: "line",
      data: null,
      options: {
        scales: {
          x: {
            type: "time",
            time: {
              tooltipFormat: "MMM DD, YYYY",
              minUnit: "day",
              parser: "YYYYMMDD",
            },
          },
          y: {
            suggestedMin: 0,
            suggestedMax: 5,
            min: 0,
          },
        },
      },
    });
  }
  onMount(initCharts);
  onMount(get_complaints);
</script>

<div class="bg-white h-full mx-4 my-8 rounded">
  <div class="bg-primary text-white h-fit relative -top-5 mx-6 p-4 rounded-lg print:hidden">
    Report
  </div>
  <div class="flex justify-end items-center mx-12 gap-2 print:hidden">
    <div class="">
      <Clock />
    </div>
    <select class="select select-sm py-0 select-bordered border-gray-200 h-fit" name="time" bind:value={timeRange} on:change={get_complaints}>
      <option value="30 days">Last 30 Days</option>
      <option selected value="60 days">Last 60 Days</option>
      <option value="90 days">Last 90 Days</option>
      <option disabled>-----</option>
      <option value="Custom">Custom</option>
    </select>
    {#if timeRange == "Custom"}
    <input type="date" bind:value={date1}>
    <ArrowRight />
    <input type="date" bind:value={date2}>
    {/if}
    <button class="btn btn-primary btn-sm" on:click={() => {window.print()}}><Printer /> Export</button>
  </div>
  <div
    class="flex justify-center flex-col lg:flex-row print:flex-col print:h-full"
  >
    <div class="flex-[3]">
      {#if dataContext && dataContext != ""}
        <AiReport {dataContext} />
      {/if}
    </div>
    <div class="flex-[2] flex-col !print:h-full print:items-center p-4 {data.length == 0 ? "hidden" : "flex"}">
      <div
        class="sm:w-[45%] w-full sm:min-w-[500px] sm:p-10 p-4 mx-2 bg-white shadow-lg"
      >
        <canvas bind:this={chart1} class="max-h-[300px] 2xl:max-h-[300px]">
        </canvas>
        <div class="font-semibold text-xl pt-5">
          Complaints Report <span class="text-gray-400 text-sm"
            >Last 30 Days</span
          >
        </div>
        {#if data.length > 0}
          <div>
            Most Complained:
            <span class="text-red-400">
              {data
                .filter(
                  (complaint) => complaint.amt == data[0].amt && complaint.type
                )
                .map((comp) => comp.type)
                .join(", ")} with {data[0].amt} complaints</span
            >
          </div>
          <div>
            Least Complained:
            <span class="text-blue-400">
              {data
                .filter(
                  (complaint) =>
                    complaint.amt == data[data.length - 1].amt && complaint.type
                )
                .map((comp) => comp.type)
                .join(", ")}
            </span>
          </div>
        {/if}
      </div>
      <div
        class="sm:w-[45%] w-full sm:min-w-[500px] sm:p-10 p-4 m-4 mx-2 bg-white shadow-lg"
      >
        <canvas bind:this={chart2} class="max-h-[500px]"> </canvas>

        <div class="font-semibold text-xl pt-5">Daily Complaint</div>
        <div class="">Most </div>
      </div>
    </div>
  </div>
</div>
