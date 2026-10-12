/**
 * El contrato del conversor: qué etiquetas sabe convertir, cuáles omite y con qué
 * motivo.
 *
 * ESTÁ APARTE PORQUE ES LA PARTE QUE SE DISCUTE. Los dos módulos que lo usan
 * —`en-linea.ts` y `convertir.ts`— son el recorrido, y el recorrido no cambia
 * cuando aparece una etiqueta nueva en el `<main>`: lo que cambia es esta lista, y
 * decidir en qué familia entra es una decisión de contenido, no de algoritmo.
 *
 * Cada conjunto lleva su motivo escrito, y eso es lo que hace que la decisión
 * siguiente no haya que reconstruirla.
 */

/** Lo que el conversor decidió no mirar, para que la corrida lo pueda declarar. */
export type Omitido = {
  /** `svg` · `control` · `oculto` */
  familia: "svg" | "control" | "oculto";
  etiqueta: string;
};

export type Conversion = {
  markdown: string;
  /** Cuántos elementos ha visitado. Una conversión vacía no es un aprobado. */
  visitados: number;
  omitidos: Omitido[];
};

/** El elemento no está en el contrato: se para y se dice cuál y dónde. */
export class ElementoDesconocido extends Error {
  constructor(
    readonly etiqueta: string,
    readonly contexto: string,
  ) {
    super(
      `<${etiqueta}> no está en el contrato del conversor.\n` +
        `  Contexto: ${contexto}\n\n` +
        "Un elemento nuevo en el `<main>` es una decisión, no un caso raro: o se\n" +
        "mapea a markdown en `scripts/md/convertir.ts`, o se declara omitido con su\n" +
        "motivo. Tirarlo en silencio es lo que este conversor existe para no hacer.",
    );
    this.name = "ElementoDesconocido";
  }
}

/**
 * Contenedores sin marca propia en markdown: se atraviesan y se convierte lo que
 * llevan dentro. Que `article` y `section` estén aquí no es que den igual, es que
 * markdown no tiene forma de decirlos; lo que llevan dentro sí se dice.
 */
export const TRANSPARENTES = new Set([
  "div",
  "section",
  "article",
  "header",
  "footer",
  "aside",
  "nav",
  "span",
  "figure",
  "picture",
  "dl",
  "form",
  "fieldset",
  "small",
  "abbr",
  "sup",
  "sub",
  "address",
  "u",
  "s",
  "mark",
  "label",
  "dialog",
  "template",
  "tbody",
  "thead",
  "tfoot",
  "tr",
  "th",
  "td",
  "caption",
  "colgroup",
  "col",
  "source",
  "video",
  "track",
  "noscript",
]);

/** Se pulsan o se rellenan: no son contenido, y se cuentan al declararlos. */
export const CONTROLES = new Set([
  "button",
  "input",
  "select",
  "option",
  "optgroup",
  "textarea",
  "progress",
  "meter",
]);

export const ENFASIS: Record<string, string> = {
  strong: "**",
  b: "**",
  em: "_",
  i: "_",
};

/** Una fila de tabla ya convertida a celdas de texto. */
export type Fila = { celdas: string[]; cabecera: boolean };

/**
 * El estado de una conversión. Va en un objeto y no en variables sueltas de módulo
 * porque `extraer.ts` convierte 28 variantes seguidas en el mismo proceso, y un
 * contador de módulo las sumaría todas en la primera.
 */
export class Contexto {
  visitados = 0;
  readonly omitidos: Omitido[] = [];
  constructor(readonly base: string) {}

  /** Absolutiza lo interno y deja lo externo como está. */
  href(valor: string): string {
    if (/^(https?:|mailto:|tel:|#)/.test(valor)) return valor;
    return valor.startsWith("/") ? this.base + valor : valor;
  }
}

export const limpia = (s: string) => s.replace(/\s+/g, " ");
export const bloque = (s: string) => (s.trim() ? `${s.trim()}\n\n` : "");

/** ¿Está oculto para todo el mundo, o es decoración anunciada como tal? */
export function esDecorativo(el: Element): boolean {
  return (
    el.getAttribute("aria-hidden") === "true" ||
    el.hasAttribute("data-decorativo")
  );
}

/**
 * Bloques que pueden aparecer DENTRO de algo en línea. El caso real es la tarjeta
 * pulsable: un `<a>` que envuelve un rótulo, un titular y un pie (§La tarjeta que
 * se pulsa entera, `BRAND.md`). Markdown no sabe meter bloques dentro de un enlace,
 * así que ahí se aplanan, y es la representación honesta: lo que el usuario pulsa
 * es una sola cosa.
 */
export const APLANABLES = new Set([
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "li",
  "ul",
  "ol",
  "dt",
  "dd",
  "figcaption",
  "blockquote",
]);

/**
 * DOS TROZOS PEGADOS SIN UN ESPACIO EN MEDIO ESTABAN SEPARADOS POR CSS, NO POR
 * PROSA. Es la única señal que el HTML deja de una separación que la hacía la
 * hoja de estilos, y sin ella el markdown pega dos rótulos en una palabra que no
 * existe: medido en el prerender, «Correo» + el email salían como
 * `Correofranciscojavier…`, y la cabecera de Hitos como `NombreImpactoAño`.
 *
 * LA PRIMERA VERSIÓN MIRABA LA ADYACENCIA DE ELEMENTOS Y ESO ERA UN METRO MAL
 * CALIBRADO *(P68.8)*. Decía —y lo dejó escrito— que «en prosa no se dispara,
 * porque React emite el espacio entre palabras como nodo de TEXTO». La premisa
 * era falsa en este sitio: `ui/rich.tsx` y `ui/article.tsx` envolvían cada tramo
 * de texto plano en un `<span>` que solo llevaba la `key`, así que en prosa lo
 * NORMAL era «elemento pegado a elemento». Resultado: **391 « · » metidos en
 * medio de frases** del markdown que leen los agentes. Los dos envoltorios ya son
 * fragmentos, y con eso la premisa vuelve a ser cierta; esto es la otra mitad.
 *
 * Y SE AÑADE UN SEGUNDO DISPARO, ESTRECHO, porque el caso espejo existía y nadie
 * lo veía: el chip «Exit» va detrás de un nodo de TEXTO («Adquirida por
 * AppRadar.») separado por un `ml-2`, así que la regla de adyacencia no lo tocaba
 * y salía `AppRadar.Exit`. Es el mismo `Correofranciscojavier…` por el otro lado.
 * El disparo es **un elemento que entra justo después de un final de frase**
 * (`.!?…`) sin un espacio en medio.
 *
 * ESTRECHO PORQUE LO ANCHO SE PROBÓ Y ROMPÍA. La primera versión disparaba
 * siempre que faltara el espacio, del tipo que fuera el nodo anterior, y medida
 * sobre las 28 variantes **inventaba separadores nuevos**: `+ · 28%` en la cifra
 * de Hitos —el `+` es texto y el contador un elemento— y `palabras · · ·` en la
 * cabecera del artículo. Con el disparo atado a un final de frase, el diff sobre
 * las 28 es **exactamente las dos líneas del chip y nada más**. Es la regla de
 * validar el metro antes de creérselo, aplicada al propio arreglo.
 *
 * Y LLEVA DOS GUARDAS: un trozo que EMPIEZA por signo de continuación
 * (`, . : ) »`) continúa la frase anterior, y uno que TERMINA en signo de
 * apertura (`( « ¿`) abre la siguiente. En ninguno hubo separación que recuperar.
 */

/** Continúa la frase de antes: nunca se le pone separador delante. */
