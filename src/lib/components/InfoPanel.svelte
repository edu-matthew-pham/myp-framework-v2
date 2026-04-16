<script lang="ts">
  import { appState } from '$lib/state/subject.svelte';
  import { getPhaseColors, phaseText } from '$lib/subjects';
  import NodeCard from './NodeCard.svelte';

  let { showLevels }: { showLevels?: () => void } = $props();

  // Derived state
  let data = $derived(appState.subjectData);
  let activePhaseIndex = $derived(
    data?.phases.findIndex((p) => p.id === appState.activePhaseId) ?? -1
  );
  let activePhase = $derived(
    activePhaseIndex >= 0 ? data!.phases[activePhaseIndex] : null
  );
  let pc = $derived(activePhaseIndex >= 0 ? getPhaseColors(activePhaseIndex) : null);
  let textColor = $derived(activePhaseIndex >= 0 ? phaseText(activePhaseIndex) : null);

  // Tooltip state
  let tipVisible = $state(false);
  let tipText = $state('');
  let tipX = $state(0);
  let tipY = $state(0);

  function showTip(el: HTMLElement, definition: string) {
    tipText = definition;
    tipVisible = true;
    requestAnimationFrame(() => {
      const tipEl = document.getElementById('concept-tip');
      if (!tipEl) return;
      const r = el.getBoundingClientRect();
      const tw = tipEl.offsetWidth;
      const th = tipEl.offsetHeight;
      let left = r.left + r.width / 2 - tw / 2;
      left = Math.max(8, Math.min(left, window.innerWidth - tw - 8));
      const top = r.top - th - 8;
      tipX = left;
      tipY = top < 8 ? r.bottom + 8 : top;
    });
  }

  function hideTip() {
    tipVisible = false;
  }
</script>

<div class="flex-1 min-w-0 flex flex-col lg:border-r border-border overflow-hidden">
  {#if activePhase && pc && textColor}
    <!-- ── Phase detail view ── -->

    <!-- Phase header with badge -->
    <div class="px-5 pt-4 pb-3 border-b border-border shrink-0">
      <span
        class="inline-block px-3 py-0.5 rounded-full text-[10px] font-semibold tracking-wide mb-1.5"
        style="background: {pc.color}18; color: {textColor}; border: 1px solid {pc.color}44;"
      >
        {activePhase.criterion}
      </span>
      <div class="font-serif text-base font-bold leading-tight mt-1" style="color: {textColor};">
        {activePhase.label.replace(/\n/g, ' ')}
      </div>
    </div>

    <!-- Phase description -->
    <div class="px-5 py-3 border-b border-border text-xs text-muted leading-relaxed shrink-0">
      {activePhase.description}
    </div>

    <!-- Show levels button — mobile only -->
    {#if showLevels}
      <div class="lg:hidden px-5 py-2 border-b border-border shrink-0">
        <button
          class="w-full px-3 py-2 rounded-lg text-[11px] font-semibold tracking-wide
            bg-surface2 border border-border text-text hover:border-muted transition-colors"
          onclick={showLevels}
        >
          Show Achievement Levels →
        </button>
      </div>
    {/if}

    <!-- Node cards grid -->
    <div class="flex-1 overflow-y-auto p-3.5 grid grid-cols-1 lg:grid-cols-[repeat(auto-fill,minmax(46%,1fr))] auto-rows-min gap-2.5">
      {#each activePhase.nodes as node}
        <NodeCard {node} phaseIndex={activePhaseIndex} />
      {/each}
    </div>

  {:else if data?.overview}
    <!-- ── Overview view ── -->

    <!-- Overview title -->
    <div class="px-5 pt-4 pb-3 border-b border-border shrink-0">
      <div class="font-serif text-base font-bold leading-tight">{data.overview.title}</div>
    </div>

    <!-- Overview description -->
    <div class="px-5 py-3 border-b border-border text-xs text-muted leading-relaxed shrink-0">
      {data.overview.description}
    </div>

    <!-- Overview sections -->
    <div class="flex-1 overflow-y-auto p-3.5">
      <div class="flex flex-col gap-5">
        {#each data.overview.sections as section}
          <div class="flex flex-col gap-1.5">
            <!-- Section title -->
            <div class="text-sm font-bold text-text">{section.title}</div>

            <!-- Quote -->
            {#if section.quote}
              <div class="text-xs leading-relaxed text-text italic border-l-2 border-border pl-2.5 my-0.5">
                {section.quote}
              </div>
            {/if}

            <!-- Text -->
            {#if section.text}
              <div class="text-xs leading-relaxed text-muted">{section.text}</div>
            {/if}

            <!-- Progression table -->
            {#if section.progression_table}
              {@const table = section.progression_table}
              <div class="flex flex-col mt-1.5 border border-border rounded-lg overflow-hidden">
                <!-- Header row -->
                <div
                  class="grid bg-surface2 border-b border-border"
                  style="grid-template-columns: repeat({table.headers.length}, 1fr);"
                >
                  {#each table.headers as header}
                    <div class="px-2.5 py-1.5 text-[10px] font-semibold tracking-wide text-text border-r border-border last:border-r-0">
                      {header}
                    </div>
                  {/each}
                </div>
                <!-- Data rows -->
                {#each table.rows as row, ri}
                  <div
                    class="grid border-b border-border last:border-b-0"
                    class:bg-surface2={ri % 2 === 1}
                    style="grid-template-columns: repeat({table.headers.length}, 1fr);"
                  >
                    {#each row as cell}
                      <div class="px-2.5 py-1.5 text-[10.5px] leading-snug text-muted border-r border-border last:border-r-0">
                        {cell}
                      </div>
                    {/each}
                  </div>
                {/each}
              </div>
            {/if}

            <!-- Concepts -->
            {#if section.concepts}
              {@const concepts = section.concepts}
              <div class="flex flex-col gap-2.5 mt-1.5">
                <!-- Key concepts -->
                <div class="flex gap-1.5 flex-wrap">
                  {#each concepts.key as key, ki}
                    {@const def = concepts.key_definitions?.[ki]?.definition ?? ''}
                    <span
                      role="button"
                      tabindex={def.length > 0 ? 0 : undefined}
                      class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-surface2 border border-border text-text tracking-wide"
                      class:cursor-help={def.length > 0}
                      onmouseenter={(e) => { if (def) showTip(e.currentTarget as HTMLElement, def); }}
                      onmouseleave={hideTip}
                    >
                      {key}
                    </span>
                  {/each}
                </div>

                <!-- Related concept groups -->
                {#each concepts.related as group}
                  <div class="flex flex-col gap-1">
                    <div class="text-[10px] font-semibold tracking-widest uppercase text-muted">
                      {group.label}
                    </div>
                    <div class="flex gap-1.5 flex-wrap">
                      {#each group.items as item}
                        {@const name = typeof item === 'object' ? item.name : item}
                        {@const def = typeof item === 'object' ? item.definition : ''}
                        <span
                          role="button"
                          tabindex={def !== undefined && def.length > 0 ? 0 : undefined}
                          class="px-2.5 py-0.5 rounded-full text-[10.5px] bg-surface border border-border text-muted"
                          class:cursor-help={def !== undefined && def.length > 0}
                          onmouseenter={(e) => { if (def) showTip(e.currentTarget as HTMLElement, def); }}
                          onmouseleave={hideTip}
                        >
                          {name}
                        </span>
                      {/each}
                    </div>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>

  {:else}
    <!-- ── Empty state ── -->
    <div class="px-5 pt-4 pb-3 border-b border-border shrink-0">
      <p class="text-[13px] text-muted leading-relaxed">
        Select a phase on the wheel to explore criteria and achievement levels.
      </p>
    </div>
    <div class="flex-1"></div>
  {/if}
</div>

<!-- Concept tooltip -->
{#if tipVisible}
  <div
    id="concept-tip"
    class="fixed z-[1000] px-3 py-1.5 rounded-md text-[10.5px] leading-relaxed max-w-[240px] pointer-events-none
      bg-surface2 border border-border text-text"
    style="left: {tipX}px; top: {tipY}px;"
  >
    {tipText}
  </div>
{/if}