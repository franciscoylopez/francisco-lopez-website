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
// De ahí las TRES reglas que este script implementa y que son el punto entero:
// **el censo se recorre por el DOM**, **incluye los estados** y **cada par se
// puntúa contra el umbral que le toca por su tamaño de texto** (P37.6595).
//
// Se escribió tres veces a mano (P37.655, P37.656 y P37.6605) antes de quedarse
// aquí. Que el trabajo deje algo detrás es más barato que volver a escribirlo.

/**
 * Congela transiciones y animaciones, y fuerza el reflow que las resuelve al
 * estado final. Devuelve la función que lo deshace. Sin esto se MIDE A MEDIO
 * CAMINO.
 *
 * No es teórico: llamar al censo dos veces conmutando el tema —que es el uso que
 * este archivo documenta arriba y la mitad del trabajo de una auditoría— daba
 * cuatro pares fantasma de 1,06 · 1,11 · 1,42 · 2,05 en la segunda llamada, o sea
 * el aspecto exacto de un fallo catastrófico, y la página estaba perfecta: eran
 * las tarjetas y los enlaces todavía interpolando su color. `.link-content` tarda
 * 380ms (0,3s con 0,08s de retardo), así que cualquier espera «prudente» de 300 o
 * 400ms cae justo dentro. Esperar más no es la solución —es la misma apuesta con
 * otro número—; la solución es que no haya nada que esperar.
 *
 * Vale también para el pase de hover: el clon adopta el estado final de golpe en
 * vez de arrancar una transición que nadie va a esperar. Es la lección de D35 —
 * un elemento se quedaba clavado en su color de reposo— vista desde el medidor.
 *
 * ESTÁ SUELTA A PROPÓSITO (P37.6595): **axe la necesita igual y no la tenía**.
 * Conmutar el tema y lanzar axe sin congelar da siete violaciones fantasma
 * (`#005859` sobre `#191d21`) con la página perfecta — el mismo fallo, en la otra
 * herramienta. Antes de un `axe.run()`:
 *
 *     const descongelar = window.freezeMotion();
 *     const r = await axe.run();
 *     descongelar();
 */
window.freezeMotion = () => {
  const freeze = document.createElement("style");
  freeze.textContent =
    "*,*::before,*::after{transition:none !important;animation:none !important;}";
  document.head.appendChild(freeze);
  void document.body.offsetHeight;
  return () => freeze.remove();
};

window.contrastCensus = () => {
  const round = (n) => Math.round(n * 100) / 100;

  const descongelar = window.freezeMotion();

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
  /**
   * El color que pinta un `background-image`, cuando de verdad se puede saber.
   *
   * POR QUÉ HACE FALTA, y no es un caso raro: el hover de los enlaces de
   * contenido de este sitio NO es un `background-color`. Es
   * `linear-gradient(var(--primary), var(--primary))` —un relleno SÓLIDO
   * disfrazado de degradado— con `background-size: 100% 0%` en reposo y
   * `100% 100%` en hover, que es lo que permite animar el relleno creciendo de
   * abajo arriba. `backdrop()` solo componía `background-color`, así que en el
   * pase de hover veía el texto pasar a `--primary-foreground` y NO veía
   * aparecer el relleno debajo: medía hueso sobre hueso y daba **1,06:1**, o sea
   * el aspecto exacto de un incumplimiento catastrófico sobre un par que está en
   * AAA. Apareció en cuanto el hover volvió a medirse (P50.36) — llevaba
   * escondido justo detrás del fallo que lo tapaba.
   *
   * DOS CONDICIONES, y las dos importan:
   * · **Que cubra.** Con `background-size: 100% 0%` el relleno existe y no pinta
   *   nada. Por eso el reposo del mismo enlace es correcto sin este código.
   * · **Que sea un color y no un degradado.** Si las paradas no son todas
   *   iguales, aquí no hay UN color que componer y devolvemos `null` — ese texto
   *   se va a `sinMedir`, que es el cajón de lo que hay que mirar a ojo. Inventar
   *   una media sería exactamente lo que este archivo existe para no hacer.
   */
  function fillColor(el) {
    const cs = getComputedStyle(el);
    const img = cs.backgroundImage;
    if (!img || img === "none") return null;
    // Alguna dimensión a cero = no cubre. `100% 0%`, `0% 100%`, `0px`…
    if (/(^|[\s,])0(%|px)?([\s,]|$)/.test(cs.backgroundSize)) return null;
    // EL COMPUTED NO DEVUELVE LO QUE ESTÁ ESCRITO. La hoja dice
    // `linear-gradient(var(--primary), var(--primary))` y el token es `oklch`,
    // pero Chrome resuelve el gradiente a **`lab(...)`**. Un matcher de `rgb` y
    // hex —lo primero que uno escribe— no encuentra nada y el par se cae al cajón
    // de «sin medir» sin que nada avise: el mismo modo de fallo silencioso que
    // este archivo lleva tres iteraciones persiguiendo. Se cubren todas las
    // funciones de color, que no anidan paréntesis y por eso se pueden recortar
    // así.
    const stops = img.match(
      /(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\([^()]*\)|#[0-9a-fA-F]{3,8}/g,
    );
    if (!stops) return null;
    const colores = new Set(stops.map((s) => paint(s).join(",")));
    if (colores.size !== 1) return null; // degradado de verdad
    const c = paint(stops[0]);
    return c[3] === 0 ? null : c;
  }

  function backdrop(el) {
    const stack = [];
    for (let n = el; n; n = n.parentElement) {
      // El relleno de imagen va ENCIMA del `background-color` del mismo
      // elemento, así que se mira primero.
      const fill = fillColor(n);
      if (fill) {
        stack.push(fill);
        if (fill[3] === 1) break;
      }
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
  const MEDIA_SEL = "img, video, canvas, svg image";

  const solapan = (a, b) =>
    a.left < b.right &&
    a.right > b.left &&
    a.top < b.bottom &&
    a.bottom > b.top;

  /** ¿El fondo de este elemento es una imagen que CUBRE y no se puede reducir a
   *  un color? `background-size` con una dimensión a cero no pinta nada, y un
   *  relleno sólido escrito como degradado lo resuelve `fillColor`. */
  const cubreConImagen = (n, cs) =>
    cs.backgroundImage !== "none" &&
    !/(^|[\s,])0(%|px)?([\s,]|$)/.test(cs.backgroundSize) &&
    fillColor(n) === null;

  /** ¿Hay un `<img>`/`<video>` DENTRO de `ancestro` que se solape con la caja
   *  del texto sin contenerlo? Es la foto que se interpone. */
  function tapaMedia(ancestro, el, r) {
    for (const m of ancestro.querySelectorAll(MEDIA_SEL)) {
      if (m.contains(el)) continue;
      const mr = m.getBoundingClientRect();
      if (mr.width > 0 && mr.height > 0 && solapan(r, mr)) return true;
    }
    return false;
  }

  function overImage(el) {
    // La comprobación es GEOMÉTRICA y no de cascada: se pregunta si el texto cae
    // ENCIMA de una foto, que es el hecho. El primer intento miraba si algún
    // ancestro tenía `background-image` y se equivocó en las dos direcciones —
    // marcaba `.link-content` (cuyo relleno de hover ES un `background-image`, de
    // tamaño cero en reposo) y NO marcaba el titular sobre la foto de Sobre mí,
    // porque ahí la imagen es un HERMANO posicionado, no un fondo. Es el mismo
    // error de disparador que este censo existe para no repetir.
    // Y un DEGRADADO DE VERDAD detrás del texto también es «sin medir»: cubre,
    // así que `background-color` no dice lo que hay debajo, y no tiene un color
    // único que componer. Un relleno sólido escrito como gradiente —el idioma del
    // hover de los enlaces de contenido— sí lo tiene, y lo resuelve `fillColor`;
    // esto es solo para el resto. Hoy no hay ninguno, y por eso está escrito:
    // el día que aparezca, tiene que salir en el informe como «míralo a ojo» y no
    // como una cifra inventada.
    // Y LA GEOMETRÍA SE MIRA DENTRO DE LA SUBRAMA, no en toda la página
    // (2026-08-22). La primera versión comparaba el texto contra CUALQUIER
    // `<img>`/`<video>` del documento por solape de rectángulos, sin mirar el
    // apilamiento: el diálogo de consentimiento, que es `fixed` y pinta su
    // propio `bg-card` OPACO, cae encima de la foto del hero y salía marcado
    // «sobre imagen». Con eso, 22 de los 26 pares que el censo mandaba mirar a
    // ojo no tenían imagen debajo — y una lista de revisión manual inflada con
    // falsos positivos es una lista que nadie lee, que es la misma forma de
    // fallo que el resto de este archivo combate.
    //
    // La pregunta correcta es si hay una imagen pintada ENTRE el texto y el
    // primer fondo opaco de su cadena: en cuanto un ancestro pinta opaco, lo
    // que haya detrás ya no se ve, y el color queda determinado. Por eso ahora
    // se recorre subiendo, buscando media DENTRO de cada ancestro, y el fondo
    // opaco devuelve `false` en vez de romper el bucle y seguir preguntando.
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return false;

    for (let n = el; n; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cubreConImagen(n, cs)) return true;
      // El hermano posicionado que es el caso de Sobre mí: la foto vive dentro
      // del `<figure>`, no en el fondo de ningún ancestro del texto.
      if (n !== el && tapaMedia(n, el, r)) return true;
      if (paint(cs.backgroundColor)[3] === 1) return false;
    }

    return false;
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
  /**
   * ÍNDICE de las reglas `:hover` de la página, construido UNA VEZ.
   *
   * DOS VECES SE HA CAÍDO ESTA MISMA FUNCIÓN, y por la misma familia de causa:
   *
   * 1 · Un bucle plano se saltaba las utilidades `hover:` de Tailwind v4, que van
   *     envueltas en `@media (hover: hover)` — un `@media` no tiene
   *     `selectorText`. El censo daba 6,42 para el hover del chrome secundario:
   *     veía aparecer la pastilla y no el texto subiendo a `foreground`, que es
   *     la mitad que lo arregla.
   * 2 · Se arregló con `if (rule.cssRules) { bajar; continue; }`, o sea con un
   *     test de «esto es una regla de grupo» que el navegador invalidó después:
   *     DESDE QUE CHROME SOPORTA CSS NESTING, toda `CSSStyleRule` expone
   *     `cssRules` —vacío—, así que la condición era siempre cierta, el `continue`
   *     se ejecutaba siempre y la línea del selector NUNCA se alcanzaba. Medido en
   *     la página servida el 2026-08-18: encontraba **0** reglas con `:hover`
   *     donde hay **21**.
   *
   * La lección que sí generaliza, y por eso está escrita en el código y no solo en
   * el commit: **no es o-grupo-o-selector**. Con nesting una regla puede tener
   * las DOS cosas, así que se evalúa el selector si lo tiene Y se baja si tiene
   * hijas — nunca se elige una rama. Y sobre todo: **un metro que devuelve una
   * lista vacía parece un aprobado**, así que este índice se PUBLICA en el
   * resultado y el censo falla si sale a cero (ver `reglasHover` abajo).
   */
  const HOVER_RULES = (() => {
    const idx = [];
    const walk = (rules) => {
      for (const rule of rules) {
        // Rama 1: ¿declara algo? Se mira SIEMPRE, tenga o no hijas.
        if (rule.selectorText?.includes(":hover")) {
          for (const sel of rule.selectorText.split(",")) {
            const s = sel.trim();
            if (s.includes(":hover")) idx.push({ sel: s, style: rule.style });
          }
        }
        // Rama 2: ¿tiene hijas DE VERDAD? `length > 0`, no la mera existencia.
        if (rule.cssRules?.length > 0) walk(rule.cssRules);
      }
    };
    for (const sheet of document.styleSheets) {
      try {
        walk(sheet.cssRules);
      } catch {
        continue; // hoja de otro origen
      }
    }
    return idx;
  })();

  /**
   * Las declaraciones que una regla `:hover` aplica de verdad a un elemento. Se
   * LEEN de la hoja de estilo en vez de asumirse: la corrección del hover del
   * chrome secundario consistió justo en que la regla declara dos cosas —la
   * pastilla y el color del texto— y quien lo revisó antes solo contó con una.
   * Simular el ratón no vale: el estado no sobrevive entre llamadas.
   */
  function hoverDeclarations(el) {
    const out = [];
    for (const { sel, style } of HOVER_RULES) {
      try {
        if (el.matches(sel.replaceAll(":hover", ""))) out.push(style);
      } catch {
        continue;
      }
    }
    return out;
  }

  /**
   * El umbral que le toca a ESTE texto, que depende de su tamaño. WCAG llama
   * «grande» a ≥18pt (24px), o ≥14pt (18,66px) con peso ≥700, y ahí AAA es 4,5 y
   * AA es 3 — no 7 y 4,5.
   *
   * Añadido en P37.6595, y es la cuarta vez que el medidor falla antes que la
   * página. Hasta aquí el censo puntuaba TODO contra 7:1, así que su `bajoAAA`
   * era una lista de candidatos vendida como lista de incumplimientos: el PRD
   * llegó a publicar «cuatro pares incumpliendo en la escalera del logo» cuando
   * era **uno** —los otros tres eran los «Aa» de las muestras de color, de 24px y
   * peso 600, y dos de ellos (5,21 y 6,57) cumplían de sobra—. Un umbral mal
   * aplicado inventa hallazgos igual que un metro mal calibrado (D41).
   */
  function umbralDe(el) {
    const cs = getComputedStyle(el);
    const px = round(parseFloat(cs.fontSize));
    const peso = parseInt(cs.fontWeight, 10) || 400;
    const grande = px >= 24 || (px >= 18.66 && peso >= 700);
    return { px, peso, grande, AA: grande ? 3 : 4.5, AAA: grande ? 4.5 : 7 };
  }

  const pairs = new Map();
  const sinMedir = new Map();
  const add = (state, medido, fg, bg) => {
    const r = ratio(fg, bg);
    const u = umbralDe(medido);
    // El umbral entra en la CLAVE, no solo en el resultado. Sin él, dos textos
    // del mismo color sobre el mismo fondo colapsan en una fila — y si la
    // primera que llega es la grande, la pequeña (que es la que puede fallar)
    // desaparece del censo sin dejar rastro. Es el mismo agujero que este script
    // existe para tapar, una capa más adentro.
    const key = `${state}|${fg.map(Math.round)}|${bg.map(Math.round)}|${u.AAA}`;
    // Sobre una imagen no hay cifra que dar, así que tampoco hay veredicto: se
    // etiqueta como tal en vez de dejar que el `ratio` falso se convierta en un
    // «FALLA AA». Sería inventar un hallazgo, que es lo que este bloque corrige.
    const sobreImagen = overImage(medido);
    const destino = sobreImagen ? sinMedir : pairs;
    if (!destino.has(key))
      destino.set(key, {
        state,
        ratio: r,
        px: u.px,
        peso: u.peso,
        umbralAAA: u.AAA,
        // Cuánto le sobra (o le falta) contra SU umbral. Con umbrales mixtos, el
        // ratio más bajo ya no es el peor par: 5,21 a 24px va sobrado y 6,40 a
        // 11px falla. Por eso el censo se ordena por esto y no por `ratio`.
        holgura: sobreImagen ? null : round(r - u.AAA),
        nivel: sobreImagen
          ? "sin medir · fondo con imagen"
          : r >= u.AAA
            ? "AAA"
            : r >= u.AA
              ? "AA"
              : "FALLA AA",
        ejemplo: label(medido),
      });
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
      // El tamaño se lee del CLON, que es quien pinta el texto: la regla `:hover`
      // puede cambiar el cuerpo o el peso, y con ellos el umbral.
      add("hover", target, fg[3] === 1 ? fg.slice(0, 3) : over(fg, bg), bg);
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

  // Ordenado por HOLGURA contra el umbral de cada uno, no por ratio: con
  // umbrales mixtos, el par más apretado no es el de la cifra más baja.
  const censo = [...pairs.values()].sort((a, b) => a.holgura - b.holgura);

  // CUÁNTO HA MIRADO, no solo qué ha encontrado. Las dos veces que este censo se
  // rompió no dio error: devolvió una lista de hallazgos vacía, que es
  // exactamente lo que devuelve cuando todo está bien. Publicando el tamaño del
  // índice, un cero se lee como lo que es —el metro no está midiendo— en vez de
  // como un aprobado. Es la tercera vez que este proyecto se encuentra un metro
  // descalibrado (medidor fuera de gamut, umbral por tamaño de texto, y esto).
  const paresHover = censo.filter((p) => p.state === "hover").length;
  const reglasHover =
    HOVER_RULES.length === 0
      ? "0 — EL METRO NO ESTÁ MIDIENDO EL HOVER. Esto NO es un aprobado: " +
        "cualquier página de este sitio tiene reglas :hover. Revisa el walk de " +
        "HOVER_RULES antes de creerte el resto del informe."
      : `${HOVER_RULES.length} reglas :hover indexadas · ${paresHover} pares medidos en hover`;

  const resultado = {
    metro:
      ancla === esperado
        ? `OK (${ancla})`
        : `SOSPECHOSO: ${ancla} ≠ ${esperado}`,
    reglasHover,
    tema: document.documentElement.classList.contains("dark")
      ? "oscuro"
      : "claro",
    pares: censo.length,
    // Cada uno contra el umbral que le toca por su tamaño (7 / 4,5 y 4,5 / 3).
    // Esto ya son incumplimientos, no candidatos: lo que salga aquí, o sube o se
    // documenta como excepción con fecha.
    bajoAA: censo.filter((p) => p.nivel === "FALLA AA"),
    bajoAAA: censo.filter((p) => p.nivel !== "AAA"),
    censo,
    // Texto sobre imagen: el medidor no puede componer una foto, así que estos
    // pares se listan aparte y se miran a ojo. Su `ratio` NO es una medición.
    sinMedir: [...sinMedir.values()].sort((a, b) => a.ratio - b.ratio),
  };
  descongelar();
  return resultado;
};
