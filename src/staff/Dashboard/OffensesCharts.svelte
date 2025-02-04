<script>
  import Chart from "chart.js/auto";
  import { onMount } from "svelte";
  import { supabase } from "../../supabase";
  import moment from "moment";
  import "chartjs-adapter-moment";
  import Loader from "../../lib/Loader.svelte";

  // sorted complaints objects
  let data = [];
  // chronological date data
  let lineData = [];
  // sorted by amt, date data
  let sortedDate = [];
  // Chart's document.getElementById()
  let chart1, chart2;
  let pie, line;
  let loading = true;
  export let get_offenses = async () => {
    // Resets Data
    data = [];
    lineData = [];
    sortedDate = [];
    loading = true;

    // Get data from DB depending on selected time
    let offenses;

    const { data: offensesData, error } = await supabase.rpc(
      "get_offenses_last_custom_days",
      {
        days: "90 days",
      }
    );
    if (error) {
      console.error(error);
      return;
    }
    offenses = offensesData;

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

    Object.entries(offensesMap).forEach(([violation, amt]) => {
      data.push({ violation, amt });
    });

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
        plugins: {
          title: {
            display: true,
            padding: 24,
            text: "Complaint Timeline",
          },
          legend:{
            display: false,
          }
        },
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

<div class="flex justify-evenly flex-wrap">
  <div class="sm:w-[40%] w-full sm:min-w-[500px] p-12 m-4 mx-2 bg-white shadow-lg flex items-center">
    <canvas bind:this={chart1} class="max-h-[200px]"></canvas>
  </div>
  <div
    class="sm:w-[40%] w-full sm:min-w-[500px] p-6 m-4 mx-2 bg-white shadow-lg"
  >
    <canvas bind:this={chart2} class="max-h-[400px]"> </canvas>
  </div>
</div>