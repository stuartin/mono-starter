<script lang="ts">
  import { getContextClient, mutationStore, queryStore } from "@urql/svelte";
  import { QueryMe } from "$lib/graphql/queries";
  import { MutationLogin, MutationLogout, MutationRegister } from "$lib/graphql/mutations";
  import { Query } from "$lib/graphql/Query.svelte";
  import { getUserState } from "$lib/state/User.svelte";

  const input = {
    email: "test3@domain.com",
    name: "test",
    password: "Password12#",
  };

  const userState = getUserState();
</script>

<button onclick={() => userState.login({ input: { email: input.email, password: input.password } })}> login </button>
<button onclick={() => userState.logout()}> Logout </button>

{#if userState?.data}
  <pre>
  {JSON.stringify(userState.data, null, 2)}
</pre>
{:else if userState?.error}
  <p>Oh no... {userState.error?.message}</p>
{/if}

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
