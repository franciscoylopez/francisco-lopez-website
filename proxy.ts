import { NextResponse, type NextRequest } from "next/server";

import { defaultLocale } from "@/lib/i18n/config";

// D3: Next 16 renombra `middleware` → `proxy` (misma funcionalidad). El propio
// doc de i18n del paquete usa `export function proxy`.
//
// Enrutado de locale as-needed (D2):
//   - `/en`, `/en/...`  → se sirven tal cual (árbol app/[lang] con lang="en").
//   - `/es`, `/es/...`  → NO son canónicos (el español va sin prefijo) → redirect
//                          a la ruta sin `/es`.
//   - resto              → español por defecto: rewrite interno a `/es/...` sin
//                          cambiar la URL del navegador (la raíz sirve ES directo,
//                          sin redirect).
// Cabecera con el locale detectado. La lee `not-found.tsx` (server component), que
// no recibe `params` y no puede deducir el idioma de otra forma. Se propaga en la
// request reescrita/pasada, no en la respuesta.
function withLocale(request: NextRequest, locale: string) {
  const headers = new Headers(request.headers);
  headers.set("x-locale", locale);
  return headers;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return NextResponse.next({
      request: { headers: withLocale(request, "en") },
    });
  }

  if (pathname === "/es" || pathname.startsWith("/es/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice("/es".length) || "/";
    return NextResponse.redirect(url);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url, {
    request: { headers: withLocale(request, defaultLocale) },
  });
}

export const config = {
  // No corre en assets internos (_next), API, ni rutas con extensión de archivo
  // (favicon.ico, /og/*.jpg, /img/*.webp, /cv/*.pdf, …).
  //
  // `prototipos` ES TEMPORAL: es la superficie de la skill `/prototype`, que vive
  // fuera de `app/[lang]/` para no chocar con `check:rutas` ni con `pageMetadata`.
  // Sin esta exclusión, el enrutado de locale la reescribe a `/es/prototipos/…`,
  // que no existe, y devuelve 404. SE BORRA junto con `app/prototipos/` al
  // promover la variante ganadora (P66).
  matcher: ["/((?!_next|api|prototipos|.*\\..*).*)"],
};
