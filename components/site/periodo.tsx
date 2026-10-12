import { PERIOD_SEPARATOR, periodPartsOf } from "@/content/experience-copy";
import type { Locale } from "@/lib/i18n/config";

// El periodo de una experiencia, con sus dos extremos en `<time datetime>`
// (P67.6). Cuatro superficies lo pintaban como texto suelto —las dos filas de
// Trayectoria, las tarjetas del índice y los Datos del deep-dive— mientras la
// fecha en ISO ya existía o podía existir. `<time>` no es maquetación: es la
// misma información que ya se sirve, en la forma en que una máquina la entiende.
//
// VA EN `site/` Y NO EN `ui/` porque sabe algo de ESTE sitio: lee el registro de
// experiencias y su copy. Es la primera de las dos preguntas de D36; la segunda
// —¿se pulsa?— aquí ni se plantea.
//
// NO DEVUELVE CAJA, sino un fragmento. Las cuatro llamadas ya viven dentro de su
// párrafo o su `<dd>`, con sus clases de color y de cifras tabulares: envolverlo
// en un `<span>` propio habría metido un elemento que no pinta nada y habría
// obligado a decidir dónde va cada clase. El único elemento nuevo es el `<time>`,
// que es justo lo que la tarea añade.
//
// SE LE PASA `company` Y NO EL PERIODO YA RESUELTO: si el call site siguiera
// llamando a `factsOf` y pasando la cadena, seguiría habiendo dos sitios que
// saben cómo se compone un periodo. Aquí lo sabe uno.
export function Periodo({ lang, company }: { lang: Locale; company: string }) {
  const [inicio, fin] = periodPartsOf(lang, company);
  return (
    <>
      {inicio!.iso ? (
        <time dateTime={inicio!.iso}>{inicio!.texto}</time>
      ) : (
        inicio!.texto
      )}
      {PERIOD_SEPARATOR}
      {/* Sin `iso` el texto no es una fecha —«Actualidad», «Present»— y por eso
          no lleva elemento: marcar como `<time>` algo que no tiene `datetime`
          resoluble sería afirmar de más, que es lo contrario de lo que esta
          tarea persigue. */}
      {fin!.iso ? <time dateTime={fin!.iso}>{fin!.texto}</time> : fin!.texto}
    </>
  );
}
