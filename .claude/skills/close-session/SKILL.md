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
| Decisión técnica / de implementación | `DECISIONS.md` (formato ADR-lite) | Solo repo (sin espejo; **a demanda vía Read/Grep, NO `@`-importado** — D28). **D-entry nuevo → su línea al índice de `CLAUDE.md`** |
| Convención que aplica en adelante | `CLAUDE.md` | — (se `@`-importa, se carga cada sesión) |
| Regla de identidad / marca (core), en presente | `BRAND.md` | — (se `@`-importa) |
| Porqué fechado de una regla de marca (qué se probó, qué falló) | `BRAND-historical.md` | — (**a demanda**, NO `@`-importado — D28) |
| Detalle exhaustivo del logo (tabla de uso, umbrales split→flat, proporciones, rationale) | `BRAND-logo.md` | — (**a demanda**, NO `@`-importado — D28) |
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
  convención → `CLAUDE.md`; marca (core) → `BRAND.md`; el porqué fechado de esa regla → `BRAND-historical.md`; detalle del logo → `BRAND-logo.md`.
- **Fechas relativas → absolutas** (p. ej. "hoy" → la fecha real).
- Si algo es ambiguo (¿PRD o DECISIONS? ¿cambia una decisión previa, que se marca
  *Revertida* y se enlaza la nueva?), **pregúntale a Francisco** antes de escribir.

### Y las SKILLS también caducan — el documento que nadie mira al cerrar

*(Añadido el 2026-08-18, y no en abstracto: lo detectó Francisco preguntando «¿la skill de
`update-cv` está al día?». No lo estaba. En **un solo día**, mover los bullets del CV a
`content/experience-copy/` (D57) y los hechos al registro (D58) dejó **nueve** afirmaciones
falsas dentro de esa skill — una de ellas peligrosa: «retocar un bullet del CV no afecta a la
web», que desde D57 es exactamente al revés. Y `design-review` seguía recorriendo «las seis
páginas» cuando ya eran doce.)*

**Una skill es documentación ejecutable, y por eso su drift es peor que el de un `.md`:** un
párrafo desactualizado se lee con escepticismo; una skill se **sigue**. Así que al cerrar,
la pregunta no es solo qué documento toca, sino:

> **¿Esta sesión ha movido algo que una skill DESCRIBE?** Un archivo que cambió de sitio, un
> campo que cambió de dueño, un comando nuevo, un recuento (páginas, variantes, rutas), un
> gate que se añadió.

Si la respuesta es sí, se abre la skill y **se comprueba, no se recuerda**: que existan las
rutas que nombra, que existan los comandos, y que sus afirmaciones sigan siendo ciertas.
Barato y mecánico:

```bash
# Rutas y comandos que la skill afirma
grep -oE '`[a-z0-9_/.-]+\.(ts|tsx|json|md)`' .claude/skills/<skill>/SKILL.md | tr -d '`' | sort -u \
  | while read -r f; do [ -e "$f" ] || echo "FALTA $f"; done
grep -oE 'npm run [a-z:]+' .claude/skills/<skill>/SKILL.md | sort -u
```

**Y mira también las cabeceras de los archivos que tocaste**: el comentario que explica un
módulo caduca igual que una skill y nadie lo relee. En esta misma sesión, `scripts/cv/facts.ts`
seguía anunciando que leía «periodos y roles» del diccionario meses después de dejar de
hacerlo.

## Paso 1 bis · Y ahora al revés: ¿qué se puede RETIRAR?

> **Este paso existe porque el que faltaba era este.** El análisis de metodología del
> 2026-08-19 lo dejó en una frase: *este método tiene una operación de añadir excepcional
> y no tiene operación de retirar*. Cada fallo se convierte en regla, cada regla en
> guardián, cada guardián en párrafo — sesenta y ocho veces, que es más de lo que hace
> casi nadie. Pero nada se colapsa nunca, y esta skill era el sitio donde se notaba:
> preguntaba qué documento hay que actualizar y **nunca** qué documento se puede colapsar.
>
> Lo que produjo esa asimetría, medido: `PRD-Live.md` con 40 fechas y 67 D-refs pese a
> declararse present-tense; el contexto `@`-importado duplicado en diez días; y un 19 de
> agosto con 941 líneas de markdown añadidas y 252 retiradas. Los documentos eran el único
> artefacto del repo sin compactación — el diccionario se partió (D48), los showcase se
> partieron (D42), `BRAND.md` se partió una vez y duró cuatro días.

Antes de proponer nada, contesta estas tres. **Con «no» explícito si es que no**: la
respuesta silenciosa es la que dejó crecer el contexto un 113%.

1. **¿Algo de lo escrito hoy SUSTITUYE a un párrafo que ya está**, en vez de añadirse a su
   lado? Una cifra corregida se sustituye en todos los párrafos que la citan; una nota
   fechada al pie no corrige el texto de arriba (`BRAND.md` §Cómo medir sin equivocarse, 6).
2. **¿Algún párrafo FECHADO de `PRD-Live.md` o `BRAND.md` ya es historia?** Si una frase
   lleva fecha, o cuenta lo que se probó y se descartó, no es de un documento en presente:
   su sitio es `PRD-Historical.md` o `BRAND-historical.md`, que van a demanda y por tanto
   no cuestan tokens por sesión.
3. **¿Alguna regla ha quedado escrita en DOS de los `@`-importados?** La misma decisión en
   dos sitios acaba diciendo dos cosas (`BRAND.md` §Cómo se escribe una regla, 5). Ahí va
   el puntero y el porqué específico, nunca la copia.

Y el número: **`npm run check:contexto`**. Publica el peso de los cuatro `@`-importados,
su techo y la distancia al objetivo. Si el total ha subido respecto a la sesión anterior
sin que haya entrado una regla nueva de verdad, es que se ha añadido donde tocaba
sustituir.

## Paso 2 · Propón antes de aplicar
Preséntale a Francisco la **lista de actualizaciones propuestas** (qué documento, qué
añadir/cambiar) para que confirme, corrija o añada lo que falte. Así no se te escapa
nada ni escribes de más.

**La lista lleva las dos columnas: lo que se AÑADE y lo que se RETIRA.** Una propuesta de
cierre en la que la segunda columna está siempre vacía es la señal de que el paso 1 bis se
ha contestado por inercia.

## Paso 3 · Aplica
1. **Repo**: edita `PRD-Live.md` / `PRD-Historical.md` / `DECISIONS.md` / `README.md` /
   `CLAUDE.md` / `BRAND.md` / `BRAND-historical.md` / `BRAND-logo.md` según lo acordado. **Si añadiste un D-entry
   nuevo a `DECISIONS.md`, añade también su línea al índice de `CLAUDE.md`** (D28): el
   índice es lo único que se carga en cada arranque, así que una decisión que no está en
   él es una decisión que nadie sabrá que existe para ir a leerla.
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
