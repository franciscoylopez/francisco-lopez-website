@AGENTS.md
@BRAND.md
@PRD.md

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
- Las tareas cerradas conservan su prioridad histórica (por debajo de 10); las abiertas van de 10 en adelante. Si al reordenar hace falta hueco, renumera el bloque abierto entero en vez de meter decimales.
- **`Versión` refleja en qué release sale la tarea de verdad, no dónde se planificó.** Si una tarea se construye antes del deploy de V1, es V1 — aunque en su día se pospusiera a V2.
