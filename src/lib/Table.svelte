<script>
  import { ArrowDownAZ, CirclePlus, History, RotateCw, Search, X } from "lucide-svelte";
  import Tab from "./Tab.svelte";
  import Loader from "./Loader.svelte";

  export let title, filters, activeFilter = "All", filterList = (a) => {};
  export let addFunction = ()=>{}, addText="", addLink = ""
  export let list, filteredList = [], columns;
  export let onSearch = (col, text) => {};
  
  let searchCol, searchText;
  function onSearchChange(){
    onSearch(searchCol, searchText)
  }

  function changeFilter(e) {
    activeFilter = e.target.closest("[data-condition]").dataset.condition;
    console.log(activeFilter );

    console.log(e.target.closest(".dropdown"));
    if (e.target.closest(".dropdown")) {
      e.target.closest(".dropdown").removeAttribute("open");
    }
    filterList(activeFilter)
  }
  function getIconByText(data, text) {
  for (const item of data) {
    if (item.name === text) {
      return item.icon;
    }
  }
  return null; // Or return a default icon if not found
}
</script>


<div class="bg-white m-8 mb-4 h-fit relative overflow-visible max-w-[1250px] 2xl:max-w-[1300px] w-full mx-auto shadow-lg">
  <div class="w-full relative -top-5">
    <div
      class="rounded-lg bg-nu-blue text-white text-xl sm:mx-8 py-6 sm:p-6 p-4 flex justify-between items-center"
    >
      <div class="">{title}:</div>
      <div class="hidden lg:flex flex-wrap gap-1 text-base items-center">
        {#each filters as { name, icon }}
          <Tab
            label={name}
            {icon}
            active={activeFilter}
            condition={name}
            on:click={changeFilter}
          />
        {/each}
      </div>
      <div class="block lg:hidden">
        <details class="dropdown dropdown-end">
          <summary class="btn btn-sm m-1 flex-nowrap"><svelte:component this={getIconByText(filters, activeFilter)} class=" text-white" /> {activeFilter}</summary>
          <ul
            class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow text-black"
          >
            {#each filters as { name, icon }}
              <li class={name == activeFilter ? "bg-black/10" : ""}>
                <button data-condition={name} on:click={changeFilter}
                  ><svelte:component this={icon} class="inline text-primary" />
                  {name}</button
                >
              </li>
            {/each}
          </ul>
        </details>
      </div>
    </div>
    <div class="flex sm:flex-nowrap py-2 flex-wrap justify-center sm:items-center {addText ?"sm:justify-between":"sm:justify-end"} mx-4 md:mx-12">
      {#if addText && addLink}
      <a
        href={addLink}
        class="btn btn-primary btn-sm"
        ><CirclePlus class="text-yellow-300" />{addText}</a
      >
      {:else if addText}
        <button
        class="btn btn-primary btn-sm"
        on:click={() => {
          addFunction()
        }}><CirclePlus class="text-yellow-300" />{addText}</button
      >
      {/if}
      <div
        class="search flex justify-end items-center gap-2 text-blue-800"
      >
        <label class="flex justify-center items-center ">
          <select bind:value={searchCol} on:change={onSearchChange} class="rounded-e-none text-black border-b-2" name="searchCol" id="searchCol">
            {#each columns as {name, value}}
            {#if !["Status"].includes(name) && !name.toLowerCase().includes("date")}
              <option value={value}>{name}</option>
            {/if}
            {/each}
          </select>
          <input
          bind:value={searchText} 
          on:input={onSearchChange}
          id="search"
          autocomplete="off"
          type="text"
          placeholder="Search"
          class="rounded-s-none rounded-e-none border-b-2 px-2 active:border-none focus:border-0"
          />
          <button on:click={() => {searchText = ""; onSearchChange()}} class="bg-nu-blue text-yellow-300 p-1.5 rounded-s-none rounded-lg">
            {#if searchText}
            <X strokeWidth="3" />
            {:else}
            <Search strokeWidth="3" />
            {/if}
          </button>
        </label>
        <!-- <button><RotateCw /></button> -->
        <!-- <button><ArrowDownAZ /></button> -->
        <!-- <button><History /></button> -->
      </div>
    </div>
    <div class="overflow-x-auto overflow-y-hidden">
      {#if filteredList.length != 0 || (list && filteredList.length == 0)}
        <table class="table text-center">
          <thead class="text-lg">
            <tr>
              {#each columns as {name, className}}
                <th class={className}>{name}</th>
              {/each}
            </tr>
          </thead>
          <tbody>
            <slot />
          </tbody>
        </table>
        {#if list && filteredList.length == 0}
          <div class="text-center m-2   ">No results</div>
        {/if}
        {:else}
        <Loader />
      {/if}
    </div>
  </div>
</div>
<style>
  /* .search button {
    @apply bg-nu-blue text-yellow-300 p-2 text-2xl rounded-lg;
  } */
   .dropdown-content li:hover {
    background-color: rgba(0 0 0 / 0.1);
  }
</style>