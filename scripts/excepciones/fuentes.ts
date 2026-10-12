/**
 * De dónde se lee — los `.tsx` del disco y el texto de un identificador.
 *
 * Aparte de la clasificación porque son dos cosas distintas: esto es E/S y
 * resolución de nombres; lo de al lado es el criterio de qué cuenta como control.
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

export const raiz = process.cwd();

/** Todos los `.tsx` bajo esas carpetas. Del disco, nunca de una lista escrita. */
export function archivosTsx(carpetas: string[]): string[] {
  const salida: string[] = [];
  const bajar = (dir: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) bajar(p);
      else if (e.name.endsWith(".tsx")) salida.push(p);
    }
  };
  for (const c of carpetas) bajar(join(raiz, c));
  return salida;
}

/** Texto de la definición de un identificador, en su archivo o en lo que importa. */
export function resolverIdentificador(id: string, archivo: string): string {
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
