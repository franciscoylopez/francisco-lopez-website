/**
 * ¿Sigue en pie lo que este sitio le promete a un agente? — `npm run check:agentes`.
 *
 * POR QUÉ EXISTE, Y POR QUÉ NO ES UN ESCÁNER DE TERCEROS. La pregunta que lo
 * abrió fue si había un plugin o una skill para meter en la rutina los dos
 * escáneres de agentes que se pasaron al abrir el sprint. La respuesta honesta es
 * que no debe haberlo, por dos razones que este repo ya tenía medidas:
 *
 *   1. **Su nota mezcla lo que aplica con lo que no.** Un 20/100 donde doce de
 *      los checks son de superficies que el sitio no tiene no es una señal: es
 *      ruido con forma de nota, y perseguirla lleva a publicar un `api-catalog`
 *      sin API.
 *   2. **Un metro que no controlamos cambia sin avisar.** Sus checks son
 *      estándares emergentes en borrador; el día que uno se mueva, el gate se
 *      pone rojo o verde por algo que no hemos decidido.
 *
 * Así que un escáner es DESCUBRIMIENTO —se pasa cuando se quiere mirar— y la
 * rutina es esto: un guardián que vigila **las invariantes que este sprint
 * decidió adoptar, y solo esas**. Es el criterio de D51: si se dispara en un
 * evento y no requiere criterio, es un script en CI.
 *
 * QUÉ MIRA, Y DÓNDE MIRA CADA COSA. La regla 1 de `BRAND.md` §Cómo se escribe una
 * regla —la condición se comprueba donde la cosa ocurre— aquí obliga a tres
 * fuentes distintas, y mezclarlas habría sido el fallo:
 *
 *   · `llms.txt`  → el ARTEFACTO del build, no el código que lo genera.
 *   · la negociación de markdown → EJECUTANDO `proxy()`, porque una cabecera no
 *     está en el prerender: el HTML no sabe con qué `Vary` se sirvió.
 *   · `robots.txt` → EJECUTANDO `robots()` con los dos entornos, porque el
 *     artefacto que se construye en CI es el de NO producción (D13) y leerlo
 *     daría por bueno un `Disallow: /` que en producción sería catastrófico.
 *
 * LO QUE NO MIRA, dicho para que no se dé por cubierto:
 *
 * - **La nota de ningún escáner.** Es lo primero que deja fuera, a propósito.
 * - **El estado HTTP de verdad.** Una ruta inexistente 404 se comprueba por su
 *   ESTRUCTURA —que no haya catch-all que conteste 200 a cualquier cosa— y no
 *   haciendo la petición: eso necesita servidor, y este gate corre en CI sin uno.
 *   Es un proxy honesto del modo de fallo real, no la medición.
 * - **Que el markdown sea FIEL a la página.** Eso es `md:verificar` (D158). Aquí
 *   se mira que el canal exista y que la promesa de `llms.txt` resuelva.
 * - **Que el copy sea bueno.** `llms.txt` puede decir tonterías y pasar esto.
 *
 * Y AFIRMA CUÁNTO HA MIRADO —rutas, variantes, señales y casos de negociación—,
 * porque un metro que devuelve lista vacía parece un aprobado y este repo se lo
 * ha encontrado seis veces (D70).
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { NextRequest } from "next/server";

import robots from "../app/robots";
import esLlms from "../app/[lang]/dictionaries/es/llms.json";
import { locales, defaultLocale, type Locale } from "../lib/i18n/config";
import { PAGE_SLUGS, type PageSlug } from "../lib/routes";
import { cuerpo404 } from "../lib/md-404";
import { SITE_URL } from "../lib/site";
import { proxy } from "../proxy";

/** Dónde deja Next el cuerpo de una ruta estática de texto. Ver `check:marco`. */
const LLMS_TXT = join(".next", "server", "app", "llms.txt.body");

/** Dónde vive el markdown commiteado, con la silueta que escribe `npm run md`. */
const MD_RAIZ = join("public", "md");

const problemas: string[] = [];
const fallo = (donde: string, msg: string) =>
  problemas.push(`${donde}: ${msg}`);

/** Lo que se ha mirado de verdad, para el informe. Ninguno puede quedarse en 0. */
const vistos = {
  paginasEnLlms: 0,
  variantesMd: 0,
  negociaciones: 0,
  entornosRobots: 0,
  senalesDeContenido: 0,
  segmentosDinamicos: 0,
};

/* -------------------------------------------------------------------------- */
/* 1. `llms.txt` — el índice que un agente lee antes de decidir                 */
/* -------------------------------------------------------------------------- */

/**
 * La URL pública de una página, en un idioma. No se compone a mano en ningún
 * sitio de este archivo: sale de aquí, y es la misma forma que usa la ruta.
 */
function urlDe(lang: Locale, slug: PageSlug): string {
  const path = slug ? `/${slug}` : "";
  if (lang === defaultLocale) return `${SITE_URL}${path || "/"}`;
  return `${SITE_URL}/${lang}${path}`;
}

/**
 * La silueta del markdown de una variante, la misma que `rutaMarkdown` del proxy
 * y que `npm run md`: la home es `<locale>.md` y no `<locale>/index.md`.
 */
function rutaMd(lang: Locale, slug: PageSlug): string {
  return `/md/${lang}${slug ? `/${slug}` : ""}.md`;
}

function revisarLlmsTxt(): string | null {
  if (!existsSync(LLMS_TXT)) {
    fallo(
      "llms.txt",
      `no hay artefacto en \`${LLMS_TXT}\`. O la ruta dejó de ser estática —y entonces ` +
        "sale de este gate en silencio, que es lo que hay que mirar— o Next cambió dónde " +
        "deja el prerender.",
    );
    return null;
  }

  const texto = readFileSync(LLMS_TXT, "utf8");

  // LAS PÁGINAS, DERIVADAS DEL REGISTRO Y NO DE UNA LISTA (D72). Este archivo era
  // una de las copias a mano de «qué páginas tiene el sitio», y la que fallaba más
  // callada: una página que faltara aquí simplemente no existía para un modelo.
  // El `Record` de la ruta impide olvidarla al compilar; esto comprueba que
  // además LLEGÓ al texto, que es otra cosa.
  // Y SE BUSCA LA URL ANCLADA COMO DESTINO DE UN ENLACE —`](…)`— y no como
  // subcadena suelta *(P68.8, hallazgo del code-review)*. Con `includes` a pelo,
  // dos de las nueve comprobaciones aprobaban SIEMPRE: la home es
  // `${SITE_URL}/`, prefijo de todas las demás URLs del archivo, así que no podía
  // faltar nunca; y `${SITE_URL}/trayectoria` es prefijo de
  // `${SITE_URL}/trayectoria/emendu`, que sale en la lista de experiencias, así
  // que quitar el ÍNDICE de la lista de páginas habría pasado en verde. El caso
  // malo del arnés usa `cookies`, que no tiene ese solape, así que tampoco lo
  // destapaba: un metro que aprueba de más y un caso malo que no lo toca.
  for (const slug of PAGE_SLUGS) {
    vistos.paginasEnLlms++;
    const url = urlDe(defaultLocale, slug);
    if (!texto.includes(`](${url})`)) {
      fallo(
        "llms.txt",
        `no enlaza \`${url}\`, y esa página está en el registro. ` +
          "Un agente que lea este archivo no puede descubrirla.",
      );
    }
  }

  // LAS DOS SECCIONES QUE ESTE SPRINT AÑADIÓ, buscadas por su título del
  // diccionario y no por una cadena escrita aquí: si alguien reescribe el
  // encabezado, este guardián lo sigue en vez de dar un rojo falso.
  const secciones: [string, string][] = [
    [
      esLlms.cuandoUsar.titulo,
      "P67.4: cuándo traer esta fuente a la conversación",
    ],
    [
      esLlms.markdown.titulo,
      "P67.2: que cada página se sirve también en markdown",
    ],
  ];
  for (const [titulo, quien] of secciones) {
    if (!texto.includes(`## ${titulo}`)) {
      fallo("llms.txt", `le falta la sección «${titulo}» (${quien}).`);
    }
  }

  return texto;
}

/* -------------------------------------------------------------------------- */
/* 2. El canal markdown — que la promesa resuelva contra el disco               */
/* -------------------------------------------------------------------------- */

function revisarCanalMarkdown(llms: string | null): void {
  for (const lang of locales) {
    for (const slug of PAGE_SLUGS) {
      vistos.variantesMd++;
      const ruta = rutaMd(lang, slug);
      if (!existsSync(join(MD_RAIZ, ruta.slice("/md/".length)))) {
        fallo(
          "canal markdown",
          `\`${ruta}\` no existe en disco, y el sitio lo anuncia como vía estable. ` +
            "Se regenera con `npm run build && npm run md`.",
        );
      }
    }
  }

  if (!llms) return;

  // LA PROMESA CONCRETA, no la genérica. `llms.txt` publica una URL de EJEMPLO
  // dentro de su prosa, y esa prosa es copy: si alguien cambia el patrón al
  // editarla, el ejemplo deja de resolver y no hay tipo que lo vea. Se extraen
  // TODAS las URLs de markdown que el archivo contenga y se comprueban.
  const anunciadas = [
    ...llms.matchAll(/https?:\/\/[^\s)]*\/md\/[^\s)]+\.md/g),
  ].map((m) => m[0]!);
  if (anunciadas.length === 0) {
    fallo(
      "canal markdown",
      "`llms.txt` no publica ni una URL de markdown de ejemplo. La vía estable es " +
        "la URL directa, así que sin un ejemplo el agente solo tiene la negociación.",
    );
  }
  for (const url of anunciadas) {
    const ruta = url.slice(url.indexOf("/md/") + "/md/".length);
    if (!existsSync(join(MD_RAIZ, ruta))) {
      fallo(
        "canal markdown",
        `\`llms.txt\` anuncia \`${url}\` y ese archivo no está en \`${MD_RAIZ}\`.`,
      );
    }
  }
}

/* -------------------------------------------------------------------------- */
/* 3. La negociación — ejecutando el proxy, que es donde ocurre                 */
/* -------------------------------------------------------------------------- */

/** El `Accept` que manda un navegador de verdad. Termina en el comodín. */
const ACCEPT_NAVEGADOR =
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8";

function pide(path: string, accept: string) {
  return proxy(new NextRequest(`${SITE_URL}${path}`, { headers: { accept } }));
}

/** ¿A qué ruta interna reescribe? `null` si esta respuesta no es un rewrite. */
function destino(res: ReturnType<typeof proxy>): string | null {
  const url = res.headers.get("x-middleware-rewrite");
  return url ? new URL(url).pathname : null;
}

const varyTieneAccept = (res: ReturnType<typeof proxy>) =>
  (res.headers.get("Vary") ?? "")
    .split(",")
    .some((v) => v.trim().toLowerCase() === "accept");

function revisarNegociacion(): void {
  // UNA MUESTRA DE CADA FORMA DE RUTA, no las 28: lo que se prueba es la lógica
  // del proxy, y sus ramas son tres (raíz, interna en español, interna en
  // inglés). Recorrer las 28 no probaría una rama más.
  const casos: { path: string; lang: Locale; slug: PageSlug }[] = [
    { path: "/", lang: "es", slug: "" },
    { path: "/sobre-mi", lang: "es", slug: "sobre-mi" },
    { path: "/trayectoria/emendu", lang: "es", slug: "trayectoria/emendu" },
    { path: "/en", lang: "en", slug: "" },
    { path: "/en/sobre-mi", lang: "en", slug: "sobre-mi" },
  ];

  for (const { path, lang, slug } of casos) {
    vistos.negociaciones++;
    const esperada = rutaMd(lang, slug);

    // (a) Quien PIDE markdown se lo lleva.
    const conMd = pide(path, "text/markdown");
    if (destino(conMd) !== esperada) {
      fallo(
        "negociación",
        `\`${path}\` con \`Accept: text/markdown\` reescribe a \`${destino(conMd) ?? "nada"}\` ` +
          `y tenía que ir a \`${esperada}\`.`,
      );
    }

    // (b) Y UN NAVEGADOR NO. Es la mitad que se rompe sola: con un `includes` en
    // vez del token exacto, el comodín del final de este `Accept` le serviría
    // markdown a una persona. Está escrito en `proxy.ts` y aquí se comprueba.
    const conHtml = pide(path, ACCEPT_NAVEGADOR);
    if (destino(conHtml) === esperada) {
      fallo(
        "negociación",
        `\`${path}\` le sirve markdown a un NAVEGADOR. El \`Accept\` de un navegador ` +
          "lleva `*/*`, así que la comprobación tiene que ser por token exacto.",
      );
    }

    // (c) `Vary: Accept` EN LAS DOS, que es lo que impide que una caché
    // compartida le dé a una persona lo que pidió un agente.
    for (const [quien, res] of [
      ["markdown", conMd],
      ["navegador", conHtml],
    ] as const) {
      if (!varyTieneAccept(res)) {
        fallo(
          "negociación",
          `\`${path}\` responde al ${quien} sin \`Vary: Accept\` (dice «${res.headers.get("Vary") ?? "nada"}»). ` +
            "La misma URL devuelve dos cosas, así que sin eso una caché intermedia las mezcla.",
        );
      }
    }
  }

  // EL CANÓNICO NO SE NEGOCIA. `/es/...` redirige SIEMPRE, pida lo que pida:
  // servir markdown desde una URL no canónica publicaría un segundo sitio en el
  // idioma por defecto. Está razonado en `proxy.ts` y por eso se vigila.
  vistos.negociaciones++;
  const enEs = pide("/es/sobre-mi", "text/markdown");
  if (enEs.status !== 307 && enEs.status !== 308) {
    fallo(
      "negociación",
      `\`/es/sobre-mi\` con \`Accept: text/markdown\` responde ${enEs.status} en vez de redirigir. ` +
        "El canónico no depende de lo que se pida.",
    );
  }

  // LA RUTA QUE NO EXISTE TAMBIÉN SE NEGOCIA (2026-08-30). Antes reescribía a un
  // `.md` que tampoco existe, así que el agente recibía la 404 de marca en HTML:
  // el estado era correcto y el cuerpo no le servía para recuperarse. Se
  // comprueban las TRES cosas que lo hacen útil —404 de verdad, cuerpo markdown y
  // un destino al que ir—, en los dos idiomas, porque el 404 inglés que devolviera
  // el índice español sería el fallo silencioso de este cambio.
  for (const [path, locale] of [
    ["/no-existe-esta-ruta", "es"],
    ["/en/no-existe-esta-ruta", "en"],
  ] as const) {
    vistos.negociaciones++;
    const res = pide(path, "text/markdown");
    if (res.status !== 404) {
      fallo(
        "negociación",
        `\`${path}\` con \`Accept: text/markdown\` responde ${res.status} y tenía que ser 404.`,
      );
      continue;
    }
    const tipo = res.headers.get("Content-Type") ?? "";
    if (!tipo.startsWith("text/markdown")) {
      fallo(
        "negociación",
        `el 404 de \`${path}\` se sirve como \`${tipo || "nada"}\` a quien pidió markdown.`,
      );
    }
    if (!cuerpo404(locale, path).includes(`${SITE_URL}/llms.txt`)) {
      fallo(
        "negociación",
        `el 404 de \`${path}\` no apunta a \`/llms.txt\`. Un 404 sin salida deja al agente sin ` +
          "dónde seguir, que es la mitad de lo que se le pide a un 404.",
      );
    }
  }
}

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

function revisarRobots(): void {
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

/* -------------------------------------------------------------------------- */
/* 5. Que una ruta inexistente siga siendo un 404                              */
/* -------------------------------------------------------------------------- */

/**
 * POR ESTRUCTURA Y NO POR PETICIÓN, y conviene saber la diferencia. Lo que de
 * verdad convierte los 404 de un sitio en 200 es un segmento CATCH-ALL
 * (`[...algo]` o `[[...algo]]`) que acepte cualquier cosa y renderice: a partir
 * de ahí, cualquier URL inventada responde 200 con contenido vacío, y para un
 * agente eso es peor que un error, porque parece una página.
 *
 * Este sitio hoy tiene dos segmentos dinámicos y los dos están acotados —`[lang]`
 * a los locales y `[slug]` a las experiencias con página—, así que lo que se
 * vigila es que no aparezca un tercero sin acotar.
 *
 * Hacer la petición de verdad necesitaría servidor, y este gate corre en CI sin
 * uno; queda declarado arriba, en «lo que no mira».
 */
function revisarCatchAll(): void {
  const baja = (dir: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (!e.isDirectory() || e.name === "node_modules") continue;
      if (e.name.startsWith("[")) {
        vistos.segmentosDinamicos++;
        if (e.name.includes("...")) {
          fallo(
            "404",
            `\`app/\` tiene un segmento catch-all (\`${e.name}\`). Con uno, cualquier ` +
              "URL inventada responde 200 en vez de 404, y para un agente una página " +
              "vacía es peor que un error: parece contenido.",
          );
        }
      }
      baja(join(dir, e.name));
    }
  };
  baja("app");

  if (!existsSync(join("app", "global-error.tsx"))) {
    fallo(
      "404",
      "no hay `app/global-error.tsx`, y el sitio publica páginas de error de marca.",
    );
  }
}

/* -------------------------------------------------------------------------- */

const llms = revisarLlmsTxt();
revisarCanalMarkdown(llms);
revisarNegociacion();
revisarRobots();
revisarCatchAll();

console.log(
  `check:agentes — lo que este sitio le promete a un agente\n` +
    `  llms.txt   ${vistos.paginasEnLlms} páginas del registro nombradas · 2 secciones del sprint\n` +
    `  markdown   ${vistos.variantesMd} variantes en disco · las URLs que anuncia resuelven\n` +
    `  negociar   ${vistos.negociaciones} casos por \`proxy()\`: markdown sí, navegador no, \`Vary\` en ambos, 404 con salida\n` +
    `  robots     ${vistos.entornosRobots} entornos (producción abre y sella el sitemap; el resto cierra, D13)\n` +
    `  señales    ${vistos.senalesDeContenido} Content Signals comprobadas por su valor decidido (P67.8)\n` +
    `  404        ${vistos.segmentosDinamicos} segmentos dinámicos, ninguno catch-all`,
);

// El suelo del metro. Con cero entradas esto aprobaría siempre, que es el modo de
// fallo que el propio guardián existe para no tener.
const vacios = Object.entries(vistos).filter(([, n]) => n === 0);
if (vacios.length) {
  console.error(
    `\ncheck:agentes — NO HA MIRADO NADA en: ${vacios.map(([k]) => k).join(", ")}.\n` +
      "Con cero entradas ese trozo aprueba siempre, así que falla a propósito.",
  );
  process.exit(1);
}

if (problemas.length) {
  console.error(`\n✗ ${problemas.length} problema(s):\n`);
  for (const p of problemas) console.error(`  · ${p}\n`);
  process.exit(1);
}

console.log(
  "\n✓ El índice, el canal markdown, la negociación y las reglas de rastreo dicen lo que prometen.",
);
