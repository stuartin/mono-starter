<script lang="ts">
  import "../app.css";
  import { setAPI } from "$lib/graphql/api.svelte";
  import { client } from "$lib/graphql/client";
  import { MutationLogout } from "$lib/graphql/mutations";
  import { goto } from "$app/navigation";

  let { children } = $props();

  const { queryMe } = setAPI();

  async function logout() {
    await client.mutation(MutationLogout, {}).toPromise();
    queryMe.reexecute({ requestPolicy: "network-only" });
    goto("/");
  }
</script>

<div class="flex flex-col min-h-screen bg-gray-100 text-gray-900">
  <!-- Header -->
  <header class="bg-gray-400 text-white p-4 flex">
    <a href="/">
      <h1 class="text-xl font-bold">My Website</h1>
    </a>
    <ul class="flex gap-4 grow justify-center">
      {#if $queryMe.data}
        <li>
          <a href="/profile">profile</a>
        </li>
      {/if}
    </ul>
    <div>
      {#if $queryMe.data}
        <button onclick={logout}>logout</button>
      {:else}
        <button onclick={() => goto("/auth/login")}>login</button>
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
