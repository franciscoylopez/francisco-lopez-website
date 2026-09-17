"use client";

import Script from "next/script";
import { useSyncExternalStore } from "react";

import { ANALYTICS_GRANTED_EVENT, readConsent } from "@/lib/consent";

// Contenedor de Google Tag Manager (P21). Aloja GA4 (P24) y los eventos de clic de
// Contacto/CV (P25).
//
// SOLO SE INYECTA CON CONSENTIMIENTO DE ANALÍTICA (P74.55, D214). Hasta entonces el
// contenedor cargaba con la página y el Consent Mode denegado gobernaba el
// ALMACENAMIENTO, no el envío: GA4 recibía un `page_view` sin cookies de todo el
// mundo (D198), que D211 declaró en `/cookies` como segunda excepción al criterio
// propio. Cerrar el gate la retira: sin aceptar no sale ninguna petición a Google.
// Dos entradas, y las dos llegan aquí:
//   - decisión previa guardada → se lee al montar;
//   - aceptar ahora → `saveConsent` emite `ANALYTICS_GRANTED_EVENT`.
// Retirar el consentimiento después NO descarga el contenedor (un script cargado no
// se descarga): lo que actúa es el `consent update` denegado que empuja
// `applyConsent`, y en la siguiente carga ya no se inyecta.
//
// SIN `<noscript>`: el iframe de GTM cargaba el contenedor sin JS, y sin JS no hay
// forma de consentir, así que era una petición a Google sin permiso.
//
// Estrategia `lazyOnload` (P26.5): GTM+GA4 son ~143 KiB que en `afterInteractive`
// disparaban el TBT móvil. Si el consentimiento llega después de `load`, `lazyOnload`
// lo inyecta en el siguiente hueco ocioso, que es enseguida.
//
// El gate de entorno (solo producción, y solo con NEXT_PUBLIC_GTM_ID definido) vive
// en el layout (D13: la analítica no corre en dev/preview).
//
// `useSyncExternalStore` y no un efecto con `setState`, como en `nav.tsx`: la
// decisión vive fuera de React (`localStorage`). Las funciones van a nivel de
// módulo para que la suscripción no se rehaga en cada render, y el snapshot de
// servidor es `false`: el prerender no sabe qué decidió nadie.
const suscribir = (avisar: () => void) => {
  window.addEventListener(ANALYTICS_GRANTED_EVENT, avisar);
  return () => window.removeEventListener(ANALYTICS_GRANTED_EVENT, avisar);
};
const leerConcedida = () => readConsent()?.analytics === true;
const enServidor = () => false;

export function GoogleTagManager({ gtmId }: { gtmId: string }) {
  const granted = useSyncExternalStore(suscribir, leerConcedida, enServidor);

  if (!granted) return null;

  return (
    <Script id="gtm-loader" strategy="lazyOnload">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
    </Script>
  );
}
