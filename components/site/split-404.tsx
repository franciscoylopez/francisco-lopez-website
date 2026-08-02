import { cn } from "@/lib/utils";

// El "404" del hero del not-found: los dos "4" en tipografía de marca (Bricolage) y el
// "0" sustituido por el círculo con split —anillos cian/morado + aro base, SIN la
// barra inferior: no es el logo, es el número—. El split "florece" al cargar vía CSS
// (.split-zero, keyframe split-bloom en globals.css), respetando prefers-reduced-motion.
// role="img" + aria-label para que los lectores de pantalla anuncien "404" sin exponer
// el SVG ni los glifos sueltos.
export function Split404({ className }: { className?: string }) {
  return (
    <div
      role="img"
      aria-label="404"
      className={cn(
        "font-display flex items-center justify-center gap-[0.06em] leading-none font-semibold tracking-[-0.03em]",
        className,
      )}
    >
      <span aria-hidden="true">4</span>
      {/* El "0": mismos radios/grosor y desfase de capas que el logo (BRAND.md), a
          escala del texto (h en em). overflow-visible deja asomar el split. */}
      <svg
        viewBox="0 0 60 60"
        fill="none"
        aria-hidden="true"
        className="split-zero h-[0.82em] w-auto overflow-visible"
      >
        <g>
          <circle
            cx="27"
            cy="28"
            r="26"
            stroke="var(--brand-cyan-split)"
            strokeWidth="6"
          />
          <circle
            cx="33"
            cy="32"
            r="26"
            stroke="var(--brand-purple-split)"
            strokeWidth="6"
          />
        </g>
        <circle
          cx="30"
          cy="30"
          r="26"
          stroke="var(--foreground)"
          strokeWidth="6"
        />
      </svg>
      <span aria-hidden="true">4</span>
    </div>
  );
}
