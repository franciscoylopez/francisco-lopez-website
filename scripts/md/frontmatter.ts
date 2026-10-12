/**
 * El frontmatter de cada .md: cinco campos y el escalar YAML que los escribe.
 *
 * ESTÁ APARTE PORQUE ES LO QUE LEE UN AGENTE ANTES DEL CUERPO, y por tanto lo que
 * se discute cuando se decide qué tiene que saber de una página sin descargarla.
 * El recorrido —abrir el HTML, convertirlo, escribir el archivo— vive en
 * `extraer.ts` y no cambia cuando cambia esta lista *(P72.195, 2026-09-02)*.
 */

import { type Locale } from "../../lib/i18n/config";

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
export function cabecera({
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
