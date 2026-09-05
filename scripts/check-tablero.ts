/**
 * ¿El tablero sigue siendo un orden? — `npm run check:tablero`.
 *
 * POR QUÉ EXISTE. El repo tiene dieciséis gates y ninguno miraba el tablero de
 * Notion, que es donde vive el orden en que se hace todo y la última fuente de
 * verdad del proyecto sin red (D38, D59, D60 y D72 quitaron las otras). El sprint
 * 3 lo demostró dos veces: dos tareas distintas compartiendo la prioridad exacta
 * 69,93 —detectado a mano—, y un orden de ejecución que se saltó cuatro veces una
 * regla que dice literalmente «no se salta una tarea de prioridad menor».
 *
 * DÓNDE CORRE, Y POR QUÉ NO EN CI. Leer el tablero necesita el MCP de Notion, que
 * en un runner headless puede no estar autenticado. Mismo régimen que `censo` y
 * `psi`: comando a demanda. Su sitio natural es el ARRANQUE de sesión, cuando el
 * tablero se lee de todas formas — por eso además de fallar, informa: dice cuál es
 * el sprint activo y qué toca, que es lo que hace que apetezca lanzarlo.
 *
 * Y VIGILA UNA COSA QUE EL TABLERO NO PUEDE CORREGIR SOLO: que `General` —la deuda
 * transversal, que no drena ningún sprint— no crezca. `CLAUDE.md` la drena por
 * cupo, y el cupo NO se puede comprobar: al mover una tarea a un sprint se pierde
 * de qué bloque venía, coste aceptado por escrito antes que una séptima propiedad.
 * Lo que sí se puede medir es el neto contra el cierre anterior, y eso es lo que
 * hace `SELLO_GENERAL` aquí abajo. Menos de lo que la regla pedía; lo máximo que
 * el esquema permite.
 *
 * Y LAS REGLAS NO SE QUEDAN SIN RED POR ESO. Viven aparte, en
 * `scripts/tablero/reglas.ts`, como función pura sin nada de Notion dentro, y las
 * prueba `npm test` en CI con casos buenos y malos. Aquí solo hay E/S e informe.
 *
 * CÓMO SE LE DA DE COMER. El volcado lo hace el agente con el MCP al empezar la
 * sesión, a `scripts/.tablero.json` (ignorado por git a propósito: una foto del
 * tablero versionada sería la segunda fuente de verdad que este guardián existe
 * para evitar). Sin volcado, el comando NO pasa en silencio: sale con código 1
 * diciendo qué falta, porque un guardián que se salta solo es el modo de fallo de
 * todos los de este repo.
 */
import { existsSync, readFileSync, statSync } from "node:fs";

import {
  BLOQUE_TRANSVERSAL,
  EN_EJECUCION,
  medirGeneral,
  revisarTablero,
  type Sello,
  sprintActivo,
  type Tarea,
  VARIACION_ROJA,
} from "./tablero/reglas";

const RUTA = process.argv[2] ?? "scripts/.tablero.json";

/** Más viejo que esto y el verde no dice nada del tablero de hoy. */
const HORAS_FRESCURA = 12;

/**
 * El tamaño de `General` en el último cierre de etapa. Constante fechada y no
 * almacén: es un número que solo cambia cuando se cierra un sprint, así que un
 * archivo de estado sería una segunda fuente de verdad para un dato que se toca
 * tres veces al mes. Mismo régimen que el techo de `check:contexto`.
 *
 * SE ACTUALIZA AL CERRAR UNA ETAPA, no al abrirla y no al pasar por aquí. Si se
 * refrescara solo, la variación sería siempre 0 y el guardián no diría nada.
 *
 * HISTORIAL
 * · 2026-08-28 · cierre de «Home» · 18. La ficha que abrió este guardián medía 34,
 *   +6 netas en un sprint; entre medias, el sprint «Drenaje» se comprometió 16 de
 *   `General` y el embalse bajó a 18. Es el cupo funcionando a lo grande, así que
 *   el primer sello nace bajo a propósito: el próximo cierre se mide contra un
 *   suelo honesto y no contra el máximo histórico.
 * · 2026-08-29 · cierre de «Drenaje» · 19. +1 neto, y el neto es lo que se vigila:
 *   «Drenaje» no arrastró cupo de `General` —su compromiso fue la deuda de las
 *   tandas—, así que lo único que movió el embalse fueron las dos que devolvió al
 *   volverse imposibles (ESLint 10 y TypeScript 7, bloqueadas upstream) y las dos
 *   que dejó el `sprint-review` de cierre. Bajo umbral, pero es la primera vez que
 *   sube: el sprint siguiente tiene que llevarse su cupo de verdad.
 * · 2026-08-30 · cierre de «Voz» · 20. **+1 neto**, mismo signo que «Drenaje» y
 *   por la misma razón: «Voz» tampoco arrastró cupo —su compromiso fue la deuda
 *   de página que un lanzamiento no puede llevarse dentro—, así que el embalse
 *   se movió solo por sus bordes, y los bordes lo llenan más rápido de lo que
 *   lo vacían. **Dos cierres seguidos en ámbar sin haber tocado el cupo ni una
 *   vez.**
 *
 *   Y una trampa que este cierre se comió, escrita para el siguiente: **el sello
 *   se pone DESPUÉS de crear las tareas del propio `sprint-review`, y sobre un
 *   volcado nuevo.** Aquí se selló 18 sobre la foto anterior a escribirlas, o
 *   sea un número que no existió en ningún momento. Un volcado es una foto, no
 *   una consulta.
 * · 2026-08-31 · cierre de «Agentes» · 20. **±0, el primer verde en tres
 *   cierres**, y la aritmética dice por qué en vez de dejarlo en «salió bien»:
 *   «Agentes» **sí** arrastró cupo —cuatro de `General`, que es lo que ni
 *   «Drenaje» ni «Voz» hicieron— y su `sprint-review` devolvió **tres**. 20 − 4
 *   + 3 = 19… y 20, porque el propio cierre añadió además la de Qlty que trajo
 *   Francisco. Cuatro fuera, cuatro dentro.
 *
 *   LO QUE ESTO CONFIRMA, y es lo que hacía falta saber: el cupo **es** la
 *   palanca. Los dos ámbares anteriores no fueron mala suerte ni bordes que
 *   llenan solos; fueron dos sprints que no lo tocaron. En cuanto uno se lleva
 *   sus cuatro, el embalse deja de subir aunque la revisión escriba tres nuevas.
 *
 *   Y LO QUE NO CONFIRMA: ±0 **no es drenar**. El embalse lleva tres cierres
 *   entre 18 y 20 sin bajar, así que el cupo de 3-4 solo alcanza para empatar
 *   con lo que cada revisión encuentra. Bajarlo de verdad pide o un cupo mayor,
 *   o una revisión que retire tareas en vez de solo añadirlas — que es
 *   exactamente lo que el sprint de limpieza tiene que hacer.
 * · 2026-09-01 · cierre de «Distribución» · 23. **+3, el peor de los cuatro
 *   cierres sellados**, y la aritmética vuelve a decir lo mismo que la entrada
 *   anterior predijo: «Distribución» **no arrastró cupo**. Ni una de las trece
 *   tareas que archivó venía de `General` — eran suyas (las nueve piezas de la
 *   serie, el plan, el denominador y el generador de carruseles). Cupo llevado:
 *   **0 de 3-4**. Y su `sprint-review` escribió cuatro, de las que una murió el
 *   mismo día. 20 − 0 + 4 − 1 = 23.
 *
 *   TERCER ÁMBAR EN CUATRO CIERRES, Y LOS TRES SON EL MISMO CASO. «Drenaje»,
 *   «Voz» y «Distribución» no tocaron el cupo y subieron; «Agentes» se llevó
 *   sus cuatro y empató. Ya no es una hipótesis de una muestra: **es la única
 *   variable que se mueve con el signo**. Un sprint de contenido no se lleva
 *   deuda transversal por su cuenta, así que o se le asigna explícitamente al
 *   abrirlo, o el embalse sube.
 *
 *   Y UNA COSA NUEVA, que es la primera vez que pasa: **el cierre RETIRÓ una
 *   tarea**, la de `npm audit fix`, descartada horas después de nacer porque
 *   Dependabot abrió el PR que la resolvía. Es lo que la entrada anterior pedía
 *   («una revisión que retire en vez de solo añadir») y **no cuenta como
 *   prueba**: no la retiró el criterio, la retiró la suerte. Se anota para no
 *   leer el −1 como que el método ya drena.
 *
 * · 2026-09-04 · cierre de «Higiene» · 8. **−15, y es el mayor drenaje de la
 *   serie, pero NO lo hizo el cupo**: «Higiene» absorbió el bloque transversal
 *   entero al abrirse, que es la operación que la entrada anterior decía que
 *   solo cabe una vez. Ya se gastó. De las 23, veintiuna se hicieron dentro del
 *   sprint y dos salieron por la puerta de al lado —ESLint 10 se quedó en
 *   `General` y el `file_download` se fue a `Brand Kit`, que es su sitio—.
 *
 *   LO QUE SUBE SON CUATRO DEL PROPIO `sprint-review`, todas de medición, y el
 *   cupo que las tiene que sacar es el del sprint SIGUIENTE, que aún no existe.
 *   Así que el 8 de hoy no es un suelo estable: es 4 heredadas + 4 recién
 *   escritas, y tres de esas cuatro tienen fecha de caducidad real —el
 *   lanzamiento del 10 de septiembre—, no una prioridad blanda. Si el próximo
 *   cierre las encuentra vivas, el problema no será el embalse: será que el
 *   metro del lanzamiento se quedó sin arreglar y el dato del pico ya no vuelve.
 *
 *   Y LA LECTURA HONESTA DEL −15: este guardián mide el neto, y un neto que baja
 *   por absorción no dice que el método drene. Dice que se movió un embalse de
 *   sitio. La prueba de que el cupo funciona sigue pendiente, y ahora sin la
 *   operación grande disponible para taparlo.
 *
 * · 2026-09-05 · cierre de «Cierre V3» · 1. **−7, y por primera vez en la serie
 *   el signo lo pone el CUPO y no una operación de una sola vez.** «Cierre V3»
 *   se llevó **seis** de `General` al abrirse —el compromiso explícito que las
 *   cuatro entradas anteriores venían pidiendo— y devolvió una (ESLint 10, al
 *   descartarse por cuarta re-verificación). 8 − 6 − 1 = 1.
 *
 *   Y LA OTRA MITAD, que es la que faltaba desde el 2026-08-31: **su
 *   `sprint-review` no añadió NINGUNA a `General`**. No por contenerse: por
 *   ejecutarlas. De los cuatro hallazgos, tres se hicieron dentro del propio PR
 *   de cierre —el copy que enlazaba a una ruta movida, el guardián que faltaba
 *   sobre esa consumidora, y la versión de Node escrita dos veces con valores
 *   distintos— y el cuarto nació en `Lanzamiento`, con fecha, porque necesita el
 *   deploy. Cero netas transversales.
 *
 *   LO QUE ESTO PRUEBA, Y LO QUE NO. Prueba lo que «Higiene» no pudo: que el
 *   embalse baja sin absorber el bloque entero, con la palanca ordinaria. **No
 *   prueba que 1 sea un suelo sostenible** — es el número más bajo de la serie y
 *   lo dejó un cierre que ejecutó en vez de tarear, que no es la operación
 *   normal de un `sprint-review`. Si el próximo vuelve a escribir tres o cuatro,
 *   el 1 sube a 4 sin que nada haya ido mal. El dato a vigilar no es el nivel:
 *   es si el sprint siguiente vuelve a comprometer cupo. */
const SELLO_GENERAL: Sello = {
  fecha: "2026-09-05",
  cierre: "Cierre V3",
  abiertas: 1,
};

/**
 * El volcado llega tal como lo devuelve la consulta del MCP: propiedades con sus
 * nombres de Notion, acentos incluidos. Se normaliza aquí y no en las reglas, para
 * que las reglas no sepan de dónde viene la fila.
 */
type FilaNotion = {
  Nombre?: string;
  Prioridad?: number | null;
  Etapa?: string | null;
  Estado?: string;
  url?: string;
  [clave: string]: unknown;
};

function normalizar(fila: FilaNotion): Tarea {
  return {
    nombre: fila.Nombre ?? "(sin nombre)",
    prioridad: typeof fila.Prioridad === "number" ? fila.Prioridad : null,
    etapa: fila.Etapa ?? null,
    // `Área` con tilde es el nombre real de la propiedad; se acepta `Area` por si
    // el volcado viaja por algún sitio que la pierda.
    area:
      (fila["Área"] as string | null) ??
      (fila["Area"] as string | null) ??
      null,
    estado: fila.Estado ?? "(sin estado)",
    url: fila.url,
  };
}

if (!existsSync(RUTA)) {
  console.error(
    `\ncheck:tablero — no hay volcado en ${RUTA}.\n\n` +
      "No se puede juzgar un tablero que no se ha leído, y dar verde aquí sería el\n" +
      "verde falso que este guardián existe para evitar. Vuelca las tareas abiertas\n" +
      "con el MCP de Notion (SELECT * ... WHERE Estado IN ('To-Do','En progreso',\n" +
      "'Blocked','Sin empezar')) a ese archivo y repite.\n",
  );
  process.exit(1);
}

const horas = (Date.now() - statSync(RUTA).mtimeMs) / 36e5;
if (horas > HORAS_FRESCURA) {
  console.error(
    `\ncheck:tablero — el volcado de ${RUTA} tiene ${horas.toFixed(0)} horas.\n\n` +
      `Por encima de ${HORAS_FRESCURA} no se juzga: un verde sobre una foto vieja\n` +
      "afirma del tablero de hoy algo que no ha mirado. Vuelve a volcarlo.\n",
  );
  process.exit(1);
}

const crudo: unknown = JSON.parse(readFileSync(RUTA, "utf8"));
const filas: FilaNotion[] = Array.isArray(crudo)
  ? (crudo as FilaNotion[])
  : ((crudo as { results?: FilaNotion[] }).results ?? []);

const tareas = filas.map(normalizar);
const activo = sprintActivo(tareas);
const enEjecucion = tareas.filter((t) => EN_EJECUCION.includes(t.estado));
const hallazgos = revisarTablero(tareas, SELLO_GENERAL);
const general = medirGeneral(tareas, SELLO_GENERAL);

// CUÁNTO HA MIRADO, siempre y antes del veredicto. Una lista de hallazgos vacía
// sobre cero tareas parece un aprobado, y en este repo eso ya ha pasado cinco
// veces.
console.log(
  `\ncheck:tablero — ${tareas.length} tarea(s) en el volcado · ` +
    `${enEjecucion.length} en ejecución · sprint activo: «${activo ?? "ninguno"}»`,
);

const siguientes = tareas
  .filter((t) => t.estado === "To-Do" && t.prioridad !== null)
  .sort((a, b) => (a.prioridad as number) - (b.prioridad as number))
  .slice(0, 3);
if (siguientes.length > 0) {
  console.log("  Lo siguiente por prioridad:");
  for (const t of siguientes) {
    console.log(`    P${t.prioridad}  ${t.nombre}`);
  }
}

// EL EMBALSE, siempre y no solo cuando falla. Es la mitad que hacía falta: la
// regla del cupo llevaba un sprint escrita sin instrumento, y una regla que no se
// puede comprobar es una nota.
const signo =
  general.variacion > 0
    ? `+${general.variacion}`
    : `${general.variacion || "±0"}`;
console.log(
  `  · «${BLOQUE_TRANSVERSAL}» ${general.abiertas} abierta(s) · ${signo} ` +
    `desde el cierre de «${general.sello.cierre}» (${general.sello.fecha}: ` +
    `${general.sello.abiertas}) · umbral +${VARIACION_ROJA}` +
    (general.nivel === "ambar" ? " ⚠ sube, aún bajo umbral" : ""),
);

const bloqueadas = tareas.filter((t) => t.estado === "Blocked").length;
if (bloqueadas > 0) {
  // No es un fallo, es el síntoma que se nota antes que la causa: si el número
  // codifica el orden, bloquear es excepcional; si no lo codifica, hay que marcar
  // a mano lo que el número debería decir.
  console.log(
    `  · ${bloqueadas} bloqueada(s) de ${enEjecucion.length} en ejecución.` +
      (bloqueadas * 2 >= enEjecucion.length
        ? " Blocked está haciendo el trabajo de Prioridad."
        : ""),
  );
}

if (hallazgos.length === 0) {
  console.log(
    "✓ Prioridades únicas, estados dentro del sprint activo, Área en todas y el\n" +
      "  embalse transversal sin crecer por encima del umbral.\n",
  );
  process.exit(0);
}

console.error(`\n  ${hallazgos.length} hallazgo(s):\n`);
for (const h of hallazgos) {
  console.error(`  · [${h.regla}] ${h.mensaje}`);
  for (const t of h.tareas) console.error(`      ${t}`);
  console.error("");
}
console.error(
  "El tablero es el orden de ejecución, así que esto no es cosmética: un número\n" +
    "repetido o un estado fuera del sprint hace que «lo siguiente» deje de tener\n" +
    "respuesta. Se arregla en Notion, no aquí.\n",
);
process.exit(1);
