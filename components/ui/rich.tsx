// Mini-render de markup inline para el copy del diccionario: **negrita**, *cursiva*
// y [texto](url). Plano (sin anidamiento), suficiente para el énfasis editorial de
// las páginas de contenido, y mantiene el copy como strings en el diccionario
// (fuente de verdad ES→EN). Enlaces http(s) → target/rel de seguridad; enlaces de
// contenido con `.link-content--underline` (reposo neutro, cian en hover — regla
// de BRAND.md matizada 2026-08-04 / P37.55). Ver D23.
const RICH_TOKEN = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*)/g;

export function Rich({ text }: { text: string }) {
  const parts = text.split(RICH_TOKEN).filter((p) => p !== "");
  return (
    <>
      {parts.map((part, i) => {
        const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
        if (link) {
          const label = link[1] ?? "";
          const href = link[2] ?? "";
          const external = /^https?:\/\//.test(href);
          return (
            <a
              key={i}
              href={href}
              {...(external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="link-content link-content--underline"
            >
              {label}
            </a>
          );
        }
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="text-foreground font-semibold">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return <em key={i}>{part.slice(1, -1)}</em>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
