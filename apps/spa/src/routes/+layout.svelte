<script lang="ts">
  import { setUserState } from "$lib/state/User.svelte";

  let { children } = $props();

  setUserState();
</script>

<main>
  {@render children()}
</main>
