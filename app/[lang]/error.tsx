"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import {
  SystemMessage,
  SYSTEM_BTN_OUTLINE,
  SYSTEM_BTN_PRIMARY,
} from "@/components/site/system-message";
import { getSystemMessages } from "@/lib/i18n/system-messages";

// Error boundary con marca e i18n (tarea 30.2). Debe ser client component (contrato
// de Next: recibe {error, reset}). Se renderiza cuando algo del árbol falla, así que
// se mantiene autocontenido —copy desde system-messages, sin depender del diccionario
// runtime que podría ser justo lo que ha fallado—. El locale se deduce de la URL
// (usePathname): tras el rewrite del proxy, el EN lleva prefijo /en y el ES va sin
// prefijo. Cubre errores de página/componente; los de layout van a un nivel superior.
export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    // Traza para diagnóstico (en el server aparece en los logs de Vercel).
    console.error(error);
  }, [error]);

  const pathname = usePathname() || "/";
  const lang = pathname === "/en" || pathname.startsWith("/en/") ? "en" : "es";
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
        onClick={() => unstable_retry()}
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
