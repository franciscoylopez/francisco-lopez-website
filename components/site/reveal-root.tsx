"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Island de motion (PRD §6/§21). Añade `reveal-on` a su contenedor y observa los
// [data-reveal] (fade-up una vez al entrar en viewport) y [data-count] (contadores
// ease-out-cubic). Con prefers-reduced-motion NO añade la clase: el contenido y los
// números se quedan tal cual los renderizó el servidor (visibles, sin animar). Sin
// JS, igual: nunca se oculta nada.
export function RevealRoot({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return;

    root.classList.add("reveal-on");

    const revealIO = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.setAttribute("data-shown", "1");
            revealIO.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    root
      .querySelectorAll("[data-reveal]")
      .forEach((el) => revealIO.observe(el));

    const animateCount = (el: Element) => {
      const to = Number.parseFloat(el.getAttribute("data-count") ?? "");
      if (Number.isNaN(to)) return;
      const dur = 900;
      const start = performance.now();
      const step = (t: number) => {
        const p = Math.min(1, (t - start) / dur);
        el.textContent = String(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const countIO = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            animateCount(e.target);
            countIO.unobserve(e.target);
          }
        }
      },
      { threshold: 0.6 },
    );
    root.querySelectorAll("[data-count]").forEach((el) => {
      el.textContent = "0";
      countIO.observe(el);
    });

    return () => {
      revealIO.disconnect();
      countIO.disconnect();
    };
  }, []);

  return <div ref={ref}>{children}</div>;
}
