// La forma del formulario de contacto y su validación, COMPARTIDAS por el
// cliente y el servidor (P67). Módulo puro: sin React, sin `nodemailer`, sin
// nada que no pueda cruzar la frontera.
//
// POR QUÉ DEVUELVE CÓDIGOS Y NO MENSAJES. El sitio no tiene un solo string
// hardcodeado (`CLAUDE.md`), y un mensaje de error no es una excepción por
// ocurrir en el servidor: se traduce igual que el resto. Así que la validación
// dice QUÉ falla (`required`, `email`, `short`…) y el diccionario de la página
// pone las palabras, en ES y en EN. Es lo que evita que la mitad del formulario
// hable español cuando el visitante está en `/en/contacto`.
//
// POR QUÉ LA MISMA FUNCIÓN EN LOS DOS LADOS. La del cliente existe para no
// mandar un viaje al servidor por un campo vacío; la del servidor existe porque
// la del cliente NO EXISTE para quien postea a mano. Son la misma regla aplicada
// con dos propósitos distintos, así que se escribe una vez: si divergieran, la
// que decide es siempre la del servidor y el visitante vería un error que su
// navegador no había anticipado.

/** Los tres campos que se envían. Sin apellidos, sin asunto, sin empresa (P65). */
export const FIELD_NAMES = ["nombre", "email", "mensaje"] as const;

export type FieldName = (typeof FIELD_NAMES)[number];

export type ContactValues = Record<FieldName, string>;

/**
 * El campo trampa. No lo rellena una persona —va oculto y con `tabIndex={-1}`—,
 * así que si llega con contenido, quien envió no era una persona. Se llama
 * `empresa` a propósito: un bot rellena lo que reconoce, y «empresa» es un campo
 * plausible en un formulario de contacto. Un `name="honeypot"` no engaña a nadie.
 */
export const HONEYPOT_FIELD = "empresa";

/** El instante en que el formulario se montó, para el filtro de velocidad. */
export const TIMESTAMP_FIELD = "ts";

/**
 * Cuánto tarda una persona, como mínimo, en leer tres campos y escribir un
 * mensaje. Por debajo de esto no hubo lectura: hubo un POST automático.
 */
export const MIN_FILL_MS = 3_000;

export const NAME_MAX = 80;
export const EMAIL_MAX = 254; // El límite real de una dirección (RFC 5321).
export const MESSAGE_MIN = 10;
export const MESSAGE_MAX = 4_000;

/**
 * Qué puede fallar en un campo. `long` no es defensa contra nadie: es lo que
 * impide que un mensaje de 2 MB llegue al buzón.
 */
export type ErrorCode = "required" | "email" | "short" | "long";

export type FieldErrors = Partial<Record<FieldName, ErrorCode>>;

/**
 * Deliberadamente permisiva: hay una arroba, hay algo a cada lado y el dominio
 * tiene punto. Validar direcciones con precisión es imposible con una expresión
 * regular, y el precio de intentarlo es rechazar correos válidos. La prueba real
 * de que la dirección existe es que la respuesta llegue.
 */
const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContact(values: ContactValues): FieldErrors {
  const errors: FieldErrors = {};

  const nombre = values.nombre.trim();
  if (!nombre) errors.nombre = "required";
  else if (nombre.length > NAME_MAX) errors.nombre = "long";

  const email = values.email.trim();
  if (!email) errors.email = "required";
  else if (email.length > EMAIL_MAX) errors.email = "long";
  else if (!EMAIL_SHAPE.test(email)) errors.email = "email";

  const mensaje = values.mensaje.trim();
  if (!mensaje) errors.mensaje = "required";
  else if (mensaje.length < MESSAGE_MIN) errors.mensaje = "short";
  else if (mensaje.length > MESSAGE_MAX) errors.mensaje = "long";

  return errors;
}

/**
 * Lo que el formulario sabe de sí mismo entre un envío y el siguiente. Vive
 * aquí y no junto a la Server Action porque un módulo `"use server"` solo puede
 * exportar funciones asíncronas: la constante inicial no cabe ahí.
 */
export type ContactState =
  | { status: "idle" }
  | { status: "invalid"; errors: FieldErrors }
  | { status: "sent" }
  | { status: "failed"; reason: "rate" | "server" };

export const INITIAL_STATE: ContactState = { status: "idle" };

export function hasErrors(errors: FieldErrors): boolean {
  return FIELD_NAMES.some((name) => errors[name]);
}

/** Los campos, ya recortados. Lo que se valida y lo que se envía es lo mismo. */
export function trimValues(values: ContactValues): ContactValues {
  return {
    nombre: values.nombre.trim(),
    email: values.email.trim(),
    mensaje: values.mensaje.trim(),
  };
}
