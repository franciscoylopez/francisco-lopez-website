// Eventos de clic personalizados hacia el dataLayer (D17). GA4 ya captura scroll y
// file_download de fábrica (D19); lo que falta y se cablea aquí es mailto/tel, que no
// son descargas ni navegaciones que la medición mejorada detecte sola. GTM recoge el
// evento con un trigger de Custom Event ("contact_click") y lo traduce a un tag de GA4 con
// `contact_method` como parámetro. Esa mitad vive FUERA del repo, en el contenedor de GTM, y
// está publicada desde el 2026-08-03 — se audita sin entrar en su UI descargando
// `googletagmanager.com/gtm.js?id=<GTM_ID>` (D71).
export type ContactMethod = "email" | "phone";

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export function trackContactClick(method: ContactMethod): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: "contact_click", contact_method: method });
}

/**
 * El envío del formulario de contacto (P67). Desde que existe, la métrica
 * primaria del PRD §7 deja de ser el clic en `mailto:` —un proxy de intención,
 * porque no había formulario— y pasa a ser esto: un envío real.
 *
 * Se dispara cuando el SERVIDOR confirma, no al pulsar: un clic en «Enviar» que
 * falla la validación o que no llega a salir no es un contacto, y contarlo
 * inflaría justo la cifra que se quiere creer.
 *
 * LA OTRA MITAD VIVE FUERA DEL REPO, como el resto (D71): GTM necesita un
 * trigger de Custom Event para `contact_submit` y su tag de GA4. Sin eso, el
 * evento llega al `dataLayer` y no sale de ahí.
 */
export function trackContactSubmit(): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: "contact_submit" });
}
