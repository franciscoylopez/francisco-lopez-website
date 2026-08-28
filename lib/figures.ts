import { readFileSync, readdirSync } from "node:fs";

import { cardinal, reviewDate } from "./i18n/palabras";
import type { Locale } from "./i18n/config";

/**
 * Las cifras que el artículo publica SOBRE SÍ MISMO, derivadas del disco en vez
 * de tecleadas (P68.495).
 *
 * POR QUÉ EXISTE. La pieza `livestat` del artículo lleva la etiqueta «dato en
 * vivo», y de los tres que había **solo uno lo era**: el del contraste, que
 * interpola `{paginas}` desde `lib/design-values.ts`. Los otros dos eran números
 * escritos a mano dentro de un `value`, y los dos **ya mentían** cuando se
 * leyeron con calma: «siete piezas» con ocho en disco desde que existe
 * `field.tsx`, y «100 escritorio · 94-96 móvil» medido con doce páginas cuando
 * ya había catorce.
 *
 * Y no los encontró ningún guardián, sino una lectura. Es el hueco exacto de
 * `check:articulo`: sus comprobaciones giran alrededor de las dependencias
 * DECLARADAS, y un número tecleado dentro de un `value` no declara nada.
 *
 * LAS TRES CIFRAS NO SE DERIVAN IGUAL, y esa es la parte reutilizable:
 *
 *   · **Piezas del núcleo** y **pasos de CI** se leen del disco al construir. La
 *     verdad está en `components/ui/` y en `.github/workflows/ci.yml`, así que
 *     añadir una pieza o un paso mueve la cifra sin que nadie se acuerde.
 *   · **La nota de PageSpeed no se puede derivar**: medir necesita pintar, y
 *     necesita producción (D49/D99). Así que se SELLA, igual que hace el censo:
 *     `npm run psi -- --registro` deja lo que midió en `content/psi/registro.json`
 *     y el artículo lo lee de ahí. Un número medido sigue siendo un número
 *     medido, pero deja de poder envejecer en silencio, porque llega con su
 *     fecha pegada y el sitio la publica al lado.
 *
 * SE LEE EN BUILD, como `lib/decisions.ts`: las catorce páginas se prerenderizan
 * por locale (D48), así que esto corre en `next build` y nunca en petición. El
 * módulo no se importa desde ninguna isla de cliente.
 */

const PIEZAS_DIR = "components/ui";
const CI_WORKFLOW = ".github/workflows/ci.yml";
export const PSI_REGISTRO = "content/psi/registro.json";

/**
 * Las piezas del NÚCLEO del sistema. Cada archivo de `components/ui/` declara su
 * grupo en su primera línea (`// @pieza núcleo · …`, D89), que es la misma
 * fuente de la que `npm run indices` deriva el inventario y `check:indices`
 * comprueba en cada PR. Aquí se cuenta ese grupo y no todos los archivos: el
 * artículo dice «piezas del sistema», y la capa de artículo quedó fuera del
 * núcleo a propósito (D76).
 */
export function piezasDelNucleo(): number {
  return readdirSync(PIEZAS_DIR).filter((archivo) => {
    if (!/\.tsx?$/.test(archivo)) return false;
    const primera = readFileSync(`${PIEZAS_DIR}/${archivo}`, "utf8");
    return /^\/\/ @pieza\s+núcleo\s+·/m.test(primera);
  }).length;
}

/**
 * Los pasos de integración continua.
 *
 * SE CUENTAN LOS QUE INVOCAN UN SCRIPT DE NPM, no los `- name:` del YAML, y la
 * diferencia no es cosmética: `Install dependencies` es un `- name:` y no es uno
 * de los pasos que el artículo enumera, porque no comprueba nada. La regla
 * («¿corre un `npm run` o un `npm test`?») es la misma que usa una persona al
 * leer el workflow, y por eso no hay que mantener una lista aparte.
 */
export function pasosDeCI(): number {
  const yaml = readFileSync(CI_WORKFLOW, "utf8");
  return [...yaml.matchAll(/^\s*run:\s*(npm (?:run\s+\S+|test))\s*$/gm)].length;
}

/** Lo que dejó escrito la última pasada de `npm run psi -- --registro`. */
export type RegistroPsi = {
  /** El día de la medición, en ISO. */
  fecha: string;
  /** Cuántas páginas se midieron, para que el sello no se lea fuera de escala. */
  paginas: number;
  /** Cuántas tomas hay detrás de cada extremo del rango (P50.78). **Ausente
   *  significa UNA**: es el sello de antes de que el barrido muestreara, y por eso
   *  el campo es opcional en vez de rellenarse con un 1 inventado. */
  tomas?: number;
  movil: { min: number; max: number };
  escritorio: { min: number; max: number };
};

export function registroPsi(): RegistroPsi {
  return JSON.parse(readFileSync(PSI_REGISTRO, "utf8")) as RegistroPsi;
}

const rango = (r: { min: number; max: number }) =>
  r.min === r.max ? String(r.min) : `${r.min}-${r.max}`;

/**
 * Los nombres que el copy puede interpolar. **Es la lista que hace fallar a un
 * token mal escrito**: sin ella, `{psiMovil}` con una l de más se renderiza tal
 * cual, en producción, sin que nada se rompa. Lo comprueba `check:articulo`.
 */
export const FIGURAS = [
  "paginas",
  "piezasNucleo",
  "pasosCI",
  "psiMovil",
  "psiEscritorio",
  "psiFecha",
] as const;

/**
 * Sustituye las cifras derivadas en una cadena de copy, como `fillPages` hace
 * con `{paginas}` y `fillDate` con `{date}`.
 *
 * SE CAPITALIZA LO QUE CAE AL PRINCIPIO, y por eso el copy puede escribir
 * «{piezasNucleo} piezas» sin que salga «ocho piezas» en mitad de una pastilla
 * que empieza frase. La alternativa era guardar dos variantes del cardinal o
 * retorcer la redacción para que el número nunca abriera; las dos son peores que
 * una regla de una línea, escrita en un solo sitio.
 */
/**
 * Aplica una sustitución a TODA cadena de un árbol de datos, sin tocar su forma.
 * El copy del artículo no vive solo en `text`: hay pies de diagrama, etiquetas y
 * valores de `livestat`, y una cifra derivada tiene que poder ir en cualquiera
 * de ellos sin que haya que acordarse de añadir el campo a una lista.
 */
export function rellena<T>(nodo: T, f: (s: string) => string): T {
  if (typeof nodo === "string") return f(nodo) as T;
  if (Array.isArray(nodo)) return nodo.map((hijo) => rellena(hijo, f)) as T;
  if (nodo && typeof nodo === "object") {
    return Object.fromEntries(
      Object.entries(nodo).map(([k, v]) => [k, rellena(v, f)]),
    ) as T;
  }
  return nodo;
}

export function fillFigures(text: string, locale: Locale): string {
  const psi = registroPsi();
  const valores: Record<(typeof FIGURAS)[number], string> = {
    // `{paginas}` lo resuelve `fillPages` antes que esto; se declara aquí para
    // que `check:articulo` lo reconozca como token válido y no lo denuncie.
    paginas: "",
    piezasNucleo: cardinal(piezasDelNucleo(), locale),
    pasosCI: cardinal(pasosDeCI(), locale),
    psiMovil: rango(psi.movil),
    psiEscritorio: rango(psi.escritorio),
    psiFecha: reviewDate(psi.fecha, locale),
  };

  return text.replace(/{(\w+)}/g, (crudo, nombre: string, posicion: number) => {
    if (!(nombre in valores)) return crudo;
    const valor = valores[nombre as (typeof FIGURAS)[number]];
    if (!valor) return crudo;
    return posicion === 0 ? valor[0]!.toUpperCase() + valor.slice(1) : valor;
  });
}
