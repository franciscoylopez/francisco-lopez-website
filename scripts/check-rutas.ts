/**
 * ¿El registro de páginas dice lo que hay en disco? — `npm run check:rutas`.
 *
 * QUÉ PROTEGE. «Qué páginas tiene este sitio» estaba escrito A MANO en CUATRO
 * sitios —el sitemap, el gate de HTML, `/llms.txt` y la unión `Card` de las
 * tarjetas OG— y en ninguno fallaba de forma visible: la página no existía para
 * Google, el gate dejaba de cubrirla EN SILENCIO, no aparecía en el índice para
 * modelos, y se publicaba con la tarjeta de la home. D59 nombró el problema y
 * arregló solo la mitad del deep-dive; D72 cierra la otra.
 *
 * Ahora la lista es una (`lib/routes.ts`) y este guardián comprueba las dos cosas
 * que un tipo no puede ver:
 *
 *   1. Que el registro CUADRE con las carpetas de `app/[lang]/`, que es el único
 *      sitio donde una página existe de verdad. En los dos sentidos: una carpeta
 *      sin registrar, y un slug registrado cuya carpeta ya no está.
 *   2. Que las consumidoras sigan LEYENDO de ahí. El tipo impide que una
 *      página nueva se quede sin registrar; no impide que alguien vuelva a
 *      escribir una lista a mano al lado.
 *
 * LO QUE NO COMPRUEBA, dicho para que no se dé por cubierto. Dos cosas:
 *
 * - **El CONTENIDO de cada consumidora** —la prioridad del sitemap, la descripción
 *   de `/llms.txt`—. Eso lo garantizan sus `Record` completos, que no compilan
 *   incompletos. Aquí se mira la LISTA.
 * - **Que el import se USE.** La comprobación 2 es un proxy: ve que el archivo
 *   importa de `lib/routes`, no que no tenga además una lista propia al lado. Un
 *   proxy honesto es mejor que nada y peor que un tipo — y el tipo ya cubre el caso
 *   que importa, que es olvidar una página. Esto solo vigila la reincidencia.
 *
 * Y afirma cuánto ha mirado, **distinguiendo las dos mitades**, que no son iguales:
 * las estáticas se contrastan contra el disco y las del deep-dive salen de la misma
 * constante en los dos lados. Un metro que devuelve una lista vacía parece un
 * aprobado, y este repo ya se lo ha encontrado seis veces — así que falla al mirar
 * cero.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { DEEP_DIVE_SLUGS, PAGE_SLUGS } from "../lib/routes";

/** La raíz del App Router por locale. Todo lo que hay debajo es una página. */
const RAIZ = join("app", "[lang]");

/**
 * Qué archivo convierte una carpeta en ruta. NO solo `page.tsx`: Next enruta
 * igual `.ts`, `.js`, `.jsx` y `.mdx`. Mirar solo la extensión que este repo usa
 * hoy sería el fallo que este guardián existe para evitar, con otra forma — una
 * carpeta que es ruta de verdad y que él no cuenta.
 */
const ES_PAGE = /^page\.(tsx|ts|jsx|js|mdx)$/;

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
  {
    archivo: "app/api/og/route.tsx",
    rompe:
      "la página se publica con la tarjeta OG de la home, y eso solo lo ve quien comparta el enlace",
  },
];

const problemas: string[] = [];
const fallo = (msg: string) => problemas.push(msg);

/** Recorre el árbol de rutas y devuelve un slug por carpeta con página. */
function rutasEnDisco(dir: string, segmentos: string[] = []): string[] {
  const entradas = readdirSync(dir, { withFileTypes: true });
  const encontradas = entradas.some((e) => e.isFile() && ES_PAGE.test(e.name))
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
        `Mientras no esté: fuera del sitemap, fuera del gate de HTML, fuera de /llms.txt y con la tarjeta OG de la home, las cuatro en silencio.`,
    );
  }
}
for (const ruta of registro) {
  if (!disco.has(ruta)) {
    fallo(
      `«${ruta || "(home)"}» está registrada en \`lib/routes.ts\` y no tiene página en \`app/[lang]/\`. ` +
        `O se borró la página y quedó la entrada, o el slug está mal escrito.`,
    );
  }
}

// 2 · Las consumidoras siguen leyendo del registro.
let nConsumidoras = 0;
for (const { archivo, rompe } of CONSUMIDORAS) {
  nConsumidoras++;
  let fuente: string;
  try {
    fuente = readFileSync(archivo, "utf8");
  } catch {
    // Sin esto moría con un ENOENT pelado, que es un fallo del guardián y no un
    // informe: quien lo lanza vería una traza en vez de qué consumidora falta.
    fallo(
      `«${archivo}» no existe. O se ha movido y hay que actualizar CONSUMIDORAS, o ha desaparecido: ${rompe}.`,
    );
    continue;
  }
  if (!/from ["'][^"']*lib\/routes["']/.test(fuente)) {
    fallo(
      `«${archivo}» ya no importa de \`lib/routes\`. Si vuelve a llevar su propia lista de páginas, ${rompe}.`,
    );
  }
}

// El metro afirma lo que ha comparado DE VERDAD, y las dos mitades no son iguales:
// las estáticas se contrastan contra el disco, y las del deep-dive salen de la
// misma constante en los dos lados de la comparación (`DEEP_DIVE_SLUGS` está dentro
// de `PAGE_SLUGS`), así que ahí no hay dos listas que puedan diferir. Contarlas
// juntas publicaba «12 contra 12» sobre siete comparaciones reales, que es la forma
// fina de aprobar de más.
const nDerivadas = DEEP_DIVE_SLUGS.length;
console.log(
  `check:rutas — ${disco.size - nDerivadas} rutas estáticas contrastadas contra el disco · ` +
    `${nDerivadas} del deep-dive derivadas de EXPERIENCES (no hay dos listas que puedan diferir) · ` +
    `${nConsumidoras} consumidoras`,
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
  `✓ El registro de páginas, el disco y sus ${nConsumidoras} consumidoras cuadran.`,
);
