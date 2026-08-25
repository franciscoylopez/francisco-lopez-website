// @pieza primitiva · pendiente · Marca los nombres propios del sitio como no traducibles.

/**
 * LOS NOMBRES PROPIOS NO SE TRADUCEN — `translate="no"` sobre cada aparición.
 *
 * QUÉ PASABA. Chrome le ofrece al visitante traducir automáticamente la página,
 * y en una web BILINGÜE eso ocurre de verdad: alguien abre `/en` y el navegador
 * le propone el español (o al revés). El traductor no distingue un nombre propio
 * de una palabra, así que «TheTool» se convierte en «La Herramienta» y
 * «AppRadar» en «Radar de aplicaciones». El argumento entero de este sitio son
 * esos nombres: un recruiter que busque «TheTool» en la página traducida no lo
 * encuentra.
 *
 * POR QUÉ ESTO ES UNA CAPA Y NO UN ATRIBUTO ESCRITO EN EL COPY. Había 216
 * apariciones repartidas entre veinte diccionarios y siete componentes, y la
 * versión obvia —un token en el markup del diccionario, `{{TheTool}}`— cuesta
 * ~130 ediciones de copy y deja el problema abierto: el copy que se escriba
 * mañana nace sin el token, y nada lo detecta. Aquí el copy no se toca. Se
 * declara UNA vez qué es un nombre propio y quien pinta texto lo aplica, que es
 * la forma que este repo ya usa para el atenuado (D39) y para el contorno de un
 * control (D97): no se elige en el punto de uso, lo resuelve la capa.
 *
 * Y COMO NO SE ELIGE EN EL PUNTO DE USO, HAY QUE VIGILAR QUE LLEGA:
 * `npm run check:marcas` recorre el HTML prerenderizado de las 28 variantes y
 * falla nombrando la página y la frase donde un nombre se pintó suelto. Sin él
 * esto sería una regla que hay que recordar, que es una regla que se incumple
 * (`BRAND.md` §Cómo se escribe una regla, punto 2).
 */
import type { ReactNode } from "react";

import { EXPERIENCES } from "@/content/experiences";

/**
 * LOS NOMBRES DE EMPRESA SALEN DEL REGISTRO, no de una lista escrita a mano.
 * `EXPERIENCES` ya es la fuente única de qué experiencias existen (su logo y su
 * slug se unen por `company`), así que una experiencia nueva entra aquí sola. Un
 * segundo listado se habría desincronizado igual que se desincronizaban los
 * logos antes de que existiera ese registro.
 *
 * LOS DEMÁS NO ESTÁN EN NINGÚN REGISTRO Y SU SITIO ES ESTE: quien compró
 * TheTool, la formación y las agencias y sitios de las dos filas de Marketing &
 * Growth. Ninguno es una experiencia, así que no hay un dato del que derivarlos
 * —solo aparecen dentro de frases—, y por eso se escriben con su motivo al lado
 * en vez de inventar un registro de una sola columna para ocho cadenas.
 */
const OTRAS_MARCAS = [
  // Quien compró TheTool.
  "AppRadar",
  // Formación.
  "theUncoding",
  "TheHeroCamp",
  // Las agencias y los sitios que acompañan a las dos filas de Marketing & Growth.
  // Van aquí porque comparten LÍNEA con un nombre que sí estaba en el registro
  // —«Havas Media · Increnta · Miss Conversion», «Ontecnia (Malavida…)»— y media
  // línea marcada y media sin marcar es peor que ninguna: el traductor haría
  // «Señorita Conversión» justo al lado de un nombre que respeta.
  "Increnta",
  "Miss Conversion",
  "Malavida",
  "Lecturalia",
  "BonViveur",
] as const;

export const MARCAS: readonly string[] = [
  ...EXPERIENCES.map((e) => e.company),
  ...OTRAS_MARCAS,
];

/**
 * DE MÁS LARGO A MÁS CORTO, que no es cosmética: si dos nombres compartieran
 * prefijo, la alternancia de una expresión regular se queda con el primero que
 * encaja, y ordenando al revés el corto se comería al largo. Hoy no hay ningún
 * par así; ordenarlo es lo que hace que siga siendo verdad cuando lo haya.
 */
const PATRON = new RegExp(
  `\\b(${[...MARCAS]
    .sort((a, b) => b.length - a.length)
    .map((m) => m.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|")})\\b`,
  "g",
);

/**
 * Parte un texto y envuelve cada nombre propio. **Distingue mayúsculas a
 * propósito**: `theUncoding` empieza en minúscula y una comparación laxa
 * marcaría cualquier «the» de la prosa inglesa. Y `\b` a los dos lados evita
 * lo contrario, que un nombre encaje dentro de otra palabra.
 *
 * Devuelve la cadena tal cual cuando no hay nada que marcar, que es el caso
 * mayoritario: así el árbol de React no engorda con un `<span>` por párrafo.
 */
export function marcarMarcas(text: string): ReactNode {
  // `split` con un grupo de captura devuelve también lo capturado, que es el
  // mismo truco que usa `Rich`. Se parte SIEMPRE, sin un `test` previo: `PATRON`
  // es global, y `test` sobre una expresión global avanza su `lastIndex`, así que
  // la segunda llamada con el mismo texto daría otro resultado. Un atajo que solo
  // falla en la segunda llamada es peor que no tener atajo.
  const trozos = text.split(PATRON).filter((p) => p !== "");
  // El atajo mira si hay algún NOMBRE, no cuántos trozos hay. Contar trozos
  // parece equivalente y no lo es: cuando el texto entero es el nombre —«Emendu»
  // a secas, que es el caso más frecuente del sitio— `split` devuelve un solo
  // trozo y la cuenta lo confundía con «no hay nada que marcar».
  if (!trozos.some((t) => MARCAS.includes(t))) return text;

  return trozos.map((trozo, i) =>
    MARCAS.includes(trozo) ? (
      <span key={i} translate="no">
        {trozo}
      </span>
    ) : (
      trozo
    ),
  );
}

/**
 * La forma de componente, para el texto que NO pasa por `Rich`: el nombre que
 * viene de un dato (la fila de Trayectoria, el rótulo de un hito) y la prosa
 * suelta que se pinta sin markup.
 */
export function Marcas({ children }: { children: string }) {
  return <>{marcarMarcas(children)}</>;
}
