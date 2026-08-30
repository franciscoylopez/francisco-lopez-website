import type { ReactNode } from "react";

import { pagePath, type Locale } from "@/lib/i18n/config";
import { breadcrumbLd, homeUrl } from "@/lib/structured-data";

import { Footer } from "./footer";
import type { FooterDict } from "./footer";
import { JsonLd } from "./json-ld";
import { Nav } from "./nav";
import type { NavDict } from "./nav";
import { RevealRoot } from "./reveal-root";
import { MAIN_ID } from "./skip-link";

// Marco común de toda página del sitio (D45): JSON-LD, nav, isla de motion y
// footer, en ese orden. Era el mismo bloque copiado en las seis `page.tsx`, con
// el `homeHref` derivado a mano en cada una y el BreadcrumbList montado a mano en
// cinco.
//
// DOS MODOS, y el tipo obliga a elegir uno:
//  - `crumb` → página interna. El BreadcrumbList se DERIVA (Inicio › crumb) y el
//    logo del nav navega a la home.
//  - `jsonLd` → la home, que trae el suyo (ProfilePage + Person) y deja al logo
//    su comportamiento propio: `#top`, o sea, subir en vez de navegar.
//
// EL `<main>` LO PONE EL SHELL (P43). Antes lo ponía cada componente de contenido,
// con un `id="top"` que no era el destino de nada. Sube aquí porque el `<main>` es
// marco, no contenido, y sobre todo porque el enlace de salto necesita un destino
// en TODA página: puesto en el shell, una página nueva nace con él — que es el
// objetivo del bloque, que la accesibilidad se herede en vez de recordarse.
// `tabIndex={-1}` es lo que hace que el foco aterrice de verdad al saltar.
//
// Las dos páginas que no pasan por aquí —`SystemMessage` (404/error) y el 404
// global— ponen el suyo, y llevan el mismo `MAIN_ID` para no depender de que
// alguien copie bien la cadena.
//
// Y EL `<article>` TAMBIÉN LO PONE EL SHELL (P67.6), por el mismo argumento con
// el que pone el `<main>` y con el que DERIVA el `BreadcrumbList` de `parents`:
// cuando el marco lo pone, no puede divergir del contenido. El sitio tenía seis
// artículos —las cinco páginas del deep-dive y `/como-se-ha-creado`— servidos
// dentro de un `<section>`, mientras la metadata de esas mismas seis ya decía
// `og:type: "article"` y el JSON-LD de una decía `TechArticle`. Dos capas de la
// misma página afirmando cosas distintas.
//
// ES UNA PROP EXPLÍCITA Y NO SE DERIVA DEL JSON-LD, que era la primera forma
// escrita: el `@type` de la familia `Article` solo lo declara `/como-se-ha-creado`
// —las cinco del deep-dive declaran `WebPage`, y eso es correcto y no se toca—,
// así que derivarlo del `extraLd` habría cubierto una de seis. Lo que sí cubre
// las seis exactas es el `og:type`, y por ahí lo vigila `check:marco`: una página
// con `og:type=article` tiene que servir un `<article>`, y solo esa. La prop no
// es algo que haya que recordar, es algo que el gate no deja olvidar.
//
// ENVUELVE TODO EL CONTENIDO DEL `<main>`, breadcrumb y cierre de página
// incluidos. Es la imprecisión que se acepta a cambio de que el elemento lo
// ponga una sola línea: partirlo obligaría a que las dos páginas largas
// devolvieran su carpintería por separado, y `<nav>` dentro de `<article>` es
// válido y lo contempla la propia especificación.

type ShellDict = {
  nav: NavDict;
  footer: FooterDict;
  breadcrumb: { home: string };
};

type PageShellProps = {
  dict: ShellDict;
  lang: Locale;
  children: ReactNode;
  /**
   * El contenido de esta página es un ARTÍCULO: contenido autónomo y
   * redistribuible, que es la definición del elemento. Lo llevan las seis que
   * declaran `og:type: "article"` en su metadata, y `check:marco` comprueba que
   * esas dos afirmaciones dicen lo mismo en las 28 variantes.
   */
  article?: boolean;
} & (
  | {
      crumb: string;
      /**
       * Niveles INTERMEDIOS entre la home y el actual, con su URL absoluta. Hoy
       * solo las páginas del deep-dive, que son las primeras de tres niveles
       * (Inicio › Trayectoria › Empresa): el resto de internas cuelgan de la raíz.
       *
       * Va aquí y no en cada página porque el breadcrumb VISIBLE y el
       * `BreadcrumbList` tienen que decir lo mismo, y son dos listas distintas
       * escritas en dos sitios. Cuando el shell deriva una de la otra, no pueden
       * divergir; el ancestro que se olvide en el JSON-LD no lo ve nadie.
       */
      parents?: { name: string; url: string }[];
      /**
       * Un SEGUNDO bloque de JSON-LD, además del breadcrumb derivado. Hoy solo
       * las páginas del deep-dive, que declaran su `WebPage` atada al `Person`
       * de la home por `@id` (P50).
       *
       * Va como un `<script>` aparte y no fundido con el breadcrumb en un
       * `@graph` por dos razones. La buena: son dos afirmaciones independientes
       * —dónde está esta página en la jerarquía, y de qué va— y Google lee tantos
       * bloques como haya. La práctica: fundirlos cambiaría el marcado de las
       * dieciocho variantes que NO lo usan, y este bloque no las toca; con un
       * script extra, `gate:html` sale vacío en todas menos en las diez del
       * deep-dive, que es exactamente lo que se quiere de un gate.
       */
      extraLd?: object;
      jsonLd?: never;
    }
  | { crumb?: never; parents?: never; extraLd?: never; jsonLd: object }
);

export function PageShell(props: PageShellProps) {
  const { dict, lang, children } = props;

  const data =
    props.crumb === undefined
      ? props.jsonLd
      : breadcrumbLd([
          { name: dict.breadcrumb.home, url: homeUrl(lang) },
          ...(props.parents ?? []),
          { name: props.crumb },
        ]);

  return (
    <>
      <JsonLd data={data} />
      {props.extraLd ? <JsonLd data={props.extraLd} /> : null}
      <Nav
        dict={dict.nav}
        homeHref={props.crumb === undefined ? undefined : pagePath(lang)}
        lang={lang}
      />
      <RevealRoot>
        <main id={MAIN_ID} tabIndex={-1}>
          {props.article ? <article>{children}</article> : children}
        </main>
      </RevealRoot>
      <Footer dict={dict.footer} lang={lang} />
    </>
  );
}
