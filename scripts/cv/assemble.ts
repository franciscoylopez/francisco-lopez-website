// Ensamblado del CV: junta lo autorado con los hechos y devuelve el objeto que se
// renderiza. Vive aparte de `generate.tsx` desde 2026-08-18 y por una razón
// concreta: **lo necesitan DOS consumidores**, el generador y el guardián de
// frescura (`npm run check:cv`). Dejarlo dentro del `.tsx` obligaba al guardián a
// importar react-pdf y a arrancar el render solo para saber qué datos entran.
//
// Es un `.ts` sin JSX a propósito: aquí no se pinta nada, solo se resuelven datos.

import type { CV, CvContent, Job, AuthoredJob } from "../../content/cv/types";
import { cvBullets, factsOf, reportingOf } from "../../content/experience-copy";
import {
  loadDict,
  buildEducation,
  buildTools,
  experienceFacts,
  previousFacts,
  matchFact,
  type FactRow,
} from "./facts";

// Un rol del CV se compone de TRES fuentes y ninguna se escribe aquí: lo autorado
// (a qué experiencias da papel el CV), los hechos del registro por experiencia
// —rol, periodo, sector, reporting y los bullets— y el proyecto paraguas del
// diccionario. Las tres uniones son por `company`, y LANZAN si no hay match:
// mejor romper la generación que imprimir en el papel los bullets de otra empresa.
export function mergeJob(
  a: AuthoredJob,
  facts: FactRow[],
  lang: "es" | "en",
): Job {
  const f = matchFact(facts, a.company);
  const { role, period, sector } = factsOf(lang, a.company);
  return {
    ...a,
    role,
    period,
    context: sector,
    reporting: reportingOf(lang, a.company, "cv"),
    project: f.project,
    bullets: cvBullets(lang, a.company),
  };
}

export function assemble(lang: "es" | "en", content: CvContent): CV {
  const dict = loadDict(lang);
  const expFacts = experienceFacts(dict);
  const prevFacts = previousFacts(dict);
  return {
    name: content.name,
    role: content.role,
    subject: content.subject,
    ui: content.ui,
    contact: content.contact,
    summary: content.summary,
    skills: content.skills,
    milestones: content.milestones,
    experience: content.experience.map((a) => mergeJob(a, expFacts, lang)),
    previous: {
      intro: content.previous.intro,
      roles: content.previous.roles.map((a) => mergeJob(a, prevFacts, lang)),
    },
    education: buildEducation(dict),
    tools: buildTools(dict),
  };
}
