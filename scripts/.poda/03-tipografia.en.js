// New §03 — the type scale and the header layer that applies it.
// Reviewed against the ES, not translated from it (D20).
module.exports = (viejo) => ({
  num: "05 — Type and headers",
  title: "Width decides the size, not the device",
  lead: "Bricolage Grotesque for headlines, Inter for text and UI. Mobile is the clamp minimum; desktop, the maximum.",

  cols: viejo.tipografia.cols,
  rows: viejo.tipografia.rows,

  sizesTitle: "The header that applies it",
  sizesLead:
    "A short label above, a headline below. They come from a single piece, so the headline's size also decides the gap between them.",
  sizesCols: { use: "Where it's used" },
  sizes: [
    {
      size: "page",
      eyebrow: "Design fundamentals",
      sample: "Design System",
      use: "The h1 that opens a page.",
    },
    {
      size: "page-sm",
      eyebrow: "Who's behind this",
      sample: "About me",
      use: "The h1 of long-read pages.",
    },
    {
      size: "section",
      eyebrow: "Journey",
      sample: "Career",
      use: "The h2 that opens a section.",
    },
    {
      size: "section-sm",
      eyebrow: "Header layer",
      sample: "Headers",
      use: "A section of a long index, like the ones on this page.",
    },
    {
      size: "card",
      eyebrow: "",
      sample: "Discovery",
      use: "The headline of a piece inside a grid.",
    },
    {
      size: "sub",
      eyebrow: "",
      sample: "The product that already existed",
      use: "The h3 of a subsection, with no label above.",
    },
    {
      size: "sub-sm",
      eyebrow: "",
      sample: "Before and after",
      use: "One step below: a supporting block inside a section.",
    },
  ],

  labelTitle: "The other small-caps label, which is not this one",
  labelLead:
    "They look alike and do different jobs, so they are two pieces: one opens a section paired with a headline, the other labels a value inside the content.",
  labelEyebrowKicker: "Opens a section",
  labelEyebrowRule:
    "It always sits above a headline, and the gap between them comes from the size of the headline below it.",
  labelEyebrowSample: "Career",
  labelEyebrowTitle: "Ten years of product",
  labelDataKicker: "Labels a value",
  labelDataRule:
    "With no headline beside it there is no gap to derive: the margin is set by whoever uses it. It runs a point smaller and less open.",
  labelDataSample: "Length",
  labelDataValue: "5 years and 6 months",

  statTitle: "Below the headline, the row of figures",
  statLead:
    "When an opening sums something up in numbers, the page doesn't assemble the row: a piece brings it with its hairline, its gap and its grid.",
  stat: {
    kicker: "Row of figures",
    cls: "StatRow · Stat",
    rule: "StatRow sets the hairline, the gap and the grid that splits the columns. Stat sets the figure, its unit and the label below.",
    labels: viejo.cabeceras.stat.labels,
  },

  ruleTitle: "What the variant decides and what the call site does",
  rule: [
    "The size picks the gap between label and headline, and the line height too.",
    "The call site only sets what depends on the content: the maximum width, or the balance of a headline that breaks badly.",
    "The seven sizes aren't drift, they're hierarchy: the h1 that opens a page is not the h2 that opens a section.",
  ],
});
