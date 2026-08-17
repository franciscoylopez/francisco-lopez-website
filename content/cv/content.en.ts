// Authored CV content (EN) — reviewed against the Spanish source, not literal
// (D20). Facts (periods, roles, education, toolkit) are NOT here: they come from
// en.json via scripts/cv/facts.ts (single-source, D22), already in English.
// `company` is the join key with the dictionary.

import type { CvContent } from "./types";

export const content: CvContent = {
  name: "Francisco López",
  role: "Senior Product Manager · SaaS B2B & B2C",
  subject: "Senior Product Manager · SaaS B2B & B2C",

  ui: {
    profile: "Profile",
    milestones: "Highlights",
    experience: "Experience",
    previous: "Earlier experience — Marketing & Growth",
    education: "Education",
    skills: "Skills",
    toolkit: "Toolkit",
  },

  contact: {
    email: "franciscojavier.lopezmartinez@gmail.com",
    phone: "629 832 720",
    web: "franciscolopez.es",
    linkedin: "linkedin.com/in/franciscolopez1975",
    location: "Valencia, Spain",
  },

  summary:
    "Senior Product Manager with 10+ years building and scaling B2B and B2C SaaS products, end-to-end from idea and MVP to growth and data. Specialised in product strategy, UX, SaaS metrics, applied AI and pricing. I work closely with design, engineering and business to build coherent, scalable products with an outstanding user experience.",

  milestones: [
    {
      year: "2026",
      company: "Emendu",
      impact: "Strategic partnership with Sesame HR.",
    },
    {
      year: "2023",
      company: "INDYA",
      impact: "Monthly churn from 16% to 10% · first-month activation +28%.",
    },
    {
      year: "2022",
      company: "INDYA",
      impact: "Selected for Apple App Store Foundations.",
    },
    {
      year: "2021",
      company: "TheTool",
      impact: "Acquired by AppRadar.",
      exit: true,
    },
    {
      year: "2019",
      company: "TheTool",
      impact: "Nominated Best ASO Software in Europe (App Promotion Summit).",
    },
  ],

  experience: [
    {
      company: "Emendu",
      context: "SaaS B2B · IT Management",
      reporting:
        "Member of the leadership team (Management, Operations, Tech & Finance)",
    },
    {
      company: "KUOTIP",
      context: "SaaS B2B · AI / Reviews",
      reporting: "Cofounder · alongside the CEO and CTO",
    },
    {
      company: "INDYA",
      context: "SaaS B2C · Health tech",
      reporting:
        "Reported to the CPO and cofounder · leadership through influence",
    },
    {
      company: "Freepik",
      context: "SaaS B2C · UGC",
      reporting: "Reported to the Head of Product",
    },
    {
      company: "TheTool",
      context: "SaaS B2B · ASO",
      reporting:
        "Cofounder (1 of 4 partners) · voice and vote on key decisions",
    },
    {
      company: "PICKASO",
      context: "App Marketing · Agency",
    },
  ],

  previous: {
    intro:
      "This earlier stage in marketing and growth built the analytical, experimentation and user-first foundation that defines my approach as a Product Manager.",
    roles: [
      {
        company: "Ontecnia",
        context: "Malavida.com",
      },
      {
        company: "Havas Media · Increnta · Miss Conversion",
        context: "",
      },
    ],
  },

  skills: [
    {
      label: "SaaS Product",
      value:
        "Strategy, metrics, pricing, experimentation, discovery, roadmapping.",
    },
    {
      label: "UX & Design",
      value:
        "Collaboration with Product Designers, usability, prototyping, qualitative research.",
    },
    {
      label: "Leadership",
      value: "Stakeholder management, communication, cross-functional teams.",
    },
    {
      label: "Applied AI",
      value:
        "Conversational agents, LLMs, AI-assisted experiences, in-house development.",
    },
  ],
};
