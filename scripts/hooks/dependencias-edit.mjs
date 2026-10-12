// Hook PostToolUse: al editar un documento del que un sello DECLARA depender, se
// dice qué sección hay que releer — en el momento de tocarlo.
//
// POR QUÉ EXISTE (2026-09-05, P72.52). Los dos sellos de este repo —el del
// artículo y el de `/accesibilidad`— no dicen que un párrafo sea falso: dicen que
// una FUENTE se movió y que hay que mirarlo. Y quien mueve la fuente casi nunca
// sabe que hay un párrafo colgando de ella: se corrige una cifra de `PRD-Live` §7
// o se compacta una sección de `BRAND.md`, y la sección del artículo que dependía
// de eso se entera diez minutos después, en CI, dentro de un run rojo.
//
// Medido: la sesión del 2026-09-04 disparó el hook de Stop DOS veces, las dos por
// `check:articulo`, y las dos por editar un documento declarado como dependencia.
// Una de ellas destapó que el artículo publicaba una afirmación falsa sobre
// privacidad, así que el aviso valía — pero llegaba al cerrar el turno, cuando la
// edición ya estaba hecha y el contexto de por qué se hizo, medio olvidado.
//
// EL DISPARADOR MIRA DONDE OCURRE LA COSA (regla 1 de `BRAND.md` §Cómo se escribe
// una regla), y aquí «la cosa» es la edición del documento, no el cierre del turno
// ni el push.
//
// CÓMO SABE SI ESTE ARCHIVO LE IMPORTA A ALGUIEN. Lee las dos declaraciones
// —`content/articulo/dependencias.ts` y `content/accesibilidad/dependencias.ts`—
// como TEXTO y saca sus cadenas. No las importa ni las parsea: un falso positivo
// solo cuesta correr un guardián de 1,5 s de más, y un parser propio sería la
// segunda fuente de verdad de algo que ya tiene la suya. Lo que NO puede pasar es
// un falso negativo, y por eso se sacan todas las cadenas del archivo —comentarios
// incluidos— en vez de intentar entender su estructura.
//
// Y QUIÉN NOMBRA LA SECCIÓN ES EL GUARDIÁN, no este hook. Solo decide si vale la
// pena preguntárselo. Un mapa propio de archivo → sección sería otra vez la
// segunda fuente de verdad, y además caducaría con la primera declaración nueva.
//
// AVISA UNA VEZ POR EPISODIO, que es lo que lo separa de `palette-guard.mjs`. Un
// rojo de paleta se arregla en la edición siguiente; un sello en rojo se queda
// rojo hasta que alguien lea el párrafo y decida, o sea durante toda la tanda de
// edición. Bloquear cada edición posterior convertiría el aviso en ruido y el
// ruido en `--no-verify`. Así que se marca el episodio en el temporal del sistema:
// mientras siga rojo, silencio; cuando vuelva a verde, la marca se borra y el
// próximo rojo vuelve a avisar. Quien impide que se empuje así es el pre-push.

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

/** Los dos sellos que declaran de qué dependen, y dónde lo declaran. */
const SELLOS = [
  {
    guardian: "check:articulo",
    declaracion: "content/articulo/dependencias.ts",
    que: "«Cómo se ha creado esta página»",
  },
  {
    guardian: "check:accesibilidad",
    declaracion: "content/accesibilidad/dependencias.ts",
    que: "/accesibilidad",
  },
];

const leerEvento = async () => {
  try {
    const trozos = [];
    for await (const trozo of process.stdin) trozos.push(trozo);
    return JSON.parse(Buffer.concat(trozos).toString("utf8"));
  } catch {
    return null;
  }
};

const evento = await leerEvento();
const archivo = evento?.tool_input?.file_path;
if (!archivo) process.exit(0);

// Ruta relativa a la raíz y con separadores POSIX, para comparar igual en Windows.
const rel = resolve(archivo)
  .slice(ROOT.length + 1)
  .replace(/\\/g, "/");

/**
 * Una dependencia se escribe `ruta`, `ruta#ancla` o `directorio/`. El ancla no se
 * mira aquí: quien sabe si la sección tocada es la declarada es el guardián.
 */
const declara = (texto) =>
  [...texto.matchAll(/"([^"\n]+)"/g)]
    .map((m) => m[1].split("#")[0])
    .some((dep) => (dep.endsWith("/") ? rel.startsWith(dep) : dep === rel));

const marca = (guardian) =>
  join(tmpdir(), `sello-${guardian.replace(/[^a-z]/g, "-")}.rojo`);

for (const sello of SELLOS) {
  const declaracion = join(ROOT, sello.declaracion);
  if (!existsSync(declaracion)) continue;
  if (!declara(readFileSync(declaracion, "utf8"))) continue;

  const run = spawnSync("npm", ["run", sello.guardian, "--silent"], {
    cwd: ROOT,
    encoding: "utf8",
    shell: true,
  });

  const testigo = marca(sello.guardian);

  if (run.status === 0) {
    // Volvió a verde: se cierra el episodio para que el próximo rojo avise.
    if (existsSync(testigo)) rmSync(testigo, { force: true });
    continue;
  }

  if (existsSync(testigo)) continue;
  writeFileSync(testigo, rel);

  const informe = `${run.stdout ?? ""}${run.stderr ?? ""}`.trim();
  console.error(
    `Acabas de editar ${rel}, del que ${sello.que} declara depender, y su sello ` +
      `está en rojo. No dice que el texto sea falso: dice que hay que mirarlo ` +
      `AHORA, que es cuando sabes por qué lo has cambiado.\n\n${informe}\n\n` +
      "Este aviso sale una vez por episodio; el que no dejará empujar es el pre-push.",
  );
  process.exit(2);
}

process.exit(0);
