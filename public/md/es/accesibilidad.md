---
canonical: https://franciscolopez.es/accesibilidad
lang: es
title: Accesibilidad
description: "Cómo está construida esta web para ser usable por todas las personas: WCAG 2.2 AA cumplido, sistema de color en AAA, qué se hereda de la capa de componentes y qué encontró la pasada a mano con lector de pantalla."
last-updated: 2026-08-10
---

1. [Inicio](https://franciscolopez.es/)
2. Accesibilidad

Compromiso

# Accesibilidad

Aquí la accesibilidad es un criterio de cierre, no un extra: cualquier persona (con ratón, teclado o lector de pantalla, con o sin visión del color) puede leer y navegar esta web sin barreras. Y no es una promesa: está medido.

AA

Conformidad WCAG 2.2

AAA

Sistema de color

0

Violaciones axe

100

Lighthouse accesibilidad

Índice

Cada sección cierra sola: se puede leer por trozos, en el orden que quieras. **8** secciones

1. [01 · Conformidad](#s01)
2. [02 · Qué se ha hecho](#s02)
3. [03 · Accesibilidad heredada](#s03)
4. [04 · Verificación](#s04)
5. [05 · El punto ciego](#s05)
6. [06 · Límites](#s06)
7. [07 · El término](#s07)
8. [08 · Contacto](#s08)

## Qué cumple, y cómo se prueba

El nivel declarado, las comprobaciones que cierran cada página, lo que se hereda de la capa de componentes y quién lo verifica.

- 01 · Conformidad
- 02 · Qué se ha hecho
- 03 · Accesibilidad heredada
- 04 · Verificación

01 — Conformidad

## 01. WCAG 2.2 AA cumplido, con el contraste medido

El contraste está medido, no estimado. El texto principal alcanza 13,79:1 en claro y 15,32:1 en oscuro; los enlaces y botones de acción superan 7:1 en ambos temas. AA exige 4,5:1: se supera con margen.

Última revisión de accesibilidad: 27 de agosto de 2026 (2026-08-27).

### Estándar

WCAG 2.2, niveles A y AA.

### Estado

AA cumplido en todo el sitio.

### Sistema de color

AAA en claro y oscuro, con el contraste medido.

### Norma europea

Alineada con los criterios de EN 301 549, que remite a WCAG.

La [Ley Europea de Accesibilidad](https://eur-lex.europa.eu/eli/dir/2019/882/oj) obliga a productos y servicios comerciales (comercio electrónico, banca, transporte), no a una web personal: decir que este sitio «cumple la EAA» sería inexacto. Lo que sí aplica es su norma técnica de referencia, [EN 301 549 (PDF)](https://www.etsi.org/deliver/etsi_en/301500_301599/301549/03.02.01_60/en_301549v030201p.pdf), que remite a [WCAG](https://www.w3.org/TR/WCAG22/). Es el criterio que se ha seguido.

1 de 8

[Índice](#indice) · [Siguiente: 02 · Qué se ha hecho](#s02)

02 — Qué se ha hecho

## 02. Las mismas comprobaciones que cierran cada página

En lenguaje llano y con el criterio WCAG que cubre cada una.

1. Contraste medido en ambos temas
  
  WCAG 1.4.3 · 1.4.11
  
  Todo texto y todo control se comprueba con cifra en claro y oscuro, incluidos los estados de hover y foco. Quedan aparte los pocos casos en los que el fondo es una foto o una barra translúcida: ahí no hay un color que medir, y se miran a ojo.
2. Foco siempre visible
  
  WCAG 2.4.7
  
  Cada elemento interactivo muestra un anillo de foco de 2 px con separación; nunca se elimina el indicador sin sustituto.
3. Áreas de pulsación amplias
  
  WCAG 2.5.8 (superado)
  
  Los objetivos táctiles miden al menos 44×44 px, también en controles pequeños como la miga de pan o el cambio de tema.
4. Estructura y orden lógicos
  
  WCAG 1.3.1 · 2.4.6
  
  Un solo título principal por página y una jerarquía sin saltos; el orden de lectura coincide con el del código, para lectores de pantalla y navegación por teclado.
5. Ubicación clara
  
  WCAG 2.4.8
  
  Las páginas internas llevan una miga de pan (breadcrumb) que indica dónde estás dentro del sitio.
6. Nunca solo el color
  
  WCAG 1.4.1
  
  Ningún estado o categoría se distingue únicamente por color: siempre hay además texto o forma.
7. Respeto al movimiento reducido
  
  WCAG 2.3.3
  
  Si tu sistema pide menos animación, las transiciones y los reveals se desactivan.
8. Alternativas textuales
  
  WCAG 1.1.1
  
  Las imágenes que informan llevan texto alternativo; lo decorativo se oculta a la tecnología de asistencia.
9. Vía de escape del teclado
  
  WCAG 2.4.1
  
  El primer elemento al que llega el tabulador es un enlace que salta directamente al contenido, para no recorrer el menú entero en cada página.

De estos nueve puntos, cuatro no se comprueban página a página, y ese es justo el punto: el contraste, el anillo de foco, el área de pulsación y el respeto al movimiento reducido vienen ya dentro del botón, del enlace y del campo de formulario. Una sección nueva nace con ellos puestos y no puede negociarlos. La sección siguiente cuenta cómo.

2 de 8

[Índice](#indice) · [Siguiente: 03 · Accesibilidad heredada](#s03)

03 — Accesibilidad heredada

## 03. La accesibilidad se hereda, no se vuelve a escribir

Cumplir en una página es fácil. Lo difícil es que la página número quince nazca cumpliendo sin que nadie tenga que acordarse. Esto es lo que hace que ocurra, y es la parte que no se ve mirando el sitio.

Los nueve puntos del checklist, cada uno asignado a la capa que lo pone y a quién lo verifica. Ocho los comprueba una máquina; uno, una persona.

### Ningún control se escribe a mano

Todo lo que se pulsa (botones, enlaces, chips, pestañas, el cambio de tema) sale de una capa de componentes común. El anillo de foco, los 44 píxeles de área de pulsación y el contraste de cada estado viven ahí dentro: cambiarlos es cambiarlos en todo el sitio a la vez.

### El gris lo decide el fondo, no quien escribe

Un texto atenuado sobre el fondo de la página y ese mismo texto dentro de una tarjeta no pueden ser del mismo gris: el segundo se leería peor. Aquí no se elige. Cada superficie recalcula su atenuado desde el fondo que tiene debajo, también al pasar el ratón por encima.

### El marco lo pone la página, no quien la escribe

El enlace de salto al contenido, el idioma del documento y los dos landmarks los pone el armazón que comparten las catorce páginas: una página nueva nace con ellos. La miga de pan y la jerarquía de títulos dependen de lo que cuente cada una, y se verifican sobre el HTML generado.

### Cuándo hay que volver a medir lo dice una máquina

Medir el color entero es caro: hay que servir el sitio y recorrerlo con un navegador de verdad, así que no se repite en cada cambio, sino cuando aparece algo nuevo que medir. Una comprobación guarda la huella de lo ya medido y se pone en rojo nombrando lo que no estaba.

Esto es lo que sostiene la cifra de arriba. El sistema de color está en AAA, el nivel más exigente que define WCAG, en las catorce páginas y en los dos temas, en reposo y con el ratón encima. No se mantiene a base de revisiones: se mantiene porque los colores los eligen los componentes, y porque volver a medir es obligatorio en cuanto aparece uno que nadie ha medido.

Piezas del sistema · dato en vivo · `components/ui/`

Ocho piezas en el núcleo, y ninguna se escribe a mano

[Ver el catálogo](https://franciscolopez.es/design-system)

13,79:1 · AAA

3 de 8

[Índice](#indice) · [Siguiente: 04 · Verificación](#s04)

04 — Verificación

## 04. No es una autoevaluación de palabra

Cada página se comprueba en modo claro y en modo oscuro, con herramientas reales ([axe-core](https://github.com/dequelabs/axe-core), [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview)) y también a mano. Las automáticas hacen bien su trabajo, pero solo saben mirar lo que alguien ha convertido en regla.

### axe-core

El motor de reglas WCAG más extendido, pasado sobre el HTML ya generado de las catorce páginas en los dos idiomas. Cero violaciones.

### Lighthouse

La auditoría de accesibilidad de Chrome. Puntuación 100 en producción.

### getWCAG

Un escáner comercial de terceros que no sabe nada de este repositorio: reglas suyas, configuración suya. Cero violaciones, el mismo cero que da el nuestro. Mira una sola página y se lanza aparte, no en cada cambio, así que no sustituye a ninguna de las demás: lo que aporta es que el cero no dependa de nuestro arnés.

### Censo de contraste

Color a color y con cifra, recorriendo el sitio servido y leyendo el color que el navegador pinta de verdad. Incluye los estados: el gris de una tarjeta al pasar el ratón es otro par que medir.

### Censo de contornos

Un segundo recorrido que mide el borde de cada control en vez de su texto. Es el criterio 1.4.11 de WCAG, y ninguna herramienta automática del mercado lo implementa: si un campo de formulario no se distingue del fondo, nada te dice que ahí se escribe.

### Marco de página

Comprueba lo que axe da por bueno: que el enlace de salto exista, que haya un solo título principal, que la jerarquía no salte niveles, que la miga de pan esté puesta y que los datos estructurados apunten a algo que existe.

### Rótulos de figuras

Los diagramas se dibujan sobre un lienzo que se escala, así que un rótulo declarado a 11 píxeles puede acabar pintado a 5. Se mide el tamaño real de cada rótulo a 360 píxeles de ancho, que es un teléfono normal.

### Teclado y foco

Revisión manual de la navegación por teclado y del orden en que el foco recorre la página.

### Lector de pantalla

NVDA sobre Chrome, recorriendo el sitio entero en vez de página a página, que es como se usa de verdad.

No todas caben en el mismo sitio, y decirlo importa. Las que solo necesitan leer el código se ejecutan solas en cada cambio, antes de que nada se publique. Las dos mediciones de color necesitan un navegador pintando la página de verdad, así que se lanzan a mano. Y las dos últimas necesitan a alguien delante. Hay además una comprobación que vigila a las demás: coge cada una, le mete a propósito el error que debería cazar y confirma que salta. Son 22 comprobaciones y 52 errores fingidos, porque una revisión que devuelve una lista vacía se parece demasiado a un aprobado.

4 de 8

[Índice](#indice) · [Siguiente: 05 · El punto ciego](#s05)

## Dónde no llega, y cómo decirlo

Lo que ninguna herramienta automática encuentra, los límites que quedan, el término que se usa y la vía para avisar de una barrera.

- 05 · El punto ciego
- 06 · Límites
- 07 · El término
- 08 · Contacto

05 — El punto ciego

## 05. Lo que ninguna herramienta automática encuentra

Una web puede cumplir todas las reglas y seguir siendo incómoda de usar. Las herramientas comprueban reglas; lo demás solo aparece usándola.

Las cinco capas con las que se comprueba esta web, cada una cubriendo lo que la anterior no ve. La zona de la derecha, lo que no incumple ninguna regla, solo la alcanza la última: una persona.

### El caso que lo demuestra

Ninguna de las herramientas detectó que faltaba el enlace que salta al contenido, y eso era un incumplimiento de nivel A, el más básico que define WCAG. Tampoco es culpa suya: su regla se da por satisfecha si la página tiene bien puestas sus regiones y sus títulos, y los tenía. Lo que faltaba era el enlace.

### Una pasada entera con lector de pantalla

NVDA sobre Chrome, recorriendo seis caminos completos: el enlace de salto, la navegación, el diálogo de cookies, las tablas de datos, el cambio de tema y el orden de lectura. El sitio entero de una vez, no página a página.

### Cinco cosas que no incumplían ninguna regla

Y por eso ninguna herramienta tenía nada que decir. El menú del móvil no se cerraba con la tecla Escape. El botón de tema no decía en qué tema estabas ni avisaba de que había cambiado. El aviso de cookies se leía el último, aunque en pantalla sea lo primero que ves. La barra de navegación no se anunciaba como navegación. Y el número de cada sección no sonaba al saltar de título en título.

### Las cinco están corregidas

Y tres de ellas no eran el arreglo de una página: cambiaron el armazón que comparten las catorce. Ahora el aviso de cookies se anuncia en cuanto aparece y va al principio del documento, la barra de navegación es una región con nombre propio, y el número de sección se oye al recorrer los títulos. Esa es la diferencia entre una prueba a mano y un informe: el informe habría salido en verde las dos veces.

Lo que esta prueba no cubre está justo debajo, en los límites: un solo lector de pantalla ([NVDA](https://www.nvaccess.org/)), un solo navegador, y ninguna persona que use tecnología de asistencia a diario.

5 de 8

[Índice](#indice) · [Siguiente: 06 · Límites](#s06)

06 — Límites

## 06. Ser honesto también es accesibilidad

Lo que todavía no cumple, y qué falta para que cumpla.

### Testing de usuarios

Todo lo que hay en esta página lo he medido yo. Nadie (que yo sepa) que use tecnología de asistencia a diario ha probado esta web hasta ahora, y esa es la comprobación que ninguna cifra sustituye. Si quieres ser tú la primera persona, la sección de abajo es exactamente para eso.

### Un lector y un navegador

La prueba a mano se ha hecho con NVDA sobre Chrome. Ni VoiceOver, ni JAWS, ni TalkBack en el móvil. Cada combinación se comporta distinto, así que lo que funciona aquí no está probado en las demás. Ampliarlo está en el plan.

### Texto sobre foto

El censo de contraste se abstiene a propósito en dieciséis pares: los ocho textos que caen sobre una fotografía, medidos en los dos temas. Ahí el fondo lo decide la imagen y no el sistema de color, así que medirlos exige leer el píxel pintado uno a uno. Están identificados y pendientes.

### Pantallas muy estrechas

Por debajo de 320 píxeles de ancho, tres páginas se desbordan en horizontal. No es la carpintería: son palabras largas que no caben en una columna de 240. Medido a 280 y pendiente.

### Dos diagramas que se miden y no se juzgan

La comprobación que mide los rótulos de las figuras se abstiene en dos: son diagramas anchos que se desplazan en horizontal en vez de encogerse, así que su tamaño no lo decide el ancho de la pantalla. Sus rótulos acaban pintados a 5 píxeles, y eso es demasiado pequeño. La solución no es estrecharlos sino volver a dibujarlos, y está pendiente.

### CV en PDF

Es texto seleccionable y etiquetado, pero un PDF nunca iguala a una página web en accesibilidad. Si lo necesitas en otro formato, escríbeme.

Nada de esto está aquí por completismo. Un apartado de límites que solo dice «mejora continua» no informa de nada. Si algo de esta lista te afecta, escríbeme: sube de prioridad.

6 de 8

[Índice](#indice) · [Siguiente: 07 · El término](#s07)

07 — El término

## 07. Qué es A11y y por qué lo usamos

Es la palabra que el oficio usa a diario y casi nunca explica. Esta página la estaba usando igual: una vez, en la primera pantalla, sin decir qué era.

A11y es la abreviatura que el desarrollo web usa para la palabra inglesa accessibility, accesibilidad. Se forma con su primera letra, su última letra y el número de letras que hay entre las dos: once. Y lo que nombra es diseñar sitios y aplicaciones para que cualquier persona pueda usarlos, tenga o no limitaciones físicas, visuales, auditivas o cognitivas.

[The A11Y Project](https://www.a11yproject.com/) es el espacio abierto donde el oficio reúne los principios y los patrones de accesibilidad que funcionan, del diseño al despliegue. Su idea de fondo es la que sigue esta web: la accesibilidad no es una capa que se añade al final, es un criterio de cierre. Aquí eso se traduce en tres cosas concretas. La lista de comprobación se pega en la tarea antes de empezarla, no al revisarla. Cuatro de sus nueve puntos ya no se miran página a página, porque los pone la capa de componentes. Y todo lo que se pudo convertir en comprobación automática se convirtió.

7 de 8

[Índice](#indice) · [Siguiente: 08 · Contacto](#s08)

08 — Contacto

## 08. Si algo te bloquea, quiero saberlo

Si algo de esta web te resulta difícil de usar con tu tecnología de asistencia, es la mejor forma de arreglarlo. Cuéntame en qué página estabas, qué pasó y qué ayuda técnica usas, y te respondo.

[franciscojavier.lopezmartinez@gmail.com](mailto:franciscojavier.lopezmartinez@gmail.com?subject=Barrera%20de%20accesibilidad%20en%20franciscolopez.es)

8 de 8

[Índice](#indice)

Del mismo sistema

[Brand Kit · La identidad: el logo y su geometría, la paleta de dos capas, la tipografía y las reglas que gobiernan su uso.](https://franciscolopez.es/brand-kit) · [Design System · El esqueleto: rejilla, tokens de layout, ritmo vertical, tipografía, motion y la accesibilidad medida.](https://franciscolopez.es/design-system)
