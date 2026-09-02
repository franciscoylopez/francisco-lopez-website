/**
 * El guion del censo, compuesto — la única forma de leerlo desde Node.
 *
 * POR QUÉ SE CONCATENA. `censo/` son ocho piezas que se inyectan en la página con
 * `ab(["eval", "--stdin"], texto)`, y **tienen que llegar como UN solo texto**:
 * los `const` de nivel superior de un script clásico viven en el ámbito de ESE
 * script, así que ocho inyecciones separadas no se verían entre ellas y
 * `window.contrastCensus` quedaría sin la mitad de su instrumental. El orden lo
 * dan los números del nombre, que por eso llevan cero delante.
 *
 * Y LO USAN TRES CONDUCTORES —`censo.ts`, `color-solo.ts` y
 * `censo/sobre-imagen.ts`—, que antes hacían cada uno su `readFileSync`. Es la
 * misma razón por la que `navegador/agent-browser.ts` existe: dos copias de la
 * misma lectura se arreglan por separado el día que el archivo cambie de sitio.
 *
 * EL SUELO DEL METRO, aquí también: si el guion compuesto no define las tres
 * entradas que la página va a llamar, se para. Sin esta comprobación, una pieza
 * que se dejara de leer —un `.js` renombrado, un directorio movido— daría un
 * `window.contrastCensus is not a function` a mitad de la pasada, veintiocho
 * corridas más tarde y sin decir por qué.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

/** Las piezas de un directorio, en el orden de sus números, ya concatenadas. */
function compone(dir: string, entradas: string[]): string {
  const raiz = join("scripts", "design-review", dir);
  const piezas = readdirSync(raiz)
    .filter((f) => f.endsWith(".js"))
    .sort();
  const texto = piezas
    .map((p) => readFileSync(join(raiz, p), "utf8"))
    .join("\n");

  const faltan = entradas.filter((e) => !texto.includes(`${e} =`));
  if (piezas.length === 0 || faltan.length) {
    throw new Error(
      `el guion de \`${raiz}\` se ha compuesto con ${piezas.length} pieza(s) y no define ` +
        `${faltan.join(", ") || "nada"}. La pasada mediría sobre una página sin metro, ` +
        "que es exactamente el aprobado en falso que estos guiones existen para no dar.",
    );
  }
  return texto;
}

/** El censo de contraste: los dos pases y su instrumental. */
export const guionDelCenso = () =>
  compone("censo", [
    "window.contrastCensus",
    "window.paresSobreImagen",
    "window.freezeMotion",
  ]);

/**
 * El detector del punto 6, que se inyecta DESPUÉS del censo y en la misma página:
 * usa sus helpers de color (`paint`, `label`) y su `freezeMotion`.
 */
export const guionDelDetector = () =>
  compone("color-solo", ["window.colorSolo", "window.colorSoloCasoMalo"]);
