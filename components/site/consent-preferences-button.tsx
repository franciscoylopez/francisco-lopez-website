"use client";

import { actionVariants } from "@/components/ui/action";
import { chromeLinkVariants } from "@/components/ui/chrome";
import { OPEN_CONSENT_EVENT } from "@/lib/consent";
import { cn } from "@/lib/utils";

// Reabre el centro de preferencias de cookies (RGPD: retirar el consentimiento debe
// ser tan fácil como darlo). Despacha un evento que escucha el ConsentBanner.
//   - variant "link" (por defecto): enlace de chrome del footer (muted, no primary).
//   - variant "button": CTA de contenido para la página de política de cookies.
//     Mismo outline-primary que el CTA "Descargar CV" de Trayectoria (P37.58):
//     al vivir solo en el cuerpo del texto (no junto a otro CTA con el que
//     competir, a diferencia de los botones del propio diálogo de consentimiento,
//     donde el outline neutro sí tiene sentido para no pisar al primary de
//     "Guardar"), le tocaba el mismo tratamiento que ese otro CTA de contenido,
//     no el neutro que usa el diálogo internamente.
export function ConsentPreferencesButton({
  label,
  variant = "link",
}: {
  label: string;
  variant?: "link" | "button";
}) {
  // OJO con esta rama (P37.656): escrita a mano, se había quedado SIN
  // `min-h-[44px]` y sin `inline-flex`, así que habría medido ~28px de alto — por
  // debajo del suelo de 44 que publica la checklist de Accesibilidad del sitio.
  // No llegó a verse porque **`variant="link"` no tiene ningún call site**: el
  // único uso, en la política de cookies, pasa `variant="button"`. O sea que el
  // incumplimiento estaba en el valor POR DEFECTO, esperando al siguiente que lo
  // usara — la misma trampa que describe `.icon-chrome` en globals.css, donde el
  // defecto era el que no cumplía y solo se salvaba quien se acordara de escribir
  // algo. Ahora la métrica la pone la capa y la rama es correcta sin usarse.
  const className =
    variant === "button"
      ? actionVariants({ variant: "outline-primary" })
      : cn(
          chromeLinkVariants({ tone: "muted" }),
          "cursor-pointer text-[0.9rem]",
        );
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent(OPEN_CONSENT_EVENT))}
      className={className}
    >
      {label}
    </button>
  );
}
