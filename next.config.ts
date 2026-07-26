import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const nextConfig: NextConfig = {/* config options here */};

// Vigilancia del peso del JS de cliente (D11). Se activa con `ANALYZE=true npm run build`;
// en un build normal es un no-op.
const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default bundleAnalyzer(nextConfig);
