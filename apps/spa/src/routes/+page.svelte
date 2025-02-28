<script lang="ts">
  // import { getContextClient, mutationStore, queryStore } from "@urql/svelte";
  // import { QueryMe } from "$lib/graphql/queries";
  // import { MutationLogin, MutationLogout, MutationRegister } from "$lib/graphql/mutations";

  // const client = getContextClient();

  // const input = {
  //   email: "test3@domain.com",
  //   name: "test",
  //   password: "Password12#",
  // };

  // $: me = queryStore({
  //   client,
  //   query: QueryMe,
  //   // context: {
  //   //   additionalTypenames: ["User"],
  //   // },
  // });

  // function register() {
  //   mutationStore({
  //     client,
  //     query: MutationRegister,
  //     variables: { input },
  //   });
  // }

  // async function logout() {
  //   // if (!$me.data?.me) return;

  //   await client
  //     .mutation(
  //       MutationLogout,
  //       {}
  //       // {
  //       //   additionalTypenames: ["User"],
  //       // }
  //     )
  //     .toPromise();
  //   me.reexecute({ requestPolicy: "network-only" });
  // }

  // async function login() {
  //   await client
  //     .mutation(
  //       MutationLogin,
  //       { input: { email: input.email, password: input.password } }
  //       // {
  //       //   additionalTypenames: ["User"],
  //       // }
  //     )
  //     .toPromise();
  //   me.reexecute({});
  // }
</script>

<!-- <button onclick={register}> Register </button>
<button onclick={login}> login </button>
<button onclick={logout}> Logout </button>

{#if $me.fetching}
  <p>Loading...</p>
{:else if $me.error}
  <p>{$me.error.message}</p>
{:else}
  <pre>
    {JSON.stringify($me.data?.me, null, 2)}
  </pre>
{/if} -->

HOME PAGE
