import type { Locale } from "@/lib/i18n/config";

/**
 * Los pasos de CI tal y como los DIBUJA el artículo (§s10), fuera del componente
 * a propósito (P68.495).
 *
 * POR QUÉ NO VIVEN DENTRO DEL SVG. Porque el recuento de pasos se deriva ya de
 * `.github/workflows/ci.yml` (`lib/figures.ts`), y una cifra derivada al lado de
 * un dibujo hecho a mano es una segunda verdad esperando a divergir: el pie
 * podría decir «diecisiete» con dieciséis pastillas debajo, y nadie lo vería. Con
 * los pasos aquí, `check:articulo` compara el dibujo contra el workflow en cada
 * PR y sale rojo nombrando la diferencia.
 *
 * LO QUE NO SALE DE `ci.yml` Y POR ESO SIGUE AQUÍ: el AGRUPADO por rol y la
 * CATEGORÍA de cada paso. Las dos son editoriales, no están en el workflow y no
 * se pueden derivar de él. El nombre tampoco se compara: el workflow los nombra
 * en un solo idioma y el diagrama se lee en dos. Lo que se compara es cuántos
 * son, que es exactamente lo que se desincronizó.
 */

/**
 * `ausencia` — busca que FALTE algo bueno (los guardianes propios del repo).
 * `patron` — busca un patrón conocido (las herramientas de fábrica y los tests).
 *
 * Un test cuenta como `patron`: falla cuando un caso ESCRITO deja de comportarse
 * como debe, y no sabe decir qué lógica no cubre nadie, que es la propiedad que
 * define a la otra familia.
 */
export type CategoriaPaso = "ausencia" | "patron";

export type GrupoDePasos = {
  label: string;
  items: { n: string; cat: CategoriaPaso }[];
};

type DiagramaCI = {
  /** `{pasos}` lo sustituye el componente con la cifra derivada del workflow. */
  ariaLabel: string;
  /** `{n}` lo sustituye el componente contando los items de cada categoría. */
  absence: string;
  pattern: string;
  groups: GrupoDePasos[];
};

export const DIAGRAMA_CI: Record<Locale, DiagramaCI> = {
  es: {
    ariaLabel:
      "Los {pasos} pasos del workflow de integración continua, en su orden real, agrupados en cuatro bloques: Código, Copy y contenido, Guardianes del repo, y Build y marco. Los pasos coloreados buscan la ausencia de algo bueno; los neutros buscan un patrón conocido.",
    absence: "busca ausencia ({n})",
    pattern: "busca patrón ({n})",
    groups: [
      {
        label: "Código",
        items: [
          { n: "Format", cat: "patron" },
          { n: "Typecheck", cat: "patron" },
          { n: "Lint", cat: "patron" },
          { n: "Tests", cat: "patron" },
        ],
      },
      {
        label: "Copy y contenido",
        items: [
          { n: "Paleta", cat: "ausencia" },
          { n: "Experiencias", cat: "ausencia" },
          { n: "CV al día", cat: "ausencia" },
          { n: "Raya en el copy", cat: "ausencia" },
        ],
      },
      {
        label: "Guardianes del repo",
        items: [
          { n: "Artefacto al día", cat: "ausencia" },
          { n: "Contexto de arranque", cat: "ausencia" },
          { n: "Skills al día", cat: "ausencia" },
          { n: "Índices derivados", cat: "ausencia" },
          { n: "Excepciones de la capa", cat: "ausencia" },
          { n: "Rutas registradas", cat: "ausencia" },
          { n: "Registro del kit", cat: "ausencia" },
          { n: "Artículo al día", cat: "ausencia" },
          { n: "Accesibilidad al día", cat: "ausencia" },
          { n: "Tarjetas OG al día", cat: "ausencia" },
          // INFORMA y no falla: dice qué secciones publicadas toca el PR. Se
          // clasifica como `ausencia` porque lo que encuentra es lo que nadie
          // estaba mirando, no un patrón conocido (P50.76).
          { n: "Qué secciones toca el PR", cat: "ausencia" },
        ],
      },
      {
        label: "Build y marco",
        items: [
          { n: "Build", cat: "patron" },
          { n: "Marco de página", cat: "ausencia" },
          { n: "Markdown al día", cat: "ausencia" },
          { n: "Rótulo de las figuras", cat: "ausencia" },
          { n: "Nombres propios sin traducir", cat: "ausencia" },
          { n: "Guardianes con dientes", cat: "ausencia" },
        ],
      },
    ],
  },
  en: {
    ariaLabel:
      "The {pasos} steps of the continuous-integration workflow, in their real order, grouped into four blocks: Code, Copy and content, Repo guardians, and Build and frame. Tinted steps look for the absence of something good; neutral ones look for a known pattern.",
    absence: "looks for absence ({n})",
    pattern: "looks for a pattern ({n})",
    groups: [
      {
        label: "Code",
        items: [
          { n: "Format", cat: "patron" },
          { n: "Typecheck", cat: "patron" },
          { n: "Lint", cat: "patron" },
          { n: "Tests", cat: "patron" },
        ],
      },
      {
        label: "Copy and content",
        items: [
          { n: "Palette", cat: "ausencia" },
          { n: "Experiences", cat: "ausencia" },
          { n: "CV freshness", cat: "ausencia" },
          { n: "Copy dash check", cat: "ausencia" },
        ],
      },
      {
        label: "Repo guardians",
        items: [
          { n: "Artifact freshness", cat: "ausencia" },
          { n: "Context budget", cat: "ausencia" },
          { n: "Skills freshness", cat: "ausencia" },
          { n: "Derived indices", cat: "ausencia" },
          { n: "Layer exceptions", cat: "ausencia" },
          { n: "Registered routes", cat: "ausencia" },
          { n: "Brand kit registry", cat: "ausencia" },
          { n: "Article freshness", cat: "ausencia" },
          { n: "Accessibility freshness", cat: "ausencia" },
          { n: "OG cards freshness", cat: "ausencia" },
          { n: "Which sections this PR touches", cat: "ausencia" },
        ],
      },
      {
        label: "Build and frame",
        items: [
          { n: "Build", cat: "patron" },
          { n: "Page frame", cat: "ausencia" },
          { n: "Markdown up to date", cat: "ausencia" },
          { n: "Figure labels", cat: "ausencia" },
          { n: "Untranslated proper nouns", cat: "ausencia" },
          { n: "Guardians with teeth", cat: "ausencia" },
        ],
      },
    ],
  },
};

/** Cuántos pasos dibuja el diagrama en un idioma. */
export function pasosDibujados(locale: Locale): number {
  return DIAGRAMA_CI[locale].groups.reduce((n, g) => n + g.items.length, 0);
}
