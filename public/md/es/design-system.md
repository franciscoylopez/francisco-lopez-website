---
canonical: https://franciscolopez.es/design-system
lang: es
title: Design System
description: "El esqueleto compartido por todas las páginas del sitio: rejilla, tokens de layout, ritmo vertical, jerarquía tipográfica, claro/oscuro, movimiento y la medición completa de accesibilidad."
last-updated: 2026-08-10
---

1. [Inicio](https://franciscolopez.es/)
2. Design System

Fundamentos de diseño

# Design System

Un sistema de diseño no está para que todo se parezca: está para que una decisión se tome una sola vez. Cambiar aquí el hover de un botón o su objetivo táctil llega a todas las páginas a la vez.

1360px

Ancho máximo del contenedor

4 Breakpoints

640 · 768 · 1024 · 1280

42rem

Medida de lectura (~91 car.)

AA→AAA

Objetivo de accesibilidad

Índice

Cada sección cierra sola: se puede leer por trozos, en el orden que quieras. **12** secciones

1. [01 · Rejilla y medidas](#s01)
2. [02 · Ritmo y espaciado](#s02)
3. [03 · Tipografía y cabeceras](#s03)
4. [04 · Claro y oscuro](#s04)
5. [05 · Movimiento](#s05)
6. [06 · Enlaces](#s06)
7. [07 · Botones y acciones](#s07)
8. [08 · Etiquetas](#s08)
9. [09 · Formulario](#s09)
10. [10 · Composición de página](#s10)
11. [11 · Checklist de cierre](#s11)
12. [12 · Artículo largo](#s12)

## Fundamentos

Las cinco decisiones de las que cuelga cada pieza del sistema. Se toman una vez y llegan a todas las páginas a la vez.

- 01 · Rejilla y medidas
- 02 · Ritmo y espaciado
- 03 · Tipografía y cabeceras
- 04 · Claro y oscuro
- 05 · Movimiento

01 — Rejilla y medidas

## 01. Ancha para maquetar, estrecha para leer

Ocultar rejilla

Doce columnas, un contenedor que tope en 1360 y una medida de lectura que nunca lo usa entero. Lo que se maqueta en el sitio se apoya en estos tres números.

Rejilla base: **12 columnas** · Medianil: **var(--gutter) · 16–24px** · La franja marca las 12 columnas; el botón de arriba la alterna.

### Medida de lectura

El texto corrido no pasa de 42rem (~91 caracteres) aunque el contenedor sea ancho. Queda por encima de la medida clásica a propósito.

### Márgenes

clamp(1.25rem, 5vw, 2.5rem): 20px en móvil, 40px en escritorio. Por encima de xl crecen ellos, nunca el contenido.

### Lo que este sistema le añade a Tailwind

Los tokens que la escala de Tailwind no trae. Viven en el :root del sitio, así que cambiar uno lo cambia en todas las páginas a la vez.

:root { } · Copia de un vistazo

--container: · 1360px;

--page-x: · clamp(1.25rem, 5vw, 2.5rem);

--gutter: · clamp(1rem, 2.2vw, 1.5rem);

--measure: · 42rem;

--section-y: · clamp(4.5rem, 9vw, 9rem);

### Los cortes

Coinciden con la escala de Tailwind. Entre uno y el siguiente no salta nada: la tipografía y el espaciado interpolan con clamp().

**Los cortes**

| Token / min-width | Contexto | Qué cambia |
| --- | --- | --- |
| `base` · 0 – 639px | Móvil | Una columna, todo apilado. Tipografía en el mínimo del clamp. |
| `sm` · ≥ 640px | Móvil grande | Botones y metadatos en fila; sigue una columna. |
| `md` · ≥ 768px | Tablet | Aparece la retícula a dos columnas y los márgenes crecen. |
| `lg` · ≥ 1024px | Escritorio | Rejilla de 12 completa y grupos de tres tarjetas. |
| `xl` · ≥ 1280px | Escritorio amplio | Contenedor al tope; los márgenes absorben el ancho extra. |

`base` · 0 – 639px

Móvil

Una columna, todo apilado. Tipografía en el mínimo del clamp.

`sm` · ≥ 640px

Móvil grande

Botones y metadatos en fila; sigue una columna.

`md` · ≥ 768px

Tablet

Aparece la retícula a dos columnas y los márgenes crecen.

`lg` · ≥ 1024px

Escritorio

Rejilla de 12 completa y grupos de tres tarjetas.

`xl` · ≥ 1280px

Escritorio amplio

Contenedor al tope; los márgenes absorben el ancho extra.

### El esqueleto de la home

La misma página sin contenido: solo el ritmo vertical y la retícula que comparten sus secciones.

Se muestra la versión móvil; la comparativa entre dispositivos necesita una pantalla ancha.

Escritorio

Tablet

Móvil

(01) · Hero

(02) · Hitos

(03) · Cómo trabajo

(04) · Más allá del PM

(05) · Trayectoria

(06) · Formación

(07) · Toolkit

(08) · Contacto

1 de 12

[Índice](#indice) · [Siguiente: 02 · Ritmo y espaciado](#s02)

02 — Ritmo y espaciado

## 02. El aire es la herramienta de jerarquía

Escala de base 4px (Tailwind).

### Escala de espaciado

2xs · 8px

xs · 12px

sm · 16px

md · 24px

lg · 32px

xl · 48px

2xl · 64px

3xl · 96px

4xl · 128px

### Ritmo entre secciones

--section-y · clamp(72 → 144px)

- Entre secciones mayores: --section-y, de 72px en móvil a 144px en escritorio.
- Título de sección → contenido: 40px (2.5rem).
- Entre bloques dentro de sección: 24–32px. Divisor hairline opcional.
- Cada sección abre con un divisor de 1px var(--border) a todo el ancho.

2 de 12

[Índice](#indice) · [Siguiente: 03 · Tipografía y cabeceras](#s03)

03 — Tipografía y cabeceras

## 03. El tamaño lo decide el ancho, no el dispositivo

Bricolage Grotesque para titulares, Inter para texto y UI. Móvil es el mínimo del clamp; escritorio, el máximo.

Discovery

Nivel · Display

Fuente · Bricolage 600

Escritorio · 80px / 5rem

Móvil · 44px

Interlineado · 1.0

Uso · Solo Hero

Hitos

Nivel · H1

Fuente · Bricolage 600

Escritorio · 52px / 3.25rem

Móvil · 32px

Interlineado · 1.05

Uso · Título de sección

Cómo trabajo

Nivel · H2

Fuente · Bricolage 600

Escritorio · 32px / 2rem

Móvil · 24px

Interlineado · 1.15

Uso · Subsección

TheTool · SaaS B2B

Nivel · H3

Fuente · Bricolage 600

Escritorio · 20px / 1.25rem

Móvil · 18px

Interlineado · 1.3

Uso · Título de tarjeta / caso

Resultados

Nivel · H4

Fuente · Bricolage 600

Escritorio · 16px / 1rem

Móvil · 16px

Interlineado · 1.4

Uso · Encabezado menor

Investigo, prototipo, construyo y mido.

Nivel · Body L

Fuente · Inter 400

Escritorio · 19,2px / 1.2rem

Móvil · 17px

Interlineado · 1.6

Uso · Subheadline, intro

Senior Product Manager con más de 10 años en SaaS B2B y B2C.

Nivel · Body

Fuente · Inter 400

Escritorio · 16px / 1rem

Móvil · 16px

Interlineado · 1.65

Uso · Texto corrido (máx 42rem)

Cofundador & PM · May 2016 – Oct 2021

Nivel · Small / meta

Fuente · Inter 400–500

Escritorio · 14px

Móvil · 14px

Interlineado · 1.5

Uso · Fechas, pies, etiquetas

SENIOR PRODUCT MANAGER · UX · SAAS

Nivel · Eyebrow

Fuente · Inter 600 · UPPER

Escritorio · 13px

Móvil · 13px

Interlineado · 1.4

Uso · Kicker sobre título

### La cabecera que la aplica

Un rótulo corto encima y un titular debajo. Salen de una sola pieza, así que el tamaño del titular decide también el hueco que los separa.

Fundamentos de diseño

Design System

gap · mb-5

lead · mb-6

Dónde se usa · El h1 que abre una página.

Quién hay detrás

Sobre mí

gap · mb-5

lead · mb-4

Dónde se usa · El h1 de las páginas de lectura larga.

Recorrido

Trayectoria

gap · mb-3

lead · mb-[1.4rem]

Dónde se usa · El h2 que abre una sección.

Capa de cabecera

Cabeceras

gap · mb-3

lead · mb-4

Dónde se usa · Sección de un índice largo, como las de esta página.

Discovery

gap · mb-2

lead · mb-3

Dónde se usa · El titular de una pieza dentro de una rejilla.

El producto que ya existía

gap · mb-2

lead · mb-3

Dónde se usa · El h3 de un subapartado, sin rótulo encima.

Antes y después

gap · mb-2

lead · mb-3

Dónde se usa · El escalón por debajo: un bloque de apoyo dentro de una sección.

### El otro rótulo en versalitas, que no es este

Se parecen y hacen cosas distintas, así que son dos piezas: una abre una sección emparejada con un titular, la otra rotula un dato dentro del contenido.

Trayectoria

Diez años de producto

Abre una sección · `eyebrowVariants`

Va siempre encima de un titular, y el hueco que los separa lo pone el tamaño del titular que tiene debajo.

Duración

5 años y 6 meses

Rotula un dato · `dataLabelVariants`

Sin titular al lado no hay hueco que derivar: el margen lo pone quien la usa. Va un punto más pequeña y menos abierta.

### Debajo del titular, la fila de cifras

Cuando una apertura resume algo en datos, la fila no la monta la página: la trae una pieza con su filete, su hueco y su rejilla.

1360px

Ancho máximo del contenedor

4 breakpoints

640 · 768 · 1024 · 1280

AA→AAA

Suelo y objetivo de contraste

Fila de cifras · `StatRow · Stat`

StatRow pone el filete, el hueco y la rejilla que reparte las columnas. Stat pone la cifra, su unidad y la etiqueta de debajo.

### Qué decide la variante y qué el punto de uso

- El tamaño elige el hueco entre rótulo y titular, y también el interlineado.
- El punto de uso solo pone lo que depende del contenido: el ancho máximo, o el equilibrio de un titular que parte mal.
- Los siete tamaños no son deriva sino jerarquía: el h1 que abre una página no es el h2 que abre una sección.

3 de 12

[Índice](#indice) · [Siguiente: 04 · Claro y oscuro](#s04)

04 — Claro y oscuro

## 04. La profundidad la dan los filetes, no las sombras

Mismo esqueleto y misma jerarquía de superficies: fondo → tarjeta → borde. El claro es papel cálido; el oscuro, azul profundo.

Modo claro · Del discovery al dato.

Descargar CV

bg #F7F3EC · card #FCFAF6 · border #E2DED4

Modo oscuro · Del discovery al dato.

Descargar CV

bg #191D21 · card #21262B · border #2E353C

### Regla de color

- primary es el único color de acción. secondary, muted y accent se quedan neutros.
- Los enlaces van en dos reglas: primary en el contenido; foreground o muted-foreground en la navegación de chrome.
- Los tonos de marca decoran o firman el logo. Splits y pasteles, nunca como texto.

Usa el conmutador de la cabecera para ver esta misma página en ambos modos.

### El gris atenuado lo pone la superficie

Los dos rótulos de abajo salen de la misma clase, sin nada que los distinga donde se usan. Se pintan distinto porque el fondo que tienen debajo es otro.

Fundamentos de diseño

Sobre el fondo de la página

`--background`

El gris del sistema, calibrado contra este fondo y solo contra él.

El siguiente paso

Sobre la franja de contacto

`--muted`

Encima de cualquier otra superficie se recalcula: se mezcla un 85% hacia el fondo de debajo. No hay que pedirlo.

4 de 12

[Índice](#indice) · [Siguiente: 05 · Movimiento](#s05)

05 — Movimiento

## 05. Sobrio: nunca compite con el contenido

Las duraciones no se eligen por gusto: cada una corresponde a un tipo de cambio en pantalla.

150ms · Microinteracciones: hover, foco, botones.

250ms · Cambios de estado: acordeones, tabs.

280ms · Entradas: el reveal al hacer scroll y la apertura al cargar.

scroll · El filete que crece no tiene duración: lo lleva la rueda.

easing · cubic-bezier(0, 0, .2, 1): ease-out al entrar.

- Reveal = fundido + subida de 14px, una vez al entrar en viewport y nunca en bucle. Un grupo que entra junto escalona sus piezas (80ms en esta demo).
- Con movimiento reducido se retira lo que desplaza o escala, y el fundido se queda, más corto. Solo se apaga entera la que va acoplada al scroll. El contenido aparece siempre, aunque falle el JS.

Demo de scroll-reveal

Repetir ▸

### Dos puertas de entrada, y no dicen lo mismo

- Al hacer scroll, para lo que todavía no está en pantalla. Lo que ya se ve al cargar no entra por aquí, porque no ha entrado: arrancarlo oculto retrasaría la métrica de carga.
- Al cargar, para lo decorativo del primer pliegue, que sí aparece de golpe. Son las composiciones de estas cuatro portadas y el punto final del titular de la portada.
- Y una tercera que no es una entrada: va acoplada al scroll y no tiene duración propia, porque la posición manda. Es el filete que crece bajo los años de los hitos.

La tercera se ve sin pulsar nada: el filete morado que abre cada bloque de esta página crece al llegar a él.

Demo de entrada al cargar

Repetir la entrada ▸

### Transición del nav · compartida por todo el sitio

- Símbolo 48 → 28px, de forma continua con el scroll. La barra mantiene su alto: animarlo repintaba una franja opaca de ancho completo en cada paso.
- Las capas de color del split se extinguen antes de que el símbolo baje de 48px: nunca pasa por un estado de mala registración.
- El wordmark se desvanece en opacidad sin recortar glifos: el hueco solo se colapsa cuando ya es invisible.
- Con movimiento reducido, salto entre estados, sin interpolar.

Francisco López · al cargar · símbolo 48px · split

con scroll · símbolo 28px · flat

Es la transición que ves ahora mismo en la cabecera de esta página.

5 de 12

[Índice](#indice) · [Siguiente: 06 · Enlaces](#s06)

## Piezas

El catálogo de lo que se pulsa y lo que rotula. Ninguna se escribe con clases sueltas: si un caso no encaja en una variante, se crea la variante.

- 06 · Enlaces
- 07 · Botones y acciones
- 08 · Etiquetas
- 09 · Formulario

06 — Enlaces

## 06. Lo decide su función, no dónde cae

Si es contenido, el cian aparece como recompensa de la interacción. Si su bloque entero ya es navegación, el cian no distingue nada y sobra.

Cada decisión de esta página está [documentada y medida](#top) antes de llegar al código.

Contenido · `.link-content`

En reposo, texto en foreground con un subrayado fino en primary. Con cursor o foco, un relleno sólido crece de abajo arriba y el texto se invierte.

Reutiliza el par de contraste ya verificado de «texto sobre botón» en vez de inventar uno nuevo.

[Inicio](#top) · [Sobre mí](#top) · [Brand Kit](#top)

Chrome de navegación · `.link-chrome`

Nav, breadcrumb, footer y menús: foreground o muted-foreground, nunca primary. En hover y foco, una pastilla de fondo muted.

Se leen como enlace por su posición, y la pastilla funciona igual sin distinguir tonos.

Chrome solo icono · `.icon-chrome`

Toggle de tema, menú y redes: la misma pastilla que el resto del chrome, ocupando los 44px completos del objetivo táctil.

Un control sin etiqueta necesita la misma afordancia que uno con texto.

Pasa el cursor por encima ▸

Una banda invertida es la que se pinta con el color del texto y escribe encima con el del fondo. Dentro, [un enlace de contenido](#top) sigue comportándose igual: subrayado fino en reposo y relleno sólido al pasar por encima.

Contenido, sobre banda invertida · `.link-content · data-surface`

Ahí el color de texto de la página ES el fondo, así que el enlace no elige su color: lo resuelve la banda, que declara qué superficie es.

Los tres colores son los del otro tema, no valores nuevos. La superficie manda sobre la variante.

### Por qué el cian no vive en el texto

- El cian es el único color de acción del sistema: si además tiñe todo enlace en reposo, deja de señalar nada.
- Reservarlo al momento de la interacción lo devuelve a ser una señal, no un color de párrafo.
- Ningún estado se codifica solo por color: subrayado, relleno y pastilla son cambios de forma.

El tono del chrome tampoco es decoración: el secundario sube a foreground en el mismo gesto en que aparece la pastilla, porque sin ese salto el par cae a AA justo en hover.

6 de 12

[Índice](#indice) · [Siguiente: 07 · Botones y acciones](#s07)

07 — Botones y acciones

## 07. Un botón no elige su aspecto: lo elige su papel

Cuántas acciones compiten a su lado, y si lleva estado, deciden la variante. La variante ya trae resueltos el hover, el foco y el objetivo táctil.

Pasa el cursor por encima ▸

Ver el anillo de foco

[Contacta conmigo](#top)

Acción destacada · `solid`

El único relleno cian de la pantalla. En hover el relleno se mezcla hacia el color de texto en vez de aclararse, que es lo que sube el contraste en lugar de bajarlo.

[Descargar CV](#top)

Acción de contenido · `outline-primary`

Cian en el borde y el texto, que en hover pasa a relleno pleno. Para acciones que viven solas, sin otro botón al lado con el que competir.

[Cancelar](#top) · [Preferencias](#top)

Utilidad · `outline-neutral · ghost`

Sin cian: borde neutro o sin caja, y pastilla gris en hover. Es lo que lleva un botón que convive con un sólido en el mismo grupo.

Con cian, dos botones del mismo grupo reclamarían ser la acción principal.

Activo · Inactivo

Interruptor · `toggle-primary`

Un control suelto que enciende algo que no estaba. Encendido, relleno pleno; apagado, borde cian con un tinte en hover, nunca el relleno.

Con relleno, el apagado en hover se vería igual que el encendido y el control dejaría de decir en qué estado está.

Escritorio · Tablet · Móvil

Grupo de alternativas · `toggle-neutral`

Varios segmentos de los que exactamente uno está activo. El activo va en cian sólido; el resto, en neutro.

Pintarlos todos de cian no distingue nada y se come la sección.

Solo icono · `icon`

Controles sin etiqueta: la misma pastilla que el resto del chrome, ocupando los 44px completos del objetivo táctil.

[Correo · hola@ejemplo.com](#top)

Tarjeta pulsable · `card`

Cuando lo que se pulsa es la caja entera y no un renglón: fondo de tarjeta, pastilla gris en hover y padding de caja en vez de padding de botón.

Sobre una imagen · `.video-facade`

El fondo lo decide la foto, así que el control no puede fijar su color. Un velo lo separa de la imagen y el disco va en dos tonos, para que su borde interior no dependa de lo que haya debajo.

El velo es del color del fondo, nunca negro: el negro arregla un tema y empeora el otro.

### Cuándo una acción lleva icono

- Una sola pregunta: ¿esta acción saca de la página? Descargar un archivo, abrir el correo o el teléfono, o irse a otro sitio web llevan icono.
- Lo que ocurre dentro de la página va sin él: aceptar, guardar, cerrar, elegir una pestaña o navegar por el sitio.
- Va delante de la etiqueta, porque clasifica la acción. Solo en el sólido va detrás y avanza dos píxeles en hover: ahí marca la dirección del viaje.

El tamaño, el hueco y el lado los pone la variante, no cada uso. En el punto de uso se escribe el icono y nada más.

### Por qué esto es un componente y no una convención

- Ningún control se escribe con clases sueltas. Si un caso no encaja en ninguna variante, se crea la variante; si es una excepción, se documenta con fecha.
- Cambiar un hover es cambiar una línea, y llega a todos los botones del sitio a la vez.
- El foco no lo declara ninguna variante: lo pone una sola regla global, la misma para todo el sitio.

7 de 12

[Índice](#indice) · [Siguiente: 08 · Etiquetas](#s08)

08 — Etiquetas

## 08. Rotula, no se pulsa

No sale de la capa de acción: no tiene estado, ni hover, ni objetivo táctil. Solo tiene que leerse.

Fijo · Próximamente

Sin carga · `neutral`

Lo que acompaña sin destacar: un estado, una nota al margen, la mitad apagada de un par.

Su texto no puede ser el gris del sistema, calibrado contra el fondo de la página: encima de la pastilla se queda en 6,44:1.

AAA · Conmuta

Dato verificado · `cyan`

Velo de cian para lo que se ha medido o lo que se cumple. El cian está en el fondo; en el texto, nunca.

Exit · Split

Distintivo de marca · `purple`

Velo de morado para lo que señala una singularidad: un hito de la trayectoria, una variante del logo.

El morado es decorativo y nunca color de acción, así que aquí solo puede aparecer como relleno.

Exit · Split · 13,79:1

Tres registros · `label · value · code`

Versalitas para un rótulo de estado, caja normal para un dato en prosa, monoespaciada para un valor técnico.

Es lo único que cambia de una etiqueta a otra: alto, cuerpo, radio y padding son los mismos para todas.

Son las mismas etiquetas que usa el sitio: si una cambia, esta sección cambia con ella.

### Por qué es una capa aparte

- Una etiqueta no es una acción: no se pulsa. Media base de un botón (suelo táctil, anillo de foco, estados) no significaría nada aquí.
- Una diferencia que significa algo es una variante; una que no significa nada es un valor a unificar.

El texto de las dos teñidas es el color de texto normal, no el del velo. Es lo que las lleva a 10,63:1 en claro y 10,02:1 en oscuro; teñido se quedaban en 6,07 y 5,46.

8 de 12

[Índice](#indice) · [Siguiente: 09 · Formulario](#s09)

09 — Formulario

## 09. La primera superficie que recibe, no la que enseña

Un campo no es un botón pequeño: tiene etiqueta, tiene estado de error, y tiene que decirlo en voz alta.

### El campo

Etiqueta y control son una sola pieza, y el suelo táctil vive en el control, que es donde se pulsa.

Correo

En reposo · `Field`

La etiqueta va siempre visible y unida al campo, nunca dentro como texto de ayuda: un marcador de posición desaparece al escribir y deja el campo sin nombre.

Alto mínimo de 44px, el mismo suelo táctil que los botones. El anillo de foco lo pone la regla global.

Correo

Ese correo no parece completo. Revisa la parte de después de la arroba.

Con error · `Field · error`

El mensaje se ata al campo, así que un lector de pantalla lo oye al llegar a él y no solo al intentar enviar.

El borde rojo y el icono marcan la forma; el texto va en el color normal.

### Cuando el envío falla

Un aviso que se anuncia solo, sin robar el foco, y que enumera qué campos hay que revisar.

Revisa estos campos antes de enviar:

- Nombre
- Correo

Resumen de errores · `FieldErrorSummary`

Aparece al intentar enviar y se anuncia como alerta. El foco lo mueve el formulario al primer campo que falla: dos saltos a la vez dejarían al lector sin saber dónde está.

### El rojo no es color de texto

- El rojo del sistema mide 4,31:1 sobre el fondo claro: no llega al mínimo que pide un texto.
- Así que el mensaje va en el color de texto normal, y el rojo se queda en el borde y el icono, donde el umbral es más bajo.
- De regalo, el error deja de estar codificado solo por color.

### Lo que valida de verdad es el servidor

- La validación del navegador existe para no gastar un viaje en un campo vacío, no para decidir.
- La misma regla corre en el servidor, porque quien envía a mano no ha ejecutado la del navegador.
- Y devuelve códigos, no frases: las palabras las pone el diccionario, en los dos idiomas.

9 de 12

[Índice](#indice) · [Siguiente: 10 · Composición de página](#s10)

## Composición

Cómo se monta una página con todo lo anterior, y el criterio de accesibilidad con el que se cierra cada una.

- 10 · Composición de página
- 11 · Checklist de cierre

10 — Composición de página

## 10. Ni controles ni texto: las cajas con las que se monta una página

Una tabla, una nota al margen y el remate del final. Las tres suben a la capa porque su formato es lo que no puede divergir de una página a otra.

### El índice de una página con paradas

La rejilla que abre el recorrido, justo debajo del hero, y esta misma la lleva. La familia tiene tres piezas: esta, el cierre de sección que va más abajo, y el riel fijo, que no vive aquí porque se publica en la sección del artículo largo, la única página que lo usa.

Índice

Cada sección cierra sola: se puede leer por trozos, en el orden que quieras. **3** secciones

1. [01 · Rejilla y medidas](#s01)
2. [02 · Ritmo y espaciado](#s02)
3. [03 · Tipografía y cabeceras](#s03)

El mapa · `SectionIndex`

Rejilla de paradas pintada en servidor: se navega sin JavaScript.

La tercera línea de cada celda es libre y opcional. El artículo pone ahí su tiempo por sección; en una página de especímenes no hay prosa que cronometrar, así que va vacía.

### La apertura de un bloque

Doce secciones seguidas no dicen dónde acaba una familia y empieza otra. La banda lo dice, y de paso enseña qué lleva dentro.

## Piezas

El catálogo de lo que se pulsa y lo que rotula. Ninguna se escribe con clases sueltas: si un caso no encaja en una variante, se crea la variante.

- 06 · Enlaces
- 07 · Botones y acciones
- 08 · Etiquetas
- 09 · Formulario

Apertura de bloque · `BlockOpener`

Fondo invertido y tipo sola. Nunca se tiñe una sección existente: las de aquí son galerías y dan por hecho el fondo de página.

La banda de abajo no es una recreación: es la que abre el bloque «Piezas» de esta misma página.

### La tabla

Marcado de tabla de verdad, y no es cosmética: sin celdas atadas a su columna, las trece filas de cifras del censo se leen como una ristra de números sin saber cuál es cada tema.

**La tabla**

| Pieza | Marcado | Qué resuelve |
| --- | --- | --- |
| Nombre de la tabla | `caption` | Dice qué es la tabla a quien no la ve. No se pinta: el titular de encima ya lo dice. |
| Cabecera de columna | `th scope=col` | Una sola definición para las cinco tablas del sistema. |
| Nombre de la fila | `th scope=row` | Ata cada cifra a su fila: «Atenuado sobre card, claro, 9,14:1» en vez de tres números sueltos. |
| Ancho de columna | `colgroup` | Se declara una vez, y no en dos sitios que hay que hacer coincidir. |

### La nota al margen

Una medida, el resultado de una herramienta, una regla que conviene decir aparte: lo que una página cuenta fuera del cuerpo del texto.

### Un valor no es copy

Si una sección publica una cifra del sistema, sale del archivo de valores y nunca del diccionario. La regla para distinguirlos es literal: si la entrada en español y la inglesa son idénticas carácter a carácter, es un valor con dos copias.

Con párrafo · `InfoCard`

Un título y su explicación sobre la superficie de tarjeta. El gris del cuerpo no lo elige esta pieza: lo resuelve el fondo donde cae.

Admite tres cuerpos y se combinan: párrafo, lista y un pie más pequeño.

### --measure

- El ancho de la columna de lectura, medido en caracteres y no en píxeles.
- Lo usan las entradillas de sección y el cuerpo de los artículos.
- Cambiarlo mueve el ritmo de todas las páginas a la vez, que es justo para lo que existe.

Se publica entero en la sección de tokens de layout, con su valor y su motivo.

Título en monoespaciada · `InfoCard · mono`

Cuando el título es el nombre de un token, de un archivo o de una herramienta, va en monoespaciada: así se lee como lo que es, un identificador y no una frase.

### La casilla: una sola caja para un logo o un ordinal

Es la pieza más pequeña de esta familia y la que peor se portaba: la misma caja se pintaba a dos tallas y con dos rellenos según quién la escribiera. Ahora el tamaño y el relleno viven en la pieza, así que no hay dónde discrepar.

Con un logo dentro · `BrandLogoBox`

Logos de empresa, herramienta o institución, en monocromo y con cambio claro/oscuro por CSS. Se anuncian como decorativos: el nombre ya está escrito al lado.

El envoltorio sabe dónde viven los assets del sitio; la caja no sabe nada y por eso es la que sube a la capa.

01 · 02 · 03

Con un ordinal dentro · `Tile`

El número de una etapa en «Cómo trabajo». Misma caja, mismo relleno y mismo tamaño que la del logo: la única diferencia es lo que lleva dentro.

Este sí se anuncia, a diferencia del logo: el orden de las etapas es información, no adorno.

### El cierre de una sección

El pie de cada parada, y por eso va aquí y no arriba: dice en cuál está el lector, cómo vuelve al índice y qué viene después. Es la hermana de peldaño del cierre de página, que se publica justo debajo.

2 de 3

[Índice](#indice) · [Siguiente parada](#s01)

El pie de cada parada · `SectionCloser`

Dónde estás, la vuelta al índice y la parada siguiente.

Los puntos son decorativos: la posición va además en texto, que es lo que cumple el punto 6 del checklist. La etiqueta lleva la posición dentro para que doce cierres no compartan nombre.

### El cierre de página

El remate del contenido antes del pie: a dónde se va desde aquí, con el mismo formato en todas las páginas.

Seguir leyendo

[Experiencia anterior · KUOTIP · Enlace real: la flecha va delante y apunta a la izquierda, que es lo que se lee como volver sin leer el rótulo.](https://franciscolopez.es/trayectoria/kuotip)

Experiencia siguiente

Un destino que aún no existePróximamente

Sin enlace, la tarjeta se dibuja punteada y apagada. Es lo que le pasa a la experiencia más reciente, que nunca tiene una siguiente.

Dos destinos · `PageCloser`

Sube entero a la capa, y no solo la tarjeta: el ritmo vertical, el filete de arriba y el hueco del rótulo son lo que tiene que no divergir.

La flecha empuja hacia donde apunta, y el empujón se apaga con movimiento reducido. Un destino que aún no existe se dibuja punteado y apagado.

### El formato sube entero, no solo la caja

- Lo que tiene que no divergir es el remate completo, no el aspecto de una tarjeta.
- El bloque no sabe nada de este sitio: recibe un rótulo y una lista de destinos.
- Quién es hermana de quién lo deciden sus llamadores, que sí lo saben.

Es la frontera que decide dónde vive una pieza: si sabe algo de este sitio, no es del sistema.

10 de 12

[Índice](#indice) · [Siguiente: 11 · Checklist de cierre](#s11)

11 — Checklist de cierre

## 11. AA es el suelo, no el objetivo

La lista con la que se cierra cada página. Es el criterio interno de construcción; la declaración pública de conformidad vive en la página de Accesibilidad.

### Contraste medido

**Contraste medido**

| Medición | Claro | Oscuro |
| --- | --- | --- |
| Texto principal · foreground sobre background | 13,79:1AAA | 15,32:1AAA |
| primary como texto · enlaces y acento | 7,47:1AAA | 8,36:1AAA |
| Texto sobre botón · primary-foreground sobre primary | 7,93:1AAA | 8,36:1AAA |
| Hover del botón sólido · el relleno se mezcla hacia foreground | 8,64:1AAA | 8,92:1AAA |
| Hover del toggle apagado · el estado con menos margen del sistema | 7,21:1AAA | 7,80:1AAA |
| Hover del chrome secundario · el texto sube a foreground con la pastilla | 12,47:1AAA | 12,04:1AAA |
| Atenuado sobre background · el token tal cual: está calibrado contra este fondo | 7,10:1AAA | 7,12:1AAA |
| Atenuado sobre card · tarjetas y paneles: se recalcula contra su propio fondo | 9,14:1AAA | 10,32:1AAA |
| Atenuado sobre muted · la franja de contacto y la etiqueta neutra | 8,17:1AAA | 9,17:1AAA |
| Atenuado sobre fondo invertido · se construye desde el otro extremo, como el cian invertido | 10,32:1AAA | 9,89:1AAA |
| Etiqueta teñida · la peor de las dos, cian y morado | 10,63:1AAA | 10,02:1AAA |
| Bolita del switch apagada · foreground sobre su propio carril; encendida reusa el par del botón | 12,47:1AAA | 12,04:1AAA |
| brand-purple-accent · Sobre fondo invertido; conmuta con el tema para llegar a AAA | 7,04:1AAA | 7,21:1AAA |

Todos los pares de texto del sistema alcanzan AAA en claro y en oscuro, y no solo en reposo: también en hover, que es donde suele escaparse. Sin excepciones.

### Checklist de cierre

1. 01
  
  Contraste medido, con cifra, en ambos temas. AA es el suelo no negociable; AAA siempre que se alcance sin coste visual.
2. 02
  
  Foco visible: anillo de 2px con var(--ring) y offset de 2px en todo elemento interactivo. Nunca outline:none sin sustituto.
3. 03
  
  Objetivos táctiles de 44×44px como mínimo, también en controles pequeños como el breadcrumb o el toggle de tema.
4. 04
  
  Un solo h1 por página y jerarquía h2–h4 sin saltos. El orden de lectura es el orden del DOM.
5. 05
  
  Breadcrumb en toda página interna, con <nav aria-label>, lista ordenada y aria-current="page" en el nivel actual.
6. 06
  
  Nada codificado solo por color: todo estado o categoría que se distinga por color lleva además texto o forma.
7. 07
  
  prefers-reduced-motion respetado en toda animación.
8. 08
  
  Alternativas textuales: alt y etiquetas donde informan, aria-hidden en lo decorativo.
9. 09
  
  Vía de escape del teclado: un enlace de salto al contenido como primer elemento focalizable de la página, con destino real (<main> con tabindex="-1"). Ninguna herramienta automática lo detecta: su regla de bypass se da por satisfecha con landmarks o encabezados.

11 de 12

[Índice](#indice) · [Siguiente: 12 · Artículo largo](#s12)

## La excepción

El texto largo tiene su propia forma, y va el último a propósito: es lo que el núcleo no cubre, así que cierra.

- 12 · Artículo largo

12 — Artículo largo

## 12. La forma para texto largo con paradas

Once secciones y varios miles de palabras necesitan piezas que el resto del sitio no usa. Es una capa aparte, no la octava del núcleo.

### La portada del artículo

Lo que solo aparece una vez, al principio: quién firma y cómo se comparte.

Francisco López

Senior Product Manager

Compartir

Copiar enlace

Portada · `<ByLine> · <ShareActions>`

Autoría y compartir, resueltas en la misma fila de apertura.

Un artículo firmado dice quién lo firma en la apertura, no en el pie. Y sin `navigator.share` el botón copia el enlace igualmente.

### La apertura de cada parada

Una sola pieza, repetida once veces. Es lo que hace que todas las secciones se reconozcan como la misma.

5 de 11 · 3 min

05 — Espécimen

#### 05. El ordinal ilustrado abre cada sección

5 de 11 · 3 min

Portada de sección · `<SectionCover>`

Rótulo y titular a la izquierda; a la derecha, el ordinal ilustrado con su meta-línea debajo.

### Lo que flota junto al texto

Piezas que no cortan la columna: se colocan a un lado y el texto sigue alrededor.

> Una regla que hay que recordar es una regla que se incumple.

> El registro de por qué se pensó otra cosa vale más que la coherencia retroactiva.

Citas · `<Pullquote> · <Pull>`

La destacada para la lectura, con filetes arriba y abajo; la menor solo acompaña, con un filete más leve del mismo morado en el canto.

El morado aquí es ornamento, no información. Y cuando las dos caen en la misma sección, flotan a lados contrarios.

Un diagrama real de la página, con sus mismos tokens de color.

Diagrama · `<DiagramPanel>`

El marco de un diagrama propio o de un artefacto real, con su pie. El dibujo lo aporta la página.

Sin flotar ocupa el ancho completo de la columna: un panel no es prosa.

Ejemplo · dato en vivo · `lib/design-values.ts`

AAA en las catorce páginas

[Ver el censo medido](#ds-articulo-cover)

Dato en vivo · `<LiveStat>`

Una cifra que no se escribe en el diccionario: se enlaza a la página que la publica de verdad.

…y por eso la sección termina aquí, con la prueba y la salida hacia la siguiente.

ENLACE ·

Las decisiones D39, D41 y D73, en [DECISIONS.md](https://github.com/franciscoylopez/francisco-lopez-website/blob/main/DECISIONS.md)

### Lo que no se va con el scroll

Las tres islas de cliente, fijas a la ventana. Aquí se demuestran juntas dentro de una caja.

Igual que en la página real, pero contenidos a este panel: fuera de él van fijos a la ventana.

Las tres islas · `<ReadingProgress> · <SectionRail> · <FloatingShare>`

La barra de progreso del borde superior, el índice flotante con la parada activa, y el dock de compartir a la derecha.

Son mejora, no requisito: el índice de servidor ya cubre la navegación si el observador no llega a arrancar.

### Qué es esta capa y qué no

- Ninguna de estas piezas sabe nada de este sitio: reciben texto y enlaces, no copy propio ni rutas.
- No es una octava pieza del núcleo: es una capa aparte, para texto largo con paradas.
- Los especímenes son las piezas reales importadas, con contenido de muestra: si una cambia, esta sección cambia con ella.

12 de 12

[Índice](#indice)

Del mismo sistema

[Brand Kit · La identidad: el logo y su geometría, la paleta de dos capas, la tipografía y las reglas que gobiernan su uso.](https://franciscolopez.es/brand-kit) · [Accesibilidad · La declaración pública: el nivel de conformidad que cumple el sitio y cómo reportar un problema.](https://franciscolopez.es/accesibilidad)
