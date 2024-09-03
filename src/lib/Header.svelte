<script>
  import { auth} from "../store";
  import logo from '../assets/NU_shield.svg'

  function logout() {
    auth.set(null);
    localStorage.removeItem("v0Auth");
  }
</script>

<div
  class="bg-nu-blue w-full flex justify-between items-center p-6 gap-2 text-white"
>
  <img
    src={logo}
    alt="nu logo"
    class="h-12"
  />
  <div class="text-2xl">
    <a href="./#/notif">
      <i class="bi bi-bell"></i>
    </a>
    <button on:click={logout}>
      <i class="bi bi-power"></i>
    </button>
  </div>
</div>
