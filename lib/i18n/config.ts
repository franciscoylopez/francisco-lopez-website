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
