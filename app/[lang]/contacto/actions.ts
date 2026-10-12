"use server";

import { headers } from "next/headers";

import {
  HONEYPOT_FIELD,
  MIN_FILL_MS,
  TIMESTAMP_FIELD,
  type ContactState,
  type ContactValues,
  hasErrors,
  trimValues,
  validateContact,
} from "@/lib/contact-form";
import { sendContactMessage } from "@/lib/mailer";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import { creaLimitador } from "@/lib/rate-limit";

// El envío del formulario, como Server Action (P67).
//
// POR QUÉ UNA SERVER ACTION Y NO UN ENDPOINT EXTERNO. El POST sale al MISMO
// ORIGEN, así que la CSP no cambia: `form-action 'self'` y `connect-src 'self'`
// ya lo permiten, y no hay que abrir un dominio de terceros en `next.config.ts`.
// Era una de las tres cosas que la tarea pedía decidir antes de escribir código,
// y la respuesta resultó ser «ninguna de las dos que temíamos».
//
// Y funciona SIN JAVASCRIPT: un `<form action={…}>` con Server Action postea el
// formulario igual con el JS deshabilitado. La validación de cliente es una
// comodidad, no el mecanismo.

// ── Límite de frecuencia ──────────────────────────────────────────────────────
//
// En memoria del proceso, a propósito, y hay que saber lo que eso NO es: en
// serverless cada instancia tiene su mapa y una instancia fría empieza a cero,
// así que esto no es un límite duro sino un tope al envío repetido desde una
// misma IP en una misma instancia. Las reglas viven en `lib/rate-limit.ts`, con
// sus tests. Es lo proporcionado al tráfico de un
// portfolio: la alternativa —un almacén compartido— mete una dependencia y un
// servicio nuevo para defender un buzón que ya tiene el filtro de Gmail detrás.
// El honeypot y el filtro de velocidad son los que paran al bot; esto solo evita
// que un humano insistente llene la bandeja.
const WINDOW_MS = 60 * 60 * 1_000;
const MAX_PER_WINDOW = 5;

const limite = creaLimitador({ ventanaMs: WINDOW_MS, max: MAX_PER_WINDOW });

async function clientKey(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || h.get("x-real-ip") || "anon";
}

function field(data: FormData, name: string): string {
  const value = data.get(name);
  return typeof value === "string" ? value : "";
}

export async function submitContact(
  _prev: ContactState,
  data: FormData,
): Promise<ContactState> {
  // 1. La trampa. Si viene rellena, quien envió no leyó: el campo está oculto.
  //    Se contesta «enviado» y no se envía nada — decirle a un bot que lo ha
  //    detectado solo le enseña a evitarlo la próxima vez.
  //
  //    `contabiliza: false` es lo ÚNICO que distingue este «enviado» del real:
  //    la UI pinta lo mismo, y lo que cambia es que la analítica no lo sume
  //    (P52.5). Un bot de honeypot no lee el `dataLayer`.
  if (field(data, HONEYPOT_FIELD).trim())
    return { status: "sent", contabiliza: false };

  // 2. El filtro de velocidad, con el mismo silencio. El sello lo pone el
  //    cliente al montar; si no hay JS no hay sello, y entonces no se juzga.
  //
  //    SOLO JUZGA POR ABAJO, y el silencio depende de eso. Aquí hubo también un
  //    tope de 12 h, y con él quien dejaba la pestaña abierta y enviaba al día
  //    siguiente veía la pantalla de éxito sin que se enviara nada: para un bot
  //    ese silencio es correcto —no se le enseña que lo has cazado—, pero quien
  //    cae por arriba es una persona y la confirmación era mentira, sobre la
  //    métrica primaria del PRD §7 además. El tope tampoco defendía de nadie: el
  //    que caza bots es el suelo (P68.48, 2026-08-23).
  const stamp = Number(field(data, TIMESTAMP_FIELD));
  if (Number.isFinite(stamp) && stamp > 0 && Date.now() - stamp < MIN_FILL_MS) {
    return { status: "sent", contabiliza: false };
  }

  // 3. La validación de verdad, la que decide. La del cliente no cuenta aquí:
  //    quien postea a mano no la ha ejecutado.
  const values: ContactValues = trimValues({
    nombre: field(data, "nombre"),
    email: field(data, "email"),
    mensaje: field(data, "mensaje"),
  });
  const errors = validateContact(values);
  if (hasErrors(errors)) return { status: "invalid", errors };

  if (limite.limitado(await clientKey())) {
    return { status: "failed", reason: "rate" };
  }

  const lang = field(data, "lang");
  const result = await sendContactMessage(values, {
    locale: isLocale(lang) ? lang : defaultLocale,
  });

  return result.ok
    ? { status: "sent" }
    : { status: "failed", reason: "server" };
}
