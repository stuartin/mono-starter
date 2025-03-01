<script lang="ts">
  import { Auth, getAuth } from "$lib/auth/auth.svelte";

  let { children } = $props();

  const auth = getAuth();

  $effect.pre(() => {
    if (!auth.user) {
      Auth.redirectToLogin();
    }
  });
</script>

{#if auth.user}
  {@render children()}
{/if}
