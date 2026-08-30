/**
 * De un `<main>` prerenderizado a markdown — la mitad pura de `npm run md`.
 *
 * POR QUÉ ES PROPIO Y NO `turndown`. El `<main>` de este sitio emite un conjunto
 * PEQUEÑO Y CONOCIDO de elementos, porque todo sale de la capa de componentes. Eso
 * permite lo que un conversor genérico no hace: **fallar en voz alta ante un
 * elemento que no sabe convertir**, en vez de tirarlo en silencio. Un `<turndown>`
 * que se encuentra una etiqueta rara la ignora y el markdown sale con un agujero
 * que nadie ve; aquí la lista de abajo es un contrato, y una etiqueta nueva rompe
 * el build hasta que alguien decida qué significa. Es la regla de la casa —«afirma
 * cuánto has mirado»— aplicada a un conversor, y el mismo criterio con el que están
 * escritos `indices` y `artefacto-svg`.
 *
 * POR QUÉ EL `<main>` Y NO EL DOCUMENTO. Porque es exactamente el contenido: fuera
 * el nav, el footer y el enlace de salto. Y «un solo `main` por página» ya lo
 * comprueba `check:marco` en las 28 variantes, así que el ancla está vigilada antes
 * de apoyarse en ella (D157).
 *
 * ESTE MÓDULO NO TOCA DISCO NI CONOCE RUTAS. Recibe un elemento y devuelve texto,
 * para que `npm test` pueda ejercitarlo con casos buenos y malos sin build por
 * medio. La E/S vive en `extraer.ts`, misma partición que `tablero/reglas.ts`.
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
const TRANSPARENTES = new Set([
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
const CONTROLES = new Set([
  "button",
  "input",
  "select",
  "option",
  "optgroup",
  "textarea",
  "progress",
  "meter",
]);

const ENFASIS: Record<string, string> = {
  strong: "**",
  b: "**",
  em: "_",
  i: "_",
};

/** Una fila de tabla ya convertida a celdas de texto. */
type Fila = { celdas: string[]; cabecera: boolean };

/**
 * El estado de una conversión. Va en un objeto y no en variables sueltas de módulo
 * porque `extraer.ts` convierte 28 variantes seguidas en el mismo proceso, y un
 * contador de módulo las sumaría todas en la primera.
 */
class Contexto {
  visitados = 0;
  readonly omitidos: Omitido[] = [];
  constructor(readonly base: string) {}

  /** Absolutiza lo interno y deja lo externo como está. */
  href(valor: string): string {
    if (/^(https?:|mailto:|tel:|#)/.test(valor)) return valor;
    return valor.startsWith("/") ? this.base + valor : valor;
  }
}

const limpia = (s: string) => s.replace(/\s+/g, " ");
const bloque = (s: string) => (s.trim() ? `${s.trim()}\n\n` : "");

/** ¿Está oculto para todo el mundo, o es decoración anunciada como tal? */
function esDecorativo(el: Element): boolean {
  return (
    el.getAttribute("aria-hidden") === "true" ||
    el.hasAttribute("data-decorativo")
  );
}

function textoDe(nodo: Node, ctx: Contexto): string {
  if (nodo.nodeType === 3 /* TEXT_NODE */)
    return limpia(nodo.textContent ?? "");
  if (nodo.nodeType !== 1 /* ELEMENT_NODE */) return "";
  return enLinea(nodo as Element, ctx);
}

/**
 * Bloques que pueden aparecer DENTRO de algo en línea. El caso real es la tarjeta
 * pulsable: un `<a>` que envuelve un rótulo, un titular y un pie (§La tarjeta que
 * se pulsa entera, `BRAND.md`). Markdown no sabe meter bloques dentro de un enlace,
 * así que ahí se aplanan, y es la representación honesta: lo que el usuario pulsa
 * es una sola cosa.
 */
const APLANABLES = new Set([
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
const CONTINUA = /^[.,;:!?)\]»…%]/;

/** Abre lo que viene detrás: nunca se le pone separador detrás. */
const ABRE = /[[(«¿¡]$/;

function pega(salida: string, trozo: string, frontera: boolean): string {
  if (!frontera) return salida + trozo;
  if (!trozo.trim()) return salida;
  if (CONTINUA.test(trozo) || ABRE.test(salida)) return salida + trozo;
  return (salida.trim() ? `${salida.trimEnd()} · ` : salida) + trozo.trim();
}

function hijosEnLinea(el: Element, ctx: Contexto): string {
  let salida = "";
  let anterior = false;

  for (const n of el.childNodes) {
    const esElemento = n.nodeType === 1;
    const trozo = textoDe(n, ctx);
    // Lo vacío no cuenta como frontera: un `<span>` que solo lleva un icono no
    // separa su etiqueta de nada.
    if (!trozo) continue;
    // HAY FRONTERA cuando entra un ELEMENTO y no queda ni un espacio entre lo que
    // ya se llevaba y él. Que lo de antes fuera elemento o texto da igual: lo que
    // se recupera es una separación visual, y de eso el tipo de nodo no dice nada
    // —el chip «Exit» iba detrás de texto y salía pegado—. `anterior` se queda
    // para el caso en que el trozo previo se haya emitido ya recortado.
    const trasFrase = /[.!?…]$/.test(salida) && !/^\s/.test(trozo);
    salida = pega(salida, trozo, esElemento && (anterior || trasFrase));
    anterior = esElemento;
  }
  return salida;
}

/**
 * Lo que cabe dentro de una línea: énfasis, enlaces, código, imágenes. Devuelve
 * texto sin saltos, porque quien pone los saltos es el bloque que lo contiene.
 */
function enLinea(el: Element, ctx: Contexto): string {
  const etiqueta = el.tagName.toLowerCase();
  ctx.visitados++;

  if (etiqueta === "svg") {
    ctx.omitidos.push({ familia: "svg", etiqueta });
    return "";
  }
  if (etiqueta === "script" || etiqueta === "style") return "";
  if (esDecorativo(el)) {
    ctx.omitidos.push({ familia: "oculto", etiqueta });
    return "";
  }
  if (CONTROLES.has(etiqueta)) {
    ctx.omitidos.push({ familia: "control", etiqueta });
    // La ETIQUETA de un control sí es contenido: dice qué ofrece la página.
    return limpia(el.textContent ?? "");
  }

  if (etiqueta === "br") return " ";
  // `wbr` es una OPORTUNIDAD de corte, no un corte: en markdown desaparece, y
  // convertirlo en espacio partiría en dos la palabra que existe para no romper.
  if (etiqueta === "wbr") return "";
  if (etiqueta === "code") return `\`${limpia(el.textContent ?? "")}\``;
  if (etiqueta === "time") {
    const iso = el.getAttribute("datetime");
    const visible = hijosEnLinea(el, ctx);
    return iso && iso !== visible ? `${visible} (${iso})` : visible;
  }
  if (etiqueta === "img") {
    const alt = el.getAttribute("alt") ?? "";
    return alt ? `![${alt}](${ctx.href(el.getAttribute("src") ?? "")})` : "";
  }
  if (etiqueta === "a") {
    const texto = hijosEnLinea(el, ctx).trim();
    const destino = el.getAttribute("href");
    if (!texto) return "";
    return destino ? `[${texto}](${ctx.href(destino)})` : texto;
  }

  const marca = ENFASIS[etiqueta];
  if (marca) {
    const texto = hijosEnLinea(el, ctx).trim();
    return texto ? `${marca}${texto}${marca}` : "";
  }

  if (TRANSPARENTES.has(etiqueta)) return hijosEnLinea(el, ctx);
  // Un bloque dentro de algo en línea: se aplana. El separador lo pone
  // `hijosEnLinea` al ver la frontera, no esta rama.
  if (APLANABLES.has(etiqueta)) return hijosEnLinea(el, ctx).trim();

  throw new ElementoDesconocido(
    etiqueta,
    limpia(el.textContent ?? "").slice(0, 80),
  );
}

function celdasDe(fila: Element, ctx: Contexto): Fila {
  const celdas = [...fila.children].map((c) => enLinea(c, ctx).trim() || "—");
  return { celdas, cabecera: fila.querySelector("th") !== null };
}

/** Una tabla markdown, o la nada si no tiene filas. */
function tabla(el: Element, ctx: Contexto): string {
  const filas = [...el.querySelectorAll("tr")].map((f) => celdasDe(f, ctx));
  if (filas.length === 0) return "";
  const ancho = Math.max(...filas.map((f) => f.celdas.length));
  const rellena = (f: Fila) =>
    `| ${[...f.celdas, ...Array(ancho - f.celdas.length).fill("")].join(" | ")} |`;

  const primera = filas[0]!;
  const cuerpo = primera.cabecera ? filas.slice(1) : filas;
  const cabecera = primera.cabecera
    ? rellena(primera)
    : `|${" |".repeat(ancho)}`.replace(/\|$/, "|");
  const caption = el.querySelector("caption");
  const titulo = caption
    ? bloque(`**${limpia(caption.textContent ?? "")}**`)
    : "";

  return (
    titulo +
    bloque(
      [cabecera, `|${" --- |".repeat(ancho)}`, ...cuerpo.map(rellena)].join(
        "\n",
      ),
    )
  );
}

function lista(el: Element, ctx: Contexto, ordenada: boolean): string {
  const puntos = [...el.children]
    .filter((li) => li.tagName.toLowerCase() === "li")
    .map((li, i) => {
      const viñeta = ordenada ? `${i + 1}. ` : "- ";
      const dentro = enBloque(li, ctx).trim().replace(/\n/g, "\n  ");
      return dentro ? `${viñeta}${dentro}` : "";
    })
    .filter(Boolean);
  return puntos.length ? `${puntos.join("\n")}\n\n` : "";
}

/**
 * Lo que ocupa líneas propias. Devuelve markdown terminado en línea en blanco,
 * para que concatenar bloques nunca pegue dos párrafos.
 */
function enBloque(el: Element, ctx: Contexto): string {
  const etiqueta = el.tagName.toLowerCase();
  ctx.visitados++;

  if (etiqueta === "svg") {
    ctx.omitidos.push({ familia: "svg", etiqueta });
    return "";
  }
  if (etiqueta === "script" || etiqueta === "style") return "";
  if (esDecorativo(el)) {
    ctx.omitidos.push({ familia: "oculto", etiqueta });
    return "";
  }

  const nivel = /^h([1-6])$/.exec(etiqueta);
  if (nivel)
    return bloque(`${"#".repeat(+nivel[1]!)} ${hijosEnLinea(el, ctx)}`);
  if (
    etiqueta === "p" ||
    etiqueta === "dt" ||
    etiqueta === "dd" ||
    etiqueta === "figcaption"
  ) {
    return bloque(hijosEnLinea(el, ctx));
  }
  if (etiqueta === "ul") return lista(el, ctx, false);
  if (etiqueta === "ol") return lista(el, ctx, true);
  if (etiqueta === "table") return tabla(el, ctx);
  if (etiqueta === "hr") return "---\n\n";
  if (etiqueta === "pre")
    return bloque(`\`\`\`\n${el.textContent ?? ""}\n\`\`\``);
  if (etiqueta === "blockquote") {
    const dentro = hijosDeBloque(el, ctx).trim();
    return dentro ? `${dentro.replace(/^/gm, "> ")}\n\n` : "";
  }
  if (etiqueta === "li") return hijosDeBloque(el, ctx);

  if (TRANSPARENTES.has(etiqueta) || etiqueta === "main") {
    return hijosDeBloque(el, ctx);
  }
  if (CONTROLES.has(etiqueta) || etiqueta in ENFASIS || etiqueta === "a") {
    ctx.visitados--; // lo vuelve a contar `enLinea`
    return bloque(enLinea(el, ctx));
  }

  throw new ElementoDesconocido(
    etiqueta,
    limpia(el.textContent ?? "").slice(0, 80),
  );
}

/**
 * Los hijos de un contenedor. El texto suelto entre elementos de bloque se
 * recoge como párrafo propio en vez de perderse, que es el agujero clásico de un
 * conversor por etiquetas.
 */
function hijosDeBloque(el: Element, ctx: Contexto): string {
  let salida = "";
  let sueltos = "";
  const vaciar = () => {
    salida += bloque(sueltos);
    sueltos = "";
  };

  // La misma frontera que `hijosEnLinea`, porque el caso que la escribió vive
  // aquí: la cabecera de Hitos son tres `<span>` hermanos colgando de un `div`.
  let anterior = false;
  for (const n of el.childNodes) {
    if (n.nodeType === 3) {
      const texto = limpia(n.textContent ?? "");
      if (texto) {
        sueltos += texto;
        anterior = false;
      }
      continue;
    }
    if (n.nodeType !== 1) continue;
    const hijo = n as Element;
    const etiqueta = hijo.tagName.toLowerCase();
    if (
      etiqueta in ENFASIS ||
      etiqueta === "a" ||
      etiqueta === "code" ||
      etiqueta === "time" ||
      etiqueta === "img" ||
      etiqueta === "br" ||
      etiqueta === "wbr" ||
      etiqueta === "span"
    ) {
      const trozo = enLinea(hijo, ctx);
      if (!trozo) continue;
      sueltos = pega(sueltos, trozo, anterior);
      anterior = true;
      continue;
    }
    vaciar();
    anterior = false;
    salida += enBloque(hijo, ctx);
  }
  vaciar();
  return salida;
}

/**
 * El markdown de un `<main>`. `base` es el origen absoluto (`SITE_URL`) con el que
 * se absolutizan los enlaces internos: un markdown que un agente se lleva a otro
 * contexto no puede tener rutas relativas dentro.
 */
export function convertir(main: Element, base: string): Conversion {
  const ctx = new Contexto(base);
  const markdown = hijosDeBloque(main, ctx)
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return { markdown, visitados: ctx.visitados, omitidos: ctx.omitidos };
}
