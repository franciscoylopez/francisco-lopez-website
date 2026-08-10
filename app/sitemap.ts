import type { MetadataRoute } from "next";

import { defaultLocale, locales } from "@/lib/i18n/config";
import { pageUrl } from "@/lib/structured-data";

// /sitemap.xml — una entrada por página (URL canónica en español, sin prefijo)
// con sus alternates hreflang es/en (D2). `priority` es una pista débil: home 1,
// páginas de sistema/contenido 0.8, legal 0.3.
//
// Los `slug` van SIN barra inicial porque es la forma que toma `pagePath`, que es
// de donde salen todas las rutas del sitio. Las URLs se derivan de ahí y no se
// escriben: eran la última copia del ternario `lang === "es" ? … : …` en una
// superficie de SEO, y una copia que diverge en el sitemap no la ve nadie —
// ningún tipo comprueba un string de URL.
const PAGES: { slug: string; priority: number }[] = [
  { slug: "", priority: 1 },
  { slug: "sobre-mi", priority: 0.8 },
  { slug: "brand-kit", priority: 0.8 },
  { slug: "design-system", priority: 0.8 },
  { slug: "accesibilidad", priority: 0.8 },
  { slug: "cookies", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return PAGES.map(({ slug, priority }) => ({
    url: pageUrl(defaultLocale, slug),
    lastModified,
    changeFrequency: "monthly",
    priority,
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, pageUrl(l, slug)])),
    },
  }));
}
