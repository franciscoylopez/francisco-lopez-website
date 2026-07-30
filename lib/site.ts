// Constantes del sitio, fuente única para metadata / OG / canonical / robots /
// sitemap. Precedencia de la URL base:
//   1) NEXT_PUBLIC_SITE_URL — override manual explícito (p. ej. el dominio propio).
//   2) En producción, VERCEL_PROJECT_PRODUCTION_URL — la URL ESTABLE de producción,
//      no la efímera del deployment (VERCEL_URL cambia en cada deploy, lo que dejaba
//      canonical/OG/sitemap apuntando a un host distinto cada vez). Vercel pone esta
//      variable al dominio propio en cuanto se conecta, así que el canónico lo sigue
//      sin tocar código.
//   3) VERCEL_URL — la URL única del deployment: correcta para los previews de rama.
//   4) localhost en desarrollo.
import type { Locale } from "@/lib/i18n/config";

const vercelHost =
  process.env.VERCEL_ENV === "production"
    ? (process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL)
    : process.env.VERCEL_URL;

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (vercelHost ? `https://${vercelHost}` : "http://localhost:3000");

export const SITE_NAME = "Francisco López";

export const LINKEDIN_URL = "https://www.linkedin.com/in/franciscolopez1975/";

// Ruta del PDF del CV por locale (D22): ES → -es.pdf, EN → -en.pdf. Los dos assets
// se generan con scripts/cv/generate.tsx. Cada página sirve el de su idioma.
export const cvPath = (lang: Locale): string => `/cv/francisco-lopez-cv-${lang}.pdf`;

// ID del contenedor de Google Tag Manager (P21), solo cuando la analítica debe
// correr: en producción (D13 — nunca en dev/preview, para no ensuciar los datos) y
// con NEXT_PUBLIC_GTM_ID definido en el entorno de Vercel. Devuelve `undefined` en
// cualquier otro caso, y el layout omite el contenedor por completo.
export const GTM_ID =
  process.env.VERCEL_ENV === "production"
    ? process.env.NEXT_PUBLIC_GTM_ID
    : undefined;
