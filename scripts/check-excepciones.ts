/**
 * ¿Sigue habiendo solo las excepciones que `BRAND.md` dice? — `npm run check:excepciones`.
 *
 * POR QUÉ EXISTE. `BRAND.md` §Ningún control se escribe a mano lleva una lista de
 * excepciones vivas, y esa lista **se escribía de memoria**. El 2026-08-25 se
 * derivó del disco por primera vez (P68.68) y estaba mal por los dos lados: decía
 * que el control sobre imagen era una excepción —no lo es, sale de `.video-facade`
 * en `globals.css`, que es una capa como lo es una variante— y no mencionaba la que
 * sí lo era, la tarjeta que se pulsa entera, escrita a mano en dos sitios. Es la
 * regla 1 de `BRAND.md` §Cómo se escribe una regla: un disparador que mira al lugar
 * equivocado no es una regla, es una nota.
 *
 * CÓMO SE MARCA UNA EXCEPCIÓN. Con un comentario en el punto de uso, misma familia
 * que el `// @pieza` que `indices.ts` lee de la cabecera de cada componente:
 *
 *     // @fuera-de-capa: <motivo en una línea> (<AAAA-MM-DD>)
 *
 * Va pegado al elemento, o a la constante que le da las clases. Sin él, un control
 * escrito a mano es deriva; con él, es una excepción que `BRAND.md` tiene que
 * nombrar.
 *
 * VA EN LAS DOS DIRECCIONES, que es la regla de método de todos los guardianes de
 * este repo: (1) todo control fuera de la capa lleva marca, y (2) toda marca sale
 * en la lista de `BRAND.md`. Con solo la primera, la lista podría quedarse con
 * excepciones fantasma; con solo la segunda, el código podría llenarse de controles
 * a mano sin que nadie lo notara.
 *
 * Y AFIRMA CUÁNTO HA MIRADO. Un guardián que devuelve lista vacía parece un
 * aprobado, y este proyecto se lo ha encontrado cinco veces.
 *
 * LO QUE NO MIRA, dicho para que no se dé por cubierto:
 *   · Las ilustraciones. Un dibujo de un botón no es un botón: aquí solo entran
 *     `<button>`, `<a>`, `<Link>` y los `role` interactivos.
 *   · Resuelve identificadores UN nivel: la constante local, y la exportada por un
 *     módulo del propio repo. Una cadena que pase por dos constantes encadenadas se
 *     le escapa — y por eso el informe dice cuántos elementos ha clasificado.
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

/** Todos los `.tsx` bajo esas carpetas. Del disco, nunca de una lista escrita. */
function archivosTsx(carpetas: string[]): string[] {
  const salida: string[] = [];
  const bajar = (dir: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) bajar(p);
      else if (e.name.endsWith(".tsx")) salida.push(p);
    }
  };
  for (const c of carpetas) bajar(join(process.cwd(), c));
  return salida;
}

/** De dónde puede salir legítimamente el aspecto de un control. */
const CAPAS = [
  "actionVariants",
  "chromeLinkVariants",
  "badgeVariants",
  "link-chrome",
  "link-content",
  "icon-chrome",
  "video-facade",
];

/**
 * La marca que convierte «escrito a mano» en «excepción documentada». No exige el
 * `//` porque dentro de JSX no se puede: ahí la mitad de los sitios donde hace
 * falta piden `{/* … *\/}`, y una convención que no se puede escribir donde ocurre
 * la cosa es la regla 1 de `BRAND.md` §Cómo se escribe una regla.
 */
const MARCA = /@fuera-de-capa:\s*([^]+?)\s*\((\d{4}-\d{2}-\d{2})\)/;

/** Lo que cuenta como control. `<a>` sin `href` no navega: es maquetación. */
const ELEMENTO =
  /<(button|a|Link)(\s[^]*?)?>|role=["'](button|switch|tab|link)["']/g;

/**
 * Y lo que cuenta como DECISIÓN DE ASPECTO, que es el corte que ya usa la Fase 1
 * de `design-review`: un `<a>` cuyas clases son solo tipografía o colocación no es
 * un control escrito a mano, es un enlace sin pintar. El enlace del logo del nav es
 * el caso: `inline-flex items-center no-underline` no decide nada que la capa tenga
 * que resolver. Sin este filtro el informe traía ocho de esos y se volvía ruido.
 */
const ASPECTO = /hover:|rounded-|border|bg-|px-|py-|min-h-|min-w-/;

type Hallazgo = { archivo: string; linea: number; muestra: string };

const raiz = process.cwd();
const fuentes = archivosTsx(["components", "app"]);

/** Texto de la definición de un identificador, en su archivo o en lo que importa. */
function resolverIdentificador(id: string, archivo: string): string {
  const texto = readFileSync(archivo, "utf8");
  // Con los comentarios de ENCIMA de la definición: la marca de una tarjeta escrita
  // a mano va pegada a su constante, no al `<a>` que la usa cien líneas más abajo.
  const local = new RegExp(
    `((?:^[ \\t]*//.*\\n){0,4})const ${id}\\s*=([\\s\\S]{0,600}?);\\n`,
    "m",
  ).exec(texto);
  if (local) return (local[1] ?? "") + (local[2] ?? "");

  // Un nivel de import: `import { X } from "./y"` o desde el alias `@/`.
  const imp = new RegExp(
    `import\\s*\\{[^}]*\\b${id}\\b[^}]*\\}\\s*from\\s*["']([^"']+)["']`,
  ).exec(texto);
  if (!imp?.[1]) return "";
  const spec = imp[1];
  const base = spec.startsWith("@/")
    ? join(raiz, spec.slice(2))
    : resolve(dirname(archivo), spec);
  for (const ext of [".tsx", ".ts", "/index.tsx", "/index.ts"]) {
    try {
      const otro = readFileSync(base + ext, "utf8");
      const def = new RegExp(
        `export const ${id}\\s*=([\\s\\S]{0,600}?);\\n`,
      ).exec(otro);
      if (def) return def[1] ?? "";
    } catch {
      /* el siguiente candidato */
    }
  }
  return "";
}

const sinMarca: Hallazgo[] = [];
const marcas: { archivo: string; motivo: string; fecha: string }[] = [];
let controles = 0;
let deLaCapa = 0;

for (const archivo of fuentes) {
  const texto = readFileSync(archivo, "utf8");
  const lineas = texto.split("\n");
  const rel = archivo.slice(raiz.length + 1).replaceAll("\\", "/");

  for (const [, motivo, fecha] of texto.matchAll(new RegExp(MARCA, "g"))) {
    // El motivo puede venir partido en dos líneas de comentario; se aplana para
    // que el informe se lea como una lista y no arrastre los `//` del medio.
    if (motivo && fecha)
      marcas.push({
        archivo: rel,
        motivo: motivo.replace(/\s*\n\s*(\/\/|\*)?\s*/g, " ").trim(),
        fecha,
      });
  }

  for (const m of texto.matchAll(ELEMENTO)) {
    const inicio = m.index ?? 0;
    // El `<a>` de maquetación no navega y no es un control.
    const abre = m[0];
    if (abre.startsWith("<a") && !abre.includes("href")) continue;
    // Ni cuenta un `<button>` citado dentro de un comentario, que es lo que hacía
    // que `action.tsx` —el archivo de las variantes— saliera como incumplidor.
    const lineaTexto =
      lineas[texto.slice(0, inicio).split("\n").length - 1] ?? "";
    if (
      lineaTexto.trimStart().startsWith("//") ||
      lineaTexto.trimStart().startsWith("*")
    )
      continue;
    controles++;

    // La cadena de clases del elemento, y lo que resuelvan sus identificadores.
    const trozo = texto.slice(inicio, inicio + 700);
    const cls = /className=\{?([\s\S]{0,300}?)[}>]\s/.exec(trozo)?.[1] ?? trozo;

    // DOS NIVELES de resolución, y el segundo hacía falta: los chips de descarga
    // del Brand Kit son `cn(cls, …)` donde `cls` es un ternario entre DL_PRIMARY y
    // DL_NEUTRAL, que son quienes llaman a la variante. Con un solo nivel salían
    // como escritos a mano.
    let resuelto = cls;
    for (let nivel = 0; nivel < 2; nivel++) {
      const antes = resuelto;
      for (const id of new Set(
        antes.match(/\b[A-Z][A-Z_0-9]{2,}\b|\b[a-z]\w+\b/g) ?? [],
      )) {
        if (CAPAS.includes(id)) continue;
        resuelto += " " + resolverIdentificador(id, archivo);
      }
      if (resuelto === antes) break;
    }

    if (CAPAS.some((c) => resuelto.includes(c))) {
      deLaCapa++;
      continue;
    }

    // EL ELEMENTO QUE RECIBE EL CLIC Y EL QUE ESTÁ PINTADO NO SIEMPRE SON EL MISMO
    // NODO, y esto se descubrió porque el barrido no veía NINGUNA de las dos
    // excepciones que `BRAND.md` sí lista: el switch del consentimiento pinta en un
    // `<span>` hermano de un `<input class="peer sr-only">`, y la píldora del riel
    // de artículo es un `<span>` dentro del `<a>`. Es D104 otra vez —el censo tuvo
    // este mismo problema— y es la razón por la que un metro se valida contra los
    // casos que ya damos por buenos ANTES de creerse sus hallazgos.
    // La ventana de los hijos va SIN comentarios: en el riel, entre el `<a>` y su
    // píldora hay quince líneas de porqué, y un `hover:` citado en prosa no es una
    // decisión de aspecto.
    const ventana = texto
      .slice(inicio, inicio + 1800)
      .split("\n")
      .filter((l) => !/^\s*(\/\/|\*|\{\/\*)/.test(l))
      .join("\n");
    const conHijos = ASPECTO.test(resuelto)
      ? resuelto
      : resuelto + " " + ventana;

    // Un enlace sin decisión de aspecto, ni suya ni de lo que envuelve, no es un
    // control escrito a mano: es un enlace sin pintar.
    if (!ASPECTO.test(conHijos)) continue;
    if (CAPAS.some((c) => conHijos.includes(c))) {
      deLaCapa++;
      continue;
    }

    // Sin capa: o lleva marca cerca, o es deriva.
    const linea = texto.slice(0, inicio).split("\n").length;
    const contexto = lineas.slice(Math.max(0, linea - 14), linea).join("\n");
    if (MARCA.test(contexto) || MARCA.test(resuelto)) continue;

    sinMarca.push({
      archivo: rel,
      linea,
      muestra: abre.replace(/\s+/g, " ").slice(0, 70),
    });
  }
}

// La otra dirección: toda marca tiene que salir en la lista de `BRAND.md`.
const brand = readFileSync(join(raiz, "BRAND.md"), "utf8");
const bloque =
  /### Ning[^\n]*\n([\s\S]*?)\n## /.exec(brand)?.[1] ??
  /excepciones vivas([\s\S]*?)\n\n\*\*/.exec(brand)?.[1] ??
  "";
const huerfanas = marcas.filter(
  (m) => !bloque.includes(m.archivo.split("/").pop() ?? " "),
);

console.log(
  `\ncheck:excepciones — ${controles} controles en ${fuentes.length} archivos · ` +
    `${deLaCapa} salen de la capa · ${marcas.length} marcados como excepción`,
);
for (const m of marcas) {
  console.log(`    ${m.fecha}  ${m.archivo} — ${m.motivo}`);
}

if (sinMarca.length === 0 && huerfanas.length === 0) {
  console.log(
    "✓ Ningún control fuera de la capa sin marca, y toda marca sale en BRAND.md.\n",
  );
  process.exit(0);
}

if (sinMarca.length > 0) {
  console.error(
    `\n  ${sinMarca.length} control(es) fuera de la capa y SIN marca:\n` +
      sinMarca
        .map((h) => `    ${h.archivo}:${h.linea}  ${h.muestra}`)
        .join("\n") +
      "\n\n  O sale de una variante, o lleva `// @fuera-de-capa: <motivo> (<fecha>)`\n" +
      "  y BRAND.md lo nombra. No hay tercera opción: eso es la deriva.\n",
  );
}
if (huerfanas.length > 0) {
  console.error(
    `\n  ${huerfanas.length} marca(s) que BRAND.md no nombra:\n` +
      huerfanas.map((m) => `    ${m.archivo} — ${m.motivo}`).join("\n") +
      "\n\n  Una excepción que el documento no lista es una excepción que nadie\n" +
      "  revisa. O se añade a §Ningún control se escribe a mano, o se retira.\n",
  );
}
process.exit(1);
