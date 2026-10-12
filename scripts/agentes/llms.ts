import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import esLlms from "../../app/[lang]/dictionaries/es/llms.json";
import { locales, defaultLocale } from "../../lib/i18n/config";
import { PAGE_SLUGS } from "../../lib/routes";

import { fallo, vistos } from "./informe";
import { LLMS_TXT, MD_RAIZ, rutaMd, urlDe } from "./sitio";

/* -------------------------------------------------------------------------- */
/* 1. `llms.txt` — el índice que un agente lee antes de decidir                 */
/* -------------------------------------------------------------------------- */

export function revisarLlmsTxt(): string | null {
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

export function revisarCanalMarkdown(llms: string | null): void {
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
