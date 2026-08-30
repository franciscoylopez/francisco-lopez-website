/**
 * El markdown de las 28 variantes, sacado del prerender — `npm run md`.
 *
 * QUÉ HACE. Lee el `<main>` del HTML que el build acaba de emitir, lo convierte
 * con `convertir.ts` y lo escribe en `public/md/`. Con `--verificar` no escribe:
 * compara y falla nombrando la variante que ha quedado atrás, que es lo que lo
 * convierte en guardián de artefacto derivado (familia D60).
 *
 * POR QUÉ DEL HTML Y NO DEL DICCIONARIO (la decisión, en la ficha de P67.2 y en
 * D157). Tres razones que ya son reglas de este repo: **D38** sacó del diccionario
 * todo valor publicado, así que un compositor de diccionario sería estructuralmente
 * incapaz de contener las cifras que varias páginas existen para publicar; un
 * compositor propio sería un **segundo renderizador** de lo mismo, divergiendo en
 * silencio; y **D75** ya decidió que la verdad de una página es el HTML que emite,
 * que es sobre lo que corre `check:marco`. Desde el HTML no puede divergir por
 * construcción: si la página cambia, su markdown cambia.
 *
 * POR QUÉ ARTEFACTO COMMITEADO Y NO RUTA DINÁMICA. Es la condición de la ficha:
 * **las 28 variantes siguen prerenderizándose**. Negociar `Accept` dentro de una
 * página la haría dinámica y ese precio no se paga (D48). Así que el markdown se
 * genera como los otros artefactos derivados de este repo —el CV, el kit del logo,
 * el SVG del artefacto— y se sirve como archivo estático. La contrapartida está
 * medida y aceptada: un artefacto commiteado se queda viejo, y por eso nace con
 * `--verificar` el mismo día, no cuatro días después como `check:kit`.
 *
 * POR QUÉ `SITE_DOMAIN` Y NO `SITE_URL`. `SITE_URL` resuelve el host del entorno
 * donde corre, y esto corre en la máquina de Francisco: derivarlo de ahí dejaría
 * `http://localhost:3000` dentro de un archivo que se publica. Mismo motivo por el
 * que el CV en PDF usa `SITE_DOMAIN` (`lib/site.ts`).
 */
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";

import { JSDOM } from "jsdom";

import { locales, pagePath, type Locale } from "../../lib/i18n/config";
import { PAGE_MODIFIED } from "../../lib/page-modified";
import { PAGE_SLUGS, type PageSlug } from "../../lib/routes";
import { SITE_DOMAIN } from "../../lib/site";

import { convertir, ElementoDesconocido, type Omitido } from "./convertir";

const RAIZ_BUILD = join(".next", "server", "app");
const RAIZ_MD = join("public", "md");
const BASE = `https://${SITE_DOMAIN}`;

const verificar = process.argv.includes("--verificar");

const VARIANTES = locales.flatMap((lang) =>
  PAGE_SLUGS.map((slug) => ({ lang, slug })),
);

/**
 * Dónde vive cada variante, a los dos lados. El prerender deja la home en
 * `es.html` y no en `es/index.html`, y el markdown copia esa forma a propósito:
 * dos árboles con la misma silueta se comparan de un vistazo.
 */
const rutaHtml = (lang: Locale, slug: PageSlug) =>
  join(RAIZ_BUILD, `${lang}${slug ? `/${slug}` : ""}.html`);
/** Todo `.md` que hay bajo una raíz, con la misma forma que devuelve `rutaMd`. */
function mdEnDisco(raiz: string): string[] {
  const out: string[] = [];
  const baja = (dir: string) => {
    if (!existsSync(dir)) return;
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) baja(p);
      else if (e.name.endsWith(".md")) out.push(p);
    }
  };
  baja(raiz);
  return out;
}

const rutaMd = (lang: Locale, slug: PageSlug) =>
  join(RAIZ_MD, `${lang}${slug ? `/${slug}` : ""}.md`);

/** La URL pública de la variante, que es lo que el markdown declara. */
const urlDe = (lang: Locale, slug: PageSlug) => BASE + pagePath(lang, slug);

let variantesLeidas = 0;
let visitados = 0;
let desactualizadas = 0;
const fallos: string[] = [];
const omitidos = new Map<string, number>();

function anota(lista: Omitido[]) {
  for (const o of lista) {
    const clave = `${o.familia}:${o.etiqueta}`;
    omitidos.set(clave, (omitidos.get(clave) ?? 0) + 1);
  }
}

/**
 * UN ESCALAR YAML QUE NO MIENTE. Las descripciones de este sitio llevan dos
 * puntos seguidos de espacio —«Del discovery al dato: investigo…»— y eso en YAML
 * plano parte la línea en clave y valor: el frontmatter dejaría de parsear, o
 * peor, parsearía a otra cosa. Se cita cuando hace falta y solo entonces, para
 * que el archivo se siga leyendo bien con los ojos.
 *
 * La lista de indicadores es la del estándar; se cubre además el valor vacío y el
 * que empieza o acaba en espacio, que YAML recorta sin avisar.
 */
function escalar(valor: string): string {
  const arriesgado =
    valor === "" ||
    /^[-?:,[\]{}#&*!|>'"%@`]/.test(valor) ||
    /: |\s#/.test(valor) ||
    valor.trim() !== valor;
  if (!arriesgado) return valor;
  return `"${valor.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

/**
 * La cabecera del archivo. Cinco campos y ninguno decorativo, que hasta el
 * 2026-08-31 eran tres *(P68.746)*. Los dos que faltaban son los que deciden si
 * esto sirve para algo cuando el `.md` ya no está en el sitio del que salió:
 *
 * - **`description`**: lo que hace que un agente sepa si esta fuente entra en la
 *   conversación **antes** de descargarla entera. Es el mismo trabajo que hace el
 *   «cuándo usar» de `llms.txt` a nivel de sitio, aquí a nivel de página.
 * - **`last-updated`**: la única señal de frescura que puede tener un agente que
 *   cachee el archivo. Sin ella, un `.md` de hace seis meses y el de hoy son
 *   indistinguibles.
 *
 * Y NINGUNO DE LOS DOS SE ESCRIBE AQUÍ, que es la parte que importa. La
 * descripción sale del `<meta name="description">` de la página —el mismo texto
 * que va a la tarjeta OG y al `<head>`, no una tercera versión del copy—, y la
 * fecha, de `lib/page-modified.ts`, que es de donde salen también las del
 * sitemap. Dos verdades sobre lo mismo son la familia D60 y aquí no hay ninguna.
 *
 * `url` PASA A LLAMARSE `canonical`, y es un renombrado, no un campo nuevo: ya
 * llevaba la URL absoluta y canónica, y lo único que fallaba era el nombre por el
 * que un lector la busca. Se puede renombrar porque el campo tiene un día de vida
 * (D158, 2026-08-30) y ningún consumidor dentro del repo.
 */
function cabecera({
  titulo,
  descripcion,
  canonical,
  lang,
  modificado,
}: {
  titulo: string;
  descripcion: string;
  canonical: string;
  lang: Locale;
  modificado: string;
}): string {
  const campos: [string, string][] = [
    ["canonical", canonical],
    ["lang", lang],
    ["title", titulo],
    ["description", descripcion],
    ["last-updated", modificado],
  ];
  return `---\n${campos.map(([k, v]) => `${k}: ${escalar(v)}`).join("\n")}\n---\n\n`;
}

function procesar(lang: Locale, slug: PageSlug) {
  const variante = `${lang}${slug ? `/${slug}` : ""}`;
  const archivo = rutaHtml(lang, slug);
  if (!existsSync(archivo)) {
    fallos.push(
      `${variante} — no hay HTML prerenderizado en \`${archivo}\`. O la página dejó ` +
        "de ser estática, que es justo lo que esta tarea no puede permitir, o Next " +
        "cambió dónde deja el prerender.",
    );
    return;
  }

  const dom = new JSDOM(readFileSync(archivo, "utf8"));
  const { document } = dom.window;
  try {
    const main = document.querySelector("main");
    if (!main) {
      fallos.push(
        `${variante} — sin \`<main>\`. Es el ancla de esta conversión y \`check:marco\` ` +
          "la vigila: si ha desaparecido, el gate de marco tiene que estar en rojo también.",
      );
      return;
    }
    variantesLeidas++;

    const { markdown, visitados: v, omitidos: o } = convertir(main, BASE);
    visitados += v;
    anota(o);

    const titulo = (document.querySelector("h1")?.textContent ?? "").trim();

    // LA DESCRIPCIÓN, DEL HTML COMO TODO LO DEMÁS. `pageMetadata` la deriva y la
    // pinta en el `<head>`, así que leerla aquí es el mismo trato que el cuerpo:
    // si la página cambia, su markdown cambia. Y SE EXIGE: una página sin
    // `description` es un fallo de `check:marco`, y un frontmatter con el campo
    // vacío sería justo lo que este repo llama un metro que aprueba de más.
    const descripcion = (
      document
        .querySelector('meta[name="description"]')
        ?.getAttribute("content") ?? ""
    ).trim();
    if (!descripcion) {
      fallos.push(
        `${variante} — sin \`<meta name="description">\`. La deriva \`pageMetadata\` (D45), ` +
          "así que si falta aquí también falta en el `<head>` y en la tarjeta OG.",
      );
      return;
    }

    const salida =
      cabecera({
        titulo,
        descripcion,
        canonical: urlDe(lang, slug),
        lang,
        modificado: PAGE_MODIFIED[slug],
      }) +
      markdown +
      "\n";
    const destino = rutaMd(lang, slug);

    if (verificar) {
      const actual = existsSync(destino) ? readFileSync(destino, "utf8") : null;
      if (actual !== salida) {
        desactualizadas++;
        fallos.push(
          `${variante} — \`${destino}\` ${actual === null ? "no existe" : "no coincide con la página"}.`,
        );
      }
      return;
    }

    mkdirSync(dirname(destino), { recursive: true });
    writeFileSync(destino, salida, "utf8");
  } catch (e) {
    if (e instanceof ElementoDesconocido) {
      fallos.push(`${variante} — ${e.message}`);
      return;
    }
    throw e;
  } finally {
    dom.window.close();
  }
}

function main() {
  if (!existsSync(RAIZ_BUILD)) {
    console.error(
      `\nmd — no hay build en \`${RAIZ_BUILD}\`.\n\n` +
        "Esto sale del HTML que el sitio EMITE, no del código que lo genera:\n\n  npm run build\n",
    );
    process.exit(2);
  }

  console.log("");
  for (const { lang, slug } of VARIANTES) procesar(lang, slug);

  // Y EN EL OTRO SENTIDO: los .md que sobran *(P68.8, hallazgo del code-review)*.
  // Hasta aquí esto solo comprobaba que cada variante ESPERADA existiera y
  // cuadrara, así que un slug retirado o renombrado dejaba su archivo commiteado
  // para siempre, con CI en verde. Y no es cosmético: el proxy sigue reescribiendo
  // `Accept: text/markdown` sobre la ruta vieja, así que `/vieja` daría 404 como
  // HTML y 200 en markdown con el contenido retirado. Es la misma doctrina de
  // `check:kit`, que cuadra su registro en los dos sentidos.
  const esperados = new Set(
    VARIANTES.map(({ lang, slug }) => rutaMd(lang, slug)),
  );
  const enDisco = mdEnDisco(RAIZ_MD);
  for (const archivo of enDisco) {
    if (esperados.has(archivo)) continue;
    fallos.push(
      `\`${archivo}\` sobra: no le corresponde ninguna variante del registro. ` +
        "Un .md huérfano se sigue sirviendo por negociación de `Accept`.",
    );
  }

  // Guarda de cero: una corrida que no ha mirado nada se lee igual que un
  // aprobado, y en este repo eso ya ha pasado seis veces.
  if (variantesLeidas === 0 || visitados === 0) {
    console.error(
      `\nmd — NO HA CONVERTIDO NADA (${variantesLeidas} variantes, ${visitados} elementos).\n` +
        "Con cero entradas esto pasaría siempre, así que falla a propósito.\n",
    );
    process.exit(2);
  }

  const etiqueta = verificar ? "md --verificar" : "md";
  console.log(
    `${etiqueta} — ${variantesLeidas} de ${VARIANTES.length} variantes · ` +
      `${visitados} elementos convertidos · ` +
      `${enDisco.length} archivos en disco, ninguno de más`,
  );

  // MEDIDO Y NO CONVERTIDO, con su cifra: un alcance recortado en silencio se lee
  // como cobertura (misma doctrina que `check:marcas`).
  if (omitidos.size > 0) {
    const porFamilia = new Map<string, number>();
    for (const [clave, n] of omitidos) {
      const familia = clave.split(":")[0]!;
      porFamilia.set(familia, (porFamilia.get(familia) ?? 0) + n);
    }
    console.log(
      "  · fuera del markdown: " +
        [...porFamilia]
          .sort()
          .map(([f, n]) => `${n} ${f}`)
          .join(" · ") +
        " (ilustraciones, controles y lo marcado `aria-hidden`; su etiqueta de texto sí entra)",
    );
  }

  if (fallos.length > 0) {
    console.error(
      `\n${etiqueta} ✗ — ${fallos.length} variante(s) con problema:\n`,
    );
    for (const f of fallos) console.error(`  ✗ ${f}`);
    if (desactualizadas > 0) {
      console.error(
        `\nEl markdown de \`public/md/\` es un ARTEFACTO DERIVADO y se ha quedado atrás.\n` +
          "Se regenera y se commitea con el cambio que lo movió:\n\n  npm run build && npm run md\n",
      );
    }
    process.exit(1);
  }

  console.log(
    verificar
      ? "✓ El markdown de las 28 variantes coincide con la página que sirve el sitio."
      : `✓ Escritas ${variantesLeidas} variantes en \`${RAIZ_MD}/\`.`,
  );
}

main();
