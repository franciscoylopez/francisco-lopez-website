/**
 * EL PESO DE LA PORTADA, SELLADO EN VEZ DE TECLEADO *(P72.06)*.
 *
 * QUIÉN MIDE Y QUIÉN SELLA, que es la parte que hay que leer antes de mover nada.
 * La versión anterior de esto vivía dentro de `extraer.ts` con este argumento:
 * *«el artículo publica la comparación de tamaño entre la portada y su markdown, y
 * esos dos archivos los conoce este script; medirlo en otro sitio sería un segundo
 * módulo que sabe lo mismo»* — o sea la familia D60, dos verdades sobre una cosa
 * divergiendo en silencio. **Ese argumento sigue en pie y por eso este módulo no
 * mide nada**: recibe los dos tamaños ya contados por quien sí sabe dónde deja el
 * prerender su HTML y dónde se escribe el `.md`. Lo que hay aquí es la otra mitad
 * —decidir la banda, compararla con el registro y sellarla—, que es la misma forma
 * que `psi/sello.ts` y `artefacto/fingerprint.ts` *(P72.195, 2026-09-02)*.
 *
 * SE PUBLICA UNA BANDA, NO LOS DOS BYTES, y esa es la parte que decide el diseño.
 * La cifra tecleada («de 216 KB a 6,6 KB») envejeció en UN DÍA, y no por descuido:
 * el HTML de la portada crece con cada párrafo de copy y el markdown crece menos,
 * así que la divergencia es estructural. Un valor exacto derivado no mentiría,
 * pero cambiaría en casi todo PR y arrastraría con él el `.md` commiteado del
 * artículo, o sea compraría exactitud pagando con la fricción de P72.05. La banda
 * —el múltiplo de cinco por debajo del ratio— es cierta en las dos puntas del
 * rango que el sitio tiene hoy (31,6× en el build local, 32,0× en producción) y
 * solo se mueve cuando la afirmación deja de ser cierta.
 *
 * POR ESO EL SELLO SOLO SE REESCRIBE CUANDO LA BANDA SE MUEVE. Es la forma de
 * `content/psi/registro.json` y `content/agentes/registro.json`: una medición con
 * su fecha pegada. Los dos tamaños que van dentro son la EVIDENCIA de la última
 * vez que la banda cambió, no un valor que la página publique.
 *
 * Y LA PORTADA ES LA ES. El copy del sitio lo escribe el ES (D20) y es la variante
 * de la que habla el párrafo; la EN pesa otra cosa y publicar dos cifras para la
 * misma afirmación sería inventarse un matiz que el texto no hace.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const REGISTRO_PESO = join("content", "md", "registro.json");

type RegistroPeso = {
  fecha: string;
  html: number;
  markdown: number;
  veces: number;
};

/** El múltiplo de cinco por debajo del ratio: «más de treinta veces menos». */
const banda = (html: number, markdown: number) =>
  Math.floor(html / markdown / 5) * 5;

/** Lo que este módulo devuelve: una línea para el informe, o un fallo. */
type Veredicto = { linea?: string; fallo?: string };

/** Verificar no escribe: compara la banda de hoy con la sellada y punto. */
function verifica(
  previo: RegistroPeso | null,
  veces: number,
  ratio: string,
  html: number,
  markdown: number,
): Veredicto {
  if (!previo) {
    return {
      fallo: `no existe \`${REGISTRO_PESO}\`, del que el artículo saca la cifra que publica sobre su propio canal.`,
    };
  }
  if (previo.veces !== veces) {
    return {
      fallo:
        `el peso de la portada ha cambiado de banda: sellado «más de ${previo.veces} veces menos», ` +
        `hoy ${ratio}× (${html} B de HTML contra ${markdown} B de markdown), o sea «más de ${veces}». ` +
        "El artículo publica esa cifra, así que se regenera el sello con `npm run md`.",
    };
  }
  return {
    linea: `  · portada: ${ratio}× (${html} B / ${markdown} B) — dentro del sello «más de ${previo.veces}»`,
  };
}

/**
 * La banda de esta corrida contra la sellada. Los dos tamaños llegan medidos: aquí
 * no se abre ningún archivo del sitio, solo el registro.
 */
export function sellaPeso(
  html: number,
  markdown: number,
  verificar: boolean,
): Veredicto {
  // Guarda de cero, la de siempre: sin las dos medidas esto sellaría un `NaN` o
  // aprobaría sin haber mirado nada.
  if (html === 0 || markdown === 0) {
    return {
      fallo:
        "no se ha podido medir la portada ES (`es.html` / `public/md/es.md`), " +
        "así que el peso que publica el artículo no se ha comprobado.",
    };
  }

  const veces = banda(html, markdown);
  const ratio = (html / markdown).toFixed(1);
  const previo = existsSync(REGISTRO_PESO)
    ? (JSON.parse(readFileSync(REGISTRO_PESO, "utf8")) as RegistroPeso)
    : null;

  if (verificar) return verifica(previo, veces, ratio, html, markdown);

  if (previo && previo.veces === veces) {
    return {
      linea: `  · portada: ${ratio}× (${html} B / ${markdown} B) — el sello «más de ${veces}» sigue vigente, no se reescribe`,
    };
  }

  const registro: RegistroPeso = {
    fecha: new Date().toISOString().slice(0, 10),
    html,
    markdown,
    veces,
  };
  mkdirSync(dirname(REGISTRO_PESO), { recursive: true });
  writeFileSync(
    REGISTRO_PESO,
    JSON.stringify(registro, null, 2) + "\n",
    "utf8",
  );
  return {
    linea: `  · portada: ${ratio}× (${html} B / ${markdown} B) — sello ${previo ? `movido de «más de ${previo.veces}» a` : "nuevo en"} «más de ${veces}»`,
  };
}
