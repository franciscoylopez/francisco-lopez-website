/**
 * La huella de «Cómo se ha creado esta página» — la lee `npm run check:articulo`,
 * la sella `npm run articulo:sellar`.
 *
 * EL PORQUÉ, en `content/articulo/dependencias.ts`. Aquí solo el método: cómo se
 * resuelve cada forma de dependencia y cómo se hashea.
 *
 * UN SELLO POR SECCIÓN, no uno global. Es la diferencia entre un guardián que se
 * usa y una alarma que se apaga: un hash único diría «el artículo ha cambiado de
 * contexto» y dejaría el trabajo entero —encontrar QUÉ párrafo— a quien lee el
 * rojo. Once sellos dicen «mira la §07», que es una tarea de dos minutos.
 *
 * SE SELLA LO QUE ENTRA, no lo que sale. Misma elección que el CV y por el mismo
 * motivo (D60): lo que interesa no es que el HTML del artículo haya cambiado
 * —cambia con cualquier retoque de copy, que es legítimo— sino que **el mundo
 * que el artículo describe** se haya movido por debajo. El artefacto de Emendu
 * sella la salida porque allí la salida es determinista y derivada; aquí la
 * salida la escribe una persona.
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";

import {
  DEL_DISCO,
  huellaPorBloque,
  type Rota as RotaGenerica,
} from "../dependencias/huella";

import {
  DEPENDENCIAS,
  SECCIONES,
  type SeccionId,
} from "../../content/articulo/dependencias";

/** Dónde vive el sello, junto a la declaración que describe. */
export const HUELLA_PATH = "content/articulo/articulo.huella";

/** Lo que un `#fragmento` no encontró. Se acumula en vez de lanzar, para que el
 *  informe liste TODAS las dependencias rotas de una vez y no la primera. */
export type Rota = RotaGenerica<SeccionId>;

/**
 * LA RESOLUCIÓN Y EL HASHEO YA NO VIVEN AQUÍ (2026-08-28, P50.73). Se subieron a
 * `scripts/dependencias/huella.ts` el día que `/accesibilidad` quiso el mismo
 * aparato: copiarlo habría dejado dos metros midiendo distinto. Se re-exportan
 * para que quien importaba de aquí siga importando de aquí.
 */
export {
  contenidoDe,
  contenidoDesde,
  DEL_DISCO,
  type Fuente,
} from "../dependencias/huella";

/** `s07 → sha256`, más la lista de las que no resolvieron. */
export function huellaDelArticulo(): {
  sellos: Map<SeccionId, string>;
  rotas: Rota[];
  dependencias: number;
} {
  return huellaPorBloque<SeccionId>(SECCIONES, DEPENDENCIAS);
}

/**
 * Lo que cuenta como CONTENIDO del artículo a efectos de `dateModified`: los dos
 * diccionarios y sus figuras. Es una lista distinta de las dependencias de
 * arriba, y la diferencia es la que importa: aquellas son **el mundo que el
 * artículo describe** (si se mueven, hay que releer el texto); estas son **el
 * texto mismo** (si se mueven, cambió lo que lee un visitante, y eso es lo que
 * `dateModified` le promete a Google).
 *
 * NO entran los componentes de carpintería: centrar un riel o arreglar un hover
 * no cambia una palabra de lo que se lee. Sí entran las figuras, que son
 * contenido, porque un diagrama dice algo.
 */
export const FUENTES_DEL_COPY = [
  "app/[lang]/dictionaries/es/como-se-ha-creado.json",
  "app/[lang]/dictionaries/en/como-se-ha-creado.json",
  "components/site/como-se-ha-creado-diagrams/",
  // `shared.tsx` SALIÓ de esa carpeta el 2026-08-25 (P70.101), cuando una
  // segunda página estrenó diagrama y dejó de tener sentido que el rótulo y el
  // conmutador de lienzos colgaran del artículo. Se nombra APARTE, y esa es la
  // parte que importa: sin esta línea el sello dejó de vigilarlo, así que
  // cambiar `LBL` habría redibujado las ocho figuras del artículo sin mover el
  // `dateModified`. El guardián se estrechó en silencio al mover un archivo, que
  // es justo el fallo que este archivo existe para no tener.
  //
  // Y se nombra el ARCHIVO, no la carpeta nueva: en `components/site/diagrams/`
  // vive también el diagrama de `/accesibilidad`, que no es copy del artículo y
  // movería su fecha sin tocar una palabra de lo que se lee.
  "components/site/diagrams/shared.tsx",
  // MISMO CASO, SEGUNDA VEZ (2026-08-25, P68.7205): `capas-verificacion.tsx`
  // salió de la carpeta del artículo al estrenar un segundo consumidor, la
  // sección 05 de `/accesibilidad` (P70.104). Sigue siendo copy del artículo
  // —dibuja el argumento del capítulo 09—, así que sin esta línea el sello se
  // habría estrechado exactamente igual que con `shared.tsx`: es D112 otra vez,
  // y por eso la regla al mover un diagrama a esta carpeta es nombrarlo aquí.
  //
  // Que ahora sea copy de DOS páginas no cambia la respuesta: `dateModified`
  // habla del artículo, y si la figura cambia, cambió lo que el artículo enseña.
  "components/site/diagrams/capas-verificacion.tsx",
] as const;

/**
 * Un solo hash del copy del artículo, o `undefined` si alguna fuente no está.
 * A diferencia de los sellos por sección, aquí uno global es lo correcto: la
 * pregunta no es QUÉ párrafo hay que mirar, es si cambió o no el texto publicado.
 *
 * El directorio de figuras se hashea por CONTENIDO y no solo por su lista de
 * archivos, que es como se hashea un directorio en las dependencias: allí basta
 * saber si apareció una pieza nueva; aquí, redibujar una figura sin renombrarla
 * es exactamente el cambio que hay que ver.
 */
export function huellaDelCopy(): string | undefined {
  const hash = createHash("sha256");
  for (const ruta of FUENTES_DEL_COPY) {
    if (ruta.endsWith("/")) {
      const dir = ruta.slice(0, -1);
      const entradas = DEL_DISCO.listar(dir);
      if (!entradas?.length) return undefined;
      for (const entrada of entradas) {
        const contenido = DEL_DISCO.leer(`${dir}/${entrada}`);
        if (contenido === undefined) return undefined;
        hash.update(entrada).update(SEP).update(contenido).update(SEP);
      }
      continue;
    }
    const contenido = DEL_DISCO.leer(ruta);
    if (contenido === undefined) return undefined;
    hash.update(ruta).update(SEP).update(contenido).update(SEP);
  }
  return hash.digest("hex");
}

/**
 * El separador de los campos que entran en un hash: un NUL, porque es el único
 * byte que no puede aparecer dentro del contenido. Lo usaba ya `huellaDelArticulo`
 * escrito como literal —motivo por el que git ve este archivo como binario y nunca
 * enseña su diff—, así que aquí se le pone nombre en vez de repetir el literal.
 */
const SEP = String.fromCharCode(0);

/** Las dos líneas del sello que no son una sección. */
export const CLAVE_COPY = "copy";
export const CLAVE_FECHA = "fecha";

/** El sello tal y como se escribe y se lee: una línea por sección. */
export function serializar(
  sellos: Map<SeccionId, string>,
  copy: string,
  fecha: string,
): string {
  return (
    [
      ...SECCIONES.map((s) => `${s} ${sellos.get(s)}`),
      `${CLAVE_COPY} ${copy}`,
      `${CLAVE_FECHA} ${fecha}`,
    ].join("\n") + "\n"
  );
}

export function leerSello(): Map<string, string> {
  if (!existsSync(HUELLA_PATH)) return new Map();
  const mapa = new Map<string, string>();
  for (const linea of readFileSync(HUELLA_PATH, "utf8").split("\n")) {
    const [id, hash] = linea.trim().split(/\s+/);
    if (id && hash) mapa.set(id, hash);
  }
  return mapa;
}
