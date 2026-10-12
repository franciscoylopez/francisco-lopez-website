/**
 * QUINTA MITAD: ¿cuánto pesa el andamiaje contra lo que sostiene? (2026-09-05, P72.53).
 *
 * POR QUÉ EXISTE. `scripts/` es **el único eje del proyecto que nadie frena**. Se
 * mide desde D28 y nunca ha suspendido: en el sprint «Higiene» creció **+4.557
 * líneas (+29 %)** y 76 archivos, y lo único que pasó fue que la cuarta mitad de
 * aquí al lado imprimió el número en ámbar. `check:deuda` vigila la COMPLEJIDAD y
 * cuadra exacto; el VOLUMEN se publicaba y ya.
 *
 * Y BUENA PARTE DE ESE CRECIMIENTO ES DESCOMPOSICIÓN, que es justo lo que bajó los
 * *smells* de Qlty de 71 a 21. Por eso esto **no pide borrar nada**: pide que
 * crecer tenga un listón.
 *
 * CONTRA QUÉ SE MIDE, que es la pregunta que había que contestar antes de escribir
 * ningún umbral. Las dos formas que ya usa esta casa:
 *
 *   1. **Trinquete** contra un sello, como `check:deuda`. Simple, y con un modo de
 *      fallo que aquí es descalificador: **partir un archivo en tres sube el
 *      recuento sin añadir nada**, así que castigaría la descomposición legítima
 *      exactamente igual que la hinchazón.
 *   2. **Ratio contra el producto**, como la fila del `method-review`. Sobrevive al
 *      crecimiento del proyecto y distingue crecer de hincharse: un guardián nuevo
 *      cabe si el producto también creció, y no cabe si el andamiaje es lo único
 *      que se mueve.
 *
 * Se elige la 2. Y contesta además la objeción que `apertura.ts` dejó escrita
 * contra poner esto en rojo —«no se puede añadir un guardián sin borrar otro, que
 * en un proyecto cuyo método SON los guardianes es la regla equivocada»—: contra
 * un ratio, sí se puede. Lo que no se puede es añadirlo cuando el producto lleva un
 * sprint quieto.
 *
 * LA OPERACIÓN ES LA DEL `method-review`, LITERAL, y no una parecida. Se reconstruyó
 * allí y **tres definiciones razonables daban 0,47, 0,52 y 0,62 sobre el mismo
 * árbol**, así que la que vale es la que está publicada: solo archivos RASTREADOS
 * (si no entra `scripts/.poda/`, que git ignora), extensiones `.ts .tsx .js .mjs`,
 * numerador `scripts/` sola, denominador `app + components + lib + content`.
 * `tests/` queda FUERA del numerador a propósito: un test prueba el producto, un
 * guardián vigila el método.
 *
 * Y POR ESO NO REUSA EL CONTADOR DE `apertura.ts`, que recorre el disco y suma
 * también `.cjs`: son dos instrumentos, y el sello de al lado ya documenta lo que
 * pasa al mezclarlos —«sellar con un instrumento y comparar con otro inventa una
 * deriva que no existe»—. Este mide lo que publica el `method-review`; aquel, lo
 * que sella la apertura del ciclo. Cada uno dice su unidad en el informe.
 *
 * NACE EN VERDE, COMO TODOS LOS DE ESTE ARCHIVO. «Un gate que nace en rojo se acaba
 * subiendo hasta que no significa nada»: el techo sale del dato medido con holgura
 * de trabajo, y el objetivo lleva la ambición. El destino es el 0,55 que el
 * `method-review` marca como rojo en su fila, y hasta ahí se baja por la escalera,
 * no de un salto.
 */
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

import { vigente, type Movimiento } from "./presupuesto";

/** Numerador y denominador de la fila del `method-review`, sin inventar nada. */
const ANDAMIAJE = ["scripts"];
const PRODUCTO = ["app", "components", "lib", "content"];

/**
 * Falla por encima de aquí. **Se aprieta conforme baja, nunca se afloja**, y el
 * historial es el dato: no se puede mover un techo sin escribir el motivo.
 */
export const HISTORIAL_TECHO_VERIFICACION: Movimiento[] = [
  {
    fecha: "2026-09-05",
    valor: 0.74,
    motivo:
      "nace con 0,7179 medidos (20.797 ÷ 28.968), la cifra que devolvió el comando y no una previsión. La holgura son ~640 líneas de scripts/, que es un guardián con su módulo y su caso malo: lo justo para que añadir uno no obligue a borrar otro, y no tanto como para que quepa otro «Higiene» entero (+4.557) sin enterarse",
  },
];

const TECHO = vigente(HISTORIAL_TECHO_VERIFICACION);

/**
 * A dónde se quiere llegar. No falla; solo se publica la distancia. Escalera de
 * 0,02, del mismo tamaño relativo que la de documentos (200 sobre 11.700):
 *   0,68  desde el 2026-09-05
 *   0,55  el destino, que es el umbral rojo de la fila del `method-review`. No es
 *         el próximo escalón: son ~4.000 líneas de andamiaje o ~8.000 de producto,
 *         y un objetivo que no se puede alcanzar en un ciclo deja de tirar.
 */
const OBJETIVO = 0.68;

/** Las líneas rastreadas de un conjunto de directorios, con la vara publicada. */
function lineas(dirs: string[]): { lineas: number; archivos: number } {
  const archivos = execSync(`git ls-files -- ${dirs.join(" ")}`, {
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  })
    .split(/\r?\n/)
    .filter((f) => /\.(ts|tsx|js|mjs)$/.test(f));

  return {
    archivos: archivos.length,
    // Como `wc -l`: cuenta saltos de línea. Prettier deja siempre el final, así
    // que no hay última línea que se pierda.
    lineas: archivos.reduce(
      (n, f) => n + (readFileSync(f, "utf8").match(/\n/g)?.length ?? 0),
      0,
    ),
  };
}

export function revisaVerificacion(): void {
  const andamiaje = lineas(ANDAMIAJE);
  const producto = lineas(PRODUCTO);

  // El metro afirma cuánto ha mirado, y se niega a aprobar por vacío: con el
  // denominador a cero el ratio sería Infinity y con el numerador a cero, un
  // aprobado perfecto. Las dos cosas significan que no ha encontrado el árbol.
  if (andamiaje.archivos === 0 || producto.archivos === 0) {
    console.error(
      "\ncheck:contexto — NO HA MIRADO NADA. Con un lado vacío este check no puede\n" +
        `decir nada: andamiaje ${andamiaje.archivos} archivos, producto ` +
        `${producto.archivos}. ¿Se ha renombrado algún directorio? Esperaba ` +
        `${ANDAMIAJE.join(", ")} y ${PRODUCTO.join(", ")}.\n`,
    );
    process.exit(1);
  }

  const ratio = andamiaje.lineas / producto.lineas;
  const cifra = (n: number) => n.toFixed(4).replace(".", ",");

  console.log(
    `\ncheck:contexto — verificación ÷ producto (líneas rastreadas, ` +
      `${andamiaje.archivos + producto.archivos} archivos):`,
  );
  console.log(
    `  ${String(andamiaje.lineas).padStart(6)}  ${ANDAMIAJE.join(" + ")}/`,
  );
  console.log(
    `  ${String(producto.lineas).padStart(6)}  ${PRODUCTO.join(" + ")}/`,
  );
  console.log(
    `  ${cifra(ratio).padStart(6)}  RATIO · techo ${cifra(TECHO)} · objetivo ${cifra(OBJETIVO)}`,
  );

  if (ratio > TECHO) {
    console.error(
      `\ncheck:contexto — EL ANDAMIAJE PESA DEMASIADO: ${cifra(ratio)}, techo ` +
        `${cifra(TECHO)}.\n\n` +
        "Esto NO pide borrar nada, y menos deshacer una descomposición: partir un\n" +
        "archivo en tres es lo que bajó los smells de 71 a 21. Pide que crecer tenga un\n" +
        "listón. Tres preguntas, en este orden:\n\n" +
        "  1. ¿El guardián nuevo VIGILA ALGO QUE YA VIGILA OTRO? Dos metros sobre el\n" +
        "     mismo invariante acaban diciendo dos cosas.\n" +
        "  2. ¿Cabe como una mitad más de uno que ya existe, en vez de como script\n" +
        "     nuevo con su arranque, su cabecera y su caso malo?\n" +
        "  3. ¿Hay andamiaje que ya no sostiene nada? Un guardián de una regla que se\n" +
        "     retiró sigue costando líneas y no protege nada.\n\n" +
        "Y si la respuesta a las tres es que no, el techo se puede mover: escribiendo\n" +
        "el motivo en `HISTORIAL_TECHO_VERIFICACION`, que es lo que cuesta.\n",
    );
    process.exit(1);
  }

  if (ratio > OBJETIVO) {
    console.log(
      `  ⚠ ${cifra(ratio - OBJETIVO)} por encima del objetivo de ${cifra(OBJETIVO)}. ` +
        "No falla, pero es la deuda que queda.",
    );
  } else {
    console.log(
      "✓ El andamiaje cabe en el objetivo. Baja el techo un escalón.",
    );
  }
}
