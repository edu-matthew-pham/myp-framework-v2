<script lang="ts">
  import type { Node } from '$lib/state/subject.svelte';
  import { getPhaseColors, phaseText } from '$lib/subjects';

  let { node, phaseIndex }: { node: Node; phaseIndex: number } = $props();

  let pc = $derived(getPhaseColors(phaseIndex));
  let textColor = $derived(phaseText(phaseIndex));
</script>

<div
  class="bg-surface border border-border rounded-[10px] px-3.5 py-3 flex flex-col gap-1.5"
  style="border-color: {pc.color}55;"
>
  <!-- Label + detail -->
  <div class="text-s font-semibold leading-tight" style="color: {textColor};">
    {node.label}
    <span class="font-normal opacity-80 text-[14px]">{node.detail}</span>
  </div>

  <!-- Strand full text -->
  {#if node.strand_full}
    <div class="text-[11px] italic text-muted">{node.strand_full}</div>
  {/if}

  <div class="h-px bg-border my-0.5"></div>

  <!-- Description -->
  {#if node.description}
    <div class="text-[11px] text-muted leading-relaxed mt-0.5">{node.description}</div>
  {/if}

  <div class="h-px bg-border my-0.5"></div>

  <!-- Progression across years -->
  {#if node.progression}
    <div class="flex flex-col gap-1.5 mt-0.5">
      {#each [['Y1', node.progression.y1], ['Y3', node.progression.y3], ['Y5', node.progression.y5]] as [year, text]}
        {#if text}
          <div class="grid grid-cols-[28px_1fr] gap-2 items-start">
            <span class="text-[10px] font-semibold tracking-wide text-text opacity-80">{year}</span>
            <span class="text-[10px] leading-normal text-muted">{text}</span>
          </div>
        {/if}
      {/each}
    </div>
  {/if}
</div>