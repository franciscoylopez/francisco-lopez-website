// TRINQUETE DE DEUDA: ningún PR puede subir la cifra que mide Qlty (P72.19, D186).
//
// EL CRITERIO, Y POR QUÉ NO ES UN NÚMERO OBJETIVO. La ficha de esta tarea avisaba de
// que «un número elegido a ojo es peor que un criterio escrito», y tenía razón por una
// medida: hay funciones complejas porque el problema lo es, y partirlas para bajar un
// contador las empeora. Así que aquí no se persigue un objetivo — se prohíbe EMPEORAR.
// Lo que hay se acepta; lo que se añada, no, salvo que alguien lo re-selle a propósito
// y esa decisión salga en el diff.
//
// POR QUÉ EXISTE, MEDIDO. Entre el 2026-08-31 y el 2026-09-02 la deuda pasó de 51
// hallazgos a 71, y los VEINTE de diferencia estaban todos en `scripts/`: el producto
// no se movió un punto en tres tandas. O sea que no había un problema de stock, había
// uno de CRECIMIENTO, y un refactor no lo arregla — solo lo retrasa hasta el sprint
// siguiente. Esto es lo que lo para.
//
// POR QUÉ NO ES `qlty smells --upstream main`, QUE ERA LO PRIMERO QUE SE PROBÓ. Ese
// modo mira los archivos que toca el PR y reporta los defectos que hay EN ELLOS,
// incluidos los que ya estaban; además sale con código 0. Con él, un PR que MEJORA un
// bloque duplicado sin llegar a bajarlo del umbral sale rojo, y uno que empeora otro
// archivo sale verde. Se comprobó sobre esta misma rama: reportaba el par de
// `page.tsx` que este trabajo acababa de reducir de mass 244 a 160. Mide otra cosa.
//
// EL SELLO CUADRA EXACTO, no «como mucho»: un sello por encima de la realidad es un
// trinquete con holgura, y esa holgura se la come el PR siguiente. El porqué largo,
// junto a la comparación.
//
// EL SELLO ES UN ARCHIVO Y NO UNA CONSULTA A main, para que el gate no dependa de que
// el runner tenga la otra rama ni de cuánta historia haya bajado el checkout — el
// mismo motivo por el que este repo sella el censo, la medición y `General`.

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const SELLO = "scripts/.deuda-sello.json";
const SELLAR = process.argv.includes("--sellar");

type Hallazgo = { regla: string; archivo: string };
type Sello = {
  total: number;
  porArea: Record<string, number>;
  hallazgos: string[];
  commit: string;
  fecha: string;
};

const AREAS = ["scripts/", "components/", "app/", "lib/"] as const;
const areaDe = (f: string) => AREAS.find((a) => f.startsWith(a)) ?? "raíz";

/**
 * La medición. `--all` y no el modo diff: lo que se compara es el TOTAL del repo
 * contra el total sellado, que es lo único que responde «¿ha subido?».
 */
function medir(): Hallazgo[] {
  const sarif = execFileSync("qlty", ["smells", "--all", "--sarif"], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  const doc = JSON.parse(sarif) as {
    runs: {
      results: {
        ruleId: string;
        locations?: {
          physicalLocation?: { artifactLocation?: { uri?: string } };
        }[];
      }[];
    }[];
  };
  return (doc.runs[0]?.results ?? []).map((r) => ({
    regla: r.ruleId,
    archivo: r.locations?.[0]?.physicalLocation?.artifactLocation?.uri ?? "?",
  }));
}

const clave = (h: Hallazgo) => `${h.regla}|${h.archivo}`;

function resumen(hallazgos: Hallazgo[]) {
  const porArea: Record<string, number> = {};
  for (const h of hallazgos) {
    const a = areaDe(h.archivo);
    porArea[a] = (porArea[a] ?? 0) + 1;
  }
  return porArea;
}

const hallazgos = medir();
const porArea = resumen(hallazgos);
const archivos = new Set(hallazgos.map((h) => h.archivo)).size;

// AFIRMA CUÁNTO HA MIRADO, no solo qué ha encontrado: un metro que devuelve lista
// vacía parece un aprobado, y este repo se lo ha encontrado cinco veces.
const linea = `check:deuda — ${hallazgos.length} hallazgos en ${archivos} archivos · ${Object.entries(
  porArea,
)
  .sort((a, b) => b[1] - a[1])
  .map(([a, n]) => `${a} ${n}`)
  .join(" · ")}`;

if (SELLAR) {
  const sello: Sello = {
    total: hallazgos.length,
    porArea,
    hallazgos: [...new Set(hallazgos.map(clave))].sort(),
    commit: execFileSync("git", ["rev-parse", "HEAD"], {
      encoding: "utf8",
    }).trim(),
    fecha: new Date().toISOString().slice(0, 10),
  };
  writeFileSync(SELLO, `${JSON.stringify(sello, null, 2)}\n`);
  console.log(linea);
  console.log(`✓ Sello actualizado → ${SELLO} (total ${sello.total}).`);
  process.exit(0);
}

const sello = JSON.parse(readFileSync(SELLO, "utf8")) as Sello;
console.log(linea);
console.log(
  `  sello: ${sello.total} (${sello.fecha}, ${sello.commit.slice(0, 8)})`,
);

// EL SELLO TIENE QUE CUADRAR EXACTO, Y NO ES CELO: ES LO QUE DEFIENDE AL GATE DE SÍ
// MISMO. La primera versión daba por bueno cualquier total por DEBAJO del sello, que
// suena razonable —bajar es mejorar— y abre el único agujero que un trinquete puede
// tener: la forma de desactivarlo no es tocar este script, es INFLAR el número.
// Con `<=`, un sello subido a mano se traga toda la deuda que quepa por debajo, el
// check sigue en verde y nadie se entera. Lo destapó su propio caso malo en
// `check:guardianes`, antes de que llegara a merecer la pena.
//
// Con igualdad exacta, el sello siempre describe la realidad y cualquier deriva
// —arriba o abajo— tiene que pasar por un `deuda:sellar` que se ve en el diff. Es la
// misma regla que el resto de sellos de este repo: no dicen «va por buen camino»,
// dicen «cuadra».
if (hallazgos.length === sello.total) {
  console.log("✓ El sello cuadra: la deuda no se mueve.");
  process.exit(0);
}

if (hallazgos.length < sello.total) {
  console.error(
    `
✗ El sello está VIEJO: la deuda ha BAJADO de ${sello.total} a ${hallazgos.length}.

Es una buena noticia y aun así sale en rojo, a propósito: un sello que va por
delante de la realidad es un trinquete con holgura, y esa holgura se la come el
siguiente PR sin que nadie lo vea. Fíjala:

  npm run deuda:sellar`,
  );
  process.exit(1);
}

// Rojo: nombra lo que ha aparecido, que es lo accionable. Un «+3» sin decir dónde
// obliga a repetir la investigación entera.
const previos = new Set(sello.hallazgos);
const nuevos = [...new Set(hallazgos.map(clave))].filter(
  (k) => !previos.has(k),
);

console.error(
  `\n✗ La deuda SUBE: ${hallazgos.length} contra ${sello.total} sellados (+${
    hallazgos.length - sello.total
  }).\n`,
);
if (nuevos.length) {
  console.error("Lo que no estaba en el sello:");
  for (const k of nuevos) {
    const [regla, archivo] = k.split("|");
    console.error(`  · ${archivo} — ${regla}`);
  }
} else {
  console.error(
    "Ningún par regla+archivo es nuevo: ha crecido el número de hallazgos dentro\nde archivos que ya estaban. `qlty smells --all` los lista.",
  );
}
console.error(
  `
Qué hacer, y en este orden:
  1. Si es deuda evitable, quítala — es para lo que existe este gate.
  2. Si es esencial (una función compleja porque el problema lo es, o copy
     paralelo ES/EN, que Qlty puntúa como duplicación estructural), o bien se
     excluye en \`.qlty/qlty.toml\` POR LO QUE EL ARCHIVO ES —nunca por lo que
     puntúa, que es la regla escrita en ese archivo—, o bien se re-sella a
     propósito con \`npm run deuda:sellar\` y el motivo va en el commit.

El sello no se mueve solo: subirlo tiene que ser una decisión visible en el diff.`,
);
process.exit(1);
