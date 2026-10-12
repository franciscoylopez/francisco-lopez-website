import { NextRequest } from "next/server";

import { type Locale } from "../../lib/i18n/config";
import { cuerpo404 } from "../../lib/md-404";
import { type PageSlug } from "../../lib/routes";
import { SITE_URL } from "../../lib/site";
import { proxy } from "../../proxy";
import { fallo, vistos } from "./informe";
import { rutaMd } from "./sitio";

/* -------------------------------------------------------------------------- */
/* 3. La negociación — ejecutando el proxy, que es donde ocurre                 */
/* -------------------------------------------------------------------------- */

/** El `Accept` que manda un navegador de verdad. Termina en el comodín. */
const ACCEPT_NAVEGADOR =
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8";

function pide(path: string, accept: string) {
  return proxy(new NextRequest(`${SITE_URL}${path}`, { headers: { accept } }));
}

/** ¿A qué ruta interna reescribe? `null` si esta respuesta no es un rewrite. */
function destino(res: ReturnType<typeof proxy>): string | null {
  const url = res.headers.get("x-middleware-rewrite");
  return url ? new URL(url).pathname : null;
}

const varyTieneAccept = (res: ReturnType<typeof proxy>) =>
  (res.headers.get("Vary") ?? "")
    .split(",")
    .some((v) => v.trim().toLowerCase() === "accept");

export function revisarNegociacion(): void {
  // UNA MUESTRA DE CADA FORMA DE RUTA, no las 28: lo que se prueba es la lógica
  // del proxy, y sus ramas son tres (raíz, interna en español, interna en
  // inglés). Recorrer las 28 no probaría una rama más.
  const casos: { path: string; lang: Locale; slug: PageSlug }[] = [
    { path: "/", lang: "es", slug: "" },
    { path: "/sobre-mi", lang: "es", slug: "sobre-mi" },
    { path: "/trayectoria/emendu", lang: "es", slug: "trayectoria/emendu" },
    { path: "/en", lang: "en", slug: "" },
    // LA RUTA PÚBLICA, no la carpeta (P72.56): es el caso que comprueba que el
    // proxy cruza las dos fronteras a la vez —`/en/about` es una página del
    // registro llamada `sobre-mi`, y su espejo se llama `about.md`—.
    { path: "/en/about", lang: "en", slug: "sobre-mi" },
  ];

  for (const { path, lang, slug } of casos) {
    vistos.negociaciones++;
    const esperada = rutaMd(lang, slug);

    // (a) Quien PIDE markdown se lo lleva.
    const conMd = pide(path, "text/markdown");
    if (destino(conMd) !== esperada) {
      fallo(
        "negociación",
        `\`${path}\` con \`Accept: text/markdown\` reescribe a \`${destino(conMd) ?? "nada"}\` ` +
          `y tenía que ir a \`${esperada}\`.`,
      );
    }

    // (b) Y UN NAVEGADOR NO. Es la mitad que se rompe sola: con un `includes` en
    // vez del token exacto, el comodín del final de este `Accept` le serviría
    // markdown a una persona. Está escrito en `proxy.ts` y aquí se comprueba.
    const conHtml = pide(path, ACCEPT_NAVEGADOR);
    if (destino(conHtml) === esperada) {
      fallo(
        "negociación",
        `\`${path}\` le sirve markdown a un NAVEGADOR. El \`Accept\` de un navegador ` +
          "lleva `*/*`, así que la comprobación tiene que ser por token exacto.",
      );
    }

    // (c) `Vary: Accept` EN LAS DOS, que es lo que impide que una caché
    // compartida le dé a una persona lo que pidió un agente.
    for (const [quien, res] of [
      ["markdown", conMd],
      ["navegador", conHtml],
    ] as const) {
      if (!varyTieneAccept(res)) {
        fallo(
          "negociación",
          `\`${path}\` responde al ${quien} sin \`Vary: Accept\` (dice «${res.headers.get("Vary") ?? "nada"}»). ` +
            "La misma URL devuelve dos cosas, así que sin eso una caché intermedia las mezcla.",
        );
      }
    }

    // (d) Y `q=0` TAMPOCO SE LO LLEVA. En RFC 9110 §12.5.1 el peso cero es «este
    // tipo NO es aceptable», así que `text/markdown;q=0` pide justo lo contrario
    // que `text/markdown`. Leyendo solo el token —que es lo que se hacía hasta
    // el 2026-08-31— las dos cabeceras hacían lo mismo. Se vigila aquí porque el
    // caso no aparece en producción: sin guardián, el arreglo se deshace solo y
    // nadie lo nota.
    const conCero = pide(path, `${"text/markdown"};q=0`);
    if (destino(conCero) === esperada) {
      fallo(
        "negociación",
        `\`${path}\` sirve markdown a quien mandó \`Accept: text/markdown;q=0\`, que es ` +
          "la forma de decir que NO lo quiere. El peso se lee, no solo el token.",
      );
    }
  }

  // EL CANÓNICO NO SE NEGOCIA. `/es/...` redirige SIEMPRE, pida lo que pida:
  // servir markdown desde una URL no canónica publicaría un segundo sitio en el
  // idioma por defecto. Está razonado en `proxy.ts` y por eso se vigila.
  vistos.negociaciones++;
  const enEs = pide("/es/sobre-mi", "text/markdown");
  if (enEs.status !== 307 && enEs.status !== 308) {
    fallo(
      "negociación",
      `\`/es/sobre-mi\` con \`Accept: text/markdown\` responde ${enEs.status} en vez de redirigir. ` +
        "El canónico no depende de lo que se pida.",
    );
  }

  revisar404Markdown();
}

/**
 * LA RUTA QUE NO EXISTE TAMBIÉN SE NEGOCIA (2026-08-30). Antes reescribía a un
 * `.md` que tampoco existe, así que el agente recibía la 404 de marca en HTML: el
 * estado era correcto y el cuerpo no le servía para recuperarse.
 *
 * Se comprueban las TRES cosas que lo hacen útil —404 de verdad, cuerpo markdown
 * y un destino al que ir—, y en LOS DOS IDIOMAS, porque un 404 inglés que
 * devolviera el índice español sería el fallo silencioso de este cambio.
 */
function revisar404Markdown(): void {
  for (const [path, locale] of [
    ["/no-existe-esta-ruta", "es"],
    ["/en/no-existe-esta-ruta", "en"],
  ] as const) {
    vistos.negociaciones++;
    const res = pide(path, "text/markdown");
    if (res.status !== 404) {
      fallo(
        "negociación",
        `\`${path}\` con \`Accept: text/markdown\` responde ${res.status} y tenía que ser 404.`,
      );
      continue;
    }
    const tipo = res.headers.get("Content-Type") ?? "";
    if (!tipo.startsWith("text/markdown")) {
      fallo(
        "negociación",
        `el 404 de \`${path}\` se sirve como \`${tipo || "nada"}\` a quien pidió markdown.`,
      );
    }
    if (!cuerpo404(locale, path).includes(`${SITE_URL}/llms.txt`)) {
      fallo(
        "negociación",
        `el 404 de \`${path}\` no apunta a \`/llms.txt\`. Un 404 sin salida deja al agente sin ` +
          "dónde seguir, que es la mitad de lo que se le pide a un 404.",
      );
    }
  }
}
