// Metadata de página: una sola forma para todas (D45).
//
// POR QUÉ EXISTE. Las cinco páginas internas y el layout repetían el MISMO bloque
// —canonical, los tres `hreflang`, el OG entero y un Twitter que lo duplica campo
// a campo—, cambiando cuatro cosas: el slug, de qué rama del diccionario sale el
// texto, qué tarjeta OG pedir y el `type`. Seis copias de un bloque que nadie
// mira dos veces.
//
// Y LO QUE SE ROMPE AHÍ NO LO CAZA NADIE: un `hreflang` mal copiado, un
// `canonical` apuntando al slug de otra página o un `x-default` olvidado no los
// ve el typecheck, ni el linter, ni axe. Solo Google, tarde. Es el mismo
// diagnóstico de D43 («eran cuatro copias privadas de la cabecera numerada») una
// capa más arriba: se refactorizó la capa de componentes y la de página se quedó
// escribiéndose a mano.
//
// LO QUE ESTE HELPER *NO* HACE: no toca `metadataBase`, `icons` ni `viewport`.
// Esos los aporta el layout de `[lang]` y se heredan; las URLs relativas de
// canonical y OG resuelven contra ese `metadataBase`.

import type { Metadata } from "next";

import {
  locales,
  defaultLocale,
  pagePath,
  type Locale,
} from "@/lib/i18n/config";
import type { PageSlug } from "@/lib/routes";
import { SITE_NAME } from "@/lib/site";

/** La rama `meta` de cualquier página del diccionario. */
export interface PageMeta {
  title: string;
  description: string;
}

export interface PageMetadataInput {
  lang: Locale;
  /**
   * Segmento tras el locale, sin barras. Vacío = la home.
   *
   * Es `PageSlug` y no `string` a propósito (D72): una página cuya carpeta existe
   * pero que nadie registró en `lib/routes.ts` NO COMPILA. Sin eso, olvidarla era
   * un hallazgo de auditoría —fuera del sitemap, fuera del gate de HTML y fuera de
   * `/llms.txt`, las tres en silencio— en vez de un error del compilador.
   */
  slug?: PageSlug;
  /** `dict.<pagina>.meta`, tal cual. */
  meta: PageMeta;
  /** `card` de `/api/og`. Por defecto, el slug — hoy coinciden en las seis. */
  ogCard?: string;
  /** `og:type`. `profile` en Sobre mí; `article` cuando llegue el deep-dive. */
  ogType?: "website" | "profile" | "article";
}

export function pageMetadata({
  lang,
  slug = "",
  meta,
  ogCard = slug,
  ogType = "website",
}: PageMetadataInput): Metadata {
  const path = pagePath(lang, slug);
  const ogImage = `/api/og?card=${ogCard}&lang=${lang}`;

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: path,
      // Derivados de `locales`, no escritos: un locale nuevo entra solo, y un
      // slug no puede desalinearse entre el canonical y su propio hreflang.
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, pagePath(l, slug)])),
        "x-default": pagePath(defaultLocale, slug),
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: path,
      siteName: SITE_NAME,
      locale: lang === "es" ? "es_ES" : "en_US",
      type: ogType,
      images: [{ url: ogImage, width: 1200, height: 630, alt: meta.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [ogImage],
    },
  };
}
