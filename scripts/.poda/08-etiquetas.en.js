// New §08 — labels. Reviewed against the ES, not translated from it (D20).
module.exports = (viejo) => ({
  num: "10 — Labels",
  title: "It tags, it isn't pressed",
  lead: "It sits outside the action layer: no state, no hover, no touch target. Its only job is to be read.",
  hint: viejo.etiquetas.hint,

  cases: [
    {
      kicker: "No weight",
      cls: "neutral",
      demo: viejo.etiquetas.cases[0].demo,
      rule: "What tags along without standing out: a status, a note in the margin, the off half of a pair.",
      note: "Its text can't be the system grey, tuned against the page background: on top of the pill it drops to 6.44:1.",
    },
    {
      kicker: "Verified figure",
      cls: "cyan",
      demo: viejo.etiquetas.cases[1].demo,
      rule: "A cyan wash for what has been measured, or what passes. The cyan lives in the fill; never in the text.",
    },
    {
      kicker: "Brand mark",
      cls: "purple",
      demo: viejo.etiquetas.cases[2].demo,
      rule: "A purple wash for what flags something singular: a career milestone, a variant of the logo.",
      note: "Purple is decorative and never an action colour, so here it can only show up as fill.",
    },
    {
      kicker: "Three registers",
      cls: "label · value · code",
      demo: viejo.etiquetas.cases[3].demo,
      rule: "Small caps for a status tag, ordinary case for a figure in prose, monospace for a technical value.",
      note: "It's the only thing that changes from one label to another: height, size, radius and padding are shared.",
    },
  ],

  ruleTitle: "Why this is its own layer",
  rule: [
    "A label isn't an action: it isn't pressed. Half a button's base (touch target, focus ring, states) would mean nothing here.",
    "A difference that means something is a variant; one that means nothing is a value to unify.",
  ],
  ruleFoot:
    "The text of both tinted ones is the ordinary text colour, not the wash's. That's what takes them to {badgeTinted.light} in light and {badgeTinted.dark} in dark; tinted they sat at 6.07 and 5.46.",
});
