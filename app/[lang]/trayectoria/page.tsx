import type { Metadata } from "next";

import { PageShell } from "@/components/site/page-shell";
import { TrayectoriaIndice } from "@/components/site/trayectoria-indice";
import type { ExperienceSlug } from "@/content/experiences";
import { pagePath, cvPath } from "@/lib/i18n/config";
import {
  localeDe,
  metadataDePagina,
  paramsPorLocale,
  type LangParams,
} from "@/lib/page-route";
import {
  experienceSlugs,
  getCommon,
  getExperience,
  getTrayectoriaComun,
  getTrayectoriaIndice,
} from "../dictionaries";

const SLUG = "trayectoria";

export function generateStaticParams() {
  return paramsPorLocale();
}

export async function generateMetadata({
  params,
}: LangParams): Promise<Metadata> {
  // Misma tarjeta OG que las cinco páginas, y con el mismo cabo suelto: `/api/og`
  // no tiene todavía la del deep-dive y una card desconocida cae en la de la
  // home. Lo cierra P50 junto con el sitemap derivado y el JSON-LD.
  return metadataDePagina(params, SLUG, getTrayectoriaIndice);
}

// ÍNDICE DEL DEEP-DIVE (P49). Las cinco tarjetas no llevan copy propio: su
// titular es el h1 de la página a la que enlazan, leído del diccionario de esa
// experiencia. Por eso esta ruta carga los CINCO diccionarios y no un resumen
// escrito aparte — es más trabajo de build a cambio de que el índice no pueda
// decir algo distinto de lo que dice la página (D57/D58).
//
// Y LOS SLUGS NO SE ESCRIBEN: salen de `experienceSlugs`, derivado del registro
// de diccionarios, que a su vez está tecleado por la unión de
// `content/experiences.ts` (D44). Una experiencia nueva entra en este índice sin
// tocar este archivo; una que se registre sin diccionario rompe el build.
export default async function TrayectoriaIndexPage({ params }: LangParams) {
  // Cuatro cargas y no dos, así que aquí no encaja `cargaPagina`: solo el locale.
  const lang = await localeDe(params);

  const [common, comun, t, claims] = await Promise.all([
    getCommon(lang),
    getTrayectoriaComun(lang),
    getTrayectoriaIndice(lang),
    Promise.all(
      experienceSlugs.map(async (slug) => {
        // `getExperience` devuelve `undefined` para un slug sin página, y aquí
        // eso no puede pasar: `experienceSlugs` sale del propio registro.
        const dict = await getExperience(lang, slug)!;
        return [slug, dict.title] as const;
      }),
    ).then(
      (pares) => Object.fromEntries(pares) as Record<ExperienceSlug, string>,
    ),
  ]);

  return (
    <PageShell dict={common} lang={lang} crumb={comun.crumbIndice}>
      <TrayectoriaIndice
        dict={t}
        comun={comun}
        claims={claims}
        breadcrumb={common.breadcrumb}
        homeHref={pagePath(lang)}
        cvHref={cvPath(lang)}
        hrefDe={(slug) => pagePath(lang, `${SLUG}/${slug}`)}
        lang={lang}
      />
    </PageShell>
  );
}
