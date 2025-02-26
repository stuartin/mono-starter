<script lang="ts">
  import { getContextClient, mutationStore, queryStore, type OperationResultStore } from "@urql/svelte";
  import { QueryMe } from "$lib/graphql/queries";
  import { MutationRegister } from "$lib/graphql/mutations";
  import type { ResultOf, VariablesOf } from "@mono/shared/graphql";

  const client = getContextClient();

  const me = queryStore({
    client,
    query: QueryMe,
  });

  let registerResult: OperationResultStore<ResultOf<typeof MutationRegister>, VariablesOf<typeof MutationRegister>>;

  function register() {
    const input = {
      email: "test3@domain.com",
      name: "test",
      password: "Password12#",
    };

    registerResult = mutationStore({
      client,
      query: MutationRegister,
      variables: { input },
    });
  }
</script>

<button onclick={register}> Register </button>

{#if $registerResult?.data}
  register
  {JSON.stringify($registerResult.data, null, 2)}
{/if}

{#if $me.fetching}
  <p>Loading...</p>
{:else if $me.error}
  <p>Oh no... {$me.error.message}</p>
{:else}
  <pre>
    {JSON.stringify($me.data?.me, null, 2)}
  </pre>
{/if}

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
