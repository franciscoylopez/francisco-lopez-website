// Tipos del CV.
//
// Vive en `content/`, no en `scripts/`: el texto rico del CV es también el origen
// del deep-dive por experiencia, y `app/` no puede importar de `scripts/` (que es
// herramienta de build, no contenido de la app). El generador del PDF sigue en
// `scripts/cv/` y lee de aquí.
//
// Dos capas (D22, single-source de hechos):
//  - CvContent = lo AUTORADO, exclusivo del CV (summary, bullets, reporting,
//    context, skills, milestones, ui, contacto). Vive en content.{es,en}.ts.
//  - Los HECHOS (periodos, roles, formación, toolkit) NO se autoran aquí: se
//    leen del diccionario i18n (facts.ts) para que web y CV nunca diverjan.
//  - CV = el resultado FUSIONADO (autorado + hechos) que consume el generador.
//    `company` es además la clave de unión con el diccionario.

export type Bullet = string;

// Rol tal como se autora (sin periodo/rol/proyecto: esos son hechos del diccionario).
export interface AuthoredJob {
  company: string; // clave de unión con el diccionario + display
  context: string; // p. ej. "SaaS B2B · IT Management" (metadato propio del CV)
  reporting?: string;
  bullets: Bullet[];
}

// Rol ya fusionado (autorado + hechos), lo que se renderiza.
export interface Job extends AuthoredJob {
  role: string; // del diccionario
  period: string; // del diccionario
  project?: string; // del diccionario (agrupación Shutapp Projects)
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

export interface CvUi {
  profile: string;
  milestones: string;
  experience: string;
  previous: string;
  education: string;
  skills: string;
  toolkit: string;
}

export interface Contact {
  email: string;
  phone: string;
  web: string;
  linkedin: string;
  location: string;
}

// Contenido AUTORADO del CV (sin hechos derivables del diccionario).
export interface CvContent {
  name: string;
  role: string;
  subject: string;
  ui: CvUi;
  contact: Contact;
  summary: string;
  milestones: Milestone[];
  skills: SkillRow[];
  experience: AuthoredJob[];
  previous: { intro: string; roles: AuthoredJob[] };
}

// CV FUSIONADO que consume el generador (autorado + hechos del diccionario).
export interface CV {
  name: string;
  role: string;
  subject: string;
  ui: CvUi;
  contact: Contact;
  summary: string;
  milestones: Milestone[];
  experience: Job[];
  previous: { intro: string; roles: Job[] };
  education: EducationItem[];
  skills: SkillRow[];
  tools: ToolRow[];
}
