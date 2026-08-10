import { titleVariants } from "@/components/ui/heading";
import { cn } from "@/lib/utils";

// Lo único de esta página que se usa en MÁS DE UNA sección. Todo lo demás vive
// en el archivo de la suya: medido antes de partir, 9 de los 13 subcomponentes
// se usaban en una sola (P37.69).

export function SectionHead({ num, title }: { num: string; title: string }) {
  return (
    <div className="mb-4 flex items-baseline gap-4">
      <span className="text-muted-foreground font-mono text-[0.8rem]">
        {num}
      </span>
      <h2 className={titleVariants({ size: "section-sm" })}>{title}</h2>
    </div>
  );
}

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
