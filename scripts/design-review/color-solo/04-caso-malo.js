/**
 * EL CASO MALO, INYECTADO EN LA PÁGINA — `window.colorSoloCasoMalo()`.
 *
 * POR QUÉ EXISTE. Este detector va a decir «cero» casi siempre, porque el sitio ya
 * cumple el punto 6: el barrido manual del 2026-09-02 salió limpio. Y un guardián
 * cuyo resultado normal es cero es exactamente el que se rompe sin que nadie lo
 * note (D70). Así que sabe fabricarse su propio incumplimiento y comprobar que lo
 * caza.
 *
 * QUÉ INYECTA. Coge dos hermanos comparables y le cambia el color del texto al
 * segundo por otro **de la misma luminancia y distinto tono**: en color se ven
 * distintos, en acromatopsia son el mismo píxel. No toca nada más, porque un caso
 * malo que mueve dos variables no prueba ninguna.
 *
 * NO SE REVIERTE. La página se recarga en la corrida siguiente, y revertirlo aquí
 * abriría la puerta a que el detector midiera un estado intermedio.
 */

/**
 * La víctima se elige EN LOS TÉRMINOS DEL DETECTOR: un grupo que él mira, con dos
 * miembros que hoy no difieren en nada que sobreviva al gris. Si difirieran, el
 * hallazgo quedaría suprimido con razón y el auto-test suspendería sin que hubiera
 * nada roto — que es exactamente lo que pasó al escribirlo.
 */
function victimaDelCasoMalo() {
  for (const miembros of gruposComparables().values()) {
    if (miembros.length < 2) continue;
    const a = getComputedStyle(miembros[0]);
    const b = getComputedStyle(miembros[1]);
    if (FORMA_PROPS.some((p) => a[p] !== b[p])) continue;
    if (paint(a.color)[3] === 0) continue;
    return miembros;
  }
  return null;
}

/**
 * Un color de la misma luminancia que `ref` y tono claramente distinto, barriendo
 * una rejilla gruesa. No hace falta finura: solo que exista uno y que su gris
 * coincida.
 */
function sirveDeGemelo(rgb, ref, gris) {
  if (Math.abs(grisDe(rgb) - gris) > 0.002) return false;
  const lejos =
    Math.abs(rgb[0] - ref[0]) +
    Math.abs(rgb[1] - ref[1]) +
    Math.abs(rgb[2] - ref[2]);
  return lejos > 60;
}

function colorConElMismoGris(ref) {
  const gris = grisDe(ref);
  for (let r = 0; r <= 255; r += 5) {
    for (let g = 0; g <= 255; g += 5) {
      for (let b = 0; b <= 255; b += 5) {
        if (sirveDeGemelo([r, g, b], ref, gris)) return [r, g, b];
      }
    }
  }
  return null;
}

window.colorSoloCasoMalo = () => {
  window.mostrarReveals();

  const objetivo = victimaDelCasoMalo();
  if (!objetivo) {
    return { inyectado: false, motivo: "no hay grupo que el detector mire" };
  }

  const ref = paint(getComputedStyle(objetivo[0]).color);
  const elegido = colorConElMismoGris(ref);
  if (!elegido) {
    return { inyectado: false, motivo: "sin color equivalente en gris" };
  }

  objetivo[1].style.color = `rgb(${elegido.join(",")})`;
  return {
    inyectado: true,
    donde: label(objetivo[1]),
    de: `rgb(${ref.slice(0, 3).map(Math.round).join(",")})`,
    a: `rgb(${elegido.join(",")})`,
  };
};
