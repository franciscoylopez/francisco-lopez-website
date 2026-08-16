import "server-only";

import type { Locale } from "@/lib/i18n/config";

import type esCommon from "./dictionaries/es/common.json";
import type esHome from "./dictionaries/es/home.json";
import type esSobreMi from "./dictionaries/es/sobre-mi.json";
import type esBrandKit from "./dictionaries/es/brand-kit.json";
import type esDesignSystem from "./dictionaries/es/design-system.json";
import type esAccesibilidad from "./dictionaries/es/accesibilidad.json";
import type esCookies from "./dictionaries/es/cookies.json";

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
