/**
 * «Nada codificado solo por color» — `npm run color-solo`.
 *
 * QUÉ ERA ESTO ANTES. El punto 6 del checklist de accesibilidad y la fila 2 de la
 * Definition of Done: la ÚNICA que se comprobaba a mano y no tenía forma
 * automática. Se hacía abriendo un simulador de daltonismo y mirando la página.
 *
 * POR QUÉ AHORA HAY DETECTOR, y no capturas pareadas. El barrido manual ya se
 * hizo el 2026-09-02 y salió limpio: Francisco recorrió todas las secciones con
 * acromatopsia simulada, Toolkit y diagramas incluidos, y nada pierde información
 * al quitar el color. O sea que **la mirada ya ocurrió** y lo que falta no es
 * mirar otra vez: es que un cambio futuro no lo rompa en silencio. Es la familia
 * D60 —el artefacto que se queda viejo— aplicada a una propiedad visual.
 *
 * Y esa pasada limpia es además la **línea base con la que se calibra**: si el
 * detector marca algo hoy, es un falso positivo, y eso es justo lo que hace falta
 * para ajustarlo sin adivinar.
 *
 * CÓMO DETECTA, en una frase: una simulación de acromatopsia es quedarse con la
 * luminancia, y la luminancia se calcula. Dos colores distintos cuyo gris coincide
 * son exactamente los que pierden la información. El criterio entero está en
 * `scripts/design-review/color-solo.js`.
 *
 * DÓNDE VIVE: con el censo y el pliegue, **fuera de CI**, porque necesita
 * navegador y servidor. Su fila está en `GATES.md`.
 *
 * USO:
 *
 *     npm run build && npm start        # en otra terminal
 *     npm run color-solo
 */
import { readFileSync } from "node:fs";

import { locales, pagePath } from "../lib/i18n/config";
import { PAGE_SLUGS } from "../lib/routes";
import { ab } from "./navegador/agent-browser";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const CENSO = "scripts/design-review/contrast-census.js";
const DETECTOR = "scripts/design-review/color-solo.js";
const TEMAS = ["light", "dark"] as const;
const LOCALE = locales[0];

interface Hallazgo {
  grupo: string;
  prop: string;
  a: string;
  b: string;
  gris: number;
  ejemplo: string;
  texto: string;
  otro: string;
}

interface Resultado {
  tema: string;
  grupos: number;
  pares: number;
  hallazgos: Hallazgo[];
}

// El detector se apoya en `paint`, `label`, `freezeMotion` y `mostrarReveals`,
// que viven en el guion del censo: se inyectan los dos, en ese orden.
const guionCenso = readFileSync(CENSO, "utf8");
const guionDetector = readFileSync(DETECTOR, "utf8");

const filtro = process.argv
  .find((a) => a.startsWith("--pagina="))
  ?.split("=")[1];
const paginas = filtro
  ? PAGE_SLUGS.filter((s) => String(s).includes(filtro))
  : PAGE_SLUGS;

/**
 * `--caso-malo` no mide el sitio: comprueba que este detector SABE FALLAR.
 *
 * Su resultado normal va a ser cero —el sitio ya cumple el punto 6, comprobado a
 * mano el 2026-09-02—, y un guardián cuyo resultado normal es cero es justo el que
 * se rompe sin que nadie lo note (D70). Con esta bandera, la página se fabrica su
 * propio incumplimiento —dos hermanos que solo se distinguen por un color de la
 * misma luminancia— y la pasada **suspende si NO lo caza**. El veredicto está del
 * revés a propósito.
 */
const CASO_MALO = process.argv.includes("--caso-malo");

const problemas: string[] = [];
let corridas = 0;
let gruposTotales = 0;
let paresTotales = 0;
let cazados = 0;
let inyectados = 0;

console.log(
  `color-solo — ${paginas.length} páginas × ${TEMAS.length} temas sobre ${BASE}\n`,
);

for (const slug of paginas) {
  const ruta = pagePath(LOCALE, slug);
  for (const tema of TEMAS) {
    ab(["open", `${BASE}${ruta}`]);
    ab(["set", "media", tema]);
    ab(["eval", "--stdin"], guionCenso);
    ab(["eval", "--stdin"], guionDetector);
    ab(["eval", "window.scrollTo(0, document.body.scrollHeight * 0.5); 'ok'"]);
    ab(["eval", "new Promise((r) => setTimeout(() => r('ok'), 700))"]);

    if (CASO_MALO) {
      const inyeccion = JSON.parse(
        JSON.parse(
          ab(["eval", "JSON.stringify(window.colorSoloCasoMalo())"])
            .trim()
            .split("\n")
            .pop()!,
        ) as string,
      ) as { inyectado: boolean; motivo?: string; donde?: string };
      if (inyeccion.inyectado) inyectados += 1;
      else {
        problemas.push(
          `${pagePath(LOCALE, slug)} · ${tema}: no se pudo inyectar el caso malo (${inyeccion.motivo})`,
        );
      }
    }

    const r = JSON.parse(
      JSON.parse(
        ab(["eval", "JSON.stringify(window.colorSolo())"])
          .trim()
          .split("\n")
          .pop()!,
      ) as string,
    ) as Resultado;

    corridas += 1;
    gruposTotales += r.grupos;
    paresTotales += r.pares;

    const etiqueta = `${ruta} · ${tema}`;
    const temaPintado = tema === "dark" ? "oscuro" : "claro";
    if (r.tema !== temaPintado) {
      problemas.push(
        `${etiqueta}: se pidió ${tema} y la página pintó «${r.tema}». Esta corrida mide otra cosa.`,
      );
    }
    // Cero grupos NO es un aprobado: toda página tiene listas de hermanos.
    if (r.grupos === 0) {
      problemas.push(
        `${etiqueta}: CERO grupos comparables. El detector no está mirando nada.`,
      );
    }

    console.log(
      `  ${etiqueta.padEnd(34)} ${String(r.grupos).padStart(4)} grupos · ` +
        `${String(r.pares).padStart(4)} pares comparados · ${r.hallazgos.length} hallazgo(s)`,
    );

    // En modo caso malo el veredicto está del revés: los hallazgos son lo que se
    // espera, y lo que suspende es no encontrarlos.
    if (CASO_MALO) {
      if (r.hallazgos.length) cazados += 1;
      else {
        problemas.push(
          `${etiqueta}: se inyectó un par indistinguible en gris y el detector NO lo cazó`,
        );
      }
      continue;
    }

    for (const h of r.hallazgos) {
      problemas.push(
        `${etiqueta}: ${h.ejemplo} distingue «${h.texto}» de «${h.otro}» solo por ` +
          `${h.prop} (${h.a} vs ${h.b}, Δgris ${h.gris}) y nada más cambia`,
      );
    }
  }
}

console.log("");

if (corridas === 0 || gruposTotales === 0 || paresTotales === 0) {
  console.error(
    `color-solo — no ha mirado nada (corridas ${corridas}, grupos ${gruposTotales}, ` +
      `pares ${paresTotales}). Un metro que devuelve lista vacía parece un aprobado.\n`,
  );
  process.exit(1);
}

if (problemas.length) {
  console.error(`color-solo — ${problemas.length} problema(s):\n`);
  for (const p of problemas) console.error(`  · ${p}`);
  console.error(
    "\n  Cada uno es un estado o una categoría que en acromatopsia desaparece.\n" +
      "  Se arregla añadiendo una señal que no sea el tono: texto, forma, peso o filete.\n",
  );
  process.exit(1);
}

if (CASO_MALO) {
  console.log(
    `color-solo ✓ CASO MALO — ${inyectados} inyecciones, ${cazados} cazadas de ${corridas} corridas.\n` +
      "El detector sabe fallar: esto NO dice que el sitio cumpla, dice que el metro muerde.\n",
  );
  process.exit(0);
}

console.log(
  `color-solo ✓ — ${corridas} corridas, ${gruposTotales} grupos comparables y ` +
    `${paresTotales} pares comparados.\n` +
    `Ningún estado ni categoría se distingue solo por el tono` +
    (filtro ? `  (PASADA PARCIAL: --pagina=${filtro})` : ".") +
    "\n",
);
