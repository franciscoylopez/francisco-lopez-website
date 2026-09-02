/**
 * De qué depende cada bloque de `/accesibilidad`.
 *
 * POR QUÉ EXISTE. La página declara la conformidad del sitio, y **casi todo lo que
 * dice es comprobable**: qué mide cada gate, cuántos guardianes hay, qué cubre el
 * censo de contornos, qué encontró la pasada con NVDA, qué queda pendiente. Esas
 * frases caducan igual que las del artículo y **no avisan al caducar**.
 *
 * Y no es hipotético: la frase «aún no hay formulario de contacto» sobrevivió tres
 * días a un sprint que había construido el formulario, y se encontró **de
 * casualidad, leyendo la página**. El artículo tiene `check:articulo` desde D84
 * para exactamente esto; esta página publicaba lo mismo y no tenía nada.
 *
 * QUÉ HACE ESTO. Cada bloque declara de qué depende. `npm run check:accesibilidad`
 * sella el estado de esas fuentes; cuando una cambia, CI sale rojo NOMBRANDO el
 * bloque, en el PR que introduce el cambio. O se corrige el texto, o se re-sella
 * con `npm run accesibilidad:sellar` porque el cambio no le afectaba.
 *
 * No decide si el texto es falso: no puede. Decide que **alguien tiene que
 * mirarlo**, que es lo que hoy no hace nadie.
 *
 * QUÉ BLOQUES ENTRAN Y CUÁLES NO. Solo los que **afirman algo verificable**. Fuera
 * quedan `hero`, `indice`, `term` y `report`, que son rótulo, navegación,
 * definición y una dirección de correo: no hay fuente que se pueda mover debajo de
 * ellos. Meterlos daría rojos que no significan nada, y a la tercera vez nadie lee
 * el rojo. `inheritance` tampoco: su contenido lo DERIVA el componente del campo
 * `inherited` pegado a cada punto, así que se mueve solo.
 *
 * LO QUE NO CUBRE, dicho para que no se dé por cubierto:
 *
 * - **Las cifras que no tienen fuente en el repo.** «Tres páginas se desbordan por
 *   debajo de 320» es una MEDICIÓN, no un archivo: nada la puede sellar. Está
 *   atada a la tarea que la arreglará, y cuando esa se cierre habrá que venir a
 *   mano. Lo mismo con «dieciséis pares sobre fotografía».
 * - **Que el texto diga la verdad.** Esto detecta que la FUENTE se movió, no que el
 *   párrafo se haya vuelto falso. Lo segundo lo decide una persona.
 * - **El copy en sí.** A diferencia del artículo, esta página no publica
 *   `dateModified`, así que no hay un sello de copy aparte que mantener.
 */

/** Los bloques con afirmación verificable, en el orden en que se leen. */
export const BLOQUES = [
  "conformance",
  "measures",
  "verify",
  "blindspot",
  "limits",
] as const;

export type BloqueId = (typeof BLOQUES)[number];

/**
 * Las tres formas de una dependencia son las de `scripts/dependencias/huella.ts`:
 * archivo, `archivo.md#fragmento` y `directorio/`.
 */
export const DEPENDENCIAS: Record<BloqueId, readonly string[]> = {
  // «WCAG 2.2 AA cumplido, con el contraste medido», con las dos cifras del
  // texto principal interpoladas y la fecha de la última revisión.
  conformance: ["lib/design-values.ts", "BRAND.md#Accesibilidad"],

  // Los nueve puntos en lenguaje llano, con el criterio WCAG de cada uno. Su
  // fuente es el checklist interno: si allí se añade un punto o cambia el
  // criterio, esta lista se queda corta.
  measures: ["CLAUDE.md#Checklist de accesibilidad"],

  // La lista de herramientas y el arnés que las vigila. `casos.ts` es la fuente
  // de las dos cifras de la nota; `ci.yml` decide cuáles corren solas y cuáles
  // se lanzan a mano, que es justo lo que el párrafo explica.
  verify: [
    "scripts/guardianes/casos.ts",
    ".github/workflows/ci.yml",
    "GATES.md#Cómo se verifica lo que no ve un compilador",
    "scripts/design-review/censo/",
  ],

  // El punto ciego: la pasada con NVDA, las cinco cosas que ninguna herramienta
  // podía ver y el hecho de que tres cambiaron el armazón compartido.
  blindspot: ["DECISIONS.md#D73", "DECISIONS.md#D46"],

  // Los límites. Cada uno se cierra con una tarea, y cerrarla deja la tarjeta
  // mintiendo: por eso este bloque es el que más se mueve y el que más falta
  // hacía vigilar.
  limits: [
    "scripts/design-review/censo/",
    "lib/figures.ts",
    "DECISIONS.md#D124",
    "content/cv/",
  ],
};
