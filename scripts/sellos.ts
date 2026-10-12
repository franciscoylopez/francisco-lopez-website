/**
 * ESCRIBIR UN SELLO CON EL FORMATO QUE `format:check` ESPERA (2026-09-07, P72.61).
 *
 * EL FALLO, MEDIDO. `npm run deuda:sellar` escribía `scripts/.deuda-sello.json`
 * con `JSON.stringify(x, null, 2)`, y el paso siguiente de CI —`prettier --check`
 * sobre todo el repo— lo marcaba en rojo: 90 líneas escritas contra 56
 * formateadas. Y difiere UNA sola cosa, no el formato entero: los arrays de un
 * solo número. `JSON.stringify` los rompe siempre en varias líneas y Prettier los
 * colapsa si caben en el ancho. Así que quien re-sella —una decisión rara y
 * deliberada, que es justo el momento en que el trinquete quiere que se mire el
 * diff— se llevaba de propina una vuelta de CI en rojo ajena a la deuda.
 *
 * POR QUÉ UN HELPER Y NO SEIS ARREGLOS. Este repo escribe SEIS sellos en JSON
 * —deuda, psi, agentes, medición, peso del markdown e inventario del censo— con la
 * misma línea copiada. Hoy solo falla el de deuda, porque es el único cuyo JSON
 * lleva arrays cortos; los otros cinco están a un campo de distancia de fallar
 * igual. Se arregla el patrón, no el síntoma.
 *
 * POR QUÉ EL BINARIO Y NO LA API, que era lo que proponía la ficha. La API de
 * Prettier 3 es async, y tres de los seis escritores cuelgan de código de módulo
 * que tsx compila a CJS, donde no hay `await` de primer nivel: usarla obligaba a
 * reestructurar tres guardianes para cambiar una línea en cada uno. El binario,
 * además, formatea POR DEFINICIÓN igual que el `format:check` de CI —mismo
 * prettier, misma config, mismo `.prettierignore`—, así que las dos mitades del
 * contrato no pueden separarse.
 *
 * Y SI PRETTIER NO ESTÁ, NO DEJA UN SELLO A MEDIO FORMATEAR: revienta diciendo por
 * qué. Un sello mal formateado no rompe nada hoy y pone el CI en rojo mañana, que
 * es exactamente el modo de fallo que este archivo existe para cerrar.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname } from "node:path";

/** El prettier de este repo, resuelto por node desde la raíz. */
function binarioPrettier(): string {
  try {
    return createRequire(`${process.cwd()}/`).resolve(
      "prettier/bin/prettier.cjs",
    );
  } catch {
    throw new Error(
      "no encuentro `prettier` en node_modules, así que el sello quedaría con un " +
        "formato que `npm run format:check` va a marcar en rojo. Corre `npm ci`.",
    );
  }
}

/**
 * Escribe `valor` como JSON en `ruta`, ya con el formato de Prettier. Es la única
 * forma en que este repo escribe un sello: ver la cabecera.
 */
export function escribeSelloJson(ruta: string, valor: unknown): void {
  const prettier = binarioPrettier();
  mkdirSync(dirname(ruta), { recursive: true });
  writeFileSync(ruta, `${JSON.stringify(valor, null, 2)}\n`, "utf8");
  execFileSync(
    process.execPath,
    [prettier, "--write", "--log-level", "warn", ruta],
    { stdio: "inherit" },
  );
}
