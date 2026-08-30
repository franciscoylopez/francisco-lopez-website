@AGENTS.md
@BRAND.md
@PRD-Live.md

# Eficiencia de sesión y arquitectura de contexto

> **Principio rector: reglas → en contexto siempre; historia y detalle exhaustivo → a demanda (grep/Read).** El coste de una sesión lo domina lo que se `@`-importa en cada arranque, así que solo se precargan las **reglas activas**, nunca el registro histórico.

## Régimen de docs (qué se carga y qué se consulta)

- **`@`-importados (siempre en contexto):** `AGENTS.md`, `BRAND.md` (core de reglas), `PRD-Live.md`, y este `CLAUDE.md`.
- **A demanda (Read/Grep cuando la tarea lo pide, NUNCA `@`-importar):** `DECISIONS.md` (registro técnico), `PRD-Historical.md` (histórico de producto), **`BRAND-historical.md`** y **`CLAUDE-historical.md`** (el porqué fechado de las reglas de marca y de las de aquí), `BRAND-logo.md` (enciclopedia del logo).
- **Y cómo se consultan, que es lo que hace barata esa mitad:** todos llevan índice derivado **en su propia cabecera**, así que no cuestan nada en el arranque (D88). Se abren con un `Read` limitado a sus primeras líneas —130 en `DECISIONS.md`, 90 en los históricos— y solo después se va a la sección, nunca grepeando a ciegas.
- **Convención de mitigación:** antes de tocar un subsistema con ADR, `grep`/Read de su D-entry en `DECISIONS.md` — así no se pierde ninguna regla, solo deja de estar precargada.
- **Cuándo abrir un histórico: antes de CAMBIAR una regla, no antes de aplicarla.** Casi todas las de aquí y las de `BRAND.md` nacieron corrigiendo algo, y el caso que las escribió es lo que impide revertirlas por parecer arbitrarias. Aplicarlas no necesita el relato; discutirlas, sí.

## Modelo por tarea

Tabla de modelo por defecto según el trabajo. **Convención:** al empezar un bloque, coteja el tipo de tarea y **avisa a nivel de bloque/sesión**, nunca por micro-tarea — «esto lo haría en Sonnet, ¿cambias con `/model`?». Cambiar de modelo mantiene la conversación.

| Trabajo | Modelo |
|---|---|
| Diseño de sección, arquitectura, decisiones de marca/producto, sprint-review, copy ES↔EN (es criterio, D20) | **Opus** |
| Tablero de Notion, cableado de componentes, refactors mecánicos, actualización de docs, regenerar CV | **Sonnet** |
| Tareas triviales/repetitivas sin criterio | **Haiku** |

Micro-tarea mecánica en una sesión Opus → subagente barato **solo si es "chunky"**: el arranque en frío no compensa un one-liner.

## Higiene de sesión

- **Una sesión por bloque coherente;** `/clear` entre tareas no relacionadas para no arrastrar historial/tool-outputs acumulados.
- **No re-leer tras editar** (el harness ya rastrea el estado del archivo).
- **Concisión por defecto:** liderar con la respuesta, cortar preámbulos y recaps, tablas/bullets sobre párrafos; extenderse cuando se pida.
- **Disciplina de alcance:** hacer lo pedido, **señalar** lo adyacente, dejar que Francisco decida — no construir de más.

# Seguimiento de tareas (Notion)

Las tareas de desarrollo viven en la base "Tareas — Web personal" de Notion: https://app.notion.com/p/f3ee9a949c58482888423d5917087962

Al empezar una sesión de desarrollo:
1. **Vuelca las tareas abiertas a `scripts/.tablero.json` y lanza `npm run check:tablero`.** Dice el sprint activo y lo siguiente por prioridad, y caza lo que el tablero no vigila solo. Fuera de CI: leer Notion necesita su MCP.
2. Trabájalas en ese orden, respetando las dependencias señaladas en `Notas` de cada tarea.
3. Actualiza el `Estado` en Notion según avances: "To-Do" → "En progreso" al empezar, "Listo" al terminar.
4. Si una tarea deja de tener sentido tal como está definida —cambia el alcance, depende de algo sin resolver—, dilo antes de marcarla "Listo"; no la des por completada a medias.

**El cuerpo de una tarea NO sale en la consulta SQL, que solo devuelve propiedades.** Y el cuerpo es donde viven el porqué medido, las tablas y las dependencias. Al retomar una tarea se abre con `fetch`; listarla no basta.

**Y la ficha puede estar CADUCADA: verifica su premisa contra el disco antes de darla por mecánica.** Cuesta un `grep`; ahorra ejecutar la tarea equivocada. **El descarte es un hallazgo y se escribe en la ficha**, o vuelve.

## Reglas del tablero (no negociables)

> **Sin fechas.** Lo que dirige la ejecución es `MoSCoW` + `Prioridad` (orden) + `Tamaño`, no el calendario. Donde abajo diga "sprint", léase **"etapa"**.

> **`Etapa` contesta una sola pregunta: ¿esto está comprometido o esperando?** Dos familias en el mismo campo, y **vigila que «General» no se coma el eje**:
>
> - **Sprints**, lo comprometido con su orden, y **Bloques**, el backlog temático aún sin comprometer. **Cuáles son en cada momento lo dice el tablero, no este archivo.**
> - **`General` significa TRANSVERSAL, no «no sé dónde ponerla».** Higiene de CI, dependencias, docs y proceso: cosas que no son de ninguna página. Si una tarea es de una página o de una capa concreta, va a su bloque.
> - **Cerradas** (solo archivadas, no se usan para tareas nuevas): las que el tablero ya no lista como sprint ni como bloque. **Los «Método» no se vuelven bloque:** no tienen página, y su deuda es transversal (*General*).
> - **Un sprint que cierra no se archiva: se convierte en su BLOQUE.** Su página sigue viva y va a generar deuda, y esa deuda es de ella, no transversal.
>
> **Regla de movimiento: una tarea de deuda nace en su bloque y cambia de `Etapa` al sprint cuando se compromete** — porque desbloquea algo de ese sprint, o porque toca los mismos archivos y sale gratis hacerla de paso. Es lo que hace que un sprint arrastre deuda con criterio en vez de por lote.

> **A `General` no lo drena ningún sprint, así que se drena por CUPO.** **Cada sprint arrastra 3-4 tareas de `General`** —las que no piden criterio, por `Prioridad`— dentro del propio sprint, y **una revisión no cierra dejando en `General` más tareas nuevas de las que ese cupo va a sacar**. Si las deja, la revisión no ha terminado: falta decidir qué se retira.
>
> **El cupo no se puede comprobar, así que lo que se vigila es el NETO** (D138): `check:tablero` compara el tamaño de `General` con el sello del cierre anterior — **verde ≤ 0 · rojo ≥ +4**.

> **`Tanda` agrupa el sprint por lotes de trabajo, y es GENÉRICA:** `Tanda 1`…`Tanda 5` se
> **repueblan al abrir cada sprint**, así que la tanda 1 de uno y la de otro no son lo mismo.
> Es de lectura visual, no un eje de ejecución: quien manda sigue siendo `Prioridad`.

> **`Versión` ≠ `Etapa`.** La etapa dice *cuándo se hace*; la versión, *en qué release sale*. Qué entra en cada una lo dice `PRD-Live.md` §9.

- **"To-Do", "En progreso" y "Blocked" están reservados al sprint activo.** Toda tarea de un sprint futuro va en **"Sin empezar"**, sin excepción. Al abrir un sprint nuevo, sus tareas pasan de "Sin empezar" a "To-Do"; al cerrarlo, lo que quede sin hacer se mueve al siguiente sprint y vuelve a "Sin empezar".
- **`Prioridad` es un orden global de ejecución, no una etiqueta de importancia.** Números bajos = antes. Debe ser coherente con el orden de sprints: todo lo del sprint 1 va por delante de todo lo del 2, y así sucesivamente. Dentro de cada sprint, ordena por dependencia — primero lo que desbloquea a otras tareas.
- Las cerradas conservan su prioridad histórica (bajo 10); las abiertas van de 10 en adelante. **Para insertar tareas sueltas, decimales** (`11.5` entre `11` y `12`); **solo se renumera el bloque abierto entero en una reestructuración completa**, no por inserciones puntuales.
- **`Versión` refleja en qué release sale la tarea de verdad, no dónde se planificó.** Si se construye antes del deploy de una, es esa — aunque en su día se pospusiera.
- **Una tarea a la vez, en su orden de prioridad, con el `Estado` al día — nada de construir por delante del tablero.** Antes de tocar código, la tarea se pone en "En progreso"; al terminarla, "Listo". No se salta una de prioridad menor para empezar otra posterior, aunque compartan trabajo: si un mismo esfuerzo cubre varias, se **abren y se cierran una a una**, no en bloque al final.
- **"Listo" es solo del sprint activo.** Al cerrar, sus tareas terminadas pasan a "Archivado" (siguen en la base, salen de las columnas activas) y lo que quede sin hacer va al siguiente sprint como "Sin empezar" — **salvo el carril de contenido, que no pertenece a ningún sprint y por tanto no se barre** (ver abajo). El ritual completo de cierre, con las dos revisiones que dispara, está en «Gestión de etapas».

### Gestión de etapas — cuándo se cierra una, y las dos revisiones que dispara

Sin fechas, la **etapa en curso** es el sprint de menor `Prioridad` con tareas abiertas, y se trabaja **una a la vez, en orden** — pero en **dos carriles**: el *build* avanza una etapa cada vez, y el *contenido* que solo escribe Francisco corre **en paralelo y por delante**, para desbloquear las secciones futuras. Por eso `To-Do`/`En progreso` cubren la **etapa de build activa** *y* el **carril de contenido en marcha**; todo lo demás va en `Sin empezar`.

**El carril de contenido es lo que impide que un sprint abra bloqueado:** el cierre **no lo toca**, y **abrir un sprint empieza comprobando que su tarea de contenido no sigue sin empezar**. Si lo está, esa es la primera tarea, no la de build.

Una etapa **se cierra** cuando todas sus tareas están en Listo/Archivado, o cuando Francisco lo declara. Al cerrarla: (1) se dispara el skill **`sprint-review`** (revisión técnica crítica), (2) sus tareas en Listo pasan a **Archivado**, (3) se hace el **check de medición** y (4) **antes de abrir el siguiente** se dispara **`method-review`**, que audita cómo se trabaja. Va en ese hueco y no al cerrar porque **el andamiaje hay que ponerlo antes de que existan las cosas que tiene que sostener**.

**Dos sellos se ponen a mano en ese cruce:** al cerrar —y **después** de crear las tareas del propio `sprint-review`, sobre un volcado nuevo—, `SELLO_GENERAL` (`check-tablero.ts`); al abrir, `CICLO_ABIERTO` (`check-contexto.ts`). Sin eso miden contra una etapa que ya no es, o contra un número que nunca existió.

### Metodología de trabajo (fase V2+)

- **Contenido primero.** El texto es el cuello de botella real y solo lo escribe Francisco; el carril de arriba dice cuándo. Claude puede redactar un borrador editable para arrancarlo.
- **Definition of Done por sección.** Cada tarea de sección hereda el checklist de cierre, al final de este archivo.
- **Revisión con IA en los PR grandes.** Sin segundo revisor humano, usa `/code-review` (o ultrareview) en cambios sustanciales como segundo par de ojos.
- **Shippear vs. pulir.** Que las secciones salgan en vez de dorarse: lo de la columna B de la DoD no bloquea el envío.

# Fase de desarrollo — convenciones (V1 build)

Las **decisiones** técnicas viven en `DECISIONS.md` (fuente de verdad, solo en el repo). Esto son las **reglas** que aplican al escribir código, no negociables salvo que una decisión nueva las cambie.

- **Dónde va cada decisión.** Producto/diseño/alcance → estado en `PRD-Live.md`, historia en `PRD-Historical.md`. Técnica transversal → `DECISIONS.md`. Convenciones → este archivo, y su porqué fechado en `CLAUDE-historical.md`. Marca → `BRAND.md` ↔ `BRAND-historical.md`. Ninguno tiene espejo en Notion. `README.md` es la entrada al repo y **se mantiene al día**: al añadir capacidades o cambiar stack, estructura o scripts, se actualiza. El «por qué» del código → commit/PR. Progreso por tarea → Notion (`Estado` al empezar y al cerrar).
- **Cierre de sesión.** Cuando Francisco indique que se cierra ("lo dejamos por hoy" o similar), invoca el skill `close-session`, que es la red de seguridad para que nada quede sin documentar.
- **i18n desde la primera línea.** Cero strings hardcodeados: todo texto sale del diccionario tipado. Locale en `app/[lang]/`, ES sin prefijo (`/`), EN en `/en`. Enrutado en `proxy.ts` (Next 16), no `middleware.ts`. Nombrar assets con locale cuando aplique. El diccionario está **partido por página** en `app/[lang]/dictionaries/{es,en}/` —`common` + una rama por página— y cada página carga la suya (D48). **El diccionario ES es la fuente de verdad del copy; el EN se revisa contra el ES, no se traduce literal** — y en ambos, el `kicker` no repite ni su título ni el breadcrumb que tiene encima.
- **En el copy del sitio no se usa la raya (`—`)** *(2026-08-18)*. Es una señal visual de texto escrito por IA y casi nunca dice nada que no diga un signo más corto. **Dos puntos** cuando lo que sigue explica lo anterior · **coma** cuando solo continúa · **punto** cuando ya era otra frase · **paréntesis** cuando el inciso lleva comas dentro (con comas se confundiría con la enumeración) · **`·`** solo cuando de verdad separa dos etiquetas (`Nav · al cargar`) · **guion con espacios** en un rango de fechas (`2019 - 2026`), porque ahí el `·` ya es el separador de campos y `2019 · 2026 · 5 hitos` son tres campos donde había dos.
  **Dos excepciones, y solo dos:** el **ordinal de una cabecera** (`01 — Rejilla`), que es la convención de D43 y no prosa, y la **celda «no aplica»** de una tabla (la raya sola), que es su signo tipográfico. **Lo comprueba `check:raya`** sobre el copy que se SIRVE, no sobre los `.md` del repo ni los comentarios de código.
- **Server por defecto.** `"use client"` solo en islas interactivas (nav, reveals, contadores, tabs, toggle de tema, preview de dispositivo). Todo lo demás, Server Component.
- **Responsive en CSS/Tailwind**, no en JS. Breakpoints alineados con Tailwind (sm 640 / md 768 / lg 1024 / xl 1280). El contenido apila en móvil; nada de `matchMedia` para maquetar.
- **Un `fixed` que apila N elementos se acota al hueco que le queda** (`top`/`bottom` + scroll interno, centrado con `my-auto`), nunca se centra sobre el viewport: su alto crece con el contenido y el viewport no.
- **Tokens, no hex.** Solo tokens de `app/globals.css` (`brand-globals.css` está deprecado). Respeta la regla de dos capas de `BRAND.md`: `primary` (cian) es el único color de acción; el morado es decorativo. Nunca inventes colores.
- **Una ENTRADA no elige su curva ni su duración: las toma de `--ease-entrance` y `--duration-entrance`** *(2026-08-27, D135)*. Reveal, chip, barrido, banner, relleno de un enlace: todo lo que aparece. Los 280 ms son el **techo**, no el valor obligatorio — por debajo, lo que pida el recorrido; por encima, solo con el motivo escrito al lado (hoy hay uno: el gesto de marca del 404). Y una **demo** de una pieza del sistema no lleva cifras propias: usa la pieza.
- **Una sola notación por token: la utilidad.** En Tailwind v4 el token del `@theme` **es** quien genera la utilidad, así que `rounded-lg`, `rounded-[var(--radius-lg)]` y `rounded-[14px]` compilan a lo mismo. Se escribe la **utilidad** (`rounded-md` · `bg-primary` · `text-muted-foreground`), nunca la sintaxis de escape `[var(--token)]` cuando existe utilidad, y nunca el px literal si coincide con un valor del sistema.
  **Excepción: las ilustraciones.** Dentro de un dibujo a escala (marcos de dispositivo, esqueletos, el «0» del 404) los radios son coordenadas y se quedan en px, aunque coincidan con un valor del sistema: tokenizarlos haría crecer el trazo de una maqueta al cambiar `--radius`.
- **No funcionales** (criterios de aceptación, no aspiraciones): los umbrales los fija `PRD-Live.md` §No funcionales. Al escribir: `next/image`, `next/font`, y minimizar JS de cliente.
- **SEO y JSON-LD son criterio de cierre, no un extra** — y los derivan `pageMetadata` y `<PageShell>`, así que al escribir una página solo hay que darle el **tipo** de Schema.org que le toca (`BreadcrumbList` en las internas, `Person`/`ProfilePage` en la home) y usar URLs absolutas vía `SITE_URL` (`lib/site.ts`). Quién lo comprueba, en la DoD, fila 6. Ver `DECISIONS.md` D14/D15.

## Regla de construcción — nada nuevo se escribe a mano

> Aplica a **todo lo que se construye**: una sección, una página, un bloque, un control. La regla de `BRAND.md` («ningún control nace de una cadena de clases inline») es el caso particular de esta.

Antes de escribir markup nuevo, la cascada, en orden:

1. **¿Existe ya la pieza?** — **la lista es `components/ui/README.md`**, derivada del disco por `npm run indices`: una línea por archivo con qué resuelve, a qué grupo pertenece y en qué sección se publica. **Ábrelo, no lo supongas.** Cuentan también los bloques ya montados de `components/site/`. → **Se usa.** No se replica su aspecto con clases sueltas. **Cuál de las tres capas interactivas toca se decide con dos preguntas: ¿se pulsa?** (no → etiqueta) **y ¿tiene caja propia?** (sí → acción, no → chrome). Un chip que solo rotula no es un botón pequeño, y un enlace de nav tampoco (D36). **Dónde va lo nuevo:** ¿la pieza sabe algo de ESTE sitio (copy, rutas, datos, secciones)? No → `ui/`. Sí → `site/` (D36).
2. **¿No existe, pero el caso es del sistema?** → **Se crea la variante, no el caso.** Un botón que no encaja en ninguna variante no es un botón especial: es una variante que falta. Igual con un bloque que se va a repetir.
3. **¿Es un widget con estado, foco atrapado o portal** (diálogo, popover, tooltip, combobox, menú, tabs, scroll-area)? → **el teclado, el ARIA y el foco no se escriben a mano**, y salen de dos preguntas en este orden *(2026-08-24, D6)*: **¿lo trae la plataforma?** —`<dialog>` + `showModal()`, el atributo `popover`, `anchor-name`— y, si no, **¿lo trae shadcn?**, con `npx shadcn@latest add <componente>` (estilo `base-nova`, ya configurado) y nuestros tokens encima. **Aplica hacia delante, no hacia atrás:** los widgets que hoy están a mano están bien hechos y no se reescriben por cumplir la regla. Ver D6 y D120.
4. **¿Nada de lo anterior encaja?** → Lo decide Francisco y se **documenta con fecha** en `BRAND.md`.

**Señal de alarma:** si estás escribiendo una cadena de más de ~4 clases utilitarias para algo accionable, o para una caja que aparece más de una vez, estás en el paso 1 sin haberlo mirado.

**Al cerrar:** si el trabajo creó una variante o un bloque nuevo (paso 2), **se publica en el Design System antes de dar la tarea por hecha**, y eso lo lleva la skill `publicar-en-design-system`; `check:indices` la nombra si no. El recorrido completo —regla → componente → sección publicada → uso— es lo que hace que la regla no dependa de acordarse.

### Qué compra esto: la accesibilidad se hereda, no se vuelve a medir

La mayoría de los 9 puntos de abajo los trae la pieza o `<PageShell>`, así que lo que queda no es medirlos otra vez: es comprobar que **se heredaron**, y **en pantalla, no leyendo el JSX** — una clase puede no estar aplicándose a nada sin dar error de compilación (`BRAND.md` §Cómo medir, punto 5).

**Quién mira cada punto, y cuándo hay que volver a medir, lo dice la tabla de la Definition of Done** al final de este archivo; no se repite aquí.

## Checklist de accesibilidad — gate de cierre de cada página/sección

Antes de cerrar una página o sección, los 9 puntos —los mismos que publica el Design System del sitio—, con la rebaja que permite la regla de construcción de arriba cuando todo sale de piezas existentes:

1. **Contraste medido, con cifra, en ambos temas.** AA es el suelo; AAA siempre que se alcance sin coste visual. Verificar también los estados interactivos (hover/focus), no solo el reposo.
2. **Foco visible:** anillo de 2px con `var(--ring)` y offset de 2px en todo elemento interactivo. Nunca `outline:none` sin sustituto.
3. **Objetivos táctiles ≥ 44×44px**, también en controles pequeños (breadcrumb, toggle de tema).
4. **Un solo `h1` por página** y jerarquía `h2`–`h4` sin saltos. El orden de lectura = el orden del DOM.
5. **Breadcrumb** en toda página interna: `<nav aria-label>`, lista ordenada, `aria-current="page"` en el nivel actual.
6. **Nada codificado solo por color:** todo estado/categoría distinguido por color lleva además texto o forma.
7. **`prefers-reduced-motion` retira lo que DESPLAZA o ESCALA, no lo que se funde** *(2026-08-27, D136)*. Lo que molesta a quien activa ese ajuste es el vestíbulo, no que algo aparezca: la opacidad y el color se quedan. Una animación mixta **se parte** (fuera el `translate`, dentro el fundido) y **el fundido que se queda se acorta**; solo se apaga entera la que es movimiento de principio a fin, o la que va acoplada al scroll, que es la que nombra WCAG 2.3.3.
8. **Alternativas textuales:** `alt` y etiquetas donde informan, `aria-hidden` en lo decorativo.
9. **Vía de escape del teclado:** enlace de salto al contenido como primer elemento focalizable, con destino real (`<main>` con `tabindex="-1"`).

### Cómo se verifica


Sobre el sitio **servido** y conducido por el subagente **`viewport-verifier`**, nunca a mano: él ya lleva la matriz, congela el motion antes de medir y devuelve hallazgos, no el volcado. **Qué garantiza cada gate, dónde corre y qué deja fuera lo dice `PRD-Live.md` §Cómo se verifica**; aquí solo lo que hay que hacer:

- **Precondición: el sandbox de Bash desactivado** en TODAS las llamadas, no solo las de navegación. Un comando que cuelga es ese síntoma: se desactiva el sandbox, no se reintenta (D51).
- **Lo que sigue a mano:** el punto **6** (nada codificado solo por color) y la nota de PageSpeed (`npm run psi`, no `vitals`).
- **Tras el censo Y las dos pasadas manuales** —`viewport-verifier` y NVDA—, no al cerrar una página ni con el censo solo: actualizar `LAST_A11Y_REVIEW` en `lib/design-values.ts`. **Es una fecha de CONFORMIDAD**, así que moverla con media revisión hecha afirma lo que no se ha comprobado (D38). El **recuento de páginas** no se toca: sale de `PAGE_COUNT`.

# Definition of Done

**Se aplica a toda tarea que cree o rehaga una página, una sección o un bloque.** No a
refactors internos, config ni docs. Se pega en el cuerpo de la tarea de Notion al ponerla
«En progreso», y se marca al cerrarla.

## Columna A — bloquea el envío

| # | Comprobación | Cómo |
|---|---|---|
| 1 | **Sale de las piezas, no de clases sueltas** | La cascada de la «Regla de construcción»; `check:indices` nombra lo que quede sin publicar |
| 2 | **Accesibilidad de contenido**: un solo `h1` y jerarquía sin saltos · breadcrumb · nada codificado solo por color · alternativas textuales | `npm run check:marco` en CI para los puntos 4, 5 y 8 (D75). A mano solo el **6**, que no tiene forma automática |
| 3 | **Accesibilidad heredada**: contraste, foco, 44px, `reduced-motion` | `viewport-verifier` (D52). **Solo se vuelve a MEDIR cuando `check:palette` lo pide**: compara contra el sello del último censo y sale rojo nombrando el par, el fondo o la animación que apareció (D90) |
| 4 | **Enlace de salto** | `npm run check:marco`: axe no lo detecta, y por eso lo mira él (D46/D75) |
| 5 | **Pliegue**, si lleva banda o hero por `vw` | `viewport-verifier` **mientras se dibuja**, no al cerrar (D50/D52) |
| 6 | **SEO + JSON-LD** del tipo que le toca, ES y EN | `pageMetadata` lo deriva y `check:marco` comprueba que llegó, con los `@id` resueltos (D75). Se verifica a mano el **tipo nuevo** si lo hay, con el Schema Markup Validator |
| 7 | **Copy**: ES fuente de verdad, EN revisado contra el ES, sin raya | D20 · `npm run check:raya` |
| 8 | **Interfaz mecánica**: estados vacíos, desbordamiento, hidratación, cifras tabulares, safe areas | Skill de Web Interface Guidelines, **antes** de `design-review` |
| 9 | **`npm run gate:html`** si el cambio se decía transparente | Diff vacío = transparente por construcción (D42/D45) |
| 10 | **Los checks de CI en verde** | El PR |
| 11 | **Figura con lienzo escalado**: rótulo ≥11px **pintados a 360** (D124) | Lo pone la capa (`DosLienzos`: se declara el ancho y nada más, D114) y `check:figuras` lo confirma en CI. Y su `/prototype` se ve a 360, no solo a escritorio |

## Columna B — no bloquea el envío

Nace como tarea de V3 en su bloque, no se hace dentro del sprint: **expresión de marca**
(`design-review`), **nota de PageSpeed** (`npm run psi`, D49), **micro-motion**, y el
pulido tipográfico o de ritmo que aparezca al mirarla.

*Un hallazgo de la columna B nunca reabre una sección ya enviada: se tarea.*

## Antes de construir, no al cerrar

- **¿Hay decisión visual abierta?** → `/prototype` **antes** de escribir el componente.
  Solo puede invocarla Francisco, así que **ofrécela** en cuanto la tarea tenga más de una
  dirección posible. **Y también cuando una medición visual contradiga lo que Francisco ve
  en la página** (`BRAND.md` §Cómo medir, punto 8).
- **¿Dependencia frontend nueva?** → `/pick-ui-library`, misma condición.
- **¿Toca motion?** → `/review-animations` al terminarlo.
- **¿La tarea añade una superficie que recibe input de un tercero** (formulario, subida,
  endpoint)? → **`/security-review` al terminarla.**
