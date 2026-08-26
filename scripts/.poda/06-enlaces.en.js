// New §06 — links. Rules kept, notes and footer trimmed.
// Reviewed against the ES, not translated from it (D20).
module.exports = (viejo) => ({
  num: "08 — Links",
  title: "Its function decides, not where it sits",
  lead: "Inside content, cyan is the reward for interacting. Inside a block that is already navigation, cyan tells you nothing and only adds noise.",
  hint: viejo.enlaces.hint,

  cases: [
    {
      kicker: "Content",
      cls: ".link-content",
      rule: "At rest, foreground text with a thin primary underline. On hover or focus, a solid fill grows from the bottom up and the text flips.",
      note: "It reuses the already verified «text on button» contrast pair instead of inventing a new one.",
    },
    {
      kicker: "Navigation chrome",
      cls: ".link-chrome",
      rule: "Nav, breadcrumb, footer and menus: foreground or muted-foreground, never primary. On hover and focus, a muted background pill.",
      note: "They read as links by their position, and the pill works without telling hues apart.",
    },
    {
      kicker: "Icon-only chrome",
      cls: ".icon-chrome",
      rule: "Theme toggle, menu and social icons: the same pill as the rest of the chrome, filling the full 44px touch target.",
      note: "A control with no label needs the same affordance as one with text.",
    },
    {
      kicker: "On an inverted band",
      cls: ".link-content · data-surface",
      rule: "There the page's text colour IS the background, so the link doesn't pick its own: the band resolves it by declaring which surface it is.",
      note: "The three colours are the other theme's, not new values. The surface overrules the variant.",
    },
  ],

  invertedKicker: viejo.enlaces.invertedKicker,
  demoInvertedBefore: viejo.enlaces.demoInvertedBefore,
  demoInvertedLink: viejo.enlaces.demoInvertedLink,
  demoInvertedAfter: viejo.enlaces.demoInvertedAfter,
  demoContentBefore: viejo.enlaces.demoContentBefore,
  demoContentLink: viejo.enlaces.demoContentLink,
  demoContentAfter: viejo.enlaces.demoContentAfter,
  demoChromeItems: viejo.enlaces.demoChromeItems,

  ruleTitle: "Why cyan does not live in the text",
  rule: viejo.enlaces.rule,
  ruleFoot:
    "The chrome's tone isn't decoration either: the secondary one lifts to foreground in the same gesture that brings the pill, because without that jump the pair drops to AA right on hover.",
});
