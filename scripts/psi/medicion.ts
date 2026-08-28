/**
 * HABLAR CON LA API: una llamada a PageSpeed y lo que se saca de su respuesta.
 * Nada de aquí imprime ni decide; devuelve una `Medicion`.
 *
 * POR QUÉ ESTÁ APARTE (2026-08-28, P50.84). Es el primero de los cuatro dominios
 * en que se ha partido `psi.ts`, junto con `muestreo`, `informe` y `sello`. El
 * archivo estaba en 122 de complejidad y la lección de sus dos hermanas es la
 * misma: **anidar no sirve** —qlty suma las funciones anidadas al padre—, lo que
 * parte el conteo es el MÓDULO.
 *
 * Aquí viven también los TIPOS del dominio, porque son la forma de la respuesta de
 * la API y no del programa que la usa.
 */
const ENDPOINT = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

export type Estrategia = "mobile" | "desktop";

/** Una llamada que no llegó a devolver nota. Se cuentan y se nombran al final. */
export interface Fallo {
  ruta: string;
  estrategia: Estrategia;
  error: string;
}

export const ms = (n: number | undefined) =>
  n === undefined ? "—" : Math.round(n) + " ms";

/** Modos que Lighthouse no puntúa: son contexto, no aprobado ni suspenso. */
const SIN_NOTA = ["informative", "notApplicable", "manual"];

/** Una auditoría «que no pasa»: puntuada, por debajo de 0,9. */
const noPasa = (au: Auditoria) =>
  au.score !== null &&
  au.score < 0.9 &&
  !SIN_NOTA.includes(au.scoreDisplayMode ?? "");

/**
 * La gravedad es la de Lighthouse, no una inventada: por debajo de 0,5 su interfaz
 * lo pinta ROJO; entre 0,5 y 0,9, NARANJA. Importa porque el rojo dice «esto cuesta
 * nota» y el naranja, «esto es pulido», y era justo la distinción que faltaba.
 */
const gravedad = (score: number | null): "rojo" | "naranja" =>
  score !== null && score < 0.5 ? "rojo" : "naranja";

/**
 * Lo que ahorraría arreglarlo, cuando Lighthouse lo estima. Cadena VACÍA cuando no
 * hay cifra —hay auditorías que no la traen, como el reflujo forzado— para que la
 * línea no acabe en una raya que no dice nada.
 */
function ahorro(au: Auditoria): string {
  const estimado = au.details?.overallSavingsMs;
  if (estimado && estimado >= 1) return ms(estimado);
  return au.displayValue ?? "";
}

/**
 * Una fase del desglose del LCP. Los nombres de campo cambiaron con la auditoría:
 * Lighthouse 13 usa `label`/`duration`; la versión anterior, `phase`/`timing`. Se
 * aceptan los dos para que el script no se quede mudo con un cambio de versión.
 */
export interface FaseLcp {
  label?: string;
  phase?: string;
  duration?: number;
  timing?: number;
}

export interface Auditoria {
  id?: string;
  title?: string;
  score: number | null;
  scoreDisplayMode?: string;
  displayValue?: string;
  numericValue?: number;
  details?: {
    overallSavingsMs?: number;
    items?: (FaseLcp | { items?: FaseLcp[] })[];
  };
}

/** Un aviso que no pasa, ya resuelto a lo que se imprime. */
export interface Aviso {
  id: string;
  titulo: string;
  gravedad: "rojo" | "naranja";
  ahorro: string;
}

/** El resultado de UNA llamada. `mide` ya no imprime: eso lo decide cada modo. */
export interface Medicion {
  url: string;
  ruta: string;
  estrategia: Estrategia;
  nota: number;
  medido: string;
  metricas: { etiqueta: string; valor: string }[];
  fases: FaseLcp[] | null;
  avisos: Aviso[];
}

export async function mide(
  url: string,
  estrategia: Estrategia,
  key?: string,
): Promise<Medicion> {
  const q = new URLSearchParams({
    url,
    strategy: estrategia,
    category: "performance",
  });
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

  const metricas = (
    [
      ["LCP", "largest-contentful-paint"],
      ["FCP", "first-contentful-paint"],
      ["TBT", "total-blocking-time"],
      ["CLS", "cumulative-layout-shift"],
      ["Speed Index", "speed-index"],
    ] as const
  ).flatMap(([etiqueta, id]) =>
    a[id]
      ? [{ etiqueta: etiqueta as string, valor: a[id].displayValue ?? "—" }]
      : [],
  );

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

  const avisos: Aviso[] = Object.entries(a)
    .filter(([, au]) => noPasa(au))
    .map(([id, au]) => ({
      id,
      titulo: au.title ?? id,
      gravedad: gravedad(au.score),
      ahorro: ahorro(au),
    }))
    // Primero lo que cuesta nota; dentro de cada gravedad, orden estable.
    .sort(
      (x, y) =>
        Number(y.gravedad === "rojo") - Number(x.gravedad === "rojo") ||
        x.titulo.localeCompare(y.titulo, "es"),
    );

  return {
    url,
    ruta: new URL(url).pathname,
    estrategia,
    nota: Math.round(lh.categories.performance.score * 100),
    medido: new Date(lh.fetchTime).toLocaleString("es-ES"),
    metricas,
    fases: tabla?.items?.length ? tabla.items : null,
    avisos,
  };
}
