/**
 * Qué es un rótulo y de qué tamaño está declarado — la mitad de `check:figuras`
 * que lee el lienzo. Lo que hace con esa cifra (acotar el peor ancho, juzgar)
 * vive en `ancho.ts` y en el guardián.
 */
import { porHojaInterna } from "./cascada";

/** El número de un `max-w-[540px]` / `@max-[545px]:hidden` / `text-[11px]`. */
export function px(clases: string, patron: RegExp): number | null {
  const m = clases.match(patron);
  return m?.[1] ? Number(m[1]) : null;
}

/**
 * El tamaño declarado de un rótulo, en unidades del lienzo. Hay tres formas de
 * decirlo y este sitio usa las tres: la utilidad de Tailwind en los diagramas
 * propios, y el atributo o el `style` inline en los SVG que genera Mermaid.
 * Se hereda del ancestro más cercano que lo declare, que es como lo resuelve
 * el navegador y como lo escribe Mermaid (un `<g>` con la clase, los `<text>`
 * dentro sin nada).
 *
 * ÚLTIMO RECURSO: LA HOJA QUE EL PROPIO LIENZO SE TRAE, en `cascada.ts`, con el
 * porqué largo de por qué no vale `getComputedStyle`.
 */
export function tamanoRotulo(nodo: Element, svg: Element): number | null {
  for (let n: Element | null = nodo; n; n = n.parentElement) {
    const clases = n.getAttribute("class") ?? "";
    const porUtilidad = px(clases, /text-\[([\d.]+)px\]/);
    if (porUtilidad !== null) return porUtilidad;

    const atributo = n.getAttribute("font-size");
    if (atributo) {
      const v = Number.parseFloat(atributo);
      if (Number.isFinite(v)) return v;
    }

    const inline = n.getAttribute("style") ?? "";
    const porEstilo = inline.match(/font-size:\s*([\d.]+)px/);
    if (porEstilo?.[1]) return Number(porEstilo[1]);

    if (n === svg) break;
  }

  const declarado = porHojaInterna(nodo, svg);
  if (declarado !== null) return declarado;

  return null;
}

/** Los rótulos de un lienzo: `<text>` y las dos formas de meter HTML dentro. */
export function rotulosDe(svg: Element): Element[] {
  return [
    ...svg.querySelectorAll("text"),
    ...svg.querySelectorAll("foreignObject p"),
    ...svg.querySelectorAll("foreignObject span:not(:has(*))"),
  ].filter((n) => (n.textContent ?? "").trim().length > 0);
}

/** El principio del texto de un rótulo, para nombrarlo en el informe. */
export function cita(nodo: Element, corte = 40): string {
  return (nodo.textContent ?? "").trim().slice(0, corte);
}

/** El ancho del `viewBox`, o `null` si el lienzo no declara uno usable. */
export function anchoDelViewBox(svg: Element): number | null {
  const vb = svg.getAttribute("viewBox")?.trim().split(/\s+/);
  const ancho = vb?.length === 4 ? Number(vb[2]) : NaN;
  return Number.isFinite(ancho) && ancho > 0 ? ancho : null;
}
