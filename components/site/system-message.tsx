import { actionVariants } from "@/components/ui/action";
import { Logo } from "@/components/ui/logo";

import { MAIN_ID } from "./skip-link";
import { WRAP } from "@/components/ui/layout";
import { cn } from "@/lib/utils";

// Shell presentacional de las páginas-sistema (404 y error). Puro —sin hooks ni
// "use client"— para renderizarse igual en el not-found de servidor y dentro del
// error boundary de cliente. Columna centrada a pantalla completa, con marca: logo
// (enlace al inicio), eyebrow opcional, título, cuerpo y ranura de acciones. No lleva
// Nav/Footer: son pantallas de recuperación, se mantienen ligeras y autónomas.

// Botones compartidos por not-found y error. Ya no definen su propio "botón base":
// salen de la capa de acción del sistema (P37.592), así que un cambio de hover o de
// radio les llega solo.
export const SYSTEM_BTN_PRIMARY = actionVariants({ variant: "solid" });
export const SYSTEM_BTN_OUTLINE = actionVariants({
  variant: "outline-neutral",
});

export function SystemMessage({
  homeHref,
  homeAria,
  eyebrow,
  title,
  body,
  children,
}: {
  homeHref: string;
  homeAria: string;
  eyebrow?: string;
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <main
      id={MAIN_ID}
      tabIndex={-1}
      className={cn(
        WRAP,
        "flex min-h-[100dvh] flex-col items-center justify-center gap-7 py-16 text-center",
      )}
    >
      <a
        href={homeHref}
        aria-label={homeAria}
        className="text-foreground inline-flex"
      >
        <Logo variant="flat" className="h-12" />
      </a>

      <div className="flex flex-col items-center gap-3">
        {eyebrow && (
          <p className="text-muted-foreground text-[0.8rem] font-semibold tracking-[0.12em] uppercase">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-semibold tracking-[-0.01em]">
          {title}
        </h1>
        <p className="text-muted-foreground max-w-[42ch] text-[1.02rem]">
          {body}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {children}
      </div>
    </main>
  );
}
