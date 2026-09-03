/**
 * Comprobación 6 de `check:articulo` — el diagrama de CI dibuja los pasos que
 * hay, y los reparte igual en los dos idiomas.
 *
 * El pie de §s10 dice «los {pasosCI} pasos» y esa cifra sale de `ci.yml`; las
 * pastillas del diagrama son un dibujo con su propio agrupado editorial. Sin
 * esto, un paso nuevo movería el pie y dejaría el dibujo corto, en silencio.
 */
import { DIAGRAMA_CI, pasosDibujados } from "../../content/articulo/ci-steps";
import { pasosDeCI } from "../../lib/figures";

/** Los problemas, y cuántos pasos tiene el workflow (que es lo que se publica). */
export function revisaDiagramaCI(): { problemas: string[]; pasos: number } {
  const problemas: string[] = [];
  const pasosWorkflow = pasosDeCI();

  for (const locale of ["es", "en"] as const) {
    const dibujados = pasosDibujados(locale);
    if (dibujados !== pasosWorkflow)
      problemas.push(
        `el diagrama de CI dibuja ${dibujados} pasos en ${locale} y ` +
          `.github/workflows/ci.yml tiene ${pasosWorkflow}. Añade o quita el paso en ` +
          `content/articulo/ci-steps.ts, con su grupo y su categoría.`,
      );
  }

  // Y LAS DOS LISTAS TIENEN LA MISMA FORMA. Los pasos están escritos dos veces, una
  // por idioma, porque es el patrón de los siete diagramas de este artículo: la
  // etiqueta cambia y la estructura no. Lo que la duplicación permite es que la
  // ESTRUCTURA derive —que un paso sea `patron` en ES y `ausencia` en EN, o que
  // cambie de grupo—, y eso saldría en pantalla como dos leyendas distintas sin que
  // nada fallara. Comparar el recuento contra `ci.yml` no lo ve: los dos idiomas
  // pueden tener diecisiete pasos y repartirlos distinto.
  const forma = (locale: "es" | "en") =>
    DIAGRAMA_CI[locale].groups
      .map((g) => g.items.map((it) => it.cat).join(","))
      .join(" | ");
  if (forma("es") !== forma("en"))
    problemas.push(
      `el diagrama de CI reparte sus pasos distinto en cada idioma:\n` +
        `        es: ${forma("es")}\n        en: ${forma("en")}\n` +
        `      La etiqueta cambia con el idioma; el grupo y la categoría, no.`,
    );

  return { problemas, pasos: pasosWorkflow };
}
