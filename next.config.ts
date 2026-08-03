import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

// Content-Security-Policy — Fase 2 «A+ barato» (tarea 37.9). Mantiene `'unsafe-inline'`
// en script-src (los scripts inline del sitio: consent-init, init de tema, loader de GTM),
// así que NO es protección de XSS fuerte — eso sería la CSP estricta con nonces, diferida
// a V3 (D26). Lo que sí aporta, gratis y sin romper nada: bloquear <object>/<embed>
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
  // <noscript> de GTM inyecta un iframe a googletagmanager/ns.html.
  "frame-src https://www.googletagmanager.com",
].join("; ");

// Cabeceras de seguridad — Fase 1 (tarea 30.4): las triviales y sin riesgo. Riesgo
// bajo hoy (portfolio estático, sin auth, sin formularios ni input de usuario), pero
// es el hueco más barato de cerrar y un sitio que argumenta rigor debería servirlas.
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

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // La ruta /api/og lee las fuentes (assets/fonts) y la foto (public/og) con fs en
  // runtime. El file-tracing no detecta el join dinámico con process.cwd(), así que
  // se fuerza su inclusión en el bundle serverless para que no falle en Vercel.
  outputFileTracingIncludes: {
    "/api/og": ["./assets/fonts/**", "./public/og/og-home-1200x630.jpg"],
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
