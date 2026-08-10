import { cn } from "@/lib/utils";

// Lo único de esta página que se usa en MÁS DE UNA sección. Todo lo demás vive
// en el archivo de la suya: medido antes de partir, 9 de los 13 subcomponentes
// se usaban en una sola (P37.69).
//
// AQUÍ VIVÍA `SectionHead` (P37.695). Era una de las TRES copias privadas de la
// cabecera numerada —las otras dos en `accesibilidad.tsx` y en `brand-kit`— y
// las tres pintaban el ordinal en monoespaciada, que no es el rótulo de este
// sitio. Ahora las catorce secciones abren con `SectionHeader`, igual que la
// home y los cuatro heros: el ordinal va dentro del eyebrow.

export function TypeMeta({
  label,
  value,
  mono,
  muted,
}: {
  label: string;
  value: string;
  mono?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="flex flex-col gap-[0.15rem]">
      <span className="text-muted-foreground text-[0.68rem] tracking-[0.04em] uppercase">
        {label}
      </span>
      <span
        className={cn(
          "text-[0.82rem]",
          mono && "font-mono",
          muted && "text-muted-foreground",
        )}
      >
        {value}
      </span>
    </div>
  );
}
