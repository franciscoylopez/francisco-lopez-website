/**
 * ¿El artefacto publicado corresponde a su fuente? — `npm run check:artefacto`, en CI.
 *
 * El porqué y el método, en `scripts/artefacto/fingerprint.ts`. Aquí solo el veredicto.
 *
 * Y AFIRMA CUÁNTO HA MIRADO. Un guardián que no encuentra nada y calla parece un
 * aprobado: es la lección que este repo ya se ha encontrado cinco veces.
 */
import { existsSync, readFileSync, statSync } from "node:fs";

import {
  ARTEFACTO,
  artefactoFingerprint,
  FUENTE,
  HUELLA_PATH,
} from "./artefacto/fingerprint";

/**
 * Los pares fuente→producto que este guardián vigila. LA CIFRA DEL MENSAJE SALE DE
 * AQUÍ, NO DE UN LITERAL: decía «1 artefacto» a mano, así que el día que hubiera un
 * segundo `.mmd` el guardián seguiría afirmando que ha mirado uno — que es la forma
 * fina del fallo de «afirmar cuánto has mirado», y la que no se ve porque el número
 * es correcto hasta que deja de serlo. Mismo arreglo que ya llevaba `check-cv-fresh.ts`.
 */
const PARES = [{ fuente: FUENTE, producto: ARTEFACTO }];

const faltan = PARES.flatMap((p) => [p.fuente, p.producto]).filter(
  (p) => !existsSync(p),
);
if (faltan.length) {
  console.error(`check:artefacto — faltan archivos: ${faltan.join(" · ")}`);
  console.error("Genera el artefacto con `npm run artefacto`.");
  process.exit(1);
}

if (!existsSync(HUELLA_PATH)) {
  console.error(
    `check:artefacto — no hay sello en ${HUELLA_PATH}, así que no se puede saber ` +
      "si el SVG corresponde a su fuente. Regenera con `npm run artefacto`.",
  );
  process.exit(1);
}

const esperada = artefactoFingerprint();
const sellada = readFileSync(HUELLA_PATH, "utf8").trim();

if (sellada !== esperada) {
  console.error(
    "check:artefacto — EL ARTEFACTO PUBLICADO NO CORRESPONDE A SU FUENTE.\n\n" +
      `  sello de ${HUELLA_PATH} : ${sellada.slice(0, 16)}…\n` +
      `  par fuente→producto actual        : ${esperada.slice(0, 16)}…\n\n` +
      "Uno de los dos ha cambiado sin el otro. Los dos caminos posibles:\n" +
      `  · se editó ${FUENTE} y no se regeneró el SVG;\n` +
      `  · se editó ${ARTEFACTO} a mano, y es un archivo GENERADO.\n\n` +
      "En los dos casos el arreglo es el mismo: `npm run artefacto`, y commitear\n" +
      "el SVG junto a su sello.",
  );
  process.exit(1);
}

// El metro afirma cuánto ha mirado (y no al revés).
const kb = Math.round(statSync(ARTEFACTO).size / 1024);
console.log(
  `check:artefacto — ${PARES.length} ${PARES.length === 1 ? "artefacto comprobado" : "artefactos comprobados"} contra su fuente · ${kb} KB · ` +
    `huella ${esperada.slice(0, 16)}…`,
);
console.log("✓ El artefacto publicado sale de su .mmd y de su saneador.");
