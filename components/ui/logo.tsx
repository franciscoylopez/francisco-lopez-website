// @pieza primitiva · brand-kit/02-logotipo.tsx · El monograma y el wordmark, con la firma split y su umbral de 48px.

import { cn } from "@/lib/utils";

/**
 * EL WORDMARK NECESITA SABER LA ALTURA DEL SÍMBOLO, y por eso va en un tipo
 * aparte: la regla 5 de `BRAND-logo.md` dice que «si cambia el tamaño del
 * símbolo, el wordmark cambia con él», y un tamaño fijo no puede cumplirla.
 * Antes era un `text-lg` congelado: al único sitio que lo usaba le salía un
 * 56,3% cuando los otros seis wordmarks del sitio caen entre el 42,7% y el 46%.
 *
 * Se pasa el número y no se deduce del `className` porque no hay forma de leer
 * una clase de Tailwind desde el componente. Se intentó con `container-type:
 * size` + `cqh`, que sí derivaría la cifra — pero la contención aplica a los
 * DOS ejes, así que el lockup dejaba de medir por su contenido y colapsaba a
 * ancho 0. Medido: `lockup: 40..40 (w=0)` con el texto saliéndose 148px.
 *
 * El tipo lo hace obligatorio a propósito: con wordmark hay que decir el
 * tamaño, y sin wordmark no se puede pasar.
 */
type ConWordmark =
  | { showWordmark: true; symbolPx: number }
  | { showWordmark?: false; symbolPx?: never };

type LogoProps = ConWordmark & {
  variant?: "split" | "flat";
  forceColor?: "theme" | "white" | "black";
  /**
   * Opacidad de las capas de color del split (0–1). Cuando se pasa, las capas se
   * renderizan siempre y su opacidad la controla el consumidor — es como el Nav
   * anima la transición continua split→flat con el scroll (BRAND.md, regla 6),
   * sin duplicar la geometría del logo. Si se omite, manda `variant`.
   */
  splitOpacity?: number;
  className?: string;
};

/**
 * LA GEOMETRÍA DEL MONOGRAMA, en unidades del `viewBox`. Vive aquí y se exporta
 * porque hay un segundo lector: la retícula de la apertura del Brand Kit, que
 * ACOTA el logo (radio, trazo, base, alto) y no puede permitirse acotar una
 * copia que se haya quedado atrás. Las cotas se derivan de estas cifras.
 */
export const MONOGRAMA = {
  cx: 60,
  cy: 46,
  r: 26,
  trazo: 6,
  base: { x: 42, y: 82, w: 36, h: 5, rx: 2.5 },
  /** El desplazamiento de cada capa del split respecto al aro. */
  cian: { dx: -3, dy: -2 },
  morado: { dx: 3, dy: 2 },
} as const;

const M = MONOGRAMA;

/** La proporción wordmark/símbolo del lockup compuesto en UI (regla 5: 40-45%). */
const RATIO_WORDMARK = 0.45;

export function Logo({
  variant = "split",
  showWordmark = false,
  symbolPx,
  forceColor = "theme",
  splitOpacity,
  className,
}: LogoProps) {
  const shapeColor =
    forceColor === "white"
      ? "#FFFFFF"
      : forceColor === "black"
        ? "#000000"
        : "var(--foreground)";

  const driven = splitOpacity !== undefined;
  const showSplit = (driven || variant === "split") && forceColor === "theme";

  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      {/* viewBox recortado a los límites justos del símbolo flat: la altura
          renderizada es exactamente la altura del símbolo (ver BRAND.md).
          overflow-visible deja asomar las capas del split, que sobresalen. */}
      <svg
        viewBox="31 17 58 70"
        fill="none"
        aria-hidden="true"
        className="h-full w-auto overflow-visible"
      >
        {showSplit && (
          <g style={driven ? { opacity: splitOpacity } : undefined}>
            <circle
              cx={M.cx + M.cian.dx}
              cy={M.cy + M.cian.dy}
              r={M.r}
              stroke="var(--brand-cyan-split)"
              strokeWidth={M.trazo}
            />
            <circle
              cx={M.cx + M.morado.dx}
              cy={M.cy + M.morado.dy}
              r={M.r}
              stroke="var(--brand-purple-split)"
              strokeWidth={M.trazo}
            />
          </g>
        )}
        <circle
          cx={M.cx}
          cy={M.cy}
          r={M.r}
          stroke={shapeColor}
          strokeWidth={M.trazo}
        />
        <rect
          x={M.base.x}
          y={M.base.y}
          width={M.base.w}
          height={M.base.h}
          rx={M.base.rx}
          fill={shapeColor}
        />
      </svg>
      {showWordmark && (
        // El tamaño sale de la altura del símbolo por `RATIO_WORDMARK`, no de
        // una clase congelada. `font-semibold` y el tracking tampoco son
        // decoración: los otros SEIS wordmarks del sitio —nav, los dos lockups
        // del Brand Kit, la firma de email— van todos a 600 con tracking
        // negativo, y este era el único a 400 y sin él.
        <span
          className="font-display font-semibold tracking-[-0.01em] whitespace-nowrap"
          style={{
            color: shapeColor,
            fontSize: symbolPx ? `${symbolPx * RATIO_WORDMARK}px` : undefined,
          }}
        >
          Francisco López
        </span>
      )}
    </span>
  );
}
