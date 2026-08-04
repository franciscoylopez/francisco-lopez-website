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
const SOLID =
  "bg-primary text-primary-foreground hover:bg-[color-mix(in_srgb,var(--primary)_88%,var(--foreground))] focus-visible:bg-[color-mix(in_srgb,var(--primary)_88%,var(--foreground))]";

// Compartido por la variante `outline-neutral` y por el estado apagado de
// `toggle-neutral`: son el mismo control, con y sin estado.
const OUTLINE_NEUTRAL =
  "border-border bg-background text-foreground border hover:bg-muted focus-visible:bg-muted";

export const actionVariants = cva(
  // Base. El radio es único para toda acción (`--radius-md`, 8px): antes convivían
  // 10px en consent/error y 8px en el resto sin que la diferencia significara nada.
  // El foco NO se declara aquí: lo pone la regla global `:focus-visible` de
  // globals.css (2px `--ring` + offset 2px). Ninguna variante lo sobrescribe — el
  // sitio tenía tres mecanismos de foco compitiendo.
  "inline-flex shrink-0 items-center justify-center gap-[0.5rem] rounded-md font-semibold whitespace-nowrap no-underline transition-colors",
  {
    variants: {
      variant: {
        // La acción destacada de la pantalla. Hoy: el email de la franja de
        // contacto (métrica primaria, PRD §7), aceptar cookies y el primario de
        // las páginas 404/500.
        solid: SOLID,
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
        // la misma regla (D35). Sobre `--background` el caller añade
        // `[--icon-chrome-bg:var(--card)]` para que la caja se vea en reposo.
        icon: "icon-chrome border-border text-foreground border",
      },
      size: {
        sm: "min-h-[44px] px-[0.85rem] text-[0.8rem]",
        md: "min-h-[44px] px-[1.35rem] text-[0.92rem]",
        lg: "min-h-[48px] px-[1.6rem] text-[1rem]",
        icon: "min-h-[44px] min-w-[44px]",
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
      {
        variant: "toggle-primary",
        on: false,
        class:
          "border-primary text-primary border bg-transparent hover:bg-primary/10 focus-visible:bg-primary/10",
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
