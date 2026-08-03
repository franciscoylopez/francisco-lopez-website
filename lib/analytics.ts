// Eventos de clic personalizados hacia el dataLayer (D17). GA4 ya captura scroll y
// file_download de fábrica (D19); lo que falta y se cablea aquí es mailto/tel, que no
// son descargas ni navegaciones que la medición mejorada detecte sola. GTM recoge el
// evento con un trigger de Custom Event ("contact_click"); el tag de GA4 (con
// `contact_method` como parámetro) lo configura Francisco.
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
