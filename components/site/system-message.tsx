import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

// Shell presentacional de las páginas-sistema (404 y error). Puro —sin hooks ni
// "use client"— para renderizarse igual en el not-found de servidor y dentro del
// error boundary de cliente. Columna centrada a pantalla completa, con marca: logo
// (enlace al inicio), eyebrow opcional, título, cuerpo y ranura de acciones. No lleva
// Nav/Footer: son pantallas de recuperación, se mantienen ligeras y autónomas.

const BTN =
  "inline-flex min-h-[44px] items-center justify-center rounded-lg px-5 text-[0.92rem] font-semibold transition-colors";

// Botones compartidos por not-found y error → estilo único, sin divergencia.
export const SYSTEM_BTN_PRIMARY = cn(
  BTN,
  "bg-primary text-primary-foreground hover:bg-primary/90",
);
export const SYSTEM_BTN_OUTLINE = cn(
  BTN,
  "border-border bg-background text-foreground hover:bg-muted border",
);

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
    <main className="mx-auto flex min-h-[100dvh] max-w-[var(--container)] flex-col items-center justify-center gap-7 px-[var(--page-x)] py-16 text-center">
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
        <h1 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-semibold tracking-[-0.01em] text-balance">
          {title}
        </h1>
        <p className="text-muted-foreground max-w-[42ch] text-[1.02rem] text-pretty">
          {body}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {children}
      </div>
    </main>
  );
}
