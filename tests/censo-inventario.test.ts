/**
 * El diff del inventario del censo, y sobre todo su caso malo (D201).
 *
 * El guardián suspende cuando un par DESAPARECE con la huella intacta: es el modo
 * de fallo de la casa —un metro que ve menos parece un aprobado—. Lo que no podía
 * distinguir es un par que no se ha movido y solo ha cambiado de **bucket de
 * tamaño**: la clave lleva el umbral derivado de `px >= 24`, y cinco titulares de
 * `/trayectoria` miden exactamente `24.00px` porque su tamaño sale de un `clamp()`
 * con `vw`. Un subpíxel de diferencia en el ancho de la ventana los cruza.
 *
 * Lo que se prueba aquí es que la distinción **no afloja el guardián**: para que
 * algo cuente como basculado tiene que estar su gemelo delante.
 */
import { describe, expect, it } from "vitest";

import { compara, type Inventario } from "@/scripts/censo/inventario";

const inv = (claves: string[]): Inventario => ({
  fecha: "2026-09-04",
  huella: "abc",
  total: claves.length,
  corridas: [{ pagina: "/trayectoria", tema: "claro", claves }],
});

// Los dos pares reales del 2026-09-04: mismos colores, distinto umbral.
const PEQUENO = "reposo|33,38,43|252,250,246|7";
const GRANDE = "reposo|33,38,43|252,250,246|4.5";
const OTRO = "hover|10,20,30|240,240,240|7";

describe("compara · la basculación no es una desaparición", () => {
  it("empareja los dos umbrales del mismo par y no lo cuenta como perdido", () => {
    const [d] = compara(inv([PEQUENO, OTRO]), inv([GRANDE, OTRO]));

    expect(d?.bascularon).toEqual([{ antes: PEQUENO, ahora: GRANDE }]);
    expect(d?.salieron).toEqual([]);
    expect(d?.entraron).toEqual([]);
  });

  it("y también al revés, porque la ventana puede caer a cualquier lado", () => {
    const [d] = compara(inv([GRANDE]), inv([PEQUENO]));
    expect(d?.bascularon).toEqual([{ antes: GRANDE, ahora: PEQUENO }]);
    expect(d?.salieron).toEqual([]);
  });

  // ── EL CASO MALO ───────────────────────────────────────────────────────────
  it("NO esconde una desaparición de verdad: sin gemelo, sigue siendo una pérdida", () => {
    const [d] = compara(inv([PEQUENO, OTRO]), inv([OTRO]));

    expect(d?.salieron).toEqual([PEQUENO]);
    expect(d?.bascularon).toEqual([]);
  });

  it("no empareja dos pares que solo comparten el umbral", () => {
    // Mismos umbrales, colores distintos: son dos pares y uno se ha perdido.
    const [d] = compara(inv([PEQUENO]), inv([OTRO]));

    expect(d?.salieron).toEqual([PEQUENO]);
    expect(d?.entraron).toEqual([OTRO]);
    expect(d?.bascularon).toEqual([]);
  });

  it("tampoco empareja el mismo par en ESTADOS distintos", () => {
    // El estado es el primer segmento, así que entra en la identidad: un par de
    // reposo que se pierde no queda tapado por uno de hover que aparece.
    const hoverGrande = "hover|33,38,43|252,250,246|4.5";
    const [d] = compara(inv([PEQUENO]), inv([hoverGrande]));

    expect(d?.salieron).toEqual([PEQUENO]);
    expect(d?.bascularon).toEqual([]);
  });

  it("una clave sin separador no empareja con nada", () => {
    // Defensa del emparejador: preferimos no emparejar a emparejar de más, que
    // es lo único que podría esconder una desaparición.
    const [d] = compara(inv(["rara"]), inv(["otra"]));
    expect(d?.bascularon).toEqual([]);
    expect(d?.salieron).toEqual(["rara"]);
  });

  it("dos corridas idénticas no producen diferencia", () => {
    expect(compara(inv([PEQUENO, OTRO]), inv([PEQUENO, OTRO]))).toEqual([]);
  });
});
