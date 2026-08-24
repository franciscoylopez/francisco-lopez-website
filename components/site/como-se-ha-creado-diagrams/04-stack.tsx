import type { Locale } from "@/lib/i18n/config";

import { LBL, rlz } from "./shared";

/** 04 · El stack como grafo, no como flujo (P60 tanda 2, punto 16): un núcleo
 * que se despliega, con dos piezas que también viajan en el bundle y dos
 * herramientas que solo ayudaron a construirlo y no van en él. La línea
 * distingue lo real —qué se envía— de lo decorativo: sólida para lo que se
 * despliega, discontinua para lo que no. */
export function StackDiagram({ lang }: { lang: Locale }) {
  const t = {
    es: {
      ariaLabel:
        "Un grafo con un núcleo central, Next 16, TypeScript estricto y Tailwind v4, unido por líneas a cuatro piezas. Con línea sólida, lo que también se envía al navegador: lucide-react para los iconos y shadcn/ui, instalado y casi sin usar. Con línea discontinua, lo que solo ayudó a construir el sitio y no viaja en el bundle: Claude Design en el diseño inicial y Claude Code en el desarrollo.",
      core: { l1: "Next 16 · TypeScript", l2: "estricto · Tailwind v4" },
      nodes: [
        {
          name: "lucide-react",
          role: "iconos",
          shipped: true,
          x: 210,
          y: 15,
        },
        {
          name: "shadcn/ui",
          role: "instalado, sin uso",
          shipped: true,
          x: 210,
          y: 390,
        },
        {
          name: "Claude Design",
          role: "diseño inicial",
          shipped: false,
          x: 10,
          y: 15,
        },
        {
          name: "Claude Code",
          role: "desarrollo",
          shipped: false,
          x: 10,
          y: 390,
        },
      ],
      shippedLabel: "se despliega",
      buildLabel: "solo construcción",
    },
    en: {
      ariaLabel:
        "A graph with a central core, Next 16, strict TypeScript and Tailwind v4, joined by lines to four pieces. With a solid line, what also ships to the browser: lucide-react for icons, and shadcn/ui, installed and barely used. With a dashed line, what only helped build the site and doesn't travel in the bundle: Claude Design for the initial design, Claude Code for development.",
      core: { l1: "Next 16 · TypeScript", l2: "strict · Tailwind v4" },
      nodes: [
        { name: "lucide-react", role: "icons", shipped: true, x: 210, y: 15 },
        {
          name: "shadcn/ui",
          role: "installed, unused",
          shipped: true,
          x: 210,
          y: 390,
        },
        {
          name: "Claude Design",
          role: "initial design",
          shipped: false,
          x: 10,
          y: 15,
        },
        {
          name: "Claude Code",
          role: "development",
          shipped: false,
          x: 10,
          y: 390,
        },
      ],
      shippedLabel: "ships",
      buildLabel: "build only",
    },
  }[lang];
  const CORE = { x: 190, y: 260 };
  const nodes = t.nodes.map((n) => ({ ...n, w: 160, h: 64 }));
  return (
    <svg
      viewBox="0 0 380 520"
      role="img"
      aria-label={t.ariaLabel}
      className="h-auto w-full max-w-[380px]"
    >
      {nodes.map((n) => {
        const cx = n.x + n.w / 2;
        const cy = n.y + n.h / 2;
        return (
          <line
            key={`edge-${n.name}`}
            x1={CORE.x}
            y1={CORE.y}
            x2={cx}
            y2={cy}
            strokeWidth="2"
            strokeDasharray={n.shipped ? undefined : "5 4"}
            {...rlz(1, "stroke-border")}
          />
        );
      })}

      <rect
        x="95"
        y="225"
        width="190"
        height="70"
        rx="8"
        strokeWidth="1.5"
        {...rlz(0, "fill-primary/15 stroke-primary")}
      />
      <foreignObject x="105" y="235" width="170" height="50" {...rlz(0)}>
        <div className="flex h-full flex-col items-center justify-center text-center">
          <p className="text-foreground m-0 text-[12px] leading-[1.3] font-semibold">
            {t.core.l1}
          </p>
          <p className="text-muted-foreground m-0 text-[11px] leading-[1.3]">
            {t.core.l2}
          </p>
        </div>
      </foreignObject>

      {nodes.map((n) => (
        <g key={n.name}>
          <rect
            x={n.x}
            y={n.y}
            width={n.w}
            height={n.h}
            rx="7"
            strokeWidth={n.shipped ? undefined : 1.5}
            strokeDasharray={n.shipped ? undefined : "4 3"}
            {...rlz(2, n.shipped ? "fill-muted" : "fill-card stroke-border")}
          />
          <foreignObject
            x={n.x + 8}
            y={n.y + 8}
            width={n.w - 16}
            height={n.h - 16}
            {...rlz(3)}
          >
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-foreground m-0 text-[11px] leading-[1.3] font-semibold">
                {n.name}
              </p>
              <p className="text-muted-foreground m-0 text-[10.5px] leading-[1.3]">
                {n.role}
              </p>
            </div>
          </foreignObject>
        </g>
      ))}

      <line
        x1="20"
        y1="470"
        x2="44"
        y2="470"
        strokeWidth="2"
        {...rlz(4, "stroke-border")}
      />
      <text x="52" y="474" {...rlz(4, LBL)}>
        {t.shippedLabel}
      </text>
      <line
        x1="150"
        y1="470"
        x2="174"
        y2="470"
        strokeWidth="2"
        strokeDasharray="5 4"
        {...rlz(4, "stroke-border")}
      />
      <text x="182" y="474" {...rlz(4, LBL)}>
        {t.buildLabel}
      </text>
    </svg>
  );
}
