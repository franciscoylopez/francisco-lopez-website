/**
 * La regla que impide restar dos metros distintos (D199).
 *
 * El sello de medición ya sabía comparar cifras; lo que no sabía era que dos
 * lecturas pueden no ser comparables. El primer sello del contador de
 * consentimiento viajó en el MISMO commit que subía el techo del limitador de 10 a
 * 100 sucesos por hora y por IP (`b1c109e`, 2026-09-02), así que la pasada
 * siguiente imprimió `visto: 13 → 59 (+46)` como si fuera crecimiento de tráfico.
 * Era, sobre todo, la deflación que se acababa de retirar.
 *
 * Se prueba con la forma de `check:guardianes` y de `tests/tablero.test.ts`: no
 * que sepa restar, sino que sepa **negarse a restar**. Un metro que resta siempre
 * no falla nunca, y por eso el caso importante es el malo.
 */
import { describe, expect, it } from "vitest";

import {
  comparaConAnterior,
  type FuenteSellada,
  type RegistroMedicion,
} from "@/scripts/medicion/registro";

const consentimiento = (
  visto: number,
  instrumento?: string,
): FuenteSellada => ({
  fuente: "consentimiento",
  estado: "leida",
  ...(instrumento === undefined ? {} : { instrumento }),
  cifras: { visto, aceptado: 0, rechazado: 0, tasa_pct: 0 },
});

const sello = (etapa: string, fuente: FuenteSellada): RegistroMedicion => ({
  fecha: "2026-09-04",
  ventana: { desde: "2026-08-07", hasta: "2026-09-03" },
  etapa,
  fuentes: [fuente],
});

const texto = (a: RegistroMedicion | null, b: RegistroMedicion) =>
  comparaConAnterior(a, b).join("\n");

describe("comparaConAnterior · el instrumento manda sobre la resta", () => {
  it("resta cuando los dos sellos comparten instrumento", () => {
    const salida = texto(
      sello("Higiene", consentimiento(59, "techo 100/h por IP")),
      sello("Cierre V3", consentimiento(80, "techo 100/h por IP")),
    );

    expect(salida).toContain("visto: 59 → 80");
    expect(salida).toContain("(+21)");
    expect(salida).not.toContain("NO SE RESTA");
  });

  it("AVISA EN VEZ DE RESTAR cuando el instrumento cambió — el caso b1c109e", () => {
    const salida = texto(
      sello("Distribución", consentimiento(13, "techo 10/h por IP")),
      sello("Higiene", consentimiento(59, "techo 100/h por IP")),
    );

    expect(salida).toContain("NO SE RESTA");
    expect(salida).toContain("techo 10/h por IP");
    expect(salida).toContain("techo 100/h por IP");
    // Y lo que NO puede salir: el número que se leía como tráfico.
    expect(salida).not.toContain("+46");
    // Las dos cifras siguen a la vista; lo que desaparece es la operación.
    expect(salida).toContain("13 (antes)");
    expect(salida).toContain("59 (ahora)");
  });

  it("no restar es también lo que hace con un sello anterior SIN anotar", () => {
    const salida = texto(
      sello("Higiene", consentimiento(59)),
      sello("Cierre V3", consentimiento(80, "techo 100/h por IP")),
    );

    expect(salida).toContain("NO SE RESTA");
    expect(salida).toContain("sin anotar");
    expect(salida).not.toContain("(+21)");
  });

  it("un cambio de estado sigue mandando por delante del instrumento", () => {
    const antes = sello("Higiene", consentimiento(59, "techo 100/h por IP"));
    const ahora = sello("Cierre V3", {
      fuente: "consentimiento",
      estado: "ilegible",
      motivo: "el almacén no contesta",
    });

    const salida = texto(antes, ahora);
    expect(salida).toContain("leida → ilegible");
    expect(salida).not.toContain("NO SE RESTA");
  });

  it("sin sello anterior lo dice, en vez de restar contra la nada", () => {
    const salida = texto(
      null,
      sello("Cierre V3", consentimiento(80, "techo 100/h por IP")),
    );
    expect(salida).toContain("línea base");
  });
});
