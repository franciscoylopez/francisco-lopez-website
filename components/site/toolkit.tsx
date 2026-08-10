"use client";

import { useId, useRef, useState } from "react";

import { actionVariants } from "@/components/ui/action";
import { cn } from "@/lib/utils";

import { BrandLogoBox } from "./brand-logo-box";
import { CARD, SECTION, WRAP } from "@/components/ui/layout";
import { SectionHeader } from "@/components/ui/heading";

type Tool = { name: string; desc: string };
export type ToolkitDict = {
  eyebrow: string;
  title: string;
  intro: string;
  categories: { label: string; tools: Tool[] }[];
};

// name → slug de logo (dato, no traducible).
const LOGO: Record<string, string> = {
  Amplitude: "amplitude",
  "Google Analytics": "google-analytics",
  "Microsoft Clarity": "microsoft-clarity",
  Typeform: "typeform",
  Jira: "jira",
  Notion: "notion",
  Miro: "miro",
  "Mermaid.js": "mermaid",
  "Claude Design": "claude-design",
  Figma: "figma",
  v0: "v0",
  "Claude Code": "claude-code",
  "VS Code": "vscode",
  Vercel: "vercel",
  GitHub: "github",
};

// Toolkit (PRD §8.4). Categorías en pestañas (una categoría visible cada vez) con
// ARIA completo y navegación por teclado (D6). Pestaña activa en `primary`.
export function Toolkit({ dict }: { dict: ToolkitDict }) {
  const [active, setActive] = useState(0);
  const uid = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const count = dict.categories.length;

  const onKeyDown = (e: React.KeyboardEvent) => {
    let next = active;
    if (e.key === "ArrowRight" || e.key === "ArrowDown")
      next = (active + 1) % count;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp")
      next = (active - 1 + count) % count;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = count - 1;
    else return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="toolkit" className={SECTION}>
      <div className={WRAP}>
        <div data-reveal className="mb-[clamp(2.5rem,5vw,4rem)]">
          <SectionHeader eyebrow={dict.eyebrow} title={dict.title}>
            <p className="text-muted-foreground max-w-[56ch] text-[clamp(1rem,1.4vw,1.15rem)] leading-[1.6] text-pretty">
              {dict.intro}
            </p>
          </SectionHeader>
        </div>

        <div
          role="tablist"
          aria-label={dict.title}
          onKeyDown={onKeyDown}
          data-reveal
          className="mb-6 flex flex-wrap gap-[0.4rem]"
        >
          {dict.categories.map((cat, i) => {
            const selected = i === active;
            return (
              <button
                key={cat.label}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`${uid}-tab-${i}`}
                aria-selected={selected}
                aria-controls={`${uid}-panel-${i}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(i)}
                // Pestañas = control con estado. Neutro y no cian: el grupo filtra
                // sobre el contenido que viene debajo, que es el protagonista —
                // cuatro segmentos en cian se comían la sección. Estaban fuera del
                // sistema (la seleccionada sin hover, la inactiva con `secondary` en
                // vez de `muted`) porque la regla de BRAND.md solo hablaba de
                // `aria-pressed` y estas usan `aria-selected` (P37.596).
                className={actionVariants({
                  variant: "toggle-neutral",
                  on: selected,
                })}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {dict.categories.map((cat, i) => (
          <div
            key={cat.label}
            role="tabpanel"
            id={`${uid}-panel-${i}`}
            aria-labelledby={`${uid}-tab-${i}`}
            hidden={i !== active}
          >
            <p className="text-muted-foreground m-0 mb-[1.1rem] text-[0.72rem] font-semibold tracking-[0.06em] uppercase">
              {cat.label}
            </p>
            <div className="grid grid-cols-1 gap-[var(--gutter)] md:grid-cols-2">
              {cat.tools.map((tool) => (
                <div
                  key={tool.name}
                  className={cn(
                    CARD,
                    "flex items-start gap-[0.85rem] px-[1.2rem] py-[1.1rem]",
                  )}
                >
                  <BrandLogoBox name={`tools/${LOGO[tool.name] ?? ""}`} />
                  <div>
                    <div className="text-[0.95rem] font-semibold">
                      {tool.name}
                    </div>
                    <p className="text-muted-foreground m-0 mt-[0.2rem] text-[0.85rem] leading-[1.5]">
                      {tool.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
