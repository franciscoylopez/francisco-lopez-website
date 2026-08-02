import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

// Cabeceras de seguridad — Fase 1 (tarea 30.4): las triviales y sin riesgo. Riesgo
// bajo hoy (portfolio estático, sin auth, sin formularios ni input de usuario), pero
// es el hueco más barato de cerrar y un sitio que argumenta rigor debería servirlas.
// La CSP (Fase 2) va aparte: no es trivial con GTM/GA4 + scripts inline (consent-init,
// JSON-LD) y hay que elegir enfoque sin romper analítica ni consentimiento.
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
