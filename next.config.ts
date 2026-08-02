import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const nextConfig: NextConfig = {
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
