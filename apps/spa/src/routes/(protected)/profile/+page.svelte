<script lang="ts">
  const { data } = $props();

  const me = data.me;
</script>

<article>
  <h1 class="text-2xl">Profile</h1>

  {#if $me.fetching}
    <p>Loading...</p>
  {:else if $me.error}
    <p>{$me.error.message}</p>
  {:else}
    <pre>
      {JSON.stringify($me.data?.me, null, 2)}
    </pre>
  {/if}
</article>
