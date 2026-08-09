// Censo de pares de contraste de una página SERVIDA (P37.68).
//
// CÓMO SE USA: define `window.contrastCensus()`, que se llama sobre la página ya
// cargada y devuelve el censo. Se puede pegar en la consola, o —para recorrer
// varias páginas sin repetir la inyección— copiarlo a `public/censo.js` y
// cargarlo con un `<script src>`. **No vale `eval()`**: la CSP del sitio no
// permite `unsafe-eval`, y eso está bien.
//
// No es un script de Node y no puede serlo: la mitad de los pares de este sitio
// **no existen hasta que el navegador compone** un `color-mix` sobre la
// superficie que tiene debajo, así que solo se ven en el DOM pintado. Se expone
// como función y no como IIFE para poder llamarlo dos veces sin recargar —
// conmutar el tema y volver a medir es la mitad del trabajo.
//
// POR QUÉ EXISTE. Las auditorías de 2026-08-04 y 2026-08-08 dieron por bueno un
// «todos los pares en AAA, sin excepciones» que era falso: se les escaparon tres
// —la etiqueta neutra (6,44/5,56), la teñida (6,07/5,46) y el hover del chrome
// secundario (6,44/5,56)—. Los tres por la MISMA razón, y no fue descuido: un
// censo hecho leyendo `globals.css` no puede encontrar un par que solo aparece al
// componer un velo o una pastilla de hover, porque no hay ningún token con ese
// nombre. Y el tercero, además, solo existe mientras el cursor está encima.
//
// De ahí las dos reglas que este script implementa y que son el punto entero:
// **el censo se recorre por el DOM**, y **incluye los estados**.
//
// Se escribió tres veces a mano (P37.655, P37.656 y P37.6605) antes de quedarse
// aquí. Que el trabajo deje algo detrás es más barato que volver a escribirlo.

window.contrastCensus = () => {
  const round = (n) => Math.round(n * 100) / 100;

  // LO PRIMERO: congelar transiciones y animaciones, y forzar el reflow que las
  // resuelve al estado final. Sin esto, el censo MIDE A MEDIO CAMINO.
  //
  // No es teórico: llamarlo dos veces conmutando el tema —que es el uso que este
  // archivo documenta arriba y la mitad del trabajo de una auditoría— daba cuatro
  // pares fantasma de 1,06 · 1,11 · 1,42 · 2,05 en la segunda llamada, o sea el
  // aspecto exacto de un fallo catastrófico, y la página estaba perfecta: eran las
  // tarjetas y los enlaces todavía interpolando su color. `.link-content` tarda
  // 380ms (0,3s con 0,08s de retardo), así que cualquier espera «prudente» de 300 o
  // 400ms cae justo dentro. Esperar más no es la solución —es la misma apuesta con
  // otro número—; la solución es que no haya nada que esperar.
  //
  // Vale también para el pase de hover: el clon adopta el estado final de golpe en
  // vez de arrancar una transición que nadie va a esperar. Es la lección de D35 —
  // un elemento se quedaba clavado en su color de reposo— vista desde el medidor.
  const freeze = document.createElement("style");
  freeze.textContent =
    "*,*::before,*::after{transition:none !important;animation:none !important;}";
  document.head.appendChild(freeze);
  void document.body.offsetHeight;

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

  /**
   * El fondo EFECTIVO de un elemento: se sube por la cadena de padres hasta dar
   * con uno opaco y se componen encima los semitransparentes que había en medio.
   * Leer un `color-mix(…, transparent 86%)` sin componer da una cifra falsa y
   * optimista — es el punto 2 de D30.
   */
  function backdrop(el) {
    const stack = [];
    for (let n = el; n; n = n.parentElement) {
      const c = paint(getComputedStyle(n).backgroundColor);
      if (c[3] === 0) continue;
      stack.push(c);
      if (c[3] === 1) break;
    }
    if (stack.length === 0) return [255, 255, 255];
    let base = stack.pop().slice(0, 3);
    while (stack.length) base = over(stack.pop(), base);
    return base;
  }

  /**
   * ¿El fondo de este texto es una IMAGEN (foto, degradado)? Entonces no hay
   * cifra que dar: `backdrop()` solo sabe componer `background-color`, así que
   * ignora la foto y el velo en degradado que lleva encima, y devuelve el fondo
   * de la página — que no es lo que hay detrás del texto.
   *
   * Añadido en P37.6565 tras un falso positivo del propio censo: el titular
   * blanco sobre la foto de Sobre mí salía a **1,09:1** en claro, o sea el peor
   * hallazgo de toda la auditoría, cuando lo que ocurre es que el medidor lo
   * comparaba con el blanco hueso de la página en vez de con la foto. Se separan
   * en `sinMedir` en lugar de descartarse: son los pares que hay que mirar a ojo,
   * y esconderlos sería cambiar un fallo por otro que no sale en el informe.
   */
  const media = () =>
    [...document.querySelectorAll("img, video, canvas, svg image")]
      .map((n) => n.getBoundingClientRect())
      .filter((r) => r.width > 0 && r.height > 0);

  let mediaRects = null;

  function overImage(el) {
    // La comprobación es GEOMÉTRICA y no de cascada: se pregunta si el texto cae
    // ENCIMA de una foto, que es el hecho. El primer intento miraba si algún
    // ancestro tenía `background-image` y se equivocó en las dos direcciones —
    // marcaba `.link-content` (cuyo relleno de hover ES un `background-image`, de
    // tamaño cero en reposo) y NO marcaba el titular sobre la foto de Sobre mí,
    // porque ahí la imagen es un HERMANO posicionado, no un fondo. Es el mismo
    // error de disparador que este censo existe para no repetir.
    if (mediaRects === null) mediaRects = media();
    if (mediaRects.length === 0) return false;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return false;
    return mediaRects.some(
      (m) =>
        r.left < m.right && r.right > m.left && r.top < m.bottom && r.bottom > m.top,
    );
  }

  /** Un elemento cuenta si pinta texto propio y se ve. */
  function paintsText(el) {
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.display === "none") return false;
    if (parseFloat(cs.opacity) === 0) return false;
    if (!el.getClientRects().length) return false;
    return [...el.childNodes].some(
      (n) => n.nodeType === 3 && n.textContent.trim().length > 0,
    );
  }

  const label = (el) => {
    const cls = (el.getAttribute("class") || "").split(/\s+/).slice(0, 3);
    return `${el.tagName.toLowerCase()}${cls.length ? "." + cls.join(".") : ""}`;
  };

  /**
   * Las declaraciones que una regla `:hover` aplica de verdad a un elemento. Se
   * LEEN de la hoja de estilo en vez de asumirse: la corrección del hover del
   * chrome secundario consistió justo en que la regla declara dos cosas —la
   * pastilla y el color del texto— y quien lo revisó antes solo contó con una.
   * Simular el ratón no vale: el estado no sobrevive entre llamadas.
   */
  function hoverDeclarations(el) {
    const out = [];

    // OJO: hay que BAJAR por las reglas de grupo. Tailwind v4 envuelve todas sus
    // utilidades `hover:` en `@media (hover: hover)`, y un `@media` no tiene
    // `selectorText`, así que un bucle plano sobre `cssRules` las salta enteras.
    // Con ese fallo el censo daba 6,42 para el hover del chrome secundario —veía
    // aparecer la pastilla y no el texto subiendo a `foreground`, que es la mitad
    // que lo arregla— y habría reportado como hallazgo un par que está en 12,47.
    // Es literalmente el principio 5 de la skill cobrándose su pieza: el metro se
    // valida antes de creerse el hallazgo.
    const walk = (rules) => {
      for (const rule of rules) {
        if (rule.cssRules) {
          walk(rule.cssRules);
          continue;
        }
        if (!rule.selectorText?.includes(":hover")) continue;
        for (const sel of rule.selectorText.split(",")) {
          const s = sel.trim();
          if (!s.includes(":hover")) continue;
          try {
            if (!el.matches(s.replaceAll(":hover", ""))) continue;
          } catch {
            continue;
          }
          out.push(rule.style);
        }
      }
    };

    for (const sheet of document.styleSheets) {
      try {
        walk(sheet.cssRules);
      } catch {
        continue; // hoja de otro origen
      }
    }
    return out;
  }

  const pairs = new Map();
  const sinMedir = new Map();
  const add = (state, el, fg, bg) => {
    const r = ratio(fg, bg);
    const key = `${state}|${fg.map(Math.round)}|${bg.map(Math.round)}`;
    const destino = overImage(el) ? sinMedir : pairs;
    if (!destino.has(key))
      destino.set(key, { state, ratio: r, ejemplo: label(el) });
  };

  // --- Reposo -------------------------------------------------------------
  for (const el of document.querySelectorAll("body *")) {
    if (!paintsText(el)) continue;
    const bg = backdrop(el);
    const fg = paint(getComputedStyle(el).color);
    add("reposo", el, fg[3] === 1 ? fg.slice(0, 3) : over(fg, bg), bg);
  }

  // --- Hover: se aplican las declaraciones reales sobre un clon -------------
  for (const el of document.querySelectorAll(
    "a, button, [role='tab'], [role='switch'], summary",
  )) {
    const decls = hoverDeclarations(el);
    if (decls.length === 0) continue;

    const clone = el.cloneNode(true);
    for (const style of decls)
      for (const prop of style)
        clone.style.setProperty(
          prop,
          style.getPropertyValue(prop),
          style.getPropertyPriority(prop),
        );
    el.parentElement.insertBefore(clone, el);

    const target = paintsText(clone)
      ? clone
      : [...clone.querySelectorAll("*")].find(paintsText);
    if (target) {
      const bg = backdrop(target);
      const fg = paint(getComputedStyle(target).color);
      add("hover", el, fg[3] === 1 ? fg.slice(0, 3) : over(fg, bg), bg);
    }
    clone.remove();
  }

  // --- Validación del metro, ANTES de creerse nada -------------------------
  // Anclajes sin cian (no dependen del recorte de gamut): texto principal
  // 13,79 claro / 15,32 oscuro. Si no salen exactos, el fallo es del medidor.
  const ancla = ratio(
    paint(getComputedStyle(document.body).color).slice(0, 3),
    backdrop(document.body),
  );
  const esperado = document.documentElement.classList.contains("dark")
    ? 15.32
    : 13.79;

  const censo = [...pairs.values()].sort((a, b) => a.ratio - b.ratio);
  const resultado = {
    metro: ancla === esperado ? `OK (${ancla})` : `SOSPECHOSO: ${ancla} ≠ ${esperado}`,
    tema: document.documentElement.classList.contains("dark") ? "oscuro" : "claro",
    pares: censo.length,
    // AAA de texto normal. Lo que salga aquí, o sube o se documenta como excepción.
    bajoAAA: censo.filter((p) => p.ratio < 7),
    censo,
    // Texto sobre imagen: el medidor no puede componer una foto, así que estos
    // pares se listan aparte y se miran a ojo. Su `ratio` NO es una medición.
    sinMedir: [...sinMedir.values()].sort((a, b) => a.ratio - b.ratio),
  };
  freeze.remove();
  return resultado;
};
