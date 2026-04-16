<script lang="ts">
  import { onMount } from 'svelte';

  let isDark = $state(false);

  onMount(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    isDark = saved ? saved === 'dark' : prefersDark;
    document.documentElement.classList.toggle('dark', isDark);
  });

  function toggle() {
    isDark = !isDark;
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }
</script>

<button
  onclick={toggle}
  class="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide border transition-all
    bg-surface2 border-border text-text hover:border-muted"
  title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
>
  <span class="text-sm leading-none">{isDark ? '☀️' : '🌙'}</span>
  <span>{isDark ? 'Light' : 'Dark'}</span>
</button>