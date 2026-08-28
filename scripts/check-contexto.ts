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

/**
 * Falla por encima de aquí. **Se aprieta conforme se compacta, nunca se afloja.**
 *
 * Historial del techo, que es la prueba de que el trinquete funciona:
 *   16.000  al crearlo (2026-08-19), con 15.466 medidos tras compactar PRD-Live
 *   13.500  el mismo día, al derivar el índice de decisiones (3.610 → 924)
 *   12.500  el 2026-08-22, al BAJAR ese índice a la cabecera de `DECISIONS.md`
 *           (13.494 → 12.224). D88: era el único componente del presupuesto que
 *           crecía por construcción, y contra eso un techo no defiende.
 *   12.400  el mismo día, tras la pasada de retirada sobre `BRAND.md` (12.224 →
 *           11.976, la primera vez que el arranque cabe en el objetivo)
 *   12.200  el 2026-08-24 (12.397 → 11.957), retirando historia fechada y tres
 *           duplicaciones: el inventario de verificación estaba escrito en
 *           `CLAUDE.md`, en la DoD y en `PRD-Live`, y las dos «excepciones vivas»
 *           de `BRAND.md` repetían justificación y condición de salida palabra
 *           por palabra. Ninguna regla se retiró; solo su historia y sus copias.
 *   12.700  el 2026-08-25, y es la PRIMERA vez que el techo SUBE. Decisión de
 *           Francisco en el quinto `method-review`, con el porqué medido abajo.
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
 *   12.300  el 2026-08-27 (P68.5908), y el trinquete vuelve a apretar como su
 *           entrada anterior prometía: la subida a 12.700 quedó atada a que
 *           apareciera el dato, y apareció. La revisión manual (D128) encontró
 *           que el crecimiento no viene de un archivo gordo sino de lluvia fina
 *           sobre los tres, y que el porqué estaba escrito dos veces —en el
 *           documento de reglas y en su D-entry—. Con `PRD-Live` §Cómo se
 *           verifica en tabla de contrato (769 → 542) y el porqué de `CLAUDE.md`
 *           partido a `CLAUDE-historical.md`, y por primera vez la bajada no es
 *           una mudanza —el histórico no se `@`-importa y la suma de skills ya
 *           tiene techo (D129)—.
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
 * escribiendo reglas en vez de un cuarto de sprint retirándolas. Hoy son 253, o
 * sea que el trinquete sigue sin margen y esa deuda está tareada (P68.5909).
 */
const TECHO = 12_300;

/**
 * A dónde se quiere llegar. No falla; solo se publica la distancia. Necesita número
 * nuevo cada vez que se alcanza, porque un objetivo ya cumplido deja de tirar.
 *   12.000  alcanzado el 2026-08-22 y sostenido desde entonces
 *   11.800  desde el 2026-08-24; alcanzado el 2026-08-27 (11.794)
 *   11.600  desde el 2026-08-27, al alcanzarse el anterior. Mismo escalón de 200
 *           que el salto de antes: la cadencia sale de la escalera, no de elegir
 *           un número nuevo cada vez.
 */
const OBJETIVO = 11_600;

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
 * Falla por encima de aquí, POR ENTRADA. **Se aprieta conforme se compacta.**
 *   6.400  al crearlo (2026-08-24), con `design-review` medida en 6.290
 *   4.600  el mismo día (P68.655), tras la retirada sobre `design-review`
 *          (6.290 → 4.499). Ninguna regla se retiró: la Fase 3 pesaba 1.963
 *          palabras reescribiendo el censo que ya está en `BRAND.md` y el axe
 *          que ya lleva `viewport-verifier`, y el filtro mecánico estaba escrito
 *          dos veces seguidas. Ahora la más cara es `method-review`, 2.630.
 */
const TECHO_SKILL = 4_600;

/** A dónde se quiere llegar por entrada: el tamaño del mayor `@`-importado. */
const OBJETIVO_SKILL = 4_500;

/**
 * Falla por encima de aquí, SUMANDO todas las entradas. **Se aprieta conforme se
 * compacta**, igual que el de arriba.
 *   20.500  al crearlo (2026-08-27, P68.5907). Nace en verde, por la misma razón
 *           que los otros dos: un gate que nace en rojo se sube hasta que no
 *           significa nada. Y se sella contra la suma de DESPUÉS de la propia
 *           tarea —20.262, no las 20.203 de antes—, porque actualizar la tabla
 *           de umbrales de `method-review` es parte de ella. Holgura resultante
 *           **238**, que es la magnitud de trabajo que este archivo defiende
 *           para los documentos (240): las tres mitades del presupuesto quedan
 *           igual de apretadas.
 *
 * OJO AL COMPARAR CON EL INFORME que originó esto, que dice 20.616 donde aquí
 * pone 20.203. No es drift ni una medida vieja: **este contador descuenta los
 * bloques de código y el del informe no** (20.688 con ellos, comprobado). El
 * número que gobierna es el de aquí, que es el mismo con el que se miden los
 * documentos — comparar dos corpus con dos varas distintas era la mitad del
 * problema.
 */
const TECHO_SUMA = 20_500;

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
