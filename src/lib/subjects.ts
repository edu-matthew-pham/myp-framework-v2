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
