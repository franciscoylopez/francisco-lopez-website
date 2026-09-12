/**
 * El kit de marca completo, en un archivo — `/api/kit.zip`.
 *
 * LA EXTENSIÓN DEL SEGMENTO ES FUNCIONAL, NO DECORACIÓN (2026-09-12, P72.64). La
 * medición mejorada de GA4 dispara `file_download` al pulsar un enlace cuya URL
 * termina en una extensión conocida de archivo, y lo decide **leyendo el `href`**:
 * no mira el `Content-Type` ni el `Content-Disposition` de aquí abajo, que existen
 * y no le sirven. Mientras esto se llamó `/api/kit` el evento **no podía dispararse
 * nunca**, así que el ZIP era la única descarga del sitio invisible para la
 * analítica — y su cero se leyó durante tres cierres como «nadie lo descarga».
 * Renombrar el segmento a `kit.zip` es lo que conserva la propiedad que D19 eligió
 * a propósito: que el evento salga **de fábrica**, sin JS de cliente que mantener.
 * Si alguien limpia el `.zip` del nombre por parecerle ruido, apaga la medición.
 *
 * SE GENERA EN EL BUILD, NO SE COMMITEA. `force-static` hace que Next ejecute esto
 * una vez al construir y sirva el resultado como asset estático. La consecuencia es
 * la que importa: **el kit no puede quedarse viejo por construcción**. Lee
 * `public/logo-kit/` en el momento de construir, así que añadir, cambiar o borrar
 * un asset se refleja en el ZIP sin que nadie tenga que acordarse de regenerarlo,
 * sin binario en git que se recommitea entero en cada cambio, y sin un guardián que
 * vigile una desincronización que aquí no puede ocurrir.
 *
 * QUÉ LLEVA DENTRO: todo lo que hay en `public/logo-kit/`, que son más archivos de
 * los que la página ofrece sueltos. La diferencia es deliberada y está contada en
 * `lib/logo-kit.ts`: hay piezas que existen y no tienen tarjeta propia. El `LEEME`
 * de dentro las nombra, para que quien descomprima no se encuentre archivos que la
 * página no menciona.
 *
 * VA BAJO `/api/` POR EL PROXY. `proxy.ts` reescribe cualquier ruta a `/{lang}/...`
 * y su matcher excluye `api`, así que aquí llega tal cual. Fuera de `/api` habría
 * que tocar el proxy.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join, relative, sep } from "node:path";

import { CARPETA_KIT, leemeDelKit, RAIZ_KIT } from "@/lib/logo-kit";
import { creaZip, type EntradaZip } from "@/lib/zip";

export const dynamic = "force-static";

/** Todo lo que cuelga de `public/logo-kit/`, en orden estable. */
function archivosDelKit(): string[] {
  const raiz = join(process.cwd(), RAIZ_KIT);
  const encontrados: string[] = [];

  const baja = (dir: string) => {
    for (const entrada of readdirSync(dir, { withFileTypes: true })) {
      const ruta = join(dir, entrada.name);
      if (entrada.isDirectory()) baja(ruta);
      else encontrados.push(ruta);
    }
  };
  baja(raiz);

  // Orden alfabético por ruta relativa: sin esto el ZIP dependería del orden en que
  // el sistema de archivos devuelva las entradas, y dejaría de ser reproducible.
  return encontrados.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}

export function GET() {
  const raiz = join(process.cwd(), RAIZ_KIT);
  const archivos = archivosDelKit();

  if (!archivos.length) {
    // Un kit vacío se descargaría sin dar error y nadie se enteraría hasta que
    // alguien lo abriera. Mejor romper el build.
    throw new Error(
      `/api/kit.zip: no hay ni un archivo bajo \`${RAIZ_KIT}\`. El kit no puede ser un ZIP vacío.`,
    );
  }

  const entradas: EntradaZip[] = archivos.map((ruta) => ({
    nombre: `${CARPETA_KIT}/${relative(raiz, ruta).split(sep).join("/")}`,
    datos: readFileSync(ruta),
  }));

  // El LEEME va el último para que su contenido pueda hablar de lo que hay dentro.
  entradas.push({
    nombre: `${CARPETA_KIT}/LEEME.txt`,
    datos: Buffer.from(leemeDelKit(entradas.length), "utf8"),
  });

  const zip = creaZip(entradas);

  return new Response(new Uint8Array(zip), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${CARPETA_KIT}.zip"`,
      "Content-Length": String(zip.length),
    },
  });
}
