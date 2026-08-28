// Contenido AUTORADO del CV (ES) — solo lo exclusivo del CV. Los HECHOS
// (periodos, roles, formación, toolkit) NO están aquí: se derivan del diccionario
// i18n en scripts/cv/facts.ts (single-source, D22), para que web y CV no diverjan.
// `company` es la clave de unión con el diccionario (trayectoria).
//
// El ES es la fuente de verdad de la forma; content.en.ts se revisa contra él (D20).
//
// Y LOS BULLETS TAMPOCO ESTÁN AQUÍ (P48.5). Viven en `content/experience-copy/`,
// cada uno emparejado con su versión larga de «En un minuto»: son el mismo hecho a
// dos longitudes, y mientras estuvieron en dos archivos distintos divergieron ocho
// veces sin que nada lo viera. Lo que queda en este archivo es lo que existe SOLO
// en el papel: el resumen, los hitos curados, el `context`, el `reporting` y las
// habilidades.

import type { CvContent } from "./types";

export const content: CvContent = {
  name: "Francisco López",
  role: "Senior Product Manager · SaaS B2B & B2C",
  subject: "Senior Product Manager · SaaS B2B & B2C",

  ui: {
    profile: "Perfil",
    milestones: "Hitos",
    experience: "Experiencia",
    previous: "Experiencia previa · Marketing & Growth",
    education: "Formación",
    skills: "Habilidades",
    toolkit: "Toolkit",
  },

  location: "Valencia",

  summary:
    "Senior Product Manager con más de 10 años construyendo y escalando productos SaaS B2B y B2C, con experiencia end-to-end desde idea, MVP, crecimiento y data. Especializado en estrategia de producto, UX, métricas SaaS, IA aplicada y pricing. Trabajo estrechamente con diseño, tecnología y negocio para crear productos coherentes, escalables y con una experiencia de uso fantástica.",

  // Curados (no derivables limpiamente del bloque hitos del diccionario).
  milestones: [
    {
      year: "2026",
      company: "Emendu",
      impact: "Partnership estratégico con Sesame HR.",
    },
    {
      year: "2023",
      company: "INDYA",
      impact: "Churn mensual del 16% al 10% · activación primer mes +28%.",
    },
    {
      year: "2022",
      company: "INDYA",
      impact: "Seleccionada por Apple App Store Foundations.",
    },
    {
      year: "2021",
      company: "TheTool",
      impact: "Adquirida por AppRadar.",
      exit: true,
    },
    {
      year: "2019",
      company: "TheTool",
      impact: "Nominado a Mejor Software ASO de Europa (App Promotion Summit).",
    },
  ],

  // Experiencia: `company` une con el diccionario (de ahí salen rol y periodo).
  experience: [
    {
      company: "Emendu",
    },
    {
      company: "KUOTIP",
    },
    {
      company: "INDYA",
    },
    {
      company: "Freepik",
    },
    {
      company: "TheTool",
    },
    {
      company: "PICKASO",
    },
  ],

  previous: {
    intro:
      "Esta etapa previa en marketing y growth construye la base analítica, de experimentación y user-first que define mi enfoque como Product Manager.",
    roles: [
      {
        company: "Ontecnia",
      },
      {
        company: "Havas Media · Increnta · Miss Conversion",
      },
    ],
  },

  skills: [
    {
      label: "Producto SaaS",
      value:
        "Estrategia, métricas, pricing, experimentación, discovery, roadmapping.",
    },
    {
      label: "UX & Diseño",
      value:
        "Colaboración con Product Designers, usabilidad, prototipos, research cualitativo.",
    },
    {
      label: "Liderazgo",
      value:
        "Stakeholder management, comunicación, equipos multidisciplinares.",
    },
    {
      label: "IA Aplicada",
      value:
        "Agentes conversacionales, LLMs, experiencias asistidas por IA, desarrollo interno.",
    },
  ],
};
