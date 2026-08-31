// El catálogo ARD — qué le ofrece este sitio a una máquina *(P68.752, 2026-08-31)*.
//
// QUÉ ES. Agentic Resource Discovery (agenticresourcediscovery.org, v0.91) define
// un manifiesto en `/.well-known/ard.json`: una lista de recursos que un agente
// puede traerse, cada uno con un identificador estable, un tipo de medio y una
// URL. Es la ruta que un cliente conformante pide para resolver un dominio, y la
// pide sin que nadie se la diga — que es el mismo motivo por el que existen los
// alias de `/about` y `/agents.md` (D161, P68.748).
//
// POR QUÉ ENTRA, SI D157 DICE QUE NO SE PUBLICAN SUPERFICIES QUE NO EXISTEN. El
// primer triaje lo tumbó como «el `api-catalog` sin API de D159», y ese descarte
// salió de leer la DESCRIPCIÓN del check —«MCP servers, APIs, agents, and
// skills»— en vez de la especificación o un catálogo real. El de Vercel, que es
// quien pasa el check con 4/4, tiene DOS de sus cuatro entradas en contenido
// puro: un `.md` de documentación y un índice JSON. Y el modelo de entrada que
// valida el conformance es `identifier` + `displayName` + tipo de medio +
// exactamente uno de `url` o `data`: nada exige una API. Así que el criterio de
// D157 —*un check aplica si el sitio TIENE esa superficie*— aquí se cumple: las
// cuatro clases de recurso que se listan abajo están servidas hoy.
//
// LO QUE NO ENTRA, Y ES LA MITAD DEL TRABAJO. Nada de MCP, agentes, skills ni
// API: no existen, y anunciarlas en un formato que una máquina sabe leer es
// mentir con más precisión. Tampoco `trustManifest` —identidad verificable,
// atestaciones, firma—: la especificación solo pide `trustManifest.identity`, y
// aquí no hay ninguna identidad criptográfica que declarar, así que un manifiesto
// de confianza sería un envoltorio vacío puesto para aprobar un check que dice
// literalmente que nunca resta puntos.
//
// LAS PÁGINAS TAMPOCO ENTRAN, y por eso este archivo no importa `lib/routes.ts`.
// Un catálogo con las veintiocho variantes sería la tercera copia de la lista de
// páginas —después del sitemap y de `/llms.txt`—, que es justo el defecto que D72
// cerró. Lo que entra son los dos ÍNDICES que sí la derivan, y la entrada del
// canal markdown explica el patrón en vez de enumerarlo. Lo que sí se deriva de
// verdad es el IDIOMA: un locale nuevo trae su markdown y su CV sin tocar esto.
//
// EL COPY VIVE AQUÍ Y NO EN EL DICCIONARIO, mismo criterio que `lib/md-404.ts`:
// `check:raya` barre `app`, `components`, `lib` y `content`, así que estas
// cadenas están vigiladas; y bajarlas al diccionario obligaría a una gemela
// inglesa que no existe, porque el catálogo es UN documento, no uno por idioma.
//
// Y LAS CONSULTAS DE EJEMPLO VAN EN LOS DOS IDIOMAS dentro del mismo array, que
// es lo que no es obvio: son el texto del que un registro construye su índice
// semántico, y este sitio se sirve en español y en inglés. La tanda 6 ya midió
// esa asimetría —el alias inglés en el encabezado de `llms.txt` fue la única
// variable que movió «Agent instruction» a *Passed*—, así que no es simetría por
// simetría.
import { cvPath, locales, type Locale } from "@/lib/i18n/config";
import { SITE_DOMAIN, SITE_NAME, SITE_URL } from "@/lib/site";

/**
 * Una entrada del catálogo, con los cuatro términos que el conformance exige
 * (§4.2 de ARD) y los dos que recomienda.
 *
 * `url` y `data` son mutuamente excluyentes por especificación y aquí solo existe
 * `url`: todo lo que este sitio ofrece está servido en una URL propia, así que la
 * variante en línea no tiene caso. Se anota porque el guardián sí comprueba la
 * regla de «exactamente uno», y con un solo campo esa comprobación parece
 * decorativa hasta que alguien añade el otro.
 */
export type ArdEntry = {
  /** `urn:air:<dominio>:<espacio>:<nombre>`, con el dominio como ancla (Apéndice C). */
  identifier: string;
  displayName: string;
  /** Tipo IANA, y el que el recurso se SIRVE de verdad, no el que parece. */
  type: string;
  url: string;
  description: string;
  /** 2-5 consultas de ejemplo. Es de lo que un registro indexa (§4.2, §D.2). */
  representativeQueries: string[];
  tags: string[];
};

/**
 * El nombre de un recurso dentro del dominio. El `<espacio>` agrupa por clase
 * —`index`, `markdown`, `cv`— igual que hace el catálogo de Vercel (`docs`,
 * `api`, `metadata`), que es la única convención publicada que hay para esto.
 */
const urn = (espacio: string, nombre: string) =>
  `urn:air:${SITE_DOMAIN}:${espacio}:${nombre}`;

/** Lo que de una entrada es texto: lo que cambia entre recursos, no su forma. */
type ArdCopy = Omit<ArdEntry, "identifier" | "type" | "url">;

/**
 * Compone una entrada con los términos SIEMPRE en el mismo orden. Un `...copy`
 * al final los dejaba en dos órdenes distintos según la entrada se escribiera a
 * mano o se derivara del idioma, y este documento lo lee también una persona.
 */
const entrada = (
  identifier: string,
  type: string,
  url: string,
  copy: ArdCopy,
): ArdEntry => ({
  identifier,
  displayName: copy.displayName,
  type,
  url,
  description: copy.description,
  representativeQueries: copy.representativeQueries,
  tags: copy.tags,
});

/**
 * La home de un idioma en markdown. Un locale nuevo entra por aquí, no por una
 * lista: la silueta `/md/<locale>.md` es la misma que escribe `npm run md` y la
 * que reescribe el proxy, y que este archivo no la comparta con ellos no la deja
 * al aire — `check:agentes` resuelve cada `url` del catálogo contra `public/md`,
 * que es donde el archivo existe de verdad.
 */
const MARKDOWN: Record<Locale, ArdCopy> = {
  es: {
    displayName: "franciscolopez.es en markdown (español)",
    description:
      "La página, sin el HTML de alrededor. Cada página del sitio se sirve igual en /md/es/<pagina>.md, y /llms.txt las lista todas; la home baja de 216 a 6,6 KB.",
    representativeQueries: [
      "resume la web de Francisco López",
      "qué cuenta Francisco López sobre cómo trabaja",
      "read Francisco López's website as plain text",
    ],
    tags: ["markdown", "contenido", "paginas"],
  },
  en: {
    displayName: "franciscolopez.es in markdown (English)",
    description:
      "The page without the surrounding HTML. Every page is served the same way at /md/en/<page>.md, and /llms.txt lists them all.",
    representativeQueries: [
      "summarise Francisco López's website",
      "what does Francisco López say about how he works",
      "lee la web de Francisco López en inglés y en texto plano",
    ],
    tags: ["markdown", "content", "pages"],
  },
};

/** El CV en PDF de un idioma. Mismo criterio: sale de `locales`, no de una lista. */
const CV: Record<Locale, ArdCopy> = {
  es: {
    displayName: "CV de Francisco López (PDF, español)",
    description:
      "Dos páginas, texto seleccionable, generado por código desde la misma fuente que la web. Es el documento entero en un archivo, no un resumen.",
    representativeQueries: [
      "descarga el CV de Francisco López",
      "pásame su currículum en PDF",
      "download Francisco López's resume",
    ],
    tags: ["cv", "pdf", "documento"],
  },
  en: {
    displayName: "Francisco López's résumé (PDF, English)",
    description:
      "Two pages, selectable text, generated from the same source as the site. The whole document in one file, not a summary.",
    representativeQueries: [
      "download Francisco López's CV in English",
      "send me his resume as a PDF",
      "dame su currículum en inglés",
    ],
    tags: ["cv", "resume", "pdf"],
  },
};

/**
 * Las entradas del catálogo. Cuatro clases de recurso, todas servidas hoy:
 *
 *   · el índice en prosa (`/llms.txt`), que es por donde se empieza;
 *   · el mapa canónico (`/sitemap.xml`), que es la lista completa;
 *   · el canal markdown, una entrada por idioma;
 *   · el CV en PDF, una por idioma.
 *
 * EL CV ENTRA AUNQUE NO SEA LEGIBLE POR MÁQUINA en el sentido en que lo son las
 * otras tres, y la duda merece quedar escrita: es un PDF, y su contenido está
 * también en `/trayectoria` y en el markdown. Entra porque es un ARTEFACTO —lo
 * que un agente devuelve cuando le piden «mándame su CV» es el archivo, no un
 * resumen— y porque `/llms.txt` ya lo anuncia: dejarlo fuera haría el catálogo
 * menos completo que el índice al que acompaña.
 */
export const ARD_ENTRIES: readonly ArdEntry[] = [
  {
    identifier: urn("index", "llms-txt"),
    displayName: `Índice para agentes de ${SITE_DOMAIN}`,
    // `text/plain` y no `text/markdown`, que es lo que uno escribiría: el archivo
    // tiene forma de markdown y se SIRVE como texto plano, que es la convención
    // de llmstxt.org. El tipo describe la respuesta, no el formato del cuerpo.
    type: "text/plain",
    url: `${SITE_URL}/llms.txt`,
    description:
      "Quién es Francisco López, cuándo traer esta fuente a una conversación y qué página contesta a cada pregunta. Es el archivo por el que se empieza.",
    representativeQueries: [
      "quién es Francisco López",
      "who is Francisco López and what does he do",
      "cuándo sirve consultar franciscolopez.es",
    ],
    tags: ["llms-txt", "indice", "perfil"],
  },
  {
    identifier: urn("index", "sitemap"),
    displayName: `Mapa del sitio de ${SITE_DOMAIN}`,
    type: "application/xml",
    url: `${SITE_URL}/sitemap.xml`,
    description:
      "Las variantes canónicas del sitio, con su hreflang: catorce páginas por idioma. Es la lista completa, derivada del registro de rutas.",
    representativeQueries: [
      "todas las páginas de franciscolopez.es",
      "list every page on franciscolopez.es",
    ],
    tags: ["sitemap", "indice"],
  },
  ...locales.map((lang) =>
    entrada(
      urn("markdown", lang),
      "text/markdown",
      `${SITE_URL}/md/${lang}.md`,
      MARKDOWN[lang],
    ),
  ),
  ...locales.map((lang) =>
    entrada(
      urn("cv", lang),
      "application/pdf",
      `${SITE_URL}${cvPath(lang)}`,
      CV[lang],
    ),
  ),
];

/**
 * El documento entero.
 *
 * `specVersion` ES DEL AI Catalog Standard (ai-catalog.io) Y NO DE ARD, que es la
 * distinción que cuesta un rato ver: ARD define la RUTA y el modelo de entrada,
 * y dice que «cualquier otro miembro de primer nivel es cosa del transporte y ARD
 * lo ignora» (§5.1). El formato de documento —`specVersion`, `host`, `entries`—
 * es el del catálogo, cuya versión publicada es la 1.0, y es contra ese modelo
 * contra el que valida el conformance. Poner aquí «0.91» sería declarar la
 * versión de la otra especificación.
 *
 * `host.identifier` es la URL del sitio, como hace Vercel, y no el `did:web:` del
 * ejemplo de ai-catalog.io: un DID es una identidad verificable y este sitio no
 * publica ninguna. Es la misma línea que hace que no haya `trustManifest`.
 */
export function ardCatalog() {
  return {
    specVersion: "1.0",
    host: {
      displayName: SITE_NAME,
      identifier: `${SITE_URL}/`,
      documentationUrl: `${SITE_URL}/llms.txt`,
    },
    entries: ARD_ENTRIES,
  };
}
