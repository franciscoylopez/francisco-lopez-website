import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { fallo, vistos } from "./informe";

/* -------------------------------------------------------------------------- */
/* 5. Que una ruta inexistente siga siendo un 404                              */
/* -------------------------------------------------------------------------- */

/**
 * POR ESTRUCTURA Y NO POR PETICIÓN, y conviene saber la diferencia. Lo que de
 * verdad convierte los 404 de un sitio en 200 es un segmento CATCH-ALL
 * (`[...algo]` o `[[...algo]]`) que acepte cualquier cosa y renderice: a partir
 * de ahí, cualquier URL inventada responde 200 con contenido vacío, y para un
 * agente eso es peor que un error, porque parece una página.
 *
 * Este sitio hoy tiene dos segmentos dinámicos y los dos están acotados —`[lang]`
 * a los locales y `[slug]` a las experiencias con página—, así que lo que se
 * vigila es que no aparezca un tercero sin acotar.
 *
 * Hacer la petición de verdad necesitaría servidor, y este gate corre en CI sin
 * uno; queda declarado arriba, en «lo que no mira».
 */
export function revisarCatchAll(): void {
  const baja = (dir: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (!e.isDirectory() || e.name === "node_modules") continue;
      if (e.name.startsWith("[")) {
        vistos.segmentosDinamicos++;
        if (e.name.includes("...")) {
          fallo(
            "404",
            `\`app/\` tiene un segmento catch-all (\`${e.name}\`). Con uno, cualquier ` +
              "URL inventada responde 200 en vez de 404, y para un agente una página " +
              "vacía es peor que un error: parece contenido.",
          );
        }
      }
      baja(join(dir, e.name));
    }
  };
  baja("app");

  if (!existsSync(join("app", "global-error.tsx"))) {
    fallo(
      "404",
      "no hay `app/global-error.tsx`, y el sitio publica páginas de error de marca.",
    );
  }
}
