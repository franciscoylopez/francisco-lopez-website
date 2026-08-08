import { headers } from "next/headers";

import {
  SystemMessage,
  SYSTEM_BTN_PRIMARY,
} from "@/components/site/system-message";
import { defaultLocale, isLocale } from "@/lib/i18n/config";
import { getSystemMessages } from "@/lib/i18n/system-messages";

// 404 con marca e i18n (tarea 30.2). El proxy reescribe toda ruta desconocida bajo
// /es|/en, así que el not-found se renderiza dentro de [lang]/layout (que ya fija
// <html lang>). Pero el componente not-found de Next NO recibe `params`, así que el
// locale se lee de la cabecera `x-locale` que fija el proxy. Server-rendered → 404
// real, sin depender de JS de cliente para mostrar el mensaje.
export default async function NotFound() {
  const header = (await headers()).get("x-locale") ?? "";
  const lang = isLocale(header) ? header : defaultLocale;
  const t = getSystemMessages(lang);
  const homeHref = lang === "es" ? "/" : `/${lang}`;

  return (
    <SystemMessage
      homeHref={homeHref}
      homeAria={t.homeAria}
      eyebrow={t.notFound.code}
      title={t.notFound.title}
      body={t.notFound.body}
    >
      <a href={homeHref} className={SYSTEM_BTN_PRIMARY}>
        {t.home}
      </a>
    </SystemMessage>
  );
}
