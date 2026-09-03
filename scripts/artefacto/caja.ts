/**
 * El `viewBox` del artefacto: el que trae el SVG si lo trae, y solo si no, el
 * que hay que deducir recorriendo el dibujo.
 */

/** Un punto acumulable. Las tres formas que emite Mermaid dan una lista de estos. */
type Punto = { x: number; y: number };

/**
 * Los puntos que aporta UNA forma, ya trasladados por la pila de `<g>`.
 *
 * Está fuera del recorrido porque son dos cosas distintas: la pila de
 * traslaciones es estructura del SVG, y esto es la geometría de cada primitiva.
 */
/** El número de un atributo, o `NaN` si no está. */
const atributo = (attrs: string, k: string) =>
  Number(new RegExp(`${k}="(-?[0-9.]+)"`).exec(attrs)?.[1] ?? NaN);

function puntosDeRect(attrs: string, t: Punto): Punto[] {
  const w = atributo(attrs, "width");
  const h = atributo(attrs, "height");
  if (!Number.isFinite(w) || !Number.isFinite(h)) return [];
  const x = atributo(attrs, "x");
  const y = atributo(attrs, "y");
  const x0 = (Number.isFinite(x) ? x : 0) + t.x;
  const y0 = (Number.isFinite(y) ? y : 0) + t.y;
  return [
    { x: x0, y: y0 },
    { x: x0 + w, y: y0 + h },
  ];
}

function puntosDeCirculo(attrs: string, t: Punto): Punto[] {
  const r = atributo(attrs, "r");
  if (!Number.isFinite(r)) return [];
  const cx = atributo(attrs, "cx");
  const cy = atributo(attrs, "cy");
  const x0 = (Number.isFinite(cx) ? cx : 0) + t.x;
  const y0 = (Number.isFinite(cy) ? cy : 0) + t.y;
  return [
    { x: x0 - r, y: y0 - r },
    { x: x0 + r, y: y0 + r },
  ];
}

function puntosDeRuta(attrs: string, t: Punto): Punto[] {
  const d = /\sd="([^"]+)"/.exec(attrs)?.[1] ?? "";
  return [...d.matchAll(/(-?[0-9.]+)[, ](-?[0-9.]+)/g)].map((p) => ({
    x: Number(p[1]) + t.x,
    y: Number(p[2]) + t.y,
  }));
}

const POR_FORMA: Record<string, (attrs: string, t: Punto) => Punto[]> = {
  rect: puntosDeRect,
  circle: puntosDeCirculo,
  path: puntosDeRuta,
};

function puntosDeForma(tag: string, attrs: string, t: Punto): Punto[] {
  return POR_FORMA[tag]?.(attrs, t) ?? [];
}

/** El desplazamiento que aporta un `<g>` que abre, sobre el que ya había. */
function traslacion(attrs: string, t: Punto): Punto {
  const tr = /transform="translate\((-?[0-9.]+)[, ]\s*(-?[0-9.]+)\)"/.exec(
    attrs,
  );
  return tr
    ? { x: t.x + Number(tr[1]), y: t.y + Number(tr[2]) }
    : { x: t.x, y: t.y };
}

/** La caja que encierra una lista de puntos, ignorando lo que no sea finito. */
function encierra(puntos: Punto[]) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const { x, y } of puntos) {
    if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }
  const M = 28; // margen, para que el trazo de los bordes no se corte
  return {
    x: Math.round(minX - M),
    y: Math.round(minY - M),
    w: Math.round(maxX - minX + M * 2),
    h: Math.round(maxY - minY + M * 2),
  };
}

/**
 * La caja del grafo, recorriendo el SVG y ACUMULANDO LOS `translate` de los
 * grupos que envuelven cada forma.
 *
 * La primera versión no lo hacía y por eso salió corta: en Mermaid las cajas de
 * los CLUSTER llevan coordenadas absolutas, pero las de los NODOS van centradas
 * en el origen (`x="-68" y="-22"`) dentro de un `<g transform="translate(cx,cy)">`.
 * Leyendo el `rect` sin su grupo, un nodo que vive en y=1.400 se contabilizaba
 * como si estuviera en y=-22 — así que el alto salió 1.203 cuando el dibujo mide
 * bastante más, y la última banda quedaba fuera del `viewBox` y la recortaba el
 * `overflow-hidden` del panel. Se vio en pantalla, no en el código: el SVG lleva
 * `overflow:visible`, así que pintaba fuera de su caja sin quejarse.
 */
function cajaDelGrafo(fuente: string) {
  // Pila de traslaciones: se apila al abrir un `<g>` y se desapila al cerrarlo.
  const pila: Punto[] = [{ x: 0, y: 0 }];
  const puntos: Punto[] = [];

  for (const m of fuente.matchAll(/<(\/?)(g|rect|path|circle)\b([^>]*)>/g)) {
    const [, cierre, tag, attrs = ""] = m;
    const t = pila[pila.length - 1] ?? { x: 0, y: 0 };

    if (tag === "g") {
      // Los `<g/>` autocerrados no llegan aquí; Mermaid no los emite.
      if (cierre && pila.length > 1) pila.pop();
      else if (!cierre) pila.push(traslacion(attrs, t));
      continue;
    }

    for (const p of puntosDeForma(tag ?? "", attrs, t)) puntos.push(p);
  }

  return encierra(puntos);
}

/**
 * La caja que se publica: **la del propio SVG si la trae**, y solo si no, la
 * calculada.
 *
 * POR QUÉ, y es un fallo que costó ver (2026-08-18). `cajaDelGrafo` existe porque
 * el export de mermaid.live **no traía `viewBox`**: había que deducirlo. El de
 * `mermaid-cli` sí lo trae, y es autoritativo —lo calcula Mermaid, que es quien
 * ha colocado cada nodo—. Recalcularlo encima daba una caja **un 40% más ancha y
 * un 55% más alta** que el dibujo (3070×2692 frente a 2192×1742), así que el
 * grafo ocupaba dos tercios de su propio lienzo: en la página se veía **al 40%
 * de escala, ilegible, y con la mitad del panel vacía**.
 *
 * No lo cazó nada automático —el SVG era válido, los colores correctos y el
 * guardián de literales pasaba— sino mirar la página. El `viewBox` es de las
 * pocas cosas de un SVG que no se pueden verificar sin verlo.
 */
export function cajaPublicada(svg: string) {
  const propio =
    /viewBox="\s*([\d.+-]+)\s+([\d.+-]+)\s+([\d.+-]+)\s+([\d.+-]+)\s*"/.exec(
      svg,
    );
  return propio
    ? {
        x: Math.round(Number(propio[1])),
        y: Math.round(Number(propio[2])),
        w: Math.round(Number(propio[3])),
        h: Math.round(Number(propio[4])),
      }
    : cajaDelGrafo(svg);
}
