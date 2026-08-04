export type BreadcrumbDict = {
  routeLabel: string;
  home: string;
};

export type Crumb = { label: string; href?: string };

// Breadcrumb compartido de páginas internas (PRD §17, checklist a11y §20 punto 5):
// <nav aria-label>, lista ordenada, el nivel actual sin enlace y con
// aria-current="page", separadores decorativos ocultos al lector, área táctil de
// 44×44px y foco visible (heredado de :focus-visible en globals.css). Enlaces de
// chrome en muted-foreground, nunca primary (BRAND.md).
export function Breadcrumb({
  routeLabel,
  items,
}: {
  routeLabel: string;
  items: Crumb[];
}) {
  return (
    <nav aria-label={routeLabel}>
      <ol className="m-0 flex flex-wrap items-center gap-x-1 p-0 text-[0.9rem]">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-x-1">
              {item.href && !last ? (
                <a
                  href={item.href}
                  className="text-muted-foreground link-chrome -mx-[0.6rem] -my-[0.35rem] inline-flex min-h-[44px] items-center px-[0.6rem] py-[0.35rem]"
                >
                  {item.label}
                </a>
              ) : (
                <span
                  aria-current="page"
                  className="text-foreground inline-flex min-h-[44px] items-center font-medium"
                >
                  {item.label}
                </span>
              )}
              {!last && (
                <span aria-hidden="true" className="text-muted-foreground">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
