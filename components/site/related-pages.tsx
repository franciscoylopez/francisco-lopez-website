import type { Dictionary } from "@/app/[lang]/dictionaries";

import { PageCloser, type CloserItem } from "@/components/ui/page-closer";
import { type Locale, pagePath } from "@/lib/i18n/config";
import type { StaticPageSlug } from "@/lib/routes";

export type RelatedDict = Dictionary["related"];

type PageKey = "brandKit" | "designSystem" | "accesibilidad";

// Orden canónico del sistema. Las tres páginas existen; cada una enlaza a las otras
// dos desde una sola fuente (este array). Si alguna dejara de existir, `path: null`
// la devolvería al estado "Próximamente" sin tocar las demás.
// EL SLUG INTERNO, NO LA RUTA (P72.56). Guardaba la ruta española y le pegaba
// delante el prefijo de locale, que era una copia del ternario de `pagePath` — y
// desde que el inglés traduce sus slugs, una copia FALSA: `/en/accesibilidad` ya
// solo es una redirección, así que las tres páginas del sistema se enlazaban
// entre sí a través de un 301 en la mitad inglesa del sitio.
const PAGES: { key: PageKey; slug: StaticPageSlug | null }[] = [
  { key: "brandKit", slug: "brand-kit" },
  { key: "designSystem", slug: "design-system" },
  { key: "accesibilidad", slug: "accesibilidad" },
];

// Enlaces a las páginas hermanas del sistema (Brand Kit · Design System ·
// Accesibilidad). Compartido por las tres para que la relación se muestre desde
// la misma posición —cierre del <main>, antes del footer— y con el mismo
// formato. Cada página renderiza las otras dos (nunca a sí misma).
//
// EL FORMATO YA NO VIVE AQUÍ: lo pone `ui/page-closer.tsx` desde que apareció el
// segundo caso (el paso entre experiencias del deep-dive, P48). Aquí queda lo que
// es de ESTE sitio: quién es hermana de quién. El refactor se verificó con
// `npm run gate:html` — diff vacío en las veintiséis variantes.
export function RelatedPages({
  dict,
  current,
  lang,
}: {
  dict: RelatedDict;
  current: PageKey;
  lang: string;
}) {
  const items: CloserItem[] = PAGES.filter((p) => p.key !== current).map(
    ({ key, slug }) => ({
      key,
      name: dict.pages[key].name,
      desc: dict.pages[key].desc,
      ...(slug
        ? { href: pagePath(lang as Locale, slug) }
        : { badge: dict.comingSoon }),
    }),
  );

  return <PageCloser eyebrow={dict.eyebrow} items={items} />;
}
