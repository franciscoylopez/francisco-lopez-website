import { cva, type VariantProps } from "class-variance-authority";

// Capa de CHROME del sistema (P37.656). Fuente única del enlace de la carpintería
// de navegación: nav, menú móvil, breadcrumb, footer, canales de contacto y el
// botón que reabre las preferencias de cookies.
//
// Por qué existe: `.link-chrome` (globals.css) resolvía el ASPECTO —color del
// hover, pastilla sensible al fondo, tamaño del svg— pero no las MÉTRICAS, así que
// cada uno de sus catorce call sites las reescribía. Medido el 2026-08-09:
// `min-h-[44px]` a mano trece veces, tres paddings horizontales distintos para el
// mismo tipo de enlace y los márgenes negativos compensatorios copiados siete.
// Es la forma exacta del problema que D36 resolvió para los botones —el suelo de
// 44px reescrito catorce veces fue justo cómo el footer se salió a 40px sin que
// nadie se enterara— y aquí ya había cobrado su pieza: ver `shape: "inline"`.
//
// ───────────────────────────────────────────────────────────────────────────────
// POR QUÉ NO ES UNA VARIANTE DE `action.tsx`, que era la otra opción sobre la mesa.
//
// La pregunta que separa etiqueta de acción (¿se pulsa?) no basta aquí, porque un
// enlace de chrome SÍ se pulsa. La segunda pregunta es: **¿tiene caja propia?**
//
// La base de `action.tsx` describe un control CON CAJA: `justify-center`,
// `font-semibold`, `rounded-md` y un padding que sale de la escala de tamaño. Un
// enlace de chrome es texto dentro de la carpintería: en reposo no tiene caja
// —el fondo es transparente y la pastilla solo aparece al interactuar—, su peso es
// 500, y en dos de sus tres formas el padding tiene que quedar **cancelado por
// márgenes negativos** para no empujar la línea en la que vive. Eso último no es
// un matiz de un botón: es lo contrario de un botón.
//
// Meterlo allí obligaba a sacar `font-semibold` de la base —que las siete
// variantes de caja tendrían que volver a declarar, o cargarlo el eje `size`,
// dejando fuera a los nueve call sites que hoy se apoyan en `size: "md"` por
// defecto— o a confiar en que una clase sin `@layer` gane a la utilidad (D34).
// Las dos hacen más frágil el archivo que gobierna TODOS los botones del sitio,
// para alojar a una familia que `BRAND.md` trata como distinta desde el principio
// («contenido vs chrome»).
//
// El control de chrome SOLO ICONO sí se queda en `action.tsx` (`variant: "icon"`),
// y eso confirma la regla en vez de contradecirla: ese sí tiene caja —borde,
// `--card` en reposo, 44×44—. La frontera no es el sitio donde vive el control,
// es su forma.
// ───────────────────────────────────────────────────────────────────────────────
//
// LAS TRES FORMAS SON EL CONTENEDOR, no el contenido. Cada una responde a dónde
// vive el enlace, y por eso son variantes y no valores a unificar (D36):
//
//   · `bar`    — en una barra horizontal que le deja sitio. Tiene padding de
//                verdad, y la pastilla del hover se ve entera. Nav de escritorio.
//   · `inline` — en una línea de contenido que no debe moverse. Mismo padding,
//                pero cancelado con márgenes negativos: el área de clic crece
//                hacia fuera y la pastilla aparece en hover sin empujar a nadie.
//                Footer, breadcrumb, canales de contacto, preferencias.
//   · `stack`  — apilado, un ítem por línea, alineado al gutter de la página. Sin
//                padding horizontal: lo pone el contenedor. Menú móvil del nav.
//
// EL TAMAÑO DE TEXTO NO ESTÁ AQUÍ, a propósito, y es la única métrica que se queda
// en el call site. No es una propiedad del enlace sino de la tipografía del bloque
// que lo contiene: el breadcrumb hereda la de su `<ol>`, el footer va a 0,9rem y
// los canales de contacto a 0,95rem porque así lo pide cada sección, no porque
// sean enlaces distintos. Es la regla derivada de D34: la propiedad que cada
// caller tiene que aportar no se declara en la pieza compartida.
//
// EL RADIO YA NO LO PONE `.link-chrome`. Tenía `border-radius: 7px` escrito a mano
// —un píxel menos que el `rounded-md` (8px) de todo lo demás, sin que la diferencia
// significara nada (hallazgo de P37.5996)—. Se borra de la CSS y lo trae la base de
// aquí con la utilidad del token, que es la notación única que fija `CLAUDE.md`.
export const chromeLinkVariants = cva(
  "link-chrome inline-flex min-h-[44px] items-center gap-[0.5rem] rounded-md font-medium no-underline",
  {
    variants: {
      shape: {
        bar: "px-[0.85rem] whitespace-nowrap",
        inline: "-mx-[0.6rem] -my-[0.35rem] px-[0.6rem] py-[0.35rem]",
        stack: "",
      },
      tone: {
        /** El chrome principal: nav, menú móvil, canales de contacto. */
        default: "text-foreground",
        /**
         * Chrome secundario —footer, breadcrumb, selector de idioma, preferencias—
         * que **se aclara al interactuar**, y no por gusto: el hover pinta una
         * pastilla de `--muted` debajo, así que un texto en `--muted-foreground`
         * se quedaba en 6,44 claro / 5,56 oscuro justo en hover. Es el caso que
         * prohíbe D30 (un atenuado calibrado contra `--background` usado sobre otra
         * superficie), el mismo que apareció en la etiqueta neutra en P37.655.
         * Subir el texto a `--foreground` en el mismo gesto que aparece la pastilla
         * lo lleva a AAA sin tocar el reposo. Cuatro de los siete usos ya lo hacían
         * —el nav y las preferencias—; el footer y el breadcrumb no, y nadie podía
         * ver la diferencia porque el par solo existe mientras el cursor está encima.
         */
        muted:
          "text-muted-foreground hover:text-foreground focus-visible:text-foreground",
      },
    },
    defaultVariants: { shape: "inline", tone: "default" },
  },
);

export type ChromeLinkVariants = VariantProps<typeof chromeLinkVariants>;
