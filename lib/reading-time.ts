// Palabras y tiempo de lectura de un artículo largo, calculados desde el
// diccionario en build — nunca escritos como string (D60, nota de herencia de
// P59 en la tarea P60). El diccionario es la única fuente; este módulo solo
// cuenta lo que ya hay ahí, para que «5.900 palabras» o «≈4 min» no se queden
// atrás el día que cambie una frase.

/** Quita el markup ligero de `Rich` (D23) antes de contar: `**negrita**`,
 * `*cursiva*` y `[texto](url)` no son palabras del lector, son sintaxis. */
function stripRichMarkup(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1");
}

function countWords(text: string): number {
  const stripped = stripRichMarkup(text).trim();
  if (stripped === "") return 0;
  return stripped.split(/\s+/).length;
}

/** Un bloque de cuerpo de sección: párrafo, subtítulo, lista, cita o diagrama.
 * Mismo tipo que consume `ArticleProse` (ver `components/ui/article.tsx`). La
 * cita y el diagrama viven DENTRO del cuerpo —no como campo aparte— para que
 * floten en su sitio exacto del párrafo y el texto de alrededor los rodee
 * (feedback de diseño de P60, tanda 2: una cita o un diagrama aparte del flujo,
 * siempre al final de la sección, no se integraba con el texto al que
 * pertenecía). El `id` del diagrama resuelve contra el registro site-specific
 * que pasa el llamador a `ArticleProse` — el bloque no sabe dibujar nada, solo
 * dónde debe aparecer el dibujo. */
export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | {
      type: "quote";
      text: string;
      style: "pullquote" | "pull";
      label?: string;
      side?: "left" | "right";
    }
  | { type: "diagram"; id: string; caption: string; side?: "left" | "right" }
  | {
      type: "livestat";
      id: string;
      label: string;
      source: string;
      value: string;
      linkLabel: string;
      href: string;
    };

function wordsOfBlocks(blocks: ArticleBlock[]): number {
  return blocks.reduce((sum, block) => {
    if (block.type === "ul") {
      return sum + block.items.reduce((s, item) => s + countWords(item), 0);
    }
    if (block.type === "quote") return sum; // ya contada como parte del párrafo que cita
    if (block.type === "diagram") return sum + countWords(block.caption);
    if (block.type === "livestat") return sum; // dato, no prosa
    return sum + countWords(block.text);
  }, 0);
}

/** ~200 palabras/min, redondeado hacia arriba: nunca «0 min» para una sección
 * corta ni un tiempo optimista que el lector no cumple. */
const WORDS_PER_MINUTE = 200;

export function minutesFor(words: number): number {
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

/** Palabras y minutos de una sección, a partir de su cuerpo. */
export function sectionReadingTime(blocks: ArticleBlock[]): {
  words: number;
  minutes: number;
} {
  const words = wordsOfBlocks(blocks);
  return { words, minutes: minutesFor(words) };
}

/** Palabras totales del artículo: suma de todas las secciones más la apertura. */
export function articleWordCount(
  sections: { body: ArticleBlock[] }[],
  extra: ArticleBlock[] = [],
): number {
  return (
    sections.reduce((sum, s) => sum + wordsOfBlocks(s.body), 0) +
    wordsOfBlocks(extra)
  );
}
