/**
 * La forma de lo que se pasan las tres piezas del pase sobre imagen: lo que la
 * página encuentra (`Hallazgo`), lo que la cámara devuelve (`Peor`) y lo que se
 * publica al final (`Medida`). Están juntas porque las tres las escriben unos y
 * las leen otros *(P72.195)*.
 */
import { type Caja } from "./pixel";

export interface ParImagen {
  i: number;
  /** Identidad estable entre tomas: el elemento, no el orden en que salió. */
  clave: string;
  ejemplo: string;
  texto: string;
  color: [number, number, number, number];
  px: number;
  peso: number;
  grande: boolean;
  AA: number;
  AAA: number;
  visible: boolean;
  caja: Caja;
}

export interface Ancla {
  ejemplo: string;
  color: [number, number, number, number];
  /** Lo que el censo mide por su camino. El del píxel tiene que dar lo mismo. */
  esperado: number;
  caja: Caja;
}

export interface Hallazgo {
  dpr: number;
  viewport: [number, number];
  encontrados: ParImagen[];
  ancla: Ancla | null;
}

export interface Peor {
  ratio: number;
  donde: string;
  /** El píxel culpable, en RGB. Sin él, una cifra rara no se puede diagnosticar. */
  pixel: [number, number, number];
}

export interface Medida {
  pagina: string;
  tema: string;
  ejemplo: string;
  texto: string;
  px: number;
  umbralAAA: number;
  umbralAA: number;
  peor: number;
  muestras: number;
  donde: string;
  pixel: [number, number, number];
}
