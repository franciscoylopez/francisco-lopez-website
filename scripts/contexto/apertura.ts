import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { CICLO_ABIERTO } from "./presupuesto";

/* ─────────────────────────────────────────────────────────────────────────────
 * CUARTA MITAD: ¿LA APERTURA DE ESTE CICLO RETIRÓ ALGO? (2026-09-02, P72.09).
 *
 * `CLAUDE.md` dice **«ABRIR EMPIEZA RETIRANDO, EN LOTE Y ANTES DE AÑADIR NADA»**, y
 * esa regla NO TENÍA PORTADOR. Las tres mitades de arriba vigilan el dato contra el
 * umbral, el umbral contra sí mismo y las entradas a demanda; ninguna sabe si una
 * apertura retiró. Medido commit a commit:
 *
 *     6592278  durante «Agentes»            11.567   margen 133
 *     76710b3  CIERRE de «Agentes»          11.683   margen  17
 *     45208a7  APERTURA de «Distribución»   11.683   margen  17
 *     1bc642f  el 2026-09-01                11.690   margen  10
 *
 * Todo el sprint «Distribución» sumó **+7 palabras**: el margen no se lo comió el
 * sprint, ya estaba en 17 cuando abrió. Y las 105 que se lo comieron en el cierre
 * anterior son, literalmente, **la propia regla que ordena retirar**, entrada como
 * adición sobre un margen de 133. La apertura que ella misma manda dejó el total
 * exactamente donde estaba.
 *
 * QUÉ MIDE, Y CONTRA QUÉ. No el techo —el techo sigue siendo el techo y no se toca—
 * sino **la dirección del ciclo**: lo que suma el corpus DESPUÉS de la retirada de
 * apertura contra lo que sumaba ANTES. Es la misma forma que `SELLO_GENERAL` en
 * `check-tablero.ts`, y por el mismo motivo: un número que solo cambia tres veces al
 * mes no necesita almacén, necesita quedar fechado donde se lee.
 *
 * LOS DOS NÚMEROS SE MIDEN A MANO EN EL CRUCE, como los otros dos sellos, y eso es
 * deliberado: **si se refrescaran solos, la variación saldría siempre 0 y el guardián
 * no diría nada**. Lo que impide que se queden viejos es la comprobación de frescura
 * de aquí abajo — el sello tiene que llevar la fecha del ciclo abierto, así que no se
 * puede abrir un ciclo sin volver a medir, y no se puede medir sin enterarse.
 *
 * SOLO SUSPENDEN LOS DOCUMENTOS, Y LOS OTROS DOS AVISAN POR RAZONES DISTINTAS.
 *
 * · **Las skills** no están en la regla: `CLAUDE.md` nombra el conjunto `@`-importado,
 *   `General` y `scripts/`. Se vigilan aquí porque el mismo mecanismo las alcanza,
 *   pero ponerlas en rojo sería inventar la regla desde el guardián en vez de
 *   portarla.
 * · **`scripts/` sí está en la regla, y aun así avisa AQUÍ**, por una razón medida: **la
 *   propia ceremonia de apertura escribe ahí**. Los +35 de esta apertura son
 *   exactamente los dos sellos que el ritual exige —`CICLO_ABIERTO` en `presupuesto.ts` y
 *   `SELLO_GENERAL` en `check-tablero.ts`—, y añadir un guardián cuesta líneas: esta
 *   misma tanda lleva +734. Un rojo EN ESTE SELLO significaría «no se puede añadir un
 *   guardián sin borrar otro», que en un proyecto cuyo método SON los guardianes es la
 *   regla equivocada. Lo que sí hace falta es que el número esté a la vista y se vuelva a
 *   medir en cada apertura, que es lo que este sello compra.
 *
 *   **Y ese argumento ya no vale como excusa para no tener listón** (2026-09-05, D205).
 *   Lo que no se puede es medir el volumen contra SÍ MISMO; contra el producto sí, y ahí
 *   un guardián nuevo cabe si el producto también creció. Esa es la quinta mitad,
 *   `verificacion.ts`, y suspende. Esta sigue midiendo otra cosa —la retirada de la
 *   apertura— y con otro instrumento, así que sigue avisando.
 *
 * **Hoy el ámbar está encendido y dice algo cierto:** de los tres corpus, la apertura
 * de «Higiene» retiró en UNO. Los documentos, −7. Las skills, +42 palabras en el
 * propio `method-review` que audita el método. `scripts/`, +35 líneas.
 *
 * LO QUE NO PUEDE VER, dicho para que no se dé por cubierto: si los dos números son
 * los de verdad. Salen de medir en el cruce, y esto solo comprueba que se han vuelto
 * a medir y qué dicen. La deriva del ciclo en curso se publica y **no suspende**:
 * `CLAUDE.md` dice que durante el sprint no se negocia, que si algo no cabe entra y
 * lo paga la apertura siguiente.
 * ───────────────────────────────────────────────────────────────────────────── */

/** Un corpus medido a los dos lados de la retirada de apertura. */
type Retirada = { antes: number; despues: number };

const SELLO_CICLO: {
  fecha: string;
  cierra: string;
  documentos: Retirada;
  skills: Retirada;
  scripts: Retirada;
} = {
  // Tiene que coincidir con `CICLO_ABIERTO`: es lo que obliga a volver a medir.
  fecha: "2026-09-04",
  cierra: "Higiene",
  // Medido en el cruce: `d11d65d` (lo que dejó «Higiene») → la retirada de
  // apertura del `method-review` XII.
  //
  // LOS DOCUMENTOS RETIRARON CON UN SOLO CORTE, y conviene saber cuál: la sección
  // de `BRAND.md` que enseña a escribir reglas narraba los casos que su propio
  // histórico ya contaba, o sea su regla 5 incumplida por ella misma. −59. Y ahí
  // se acabaron los cortes limpios: lo siguiente por peso son reglas que se
  // aplican en cada censo, no historia. El próximo que busque empieza por
  // duplicación, no por tamaño.
  documentos: { antes: 11_686, despues: 11_627 },
  // Las skills retiraron PORQUE NO CABÍAN: añadir el disparo XII dejó la suma en
  // −251 de holgura, así que se retiraron nueve narraciones que ya viven en
  // `PRD-Historical`. Retirada real, disparada por el rojo y no por la regla.
  skills: { antes: 20_493, despues: 20_483 },
  // En LÍNEAS, no en palabras: `scripts/` es código, y su peso no se lee, se
  // mantiene. La unidad va dicha en el informe para que nadie sume las tres.
  //
  // Y SE MIDE CON EL CONTADOR DE ESTE ARCHIVO, no con `git ls-files | wc -l`, que
  // da 134 líneas menos porque no es el mismo conjunto de ficheros. Sellar con un
  // instrumento y comparar con otro inventa una deriva que no existe — el mismo
  // fallo que el `method-review` XII acababa de documentar en el sello de medición.
  //
  // ESTE CICLO NO RETIRÓ DE `scripts/`, Y EL ÁMBAR DICE LA VERDAD. No se
  // identificó ningún candidato sin inventárselo, que es justo cómo se gana un
  // verde falso. Lo que sí salió es la tarea que le pone listón: P72.53, dentro
  // de «Cierre V3» — el volumen se medía desde D28 y no había suspendido nunca, y
  // en «Higiene» creció un 29 % sin que nada se pusiera rojo. **Hecha el
  // 2026-09-05**: es la quinta mitad, y desde D205 sí suspende.
  scripts: { antes: 20_303, despues: 20_324 },
};

/**
 * Las líneas de `scripts/`, del disco. Es el tercer sitio que nombra la regla de
 * `CLAUDE.md`, y el único de los tres que no tenía ni techo ni sello.
 *
 * SE SALTAN LAS CARPETAS QUE EMPIEZAN POR PUNTO, que es lo mismo que hace
 * `scripts/palette/copias.ts`, y no es cosmético: `scripts/.poda/` es un montón de
 * archivos locales que git ignora, y contarlos daba **17.850 líneas donde el repo
 * tiene 16.346**. Un sello que mide lo que no está versionado dice cosas distintas
 * en cada máquina.
 */
function lineasDeScripts(): number {
  const cuenta = (dir: string): number =>
    readdirSync(dir, { withFileTypes: true }).reduce((n, e) => {
      const p = join(dir, e.name);
      if (e.isDirectory()) return e.name.startsWith(".") ? n : n + cuenta(p);
      return /\.(ts|tsx|mjs|cjs|js)$/.test(e.name)
        ? n + readFileSync(p, "utf8").split("\n").length
        : n;
    }, 0);
  return cuenta("scripts");
}

export function revisaApertura(total: number, sumaSkills: number): void {
  console.log(
    `\ncheck:contexto — la apertura del ciclo (${CICLO_ABIERTO}, tras «${SELLO_CICLO.cierra}»):`,
  );

  if (SELLO_CICLO.fecha !== CICLO_ABIERTO) {
    console.error(
      `\ncheck:contexto — SE ABRIÓ UN CICLO Y NADIE VOLVIÓ A MEDIR LA RETIRADA.\n\n` +
        `  ciclo abierto  ${CICLO_ABIERTO}\n` +
        `  sello          ${SELLO_CICLO.fecha}\n\n` +
        "El sello mide contra una apertura que ya no es esta, así que su verde no dice\n" +
        "nada. Se mide el corpus ANTES de retirar y DESPUÉS, y se escriben los dos\n" +
        "números en `SELLO_CICLO` con la fecha del ciclo nuevo.\n",
    );
    process.exit(1);
  }

  const CORPUS = [
    {
      nombre: "documentos @-importados",
      unidad: "palabras",
      r: SELLO_CICLO.documentos,
      vivo: total,
    },
    {
      nombre: "skills (suma)",
      unidad: "palabras",
      r: SELLO_CICLO.skills,
      vivo: sumaSkills,
    },
    {
      nombre: "scripts/",
      unidad: "líneas",
      r: SELLO_CICLO.scripts,
      vivo: lineasDeScripts(),
    },
  ] as const;

  for (const c of CORPUS) {
    const delta = c.r.despues - c.r.antes;
    const signo = delta > 0 ? `+${delta}` : String(delta);
    const deriva = c.vivo - c.r.despues;
    console.log(
      `  ${c.nombre}: ${c.r.antes} → ${c.r.despues} (${signo} ${c.unidad})` +
        ` · hoy ${c.vivo} (${deriva >= 0 ? "+" : ""}${deriva} desde la apertura)`,
    );
  }

  const noRetiro =
    SELLO_CICLO.documentos.despues >= SELLO_CICLO.documentos.antes;
  if (noRetiro) {
    const d = SELLO_CICLO.documentos;
    console.error(
      `\ncheck:contexto — LA APERTURA DE ESTE CICLO NO RETIRÓ NADA.\n\n` +
        `  antes de abrir  ${d.antes}\n` +
        `  después         ${d.despues}  (${d.despues - d.antes >= 0 ? "+" : ""}${d.despues - d.antes})\n\n` +
        "`CLAUDE.md` dice que abrir EMPIEZA retirando, en lote y antes de añadir nada.\n" +
        "Esto no juzga qué se retira —eso es criterio y lo decide una persona— sino que\n" +
        "se haya retirado. Y el candidato NO es el bloque más grande, es el DUPLICADO:\n" +
        "la misma regla escrita en dos de los cuatro, o un porqué fechado que ya está\n" +
        "en su documento histórico.\n\n" +
        "Cuando esté hecho, se vuelven a medir los dos números de `SELLO_CICLO`.\n",
    );
    process.exit(1);
  }

  const sinRetirar = CORPUS.filter(
    (c) => c.nombre !== "documentos @-importados" && c.r.despues >= c.r.antes,
  );
  console.log(
    sinRetirar.length === 0
      ? "✓ La apertura retiró de los tres corpus antes de añadir nada."
      : `  ⚠ Los documentos retiraron; ${sinRetirar
          .map(
            (c) => `${c.nombre} no (+${c.r.despues - c.r.antes} ${c.unidad})`,
          )
          .join(" · ")}. No suspende: ver el porqué arriba.`,
  );
}
