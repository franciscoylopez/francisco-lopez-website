/**
 * Cómo se anota un par medido. Es una fábrica y no una función suelta porque los
 * dos mapas —los pares con cifra y los que caen sobre imagen— son de la corrida,
 * no del módulo: dos censos seguidos en la misma página sumarían si los
 * compartieran.
 */
function anotador(pairs, sinMedir) {
  return (state, medido, fg, bg) => {
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
        // La clave SALE en el resultado (P72.15, 2026-09-02). Es lo que permite
        // comparar dos corridas par a par en vez de comparar dos totales: el
        // mismo commit midió 414 pares un día y 391 al siguiente, y con solo el
        // total no había forma de decir CUÁL faltaba. Un par que no está en la
        // lista no está aprobado: está sin mirar.
        clave: key,
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
}

/** Todo texto que la página pinta, en reposo. */
function censarReposo(add) {
  for (const el of document.querySelectorAll("body *")) {
    if (!paintsText(el)) continue;
    const bg = backdrop(el);
    const fg = conOpacidad(el, paint(getComputedStyle(el).color));
    add("reposo", el, fg[3] === 1 ? fg.slice(0, 3) : over(fg, bg), bg);
  }
}

/**
 * El hover, aplicando las declaraciones REALES sobre un clon. Es la mitad del
 * censo que ninguna lista de tokens puede tener: la pastilla de hover no existe
 * hasta que el cursor llega, así que se fabrica.
 */
function censarHover(add) {
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
      const fg = conOpacidad(target, paint(getComputedStyle(target).color));
      // El tamaño se lee del CLON, que es quien pinta el texto: la regla `:hover`
      // puede cambiar el cuerpo o el peso, y con ellos el umbral.
      add("hover", target, fg[3] === 1 ? fg.slice(0, 3) : over(fg, bg), bg);
    }
    clone.remove();
  }
}

/**
 * LA VALIDACIÓN DEL METRO, ANTES DE CREERSE NADA. Anclajes sin cian (no dependen
 * del recorte de gamut): texto principal 13,79 claro / 15,32 oscuro. Si no salen
 * exactos, el fallo es del medidor y no del color.
 */
function validaElMetro() {
  return {
    ancla: ratio(
      paint(getComputedStyle(document.body).color).slice(0, 3),
      backdrop(document.body),
    ),
    esperado: document.documentElement.classList.contains("dark")
      ? 15.32
      : 13.79,
  };
}

window.contrastCensus = () => {
  // Antes de medir nada: la página entera, no la parte que el observador haya
  // encendido por dónde cayó el scroll. Ver `mostrarReveals` aquí arriba.
  const reveals = window.mostrarReveals();

  // Los contadores de opacidad son de MÓDULO —los usan los dos pases— así que se
  // ponen a cero aquí: dos censos seguidos en la misma página sumarían si no.
  compuestosPorOpacidad = 0;
  conOpacidadInspeccionados = 0;

  const descongelar = window.freezeMotion();

  const pairs = new Map();
  const sinMedir = new Map();
  const add = anotador(pairs, sinMedir);

  censarReposo(add);
  censarHover(add);

  // El pase de contornos, que ya no vive aquí dentro.
  const { controles, controlesIndexados, indexadosPorHijo } = censarContornos();

  const { ancla, esperado } = validaElMetro();

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
    // Cuántos reveals había apagados al llegar. Se publica por lo mismo que
    // `reglasHover`: sin la cifra, una pasada sobre media página se lee igual que
    // una sobre la página entera (P50.79).
    reveals: `${reveals.total} reveals · ${reveals.encendidos} encendidos para medir`,
    // Y la tercera cifra de cobertura (P72.14). Hoy este sitio no tiene ningún
    // texto atenuado con `opacity` —el único que había se arregló en 34cd07a—,
    // así que lo normal es «N inspeccionados · 0 compuestos». Ese cero solo
    // significa algo con el N delante: sin él, un metro que dejara de mirar la
    // opacidad se leería exactamente igual que uno que la mira y no encuentra
    // nada. Es la cuarta vez que este archivo aplica esa regla.
    opacidad:
      conOpacidadInspeccionados === 0
        ? "0 — EL METRO NO ESTÁ MIRANDO LA OPACIDAD. Esto NO es un aprobado: " +
          "toda página tiene textos. Revisa `conOpacidad` antes de creerte el resto."
        : `${conOpacidadInspeccionados} textos inspeccionados · ` +
          `${compuestosPorOpacidad} compuestos por opacidad efectiva`,
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

    // --- WCAG 1.4.11, el segundo pase --------------------------------------
    // Mismo principio que `reglasHover`: publica CUÁNTO ha mirado. Toda página
    // de este sitio tiene al menos el enlace de salto, que es un
    // `outline-neutral` con caja, así que un cero aquí no es un aprobado — es el
    // pase que no está corriendo.
    contornos:
      controlesIndexados === 0
        ? "0 — EL METRO NO ESTÁ MIRANDO LOS CONTORNOS. Esto NO es un aprobado: " +
          "toda página tiene al menos el enlace de salto, que dibuja caja. " +
          "Revisa CONTROL_SEL antes de creerte el resto del informe."
        : // El desglose de la puerta nueva NO es adorno (P68.585): si mañana se
          // rompe la búsqueda en descendientes, el censo volverá a decir «cero
          // bajo 3:1» y eso vuelve a parecer un aprobado. Publicando cuántos
          // entran por ahí, un cero donde había doce se lee como lo que es.
          `${controlesIndexados} controles con caja indexados` +
          ` (${indexadosPorHijo} por caja en un descendiente)` +
          ` · ${controles.size} contornos distintos medidos`,
    controles: [...controles.values()].sort((a, b) => a.holgura - b.holgura),
    bajo3: [...controles.values()]
      .filter((c) => c.nivel !== "OK")
      .sort((a, b) => a.holgura - b.holgura),
  };
  descongelar();
  return resultado;
};
