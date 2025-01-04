<script>
  import {
    Download,
    FileCheck,
    Info,
    LucideFileCheck,
    RotateCcwIcon,
    Stars,
  } from "lucide-svelte";
  import { onMount } from "svelte";
  import Loader from "../../lib/Loader.svelte";
  import { supabase } from "../../supabase";
  import moment from "moment";

  export let dataContext;
  export let complaintReport = "";
  let report_id,
    dateTimeGen,
    isSaved = false;

  async function generateReport() {
    isSaved = false;
    console.log(dataContext);

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
      const complaintData = dataReport[0];
      complaintReport = formatAIText(complaintData.report);
      console.log("FROM DB", complaintData);
      dateTimeGen = {
        date: moment(complaintData.time_generated).format("MMM DD, YYYY"),
        time: moment(complaintData.time_generated).format("hh:mm:ss a"),
      };
      report_id = complaintData.report_id;
      isSaved = complaintData.saved;
      return;
    }

    const response = await fetch(
      "https://nucomplaint-api.vercel.app/api/complaint_report",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          complaintData: dataContext,
        }),
      }
    );
    const data = await response.json();
    complaintReport = formatAIText(data.message);

    pushReportToDB(data.message);
    console.log("FROM SERVER \n", data);
  }
  /**
   * @param {String} report
   */
  async function pushReportToDB(report) {
    const { data: deleteData, error: deleteError } = await supabase
      .from("ai_reports")
      .delete()
      .eq("saved", false)
      .eq("type", "complaints")
      .select();

    if (deleteError) {
      console.error(deleteError);
      return;
    }
    console.log(deleteData);

    const { data, error } = await supabase
      .from("ai_reports")
      .insert({
        report: report,
        type: "complaint",
        context_data: dataContext,
      })
      .select();
    if (error) {
      console.error(error);
    }

    report_id = data[0].report_id;
    dateTimeGen = {
      date: moment(data[0].time_generated).format("MMM DD, YYYY"),
      time: moment(data[0].time_generated).format("hh:mm:ss a"),
    };
    console.log(data);
  }
  async function regenerate() {
    complaintReport = "";
    const { data, error } = await supabase
      .from("ai_reports")
      .delete()
      .eq("saved", false)
      .eq("type", "complaint")
      .select();

    if (error) {
      console.error(error);
      alert("Failed to regenerate");
      return;
    }
    console.log(data);
    generateReport();
  }
  async function saveReport() {
    const { data, error } = await supabase
      .from("ai_reports")
      .update({ saved: true })
      .eq("report_id", report_id)
      .select();

    if (error || !data) {
      console.error(error);
      alert("Failed to save");
      return;
    }
    console.log(data);
    isSaved = data[0].saved;
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
  class="ai bg-white w-[95%] sm:max-w-[60rem] m-4 mx-auto p-4 rounded-lg border-2 border-primary"
>
  <div class="flex items-center gap-2">
    <Stars class="inline-block" />
    <span class="text-lg font-semibold flex items-center gap-2"> Suggestions 
      <span class="tooltip tooltip-right" data-tip="This is AI-Generated content. It can provide inaccurate information.">
        <Info size="18" />
      </span>
    </span>
    <div class="text-xs text-gray-400 ms-auto mt-auto align-middle">
      Powered By:<img
        src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg"
        alt="Gemini"
        class="h-5 mx-auto"
      />
    </div>
  </div>
  <div class="sm:ps-8 p-2 text-justify sm:text-base text-sm">
    {#if complaintReport}
      {@html complaintReport}
      <div
        class="border-t border-black p-4 pb-0 px-0 mt-2 flex flex-wrap justify-between items-center gap-2"
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
