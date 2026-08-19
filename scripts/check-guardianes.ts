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
 * POR QUÉ NO ESTÁ EN CI. Porque muta archivos rastreados para provocar el fallo, y
 * un job que escribe en el árbol de trabajo es la clase de cosa que sale cara el
 * día que se interrumpe a medias. Se dispara a mano al tocar un guardián, y es
 * casilla de la DoD cuando el trabajo crea o cambia uno.
 *
 * SEGURIDAD. Se niega a arrancar con el árbol sucio, restaura en `finally` desde
 * la copia en memoria, y verifica al final que no ha dejado nada movido. Si aun
 * así muriera a mitad, `git checkout .` lo deshace: por eso exige árbol limpio.
 */
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

type Caso = {
  guardian: string;
  /** Qué se rompe, en una línea, para que el informe se lea sin abrir el código. */
  rotura: string;
  archivo: string;
  /** Del contenido original al mutado. */
  mutar: (original: string) => string;
};

/** Añade texto al final. Sirve para los que miran un archivo entero. */
const append = (texto: string) => (o: string) => o + texto;

const CASOS: Caso[] = [
  {
    guardian: "check:raya",
    rotura: "una raya en una cadena de copy del diccionario",
    archivo: "app/[lang]/dictionaries/es/common.json",
    mutar: (o) => o.replace(/"([^"]{12,})"(\s*[,}])/, '"$1 — con raya"$2'),
  },
  {
    guardian: "check:palette",
    rotura: "un hex de token copiado a mano en un componente",
    archivo: "lib/utils.ts",
    mutar: append(
      '\n// #005859 copiado a mano donde no toca\nexport const MAL = "#005859";\n',
    ),
  },
  {
    guardian: "check:cv",
    rotura: "el contenido del CV cambia y los PDFs no se regeneran",
    archivo: "content/cv/content.es.ts",
    mutar: (o) => o.replace(/"([A-Za-zÁÉÍÓÚáéíóúñ]{6,})"/, '"$1X"'),
  },
  {
    guardian: "check:artefacto",
    rotura: "se edita el .mmd y no se vuelve a generar el SVG",
    archivo: "content/artefactos/emendu-mdm.mmd",
    mutar: append("\n%% comentario que no está en el SVG publicado\n"),
  },
  {
    guardian: "check:contexto",
    rotura: "un @-importado engorda por encima del techo",
    archivo: "PRD-Live.md",
    mutar: append("\n" + "relleno ".repeat(4000) + "\n"),
  },
  {
    guardian: "check:decisiones",
    rotura: "una decisión se queda sin línea en el índice",
    archivo: "CLAUDE.md",
    mutar: (o) => o.replace(/^- D33 · .*$/m, ""),
  },
  {
    guardian: "check:skills",
    rotura: "una skill nombra un archivo que ya no existe",
    archivo: ".claude/skills/close-session/SKILL.md",
    mutar: append("\nVer `lib/esto-no-existe.ts` para el detalle.\n"),
  },
];

/** Corre un guardián y devuelve su código de salida, sin volcar su ruido. */
function salida(guardian: string): number {
  try {
    execSync(`npm run ${guardian}`, { stdio: "pipe" });
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

console.log(
  `check:guardianes — ${CASOS.length} guardianes, un caso malo cada uno\n`,
);

const fallos: string[] = [];

for (const caso of CASOS) {
  const original = readFileSync(caso.archivo, "utf8");
  let veredicto: string;
  try {
    const mutado = caso.mutar(original);
    if (mutado === original) {
      veredicto = "NO SE PUDO ROMPER";
      fallos.push(
        `${caso.guardian}: la mutación no cambió ${caso.archivo}. El caso malo ha ` +
          "caducado — el archivo ya no tiene la forma que esta prueba esperaba.",
      );
    } else {
      writeFileSync(caso.archivo, mutado, "utf8");
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
    writeFileSync(caso.archivo, original, "utf8");
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
  "\n✓ Los siete guardianes rechazan su caso malo. El árbol queda como estaba.",
);
