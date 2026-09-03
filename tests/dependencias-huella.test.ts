/**
 * La resolución de una dependencia a nivel de SÍMBOLO (D193).
 *
 * POR QUÉ TIENE TESTS Y NO SOLO UN CASO MALO EN `check:guardianes`. Porque el
 * valor de este resolutor está en la mitad NEGATIVA —que un cambio ajeno NO
 * mueva el sello—, y esa mitad `check:guardianes` no la sabe expresar: su
 * contrato es «verde sobre el árbol limpio, rojo sobre el caso malo», y aquí lo
 * que hay que demostrar es que sigue verde bajo una mutación. Un guardián que
 * solo probara la mitad positiva daría por bueno un resolutor que hasheara el
 * archivo entero, que es exactamente el estado del que se viene.
 *
 * Y es lógica pura sin E/S: `contenidoDesde` recibe su `Fuente`, así que el
 * archivo de pega se escribe aquí y no hace falta tocar el disco. Misma
 * partición que `md/convertir.ts` y `tablero/reglas.ts`.
 */
import { describe, expect, it } from "vitest";

import { contenidoDesde, type Fuente } from "../scripts/dependencias/huella";

/** Un `design-values.ts` de pega con las formas que el archivo real tiene. */
const CODIGO = `import { PAGE_SLUGS } from "./routes";

/** La tabla de contraste. */
export const CONTRAST = {
  bodyText: { light: 13.79, dark: 15.32 },
  // Una llave dentro de una CADENA, que es lo que descuadra un balance ingenuo.
  nota: "interpola {comprobaciones} y {fingidos}",
} as const satisfies Record<string, unknown>;

export const LAST_A11Y_REVIEW = "2026-08-27";

export const LAST_COOKIES_UPDATE = "2026-08-31";

export const PAGE_COUNT = PAGE_SLUGS.length;

export function fillPages(text: string): string {
  return text.replace("{paginas}", String(PAGE_COUNT));
}
`;

const fuente = (codigo: string): Fuente => ({
  leer: (ruta) => (ruta === "lib/design-values.ts" ? codigo : undefined),
  listar: () => undefined,
});

const resolver = (dep: string, codigo = CODIGO) =>
  contenidoDesde(dep, fuente(codigo));

describe("dependencia a nivel de símbolo", () => {
  it("recorta la declaración y solo esa", () => {
    const c = resolver("lib/design-values.ts#CONTRAST")!;
    expect(c).toContain("bodyText");
    expect(c.trimEnd().endsWith("satisfies Record<string, unknown>;")).toBe(
      true,
    );
    // La declaración siguiente NO entra: si entrara, mover una fecha legal
    // volvería a encender el bloque que solo vigila el contraste.
    expect(c).not.toContain("LAST_A11Y_REVIEW");
  });

  it("resuelve una declaración de una sola línea sin comerse la siguiente", () => {
    expect(resolver("lib/design-values.ts#LAST_A11Y_REVIEW")).toBe(
      `export const LAST_A11Y_REVIEW = "2026-08-27";`,
    );
    expect(resolver("lib/design-values.ts#PAGE_COUNT")).toBe(
      "export const PAGE_COUNT = PAGE_SLUGS.length;",
    );
  });

  it("resuelve una función hasta su llave de cierre", () => {
    const c = resolver("lib/design-values.ts#fillPages")!;
    expect(c.split("\n")).toHaveLength(3);
    expect(c.trimEnd().endsWith("}")).toBe(true);
  });

  /** LA MITAD QUE JUSTIFICA D193: el ruido medido eran 23 rojos de 35. */
  it("NO se mueve cuando cambia otro símbolo del mismo archivo", () => {
    const otro = CODIGO.replace('"2026-08-31"', '"2026-09-30"');
    expect(otro).not.toBe(CODIGO);
    expect(resolver("lib/design-values.ts#CONTRAST", otro)).toBe(
      resolver("lib/design-values.ts#CONTRAST"),
    );
    expect(resolver("lib/design-values.ts#LAST_A11Y_REVIEW", otro)).toBe(
      resolver("lib/design-values.ts#LAST_A11Y_REVIEW"),
    );
  });

  it("SÍ se mueve cuando cambia el símbolo declarado", () => {
    const otro = CODIGO.replace("13.79", "13.5");
    expect(resolver("lib/design-values.ts#CONTRAST", otro)).not.toBe(
      resolver("lib/design-values.ts#CONTRAST"),
    );
  });

  it("falla en voz alta si el símbolo se renombra o deja de exportarse", () => {
    expect(resolver("lib/design-values.ts#NO_EXISTE")).toBeUndefined();
    const interno = CODIGO.replace(
      "export const LAST_A11Y_REVIEW",
      "const LAST_A11Y_REVIEW",
    );
    expect(
      resolver("lib/design-values.ts#LAST_A11Y_REVIEW", interno),
    ).toBeUndefined();
  });

  it("un `#` sobre un .md sigue siendo un titular, no un símbolo", () => {
    const md: Fuente = {
      leer: () => "## D26 · Cabeceras\ncuerpo\n\n## D27 · Otra\notro cuerpo",
      listar: () => undefined,
    };
    const c = contenidoDesde("DECISIONS.md#D26", md)!;
    expect(c).toContain("cuerpo");
    expect(c).not.toContain("otro cuerpo");
  });
});
