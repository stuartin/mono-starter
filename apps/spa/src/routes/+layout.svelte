<script lang="ts">
  import { client } from "$lib/graphql/client";
  import { setContextClient } from "@urql/svelte";

  let { children } = $props();

  setContextClient(client);
</script>

<main>
  {@render children()}
</main>
