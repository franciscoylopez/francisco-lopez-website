@AGENTS.md
@BRAND.md
@PRD-Live.md

# Eficiencia de sesión y arquitectura de contexto

> **Principio rector: reglas → en contexto siempre; historia y detalle exhaustivo → a demanda (grep/Read).** Es la misma distinción que separa `PRD-Live.md` (`@`-importado) de `PRD-Historical.md` (a demanda). El coste de tokens de una sesión lo domina lo que se `@`-importa en cada arranque; por eso solo se precargan las **reglas activas**, no el registro histórico.

## Régimen de docs (qué se carga y qué se consulta)

- **`@`-importados (siempre en contexto):** `AGENTS.md`, `BRAND.md` (core de reglas), `PRD-Live.md`, y este `CLAUDE.md`.
- **A demanda (Read/Grep cuando la tarea lo pide, NUNCA `@`-importar):** `DECISIONS.md` (registro técnico), `PRD-Historical.md` (histórico de producto), **`BRAND-historical.md` (el porqué fechado de las reglas de marca)**, `BRAND-logo.md` (enciclopedia del logo).
- **Y cómo se consultan, que es lo que hace barata esa mitad:** los tres primeros llevan **índice derivado de sus cabeceras**. El de `DECISIONS.md` es el de aquí abajo; los de los dos históricos van **en su propia cabecera**, así que se abren con un `Read` limitado a las ~90 primeras líneas —el mapa entero de 46.000 palabras por unos 1.500 tokens— y solo después se va a la sección. Grepear a ciegas un archivo de 46.000 palabras es el fallo que el índice existe para evitar.
- **Cuándo leer `BRAND-historical.md`:** *antes de cambiar una regla de `BRAND.md`*. Casi todas nacieron corrigiendo algo, y allí está qué se probó y por qué se descartó — ahorra repetir un experimento que ya salió mal.
- **Convención de mitigación:** antes de tocar un subsistema con ADR, hacer `grep`/Read de su D-entry en `DECISIONS.md` — así no se pierde ninguna regla, solo deja de estar precargada. El índice de abajo dice qué D-entries existen.

## Índice de `DECISIONS.md` (contenido a demanda, no cargado)

- D1 (superado en V2+) · El diseño se traduce, no se copia
- D2 · i18n nativo con `app/[lang]`, ES sin prefijo + `/en`
- D3 · Next 16 usa `proxy.ts`, no `middleware.ts`
- D4 · Fuente única de tokens = `app/globals.css`; `brand-globals.css` deprecado
- D5 · Dark mode = `system` por defecto + toggle
- D6 · ¿shadcn lo trae? → no se escribe (regla hacia delante); `@base-ui/react` fuera hasta el primer componente
- D7 · Responsive en CSS, no en JS; Server Components por defecto
- D8 · Objetivos no funcionales: PageSpeed >90, desktop+mobile, AA→AAA
- D9 · Alcance de V1 = home + Brand Kit + Design System + SEO/OG + medición + dominio
- D10 · Política de documentación de la fase de desarrollo
- D11 · Andamiaje de calidad del build
- D12 · Branching y releases
- D13 · Entornos y staging = Vercel Previews
- D14 · Imágenes OG generadas con ImageResponse bajo `/api/og`
- D15 · SITE_URL estable en producción (`VERCEL_PROJECT_PRODUCTION_URL`)
- D16 · V1 en producción
- D17 · Analítica cargada con `next/script`, gateada a producción, consent-ready
- D18 · Página de política de cookies como documento vivo
- D19 · Optimización post-lanzamiento: analítica diferida + SEO afinado
- D20 · Revisión de copy ES↔EN: el diccionario ES es la fuente de verdad, el EN no es literal
- D21 · Enlaces entre páginas hermanas con componente compartido
- D22 · CV en PDF generado desde el diccionario (react-pdf, ATS)
- D23 · Copy con énfasis inline en el diccionario vía render de markup ligero
- D24 · Página de Accesibilidad: declaración pública verificada, no autoevaluación
- D25 · Páginas 404/error de marca con `global-not-found` + `global-error` (root layout dinámico)
- D26 · Cabeceras de seguridad Fase 1; CSP «A+ barato» (Fase 2) implementada, estricta diferida
- D27 · Higiene de dependencias: sharp override, shadcn a devDeps, Dependabot
- D28 · Arquitectura de contexto: reglas `@`-importadas vs referencia a demanda
- D29 · Superficie de contacto unificada: dato, patrón y jerarquía
- D30 (generalizada por D39) · Texto atenuado sobre fondos que no son `--background`
- D31 · Tracking de clics mailto/tel vía dataLayer (P30)
- D32 · CSP con allowlist para Microsoft Clarity; `c.bing.com` fuera a propósito (P37)
- D33 · `/llms.txt` — un solo archivo, en español, generado desde el diccionario (P37.5)
- D34 · Clases de componente en `globals.css` van sin `@layer` en este proyecto (Tailwind v4)
- D35 · Los dos extremos de una `transition` van en la misma regla que la declara
- D36 · Capa de componentes: variantes de acción y primitivas de layout
- D37 · Endurecimiento del workflow de CI, y qué audita de verdad este repo
- D38 · Fuente única de los valores publicados: `lib/design-values.ts`
- D39 · El atenuado lo resuelve la superficie, no el punto de uso
- D40 · Capa de tabla: `components/ui/table.tsx`
- D41 · Un color fijo no puede servir a dos superficies opuestas: `--brand-purple-accent` conmuta
- D42 · Los showcase se parten por sección, y el gate del refactor es un diff de HTML
- D43 · Toda página y toda sección abren igual: el ordinal va dentro del eyebrow
- D44 · Lo que de una experiencia no es copy vive en `content/`, y la unión es por nombre
- D45 · El andamiaje de página sale de un helper, no de seis copias
- D46 · El enlace de salto, y el `<main>` sube al shell
- D47 · Lo que ya está en pantalla no se anima: el LCP no lo paga el reveal
- D48 · El diccionario se parte por página, conservando el guardián de tipos
- D49 · El número de rendimiento se mide desde la terminal, y a demanda
- D50 · Una banda dimensionada por `vw` no cabe necesariamente sobre el pliegue
- D51 · Una herramienta externa entra por el trabajo que resuelve, no por lo buena que sea
- D52 · El gate de accesibilidad deja de dispararse una sola vez, y el eje que le faltaba era el alto
- D53 · La plantilla del deep-dive: una forma para cinco páginas, y el tipo como guardián
- D54 · Un artefacto se enseña, no se recrea: el diagrama real, saneado y en línea
- D55 · Un vídeo de terceros entra con facade, y el clic es el gate
- D56 · La apertura ocupa el pliegue, y `mx-auto` deja de significar lo que significaba
- D57 · Las tres longitudes de una experiencia son un solo dato
- D58 · El deep-dive es la fuente de los hechos de una experiencia
- D59 (completado por D72) · El SEO del deep-dive, y las tres listas de páginas escritas a mano
- D60 · Una fuente única evita dos verdades; no mantiene al día una copia impresa
- D61 · Una superficie también cambia por ESTADO, y el atenuado no se enteraba
- D62 · El 404 de una ruta que CASA no lo cubre `global-not-found`
- D63 · La raya no era un reemplazo, eran tres familias — y su guardián
- D64 · Una apertura homogénea no la decide el anclaje: la deciden los altos
- D65 · Un vídeo de apertura no es una foto que se mueve
- D66 · Un asset tiene más consumidores de los que se ven
- D67 · El ruido conocido de los validadores se documenta por MECANISMO, no por cifra
- D68 · El repositorio es público, y a `main` la protege el servidor y no la disciplina
- D69 · El régimen de contexto de D28 gana cifra y guardián, y aparece la operación que faltaba: retirar
- D70 · La capa que verifica no estaba verificada, y su modo de fallo es una luz verde
- D71 · «No hay datos» no distingue entre cero filas y mal configurado
- D72 · Una sola fuente de qué páginas tiene el sitio, y olvidarlas no compila
- D73 · Un lector de pantalla encuentra lo que ningún escáner puede, y un escáner encuentra lo que no existe
- D74 · Un compromiso no caduca y una medición sí: fuera de su fuente se publica el umbral
- D75 · Lo que verifica una página no es su código, es el HTML que emite
- D76 · Una capa nueva para texto largo, y el control que le faltaba al chrome sobre banda invertida
- D77 · Un bug que ya estaba comentado tres veces, y el diagrama pasa a vivir donde vive la cita
- D78 · El dato en vivo se vuelve un bloque más, y el pie deja de tener dos estilos
- D79 · Un prototipo: una dirección ganó
- D80 · Un flotado sin `mt` se alinea con su texto, y el marco se ajusta al contenido
- D81 · Foto en la apertura, evidencia citada en vivo, y una prueba descartada
- D82 · El design-review de P60 encuentra ocho fallos reales, y dos patrones que se repiten
- D83 · Una sección que documenta una capa nueva no puede ser una caja con las piezas dentro
- D84 · El artículo describe un proyecto que se mueve, y nadie le avisaba
- D85 · La pasada de contraste deja de hacerse a mano, y el medidor tenía un falso positivo
- D86 · El informe de qlty baja al repo, y de sus hallazgos dos eran míos
- D87 · Google no cruza de página, y por eso una referencia `@id` no basta en un tipo elegible

*(Al añadir una decisión nueva a `DECISIONS.md`, añade también su línea aquí.)*

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

## Reglas del tablero (no negociables)

> **Sin fechas.** Lo que dirige la ejecución es `MoSCoW` + `Prioridad` (orden) + `Tamaño`, no el calendario. Donde abajo diga "sprint", léase **"etapa"**.

> **`Etapa` contesta una sola pregunta: ¿esto está comprometido o esperando?** Dos familias en el mismo campo (y **vigila que «General» no se coma el eje**: ya degeneró una vez con «Optimización» al 80%):
>
> - **Sprints** (lo comprometido, con su orden): *Deep-dive · Cómo se ha creado · Footer y contacto*.
> - **Bloques** (backlog temático, aún no comprometido): *General · Home · Brand Kit · Design System · Accesibilidad*.
> - **`General` significa TRANSVERSAL, no «no sé dónde ponerla».** Higiene de CI, dependencias, docs y proceso: cosas que no son de ninguna página. Si una tarea es de una página o de una capa concreta, va a su bloque. *(Vigilado desde 2026-08-19: degeneró una vez con «Optimización».)*
> - **Cerradas** (solo archivadas, no se usan para tareas nuevas): *V1 (entregado) · Cimientos técnicos · Sobre mí · Contacto avanzado · Optimización · IA conversacional*.
>
> **Regla de movimiento: una tarea de deuda nace en su bloque y cambia de `Etapa` al sprint cuando se compromete** — porque desbloquea algo de ese sprint, o porque toca los mismos archivos y sale gratis hacerla de paso. Es lo que hace que un sprint arrastre deuda con criterio en vez de por lote. El coste asumido: al entrar en un sprint se pierde de qué bloque venía; lo llevan el nombre y las notas, y añadir una séptima propiedad sería peor.

> **`Versión` ≠ `Etapa`.** La etapa dice *cuándo se hace*; la versión, *en qué release sale*. Desde el 2026-08-10: **V2** = los tres sprints de arriba · **V3** = la deuda y mejoras por bloque · **V4** = la IA conversacional. Ver `PRD-Live.md` §9.

- **"To-Do", "En progreso" y "Blocked" están reservados al sprint activo.** Toda tarea de un sprint futuro va en **"Sin empezar"**, sin excepción. Al abrir un sprint nuevo, sus tareas pasan de "Sin empezar" a "To-Do"; al cerrarlo, lo que quede sin hacer se mueve al siguiente sprint y vuelve a "Sin empezar".
- **`Prioridad` es un orden global de ejecución, no una etiqueta de importancia.** Números bajos = antes. Debe ser coherente con el orden de sprints: todo lo del sprint 1 va por delante de todo lo del 2, y así sucesivamente. Dentro de cada sprint, ordena por dependencia — primero lo que desbloquea a otras tareas.
- Las tareas cerradas conservan su prioridad histórica (por debajo de 10); las abiertas van de 10 en adelante. **Para insertar una o varias tareas sueltas, usar decimales es correcto** (ej. `11.5` entre `11` y `12`). **Solo se renumera el bloque abierto entero cuando hay una reestructuración completa de prioridades**, no por inserciones puntuales.
- **`Versión` refleja en qué release sale la tarea de verdad, no dónde se planificó.** Si una tarea se construye antes del deploy de V1, es V1 — aunque en su día se pospusiera a V2.
- **Una tarea a la vez, en su orden de prioridad, con el `Estado` al día — nada de construir por delante del tablero.** Antes de tocar código, la tarea correspondiente se pone en "En progreso"; al terminarla, "Listo". No se salta una tarea de prioridad menor (número más bajo) para empezar otra posterior, aunque compartan trabajo. Si un mismo esfuerzo cubre varias tareas (p. ej. el build de la home repartido en 2-3 tareas de secciones), se **abren y se cierran una a una** conforme se avanza, no en bloque al final.
- **Al cerrar un sprint, sus tareas terminadas pasan a "Archivado".** "Listo" queda reservado a lo terminado del **sprint activo**; el histórico completado de sprints anteriores se archiva (sigue en la base, solo sale de las columnas activas). Lo que quede sin hacer se mueve al siguiente sprint como "Sin empezar". **Además, al cerrar un sprint invoca el skill `sprint-review`**: una revisión técnica crítica del codebase (developer externo, mirada fresca) que detecta deuda/huecos y propone tareas, para que la mejora del andamiaje y de la dinámica no dependa de acordarse de pedirla.

### Gestión de etapas — cuándo se cierra una, y las dos revisiones que dispara

Sin fechas, la **etapa en curso** es el sprint de menor `Prioridad` con tareas abiertas (hoy, *Deep-dive*). Se trabaja **una etapa a la vez**, en orden, **pero en dos carriles**: el *build* (técnico/diseño/dev) avanza una etapa cada vez; el *contenido* que solo escribe Francisco corre **en paralelo, por delante**, para desbloquear las secciones futuras (el "contenido primero" — hoy, la definición de Contacto ampliada, que es del sprint 3 y ya está en `To-Do`). Por eso `To-Do`/`En progreso` cubren la **etapa de build activa** *y* el **carril de contenido en marcha**; todo lo demás —sprints futuros y bloques— va en `Sin empezar`. Una etapa **se cierra** cuando todas sus tareas están en Listo/Archivado, o cuando Francisco lo declara ("cerramos Cimientos"). Al cerrarla: (1) se dispara el skill **`sprint-review`** (revisión técnica crítica), (2) sus tareas en Listo pasan a **Archivado**, (3) se hace el **check de medición** (ver abajo) y (4) **antes de abrir el siguiente** se dispara **`method-review`**, que audita cómo se trabaja. Va en ese hueco y no al cerrar porque **el andamiaje hay que ponerlo antes de que existan las cosas que tiene que sostener**, no después. "Listo" queda solo para lo terminado de la etapa en curso.

### Metodología de trabajo (fase V2+)

- **Contenido primero** en secciones bloqueadas por contenido (Sobre mí, Accesibilidad): el texto es el cuello de botella real y solo lo escribe Francisco. Desbloquear el contenido **antes o en paralelo** al diseño/dev; Claude puede redactar un borrador editable (como el CV o Sobre mí) para arrancarlo.
- **Bucle medir→aprender.** Al cerrar cada etapa, revisar los números de GA4 (clics de contacto, descargas de CV, scroll) para informar la priorización. Construir **y** medir — es lo que predica la web ("del discovery al dato").
- **Definition of Done por sección.** Cada tarea de sección hereda el checklist de cierre. **Vive en «Definition of Done» al final de este archivo**, en dos columnas: lo que bloquea el envío y lo que no.
- **Revisión con IA en los PR grandes.** Sin segundo revisor humano, usa `/code-review` (o ultrareview) en cambios sustanciales como segundo par de ojos.
- **Revisión de diseño:** skill `design-review` (cumplimiento del sistema + expresión de marca, verificado en pantalla). **Disparo manual** — antes de construir secciones nuevas o de un release visual grande, o cuando Francisco lo pida; no va enganchada al cierre de etapa como `sprint-review` hasta que se valide.
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
- **Una sola notación por token: la utilidad.** En Tailwind v4 el token del `@theme` **es** quien genera la utilidad, así que `rounded-lg` y `rounded-[var(--radius-lg)]` compilan a lo mismo y `rounded-[14px]` es el mismo valor congelado. Se escribe la **utilidad** (`rounded-md` · `bg-primary` · `text-muted-foreground`), nunca la sintaxis de escape `[var(--token)]` cuando existe utilidad, y nunca el px literal si coincide con un valor del sistema. *(Fijado 2026-08-08, P37.5996: el mismo radio estaba escrito de tres formas —`[var(--radius-xl)]` ×5, `rounded-xl` ×2, `[14px]` ×7— y lo mismo en `md` y `lg`.)*
  **Excepción: las ilustraciones.** Dentro de los dibujos a escala —marcos de dispositivo, esqueletos, el navegador de mentira del Brand Kit, el «0» del 404— los radios son coordenadas del dibujo y se quedan en px, aunque alguno coincida con un valor del sistema. Tokenizarlos es el refactor equivocado: harían crecer el trazo de una maqueta al cambiar `--radius`.
- **Objetivos no funcionales** (criterios de aceptación, no aspiraciones): PageSpeed/Lighthouse >90; desktop **y** mobile optimizados; accesibilidad AA de suelo, empujar AAA. `next/image` para imágenes, `next/font` para fuentes, minimizar JS de cliente.
- **SEO y datos estructurados por página — criterio de cierre, no un extra.** Igual que el performance, la accesibilidad y el responsive, **al crear una página nueva** hay que resolver su SEO: metadata (title, description, `canonical`, `hreflang`, OG y Twitter por locale) **y el marcado JSON-LD de Schema.org que le corresponda por tipo** — p. ej. `BreadcrumbList` en páginas internas, enriquecer `Person`/`ProfilePage` en la home. Verificarlo con el **Schema Markup Validator** (tipos no elegibles para rich results, como `Person`) **y** la **Rich Results Test** (tipos elegibles, como `BreadcrumbList`), en ES y EN. URLs absolutas vía `SITE_URL` (`lib/site.ts`). Ver `DECISIONS.md` D14/D15.

## Regla de construcción — nada nuevo se escribe a mano

> Aplica a **todo lo que se construye**: una sección, una página, un bloque, un control. La regla de `BRAND.md` («ningún control nace de una cadena de clases inline») es el caso particular de esta.

Antes de escribir markup nuevo, la cascada, en orden:

1. **¿Existe ya la pieza?** — `components/ui/action.tsx` para el control **con caja**, `components/ui/chrome.tsx` para el **enlace de la carpintería** de navegación (`shape` × `tone`), `components/ui/badge.tsx` para el **rótulo que no se pulsa** (`tone` × `kind`), `components/ui/heading.tsx` para el par **eyebrow + titular** (`SectionHeader`), `components/ui/table.tsx` para la **rejilla de filas y celdas** (`DataTable`/`TR`/`TD` si son datos, `SPECIMEN_ROW` si son especímenes), `components/ui/stat-row.tsx` para la **fila de cifras que resume una apertura** (`StatRow`/`Stat`), `components/ui/layout.ts` para **cajas y ritmos** (`WRAP`/`SECTION`/`PROSE`/`CARD`/`PANEL`/`PAIR`/`HERO_ROW`), el resto de primitivas de `components/ui/` (`icons`, `rich`, `info-card`), los bloques de `components/site/`. → **Se usa.** No se replica su aspecto con clases sueltas. **Cuál de las tres capas interactivas toca se decide con dos preguntas: ¿se pulsa?** (no → etiqueta) **y ¿tiene caja propia?** (sí → acción, no → chrome). Un chip que solo rotula no es un botón pequeño, y un enlace de nav tampoco (D36). **Dónde va lo nuevo:** ¿la pieza sabe algo de ESTE sitio (copy, rutas, datos, secciones)? No → `ui/`. Sí → `site/` (D36).
2. **¿No existe, pero el caso es del sistema?** → **Se crea la variante, no el caso.** Un botón que no encaja en ninguna variante no es un botón especial: es una variante que falta. Igual con un bloque que se va a repetir.
3. **¿Es un widget con estado, foco atrapado o portal** (diálogo, popover, tooltip, combobox, menú, tabs, scroll-area)? → **¿shadcn lo trae? → no se escribe.** Se trae con `npx shadcn@latest add <componente>` (estilo `base-nova`, ya configurado en `components.json`) y se le aplican nuestros tokens. El comportamiento de teclado y foco no se escribe a mano. *(Misma forma que la regla de iconos: «¿lucide lo trae? → no se dibuja».)* **Aplica hacia delante, no hacia atrás:** los widgets que hoy están a mano —el `<dialog>` nativo del consentimiento y su switch, las pestañas del Toolkit y los tabs de dispositivo del Design System— están bien hechos y no tienen deuda de accesibilidad; no se reescriben por cumplir la regla. Ver `DECISIONS.md` D6.
4. **¿Nada de lo anterior encaja?** → Lo decide Francisco y se **documenta con fecha** en `BRAND.md`.

**Señal de alarma:** si estás escribiendo una cadena de más de ~4 clases utilitarias para algo accionable, o para una caja que aparece más de una vez, estás en el paso 1 sin haberlo mirado.

**Al cerrar:** si el trabajo creó una variante o un bloque nuevo (paso 2), **se publica en el Design System antes de dar la tarea por hecha**. El recorrido completo —regla → componente → sección publicada → uso— es lo que hace que los enlaces sean difíciles de incumplir y lo que a los botones les faltaba.

### Qué compra esto: la accesibilidad se hereda, no se vuelve a medir

Con el gate cumplido, del checklist de 8 puntos de abajo solo dependen del contenido —los pone quien escribe la página, no el componente— **4** (un solo `h1`, jerarquía sin saltos), **5** (breadcrumb), **6** (nada codificado solo por color) y **8** (alternativas textuales). Y de esos cuatro **solo el 6 se verifica a mano**: el 4, el 5 y el 8 los mira `npm run check:marco` en cada PR, con el enlace de salto y el JSON-LD (D75).

Los otros cuatro —**1** contraste de los pares del sistema, **2** anillo de foco, **3** objetivo táctil de 44px, **7** `prefers-reduced-motion`— vienen dados por la pieza. Lo que se comprueba es que **se heredaron** (que el elemento sale de la variante), no se vuelven a medir. Y se comprueba **en pantalla**, no leyendo el JSX: es el punto 5 del método de `BRAND.md` §Accesibilidad («verifica la clase, no solo el color»), que existe justo porque una clase puede no estar aplicándose a nada sin dar error de compilación.

**Se vuelve a medir solo si el trabajo introduce un par de color nuevo**, un fondo que no sea `--background`, o una animación propia. Ahí el punto 1 vuelve entero, con el método de `BRAND.md` §Accesibilidad.

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

- **Se dispara dos veces, y la primera no es al cerrar.** Si la sección lleva banda o hero dimensionado por `vw`, **mientras se dibuja**: el eje que faltaba no era el tema, era el **alto**, y por ahí se coló D50 (`1536×740` y `1280×618` son un 1920 con el escalado de Windows al 125% y al 150%). Al cerrar, el resto del checklist.
- **Precondición:** `agent-browser` se conduce con el **sandbox de Bash desactivado**. No es solo la navegación: bajo el sandbox **ningún** comando llega al daemon, ni con la página ya cargada. Un comando que cuelga es ese síntoma —se desactiva el sandbox, no se reintenta ni se abre la URL desde la terminal—. (D51.)
- **Lo que no tapa, y ahora cubre CI:** el **enlace de salto** de WCAG 2.4.1 —que axe no detecta (D46)— y los puntos **4, 5 y 8**, que mira `npm run check:marco` sobre el HTML prerenderizado, en cada PR (D75).
- **Lo que sigue a mano:** el punto **6** (nada codificado solo por color), sin forma automática, y la **nota de PageSpeed**, que sale de `npm run psi` contra producción y no de `vitals` —que da métricas, no nota— (D49).
- **La pasada COMPLETA de contraste es `npm run censo`** (D85): lee las páginas de `PAGE_SLUGS`, valida el metro en cada corrida y falla si algún par baja de AAA. Fuera de CI, como `psi`. **Lo único que no juzga es el texto sobre foto**, que se mide aparte sobre el píxel pintado.
- **Tras esa pasada** (no al cerrar una página): actualizar `LAST_A11Y_REVIEW` en `lib/design-values.ts`, la fecha que publica `/accesibilidad` (D38). El **recuento de páginas** no se toca: sale de `PAGE_COUNT`.

`claude-in-chrome` no se retira: se queda para lo que necesita el navegador **con sesión** —consentimiento guardado, Preview autenticada—, que es la Fase 3 de `design-review`.

# Definition of Done

> **Es una tabla porque un gate que depende de acordarse no es un gate.** Los cuatro que
> fallaron por esa vía están cada uno en su entrada: D54, D60, D63.

**Se aplica a toda tarea que cree o rehaga una página, una sección o un bloque.** No a
refactors internos, config ni docs. Se pega en el cuerpo de la tarea de Notion al ponerla
«En progreso», y se marca al cerrarla.

## Columna A — bloquea el envío

| # | Comprobación | Cómo |
|---|---|---|
| 1 | **Sale de las piezas, no de clases sueltas** | La cascada de la «Regla de construcción». Si hubo que crear variante, se publica en el Design System antes de dar por hecha la tarea |
| 2 | **Accesibilidad de contenido**: un solo `h1` y jerarquía sin saltos · breadcrumb · nada codificado solo por color · alternativas textuales | `npm run check:marco` en CI para los puntos 4, 5 y 8 (D75). A mano solo el **6**, que no tiene forma automática |
| 3 | **Accesibilidad heredada**: contraste, foco, 44px, `reduced-motion` | `viewport-verifier` (D52). **Solo se vuelve a MEDIR** si el trabajo introduce un par de color nuevo, un fondo que no sea `--background` o una animación propia |
| 4 | **Enlace de salto** | `npm run check:marco`: axe no lo detecta, y por eso lo mira él (D46/D75) |
| 5 | **Pliegue**, si lleva banda o hero por `vw` | `viewport-verifier` **mientras se dibuja**, no al cerrar (D50/D52) |
| 6 | **SEO + JSON-LD** del tipo que le toca, ES y EN | `pageMetadata` lo deriva y `check:marco` comprueba que llegó, con los `@id` resueltos (D75). Se verifica a mano el **tipo nuevo** si lo hay, con el Schema Markup Validator |
| 7 | **Copy**: ES fuente de verdad, EN revisado contra el ES, sin raya | D20 · `npm run check:raya` |
| 8 | **Interfaz mecánica**: estados vacíos, desbordamiento, hidratación, cifras tabulares, safe areas | Skill de Web Interface Guidelines, **antes** de `design-review` |
| 9 | **`npm run gate:html`** si el cambio se decía transparente | Diff vacío = transparente por construcción (D42/D45) |
| 10 | **Los dieciséis checks de CI en verde** | El PR |

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
