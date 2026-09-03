/**
 * ¿Sigue siendo cierto «Cómo se ha creado esta página»? — `npm run check:articulo`,
 * en CI. Con `--seal` (`npm run articulo:sellar`), sella en vez de juzgar.
 *
 * EL PORQUÉ, en `content/articulo/dependencias.ts`. EL MÉTODO, en
 * `scripts/articulo/huella.ts`. Aquí, el veredicto y sus seis comprobaciones:
 *
 *   1. **Las citas resuelven.** Toda decisión citada (`D29`) existe en
 *      `DECISIONS.md`, y todo archivo citado sigue en disco. Sin esto, la franja
 *      `ENLACE ·` publica permalinks a ninguna parte.
 *   2. **La línea no ha vuelto al diccionario.** Es la regresión de la capa 1: el
 *      ancla se DERIVA de la cabecera; volver a escribirla a mano reintroduce la
 *      segunda verdad que ya desincronizó 27 de 38 citas.
 *   3. **Toda sección declara dependencias.** El diccionario y
 *      `content/articulo/dependencias.ts` tienen que listar las mismas. Una
 *      sección nueva sin declarar nace fuera del guardián, en silencio — que es
 *      justo el modo de fallo que esto viene a cerrar.
 *   4. **El sello cuadra.** Si una dependencia cambió, sale rojo NOMBRANDO la
 *      sección. No dice que el texto sea falso: dice que hay que mirarlo.
 *   5. **Un «dato en vivo» no está tecleado.** La pieza `livestat` promete eso
 *   5. **La fecha que ve Google.** Si cambia el copy del artículo y
 *      `ARTICLE_UPDATED` no, sale rojo: ese valor alimenta el `dateModified` del
 *      JSON-LD y el `lastmod` del sitemap, y no se pinta en la página, así que
 *      nadie lo nota mirándola (P70.04).
 *      literalmente, y de los tres que había dos eran números a mano que ya
 *      mentían. Su valor tiene que interpolar una cifra derivada, y el token
 *      tiene que existir: uno mal escrito se publica con las llaves puestas
 *      (P68.495).
 *   6. **El diagrama de CI dibuja los pasos que hay, y los reparte igual en los
 *      dos idiomas.** El pie deriva su cifra de `ci.yml` y las pastillas son un
 *      dibujo: sin esto, un paso nuevo movería el pie y dejaría el diagrama
 *      corto, en silencio. Y como los pasos están escritos una vez por idioma
 *      —el patrón de los siete diagramas de este artículo—, se compara además la
 *      FORMA: la etiqueta cambia con el idioma, el grupo y la categoría no.
 *
 * QUÉ HACER CON UN ROJO DE LA 4. `npm run articulo:novedades` dice QUÉ cambió en
 * cada dependencia desde el sello vigente, para no tener que ir a buscarlo
 * (D103). Con eso delante: si el texto sigue siendo cierto,
 * `npm run articulo:sellar`; si no, se corrige el copy ES y EN (D20: el ES es la
 * fuente) y se sella después.
 *
 * POR QUÉ SELLAR VIVE AQUÍ Y NO EN UN SCRIPT APARTE. Porque las tres primeras
 * comprobaciones son PRECONDICIÓN de sellar: sellar sobre una declaración rota
 * congelaría el fallo y lo volvería invisible. `--seal` corre 1, 2 y 3, y solo
 * escribe si pasan. Es el mismo acoplamiento que `npm run artefacto`, donde
 * regenerar y sellar tampoco pueden separarse.
 *
 * Y AFIRMA CUÁNTO HA MIRADO, con su guarda de cero: secciones, dependencias,
 * citas y datos en vivo comprobados. Un metro que devuelve lista vacía parece un aprobado, y
 * este repo se lo ha encontrado cinco veces.
 *
 * LO QUE NO COMPRUEBA, dicho para que no se dé por cubierto: que el párrafo diga
 * la verdad. Detecta que la FUENTE se movió, no que la prosa se haya vuelto
 * falsa. Lo segundo lo decide una persona, y este guardián existe para que sepa
 * cuándo.
 */
import { writeFileSync } from "node:fs";

import { DEPENDENCIAS, SECCIONES } from "../content/articulo/dependencias";
import { revisaCitas } from "./articulo/citas";
import { revisaDiagramaCI } from "./articulo/diagrama-ci";
import { revisaLiveStats } from "./articulo/livestats";
import { revisaSecciones } from "./articulo/secciones";
import {
  HUELLA_PATH,
  huellaDelArticulo,
  huellaDelCopy,
  CLAVE_COPY,
  CLAVE_FECHA,
  leerSello,
  serializar,
} from "./articulo/huella";

const SELLAR = process.argv.includes("--seal");

import { ARTICLE_UPDATED } from "../lib/design-values";

const problemas: string[] = [];
const fallo = (msg: string) => problemas.push(msg);

// ── Las seis comprobaciones, cada una en su módulo ───────────────────────────
//
// Se parten POR SUS PROPIAS COSTURAS, que son las que ya estaban numeradas en la
// cabecera de aquí arriba: lo que decide dónde corta no es la métrica, es cuántas
// cosas distintas hace el archivo (D148/D187). Lo que se queda es el veredicto,
// que es lo único que de verdad no se puede separar del sello.

const { problemas: deCitas, vistas: citasVistas } = revisaCitas();
const { problemas: deLiveStats, vistos: liveStatsVistos } = revisaLiveStats();
const { problemas: deDiagrama, pasos: pasosWorkflow } = revisaDiagramaCI();

for (const p of [
  ...deCitas,
  ...revisaSecciones(),
  ...deLiveStats,
  ...deDiagrama,
])
  fallo(p);

// ── Las dependencias resuelven (precondición de sellar) ──────────────────────

const { sellos, rotas, dependencias } = huellaDelArticulo();

for (const rota of rotas)
  fallo(
    `§${rota.seccion} declara \`${rota.dep}\` y no resuelve: ${rota.motivo}. ` +
      `Corrige la declaración en content/articulo/dependencias.ts.`,
  );

// ── Guarda de cero ───────────────────────────────────────────────────────────

if (citasVistas === 0 || dependencias === 0 || liveStatsVistos === 0)
  fallo(
    `el guardián no ha mirado nada (citas: ${citasVistas}, dependencias: ${dependencias}, ` +
      `datos en vivo: ${liveStatsVistos}). Un metro que devuelve lista vacía parece un aprobado.`,
  );

// ── Sellar, o juzgar ─────────────────────────────────────────────────────────

if (!SELLAR && problemas.length === 0) {
  const sellado = leerSello();

  if (sellado.size === 0) {
    fallo(
      `no hay sello en ${HUELLA_PATH}, así que no se puede saber si el artículo sigue ` +
        `correspondiendo a lo que describe. Sella con \`npm run articulo:sellar\`.`,
    );
  } else {
    const movidas = SECCIONES.filter((s) => sellado.get(s) !== sellos.get(s));
    if (movidas.length)
      fallo(
        `HAN CAMBIADO LAS FUENTES DE ${movidas.length} SECCIÓN(ES) DEL ARTÍCULO:\n\n` +
          movidas
            .map(
              (s) =>
                `      §${s} ${sellado.has(s) ? "" : "(sin sello previo) "}— depende de:\n` +
                DEPENDENCIAS[s].map((d) => `        · ${d}`).join("\n"),
            )
            .join("\n") +
          `\n\n    Esto NO dice que el texto sea falso: dice que hay que mirarlo. Y para\n` +
          `    mirarlo no hace falta abrir los archivos:\n\n` +
          `        npm run articulo:novedades\n\n` +
          `    dice QUÉ líneas cambiaron en cada dependencia desde el sello vigente y\n` +
          `    marca las que son solo comentarios. Con eso delante se decide:\n` +
          `      · sigue siendo cierto → \`npm run articulo:sellar\`\n` +
          `      · ya no lo es         → corrige el copy ES y EN (D20) y sella después.`,
      );
  }
}

// ── La fecha que ve Google ───────────────────────────────────────────────────
//
// `ARTICLE_UPDATED` alimenta el `dateModified` del JSON-LD y el `lastmod` del
// sitemap, y NO SE PINTA EN NINGÚN SITIO: el `ByLine` no lleva fecha, así que no
// hay forma humana de notar que se ha quedado atrás. Solo Google, y tarde. Se
// quedó doce commits congelada en el 21 de agosto mientras el artículo ganaba un
// capítulo entero, y la regla que lo impedía estaba escrita en el comentario de
// la propia constante: una regla que hay que recordar es una regla que se
// incumple (P70.04).
//
// SE MIRA EL COPY, NO LOS SELLOS DE SECCIÓN. Son dos preguntas distintas y
// mezclarlas daría un guardián que nadie lee: que se mueva `DECISIONS.md#D72`
// obliga a RELEER el artículo, no a decirle a Google que el texto cambió.
//
// LA SALIDA PARA LO NO SUSTANTIVO ES `npm run articulo:sellar` sin tocar la
// fecha, y no es una puerta trasera: deja una línea en el diff que alguien firma
// en la revisión. La diferencia con lo de antes es que ahora es una decisión y no
// un olvido.
const copyAhora = huellaDelCopy();
if (copyAhora === undefined)
  fallo(
    `alguna de las fuentes del copy del artículo no existe, así que no se puede ` +
      `sellar su fecha. Revisa \`FUENTES_DEL_COPY\` en scripts/articulo/huella.ts.`,
  );

if (!SELLAR && copyAhora !== undefined && problemas.length === 0) {
  const sellado = leerSello();
  const copySellado = sellado.get(CLAVE_COPY);
  const fechaSellada = sellado.get(CLAVE_FECHA);
  if (
    copySellado !== undefined &&
    copySellado !== copyAhora &&
    fechaSellada === ARTICLE_UPDATED
  ) {
    fallo(
      `EL COPY DEL ARTÍCULO HA CAMBIADO Y \`ARTICLE_UPDATED\` SIGUE EN ${ARTICLE_UPDATED}.\n\n` +
        `    Eso es lo que el sitio le promete a Google en el \`dateModified\` del\n` +
        `    JSON-LD y en el \`lastmod\` del sitemap, y no se pinta en la página,\n` +
        `    así que nadie lo va a notar mirándola.\n\n` +
        `      · fue sustantivo → sube ARTICLE_UPDATED en lib/design-values.ts\n` +
        `      · no lo fue      → \`npm run articulo:sellar\`, que deja el cambio\n` +
        `                         de sello a la vista en el diff`,
    );
  }
}

if (problemas.length) {
  console.error(
    "check:articulo — «Cómo se ha creado esta página» puede haber dejado de ser cierto.\n",
  );
  for (const p of problemas) console.error(`  · ${p}\n`);
  process.exit(1);
}

if (SELLAR) {
  writeFileSync(
    HUELLA_PATH,
    serializar(sellos, copyAhora!, ARTICLE_UPDATED),
    "utf8",
  );
  console.log(
    `Artículo sellado en ${HUELLA_PATH} — ${SECCIONES.length} secciones, ` +
      `${dependencias} dependencias.`,
  );
} else {
  console.log(
    `check:articulo ✓ — ${SECCIONES.length} secciones, ${dependencias} dependencias ` +
      `y ${citasVistas} citas (ES+EN) comprobadas · ${liveStatsVistos} datos en vivo, todos ` +
      `interpolados · ${pasosWorkflow} pasos de CI dibujados · fecha publicada ${ARTICLE_UPDATED}. El sello cuadra.`,
  );
}
