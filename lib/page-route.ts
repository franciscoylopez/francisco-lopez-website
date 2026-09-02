// El CONTRATO DE RUTA de una página, una sola vez (P72.19, 2026-09-02).
//
// POR QUÉ EXISTE. D45 y D46 factorizaron la metadata (`pageMetadata`) y el marco
// (`PageShell`), y dejaron sin tocar lo de en medio: los siete módulos de ruta
// repetían, palabra por palabra, el mismo baile de apertura —esperar los `params`,
// validar el locale, `notFound()` si no lo es, y cargar en paralelo el diccionario
// común y el de la página—. Qlty lo marcaba como el bloque duplicado más grande del
// repo (mass 244, `brand-kit/page.tsx` ↔ `design-system/page.tsx`), pero los dos que
// señalaba eran solo los dos idénticos byte a byte: el patrón estaba en SIETE.
//
// LO QUE ESTE MÓDULO NO HACE, Y ES DELIBERADO: no genera los `export`. Los tres que
// Next exige —`generateStaticParams`, `generateMetadata` y el componente por
// defecto— se siguen escribiendo literalmente en cada `page.tsx`, por dos razones.
// La primera es de riesgo: Next los detecta analizando el módulo de forma estática,
// y devolverlos desde una fábrica es apostar a que el analizador siga el rastro —el
// precio de perder esa apuesta es que las catorce variantes dejen de
// prerenderizarse—. La segunda es de lectura: la forma de una ruta debe verse
// abriendo su archivo. Aquí se factoriza el CUERPO, que es donde estaba la copia,
// no la firma.

import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { locales, isLocale, type Locale } from "@/lib/i18n/config";
import {
  pageMetadata,
  type PageMeta,
  type PageMetadataInput,
} from "@/lib/page-meta";

/** Lo que Next entrega a un segmento `[lang]`. */
export type LangParams = { params: Promise<{ lang: string }> };

/** Un diccionario de página: lo mínimo que este módulo necesita saber de él. */
type Getter<T> = (lang: Locale) => Promise<T>;

/**
 * Las variantes estáticas de una página: un locale, y nada más. Idéntico en las
 * catorce, porque el segmento tras el locale no se localiza (D2).
 */
export function paramsPorLocale() {
  return locales.map((lang) => ({ lang }));
}

/**
 * El locale de la URL, validado. Un `lang` que no está en `locales` es un 404 y no
 * un fallo silencioso: es lo que impide que `/fr/cookies` renderice la página en
 * español con la URL equivocada.
 */
export async function localeDe(params: LangParams["params"]): Promise<Locale> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return lang;
}

/**
 * La metadata de una página con diccionario propio. `extra` es para lo poco que de
 * verdad cambia entre páginas —hoy solo el `ogType: "profile"` de Sobre mí—, y va
 * después del spread para que pueda ganarle a lo derivado.
 */
export async function metadataDePagina<T extends { meta: PageMeta }>(
  params: LangParams["params"],
  slug: PageMetadataInput["slug"],
  dict: Getter<T>,
  extra?: Omit<PageMetadataInput, "lang" | "slug" | "meta">,
): Promise<Metadata> {
  const lang = await localeDe(params);
  const t = await dict(lang);
  return pageMetadata({ lang, slug, meta: t.meta, ...extra });
}

/**
 * El locale y los dos diccionarios que toda página necesita, en una llamada y en
 * paralelo. Los getters se pasan en vez de importarse aquí porque viven en
 * `app/`, y `lib/` no importa de `app/`: la capa de abajo no conoce a la de
 * arriba.
 */
export async function cargaPagina<C, T>(
  params: LangParams["params"],
  common: Getter<C>,
  dict: Getter<T>,
): Promise<{ lang: Locale; common: C; t: T }> {
  const lang = await localeDe(params);
  const [comun, t] = await Promise.all([common(lang), dict(lang)]);
  return { lang, common: comun, t };
}
