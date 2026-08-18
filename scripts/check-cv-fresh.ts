/**
 * ¿Los PDFs del CV corresponden a la fuente? — `npm run check:cv`, en CI.
 *
 * El porqué y el método, en `scripts/cv/fingerprint.ts`. Aquí solo el veredicto.
 *
 * Y AFIRMA CUÁNTO HA MIRADO: imprime la huella y los PDFs que ha comprobado. Un
 * guardián que no encuentra nada y calla parece un aprobado — es la lección que
 * este repo ya se ha encontrado tres veces.
 */
import { existsSync, readFileSync } from "node:fs";

import { cvFingerprint, HUELLA_PATH } from "./cv/fingerprint";

const PDFS = [
  "public/cv/francisco-lopez-cv-es.pdf",
  "public/cv/francisco-lopez-cv-en.pdf",
];

const faltan = PDFS.filter((p) => !existsSync(p));
if (faltan.length) {
  console.error(`check:cv — faltan los PDFs: ${faltan.join(" · ")}`);
  console.error("Genera el CV con `npm run cv`.");
  process.exit(1);
}

const esperada = cvFingerprint();

if (!existsSync(HUELLA_PATH)) {
  console.error(
    `check:cv — no hay sello en ${HUELLA_PATH}, así que no se puede saber si los ` +
      `PDFs corresponden a la fuente. Regenera con \`npm run cv\`.`,
  );
  process.exit(1);
}

const sellada = readFileSync(HUELLA_PATH, "utf8").trim();

if (sellada !== esperada) {
  console.error(
    "check:cv — LOS PDFs DEL CV NO CORRESPONDEN A LA FUENTE.\n\n" +
      `  sello de public/cv/ : ${sellada.slice(0, 16)}…\n` +
      `  fuente actual       : ${esperada.slice(0, 16)}…\n\n` +
      "Algo que alimenta el CV ha cambiado y los PDFs no se han vuelto a generar.\n" +
      "Los sospechosos, por frecuencia: `content/experience-copy/` (rol, periodo,\n" +
      "sector, reporting o un bullet), `content/cv/content.{es,en}.ts` (summary,\n" +
      "hitos, skills) o la formación y el toolkit del diccionario.\n\n" +
      "Arréglalo con `npm run cv` y commitea los PDFs y el sello.",
  );
  process.exit(1);
}

console.log(
  `check:cv — 2 PDFs comprobados contra la fuente · huella ${esperada.slice(0, 16)}…`,
);
console.log("✓ Los PDFs del CV corresponden a lo que dice la web.");
