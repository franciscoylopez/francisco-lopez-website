@AGENTS.md
@BRAND.md
@PRD-Live.md

# Eficiencia de sesión y arquitectura de contexto

> **Principio rector: reglas → en contexto siempre; historia y detalle exhaustivo → a demanda (grep/Read).** Es la misma distinción que separa `PRD-Live.md` (`@`-importado) de `PRD-Historical.md` (a demanda). El coste de tokens de una sesión lo domina lo que se `@`-importa en cada arranque; por eso solo se precargan las **reglas activas**, no el registro histórico.

## Régimen de docs (qué se carga y qué se consulta)

- **`@`-importados (siempre en contexto):** `AGENTS.md`, `BRAND.md` (core de reglas), `PRD-Live.md`, y este `CLAUDE.md`.
- **A demanda (Read/Grep cuando la tarea lo pide, NUNCA `@`-importar):** `DECISIONS.md` (registro técnico), `PRD-Historical.md` (histórico de producto), **`BRAND-historical.md` (el porqué fechado de las reglas de marca)**, `BRAND-logo.md` (enciclopedia del logo).
- **Cuándo leer `BRAND-historical.md`:** *antes de cambiar una regla de `BRAND.md`*. Casi todas nacieron corrigiendo algo, y allí está qué se probó y por qué se descartó — ahorra repetir un experimento que ya salió mal. *(Partido el 2026-08-09, P37.685: `BRAND.md` bajó de 5.954 a 3.530 palabras y el total `@`-importado de ~11.400 a ~9.000.)*
- **Convención de mitigación:** antes de tocar un subsistema con ADR, hacer `grep`/Read de su D-entry en `DECISIONS.md` — así no se pierde ninguna regla, solo deja de estar precargada. El índice de abajo dice qué D-entries existen.

## Índice de `DECISIONS.md` (contenido a demanda, no cargado)

- D1 · El diseño se traduce, no se copia (superado en V2+)
- D2 · i18n nativo `app/[lang]`, ES sin prefijo + `/en`
- D3 · Next 16 usa `proxy.ts`, no `middleware.ts`
- D4 · Fuente única de tokens = `app/globals.css`; `brand-globals.css` borrado
- D5 · Dark mode = `system` por defecto + toggle
- D6 · ¿shadcn lo trae? → no se escribe (regla hacia delante); `@base-ui/react` fuera hasta el primer componente
- D7 · Responsive en CSS, no en JS; Server Components por defecto
- D8 · No funcionales: PageSpeed >90, desktop+mobile, AA→AAA
- D9 · Alcance de V1 (home + Brand Kit + Design System + SEO/OG + medición + dominio)
- D10 · Política de documentación de la fase de desarrollo
- D11 · Andamiaje de calidad del build (i18n tipado, sin tests en V1)
- D12 · Branching y releases (trunk-based, ramas cortas, tags `vX.Y.Z`); **cómo se integra un PR: squash si trae un commit, rebase si trae varios**
- D13 · Entornos y staging = Vercel Previews
- D14 · Imágenes OG con `ImageResponse` bajo `/api/og`
- D15 · SITE_URL estable en prod (`VERCEL_PROJECT_PRODUCTION_URL`)
- D16 · V1 en producción (registro)
- D17 · Analítica con `next/script`, gateada a prod, consent-ready (GTM)
- D18 · Página de política de cookies como documento vivo
- D19 · Optimización post-lanzamiento: GTM `lazyOnload` + SEO afinado
- D20 · Revisión de copy ES↔EN — `es.json` fuente de verdad, EN no literal
- D21 · Enlaces entre páginas hermanas con componente compartido
- D22 · CV en PDF generado desde el diccionario (react-pdf, ATS)
- D23 · Copy con énfasis inline vía render de markup ligero (`Rich`)
- D24 · Página de Accesibilidad: declaración pública verificada
- D25 · Páginas 404/error de marca (`global-not-found` + `global-error`); **el `not-found` anidado se borró (2026-08-10): su `headers()` volvía dinámico todo `[lang]` y las seis páginas eran `ƒ` en vez de `●`**
- D26 · Cabeceras de seguridad Fase 1; CSP «A+ barato» implementada
- D27 · Higiene de dependencias: sharp override, shadcn a devDeps, Dependabot
- D28 · Arquitectura de contexto: reglas `@`-importadas vs referencia a demanda; su tercera aplicación es el corte de `BRAND.md` (P37.685)
- D29 · Superficie de contacto unificada: `lib/contact.ts` + `contact-actions.tsx` + jerarquía sólido/outline
- D30 · Texto atenuado sobre fondos que no son `--background` (bandas): recalcular, no reusar el token
- D31 · Tracking de clics mailto/tel vía dataLayer (P30); GTM Vista previa solo funciona en producción
- D32 · CSP con allowlist para Microsoft Clarity (3 directivas); `c.bing.com` fuera a propósito (P37)
- D33 · `/llms.txt` — un solo archivo, en español, generado desde el diccionario (P37.5)
- D34 · Clases de componente en `globals.css` van sin `@layer` en este proyecto (Tailwind v4)
- D35 · Los dos extremos de una `transition` van en la misma regla que la declara
- D36 · Capa de componentes: las seis capas (`action.tsx` · `chrome.tsx` · `badge.tsx` · `heading.tsx` · `table.tsx` · `layout.ts`); frontera `ui/`↔`site/` (¿la pieza sabe algo de este sitio?) y, dentro, ¿se pulsa? → ¿tiene caja?
- D37 · Endurecimiento del workflow de CI (permissions, persist-credentials, pinning por SHA); qué plugins audita Qlty y por qué un check de PR no ve lo que no se toca
- D38 · Fuente única de los valores publicados (`lib/design-values.ts`): ejecutable / publicada / del porqué; el diccionario solo lleva copy; paleta única para mock de tema y OG, con guardián en CI (`npm run check:palette`). **Ampliado (P37.659): el guardián ya no comprueba solo que las copias conocidas cuadren, sino que no queda ninguna copia de un valor de token fuera de su fuente — buscando VALORES, no patrones**
- D39 · El atenuado lo resuelve la superficie (`--surface-dim`), no el punto de uso — generaliza D30; `data-surface` para lo que se pinta su propio velo; retira `--contact-dim` y el eje `tone` del eyebrow
- D40 · Capa de tabla (`components/ui/table.tsx`): marcado real para tablas de datos, divs para las de espécimen; un separador (el filete) y un gutter de padding
- D43 · Toda página y toda sección abren igual: el ordinal dentro del eyebrow; eran CUATRO copias privadas de la cabecera numerada, no tres; las 19 con entradilla; y el hueco titular→entradilla ya lo pone la capa (`LEAD_GAP`, P45) — eran 32 huecos a mano pero solo cuatro decisiones, y el `1.4rem` que parecía drift era el valor de `section`
- D42 · Los showcase se parten por sección (carpeta + `index.tsx` + `NN-nombre.tsx` + `shared.tsx`); por qué se descartó «datos + renderer»; y el gate del refactor = **diff del HTML servido** (`npm run gate:html`, doce variantes desde D45), validado disparándolo — **con su límite: diff vacío = correcto, diff no vacío = hay que mirar la página**
- D49 · `npm run psi` mide PageSpeed desde la terminal (nota, métricas, **desglose del LCP** y huella del despliegue medido); **a demanda y NO como gate de CI**, porque su variabilidad daría rojos falsos
- D48 · El diccionario se parte por página (`dictionaries/{es,en}/`: `common` + una rama por página); los tipos siguen saliendo del ES y una clave que falte en EN rompe el build — el helper recibe el tipo EXPLÍCITO para que no infiera una unión; `Dictionary` se recompone y los 25 componentes no cambian
- D47 · **En Next 16 `priority` está deprecado y ya NO pone `fetchpriority`/`loading` en el `<img>`** — los hero declaran `fetchPriority="high"` + `loading="eager"`; y lo que ya está en el primer pliegue no se anima: `RevealRoot` lo marca antes de encender `reveal-on`, porque el LCP lo estaba pagando el fade-up (2.090 ms de retraso de renderizado); el coste visible es que el primer pliegue deja de animarse
- D46 · Enlace de salto (WCAG 2.4.1, nivel A — **axe no lo detecta**) y el `<main>` sube a `PageShell` con `id="main"`; por qué `translate` y no `sr-only`; el `id="top"` de los cinco `<main>` se retira y el del hero de la home se queda
- D45 · El andamiaje de página no se escribe a mano: `pageMetadata` (canonical, hreflang, OG y Twitter derivados de `pagePath`) + `<PageShell>` (JSON-LD, nav, motion, footer, con dos modos en el tipo); qué se dejó fuera a propósito (`generateStaticParams`, `metadataBase`/`icons`, el `<main>`)
- D44 · Lo que de una experiencia no es copy (logo, slug) vive en `content/experiences.ts`; la unión con el diccionario y con el CV es por `company` y **lanza** si no hay match — mata el mapeo por índice
- D50 · Una banda dimensionada por `vw` no cabe necesariamente sobre el pliegue: el alto lo pone `min(48vw, 100svh − 14rem)` porque el andamiaje que va delante es un offset FIJO (12,5rem), no proporcional; el escalado de Windows mueve el alto sin tocar la resolución (1920@125% = 1536×~740; @150% = 1280×~618); y al acortarse hay que elegir por dónde recorta — se ancla arriba y se recorta la fuente, porque un solo `object-position` no preserva cabeza y pies
- D41 · Un color fijo no puede servir a dos superficies opuestas: `--brand-purple-accent` conmuta con el tema (techo de un color fijo = √13,79 = 3,71:1); el atenuado sustituye al morado en la escalera del logo; y el umbral del censo depende del tamaño del texto
- D51 · Una herramienta externa entra por el **trabajo que resuelve**, no por lo buena que sea: el criterio en cuatro preguntas, y el patrón que salió repetido en tres bloques —**lo que encaja es de cero JS de cliente y se ata a un evento; lo que peor encaja añade cliente o una segunda fuente de reglas**—; de 32 candidatas entran 4; `agent-browser` mide lo que la pestaña oculta no puede (D50 reproducible, axe, vitals, dos temas) y **se validó reproduciendo dos resultados conocidos**; su límite es la navegación inicial dentro del sandbox; y `.claude/skills/` está rastreado por git, así que lo de terceros va global
- D52 · El gate de accesibilidad deja de dispararse una sola vez: `agent-browser` conducido por el subagente `viewport-verifier` sustituye a «Lighthouse + axe con `claude-in-chrome`»; **el eje que faltaba era el alto, no el tema** (D50), así que hay disparo *mientras se dibuja* y disparo *al cerrar*; «Lighthouse» confundía la **nota** de PageSpeed (que sigue en `npm run psi`, D49) con el axe que trae dentro; el **enlace de salto** sigue a mano porque axe no lo ve (D46); y `claude-in-chrome` se queda para lo que necesita sesión

- D53 · La plantilla del deep-dive: una forma para cinco páginas y **el tipo como guardián** — el diccionario se declara con INTERFAZ explícita y no con `typeof` (cinco archivos que comparten forma), `EXPERIENCES` pasa a `as const satisfies` para que el slug sea unión real, y quitar el `Partial` del registro hace que una experiencia sin diccionario rompa el build; `sub`/`level 3` en `heading.tsx`, `parents` en `PageShell` (primer breadcrumb de tres niveles) y `ui/page-closer.tsx` (el cierre de página sube ENTERO, no solo la tarjeta); y lo que cazó `gate:html`: `cn()` reordena las clases en runtime
- D54 · **Un artefacto se enseña, no se recrea**: se descarta el redibujo con tokens (cumplía la letra de la política e incumplía su espíritu) y se publica el render REAL de Mermaid, saneado por `scripts/artefacto-svg.ts` —fuera la hoja de estilos a cdnjs, la paleta fija y el pan/zoom del editor—; inline y no `<img>` porque una imagen no ve las variables CSS; el artefacto NO se traduce; el techo de 8 nodos se rompe a propósito; y los dos fallos del traductor (bbox sin acumular `translate`, y cambiar la fuente descuadra los anchos que Mermaid ya calculó)

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

> **Modelo actualizado (2026-08-01): sin fechas.** Se dejaron los sprints datados —eran ficción, vamos más rápido que cualquier calendario y no hay equipo que coordinar—. El campo pasó a **`Etapa`**. **Lo que dirige la ejecución es `MoSCoW` + `Prioridad` (orden) + `Tamaño`**, no el calendario. En las reglas de abajo, donde diga "sprint" léase **"etapa/fase"**, y "sprint activo" = **la etapa en curso**.

> **Qué significa `Etapa` (revisado el 2026-08-10).** Dejó de ser una lista de fases temáticas —había degenerado: 16 de 20 tareas abiertas estaban en *"Optimización"*, así que el eje ya no discriminaba nada— y pasa a contestar **una sola pregunta: ¿esto está comprometido o esperando?** Dos familias en el mismo campo:
>
> - **Sprints** (lo comprometido, con su orden): *Deep-dive · Cómo se ha creado · Footer y contacto*.
> - **Bloques** (backlog temático, aún no comprometido): *General · Home · Brand Kit · Design System · Accesibilidad*.
> - **Cerradas** (solo archivadas, no se usan para tareas nuevas): *V1 (entregado) · Cimientos técnicos · Sobre mí · Contacto avanzado · Optimización · IA conversacional*.
>
> **Regla de movimiento: una tarea de deuda nace en su bloque y cambia de `Etapa` al sprint cuando se compromete** — porque desbloquea algo de ese sprint, o porque toca los mismos archivos y sale gratis hacerla de paso. Es lo que hace que un sprint arrastre deuda con criterio en vez de por lote. El coste asumido: al entrar en un sprint se pierde de qué bloque venía; lo llevan el nombre y las notas, y añadir una séptima propiedad sería peor.

> **`Versión` ≠ `Etapa`.** La etapa dice *cuándo se hace*; la versión, *en qué release sale*. Desde el 2026-08-10: **V2** = los tres sprints de arriba · **V3** = la deuda y mejoras por bloque · **V4** = la IA conversacional. Ver `PRD-Live.md` §9.

- **"To-Do", "En progreso" y "Blocked" están reservados al sprint activo.** Toda tarea de un sprint futuro va en **"Sin empezar"**, sin excepción. Al abrir un sprint nuevo, sus tareas pasan de "Sin empezar" a "To-Do"; al cerrarlo, lo que quede sin hacer se mueve al siguiente sprint y vuelve a "Sin empezar".
- **`Prioridad` es un orden global de ejecución, no una etiqueta de importancia.** Números bajos = antes. Debe ser coherente con el orden de sprints: todo lo del sprint 1 va por delante de todo lo del 2, y así sucesivamente. Dentro de cada sprint, ordena por dependencia — primero lo que desbloquea a otras tareas.
- Las tareas cerradas conservan su prioridad histórica (por debajo de 10); las abiertas van de 10 en adelante. **Para insertar una o varias tareas sueltas, usar decimales es correcto** (ej. `11.5` entre `11` y `12`). **Solo se renumera el bloque abierto entero cuando hay una reestructuración completa de prioridades**, no por inserciones puntuales. *(Aclarado 2026-07-24: antes esta regla mandaba renumerar siempre en vez de meter decimales; se relaja porque renumerar decenas de tareas por un solo insert es desproporcionado.)*
- **`Versión` refleja en qué release sale la tarea de verdad, no dónde se planificó.** Si una tarea se construye antes del deploy de V1, es V1 — aunque en su día se pospusiera a V2.
- **Una tarea a la vez, en su orden de prioridad, con el `Estado` al día — nada de construir por delante del tablero.** Antes de tocar código, la tarea correspondiente se pone en "En progreso"; al terminarla, "Listo". No se salta una tarea de prioridad menor (número más bajo) para empezar otra posterior, aunque compartan trabajo. Si un mismo esfuerzo cubre varias tareas (p. ej. el build de la home repartido en 2-3 tareas de secciones), se **abren y se cierran una a una** conforme se avanza, no en bloque al final. *(Añadido 2026-07-27: se construyó la home entera saltándose la P11.5 —conectar Vercel, de prioridad anterior— y sin ir moviendo Estados; el tablero quedó desincronizado de la realidad y hubo que reconstruir el mapeo a posteriori. La disciplina no es burocracia: es lo que mantiene el tablero como fuente fiable de en qué punto está el proyecto.)*
- **Al cerrar un sprint, sus tareas terminadas pasan a "Archivado".** "Listo" queda reservado a lo terminado del **sprint activo**; el histórico completado de sprints anteriores se archiva (sigue en la base, solo sale de las columnas activas). Lo que quede sin hacer se mueve al siguiente sprint como "Sin empezar". **Además, al cerrar un sprint invoca el skill `sprint-review`**: una revisión técnica crítica del codebase (developer externo, mirada fresca) que detecta deuda/huecos y propone tareas, para que la mejora del andamiaje y de la dinámica no dependa de acordarse de pedirla.

### Gestión de etapas — cuándo se cierra una y se dispara `sprint-review`

Sin fechas, la **etapa en curso** es el sprint de menor `Prioridad` con tareas abiertas (hoy, *Deep-dive*). Se trabaja **una etapa a la vez**, en orden, **pero en dos carriles**: el *build* (técnico/diseño/dev) avanza una etapa cada vez; el *contenido* que solo escribe Francisco corre **en paralelo, por delante**, para desbloquear las secciones futuras (el "contenido primero" — hoy, la definición de Contacto ampliada, que es del sprint 3 y ya está en `To-Do`). Por eso `To-Do`/`En progreso` cubren la **etapa de build activa** *y* el **carril de contenido en marcha**; todo lo demás —sprints futuros y bloques— va en `Sin empezar`. Una etapa **se cierra** cuando todas sus tareas están en Listo/Archivado, o cuando Francisco lo declara ("cerramos Cimientos"). Al cerrarla: (1) se dispara el skill **`sprint-review`** (revisión técnica crítica), (2) sus tareas en Listo pasan a **Archivado**, (3) se hace el **check de medición** (ver abajo). "Listo" queda solo para lo terminado de la etapa en curso.

### Metodología de trabajo (fase V2+)

- **Contenido primero** en secciones bloqueadas por contenido (Sobre mí, Accesibilidad): el texto es el cuello de botella real y solo lo escribe Francisco. Desbloquear el contenido **antes o en paralelo** al diseño/dev; Claude puede redactar un borrador editable (como el CV o Sobre mí) para arrancarlo.
- **Bucle medir→aprender.** Al cerrar cada etapa, revisar los números de GA4 (clics de contacto, descargas de CV, scroll) para informar la priorización. Construir **y** medir — es lo que predica la web ("del discovery al dato").
- **Definition of Done por sección.** Cada tarea de sección nueva hereda el checklist de cierre (los 8 puntos de accesibilidad + SEO/JSON-LD + PageSpeed + responsive + seguridad). Misma vara para todas.
- **Revisión con IA en los PR grandes.** Sin segundo revisor humano, usa `/code-review` (o ultrareview) en cambios sustanciales como segundo par de ojos.
- **Revisión de diseño:** skill `design-review` (cumplimiento del sistema + expresión de marca, verificado en pantalla). **Disparo manual** — antes de construir secciones nuevas o de un release visual grande, o cuando Francisco lo pida; no va enganchada al cierre de etapa como `sprint-review` hasta que se valide.
- **Shippear vs. pulir.** Deja explícito qué es "suficiente para shippear la sección" vs. "pulido"; el pulido va a *Optimización* (Could) y **no bloquea el envío**. Que las secciones salgan en vez de dorarse.

# Fase de desarrollo — convenciones (V1 build)

Las **decisiones** técnicas viven en `DECISIONS.md` (fuente de verdad; hay copia espejo en Notion). Esto son las **reglas** que aplican al escribir código, no negociables salvo que una decisión nueva las cambie.

- **Registro de decisiones.** Producto/diseño/alcance → **estado** en `PRD-Live.md` (spec viva, la que se `@`-importa; con espejo en Notion) y **registro histórico** de decisiones en `PRD-Historical.md` (solo repo). Técnica transversal → `DECISIONS.md` (solo repo; **sin espejo en Notion**; **consultado a demanda vía Read/Grep, NO `@`-importado** — ver «Eficiencia de sesión y arquitectura de contexto» arriba). Convenciones → este archivo. `README.md` → entrada al repo (qué es, stack, arranque, estructura, mapa de docs), **mantenido al día conforme evoluciona el proyecto** — no es un one-off del lanzamiento: al añadir capacidades, o cambiar stack/estructura/scripts, se actualiza. "Por qué" del código → mensaje de commit/PR. Progreso por tarea → notas de Notion (actualiza `Estado` al empezar y al cerrar).
- **Cierre de sesión.** Cuando Francisco indique que se cierra la sesión ("cerramos sesión por ahora", "lo dejamos por hoy" o similar), invoca el skill `close-session`: revisa qué documentación toca actualizar y hazlo — `PRD-Live.md` (+ su espejo en Notion), `PRD-Historical.md` y `DECISIONS.md` (solo repo), `README.md`, el tablero de tareas y, si aplica, `CLAUDE.md`/`BRAND.md`. Es la red de seguridad para que nada quede sin documentar.
- **i18n desde la primera línea.** Cero strings hardcodeados: todo texto sale del diccionario tipado. Locale en `app/[lang]/`, ES sin prefijo (`/`), EN en `/en`. Enrutado en `proxy.ts` (Next 16), no `middleware.ts`. Nombrar assets con locale cuando aplique. El diccionario está **partido por página** en `app/[lang]/dictionaries/{es,en}/` —`common` + una rama por página— y cada página carga la suya (D48). **El diccionario ES es la fuente de verdad del copy; el EN se revisa contra el ES (no traducción literal)** — y, como regla de redacción de ambos, el `kicker`/`eyebrow` de una sección no repite su título (ej. no "Design system / Design System").
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

1. **¿Existe ya la pieza?** — `components/ui/action.tsx` para el control **con caja**, `components/ui/chrome.tsx` para el **enlace de la carpintería** de navegación (`shape` × `tone`), `components/ui/badge.tsx` para el **rótulo que no se pulsa** (`tone` × `kind`), `components/ui/heading.tsx` para el par **eyebrow + titular** (`SectionHeader`), `components/ui/table.tsx` para la **rejilla de filas y celdas** (`DataTable`/`TR`/`TD` si son datos, `SPECIMEN_ROW` si son especímenes), `components/ui/layout.ts` para **cajas y ritmos** (`WRAP`/`SECTION`/`CARD`/`PANEL`/`PAIR`), el resto de primitivas de `components/ui/` (`icons`, `rich`, `info-card`), los bloques de `components/site/`. → **Se usa.** No se replica su aspecto con clases sueltas. **Cuál de las tres capas interactivas toca se decide con dos preguntas: ¿se pulsa?** (no → etiqueta) **y ¿tiene caja propia?** (sí → acción, no → chrome). Un chip que solo rotula no es un botón pequeño, y un enlace de nav tampoco (D36). **Dónde va lo nuevo:** ¿la pieza sabe algo de ESTE sitio (copy, rutas, datos, secciones)? No → `ui/`. Sí → `site/` (D36).
2. **¿No existe, pero el caso es del sistema?** → **Se crea la variante, no el caso.** Un botón que no encaja en ninguna variante no es un botón especial: es una variante que falta. Igual con un bloque que se va a repetir.
3. **¿Es un widget con estado, foco atrapado o portal** (diálogo, popover, tooltip, combobox, menú, tabs, scroll-area)? → **¿shadcn lo trae? → no se escribe.** Se trae con `npx shadcn@latest add <componente>` (estilo `base-nova`, ya configurado en `components.json`) y se le aplican nuestros tokens. El comportamiento de teclado y foco no se escribe a mano. *(Misma forma que la regla de iconos: «¿lucide lo trae? → no se dibuja».)* **Aplica hacia delante, no hacia atrás:** los widgets que hoy están a mano —el `<dialog>` nativo del consentimiento y su switch, las pestañas del Toolkit y los tabs de dispositivo del Design System— están bien hechos y no tienen deuda de accesibilidad; no se reescriben por cumplir la regla. Ver `DECISIONS.md` D6.
4. **¿Nada de lo anterior encaja?** → Lo decide Francisco y se **documenta con fecha** en `BRAND.md`.

**Señal de alarma:** si estás escribiendo una cadena de más de ~4 clases utilitarias para algo accionable, o para una caja que aparece más de una vez, estás en el paso 1 sin haberlo mirado.

**Al cerrar:** si el trabajo creó una variante o un bloque nuevo (paso 2), **se publica en el Design System antes de dar la tarea por hecha**. El recorrido completo —regla → componente → sección publicada → uso— es lo que hace que los enlaces sean difíciles de incumplir y lo que a los botones les faltaba.

### Qué compra esto: la accesibilidad se hereda, no se vuelve a medir

Con el gate cumplido, del checklist de 8 puntos de abajo solo hay que **verificar los que dependen del contenido**: **4** (un solo `h1`, jerarquía sin saltos), **5** (breadcrumb), **6** (nada codificado solo por color) y **8** (alternativas textuales). Esos los pone quien escribe la página, no el componente.

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

*(Cambiado el 2026-08-16, D52. Antes: «con la skill `claude-in-chrome`: Lighthouse desktop + mobile + axe, en claro y oscuro» — un metro que mide en una pestaña **oculta**, con el tema como único eje y disparado una sola vez, al cerrar.)*

Sobre el sitio **servido**, con **`agent-browser`** —Chrome propio en primer plano, donde `:focus`, el LCP, `rAF` y el `IntersectionObserver` sí funcionan— y **conducido por el subagente `viewport-verifier`**, que ya lleva la matriz (cuatro viewports × dos temas + `reduced-motion`), congela el motion antes de medir y devuelve **hallazgos, no el volcado**. No se conduce a mano.

- **Se dispara dos veces, y la primera no es al cerrar.** Si la sección lleva banda o hero dimensionado por `vw`, **mientras se dibuja**: el eje que faltaba no era el tema, era el **alto**, y por ahí se coló D50 (`1536×740` y `1280×618` son un 1920 con el escalado de Windows al 125% y al 150%). Al cerrar, el resto del checklist.
- **Precondición:** la URL se abre **una vez desde la terminal** (`!agent-browser open <url>`) — dentro del sandbox la navegación inicial no funciona, y un comando que cuelga es ese mismo síntoma, no un reintento.
- **Lo que no tapa, y sigue a mano:** el **enlace de salto** de WCAG 2.4.1, que axe no detecta (D46); la **nota de PageSpeed**, que sale de `npm run psi` contra producción y no de `vitals` —que da métricas, no nota— (D49); y los puntos **4, 5, 6 y 8**, que los pone quien escribe la página.

`claude-in-chrome` no se retira: se queda para lo que necesita el navegador **con sesión** —consentimiento guardado, Preview autenticada—, que es la Fase 3 de `design-review`.
