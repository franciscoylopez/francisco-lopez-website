/**
 * ¿Enlaza el COPY a alguna ruta que el registro ya no publica? — la sexta
 * consumidora de `lib/routes.ts`, que hasta hoy no vigilaba nadie.
 *
 * EL HUECO QUE CIERRA, Y CÓMO SE ENCONTRÓ. El día después de que P72.56 tradujera
 * los slugs ingleses, el artículo en inglés seguía enlazando TRES veces a
 * `/en/accesibilidad`. No estaba roto —`next.config.ts` deriva su 308 del mismo
 * registro— pero la página se enlazaba a sí misma a través de una redirección, su
 * gemelo español apuntaba al canónico, y el espejo `public/md/` le servía la ruta
 * vieja a los agentes. Ningún gate podía verlo: `check:enlaces` mira solo las URLs
 * EXTERNAS, `check:marco` mira estructura, y las dos mitades de `check:rutas`
 * miran el registro contra el disco. El copy era la única consumidora sin red.
 *
 * DÓNDE MIRA, Y POR QUÉ SOLO AHÍ. En el COPY —los diccionarios y `content/`—, que
 * es la superficie SIN TIPO. Los enlaces que escriben los componentes salen de
 * `pagePath`, así que el compilador ya los muda solo; una cadena dentro de un JSON
 * no la muda nadie.
 *
 * Y SE NIEGA A APROBAR POR DESCONOCIMIENTO. Un enlace se salta solo si empieza por
 * un prefijo declarado abajo o si tiene extensión de archivo. Todo lo demás que no
 * esté en el registro FALLA, aunque sea un destino nuevo y legítimo: lo que no es
 * una página se escribe aquí, no se adivina. Es la diferencia entre una lista de
 * excepciones y un filtro que se traga lo que no reconoce.
 *
 * VIVE APARTE DE `check-rutas.ts` por la misma razón que `scripts/tablero/reglas.ts`:
 * el guardián que lo llama ya tenía su complejidad justa, y meter esto dentro lo
 * puso rojo en `check:deuda` a la primera. Aquí es una función que devuelve
 * problemas, sin E/S de informe ni `process.exit`.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

import { locales, pagePath } from "../../lib/i18n/config";
import { PAGE_SLUGS } from "../../lib/routes";

/** Dónde vive el copy: lo que se escribe a mano y no pasa por el tipo. */
export const COPY = ["app/[lang]/dictionaries", "content"];

/** Lo que empieza por `/` y NO es una página, con lo que es cada prefijo. */
const NO_SON_PAGINA = [
  "/img/", // fotos y logos
  "/video/", // la apertura de Sobre mí
  "/cv/", // los dos PDF
  "/og/", // las tarjetas sociales
  "/logo-kit/", // los binarios del kit de marca
  "/fonts/",
  "/md/", // el espejo markdown, que tiene su propio gate
  "/api/",
  "/_next/",
  "/.well-known/",
];

/**
 * Las dos formas en que el copy escribe una ruta: el enlace markdown `](/x)` y el
 * valor JSON que es ENTERO una ruta. Buscar cualquier `/` suelto metería la prosa
 * dentro («24/7», «ES/EN»), que es ruido y no cobertura.
 */
const ENLACE_MD = /\]\((\/[^)\s]*)\)/g;
const VALOR_RUTA = /"(\/[A-Za-z0-9_\-/.]*)"/g;

/** Las rutas públicas de verdad, derivadas: una por página y locale. */
function rutasPublicas(): Set<string> {
  const publicas = new Set<string>();
  for (const slug of PAGE_SLUGS) {
    for (const lang of locales) publicas.add(pagePath(lang, slug));
  }
  return publicas;
}

/** Todo archivo de texto bajo un directorio de copy. */
function archivosDeCopy(dir: string): string[] {
  const salida: string[] = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const ruta = join(dir, e.name);
    if (e.isDirectory()) salida.push(...archivosDeCopy(ruta));
    else if (/\.(json|md|ts|tsx)$/.test(e.name)) salida.push(ruta);
  }
  return salida;
}

/** Una ruta escrita en el copy, con el archivo donde está. */
type Escrita = { archivo: string; cruda: string };

/** Toda ruta que el copy escribe, en plano. */
function rutasEscritas(archivos: string[]): Escrita[] {
  return archivos.flatMap((archivo) => {
    const fuente = readFileSync(archivo, "utf8");
    const matches = [
      ...fuente.matchAll(ENLACE_MD),
      ...fuente.matchAll(VALOR_RUTA),
    ];
    return matches.map((m) => ({ archivo, cruda: m[1]! }));
  });
}

/** Lo que este guardián ha mirado y lo que ha encontrado. */
export type Revision = {
  problemas: string[];
  nEnlaces: number;
  nArchivos: number;
};

export function revisaEnlacesDeCopy(): Revision {
  const problemas: string[] = [];
  const archivos: string[] = [];

  for (const dir of COPY) {
    if (statSync(dir, { throwIfNoEntry: false })?.isDirectory()) {
      archivos.push(...archivosDeCopy(dir));
      continue;
    }
    problemas.push(
      `«${dir}» no existe o no es un directorio, así que el copy no se ha mirado. ` +
        `O se ha movido y hay que actualizar COPY, o este guardián está aprobando por vacío.`,
    );
  }

  const publicas = rutasPublicas();
  let nEnlaces = 0;

  for (const { archivo, cruda } of rutasEscritas(archivos)) {
    if (NO_SON_PAGINA.some((p) => cruda.startsWith(p))) continue;
    // El ancla y la query son del destino, no otro destino.
    const ruta = cruda.replace(/[#?].*$/, "").replace(/\/$/, "") || "/";
    if (/\.[a-z0-9]{2,4}$/i.test(ruta)) continue;
    nEnlaces++;
    if (publicas.has(ruta)) continue;
    problemas.push(
      `«${archivo}» enlaza a «${cruda}», que no es ninguna ruta pública del registro. ` +
        `Si es una página, va con el slug PÚBLICO de su idioma (el que da \`pagePath\`); ` +
        `si no lo es, su prefijo va en NO_SON_PAGINA. El caso que escribió esto: tras ` +
        `traducir un slug, el copy inglés se quedó enlazando al viejo y solo lo salvaba un 308.`,
    );
  }

  return { problemas, nEnlaces, nArchivos: archivos.length };
}
