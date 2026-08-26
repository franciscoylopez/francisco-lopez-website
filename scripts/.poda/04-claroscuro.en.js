// New §04 — light and dark, plus the dimmed grey the surface resolves.
// Reviewed against the ES, not translated from it (D20).
module.exports = (viejo) => ({
  num: "06 — Light and dark",
  title: "Depth comes from hairlines, not shadows",
  lead: "Same skeleton and same surface hierarchy: background → card → border. Light is warm paper; dark is deep blue.",

  lightLabel: viejo.claroscuro.lightLabel,
  darkLabel: viejo.claroscuro.darkLabel,
  sampleHeadline: viejo.claroscuro.sampleHeadline,
  cta: viejo.claroscuro.cta,

  toneTitle: "The dimmed grey is set by the surface",
  toneLead:
    "The two labels below come from the same class, with nothing to tell them apart where they are used. They paint differently because the background underneath them is not the same.",
  tones: [
    {
      surface: "--background",
      label: "Design fundamentals",
      sample: "On the page background",
      note: "The system grey, tuned against this background and only against it.",
    },
    {
      surface: "--muted",
      label: "The next step",
      sample: "On the contact band",
      note: "Over any other surface it is recomputed: it blends 85% into the background underneath. Nobody has to ask for it.",
    },
  ],

  ruleTitle: "Colour rule",
  rule: [
    "primary is the only action colour. secondary, muted and accent stay neutral.",
    "Links follow two rules: primary inside content; foreground or muted-foreground in navigation chrome.",
    "Brand tones decorate or sign the logo. Splits and pastels, never as text.",
  ],
  ruleFoot: viejo.claroscuro.ruleFoot,
});
