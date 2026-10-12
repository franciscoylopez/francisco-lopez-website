import { ARD_URL } from "../../lib/ard";
import { locales, pagePath } from "../../lib/i18n/config";
import { resolveOgCard } from "../../lib/routes";
import { fallo, vistos, type Pagina } from "./estado";

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

export function revisarCanonical({
  doc,
  variante,
  slug,
  esperada,
}: Pagina): void {
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
export function revisarTarjetas({
  doc,
  variante,
  lang,
  slug,
  esperada,
}: Pagina): void {
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
  // Y QUE EL `card` RESUELVA A LA SUYA. Es la otra mitad de D72: el tipo ya
  // impedía registrar una página sin copy de tarjeta, pero el DESPACHO estaba
  // escrito a mano, así que `/contacto` publicó la tarjeta de la home durante un
  // sprint entero, siendo una página de catorce y justo la del embudo. No lo ve
  // el compilador, no lo ve `check:rutas` y no lo ve nadie que no comparta el
  // enlace: por eso se mira aquí, sobre el HTML servido.
  //
  // Se resuelve con el MISMO `resolveOgCard` que usa el handler. Reimplementarlo
  // aquí sería crear la segunda verdad que este arreglo acaba de retirar.
  if (!ogImage) return;
  const card = new URL(ogImage, "https://x").searchParams.get("card") ?? "";
  vistos.tarjetas++;
  // Las del deep-dive no pasan por `resolveOgCard`: las compone `deepDiveCopy`
  // leyendo el diccionario de la experiencia, así que aquí basta con que el
  // parámetro sea el slug. Con otro, cae en la home igual.
  if (slug === "trayectoria" || slug.startsWith("trayectoria/")) {
    if (card !== slug) {
      fallo(
        variante,
        `la tarjeta OG pide \`card=${card}\` y esta variante es «${slug}»: la compone ` +
          "`deepDiveCopy` por el slug, así que con otro parámetro publicaría la de la home.",
      );
    }
    return;
  }
  const resuelta = resolveOgCard(card);
  const suya = slug === "" ? "home" : slug;
  if (resuelta !== suya) {
    fallo(
      variante,
      `la tarjeta OG pide \`card=${card}\`, que el despacho resuelve a «${resuelta}»: ` +
        `esta variante publicaría la tarjeta de «${resuelta}» en vez de la suya («${suya}»).`,
    );
  }
}

/** Los dos invariantes de un `BreadcrumbList`: orden contiguo y el último sin `item`. */

export function revisarPermalinks(pagina: Pagina): void {
  const { doc, variante } = pagina;
  for (const a of doc.querySelectorAll<HTMLAnchorElement>(
    'a[href*="github.com"]',
  )) {
    const href = a.getAttribute("href") ?? "";
    const md = /\/blob\/[^?#]+\.md(\?[^#]*)?#L\d+/.exec(href);
    if (!md) continue;
    vistos.permalinks++;
    if (!(md[1] ?? "").includes("plain=1")) {
      fallo(
        variante,
        `el permalink «${a.textContent?.trim()}» apunta a una línea de un \`.md\` sin ` +
          `\`?plain=1\` (${href}). GitHub ignora \`#L…\` en la vista formateada, así que ` +
          "el enlace abre el archivo por el principio en vez de por la línea que cita.",
      );
    }
  }
}

/**
 * EL `rel="ard"` DE CADA VARIANTE *(2026-08-31, P68.752)*.
 *
 * ARD v0.91 §5.1 le pide dos cosas a un consumidor: pedir
 * `/.well-known/ard.json` y **honrar un `rel="ard"`**. La primera no depende de
 * nosotros; la segunda es un `<link>` que el layout emite y que **React iza al
 * `<head>`**, y esa izada es justo lo que no se puede dar por hecho: si un día
 * dejara de ocurrir, el enlace se quedaría dentro del `<body>` —o desaparecería—
 * sin error de compilación y sin que nada se viera raro en pantalla.
 *
 * SE COMPRUEBAN LAS TRES COSAS QUE PUEDEN FALLAR POR SEPARADO: que esté, que
 * esté **en el `<head>`** y que apunte a la URL del catálogo. Y que sea UNO:
 * dos `rel="ard"` con destinos distintos es un sitio que dice tener dos
 * catálogos.
 *
 * VA AQUÍ Y NO EN `check:agentes`, que es quien vigila lo demás del catálogo,
 * por el disparador de siempre: esto solo existe en el HTML servido, y las 28
 * variantes ya están abiertas aquí. `check:agentes` corre sin DOM.
 */
export function revisarEnlaceArd({ doc, variante }: Pagina): void {
  const enlaces = [...doc.querySelectorAll('link[rel="ard"]')];
  vistos.enlacesArd += enlaces.length;

  if (enlaces.length !== 1) {
    fallo(
      variante,
      `tiene ${enlaces.length} \`<link rel="ard">\` y tiene que haber uno. ` +
        "Es la relación que ARD §5.1 obliga a honrar a un consumidor; sin ella, " +
        "descubrir el catálogo depende de que el agente pruebe el well-known a ciegas.",
    );
    return;
  }

  const enlace = enlaces[0]!;
  if (enlace.closest("head") === null) {
    fallo(
      variante,
      'el `<link rel="ard">` no está en el `<head>`. El layout lo emite en el ' +
        "árbol y quien lo iza es React: si deja de hacerlo, el enlace se queda en el " +
        "`<body>`, donde no lo lee ningún consumidor, y nada más se rompe.",
    );
  }
  const href = enlace.getAttribute("href");
  if (href !== ARD_URL) {
    fallo(
      variante,
      `el \`<link rel="ard">\` apunta a «${href}» y el catálogo está en «${ARD_URL}».`,
    );
  }
}
