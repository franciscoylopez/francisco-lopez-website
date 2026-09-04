import { describe, expect, it } from "vitest";

import {
  EVENTOS_CONSENTIMIENTO,
  cuentaComoAceptado,
  esEventoConsentimiento,
  INSTRUMENTO_CONSENTIMIENTO,
  SALVEDAD_TASA,
  SENALES_DE_PERSONA,
  SENALES_QUE_NO_VALEN,
  tasaDeAceptacion,
  TECHO_CONSENTIMIENTO_POR_IP_HORA,
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

describe("SENALES_DE_PERSONA · la puerta del «visto» (D200)", () => {
  it("no admite ningún suceso que el navegador dispare solo", () => {
    // EL CASO MALO DE VERDAD. Un `visto` que espera a `load` o a `resize` es el
    // contador de antes con otro nombre: los dos los emite el navegador al abrir
    // una pestaña, y un cliente automatizado los produce igual que una persona.
    // Añadir uno sería deshacer la corrección sin que se notara en ningún diff.
    for (const suceso of SENALES_QUE_NO_VALEN) {
      expect(SENALES_DE_PERSONA as readonly string[]).not.toContain(suceso);
    }
  });

  it("cubre las tres formas de manejar una página: puntero, teclado y desplazamiento", () => {
    const senales = SENALES_DE_PERSONA as readonly string[];
    expect(
      senales.some((s) => s.startsWith("pointer") || s === "touchstart"),
    ).toBe(true);
    expect(senales).toContain("keydown");
    expect(senales.some((s) => s === "scroll" || s === "wheel")).toBe(true);
  });

  it("la salvedad publicada nombra la puerta y su sesgo, no solo los dos viejos", () => {
    // La regla es la de BRAND.md: el sitio de una salvedad es al lado del número.
    // Si la puerta cambia y este texto no, la cifra sigue publicándose con una
    // descripción que ya no es la suya.
    expect(SALVEDAD_TASA).toMatch(/interact/i);
    expect(SALVEDAD_TASA).toMatch(/sin mover nada/i);
    // Y ya no puede decir que es un «suelo»: el sesgo nuevo va al revés.
    expect(SALVEDAD_TASA).not.toMatch(/suelo/i);
  });

  it("el instrumento sellado cambia cuando cambia la puerta, no solo el techo", () => {
    // Es lo que hace que D199 sirva de algo aquí: el sello siguiente tiene que
    // avisar en vez de restar contra la serie tomada sin puerta.
    expect(INSTRUMENTO_CONSENTIMIENTO).toContain(
      String(TECHO_CONSENTIMIENTO_POR_IP_HORA),
    );
    expect(INSTRUMENTO_CONSENTIMIENTO).toMatch(/interacción/);
  });
});
