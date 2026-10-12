/**
 * Qué URL del repo es un ENLACE que un lector puede pulsar — `tests/enlaces.test.ts`.
 *
 * POR QUÉ ESTÁ PARTIDO EN DOS. Misma razón que `scripts/tablero/reglas.ts`: el
 * comando de al lado sale a la red, así que corre **fuera de CI** —un servidor
 * ajeno caído cinco minutos no puede poner un PR en rojo, que es el argumento de
 * D49/D99 para `psi`—. Eso dejaría su criterio sin red, y el criterio es justo la
 * mitad que se equivoca: **decidir qué cuenta como enlace**. Aquí no hay red ni
 * `fetch`, solo funciones puras sobre texto, y las prueba `npm test` en CI.
 *
 * LO QUE NO PUEDE VER, y conviene saberlo antes de creerse un verde: que la página
 * de destino diga lo que el texto del enlace promete. Detecta que la URL responde,
 * no que siga siendo la misma página. Un dominio caducado y recomprado devuelve
 * 200 tan campante.
 */

/** Una URL encontrada, con el archivo donde vive para poder arreglarla. */
export type Hallada = { url: string; archivo: string };

/** Por qué una URL NO se comprueba. Sale a informe: un metro que descarta en
 *  silencio miente igual que uno que no mira. */
export type Descartada = Hallada & { motivo: string };

/**
 * Lo que parece una URL y no es un enlace. Cada entrada lleva su porqué porque el
 * informe las lista: sin motivo, un descarte es indistinguible de un olvido.
 */
const NO_SON_ENLACES: { casa: (u: string) => boolean; motivo: string }[] = [
  {
    casa: (u) => u.includes("${") || u.includes("`"),
    motivo:
      "plantilla, no una URL: la compone el código en tiempo de ejecución",
  },
  {
    casa: (u) => u.startsWith("http://localhost"),
    motivo: "servidor de desarrollo",
  },
  {
    casa: (u) =>
      u.startsWith("http://www.w3.org/1999/xhtml") ||
      u.startsWith("http://www.w3.org/2000/svg") ||
      u.startsWith("https://schema.org"),
    motivo: "espacio de nombres XML/JSON-LD, no una página que se visite",
  },
  {
    casa: (u) =>
      u.includes("googletagmanager.com") ||
      u.includes("youtube-nocookie.com") ||
      u.includes("fonts.googleapis.com") ||
      u.includes("fonts.gstatic.com"),
    motivo: "endpoint de un tercero que carga el navegador, no un enlace",
  },
];

/**
 * Las URL de un archivo. Se cortan por el primer carácter que no puede estar
 * dentro de una URL en este repo —comillas, paréntesis de Markdown, espacio,
 * barra invertida— y se le quita la puntuación final, que en prosa se pega al
 * enlace («…en [WCAG](https://…/).» deja el punto fuera).
 */
export function urlsDe(texto: string, archivo: string): Hallada[] {
  const crudas = texto.match(/https?:\/\/[^"'`)\s\\<>]+/g) ?? [];
  return crudas.map((u) => ({
    url: u.replace(/[.,;:!?]+$/, ""),
    archivo,
  }));
}

/**
 * Parte las halladas en las que se comprueban y las que no, sin perder ninguna:
 * la suma de las dos listas es siempre la entrada. Y deduplica por URL, quedándose
 * con el primer archivo donde aparece — el informe nombra un sitio por el que
 * empezar, no todos.
 */
export function clasificar(halladas: Hallada[]): {
  enlaces: Hallada[];
  descartadas: Descartada[];
} {
  const vistas = new Set<string>();
  const enlaces: Hallada[] = [];
  const descartadas: Descartada[] = [];

  for (const h of halladas) {
    if (vistas.has(h.url)) continue;
    vistas.add(h.url);
    const regla = NO_SON_ENLACES.find((r) => r.casa(h.url));
    if (regla) descartadas.push({ ...h, motivo: regla.motivo });
    else enlaces.push(h);
  }

  return { enlaces, descartadas };
}

/** Qué se concluye de un código de respuesta. */
export type Veredicto = "vivo" | "muerto" | "no concluyente";

/**
 * ¿Cuenta como muerto? Es donde un metro así se equivoca, así que la regla se
 * escribe por lo que EXCLUYE:
 *
 * - **Muerto:** 404, 410 y el rango 5xx REAL (500–599). Más el DNS que no resuelve
 *   y el tiempo agotado, que los clasifica el comando.
 * - **No concluyente:** 401, 403, 405 y **todo código fuera de HTTP** (< 100 o
 *   ≥ 600). Un 403 lo devuelven varios sitios a un cliente que no parece
 *   navegador, y el 999 es el escudo antibot de LinkedIn — que fue el primer
 *   falso positivo de este guardián, y `999 >= 500` lo puntuaba como caído. Un
 *   umbral mal aplicado inventa hallazgos igual que un metro mal calibrado
 *   (`BRAND.md` §Cómo medir, punto 7).
 * - **Vivo:** todo lo demás.
 */
export function veredictoDe(status: number): Veredicto {
  if (status < 100 || status >= 600) return "no concluyente";
  if (status === 404 || status === 410) return "muerto";
  if (status >= 500) return "muerto";
  if (status === 401 || status === 403 || status === 405)
    return "no concluyente";
  return "vivo";
}

/**
 * Una redirección que merece informe: la que cambia de HOST o de RUTA. Las que
 * solo añaden idioma o parámetros de seguimiento no dicen nada —`developer.chrome.com`
 * devuelve `?hl=` según quién pregunte— y llenarían la salida de ruido, que es
 * cómo un informe deja de leerse. Una redirección real sí importa: es el 404 de
 * mañana, cuando el tercero deje de mantenerla.
 */
export function redirigido(url: string, final: string): boolean {
  try {
    const a = new URL(url);
    const b = new URL(final);
    const ruta = (u: URL) => u.pathname.replace(/\/$/, "");
    return a.host !== b.host || ruta(a) !== ruta(b);
  } catch {
    return url !== final;
  }
}
