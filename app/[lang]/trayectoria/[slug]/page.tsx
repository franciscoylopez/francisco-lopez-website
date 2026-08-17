import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DeepDive } from "@/components/site/deep-dive";
import { DeepDiveNav } from "@/components/site/deep-dive-nav";
import { PageShell } from "@/components/site/page-shell";
import { locales, isLocale, pagePath } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/page-meta";
import { pageUrl } from "@/lib/structured-data";
import {
  experienceSlugs,
  getCommon,
  getExperience,
  getHome,
  getTrayectoriaComun,
} from "../../dictionaries";

type Params = { params: Promise<{ lang: string; slug: string }> };

/** Segmento padre. No se localiza, como el resto de rutas del sitio (D2). */
const BASE = "trayectoria";

// Página de deep-dive de una experiencia (PRD §9, V2 · sprint 1). El diseño de la
// plantilla vive en `components/site/deep-dive.tsx`; aquí solo el andamiaje.
//
// LAS DOS COSAS QUE ESTA RUTA HEREDA Y NO ESCRIBE: la metadata entera —canonical,
// los tres `hreflang`, OG y Twitter— sale de `pageMetadata` con el slug compuesto,
// y el marco —JSON-LD, nav, motion, `<main>` con enlace de salto y footer— de
// `PageShell` (D45/D46). Es el caso que esa capa existía para cubrir: seis páginas
// nuevas escritas a mano son seis `hreflang` que nadie verifica.

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    experienceSlugs.map((slug) => ({ lang, slug })),
  );
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  const t = await getExperience(lang, slug);
  if (!t) notFound();

  return pageMetadata({
    lang,
    slug: `${BASE}/${slug}`,
    meta: t.meta,
    ogType: "article",
    // TODO(P50): `/api/og` no tiene tarjeta del deep-dive todavía y una card
    // desconocida cae en la de la home. Se resuelve con el SEO de estas páginas,
    // junto con el sitemap derivado y el JSON-LD por experiencia.
    ogCard: BASE,
  });
}

export default async function ExperiencePage({ params }: Params) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getExperience(lang, slug);
  if (!dict) notFound();

  // `getHome` no es un descuido: el cierre de la página enseña el rol y el
  // periodo de las experiencias vecinas, y esos viven en la rama `trayectoria`
  // del diccionario de la home, que es quien los pinta. Cargarla aquí cuesta un
  // parseo en build y evita una cuarta copia del mismo hecho (ver `DeepDiveNav`).
  const [common, comun, home, t] = await Promise.all([
    getCommon(lang),
    getTrayectoriaComun(lang),
    getHome(lang),
    dict,
  ]);

  return (
    <PageShell
      dict={common}
      lang={lang}
      crumb={t.crumb}
      parents={[{ name: comun.crumbIndice, url: pageUrl(lang, BASE) }]}
    >
      <DeepDive
        t={t}
        comun={comun}
        breadcrumb={common.breadcrumb}
        homeHref={pagePath(lang)}
        indexHref={pagePath(lang, BASE)}
        lang={lang}
        slug={slug}
      />
      <DeepDiveNav
        slug={slug}
        tray={home.trayectoria}
        comun={comun}
        hrefDe={(s) => pagePath(lang, `${BASE}/${s}`)}
        disponibles={experienceSlugs}
      />
    </PageShell>
  );
}
