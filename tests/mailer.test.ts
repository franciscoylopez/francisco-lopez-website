import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ContactValues } from "@/lib/contact-form";

// El envío del correo, probado sobre el MENSAJE QUE NODEMAILER EMITE y no sobre
// la forma del objeto que se le pasa. La diferencia importa: el bug de P68.47 era
// exactamente que un objeto de aspecto razonable producía dos direcciones en la
// cabecera, y eso solo se ve mirando el RFC 822 resultante.
//
// Para verlo se sustituye el transporte SMTP por el `streamTransport` del propio
// nodemailer, que devuelve el mensaje completo en un búfer sin abrir un socket.
// El resto de nodemailer —codificación de cabeceras, entrecomillado, plegado— es
// el de verdad, que es justo lo que hay que probar.

const captura = vi.hoisted(() => ({
  mensajes: [] as string[],
  opciones: [] as Record<string, unknown>[],
  fallo: null as Error | null,
}));

vi.mock("server-only", () => ({}));

vi.mock("nodemailer", async () => {
  const real = await vi.importActual("nodemailer");
  const modulo = ("default" in real ? real.default : real) as {
    createTransport: (opciones: unknown) => {
      sendMail: (mail: unknown) => Promise<{ message: Buffer }>;
    };
  };

  return {
    default: {
      createTransport(opciones: Record<string, unknown>) {
        captura.opciones.push(opciones);
        const flujo = modulo.createTransport({
          streamTransport: true,
          buffer: true,
        });
        return {
          async sendMail(mail: unknown) {
            if (captura.fallo) throw captura.fallo;
            const info = await flujo.sendMail(mail);
            captura.mensajes.push(String(info.message));
            return info;
          },
        };
      },
    },
  };
});

const { sendContactMessage } = await import("@/lib/mailer");

const CUENTA = "buzon@example.com";

const VALIDO: ContactValues = {
  nombre: "Marta Ruiz",
  email: "marta@example.com",
  mensaje: "Os escribo por la oferta de Product Manager.",
};

/** El bloque de cabeceras, ya desplegado: una cabecera larga viaja partida. */
function cabeceras(mensaje: string): string[] {
  const bloque = mensaje.split(/\r?\n\r?\n/)[0] ?? "";
  return bloque.replace(/\r?\n[ \t]+/g, "").split(/\r?\n/);
}

function cabecera(mensaje: string, nombre: string): string {
  const prefijo = `${nombre.toLowerCase()}:`;
  const linea = cabeceras(mensaje).find((l) =>
    l.toLowerCase().startsWith(prefijo),
  );
  return linea ? linea.slice(prefijo.length).trim() : "";
}

/**
 * El cuerpo, ya legible. Un mensaje con acentos viaja en `quoted-printable`, así
 * que buscar «Primera línea.» en el búfer crudo no la encuentra: hay que
 * deshacer la codificación (y el plegado de líneas largas) antes de mirar.
 */
function cuerpo(mensaje: string): string {
  const [cabeza = "", ...resto] = mensaje.split(/\r?\n\r?\n/);
  const texto = resto.join("\n\n");
  if (!/quoted-printable/i.test(cabeza)) return texto;

  const bytes = texto
    .replace(/=\r?\n/g, "")
    .replace(/=([0-9A-Fa-f]{2})/g, (_, hex: string) =>
      String.fromCharCode(parseInt(hex, 16)),
    );
  return Buffer.from(bytes, "latin1").toString("utf8");
}

/** Los nombres de las cabeceras emitidas, en minúsculas. */
function nombresDeCabecera(mensaje: string): string[] {
  return cabeceras(mensaje).map((l) =>
    l.slice(0, l.indexOf(":")).toLowerCase(),
  );
}

/**
 * Cuántas direcciones hay en una cabecera. Se quitan primero las cadenas
 * entrecomilladas —que es donde nodemailer mete lo que podría separar— y se
 * cuentan las arrobas que quedan a la vista.
 */
function cuantasDirecciones(valor: string): number {
  const sinComillas = valor.replace(/"(?:[^"\\]|\\.)*"/g, "");
  return (sinComillas.match(/@/g) ?? []).length;
}

const ultimo = () => captura.mensajes.at(-1) ?? "";

beforeEach(() => {
  captura.mensajes.length = 0;
  captura.opciones.length = 0;
  captura.fallo = null;
  vi.stubEnv("GMAIL_APP_PASSWORD", "contraseña-de-aplicación-falsa");
  vi.stubEnv("GMAIL_USER", CUENTA);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("sendContactMessage", () => {
  it("envía y lo confirma", async () => {
    await expect(sendContactMessage(VALIDO, { locale: "es" })).resolves.toEqual(
      {
        ok: true,
      },
    );
    expect(captura.mensajes).toHaveLength(1);
  });

  describe("el remitente es la cuenta, nunca el visitante", () => {
    it("`From` y `To` son la propia cuenta; el visitante va en `Reply-To`", async () => {
      await sendContactMessage(VALIDO, { locale: "es" });

      // Mandar `From: visitante@…` falla SPF y DKIM a la vez: es el patrón del
      // spoofing y Gmail lo filtra.
      expect(cabecera(ultimo(), "From")).toContain(`<${CUENTA}>`);
      expect(cabecera(ultimo(), "To")).toContain(CUENTA);
      expect(cabecera(ultimo(), "Reply-To")).toContain("<marta@example.com>");
    });
  });

  describe("inyección de cabeceras", () => {
    // La regresión con nombre de P68.47. Con el `Reply-To` compuesto
    // concatenando cadenas, esta dirección emitía DOS: al pulsar «Responder» el
    // buzón contestaba también a quien no cree.
    it("una dirección con la coma colada sigue siendo UNA sola dirección", async () => {
      await sendContactMessage(
        { ...VALIDO, email: "x>,<atacante@evil.com" },
        { locale: "es" },
      );

      const replyTo = cabecera(ultimo(), "Reply-To");
      expect(cuantasDirecciones(replyTo)).toBe(1);
      expect(replyTo).toBe('Marta Ruiz <"x , atacante"@evil.com>');
    });

    it("un nombre que finge ser una dirección no añade una segunda", async () => {
      await sendContactMessage(
        { ...VALIDO, nombre: "Ana <ana@evil.com>, Otro" },
        { locale: "es" },
      );

      expect(cuantasDirecciones(cabecera(ultimo(), "Reply-To"))).toBe(1);
      expect(cabecera(ultimo(), "Reply-To")).toContain("<marta@example.com>");
    });

    // AQUÍ HAY QUE SER PRECISO CON QUIÉN DEFIENDE DE QUÉ, porque este test se
    // escribió primero afirmando de más y no tenía dientes: al quitar `header()`
    // de `lib/mailer.ts` seguía pasando. Nodemailer YA se defiende solo del
    // salto de línea —lo codifica en RFC 2047 y entrecomilla la dirección—, así
    // que «no aparece una cabecera Bcc» es cierto con `header()` y sin él.
    //
    // Lo que `header()` sí cambia, y es lo que se afirma abajo, es que el salto
    // no viaje NI SIQUIERA CODIFICADO dentro del valor de la cabecera.
    it("un salto de línea en el nombre no viaja ni codificado", async () => {
      await sendContactMessage(
        { ...VALIDO, nombre: "Marta\r\nBcc: x@evil.com" },
        { locale: "es" },
      );

      expect(nombresDeCabecera(ultimo())).not.toContain("bcc");
      // Sin `header()`, nodemailer emitiría `=?UTF-8?Q?Marta=0D=0ABcc…?=`.
      expect(cabecera(ultimo(), "Reply-To")).not.toContain("=0D=0A");
      expect(cabecera(ultimo(), "Reply-To")).toContain("Marta Bcc: x@evil.com");
    });

    it("un salto de línea en el correo tampoco abre una cabecera", async () => {
      await sendContactMessage(
        { ...VALIDO, email: "marta@example.com\r\nBcc: x@evil.com" },
        { locale: "es" },
      );

      // En la DIRECCIÓN, quien para esto es el entrecomillado de nodemailer:
      // con `header()` y sin él, el resultado emitido es el mismo. El test se
      // queda porque la propiedad importa —una cabecera de más es una copia a
      // quien no cree—, pero no cuenta como cobertura de nuestro saneado.
      expect(nombresDeCabecera(ultimo())).not.toContain("bcc");
      expect(cuantasDirecciones(cabecera(ultimo(), "Reply-To"))).toBe(1);
    });

    it("un salto de línea en el mensaje sí se conserva: el cuerpo no es una cabecera", async () => {
      await sendContactMessage(
        { ...VALIDO, mensaje: "Primera línea.\nSegunda línea." },
        { locale: "es" },
      );

      expect(cuerpo(ultimo())).toContain("Primera línea.");
      expect(cuerpo(ultimo())).toContain("Segunda línea.");
    });
  });

  describe("el cuerpo", () => {
    it("va en texto plano, para que nada de lo que escriba el visitante se interprete", async () => {
      await sendContactMessage(
        { ...VALIDO, mensaje: "<script>alert(1)</script>" },
        { locale: "es" },
      );

      expect(cabecera(ultimo(), "Content-Type")).toMatch(/^text\/plain/);
      expect(ultimo()).not.toContain("text/html");
      // Y llega tal cual: no se escapa, porque nada lo va a interpretar.
      expect(cuerpo(ultimo())).toContain("<script>alert(1)</script>");
    });

    it("lleva el idioma desde el que se escribió", async () => {
      await sendContactMessage(VALIDO, { locale: "en" });
      expect(cuerpo(ultimo())).toContain("Idioma:  en");
    });
  });

  describe("el transporte", () => {
    it("exige TLS: STARTTLS en el 587, nunca en claro", async () => {
      await sendContactMessage(VALIDO, { locale: "es" });

      expect(captura.opciones[0]).toMatchObject({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
      });
    });
  });

  describe("cuando no se puede enviar", () => {
    it("sin contraseña de aplicación no abre el transporte y lo dice", async () => {
      vi.stubEnv("GMAIL_APP_PASSWORD", "");

      await expect(
        sendContactMessage(VALIDO, { locale: "es" }),
      ).resolves.toEqual({ ok: false, reason: "missing-credentials" });
      expect(captura.opciones).toHaveLength(0);
    });

    it("si el SMTP falla, el detalle se queda en el log y no sale del servidor", async () => {
      const log = vi.spyOn(console, "error").mockImplementation(() => {});
      captura.fallo = new Error("535 5.7.8 Username and Password not accepted");

      const resultado = await sendContactMessage(VALIDO, { locale: "es" });

      expect(resultado).toEqual({ ok: false, reason: "smtp" });
      expect(resultado).not.toHaveProperty("message");
      expect(log).toHaveBeenCalled();
    });
  });
});
