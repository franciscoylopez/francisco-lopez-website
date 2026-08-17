import type { TrayectoriaComunDict } from "@/app/[lang]/dictionaries";
import { EXPERIENCES } from "@/content/experiences";

import { PageCloser, type CloserItem } from "@/components/ui/page-closer";
import type { TrayectoriaDict } from "./trayectoria";

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
// Y EL COPY DE CADA TARJETA NO SE DUPLICA. El rol y el periodo salen de la MISMA
// rama del diccionario que los pinta en Trayectoria, unidos por `company` — la
// clave de este proyecto desde que existe el CV. Escribirlos aquí habría sido la
// cuarta copia del mismo hecho, que es justo lo que P48.5 está abierta para
// arreglar: no tiene sentido crear el problema en la tarea de al lado.

/** Las experiencias que tienen página, en el orden canónico. */
const CON_PAGINA = EXPERIENCES.filter((e) => e.slug !== null);

/**
 * La fila de Trayectoria de una experiencia. Une por prefijo, igual que
 * `experienceOf` y que el CV, y **lanza** si no hay match: mejor romper la build
 * que enseñar el rol de otra empresa.
 */
function filaDe(tray: TrayectoriaDict, company: string) {
  const hit = [...tray.producto, ...tray.nested].find(
    (r) => r.company === company || r.company.startsWith(company),
  );
  if (!hit) {
    throw new Error(
      `Deep-dive: no encuentro la fila de "${company}" en el diccionario de Trayectoria. ` +
        `¿Se renombró una empresa en un sitio y no en el otro?`,
    );
  }
  return hit;
}

export function DeepDiveNav({
  slug,
  tray,
  comun,
  hrefDe,
  disponibles,
}: {
  slug: string;
  tray: TrayectoriaDict;
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
    const fila = filaDe(tray, exp.company);
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
