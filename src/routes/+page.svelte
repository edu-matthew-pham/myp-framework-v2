<script lang="ts">
  import { onMount } from 'svelte';
  import { SUBJECT_TABS } from '$lib/subjects';
  import { appState } from '$lib/state/subject.svelte';
  import { loadSubject } from '$lib/utils/data';
  import WheelRenderer from '$lib/components/WheelRenderer.svelte';
  import InfoPanel from '$lib/components/InfoPanel.svelte';
  import LevelsPanel from '$lib/components/LevelsPanel.svelte';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';

  let activeTabIndex = $state(0);
  let menuOpen = $state(false);
  let mobileView = $state<'wheel' | 'cards' | 'levels'>('wheel');

  async function switchTab(index: number) {
    activeTabIndex = index;
    appState.activePhaseId = null;
    appState.activeYear = 'y1';
    appState.activeFoundTab = 0;
    mobileView = 'wheel';
    menuOpen = false;
    const data = await loadSubject(SUBJECT_TABS[index].file);
    appState.subjectData = data;
  }

  // When a phase is selected on the wheel, auto-switch to cards on mobile
  $effect(() => {
    if (appState.activePhaseId) {
      mobileView = 'cards';
    }
  });

  // Expose a function for child components to switch to levels view
  function showLevels() {
    mobileView = 'levels';
  }

  onMount(() => {
    switchTab(0);
  });
</script>

<!-- Header -->
<header class="px-4 lg:px-6 py-2.5 border-b border-border bg-bg flex items-center gap-2 text-[11px] text-muted shrink-0">
  <a
    href="https://learningwaypoints.com"
    class="text-text underline underline-offset-3 decoration-border hover:decoration-muted"
  >
    Learning Waypoints
  </a>
  <span class="hidden sm:inline">MYP Framework Explorer</span>
  <span class="sm:hidden">MYP</span>
  <div class="ml-auto flex items-center gap-2">
    <ThemeToggle />
    <!-- Hamburger button — mobile only -->
    <button
      class="lg:hidden text-text p-1"
      onclick={() => menuOpen = !menuOpen}
      aria-label="Open subject menu"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    </button>
  </div>
</header>

<!-- Desktop tab bar — hidden on mobile -->
<div class="hidden lg:flex items-center gap-0.5 px-4 border-b border-border bg-bg shrink-0 overflow-x-auto">
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

<!-- Mobile view toggle — visible below lg -->
<div class="lg:hidden flex items-center border-b border-border bg-bg shrink-0">
  <div class="flex flex-1 px-2">
    {#each [['wheel', 'Wheel'], ['cards', 'Node Cards'], ['levels', 'Levels']] as [view, label]}
      <button
        class="flex-1 px-3 py-2 text-[11px] font-semibold tracking-wide text-center border-b-2 -mb-px transition-colors
          {mobileView === view
            ? 'text-text border-text'
            : 'text-muted border-transparent hover:text-text'}"
        onclick={() => mobileView = view as 'wheel' | 'cards' | 'levels'}
      >
        {label}
      </button>
    {/each}
  </div>
</div>

<!-- Mobile hamburger drawer -->
{#if menuOpen}
  <!-- Backdrop -->
<div
  class="lg:hidden fixed inset-0 bg-black/40 z-40"
  onclick={() => menuOpen = false}
  onkeydown={(e) => { if (e.key === 'Escape') menuOpen = false; }}
  role="button"
  tabindex="-1"
  aria-label="Close menu"
></div>
  <!-- Drawer -->
  <div class="lg:hidden fixed top-0 right-0 h-full w-72 bg-bg border-l border-border z-50 flex flex-col shadow-xl">
    <div class="px-4 py-3 border-b border-border flex items-center justify-between">
      <span class="text-xs font-semibold text-text tracking-wide">Subjects</span>
      <button
        class="text-muted hover:text-text p-1"
        onclick={() => menuOpen = false}
        aria-label="Close menu"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
    <div class="flex-1 overflow-y-auto py-2">
      {#each SUBJECT_TABS as tab, i}
        {#if i > 0 && SUBJECT_TABS[i - 1].separator}
          <div class="h-px bg-border mx-4 my-1"></div>
        {/if}
        <button
          class="w-full text-left px-4 py-2.5 text-xs transition-colors
            {activeTabIndex === i
              ? 'text-text font-semibold bg-surface2'
              : 'text-muted hover:text-text hover:bg-surface'}"
          onclick={() => switchTab(i)}
        >
          {tab.label}
        </button>
      {/each}
    </div>
  </div>
{/if}

<!-- Main content -->
<div class="flex flex-1 min-h-0">
  <!-- ── Desktop: three-panel layout ── -->
  <div class="hidden lg:flex lg:flex-1 lg:min-h-0">
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

  <!-- ── Mobile: single view ── -->
  <div class="lg:hidden flex-1 min-h-0 flex flex-col overflow-hidden">
    {#if mobileView === 'wheel'}
      <div class="flex-1 min-h-0">
        {#if appState.subjectData}
          <WheelRenderer />
        {/if}
      </div>
    {:else if mobileView === 'cards'}
      <InfoPanel {showLevels} />
    {:else if mobileView === 'levels'}
      <LevelsPanel />
    {/if}
  </div>
</div>

<!-- Footer -->
<div class="shrink-0 px-4 lg:px-6 py-1.5 text-[10.5px] text-muted border-t border-border bg-bg">
  An independent teacher-developed tool based on
  <a href="https://www.ibo.org/programmes/middle-years-programme/" target="_blank" class="text-muted underline">
    IB MYP: From Principles into Practice
  </a>
  (2014, updated 2022) and the MYP subject-group guides. The IB is the authoritative source for all programme documentation.
</div>