<script lang="ts">
  import { getAuth } from "$lib/auth/auth.svelte";

  let name = $state("");
  let email = $state("");
  let password = $state("");

  const auth = getAuth();
</script>

<article class="grid grid-cols-1 justify-items-center">
  <form class="flex flex-col max-w-sm p-4">
    <h1 class="text-2xl mb-4">Register</h1>
    <label class="text-sm" for="name">Name</label>
    <input class="outline-1 rounded mb-4" id="name" bind:value={name} />
    <label class="text-sm" for="email">Email</label>
    <input class="outline-1 rounded mb-4" id="email" bind:value={email} />
    <label class="text-sm" for="password">Password</label>
    <input class="outline-1 rounded mb-8" id="password" type="password" bind:value={password} />
    <button class="bg-blue-300 rounded text-white" onclick={() => auth.register(name, email, password)}>Register</button
    >
  </form>
  <a class="text-xs" href="/auth/login">Have an account? Login</a>
</article>
