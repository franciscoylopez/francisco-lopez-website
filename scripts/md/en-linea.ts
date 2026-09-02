/**
 * Lo que cabe dentro de una línea: énfasis, enlaces, código, imágenes, y el texto
 * suelto que los separa.
 *
 * LA FRONTERA ES LA REGLA DIFÍCIL de este módulo, no la tabla de etiquetas: dos
 * trozos que en la página se ven separados por una caja no llevan ningún espacio
 * en el DOM, y pegados en markdown se leen como una sola palabra. Por eso
 * `hijosEnLinea` mira si entra un ELEMENTO sin espacio delante, y `pega` decide.
 *
 * No conoce los bloques a propósito: la dependencia va en un solo sentido
 * —`convertir.ts` llama aquí, aquí no se llama allí—, y es lo que permite leer
 * este archivo entero sin salir de él.
 */
import {
  APLANABLES,
  CONTROLES,
  Contexto,
  ElementoDesconocido,
  ENFASIS,
  TRANSPARENTES,
  esDecorativo,
  limpia,
} from "./contrato";

function textoDe(nodo: Node, ctx: Contexto): string {
  if (nodo.nodeType === 3 /* TEXT_NODE */)
    return limpia(nodo.textContent ?? "");
  if (nodo.nodeType !== 1 /* ELEMENT_NODE */) return "";
  return enLinea(nodo as Element, ctx);
}

const CONTINUA = /^[.,;:!?)\]»…%]/;

/** Abre lo que viene detrás: nunca se le pone separador detrás. */
const ABRE = /[[(«¿¡]$/;

export function pega(salida: string, trozo: string, frontera: boolean): string {
  if (!frontera) return salida + trozo;
  if (!trozo.trim()) return salida;
  if (CONTINUA.test(trozo) || ABRE.test(salida)) return salida + trozo;
  return (salida.trim() ? `${salida.trimEnd()} · ` : salida) + trozo.trim();
}

export function hijosEnLinea(el: Element, ctx: Contexto): string {
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
export function omitido(
  el: Element,
  etiqueta: string,
  ctx: Contexto,
): string | null {
  if (etiqueta === "svg") {
    ctx.omitidos.push({ familia: "svg", etiqueta });
    return "";
  }
  if (etiqueta === "script" || etiqueta === "style") return "";
  if (esDecorativo(el)) {
    ctx.omitidos.push({ familia: "oculto", etiqueta });
    return "";
  }
  return null;
}

/**
 * Cómo se escribe cada etiqueta que cabe en una línea. Es una tabla y no una
 * cadena de `if` porque eso es lo que es: una etiqueta, una regla. Lo que NO
 * está aquí lo resuelven, en este orden, los controles, `ENFASIS`,
 * `TRANSPARENTES` y `APLANABLES`.
 */
const EN_LINEA: Record<string, (el: Element, ctx: Contexto) => string> = {
  // El énfasis entra por la misma puerta: es una etiqueta y una regla, solo que
  // las cuatro reglas se escriben solas a partir de su marca.
  ...Object.fromEntries(
    Object.entries(ENFASIS).map(([etiqueta, marca]) => [
      etiqueta,
      (el: Element, ctx: Contexto) => {
        const texto = hijosEnLinea(el, ctx).trim();
        return texto ? `${marca}${texto}${marca}` : "";
      },
    ]),
  ),
  br: () => " ",
  // `wbr` es una OPORTUNIDAD de corte, no un corte: en markdown desaparece, y
  // convertirlo en espacio partiría en dos la palabra que existe para no romper.
  wbr: () => "",
  code: (el) => `\`${limpia(el.textContent ?? "")}\``,
  time: (el, ctx) => {
    const iso = el.getAttribute("datetime");
    const visible = hijosEnLinea(el, ctx);
    return iso && iso !== visible ? `${visible} (${iso})` : visible;
  },
  img: (el, ctx) => {
    const alt = el.getAttribute("alt") ?? "";
    return alt ? `![${alt}](${ctx.href(el.getAttribute("src") ?? "")})` : "";
  },
  a: (el, ctx) => {
    const texto = hijosEnLinea(el, ctx).trim();
    const destino = el.getAttribute("href");
    if (!texto) return "";
    return destino ? `[${texto}](${ctx.href(destino)})` : texto;
  },
};

export function enLinea(el: Element, ctx: Contexto): string {
  const etiqueta = el.tagName.toLowerCase();
  ctx.visitados++;

  const fuera = omitido(el, etiqueta, ctx);
  if (fuera !== null) return fuera;

  if (CONTROLES.has(etiqueta)) {
    ctx.omitidos.push({ familia: "control", etiqueta });
    // La ETIQUETA de un control sí es contenido: dice qué ofrece la página.
    return limpia(el.textContent ?? "");
  }

  const escribe = EN_LINEA[etiqueta];
  if (escribe) return escribe(el, ctx);

  if (TRANSPARENTES.has(etiqueta)) return hijosEnLinea(el, ctx);
  // Un bloque dentro de algo en línea: se aplana. El separador lo pone
  // `hijosEnLinea` al ver la frontera, no esta rama.
  if (APLANABLES.has(etiqueta)) return hijosEnLinea(el, ctx).trim();

  throw new ElementoDesconocido(
    etiqueta,
    limpia(el.textContent ?? "").slice(0, 80),
  );
}
