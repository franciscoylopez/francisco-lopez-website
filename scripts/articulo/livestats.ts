/**
 * Comprobación 5 de `check:articulo` — un «dato en vivo» no puede estar tecleado.
 *
 * El hueco que las cuatro comprobaciones anteriores NO cubren, y que se encontró
 * leyendo, no midiendo (P68.495): las cuatro giran alrededor de las dependencias
 * DECLARADAS, y un número escrito dentro de un `value` no declara nada. La pieza
 * se llama `livestat` y su etiqueta dice «dato en vivo»; de los tres que había,
 * dos eran cifras a mano y las dos ya mentían.
 *
 * Comprobación de AUSENCIA, como el resto de la casa: no se busca un número
 * sospechoso, se busca que FALTE la interpolación. Y de paso, que el token
 * exista: `{psiMovil}` con una ele de más no rompe nada, se publica con las
 * llaves puestas.
 */
import { FIGURAS } from "../../lib/figures";
import { DICCIONARIOS } from "./diccionarios";

type LiveStat = { id?: string; value?: string; source?: string };

function liveStats(nodo: unknown, acc: LiveStat[] = []): LiveStat[] {
  if (Array.isArray(nodo)) {
    for (const hijo of nodo) liveStats(hijo, acc);
    return acc;
  }
  if (nodo && typeof nodo === "object") {
    const o = nodo as Record<string, unknown>;
    if (o.type === "livestat") acc.push(o as LiveStat);
    for (const k of Object.keys(o)) liveStats(o[k], acc);
  }
  return acc;
}

export function revisaLiveStats(): { problemas: string[]; vistos: number } {
  const problemas: string[] = [];
  let vistos = 0;

  for (const { dict, ruta } of DICCIONARIOS) {
    for (const ls of liveStats(dict)) {
      vistos += 1;
      const texto = `${ls.value ?? ""} ${ls.source ?? ""}`;
      const tokens = [...texto.matchAll(/{(\w+)}/g)].map((m) => m[1] as string);

      if (!tokens.length)
        problemas.push(
          `el livestat «${ls.id}» de ${ruta} promete un DATO EN VIVO y su valor está ` +
            `tecleado: «${ls.value}». Tiene que interpolar una cifra derivada ` +
            `(${FIGURAS.map((n: string) => `{${n}}`).join(", ")}) — ver lib/figures.ts.`,
        );

      for (const token of tokens)
        if (!(FIGURAS as readonly string[]).includes(token))
          problemas.push(
            `el livestat «${ls.id}» de ${ruta} interpola «{${token}}», que no es una ` +
              `cifra derivada. Se publicaría con las llaves puestas. Las que hay: ` +
              `${FIGURAS.join(", ")}.`,
          );
    }
  }

  return { problemas, vistos };
}
