import { actionVariants } from "@/components/ui/action";
import { chromeLinkVariants } from "@/components/ui/chrome";
import { Logo } from "@/components/ui/logo";
import { GITHUB_URL, LINKEDIN_URL } from "@/lib/contact";
import { pagePath, type Locale } from "@/lib/i18n/config";
import type { StaticPageSlug } from "@/lib/routes";
import { cn } from "@/lib/utils";

import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";

export type FooterDict = {
  copyright: string;
  brandKit: string;
  designSystem: string;
  comoSeHaCreado: string;
  accesibilidad: string;
  cookies: string;
  linkedinAria: string;
  githubAria: string;
};

/** Las etiquetas del diccionario que rotulan una página, no un canal. */
type EtiquetaDePagina = Extract<
  keyof FooterDict,
  "brandKit" | "designSystem" | "accesibilidad"
>;

// QUÉ PÁGINAS ENSEÑA EL FOOTER, y por qué esto no es un `map` del registro.
//
// El footer **selecciona** y usa **etiqueta propia**: «El Making of» no es el
// título de la página, ni su URL, ni su breadcrumb. Así que no puede derivarse
// entero de `lib/routes.ts`.
//
// Lo que sí sale de ahí es lo que se olvidaba: **que la página exista** —`slug`
// es un `StaticPageSlug`, la unión de literales del registro, así que retirar
// una página deja de COMPILAR aquí en vez de dejar un enlace muerto— y **cuál es
// su ruta**, que construye `pagePath`, la misma fuente que el canonical y los
// tres `hreflang` (D45). Lo que sigue siendo una decisión y no un automatismo es
// AÑADIR una página aquí; no todas van. Lo que D82 dejó al descubierto es que
// tampoco avisaba.
//
// LA FAMILIA son las tres páginas que documentan el sistema. Van juntas porque
// se leen juntas: quien abre una suele abrir las otras.
const FAMILIA: readonly { slug: StaticPageSlug; label: EtiquetaDePagina }[] = [
  { slug: "brand-kit", label: "brandKit" },
  { slug: "design-system", label: "designSystem" },
  { slug: "accesibilidad", label: "accesibilidad" },
];

// Footer compartido, en dos filas (P68, 2026-08-23).
//
// FILA 1 — firma · enlaces · canales, en rejilla de tres zonas. La firma lleva
// ahora el WORDMARK: es el primer uso de `showWordmark` en producción, y el nav
// sigue dibujando el suyo a mano con otro tamaño. Ojo, porque el del componente
// es un `text-lg` FIJO que no escala con el símbolo, contra la regla 5 de
// `BRAND-logo.md` — a 32px cae en el 56%, cerca del ~60% del lockup cerrado,
// pero por casualidad y no por regla. Tareado aparte.
//
// FILA 2 — línea fina: derechos a la izquierda, política de cookies a la
// derecha. Cookies deja de ser un enlace más de la fila 1 y baja aquí, que es
// donde se busca.
//
// JERARQUÍA DE LOS ENLACES. «El Making of» destaca y las tres hermanas quedan
// atenuadas detrás de un filete, y eso NO se hace con `primary`: los enlaces de
// footer son chrome (`BRAND.md` §Enlaces), así que el cian estaba descartado de
// antemano. La distinción la hace el eje que `chrome.tsx` ya tiene montado
// —`tone: "default"` contra `tone: "muted"`— más el peso. Cero piezas nuevas y
// cero pares de color nuevos.
export function Footer({ dict, lang }: { dict: FooterDict; lang: Locale }) {
  return (
    <footer className="border-border border-t">
      <div className="mx-auto max-w-[var(--container)] px-[var(--page-x)] py-[clamp(1.75rem,3.5vw,2.5rem)]">
        <div className="flex flex-col items-center gap-5 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-x-8">
          <div className="text-foreground flex items-center md:justify-self-start">
            {/* `symbolPx` y `h-8` dicen lo mismo (32px) porque son dos cosas
                distintas: la clase dimensiona el SVG y el número le dice al
                wordmark contra qué escalar. El componente no puede leer una
                clase de Tailwind, así que el tipo obliga a pasar el número
                cuando hay wordmark. */}
            <Logo variant="flat" showWordmark symbolPx={32} className="h-8" />
          </div>

          {/* EN MÓVIL los cuatro enlaces envolvían uno a uno, así que la familia
              se partía —«Accesibilidad» sola en la línea siguiente— y el filete
              se quedaba varado a mitad de la primera. La familia va en su PROPIA
              caja: el corte cae entre el destacado y el grupo, que es donde
              significa algo. En `md` vuelven a la misma fila; el filete tarda un
              poco más en aparecer, y su porqué está en su propia nota aquí abajo.
              El tamaño de texto (0,9rem) es la tipografía de esta fila, no una
              métrica del enlace, así que se queda aquí — ver `chrome.tsx`. */}
          <nav className="flex flex-col items-center gap-y-2 md:flex-row md:flex-wrap md:gap-x-5 md:justify-self-center">
            <a
              href={pagePath(lang, "como-se-ha-creado")}
              className={cn(
                chromeLinkVariants({ tone: "default" }),
                "text-[0.9rem] font-semibold",
              )}
            >
              {dict.comoSeHaCreado}
            </a>
            {/* EL FILETE APARECE A 820, NO EN `md` (2026-08-23, design-review).
                La fila vuelve a una línea en `md` (768) solo sobre el papel: con
                el copy más largo de los dos idiomas —el ES— sigue envolviendo
                hasta **818px**, así que entre 768 y 818 el filete se quedaba a la
                derecha de «El Making of» con la familia ya en la línea siguiente
                y NADA a su otro lado. Es el mismo fallo que esta caja arregló en
                móvil, movido de sitio en vez de eliminado, y 768×1024 es iPad
                vertical, o sea un dispositivo real y no un hueco entre
                breakpoints.

                El número está MEDIDO, no elegido: 818 es donde deja de envolver
                en ES (en EN cabe antes), y se deja 2px de margen. Y se mide CON
                el filete puesto, que es la trampa de este arreglo: el propio
                filete ocupa 9px con sus márgenes, así que esconderlo adelanta el
                punto donde la fila cabe. Medir sin él daría un umbral optimista
                para un estado que no existe. Va aquí y no en
                un breakpoint del sistema porque no describe un tamaño de
                pantalla, describe cuándo cabe ESTA fila — y si mañana cambia una
                etiqueta, este es el número que hay que volver a medir. */}
            <span
              aria-hidden="true"
              className="bg-border mx-1 hidden h-5 w-px min-[820px]:block"
            />
            <span className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
              {FAMILIA.map(({ slug, label }) => (
                <a
                  key={slug}
                  href={pagePath(lang, slug)}
                  className={cn(
                    chromeLinkVariants({ tone: "muted" }),
                    "text-[0.9rem]",
                  )}
                >
                  {dict[label]}
                </a>
              ))}
            </span>
          </nav>

          {/* Los dos canales de icono. El suelo táctil de 44px lo pone la
              variante `icon` y no depende de que nadie se acuerde (P37.595,
              cuando estaban a 40×40); el hueco de 0,25rem deja sus dos áreas
              separadas sin que la pareja se lea como dos bloques distintos. */}
          <div className="flex flex-none items-center gap-1 md:justify-self-end">
            {[
              { href: GITHUB_URL, label: dict.githubAria, Icon: GithubIcon },
              {
                href: LINKEDIN_URL,
                label: dict.linkedinAria,
                Icon: LinkedinIcon,
              },
            ].map(({ href, label, Icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={actionVariants({ variant: "icon", size: "icon" })}
              >
                {/* Sin tamaño a mano: lo pone `size: "icon"` de la variante. */}
                <Icon />
              </a>
            ))}
          </div>
        </div>

        <div className="border-border mt-5 flex flex-col items-center justify-between gap-2 border-t pt-4 sm:flex-row">
          <span className="text-muted-foreground text-[0.8rem]">
            {dict.copyright}
          </span>
          <a
            href={pagePath(lang, "cookies")}
            className={cn(
              chromeLinkVariants({ tone: "muted" }),
              "text-[0.8rem]",
            )}
          >
            {dict.cookies}
          </a>
        </div>
      </div>
    </footer>
  );
}
