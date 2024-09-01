<script>
  import Chart from "chart.js/auto";
  import { onMount } from "svelte";
  let chart1, chart2;
  const data = [
    { year: "January", category1: 14, category2: 12 },
    { year: "February", category1: 20, category2: 26 },
    { year: "March", category1: 15, category2: 19 },
    { year: "April", category1: 25, category2: 8 },
    { year: "May", category1: 22, category2: 9 },
    { year: "June", category1: 30, category2: 1 },
    { year: "July", category1: 28, category2: 4 },
    { year: "August", category1: 21, category2: 12 },
  ];

  async function draw() {
    new Chart(chart1, {
      type: "line",
      data: {
        labels: data.map((row) => row.year),
        datasets: [
          {
            label: "Category 1",
            data: data.map((row) => row.category1),
            fill: true,
          },
          {
            label: "Category 2",
            data: data.map((row) => row.category2),
            fill: true,
          },
        ],
      },
      options: {
        scales: {
          y: {
            min: 0,
            max: 50,
          },
        },
      },
    });
    new Chart(chart2, {
      type: "bar",
      data: {
        labels: data.map((row) => row.year),
        datasets: [
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

  onMount(draw);
</script>

<div class="flex flex-wrap justify-center items-center">
  <div class="w-[45%] min-w-[500px] p-10 m-12 mx-2 bg-white  shadow-lg">
    <canvas bind:this={chart1}> </canvas>

    <div class="font-semibold text-xl pt-5">Daily Complaints</div>
    <div>
       {(data[data.length - 2].category1 +
        data[data.length - 2].category2) -
        (data[data.length - 1].category1 +
        data[data.length - 1].category2)} ({data[data.length - 2].category1 +
        data[data.length - 2].category2} yesterday) in today's complaints
    </div>
    <div>
      Because students have {data[data.length - 1].category1 +
        data[data.length - 1].category2} complaints for today
    </div>
    <div>
      Most Complained Today:
      <span class="text-blue-400"> Category 1 </span>
    </div>
    <div>
      Least Complained Today:
      <span class="text-red-400"> Category 2 </span>
    </div>
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
