/**
 * Lo que comparten los bloques de `check:marco`: la página que se está mirando,
 * lo que falla y cuánto se ha mirado.
 *
 * LOS BLOQUES ESCRIBEN AQUÍ EN VEZ DE DEVOLVER, y está razonado donde se usa: un
 * informe que se para en el primer fallo obliga a tantas corridas como problemas
 * haya, y en CI eso es un ciclo por hallazgo.
 *
 * Y `vistos` es el SUELO DEL METRO. No son objetivos: son la línea por debajo de
 * la cual el informe está describiendo otra cosa —un build vacío, un axe que no
 * arrancó, un selector que dejó de casar— y hay que mirarlo en vez de leer el ✓.
 * Un metro que devuelve lista vacía parece un aprobado, y este repo se lo ha
 * encontrado seis veces (D70).
 */
import { type Locale } from "../../lib/i18n/config";
import { type PageSlug } from "../../lib/routes";

/** La variante que se está mirando, ya abierta: es lo que recibe cada bloque. */
export type Pagina = {
  variante: string;
  doc: Document;
  lang: Locale;
  slug: PageSlug;
  /** Toda la que no es la home: lleva breadcrumb visible y `BreadcrumbList`. */
  esInterna: boolean;
  /** La ruta que le toca a esta variante, según `pagePath` (D2). */
  esperada: string;
};

export const problemas: string[] = [];

/** Un problema, siempre con la variante delante: el informe se lee sin abrir nada. */
export const fallo = (variante: string, msg: string) =>
  problemas.push(`${variante}: ${msg}`);

/** Cuánto ha mirado de verdad cada bloque. Ninguno puede quedarse en cero. */
export const vistos = {
  /** Variantes que han pasado por la invariante del `<article>` (P67.6). */
  articulos: 0,
  /** Tarjetas OG cuyo `?card=` se ha resuelto de verdad contra el despacho. */
  tarjetas: 0,
  /** Permalinks a una línea de un archivo del repo. */
  permalinks: 0,
  /** `<link rel="ard">` encontrados, para afirmar que se ha mirado en las 28. */
  enlacesArd: 0,
  /** Bloques de JSON-LD recorridos. */
  bloquesLd: 0,
  /** Referencias `@id` examinadas por página. */
  referencias: 0,
};

/** Las reglas de axe que de verdad han llegado a evaluarse, en todas las variantes. */
export const reglasEvaluadas = new Set<string>();

/** Los `@id` que alguien DECLARA y los que alguien REFERENCIA, en todo el sitio. */
export const idsDeclarados = new Set<string>();
export const idsReferenciados = new Map<string, string>();
