import { EMAIL, LINKEDIN_URL, PHONE_TEL } from "@/lib/contact";
import { cvPath } from "@/lib/i18n/config";
import { SITE_URL } from "@/lib/site";
import { STATIC_PAGE_SLUGS, type StaticPageSlug } from "@/lib/routes";
import { factsOf, shortOf } from "@/content/experience-copy";
import { experienceOf, type ExperienceSlug } from "@/content/experiences";

import esCommon from "../[lang]/dictionaries/es/common.json";
import esLlms from "../[lang]/dictionaries/es/llms.json";
import esHome from "../[lang]/dictionaries/es/home.json";
import esSobreMi from "../[lang]/dictionaries/es/sobre-mi.json";
import esBrandKit from "../[lang]/dictionaries/es/brand-kit.json";
import esDesignSystem from "../[lang]/dictionaries/es/design-system.json";
import esAccesibilidad from "../[lang]/dictionaries/es/accesibilidad.json";
import esCookies from "../[lang]/dictionaries/es/cookies.json";
import esContacto from "../[lang]/dictionaries/es/contacto.json";
import esComoSeHaCreado from "../[lang]/dictionaries/es/como-se-ha-creado.json";
import esTrayectoria from "../[lang]/dictionaries/es/trayectoria/indice.json";
import esEmendu from "../[lang]/dictionaries/es/trayectoria/emendu.json";
import esKuotip from "../[lang]/dictionaries/es/trayectoria/kuotip.json";
import esIndya from "../[lang]/dictionaries/es/trayectoria/indya.json";
import esFreepik from "../[lang]/dictionaries/es/trayectoria/freepik.json";
import esThetool from "../[lang]/dictionaries/es/trayectoria/thetool.json";

// Este archivo habla de TODAS las páginas, así que es el único sitio que sigue
// necesitando el diccionario entero (P46). Se recompone aquí, y es barato: la ruta
// es estática (○), o sea que esto corre en build y una sola vez.
const es = {
  ...esCommon,
  ...esHome,
  sobreMi: esSobreMi,
  brandKit: esBrandKit,
  designSystem: esDesignSystem,
  accesibilidad: esAccesibilidad,
  cookies: esCookies,
};

// /llms.txt — convención emergente (llmstxt.org), no un estándar ratificado.
// Generado desde el diccionario i18n y lib/contact·lib/site (misma fuente que la
// web) para que nunca pueda divergir del contenido real. Un solo archivo, en
// español (locale por defecto, D2), con enlaces a ambas versiones de cada página.
// Ver Notion P37.5.
//
// LA PROSA DE ESTE ARCHIVO VIVE EN EL DICCIONARIO (`es/llms.json`, P67.4), no en
// el template literal de aquí abajo, y el motivo es medido y no estético:
// `check:raya` sí barre `app/`, pero POR DISEÑO no mira los template literals
// —sin resolver, el ordinal de D43 no se distingue de una raya cualquiera—. Copy
// escrito dentro del backtick era copy servido SIN VIGILAR, y lo era todo el de
// este archivo: los encabezados, las dos líneas del CV, la de la versión en
// inglés y la sección de markdown que añadió P67.2. Mover solo la sección nueva
// habría dejado el archivo medio vigilado, que es peor que entero fuera porque
// parece cubierto.
//
// Y ES UN ARCHIVO PROPIO Y NO UNA RAMA DE `common.json`, que era la primera
// forma escrita: los tipos del diccionario se derivan del JSON español y el
// cargador EN se anota con ese tipo (D11), así que una rama nueva en
// `es/common.json` OBLIGA a su gemela en `en/common.json` o el build falla.
// `llms.txt` es un solo archivo y va en español, así que esa gemela sería copy
// fantasma. Un archivo suelto da la misma cobertura —`check:raya` recorre el
// árbol entero de `dictionaries`, no una lista— sin inventar una traducción
// muerta. Lo importa solo esta ruta.
//
// LO QUE NO SE MUEVE son los datos derivados —las páginas del registro, la
// trayectoria, las rutas del CV, los canales de contacto—, que ya salen de su
// fuente y por regla no pueden vivir en el diccionario (D38).

/** Ancho al que se envuelve la prosa. El del archivo antes de partirlo. */
const ANCHO = 88;

/**
 * Envuelve un párrafo a `ANCHO`. Existe porque el copy del diccionario NO lleva
 * saltos de línea: una cadena partida a mano es ilegible de editar y se rompe en
 * cuanto alguien cambia una palabra. El salto es formato de salida, así que se
 * pone aquí.
 */
function envuelve(texto: string, prefijo = "", sangria = ""): string {
  const lineas: string[] = [];
  let actual = "";
  for (const palabra of texto.split(/\s+/)) {
    const candidata = actual ? `${actual} ${palabra}` : palabra;
    const margen = lineas.length === 0 ? prefijo.length : sangria.length;
    if (actual && margen + candidata.length > ANCHO) {
      lineas.push(actual);
      actual = palabra;
    } else actual = candidata;
  }
  if (actual) lineas.push(actual);
  return lineas.map((l, i) => (i === 0 ? prefijo : sangria) + l).join("\n");
}

/** Un punto de lista envuelto, con la sangría de continuación de markdown. */
const punto = (texto: string) => envuelve(texto, "- ", "  ");

const puntos = (textos: readonly string[]) => textos.map(punto).join("\n");

// De qué rama del diccionario sale el texto de cada página estática. CUÁLES son
// y en qué orden lo pone `lib/routes.ts` (D72): este archivo era una de las tres
// copias a mano de esa lista, y la que fallaba más callada — una página que
// faltara aquí simplemente no existía para un modelo. El `Record` completo hace
// que una página nueva sin entrada NO COMPILE, igual que el `DEEP_DIVE` de abajo.
const META: Record<StaticPageSlug, { title: string; description: string }> = {
  "": es.meta,
  "sobre-mi": es.sobreMi.meta,
  trayectoria: esTrayectoria.meta,
  "brand-kit": es.brandKit.meta,
  "design-system": es.designSystem.meta,
  accesibilidad: es.accesibilidad.meta,
  cookies: es.cookies.meta,
  contacto: esContacto.meta,
  "como-se-ha-creado": esComoSeHaCreado.meta,
};

/**
 * QUÉ PÁGINA TIENE QUE ESTAR NOMBRADA en «Cuándo usar esta fuente», que es el
 * mapa pregunta → página, y cuál a propósito no lo está. Emparejado con
 * `StaticPageSlug` igual que el `META` de arriba: una página nueva sin decidir
 * si contesta a alguna pregunta NO COMPILA, en vez de quedarse fuera del mapa en
 * silencio, que es exactamente el modo de fallo que este archivo ya tuvo con las
 * cinco del deep-dive.
 *
 * El valor es la MARCA que tiene que aparecer en el texto, no el slug: la home
 * no tiene ruta que citar («/» no dice nada) y en el copy se nombra por su
 * nombre. `null` significa «decidido que no se nombra»: `cookies` es la página
 * legal y no contesta a ninguna pregunta que un agente vaya a hacerse.
 */
const EN_EL_MAPA: Record<StaticPageSlug, string | null> = {
  "": "La home",
  "sobre-mi": "/sobre-mi",
  trayectoria: "/trayectoria",
  "brand-kit": "/brand-kit",
  "design-system": "/design-system",
  accesibilidad: "/accesibilidad",
  cookies: null,
  contacto: "/contacto",
  "como-se-ha-creado": "/como-se-ha-creado",
};

/**
 * El `Record` obliga a DECIDIR; esto comprueba que la decisión se cumplió en el
 * copy, que es otra cosa. Corre en build (la ruta es estática), así que una
 * página marcada como nombrada y ausente del texto rompe el build en vez de
 * publicarse invisible. Busca la ausencia, y también el sobrante.
 */
function compruebaElMapa(texto: string): void {
  const faltan = STATIC_PAGE_SLUGS.filter((slug) => {
    const marca = EN_EL_MAPA[slug];
    return marca !== null && !texto.includes(marca);
  });
  const sobran = STATIC_PAGE_SLUGS.filter(
    (slug) => EN_EL_MAPA[slug] === null && slug && texto.includes(`/${slug}`),
  );
  if (faltan.length || sobran.length) {
    throw new Error(
      "llms.txt · «Cuándo usar esta fuente» no cuadra con el registro de páginas:" +
        (faltan.length
          ? `\n  Nombradas en EN_EL_MAPA y ausentes del copy: ${faltan.map((s) => s || "(home)").join(", ")}`
          : "") +
        (sobran.length
          ? `\n  Marcadas como no nombradas y presentes en el copy: ${sobran.join(", ")}`
          : "") +
        "\n\nO se corrige el copy de es/llms.json, o se corrige EN_EL_MAPA. Las dos" +
        "\ncosas dicen lo mismo y por eso no pueden decir cosas distintas.",
    );
  }
}

// Trayectoria de producto (D9 §6): mismos períodos/roles/empresas que la home,
// tal cual viven en el diccionario — sin prosa propia de este archivo.
const TRAYECTORIA = [...es.trayectoria.producto, es.trayectoria.nested[0]!];

/**
 * La sección que un agente lee ANTES de la lista de páginas, porque es la que le
 * dice si esta fuente le sirve (P67.4). El resumen de arriba describe QUIÉN es;
 * esto describe CUÁNDO traerlo a la conversación, que es lo que un agente usa
 * para elegir. Va antes de `## Páginas` a propósito: decidir primero, leerse las
 * catorce solo si hace falta.
 */
function cuandoUsar(): string {
  const t = esLlms.cuandoUsar;
  return [
    `## ${t.titulo}`,
    "",
    envuelve(t.intro),
    "",
    puntos(t.casos),
    "",
    `### ${t.mapaTitulo}`,
    "",
    puntos(t.mapa),
    "",
    `### ${t.queNoEsTitulo}`,
    "",
    envuelve(t.queNoEs),
    "",
    `### ${t.paraQuienTitulo}`,
    "",
    envuelve(t.paraQuien),
  ].join("\n");
}

function pageList(): string {
  return STATIC_PAGE_SLUGS.map((slug) => {
    const { title, description } = META[slug];
    const path = slug ? `/${slug}` : "";
    const urlEs = `${SITE_URL}${path || "/"}`;
    const urlEn = `${SITE_URL}/en${path}`;
    return `- [${title}](${urlEs}) ([EN](${urlEn})): ${description}`;
  }).join("\n");
}

/** La sección de markdown para agentes (P67.2), con `{sitio}` ya resuelto. */
function markdownParaAgentes(): string {
  const t = esLlms.markdown;
  const conSitio = (texto: string) => texto.replaceAll("{sitio}", SITE_URL);
  return [
    `## ${t.titulo}`,
    "",
    envuelve(conSitio(t.intro)),
    "",
    puntos(t.vias.map(conSitio)),
    "",
    envuelve(conSitio(t.cierre)),
  ].join("\n");
}

/**
 * El diccionario de cada deep-dive, para sacar su titular. El `Record` va
 * tecleado por `ExperienceSlug`, así que una experiencia nueva sin entrada aquí
 * NO COMPILA — que es lo que impide que su página se quede fuera de este archivo
 * igual que estuvieron las cinco hasta hoy (P50).
 */
const DEEP_DIVE: Record<ExperienceSlug, { title: string }> = {
  emendu: esEmendu,
  kuotip: esKuotip,
  indya: esIndya,
  freepik: esFreepik,
  thetool: esThetool,
};

/**
 * Guardián de tipo, y no un `as`: `experienceOf` devuelve el `slug` como
 * `string | null` —es el tipo del registro, donde `null` significa «sin página»—
 * y aquí hace falta la unión estrecha para indexar. Se comprueba la pertenencia
 * DE VERDAD en vez de afirmarla, que es lo que hace que un slug registrado sin
 * diccionario caiga en la rama sin enlace en lugar de reventar al leer `.title`
 * de `undefined`. Hoy no puede pasar —el `Record` es exhaustivo—, pero un `as`
 * no lo sabe.
 */
const tienePagina = (slug: string | null): slug is ExperienceSlug =>
  slug !== null && slug in DEEP_DIVE;

function trayectoriaList(): string {
  // La descripción ya no es un campo de la fila: sale del registro por
  // experiencia (P48.5), que es donde vive emparejada con el bullet del CV y con
  // su gemelo del deep-dive. `llms.txt` es español y estático, así que pide el ES
  // directamente — es la misma fuente que lee la home.
  //
  // Y DESDE P50 CADA UNA LLEVA SU ENLACE, si tiene página. Hasta entonces este
  // bloque nombraba las cinco experiencias SIN URL mientras sus cinco páginas ya
  // existían: un modelo que leyera este archivo no podía descubrir el contenido
  // más profundo del sitio. Que enlace o no lo decide `slug` en el registro
  // (D44), no una lista escrita aquí — el mismo criterio que el sitemap y que
  // `generateStaticParams`.
  return TRAYECTORIA.map(({ company }) => {
    const { role, period } = factsOf("es", company);
    const { slug } = experienceOf(company);
    const exitNote = company === "TheTool" ? ` ${esLlms.exit}` : "";
    const nombre = tienePagina(slug)
      ? `[${company}](${SITE_URL}/trayectoria/${slug})`
      : company;
    const caso = tienePagina(slug)
      ? ` ${esLlms.caso.replace("{titulo}", DEEP_DIVE[slug].title)}`
      : "";
    return `- ${nombre} · ${role} (${period}): ${shortOf("es", company)}${exitNote}${caso}`;
  }).join("\n");
}

function buildLlmsTxt(): string {
  const seccionCuandoUsar = cuandoUsar();
  compruebaElMapa(seccionCuandoUsar);

  return `# ${esLlms.titulo}

${envuelve(es.meta.description, "> ", "> ")}

${envuelve(es.contacto.intro)}

${seccionCuandoUsar}

## ${esLlms.paginasTitulo}

${pageList()}

${markdownParaAgentes()}

## ${esLlms.trayectoriaTitulo}

${trayectoriaList()}

## ${esLlms.cv.titulo}

- [${esLlms.cv.esEnlace}](${SITE_URL}${cvPath("es")}): ${esLlms.cv.esDescripcion}
- [${esLlms.cv.enEnlace}](${SITE_URL}${cvPath("en")}): ${esLlms.cv.enDescripcion}

## ${esLlms.contacto.titulo}

- ${esLlms.contacto.email}: mailto:${EMAIL}
- ${esLlms.contacto.telefono}: tel:${PHONE_TEL}
- ${esLlms.contacto.linkedin}: ${LINKEDIN_URL}

## ${esLlms.opcional.titulo}

- [${esLlms.opcional.enlace}](${SITE_URL}/en): ${esLlms.opcional.descripcion}
`;
}

export const dynamic = "force-static";

export async function GET() {
  return new Response(buildLlmsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
