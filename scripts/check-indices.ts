/**
 * ¿Los índices son los derivados? — `npm run check:indices`, en CI.
 *
 * El porqué, el método y dónde vive cada índice, en `scripts/indices.ts`. Aquí
 * solo el veredicto, para los tres: el de decisiones (que vive en `CLAUDE.md`) y
 * los de los dos históricos (que viven en su propia cabecera).
 *
 * Y AFIRMA CUÁNTO HA MIRADO, con su guarda de cero.
 */
import {
  DECISIONES,
  decisiones,
  decisionesActual,
  HISTORICOS,
  historico,
  historicoActual,
  INDICE_DECISIONES,
} from "./indices";

type Caso = {
  /** Qué se indexa. */
  fuente: string;
  /** Dónde vive el índice. */
  destino: string;
  esperado: string[];
  actual: string[];
};

const casos: Caso[] = [
  {
    fuente: DECISIONES,
    destino: INDICE_DECISIONES,
    esperado: decisiones(),
    actual: decisionesActual(),
  },
  ...HISTORICOS.map((archivo) => ({
    fuente: archivo,
    destino: `${archivo} (cabecera)`,
    esperado: historico(archivo),
    actual: historicoActual(archivo),
  })),
];

const problemas: string[] = [];
let entradas = 0;

for (const caso of casos) {
  entradas += caso.esperado.length;

  if (caso.esperado.length === 0) {
    problemas.push(
      `${caso.fuente}: no he encontrado NINGUNA cabecera que indexar. ¿Ha ` +
        "cambiado su formato?",
    );
    continue;
  }

  if (caso.actual.length === 0) {
    problemas.push(
      `${caso.destino}: no hay índice. Genéralo con \`npm run indices\`.`,
    );
    continue;
  }

  const distinta = caso.esperado.findIndex((l, i) => l !== caso.actual[i]);
  const sobran = caso.actual.length > caso.esperado.length;
  if (distinta >= 0 || sobran) {
    const i = distinta >= 0 ? distinta : caso.esperado.length;
    problemas.push(
      `${caso.destino}: no coincide con lo derivado de ${caso.fuente}. ` +
        `Primera diferencia (línea ${i + 1} del índice):\n` +
        `      índice : ${caso.actual[i] ?? "(no hay más líneas)"}\n` +
        `      fuente : ${caso.esperado[i] ?? "(no hay más secciones)"}`,
    );
  }
}

// El metro afirma cuánto ha mirado (y no al revés).
if (entradas === 0) {
  console.error(
    "\ncheck:indices — NO HA MIRADO NADA (0 cabeceras en los tres documentos).\n" +
      "Con cero entradas este check aprobaría siempre, así que falla a propósito.\n",
  );
  process.exit(1);
}

console.log(
  `check:indices — ${casos.length} índices · ${entradas} entradas comprobadas ` +
    `(${casos.map((c) => `${c.esperado.length} en ${c.fuente}`).join(" · ")})`,
);

if (problemas.length) {
  console.error(
    `\ncheck:indices — UN ÍNDICE NO ES EL DERIVADO (${problemas.length}):\n`,
  );
  for (const p of problemas) console.error(`  · ${p}\n`);
  console.error(
    "Los índices se DERIVAN de las cabeceras: no se escriben a mano. Regenéralos\n" +
      "con `npm run indices`.\n\n" +
      "Y si el problema es que un título no basta para saber si abrir esa sección,\n" +
      "arregla LA CABECERA y vuelve a generar. El índice no tiene texto propio, a\n" +
      "propósito: es lo que impide que los dos títulos divierjan.",
  );
  process.exit(1);
}

console.log(
  "✓ Los tres índices son exactamente los derivados de sus cabeceras.",
);
