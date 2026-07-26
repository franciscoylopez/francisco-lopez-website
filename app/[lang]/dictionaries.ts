import "server-only";

import type { Locale } from "@/lib/i18n/config";
import type esDict from "./dictionaries/es.json";

// El diccionario ES es la fuente de verdad de la forma. `Dictionary` se deriva de
// él, así que cualquier acceso a una clave inexistente es error de compilación
// (D11: "cero strings hardcodeados" verificado por el tipo). El loader EN devuelve
// `Dictionary`, de modo que si `en.json` pierde una clave presente en `es.json`,
// TypeScript falla el build antes de que un texto sin traducir llegue a producción.
export type Dictionary = typeof esDict;

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  es: () => import("./dictionaries/es.json").then((m) => m.default),
  en: () => import("./dictionaries/en.json").then((m) => m.default),
};

export const getDictionary = (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]();
