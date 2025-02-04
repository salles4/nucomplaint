<script>
  import moment from "moment";
  import { supabase } from "../../supabase";
  import { Chart } from "chart.js";
  import ChartDataLabels from 'chartjs-plugin-datalabels';
  import { onMount } from "svelte";

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
  let get_complaints = async () => {
    // Resets Data
    data = [];
    lineData = [];
    sortedDate = [];
    dataContext = null;
    loading = true;

    // Get data from DB depending on selected time
    let complaints;

    const { data: complaintsData, error } = await supabase.rpc(
      "get_complaints_last_custom_days",
      {
        days: "90 days",
      }
    );
    if (error) {
      console.error(error);
      return;
    }
    complaints = complaintsData;
    console.log(complaints);

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
  let draw = () => {
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
  };
  function initCharts() {
    pie = new Chart(chart1, {
      type: "pie",
      data: null,
      options: {
        plugins: {
          // datalabels:{
          //   color: '#000',
          //   formatter: function(value, context) {
          //       let sum = 0;
          //       let dataArr = context.chart.data.datasets[0].data;
          //       dataArr.map(data => {
          //           sum += data;
          //       });
          //       let percentage = Math.floor(value*100 / sum)+"%";
          //       return percentage;
          //   }
          // },
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
          datalabels:{
            display: false
          },
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
  onMount(initCharts);
  onMount(get_complaints);
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
