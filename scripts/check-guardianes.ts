/**
 * ¿Los guardianes saben decir que no? — `npm run check:guardianes`.
 *
 * POR QUÉ EXISTE. Hay ~1.900 líneas de guardianes en `scripts/` y cero tests, y su
 * modo de fallo es **una luz verde**. No es hipotético: el censo de contraste se
 * ha roto DOS veces en silencio —primero el bucle plano que se saltaba las
 * utilidades `hover:` envueltas en `@media`, después CSS Nesting haciendo que
 * `if (rule.cssRules)` fuese siempre cierto, con lo que encontraba 0 reglas
 * `:hover` donde hay 21—. Las dos veces se descubrió igual: midiendo un caso cuyo
 * resultado ya se conocía.
 *
 * Eso ya se hace, pero **como hábito**: cada guardián de este repo se «validó
 * rompiéndolo» el día que se escribió. Un hábito se olvida y no deja rastro. Esto
 * lo vuelve un comando: por cada guardián, un caso malo conocido que TIENE que
 * rechazar. Es lo contrario de un test de que funciona — es un test de que sabe
 * fallar.
 *
 * Y se mide EN LAS DOS DIRECCIONES: primero que el guardián esté verde sobre el
 * árbol limpio, después que salga rojo sobre el caso malo. Solo la segunda mitad
 * daría por bueno a un guardián roto por cualquier otra causa, que sale con
 * código 1 pase lo que pase.
 *
 * DÓNDE CORRE. En CI, como un paso más, desde el 2026-08-19. Nació fuera con este
 * argumento: muta archivos rastreados para provocar el fallo, y un job que escribe
 * en el árbol de trabajo sale caro el día que se interrumpe a medias. Eso vale para
 * un árbol con trabajo dentro, no para un runner que se tira al terminar — y el
 * precio de dejarlo fuera era justo el modo de fallo que este script existe para
 * cerrar: un guardián que solo corre si alguien se acuerda no es un guardián, es
 * una nota. Se sigue lanzando a mano al tocar un guardián, y es casilla de la DoD
 * cuando el trabajo crea o cambia uno.
 *
 * NECESITA EL BUILD. Desde `check:marco` (P58.5) hay un caso que muerde el HTML
 * prerenderizado en vez de un archivo fuente, porque esa es la ENTRADA de ese
 * guardián. Sin `.next`, ese caso no se puede probar — y no se salta en silencio:
 * se cuenta como fallo, que es lo contrario de lo que este script combate. Por eso
 * en CI va DETRÁS de `Build` y no delante.
 *
 * SEGURIDAD. Se niega a arrancar con el árbol sucio, restaura en `finally` desde
 * la copia en memoria, y verifica al final que no ha dejado nada movido. Si aun
 * así muriera a mitad, `git checkout .` lo deshace: por eso exige árbol limpio.
 */
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

import { CASOS } from "./guardianes/casos";

/**
 * Corre un guardián y devuelve su código de salida, sin volcar su ruido.
 *
 * `maxBuffer` explícito y generoso: el de por defecto es 1 MiB, y un guardián al
 * que se le acaba de romper su archivo puede volverse mucho más verboso de lo
 * normal. Si lo matara el buffer, `execSync` lanzaría igual que si hubiera
 * fallado, y este script lo puntuaría como «lo rechaza» — un verde falso dentro
 * del verificador de verificadores.
 */
function salida(guardian: string): number {
  try {
    execSync(`npm run ${guardian}`, {
      stdio: "pipe",
      maxBuffer: 32 * 1024 * 1024,
    });
    return 0;
  } catch (e) {
    return (e as { status?: number }).status ?? 1;
  }
}

const sucio = execSync("git status --porcelain", { encoding: "utf8" }).trim();
if (sucio) {
  console.error(
    "\ncheck:guardianes — el árbol de trabajo tiene cambios sin commitear.\n\n" +
      "Esto MUTA archivos rastreados para comprobar que los guardianes fallan, y\n" +
      "restaura al terminar. Con cambios pendientes, una interrupción a mitad sería\n" +
      "indistinguible de tu trabajo. Commitea o guarda antes.\n",
  );
  process.exit(1);
}

// Guardianes y casos dejaron de ser lo mismo el día que `check:articulo` trajo
// dos —uno por cada mitad de lo que vigila—, así que la cabecera cuenta las dos
// cosas. Decir «12 guardianes» habiendo once es la clase de cifra que este
// archivo existe para no publicar.
const GUARDIANES = new Set(CASOS.map((c) => c.guardian)).size;

console.log(
  `check:guardianes — ${GUARDIANES} guardianes, ${CASOS.length} casos malos\n`,
);

const fallos: string[] = [];

for (const caso of CASOS) {
  // Un caso BINARIO se lee y se restaura como bytes. Pasar un PNG por `utf8` en
  // los dos sentidos lo destroza: volvería «restaurado» y distinto, y el arnés lo
  // cazaría al final como que no ha sabido limpiar (2026-08-30, P68.737).
  const binario = caso.binario === true;
  let original: string | Buffer;
  try {
    original = binario
      ? readFileSync(caso.archivo)
      : readFileSync(caso.archivo, "utf8");
  } catch {
    // Un caso sin material NO se salta en silencio: saltarlo dejaría a su
    // guardián sin comprobar y con el mismo ✓ final, que es exactamente el modo
    // de fallo que este script existe para cerrar. Pasa con los casos que muerden
    // un artefacto DERIVADO (el HTML del build) en vez de un archivo fuente.
    console.log(
      `  ${"SIN MATERIAL".padEnd(18)} ${caso.guardian.padEnd(20)} ${caso.rotura}`,
    );
    fallos.push(
      `${caso.guardian}: no existe \`${caso.archivo}\`, así que su caso malo no se ha podido ` +
        "probar. Si es un artefacto del build, corre `npm run build` antes.",
    );
    continue;
  }
  let veredicto: string;
  try {
    const mutado = binario
      ? caso.mutar(original as Buffer)
      : caso.mutar(original as string);
    const intacto = binario
      ? (mutado as Buffer).equals(original as Buffer)
      : mutado === original;
    // ANTES de romper nada: ¿está verde? Un código distinto de 0 no significa por
    // sí solo «lo rechaza» — un guardián roto por otra causa (un error suyo, una
    // dependencia que no resuelve) también sale con 1 sobre el archivo mutado, y
    // sin esta pasada quedaría puntuado como que tiene dientes. Es el verde falso
    // viviendo DENTRO del verificador de verificadores, que es la única clase de
    // fallo que este script no puede permitirse.
    if (salida(caso.guardian) !== 0) {
      veredicto = "YA ESTABA ROJO";
      fallos.push(
        `${caso.guardian}: falla ya sobre el árbol limpio, así que rechazar su caso ` +
          "malo no prueba nada. Arréglalo y vuelve a pasar esto.",
      );
    } else if (intacto) {
      veredicto = "NO SE PUDO ROMPER";
      fallos.push(
        `${caso.guardian}: la mutación no cambió ${caso.archivo}. El caso malo ha ` +
          "caducado — el archivo ya no tiene la forma que esta prueba esperaba.",
      );
    } else {
      // Sin encoding cuando es un Buffer: `writeFileSync` escribe los bytes tal
      // cual, que es lo único que devuelve el archivo idéntico al restaurarlo.
      if (binario) writeFileSync(caso.archivo, mutado as Buffer);
      else writeFileSync(caso.archivo, mutado as string, "utf8");
      const codigo = salida(caso.guardian);
      if (codigo === 0) {
        veredicto = "NO LO VE";
        fallos.push(
          `${caso.guardian}: NO detecta «${caso.rotura}». Sale con 0 sobre un caso ` +
            "que tiene que rechazar.",
        );
      } else {
        veredicto = "lo rechaza";
      }
    }
  } finally {
    if (binario) writeFileSync(caso.archivo, original as Buffer);
    else writeFileSync(caso.archivo, original as string, "utf8");
  }
  console.log(
    `  ${veredicto.padEnd(18)} ${caso.guardian.padEnd(20)} ${caso.rotura}`,
  );
}

const quedaSucio = execSync("git status --porcelain", {
  encoding: "utf8",
}).trim();
if (quedaSucio) {
  console.error(
    `\ncheck:guardianes — NO HA RESTAURADO BIEN. Quedan cambios:\n${quedaSucio}\n` +
      "Deshazlos con `git checkout .` y revisa la mutación que los dejó.\n",
  );
  process.exit(1);
}

if (fallos.length) {
  console.error(
    `\ncheck:guardianes — ${fallos.length} guardián(es) sin dientes:\n`,
  );
  for (const f of fallos) console.error(`  · ${f}\n`);
  console.error(
    "Un guardián que no rechaza su propio caso malo no está vigilando nada, y su\n" +
      "modo de fallo es un tick verde. El censo de contraste se rompió así dos veces.",
  );
  process.exit(1);
}

console.log(
  `\n✓ Los ${GUARDIANES} guardianes rechazan sus ${CASOS.length} casos malos. El árbol queda como estaba.`,
);
