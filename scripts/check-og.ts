/**
 * ¿Dice la tarjeta OG lo mismo que la página? — `npm run check:og`, en CI.
 *
 * EL PORQUÉ, en `content/og/copy.ts`. Aquí, el veredicto y sus tres reglas sobre
 * las dieciséis parejas (8 tarjetas × 2 idiomas × 2 campos = 32 comparaciones):
 *
 *   1. **Lo que no está declarado como distinto, tiene que coincidir.** Es la
 *      regla entera, y la que faltaba: cambiar el kicker del Hero eran tres
 *      sitios y el tercero solo apareció por un `grep` a mano (P83).
 *   2. **Una divergencia declarada tiene que seguir divergiendo.** Si vuelve a
 *      coincidir, la nota ha caducado y sale rojo: una excepción que ya no muerde
 *      es una nota disfrazada de regla. Es la lección que `check:guardianes` se
 *      llevó dos veces con sus casos malos.
 *   3. **La clave del diccionario tiene que existir.** Tres páginas guardan su par
 *      en la raíz y cinco bajo `hero`; buscar en los dos con un `??` daría verde
 *      sobre una clave desaparecida, que es justo el fallo que esto cierra.
 *
 * POR QUÉ ESTE GATE Y NO UNA FILA DE `check:marco`. `check:marco` mide el HTML
 * PRERENDERIZADO y necesita el build; esto compara dos ficheros de datos y puede
 * correr antes, en el mismo bloque que los guardianes baratos. Y la tarjeta OG es
 * lo que se ve al compartir el sitio: la primera impresión del tráfico que llega
 * por recomendación, y el único texto del sitio que nadie mira nunca.
 *
 * Y AFIRMA CUÁNTO HA MIRADO: tarjetas, comparaciones y divergencias declaradas.
 * Un metro que devuelve lista vacía parece un aprobado.
 */
import { readFileSync } from "node:fs";

import {
  CLAVE_EN_DICCIONARIO,
  COPY,
  DIVERGENCIAS,
  type TextoTarjeta,
} from "../content/og/copy";
import { OG_CARDS } from "../lib/routes";

type Lang = "es" | "en";
const LANGS: Lang[] = ["es", "en"];
const CAMPOS: (keyof TextoTarjeta)[] = ["title", "kicker"];

/**
 * El diccionario de una tarjeta. El nombre del archivo ES el slug de la tarjeta,
 * y eso no es casualidad: `OgCard` se deriva del registro de páginas (D72).
 *
 * Se lee del disco en vez de importarse porque `tsx` compila a CJS, donde un
 * `import()` obligaría a un await de nivel superior que ese formato no admite.
 */
function diccionario(card: string, lang: Lang): Record<string, unknown> {
  const ruta = `app/[lang]/dictionaries/${lang}/${card}.json`;
  return JSON.parse(readFileSync(ruta, "utf8")) as Record<string, unknown>;
}

/** El valor de una ruta declarada, o `undefined` si el camino se rompió por
 *  cualquier tramo — que cuenta como fallo y no como «no aplica». */
function porRuta(
  dict: Record<string, unknown>,
  ruta: readonly string[],
): string | undefined {
  let actual: unknown = dict;
  for (const tramo of ruta) {
    if (typeof actual !== "object" || actual === null) return undefined;
    actual = (actual as Record<string, unknown>)[tramo];
  }
  return typeof actual === "string" ? actual : undefined;
}

const fallos: string[] = [];
let comparaciones = 0;

for (const card of OG_CARDS) {
  for (const lang of LANGS) {
    const dict = diccionario(card, lang);
    for (const campo of CAMPOS) {
      const enTarjeta = COPY[card][lang][campo];
      const ruta = CLAVE_EN_DICCIONARIO[card][campo];
      const enPagina = porRuta(dict, ruta);
      const declarada = DIVERGENCIAS.find(
        (d) => d.card === card && d.lang === lang && d.campo === campo,
      );

      if (enPagina === undefined) {
        fallos.push(
          `${card} · ${lang} · ${campo}: la clave no existe en el diccionario ` +
            `(se buscaba en \`${ruta.join(".")}\`). ` +
            "Si el copy se reestructuró, actualiza `CLAVE_EN_DICCIONARIO`.",
        );
        continue;
      }

      comparaciones++;

      if (declarada) {
        if (enTarjeta === enPagina) {
          fallos.push(
            `${card} · ${lang} · ${campo}: hay una divergencia DECLARADA que ya no ` +
              `diverge («${enTarjeta}»). La nota ha caducado: retírala de ` +
              "`DIVERGENCIAS`, o una excepción muerta acabará tapando una de verdad.",
          );
        }
        continue;
      }

      if (enTarjeta !== enPagina) {
        fallos.push(
          `${card} · ${lang} · ${campo}: la tarjeta dice «${enTarjeta}» y la página ` +
            `«${enPagina}». O se actualiza `.concat(
              "`content/og/copy.ts`, o la diferencia es a propósito y se declara en ",
              "`DIVERGENCIAS` con su motivo.",
            ),
        );
      }
    }
  }
}

console.log(
  `\ncheck:og — ${OG_CARDS.length} tarjeta(s) × ${LANGS.length} idioma(s) · ` +
    `${comparaciones} comparación(es) · ${DIVERGENCIAS.length} divergencia(s) declarada(s)`,
);
for (const d of DIVERGENCIAS) {
  console.log(`  – ${d.card} · ${d.lang} · ${d.campo}: ${d.motivo}`);
}

if (comparaciones === 0) {
  console.error(
    "\ncheck:og — NO HA COMPARADO NADA. Con cero comparaciones esto aprobaría\n" +
      "siempre, así que falla a propósito.\n",
  );
  process.exit(1);
}

if (fallos.length === 0) {
  console.log(
    "✓ Toda tarjeta dice lo que dice su página, salvo lo declarado con motivo.\n",
  );
  process.exit(0);
}

console.error(`\ncheck:og — ${fallos.length} desajuste(s):\n`);
for (const f of fallos) console.error(`  · ${f}\n`);
console.error(
  "La tarjeta OG es lo que se ve al compartir el sitio, y el único texto que no\n" +
    "mira nadie: la página puede decir una cosa y LinkedIn otra durante meses.\n" +
    "El copy va en ES y EN (D20: el ES es la fuente).\n",
);
process.exit(1);
