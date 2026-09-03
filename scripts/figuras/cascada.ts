/**
 * La cascada de la hoja que un lienzo se trae DENTRO — la pieza de
 * `check:figuras` que resuelve el `font-size` cuando no está en ningún atributo.
 *
 * POR QUÉ EXISTE, y es el fallo más silencioso que ha tenido este repo. Los SVG
 * que genera Mermaid no ponen el tamaño en ningún atributo: lo declaran en un
 * `<style>` dentro del `<svg>` y lo dejan heredar desde la raíz. Eso no se ve
 * subiendo por atributos, así que hay que resolver la cascada.
 *
 * Y NO LA RESUELVE `getComputedStyle`, que es lo que se hacía hasta el
 * 2026-08-29: **jsdom no registra un `<style>` que vive dentro de un `<svg>`**
 * —queda en el namespace SVG y `document.styleSheets` sale en 0—, así que
 * devolvía su tamaño POR DEFECTO, 16px, para cualquier lienzo. El artefacto de
 * Emendu declaraba justamente 16, así que su cifra publicada (5,4px) era correcta
 * **por coincidencia**: al re-renderizarlo a 56 el gate siguió diciendo 16 y bajó
 * la cifra a 3,2px, que es cuando se cayó. Un metro que devuelve el valor por
 * defecto se lee igual que uno que mide (`BRAND.md` §Cómo medir, punto 3).
 *
 * Es mínima a propósito —selectores planos, que es todo lo que Mermaid emite—
 * pero es de verdad: recorre del nodo hacia la raíz, y en cada escalón se queda
 * con la regla de mayor especificidad, y a igualdad, con la última. La HERENCIA
 * es el propio recorrido.
 */

/** Una regla de la hoja interna que declara `font-size`, ya puntuada. */
type Regla = { selector: string; px: number; peso: number; orden: number };

/** Se parsea una vez por lienzo: 36 lienzos × 332 rótulos si no. */
const reglasPorLienzo = new WeakMap<Element, Regla[]>();

/**
 * La especificidad de un selector plano, en la cuenta de siempre: ids ×100,
 * clases/atributos/pseudos ×10, tipos ×1. No cubre `:not()` ni combinadores
 * raros porque Mermaid no los emite; si algún día los emite, lo que pasa es que
 * dos reglas empatan y gana la última, que es el desempate correcto de CSS.
 */
function especificidad(sel: string): number {
  const ids = (sel.match(/#[\w-]+/g) ?? []).length;
  const clases = (sel.match(/[.[:][\w-]+/g) ?? []).length;
  const tipos = (sel.match(/(^|[\s>+~])[a-zA-Z][\w-]*/g) ?? []).length;
  return ids * 100 + clases * 10 + tipos;
}

/** Las reglas con `font-size` de la hoja que el lienzo trae dentro. */
function reglasDe(svg: Element): Regla[] {
  const cache = reglasPorLienzo.get(svg);
  if (cache) return cache;

  // Fuera los bloques `@…{…}` (los `@keyframes` de Mermaid): sin esto, partir
  // por `}` deja «selectores» como `from` y una llave suelta.
  let hoja = [...svg.querySelectorAll("style")]
    .map((n) => n.textContent ?? "")
    .join("\n");
  hoja = hoja.replace(/@[\w-]+[^{]*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, "");

  const reglas: Regla[] = [];
  let orden = 0;
  for (const m of hoja.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const px = m[2]?.match(/font-size:\s*([\d.]+)px/);
    if (!px?.[1]) continue;
    const valor = Number(px[1]);
    for (const sel of (m[1] ?? "").split(",")) {
      const s = sel.trim();
      if (s === "") continue;
      reglas.push({
        selector: s,
        px: valor,
        peso: especificidad(s),
        orden: orden++,
      });
    }
  }
  reglasPorLienzo.set(svg, reglas);
  return reglas;
}

/** ¿Le aplica esta regla a este elemento? Un selector que jsdom no sabe leer no
 * puntúa: se descarta en vez de tumbar la medición del lienzo entero. */
function aplica(el: Element, regla: Regla): boolean {
  try {
    return el.matches(regla.selector);
  } catch {
    return false;
  }
}

/** La regla que gana en UN elemento: mayor especificidad y, a igualdad, la
 * última declarada. Es el desempate de CSS, reducido a lo que Mermaid emite. */
function reglaGanadora(el: Element, reglas: Regla[]): Regla | null {
  return reglas.reduce<Regla | null>((mejor, r) => {
    if (!aplica(el, r)) return mejor;
    if (mejor === null) return r;
    if (r.peso > mejor.peso) return r;
    return r.peso === mejor.peso && r.orden > mejor.orden ? r : mejor;
  }, null);
}

/**
 * El `font-size` que la hoja interna le da a este nodo, heredado como lo hereda
 * un navegador: el primer ancestro (él incluido) al que le aplique una regla.
 */
export function porHojaInterna(nodo: Element, svg: Element): number | null {
  const reglas = reglasDe(svg);
  if (reglas.length === 0) return null;

  // La HERENCIA es este recorrido: el primer ancestro (él incluido) al que le
  // aplique una regla es de quien se hereda el tamaño.
  for (let n: Element | null = nodo; n; n = n.parentElement) {
    const ganadora = reglaGanadora(n, reglas);
    if (ganadora) return ganadora.px;
    if (n === svg) break;
  }
  return null;
}
