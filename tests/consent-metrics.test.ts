import { describe, expect, it } from "vitest";

import {
  EVENTOS_CONSENTIMIENTO,
  cuentaComoAceptado,
  esEventoConsentimiento,
  tasaDeAceptacion,
} from "@/lib/consent-metrics";

// Los tests del contador de consentimiento (P68.61, D168). Lo que se prueba aquí
// no es que sume: es que signifique lo que dice significar.

describe("cuentaComoAceptado", () => {
  it("cuenta como aceptado quien concede analíticas, aunque deniegue marketing", () => {
    // EL CASO QUE JUSTIFICA LA FUNCIÓN. Alguien que abre las preferencias y
    // concede solo analíticas no pulsó «Aceptar todo», y su visita SÍ la ve GA4 —
    // que es lo único que el denominador tiene que describir. Contarlo como
    // rechazo hundiría la tasa por la vía de los usuarios más deliberados.
    expect(cuentaComoAceptado({ analytics: true, marketing: false })).toBe(
      "aceptado",
    );
  });

  it("cuenta como rechazado quien deniega analíticas aunque conceda marketing", () => {
    // El espejo del anterior, y hoy es una combinación que la interfaz no ofrece:
    // se prueba porque el día que `marketing` deje de estar sin uso, la regla
    // tiene que seguir mirando a `analytics` y no a «concedió algo».
    expect(cuentaComoAceptado({ analytics: false, marketing: true })).toBe(
      "rechazado",
    );
  });

  it("cubre las dos puertas simples", () => {
    expect(cuentaComoAceptado({ analytics: true, marketing: true })).toBe(
      "aceptado",
    );
    expect(cuentaComoAceptado({ analytics: false, marketing: false })).toBe(
      "rechazado",
    );
  });
});

describe("esEventoConsentimiento", () => {
  it("acepta los tres sucesos y nada más", () => {
    for (const evento of EVENTOS_CONSENTIMIENTO) {
      expect(esEventoConsentimiento(evento)).toBe(true);
    }
  });

  it("rechaza lo que llegaría por un POST hecho a mano", () => {
    // EL CASO MALO. La Server Action es un POST público, así que esta guarda es
    // lo único que separa el contador de una entrada arbitraria. Se prueban las
    // formas que no son cadena, porque `includes` sobre un array de cadenas las
    // dejaría pasar si la comprobación de tipo se cayera.
    for (const malo of [
      "VISTO",
      "visto ",
      "",
      null,
      undefined,
      42,
      { visto: 1 },
      ["visto"],
      "__proto__",
      "toString",
    ]) {
      expect(esEventoConsentimiento(malo)).toBe(false);
    }
  });
});

describe("tasaDeAceptacion", () => {
  it("devuelve la fracción sobre los vistos", () => {
    expect(
      tasaDeAceptacion({ visto: 200, aceptado: 50, rechazado: 120 }),
    ).toBeCloseTo(0.25);
  });

  it("devuelve null sin denominador, y NO cero", () => {
    // «Un metro que devuelve lista vacía parece un aprobado». Un 0 % impreso al
    // lado de «0 vistos» se lee como un hallazgo demoledor y es la ausencia de
    // dato: son cosas distintas y tienen que verse distintas.
    expect(
      tasaDeAceptacion({ visto: 0, aceptado: 0, rechazado: 0 }),
    ).toBeNull();
  });

  it("no confunde «nadie aceptó» con «nadie vio»", () => {
    expect(tasaDeAceptacion({ visto: 40, aceptado: 0, rechazado: 40 })).toBe(0);
  });
});
