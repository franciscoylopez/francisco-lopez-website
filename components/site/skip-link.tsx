import { actionVariants } from "@/components/ui/action";
import { cn } from "@/lib/utils";

/**
 * Id del `<main>` de toda página, y destino del enlace de salto. Una constante
 * y no una cadena suelta porque son dos extremos que solo funcionan juntos: lo
 * pone `PageShell` (y, fuera de él, `SystemMessage` y el 404 global) y lo apunta
 * este enlace.
 */
export const MAIN_ID = "main";

// Enlace de salto — WCAG 2.4.1 «Bypass Blocks», NIVEL A (P43).
//
// POR QUÉ NO LO VIO NINGUNA AUDITORÍA: axe NO lo detecta. Su regla `bypass` se da
// por satisfecha si la página tiene landmarks o encabezados, y este sitio tiene
// los dos. Un medidor que da verde no prueba que no falte nada — es la misma
// lección del método que `BRAND.md` §Cómo se escribe una regla lleva repitiendo,
// aquí del revés.
//
// VA COMO PRIMER HIJO DEL `<body>`, antes incluso del bloque de GTM: no pinta
// nada, pero sí es DOM, y este enlace tiene que ser lo PRIMERO que recibe el foco.
//
// FUERA DE PANTALLA CON `translate`, NO CON `sr-only`. El patrón habitual
// —`sr-only focus:not-sr-only`— depende de qué utilidad de `position` gana en el
// CSS generado, que no es algo que se pueda leer en el código: si `not-sr-only`
// (static) sale después de `absolute`, el enlace aparece en un sitio equivocado y
// nadie se entera hasta que alguien tabula. Un `translate` es determinista.
// Sin transición a propósito: así no hay nada que anular con
// `prefers-reduced-motion`.
//
// El aspecto sale de `outline-neutral` (Regla de construcción, CLAUDE.md): es un
// control de utilidad. El anillo de foco lo pone la regla global `:focus-visible`.
export function SkipLink({ label }: { label: string }) {
  return (
    <a
      href={`#${MAIN_ID}`}
      className={cn(
        actionVariants({ variant: "outline-neutral" }),
        // z-60 para pasar por encima del nav sticky (z-50).
        "fixed top-3 left-3 z-[60] -translate-y-[calc(100%+1.5rem)] focus:translate-y-0",
      )}
    >
      {label}
    </a>
  );
}
