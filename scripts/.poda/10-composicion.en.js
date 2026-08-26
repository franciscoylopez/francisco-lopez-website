// New §10 — the three boxes that are neither control nor text.
// Merges old §12 (tables) and §17 (page blocks).
// Reviewed against the ES, not translated from it (D20).
module.exports = (viejo) => ({
  num: "12 — Page composition",
  title: "Neither controls nor text: the boxes a page is built from",
  lead: "A table, a side note and the closing block. All three moved up to the layer because their format is what cannot diverge from one page to the next.",

  /* ---------- the table ---------- */
  dataTitle: "The table",
  dataLead:
    "Real table markup, and that isn't cosmetic: without cells tied to their column, the census's thirteen rows of figures read as a string of numbers with no way to tell which theme is which.",
  demoCols: viejo.tablas.demoCols,
  demoRows: [
    {
      part: "Table name",
      markup: "caption",
      what: "Tells whoever can't see it what the table is. Not painted: the headline above already says it.",
    },
    {
      part: "Column header",
      markup: "th scope=col",
      what: "One single definition for the system's five tables.",
    },
    {
      part: "Row name",
      markup: "th scope=row",
      what: "Ties each figure to its row: «Dimmed on card, light, 9.14:1» instead of three loose numbers.",
    },
    {
      part: "Column width",
      markup: "colgroup",
      what: "Declared once, not in two places that have to be kept in sync.",
    },
  ],

  /* ---------- the side note ---------- */
  noteTitle: "The side note",
  noteLead:
    "A measurement, a tool's output, a rule worth stating apart: what a page says outside the body of the text.",
  noteKicker: "With a paragraph",
  noteRule:
    "A title and its explanation on the card surface. The grey of the body isn't picked by this piece: the background it lands on resolves it.",
  noteNote:
    "It takes three bodies and they combine: paragraph, list and a smaller footer.",
  monoKicker: "Monospaced title",
  monoRule:
    "When the title is the name of a token, a file or a tool, it goes monospaced: that way it reads as what it is, an identifier and not a sentence.",
  demoNoteTitle: viejo.bloques.demoNoteTitle,
  demoNoteBody: viejo.bloques.demoNoteBody,
  demoMonoTitle: viejo.bloques.demoMonoTitle,
  demoMonoBullets: viejo.bloques.demoMonoBullets,
  demoMonoFoot: viejo.bloques.demoMonoFoot,

  /* ---------- the page closer ---------- */
  closerTitle: "The page closer",
  closerLead:
    "The end of the content before the footer: where you go from here, with the same format across all fourteen pages.",
  closerKicker: "Two destinations",
  closerRule:
    "The whole thing moves up to the layer, not just the card: the vertical rhythm, the hairline above and the gap for the label are what must not diverge.",
  closerNote:
    "The arrow nudges toward where it points, and the nudge is off under reduced motion. A destination that doesn't exist yet is drawn dotted and dimmed.",
  demoCloserEyebrow: viejo.bloques.demoCloserEyebrow,
  demoBackKicker: viejo.bloques.demoBackKicker,
  demoBackName: viejo.bloques.demoBackName,
  demoBackDesc:
    "A real link: the arrow goes first and points left, which reads as going back without reading the label.",
  demoSoonKicker: viejo.bloques.demoSoonKicker,
  demoSoonName: viejo.bloques.demoSoonName,
  demoSoonDesc:
    "With no link, the card is drawn dotted and dimmed. It's what happens to the most recent experience, which never has a next one.",
  demoSoonBadge: viejo.bloques.demoSoonBadge,

  /* ---------- the section's single «why» ---------- */
  ruleTitle: "The whole format moves up, not just the box",
  rule: [
    "What must not diverge is the complete closing block, not the look of a card.",
    "The block knows nothing about this site: it receives a label and a list of destinations.",
    "Which page is sibling to which is decided by its callers, who do know.",
  ],
  ruleFoot:
    "It's the boundary that decides where a piece lives: if it knows something about this site, it isn't part of the system.",
});
