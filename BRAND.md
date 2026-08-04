# Sistema de marca

Reglas de identidad visual para este proyecto. Aplícalas siempre al generar UI.

## Stack

Next.js + TypeScript + Tailwind (v4) + shadcn/ui. Iconos: lucide-react.
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

     *Matizado 2026-08-04 (P37.55):* la regla de contenido decía antes "texto en `primary` siempre". Se sustituyó tras prototipar variantes en un Claude Artifact (con capturas de referencia de Francisco) y compararlas en vivo, en los dos temas: se prefirió reservar el cian para el momento de interacción en vez de tenerlo como color de texto permanente. H1 reutiliza el par de contraste ya verificado AAA de "texto sobre botón" (7,88:1 claro / 8,36:1 oscuro) en vez de inventar uno nuevo. Queda en reserva una segunda variante ("G": un garabato circular dibujado a mano alrededor de la palabra en hover, con el subrayado de reposo retrayéndose hacia el punto donde nace el trazo) para un uso puntual de énfasis — no es el estándar de todos los links de contenido.

     *Excepción 2026-08-04 (P37.55):* `ContactSecondary` (teléfono/LinkedIn/CV en la franja de contacto) son acciones, no navegación, así que por regla les tocaría H1 — pero llevan tratamiento de **chrome** (`.link-chrome`, sin subrayado) porque H1 ahí generaba ruido visual: subrayado permanente + un hover propio justo al lado del CTA sólido de email competían entre sí en vez de leerse como su acompañamiento. Es una excepción puntual a la regla de dos capas, no un tercer criterio — probablemente se resuelva de otra forma el día que exista una sección de contacto dedicada (hoy es una franja compartida entre home/Sobre mí/Accesibilidad, D29).

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

*Corregido 2026-08-04 (P37.596):* la regla del sólido decía «Hover = `bg-primary/90`», y el CTA insignia del sitio no la cumplía —usaba el `color-mix`—. El incumplidor tenía razón: `/90` **baja** el contraste del texto sobre el botón, mientras que mezclar hacia `--foreground` lo **sube** en ambos temas (en claro oscurece bajo texto hueso; en oscuro aclara bajo texto carbón). Medido: **7,88 → 8,59 en claro y 8,36 → 8,93 en oscuro**. Se corrigió la regla, no el botón, y ahora todos los sólidos lo heredan vía la variante `solid`.

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

- **`toggle-primary` — interruptor suelto.** Un único control que enciende o apaga algo que antes no estaba (el toggle de rejilla del Design System). No tiene pares al lado, así que el cian no compite con nada. Apagado = `border-primary` con **tinte** en hover (`bg-primary/10`), nunca el relleno: con el relleno, hover y encendido se verían igual y el control dejaría de comunicar en qué estado está.
- **`toggle-neutral` — grupo de alternativas excluyentes.** Varios botones de los que exactamente uno está activo, para elegir cómo mirar un contenido que ya está en pantalla (pestañas del Toolkit, tabs de dispositivo del Esqueleto navegable). Apagado = el mismo **outline neutro**, y ahí el hover **sí** puede ser la pastilla plena: `muted` no se parece en nada al cian del seleccionado, no hay ambigüedad que evitar. Es el mismo eje que separa contenido de chrome: en un bloque cuya función entera es elegir qué mirar, el cian no distingue nada — y multiplicado por tres o cuatro se come la sección.

*Fijado 2026-08-04 en tres pasadas.* En **P37.59** se detectó que los toggles del Design System no tenían hover y que ponerles el relleno los volvía indistinguibles del estado activo; la regla se escribió mirando solo `aria-pressed`, y por eso las **pestañas del Toolkit** (`aria-selected`) se quedaron fuera del sistema, sin hover en la seleccionada y con `secondary` en la inactiva. En **P37.592**, al meterlas, la fila pasó de un cian a cuatro y se comía la sección en oscuro → nace `toggle-neutral`. Y acto seguido se vio que los **tabs de dispositivo** seguían en cian por arrastre —P37.59 los había agrupado con el toggle de rejilla porque ambos usan `aria-pressed`, cuando uno es un interruptor y el otro un segmentado—. La primera redacción del criterio («¿quién es el protagonista?») falló al segundo caso que le tocó; por eso ahora mira la forma, que se comprueba de un vistazo.

### Controles con dos fondos: el color se toma del fondo, no se fija

Cuando una pieza se apoya sobre un fondo que **cambia por tema y por estado**, no vale elegirle un color: hay que derivarlo del fondo que tiene debajo. La bolita del switch de consentimiento es el caso de referencia — era `bg-white` fijo y fallaba el 3:1 de componente en dos de las cuatro combinaciones (1,22:1 en claro-apagado, 2,03:1 en oscuro-encendido), y **ningún token que conmute con el tema lo arreglaba**. La regla que sí funciona: la pieza es el `foreground` de su propio carril — `--foreground` sobre el carril apagado (`--muted`), `--primary-foreground` sobre el encendido (`--primary`). Da 12,47:1 / 12,04:1 y 7,88:1 / 8,36:1. *(P37.593; mismo patrón que `--contact-dim` y `--chrome-hover-bg`, ver D30.)*

### Ningún control se escribe a mano

**Ningún elemento interactivo —botón, enlace con forma de botón, chip, toggle, pestaña, control de icono— nace de una cadena de clases inline.** Si el caso no encaja en una variante, se **crea la variante**; si es una excepción, la decide Francisco y se **documenta con fecha** aquí (como `ContactSecondary` más arriba). No es burocracia: la auditoría de 2026-08-04 encontró **seis** definiciones distintas de «botón base» en seis archivos, dos radios, cuatro hovers para la misma variante y el suelo táctil de 44px reescrito catorce veces —del que el footer se había salido sin que nadie se enterara—, mientras `components/ui/button.tsx` llevaba desde el principio en el repo con cero usos.

El motivo de fondo, que conviene recordar antes de escribir la siguiente regla: los **enlaces** son coherentes porque hicieron el recorrido completo —regla → clase CSS → sección publicada en el Design System → uso— y por eso son difíciles de incumplir sin querer. Los **botones** se quedaron en el primer paso, y había que acordarse de ellos. Una regla que hay que recordar es una regla que se incumple.

2. **Tokens de marca** (`brand-cyan`, `brand-purple`, `brand-cyan-soft`, `brand-purple-soft`).
   - Son DECORATIVOS: fondos de sección, detalles, ilustración, gráficos.
   - `brand-*-soft` (los pasteles) son de bajo contraste: NO los uses como color de texto, de botón ni de cualquier elemento que deba leerse. Solo relleno decorativo.
   - `brand-cyan` manda; `brand-purple` es apoyo, con cuentagotas.
   - `brand-purple-accent` (oklch(0.62 0.16 290)): variante de `brand-purple` ajustada para servir como texto/acento legible en **secciones con fondo invertido** (fondo = `foreground`, texto = `background`), donde el `brand-purple` estándar no llega a AA de texto grande en ambas direcciones de tema. Úsalo solo ahí — como acento de texto grande (≥3:1, no como texto corrido ≥4.5:1) sobre esos fondos invertidos. Fuera de ese contexto, sigue usando `brand-purple`.

## Accesibilidad (no negociable)

- Todo texto y todo elemento interactivo debe cumplir WCAG AA (4.5:1 texto, 3:1 UI). **AA es el suelo, no el objetivo:** se empuja a AAA siempre que se pueda. Estado a **2026-08-04**, medido en navegador sobre los tokens tal como renderizan: texto principal 13,79:1 claro y 15,32:1 oscuro; `primary` como texto 7,43:1 y 8,36:1; texto sobre botón 7,88:1 y 8,36:1; hover del sólido 8,59:1 y 8,93:1; `muted-foreground` 7,12:1 y 7,08:1; bolita del switch 12,47/12,04 apagada y 7,88/8,36 encendida. **Todos los pares en reposo están en AAA en ambos temas.**

  **Una sola excepción, y es estructural:** el *hover* del `toggle-primary` apagado —texto `primary` sobre un velo del propio `primary` al 10%— da **6,30:1 en claro y 6,95:1 en oscuro**. AA holgado, pero no AAA. Bajar el velo no lo arregla (el techo sin velo es 7,43): pintar cian sobre cian nunca puede subir el contraste del cian. Se acepta a sabiendas y se documenta aquí en vez de redondear la cifra hacia arriba.
- Los pasteles (`*-soft`) no pasan contraste como primer plano. Si necesitas texto sobre un fondo pastel, usa `foreground` (gris/hueso), nunca otro pastel.
- Cian primario: `#005859` en claro y `#3FC9C4` en oscuro (ya resuelto en los tokens; no lo hardcodees).

  *Ajustado 2026-07-22:* el cian claro era `#0B7C7C`, que daba **4,53:1** como texto sobre el fondo — pasaba AA por 0,03. Aprobado raspado: cualquier retoque futuro del cian o del fondo lo tumbaba sin que nadie se enterase, y como botón estaba aún más justo (4,81:1). Al comparar las opciones se vio que llegar a AAA costaba un oscurecimiento **visualmente indistinguible**, así que quedarse en AA era dejar margen sobre la mesa por nada. `--brand-cyan` y `--ring` se mueven con él para que no queden dos cianes casi iguales con nombres distintos. **El `brand-cyan-split` del logo (#16BDBD) no se toca:** es otro token, no tiene requisito de contraste y la firma no se negocia.

  *Corregido 2026-08-04 (P37.598): aquel ajuste no llegó a AAA, y la web llevaba trece días publicando que sí.* El cian de julio se pintaba como `#005E5F` —el hex documentado **era el correcto**— pero eso da **6,86:1 como texto**, por debajo del umbral AAA de 7. La cifra publicada, 7,01:1, no era alcanzable con ese color: se calculó mal en su momento y viajó desde aquí a la página de Accesibilidad, al Design System y al Brand Kit. *(La de «texto sobre botón» sí estaba bien en `DECISIONS.md` D30, que decía 7,28:1 — el 7,44 de este documento era el equivocado.)*
  Se corrige bajando el token a `oklch(0.41 0.0886 194.82)`, que se pinta **`#005859`** y da **7,43:1 como texto y 7,88:1 sobre botón**. Es el mismo argumento de julio, ahora sí verificado: el oscurecimiento es visualmente indistinguible y devuelve el margen.

  **Cómo medir esto sin equivocarse**, porque en esta misma sesión me equivoqué dos veces antes de acertar:

  1. **Valida la herramienta contra pares ya publicados antes de creerte un hallazgo.** Texto principal y `muted-foreground` tienen que reproducir 13,79 / 15,32 / 7,12 / 7,08 **exactamente**. Si no lo hacen, el fallo es del método, no del color.
  2. **Los cianes de esta marca caen ligeramente fuera del gamut sRGB.** El navegador los recorta al pintarlos, así que `getComputedStyle` devuelve `color(srgb ...)` con **componentes negativas**. Leerlas sin recortar a [0,1] da un color que no existe en pantalla — fue justo lo que me hizo afirmar que el token rendía `#215e5f`. Recorta siempre, o lee el píxel de un `<canvas>`, que ya viene recortado.
  3. **La cifra se mide sobre el color que el navegador pinta**, nunca sobre el hex que uno cree tener ni sobre el valor nominal del `oklch`.

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
