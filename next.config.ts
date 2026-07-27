import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const nextConfig: NextConfig = {
  // La ruta /api/og lee las fuentes (assets/fonts) y la foto (public/og) con fs en
  // runtime. El file-tracing no detecta el join dinámico con process.cwd(), así que
  // se fuerza su inclusión en el bundle serverless para que no falle en Vercel.
  outputFileTracingIncludes: {
    "/api/og": ["./assets/fonts/**", "./public/og/og-home-1200x630.jpg"],
  },
};

// Vigilancia del peso del JS de cliente (D11). Se activa con `ANALYZE=true npm run build`;
// en un build normal es un no-op.
const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default bundleAnalyzer(nextConfig);
