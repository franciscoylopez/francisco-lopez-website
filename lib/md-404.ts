// El 404 que se le sirve a un agente que pidió markdown (2026-08-30).
//
// QUÉ HUECO CIERRA. Desde D158 el proxy negocia `Accept: text/markdown` y
// reescribe a `/md/<locale>/<pagina>.md`. Una ruta que NO existe reescribía
// igual, a un `.md` que tampoco existe, así que el agente recibía la página 404
// de marca: 27 KB de HTML como respuesta a una petición de markdown. El estado
// era correcto —404 de verdad, verificado en producción— pero el cuerpo no le
// servía para recuperarse, que es justo lo que un 404 tiene que hacer con un
// cliente que no ve.
//
// POR QUÉ ESTE ARCHIVO Y NO UN LITERAL EN `proxy.ts`. `check:raya` barre `app`,
// `components`, `lib` y `content`; la RAÍZ del repo no. Copy escrito dentro del
// proxy sería copy servido sin vigilar, que es el mismo razonamiento por el que
// la prosa de `/llms.txt` bajó al diccionario en P67.4. Y no baja al diccionario
// porque el proxy corre en el edge en CADA petición: importar ahí el diccionario
// completo por dos párrafos es peso en el camino caliente de todo el sitio.
//
// LOS TRES DESTINOS SON LOS QUE PIDE LA CONVENCIÓN —índice para agentes, mapa
// del sitio, inicio— y los tres existen: si alguno dejara de existir, el enlace
// muerto lo caza `check:enlaces`, que los saca del disco.
import { SITE_URL } from "@/lib/site";

import type { Locale } from "@/lib/i18n/config";

/**
 * LA RUTA PEDIDA SE DEVUELVE SANEADA, no tal cual. Va dentro del cuerpo, así que
 * es texto de un tercero servido desde nuestro dominio: `nosniff` más
 * `text/markdown` ya impiden que un navegador lo interprete como HTML, pero el
 * carácter que no aporta nada tampoco se refleja. Se recorta a 120, que es más
 * de lo que mide cualquier ruta real del sitio.
 */
function rutaSegura(pathname: string): string {
  return pathname.replace(/[^\w\-./]/g, "").slice(0, 120) || "/";
}

const CUERPOS: Record<Locale, (ruta: string) => string> = {
  es: (ruta) => `# 404 · Página no encontrada

\`${ruta}\` no existe en ${SITE_URL.replace("https://", "")}.

Dónde seguir:

- Índice para agentes: ${SITE_URL}/llms.txt
- Todas las páginas: ${SITE_URL}/sitemap.xml
- Inicio: ${SITE_URL}/
`,
  en: (ruta) => `# 404 · Page not found

\`${ruta}\` does not exist on ${SITE_URL.replace("https://", "")}.

Where to go next:

- Agent index: ${SITE_URL}/llms.txt
- All pages: ${SITE_URL}/sitemap.xml
- Home: ${SITE_URL}/en
`,
};

/** El cuerpo markdown del 404, en el idioma que decía la URL que no existe. */
export function cuerpo404(locale: Locale, pathname: string): string {
  return CUERPOS[locale](rutaSegura(pathname));
}
