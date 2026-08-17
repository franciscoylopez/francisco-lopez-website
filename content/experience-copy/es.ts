// Copy por experiencia — ESPAÑOL, que es la FUENTE DE VERDAD (D20).
//
// Las tres longitudes de un mismo hecho, juntas y emparejadas: la frase de
// Trayectoria, el bullet del CV y su gemelo de «En un minuto». Ver
// `./types.ts` para el porqué y `scripts/check-experience-copy.ts` para lo que
// el build comprueba.
//
// AL EDITAR: `cv` y `deep` son el MISMO hecho a dos longitudes. Si uno gana una
// cifra, el otro la adopta — es la regla 1 del formato de deep-dive, y funciona
// en las dos direcciones (el 38% del hub de Emendu subió del CV al deep-dive, no
// al revés).

import type { ExperienceCopyMap } from "./types";

export const copy: ExperienceCopyMap = {
  Emendu: {
    role: "Product Manager",
    period: "Feb 2025 — Actualidad",
    sector: "SaaS B2B · IT Management",
    reporting: {
      deep: "Miembro del equipo de liderazgo",
      cv: "Miembro del equipo de liderazgo (Dirección, Operaciones, Tech & Finanzas)",
    },
    short:
      "Convertí un SaaS recién creado en el modelo de negocio de la compañía: redefiní el ICP, digitalicé la operación y abrí canal con el partnership de Sesame HR.",
    bullets: [
      {
        cv: "Definí la estrategia de producto end-to-end empezando por el ICP, redefinido con discovery fuera del pipeline: de 0 a más de 50 clientes en el primer año.",
        deep: "**Estrategia de producto end-to-end, empezando por el ICP.** Lo redefiní con discovery fuera del pipeline comercial —empresas de 20 a 150 empleados sin IT interno— y reorienté con él el onboarding y los flujos clave: **de 0 a más de 50 clientes** de SaaS en el primer año.",
      },
      {
        cv: "Lideré la evolución del producto: de operativa manual a sistema digital y apificado — del 23% al 90% de trazabilidad del pipeline.",
        deep: "**De operativa manual a sistema digital y apificado.** Sales, Accounts y Operaciones trabajaban fuera del software y la operativa apenas dejaba rastro: **del 23% al 90% de trazabilidad** del pipeline.",
      },
      {
        cv: "Lideré con el Tech Lead el partnership estratégico con Sesame HR: fase 1 en 7 semanas de producto y un canal de adquisición nuevo.",
        deep: "**Partnership estratégico con Sesame HR**, liderado junto al Tech Lead: integrar en un software de RRHH todo el flujo de renting y MDM. **Fase 1 entregada en 7 semanas de producto**, y un canal de adquisición nuevo para Emendu.",
      },
      {
        cv: "Evolucioné LISA (agente IA): de un sistema inconsistente a un agente funcional con acceso dinámico a datos, documentación viva y capacidades multilenguaje.",
        deep: "**LISA, el agente de IA:** de un sistema inconsistente a un agente funcional, con acceso dinámico a datos, documentación viva y capacidades multilingües.",
      },
      {
        cv: "Impulsé el paso de un SaaS desarrollado por agencia externa (Bubble) a un equipo técnico interno, participando en la incorporación de un Tech Lead.",
        deep: "**Del SaaS de agencia externa a equipo técnico propio.** La plataforma en Bubble había validado el modelo, pero frenaba justo las dos áreas de más valor. Empujé el cambio y participé en la incorporación del Tech Lead.",
      },
      {
        cv: "Desarrollé un hub de tools interno vía Claude Code que redujo un 38% el tiempo de gestión operativa en reports, informes y propuestas.",
        deep: "**Como product builder, construí el hub de herramientas internas**, desarrollado con Claude Code para reports, informes y propuestas: **un 38% menos de tiempo** de gestión operativa.",
      },
    ],
  },
  KUOTIP: {
    role: "Cofounder & Product",
    period: "Feb 2024 — Dic 2024",
    sector: "Customer Reviews",
    reporting: {
      deep: "Cofundador, 1 de 3 socios",
      cv: "Cofundador (1 de 3 socios) · junto a la CEO y el CTO",
    },
    short:
      "Validé el fraude en reviews con usuarios y marcas antes de construir nada; definí el MVP con verificación por voz e IA y apoyé a la CEO en el fundraising pre-seed.",
    bullets: [
      {
        cv: "Validé el problema por los dos lados del mercado —fraude, manipulación y costes crecientes— con más de 30 entrevistas a usuarios y 15 a empresas.",
        deep: "**Validé el problema por los dos lados del mercado**, usuarios y marcas: fraude, manipulación y costes crecientes en las plataformas tradicionales. **Más de 30 entrevistas a usuarios y 15 a empresas**, que además de confirmar la hipótesis nos eligieron el go-to-market.",
      },
      {
        cv: "Diseñé los flujos completos del producto, integrando verificación de identidad por voz y resúmenes automáticos con IA.",
        deep: "**Diseñé los flujos completos del producto**, integrando verificación de identidad por voz y resúmenes automáticos con IA.",
      },
      {
        cv: "Definí el MVP junto al product designer, con una UI enfocada al sector y pensada para un formato visual.",
        deep: "**Definí el MVP junto al product designer**, con una UI enfocada al sector elegido y pensada para un formato visual, no para el gráfico de estrellas de siempre.",
      },
      {
        cv: "Apoyé a la CEO en estrategia y en las reuniones con fondos pre-seed.",
        deep: "**Apoyé a la CEO en estrategia y en las reuniones con fondos pre-seed.**",
      },
    ],
  },
  INDYA: {
    role: "Product Lead",
    period: "Ene 2022 — Dic 2023",
    sector: "SaaS B2C · Health tech",
    reporting: {
      deep: "CPO y CTO",
      cv: "Reporté al CPO y al CTO · liderazgo por influencia",
    },
    short:
      "Ordené el crecimiento sobre el ciclo de vida y no sobre funcionalidades: del 16% al 10% de churn mensual, con activación, engagement y retención como palancas del roadmap.",
    bullets: [
      {
        cv: "Co-definí la estrategia de crecimiento sobre el ciclo de vida y no sobre funcionalidades: activación, engagement y retención como palancas del roadmap.",
        deep: "**Estrategia de crecimiento sobre el ciclo de vida, no sobre funcionalidades.** Co-definí las tres palancas —activación, engagement y retención— y con ellas se ordenaron el roadmap y los OKR del equipo.",
      },
      {
        cv: "Introduje prácticas sistemáticas de user research donde no había ninguna: entrevistas, encuestas y análisis post-churn continuos.",
        deep: "**Práctica de user research donde no había ninguna.** Entrevistas, encuestas y análisis post-churn en cadencia continua: INDYA tenía una estructura de datos muy buena y poca conversación con sus usuarios.",
      },
      {
        cv: "Reduje el churn mensual del 16% al 10%, atajando el voluntario y el involuntario con producto y customer success.",
        deep: "**Churn mensual del 16% al 10%.** Varios frentes a la vez para entender y atajar el churn voluntario y el involuntario: acciones de producto combinadas con customer success.",
      },
      {
        cv: "Mejoré la activación del primer mes (+28%) optimizando onboarding, personalización y comprensión de valor.",
        deep: "**Activación del primer mes: +28%.** Onboarding, personalización y comprensión de valor — que el usuario nuevo entienda para qué sirve la app antes de que se le pase la motivación con la que se la descargó.",
      },
      {
        cv: "Rediseñé el pricing con A/B testing, unificando planes y quitando barreras: +13% de conversión y +5% de ARPU, sin afectar la retención.",
        deep: "**Rediseño del pricing con A/B testing.** Unifiqué planes y quité barreras de entrada: **+13% de conversión y +5% de ARPU**, sin tocar la retención.",
      },
      {
        cv: "Lideré la mejora del delivery: de Trello a Jira, ceremonias reales, criterios de entrega y sprints con un solo foco.",
        deep: "**Delivery más consistente.** De Trello a Jira, ceremonias ágiles de verdad, criterios de entrega y aprobación, sprints con un solo foco y retrospectivas para mejorar como equipo.",
      },
    ],
  },
  Freepik: {
    role: "Product Manager",
    period: "Oct 2021 — Dic 2021",
    sector: "SaaS B2C · UGC",
    reporting: {
      deep: "Head of Product",
      cv: "Reporté a la Head of Product",
    },
    short:
      "Investigué y definí funcionalidades para el área de contributors; rediseñé el registro y el onboarding, donde el 75% desistía, y gestioné los OKR del squad.",
    bullets: [
      {
        cv: "Investigué y definí funcionalidades para el área de contributors a partir de análisis cualitativo y cuantitativo.",
        deep: "**Investigación y definición de funcionalidades para el área de contributors**, con análisis cualitativo y cuantitativo. La herramienta de analítica de producto se estaba eligiendo justo entonces, así que la evidencia salió de encuestas, entrevistas y el discovery del trimestre anterior.",
      },
      {
        cv: "Rediseñé el registro y el onboarding del contributor, donde el 75% desistía: flujo simplificado y emails que acompañan hasta la aprobación del perfil.",
        deep: "**Rediseño del registro y el onboarding del contributor**, donde el **75% desistía o se quedaba bloqueado**: flujo simplificado y una secuencia de emails que acompaña cada paso hasta la aprobación del perfil.",
      },
      {
        cv: "Gestión de los OKR del squad.",
        deep: "**Gestión de los OKR del squad** — el primer sistema de objetivos trimestrales con el que trabajé de forma reglada, y en una empresa que se los tomaba en serio.",
      },
    ],
  },
  TheTool: {
    role: "Cofounder & Product",
    period: "May 2016 — Oct 2021",
    sector: "SaaS B2B · ASO",
    reporting: {
      deep: "Cofundador, 1 de 4 socios",
      cv: "Cofundador (1 de 4 socios) · voz y voto en las decisiones clave",
    },
    short:
      "Cofundador y responsable de producto de cero a la venta: visión, MVP, roadmap y el equipo de desarrollo, hasta la adquisición por AppRadar en 2021.",
    bullets: [
      {
        cv: "Cofundador responsable de la visión, el diseño del MVP, su validación y el lanzamiento de la versión de pago; TheTool nació bootstrap, financiada por la agencia que la incubó.",
        deep: "**Cofundador responsable de la visión de producto**, del diseño del MVP, de su validación y del lanzamiento de la versión de pago. TheTool nació bootstrap, financiada por la agencia que la incubó.",
      },
      {
        cv: "Diseñé y evolucioné las funcionalidades que nos diferenciaron: correlación instalaciones/ASO, dashboards de tracking, ASO score, análisis internacional, timeline y monitorización masiva.",
        deep: "**Diseñé y evolucioné las funcionalidades que nos diferenciaron:** correlación entre instalaciones y ASO, dashboards de tracking, ASO score, análisis internacional, timeline de competidores y monitorización masiva.",
      },
      {
        cv: "En 3 días convertimos una beta oculta de Google Play en funcionalidad abierta: 7 meses antes que el mercado y un +30% de MRR en 2 meses.",
        deep: "**En 3 días convertimos una beta oculta de Google Play en una funcionalidad abierta a todos nuestros clientes** — la tuvimos **7 meses** antes que el mercado y nos dio un **+30% de MRR en 2 meses**.",
      },
      {
        cv: "Lideré roadmap, discovery, definición funcional y la coordinación con desarrollo, marketing y customer success.",
        deep: "**Lideré roadmap, discovery, definición funcional y la coordinación** con desarrollo, marketing y customer success.",
      },
      {
        cv: "Incorporé al primer Product Designer, y con él el rediseño completo de la marca y de la plataforma.",
        deep: "**Incorporé al primer Product Designer**, y con él el rediseño completo de la marca y de la plataforma.",
      },
      {
        cv: "TheTool se posicionó entre las herramientas ASO de referencia —nominada a Mejor Software ASO de Europa— y fue adquirida por AppRadar en 2021.",
        deep: "**TheTool se posicionó entre las herramientas ASO de referencia** —nominada a Mejor Software ASO de Europa en el App Promotion Summit de Berlín— y **fue adquirida por AppRadar en 2021**.",
      },
    ],
  },
  PICKASO: {
    role: "COO",
    period: "Sep 2015 — Dic 2016",
    sector: "App Marketing · Agencia",
    short:
      "Profesionalicé estructura y cartera de servicios de la agencia; realicé la investigación de mercado de los futuros competidores de TheTool.",
    bullets: [
      {
        cv: "Profesionalicé estructura, procesos y cartera de servicios de la agencia.",
      },
      { cv: "Reposicioné marca y propuesta de valor." },
      {
        cv: "Base operativa y de conocimiento de mercado que permitió incubar TheTool (investigación de sus futuros competidores).",
      },
    ],
  },
  Ontecnia: {
    role: "Digital Marketing Manager",
    period: "Sep 2013 — Sep 2015",
    sector: "Malavida.com",
    short:
      "Crecimiento orgánico de 3,2M → 9,4M visitas mensuales; llevé el modelo de negocio de instaladores intrusivos a contenido de valor y monetización por vídeo — el inicio de mi giro hacia product-first.",
    bullets: [
      { cv: "Crecimiento orgánico de 3,2M a 9,4M visitas mensuales." },
      {
        cv: "Impulsé la transición del modelo de negocio: de instaladores intrusivos a contenido de valor y monetización por vídeo — el inicio de mi giro hacia product-first.",
      },
    ],
  },
  "Havas Media": {
    role: "Digital Marketing / Performance",
    period: "2009 — 2013",
    sector: "",
    short:
      "Adquisición y performance en agencias líderes — la base de analítica, CRO, UX y liderazgo que facilitó el salto a producto.",
    bullets: [
      {
        cv: "Adquisición y performance en agencias líderes — la base de analítica, CRO, UX y liderazgo que facilitó el salto a producto.",
      },
    ],
  },
};
