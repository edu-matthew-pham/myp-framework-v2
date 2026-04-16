<script lang="ts">
  import { onMount } from 'svelte';
  import { SUBJECT_TABS } from '$lib/subjects';
  import { appState } from '$lib/state/subject.svelte';
  import { loadSubject } from '$lib/utils/data';
  import WheelRenderer from '$lib/components/WheelRenderer.svelte';
  import InfoPanel from '$lib/components/InfoPanel.svelte';
  import LevelsPanel from '$lib/components/LevelsPanel.svelte';

  let activeTabIndex = $state(0);

  async function switchTab(index: number) {
    activeTabIndex = index;
    appState.activePhaseId = null;
    appState.activeYear = 'y1';
    appState.activeFoundTab = 0;
    const data = await loadSubject(SUBJECT_TABS[index].file);
    appState.subjectData = data;
  }

  onMount(() => {
    switchTab(0);
  });
</script>

<!-- Header -->
<header class="px-6 py-2.5 border-b border-border bg-bg flex items-center gap-2 text-[11px] text-muted shrink-0">
  <a
    href="https://learningwaypoints.com"
    class="text-text underline underline-offset-3 decoration-border hover:decoration-muted"
  >
    Learning Waypoints
  </a>
  <span>MYP Framework Explorer</span>
</header>

<!-- Tab bar -->
<div class="flex items-center gap-0.5 px-4 border-b border-border bg-bg shrink-0 overflow-x-auto">
  {#each SUBJECT_TABS as tab, i}
    {#if i > 0 && SUBJECT_TABS[i - 1].separator}
      <div class="w-px h-[18px] bg-border shrink-0 mx-1.5 self-center"></div>
    {/if}
    <button
      class="px-4 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 -mb-px transition-colors
        {activeTabIndex === i
          ? 'text-text border-text'
          : 'text-muted border-transparent hover:text-text'}"
      onclick={() => switchTab(i)}
    >
      {tab.label}
    </button>
  {/each}
</div>

<!-- Main three-panel layout -->
<div class="flex flex-1 min-h-0">
  <!-- Wheel panel -->
  <div class="flex-[0_0_38%] min-h-0">
    {#if appState.subjectData}
      <WheelRenderer />
    {/if}
  </div>

  <!-- Right side: info + levels -->
  <div class="flex flex-1 min-w-0 min-h-0 border-l border-border">
    <InfoPanel />
    <LevelsPanel />
  </div>
</div>

<!-- Footer -->
<div class="shrink-0 px-6 py-1.5 text-[10.5px] text-muted border-t border-border bg-bg">
  An independent teacher-developed tool based on
  <a href="https://www.ibo.org/programmes/middle-years-programme/" target="_blank" class="text-muted underline">
    IB MYP: From Principles into Practice
  </a>
  (2014, updated 2022) and the MYP subject-group guides. The IB is the authoritative source for all programme documentation.
</div>