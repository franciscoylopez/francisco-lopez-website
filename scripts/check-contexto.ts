/**
 * ¿Cabe el contexto de arranque? — `npm run check:contexto`, en CI.
 *
 * POR QUÉ EXISTE. D28 escribió el régimen de contexto —solo las reglas activas se
 * `@`-importan; la historia y el detalle van a demanda— y no le puso NI CIFRA NI
 * GUARDIÁN. Así que se cumplió exactamente cuatro días. Medido el 2026-08-19:
 *
 *     09-ago   9.275 palabras   ← el día del corte de BRAND.md (P37.685)
 *     10-ago  12.116
 *     16-ago  13.521
 *     18-ago  18.098
 *     19-ago  19.805            ← +113% en diez días
 *
 * El corte de `BRAND.md` compró 2.400 palabras y el crecimiento se las comió en
 * cuatro días. Es «una regla que hay que recordar es una regla que se incumple»
 * aplicada a la regla que gobierna las reglas.
 *
 * POR QUÉ UN TECHO Y NO UN AVISO. Porque un aviso es lo que ya había: la regla
 * estaba escrita en `CLAUDE.md` y en `DECISIONS.md`, y las dos veces en prosa. Lo
 * que convierte una intención en una restricción es que falle el build.
 *
 * Y POR QUÉ EL TECHO NO ES EL OBJETIVO. Un gate que nace en rojo se acaba
 * subiendo hasta que no significa nada, así que este nació en verde y actúa de
 * trinquete: impide crecer y deja ver cuánto falta para el objetivo. **Se aprieta
 * conforme se compacta, nunca se afloja.**
 *
 * EL OBJETIVO SE ALCANZÓ EL 2026-08-22 (11.976), así que a partir de aquí deja de
 * ser una distancia y pasa a ser una línea que hay que sostener. El techo queda
 * por encima con holgura de trabajo —una sesión normal escribe y borra párrafos—.
 *
 * Y ESA HOLGURA ES LA MAGNITUD QUE HAY QUE SOSTENER, no el techo (2026-08-24,
 * P68.675). Aquí estaba escrito que el próximo apretón era a 12.000, y NO se hizo:
 * con 11.957 medidos habría dejado 43 palabras de margen, que es justo el estado
 * que originó esta tarea. El 2026-08-23 quedaron 17, y el 2026-08-24 una regla
 * nueva de tres líneas no cupo y hubo que retirar antes para pagarla. Un techo que
 * no deja escribir no produce compactación: produce el reflejo de subirlo, que es
 * lo único que este gate no puede permitirse. Se aprieta el techo hasta dejar unas
 * 240 palabras —cinco o seis reglas— y se baja el objetivo, que es quien lleva la
 * ambición.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

/** Lo que se `@`-importa en cada arranque de sesión, vía `CLAUDE.md`. */
const IMPORTADOS = ["CLAUDE.md", "AGENTS.md", "BRAND.md", "PRD-Live.md"];

/* ─────────────────────────────────────────────────────────────────────────────
 * MOVER UN TECHO TIENE QUE COSTAR ALGO (2026-08-28, P50.72 · D139).
 *
 * Los tres techos de este archivo se habían movido SIETE veces en nueve días, en
 * las dos direcciones, y el margen nunca pasó de 442 ni bajó de 5. La medición que
 * lo abrió es la que duele: el sprint «Home» retiró 651 palabras de verdad —la
 * primera reducción real desde el 22 de agosto— y el margen subió de 246 a 253,
 * porque el techo bajó 400 en el mismo commit. **Retirar 651 compró 7.**
 *
 * Un trinquete cuyo trinquete se mueve es un termómetro que se repinta. Es familia
 * propia en el catálogo de `method-review` —«el umbral que persigue al dato»— y se
 * distingue de «la cifra apuntada que caduca» POR EL REMEDIO: aquella envejece
 * porque nadie la toca, esta se actualiza *demasiado bien*.
 *
 * EL REMEDIO, en dos piezas que solo funcionan juntas:
 *
 * 1. **El techo se DERIVA de su historial**, que es un dato y no un comentario. No
 *    se puede mover sin añadir una entrada, y una entrada exige `motivo`: lo pide
 *    el tipo, así que no hay forma de subir un número en silencio. Y el historial
 *    deja de estar escrito dos veces —prosa arriba, valor abajo—, que es como una
 *    de las dos mitades acaba diciendo otra cosa.
 * 2. **Se cuentan los movimientos del ciclo en curso** y se publican en cada
 *    corrida: **verde 0 · ámbar 1** —el trinquete apretando, que es su trabajo— ·
 *    **rojo ≥ 2**, que ya no es apretar sino perseguir al dato.
 *
 * LO QUE NO PUEDE VER. Si el objetivo persigue al dato en vez del techo, esto no lo
 * mira: el objetivo no falla, solo tira, y un objetivo que se relaja se nota en que
 * la distancia no baja. Se vigila lo que muerde.
 * ───────────────────────────────────────────────────────────────────────────── */

/** Un movimiento de techo. `motivo` es obligatorio a propósito: es el coste. */
type Movimiento = { fecha: string; valor: number; motivo: string };

/**
 * Desde cuándo se cuentan los movimientos. **Se actualiza al ABRIR una etapa**, que
 * es lo que hace de «ciclo» una unidad comprobable en vez de una intuición. Hoy:
 * apertura del sprint «Distribución».
 *
 * «Agentes» cerró con **1 de 3 techos movidos** —el de documentos, para bajar la tabla
 * de gates a `GATES.md`—, contra 0 en los dos anteriores. Uno es el trinquete
 * apretando; el segundo ya no.
 *
 * LO QUE ESTE CICLO ESTRENA, y por eso se anota aquí: `CLAUDE.md` gana la regla de la
 * **retirada en lote al abrir**, que es la receta que el noveno `method-review` dejó sin
 * construir. Su primera aplicación es esta apertura, y sale **a medias, dicho a
 * propósito**:
 *
 * · **`General`: retirado.** 20 → 18, al comprometer dos tareas en el sprint. Es la
 *   regla de movimiento del tablero haciendo de desagüe, que es justo lo que se pedía.
 * · **Documentos: NO retirado, y no por olvido.** Se buscó el duplicado que la regla
 *   manda buscar y **no lo hay**: el candidato obvio —los 9 puntos del checklist de
 *   accesibilidad, que el propio documento llama «los mismos que publica el Design
 *   System»— resultó ser el original y no la copia; la página del sitio los espeja a
 *   ellos. Son reglas operativas con valores (anillo de 2px, 44×44, `tabindex="-1"`).
 *
 * Y ESO ES EL HALLAZGO DEL CICLO, escrito por adelantado para el `method-review` que lo
 * cierre: **si no queda duplicado que retirar, la próxima retirada ya no es un traslado
 * — es decidir qué deja de ser regla.** Es un acto distinto y más caro, y el margen de
 * 17 palabras dice que toca pronto.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * CICLO «HIGIENE», abierto el 2026-09-02. La retirada SÍ se hizo, y esta vez el
 * duplicado apareció donde el ciclo anterior no lo buscó: **en el propio bloque que
 * escribió la regla**. Las 105 palabras de «ABRIR EMPIEZA RETIRANDO» duplicaban su
 * porqué y su medida con `CLAUDE-historical.md`, al que ya apuntaban; se dejó la regla
 * y se retiró la justificación. Con eso cupieron **dos reglas nuevas** —lo que el
 * cierre aprende va al histórico, y `/prototype` dispara ante cualquier pieza visual y
 * no solo un «componente»— y `CLAUDE.md` salió en **−4 palabras netas**.
 *
 * LA LECCIÓN, para el `method-review` que cierre este ciclo: el ciclo anterior buscó
 * duplicado y concluyó que no lo había mirando **el contenido viejo**. No miró lo que
 * él mismo acababa de escribir. Un cierre que documenta lo que aprendió es el sitio
 * más probable del próximo duplicado, no el menos.
 */
const CICLO_ABIERTO = "2026-09-02";

/** El techo vigente es el último movimiento, nunca un número escrito aparte. */
function vigente(historial: Movimiento[]): number {
  const ultimo = historial.at(-1);
  if (!ultimo) throw new Error("Un techo sin historial no se puede derivar.");
  return ultimo.valor;
}

/** Los de este ciclo. El de apertura cuenta: mover el techo el día que se abre la
 *  etapa es exactamente el reflejo que esto vigila. */
function movimientosDelCiclo(historial: Movimiento[]): Movimiento[] {
  return historial.filter((m) => m.fecha >= CICLO_ABIERTO);
}

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
const HISTORIAL_TECHO: Movimiento[] = [
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

/** Palabras «de verdad»: sin bloques de código, que no son prosa que haya que leer. */
function palabras(texto: string): number {
  const sinCodigo = texto.replace(/```[\s\S]*?```/g, " ");
  return sinCodigo.split(/\s+/).filter(Boolean).length;
}

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
  console.log("✓ El contexto de arranque cabe en el objetivo. Baja el techo.");
}

/* ─────────────────────────────────────────────────────────────────────────────
 * SEGUNDA MITAD: LAS SKILLS Y LOS AGENTES (2026-08-24, P68.67).
 *
 * El presupuesto de arriba vigilaba los cuatro `@`-importados y nada más,
 * mientras la mitad no vigilada pesaba 1,61× la vigilada —19.884 palabras
 * contra 11.957— y crecía al revés: entre el 08-08 y el 08-22, lo vigilado
 * +34% y las skills +233%. Las curvas se cruzaron el 2026-08-19, el día del
 * primer `method-review`: ese día lo vigilado bajó 437 palabras y lo no
 * vigilado subió 6.816. Es el mismo modo de fallo que D69 arregló para los
 * documentos —crece porque nada pregunta qué sobra—, en el sitio donde nadie
 * miraba.
 *
 * POR QUÉ UN TECHO POR SKILL. Una skill se carga ENTERA cuando se dispara, así
 * que lo primero que importa es cuánto cuesta LA MÁS CARA.
 *
 * Y POR QUÉ TAMBIÉN A LA SUMA, desde el 2026-08-27 (P68.5907). Este comentario
 * decía «un total aquí no significa nada: las nueve entradas no se cargan nunca
 * a la vez», y la salida lo repetía en cada corrida. Era cierto y no era toda la
 * verdad: **un techo por entrada y ninguno al conjunto hace que mover una regla
 * de un documento a una skill salga GRATIS**, y eso es exactamente lo que pasó.
 * El sexto `method-review` lo midió entre el 19 y el 27 de agosto: docs −30 %,
 * skills +55 %, corpus total **+6 %**. Se celebró una reducción en el lado
 * medido mientras el lado sin medir absorbía el coste y algo más. Es una familia
 * de fallo propia —«la reducción que fue una mudanza»— y el trinquete solo la
 * cierra si es simétrico.
 *
 * El argumento de la concurrencia además se cae solo en la práctica: un cierre
 * de etapa encadena `sprint-review` → `method-review` → `close-session` en la
 * misma sesión, encima de los cuatro documentos. Ahí sí suman.
 *
 * SIN OBJETIVO, Y ES DELIBERADO. Los otros dos presupuestos llevan techo +
 * objetivo porque su objetivo sale de una historia medida. Para la suma de
 * skills esa curva no existe todavía: poner un objetivo hoy sería elegir un
 * número y llamarlo medida, que es justo lo que D128 acaba de corregir. Se sella
 * y se mide; el objetivo se pone cuando haya curva que lo justifique.
 *
 * EL NÚMERO SALE DE MEDIR EL RUIDO PRIMERO, no de elegirlo. Barrido sobre las
 * nueve entradas reales: a 4.500 lo cruza UNA, a 2.500 dos, a 2.000 tres y a
 * 1.500 seis. Un techo que descalifica a media casa está mal puesto él, no las
 * skills; 4.500 —el tamaño del mayor `@`-importado— señala exactamente al
 * outlier y deja pasar al resto.
 *
 * Y NACE EN VERDE, por la misma razón que el techo de arriba: un gate que nace
 * en rojo se sube hasta que no significa nada. `design-review` medía 6.290 y era
 * quien tenía el margen —la única skill que no se había revisado desde que se
 * escribió, y el sprint 2 le añadió una fase entera—, así que el TECHO nació por
 * encima de ella y el OBJETIVO, que solo avisa, la nombró en cada corrida hasta
 * que se compactó. **Y el techo bajó detrás**, que es lo que hace que esto sea un
 * trinquete y no un aviso.
 *
 * LO QUE ESTE METRO NO VE, y conviene saberlo: las skills de usuario
 * (`~/.claude/skills/`) también se cargan enteras y no están en el repositorio,
 * así que CI no puede medirlas. Aquí se vigila lo que el proyecto sí controla.
 * ───────────────────────────────────────────────────────────────────────────── */

/**
 * Falla por encima de aquí, POR ENTRADA. **Se aprieta conforme se compacta**, y su
 * historial es dato como el de arriba.
 */
const HISTORIAL_TECHO_SKILL: Movimiento[] = [
  {
    fecha: "2026-08-24",
    valor: 6_400,
    motivo: "nace, con design-review medida en 6.290",
  },
  {
    fecha: "2026-08-24",
    valor: 4_600,
    motivo:
      "retirada sobre design-review (6.290 → 4.499). Ninguna regla se retiró: la Fase 3 reescribía el censo de BRAND.md y el axe de viewport-verifier, y el filtro mecánico estaba dos veces seguidas",
  },
];

const TECHO_SKILL = vigente(HISTORIAL_TECHO_SKILL);

/** A dónde se quiere llegar por entrada: el tamaño del mayor `@`-importado. */
const OBJETIVO_SKILL = 4_500;

/**
 * Falla por encima de aquí, SUMANDO todas las entradas. **Se aprieta conforme se
 * compacta**, igual que el de arriba, y su historial también es dato.
 *
 * OJO AL COMPARAR CON EL INFORME que originó esto, que dice 20.616 donde aquí
 * pone 20.203. No es drift ni una medida vieja: **este contador descuenta los
 * bloques de código y el del informe no** (20.688 con ellos, comprobado). El
 * número que gobierna es el de aquí, que es el mismo con el que se miden los
 * documentos — comparar dos corpus con dos varas distintas era la mitad del
 * problema.
 */
const HISTORIAL_TECHO_SUMA: Movimiento[] = [
  {
    fecha: "2026-08-27",
    valor: 20_500,
    motivo:
      "nace en verde (P68.5907), sellado contra la suma de DESPUÉS de la propia tarea —20.262, no las 20.203 de antes—, porque actualizar la tabla de umbrales de method-review es parte de ella. Holgura 238, la misma magnitud que defiende el techo de los documentos",
  },
];

const TECHO_SUMA = vigente(HISTORIAL_TECHO_SUMA);

/** Las carpetas de contexto a demanda que vivan en el repo. Del DISCO, nunca de
 *  una lista escrita: una skill nueva entra en el presupuesto sin que nadie se
 *  acuerde, igual que una página entra en el censo por `PAGE_SLUGS`. */
const CARPETAS = [".claude/skills", ".claude/agents", ".claude/commands"];

function mdRecursivo(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    if (e.isDirectory()) return mdRecursivo(p);
    return e.name.endsWith(".md") ? [p] : [];
  });
}

/** Una entrada = una skill, con todos los `.md` que la componen sumados: lo que
 *  cuesta dispararla es su carpeta entera, no su `SKILL.md`. */
const entradas = new Map<string, { palabras: number; archivos: number }>();
for (const carpeta of CARPETAS) {
  for (const archivo of mdRecursivo(carpeta)) {
    // Separador normalizado antes de partir: en Windows `relative` devuelve
    // `\`, y una clase de caracteres mal escapada partiría solo por `/` y
    // dejaría el nombre en «design-review\SKILL».
    const resto = relative(carpeta, archivo).replaceAll("\\", "/").split("/");
    const primero = resto[0] ?? archivo;
    const nombre = resto.length > 1 ? primero : primero.replace(/\.md$/, "");
    const acc = entradas.get(nombre) ?? { palabras: 0, archivos: 0 };
    acc.palabras += palabras(readFileSync(archivo, "utf8"));
    acc.archivos += 1;
    entradas.set(nombre, acc);
  }
}

if (entradas.size === 0) {
  console.error(
    "\ncheck:contexto — NO HA MIRADO NINGUNA SKILL. Con cero entradas esta mitad\n" +
      "aprobaría siempre, así que falla a propósito. ¿Se han movido de sitio?\n" +
      `Esperaba .md bajo: ${CARPETAS.join(", ")}\n`,
  );
  process.exit(1);
}

const porTamano = [...entradas].sort((a, b) => b[1].palabras - a[1].palabras);
const sumaSkills = porTamano.reduce((n, [, v]) => n + v.palabras, 0);

// El metro afirma cuánto ha mirado (y no al revés).
console.log(
  `\ncheck:contexto — ${entradas.size} entradas a demanda (skills y agentes del repo),` +
    ` techo ${TECHO_SKILL} por entrada:`,
);
for (const [nombre, v] of porTamano) {
  const marca =
    v.palabras > TECHO_SKILL ? " ✗" : v.palabras > OBJETIVO_SKILL ? " ⚠" : "";
  console.log(`  ${String(v.palabras).padStart(6)}  ${nombre}${marca}`);
}
console.log(
  `  ${String(sumaSkills).padStart(6)}  suma · techo ${TECHO_SUMA}` +
    ` (holgura ${TECHO_SUMA - sumaSkills})`,
);

const pasadas = porTamano.filter(([, v]) => v.palabras > TECHO_SKILL);
if (pasadas.length > 0) {
  console.error(
    `\ncheck:contexto — ${pasadas.length} entrada(s) por encima del techo de ` +
      `${TECHO_SKILL} palabras:\n` +
      pasadas.map(([n, v]) => `  ${v.palabras}  ${n}`).join("\n") +
      "\n\nUna skill se carga ENTERA al dispararse. Lo que toca no es subir el techo,\n" +
      "es retirar: ¿hay una fase que ya no se usa, un ejemplo que repite al de\n" +
      "arriba, o un porqué fechado que debería estar en el documento histórico?\n",
  );
  process.exit(1);
}

if (sumaSkills > TECHO_SUMA) {
  console.error(
    `\ncheck:contexto — LA SUMA DE SKILLS NO CABE: ${sumaSkills} palabras, ` +
      `${sumaSkills - TECHO_SUMA} por encima del techo de ${TECHO_SUMA}.\n\n` +
      "El techo por entrada ya está en verde, así que esto no lo arregla compactar\n" +
      "la mayor: es que el conjunto ha crecido. Y lo que NO vale es subir el techo,\n" +
      "porque este existe para que mover una regla de un documento a una skill deje\n" +
      "de salir gratis — sin él, una retirada de docs puede ser una mudanza y el\n" +
      "corpus total crece mientras el informe celebra la bajada.\n" +
      "Lo que toca: retirar de alguna entrada, o no añadir.\n",
  );
  process.exit(1);
}

const sobreObjetivo = porTamano.filter(([, v]) => v.palabras > OBJETIVO_SKILL);
if (sobreObjetivo.length > 0) {
  console.log(
    `  ⚠ ${sobreObjetivo.length} por encima del objetivo de ${OBJETIVO_SKILL}: ` +
      sobreObjetivo.map(([n, v]) => `${n} (${v.palabras})`).join(", ") +
      ". No falla, pero es de donde sale el próximo apretón.",
  );
} else {
  // Con todo bajo el objetivo, el consejo útil no es «baja el techo» a secas: eso
  // se quedaría escrito para siempre, incluido el día en que el techo ya está
  // pegado a la entrada mayor. Se publica la holgura real y solo se pide apretar
  // cuando la hay.
  const mayor = porTamano[0]?.[1].palabras ?? 0;
  const holgura = TECHO_SKILL - mayor;
  console.log(
    `✓ Ninguna entrada pasa del objetivo de ${OBJETIVO_SKILL} palabras. ` +
      (holgura > 500
        ? `Al techo (${TECHO_SKILL}) le sobran ${holgura} sobre la mayor (${mayor}): bájalo.`
        : `La mayor mide ${mayor}, a ${holgura} del techo: el trinquete está apretado.`),
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * TERCERA MITAD: ¿SE HA MOVIDO ALGÚN TECHO EN ESTE CICLO? (2026-08-28, P50.72).
 *
 * Las dos de arriba vigilan el DATO contra el umbral. Esta vigila el UMBRAL, que
 * es lo que llevaba nueve días sin nadie apuntado: siete valores en las dos
 * direcciones, margen entre 5 y 442, y una retirada real de 651 palabras que
 * compró 7. Se publica siempre, y se cuenta por techo: dos movimientos del MISMO
 * en un ciclo es la firma de perseguir al dato, y dos de techos distintos puede
 * ser simplemente un ciclo que compactó en dos frentes.
 * ───────────────────────────────────────────────────────────────────────────── */

const TECHOS = [
  { nombre: "documentos", historial: HISTORIAL_TECHO },
  { nombre: "skill (entrada)", historial: HISTORIAL_TECHO_SKILL },
  { nombre: "skills (suma)", historial: HISTORIAL_TECHO_SUMA },
];

const movidos = TECHOS.map((t) => ({
  ...t,
  ciclo: movimientosDelCiclo(t.historial),
}));
const totalMovimientos = movidos.reduce((n, t) => n + t.ciclo.length, 0);

console.log(
  `\ncheck:contexto — techos movidos desde que abrió el ciclo (${CICLO_ABIERTO}): ` +
    `${totalMovimientos} de ${TECHOS.length} vigilados`,
);
for (const t of movidos) {
  for (const m of t.ciclo) {
    console.log(`  ${m.fecha}  ${t.nombre} → ${m.valor} · ${m.motivo}`);
  }
}

const perseguidos = movidos.filter((t) => t.ciclo.length >= 2);
if (perseguidos.length > 0) {
  console.error(
    `\ncheck:contexto — UN TECHO PERSIGUIENDO AL DATO: ` +
      perseguidos
        .map((t) => `«${t.nombre}» se ha movido ${t.ciclo.length} veces`)
        .join(", ") +
      ` en este ciclo.\n\n` +
      "Un trinquete cuyo trinquete se mueve es un termómetro que se repinta. La\n" +
      "medición que abrió esta regla: retirar 651 palabras de verdad subió el margen\n" +
      "de 246 a 253, porque el techo bajó 400 en el mismo commit.\n\n" +
      "Lo que toca NO es un tercer movimiento con mejor motivo: es dejar el techo\n" +
      "quieto un ciclo entero y que el margen suba por trabajo del dato. Si la\n" +
      "conclusión razonada es que estaba mal calibrado desde el principio, vale —\n" +
      "pero entonces se escribe el porqué UNA vez y se deja de tocar.\n",
  );
  process.exit(1);
}

console.log(
  totalMovimientos === 0
    ? "✓ Ningún techo se ha movido en este ciclo: lo que suba el margen lo sube el dato."
    : "  ⚠ Un movimiento por techo es el trinquete apretando. El segundo ya no.",
);
