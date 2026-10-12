"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import {
  SystemMessage,
  SYSTEM_BTN_OUTLINE,
  SYSTEM_BTN_PRIMARY,
} from "./system-message";
import { getSystemMessages } from "@/lib/i18n/system-messages";

/**
 * EL CUERPO DE UN ERROR BOUNDARY, UNA SOLA VEZ (P72.19, 2026-09-02).
 *
 * Next obliga a DOS módulos —`app/[lang]/error.tsx` para lo que falla dentro del
 * árbol, y `app/global-error.tsx` para lo que falla en el layout raíz, que lo
 * REEMPLAZA y por eso trae su propio `<html>`/`<body>`—, pero lo que ven los dos
 * es exactamente la misma pantalla. Estaba escrita dos veces, y esa copia era de
 * las peligrosas: **el segundo solo aparece si se cae el layout raíz**, así que un
 * cambio hecho a medias no se nota mirando el sitio. Se veía en producción el día
 * malo, que es el único día en que importa.
 *
 * Lo que queda en cada módulo es lo que de verdad los distingue: el marco. Esta
 * pieza es el contenido.
 *
 * NO VA EN `system-message.tsx` a propósito: aquel es PURO —sin hooks y sin
 * `"use client"`— para poder renderizarse también en el `not-found` de servidor, y
 * meterle un `usePathname` se lo llevaría por delante.
 */
export function ErrorBoundaryBody({
  error,
  onRetry,
}: {
  error: Error & { digest?: string };
  onRetry: () => void;
}) {
  useEffect(() => {
    // Traza para diagnóstico (en el server aparece en los logs de Vercel).
    console.error(error);
  }, [error]);

  const lang = errorLang(usePathname());
  const t = getSystemMessages(lang);
  const homeHref = lang === "es" ? "/" : "/en";

  return (
    <SystemMessage
      homeHref={homeHref}
      homeAria={t.homeAria}
      title={t.error.title}
      body={t.error.body}
    >
      <button
        type="button"
        onClick={() => onRetry()}
        className={SYSTEM_BTN_PRIMARY}
      >
        {t.error.retry}
      </button>
      <a href={homeHref} className={SYSTEM_BTN_OUTLINE}>
        {t.home}
      </a>
    </SystemMessage>
  );
}

/**
 * El locale se deduce de la URL y no del diccionario: aquí no se puede depender
 * del runtime que quizá sea justo lo que ha fallado. Tras el rewrite del proxy el
 * EN lleva prefijo `/en` y el ES va sin prefijo.
 */
export function errorLang(pathname: string | null): "es" | "en" {
  const p = pathname || "/";
  return p === "/en" || p.startsWith("/en/") ? "en" : "es";
}
