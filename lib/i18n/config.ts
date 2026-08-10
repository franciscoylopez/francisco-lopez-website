// Configuración de locales — módulo plano (sin `server-only`) porque lo importa
// también `proxy.ts`, que corre en el edge. No meter aquí nada de servidor.
//
// D2: español SIN prefijo (raíz `/`), inglés en `/en`. defaultLocale = es,
// prefijo as-needed. La TRADUCCIÓN a inglés es V2; la ARQUITECTURA, desde ya.

export const locales = ["es", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "es";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

// Ruta de una página por locale (D2): ES sin prefijo, EN bajo `/en`. `slug` es lo
// que va DESPUÉS del locale, sin barras ("brand-kit", "trayectoria/emendu"); sin
// slug, la home. Fuente única del emparejamiento ruta↔locale: de aquí salen el
// canonical, los tres `hreflang` y el enlace del logo al inicio, que antes eran
// cinco copias por página del ternario `lang === "es" ? … : …` (D45).
export function pagePath(lang: Locale, slug = ""): string {
  const prefix = lang === defaultLocale ? "" : `/${lang}`;
  return slug ? `${prefix}/${slug}` : prefix || "/";
}

// Ruta del PDF del CV por locale (D22): ES → -es.pdf, EN → -en.pdf. Ambos assets
// se generan con scripts/cv/generate.tsx. Vive aquí (client/edge-safe, sin
// server-only) para que el Nav —client component— derive su propio enlace sin
// importar lib/site. Fuente única de la ruta del CV.
export const cvPath = (lang: Locale): string =>
  `/cv/francisco-lopez-cv-${lang}.pdf`;
