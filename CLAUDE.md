@AGENTS.md
@BRAND.md
@PRD.md
@DECISIONS.md

# Seguimiento de tareas (Notion)

Las tareas de desarrollo viven en la base de datos "Tareas — Web personal" en Notion: https://app.notion.com/p/f3ee9a949c58482888423d5917087962 (al mismo nivel que el PRD, dentro de "New Website").

Al empezar una sesión de desarrollo:
1. Lee las tareas con Estado "To-Do" del sprint activo, ordenadas por `Prioridad` ascendente.
2. Trabájalas en ese orden, respetando las dependencias señaladas en `Notas` de cada tarea.
3. Actualiza el `Estado` en Notion según avances: "To-Do" → "En progreso" al empezar, "Listo" al terminar.
4. Si una tarea deja de tener sentido tal como está definida (cambia el alcance, se descubre que depende de algo no resuelto, etc.), dilo antes de marcarla "Listo" — no la des por completada a medias.

## Reglas del tablero (no negociables)

- **"To-Do", "En progreso" y "Blocked" están reservados al sprint activo.** Toda tarea de un sprint futuro va en **"Sin empezar"**, sin excepción. Al abrir un sprint nuevo, sus tareas pasan de "Sin empezar" a "To-Do"; al cerrarlo, lo que quede sin hacer se mueve al siguiente sprint y vuelve a "Sin empezar".
- **`Prioridad` es un orden global de ejecución, no una etiqueta de importancia.** Números bajos = antes. Debe ser coherente con el orden de sprints: todo lo del sprint 1 va por delante de todo lo del 2, y así sucesivamente. Dentro de cada sprint, ordena por dependencia — primero lo que desbloquea a otras tareas.
- Las tareas cerradas conservan su prioridad histórica (por debajo de 10); las abiertas van de 10 en adelante. **Para insertar una o varias tareas sueltas, usar decimales es correcto** (ej. `11.5` entre `11` y `12`). **Solo se renumera el bloque abierto entero cuando hay una reestructuración completa de prioridades**, no por inserciones puntuales. *(Aclarado 2026-07-24: antes esta regla mandaba renumerar siempre en vez de meter decimales; se relaja porque renumerar decenas de tareas por un solo insert es desproporcionado.)*
- **`Versión` refleja en qué release sale la tarea de verdad, no dónde se planificó.** Si una tarea se construye antes del deploy de V1, es V1 — aunque en su día se pospusiera a V2.
- **Una tarea a la vez, en su orden de prioridad, con el `Estado` al día — nada de construir por delante del tablero.** Antes de tocar código, la tarea correspondiente se pone en "En progreso"; al terminarla, "Listo". No se salta una tarea de prioridad menor (número más bajo) para empezar otra posterior, aunque compartan trabajo. Si un mismo esfuerzo cubre varias tareas (p. ej. el build de la home repartido en 2-3 tareas de secciones), se **abren y se cierran una a una** conforme se avanza, no en bloque al final. *(Añadido 2026-07-27: se construyó la home entera saltándose la P11.5 —conectar Vercel, de prioridad anterior— y sin ir moviendo Estados; el tablero quedó desincronizado de la realidad y hubo que reconstruir el mapeo a posteriori. La disciplina no es burocracia: es lo que mantiene el tablero como fuente fiable de en qué punto está el proyecto.)*
- **Al cerrar un sprint, sus tareas terminadas pasan a "Archivado".** "Listo" queda reservado a lo terminado del **sprint activo**; el histórico completado de sprints anteriores se archiva (sigue en la base, solo sale de las columnas activas). Lo que quede sin hacer se mueve al siguiente sprint como "Sin empezar".

# Fase de desarrollo — convenciones (V1 build)

Las **decisiones** técnicas viven en `DECISIONS.md` (fuente de verdad; hay copia espejo en Notion). Esto son las **reglas** que aplican al escribir código, no negociables salvo que una decisión nueva las cambie.

- **Registro de decisiones.** Producto/diseño/alcance → `PRD.md`. Técnica transversal → `DECISIONS.md` (+ espejo en Notion). Convenciones → este archivo. `README.md` → entrada al repo (qué es, stack, arranque, estructura, mapa de docs), **mantenido al día conforme evoluciona el proyecto** — no es un one-off del lanzamiento: al añadir capacidades, o cambiar stack/estructura/scripts, se actualiza. "Por qué" del código → mensaje de commit/PR. Progreso por tarea → notas de Notion (actualiza `Estado` al empezar y al cerrar).
- **Cierre de sesión.** Cuando Francisco indique que se cierra la sesión ("cerramos sesión por ahora", "lo dejamos por hoy" o similar), invoca el skill `close-session`: revisa qué documentación toca actualizar y hazlo — `PRD.md` y `DECISIONS.md` (con sus espejos en Notion), `README.md`, el tablero de tareas y, si aplica, `CLAUDE.md`/`BRAND.md`. Es la red de seguridad para que nada quede sin documentar.
- **i18n desde la primera línea.** Cero strings hardcodeados: todo texto sale del diccionario tipado. Locale en `app/[lang]/`, ES sin prefijo (`/`), EN en `/en`. Enrutado en `proxy.ts` (Next 16), no `middleware.ts`. Nombrar assets con locale cuando aplique. **`es.json` es la fuente de verdad del copy; el EN se revisa contra el ES (no traducción literal)** — y, como regla de redacción de ambos, el `kicker`/`eyebrow` de una sección no repite su título (ej. no "Design system / Design System").
- **Server por defecto.** `"use client"` solo en islas interactivas (nav, reveals, contadores, tabs, toggle de tema, preview de dispositivo). Todo lo demás, Server Component.
- **Responsive en CSS/Tailwind**, no en JS. Breakpoints alineados con Tailwind (sm 640 / md 768 / lg 1024 / xl 1280). El contenido apila en móvil; nada de `matchMedia` para maquetar.
- **Tokens, no hex.** Solo tokens de `app/globals.css` (`brand-globals.css` está deprecado). Respeta la regla de dos capas de `BRAND.md`: `primary` (cian) es el único color de acción; el morado es decorativo. Nunca inventes colores.
- **Objetivos no funcionales** (criterios de aceptación, no aspiraciones): PageSpeed/Lighthouse >90; desktop **y** mobile optimizados; accesibilidad AA de suelo, empujar AAA. `next/image` para imágenes, `next/font` para fuentes, minimizar JS de cliente.
- **SEO y datos estructurados por página — criterio de cierre, no un extra.** Igual que el performance, la accesibilidad y el responsive, **al crear una página nueva** hay que resolver su SEO: metadata (title, description, `canonical`, `hreflang`, OG y Twitter por locale) **y el marcado JSON-LD de Schema.org que le corresponda por tipo** — p. ej. `BreadcrumbList` en páginas internas, enriquecer `Person`/`ProfilePage` en la home. Verificarlo con el **Schema Markup Validator** (tipos no elegibles para rich results, como `Person`) **y** la **Rich Results Test** (tipos elegibles, como `BreadcrumbList`), en ES y EN. URLs absolutas vía `SITE_URL` (`lib/site.ts`). Ver `DECISIONS.md` D14/D15.

## Checklist de accesibilidad — gate de cierre de cada página/sección

Antes de dar por cerrada una página o sección, verificar los 8 puntos (es la lista que publica el propio Design System del sitio):

1. **Contraste medido, con cifra, en ambos temas.** AA es el suelo; AAA siempre que se alcance sin coste visual. Verificar también los estados interactivos (hover/focus), no solo el reposo.
2. **Foco visible:** anillo de 2px con `var(--ring)` y offset de 2px en todo elemento interactivo. Nunca `outline:none` sin sustituto.
3. **Objetivos táctiles ≥ 44×44px**, también en controles pequeños (breadcrumb, toggle de tema).
4. **Un solo `h1` por página** y jerarquía `h2`–`h4` sin saltos. El orden de lectura = el orden del DOM.
5. **Breadcrumb** en toda página interna: `<nav aria-label>`, lista ordenada, `aria-current="page"` en el nivel actual.
6. **Nada codificado solo por color:** todo estado/categoría distinguido por color lleva además texto o forma.
7. **`prefers-reduced-motion`** respetado en toda animación (reveals, contadores, transición del nav).
8. **Alternativas textuales:** `alt` y etiquetas donde informan, `aria-hidden` en lo decorativo.

Verificación real por página con la skill `claude-in-chrome`: Lighthouse (desktop + mobile) + axe, en claro y oscuro.
