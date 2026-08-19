/**
 * ¿El índice de decisiones es el derivado? — `npm run check:decisiones`, en CI.
 *
 * El porqué, el método y la decisión de qué trabajo hace el índice, en
 * `scripts/indice-decisiones.ts`. Aquí solo el veredicto.
 *
 * QUÉ COMPRUEBA, y desde el 2026-08-19 comprueba MÁS que antes. Nació verificando
 * cobertura y orden, porque cada línea llevaba una glosa escrita a mano que no
 * estaba en la cabecera y por tanto no se podía generar. Al decidirse que el
 * índice solo ENRUTA —título y nada más—, la glosa desaparece y el índice pasa a
 * ser derivable entero: ahora se compara línea a línea contra lo que sale de
 * `DECISIONS.md`. Deja de poder divergir, en vez de detectarse que ha divergido.
 *
 * Y AFIRMA CUÁNTO HA MIRADO, con su guarda de cero.
 */
import { DECISIONES, INDICE, indice, indiceActual } from "./indice-decisiones";

const esperado = indice();
const actual = indiceActual();

if (esperado.length === 0 || actual.length === 0) {
  console.error(
    `\ncheck:decisiones — NO HA MIRADO NADA (${esperado.length} en ${DECISIONES}, ` +
      `${actual.length} en ${INDICE}).\n` +
      "Con cero entradas este check aprobaría siempre, así que falla a propósito.\n" +
      "¿Ha cambiado el formato de las cabeceras, o el bloque del índice ya no está\n" +
      "entre la línea «- D1 ·» y la que empieza por «*(Al añadir una decisión»?\n",
  );
  process.exit(1);
}

// El metro afirma cuánto ha mirado (y no al revés).
console.log(
  `check:decisiones — ${esperado.length} decisiones en ${DECISIONES} · ` +
    `${actual.length} líneas en el índice de ${INDICE}`,
);

const problemas: string[] = [];

const numero = (l: string) => Number(/^- D(\d+)/.exec(l)?.[1] ?? 0);
const enActual = new Set(actual.map(numero));
const enEsperado = new Set(esperado.map(numero));

const faltan = esperado.filter((l) => !enActual.has(numero(l)));
if (faltan.length) {
  problemas.push(
    `sin línea en el índice: ${faltan.map((l) => `D${numero(l)}`).join(", ")}`,
  );
}

const sobran = actual.filter((l) => !enEsperado.has(numero(l)));
if (sobran.length) {
  problemas.push(
    `en el índice pero no en ${DECISIONES}: ` +
      `${sobran.map((l) => `D${numero(l)}`).join(", ")}\n` +
      "    ¿se renombró la decisión, o la línea se quedó huérfana?",
  );
}

// Orden y TEXTO a la vez: si las dos listas tienen los mismos números, cualquier
// diferencia posicional es orden o redacción, y las dos se arreglan igual.
if (!faltan.length && !sobran.length) {
  const distinta = actual.findIndex((l, i) => l !== esperado[i]);
  if (distinta >= 0) {
    problemas.push(
      "el índice no coincide con lo derivado. Primera diferencia:\n" +
        `    índice      : ${actual[distinta]}\n` +
        `    ${DECISIONES.padEnd(12)}: ${esperado[distinta]}`,
    );
  }
}

if (problemas.length) {
  console.error(
    `\ncheck:decisiones — EL ÍNDICE NO ES EL DERIVADO (${problemas.length}):\n`,
  );
  for (const p of problemas) console.error(`  · ${p}\n`);
  console.error(
    `El índice de ${INDICE} se DERIVA de las cabeceras de ${DECISIONES}: no se\n` +
      "escribe a mano. Regenéralo con `npm run indice`.\n\n" +
      "Y si el problema es que un título no basta para saber si abrir esa entrada,\n" +
      `arregla la CABECERA de ${DECISIONES} y vuelve a generar. El índice no tiene\n` +
      "texto propio, a propósito: es lo que impide que los dos títulos divierjan.",
  );
  process.exit(1);
}

console.log("✓ El índice es exactamente el derivado de las cabeceras.");
