/**
 * LA MITAD IN-PAGE DE LA MEDICIÓN SOBRE IMAGEN (P72.13, 2026-09-02).
 *
 * `contrastCensus` manda estos pares a `sinMedir` y hace bien: sobre una foto no
 * hay UN color detrás del texto, hay tantos como píxeles, y con `backdrop-blur`
 * de por medio el color efectivo ni siquiera está en el DOM — lo calcula el
 * compositor. No hay forma de rasterizar desde JavaScript lo que hay detrás de un
 * elemento.
 *
 * Lo que sí puede hacerse desde aquí es **preparar la foto**: decir cuáles son,
 * dónde caen, de qué color es su texto ya pintado y cuál es su umbral. Recortar el
 * píxel y sacar el peor es trabajo del conductor, que sí tiene captura de pantalla
 * (`scripts/censo/sobre-imagen.ts`).
 *
 * TRES COSAS QUE NO SE VEN Y SON LA MITAD DE ESTE BLOQUE:
 *
 * 1. **La clave es estable entre tomas, y el índice NO.** El nav sobre una foto
 *    solo existe cuando la página se ha desplazado, así que hay que mirar a
 *    varias alturas; si cada toma renumerase, el peor caso de una acabaría
 *    atribuido a otro elemento. La clave es el elemento, no el orden.
 * 2. **Se retiran de la foto los elementos ****`fixed`**** que tapan**, y el caso
 *    que lo escribió es el diálogo de consentimiento: pinta `bg-card` OPACO sobre
 *    el hero de Sobre mí, así que al ocultar el titular la cámara leía la tarjeta
 *    blanca y devolvía **1,04:1** sobre un par que no tiene nada que ver. Es el
 *    mismo falso positivo que ya tuvo `overImage` en 2026-08-22, por el otro lado.
 *    Un `fixed` que CONTIENE al elemento medido no se toca: el nav es `sticky` y
 *    es justo uno de los que hay que medir.
 * 3. **`ocultar()` usa `visibility: hidden` y no `display: none`**, porque hace
 *    falta que el elemento SIGA ocupando su caja: lo que se va a fotografiar es
 *    exactamente lo que hay debajo de esa caja.
 */
const CLAVE_SOBRE_IMAGEN = (el, px) =>
  `${label(el)}|${(el.textContent || "").trim().slice(0, 24)}|${px}`;

/**
 * La caja de las LETRAS, no la del elemento.
 *
 * POR QUÉ IMPORTA, y es la diferencia entre encontrar un hallazgo e inventarlo.
 * Un enlace del nav tiene 44px de alto por el suelo táctil y su texto ocupa 17:
 * el resto es relleno, y por ahí asoma la foto. Midiendo la caja del elemento, el
 * «peor píxel» salía de una zona donde no hay ninguna letra que leer — y con eso
 * el nav de `/trayectoria/kuotip` puntuaba **4,60:1** cuando ninguna de sus letras
 * cae ahí. WCAG 1.4.3 pide el contraste del TEXTO contra su fondo, así que lo que
 * hay que fotografiar es dónde están los glifos.
 *
 * Se saca con un `Range` sobre los nodos de texto PROPIOS del elemento —los
 * mismos que `paintsText` exige— y la unión de sus rectángulos de línea. Sigue
 * siendo conservador: dentro de una línea hay huecos entre letras que no se
 * descuentan, y ahí se prefiere pasarse a quedarse corto.
 */
function cajaDelTexto(el) {
  const rango = document.createRange();
  let u = null;
  for (const n of el.childNodes) {
    if (n.nodeType !== 3 || !n.textContent.trim()) continue;
    rango.selectNodeContents(n);
    for (const r of rango.getClientRects()) {
      if (r.width === 0 || r.height === 0) continue;
      u = u
        ? {
            left: Math.min(u.left, r.left),
            top: Math.min(u.top, r.top),
            right: Math.max(u.right, r.right),
            bottom: Math.max(u.bottom, r.bottom),
          }
        : { left: r.left, top: r.top, right: r.right, bottom: r.bottom };
    }
  }
  if (!u) return null;
  return {
    left: u.left,
    top: u.top,
    right: u.right,
    bottom: u.bottom,
    width: u.right - u.left,
    height: u.bottom - u.top,
  };
}

/**
 * ¿Este `fixed` se interpone entre la cámara y la caja que se va a medir? El
 * solape lo decide `solapan`, en `03-fondo.js`: esta comprobación estaba escrita
 * dos veces con los mismos cuatro términos (P72.195).
 */
function tapaFijo(n, cajas) {
  const cs = getComputedStyle(n);
  if (cs.position !== "fixed") return false;
  if (cs.visibility === "hidden" || cs.display === "none") return false;
  const r = n.getBoundingClientRect();
  if (r.width === 0 || r.height === 0) return false;
  return cajas.some(({ el, rect }) => !n.contains(el) && solapan(r, rect));
}

window.ocultarSobreImagen = () => {
  const textos = document.querySelectorAll("[data-sobre-imagen]");
  for (const el of textos) el.style.visibility = "hidden";
  const fijos = document.querySelectorAll("[data-tapa-la-foto]");
  for (const el of fijos) el.style.visibility = "hidden";
  void document.body.offsetHeight;
  return { textos: textos.length, fijos: fijos.length };
};

/**
 * Devuelve la página a como estaba, y **NO desmarca**: las marcas las retira la
 * llamada siguiente a `paresSobreImagen()`. Desmarcar aquí fue un fallo real y
 * silencioso: de una sola detección salen varias tomas —los fotogramas del
 * vídeo—, así que a partir de la segunda el diálogo de consentimiento volvía a
 * estar en la foto y su tarjeta blanca ganaba el «peor píxel». La cifra que salía
 * era 1,04:1 sobre un par que no tiene nada que ver con ella.
 */
window.mostrarSobreImagen = () => {
  for (const el of document.querySelectorAll(
    "[data-sobre-imagen], [data-tapa-la-foto]",
  )) {
    el.style.visibility = "";
  }
  return "ok";
};
