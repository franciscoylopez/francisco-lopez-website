// Copy por experiencia — INGLÉS. Se revisa CONTRA el español, no se traduce
// literal (D20). El español es la fuente de verdad de la forma y del hecho.
//
// Si a este archivo le falta una empresa que `es.ts` tiene, NO COMPILA: los dos
// se anotan con `ExperienceCopyMap`, que es un `Record` sobre la unión de
// empresas registradas. Lo que el tipo no puede ver —que el número de bullets
// cuadre, y que las cifras coincidan— lo comprueba `npm run check:experiencias`.

import type { ExperienceCopyMap } from "./types";

export const copy: ExperienceCopyMap = {
  Emendu: {
    short:
      "Turned a newly built SaaS into the company's business model: redefined the ICP, digitalized the operation and opened a channel with the Sesame HR partnership.",
    bullets: [
      {
        cv: "Defined end-to-end product strategy starting with the ICP, redefined through discovery outside the pipeline: from 0 to more than 50 customers in the first year.",
        deep: "**End-to-end product strategy, starting with the ICP.** I redefined it through discovery outside the sales pipeline —companies of 20 to 150 employees with no in-house IT— and used it to reorient onboarding and the key flows: **from 0 to more than 50 SaaS customers** in the first year.",
      },
      {
        cv: "Led the product's evolution: from a manual operation to a digital, API-first system — from 23% to 90% pipeline traceability.",
        deep: "**From a manual operation to a digital, API-first system.** Sales, Accounts and Operations worked outside the software and the operation left almost no trace: **from 23% to 90% pipeline traceability**.",
      },
      {
        cv: "Led, with the Tech Lead, the strategic partnership with Sesame HR: phase 1 in 7 product weeks and a new acquisition channel.",
        deep: "**Strategic partnership with Sesame HR**, led together with the Tech Lead: embedding the entire renting and MDM flow inside an HR software. **Phase 1 delivered in 7 product weeks**, and a new acquisition channel for Emendu.",
      },
      {
        cv: "Evolved LISA (AI agent): from an inconsistent system to a functional agent with dynamic data access, living documentation and multilingual capabilities.",
        deep: "**LISA, the AI agent:** from an inconsistent system to a working agent, with dynamic access to data, living documentation and multilingual capabilities.",
      },
      {
        cv: "Drove the shift from a SaaS built by an external agency (Bubble) to an in-house engineering team, taking part in hiring a Tech Lead.",
        deep: "**From an outsourced SaaS to an in-house engineering team.** The Bubble platform had validated the model, but it was slowing down precisely the two highest-value areas. I pushed for the change and took part in hiring the Tech Lead.",
      },
      {
        cv: "Built an internal tools hub with Claude Code that cut operational-management time on reports, briefs and proposals by 38%.",
        deep: "**As a product builder, I built the internal tooling hub**, developed with Claude Code for reports, briefs and proposals: **38% less time** spent on operational management.",
      },
    ],
  },
  KUOTIP: {
    short:
      "Validated review fraud with users and brands before building anything; defined the MVP with voice verification and AI, and supported the CEO in the pre-seed fundraising.",
    bullets: [
      {
        cv: "Validated the problem on both sides of the market —fraud, manipulation and rising costs— with more than 30 user interviews and 15 with companies.",
        deep: "**I validated the problem on both sides of the market**, users and brands: fraud, manipulation and rising costs on the traditional platforms. **More than 30 user interviews and 15 with companies**, which not only confirmed the hypothesis but picked our go-to-market for us.",
      },
      {
        cv: "Designed the full product flows, integrating voice-based identity verification and automated AI summaries.",
        deep: "**I designed the product's full flows**, integrating voice-based identity verification and automatic AI summaries.",
      },
      {
        cv: "Defined the MVP with the product designer, with a UI focused on the chosen sector and built for a visual format.",
        deep: "**I defined the MVP with the product designer**, with a UI focused on the chosen sector and built for a visual format, not for the same old star chart.",
      },
      {
        cv: "Supported the CEO on strategy and in the meetings with pre-seed funds.",
        deep: "**I supported the CEO on strategy and in the meetings with pre-seed funds.**",
      },
    ],
  },
  INDYA: {
    short:
      "Organised growth around the lifecycle rather than features: monthly churn from 16% to 10%, with activation, engagement and retention as the roadmap's levers.",
    bullets: [
      {
        cv: "Co-defined the growth strategy on the lifecycle rather than features: activation, engagement and retention as the roadmap's levers.",
        deep: "**Growth strategy built on the lifecycle, not on features.** I co-defined the three levers —activation, engagement and retention— and the roadmap and the team's OKRs were organised around them.",
      },
      {
        cv: "Introduced systematic user research where there was none: interviews, surveys and continuous post-churn analysis.",
        deep: "**A user research practice where there was none.** Interviews, surveys and post-churn analysis on a continuous cadence: INDYA had a very good data structure and very little conversation with its users.",
      },
      {
        cv: "Cut monthly churn from 16% to 10%, tackling both voluntary and involuntary churn with product and customer success.",
        deep: "**Monthly churn from 16% to 10%.** Several fronts at once to understand and tackle both voluntary and involuntary churn: product work combined with customer success.",
      },
      {
        cv: "Improved first-month activation (+28%) by optimising onboarding, personalisation and value comprehension.",
        deep: "**First-month activation: +28%.** Onboarding, personalisation and value comprehension — so a new user understands what the app is for before the motivation that made them download it wears off.",
      },
      {
        cv: "Redesigned pricing with A/B testing, unifying plans and removing entry barriers: +13% conversion and +5% ARPU, without affecting retention.",
        deep: "**Pricing redesign with A/B testing.** I unified plans and removed entry barriers: **+13% conversion and +5% ARPU**, without touching retention.",
      },
      {
        cv: "Led delivery improvements: from Trello to Jira, real ceremonies, delivery criteria and sprints with a single focus.",
        deep: "**More consistent delivery.** From Trello to Jira, agile ceremonies actually run as such, explicit delivery and approval criteria, sprints with a single focus, and retrospectives to improve as a team.",
      },
    ],
  },
  Freepik: {
    short:
      "Researched and defined features for the contributors area; redesigned sign-up and onboarding, where 75% dropped off, and owned the squad's OKRs.",
    bullets: [
      {
        cv: "Researched and defined features for the contributors area from qualitative and quantitative analysis.",
        deep: "**Research and feature definition for the contributors area**, with qualitative and quantitative analysis. The product analytics tool was being chosen at that very moment, so the evidence came from surveys, interviews and the previous quarter's discovery.",
      },
      {
        cv: "Redesigned contributor sign-up and onboarding, where 75% dropped off: a simplified flow and emails that walk through to profile approval.",
        deep: "**Redesign of the contributor sign-up and onboarding**, where **75% dropped off or got stuck**: a simplified flow and an email sequence that walks through every step up to profile approval.",
      },
      {
        cv: "Owned the squad's OKRs.",
        deep: "**Ownership of the squad's OKRs** — the first quarterly goal system I worked with in a formal way, and at a company that took them seriously.",
      },
    ],
  },
  TheTool: {
    short:
      "Cofounder and product lead from zero to the sale: vision, MVP, roadmap and the development team, through to the acquisition by AppRadar in 2021.",
    bullets: [
      {
        cv: "Cofounder responsible for the vision, MVP design, validation and the launch of the paid version; TheTool was born bootstrapped, funded by the agency that incubated it.",
        deep: "**Co-founder responsible for the product vision**, the MVP design, its validation and the launch of the paid version. TheTool was born bootstrapped, funded by the agency that incubated it.",
      },
      {
        cv: "Designed and evolved the features that set us apart: installs/ASO correlation, tracking dashboards, ASO score, international analysis, timeline and bulk monitoring.",
        deep: "**I designed and evolved the features that set us apart:** correlation between installs and ASO, tracking dashboards, ASO score, international analysis, competitor timeline and bulk monitoring.",
      },
      {
        cv: "In 3 days we turned a hidden Google Play beta into an open feature: 7 months before the market and +30% MRR.",
        deep: "**In 3 days we turned a hidden Google Play beta into a feature open to all our customers** — we had it **7 months** before the market and it gave us **+30% MRR**.",
      },
      {
        cv: "Led roadmap, discovery, functional definition and coordination with development, marketing and CS.",
        deep: "**I led roadmap, discovery, functional definition and coordination** with engineering, marketing and customer success.",
      },
      {
        cv: "Brought on the first Product Designer, and with them the full redesign of the brand and the platform.",
        deep: "**I brought in the first Product Designer**, and with them the full redesign of the brand and the platform.",
      },
      {
        cv: "TheTool established itself among the reference ASO tools —nominated Best ASO Software in Europe— and was acquired by AppRadar in 2021.",
        deep: "**TheTool established itself among the reference ASO tools** —nominated Best ASO Software in Europe at the App Promotion Summit in Berlin— and **was acquired by AppRadar in 2021**.",
      },
    ],
  },
  PICKASO: {
    short:
      "Professionalized the agency's structure and service portfolio; ran the market research on TheTool's future competitors.",
    bullets: [
      {
        cv: "Professionalised the agency's structure, processes and service portfolio.",
      },
      { cv: "Repositioned the brand and value proposition." },
      {
        cv: "Operational and market-knowledge base that made incubating TheTool possible (research into its future competitors).",
      },
    ],
  },
  Ontecnia: {
    short:
      "Organic growth from 3.2M to 9.4M monthly visits; shifted the business model from intrusive installers to valuable content and video monetization — the start of my turn toward product-first.",
    bullets: [
      { cv: "Organic growth from 3.2M to 9.4M monthly visits." },
      {
        cv: "Drove the business-model shift: from intrusive installers to valuable content and video monetisation — the start of my move towards product-first.",
      },
    ],
  },
  "Havas Media": {
    short:
      "Acquisition and performance at leading agencies — the analytics, CRO, UX and leadership foundation that enabled the jump to product.",
    bullets: [
      {
        cv: "Acquisition and performance at leading agencies — the analytics, CRO, UX and leadership base that enabled the move into product.",
      },
    ],
  },
};
