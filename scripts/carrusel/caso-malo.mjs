/**
 * Caso malo del guardián de `scripts/carrusel/render.mjs`.
 *
 * Las dos láminas reproducen los fallos que la versión anterior daba por buenos:
 *   l01 · tabla de seis filas con nota larga → el bloque no desborda, CRECE, y
 *         empuja la firma fuera del pie de la lámina.
 *   l02 · dos cabeceras largas en las columnas de 140px → se pisan en horizontal,
 *         y el alto no se entera.
 */

export const meta = {
  slug: "MALO",
  titulo: "Caso malo",
  firma: "Francisco López",
};
export const distribucion = [];

export const laminas = [
  {
    tipo: "tabla",
    eyebrow: "01 · La firma se sale del pie",
    titulo:
      "Seis filas y una nota de tres líneas: el bloque crece y el pie se cae fuera de la lámina.",
    cabecera: ["Lo que se comprueba", "Nº", "CI"],
    filas: [
      { a: "Piezas publicadas en el sistema", b: "23", c: "✓" },
      { a: "Controles fuera de la capa", b: "2", c: "✓" },
      { a: "Tokens de color sellados", b: "58", c: "✓" },
      { a: "Páginas × temas en AAA", b: "28", c: "—" },
      { a: "Guardianes en integración continua", b: "21", c: "✓" },
      { a: "Casos malos que muerden el criterio", b: "49", c: "✓" },
    ],
    nota: "Una nota deliberadamente larga, de las que ocupan tres líneas enteras y empujan el bloque hacia abajo hasta que el pie deja de caber dentro de la lámina, que tiene overflow hidden y por tanto recorta la firma sin dar ningún error por consola.",
  },
  {
    tipo: "tabla",
    eyebrow: "02 · Dos cabeceras que se pisan",
    titulo: "Las columnas 2 y 3 miden 140px cada una.",
    cabecera: [
      "Lo que se comprueba",
      "Porcentaje de páginas afectadas",
      "Comprobado en integración continua",
    ],
    filas: [{ a: "Texto con poco contraste", b: "83,9", c: "✓" }],
    nota: "Nota corta.",
  },
];
