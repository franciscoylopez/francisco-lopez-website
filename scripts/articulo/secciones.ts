/**
 * Comprobación 3 de `check:articulo` — toda sección del artículo declara
 * dependencias.
 *
 * El diccionario y `content/articulo/dependencias.ts` tienen que listar las
 * mismas. Una sección nueva sin declarar nace fuera del guardián, en silencio —
 * que es justo el modo de fallo que esto viene a cerrar.
 */
import { SECCIONES } from "../../content/articulo/dependencias";
import { esArticulo } from "./diccionarios";

export function revisaSecciones(): string[] {
  const problemas: string[] = [];

  const enDiccionario = [
    ...esArticulo.sections.map((s) => s.id),
    esArticulo.closing.id,
  ];
  const declaradas = [...SECCIONES] as string[];

  for (const id of enDiccionario)
    if (!declaradas.includes(id))
      problemas.push(
        `la sección «${id}» existe en el artículo y no declara dependencias en ` +
          `content/articulo/dependencias.ts. Una sección sin declarar nace fuera del guardián.`,
      );

  for (const id of declaradas)
    if (!enDiccionario.includes(id))
      problemas.push(
        `se declaran dependencias de «${id}», que ya no es una sección del artículo.`,
      );

  return problemas;
}
