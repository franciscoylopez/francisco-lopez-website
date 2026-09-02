/**
 * EL PUNTO 6 DEL CHECKLIST, DETECTADO EN VEZ DE MIRADO — la mitad in-page.
 *
 * QUÉ PREGUNTA CONTESTA. «Nada codificado solo por color»: que ningún estado o
 * categoría se distinga **únicamente** por el tono. Era la única fila de la
 * Definition of Done sin forma automática, y hasta hoy se comprobaba abriendo un
 * simulador de daltonismo y mirando.
 *
 * POR QUÉ NO HACE FALTA UN FILTRO NI UNA CAPTURA. Una simulación de acromatopsia
 * es, en el fondo, quedarse con la **luminancia**. Y la luminancia se puede
 * calcular: dos colores distintos que en gris coinciden son exactamente los que
 * pierden la información. Así que el detector no compara dos imágenes —que sería
 * ruidoso y necesitaría rasterizar—: compara los colores que el navegador pinta y
 * pregunta si su gris es el mismo. Mismo criterio, sin cámara.
 *
 * QUÉ CUENTA COMO «GRUPO QUE HAY QUE DISTINGUIR». Hermanos comparables: mismo
 * padre, misma etiqueta y misma forma —el conjunto de clases sin las de estado—,
 * más los grupos que el propio DOM declara (`role="tab"`, `aria-selected`,
 * `aria-current`, `data-state`). Fuera de un grupo así no hay nada que confundir:
 * un texto suelto de otro color no codifica nada, solo es de otro color.
 *
 * CUÁNDO SE MARCA, y las tres condiciones importan:
 *
 *   1. Dos miembros del grupo difieren en una propiedad de COLOR (texto, fondo o
 *      borde).
 *   2. El **gris** de esos dos colores coincide dentro de un margen: en
 *      acromatopsia serían el mismo píxel.
 *   3. Y no difieren en NINGUNA otra cosa que sobreviva al gris —peso, subrayado,
 *      grosor de borde, contenido—. Si el estado además engorda la letra o dibuja
 *      un filete, la información no depende del color y no hay hallazgo.
 *
 * LO QUE NO CUBRE, dicho para que no se dé por cubierto: la forma. Dos iconos
 * distintos del mismo color gris son distinguibles y esto no los mira; y dos
 * iconos IGUALES de dos colores con gris distinto pasan, aunque a un ojo
 * dicromático le cueste. El gris es el suelo, no el techo.
 */
const COLOR_PROPS = ["color", "backgroundColor", "borderTopColor"];

/** Las que sobreviven al gris: si alguna difiere, el estado no depende del tono. */
const FORMA_PROPS = [
  "fontWeight",
  "fontStyle",
  "textDecorationLine",
  "borderTopWidth",
  "borderTopStyle",
  "borderRadius",
  "outlineWidth",
  "textTransform",
];

/** Cuánto pueden separarse dos grises y seguir siendo «el mismo» a la vista. */
const EPSILON_GRIS = 0.02;

/** ¿Los DOS pintan filete arriba? Si alguno no, su color no dice nada. */
const dibujaBorde = (a, b) =>
  parseFloat(a.borderTopWidth) > 0 &&
  a.borderTopStyle !== "none" &&
  parseFloat(b.borderTopWidth) > 0 &&
  b.borderTopStyle !== "none";

function grisDe([r, g, b]) {
  const lin = [r, g, b]
    .map((v) => v / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}

/** Las clases sin las que describen un estado: dos pestañas son «la misma forma». */
const ESTADO = /^(is-|data-|aria-)|active|selected|current|open|checked/i;
const forma = (el) =>
  (el.getAttribute("class") || "")
    .split(/\s+/)
    .filter((c) => c && !ESTADO.test(c))
    .sort()
    .join(" ");

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
window.colorSoloCasoMalo = () => {
  window.mostrarReveals();

  // La víctima se elige EN LOS TÉRMINOS DEL DETECTOR: un grupo que él mira, con
  // dos miembros que hoy no difieren en nada que sobreviva al gris. Si difirieran,
  // el hallazgo quedaría suprimido con razón y el auto-test suspendería sin que
  // hubiera nada roto — que es exactamente lo que pasó al escribirlo.
  let objetivo = null;
  for (const miembros of gruposComparables().values()) {
    if (miembros.length < 2) continue;
    const a = getComputedStyle(miembros[0]);
    const b = getComputedStyle(miembros[1]);
    if (FORMA_PROPS.some((p) => a[p] !== b[p])) continue;
    if (paint(a.color)[3] === 0) continue;
    objetivo = miembros;
    break;
  }
  if (!objetivo)
    return { inyectado: false, motivo: "no hay grupo que el detector mire" };

  const ref = paint(getComputedStyle(objetivo[0]).color);
  const L = grisDe(ref);

  // Se busca un color de la misma luminancia y tono distinto barriendo una rejilla
  // gruesa. No hace falta finura: solo que exista uno y que su gris coincida.
  let elegido = null;
  for (let r = 0; r <= 255 && !elegido; r += 5) {
    for (let g = 0; g <= 255 && !elegido; g += 5) {
      for (let b = 0; b <= 255; b += 5) {
        if (Math.abs(grisDe([r, g, b]) - L) > 0.002) continue;
        const distinto =
          Math.abs(r - ref[0]) + Math.abs(g - ref[1]) + Math.abs(b - ref[2]) >
          60;
        if (!distinto) continue;
        elegido = [r, g, b];
        break;
      }
    }
  }
  if (!elegido)
    return { inyectado: false, motivo: "sin color equivalente en gris" };

  objetivo[1].style.color = `rgb(${elegido.join(",")})`;
  return {
    inyectado: true,
    donde: label(objetivo[1]),
    de: `rgb(${ref.slice(0, 3).map(Math.round).join(",")})`,
    a: `rgb(${elegido.join(",")})`,
  };
};

/**
 * Los grupos de hermanos comparables. **Lo usan el detector Y su caso malo**, y
 * eso no es aseo: la primera versión del caso malo elegía su víctima por su cuenta
 * —el primer `p`/`li`/`span`/`a` con hermanos— y caía en grupos que el detector ni
 * mira, así que inyectaba un incumplimiento donde nadie iba a buscarlo y el
 * auto-test suspendía sin que hubiera nada roto. Un caso malo tiene que estar
 * escrito en los términos del guardián que pone a prueba.
 *
 * HERMANOS DE VERDAD, NO «HIJOS DE ALGÚN UL» (2026-09-02, calibrado contra la
 * pasada limpia). La primera versión agrupaba por el NOMBRE de la etiqueta del
 * padre, así que metía en un mismo grupo todos los `li` de la página: los de una
 * lista y los de otra, que no tienen por qué parecerse en nada. Con eso, un
 * `--border` que cambia porque las dos listas están sobre superficies distintas se
 * leía como «un estado codificado por color». El padre tiene que ser el mismo
 * NODO, y por eso lleva un identificador propio.
 */
function gruposComparables() {
  const grupos = new Map();
  let nPadre = 0;
  const idPadre = new WeakMap();
  const padreDe = (el) => {
    const p = el.parentElement;
    if (!idPadre.has(p)) idPadre.set(p, (nPadre += 1));
    return idPadre.get(p);
  };
  const clave = (el) => `${padreDe(el)}|${el.tagName}|${forma(el)}`;

  // Solo lo que se ve y ocupa sitio: un elemento oculto no codifica nada.
  for (const el of document.querySelectorAll("body *")) {
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.display === "none") continue;
    if (parseFloat(cs.opacity) === 0) continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    if (!el.parentElement) continue;

    const k = clave(el);
    if (!grupos.has(k)) grupos.set(k, []);
    grupos.get(k).push(el);
  }
  return grupos;
}

window.colorSolo = () => {
  const congelar = window.freezeMotion();
  window.mostrarReveals();

  const grupos = gruposComparables();

  const hallazgos = [];
  let gruposMirados = 0;
  let paresComparados = 0;

  for (const [k, miembros] of grupos) {
    if (miembros.length < 2) continue;
    gruposMirados += 1;

    // Se compara cada miembro con el primero: basta con que UNO se distinga solo
    // por tono para que el grupo tenga el problema.
    const [ref, ...resto] = miembros;
    const csRef = getComputedStyle(ref);

    for (const el of resto) {
      paresComparados += 1;
      const cs = getComputedStyle(el);

      // ¿Difieren en algo que sobreviva al gris? Entonces no hay hallazgo.
      const otraSeña = FORMA_PROPS.some((p) => cs[p] !== csRef[p]);
      if (otraSeña) continue;

      for (const prop of COLOR_PROPS) {
        // UN BORDE QUE NO SE PINTA NO CODIFICA NADA (2026-09-02). `borderTopColor`
        // tiene valor aunque el ancho sea 0: sin esta guarda, dos elementos con
        // cero borde y distinto `--border` heredado salían marcados como si el
        // filete distinguiera algo. Fue el otro falso positivo de la calibración.
        if (prop === "borderTopColor" && !dibujaBorde(csRef, cs)) continue;
        const a = paint(csRef[prop]);
        const b = paint(cs[prop]);
        // Dos transparentes no son un par de colores.
        if (a[3] === 0 && b[3] === 0) continue;
        const mismos =
          Math.round(a[0]) === Math.round(b[0]) &&
          Math.round(a[1]) === Math.round(b[1]) &&
          Math.round(a[2]) === Math.round(b[2]) &&
          a[3] === b[3];
        if (mismos) continue;

        const dGris = Math.abs(grisDe(a) - grisDe(b));
        if (dGris > EPSILON_GRIS) continue;

        hallazgos.push({
          grupo: k,
          prop,
          a: `rgb(${a.slice(0, 3).map(Math.round).join(",")})`,
          b: `rgb(${b.slice(0, 3).map(Math.round).join(",")})`,
          gris: Math.round(dGris * 1000) / 1000,
          ejemplo: label(ref),
          texto: (ref.textContent || "").trim().slice(0, 30),
          otro: (el.textContent || "").trim().slice(0, 30),
        });
        break;
      }
    }
  }

  congelar();
  return {
    tema: document.documentElement.classList.contains("dark")
      ? "oscuro"
      : "claro",
    // La cifra de cobertura, por la misma razón que el resto de este archivo: sin
    // ella, un detector que dejara de encontrar grupos se leería como un aprobado.
    grupos: gruposMirados,
    pares: paresComparados,
    hallazgos,
  };
};
