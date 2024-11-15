<script>
  import { auth} from "../store";
  import logo from '../assets/NU_shield.svg'
  import { Bell, Power } from "lucide-svelte";
  import { signOut } from "firebase/auth";
  import { firebaseAuth } from "../firebase";

  function logout() {
    auth.set(null);
    localStorage.removeItem("v0Auth");
    signOut(firebaseAuth)
  }
</script>

<div
  class="bg-nu-blue w-full flex justify-between items-center py-2 px-6 sm:p-6 gap-2 text-white"
>
  <img
    src={logo}
    alt="nu logo"
    class="h-12 ms-10 sm:m-0"
  />
  <div class="flex gap-2">
    <button>
      <Bell />
    </button>
    <button on:click={logout}>
      <Power />
    </button>
  </div>
</div>
