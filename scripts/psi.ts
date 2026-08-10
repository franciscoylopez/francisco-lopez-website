// PageSpeed Insights desde la terminal (P46.5).
//
// POR QUÉ EXISTE. Arreglando el LCP del hero (D47) hicieron falta tres idas y
// vueltas para una sola cifra: diagnóstico en local, Francisco pasando PageSpeed a
// mano sobre el Preview, y el resultado de vuelta. Y la primera vuelta midió un
// despliegue que todavía no tenía el arreglo dentro, así que la conclusión fue
// falsa. En local NO se puede medir: la pestaña que conduce la automatización corre
// con `visibilityState: "hidden"` y el navegador no emite entradas de LCP con la
// página oculta.
//
// LO QUE IMPRIME es lo que se mira, no el informe entero: la nota, las métricas y
// —lo que de verdad importó en D47— el DESGLOSE DEL LCP POR FASES. El aviso de
// `fetchpriority` de aquella tarea era legítimo, pero la cifra que señalaba el
// problema estaba en el desglose, no en la lista de avisos.
//
// USO:
//     npm run psi -- https://…                 # móvil y escritorio
//     npm run psi -- https://… --solo=movil    # o --solo=escritorio
//
// CLAVE: la API sin clave devuelve 429 casi siempre. Se lee de `PSI_API_KEY`, del
// entorno o de `.env.local` (que está en .gitignore). Cómo obtenerla, en el README.

import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";

const ENDPOINT = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

/** Lee la clave del entorno y, si no está, de `.env.local`. Nunca se imprime. */
function apiKey(): string | undefined {
  if (process.env.PSI_API_KEY) return process.env.PSI_API_KEY;
  try {
    const linea = readFileSync(".env.local", "utf8")
      .split(/\r?\n/)
      .find((l) => l.trimStart().startsWith("PSI_API_KEY="));
    return linea?.slice(linea.indexOf("=") + 1).trim().replace(/^["']|["']$/g, "");
  } catch {
    return undefined;
  }
}

/**
 * Huella del despliegue: el hash de los assets de `/_next/static` que sirve la
 * página. NO identifica el commit —a propósito: el sitio no publica su SHA, y no
 * se le va a añadir una cabecera que lo haga— pero SÍ contesta la pregunta que
 * importa: «¿esto es el mismo build que medí antes, o ya ha entrado lo que empujé?».
 * Una URL de rama apunta al último DESPLIEGUE, que puede ir por detrás del último
 * push; en D47 eso invalidó una medición entera.
 */
async function huellaDelDespliegue(url: string) {
  const res = await fetch(url);
  const html = await res.text();
  const assets = [...html.matchAll(/\/_next\/static\/[^"']+/g)]
    .map((m) => m[0])
    .sort();
  return {
    huella: createHash("sha256")
      .update(assets.join("\n"))
      .digest("hex")
      .slice(0, 12),
    assets: assets.length,
    cache: res.headers.get("x-vercel-cache") ?? "—",
  };
}

const ms = (n: number | undefined) =>
  n === undefined ? "—" : Math.round(n) + " ms";

/**
 * Una fase del desglose del LCP. Los nombres de campo cambiaron con la auditoría:
 * Lighthouse 13 usa `label`/`duration`; la versión anterior, `phase`/`timing`. Se
 * aceptan los dos para que el script no se quede mudo con un cambio de versión.
 */
interface FaseLcp {
  label?: string;
  phase?: string;
  duration?: number;
  timing?: number;
}

interface Auditoria {
  id?: string;
  title?: string;
  score: number | null;
  scoreDisplayMode?: string;
  displayValue?: string;
  numericValue?: number;
  details?: { items?: (FaseLcp | { items?: FaseLcp[] })[] };
}

async function mide(url: string, strategy: "mobile" | "desktop", key?: string) {
  const q = new URLSearchParams({ url, strategy, category: "performance" });
  if (key) q.set("key", key);

  const res = await fetch(`${ENDPOINT}?${q}`);
  if (!res.ok) {
    const cuerpo = (await res.json().catch(() => ({}))) as {
      error?: { message?: string };
    };
    throw new Error(
      `PSI respondió ${res.status}. ${cuerpo.error?.message ?? ""}` +
        (res.status === 429 && !key
          ? "\n  → Es el límite de la API SIN CLAVE. Pon PSI_API_KEY en .env.local (ver README)."
          : ""),
    );
  }

  const j = (await res.json()) as {
    lighthouseResult: {
      fetchTime: string;
      categories: { performance: { score: number } };
      audits: Record<string, Auditoria>;
    };
  };
  const lh = j.lighthouseResult;
  const a = lh.audits;

  const titulo = strategy === "mobile" ? "MÓVIL" : "ESCRITORIO";
  console.log(`\n─── ${titulo} ───────────────────────────────`);
  console.log(
    `  Rendimiento: ${Math.round(lh.categories.performance.score * 100)}/100` +
      `   (medido ${new Date(lh.fetchTime).toLocaleString("es-ES")})`,
  );

  for (const [etiqueta, id] of [
    ["LCP", "largest-contentful-paint"],
    ["FCP", "first-contentful-paint"],
    ["TBT", "total-blocking-time"],
    ["CLS", "cumulative-layout-shift"],
    ["Speed Index", "speed-index"],
  ] as const) {
    const au = a[id];
    if (au) console.log(`  ${etiqueta.padEnd(12)} ${au.displayValue ?? "—"}`);
  }

  // El desglose del LCP: la cifra que resolvió D47. Sin él, un LCP alto no dice
  // si el problema es la red o algo que tapa el elemento después de pintarlo.
  //
  // OJO CON EL NOMBRE DE LA AUDITORÍA: en Lighthouse 13 pasó a llamarse
  // `lcp-breakdown-insight`; antes era `largest-contentful-paint-element`. La
  // primera versión de este script usaba el nombre viejo y el desglose no salía
  // —sin error, sin aviso—, que es el mismo tropiezo que el `priority` de Next 16
  // (D47): código escrito contra una API recordada en vez de comprobada. Por eso
  // ahora se buscan los dos nombres y, si no aparece ninguno, SE DICE: un desglose
  // que falta en silencio parece un desglose sin nada que contar.
  const desglose =
    a["lcp-breakdown-insight"] ?? a["largest-contentful-paint-element"];
  const tabla = desglose?.details?.items?.find((i) =>
    Array.isArray((i as { items?: unknown[] }).items),
  ) as { items?: FaseLcp[] } | undefined;

  if (tabla?.items?.length) {
    const total = tabla.items.reduce(
      (s, f) => s + (f.duration ?? f.timing ?? 0),
      0,
    );
    console.log("  Desglose del LCP:");
    for (const f of tabla.items) {
      const t = f.duration ?? f.timing ?? 0;
      const pct = total ? Math.round((t / total) * 100) : 0;
      console.log(
        `    ${(f.label ?? f.phase ?? "").padEnd(24)} ${ms(t).padStart(9)}   ${String(pct).padStart(3)}%`,
      );
    }
  } else {
    console.log(
      "  Desglose del LCP: NO DISPONIBLE — ¿cambió otra vez el id de la auditoría?",
    );
  }

  const fallan = Object.entries(a)
    .filter(
      ([, au]) =>
        au.score !== null &&
        au.score < 0.9 &&
        au.scoreDisplayMode !== "informative" &&
        au.scoreDisplayMode !== "notApplicable" &&
        au.scoreDisplayMode !== "manual",
    )
    .map(([id, au]) => `    · ${au.title ?? id}`);
  console.log(
    fallan.length
      ? `  Avisos que no pasan (${fallan.length}):\n${fallan.join("\n")}`
      : "  Sin avisos: todas las auditorías de rendimiento pasan.",
  );
}

async function main() {
  const args = process.argv.slice(2);
  const url = args.find((a) => !a.startsWith("--"));
  if (!url) {
    console.error(
      "Uso: npm run psi -- <url> [--solo=movil|escritorio]\n" +
        "PSI necesita una URL PÚBLICA: el Preview de Vercel o producción, nunca localhost.",
    );
    process.exit(2);
  }
  const solo = args.find((a) => a.startsWith("--solo="))?.split("=")[1];
  const estrategias = (
    solo === "movil"
      ? ["mobile"]
      : solo === "escritorio"
        ? ["desktop"]
        : ["mobile", "desktop"]
  ) as ("mobile" | "desktop")[];

  const key = apiKey();
  console.log(`\n${url}`);
  if (!key) {
    console.log(
      "  ⚠ Sin PSI_API_KEY: la API limita fuerte y suele devolver 429. Ver README.",
    );
  }

  try {
    const d = await huellaDelDespliegue(url);
    console.log(
      `  Despliegue medido: huella ${d.huella} (${d.assets} assets) · caché de Vercel: ${d.cache}`,
    );
    console.log(
      "  Si la huella no cambió tras un push, estás midiendo el build anterior.",
    );
  } catch {
    console.log("  (no se pudo leer la huella del despliegue)");
  }

  for (const s of estrategias) {
    await mide(url, s, key);
  }
  console.log("");
}

// El error se imprime, no se lanza: una traza de Node encima de un mensaje que ya
// explica qué hacer solo entierra la explicación.
void main().catch((e: unknown) => {
  console.error(`\n${e instanceof Error ? e.message : String(e)}\n`);
  process.exit(1);
});
