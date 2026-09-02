/** En píxeles de DISPOSITIVO, que es la unidad de la captura. Recortar con los
 * CSS px daría una región desplazada en cuanto el DPR no sea 1. */
const cajaEnPixeles = (r, dpr) => ({
  x: Math.max(0, Math.floor(r.left * dpr)),
  y: Math.max(0, Math.floor(r.top * dpr)),
  w: Math.ceil(r.width * dpr),
  h: Math.ceil(r.height * dpr),
});

/** ¿Cae algo de esta caja dentro del viewport? Fuera no hay píxel que leer. */
function dentroDelViewport(r) {
  if (r.width <= 0 || r.height <= 0) return false;
  const enVertical = r.bottom > 0 && r.top < window.innerHeight;
  const enHorizontal = r.right > 0 && r.left < window.innerWidth;
  return enVertical && enHorizontal;
}

/**
 * Las marcas de la toma anterior se retiran ANTES de nada. Sin esto, un elemento
 * que dejó de estar sobre imagen seguiría oculto en la foto siguiente.
 */
function limpiaMarcas() {
  for (const attr of ["data-sobre-imagen", "data-tapa-la-foto"]) {
    for (const el of document.querySelectorAll(`[${attr}]`)) {
      el.removeAttribute(attr);
      el.style.visibility = "";
    }
  }
}

/** La ficha de un texto sobre foto: dónde cae, de qué color es y qué umbral pide. */
function parSobreImagen(el, i, dpr) {
  const cs = getComputedStyle(el);
  // La caja de las LETRAS, no la del elemento: ver `cajaDelTexto`. El
  // `getBoundingClientRect` queda de reserva para el caso raro en que el rango
  // no devuelva rectángulos.
  const r = cajaDelTexto(el) ?? el.getBoundingClientRect();
  // Fuera del viewport no se descarta en silencio: se devuelve con
  // `visible: false` para que el conductor pueda decir cuántos no ha podido
  // fotografiar, que es la diferencia entre un cero y un aprobado.
  const visible = dentroDelViewport(r);
  const u = umbralDe(el);
  el.setAttribute("data-sobre-imagen", String(i));
  return {
    rect: r,
    visible,
    par: {
      i,
      clave: CLAVE_SOBRE_IMAGEN(el, u.px),
      ejemplo: label(el),
      texto: (el.textContent || "").trim().slice(0, 40),
      color: paint(cs.color),
      px: u.px,
      peso: u.peso,
      grande: u.grande,
      AA: u.AA,
      AAA: u.AAA,
      visible,
      caja: cajaEnPixeles(r, dpr),
    },
  };
}

/**
 * EL ANCLA, y es la mitad que impide creerse el resto (BRAND.md §Cómo medir, 1).
 * Un par que el censo SÍ sabe medir —texto normal sobre el fondo de la página—,
 * devuelto con su caja y su cifra de referencia. El conductor lo mide por el
 * camino del píxel y las dos tienen que coincidir: si no, lo que falla es el
 * recorte o el DPR, no el color. Sin esto, un desalineamiento de la captura daría
 * cifras plausibles sobre la región equivocada.
 *
 * Y NO SE ELIGE DENTRO DE UN `fixed` QUE SE VA A RETIRAR, que es el primer sitio
 * donde este ancla se equivocó: cayó en el titular del diálogo de consentimiento
 * —texto sobre su `bg-card` opaco, un par perfectamente medible— y al retirar el
 * diálogo para la foto, la cámara leyó el vídeo que había detrás y el metro se
 * declaró roto estando bien. El ancla tiene que seguir ahí cuando se dispara.
 */
function buscaElAncla(dpr) {
  for (const el of document.querySelectorAll("body *")) {
    if (!paintsText(el) || overImage(el)) continue;
    if (el.closest("[data-tapa-la-foto]")) continue;
    // El ancla se mide por el MISMO camino que los pares, caja de letras
    // incluida: si no, validaría una ruta que luego no se usa.
    const r = cajaDelTexto(el);
    if (!r || r.width < 40 || r.height < 8) continue;
    if (r.top < 0 || r.bottom > window.innerHeight) continue;
    const fg = paint(getComputedStyle(el).color);
    if (fg[3] !== 1) continue;
    el.setAttribute("data-sobre-imagen", "ancla");
    return {
      ejemplo: label(el),
      color: fg,
      esperado: ratio(fg.slice(0, 3), backdrop(el)),
      caja: cajaEnPixeles(r, dpr),
    };
  }
  return null;
}

window.paresSobreImagen = () => {
  window.mostrarReveals();
  const dpr = window.devicePixelRatio || 1;
  limpiaMarcas();

  const encontrados = [];
  const cajasVivas = [];
  let inspeccionados = 0;

  for (const el of document.querySelectorAll("body *")) {
    if (!paintsText(el)) continue;
    inspeccionados += 1;
    if (!overImage(el)) continue;
    const { rect, visible, par } = parSobreImagen(el, encontrados.length, dpr);
    if (visible) cajasVivas.push({ el, rect });
    encontrados.push(par);
  }

  // Los `fixed` que tapan alguna de esas cajas: se marcan aparte para poder
  // retirarlos de la foto y decir cuántos eran.
  let fijos = 0;
  for (const n of document.querySelectorAll("body *")) {
    if (!tapaFijo(n, cajasVivas)) continue;
    n.setAttribute("data-tapa-la-foto", "");
    fijos += 1;
  }

  return {
    dpr,
    viewport: [window.innerWidth, window.innerHeight],
    inspeccionados,
    fijosRetirados: fijos,
    encontrados,
    ancla: buscaElAncla(dpr),
  };
};
