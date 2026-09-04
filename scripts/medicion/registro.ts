/**
 * El sello del check de medición — lo escribe `npm run medicion -- --sellar`, lo
 * lee la pasada siguiente para contestar la pregunta 2 del check.
 *
 * QUÉ PROBLEMA RESUELVE. `sprint-review` §12 pregunta «¿ha cambiado algo desde el
 * cierre anterior?», y eso **depende de que alguien se acordara de escribir el
 * número anterior**. Hasta hoy se escribía en prosa, dentro de una entrada de
 * `DECISIONS.md`: el «45 usuarios» del cierre de julio hubo que sacarlo grepeando.
 * Es exactamente el modo de fallo que este repo lleva doce D-entries corrigiendo,
 * y la salida que ya funciona está a la vista: `psi -- --registro` sella lo que
 * midió y el artículo lo publica sin teclearlo (D102).
 *
 * QUÉ SE SELLA, y la mitad importante es la segunda:
 *
 *   1. Las cifras que la pasada consiguió leer, con la ventana a la que se
 *      refieren. Sin ventana una cifra de analítica no significa nada: son 28
 *      días rodantes y una caída puede ser solo que los eventos viejos salieron.
 *   2. **Las fuentes que NO se pudieron leer, con su motivo.** Un sello que
 *      omitiera esa lista se leería igual que uno completo, que es la definición
 *      de un metro que engaña. Cuatro fuentes hay; el sello dice siempre cuatro.
 *   3. **Con qué instrumento se tomó cada cifra** *(D199)*, para que dos lecturas
 *      hechas con metros distintos no se resten. Sin ese campo, el primer sello
 *      del contador de consentimiento —que viajó en el mismo commit que cambiaba
 *      el metro— convirtió la deflación retirada en «+46 de tráfico».
 *
 * LO QUE NO PROMETE. No dice que la medición esté bien: dice qué se leyó, cuándo y
 * qué no. Juzgarlo sigue siendo del cierre.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

export const MEDICION_REGISTRO = "scripts/medicion/registro.json";

/** Las cuatro fuentes del check, en el orden en que se leen. */
export const FUENTES = [
  "ga4",
  "looker",
  "consentimiento",
  "vercel-web-analytics",
] as const;

export type Fuente = (typeof FUENTES)[number];

export interface FuenteSellada {
  fuente: Fuente;
  /** `leida` · `ilegible` · `no-aporta`. Tres estados, no dos. */
  estado: "leida" | "ilegible" | "no-aporta";
  /** Obligatorio salvo en `leida`: por qué no hay cifra. */
  motivo?: string;
  /** Lo leído, con la forma que le toque a cada fuente. */
  cifras?: Record<string, number | null>;
  /** `true` cuando la cifra la tecleó una persona (GA4 hoy). */
  aMano?: boolean;
  /**
   * CON QUÉ METRO SE TOMÓ ESTA CIFRA *(D199)*. Es lo que separa una serie de dos
   * series pegadas: si no coincide con la del sello anterior, `comparaConAnterior`
   * **avisa en vez de restar**.
   *
   * No se compara su contenido, solo su **identidad**: cualquier cadena vale
   * mientras cambie cuando cambie el instrumento. `undefined` significa «no se
   * anotó», y eso tampoco se resta — es justo el caso que produjo el defecto.
   */
  instrumento?: string;
}

export interface RegistroMedicion {
  /** El día en que se selló, no el de la ventana. */
  fecha: string;
  /** A qué periodo se refieren las cifras de analítica. */
  ventana: { desde: string; hasta: string };
  /** Qué etapa se estaba cerrando. Sin esto, dos sellos seguidos no se ordenan. */
  etapa: string;
  fuentes: FuenteSellada[];
}

export function leeRegistro(): RegistroMedicion | null {
  if (!existsSync(MEDICION_REGISTRO)) return null;
  return JSON.parse(
    readFileSync(MEDICION_REGISTRO, "utf8"),
  ) as RegistroMedicion;
}

export function escribeRegistro(registro: RegistroMedicion): void {
  mkdirSync(dirname(MEDICION_REGISTRO), { recursive: true });
  writeFileSync(MEDICION_REGISTRO, `${JSON.stringify(registro, null, 2)}\n`);
}

/**
 * Qué ha cambiado entre dos sellos, cifra a cifra. Devuelve líneas ya formateadas
 * porque el destinatario es una persona leyendo una consola, no otro programa.
 *
 * UNA CIFRA QUE APARECE O DESAPARECE ES UN CAMBIO, y de los que más importan: que
 * una fuente pase de legible a ilegible es justo el suceso que el cierre anterior
 * no supo contar. Por eso no se comparan solo los números.
 */
/** Cómo se nombra un instrumento que el sello anterior no llegó a anotar. */
const nombraInstrumento = (i?: string) => i ?? "sin anotar";

/**
 * Qué decir de UNA fuente, comparando sus dos lecturas. Vive aparte de
 * `comparaConAnterior` porque el trinquete de deuda marcó la función entera al
 * meterle la regla del instrumento, y porque son dos preguntas distintas: aquí,
 * qué le pasó a una fuente; allí, cómo se ordena el informe.
 *
 * EL INSTRUMENTO MANDA SOBRE LA RESTA (D199). El primer sello del contador de
 * consentimiento viajó en el mismo commit que subió el techo del limitador de 10 a
 * 100 por hora y por IP, así que el `13 → 59 (+46)` de la pasada siguiente se leía
 * como crecimiento de tráfico y era, sobre todo, la deflación que se acababa de
 * quitar. Una resta entre dos metros distintos no es un cero de más ni de menos: es
 * un número que no significa nada, y encima con toda la pinta de significar algo.
 */
function lineasDeFuente(
  fuente: Fuente,
  antes: FuenteSellada,
  ahora: FuenteSellada,
): string[] {
  if (antes.estado !== ahora.estado) {
    return [
      `  ${fuente}: ${antes.estado} → ${ahora.estado}` +
        (ahora.motivo ? ` (${ahora.motivo})` : ""),
    ];
  }
  if (ahora.estado !== "leida") return [];

  const mismoMetro = antes.instrumento === ahora.instrumento;
  const lineas = mismoMetro
    ? []
    : [
        `  ${fuente}: NO SE RESTA — cambió el instrumento ` +
          `(${nombraInstrumento(antes.instrumento)} → ${nombraInstrumento(ahora.instrumento)}).`,
      ];

  for (const [clave, valor] of Object.entries(ahora.cifras ?? {})) {
    const previo = antes.cifras?.[clave];
    if (typeof valor !== "number" || typeof previo !== "number") continue;
    if (!mismoMetro) {
      lineas.push(
        `      ${clave}: ${previo} (antes) · ${valor} (ahora) — dos metros, no una serie`,
      );
      continue;
    }
    const delta = valor - previo;
    const signo = delta > 0 ? "+" : "";
    lineas.push(
      `  ${fuente} · ${clave}: ${previo} → ${valor}` +
        (delta === 0 ? "  (igual)" : `  (${signo}${delta})`),
    );
  }
  return lineas;
}

export function comparaConAnterior(
  anterior: RegistroMedicion | null,
  actual: RegistroMedicion,
): string[] {
  if (!anterior) {
    return [
      "No hay sello anterior, así que esta pasada es la línea base: no hay nada que restar todavía.",
    ];
  }

  const lineas: string[] = [
    `Contra el sello de ${anterior.fecha} (etapa «${anterior.etapa}», ventana ${anterior.ventana.desde} → ${anterior.ventana.hasta}):`,
  ];

  for (const fuente of FUENTES) {
    const antes = anterior.fuentes.find((f) => f.fuente === fuente);
    const ahora = actual.fuentes.find((f) => f.fuente === fuente);
    if (antes && ahora) lineas.push(...lineasDeFuente(fuente, antes, ahora));
  }

  if (lineas.length === 1) {
    lineas.push(
      "  Nada comparable: ninguna fuente dio cifra en las dos pasadas.",
    );
  }
  return lineas;
}
