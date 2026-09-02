import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { SITE_DOMAIN, SITE_URL } from "../../lib/site";
import { fallo, vistos } from "./informe";

/* -------------------------------------------------------------------------- */
/* 8. El catálogo ARD — que cada recurso que anuncia exista                     */
/* -------------------------------------------------------------------------- */

/**
 * Dónde deja Next el cuerpo del catálogo. Se mira el ARTEFACTO y no
 * `lib/ard.ts`, por lo mismo que `llms.txt`: comparar el generador consigo mismo
 * aprueba siempre, y lo que un agente pide es este archivo.
 */
const ARD = join(".next", "server", "app", ".well-known", "ard.json.body");

/**
 * La gemela: el MISMO documento en la ruta del AI Catalog Standard. No es una
 * copia —el cuerpo lo compone una sola función— y por eso lo que se comprueba es
 * exactamente eso: que los dos artefactos sean **idénticos byte a byte**. El día
 * que uno de los dos route handlers empiece a componer lo suyo, las dos
 * especificaciones estarían leyendo dos catálogos con el mismo nombre.
 */
const AI_CATALOG = join(
  ".next",
  "server",
  "app",
  ".well-known",
  "ai-catalog.json.body",
);

/**
 * El identificador de descubrimiento: `urn:air:<dominio FQDN>:<espacio>:<nombre>`.
 * El prefijo se compara como cadena y no dentro de una expresión regular: el
 * dominio lleva puntos, y meterlo en un patrón sin escapar convierte el ancla de
 * autoridad en un comodín que acepta `franciscolopezXes`.
 */
const URN_PREFIJO = `urn:air:${SITE_DOMAIN}:`;
const URN_RESTO = /^[a-z0-9-]+:[a-z0-9-]+$/;

/** `tipo/subtipo`, que es lo único que este guardián puede afirmar de un IANA media type. */
const MEDIA_TYPE = /^[a-z]+\/[a-z0-9.+-]+$/;

/**
 * ¿Existe en disco lo que esta URL promete? La regla es genérica a propósito —un
 * asset de `public/`, o el cuerpo de una ruta estática que el build prerenderiza—
 * en vez de una tabla de rutas conocidas: una entrada nueva la cubre sin tocar
 * esto, y una entrada muerta es lo único que un catálogo no se puede permitir.
 */
function recursoEnDisco(pathname: string): boolean {
  const relativa = pathname.replace(/^\//, "");
  return (
    existsSync(join("public", relativa)) ||
    existsSync(join(".next", "server", "app", `${relativa}.body`))
  );
}

/**
 * El modelo de entrada del conformance (§4.2 y §4.3), sobre UNA entrada. Devuelve
 * si hay `url` que comprobar: la resolución contra el disco va aparte, porque es
 * la mitad que ninguna especificación puede hacer por nosotros.
 */
function revisarModeloDeEntrada(
  e: Record<string, unknown>,
  quien: string,
): boolean {
  if (
    typeof e.identifier !== "string" ||
    !e.identifier.startsWith(URN_PREFIJO) ||
    !URN_RESTO.test(e.identifier.slice(URN_PREFIJO.length))
  ) {
    fallo(
      "catálogo ARD",
      `\`${quien}\` no es un identificador \`urn:air:${SITE_DOMAIN}:<espacio>:<nombre>\`. ` +
        "El dominio del URN es el ancla de autoridad de la especificación: uno que " +
        "nombre otro dominio es una entrada reclamando algo que no es nuestro.",
    );
  }
  if (typeof e.displayName !== "string" || !e.displayName.trim()) {
    fallo("catálogo ARD", `\`${quien}\` no tiene \`displayName\`.`);
  }
  if (typeof e.type !== "string" || !MEDIA_TYPE.test(e.type)) {
    fallo(
      "catálogo ARD",
      `el \`type\` de \`${quien}\` no tiene forma de tipo IANA (\`${String(e.type)}\`).`,
    );
  }

  // Value-or-reference (§4.3): uno de los dos, nunca los dos, nunca ninguno.
  const tieneUrl = typeof e.url === "string" && e.url.length > 0;
  const tieneData = e.data !== undefined;
  if (tieneUrl === tieneData) {
    fallo(
      "catálogo ARD",
      `\`${quien}\` tiene ${tieneUrl ? "`url` y `data` a la vez" : "ni `url` ni `data`"}, ` +
        "y la especificación pide exactamente uno.",
    );
  }

  // `representativeQueries` es de lo que un registro construye su índice: sin
  // ellas la entrada valida y no la encuentra nadie buscando. La especificación
  // lo deja en SHOULD con 2-5; aquí es rojo, porque una entrada que no se puede
  // encontrar no cumple el motivo por el que este catálogo existe.
  const consultas = e.representativeQueries;
  const cuantas = Array.isArray(consultas) ? consultas.length : 0;
  if (cuantas < 2 || cuantas > 5) {
    fallo(
      "catálogo ARD",
      `\`${quien}\` tiene ${cuantas} \`representativeQueries\` y la especificación pide ` +
        "de 2 a 5. Es el texto que un registro indexa: sin ellas, la entrada no se " +
        "encuentra buscando.",
    );
  }

  return tieneUrl;
}

/**
 * Que lo que la entrada anuncia EXISTA. Es la mitad que de verdad importa: un
 * catálogo estructuralmente perfecto que apunta a un archivo renombrado le cuesta
 * al agente una petición y le hace desconfiar del resto.
 */
function revisarDestino(e: Record<string, unknown>, quien: string): void {
  const url = e.url as string;
  if (!url.startsWith(SITE_URL)) {
    fallo(
      "catálogo ARD",
      `\`${quien}\` apunta a \`${url}\`, que está fuera de \`${SITE_URL}\`. ` +
        "Este catálogo describe lo que sirve ESTE sitio.",
    );
    return;
  }
  const pathname = new URL(url).pathname;
  if (!recursoEnDisco(pathname)) {
    fallo(
      "catálogo ARD",
      `\`${quien}\` anuncia \`${pathname}\` y no existe ni en \`public/\` ni como ruta ` +
        "estática del build. Una entrada muerta le cuesta al agente una petición y " +
        "le hace desconfiar del resto del catálogo.",
    );
  }
}

/**
 * El catálogo de Agentic Resource Discovery (P68.752).
 *
 * SON DOS COSAS, Y ESTÁN PARTIDAS PORQUE SON DE NATURALEZA DISTINTA: el modelo
 * de entrada del conformance, que es lo que la especificación pide
 * (`revisarModeloDeEntrada`), y que lo que la entrada anuncia exista, que es lo
 * que ninguna especificación puede hacer por nosotros (`revisarDestino`). El
 * porqué de cada una, en su propia cabecera.
 *
 * LO QUE NO COMPRUEBA: que el tipo declarado sea el que el servidor devuelve de
 * verdad. Eso necesita una petición HTTP y este gate corre en CI sin servidor,
 * igual que el 404 de la sección 5. Se midió a mano al escribir cada entrada
 * (2026-08-31, contra producción) y queda dicho aquí en vez de darse por cubierto.
 */
export function revisarCatalogo(): void {
  if (!existsSync(ARD)) {
    fallo(
      "catálogo ARD",
      `no hay artefacto en \`${ARD}\`. O la ruta dejó de ser estática, o dejó de ` +
        "existir: en los dos casos `/.well-known/ard.json` responde 404 al cliente " +
        "que la especificación dice que la va a pedir.",
    );
    return;
  }

  const cuerpo = readFileSync(ARD, "utf8");

  // LAS DOS PUERTAS SIRVEN EL MISMO DOCUMENTO, y eso no se supone: se compara.
  if (!existsSync(AI_CATALOG)) {
    fallo(
      "catálogo ARD",
      `no hay artefacto en \`${AI_CATALOG}\`. Es la ruta de descubrimiento del AI ` +
        "Catalog Standard, de donde sale el formato de este documento: sin ella, el " +
        "consumidor que sigue esa especificación no encuentra nada.",
    );
  } else if (readFileSync(AI_CATALOG, "utf8") !== cuerpo) {
    fallo(
      "catálogo ARD",
      "`/.well-known/ard.json` y `/.well-known/ai-catalog.json` sirven cuerpos " +
        "DISTINTOS. Son dos puertas al mismo documento, no dos documentos: si difieren, " +
        "cada especificación está leyendo un catálogo distinto con el mismo nombre.",
    );
  }

  let doc: { entries?: unknown };
  try {
    doc = JSON.parse(cuerpo) as { entries?: unknown };
  } catch (e) {
    fallo("catálogo ARD", `no es JSON válido: ${(e as Error).message}.`);
    return;
  }

  const entradas = doc.entries;
  if (!Array.isArray(entradas) || entradas.length === 0) {
    fallo(
      "catálogo ARD",
      "no trae ni una entrada en `entries`. Un catálogo vacío es una ruta que " +
        "responde 200 y no dice nada, que es peor que un 404 honesto.",
    );
    return;
  }

  for (const e of entradas as Record<string, unknown>[]) {
    vistos.entradasArd++;
    const quien = typeof e.identifier === "string" ? e.identifier : "(sin id)";
    if (revisarModeloDeEntrada(e, quien)) revisarDestino(e, quien);
  }
}
