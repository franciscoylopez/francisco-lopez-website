/**
 * UNA corrida del censo: llevar el navegador hasta el estado en que se puede
 * medir, y juzgar lo que devuelve.
 *
 * Son dos cosas y por eso son dos funciones. Conducir es una secuencia de gestos
 * con su porqué medido detrás —el consentimiento, el scroll, la espera del
 * observador—; juzgar es aplicar los umbrales. Lo que las une, el recorrido de
 * las 28 corridas y el veredicto del conjunto, se queda en `scripts/censo.ts`.
 */
import { ab } from "../navegador/agent-browser";

export type Par = {
  clave: string;
  ratio: number;
  px: number;
  nivel: string;
  ejemplo: string;
};

/** Contorno de un control: WCAG 1.4.11, que no es contraste de texto. */
export type Contorno = {
  ejemplo: string;
  lados: string;
  bordeVsFondo: number | null;
  rellenoVsFondo: number | null;
  veces: number;
};

export type Censo = {
  metro: string;
  reglasHover: string;
  /** Cuántos reveals había, y cuántos hubo que encender para poder medirlos. */
  reveals: string;
  /** Cuántos textos ha mirado la composición por opacidad, y cuántos compuso. */
  opacidad: string;
  tema: string;
  pares: number;
  bajoAA: Par[];
  bajoAAA: Par[];
  sinMedir: Par[];
  /** Todos los pares medidos, con su clave: es el inventario de la corrida. */
  censo: Par[];
  contornos: string;
  bajo3: Contorno[];
};

/**
 * Abre la página en el tema pedido, la deja en estado medible e inyecta el guion.
 */
export function mideCorrida(
  url: string,
  tema: string,
  guionCenso: string,
): Censo {
  ab(["open", url]);
  ab(["set", "media", tema]);
  // EL DIÁLOGO DE CONSENTIMIENTO SE DECIDE, NO SE HEREDA (P72.15, 2026-09-02).
  // Aporta pares, y su estado dependía del `localStorage` del navegador que
  // conducía la pasada: en una sesión donde alguien ya había aceptado no se
  // pintaba, y sus pares desaparecían de las catorce páginas a la vez. Es la
  // causa del 414 → 391 del 2026-08-27 sobre el mismo contenido. Se limpia y se
  // recarga, así que el diálogo entra SIEMPRE y la pasada es reproducible.
  ab([
    "eval",
    "localStorage.removeItem('flm-consent'); localStorage.removeItem('flm-consent-seen'); 'ok'",
  ]);
  ab(["reload"]);
  ab(["set", "media", tema]);
  // SE DESPLAZA ANTES DE MEDIR (P68.585, 2026-08-24). La pasada abría la
  // página y medía ahí mismo, así que TODA isla que solo monta al hacer
  // scroll —el riel de secciones del artículo es el caso— no estaba en el DOM
  // cuando se la iba a medir. Doce controles que el censo no podía ver por
  // este motivo, además de los que no veía por su criterio de caja.
  //
  // Desplazar es ESTRICTAMENTE ADITIVO para la cobertura: el censo recorre el
  // DOM entero y su `esVisible` mira tamaño y visibilidad, no intersección
  // con el viewport, así que bajar no quita nada de la lista — solo añade lo
  // que hasta ahora no llegaba a existir.
  ab(["eval", "window.scrollTo(0, document.body.scrollHeight * 0.5); 'ok'"]);
  // Y se espera al `IntersectionObserver`, que no resuelve en el mismo
  // fotograma: sin esta pausa el riel sigue sin montar y el arreglo de arriba
  // no serviría de nada.
  //
  // OJO CON LO QUE ESTO **NO** ARREGLA (P50.79, 2026-08-28): el scroll resuelve
  // lo que no está MONTADO, no lo que está a `opacity: 0`. Bajar al 50% y
  // esperar encendió 9 de los 29 reveals de `/accesibilidad`, porque el
  // observador solo dispara lo que cruza en ese momento. De eso se encarga
  // `mostrarReveals()`, dentro del propio guion, y por eso son dos cosas.
  ab(["eval", "new Promise((r) => setTimeout(() => r('ok'), 900))"]);
  ab(["eval", "--stdin"], guionCenso);
  const crudo = ab(["eval", "JSON.stringify(window.contrastCensus())"]);
  // `eval` devuelve la cadena JSON entrecomillada; se desenvuelve dos veces.
  return JSON.parse(JSON.parse(crudo.trim().split("\n").pop()!)) as Censo;
}

/** Las cuatro guardas de cero del metro, y el tema pintado contra el pedido. */
function juzgaElMetro(etiqueta: string, tema: string, c: Censo): string[] {
  const problemas: string[] = [];
  const temaPintado = tema === "dark" ? "oscuro" : "claro";

  if (!c.metro.startsWith("OK"))
    problemas.push(`${etiqueta}: EL METRO NO SE VALIDA — ${c.metro}`);
  if (c.tema !== temaPintado)
    problemas.push(
      `${etiqueta}: se pidió tema ${tema} y la página pintó «${c.tema}». ` +
        `El \`set media\` no ha llegado, así que esta corrida mide otra cosa.`,
    );
  if (c.reglasHover.startsWith("0"))
    problemas.push(`${etiqueta}: ${c.reglasHover}`);
  if (c.contornos.startsWith("0"))
    problemas.push(`${etiqueta}: ${c.contornos}`);
  if (c.opacidad.startsWith("0 —"))
    problemas.push(`${etiqueta}: ${c.opacidad}`);
  if (c.pares === 0)
    problemas.push(
      `${etiqueta}: cero pares medidos. Una página siempre tiene pares.`,
    );

  return problemas;
}

/** Lo que esta corrida tiene de malo: primero el metro, luego los umbrales. */
export function juzgaCorrida(
  etiqueta: string,
  tema: string,
  c: Censo,
): string[] {
  const problemas = juzgaElMetro(etiqueta, tema, c);

  for (const p of c.bajoAA)
    problemas.push(
      `${etiqueta}: FALLA AA — ${p.ratio.toFixed(2)}:1 en ${p.px}px · ${p.ejemplo}`,
    );
  for (const p of c.bajoAAA)
    if (p.nivel !== "FALLA AA")
      problemas.push(
        `${etiqueta}: bajo AAA — ${p.ratio.toFixed(2)}:1 en ${p.px}px · ${p.ejemplo}`,
      );

  // WCAG 1.4.11: el control tiene que poder reconocerse COMO control. Basta con
  // que uno de los dos caminos llegue a 3:1, así que el mensaje dice los dos —
  // si no, el lector no sabe cuál subir.
  for (const c11 of c.bajo3)
    problemas.push(
      `${etiqueta}: FALLA 1.4.11 — ni el borde (${c11.bordeVsFondo ?? "—"}) ` +
        `ni el relleno (${c11.rellenoVsFondo ?? "—"}) llegan a 3:1 · ` +
        `${c11.ejemplo}${c11.veces > 1 ? ` ×${c11.veces}` : ""}`,
    );

  return problemas;
}
