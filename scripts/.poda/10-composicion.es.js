// Nueva §10 — las tres cajas que no son ni control ni texto.
//
// Fusiona las viejas 12 (tablas) y 17 (bloques de página). Francisco tenía razón
// en que la 17 no daba para sección propia; lo que sí merecen sus piezas es
// estar, y junto a la tabla tienen nombre: la tabla, la nota al margen y el
// cierre de página son lo que se usa para COMPONER una página, frente a los
// controles y al texto corrido.
//
// SE VA TODO EL HISTORIAL, que era la mitad de las dos secciones: «tres
// definiciones que divergían en siete propiedades», «cinco paddings verticales»,
// «las dos nacieron dos veces», y la historia de la cebra que se midió y se
// borró. Es material de DECISIONS.md, no de una página que se consulta.
module.exports = (viejo) => ({
  num: "12 — Composición de página",
  title: "Ni controles ni texto: las cajas con las que se monta una página",
  lead: "Una tabla, una nota al margen y el remate del final. Las tres suben a la capa porque su formato es lo que no puede divergir de una página a otra.",

  /* ---------- la tabla ---------- */
  dataTitle: "La tabla",
  dataLead:
    "Marcado de tabla de verdad, y no es cosmética: sin celdas atadas a su columna, las trece filas de cifras del censo se leen como una ristra de números sin saber cuál es cada tema.",
  demoCols: viejo.tablas.demoCols,
  demoRows: [
    {
      part: "Nombre de la tabla",
      markup: "caption",
      what: "Dice qué es la tabla a quien no la ve. No se pinta: el titular de encima ya lo dice.",
    },
    {
      part: "Cabecera de columna",
      markup: "th scope=col",
      what: "Una sola definición para las cinco tablas del sistema.",
    },
    {
      part: "Nombre de la fila",
      markup: "th scope=row",
      what: "Ata cada cifra a su fila: «Atenuado sobre card, claro, 9,14:1» en vez de tres números sueltos.",
    },
    {
      part: "Ancho de columna",
      markup: "colgroup",
      what: "Se declara una vez, y no en dos sitios que hay que hacer coincidir.",
    },
  ],

  /* ---------- la nota al margen ---------- */
  noteTitle: "La nota al margen",
  noteLead:
    "Una medida, el resultado de una herramienta, una regla que conviene decir aparte: lo que una página cuenta fuera del cuerpo del texto.",
  noteKicker: "Con párrafo",
  noteRule:
    "Un título y su explicación sobre la superficie de tarjeta. El gris del cuerpo no lo elige esta pieza: lo resuelve el fondo donde cae.",
  noteNote:
    "Admite tres cuerpos y se combinan: párrafo, lista y un pie más pequeño.",
  monoKicker: "Título en monoespaciada",
  monoRule:
    "Cuando el título es el nombre de un token, de un archivo o de una herramienta, va en monoespaciada: así se lee como lo que es, un identificador y no una frase.",
  demoNoteTitle: viejo.bloques.demoNoteTitle,
  demoNoteBody: viejo.bloques.demoNoteBody,
  demoMonoTitle: viejo.bloques.demoMonoTitle,
  demoMonoBullets: viejo.bloques.demoMonoBullets,
  demoMonoFoot: viejo.bloques.demoMonoFoot,

  /* ---------- el cierre de página ---------- */
  closerTitle: "El cierre de página",
  closerLead:
    "El remate del contenido antes del pie: a dónde se va desde aquí, con el mismo formato en las catorce páginas.",
  closerKicker: "Dos destinos",
  closerRule:
    "Sube entero a la capa, y no solo la tarjeta: el ritmo vertical, el filete de arriba y el hueco del rótulo son lo que tiene que no divergir.",
  closerNote:
    "La flecha empuja hacia donde apunta, y el empujón se apaga con movimiento reducido. Un destino que aún no existe se dibuja punteado y apagado.",
  demoCloserEyebrow: viejo.bloques.demoCloserEyebrow,
  demoBackKicker: viejo.bloques.demoBackKicker,
  demoBackName: viejo.bloques.demoBackName,
  demoBackDesc:
    "Enlace real: la flecha va delante y apunta a la izquierda, que es lo que se lee como volver sin leer el rótulo.",
  demoSoonKicker: viejo.bloques.demoSoonKicker,
  demoSoonName: viejo.bloques.demoSoonName,
  demoSoonDesc:
    "Sin enlace, la tarjeta se dibuja punteada y apagada. Es lo que le pasa a la experiencia más reciente, que nunca tiene una siguiente.",
  demoSoonBadge: viejo.bloques.demoSoonBadge,

  /* ---------- el único «por qué» de la sección ---------- */
  ruleTitle: "El formato sube entero, no solo la caja",
  rule: [
    "Lo que tiene que no divergir es el remate completo, no el aspecto de una tarjeta.",
    "El bloque no sabe nada de este sitio: recibe un rótulo y una lista de destinos.",
    "Quién es hermana de quién lo deciden sus llamadores, que sí lo saben.",
  ],
  ruleFoot:
    "Es la frontera que decide dónde vive una pieza: si sabe algo de este sitio, no es del sistema.",
});
