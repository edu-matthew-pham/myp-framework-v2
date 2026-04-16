<script lang="ts">
  import { appState } from '$lib/state/subject.svelte';
  import { getPhaseColors, phaseText } from '$lib/subjects';

  // Derived state
  let data = $derived(appState.subjectData);
  let isFoundations = $derived(data?.levels_panel_mode === 'foundations' && !!data?.foundations);
  let panelTitle = $derived(data?.levels_panel_title ?? 'Achievement levels');

  let activePhaseIndex = $derived(
    data?.phases.findIndex((p) => p.id === appState.activePhaseId) ?? -1
  );
  let activePhase = $derived(
    activePhaseIndex >= 0 ? data!.phases[activePhaseIndex] : null
  );
  let pc = $derived(activePhaseIndex >= 0 ? getPhaseColors(activePhaseIndex) : null);
  let textColor = $derived(activePhaseIndex >= 0 ? phaseText(activePhaseIndex) : null);

  // Level descriptors for current phase + year
  let levels = $derived(
    activePhase?.levels?.[appState.activeYear] ?? []
  );

  // Year toggle handler
  function setYear(year: 'y1' | 'y3' | 'y5') {
    appState.activeYear = year;
  }

  // Foundation tab handler
  function setFoundTab(index: number) {
    appState.activeFoundTab = index;
  }

  // Format the assessment intro with list markup
  function formatIntro(intro: string): string {
    return intro.replace(
      /limited \(1–2\), adequate \(3–4\), substantial \(5–6\), and excellent \(7–8\)/,
      'performance that is:<ul class="ml-4 mt-1 mb-1"><li class="mb-0.5 text-text">limited (1–2)</li><li class="mb-0.5 text-text">adequate (3–4)</li><li class="mb-0.5 text-text">substantial (5–6)</li><li class="mb-0.5 text-text">excellent (7–8)</li></ul>'
    );
  }
</script>

<div class="flex-[0_0_32%] min-w-[200px] max-w-[350px] flex flex-col overflow-hidden">
  <!-- Panel header -->
  <div class="px-3.5 pt-4 pb-2.5 border-b border-border shrink-0">
    <div class="text-[10px] font-semibold tracking-widest uppercase text-muted">
      {panelTitle}
    </div>

    {#if isFoundations}
      <!-- Foundations tabs -->
      <div class="flex gap-0.5 mt-2 flex-wrap">
        {#each data!.foundations!.tabs as tab, i}
          <button
            class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold border transition-all whitespace-nowrap
              {appState.activeFoundTab === i
                ? 'bg-interactive text-white border-transparent'
                : 'bg-transparent text-muted border-border hover:border-muted hover:text-text'}"
            onclick={() => setFoundTab(i)}
          >
            {tab}
          </button>
        {/each}
      </div>
    {:else}
      <!-- Year toggle -->
      <div class="flex gap-1 mt-2">
        {#each ['y1', 'y3', 'y5'] as year}
          <button
            class="px-3 py-1 rounded-full text-[11px] font-semibold border transition-all tracking-wide"
            style={appState.activeYear === year && pc
              ? `background: ${pc.color}; color: white; border-color: transparent;`
              : appState.activeYear === year
                ? 'background: var(--color-muted); color: white; border-color: transparent;'
                : ''}
            class:bg-transparent={appState.activeYear !== year}
            class:text-muted={appState.activeYear !== year}
            class:border-border={appState.activeYear !== year}
            class:hover:border-muted={appState.activeYear !== year}
            class:hover:text-text={appState.activeYear !== year}
            onclick={() => setYear(year as 'y1' | 'y3' | 'y5')}
          >
            {year.toUpperCase()}
          </button>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Assessment overview intro -->
  {#if data?.assessment_overview}
    <div class="px-3 py-2.5 border-b border-border bg-surface2/30 shrink-0">
      {#if !isFoundations}
        <div class="text-[11px] font-semibold tracking-widest uppercase text-text mb-2">
          Panel Overview
        </div>
        <div class="text-[11px] leading-relaxed text-muted mb-2">
          {@html formatIntro(data.assessment_overview.intro)}
        </div>
      {/if}
      <div class="text-[10.5px] leading-relaxed text-muted border-l-2 border-border pl-2 italic">
        {data.assessment_overview.requirement}
      </div>
    </div>
  {/if}

  <!-- Panel content -->
  <div class="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
    {#if isFoundations}
      <!-- ── Foundations content ── -->
      {@const fd = data!.foundations!}
      {@const tab = appState.activeFoundTab}

      {#if tab === 0 && fd.learner_profile}
        <!-- Learner Profile -->
        <p class="text-[11px] leading-relaxed text-muted italic mb-2">{fd.learner_profile.intro}</p>
        <div class="flex flex-col gap-1.5">
          {#each fd.learner_profile.attributes as attr}
            <div class="p-2.5 rounded-lg bg-surface border border-border">
              <div class="text-[11px] font-semibold text-text mb-0.5">{attr.name}</div>
              <div class="text-[10.5px] leading-normal text-muted">{attr.description}</div>
            </div>
          {/each}
        </div>

      {:else if tab === 1 && fd.soi_construction}
        <!-- SOI Construction -->
        <p class="text-[11px] leading-relaxed text-muted italic mb-2">{fd.soi_construction.intro}</p>
        <div class="text-[11px] font-semibold text-text bg-surface2 rounded-md px-2.5 py-2 leading-normal tracking-wide mb-2.5">
          {fd.soi_construction.formula}
        </div>
        <div class="text-[10px] font-semibold tracking-widest uppercase text-muted mb-1.5">
          Quality criteria
        </div>
        <div class="flex flex-col gap-1.5 mb-2.5">
          {#each fd.soi_construction.criteria as c}
            <div class="p-2 rounded-lg bg-surface border border-border">
              <div class="text-[10px] font-semibold tracking-widest uppercase text-text mb-0.5">{c.label}</div>
              <div class="text-[10.5px] leading-normal text-muted">{c.text}</div>
            </div>
          {/each}
        </div>
        <div class="text-[10.5px] leading-relaxed text-muted border-l-2 border-border pl-2 mb-2">
          {fd.soi_construction.connection}
        </div>
        <div class="text-[10px] leading-normal text-muted italic opacity-70">
          {fd.soi_construction.note}
        </div>

      {:else if tab === 2 && fd.guiding_questions}
        <!-- Guiding Questions -->
        <p class="text-[11px] leading-relaxed text-muted italic mb-2">{fd.guiding_questions.intro}</p>
        {#each fd.guiding_questions.phases as phase}
          <div class="mb-3">
            <div class="text-[10px] font-semibold tracking-widest uppercase text-text pb-1 mb-1.5 border-b border-border">
              {phase.label}
            </div>
            <div class="flex flex-col gap-1">
              {#each phase.questions as q}
                <div class="text-[10.5px] leading-normal text-muted px-2 py-1 rounded bg-surface border-l-2 border-border">
                  {q}
                </div>
              {/each}
            </div>
          </div>
        {/each}

      {:else if tab === 3 && fd.service_as_action}
        <!-- Service as Action -->
        <p class="text-[11px] leading-relaxed text-muted italic mb-2">{fd.service_as_action.intro}</p>
        <div class="text-[10px] font-semibold tracking-widest uppercase text-muted mb-1.5">
          Key principles
        </div>
        <div class="flex flex-col gap-1.5 mb-2.5">
          {#each fd.service_as_action.principles as p}
            <div class="p-2 rounded-lg bg-surface border border-border">
              <div class="text-[10px] font-semibold tracking-widest uppercase text-text mb-0.5">{p.label}</div>
              <div class="text-[10.5px] leading-normal text-muted">{p.text}</div>
            </div>
          {/each}
        </div>
        <div class="text-[10px] font-semibold tracking-widest uppercase text-muted mb-1.5 mt-2.5">
          Learning outcomes
        </div>
        <div class="text-[10.5px] text-muted italic mb-1.5">{fd.service_as_action.outcomes_intro}</div>
        <div class="flex flex-col gap-1">
          {#each fd.service_as_action.outcomes as o}
            <div class="text-[10.5px] leading-normal text-muted px-2 py-1 rounded bg-surface border-l-2 border-border">
              {o}
            </div>
          {/each}
        </div>
        <div class="text-[10px] leading-normal text-muted italic opacity-70 mt-2">
          {fd.service_as_action.note}
        </div>

      {:else if tab === 4 && fd.interdisciplinary}
        <!-- Interdisciplinary -->
        <p class="text-[11px] leading-relaxed text-muted italic mb-2">{fd.interdisciplinary.intro}</p>
        <div class="text-[11px] text-text bg-surface2 rounded-md px-2.5 py-2 leading-normal italic mb-2.5">
          {fd.interdisciplinary.definition}
        </div>
        <div class="text-[10px] font-semibold tracking-widest uppercase text-muted mb-1.5">
          Three key qualities
        </div>
        <div class="flex flex-col gap-1.5 mb-2.5">
          {#each fd.interdisciplinary.qualities as q}
            <div class="p-2 rounded-lg bg-surface border border-border">
              <div class="text-[10px] font-semibold tracking-widest uppercase text-text mb-0.5">{q.label}</div>
              <div class="text-[10.5px] leading-normal text-muted">{q.text}</div>
            </div>
          {/each}
        </div>
        <div class="text-[10px] font-semibold tracking-widest uppercase text-muted mb-1.5 mt-2.5">
          Why it matters
        </div>
        <div class="flex flex-col gap-1">
          {#each fd.interdisciplinary.why as w}
            <div class="text-[10.5px] leading-normal text-muted px-2 py-1 rounded bg-surface border-l-2 border-border">
              {w}
            </div>
          {/each}
        </div>
        <div class="text-[10px] leading-normal text-muted italic opacity-70 mt-2">
          {fd.interdisciplinary.note}
        </div>
      {/if}

    {:else if activePhase && levels.length > 0}
      <!-- ── Standard achievement levels ── -->
      {#each levels as lv}
        <div class="p-2.5 rounded-lg bg-surface border border-border">
          <div class="text-[10px] font-semibold tracking-widest uppercase mb-0.5" style="color: {textColor ?? 'var(--color-text)'};">
            {lv.band}
          </div>
          <div class="text-[11px] leading-normal text-muted">{lv.text}</div>
        </div>
      {/each}

    {:else}
      <!-- ── Empty state ── -->
      <p class="text-xs text-muted leading-relaxed">Select a phase to see descriptors.</p>
    {/if}
  </div>
</div>