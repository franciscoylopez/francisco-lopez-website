# Sistema de marca

Reglas de identidad visual para este proyecto. Aplícalas siempre al generar UI.

> **Reglas en presente. El porqué fechado vive en [`BRAND-historical.md`](./BRAND-historical.md)**
> *(partido el 2026-08-09, P37.685)* — qué se probó, qué se descartó y qué falló antes de que
> cada regla quedara escrita así. **Se consulta a demanda; nunca se `@`-importa.** Léelo antes
> de cambiar una regla de aquí: casi todas nacieron corrigiendo algo, y ahorra repetir un
> experimento que ya salió mal.

## Stack

Next.js + TypeScript + Tailwind (v4). La capa de componentes es **propia**
(`components/ui/`); shadcn/ui está configurado y **sin usar** — entra solo para widgets
con estado, foco atrapado o portal, y hacia delante (`DECISIONS.md` D6). Iconos: lucide-react.
Los tokens viven en `app/globals.css`. No inventes colores fuera de esos tokens.

## Tipografía

- **Titulares (h1–h4):** Bricolage Grotesque, weight 600. Variable `--font-bricolage` / utilidad `font-display`.
- **Texto y UI:** Inter. Variable `--font-inter` / utilidad `font-sans` (por defecto).
- No uses Bricolage para texto corrido ni para labels de formulario.

## Color — regla de las dos capas

El sistema tiene DOS grupos de tokens que no se mezclan:

1. **Tokens semánticos de shadcn** (`primary`, `secondary`, `muted`, `accent`, `border`…).
   - `secondary`, `accent` y `muted` son NEUTROS a propósito. Nunca los pintes de cian ni de morado.
   - El color de acción es `primary` (cian): botones, foco y estados activos.
2. **Tokens de marca** (`brand-cyan`, `brand-purple`, `brand-cyan-soft`, `brand-purple-soft`).
   - Son DECORATIVOS: fondos de sección, detalles, ilustración, gráficos.
   - `brand-*-soft` (los pasteles) son de bajo contraste: NO los uses como color de texto, de
     botón ni de cualquier elemento que deba leerse. Solo relleno decorativo.
   - `brand-cyan` manda; `brand-purple` es apoyo, con cuentagotas.
   - `brand-purple-accent`: variante de `brand-purple` ajustada para servir como texto/acento
     legible en **secciones con fondo invertido** (fondo = `foreground`, texto =
     `background`), donde el `brand-purple` estándar no llega. Úsalo **solo ahí**; fuera de
     ese contexto, `brand-purple`.
     **Conmuta con el tema** (`0.78` en claro, `0.45` en oscuro): un color fijo no pasa de
     **3,71:1** contra las dos superficies, conmutando da **7,04 / 7,21**, AAA sin coletilla.
     Porqué y cálculo en `BRAND-historical.md`. Mismo patrón que `--primary-on-inverted`.
   - `progress-ink` *(2026-08-21)*: para texto/gráficos grandes directamente sobre
     `--background` (`0.45` claro / `0.78` oscuro, AAA en los dos) — no para superficies
     compuestas (tarjeta, velo, banda invertida), que ya tienen su propio token. Porqué y
     cifras en `BRAND-historical.md`.

### El morado decorativo no vale como elemento gráfico

Un diagrama es de los pocos sitios donde §Color deja entrar los tokens de marca —«fondos de
sección, detalles, **ilustración, gráficos**»—, y ahí el umbral no es el de texto: WCAG 1.4.11
pide **3:1** a un gráfico que hay que entender.

**`--brand-purple` no llega en tema claro y el cian sí, con holgura.** Así que en un gráfico
**el cian lleva la información y lo que no llega se atenúa** (`--muted-foreground`), nunca se
tiñe de morado. La distinción entre dos caminos la hacen además el trazo y la etiqueta, que es
lo que cumple el punto 6 del checklist sin depender del color.

*(Las cifras, la asimetría entre temas y por qué el mismo hallazgo llegó dos veces por dos
puertas distintas, en [`BRAND-historical.md`](./BRAND-historical.md) §El morado como gráfico.)*

### El atenuado lo pone la superficie, no el punto de uso

`--muted-foreground` está calibrado contra `--background` **y solo contra él**. Encima de
cualquier otra superficie hay que recalcularlo, nunca reusarlo — es **D30**, y desde el
2026-08-09 **ya no hay que acordarse**: la utilidad `text-muted-foreground` resuelve al
atenuado del fondo donde cae, porque cada superficie redefine `--surface-dim` mezclando el
texto un **85% hacia el fondo que tiene debajo** (D39).

Lo que hay que saber al escribir UI:

- **No se elige el color del texto atenuado.** Se escribe `text-muted-foreground` y ya. Dentro
  de una tarjeta pesa más que fuera, y eso es correcto: es lo que hace falta para que se lea.
- **Si un bloque se pinta su PROPIA superficie** —un velo `color-mix` en vez de la utilidad—,
  tiene que declarar a qué familia pertenece con `data-surface="card" | "muted" | "inverted" |
  "page"`. Sin eso la capa no puede verlo, y ahí es donde se escaparon cuatro pares.
- **Una superficie también cambia por ESTADO, no solo por clase o por atributo** *(2026-08-18,
  D61)*. `hover:bg-muted` **no** compila a `.bg-muted`: compila a `.hover\:bg-muted:hover`, y
  dentro de `@media (hover: hover)`. Es otro selector, así que durante meses una tarjeta que se
  aclaraba al pasar el cursor cambiaba de fondo **sin recalcular su atenuado** — 9,14 en reposo
  contra **7,79 claro / 9,01 oscuro** en hover, donde le tocaba 8,17 / 9,17. Ya está resuelto en
  `globals.css` para `hover:` y `focus-visible:`, así que **al escribir UI no hay nada que hacer**;
  lo que hay que saber es que `data-surface` **no** sirve para este caso: es estático y no puede
  describir algo que cambia con el estado. Si aparece una tercera puerta (otro variante de estado
  que cambie el fondo), se añade **en la capa**, nunca en el punto de uso.
- **Los pasteles siguen sin ser superficie de texto.** Esto resuelve los grises del sistema, no
  convierte un `*-soft` en fondo legible.

### Enlaces: depende de si son contenido o chrome

- **Contenido** (dentro del cuerpo de una sección, en medio del texto): en reposo, texto en
  `foreground` con subrayado fino en `primary` (2px, offset amplio para librar descendentes
  como «p»/«y»); en hover/focus, un relleno sólido en `primary` crece de abajo arriba y el
  texto pasa a `primary-foreground` — variante **H1**. El cian entra como **recompensa de la
  interacción**, no como color permanente del texto. *(Hay una variante «G» aparcada para un
  uso puntual de énfasis, descrita en el histórico; no es el estándar y hoy no se usa.)*
- **Chrome de navegación** (nav, breadcrumb, footer, menús): `foreground` o `muted-foreground`,
  nunca `primary` — ni en el texto ni en el fondo de su estado hover. En un bloque cuya función
  *entera* es navegar, el cian no distingue nada: solo mete ruido. Se leen como enlace por su
  posición; el subrayado al pasar por encima o al recibir foco, y una pastilla de fondo `muted`
  en hover (variante **F**), bastan como afordancia.
- **El chrome secundario se aclara al interactuar.** Un enlace en `muted-foreground` sube a
  `foreground` **en el mismo gesto en que aparece la pastilla** de hover. No es estética: sin
  ese salto el par cae a AA justo en hover, que es el caso que prohíbe **D30**. Lo pone el
  `tone: "muted"` de `components/ui/chrome.tsx`, no cada uso.
- **Controles de chrome solo icono** (toggle de tema, hamburguesa, iconos de redes): la **misma
  pastilla** que el chrome con etiqueta (`.icon-chrome`), sobre el objetivo táctil de 44px
  completo. Un control sin texto necesita la misma afordancia que uno con etiqueta.

> **Excepción viva — `ContactSecondary`** *(2026-08-04, ampliada el 08-08)*. Teléfono, LinkedIn
> y CV de la franja de contacto, y la **dirección de email visible** bajo el CTA de
> Accesibilidad, son acciones y no navegación, así que por regla les tocaría H1 — pero llevan
> tratamiento de **chrome** (`.link-chrome`, sin subrayado). Motivo: están a 15px del CTA
> sólido de email, y ahí H1 mete ruido —subrayado permanente + un hover propio— en vez de
> leerse como su acompañamiento. Es una excepción puntual, **no un tercer criterio**;
> probablemente se resuelva de otra forma el día que exista una sección de contacto dedicada
> (hoy es una franja compartida entre home, Sobre mí y Accesibilidad, D29).

## Jerarquía de hover en botones y CTA

> **Estas reglas no se escriben a mano.** Viven en `components/ui/action.tsx` (variantes
> `solid` · `outline-primary` · `outline-neutral` · `ghost` · `toggle-primary` ·
> `toggle-neutral` · `icon`), que es la única fuente del aspecto de todo elemento
> accionable. Lo de abajo explica **por qué** cada variante es como es; para aplicarlas,
> se usa la variante. Ver «Ningún control se escribe a mano» al final de esta sección.

- **CTA sólido** (`bg-primary`): la acción destacada de la página. Hover = el relleno se mezcla
  hacia `--foreground` (`color-mix(in srgb, var(--primary) 88%, var(--foreground))`), que
  **sube** el contraste del texto encima en los dos temas; bajar la opacidad lo bajaría. Hoy
  solo el email de la franja de contacto.
- **CTA outline-primary** (`border-primary` + `text-primary`): acciones de contenido que viven
  solas, sin otro CTA al lado con el que competir — «Descargar CV» de Trayectoria, «Gestionar
  preferencias» de Cookies, chips de descarga del Brand Kit. Hover = **el relleno cian pleno**,
  texto a `primary-foreground`.
- **Outline neutro** (`border-border` + `bg-background`): controles de utilidad y botones que
  conviven con un sólido dentro del mismo grupo (los del diálogo de consentimiento, «Repetir»
  del Design System). Hover = pastilla `muted`, nunca cian.

### Controles con estado (toggles, segmentados y pestañas)

En un control con estado el **relleno pleno ya significa «activo»**, así que el encendido reusa el sólido y el apagado nunca puede rellenarse igual. Cuál de las dos variantes toca se decide por la **forma** del control, no por su contenido ni por cuántos segmentos tenga:

- **`toggle-primary` — interruptor suelto.** Un único control que enciende o apaga algo que antes no estaba (el toggle de rejilla del Design System). No tiene pares al lado, así que el cian no compite con nada. Apagado = `border-primary` con **tinte** en hover (velo del propio `primary` al 8%), nunca el relleno: con el relleno, hover y encendido se verían igual y el control dejaría de comunicar en qué estado está. En ese hover el **texto** se mezcla además un 12% hacia `--foreground` —la misma constante del hover del sólido—, que es lo que sube el par a AAA sin apagar el velo.
- **`toggle-neutral` — grupo de alternativas excluyentes.** Varios botones de los que exactamente uno está activo, para elegir cómo mirar un contenido que ya está en pantalla (pestañas del Toolkit, tabs de dispositivo del Esqueleto navegable). Apagado = el mismo **outline neutro**, y ahí el hover **sí** puede ser la pastilla plena: `muted` no se parece en nada al cian del seleccionado, no hay ambigüedad que evitar. Es el mismo eje que separa contenido de chrome: en un bloque cuya función entera es elegir qué mirar, el cian no distingue nada — y multiplicado por tres o cuatro se come la sección.

### Controles con dos fondos: el color se toma del fondo, no se fija

Cuando una pieza se apoya sobre un fondo que **cambia por tema y por estado**, no vale elegirle
un color: hay que derivarlo del fondo que tiene debajo. **Ningún token que conmute con el tema
lo arregla** — se comprobó con la bolita del switch de consentimiento, que es el caso de
referencia. La regla que sí funciona: **la pieza es el `foreground` de su propio carril**
—`--foreground` sobre el carril apagado (`--muted`), `--primary-foreground` sobre el encendido
(`--primary`)—. Mismo patrón que `--surface-dim` y `--chrome-hover-bg` (D30, D39).

### Un control sobre una imagen no puede fijar su color

*(2026-08-17, midiendo el botón de play de los vídeos del deep-dive.)* Un control sobre una
**imagen** tiene el fondo fuera del sistema: no hay token que ajustar, lo decide el póster. **Un
color fijo no puede garantizar el 3:1 que WCAG 1.4.11 pide a un componente** — el disco de play
sobre el póster de TheTool medía **2,81 oscuro / 2,59 claro**.

Misma idea que §El atenuado lo pone la superficie y §Controles con dos fondos: **la pieza se
define contra su propio carril**, con dos piezas. Un velo entre la imagen y el control, **del
color del FONDO** (`--background`), nunca negro (el negro arregla un tema y empeora el otro,
firma de D41). Y un control **de dos tonos** —relleno `--primary` + anillo
`--primary-foreground`—, cuyo borde **interno** no depende de la imagen: 7,93 claro / 8,36
oscuro, siempre.

**Qué garantiza y qué no.** El borde interno, siempre. Que alguno de los dos bordes EXTERNOS
pase 3:1 en cada punto del contorno, no: el peor de 144 ángulos del perímetro se queda en
**2,82–2,91**, y subir el velo no lo arregla —acerca el póster al fondo, lo que separa al disco
y **acerca al anillo**, tirando en direcciones opuestas—. No es incumplimiento: WCAG pide que el
componente se distinga, no que cada punto del contorno pase 3:1, y con un borde interno a 7,93 y
un disco de 64px se distingue.

*(El barrido de opacidad, la tabla y las dos veces que el metro estuvo mal, en
[`BRAND-historical.md`](./BRAND-historical.md) §Un control sobre una imagen; cifras y
componente en `DECISIONS.md` D55.)*

### Etiquetas: el velo es la señal, el texto siempre es `foreground`

Una **etiqueta** (la pastilla no interactiva que rotula un título, una fila o un dato) sale de `components/ui/badge.tsx`, no de `action.tsx`: no se pulsa, así que no tiene estado, ni hover, ni suelo táctil de 44px. Dos ejes, y ninguno se escribe en el punto de uso:

- **`tone`** — `neutral` · `cyan` · `purple`. Los dos teñidos se llaman **por su color** y usan `--brand-cyan` / `--brand-purple`, no `--primary`/`--accent`: son la **segunda capa** de este documento (decorativa), y nombrarlos con vocabulario de la capa semántica es justo la mezcla que §Color prohíbe. `--brand-cyan` pinta idéntico a `--primary` a propósito, pero aquí el cian es relleno, no color de acción.

  **Cuál de los dos teñidos toca:** **cian = una medición o el comportamiento de un token**
  —«AAA», «Conmuta», la cifra del hero de Accesibilidad—; **morado = una cosa de la marca**
  —«Exit», «Split», la métrica del logo—. Los dos están en AAA, así que la elección es **de
  significado, nunca de contraste**.
- **`kind`** — `label` (versalitas, para un rótulo de estado: «EXIT», «PRÓXIMAMENTE») · `value` (caja normal, para un dato en prosa: «AAA», «Split») · `code` (monoespaciada, para un valor técnico: «13,79:1»). El `kind` se lleva también la **familia tipográfica**: era la última pieza que un call site tenía que acordarse de escribir.

**La regla de color, que es la parte reutilizable: el texto de una pastilla teñida es SIEMPRE
`--foreground`.** El velo dice de qué familia es; el texto solo tiene que leerse. No es
preferencia estética: es lo único que llega a AAA. Con el texto teñido sobre su propio velo
**no hay alfa que lo salve** — es el techo asintótico de D30.

Y en la **neutra**, el texto tampoco puede ser el `muted-foreground` calibrado contra
`--background`: encima de la pastilla caería a AA. Ya no hace falta pedirlo —desde el
2026-08-09 la pastilla escribe `text-muted-foreground` y el **85% hacia su propio fondo** lo
resuelve la superficie (§El atenuado lo pone la superficie, D39)—, pero el valor es el mismo
píxel que antes se escribía a mano.

### Cuándo una acción lleva icono

**Una sola pregunta: ¿esta acción saca al usuario de la página?** Descargar un archivo, abrir otra aplicación (correo, teléfono) o irse a otro sitio web → **lleva icono**. Todo lo que ocurre dentro de la página —aceptar, guardar, cerrar, elegir en un grupo de pestañas, navegar por el sitio— → **no lo lleva**. El criterio mira la **acción**, no la variante ni el sitio donde vive: por eso «Descargar CV» lo lleva en sus tres apariciones (nav, Trayectoria, canales de contacto) y «Gestionar preferencias» no lo lleva en ninguna, porque abre un diálogo y no te lleva a ningún sitio.

- **Posición: delante de la etiqueta**, porque el icono clasifica la acción («descargar», «teléfono»). **Excepción por forma, no por caso: la variante `solid`**, donde va detrás y avanza 2px en hover — ahí no clasifica nada (es la única acción de la pantalla), marca la dirección del viaje.
- **Tamaño, hueco y lado no se escriben en el punto de uso.** Los pone la variante (`sm` 16 · `md` 17 · `lg` 18 · `icon` 18) y, en los canales de chrome, `.link-chrome svg`. En el call site se escribe `<Download />` y nada más — el icono va **siempre primero en el JSX** y es `solid` quien lo manda al otro lado.
- **Queda fuera el enlace de contenido inline** (`.link-content`): su afordancia es el subrayado, y un glifo en medio de un párrafo rompe la línea base.

### Ningún control se escribe a mano

> **Caso particular de la «Regla de construcción» de `CLAUDE.md`** (2026-08-08), que
> generaliza esto a todo lo que se construye —secciones, páginas, bloques— y añade el
> paso de shadcn para widgets con estado, foco atrapado o portal. La cascada completa
> vive **solo allí**; aquí queda el porqué específico de los controles. No se copia:
> dos documentos afirmando la misma regla es exactamente lo que produjo el drift de
> cuatro días de §Jerarquía de hover.

**Ningún elemento interactivo —botón, enlace con forma de botón, chip, toggle, pestaña, control
de icono— nace de una cadena de clases inline.** Si el caso no encaja en una variante, se **crea
la variante**; si es una excepción, la decide Francisco y se **documenta con fecha** aquí (como
`ContactSecondary` más arriba).

> **Excepción viva — el switch del diálogo de consentimiento** *(2026-08-08, P37.5996)*.
> `consent-banner.tsx` dibuja su interruptor con una cadena inline (`peer-checked`, `after:`,
> anillo de foco). Se queda así porque hay **un** switch en todo el sitio —no hay repetición que
> factorizar, y una pieza con un solo call site solo añade indirección— y porque la cascada de
> la «Regla de construcción» mandaría traerlo de shadcn, que **aplica hacia delante, no hacia
> atrás**.
> **Condición de salida:** cuando aparezca un **segundo** switch —entonces hay repetición que
> factorizar y el segundo se trae de shadcn, arrastrando al primero— o cuando este haya que
> rehacerlo por otro motivo. Lo que **no** es excepción es su color: eso lo resuelve
> §Controles con dos fondos.

> **Excepción viva — el índice de secciones de «Cómo se ha creado esta página»**
> *(2026-08-22, design-review P60)*. El riel flotante (`article-islands.tsx`) no compone
> `chromeLinkVariants`: es una píldora que se expande en hover/foco con estado activo
> propio, un caso que hoy no cubre ninguna `shape` de `chrome.tsx`.
> Se queda así porque hay **un** índice de este tipo en todo el sitio —no hay repetición
> que factorizar, y una pieza con un solo call site solo añade indirección—.
> **Condición de salida:** cuando aparezca un **segundo** índice flotante de secciones
> (otro deep-dive largo con TOC), se extrae a `chrome.tsx` arrastrando a este.

## Accesibilidad (no negociable)

- Todo texto y todo elemento interactivo debe cumplir WCAG AA (4.5:1 texto, 3:1 UI). **AA es el
  suelo, no el objetivo:** se empuja a AAA siempre que se pueda. **Todos los pares del sistema
  están en AAA en ambos temas, en reposo y en hover. Sin excepciones.**
  **La pasada es `npm run censo`, no se conduce a mano** (D85; el cómo, en `CLAUDE.md`).
  Lo único que no juzga es el **texto sobre foto**, que se mide aparte sobre el píxel pintado.
  *(Las dos veces que este «sin excepciones» fue falso, y por qué la pasada tenía que dejar de
  ser un hábito, en [`BRAND-historical.md`](./BRAND-historical.md) §La pasada completa.)*
- **El censo con las cifras vive en `lib/design-values.ts`, no aquí** (D38). Este documento es
  la fuente del **porqué** —qué par existe, por qué se eligió ese color y qué se probó antes—;
  el **valor** lo tiene un solo sitio, del que beben las páginas que lo publican.
- Los pasteles (`*-soft`) no pasan contraste como primer plano. Si necesitas texto sobre un
  fondo pastel, usa `foreground` (gris/hueso), nunca otro pastel.
- Cian primario: `#005859` en claro y `#3FC9C4` en oscuro (ya resuelto en los tokens; no lo
  hardcodees).

### Cómo se hace el censo de pares

**Recorriendo el DOM de la página servida, no leyendo `globals.css`, y con los estados
incluidos.** Un par que solo aparece al **componer** —un velo `color-mix` sobre la superficie
de debajo, o una pastilla de hover— no está en ninguna lista de tokens, así que un inventario
hecho leyendo el CSS no puede encontrarlo por muy cuidadoso que sea. El script está escrito:
`scripts/design-review/contrast-census.js`.

> **Este censo se ha roto dos veces, las dos en silencio, y las dos se descubrieron midiendo un
> caso cuyo resultado ya se conocía.** Por eso publica ahora cuántas reglas `:hover` ha indexado
> y cuántos pares ha medido con ellas: *un metro que devuelve una lista vacía parece un
> aprobado*. El detalle de los dos fallos y del incumplimiento real que escondía el segundo, en
> [`BRAND-historical.md`](./BRAND-historical.md) §El censo de contraste se rompió dos veces.


### Cómo medir sin equivocarse

1. **Valida la herramienta contra pares ya publicados antes de creerte un hallazgo.** Los
   anclajes son **texto principal (13,79 claro / 15,32 oscuro)** y **la bolita apagada del
   switch (12,47 / 12,04)**: son pares sin cian, así que no dependen del recorte de gamut y
   tienen que reproducirse **exactos**. Si no lo hacen, el fallo es del método, no del color.
   *(Los pares que llevan cian sirven mal de anclaje — son justo los que se han corregido dos
   veces.)*
2. **Los cianes de esta marca caen ligeramente fuera del gamut sRGB.** El navegador los recorta
   al pintarlos, así que `getComputedStyle` devuelve `color(srgb …)` con **componentes
   negativas**. Leerlas sin recortar a [0,1] da un color que no existe en pantalla. Recorta
   siempre, o lee el píxel de un `<canvas>`, que ya viene recortado.
3. **La cifra se mide sobre el color que el navegador pinta**, nunca sobre el hex que uno cree
   tener ni sobre el valor nominal del `oklch`.
4. **La afordancia se mide también.** Subir contraste apagando un hover no es una mejora: es
   cambiar un incumplimiento por otro que no sale en el informe. Compara el ΔL\* del estado
   nuevo contra un hover que el sitio ya dé por bueno (la pastilla `muted`: 3,9 en claro, 9,0
   en oscuro) antes de dar el cambio por cerrado.
5. **Verifica la clase, no solo el color.** Tailwind escanea el código como texto plano: una
   clase construida por interpolación no se genera y el elemento se queda sin hover, **sin
   error de compilación**. La cifra puede ser perfecta sobre el papel y no estar aplicándose a
   nada. Mide sobre el elemento real, en su estado real.
6. **Una cifra corregida se SUSTITUYE en todos los párrafos que la citan; no basta con anotarla
   al final.** Una nota fechada al pie no corrige el texto de arriba.
7. **La cifra no dice nada sin el umbral, y el umbral lo pone el TAMAÑO del texto.** WCAG llama
   grande a ≥24px, o ≥18,66px con peso ≥700: ahí AAA es 4,5 y AA es 3, no 7 y 4,5. Puntuarlo
   todo contra 7:1 hizo publicar cuatro incumplimientos donde había **uno** (D41). El censo ya
   lo aplica y ordena por **holgura**, no por ratio — con umbrales mixtos, la cifra más baja no
   señala al peor par. *Un umbral mal aplicado inventa hallazgos igual que un metro mal
   calibrado.*

## Modo oscuro

Obligatorio en toda UI. Los pasteles se mantienen entre temas; solo el cian primario cambia (se aclara en oscuro). Nunca hardcodees hex: usa siempre los tokens, que ya conmutan.

## Qué cuestionar

Si una petición de UI implica meter un color de marca en un slot semántico neutro, romper contraste, o usar un pastel como color de acción, deténte y avísalo en vez de ejecutarlo.

## Logo y firma split

Componente: `components/ui/logo.tsx` → `<Logo />` (variantes `split`/`flat`, props `showWordmark`/`forceColor`; hereda claro/oscuro por tokens).

**Reglas mínimas siempre activas:**
- El **split es la firma de marca**: solo en el logo/monograma y solo a **≥48px** (por debajo, `flat`). Nunca en UI general, texto fino ni iconos.
- Colores del split: `brand-cyan-split` (#16BDBD) + `brand-purple-split` (#9B87F5). No tienen requisito de contraste; **no se tocan**.
- Tamaño mínimo del componente: 24px. El favicon 16px usa asset propio, no el componente reescalado.

**El detalle exhaustivo** (tabla de uso por contexto, umbrales split→flat, proporciones símbolo/wordmark, transición del nav, «dónde respira la marca» y el rationale fechado) vive en **`BRAND-logo.md`** — consúltalo **al tocar el logo o los assets de marca**. No se `@`-importa.

## Iconos propios

Los iconos del sitio son de **lucide-react**. Desde la v1.24 lucide no exporta iconos de marca
(LinkedIn, GitHub…) por marca registrada, así que esos se dibujan a mano en
`components/ui/icons.tsx`. Un icono propio tiene que poder ponerse al lado de uno de lucide sin
que se note cuál es cuál — y eso no sale de copiar los atributos del `<svg>`.

**Antes de dibujar: ¿lucide lo trae?** Si la respuesta es sí, no se dibuja — se importa. Un
glifo propio se justifica **solo** por lo que lucide no exporta. Parece obvio y es la regla que
más se ha incumplido.

- **Mismo artboard.** `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, trazo **2**, terminaciones y uniones **redondas**. Todas las coordenadas dentro de **2–22** (el área útil de 20×20 de lucide; el trazo desborda hasta 1 y 23). No hay que llenarla: `user` ocupa 16×20 y no se ve pequeño.
- **Nada se contornea por debajo de 8 unidades** (4× el trazo). Una forma más estrecha que eso se dibuja **con** el trazo, monolineal, en vez de rodearla con él. Lucide lo cumple sin excepción: su forma contorneada más estrecha es el disco del `sun`, que mide justo 8, y el borne del `battery` —que como contorno sería un saliente de 2— es una línea suelta.
- **Contraforma mínima 6 unidades de eje a eje** (3× el trazo, 4 de fondo limpio) entre trazos paralelos y en todo hueco que haya que leer. Es la rejilla de lucide: `menu`, `list` y `align-*` separan sus líneas exactamente 6. A 18px, 4 unidades son 3px de fondo — se ve; 2 son 1,5px — se rellena.
- **Los puntos son trazo, no círculos.** `M4 4h.01` con terminación redonda da un punto del diámetro exacto del trazo. Un `circle` de radio pequeño incumple la regla anterior por definición.
- **Se verifica en pantalla, no en el editor.** A tamaño real (17px en `.link-chrome`, 18px en la variante `icon`), dentro de su pastilla, **junto a un lucide del mismo bloque** y en los dos temas. Al 400% todos los dibujos se ven bien.
- **El inventario de glifos propios es el `grep` de `<svg>`** en `components/` y `app/`, no el contenido de `icons.tsx`. De ahí se descuentan el logo y las **ilustraciones** (maquetas de navegador, marcos de dispositivo, esqueletos, el «0» del 404), que son dibujos y no iconos. Lo que quede son iconos propios, vivan donde vivan — y **su sitio es `components/ui/icons.tsx`**.
- **Si hay más de dos iconos propios**, publicarlos en el Brand Kit — el recorrido completo (regla → uso → página publicada) es lo que hace que una regla deje de depender de que alguien se acuerde.

## Cómo se escribe una regla aquí

Estas cinco no son de marca: son de **cómo redactar las de arriba**. Cada una salió de una
regla que existía y aun así se incumplió, y el caso está en
[`BRAND-historical.md`](./BRAND-historical.md).

1. **Una regla cuyo disparador mira al lugar —o al momento— equivocado no es una regla: es una
   nota.** La condición tiene que ser comprobable **donde** y **cuando** la cosa de verdad
   ocurre.
   **De lugar:** «si hay más de dos iconos propios» se comprobaba leyendo `icons.tsx` —donde
   había uno— mientras el sitio tenía siete; el censo de contraste se hacía leyendo
   `globals.css`, donde los pares compuestos no existen.
   **De momento** *(añadido el 2026-08-16)*: el gate de accesibilidad se disparaba **al
   cerrar** una sección, y al cerrar el alto de una banda dimensionada por `vw` ya no es un
   ajuste, es un rediseño. Por eso pasó a tener **dos** disparos, y el primero es *mientras se
   dibuja* (D50, D52).
2. **Una regla que hay que recordar es una regla que se incumple.** Lo que impide el drift es
   el **recorrido completo** —regla → variante o clase → sección publicada en el Design System
   → uso—, no la disciplina. Los enlaces lo hicieron entero y son coherentes; los botones se
   quedaron en el primer paso.
3. **Valida el metro antes de creerte el hallazgo.** Reproduce primero un caso que ya damos por
   bueno. Se ha caído así un medidor de contraste (componentes fuera de gamut), una norma de
   iconos (la «densidad de tinta») y un censo de pares (las reglas `:hover` dentro de
   `@media`).
4. **Antes de unificar dos valores que se parecen, mira si significan cosas distintas.** El
   `CARD` con dos radios no era drift: eran dos cajas y a una le faltaba el nombre. Unificar
   habría roto la jerarquía.
5. **La misma decisión escrita en dos sitios acaba diciendo dos cosas.** Si una regla ya está
   en `CLAUDE.md` o en `DECISIONS.md`, aquí va el puntero y el porqué específico, nunca la
   copia.
