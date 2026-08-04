"use client";

import { actionVariants } from "@/components/ui/action";
import { OPEN_CONSENT_EVENT } from "@/lib/consent";

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
  const className =
    variant === "button"
      ? actionVariants({ variant: "outline-primary" })
      : "text-muted-foreground hover:text-foreground focus-visible:text-foreground link-chrome cursor-pointer px-[0.6rem] py-[0.35rem] -mx-[0.6rem] -my-[0.35rem] text-[0.9rem]";
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
