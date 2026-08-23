"use client";

import { useTheme } from "next-themes";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import { Tarjetas } from "./variants";

/**
 * «¿Estamos ya en el cliente?», sin `setState` dentro de un efecto — que es lo que
 * prohíbe `react-hooks/set-state-in-effect`, y con razón: encadena renders. Es el
 * patrón canónico, y aquí hace falta por dos motivos a la vez: la variante inicial
 * se lee de la URL (que el servidor no tiene) y la etiqueta del tema depende de
 * `resolvedTheme` (que en el primer render es `undefined`).
 */
const subscribeNoop = () => () => {};
function useIsClient() {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
}

// El harness de `/prototype`. El picker es CHROME y su aspecto es la especificación
// de PICKER.md, copiada literal: no se le aplican los tokens del proyecto, no
// conmuta con el tema y no es una de las cosas que se está juzgando.
//
// SIN BOTÓN DE REPLAY, y es deliberado: PICKER.md lo pide solo cuando alguna
// variante tiene una animación de entrada que re-disparar. Aquí las cuatro son
// estáticas al montar; el movimiento vive en la interacción (el error que aparece,
// el panel de enviado), que se re-dispara usando el formulario. Un replay que no
// replayea nada es peor que no tenerlo.
//
// El conmutador de tema NO es una modificación del picker: es otro elemento, y
// existe porque en este sitio media decisión de color se juzga en oscuro.

const VARIANTS = [{ name: "Tarjetas", render: () => <Tarjetas /> }] as const;

export function Harness() {
  // Selección persistida en la URL (?v=N), con vuelta a la 1. Se lee UNA vez, al
  // inicializar el estado, no en un efecto.
  const [current, setCurrent] = useState(() => {
    if (typeof window === "undefined") return 0;
    const v = parseInt(
      new URLSearchParams(window.location.search).get("v") ?? "",
      10,
    );
    return v >= 1 && v <= VARIANTS.length ? v - 1 : 0;
  });
  const [nonce, setNonce] = useState(0);
  const [ready, setReady] = useState(false);
  const [motionOff, setMotionOff] = useState(false);
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [highlight, setHighlight] = useState({ left: 0, width: 0 });
  const { resolvedTheme, setTheme } = useTheme();
  const isClient = useIsClient();
  /** Lo que se PINTA. En servidor e hidratación, siempre la primera. */
  const shownIndex = isClient ? current : 0;

  const measure = useCallback(() => {
    const el = itemsRef.current[current];
    if (el) setHighlight({ left: el.offsetLeft, width: el.offsetWidth });
  }, [current]);

  useLayoutEffect(measure, [measure]);

  useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  // El deslizamiento se habilita solo tras el primer pintado, para que la carga
  // no anime.
  useEffect(() => {
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setReady(true)),
    );
    return () => cancelAnimationFrame(id);
  }, []);

  const select = useCallback((i: number) => {
    if (i < 0 || i >= VARIANTS.length) return;
    setCurrent(i);
    const url = new URL(location.href);
    url.searchParams.set("v", String(i + 1));
    history.replaceState(null, "", url);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable)
      )
        return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= VARIANTS.length) select(num - 1);
      else if (e.key === "ArrowRight") select((current + 1) % VARIANTS.length);
      else if (e.key === "ArrowLeft")
        select((current - 1 + VARIANTS.length) % VARIANTS.length);
      else if (e.key === "r" || e.key === "R") setNonce((n) => n + 1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [current, select]);

  return (
    <>
      <style>{PICKER_CSS}</style>

      {/* Chrome del harness, separado del picker. */}
      <div className="proto-tools">
        <button
          type="button"
          className="proto-tools-item"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        >
          {isClient && resolvedTheme === "dark" ? "Oscuro" : "Claro"}
        </button>
        <span className="proto-tools-divider" aria-hidden />
        <button
          type="button"
          className="proto-tools-item"
          data-on={motionOff ? "" : undefined}
          onClick={() => setMotionOff((v) => !v)}
        >
          {motionOff ? "Motion OFF" : "Motion ON"}
        </button>
      </div>

      <main id="stage" data-motion={motionOff ? "off" : undefined}>
        {isClient ? (
          <div key={`${current}-${nonce}`}>{VARIANTS[current]!.render()}</div>
        ) : null}
      </main>

      {VARIANTS.length > 1 ? (
      <nav
        className="proto-picker"
        data-ready={ready ? "" : undefined}
        aria-label="Prototype variants"
      >
        <span
          className="proto-picker-highlight"
          aria-hidden="true"
          style={{
            width: highlight.width,
            transform: `translateX(${highlight.left}px)`,
          }}
        />
        {VARIANTS.map((v, i) => (
          <button
            key={v.name}
            ref={(el) => {
              itemsRef.current[i] = el;
            }}
            className="proto-picker-item"
            // El activo se calcula contra `shownIndex`, no contra `current`: en el
            // render de hidratación `current` ya vale lo que dice la URL pero el
            // HTML del servidor tiene la variante 1, y React avisaba de la
            // discrepancia en `data-active`/`aria-current`. Con esto, hidratación y
            // servidor coinciden y el valor real entra en el render siguiente.
            data-active={i === shownIndex ? "" : undefined}
            aria-current={i === shownIndex ? "true" : undefined}
            onClick={() => select(i)}
          >
            {v.name}
          </button>
        ))}
      </nav>
      ) : null}
    </>
  );
}

// PICKER.md, literal. Lo único que cambia por ejecución son los nombres y el
// número de variantes. Va en un <style> y no en globals.css porque globals.css es
// código de producción y esta superficie se borra al promover (Hard Rule 1 y 5).
const PICKER_CSS = `
.proto-picker {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2147483647;
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 4px;
  border-radius: 999px;
  background: rgba(10, 10, 10, 0.82);
  -webkit-backdrop-filter: blur(12px) saturate(1.4);
  backdrop-filter: blur(12px) saturate(1.4);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.08) inset,
    0 8px 24px rgba(0, 0, 0, 0.24),
    0 2px 6px rgba(0, 0, 0, 0.12);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-size: 13px;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  user-select: none;
  -webkit-user-select: none;
}

.proto-picker-highlight {
  position: absolute;
  top: 4px;
  left: 0;
  height: 28px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  will-change: transform;
}

.proto-picker[data-ready] .proto-picker-highlight {
  transition:
    transform 250ms cubic-bezier(0.23, 1, 0.32, 1),
    width 250ms cubic-bezier(0.23, 1, 0.32, 1);
}

@media (prefers-reduced-motion: reduce) {
  .proto-picker[data-ready] .proto-picker-highlight { transition: none; }
}

.proto-picker-item {
  position: relative;
  display: flex;
  align-items: center;
  height: 28px;
  padding: 0 12px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: rgba(255, 255, 255, 0.55);
  font: inherit;
  cursor: pointer;
  transition: color 150ms ease-out;
}

.proto-picker-item:hover { color: rgba(255, 255, 255, 0.85); }
.proto-picker-item:active { transform: scale(0.97); }
.proto-picker-item:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.4);
  outline-offset: 2px;
}
.proto-picker-item[data-active] { color: #fff; }

.proto-picker-divider {
  width: 1px;
  height: 16px;
  margin: 0 4px;
  background: rgba(255, 255, 255, 0.12);
}

.proto-picker-replay { padding: 0 10px; font-size: 14px; }

.proto-picker[data-position="top"] { bottom: auto; top: 24px; }

/* --- Chrome propio del harness, NO parte del picker --- */
.proto-tools {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 2147483646;
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 4px;
  border-radius: 999px;
  background: rgba(10, 10, 10, 0.82);
  -webkit-backdrop-filter: blur(12px) saturate(1.4);
  backdrop-filter: blur(12px) saturate(1.4);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.08) inset;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-size: 12px;
  line-height: 1;
}
.proto-tools-item {
  height: 26px;
  padding: 0 10px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
  font: inherit;
  cursor: pointer;
}
.proto-tools-item:hover { color: rgba(255, 255, 255, 0.9); }
.proto-tools-item[data-on] { color: #fff; background: rgba(255, 255, 255, 0.14); }
.proto-tools-divider { width: 1px; height: 14px; background: rgba(255, 255, 255, 0.12); }

/* Entrada del panel de confirmación: transform/opacity, ease-out, sub-300ms. */
@keyframes proto-enter {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: none; }
}
.proto-enter { animation: proto-enter 220ms cubic-bezier(0.16, 1, 0.3, 1) both; }
@media (prefers-reduced-motion: reduce) {
  .proto-enter { animation: none; }
}
/* Simulación de reduced-motion desde el harness, para poder verlo sin tocar el SO. */
#stage[data-motion="off"] *,
#stage[data-motion="off"] *::before,
#stage[data-motion="off"] *::after {
  animation: none !important;
  transition: none !important;
}
`;
