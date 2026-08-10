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
   * traduce segmentos de ruta). `null` = no tiene página propia: las dos
   * entradas de Marketing & Growth se quedan en Trayectoria, porque un deep-dive
   * ahí diluiría el orden del posicionamiento (PRD §3).
   */
  slug: string | null;
  /** Nombre del asset en `public/logos/`. `null` = fila sin logo (PRD §8.5). */
  logo: string | null;
}

export const EXPERIENCES: Experience[] = [
  { company: "Emendu", slug: "emendu", logo: "companies/emendu" },
  { company: "KUOTIP", slug: "kuotip", logo: "companies/kuotip" },
  { company: "INDYA", slug: "indya", logo: "companies/indya" },
  { company: "Freepik", slug: "freepik", logo: "companies/freepik" },
  { company: "TheTool", slug: "thetool", logo: "companies/thetool" },
  { company: "PICKASO", slug: "pickaso", logo: "companies/pickaso" },
  { company: "Ontecnia", slug: null, logo: "companies/ontecnia" },
  { company: "Havas Media", slug: null, logo: null },
];

/**
 * Busca la experiencia de una fila del diccionario por su nombre de empresa.
 *
 * La unión es **por prefijo**, igual que la del CV (`scripts/cv/facts.ts`):
 * el diccionario lleva el nombre en su forma de display, más descriptiva
 * («Ontecnia (Malavida, Lecturalia, BonViveur…)»), y el registro la forma corta.
 * Lanza si no encuentra match.
 */
export function experienceOf(company: string): Experience {
  const hit = EXPERIENCES.find(
    (e) => company === e.company || company.startsWith(e.company),
  );
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
