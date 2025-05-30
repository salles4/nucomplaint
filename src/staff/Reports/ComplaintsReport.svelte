<script>
  import Chart from "chart.js/auto";
  import { onMount } from "svelte";
  import { supabase } from "../../supabase";
  import AiReport from "./AIReport..svelte";
  import moment from "moment";
  import "chartjs-adapter-moment";
  import Loader from "../../lib/Loader.svelte";

  // Selected time data
  export let date1, date2, timeRange, displayType;
  // sorted complaints objects
  let data = [];
  // chronological date data
  let lineData = [];
  // sorted by amt, date data
  let sortedDate = [];
  // data context for API
  let dataContext;
  // Chart's document.getElementById()
  let chart1, chart2;
  let pie, line;
  let loading = true;
  export let get_complaints = async () => {
    // Resets Data
    data = [];
    lineData = [];
    sortedDate = [];
    dataContext = null;
    loading = true;

    // Get data from DB depending on selected time
    let complaints;
    if (timeRange != "Custom") {
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
      complaints = data;
    } else if (date1 && date2) {
      const { data, error } = await supabase.rpc("get_complaints_time_range", {
        date1: moment(date1).format("YYYY-MM-DDT00:00"),
        date2: moment(date2).format("YYYY-MM-DDT23:59"),
      });
      if (error) {
        console.error(error);
        return;
      }
      complaints = data;
    } else {
      return;
    }

    // Count Category and Date Reports
    const complaintMap = {}; // Category: Number of reports
    const complaintDates = {}; // Date:Number of Reports
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

    // Build context for AI API
    let complaintData = "";
    Object.entries(complaintMap).forEach(([type, amt]) => {
      data.push({ type, amt });
      complaintData += `${type}:${amt}, `;
    });
    dataContext = complaintData;

    // Sort Data for chart
    data.sort((a, b) => b.amt - a.amt);
    data = data;

    Object.entries(complaintDates).forEach(([date, amt]) => {
      lineData.push({ date, amt });
    });
    sortedDate = lineData.toSorted((a, b) => b.amt - a.amt);
    lineData.sort((a, b) => b.date - a.date);
    lineData = lineData;

    draw();
    loading = false;
  };

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
            position: "left",
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
  onMount(get_complaints);
  onMount(initCharts);
</script>

{#if timeRange == "Custom" && (!date1 || !date2)}
  <div class="w-full text-center p-6">
    Select a date to generate a report between the time range..
  </div>
{:else if loading}
  <div class="mx-auto w-full">
    <Loader />
  </div>
{:else if data.length == 0 && !loading}
  <div class="w-full text-center p-6">No data on the selected time range..</div>
{/if}
<!-- <div class="flex-[3]">
  {#if dataContext && dataContext != ""}
    <AiReport reportType={"complaint"} {dataContext} />
  {/if}
</div> -->
<div
  class="justify-center !print:h-full p-4 print:p-0 flex-wrap {data.length ==
    0 || loading
    ? 'hidden'
    : 'flex'}"
>
    <div
      class="chart sm:w-[45%] w-full sm:min-w-[500px] sm:p-10 h-fit mx-2 bg-white shadow-lg {displayType == "Chart" ? "block" : "hidden"}"
    >
      <canvas bind:this={chart1} class="max-h-[150px] ">
      </canvas>
      <div class="">
      <div class="chartTitle font-semibold text-xl pt-5">
        Complaints Report <span class="text-gray-400 text-sm chartText"
          >{timeRange != "Custom"
            ? `Last ${timeRange}`
            : `${moment(date1).format("MM/DD/YY")} to ${moment(date2).format("MM/DD/YY")}`}</span
        >
      </div>
      {#if data.length > 0}
        <div class="chartText">
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
        <div class="chartText">
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
    </div>

        

    <div
      class="chart sm:w-[45%] w-full sm:min-w-[500px] sm:p-10 h-fit mx-2 bg-white shadow-lg {displayType == "Chart" ? "block" : "hidden"}"
    >
      <canvas bind:this={chart2} class="max-h-[200px]"> </canvas>

      <div class="">
      <div class="chartTitle font-semibold text-xl pt-5">Daily Complaint</div>

        {#if sortedDate.length != 0}
        <div class="chartText">
          Day with most complaint: {moment(sortedDate[0].date).format(
            "MMM DD, YYYY"
          )}
        </div>
        <div class="chartText">
          Day with least complaint: {moment(
            sortedDate[sortedDate.length - 1].date
          ).format("MMM DD, YYYY")}
        </div>
        {/if}
      </div>
    </div>


    <div
      class="sm:w-[45%] w-full sm:min-w-[500px] sm:p-10 mx-2 m-4 border bg-white shadow-lg tablePrint {displayType == "Table" || true ? "block" : "hidden"}"
    >
      <div class="text-xl font-bold text-center pb-4 print:text-base tableTitle">Number of Complaints</div>
      <table class="table max-w-[300px] mx-auto">
        <thead class="border-2">
          <tr class="text-center">
            <th class="border">Complaint Type</th>
            <th class="border">Amount</th>
          </tr>
        </thead>
        <tbody class="border">
          {#each data as { type, amt }}
            <tr class="rowPrint">
              <td>{type}</td>
              <td class="text-center">{amt}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>


    <div
      class="sm:w-[45%] w-full sm:min-w-[500px] sm:p-10 mx-2 m-2 border bg-white shadow-lg tablePrint {displayType == "Table" || true ? "block" : "hidden"}"
    >
      <div class="text-xl font-bold text-center pb-4 print:text-base tableTitle">Complaints per Day</div>
      <table class="table max-w-[300px] mx-auto">
        <thead class="border-2">
          <tr class="text-center">
            <th class="border">Date</th>
            <th class="border">Complaints</th>
          </tr>
        </thead>
        <tbody class="border">
          {#each lineData as { date, amt }}
            <tr class="rowPrint">
              <td>{moment(date).format("MMMM DD, YYYY")}</td>
              <td class="text-center w-[32px]">{amt}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  
</div>
