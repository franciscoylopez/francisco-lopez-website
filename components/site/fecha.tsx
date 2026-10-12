import type { Locale } from "@/lib/i18n/config";
import { reviewDate } from "@/lib/i18n/palabras";

/** El hueco que el copy deja para la fecha, igual que `fillPages` con `{paginas}`. */
const HUECO = "{date}";

// La fecha de una línea de «última actualización», dentro de su frase y en
// `<time datetime>` (P67.6). Dos páginas la pintan —`/accesibilidad` con
// `LAST_A11Y_REVIEW` y `/cookies` con `LAST_COOKIES_UPDATE`— y las dos leen un
// ISO que ya existe: servirlo solo como «29 de agosto de 2026» era tirar la
// mitad legible por máquina de un dato que el sitio ya tenía en la buena.
//
// SUSTITUYE A `fillDate`, que hacía lo mismo devolviendo una cadena. Una cadena
// no puede llevar un elemento dentro, así que el hueco hay que partirlo aquí:
// esta pieza es `fillDate` con el corte hecho. Aquel se retiró al quedarse sin
// llamadas — una función sin caso no es una función.
//
// EL ARTÍCULO NO ENTRA, y no es un olvido: `/como-se-ha-creado` tiene sus dos
// fechas en el JSON-LD (`datePublished`/`dateModified`) y NO las pinta, cosa que
// el propio `design-values.ts` deja escrita («El `ByLine` no pinta la fecha»).
// Sin texto en pantalla no hay nada que marcar; ponerlo sería añadir un dato a
// la página, que es una decisión de contenido y no de marcado.
export function FechaCopy({
  text,
  iso,
  lang,
}: {
  /** La frase del diccionario, con su `{date}`. */
  text: string;
  /** La fecha en ISO, del registro que la publica. */
  iso: string;
  lang: Locale;
}) {
  const partes = text.split(HUECO);
  if (partes.length !== 2) {
    throw new Error(
      `FechaCopy: «${text}» tiene ${partes.length - 1} huecos «${HUECO}» y tiene que tener uno. ` +
        "O el copy perdió el hueco al traducirlo, o esta frase no es una línea de fecha.",
    );
  }
  return (
    <>
      {partes[0]}
      <time dateTime={iso}>{reviewDate(iso, lang)}</time>
      {partes[1]}
    </>
  );
}
