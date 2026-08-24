import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  HONEYPOT_FIELD,
  INITIAL_STATE,
  MIN_FILL_MS,
  TIMESTAMP_FIELD,
} from "@/lib/contact-form";
import type { SendResult } from "@/lib/mailer";

// Las decisiones de la Server Action: a quién se le contesta «enviado» sin
// enviar nada, cuándo se juzga el sello, y qué ve una persona cuando el correo
// no sale. El envío en sí es de `lib/mailer.ts` y tiene sus propios tests: aquí
// se sustituye para poder afirmar CUÁNDO se llama y cuándo no.

const entorno = vi.hoisted(() => ({
  ip: "203.0.113.1",
  enviar: vi.fn<() => Promise<SendResult>>(),
}));

vi.mock("next/headers", () => ({
  headers: async () => new Headers({ "x-forwarded-for": entorno.ip }),
}));

vi.mock("@/lib/mailer", () => ({
  sendContactMessage: entorno.enviar,
}));

const { submitContact } = await import("@/app/[lang]/contacto/actions");

/**
 * Un envío como el que manda el navegador. El sello se pone con la antigüedad
 * que pida cada caso; `null` es «sin sello», que es lo que llega sin JavaScript.
 */
function envio(
  parche: Partial<Record<string, string>> = {},
  opciones: { antiguedadMs?: number | null } = {},
): FormData {
  const data = new FormData();
  data.set("nombre", "Marta Ruiz");
  data.set("email", "marta@example.com");
  data.set("mensaje", "Os escribo por la oferta de Product Manager.");
  data.set("lang", "es");

  const { antiguedadMs = MIN_FILL_MS + 1_000 } = opciones;
  if (antiguedadMs !== null) {
    data.set(TIMESTAMP_FIELD, String(Date.now() - antiguedadMs));
  }

  for (const [campo, valor] of Object.entries(parche)) {
    if (valor === undefined) data.delete(campo);
    else data.set(campo, valor);
  }
  return data;
}

const enviar = (data: FormData) => submitContact(INITIAL_STATE, data);

/** Cada caso estrena IP: el límite de frecuencia es estado vivo del módulo. */
let sufijo = 0;
beforeEach(() => {
  entorno.enviar.mockClear();
  entorno.enviar.mockResolvedValue({ ok: true });
  entorno.ip = `198.51.100.${(sufijo += 1)}`;
});

describe("submitContact", () => {
  it("envía un formulario correcto y lo confirma", async () => {
    await expect(enviar(envio())).resolves.toEqual({ status: "sent" });
    expect(entorno.enviar).toHaveBeenCalledTimes(1);
    expect(entorno.enviar).toHaveBeenCalledWith(
      {
        nombre: "Marta Ruiz",
        email: "marta@example.com",
        mensaje: "Os escribo por la oferta de Product Manager.",
      },
      { locale: "es" },
    );
  });

  it("recorta los campos antes de mandarlos: lo validado y lo enviado son lo mismo", async () => {
    await enviar(
      envio({ nombre: "  Marta Ruiz  ", email: " marta@example.com " }),
    );

    expect(entorno.enviar).toHaveBeenCalledWith(
      expect.objectContaining({
        nombre: "Marta Ruiz",
        email: "marta@example.com",
      }),
      expect.anything(),
    );
  });

  describe("los dos filtros que callan", () => {
    // A un bot no se le dice que lo has cazado: aprendería a evitarlo.
    it("con la trampa rellena contesta «enviado» y no envía nada", async () => {
      await expect(
        enviar(envio({ [HONEYPOT_FIELD]: "Acme S.L." })),
      ).resolves.toEqual({ status: "sent" });
      expect(entorno.enviar).not.toHaveBeenCalled();
    });

    it("la trampa con solo espacios no cuenta como rellena", async () => {
      await expect(enviar(envio({ [HONEYPOT_FIELD]: "   " }))).resolves.toEqual(
        {
          status: "sent",
        },
      );
      expect(entorno.enviar).toHaveBeenCalledTimes(1);
    });

    it("un envío más rápido de lo que se tarda en leer se calla igual", async () => {
      await expect(
        enviar(envio({}, { antiguedadMs: MIN_FILL_MS - 500 })),
      ).resolves.toEqual({ status: "sent" });
      expect(entorno.enviar).not.toHaveBeenCalled();
    });

    // La regresión de P68.48: aquí hubo también un tope por arriba, y con él
    // quien dejaba la pestaña abierta y enviaba al día siguiente veía la
    // pantalla de éxito sin que se enviara nada. El que caza bots es el suelo.
    it("una pestaña abierta desde ayer SÍ envía: el filtro solo juzga por abajo", async () => {
      await expect(
        enviar(envio({}, { antiguedadMs: 24 * 60 * 60 * 1_000 })),
      ).resolves.toEqual({ status: "sent" });
      expect(entorno.enviar).toHaveBeenCalledTimes(1);
    });

    it.each([
      ["sin sello, que es lo que llega sin JavaScript", null],
      ["con un sello que no es un número", "mañana"],
      ["con un sello a cero", "0"],
    ])("no juzga %s", async (_caso, sello) => {
      const data = envio({}, { antiguedadMs: null });
      if (typeof sello === "string") data.set(TIMESTAMP_FIELD, sello);

      await expect(enviar(data)).resolves.toEqual({ status: "sent" });
      expect(entorno.enviar).toHaveBeenCalledTimes(1);
    });
  });

  describe("la validación del servidor, que es la que decide", () => {
    it("devuelve los códigos de error y no llega al correo", async () => {
      await expect(
        enviar(
          envio({ nombre: "", email: "no-es-un-correo", mensaje: "Hola" }),
        ),
      ).resolves.toEqual({
        status: "invalid",
        errors: { nombre: "required", email: "email", mensaje: "short" },
      });
      expect(entorno.enviar).not.toHaveBeenCalled();
    });

    // Quien postea a mano no ha ejecutado la validación de cliente, así que
    // puede no mandar ni los campos.
    it("un POST sin los campos se valida igual", async () => {
      const data = new FormData();
      await expect(enviar(data)).resolves.toEqual({
        status: "invalid",
        errors: { nombre: "required", email: "required", mensaje: "required" },
      });
      expect(entorno.enviar).not.toHaveBeenCalled();
    });

    it("un campo que llega como archivo se trata como vacío, no revienta", async () => {
      const data = envio();
      data.set("nombre", new File(["x"], "cv.pdf"));

      await expect(enviar(data)).resolves.toEqual({
        status: "invalid",
        errors: { nombre: "required" },
      });
    });
  });

  describe("el idioma del correo", () => {
    it("viaja el del formulario", async () => {
      await enviar(envio({ lang: "en" }));
      expect(entorno.enviar).toHaveBeenCalledWith(expect.anything(), {
        locale: "en",
      });
    });

    it.each([["pt"], [""]])(
      "un idioma que no existe (%s) cae al de por defecto",
      async (lang) => {
        await enviar(envio({ lang }));
        expect(entorno.enviar).toHaveBeenCalledWith(expect.anything(), {
          locale: "es",
        });
      },
    );
  });

  describe("límite de frecuencia", () => {
    it("deja pasar cinco desde la misma IP y para el sexto", async () => {
      for (let i = 0; i < 5; i += 1) {
        await expect(enviar(envio())).resolves.toEqual({ status: "sent" });
      }

      await expect(enviar(envio())).resolves.toEqual({
        status: "failed",
        reason: "rate",
      });
      expect(entorno.enviar).toHaveBeenCalledTimes(5);
    });

    it("el tope es por IP: otro visitante no paga lo del anterior", async () => {
      for (let i = 0; i < 6; i += 1) await enviar(envio());

      entorno.ip = "198.51.100.250";
      await expect(enviar(envio())).resolves.toEqual({ status: "sent" });
    });

    it("se queda con la primera IP de `x-forwarded-for`, no con la cadena entera", async () => {
      const cliente = "198.51.100.240";
      entorno.ip = `${cliente}, 10.0.0.1, 10.0.0.2`;
      for (let i = 0; i < 5; i += 1) await enviar(envio());

      // Misma IP de cliente, otra cadena de proxies: tiene que contar igual.
      entorno.ip = `${cliente}, 172.16.0.9`;
      await expect(enviar(envio())).resolves.toEqual({
        status: "failed",
        reason: "rate",
      });
    });

    // Un envío inválido no gasta cupo: se rechaza antes de contarlo.
    it("los envíos inválidos no consumen el cupo", async () => {
      for (let i = 0; i < 10; i += 1) await enviar(envio({ email: "roto" }));

      await expect(enviar(envio())).resolves.toEqual({ status: "sent" });
    });
  });

  describe("cuando el correo no sale", () => {
    it("se le dice a la persona, no se le contesta «enviado»", async () => {
      entorno.enviar.mockResolvedValue({ ok: false, reason: "smtp" });

      await expect(enviar(envio())).resolves.toEqual({
        status: "failed",
        reason: "server",
      });
    });

    it("el motivo técnico no viaja al cliente", async () => {
      entorno.enviar.mockResolvedValue({
        ok: false,
        reason: "535 Username and Password not accepted",
      });

      const estado = await enviar(envio());
      expect(JSON.stringify(estado)).not.toContain("535");
    });
  });
});
