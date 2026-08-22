/**
 * El censo de contraste de TODO el sitio — `npm run censo`.
 *
 * QUÉ HACE. Recorre las páginas del registro (`PAGE_SLUGS`, D72) × los dos temas
 * sobre el sitio SERVIDO, inyecta `scripts/design-review/contrast-census.js` en
 * cada una y falla si aparece un solo par por debajo de AAA.
 *
 * POR QUÉ EXISTE, y es una lección repetida de este repo: la pasada completa se
 * hacía **a mano**, conduciendo el navegador llamada a llamada, y por eso se
 * hizo entera dos veces en seis meses. En medio, el sitio ganó una página —la
 * decimotercera, el propio artículo— y el copy siguió publicando «AAA en las
 * doce páginas» sin que nada lo notara. *Que el trabajo deje algo detrás es más
 * barato que volver a hacerlo*, que es exactamente lo que dice de sí mismo el
 * script que este conduce.
 *
 * Y la lista de páginas NO se escribe aquí: sale de `PAGE_SLUGS`. Añadir una
 * página la mete en el censo sin que nadie se acuerde, igual que ya la mete en
 * el sitemap, en `gate:html` y en `/llms.txt`.
 *
 * NO ESTÁ EN CI, y es deliberado, por la misma razón que `npm run psi`: necesita
 * un navegador de verdad y un servidor delante. La mitad de los pares de este
 * sitio no existen hasta que el navegador COMPONE un `color-mix` sobre la
 * superficie de debajo, así que no hay forma estática de verlos. Se dispara al
 * cerrar una pasada de accesibilidad, y su fecha es `LAST_A11Y_REVIEW`.
 *
 * USO:
 *
 *     npm run build && npm start        # en otra terminal
 *     npm run censo
 *
 * AFIRMA CUÁNTO HA MIRADO, con guarda de cero en las tres dimensiones que ya han
 * fallado en silencio en este proyecto (`BRAND.md` §Cómo medir sin equivocarse):
 *
 *   1. **El metro**, contra los anclajes SIN cian —13,79 claro / 15,32 oscuro—,
 *      que no dependen del recorte de gamut y tienen que salir exactos.
 *   2. **Las reglas `:hover` indexadas.** Cero reglas es el fallo que tuvo el
 *      censo dos veces, y su síntoma era un aprobado.
 *   3. **El tema pintado**, contra el que se pidió. Un `set media` que no llega
 *      mediría la misma página dos veces y lo llamaría cobertura.
 *
 * LO QUE NO CUBRE, dicho para que no se dé por cubierto:
 *
 * - **El texto sobre imagen.** El medidor no puede componer una foto, así que
 *   esos pares salen en `sinMedir` y hay que mirarlos aparte: se mide el píxel
 *   pintado bajo la caja del texto. Aquí se CUENTAN y se listan, no se juzgan.
 * - **Lo que está detrás de una interacción**: pestañas sin abrir, diálogos sin
 *   invocar. El censo ve el DOM que hay, no el que podría haber.
 * - **Un solo viewport.** El censo mide colores, que no dependen del ancho; el
 *   pliegue y el objetivo táctil son de `viewport-verifier` (D52).
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";

import { locales, pagePath } from "../lib/i18n/config";
import { PAGE_SLUGS } from "../lib/routes";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const CENSO = "scripts/design-review/contrast-census.js";
const TEMAS = ["light", "dark"] as const;

/** El locale que se mide. El censo mira COLORES, y el color no se traduce: medir
 *  las 26 variantes doblaría el tiempo para repetir cada par. El EN comparte
 *  componentes, y lo que sí cambia con el idioma —longitudes, saltos de línea—
 *  lo ve `viewport-verifier`, no esto. */
const LOCALE = locales[0];

type Par = { ratio: number; px: number; nivel: string; ejemplo: string };
type Censo = {
  metro: string;
  reglasHover: string;
  tema: string;
  pares: number;
  bajoAA: Par[];
  bajoAAA: Par[];
  sinMedir: Par[];
};

/**
 * El ENTRY REAL de `agent-browser`, no su nombre.
 *
 * En Windows el binario global es un `.cmd`, y desde la CVE-2024-27980 Node se
 * niega a lanzarlo con `execFileSync` sin `shell: true` — que aquí no vale,
 * porque los argumentos llevan URLs y trozos de JavaScript que el shell
 * destrozaría. El shim POSIX del propio paquete dice dónde está lo que ejecuta:
 * `node <root-global>/agent-browser/bin/agent-browser.js`. Se resuelve una vez.
 */
const ENTRY = (() => {
  const cola = join("agent-browser", "bin", "agent-browser.js");
  const raices = [
    process.env.npm_config_prefix &&
      join(process.env.npm_config_prefix, "lib", "node_modules"),
    process.env.npm_config_prefix &&
      join(process.env.npm_config_prefix, "node_modules"),
    process.env.APPDATA && join(process.env.APPDATA, "npm", "node_modules"),
    join(dirname(process.execPath), "node_modules"),
    join(dirname(process.execPath), "..", "lib", "node_modules"),
    "/usr/local/lib/node_modules",
    "/usr/lib/node_modules",
  ].filter((r): r is string => Boolean(r));

  for (const raiz of raices) {
    const entry = join(raiz, cola);
    if (existsSync(entry)) return entry;
  }
  throw new Error(
    `no encuentro agent-browser en ninguna raíz global (${raices.join(" · ")}). ` +
      `Instálalo con \`npm i -g agent-browser\` — el censo necesita un navegador de verdad.`,
  );
})();

function ab(args: string[], input?: string): string {
  return execFileSync(process.execPath, [ENTRY, ...args], {
    encoding: "utf8",
    input,
    maxBuffer: 64 * 1024 * 1024,
  });
}

const problemas: string[] = [];
const fallo = (msg: string) => problemas.push(msg);

const guionCenso = readFileSync(CENSO, "utf8");

let corridas = 0;
let paresTotales = 0;
let sinMedirTotales = 0;

console.log(
  `censo — ${PAGE_SLUGS.length} páginas × ${TEMAS.length} temas sobre ${BASE}\n`,
);

for (const slug of PAGE_SLUGS) {
  const ruta = pagePath(LOCALE, slug);
  for (const tema of TEMAS) {
    ab(["open", `${BASE}${ruta}`]);
    ab(["set", "media", tema]);
    ab(["eval", "--stdin"], guionCenso);
    const crudo = ab(["eval", "JSON.stringify(window.contrastCensus())"]);
    // `eval` devuelve la cadena JSON entrecomillada; se desenvuelve dos veces.
    const c = JSON.parse(JSON.parse(crudo.trim().split("\n").pop()!)) as Censo;

    corridas++;
    paresTotales += c.pares;
    sinMedirTotales += c.sinMedir.length;

    const etiqueta = `${ruta} · ${tema}`;
    const temaPintado = tema === "dark" ? "oscuro" : "claro";

    if (!c.metro.startsWith("OK"))
      fallo(`${etiqueta}: EL METRO NO SE VALIDA — ${c.metro}`);
    if (c.tema !== temaPintado)
      fallo(
        `${etiqueta}: se pidió tema ${tema} y la página pintó «${c.tema}». ` +
          `El \`set media\` no ha llegado, así que esta corrida mide otra cosa.`,
      );
    if (c.reglasHover.startsWith("0")) fallo(`${etiqueta}: ${c.reglasHover}`);
    if (c.pares === 0)
      fallo(`${etiqueta}: cero pares medidos. Una página siempre tiene pares.`);

    for (const p of c.bajoAA)
      fallo(
        `${etiqueta}: FALLA AA — ${p.ratio.toFixed(2)}:1 en ${p.px}px · ${p.ejemplo}`,
      );
    for (const p of c.bajoAAA)
      if (p.nivel !== "FALLA AA")
        fallo(
          `${etiqueta}: bajo AAA — ${p.ratio.toFixed(2)}:1 en ${p.px}px · ${p.ejemplo}`,
        );

    console.log(
      `  ${etiqueta.padEnd(34)} ${String(c.pares).padStart(3)} pares · ` +
        `${c.sinMedir.length} sobre imagen · metro ${c.metro}`,
    );
  }
}

console.log("");

if (corridas === 0 || paresTotales === 0)
  fallo(
    `el censo no ha medido nada (corridas: ${corridas}, pares: ${paresTotales}). ` +
      `Un metro que devuelve lista vacía parece un aprobado.`,
  );

if (problemas.length) {
  console.error(`censo — ${problemas.length} problema(s):\n`);
  for (const p of problemas) console.error(`  · ${p}`);
  console.error(
    `\n  Recuerda: los pares «sobre imagen» NO salen aquí — el medidor se abstiene\n` +
      `  y hay que medirlos aparte, sobre el píxel pintado bajo la caja del texto.`,
  );
  process.exit(1);
}

console.log(
  `censo ✓ — ${corridas} corridas (${PAGE_SLUGS.length} páginas × ${TEMAS.length} temas), ` +
    `${paresTotales} pares medidos, metro validado en las ${corridas}.\n` +
    `Cero bajo AA y cero bajo AAA. ${sinMedirTotales} pares sobre imagen quedan fuera ` +
    `del veredicto y se miran aparte.\n\n` +
    `Si esta pasada es la buena, actualiza LAST_A11Y_REVIEW en lib/design-values.ts.`,
);
