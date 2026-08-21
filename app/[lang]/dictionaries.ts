import "server-only";

import type { Locale } from "@/lib/i18n/config";

import type esCommon from "./dictionaries/es/common.json";
import type esHome from "./dictionaries/es/home.json";
import type esSobreMi from "./dictionaries/es/sobre-mi.json";
import type esBrandKit from "./dictionaries/es/brand-kit.json";
import type esDesignSystem from "./dictionaries/es/design-system.json";
import type esAccesibilidad from "./dictionaries/es/accesibilidad.json";
import type esCookies from "./dictionaries/es/cookies.json";
import type esComoSeHaCreado from "./dictionaries/es/como-se-ha-creado.json";
import type esTrayectoriaComun from "./dictionaries/es/trayectoria/comun.json";
import type esTrayectoriaIndice from "./dictionaries/es/trayectoria/indice.json";
import type { ExperienceSlug } from "@/content/experiences";

// Diccionario i18n, PARTIDO POR PÁGINA (P46). Era un único JSON de 1.580 líneas y
// 76 KB por locale del que cada página cargaba el 100% para usar su trozo.
//
// EL REPARTO, MEDIDO ANTES DE PARTIR: `designSystem` era el 44% del archivo y
// `brandKit` el 17% — o sea que **el 61% del diccionario eran las dos páginas
// showcase**, las que menos visitas tienen. La home usaba ~9 KB de 59,5.
//
// LO QUE ESTO NO ARREGLA, Y CONVIENE NO CREÉRSELO: nada de esto llegaba al
// cliente. El módulo es `server-only` y a los componentes de cliente solo se les
// pasa la rama que renderizan. Además, desde que las seis páginas se
// prerenderizan (D25), parsear de más es un coste de BUILD. Las razones que
// quedan, que son las buenas: el deep-dive añade seis páginas de contenido —cinco
// experiencias y su índice; PICKASO se quedó sin página el 2026-08-16, ver
// `content/experiences.ts`—, y editar copy en un archivo de 1.580 líneas es una
// invitación al conflicto.
//
// LA RESTRICCIÓN QUE NO SE NEGOCIA: la derivación de tipos. Los tipos salen del
// JSON **español** y los cargadores se anotan con ese tipo, así que si `en`
// pierde una clave que `es` tiene, **el build falla**. Es lo que impide que un
// texto sin traducir llegue a producción (D11), y partir el diccionario sin
// conservarlo habría sido un retroceso. El guardián se comprobó borrando una
// clave a mano.
//
// LA FORMA es la parte que hace que esto no se note fuera de aquí: los archivos
// de página guardan su rama DESENVUELTA (`brand-kit.json` ES el objeto
// `brandKit`), y `Dictionary` se recompone aquí como la intersección de todas.
// Así los 25 componentes que se tipan con `Dictionary["designSystem"]["tablas"]`
// no cambian ni una línea: lo que se parte es la CARGA, no la forma.

export type Common = typeof esCommon;
export type HomeDict = typeof esHome;
export type SobreMiDict = typeof esSobreMi;
export type BrandKitDict = typeof esBrandKit;
export type DesignSystemDict = typeof esDesignSystem;
export type AccesibilidadDict = typeof esAccesibilidad;
export type CookiesDict = typeof esCookies;
export type ComoSeHaCreadoDict = typeof esComoSeHaCreado;

/**
 * La forma completa, recompuesta. No la carga nadie de una pieza —cada página
 * pide lo suyo—: existe para que los componentes sigan pudiendo tiparse contra
 * la rama que reciben.
 */
export type Dictionary = Common &
  HomeDict & {
    sobreMi: SobreMiDict;
    brandKit: BrandKitDict;
    designSystem: DesignSystemDict;
    accesibilidad: AccesibilidadDict;
    cookies: CookiesDict;
    comoSeHaCreado: ComoSeHaCreadoDict;
  };

/**
 * Fabrica el getter de una rama. El tipo se pasa EXPLÍCITO (`cargador<Common>`)
 * y no se infiere: inferirlo de los dos cargadores daría la unión de ambos, y
 * una unión no falla cuando a `en` le falta una clave — que es justo lo único
 * que este módulo tiene que garantizar.
 */
const cargador =
  <T>(ramas: Record<Locale, () => Promise<T>>) =>
  (lang: Locale): Promise<T> =>
    ramas[lang]();

/** Lo que necesita TODA página: metadata, nav, footer, breadcrumb, related, consentimiento y contacto. */
export const getCommon = cargador<Common>({
  es: () => import("./dictionaries/es/common.json").then((m) => m.default),
  en: () => import("./dictionaries/en/common.json").then((m) => m.default),
});

export const getHome = cargador<HomeDict>({
  es: () => import("./dictionaries/es/home.json").then((m) => m.default),
  en: () => import("./dictionaries/en/home.json").then((m) => m.default),
});

export const getSobreMi = cargador<SobreMiDict>({
  es: () => import("./dictionaries/es/sobre-mi.json").then((m) => m.default),
  en: () => import("./dictionaries/en/sobre-mi.json").then((m) => m.default),
});

export const getBrandKit = cargador<BrandKitDict>({
  es: () => import("./dictionaries/es/brand-kit.json").then((m) => m.default),
  en: () => import("./dictionaries/en/brand-kit.json").then((m) => m.default),
});

export const getDesignSystem = cargador<DesignSystemDict>({
  es: () =>
    import("./dictionaries/es/design-system.json").then((m) => m.default),
  en: () =>
    import("./dictionaries/en/design-system.json").then((m) => m.default),
});

export const getAccesibilidad = cargador<AccesibilidadDict>({
  es: () =>
    import("./dictionaries/es/accesibilidad.json").then((m) => m.default),
  en: () =>
    import("./dictionaries/en/accesibilidad.json").then((m) => m.default),
});

export const getCookies = cargador<CookiesDict>({
  es: () => import("./dictionaries/es/cookies.json").then((m) => m.default),
  en: () => import("./dictionaries/en/cookies.json").then((m) => m.default),
});

export const getComoSeHaCreado = cargador<ComoSeHaCreadoDict>({
  es: () =>
    import("./dictionaries/es/como-se-ha-creado.json").then((m) => m.default),
  en: () =>
    import("./dictionaries/en/como-se-ha-creado.json").then((m) => m.default),
});

/** Lo que comparten las cinco experiencias y su índice: rótulos, no contenido. */
export type TrayectoriaComunDict = typeof esTrayectoriaComun;

export const getTrayectoriaComun = cargador<TrayectoriaComunDict>({
  es: () =>
    import("./dictionaries/es/trayectoria/comun.json").then((m) => m.default),
  en: () =>
    import("./dictionaries/en/trayectoria/comun.json").then((m) => m.default),
});

/**
 * El copy PROPIO del índice: su metadata, su cabecera y el pie del CV. Rama
 * aparte de `comun` y no una clave más dentro de él, por lo mismo que el
 * diccionario está partido por página (D48): `comun` son los rótulos que las
 * cinco experiencias comparten, y esto es el contenido de UNA página.
 *
 * LO QUE NO ESTÁ AQUÍ ES LA MITAD DE LA PÁGINA. Las cinco tarjetas no llevan
 * copy propio: empresa y sector salen del registro por experiencia y la
 * afirmación es el `title` del deep-dive —el h1 de su página, literalmente el
 * mismo string—. Escribir aquí un resumen de cada una habría creado la CUARTA
 * longitud de lo mismo, que es justo lo que D57/D58 acaban de retirar.
 */
export type TrayectoriaIndiceDict = typeof esTrayectoriaIndice;

export const getTrayectoriaIndice = cargador<TrayectoriaIndiceDict>({
  es: () =>
    import("./dictionaries/es/trayectoria/indice.json").then((m) => m.default),
  en: () =>
    import("./dictionaries/en/trayectoria/indice.json").then((m) => m.default),
});

/**
 * La forma de UNA experiencia del deep-dive (P48). Es el único diccionario que se
 * declara como interfaz en vez de derivarse con `typeof` del JSON español, y por
 * una razón concreta: aquí no hay un archivo por página sino **cinco archivos que
 * tienen que compartir forma**, porque una sola plantilla los renderiza. Con
 * `typeof emendu` la forma la fijaría la primera experiencia que se escribió, y
 * las otras cuatro cuadrarían por casualidad.
 *
 * Sigue haciendo el trabajo que el diccionario tiene que hacer: los cargadores se
 * anotan con este tipo, así que **si a `en` le falta una clave que `es` tiene, el
 * build falla** (D11) — lo mismo que garantiza `cargador`, por el mismo mecanismo.
 *
 * `caso` es OPCIONAL a propósito: es la cuarta de las cinco secciones y solo
 * aparece «donde hay historia de verdad» (PRD-Historical §42). Freepik no lo
 * lleva, y esa ausencia es del formato, no un hueco por rellenar.
 */
export interface DeepDiveDict {
  meta: { title: string; description: string };
  crumb: string;
  // EL RÓTULO DE LA APERTURA —«empresa · sector»— YA NO SE ESCRIBE AQUÍ (P50.36b).
  // Era la sexta copia del sector: el registro por experiencia ya lo tiene (D58) y
  // esta cadena lo repetía pegado al nombre de la empresa, en los dos idiomas. Diez
  // strings que nada ataba, y el drift se cobró su pieza — el de KUOTIP se quedó en
  // «KUOTIP · Customer Reviews» sin el tipo de negocio que llevan los otros cuatro,
  // y salía así en la página Y en su tarjeta OG mientras el índice, que lo compone
  // desde el registro, decía otra cosa.
  //
  // Ahora lo componen sus dos consumidores desde `company` + `sector`. Se comprobó
  // antes de borrarlo que las diez cadenas eran EXACTAMENTE `${company} · ${sector}`,
  // así que la derivación no cambia nada salvo lo que estaba mal.
  /** El h1: la afirmación de la experiencia, no el nombre de la empresa. */
  title: string;
  /**
   * SOLO EL TAMAÑO. Los otros cuatro datos —rol, periodo, sector y reporting— se
   * pintan también en Trayectoria o en el CV, así que escribirlos aquí era una
   * copia, y una que ya había divergido cuatro veces: KUOTIP terminaba en
   * noviembre según la home y en diciembre según esta página. Salen del registro
   * por experiencia (P48.55). `tamano` se queda porque no lo publica nadie más.
   */
  datos: { tamano: string };
  /**
   * Solo el TÍTULO. Los bullets viven en `content/experience-copy/`, donde cada
   * uno está emparejado con su versión corta del CV: son el mismo hecho a dos
   * longitudes y la regla 1 del formato pide que se muevan juntos (P48.5).
   * Mientras vivieron aquí, siete cifras existían solo en esta versión y una
   * solo en la del CV, y nada en el build podía verlo.
   */
  minuto: { title: string };
  historia: {
    title: string;
    bloques: {
      title: string;
      paras: string[];
      /**
       * Captura de producto que acompaña al bloque, si la hay. OPCIONAL como
       * `caso`: una experiencia enseña interfaz cuando la tiene y cuando el
       * bloque habla de ella, no por rellenar el hueco.
       *
       * `src` no es copy y aun así vive aquí, igual que el `svg` del artefacto:
       * es el mismo archivo en los dos idiomas, y sacarlo a `content/` obligaría
       * a un segundo registro para una sola imagen. Lo que SÍ se traduce es el
       * `alt`, que es lo que lee quien no ve la captura (punto 8 del checklist).
       */
      imagen?: { src: string; alt: string };
      /**
       * Vídeo de terceros incrustado, si el bloque lo lleva. Hoy solo INDYA (la
       * entrada de Pau Gasol en el accionariado).
       *
       * SE ADMITE PORQUE ES PRUEBA, NO RESUMEN — y esa es la distinción entera de
       * §43. Un vídeo-resumen del deep-dive *sustituye* la lectura y compite con
       * «En un minuto», que es la pieza diseñada para ese trabajo exacto; un clip
       * de terceros dentro de la narración hace lo contrario: es evidencia, dura
       * segundos y no sustituye a nada. Lo que decide no es el formato, es qué
       * trabajo hace el vídeo en la página.
       *
       * `id` y `poster` no se traducen (mismo archivo y mismo vídeo en los dos
       * idiomas); `title`, `playLabel` y `nota` sí, porque es lo que se lee y lo
       * que oye un lector de pantalla.
       */
      video?: {
        /** Id de YouTube. */
        id: string;
        /** Póster auto-hospedado en `public/img/`, nunca `i.ytimg.com`. */
        poster: string;
        title: string;
        playLabel: string;
        /** Pie que avisa de qué pasa al pulsar: es lo que hace informado el clic. */
        nota: string;
      };
      /**
       * Los párrafos que salen del grid y corren a ANCHO DE PÁGINA por debajo de
       * la captura o del vídeo. El corte es explícito y no «el último párrafo», porque no es
       * una regla de maquetación sino de contenido: `paras` es lo que la imagen
       * ilustra —las tres piezas— y `cierre` es lo que viene DESPUÉS de haberlas
       * enumerado. Sin ese corte, la imagen se centra contra un texto que ya no
       * habla de ella y el bloque queda descuadrado.
       *
       * Mismo vocabulario que `caso.cierre`, que hace exactamente esto mismo
       * detrás del artefacto y de los resultados.
       */
      cierre?: string[];
    }[];
  };
  caso?: {
    title: string;
    paras: string[];
    /**
     * El artefacto de la página, si lo tiene. La política del deep-dive pide que
     * sea REAL —no una ilustración del método—, uno por página como techo, sin
     * proveedores ni importes. El DIBUJO vive en `content/artefactos/`, generado
     * desde su `.mmd`: aquí solo lo que es copy, que es lo único que se traduce.
     */
    artefacto?: {
      title: string;
      caption: string;
      /** La secuencia contada en prosa, para quien no ve el dibujo. */
      description: string;
      /**
       * Nombre del archivo en `content/artefactos/` (sin extensión). El dibujo
       * NO vive en el diccionario: es un documento real, renderizado desde su
       * `.mmd`, y aquí solo va lo que es copy.
       *
       * Y POR ESO NO SE TRADUCE. El artefacto se enseña **como se entregó**, en
       * el idioma en que se escribió: traducir un documento real para la versión
       * inglesa lo convertiría en una recreación, que es justo lo que la
       * política de artefactos prohíbe. Lo que sí va en los dos idiomas es su
       * título, su pie y la alternativa en prosa.
       */
      svg: string;
    };
    /**
     * Las cifras del caso, si las tiene sueltas. Opcional por lo mismo que
     * `caso`: hay casos cuyo resultado se cuenta en prosa porque la cifra sola no
     * dice nada sin lo que la rodea. Forzar una tabla ahí sería rellenar.
     */
    resultados?: {
      title: string;
      items: { value: string; desc: string }[];
    };
    cierre: string[];
  };
  aprendizajes: { title: string; items: { title: string; text: string }[] };
}

/**
 * El registro va tecleado por `ExperienceSlug` —la unión derivada de
 * `content/experiences.ts` (D44)—, así que no se puede registrar el diccionario
 * de una experiencia que no existe.
 *
 * YA NO ES `Partial`: nació siéndolo, mientras solo estaban escritas Emendu y
 * Freepik —la más larga con caso y la más corta sin él, elegidas para cubrir el
 * rango—, y dejó de serlo al entrar las cinco. Con el `Record` completo, añadir
 * una experiencia con `slug` a `content/experiences.ts` y olvidar su diccionario
 * **rompe el build**, que es lo que impide que la sexta se quede fuera del
 * sitemap y de `generateStaticParams` sin que nadie se entere.
 */
const experienceDicts: Record<
  ExperienceSlug,
  Record<Locale, () => Promise<DeepDiveDict>>
> = {
  emendu: {
    es: () =>
      import("./dictionaries/es/trayectoria/emendu.json").then(
        (m) => m.default,
      ),
    en: () =>
      import("./dictionaries/en/trayectoria/emendu.json").then(
        (m) => m.default,
      ),
  },
  kuotip: {
    es: () =>
      import("./dictionaries/es/trayectoria/kuotip.json").then(
        (m) => m.default,
      ),
    en: () =>
      import("./dictionaries/en/trayectoria/kuotip.json").then(
        (m) => m.default,
      ),
  },
  indya: {
    es: () =>
      import("./dictionaries/es/trayectoria/indya.json").then((m) => m.default),
    en: () =>
      import("./dictionaries/en/trayectoria/indya.json").then((m) => m.default),
  },
  thetool: {
    es: () =>
      import("./dictionaries/es/trayectoria/thetool.json").then(
        (m) => m.default,
      ),
    en: () =>
      import("./dictionaries/en/trayectoria/thetool.json").then(
        (m) => m.default,
      ),
  },
  freepik: {
    es: () =>
      import("./dictionaries/es/trayectoria/freepik.json").then(
        (m) => m.default,
      ),
    en: () =>
      import("./dictionaries/en/trayectoria/freepik.json").then(
        (m) => m.default,
      ),
  },
};

/**
 * Los slugs que HOY tienen página, derivados del registro y no escritos. Con el
 * `Partial` fuera (P49) son exactamente los cinco de `EXPERIENCES`, así que
 * `generateStaticParams` no puede quedarse corto sin que el typecheck lo diga.
 */
export const experienceSlugs = Object.keys(experienceDicts) as ExperienceSlug[];

/** `undefined` = esa experiencia no tiene página; la ruta responde 404. */
export function getExperience(
  lang: Locale,
  slug: string,
): Promise<DeepDiveDict> | undefined {
  return experienceDicts[slug as ExperienceSlug]?.[lang]();
}
