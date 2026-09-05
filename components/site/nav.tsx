"use client";

import { Download, Menu, Moon, Sun } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { actionVariants } from "@/components/ui/action";
import { chromeLinkVariants } from "@/components/ui/chrome";
import { Logo } from "@/components/ui/logo";
import { cvPath, type Locale, pagePath } from "@/lib/i18n/config";
import { internalSlug } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { WRAP } from "@/components/ui/layout";

export type NavDict = {
  navLabel: string;
  homeAria: string;
  downloadCv: string;
  /**
   * LA MISMA PALABRA QUE EL BREADCRUMB, y no por gusto: `crumbIndice` de
   * `trayectoria/comun.json` nombra esta misma página en el rastro de migas, así
   * que dos redacciones distintas serían el sitio llamando de dos formas al
   * mismo destino en dos superficies de chrome. Vive aquí porque el nav lo pinta
   * en las catorce páginas y solo carga `common` (D48), y lo ata a la otra
   * `tests/etiquetas-chrome.test.ts`.
   */
  trayectoria: string;
  contacto: string;
  sobreMi: string;
  menu: string;
  toggleThemeToDark: string;
  toggleThemeToLight: string;
  switchLanguage: string;
  switchLanguageShort: string;
};

/**
 * LOS DOS UMBRALES DE LA RAMA `prefers-reduced-motion`, en píxeles de scroll:
 * se ENTRA en compacto por encima de `ENTRADA` y se SALE por debajo de
 * `SALIDA`. La banda entre ambos es la histéresis. Ver el efecto de scroll.
 */
/** La preferencia del sistema, escrita una vez: la leen el snapshot y la suscripción. */
const REDUCE_MOTION = "(prefers-reduced-motion: reduce)";

/**
 * LAS TRES FUNCIONES DE `useSyncExternalStore`, A NIVEL DE MÓDULO Y NO INLINE.
 * No es estilo: el hook RE-SUSCRIBE cada vez que `subscribe` cambia de
 * identidad, así que escritas dentro del componente se desconectaba y se volvía a
 * conectar el listener en cada render. Fuera, la identidad es estable y la
 * suscripción se hace una vez.
 *
 * El snapshot de servidor es `false` a propósito: en el prerender no hay
 * preferencia que consultar, así que se sirve el estado no reducido y el primer
 * snapshot de cliente lo corrige si hace falta.
 */
const suscribirAReduce = (avisar: () => void) => {
  const mq = window.matchMedia?.(REDUCE_MOTION);
  mq?.addEventListener("change", avisar);
  return () => mq?.removeEventListener("change", avisar);
};
const leerReduce = () => window.matchMedia?.(REDUCE_MOTION).matches ?? false;
const reduceEnServidor = () => false;

const ENTRADA = 48;
const SALIDA = 32;

// Nav sticky (BRAND.md regla 6 · PRD §6). Transición continua con el scroll:
// p = clamp(scrollY/120) cuantizado a pasos de 1/50 para limitar re-renders.
//   símbolo 48→28px · capas del split se extinguen a p/0.05 · wordmark a p/0.45.
// Con prefers-reduced-motion salta, sin interpolar, y con histéresis: entra en
// compacto por encima de 48px y sale por debajo de 32 (P82; antes era un
// solo corte en 48 y vibraba con el vaivén del scroll).
//
// LA BARRA NO ENCOGE, Y HASTA EL 2026-09-03 IBA DE 80 A 64px (D188). No es una
// simplificación: es lo que costaba. Animar su `min-height` repinta a cada paso
// una franja opaca, sticky y de ancho completo, y eso eran 20,6 tareas de más de
// 16,7 ms por gesto de scroll en un móvil estrangulado ×4, contra 3,0 con la
// barra quieta. La cuantización a 1/50 limita los re-renders, que no era la
// factura; la factura era el repintado.
//
// Y NO SE FUE CON ELLA LA COMPACTACIÓN: la cuentan el símbolo 48→28 y el
// wordmark que se va. El método, el reparto por pieza y lo descartado, en D188.
// CV/hamburguesa alternan por CSS (D7: responsive en CSS, no en JS).
// `homeHref` por defecto es "#top" (scroll al inicio en la home); las páginas
// internas pasan la URL de la home para que el logo navegue de vuelta.
// `aria-controls` ata el botón a su panel. Es una constante y no una cadena
// suelta porque los dos extremos tienen que decir lo mismo y viven a 100 líneas.
const MENU_PANEL_ID = "nav-menu";

/** Una página del sitio en el nav: a dónde va, si es la actual y cómo se llama. */
type PaginaNav = { href: string; actual: boolean; etiqueta: string };

/**
 * LOS ENLACES DE PÁGINA, EN LAS DOS FORMAS EN QUE SE PINTAN (P72.505). La fila
 * de escritorio y el panel del móvil son la misma navegación en dos formatos, y
 * estaban escritos dos veces: con dos listas, un enlace nuevo podía entrar en una
 * y no en la otra. Lo único que de verdad cambia es la forma del enlace y que en
 * el panel, al pulsar, hay que cerrarlo.
 *
 * VIVE FUERA DE `Nav` A PROPÓSITO, y no por estilo: `qlty` suma las funciones
 * ANIDADAS al padre, así que dos `map` dentro del componente cuentan como
 * complejidad suya. El trinquete de deuda lo cazó al añadir el cuarto enlace
 * —43 → 46— y esto es lo que lo devuelve por debajo del sello en vez de
 * re-sellarlo.
 *
 * Y NO CAMBIA UN BYTE DEL HTML: `onClick` no se serializa, así que la forma de
 * barra emite exactamente los mismos atributos y en el mismo orden que cuando
 * estaban escritos a mano. Comprobado con `npm run gate:html` sobre las 28
 * variantes.
 */
function EnlacesDePagina({
  paginas,
  forma,
  onNavegar,
}: {
  paginas: PaginaNav[];
  forma: "bar" | "stack";
  onNavegar?: () => void;
}) {
  const extra =
    forma === "bar"
      ? "hidden text-[0.88rem] aria-[current=page]:underline md:inline-flex"
      : "text-[0.95rem] aria-[current=page]:underline";
  return (
    <>
      {paginas.map((p) => (
        <a
          key={p.href}
          href={p.href}
          aria-current={p.actual ? "page" : undefined}
          onClick={onNavegar}
          className={cn(chromeLinkVariants({ shape: forma }), extra)}
        >
          {p.etiqueta}
        </a>
      ))}
    </>
  );
}

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
  // POR `pagePath` Y NO A MANO (P72.56). Estos tres construían el prefijo de
  // locale con su propio ternario, que era una copia del de `pagePath` — y desde
  // que el inglés traduce sus slugs habría sido además una copia FALSA: el nav
  // habría enlazado a `/en/sobre-mi`, que ya solo es una redirección.
  const trayectoriaHref = pagePath(lang, "trayectoria");
  const sobreMiHref = pagePath(lang, "sobre-mi");
  const contactoHref = pagePath(lang, "contacto");
  const { resolvedTheme, setTheme } = useTheme();
  const pathname = usePathname() || "/";
  const [p, setP] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  // El estado del símbolo en la rama `reduce`, para que el umbral pueda mirar de
  // dónde viene. Va en una ref y no en el propio `p` porque `compute` corre en un
  // rAF: leer el estado desde el cierre daría el valor del render anterior.
  const compactoRef = useRef(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Selector de idioma (toggle al otro locale conservando la página actual, D2):
  // ES sin prefijo, EN en /en. Enlace <a> nativo → navegación completa, para que
  // el SSR sirva el diccionario del nuevo locale y `<html lang>` se actualice.
  // Se despoja cualquier segmento de locale inicial: en el prerender estático
  // usePathname trae la ruta interna con prefijo (/es/..., /en/...), mientras que
  // en runtime el ES va sin prefijo (/...). Quitando /es|/en el subpath es el
  // mismo en ambos casos → sin desajuste de hidratación.
  const subpath = pathname.replace(/^\/(es|en)(?=\/|$)/, "") || "/";
  // EL SLUG INTERNO, QUE ES LO ÚNICO IGUAL EN LOS DOS IDIOMAS Y EN LOS DOS
  // MOMENTOS (P72.56). Comparar la RUTA dejó de valer cuando el inglés tradujo
  // sus slugs, y por partida doble: `/en/about` no es `/sobre-mi`, y además
  // `usePathname()` trae la ruta interna en el prerender y la pública en runtime
  // —el rewrite del proxy pasa por medio—, así que la misma página daba dos
  // cadenas distintas. `internalSlug` acepta las dos formas y devuelve una.
  const slugActual = internalSlug(lang, subpath.replace(/^\/|\/+$/g, ""));
  // El conmutador de idioma sale del mismo slug, así que la página se conserva
  // aunque su ruta cambie de nombre al cruzar: `/en/about` ↔ `/sobre-mi`.
  const altHref = pagePath(lang === "en" ? "es" : "en", slugActual);
  const isSobreMi = slugActual === "sobre-mi";
  const isContacto = slugActual === "contacto";
  // SOLO EL ÍNDICE, no los cinco casos: `aria-current="page"` dice «estás en
  // ESTA página», no «estás en esta rama». En `/trayectoria/emendu` quien indica
  // dónde estás es el breadcrumb, que para eso lleva los tres niveles.
  const isTrayectoria = slugActual === "trayectoria";

  /**
   * LAS PÁGINAS DEL NAV, EN SU ORDEN, Y ESCRITAS UNA VEZ (P72.505). Las pintan
   * la fila de escritorio y el panel del móvil, que son la misma navegación en
   * dos formatos: con dos listas, un enlace nuevo podía entrar en una y no en la
   * otra. El CV no entra aquí porque no es una página de este sitio: se descarga,
   * lleva icono por eso, y no tiene estado de «estás aquí».
   *
   * EL ORDEN ES CV · TRAYECTORIA · SOBRE MÍ · CONTACTO, y cambia el de P67 —que
   * era CV · Contacto · Sobre mí, «de la acción más buscada a la más de
   * contexto»—. Ahora la fila cuenta un recorrido: las credenciales, lo que se ha
   * hecho, quién lo hizo y cómo hablar. Contacto se queda en el extremo a
   * propósito, que es donde termina esa lectura.
   *
   * TRAYECTORIA ENTRA PORQUE ERA UNA PÁGINA HUÉRFANA. Medido sobre el HTML
   * servido de las catorce: recibía CINCO enlaces entrantes y los cinco eran el
   * breadcrumb de sus propios hijos. Cero desde la home, cero desde el footer.
   * Estaba en el sitemap y no había forma de llegar sin entrar antes a un caso.
   *
   * Y NINGUNO LLEVA ICONO: la regla mira la ACCIÓN, y navegar dentro del sitio no
   * saca al usuario de él.
   */
  const PAGINAS: PaginaNav[] = [
    {
      href: trayectoriaHref,
      actual: isTrayectoria,
      etiqueta: dict.trayectoria,
    },
    { href: sobreMiHref, actual: isSobreMi, etiqueta: dict.sobreMi },
    { href: contactoHref, actual: isContacto, etiqueta: dict.contacto },
  ];

  /** Todo lo que se pulsa en el panel del móvil lo cierra; escrito una vez. */
  const cerrarMenu = () => setMenuOpen(false);

  // LA PREFERENCIA SE ESCUCHA, NO SE MIRA UNA VEZ *(P82)*. Estaba leída con
  // `.matches` dentro del efecto de scroll, así que el valor quedaba capturado en
  // el cierre: quien activaba Reduce Motion con la pestaña ya abierta seguía
  // viendo la interpolación continua hasta recargar. Es el mismo patrón que el
  // tema ya usa, y el suscribirse es lo que lo hace cierto en el momento en que
  // el usuario lo pide.
  //
  // `useSyncExternalStore` y no un efecto con `setState`: el media query ES una
  // fuente externa, y suscribirse desde un efecto para copiar su valor a estado
  // es justo el patrón que React desaconseja (y que el linter marca). El
  // snapshot de servidor es `false` a propósito: en el prerender no hay
  // preferencia que consultar, así que se sirve el estado no reducido y el
  // primer snapshot de cliente lo corrige si hace falta.
  const reduce = useSyncExternalStore(
    suscribirAReduce,
    leerReduce,
    reduceEnServidor,
  );

  // EL UMBRAL DE LA RAMA `reduce` TIENE DOS PUNTOS DE CORTE, Y NO UNO *(P82)*.
  // Con un solo corte en 48px, un scroll que se quedara parado justo ahí hacía
  // saltar el símbolo 48↔28px con cada píxel de vaivén — o sea, movimiento
  // repetido justo en el estado que quien activa esa preferencia ha pedido que NO
  // se mueva. Se entra en compacto por encima de 48 y se sale por debajo de 32:
  // los 16px de banda son más que cualquier vaivén de un dedo o de una rueda.
  //
  // Y CON `reduce` SALTA TODO, TAMBIÉN EL FUNDIDO DEL WORDMARK, que la ficha
  // dejaba abierto por D136 («reduced-motion retira lo que DESPLAZA o ESCALA, no
  // lo que se funde»). Se queda como está, y el motivo está en la otra mitad de
  // esa misma regla: solo se apaga entera la animación «que es movimiento de
  // principio a fin, o la que va ACOPLADA AL SCROLL, que es la que nombra WCAG
  // 2.3.3» (CLAUDE.md §a11y, punto 7). Este fundido no corre contra un reloj:
  // corre contra la rueda del usuario, y es exactamente el caso nombrado. Dejarlo
  // vivo separaría además las dos piezas del mismo gesto: el nombre
  // desvaneciéndose mientras el símbolo pega un salto.
  useEffect(() => {
    let raf = 0;
    const compute = () => {
      raf = 0;
      let next: number;
      if (reduce) {
        const compacto =
          window.scrollY > (compactoRef.current ? SALIDA : ENTRADA);
        compactoRef.current = compacto;
        next = compacto ? 1 : 0;
      } else {
        next =
          Math.round(Math.min(1, Math.max(0, window.scrollY / 120)) * 50) / 50;
      }
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
  }, [reduce]);

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
  const nameO = Math.max(0, Math.min(1, 1 - p / 0.45));
  const isDark = resolvedTheme === "dark";

  return (
    // LA BARRA ES OPACA, Y HASTA EL 2026-09-02 ERA UN FROSTED AL 86 %.
    //
    // Lo que la cambió es una medición, no una preferencia. Con el velo al 86 %,
    // el 14 % restante deja pasar la foto de la página, y los enlaces del menú en
    // su estado compacto caían a **4,67:1** sobre `/trayectoria/kuotip` en oscuro:
    // cumplen AA y no llegan a AAA, que es el objetivo declarado del sitio.
    //
    // Y NO SE ARREGLABA SUBIENDO EL VELO. Se midió la escalera entera sobre los
    // cuatro casos peores, fotografiando el píxel pintado: 90 % → 5,35 · 92 % →
    // 5,67 · 95 % → 6,16 · 97 % → 6,56. La curva es asintótica, así que al 97 % la
    // barra ya es casi opaca a la vista y el peor par sigue por debajo del 7. Solo
    // el opaco lo resuelve, y lo resuelve **por construcción**: detrás del texto
    // vuelve a haber un color en vez de tantos como píxeles, y ese par —chrome
    // sobre `--background`— es de los que el censo ya mide en AAA en las catorce
    // páginas.
    //
    // SE VA CON ÉL EL `backdrop-blur-[10px]`, que ya no difumina nada.
    //
    // Y NO NECESITA `data-surface`: pinta exactamente `--background`, que es la
    // superficie de la página, así que el atenuado que hereda ya es el correcto.
    // La regla de BRAND.md pide declarar familia a quien se pinta una superficie
    // PROPIA; esta no lo es. La medición completa, en `DECISIONS.md` D184.
    <header className="border-border bg-background sticky top-0 z-50 border-b">
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
          className={cn(
            WRAP,
            "flex min-h-[80px] items-center justify-between gap-4",
          )}
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
              iPhone SE (375) y de los Android de 360.

              `md:max-lg:hidden` — LA SEGUNDA VENTANA, y sale de la misma palanca
              (P72.505, 2026-09-04). Con el cuarto enlace la fila mide 730px de
              contenido y a 768 desborda 48: el toggle de tema se sale de la
              pantalla y el sitio entero scrollea en horizontal. Se midieron las
              tres salidas con los cuatro enlaces puestos, y las capturas las vio
              Francisco antes de decidir: colapsar el menú en `lg` deja la franja
              768–1023 sin «Descargar CV», que es uno de los tres puntos de
              descarga medidos; acortar la etiqueta a «CV» cabe con 25px; soltar
              el wordmark cabe con 38, los mismos que hoy. Eligió soltar el
              wordmark.

              Y ES LA MISMA REGLA DE ARRIBA, no una excepción nueva: cuando el
              nav no cabe, la palanca es el wordmark, porque es lo único de la
              fila que no encoge y lo único que la marca ya suelta en otros
              contextos (al hacer scroll, y el footer nunca lo lleva). Entre 768
              y 1023 queda el símbolo, que es la firma. */}
            <span
              className="font-display overflow-hidden text-[1.375rem] font-semibold tracking-[-0.01em] whitespace-nowrap max-[359px]:hidden md:max-lg:hidden"
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
            <EnlacesDePagina paginas={PAGINAS} forma="bar" />
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
                onClick={cerrarMenu}
                className={cn(
                  chromeLinkVariants({ shape: "stack" }),
                  "text-[0.95rem]",
                )}
              >
                <Download aria-hidden="true" />
                {dict.downloadCv}
              </a>
              <EnlacesDePagina
                paginas={PAGINAS}
                forma="stack"
                onNavegar={cerrarMenu}
              />
              <a
                href={altHref}
                hrefLang={lang === "en" ? "es" : "en"}
                aria-label={dict.switchLanguage}
                onClick={cerrarMenu}
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
