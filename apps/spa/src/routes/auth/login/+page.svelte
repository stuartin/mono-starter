<script lang="ts">
  import { MutationLogin } from "$lib/graphql/mutations";
  import { getAPI } from "$lib/graphql/api.svelte";
  import { client } from "$lib/graphql/client";
  import { onDestroy, onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";

  const { queryMe } = getAPI();

  const input = {
    email: "test3@domain.com",
    password: "Password12#",
  };

  let unsubscribe = () => undefined;

  async function login() {
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

<article>
  <h1>Login</h1>
  <button onclick={login}>Log me ins</button>
</article>
