/**
 * ¿Las skills siguen diciendo la verdad? — `npm run check:skills`, en CI.
 *
 * POR QUÉ EXISTE. D60 lo dejó escrito: LAS SKILLS CADUCAN PEOR QUE LOS `.md`,
 * porque se SIGUEN en vez de leerse. Una afirmación falsa dentro de un documento
 * confunde a quien lo lee y este puede desconfiar; dentro de una skill, se
 * ejecuta. El caso que lo demostró fue `update-cv`, que acumuló nueve
 * afirmaciones falsas en un solo día.
 *
 * QUÉ COMPRUEBA, que es la parte automatizable y no es toda: que cada RUTA DE
 * ARCHIVO y cada `npm run X` que una skill nombra existan de verdad. Es el
 * subconjunto mecánico de «¿esto sigue siendo cierto?»: no dice si el
 * PROCEDIMIENTO sigue teniendo sentido, pero sí caza el drift más común y más
 * barato de arreglar — un archivo que se renombró, un directorio que se partió
 * (D42, D48), un script que cambió de nombre.
 *
 * LO QUE NO COMPRUEBA, dicho para que no se dé por cubierto: que los pasos sean
 * correctos, que el orden siga siendo el bueno, o que la skill no describa un
 * mundo que ya no existe. Eso sigue necesitando leerla. `deep-dive-page` es hoy
 * el caso de más riesgo: se escribió DESPUÉS de montar las cinco páginas, así que
 * documenta un recorrido ya hecho que nadie ha vuelto a seguir.
 *
 * Y AFIRMA CUÁNTO HA MIRADO, con su guarda de cero.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const RAIZ = process.cwd();
const DIRS = [".claude/skills", ".claude/agents"];

/**
 * Rutas que la skill nombra como EJEMPLO de algo que aún no existe, o como patrón
 * y no como archivo. Se listan una a una a propósito: una allowlist por prefijo
 * volvería a abrir la puerta que este guardián cierra.
 */
const PERMITIDAS = new Set<string>([]);

type Hallazgo = { archivo: string; cita: string; tipo: string };
const hallazgos: Hallazgo[] = [];

let documentos = 0;
let rutas = 0;
let comandos = 0;

/** Los `.md` de skills y agentes, incluidos los de subcarpeta. */
function* fuentes(dir: string): Generator<string> {
  const abs = join(RAIZ, dir);
  if (!existsSync(abs)) return;
  for (const entrada of readdirSync(abs, { withFileTypes: true })) {
    const rel = `${dir}/${entrada.name}`;
    if (entrada.isDirectory()) yield* fuentes(rel);
    else if (entrada.name.endsWith(".md")) yield rel;
  }
}

// Solo rutas con directorio: un `action.tsx` suelto en una frase es el NOMBRE de
// un archivo, no una ruta desde la raíz, y tratarlo como tal daba doce falsos
// positivos. Lo que se verifica es lo que se puede verificar sin adivinar.
const RUTA =
  /`([A-Za-z0-9_.\-[\]]+(?:\/[A-Za-z0-9_.\-[\]{},]+)+\.[a-z]{2,4})`/g;
const COMANDO = /`?npm run ([a-z:-]+)`?/g;

// Un `{es,en}` o un `[lang]` en la cita es una abreviatura de dos rutas reales.
// Se expande antes de comprobar, en vez de excluirla — si no, la abreviatura se
// convierte en la forma de saltarse el guardián.
function expandir(ruta: string): string[] {
  const llaves = ruta.match(/\{([^}]+)\}/);
  const entero = llaves?.[0];
  const opciones = llaves?.[1];
  if (!entero || !opciones) return [ruta];
  return opciones
    .split(",")
    .map((opcion) => ruta.replace(entero, opcion.trim()));
}

const scripts: Record<string, string> = JSON.parse(
  readFileSync(join(RAIZ, "package.json"), "utf8"),
).scripts;

for (const dir of DIRS) {
  for (const archivo of fuentes(dir)) {
    documentos++;
    const texto = readFileSync(join(RAIZ, archivo), "utf8");

    for (const m of texto.matchAll(RUTA)) {
      const cita = m[1];
      if (!cita || PERMITIDAS.has(cita)) continue;
      rutas++;
      if (!expandir(cita).every((r) => existsSync(join(RAIZ, r)))) {
        hallazgos.push({ archivo, cita, tipo: "ruta que no existe" });
      }
    }

    for (const m of texto.matchAll(COMANDO)) {
      const script = m[1];
      if (!script) continue;
      comandos++;
      if (!(script in scripts)) {
        hallazgos.push({
          archivo,
          cita: `npm run ${m[1]}`,
          tipo: "script que no está en package.json",
        });
      }
    }
  }
}

if (documentos === 0 || rutas === 0) {
  console.error(
    `\ncheck:skills — NO HA MIRADO NADA (${documentos} documentos, ${rutas} rutas).\n` +
      "Con cero entradas este check aprobaría siempre, así que falla a propósito.\n" +
      `¿Se han movido ${DIRS.join(" o ")}?\n`,
  );
  process.exit(1);
}

// El metro afirma cuánto ha mirado (y no al revés).
console.log(
  `check:skills — ${documentos} skills y agentes · ${rutas} rutas comprobadas · ` +
    `${comandos} comandos npm comprobados`,
);

if (hallazgos.length) {
  console.error(
    `\ncheck:skills — UNA SKILL NOMBRA ALGO QUE NO EXISTE (${hallazgos.length}):\n`,
  );
  for (const h of hallazgos)
    console.error(`  ${h.archivo}\n    ${h.tipo}: ${h.cita}\n`);
  console.error(
    "Una skill se SIGUE en vez de leerse, así que una ruta vieja no confunde: se\n" +
      "ejecuta (D60). Actualiza la skill, o si la ruta es un ejemplo de algo que aún\n" +
      "no existe, añádela a PERMITIDAS con su motivo.",
  );
  process.exit(1);
}

console.log("✓ Las skills nombran archivos y comandos que existen.");
