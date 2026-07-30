---
name: close-session
description: >
  Checklist de cierre de sesión. Invócalo cuando Francisco indique que termináis por
  ahora — "cerramos sesión por ahora", "lo dejamos aquí/por hoy", "cerrar sesión",
  "hasta aquí" o similar — para revisar y actualizar la documentación que corresponda:
  PRD.md (+ espejo en Notion), DECISIONS.md (+ espejo en Notion), README.md, el tablero
  de tareas de Notion y, si aplica, CLAUDE.md / BRAND.md. Evita que algo quede sin
  documentar. También si Francisco lo pide directamente.
---

# Cierre de sesión — checklist de documentación

Objetivo: que nada de lo hecho/decidido en la sesión se quede sin reflejar en su sitio.
No es mecánico: primero **decide qué aplica**, propónselo a Francisco, y luego actualiza.

## Paso 0 · Resume la sesión
Repasa qué se hizo y qué se decidió en esta sesión (código, decisiones, cambios de
alcance, tareas cerradas/abiertas). Sobre eso decides qué documentos tocan.

## Paso 1 · Decide qué documento toca (política de docs del proyecto)

| Tipo de cambio | Documento | Espejo / dónde |
|---|---|---|
| Producto / diseño / alcance | `PRD.md` | Espejo Notion: [PRD](https://app.notion.com/p/39f2caec08be814c9986dcebc2963441) |
| Decisión técnica / de implementación | `DECISIONS.md` (formato ADR-lite) | Espejo Notion: [Decisions](https://app.notion.com/p/3a72caec08be800b96d1cf5e6e11fa2c) |
| Convención que aplica en adelante | `CLAUDE.md` | — (se `@`-importa, se carga cada sesión) |
| Regla de identidad / marca | `BRAND.md` | — |
| Overview / stack / estructura / scripts / capacidades nuevas | `README.md` | GitHub. Mantenido al día, **no** es un one-off |
| Progreso, estados y prioridades de tareas | Tablero Notion "Tareas — Web personal" | [Tablero](https://app.notion.com/p/f3ee9a949c58482888423d5917087962) · vista [MoSCoW](https://app.notion.com/p/3a62caec08be81989325c9fce678de5b) |
| "Por qué" de un trozo de código | Mensaje de commit / PR | — |

**Reglas:**
- **El repo es la fuente de verdad** de `PRD.md` y `DECISIONS.md`; Notion es **espejo**.
  Actualiza el repo primero y luego refleja el mismo cambio en la página de Notion.
- No dupliques: cada cosa en su documento según la tabla. Producto→PRD, técnica→DECISIONS,
  convención→CLAUDE.md, marca→BRAND.md.
- **Fechas relativas → absolutas** (p. ej. "hoy" → la fecha real).
- Si algo es ambiguo (¿PRD o DECISIONS? ¿cambia una decisión previa, que se marca
  *Revertida* y se enlaza la nueva?), **pregúntale a Francisco** antes de escribir.

## Paso 2 · Propón antes de aplicar
Preséntale a Francisco la **lista de actualizaciones propuestas** (qué documento, qué
añadir/cambiar) para que confirme, corrija o añada lo que falte. Así no se te escapa
nada ni escribes de más.

## Paso 3 · Aplica
1. **Repo**: edita `PRD.md` / `DECISIONS.md` / `README.md` / `CLAUDE.md` / `BRAND.md`
   según lo acordado.
2. **Espejos Notion**: refleja los mismos cambios en las páginas PRD y Decisions
   (usa las herramientas `notion-*`; recuerda las convenciones del workspace —
   páginas nuevas bajo *New Website*, iconos nativos de Notion, sin emojis).
3. **Tablero de tareas**: actualiza `Estado` (To-Do → En progreso → Listo; al cerrar
   sprint, lo terminado → Archivado y lo pendiente → "Sin empezar" del siguiente),
   `Prioridad` y `Sprint` según las **reglas del tablero** de `CLAUDE.md` (no
   negociables). Una tarea a la vez, estado al día.
4. **Commit** de los cambios de repo en rama corta → PR (D12); no directo a `main`.

## Paso 4 · Cierra el bucle
Dile a Francisco **qué se actualizó y qué se dejó igual a propósito**. Si algo quedó
pendiente de su input (una decisión que solo puede tomar él), déjalo anotado.

## Referencias rápidas (Notion)
- New Website (raíz de todo): `39f2caec08be8040b6d4d2bb07ed24e7`
- PRD (espejo): `39f2caec08be814c9986dcebc2963441`
- Decisions (espejo): `3a72caec08be800b96d1cf5e6e11fa2c`
- Tablero Tareas (base): `f3ee9a949c58482888423d5917087962` · data source `collection://02005967-2f8c-44ff-975c-68b86364d4c4`
- Vista MoSCoW: `3a62caec08be81989325c9fce678de5b`
