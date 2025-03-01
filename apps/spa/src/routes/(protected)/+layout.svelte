<script lang="ts">
  import { Auth, getAuth } from "$lib/auth/auth.svelte";

  let { children } = $props();

  const auth = getAuth();

  $effect.pre(() => {
    Auth.redirectToLogin(!auth.user);
  });
</script>

{#if auth.user}
  {@render children()}
{/if}
