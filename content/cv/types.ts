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

// Rol tal como se autora, que a estas alturas es SOLO SU NOMBRE: los bullets, el
// sector y el reporting salen del registro por experiencia (P48.5 y P48.55) y el
// proyecto paraguas del diccionario. Lo que este archivo aporta de una experiencia
// es su PRESENCIA y su ORDEN en el CV — nada más.
//
// Que se haya quedado en un solo campo no es un residuo: es la señal de que la
// experiencia se cuenta en un sitio y el CV solo decide a cuáles da papel.
export interface AuthoredJob {
  company: string; // clave de unión con el diccionario, el registro y el display
}

// Rol ya fusionado (autorado + hechos + bullets), lo que se renderiza.
export interface Job extends AuthoredJob {
  role: string; // del registro por experiencia
  period: string; // del registro por experiencia
  /** Sector; en el registro es `sector`, en el papel se lee como contexto. */
  context: string;
  /** La versión LARGA del reporting; la corta la pinta el deep-dive. */
  reporting?: string;
  project?: string; // del diccionario (agrupación Shutapp Projects)
  /**
   * Del registro por experiencia. Cada uno es la versión CORTA de un bullet de
   * «En un minuto» del deep-dive, y los dos viven en el mismo objeto para que no
   * puedan divergir sin que se vea (P48.5).
   */
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
