// New §07 — everything that is pressed and has a box of its own.
// Absorbs old §18 (video) as a single specimen: the control over an image.
// Reviewed against the ES, not translated from it (D20).
module.exports = (viejo) => ({
  num: "09 — Buttons and actions",
  title: "A button doesn't pick its look: its role does",
  lead: "How many actions compete beside it, and whether it carries state, decide the variant. The variant already resolves hover, focus and touch target.",
  hint: viejo.botones.hint,

  cases: [
    {
      kicker: "Primary action",
      cls: "solid",
      rule: "The only cyan fill on screen. On hover the fill blends toward the text colour instead of lightening, which raises the contrast rather than lowering it.",
    },
    {
      kicker: "Content action",
      cls: "outline-primary",
      rule: "Cyan on the border and the text, turning into a full fill on hover. For actions that stand alone, with no other button beside them to compete with.",
    },
    {
      kicker: "Utility",
      cls: "outline-neutral · ghost",
      rule: "No cyan: neutral border or no box, and a grey pill on hover. It's what a button wears when it sits next to a solid one in the same group.",
      note: "With cyan, two buttons in the same group would both claim to be the main action.",
    },
    {
      kicker: "Switch",
      cls: "toggle-primary",
      rule: "A lone control that turns on something that wasn't there. On, full fill; off, cyan border with a tint on hover, never the fill.",
      note: "With a fill, the off state on hover would look like the on state and the control would stop saying which one it's in.",
    },
    {
      kicker: "Group of alternatives",
      cls: "toggle-neutral",
      rule: "Several segments of which exactly one is active. The active one goes solid cyan; the rest, neutral.",
      note: "Painting them all cyan distinguishes nothing and swallows the section.",
    },
    {
      kicker: "Icon only",
      cls: "icon",
      rule: "Controls with no label: the same pill as the rest of the chrome, filling the whole 44px touch target.",
    },
    {
      kicker: "Pressable card",
      cls: "card",
      rule: "When the click target is the whole box and not a line of text: card background, grey pill on hover, and box padding instead of button padding.",
    },
    {
      kicker: "Over an image",
      cls: ".video-facade",
      rule: "The photo decides the background, so the control can't fix its own colour. A veil separates it from the image and the disc runs in two tones, so its inner edge doesn't depend on what's underneath.",
      note: "The veil takes the page background colour, never black: black fixes one theme and ruins the other.",
    },
  ],

  demoSolid: viejo.botones.demoSolid,
  demoOutlinePrimary: viejo.botones.demoOutlinePrimary,
  demoNeutral: viejo.botones.demoNeutral,
  demoGhost: viejo.botones.demoGhost,
  demoSegments: viejo.botones.demoSegments,
  stateOn: viejo.botones.stateOn,
  stateOff: viejo.botones.stateOff,
  demoCardLabel: viejo.botones.demoCardLabel,
  demoCardValue: viejo.botones.demoCardValue,
  focusShow: viejo.botones.focusShow,
  focusHide: viejo.botones.focusHide,
  demoVideoTitle: viejo.video.demoVideoTitle,
  demoPlayLabel: viejo.video.demoPlayLabel,

  iconTitle: "When an action carries an icon",
  iconRule: [
    "One question: does this action take you out of the page? Downloading a file, opening mail or the phone, or going to another site all carry one.",
    "Anything that happens inside the page goes without: accept, save, close, pick a tab or navigate the site.",
    "It goes before the label, because it classifies the action. Only on the solid one does it go after and advance two pixels on hover: there it marks the direction of travel.",
  ],
  iconFoot:
    "Size, gap and side are set by the variant, not by each use. At the call site you write the icon and nothing else.",

  ruleTitle: "Why this is a component and not a convention",
  rule: [
    "No control is written with loose classes. If a case fits no variant, the variant gets created; if it's an exception, it's documented with a date.",
    "Changing a hover is changing one line, and it reaches every button on the site at once.",
    "Focus isn't declared by any variant: one global rule sets it, the same one for the whole site.",
  ],
});
