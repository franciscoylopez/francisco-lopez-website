---
name: publicar-en-design-system
description: Publicar una pieza nueva de `components/ui/` en el Design System (o en el Brand Kit, si es de marca). Invócalo cuando `npm run check:indices` liste una pieza «sin publicar», cuando el trabajo haya creado una variante o un bloque nuevo, o cuando Francisco diga «publica X en el Design System», «falta documentar esta pieza» o «esto hay que enseñarlo en la página». No sirve para retocar el COPY de una sección ya publicada: eso es una edición normal del diccionario.
---

# Publicar una pieza en el Design System

> **Por qué existe.** `CLAUDE.md` dice desde hace meses: *«si el trabajo creó una variante o
> un bloque nuevo, se publica en el Design System antes de dar la tarea por hecha»*. La regla
> estaba escrita y **no tenía ni disparador ni plantilla**, así que se incumplió dos veces
> seguidas: `stat-row` nació el 2026-08-19 y llegó al 22 sin sección, y la §15 se entregó como
> una caja con las piezas dentro y hubo que rehacerla a mano. **D83 ya había nombrado ese
> segundo fallo y no impidió que se repitiera**, que es la señal de que faltaba portador.
>
> Ahora el disparador existe: `npm run check:indices` (D89) nombra en cada PR las piezas sin
> publicar, y una pieza nueva que declare `pendiente` (o `interna`) sin motivo escrito
> **falla**. Esta skill
> es el cómo.

## Paso 0 · ¿Dónde va, y va de verdad?

Tres preguntas, en este orden:

1. **¿Es del sistema o es de la marca?** Design System publica cómo se comporta una pieza
   (`action`, `chrome`, `badge`, `heading`, `table`, `stat-row`, `layout`); Brand Kit publica
   lo que es identidad (`logo`, `icons`). Si dudas, mira dónde está publicada su vecina en
   [`components/ui/README.md`](../../../components/ui/README.md).
2. **¿Sección nueva o subapartado de una que ya existe?** **Por defecto, subapartado.** Una
   sección nueva cuesta un ordinal (D43), una rama de diccionario, una entrada en `index.tsx`
   y mueve la cifra de secciones que publica `PRD-Live.md`. Se justifica solo cuando la pieza
   es una **capa** —como hizo la de artículo largo en §15—, no cuando es una pieza más.
   Busca la sección cuyo **título** ya cubre el caso: `stat-row` entró en §11 porque su
   titular es «Toda página y toda sección abren igual» y la fila de cifras es justo lo que va
   debajo de esa apertura.
3. **¿Se puede enseñar con la pieza real?** Si la respuesta es no, no se publica una imitación:
   se replantea la demo. Esa es la promesa de la página («las piezas reales del sitio como
   demo») y lo que hace que la página no pueda mentir.
4. **Y si la respuesta sigue siendo no, la pieza NO SE PUBLICA — y eso se declara** (D117).
   Es la cuarta salida y existe desde el 2026-08-26: hay piezas sin demo posible porque no
   pintan nada (`rich.tsx` es infraestructura de texto; `marcas.tsx` solo añade un atributo
   invisible, así que su sección mostraría un texto idéntico al de al lado). Declaran
   `interna` en vez de `pendiente` y van a `INTERNAS` con su motivo. **Publicar una sección
   que no enseña nada para bajar un contador es el metro mandando sobre el criterio.**

Si sale «sección nueva», **dilo antes de escribirla**: cambia una cifra publicada y es una
decisión de Francisco.

## Paso 1 · Lee la vecina antes de escribir nada

**No escribas la sección desde cero: abre la que más se le parezca y cópiale la estructura**,
no el contenido. Es el paso que se saltó la §15. Buenas vecinas por tipo de pieza:

| Si la pieza es… | Abre | Por qué |
|---|---|---|
| Un control o una variante | `components/site/design-system/09-botones.tsx` | especímenes con ficha, uno por variante |
| Un rótulo o algo pequeño | `components/site/design-system/10-etiquetas.tsx` | dos ejes cruzados en rejilla |
| Un par o una composición | `components/site/design-system/11-cabeceras.tsx` | tres subapartados con su propio ritmo |
| Una capa entera | `components/site/design-system/15-articulo.tsx` | cinco subapartados, el caso grande |

## Paso 2 · El molde, que no se escribe a mano

Un archivo por sección (**D42**), y dentro:

```tsx
export function Pieza({ t }: { t: Dictionary["designSystem"]["pieza"] }) {
  return (
    <section data-reveal className={SECTION}>
      <div className={WRAP}>
        <SectionHeader eyebrow={t.num} title={t.title} size="section-sm">
          <p className="text-muted-foreground m-0 mb-10 max-w-[var(--measure)] text-[0.95rem]">
            {t.lead}
          </p>
        </SectionHeader>
        {/* … subapartados … */}
      </div>
    </section>
  );
}
```

Y las tres piezas que ya existen para el interior, **que son la plantilla de verdad** y viven
en `components/site/design-system/shared.tsx`:

- **`GroupHead`** — el par `h3` + entradilla de cada subapartado. `first` para el primero, que
  no necesita separarse de la entradilla de la sección. **Si tu sección tiene más de un
  bloque, tiene subapartados**: dejar caer las piezas seguidas sin contexto es exactamente
  lo que hubo que rehacer en la §15 (D83).
- **`SpecimenCard`** — la demo arriba sobre fondo de página y la ficha debajo sobre `--card`:
  `kicker` (rótulo), `cls` (el nombre real de la pieza o su clase, en monoespaciada), `rule`
  (qué resuelve) y `note` opcional (la letra pequeña, tras el filete discontinuo). `wide` para
  franjas y rejillas enteras.
- **`TypeMeta`** — el par etiqueta/valor de una ficha en rejilla.

**El ordinal va DENTRO del eyebrow** (`eyebrow={t.num}`, con la forma `11 — Cabeceras`), nunca
en monoespaciada aparte: es D43, y nació de tres copias privadas que lo pintaban distinto.

**Un espécimen no entra en el esquema de encabezados.** Los titulares de muestra van en
`<span>` o `<p>`, nunca en `<h1>`/`<h2>`: un lector de pantalla los anunciaría como secciones
que no existen. Los `h3` son solo los de `GroupHead`.

**Dos tarjetas de nota van en `PAIR`, nunca apiladas.** Si al cerrar la sección tienes la
ficha de la pieza y la nota de la regla, van una al lado de otra
(`<div className={cn(PAIR, "mt-8")}>`), como ya hacen §09 y §11. Apiladas a
`max-w-[var(--measure)]` dejan media sección vacía a la derecha y hacen crecer la página en
vertical sin ganar nada (P37.62). **Una sola** sí va a la medida de lectura.

## Paso 3 · El copy, y los valores que no son copy

- El texto va al diccionario partido: `app/[lang]/dictionaries/es/design-system.json` **y**
  su gemelo en `en/`. **El ES es la fuente de verdad y el EN se revisa contra él**, no se
  traduce literal (D20).
- **Un valor no es copy.** Si la sección publica una cifra del sistema —un token, un
  breakpoint, un ratio de contraste—, sale de `lib/design-values.ts` o de la propia constante
  del código, nunca del diccionario (D38). La regla literal: si la entrada ES y la EN son
  carácter por carácter la misma, es un valor con dos copias.
- **Sin raya (`—`) en el copy que se sirve**, salvo el ordinal del eyebrow. Lo comprueba
  `npm run check:raya`.

## Paso 4 · Engancha la pieza

1. Si es sección nueva: impórtala en `components/site/design-system/index.tsx`, en su orden.
2. **Actualiza la línea `@pieza` del archivo en `components/ui/`**: la publicación deja de ser
   `pendiente` y pasa a ser la ruta de su sección **relativa a `components/site/`**.
3. **Quítala de `SIN_PUBLICAR`** en `scripts/indices.ts`, o `check:indices` avisará de que
   sobra la excusa. Son **dos** listas desde D117 —`SIN_PUBLICAR` para lo que declara
   `pendiente`, `INTERNAS` para lo que declara `interna`— y las dos son
   `Record<archivo, motivo>`: **el motivo es un dato y se deriva al inventario**, así que se
   escribe pensando en quien lo va a leer ahí, no como comentario suelto.
4. `npm run indices` para regenerar `components/ui/README.md`.

## Paso 5 · Cierre

- `npm run check:indices` — tiene que decir que la sección declarada **importa** la pieza. Si
  no la importa, es que la demo no es la pieza real.
- `npm run check:raya` · `npm run typecheck` · `npm run lint` · `npm run format`.
- `npm run check:marco` — jerarquía de encabezados sin saltos, sobre el HTML prerenderizado.
- **Accesibilidad heredada, no re-medida** (DoD columna A, punto 3): sale de piezas que ya
  existen, así que contraste, foco, 44px y `reduced-motion` vienen dados. **Y la condición de
  re-medir ya no hay que leerla**: si la sección introduce un token de color, una superficie o
  una animación, `npm run check:palette` sale rojo nombrándolo y manda pasar `npm run censo`
  (D90). Una demo de superficies lo dispara, que es justo el caso que se coló.
- **`npm run gate:html` no aplica aquí**: publicar cambia el HTML a propósito. Es el gate de
  los refactors que se dicen transparentes (D42).
- Si la pieza no estaba en el `README.md` derivado, el PR no está terminado.

## Lo que esta skill NO hace

No decide si la pieza debe existir —eso es la «Regla de construcción» de `CLAUDE.md`— ni
retoca el copy de una sección ya publicada. Y no publica en el Brand Kit por su cuenta: si la
pieza es de identidad, la estructura es la misma pero la vecina que hay que abrir está en
`components/site/brand-kit/`.
