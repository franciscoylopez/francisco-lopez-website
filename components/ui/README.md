# `components/ui/` — el inventario de piezas

> **Derivado, no escrito.** Lo genera `npm run indices` leyendo la primera
> línea de cada archivo (`// @pieza grupo · publicación · frase`) y lo
> comprueba `npm run check:indices` en cada PR. Para cambiar una frase se
> edita el archivo, nunca este README.
>
> **Es la lista que contesta el paso 1 de la «Regla de construcción»**
> (`CLAUDE.md`): ¿existe ya la pieza? Los tres grupos no son la misma cifra
> mal contada: el **núcleo** es el sistema, la capa de **artículo** quedó
> fuera de él a propósito (D76) y las **primitivas** son piezas sueltas.

<!-- ÍNDICE · lo genera `npm run indices`; no se edita a mano -->
### núcleo · 8
- **`action.tsx`** — El control CON CAJA: botón, chip, toggle, pestaña y control solo-icono. *([design-system/07-botones](../site/design-system/07-botones.tsx))*
- **`badge.tsx`** — El rótulo que NO se pulsa, en dos ejes: `tone` × `kind`. *([design-system/08-etiquetas](../site/design-system/08-etiquetas.tsx))*
- **`chrome.tsx`** — El enlace de la carpintería de navegación: `shape` × `tone`. *([design-system/06-enlaces](../site/design-system/06-enlaces.tsx))*
- **`field.tsx`** — El campo de formulario: etiqueta, control y su error, con el resumen del envío. *([design-system/09-formulario](../site/design-system/09-formulario.tsx))*
- **`heading.tsx`** — El par eyebrow + titular con el que abren página y sección. *([design-system/03-tipografia](../site/design-system/03-tipografia.tsx))*
- **`layout.ts`** — Las cajas y los ritmos comunes: WRAP, SECTION, PROSE, CARD, PANEL, PAIR y el andamiaje del pliegue. *([design-system/01-rejilla](../site/design-system/01-rejilla.tsx))*
- **`stat-row.tsx`** — La fila de cifras que resume una apertura. *([design-system/03-tipografia](../site/design-system/03-tipografia.tsx))*
- **`table.tsx`** — La rejilla de filas y celdas: tabla real si son datos, divs si son especímenes. *([design-system/10-composicion](../site/design-system/10-composicion.tsx))*

### artículo · 2
- **`article-islands.tsx`** — Las islas de cliente del texto largo: barra de progreso, copiar enlace y compartir. *([design-system/12-articulo](../site/design-system/12-articulo.tsx))*
- **`article.tsx`** — Los bloques del texto largo: firma, portada de capítulo, cita, franja de repo y diagrama. *([design-system/12-articulo](../site/design-system/12-articulo.tsx))*

### primitiva · 11
- **`copy-button.tsx`** — Copiar un valor al portapapeles: directo si hay uno, con menú si hay dos. *([design-system/01-rejilla](../site/design-system/01-rejilla.tsx))*
- **`icons.tsx`** — Los iconos que lucide no trae (LinkedIn, GitHub), con la regla de autoría propia. *([brand-kit/06-uso](../site/brand-kit/06-uso.tsx))*
- **`info-card.tsx`** — La tarjeta de nota: un título y su explicación, al margen del cuerpo. *([design-system/10-composicion](../site/design-system/10-composicion.tsx))*
- **`live-stat.tsx`** — La regleta de un dato en vivo: la cifra no se escribe, se enlaza a quien la publica. *([design-system/12-articulo](../site/design-system/12-articulo.tsx))*
- **`logo.tsx`** — El monograma y el wordmark, con la firma split y su umbral de 48px. *([brand-kit/02-logotipo](../site/brand-kit/02-logotipo.tsx))*
- **`marcas.tsx`** — Marca los nombres propios del sitio como no traducibles. *(interna — no pinta nada: envuelve los nombres propios en un atributo invisible, y una sección que la enseñara mostraría un texto idéntico al de al lado. La vigila `npm run check:marcas` sobre las 28 variantes)*
- **`page-closer.tsx`** — El cierre común de las páginas: a dónde se va desde aquí. *([design-system/10-composicion](../site/design-system/10-composicion.tsx))*
- **`rich.tsx`** — El render de markup inline del copy del diccionario: negrita, cursiva y enlace. *(interna — no tiene aspecto propio que enseñar: es infraestructura de texto (D23), y lo que de ella sí se ve —el enlace de contenido— se publica en §08)*
- **`section-index-islands.tsx`** — El riel fijo que sigue la sección activa de una página con paradas. *([design-system/10-composicion](../site/design-system/10-composicion.tsx))*
- **`section-index.tsx`** — La navegación de una página con paradas: el índice y el cierre de bloque. *([design-system/10-composicion](../site/design-system/10-composicion.tsx))*
- **`video-embed.tsx`** — La facade de vídeo de terceros: póster propio y el clic como gate (D55). *([design-system/07-botones](../site/design-system/07-botones.tsx))*
<!-- FIN ÍNDICE -->
