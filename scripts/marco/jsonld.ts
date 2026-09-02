import {
  fallo,
  idsDeclarados,
  idsReferenciados,
  vistos,
  type Pagina,
} from "./estado";

/**
 * Lo que una página declara y referencia POR SÍ SOLA, que es como la lee un
 * validador externo. Se acumula aparte de los dos conjuntos globales de arriba.
 */
type EstadoDePagina = {
  declarados: Set<string>;
  peladas: { id: string; campo: string }[];
};

/**
 * REFERENCIAS `@id` QUE CRUZAN DE PÁGINA A PROPÓSITO — el inventario, con motivo
 * *(2026-08-30, P66)*.
 *
 * EL HUECO QUE CIERRA. Este guardián resuelve los `@id` contra TODO el sitio, y
 * eso es deliberado: es la única comprobación que ningún validador externo hace
 * (D75). Pero la Rich Results Test evalúa una página **aislada**, así que a ella
 * una referencia que apunta a otra página le llega como un `Thing` anónimo y
 * avisa. En P60.99 eso fueron 2 de los 7 avisos del artículo, con `check:marco`
 * en verde sobre lo mismo. Ninguno de los dos estaba mal: miden cosas distintas,
 * y la afirmación publicada se apoyaba solo en el nuestro (D84/D86).
 *
 * LA INVARIANTE, y por qué no hay lista de tipos elegibles. Lo evidente era
 * avisar cuando el bloque que referencia es de un tipo elegible para rich results
 * —`Article` y familia, `Product`, `FAQPage`…—, y eso es **otra lista que se
 * queda vieja**, mantenida a mano contra un catálogo que decide Google. Aquí la
 * comprobación es POSICIONAL y no necesita saber de tipos: *toda referencia cuyo
 * `@id` no se declara en su PROPIA página lleva `name` y `url`, salvo lo
 * declarado aquí abajo con su motivo*. Es el patrón de `check:og` (D142), y como
 * allí se mide en las dos direcciones: **una excepción que ya no ocurre también
 * es rojo**, porque una lista de excepciones cuya razón de ser es vaciarse se
 * queda con entradas muertas que tapan el caso siguiente.
 *
 * LO QUE NO MIRA: si el tipo es elegible. Una referencia pelada declarada aquí en
 * un tipo que MAÑANA pase a ser elegible seguiría en verde. Es el precio de no
 * mantener el catálogo, y se paga a sabiendas: el motivo de cada entrada nombra
 * su tipo, así que el día que cambie, lo que hay que releer está escrito.
 */
export const REFERENCIAS_QUE_CRUZAN: readonly {
  /** Contra el slug de la variante, sin locale. */
  paginas: RegExp;
  /** La clave bajo la que cuelga la referencia. */
  campo: string;
  motivo: string;
}[] = [
  {
    paginas: /^trayectoria\/[^/]+$/,
    campo: "isPartOf",
    motivo:
      "`WebPage` no es elegible para rich results: ningún validador externo evalúa esta página sola",
  },
  {
    paginas: /^trayectoria\/[^/]+$/,
    campo: "author",
    motivo: "idem `isPartOf`: el bloque es `WebPage`",
  },
  {
    paginas: /^trayectoria\/[^/]+$/,
    campo: "mainEntity",
    motivo: "idem `isPartOf`: el bloque es `WebPage`",
  },
  {
    paginas: /^contacto$/,
    campo: "isPartOf",
    motivo:
      "`ContactPage` tampoco es elegible. Medido contra el Schema Markup Validator el 2026-08-27: cero errores y cero avisos; el coste es que un lector AISLADO ve `CreativeWork` en vez de `WebSite`",
  },
  {
    paginas: /^contacto$/,
    campo: "mainEntity",
    motivo: "idem `isPartOf`: el bloque es `ContactPage`",
  },
];

/** Las entradas de arriba que de verdad se han encontrado, para exigir las dos direcciones. */
export const cruceUsado = new Set<number>();

function recorrerIds(
  nodo: unknown,
  variante: string,
  pagina: EstadoDePagina,
  campo = "raíz",
): void {
  if (Array.isArray(nodo)) {
    for (const hijo of nodo) recorrerIds(hijo, variante, pagina, campo);
    return;
  }
  if (typeof nodo !== "object" || nodo === null) return;

  const obj = nodo as Record<string, unknown>;
  apuntarId(obj, variante, pagina, campo);
  /**
   * `@graph` ES LA ÚNICA CLAVE RESERVADA QUE CONTIENE NODOS, y por eso se recorre
   * a mano *(P68.751, 2026-08-31)*. El bucle de abajo se salta todo lo que empieza
   * por `@` —`@context`, `@type`, el `@id` que ya se ha leído—, que es correcto
   * para las demás: son metadatos, no entidades. Con `@graph` esa poda dejaba de
   * mirar el 100% del bloque, y en silencio: el día que la home pasó a `@graph`,
   * los `@id` del `Person` y del `WebSite` no se habrían apuntado como declarados
   * y este guardián habría acusado de referencia colgada a las trece páginas que
   * los apuntan — un rojo cuya causa está en el guardián, que es la peor clase.
   *
   * El `campo` no se cambia al entrar: los hijos de un `@graph` son nodos de
   * primer nivel, no el valor de una propiedad, y `REFERENCIAS_QUE_CRUZAN` mira
   * precisamente la propiedad bajo la que cuelga una referencia.
   */
  if ("@graph" in obj) recorrerIds(obj["@graph"], variante, pagina, campo);

  for (const [clave, valor] of Object.entries(obj)) {
    if (clave.startsWith("@")) continue;
    recorrerIds(valor, variante, pagina, clave);
  }
}

/**
 * La separación que hace útil a todo lo de arriba: un objeto que SOLO lleva
 * `@id` es una referencia («este autor es aquella persona»); uno que además trae
 * campos es una declaración. Se apunta dos veces —globalmente y por página—
 * porque las dos lecturas son legítimas y no dan lo mismo.
 */
function apuntarId(
  obj: Record<string, unknown>,
  variante: string,
  pagina: EstadoDePagina,
  campo: string,
): void {
  const id = obj["@id"];
  if (typeof id !== "string") return;
  if (Object.keys(obj).length === 1) {
    if (!idsReferenciados.has(id)) idsReferenciados.set(id, variante);
    pagina.peladas.push({ id, campo });
    return;
  }
  idsDeclarados.add(id);
  pagina.declarados.add(id);
}

/** Los `@type` de un bloque, que puede ser un objeto, un array o un `@graph`. */
function tiposDe(dato: unknown): string[] {
  if (Array.isArray(dato)) return dato.flatMap(tiposDe);
  if (typeof dato !== "object" || dato === null) return [];
  const obj = dato as Record<string, unknown>;
  const propio = typeof obj["@type"] === "string" ? [obj["@type"]] : [];
  return [...propio, ...tiposDe(obj["@graph"])];
}

/** El `pathname` de una URL absoluta, o `null` si no lo es. */

function revisarBreadcrumbLd(
  { variante }: Pagina,
  raiz: Record<string, unknown>,
): void {
  const items = (raiz.itemListElement ?? []) as Record<string, unknown>[];
  const posiciones = items.map((it) => it.position);
  const esperadas = items.map((_, n) => n + 1);
  if (JSON.stringify(posiciones) !== JSON.stringify(esperadas)) {
    fallo(
      variante,
      `las \`position\` del BreadcrumbList son [${posiciones.join(", ")}] y tienen que ser [${esperadas.join(", ")}].`,
    );
  }
  if (items.length > 0 && "item" in items[items.length - 1]!) {
    fallo(
      variante,
      "el último nivel del BreadcrumbList lleva `item`, y Google pide que la página en curso lo omita.",
    );
  }
}

/**
 * Lo que ve un validador que mira ESTA página y nada más: una referencia cuyo
 * `@id` no se declara aquí dentro tiene que traer `name` y `url`, o estar
 * declarada en `REFERENCIAS_QUE_CRUZAN` con su motivo.
 *
 * Se llama con la página entera ya recorrida, no bloque a bloque: el `Person` de
 * una página puede declararlo un bloque y referenciarlo otro, y eso resuelve.
 */
function revisarReferenciasQueCruzan(pagina: Pagina, estado: EstadoDePagina) {
  const { variante, slug } = pagina;
  for (const { id, campo } of estado.peladas) {
    vistos.referencias++;
    if (estado.declarados.has(id)) continue;
    const i = REFERENCIAS_QUE_CRUZAN.findIndex(
      (r) => r.paginas.test(slug) && r.campo === campo,
    );
    if (i >= 0) {
      cruceUsado.add(i);
      continue;
    }
    fallo(
      variante,
      `\`${campo}\` referencia el \`@id\` «${id}», que NO se declara en esta página, y va pelado. ` +
        "Este check lo resuelve contra todo el sitio y sale verde; la Rich Results Test evalúa la " +
        "página sola, lo degrada a `Thing` anónimo y avisa. Dale `name` y `url` junto al `@id` " +
        "—que sigue haciendo su trabajo al lado—, o decláralo en `REFERENCIAS_QUE_CRUZAN` con su motivo.",
    );
  }
}

/**
 * JSON-LD: válido, del tipo que le toca, y con sus `@id` apuntados. La
 * RESOLUCIÓN de los `@id` no se hace aquí: es global, y va al final de `main()`.
 */
export function revisarJsonLd(pagina: Pagina): void {
  const estado: EstadoDePagina = { declarados: new Set(), peladas: [] };
  const { doc, variante, esInterna } = pagina;
  const bloques = [
    ...doc.querySelectorAll('script[type="application/ld+json"]'),
  ];
  if (bloques.length === 0) {
    fallo(variante, "no emite ningún bloque JSON-LD.");
  }

  const tipos: string[] = [];
  for (const [i, bloque] of bloques.entries()) {
    let dato: unknown;
    try {
      dato = JSON.parse(bloque.textContent ?? "");
    } catch (e) {
      fallo(
        variante,
        `el bloque JSON-LD ${i + 1} no es JSON válido: ${(e as Error).message}.`,
      );
      continue;
    }
    vistos.bloquesLd++;

    const raiz = dato as Record<string, unknown>;
    if (raiz["@context"] !== "https://schema.org") {
      fallo(
        variante,
        `el bloque JSON-LD ${i + 1} no declara \`"@context": "https://schema.org"\`.`,
      );
    }
    const suyos = tiposDe(dato);
    if (suyos.length === 0) {
      fallo(
        variante,
        `el bloque JSON-LD ${i + 1} no declara ningún \`@type\`.`,
      );
    }
    tipos.push(...suyos);
    recorrerIds(dato, variante, estado);

    if (suyos.includes("BreadcrumbList")) revisarBreadcrumbLd(pagina, raiz);
  }

  // La home declara la entidad del sitio; toda interna dice dónde está.
  const obligatorio = esInterna ? "BreadcrumbList" : "ProfilePage";
  if (bloques.length > 0 && !tipos.includes(obligatorio)) {
    fallo(
      variante,
      `no emite ningún \`${obligatorio}\` (emite: ${tipos.join(", ") || "nada"}).`,
    );
  }
  revisarReferenciasQueCruzan(pagina, estado);
}

/** axe, sobre todo lo demás que se puede ver sin pintar. */
