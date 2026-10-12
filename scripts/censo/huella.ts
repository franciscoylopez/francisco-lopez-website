/**
 * La huella del censo de contraste — la sella `npm run censo` al pasar en verde,
 * la lee `npm run check:palette` en cada PR.
 *
 * QUÉ PROBLEMA RESUELVE, que no es el de medir. La Definition of Done dice que la
 * accesibilidad heredada **solo se vuelve a medir** si el trabajo introduce un par
 * de color nuevo, un fondo que no sea `--background` o una animación propia. La
 * regla es correcta; el problema es que **leerla es trabajo humano**. El artículo
 * de «Cómo se ha creado esta página» cumplió las tres ramas a la vez y nadie la
 * leyó: cuatro de los ocho hallazgos del `design-review` de P60 tenían su regla
 * escrita **antes de empezar**. Es la regla 2 de `BRAND.md` —una regla que hay que
 * recordar es una regla que se incumple— cobrándose la más cara.
 *
 * POR QUÉ UNA HUELLA Y NO UN AVISO. Las dos salidas obvias no valen: el censo no
 * puede correr en CI —necesita navegador y servidor (D85)— así que no puede
 * bloquear, y un aviso no sirve porque *esto nació precisamente de que nadie leyó
 * una condición*. La tercera vía es la que este repo ya usa dos veces (D60, D84):
 * **se sella lo que ENTRA**. Medir necesita navegador; comprobar si ha cambiado lo
 * que había que medir, no. Así CI **sí** puede ponerse en rojo, y nombrar qué
 * apareció.
 *
 * QUÉ SE SELLA, que son exactamente las tres ramas de la condición:
 *
 *   1. **Los tokens de COLOR** de `:root` y `.dark`. Un par nuevo empieza aquí.
 *      Solo los de color: un radio o un hueco nuevos no mandan a medir contraste.
 *   2. **Las superficies**: los valores de `data-surface` que se usan en el código
 *      y los selectores de `globals.css` que redefinen `--surface-dim`. Es la
 *      rama «un fondo que no sea `--background`» (D39/D61), y es la que se coló.
 *   3. **Las animaciones propias**: los `@keyframes` declarados.
 *
 * LO QUE NO PROMETE. No dice que el sitio cumpla: dice que **lo que el censo midió
 * sigue siendo lo que hay**. Un componente que compone un `color-mix` sin declarar
 * `data-surface` no aparece aquí — pero es que ese caso ya lo prohíbe `BRAND.md`, y
 * lo que este sello hace es que dejar de declararlo tenga consecuencias visibles.
 */
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";

export const HUELLA_PATH = "scripts/censo/censo.huella";

const CSS_PATH = "app/globals.css";
const RAICES = ["components", "app", "lib"];

/** Un valor que pinta color. Un `--radius-lg: 14px` no manda a medir contraste. */
const ES_COLOR = /oklch\(|color-mix\(|#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(/;

/** Los `--x: valor` de un bloque de `globals.css`, sin comentarios ni formateo. */
function propiedades(bloque: string): string[] {
  return [...bloque.matchAll(/--([\w-]+):\s*([^;]+);/g)]
    .map(([, nombre, valor]) => {
      const limpio = (valor ?? "")
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\s+/g, " ")
        .trim();
      return `--${nombre}: ${limpio}`;
    })
    .filter((linea) => ES_COLOR.test(linea))
    .sort();
}

/** El cuerpo de un bloque `selector { … }`, o cadena vacía si no está. */
function bloque(css: string, selector: string): string {
  const start = css.indexOf(selector);
  if (start === -1) return "";
  const open = css.indexOf("{", start);
  const end = css.indexOf("\n}", open);
  return end === -1 ? "" : css.slice(open + 1, end);
}

/**
 * Fuera los comentarios antes de buscar. **Un `data-surface` citado en una
 * explicación no es una superficie**, y tres de los ocho sitios donde aparece el
 * atributo en este repo son prosa (`breadcrumb.tsx`, `article.tsx`, `chrome.tsx`).
 * Hoy no cambiarían el hash —son las mismas familias y entran en un `Set`—, pero
 * un comentario que mencionara una familia nueva pediría un censo que no hace
 * falta, y **un guardián que da falsas alarmas es un guardián que se ignora**.
 * Mismo criterio, y misma implementación, que el barrido de copias de token.
 */
const sinComentarios = (src: string) =>
  src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");

/** Todos los archivos de código bajo las raíces, recursivamente. */
function fuentes(): string[] {
  const salida: string[] = [];
  const recorre = (dir: string) => {
    for (const entrada of readdirSync(dir, { withFileTypes: true })) {
      const ruta = `${dir}/${entrada.name}`;
      if (entrada.isDirectory()) recorre(ruta);
      else if (/\.(tsx?|css)$/.test(entrada.name)) salida.push(ruta);
    }
  };
  for (const raiz of RAICES) if (existsSync(raiz)) recorre(raiz);
  return salida.sort();
}

export type Entrada = {
  /** Tokens de color de los dos temas. */
  tokens: string[];
  /** Familias de superficie declaradas y selectores que redefinen `--surface-dim`. */
  superficies: string[];
  /** `@keyframes` propios. */
  animaciones: string[];
};

export function entradaDelCenso(): Entrada {
  const css = readFileSync(CSS_PATH, "utf8");

  const tokens = [
    ...propiedades(bloque(css, ":root {")).map((l) => `light ${l}`),
    ...propiedades(bloque(css, ".dark {")).map((l) => `dark ${l}`),
  ];

  const superficies = new Set<string>();
  // Las familias que declara el código…
  for (const archivo of fuentes()) {
    const texto = sinComentarios(readFileSync(archivo, "utf8"));
    for (const m of texto.matchAll(/data-surface=["'{]?\s*["']?([\w-]+)/g)) {
      if (m[1]) superficies.add(`familia ${m[1]}`);
    }
  }
  // …y los selectores que de verdad recalculan el atenuado, que es lo que hace
  // que una superficie exista para la capa (D39). Incluye los de ESTADO (D61),
  // que son los que se escaparon: `hover:` no compila al mismo selector.
  for (const linea of css.split("\n")) {
    if (!linea.includes("--surface-dim")) continue;
    superficies.add(`regla ${linea.trim()}`);
  }

  const animaciones = [...css.matchAll(/@keyframes\s+([\w-]+)/g)]
    .map((m) => `keyframes ${m[1]}`)
    .sort();

  return {
    tokens,
    superficies: [...superficies].sort(),
    animaciones,
  };
}

/** El hash de lo que el censo tendría que haber visto. */
export function huella(e: Entrada = entradaDelCenso()): string {
  const h = createHash("sha256");
  for (const grupo of [e.tokens, e.superficies, e.animaciones]) {
    for (const linea of grupo) h.update(linea).update("\n");
    h.update("--\n");
  }
  return h.digest("hex");
}

/** Lo que se publica de una entrada, en una línea. Lo escribe el sello y lo
 *  imprime el check, así que sale de un solo sitio. */
function resumenDe(e: Entrada): string {
  return (
    `${e.tokens.length} tokens de color · ${e.superficies.length} superficies · ` +
    `${e.animaciones.length} animaciones`
  );
}

export type Sello = { hash: string; fecha: string; resumen: string };

export function leerSello(): Sello | undefined {
  if (!existsSync(HUELLA_PATH)) return undefined;
  const [hash, fecha, ...resto] = readFileSync(HUELLA_PATH, "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  if (!hash || !fecha) return undefined;
  return { hash, fecha, resumen: resto.join(" ") };
}

/** Sella la pasada. Lo llama `npm run censo` SOLO si ha terminado en verde. */
export function sellar(fecha: string): Sello {
  const e = entradaDelCenso();
  const sello: Sello = { hash: huella(e), fecha, resumen: resumenDe(e) };
  writeFileSync(
    HUELLA_PATH,
    `${sello.hash}\n${sello.fecha}\n${sello.resumen}\n`,
    "utf8",
  );
  return sello;
}

/** El veredicto sobre el sello: qué falta por medir y cuánto se ha mirado. */
export type Veredicto = {
  problemas: string[];
  /** Señales indexadas. Es la guarda de cero: con cero, esto aprobaría siempre. */
  senales: number;
  /** Lo que hay HOY, en una línea. */
  resumen: string;
  /** La fecha del sello vigente, si lo hay. */
  fecha?: string;
};

/**
 * ¿Ha aparecido algo que el censo no ha visto? Vive aquí, con los datos que
 * mira, y no en el check que lo llama: `check:palette` solo tiene que decidir
 * qué hacer con el veredicto.
 */
export function revisaSello(): Veredicto {
  const e = entradaDelCenso();
  const sello = leerSello();
  const problemas: string[] = [];

  if (!sello) {
    problemas.push(
      `censo: no hay sello en ${HUELLA_PATH}. Córrelo una vez ` +
        "(`npm run build && npm start`, y en otra terminal `npm run censo`).",
    );
  } else if (sello.hash !== huella(e)) {
    problemas.push(
      "censo: la paleta o las superficies han cambiado desde la última pasada\n" +
        `    (sellada el ${sello.fecha} sobre ${sello.resumen}).\n` +
        `    Hoy hay ${resumenDe(e)}.\n` +
        "    Es la condición de re-medir de la DoD, y ya no hay que acordarse de\n" +
        "    leerla: pasa el censo (`npm run build && npm start`, y en otra terminal\n" +
        "    `npm run censo`), que vuelve a sellar. Si la pasada es la buena,\n" +
        "    actualiza también LAST_A11Y_REVIEW en lib/design-values.ts.",
    );
  }

  return {
    problemas,
    senales: e.tokens.length + e.superficies.length + e.animaciones.length,
    resumen: resumenDe(e),
    fecha: sello?.fecha,
  };
}
