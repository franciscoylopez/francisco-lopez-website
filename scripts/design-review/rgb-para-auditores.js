/**
 * PARA QUE UN AUDITOR EXTERNO PUEDA LEER LOS COLORES DE ESTE SITIO.
 *
 * EL PROBLEMA, medido y reproducido el 2026-09-02. Los 59 tokens de color de este
 * sitio están en `oklch()`, y Chrome serializa su valor computado como `lab(...)`:
 *
 *     getComputedStyle(document.body).color → lab(14.8102 -1.28566 -4.10883)
 *
 * Una herramienta que solo entiende `rgb()` y hex no lo parsea, **cae a `#FFFFFF`
 * en los dos lados** de cada par y publica un 1:1 · FAIL en cada elemento de la
 * página. Silktide da 19 «Text contrast issues» en la home y sigue dándolos en las
 * demás, sobre un sitio cuyo propio censo mide cero pares bajo AAA.
 *
 * NO ES UN PROBLEMA DE GAMUT. Es de PARSEO: el color que la pantalla pinta es el
 * correcto y la herramienta no sabe leerlo. Cuando puede leerlo, coincide con el
 * censo.
 *
 * QUÉ HACE ESTO. Recorre los elementos, lee cada color computado, lo pasa por un
 * canvas de 1×1 —que devuelve el píxel ya recortado a sRGB, exactamente el que se
 * pinta— y lo vuelve a escribir como `rgb()` en el estilo en línea. **No cambia un
 * píxel**: reescribe la misma pantalla en una notación que cualquier herramienta
 * entiende.
 *
 * CÓMO SE USA. Se pega en la consola del navegador ANTES de lanzar el auditor.
 * Sirve con cualquier herramienta ciega a `lab()`, no solo con Silktide.
 *
 * LO QUE NO ARREGLA: nada del sitio, porque no hay nada roto. Arregla la lectura.
 */
(() => {
  const PROPS = [
    "color",
    "backgroundColor",
    "borderTopColor",
    "borderRightColor",
    "borderBottomColor",
    "borderLeftColor",
    "outlineColor",
    "textDecorationColor",
  ];

  const cv = document.createElement("canvas");
  cv.width = cv.height = 1;
  const ctx = cv.getContext("2d", { willReadFrequently: true });

  /** El píxel que el navegador pinta, ya recortado a sRGB. */
  const aRgb = (css) => {
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = css;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
    return a === 255
      ? `rgb(${r}, ${g}, ${b})`
      : `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(3)})`;
  };

  let tocados = 0;
  for (const el of document.querySelectorAll("*")) {
    const cs = getComputedStyle(el);
    for (const prop of PROPS) {
      const v = cs[prop];
      // Solo lo que la herramienta no sabe leer. Un `rgb()` ya está bien.
      if (!v || !/^(lab|lch|oklab|oklch|color)\(/.test(v)) continue;
      el.style[prop] = aRgb(v);
      tocados += 1;
    }
  }

  // Se devuelve la cifra por la misma razón que todo lo demás de esta carpeta: si
  // sale cero, el override no ha hecho nada y el informe de después no significa
  // lo que parece.
  return `${tocados} valores reescritos a rgb(). Ahora lanza el auditor.`;
})();
