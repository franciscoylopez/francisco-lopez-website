---
name: close-session
description: >
  Checklist de cierre de sesión. Invócalo cuando Francisco indique que termináis por
  ahora — "cerramos sesión por ahora", "lo dejamos aquí/por hoy", "cerrar sesión",
  "hasta aquí" o similar — para revisar y actualizar la documentación que corresponda:
  PRD-Live.md, PRD-Historical.md y DECISIONS.md (todos solo en el repo),
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
| **Estado** de producto / diseño / alcance | `PRD-Live.md` (spec viva, `@`-importada) | Solo repo (**sin espejo desde el 2026-08-19**) |
| **Registro histórico** de producto / diseño / alcance | `PRD-Historical.md` | Solo repo (sin espejo) |
| Decisión técnica / de implementación | `DECISIONS.md` (formato ADR-lite) | Solo repo (sin espejo; **a demanda vía Read/Grep, NO `@`-importado** — D28). **D-entry nuevo → `npm run indices`**, que reescribe el índice de su cabecera (D88) |
| Convención que aplica en adelante | `CLAUDE.md` | — (se `@`-importa, se carga cada sesión) |
| Regla de identidad / marca (core), en presente | `BRAND.md` | — (se `@`-importa) |
| Porqué fechado de una regla de marca (qué se probó, qué falló) | `BRAND-historical.md` | — (**a demanda**, NO `@`-importado — D28) |
| Detalle exhaustivo del logo (tabla de uso, umbrales split→flat, proporciones, rationale) | `BRAND-logo.md` | — (**a demanda**, NO `@`-importado — D28) |
| Overview / stack / estructura / scripts / capacidades nuevas | `README.md` | GitHub. Mantenido al día, **no** es un one-off |
| Progreso, estados y prioridades de tareas | Tablero Notion "Tareas — Web personal" | [Tablero](https://app.notion.com/p/f3ee9a949c58482888423d5917087962) · vista [MoSCoW](https://app.notion.com/p/3a62caec08be81989325c9fce678de5b) |
| "Por qué" de un trozo de código | Mensaje de commit / PR | — |

**Reglas:**
- **El repo es la fuente de verdad de toda la documentación, y ya no hay ningún espejo.**
  En Notion vive el **tablero de tareas** y nada más. *(El de `DECISIONS` y el del PRD
  histórico se retiraron el 2026-07-30; el de `PRD-Live`, el 2026-08-19: era el último, y
  el motivo que lo justificaba —mirar el PRD sin abrir el código— lo cubre desde D68 que el
  repositorio sea PÚBLICO. Su página de Notion es ahora un puntero al archivo de GitHub.)*
  **No vuelvas a crear un espejo.** La misma cosa escrita en dos sitios acaba diciendo dos
  cosas, y este proyecto lo ha cerrado ya por cuatro puertas: los valores publicados (D38),
  las cuatro listas de páginas (D59 abrió la puerta y D72 la cerró), el índice de decisiones
  y esta.
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

**Cuando lo que ha caducado es un RECUENTO, la corrección no es el número nuevo: es dejar de
escribirlo** *(2026-08-23)*. Al añadir `/contacto`, la cifra estaba mal en siete sitios del
`README` y en cuatro de dos skills, y convivían **tres versiones distintas** —24, 26 y trece—
porque cada una había caducado en un momento distinto. La única línea que no había caducado
era la de `design-review`, y dice por qué: *«No se escribe cuántas son —cuando esta línea
decía "seis" ya eran doce, y cuando decía "doce" ya eran trece—: se cuenta el registro»*.
Así que al encontrar un recuento obsoleto, la pregunta no es cuál es el número correcto sino
**si esa frase necesita un número**; casi nunca lo necesita. Se deja escrito solo donde ES el
dato (la portada del `README`) o donde es el RESULTADO de una medición con su fecha (los
pares del censo).

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
   `CLAUDE.md` / `BRAND.md` / `BRAND-historical.md` / `BRAND-logo.md` según lo acordado. La CABECERA de un D-entry
   nuevo importa más de lo que parece: es la línea que acaba en el índice de la cabecera
   de `DECISIONS.md`, que es lo único que se lee antes de abrir nada. Tiene que bastar
   para decidir si abrir esa entrada, porque el índice no tiene texto propio (ver paso 2).
2. **Índices**: si añadiste una sección a `DECISIONS.md`, `PRD-Historical.md` o
   `BRAND-historical.md`, regenéralos con `npm run indices` — se DERIVAN de las
   cabeceras y no se escriben a mano. Si un título no basta para saber si abrir esa
   sección, arregla LA CABECERA, nunca el índice.
3. **El artículo, que casi siempre va a saltar.** `check:articulo` sella **por archivo**
   y esta skill edita justo los archivos sellados —`PRD-Live.md`, `DECISIONS.md`,
   `BRAND.md`, `CLAUDE.md`—, así que **cuenta con que salga rojo**: el 2026-08-22 saltó
   cuatro veces. **No selles por reflejo**, que es exactamente como un guardián deja de
   servir. El orden es: `npm run check:articulo` → **`npm run articulo:novedades`**, que
   dice QUÉ líneas cambiaron en cada dependencia desde el sello vigente y marca las que
   son solo comentarios (D103) → con eso delante, abre en
   `app/[lang]/dictionaries/{es,en}/como-se-ha-creado.json` las secciones que sigan en
   duda y decide. Si sigue siendo cierto, `npm run articulo:sellar`. Si no, corrige el
   copy **ES y EN** (D20) y sella después.
   **Las CIFRAS escritas con letra ya no hay que mirarlas a mano**: desde D102 las que el
   artículo publica se derivan del disco o se sellan al medir, y `check:articulo` no deja
   teclear una nueva. Lo que sí hay que leer es lo que AFIRMA la prosa, que ninguna
   máquina puede juzgar.
4. **Tablero de tareas**: actualiza `Estado` (To-Do → En progreso → Listo; al cerrar
   una etapa, lo terminado → Archivado; el resto sigue abierto en su etapa),
   `Prioridad` y `Etapa` según las **reglas del tablero** de `CLAUDE.md` (no
   negociables). Una tarea a la vez, estado al día.
5. **Commit** de los cambios de repo en rama corta → PR (D12); no directo a `main`.

## Paso 4 · Cierra el bucle
Dile a Francisco **qué se actualizó y qué se dejó igual a propósito**. Si algo quedó
pendiente de su input (una decisión que solo puede tomar él), déjalo anotado.

## Referencias rápidas (Notion)
- New Website (raíz de todo): `39f2caec08be8040b6d4d2bb07ed24e7`
- **PRD Live** (ya NO es espejo: es un puntero al archivo de GitHub): `3ad2caec08be8122b6a4cc379874ed0c`
- Tablero Tareas (base): `f3ee9a949c58482888423d5917087962` · data source `collection://02005967-2f8c-44ff-975c-68b86364d4c4`
- Vista MoSCoW: `3a62caec08be81989325c9fce678de5b`
- *(Ningún documento tiene espejo. Toda la documentación vive en el repo.)*
