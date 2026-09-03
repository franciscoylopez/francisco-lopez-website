/**
 * PRIMERA MITAD: los cuatro documentos que se `@`-importan en cada arranque.
 *
 * El porqué del techo, y por qué no es el objetivo, en la cabecera de
 * `scripts/check-contexto.ts`.
 */
import { readFileSync } from "node:fs";

import { palabras, vigente, type Movimiento } from "./presupuesto";

/** Lo que se `@`-importa en cada arranque de sesión, vía `CLAUDE.md`. */
const IMPORTADOS = ["CLAUDE.md", "AGENTS.md", "BRAND.md", "PRD-Live.md"];

/**
 * Falla por encima de aquí. **Se aprieta conforme se compacta, nunca se afloja.**
 *
 * **El historial es el dato de abajo, `HISTORIAL_TECHO`, y el techo sale de él.**
 * Aquí no se repite: una lista en prosa al lado del valor es cómo una de las dos
 * mitades acaba diciendo otra cosa. Lo que queda aquí es lo que un `motivo` de una
 * línea no puede llevar — los dos episodios que costaron una decisión.
 *
 * LA VEZ QUE SE AFLOJÓ, Y POR QUÉ NO CONTRADICE LA REGLA DE ARRIBA. Este bloque
 * dice «nunca se afloja» y predice este momento con precisión incómoda: «un techo
 * que no deja escribir no produce compactación: produce el reflejo de subirlo».
 * Conviene leer eso antes de justificar nada. Lo que hace que esta subida no sea
 * ese reflejo es la magnitud que el propio párrafo de arriba nombra como la que hay
 * que sostener: **la holgura de trabajo, unas 240 palabras**. El 2026-08-25 eran
 * DOS, así que la invariante ya estaba rota y apretar más no era una opción que
 * existiera.
 *
 * Y la curva dice por qué 240 tampoco bastaba. Medida en el quinto disparo:
 *
 *     30-jul   4.120
 *     10-ago  12.116
 *     19-ago  13.084   ← pico
 *     22-ago  12.058   ← Método II recorta 1.026
 *     25-ago  12.198   ← +140 en tres días, sin regla nueva
 *
 * Sube ~1.000 por sprint y se recorta ~1.000 por sprint, y el recorte cuesta
 * TAREAS: tres de las treinta y tres del sprint «Artículo y velocidad» (el 9%).
 * Eso ya no es un trinquete, es una cinta de correr, y la fricción la paga cada
 * tarea que quiere escribir una regla. 500 palabras de holgura son media docena de
 * sesiones en vez de un cuarto de sprint.
 *
 * Y EL 2026-08-27 (P68.5908) EL TRINQUETE VOLVIÓ A APRETAR, como esa entrada
 * prometía: la subida quedó atada a que apareciera el dato, y apareció. La revisión
 * manual (D128) encontró que el crecimiento no viene de un archivo gordo sino de
 * lluvia fina sobre los tres, y que el porqué estaba escrito dos veces —en el
 * documento de reglas y en su D-entry—. Con `PRD-Live` §Cómo se verifica en tabla
 * de contrato (769 → 542) y el porqué de `CLAUDE.md` partido a
 * `CLAUDE-historical.md`, y por primera vez la bajada no es una mudanza —el
 * histórico no se `@`-importa y la suma de skills ya tiene techo (D129)—.
 *
 * LO QUE ESTE PÁRRAFO PREDIJO Y LO QUE MIDIÓ EL COMANDO, que no es lo mismo
 * (corregido el 2026-08-28, séptimo `method-review`). Decía «4.693 → 4.033», un
 * arranque de «11.794» y una holgura de «500». Medido al cerrar el sprint:
 * `CLAUDE.md` **4.185**, arranque **12.047**, holgura **253**. Las tres cifras
 * eran una PREVISIÓN escrita mientras se trabajaba, y se leían como una
 * medición; el resto del sprint siguió escribiendo en los tres archivos y se
 * comió la diferencia.
 *
 * Vale como aviso permanente, porque es la quinta instancia de «la cifra
 * apuntada que caduca» y ocurrió en el archivo cuyo trabajo es cazarlas: **una
 * cifra de este comentario no se escribe hasta que el comando la devuelve.**
 *
 * Y LA HOLGURA QUE SE PRETENDÍA DEJAR ERA 500, que es lo que el párrafo de
 * arriba pedía sin poder pagarlo: 500 palabras son media docena de sesiones
 * escribiendo reglas en vez de un cuarto de sprint retirándolas.
 *
 * EL 2026-08-28 SON **410**, Y ESTA VEZ EL TECHO NO SE HA MOVIDO. Es la primera vez
 * que el margen sube solo por trabajo del dato: 12.047 → 11.890 sobre el mismo
 * 12.300, y añadiendo reglas por el camino — P50.72 lo dejó en 405 y P50.73, que
 * trajo un gate nuevo y su fila de contrato, PAGÓ su alta retirando copias en vez
 * de mover el techo. Es el trinquete funcionando como se pedía. Salió de retirar COPIAS, no reglas — el gate de accesibilidad
 * estaba descrito en `CLAUDE.md` y en la tabla de contrato de `PRD-Live`, el
 * reparto de los 9 puntos estaba en prosa y en la DoD, y el porqué de cada
 * excepción de control estaba en `BRAND.md`, en el histórico y en la propia marca
 * `@fuera-de-capa` que imprime `check:excepciones`. Cifra devuelta por el comando,
 * como pide el párrafo de arriba.
 */
export const HISTORIAL_TECHO: Movimiento[] = [
  {
    fecha: "2026-08-19",
    valor: 16_000,
    motivo: "nace, con 15.466 medidos tras compactar PRD-Live",
  },
  {
    fecha: "2026-08-19",
    valor: 13_500,
    motivo: "el índice de decisiones se deriva (3.610 → 924)",
  },
  {
    fecha: "2026-08-22",
    valor: 12_500,
    motivo:
      "ese índice baja a la cabecera de DECISIONS.md (13.494 → 12.224). D88: era el único componente que crecía por construcción, y contra eso un techo no defiende",
  },
  {
    fecha: "2026-08-22",
    valor: 12_400,
    motivo:
      "pasada de retirada sobre BRAND.md (12.224 → 11.976, la primera vez que el arranque cabe en el objetivo)",
  },
  {
    fecha: "2026-08-24",
    valor: 12_200,
    motivo:
      "historia fechada y tres duplicaciones fuera (12.397 → 11.957); ninguna regla se retiró, solo su historia y sus copias",
  },
  {
    fecha: "2026-08-25",
    valor: 12_700,
    motivo:
      "PRIMERA subida: con 2 palabras de holgura la invariante ya estaba rota y apretar más no era una opción. Decisión de Francisco en el quinto method-review",
  },
  {
    fecha: "2026-08-27",
    valor: 12_300,
    motivo:
      "el trinquete vuelve a apretar: la subida quedó atada a que apareciera el dato (D128), y apareció",
  },
  {
    fecha: "2026-08-30",
    valor: 11_700,
    motivo:
      "la tabla de contrato de los gates baja a `GATES.md` (12.289 → 11.455): 992 palabras que el propio `PRD-Live` describía como algo que no se lee hasta que un check sale rojo. Se aprieta dejando 245 de margen para que el hueco no se rellene solo, que es la familia que abrió esta tarea",
  },
];

const TECHO = vigente(HISTORIAL_TECHO);

/**
 * A dónde se quiere llegar. No falla; solo se publica la distancia. Necesita número
 * nuevo cada vez que se alcanza, porque un objetivo ya cumplido deja de tirar.
 *   12.000  alcanzado el 2026-08-22 y sostenido desde entonces
 *   11.800  desde el 2026-08-24; alcanzado el 2026-08-27 (11.794)
 *   11.600  desde el 2026-08-27, al alcanzarse el anterior. Mismo escalón de 200
 *           que el salto de antes: la cadencia sale de la escalera, no de elegir
 *           un número nuevo cada vez.
 *   11.400  desde el 2026-08-30. Y aquí la escalera contesta a la tarea que la
 *           puso en duda: P68.7405 nació diciendo que 11.600 no se había
 *           alcanzado NUNCA en la vida del techo —cierto, la banda vivía entre
 *           12.058 y 12.698— y la conclusión que se ofrecía era que el objetivo
 *           estaba mal. No lo estaba: estaba esperando a que se retirara algo
 *           estructural. Bajar la tabla de gates lo alcanzó de golpe (11.455),
 *           así que el objetivo no se discute, se baja un escalón como estaba
 *           escrito. Un objetivo ya cumplido deja de tirar.
 */
const OBJETIVO = 11_400;

/** El total medido, que la cuarta mitad necesita. */
export function revisaDocumentos(): number {
  const medidas = IMPORTADOS.map((archivo) => ({
    archivo,
    palabras: palabras(readFileSync(archivo, "utf8")),
  }));

  const total = medidas.reduce((n, m) => n + m.palabras, 0);

  if (medidas.length === 0 || total === 0) {
    console.error(
      "\ncheck:contexto — NO HA MIRADO NADA. Con cero entradas este check aprobaría\n" +
        "siempre, así que falla a propósito. ¿Se ha renombrado alguno de los\n" +
        `@-importados? Esperaba: ${IMPORTADOS.join(", ")}\n`,
    );
    process.exit(1);
  }

  // El metro afirma cuánto ha mirado (y no al revés).
  console.log(`check:contexto — ${medidas.length} archivos @-importados:`);
  for (const m of [...medidas].sort((a, b) => b.palabras - a.palabras)) {
    console.log(`  ${String(m.palabras).padStart(6)}  ${m.archivo}`);
  }
  console.log(
    `  ${String(total).padStart(6)}  TOTAL · techo ${TECHO} · objetivo ${OBJETIVO}`,
  );

  if (total > TECHO) {
    console.error(
      `\ncheck:contexto — EL CONTEXTO DE ARRANQUE NO CABE: ${total} palabras, ` +
        `techo ${TECHO}.\n\n` +
        "Esto es coste fijo de CADA sesión, antes de escribir nada. Lo que toca no es\n" +
        "subir el techo: es la operación que a este método le falta por defecto,\n" +
        "RETIRAR. Tres preguntas, en este orden:\n\n" +
        "  1. ¿Hay párrafos FECHADOS en `PRD-Live.md` o `BRAND.md`? Son historia y su\n" +
        "     sitio es `PRD-Historical.md` / `BRAND-historical.md`, que van a demanda.\n" +
        "  2. ¿Algo de lo último escrito SUSTITUYE a un párrafo que ya estaba, en vez\n" +
        "     de haberse añadido al lado?\n" +
        "  3. ¿Alguna regla está escrita en DOS de estos archivos? La misma decisión en\n" +
        "     dos sitios acaba diciendo dos cosas (BRAND.md §Cómo se escribe una regla).\n",
    );
    process.exit(1);
  }

  if (total > OBJETIVO) {
    console.log(
      `  ⚠ ${total - OBJETIVO} palabras por encima del objetivo de ${OBJETIVO}. ` +
        "No falla, pero es la deuda que queda.",
    );
  } else {
    console.log(
      "✓ El contexto de arranque cabe en el objetivo. Baja el techo.",
    );
  }

  return total;
}
