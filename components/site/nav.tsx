"use client";

import { Download, Menu, Moon, Sun } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

import { actionVariants } from "@/components/ui/action";
import { chromeLinkVariants } from "@/components/ui/chrome";
import { Logo } from "@/components/ui/logo";
import { cvPath, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";
import { WRAP } from "@/components/ui/layout";

export type NavDict = {
  navLabel: string;
  homeAria: string;
  downloadCv: string;
  contacto: string;
  sobreMi: string;
  menu: string;
  toggleThemeToDark: string;
  toggleThemeToLight: string;
  switchLanguage: string;
  switchLanguageShort: string;
};

// Nav sticky (BRAND.md regla 6 · PRD §6). Transición continua con el scroll:
// p = clamp(scrollY/120) cuantizado a pasos de 1/50 para limitar re-renders.
//   símbolo 48→28px · capas del split se extinguen a p/0.05 · wordmark a p/0.45 ·
//   barra 80→64px. Con prefers-reduced-motion salta en scrollY>48 (sin interpolar).
// CV/hamburguesa alternan por CSS (D7: responsive en CSS, no en JS).
// `homeHref` por defecto es "#top" (scroll al inicio en la home); las páginas
// internas pasan la URL de la home para que el logo navegue de vuelta.
// `aria-controls` ata el botón a su panel. Es una constante y no una cadena
// suelta porque los dos extremos tienen que decir lo mismo y viven a 100 líneas.
const MENU_PANEL_ID = "nav-menu";

export function Nav({
  dict,
  homeHref = "#top",
  lang,
}: {
  dict: NavDict;
  homeHref?: string;
  lang: Locale;
}) {
  // El menú deriva su propio enlace del CV a partir del locale (fuente única
  // cvPath). Las otras apariciones del CV en el home (CTA de Trayectoria y
  // Contacto) lo resuelven igual desde la página.
  const cvHref = cvPath(lang);
  const sobreMiHref = `${lang === "es" ? "" : `/${lang}`}/sobre-mi`;
  const contactoHref = `${lang === "es" ? "" : `/${lang}`}/contacto`;
  const { resolvedTheme, setTheme } = useTheme();
  const pathname = usePathname() || "/";
  const [p, setP] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Selector de idioma (toggle al otro locale conservando la página actual, D2):
  // ES sin prefijo, EN en /en. Enlace <a> nativo → navegación completa, para que
  // el SSR sirva el diccionario del nuevo locale y `<html lang>` se actualice.
  // Se despoja cualquier segmento de locale inicial: en el prerender estático
  // usePathname trae la ruta interna con prefijo (/es/..., /en/...), mientras que
  // en runtime el ES va sin prefijo (/...). Quitando /es|/en el subpath es el
  // mismo en ambos casos → sin desajuste de hidratación.
  const subpath = pathname.replace(/^\/(es|en)(?=\/|$)/, "") || "/";
  const altHref =
    lang === "en" ? subpath : subpath === "/" ? "/en" : `/en${subpath}`;
  const isSobreMi = subpath === "/sobre-mi";
  const isContacto = subpath === "/contacto";

  useEffect(() => {
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let raf = 0;
    const compute = () => {
      raf = 0;
      const next = reduce
        ? window.scrollY > 48
          ? 1
          : 0
        : Math.round(Math.min(1, Math.max(0, window.scrollY / 120)) * 50) / 50;
      setP((prev) => (prev === next ? prev : next));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // ESC CIERRA EL MENÚ Y DEVUELVE EL FOCO AL BOTÓN (P70.06, pasada con NVDA).
  // No había NINGÚN manejador de teclado en este archivo: durante la pasada
  // pareció que Esc cerraba, y era el lector saliendo de modo foco, no el menú.
  // No incumplía WCAG 2.1.2 —se puede tabular fuera, no hay trampa— pero es la
  // expectativa universal de cualquier desplegable.
  //
  // El listener va en `document` y SOLO existe mientras el menú está abierto: un
  // manejador local en el panel no se enteraría con el foco en el botón, que es
  // justo donde está al abrirlo. Devolver el foco es la otra mitad del gesto —al
  // cerrar, el panel deja de existir y el foco caería al `<body>`.
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMenuOpen(false);
      menuButtonRef.current?.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const symH = 48 - 20 * p;
  const splitOpacity = Math.max(0, Math.min(1, 1 - p / 0.05));
  const barMinHeight = 80 - 16 * p;
  const nameO = Math.max(0, Math.min(1, 1 - p / 0.45));
  const isDark = resolvedTheme === "dark";

  return (
    <header
      className="border-border sticky top-0 z-50 border-b backdrop-blur-[10px]"
      style={{
        // Frosted translúcido al 86%. Se mezcla en sRGB, no en oklch: mezclar con
        // `transparent` en oklch deja el tono en `none` (hue powerless) y el nav
        // pierde el matiz del fondo → se ve gris/rosado junto al body. En sRGB el
        // tono se conserva y el nav casa con el fondo cuando no hay scroll debajo.
        background: "color-mix(in srgb, var(--background) 86%, transparent)",
      }}
    >
      {/* LA BARRA ES UN LANDMARK DE NAVEGACIÓN, Y ANTES NO LO ERA (P70.09).
          Aquí ponía que el grupo de controles «no es navegación de sitio, así
          que <div>», para evitar un segundo landmark sin nombre único. El
          razonamiento tenía dos huecos: `aria-label` da landmark Y nombre único
          a la vez, así que la pega que evitaba no existía; y la premisa era
          discutible —el logo lleva a Inicio y «Sobre mí» y «Contacto» llevan a
          sus páginas: eso es navegación—. En la práctica, quien pulsaba D
          buscando la navegación no la encontraba en la home: el único
          «navegación» que sonaba era el del pie.

          ENVUELVE TAMBIÉN AL LOGO Y AL PANEL DEL MENÚ, que es lo que hace que el
          landmark contenga toda la navegación de la barra y no una parte. El
          toggle de tema queda dentro sin ser navegación; es el coste de que la
          barra sea UN landmark en vez de dos. */}
      <nav aria-label={dict.navLabel}>
        <div
          className={cn(WRAP, "flex items-center justify-between gap-4")}
          style={{ minHeight: `${barMinHeight}px` }}
        >
          <a
            href={homeHref}
            aria-label={dict.homeAria}
            className="text-foreground inline-flex items-center no-underline"
          >
            <span className="block shrink-0" style={{ height: `${symH}px` }}>
              <Logo splitOpacity={splitOpacity} className="h-full gap-0" />
            </span>
            {/* `max-[359px]:hidden` — POR QUÉ ESTE NÚMERO, medido el 2026-08-22.
              El nav pide 349px exactos y no cede: 20 de gutter + 217 de logo + 16
              de hueco + 96 del grupo derecho. Por debajo de 349 el SITIO ENTERO
              scrollea en horizontal, y el grupo derecho no tiene la culpa —solo
              pide 96—: manda el logo, cuyo wordmark son 168px que nunca encogen.
              Apretar gutter y hueco recupera 24 de los 29 que faltan a 320px, así
              que no llega; soltar el wordmark es la única palanca que cabe.
              Y no es una excepción: el nav ya lo suelta al hacer scroll y el
              footer no lo lleva nunca (`BRAND-logo.md` §Tabla de uso). Dejarlo
              encoger o recortarse está prohibido por la regla 6 de ese mismo
              documento — recorta glifos a mitad de letra y se lee como un bug.
              El símbolo se queda, así que el momento de marca del split sobrevive.
              359 y no 348 para tener margen real: el corte cae por debajo del
              iPhone SE (375) y de los Android de 360. */}
            <span
              className="font-display overflow-hidden text-[1.375rem] font-semibold tracking-[-0.01em] whitespace-nowrap max-[359px]:hidden"
              style={
                nameO <= 0
                  ? { opacity: 0, maxWidth: 0, marginLeft: 0 }
                  : {
                      opacity: nameO,
                      maxWidth: "none",
                      marginLeft: "0.6rem",
                      transform: `translateX(${(-(1 - nameO) * 8).toFixed(1)}px)`,
                    }
              }
            >
              Francisco López
            </span>
          </a>

          {/* Grupo de controles: CV · Contacto · Sobre mí · idioma · tema · menú. */}
          <div className="flex items-center gap-1.5">
            {/* Descarga un archivo → lleva icono (regla del icono, P37.5988). Era el
              caso testigo del problema: el MISMO «Descargar CV» se veía de tres
              formas —pelado aquí, con icono en Trayectoria y en los canales de
              contacto— porque cada punto de uso lo decidía por su cuenta. El
              tamaño lo pone `.link-chrome svg`, no esta clase. */}
            {/* `hidden md:inline-flex` pisa el `inline-flex` de la variante en el
              breakpoint pequeño: es visibilidad, no métrica, y por eso sigue aquí.

              Y ES `md` (768) DESDE P67, no `sm` (640). Con dos enlaces la barra
              cabía en 640; con el tercero —Contacto— MIDE 701 y desborda 61px.
              Se midió al añadirlo, que era la condición que dejó escrita P65.6
              cuando cerró el scroll horizontal de la carpintería.
              Subir el punto de aparición es la corrección barata: entre 640 y
              767 los tres siguen tras la hamburguesa, que es donde ya estaban, y
              no hay que apretar tipografía ni huecos para hacer sitio. El
              selector de idioma sube con ellos porque comparte la fila. */}
            <a
              href={cvHref}
              download
              className={cn(
                chromeLinkVariants({ shape: "bar" }),
                "hidden text-[0.88rem] md:inline-flex",
              )}
            >
              <Download aria-hidden="true" />
              {dict.downloadCv}
            </a>
            {/* CONTACTO VA ENTRE EL CV Y SOBRE MÍ (P67): el orden es CV · Contacto ·
              Sobre mí, de la acción más buscada a la más de contexto. NO lleva
              icono: la regla mira la acción, y navegar dentro del sitio no saca
              al usuario de él. */}
            <a
              href={contactoHref}
              aria-current={isContacto ? "page" : undefined}
              className={cn(
                chromeLinkVariants({ shape: "bar" }),
                "hidden text-[0.88rem] aria-[current=page]:underline md:inline-flex",
              )}
            >
              {dict.contacto}
            </a>
            <a
              href={sobreMiHref}
              aria-current={isSobreMi ? "page" : undefined}
              className={cn(
                chromeLinkVariants({ shape: "bar" }),
                "hidden text-[0.88rem] aria-[current=page]:underline md:inline-flex",
              )}
            >
              {dict.sobreMi}
            </a>
            {/* @fuera-de-capa: etiqueta de dos letras, el ancho lo daba el texto y el suelo
              táctil se escribe aquí; verificado el 2026-08-18 (2026-08-18) */}
            <a
              href={altHref}
              hrefLang={lang === "en" ? "es" : "en"}
              aria-label={dict.switchLanguage}
              // `min-w-[44px]` + `justify-center` se quedan en el call site y NO
              // suben a la variante: hay un solo control así en todo el sitio, y una
              // variante con un único uso solo añade indirección (misma decisión que
              // el switch del consentimiento, BRAND.md). El motivo, de P37.598: la
              // etiqueta son dos letras («EN»/«ES»), así que el ancho lo daba el
              // texto y se quedaba en 38px — alto correcto, ancho no. El objetivo
              // táctil son las DOS dimensiones.
              className={cn(
                chromeLinkVariants({ shape: "bar", tone: "muted" }),
                "hidden min-w-[44px] justify-center px-[0.6rem] text-[0.85rem] md:inline-flex",
              )}
            >
              {dict.switchLanguageShort}
            </a>
            {/* EL NOMBRE DICE A QUÉ TEMA LLEVA (P70.07, pasada con NVDA). Era fijo
              —«Cambiar tema»—, así que quien no ve no sabía en qué tema estaba
              ANTES de pulsar ni que había cambiado DESPUÉS: al activarlo no se
              anunciaba nada. Con el nombre en el destino, la mitad de antes la
              da el propio nombre y la de después la da el cambio de nombre del
              elemento enfocado, que es lo que el lector reanuncia.

              NO ES `aria-pressed` NI UNA LIVE REGION. `aria-pressed` sobre un
              nombre que ya cambia dice dos veces la misma cosa y con vocabulario
              de otro control; y una live region para esto es más maquinaria de
              la necesaria, y abriría la pregunta de qué más debería anunciarse.

              Y NO SALE DE `resolvedTheme`, QUE ES LA TRAMPA: en SSR es
              `undefined`, así que un `aria-label` derivado de él se renderizaría
              con un valor en el servidor y otro tras hidratar. Los dos nombres se
              conmutan por CSS con la MISMA pareja de clases que ya conmuta los
              iconos aquí debajo, que es por lo que este botón nunca ha tenido
              desajuste de hidratación. `hidden` es `display:none`, y lo que no
              se renderiza no entra en el nombre accesible. */}
            <button
              type="button"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className={cn(
                actionVariants({ variant: "icon", size: "icon" }),
                "ml-0.5",
              )}
            >
              <span className="sr-only dark:hidden">
                {dict.toggleThemeToDark}
              </span>
              <span className="sr-only hidden dark:inline">
                {dict.toggleThemeToLight}
              </span>
              {/* Sin tamaño a mano: lo pone `size: "icon"` de la variante. */}
              <Moon className="dark:hidden" aria-hidden="true" />
              <Sun className="hidden dark:block" aria-hidden="true" />
            </button>
            {/* EL BOTÓN DE TEMA VA DELANTE (P70.06). El panel del menú es hermano de
              esta barra, así que su sitio en el DOM es DESPUÉS de todo el grupo
              de controles: con la hamburguesa penúltima, el primer Tab tras
              abrir el menú llevaba al toggle claro/oscuro y solo entonces a los
              enlaces. Se oyó en la pasada con NVDA y se confirmó leyendo el JSX.
              La palanca barata es el ORDEN, no mover el foco a mano: la
              hamburguesa pasa a ser el último control y el panel viene justo
              detrás, que es la estructura del patrón de disclosure de la APG.
              En escritorio no cambia nada —la hamburguesa es `md:hidden`—; en
              móvil los dos iconos intercambian sitio. */}
            <button
              type="button"
              ref={menuButtonRef}
              aria-label={dict.menu}
              aria-expanded={menuOpen}
              aria-controls={MENU_PANEL_ID}
              onClick={() => setMenuOpen((o) => !o)}
              className={cn(
                actionVariants({ variant: "icon", size: "icon" }),
                "md:hidden",
              )}
            >
              <Menu aria-hidden="true" />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div
            id={MENU_PANEL_ID}
            className="border-border bg-background border-t md:hidden"
          >
            <div className={cn(WRAP, "flex flex-col pt-2 pb-[0.85rem]")}>
              <a
                href={cvHref}
                download
                onClick={() => setMenuOpen(false)}
                className={cn(
                  chromeLinkVariants({ shape: "stack" }),
                  "text-[0.95rem]",
                )}
              >
                <Download aria-hidden="true" />
                {dict.downloadCv}
              </a>
              <a
                href={contactoHref}
                aria-current={isContacto ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  chromeLinkVariants({ shape: "stack" }),
                  "text-[0.95rem] aria-[current=page]:underline",
                )}
              >
                {dict.contacto}
              </a>
              <a
                href={sobreMiHref}
                aria-current={isSobreMi ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  chromeLinkVariants({ shape: "stack" }),
                  "text-[0.95rem] aria-[current=page]:underline",
                )}
              >
                {dict.sobreMi}
              </a>
              <a
                href={altHref}
                hrefLang={lang === "en" ? "es" : "en"}
                aria-label={dict.switchLanguage}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  chromeLinkVariants({ shape: "stack" }),
                  "text-[0.95rem]",
                )}
              >
                {dict.switchLanguageShort}
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
