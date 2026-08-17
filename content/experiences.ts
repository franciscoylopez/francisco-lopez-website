// Registro de experiencias: de una experiencia, lo que NO es copy — el logo que
// la acompaña y el slug de su página. El copy (periodo, rol, descripción) sigue
// en el diccionario i18n, que se queda solo con eso (D38); el texto rico vive en
// `content/cv/` (D22). Los tres se unen por `company`, que es la clave de este
// proyecto desde que existe el CV.
//
// POR QUÉ EXISTE. Los logos eran tres arrays posicionales dentro de
// `components/site/trayectoria.tsx`, mapeados POR ÍNDICE contra los arrays del
// diccionario. Añadir una experiencia, reordenarlas o borrar una desalineaba los
// logos EN SILENCIO: sin error de compilación y sin nada que lo detectara. Es el
// mismo olor que D38 resolvió para los tokens —un valor que vive fuera de su
// fuente—, y se corrige igual: el logo es un campo del dato, y la unión es por
// nombre y no por posición.
//
// Y COMO EN EL CV, SI NO HAY MATCH SE LANZA (D22, `matchFact`): mejor romper la
// build que servir el logo de otra empresa. Es lo que convierte una desalineación
// silenciosa en un fallo ruidoso.

export interface Experience {
  /** Clave de unión con el diccionario y con el CV. */
  company: string;
  /**
   * Slug de su página de deep-dive, estable y neutro al idioma (el sitio no
   * traduce segmentos de ruta). `null` = no tiene página propia, y hoy eso pasa
   * por DOS razones distintas que conviene no confundir:
   *
   * - **De alcance** — las dos entradas de Marketing & Growth se quedan en
   *   Trayectoria, porque un deep-dive ahí diluiría el orden del posicionamiento
   *   (PRD §3: PM → cofundador con exit → ADN Growth).
   * - **De contenido** — PICKASO sí es producto y aun así no tiene página: es el
   *   primer capítulo de la historia de TheTool (la agencia que necesitaba una
   *   herramienta que no existía y que financió su construcción), no una
   *   experiencia con historia separable. Se descubrió ESCRIBIÉNDOLA: al redactar
   *   TheTool, PICKASO ya estaba dentro (2026-08-16, PRD-Historical §44).
   *
   * OJO AL DISEÑO DEL DEEP-DIVE: PICKASO y TheTool son las dos filas anidadas
   * bajo «Shutapp Projects», así que dentro de un mismo grupo visual una enlaza a
   * su página y la otra no. La fila sin enlace no puede leerse como un fallo.
   */
  slug: string | null;
  /** Nombre del asset en `public/logos/`. `null` = fila sin logo (PRD §8.5). */
  logo: string | null;
}

// `as const satisfies` y no `: Experience[]`: la anotación clásica borraba los
// literales, así que `slug` valía `string` y cualquier cadena pasaba por slug
// válido. Con esto, `ExperienceSlug` es la unión real de las cinco y el registro
// de diccionarios del deep-dive no puede referirse a una experiencia que no
// existe — el mismo modo de fallo silencioso que este módulo mata en los logos,
// una capa más arriba.
export const EXPERIENCES = [
  { company: "Emendu", slug: "emendu", logo: "companies/emendu" },
  { company: "KUOTIP", slug: "kuotip", logo: "companies/kuotip" },
  { company: "INDYA", slug: "indya", logo: "companies/indya" },
  { company: "Freepik", slug: "freepik", logo: "companies/freepik" },
  { company: "TheTool", slug: "thetool", logo: "companies/thetool" },
  { company: "PICKASO", slug: null, logo: "companies/pickaso" },
  { company: "Ontecnia", slug: null, logo: "companies/ontecnia" },
  { company: "Havas Media", slug: null, logo: null },
] as const satisfies readonly Experience[];

/** Los slugs que SÍ tienen página, como unión de literales. */
export type ExperienceSlug = NonNullable<(typeof EXPERIENCES)[number]["slug"]>;

/**
 * Busca la experiencia de una fila del diccionario por su nombre de empresa.
 *
 * La unión es **por prefijo**, igual que la del CV (`scripts/cv/facts.ts`):
 * el diccionario lleva el nombre en su forma de display, más descriptiva
 * («Ontecnia (Malavida, Lecturalia, BonViveur…)»), y el registro la forma corta.
 * Lanza si no encuentra match.
 */
export function experienceOf(company: string): Experience {
  // POR LONGITUD DESCENDENTE, no en orden de array. Con `startsWith` y el primer
  // match, registrar «Emendu» y más tarde «Emendu Health» haría que la segunda
  // resolviera en silencio a la primera — y se llevaría su logo Y su slug. O sea,
  // exactamente la desalineación silenciosa que este módulo existe para matar,
  // reaparecida en una ventana más estrecha: el mapeo por índice se cambió por uno
  // por nombre con el mismo modo de fallo. Ganando siempre el prefijo más largo,
  // no hay ambigüedad posible. (Hoy no hay colisión; esto es para que siga sin
  // haberla.)
  const hit = [...EXPERIENCES]
    .sort((a, b) => b.company.length - a.company.length)
    .find((e) => company === e.company || company.startsWith(e.company));
  if (!hit) {
    throw new Error(
      `Trayectoria: no encuentro la experiencia de "${company}" en content/experiences.ts. ` +
        `¿Se añadió una fila al diccionario sin registrarla aquí? Empresas registradas: ${EXPERIENCES.map(
          (e) => e.company,
        ).join(" · ")}`,
    );
  }
  return hit;
}
