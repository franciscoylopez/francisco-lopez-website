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

type Caso = {
  guardian: string;
  /** Qué se rompe, en una línea, para que el informe se lea sin abrir el código. */
  rotura: string;
  /**
   * Qué se rompe. Normalmente un archivo FUENTE; en `check:marco`, el HTML del
   * build, que es su entrada de verdad. Rastreado o no: se restaura desde memoria.
   */
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
    guardian: "check:experiencias",
    rotura: "un bullet que existe en ES y no en EN",
    archivo: "content/experience-copy/en.ts",
    // Se quita un bullet entero, que rompe la PARIDAD ES↔EN. No es un caso malo
    // cualquiera: .qlty/qlty.toml excluye estos dos archivos del análisis de
    // duplicación con el argumento de que su duplicación estructural es
    // «exactamente la propiedad que check:experiencias existe para GARANTIZAR».
    // O sea que un informe de calidad se apoya en este guardián, y hasta hoy
    // nadie había comprobado que supiera fallar.
    mutar: (o) => o.replace(/\n      \{\n        cv: [\s\S]*?\n      \},/, ""),
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
    guardian: "check:indices",
    rotura: "una decisión se queda sin línea en el índice",
    archivo: "CLAUDE.md",
    mutar: (o) => o.replace(/^- D33 · .*$/m, ""),
  },
  {
    guardian: "check:rutas",
    rotura: "una página que existe en disco y no está en el registro",
    archivo: "lib/routes.ts",
    // Se borra un slug de STATIC_PAGE_SLUGS. En el repo de verdad eso además no
    // compilaría —los dos Record del sitemap y de llms.txt dejarían de ser
    // exhaustivos—, pero el guardián corre con tsx, que transpila sin comprobar
    // tipos: aquí se mide lo que ve él, que es el disco contra el registro.
    mutar: (o) => o.replace(/\n  "cookies",/, ""),
  },
  {
    guardian: "check:skills",
    rotura: "una skill nombra un archivo que ya no existe",
    archivo: ".claude/skills/close-session/SKILL.md",
    mutar: append("\nVer `lib/esto-no-existe.ts` para el detalle.\n"),
  },
  {
    guardian: "check:marco",
    rotura: "una página se queda sin enlace de salto (WCAG 2.4.1, nivel A)",
    // ÚNICO CASO QUE MUERDE UN ARTEFACTO DEL BUILD y no un archivo fuente, y es a
    // propósito: la ENTRADA de este guardián es el HTML que el sitio emite, no el
    // código que lo genera. Romper el componente no se vería sin volver a
    // construir —dos minutos por caso—, y sobre todo probaría otra cosa: que el
    // build propaga el cambio, no que el detector sabe verlo.
    //
    // El archivo está en `.gitignore`, así que el `git status` de arriba y el de
    // abajo no lo ven; la restauración es la misma de siempre, desde memoria.
    archivo: ".next/server/app/es.html",
    mutar: (o) => o.replace(/<a href="#main"[\s\S]*?<\/a>/, ""),
  },
  {
    guardian: "check:articulo",
    rotura:
      "cambia una fuente que el artículo describe y su sección no se revisa",
    // `next.config.ts` es dependencia de la §07 («seguridad, alojamiento y la
    // deuda que no se acumuló»), que es exactamente la sección que va a
    // invalidar la CSP estricta con nonces (P64.5). El caso malo es el escenario
    // real, no uno inventado.
    archivo: "next.config.ts",
    mutar: append("\n// cambio en las cabeceras que el artículo describe\n"),
  },
  {
    guardian: "check:articulo",
    rotura: "una cita vuelve a guardar su línea a mano en el diccionario",
    // La regresión de la capa 1. Una línea escrita a mano no rompe nada visible
    // —el enlace sigue abriendo el archivo, solo que en el párrafo equivocado—,
    // que es cómo 27 de 38 citas llevaban días apuntando diez líneas arriba.
    archivo: "app/[lang]/dictionaries/es/como-se-ha-creado.json",
    mutar: (o) =>
      o.replace(
        /\{ "label": "D29", "path": "DECISIONS\.md" \}/,
        '{ "label": "D29", "path": "DECISIONS.md", "line": 844 }',
      ),
  },
];

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

console.log(
  `check:guardianes — ${CASOS.length} guardianes, un caso malo cada uno\n`,
);

const fallos: string[] = [];

for (const caso of CASOS) {
  let original: string;
  try {
    original = readFileSync(caso.archivo, "utf8");
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
    const mutado = caso.mutar(original);
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
    } else if (mutado === original) {
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
  `\n✓ Los ${CASOS.length} guardianes rechazan su caso malo. El árbol queda como estaba.`,
);
