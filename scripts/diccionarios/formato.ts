/**
 * Editar copy de un diccionario POR PROGRAMA sin ensuciar el diff.
 *
 * EL PROBLEMA (2026-08-29, tanda 1 de «Voz»). La forma natural de cambiar copy
 * por programa es un round-trip de JSON: `parse`, tocar el objeto,
 * `JSON.stringify(d, null, 2)`. **Expande medio archivo.** Los objetos que
 * estaban en una línea (`{ "type": "p", "text": "Vamos a ello." }`) salen en
 * cuatro, y el diff de un cambio de dos párrafos fue de **700 líneas**.
 *
 * Y NO LO CAZA `prettier --check`, que pasa con las dos formas. O sea que el
 * archivo expandido se vuelve su propio canon y la expansión es permanente.
 *
 * POR QUÉ NO VALE UN SERIALIZADOR, que fue el primer intento y hay que dejarlo
 * escrito para que no se vuelva a intentar: se escribió uno que colapsaba todo
 * objeto de hojas que cupiera en 80 columnas, y **reprodujo byte a byte los dos
 * archivos con los que se validó**. Aplicado a los 32, falló en 22. La causa no
 * es el umbral: **Prettier no decide el formato de un objeto por su contenido,
 * sino por si el ORIGINAL tenía un salto de línea tras la llave**. Eso no está
 * en los datos, así que ninguna función de `unknown` a `string` puede
 * reproducirlo. Un metro validado contra dos casos y roto en veintidós es
 * exactamente lo que avisa `BRAND.md` §Cómo medir, punto 1.
 *
 * LA SOLUCIÓN, que además es más simple: no se reserializa nada. Se sustituye
 * TEXTO sobre el archivo, con la cadena ya escapada como JSON, y se comprueba
 * que el resultado sigue pareseando. El formato de todo lo que no se toca se
 * conserva por construcción, y el diff sale del tamaño del cambio.
 */

/** La forma en que una cadena aparece DENTRO del JSON, con sus escapes. */
function comoEstaEnElArchivo(texto: string): string {
  return JSON.stringify(texto).slice(1, -1);
}

export type Cambio = readonly [viejo: string, nuevo: string];

/**
 * Aplica las sustituciones sobre el TEXTO del archivo y devuelve el resultado.
 *
 * Cada `viejo` tiene que aparecer **exactamente una vez**: cero significa que la
 * premisa caducó —el copy ya no dice eso— y dos, que la sustitución es ambigua.
 * Las dos son motivo para parar, no para adivinar; es la misma regla que
 * `check:*` aplica en todo este repo, buscar la ausencia y afirmar cuánto se ha
 * mirado.
 */
export function sustituirEnCopy(
  original: string,
  cambios: readonly Cambio[],
): string {
  let salida = original;

  for (const [viejo, nuevo] of cambios) {
    const buscado = comoEstaEnElArchivo(viejo);
    const veces = salida.split(buscado).length - 1;
    if (veces !== 1) {
      throw new Error(
        `«${viejo.slice(0, 60)}…» aparece ${veces} veces en el archivo; ` +
          `se esperaba exactamente 1.`,
      );
    }
    salida = salida.replace(buscado, comoEstaEnElArchivo(nuevo));
  }

  // Que siga siendo JSON válido no es opcional: una sustitución con comillas o
  // barras mal escapadas rompe el diccionario, y el error saldría en el build y
  // no aquí.
  JSON.parse(salida);
  return salida;
}
