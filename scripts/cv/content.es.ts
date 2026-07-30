// Contenido del CV (ES) — validado con Francisco en la página de Notion
// «CV — enriquecimiento de contenido (bloque `cv`)» (2026-07-30) + ronda de
// finetuning posterior.
//
// Fuente única del CV (D22). Los HECHOS (periodos, roles, empresas, formación)
// reproducen los de es.json (trayectoria/formacion); el TEXTO RICO (summary,
// bullets, métricas) es el autorado del CV, más detallado que la web. El destino
// final es el bloque `cv` del diccionario i18n cuando exista el deep-dive por
// experiencia que lo consuma en runtime (V2/Could); hasta entonces vive aquí,
// junto al generador, sin cargar contenido no usado en cada render del sitio.
//
// El ES es la fuente de verdad de la forma; content.en.ts se revisa contra él (D20).

import type { CV } from "./types";

export const cv: CV = {
  name: "Francisco López",
  role: "Senior Product Manager · SaaS B2B & B2C",
  subject: "Senior Product Manager · SaaS B2B & B2C",

  ui: {
    profile: "Perfil",
    milestones: "Hitos",
    experience: "Experiencia",
    previous: "Experiencia previa — Marketing & Growth",
    education: "Formación",
    skills: "Habilidades",
    toolkit: "Toolkit",
  },

  contact: {
    email: "franciscojavier.lopezmartinez@gmail.com",
    phone: "629 832 720",
    web: "franciscolopez.es",
    linkedin: "linkedin.com/in/franciscolopez1975",
    location: "Valencia",
  },

  summary:
    "Senior Product Manager con más de 10 años construyendo y escalando productos SaaS B2B y B2C, con experiencia end-to-end desde idea, MVP, crecimiento y data. Especializado en estrategia de producto, UX, métricas SaaS, IA aplicada y pricing. Trabajo estrechamente con diseño, tecnología y negocio para crear productos coherentes, escalables y con una experiencia de uso fantástica.",

  // Formato web (Hitos, §8.1): un reconocimiento/resultado por fila, cronológico descendente.
  milestones: [
    { year: "2026", company: "Emendu", impact: "Partnership estratégico con Sesame HR." },
    { year: "2023", company: "INDYA", impact: "Churn mensual del 16% al 10% · activación primer mes +28%." },
    { year: "2022", company: "INDYA", impact: "Seleccionada por Apple App Store Foundations." },
    { year: "2021", company: "TheTool", impact: "Adquirida por AppRadar.", exit: true },
    { year: "2019", company: "TheTool", impact: "Nominado a Mejor Software ASO de Europa (App Promotion Summit)." },
  ],

  experience: [
    {
      company: "Emendu",
      role: "Product Manager",
      context: "SaaS B2B · IT Management",
      period: "Feb 2025 — Actualidad",
      reporting: "Miembro del equipo de liderazgo (Dirección, Operaciones, Tech & Finanzas)",
      bullets: [
        "Lideré la evolución del producto: de una organización centrada en Sales & Operaciones con operativa manual a un sistema digital y apificado.",
        "Definí la estrategia de producto end-to-end: redefiní el ICP mediante discovery y reorienté la experiencia de usuario (onboarding y flujos clave).",
        "Evolucioné LISA (agente IA): de un sistema inconsistente a un agente funcional con acceso dinámico a datos, documentación viva y capacidades multilenguaje.",
        "Impulsé el paso de un SaaS desarrollado por agencia externa (Bubble) a un equipo técnico interno, participando en la incorporación de un Tech Lead.",
        "Desarrollé un hub de tools interno vía Claude Code que redujo un 38% el tiempo de gestión operativa en reports, informes y propuestas.",
        "Lideré, junto al Tech Lead, un partnership estratégico con Sesame HR.",
      ],
    },
    {
      company: "KUOTIP",
      role: "Cofounder & Product",
      context: "SaaS B2B · IA / Reviews",
      period: "Feb 2024 — Nov 2024",
      reporting: "Cofundador · junto a la CEO y el CTO",
      bullets: [
        "Validé el problema desde usuarios y marcas: fraude, manipulación y costes crecientes en plataformas tradicionales.",
        "Diseñé los flujos completos del producto integrando verificación por voz y resúmenes automáticos con IA; construí el MVP con una UI visual moderna para demostrar valor.",
        "Apoyé a la CEO en estrategia y reuniones con fondos pre-seed.",
      ],
    },
    {
      company: "INDYA",
      role: "Product Lead",
      context: "SaaS B2C · Health tech",
      period: "Ene 2022 — Dic 2023",
      reporting: "Reporté al CPO y cofundador · liderazgo por influencia",
      bullets: [
        "Co-definí la estrategia de crecimiento enfocada en activación, engagement y retención.",
        "Introduje prácticas sistemáticas de user research (entrevistas, encuestas post-churn, análisis continuo).",
        "Reduje el churn mensual del 16% al 10% mediante mejoras de UX, comunicación y gestión de pagos.",
        "Rediseñé el pricing mediante A/B testing, unificando planes y eliminando barreras de entrada, sin afectar la retención.",
        "Mejoré la activación del primer mes (+28%) optimizando onboarding, personalización y comprensión de valor.",
        "Lideré la mejora del delivery: reduje el volumen de bugs con QA más ágil y sprints más consistentes.",
      ],
    },
    {
      company: "Freepik",
      role: "Product Manager",
      context: "SaaS B2C · UGC",
      period: "Oct 2021 — Dic 2021",
      reporting: "Reporté a la Head of Product",
      bullets: [
        "Investigué y definí funcionalidades para el área de contributors a partir de análisis cualitativo y cuantitativo.",
        "Mejoré el onboarding: registro, emailing y calidad de perfiles.",
        "Gestión de los OKR del squad.",
      ],
    },
    {
      company: "TheTool",
      role: "Cofounder & Product",
      context: "SaaS B2B · ASO",
      period: "May 2016 — Oct 2021",
      project: "Shutapp Projects",
      reporting: "Cofundador (1 de 4 socios) · voz y voto en las decisiones clave",
      bullets: [
        "Cofundador responsable de visión, diseño del MVP, validación y lanzamiento de la versión de pago.",
        "Diseñé y evolucioné funcionalidades clave: correlación instalaciones/ASO, dashboards de tracking, ASO score, análisis internacional, timeline y monitorización masiva.",
        "Transformé en 3 días una funcionalidad oculta de Google Play en un feature completo, generando +30% en clientes/MRR.",
        "Lideré roadmap, discovery, definición funcional y la coordinación con desarrollo, marketing y CS.",
        "Incorporé el primer Product Designer, liderando un rediseño completo de UI y marca.",
        "Posicioné TheTool como una de las herramientas ASO top del mercado (nominada a Mejor Software ASO de Europa), culminando en su adquisición por AppRadar en 2021.",
      ],
    },
    {
      company: "PICKASO",
      role: "COO",
      context: "App Marketing · Agencia",
      period: "Sep 2015 — Dic 2016",
      project: "Shutapp Projects",
      bullets: [
        "Profesionalicé estructura, procesos y cartera de servicios de la agencia.",
        "Reposicioné marca y propuesta de valor.",
        "Base operativa y de conocimiento de mercado que permitió incubar TheTool (investigación de sus futuros competidores).",
      ],
    },
  ],

  previous: {
    intro:
      "Esta etapa previa en marketing y growth construye la base analítica, de experimentación y user-first que define mi enfoque como Product Manager.",
    roles: [
      {
        company: "Ontecnia",
        role: "Digital Marketing Manager",
        context: "Malavida.com",
        period: "Sep 2013 — Sep 2015",
        bullets: [
          "Crecimiento orgánico de 3,2M a 9,4M visitas mensuales.",
          "Impulsé la transición del modelo de negocio: de instaladores intrusivos a contenido de valor y monetización por vídeo — el inicio de mi giro hacia product-first.",
        ],
      },
      {
        company: "Havas Media · Increnta · Miss Conversion",
        role: "Digital Marketing / Performance",
        context: "",
        period: "2009 — 2013",
        bullets: [
          "Adquisición y performance en agencias líderes — la base de analítica, CRO, UX y liderazgo que facilitó el salto a producto.",
        ],
      },
    ],
  },

  education: [
    { title: "Product Management", institution: "TheHeroCamp · 2021" },
    { title: "Scrum & Agile Leadership", institution: "theUncoding · 2021" },
    { title: "Máster en Comunicación Digital", institution: "Olea Europea · 2001" },
    { title: "Gestión Comercial y Marketing", institution: "ESIC · 2000" },
  ],

  skills: [
    { label: "Producto SaaS", value: "Estrategia, métricas, pricing, experimentación, discovery, roadmapping." },
    { label: "UX & Diseño", value: "Colaboración con Product Designers, usabilidad, prototipos, research cualitativo." },
    { label: "Liderazgo", value: "Stakeholder management, comunicación, equipos multidisciplinares." },
    { label: "IA Aplicada", value: "Agentes conversacionales, LLMs, experiencias asistidas por IA, desarrollo interno." },
  ],

  // Toolkit de la web (§8.4): categoría + nombre, sin descripción (decisión G).
  tools: [
    { label: "Usuarios", names: ["Amplitude", "Google Analytics", "Microsoft Clarity", "Typeform"] },
    { label: "Gestión y Documentación", names: ["Jira", "Notion", "Miro", "Mermaid.js"] },
    { label: "Diseño y prototipado", names: ["Claude Design", "Figma", "v0"] },
    { label: "Desarrollo", names: ["Claude Code", "VS Code", "Vercel", "GitHub"] },
  ],
};
