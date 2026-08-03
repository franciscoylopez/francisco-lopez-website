---
name: close-session
description: >
  Checklist de cierre de sesión. Invócalo cuando Francisco indique que termináis por
  ahora — "cerramos sesión por ahora", "lo dejamos aquí/por hoy", "cerrar sesión",
  "hasta aquí" o similar — para revisar y actualizar la documentación que corresponda:
  PRD-Live.md (+ su espejo en Notion), PRD-Historical.md y DECISIONS.md (solo repo),
  README.md, el tablero de tareas de Notion y, si aplica, CLAUDE.md / BRAND.md. Evita que
  algo quede sin documentar. También si Francisco lo pide directamente.
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
| **Estado** de producto / diseño / alcance | `PRD-Live.md` (spec viva, `@`-importada) | **Único espejo en Notion:** [PRD Live](https://app.notion.com/p/3ad2caec08be8122b6a4cc379874ed0c) |
| **Registro histórico** de producto / diseño / alcance | `PRD-Historical.md` | Solo repo (sin espejo) |
| Decisión técnica / de implementación | `DECISIONS.md` (formato ADR-lite) | Solo repo. **Al añadir un D-entry nuevo, actualiza también su línea en el índice de `DECISIONS.md` de `CLAUDE.md`** (D28) |
| Convención que aplica en adelante | `CLAUDE.md` | — (se `@`-importa, se carga cada sesión) |
| Regla de identidad / marca | `BRAND.md` (core, `@`-importado); **detalle del logo/assets → `BRAND-logo.md`** (a demanda, no `@`-importado) | — |
| Overview / stack / estructura / scripts / capacidades nuevas | `README.md` | GitHub. Mantenido al día, **no** es un one-off |
| Progreso, estados y prioridades de tareas | Tablero Notion "Tareas — Web personal" | [Tablero](https://app.notion.com/p/f3ee9a949c58482888423d5917087962) · vista [MoSCoW](https://app.notion.com/p/3a62caec08be81989325c9fce678de5b) |
| "Por qué" de un trozo de código | Mensaje de commit / PR | — |

**Reglas:**
- **El repo es la fuente de verdad de toda la documentación.** En Notion **solo vive el
  PRD Live** (espejo de `PRD-Live.md`, para la comprobación cómoda de Francisco).
  `PRD-Historical.md` y `DECISIONS.md` **no tienen espejo** — se quedan solo en el repo.
  Al tocar `PRD-Live.md`, actualiza el repo primero y luego refleja el cambio en su
  página de Notion. *(El espejo de Decisions y el del PRD histórico se retiraron el 2026-07-30.)*
- No dupliques: cada cosa en su documento. **Estado** de producto → `PRD-Live.md`;
  **histórico** de decisiones de producto → `PRD-Historical.md`; técnica → `DECISIONS.md`;
  convención → `CLAUDE.md`; marca → `BRAND.md`.
- **Fechas relativas → absolutas** (p. ej. "hoy" → la fecha real).
- Si algo es ambiguo (¿PRD o DECISIONS? ¿cambia una decisión previa, que se marca
  *Revertida* y se enlaza la nueva?), **pregúntale a Francisco** antes de escribir.

## Paso 2 · Propón antes de aplicar
Preséntale a Francisco la **lista de actualizaciones propuestas** (qué documento, qué
añadir/cambiar) para que confirme, corrija o añada lo que falte. Así no se te escapa
nada ni escribes de más.

## Paso 3 · Aplica
1. **Repo**: edita `PRD-Live.md` / `PRD-Historical.md` / `DECISIONS.md` / `README.md` /
   `CLAUDE.md` / `BRAND.md` / `BRAND-logo.md` según lo acordado. **Si añadiste un D-entry
   nuevo a `DECISIONS.md`, añade su línea al índice de `DECISIONS.md` en `CLAUDE.md`** (D28).
2. **Espejo Notion (solo PRD Live)**: si tocaste `PRD-Live.md`, refleja el cambio en su
   página de Notion. `PRD-Historical.md` y `DECISIONS.md` **no se espejan**. (Usa las
   herramientas `notion-*`; convenciones del workspace — páginas nuevas bajo *New Website*,
   iconos nativos de Notion, sin emojis.)
3. **Tablero de tareas**: actualiza `Estado` (To-Do → En progreso → Listo; al cerrar
   una etapa, lo terminado → Archivado; el resto sigue abierto en su etapa),
   `Prioridad` y `Etapa` según las **reglas del tablero** de `CLAUDE.md` (no
   negociables). Una tarea a la vez, estado al día.
4. **Commit** de los cambios de repo en rama corta → PR (D12); no directo a `main`.

## Paso 4 · Cierra el bucle
Dile a Francisco **qué se actualizó y qué se dejó igual a propósito**. Si algo quedó
pendiente de su input (una decisión que solo puede tomar él), déjalo anotado.

## Referencias rápidas (Notion)
- New Website (raíz de todo): `39f2caec08be8040b6d4d2bb07ed24e7`
- **PRD Live** (único espejo, el que se mantiene): `3ad2caec08be8122b6a4cc379874ed0c`
- Tablero Tareas (base): `f3ee9a949c58482888423d5917087962` · data source `collection://02005967-2f8c-44ff-975c-68b86364d4c4`
- Vista MoSCoW: `3a62caec08be81989325c9fce678de5b`
- *(Decisions ya no tiene espejo en Notion — vive solo en `DECISIONS.md` en el repo.)*
