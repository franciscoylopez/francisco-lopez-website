/**
 * De la paleta de Mermaid a los tokens del sitio, y el guardián que comprueba
 * que no ha quedado ni un color fijo.
 *
 * Van juntos a propósito: la tabla es una lista de colores CONOCIDOS y una lista
 * de conocidos falla en silencio, así que lo que la hace fiable es el barrido de
 * ausencia que va detrás. Separarlos dejaría la tabla sin su red.
 */

// 4 · La paleta, a tokens. El orden importa: primero los hex largos.
//
// EL LIENZO DE MERMAID ES `--card`, NO `--background`. Mermaid llama «blanco» a
// su lienzo, y aquí el lienzo es el panel que envuelve al diagrama, que se pinta
// `bg-card`. Por eso todo lo que Mermaid deja en blanco —el cuerpo del cluster,
// el hueco del estado final, el estado compuesto— se mapea a `var(--card)`: son
// huecos, no superficies nuevas. El relleno de NODO sigue yendo a
// `var(--background)`, que es un peldaño por debajo del panel en los dos temas y
// es lo que hace que la caja se vea.
const PALETA: [RegExp, string][] = [
  // Trazo de nodos, clusters y aristas → el cian de marca (7,47 / 8,36 contra
  // `--background`, umbral de gráfico 3:1).
  [/#9370DB/gi, "var(--brand-cyan)"],
  // Relleno de nodo → el fondo de la página, para que la caja respire igual en
  // los dos temas.
  [/#ECECFF/gi, "var(--background)"],
  // Texto. Mermaid escribe el mismo gris en las dos notaciones, y la corta se
  // escapó de la primera versión de esta tabla: dejó 4 `fill:#333` vivos.
  [/#333333/gi, "var(--foreground)"],
  [/#333\b/gi, "var(--foreground)"],
  [/#000000/gi, "var(--foreground)"],
  // Cluster: relleno y filete.
  [/#f0f0f0/gi, "var(--muted)"],
  [/#e0e0e0/gi, "var(--border)"],
  // Notas de Mermaid: si alguna aparece, que sea neutra y no amarilla.
  [/#fff5ad/gi, "var(--muted)"],
  [/#aaaa33/gi, "var(--border)"],
  [/#552222/gi, "var(--foreground)"],
  [/#131300/gi, "var(--foreground)"],
  // La pastilla que Mermaid pone detrás de la etiqueta de una arista, para que
  // el texto no se lea encima de la flecha. Va a `--muted` —que es a donde ya
  // iba su `#f0f0f0`— y no a `--card`: si se funde con el lienzo deja de
  // enmascarar, que es su único trabajo.
  [/rgba\(232,\s*232,\s*232,\s*0?\.8\)/gi, "var(--muted)"],
  // El fondo blanco del lienzo.
  [/background-color:\s*rgb\(255,\s*255,\s*255\);?/gi, ""],
  [/fill="rgb\(255,\s*255,\s*255\)"/gi, 'fill="transparent"'],
  // Los nombres de color. Mermaid los mezcla con los hex en la misma hoja, y
  // por ahí entraron los cinco slabs blancos que en oscuro dejaban el diagrama
  // con pinta de captura pegada sobre la página. `red` es el color con el que
  // Mermaid marca una etiqueta que no ha sabido resolver: aquí no puede quedar.
  [/(fill|stroke|color|background-color)\s*:\s*white\b/gi, "$1:var(--card)"],
  [
    /(fill|stroke|color|background-color)\s*:\s*(black|red)\b/gi,
    "$1:var(--foreground)",
  ],
];

/** Aplica la tabla. El orden importa: primero los hex largos. */
export function aTokens(svg: string): string {
  let salida = svg;
  for (const [re, token] of PALETA) salida = salida.replace(re, token);
  return salida;
}

// 7 · EL GUARDIÁN. Los pasos de arriba son una lista de colores CONOCIDOS, y una
// lista de conocidos falla en silencio: la primera versión mapeaba `#333333` pero
// no `#333`, y no cubría los nombres de color, así que el export se publicó con
// 17 declaraciones de color fijo y cinco rectángulos blancos que en oscuro no
// conmutaban. No lo cazó el typecheck, ni el linter, ni `gate:html` —el HTML era
// idéntico, el que estaba mal era el color— sino mirar el diagrama en oscuro.
//
// Así que aquí no se comprueba que los conocidos cuadren, sino que NO QUEDA
// NINGÚN color literal en el archivo: mismo giro que D38 le dio al guardián de
// la paleta. Si Mermaid cambia su hoja o el diagrama estrena una forma nueva,
// esto se rompe en la terminal y no en la página.
const COLOR_LITERAL =
  /(fill|stroke|color|background-color|flood-color|stop-color)\s*:\s*([^;}"']+)/gi;
const PERMITIDO = /^(none|transparent|currentcolor|inherit|var\(--[\w-]+\))$/i;

/** Las declaraciones de color que no conmutan con el tema, sin repetir. */
export function fugasDeColor(svg: string): string[] {
  return [
    ...new Set(
      [...svg.matchAll(COLOR_LITERAL)]
        .map(([, prop = "", valor = ""]) => [prop, valor.trim()] as const)
        .filter(([, valor]) => valor !== "" && !PERMITIDO.test(valor))
        .map(([prop, valor]) => `${prop}:${valor}`),
    ),
  ];
}
