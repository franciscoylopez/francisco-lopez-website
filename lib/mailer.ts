import "server-only";

import nodemailer from "nodemailer";

import { EMAIL } from "./contact";
import type { ContactValues } from "./contact-form";

// El envío del formulario de contacto (P67). Primera vez que este sitio deja de
// ser de solo lectura.
//
// POR QUÉ SMTP DE GOOGLE Y NO UN PROVEEDOR DE CORREO TRANSACCIONAL. La página
// «Privacidad y cookies» dice, en el bloque del artículo 13, que «la única
// empresa que interviene es Google». Un proveedor externo sería un ENCARGADO DEL
// TRATAMIENTO nuevo, con su transferencia internacional, y habría que declararlo
// ahí: coste real y permanente a cambio de comodidad de implementación. Con el
// SMTP de la propia cuenta no entra nadie nuevo, el `From` es la dirección de
// verdad y no hay ni un registro DNS que tocar (D26 pedía «cero DNS»).
//
// Y por eso el `From` es el Gmail y no el visitante: mandar `From: visitante@…`
// desde aquí falla SPF y DKIM a la vez —es el patrón exacto del spoofing y Gmail
// lo filtra—. El visitante va en `Reply-To`, que es lo que hace que «Responder»
// funcione. Es la misma conclusión que dejó escrita P65.
//
// SE ENVÍA EN TEXTO PLANO, no en HTML, y tampoco es una decisión de estilo: un
// cuerpo de texto no interpreta nada de lo que escriba el visitante, así que la
// primera superficie de entrada no confiable del sitio no puede inyectar marcado
// en el buzón. Lo único que sí hay que sanear son las CABECERAS (ver `header`).

const SMTP_HOST = "smtp.gmail.com";
const SMTP_PORT = 587; // STARTTLS. El 465 (TLS directo) también vale; este viaja mejor.

/**
 * La contraseña de aplicación de Google. NO es la contraseña de la cuenta:
 * requiere 2FA y se genera en https://myaccount.google.com/apppasswords.
 * Sin ella el módulo no envía y lo dice; nunca falla en silencio.
 */
function credentials(): { user: string; pass: string } | null {
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!pass) return null;
  return { user: process.env.GMAIL_USER ?? EMAIL, pass };
}

/**
 * Una cabecera no puede contener saltos de línea: un `\n` en el nombre o en la
 * dirección permitiría añadir cabeceras propias (un `Bcc:`, por ejemplo). Es la
 * inyección de cabeceras de toda la vida, y el saneado es este, no una lista de
 * palabras prohibidas.
 */
function header(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

export type SendResult = { ok: true } | { ok: false; reason: string };

export async function sendContactMessage(
  values: ContactValues,
  meta: { locale: string },
): Promise<SendResult> {
  const creds = credentials();
  if (!creds) return { ok: false, reason: "missing-credentials" };

  const from = header(creds.user);
  const replyTo = header(values.email);
  const nombre = header(values.nombre);

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: false,
    requireTLS: true,
    auth: creds,
  });

  try {
    await transporter.sendMail({
      // El remitente es la propia cuenta y el nombre visible dice de quién viene
      // el mensaje: en la bandeja se lee «Contacto web · Marta Ruiz» sin abrirlo.
      from: { name: `Contacto web · ${nombre}`, address: from },
      to: from,
      replyTo: `${nombre} <${replyTo}>`,
      subject: `Contacto web · ${nombre}`,
      text: [
        `Nombre:  ${values.nombre}`,
        `Correo:  ${values.email}`,
        `Idioma:  ${meta.locale}`,
        "",
        values.mensaje,
      ].join("\n"),
    });
    return { ok: true };
  } catch (error) {
    // El detalle se queda en el log del servidor: al visitante se le dice que no
    // ha salido y se le ofrece el correo directo, nunca el mensaje del proveedor.
    console.error("[contacto] fallo al enviar:", error);
    return { ok: false, reason: "smtp" };
  }
}
