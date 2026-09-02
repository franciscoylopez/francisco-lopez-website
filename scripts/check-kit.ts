/**
 * ¿El kit de marca dice lo que hay en disco? — `npm run check:kit`.
 *
 * QUÉ PROTEGE. `lib/logo-kit.ts` declara dos cosas: lo que la página ofrece suelto o
 * referencia, y lo que viaja dentro del ZIP sin tener tarjeta propia. El ZIP en sí no
 * puede desincronizarse (se genera en el build leyendo el directorio, ver
 * `app/api/kit/route.ts`), pero el REGISTRO sí, y de tres maneras que ningún tipo ve:
 *
 *   1. Una ruta declarada cuyo archivo ya no está. La página serviría un 404 desde un
 *      chip que se ve perfectamente bien.
 *   2. Un archivo en disco que no está en ninguna de las dos listas. Es exactamente
 *      cómo aparecieron los diez huérfanos que P70.27 encontró: nadie los metió a
 *      propósito, simplemente nunca hubo nada que los contara. Ahora entrar sin
 *      declararse es rojo.
 *   3. Una pieza declarada a la que le falta alguno de sus PNG o su segunda tinta. La
 *      tarjeta prometería «en el kit: PNG de 1024, 512 y 256 px» y el kit traería dos.
 *
 * Y AFIRMA CUÁNTO HA MIRADO. Un metro que devuelve una lista vacía parece un aprobado,
 * y este repo se lo ha encontrado seis veces, así que falla al mirar cero.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative, sep } from "node:path";

import {
  medidaDeclarada,
  PIEZAS,
  RAIZ_KIT,
  rutasPublicadas,
  SOLO_EN_EL_KIT,
} from "../lib/logo-kit";
import { leeIco, leePng } from "./kit/binarios";

const RAIZ = process.cwd();
const problemas: string[] = [];

// --- El directorio existe ANTES de recorrer nada. «No encuentro la carpeta» y «no
//     hay archivos» tienen que distinguirse: sin esto, mover el kit haría que este
//     check aprobara mirando cero.
if (!existsSync(join(RAIZ, RAIZ_KIT))) {
  console.error(
    `\ncheck:kit — NO ENCUENTRO \`${RAIZ_KIT}\`, así que no ha mirado nada.\n\n` +
      "Esto no es «el kit está bien»: es que el check se ha quedado ciego. Si los\n" +
      "assets se han movido, actualiza `RAIZ_KIT` en `lib/logo-kit.ts`.\n",
  );
  process.exit(1);
}

/** Todo lo que hay en disco, como ruta servible (`/logo-kit/...`). */
function enDisco(): string[] {
  const raiz = join(RAIZ, RAIZ_KIT);
  const out: string[] = [];
  const baja = (dir: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const ruta = join(dir, e.name);
      if (e.isDirectory()) baja(ruta);
      else out.push(`/logo-kit/${relative(raiz, ruta).split(sep).join("/")}`);
    }
  };
  baja(raiz);
  return out.sort();
}

const disco = enDisco();
const publicadas = rutasPublicadas();
const declaradas = new Set([...publicadas, ...SOLO_EN_EL_KIT]);

if (!disco.length) {
  console.error(
    `\ncheck:kit — \`${RAIZ_KIT}\` existe y está VACÍO. El kit sería un ZIP sin nada dentro.\n`,
  );
  process.exit(1);
}

// 1 y 3 — lo declarado existe. (El 3 es un caso del 1: si a una pieza le falta un
//         PNG, su ruta derivada no está en disco y sale aquí, nombrando el archivo.)
const enDiscoSet = new Set(disco);
for (const ruta of publicadas) {
  if (!enDiscoSet.has(ruta)) {
    problemas.push(
      `la página ofrece \`${ruta}\` y ese archivo no está en disco. Sería un 404 desde un chip que se ve bien.`,
    );
  }
}
for (const ruta of SOLO_EN_EL_KIT) {
  if (!enDiscoSet.has(ruta)) {
    problemas.push(
      `\`${ruta}\` está declarado en \`SOLO_EN_EL_KIT\` y ya no existe. Si se borró a propósito, quítalo de la lista.`,
    );
  }
}

// 2 — nada en disco sin declarar.
for (const ruta of disco) {
  if (!declaradas.has(ruta)) {
    problemas.push(
      `\`${ruta}\` está en disco y no lo declara nadie. Viajaría dentro del kit sin que ninguna página lo mencione:\n` +
        "      publícalo en una tarjeta, o añádelo a `SOLO_EN_EL_KIT` con su motivo.",
    );
  }
}

let binarios = 0;
let tintaMin = 1;
let tintaMax = 0;
for (const ruta of disco) {
  const fichero = join(RAIZ, RAIZ_KIT, ruta.replace("/logo-kit/", ""));
  if (ruta.endsWith(".ico")) {
    try {
      leeIco(readFileSync(fichero));
      binarios++;
    } catch (e) {
      problemas.push(`\`${ruta}\` ${(e as Error).message}.`);
    }
    continue;
  }
  if (!ruta.endsWith(".png")) continue;
  const medida = medidaDeclarada(ruta);
  if (!medida) {
    // Un PNG cuyo nombre no dice qué mide es un hueco del metro, no un aprobado.
    problemas.push(
      `\`${ruta}\` es un PNG y \`medidaDeclarada\` no sabe qué tamaño promete su nombre, ` +
        "así que nadie puede comprobarlo. Si es una familia nueva, decláralo en `lib/logo-kit.ts`.",
    );
    continue;
  }
  try {
    const png = leePng(readFileSync(fichero));
    binarios++;
    const real =
      medida.eje === "ancho"
        ? png.ancho
        : medida.eje === "alto"
          ? png.alto
          : Math.max(png.ancho, png.alto);
    const cuadrado = medida.eje === "cuadrado" && png.ancho !== png.alto;
    if (real !== medida.px || cuadrado) {
      problemas.push(
        `\`${ruta}\` promete ${medida.px}px de ${medida.eje} y mide ${png.ancho}×${png.alto}.`,
      );
    }
    if (png.tinta <= 0) {
      problemas.push(
        `\`${ruta}\` está ENTERAMENTE TRANSPARENTE: es un archivo válido y un asset vacío, ` +
          "que es justo lo que se ve bien desde la página y se descarga roto.",
      );
    }
    tintaMin = Math.min(tintaMin, png.tinta);
    tintaMax = Math.max(tintaMax, png.tinta);
  } catch (e) {
    problemas.push(`\`${ruta}\` no se puede leer: ${(e as Error).message}.`);
  }
}

if (problemas.length) {
  console.error(
    `\ncheck:kit — ${problemas.length} ${problemas.length === 1 ? "problema" : "problemas"}:\n\n` +
      problemas.map((p) => `  · ${p}`).join("\n") +
      "\n\nEl registro es `lib/logo-kit.ts`.\n",
  );
  process.exit(1);
}

console.log(
  `check:kit — ${disco.length} archivos en \`${RAIZ_KIT}\` · ` +
    `${publicadas.length} publicados por ${PIEZAS.length} piezas y el favicon · ` +
    `${SOLO_EN_EL_KIT.length} solo dentro del kit, declarados`,
);
console.log(
  `             ${binarios} binarios abiertos · formato, medida declarada y tinta · ` +
    `cobertura entre ${(tintaMin * 100).toFixed(1)}% y ${(tintaMax * 100).toFixed(1)}%`,
);
console.log(
  "✓ El registro del kit y el disco cuadran, y los binarios no están vacíos.",
);
