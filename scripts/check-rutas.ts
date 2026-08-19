/**
 * ¿El registro de páginas dice lo que hay en disco? — `npm run check:rutas`.
 *
 * QUÉ PROTEGE. «Qué páginas tiene este sitio» estaba escrito A MANO en tres
 * sitios —el sitemap, el gate de HTML y `/llms.txt`— y en ninguno fallaba de forma
 * visible: la página no existía para Google, el gate dejaba de cubrirla EN
 * SILENCIO, y no aparecía en el índice para modelos. D59 nombró el problema y
 * arregló solo la mitad del deep-dive; D72 cierra la otra.
 *
 * Ahora la lista es una (`lib/routes.ts`) y este guardián comprueba las dos cosas
 * que un tipo no puede ver:
 *
 *   1. Que el registro CUADRE con `app/[lang]/**\/page.tsx`, que es el único sitio
 *      donde una página existe de verdad. En los dos sentidos: una carpeta sin
 *      registrar, y un slug registrado cuya carpeta ya no está.
 *   2. Que las tres consumidoras sigan LEYENDO de ahí. El tipo impide que una
 *      página nueva se quede sin registrar; no impide que alguien vuelva a
 *      escribir una lista a mano al lado.
 *
 * LO QUE NO COMPRUEBA, dicho para que no se dé por cubierto: que el CONTENIDO de
 * cada consumidora sea el correcto —la prioridad del sitemap, la descripción de
 * `/llms.txt`—. Eso lo garantizan sus `Record` completos, que no compilan
 * incompletos. Aquí se mira la LISTA.
 *
 * Y afirma cuánto ha mirado: cuántas rutas en disco, cuántas en el registro y
 * cuántas consumidoras. Un metro que devuelve una lista vacía parece un aprobado,
 * y este repo ya se lo ha encontrado seis veces — así que falla al mirar cero.
 */
import { readdirSync } from "node:fs";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { DEEP_DIVE_SLUGS, PAGE_SLUGS } from "../lib/routes";

/** La raíz del App Router por locale. Todo lo que hay debajo es una página. */
const RAIZ = join("app", "[lang]");

/**
 * Los segmentos dinámicos que este guardián sabe expandir, y con qué. Si aparece
 * uno que no está aquí, se DICE en vez de ignorarlo: un dinámico desconocido son
 * páginas que nadie está contando, que es exactamente el fallo a evitar.
 */
const DINAMICAS: Record<string, readonly string[]> = {
  "trayectoria/[slug]": DEEP_DIVE_SLUGS,
};

/** Quién más tiene que saber qué páginas hay, y qué se rompe si se le olvida una. */
const CONSUMIDORAS = [
  {
    archivo: "app/sitemap.ts",
    rompe: "la página no existe para Google",
  },
  {
    archivo: "app/llms.txt/route.ts",
    rompe: "la página no existe para un modelo que lea el sitio",
  },
  {
    archivo: "scripts/page-html-diff.ts",
    rompe: "el gate de HTML deja de cubrirla, en silencio",
  },
];

const problemas: string[] = [];
const fallo = (msg: string) => problemas.push(msg);

/** Recorre el árbol de rutas y devuelve un slug por carpeta con `page.tsx`. */
function rutasEnDisco(dir: string, segmentos: string[] = []): string[] {
  const entradas = readdirSync(dir, { withFileTypes: true });
  const encontradas = entradas.some((e) => e.isFile() && e.name === "page.tsx")
    ? [segmentos.join("/")]
    : [];

  for (const e of entradas) {
    if (!e.isDirectory()) continue;
    // Convenciones del App Router que NO son segmentos de URL: `_privadas` y los
    // grupos `(de ruta)`, que agrupan sin aparecer en el path.
    if (e.name.startsWith("_")) continue;
    const hijo = e.name.startsWith("(") ? segmentos : [...segmentos, e.name];
    encontradas.push(...rutasEnDisco(join(dir, e.name), hijo));
  }
  return encontradas;
}

const enDisco = rutasEnDisco(RAIZ).flatMap((ruta) => {
  if (!ruta.includes("[")) return [ruta];
  const expansion = DINAMICAS[ruta];
  if (!expansion) {
    fallo(
      `\`app/[lang]/${ruta}/page.tsx\` es un segmento dinámico que este guardián no sabe expandir. ` +
        `Añádelo a DINAMICAS con la fuente de la que salen sus valores: un dinámico sin expandir son páginas que nadie está contando.`,
    );
    return [];
  }
  return [...expansion];
});

// 1 · El registro cuadra con el disco, en los dos sentidos.
const registro = new Set<string>(PAGE_SLUGS);
const disco = new Set(enDisco);

for (const ruta of disco) {
  if (!registro.has(ruta)) {
    fallo(
      `«${ruta || "(home)"}» tiene página en disco y NO está en STATIC_PAGE_SLUGS de \`lib/routes.ts\`. ` +
        `Mientras no esté: fuera del sitemap, fuera del gate de HTML y fuera de /llms.txt, las tres en silencio.`,
    );
  }
}
for (const ruta of registro) {
  if (!disco.has(ruta)) {
    fallo(
      `«${ruta || "(home)"}» está registrada en \`lib/routes.ts\` y no tiene \`page.tsx\` en \`app/[lang]/\`. ` +
        `O se borró la página y quedó la entrada, o el slug está mal escrito.`,
    );
  }
}

// 2 · Las tres consumidoras siguen leyendo del registro.
let nConsumidoras = 0;
for (const { archivo, rompe } of CONSUMIDORAS) {
  const fuente = readFileSync(archivo, "utf8");
  nConsumidoras++;
  if (!/from ["'][^"']*lib\/routes["']/.test(fuente)) {
    fallo(
      `\`${archivo}\` ya no importa de \`lib/routes\`. Si vuelve a llevar su propia lista de páginas, ${rompe}.`,
    );
  }
}

// El metro afirma cuánto ha mirado (y no al revés).
console.log(
  `check:rutas — ${disco.size} rutas en disco · ${registro.size} en el registro · ${nConsumidoras} consumidoras`,
);

if (disco.size === 0 || nConsumidoras === 0) {
  console.error(
    "\n✗ El guardián no ha mirado nada. Una lista de problemas vacía no es un aprobado: " +
      `revisa que \`${RAIZ}\` siga siendo la raíz del App Router.`,
  );
  process.exit(1);
}

if (problemas.length) {
  console.error(`\n✗ ${problemas.length} problema(s):\n`);
  for (const p of problemas) console.error(`  · ${p}\n`);
  process.exit(1);
}

console.log(
  "✓ El registro de páginas, el disco y sus tres consumidoras cuadran.",
);
