<script lang="ts">
  import './layout.css';
  let { children } = $props();
</script>

<div class="min-h-screen flex flex-col bg-bg text-text">
  {@render children()}
</div>