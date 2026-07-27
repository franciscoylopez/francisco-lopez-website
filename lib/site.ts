// Constantes del sitio, fuente única para metadata / OG / canonical / robots /
// sitemap. El dominio propio llega en el sprint de lanzamiento (D9); hasta
// entonces: NEXT_PUBLIC_SITE_URL si se define, si no la URL del deployment de
// Vercel (VERCEL_URL, sin protocolo), y en local localhost.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

export const SITE_NAME = "Francisco López";

export const LINKEDIN_URL = "https://www.linkedin.com/in/franciscolopez1975/";
