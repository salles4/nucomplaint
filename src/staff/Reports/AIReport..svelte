<script>
  import {
    Info,
    RotateCcwIcon,
    Stars,
  } from "lucide-svelte";
  import { onMount } from "svelte";
  import Loader from "../../lib/Loader.svelte";
  import { supabase } from "../../supabase";
  import moment from "moment";

  export let dataContext; // context for ai
  export let reportType; // complaint or offense
  let generatedReport = ""; // ai-generated suggestions
  let dateTimeGen; // time generated

  async function generateReport() {
    // check if there's generated report already in db
    const { data: dataReport, error } = await supabase
      .from("ai_reports")
      .select("*")
      .eq("context_data", dataContext)
      .eq("saved", false);
    if (error) {
      console.error(error);
      return;
    }
    if (dataReport.length != 0) {
      const dbGeneratedReport = dataReport[0];
      generatedReport = formatAIText(dbGeneratedReport.report);
      console.log("FROM DB", dbGeneratedReport);
      dateTimeGen = {
        date: moment(dbGeneratedReport.time_generated).format("MMM DD, YYYY"),
        time: moment(dbGeneratedReport.time_generated).format("hh:mm:ss a"),
      };
      return;
    }
    // Otherwise, generate new report
    const response = await fetch(
      `https://nucomplaint-api.vercel.app/api/${reportType}_report`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dataContext: dataContext,
        }),
      }
    );
    const data = await response.json();
    generatedReport = formatAIText(data.message);

    pushReportToDB(data.message);
    console.log("FROM SERVER \n", data);
  }
  /**
   * @param {String} report
   */
  async function pushReportToDB(report) {
    // Deletes other generated reports of same type
    // const { data: deleteData, error: deleteError } = await supabase
    //   .from("ai_reports")
    //   .delete()
    //   .eq("saved", false)
    //   .eq("type", reportType)
    //   .select();

    // if (deleteError) {
    //   console.error(deleteError);
    //   return;
    // }
    // Inserts newly generated report to db
    const { data, error } = await supabase
      .from("ai_reports")
      .insert({
        report: report,
        type: reportType,
        context_data: dataContext,
      })
      .select();
    if (error) {
      console.error(error);
    }

    dateTimeGen = {
      date: moment(data[0].time_generated).format("MMM DD, YYYY"),
      time: moment(data[0].time_generated).format("hh:mm:ss a"),
    };
    console.log(data);
  }
  async function regenerate() {
    generatedReport = "";
    const { data, error } = await supabase
      .from("ai_reports")
      .delete()
      .eq("saved", false)
      .eq("type", reportType)
      .select();

    if (error) {
      console.error(error);
      alert("Failed to regenerate");
      return;
    }
    console.log(data);
    generateReport();
  }
  /**
   * @param {string} message
   */
  function formatAIText(message) {
    return message
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)/g, '<b class="pt-6">• </b>')
      .replace(/\n/g, "<br>");
  }
  onMount(generateReport);
</script>

<div
  class="ai bg-white w-[95%] sm:max-w-[50rem] m-4 print:m-0 mx-auto p-4 rounded-lg border-2 border-primary"
>
  <div class="flex items-center gap-2">
    <Stars class="inline-block" />
    <span class="text-lg font-semibold flex items-center gap-2"> Suggestions 
      <span class="tooltip tooltip-right print:hidden" data-tip="This is AI-Generated content. It can provide inaccurate information.">
        <Info size="18" />
      </span>
    </span>
    <div class="text-xs text-gray-400 ms-auto mt-auto align-middle print:hidden">
      Powered By:<img
        src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg"
        alt="Gemini"
        class="h-5 mx-auto"
      />
    </div>
  </div>
  <div class="sm:ps-8 p-2 text-justify sm:text-base text-sm print:text-sm">
    {#if generatedReport}
      {@html generatedReport}
      <div
        class="border-t border-black p-4 pb-0 px-0 mt-2 flex flex-wrap justify-between items-center gap-2 print:hidden"
      >
        <div class="text-gray-500 sm:text-sm text-xs flex flex-wrap flex-grow">
          <!-- <span>Generated at: </span>  -->
           {#if dateTimeGen}
           <span>
             {dateTimeGen.date},
           </span>
           <span>
             {dateTimeGen.time}
           </span>
           {/if}
        </div>
        <div class="flex flex-wrap justify-center gap-2 ">
          <!-- {#if isSaved}
            <button class="btn btn-primary btn-sm btn-outline"
              ><FileCheck /> Saved</button
            >
          {:else}
            <button class="btn btn-primary btn-sm" on:click={saveReport}
              ><Download /> Save Report</button
            >
          {/if} -->
          <button class="btn btn-secondary btn-sm" on:click={regenerate}
            ><RotateCcwIcon /> Generate Again</button
          >
        </div>
      </div>
    {:else}
      <div class="flex">
        <span class="loading loading-bars loading-lg m-auto"></span>
      </div>
      <!-- <Loader /> -->
    {/if}
  </div>
</div>

<style>
  .ai{
    @apply print:border-0 print:!text-[8px]
  }
</style>