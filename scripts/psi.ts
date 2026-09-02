// PageSpeed Insights desde la terminal (P46.5, ampliado en P68.6).
//
// AQUÍ VIVE LA CONDUCCIÓN, no el trabajo (2026-08-28, P50.84). El archivo estaba
// en 122 de complejidad y se ha partido en los cuatro dominios que tenía dentro:
//
//   psi/medicion.ts   hablar con la API y los tipos de su respuesta
//   psi/muestreo.ts   reducir N tomas de una página a la que la representa
//   psi/informe.ts    cómo se lee todo esto: detalle, agregado y resumen
//   psi/sello.ts      qué se publica en `content/psi/registro.json` y cuándo NO
//
// Anidar no habría servido —qlty suma las funciones anidadas al padre—, que es la
// lección que dejó escrita su hermana del censo. Lo que parte el conteo es el
// módulo.
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

import { createHash } from "node:crypto";

import { defaultLocale, pagePath } from "../lib/i18n/config";
import { PAGE_SLUGS } from "../lib/routes";
import {
  type Aviso,
  type Estrategia,
  type Fallo,
  type Medicion,
  mide,
} from "./psi/medicion";
import { consolida, imprimeMuestreo, TOMAS_POR_DEFECTO } from "./psi/muestreo";
import {
  enCastellano,
  enLinea,
  imprimeAgregado,
  imprimeDetalle,
  imprimeResumen,
} from "./psi/informe";
import { sella } from "./psi/sello";
import { delEntorno } from "./medicion/entorno";

/** El sitio que se mide cuando nadie dice otra cosa. */
const PRODUCCION = "https://franciscolopez.es";

/** Pausa entre llamadas: la cuota es amplia, pero no se dispara en paralelo. */
const RESPIRO_MS = 400;

const espera = (cuanto: number) => new Promise((r) => setTimeout(r, cuanto));

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

/** Lo que hace falta para medir una página. */
interface Encargo {
  base: string;
  ruta: string;
  estrategias: readonly Estrategia[];
  key: string;
  /** Los avisos se callan mientras se muestrea: los buenos son los de la mediana,
   *  y esos se imprimen una sola vez al consolidar. */
  conAvisos: boolean;
}

/** Mide UNA página en todas las estrategias y deja su bloque impreso. */
async function midePagina({
  base,
  ruta,
  estrategias,
  key,
  conAvisos,
}: Encargo): Promise<{ medidas: Medicion[]; fallos: Fallo[] }> {
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
      const r = await midePagina({
        base,
        ruta,
        estrategias,
        key,
        conAvisos: tomas === 1,
      });
      brutas.push(...r.medidas);
      fallos.push(...r.fallos);
    }
  }

  const consolidadas = consolida(brutas);
  const medidas = consolidadas.map((c) => c.medida);
  if (tomas > 1) imprimeMuestreo(consolidadas, tomas);

  imprimeAgregado(medidas, rutas.length);
  imprimeResumen(medidas, fallos, estrategias, rutas.length, tomas);
  sella({
    consolidadas,
    fallos,
    estrategias,
    totalPaginas: rutas.length,
    base,
    tomas,
  });
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
