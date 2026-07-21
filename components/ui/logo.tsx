import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "split" | "flat";
  showWordmark?: boolean;
  forceColor?: "theme" | "white" | "black";
  className?: string;
}

export function Logo({
  variant = "split",
  showWordmark = false,
  forceColor = "theme",
  className,
}: LogoProps) {
  const shapeColor =
    forceColor === "white"
      ? "#FFFFFF"
      : forceColor === "black"
        ? "#000000"
        : "var(--foreground)";

  const showSplit = variant === "split" && forceColor === "theme";

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
          <>
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
          </>
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
