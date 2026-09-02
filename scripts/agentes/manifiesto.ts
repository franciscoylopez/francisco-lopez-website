import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { locales, defaultLocale } from "../../lib/i18n/config";
import { PAGE_SLUGS } from "../../lib/routes";
import { fallo, vistos } from "./informe";

/* -------------------------------------------------------------------------- */
/* 6. `Vary: Accept` — dónde se declara, sobre el manifiesto compilado          */
/* -------------------------------------------------------------------------- */

/**
 * DÓNDE SE NEGOCIA, Y DÓNDE NO *(P68.742, 2026-08-31)*. Hasta este sprint las
 * cabeceras de seguridad y `Vary: Accept` iban en la MISMA regla de
 * `next.config.ts`, `/:path*`, así que la segunda caía también sobre las tarjetas
 * OG, los dos PDF del CV y las fuentes. Una caché compartida keyea por el `Vary`,
 * y el `Accept` de un asset varía por familia de navegador: cada archivo
 * inmutable pasaba a tener una copia guardada por familia en vez de una.
 *
 * SE MIRA EL MANIFIESTO Y NO `next.config.ts`, que es la regla 1 de `BRAND.md`
 * §Cómo se escribe una regla: la condición se comprueba donde la cosa ocurre.
 * `routes-manifest.json` trae la **regex ya compilada** de cada regla —la misma
 * que usa el servidor para decidir qué cabeceras pone—, así que aquí se prueban
 * rutas de ejemplo contra ella. Leer el `source` como texto habría sido opinar
 * sobre una cadena; esto es ejecutar el metro de verdad.
 *
 * Y SE COMPRUEBAN LAS DOS MITADES, porque la salida fácil el día que esto diera
 * rojo sería quitar la cabecera de en medio: las de seguridad tienen que seguir
 * llegando a TODAS las rutas de la muestra, assets incluidos.
 */
const MANIFIESTO = join(".next", "routes-manifest.json");

/** Las cabeceras de seguridad que `next.config.ts` sirve en todas las respuestas. */
const SEGURIDAD = [
  "X-Content-Type-Options",
  "X-Frame-Options",
  "Referrer-Policy",
  "Permissions-Policy",
  "Strict-Transport-Security",
];

/**
 * La muestra, con su veredicto escrito al lado. Arriba, lo que de verdad puede
 * devolver dos cuerpos según el `Accept` —las tres formas de ruta del proxy, más
 * una que no existe, que también se negocia (el 404 en markdown de D161)—. Abajo,
 * lo que no: un asset por familia, el markdown por su URL directa (esa siempre
 * devuelve markdown, no negocia nada) y los tres route handlers.
 */
const MUESTRA: { ruta: string; negocia: boolean }[] = [
  { ruta: "/", negocia: true },
  { ruta: "/sobre-mi", negocia: true },
  { ruta: "/trayectoria/emendu", negocia: true },
  { ruta: "/en", negocia: true },
  { ruta: "/en/sobre-mi", negocia: true },
  { ruta: "/no-existe-esta-ruta", negocia: true },
  { ruta: "/og/og-home-600x630.jpg", negocia: false },
  { ruta: "/cv/francisco-lopez-cv-es.pdf", negocia: false },
  { ruta: "/_next/static/media/una-fuente.woff2", negocia: false },
  { ruta: "/md/es.md", negocia: false },
  { ruta: "/robots.txt", negocia: false },
  { ruta: "/llms.txt", negocia: false },
  { ruta: "/sitemap.xml", negocia: false },
  { ruta: "/.well-known/ard.json", negocia: false },
  { ruta: "/.well-known/ai-catalog.json", negocia: false },
];

type ReglaDeCabecera = {
  regex: string;
  headers: { key: string; value: string }[];
};

export function revisarCabeceras(): void {
  if (!existsSync(MANIFIESTO)) {
    fallo(
      "cabeceras",
      `no hay \`${MANIFIESTO}\`. Es el artefacto donde el build deja las reglas de ` +
        "`headers()` ya compiladas; sin él esto no puede comprobar nada.",
    );
    return;
  }

  const reglas = (
    JSON.parse(readFileSync(MANIFIESTO, "utf8")) as {
      headers?: ReglaDeCabecera[];
    }
  ).headers;

  // La forma del manifiesto la escribe Next, no nosotros: si un día cambia, esto
  // tiene que decirlo en vez de seguir aprobando sobre una lista vacía.
  if (!Array.isArray(reglas) || reglas.length === 0) {
    fallo(
      "cabeceras",
      `\`${MANIFIESTO}\` no trae reglas de cabecera. O \`headers()\` dejó de emitirlas ` +
        "—y entonces el sitio va sin cabeceras de seguridad— o Next cambió el formato.",
    );
    return;
  }

  for (const { ruta, negocia } of MUESTRA) {
    vistos.rutasDeCabecera++;
    const claves = reglas
      .filter((r) => new RegExp(r.regex).test(ruta))
      .flatMap((r) => r.headers.map((h) => h.key));

    const tieneVary = claves.some((k) => k.toLowerCase() === "vary");
    if (negocia && !tieneVary) {
      fallo(
        "cabeceras",
        `\`${ruta}\` puede devolver HTML o markdown según el \`Accept\` y ninguna regla le ` +
          "pone `Vary: Accept`. Sin él, una caché compartida le sirve a una persona lo que " +
          "pidió un agente.",
      );
    }
    if (!negocia && tieneVary) {
      fallo(
        "cabeceras",
        `\`${ruta}\` lleva \`Vary: Accept\` y no negocia nada. Una caché compartida keyea por ` +
          "el `Vary`, así que eso es una copia guardada por familia de navegador de un " +
          "archivo que siempre devuelve lo mismo (P68.742).",
      );
    }

    const faltan = SEGURIDAD.filter((k) => !claves.includes(k));
    if (faltan.length) {
      fallo(
        "cabeceras",
        `\`${ruta}\` se sirve sin ${faltan.join(", ")}. Acotar el \`Vary\` no puede llevarse ` +
          "por delante las de seguridad, que van en todas las respuestas.",
      );
    }
  }
}

/* -------------------------------------------------------------------------- */
/* 7. Las rutas que un agente ADIVINA, sobre el mismo manifiesto                */
/* -------------------------------------------------------------------------- */

/**
 * LOS ALIAS, QUE HASTA HOY NO LOS MIRABA NADIE *(P68.748, 2026-08-31)*. D161
 * añadió diez redirecciones porque un agente que quiere verificar quién hay
 * detrás de un sitio prueba `/about`, `/privacy` y `/contact` antes de leer el
 * sitemap, y aquí los slugs son españoles en los dos idiomas. Se comprobaron a
 * mano el día que se escribieron y se quedaron sin guardián — que es el modo de
 * fallo del que avisa `BRAND.md` §Cómo se escribe una regla, punto 2.
 *
 * ESTA TABLA ES LA DECISIÓN, NO UNA COPIA DE `next.config.ts`. Comparar la
 * configuración consigo misma aprobaría siempre; lo que se defiende aquí es que
 * estas rutas concretas —las que un escáner prueba de verdad— sigan resolviendo,
 * y que su destino sea una página que existe. Si alguien retira un alias, esto lo
 * dice.
 *
 * `permanent: false` (307) TAMBIÉN SE VIGILA. Un 308 se cachea para siempre en el
 * navegador, y estos alias son una comodidad reversible: el día que `/about`
 * fuera una página de verdad, un 308 cacheado la haría inalcanzable para quien ya
 * hubiera pasado por aquí.
 */
const ADIVINADAS: [string, string][] = [
  ["/about", "/sobre-mi"],
  ["/about-me", "/sobre-mi"],
  ["/privacy", "/cookies"],
  ["/privacidad", "/cookies"],
  ["/contact", "/contacto"],
  ["/en/about", "/en/sobre-mi"],
  ["/en/about-me", "/en/sobre-mi"],
  ["/en/privacy", "/en/cookies"],
  ["/en/privacidad", "/en/cookies"],
  ["/en/contact", "/en/contacto"],
  // La ruta de descubrimiento para agentes. Apunta a `/llms.txt`, que no es una
  // página del registro: es el índice que ya contesta lo que la ruta pregunta.
  ["/agents.md", "/llms.txt"],
];

type Alias = {
  regex: string;
  destination: string;
  statusCode?: number;
  internal?: boolean;
};

export function revisarAlias(): void {
  if (!existsSync(MANIFIESTO)) return; // ya lo ha dicho `revisarCabeceras`

  const redirecciones = (
    JSON.parse(readFileSync(MANIFIESTO, "utf8")) as { redirects?: Alias[] }
  ).redirects?.filter((r) => !r.internal);

  if (!Array.isArray(redirecciones) || redirecciones.length === 0) {
    fallo(
      "alias",
      `\`${MANIFIESTO}\` no trae ninguna redirección propia. Las diez de D161 y la de ` +
        "P68.748 son lo que impide que un agente vea 404 en las rutas que adivina.",
    );
    return;
  }

  const destinosValidos = destinosQueExisten();
  for (const [desde, hacia] of ADIVINADAS) {
    vistos.alias++;
    revisarUnAlias(desde, hacia, redirecciones, destinosValidos);
  }
}

/**
 * El destino de un alias tiene que ser algo que exista: una página del registro o
 * el índice para agentes. Un alias que apunte a un 404 es peor que no tenerlo.
 */
function destinosQueExisten(): Set<string> {
  return new Set<string>([
    "/llms.txt",
    ...locales.flatMap((lang) =>
      PAGE_SLUGS.map((slug) => {
        const path = slug ? `/${slug}` : "";
        return lang === defaultLocale ? path || "/" : `/${lang}${path}`;
      }),
    ),
  ]);
}

/** Las cuatro cosas que tienen que cuadrar en UNA ruta adivinada. */
function revisarUnAlias(
  desde: string,
  hacia: string,
  redirecciones: Alias[],
  destinosValidos: Set<string>,
): void {
  const regla = redirecciones.find((r) => new RegExp(r.regex).test(desde));
  if (!regla) {
    fallo(
      "alias",
      `\`${desde}\` no redirige a ninguna parte, así que devuelve 404. Es una de las rutas ` +
        "que un escáner de agentes prueba antes de leer el sitemap.",
    );
    return;
  }
  if (regla.destination !== hacia) {
    fallo(
      "alias",
      `\`${desde}\` redirige a \`${regla.destination}\` y la decisión es \`${hacia}\`.`,
    );
  }
  if (regla.statusCode !== 307) {
    fallo(
      "alias",
      `\`${desde}\` redirige con ${regla.statusCode} y tenía que ser 307. Un 308 se cachea ` +
        "para siempre en el navegador, y estos alias son una comodidad reversible (D161).",
    );
  }
  if (!destinosValidos.has(regla.destination)) {
    fallo(
      "alias",
      `\`${desde}\` apunta a \`${regla.destination}\`, que no es ninguna página del registro ` +
        "ni `/llms.txt`. Un alias que lleva a un 404 es peor que no tenerlo.",
    );
  }
}
