// Huella de lo que ENTRA en el CV — `npm run check:cv`.
//
// EL HUECO QUE TAPA, y no es hipotético: pasó el 2026-08-18. Los hechos y los
// bullets del CV tienen fuente única desde D57/D58, así que la web y el PDF no
// pueden decir cosas distintas… mientras el PDF se regenere. Pero **el PDF es un
// artefacto COMMITEADO**: al corregir el sector de KUOTIP en
// `content/experience-copy/`, los dos PDFs de `public/cv/` se quedaron viejos en
// silencio y ningún check lo vio — ni el typecheck, ni el linter, ni `gate:html`,
// ni `check:experiencias`. La fuente única garantiza que no haya DOS verdades;
// no garantiza que la copia impresa esté al día.
//
// POR QUÉ UNA HUELLA DE ENTRADAS Y NO COMPARAR LOS PDFs. Porque **el PDF no es
// determinista**: regenerarlo sin cambiar nada da otro hash (react-pdf sella
// fecha e ids en la salida). Medido antes de elegir el método. Así que lo que se
// sella es el objeto ya resuelto que se le pasa al render — el mismo que produce
// `assemble()`, los dos idiomas.
//
// LO QUE ESTA HUELLA NO CUBRE, dicho para que no se dé por cubierto: los ESTILOS
// de `generate.tsx`. Un cambio de márgenes o de tipografía cambia el PDF y no
// cambia esta huella. Es deliberado: hashear el fuente del generador haría fallar
// el gate por un comentario, y quien toca los estilos está mirando el PDF de
// todas formas. Lo que se protege es el camino silencioso —tocar el contenido en
// otro archivo y no acordarse del CV—, que es el que falló.

import { createHash } from "node:crypto";

import { content as esContent } from "../../content/cv/content.es";
import { content as enContent } from "../../content/cv/content.en";

import { assemble } from "./assemble";

/** Dónde vive el sello, junto a los PDFs que describe. */
export const HUELLA_PATH = "public/cv/cv.huella";

/**
 * La huella de los dos CV. `JSON.stringify` sobre el objeto ensamblado es estable
 * porque el orden de las claves lo fija el literal de `assemble()`, no un
 * recorrido de objeto.
 */
export function cvFingerprint(): string {
  const datos = {
    es: assemble("es", esContent),
    en: assemble("en", enContent),
  };
  return createHash("sha256").update(JSON.stringify(datos)).digest("hex");
}
