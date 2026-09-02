/**
 * El metro del pase sobre imagen: recortar la región de una caja y devolver el
 * PEOR píxel que hay debajo del texto.
 *
 * Es el mismo cálculo que `censo/02-color.js` hace dentro de la página, y tiene
 * que dar lo mismo: el ancla de cada corrida compara las dos cifras y es lo que
 * impide creerse un recorte desplazado o un DPR mal aplicado. Aparte del
 * conductor porque son cosas distintas —esto es aritmética sobre un PNG, aquello
 * es un navegador— y porque así se puede leer entero sin el recorrido delante
 * *(P72.195, 2026-09-02)*.
 */
import sharp from "sharp";

/** La región que se recorta, en píxeles de DISPOSITIVO. */
export interface Caja {
  x: number;
  y: number;
  w: number;
  h: number;
}

const luminancia = (r: number, g: number, b: number): number => {
  const lin = [r, g, b]
    .map((v) => v / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * lin[0]! + 0.7152 * lin[1]! + 0.0722 * lin[2]!;
};

export const round = (n: number) => Math.round(n * 100) / 100;

export function ratio(
  fg: [number, number, number],
  bg: [number, number, number],
): number {
  const [hi, lo] = [luminancia(...fg), luminancia(...bg)].sort(
    (a, b) => b - a,
  ) as [number, number];
  return round((hi + 0.05) / (lo + 0.05));
}

/** Alfa del texto compuesta sobre el píxel que tiene debajo. */
const sobre = (
  fg: [number, number, number, number],
  bg: [number, number, number],
): [number, number, number] => [
  fg[0] * fg[3] + bg[0] * (1 - fg[3]),
  fg[1] * fg[3] + bg[1] * (1 - fg[3]),
  fg[2] * fg[3] + bg[2] * (1 - fg[3]),
];

/**
 * El peor píxel de la región: el que menos contrasta con el texto.
 *
 * SE MIRA LA CAJA ENTERA Y NO SOLO DONDE HAY GLIFOS, que es conservador a
 * propósito. Con el texto oculto no se sabe qué píxeles tapaba cada letra, y una
 * cifra optimista aquí sería justo el tipo de aprobado que este repo persigue.
 */
export async function peorPixel(
  png: Buffer,
  caja: Caja,
  color: [number, number, number, number],
): Promise<{ ratio: number; pixel: [number, number, number] } | null> {
  const meta = await sharp(png).metadata();
  const x = Math.max(0, Math.min(caja.x, (meta.width ?? 0) - 1));
  const y = Math.max(0, Math.min(caja.y, (meta.height ?? 0) - 1));
  const w = Math.max(1, Math.min(caja.w, (meta.width ?? 0) - x));
  const h = Math.max(1, Math.min(caja.h, (meta.height ?? 0) - y));
  if (w <= 0 || h <= 0) return null;

  const { data, info } = await sharp(png)
    .extract({ left: x, top: y, width: w, height: h })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  let peor = Infinity;
  let cual: [number, number, number] = [0, 0, 0];
  const canales = info.channels;

  for (let p = 0; p + canales - 1 < data.length; p += canales) {
    const bg: [number, number, number] = [data[p]!, data[p + 1]!, data[p + 2]!];
    const fg =
      color[3] === 1 ? [color[0], color[1], color[2]] : sobre(color, bg);
    const r = ratio(fg as [number, number, number], bg);
    if (r < peor) {
      peor = r;
      cual = bg;
    }
  }

  return Number.isFinite(peor) ? { ratio: peor, pixel: cual } : null;
}
