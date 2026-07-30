// Forma del contenido del CV, compartida por content.es.ts y content.en.ts.
// El ES es la fuente de verdad de la forma; el EN se revisa contra él (D20).

export type Bullet = string;

export interface Job {
  company: string;
  role: string;
  context: string; // p. ej. "SaaS B2B · IT Management"
  period: string;
  reporting?: string; // línea de meta bajo el rol (decisión E)
  project?: string; // p. ej. "Shutapp Projects"
  bullets: Bullet[];
}

export interface Milestone {
  year: string;
  company: string;
  impact: string;
  exit?: boolean;
}

export interface EducationItem {
  title: string;
  institution: string;
}

export interface SkillRow {
  label: string;
  value: string;
}

export interface ToolRow {
  label: string;
  names: string[];
}

// Etiquetas de UI del CV (títulos de sección) — traducibles.
export interface CvUi {
  profile: string;
  milestones: string;
  experience: string;
  previous: string;
  education: string;
  skills: string;
  toolkit: string;
}

export interface CV {
  name: string;
  role: string;
  subject: string; // metadato del PDF
  ui: CvUi;
  contact: {
    email: string;
    phone: string;
    web: string;
    linkedin: string;
    location: string;
  };
  summary: string;
  milestones: Milestone[];
  experience: Job[];
  previous: { intro: string; roles: Job[] };
  education: EducationItem[];
  skills: SkillRow[];
  tools: ToolRow[];
}
