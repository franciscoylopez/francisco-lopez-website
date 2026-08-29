import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { sustituirEnCopy } from "@/scripts/diccionarios/formato";

// Editar copy por programa sin ensuciar el diff. El porqué —y por qué el primer
// intento, un serializador, no podía funcionar— está en el módulo.
//
// LO QUE SE PRUEBA AQUÍ ES LA PROPIEDAD, NO UN CASO: sobre los diccionarios
// REALES, y sobre todos. Un helper de edición de copy validado con dos archivos
// de ejemplo es justo el error que este módulo existe para no repetir.

const RAIZ = "app/[lang]/dictionaries";

function diccionarios(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const ruta = join(dir, e.name);
    if (e.isDirectory()) return diccionarios(ruta);
    return e.name.endsWith(".json") ? [ruta] : [];
  });
}

const RUTAS = diccionarios(RAIZ);

describe("sustituirEnCopy", () => {
  it("hay diccionarios que mirar", () => {
    expect(RUTAS.length).toBeGreaterThan(20);
  });

  it.each(RUTAS)("sin cambios no toca ni un byte de %s", (ruta) => {
    const original = readFileSync(ruta, "utf8");
    expect(sustituirEnCopy(original, [])).toBe(original);
  });

  it("una sustitución cambia UNA línea y deja el resto igual", () => {
    const ruta = join(RAIZ, "es", "common.json");
    const original = readFileSync(ruta, "utf8");
    const cadena = JSON.parse(original).nav.contacto as string;

    const salida = sustituirEnCopy(original, [[cadena, cadena + " ahora"]]);
    const distintas = salida
      .split("\n")
      .filter((l, i) => l !== original.split("\n")[i]);

    expect(distintas).toHaveLength(1);
    expect(JSON.parse(salida).nav.contacto).toBe(cadena + " ahora");
  });

  it("escapa lo que hay que escapar, y el resultado sigue siendo JSON", () => {
    const ruta = join(RAIZ, "es", "common.json");
    const original = readFileSync(ruta, "utf8");
    const cadena = JSON.parse(original).nav.contacto as string;

    // Comillas y barra invertida son justo lo que rompe una sustitución ingenua.
    const salida = sustituirEnCopy(original, [[cadena, 'con "comillas" y \\']]);
    expect(JSON.parse(salida).nav.contacto).toBe('con "comillas" y \\');
  });

  it("se planta si la premisa caducó: cero apariciones", () => {
    const original = readFileSync(join(RAIZ, "es", "common.json"), "utf8");
    expect(() => sustituirEnCopy(original, [["esto no está", "x"]])).toThrow(
      /aparece 0 veces/,
    );
  });
});
