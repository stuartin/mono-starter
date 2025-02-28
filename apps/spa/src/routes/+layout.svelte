<script lang="ts">
  import "../app.css";
  import { setAPI } from "$lib/graphql/api.svelte";
  import { client } from "$lib/graphql/client";
  import { MutationLogout } from "$lib/graphql/mutations";

  let { children } = $props();

  const { queryMe } = setAPI();

  async function logout() {
    await client.mutation(MutationLogout, {}).toPromise();
    queryMe.reexecute({ requestPolicy: "network-only" });
  }
</script>

<div class="flex flex-col min-h-screen bg-gray-100 text-gray-900">
  <!-- Header -->
  <header class="bg-gray-400 text-white p-4 flex">
    <h1 class="text-xl font-bold">My Website</h1>
    <ul class="flex gap-4 grow justify-center">
      <li>
        <a href="/">home</a>
      </li>
      <li>
        <a href="/profile">profile</a>
      </li>
      <li>
        <a href="/auth/login">login</a>
      </li>
      <li>
        <a href="/auth/register">register</a>
      </li>
    </ul>
    <div>
      {#if $queryMe.data}
        <button onclick={logout}>logout</button>
      {:else}
        <button onclick={logout}>login</button>
      {/if}
    </div>
  </header>

  <!-- Main Content -->
  <main class="flex-1 p-6">
    {@render children()}
  </main>

  <!-- Footer -->
  <footer class="bg-gray-800 text-white text-center p-4">
    <p>&copy; 2025 My Website</p>
  </footer>
</div>
