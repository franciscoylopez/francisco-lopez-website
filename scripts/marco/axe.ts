import { readFileSync } from "node:fs";

import type { AxeResults, RunOptions } from "axe-core";
import { type DOMWindow } from "jsdom";

import { fallo, reglasEvaluadas, type Pagina } from "./estado";

/**
 * Reglas de axe que en jsdom no significan nada, con QUIÉN las cubre. Se
 * desactivan por nombre y se publican en el informe: una regla silenciada sin
 * decirlo es media medición que parece entera.
 *
 * Las dos primeras familias necesitan pintar (color compuesto, caja medida). Las
 * dos últimas dan «error-occurred» en jsdom —comprobado, no supuesto— y por eso
 * se comprueban A MANO aquí abajo, que además es lo que pide el punto 4 del
 * checklist.
 */
export const DELEGADAS: Record<string, string> = {
  "color-contrast": "necesita pintar → viewport-verifier (D52)",
  "color-contrast-enhanced": "necesita pintar → viewport-verifier (D52)",
  "link-in-text-block": "necesita pintar → viewport-verifier (D52)",
  "target-size": "necesita layout → viewport-verifier (D52)",
  "scrollable-region-focusable": "necesita layout → viewport-verifier (D52)",
  "landmark-one-main": "no concluye en jsdom → se comprueba a mano aquí",
  "page-has-heading-one": "no concluye en jsdom → se comprueba a mano aquí",
};

/**
 * Suelos del metro. No son objetivos: son la línea por debajo de la cual el
 * informe está describiendo otra cosa —un build vacío, un axe que no arrancó, un
 * selector que dejó de casar— y hay que mirarlo en vez de leer el ✓.
 */
export const MINIMO_REGLAS_AXE = 25;

// El código de axe se inyecta DENTRO del realm de jsdom en vez de importarlo
// aquí: axe se cuelga del `window` que encuentra, y el de este proceso no es el
// de la página. Es el patrón que documenta el propio axe para jsdom.
const AXE_SOURCE = readFileSync(require.resolve("axe-core"), "utf8");

const OPCIONES_AXE: RunOptions = {
  rules: Object.fromEntries(
    Object.keys(DELEGADAS).map((id) => [id, { enabled: false }]),
  ),
};

export async function revisarConAxe(
  { doc, variante }: Pagina,
  ventana: DOMWindow,
): Promise<void> {
  ventana.eval(AXE_SOURCE);
  const resultado: AxeResults = await (
    ventana as unknown as {
      axe: { run: (ctx: Document, o: RunOptions) => Promise<AxeResults> };
    }
  ).axe.run(doc, OPCIONES_AXE);

  for (const r of [...resultado.passes, ...resultado.violations]) {
    reglasEvaluadas.add(r.id);
  }
  for (const v of resultado.violations) {
    const donde = v.nodes
      .slice(0, 3)
      .map((n) => n.target.join(" "))
      .join(" · ");
    fallo(
      variante,
      `axe · ${v.id} (${v.impact}, ${v.nodes.length} nodo(s)): ${v.help}. En ${donde}.`,
    );
  }
}

/**
 * Una variante: abre su HTML y le pasa las ocho comprobaciones, en el orden en
 * que se leería la página. Ninguna corta a la siguiente —todas acumulan en
 * `problemas`— porque un informe que se para en el primer fallo obliga a tantas
 * pasadas como fallos haya.
 */
/**
 * Un permalink a una línea de un `.md` de GitHub sin `?plain=1` aterriza en el
 * sitio equivocado, y es la clase de fallo que ningún otro gate puede ver: el
 * enlace EXISTE, resuelve 200 y abre el archivo correcto — solo que por el
 * principio. `check:enlaces` comprueba que responda; nadie comprobaba dónde cae.
 *
 * El hecho es de GitHub, no de este sitio: la vista por defecto de un Markdown
 * es el documento formateado, donde las anclas de línea no existen. Solo la
 * vista de código las tiene, y se pide con `?plain=1`. Con un `.ts` no pasa,
 * porque no tiene vista formateada — así que la regla mira la extensión.
 *
 * Va aquí y no en `check:articulo`, que es quien vigila el artículo, por lo de
 * siempre con el disparador: `check:articulo` corre ANTES del build y estos
 * enlaces solo existen ya compuestos, en el HTML. Y mirándolo aquí la regla
 * cubre además cualquier página futura que cite una línea de un `.md`, no solo
 * el artículo.
 */
