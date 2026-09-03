/**
 * El criterio: qué cuenta como control, de dónde puede salir su aspecto, y en
 * qué casilla del reparto cae cada uno.
 *
 * EL REPARTO TIENE QUE SUMAR, Y ESO SE COMPRUEBA (2026-08-30, P68.738). La línea
 * publicaba «N controles · M salen de la capa · K marcados como excepción» y las
 * casillas no sumaban: el contador se incrementaba antes de dos `continue` que no
 * contaba nadie, y `marcas.length` cuenta MARCAS en los archivos, no controles
 * que se van por llevar una cerca. Un desglose que PARECE una partición y no lo
 * es invita a suponer que el residuo está bien — la familia del punto 1 de
 * BRAND.md §Cómo se escribe una regla. Por eso hay un contador por salida y una
 * comprobación al final: si algún día se añade una salida sin casilla, el check
 * se cae en vez de publicar un residuo mudo.
 */
import { readFileSync } from "node:fs";

import { raiz, resolverIdentificador } from "./fuentes";

/**
 * De dónde puede salir legítimamente el aspecto de un control.
 *
 * `indexCellVariants` y `railPillVariants` entran el 2026-08-26 con P70.38, y no
 * son dos nombres más: son las dos capas que RETIRAN dos de las cuatro excepciones
 * vivas de `BRAND.md` —la celda del índice y la píldora del riel—, que llevaban su
 * condición de salida escrita desde agosto. Un nombre nuevo aquí es la prueba de
 * que la excepción se cerró, no de que se añadió otra puerta.
 */
const CAPAS = [
  "actionVariants",
  "chromeLinkVariants",
  "badgeVariants",
  "indexCellVariants",
  "railPillVariants",
  "link-chrome",
  "link-content",
  "icon-chrome",
  "video-facade",
];

/**
 * La marca que convierte «escrito a mano» en «excepción documentada». No exige el
 * `//` porque dentro de JSX no se puede: ahí la mitad de los sitios donde hace
 * falta piden `{/* … *\/}`, y una convención que no se puede escribir donde ocurre
 * la cosa es la regla 1 de `BRAND.md` §Cómo se escribe una regla.
 */
export const MARCA = /@fuera-de-capa:\s*([^]+?)\s*\((\d{4}-\d{2}-\d{2})\)/;

/** Lo que cuenta como control. `<a>` sin `href` no navega: es maquetación. */
const ELEMENTO =
  /<(button|a|Link)(\s[^]*?)?>|role=["'](button|switch|tab|link)["']/g;

/**
 * Y lo que cuenta como DECISIÓN DE ASPECTO, que es el corte que ya usa la Fase 1
 * de `design-review`: un `<a>` cuyas clases son solo tipografía o colocación no es
 * un control escrito a mano, es un enlace sin pintar. El enlace del logo del nav es
 * el caso: `inline-flex items-center no-underline` no decide nada que la capa tenga
 * que resolver. Sin este filtro el informe traía ocho de esos y se volvía ruido.
 */
const ASPECTO = /hover:|rounded-|border|bg-|px-|py-|min-h-|min-w-/;

export type Hallazgo = { archivo: string; linea: number; muestra: string };
export type Marca = { archivo: string; motivo: string; fecha: string };

/** La casilla en la que cae un candidato. `null` = no era candidato. */
type Casilla = "capa" | "sinAspecto" | "conMarca" | "sinMarca";

export type Reparto = {
  candidatos: number;
  deLaCapa: number;
  sinAspecto: number;
  conMarca: number;
  sinMarca: Hallazgo[];
  marcas: Marca[];
};

/** Las marcas de un archivo, con el motivo aplanado. */
function marcasDe(texto: string, rel: string): Marca[] {
  const salida: Marca[] = [];
  for (const [, motivo, fecha] of texto.matchAll(new RegExp(MARCA, "g"))) {
    // El motivo puede venir partido en dos líneas de comentario; se aplana para
    // que el informe se lea como una lista y no arrastre los `//` del medio.
    if (motivo && fecha)
      salida.push({
        archivo: rel,
        motivo: motivo.replace(/\s*\n\s*(\/\/|\*)?\s*/g, " ").trim(),
        fecha,
      });
  }
  return salida;
}

/**
 * DOS NIVELES de resolución, y el segundo hacía falta: los chips de descarga del
 * Brand Kit son `cn(cls, …)` donde `cls` es un ternario entre DL_PRIMARY y
 * DL_NEUTRAL, que son quienes llaman a la variante. Con un solo nivel salían como
 * escritos a mano.
 *
 * Y ESTÁ FUERA DEL BUCLE porque ahí dentro era el cuarto nivel de anidamiento de
 * un archivo que ya iba por el quinto.
 */
function resuelveClases(cls: string, archivo: string): string {
  let resuelto = cls;
  for (let nivel = 0; nivel < 2; nivel++) {
    const antes = resuelto;
    for (const id of new Set(
      antes.match(/\b[A-Z][A-Z_0-9]{2,}\b|\b[a-z]\w+\b/g) ?? [],
    )) {
      if (CAPAS.includes(id)) continue;
      resuelto += " " + resolverIdentificador(id, archivo);
    }
    if (resuelto === antes) break;
  }
  return resuelto;
}

/** El aspecto del elemento y el de lo que envuelve, si el suyo no decide nada. */
function conSusHijos(texto: string, inicio: number, resuelto: string): string {
  // EL ELEMENTO QUE RECIBE EL CLIC Y EL QUE ESTÁ PINTADO NO SIEMPRE SON EL MISMO
  // NODO, y esto se descubrió porque el barrido no veía NINGUNA de las dos
  // excepciones que `BRAND.md` sí lista: el switch del consentimiento pinta en un
  // `<span>` hermano de un `<input class="peer sr-only">`, y la píldora del riel
  // de artículo es un `<span>` dentro del `<a>`. Es D104 otra vez —el censo tuvo
  // este mismo problema— y es la razón por la que un metro se valida contra los
  // casos que ya damos por buenos ANTES de creerse sus hallazgos.
  // La ventana de los hijos va SIN comentarios: en el riel, entre el `<a>` y su
  // píldora hay quince líneas de porqué, y un `hover:` citado en prosa no es una
  // decisión de aspecto.
  const ventana = texto
    .slice(inicio, inicio + 1800)
    .split("\n")
    .filter((l) => !/^\s*(\/\/|\*|\{\/\*)/.test(l))
    .join("\n");
  return ASPECTO.test(resuelto) ? resuelto : resuelto + " " + ventana;
}

/** En qué casilla cae ESTE control. Es donde vive el criterio entero. */
function casillaDe(
  texto: string,
  lineas: string[],
  inicio: number,
  archivo: string,
): { casilla: Casilla; linea: number } {
  // La cadena de clases del elemento, y lo que resuelvan sus identificadores.
  const trozo = texto.slice(inicio, inicio + 700);
  const cls = /className=\{?([\s\S]{0,300}?)[}>]\s/.exec(trozo)?.[1] ?? trozo;
  const resuelto = resuelveClases(cls, archivo);
  const linea = texto.slice(0, inicio).split("\n").length;

  if (CAPAS.some((c) => resuelto.includes(c)))
    return { casilla: "capa", linea };

  const conHijos = conSusHijos(texto, inicio, resuelto);

  // Un enlace sin decisión de aspecto, ni suya ni de lo que envuelve, no es un
  // control escrito a mano: es un enlace sin pintar.
  if (!ASPECTO.test(conHijos)) return { casilla: "sinAspecto", linea };
  if (CAPAS.some((c) => conHijos.includes(c)))
    return { casilla: "capa", linea };

  // Sin capa: o lleva marca cerca, o es deriva.
  const contexto = lineas.slice(Math.max(0, linea - 14), linea).join("\n");
  if (MARCA.test(contexto) || MARCA.test(resuelto))
    return { casilla: "conMarca", linea };

  return { casilla: "sinMarca", linea };
}

/** ¿Es este `match` un candidato de verdad, o maquetación / una cita en prosa? */
function esCandidato(
  abre: string,
  lineas: string[],
  texto: string,
  inicio: number,
): boolean {
  // El `<a>` de maquetación no navega y no es un control.
  if (abre.startsWith("<a") && !abre.includes("href")) return false;
  // Ni cuenta un `<button>` citado dentro de un comentario, que es lo que hacía
  // que `action.tsx` —el archivo de las variantes— saliera como incumplidor.
  const lineaTexto =
    lineas[texto.slice(0, inicio).split("\n").length - 1] ?? "";
  const t = lineaTexto.trimStart();
  return !t.startsWith("//") && !t.startsWith("*");
}

export function clasifica(fuentes: string[]): Reparto {
  const r: Reparto = {
    candidatos: 0,
    deLaCapa: 0,
    sinAspecto: 0,
    conMarca: 0,
    sinMarca: [],
    marcas: [],
  };

  for (const archivo of fuentes) {
    const texto = readFileSync(archivo, "utf8");
    const lineas = texto.split("\n");
    const rel = archivo.slice(raiz.length + 1).replaceAll("\\", "/");

    r.marcas.push(...marcasDe(texto, rel));

    for (const m of texto.matchAll(ELEMENTO)) {
      const inicio = m.index ?? 0;
      const abre = m[0];
      if (!esCandidato(abre, lineas, texto, inicio)) continue;
      r.candidatos++;

      const { casilla, linea } = casillaDe(texto, lineas, inicio, archivo);
      if (casilla === "capa") r.deLaCapa++;
      else if (casilla === "sinAspecto") r.sinAspecto++;
      else if (casilla === "conMarca") r.conMarca++;
      else
        r.sinMarca.push({
          archivo: rel,
          linea,
          muestra: abre.replace(/\s+/g, " ").slice(0, 70),
        });
    }
  }

  return r;
}
