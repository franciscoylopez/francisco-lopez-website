import robots from "../../app/robots";
import { SITE_URL } from "../../lib/site";
import { fallo, vistos } from "./informe";

/* -------------------------------------------------------------------------- */
/* 4. `robots.txt` — los dos entornos, porque el de CI no es el de producción   */
/* -------------------------------------------------------------------------- */

function conEntorno<T>(valor: string | undefined, fn: () => T): T {
  const previo = process.env.VERCEL_ENV;
  if (valor === undefined) delete process.env.VERCEL_ENV;
  else process.env.VERCEL_ENV = valor;
  try {
    return fn();
  } finally {
    if (previo === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = previo;
  }
}

export function revisarRobots(): void {
  // EN PRODUCCIÓN. Se ejecuta la función en vez de leer el artefacto porque el
  // que se construye en CI es el de NO producción: leerlo daría por bueno un
  // `Disallow: /` y este guardián estaría certificando lo contrario de lo que
  // cree.
  vistos.entornosRobots++;
  const prod = conEntorno("production", () => robots());
  const reglas = Array.isArray(prod.rules) ? prod.rules : [prod.rules];
  if (!reglas.some((r) => r.allow)) {
    fallo("robots.txt", "en producción no permite rastrear nada.");
  }
  if (prod.sitemap !== `${SITE_URL}/sitemap.xml`) {
    fallo(
      "robots.txt",
      `en producción su \`Sitemap\` dice «${String(prod.sitemap)}» y tenía que ser ` +
        `\`${SITE_URL}/sitemap.xml\`. Es la vía por la que un rastreador descubre las ` +
        "páginas sin adivinar rutas.",
    );
  }

  revisarSenales(reglas);

  // Y FUERA DE PRODUCCIÓN SIGUE CERRADO (D13). Va aquí y no en otro sitio porque
  // el modo de fallo es concreto: el día que este gate diera rojo, la salida
  // fácil sería quitarle el gateo por entorno a `robots()` y dejar todo abierto.
  // Entonces un preview de rama se indexaría, que es justo lo que D13 evita.
  vistos.entornosRobots++;
  const preview = conEntorno("preview", () => robots());
  const suyas = Array.isArray(preview.rules) ? preview.rules : [preview.rules];
  if (!suyas.some((r) => r.disallow === "/")) {
    fallo(
      "robots.txt",
      "fuera de producción NO bloquea el rastreo, y D13 dice que solo producción " +
        "es indexable: un deployment de rama se colaría en el índice.",
    );
  }
}

/**
 * LAS TRES CONTENT SIGNALS, POR SU VALOR DECIDIDO (P67.8) y no leyendo el que
 * haya puesto `robots()`, que sería una tautología: un guardián que compara una
 * cosa consigo misma aprueba siempre. Aquí están escritas las tres decisiones,
 * con el porqué de cada una, y esta lista es lo que las defiende.
 *
 * `ai-train=no` ES LA QUE HAY QUE VIGILAR DE VERDAD, porque es la única que
 * alguien podría cambiar por parecer más abierto. El `LICENSE` del repositorio
 * nombra los textos del sitio y `content/` entre lo que NO se licencia para obras
 * derivadas; un `yes` aquí convertiría eso en una contradicción publicada, y la
 * contradicción viviría en un archivo que nadie abre.
 *
 * Las otras dos van a `yes` porque el trabajo del sitio es que lo encuentren, y
 * ponerlas a `no` cerraría el canal que este sprint existe para abrir. Se
 * vigilan igual: una señal que desaparece no da error en ninguna parte.
 */
const SENALES: Record<string, string> = {
  "ai-train": "no",
  search: "yes",
  "ai-input": "yes",
};

function revisarSenales(reglas: { other?: unknown }[]): void {
  const crudo = reglas
    .map(
      (r) =>
        (r.other as Record<string, unknown> | undefined)?.["Content-Signal"],
    )
    .find((v) => typeof v === "string") as string | undefined;

  if (!crudo) {
    fallo(
      "Content-Signal",
      "en producción `robots.txt` no declara ninguna, y las tres están decididas " +
        "(P67.8). Sin la línea, lo que se puede hacer con este contenido vuelve a " +
        "quedar permitido por omisión y no por decisión.",
    );
    return;
  }

  // Se parte y se compara PAR A PAR, no con la cadena entera: así el orden y los
  // espacios pueden cambiar sin dar un rojo falso, y cambiar un VALOR sí lo da.
  const declaradas = new Map(
    crudo.split(",").map((par) => {
      const [k, v] = par.split("=");
      return [k?.trim() ?? "", v?.trim() ?? ""];
    }),
  );

  for (const [senal, valor] of Object.entries(SENALES)) {
    vistos.senalesDeContenido++;
    const dice = declaradas.get(senal);
    if (dice === valor) continue;
    fallo(
      "Content-Signal",
      dice === undefined
        ? `falta \`${senal}\`, que está decidida en \`${valor}\` (P67.8).`
        : `\`${senal}\` dice «${dice}» y la decisión es «${valor}» (P67.8). ` +
            (senal === "ai-train"
              ? "Y esta en concreto no es una preferencia suelta: el `LICENSE` dice que " +
                "los textos del sitio no se licencian para obras derivadas, así que un " +
                "`yes` aquí sería una contradicción publicada."
              : "El trabajo de este sitio es que lo encuentren; un `no` aquí cierra el canal."),
    );
  }
}
