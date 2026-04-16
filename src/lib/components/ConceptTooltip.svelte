<script lang="ts">
  let visible = $state(false);
  let text = $state('');
  let x = $state(0);
  let y = $state(0);

  export function show(el: HTMLElement, definition: string) {
    text = definition;
    visible = true;

    // Position after render
    requestAnimationFrame(() => {
      const r = el.getBoundingClientRect();
      const tipEl = document.getElementById('concept-tip');
      if (!tipEl) return;

      const tw = tipEl.offsetWidth;
      const th = tipEl.offsetHeight;
      let left = r.left + r.width / 2 - tw / 2;
      left = Math.max(8, Math.min(left, window.innerWidth - tw - 8));
      const top = r.top - th - 8;

      x = left;
      y = top < 8 ? r.bottom + 8 : top;
    });
  }

  export function hide() {
    visible = false;
  }
</script>

{#if visible}
  <div
    id="concept-tip"
    class="fixed z-[1000] px-3 py-1.5 rounded-md text-[10.5px] leading-relaxed max-w-[240px] pointer-events-none
      bg-surface2 border border-border text-text"
    style="left: {x}px; top: {y}px;"
  >
    {text}
  </div>
{/if}
