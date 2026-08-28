/**
 * ¿Qué secciones publicadas toca este PR? — `npm run novedades`, en CI.
 *
 * LO QUE PIDIÓ FRANCISCO, con sus palabras: «necesito que cuando se cambie algo
 * automáticamente en el artículo o en otra sección se me avise de forma explícita
 * antes de subir, algo como *esta PR modifica Artículo secciones 1, 2, 6
 * añadiendo/modificando X, Y, Z*, para poder revisarlo».
 *
 * POR QUÉ NO BASTABA LO QUE HABÍA. Las dos piezas existían y ninguna llegaba:
 * `articulo:novedades` dice qué líneas se movieron, pero **no está en CI** y solo
 * lo ve quien lo lanza a mano; `check:articulo` sí está en CI, pero **en verde
 * solo dice «el sello cuadra»** y no nombra ninguna sección. Es la familia «la
 * regla sin portador»: la herramienta escrita y nadie que la dispare.
 *
 * Y HAY UN MOTIVO POR EL QUE NO VALE REUTILIZAR `articulo:novedades` AQUÍ: aquel
 * compara contra el **sello vigente**, y para cuando el PR llega a CI su autor ya
 * ha re-sellado, así que no queda diferencia que contar. La pregunta de un PR es
 * otra —**qué cambia respecto a `main`**— y se contesta comparando las dos puntas.
 *
 * QUÉ DISTINGUE, que es lo que decide si sirve. **Copy** de **dependencia**:
 *
 * - *Cambió el copy* → hay que leerlo. Es texto que un visitante va a ver.
 * - *Se movió el sello* → casi nunca hay que leerlo: los permalinks a
 *   `DECISIONS.md` se desplazan solos con cada entrada nueva. El 2026-08-27 eso
 *   movió 82 líneas de HTML sin cambiar una palabra.
 *
 * DÓNDE SALE. En el **resumen del job** (`$GITHUB_STEP_SUMMARY`), que es donde se
 * lee un PR, no enterrado en un log de cuatrocientas líneas. Fuera de CI escribe
 * por pantalla, y sirve igual antes de abrir el PR.
 *
 * NUNCA FALLA. Informa; no juzga. Un aviso que puede poner un PR en rojo se acaba
 * ignorando o silenciando, y lo que hace falta aquí es que se lea.
 */
import { execFileSync } from "node:child_process";
import { appendFileSync, existsSync, readFileSync } from "node:fs";

/** Las dos superficies con sello POR SECCIÓN. Añadir una tercera es añadir aquí
 *  su fila: el guardián de esa página ya trae el sello y el diccionario. */
const SUPERFICIES = [
  {
    nombre: "Artículo «Cómo se ha creado esta página»",
    huella: "content/articulo/articulo.huella",
    copy: [
      "app/[lang]/dictionaries/es/como-se-ha-creado.json",
      "app/[lang]/dictionaries/en/como-se-ha-creado.json",
    ],
    /** Cómo se parte ese diccionario en secciones nombrables. */
    partir: (d: Record<string, unknown>) => {
      const secciones = (d.sections ?? []) as { id?: string }[];
      return new Map(
        secciones.map((s, i) => [s.id ?? `#${i}`, JSON.stringify(s)]),
      );
    },
  },
  {
    nombre: "Página de accesibilidad",
    huella: "content/accesibilidad/accesibilidad.huella",
    copy: [
      "app/[lang]/dictionaries/es/accesibilidad.json",
      "app/[lang]/dictionaries/en/accesibilidad.json",
    ],
    partir: (d: Record<string, unknown>) =>
      new Map(
        Object.entries(d).map(([clave, valor]) => [
          clave,
          JSON.stringify(valor),
        ]),
      ),
  },
];

const base = process.argv[2] ?? process.env.BASE_REF ?? "origin/main";

/** El contenido de un archivo en un commit, o `undefined` si allí no existía. */
function enBase(ruta: string): string | undefined {
  try {
    return execFileSync("git", ["show", `${base}:${ruta}`], {
      encoding: "utf8",
      maxBuffer: 32 * 1024 * 1024,
      // stderr al vacío: que un archivo no exista en la base es LO NORMAL en un PR
      // que lo crea, y el `fatal:` de git ahí solo asusta.
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch {
    return undefined;
  }
}

function baseAlcanzable(): boolean {
  try {
    execFileSync("git", ["rev-parse", "--verify", `${base}^{commit}`], {
      stdio: "pipe",
    });
    return true;
  } catch {
    return false;
  }
}

/** `s07 hash` por línea, saltando comentarios. Vale para los dos sellos. */
function sello(texto: string | undefined): Map<string, string> {
  if (!texto) return new Map();
  return new Map(
    texto
      .split("\n")
      .filter((l) => l.trim() && !l.startsWith("#"))
      .map((l) => l.trim().split(/\s+/) as [string, string]),
  );
}

const lineas: string[] = [];
const di = (l = "") => lineas.push(l);

di("## Qué secciones publicadas toca este PR");
di();

if (!baseAlcanzable()) {
  // NO se calla: sin base no hay comparación, y una salida vacía se leería como
  // «no cambia nada», que es el verde falso de siempre.
  di(
    `> No se ha podido resolver \`${base}\`, así que **esto no ha comparado nada**. ` +
      "Si corre en CI, el checkout necesita `fetch-depth: 0`.",
  );
} else {
  let algo = false;

  for (const s of SUPERFICIES) {
    // 1 · EL COPY, que es lo que hay que leer.
    const seccionesTocadas = new Set<string>();
    for (const ruta of s.copy) {
      if (!existsSync(ruta)) continue;
      const ahora = s.partir(
        JSON.parse(readFileSync(ruta, "utf8")) as Record<string, unknown>,
      );
      const antesTexto = enBase(ruta);
      const antes = antesTexto
        ? s.partir(JSON.parse(antesTexto) as Record<string, unknown>)
        : new Map<string, string>();
      for (const [clave, valor] of ahora) {
        if (antes.get(clave) !== valor) seccionesTocadas.add(clave);
      }
      for (const clave of antes.keys()) {
        if (!ahora.has(clave)) seccionesTocadas.add(`${clave} (retirada)`);
      }
    }

    // 2 · EL SELLO, que casi nunca hay que leer.
    const ahoraSello = existsSync(s.huella)
      ? sello(readFileSync(s.huella, "utf8"))
      : new Map<string, string>();
    const antesSello = sello(enBase(s.huella));
    const sellosMovidos = [...ahoraSello]
      .filter(([k, v]) => antesSello.has(k) && antesSello.get(k) !== v)
      .map(([k]) => k);

    if (seccionesTocadas.size === 0 && sellosMovidos.length === 0) continue;
    algo = true;

    di(`### ${s.nombre}`);
    di();
    if (seccionesTocadas.size > 0) {
      di(
        `**Cambia el texto de ${seccionesTocadas.size} sección(es):** ` +
          [...seccionesTocadas]
            .sort()
            .map((x) => `\`${x}\``)
            .join(" · "),
      );
      di();
      di("Esto lo lee un visitante: conviene releerlo antes de mergear.");
      di();
    }
    if (sellosMovidos.length > 0) {
      di(
        `**Se ha re-sellado ${sellosMovidos.length} sección(es):** ` +
          sellosMovidos.map((x) => `\`${x}\``).join(" · "),
      );
      di();
      di(
        "Se movió una FUENTE que esa sección describe, no necesariamente el texto. " +
          "`npm run articulo:novedades` dice qué líneas.",
      );
      di();
    }
  }

  if (!algo) {
    di(
      "Ninguna sección del artículo ni de la página de accesibilidad cambia de " +
        "texto ni de sello en este PR.",
    );
    di();
  }

  di(
    `<sub>Comparado contra \`${base}\` · ${SUPERFICIES.length} superficie(s) con sello por sección.</sub>`,
  );
}

const salida = lineas.join("\n") + "\n";
const resumen = process.env.GITHUB_STEP_SUMMARY;
if (resumen) appendFileSync(resumen, salida, "utf8");
console.log(`\n${salida}`);
