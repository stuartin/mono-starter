<script lang="ts">
  import { getAPI } from "$lib/graphql/api.svelte";
  import { redirectToLogin } from "$lib/utils/unauthorized";
  import { onMount } from "svelte";

  let { children } = $props();

  const { queryMe } = getAPI();

  onMount(() => {
    if (!$queryMe.data) {
      redirectToLogin();
    }
  });
</script>

{#if $queryMe.data}
  {@render children()}
{/if}
