/**
 * De qué depende cada sección de «Cómo se ha creado esta página».
 *
 * POR QUÉ EXISTE. El artículo cuenta el estado del proyecto, y el proyecto sigue
 * cambiando. Tres clases de afirmación caducan, y ninguna avisa al caducar:
 *
 *   1. **La cifra contable** — «AAA en las doce páginas», cuando son trece por
 *      idioma desde que existe el propio artículo. Ya era falsa el día que se
 *      escribió esto.
 *   2. **El estado del producto** — «No hay formulario de contacto», que muere el
 *      día que exista Contacto ampliada.
 *   3. **La medición externa** — «B+, 80 sobre 100» del HTTP Observatory, que
 *      muere con la CSP estricta (P64.5).
 *
 * Ninguna la ve un compilador, ninguna la ve `check:raya`, y `sprint-review`
 * dispara al CERRAR etapa — semanas después de que el artículo pasara a mentir.
 * Es el fallo de disparador que nombra `BRAND.md` §Cómo se escribe una regla:
 * una condición que se comprueba en el momento equivocado no es una regla.
 *
 * QUÉ HACE ESTO. Cada sección declara de qué depende. `npm run check:articulo`
 * sella el estado de esas dependencias; cuando una cambia, CI sale rojo NOMBRANDO
 * la sección, en el PR que introduce el cambio. O se actualiza el texto, o se
 * re-sella con `npm run articulo:sellar` porque el cambio no le afectaba.
 *
 * No decide si el texto es falso: no puede. Decide que **alguien tiene que
 * mirarlo**, que es lo que hoy no hace nadie.
 *
 * POR QUÉ AQUÍ Y NO EN EL DICCIONARIO. Es la regla de D44: lo que de una
 * experiencia no es copy vive en `content/`. Una dependencia no se traduce.
 *
 * GRANULARIDAD, que es lo que separa un guardián de una alarma que se ignora.
 * `DECISIONS.md` cambia en casi cada sesión, así que hashearlo entero daría rojo
 * siempre y a la tercera vez nadie lo leería. Por eso se depende de la ENTRADA
 * (`DECISIONS.md#D26`) y de la SECCIÓN de un `.md` (`PRD-Live.md#7.`), no del
 * archivo. Y de un directorio se hashea la LISTA de archivos, no su contenido:
 * lo que el artículo afirma de `components/ui/` es cuántas piezas hay, no qué
 * dice cada una.
 *
 * LO QUE NO CUBRE, dicho para que no se dé por cubierto:
 *
 * - **`package.json`.** El artículo nombra versiones («Next 16», «Tailwind v4»)
 *   y un salto de major debería avisar, pero los bumps de Dependabot tocan ese
 *   archivo cada semana. Meterlo convertiría el guardián en ruido, que es peor
 *   que no tenerlo. Un salto de major se nota por otras vías.
 * - **Que el texto diga la verdad.** Esto detecta que la FUENTE se movió, no que
 *   el párrafo se haya vuelto falso. Lo segundo lo decide una persona.
 * - **Lo que el artículo afirma y no tiene fuente en el repo** (una impresión,
 *   una anécdota). No hay nada que sellar ahí, y está bien: no caduca.
 */

/** Las once secciones, en el orden en que se leen. El guardián comprueba que
 *  esta lista y la del diccionario son la misma: una sección nueva sin declarar
 *  dependencias no pasa. */
export const SECCIONES = [
  "s01",
  "s02",
  "s03",
  "s04",
  "s05",
  "s06",
  "s07",
  "s08",
  "s09",
  "s10",
  "s11",
] as const;

export type SeccionId = (typeof SECCIONES)[number];

/**
 * Las tres formas de una dependencia:
 *
 * - `"next.config.ts"` — un archivo. Se hashea entero.
 * - `"DECISIONS.md#D26"` — una sección de un markdown, por el principio de su
 *   titular. Se hashea el cuerpo de esa sección hasta el siguiente titular del
 *   mismo nivel o superior.
 * - `"components/ui/"` — un directorio (con barra final). Se hashea la LISTA
 *   ordenada de sus archivos, no su contenido.
 */
export type Dependencia = string;

export const DEPENDENCIAS: Record<SeccionId, Dependencia[]> = {
  // «Una web no demuestra criterio por existir» — los dos lectores, la métrica
  // de contacto, por qué no hay formulario y qué experiencias tienen página.
  s01: [
    "PRD-Live.md#2. Audiencia",
    "PRD-Live.md#7. Métricas de éxito",
    "DECISIONS.md#D29",
    "lib/routes.ts",
  ],

  // «Del brief al tablero» — el proceso, el registro de decisiones, el ciclo de
  // ramas y qué protege a `main`.
  s02: ["DECISIONS.md#D10", "DECISIONS.md#D12", "DECISIONS.md#D68"],

  // «La marca, antes que la primera línea de código» — las dos capas, el split,
  // la tipografía. Depende de `BRAND.md` ENTERO a propósito: es exactamente el
  // archivo cuya evolución preocupa, y cambia una o dos veces por sprint.
  s03: ["BRAND.md", "BRAND-logo.md"],

  // «El stack, y por qué ese» — Next, i18n, shadcn sin usar, Tailwind sin
  // `@layer`, y por qué entra una herramienta externa. Las versiones concretas
  // no están selladas (ver «lo que no cubre», arriba).
  s04: [
    "DECISIONS.md#D2",
    "DECISIONS.md#D3",
    "DECISIONS.md#D6",
    "DECISIONS.md#D34",
    "DECISIONS.md#D51",
  ],

  // «El sistema de componentes» — la cascada y las SIETE piezas. El directorio
  // por su lista de archivos: es la cifra que el texto publica.
  s05: [
    "DECISIONS.md#D36",
    "DECISIONS.md#D40",
    "DECISIONS.md#D45",
    "DECISIONS.md#D46",
    "DECISIONS.md#D72",
    "components/ui/",
    "CLAUDE.md#Regla de construcción",
  ],

  // «Del diseño al código» — la fuente de diseño y su traducción.
  s06: ["DECISIONS.md#D1"],

  // «Lo que no se ve: seguridad, alojamiento y la deuda que no se acumuló» — las
  // cabeceras servidas, la CSP y la nota del HTTP Observatory. Es la sección que
  // P64.5 (CSP estricta con nonces) va a invalidar, y la primera prueba real de
  // que este mecanismo sirve.
  s07: [
    "DECISIONS.md#D13",
    "DECISIONS.md#D15",
    "DECISIONS.md#D26",
    "DECISIONS.md#D27",
    "DECISIONS.md#D32",
    "DECISIONS.md#D55",
    "next.config.ts",
  ],

  // «AA es el suelo, y el metro estuvo mal calibrado tres veces» — el censo, las
  // cifras publicadas y la pasada con lector de pantalla.
  s08: [
    "DECISIONS.md#D39",
    "DECISIONS.md#D41",
    "DECISIONS.md#D52",
    "DECISIONS.md#D61",
    "DECISIONS.md#D73",
    "scripts/design-review/contrast-census.js",
    "lib/design-values.ts",
    // El texto publica una CIFRA de páginas («AAA en las doce páginas»), así que
    // añadir una tiene que mandar a releer esta sección. Hoy ya dice doce donde
    // hay trece: el artículo es la decimotercera y llegó después de la última
    // pasada completa (`LAST_A11Y_REVIEW`, 2026-08-20).
    "lib/routes.ts",
  ],

  // «Qué revisa una IA y qué no» — los pasos de CI (una cifra en el texto), los
  // guardianes y los skills. El workflow y el directorio de skills son la
  // fuente de las dos cifras que publica.
  s09: [
    "DECISIONS.md#D37",
    "DECISIONS.md#D63",
    "DECISIONS.md#D67",
    "DECISIONS.md#D70",
    "DECISIONS.md#D72",
    ".github/workflows/ci.yml",
    ".claude/skills/",
  ],

  // «Lo que salió mal, y qué tenían todos en común» — los fallos y la regla que
  // salió de cada uno.
  s10: [
    "DECISIONS.md#D60",
    "DECISIONS.md#D63",
    "DECISIONS.md#D70",
    "BRAND.md#Cómo se escribe una regla aquí",
  ],

  // «Ahora empieza lo bueno» — el consentimiento, la política de cookies, la
  // medición y qué viene después.
  s11: [
    "DECISIONS.md#D17",
    "DECISIONS.md#D18",
    "DECISIONS.md#D31",
    "DECISIONS.md#D71",
    "PRD-Live.md#7. Métricas de éxito",
    "PRD-Live.md#9. Alcance por versión",
  ],
};
