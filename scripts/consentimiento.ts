/**
 * ¿Qué fracción del tráfico acepta? — `npm run consentimiento`.
 *
 * POR QUÉ UN SCRIPT Y NO UNA RUTA. La cifra la lee una persona, una vez cada
 * cierre y durante la ventana del lanzamiento. Publicarla en una ruta añadiría una
 * superficie pública a un sitio que acaba de añadir una (la Server Action del
 * contador) y no compraría nada: leerla desde la terminal usa las mismas
 * credenciales que ya tiene el proyecto y no expone nada a nadie.
 *
 * QUÉ AFIRMA. Los tres contadores, la tasa y —esto es la mitad importante— si el
 * almacén está configurado. Un cero con almacén y un cero sin almacén son cosas
 * distintas y este script no las imprime igual: es D71 en su versión más barata de
 * evitar, «no hay datos» que no distingue entre cero filas y mal configurado.
 *
 * DE DÓNDE SACA LAS CREDENCIALES. De `.env.local` si existe, y si no del entorno.
 * Fuera de Vercel no hay inyección automática, así que sin ellas dice qué falta en
 * vez de imprimir ceros.
 */
import { existsSync, readFileSync } from "node:fs";

import {
  SALVEDAD_TASA,
  tasaDeAceptacion,
  type Contadores,
} from "../lib/consent-metrics";

// `.env.local` a mano: el script corre con `tsx`, fuera del cargador de Next.
if (existsSync(".env.local")) {
  for (const linea of readFileSync(".env.local", "utf8").split("\n")) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(linea);
    if (m?.[1] && !process.env[m[1]]) {
      process.env[m[1]] = (m[2] ?? "").replace(/^["']|["']$/g, "");
    }
  }
}

async function main() {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    console.error(
      "\nconsentimiento — NO HAY ALMACÉN CONFIGURADO, así que no hay cifra que dar.\n\n" +
        "Esto NO es una tasa de cero: es la ausencia del dato, y son cosas distintas.\n" +
        "Faltan `KV_REST_API_URL` y `KV_REST_API_TOKEN` (o sus gemelas\n" +
        "`UPSTASH_REDIS_REST_*`). Se traen del proyecto con `vercel env pull .env.local`\n" +
        "una vez la integración de Upstash esté creada en Vercel.\n",
    );
    process.exit(1);
  }

  // El entorno va en la clave (ver `lib/consent-store.ts`), así que hay que
  // elegirlo al leer. POR DEFECTO PRODUCTION y no «todos sumados»: la cifra que
  // significa algo es la de producción, y un total que mezcla las pruebas de
  // Preview con las visitas reales sería exactamente el dato envenenado que la
  // separación existe para evitar.
  const entorno =
    process.argv.find((a) => a.startsWith("--entorno="))?.split("=")[1] ??
    "production";

  const PREFIJO = `flm:consent:${entorno}:`;
  const CLAVES = ["visto", "aceptado", "rechazado"] as const;

  const res = await fetch(
    `${url}/MGET/${CLAVES.map((c) => encodeURIComponent(PREFIJO + c)).join("/")}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );

  if (!res.ok) {
    console.error(
      `\nconsentimiento — el almacén contestó ${res.status}. Sin cifra, y tampoco es un cero.\n`,
    );
    process.exit(1);
  }

  const cuerpo = (await res.json()) as { result?: unknown };
  const crudo = Array.isArray(cuerpo.result) ? cuerpo.result : [];
  const n = (i: number): number => {
    const v = Number(crudo[i]);
    return Number.isFinite(v) ? v : 0;
  };

  const contadores: Contadores = {
    visto: n(0),
    aceptado: n(1),
    rechazado: n(2),
  };

  const tasa = tasaDeAceptacion(contadores);
  const sinDecidir =
    contadores.visto - contadores.aceptado - contadores.rechazado;

  console.log(
    `\nconsentimiento — entorno «${entorno}» · ${contadores.visto} navegador(es) vieron el diálogo:`,
  );
  console.log(
    `  ${String(contadores.aceptado).padStart(6)}  aceptaron analíticas`,
  );
  console.log(`  ${String(contadores.rechazado).padStart(6)}  las rechazaron`);
  console.log(
    `  ${String(sinDecidir).padStart(6)}  se fueron sin decidir` +
      (sinDecidir < 0 ? "  ⚠ negativo: ver la salvedad de abajo" : ""),
  );

  if (tasa === null) {
    console.log(
      "\n  Todavía no hay denominador, así que no hay tasa. Con almacén y sin\n" +
        "  visitas esto es correcto: dice que nadie ha llegado, no que nadie acepte.\n",
    );
  } else {
    const pct = (tasa * 100).toFixed(1);
    console.log(
      `\n  Tasa de aceptación: ${pct} %  ·  la analítica ve ${pct} de cada 100 visitas\n` +
        `  ${SALVEDAD_TASA}\n`,
    );
  }
}

// El error se imprime, no se lanza: una traza de Node encima de un mensaje que ya
// explica qué hacer solo entierra la explicación.
void main().catch((e: unknown) => {
  console.error(`
${e instanceof Error ? e.message : String(e)}
`);
  process.exit(1);
});
