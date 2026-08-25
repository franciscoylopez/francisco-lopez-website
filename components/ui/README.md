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
- **`action.tsx`** — El control CON CAJA: botón, chip, toggle, pestaña y control solo-icono. *([design-system/09-botones](../site/design-system/09-botones.tsx))*
- **`badge.tsx`** — El rótulo que NO se pulsa, en dos ejes: `tone` × `kind`. *([design-system/10-etiquetas](../site/design-system/10-etiquetas.tsx))*
- **`chrome.tsx`** — El enlace de la carpintería de navegación: `shape` × `tone`. *([design-system/08-enlaces](../site/design-system/08-enlaces.tsx))*
- **`field.tsx`** — El campo de formulario: etiqueta, control y su error, con el resumen del envío. *([design-system/16-formulario](../site/design-system/16-formulario.tsx))*
- **`heading.tsx`** — El par eyebrow + titular con el que abren página y sección. *([design-system/11-cabeceras](../site/design-system/11-cabeceras.tsx))*
- **`layout.ts`** — Las cajas y los ritmos comunes: WRAP, SECTION, PROSE, CARD, PANEL, PAIR, HERO_ROW. *([design-system/01-rejilla](../site/design-system/01-rejilla.tsx))*
- **`stat-row.tsx`** — La fila de cifras que resume una apertura. *([design-system/11-cabeceras](../site/design-system/11-cabeceras.tsx))*
- **`table.tsx`** — La rejilla de filas y celdas: tabla real si son datos, divs si son especímenes. *([design-system/12-tablas](../site/design-system/12-tablas.tsx))*
### artículo · 2
- **`article-islands.tsx`** — Las islas de cliente del texto largo: riel de secciones, copiar enlace, compartir. *([design-system/15-articulo](../site/design-system/15-articulo.tsx))*
- **`article.tsx`** — Los bloques del texto largo: portada de capítulo, cita, diagrama, cierre. *([design-system/15-articulo](../site/design-system/15-articulo.tsx))*
### primitiva · 8
- **`icons.tsx`** — Los iconos que lucide no trae (LinkedIn, GitHub), con la regla de autoría propia. *([brand-kit/06-uso](../site/brand-kit/06-uso.tsx))*
- **`info-card.tsx`** — La tarjeta de nota: un título y su explicación, al margen del cuerpo. *(sin publicar)*
- **`live-stat.tsx`** — La regleta de un dato en vivo: la cifra no se escribe, se enlaza a quien la publica. *([design-system/15-articulo](../site/design-system/15-articulo.tsx))*
- **`logo.tsx`** — El monograma y el wordmark, con la firma split y su umbral de 48px. *([brand-kit/02-logotipo](../site/brand-kit/02-logotipo.tsx))*
- **`marcas.tsx`** — Marca los nombres propios del sitio como no traducibles. *(sin publicar)*
- **`page-closer.tsx`** — El cierre común de las trece páginas: a dónde se va desde aquí. *(sin publicar)*
- **`rich.tsx`** — El render de markup inline del copy del diccionario: negrita, cursiva y enlace. *(sin publicar)*
- **`video-embed.tsx`** — La facade de vídeo de terceros: póster propio y el clic como gate (D55). *(sin publicar)*
<!-- FIN ÍNDICE -->
