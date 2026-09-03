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

type Hallazgo = { regla: string; archivo: string; magnitud: number | null };
type Sello = {
  total: number;
  porArea: Record<string, number>;
  hallazgos: string[];
  /** Por `regla|archivo`, las magnitudes de sus hallazgos, ordenadas. */
  magnitudes: Record<string, number[]>;
  commit: string;
  fecha: string;
};

const AREAS = ["scripts/", "components/", "app/", "lib/"] as const;
const areaDe = (f: string) => AREAS.find((a) => f.startsWith(a)) ?? "raíz";

/**
 * LA MAGNITUD, QUE ES LA SEGUNDA MITAD DEL TRINQUETE (2026-09-03, P72.32). Cada
 * hallazgo de Qlty lleva su cifra en el mensaje —`count = 93` en una complejidad,
 * `mass = 160` en un bloque duplicado, `level = 5` en un anidamiento—, y sellar
 * solo la PRESENCIA dejaba abierto el hueco que D187 nombró para no prometer de
 * más: dentro de algo que ya está marcado, la cifra puede crecer sin que el
 * recuento se mueva. `Nav` podía pasar de 43 a 90 y el par `design-system` ↔
 * `brand-kit` de masa 160 a 400 sin un solo +1.
 *
 * Y NO ES EL «TOPE POR DIRECTORIO» QUE D187 §punto-3 DESCARTÓ, que es lo que
 * parece de lejos: allí el problema era que el umbral sería **un número elegido a
 * ojo**, y aquí no se elige ninguno — se sella el que hay, con la misma igualdad
 * exacta que ya defiende el total. Sigue sin perseguir un objetivo: sigue
 * prohibiendo empeorar, ahora también dentro de lo ya marcado.
 */
const MAGNITUD = /\((?:count|mass|level) = (\d+)\)/;

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
        message?: { text?: string };
        locations?: {
          physicalLocation?: { artifactLocation?: { uri?: string } };
        }[];
      }[];
    }[];
  };
  return (doc.runs[0]?.results ?? []).map((r) => ({
    regla: r.ruleId,
    archivo: r.locations?.[0]?.physicalLocation?.artifactLocation?.uri ?? "?",
    magnitud: Number(MAGNITUD.exec(r.message?.text ?? "")?.[1] ?? NaN) || null,
  }));
}

const clave = (h: Hallazgo) => `${h.regla}|${h.archivo}`;

/**
 * Las magnitudes agrupadas por clave, ordenadas. Es un MULTICONJUNTO y no un
 * número: `similar-code` reporta las dos puntas del par, así que un archivo puede
 * traer dos veces la misma cifra y las dos cuentan.
 */
function magnitudesDe(hallazgos: Hallazgo[]): Record<string, number[]> {
  const m: Record<string, number[]> = {};
  for (const h of hallazgos) {
    if (h.magnitud === null) continue;
    (m[clave(h)] ??= []).push(h.magnitud);
  }
  for (const v of Object.values(m)) v.sort((a, b) => a - b);
  return m;
}

/**
 * Las claves cuyo multiconjunto de magnitudes ha cambiado, ya en prosa: el rojo
 * nombra la cifra vieja y la nueva porque un «algo ha crecido» obliga a repetir la
 * investigación entera, que es la misma razón por la que el bloque de abajo lista
 * los pares nuevos.
 */
function comparaMagnitudes(
  sellado: Record<string, number[]> | undefined,
  actual: Record<string, number[]>,
): string[] {
  if (!sellado) {
    return [
      "el sello no tiene magnitudes: es de antes de que existieran. `npm run deuda:sellar`",
    ];
  }
  const texto = (v: number[] | undefined) => (v ?? []).join(", ") || "—";
  return [...new Set([...Object.keys(sellado), ...Object.keys(actual)])]
    .sort()
    .filter((k) => texto(sellado[k]) !== texto(actual[k]))
    .map((k) => {
      const [regla, archivo] = k.split("|");
      return `${archivo} — ${regla}: ${texto(sellado[k])} → ${texto(actual[k])}`;
    });
}

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
const magnitudes = magnitudesDe(hallazgos);
const conMagnitud = hallazgos.filter((h) => h.magnitud !== null).length;

// AFIRMA CUÁNTO HA MIRADO, no solo qué ha encontrado: un metro que devuelve lista
// vacía parece un aprobado, y este repo se lo ha encontrado cinco veces.
//
// Y DICE CUÁNTAS MAGNITUDES HA SABIDO LEER, que es el mismo principio aplicado a la
// mitad nueva: si Qlty cambiara el texto de sus mensajes, la regex dejaría de casar
// y el gate seguiría verde comparando un conjunto vacío contra otro vacío. Con la
// cifra delante, esa avería se ve en la primera corrida.
const linea = `check:deuda — ${hallazgos.length} hallazgos en ${archivos} archivos (${conMagnitud} con magnitud) · ${Object.entries(
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
    magnitudes: Object.fromEntries(
      Object.entries(magnitudes).sort(([a], [b]) => a.localeCompare(b)),
    ),
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
  // EL HUECO QUE D187 DEJÓ ESCRITO PARA NO PROMETER DE MÁS, y que se cierra aquí:
  // con el recuento cuadrando, dentro de lo ya marcado la cifra todavía podía
  // crecer sin que nada se moviera. Comparar el multiconjunto de magnitudes es lo
  // que hace que «el sello cuadra» quiera decir lo que parece que dice.
  const derivas = comparaMagnitudes(sello.magnitudes, magnitudes);
  if (!derivas.length) {
    console.log(
      `✓ El sello cuadra: la deuda no se mueve, ni en recuento ni en magnitud (${conMagnitud} cifras).`,
    );
    process.exit(0);
  }
  console.error(
    `\n✗ El recuento cuadra y las MAGNITUDES no: ${derivas.length} ${
      derivas.length === 1 ? "cifra ha cambiado" : "cifras han cambiado"
    } dentro de lo que ya estaba marcado.\n`,
  );
  for (const d of derivas) console.error(`  · ${d}`);
  console.error(
    `
Es el hueco que este gate tenía escrito: un archivo ya marcado podía empeorar
sin que el contador se moviera. Ahora no.

  · Si ha SUBIDO, es deuda nueva escondida en deuda vieja: quítala, o re-sella a
    propósito con \`npm run deuda:sellar\` y el motivo en el commit.
  · Si ha BAJADO, es una mejora y sale en rojo igual, por lo mismo que el total:
    un sello por encima de la realidad es holgura que se come el PR siguiente.`,
  );
  process.exit(1);
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
