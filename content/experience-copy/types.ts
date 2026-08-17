// Tipos del registro de copy por experiencia (P48.5).
//
// POR QUÉ EXISTE. De una experiencia se cuenta LO MISMO en tres longitudes y,
// hasta hoy, en tres archivos sin relación entre sí:
//
//   1. una frase   → `dictionaries/{es,en}/home.json` (trayectoria[].desc)
//   2. un bullet   → `content/cv/content.{es,en}.ts` (experience[].bullets)
//   3. su gemelo   → `dictionaries/{es,en}/trayectoria/<slug>.json` (minuto.items)
//
// Seis strings por experiencia contando idiomas, y nada en el build los ataba:
// ni el typecheck, ni el linter, ni `gate:html`. El drift no era hipotético — al
// derivar las cinco (2026-08-17) aparecieron siete cifras que solo existían en el
// deep-dive, una que solo existía en el CV, una cobertura descuadrada (KUOTIP: 3
// bullets frente a 4) y una divergencia de HECHO: el CV decía «construí el MVP» y
// el deep-dive «definí el MVP junto al product designer».
//
// LA IDEA, y es toda la pieza: el bullet corto y el largo son el MISMO elemento
// del array. El emparejamiento 1:1 que la regla 1 del formato de deep-dive pedía
// («un bullet por bullet del CV») deja de ser convención y pasa a ser estructura —
// no se puede escribir uno sin su pareja porque son el mismo objeto. Es el mismo
// giro que D44 le dio a los logos: la unión deja de ser posicional entre dos
// listas y pasa a ser un campo del dato.
//
// LO QUE ESTO NO RESUELVE, dicho aquí para que no se dé por cubierto: `datos.rol`
// y `datos.periodo` del deep-dive siguen siendo copias a mano de los hechos del
// diccionario, y `datos.sector` / `datos.reporting` de los del CV. Ahí hay cuatro
// divergencias detectadas y sin resolver (P48.55), y son de HECHO, no de longitud
// — así que las decide Francisco, no un refactor.

import type { EXPERIENCES } from "../experiences";

/** Las empresas registradas, como unión de literales (no `string`). */
export type Company = (typeof EXPERIENCES)[number]["company"];

export interface ExperienceBullet {
  /**
   * El bullet del CV: una frase, sin markup, pensada para un ATS y para el
   * papel. Es el `deep` COMPRIMIDO, no un texto distinto.
   */
  cv: string;
  /**
   * Su gemelo en «En un minuto» del deep-dive: la versión larga, con énfasis
   * inline (`Rich`) y con la cifra en negrita.
   *
   * OPCIONAL, y la ausencia significa algo concreto: **la experiencia no tiene
   * página de deep-dive**, o sea `slug === null` en `content/experiences.ts`.
   * Hoy son PICKASO —que es el primer capítulo de TheTool y no una historia
   * separable— y las dos entradas de Marketing & Growth, que se quedan fuera por
   * alcance (D44). El guardián comprueba justo esa equivalencia, así que un
   * `deep` que falte en una experiencia CON página rompe, y uno que sobre en una
   * SIN página también.
   */
  deep?: string;
}

export interface ExperienceCopy {
  /**
   * La frase de la fila de Trayectoria en la home. Una sola, con la TESIS de la
   * experiencia — no un resumen de los bullets.
   *
   * Regla de cifra (2026-08-17): **una como máximo, y solo si la cifra es el eje**
   * de la experiencia. Por eso INDYA y Freepik llevan una y las demás ninguna;
   * meterlas en las seis convierte la columna en una tabla de métricas y ninguna
   * destaca.
   */
  short: string;
  /**
   * Los bullets, en el ORDEN DEL DEEP-DIVE — que es el orden por peso en la
   * historia, no el que tenía el CV. En Emendu eso subió el partnership con
   * Sesame HR del sexto puesto al tercero.
   */
  bullets: ExperienceBullet[];
}

/**
 * El registro completo. Es un `Record` sobre la UNIÓN de empresas, no sobre
 * `string`: así, registrar una experiencia nueva en `content/experiences.ts` sin
 * darle copy rompe el build, y una clave con una errata no compila. Es lo mismo
 * que hace `DeepDiveDict` con los cinco diccionarios del deep-dive (D53).
 */
export type ExperienceCopyMap = Record<Company, ExperienceCopy>;
