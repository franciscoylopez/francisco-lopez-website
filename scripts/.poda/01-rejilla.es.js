// Nueva §01 — fusión de las viejas 01 (rejilla), 02 (tokens), 03 (breakpoints)
// y 14 (esqueleto, que baja a ser la demo de las tres).
module.exports = (viejo) => ({
  num: "01 — Rejilla y medidas",
  title: "Ancha para maquetar, estrecha para leer",
  lead: "Doce columnas, un contenedor que tope en 1360 y una medida de lectura que nunca lo usa entero. Lo que se maqueta en el sitio se apoya en estos tres números.",

  showGrid: viejo.rejilla.showGrid,
  hideGrid: viejo.rejilla.hideGrid,
  baseLabel: viejo.rejilla.baseLabel,
  baseVal: viejo.rejilla.baseVal,
  gutterLabel: viejo.rejilla.gutterLabel,
  hint: "La franja marca las 12 columnas; el botón de arriba la alterna.",
  cards: [
    {
      title: "Medida de lectura",
      body: "El texto corrido no pasa de 42rem (~91 caracteres) aunque el contenedor sea ancho. Queda por encima de la medida clásica a propósito.",
    },
    {
      title: "Márgenes",
      body: "clamp(1.25rem, 5vw, 2.5rem): 20px en móvil, 40px en escritorio. Por encima de xl crecen ellos, nunca el contenido.",
    },
  ],

  tokensTitle: "Lo que este sistema le añade a Tailwind",
  tokensLead:
    "Los tokens que la escala de Tailwind no trae. Viven en el :root del sitio, así que cambiar uno lo cambia en las catorce páginas.",
  copyLabel: viejo.tokens.copyLabel,
  copyHint: viejo.tokens.copyHint,
  copyAria: viejo.tokens.copyAria,
  copiedAnnounce: viejo.tokens.copiedAnnounce,
  copiedLabel: viejo.tokens.copiedLabel,

  bpTitle: "Los cortes",
  bpLead:
    "Coinciden con la escala de Tailwind. Entre uno y el siguiente no salta nada: la tipografía y el espaciado interpolan con clamp().",
  cols: { token: "Token / min-width", ctx: "Contexto", change: "Qué cambia" },
  rows: [
    {
      token: "base",
      ctx: "Móvil",
      change: "Una columna, todo apilado. Tipografía en el mínimo del clamp.",
    },
    {
      token: "sm",
      ctx: "Móvil grande",
      change: "Botones y metadatos en fila; sigue una columna.",
    },
    {
      token: "md",
      ctx: "Tablet",
      change: "Aparece la retícula a dos columnas y los márgenes crecen.",
    },
    {
      token: "lg",
      ctx: "Escritorio",
      change: "Rejilla de 12 completa y grupos de tres tarjetas.",
    },
    {
      token: "xl",
      ctx: "Escritorio amplio",
      change: "Contenedor al tope; los márgenes absorben el ancho extra.",
    },
  ],

  esqTitle: "El esqueleto de la home",
  esqLead:
    "La misma página sin contenido: solo el ritmo vertical y la retícula que comparten sus secciones.",
  mobileNote:
    "Se muestra la versión móvil; la comparativa entre dispositivos necesita una pantalla ancha.",
  devGroupLabel: viejo.esqueleto.devGroupLabel,
  devFull: viejo.esqueleto.devFull,
  devTablet: viejo.esqueleto.devTablet,
  devMobile: viejo.esqueleto.devMobile,
  esqRows: viejo.esqueleto.rows,
});
