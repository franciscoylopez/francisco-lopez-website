/**
 * CÓMO SE ESCRIBE UNA CIFRA EN CADA IDIOMA — y nada más que eso.
 *
 * Vive aquí y no en `lib/design-values.ts` (P50.91). Aquel módulo tiene una razón
 * de ser escrita, D38: es la fuente única de los VALORES que el sitio publica
 * sobre sí mismo —tokens, breakpoints, el censo de pares, `PAGE_COUNT`,
 * `LAST_A11Y_REVIEW`—. La tabla de cardinales no es un valor del sitio: es
 * maquinaria de copy, y su vecino natural es `system-messages.ts`.
 *
 * EL DISPARADOR ERA «UN SEGUNDO `fill*`» Y SE PASÓ DE LARGO: hoy hay cuatro
 * —`fillPages` y `fillRatios` en `design-values.ts`, `fillFigures` en
 * `figures.ts`—. Pero la forma que aquel disparador predecía ya no encaja, y esa
 * es la parte que conviene dejar escrita para que nadie la «complete» luego:
 *
 * **Los cuatro `fill*` NO se vienen aquí.** Cada uno es una línea sobre SU dato
 * —el recuento de páginas, una fecha sellada, el censo de contraste, las figuras
 * medidas— y traérselos obligaría a que `lib/i18n/` importara de `design-values`
 * y de `figures`, o sea a invertir la dependencia para agrupar por parecido. Es la
 * regla 4 de `BRAND.md`: dos cosas que se parecen y significan distinto no se
 * unifican. Lo que sube es la capa de IDIOMA —cómo se dice un número y cómo se
 * escribe una fecha—; el dato se queda donde vive.
 */
import type { Locale } from "./config";

/**
 * El cardinal en palabras, porque el copy de este sitio escribe los recuentos
 * pequeños con letra («siete piezas», «ocho puntos», «dieciséis pasos») y un
 * numeral suelto rompería esa voz. Cubre hasta veinte: si un recuento pasa de ahí,
 * quien llame cae al numeral en vez de inventarse una palabra.
 */
const CARDINALES: Record<Locale, readonly string[]> = {
  es: [
    "cero",
    "una",
    "dos",
    "tres",
    "cuatro",
    "cinco",
    "seis",
    "siete",
    "ocho",
    "nueve",
    "diez",
    "once",
    "doce",
    "trece",
    "catorce",
    "quince",
    "dieciséis",
    "diecisiete",
    "dieciocho",
    "diecinueve",
    "veinte",
  ],
  en: [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
    "twenty",
  ],
};

/**
 * El cardinal en palabras de un número, o el numeral si se sale de la tabla.
 * Exportado desde P68.495: el recuento de páginas dejó de ser el único que el
 * copy escribe con letra, y la tabla vive en un sitio para no tener dos.
 */
export function cardinal(n: number, locale: Locale): string {
  return CARDINALES[locale][n] ?? String(n);
}

/** La fecha larga en el idioma de la página. */
export function reviewDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "es" ? "es-ES" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${iso}T00:00:00Z`));
}
