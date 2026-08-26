// Nueva §04 — claro y oscuro, y el atenuado que lo pone la superficie.
//
// GANA EL SUBAPARTADO DEL GRIS, que venía de la vieja 11 (cabeceras). Allí era el
// cuarto subapartado de una sección que ya era la segunda más larga, y sobre todo
// no era de su asunto: enseña que el atenuado lo decide la SUPERFICIE donde cae
// el texto, y eso es jerarquía de superficies, que es justo de lo que va esta
// sección. Decidido el 2026-08-26.
module.exports = (viejo) => ({
  num: "06 — Claro y oscuro",
  title: "La profundidad la dan los filetes, no las sombras",
  lead: "Mismo esqueleto y misma jerarquía de superficies: fondo → tarjeta → borde. El claro es papel cálido; el oscuro, azul profundo.",

  lightLabel: viejo.claroscuro.lightLabel,
  darkLabel: viejo.claroscuro.darkLabel,
  sampleHeadline: viejo.claroscuro.sampleHeadline,
  cta: viejo.claroscuro.cta,

  toneTitle: "El gris atenuado lo pone la superficie",
  toneLead:
    "Los dos rótulos de abajo salen de la misma clase, sin nada que los distinga donde se usan. Se pintan distinto porque el fondo que tienen debajo es otro.",
  tones: [
    {
      surface: "--background",
      label: "Fundamentos de diseño",
      sample: "Sobre el fondo de la página",
      note: "El gris del sistema, calibrado contra este fondo y solo contra él.",
    },
    {
      surface: "--muted",
      label: "El siguiente paso",
      sample: "Sobre la franja de contacto",
      note: "Encima de cualquier otra superficie se recalcula: se mezcla un 85% hacia el fondo de debajo. No hay que pedirlo.",
    },
  ],

  ruleTitle: "Regla de color",
  rule: [
    "primary es el único color de acción. secondary, muted y accent se quedan neutros.",
    "Los enlaces van en dos reglas: primary en el contenido; foreground o muted-foreground en la navegación de chrome.",
    "Los tonos de marca decoran o firman el logo. Splits y pasteles, nunca como texto.",
  ],
  ruleFoot: viejo.claroscuro.ruleFoot,
});
