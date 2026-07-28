"use client";

import Script from "next/script";

// Contenedor de Google Tag Manager (P21). Aloja GA4 (P24) y los eventos de clic de
// Contacto/CV (P25). Estrategia `afterInteractive`: es la que el doc de next/script
// recomienda para tag managers (carga pronto, sin bloquear la hidratación).
//
// Consentimiento: el Consent Mode v2 + banner llega en P22, ANTES de que se añada
// ningún tag que escriba cookies (GA4 en P24). El contenedor GTM por sí solo no deja
// cookies, así que instalarlo ahora es conforme.
//
// El gate de entorno (solo producción, y solo con NEXT_PUBLIC_GTM_ID definido) vive
// en el layout (D13: la analítica no corre en dev/preview).
export function GoogleTagManager({ gtmId }: { gtmId: string }) {
  return (
    <>
      <Script id="gtm-loader" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
      </Script>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
          title="Google Tag Manager"
        />
      </noscript>
    </>
  );
}
