/**
 * Cómo se conduce `agent-browser` desde un script de Node.
 *
 * POR QUÉ ESTÁ APARTE (2026-08-28, P50.77). Lo escribió el censo, y la segunda
 * pasada que necesita navegador —la del pliegue— lo quería entero: la resolución
 * del binario, el `execFileSync` con su `maxBuffer`, y el desenvuelto doble del
 * JSON que devuelve `eval`. Copiarlo habría dejado dos conductores que se
 * arreglan por separado el día que el binario cambie de sitio. Es la Regla de
 * construcción aplicada a `scripts/`.
 *
 * EL ENTRY REAL, NO SU NOMBRE. En Windows el binario global es un `.cmd`, y desde
 * la CVE-2024-27980 Node se niega a lanzarlo con `execFileSync` sin `shell: true`
 * — que aquí no vale, porque los argumentos llevan URLs y trozos de JavaScript
 * que el shell destrozaría. El shim POSIX del propio paquete dice dónde está lo
 * que ejecuta: `node <root-global>/agent-browser/bin/agent-browser.js`. Se
 * resuelve una vez.
 *
 * Y LA PRECONDICIÓN QUE NO ESTÁ AQUÍ, porque no se puede comprobar desde dentro:
 * **el sandbox de Bash desactivado en TODAS las llamadas**, no solo las de
 * navegación. Bajo el sandbox ningún comando llega al daemon, ni con la página ya
 * cargada, y el síntoma es un comando que se cuelga (D51).
 */
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";

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
      "Instálalo con `npm i -g agent-browser` — esto necesita un navegador de verdad.",
  );
})();

/** Una llamada cruda a `agent-browser`. Devuelve su salida entera. */
export function ab(args: string[], input?: string): string {
  return execFileSync(process.execPath, [ENTRY, ...args], {
    encoding: "utf8",
    input,
    maxBuffer: 64 * 1024 * 1024,
  });
}

/**
 * Evalúa una expresión en la página y devuelve el valor ya desenvuelto.
 *
 * `eval` imprime la cadena JSON ENTRECOMILLADA y precedida de su propio ruido, de
 * ahí el `split` por líneas y el `JSON.parse` doble. Escrito una vez aquí porque
 * las dos veces que se escribió a mano fue igual, y equivocarse en esto no da un
 * error: da un objeto raro que el llamante interpreta como una medida.
 */
export function evalJSON<T>(expresion: string): T {
  const crudo = ab(["eval", `JSON.stringify(${expresion})`]);
  return JSON.parse(JSON.parse(crudo.trim().split("\n").pop()!)) as T;
}
