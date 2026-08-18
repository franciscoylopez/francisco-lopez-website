import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DeepDive } from "@/components/site/deep-dive";
import { DeepDiveNav } from "@/components/site/deep-dive-nav";
import { PageShell } from "@/components/site/page-shell";
import { locales, isLocale, pagePath } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/page-meta";
import { experienceBySlug } from "@/content/experiences";
import { experiencePageLd, pageUrl } from "@/lib/structured-data";
import {
  experienceSlugs,
  getCommon,
  getExperience,
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

// UN SLUG QUE NO EXISTE SE RECHAZA EN EL ENRUTADO, NO RENDERIZANDO. Sin esto, la
// ruta casa con CUALQUIER valor, se renderiza, llama a `notFound()` y Next busca el
// boundary `not-found` más cercano — que no existe desde que D25 borró el anidado
// (su `headers()` volvía dinámico todo `[lang]`). Sin boundary sirve su 404 pelado,
// que es lo que estas diez rutas hacían en producción: sin nav, sin footer, sin el
// «0» del split y con el `<title>` de la home.
//
// `global-not-found` no las cubría, y no es un fallo suyo: su contrato es explícito
// —cubre las URLs que no casan con NINGUNA ruta—, y `/trayectoria/loquesea` casa.
// Con `dynamicParams = false` el 404 pasa a decidirse en el enrutado, que es justo
// el caso que sí cubre. Los cinco slugs salen ya de `generateStaticParams`, así que
// no se pierde ninguna página ni deja de prerenderizarse.
export const dynamicParams = false;

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
    // Tarjeta OG PROPIA de cada experiencia (P50). `/api/og` la compone con el
    // mismo `eyebrow` y el mismo `title` que pinta la página, leídos de este
    // diccionario: compartir un deep-dive enseña el caso y no el sitio. Hasta
    // hoy las seis caían en la tarjeta de la home, que es lo que hace una card
    // desconocida.
    ogCard: `${BASE}/${slug}`,
  });
}

export default async function ExperiencePage({ params }: Params) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getExperience(lang, slug);
  if (!dict) notFound();

  // Ya no hace falta `getHome`: el rol y el periodo de las vecinas los da el
  // registro por experiencia (P48.55), que es la fuente única de esos hechos
  // desde que dejaron de escribirse en tres sitios. Esta página se ahorra el
  // parseo del diccionario de la home en build.
  const [common, comun, t] = await Promise.all([
    getCommon(lang),
    getTrayectoriaComun(lang),
    dict,
  ]);

  // La empresa sale del REGISTRO y no del diccionario: la ruta conoce el slug, y
  // escribir el nombre otra vez en cada JSON sería la sexta copia del mismo dato.
  // No puede faltar —`getExperience` ya ha respondido, así que el slug existe—,
  // pero el tipo no lo sabe y el fallback evita un `!` que mentiría.
  const experiencia = experienceBySlug(slug);

  return (
    <PageShell
      dict={common}
      lang={lang}
      crumb={t.crumb}
      parents={[{ name: comun.crumbIndice, url: pageUrl(lang, BASE) }]}
      extraLd={experiencePageLd({
        lang,
        slug,
        name: t.title,
        description: t.meta.description,
        company: experiencia?.company ?? t.crumb,
      })}
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
        lang={lang}
        comun={comun}
        hrefDe={(s) => pagePath(lang, `${BASE}/${s}`)}
        disponibles={experienceSlugs}
      />
    </PageShell>
  );
}
