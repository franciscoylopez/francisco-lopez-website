/**
 * Geometría del logo — fuente única de verdad para el kit descargable.
 *
 * DEBE coincidir con components/ui/logo.tsx. El kit original se dibujó a mano
 * aparte del componente y los dos derivaron: el kit acabó con el viewBox
 * acolchado que el componente ya no usa. Generar el kit desde aquí es lo que
 * impide que vuelva a pasar.
 */

// --- Formas, en unidades del lienzo original de 120x120 ---
const CIRCLE = { cx: 60, cy: 46, r: 26, strokeWidth: 6 };
const BASE = { x: 42, y: 82, width: 36, height: 5, rx: 2.5 };

// Desplazamiento diagonal de las capas de color del split: 5,1% de la altura
// del símbolo. Por debajo de 48px de alto el creciente baja de ~2,5px y deja
// de leerse como capa (BRAND.md, regla 1).
const SPLIT_OFFSET = { cyan: { dx: -3, dy: -2 }, purple: { dx: 3, dy: 2 } };

// --- Colores (BRAND.md). Fijos a propósito: los SVG del kit son portables y
// no dependen de tokens CSS. La versión con tokens vive en el componente. ---
const COLORS = {
  inkLight: "#21262B", // tinta sobre fondo claro
  inkDark: "#F7F3EC", // tinta sobre fondo oscuro
  black: "#000000",
  white: "#FFFFFF",
  cyan: "#16BDBD",
  purple: "#9B87F5",
  bgLight: "#F7F3EC",
  bgDark: "#191D21",
};

// --- Cajas recortadas exactamente a la tinta ---
// Medidas renderizando a 8x y recortando; coinciden con el cálculo analítico.
// El split es 6 unidades más ancho y 2 más alto porque las capas de color
// sobresalen del círculo principal.
const VIEWBOX = {
  symbolFlat: "31 17 58 70",
  symbolSplit: "28 15 64 72",
  lockupFlat: "31 17 466.5 70",
  lockupSplit: "28 15 469.5 72",
};

const WORDMARK_TRANSFORM = "translate(144,74)";

function circle(cx, cy, color) {
  return `<circle cx="${cx}" cy="${cy}" r="${CIRCLE.r}" fill="none" stroke="${color}" stroke-width="${CIRCLE.strokeWidth}"/>`;
}

/**
 * Devuelve las formas del símbolo. `strokeWidth` permite engordar el trazo
 * para el favicon de 16px, donde el grosor normal (8,6% de la altura) cae a
 * 1,4px y el antialiasing lo lava a gris (BRAND.md, regla 2).
 */
function symbolShapes({ ink, split, strokeWidth = CIRCLE.strokeWidth }) {
  const sw = strokeWidth;
  const parts = [];
  if (split) {
    const c = SPLIT_OFFSET.cyan;
    const p = SPLIT_OFFSET.purple;
    parts.push(
      `<circle cx="${CIRCLE.cx + c.dx}" cy="${CIRCLE.cy + c.dy}" r="${CIRCLE.r}" fill="none" stroke="${COLORS.cyan}" stroke-width="${sw}"/>`,
      `<circle cx="${CIRCLE.cx + p.dx}" cy="${CIRCLE.cy + p.dy}" r="${CIRCLE.r}" fill="none" stroke="${COLORS.purple}" stroke-width="${sw}"/>`,
    );
  }
  parts.push(circle(CIRCLE.cx, CIRCLE.cy, ink).replace(/stroke-width="[^"]*"/, `stroke-width="${sw}"`));
  parts.push(
    `<rect x="${BASE.x}" y="${BASE.y}" width="${BASE.width}" height="${BASE.height}" rx="${BASE.rx}" fill="${ink}"/>`,
  );
  return parts.join("\n  ");
}

module.exports = { CIRCLE, BASE, SPLIT_OFFSET, COLORS, VIEWBOX, WORDMARK_TRANSFORM, symbolShapes };
