import { describe, expect, it } from "vitest";

import {
  EMAIL_MAX,
  MESSAGE_MAX,
  MESSAGE_MIN,
  NAME_MAX,
  type ContactValues,
  hasErrors,
  trimValues,
  validateContact,
} from "@/lib/contact-form";

// La validación compartida por cliente y servidor. Es la regla que decide, porque
// la del cliente no existe para quien postea a mano.

const VALIDO: ContactValues = {
  nombre: "Marta Ruiz",
  email: "marta@example.com",
  mensaje: "Os escribo por la oferta de Product Manager.",
};

const con = (parche: Partial<ContactValues>): ContactValues => ({
  ...VALIDO,
  ...parche,
});

describe("validateContact", () => {
  it("no encuentra nada que objetar a un envío normal", () => {
    expect(validateContact(VALIDO)).toEqual({});
    expect(hasErrors(validateContact(VALIDO))).toBe(false);
  });

  describe("obligatoriedad", () => {
    it("marca `required` en los tres campos cuando llegan vacíos", () => {
      expect(validateContact({ nombre: "", email: "", mensaje: "" })).toEqual({
        nombre: "required",
        email: "required",
        mensaje: "required",
      });
    });

    it("un campo de solo espacios está vacío, no relleno", () => {
      expect(
        validateContact({ nombre: "   ", email: " \t ", mensaje: "\n  \n" }),
      ).toEqual({
        nombre: "required",
        email: "required",
        mensaje: "required",
      });
    });

    it("`required` gana a cualquier otro código: un vacío no es un correo mal escrito", () => {
      expect(validateContact(con({ email: "" })).email).toBe("required");
      expect(validateContact(con({ mensaje: "" })).mensaje).toBe("required");
    });
  });

  describe("longitudes", () => {
    it("acepta el nombre justo en el límite y rechaza el siguiente", () => {
      expect(
        validateContact(con({ nombre: "a".repeat(NAME_MAX) })).nombre,
      ).toBe(undefined);
      expect(
        validateContact(con({ nombre: "a".repeat(NAME_MAX + 1) })).nombre,
      ).toBe("long");
    });

    it("una dirección más larga que el límite de la RFC es `long`, no `email`", () => {
      const largo = `${"a".repeat(EMAIL_MAX)}@example.com`;
      expect(validateContact(con({ email: largo })).email).toBe("long");
    });

    it("el mensaje tiene suelo y techo", () => {
      expect(
        validateContact(con({ mensaje: "a".repeat(MESSAGE_MIN - 1) })).mensaje,
      ).toBe("short");
      expect(
        validateContact(con({ mensaje: "a".repeat(MESSAGE_MIN) })).mensaje,
      ).toBe(undefined);
      expect(
        validateContact(con({ mensaje: "a".repeat(MESSAGE_MAX) })).mensaje,
      ).toBe(undefined);
      expect(
        validateContact(con({ mensaje: "a".repeat(MESSAGE_MAX + 1) })).mensaje,
      ).toBe("long");
    });

    it("mide sobre el valor RECORTADO: nueve letras entre espacios siguen siendo nueve", () => {
      expect(
        validateContact(con({ mensaje: `   ${"a".repeat(9)}   ` })).mensaje,
      ).toBe("short");
    });
  });

  describe("forma del correo", () => {
    it.each([
      ["sin arroba", "martaexample.com"],
      ["sin dominio", "marta@"],
      ["sin buzón", "@example.com"],
      ["sin punto en el dominio", "marta@example"],
      ["con un TLD de una sola letra", "marta@example.c"],
      ["con un espacio dentro", "mar ta@example.com"],
      ["con dos arrobas", "marta@otra@example.com"],
    ])("rechaza una dirección %s", (_caso, email) => {
      expect(validateContact(con({ email })).email).toBe("email");
    });

    it.each([
      ["con etiqueta", "marta+trabajo@example.com"],
      ["con subdominio", "marta@correo.example.co.uk"],
      ["con guiones", "marta-ruiz@mi-empresa.es"],
    ])("acepta una dirección %s", (_caso, email) => {
      expect(validateContact(con({ email })).email).toBe(undefined);
    });

    // Esta permisividad es DELIBERADA y no se toca: `<`, `>` y la coma pasan el
    // filtro. La defensa contra la segunda dirección colada (P68.47) vive en
    // `lib/mailer.ts`, que pasa el destinatario como objeto en vez de
    // concatenarlo — ahí está su test. Si algún día alguien "arregla" esta
    // expresión regular para que rechace estos caracteres, este test se cae y
    // recuerda por qué no era el sitio.
    it("deja pasar los caracteres con los que se inyecta una cabecera, a propósito", () => {
      expect(
        validateContact(con({ email: "x>,<atacante@evil.com" })).email,
      ).toBe(undefined);
    });
  });
});

describe("trimValues", () => {
  it("recorta los tres campos y no toca el interior", () => {
    expect(
      trimValues({
        nombre: "  Marta Ruiz  ",
        email: "\tmarta@example.com\n",
        mensaje: "  Hola,  ¿qué tal?  ",
      }),
    ).toEqual({
      nombre: "Marta Ruiz",
      email: "marta@example.com",
      mensaje: "Hola,  ¿qué tal?",
    });
  });
});

describe("hasErrors", () => {
  it("distingue el objeto vacío de uno con un solo código", () => {
    expect(hasErrors({})).toBe(false);
    expect(hasErrors({ email: "email" })).toBe(true);
  });
});
