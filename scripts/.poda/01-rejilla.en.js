// New §01 — merge of old 01 (grid), 02 (layout tokens), 03 (breakpoints) and
// 14 (skeleton, which becomes the demo of the three).
// Reviewed against the ES, not translated from it (D20).
module.exports = (viejo) => ({
  num: "01 — Grid and measures",
  title: "Wide to lay out, narrow to read",
  lead: "Twelve columns, a container that caps at 1360 and a reading measure that never uses all of it. Everything laid out on this site rests on those three numbers.",

  showGrid: viejo.rejilla.showGrid,
  hideGrid: viejo.rejilla.hideGrid,
  baseLabel: viejo.rejilla.baseLabel,
  baseVal: viejo.rejilla.baseVal,
  gutterLabel: viejo.rejilla.gutterLabel,
  hint: "The band marks the 12 columns; the button above toggles it.",
  cards: [
    {
      title: "Reading measure",
      body: "Running text never exceeds 42rem (~91 characters) however wide the container gets. It sits above the classic measure on purpose.",
    },
    {
      title: "Margins",
      body: "clamp(1.25rem, 5vw, 2.5rem): 20px on mobile, 40px on desktop. Past xl they grow, never the content.",
    },
  ],

  tokensTitle: "What this system adds to Tailwind",
  tokensLead:
    "The tokens Tailwind's scale doesn't ship. They live in the site's :root, so changing one changes it across all fourteen pages.",
  copyLabel: viejo.tokens.copyLabel,
  copyHint: viejo.tokens.copyHint,
  copyAria: viejo.tokens.copyAria,
  copiedAnnounce: viejo.tokens.copiedAnnounce,
  copiedLabel: viejo.tokens.copiedLabel,

  bpTitle: "The cuts",
  bpLead:
    "They match Tailwind's scale. Nothing jumps between one and the next: type and spacing interpolate with clamp().",
  cols: { token: "Token / min-width", ctx: "Context", change: "What changes" },
  rows: [
    {
      token: "base",
      ctx: "Mobile",
      change: "One column, everything stacked. Type at the clamp minimum.",
    },
    {
      token: "sm",
      ctx: "Large mobile",
      change: "Buttons and metadata in a row; still one column.",
    },
    {
      token: "md",
      ctx: "Tablet",
      change: "The two-column grid appears and margins grow.",
    },
    {
      token: "lg",
      ctx: "Desktop",
      change: "Full 12-column grid and groups of three cards.",
    },
    {
      token: "xl",
      ctx: "Wide desktop",
      change: "Container at its cap; margins absorb the extra width.",
    },
  ],

  esqTitle: "The skeleton of the home page",
  esqLead:
    "The same page without content: only the vertical rhythm and the grid its sections share.",
  mobileNote:
    "Showing the mobile version; comparing devices needs a wide screen.",
  devGroupLabel: viejo.esqueleto.devGroupLabel,
  devFull: viejo.esqueleto.devFull,
  devTablet: viejo.esqueleto.devTablet,
  devMobile: viejo.esqueleto.devMobile,
  esqRows: viejo.esqueleto.rows,
});
