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

type ShellDict = {
  nav: NavDict;
  footer: FooterDict;
  breadcrumb: { home: string };
};

type PageShellProps = {
  dict: ShellDict;
  lang: Locale;
  children: ReactNode;
} & ({ crumb: string; jsonLd?: never } | { crumb?: never; jsonLd: object });

export function PageShell(props: PageShellProps) {
  const { dict, lang, children } = props;

  const data =
    props.crumb === undefined
      ? props.jsonLd
      : breadcrumbLd([
          { name: dict.breadcrumb.home, url: homeUrl(lang) },
          { name: props.crumb },
        ]);

  return (
    <>
      <JsonLd data={data} />
      <Nav
        dict={dict.nav}
        homeHref={props.crumb === undefined ? undefined : pagePath(lang)}
        lang={lang}
      />
      <RevealRoot>
        <main id={MAIN_ID} tabIndex={-1}>
          {children}
        </main>
      </RevealRoot>
      <Footer dict={dict.footer} lang={lang} />
    </>
  );
}
