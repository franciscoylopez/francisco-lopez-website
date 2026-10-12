/**
 * ¿Ha vuelto la raya al copy? — `npm run check:raya`, en CI.
 *
 * POR QUÉ EXISTE. El 2026-08-18 se barrieron 357 rayas (—) del copy servido: la
 * raya doble es una señal visual de que el texto lo ha escrito una IA y, en la
 * mayoría de los casos, no aportaba nada que no dijera una coma. Un barrido sin
 * guardián se deshace solo — y el bloque siguiente («Cómo se ha creado esta
 * página») es el que más copy nuevo escribe del proyecto.
 *
 * MISMO GIRO QUE LA PALETA Y LAS EXPERIENCIAS: se busca la AUSENCIA, no el
 * patrón (D38, luego D54 y D57). Aquí eso es literal — lo que se comprueba es que
 * no quede ninguna raya que no esté explícitamente permitida.
 *
 * QUÉ SE PERMITE, Y POR QUÉ SOLO ESTO:
 *
 *   · EL ORDINAL DE UNA CABECERA (`01 — Rejilla`). Es la convención de la capa de
 *     cabecera (D43), la publica el propio Design System y aparece idéntica en 19
 *     sitios. No es prosa: es el separador de un rótulo numerado.
 *   · LA CELDA «NO APLICA» (una raya sola, `"—"`). Es el signo tipográfico de una
 *     celda vacía en una tabla de datos. Un «·» ahí se leería como un dato.
 *
 * Todo lo demás es prosa, y en prosa la raya se sustituye: dos puntos cuando lo
 * que sigue explica lo anterior, coma cuando solo continúa, punto cuando ya era
 * otra frase, paréntesis cuando el inciso lleva comas dentro, y «·» solo cuando
 * de verdad separa dos etiquetas (`Nav · al cargar`). Los rangos de fecha llevan
 * guion con espacios (`2019 - 2026`), porque el «·» ya es el separador de campos.
 *
 * QUÉ NO MIRA, A PROPÓSITO: los comentarios del código y los documentos del repo
 * (`*.md`). Esto es una regla del COPY QUE SE SIRVE, no del estilo de escribir
 * comentarios ni decisiones. `DECISIONS.md` puede seguir usando la raya.
 *
 * Y AFIRMA CUÁNTO HA MIRADO: imprime archivos y cadenas recorridas. Un guardián
 * que no encuentra nada y calla parece un aprobado, y este repo ya se ha
 * encontrado esa trampa cuatro veces —el medidor fuera de gamut, el umbral por
 * tamaño de texto, los `:hover` del censo y `prettier` sobre rutas ignoradas—.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const RAIZ = process.cwd();

/** Dónde vive el copy que se sirve. */
const DICCIONARIOS = "app/[lang]/dictionaries";

// El copy NO vive solo en el diccionario, y ENUMERAR dónde más vive fue el error: una
// lista de archivos solo cubre los que alguien se acordó de apuntar. Se escapó
// `lib/i18n/system-messages.ts` —el copy de las páginas-sistema, que vive fuera del
// diccionario A PROPÓSITO porque el error boundary es cliente y no puede depender de
// `getDictionary`, que es server-only (D22/D25)— y con él el `<title>` del 404. O sea:
// el guardián no cubría la excepción que el propio sistema tenía documentada.
//
// Así que se RECORREN las fuentes enteras, como hace `check-palette.ts`: un archivo de
// copy nuevo entra solo. `scripts/` queda fuera a propósito — no sirve copy, y las
// rayas de ESTE archivo (la regex del ordinal, los mensajes de error) son código.
const FUENTES = ["app", "components", "lib", "content"];

/** El ordinal de una cabecera numerada: `01 — Rejilla` (D43). */
const ORDINAL = /^\d{2} — /;

/** La celda «no aplica» de una tabla: la raya, sola y nada más. */
const NO_APLICA = /^—$/;

type Hallazgo = { archivo: string; ruta: string; texto: string };

const hallazgos: Hallazgo[] = [];
let archivos = 0;
let cadenas = 0;
let permitidas = 0;

/** Todo `.ts`/`.tsx` bajo FUENTES. Denylist, no allowlist: lo nuevo entra solo. */
function fuentesTs(): string[] {
  const out: string[] = [];
  const baja = (dir: string) => {
    for (const entrada of readdirSync(join(RAIZ, dir), {
      withFileTypes: true,
    })) {
      if (entrada.name.startsWith(".") || entrada.name === "node_modules")
        continue;
      const rel = `${dir}/${entrada.name}`;
      if (entrada.isDirectory()) baja(rel);
      else if (/\.tsx?$/.test(entrada.name)) out.push(rel);
    }
  };
  FUENTES.forEach(baja);
  return out;
}

function jsonsDe(dir: string): string[] {
  const out: string[] = [];
  for (const entrada of readdirSync(dir)) {
    const p = join(dir, entrada);
    if (statSync(p).isDirectory()) out.push(...jsonsDe(p));
    else if (entrada.endsWith(".json")) out.push(p);
  }
  return out;
}

/** Comprueba UNA cadena, descontando lo permitido antes de buscar la raya. */
function revisa(valor: string, ruta: string, archivo: string) {
  cadenas++;
  if (!valor.includes("—")) return;

  if (NO_APLICA.test(valor)) {
    permitidas++;
    return;
  }

  const resto = valor.replace(ORDINAL, () => {
    permitidas++;
    return "";
  });

  if (resto.includes("—")) hallazgos.push({ archivo, ruta, texto: valor });
}

function recorre(valor: unknown, ruta: string, archivo: string) {
  if (typeof valor === "string") return revisa(valor, ruta, archivo);
  if (Array.isArray(valor))
    return valor.forEach((v, i) => recorre(v, `${ruta}[${i}]`, archivo));
  if (valor && typeof valor === "object")
    for (const [k, v] of Object.entries(valor))
      recorre(v, ruta ? `${ruta}.${k}` : k, archivo);
}

// --- Las rutas existen ANTES de recorrer nada. Sin esto, mover el diccionario
//     hace que el check reviente con un stack trace: falla, sí, pero no dice por
//     qué, y «no encuentro la carpeta» y «no hay rayas» tienen que distinguirse.
const perdidas = [DICCIONARIOS, ...FUENTES].filter(
  (p) => !existsSync(join(RAIZ, p)),
);
if (perdidas.length) {
  console.error(
    `check:raya — NO ENCUENTRO EL COPY, así que no ha mirado nada:\n` +
      perdidas.map((p) => `  · ${p}`).join("\n") +
      "\n\nEsto no es «no hay rayas»: es que el check se ha quedado ciego. Si el " +
      "copy\nse ha movido, actualiza las rutas de arriba.",
  );
  process.exit(1);
}

// --- Diccionarios: se recorre el árbol, así que una rama nueva entra sola.
for (const f of jsonsDe(join(RAIZ, DICCIONARIOS))) {
  archivos++;
  const rel = relative(RAIZ, f).replace(/\\/g, "/");
  recorre(JSON.parse(readFileSync(f, "utf8")), "", rel);
}

// --- Fuentes `.ts`/`.tsx`: se leen SOLO los literales entre comillas dobles. Las
//     rayas de los comentarios son código y no cuentan, y las de un TEMPLATE literal
//     tampoco se miran: sin resolver, el ordinal de D43 —que es legal— no se distingue
//     de una raya cualquiera, así que mirarlas inventaría un incumplimiento.
const LITERAL = /"((?:[^"\\]|\\.)*)"/g;
for (const rel of fuentesTs()) {
  archivos++;
  const texto = readFileSync(join(RAIZ, rel), "utf8");
  texto.split("\n").forEach((linea, i) => {
    const sinComentario = linea.replace(/\/\/.*$/, "").replace(/^\s*\*.*$/, "");
    for (const m of sinComentario.matchAll(LITERAL))
      revisa(m[1]!, `L${i + 1}`, rel);
  });
}

// --- Veredicto.
if (archivos === 0 || cadenas === 0) {
  console.error(
    `check:raya — NO HA MIRADO NADA (${archivos} archivos, ${cadenas} cadenas).\n` +
      "Con cero entradas este check aprobaría siempre, así que falla a propósito.\n" +
      `¿Se ha movido ${DICCIONARIOS} o ha cambiado el nombre de los archivos de copy?`,
  );
  process.exit(1);
}

console.log(
  `check:raya — ${archivos} archivos de copy · ${cadenas} cadenas recorridas · ` +
    `${permitidas} rayas permitidas (ordinales de cabecera y celdas «no aplica»)`,
);

if (hallazgos.length) {
  console.error(
    `\ncheck:raya — LA RAYA HA VUELTO AL COPY (${hallazgos.length} ${hallazgos.length === 1 ? "cadena" : "cadenas"}):\n`,
  );
  for (const h of hallazgos)
    console.error(`  ${h.archivo} · ${h.ruta}\n    ${h.texto.slice(0, 160)}\n`);
  console.error(
    "En el copy del sitio no se usa la raya. Dos puntos si lo que sigue explica lo\n" +
      "anterior, coma si solo continúa, punto si ya era otra frase, paréntesis si el\n" +
      "inciso lleva comas dentro, «·» solo entre etiquetas y guion con espacios en un\n" +
      "rango de fechas. Lo único permitido es el ordinal de una cabecera (D43) y la\n" +
      "celda «no aplica» de una tabla.",
  );
  process.exit(1);
}

console.log("✓ Ni una raya en el copy que se sirve.");
