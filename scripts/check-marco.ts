/**
 * ¿Una página nueva nace accesible y con su marcado? — `npm run check:marco`.
 *
 * QUÉ PROTEGE. El criterio de cierre de página de `CLAUDE.md` —los 8 puntos de
 * accesibilidad, el enlace de salto, el SEO y su JSON-LD— se cumplía A MANO y
 * dependía de acordarse. Es el patrón que `BRAND.md` §Cómo se escribe una regla
 * nombra como el que produce drift: «una regla que hay que recordar es una regla
 * que se incumple».
 *
 * QUÉ MIRA, Y POR QUÉ JUSTO ESO. La mitad de la lista ya no se puede romper:
 * `pageMetadata` deriva canonical, `hreflang`, OG y Twitter; `PageShell` pone el
 * `<main>`, el enlace de salto y el breadcrumb; `check:rutas` (D72) cubre el
 * registro. Automatizar eso sería automatizar algo que debería ser imposible de
 * romper — el mismo argumento con el que esta tarea se puso DETRÁS de D45.
 *
 * Lo que queda, y es lo que hay aquí, son las dos cosas que un helper no puede
 * garantizar:
 *
 *   1. **Lo que pone quien ESCRIBE la página** — los puntos 4, 5 y 8 del
 *      checklist (un solo `h1` y jerarquía sin saltos, breadcrumb, alternativas
 *      textuales), más todo lo estructural que axe sabe ver sin pintar.
 *   2. **Que la derivación LLEGÓ a la página.** Los helpers son opt-in: una
 *      página que se escriba su propia metadata a mano compila igual. Aquí se
 *      mira el HTML servido, que es el único sitio donde eso se nota.
 *
 * Y una que ningún validador externo hace: **resolver las referencias `@id`**
 * entre páginas. El Schema Markup Validator y la Rich Results Test validan cada
 * bloque por separado, así que un `@id` colgando —el `author` de los cinco
 * deep-dive apunta al `Person` que solo declara la home— les sale verde y no
 * significa nada. Está dicho en `lib/structured-data.ts`, en el párrafo que
 * explica por qué `isPartOf` NO está: «un identificador que ningún nodo declara.
 * Valida igual […] y no significa nada». Esto lo comprueba de verdad.
 *
 * LO QUE NO MIRA, dicho para que no se dé por cubierto:
 *
 * - **Contraste, objetivo táctil, foco visible y `reduced-motion`.** Necesitan
 *   layout y tema, o sea navegador de verdad: los cubre el subagente
 *   `viewport-verifier` (D52). Y no es una renuncia: esos cuatro puntos se
 *   HEREDAN de la capa de componentes, y solo se vuelven a medir cuando entra un
 *   par de color nuevo (`CLAUDE.md` §Qué compra esto).
 * - **Lo que no incumple ninguna regla** — un `Esc` que no cierra, un cambio de
 *   tema que no se anuncia. Eso es la pasada con lector de pantalla (D73).
 * - **Nada codificado solo por color** (punto 6). No hay forma automática.
 *
 * DE DÓNDE SALE EL HTML: de `.next/server/app/**.html`, o sea del propio build.
 * Las trece páginas × dos idiomas se prerenderizan (D45), así que no hace falta ni
 * servidor ni navegador y el paso cuesta segundos — que es lo que permite que
 * corra en CADA PR en vez de ser un nightly. En CI va justo detrás de `Build`,
 * así que mide el HTML de ese commit; en local mide el del último `npm run build`
 * y por eso el informe dice de qué build habla.
 *
 * Y afirma cuánto ha mirado —variantes, reglas de axe EVALUADAS y bloques de
 * JSON-LD— porque un metro que devuelve una lista vacía parece un aprobado, y
 * este repo se lo ha encontrado seis veces (D70). Falla al mirar de menos.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import type { AxeResults, RunOptions } from "axe-core";
import { JSDOM, type DOMWindow } from "jsdom";

import { locales, pagePath, type Locale } from "../lib/i18n/config";
import { PAGE_SLUGS, type PageSlug } from "../lib/routes";

/**
 * Dónde deja Next el HTML prerenderizado. Es una ruta INTERNA suya, así que si
 * un día cambia, este guardián no encuentra los archivos y lo dice: la única
 * salida que no vale es seguir en verde mirando cero variantes.
 *
 * El slug de disco NO es `pagePath`: ahí el español va sin prefijo porque el
 * `proxy.ts` reescribe `/` a `/es`, y el prerender vive bajo `/es` igual que el
 * inglés bajo `/en`.
 */
const RAIZ_BUILD = join(".next", "server", "app");
const archivoDe = (lang: Locale, slug: PageSlug) =>
  join(RAIZ_BUILD, `${lang}${slug ? `/${slug}` : ""}.html`);

/** Las 24 variantes, derivadas del registro y de `locales` — ninguna a mano (D72). */
const VARIANTES = locales.flatMap((lang) =>
  PAGE_SLUGS.map((slug) => ({ lang, slug })),
);

/**
 * Reglas de axe que en jsdom no significan nada, con QUIÉN las cubre. Se
 * desactivan por nombre y se publican en el informe: una regla silenciada sin
 * decirlo es media medición que parece entera.
 *
 * Las dos primeras familias necesitan pintar (color compuesto, caja medida). Las
 * dos últimas dan «error-occurred» en jsdom —comprobado, no supuesto— y por eso
 * se comprueban A MANO aquí abajo, que además es lo que pide el punto 4 del
 * checklist.
 */
const DELEGADAS: Record<string, string> = {
  "color-contrast": "necesita pintar → viewport-verifier (D52)",
  "color-contrast-enhanced": "necesita pintar → viewport-verifier (D52)",
  "link-in-text-block": "necesita pintar → viewport-verifier (D52)",
  "target-size": "necesita layout → viewport-verifier (D52)",
  "scrollable-region-focusable": "necesita layout → viewport-verifier (D52)",
  "landmark-one-main": "no concluye en jsdom → se comprueba a mano aquí",
  "page-has-heading-one": "no concluye en jsdom → se comprueba a mano aquí",
};

/**
 * Suelos del metro. No son objetivos: son la línea por debajo de la cual el
 * informe está describiendo otra cosa —un build vacío, un axe que no arrancó, un
 * selector que dejó de casar— y hay que mirarlo en vez de leer el ✓.
 */
const MINIMO_REGLAS_AXE = 25;

/** El destino del enlace de salto. La constante vive en el componente (P43). */
const MAIN_ID = "main";

/**
 * Qué se considera «lo primero que recibe el foco». Sin `iframe` a propósito: el
 * único del sitio es el de `<noscript>` de GTM, que con scripts activos no está
 * en el DOM y sin ellos no se ve.
 */
const FOCUSABLES =
  'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';

const problemas: string[] = [];

/** Un problema, siempre con la variante delante: el informe se lee sin abrir nada. */
const fallo = (variante: string, msg: string) =>
  problemas.push(`${variante}: ${msg}`);

// El código de axe se inyecta DENTRO del realm de jsdom en vez de importarlo
// aquí: axe se cuelga del `window` que encuentra, y el de este proceso no es el
// de la página. Es el patrón que documenta el propio axe para jsdom.
const AXE_SOURCE = readFileSync(require.resolve("axe-core"), "utf8");

const OPCIONES_AXE: RunOptions = {
  rules: Object.fromEntries(
    Object.keys(DELEGADAS).map((id) => [id, { enabled: false }]),
  ),
};

/** Las reglas que de verdad han llegado a evaluarse, sumadas de todas las variantes. */
const reglasEvaluadas = new Set<string>();
/** Los `@id` que alguien DECLARA y los que alguien REFERENCIA, en todo el sitio. */
const idsDeclarados = new Set<string>();
const idsReferenciados = new Map<string, string>();
let bloquesLd = 0;

/**
 * Recorre un JSON-LD y separa las dos formas de usar un `@id`: un objeto que solo
 * lleva `@id` es una REFERENCIA («este autor es aquella persona»); uno que además
 * trae campos es una DECLARACIÓN. Es lo que permite detectar el identificador que
 * nadie declara, que ningún validador de esquema resuelve.
 */
function recorrerIds(nodo: unknown, variante: string): void {
  if (Array.isArray(nodo)) {
    for (const hijo of nodo) recorrerIds(hijo, variante);
    return;
  }
  if (typeof nodo !== "object" || nodo === null) return;

  const obj = nodo as Record<string, unknown>;
  const id = obj["@id"];
  if (typeof id === "string") {
    const soloReferencia = Object.keys(obj).length === 1;
    if (soloReferencia) {
      if (!idsReferenciados.has(id)) idsReferenciados.set(id, variante);
    } else {
      idsDeclarados.add(id);
    }
  }
  for (const valor of Object.values(obj)) recorrerIds(valor, variante);
}

/** Los `@type` de un bloque, que puede ser un objeto, un array o un `@graph`. */
function tiposDe(dato: unknown): string[] {
  if (Array.isArray(dato)) return dato.flatMap(tiposDe);
  if (typeof dato !== "object" || dato === null) return [];
  const obj = dato as Record<string, unknown>;
  const propio = typeof obj["@type"] === "string" ? [obj["@type"]] : [];
  return [...propio, ...tiposDe(obj["@graph"])];
}

/** El `pathname` de una URL absoluta, o `null` si no lo es. */
function ruta(href: string | null | undefined): string | null {
  if (!href) return null;
  try {
    return new URL(href).pathname.replace(/(.)\/$/, "$1");
  } catch {
    return null;
  }
}

/**
 * Todo lo que una comprobación necesita saber de la página que está mirando. Va
 * entero en vez de cuatro parámetros sueltos porque casi todas usan casi todo, y
 * `esperada` va DENTRO y no se recalcula en cada una: es la ruta contra la que se
 * contrastan el canonical, los `hreflang` y el `og:url`, y son justo los tres que
 * no pueden decir cosas distintas.
 */
type Pagina = {
  variante: string;
  doc: Document;
  lang: Locale;
  slug: PageSlug;
  /** Toda la que no es la home: lleva breadcrumb visible y `BreadcrumbList`. */
  esInterna: boolean;
  /** La ruta que le toca a esta variante, según `pagePath` (D2). */
  esperada: string;
};

/** El idioma declarado y los dos textos que ve un buscador. */
function revisarIdioma({ doc, variante, lang }: Pagina): void {
  if (doc.documentElement.lang !== lang) {
    fallo(
      variante,
      `\`<html lang>\` dice «${doc.documentElement.lang}» y esta variante es «${lang}».`,
    );
  }
  if (!doc.title.trim()) fallo(variante, "no tiene `<title>`.");
  const descripcion = doc
    .querySelector('meta[name="description"]')
    ?.getAttribute("content");
  if (!descripcion?.trim()) {
    fallo(variante, "no tiene `<meta name=description>`.");
  }
}

/**
 * Un `<main>` y un solo `h1` (checklist 4). Son las dos reglas que axe no
 * concluye en jsdom, así que se miran aquí.
 *
 * La jerarquía sin saltos NO está: es la regla `heading-order` de axe, que sí
 * evalúa. Duplicarla sería tener dos verdades.
 */
function revisarEsqueleto({ doc, variante }: Pagina): void {
  const mains = doc.querySelectorAll("main");
  if (mains.length !== 1) {
    fallo(variante, `tiene ${mains.length} \`<main>\`, y tiene que haber uno.`);
  }
  const h1s = doc.querySelectorAll("h1");
  if (h1s.length !== 1) {
    fallo(
      variante,
      `tiene ${h1s.length} \`<h1>\`, y tiene que haber uno (checklist 4).`,
    );
  } else if (!h1s[0]!.textContent?.trim()) {
    fallo(variante, "el `<h1>` está vacío.");
  }
}

/**
 * El enlace de salto — WCAG 2.4.1, nivel A (D46).
 *
 * axe NO lo ve: su regla `bypass` se da por satisfecha con los landmarks, que
 * este sitio tiene. Su ausencia fue el único incumplimiento de nivel A que el
 * sitio ha tenido, y ninguna auditoría automática lo encontró.
 */
function revisarEnlaceDeSalto({ doc, variante }: Pagina): void {
  const primero = doc.querySelector(FOCUSABLES);
  const destino = doc.getElementById(MAIN_ID);

  if (!primero || primero.getAttribute("href") !== `#${MAIN_ID}`) {
    const quien = primero
      ? `\`<${primero.tagName.toLowerCase()}>\` «${primero.textContent?.trim().slice(0, 40) ?? ""}»` +
        ` → ${primero.getAttribute("href") ?? "(sin href)"}`
      : "no hay ningún elemento enfocable";
    fallo(
      variante,
      "lo primero que recibe el foco no es el enlace de salto (WCAG 2.4.1, nivel A): " +
        `es ${quien}. axe NO lo detecta —su regla \`bypass\` se conforma con los landmarks—, ` +
        "así que si esto no lo ve, no lo ve nadie.",
    );
  } else if (!primero.textContent?.trim()) {
    fallo(variante, "el enlace de salto no tiene texto.");
  }

  if (!destino) {
    fallo(
      variante,
      `el enlace de salto apunta a \`#${MAIN_ID}\` y no hay ningún elemento con ese id.`,
    );
  } else if (destino.tagName !== "MAIN") {
    fallo(
      variante,
      `\`#${MAIN_ID}\` es un \`<${destino.tagName.toLowerCase()}>\` y tiene que ser el \`<main>\`.`,
    );
  } else if (destino.getAttribute("tabindex") !== "-1") {
    fallo(
      variante,
      "el `<main>` no lleva `tabindex=-1`, así que el foco no aterriza al saltar.",
    );
  }
}

/** Breadcrumb en toda página interna (checklist 5). */
function revisarBreadcrumb({ doc, variante, esInterna }: Pagina): void {
  if (!esInterna) return;
  const nav = [...doc.querySelectorAll("nav[aria-label]")].find((n) =>
    n.querySelector('ol [aria-current="page"]'),
  );
  if (!nav) {
    fallo(
      variante,
      "no tiene breadcrumb: hace falta `<nav aria-label>` con una lista ordenada y " +
        '`aria-current="page"` en el nivel actual (checklist 5).',
    );
  }
}

/**
 * Canonical y los tres `hreflang`. No se comprueba el helper, que es correcto por
 * construcción: se comprueba que la página PASÓ por él, porque escribirse la
 * metadata a mano compila igual (D45).
 */
function revisarCanonical({ doc, variante, slug, esperada }: Pagina): void {
  const canonicals = doc.querySelectorAll('link[rel="canonical"]');
  if (canonicals.length !== 1) {
    fallo(
      variante,
      `tiene ${canonicals.length} \`canonical\` y tiene que haber uno.`,
    );
  } else if (ruta(canonicals[0]!.getAttribute("href")) !== esperada) {
    fallo(
      variante,
      `el canonical apunta a «${canonicals[0]!.getAttribute("href")}» y esta variante es «${esperada}».`,
    );
  }

  const alternos = new Map(
    [...doc.querySelectorAll("link[rel=alternate][hreflang]")].map((l) => [
      l.getAttribute("hreflang")!,
      ruta(l.getAttribute("href")),
    ]),
  );
  const esperados: Record<string, string> = {
    ...Object.fromEntries(locales.map((l) => [l, pagePath(l, slug)])),
    "x-default": pagePath("es", slug),
  };
  for (const [clave, destino] of Object.entries(esperados)) {
    if (!alternos.has(clave)) {
      fallo(variante, `le falta el \`hreflang="${clave}"\`.`);
    } else if (alternos.get(clave) !== destino) {
      fallo(
        variante,
        `el \`hreflang="${clave}"\` apunta a «${alternos.get(clave)}» en vez de a «${destino}».`,
      );
    }
  }
}

/** Lo que se ve cuando alguien comparte el enlace: OG y Twitter. */
function revisarTarjetas({ doc, variante, lang, esperada }: Pagina): void {
  const meta = (sel: string) =>
    doc.querySelector(sel)?.getAttribute("content")?.trim() ?? "";
  const OG: [string, string][] = [
    ["og:title", meta('meta[property="og:title"]')],
    ["og:description", meta('meta[property="og:description"]')],
    ["og:type", meta('meta[property="og:type"]')],
    ["og:url", meta('meta[property="og:url"]')],
    ["og:image", meta('meta[property="og:image"]')],
    ["twitter:card", meta('meta[name="twitter:card"]')],
    ["twitter:image", meta('meta[name="twitter:image"]')],
  ];
  for (const [nombre, valor] of OG) {
    if (!valor) fallo(variante, `le falta \`${nombre}\`.`);
  }

  const ogUrl = OG.find(([n]) => n === "og:url")![1];
  if (ogUrl && ruta(ogUrl) !== esperada) {
    fallo(
      variante,
      `el \`og:url\` apunta a «${ogUrl}» y esta variante es «${esperada}».`,
    );
  }
  // La tarjeta OG de la variante EN pidiendo el texto en ES es el fallo que solo
  // ve quien comparte el enlace, y solo después de compartirlo.
  const ogImage = OG.find(([n]) => n === "og:image")![1];
  if (ogImage && !ogImage.includes(`lang=${lang}`)) {
    fallo(
      variante,
      `la tarjeta OG («${ogImage}») no pide el idioma de esta variante (\`lang=${lang}\`).`,
    );
  }
}

/** Los dos invariantes de un `BreadcrumbList`: orden contiguo y el último sin `item`. */
function revisarBreadcrumbLd(
  { variante }: Pagina,
  raiz: Record<string, unknown>,
): void {
  const items = (raiz.itemListElement ?? []) as Record<string, unknown>[];
  const posiciones = items.map((it) => it.position);
  const esperadas = items.map((_, n) => n + 1);
  if (JSON.stringify(posiciones) !== JSON.stringify(esperadas)) {
    fallo(
      variante,
      `las \`position\` del BreadcrumbList son [${posiciones.join(", ")}] y tienen que ser [${esperadas.join(", ")}].`,
    );
  }
  if (items.length > 0 && "item" in items[items.length - 1]!) {
    fallo(
      variante,
      "el último nivel del BreadcrumbList lleva `item`, y Google pide que la página en curso lo omita.",
    );
  }
}

/**
 * JSON-LD: válido, del tipo que le toca, y con sus `@id` apuntados. La
 * RESOLUCIÓN de los `@id` no se hace aquí: es global, y va al final de `main()`.
 */
function revisarJsonLd(pagina: Pagina): void {
  const { doc, variante, esInterna } = pagina;
  const bloques = [
    ...doc.querySelectorAll('script[type="application/ld+json"]'),
  ];
  if (bloques.length === 0) {
    fallo(variante, "no emite ningún bloque JSON-LD.");
  }

  const tipos: string[] = [];
  for (const [i, bloque] of bloques.entries()) {
    let dato: unknown;
    try {
      dato = JSON.parse(bloque.textContent ?? "");
    } catch (e) {
      fallo(
        variante,
        `el bloque JSON-LD ${i + 1} no es JSON válido: ${(e as Error).message}.`,
      );
      continue;
    }
    bloquesLd++;

    const raiz = dato as Record<string, unknown>;
    if (raiz["@context"] !== "https://schema.org") {
      fallo(
        variante,
        `el bloque JSON-LD ${i + 1} no declara \`"@context": "https://schema.org"\`.`,
      );
    }
    const suyos = tiposDe(dato);
    if (suyos.length === 0) {
      fallo(
        variante,
        `el bloque JSON-LD ${i + 1} no declara ningún \`@type\`.`,
      );
    }
    tipos.push(...suyos);
    recorrerIds(dato, variante);

    if (suyos.includes("BreadcrumbList")) revisarBreadcrumbLd(pagina, raiz);
  }

  // La home declara la entidad del sitio; toda interna dice dónde está.
  const obligatorio = esInterna ? "BreadcrumbList" : "ProfilePage";
  if (bloques.length > 0 && !tipos.includes(obligatorio)) {
    fallo(
      variante,
      `no emite ningún \`${obligatorio}\` (emite: ${tipos.join(", ") || "nada"}).`,
    );
  }
}

/** axe, sobre todo lo demás que se puede ver sin pintar. */
async function revisarConAxe(
  { doc, variante }: Pagina,
  ventana: DOMWindow,
): Promise<void> {
  ventana.eval(AXE_SOURCE);
  const resultado: AxeResults = await (
    ventana as unknown as {
      axe: { run: (ctx: Document, o: RunOptions) => Promise<AxeResults> };
    }
  ).axe.run(doc, OPCIONES_AXE);

  for (const r of [...resultado.passes, ...resultado.violations]) {
    reglasEvaluadas.add(r.id);
  }
  for (const v of resultado.violations) {
    const donde = v.nodes
      .slice(0, 3)
      .map((n) => n.target.join(" "))
      .join(" · ");
    fallo(
      variante,
      `axe · ${v.id} (${v.impact}, ${v.nodes.length} nodo(s)): ${v.help}. En ${donde}.`,
    );
  }
}

/**
 * Una variante: abre su HTML y le pasa las ocho comprobaciones, en el orden en
 * que se leería la página. Ninguna corta a la siguiente —todas acumulan en
 * `problemas`— porque un informe que se para en el primer fallo obliga a tantas
 * pasadas como fallos haya.
 */
async function revisar(lang: Locale, slug: PageSlug): Promise<void> {
  const variante = `${lang}${slug ? `/${slug}` : " (home)"}`;
  const archivo = archivoDe(lang, slug);

  if (!existsSync(archivo)) {
    fallo(
      variante,
      `no hay HTML prerenderizado en \`${archivo}\`. O la página dejó de ser estática ` +
        "—y entonces sale de este gate en silencio, que es lo que hay que mirar— o Next " +
        "cambió dónde deja el prerender y hay que actualizar RAIZ_BUILD.",
    );
    return;
  }

  const dom = new JSDOM(readFileSync(archivo, "utf8"), {
    url: `https://franciscolopez.es${pagePath(lang, slug)}`,
    runScripts: "outside-only",
    pretendToBeVisual: true,
  });

  const pagina: Pagina = {
    variante,
    doc: dom.window.document,
    lang,
    slug,
    esInterna: slug !== "",
    esperada: pagePath(lang, slug),
  };

  try {
    revisarIdioma(pagina);
    revisarEsqueleto(pagina);
    revisarEnlaceDeSalto(pagina);
    revisarBreadcrumb(pagina);
    revisarCanonical(pagina);
    revisarTarjetas(pagina);
    revisarJsonLd(pagina);
    await revisarConAxe(pagina, dom.window);
  } finally {
    dom.window.close();
  }
}

async function main() {
  if (!existsSync(RAIZ_BUILD)) {
    console.error(
      `\ncheck:marco — no hay build en \`${RAIZ_BUILD}\`.\n\n` +
        "Este gate mide el HTML que el sitio EMITE, no el código que lo genera, así que\n" +
        "necesita el prerender:\n\n  npm run build\n",
    );
    process.exit(2);
  }

  const buildId = existsSync(join(".next", "BUILD_ID"))
    ? readFileSync(join(".next", "BUILD_ID"), "utf8").trim()
    : "desconocido";

  for (const { lang, slug } of VARIANTES) await revisar(lang, slug);

  // Los `@id` se resuelven al final y CONTRA TODO EL SITIO, no por página: el
  // `Person` lo declara solo la home y lo referencian los cinco deep-dive.
  for (const [id, variante] of idsReferenciados) {
    if (!idsDeclarados.has(id)) {
      fallo(
        variante,
        `el JSON-LD referencia \`@id\` «${id}» y ningún nodo del sitio lo declara. ` +
          "Un validador de esquema no resuelve referencias, así que esto le sale verde y no significa nada.",
      );
    }
  }

  console.log(
    `check:marco — ${VARIANTES.length} variantes del build ${buildId}\n` +
      `  axe        ${reglasEvaluadas.size} reglas evaluadas · ${Object.keys(DELEGADAS).length} delegadas\n` +
      `  a mano     enlace de salto · un h1 · un main · breadcrumb · canonical y hreflang · OG\n` +
      `  JSON-LD    ${bloquesLd} bloques · ${idsDeclarados.size} \`@id\` declarados · ${idsReferenciados.size} referenciados\n`,
  );
  for (const [id, motivo] of Object.entries(DELEGADAS)) {
    console.log(`  delegada   ${id.padEnd(28)} ${motivo}`);
  }

  // El suelo del metro. Un guardián que mira de menos no da un rojo: da un ✓ con
  // menos cobertura detrás, que es peor porque nadie lo lee.
  if (reglasEvaluadas.size < MINIMO_REGLAS_AXE) {
    console.error(
      `\n✗ axe solo ha evaluado ${reglasEvaluadas.size} reglas, y aquí siempre han evaluado ` +
        `${MINIMO_REGLAS_AXE} o más. Algo ha dejado de correr —una versión nueva, un realm que no ` +
        "arranca— y el resto de este informe está describiendo menos sitio del que dice.",
    );
    process.exit(1);
  }

  if (problemas.length) {
    console.error(`\n✗ ${problemas.length} problema(s):\n`);
    for (const p of problemas) console.error(`  · ${p}\n`);
    process.exit(1);
  }

  console.log(
    `\n✓ Las ${VARIANTES.length} variantes tienen enlace de salto, marco accesible y su marcado.`,
  );
}

void main();
