/**
 * ¿Los índices son los derivados? — `npm run check:indices`, en CI.
 *
 * El porqué, el método y dónde vive cada índice, en `scripts/indices.ts`. Aquí
 * solo el veredicto, para los tres: los tres viven en la cabecera de su propio
 * archivo, y ninguno cuesta nada en el contexto de arranque.
 *
 * Y AFIRMA CUÁNTO HA MIRADO, con su guarda de cero.
 */
import { existsSync, readFileSync } from "node:fs";

import {
  archivosDePiezas,
  DECISIONES,
  decisiones,
  decisionesActual,
  decisionesDeclaradas,
  HISTORICOS,
  historico,
  historicoActual,
  INVENTARIO,
  inventario,
  inventarioActual,
  pieza,
  SIN_PUBLICAR,
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
    destino: `${DECISIONES} (cabecera)`,
    esperado: decisiones(),
    actual: decisionesActual(),
  },
  {
    fuente: "components/ui/",
    destino: INVENTARIO,
    esperado: inventario(),
    actual: inventarioActual(),
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

// Antes de comparar índices: ¿hay alguna cabecera de decisión que el generador NO
// esté viendo? Es el punto ciego que este check tendría por construcción — una
// cabecera mal formada no la ve el generador ni el lector, así que el índice
// saldría sin ella y el veredicto sería ✓. Comprobado el 2026-08-19 escribiendo
// una a propósito: pasaba en verde.
const declaradas = decisionesDeclaradas();
const formateadas = new Set(
  decisiones().map((l) => Number(/^- D(\d+)/.exec(l)?.[1] ?? 0)),
);
const invisibles = declaradas.filter((n) => !formateadas.has(n));
if (invisibles.length) {
  problemas.push(
    `${DECISIONES}: ${invisibles.length} cabecera(s) que el generador no ve — ` +
      `${invisibles.map((n) => `D${n}`).join(", ")}.\n` +
      "      El formato es `## Dnn · Título — AAAA-MM-DD`, con el punto medio «·» y\n" +
      "      un estado opcional entre paréntesis tras el número. Sin eso, la decisión\n" +
      "      no llega al índice y este check no lo notaría.",
  );
}

/**
 * Lo que ve la sección que dice publicar una pieza: su propio texto MÁS el de sus
 * hermanos de carpeta (`./shared`, `./layout`…). El nivel de indirección hace
 * falta y no es teórico: el Brand Kit enseña el logo real, pero lo importa a
 * través de `brand-kit/shared.tsx`, así que mirar solo el archivo declarado daría
 * un falso «esta sección no publica esa pieza».
 */
function textoDeLaSeccion(ruta: string): string | undefined {
  const archivo = `components/site/${ruta}`;
  if (!existsSync(archivo)) return undefined;
  const propio = readFileSync(archivo, "utf8");
  const carpeta = archivo.slice(0, archivo.lastIndexOf("/"));
  const hermanos = [...propio.matchAll(/from "\.\/([\w-]+)"/g)]
    .map((m) => `${carpeta}/${m[1]}.tsx`)
    .filter((f) => existsSync(f))
    .map((f) => readFileSync(f, "utf8"));
  return [propio, ...hermanos].join("\n");
}

// El inventario no basta con que esté derivado: una pieza puede declarar una
// sección que no la enseña, y el índice saldría idéntico. Se comprueba aparte.
let piezasVistas = 0;
const pendientes: string[] = [];
for (const archivo of archivosDePiezas()) {
  piezasVistas++;
  const p = pieza(archivo);

  // La AUSENCIA de la línea, que es el caso que importa: una pieza nueva sin
  // declarar no aparece en ningún inventario y el paso 1 de la «Regla de
  // construcción» manda a mirar donde no está.
  if (!p) {
    problemas.push(
      `components/ui/${archivo}: no declara su línea. La primera línea del ` +
        "archivo tiene que ser\n" +
        "      `// @pieza <grupo> · <publicación> · <una frase>`, con grupo\n" +
        "      `núcleo` | `artículo` | `primitiva` y publicación relativa a\n" +
        "      `components/site/` (o `pendiente`, y entonces va también a\n" +
        "      SIN_PUBLICAR de `scripts/indices.ts`, con su motivo).",
    );
    continue;
  }

  if (p.publica === "pendiente") {
    pendientes.push(archivo);
    if (!SIN_PUBLICAR.includes(archivo)) {
      problemas.push(
        `components/ui/${archivo}: se declara \`pendiente\` y no está en ` +
          "SIN_PUBLICAR.\n" +
          "      Una pieza del sistema se publica en el Design System (o en el\n" +
          "      Brand Kit) antes de darla por hecha. Si de verdad no toca todavía,\n" +
          "      añádela a esa lista CON EL MOTIVO: es un acto visible en el diff.",
      );
    }
    continue;
  }

  const texto = textoDeLaSeccion(p.publica);
  if (texto === undefined) {
    problemas.push(
      `components/ui/${archivo}: dice publicarse en \`${p.publica}\`, que no ` +
        "existe bajo `components/site/`.",
    );
    continue;
  }
  const nombre = archivo.replace(/\.tsx?$/, "");
  if (!texto.includes(`components/ui/${nombre}`)) {
    problemas.push(
      `components/ui/${archivo}: \`${p.publica}\` no importa la pieza, así que ` +
        "no la está publicando.\n" +
        "      El Design System y el Brand Kit enseñan LAS PIEZAS REALES como demo;\n" +
        "      una sección que la describe sin usarla puede divergir sin que nadie\n" +
        "      se entere.",
    );
  }
}

// Y al revés: una excusa que sobra también es deriva.
for (const archivo of SIN_PUBLICAR) {
  if (!pendientes.includes(archivo)) {
    problemas.push(
      `SIN_PUBLICAR incluye \`${archivo}\`, que ya no declara \`pendiente\` ` +
        "(o ya no existe). Quítalo de la lista.",
    );
  }
}

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
if (entradas === 0 || piezasVistas === 0) {
  console.error(
    "\ncheck:indices — NO HA MIRADO NADA (0 cabeceras, o 0 archivos en\n" +
      "`components/ui/`). Con cero entradas este check aprobaría siempre, así que\n" +
      "falla a propósito.\n",
  );
  process.exit(1);
}

console.log(
  `check:indices — ${casos.length} índices · ${entradas} entradas comprobadas ` +
    `(${casos.map((c) => `${c.esperado.length} en ${c.fuente}`).join(" · ")})`,
);
console.log(
  `                ${piezasVistas} piezas de components/ui/ · ` +
    `${piezasVistas - pendientes.length} publicadas y comprobadas contra su ` +
    `sección · ${pendientes.length} sin publicar (${pendientes.join(", ")})`,
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
  `✓ Los ${casos.length} índices son exactamente los derivados de sus fuentes, y ` +
    "cada pieza publicada sale de verdad en la sección que dice.",
);
