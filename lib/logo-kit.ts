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
 * TODO EL KIT SE NOMBRA POR TINTA (2026-08-28, P50.96). Hasta hoy los SVG llevaban
 * el sufijo del TEMA (`-claro` / `-oscuro`) y los PNG el de la TINTA
 * (`-tintaOscura` / `-tintaClara`), y las dos convenciones eran OPUESTAS:
 * `simbolo-split-claro.svg` llevaba tinta oscura, porque era el que se pinta sobre
 * fondo claro. El cruce estaba encapsulado en `svgDe()`/`pngDe()` —así que la
 * página nunca lo expuso— pero el `LEEME.txt` del ZIP tenía que dedicarle doce
 * líneas en dos idiomas: era una convención que mentía sobre sí misma justo donde
 * alguien la iba a leer sin las dos funciones delante.
 *
 * GANA LA TINTA porque es una propiedad DEL ARCHIVO; «claro/oscuro» es una
 * propiedad del CONTEXTO donde se coloca, y por eso se invertía. Es el mismo
 * argumento que ya estaba escrito en el generador para los PNG: un asset
 * transparente se pone sobre el fondo que sea, así que el fondo no lo describe.
 *
 * LOS FAVICON SE QUEDAN EN `-claro` / `-oscuro`, y no es una excepción olvidada:
 * ahí el sufijo no nombra un fondo sino el `prefers-color-scheme` con el que el
 * navegador los elige (`app/[lang]/layout.tsx`). No los coloca nadie, así que el
 * nombre que sirve es el de la consulta que los selecciona.
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
 * El nombre de archivo de una pieza en la tinta pedida, sin carpeta ni extensión.
 * En los mono no hay sufijo: su tinta ya está en el nombre.
 *
 * Una sola función para las dos familias es lo que compró el renombrado: antes
 * había dos, y traducían la misma tinta a dos sufijos opuestos.
 */
function nombreDe(pieza: Pieza, tinta: Tinta): string {
  if (!pieza.dosTintas) return pieza.base;
  return `${pieza.base}-${tinta === "oscura" ? "tintaOscura" : "tintaClara"}`;
}

/** El SVG de una pieza en la tinta pedida. */
export function svgDe(pieza: Pieza, tinta: Tinta = TINTA_SUELTA): string {
  return `/logo-kit/svg/${nombreDe(pieza, tinta)}.svg`;
}

/** El PNG de una pieza en un tamaño y una tinta. */
export function pngDe(
  pieza: Pieza,
  tamano: number,
  tinta: Tinta = TINTA_SUELTA,
): string {
  return `/logo-kit/png/${nombreDe(pieza, tinta)}-${tamano}.png`;
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
 * para los dos locales.
 *
 * SU SECCIÓN DE NOMBRES ENCOGIÓ A LA MITAD cuando los SVG pasaron a nombrarse por
 * tinta (P50.96): antes tenía que enseñar dos convenciones opuestas y avisar de que
 * se leían al revés la una de la otra. La documentación que sobra es la medida de
 * lo que costaba la convención que mentía.
 */
export function leemeDelKit(numeroDeArchivos: number): string {
  return [
    "FRANCISCO LOPEZ / KIT DE MARCA",
    "franciscolopez.es/brand-kit",
    "",
    `${numeroDeArchivos} archivos.`,
    "",
    "SOBRE LOS NOMBRES DE ARCHIVO (ES)",
    "  Todo lleva el sufijo de su propia TINTA, SVG y PNG igual:",
    "",
    "    *-tintaOscura*  tinta oscura, para fondos claros",
    "    *-tintaClara*   tinta clara, para fondos oscuros",
    "",
    "  Los archivos mono (simbolo-mono-negro, simbolo-mono-blanco, lockup-mono-*)",
    "  son de una sola tinta y la llevan en el nombre.",
    "",
    "  Los favicon van aparte, en -claro / -oscuro: ahi el sufijo no es la tinta",
    "  sino el tema del navegador con el que se eligen.",
    "",
    "ABOUT THE FILE NAMES (EN)",
    "  Everything is named after its own INK, SVG and PNG alike:",
    "",
    "    *-tintaOscura*  dark ink, for light backgrounds",
    "    *-tintaClara*   light ink, for dark backgrounds",
    "",
    "  Mono files (simbolo-mono-negro, simbolo-mono-blanco, lockup-mono-*) come in",
    "  a single ink and carry it in the name.",
    "",
    "  Favicons are the exception, in -claro / -oscuro: there the suffix is not the",
    "  ink but the browser theme they are picked by.",
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

/**
 * La MEDIDA que el nombre de un binario promete, para que un guardián pueda abrir
 * el archivo y comprobarla. `null` si la ruta no es un binario del kit.
 *
 * EL NÚMERO DEL NOMBRE NO SIGNIFICA LO MISMO EN LAS TRES FAMILIAS, y esa es toda
 * la razón de que esto exista en vez de comparar `ancho === alto === N`:
 *
 *   · El **símbolo** se dimensiona por ALTO (`simbolo-…-512.png` mide 512 de alto y
 *     425 de ancho), que es la medida con la que `BRAND.md` expresa sus reglas.
 *   · El **lockup** por ANCHO, su dimensión natural: a 512 de alto mediría 3400.
 *   · El **favicon** es cuadrado, porque el formato lo exige.
 *
 * Está aquí y no en el guardián porque es una propiedad del REGISTRO —la misma que
 * `scripts/logo-kit/README.md` §Dimensionado explica en prosa—, y porque escrita en
 * el check se quedaría atrás el día que entre una cuarta familia.
 */
export type Medida = { eje: "alto" | "ancho" | "cuadrado"; px: number };

export function medidaDeclarada(ruta: string): Medida | null {
  const px = Number(ruta.match(/-(\d+)\.png$/)?.[1]);
  if (!px) return null;
  if (ruta.startsWith("/logo-kit/favicon/")) return { eje: "cuadrado", px };
  if (ruta.startsWith("/logo-kit/png/simbolo-")) return { eje: "alto", px };
  if (ruta.startsWith("/logo-kit/png/lockup-")) return { eje: "ancho", px };
  return null;
}
