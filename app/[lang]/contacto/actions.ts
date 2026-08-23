"use server";

import { headers } from "next/headers";

import {
  HONEYPOT_FIELD,
  MAX_FILL_MS,
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
// misma IP en una misma instancia. Es lo proporcionado al tráfico de un
// portfolio: la alternativa —un almacén compartido— mete una dependencia y un
// servicio nuevo para defender un buzón que ya tiene el filtro de Gmail detrás.
// El honeypot y el filtro de velocidad son los que paran al bot; esto solo evita
// que un humano insistente llene la bandeja.
const WINDOW_MS = 60 * 60 * 1_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  // El mapa no crece sin fin: cada envío barre las claves que ya caducaron.
  if (hits.size > 500) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }
  return false;
}

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
  if (field(data, HONEYPOT_FIELD).trim()) return { status: "sent" };

  // 2. El filtro de velocidad, con el mismo silencio. El sello lo pone el
  //    cliente al montar; si no hay JS no hay sello, y entonces no se juzga.
  const stamp = Number(field(data, TIMESTAMP_FIELD));
  if (Number.isFinite(stamp) && stamp > 0) {
    const elapsed = Date.now() - stamp;
    if (elapsed < MIN_FILL_MS || elapsed > MAX_FILL_MS) {
      return { status: "sent" };
    }
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

  if (rateLimited(await clientKey())) {
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
