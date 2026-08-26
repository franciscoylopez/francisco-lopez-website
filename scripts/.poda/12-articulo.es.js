// Nueva §12 — la capa de artículo largo. La excepción del sistema, y por eso
// cierra la página en vez de quedar en medio.
//
// DE TRECE ESPECÍMENES A SEIS (decidido el 2026-08-26). Podar las notas dejó la
// sección en 748 palabras y ahí topaba: el volumen no era prosa, era catálogo.
// Bajar de ahí ya no es podar, es dejar de publicar especímenes, y esta capa es
// la que mejor lo aguanta — D76 la dejó FUERA del núcleo a propósito, así que no
// tiene que documentarse con el detalle del sistema. Lo que se enseña es la
// FORMA; el catálogo entero es el artículo mismo, que está a un clic.
//
// LOS SEIS NO SON UNA SELECCIÓN LIBRE: entre ellos tienen que aparecer los tres
// archivos de `components/ui/` que declaran publicarse aquí —`article.tsx`,
// `article-islands.tsx` y `live-stat.tsx`—, o `check:indices` sale rojo. Por eso
// el dato en vivo se queda aunque sea el menos vistoso: es el único espécimen de
// su archivo.
//
// Lo que se agrupa en vez de desaparecer: la portada junta autoría, compartir e
// índice; las citas juntan la destacada y la menor; las islas juntan progreso,
// riel y dock. Lo que sale del catálogo y se sigue viendo en la demo: la franja
// de enlace a la prueba y la transición de capítulo.
module.exports = (viejo) => {
  const a = viejo.articulo;

  return {
    num: "15 — Artículo largo",
    title: "La forma para texto largo con paradas",
    lead: "Once secciones y varios miles de palabras necesitan piezas que el resto del sitio no usa. Es una capa aparte, no la octava del núcleo.",

    groups: {
      portada: {
        title: a.groups.portada.title,
        lead: "Lo que solo aparece una vez, al principio: quién firma, cómo se comparte y el mapa de paradas.",
      },
      parada: {
        title: a.groups.parada.title,
        lead: "Una sola pieza, repetida once veces. Es lo que hace que todas las secciones se reconozcan como la misma.",
      },
      cuerpo: {
        title: a.groups.cuerpo.title,
        lead: "Piezas que no cortan la columna: se colocan a un lado y el texto sigue alrededor.",
      },
      islas: {
        title: a.groups.islas.title,
        lead: "Las tres islas de cliente, fijas a la ventana. Aquí se demuestran juntas dentro de una caja.",
      },
    },

    fichas: {
      portada: {
        kicker: "Portada",
        cls: "<ByLine> · <ShareActions> · <ArticleIndex>",
        rule: "Autoría, compartir y el mapa de paradas con el tiempo de cada una. El índice se pinta en servidor: se ve y se salta sin JavaScript.",
        note: "Un artículo firmado dice quién lo firma en la apertura, no en el pie. Y sin `navigator.share` el botón copia el enlace igualmente.",
      },
      cover: {
        kicker: a.fichas.cover.kicker,
        cls: a.fichas.cover.cls,
        rule: "Rótulo y titular a la izquierda; a la derecha, el ordinal ilustrado con su meta-línea debajo.",
      },
      citas: {
        kicker: "Citas",
        cls: "<Pullquote> · <Pull>",
        rule: "La destacada para la lectura, con filetes arriba y abajo; la menor solo acompaña, con un filete pastel en el canto.",
        note: "El morado aquí es ornamento, no información. Y cuando las dos caen en la misma sección, flotan a lados contrarios.",
      },
      diagram: {
        kicker: a.fichas.diagram.kicker,
        cls: a.fichas.diagram.cls,
        rule: "El marco de un diagrama propio o de un artefacto real, con su pie. El dibujo lo aporta la página.",
        note: "Sin flotar ocupa el ancho completo de la columna: un panel no es prosa.",
      },
      livestat: {
        kicker: a.fichas.livestat.kicker,
        cls: a.fichas.livestat.cls,
        rule: "Una cifra que no se escribe en el diccionario: se enlaza a la página que la publica de verdad.",
      },
      islas: {
        kicker: "Las tres islas",
        cls: "<ReadingProgress> · <SectionRail> · <FloatingShare>",
        rule: "La barra de progreso del borde superior, el índice flotante con la parada activa, y el dock de compartir a la derecha.",
        note: "Son mejora, no requisito: el índice de servidor ya cubre la navegación si el observador no llega a arrancar.",
      },
    },

    ruleTitle: "Qué es esta capa y qué no",
    rule: [
      "Ninguna de estas piezas sabe nada de este sitio: reciben texto y enlaces, no copy propio ni rutas.",
      "No es una octava pieza del núcleo: es una capa aparte, para texto largo con paradas.",
      "Los especímenes son las piezas reales importadas, con contenido de muestra: si una cambia, esta sección cambia con ella.",
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
      "Igual que en la página real, pero contenidos a este panel: fuera de él van fijos a la ventana.",
  };
};
