import type { ReactNode } from "react";

import { pagePath, type Locale } from "@/lib/i18n/config";
import { breadcrumbLd, homeUrl } from "@/lib/structured-data";

import { Footer } from "./footer";
import type { FooterDict } from "./footer";
import { JsonLd } from "./json-ld";
import { Nav } from "./nav";
import type { NavDict } from "./nav";
import { RevealRoot } from "./reveal-root";

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
// Lo que NO entra aquí es el `<main>`: hoy lo pone cada componente de contenido.

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
      <RevealRoot>{children}</RevealRoot>
      <Footer dict={dict.footer} lang={lang} />
    </>
  );
}
