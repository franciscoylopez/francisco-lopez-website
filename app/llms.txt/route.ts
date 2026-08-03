import { EMAIL, LINKEDIN_URL, PHONE_TEL } from "@/lib/contact";
import { cvPath } from "@/lib/i18n/config";
import { SITE_URL } from "@/lib/site";

import es from "../[lang]/dictionaries/es.json";

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

function trayectoriaList(): string {
  return TRAYECTORIA.map(({ period, role, company, desc }) => {
    const exitNote =
      company === "TheTool" ? " — exit, adquirida por AppRadar." : "";
    return `- ${company} — ${role} (${period}): ${desc}${exitNote}`;
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

- [CV en PDF — español](${SITE_URL}${cvPath("es")}): CV bilingüe generado desde la misma fuente que esta web (ATS, texto seleccionable).
- [CV en PDF — inglés](${SITE_URL}${cvPath("en")}): versión en inglés del mismo CV.

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
