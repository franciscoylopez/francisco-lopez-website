import type { Dictionary } from "@/app/[lang]/dictionaries";

import { PageCloser, type CloserItem } from "@/components/ui/page-closer";

export type RelatedDict = Dictionary["related"];

type PageKey = "brandKit" | "designSystem" | "accesibilidad";

// Orden canónico del sistema. Las tres páginas existen; cada una enlaza a las otras
// dos desde una sola fuente (este array). Si alguna dejara de existir, `path: null`
// la devolvería al estado "Próximamente" sin tocar las demás.
const PAGES: { key: PageKey; path: string | null }[] = [
  { key: "brandKit", path: "/brand-kit" },
  { key: "designSystem", path: "/design-system" },
  { key: "accesibilidad", path: "/accesibilidad" },
];

// Enlaces a las páginas hermanas del sistema (Brand Kit · Design System ·
// Accesibilidad). Compartido por las tres para que la relación se muestre desde
// la misma posición —cierre del <main>, antes del footer— y con el mismo
// formato. Cada página renderiza las otras dos (nunca a sí misma).
//
// EL FORMATO YA NO VIVE AQUÍ: lo pone `ui/page-closer.tsx` desde que apareció el
// segundo caso (el paso entre experiencias del deep-dive, P48). Aquí queda lo que
// es de ESTE sitio: quién es hermana de quién. El refactor se verificó con
// `npm run gate:html` — diff vacío en las doce variantes.
export function RelatedPages({
  dict,
  current,
  lang,
}: {
  dict: RelatedDict;
  current: PageKey;
  lang: string;
}) {
  const base = lang === "es" ? "" : `/${lang}`;

  const items: CloserItem[] = PAGES.filter((p) => p.key !== current).map(
    ({ key, path }) => ({
      key,
      name: dict.pages[key].name,
      desc: dict.pages[key].desc,
      ...(path ? { href: `${base}${path}` } : { badge: dict.comingSoon }),
    }),
  );

  return <PageCloser eyebrow={dict.eyebrow} items={items} />;
}
