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
