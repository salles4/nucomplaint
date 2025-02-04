<script>
  import { ArrowLeftCircle, SendHorizontal, X } from "lucide-svelte";
  import { supabase } from "../../supabase";
  import { user_id } from "../../store";
  import { afterUpdate, onMount } from "svelte";
  import { fade, slide } from "svelte/transition";
  import { pop } from "svelte-spa-router";
  import moment from "moment";

  export let offense_id;

  let messages;
  let messageInput;
  let chatDiv

  async function getMessages() {
    const { data, error } = await supabase
      .from("messages")
      .select("message, time_sent, sender_id(first_name, last_name, user_id)")
      .eq("offense_id", offense_id)
      .order("time_sent", { ascending: true });

    if (error) {
      console.error(error);

      return;
    }
    console.log(data);

    messages = data;
    
  }
  const scrollToBottom = () => {
    if(chatDiv && messages){
      chatDiv.scroll({top: chatDiv.scrollHeight, behavior: "smooth"})
    }
  }
  $: if(chatDiv && messages){
    scrollToBottom()
  }
  afterUpdate(() => {
		console.log("afterUpdate");
		if(messages) scrollToBottom();
  });
  async function sendMessage() {
    if(!messageInput) return;
    const { data, error } = await supabase.from("messages").insert({
      type: "offense",
      message: messageInput,
      sender_id: $user_id,
      offense_id: offense_id,
    });

    if (error) {
      alert("Failed to send");
      console.error(error);
    }
    messageInput = "";
  }
  supabase
    .channel("messages")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "messages" },
      (payload) => {
        console.log("Realtime Update", payload);
        getMessages();
      }
    )
    .subscribe();
  onMount(getMessages);
</script>

<div class="p-6 pb-2 flex items-center justify-between gap-2 sticky top-0 bg-white border-b border-s">
  <h1 class="text-2xl font-bold">Message</h1>
  <button on:click={pop}><X /></button>
</div>
<div class="flex-grow px-4 overflow-y-auto" bind:this={chatDiv}>
  {#if messages && messages.length != 0}
    {#each messages as { message, time_sent, sender_id: { user_id: sender_id, last_name, first_name } }, index}
      <div class="chat {sender_id == $user_id ? 'chat-end' : 'chat-start'}">
        {#if index == messages.length - 1 || (index != messages.length - 1 && messages[index + 1].sender_id.user_id != sender_id)}
          <div class="chat-image avatar">
            <div class="w-10 rounded-full text-xs">
              <img
                alt="Missing Profile"
                src="https://nlkprjuuixtprwiqypcy.supabase.co/storage/v1/object/public/profile_pics/{sender_id}.jpg"
                on:error={(e) => {
                  e.target.src='./img/default_profile.jpg';
                }}
              />
            </div>
          </div>
        {:else}
          <div class="chat-image avatar">
            <div class="w-10"></div>
          </div>
        {/if}
        {#if index == 0 || (index != 0 && messages[index - 1].sender_id.user_id != sender_id)}
          <div class="chat-header">
            {first_name}
            <span class="md:inline hidden">{last_name}</span>
            <time class="text-xs opacity-50">{moment(time_sent).format("MM/DD hh:mma")}</time>
          </div>
        {/if}
        <div  
          class="chat-bubble lg:max-w-[40rem] max-w-[80%] {sender_id == $user_id
            ? 'bg-yellow-300 text-black'
            : 'bg-blue-600 text-white'} "
        >
          {message}
        </div>
      </div>
    {/each}
  {:else if messages && messages.length == 0}
  <div class="mt-auto text-center p-4">
    No messages yet.
  </div>
  {/if}
</div>

<div class="message-area flex items-center p-4 gap-4 sticky bottom-0 bg-white">
  <textarea
    rows="4"
    class="flex-grow text-black"
    placeholder="Type your message here"
    bind:value={messageInput}
  ></textarea>
  <button class="btn btn-primary" disabled={!messageInput} on:click={sendMessage}>
    <SendHorizontal />
  </button>
</div>
