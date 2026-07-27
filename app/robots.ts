import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

// /robots.txt — la ruta la sirve directo (el proxy excluye paths con extensión).
// Se gatea por entorno (D13): solo producción es indexable; en preview/dev se
// bloquea todo, como refuerzo del noindex que Vercel ya pone en los previews,
// para que un deployment de rama no se cuele en el índice.
export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.VERCEL_ENV === "production";

  if (!isProduction) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
