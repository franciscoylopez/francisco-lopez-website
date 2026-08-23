// @pieza núcleo · design-system/09-botones.tsx · El control CON CAJA: botón, chip, toggle, pestaña y control solo-icono.

import { cva, type VariantProps } from "class-variance-authority";

// Capa de acción del sistema (P37.591/P37.592). ÚNICA fuente de verdad del aspecto
// y el comportamiento de todo elemento accionable: botones, enlaces con forma de
// botón, chips de descarga, toggles, pestañas y controles solo-icono.
//
// Por qué existe: la auditoría de diseño del 2026-08-04 encontró SEIS definiciones
// distintas de "botón base" repartidas en seis archivos (consent-banner,
// system-message, brand-kit, design-system-islands, toolkit, trayectoria), ninguna
// importando a la otra, con dos radios, cuatro hovers para la misma variante y el
// suelo de 44px reescrito a mano catorce veces —del que el footer se salió sin que
// nadie se enterara—. `components/ui/button.tsx` (shadcn) llevaba en el repo desde
// el principio con cero usos.
//
// La regla que sale de ahí, y que este archivo hace cumplir: NINGÚN elemento
// interactivo nace de una cadena de clases inline. Si el caso no encaja en una
// variante, se crea la variante; si es una excepción, la decide Francisco y se
// documenta con fecha en BRAND.md (como ContactSecondary). Cambiar un hover pasa a
// ser una línea aquí, y llega a todos los botones del sitio a la vez.
//
// CUÁNDO UNA ACCIÓN LLEVA ICONO (P37.5988). Una sola pregunta: ¿esto saca al
// usuario de la página? Descargar un archivo, abrir otra aplicación (correo,
// teléfono) o irse a otro sitio web → icono. Lo que ocurre dentro de la página
// —aceptar, guardar, cerrar, elegir, filtrar, navegar por el sitio— va sin él.
// Por eso «Escríbeme» y «Descargar CV» lo llevan en sus TRES apariciones cada uno,
// y «Aceptar todo», «Gestionar preferencias» (abre un diálogo, no lleva a ningún
// sitio), «Volver al inicio» y los grupos de pestañas no lo llevan en ninguna.
//
// El criterio mira la ACCIÓN, no la variante ni el sitio donde vive: el CV es una
// descarga tanto en el nav como en Trayectoria, y hasta P37.5988 se veía de tres
// formas distintas —sin icono en el nav, con icono en Trayectoria y en los canales
// de contacto— porque cada punto de uso lo decidía por su cuenta.
//
// Lo mecánico lo resuelve este archivo, que es lo que impide que vuelva a
// divergir: el TAMAÑO lo pone `size` (sm 16 · md 17 · lg 18 · icon 18; antes había
// 15, 17 y 18 escritos a mano en cinco archivos) y la POSICIÓN la variante —el
// icono se escribe SIEMPRE primero en el JSX y `solid` lo manda al otro lado, ver
// SOLID_ICON—. En el call site no se escribe ni una clase: solo `<Download />`.
// Queda fuera el enlace de contenido inline (`.link-content`): su afordancia es el
// subrayado, y un glifo en medio de un párrafo rompe la línea base.
//
// Se exporta el `cva` y no un componente `<Action>` a propósito: la mitad de los
// call sites son `<a>` (mailto, descargas, navegación) y la otra mitad `<button>`,
// y forzar un wrapper con `render`/`asChild` solo añadiría indirección sin quitar
// ninguna decisión de encima. El valor está en que la cadena de clases sea una sola.

// El hover del sólido mezcla el relleno hacia `--foreground`, que en AMBOS temas se
// aleja de `--primary-foreground` (en claro oscurece bajo texto hueso; en oscuro
// aclara bajo texto carbón): el contraste del texto SUBE en hover, nunca baja. Es el
// comportamiento que ya tenía `.contact-cta` y que ahora hereda todo el sistema —
// `bg-primary/90`, que es lo que decía BRAND.md, lo baja. Se corrigió la regla, no
// el botón (P37.596).
// OJO al tocar este archivo: las cadenas de clases tienen que estar ESCRITAS
// ENTERAS y literales. Tailwind escanea el código fuente como texto plano, así que
// una clase construida por interpolación (`hover:bg-[${MIX}]`) no la ve nadie y la
// utilidad no llega a generarse: el elemento se queda sin hover, en silencio y sin
// error de compilación. Pasó al implementar P37.5985 —se factorizó el color-mix a
// una constante y se cayeron a la vez el hover del sólido y el del toggle—, y solo
// se detectó midiendo el color pintado en el navegador. Repetir el literal es feo;
// que el CTA insignia del sitio pierda el hover sin avisar, más.
const SOLID =
  "bg-primary text-primary-foreground hover:bg-[color-mix(in_srgb,var(--primary)_88%,var(--foreground))] focus-visible:bg-[color-mix(in_srgb,var(--primary)_88%,var(--foreground))]";

// Compartido por la variante `outline-neutral` y por el estado apagado de
// `toggle-neutral`: son el mismo control, con y sin estado.
const OUTLINE_NEUTRAL =
  "border-border bg-background text-foreground border hover:bg-muted focus-visible:bg-muted";

// El icono del CTA sólido: DETRÁS de la etiqueta y avanzando 2px al interactuar.
// Vive aquí y no en el call site por lo de siempre —el orden en el JSX es una
// decisión que hay que acordarse de tomar— y porque era la última pieza del botón
// repartida entre dos capas: el empujón lo ponía `.contact-cta` en globals.css, así
// que lo tenía el email de la franja de contacto y NO lo tenía la demo de la página
// que documenta esa misma variante. Los dos extremos de la transición van en el
// mismo sitio que la declara (D35), y `motion-reduce` anula solo el movimiento.
// El selector no encuentra nada en un sólido sin icono, así que es inocuo.
const SOLID_ICON =
  "flex-row-reverse [&_svg]:transition-transform [&_svg]:duration-200 hover:[&_svg]:translate-x-[2px] focus-visible:[&_svg]:translate-x-[2px] motion-reduce:[&_svg]:transition-none motion-reduce:hover:[&_svg]:translate-x-0 motion-reduce:focus-visible:[&_svg]:translate-x-0";

export const actionVariants = cva(
  // Base. El radio es único para toda acción (`--radius-md`, 8px): antes convivían
  // 10px en consent/error y 8px en el resto sin que la diferencia significara nada.
  // El foco NO se declara aquí: lo pone la regla global `:focus-visible` de
  // globals.css (2px `--ring` + offset 2px). Ninguna variante lo sobrescribe — el
  // sitio tenía tres mecanismos de foco compitiendo.
  "inline-flex shrink-0 items-center justify-center gap-[0.5rem] rounded-md font-semibold whitespace-nowrap no-underline transition-colors [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // La acción destacada de la pantalla. Hoy: el email de la franja de
        // contacto (métrica primaria, PRD §7), aceptar cookies y el primario de
        // las páginas 404/500.
        // `SOLID_ICON` va solo aquí y no en la constante `SOLID`: los estados
        // encendidos de los `toggle-*` la reusan, y alguno lleva un glifo delante
        // de la etiqueta (el de rejilla del Design System) que no hay que voltear
        // ni empujar — es un indicador de estado, no el destino de un viaje.
        // Se componen como ARRAY y no con una plantilla `${SOLID} ${SOLID_ICON}`:
        // ambas formas funcionan (las clases están escritas enteras dentro de cada
        // constante, que es lo que Tailwind necesita ver), pero una plantilla en
        // este archivo se parece demasiado a la interpolación que ya tumbó el hover
        // del sólido en silencio. Aquí no se escriben plantillas de clases, punto.
        solid: [SOLID, SOLID_ICON],
        // Acción de contenido que vive sola, sin otro CTA al lado con el que
        // competir: Descargar CV, Gestionar preferencias, chips de descarga del
        // Brand Kit. Hover = el relleno cian pleno (BRAND.md).
        "outline-primary":
          "border-primary text-primary border bg-transparent hover:bg-primary hover:text-primary-foreground focus-visible:bg-primary focus-visible:text-primary-foreground",
        // Utilidad, o botón que convive con un sólido dentro del mismo grupo:
        // cancelar, cerrar, Repetir, chips neutros. Hover = pastilla `muted`,
        // nunca cian.
        "outline-neutral": OUTLINE_NEUTRAL,
        // Tercera opción de un grupo, sin caja en reposo (Rechazar todo).
        ghost: "text-foreground hover:bg-muted focus-visible:bg-muted",
        // Controles CON ESTADO — ver `on` abajo. Cuál de las dos se usa se decide
        // por la FORMA del control, no por su contenido ni por cuántos segmentos
        // tenga (una regla que obliga a contar es una regla que nadie aplica):
        //
        //   · `toggle-primary` — INTERRUPTOR SUELTO. Un único control que enciende
        //     o apaga algo que antes no estaba: el toggle de rejilla del Design
        //     System. El cian dice «esto se toca» y no compite con nada, porque no
        //     tiene pares al lado. Apagado = tinte en hover, nunca relleno: con el
        //     relleno, hover y encendido se verían igual y el control dejaría de
        //     comunicar en qué estado está (BRAND.md, fijado en P37.59).
        //
        //   · `toggle-neutral` — GRUPO DE ALTERNATIVAS EXCLUYENTES. Varios botones
        //     de los que exactamente uno está activo, para elegir cómo mirar un
        //     contenido que ya está en pantalla: pestañas del Toolkit, tabs de
        //     dispositivo del Esqueleto navegable. Aquí el cian no distingue nada
        //     —todos los segmentos son igual de accionables— y multiplicado por
        //     tres o cuatro se come la sección. Mismo eje que separa contenido de
        //     chrome en BRAND.md.
        //
        // Fijado 2026-08-04 al migrar, en dos pasadas: primero con las pestañas del
        // Toolkit (cuatro cianes en vez de uno, insufrible en oscuro) y enseguida
        // con los tabs de dispositivo, que se habían quedado en cian por arrastre
        // —P37.59 los había agrupado con el toggle de rejilla por ser ambos
        // `aria-pressed`, cuando uno es un interruptor y el otro un segmentado—.
        // Que la primera redacción de la regla ("¿quién es el protagonista?") ya
        // fallara al segundo caso es el motivo de que ahora mire la forma.
        "toggle-primary": "",
        "toggle-neutral": "",
        // Controles solo-icono del chrome (tema, hamburguesa, LinkedIn del footer,
        // cerrar diálogo). El hover de pastilla lo resuelve `.icon-chrome`, que ya
        // es sensible al fondo vía `--chrome-hover-bg` y declara reposo y hover en
        // la misma regla (D35). El fondo de REPOSO también sale de ahí y por
        // defecto es `--card`, que es el caso común (el control se apoya en
        // `--background`): en el call site no se escribe nada. Solo el que vive
        // sobre un card pasa `[--icon-chrome-bg:var(--background)]` — hoy, el
        // cierre del diálogo de consentimiento. Hasta P37.5989 el defecto era
        // `transparent` y los seis call sites normales repetían el `--card` a
        // mano; el LinkedIn del footer no lo escribió y se quedó sin caja.
        icon: "icon-chrome border-border text-foreground border",
        // LA TARJETA QUE SE PULSA ENTERA. Nace con los dos canales de `/contacto`
        // (P67), donde el objetivo no es un renglón sino una caja con rótulo y
        // valor en dos líneas.
        //
        // POR QUÉ ES UNA VARIANTE DE AQUÍ Y NO UNA PIEZA APARTE: las dos preguntas
        // de D36 la traen a esta capa —se pulsa, y tiene caja propia—, así que
        // ponerla fuera sería la segunda fuente del aspecto de un accionable que
        // esta capa existe para impedir. El prototipo de P66 la escribió con clases
        // sueltas y dejó anotado que eso era deuda, no diseño.
        //
        // Lo que sí hace falta es DESHACER media base, y por eso está escrito y no
        // heredado: la base asume un control en línea con etiqueta de una palabra
        // (`justify-center`, `whitespace-nowrap`, `font-semibold`) y una tarjeta es
        // lo contrario en los tres ejes. Va con `size="card"`, que es el único que
        // trae padding de caja en vez de padding de botón.
        //
        // Y POR ESO ESTA VARIANTE SE COMPONE SIEMPRE A TRAVÉS DE `cn()`, no suelta:
        // `cva` concatena, no fusiona, así que `font-semibold` de la base y
        // `font-normal` de aquí llegan las dos al `class` y decide el ORDEN DEL CSS
        // generado, que Tailwind ordena por valor —o sea que gana el semibold—. Se
        // vio en pantalla, no leyendo el código: la tarjeta salió en negrita con la
        // clase correcta puesta. `cn` es `twMerge`, y ahí gana la última, que es
        // esta. Es el punto 5 de `BRAND.md` §Cómo medir con otro disfraz.
        //
        // El hover es la pastilla `muted`, como el resto de lo que no es CTA: la
        // tarjeta es un canal, no la acción destacada de la página. Y no necesita
        // `data-surface`: `bg-card` y `hover:bg-muted` ya recalculan el atenuado
        // por sí solos en `globals.css` (D39/D61), así que el rótulo de dentro se
        // lee bien en los dos estados sin que el call site pida nada.
        card: "border-border bg-card hover:bg-muted focus-visible:bg-muted w-full justify-start rounded-lg border text-left font-normal whitespace-normal",
      },
      // El tamaño del icono va con el del texto y no lo escribe el call site
      // (`[&_svg]`, sin `>` a propósito: el glifo puede ir envuelto). `shrink-0`
      // en la base impide que se comprima cuando la etiqueta es larga.
      size: {
        sm: "min-h-[44px] px-[0.85rem] text-[0.8rem] [&_svg]:size-[16px]",
        md: "min-h-[44px] px-[1.35rem] text-[0.92rem] [&_svg]:size-[17px]",
        lg: "min-h-[48px] px-[1.6rem] text-[1rem] [&_svg]:size-[18px]",
        icon: "min-h-[44px] min-w-[44px] [&_svg]:size-[18px]",
        // Padding de CAJA, no de botón: el único tamaño que no aprieta el
        // contenido contra los lados. Va siempre con `variant="card"`.
        card: "min-h-[44px] gap-[0.75rem] px-[1rem] py-[0.85rem] text-[0.9rem] [&_svg]:size-[18px]",
      },
      // Estado de las variantes `toggle-*`. Se ignora en el resto.
      on: { true: "", false: "" },
    },
    compoundVariants: [
      // El encendido es el mismo sólido en las dos: el relleno pleno YA significa
      // «activo», y reusa su hover y su promesa de contraste.
      { variant: "toggle-primary", on: true, class: SOLID },
      { variant: "toggle-neutral", on: true, class: SOLID },
      // Apagado en la versión cian: TINTE en hover, no relleno — con el relleno,
      // hover y seleccionado se verían igual y el control dejaría de comunicar en
      // qué estado está (BRAND.md, fijado en P37.59).
      //
      // El tinte era `bg-primary/10` con el texto intacto, y era la ÚNICA excepción
      // AAA del sistema: cian sobre un velo del propio cian da 6,35 claro / 6,98
      // oscuro, y bajar el alfa tiene techo asintótico (pintar cian sobre cian no
      // puede subir el contraste del cian). Lo que sí funciona es mover el TEXTO en
      // vez del velo, con la misma mezcla que ya usa el sólido: 12% hacia
      // `--foreground`. Con el velo al 8% da 7,21 claro / 7,80 oscuro — AAA en los
      // dos temas, y el velo sigue siendo más perceptible que la pastilla `muted`
      // que usa el resto de controles (ΔL* 4,7 vs 3,9 en claro). P37.5985.
      {
        variant: "toggle-primary",
        on: false,
        class:
          "border-primary text-primary border bg-transparent hover:bg-[color-mix(in_oklab,var(--primary)_8%,transparent)] hover:text-[color-mix(in_srgb,var(--primary)_88%,var(--foreground))] focus-visible:bg-[color-mix(in_oklab,var(--primary)_8%,transparent)] focus-visible:text-[color-mix(in_srgb,var(--primary)_88%,var(--foreground))]",
      },
      // Apagado en la versión neutra: es literalmente `outline-neutral`. Aquí el
      // hover SÍ puede ser la pastilla plena en vez de un tinte, porque `muted` no
      // se parece en nada al cian sólido del seleccionado — no hay ambigüedad que
      // evitar.
      { variant: "toggle-neutral", on: false, class: OUTLINE_NEUTRAL },
    ],
    defaultVariants: { size: "md" },
  },
);

export type ActionVariants = VariantProps<typeof actionVariants>;
