const round = (n) => Math.round(n * 100) / 100;

/* --- Los helpers de color y de fondo, a nivel de MÓDULO -------------------
 *
 * Estaban dentro de `contrastCensus`, y los usan LOS DOS PASES. Subirlos aquí
 * es lo que permite que el de contornos sea una función hermana y no un trozo
 * de 185 líneas dentro de otra función (P50.84, 2026-08-28). Ninguno cierra
 * sobre estado del censo: todos son función pura de un elemento del DOM.
 */

/** El píxel que el navegador pinta, ya recortado a sRGB. */
function paint(css) {
  const cv = document.createElement("canvas");
  cv.width = cv.height = 1;
  const ctx = cv.getContext("2d", { willReadFrequently: true });
  ctx.fillStyle = css;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
  return [r, g, b, a / 255];
}

/** Alfa sobre un fondo ya opaco. */
const over = (fg, bg) =>
  fg.slice(0, 3).map((c, i) => c * fg[3] + bg[i] * (1 - fg[3]));

/* --- La opacidad, que este censo no miraba (P72.14, 2026-09-02) ------------
 *
 * QUÉ PASABA. El color del texto se leía con `getComputedStyle(el).color` y de la
 * opacidad solo se hacía una cosa: descartar el elemento si valía exactamente 0.
 * **Nunca se componía**, ni por la del elemento ni por la de sus ancestros. Medido
 * sobre `/accesibilidad` en oscuro: un `span` con `opacity: .7` se publicaba a
 * **15,32** —que es el ANCLA, la mejor cifra que el sitio puede dar— cuando la
 * pantalla pintaba **5,97**, por debajo del 7 que le tocaba. No es que el metro se
 * quedara corto: señalaba como mejor par de la página el peor.
 *
 * DÓNDE PARA LA CUENTA, que es la parte que no es obvia. La opacidad de un
 * ancestro que **pinta fondo opaco** no cambia el par: desvanece el fondo y el
 * texto a la vez, así que la razón entre los dos se conserva. La que sí cuenta es
 * la de los ancestros INTERMEDIOS, entre el texto y ese fondo — y la del propio
 * elemento, salvo que sea él quien pinta el fondo. Por eso el bucle sube y se para
 * en el primer fondo opaco, exactamente donde para `backdrop()`.
 *
 * LO QUE NO CUBRE, dicho para que no se dé por cubierto: si un ancestro
 * intermedio tuviera a la vez opacidad y un fondo semitransparente, `backdrop()`
 * seguiría componiendo ese fondo sin desvanecerlo. Hoy no hay ninguno; si lo
 * hubiera, la cifra sería conservadora en el fondo y exacta en el texto.
 */
let compuestosPorOpacidad = 0;
let conOpacidadInspeccionados = 0;

function conOpacidad(el, fg) {
  conOpacidadInspeccionados += 1;
  let o = 1;
  for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
    const cs = getComputedStyle(n);
    if (paint(cs.backgroundColor)[3] === 1) break;
    const v = parseFloat(cs.opacity);
    if (Number.isFinite(v)) o *= v;
  }
  if (o >= 1) return fg;
  compuestosPorOpacidad += 1;
  return [fg[0], fg[1], fg[2], fg[3] * o];
}

const luminance = ([r, g, b]) => {
  const lin = [r, g, b]
    .map((v) => v / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
};

function ratio(fg, bg) {
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  return round((hi + 0.05) / (lo + 0.05));
}
