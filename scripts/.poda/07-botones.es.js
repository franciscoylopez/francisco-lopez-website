// Nueva §07 — todo lo que se pulsa y tiene caja propia.
//
// ABSORBE LA VIEJA 18 (vídeo). De sus 428 palabras se queda una ficha: el control
// sobre imagen, que es una variante de acción más y por eso su sitio es esta
// sección. Lo demás de aquella sección contaba el gate de consentimiento y la
// procedencia del póster, que es privacidad y no diseño, y ya está contado en el
// artículo y en la política de cookies. Es literalmente lo que señaló Francisco:
// «hay mucha info para hablar básicamente de un velo sobre el botón».
//
// Y SE VA LA ARQUEOLOGÍA de las notas: «cuando se escribía a mano el icono del
// footer se quedó en 40px», «el mismo icono medía 15, 17 y 18 píxeles en tres
// sitios», «la misma decisión estaba escrita en seis archivos». Todo eso vive en
// DECISIONS.md; aquí va la regla en vigor.
module.exports = (viejo) => ({
  num: "09 — Botones y acciones",
  title: "Un botón no elige su aspecto: lo elige su papel",
  lead: "Cuántas acciones compiten a su lado, y si lleva estado, deciden la variante. La variante ya trae resueltos el hover, el foco y el objetivo táctil.",
  hint: viejo.botones.hint,

  cases: [
    {
      kicker: "Acción destacada",
      cls: "solid",
      rule: "El único relleno cian de la pantalla. En hover el relleno se mezcla hacia el color de texto en vez de aclararse, que es lo que sube el contraste en lugar de bajarlo.",
    },
    {
      kicker: "Acción de contenido",
      cls: "outline-primary",
      rule: "Cian en el borde y el texto, que en hover pasa a relleno pleno. Para acciones que viven solas, sin otro botón al lado con el que competir.",
    },
    {
      kicker: "Utilidad",
      cls: "outline-neutral · ghost",
      rule: "Sin cian: borde neutro o sin caja, y pastilla gris en hover. Es lo que lleva un botón que convive con un sólido en el mismo grupo.",
      note: "Con cian, dos botones del mismo grupo reclamarían ser la acción principal.",
    },
    {
      kicker: "Interruptor",
      cls: "toggle-primary",
      rule: "Un control suelto que enciende algo que no estaba. Encendido, relleno pleno; apagado, borde cian con un tinte en hover, nunca el relleno.",
      note: "Con relleno, el apagado en hover se vería igual que el encendido y el control dejaría de decir en qué estado está.",
    },
    {
      kicker: "Grupo de alternativas",
      cls: "toggle-neutral",
      rule: "Varios segmentos de los que exactamente uno está activo. El activo va en cian sólido; el resto, en neutro.",
      note: "Pintarlos todos de cian no distingue nada y se come la sección.",
    },
    {
      kicker: "Solo icono",
      cls: "icon",
      rule: "Controles sin etiqueta: la misma pastilla que el resto del chrome, ocupando los 44px completos del objetivo táctil.",
    },
    {
      kicker: "Tarjeta pulsable",
      cls: "card",
      rule: "Cuando lo que se pulsa es la caja entera y no un renglón: fondo de tarjeta, pastilla gris en hover y padding de caja en vez de padding de botón.",
    },
    {
      kicker: "Sobre una imagen",
      cls: ".video-facade",
      rule: "El fondo lo decide la foto, así que el control no puede fijar su color. Un velo lo separa de la imagen y el disco va en dos tonos, para que su borde interior no dependa de lo que haya debajo.",
      note: "El velo es del color del fondo, nunca negro: el negro arregla un tema y empeora el otro.",
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

  iconTitle: "Cuándo una acción lleva icono",
  iconRule: [
    "Una sola pregunta: ¿esta acción saca de la página? Descargar un archivo, abrir el correo o el teléfono, o irse a otro sitio web llevan icono.",
    "Lo que ocurre dentro de la página va sin él: aceptar, guardar, cerrar, elegir una pestaña o navegar por el sitio.",
    "Va delante de la etiqueta, porque clasifica la acción. Solo en el sólido va detrás y avanza dos píxeles en hover: ahí marca la dirección del viaje.",
  ],
  iconFoot:
    "El tamaño, el hueco y el lado los pone la variante, no cada uso. En el punto de uso se escribe el icono y nada más.",

  ruleTitle: "Por qué esto es un componente y no una convención",
  rule: [
    "Ningún control se escribe con clases sueltas. Si un caso no encaja en ninguna variante, se crea la variante; si es una excepción, se documenta con fecha.",
    "Cambiar un hover es cambiar una línea, y llega a todos los botones del sitio a la vez.",
    "El foco no lo declara ninguna variante: lo pone una sola regla global, la misma para todo el sitio.",
  ],
});
