// New §09 — form. Reviewed against the ES, not translated from it (D20).
module.exports = (viejo) => ({
  num: "16 — Form",
  title: "The first surface that receives, not the one that shows",
  lead: "A field isn't a small button: it has a label, it has an error state, and it has to say so out loud.",

  fieldTitle: viejo.formulario.fieldTitle,
  fieldLead: viejo.formulario.fieldLead,
  fieldKicker: viejo.formulario.fieldKicker,
  fieldRule: viejo.formulario.fieldRule,
  fieldNote:
    "Minimum height of 44px, the same touch target floor as the buttons. The focus ring comes from the global rule.",
  errorKicker: viejo.formulario.errorKicker,
  errorRule: viejo.formulario.errorRule,
  errorNote:
    "The red border and the icon carry the shape; the text stays in the normal colour.",

  summaryTitle: viejo.formulario.summaryTitle,
  summaryLead: viejo.formulario.summaryLead,
  summaryKicker: viejo.formulario.summaryKicker,
  summaryRule: viejo.formulario.summaryRule,

  demoLabel: viejo.formulario.demoLabel,
  demoPlaceholder: viejo.formulario.demoPlaceholder,
  demoError: viejo.formulario.demoError,
  demoSummary: viejo.formulario.demoSummary,
  demoSummaryItems: viejo.formulario.demoSummaryItems,

  redTitle: viejo.formulario.redTitle,
  redRule: viejo.formulario.redRule,
  serverTitle: viejo.formulario.serverTitle,
  serverRule: viejo.formulario.serverRule,
});
