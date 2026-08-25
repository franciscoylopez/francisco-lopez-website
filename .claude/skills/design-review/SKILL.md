---
name: design-review
description: >
  Revisión crítica de DISEÑO del sitio, en dos mitades: (a) cumplimiento del sistema
  —coherencia entre `BRAND.md` ↔ `globals.css` ↔ página Design System ↔ Brand Kit, y que
  ningún control esté escrito a mano— y (b) expresión de marca (presencia del color, ritmo
  de secciones, gesto-firma, motion con propósito). Se verifica en pantalla, no solo en el
  código. Invócalo cuando Francisco pida una auditoría o revisión de diseño, antes de
  construir secciones nuevas, o antes de un release con cambios visuales grandes. DISPARO
  MANUAL: a diferencia de `sprint-review`, no se engancha al cierre de etapa hasta que
  Francisco valide que funciona. Fuera de alcance: el copy.
---

# Revisión de diseño

Un diseñador de sistemas que **acaba de aterrizar** en el sitio lo audita entero: primero
si el sistema se cumple, después si la marca se expresa. No es una review de un diff (eso
es `/code-review`) ni del andamiaje técnico (eso es `sprint-review`): es del **diseño
publicado**, código y píxel.

> **Este documento no repite lo que ya está delante.** `CLAUDE.md`, `BRAND.md` y `PRD-Live.md`
> se `@`-importan **siempre**: sus reglas ya están en contexto cuando esta skill se dispara,
> así que aquí va el **método de la revisión** y el puntero, nunca la copia (`BRAND.md` §Cómo
> se escribe una regla, 5). Igual con `viewport-verifier`, que es el instrumento de la Fase 3
> y lleva escrito cómo se mide.

## Principios — los cuatro fallos, en positivo

Los cuatro salieron del día siguiente al gate de P37.591: la auditoría había dado el sitio
por bueno y Francisco cazó cuatro cosas navegando. No fueron cuatro despistes sino cuatro
fallos de método, y son la razón de ser de esta skill.

1. **La lista de propiedades es explícita y se recorre entera, aunque parezca redundante.**
   Del botón se revisaron seis propiedades y se declaró unificado; el **icono** no estaba en
   esa lista mental, así que siguió decidiéndose en cada punto de uso. Una lista implícita
   solo encuentra lo que ya sospechabas: usa la **matriz de la Fase 2**.
2. **Se audita el píxel, no el código.** El LinkedIn propio pasaba cualquier revisión de
   código —`viewBox` 24, `fill none`, `stroke` 2, idéntico a lucide— y en pantalla se leía
   como una mancha, porque tenía huecos más estrechos que su propio trazo. Es el mismo fallo
   que creerse el valor nominal de un `oklch` en vez del color que el navegador pinta: la
   lección estaba aprendida para el color y no se generalizó. Todo veredicto visual se cierra
   **a tamaño real, en su contenedor real, junto a sus piezas hermanas, en los dos temas**.
3. **Se auditan las composiciones y los estados, no las piezas en reposo.** Migrar el botón
   a la variante cambió su padding y su altura, y la fila de tres del diálogo de
   consentimiento dejó de caber; nadie volvió a mirar los contenedores. Agravante: ese
   diálogo solo se ve **provocándolo**, así que se cae del recorrido normal. Ver el
   inventario de estados a provocar (Fase 3).
4. **Una decisión documentada no es una decisión correcta.** El email de Accesibilidad sin
   `mailto:` tenía un comentario que explicaba por qué la dirección **se muestra**, no por
   qué **no es enlace**: respondía a otra pregunta, y la revisión lo dio por cerrado. Ante
   un comentario o un ADR que justifica algo, comprueba que **responde a la pregunta que
   estás haciendo**.

Y tres heredados:

5. **Valida el metro antes de creerte el hallazgo** — `BRAND.md` §Cómo medir sin
   equivocarse, punto 1, con sus anclajes sin cian. Se han caído así un medidor de
   contraste, una norma de iconos (la «densidad de tinta») y un censo de pares.
6. **Calibra con lo que está bien.** Di también qué es sobresaliente, para no inventar
   problemas y para que las prioridades signifiquen algo.
7. **La señal de que el sistema se rompe no es que algo se vea mal: es que la misma decisión
   está escrita en dos sitios.** Busca duplicación de decisiones antes que fealdad.

---

## Fase −1 — El filtro barato, ANTES de nada

**Dispara `/web-design-guidelines` sobre los archivos en revisión, resuelve o tarea sus
hallazgos, y solo entonces abre esta revisión.** Es el punto 8 de la columna A de la
Definition of Done —que dice literalmente «**antes** de `design-review`»— y llevaba sin
portador desde que se escribió.

**Por qué delante, con la cifra que lo justifica.** De los cinco hallazgos del
`design-review` del sprint 3, **dos** eran huecos de medición genuinos —el contorno de
control a 1,21:1 y `--destructive` a 4,31:1— que ningún instrumento podía ver, y su
respuesta correcta fue extender el metro (D85, D90, D97). **Los otros tres eran mecánicos**:
un filete varado entre 768 y 829px, nueve copias de la misma cadena, y una excepción
publicada en cuatro sitios tras retirarse del código. Esos tres no pedían criterio de
diseño: pedían un filtro barato que la revisión más cara del sistema acabó haciendo a mano.
Si el filtro no encuentra nada, has perdido un minuto.

**Se mantienen separadas, no se fusionan:** fusionarlas crearía la copia que prohíbe
`BRAND.md` §Cómo se escribe una regla (5), e impediría que las reglas de Vercel se
actualicen solas sin tocar las nuestras. Cubren catorce familias que nuestro sistema **no
codifica**: además de las cinco que nombra la DoD, `touch-action`, `overscroll-behavior`,
`translate="no"`, fecha y número con `Intl`, y los antipatrones (`transition: all`,
`outline-none` huérfano, `<div onClick>`, bloqueo de zoom).

**Dos cosas al usarla:**

- **Descarga sus reglas de la red en cada pasada.** Eso es bueno —se actualizan solas— y
  tiene su precio: la revisión no es reproducible sin conexión. Si el barrido no puede
  traerlas, dilo en la salida en vez de dar la fase por pasada.
- **Tría con la regla del ruido de validadores** (D67): verifica cada hallazgo contra el
  código **antes** de tarearlo, y documenta lo descartado **con su mecanismo, nunca con su
  cifra**. En la primera pasada completa, de seis hallazgos uno era falso positivo.

Y una trampa que ya apareció: la guía pide `preconnect` a los dominios de assets. **A
`youtube-nocookie` no**, porque sería la petición que el facade existe para evitar (D55). Una
regla general puede contradecir una decisión tomada; gana la decisión, y se anota aquí.

---

## Fase 0 — Cruzar las fuentes (antes de mirar un solo componente)

Va primero por un motivo medido: durante un día `BRAND.md` y `DECISIONS.md` **se
contradecían** sobre el hover del sólido y el código seguía a uno de los dos. No fue un fallo
de criterio sino de **propagación**.

Las fuentes que tienen que decir lo mismo:

| Fuente | Archivo |
|---|---|
| Reglas de marca, en presente | `BRAND.md` (+ `BRAND-logo.md`, `DECISIONS.md` D30/D34/D35/D36/D38) |
| El **porqué** fechado de esas reglas | `BRAND-historical.md` — léelo antes de proponer cambiar una: casi todas nacieron corrigiendo algo |
| Implementación — lo que el navegador **pinta** | `app/globals.css` · las piezas de `components/ui/` (inventario en su `README.md`) |
| Valores **publicados** | `lib/design-values.ts` (D38) |
| Documentación publicada | página **Design System** (`components/site/design-system/`, un archivo por sección desde D42) |
| Assets publicados | página **Brand Kit** (`components/site/brand-kit/`, misma forma) |
| Cifras publicadas | página **Accesibilidad** (`components/site/accesibilidad.tsx`) |

Qué buscar:

- **Contradicciones entre documentos.** Una regla enunciada en uno y negada en otro. Si
  código y documento discrepan, **decide cuál tiene razón antes de corregir**: en P37.596 el
  incumplidor tenía razón y se corrigió la regla, no el botón.
- **Cifras publicadas que no se sostienen.** Toda cifra de contraste que el sitio publica se
  remide. Han viajado ya dos veces cifras equivocadas de un documento a los otros tres, una
  de ellas trece días en producción. Desde D38 esto apunta a **un** sitio y no a cuatro, así
  que una cifra escrita **fuera** de `lib/design-values.ts` —en el diccionario, en un
  comentario, en prosa— es hallazgo por sí sola, sin necesidad de medirla.
  **Y el drift va también al revés:** en el disparo del 2026-08-08 las páginas publicaban las
  cifras correctas y era `BRAND.md` el que llevaba las superadas. Un documento puede
  contradecirse **consigo mismo** — es la regla 6 de `BRAND.md` §Cómo medir vista desde el
  lado del auditor: si una corrección se escribió como nota fechada al final, los párrafos de
  arriba siguen afirmando lo viejo.
- **Demos que enseñan algo que no existe.** El empujón de 2px vivía en una clase «propia de
  este CTA y de ningún otro», así que la demo de esa variante en el Design System mostraba
  un botón que el sitio no tenía. Toda demo se compara con su uso real.
- **El test del recorrido completo:** regla → variante/clase → **sección publicada** → uso.
  Los enlaces son coherentes porque lo hicieron entero; los botones se quedaron en el primer
  paso y había que acordarse de ellos. Por cada regla de diseño, pregunta **qué paso falta** —
  ese es el que se va a incumplir.

---

## Fase 1 — Barrido de cumplimiento (código)

Objetivo: encontrar decisiones de diseño escritas fuera de su capa. **Calibra la allowlist
antes de reportar**: estos greps tienen hits legítimos conocidos, y un informe con ruido
deja de servir como señal (el mismo motivo por el que `format:check` en rojo permanente no
avisa de nada).

**Antes de leer un solo hit: separa UI real de ilustración.** Este sitio dibuja mucho, y en
un dibujo las reglas del sistema **no aplican igual**: un radio de 1px o una altura de 36px
son correctos en una miniatura y absurdos en un control. Sin este filtro, `rounded-`/`hover:`
devuelve ~120 hits casi todos de trazos, y el informe se vuelve ilegible. Pero el dibujo **no
está exento de todo**: sigue prohibido que copie valores de token a mano, que es donde una
corrección de color se queda sin propagar. Regla práctica: *¿esto se puede pulsar?* →
sistema. *¿esto representa algo que se puede pulsar?* → dibujo, y se juzga por si **miente**.

| Qué se busca | Patrón | Hits legítimos |
|---|---|---|
| Acciones sin variante | `<button`/`<a` con `className` que traiga `hover:` `rounded-` `border-` `px-` y **no** `actionVariants` | enlaces de contenido (`.link-content`) y de chrome (`.link-chrome`) |
| **Valores de token copiados a mano** | `oklch(` · `rgb(` · `#[0-9a-f]{6}` fuera de `globals.css`, sobre todo dentro de `style={{ }}` | solo `logo.tsx`. Los dos que necesitan la paleta *contraria* a la vigente —el mock de tema y `api/og`— consumen `PALETTE` (D38), y `npm run check:palette` la coteja con `globals.css` en CI. Un `oklch(` nuevo fuera de ahí es hallazgo |
| Suelo táctil a mano | `min-h-\[44px\]` · `min-w-\[44px\]` | `action.tsx` y `chrome.tsx` — más **tres call sites con motivo escrito, verificados el 2026-08-18**: el `<span aria-current="page">` del breadcrumb, el conmutador de idioma del nav y el banner de consentimiento. **No son hallazgos**; si aparece un cuarto, ese sí |
| Radios y cajas a mano | `rounded-\[var\(--radius` · `max-w-\[var\(--container\)\]` · `border-t.*py-\[var\(--section-y\)\]` | `layout.ts`, `globals.css` |
| Hex en vez de token | `#[0-9a-fA-F]{6}` | `globals.css` y `logo.tsx`. **Búscalo también en el diccionario y en la prosa**: dos hexes falsos vivían como texto bajo las tarjetas del mock de tema (P37.6605). Un hex que no pinta nada no lo cuenta nadie, y ninguna herramienta compara un párrafo con el píxel que tiene al lado |
| Iconos dimensionados en el call site | `size-\[1[0-9]px\]` sobre `svg` | `action.tsx`, `.link-chrome svg` en `globals.css` |
| Foco compitiendo | `outline-none` · `focus:` sin `focus-visible:` | ninguno (el foco es una sola regla global) |
| Motion sin escape | `transition`/`animate-` sin `motion-reduce` ni `prefers-reduced-motion` cerca | los que lo declaran en `globals.css` |
| **Clases interpoladas** | `className={\`` con `${` dentro de una utilidad | ninguno, nunca — es el fallo sin error de compilación de `BRAND.md` §Cómo medir (5), y ya tumbó a la vez el hover del sólido y el del toggle |
| Inventario de controles con estado | `aria-pressed` · `aria-selected` · `role="tab"` | — |
| **Inventario de glifos dibujados a mano** | `<svg` en todo `components/` y `app/`, **no** una lectura de `icons.tsx` | ilustraciones y maquetas; el logo |
| Pasteles como primer plano | `brand-(cyan\|purple)-soft` en `text-`/`border-` | solo relleno decorativo |

**De qué piezas tiene que salir todo, y cuál toca: la cascada de `CLAUDE.md` §Regla de
construcción**, con el inventario **derivado del disco** en
[`components/ui/README.md`](../../../components/ui/README.md). Ábrelo antes de la pasada —son
tres grupos, no una lista plana— y si un hit no sale de una de esas piezas, es hallazgo.

> **Si encuentras una familia de piezas que se repite sin capa propia, escríbela aquí con su
> conteo.** Es el formato que ya ha funcionado tres veces: `chrome`, `badge` y `heading`
> nacieron de una versión anterior de esta skill listándolas como «capas que todavía no
> existen».

**Valores publicados: no se leen del diccionario.** Desde D38 los tokens de layout, los
breakpoints, el censo y la paleta viven en `lib/design-values.ts`. Dos consecuencias para el
barrido: una cifra o un hex **escrito en `dictionaries/{es,en}/*.json` es hallazgo** —la
prueba es literal: si la entrada ES y la EN son carácter por carácter la misma, no es copy—,
y el `grep` de hex no tiene hits legítimos fuera de `globals.css` y `logo.tsx`.

Y dos comprobaciones que no son grep:

- **Repite el conteo, no lo estimes.** «Seis definiciones en seis archivos», «catorce veces
  el suelo táctil», «WRAP idéntico en dieciocho sitios»: los números concretos son lo que
  convirtió una sospecha en un refactor. Cuenta.
- **Distingue duplicación de homonimia.** «Mismo nombre con valores distintos» **no** es
  «cadena repetida». El `CARD` con dos radios no era drift: eran dos cajas y a una le
  faltaba el nombre, y el radio mayor era jerarquía de anidamiento. Unificar habría roto el
  sistema. Antes de reportar drift, mira los usos y pregunta si los valores distintos
  significan algo distinto.

---

## Fase 2 — La matriz de propiedades (se recorre entera)

Por cada **tipo** de elemento, todas sus filas. Si una casilla no la decide una capa
(variante, clase de `globals.css`, primitiva de layout) sino el punto de uso, **eso es el
hallazgo**, aunque hoy todos los call sites coincidan por casualidad.

**Acción** (botón, enlace con forma de botón, chip, toggle, pestaña, control solo-icono):
variante · relleno · borde · radio · padding y altura · tamaño de texto y peso · **hover** ·
**focus-visible** · estado activo/`on` · disabled · suelo táctil 44×44 · **icono: si lo
lleva, cuál, tamaño, lado y quién lo decide** · transición y su `motion-reduce` · fondo de
reposo cuando la superficie de debajo cambia · contraste en reposo **y** en hover, en los
dos temas · comportamiento con la etiqueta más larga (ES suele ser más largo que EN).

**Enlace:** ¿es contenido o chrome? (la respuesta manda todo lo demás) · subrayado de reposo
y su offset · hover/focus · color en reposo y en interacción · métricas del área táctil.

**Caja / layout:** ¿sale de `layout.ts`? · radio y su lugar en la jerarquía de anidamiento ·
borde y fondo · ritmo vertical.

**Contenedor de controles — se revisa SIEMPRE que cambien las métricas de un control.**
No es una fila más de la matriz: es un paso obligatorio que se dispara desde otra. Cambiar el
padding, la altura o el icono de una variante **cambia el ancho de todo lo que la usa**, y la
caja que lo agrupa no se entera. Cuatro apariciones del mismo fallo: `DIALOG_ACTIONS` (tres
acciones pidiendo 496px en un diálogo de 462) · la tarjeta mono del Brand Kit (una pieza de
la fila dejó de salir del mismo componente) · los dos bloques de nota del Design System (dos
tarjetas a `--measure` en una sección a ancho completo) · el reparto 4 + 2, que **lo cazó
Francisco a ojo, no la skill**.

Las tres preguntas, en este orden:

1. **¿Sigue cabiendo la fila?** Con el copy **más largo de los dos idiomas** (ES suele ganar),
   al ancho real del contenedor, a 320px. Súmalo: `n × (padding + texto + icono + hueco)`.
   Que quepa hoy en tu ventana no es la comprobación.
2. **¿Siguen todas las piezas de la fila saliendo del mismo componente?** Una fila donde una
   tarjeta se escribió a mano se ve idéntica hasta que la variante cambia.
3. **¿El reparto de columnas sigue teniendo sentido con las piezas que hay AHORA?**
   `auto-fit` con el mismo `minmax` deja 4 + 2 cuando hay seis y una fila apretada cuando hay
   cuatro. Si un cambio añadió o quitó una pieza, el `minmax` se recalcula. Ese es el que se
   escapó cuatro veces.

**La razón de fondo, que vale para más cosas:** el sistema garantiza la pieza, no la
composición. Una capa de componentes hace que el control sea correcto **en aislamiento** —y
eso es exactamente lo que deja de mirarse cuando la revisión da la capa por buena.

**Icono propio:** las reglas de dibujo son `BRAND.md` §Iconos propios, empezando por la que
va antes que el lápiz (*¿lucide lo trae?*), siguiendo por el inventario —que es el `grep` de
`<svg>`, no el contenido de `icons.tsx`— y terminando en la verificación a tamaño real junto
a un lucide del mismo bloque. Lo que esta revisión añade y no está allí es **el metro
comparable**: no el atributo `stroke-width` sino el **grosor en píxeles**,
`stroke-width × (ancho renderizado / ancho del viewBox)`. La familia de este sitio pinta
**1,42–1,50px**; un glifo con trazo 3 a 15px pinta 1,88 y se sale de la familia sin que
ninguna revisión de código lo note. Es para la forma lo que el recorte de gamut es para el
color.

**Color, tipografía y superficies:** las reglas son `BRAND.md` §Color (dos capas, pasteles
nunca como primer plano), §Tipografía (Bricolage solo en h1–h4), §El atenuado lo pone la
superficie (D30/D39) y §Controles con dos fondos. Lo que se audita aquí no son esas reglas
sino **si alguien las ha escrito en el punto de uso**: un atenuado elegido a mano, un color
fijo en una pieza que se apoya en un fondo que cambia por tema **y** por estado, un `kicker`
que repite el título de su sección.

**Defectos de variable con fallback:** el valor por defecto tiene que ser el **caso
mayoritario**, no el neutro. `--icon-chrome-bg` defaulteaba a `transparent`, seis call sites
escribían `--card` a mano y el séptimo se olvidó: el LinkedIn del footer se quedó sin caja,
siendo la misma variante sobre la misma superficie que el toggle del nav (corolario de D35).

---

## Fase 3 — Verificación en pantalla

Con **`agent-browser`**, sobre el sitio **servido en local** —`npm run build && npm start`,
no `dev`: lo que se mide es el build de producción (D8/D13)— y sobre el **CSS servido**
cuando la duda es si una clase llegó a generarse. **Precondición:** el sandbox de Bash
desactivado, con su síntoma y su porqué en `CLAUDE.md` §Cómo se verifica (D51).

### Quién mide qué — y no se solapan

- **`viewport-verifier`** (subagente) hace **el barrido medible**: axe por tema con el motion
  congelado, la aritmética del pliegue de D50, el orden de lectura y los vitals, en su matriz
  de viewports. **Se le llama; no se reescribe aquí lo que él hace** — lleva escrito el
  método, incluido cuándo hay que volver a congelar (corregido el 2026-08-23), y devuelve
  hallazgos en vez del volcado, así que su salida no se come la sesión (D28).
- **Esta fase** hace lo que él no puede: **los estados que hay que provocar** y el **criterio
  de diseño**, que es lo suyo. Un subagente te dice que un par da 6,4; no te dice que el cian
  está compitiendo consigo mismo en un grupo de cuatro pestañas.

**Recorrido base:** **todas** las páginas de `lib/routes.ts` (`PAGE_SLUGS`) × ES/EN ×
claro/oscuro. **No se escribe cuántas son: se cuenta el registro** — esta línea ya caducó dos
veces por llevar la cifra escrita. Los deep-dive **son los que más falta hace mirar**: tienen
el único artefacto SVG del sitio, las dos únicas incrustaciones de vídeo y la única plantilla
que se repite cinco veces.

**Estados que hay que provocar a mano** (se caen del recorrido normal, y ahí estaban tres de
los cuatro hallazgos que originaron esta skill):

- **Diálogo de consentimiento** — sale solo, porque `agent-browser` conduce su propio Chrome
  con perfil limpio y no hay decisión previa que borrar. Provoca además el **panel de
  preferencias**, con su switch en los cuatro cruces (tema × encendido/apagado).
- **Hover y focus-visible** de cada control, y el foco por teclado recorriendo la página con
  `press Tab` (orden de lectura = orden del DOM). Aquí sí se pueden provocar de verdad:
  existen `hover <sel>`, `focus <sel>` y `press Tab`, y la pestaña está **en primer plano**,
  que es donde `:focus` funciona.
- **Nav en scroll** (split→flat) y **menú móvil abierto**.
- **Reveals antes de dispararse** y con `set media <tema> reduced-motion`.
- **Grupos de botones con el copy más largo** de los dos idiomas.
- **404 y 500**, y el toggle de tema en mitad de una animación.
- **`zoom 400%`** — **`agent-browser` no lo hace**: no tiene comando de zoom, y `set viewport`
  no es lo mismo (reflow sí, escalado de texto no). Es el único estado de esta lista que
  sigue necesitando un navegador de verdad. No lo des por comprobado si no lo has mirado ahí.

> **La excepción viva del perfil limpio:** `--profile Default` reutiliza la sesión de Chrome
> de Francisco, y ahí se escribe en su perfil real —`localStorage.theme` es su preferencia de
> tema; `flm-consent`, su decisión de privacidad guardada—. Se usa **solo** para entrar en una
> Preview de Vercel protegida; contra local no hace falta nunca.

### El censo de pares de contraste

**No se conduce a mano y no se reescribe: es `npm run censo`** (D85, D97), que recorre las
páginas del registro × los dos temas sobre el sitio servido, valida el metro en cada corrida
y falla si aparece un par de texto bajo AAA o un contorno de control bajo 3:1. Para **una**
página suelta, el script que hay detrás es `scripts/design-review/contrast-census.js`
—escrito a mano tres veces antes de quedarse ahí— y se inyecta con `agent-browser eval
--stdin`.

**Las reglas de medición ya están en contexto, y son de `BRAND.md`, no de aquí:** §Cómo se
hace el censo —recorriendo el DOM de la página servida, con los estados incluidos, porque un
par que solo aparece al **componer** no está en ningún inventario de tokens— y §Cómo medir
sin equivocarse, entera: los anclajes sin cian, el recorte de gamut, el color pintado, la
afordancia que también se mide, la clase que puede no estar aplicándose a nada, y el umbral
que lo decide el tamaño del texto.

Lo que esta revisión aporta encima es **el criterio, no el número**: por qué se llegó a ese
par, si el arreglo correcto es el color o la composición, y si subir el contraste apagó una
afordancia. Y una lectura que el censo no hace: **el `incomplete` de axe**, donde caen los
elementos con `color-mix` que axe no sabe resolver — ahí se escondía un par a 4,33:1 mientras
el informe decía «0 violaciones». `viewport-verifier` lo reporta; léelo, y no des por buena
una lista vacía sin mirar cuánto se ha medido.

**Gate de cierre:** los 8 puntos de accesibilidad de `CLAUDE.md` **con el método que ese
documento publica** — no lo repitas aquí. Un fallo puede ser **preexistente**: la auditoría
de P37.591 encontró tres, ninguno causado por la tanda que se estaba revisando.

---

## Fase 4 — Expresión de marca (la otra mitad)

El cumplimiento evita que el sistema se rompa; no hace que el sitio sea memorable. El
análisis del 2026-08-01 fue duro y sigue vigente: *«ejecución sobresaliente pero dentro de
un lenguaje muy de género»*. Preguntas, con evidencia contable, no impresiones:

- **Presencia del color.** ¿Cuántas veces aparece el morado en la home, y dónde? (al escribir
  esto: **dos** en ocho secciones). ¿El cian está en su papel de acción o se ha vuelto
  decoración — o al contrario?
- **Ritmo de secciones.** Cuenta los fondos: 6 de 8 secciones sobre `--background` con
  `border-t` es un ritmo plano. ¿Dónde respira? ¿Hay densidad variable o todo mide igual?
- **Gesto-firma.** ¿Hay **un** momento memorable, propio, que no esté en la plantilla del
  género? (el split del logo y el «0» del 404 son los candidatos existentes). Si no hay
  ninguno, dilo.
- **Motion con propósito.** Cada animación: ¿comunica algo —dirección, estado, jerarquía— o
  es decoración? ¿Respeta `prefers-reduced-motion`?
- **Minimal pero con marca donde aporta.** ¿Qué se reconocería de este sitio en una captura
  sin el logo?
- **Jerarquía y escaneo.** Los 5–10 segundos de RRHH: ¿el above the fold pasa el filtro?
  ¿Compiten dos elementos por el mismo protagonismo? (el caso `ContactSecondary`: dos hovers
  propios a 15px del CTA sólido).

Fuera de alcance: **el copy** (podría ser una skill hermana). Si un hallazgo visual solo se
arregla cambiando texto, señálalo y pásalo como tarea de Contenido.

---

## Salida

1. **Análisis escrito:** veredicto rápido → **fortalezas** (para calibrar) → hallazgos por
   severidad, cada uno con **evidencia** (cifra medida, conteo, o captura a tamaño real) y
   un **«¿por qué importa?»** → sección de coherencia entre documentos → **expresión de
   marca** → recomendaciones priorizadas, separando «para shippear» de «pulido».
2. **Distingue el síntoma de la causa.** El footer sin caja no era un problema del footer,
   era el defecto de la variante; el `CARD` con dos radios no era drift, era un nombre que
   faltaba. Se arregla la capa, no el call site.
3. **Propón antes de crear.** Preséntale a Francisco los hallazgos y las tareas sugeridas
   para que confirme, ajuste o descarte, y **mira el tablero antes: no dupliques lo tareado**.
4. **Crea las tareas acordadas** respetando las reglas del tablero de `CLAUDE.md` (Estado,
   MoSCoW, Prioridad con decimales para insertar, Área, Etapa, Versión, Tamaño).
5. **Si el hallazgo cambia una regla, se propaga a las cuatro fuentes en la misma tanda** —
   documento, implementación, página publicada y assets. Es lo único que impide el drift que
   esta skill busca.

## Relación con otros flujos

- `sprint-review` cubre lo **técnico** (código, escalabilidad, deuda, andamiaje); esta cubre
  el **diseño**. Se solapan en el drift docs↔código: si una ya lo reportó, la otra no repite.
- **`viewport-verifier`** (subagente, no skill) es **el instrumento de la Fase 3**, no un
  flujo paralelo: mide y reporta, no decide. Si alguna vez esta skill empieza a explicar cómo
  se corre axe, es que se ha copiado algo que debía llamar.
- `/code-review` revisa un diff; esta revisa el sitio publicado.
- `close-session` cierra la **documentación** de la sesión — al terminar una revisión de
  diseño con cambios, es el que se encarga de que las reglas nuevas queden escritas.
- **Disparo manual** por ahora, a diferencia de `sprint-review`. Se engancha al cierre de
  etapa cuando Francisco valide que encuentra cosas de verdad.

Tablero de tareas y su data source: ver «Referencias rápidas» del skill `close-session`.
