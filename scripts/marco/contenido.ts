import { fallo, vistos, type Pagina } from "./estado";

/** El destino del enlace de salto. La constante vive en el componente (P43). */
const MAIN_ID = "main";

/**
 * Qué se considera «lo primero que recibe el foco». Sin `iframe` a propósito: el
 * único del sitio es el de `<noscript>` de GTM, que con scripts activos no está
 * en el DOM y sin ellos no se ve.
 */
const FOCUSABLES =
  'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function revisarIdioma({ doc, variante, lang }: Pagina): void {
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
 * Un `<main>`, un solo `h1`, y que el `h1` sea el PRIMER encabezado. Son las
 * reglas que axe no concluye en jsdom, así que se miran aquí.
 *
 * La jerarquía sin saltos NO está: es la regla `heading-order` de axe, que sí
 * evalúa. Duplicarla sería tener dos verdades.
 */
export function revisarEsqueleto({ doc, variante }: Pagina): void {
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

  // Y EL `h1` ES EL PRIMER ENCABEZADO DEL DOCUMENTO, que no es lo mismo que
  // haber uno solo (2026-08-30). El hueco entre las dos reglas es donde cabe un
  // encabezado del CHROME —un diálogo del layout, un aviso— que se cuela por
  // delante del titular de la página: axe no lo señala porque `heading-order`
  // mira saltos hacia ABAJO (h2 → h4) y h2 → h1 baja de nivel, que es legal.
  //
  // No es teórico: el diálogo de preferencias de cookies encabezaba con «h2» las
  // 28 variantes por delante de su propio `h1`, y lo cazó un escáner externo, no
  // los tres guardianes de este repo. Es la regla 1 de `BRAND.md` §Cómo se
  // escribe una regla —un disparador que mira al sitio equivocado no es una
  // regla—, aplicada al metro en vez de a la norma.
  const encabezados = doc.querySelectorAll("h1, h2, h3, h4, h5, h6");
  const primero = encabezados[0];
  if (primero && primero.tagName !== "H1") {
    const texto = primero.textContent?.trim().slice(0, 40) ?? "";
    fallo(
      variante,
      `abre con \`<${primero.tagName.toLowerCase()}>\` («${texto}») por delante del \`<h1>\`. ` +
        "El primer encabezado del documento tiene que ser el `h1` de la página: un título de " +
        "chrome (diálogo, aviso) se escribe con `p` + `aria-labelledby`, que es de donde un " +
        "lector toma el nombre.",
    );
  }
}

/**
 * QUE LAS DOS CAPAS DIGAN LO MISMO: si la metadata declara `og:type=article`, el
 * contenido tiene que servirse dentro de un `<article>`, y solo entonces (P67.6).
 *
 * POR QUÉ ESTA INVARIANTE Y NO OTRA. La forma natural era mirar el `@type` del
 * JSON-LD, pero de las seis páginas que son artículos solo `/como-se-ha-creado`
 * declara la familia `Article`: las cinco del deep-dive declaran `WebPage`, que
 * es correcto y no se toca. El `og:type` sí cubre las seis exactas, ya viaja en
 * el prerender y lo pone `pageMetadata`, así que aquí no hay lista de páginas
 * que mantener — la misma razón por la que el breadcrumb se deriva y no se
 * escribe.
 *
 * SE MIRA EN LOS DOS SENTIDOS. Sin la vuelta, envolver media página de más en un
 * `<article>` pasaría igual de verde, y `<article>` significa «contenido
 * autónomo y redistribuible»: repartido por una página que no lo es, deja de
 * decir nada. Por eso también se exige que sea UNO.
 */
export function revisarArticulo({ doc, variante }: Pagina): void {
  const esArticulo =
    doc
      .querySelector('meta[property="og:type"]')
      ?.getAttribute("content")
      ?.trim() === "article";
  const articles = doc.querySelectorAll("article");
  vistos.articulos++;

  if (esArticulo && articles.length !== 1) {
    fallo(
      variante,
      `declara \`og:type=article\` y tiene ${articles.length} \`<article>\`, y tiene que haber uno. ` +
        "El marcado semántico y la metadata están diciendo cosas distintas de la misma página; " +
        "lo pone `<PageShell article>`.",
    );
  }
  if (!esArticulo && articles.length > 0) {
    fallo(
      variante,
      `tiene ${articles.length} \`<article>\` y no declara \`og:type=article\`. ` +
        "O la página es un artículo y le falta el `ogType`, o ese `<article>` está afirmando " +
        "que un trozo de página es contenido autónomo y redistribuible cuando no lo es.",
    );
  }
}

/**
 * El enlace de salto — WCAG 2.4.1, nivel A (D46).
 *
 * axe NO lo ve: su regla `bypass` se da por satisfecha con los landmarks, que
 * este sitio tiene. Su ausencia fue el único incumplimiento de nivel A que el
 * sitio ha tenido, y ninguna auditoría automática lo encontró.
 */
export function revisarEnlaceDeSalto({ doc, variante }: Pagina): void {
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
export function revisarBreadcrumb({ doc, variante, esInterna }: Pagina): void {
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
 * Dos enlaces con el MISMO nombre accesible y distinto destino, en la misma
 * página (WCAG 2.4.9 / 3.2.4).
 *
 * POR QUÉ AQUÍ Y NO EN UN SCRIPT NUEVO. `check:marco` ya abre las 28 variantes
 * con jsdom, así que esto cuesta cero: un `npm run` más habría sido un paso de CI
 * más para recorrer otra vez lo que ya está abierto.
 *
 * POR QUÉ HACE FALTA. Ninguna herramienta de aquí lo ve: axe tiene
 * `identical-links-same-purpose` como «needs review» y no como violación, así que
 * el barrido de axe de esta misma corrida lo pasa por alto; y no es color ni
 * contraste, así que el censo tampoco. La tarea que lo abrió (2026-09-03) barrió
 * el sitio a mano y encontró **16 pares ambiguos en cuatro patrones distintos** —
 * los roles de Trayectoria, las regletas del artículo, los demos del Design System
 * y un fallo de locale en el diccionario EN—. Al cuarto patrón esto deja de ser
 * una ronda de arreglos.
 *
 * EL NOMBRE ACCESIBLE, en el orden en que lo calcula un lector de pantalla:
 * `aria-label`, si no el texto, si no el `alt` de las imágenes que contiene.
 */
const PARES_DECLARADOS: readonly {
  /** El nombre accesible, en minúsculas, tal y como agrupa el guardián. */
  nombre: string;
  /** Los destinos que comparten ese nombre a propósito, ordenados. */
  destinos: readonly string[];
  motivo: string;
}[] = [
  {
    nombre: "privacidad y cookies",
    destinos: ["/cookies", "/cookies#privacidad"],
    motivo:
      "mismo destino y mismo propósito: solo cambia dónde aterriza. El del formulario de Contacto salta al apartado que le toca; el del pie, a la página entera",
  },
  {
    nombre: "privacy and cookies",
    destinos: ["/en/cookies", "/en/cookies#privacidad"],
    motivo: "el mismo par, en inglés",
  },
];

/** Qué pares declarados se han usado de verdad, para poder retirar los muertos. */
const pareUsado = new Set<number>();

/** El nombre accesible de un enlace, o «» si no tiene ninguno. */
function nombreAccesible(a: Element): string {
  const aria = a.getAttribute("aria-label")?.trim();
  if (aria) return aria;
  const texto = (a.textContent ?? "").replace(/\s+/g, " ").trim();
  if (texto) return texto;
  return [...a.querySelectorAll("img[alt]")]
    .map((i) => i.getAttribute("alt") ?? "")
    .join(" ")
    .trim();
}

export function revisarNombresDeEnlace({ doc, variante }: Pagina): void {
  const grupos = new Map<string, Map<string, string>>();

  for (const a of doc.querySelectorAll("a[href]")) {
    // Lo que un lector de pantalla no anuncia no puede ser ambiguo para él.
    if (a.getAttribute("aria-hidden") === "true") continue;
    if (a.closest('[aria-hidden="true"]')) continue;
    const nombre = nombreAccesible(a);
    if (!nombre) continue;
    vistos.enlacesConNombre++;
    const clave = nombre.toLowerCase();
    if (!grupos.has(clave)) grupos.set(clave, new Map());
    grupos.get(clave)!.set(a.getAttribute("href") ?? "", nombre);
  }

  for (const [clave, destinos] of grupos) {
    if (destinos.size < 2) continue;

    // UN PAR DECLARADO SE COMPARA POR SUS DESTINOS, no solo por su nombre: si
    // aparece un tercer enlace que se llama igual, la excepción deja de cubrirlo
    // y tiene que volver a salir. Y NO se ignoran los anclajes en general: dos
    // anclas distintas de la misma página sí pueden ser dos propósitos.
    const rutas = [...destinos.keys()].sort();
    const i = PARES_DECLARADOS.findIndex(
      (p) =>
        p.nombre === clave &&
        p.destinos.length === rutas.length &&
        p.destinos.every((d, n) => d === rutas[n]),
    );
    if (i !== -1) {
      pareUsado.add(i);
      continue;
    }

    fallo(
      variante,
      `«${[...destinos.values()][0]}» nombra ${destinos.size} destinos distintos ` +
        `(${rutas.map((r) => `\`${r}\``).join(" · ")}). Fuera de contexto suenan iguales, ` +
        "así que o se desambigua el nombre (`aria-label`), o el par se declara con su " +
        "motivo en `PARES_DECLARADOS` de `scripts/marco/contenido.ts`.",
    );
  }
}

/** Los pares declarados que ya nadie usa: una excepción muerta tapa la siguiente. */
export function paresDeclaradosSinUsar(): string[] {
  return PARES_DECLARADOS.filter((_, i) => !pareUsado.has(i)).map(
    (p) =>
      `\`PARES_DECLARADOS\` declara que «${p.nombre}» comparte nombre en ` +
      `${p.destinos.join(" · ")} y ya no ocurre. Quita la entrada.`,
  );
}

/** Cuántos pares se declaran, para que el informe diga cuánto se perdona. */
export const PARES_DECLARADOS_COUNT = PARES_DECLARADOS.length;
