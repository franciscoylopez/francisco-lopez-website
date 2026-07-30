---
name: sprint-review
description: >
  Revisión técnica crítica del codebase con mirada de developer externo que lo ve por
  primera vez: calidad de código, escalabilidad, deuda técnica, resiliencia, drift
  docs↔código y huecos en PRD/DECISIONS. Invócalo al CERRAR UN SPRINT (o si Francisco lo
  pide) para que las mejoras se detecten de forma recurrente sin depender de acordarse.
  Termina proponiendo y creando tareas para los hallazgos reales, sin duplicar las ya
  tareadas. No es una review de un diff/PR (eso es /code-review), sino del proyecto entero.
---

# Revisión técnica de cierre de sprint

Al cerrar cada sprint, un developer que **acaba de aterrizar** en el repo hace un análisis
**crítico y justo** de todo lo que hay, para pulir el andamiaje y la dinámica de trabajo
antes de que se acumule deuda. La primera vez que se hizo (2026-07-30) salieron: falta de
CI, ausencia de páginas de error propias, drift docs↔código, `shadcn` mal ubicado, PRD
como diario en vez de spec viva, espejos de Notion que se desincronizan solos.

## Principios (no negociables)
- **Mirada fresca y honesta.** Escribe como si no conocieras la historia: ¿me oriento?,
  ¿qué me sorprende?, ¿qué me costaría mantener? **Calibra con lo que está bien** (para no
  inventar problemas) y sé **duro** con lo que no.
- **Basado en el código real, no de memoria.** Lee antes de opinar.
- **No cambiar por cambiar.** Cada hallazgo lleva **severidad** y un **"¿por qué importa?"**.
  Distingue lo accionable ya de lo "solo si crece".
- **No dupliques.** Antes de proponer tareas, **consulta el tablero** (incluidas las de
  revisiones anteriores) y no repitas lo ya tareado.

## Barrido (qué mirar)
1. **Tamaño y forma**: `wc -l` por área; archivos gigantes; componentes/funciones enredados.
2. **Deuda declarada**: `any`, `@ts-ignore`/`@ts-expect-error`, `TODO/FIXME/HACK`,
   `eslint-disable` — cuántos y si están justificados.
3. **Andamiaje**: ¿hay CI (`.github/workflows`)?, tests, `error.tsx`/`not-found.tsx`/`loading.tsx`, boundaries.
4. **Config/calidad**: `tsconfig` (`strict`, `noUncheckedIndexedAccess`), eslint, `package.json`
   (¿deps mal ubicadas —p. ej. una CLI en `dependencies`—?, versiones).
5. **Escalabilidad**: patrones que hoy no duelen pero dolerán con más páginas/lógica; fuentes
   únicas vs duplicación; a11y/perf ¿manual o automatizado?
6. **Resiliencia**: 404/500 propios, manejo de errores, estados de carga.
7. **Drift docs↔código**: ¿los docs marcan "pendiente" algo ya hecho (o al revés)?, ¿referencias rotas?
8. **Docs**: ¿`PRD-Live.md` refleja el estado real?, ¿`DECISIONS.md` al día?, ¿huecos/dudas de
   producto o técnica que poner sobre la mesa?, ¿algún doc sobra, falta, o hay que simplificar?
9. **Limpieza**: archivos muertos/deprecados; contenido en carpetas que no le tocan.
10. **Dinámica/proceso**: qué revela el estado del repo sobre cómo se trabaja (fricciones que se
    repiten, pasos manuales frágiles) — alimenta la mejora continua de la forma de trabajar.

Herramientas: `Bash`/`Grep`/`Glob` para el barrido; `Read` para los archivos grandes y los
puntos de entrada (routing, layout, `lib/`); cruza con `PRD-Live.md` / `PRD-Historical.md` /
`DECISIONS.md` para drift y huecos.

## Salida
1. **Análisis escrito**: veredicto rápido → fortalezas (para calibrar) → hallazgos **por
   severidad** (pronto / escala / limpieza, cada uno con "¿por qué importa?") → sección de
   docs → huecos y dudas abiertas → **recomendaciones priorizadas** (marcando qué es "ya" y
   qué es "solo si crece").
2. **Propón antes de crear.** Preséntale a Francisco los hallazgos y la lista de tareas
   sugeridas para que confirme, ajuste o descarte.
3. **Crea/actualiza tareas** en el tablero para lo acordado, respetando las **reglas del
   tablero** de `CLAUDE.md` (Estado, MoSCoW, Prioridad con decimales para insertar, Área,
   Versión, Sprint, Tamaño). Sin duplicar las existentes.

## Relación con otros flujos
- Es la revisión **técnica/de código**; el cierre de **documentación** de sesión lo hace el
  skill `close-session` (cadencia distinta: sesión vs sprint).
- El **archivado de tareas** del sprint que cierra (terminadas → Archivado; pendientes →
  "Sin empezar" del siguiente) sigue las reglas del tablero de `CLAUDE.md`; hazlo junto con
  esta revisión.
- *(Futuro: podrían añadirse revisiones hermanas de Diseño y de Copy; esta cubre Desarrollo.)*

Tablero de tareas y su data source: ver "Referencias rápidas" del skill `close-session`.
