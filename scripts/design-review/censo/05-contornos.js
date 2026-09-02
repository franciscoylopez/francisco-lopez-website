/**
 * EL SEGUNDO PASE, primero a nivel superior (P50.84, 2026-08-28) y desde P72.195
 * en su propio archivo. Estaba anidado dentro de `contrastCensus`, que llegó así
 * a 164 de complejidad y 30 retornos. Anidarlo un nivel más NO habría servido
 * —qlty suma las anidadas al padre—; lo que parte el conteo de una FUNCIÓN es que
 * deje de estar dentro, y lo que parte el de un ARCHIVO es que deje de estar en
 * el mismo. Los predicados de caja que usa viven en `03-dom.js`.
 */

// --- Contorno de controles: WCAG 1.4.11, que NO es contraste de texto ----
//
// POR QUÉ EXISTE ESTE SEGUNDO PASE (2026-08-23, design-review). Todo lo de
// arriba mide TEXTO sobre fondo — 1.4.3 y 1.4.6. Pero un control también tiene
// que poder RECONOCERSE como control, y eso es 1.4.11: la información visual
// necesaria para identificarlo pide 3:1 contra lo que tiene al lado.
//
// Nadie lo medía. `check:marco` delega el contraste en `viewport-verifier`;
// `viewport-verifier` corre axe y dispara este censo; **axe no implementa
// 1.4.11** (está en su lista de comprobaciones manuales) y este censo medía
// pares de texto. La cadena entera terminaba en un sitio donde no había nadie,
// y el resultado era que el contorno de TODO control neutro del sitio llevaba
// en 1,21:1 desde V1 mientras `/accesibilidad` publicaba que «todo texto y todo
// control se comprueba con cifra».
//
// Y el nombre ayudó a esconderlo: «censo de pares de contraste» suena
// exhaustivo. Si se hubiera llamado «censo de pares de TEXTO», el hueco habría
// sido visible el día que se escribió.
//
// QUÉ SE MIDE Y QUÉ NO, que es donde se inventan los hallazgos:
//
//  · Solo elementos INTERACTIVOS. Una tarjeta decorativa con borde flojo no
//    incumple nada: 1.4.11 habla de componentes de interfaz.
//  · Solo si el autor DIBUJA una caja (borde o relleno propio). Un enlace de
//    texto —`.link-content`, `.link-chrome` en reposo— no se identifica por un
//    contorno sino por su texto y su subrayado, y eso ya lo cubre 1.4.3 arriba.
//    Medirlo aquí sería puntuar contra un umbral que no le aplica, que es
//    exactamente cómo D41 publicó cuatro incumplimientos donde había uno.
//  · Los DESHABILITADOS quedan fuera: WCAG los exime explícitamente.
//  · Solo REPOSO. La pastilla de hover no es lo que identifica al control —el
//    control ya era reconocible antes de que llegara el cursor—, así que exigirle
//    3:1 sería inventarse un requisito.
//  · Sobre imagen no se mide, igual que arriba: no hay cifra que dar.
//
// BASTA CON QUE UNO DE LOS DOS LLEGUE. Un botón sólido no necesita borde: su
// relleno ya lo separa del fondo con holgura. Por eso el veredicto es «¿lo
// identifica el relleno, o el borde?» y no «¿tiene un borde a 3:1?».

/**
 * El fondo contra el que se mide un control es el del PADRE: `backdrop(el)`
 * devolvería el relleno del propio control, que es justo lo que hay que comparar
 * contra él.
 */
const fondoDelControl = (el) => backdrop(el.parentElement ?? el);

/**
 * El elemento que se MIDE, que no siempre es el que recibe el clic. `null` si ni
 * él ni nadie dentro dibuja caja: eso es un enlace de texto y a eso no le aplica
 * 1.4.11 — se identifica por su texto, que ya mide el primer pase.
 */
function elQueDibujaLaCaja(control, csControl) {
  if (dibujaCaja(csControl)) return control;
  return cajaDelHijo(control) || null;
}

/**
 * El mejor de los lados dibujados. Un contorno completo es lo normal; si solo hay
 * un lado, se queda con ese y el `lados` del informe lo delata.
 */
function mejorBorde(cs, lados, fondo) {
  let rBorde = null;
  let colorBorde = null;
  for (const l of lados) {
    const c = paint(cs[`border${l}Color`]);
    const r = round(ratio(c[3] === 1 ? c.slice(0, 3) : over(c, fondo), fondo));
    if (rBorde === null || r > rBorde) {
      rBorde = r;
      colorBorde = cs[`border${l}Color`];
    }
  }
  return { rBorde, colorBorde };
}

/** La ficha de un control ya medido, con su veredicto y su holgura. */
function fichaDeControl(el, lados, rBorde, rRelleno) {
  const porRelleno = rRelleno !== null && rRelleno >= 3;
  const porBorde = rBorde !== null && rBorde >= 3;
  return {
    ejemplo: label(el),
    lados: lados.length === 4 ? "caja" : lados.join("+").toLowerCase(),
    bordeVsFondo: rBorde,
    rellenoVsFondo: rRelleno,
    umbral: 3,
    // Cuánto le sobra al mejor de los dos caminos. Negativo = incumple.
    holgura: round(Math.max(rBorde ?? 0, rRelleno ?? 0) - 3),
    identifica: porRelleno ? "el relleno" : porBorde ? "el borde" : null,
    nivel: porRelleno || porBorde ? "OK" : "FALLA 1.4.11",
    veces: 1,
  };
}

/**
 * Las tres puertas de entrada, juntas: se ve, no está deshabilitado y alguien
 * dibuja su caja. `null` si no pasa alguna — un deshabilitado está exento de
 * 1.4.11 y un enlace de texto no se identifica por su contorno.
 */
function controlMedible(control) {
  const csControl = getComputedStyle(control);
  if (!esVisible(control, csControl)) return null;
  if (control.disabled || control.getAttribute("aria-disabled") === "true") {
    return null;
  }
  const el = elQueDibujaLaCaja(control, csControl);
  if (!el) return null;
  return {
    el,
    cs: el === control ? csControl : getComputedStyle(el),
    porHijo: el !== control,
  };
}

/**
 * Devuelve el mapa de controles indexados; quien lo llama decide qué hacer con
 * él. Las dos cifras de cobertura salen con el mapa: son lo que impide que un
 * cero se lea como un aprobado, y viven donde se cuentan.
 */
function censarContornos() {
  const controles = new Map();
  let controlesIndexados = 0;
  let indexadosPorHijo = 0;

  for (const control of document.querySelectorAll(CONTROL_SEL)) {
    const medible = controlMedible(control);
    if (!medible) continue;
    const { el, cs, porHijo } = medible;
    if (porHijo) indexadosPorHijo++;

    const lados = ladosConBorde(cs);
    const relleno = paint(cs.backgroundColor);
    if (overImage(el)) continue;

    controlesIndexados++;

    const fondo = fondoDelControl(el);
    const rRelleno =
      relleno[3] === 0 ? null : round(ratio(over(relleno, fondo), fondo));
    const { rBorde, colorBorde } = mejorBorde(cs, lados, fondo);

    const key = [
      el.tagName.toLowerCase(),
      colorBorde ?? "sin-borde",
      cs.backgroundColor,
      fondo.map(Math.round).join(","),
    ].join("|");

    if (controles.has(key)) {
      controles.get(key).veces++;
      continue;
    }
    controles.set(key, fichaDeControl(el, lados, rBorde, rRelleno));
  }

  return { controles, controlesIndexados, indexadosPorHijo };
}
