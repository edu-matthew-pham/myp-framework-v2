<script lang="ts">
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import { appState, type Phase } from '$lib/state/subject.svelte';

  let svgEl: SVGSVGElement;

  // Reactive rebuild when subject data changes
  $effect(() => {
    if (appState.subjectData && svgEl) {
      build();
    }
  });

  // Reactive highlight update when active phase changes
  $effect(() => {
    const phaseId = appState.activePhaseId;
    if (svgEl) {
      d3.select(svgEl).selectAll('.node-g').each(function (d: any) {
        d3.select(this).classed('phase-active', d.phase.id === phaseId);
      });
    }
  });

  function selectPhase(phaseId: string) {
    if (appState.activePhaseId === phaseId) return;
    appState.activePhaseId = phaseId;
  }

  function clearSelection() {
    appState.activePhaseId = null;
  }

  // ── Text wrapping utility ──
  function wrap(text: string, maxCh: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let cur = '';
    words.forEach((w) => {
      const t = cur ? cur + ' ' + w : w;
      if (t.length > maxCh && cur) {
        lines.push(cur);
        cur = w;
      } else {
        cur = t;
      }
    });
    if (cur) lines.push(cur);
    return lines;
  }

  // ── Grid offset calculator ──
  function phaseOffsets(count: number, phaseIdx: number) {
    const isHoriz = phaseIdx === 0 || phaseIdx === 2;
    const offsets: { col: number; row: number; totalCols: number; totalRows: number }[] = [];

    if (isHoriz) {
      const cols = Math.ceil(count / 2);
      for (let i = 0; i < count; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const rowCount =
          row === Math.floor((count - 1) / cols) && count % cols !== 0 ? count % cols : cols;
        const colOffset = rowCount < cols ? col + (cols - rowCount) / 2 : col;
        offsets.push({ col: colOffset, row, totalCols: cols, totalRows: Math.ceil(count / cols) });
      }
    } else {
      const rows = Math.ceil(count / 2);
      for (let i = 0; i < count; i++) {
        const row = Math.floor(i / 2);
        const col = i % 2;
        const rowSize = row === rows - 1 && count % 2 !== 0 ? 1 : 2;
        const colOffset = rowSize === 1 ? 0.5 : col;
        offsets.push({ col: colOffset, row, totalCols: 2, totalRows: rows });
      }
    }
    return offsets;
  }

  // ── Main build function ──
  function build() {
    const data = appState.subjectData!;
    const svg = d3.select(svgEl);
    svg.selectAll('*').remove();

    // Flatten nodes
    interface FlatNode {
      id: string;
      phase: Phase;
      phaseIdx: number;
      nodeIdx: number;
      node: Phase['nodes'][number];
      x: number;
      y: number;
    }

    const nodes: FlatNode[] = [];
    data.phases.forEach((phase, pi) => {
      phase.nodes.forEach((node, ni) => {
        nodes.push({ id: `${phase.id}-${ni}`, phase, phaseIdx: pi, nodeIdx: ni, node, x: 0, y: 0 });
      });
    });

    // Canvas dimensions
    const H = Math.min(window.innerHeight - 46, 660);
    const W = H;
    const CX = W / 2;
    const CY = H / 2;
    const NW = W * 0.155;
    const NH = W * 0.132;
    const GAP = W * 0.015;
    const CORNER = 10;
    const BH = NH * 2 + GAP;
    const DIST = W * 0.345;

    // Cardinal anchor positions
    const anchors = [
      { cx: CX, cy: CY - DIST },
      { cx: CX + DIST, cy: CY },
      { cx: CX, cy: CY + DIST },
      { cx: CX - DIST, cy: CY },
    ];

    // Calculate node positions
    nodes.forEach((n) => {
      const a = anchors[n.phaseIdx];
      const phaseNodes = nodes.filter((x) => x.phaseIdx === n.phaseIdx);
      const offsets = phaseOffsets(phaseNodes.length, n.phaseIdx);
      const o = offsets[n.nodeIdx];
      const blockW = o.totalCols * NW + (o.totalCols - 1) * GAP;
      const blockH = o.totalRows * NH + (o.totalRows - 1) * GAP;
      n.x = a.cx - blockW / 2 + o.col * (NW + GAP) + NW / 2;
      n.y = a.cy - blockH / 2 + o.row * (NH + GAP) + NH / 2;
    });

    svg.attr('width', W).attr('height', H);

    // ── Centre circle ──
    const CR = W * 0.125;
    const cg = svg
      .append('g')
      .attr('class', 'centre-g')
      .attr('transform', `translate(${CX},${CY})`)
      .on('click', clearSelection);

    cg.append('circle')
      .attr('r', CR)
      .attr('fill', '#e8e4dc')
      .attr('stroke', 'rgba(0,0,0,0.08)')
      .attr('stroke-width', 1.5);

    const titleWords = (data.title || 'MYP').split(' ');
    const tmid = Math.ceil(titleWords.length / 2);
    const tLines = [titleWords.slice(0, tmid).join(' '), titleWords.slice(tmid).join(' ')].filter(
      Boolean
    );
    const tfs = W * 0.023;
    tLines.forEach((line, i) => {
      cg.append('text')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-family', 'Libre Baskerville')
        .attr('font-weight', '700')
        .attr('font-size', tfs)
        .attr('fill', '#2c2c2a')
        .attr('y', (i - (tLines.length - 1) / 2) * tfs * 1.3)
        .text(line);
    });

    // ── Phase labels ──
    const labelFs = W * 0.021;
    const lh = labelFs * 1.3;

    data.phases.forEach((phase, pi) => {
      const lines = phase.label.split('\n');
      const gapMid = CR + (DIST - BH / 2 - CR) * 0.35;

      let tx = CX,
        ty = CY,
        rot = 0;
      if (pi === 0) { tx = CX; ty = CY - gapMid; rot = 0; }
      if (pi === 1) { tx = CX + gapMid; ty = CY; rot = 90; }
      if (pi === 2) { tx = CX; ty = CY + gapMid; rot = 0; }
      if (pi === 3) { tx = CX - gapMid; ty = CY; rot = -90; }

      const el = svg
        .append('text')
        .attr('font-family', 'Libre Baskerville')
        .attr('font-weight', '700')
        .attr('font-size', labelFs)
        .attr('fill', phase.color)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('transform', `translate(${tx},${ty}) rotate(${rot})`);

      lines.forEach((line, li) => {
        el.append('tspan')
          .attr('x', 0)
          .attr('dy', li === 0 ? -(lines.length - 1) * lh / 2 : lh)
          .text(line);
      });
    });

    // ── Node rectangles and text ──
    const lfs = Math.min(W * 0.02, 12);
    const dfs = Math.min(W * 0.017, 10);
    const lh2 = lfs * 1.22;

    const nodeGs = svg
      .selectAll('.node-g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node-g')
      .attr('transform', (d) => `translate(${d.x},${d.y})`)
      .on('click', (_e, d) => selectPhase(d.phase.id));

    nodeGs
      .append('rect')
      .attr('x', -NW / 2)
      .attr('y', -NH / 2)
      .attr('width', NW)
      .attr('height', NH)
      .attr('rx', CORNER)
      .attr('ry', CORNER)
      .attr('fill', (d) => d.phase.color)
      .attr('stroke', (d) => d.phase.light)
      .attr('stroke-width', 2);

    nodeGs.each(function (d) {
      const g = d3.select(this);
      const mc = Math.floor(NW / (lfs * 0.52));
      const ll = wrap(d.node.label, mc);
      const dl = wrap(d.node.detail, mc + 2);
      const th = ll.length * lh2 + dl.length * lh2 * 0.92 + lh2 * 0.25;
      let y = -th / 2 + lh2 * 0.5;

      ll.forEach((line) => {
        g.append('text')
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('y', y)
          .attr('font-size', lfs)
          .attr('font-weight', 600)
          .attr('font-family', 'DM Sans')
          .attr('fill', 'white')
          .text(line);
        y += lh2;
      });

      y += lh2 * 0.12;

      dl.forEach((line) => {
        g.append('text')
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('y', y)
          .attr('font-size', dfs)
          .attr('font-style', 'italic')
          .attr('font-family', 'DM Sans')
          .attr('fill', d.phase.light)
          .text(line);
        y += lh2 * 0.92;
      });
    });
  }
</script>

<svg bind:this={svgEl} id="wheel" class="block overflow-visible"></svg>

<style>
  :global(.node-g) {
    cursor: pointer;
  }
  :global(.node-g rect) {
    transition: filter 0.15s, stroke-width 0.15s;
  }
  :global(.node-g text) {
    pointer-events: none;
  }
  :global(.node-g:hover rect) {
    filter: brightness(1.1);
  }
  :global(.node-g.phase-active rect) {
    stroke-width: 3.5 !important;
    filter: brightness(1.18);
  }
  :global(.centre-g) {
    cursor: pointer;
  }
</style>
