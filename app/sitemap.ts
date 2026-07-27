import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

// /sitemap.xml — una entrada por página (URL canónica en español, sin prefijo)
// con sus alternates hreflang es/en (D2). Cubre las tres páginas de V1; Sobre mí
// y Accesibilidad se añadirán cuando existan (V2).
const PATHS = ["", "/brand-kit", "/design-system"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return PATHS.map((path) => ({
    url: `${SITE_URL}${path || "/"}`,
    lastModified,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.8,
    alternates: {
      languages: {
        es: `${SITE_URL}${path || "/"}`,
        en: `${SITE_URL}/en${path}`,
      },
    },
  }));
}
