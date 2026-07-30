// Authored CV content (EN) — reviewed against the Spanish source, not literal
// (D20). Facts (periods, roles, education, toolkit) are NOT here: they come from
// en.json via facts.ts (single-source, D22), already in English. `company` is the
// join key with the dictionary.

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
    { year: "2026", company: "Emendu", impact: "Strategic partnership with Sesame HR." },
    { year: "2023", company: "INDYA", impact: "Monthly churn from 16% to 10% · first-month activation +28%." },
    { year: "2022", company: "INDYA", impact: "Selected for Apple App Store Foundations." },
    { year: "2021", company: "TheTool", impact: "Acquired by AppRadar.", exit: true },
    { year: "2019", company: "TheTool", impact: "Nominated Best ASO Software in Europe (App Promotion Summit)." },
  ],

  experience: [
    {
      company: "Emendu",
      context: "SaaS B2B · IT Management",
      reporting: "Member of the leadership team (Management, Operations, Tech & Finance)",
      bullets: [
        "Led the product's evolution: from a Sales & Operations–centred organisation with manual processes to a digital, API-first system.",
        "Defined the end-to-end product strategy: redefined the ICP through discovery and reoriented the user experience (onboarding and key flows).",
        "Evolved LISA (AI agent): from an inconsistent system to a functional agent with dynamic data access, living documentation and multilingual capabilities.",
        "Drove the shift from a SaaS built by an external agency (Bubble) to an in-house engineering team, taking part in hiring a Tech Lead.",
        "Built an internal tools hub with Claude Code that cut operational-management time on reports, briefs and proposals by 38%.",
        "Led, together with the Tech Lead, a strategic partnership with Sesame HR.",
      ],
    },
    {
      company: "KUOTIP",
      context: "SaaS B2B · AI / Reviews",
      reporting: "Cofounder · alongside the CEO and CTO",
      bullets: [
        "Validated the problem with users and brands: fraud, manipulation and rising costs on traditional platforms.",
        "Designed the full product flows integrating voice verification and automated AI summaries; built the MVP with a modern visual UI to prove value.",
        "Supported the CEO on strategy and pre-seed fundraising meetings.",
      ],
    },
    {
      company: "INDYA",
      context: "SaaS B2C · Health tech",
      reporting: "Reported to the CPO and cofounder · leadership through influence",
      bullets: [
        "Co-defined the growth strategy focused on activation, engagement and retention.",
        "Introduced systematic user research (interviews, post-churn surveys, continuous analysis).",
        "Cut monthly churn from 16% to 10% through UX, communication and payment improvements.",
        "Redesigned pricing via A/B testing, unifying plans and removing entry barriers, without affecting retention.",
        "Improved first-month activation (+28%) by optimising onboarding, personalisation and value comprehension.",
        "Led delivery improvements: reduced the bug volume with more agile QA and more consistent sprints.",
      ],
    },
    {
      company: "Freepik",
      context: "SaaS B2C · UGC",
      reporting: "Reported to the Head of Product",
      bullets: [
        "Researched and defined features for the contributors area from qualitative and quantitative analysis.",
        "Improved onboarding: registration, emailing and profile quality.",
        "Owned the squad's OKRs.",
      ],
    },
    {
      company: "TheTool",
      context: "SaaS B2B · ASO",
      reporting: "Cofounder (1 of 4 partners) · voice and vote on key decisions",
      bullets: [
        "Cofounder responsible for vision, MVP design, validation and launch of the paid version.",
        "Designed and evolved key features: installs/ASO correlation, tracking dashboards, ASO score, international analysis, timeline and bulk monitoring.",
        "Turned a hidden Google Play feature into a full feature in 3 days, generating +30% in customers/MRR.",
        "Led roadmap, discovery, functional definition and coordination with development, marketing and CS.",
        "Brought on the first Product Designer, leading a complete UI and brand redesign.",
        "Positioned TheTool as one of the market's top ASO tools (nominated Best ASO Software in Europe), culminating in its acquisition by AppRadar in 2021.",
      ],
    },
    {
      company: "PICKASO",
      context: "App Marketing · Agency",
      bullets: [
        "Professionalised the agency's structure, processes and service portfolio.",
        "Repositioned the brand and value proposition.",
        "Operational and market-knowledge base that made incubating TheTool possible (research into its future competitors).",
      ],
    },
  ],

  previous: {
    intro:
      "This earlier stage in marketing and growth built the analytical, experimentation and user-first foundation that defines my approach as a Product Manager.",
    roles: [
      {
        company: "Ontecnia",
        context: "Malavida.com",
        bullets: [
          "Organic growth from 3.2M to 9.4M monthly visits.",
          "Drove the business-model shift: from intrusive installers to valuable content and video monetisation — the start of my move towards product-first.",
        ],
      },
      {
        company: "Havas Media · Increnta · Miss Conversion",
        context: "",
        bullets: [
          "Acquisition and performance at leading agencies — the analytics, CRO, UX and leadership base that enabled the move into product.",
        ],
      },
    ],
  },

  skills: [
    { label: "SaaS Product", value: "Strategy, metrics, pricing, experimentation, discovery, roadmapping." },
    { label: "UX & Design", value: "Collaboration with Product Designers, usability, prototyping, qualitative research." },
    { label: "Leadership", value: "Stakeholder management, communication, cross-functional teams." },
    { label: "Applied AI", value: "Conversational agents, LLMs, AI-assisted experiences, in-house development." },
  ],
};
