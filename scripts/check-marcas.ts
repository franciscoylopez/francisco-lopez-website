/**
 * Los nombres propios se pintan como no traducibles — `npm run check:marcas`.
 *
 * QUÉ VIGILA. `components/ui/marcas.tsx` declara qué cadenas son nombres propios
 * y envuelve cada aparición en `<span translate="no">`, para que el traductor
 * automático de Chrome no convierta «TheTool» en «La Herramienta» al ofrecerle
 * el español a quien abre `/en`. Como eso no se escribe en el punto de uso, hace
 * falta comprobar que LLEGA: este gate recorre el HTML prerenderizado de las 28
 * variantes y falla nombrando la página y la frase donde un nombre se pintó
 * suelto.
 *
 * BUSCA LA AUSENCIA, NO EL PATRÓN. No cuenta cuántos `translate="no"` hay —eso
 * sube en verde mientras el que falta sigue faltando—: recorre los nodos de
 * TEXTO que el sitio pinta y comprueba, para cada nombre que encuentra, que
 * tiene un ancestro con `translate="no"`. Y publica cuántas variantes ha leído y
 * cuántas apariciones ha inspeccionado, porque una lista vacía se lee igual que
 * un aprobado y en este repo eso ya ha pasado cinco veces.
 *
 * POR QUÉ ESTO SÍ VA EN CI, como `check:figuras` y al revés que el censo: todo
 * lo que necesita está en el prerender. No hay layout que resolver ni color que
 * pintar — es un atributo heredado y un nodo de texto—, así que cuesta segundos.
 *
 * LO QUE NO CUBRE, dicho para que no se dé por cubierto:
 *
 * - **El `<head>`.** El `<title>` y la `description` llevan nombres propios y
 *   Chrome también los traduce, pero ahí no cabe un `<span>`: son texto plano
 *   por contrato. No es un descuido, es que el arreglo no existe en esa capa.
 * - **Los atributos** (`alt`, `aria-label`, `title`). Mismo motivo: un atributo
 *   no admite un elemento dentro.
 * - **El texto dentro de un `<svg>`.** `translate` es un atributo global de HTML
 *   y SVG no lo define, así que marcarlo ahí sería escribir algo que el
 *   navegador no promete respetar. Se CUENTAN y se nombran en cada corrida en
 *   vez de callarlos, que es la mitad de la decisión: un alcance recortado en
 *   silencio se lee como cobertura.
 * - **El JSON-LD**, que no es texto para leer sino datos para un rastreador, y
 *   ningún traductor lo toca.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { JSDOM } from "jsdom";

import { MARCAS } from "../components/ui/marcas";
import { locales } from "../lib/i18n/config";
import { PAGE_SLUGS } from "../lib/routes";

const RAIZ_BUILD = join(".next", "server", "app");

const VARIANTES = locales.flatMap((lang) =>
  PAGE_SLUGS.map((slug) => ({ lang, slug })),
);

/**
 * El mismo criterio que la capa: de más largo a más corto, sensible a
 * mayúsculas y con `\b` a los dos lados. Si este patrón y el de `marcas.tsx`
 * divergieran, el gate mediría otra cosa que la que el sitio pinta — por eso la
 * LISTA se importa del módulo real en vez de copiarse aquí.
 */
const PATRON = new RegExp(
  `\\b(${[...MARCAS]
    .sort((a, b) => b.length - a.length)
    .map((m) => m.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|")})\\b`,
  "g",
);

let fallos = 0;
let variantesLeidas = 0;
let apariciones = 0;
let marcadas = 0;
let enSvg = 0;
const svgPorVariante = new Map<string, Set<string>>();

function fallo(variante: string, mensaje: string) {
  fallos++;
  console.error(`  ✗ ${variante} — ${mensaje}`);
}

/** ¿Este nodo de texto cuelga de algo marcado como no traducible? */
function estaMarcado(nodo: Node): boolean {
  for (let n: Element | null = nodo.parentElement; n; n = n.parentElement) {
    const v = n.getAttribute("translate");
    if (v === "no") return true;
    // `translate="yes"` en medio REACTIVA la traducción para lo que cuelga de
    // ahí. Hoy no se usa; modelarlo cuesta una línea y evita que el gate mienta
    // el día que se use.
    if (v === "yes") return false;
  }
  return false;
}

/** ¿Cuelga de una caja que este gate no juzga (head, script, style, svg)? */
function fueraDeAlcance(nodo: Node): "svg" | "inerte" | null {
  for (let n: Element | null = nodo.parentElement; n; n = n.parentElement) {
    const etiqueta = n.tagName.toLowerCase();
    if (etiqueta === "svg") return "svg";
    if (etiqueta === "script" || etiqueta === "style" || etiqueta === "head") {
      return "inerte";
    }
  }
  return null;
}

/**
 * Un nodo de texto de la página. Va aparte del recorrido porque son dos cosas
 * distintas —abrir la variante y juzgar un nodo—, y juntas eran una sola función
 * que qlty marcaba por complejidad.
 */
function revisarTexto(variante: string, nodo: Node) {
  const texto = nodo.textContent ?? "";
  const encontradas = texto.match(PATRON);
  if (!encontradas) return;

  const fuera = fueraDeAlcance(nodo);
  if (fuera === "inerte") return;
  if (fuera === "svg") {
    enSvg += encontradas.length;
    const set = svgPorVariante.get(variante) ?? new Set<string>();
    for (const m of encontradas) set.add(m);
    svgPorVariante.set(variante, set);
    return;
  }

  apariciones += encontradas.length;
  if (estaMarcado(nodo)) {
    marcadas += encontradas.length;
    return;
  }

  const contexto = texto.trim().replace(/\s+/g, " ").slice(0, 70);
  fallo(
    variante,
    `«${[...new Set(encontradas)].join("», «")}» se pinta sin \`translate="no"\`: ` +
      `«${contexto}${texto.trim().length > 70 ? "…" : ""}» — ese texto no pasa por ` +
      "`Rich` ni por `<Marcas>`.",
  );
}

function revisar(lang: (typeof locales)[number], slug: string) {
  const variante = `${lang}${slug ? `/${slug}` : ""}`;
  // La misma resolución que `check:marco` y `check:figuras`: la home es
  // `es.html`, no `es/index.html`.
  const archivo = join(RAIZ_BUILD, `${lang}${slug ? `/${slug}` : ""}.html`);
  if (!existsSync(archivo)) {
    fallo(
      variante,
      `no hay HTML prerenderizado en \`${archivo}\`. O la página dejó de ser estática ` +
        "—y entonces sale de este gate en silencio, que es lo que hay que mirar— o Next " +
        "cambió dónde deja el prerender.",
    );
    return;
  }
  variantesLeidas++;

  const dom = new JSDOM(readFileSync(archivo, "utf8"));
  const { document, NodeFilter } = dom.window;
  try {
    const paseo = document.createTreeWalker(
      document.documentElement,
      NodeFilter.SHOW_TEXT,
    );
    for (let n = paseo.nextNode(); n; n = paseo.nextNode()) {
      revisarTexto(variante, n);
    }
  } finally {
    dom.window.close();
  }
}

function main() {
  if (!existsSync(RAIZ_BUILD)) {
    console.error(
      `\ncheck:marcas — no hay build en \`${RAIZ_BUILD}\`.\n\n` +
        "Este gate mira el HTML que el sitio EMITE, no el código que lo genera:\n\n  npm run build\n",
    );
    process.exit(2);
  }

  console.log("");
  for (const { lang, slug } of VARIANTES) revisar(lang, slug);

  // Guardas de cero: una lista vacía se lee igual que un aprobado, y este repo
  // se lo ha encontrado cinco veces.
  if (variantesLeidas === 0) {
    console.error(
      "\ncheck:marcas — CERO variantes leídas. El gate no ha mirado nada.\n",
    );
    process.exit(2);
  }
  if (apariciones === 0) {
    console.error(
      `\ncheck:marcas — CERO apariciones encontradas en ${variantesLeidas} variantes.\n\n` +
        "Esto NO es un aprobado: el sitio entero se apoya en estos nombres, así que o el\n" +
        "recorrido dejó de encajar, o `MARCAS` se quedó vacía, o las páginas dejaron de\n" +
        "prerenderizarse.\n",
    );
    process.exit(2);
  }

  if (fallos > 0) {
    console.error(
      `\ncheck:marcas ✗ — ${fallos} ${fallos === 1 ? "texto" : "textos"} con un nombre propio ` +
        `sin marcar, de ${apariciones} apariciones inspeccionadas.\n\n` +
        "El copy no se toca: se pinta con `<Rich>` (prosa del diccionario) o con\n" +
        "`<Marcas>` (un nombre que viene de un dato). Ver `components/ui/marcas.tsx`.\n",
    );
    process.exit(1);
  }

  console.log(
    `check:marcas ✓ — ${marcadas} apariciones de ${MARCAS.length} nombres propios, ` +
      `todas con \`translate="no"\`, en ${variantesLeidas} variantes.`,
  );

  // MEDIDAS Y NO JUZGADAS, con su cifra y una a una: callarlas dejaría el
  // alcance recortado en silencio (misma doctrina que los lienzos desplazados
  // de `check:figuras`).
  if (enSvg > 0) {
    console.log(
      `  · fuera del contrato: ${enSvg} apariciones dentro de un \`<svg>\`. \`translate\` es un ` +
        "atributo global de HTML y SVG no lo define, así que no se marca ahí:",
    );
    for (const [variante, nombres] of [...svgPorVariante].sort((a, b) =>
      a[0].localeCompare(b[0]),
    )) {
      console.log(`      ${variante} — ${[...nombres].sort().join(", ")}`);
    }
  }
  console.log(
    "  · fuera del contrato: el `<head>` (title y description) y los atributos " +
      "(`alt`, `aria-label`), donde no cabe un elemento.",
  );
}

main();
