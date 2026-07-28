import { consentInitScript } from "@/lib/consent";

// Consent Mode v2 — default DENEGADO antes de que cargue GTM (P22). Script inline
// renderizado en el HTML del servidor: se ejecuta durante el parseo de la página,
// antes del loader de GTM (afterInteractive) y de la hidratación, así que GTM/GA4
// respetan el consentimiento desde el primer momento. Si el visitante ya eligió
// (localStorage), aplica su decisión de inmediato. Server Component; se coloca antes
// de <GoogleTagManager> y solo en producción (gate por GTM_ID en el layout).
export function ConsentInit() {
  return <script dangerouslySetInnerHTML={{ __html: consentInitScript() }} />;
}
