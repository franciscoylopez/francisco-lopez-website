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
              cx="57"
              cy="44"
              r="26"
              stroke="var(--brand-cyan-split)"
              strokeWidth="6"
            />
            <circle
              cx="63"
              cy="48"
              r="26"
              stroke="var(--brand-purple-split)"
              strokeWidth="6"
            />
          </g>
        )}
        <circle cx="60" cy="46" r="26" stroke={shapeColor} strokeWidth="6" />
        <rect x="42" y="82" width="36" height="5" rx="2.5" fill={shapeColor} />
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
