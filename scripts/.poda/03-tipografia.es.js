// Nueva §03 — la escala tipográfica y la capa de cabecera que la aplica.
//
// Fusiona las viejas 05 (tipografía) y 11 (cabeceras): eran una ESCALA y su
// APLICACIÓN, y separadas contestaban dos veces «cómo de grande es un titular»,
// a 187 y a 873 palabras.
//
// Lo que se va de la 11 es el historial —«estaba escrita a mano catorce veces»,
// «dos de ellas pisaban el tamaño de al lado», el barrido de 11rem contra
// 13rem—: es arqueología y su sitio es DECISIONS.md. Lo que se queda es la
// regla en vigor y la tabla, que es lo que se viene a consultar.
//
// Y EL SUBAPARTADO DEL GRIS SE VA A §04, decidido el 2026-08-26: enseña que el
// atenuado lo pone la SUPERFICIE donde cae, y eso es asunto de claro y oscuro,
// no de tipografía. Aquí era el cuarto subapartado de una sección que ya era la
// segunda más larga.
module.exports = (viejo) => ({
  num: "05 — Tipografía y cabeceras",
  title: "El tamaño lo decide el ancho, no el dispositivo",
  lead: "Bricolage Grotesque para titulares, Inter para texto y UI. Móvil es el mínimo del clamp; escritorio, el máximo.",

  // La escala: es una tabla de consulta y se queda entera. Sus filas son datos.
  cols: viejo.tipografia.cols,
  rows: viejo.tipografia.rows,

  sizesTitle: "La cabecera que la aplica",
  sizesLead:
    "Un rótulo corto encima y un titular debajo. Salen de una sola pieza, así que el tamaño del titular decide también el hueco que los separa.",
  sizesCols: { use: "Dónde se usa" },
  sizes: [
    {
      size: "page",
      eyebrow: "Fundamentos de diseño",
      sample: "Design System",
      use: "El h1 que abre una página.",
    },
    {
      size: "page-sm",
      eyebrow: "Quién hay detrás",
      sample: "Sobre mí",
      use: "El h1 de las páginas de lectura larga.",
    },
    {
      size: "section",
      eyebrow: "Recorrido",
      sample: "Trayectoria",
      use: "El h2 que abre una sección.",
    },
    {
      size: "section-sm",
      eyebrow: "Capa de cabecera",
      sample: "Cabeceras",
      use: "Sección de un índice largo, como las de esta página.",
    },
    {
      size: "card",
      eyebrow: "",
      sample: "Discovery",
      use: "El titular de una pieza dentro de una rejilla.",
    },
    {
      size: "sub",
      eyebrow: "",
      sample: "El producto que ya existía",
      use: "El h3 de un subapartado, sin rótulo encima.",
    },
    {
      size: "sub-sm",
      eyebrow: "",
      sample: "Antes y después",
      use: "El escalón por debajo: un bloque de apoyo dentro de una sección.",
    },
  ],

  labelTitle: "El otro rótulo en versalitas, que no es este",
  labelLead:
    "Se parecen y hacen cosas distintas, así que son dos piezas: una abre una sección emparejada con un titular, la otra rotula un dato dentro del contenido.",
  labelEyebrowKicker: "Abre una sección",
  labelEyebrowRule:
    "Va siempre encima de un titular, y el hueco que los separa lo pone el tamaño del titular que tiene debajo.",
  labelEyebrowSample: "Trayectoria",
  labelEyebrowTitle: "Diez años de producto",
  labelDataKicker: "Rotula un dato",
  labelDataRule:
    "Sin titular al lado no hay hueco que derivar: el margen lo pone quien la usa. Va un punto más pequeña y menos abierta.",
  labelDataSample: "Duración",
  labelDataValue: "5 años y 6 meses",

  statTitle: "Debajo del titular, la fila de cifras",
  statLead:
    "Cuando una apertura resume algo en datos, la fila no la monta la página: la trae una pieza con su filete, su hueco y su rejilla.",
  stat: {
    kicker: "Fila de cifras",
    cls: "StatRow · Stat",
    rule: "StatRow pone el filete, el hueco y la rejilla que reparte las columnas. Stat pone la cifra, su unidad y la etiqueta de debajo.",
    labels: viejo.cabeceras.stat.labels,
  },

  ruleTitle: "Qué decide la variante y qué el punto de uso",
  rule: [
    "El tamaño elige el hueco entre rótulo y titular, y también el interlineado.",
    "El punto de uso solo pone lo que depende del contenido: el ancho máximo, o el equilibrio de un titular que parte mal.",
    "Los siete tamaños no son deriva sino jerarquía: el h1 que abre una página no es el h2 que abre una sección.",
  ],
});
