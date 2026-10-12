/**
 * Cómo se resuelve y se hashea una DEPENDENCIA, sin saber de quién es.
 *
 * POR QUÉ ESTÁ APARTE (2026-08-28, P50.73). El aparato lo escribió el artículo
 * —cada sección declara de qué depende, y cuando la fuente se mueve CI sale rojo
 * NOMBRANDO la sección (D84)—, y funcionó tan bien que la segunda página que
 * publica afirmaciones verificables, `/accesibilidad`, lo quería entero. La
 * alternativa era copiarlo: cien y pico líneas duplicadas de resolución de
 * `#fragmento` y de hasheo de directorios, o sea dos metros que acabarían
 * midiendo distinto. Es la Regla de construcción aplicada a `scripts/`: si la
 * pieza existe, se usa.
 *
 * Aquí vive solo lo GENÉRICO: qué es una dependencia y cómo se lee. Quién depende
 * de qué lo declara cada página en su `content/<pagina>/dependencias.ts`, y el
 * veredicto lo da su guardián.
 */
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";

/**
 * Las formas de una dependencia, y son las mismas para toda página:
 *
 * - `"next.config.ts"` — un archivo. Se hashea entero.
 * - `"DECISIONS.md#D26"` — una sección de markdown, por el principio de su
 *   titular. Se hashea el cuerpo hasta el siguiente titular de igual nivel o
 *   superior.
 * - `"lib/design-values.ts#CONTRAST"` — una DECLARACIÓN exportada de un archivo
 *   de código. Se hashea desde su línea `export` hasta que la declaración
 *   cierra.
 * - `"components/ui/"` — un directorio (barra final). Se hashea la LISTA
 *   ordenada de sus archivos, no su contenido.
 *
 * POR QUÉ EL SÍMBOLO (2026-09-03, D193). El `#fragmento` de markdown existía
 * desde el principio y el de código no, así que un archivo que es **fuente
 * única** por D38 —`lib/design-values.ts`— solo se podía declarar entero. Medido
 * sobre sus 35 commits: **23 movieron el archivo sin tocar nada de lo que sus
 * dos dependientes vigilan**, o sea dos tercios de los rojos con cero hallazgos
 * dentro. Ese es el ruido que enseña a sellar sin mirar, que es el modo de fallo
 * peor. Y a diferencia del guardián de prosa que D193 descarta, aquí no hay
 * heurística: un símbolo o está o no está.
 */
export type Dependencia = string;

/** Lo que una dependencia no encontró, con el bloque al que pertenece. Se
 *  acumula en vez de lanzar, para que el informe liste TODAS las rotas de una
 *  vez y no solo la primera. */
export type Rota<Id extends string = string> = {
  seccion: Id;
  dep: Dependencia;
  motivo: string;
};

/**
 * El cuerpo de una sección de markdown, desde su titular hasta el siguiente del
 * mismo nivel o superior. El fragmento casa por PREFIJO del titular —
 * `#D26` casa `## D26 · Cabeceras de seguridad… — 2026-08-02`— para que
 * retocarle el título a una entrada no rompa la dependencia: lo que identifica
 * a la entrada es su número, no su redacción.
 */
function seccionDeMarkdown(
  texto: string,
  fragmento: string,
): string | undefined {
  const lineas = texto.split("\n");
  const inicio = lineas.findIndex((l) => {
    const titular = /^#{1,6}\s+(.*)$/.exec(l)?.[1];
    return titular ? titular.startsWith(fragmento) : false;
  });
  if (inicio === -1) return undefined;

  const nivel = (/^(#{1,6})/.exec(lineas[inicio]!)?.[1] ?? "#").length;
  let fin = lineas.length;
  for (let i = inicio + 1; i < lineas.length; i++) {
    const almohadillas = /^(#{1,6})\s/.exec(lineas[i]!)?.[1];
    if (almohadillas && almohadillas.length <= nivel) {
      fin = i;
      break;
    }
  }
  // SE PODA EL FINAL, y no es cosmética (P68.5). El recorte llega hasta el
  // titular siguiente, así que arrastra el separador `---` y las líneas en
  // blanco que hay entre una entrada y la otra. Consecuencia: **añadir una
  // decisión nueva cambia el recorte de la ANTERIOR**, que hasta ese momento
  // terminaba en el final del archivo. Medido sobre 60 commits: pasó 3 veces, y
  // las 3 fueron ruido puro — la entrada citada no se había tocado.
  const cuerpo = lineas.slice(inicio, fin);
  while (
    cuerpo.length &&
    (!cuerpo.at(-1)!.trim() || cuerpo.at(-1)!.trim() === "---")
  )
    cuerpo.pop();
  return cuerpo.join("\n");
}

/**
 * El cuerpo de una DECLARACIÓN exportada, desde su línea `export` hasta que
 * cierra. Cubre las cuatro formas que este repo usa: `const`, `function`, `type`
 * e `interface`.
 *
 * QUÉ SE DEJA FUERA A PROPÓSITO: el comentario de encima. Un JSDoc reescrito no
 * cambia lo que la declaración VALE, y este resolutor existe justo para no
 * disparar por eso. El precio es simétrico y hay que decirlo: corregir un
 * comentario que afirmaba algo falso tampoco manda a releer al dependiente.
 *
 * CÓMO SE SABE DÓNDE ACABA. Contando llaves, corchetes y paréntesis, con las
 * cadenas y los comentarios BORRADOS antes de contar — `{comprobaciones}` vive
 * dentro de una cadena de este mismo archivo y descuadraría el balance. Cuando
 * el balance vuelve a cero y la línea cierra (`;`, `}` o `,`), la declaración ha
 * terminado. Es menos que un parser y basta para un archivo de valores; el día
 * que no baste, se verá como una dependencia rota y no como un sello silencioso.
 */
function declaracionDeCodigo(
  texto: string,
  simbolo: string,
): string | undefined {
  const lineas = texto.split("\n");
  const abre = new RegExp(
    `^export\\s+(?:const|let|function|async\\s+function|type|interface|class)\\s+${simbolo}\\b`,
  );
  const inicio = lineas.findIndex((l) => abre.test(l));
  if (inicio === -1) return undefined;

  // Sin cadenas ni comentarios, que es lo único que hace mentir al balance.
  const desnuda = (l: string) =>
    l
      .replace(/\/\*.*?\*\//g, "")
      .replace(/\/\/.*$/, "")
      .replace(/`(?:[^`\\]|\\.)*`/g, "``")
      .replace(/"(?:[^"\\]|\\.)*"/g, '""')
      .replace(/'(?:[^'\\]|\\.)*'/g, "''");

  let balance = 0;
  for (let i = inicio; i < lineas.length; i++) {
    const l = desnuda(lineas[i]!);
    for (const c of l) {
      if (c === "{" || c === "[" || c === "(") balance++;
      else if (c === "}" || c === "]" || c === ")") balance--;
    }
    const cierra = /[;},]\s*$/.test(l.trimEnd());
    if (balance <= 0 && (cierra || i === inicio))
      return lineas.slice(inicio, i + 1).join("\n");
  }
  // Balance abierto hasta el final = el resolutor no ha entendido la
  // declaración. Cuenta como rota, nunca como sello sobre medio archivo.
  return undefined;
}

/**
 * De dónde se lee. El disco es una de las respuestas; la otra es un commit, y
 * la necesita `npm run articulo:novedades` para poder decir QUÉ cambió desde el
 * último sello en vez de solo que algo cambió (P68.5). La resolución de cada
 * forma de dependencia —archivo, `#fragmento`, directorio— es la misma en los
 * dos casos, y por eso se escribe una vez.
 */
export type Fuente = {
  leer: (ruta: string) => string | undefined;
  listar: (dir: string) => string[] | undefined;
};

export const DEL_DISCO: Fuente = {
  leer: (ruta) => (existsSync(ruta) ? readFileSync(ruta, "utf8") : undefined),
  listar: (dir) =>
    existsSync(dir) && statSync(dir).isDirectory()
      ? readdirSync(dir).sort()
      : undefined,
};

export function contenidoDesde(
  dep: Dependencia,
  fuente: Fuente,
): string | undefined {
  // Directorio: la LISTA de archivos, no su contenido.
  if (dep.endsWith("/")) {
    const entradas = fuente.listar(dep.slice(0, -1));
    return entradas?.length ? entradas.join("\n") : undefined;
  }

  const [ruta, fragmento] = dep.split("#");
  if (!ruta) return undefined;
  const texto = fuente.leer(ruta);
  if (texto === undefined) return undefined;
  if (!fragmento) return texto;

  // Qué significa el `#` lo decide la EXTENSIÓN, no una heurística sobre el
  // fragmento: en un `.md` es un titular, en cualquier otro sitio una
  // declaración exportada.
  const cuerpo = ruta.endsWith(".md")
    ? seccionDeMarkdown(texto, fragmento)
    : declaracionDeCodigo(texto, fragmento);
  // Un titular existe pero está vacío = la sección se vació sin borrarla. Cuenta
  // como rota: no hay nada que sellar.
  return cuerpo && cuerpo.trim().length > 0 ? cuerpo : undefined;
}

/**
 * El contenido que representa una dependencia, o `undefined` si no resuelve
 * —archivo que ya no está, fragmento que ya no existe—. Las dos cosas son
 * fallos que hay que ver, no motivo para hashear la cadena vacía y seguir: un
 * hash estable sobre una fuente desaparecida es el metro que aprueba porque no
 * ha mirado.
 */
export function contenidoDe(dep: Dependencia): string | undefined {
  return contenidoDesde(dep, DEL_DISCO);
}

/** Por qué una dependencia no resolvió, dicho por su FORMA. Sale a informe, así
 *  que la frase tiene que bastar para arreglarla sin abrir el código. */
export function porQueNoResuelve(dep: Dependencia): string {
  if (dep.endsWith("/")) return "el directorio no existe o está vacío";
  if (dep.includes("#")) {
    const [ruta] = dep.split("#");
    return ruta?.endsWith(".md")
      ? "el fragmento ya no existe en ese archivo"
      : "esa declaración ya no se exporta con ese nombre (o no se entiende dónde acaba)";
  }
  return "el archivo no existe";
}

/**
 * `bloque → sha256`, más las dependencias que no resolvieron.
 *
 * UN SELLO POR BLOQUE, no uno global. Es la diferencia entre un guardián que se
 * usa y una alarma que se apaga: un hash único diría «esta página ha cambiado de
 * contexto» y dejaría el trabajo entero —encontrar QUÉ párrafo— a quien lee el
 * rojo. Un sello por bloque dice «mira los Límites», que es una tarea de dos
 * minutos.
 *
 * Y EL NOMBRE DE LA DEPENDENCIA ENTRA EN EL HASH: cambiar de qué depende un
 * bloque también tiene que invalidar su sello.
 *
 * EL SEPARADOR ES UN NUL, y no es capricho: un espacio aparece dentro del
 * contenido, así que con espacio dos listas distintas de dependencias pueden
 * concatenar igual. Va escrito como escape (`\0`) y no como el byte literal que
 * tenía el original — el byte hacía que `grep` tratase el archivo como BINARIO y
 * lo dejara fuera de toda búsqueda de texto, que es cómo esta copia se escribió
 * con un espacio y estuvo a punto de re-sellar las doce secciones del artículo
 * como si hubieran cambiado (2026-08-28).
 */
export function huellaPorBloque<Id extends string>(
  bloques: readonly Id[],
  dependencias: Record<Id, readonly Dependencia[]>,
): { sellos: Map<Id, string>; rotas: Rota<Id>[]; dependencias: number } {
  const sellos = new Map<Id, string>();
  const rotas: Rota<Id>[] = [];
  let contadas = 0;

  for (const bloque of bloques) {
    const hash = createHash("sha256");
    for (const dep of dependencias[bloque]) {
      contadas++;
      const contenido = contenidoDe(dep);
      if (contenido === undefined) {
        rotas.push({ seccion: bloque, dep, motivo: porQueNoResuelve(dep) });
        continue;
      }
      hash.update(dep).update("\0").update(contenido).update("\0");
    }
    sellos.set(bloque, hash.digest("hex"));
  }

  return { sellos, rotas, dependencias: contadas };
}
