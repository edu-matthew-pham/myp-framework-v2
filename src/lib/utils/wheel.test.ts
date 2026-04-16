import { describe, it, expect } from 'vitest';
import { phaseOffsets, wrapText } from './wheel';
import { PHASE_COLORS, getPhaseColors, SUBJECT_TABS } from '$lib/subjects';

// ── phaseOffsets ──

describe('phaseOffsets', () => {
  it('returns correct grid for 4 nodes at horizontal phase (top)', () => {
    const offsets = phaseOffsets(4, 0);
    expect(offsets).toHaveLength(4);
    // 4 nodes → 2 cols × 2 rows
    expect(offsets[0].totalCols).toBe(2);
    expect(offsets[0].totalRows).toBe(2);
  });

  it('returns correct grid for 4 nodes at vertical phase (right)', () => {
    const offsets = phaseOffsets(4, 1);
    expect(offsets).toHaveLength(4);
    // 4 nodes → 2 cols × 2 rows
    expect(offsets[0].totalCols).toBe(2);
    expect(offsets[0].totalRows).toBe(2);
  });

  it('returns correct grid for 3 nodes at horizontal phase (bottom)', () => {
    const offsets = phaseOffsets(3, 2);
    expect(offsets).toHaveLength(3);
    // 3 nodes → 2 cols × 2 rows, last row has 1 node centred
    expect(offsets[0].totalCols).toBe(2);
    expect(offsets[0].totalRows).toBe(2);
    // Last node should be centred (col offset 0.5)
    expect(offsets[2].col).toBe(0.5);
  });

  it('returns correct grid for 3 nodes at vertical phase (left)', () => {
    const offsets = phaseOffsets(3, 3);
    expect(offsets).toHaveLength(3);
    // 3 nodes → 2 cols × 2 rows, last row single node centred
    expect(offsets[2].col).toBe(0.5);
  });

  it('returns correct grid for 2 nodes at horizontal phase', () => {
    const offsets = phaseOffsets(2, 0);
    expect(offsets).toHaveLength(2);
    expect(offsets[0].totalCols).toBe(1);
    expect(offsets[0].totalRows).toBe(2);
  });

  it('returns correct grid for 2 nodes at vertical phase', () => {
    const offsets = phaseOffsets(2, 1);
    expect(offsets).toHaveLength(2);
    expect(offsets[0].totalCols).toBe(2);
    expect(offsets[0].totalRows).toBe(1);
  });

  it('handles single node', () => {
    const offsets = phaseOffsets(1, 0);
    expect(offsets).toHaveLength(1);
    expect(offsets[0].row).toBe(0);
  });
});

// ── wrapText ──

describe('wrapText', () => {
  it('returns single line when text fits', () => {
    expect(wrapText('Hello', 10)).toEqual(['Hello']);
  });

  it('wraps at word boundary', () => {
    const lines = wrapText('Explain and justify', 10);
    // "and justify" is 11 chars > maxCh 10, so splits into 3 lines
    expect(lines).toEqual(['Explain', 'and', 'justify']);
  });

  it('handles single word longer than maxCh', () => {
    const lines = wrapText('Superlongword', 5);
    expect(lines).toEqual(['Superlongword']);
  });

  it('wraps multiple lines', () => {
    const lines = wrapText('The quick brown fox jumps', 12);
    expect(lines.length).toBeGreaterThan(1);
  });

  it('returns empty array for empty string', () => {
    // empty string split gives [''], but '' is falsy so nothing gets pushed
    expect(wrapText('', 10)).toEqual([]);
  });
});

// ── getPhaseColors ──

describe('getPhaseColors', () => {
  it('returns correct colours for each index', () => {
    expect(getPhaseColors(0).color).toBe('#4A90C4');
    expect(getPhaseColors(1).color).toBe('#E8A44A');
    expect(getPhaseColors(2).color).toBe('#6AAF6A');
    expect(getPhaseColors(3).color).toBe('#C96060');
  });

  it('wraps around for index >= 4', () => {
    expect(getPhaseColors(4).color).toBe('#4A90C4');
    expect(getPhaseColors(5).color).toBe('#E8A44A');
  });

  it('each colour has color, light, and dark variants', () => {
    PHASE_COLORS.forEach((pc) => {
      expect(pc.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(pc.light).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(pc.dark).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });
});

// ── SUBJECT_TABS ──

describe('SUBJECT_TABS', () => {
  it('has 9 subjects', () => {
    expect(SUBJECT_TABS).toHaveLength(9);
  });

  it('first tab is Principles with separator', () => {
    expect(SUBJECT_TABS[0].label).toBe('From Principles into Practice');
    expect(SUBJECT_TABS[0].separator).toBe(true);
  });

  it('all tabs have label and file', () => {
    SUBJECT_TABS.forEach((tab) => {
      expect(tab.label).toBeTruthy();
      expect(tab.file).toMatch(/^myp_.*\.json$/);
    });
  });

  it('only first tab has separator', () => {
    SUBJECT_TABS.slice(1).forEach((tab) => {
      expect(tab.separator).toBeFalsy();
    });
  });
});