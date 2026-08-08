# Sistema de marca

Reglas de identidad visual para este proyecto. Aplícalas siempre al generar UI.

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
   - **Enlaces: depende de si son contenido o chrome.**
     - **Contenido** (dentro del cuerpo de una sección, en medio del texto): en reposo, texto en `foreground` con subrayado fino en `primary` (2px, offset amplio para librar descendentes como "p"/"y"); en hover/focus, un relleno sólido en `primary` crece de abajo arriba y el texto pasa a `primary-foreground` — variante **H1**. El cian entra como recompensa de la interacción, no como color permanente del texto.
     - **Chrome de navegación** (nav, breadcrumb, footer, menús): `foreground` o `muted-foreground`, nunca `primary` — ni en el texto ni en el fondo de su estado hover. En un bloque cuya función *entera* es navegar, el cian no distingue nada: solo mete ruido. Se leen como enlace por su posición; el subrayado al pasar por encima o al recibir foco, y una pastilla de fondo `muted` en hover (variante **F**), bastan como afordancia — se probó una versión de F con wash de cian y no aportó diferencia sustancial, así que se descartó.

     *Matizado 2026-07-21:* la redacción anterior decía "botones, enlaces, foco y estados activos usan `primary`", sin distinguir. Producía un breadcrumb con "Inicio" en cian (#0B7C7C) justo debajo de un nav que ya usaba `foreground` (#21262B) para "Descargar CV" — dos elementos de chrome contiguos con criterios distintos, y el que se salía era el que seguía la regla al pie de la letra.

     *Matizado 2026-08-04 (P37.55):* la regla de contenido decía antes "texto en `primary` siempre". Se sustituyó tras prototipar variantes en un Claude Artifact (con capturas de referencia de Francisco) y compararlas en vivo, en los dos temas: se prefirió reservar el cian para el momento de interacción en vez de tenerlo como color de texto permanente. H1 reutiliza el par de contraste ya verificado AAA de "texto sobre botón" (7,93:1 claro / 8,36:1 oscuro) en vez de inventar uno nuevo. Queda en reserva una segunda variante ("G": un garabato circular dibujado a mano alrededor de la palabra en hover, con el subrayado de reposo retrayéndose hacia el punto donde nace el trazo) para un uso puntual de énfasis — no es el estándar de todos los links de contenido.

     *Excepción 2026-08-04 (P37.55):* `ContactSecondary` (teléfono/LinkedIn/CV en la franja de contacto) son acciones, no navegación, así que por regla les tocaría H1 — pero llevan tratamiento de **chrome** (`.link-chrome`, sin subrayado) porque H1 ahí generaba ruido visual: subrayado permanente + un hover propio justo al lado del CTA sólido de email competían entre sí en vez de leerse como su acompañamiento. Es una excepción puntual a la regla de dos capas, no un tercer criterio — probablemente se resuelva de otra forma el día que exista una sección de contacto dedicada (hoy es una franja compartida entre home/Sobre mí/Accesibilidad, D29).

     *Ampliada 2026-08-08 (P37.5987):* la **dirección de email visible** bajo el CTA en la página de Accesibilidad pasa a ser un `mailto:` —antes era texto plano— y entra en la misma excepción, por el mismo motivo y sin criterio nuevo: está a 15px del CTA sólido, que es exactamente la situación que la excepción describe. Lo que cambia no es la regla sino el alcance: el comentario que justificaba el texto plano explicaba por qué la dirección **se muestra**, no por qué **no era accionable** — respondía a otra pregunta, y la revisión lo dio por cerrado sin notarlo. Sigue escrita y copiable (que es lo que pedía el argumento original) y además se puede pulsar.

     - **Controles de chrome solo icono** (toggle de tema, hamburguesa, iconos de redes): la **misma pastilla** que el chrome con etiqueta (`.icon-chrome`), sobre el objetivo táctil de 44px completo. Un control sin texto necesita la misma afordancia que uno con etiqueta; si no, es lo único del chrome que no responde al cursor. *(Añadido 2026-08-04, P37.57: estos controles no tenían ningún estado hover.)*

## Jerarquía de hover en botones y CTA

> **Estas reglas no se escriben a mano.** Viven en `components/ui/action.tsx` (variantes
> `solid` · `outline-primary` · `outline-neutral` · `ghost` · `toggle-primary` ·
> `toggle-neutral` · `icon`), que es la única fuente del aspecto de todo elemento
> accionable. Lo de abajo explica **por qué** cada variante es como es; para aplicarlas,
> se usa la variante. Ver «Ningún control se escribe a mano» al final de esta sección.

- **CTA sólido** (`bg-primary`): la acción destacada de la página. Hover = el relleno se mezcla hacia `--foreground` (`color-mix(in srgb, var(--primary) 88%, var(--foreground))`). Hoy solo el email de la franja de contacto.
- **CTA outline-primary** (`border-primary` + `text-primary`): acciones de contenido que viven solas, sin otro CTA al lado con el que competir — «Descargar CV» de Trayectoria, «Gestionar preferencias» de Cookies, chips de descarga del Brand Kit. Hover = **el relleno cian pleno**, texto a `primary-foreground`.
- **Outline neutro** (`border-border` + `bg-background`): controles de utilidad y botones que conviven con un sólido dentro del mismo grupo (los del diálogo de consentimiento, «Repetir» del Design System). Hover = pastilla `muted`, nunca cian.

*Corregido 2026-08-04 (P37.596):* la regla del sólido decía «Hover = `bg-primary/90`», y el CTA insignia del sitio no la cumplía —usaba el `color-mix`—. El incumplidor tenía razón: `/90` **baja** el contraste del texto sobre el botón, mientras que mezclar hacia `--foreground` lo **sube** en ambos temas (en claro oscurece bajo texto hueso; en oscuro aclara bajo texto carbón). Medido: **7,93 → 8,64 en claro y 8,36 → 8,92 en oscuro**. Se corrigió la regla, no el botón, y ahora todos los sólidos lo heredan vía la variante `solid`.

> **Lo que este error enseña sobre los documentos, no sobre el botón.** La regla correcta
> ya estaba escrita desde el 2026-08-03 en `DECISIONS.md` **D30**, que dice textualmente
> que el hover del sólido *no* se hace con `bg-primary/90`. O sea: durante un día
> `BRAND.md` y `DECISIONS.md` **afirmaban lo contrario el uno del otro**, y el código
> seguía a uno de los dos. No fue un fallo de criterio sino de **propagación**: la
> decisión se registró donde se tomó y nadie cruzó los cuatro documentos de reglas
> (`BRAND.md` ↔ `globals.css` ↔ página Design System ↔ Brand Kit). Es el primer chequeo
> que debe hacer la revisión de diseño — antes de mirar un solo componente.

### Controles con estado (toggles, segmentados y pestañas)

En un control con estado el **relleno pleno ya significa «activo»**, así que el encendido reusa el sólido y el apagado nunca puede rellenarse igual. Cuál de las dos variantes toca se decide por la **forma** del control, no por su contenido ni por cuántos segmentos tenga:

- **`toggle-primary` — interruptor suelto.** Un único control que enciende o apaga algo que antes no estaba (el toggle de rejilla del Design System). No tiene pares al lado, así que el cian no compite con nada. Apagado = `border-primary` con **tinte** en hover (velo del propio `primary` al 8%), nunca el relleno: con el relleno, hover y encendido se verían igual y el control dejaría de comunicar en qué estado está. En ese hover el **texto** se mezcla además un 12% hacia `--foreground` —la misma constante del hover del sólido—, que es lo que sube el par a AAA sin apagar el velo (ver §Accesibilidad, P37.5985).
- **`toggle-neutral` — grupo de alternativas excluyentes.** Varios botones de los que exactamente uno está activo, para elegir cómo mirar un contenido que ya está en pantalla (pestañas del Toolkit, tabs de dispositivo del Esqueleto navegable). Apagado = el mismo **outline neutro**, y ahí el hover **sí** puede ser la pastilla plena: `muted` no se parece en nada al cian del seleccionado, no hay ambigüedad que evitar. Es el mismo eje que separa contenido de chrome: en un bloque cuya función entera es elegir qué mirar, el cian no distingue nada — y multiplicado por tres o cuatro se come la sección.

*Fijado 2026-08-04 en tres pasadas.* En **P37.59** se detectó que los toggles del Design System no tenían hover y que ponerles el relleno los volvía indistinguibles del estado activo; la regla se escribió mirando solo `aria-pressed`, y por eso las **pestañas del Toolkit** (`aria-selected`) se quedaron fuera del sistema, sin hover en la seleccionada y con `secondary` en la inactiva. En **P37.592**, al meterlas, la fila pasó de un cian a cuatro y se comía la sección en oscuro → nace `toggle-neutral`. Y acto seguido se vio que los **tabs de dispositivo** seguían en cian por arrastre —P37.59 los había agrupado con el toggle de rejilla porque ambos usan `aria-pressed`, cuando uno es un interruptor y el otro un segmentado—. La primera redacción del criterio («¿quién es el protagonista?») falló al segundo caso que le tocó; por eso ahora mira la forma, que se comprueba de un vistazo.

### Controles con dos fondos: el color se toma del fondo, no se fija

Cuando una pieza se apoya sobre un fondo que **cambia por tema y por estado**, no vale elegirle un color: hay que derivarlo del fondo que tiene debajo. La bolita del switch de consentimiento es el caso de referencia — era `bg-white` fijo y fallaba el 3:1 de componente en dos de las cuatro combinaciones (1,22:1 en claro-apagado, 2,03:1 en oscuro-encendido), y **ningún token que conmute con el tema lo arreglaba**. La regla que sí funciona: la pieza es el `foreground` de su propio carril — `--foreground` sobre el carril apagado (`--muted`), `--primary-foreground` sobre el encendido (`--primary`). Da 12,47:1 / 12,04:1 y 7,93:1 / 8,36:1. *(P37.593; mismo patrón que `--contact-dim` y `--chrome-hover-bg`, ver D30.)*

### Cuándo una acción lleva icono

**Una sola pregunta: ¿esta acción saca al usuario de la página?** Descargar un archivo, abrir otra aplicación (correo, teléfono) o irse a otro sitio web → **lleva icono**. Todo lo que ocurre dentro de la página —aceptar, guardar, cerrar, elegir en un grupo de pestañas, navegar por el sitio— → **no lo lleva**. El criterio mira la **acción**, no la variante ni el sitio donde vive: por eso «Descargar CV» lo lleva en sus tres apariciones (nav, Trayectoria, canales de contacto) y «Gestionar preferencias» no lo lleva en ninguna, porque abre un diálogo y no te lleva a ningún sitio.

- **Posición: delante de la etiqueta**, porque el icono clasifica la acción («descargar», «teléfono»). **Excepción por forma, no por caso: la variante `solid`**, donde va detrás y avanza 2px en hover — ahí no clasifica nada (es la única acción de la pantalla), marca la dirección del viaje.
- **Tamaño, hueco y lado no se escriben en el punto de uso.** Los pone la variante (`sm` 16 · `md` 17 · `lg` 18 · `icon` 18) y, en los canales de chrome, `.link-chrome svg`. En el call site se escribe `<Download />` y nada más — el icono va **siempre primero en el JSX** y es `solid` quien lo manda al otro lado.
- **Queda fuera el enlace de contenido inline** (`.link-content`): su afordancia es el subrayado, y un glifo en medio de un párrafo rompe la línea base.

*Fijado 2026-08-08 (P37.5988).* P37.592 unificó en `action.tsx` relleno, borde, radio, hover y suelo táctil, **pero el icono se quedó fuera de la variante** y cada punto de uso decidía por su cuenta si ponía uno, cuál, a qué tamaño y de qué lado. Resultado: el mismo «Descargar CV» pelado en el nav y con icono en Trayectoria y en contacto; dentro del **mismo panel** del Brand Kit, el chip de SVG con icono y los de PNG sin él; y `size-[15px]`, `size-[17px]` y `size-[18px]` para el mismo glifo repartidos por cinco archivos. El más revelador: el empujón de 2px vivía en una clase llamada `.contact-cta`, que se describía a sí misma como «propia de este CTA y de ningún otro» — así que **la demo de esa misma variante en el Design System enseñaba un botón que no existía en el sitio**. Es el patrón de siempre: una decisión que hay que recordar es una decisión que se incumple.

### Ningún control se escribe a mano

> **Caso particular de la «Regla de construcción» de `CLAUDE.md`** (2026-08-08), que
> generaliza esto a todo lo que se construye —secciones, páginas, bloques— y añade el
> paso de shadcn para widgets con estado, foco atrapado o portal. La cascada completa
> vive **solo allí**; aquí queda el porqué específico de los controles. No se copia:
> dos documentos afirmando la misma regla es exactamente lo que produjo el drift de
> cuatro días de §Jerarquía de hover.

**Ningún elemento interactivo —botón, enlace con forma de botón, chip, toggle, pestaña, control de icono— nace de una cadena de clases inline.** Si el caso no encaja en una variante, se **crea la variante**; si es una excepción, la decide Francisco y se **documenta con fecha** aquí (como `ContactSecondary` más arriba). No es burocracia: la auditoría de 2026-08-04 encontró **seis** definiciones distintas de «botón base» en seis archivos, dos radios, cuatro hovers para la misma variante y el suelo táctil de 44px reescrito catorce veces —del que el footer se había salido sin que nadie se enterara—, mientras `components/ui/button.tsx` llevaba desde el principio en el repo con cero usos.

El motivo de fondo, que conviene recordar antes de escribir la siguiente regla: los **enlaces** son coherentes porque hicieron el recorrido completo —regla → clase CSS → sección publicada en el Design System → uso— y por eso son difíciles de incumplir sin querer. Los **botones** se quedaron en el primer paso, y había que acordarse de ellos. Una regla que hay que recordar es una regla que se incumple.

**Excepción fechada 2026-08-08 (P37.5996): el switch del diálogo de consentimiento.** `consent-banner.tsx` dibuja su interruptor con una cadena inline (`peer-checked`, `after:`, anillo de foco) y es **el único elemento interactivo del sitio fuera de la capa de componentes**. Se queda así por dos razones: hay **un** switch en todo el sitio —no hay repetición que factorizar, y una pieza con un solo call site solo añade indirección—, y la cascada de la «Regla de construcción» mandaría traerlo de **shadcn** (paso 3: widget con estado), que **aplica hacia delante y no hacia atrás**.

*Actualizada 2026-08-08 (P37.63), que era su condición de salida.* La redacción anterior dejaba la excepción colgando de una decisión abierta: «sale en cuanto P37.63 fije de dónde vienen los widgets con estado». Ya está fijado —D6 reescrita— y el veredicto es que **este switch no se toca**: está bien hecho (`input[type=checkbox][role=switch]` real, con label asociada, 0 violaciones de axe) y la regla nueva no reescribe lo que funciona. Así que la excepción no caduca por ahí. Sale de ella cuando **aparezca un segundo switch** —entonces hay repetición que factorizar y el segundo se trae de shadcn, arrastrando al primero— o cuando este haya que rehacerlo por otro motivo.

Lo que **no** es excepción es su color: la regla de la bolita («es el `foreground` de su propio carril») está resuelta y documentada arriba, en §Controles con dos fondos. Anotarlo importa porque el hallazgo que abrió esto fue justo esa confusión — el comentario del componente justificaba el **color** y se leyó como si justificara la **excepción**, que es otra pregunta. Un comentario que explica algo no responde necesariamente a lo que estás preguntando.

2. **Tokens de marca** (`brand-cyan`, `brand-purple`, `brand-cyan-soft`, `brand-purple-soft`).
   - Son DECORATIVOS: fondos de sección, detalles, ilustración, gráficos.
   - `brand-*-soft` (los pasteles) son de bajo contraste: NO los uses como color de texto, de botón ni de cualquier elemento que deba leerse. Solo relleno decorativo.
   - `brand-cyan` manda; `brand-purple` es apoyo, con cuentagotas.
   - `brand-purple-accent` (oklch(0.62 0.16 290)): variante de `brand-purple` ajustada para servir como texto/acento legible en **secciones con fondo invertido** (fondo = `foreground`, texto = `background`), donde el `brand-purple` estándar no llega a AA de texto grande en ambas direcciones de tema. Úsalo solo ahí — como acento de texto grande (≥3:1, no como texto corrido ≥4.5:1) sobre esos fondos invertidos. Fuera de ese contexto, sigue usando `brand-purple`.

## Accesibilidad (no negociable)

- Todo texto y todo elemento interactivo debe cumplir WCAG AA (4.5:1 texto, 3:1 UI). **AA es el suelo, no el objetivo:** se empuja a AAA siempre que se pueda. Estado a **2026-08-04**, medido en navegador sobre los tokens tal como renderizan, claro / oscuro: texto principal 13,79 / 15,32; `primary` como texto 7,47 / 8,36; texto sobre botón 7,93 / 8,36; hover del sólido 8,64 / 8,92; hover del `toggle-primary` apagado 7,21 / 7,80; `muted-foreground` 7,10 / 7,12; bolita del switch 12,47 / 12,04 apagada y 7,93 / 8,36 encendida. **Todos los pares del sistema están en AAA en ambos temas, en reposo y en hover. Sin excepciones.**

  *Resuelta 2026-08-04 (P37.5985) la única que quedaba.* El hover del `toggle-primary` apagado —texto `primary` sobre un velo del propio `primary` al 10%— daba **6,35 claro / 6,98 oscuro**: AA holgado, pero no AAA. Bajar el alfa del velo no lo arregla, porque tiene techo asintótico: pintar cian sobre cian no puede subir el contraste del cian, y el máximo sin velo es 7,47. Tampoco lo arregla un velo neutro (`muted`), que era la vía que parecía más prometedora sobre el papel y al medirla resultó ser la peor —**6,76 / 6,57**, falla en los dos temas—: cian sobre gris contrasta menos que cian sobre el fondo.

  Lo que sí funciona es mover el **texto** en vez del velo, con la misma mezcla que ya usaba el hover del sólido: 12% hacia `--foreground`. Con el velo al 8% da **7,21 / 7,80**. Dos cosas que hacen que la solución sea sistémica y no un parche: reusa una constante que ya existía (88/12) en vez de inventar otra, y el velo sigue siendo **más perceptible que la pastilla `muted`** que usan el resto de controles (ΔL\* 4,7 frente a 3,9 en claro), así que el contraste no se compró a costa de la afordancia.
- Los pasteles (`*-soft`) no pasan contraste como primer plano. Si necesitas texto sobre un fondo pastel, usa `foreground` (gris/hueso), nunca otro pastel.
- Cian primario: `#005859` en claro y `#3FC9C4` en oscuro (ya resuelto en los tokens; no lo hardcodees).

  *Ajustado 2026-07-22:* el cian claro era `#0B7C7C`, que daba **4,53:1** como texto sobre el fondo — pasaba AA por 0,03. Aprobado raspado: cualquier retoque futuro del cian o del fondo lo tumbaba sin que nadie se enterase, y como botón estaba aún más justo (4,81:1). Al comparar las opciones se vio que llegar a AAA costaba un oscurecimiento **visualmente indistinguible**, así que quedarse en AA era dejar margen sobre la mesa por nada. `--brand-cyan` y `--ring` se mueven con él para que no queden dos cianes casi iguales con nombres distintos. **El `brand-cyan-split` del logo (#16BDBD) no se toca:** es otro token, no tiene requisito de contraste y la firma no se negocia.

  *Corregido 2026-08-04 (P37.598): aquel ajuste no llegó a AAA, y la web llevaba trece días publicando que sí.* El cian de julio se pintaba como `#005E5F` —el hex documentado **era el correcto**— pero eso da **6,86:1 como texto**, por debajo del umbral AAA de 7. La cifra publicada, 7,01:1, no era alcanzable con ese color: se calculó mal en su momento y viajó desde aquí a la página de Accesibilidad, al Design System y al Brand Kit. *(La de «texto sobre botón» sí estaba bien en `DECISIONS.md` D30, que decía 7,28:1 — el 7,44 de este documento era el equivocado.)*
  Se corrige bajando el token a `oklch(0.41 0.0886 194.82)`, que se pinta **`#005859`** y da **7,47:1 como texto y 7,93:1 sobre botón**. Es el mismo argumento de julio, ahora sí verificado: el oscurecimiento es visualmente indistinguible y devuelve el margen.

  *Afinado 2026-08-04 (P37.5985).* Aquel gate publicó 7,43 y 7,88 para este mismo token; medido de nuevo con el método de abajo, lo que el navegador pinta son **7,47 y 7,93** (y el hover del sólido 8,64 / 8,92, no 8,59 / 8,93). Son centésimas y ningún veredicto AAA cambia, pero es el segundo documento seguido en que una cifra publicada no coincide con la medida — de ahí que la validación del punto 1 no sea opcional.

  **Cómo medir esto sin equivocarse**, porque en esta misma sesión me equivoqué dos veces antes de acertar:

  1. **Valida la herramienta contra pares ya publicados antes de creerte un hallazgo.** Los anclajes son **texto principal (13,79 claro / 15,32 oscuro)** y **la bolita apagada del switch (12,47 / 12,04)**: son pares sin cian, así que no dependen del recorte de gamut y tienen que reproducirse exactos. Si no lo hacen, el fallo es del método, no del color. *(Los pares que llevan cian sirven mal de anclaje — son justo los que se han corregido dos veces.)*
  4. **La afordancia se mide también.** Subir contraste apagando un hover no es una mejora: es cambiar un incumplimiento por otro que no sale en el informe. Compara el ΔL\* del estado nuevo contra un hover que el sitio ya dé por bueno (la pastilla `muted`: 3,9 en claro, 9,0 en oscuro) antes de dar el cambio por cerrado.
  5. **Verifica la clase, no solo el color.** Tailwind escanea el código como texto plano: una clase construida por interpolación no se genera y el elemento se queda sin hover, sin error de compilación. La cifra puede ser perfecta sobre el papel y no estar aplicándose a nada. Mide sobre el elemento real, en su estado real.
  2. **Los cianes de esta marca caen ligeramente fuera del gamut sRGB.** El navegador los recorta al pintarlos, así que `getComputedStyle` devuelve `color(srgb ...)` con **componentes negativas**. Leerlas sin recortar a [0,1] da un color que no existe en pantalla — fue justo lo que me hizo afirmar que el token rendía `#215e5f`. Recorta siempre, o lee el píxel de un `<canvas>`, que ya viene recortado.
  3. **La cifra se mide sobre el color que el navegador pinta**, nunca sobre el hex que uno cree tener ni sobre el valor nominal del `oklch`.
  6. **Una cifra corregida se SUSTITUYE en todos los párrafos que la citan; no basta con anotarla al final.** Este documento pasó cuatro días afirmando 7,88 → 8,59 / 8,93 en §Jerarquía de hover mientras esta misma sección, más abajo, decía que lo medido era 7,93 → 8,64 / 8,92 — y las cuatro páginas publicadas llevaban ya las correctas. Lo encontró el primer disparo del skill `design-review` (2026-08-08), y la lección es la simétrica de la de julio: **el reglamento también se queda obsoleto**, y una nota fechada al pie no corrige el texto de arriba.

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

Los iconos del sitio son de **lucide-react**. Desde la v1.24 lucide no exporta iconos de marca (LinkedIn, GitHub…) por marca registrada, así que esos se dibujan a mano en `components/site/icons.tsx`. Un icono propio tiene que poder ponerse al lado de uno de lucide sin que se note cuál es cuál — y eso no sale de copiar los atributos del `<svg>`, que es justo lo que ya se hacía cuando el dibujo falló.

**Antes de dibujar: ¿lucide lo trae?** Si la respuesta es sí, no se dibuja — se importa. Un glifo propio se justifica **solo** por lo que lucide no exporta. Parece obvio y es la regla que más se ha incumplido: el 2026-08-08 había en el sitio **seis glifos dibujados a mano que lucide sí trae** (`check` —duplicado byte a byte en dos páginas—, `download`, `moon`, `menu`, `arrow-right`, `x`), y dos de ellos eran copias de los iconos reales del nav usadas en la demo que documenta ese mismo patrón, o sea que la demo podía divergir del nav sin que nadie se enterara.

- **Mismo artboard.** `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, trazo **2**, terminaciones y uniones **redondas**. Todas las coordenadas dentro de **2–22** (el área útil de 20×20 de lucide; el trazo desborda hasta 1 y 23). No hay que llenarla: `user` ocupa 16×20 y no se ve pequeño.
- **Nada se contornea por debajo de 8 unidades** (4× el trazo). Una forma más estrecha que eso se dibuja **con** el trazo, monolineal, en vez de rodearla con él. Lucide lo cumple sin excepción: su forma contorneada más estrecha es el disco del `sun`, que mide justo 8, y el borne del `battery` —que como contorno sería un saliente de 2— es una línea suelta.
- **Contraforma mínima 6 unidades de eje a eje** (3× el trazo, 4 de fondo limpio) entre trazos paralelos y en todo hueco que haya que leer. Es la rejilla de lucide: `menu`, `list` y `align-*` separan sus líneas exactamente 6. A 18px, 4 unidades son 3px de fondo — se ve; 2 son 1,5px — se rellena.
- **Los puntos son trazo, no círculos.** `M4 4h.01` con terminación redonda da un punto del diámetro exacto del trazo. Un `circle` de radio pequeño incumple la regla anterior por definición.
- **Se verifica en pantalla, no en el editor.** A tamaño real (17px en `.link-chrome`, 18px en la variante `icon`), dentro de su pastilla, **junto a un lucide del mismo bloque** y en los dos temas. Al 400% todos los dibujos se ven bien.
- **El inventario de glifos propios es el `grep` de `<svg>`** en `components/` y `app/`, no el contenido de `icons.tsx`. De ahí se descuentan el logo y las **ilustraciones** (maquetas de navegador, marcos de dispositivo, esqueletos, el «0» del 404), que son dibujos y no iconos. Lo que quede son iconos propios, vivan donde vivan — y **su sitio es `icons.tsx`**.
- **Si hay más de dos iconos propios**, publicarlos en el Brand Kit — el recorrido completo (regla → uso → página publicada) es lo que hace que una regla deje de depender de que alguien se acuerde.

  *Corregido 2026-08-08, en el primer disparo del skill `design-review`.* Esta regla llevaba cuatro días sin dispararse **teniendo siete iconos propios**, porque su condición se comprobaba leyendo `icons.tsx` —donde había uno— en vez de contando los que hay. Es el mismo defecto de forma que las cifras de contraste de §Accesibilidad: no fallaba el criterio, fallaba que **la condición no era medible en el sitio donde de verdad ocurre**. Una regla cuyo disparador mira al lugar equivocado no es una regla: es una nota.

*Fijado 2026-08-08 (P37.5989), al redibujar el de LinkedIn.* El original venía de lucide y tenía sus mismos atributos, pero metía **cinco carriles de 4 unidades en las 20 del área útil**: cada contraforma medía 2, o sea 1,5px a 18px. En el footer se leía como una mancha sólida al lado del sol y la luna. La «in» no cabe contorneada a este grosor —una barra legible pide 8 de ancho y no caben tres—, así que ahora se dibuja con el trazo: `M4 4h.01` · `M4 10v11` · `M12 21v-7a4 4 0 0 1 8 0v7`, con huecos de 6 (punto↔asta) y 8 (i↔n y contraforma de la n).

> **Sobre el metro, que es la parte reutilizable.** El primer candidato a norma fue la **densidad de tinta** (longitud del trazo × grosor sobre el artboard): el icono roto salía el más pesado de todos —36,3% frente a la banda de 14–32% de los lucide del sitio—, así que parecía explicado. Al validarlo contra un caso que ya damos por bueno, se cayó: **sobre su propia caja, `mail` pinta 45,8% y el icono roto 45,2%**, y `mail` se lee perfecto. La tinta describe el síntoma y sirve de sospecha; lo que decide es el **hueco más estrecho**. Es el mismo hábito que ya está escrito arriba para el contraste —valida la herramienta contra pares publicados antes de creerte un hallazgo—, aquí aplicado a una métrica de forma en vez de a una de color.
