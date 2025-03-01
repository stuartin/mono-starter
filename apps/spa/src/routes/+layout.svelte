<script lang="ts">
  import "../app.css";
  import { goto } from "$app/navigation";
  import { setAuth } from "$lib/auth/auth.svelte";

  let { children } = $props();

  const auth = setAuth();
</script>

<div class="flex flex-col min-h-screen bg-gray-100 text-gray-900">
  <!-- Header -->
  <header class="bg-gray-400 text-white p-4 flex">
    <a href="/">
      <h1 class="text-xl font-bold">My Website</h1>
    </a>
    <ul class="flex gap-4 grow justify-center">
      {#if auth.user}
        <li>
          <a href="/profile">profile</a>
        </li>
      {/if}
    </ul>
    <div>
      <button onclick={() => console.log(auth.user)}>test</button>
      {#if auth.user}
        <button onclick={() => auth.logout()}>logout</button>
      {:else}
        <button onclick={() => goto("/auth/login")}>login</button>
      {/if}
    </div>
  </header>

  <!-- Main Content -->
  <main class="flex-1 p-6">
    {auth.user?.id}
    {@render children()}
  </main>

  <!-- Footer -->
  <footer class="bg-gray-800 text-white text-center p-4">
    <p>&copy; 2025 My Website</p>
  </footer>
</div>
