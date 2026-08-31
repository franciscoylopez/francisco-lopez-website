import { NextResponse, type NextRequest } from "next/server";

import { defaultLocale, type Locale } from "@/lib/i18n/config";
import { cuerpo404 } from "@/lib/md-404";
import { PAGE_SLUGS } from "@/lib/routes";

// D3: Next 16 renombra `middleware` → `proxy` (misma funcionalidad). El propio
// doc de i18n del paquete usa `export function proxy`.
//
// Enrutado de locale as-needed (D2):
//   - `/en`, `/en/...`  → se sirven tal cual (árbol app/[lang] con lang="en").
//   - `/es`, `/es/...`  → NO son canónicos (el español va sin prefijo) → redirect
//                          a la ruta sin `/es`.
//   - resto              → español por defecto: rewrite interno a `/es/...` sin
//                          cambiar la URL del navegador (la raíz sirve ES directo,
//                          sin redirect).
// LOS ALIAS QUE UN AGENTE ADIVINA NO ESTÁN AQUÍ — /about, /privacy y /contact
// viven en `next.config.ts`, que es donde la doc de Next manda lo estático y que
// además corre ANTES que el proxy en la cadena de ejecución (2 contra 3).
//
// Cabecera con el locale detectado. La lee `not-found.tsx` (server component), que
// no recibe `params` y no puede deducir el idioma de otra forma. Se propaga en la
// request reescrita/pasada, no en la respuesta.
function withLocale(request: NextRequest, locale: string) {
  const headers = new Headers(request.headers);
  headers.set("x-locale", locale);
  return headers;
}

// Negociación de contenido para agentes (P67.2). Un agente que pide markdown se
// lleva el `<main>` de la misma página en unos KB en vez de las 218 del HTML.
//
// POR QUÉ AQUÍ Y NO EN LA PÁGINA. Leer `Accept` dentro de una página la haría
// DINÁMICA, y que las 28 variantes sigan prerenderizándose es criterio de
// aceptación (D48). El proxy corre antes y reescribe a un archivo estático, así
// que la negociación no le cuesta el prerender a nadie.
const MARKDOWN = "text/markdown";

/**
 * TOKEN EXACTO, NO `includes`. Un navegador manda
 * `text/html,application/xhtml+xml,…,*​/*`, y cualquier cliente puede mandar
 * `*​/*`: con una comprobación laxa, el sitio serviría markdown a una persona.
 * Se pide el tipo por su nombre o no se pide.
 *
 * Y `q=0` ES UN «NO», NO UN «SÍ CON MATIZ» *(2026-08-31)*. En RFC 9110 §12.5.1
 * el peso cero significa «este tipo NO es aceptable», así que
 * `Accept: text/markdown;q=0` pide exactamente lo contrario de lo que pide
 * `text/markdown`. Hasta hoy se leía solo el token y se ignoraba el peso, así
 * que las dos cabeceras hacían lo mismo. No lo manda ningún cliente de los que
 * hoy nos visitan —se encontró leyendo, no en producción—, y por eso el arreglo
 * es este y no un negociador completo: **el orden de preferencia entre tipos no
 * se implementa**, porque aquí no hay preferencia que resolver. O se pide
 * markdown por su nombre, o se sirve el HTML.
 *
 * UN PESO MAL ESCRITO NO CUENTA COMO RECHAZO. La misma sección manda ignorar el
 * parámetro que no se entiende, y la asimetría importa: tratar `q=abc` como un
 * «no» apagaría el canal entero por un cliente que escribe mal la cabecera, que
 * es un fallo mucho más caro que servir markdown a quien lo pidió raro.
 */
function quiereMarkdown(request: NextRequest): boolean {
  return (request.headers.get("accept") ?? "").split(",").some((entrada) => {
    const [tipo, ...parametros] = entrada.trim().split(";");
    if (tipo?.trim().toLowerCase() !== MARKDOWN) return false;
    const peso = parametros
      .map((p) => p.trim().toLowerCase())
      .find((p) => p.startsWith("q="));
    if (peso === undefined) return true;
    const valor = Number(peso.slice(2));
    return Number.isNaN(valor) || valor > 0;
  });
}

/**
 * La misma silueta que deja el prerender y que escribe `npm run md`: la home es
 * `<locale>.md` y no `<locale>/index.md`.
 */
function rutaMarkdown(locale: string, resto: string): string {
  return `/md/${locale}${resto === "/" || resto === "" ? "" : resto}.md`;
}

/**
 * `Vary: Accept` NO ES OPCIONAL desde que la misma URL puede devolver dos cosas:
 * sin él, una caché intermedia le sirve a una persona el markdown que pidió un
 * agente, o al revés. Se AÑADE a lo que Next ya pone (`rsc`,
 * `next-router-state-tree`, …) en vez de sustituirlo, que es el modo de fallo
 * que este proyecto ya conoce: reemplazar una cabecera compuesta rompe lo que no
 * escribiste tú.
 */
function conVary(respuesta: NextResponse): NextResponse {
  const previo = respuesta.headers.get("Vary");
  const partes = previo
    ? previo.split(",").map((v) => v.trim())
    : ([] as string[]);
  if (!partes.some((v) => v.toLowerCase() === "accept")) partes.push("Accept");
  respuesta.headers.set("Vary", partes.join(", "));
  return respuesta;
}

/**
 * QUÉ PÁGINAS EXISTEN, para no reescribir a un `.md` que no está. Es el mismo
 * registro del que salen el sitemap, el gate y `/llms.txt` (D72), así que una
 * página nueva entra aquí sin que nadie se acuerde — y una retirada sale.
 */
const PAGINAS = new Set<string>(PAGE_SLUGS);

/** El slug del registro (`""` para la home) a partir del resto de la ruta. */
function slugDe(resto: string): string {
  return resto.replace(/\/+$/, "").replace(/^\//, "");
}

/**
 * EL 404 QUE UN AGENTE PUEDE LEER (2026-08-30). Sin esto, una ruta inexistente
 * pedida en markdown reescribía a un `.md` que tampoco existe y el agente se
 * llevaba la página 404 de marca: 27 KB de HTML como respuesta a una petición de
 * markdown. El estado ya era correcto; el cuerpo no le servía para recuperarse.
 *
 * VA AQUÍ Y NO EN `global-not-found.tsx` por lo mismo que la negociación entera
 * (D158): leer `Accept` dentro de una página la haría dinámica. Y no cambia nada
 * para quien mira con un navegador, que sigue recibiendo su 404 de marca: esta
 * rama solo la pisa quien pidió `text/markdown` por su nombre.
 */
function markdown404(locale: Locale, pathname: string): NextResponse {
  return conVary(
    new NextResponse(cuerpo404(locale, pathname), {
      status: 404,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        // Una respuesta de error no se indexa ni se guarda: la siguiente
        // petición a esa ruta puede ser a una página que ya exista.
        "X-Robots-Tag": "noindex",
        "Cache-Control": "no-store",
      },
    }),
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const markdown = quiereMarkdown(request);

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    if (markdown) {
      const resto = pathname.slice("/en".length);
      if (!PAGINAS.has(slugDe(resto))) return markdown404("en", pathname);
      const url = request.nextUrl.clone();
      url.pathname = rutaMarkdown("en", resto);
      return conVary(NextResponse.rewrite(url));
    }
    return conVary(
      NextResponse.next({ request: { headers: withLocale(request, "en") } }),
    );
  }

  // El redirect de `/es` va ANTES de la negociación a propósito: el canónico no
  // depende de lo que se pida, y servir markdown desde una URL no canónica
  // publicaría un segundo sitio en el idioma por defecto.
  if (pathname === "/es" || pathname.startsWith("/es/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice("/es".length) || "/";
    return NextResponse.redirect(url);
  }

  const url = request.nextUrl.clone();
  if (markdown) {
    if (!PAGINAS.has(slugDe(pathname)))
      return markdown404(defaultLocale, pathname);
    url.pathname = rutaMarkdown(defaultLocale, pathname);
    return conVary(NextResponse.rewrite(url));
  }
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return conVary(
    NextResponse.rewrite(url, {
      request: { headers: withLocale(request, defaultLocale) },
    }),
  );
}

export const config = {
  // No corre en assets internos (_next), API, ni rutas con extensión de archivo
  // (favicon.ico, /og/*.jpg, /img/*.webp, /cv/*.pdf, …).
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
