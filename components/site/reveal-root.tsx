"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Island de motion (PRD §6/§21). Añade `reveal-on` a su contenedor y observa los
// [data-reveal] (fade-up una vez al entrar en viewport) y [data-count] (contadores
// ease-out-cubic). Con prefers-reduced-motion NO añade la clase: el contenido y los
// números se quedan tal cual los renderizó el servidor (visibles, sin animar). Sin
// JS, igual: nunca se oculta nada.
//
// LO QUE YA ESTÁ EN PANTALLA NO SE ANIMA (P44). Se marca como mostrado ANTES de
// encender `reveal-on`, así que nunca llega a ocultarse. El orden es la corrección
// entera: al revés —que es como estaba— el HTML llegaba con el contenido visible,
// se hidrataba, y entonces lo YA PINTADO se ocultaba para volver con una
// transición de 600 ms. El LCP se registra en el primer frame con opacidad > 0, así
// que la métrica principal de rendimiento la estaba pagando una animación
// decorativa: 2.090 ms de «retraso de renderizado» en PageSpeed, con la imagen del
// hero descargada a los 50 ms.
//
// Y es lo que la regla decía desde el principio: «una vez al ENTRAR en viewport».
// Lo que ya estaba ahí al cargar no ha entrado. El efecto visible —que el primer
// pliegue deja de hacer fade-up— es el precio, y no hay forma de evitarlo: un
// elemento que empieza en `opacity: 0` retrasa el LCP por definición.
//
// LO QUE SÍ PUEDE ENTRAR EN EL PLIEGUE VA POR OTRA PUERTA, y esta cabecera no lo
// decía: quien llegaba aquí queriendo animar algo de arriba se quedaba sin
// salida. `data-reveal` significa «entra al ENTRAR en viewport»; para «entra al
// CARGAR» está `.entrada-pliegue` en `globals.css`, un `@keyframes` con
// `backwards` que no espera a la hidratación y que por eso NO puede sustituirse
// por una excepción de este bucle. El porqué entero, y la trampa del `transform`
// que se lleva por delante media animación sin dar un error, en D202.
export function RevealRoot({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return;

    const revelables = [...root.querySelectorAll("[data-reveal]")];

    // Primero: lo visible en el primer pliegue queda mostrado. Va ANTES de la
    // clase — la regla `[data-shown]` gana en especificidad, así que la opacidad
    // de estos elementos nunca cambia de 1 y no hay repintado que retrase el LCP.
    const alturaVentana = window.innerHeight;
    for (const el of revelables) {
      const r = el.getBoundingClientRect();
      if (r.top < alturaVentana && r.bottom > 0) {
        el.setAttribute("data-shown", "1");
      }
    }

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
    for (const el of revelables) {
      if (!el.hasAttribute("data-shown")) revealIO.observe(el);
    }

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
