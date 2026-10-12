/** El copy de UNA experiencia, indexado por idioma. Lo comparten las dos mitades. */
import type { experienceCopy } from "../../content/experience-copy";
import type { Company } from "../../content/experience-copy/types";
import type { Locale } from "../../lib/i18n/config";

export type CopyDeExperiencia = ReturnType<typeof experienceCopy>[Company];
export type PorIdioma = Record<Locale, CopyDeExperiencia>;
