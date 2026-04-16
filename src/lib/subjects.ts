export interface SubjectTab {
  label: string;
  file: string;
  separator?: boolean;
}

export const SUBJECT_TABS: SubjectTab[] = [
  { label: 'From Principles into Practice', file: 'myp_principles_cycle.json', separator: true },
  { label: 'Design', file: 'myp_design_cycle.json' },
  { label: 'Arts', file: 'myp_arts_cycle.json' },
  { label: 'Sciences', file: 'myp_science_cycle.json' },
  { label: 'Physical & Health Ed', file: 'myp_pe_cycle.json' },
  { label: 'Language Acq', file: 'myp_lang_acq_cycle.json' },
  { label: 'Language & Lit', file: 'myp_english_cycle.json' },
  { label: 'Individuals & Soc', file: 'myp_hass_cycle.json' },
  { label: 'Mathematics', file: 'myp_maths_cycle.json' },
];

// Fixed phase colours — applied by position (index 0–3), same for all subjects.
// color: node fill on wheel
// light: text on coloured nodes (wheel) and text on dark backgrounds
// dark: text on light backgrounds (badges, phase names, node card labels)
export const PHASE_COLORS = [
  { color: '#4A90C4', light: '#cde3f5', dark: '#2a5f8a' }, // top — blue
  { color: '#E8A44A', light: '#fae3bc', dark: '#9a6a1e' }, // right — amber
  { color: '#6AAF6A', light: '#c8e8c8', dark: '#3d7a3d' }, // bottom — green
  { color: '#C96060', light: '#f5c8c8', dark: '#943838' }, // left — red
] as const;

// Helper to get phase colours by index
export function getPhaseColors(index: number) {
  return PHASE_COLORS[index % PHASE_COLORS.length];
}

// Helper to get the correct text colour for current theme
// Uses dark variant on light backgrounds, light variant on dark backgrounds
export function phaseText(index: number): string {
  const pc = getPhaseColors(index);
  if (typeof document !== 'undefined') {
    return document.documentElement.classList.contains('dark') ? pc.light : pc.dark;
  }
  return pc.dark;
}