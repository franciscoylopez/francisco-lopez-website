import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

// /sitemap.xml — una entrada por página (URL canónica en español, sin prefijo)
// con sus alternates hreflang es/en (D2). La home y las páginas propias de V1;
// Sobre mí y Accesibilidad se añadirán cuando existan (V2). `priority` es una
// pista débil: home 1, páginas de sistema 0.8, legal 0.3.
const PAGES: { path: string; priority: number }[] = [
  { path: "", priority: 1 },
  { path: "/brand-kit", priority: 0.8 },
  { path: "/design-system", priority: 0.8 },
  { path: "/cookies", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return PAGES.map(({ path, priority }) => ({
    url: `${SITE_URL}${path || "/"}`,
    lastModified,
    changeFrequency: "monthly",
    priority,
    alternates: {
      languages: {
        es: `${SITE_URL}${path || "/"}`,
        en: `${SITE_URL}/en${path}`,
      },
    },
  }));
}
