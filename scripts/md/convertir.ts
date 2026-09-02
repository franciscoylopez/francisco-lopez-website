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

import {
  bloque,
  CONTROLES,
  Contexto,
  ElementoDesconocido,
  ENFASIS,
  TRANSPARENTES,
  limpia,
  type Conversion,
  type Fila,
} from "./contrato";
import { enLinea, hijosEnLinea, omitido, pega } from "./en-linea";

/*
 * DÓNDE ESTÁ CADA MITAD. Desde P72.195 el conversor son tres archivos y no uno:
 * `contrato.ts` (qué etiquetas hay y en qué familia), `en-linea.ts` (lo que cabe
 * en una línea) y esto, que es lo que abre bloque. La partición es la del propio
 * vocabulario del conversor, y la dependencia va en un solo sentido: un bloque
 * puede contener algo en línea, no al revés.
 */

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

/** Un párrafo y ya: solo su contenido en línea. Son cuatro etiquetas distintas. */
const parrafo = (el: Element, ctx: Contexto) => bloque(hijosEnLinea(el, ctx));

/**
 * Cómo se escribe cada etiqueta de bloque, por la misma razón que `EN_LINEA`:
 * una etiqueta, una regla. Los encabezados no están porque son seis y salen de
 * una expresión regular, no de seis entradas.
 */
const EN_BLOQUE: Record<string, (el: Element, ctx: Contexto) => string> = {
  p: parrafo,
  dt: parrafo,
  dd: parrafo,
  figcaption: parrafo,
  ul: (el, ctx) => lista(el, ctx, false),
  ol: (el, ctx) => lista(el, ctx, true),
  table: (el, ctx) => tabla(el, ctx),
  hr: () => "---\n\n",
  pre: (el) => bloque(`\`\`\`\n${el.textContent ?? ""}\n\`\`\``),
  blockquote: (el, ctx) => {
    const dentro = hijosDeBloque(el, ctx).trim();
    return dentro ? `${dentro.replace(/^/gm, "> ")}\n\n` : "";
  },
  li: (el, ctx) => hijosDeBloque(el, ctx),
};

/**
 * Lo que ocupa líneas propias. Devuelve markdown terminado en línea en blanco,
 * para que concatenar bloques nunca pegue dos párrafos.
 */
function enBloque(el: Element, ctx: Contexto): string {
  const etiqueta = el.tagName.toLowerCase();
  ctx.visitados++;

  const fuera = omitido(el, etiqueta, ctx);
  if (fuera !== null) return fuera;

  const nivel = /^h([1-6])$/.exec(etiqueta);
  if (nivel)
    return bloque(`${"#".repeat(+nivel[1]!)} ${hijosEnLinea(el, ctx)}`);

  const escribe = EN_BLOQUE[etiqueta];
  if (escribe) return escribe(el, ctx);

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
 * Lo que, colgando de un contenedor de bloque, se recoge en el párrafo suelto en
 * vez de abrir uno propio. `ENFASIS` va aparte porque es un registro, no un
 * conjunto.
 */
const SUELTOS_EN_LINEA = new Set([
  "a",
  "code",
  "time",
  "img",
  "br",
  "wbr",
  "span",
]);

/**
 * Los hijos de un contenedor. El texto suelto entre elementos de bloque se
 * recoge como párrafo propio en vez de perderse, que es el agujero clásico de un
 * conversor por etiquetas.
 */
function hijosDeBloque(el: Element, ctx: Contexto): string {
  let salida = "";
  const suelto = parrafoSuelto();
  for (const n of el.childNodes) {
    if (n.nodeType === 3) {
      suelto.texto(limpia(n.textContent ?? ""));
      continue;
    }
    if (n.nodeType !== 1) continue;
    const hijo = n as Element;
    const etiqueta = hijo.tagName.toLowerCase();
    if (etiqueta in ENFASIS || SUELTOS_EN_LINEA.has(etiqueta)) {
      suelto.enLinea(enLinea(hijo, ctx));
      continue;
    }
    salida += suelto.cierra() + enBloque(hijo, ctx);
  }
  return salida + suelto.cierra();
}

/**
 * El párrafo que se va formando con lo que cuelga suelto de un contenedor, y que
 * se cierra en cuanto aparece un bloque de verdad.
 *
 * Lleva la misma frontera que `hijosEnLinea`, porque el caso que la escribió vive
 * aquí: la cabecera de Hitos son tres `<span>` hermanos colgando de un `div`.
 */
function parrafoSuelto() {
  let texto = "";
  let anterior = false;
  return {
    texto(trozo: string) {
      if (!trozo) return;
      texto += trozo;
      anterior = false;
    },
    enLinea(trozo: string) {
      if (!trozo) return;
      texto = pega(texto, trozo, anterior);
      anterior = true;
    },
    /** Lo emite como párrafo y se vacía. Sin nada dentro, devuelve la nada. */
    cierra() {
      const salida = bloque(texto);
      texto = "";
      anterior = false;
      return salida;
    },
  };
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
