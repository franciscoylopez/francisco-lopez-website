// New §11 — closing checklist and measured contrast. Almost all data; the only
// long prose was the brand-purple-accent story, which belongs in DECISIONS.md.
module.exports = (viejo) => ({
  ...viejo.accesibilidad,
  num: "13 — Closing checklist",
  lead: "The list each page closes with. It's the internal build criterion; the public conformance statement lives on the Accessibility page.",
  contrastNote:
    "Every text pair in the system reaches AAA in light and in dark, and not only at rest: on hover too, which is where it usually slips. No exceptions.",
});
