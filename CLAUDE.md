@AGENTS.md
@BRAND.md
@PRD-Live.md

# Eficiencia de sesión y arquitectura de contexto

> **Principio rector: reglas → en contexto siempre; historia y detalle exhaustivo → a demanda (grep/Read).** Es la misma distinción que separa `PRD-Live.md` (`@`-importado) de `PRD-Historical.md` (a demanda). El coste de tokens de una sesión lo domina lo que se `@`-importa en cada arranque; por eso solo se precargan las **reglas activas**, no el registro histórico.

## Régimen de docs (qué se carga y qué se consulta)

- **`@`-importados (siempre en contexto):** `AGENTS.md`, `BRAND.md` (core de reglas), `PRD-Live.md`, y este `CLAUDE.md`.
- **A demanda (Read/Grep cuando la tarea lo pide, NUNCA `@`-importar):** `DECISIONS.md` (registro técnico), `PRD-Historical.md` (histórico de producto), **`BRAND-historical.md` (el porqué fechado de las reglas de marca)**, `BRAND-logo.md` (enciclopedia del logo).
- **Y cómo se consultan, que es lo que hace barata esa mitad:** los tres primeros llevan índice derivado **en su propia cabecera**, así que no cuestan nada en el arranque (D88). Se abren con un `Read` limitado a sus primeras líneas —130 en `DECISIONS.md`, 90 en los históricos— y solo después se va a la sección. Grepear a ciegas un archivo de decenas de miles de palabras es el fallo que el índice existe para evitar.
- **Convención de mitigación:** antes de tocar un subsistema con ADR, `grep`/Read de su D-entry en `DECISIONS.md` — así no se pierde ninguna regla, solo deja de estar precargada. *(Cuándo leer `BRAND-historical.md` lo dice la cabecera de `BRAND.md`, que es donde estás cuando vas a cambiar una regla de marca.)*

## Modelo por tarea

Tabla de modelo por defecto según el trabajo. **Convención:** al empezar un bloque, coteja el tipo de tarea con esta tabla y **avisa a nivel de bloque/sesión** (no por micro-tarea) — «esto lo haría en Sonnet, ¿cambias con `/model`?». Cambiar de modelo mantiene la conversación. Es la palanca de menor ROI por fricción: mantenerla ligera, sin conmutación por micro-tarea.

| Trabajo | Modelo |
|---|---|
| Diseño de sección, arquitectura, decisiones de marca/producto, sprint-review, copy ES↔EN (es criterio, D20) | **Opus** |
| Tablero de Notion, cableado de componentes, refactors mecánicos, actualización de docs, regenerar CV | **Sonnet** |
| Tareas triviales/repetitivas sin criterio | **Haiku** |

Micro-tarea mecánica dentro de una sesión Opus → delegar a un subagente con modelo barato **solo si es "chunky"** (el arranque en frío no compensa para un one-liner).

## Higiene de sesión

- **Lecturas dirigidas:** preferir Grep / Read con `offset`/`limit` sobre leer archivos enteros — sobre todo `PRD-Historical.md` (~30k tok) y `DECISIONS.md`. Para una decisión concreta, `grep` del D-número, no cargar el archivo.
- **Una sesión por bloque coherente;** `/clear` entre tareas no relacionadas para no arrastrar historial/tool-outputs acumulados.
- **No re-leer tras editar** (el harness ya rastrea el estado del archivo).
- **Concisión por defecto:** liderar con la respuesta, cortar preámbulos y recaps, tablas/bullets sobre párrafos; extenderse cuando se pida.
- **Disciplina de alcance:** hacer lo pedido, **señalar** lo adyacente, dejar que Francisco decida — no construir de más.

# Seguimiento de tareas (Notion)

Las tareas de desarrollo viven en la base de datos "Tareas — Web personal" en Notion: https://app.notion.com/p/f3ee9a949c58482888423d5917087962 (al mismo nivel que el PRD, dentro de "New Website").

Al empezar una sesión de desarrollo:
1. Lee las tareas con Estado "To-Do" del sprint activo, ordenadas por `Prioridad` ascendente.
2. Trabájalas en ese orden, respetando las dependencias señaladas en `Notas` de cada tarea.
3. Actualiza el `Estado` en Notion según avances: "To-Do" → "En progreso" al empezar, "Listo" al terminar.
4. Si una tarea deja de tener sentido tal como está definida (cambia el alcance, se descubre que depende de algo no resuelto, etc.), dilo antes de marcarla "Listo" — no la des por completada a medias.

**El cuerpo de una tarea NO sale en la consulta SQL, que solo devuelve propiedades.** Y el cuerpo es donde viven el porqué medido, las tablas y las dependencias. Al retomar una tarea se abre con `fetch`; listarla no basta.

## Reglas del tablero (no negociables)

> **Sin fechas.** Lo que dirige la ejecución es `MoSCoW` + `Prioridad` (orden) + `Tamaño`, no el calendario. Donde abajo diga "sprint", léase **"etapa"**.

> **`Etapa` contesta una sola pregunta: ¿esto está comprometido o esperando?** Dos familias en el mismo campo (y **vigila que «General» no se coma el eje**: ya degeneró una vez con «Optimización» al 80%):
>
> - **Sprints** (lo comprometido, con su orden): *Footer y contacto*.
> - **Bloques** (backlog temático, aún no comprometido): *General · Home · Brand Kit · Design System · Accesibilidad · Cómo se ha creado*.
> - **`General` significa TRANSVERSAL, no «no sé dónde ponerla».** Higiene de CI, dependencias, docs y proceso: cosas que no son de ninguna página. Si una tarea es de una página o de una capa concreta, va a su bloque.
> - **Cerradas** (solo archivadas, no se usan para tareas nuevas): las que el tablero ya no lista como sprint ni como bloque. **Los «Método» no se vuelven bloque:** no tienen página, y su deuda es transversal (*General*).
> - **Un sprint que cierra no se archiva: se convierte en su BLOQUE** *(2026-08-22)*. Su página sigue viva y va a generar deuda, y esa deuda es de ella, no transversal.
>
> **Regla de movimiento: una tarea de deuda nace en su bloque y cambia de `Etapa` al sprint cuando se compromete** — porque desbloquea algo de ese sprint, o porque toca los mismos archivos y sale gratis hacerla de paso. Es lo que hace que un sprint arrastre deuda con criterio en vez de por lote. El coste asumido: al entrar en un sprint se pierde de qué bloque venía; lo llevan el nombre y las notas, y añadir una séptima propiedad sería peor.

> **A `General` no lo drena ningún sprint, así que se drena por CUPO.** La regla de movimiento vale para los bloques de página porque antes o después un sprint los toca; `General` es transversal, así que no lo toca nada. **Cada sprint arrastra 3-4 tareas de `General`** —las que no piden criterio, por `Prioridad`— dentro del propio sprint, y **una revisión no cierra dejando en `General` más tareas nuevas de las que ese cupo va a sacar**. Si las deja, la revisión no ha terminado: falta decidir qué se retira.

> **`Versión` ≠ `Etapa`.** La etapa dice *cuándo se hace*; la versión, *en qué release sale*. Desde el 2026-08-10: **V2** = los tres sprints de arriba · **V3** = la deuda y mejoras por bloque · **V4** = la IA conversacional. Ver `PRD-Live.md` §9.

- **"To-Do", "En progreso" y "Blocked" están reservados al sprint activo.** Toda tarea de un sprint futuro va en **"Sin empezar"**, sin excepción. Al abrir un sprint nuevo, sus tareas pasan de "Sin empezar" a "To-Do"; al cerrarlo, lo que quede sin hacer se mueve al siguiente sprint y vuelve a "Sin empezar".
- **`Prioridad` es un orden global de ejecución, no una etiqueta de importancia.** Números bajos = antes. Debe ser coherente con el orden de sprints: todo lo del sprint 1 va por delante de todo lo del 2, y así sucesivamente. Dentro de cada sprint, ordena por dependencia — primero lo que desbloquea a otras tareas.
- Las tareas cerradas conservan su prioridad histórica (por debajo de 10); las abiertas van de 10 en adelante. **Para insertar una o varias tareas sueltas, usar decimales es correcto** (ej. `11.5` entre `11` y `12`). **Solo se renumera el bloque abierto entero cuando hay una reestructuración completa de prioridades**, no por inserciones puntuales.
- **`Versión` refleja en qué release sale la tarea de verdad, no dónde se planificó.** Si una tarea se construye antes del deploy de V1, es V1 — aunque en su día se pospusiera a V2.
- **Una tarea a la vez, en su orden de prioridad, con el `Estado` al día — nada de construir por delante del tablero.** Antes de tocar código, la tarea correspondiente se pone en "En progreso"; al terminarla, "Listo". No se salta una tarea de prioridad menor (número más bajo) para empezar otra posterior, aunque compartan trabajo. Si un mismo esfuerzo cubre varias tareas (p. ej. el build de la home repartido en 2-3 tareas de secciones), se **abren y se cierran una a una** conforme se avanza, no en bloque al final.
- **"Listo" es solo del sprint activo.** Al cerrar, sus tareas terminadas pasan a "Archivado" (siguen en la base, salen de las columnas activas) y lo que quede sin hacer va al siguiente sprint como "Sin empezar" — **salvo el carril de contenido, que no pertenece a ningún sprint y por tanto no se barre** (ver abajo). El ritual completo de cierre, con las dos revisiones que dispara, está en «Gestión de etapas».

### Gestión de etapas — cuándo se cierra una, y las dos revisiones que dispara

Sin fechas, la **etapa en curso** es el sprint de menor `Prioridad` con tareas abiertas. Se trabaja **una etapa a la vez**, en orden, **pero en dos carriles**: el *build* (técnico/diseño/dev) avanza una etapa cada vez; el *contenido* que solo escribe Francisco corre **en paralelo, por delante**, para desbloquear las secciones futuras. Por eso `To-Do`/`En progreso` cubren la **etapa de build activa** *y* el **carril de contenido en marcha**; todo lo demás —sprints futuros y bloques— va en `Sin empezar`.

**El carril de contenido es lo que impide que un sprint abra bloqueado**, y ya se barrió una vez: el cierre **no lo toca**, y **abrir un sprint empieza comprobando que su tarea de contenido no sigue sin empezar**. Si lo está, esa es la primera tarea, no la de build.

Una etapa **se cierra** cuando todas sus tareas están en Listo/Archivado, o cuando Francisco lo declara ("cerramos Cimientos"). Al cerrarla: (1) se dispara el skill **`sprint-review`** (revisión técnica crítica), (2) sus tareas en Listo pasan a **Archivado**, (3) se hace el **check de medición** (ver abajo) y (4) **antes de abrir el siguiente** se dispara **`method-review`**, que audita cómo se trabaja. Va en ese hueco y no al cerrar porque **el andamiaje hay que ponerlo antes de que existan las cosas que tiene que sostener**, no después. "Listo" queda solo para lo terminado de la etapa en curso.

### Metodología de trabajo (fase V2+)

- **Contenido primero** en secciones bloqueadas por contenido (Sobre mí, Accesibilidad): el texto es el cuello de botella real y solo lo escribe Francisco. Desbloquear el contenido **antes o en paralelo** al diseño/dev; Claude puede redactar un borrador editable (como el CV o Sobre mí) para arrancarlo.
- **Bucle medir→aprender.** Al cerrar cada etapa, revisar los números de GA4 (clics de contacto, descargas de CV, scroll) para informar la priorización. Construir **y** medir — es lo que predica la web ("del discovery al dato").
- **Definition of Done por sección.** Cada tarea de sección hereda el checklist de cierre, al final de este archivo.
- **Revisión con IA en los PR grandes.** Sin segundo revisor humano, usa `/code-review` (o ultrareview) en cambios sustanciales como segundo par de ojos.
- **Shippear vs. pulir.** La columna «Pulido» de la DoD **no bloquea el envío**: nace fuera del sprint, en su bloque de V3. Que las secciones salgan en vez de dorarse.

# Fase de desarrollo — convenciones (V1 build)

Las **decisiones** técnicas viven en `DECISIONS.md` (fuente de verdad, solo en el repo). Esto son las **reglas** que aplican al escribir código, no negociables salvo que una decisión nueva las cambie.

- **Registro de decisiones.** Producto/diseño/alcance → **estado** en `PRD-Live.md` (spec viva, la que se `@`-importa; solo repo) y **registro histórico** de decisiones en `PRD-Historical.md` (solo repo). Técnica transversal → `DECISIONS.md` (solo repo; **sin espejo en Notion**; **consultado a demanda vía Read/Grep, NO `@`-importado** — ver «Eficiencia de sesión y arquitectura de contexto» arriba). Convenciones → este archivo. `README.md` → entrada al repo (qué es, stack, arranque, estructura, mapa de docs), **mantenido al día conforme evoluciona el proyecto** — no es un one-off del lanzamiento: al añadir capacidades, o cambiar stack/estructura/scripts, se actualiza. "Por qué" del código → mensaje de commit/PR. Progreso por tarea → notas de Notion (actualiza `Estado` al empezar y al cerrar).
- **Cierre de sesión.** Cuando Francisco indique que se cierra la sesión ("cerramos sesión por ahora", "lo dejamos por hoy" o similar), invoca el skill `close-session`: revisa qué documentación toca actualizar y hazlo — `PRD-Live.md`, `PRD-Historical.md` y `DECISIONS.md`, `README.md`, el tablero de tareas y, si aplica, `CLAUDE.md`/`BRAND.md`. Es la red de seguridad para que nada quede sin documentar.
- **i18n desde la primera línea.** Cero strings hardcodeados: todo texto sale del diccionario tipado. Locale en `app/[lang]/`, ES sin prefijo (`/`), EN en `/en`. Enrutado en `proxy.ts` (Next 16), no `middleware.ts`. Nombrar assets con locale cuando aplique. El diccionario está **partido por página** en `app/[lang]/dictionaries/{es,en}/` —`common` + una rama por página— y cada página carga la suya (D48). **El diccionario ES es la fuente de verdad del copy; el EN se revisa contra el ES (no traducción literal)** — y, como regla de redacción de ambos, el `kicker`/`eyebrow` de una sección no repite su título (ej. no "Design system / Design System").
- **En el copy del sitio no se usa la raya (`—`)** *(2026-08-18)*. Es una señal visual de texto escrito por IA y casi nunca dice nada que no diga un signo más corto. **Dos puntos** cuando lo que sigue explica lo anterior · **coma** cuando solo continúa · **punto** cuando ya era otra frase · **paréntesis** cuando el inciso lleva comas dentro (con comas se confundiría con la enumeración) · **`·`** solo cuando de verdad separa dos etiquetas (`Nav · al cargar`) · **guion con espacios** en un rango de fechas (`2019 - 2026`), porque ahí el `·` ya es el separador de campos y `2019 · 2026 · 5 hitos` son tres campos donde había dos.
  **Dos excepciones, y solo dos:** el **ordinal de una cabecera** (`01 — Rejilla`), que es la convención de D43 y no prosa, y la **celda «no aplica»** de una tabla (la raya sola), que es su signo tipográfico. **Lo comprueba `npm run check:raya` en CI**, así que esto no hay que recordarlo — pero sí saberlo al escribir. No mira comentarios de código ni los `.md` del repo: es una regla del copy que se sirve, no del estilo de escribir documentación.
- **Server por defecto.** `"use client"` solo en islas interactivas (nav, reveals, contadores, tabs, toggle de tema, preview de dispositivo). Todo lo demás, Server Component.
- **Responsive en CSS/Tailwind**, no en JS. Breakpoints alineados con Tailwind (sm 640 / md 768 / lg 1024 / xl 1280). El contenido apila en móvil; nada de `matchMedia` para maquetar.
- **Tokens, no hex.** Solo tokens de `app/globals.css` (`brand-globals.css` está deprecado). Respeta la regla de dos capas de `BRAND.md`: `primary` (cian) es el único color de acción; el morado es decorativo. Nunca inventes colores.
- **Una sola notación por token: la utilidad.** En Tailwind v4 el token del `@theme` **es** quien genera la utilidad, así que `rounded-lg` y `rounded-[var(--radius-lg)]` compilan a lo mismo y `rounded-[14px]` es el mismo valor congelado. Se escribe la **utilidad** (`rounded-md` · `bg-primary` · `text-muted-foreground`), nunca la sintaxis de escape `[var(--token)]` cuando existe utilidad, y nunca el px literal si coincide con un valor del sistema. *(P37.5996: el mismo radio estaba escrito de tres formas.)*
  **Excepción: las ilustraciones.** Dentro de los dibujos a escala —marcos de dispositivo, esqueletos, el navegador de mentira del Brand Kit, el «0» del 404— los radios son coordenadas del dibujo y se quedan en px, aunque alguno coincida con un valor del sistema. Tokenizarlos es el refactor equivocado: harían crecer el trazo de una maqueta al cambiar `--radius`.
- **Objetivos no funcionales** (criterios de aceptación, no aspiraciones): PageSpeed/Lighthouse >90; desktop **y** mobile optimizados; accesibilidad AA de suelo, empujar AAA. `next/image` para imágenes, `next/font` para fuentes, minimizar JS de cliente.
- **SEO y datos estructurados por página — criterio de cierre, no un extra.** Igual que el performance, la accesibilidad y el responsive, **al crear una página nueva** hay que resolver su SEO: metadata (title, description, `canonical`, `hreflang`, OG y Twitter por locale) **y el marcado JSON-LD de Schema.org que le corresponda por tipo** — p. ej. `BreadcrumbList` en páginas internas, enriquecer `Person`/`ProfilePage` en la home. Verificarlo con el **Schema Markup Validator** (tipos no elegibles para rich results, como `Person`) **y** la **Rich Results Test** (tipos elegibles, como `BreadcrumbList`), en ES y EN. URLs absolutas vía `SITE_URL` (`lib/site.ts`). Ver `DECISIONS.md` D14/D15.

## Regla de construcción — nada nuevo se escribe a mano

> Aplica a **todo lo que se construye**: una sección, una página, un bloque, un control. La regla de `BRAND.md` («ningún control nace de una cadena de clases inline») es el caso particular de esta.

Antes de escribir markup nuevo, la cascada, en orden:

1. **¿Existe ya la pieza?** — **la lista es `components/ui/README.md`**, derivada del disco por `npm run indices`: una línea por archivo con qué resuelve, a qué grupo pertenece y en qué sección se publica. **Ábrelo, no lo supongas** — esta lista estaba escrita a mano en cinco sitios y ninguno acertaba (D89). Cuentan también los bloques ya montados de `components/site/`. → **Se usa.** No se replica su aspecto con clases sueltas. **Cuál de las tres capas interactivas toca se decide con dos preguntas: ¿se pulsa?** (no → etiqueta) **y ¿tiene caja propia?** (sí → acción, no → chrome). Un chip que solo rotula no es un botón pequeño, y un enlace de nav tampoco (D36). **Dónde va lo nuevo:** ¿la pieza sabe algo de ESTE sitio (copy, rutas, datos, secciones)? No → `ui/`. Sí → `site/` (D36).
2. **¿No existe, pero el caso es del sistema?** → **Se crea la variante, no el caso.** Un botón que no encaja en ninguna variante no es un botón especial: es una variante que falta. Igual con un bloque que se va a repetir.
3. **¿Es un widget con estado, foco atrapado o portal** (diálogo, popover, tooltip, combobox, menú, tabs, scroll-area)? → **¿shadcn lo trae? → no se escribe.** Se trae con `npx shadcn@latest add <componente>` (estilo `base-nova`, ya configurado en `components.json`) y se le aplican nuestros tokens. El comportamiento de teclado y foco no se escribe a mano. *(Misma forma que la regla de iconos: «¿lucide lo trae? → no se dibuja».)* **Aplica hacia delante, no hacia atrás:** los widgets que hoy están a mano —el `<dialog>` nativo del consentimiento y su switch, las pestañas del Toolkit y los tabs de dispositivo del Design System— están bien hechos y no tienen deuda de accesibilidad; no se reescriben por cumplir la regla. Ver `DECISIONS.md` D6.
4. **¿Nada de lo anterior encaja?** → Lo decide Francisco y se **documenta con fecha** en `BRAND.md`.

**Señal de alarma:** si estás escribiendo una cadena de más de ~4 clases utilitarias para algo accionable, o para una caja que aparece más de una vez, estás en el paso 1 sin haberlo mirado.

**Al cerrar:** si el trabajo creó una variante o un bloque nuevo (paso 2), **se publica en el Design System antes de dar la tarea por hecha**, y eso lo lleva la skill `publicar-en-design-system` — que existe porque esta regla llevaba meses escrita y se incumplió dos veces (D89). El recorrido completo —regla → componente → sección publicada → uso— es lo que hace que los enlaces sean difíciles de incumplir y lo que a los botones les faltaba.

### Qué compra esto: la accesibilidad se hereda, no se vuelve a medir

De los 8 puntos de abajo, la pieza ya trae **1, 2, 3 y 7** (contraste, foco, 44px, `reduced-motion`): lo que se comprueba es que **se heredaron**, y **en pantalla, no leyendo el JSX** — una clase puede no estar aplicándose a nada sin dar error de compilación (`BRAND.md` §Accesibilidad, punto 5). Del resto —**4, 5, 6 y 8**, que los pone quien escribe la página, no el componente— **solo el 6 se verifica a mano**.

Quién mira cada punto, y cuándo hay que volver a medir, lo dice la tabla de la **Definition of Done** al final de este archivo. No se lleva en la cabeza y no se repite aquí.

## Checklist de accesibilidad — gate de cierre de cada página/sección

Antes de dar por cerrada una página o sección, verificar los 8 puntos (es la lista que publica el propio Design System del sitio) — con la rebaja que permite la regla de construcción de arriba cuando todo sale de piezas existentes:

1. **Contraste medido, con cifra, en ambos temas.** AA es el suelo; AAA siempre que se alcance sin coste visual. Verificar también los estados interactivos (hover/focus), no solo el reposo.
2. **Foco visible:** anillo de 2px con `var(--ring)` y offset de 2px en todo elemento interactivo. Nunca `outline:none` sin sustituto.
3. **Objetivos táctiles ≥ 44×44px**, también en controles pequeños (breadcrumb, toggle de tema).
4. **Un solo `h1` por página** y jerarquía `h2`–`h4` sin saltos. El orden de lectura = el orden del DOM.
5. **Breadcrumb** en toda página interna: `<nav aria-label>`, lista ordenada, `aria-current="page"` en el nivel actual.
6. **Nada codificado solo por color:** todo estado/categoría distinguido por color lleva además texto o forma.
7. **`prefers-reduced-motion`** respetado en toda animación (reveals, contadores, transición del nav).
8. **Alternativas textuales:** `alt` y etiquetas donde informan, `aria-hidden` en lo decorativo.

### Cómo se verifica


Sobre el sitio **servido**, con **`agent-browser`** —Chrome propio en primer plano, donde `:focus`, el LCP, `rAF` y el `IntersectionObserver` sí funcionan— y **conducido por el subagente `viewport-verifier`**, que ya lleva la matriz (cuatro viewports × dos temas + `reduced-motion`), congela el motion antes de medir y devuelve **hallazgos, no el volcado**. No se conduce a mano.

- **Se dispara dos veces, y la primera no es al cerrar** (D50/D52). Si la sección lleva banda o hero dimensionado por `vw`, también **mientras se dibuja**: el eje que faltaba no era el tema, era el **alto**. Al cerrar, el resto del checklist.
- **Precondición:** `agent-browser` se conduce con el **sandbox de Bash desactivado**. No es solo la navegación: bajo el sandbox **ningún** comando llega al daemon, ni con la página ya cargada. Un comando que cuelga es ese síntoma —se desactiva el sandbox, no se reintenta ni se abre la URL desde la terminal—. (D51.)
- **Lo que sigue a mano:** el punto **6** (nada codificado solo por color) y la **nota de PageSpeed** (`npm run psi`, no `vitals`). Lo demás lo cubren `check:marco` en CI y `npm run censo` fuera de ella; **qué garantiza cada uno lo dice `PRD-Live.md` §Cómo se verifica**, no esta lista.
- **La pasada completa de contraste es `npm run censo`**, con el sitio construido y servido (D85). **Tras ella**, y no al cerrar una página: actualizar `LAST_A11Y_REVIEW` en `lib/design-values.ts`, la fecha que publica `/accesibilidad` (D38). El **recuento de páginas** no se toca: sale de `PAGE_COUNT`.

# Definition of Done

> **Es una tabla porque un gate que depende de acordarse no es un gate.** Los cuatro que
> fallaron por esa vía están cada uno en su entrada: D54, D60, D63.

**Se aplica a toda tarea que cree o rehaga una página, una sección o un bloque.** No a
refactors internos, config ni docs. Se pega en el cuerpo de la tarea de Notion al ponerla
«En progreso», y se marca al cerrarla.

## Columna A — bloquea el envío

| # | Comprobación | Cómo |
|---|---|---|
| 1 | **Sale de las piezas, no de clases sueltas** | La cascada de la «Regla de construcción». Si hubo que crear variante, se publica en el Design System con la skill `publicar-en-design-system` antes de dar por hecha la tarea, y `check:indices` la nombra si no |
| 2 | **Accesibilidad de contenido**: un solo `h1` y jerarquía sin saltos · breadcrumb · nada codificado solo por color · alternativas textuales | `npm run check:marco` en CI para los puntos 4, 5 y 8 (D75). A mano solo el **6**, que no tiene forma automática |
| 3 | **Accesibilidad heredada**: contraste, foco, 44px, `reduced-motion` | `viewport-verifier` (D52). **Solo se vuelve a MEDIR** si el trabajo introduce un par de color nuevo, un fondo que no sea `--background` o una animación propia — y **esa condición ya no hay que leerla**: `check:palette` compara contra el sello del último censo y sale rojo nombrando lo que apareció (D90) |
| 4 | **Enlace de salto** | `npm run check:marco`: axe no lo detecta, y por eso lo mira él (D46/D75) |
| 5 | **Pliegue**, si lleva banda o hero por `vw` | `viewport-verifier` **mientras se dibuja**, no al cerrar (D50/D52) |
| 6 | **SEO + JSON-LD** del tipo que le toca, ES y EN | `pageMetadata` lo deriva y `check:marco` comprueba que llegó, con los `@id` resueltos (D75). Se verifica a mano el **tipo nuevo** si lo hay, con el Schema Markup Validator |
| 7 | **Copy**: ES fuente de verdad, EN revisado contra el ES, sin raya | D20 · `npm run check:raya` |
| 8 | **Interfaz mecánica**: estados vacíos, desbordamiento, hidratación, cifras tabulares, safe areas | Skill de Web Interface Guidelines, **antes** de `design-review` |
| 9 | **`npm run gate:html`** si el cambio se decía transparente | Diff vacío = transparente por construcción (D42/D45) |
| 10 | **Los checks de CI en verde** | El PR |
| 11 | **Figura con lienzo escalado**: rótulo ≥11px **pintados a 360** | Un `viewBox` escala su texto y el `font-size` computado no lo dice, así que se mide `fs × (ancho pintado / viewBox)` sobre servido. Y su `/prototype` se ve a 360, no solo a escritorio (P68.56) |

## Columna B — no bloquea el envío

Nace como tarea de V3 en su bloque, no se hace dentro del sprint: **expresión de marca**
(`design-review`), **nota de PageSpeed** (`npm run psi`, D49), **micro-motion**, y el
pulido tipográfico o de ritmo que aparezca al mirarla.

*Un hallazgo de la columna B nunca reabre una sección ya enviada: se tarea.*

## Antes de construir, no al cerrar

- **¿Hay decisión visual abierta?** → `/prototype` **antes** de escribir el componente.
  Solo puede invocarla Francisco (lleva `disable-model-invocation: true`), así que
  **ofrécela** en cuanto la tarea tenga más de una dirección posible.
- **¿Dependencia frontend nueva?** → `/pick-ui-library`, misma condición.
- **¿Toca motion?** → `/review-animations` al terminarlo.
- **¿La tarea añade una superficie que recibe input de un tercero** (formulario, subida,
  endpoint)? → **`/security-review` al terminarla.**
