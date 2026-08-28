/**
 * ¿Siguen vivos los enlaces que el sitio publica? — `npm run check:enlaces`.
 *
 * POR QUÉ EXISTE. El sitio enlaza fuera desde la página que presume de no mentir.
 * P70.105 le añadió cinco enlaces a `/accesibilidad` —WCAG, axe-core, Lighthouse,
 * NV Access, The A11Y Project—, se comprobaron **a mano** al cerrarla, y eso es
 * exactamente el modo de fallo del que avisa `BRAND.md` §Cómo se escribe una
 * regla, punto 2: *una regla que hay que recordar es una regla que se incumple*.
 *
 * Y duele más aquí que en otro sitio: **el 404 lo sirve un tercero**, así que no
 * aparece en ningún gate nuestro y no lo ve nadie hasta que lo encuentra un
 * lector. Un enlace muerto en `/accesibilidad` cuesta el doble que en cualquier
 * otra página.
 *
 * DÓNDE CORRE, Y POR QUÉ NO EN CI. Sale a la red. Un servidor ajeno caído cinco
 * minutos pondría un PR en rojo sin que nada de este repo esté mal, que es el
 * argumento de D49/D99 para dejar `psi` fuera. Mismo régimen que `censo`, `psi` y
 * `check:tablero`: **comando a demanda**, y su sitio natural es antes de un
 * release. El CRITERIO sí está vigilado siempre, en `scripts/enlaces/reglas.ts`,
 * que lo prueba `npm test`.
 *
 * QUÉ CUENTA COMO MUERTO, que es donde un metro así se equivoca. **404, 410 y 5xx**
 * más el DNS que no resuelve y el tiempo agotado. **Un 403 o un 405 NO**: varios
 * sitios los devuelven a un cliente que no parece navegador, así que se manda un
 * User-Agent de navegador, se siguen las redirecciones, y se prueba primero con
 * `HEAD` y se reintenta con `GET` — hay servidores que solo rechazan el `HEAD`.
 *
 * DE DÓNDE SALE LA LISTA: del DISCO, recorriendo el copy y el código, nunca de una
 * lista escrita. Un enlace nuevo entra en la comprobación sin que nadie se
 * acuerde, igual que una página entra en el censo por `PAGE_SLUGS` (D72).
 *
 * Y AFIRMA CUÁNTO HA MIRADO, con guarda de cero: cuántas URL ha encontrado,
 * cuántas ha descartado **y por qué**, y cuántas ha pedido. Un metro que devuelve
 * lista vacía parece un aprobado, y este repo se lo ha encontrado cinco veces.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

import {
  clasificar,
  redirigido,
  urlsDe,
  veredictoDe,
  type Hallada,
  type Veredicto as Juicio,
} from "./enlaces/reglas";

/** Dónde se busca: el copy que se sirve y el código que lo pinta. */
const RAICES = ["app", "components", "content", "lib"];
const EXTENSIONES = [".ts", ".tsx", ".json", ".md", ".mmd", ".css"];
const FUERA = new Set(["node_modules", ".next", "dist"]);

/** Un navegador de verdad: varios servidores rechazan al cliente que no lo parece. */
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

const TIMEOUT_MS = 15_000;

function archivos(dir: string): string[] {
  let salida: string[] = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (FUERA.has(e.name)) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) salida = salida.concat(archivos(p));
    else if (EXTENSIONES.some((x) => e.name.endsWith(x))) salida.push(p);
  }
  return salida;
}

const halladas: Hallada[] = [];
let leidos = 0;
for (const raiz of RAICES) {
  if (!statSync(raiz, { throwIfNoEntry: false })?.isDirectory()) continue;
  for (const archivo of archivos(raiz)) {
    leidos++;
    halladas.push(...urlsDe(readFileSync(archivo, "utf8"), archivo));
  }
}

const { enlaces, descartadas } = clasificar(halladas);

console.log(
  `\ncheck:enlaces — ${leidos} archivo(s) leídos · ${enlaces.length} enlace(s) ` +
    `externos · ${descartadas.length} descartado(s)`,
);
for (const d of descartadas) {
  console.log(`  – ${d.url}  (${d.motivo})`);
}

if (enlaces.length === 0) {
  console.error(
    "\ncheck:enlaces — NO HA MIRADO NADA. Con cero enlaces esto aprobaría siempre,\n" +
      "así que falla a propósito. ¿Ha cambiado el patrón de búsqueda o las raíces?\n",
  );
  process.exit(1);
}

type Veredicto = {
  enlace: Hallada;
  estado: string;
  juicio: Juicio;
  nota?: string;
};

async function comprobar(enlace: Hallada): Promise<Veredicto> {
  const pedir = async (method: "HEAD" | "GET") =>
    fetch(enlace.url, {
      method,
      redirect: "follow",
      headers: { "user-agent": UA, accept: "*/*" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

  try {
    let r = await pedir("HEAD");
    // Hay servidores que solo rechazan el HEAD. Antes de puntuar nada, se
    // reintenta con GET: la alternativa es inventarse un hallazgo.
    if (r.status === 403 || r.status === 405 || r.status >= 500)
      r = await pedir("GET");

    const nota = redirigido(enlace.url, r.url)
      ? `redirige a ${r.url}`
      : undefined;
    return {
      enlace,
      estado: String(r.status),
      juicio: veredictoDe(r.status),
      nota,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    // Un fallo de red SÍ cuenta: DNS que no resuelve y tiempo agotado son las dos
    // formas en que un dominio muere de verdad.
    return { enlace, estado: "sin respuesta", juicio: "muerto", nota: msg };
  }
}

async function main() {
  const veredictos = await Promise.all(enlaces.map(comprobar));
  veredictos.sort((a, b) => a.enlace.url.localeCompare(b.enlace.url));

  console.log("");
  for (const v of veredictos) {
    const marca =
      v.juicio === "muerto"
        ? "✗"
        : v.juicio === "no concluyente"
          ? "?"
          : v.nota
            ? "→"
            : "·";
    console.log(
      `  ${marca} ${v.estado.padEnd(13)} ${v.enlace.url}` +
        (v.nota ? `\n      ${v.nota}` : ""),
    );
  }

  const muertos = veredictos.filter((v) => v.juicio === "muerto");
  const dudosos = veredictos.filter((v) => v.juicio === "no concluyente");
  const redirigidos = veredictos.filter((v) => v.juicio === "vivo" && v.nota);

  if (muertos.length === 0) {
    console.log(
      `\n✓ Ninguno de los ${enlaces.length} enlaces externos está caído.` +
        (dudosos.length > 0
          ? ` ${dudosos.length} responde(n) con un código que NO concluye` +
            " (escudo antibot o acceso restringido): se miran a ojo, no fallan."
          : "") +
        (redirigidos.length > 0
          ? ` ${redirigidos.length} redirige(n) a otra ruta: no falla, pero una` +
            " redirección que desaparezca es el 404 de mañana."
          : "") +
        "\n",
    );
    process.exit(0);
  }

  console.error(
    `\ncheck:enlaces — ${muertos.length} enlace(s) que no responden:\n`,
  );
  for (const v of muertos) {
    console.error(`  · ${v.enlace.url}`);
    console.error(
      `      en ${v.enlace.archivo} · ${v.estado}${v.nota ? ` · ${v.nota}` : ""}\n`,
    );
  }
  console.error(
    "El 404 de un enlace saliente lo sirve un tercero, así que no sale en ningún\n" +
      "gate de este repo: lo encuentra un lector. Corrige la URL o retira el enlace,\n" +
      "y en el copy hazlo en ES y EN (D20).\n",
  );
  process.exit(1);
}

//  compila a CJS, donde el await de nivel superior no existe.
void main();
