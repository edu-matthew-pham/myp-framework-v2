<script lang="ts">
  import { onMount } from 'svelte';
  import { appState } from '$lib/state/subject.svelte';

  onMount(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    appState.isDark = saved ? saved === 'dark' : prefersDark;
    document.documentElement.classList.toggle('dark', appState.isDark);
  });

  function toggle() {
    appState.isDark = !appState.isDark;
    document.documentElement.classList.toggle('dark', appState.isDark);
    localStorage.setItem('theme', appState.isDark ? 'dark' : 'light');
  }
</script>

<button
  onclick={toggle}
  class="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide border transition-all
    bg-surface2 border-border text-text hover:border-muted"
  title={appState.isDark ? 'Switch to light mode' : 'Switch to dark mode'}
>
  <span class="text-sm leading-none">{appState.isDark ? '☀️' : '🌙'}</span>
  <span>{appState.isDark ? 'Light' : 'Dark'}</span>
</button>