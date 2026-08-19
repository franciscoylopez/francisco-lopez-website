// Huella del artefacto de Emendu — la lee `npm run check:artefacto`, la sella
// `npm run artefacto`.
//
// EL HUECO QUE TAPA, y es D60 por segunda vez. `content/artefactos/emendu-mdm.svg`
// es un ARTEFACTO COMMITEADO DERIVADO DE UNA FUENTE: el `.mmd` más el saneador
// `scripts/artefacto-svg.ts`. Exactamente la familia que D60 nombró para el CV —
// «una fuente única evita dos verdades; no mantiene al día una copia impresa»— y
// exactamente la que ya falló una vez por esta vía: D54 registra que el render
// manual publicó el diagrama SIN SANEAR, y de ahí salió `npm run artefacto`. Lo
// que quedaba sin cubrir es el camino silencioso: tocar el `.mmd` y no acordarse
// de regenerar. Ni el typecheck, ni el linter, ni `gate:html` lo verían.
//
// POR QUÉ AQUÍ SÍ SE SELLA LA SALIDA Y EN EL CV NO. Porque se midió, y salió al
// revés que el PDF. El CV no es determinista (react-pdf sella fecha e ids, así
// que regenerarlo sin cambiar nada da otro hash) y por eso allí se sella lo que
// ENTRA. El artefacto sí lo es: regenerado sin tocar nada da el mismo sha256
// byte a byte (comprobado el 2026-08-19 sobre e32bb0bc…). Y eso permite un gate
// ESTRICTAMENTE MÁS FUERTE que el del CV, porque sellar la salida cubre además lo
// que el del CV deja fuera a propósito: un cambio en el SANEADOR. Si alguien
// cambia cómo se remapean los colores o cómo se calcula el `viewBox`, el SVG
// cambia y el sello deja de cuadrar.
//
// LO QUE NO CUBRE, dicho para que no se dé por cubierto: que el SVG sea BUENO. El
// `viewBox` es de las pocas cosas de un SVG que no se pueden verificar sin verlo
// (D54, ampliado: `cajaDelGrafo` pisaba un `viewBox` mejor que el suyo y el grafo
// salía en dos tercios de su lienzo). Esto comprueba correspondencia, no calidad.

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";

/** La fuente y su producto. Si aparece un segundo artefacto, esto pasa a ser una lista. */
export const FUENTE = "content/artefactos/emendu-mdm.mmd";
export const ARTEFACTO = "content/artefactos/emendu-mdm.svg";

/** Dónde vive el sello, junto al artefacto que describe. */
export const HUELLA_PATH = "content/artefactos/artefacto.huella";

/**
 * La huella del par fuente→producto. Se hashean los dos: el `.mmd` para detectar
 * que la fuente cambió, y el `.svg` para detectar que el producto no la siguió (o
 * que lo editó alguien a mano, que en un archivo generado también es un fallo).
 */
export function artefactoFingerprint(): string {
  const mmd = readFileSync(FUENTE, "utf8");
  const svg = readFileSync(ARTEFACTO, "utf8");
  return createHash("sha256")
    .update(JSON.stringify({ mmd, svg }))
    .digest("hex");
}

// `npm run artefacto` termina llamando aquí con --seal, para que regenerar y
// sellar no puedan separarse. Un sello que hay que acordarse de escribir es un
// sello que se queda viejo, que es el fallo que esto viene a cerrar.
if (process.argv.includes("--seal")) {
  const huella = artefactoFingerprint();
  writeFileSync(HUELLA_PATH, `${huella}\n`, "utf8");
  console.log(`Artefacto sellado en ${HUELLA_PATH} — ${huella.slice(0, 16)}…`);
}
