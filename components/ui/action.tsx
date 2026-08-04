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
        "outline-neutral":
          "border-border bg-background text-foreground border hover:bg-muted focus-visible:bg-muted",
        // Tercera opción de un grupo, sin caja en reposo (Rechazar todo).
        ghost: "text-foreground hover:bg-muted focus-visible:bg-muted",
        // Toggles, segmentados Y pestañas — ver `on` abajo.
        toggle: "",
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
      // Estado de `variant: "toggle"`. Se ignora en el resto de variantes.
      on: { true: "", false: "" },
    },
    compoundVariants: [
      // En un control con estado, el relleno pleno YA significa «activo»: el
      // encendido reusa el sólido (mismo hover, misma promesa de contraste)...
      { variant: "toggle", on: true, class: SOLID },
      // ...y el apagado usa un TINTE en hover, no el relleno — si usara el relleno,
      // hover y seleccionado se verían igual y el control dejaría de comunicar en
      // qué estado está (BRAND.md, fijado en P37.59).
      {
        variant: "toggle",
        on: false,
        class:
          "border-primary text-primary border bg-transparent hover:bg-primary/10 focus-visible:bg-primary/10",
      },
    ],
    defaultVariants: { size: "md" },
  },
);

export type ActionVariants = VariantProps<typeof actionVariants>;
