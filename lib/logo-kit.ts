/**
 * Qué hay en el kit de marca, y qué ofrece la página suelto — `lib/logo-kit.ts`.
 *
 * ES ESTRUCTURA, NO COPY. Aquí viven las rutas, los tamaños y qué pieza conmuta de
 * tinta; los nombres y las frases viven en el diccionario, como todo lo demás. La
 * frase «En el kit: PNG de 1024, 512 y 256 px y las dos tintas» se COMPONE en el
 * punto de uso con la plantilla del diccionario y los números de aquí, en vez de
 * escribirse a mano en dos idiomas: una lista de formatos escrita en el copy se
 * desincroniza del disco sin que nada falle, que es el modo de fallo que este repo
 * lleva seis veces documentado.
 *
 * EL REPARTO QUE ORDENA LA PÁGINA (P70.27): la tarjeta da la pieza CANÓNICA, el kit
 * da las variaciones. Un SVG suelto por tarjeta; los tres tamaños de PNG y la
 * segunda tinta van dentro del ZIP. Hasta el 2026-08-26 la página ofrecía las 49
 * anclas sueltas y **20 de ellas estaban en `display:none`**, porque la tinta la
 * elegía el tema del sitio: para bajar la tinta oscura estando en tema oscuro había
 * que cambiar el tema de la web, y nada lo decía. Ahora la tinta del suelto se
 * anuncia y el resto está en el kit.
 *
 * EL CRUCE DE NOMBRES ESTÁ ENCAPSULADO AQUÍ. En disco los SVG se nombran por TEMA
 * (`-claro` / `-oscuro`) y los PNG por TINTA (`tintaOscura` / `tintaClara`), y son
 * opuestos: `simbolo-split-claro.svg` lleva tinta OSCURA (#21262B). La página habla
 * siempre de tinta, que es lo que se elige; la traducción a nombre de archivo no
 * sale de estas dos funciones. El renombrado de los assets sigue pendiente.
 */

/** Dónde viven los assets, relativo a la raíz del repo. */
export const RAIZ_KIT = "public/logo-kit";

/** Nombre del ZIP y de su carpeta raíz al descomprimir. */
export const CARPETA_KIT = "francisco-lopez-brand-kit";

/** La ruta que descarga el kit completo. La sirve `app/api/kit/route.ts`. */
export const HREF_KIT = "/api/kit";

export type Tinta = "oscura" | "clara";

/** Qué se pinta en el marco de previsualización de cada tarjeta. */
export type Preview = "split" | "flat" | "mono-negro" | "mono-blanco";

export type Pieza = {
  /** Coincide con la clave de su copy en el diccionario. */
  id: string;
  preview: Preview;
  /**
   * Si la previsualización lleva el wordmark al lado del glifo. No sale de
   * `preview` porque el símbolo split y el lockup split se DIBUJAN igual y lo que
   * cambia es si va acompañado.
   */
  esLockup: boolean;
  /** Base del nombre de archivo en `public/logo-kit/`. */
  base: string;
  /** `false` en los mono, que son de una sola tinta. */
  dosTintas: boolean;
  /** Los tamaños de PNG que existen, y que van dentro del kit. */
  pngs: readonly number[];
};

/** La tinta que se ofrece suelta. Se ANUNCIA en la tarjeta, no se adivina. */
export const TINTA_SUELTA: Tinta = "oscura";

const PNGS = [1024, 512, 256] as const;

export const PIEZAS: readonly Pieza[] = [
  {
    id: "symSplit",
    preview: "split",
    esLockup: false,
    base: "simbolo-split",
    dosTintas: true,
    pngs: PNGS,
  },
  {
    id: "symPlano",
    preview: "flat",
    esLockup: false,
    base: "simbolo-plano",
    dosTintas: true,
    pngs: PNGS,
  },
  {
    id: "symMonoNegro",
    preview: "mono-negro",
    esLockup: false,
    base: "simbolo-mono-negro",
    dosTintas: false,
    pngs: PNGS,
  },
  {
    id: "symMonoBlanco",
    preview: "mono-blanco",
    esLockup: false,
    base: "simbolo-mono-blanco",
    dosTintas: false,
    pngs: PNGS,
  },
  {
    id: "lockSplit",
    preview: "split",
    esLockup: true,
    base: "lockup-split",
    dosTintas: true,
    pngs: PNGS,
  },
  {
    id: "lockPlano",
    preview: "flat",
    esLockup: true,
    base: "lockup-plano",
    dosTintas: true,
    pngs: PNGS,
  },
];

/** Tamaños de PNG del favicon. El `.ico` es el que se ofrece suelto. */
export const FAVICON_PNGS = [32, 16] as const;
export const HREF_FAVICON_ICO = "/logo-kit/favicon/favicon.ico";

/**
 * El SVG de una pieza en la tinta pedida. En los mono no hay sufijo: su tinta ya
 * está en el nombre.
 */
export function svgDe(pieza: Pieza, tinta: Tinta = TINTA_SUELTA): string {
  if (!pieza.dosTintas) return `/logo-kit/svg/${pieza.base}.svg`;
  return `/logo-kit/svg/${pieza.base}-${tinta === "oscura" ? "claro" : "oscuro"}.svg`;
}

/** El PNG de una pieza en un tamaño y una tinta. */
export function pngDe(
  pieza: Pieza,
  tamano: number,
  tinta: Tinta = TINTA_SUELTA,
): string {
  if (!pieza.dosTintas) return `/logo-kit/png/${pieza.base}-${tamano}.png`;
  const sufijo = tinta === "oscura" ? "tintaOscura" : "tintaClara";
  return `/logo-kit/png/${pieza.base}-${sufijo}-${tamano}.png`;
}

/**
 * Toda ruta que la PÁGINA ofrece o referencia, para que un guardián pueda
 * contrastarla contra el disco. No incluye lo que solo va dentro del ZIP.
 */
export function rutasPublicadas(): string[] {
  const rutas = [HREF_FAVICON_ICO];
  for (const p of PIEZAS) {
    rutas.push(svgDe(p, "oscura"));
    if (p.dosTintas) rutas.push(svgDe(p, "clara"));
    for (const t of p.pngs) {
      rutas.push(pngDe(p, t, "oscura"));
      if (p.dosTintas) rutas.push(pngDe(p, t, "clara"));
    }
  }
  for (const t of FAVICON_PNGS) {
    rutas.push(`/logo-kit/favicon/favicon-claro-${t}.png`);
    rutas.push(`/logo-kit/favicon/favicon-oscuro-${t}.png`);
  }
  return rutas;
}

/**
 * Lo que está en el kit y la página NO documenta, declarado a propósito para que un
 * archivo huérfano no pueda colarse en silencio. Si algo aparece en
 * `public/logo-kit/` que no esté publicado ni aquí, `check:kit` sale rojo.
 *
 * Los `lockup-mono-*` se generaron con los demás y nunca tuvieron tarjeta; el par de
 * favicon de 48px duplica los `/favicon-*-48.png` de la raíz que usa el layout. Se
 * decidió el 2026-08-26 que viajan en el kit sin tarjeta propia.
 */
export const SOLO_EN_EL_KIT: readonly string[] = [
  "/logo-kit/svg/lockup-mono-negro.svg",
  "/logo-kit/svg/lockup-mono-blanco.svg",
  "/logo-kit/png/lockup-mono-negro-1024.png",
  "/logo-kit/png/lockup-mono-negro-512.png",
  "/logo-kit/png/lockup-mono-negro-256.png",
  "/logo-kit/png/lockup-mono-blanco-1024.png",
  "/logo-kit/png/lockup-mono-blanco-512.png",
  "/logo-kit/png/lockup-mono-blanco-256.png",
  "/logo-kit/favicon/favicon-claro-48.png",
  "/logo-kit/favicon/favicon-oscuro-48.png",
];

/**
 * El LEEME que viaja dentro del ZIP. Va en los dos idiomas porque el kit es UNO
 * para los dos locales, y explica el cruce de nombres, que es lo primero con lo que
 * tropieza quien descomprime.
 */
export function leemeDelKit(numeroDeArchivos: number): string {
  return [
    "FRANCISCO LOPEZ / KIT DE MARCA",
    "franciscolopez.es/brand-kit",
    "",
    `${numeroDeArchivos} archivos.`,
    "",
    "SOBRE LOS NOMBRES DE ARCHIVO (ES)",
    "  Los SVG llevan el sufijo del FONDO para el que sirven y los PNG el de su",
    "  TINTA, asi que se leen al reves el uno del otro:",
    "",
    "    *-claro.svg          tinta oscura, para fondos claros",
    "    *-oscuro.svg         tinta clara, para fondos oscuros",
    "    *-tintaOscura-*.png  tinta oscura, para fondos claros",
    "    *-tintaClara-*.png   tinta clara, para fondos oscuros",
    "",
    "  Los archivos mono (simbolo-mono-negro, simbolo-mono-blanco, lockup-mono-*)",
    "  son de una sola tinta y la llevan en el nombre.",
    "",
    "ABOUT THE FILE NAMES (EN)",
    "  SVG files are named after the BACKGROUND they are meant for, PNG files after",
    "  their own INK, so the two read as opposites:",
    "",
    "    *-claro.svg          dark ink, for light backgrounds",
    "    *-oscuro.svg         light ink, for dark backgrounds",
    "    *-tintaOscura-*.png  dark ink, for light backgrounds",
    "    *-tintaClara-*.png   light ink, for dark backgrounds",
    "",
    "USO / USAGE",
    "  El split es la firma de marca y solo se usa a 48px o mas. Por debajo, el",
    "  plano. Las reglas completas estan en franciscolopez.es/brand-kit",
    "",
    "  The split mark is the brand signature and is only used at 48px or above.",
    "  Below that, use the flat one. Full rules at franciscolopez.es/brand-kit",
    "",
  ].join("\n");
}
