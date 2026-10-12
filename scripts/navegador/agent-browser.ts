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

/**
 * Cuánto se le concede a UNA llamada antes de darla por muerta. Ninguna tarda más
 * de unos segundos; el tope es holgado a propósito, porque lo que tiene que cazar
 * es un cuelgue, no una lentitud.
 */
const TOPE_MS = Number(process.env.AB_TIMEOUT_MS ?? 120_000);

/**
 * Una llamada cruda a `agent-browser`. Devuelve su salida entera.
 *
 * DOS COSAS QUE NO SE VEN Y SON LA MITAD DE ESTA FUNCIÓN (2026-08-28, P50.78):
 *
 * 1. **El `stdin` no se hereda NUNCA.** `execFileSync` sin `input` deja `stdio[0]`
 *    en `inherit`, así que el hijo se queda con el `stdin` del padre; y en una
 *    shell no interactiva —el harness en segundo plano, CI— ese `stdin` no se
 *    cierra jamás. El síntoma medido: una de las seis llamadas por corrida
 *    esperando para siempre, con 0,1 s de CPU acumulado tras diez minutos. Pasar
 *    `input` siempre, aunque sea la cadena vacía, convierte `stdin` en una tubería
 *    que se cierra sola. El `< /dev/null` que se usaba de parche NO valía, porque
 *    en segundo plano no manda el shell desde el que se lanza.
 * 2. **Y un tope de reloj**, porque un cuelgue por cualquier OTRO motivo se sigue
 *    leyendo igual desde fuera: silencio. Sin él, la única forma de distinguir «va
 *    lento» de «está muerto» era sondear el navegador a mano cada veinte segundos.
 */
export function ab(args: string[], input?: string): string {
  try {
    return execFileSync(process.execPath, [ENTRY, ...args], {
      encoding: "utf8",
      input: input ?? "",
      timeout: TOPE_MS,
      maxBuffer: 64 * 1024 * 1024,
    });
  } catch (e) {
    const err = e as NodeJS.ErrnoException & { signal?: string };
    // Un timeout de `execFileSync` llega como SIGTERM, no como un código que se
    // reconozca de un vistazo. Se traduce aquí para que el llamante no tenga que
    // saberlo, y para nombrar de paso la causa más frecuente.
    if (err.signal === "SIGTERM" || err.code === "ETIMEDOUT") {
      throw new Error(
        `agent-browser no respondió en ${TOPE_MS / 1000}s a «${args.slice(0, 2).join(" ")}». ` +
          "Si el navegador está vivo, la causa casi siempre es el sandbox de Bash: " +
          "esto necesita lanzar Chrome, y bajo el sandbox muere al arrancar (D51).",
      );
    }
    throw e;
  }
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
