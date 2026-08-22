/**
 * ¿Sigue siendo cierto «Cómo se ha creado esta página»? — `npm run check:articulo`,
 * en CI. Con `--seal` (`npm run articulo:sellar`), sella en vez de juzgar.
 *
 * EL PORQUÉ, en `content/articulo/dependencias.ts`. EL MÉTODO, en
 * `scripts/articulo/huella.ts`. Aquí, el veredicto y sus cuatro comprobaciones:
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
 *
 * QUÉ HACER CON UN ROJO DE LA 4. Leer la sección que nombra y decidir. Si el
 * texto sigue siendo cierto, `npm run articulo:sellar`. Si no, se corrige el
 * copy ES y EN (D20: el ES es la fuente) y se sella después.
 *
 * POR QUÉ SELLAR VIVE AQUÍ Y NO EN UN SCRIPT APARTE. Porque las tres primeras
 * comprobaciones son PRECONDICIÓN de sellar: sellar sobre una declaración rota
 * congelaría el fallo y lo volvería invisible. `--seal` corre 1, 2 y 3, y solo
 * escribe si pasan. Es el mismo acoplamiento que `npm run artefacto`, donde
 * regenerar y sellar tampoco pueden separarse.
 *
 * Y AFIRMA CUÁNTO HA MIRADO, con su guarda de cero: secciones, dependencias y
 * citas comprobadas. Un metro que devuelve lista vacía parece un aprobado, y
 * este repo se lo ha encontrado cinco veces.
 *
 * LO QUE NO COMPRUEBA, dicho para que no se dé por cubierto: que el párrafo diga
 * la verdad. Detecta que la FUENTE se movió, no que la prosa se haya vuelto
 * falsa. Lo segundo lo decide una persona, y este guardián existe para que sepa
 * cuándo.
 */
import { existsSync, writeFileSync } from "node:fs";

import enArticulo from "../app/[lang]/dictionaries/en/como-se-ha-creado.json";
import esArticulo from "../app/[lang]/dictionaries/es/como-se-ha-creado.json";
import { DEPENDENCIAS, SECCIONES } from "../content/articulo/dependencias";
import { ES_DECISION, lineasDeDecision } from "../lib/decisions";
import {
  HUELLA_PATH,
  huellaDelArticulo,
  leerSello,
  serializar,
} from "./articulo/huella";

const SELLAR = process.argv.includes("--seal");

const problemas: string[] = [];
const fallo = (msg: string) => problemas.push(msg);

const DICCIONARIOS = [
  { dict: esArticulo as unknown, ruta: "es/como-se-ha-creado.json" },
  { dict: enArticulo as unknown, ruta: "en/como-se-ha-creado.json" },
];

type Cita = { label: string; path?: string; line?: number; external?: string };

/** Recoge toda cita del diccionario, viva donde viva dentro del árbol. */
function citas(nodo: unknown, acc: Cita[] = []): Cita[] {
  if (Array.isArray(nodo)) {
    for (const hijo of nodo) citas(hijo, acc);
    return acc;
  }
  if (nodo && typeof nodo === "object") {
    const o = nodo as Record<string, unknown>;
    if (typeof o.label === "string" && (o.path !== undefined || o.external))
      acc.push(o as Cita);
    for (const k of Object.keys(o)) citas(o[k], acc);
  }
  return acc;
}

// ── 1 y 2 · Las citas resuelven, y ninguna guarda su línea ───────────────────

const lineas = lineasDeDecision();
let citasVistas = 0;

for (const { dict, ruta } of DICCIONARIOS) {
  const todas = citas(dict);
  citasVistas += todas.length;

  for (const cita of todas) {
    if (cita.external) continue;
    const destino = cita.path;
    if (!destino) continue;

    if (!existsSync(destino))
      fallo(
        `${ruta}: la cita «${cita.label}» apunta a \`${destino}\`, que ya no existe en el repo.`,
      );

    if (ES_DECISION.test(cita.label) && !lineas.has(cita.label))
      fallo(
        `${ruta}: se cita ${cita.label}, que no tiene cabecera en DECISIONS.md.`,
      );

    if (cita.line !== undefined)
      fallo(
        `${ruta}: la cita «${cita.label}» vuelve a guardar \`line\` a mano. El ancla la ` +
          `deriva \`lib/decisions.ts\` de la cabecera real — una línea escrita es una ` +
          `segunda verdad, y ya desincronizó 27 de 38 citas (el addendum de D26, 2026-08-22).`,
      );
  }
}

// ── 3 · Toda sección del artículo declara dependencias ───────────────────────

const enDiccionario = [
  ...esArticulo.sections.map((s) => s.id),
  esArticulo.closing.id,
];
const declaradas = [...SECCIONES] as string[];

for (const id of enDiccionario)
  if (!declaradas.includes(id))
    fallo(
      `la sección «${id}» existe en el artículo y no declara dependencias en ` +
        `content/articulo/dependencias.ts. Una sección sin declarar nace fuera del guardián.`,
    );

for (const id of declaradas)
  if (!enDiccionario.includes(id))
    fallo(
      `se declaran dependencias de «${id}», que ya no es una sección del artículo.`,
    );

// ── Las dependencias resuelven (precondición de sellar) ──────────────────────

const { sellos, rotas, dependencias } = huellaDelArticulo();

for (const rota of rotas)
  fallo(
    `§${rota.seccion} declara \`${rota.dep}\` y no resuelve: ${rota.motivo}. ` +
      `Corrige la declaración en content/articulo/dependencias.ts.`,
  );

// ── Guarda de cero ───────────────────────────────────────────────────────────

if (citasVistas === 0 || dependencias === 0)
  fallo(
    `el guardián no ha mirado nada (citas: ${citasVistas}, dependencias: ${dependencias}). ` +
      `Un metro que devuelve lista vacía parece un aprobado.`,
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
          `\n\n    Esto NO dice que el texto sea falso: dice que hay que mirarlo. Lee esas\n` +
          `    secciones del diccionario y decide:\n` +
          `      · sigue siendo cierto → \`npm run articulo:sellar\`\n` +
          `      · ya no lo es         → corrige el copy ES y EN (D20) y sella después.`,
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
  writeFileSync(HUELLA_PATH, serializar(sellos), "utf8");
  console.log(
    `Artículo sellado en ${HUELLA_PATH} — ${SECCIONES.length} secciones, ` +
      `${dependencias} dependencias.`,
  );
} else {
  console.log(
    `check:articulo ✓ — ${SECCIONES.length} secciones, ${dependencias} dependencias ` +
      `y ${citasVistas} citas (ES+EN) comprobadas. El sello cuadra.`,
  );
}
