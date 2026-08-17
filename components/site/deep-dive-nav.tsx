import type { TrayectoriaComunDict } from "@/app/[lang]/dictionaries";
import { EXPERIENCES } from "@/content/experiences";
import { factsOf } from "@/content/experience-copy";
import type { Locale } from "@/lib/i18n/config";

import { PageCloser, type CloserItem } from "@/components/ui/page-closer";

// Paso a la experiencia ANTERIOR y SIGUIENTE, como cierre de cada deep-dive
// (P48). Mismo formato que el cierre de las tres páginas del sistema — es
// literalmente la misma pieza (`ui/page-closer.tsx`), no una copia con el mismo
// aspecto.
//
// EL ORDEN LO PONE `EXPERIENCES`, que ya está en orden cronológico descendente y
// es la fuente de la que beben Trayectoria, los logos y los slugs (D44). Así que
// «anterior» es el siguiente del array (más antiguo) y «siguiente» el previo (más
// reciente): Emendu, que es la actual, solo tiene anterior. Ninguna de las dos
// direcciones se escribe en ningún sitio.
//
// Y EL COPY DE CADA TARJETA NO SE DUPLICA. El rol y el periodo salen del REGISTRO
// POR EXPERIENCIA (P48.55), que es de donde los leen también la fila de
// Trayectoria y el CV, unidos por `company` — la clave de este proyecto desde que
// existe el CV. Antes se leían de la rama `trayectoria` del diccionario de la
// home, que era una de las copias que P48.55 retiró: por eso esta página ya no
// necesita cargar `getHome`.

/** Las experiencias que tienen página, en el orden canónico. */
const CON_PAGINA = EXPERIENCES.filter((e) => e.slug !== null);

export function DeepDiveNav({
  slug,
  lang,
  comun,
  hrefDe,
  disponibles,
}: {
  slug: string;
  lang: Locale;
  comun: TrayectoriaComunDict;
  /** Ruta de una experiencia, ya con el locale resuelto. */
  hrefDe: (slug: string) => string;
  /**
   * Los slugs que HOY tienen página. Mientras el deep-dive se construye, una
   * vecina puede no existir todavía: entonces se dibuja apagada y con su
   * etiqueta, que es el mismo estado que ya usan las hermanas del sistema cuando
   * una página no existe — no un enlace roto.
   */
  disponibles: readonly string[];
}) {
  const i = CON_PAGINA.findIndex((e) => e.slug === slug);
  if (i === -1) return null;

  // La ANTERIOR va primero y apunta hacia atrás; la siguiente, después y hacia
  // delante. Con las dos en pantalla queda el patrón de paginación de siempre
  // —`[← anterior]` y `[siguiente →]`— y la dirección se lee sin el rótulo.
  const vecinas = [
    {
      exp: CON_PAGINA[i + 1],
      kicker: comun.nav.anterior,
      direction: "back" as const,
    },
    {
      exp: CON_PAGINA[i - 1],
      kicker: comun.nav.siguiente,
      direction: "forward" as const,
    },
  ];

  const items: CloserItem[] = vecinas.flatMap(({ exp, kicker, direction }) => {
    if (!exp?.slug) return [];
    const fila = factsOf(lang, exp.company);
    const existe = disponibles.includes(exp.slug);
    return [
      {
        key: exp.slug,
        kicker,
        direction,
        name: exp.company,
        desc: `${fila.role} · ${fila.period}`,
        ...(existe
          ? { href: hrefDe(exp.slug) }
          : { badge: comun.nav.proximamente }),
      },
    ];
  });

  if (items.length === 0) return null;

  return (
    <PageCloser
      eyebrow={comun.nav.eyebrow}
      items={items}
      labelId="deep-dive-nav-label"
    />
  );
}
