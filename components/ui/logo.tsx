// @pieza primitiva · brand-kit/02-logotipo.tsx · El monograma y el wordmark, con la firma split y su umbral de 48px.

import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "split" | "flat";
  showWordmark?: boolean;
  forceColor?: "theme" | "white" | "black";
  /**
   * Opacidad de las capas de color del split (0–1). Cuando se pasa, las capas se
   * renderizan siempre y su opacidad la controla el consumidor — es como el Nav
   * anima la transición continua split→flat con el scroll (BRAND.md, regla 6),
   * sin duplicar la geometría del logo. Si se omite, manda `variant`.
   */
  splitOpacity?: number;
  className?: string;
}

export function Logo({
  variant = "split",
  showWordmark = false,
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
        <span className="font-display text-lg" style={{ color: shapeColor }}>
          Francisco López
        </span>
      )}
    </span>
  );
}
