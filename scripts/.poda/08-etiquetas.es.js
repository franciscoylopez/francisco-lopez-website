// Nueva §08 — etiquetas. Se van las cifras repetidas en cada nota y el inventario
// de lo que había antes («ocho pastillas escritas a mano en seis archivos»); se
// quedan la regla de color, que es la que se incumple si no está escrita, y las
// dos cifras que la sostienen.
module.exports = (viejo) => ({
  num: "10 — Etiquetas",
  title: "Rotula, no se pulsa",
  lead: "No sale de la capa de acción: no tiene estado, ni hover, ni objetivo táctil. Solo tiene que leerse.",
  hint: viejo.etiquetas.hint,

  cases: [
    {
      kicker: "Sin carga",
      cls: "neutral",
      demo: viejo.etiquetas.cases[0].demo,
      rule: "Lo que acompaña sin destacar: un estado, una nota al margen, la mitad apagada de un par.",
      note: "Su texto no puede ser el gris del sistema, calibrado contra el fondo de la página: encima de la pastilla se queda en 6,44:1.",
    },
    {
      kicker: "Dato verificado",
      cls: "cyan",
      demo: viejo.etiquetas.cases[1].demo,
      rule: "Velo de cian para lo que se ha medido o lo que se cumple. El cian está en el fondo; en el texto, nunca.",
    },
    {
      kicker: "Distintivo de marca",
      cls: "purple",
      demo: viejo.etiquetas.cases[2].demo,
      rule: "Velo de morado para lo que señala una singularidad: un hito de la trayectoria, una variante del logo.",
      note: "El morado es decorativo y nunca color de acción, así que aquí solo puede aparecer como relleno.",
    },
    {
      kicker: "Tres registros",
      cls: "label · value · code",
      demo: viejo.etiquetas.cases[3].demo,
      rule: "Versalitas para un rótulo de estado, caja normal para un dato en prosa, monoespaciada para un valor técnico.",
      note: "Es lo único que cambia de una etiqueta a otra: alto, cuerpo, radio y padding son los mismos para todas.",
    },
  ],

  ruleTitle: "Por qué es una capa aparte",
  rule: [
    "Una etiqueta no es una acción: no se pulsa. Media base de un botón (suelo táctil, anillo de foco, estados) no significaría nada aquí.",
    "Una diferencia que significa algo es una variante; una que no significa nada es un valor a unificar.",
  ],
  ruleFoot:
    "El texto de las dos teñidas es el color de texto normal, no el del velo. Es lo que las lleva a {badgeTinted.light} en claro y {badgeTinted.dark} en oscuro; teñido se quedaban en 6,07 y 5,46.",
});
