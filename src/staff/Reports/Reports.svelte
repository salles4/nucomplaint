<script>
  import { ArrowRight, Clock, Printer, Gavel, MessageSquareWarning, Table, CirclePlus, FileWarning } from "lucide-svelte";
  import ComplaintsReport from "./ComplaintsReport.svelte";
  import Tab from "../../lib/Tab.svelte";
  import active from "svelte-spa-router/active";
  import OffensesReport from "./OffensesReport.svelte";
  import moment from "moment";
  import { user_name } from "../../store";
  let timeRange;
  let date1, date2
  let complaints;
  let offenses;
  let activeReportType = "Complaints"
  let displayType = "Chart";
  let addReport = false;
  let reportInput = "Lorem ipsum dolor sit amet consectetur adipisicing elit. In aspernatur nostrum eligendi quasi dignissimos eius nemo molestias optio fugit, repellat, voluptates unde! Tempore earum voluptatibus maxime vel tenetur corrupti debitis esse minus, magni, inventore enim sint sapiente voluptate amet temporibus eligendi? Hic, consequuntur architecto maiores dolorem assumenda quasi harum ipsum.";
  function changeFilter(e) {
    activeReportType = e.target.closest("[data-condition]").dataset.condition;
    console.log(activeReportType);

    console.log(e.target.closest(".dropdown"));
    if (e.target.closest(".dropdown")) {
      e.target.closest(".dropdown").removeAttribute("open");
    }
    onTimeChange();
  }
  function onTimeChange(){
    if(activeReportType == "Complaints"){
      complaints();
    }else{
      offenses();
    }
  }
</script>
<div class="hidden print:block text-2xl font-bold text-center">
  {activeReportType} Report
</div>
<div class="text-xs text-center hidden print:block ">{timeRange != "Custom"
            ? `Last ${timeRange} relative to ${moment().format("MM/DD/YYYY")}`
            : `${moment(date1).format("MM/DD/YY")} to ${moment(date2).format("MM/DD/YY")}`}</div>
<div class="bg-white h-fit sm:mx-4 mx-2 mb-2 my-8 print:my-0 rounded">
  <div class="bg-primary text-white h-fit sm:w-auto w-full  relative -top-5 sm:mx-6 mx-0 p-6 sm:px-8 px-4 rounded-lg print:hidden flex justify-between items-center">
    <div class="text-lg">
      Reports
    </div>
    <div class="hidden lg:flex flex-wrap gap-1 text-base items-center">
          <Tab
            label={"Complaints"}
            icon={Gavel}
            active={activeReportType}
            condition={"Complaints"}
            on:click={changeFilter}
          />
          <Tab
            label={"Offenses"}
            icon={MessageSquareWarning}
            active={activeReportType}
            condition={"Offenses"}
            on:click={changeFilter}
          />

      </div>
      <div class="block lg:hidden">
        <details class="dropdown dropdown-end">
          <summary class="btn btn-sm m-1 flex-nowrap">{#if activeReportType == "Complaints"}<Gavel /> {:else} <MessageSquareWarning /> {/if} {activeReportType}</summary>
          <ul
            class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow text-black"
          >
              <li class={"Complaints" == activeReportType ? "bg-black/10" : ""}>
                <button data-condition="Complaints" on:click={changeFilter}> <Gavel class="inline text-primary" />
                  Complaints</button
                >
              </li>
              <li class={"Offenses" == activeReportType ? "bg-black/10" : ""}>
                <button data-condition="Offenses" on:click={changeFilter}> <MessageSquareWarning class="inline text-primary" />
                  Offenses</button
                >
              </li>
          </ul>
        </details>
      </div>
  </div>
  <div class="flex justify-between items-center mx-4 sm:mx-12 gap-2 print:hidden">
    <div class="flex items-center gap-2">
      <div class="">
        <Clock />
      </div>
      <select class="select select-sm py-0 select-bordered h-fit" name="time" bind:value={timeRange} on:change={() => onTimeChange()}>
        <option value="30 days">Last 30 Days</option>
        <option selected value="60 days">Last 60 Days</option>
        <option value="90 days">Last 90 Days</option>
        <option disabled>-----</option>
        <option value="Custom">Custom</option>
      </select>
      {#if timeRange == "Custom"}
      <input type="date" bind:value={date1} on:change={() => onTimeChange()}>
      <ArrowRight />
      <input type="date" bind:value={date2} on:change={() => onTimeChange()}>
      {/if}
      <!-- <div class="ms-4">
        <Table />
      </div>
      <select class="select select-sm py-0 select-bordered h-fit w-[120px]" name="time" bind:value={displayType}>
        <option>Chart</option>
        <option>Table</option>
      </select> -->
    </div>
    {#if !addReport}
    <button class="btn btn-primary btn-sm" on:click={() => {addReport = true}}><CirclePlus /> Add Report</button>
    {/if}
  </div>
  {#if addReport}
  <div class="flex flex-col justify-center w-full items-center p-4 gap-2 print:hidden">
    <div class="text-start lg:w-1/2 w-full">
      Report:
    </div>
    <textarea bind:value={reportInput} class="lg:w-1/2 w-full h-[12rem] textarea textarea-bordered" name="report" id="report"></textarea>
    <div class="flex lg:w-1/2 w-full gap-2 justify-end">
      <button class="btn btn-primary btn-sm" on:click={() => {window.print()}}><Printer /> Export</button>
      <button class="btn btn-secondary btn-sm" on:click={() => {addReport = false}}>Cancel</button>
    </div>
  </div>
  {/if}
  <div class="hidden print:block px-8">
    <div class="">
      <span class="font-bold text-lg"><FileWarning class="inline" /> Staff Report</span>
      <br>
      {reportInput}
    </div>
  </div>
  {#if timeRange}
    <div class="justify-center flex-col lg:flex-row print:flex-col  {activeReportType == "Complaints" ? "flex" : "hidden"}">
      <ComplaintsReport {timeRange} {date1} {date2} bind:get_complaints={complaints} {displayType} />
    </div>
    
    <div class="justify-center flex-col lg:flex-row print:flex-col {activeReportType == "Offenses" ? "flex" : "hidden"}"> 
      <OffensesReport {timeRange} {date1} {date2} bind:get_offenses={offenses} {displayType} />
    </div>
  {/if}
  <div class="w-fit ms-auto text-center hidden print:block mt-6 me-4">
    <div class="font-bold">{$user_name}</div>
    <div class="text-sm">{moment().format("MMM DD, YYYY")}</div>
  </div>
</div>