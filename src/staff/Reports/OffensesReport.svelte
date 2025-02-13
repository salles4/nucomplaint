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
  export let get_offenses = async () => {
    // Resets Data
    data = [];
    lineData = [];
    sortedDate = [];
    dataContext = null;
    loading = true;

    // Get data from DB depending on selected time
    let offenses;
    if (timeRange != "Custom") {
      const { data, error } = await supabase.rpc(
        "get_offenses_last_custom_days",
        {
          days: timeRange,
        }
      );
      if (error) {
        console.error(error);
        return;
      }
      offenses = data;
    } else if (date1 && date2) {
      const { data, error } = await supabase.rpc("get_offenses_time_range", {
        date1: moment(date1).format("YYYY-MM-DDT00:00"),
        date2: moment(date2).format("YYYY-MM-DDT23:59"),
      });
      if (error) {
        console.error(error);
        return;
      }
      offenses = data;
    } else {
      return;
    }

    // Count Category and Date Reports
    const offensesMap = {}; // Category: Number of reports
    const offensesDates = {}; // Date:Number of Reports
    offenses.map(({ time_created, violation }) => {
      if (!offensesMap[violation]) {
        offensesMap[violation] = 0;
      }
      offensesMap[violation] += 1;

      const date = moment(time_created).format("YYYYMMDD");
      if (!offensesDates[date]) {
        offensesDates[date] = 0;
      }
      offensesDates[date] += 1;
    });

    // Build context for AI API
    let offenseDataContext = "";
    Object.entries(offensesMap).forEach(([violation, amt]) => {
      data.push({ violation, amt });
      offenseDataContext += `${violation}:${amt}, `;
    });
    dataContext = offenseDataContext;

    // Sort Data for chart
    data.sort((a, b) => b.amt - a.amt);
    data = data;

    Object.entries(offensesDates).forEach(([date, amt]) => {
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
      labels: data.map((row) => row.violation),
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
          label: "Offenses",
          data: lineData.map((row) => row.amt),
          fill: "origin",
          spanGaps: true,
        },
      ],
    }),
      console.log(data.map((row) => row.violation));
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
              text: "Violation Types",
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
  onMount(get_offenses);
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
{:else if data.length == 0}
  <div class="w-full text-center p-6">No data on the selected time range..</div>
{/if}
<div class="flex-[3]">
  {#if dataContext && dataContext != ""}
    <AiReport reportType={"offense"} {dataContext} />
  {/if}
</div>
<div
  class="flex-[2] flex-col !print:h-full lg:items-start items-center print:items-center p-4 print:p-0 {data.length ==
    0 || loading
    ? 'hidden'
    : 'flex'}"
>
  <div
    class="chart sm:w-[45%] w-full sm:min-w-[500px] sm:p-10 p-4 mx-2 bg-white shadow-lg {displayType ==
    'Chart'
      ? 'block'
      : 'hidden'}"
  >
    <canvas bind:this={chart1} class="max-h-[300px] 2xl:max-h-[300px]">
    </canvas>
    <div class="">
    <div class="chartTitle font-semibold text-xl pt-5">
      Offense Report <span class="text-gray-400 text-sm"
        >{timeRange != "Custom"
          ? `Last ${timeRange}`
          : `${moment(date1).format("MM/DD/YY")} to ${moment(date2).format("MM/DD/YY")}`}</span
      >
    </div>
    {#if data.length > 0}
      <div class="chartText">
        Most Violated:
        <span class="text-red-400">
          {data
            .filter(
              (complaint) => complaint.amt == data[0].amt && complaint.violation
            )
            .map((comp) => comp.violation)
            .join(", ")} with {data[0].amt} complaints</span
        >
      </div>
      <div class="chartText">
        Least Violated:
        <span class="text-blue-400">
          {data
            .filter(
              (complaint) =>
                complaint.amt == data[data.length - 1].amt &&
                complaint.violation
            )
            .map((comp) => comp.violation)
            .join(", ")}
        </span>
      </div>
    {/if}
    </div>
  </div>

  <div
    class="sm:w-[45%] w-full sm:min-w-[500px] sm:p-10 mx-2 m-4 bg-white border shadow-lg tablePrint {displayType == "Table" ? "block" : "hidden"}"
  >
    <div class="text-xl font-bold text-center py-2 print:text-base">Number of Offense</div>
      <table class="table max-w-[300px] mx-auto">
        <thead class="border-2">
          <tr class="text-center">
            <th class="border">Offense Type</th>
            <th class="border">Amount</th>
          </tr>
        </thead>
        <tbody class="border">
          {#each data as { violation, amt }}
            <tr class="rowPrint">
              <td>{violation}</td>
              <td class="text-center">{amt}</td>
            </tr>
          {/each}
        </tbody>
      </table>
  </div>

  <div
    class="chart sm:w-[45%] w-full sm:min-w-[500px] sm:p-10 p-4 m-4 mx-2 bg-white shadow-lg {displayType ==
    'Chart'
      ? 'block'
      : 'hidden'}"
  >
    <canvas bind:this={chart2} class="max-h-[500px]"> </canvas>

    <div>
    <div class="chartTitle font-semibold text-xl pt-5">Offense per Day</div>
    {#if sortedDate.length != 0}
      <div class="chartText">
        Day with most violation: {moment(sortedDate[0].date).format(
          "MMM DD, YYYY"
        )}
      </div>
      <div class="chartText">
        Day with least violation: {moment(
          sortedDate[sortedDate.length - 1].date
        ).format("MMM DD, YYYY")}
      </div>
    {/if}
    </div>
  </div>

  <div
    class="sm:w-[45%] w-full sm:min-w-[500px] sm:p-10 mx-2 m-4 bg-white border shadow-lg tablePrint {displayType == "Table" ? "block" : "hidden"}"
  >
    <div class="text-xl font-bold text-center py-2 print:text-base">Offense per Day</div>
      <table class="table max-w-[300px] mx-auto">
        <thead class="border-2">
          <tr class="text-center">
            <th class="border">Offense Type</th>
            <th class="border">Amount</th>
          </tr>
        </thead>
        <tbody class="border">
          {#each lineData as { date, amt }}
            <tr class="rowPrint">
              <td>{moment(date).format("MMMM DD, YYYY")}</td>
              <td class="text-center">{amt}</td>
            </tr>
          {/each}
        </tbody>
      </table>
  </div>
</div>
