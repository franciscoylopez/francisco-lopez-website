// Nueva §09 — formulario. Se conservan los tres especímenes y los dos bloques de
// regla, que son reglas en vigor y no historial; se van sus dos pies («el censo
// no podía haber encontrado esto», «es donde se olvida el idioma»), que contaban
// cómo se descubrió en vez de qué hay que hacer.
module.exports = (viejo) => ({
  num: "16 — Formulario",
  title: "La primera superficie que recibe, no la que enseña",
  lead: "Un campo no es un botón pequeño: tiene etiqueta, tiene estado de error, y tiene que decirlo en voz alta.",

  fieldTitle: viejo.formulario.fieldTitle,
  fieldLead: "Etiqueta y control son una sola pieza, y el suelo táctil vive en el control, que es donde se pulsa.",
  fieldKicker: viejo.formulario.fieldKicker,
  fieldRule: "La etiqueta va siempre visible y unida al campo, nunca dentro como texto de ayuda: un marcador de posición desaparece al escribir y deja el campo sin nombre.",
  fieldNote: "Alto mínimo de 44px, el mismo suelo táctil que los botones. El anillo de foco lo pone la regla global.",
  errorKicker: viejo.formulario.errorKicker,
  errorRule: "El mensaje se ata al campo, así que un lector de pantalla lo oye al llegar a él y no solo al intentar enviar.",
  errorNote: "El borde rojo y el icono marcan la forma; el texto va en el color normal.",

  summaryTitle: viejo.formulario.summaryTitle,
  summaryLead: "Un aviso que se anuncia solo, sin robar el foco, y que enumera qué campos hay que revisar.",
  summaryKicker: viejo.formulario.summaryKicker,
  summaryRule: "Aparece al intentar enviar y se anuncia como alerta. El foco lo mueve el formulario al primer campo que falla: dos saltos a la vez dejarían al lector sin saber dónde está.",

  demoLabel: viejo.formulario.demoLabel,
  demoPlaceholder: viejo.formulario.demoPlaceholder,
  demoError: viejo.formulario.demoError,
  demoSummary: viejo.formulario.demoSummary,
  demoSummaryItems: viejo.formulario.demoSummaryItems,

  redTitle: viejo.formulario.redTitle,
  redRule: [
    "El rojo del sistema mide 4,31:1 sobre el fondo claro: no llega al mínimo que pide un texto.",
    "Así que el mensaje va en el color de texto normal, y el rojo se queda en el borde y el icono, donde el umbral es más bajo.",
    "De regalo, el error deja de estar codificado solo por color.",
  ],

  serverTitle: viejo.formulario.serverTitle,
  serverRule: [
    "La validación del navegador existe para no gastar un viaje en un campo vacío, no para decidir.",
    "La misma regla corre en el servidor, porque quien envía a mano no ha ejecutado la del navegador.",
    "Y devuelve códigos, no frases: las palabras las pone el diccionario, en los dos idiomas.",
  ],
});
