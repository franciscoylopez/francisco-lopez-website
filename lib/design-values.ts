// Fuente única de los VALORES que el sitio publica sobre sí mismo (P37.66).
//
// EL REPARTO, que es lo que hay que recordar: `globals.css`, `action.tsx`,
// `chrome.tsx`, `badge.tsx`, `heading.tsx` y `layout.ts` son la fuente EJECUTABLE
// —lo que el navegador pinta—; este archivo es la fuente PUBLICADA —lo que las
// páginas afirman sobre ella—; y `BRAND.md` es la fuente del PORQUÉ, nunca del
// valor. El diccionario, a partir de aquí, solo lleva copy.
//
// Por qué existe. Design System y Brand Kit se venden como reflejo del código,
// pero no leían del código: leían de `es.json` y `en.json`. Cada cifra de
// contraste vivía en CUATRO sitios —los dos diccionarios, `BRAND.md` y
// `DECISIONS.md`— y ninguno de los cuatro se puede verificar sin volver a medir.
// Ese reparto ya falló dos veces del mismo modo: el sitio publicó trece días un
// 7,01:1 que ningún color podía dar (P37.598), y `BRAND.md` pasó cuatro días
// contradiciéndose a sí mismo sobre el hover del sólido (P37.5985). Acordarse de
// propagar no es una solución: es la ausencia de una.
//
// LA LÍNEA — qué sale del diccionario y qué se queda. Sale lo que no tiene texto
// que traducir: un token, un hex, un breakpoint, una cifra medida. Se queda todo
// lo que un traductor tocaría: nombres, notas, rótulos de columna, prosa. La
// prueba es literal — si una entrada de `es.json` y su gemela de `en.json` son
// carácter por carácter la misma, no es copy, es un valor con dos copias.
//
// LA CIFRA SE GUARDA COMO NÚMERO, NO COMO TEXTO. Antes se escribía «13,79:1» en
// español y «13.79:1» en inglés, o sea que la coma decimal era la razón por la
// que el dato vivía en el diccionario. Aquí es un `number` y el separador lo pone
// `Intl.NumberFormat` en el punto de render (`ratioText`), que es donde
// corresponde.
//
// Y EL NIVEL WCAG SE DERIVA, no se escribe. `AAA`/`AA` es una función del número
// y del tamaño de texto — la misma función para todos los pares—, así que
// tenerlo escrito al lado solo abre la puerta a que un día no coincidan.

import type { Locale } from "@/lib/i18n/config";
import { cardinal, reviewDate } from "@/lib/i18n/palabras";
import { PAGE_SLUGS } from "@/lib/routes";

/* -------------------------------------------------------------------------- */
/* Las dos paletas                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Los tokens de color de los DOS temas, con el mismo texto `oklch` que tienen en
 * `app/globals.css`. Aquí no hay ni un hex escrito a mano: el que necesitan los
 * consumidores lo deriva `paletteHex()` haciendo la misma conversión que el
 * navegador.
 *
 * POR QUÉ ESTA COPIA ES LEGÍTIMA Y LAS OTRAS NO (P37.6605). En una página normal
 * el color se pide con `var(--primary)` y no hay copia que mantener. Estos dos
 * consumidores no pueden:
 *
 * - **El mock de tema del Design System** pinta las dos paletas a la vez, y las
 *   CSS vars solo dan la del tema activo. Ya existía el precedente en el propio
 *   sistema: `--primary-on-inverted` expone «el cian del otro tema».
 * - **Las imágenes OG** (`app/api/og/route.tsx`) las genera Satori, que no lee
 *   CSS vars ni resuelve `oklch`.
 *
 * Lo que no era legítimo es que cada uno tuviera **su** copia. El mock llevaba
 * nueve valores por tema y las OG ocho; de los 26, **tres** habían divergido sin
 * que nada lo notara: el cian claro del mock seguía en `oklch(0.43 …)` —el que se
 * corrigió el 2026-08-04 por publicar un AAA que no cumplía (P37.598)—, y las OG
 * pintaban un atenuado y un borde de una generación anterior de la paleta.
 *
 * Y POR QUÉ NADIE LO VIO, que es la parte reutilizable: **ninguna herramienta que
 * corremos puede verlo.** axe pasa —en el mock el cian es fondo de botón, no
 * texto, así que el par daba AAA igual— y el typecheck ve una cadena válida. Solo
 * se detecta comparando valor contra valor, que es justo lo que ahora hace
 * `npm run check:palette` en cada PR: el guardián no está aquí, está en CI.
 */
export const PALETTE = {
  light: {
    background: "oklch(0.9653 0.0102 81.8)",
    foreground: "oklch(0.2657 0.0118 248.27)",
    card: "oklch(0.9855 0.0057 84.57)",
    // El filete de AUTOR, que desde P68.749 se llama `--border-base`: `--border`
    // pasó a derivarse de la superficie donde cae, como ya hacían `--surface-dim`
    // (D39) y `--control-edge` (D97). Lo que se publica y se compara es el valor
    // autorado, que es el único que alguien escribió.
    "border-base": "oklch(0.901 0.0142 88.69)",
    muted: "oklch(0.9316 0.0128 86.83)",
    "muted-foreground": "oklch(0.4365 0.0064 95.19)",
    primary: "oklch(0.41 0.0886 194.82)",
    "primary-foreground": "oklch(0.9855 0.0057 84.57)",
    // Los dos tokens de MARCA que conmutan, y por eso viven aquí y no en
    // `BRAND_PALETTE` (P37.659): el cian se aclara en oscuro, y el acento morado
    // pasó a conmutar en P37.657/D41. Estaban fuera de las dos paletas, o sea
    // fuera del alcance de `check:palette`, que es justo el agujero de esta tarea.
    "brand-cyan": "oklch(0.41 0.0886 194.82)",
    "brand-purple-accent": "oklch(0.78 0.16 290)",
  },
  dark: {
    background: "oklch(0.2283 0.0098 248.26)",
    foreground: "oklch(0.9653 0.0102 81.8)",
    card: "oklch(0.2657 0.0118 248.27)",
    "border-base": "oklch(0.3252 0.0157 248.31)",
    muted: "oklch(0.3063 0.0152 252.34)",
    "muted-foreground": "oklch(0.7295 0.0116 95.22)",
    primary: "oklch(0.7626 0.1156 191.46)",
    "primary-foreground": "oklch(0.2283 0.0098 248.26)",
    "brand-cyan": "oklch(0.7626 0.1156 191.46)",
    "brand-purple-accent": "oklch(0.45 0.16 290)",
  },
} as const satisfies Record<Theme, Record<string, string>>;

/**
 * Tokens de marca, que NO conmutan con el tema: valen lo mismo en los dos. Los
 * consumen las imágenes OG, que llevan fondo de marca fijo.
 */
export const BRAND_PALETTE = {
  "brand-cyan-split": "oklch(0.7242 0.1208 194.82)",
  "brand-purple-split": "oklch(0.6889 0.1581 289.96)",
  "brand-cyan-soft": "oklch(0.8694 0.0592 192.12)",
  "brand-purple-soft": "oklch(0.8151 0.0776 295.46)",
  // El morado decorativo estándar sí vale lo mismo en los dos temas, así que su
  // sitio es este y no `PALETTE` (añadido en P37.659, ver el comentario de allí).
  "brand-purple": "oklch(0.6889 0.1581 289.96)",
} as const satisfies Record<string, string>;

export type PaletteToken = keyof (typeof PALETTE)["light"];
export type BrandToken = keyof typeof BRAND_PALETTE;

/**
 * `oklch(…)` → el `#rrggbb` que el navegador PINTA. Es conversión estándar
 * —oklch → oklab → LMS → sRGB lineal → gamma— y termina **recortando a [0,1]**,
 * que es el paso que importa aquí: los cianes de esta marca caen ligeramente
 * fuera del gamut sRGB, y sin recortar sale un color que no existe en pantalla
 * (`BRAND.md` §Accesibilidad lo cuenta como el error que ya se cometió una vez).
 *
 * Validada contra el navegador: `scripts/check-palette.mjs` compara los 20
 * valores de aquí con lo que Chrome pinta, y esa misma comprobación reprodujo
 * exactamente los 17 hex medidos a mano el 2026-08-09.
 */
export function oklchToHex(css: string): string {
  const m = /oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/.exec(css);
  if (!m) throw new Error(`No es un color oklch: ${css}`);
  const L = Number(m[1]);
  const C = Number(m[2]);
  const h = (Number(m[3]) * Math.PI) / 180;

  const a = C * Math.cos(h);
  const b = C * Math.sin(h);

  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const mm = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;

  const lin = [
    4.0767416621 * l - 3.3077115913 * mm + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * mm - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * mm + 1.707614701 * s,
  ];

  return `#${lin
    .map((v) => {
      const srgb = v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
      const byte = Math.round(Math.min(1, Math.max(0, srgb)) * 255);
      return byte.toString(16).padStart(2, "0");
    })
    .join("")
    .toUpperCase()}`;
}

/** La paleta de un tema, ya en hex, para quien no puede resolver `oklch`. */
export function paletteHex(theme: Theme): Record<PaletteToken, string> {
  return Object.fromEntries(
    Object.entries(PALETTE[theme]).map(([k, v]) => [k, oklchToHex(v)]),
  ) as Record<PaletteToken, string>;
}

/** Los tokens de marca en hex. No conmutan, así que no llevan tema. */
export function brandHex(): Record<BrandToken, string> {
  return Object.fromEntries(
    Object.entries(BRAND_PALETTE).map(([k, v]) => [k, oklchToHex(v)]),
  ) as Record<BrandToken, string>;
}

/* -------------------------------------------------------------------------- */
/* Tokens de layout                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Los cinco tokens propios de este sitio, tal como están escritos en el `:root`
 * de `app/globals.css`. Se publican en la sección «Tokens de layout» del Design
 * System y alimentan sus estadísticas de portada.
 */
export const LAYOUT_TOKENS = [
  { name: "--container", value: "1360px" },
  { name: "--page-x", value: "clamp(1.25rem, 5vw, 2.5rem)" },
  { name: "--gutter", value: "clamp(1rem, 2.2vw, 1.5rem)" },
  { name: "--measure", value: "42rem" },
  { name: "--section-y", value: "clamp(4.5rem, 9vw, 9rem)" },
] as const;

/**
 * Los cinco tokens como bloque de CSS pegable: lo que se lleva quien pulsa
 * «copiar» en §02 del Design System. Se DERIVA de `LAYOUT_TOKENS` en vez de
 * escribirse al lado, que sería otra copia de un valor que ya tiene fuente (D38)
 * y, peor, una copia que el guardián de la paleta no vigila porque no es color.
 */
export const LAYOUT_TOKENS_CSS = [
  ":root {",
  ...LAYOUT_TOKENS.map((t) => `  ${t.name}: ${t.value};`),
  "}",
].join("\n");

/** Ancho máximo del contenedor, sin unidad, para la estadística de portada. */
export const CONTAINER_PX = 1360;

/** Medida de lectura en `rem`, sin unidad, para la estadística de portada. */
export const MEASURE_REM = 42;

/** Rangos legibles de `--gutter` y `--section-y`, que la página cita en px. */
export const GUTTER_RANGE_PX = "16–24px";
export const SECTION_Y_RANGE_PX = "72 → 144px";

/* -------------------------------------------------------------------------- */
/* Cifras de identidad — las que publica la portada del Brand Kit             */
/* -------------------------------------------------------------------------- */

/**
 * Altura mínima a la que el split se lee como capa y no como fleco (BRAND.md
 * §Logo). Es un valor EJECUTABLE, no solo publicado: la escalera de la sección
 * del logotipo decide con él qué peldaños funcionan, así que vive aquí y no
 * escrito a mano en la página — que es donde estaba.
 *
 * Ojo con el falso positivo al buscarlo: hay otros `48` en el Brand Kit que NO
 * son este umbral, sino coordenadas de dibujo (el radio de los iconos de la
 * maqueta de favicon). Esos se quedan en px por la excepción de ilustraciones
 * de `CLAUDE.md`.
 */
export const SPLIT_MIN_PX = 48;

/**
 * Las dos familias del sistema. Se listan en vez de contarse para que el número
 * no pueda mentir: si algún día entra una tercera, la cifra publicada sube sola.
 */
export const TYPE_FAMILIES = ["Bricolage Grotesque", "Inter"] as const;

/**
 * Cuántos tokens de color tiene el sistema, DERIVADO de las dos capas en vez de
 * contado a mano: los semánticos de `PALETTE` (por tema, así que se cuenta uno)
 * más los de marca de `BRAND_PALETTE`. Es la regla de las dos capas de
 * `BRAND.md` expresada como cifra.
 */
export const COLOR_TOKEN_COUNT =
  Object.keys(PALETTE.light).length + Object.keys(BRAND_PALETTE).length;

/* -------------------------------------------------------------------------- */
/* Breakpoints                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * La escala de Tailwind del repo. `min` es el `min-width` en px; `base` no tiene
 * y por eso su rango se compone con el `min` del siguiente. La tabla de la página
 * y la lista de la portada salen de aquí, que antes eran dos copias sueltas.
 */
export const BREAKPOINTS = [
  { token: "base", min: null },
  { token: "sm", min: 640 },
  { token: "md", min: 768 },
  { token: "lg", min: 1024 },
  { token: "xl", min: 1280 },
] as const;

export type BreakpointToken = (typeof BREAKPOINTS)[number]["token"];

/** Cuántos breakpoints con `min-width` hay — «4» en la portada. */
export const BREAKPOINT_COUNT = BREAKPOINTS.filter(
  (b) => b.min !== null,
).length;

/**
 * El rango que cubre un breakpoint, ya formateado: `0 – 639px` para `base` y
 * `≥ 640px` para los demás. El «639» se calcula, no se escribe — era el único
 * número de la tabla que había que recordar actualizar a mano.
 */
export function breakpointRange(token: string): string {
  const i = BREAKPOINTS.findIndex((b) => b.token === token);
  const bp = BREAKPOINTS[i];
  if (!bp) return "";
  if (bp.min === null) {
    const next = BREAKPOINTS[i + 1];
    return next?.min ? `0 – ${next.min - 1}px` : "";
  }
  return `≥ ${bp.min}px`;
}

/* -------------------------------------------------------------------------- */
/* Escala de espaciado                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Escala de base 4px (Tailwind) que ilustra la sección de ritmo vertical. `bar`
 * es el ancho de la barra del espécimen en porcentaje: es una coordenada del
 * dibujo, ajustada a ojo, no una función de `px` — por eso va escrita y no
 * calculada (misma excepción que los radios de las ilustraciones, `CLAUDE.md`).
 */
export const SPACING_SCALE = [
  { name: "2xs", px: 8, bar: "5%" },
  { name: "xs", px: 12, bar: "8%" },
  { name: "sm", px: 16, bar: "11%" },
  { name: "md", px: 24, bar: "17%" },
  { name: "lg", px: 32, bar: "23%" },
  { name: "xl", px: 48, bar: "34%" },
  { name: "2xl", px: 64, bar: "46%" },
  { name: "3xl", px: 96, bar: "68%" },
  { name: "4xl", px: 128, bar: "90%" },
] as const;

/* -------------------------------------------------------------------------- */
/* Contraste medido                                                            */
/* -------------------------------------------------------------------------- */

type Measurement = {
  /** Ratio en tema claro. */
  light: number;
  /** Ratio en tema oscuro, o `null` si el par no conmuta (ambos colores fijos). */
  dark: number | null;
  /** `large` = el par solo se publica como texto grande (umbrales 3:1 / 4,5:1). */
  size?: "large";
  /**
   * Con cuántos decimales se midió. Por defecto 2, que es la precisión del censo.
   * Va aquí y no en el formateador porque es una propiedad del DATO: «7,10» dice
   * que se midió a la centésima y salió cero, y «10,5» dice que se midió a la
   * décima. Dejar que `Intl` recorte el cero de 7,10 pierde esa información, y
   * rellenarlo en 10,5 inventa un decimal que nadie midió.
   */
  decimals?: 1;
};

/**
 * El censo de pares del sistema. La clave es el identificador con el que lo
 * llaman las páginas; el copy que lo describe vive en el diccionario.
 */
export const CONTRAST = {
  /** `--foreground` sobre `--background`. Anclaje de validación del método. */
  bodyText: { light: 13.79, dark: 15.32 },
  /** `--primary` como color de texto: enlaces y acento. */
  primaryText: { light: 7.47, dark: 8.36 },
  /** `--primary-foreground` sobre `--primary`: el texto de un botón sólido. */
  buttonText: { light: 7.93, dark: 8.36 },
  /** Hover del sólido, con el relleno mezclado un 12% hacia `--foreground`. */
  solidHover: { light: 8.64, dark: 8.92 },
  /** Hover del `toggle-primary` apagado: el estado con menos margen del sistema. */
  toggleHover: { light: 7.21, dark: 7.8 },
  /**
   * LOS CUATRO ATENUADOS SON UN SOLO PAR VISTO SOBRE CUATRO SUPERFICIES, y por eso
   * van juntos: `--surface-dim` recalcula el texto atenuado contra el fondo que
   * tiene debajo (D30, generalizado en P37.6565). Antes solo existía el primero, y
   * los otros tres —o no se medían, o los resolvía a mano quien se acordaba.
   */
  /** Sobre `--background`: el token tal cual, que está calibrado contra este fondo. */
  mutedForeground: { light: 7.1, dark: 7.12 },
  /**
   * Sobre `--card` y `--popover`: tarjetas, paneles y los velos que se pintan esa
   * misma superficie. Es el que faltaba — con el token sin recalcular daba 6,40 en
   * oscuro, y afectaba a todo texto atenuado dentro de una tarjeta en las seis
   * páginas.
   */
  mutedOnCard: { light: 9.14, dark: 10.32 },
  /**
   * Sobre `--muted`: la franja de contacto y la etiqueta neutra. Las dos escribían
   * esta misma fórmula por su cuenta antes de que la resolviera el token, así que
   * la cifra no se mueve: es literalmente el mismo píxel que ya se publicaba.
   */
  badgeNeutral: { light: 8.17, dark: 9.17 },
  /**
   * Sobre superficie INVERTIDA (fondo `--foreground`): el panel de tokens del
   * Design System. Se construye desde el otro extremo —`--background` mezclado
   * hacia `--foreground`—, igual que `--primary-on-inverted`.
   */
  mutedOnInverted: { light: 10.32, dark: 9.89 },
  /** Etiqueta teñida, en su peor emplazamiento de las dos (cian y morado). */
  badgeTinted: { light: 10.63, dark: 10.02 },
  /** Bolita del switch apagada: `--foreground` sobre el carril `--muted`. */
  switchKnobOff: { light: 12.47, dark: 12.04 },
  /** Hover del chrome secundario: `--foreground` sobre la pastilla `--muted`. */
  chromeHover: { light: 12.47, dark: 12.04 },
  /**
   * `--brand-purple-accent` sobre fondo invertido. Dejó de ser «solo texto grande»
   * en P37.657: el token conmuta con el tema y el par sube de 3,96/3,49 a 7,04/7,21.
   * Era la última salvedad del «todos en AAA» y la única que no se podía arreglar
   * ajustando el color — un color fijo topa en 3,71:1 contra las dos superficies
   * invertidas. El cálculo está en `globals.css`, junto al token.
   */
  purpleAccent: { light: 7.04, dark: 7.21 },
  /** Tinta sobre el pastel cian. No conmuta: los dos colores son fijos. */
  inkOnCyanSoft: { light: 10.5, dark: null, decimals: 1 },
  /** Tinta sobre el pastel morado. Tampoco conmuta. */
  inkOnPurpleSoft: { light: 8.4, dark: null, decimals: 1 },
} as const satisfies Record<string, Measurement>;

/* -------------------------------------------------------------------------- */
/* Fechas de revisión                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Cuándo se verificó por última vez lo que el censo de arriba publica. Vive
 * PEGADA a él a propósito: la cifra y la fecha de la cifra en el mismo archivo,
 * de modo que quien toca una ve la otra. Es la aplicación directa de D38.
 *
 * ES LA ÚNICA FECHA DEL CENSO. Hubo una segunda —`MEASURED_ON`, que no leía
 * nadie— y llegó a quedarse dieciséis días por detrás de esta: dos fechas para
 * la misma cosa dentro del archivo que existe para que cada cifra tenga un solo
 * sitio. CÓMO se mide lo que fecha —sobre el color que el navegador PINTA,
 * recorriendo el DOM servido y con los estados incluidos— no se cuenta aquí:
 * está en `BRAND.md` §Cómo se hace el censo de pares, y repetirlo sería
 * exactamente la regla 5 de §Cómo se escribe una regla.
 *
 * EN ISO Y NO EN PROSA, por la misma razón que las cifras se guardan como
 * `number` y no como «13,79:1»: «20 de agosto de 2026» y «20 August 2026» son el
 * mismo dato con dos formatos, y el formato lo pone `Intl.DateTimeFormat` en el
 * punto de render. Escrita como frase completa vivía DUPLICADA en los dos
 * diccionarios, que es lo que la dejó trece días diciendo el 2 de agosto.
 *
 * LO QUE NO SE HACE: derivarla de `new Date()`. Generaría una fecha que afirma
 * una verificación que no ocurrió, y eso es peor que una fecha vieja: mentiría
 * cada día en vez de solo quedarse atrás.
 */
export const LAST_A11Y_REVIEW = "2026-08-27";

/**
 * CUÁNTAS PÁGINAS tiene el sitio por idioma, derivado del registro y nunca
 * escrito.
 *
 * Existe porque la cifra se publicaba a mano y ya iba una por detrás: el copy
 * decía «AAA en las doce páginas» mientras el sitio tenía trece —la
 * decimotercera es el propio artículo, que se publicó un día después de la
 * última pasada del censo—. Y no estaba solo en el copy: `lib/routes.ts`,
 * `check-marco.ts`, `page-html-diff.ts`, `PRD-Live.md` y `README.md` decían
 * doce también, con el código contando veintiséis variantes.
 *
 * Es D38 otra vez, en su forma más simple: el valor lo tiene UN sitio, y aquí
 * ese sitio es `PAGE_SLUGS` (D72), que ya es la única fuente de qué páginas hay.
 * Añadir la catorce mueve la cifra sola.
 */
export const PAGE_COUNT = PAGE_SLUGS.length;

/**
 * CUÁNTOS GUARDIANES hay y CUÁNTOS casos malos los prueban — las dos cifras que
 * `/accesibilidad` publica en prosa sobre el arnés que la respalda.
 *
 * SELLADAS AQUÍ Y NO DERIVADAS, y la diferencia importa. `PAGE_COUNT` sale de
 * `PAGE_SLUGS` porque ese registro ya está en el bundle; el inventario de casos
 * malos vive en `scripts/`, y traérselo al navegador para contar dos números
 * enviaría a cada visitante una treintena de mutaciones de archivos que nunca va a
 * ejecutar. Así que el valor se escribe una vez aquí y **lo verifica
 * `npm run check:accesibilidad`** contra `scripts/guardianes/casos.ts`: si no
 * cuadran, CI sale rojo con las dos cifras delante.
 *
 * Es el mismo reparto que D38 —el valor en un solo sitio— con el guardián puesto
 * donde la derivación no llega. Y hacía falta: la página decía «catorce
 * comprobaciones y veintitrés errores fingidos» habiendo quince y veintisiete,
 * porque nada ataba la prosa al inventario (P50.73).
 */
export const GUARDIAN_COUNT = 20;
export const GUARDIAN_CASE_COUNT = 38;

/**
 * Sustituye `{paginas}` en el copy, como `fillDate` hace con `{date}`.
 *
 * SE QUEDA AQUÍ, aunque P50.91 se llevara la tabla de cardinales a
 * `lib/i18n/palabras.ts`: esto es una línea sobre `PAGE_COUNT`, o sea la
 * publicación de un valor de este módulo. Lo que subió a i18n es CÓMO se dice un
 * número, que no depende de ningún dato; el porqué del corte, allí.
 */
export function fillPages(text: string, locale: Locale): string {
  return text.replace(/{paginas}/g, cardinal(PAGE_COUNT, locale));
}

/**
 * Cuándo cambió por última vez la política de cookies. Constante APARTE y no la
 * de arriba: fecha lo que CAMBIÓ, no lo que se midió. Comparten mecanismo, no
 * significado, y unificarlas haría que tocar el censo moviera una fecha legal.
 */
export const LAST_COOKIES_UPDATE = "2026-08-23";

/**
 * Cuándo se publicó y cuándo se revisó por última vez «Cómo se ha creado esta
 * página» — mismo mecanismo que `LAST_A11Y_REVIEW`, fuente única para el
 * `datePublished`/`dateModified` del JSON-LD `TechArticle` (P60) y para
 * cualquier copy que necesite decirlo. `ARTICLE_PUBLISHED` no se toca.
 *
 * `ARTICLE_UPDATED` SE SUBE CUANDO EL ARTÍCULO CAMBIA DE FORMA SUSTANTIVA, y
 * desde P70.04 eso ya no hay que recordarlo: `check:articulo` sella aparte el
 * copy del artículo —los dos diccionarios y sus figuras— y sale rojo si ese
 * sello se mueve y esta constante no. La salida para lo no sustantivo es
 * `npm run articulo:sellar`, que deja el cambio a la vista en el diff.
 *
 * Hizo falta porque esta frase ya estaba escrita aquí y aun así la fecha pasó
 * DOCE COMMITS congelada en el 21 de agosto, uno de ellos con un capítulo nuevo.
 * El `ByLine` no pinta la fecha, así que no había forma humana de notarlo: solo
 * Google, y tarde.
 */
export const ARTICLE_PUBLISHED = "2026-08-21";
export const ARTICLE_UPDATED = "2026-08-29";

/** Sustituye `{date}` en el copy, como `fillRatios` hace con `{par.tema}`. */
export function fillDate(text: string, iso: string, locale: Locale): string {
  return text.replace(/{date}/g, reviewDate(iso, locale));
}

export type ContrastId = keyof typeof CONTRAST;
export type Theme = "light" | "dark";

/** Guarda para consumir un identificador que viene del diccionario. */
export function isContrastId(value: string): value is ContrastId {
  return value in CONTRAST;
}

/** Ensancha la entrada literal a `Measurement`, para poder leer el `size` opcional. */
const measurementOf = (id: ContrastId): Measurement => CONTRAST[id];

/** La cifra de un par en un tema. Un par que no conmuta rinde la misma en los dos. */
export function ratioOf(id: ContrastId, theme: Theme): number {
  const m = measurementOf(id);
  return theme === "dark" ? (m.dark ?? m.light) : m.light;
}

/**
 * El nivel WCAG que alcanza una cifra. Se deriva porque es una función del número
 * —7:1 y 4,5:1 para texto normal; 4,5:1 y 3:1 para texto grande—, no un juicio.
 * `null` cuando no llega ni a AA.
 */
export function wcagLevel(
  ratio: number,
  size?: "large",
): "AAA" | "AA" | "AA-large" | null {
  if (size === "large") {
    if (ratio >= 4.5) return "AAA";
    return ratio >= 3 ? "AA-large" : null;
  }
  if (ratio >= 7) return "AAA";
  return ratio >= 4.5 ? "AA" : null;
}

/** El nivel de un par del censo en un tema. */
export function levelOf(id: ContrastId, theme: Theme) {
  return wcagLevel(ratioOf(id, theme), measurementOf(id).size);
}

/**
 * La cifra, formateada para leerse: coma decimal en español, punto en inglés.
 * Es el motivo por el que los números vivían en el diccionario, y se resuelve
 * donde toca. Los decimales son fijos —los que dice el dato— para que «7,10» no
 * se publique como «7,1».
 */
function formatRatio(value: number, locale: Locale, decimals: number): string {
  return `${new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)}:1`;
}

/** La cifra publicable de un par del censo: valor, precisión y separador. */
export function ratioText(
  id: ContrastId,
  theme: Theme,
  locale: Locale,
): string {
  return formatRatio(
    ratioOf(id, theme),
    locale,
    measurementOf(id).decimals ?? 2,
  );
}

const RATIO_PLACEHOLDER = /\{([a-zA-Z]+)\.(light|dark)\}/g;

/**
 * Sustituye `{par.tema}` por la cifra formateada dentro de una frase del
 * diccionario — «alcanza {bodyText.light} en claro». Es para la PROSA que
 * argumenta con un valor vivo, que si no sería otra copia más del número.
 *
 * NO se aplica a las cifras HISTÓRICAS que el copy cita para contar qué se
 * arregló («se quedaba en 6,44:1»): describen un estado que ya no existe, así
 * que no pueden desincronizarse de nada. Son parte de la frase, no un dato.
 */
export function fillRatios(text: string, locale: Locale): string {
  return text.replace(RATIO_PLACEHOLDER, (match, id: string, theme: string) =>
    isContrastId(id) ? ratioText(id, theme as Theme, locale) : match,
  );
}

/* -------------------------------------------------------------------------- */
/* Muestras de color del Brand Kit                                             */
/* -------------------------------------------------------------------------- */

/**
 * Una cifra publicada bajo una muestra: de qué par del censo sale, en qué tema, y
 * con qué matiz se rotula (la clave del rótulo vive en el diccionario, porque el
 * matiz sí se traduce).
 */
type SwatchFigure = {
  ref: ContrastId;
  theme: Theme;
  /** Clave en `color.ratioLabels` del diccionario: «texto», «botón (claro)»… */
  qualifier?: string;
};

type Swatch = {
  id: string;
  /** Nombre del token, tal cual se escribe en `globals.css`. */
  token: string;
  /**
   * Cómo se pinta: **un valor, o dos cuando conmuta con el tema**.
   *
   * ERA UN STRING ÚNICO con los dos hexes pegados por «·» —"#F7F3EC · #191D21"—
   * y eso bastaba mientras el dato solo se IMPRIMÍA. Al hacerse copiable (P70.24)
   * dejó de bastar: copiar esa cadena entrega dos colores y un separador, que no
   * se puede pegar en ningún sitio. El valor que se copia lo resuelve
   * `swatchHexFor()`.
   *
   * Y EL TEXTO YA NO LO COMPONE NADIE AQUÍ. Hubo un `swatchHexText()` que los
   * pegaba con «·», y se fue con P70.30: la tarjeta tiene que rotular cada hex
   * con su tema para decir cuál se va a copiar, y eso son dos nodos, no una
   * cadena. Un helper que devuelve texto plano no puede llevar esa marca.
   *
   * Y CON ÉL SE FUE `swaps`, que era un `boolean` al lado diciendo lo mismo: en
   * las nueve muestras valía `true` exactamente cuando el hex traía dos valores.
   * Era la regla 5 de `BRAND.md` —la misma decisión escrita en dos sitios acaba
   * diciendo dos cosas— esperando a cobrarse. Ahora se deriva: `swatchSwaps()`.
   */
  hex: string | { light: string; dark: string };
  /** Fondo de la muestra y color de la «Aa» que va encima. */
  sample: string;
  sampleFg: string;
  /** Rótulo del pie de la muestra, en `color.ratioLabels`. */
  ratioLabel?: string;
  /** Cifras que se publican. Vacío = la muestra no es un par de texto. */
  figures: SwatchFigure[];
};

/**
 * La rejilla de la sección «Color» del Brand Kit. Los nombres y las notas de cada
 * muestra son copy y siguen en el diccionario; esto es lo que se puede verificar
 * contra el CSS o contra una medición.
 *
 * EL TONO DE LA PASTILLA se deriva de `swatchSwaps()` y no se escribe: cian para
 * «Conmuta», neutro para «Fijo». Decidido el 2026-08-09 que ahí el cian es
 * correcto —cian = medición o comportamiento de un token; morado = cosa de la
 * marca—, así que «Split/Flat» de la tabla del logo se queda en morado aunque
 * también sea un binario: no hacen el mismo papel (`BRAND.md` §Etiquetas).
 */
export const BRAND_SWATCHES: readonly Swatch[] = [
  {
    id: "background",
    token: "--background",
    hex: { light: "#F7F3EC", dark: "#191D21" },
    sample: "var(--background)",
    sampleFg: "var(--foreground)",
    ratioLabel: "inkOver",
    figures: [{ ref: "bodyText", theme: "light" }],
  },
  {
    id: "foreground",
    token: "--foreground",
    hex: { light: "#21262B", dark: "#F7F3EC" },
    sample: "var(--foreground)",
    sampleFg: "var(--background)",
    ratioLabel: "bodyText",
    figures: [{ ref: "bodyText", theme: "light" }],
  },
  {
    id: "primary",
    token: "--primary · --brand-cyan",
    hex: { light: "#005859", dark: "#3FC9C4" },
    sample: "var(--primary)",
    sampleFg: "var(--primary-foreground)",
    figures: [
      { ref: "primaryText", theme: "light", qualifier: "asText" },
      { ref: "buttonText", theme: "light", qualifier: "asButtonLight" },
      { ref: "primaryText", theme: "dark", qualifier: "inDark" },
    ],
  },
  {
    id: "purple",
    token: "--brand-purple",
    hex: "#9B87F5",
    sample: "var(--brand-purple)",
    sampleFg: "#21262B",
    ratioLabel: "decorative",
    figures: [],
  },
  {
    id: "purpleAccent",
    token: "--brand-purple-accent",
    hex: { light: "#B7A3FF", dark: "#583DA6" },
    sample: "var(--brand-purple-accent)",
    // El «Aa» se pinta con `--foreground`, que es LA SUPERFICIE donde este token
    // vive de verdad (la banda invertida usa `--foreground` de fondo). Así la
    // muestra enseña exactamente el par que la tabla publica —7,04 y 7,21— en vez
    // de un par inventado para la muestra: antes iba fijo a `#F7F3EC` y daba 3,49,
    // que era uno de los pares bajo AAA que encontró el censo de P37.657.
    sampleFg: "var(--foreground)",
    ratioLabel: "onInverted",
    figures: [
      { ref: "purpleAccent", theme: "light", qualifier: "inLight" },
      { ref: "purpleAccent", theme: "dark", qualifier: "inDark" },
    ],
  },
  {
    id: "cyanSplit",
    token: "--brand-cyan-split",
    hex: "#16BDBD",
    sample: "var(--brand-cyan-split)",
    sampleFg: "#21262B",
    ratioLabel: "logoOnly",
    figures: [],
  },
  {
    id: "purpleSplit",
    token: "--brand-purple-split",
    hex: "#9B87F5",
    sample: "var(--brand-purple-split)",
    sampleFg: "#21262B",
    ratioLabel: "logoOnly",
    figures: [],
  },
  {
    id: "cyanSoft",
    token: "--brand-cyan-soft",
    hex: "#A7E1DE",
    sample: "var(--brand-cyan-soft)",
    sampleFg: "#21262B",
    ratioLabel: "inkOver",
    figures: [{ ref: "inkOnCyanSoft", theme: "light" }],
  },
  {
    id: "purpleSoft",
    token: "--brand-purple-soft",
    hex: "#C6B9F0",
    sample: "var(--brand-purple-soft)",
    sampleFg: "#21262B",
    ratioLabel: "inkOver",
    figures: [{ ref: "inkOnPurpleSoft", theme: "light" }],
  },
];

/**
 * `true` si el token conmuta con el tema — es decir, si su hex trae dos valores.
 * Se deriva en vez de declararse: ver la nota de `Swatch.hex`.
 */
export const swatchSwaps = (s: Swatch): boolean => typeof s.hex !== "string";

/**
 * El hex que se COPIA: **uno solo, el del tema que se está viendo**.
 *
 * Es la diferencia entre imprimir y copiar, y por eso son dos funciones. Un pie
 * de muestra que dice «#F7F3EC · #191D21» informa —el token vale esto aquí y
 * aquello allá—; ese mismo string en el portapapeles no se puede pegar en ningún
 * sitio. Quien copia quiere el color que está viendo.
 */
export const swatchHexFor = (s: Swatch, theme: Theme): string =>
  typeof s.hex === "string" ? s.hex : s.hex[theme];

/**
 * El pie de una muestra, ya compuesto: rótulo · cifras con su matiz · nivel WCAG.
 * El nivel sale de la PEOR de las cifras publicadas, que es la que manda, y se
 * omite cuando la muestra no publica ninguna (los splits y el morado decorativo).
 */
export function swatchRatioParts(
  swatch: Swatch,
  locale: Locale,
  label: (key: string) => string,
): string[] {
  const parts: string[] = [];
  if (swatch.ratioLabel) parts.push(label(swatch.ratioLabel));

  for (const f of swatch.figures) {
    const figure = ratioText(f.ref, f.theme, locale);
    parts.push(f.qualifier ? `${figure} ${label(f.qualifier)}` : figure);
  }

  const worst = swatch.figures.reduce<number | null>(
    (min, f) => Math.min(min ?? Infinity, ratioOf(f.ref, f.theme)),
    null,
  );
  if (worst !== null) {
    const size = swatch.figures.some(
      (f) => measurementOf(f.ref).size === "large",
    )
      ? ("large" as const)
      : undefined;
    const level = wcagLevel(worst, size);
    if (level) parts.push(level);
  }

  return parts;
}
