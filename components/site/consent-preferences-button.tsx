"use client";

import { OPEN_CONSENT_EVENT } from "@/lib/consent";

// Reabre el centro de preferencias de cookies (RGPD: retirar el consentimiento debe
// ser tan fácil como darlo). Despacha un evento que escucha el ConsentBanner.
//   - variant "link" (por defecto): enlace de chrome del footer (muted, no primary).
//   - variant "button": botón visible ≥44px para la página de política de cookies.
export function ConsentPreferencesButton({
  label,
  variant = "link",
}: {
  label: string;
  variant?: "link" | "button";
}) {
  const className =
    variant === "button"
      ? "border-border bg-background text-foreground hover:bg-muted inline-flex min-h-[44px] items-center justify-center rounded-lg border px-4 text-[0.9rem] font-semibold transition-colors"
      : "text-muted-foreground hover:text-foreground focus-visible:text-foreground cursor-pointer text-[0.9rem] underline-offset-4 hover:underline focus-visible:underline";
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
