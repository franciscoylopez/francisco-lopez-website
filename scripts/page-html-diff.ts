// Gate de refactor del sitio: el HTML servido no puede cambiar (P37.69).
//
// POR QUÉ ESTO Y NO TESTS. Partir `design-system.tsx` y `brand-kit.tsx` en un
// archivo por sección mueve ~2.800 líneas de markup sin querer cambiar ni un
// píxel. Unas aserciones elegidas a mano solo comprueban lo que a alguien se le
// ocurrió comprobar; un **snapshot total del HTML servido** comprueba todo lo
// que la página emite, incluidas las clases —que van en el atributo— y los
// espacios entre elementos inline, que es justo lo que un movimiento de JSX
// rompe sin avisar. Diff vacío = correcto por construcción, sin volver a
// disparar `design-review`.
//
// Por eso se descartó meter el arnés de tests (P37.75) en esta ola: esto es más
// fuerte para este trabajo, y es su semilla.
//
// AMPLIADO A LAS SEIS PÁGINAS (P42, 2026-08-10). Nació cubriendo solo los dos
// showcase —de ahí el nombre viejo, `showcase-html-diff.ts`— porque era el
// refactor que había delante. Lo que P42 refactoriza es el andamiaje COMÚN
// (metadata y marco de página), así que el gate tiene que ver lo común: las seis
// páginas × los dos idiomas. Y lo que un helper de metadata rompe no está en el
// `<body>` —un `hreflang` mal derivado, un `canonical` perdido— sino en el
// `<head>`, que este snapshot compara entero.
//
// USO — con el sitio SERVIDO (los dos comandos, contra el mismo servidor):
//
//     npm run build && npm start          # en otra terminal
//     npm run gate:html -- save           # ANTES de tocar nada
//     …refactor…
//     npm run gate:html                   # después: sale 0 si nada cambió
//
// Sirve dev (`npm run dev`) para iterar rápido, pero la línea base y la
// comprobación tienen que salir del MISMO modo: dev y prod emiten HTML distinto.
//
// LO QUE SE NORMALIZA, Y POR QUÉ CADA COSA. Todo lo demás se compara tal cual:
// la gracia del gate es no tener criterio propio.

import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const BASELINE = join("scripts", ".html-baseline");
const ACTUAL = join("scripts", ".html-actual");

/** Las doce variantes: las seis páginas del sitio × los dos idiomas. */
const ROUTES = [
  "/",
  "/sobre-mi",
  "/brand-kit",
  "/design-system",
  "/accesibilidad",
  "/cookies",
  "/en",
  "/en/sobre-mi",
  "/en/brand-kit",
  "/en/design-system",
  "/en/accesibilidad",
  "/en/cookies",
] as const;

const slug = (route: string) =>
  (route === "/" ? "home" : route.slice(1).replaceAll("/", "-")) + ".html";

function normalize(html: string): string {
  return (
    html
      // 1. Los <script> se van ENTEROS. Llevan la carga de React Server
      //    Components, que codifica el árbol de módulos: cambia al partir un
      //    archivo aunque el DOM resultante sea idéntico. Es exactamente el
      //    cambio que este gate NO debe vigilar.
      .replace(/<script[\s\S]*?<\/script>/g, "")
      // 2. Los assets de /_next llevan hash de contenido. El del CSS cambia si
      //    cambia el orden de los archivos fuente, cosa que un movimiento sí
      //    hace y que no se ve en la página.
      .replace(/\/_next\/static\/[^"']+/g, "/_next/static/<hash>")
      // 3. Un salto de línea SOLO donde dos etiquetas ya iban pegadas. Es una
      //    partición sin pérdida: el espacio en blanco entre elementos inline
      //    —que decide si dos palabras salen separadas— se conserva intacto y
      //    entra en la comparación. Colapsarlo sería esconder el fallo típico
      //    de mover JSX de sitio.
      .replaceAll("><", ">\n<")
      .trim() + "\n"
  );
}

async function capture(dir: string) {
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });

  for (const route of ROUTES) {
    const res = await fetch(BASE + route);
    if (!res.ok) {
      throw new Error(
        `${BASE + route} respondió ${res.status}. ¿Está el servidor levantado?`,
      );
    }
    writeFileSync(join(dir, slug(route)), normalize(await res.text()), "utf8");
  }
}

/**
 * Se delega el diff a git en vez de escribir uno: da salida legible, colorea y
 * ya está instalado. `--no-index` compara dos rutas cualesquiera.
 */
function diff(a: string, b: string): boolean {
  let limpio = true;
  for (const route of ROUTES) {
    try {
      execFileSync(
        "git",
        [
          "--no-pager",
          "diff",
          "--no-index",
          "--exit-code",
          "--unified=2",
          join(a, slug(route)),
          join(b, slug(route)),
        ],
        { stdio: "inherit" },
      );
    } catch {
      limpio = false;
    }
  }
  return limpio;
}

// Envuelto en `main()` y no a nivel de módulo porque este repo no es ESM: `tsx`
// transpila a CJS, donde el `await` de arriba del todo no existe.
async function main() {
  const modo = process.argv[2] ?? "check";

  if (modo === "save") {
    await capture(BASELINE);
    console.log(
      `Línea base capturada en ${BASELINE} (${ROUTES.length} variantes, desde ${BASE}).`,
    );
    return;
  }

  if (modo !== "check") {
    console.error(`Modo desconocido: ${modo}. Usa "save" o "check".`);
    process.exit(2);
  }

  try {
    readFileSync(join(BASELINE, slug(ROUTES[0])));
  } catch {
    console.error(
      `No hay línea base en ${BASELINE}. Captúrala ANTES de refactorizar:\n  npm run gate:html -- save`,
    );
    process.exit(2);
  }

  await capture(ACTUAL);
  if (diff(BASELINE, ACTUAL)) {
    console.log(
      `Sin cambios en el HTML de las ${ROUTES.length} variantes. El refactor es transparente.`,
    );
    rmSync(ACTUAL, { recursive: true, force: true });
  } else {
    console.error(
      `\nEl HTML servido CAMBIÓ. Si el cambio es intencionado, vuelve a capturar la línea base; si no, el refactor no es transparente.`,
    );
    process.exit(1);
  }
}

void main();
