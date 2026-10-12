/**
 * ¿Miden lo mismo las aperturas que comparten pliegue? — `npm run pliegue`.
 *
 * LA INVARIANTE. Las aperturas de esta familia comparten
 * `md:min-h-[calc(100svh-5rem)]` y centran su grupo de apertura con `my-auto`.
 * **Cuáles son no se escribe aquí y por eso este párrafo no caduca**: las nombra
 * la propia corrida, que las detecta en el DOM (ver «QUIÉN ENTRA», más abajo).
 * Enumeradas decían cuatro el día que ya eran cinco.
 * **Centrar reparte el sobrante arriba y abajo, así que solo es seguro mientras
 * los grupos midan lo mismo.** Está escrito con esas palabras en
 * `components/ui/layout.ts`, y aun así se rompió tres veces:
 *
 *   1. Grupos a 428 / 484 / 477, con el `h1` a 406 / 378 / 409.
 *   2. Accesibilidad ganó un párrafo de fecha bajo su fila de cifras: 505 contra
 *      461, `h1` a 368 contra 390 (P70.29).
 *   3. Contacto no llegaba por estructura —297 contra 461— y se cerró con un
 *      SUELO de 29rem, no compactando (P70.35).
 *
 * **Las tres las encontró Francisco cambiando de pestaña.** Es el punto 1 de
 * `BRAND.md` §Cómo se escribe una regla: la condición hay que comprobarla donde la
 * cosa ocurre, y aquí ocurre en píxeles pintados.
 *
 * QUIÉN ENTRA, Y NO SE ESCRIBE AQUÍ. Se recorren las páginas del registro
 * (`PAGE_SLUGS`, D72) y entra la que TENGA grupo de pliegue, detectado en el DOM.
 * Una apertura nueva entra sola; una que deje de usarlo, sale sola. Las que no lo
 * tienen se cuentan y se nombran — no se saltan en silencio.
 *
 * Y SE BUSCA POR EL TEXTO DEL ATRIBUTO `class`, no con un selector CSS. Las
 * utilidades de Tailwind llevan corchetes y dos puntos (`md:min-h-[29rem]`), que
 * en un selector hay que escapar, y el escapado mal puesto ya rompió cuatro
 * comprobadores de este repo en una sola tarea. Leer el atributo como texto no
 * tiene escapado que equivocar.
 *
 * FUERA DE CI, junto al censo y a `psi`: necesita navegador y servidor delante.
 *
 *     npm run build && npm start        # en otra terminal
 *     npm run pliegue
 *
 * EL VIEWPORT ES 1920×1080 a propósito: es donde `md:` aplica y donde el sobrante
 * del centrado es mayor, o sea donde la divergencia se ve. El eje estrecho —1280×618,
 * el escalado de Windows al 150%— lo cubre `viewport-verifier` (D52), que mide otra
 * cosa: que la apertura no DESBORDE. Aquí se mide que las cuatro COINCIDAN.
 *
 * AFIRMA CUÁNTO HA MIRADO: páginas visitadas, cuántas tienen apertura de pliegue,
 * y las dos cifras de cada una en cada corrida — aunque pase. Un metro que
 * devuelve lista vacía parece un aprobado.
 */
import { pagePath, locales } from "../lib/i18n/config";
import { PAGE_SLUGS } from "../lib/routes";
import { ab, evalJSON } from "./navegador/agent-browser";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const LOCALE = locales[0];

/**
 * Cuánto se toleran entre sí. **Sale de medir el ruido, no de elegirlo**: las
 * cuatro aperturas se apoyan en el mismo suelo de 29rem y sus cifras coinciden
 * salvo el redondeo subpíxel del centrado. Las tres regresiones reales fueron de
 * 44, 56 y 164 px, así que 8 las caza todas y no salta por un redondeo.
 */
const TOLERANCIA_PX = 8;

/** La medida de una apertura, tal como la ve el navegador. */
type Medida = {
  /** Alto del grupo centrado. */
  grupo: number | null;
  /** A qué altura del documento empieza el `h1`. */
  h1: number | null;
};

/**
 * El grupo de pliegue en el DOM. `FOLD_GROUP` es `my-auto md:min-h-[29rem]`, y las
 * dos utilidades juntas no las lleva nada más — el `my-auto` suelto sí aparece en
 * otros sitios, por eso se exigen las dos.
 */
const MEDIR = `(() => {
  const grupo = Array.from(document.querySelectorAll("*")).find((el) => {
    const c = el.getAttribute("class") || "";
    return c.includes("my-auto") && c.includes("min-h-[29rem]");
  });
  const h1 = document.querySelector("h1");
  return {
    grupo: grupo ? Math.round(grupo.getBoundingClientRect().height) : null,
    h1: h1 ? Math.round(h1.getBoundingClientRect().top + window.scrollY) : null,
  };
})()`;

console.log(
  `\npliegue — ${PAGE_SLUGS.length} páginas del registro sobre ${BASE}, a 1920×1080\n`,
);

// EL ORDEN IMPORTA, y cuesta un cuelgue descubrirlo: `set viewport` sin ninguna
// página abierta **se queda esperando** en vez de fallar. Se abre primero —da
// igual cuál, se vuelve a abrir en el bucle— y solo entonces se fija el tamaño.
ab(["open", `${BASE}${pagePath(LOCALE, PAGE_SLUGS[0]!)}`]);
ab(["set", "viewport", "1920", "1080"]);

const conPliegue: { ruta: string; m: Medida }[] = [];
const sinPliegue: string[] = [];

for (const slug of PAGE_SLUGS) {
  const ruta = pagePath(LOCALE, slug);
  ab(["open", `${BASE}${ruta}`]);
  const m = evalJSON<Medida>(MEDIR);
  if (m.grupo === null) {
    sinPliegue.push(ruta);
    continue;
  }
  conPliegue.push({ ruta, m });
  console.log(
    `  ${String(m.grupo).padStart(5)}px grupo · ${String(m.h1 ?? "?").padStart(5)}px h1   ${ruta}`,
  );
}

console.log(
  `\n  ${conPliegue.length} con apertura de pliegue · ${sinPliegue.length} sin ella` +
    (sinPliegue.length ? `: ${sinPliegue.join(" · ")}` : ""),
);

if (conPliegue.length === 0) {
  console.error(
    "\npliegue — NO HA MEDIDO NADA. Con cero aperturas esto aprobaría siempre, así\n" +
      "que falla a propósito. ¿Ha cambiado `FOLD_GROUP`, o no hay servidor delante?\n",
  );
  process.exit(1);
}

if (conPliegue.length === 1) {
  console.log(
    "\n✓ Solo una página comparte el pliegue, así que no hay nada con qué compararla.\n",
  );
  process.exit(0);
}

const problemas: string[] = [];

for (const eje of [
  { nombre: "el alto del grupo", leer: (m: Medida) => m.grupo },
  { nombre: "la posición del h1", leer: (m: Medida) => m.h1 },
] as const) {
  const valores = conPliegue
    .map((p) => ({ ruta: p.ruta, v: eje.leer(p.m) }))
    .filter((x): x is { ruta: string; v: number } => x.v !== null);

  if (valores.length !== conPliegue.length) {
    problemas.push(
      `${eje.nombre}: ${conPliegue.length - valores.length} página(s) sin medida. ` +
        "Una apertura sin `h1` no es un aprobado, es una página rota.",
    );
    continue;
  }

  const min = valores.reduce((a, b) => (a.v <= b.v ? a : b));
  const max = valores.reduce((a, b) => (a.v >= b.v ? a : b));
  const delta = max.v - min.v;
  if (delta > TOLERANCIA_PX) {
    problemas.push(
      `${eje.nombre} se separa ${delta}px (tolerancia ${TOLERANCIA_PX}): ` +
        `${min.ruta} mide ${min.v} y ${max.ruta} mide ${max.v}.`,
    );
  }
}

if (problemas.length === 0) {
  console.log(
    `\n✓ Las ${conPliegue.length} aperturas que comparten pliegue miden lo mismo, ` +
      `dentro de ${TOLERANCIA_PX}px.\n`,
  );
  process.exit(0);
}

console.error("\npliegue — las aperturas han dejado de coincidir:\n");
for (const p of problemas) console.error(`  · ${p}\n`);
console.error(
  "Centrar con `my-auto` reparte el sobrante arriba y abajo, así que dos grupos de\n" +
    "distinto alto dejan sus titulares a distinta altura y se nota al cambiar de\n" +
    "pestaña. Lo que toca es compactar la que sobresale — o, si no llega por\n" +
    "estructura, subir el SUELO de `FOLD_GROUP` en `components/ui/layout.ts` (P70.35).\n",
);
process.exit(1);
