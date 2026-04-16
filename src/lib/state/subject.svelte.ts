// src/lib/state/subject.svelte.ts

// ── Types ──

export interface Node {
  label: string;
  detail: string;
  description: string;
  strand_full: string;
  progression: {
    y1: string;
    y3: string;
    y5: string;
  };
}

export interface LevelDescriptor {
  band: string;
  text: string;
}

export interface Phase {
  id: string;
  label: string;
  criterion: string;
  color: string;
  light: string;
  description: string;
  nodes: Node[];
  levels?: {
    y1: LevelDescriptor[];
    y3: LevelDescriptor[];
    y5: LevelDescriptor[];
  };
}

export interface OverviewSection {
  title: string;
  text?: string;
  quote?: string;
  progression_table?: {
    headers: string[];
    rows: string[][];
  };
  concepts?: {
    key: string[];
    key_definitions?: { name: string; definition: string }[];
    related: {
      label: string;
      items: (string | { name: string; definition: string })[];
    }[];
  };
}

export interface Overview {
  title: string;
  description: string;
  sections: OverviewSection[];
}

export interface Foundations {
  tabs: string[];
  learner_profile?: {
    intro: string;
    attributes: { name: string; description: string }[];
  };
  soi_construction?: {
    intro: string;
    formula: string;
    criteria: { label: string; text: string }[];
    connection: string;
    note: string;
  };
  guiding_questions?: {
    intro: string;
    phases: { label: string; questions: string[] }[];
  };
  service_as_action?: {
    intro: string;
    principles: { label: string; text: string }[];
    outcomes_intro: string;
    outcomes: string[];
    note: string;
  };
  interdisciplinary?: {
    intro: string;
    definition: string;
    qualities: { label: string; text: string }[];
    why: string[];
    note: string;
  };
}

export interface SubjectData {
  title: string;
  subtitle: string;
  levels_panel_mode?: 'standard' | 'foundations';
  levels_panel_title?: string;
  assessment_overview?: {
    intro: string;
    requirement: string;
  };
  overview: Overview;
  phases: Phase[];
  foundations?: Foundations;
}

// ── Shared reactive state ──

export const appState = $state({
  subjectData: null as SubjectData | null,
  activePhaseId: null as string | null,
  activeYear: 'y1' as 'y1' | 'y3' | 'y5',
  activeFoundTab: 0,
  isDark: false,
});