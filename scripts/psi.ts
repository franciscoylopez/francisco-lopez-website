// PageSpeed Insights desde la terminal (P46.5, ampliado en P68.6).
//
// POR QUÉ EXISTE. Arreglando el LCP del hero (D47) hicieron falta tres idas y
// vueltas para una sola cifra: diagnóstico en local, Francisco pasando PageSpeed a
// mano sobre el Preview, y el resultado de vuelta. Y la primera vuelta midió un
// despliegue que todavía no tenía el arreglo dentro, así que la conclusión fue
// falsa. En local NO se puede medir: la pestaña que conduce la automatización corre
// con `visibilityState: "hidden"` y el navegador no emite entradas de LCP con la
// página oculta.
//
// DOS MODOS, y el segundo es el que faltaba (P68.6):
//
//   · UNA URL — el modo de D47: se persigue una cifra concreta de una página, y lo
//     que se mira es el DESGLOSE DEL LCP POR FASES, que es lo que dice si el
//     problema es la red o algo que tapa el elemento después de pintarlo.
//   · REGISTRO — recorre `PAGE_SLUGS` (D72) como hace `censo` desde D85, así que
//     una página nueva entra en la auditoría de rendimiento SIN QUE NADIE SE
//     ACUERDE. Mientras la cobertura dependía de elegir a mano qué página mirar,
//     dependía de la memoria, que es lo que `BRAND.md` §Cómo se escribe una regla
//     nombra como la fuente del drift.
//
// LO QUE IMPRIME, y una corrección de esta misma cabecera (2026-08-24). Decía que
// imprimía «la nota, las métricas y el desglose» y NO la lista de avisos. Lo
// segundo era falso desde el primer commit: los avisos que no pasan se listaban ya,
// solo que por título pelado. Lo que de verdad faltaba era **con qué gravedad y a
// costa de cuánto**, y sobre todo **cuántas páginas comparten el mismo aviso** —
// que es lo único que separa un arreglo en bloque de un pulido de una página. La
// cabecera describía el código de oídas; es el mismo fallo que persigue D84 en el
// artículo, cometido dentro de un script.
//
// USO:
//     npm run psi -- https://…                     # una url: móvil y escritorio
//     npm run psi -- https://… --solo=movil        # o --solo=escritorio
//     npm run psi -- --registro                    # las páginas del registro
//     npm run psi -- --registro --base=https://…   # sobre un Preview
//     npm run psi -- --registro --tomas=1          # barrido de tanteo, no sella
//
// CLAVE: la API sin clave devuelve 429 casi siempre. Se lee de `PSI_API_KEY`, del
// entorno o de `.env.local` (que está en .gitignore). Cómo obtenerla, en el README.
// En modo registro la clave NO es opcional: 28 llamadas sin ella son 28 errores.
//
// Y EL MODO REGISTRO SELLA (P68.495, D102). Al terminar deja en
// `content/psi/registro.json` el rango de cada estrategia con su fecha, y de ahí
// lo lee el artículo para publicar la nota en vez de tenerla tecleada — que es
// como llevaba semanas diciendo «100 escritorio» con la página trece sacando 93.
// No sella una pasada parcial: ni sobre un Preview, ni con una sola estrategia,
// ni con un solo fallo. Un rango sacado de media auditoría se lee igual que uno
// bueno.
//
// SIGUE FUERA DE CI (D49): su variabilidad daría rojos falsos. Y el modo registro
// tarda varios minutos, porque las llamadas van EN SERIE a propósito.
//
// LO QUE NO CUBRE, dicho para que no se dé por cubierto:
//   · Solo el idioma por defecto. Las páginas EN son los mismos componentes con
//     otro copy; medirlas doblaría el coste para mover decimales.
//   · Solo la categoría de rendimiento. Accesibilidad y SEO los cubren
//     `check:marco`, `censo` y el `viewport-verifier`, que no gastan cuota de API
//     ni dependen de que Google esté de buenas.
//
// Y EL MODO REGISTRO MUESTREA (P50.78, 2026-08-28). Toma tres medidas de cada
// página×estrategia y publica la MEDIANA, porque con una sola muestra el min/max
// sellaba ruido: `/design-system` dio 76 y, re-medida sin tocar nada, 98 y 99. Las
// tomas van por fuera del recorrido —una vuelta entera al registro entre toma y
// toma— para que la caché de la API no devuelva tres veces el mismo análisis.
//
// DOS TRAMPAS AL REPETIR CORRIDAS (D108, 2026-08-25), y la primera es justo la que
// obliga a lo de arriba:
//   · LA API DEVUELVE RESULTADO CACHEADO. Seis de ocho corridas seguidas pueden ser
//     la misma respuesta byte a byte. Por eso `consolida()` deduplica por el
//     «(medido …)» que se imprime al lado de la nota: es el sello del ANÁLISIS, no
//     el de la llamada. Una n alta sobre filas repetidas da la apariencia de rigor
//     y el veredicto contrario, así que un par que se queda en un solo análisis
//     distinto NO sella.
//   · Y EL DESGLOSE DEL LCP NO ES UNA PROPIEDAD DE LA PÁGINA. Sobre el mismo
//     despliegue, el render delay se movió entre 15 y 2058 ms (137×) y su cuota
//     entre el 1% y el 90%. El TOTAL sí es estable. No abras una tarea sobre una
//     fase sin mediana de corridas deduplicadas.

import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";

import { defaultLocale, pagePath } from "../lib/i18n/config";
import { PSI_REGISTRO } from "../lib/figures";
import { PAGE_SLUGS } from "../lib/routes";

const ENDPOINT = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

/** El sitio que se mide cuando nadie dice otra cosa. */
const PRODUCCION = "https://franciscolopez.es";

/** Pausa entre llamadas: la cuota es amplia, pero no se dispara en paralelo. */
const RESPIRO_MS = 400;

type Estrategia = "mobile" | "desktop";

const enCastellano = (e: Estrategia) =>
  e === "mobile" ? "móvil" : "escritorio";

/**
 * Lee una variable del entorno y, si no está, de `.env.local` (en .gitignore).
 * Generaliza lo que antes hacía solo con `PSI_API_KEY`, porque el modo registro
 * necesita además saber sobre qué dominio mide.
 */
function delEntorno(nombre: string): string | undefined {
  if (process.env[nombre]) return process.env[nombre];
  try {
    const linea = readFileSync(".env.local", "utf8")
      .split(/\r?\n/)
      .find((l) => l.trimStart().startsWith(`${nombre}=`));
    return linea
      ?.slice(linea.indexOf("=") + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
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
  // SIN ESTAS DOS GUARDAS LA HUELLA MIENTE, y miente hacia el lado malo: una
  // página de protección de despliegue, un 404 o cualquier cuerpo sin assets
  // dejan la lista vacía, y el SHA-256 de la cadena vacía es SIEMPRE EL MISMO.
  // O sea que el script diría «la huella no ha cambiado» en cada ejecución — justo
  // la señal falsa que la huella existe para evitar (D49).
  if (!res.ok) throw new Error(`la URL respondió ${res.status}`);
  const html = await res.text();
  const assets = [...html.matchAll(/\/_next\/static\/[^"']+/g)]
    .map((m) => m[0])
    .sort();
  if (!assets.length) throw new Error("la respuesta no trae assets de /_next");
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
  details?: {
    overallSavingsMs?: number;
    items?: (FaseLcp | { items?: FaseLcp[] })[];
  };
}

/** Un aviso que no pasa, ya resuelto a lo que se imprime. */
interface Aviso {
  id: string;
  titulo: string;
  gravedad: "rojo" | "naranja";
  ahorro: string;
}

/** Un aviso en una línea, sin dejar colgando el guion cuando no hay ahorro. */
const enLinea = (av: Aviso) =>
  `[${av.gravedad.padEnd(7)}] ${av.titulo}${av.ahorro ? ` — ${av.ahorro}` : ""}`;

/** El resultado de UNA llamada. `mide` ya no imprime: eso lo decide cada modo. */
interface Medicion {
  url: string;
  ruta: string;
  estrategia: Estrategia;
  nota: number;
  medido: string;
  metricas: { etiqueta: string; valor: string }[];
  fases: FaseLcp[] | null;
  avisos: Aviso[];
}

async function mide(
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

/** El informe de UNA url, con el mismo formato que desde P46.5. */
function imprimeDetalle(m: Medicion) {
  console.log(
    `\n─── ${enCastellano(m.estrategia).toUpperCase()} ───────────────────────────────`,
  );
  console.log(`  Rendimiento: ${m.nota}/100   (medido ${m.medido})`);
  for (const { etiqueta, valor } of m.metricas) {
    console.log(`  ${etiqueta.padEnd(12)} ${valor}`);
  }

  if (m.fases) {
    const total = m.fases.reduce(
      (s, f) => s + (f.duration ?? f.timing ?? 0),
      0,
    );
    console.log("  Desglose del LCP:");
    for (const f of m.fases) {
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

  console.log(
    m.avisos.length
      ? `  Avisos que no pasan (${m.avisos.length}):\n` +
          m.avisos.map((av) => `    · ${enLinea(av)}`).join("\n")
      : "  Sin avisos: todas las auditorías de rendimiento pasan.",
  );
}

const espera = (cuanto: number) => new Promise((r) => setTimeout(r, cuanto));

/** Una llamada que no llegó a devolver nota. Se cuentan y se nombran al final. */
interface Fallo {
  ruta: string;
  estrategia: Estrategia;
  error: string;
}

/** Mide UNA página en todas las estrategias y deja su bloque impreso. */
async function midePagina(
  base: string,
  ruta: string,
  estrategias: readonly Estrategia[],
  key: string,
  /** Los avisos se callan mientras se muestrea: los buenos son los de la mediana,
   *  y esos se imprimen una sola vez al consolidar. */
  conAvisos = true,
): Promise<{ medidas: Medicion[]; fallos: Fallo[] }> {
  const url = `${base}${ruta}`;
  const medidas: Medicion[] = [];
  const fallos: Fallo[] = [];
  const notas: string[] = [];
  const avisos: { estrategia: Estrategia; aviso: Aviso }[] = [];

  for (const estrategia of estrategias) {
    try {
      const m = await mide(url, estrategia, key);
      medidas.push(m);
      notas.push(`${enCastellano(estrategia)} ${String(m.nota).padStart(3)}`);
      for (const aviso of m.avisos) avisos.push({ estrategia, aviso });
    } catch (e) {
      fallos.push({
        ruta,
        estrategia,
        error: e instanceof Error ? e.message : String(e),
      });
      notas.push(`${enCastellano(estrategia)} ERROR`);
    }
    await espera(RESPIRO_MS);
  }

  console.log(`\n  ${ruta.padEnd(28)} ${notas.join("   ")}`);
  if (!conAvisos) return { medidas, fallos };

  for (const { estrategia, aviso } of avisos) {
    console.log(`      ${enLinea(aviso)}   (${enCastellano(estrategia)})`);
  }
  if (!avisos.length && !fallos.length) console.log("      sin avisos");

  return { medidas, fallos };
}

/**
 * Cuántas veces se mide cada página×estrategia en modo registro (P50.78).
 *
 * POR QUÉ NO ES UNA. El barrido tomaba UNA muestra y publicaba el min/max, así que
 * la peor toma mandaba sobre el rango entero — y ese rango lo publica el artículo
 * (D102). Medido el mismo día contra producción y sin tocar nada entre medias:
 * `/design-system` 76 y luego 98 y 99; `/como-se-ha-creado` 81 y luego 89 y 99. El
 * barrido iba a sellar «76-100 escritorio» cuando el criterio de aceptación del
 * PRD dice «>90 en las catorce». El sitio habría publicado un número que
 * contradice su propio criterio, por ruido.
 */
const TOMAS_POR_DEFECTO = 3;

/**
 * La mediana, no la media: el ruido de PSI es ASIMÉTRICO hacia abajo —una toma
 * mala hunde la media y no mueve la mediana—, y la media de 76, 98 y 99 da 91,
 * que no es ninguna de las tres.
 *
 * Con un número PAR de valores se queda con el bajo de los dos centrales en vez de
 * promediarlos. Es deliberado: promediar inventaría una nota que la página no ha
 * sacado nunca, y en un sello que se publica es peor pasarse de optimista.
 */
const mediana = (notas: number[]): number => {
  const orden = [...notas].sort((a, b) => a - b);
  return orden[Math.floor((orden.length - 1) / 2)]!;
};

/** Cuánto se movió un par entre tomas, en puntos. */
const dispersion = (c: Consolidada) => c.notas.at(-1)! - c.notas[0]!;

/** Las tomas de UNA página×estrategia, reducidas a la medición que las representa. */
interface Consolidada {
  /** La corrida cuya nota es la mediana. Se guarda la MEDICIÓN, no la cifra: sus
   *  avisos y su desglose tienen que venir de la misma corrida que la nota. */
  medida: Medicion;
  /** Cuántas llamadas se hicieron. */
  tomas: number;
  /** Cuántos ANÁLISIS distintos devolvieron esas llamadas. */
  distintas: number;
  /** Las notas distintas, ordenadas, para poder enseñar la dispersión. */
  notas: number[];
}

/**
 * Reduce las N tomas de cada página×estrategia a una sola medición.
 *
 * DEDUPLICA POR EL SELLO DEL ANÁLISIS, no por el de la llamada, y es la mitad
 * importante (D108): la API devuelve resultado cacheado, y seis corridas seguidas
 * pueden ser la misma respuesta byte a byte. Una n alta sobre filas repetidas da
 * la apariencia de rigor y el veredicto contrario.
 */
function consolida(brutas: Medicion[]): Consolidada[] {
  const grupos = new Map<string, Medicion[]>();
  for (const m of brutas) {
    const clave = `${m.ruta}|${m.estrategia}`;
    grupos.set(clave, [...(grupos.get(clave) ?? []), m]);
  }

  return [...grupos.values()].map((tomas) => {
    const unicas = [...new Map(tomas.map((m) => [m.medido, m])).values()];
    const objetivo = mediana(unicas.map((m) => m.nota));
    return {
      medida: unicas.find((m) => m.nota === objetivo)!,
      tomas: tomas.length,
      distintas: unicas.length,
      notas: unicas.map((m) => m.nota).sort((a, b) => a - b),
    };
  });
}

/**
 * AFIRMA CUÁNTO HA MUESTREADO, que es lo que separa una mediana de tres análisis
 * de una mediana de tres copias del mismo. Y enseña la dispersión, que es la
 * evidencia de por qué esto existe: si el peor par se mueve 23 puntos entre tomas,
 * sellar la peor habría sido publicar ruido.
 */
function imprimeMuestreo(consolidadas: Consolidada[], tomas: number) {
  const llamadas = consolidadas.reduce((s, c) => s + c.tomas, 0);
  const analisis = consolidadas.reduce((s, c) => s + c.distintas, 0);
  const cacheadas = consolidadas.filter((c) => c.distintas < 2);

  console.log(
    "\n─── Qué se muestreó, y cuánto se movió ──────────────────────",
  );
  console.log(
    `  ${tomas} tomas × ${consolidadas.length} pares · ${llamadas} llamadas · ` +
      `${analisis} análisis distintos (${Math.round((analisis / llamadas) * 100)}%)`,
  );

  const dispersas = [...consolidadas]
    .filter((c) => c.notas.length > 1)
    .sort((x, y) => dispersion(y) - dispersion(x))
    .slice(0, 3);
  for (const c of dispersas) {
    console.log(
      `  ${c.medida.ruta.padEnd(28)} ${enCastellano(c.medida.estrategia).padEnd(10)} ` +
        `${c.notas.join("·")}  → mediana ${c.medida.nota} ` +
        `(${dispersion(c)} puntos de diferencia)`,
    );
  }
  if (!dispersas.length) console.log("  Ningún par se movió entre tomas.");

  if (cacheadas.length) {
    console.log(
      `\n  ${cacheadas.length} par(es) con UN SOLO análisis distinto — la API los ` +
        `devolvió cacheados:\n` +
        cacheadas
          .map(
            (c) =>
              `      ${c.medida.ruta} (${enCastellano(c.medida.estrategia)})`,
          )
          .join("\n"),
    );
  }
}

/**
 * EL AGREGADO ES EL ENTREGABLE: un aviso en doce páginas se arregla una vez en la
 * capa; el mismo aviso en una es pulido de esa página. Sin esta tabla hay que leer
 * catorce informes y hacer la cuenta a ojo, que es como se acaba tratando como
 * puntual algo que era transversal.
 */
function imprimeAgregado(medidas: Medicion[], totalPaginas: number) {
  const porAviso = new Map<
    string,
    { titulo: string; paginas: Set<string>; rojo: boolean }
  >();
  for (const m of medidas) {
    for (const av of m.avisos) {
      const entrada = porAviso.get(av.id) ?? {
        titulo: av.titulo,
        paginas: new Set<string>(),
        rojo: false,
      };
      entrada.paginas.add(m.ruta);
      entrada.rojo ||= av.gravedad === "rojo";
      porAviso.set(av.id, entrada);
    }
  }

  console.log(
    "\n─── Qué aviso se repite, y en cuántas páginas ───────────────",
  );
  if (porAviso.size === 0) {
    console.log("  Ninguno: todas las auditorías de rendimiento pasan.");
    return;
  }
  const filas = [...porAviso.values()].sort(
    (x, y) =>
      y.paginas.size - x.paginas.size ||
      Number(y.rojo) - Number(x.rojo) ||
      x.titulo.localeCompare(y.titulo, "es"),
  );
  for (const f of filas) {
    console.log(
      `  ${`${f.paginas.size}/${totalPaginas}`.padStart(6)} páginas · ` +
        `[${(f.rojo ? "rojo" : "naranja").padEnd(7)}] ${f.titulo}`,
    );
  }
}

/**
 * AFIRMA CUÁNTO HA MIRADO, que es la regla de este repo para cualquier metro: una
 * tabla vacía puede ser un aprobado o una pasada que no midió nada, y desde fuera
 * se leen igual (D38/D57/D60/D63).
 */
function imprimeResumen(
  medidas: Medicion[],
  fallos: Fallo[],
  estrategias: readonly Estrategia[],
  totalPaginas: number,
  tomas = 1,
) {
  const llamadas = totalPaginas * estrategias.length;
  const resumen = estrategias.map((estrategia) => {
    const suyas = medidas.filter((m) => m.estrategia === estrategia);
    if (!suyas.length) return `${enCastellano(estrategia)}: sin medir`;
    const peor = suyas.reduce((p, m) => (m.nota < p.nota ? m : p));
    const mejor = suyas.reduce((p, m) => (m.nota > p.nota ? m : p));
    return `${enCastellano(estrategia)} ${peor.nota}-${mejor.nota} (peor: ${peor.ruta})`;
  });

  console.log(
    `\npsi ${fallos.length ? "✗" : "✓"} — ${medidas.length}/${llamadas} pares medidos ` +
      `(${totalPaginas} páginas × ${estrategias.length} estrategia(s)` +
      `${tomas > 1 ? `, mediana de ${tomas} tomas` : ""}), ` +
      `${fallos.length} llamada(s) fallida(s) · ${resumen.join(" · ")}\n`,
  );

  if (!fallos.length) return;
  for (const f of fallos) {
    console.error(`  ✗ ${f.ruta} (${enCastellano(f.estrategia)}): ${f.error}`);
  }
  console.error(
    "\n  Una pasada incompleta NO es una pasada limpia: repite las que fallaron\n" +
      "  antes de sacar conclusiones de la tabla de arriba.\n",
  );
  process.exitCode = 1;
}

/** Modo registro: las páginas de `PAGE_SLUGS` × las estrategias pedidas. */
async function recorreElRegistro(
  base: string,
  estrategias: readonly Estrategia[],
  key: string,
  tomas: number,
) {
  const rutas = PAGE_SLUGS.map((slug) => pagePath(defaultLocale, slug));

  console.log(
    `\npsi — ${rutas.length} páginas × ${estrategias.length} estrategia(s) × ` +
      `${tomas} toma(s) sobre ${base}` +
      `\n  ${rutas.length * estrategias.length * tomas} llamadas en serie: esto tarda varios minutos.`,
  );

  try {
    const d = await huellaDelDespliegue(base);
    console.log(
      `  Despliegue medido: huella ${d.huella} (${d.assets} assets) · caché de Vercel: ${d.cache}`,
    );
  } catch {
    console.log("  (no se pudo leer la huella del despliegue)");
  }

  // LAS TOMAS VAN POR FUERA, y no es orden arbitrario: medir una página tres
  // veces seguidas devuelve tres veces el mismo análisis cacheado (D108). Dando
  // una vuelta entera al registro entre toma y toma, cada página se remide varios
  // minutos después, que es lo que hace que la segunda toma sea una medición y no
  // una copia.
  const brutas: Medicion[] = [];
  const fallos: Fallo[] = [];
  for (let toma = 1; toma <= tomas; toma++) {
    if (tomas > 1) {
      console.log(
        `\n─── toma ${toma}/${tomas} ─────────────────────────────────`,
      );
    }
    for (const ruta of rutas) {
      const r = await midePagina(base, ruta, estrategias, key, tomas === 1);
      brutas.push(...r.medidas);
      fallos.push(...r.fallos);
    }
  }

  const consolidadas = consolida(brutas);
  const medidas = consolidadas.map((c) => c.medida);
  if (tomas > 1) imprimeMuestreo(consolidadas, tomas);

  imprimeAgregado(medidas, rutas.length);
  imprimeResumen(medidas, fallos, estrategias, rutas.length, tomas);
  sella(consolidadas, fallos, estrategias, rutas.length, base, tomas);
}

/**
 * Deja escrito lo que se acaba de medir, para que el artículo lo publique en vez
 * de teclearlo (P68.495, D102). Mismo mecanismo que el sello del censo: medir
 * necesita pintar y necesita producción, así que la cifra no puede derivarse al
 * construir; lo que sí puede es no envejecer en silencio.
 *
 * NO SELLA UNA PASADA PARCIAL, y es la mitad importante de esta función. Un
 * rango sacado de cuatro páginas, o de un Preview, publicado como si fuera el
 * del sitio es peor que no publicar nada: se lee igual y es falso. Con un solo
 * fallo, una estrategia de menos o una `--base` que no sea producción, se dice
 * por qué no se ha sellado y se deja el sello anterior intacto.
 *
 * Y DESDE P50.78, TAMPOCO UNA DE UNA SOLA MUESTRA. Una pasada completa medida una
 * vez es tan parcial como una pasada a medias: el min/max publica los extremos, y
 * un extremo sacado de una toma es ruido con formato de dato.
 */
function sella(
  consolidadas: Consolidada[],
  fallos: Fallo[],
  estrategias: readonly Estrategia[],
  totalPaginas: number,
  base: string,
  tomas: number,
) {
  const medidas = consolidadas.map((c) => c.medida);
  const esperadas = totalPaginas * 2;
  // NI UNA PASADA DE UNA SOLA MUESTRA (P50.78). Es la misma regla que las de
  // arriba, con la evidencia que la escribió: el barrido del 2026-08-26 iba a
  // sellar «76-100 escritorio» porque el 76 salió de una toma que al repetirla dio
  // 98 y 99. Y da igual pedir tres tomas si la API devolvió tres veces el mismo
  // análisis cacheado: lo que se exige no son llamadas, son ANÁLISIS distintos.
  const deUnaMuestra = consolidadas.filter((c) => c.distintas < 2);
  const motivo =
    base !== PRODUCCION
      ? `se ha medido ${base} y el sello solo describe producción`
      : estrategias.length !== 2
        ? "falta una de las dos estrategias"
        : fallos.length
          ? `${fallos.length} medición(es) fallaron`
          : medidas.length !== esperadas
            ? `hay ${medidas.length} mediciones y se esperaban ${esperadas}`
            : tomas < 2
              ? "una sola toma por página, y cada extremo del rango saldría de una sola muestra"
              : deUnaMuestra.length
                ? `${deUnaMuestra.length} par(es) se quedaron en un solo análisis distinto ` +
                  `(${deUnaMuestra
                    .slice(0, 3)
                    .map((c) => c.medida.ruta)
                    .join(", ")}${deUnaMuestra.length > 3 ? "…" : ""}). ` +
                  "La caché de la API expira: repítelo dentro de un rato"
                : null;

  if (motivo) {
    console.log(`\n  Sin sellar: ${motivo}.`);
    console.log(`  ${PSI_REGISTRO} se queda como estaba.`);
    return;
  }

  const rango = (e: Estrategia) => {
    const notas = medidas.filter((m) => m.estrategia === e).map((m) => m.nota);
    return { min: Math.min(...notas), max: Math.max(...notas) };
  };

  const registro = {
    fecha: new Date().toISOString().slice(0, 10),
    paginas: totalPaginas,
    // Cuántas tomas hay detrás de cada extremo. Va en el sello y no solo en la
    // consola porque es lo que separa este rango del de 2026-08-24, que salió de
    // una: sin el número, los dos archivos se leen igual.
    tomas,
    movil: rango("mobile"),
    escritorio: rango("desktop"),
  };

  writeFileSync(PSI_REGISTRO, `${JSON.stringify(registro, null, 2)}\n`);
  console.log(
    `\n  Sellado en ${PSI_REGISTRO} — ${registro.escritorio.min}-${registro.escritorio.max} escritorio · ` +
      `${registro.movil.min}-${registro.movil.max} móvil, ${totalPaginas} páginas, ` +
      `mediana de ${tomas} tomas, ${registro.fecha}.`,
  );
  console.log("  El artículo publica esa cifra con esa fecha (D102).");
}

async function main() {
  const args = process.argv.slice(2);
  const url = args.find((a) => !a.startsWith("--"));
  const registro = args.includes("--registro");

  if (!url && !registro) {
    console.error(
      "Uso: npm run psi -- <url> [--solo=movil|escritorio]\n" +
        "     npm run psi -- --registro [--base=https://…] [--solo=…]\n" +
        "PSI necesita una URL PÚBLICA: el Preview de Vercel o producción, nunca localhost.",
    );
    process.exit(2);
  }
  // Las dos formas piden cosas distintas, y aceptar la mezcla haría dudar de qué se
  // midió al leer la salida.
  if (url && registro) {
    console.error(
      "\n--registro recorre las páginas del registro y no acepta además una url.\n" +
        "Para medir otro dominio: --registro --base=https://…\n",
    );
    process.exit(2);
  }

  // Un `--solo` que no se reconoce NO cae de vuelta a «las dos»: eso gastaría dos
  // llamadas de una cuota limitada y el doble de espera sin decir que la bandera se
  // ignoró. Basta escribir `--solo=mobile` en inglés, o `--solo=móvil` con tilde.
  const solo = args.find((a) => a.startsWith("--solo="))?.split("=")[1];
  const POR_BANDERA = {
    movil: ["mobile"],
    escritorio: ["desktop"],
  } as const satisfies Record<string, readonly Estrategia[]>;

  if (solo !== undefined && !(solo in POR_BANDERA)) {
    console.error(
      `\n--solo=${solo} no se reconoce. Valores válidos: movil · escritorio.\n` +
        "Sin la bandera se miden las dos.\n",
    );
    process.exit(2);
  }
  const estrategias: readonly Estrategia[] = solo
    ? POR_BANDERA[solo as keyof typeof POR_BANDERA]
    : ["mobile", "desktop"];

  const key = delEntorno("PSI_API_KEY");

  if (registro) {
    // En una url suelta, sin clave, se avisa y se sigue: puede colar. En modo
    // registro son decenas de llamadas, así que sin clave son decenas de errores y
    // varios minutos de espera para nada. Se para antes de empezar.
    if (!key) {
      console.error(
        "\nEl modo registro necesita PSI_API_KEY: sin clave la API devuelve 429 casi\n" +
          "siempre, y aquí son decenas de llamadas. Ponla en .env.local (ver README).\n",
      );
      process.exit(2);
    }
    const base = (
      args.find((a) => a.startsWith("--base="))?.split("=")[1] ??
      delEntorno("BASE_URL") ??
      delEntorno("NEXT_PUBLIC_SITE_URL") ??
      PRODUCCION
    ).replace(/\/$/, "");

    // `--tomas=N` existe para poder bajar el coste a propósito (un barrido de
    // tanteo sobre un Preview no necesita mediana, y un Preview no sella igual).
    // Un valor que no se entiende NO cae de vuelta al defecto: multiplicaría por
    // tres el gasto de cuota sin que nadie lo hubiera pedido.
    const pedidas = args.find((a) => a.startsWith("--tomas="))?.split("=")[1];
    const tomas = pedidas ? Number(pedidas) : TOMAS_POR_DEFECTO;
    if (!Number.isInteger(tomas) || tomas < 1) {
      console.error(`\n--tomas=${pedidas} no es un entero ≥ 1.\n`);
      process.exit(2);
    }

    await recorreElRegistro(base, estrategias, key, tomas);
    return;
  }

  console.log(`\n${url}`);
  if (!key) {
    console.log(
      "  ⚠ Sin PSI_API_KEY: la API limita fuerte y suele devolver 429. Ver README.",
    );
  }

  try {
    const d = await huellaDelDespliegue(url!);
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
    imprimeDetalle(await mide(url!, s, key));
  }
  console.log("");
}

// El error se imprime, no se lanza: una traza de Node encima de un mensaje que ya
// explica qué hacer solo entierra la explicación.
void main().catch((e: unknown) => {
  console.error(`\n${e instanceof Error ? e.message : String(e)}\n`);
  process.exit(1);
});
