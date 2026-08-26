// New §12 — the long-article layer, cut from thirteen specimens to six.
// The six must between them cover the three components/ui/ files that declare
// they publish here, or check:indices goes red.
// Reviewed against the ES, not translated from it (D20).
module.exports = (viejo) => {
  const a = viejo.articulo;
  return {
    num: "15 — Long article",
    title: "The shape for long text with stops",
    lead: "Eleven sections and several thousand words need pieces the rest of the site doesn't use. It's a layer apart, not the core's eighth piece.",

    groups: {
      portada: {
        title: a.groups.portada.title,
        lead: "What only shows up once, at the start: who signs it, how it's shared and the map of stops.",
      },
      parada: {
        title: a.groups.parada.title,
        lead: "A single piece, repeated eleven times. It's what makes every section recognisable as the same one.",
      },
      cuerpo: {
        title: a.groups.cuerpo.title,
        lead: "Pieces that don't cut the column: they sit to one side and the text runs around them.",
      },
      islas: {
        title: a.groups.islas.title,
        lead: "The three client islands, pinned to the window. Here they're demonstrated together inside a box.",
      },
    },

    fichas: {
      portada: {
        kicker: "Opening",
        cls: "<ByLine> · <ShareActions> · <ArticleIndex>",
        rule: "Byline, sharing and the map of stops with a time for each. The index is server-rendered: you can see it and jump from it without JavaScript.",
        note: "A signed article says who signs it in the opening, not in the footer. And without `navigator.share` the button copies the link anyway.",
      },
      cover: {
        kicker: a.fichas.cover.kicker,
        cls: a.fichas.cover.cls,
        rule: "Label and headline on the left; on the right, the illustrated ordinal with its meta line below.",
      },
      citas: {
        kicker: "Quotes",
        cls: "<Pullquote> · <Pull>",
        rule: "The featured one stops the reading, with hairlines above and below; the minor one only accompanies, with a pastel rule on its edge.",
        note: "Purple here is ornament, not information. And when both land in the same section, they float to opposite sides.",
      },
      diagram: {
        kicker: a.fichas.diagram.kicker,
        cls: a.fichas.diagram.cls,
        rule: "The frame for an own diagram or a real artefact, with its caption. The drawing comes from the page.",
        note: "Unfloated it takes the full width of the column: a panel isn't prose.",
      },
      livestat: {
        kicker: a.fichas.livestat.kicker,
        cls: a.fichas.livestat.cls,
        rule: "A figure that isn't typed into the dictionary: it links to the page that actually publishes it.",
      },
      islas: {
        kicker: "The three islands",
        cls: "<ReadingProgress> · <SectionRail> · <FloatingShare>",
        rule: "The progress bar at the top edge, the floating index with the active stop highlighted, and the share dock on the right.",
        note: "They're an enhancement, not a requirement: the server index already covers navigation if the observer never starts.",
      },
    },

    ruleTitle: "What this layer is and what it isn't",
    rule: [
      "None of these pieces knows anything about this site: they receive text and links, not copy or routes of their own.",
      "It isn't the core's eighth piece: it's a layer apart, for long text with stops.",
      "The specimens are the real pieces imported, with sample content: if one changes, this section changes with it.",
    ],

    coverKicker: a.coverKicker,
    coverTitle: a.coverTitle,
    coverMeta: a.coverMeta,
    pullquote: a.pullquote,
    pull: a.pull,
    liveStatLabel: a.liveStatLabel,
    liveStatSource: a.liveStatSource,
    liveStatValue: a.liveStatValue,
    liveStatLink: a.liveStatLink,
    repoLabel: a.repoLabel,
    repoText: a.repoText,
    pieSample: a.pieSample,
    chapterPositionLabel: a.chapterPositionLabel,
    chapterIndexLabel: a.chapterIndexLabel,
    chapterNextLabel: a.chapterNextLabel,
    bylineName: a.bylineName,
    bylineRole: a.bylineRole,
    indexKicker: a.indexKicker,
    indexTimeLabel: a.indexTimeLabel,
    indexAriaLabel: a.indexAriaLabel,
    indexItems: a.indexItems,
    diagramCaption: a.diagramCaption,
    progressAriaLabel: a.progressAriaLabel,
    shareLabel: a.shareLabel,
    shareCopyLabel: a.shareCopyLabel,
    shareCopiedLabel: a.shareCopiedLabel,
    shareCopiedAnnounce: a.shareCopiedAnnounce,
    shareUnavailableAnnounce: a.shareUnavailableAnnounce,
    railHint:
      "Just like the real page, but contained to this panel: outside it they're pinned to the window.",
  };
};
