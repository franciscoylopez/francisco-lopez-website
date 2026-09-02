/** ¿Son el mismo color pintado? Se compara redondeado, que es como se pinta. */
const mismoColor = (a, b) =>
  Math.round(a[0]) === Math.round(b[0]) &&
  Math.round(a[1]) === Math.round(b[1]) &&
  Math.round(a[2]) === Math.round(b[2]) &&
  a[3] === b[3];

/**
 * El hallazgo de UN par de hermanos, o `null` si no hay ninguno. Se recorren las
 * tres propiedades de color y basta con que una difiera y su gris coincida.
 */
function hallazgoDelPar(k, ref, el, csRef, cs) {
  for (const prop of COLOR_PROPS) {
    // UN BORDE QUE NO SE PINTA NO CODIFICA NADA (2026-09-02). `borderTopColor`
    // tiene valor aunque el ancho sea 0: sin esta guarda, dos elementos con cero
    // borde y distinto `--border` heredado salían marcados como si el filete
    // distinguiera algo. Fue el otro falso positivo de la calibración.
    if (prop === "borderTopColor" && !dibujaBorde(csRef, cs)) continue;
    const a = paint(csRef[prop]);
    const b = paint(cs[prop]);
    // Dos transparentes no son un par de colores.
    if (a[3] === 0 && b[3] === 0) continue;
    if (mismoColor(a, b)) continue;

    const dGris = Math.abs(grisDe(a) - grisDe(b));
    if (dGris > EPSILON_GRIS) continue;

    return {
      grupo: k,
      prop,
      a: `rgb(${a.slice(0, 3).map(Math.round).join(",")})`,
      b: `rgb(${b.slice(0, 3).map(Math.round).join(",")})`,
      gris: Math.round(dGris * 1000) / 1000,
      ejemplo: label(ref),
      texto: (ref.textContent || "").trim().slice(0, 30),
      otro: (el.textContent || "").trim().slice(0, 30),
    };
  }
  return null;
}

/**
 * Un grupo de hermanos comparables. Se compara cada miembro con el primero: basta
 * con que UNO se distinga solo por tono para que el grupo tenga el problema.
 * Devuelve cuántos pares ha mirado, que es la mitad de la cobertura.
 */
function comparaGrupo(k, miembros, hallazgos) {
  const [ref, ...resto] = miembros;
  const csRef = getComputedStyle(ref);
  let pares = 0;

  for (const el of resto) {
    pares += 1;
    const cs = getComputedStyle(el);
    // ¿Difieren en algo que sobreviva al gris? Entonces no hay hallazgo.
    if (FORMA_PROPS.some((p) => cs[p] !== csRef[p])) continue;
    const hallazgo = hallazgoDelPar(k, ref, el, csRef, cs);
    if (hallazgo) hallazgos.push(hallazgo);
  }
  return pares;
}

window.colorSolo = () => {
  const congelar = window.freezeMotion();
  window.mostrarReveals();

  const hallazgos = [];
  let gruposMirados = 0;
  let paresComparados = 0;

  for (const [k, miembros] of gruposComparables()) {
    if (miembros.length < 2) continue;
    gruposMirados += 1;
    paresComparados += comparaGrupo(k, miembros, hallazgos);
  }

  congelar();
  return {
    tema: document.documentElement.classList.contains("dark")
      ? "oscuro"
      : "claro",
    // La cifra de cobertura, por la misma razón que el resto de este detector: sin
    // ella, uno que dejara de encontrar grupos se leería como un aprobado.
    grupos: gruposMirados,
    pares: paresComparados,
    hallazgos,
  };
};
