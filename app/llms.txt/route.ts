import { EMAIL, LINKEDIN_URL, PHONE_TEL } from "@/lib/contact";
import { cvPath } from "@/lib/i18n/config";
import { SITE_URL } from "@/lib/site";
import { factsOf, shortOf } from "@/content/experience-copy";
import { experienceOf, type ExperienceSlug } from "@/content/experiences";

import esCommon from "../[lang]/dictionaries/es/common.json";
import esHome from "../[lang]/dictionaries/es/home.json";
import esSobreMi from "../[lang]/dictionaries/es/sobre-mi.json";
import esBrandKit from "../[lang]/dictionaries/es/brand-kit.json";
import esDesignSystem from "../[lang]/dictionaries/es/design-system.json";
import esAccesibilidad from "../[lang]/dictionaries/es/accesibilidad.json";
import esCookies from "../[lang]/dictionaries/es/cookies.json";
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
const PAGES: {
  path: string;
  title: string;
  description: string;
}[] = [
  { path: "", title: es.meta.title, description: es.meta.description },
  {
    path: "/sobre-mi",
    title: es.sobreMi.meta.title,
    description: es.sobreMi.meta.description,
  },
  {
    path: "/trayectoria",
    title: esTrayectoria.meta.title,
    description: esTrayectoria.meta.description,
  },
  {
    path: "/brand-kit",
    title: es.brandKit.meta.title,
    description: es.brandKit.meta.description,
  },
  {
    path: "/design-system",
    title: es.designSystem.meta.title,
    description: es.designSystem.meta.description,
  },
  {
    path: "/accesibilidad",
    title: es.accesibilidad.meta.title,
    description: es.accesibilidad.meta.description,
  },
  {
    path: "/cookies",
    title: es.cookies.meta.title,
    description: es.cookies.meta.description,
  },
];

// Trayectoria de producto (D9 §6): mismos períodos/roles/empresas que la home,
// tal cual viven en el diccionario — sin prosa propia de este archivo.
const TRAYECTORIA = [...es.trayectoria.producto, es.trayectoria.nested[0]!];

function pageList(): string {
  return PAGES.map(({ path, title, description }) => {
    const urlEs = `${SITE_URL}${path || "/"}`;
    const urlEn = `${SITE_URL}/en${path}`;
    return `- [${title}](${urlEs}) ([EN](${urlEn})): ${description}`;
  }).join("\n");
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
    const exitNote =
      company === "TheTool" ? " Exit: adquirida por AppRadar." : "";
    const nombre = tienePagina(slug)
      ? `[${company}](${SITE_URL}/trayectoria/${slug})`
      : company;
    const caso = tienePagina(slug)
      ? ` Caso completo: «${DEEP_DIVE[slug].title}».`
      : "";
    return `- ${nombre} · ${role} (${period}): ${shortOf("es", company)}${exitNote}${caso}`;
  }).join("\n");
}

function buildLlmsTxt(): string {
  return `# Francisco López

> ${es.meta.description}

${es.contacto.intro}

## Páginas

${pageList()}

## Trayectoria (Producto)

${trayectoriaList()}

## CV

- [CV en PDF · español](${SITE_URL}${cvPath("es")}): CV bilingüe generado desde la misma fuente que esta web (ATS, texto seleccionable).
- [CV en PDF · inglés](${SITE_URL}${cvPath("en")}): versión en inglés del mismo CV.

## Contacto

- Email: mailto:${EMAIL}
- Teléfono: tel:${PHONE_TEL}
- LinkedIn: ${LINKEDIN_URL}

## Optional

- [Versión en inglés del sitio](${SITE_URL}/en): mismo contenido, en inglés.
`;
}

export const dynamic = "force-static";

export async function GET() {
  return new Response(buildLlmsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
