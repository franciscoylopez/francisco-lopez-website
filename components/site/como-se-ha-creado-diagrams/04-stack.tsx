import type { Locale } from "@/lib/i18n/config";

import { DosLienzos, LBL, rlz } from "./shared";

/** 04 · El stack como grafo, no como flujo (P60 tanda 2, punto 16): un núcleo
 * que se despliega, con dos piezas que también viajan en el bundle y dos
 * herramientas que solo ayudaron a construirlo y no van en él. La línea
 * distingue lo real —qué se envía— de lo decorativo: sólida para lo que se
 * despliega, discontinua para lo que no.
 *
 * LAS COORDENADAS SALEN DEL LAYOUT, NO DEL DICCIONARIO (P68.59). Antes vivían
 * dentro de `t`, duplicadas en ES y EN y con los mismos valores en las dos:
 * eran geometría disfrazada de contenido. Al necesitar una segunda
 * disposición habría hecho falta duplicarlas cuatro veces. Ahora `t` solo
 * lleva lo que de verdad cambia con el idioma. */
export function StackDiagram({ lang }: { lang: Locale }) {
  const t = {
    es: {
      ariaLabel:
        "Un grafo con un núcleo central, Next 16, TypeScript estricto y Tailwind v4, unido por líneas a cuatro piezas. Con línea sólida, lo que también se envía al navegador: lucide-react para los iconos y shadcn/ui, instalado y casi sin usar. Con línea discontinua, lo que solo ayudó a construir el sitio y no viaja en el bundle: Claude Design en el diseño inicial y Claude Code en el desarrollo.",
      core: { l1: "Next 16 · TypeScript", l2: "estricto · Tailwind v4" },
      nodes: [
        { key: "lucide", name: "lucide-react", role: "iconos", shipped: true },
        {
          key: "shadcn",
          name: "shadcn/ui",
          role: "instalado, sin uso",
          shipped: true,
        },
        {
          key: "design",
          name: "Claude Design",
          role: "diseño inicial",
          shipped: false,
        },
        {
          key: "code",
          name: "Claude Code",
          role: "desarrollo",
          shipped: false,
        },
      ] as const,
      shippedLabel: "se despliega",
      buildLabel: "solo construcción",
    },
    en: {
      ariaLabel:
        "A graph with a central core, Next 16, strict TypeScript and Tailwind v4, joined by lines to four pieces. With a solid line, what also ships to the browser: lucide-react for icons, and shadcn/ui, installed and barely used. With a dashed line, what only helped build the site and doesn't travel in the bundle: Claude Design for the initial design, Claude Code for development.",
      core: { l1: "Next 16 · TypeScript", l2: "strict · Tailwind v4" },
      nodes: [
        { key: "lucide", name: "lucide-react", role: "icons", shipped: true },
        {
          key: "shadcn",
          name: "shadcn/ui",
          role: "installed, unused",
          shipped: true,
        },
        {
          key: "design",
          name: "Claude Design",
          role: "initial design",
          shipped: false,
        },
        {
          key: "code",
          name: "Claude Code",
          role: "development",
          shipped: false,
        },
      ] as const,
      shippedLabel: "ships",
      buildLabel: "build only",
    },
  }[lang];

  /** Una disposición del mismo grafo. El orden de `at` sigue al de `t.nodes`.
   * Por NOMBRE y no por índice: con `noUncheckedIndexedAccess`, leer
   * `at[i]` da `Punto | undefined` aunque el array tenga largo fijo. Una
   * clave nombrada es acceso a propiedad, no indexado — y de paso dice cuál
   * es cuál, que un `[2]` no decía. */
  type Punto = { x: number; y: number };
  type Layout = {
    vb: string;
    core: { x: number; y: number; w: number; h: number };
    nodeW: number;
    at: Record<"lucide" | "shadcn" | "design" | "code", Punto>;
    /** Las dos entradas de la leyenda: en fila si cabe, apiladas si no. */
    legend: { shipped: Punto; build: Punto };
  };

  const grafo = (L: Layout, cap: string) => {
    const cx = L.core.x + L.core.w / 2;
    const cy = L.core.y + L.core.h / 2;
    const nodes = t.nodes.map((n) => ({
      ...n,
      ...L.at[n.key],
      w: L.nodeW,
      h: 64,
    }));
    return (
      <svg viewBox={L.vb} role="img" aria-label={t.ariaLabel} className={cap}>
        {nodes.map((n) => (
          <line
            key={`edge-${n.name}`}
            x1={cx}
            y1={cy}
            x2={n.x + n.w / 2}
            y2={n.y + n.h / 2}
            strokeWidth="2"
            strokeDasharray={n.shipped ? undefined : "5 4"}
            {...rlz(1, "stroke-border")}
          />
        ))}

        <rect
          x={L.core.x}
          y={L.core.y}
          width={L.core.w}
          height={L.core.h}
          rx="8"
          strokeWidth="1.5"
          {...rlz(0, "fill-primary/15 stroke-primary")}
        />
        <foreignObject
          x={L.core.x + 10}
          y={L.core.y + 10}
          width={L.core.w - 20}
          height={L.core.h - 20}
          {...rlz(0)}
        >
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
                {/* 11px y no 10,5 (P68.59): el rol del nodo era el texto más
                    pequeño del diagrama y no llegaba a 11px pintados en NINGÚN
                    viewport, ni siquiera a 1536 —se quedaba en 10,5—. El
                    problema del rótulo no era solo de móvil. */}
                <p className="text-muted-foreground m-0 text-[11px] leading-[1.3]">
                  {n.role}
                </p>
              </div>
            </foreignObject>
          </g>
        ))}

        <line
          x1={L.legend.shipped.x}
          y1={L.legend.shipped.y}
          x2={L.legend.shipped.x + 24}
          y2={L.legend.shipped.y}
          strokeWidth="2"
          {...rlz(4, "stroke-border")}
        />
        <text
          x={L.legend.shipped.x + 32}
          y={L.legend.shipped.y + 4}
          {...rlz(4, LBL)}
        >
          {t.shippedLabel}
        </text>
        <line
          x1={L.legend.build.x}
          y1={L.legend.build.y}
          x2={L.legend.build.x + 24}
          y2={L.legend.build.y}
          strokeWidth="2"
          strokeDasharray="5 4"
          {...rlz(4, "stroke-border")}
        />
        <text
          x={L.legend.build.x + 32}
          y={L.legend.build.y + 4}
          {...rlz(4, LBL)}
        >
          {t.buildLabel}
        </text>
      </svg>
    );
  };

  const ancho = grafo(
    {
      vb: "0 0 380 520",
      core: { x: 95, y: 225, w: 190, h: 70 },
      nodeW: 160,
      at: {
        lucide: { x: 210, y: 15 },
        shadcn: { x: 210, y: 390 },
        design: { x: 10, y: 15 },
        code: { x: 10, y: 390 },
      },
      legend: { shipped: { x: 20, y: 470 }, build: { x: 150, y: 470 } },
    },
    "h-auto w-full max-w-[380px]",
  );

  /** El mismo grafo comprimido: los nodos pierden 36 unidades de ancho y la
   * leyenda pasa de una fila a dos, que es lo único que no cabía. La forma
   * —núcleo al centro, cuatro piezas en las esquinas— se conserva, porque es
   * lo que distingue a este diagrama de un flujo. */
  const estrecho = grafo(
    {
      vb: "0 0 280 512",
      core: { x: 45, y: 225, w: 190, h: 70 },
      nodeW: 124,
      at: {
        lucide: { x: 148, y: 15 },
        shadcn: { x: 148, y: 390 },
        design: { x: 8, y: 15 },
        code: { x: 8, y: 390 },
      },
      legend: { shipped: { x: 14, y: 472 }, build: { x: 14, y: 496 } },
    },
    "h-auto w-full max-w-[300px]",
  );

  return <DosLienzos umbral={390} ancho={ancho} estrecho={estrecho} />;
}
