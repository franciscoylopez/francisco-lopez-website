"use client";

import { OPEN_CONSENT_EVENT } from "@/lib/consent";

// Enlace del footer para reabrir el centro de preferencias de cookies (RGPD: retirar
// el consentimiento debe ser tan fácil como darlo). Despacha un evento que escucha el
// ConsentBanner. Estilo de chrome (muted-foreground, no primary — BRAND.md), a juego
// con los demás enlaces del footer.
export function ConsentPreferencesButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent(OPEN_CONSENT_EVENT))}
      className="text-muted-foreground hover:text-foreground focus-visible:text-foreground cursor-pointer text-[0.9rem] underline-offset-4 hover:underline focus-visible:underline"
    >
      {label}
    </button>
  );
}
