import type { Dictionary } from "@/app/[lang]/dictionaries";

export type RelatedDict = Dictionary["related"];

type PageKey = "brandKit" | "designSystem" | "accesibilidad";

// Orden canónico del sistema. Accesibilidad todavía no existe como página
// (path: null) → su tarjeta sale en "Próximamente", apagada y sin enlace. Al
// construirla, basta darle su ruta aquí; las otras dos páginas no se tocan
// (una sola fuente para la relación).
const PAGES: { key: PageKey; path: string | null }[] = [
  { key: "brandKit", path: "/brand-kit" },
  { key: "designSystem", path: "/design-system" },
  { key: "accesibilidad", path: null },
];

const LINK_CARD =
  "group border-border bg-card hover:bg-muted focus-visible:ring-ring block rounded-[var(--radius-lg)] border px-[1.4rem] py-[1.2rem] transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none";

function ArrowIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

// Enlaces a las páginas hermanas del sistema (Brand Kit · Design System ·
// Accesibilidad). Compartido por las tres para que la relación se muestre desde
// la misma posición —cierre del <main>, antes del footer— y con el mismo
// formato. Cada página renderiza las otras dos (nunca a sí misma).
export function RelatedPages({
  dict,
  current,
  lang,
}: {
  dict: RelatedDict;
  current: PageKey;
  lang: string;
}) {
  const base = lang === "es" ? "" : `/${lang}`;
  const others = PAGES.filter((p) => p.key !== current);
  const headingId = "related-pages-label";

  return (
    <section className="border-border border-t">
      <nav
        data-reveal
        aria-labelledby={headingId}
        className="mx-auto max-w-[var(--container)] px-[var(--page-x)] py-[clamp(3.5rem,7vw,6rem)]"
      >
        <p
          id={headingId}
          className="text-muted-foreground m-0 mb-[clamp(1.25rem,3vw,2rem)] text-[0.8125rem] font-semibold tracking-[0.09em] uppercase"
        >
          {dict.eyebrow}
        </p>
        <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,20rem),1fr))] gap-[var(--gutter)]">
          {others.map(({ key, path }) => {
            const page = dict.pages[key];

            if (!path) {
              return (
                <div
                  key={key}
                  className="border-border rounded-[var(--radius-lg)] border border-dashed px-[1.4rem] py-[1.2rem]"
                >
                  <span className="text-muted-foreground flex items-center gap-2 text-[1rem] font-semibold">
                    {page.name}
                    <span className="bg-muted rounded-full px-[0.5rem] py-[0.1rem] text-[0.68rem] tracking-[0.03em] uppercase">
                      {dict.comingSoon}
                    </span>
                  </span>
                  <p className="text-muted-foreground m-0 mt-[0.55rem] text-[0.9rem] leading-[1.55]">
                    {page.desc}
                  </p>
                </div>
              );
            }

            return (
              <a key={key} href={`${base}${path}`} className={LINK_CARD}>
                <span className="text-foreground flex items-center justify-between gap-2 text-[1rem] font-semibold">
                  {page.name}
                  <span className="text-muted-foreground transition-transform group-hover:translate-x-0.5 group-focus-visible:translate-x-0.5">
                    <ArrowIcon />
                  </span>
                </span>
                <p className="text-muted-foreground m-0 mt-[0.55rem] text-[0.9rem] leading-[1.55]">
                  {page.desc}
                </p>
              </a>
            );
          })}
        </div>
      </nav>
    </section>
  );
}
