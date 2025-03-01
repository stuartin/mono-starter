<script lang="ts">
  import { MutationLogin } from "$lib/graphql/mutations";
  import { getAPI } from "$lib/graphql/api.svelte";
  import { client } from "$lib/graphql/client";
  import { onDestroy, onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";

  let email = $state("");
  let password = $state("");

  const { queryMe } = getAPI();
  let unsubscribe = () => undefined;

  async function login(e: MouseEvent & { currentTarget: EventTarget }) {
    e.preventDefault();

    const input = { email, password };
    await client.mutation(MutationLogin, { input }).toPromise();

    // redirect after query has fetched
    queryMe.subscribe(() => {
      const redirect = page.url.searchParams.get("redirect") ?? "/";
      goto(redirect);
    }, unsubscribe);

    queryMe.reexecute({});
  }

  onMount(() => {
    if ($queryMe.data) {
      goto("/profile");
    }
  });

  onDestroy(() => {
    unsubscribe();
  });
</script>

<article class="grid grid-cols-1 justify-items-center">
  <form class="flex flex-col max-w-sm p-4">
    <h1 class="text-2xl mb-4">Login</h1>
    <label class="text-sm" for="email">Email</label>
    <input class="outline-1 rounded mb-4" id="email" bind:value={email} />
    <label class="text-sm" for="password">Password</label>
    <input class="outline-1 rounded mb-8" id="password" type="password" bind:value={password} />
    <button class="bg-blue-300 rounded text-white" onclick={(e) => login(e)}>Login</button>
  </form>
  <a class="text-xs" href="/auth/register">Register an account</a>
</article>
