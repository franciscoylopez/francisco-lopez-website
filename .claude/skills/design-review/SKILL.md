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

**De dónde sale este documento.** La auditoría del 2026-08-04 (P37.591) buscaba
incoherencias de CTA y encontró que entre los tokens y las páginas **no había capa de
componentes**: 6 definiciones de «botón base», 4 hovers para la misma variante, el suelo
táctil de 44px reescrito 14 veces. Ese hallazgo justificó la auditoría entera. Pero al día
siguiente del gate, **Francisco navegando el sitio cazó cuatro cosas que la auditoría había
dado por buenas** (P37.5986–P37.5989). No fueron cuatro despistes: fueron cuatro fallos de
método, y son la razón de ser de esta skill. Una revisión que se limite a hacer `grep` de
clases inline reproduce el mismo agujero.

## Principios — los cuatro fallos, en positivo

1. **La lista de propiedades es explícita y se recorre entera, aunque parezca redundante.**
   Del botón se revisó relleno, borde, radio, hover, foco y suelo táctil, y se declaró
   unificado. El **icono** no estaba en esa lista mental, así que nadie miró si lo lleva,
   cuál, a qué tamaño ni quién lo decide — seguía decidiéndose en cada punto de uso. Una
   lista implícita solo encuentra lo que ya sospechabas. Usa la **matriz de la Fase 2**.
2. **Se audita el píxel, no el código.** El icono propio de LinkedIn pasaba cualquier
   revisión de código —`viewBox` 24, `fill none`, `stroke` 2, idéntico a lucide— y en
   pantalla se leía como una mancha sólida al lado del sol y la luna, porque tenía huecos
   más estrechos que su propio trazo. Es **el mismo fallo** que el cian fuera de gamut
   (creerse el valor nominal en vez del color que el navegador pinta, `BRAND.md`
   §Accesibilidad): la lección se había aprendido para el color y no se generalizó. Todo
   veredicto visual se cierra **a tamaño real, en su contenedor real, junto a sus piezas
   hermanas, en los dos temas**.
3. **Se auditan las composiciones y los estados, no las piezas en reposo.** Migrar el botón
   a la variante cambió su padding y su altura; nadie volvió a mirar los **contenedores que
   agrupan botones**, y la fila de tres del diálogo de consentimiento dejó de caber.
   Agravante: ese diálogo solo se ve **provocándolo**, así que se cae del recorrido normal.
   Ver el **inventario de estados a provocar** (Fase 3).
4. **Una decisión documentada no es una decisión correcta.** El email de Accesibilidad sin
   `mailto:` tenía un comentario explicando el porqué y la revisión lo dio por cerrado —
   pero el comentario justificaba que la dirección **se muestre**, no que **no sea enlace**:
   respondía a otra pregunta. Ante un comentario o un ADR que justifica algo, comprueba que
   **responde a la pregunta que estás haciendo**.

Y tres más, heredados:

5. **Valida el metro antes de creerte el hallazgo.** Dos veces ha pasado: el medidor de
   contraste leyendo componentes fuera de gamut, y la «densidad de tinta» como norma de
   iconos —que acompañaba al caso roto y se cayó al contrastarla con `mail`, un caso que ya
   damos por bueno—. Antes de reportar una cifra, reprodúcela sobre **pares ya publicados**
   (anclajes de contraste: texto principal 13,79 / 15,32; bolita apagada del switch
   12,47 / 12,04 — pares sin cian, que no dependen del recorte de gamut).
6. **Calibra con lo que está bien.** Di también qué es sobresaliente, para no inventar
   problemas y para que las prioridades signifiquen algo.
7. **La señal de que el sistema se rompe no es que algo se vea mal: es que la misma decisión
   está escrita en dos sitios.** Busca duplicación de decisiones antes que fealdad.

---

## Fase 0 — Cruzar las cuatro fuentes (antes de mirar un solo componente)

`BRAND.md` estableció que este es el primer chequeo de la revisión de diseño, y por un
motivo concreto: durante un día `BRAND.md` y `DECISIONS.md` **afirmaban lo contrario el uno
del otro** sobre el hover del sólido, y el código seguía a uno de los dos. No fue un fallo
de criterio sino de **propagación**.

Las cuatro fuentes que tienen que decir lo mismo:

| Fuente | Archivo |
|---|---|
| Reglas de marca, en presente | `BRAND.md` (+ `BRAND-logo.md`, `DECISIONS.md` D30/D34/D35/D36/D38) |
| El **porqué** fechado de esas reglas | `BRAND-historical.md` — léelo antes de proponer cambiar una: casi todas nacieron corrigiendo algo |
| Implementación — lo que el navegador **pinta** | `app/globals.css` · las cinco capas de `components/ui/` |
| Valores **publicados** | `lib/design-values.ts` (D38) |
| Documentación publicada | página **Design System** (`components/site/design-system/` — una carpeta con un archivo por sección desde D42, no un `.tsx` suelto) |
| Assets publicados | página **Brand Kit** (`components/site/brand-kit/`, misma forma) |
| Cifras publicadas | página **Accesibilidad** (`components/site/accesibilidad.tsx`) |

Qué buscar:

- **Contradicciones entre documentos.** Una regla enunciada en uno y negada en otro. Si
  código y documento discrepan, **decide cuál tiene razón antes de corregir**: en P37.596 el
  incumplidor tenía razón y se corrigió la regla, no el botón.
- **Cifras publicadas que no se sostienen.** Toda cifra de contraste que el sitio publica se
  remide. Han viajado ya dos veces cifras equivocadas de un documento a los otros tres, una de
  ellas trece días en producción. **Desde D38 esto es más barato de comprobar y más grave si
  falla:** las páginas leen sus valores de `lib/design-values.ts`, así que una cifra publicada
  que no cuadre con la medición apunta a **un** sitio, no a cuatro — y una cifra escrita
  **fuera** de ese módulo (en el diccionario, en un comentario, en prosa) es hallazgo por sí
  sola, sin necesidad de medirla.
  **El drift también va al revés:** en el disparo del 2026-08-08 las cuatro páginas
  publicaban las cifras correctas y era `BRAND.md` el que llevaba las superadas, en dos
  párrafos que su propia §Accesibilidad corrige más abajo. Un documento puede contradecirse
  **consigo mismo**: cuando una corrección se escribe como nota fechada al final, los
  párrafos de arriba siguen afirmando lo viejo. Comprueba que la corrección **sustituyó** las
  cifras, no solo que las comentó.
- **Demos que enseñan algo que no existe.** El empujón de 2px vivía en una clase llamada
  `.contact-cta` «propia de este CTA y de ningún otro», así que la demo de esa variante en el
  Design System mostraba un botón que el sitio no tenía. Toda demo se compara con su uso real.
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

**Antes de leer un solo hit: separa UI real de ilustración.** Este sitio dibuja mucho —
maquetas de navegador, marcos de dispositivo, esqueletos, previsualizaciones de tema— y en
un dibujo las reglas del sistema **no aplican igual**: un radio de 1px o una altura de 36px
son correctos en una miniatura y absurdos en un control. Sin este filtro el barrido de
`rounded-`/`hover:` devuelve ~120 hits de los que la mayoría son trazos de un dibujo, y el
informe se vuelve ilegible. Pero el dibujo **no está exento de todo**: sigue prohibido que
copie valores de token a mano (fila «valores de token copiados»), porque ahí es donde una
corrección de color se queda sin propagar. Regla práctica: *¿esto se puede pulsar?* → sistema.
*¿esto representa algo que se puede pulsar?* → dibujo, y se juzga por si **miente**.

| Qué se busca | Patrón | Hits legítimos |
|---|---|---|
| Acciones sin variante | `<button`/`<a` con `className` que traiga `hover:` `rounded-` `border-` `px-` y **no** `actionVariants` | enlaces de contenido (`.link-content`) y de chrome (`.link-chrome`) |
| **Valores de token copiados a mano** | `oklch(` · `rgb(` · `#[0-9a-f]{6}` fuera de `globals.css`, sobre todo dentro de `style={{ }}` | solo `logo.tsx`. Los otros dos que necesitan la paleta *contraria* a la vigente —el mock de tema y `api/og`— consumen `PALETTE` (D38), y **`npm run check:palette` la coteja con `globals.css` en CI**. Un `oklch(` nuevo fuera de ahí es hallazgo |
| Suelo táctil a mano | `min-h-\[44px\]` · `min-w-\[44px\]` | `action.tsx` y `chrome.tsx`; nadie más |
| Radios y cajas a mano | `rounded-\[var\(--radius` · `max-w-\[var\(--container\)\]` · `border-t.*py-\[var\(--section-y\)\]` | `layout.ts`, `globals.css` |
| Hex en vez de token | `#[0-9a-fA-F]{6}` | `globals.css` y `logo.tsx`. **Búscalo también en el diccionario y en la prosa**: dos hexes falsos vivían en el pie de las tarjetas del mock de tema, como texto, y los destapó una captura tomada para otra cosa (P37.6605). Nadie los contaba como copias de un token porque no pintan nada — y ninguna herramienta compara un párrafo con el píxel que tiene al lado |
| Iconos dimensionados en el call site | `size-\[1[0-9]px\]` sobre `svg` | `action.tsx`, `.link-chrome svg` en `globals.css` |
| Foco compitiendo | `outline-none` · `focus:` sin `focus-visible:` | ninguno (el foco es una sola regla global) |
| Motion sin escape | `transition`/`animate-` sin `motion-reduce` ni `prefers-reduced-motion` cerca | los que lo declaran en `globals.css` |
| **Clases interpoladas** | `className={\`` con `${` dentro de una utilidad | ninguno, nunca |
| Inventario de controles con estado | `aria-pressed` · `aria-selected` · `role="tab"` | — |
| **Inventario de glifos dibujados a mano** | `<svg` en todo `components/` y `app/`, **no** una lectura de `icons.tsx` | ilustraciones y maquetas; el logo |
| Pasteles como primer plano | `brand-(cyan\|purple)-soft` en `text-`/`border-` | solo relleno decorativo |

**La clase interpolada merece su propia línea.** Tailwind escanea el código como texto
plano: una utilidad construida por interpolación no se genera, el elemento se queda sin
hover **sin error de compilación**, y solo se detecta midiendo el color pintado. Ya tumbó a
la vez el hover del sólido y el del toggle.

**Las cinco capas que hoy existen** (D36), y de las que tiene que salir todo. Si un hit no
sale de una de ellas, es hallazgo:

| Capa | Archivo | Qué manda |
|---|---|---|
| Acción | `components/ui/action.tsx` | el control **con caja**: botón, chip, toggle, pestaña, control de icono |
| Chrome | `components/ui/chrome.tsx` | el enlace de la **carpintería de navegación** (`shape` × `tone`) |
| Etiqueta | `components/ui/badge.tsx` | el rótulo que **no se pulsa** (`tone` × `kind`) |
| Cabecera | `components/ui/heading.tsx` | el par **eyebrow + titular**, con su hueco |
| Layout | `components/ui/layout.ts` | cajas y ritmos (`WRAP`/`SECTION`/`CARD`/`PANEL`/`PAIR`) |

Cuál toca se decide con **dos preguntas** —¿se pulsa? y, si sí, ¿tiene caja propia?—, no por
parecido. Y **dónde va lo nuevo** con una tercera: ¿la pieza sabe algo de ESTE sitio (copy,
rutas, datos)? No → `ui/`. Sí → `site/`.

> Las tres últimas nacieron entre el 2026-08-08 y el 09, y las tres las destapó una versión
> anterior de esta skill listándolas aquí como «capas que todavía no existen». **Si al correr
> la skill encuentras una familia de piezas que se repite sin capa propia, escríbela aquí con
> su conteo**: es el formato que ya ha funcionado tres veces.

**Valores publicados: no se leen del diccionario.** Desde D38 los tokens de layout, los
breakpoints, el censo de contraste y la paleta viven en `lib/design-values.ts`, y `npm run
check:palette` verifica en CI que coinciden con `globals.css`. Dos consecuencias para el
barrido: una cifra o un hex **escrito en el diccionario (`dictionaries/{es,en}/*.json`) es hallazgo** (la prueba es
literal — si la entrada ES y la EN son carácter por carácter la misma, no es copy), y **el
`grep` de hex ya no tiene hits legítimos** fuera de `globals.css` y `logo.tsx`.

Y dos comprobaciones que no son grep:

- **Repite el conteo, no lo estimes.** «Seis definiciones en seis archivos», «catorce veces
  el suelo táctil», «WRAP idéntico en dieciocho sitios»: los números concretos son lo que
  convirtió una sospecha en un refactor. Cuenta.
- **Distingue duplicación de homonimia.** «Mismo nombre con valores distintos» **no** es
  «cadena repetida». El `CARD` con dos radios no era drift: eran dos cajas y una no sabía
  que lo era, y el radio mayor era jerarquía de anidamiento. Unificar los valores habría
  roto el sistema — **faltaba un nombre, no una corrección**. Antes de reportar drift, mira
  los usos y pregunta si los valores distintos significan algo distinto.

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
No es una fila más de la matriz: es un paso obligatorio que se dispara desde otra. Cambiar
el padding, la altura o el icono de una variante **cambia el ancho de todo lo que la usa**,
y la caja que lo agrupa no se entera. Cuatro apariciones del mismo fallo:

| Caso | Qué pasó |
|---|---|
| `DIALOG_ACTIONS` (P37.5986) | migrar el botón lo engordó 33,6px; las tres acciones pedían 496px en un diálogo de 462 y la tercera caía sola a otra línea |
| Tarjeta mono del Brand Kit (P37.61) | una tarjeta de la fila dejó de salir del mismo componente que sus hermanas |
| Los dos bloques de nota del Design System (P37.62) | dos tarjetas a `--measure` dentro de una sección a ancho completo → media pantalla vacía |
| Reparto 4 + 2 (2026-08-08) | tras arreglar la anterior, en la fila de cuatro los chips saltaban de línea. **Lo cazó Francisco a ojo, no la skill** |

Las tres preguntas, en este orden:

1. **¿Sigue cabiendo la fila?** Con el copy **más largo de los dos idiomas** (ES suele ganar),
   al ancho real del contenedor, a 320px. Súmalo: `n × (padding + texto + icono + hueco)`.
   Que quepa hoy en tu ventana no es la comprobación.
2. **¿Siguen todas las piezas de la fila saliendo del mismo componente?** Una fila donde una
   tarjeta se escribió a mano se ve idéntica hasta que la variante cambia.
3. **¿El reparto de columnas sigue teniendo sentido con las piezas que hay AHORA?** El número
   de columnas se elige por cuántas piezas hay, no por defecto: `auto-fit` con el mismo
   `minmax` deja 4 + 2 cuando hay seis y una fila apretada cuando hay cuatro. Si un cambio
   añadió o quitó una pieza, el `minmax` se recalcula. Ese es el que se escapó cuatro veces.

**La razón de fondo, que vale para más cosas:** el sistema garantiza la pieza, no la
composición. Una capa de componentes hace que el control sea correcto **en aislamiento** —y
eso es exactamente lo que deja de mirarse cuando la revisión da la capa por buena.

**Icono propio:** artboard 24 y coordenadas en 2–22 · trazo 2, terminaciones redondas ·
**nada contorneado por debajo de 8 unidades** · **contraforma mínima de 6** en todo hueco que
haya que leer · puntos dibujados con trazo, no `circle` · verificado a tamaño real **junto a
un lucide del mismo bloque**. Y tres preguntas que van antes que el dibujo:

1. **¿Lucide lo trae?** Si sí, no se dibuja: se importa. Un glifo propio se justifica solo
   por lo que lucide no exporta (hoy, iconos de marca).
2. **¿Cuántos hay en total?** El inventario es el **grep de `<svg`**, no el contenido de
   `icons.tsx`. La regla «si algún día hay más de dos iconos propios, publicarlos en el Brand
   Kit» nunca se disparó porque asumía que los propios viven en ese archivo, y el disparo del
   2026-08-08 encontró **seis más repartidos en cuatro archivos** — uno de ellos duplicado
   byte a byte en dos páginas.
3. **¿Cuánto trazo pinta?** El metro comparable no es el atributo `stroke-width` sino el
   **grosor en píxeles**: `stroke-width × (ancho renderizado / ancho del viewBox)`. La familia
   de este sitio pinta **1,42–1,50px** (lucide a 17 y 18px, el LinkedIn propio y la flecha de
   páginas hermanas, todos dentro de la banda). Un glifo con trazo 3 a 15px pinta 1,88 y se
   sale de la familia sin que ninguna revisión de código lo note. Es el equivalente para
   forma de lo que el recorte de gamut es para color: **la cifra se mide sobre lo pintado**.

**Color y tipografía:** solo tokens · regla de dos capas (cian = única acción, morado
decorativo) · pasteles nunca como primer plano · texto atenuado sobre fondos que no son
`--background` **recalculado, no reusado** (D30) · Bricolage solo en h1–h4, Inter en texto y
labels · `kicker` que no repita el título de su sección.

**Superficies invertidas o de doble fondo:** la pieza es el `foreground` de su propio carril,
no un color elegido (la bolita del switch, P37.593). Si una pieza se apoya en un fondo que
cambia por tema **y** por estado, ninguna constante lo arregla.

**Defectos de variable con fallback:** el valor por defecto tiene que ser el **caso
mayoritario**, no el neutro. `--icon-chrome-bg` defaulteaba a `transparent`, seis call sites
escribían `--card` a mano y el séptimo se olvidó: el LinkedIn del footer se quedó sin caja,
siendo la misma variante sobre la misma superficie que el toggle del nav (corolario de D35).

---

## Fase 3 — Verificación en pantalla

*(Migrada el 2026-08-16, D52. Antes: `claude-in-chrome` sobre el navegador de Francisco, con
anchos sueltos y sin altos.)*

Con **`agent-browser`**, sobre el sitio **servido en local** —`npm run build && npm start`, no
`dev`: lo que se mide es el build de producción (D8/D13)— y sobre el **CSS servido** cuando la
duda es si una clase llegó a generarse.

**Precondición:** `agent-browser` se conduce con el **sandbox de Bash desactivado**
(`dangerouslyDisableSandbox: true`). Bajo el sandbox no llega al daemon **ningún** comando, ni
con la página ya cargada; sin él funciona todo, navegación incluida. Un comando que cuelga es
ese síntoma: **no lo reintentes igual**, repítelo sin sandbox. *(Corregido el 2026-08-17;
antes pedía abrir la URL desde la terminal. D51.)*

### Quién mide qué — y no se solapan

- **`viewport-verifier`** (subagente) hace **el barrido medible**: axe por tema con el motion
  congelado, la aritmética del pliegue de D50, el orden de lectura y los vitals, en su matriz
  de viewports. **Se le llama; no se reescribe aquí lo que él hace** — y devuelve hallazgos en
  vez del volcado, así que su salida no se come la sesión (D28).
- **Esta fase** hace lo que él no puede: **los estados que hay que provocar** y el **criterio de
  diseño**, que es lo suyo. Un subagente te dice que un par da 6,4; no te dice que el cian está
  compitiendo consigo mismo en un grupo de cuatro pestañas.
- **El censo de pares de abajo se queda aquí**, porque es el **porqué** de las seis reglas del
  script. `viewport-verifier` solo lo dispara, y solo si el trabajo introdujo un par nuevo.

> **Lo que ya no hay que vigilar, y conviene saber por qué desapareció.** Hasta el 2026-08-16
> esta fase abría con un aviso: *el navegador es el de Francisco, no un entorno de pruebas* —
> provocar los estados escribía en su perfil real (`localStorage.theme` es su preferencia de
> tema; `flm-consent`, su **decisión de privacidad guardada**), así que había que ir en
> incógnito, anotar valores y restaurarlos. `agent-browser` conduce **su propio Chrome con
> perfil limpio**: el aviso **deja de hacer falta en vez de tener que cumplirse**.
>
> Dos regalos de paso. El **diálogo de consentimiento sale solo**, porque no hay decisión
> previa que borrar — era el estado más caro de provocar y ahora es el estado por defecto. Y el
> tema se fija con `set media`, sin recargar y sin el falso positivo de conmutarlo en caliente
> (D30).
>
> **La excepción viva:** `--profile Default` reutiliza la sesión de Chrome de Francisco, y ahí
> vuelve el aviso entero. Se usa **solo** si hay que entrar en una Preview de Vercel protegida;
> contra local no hace falta nunca.

**Recorrido base:** las **doce** páginas × ES/EN × claro/oscuro. Eran seis hasta el 2026-08-18;
el deep-dive añadió cinco experiencias y su índice, y **son las que más falta hace mirar**:
tienen el único artefacto SVG del sitio, las dos únicas incrustaciones de vídeo y la única
plantilla que se repite cinco veces. Un recorrido que se quede en seis no las ve.

> **El número no se escribe: se saca de donde ya está.** La lista viva son las rutas de
> `scripts/page-html-diff.ts`, que el gate mantiene al día porque una página nueva sin entrada
> ahí es una página sin gate. Si al leerlas no cuadran con lo que dice este párrafo, manda el
> script — y actualiza esta frase, que es lo que no pasó entre agosto y hoy.

Y **el viewport lleva alto**, que es justo lo que faltaba: una lista de anchos no puede ver el
caso de D50, donde el ancho es el de siempre y **lo que cambia es el alto**.

| Viewport | Qué representa |
|---|---|
| `1920 1080` | escritorio sin escalar |
| `1536 740` | 1920 con el escalado de Windows al **125%** ← el caso de D50 |
| `1280 618` | 1920 al **150%** |
| `768 1024` | tablet |
| `390 844` | móvil |
| `320 568` | el móvil pequeño, que es donde revienta el copy largo |

```bash
agent-browser set viewport 1536 740
agent-browser set media dark
agent-browser set media light reduced-motion
```

**Estados que hay que provocar a mano** (se caen del recorrido normal, y ahí estaban tres de
los cuatro hallazgos):

- **Diálogo de consentimiento** — sale solo con perfil limpio. Provoca además el **panel de
  preferencias**, con su switch en los cuatro cruces (tema × encendido/apagado).
- **Hover y focus-visible** de cada control, y el foco por teclado recorriendo la página con
  `press Tab` (orden de lectura = orden del DOM). **Aquí sí se pueden provocar de verdad**:
  existen `hover <sel>`, `focus <sel>` y `press Tab`, y la pestaña está **en primer plano**, que
  es donde `:focus` funciona y donde `claude-in-chrome` no llegaba. *Lo que esto puede hacer
  innecesario —el truco de leer las declaraciones `:hover` del CSS, regla 2 del censo— **no se
  da por bueno hasta comprobarlo**: se compara contra un par ya publicado antes de cambiar el
  método.*
- **Nav en scroll** (split→flat) y **menú móvil abierto**.
- **Reveals antes de dispararse** y con `set media <tema> reduced-motion`.
- **Grupos de botones con el copy más largo** de los dos idiomas.
- **404 y 500**, y el toggle de tema en mitad de una animación.
- **`zoom 400%`** — **`agent-browser` no lo hace**: no tiene comando de zoom, y `set viewport`
  no es lo mismo (reflow sí, escalado de texto no). Es el único estado de esta lista que sigue
  necesitando un navegador de verdad. No lo des por comprobado si no lo has mirado ahí.

### El censo de pares de contraste

**Se recorre el DOM de la página servida. No se lee `globals.css`, ni la tabla publicada.**

Es el punto que más ha costado: las auditorías de 2026-08-04 y 2026-08-08 firmaron un «todos
los pares en AAA, sin excepciones» que era falso, y se les escaparon **tres** —etiqueta
neutra 6,44/5,56, etiqueta teñida 6,07/5,46, hover del chrome secundario 6,44/5,56—. Los tres
por la misma razón, y no fue descuido: **un par que solo aparece al COMPONER** —un velo
`color-mix` sobre la superficie de debajo, o una pastilla de hover— **no está en ningún
inventario de tokens**, así que un censo hecho leyendo el CSS no puede encontrarlo por muy
cuidadoso que sea. Es el defecto de forma de siempre: el disparador miraba al sitio
equivocado.

**El script está escrito: `scripts/design-review/contrast-census.js`.** Se inyecta en la
página cargada y devuelve el censo ordenado por **holgura contra el umbral de cada par**, con
los que no llegan a AAA (`bajoAAA`) y los que no llegan ni a AA (`bajoAA`). Se escribió a
mano tres veces antes de quedarse ahí; no lo reescribas.

```bash
agent-browser eval --stdin < scripts/design-review/contrast-census.js
agent-browser eval "JSON.stringify(window.contrastCensus())"
```

Seis reglas, y las seis costaron un error:

1. **Cada elemento con texto sobre un fondo propio es un par**, exista o no un token con ese
   nombre.
2. **Incluye los estados**, no solo el reposo. El hover no se simula —no sobrevive entre
   llamadas—: se **leen las declaraciones reales** de las reglas `:hover` y se aplican a un
   clon. Y hay que **bajar por las reglas de grupo**: Tailwind v4 envuelve sus utilidades
   `hover:` en `@media (hover: hover)`, y un bucle plano sobre `cssRules` las salta enteras.
   Con ese fallo el censo daba **6,42** para el hover del chrome secundario —veía la pastilla
   y no el texto subiendo a `foreground`, que es la mitad que lo arregla— y habría reportado
   como hallazgo un par que está en 12,47.
3. **El fondo efectivo se compone subiendo por la cadena de padres** hasta el primer
   `background-color` opaco, y los alfas se componen encima (D30 punto 2). Leer un `color-mix`
   con `transparent` sin componer da una cifra falsa y optimista.
4. **Contrasta el número de pares del DOM con el de filas de la tabla publicada** en el Design
   System. Si el DOM tiene más, la tabla está incompleta — que es literalmente lo que pasaba.
5. **Valida el medidor contra los anclajes SIN cian** antes de creerte nada: texto principal
   13,79 claro / 15,32 oscuro, exactos. Son pares que no dependen del recorte de gamut. Si no
   salen, el fallo es del medidor (ver la regla 2: ya pasó).
6. **El umbral lo decide el TAMAÑO del texto, no la lista.** WCAG llama grande a ≥24px, o
   ≥18,66px con peso ≥700, y ahí AAA es 4,5 y AA es 3. Puntuarlo todo contra 7:1 hizo que el
   PRD publicara **cuatro pares incumpliendo cuando era uno**: los otros tres eran «Aa» de
   24px, y dos cumplían de sobra (5,21 y 6,57). *Un umbral mal aplicado inventa hallazgos
   igual que un metro mal calibrado* (D41). El script ya lo hace desde P37.6595 —cada fila
   lleva su `px`, su `peso`, su `umbralAAA` y su `holgura`—, y por eso **se ordena por holgura
   y no por ratio**: con umbrales mixtos, la cifra más baja ya no es el peor par.

> **Y lee el `incomplete` de axe, no solo el `violations`.** Descubierto el 2026-08-09
> disparando el script: axe **no sabe resolver `color-mix()`**, así que mete esos elementos en
> `incomplete` y se abstiene de juzgarlos. En el Design System son **ocho**, y ahí estaba un
> par a **4,33:1 en oscuro** —por debajo de AA— mientras el informe decía «0 violaciones».
> Todas las auditorías anteriores leyeron solo `violations`. Es el mismo agujero que el resto
> de este apartado, ahora en la herramienta: **lo que la máquina no puede ver no aparece como
> problema, aparece como silencio.**

> **Y congela las transiciones ANTES de lanzar axe**, con el `window.freezeMotion()` que
> exporta el mismo script. Conmutar el tema y medir sin congelar da **siete violaciones
> fantasma** (`#005859` sobre `#191d21`) con la página perfecta: es el tema a medio
> interpolar. El censo lo hace por dentro desde siempre; axe no puede saberlo solo.
>
> Con `agent-browser` son tres llamadas, porque `a11y` corre axe **por su cuenta** y no puede
> envolverlo en el `freezeMotion` como hacía la versión inyectada:
>
> ```bash
> agent-browser eval "window.__unfreeze = window.freezeMotion(); 'frozen'"
> agent-browser a11y --tags wcag2a,wcag2aa --json
> agent-browser eval "window.__unfreeze(); 'thawed'"
> ```
>
> **Y esperar «un poco más» no sustituye a congelar:** `.link-content` tarda 380 ms, así que
> cualquier espera prudente de 300-400 ms cae justo dentro de la interpolación.

**Medición:** contraste sobre el color que el navegador pinta, recortando a [0,1] o leyendo
el píxel de un `<canvas>` — los cianes de esta marca caen fuera de sRGB. Además, **la
afordancia se mide**: subir contraste apagando un hover no es una mejora. Compara el ΔL\*
del estado nuevo con un hover que el sitio ya dé por bueno (pastilla `muted`: 3,9 claro /
9,0 oscuro).

**Gate de cierre:** los 8 puntos de accesibilidad de `CLAUDE.md` **con el método que ese
documento publica** — no lo repitas aquí; desde el 2026-08-16 es `agent-browser` conducido por
el subagente `viewport-verifier`, con dos disparos y matriz de viewport (D52). Un fallo aquí
puede ser **preexistente**: la auditoría de P37.591 encontró tres, ninguno causado por la
tanda que se estaba revisando.

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
3. **Propón antes de crear.** Preséntale a Francisco los hallazgos y la lista de tareas
   sugeridas para que confirme, ajuste o descarte. Consulta el tablero primero: **no
   dupliques** lo ya tareado (hoy están abiertas, entre otras, la presencia del morado
   P37.85 y el gesto-firma P37.84).
4. **Crea las tareas acordadas** respetando las reglas del tablero de `CLAUDE.md` (Estado,
   MoSCoW, Prioridad con decimales para insertar, Área, Etapa, Versión, Tamaño).
5. **Si el hallazgo cambia una regla, se propaga a las cuatro fuentes en la misma tanda** —
   documento, implementación, página publicada y assets. Es lo único que impide el drift que
   esta skill busca.

## Relación con otros flujos

- `sprint-review` cubre lo **técnico** (código, escalabilidad, deuda, andamiaje); esta cubre
  el **diseño**. Se solapan en el drift docs↔código: si una ya lo reportó, la otra no repite.
- **`viewport-verifier`** (subagente, no skill) es **el instrumento de la Fase 3**, no un flujo
  paralelo: mide y reporta, no decide. Se le llama desde aquí para el barrido medible; el
  criterio de diseño y los estados a mano se quedan en esta skill. Si alguna vez esta skill
  empieza a explicar cómo se corre axe, es que se ha copiado algo que debía llamar.
- `/code-review` revisa un diff; esta revisa el sitio publicado.
- `close-session` cierra la **documentación** de la sesión — al terminar una revisión de
  diseño con cambios, es el que se encarga de que las reglas nuevas queden escritas.
- **Disparo manual** por ahora, a diferencia de `sprint-review`. Se engancha al cierre de
  etapa cuando Francisco valide que encuentra cosas de verdad.

Tablero de tareas y su data source: ver «Referencias rápidas» del skill `close-session`.
