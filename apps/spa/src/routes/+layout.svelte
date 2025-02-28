<script lang="ts">
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

<header>
  <ul>
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
  {#if $queryMe.data}
    {JSON.stringify($queryMe.data.me, null, 2)}
    <button onclick={logout}>logout</button>
  {/if}
</header>
<main>
  {@render children()}
</main>
<header>FOOTER</header>
