/**
 * ¿Una página nueva nace accesible y con su marcado? — `npm run check:marco`.
 *
 * QUÉ PROTEGE. El criterio de cierre de página de `CLAUDE.md` —los 9 puntos de
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
 * Las catorce páginas × dos idiomas se prerenderizan (D45), así que no hace falta ni
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

import { JSDOM } from "jsdom";

import { locales, pagePath, type Locale } from "../lib/i18n/config";
import { PAGE_SLUGS, type PageSlug } from "../lib/routes";
import { DELEGADAS, MINIMO_REGLAS_AXE, revisarConAxe } from "./marco/axe";
import {
  revisarArticulo,
  revisarBreadcrumb,
  revisarEnlaceDeSalto,
  revisarEsqueleto,
  revisarIdioma,
} from "./marco/contenido";
import {
  fallo,
  idsDeclarados,
  idsReferenciados,
  problemas,
  reglasEvaluadas,
  vistos,
  type Pagina,
} from "./marco/estado";
import {
  cruceUsado,
  REFERENCIAS_QUE_CRUZAN,
  revisarJsonLd,
} from "./marco/jsonld";
import {
  revisarCanonical,
  revisarEnlaceArd,
  revisarPermalinks,
  revisarTarjetas,
} from "./marco/metadatos";

/*
 * DÓNDE ESTÁ CADA BLOQUE. Este archivo era de 965 líneas, y desde P72.195 cada
 * familia de comprobaciones vive en su módulo dentro de `scripts/marco/`:
 * `contenido` (lo que pone quien escribe la página), `metadatos` (que la
 * derivación llegó al HTML), `jsonld` (los `@id` y sus cruces) y `axe`, sobre
 * `estado`, que es lo que comparten. Aquí queda el recorrido de las 28 variantes
 * y el informe.
 */

const RAIZ_BUILD = join(".next", "server", "app");
const archivoDe = (lang: Locale, slug: PageSlug) =>
  join(RAIZ_BUILD, `${lang}${slug ? `/${slug}` : ""}.html`);

/** Las 28 variantes, derivadas del registro y de `locales` — ninguna a mano (D72). */
const VARIANTES = locales.flatMap((lang) =>
  PAGE_SLUGS.map((slug) => ({ lang, slug })),
);

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
    revisarArticulo(pagina);
    revisarEnlaceDeSalto(pagina);
    revisarBreadcrumb(pagina);
    revisarCanonical(pagina);
    revisarTarjetas(pagina);
    revisarPermalinks(pagina);
    revisarEnlaceArd(pagina);
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

  // La otra mitad, como en `check:og` (D142): una excepción declarada que ya no
  // ocurre no es inofensiva. Su lista existe para vaciarse, y una entrada muerta
  // tapa el caso siguiente que caiga en el mismo campo.
  REFERENCIAS_QUE_CRUZAN.forEach((r, i) => {
    if (cruceUsado.has(i)) return;
    fallo(
      "todo el sitio",
      `\`REFERENCIAS_QUE_CRUZAN\` declara que \`${r.campo}\` cruza de página en ${r.paginas} ` +
        "y ya no lo hace. Si se le dieron `name` y `url`, quita la entrada: una excepción " +
        "muerta tapa la siguiente.",
    );
  });

  console.log(
    `check:marco — ${VARIANTES.length} variantes del build ${buildId}\n` +
      `  axe        ${reglasEvaluadas.size} reglas evaluadas · ${Object.keys(DELEGADAS).length} delegadas\n` +
      `  a mano     enlace de salto · un h1 y que abra el documento · un main · breadcrumb · canonical y hreflang · OG\n` +
      `  artículos  ${vistos.articulos} variantes cruzadas: og:type=article ⇔ un solo <article>\n` +
      `  tarjetas   ${vistos.tarjetas} \`?card=\` resueltos contra el despacho de \`/api/og\`\n` +
      `  permalinks ${vistos.permalinks} a una línea de un .md del repo, comprobado su ?plain=1\n` +
      `  catálogo   ${vistos.enlacesArd} \`<link rel="ard">\` en el <head>, apuntando al catálogo de agentes\n` +
      `  JSON-LD    ${vistos.bloquesLd} bloques · ${idsDeclarados.size} \`@id\` declarados · ${idsReferenciados.size} referenciados\n` +
      `  cruces     ${vistos.referencias} referencias miradas por página · ${REFERENCIAS_QUE_CRUZAN.length} cruces declarados con motivo\n`,
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
