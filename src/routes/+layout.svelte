<script lang="ts">
  import './layout.css';
  let { children } = $props();
</script>

<div class="h-screen flex flex-col overflow-hidden bg-bg text-text">
  {@render children()}
</div>