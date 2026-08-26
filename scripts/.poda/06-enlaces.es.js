// Nueva §06 — enlaces. Se conservan los cuatro casos y su regla; se recortan las
// notas y el pie, que repetían con más palabras lo que la regla ya decía.
module.exports = (viejo) => ({
  num: "08 — Enlaces",
  title: "Lo decide su función, no dónde cae",
  lead: "Si es contenido, el cian aparece como recompensa de la interacción. Si su bloque entero ya es navegación, el cian no distingue nada y sobra.",
  hint: viejo.enlaces.hint,

  cases: [
    {
      kicker: "Contenido",
      cls: ".link-content",
      rule: "En reposo, texto en foreground con un subrayado fino en primary. Con cursor o foco, un relleno sólido crece de abajo arriba y el texto se invierte.",
      note: "Reutiliza el par de contraste ya verificado de «texto sobre botón» en vez de inventar uno nuevo.",
    },
    {
      kicker: "Chrome de navegación",
      cls: ".link-chrome",
      rule: "Nav, breadcrumb, footer y menús: foreground o muted-foreground, nunca primary. En hover y foco, una pastilla de fondo muted.",
      note: "Se leen como enlace por su posición, y la pastilla funciona igual sin distinguir tonos.",
    },
    {
      kicker: "Chrome solo icono",
      cls: ".icon-chrome",
      rule: "Toggle de tema, menú y redes: la misma pastilla que el resto del chrome, ocupando los 44px completos del objetivo táctil.",
      note: "Un control sin etiqueta necesita la misma afordancia que uno con texto.",
    },
    {
      kicker: "Sobre banda invertida",
      cls: ".link-content · data-surface",
      rule: "Ahí el color de texto de la página ES el fondo, así que el enlace no elige su color: lo resuelve la banda, que declara qué superficie es.",
      note: "Los tres colores son los del otro tema, no valores nuevos. La superficie manda sobre la variante.",
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

  ruleTitle: "Por qué el cian no vive en el texto",
  rule: [
    "El cian es el único color de acción del sistema: si además tiñe todo enlace en reposo, deja de señalar nada.",
    "Reservarlo al momento de la interacción lo devuelve a ser una señal, no un color de párrafo.",
    "Ningún estado se codifica solo por color: subrayado, relleno y pastilla son cambios de forma.",
  ],
  ruleFoot:
    "El tono del chrome tampoco es decoración: el secundario sube a foreground en el mismo gesto en que aparece la pastilla, porque sin ese salto el par cae a AA justo en hover.",
});
