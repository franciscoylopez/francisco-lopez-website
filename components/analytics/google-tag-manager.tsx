"use client";

import Script from "next/script";

// Contenedor de Google Tag Manager (P21). Aloja GA4 (P24) y los eventos de clic de
// Contacto/CV (P25).
//
// Estrategia `lazyOnload` (P26.5, optimización de performance): GTM se carga cuando
// el navegador está ocioso, no durante la ventana interactiva. GTM+GA4 son ~143 KiB
// que, en `afterInteractive`, disparaban el TBT móvil (~390 ms) y bajaban el Perf de
// 93 a 88. Diferirlos lo devuelve a >90 sin perder medición: page_view, scroll y
// clics ocurren igualmente después de que la página es interactiva. El consentimiento
// NO se ve afectado: el default denegado lo fija `consent-init` (script inline) en el
// parseo, antes que GTM; cuando GTM carga, ya respeta el estado de consentimiento.
//
// El gate de entorno (solo producción, y solo con NEXT_PUBLIC_GTM_ID definido) vive
// en el layout (D13: la analítica no corre en dev/preview).
export function GoogleTagManager({ gtmId }: { gtmId: string }) {
  return (
    <>
      <Script id="gtm-loader" strategy="lazyOnload">
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
