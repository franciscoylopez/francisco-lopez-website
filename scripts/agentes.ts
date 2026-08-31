/**
 * La nota de preparación agéntica que el artículo publica, SELLADA en vez de
 * tecleada — `npm run agentes:sellar`.
 *
 * POR QUÉ EXISTE. §s08 publica una tarjeta «dato en vivo» con la nota de
 * `ora.ai`, y D102 no deja teclear una cifra dentro de un `livestat`: se deriva o
 * se sella. Esta no se puede derivar —la mide un tercero contra producción, como
 * la de PageSpeed (D49/D99)—, así que se sella con su fecha pegada. Mismo
 * mecanismo y mismo reparto que `scripts/psi/sello.ts`.
 *
 * Y AHORA SE PUEDE, que es lo que lo hace barato: el informe es una API (D165).
 * `POST https://ora.ai/api/scan` devuelve los 125 checks con su `status` y su
 * cifra en un comando, sin captura recortada ni transcripción a ojo.
 *
 * LA TRAMPA QUE ESTE SCRIPT EXISTE PARA NO PISAR (D166). Ese POST **no escanea
 * sin `force: true`**: devuelve el informe GUARDADO con `analysisStatus:
 * complete` y su `durationMs`, o sea con toda la pinta de una pasada nueva. Y el
 * `scannedAt` del payload no es la hora del escaneo, así que mirarlo no salva de
 * nada. Lo que sí lo dice es `servedFromCache`, y por eso es la comprobación que
 * manda aquí: sin ella, este sello publicaría la cifra de antes del despliegue
 * creyendo que es la de después, que es exactamente lo que pasó el 2026-08-31 y
 * casi hace publicar lo contrario de lo que había ocurrido.
 *
 * NO SELLA UNA PASADA PARCIAL, igual que el de PSI y por el mismo motivo: una
 * nota sacada de un análisis a medias, de un Preview o de la caché se lee igual
 * que una buena y es falsa. Dice por qué no ha sellado y deja el sello anterior.
 */
import { writeFileSync } from "node:fs";

import { AGENTES_REGISTRO } from "../lib/figures";

/** El sitio que describe el sello. Medir otro no lo cambia. */
const PRODUCCION = "https://franciscolopez.es";
const ENDPOINT = "https://ora.ai/api/scan";

interface Check {
  id?: string;
  status?: string;
}
interface Capa {
  name?: string;
  checks?: Check[];
}
interface Informe {
  finalUrl?: string;
  score?: number;
  maxScore?: number;
  grade?: string;
  layers?: Capa[];
  analysisStatus?: string;
  pendingChecks?: unknown[];
  servedFromCache?: boolean;
  resultAgeSeconds?: number;
}

async function pide(): Promise<Informe> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json" },
    // `force` y no `refresh`: el segundo no hace nada y el informe vuelve de la
    // caché con pinta de recién medido (D166).
    body: JSON.stringify({ url: PRODUCCION, force: true }),
  });
  if (!res.ok) throw new Error(`${ENDPOINT} respondió ${res.status}`);
  return (await res.json()) as Informe;
}

/**
 * POR QUÉ NO SE SELLA, o `null` si sí. En retornos tempranos y en el orden en
 * que se comprueban, como `porQueNo` de PSI.
 */
function porQueNo(i: Informe, checks: Check[]): string | null {
  const destino = (i.finalUrl ?? "").replace(/\/$/, "");
  if (destino !== PRODUCCION) {
    return `el informe describe ${destino || "un destino desconocido"} y el sello solo describe producción`;
  }
  if (i.servedFromCache) {
    const edad = i.resultAgeSeconds ?? 0;
    return (
      `el informe viene de la CACHÉ (${Math.round(edad / 60)} min), así que no ` +
      `describe el despliegue de ahora. Es la trampa de D166: sin \`force\`, o con ` +
      `el escaneo aún en curso, la respuesta se lee igual que una pasada nueva`
    );
  }
  if (i.analysisStatus !== "complete") {
    return `el análisis está en «${i.analysisStatus ?? "?"}» y no en «complete»`;
  }
  if (i.pendingChecks?.length) {
    return `quedan ${i.pendingChecks.length} comprobación(es) pendientes`;
  }
  if (typeof i.score !== "number" || typeof i.grade !== "string") {
    return "el informe no trae nota o no trae grado";
  }
  // Guarda de cero: un informe con cero checks se lee como un aprobado.
  if (!checks.length) return "el informe no trae ni una comprobación";
  return null;
}

async function main() {
  console.log(`Escaneando ${PRODUCCION} en ora.ai (force)…\n`);
  const informe = await pide();
  const checks = (informe.layers ?? []).flatMap((c) => c.checks ?? []);
  const noAplican = checks.filter((c) => c.status === "na").length;

  const motivo = porQueNo(informe, checks);
  if (motivo) {
    console.log(`  Sin sellar: ${motivo}.`);
    console.log(`  ${AGENTES_REGISTRO} se queda como estaba.`);
    process.exitCode = 1;
    return;
  }

  const registro = {
    fecha: new Date().toISOString().slice(0, 10),
    nota: informe.score,
    grado: informe.grade,
    checks: checks.length,
    // Cuántas de esas comprobaciones marca el propio informe como no aplicables.
    // Va en el sello porque el artículo la publica al lado de la nota: es lo que
    // impide leer un 78 como un suspenso (D157).
    noAplican,
  };

  writeFileSync(AGENTES_REGISTRO, `${JSON.stringify(registro, null, 2)}\n`);
  console.log(
    `  Sellado en ${AGENTES_REGISTRO} — ${registro.nota}/100, grado ${registro.grado}, ` +
      `${registro.checks} comprobaciones (${noAplican} no aplican), ${registro.fecha}.`,
  );
  console.log("  El artículo publica esa cifra con esa fecha (D102).");
}

main().catch((e: unknown) => {
  console.error(`\nNo se ha podido leer el informe: ${String(e)}`);
  console.error(`${AGENTES_REGISTRO} se queda como estaba.`);
  process.exit(1);
});
