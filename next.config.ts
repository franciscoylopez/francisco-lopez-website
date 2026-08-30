import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

// Content-Security-Policy — Fase 2 «A+ barato» (tarea 37.9). Mantiene `'unsafe-inline'`
// en script-src (los scripts inline del sitio: consent-init, init de tema, loader de GTM),
// así que NO es protección de XSS fuerte — eso sería la CSP estricta con nonces, diferida
// a V4 con la IA conversacional, o antes si Contacto ampliada incorpora un endpoint
// externo (D26; la fecha la fija `PRD-Live.md` §5, que es donde vive el alcance por
// versión). Lo que sí aporta, gratis y sin romper nada: bloquear <object>/<embed>
// (object-src 'none'), fijar la base de URLs (base-uri 'self'), limitar destinos de
// formularios (form-action 'self') y prohibir el embedding (frame-ancestors 'none'). El
// allowlist de GTM/GA4 (script/connect/img/frame) evita romper la analítica. Sube
// securityheaders.com de A a A+.
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  // gtm.js se sirve desde googletagmanager; el tag de Clarity (P37) se sirve desde clarity.ms;
  // 'unsafe-inline' cubre los scripts inline del sitio.
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://*.googletagmanager.com https://www.clarity.ms https://*.clarity.ms",
  // GA4 envía las medidas (beacon/fetch) a *.google-analytics.com y *.analytics.google.com;
  // Clarity envía sus grabaciones/heatmaps a *.clarity.ms.
  "connect-src 'self' https://www.googletagmanager.com https://*.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://www.clarity.ms https://*.clarity.ms",
  // Pixel de GA + el beacon de imagen de Clarity (c.clarity.ms/c.gif) + data: para imágenes inline.
  "img-src 'self' data: https://www.googletagmanager.com https://*.google-analytics.com https://*.clarity.ms",
  // 'unsafe-inline' para los style attributes inline (transiciones del nav, reveals, iframe de GTM).
  "style-src 'self' 'unsafe-inline'",
  // next/font auto-hospeda las fuentes; no hay orígenes externos de fuentes.
  "font-src 'self'",
  // <noscript> de GTM inyecta un iframe a googletagmanager/ns.html; y el vídeo de
  // Pau Gasol del deep-dive de INDYA se incrusta desde youtube-nocookie (§43).
  //
  // ES `youtube-nocookie.com` Y NO `youtube.com`, y la diferencia no es cosmética:
  // el dominio normal escribe cookies de publicidad en cuanto se pinta el iframe;
  // el `-nocookie` no toca almacenamiento hasta que alguien le da al play. Junto
  // con el facade —el iframe no existe en el DOM hasta el clic— eso deja la página
  // SIN una sola petición a Google mientras nadie pulse. Primera ampliación de la
  // CSP desde Clarity (D32) y con su mismo criterio: se añade el origen exacto que
  // hace falta, no el comodín.
  "frame-src https://www.googletagmanager.com https://www.youtube-nocookie.com",
].join("; ");

// Cabeceras de seguridad — Fase 1 (tarea 30.4): las triviales y sin riesgo.
//
// LA JUSTIFICACIÓN ORIGINAL CADUCÓ EL 2026-08-23, y se sustituye aquí en vez de
// anotarse al pie (P50.81): decía «portfolio estático, sin auth, sin formularios ni
// input de usuario», y desde ese día `/contacto` recibe algo escrito por otra
// persona. `DECISIONS.md` ya se había corregido (D95); el comentario vivo que
// gobierna la CSP, no — que es el que alguien va a leer la próxima vez que se
// plantee tocarla.
//
// EL RIESGO SIGUE SIENDO BAJO, y ahora por otro motivo: no hay auth ni base de
// datos, y la única superficie de entrada es un formulario que se envía por Server
// Action del MISMO origen, así que `form-action 'self'` ya lo cubría y las
// cabeceras servidas no cambiaron. Lo que cambió es el razonamiento.
const securityHeaders = [
  // No adivinar el MIME: evita que un recurso servido como texto se ejecute como script.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Nadie puede embeber el sitio en un <iframe> (anti-clickjacking). No se enmarca a sí mismo.
  { key: "X-Frame-Options", value: "DENY" },
  // Referer completo solo dentro del propio origen; a orígenes externos, solo el origen.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Desactiva APIs potentes que el sitio no usa.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  // Fuerza HTTPS durante 2 años, subdominios incluidos. Sin `preload` de momento
  // (entrar en la lista de preload es difícil de revertir; se puede añadir después).
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
  // La CSP solo se sirve en builds de producción (incluye el preview de Vercel). En
  // `next dev` se omite: el HMR usa `eval` y 'unsafe-eval' no debe entrar en la política.
  ...(process.env.NODE_ENV === "production"
    ? [{ key: "Content-Security-Policy", value: csp }]
    : []),
];

// `Vary: Accept`, desde que el proxy negocia markdown (P67.2): la misma URL puede
// devolver HTML o markdown, así que una caché compartida necesita saberlo.
//
// Y HASTA DÓNDE LLEGA, QUE ES LO QUE HAY QUE SABER AL LEER ESTO. Llega a los
// `.md` y a los route handlers; NO llega a las 28 páginas prerenderizadas. Medido
// el 2026-08-30 contra `next start`: en `/robots.txt` salen las dos cabeceras
// (`vary: Accept` y `vary: rsc, …`), y en `/` sale solo la de Next. La diferencia
// es el camino: una página que se sirve del prerender (`x-nextjs-cache: HIT`,
// `x-nextjs-prerender: 1`) lleva el `Vary` que escribe Next, y ni esta
// configuración ni el proxy pueden añadirle nada.
//
// POR ESO EL CONTRATO NO SE APOYA EN ESTA CABECERA. La vía estable para un agente
// es la URL explícita `/md/<locale>/<pagina>.md`, que llms.txt anuncia; la
// negociación por `Accept` es la comodidad que los dos escáneres piden, y detrás
// de una caché compartida que ya tenga guardado el HTML puede no llegar. Está
// dicho así en D158 y en `llms.txt`, en vez de prometer de más.
const varyHeader = [{ key: "Vary", value: "Accept" }];

const nextConfig: NextConfig = {
  async headers() {
    return [
      { source: "/:path*", headers: [...securityHeaders, ...varyHeader] },
    ];
  },
  // Next emite `x-powered-by: Next.js` por defecto, que anuncia el stack a cualquiera
  // que mire las cabeceras y no aporta nada. Va aquí, junto a `headers()`, porque es
  // lo mismo: qué se sirve en la respuesta.
  poweredByHeader: false,
  images: {
    // UN ANCHO DE 384 QUE NO ESTABA, y por eso las dos fotos de «Sobre mí» se
    // servían a 640 dentro de una caja de 382 (P70.28).
    //
    // La causa NO es el `sizes` de esas fotos, que ya declara `384px` en
    // escritorio. Es que `next/image`, cuando el `sizes` contiene ALGÚN valor en
    // `vw` —el suyo lleva `100vw` para el móvil—, descarta del `srcset` todo
    // candidato por debajo de `deviceSizes[0] × el vw más pequeño`. Con el
    // reparto por defecto eso es 640, así que el `384px` de escritorio no tenía
    // a qué apuntar: el candidato más pequeño que existía era 640, y 640 píxeles
    // en una caja de 382 son 1,7× los que hacen falta.
    //
    // La palanca correcta es `deviceSizes`, no `imageSizes`: `imageSizes` se
    // concatena pero cae dentro del mismo filtro, así que sus 384 tampoco
    // sobrevivían. Bajando el suelo a 384 el filtro deja pasar el candidato y el
    // navegador elige por lo que necesita, como siempre.
    //
    // No quita ningún ancho: solo AÑADE uno por debajo, así que ninguna imagen
    // del sitio puede empeorar — como mucho, pedir menos.
    //
    // Y UN 672 QUE TAMPOCO ESTABA (P84.1, 2026-08-29), por el mismo motivo un
    // peldaño más arriba. La caja de las fotos de «Sobre mí» mide 384 CSS px
    // como mucho (`max-w-[24rem]`), y en el móvil de referencia de Lighthouse
    // —412×823 con DPR 1,75— eso son 672 píxeles reales exactos. El salto
    // 640 → 750 del reparto por defecto no tiene nada ahí, así que el navegador
    // se bajaba 750 para pintar 645: 25,7% de píxeles de más y 13,6 KiB. Como
    // el 384, solo AÑADE un ancho: ninguna imagen puede empeorar.
    deviceSizes: [384, 640, 672, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // La doc pide que todos los `imageSizes` sean MENORES que el menor
    // `deviceSizes`. Al bajar el suelo a 384, el 384 que traía por defecto deja
    // de cumplirlo; se retira y el resto se queda igual.
    imageSizes: [32, 48, 64, 96, 128, 256],
  },
  // La ruta /api/og lee las fuentes (assets/fonts) y la foto (public/og) con fs en
  // runtime. El file-tracing no detecta el join dinámico con process.cwd(), así que
  // se fuerza su inclusión en el bundle serverless para que no falle en Vercel.
  outputFileTracingIncludes: {
    "/api/og": ["./assets/fonts/**", "./public/og/og-home-600x630.jpg"],
  },
  experimental: {
    // 404 global para URLs no coincidentes (app/global-not-found.tsx). Es la vía que
    // recomienda la doc de Next cuando el root layout es un segmento dinámico de
    // nivel superior (app/[lang]/layout.tsx): no se puede componer un not-found
    // consistente con layout+not-found anidados, así que se sirve una página 404
    // completa a nivel de enrutado. Ver not-found.md del paquete.
    globalNotFound: true,
  },
};

// Vigilancia del peso del JS de cliente (D11). Se activa con `ANALYZE=true npm run build`;
// en un build normal es un no-op.
const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default bundleAnalyzer(nextConfig);
