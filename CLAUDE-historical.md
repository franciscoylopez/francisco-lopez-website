# Convenciones — registro histórico

> **Por qué existe este archivo.** `CLAUDE.md` es el documento de convenciones que se
> `@`-importa en **cada arranque de sesión**, y llevaba dentro el caso que escribió cada
> regla. Aquí viven esos casos; en `CLAUDE.md` queda solo la regla en presente. Es el
> mismo corte que `BRAND.md` ↔ `BRAND-historical.md` hizo el 2026-08-09 y que funcionó,
> y por el mismo motivo: **el coste de una sesión lo domina lo que se precarga.**
>
> **Se consulta a demanda (Read/Grep), NUNCA se `@`-importa.**
>
> **Qué NO está aquí: ninguna regla viva.** Al partir se revisó párrafo por párrafo, y lo
> que era regla —no historia— se quedó en `CLAUDE.md` en presente antes de mover el resto.
> Si al leer algo de aquí te parece que enuncia una regla que `CLAUDE.md` no tiene, eso es
> un fallo del split y se corrige allí, no se aplica desde aquí. El riesgo no es teórico:
> en `BRAND.md` ya cobró su pieza, con un párrafo histórico contradiciendo al vigente
> durante cuatro días.
>
> **Cuándo leerlo. Antes de CAMBIAR una regla de `CLAUDE.md`, no antes de aplicarla.** Casi
> todas nacieron corrigiendo algo, y el caso es lo único que impide que se reviertan por
> parecer arbitrarias. Aplicarlas no necesita el relato; discutirlas, sí.

Partido el **2026-08-27** (P68.5908). Ver `DECISIONS.md` D130.

---

<!-- ÍNDICE · lo genera `npm run indices`; no se edita a mano -->
- [Eficiencia de sesión](#eficiencia-de-sesión)
- [El tablero](#el-tablero)
- [La regla de construcción](#la-regla-de-construcción)
- [Cómo se verifica](#cómo-se-verifica)
- [La Definition of Done](#la-definition-of-done)
- [Lo que el bucle de medición predica](#lo-que-el-bucle-de-medición-predica)
- [El kicker no repite el breadcrumb](#el-kicker-no-repite-el-breadcrumb)
- [El sello que se puso sobre una foto — 2026-08-30](#el-sello-que-se-puso-sobre-una-foto--2026-08-30)
- [La retirada en lote — 2026-08-31](#la-retirada-en-lote--2026-08-31)
<!-- FIN ÍNDICE -->

## Eficiencia de sesión

**El régimen es la misma distinción que ya separaba el PRD.** `PRD-Live.md` se `@`-importa y
`PRD-Historical.md` se consulta (D28); `BRAND.md` ↔ `BRAND-historical.md` repitió el corte el
2026-08-09; `CLAUDE.md` ↔ este archivo lo completa el 2026-08-27. Los cuatro documentos que
quedan precargados son reglas activas y nada más.

**Y la escalera de números, con su porqué, vive en `scripts/check-contexto.ts`**, no aquí: el
techo, el objetivo, los dos techos de skills y las fechas de cada peldaño están en la cabecera
del propio guardián, que es donde se leen cuando hace falta.

**El modelo por tarea es la palanca de menor ROI por fricción**, y por eso la convención dice
avisar a nivel de bloque o de sesión y nunca por micro-tarea. Conmutar de modelo cada vez que
cambia el tipo de trabajo cuesta más atención de la que ahorra en coste.

## El tablero

**`General` ya se comió el eje una vez.** El campo `Etapa` mezcla dos familias —sprints
comprometidos y bloques de backlog—, y eso funciona mientras «General» signifique
*transversal*. Cuando empezó a significar «no sé dónde ponerla», degeneró: con «Optimización»
llegó a acumular el 80 % del tablero. De ahí la regla de que una tarea de una página o de una
capa concreta va a su bloque, nunca a `General`.

**La regla de movimiento tiene un coste asumido, y se eligió a sabiendas.** Cuando una tarea
de deuda pasa de su bloque al sprint que la compromete, **se pierde de qué bloque venía**. Lo
llevan el nombre y las notas. La alternativa era una séptima propiedad en la base, y añadirla
sería peor que el problema que resuelve: un eje más que mantener coherente para recuperar un
dato que casi nunca se consulta.

**Por qué `General` se drena por cupo y los demás bloques no.** La regla de movimiento vale
para los bloques de página porque antes o después un sprint los toca — cada página vuelve a
abrirse. `General` es transversal, así que no lo toca nada: sin cupo obligatorio crece
indefinidamente. Su drenaje real medido al cerrar «Páginas hermanas» eran **dos tareas
archivadas en toda su vida**.

**Por qué `Tanda` es genérica y no lleva el nombre del sprint.** `Tanda 1`…`Tanda 5` se
repueblan al abrir cada sprint. Con etiquetas nombradas por sprint, el desplegable se
acumularía hasta no decir nada: veinte valores muertos por cada cinco vivos. El coste es que
la tanda 1 de un sprint y la de otro no son lo mismo, y se asume porque `Tanda` es de lectura
visual y quien manda es `Prioridad`.

**El escalón de versiones, tal como se fijó el 2026-08-10:** V2 = los tres sprints de valor
para el visitante · V3 = la deuda y mejoras por bloque · V4 = la IA conversacional. Y la
regla de que la versión refleja dónde SALE la tarea y no dónde se planificó nació con V1: una
tarea construida antes de aquel deploy era V1 aunque en su día se hubiera pospuesto a V2.

**La ficha caducada la escribieron cinco fallos en dos tandas.** En las tandas 3 y 4 de
«Páginas hermanas» fallaron cinco premisas: dos recuentos mal, una tarea que ya había resuelto
otro PR el mismo día en que se abrió, y dos alcances que eran otra cosa. De ahí que verificar
la premisa contra el disco sea obligatorio antes de dar una tarea por mecánica, y que el
descarte se escriba en la ficha — si no, vuelve.

## La regla de construcción

**La lista de piezas estaba escrita a mano en cinco sitios y ninguno acertaba** (D89). Por eso
`components/ui/README.md` se deriva del disco con `npm run indices` y la instrucción es
«ábrelo, no lo supongas»: cualquier lista de componentes mantenida a mano es una lista falsa
en cuanto alguien añade un archivo.

**La skill `publicar-en-design-system` existe porque la regla llevaba meses escrita y se
incumplió dos veces.** El diagnóstico de D89: lo que impide el drift no es la disciplina, es
el **recorrido completo** —regla → componente → sección publicada en el Design System → uso—.
Los enlaces lo hicieron entero y son coherentes; los botones se quedaron en el primer paso y
por eso derivaron.

**Los widgets que hoy están a mano, y que la cascada NO obliga a reescribir:** el `<dialog>`
nativo del consentimiento y su switch, las pestañas del Toolkit y los tabs de dispositivo del
Design System. Están bien hechos y no tienen deuda de accesibilidad. La regla de «¿lo trae la
plataforma? ¿lo trae shadcn?» (D6, D120) aplica hacia delante.

**El punto 9 del checklist lo pone la capa de página, no el componente:** `<PageShell>` emite
el enlace de salto (D46) y `check:marco` lo comprueba en CI.

**Dos casos que dejaron su marca en las convenciones de código:**

- **El `fixed` apilado** (P68.57): el capítulo doce del artículo metió el riel de secciones
  **debajo del nav**, porque el riel se centraba sobre el viewport y su alto crece con el
  contenido mientras el viewport no. De ahí que un `fixed` que apila N elementos se acote al
  hueco que le queda.
- **La notación de un token** (P37.5996): el mismo radio estaba escrito de tres formas
  —`rounded-lg`, `rounded-[var(--radius-lg)]` y `rounded-[14px]`— que compilan a lo mismo. La
  regla de «una sola notación: la utilidad» salió de ahí.

Y la **excepción de las ilustraciones** incluye el navegador de mentira del Brand Kit, además
de los marcos de dispositivo, los esqueletos y el «0» del 404.

## Cómo se verifica

**El eje que le faltaba al gate de accesibilidad no era el tema, era el ALTO** (D50, D52). Por
eso tiene dos disparos y el primero es *mientras se dibuja*: al cerrar, el alto de una banda
dimensionada por `vw` ya no es un ajuste sino un rediseño.

**Por qué `agent-browser` y no el navegador de la sesión** *(retirado de la convención el
2026-08-28, P50.72)*: es un Chrome propio en **primer plano**, y ahí `:focus`, el LCP, `rAF` y
el `IntersectionObserver` sí funcionan. En una pestaña oculta no, y el metro miente sin decirlo.

**Lo del sandbox no es solo la navegación.** Bajo el sandbox de Bash **ningún** comando llega
al daemon de `agent-browser`, ni con la página ya cargada. Un comando que se queda colgado es
ese síntoma, y lo que toca es desactivar el sandbox — no reintentar, y no abrir la URL desde
la terminal (D51).

**El enlace de salto no lo detecta ninguna herramienta automática**, y por eso lo mira
`check:marco` a mano: la regla de bypass de axe se da por satisfecha con landmarks o
encabezados, así que una página sin enlace de salto le sale verde (D46).

**`LAST_A11Y_REVIEW` decía «tras el censo», y eso invitaba a firmar media revisión**
*(2026-08-28, cierre de la tanda 2 de «Drenaje»)*. La tanda pasó el censo entero —424 pares,
300 contornos, cero incumplimientos— y **no** las dos pasadas manuales, así que seguir la regla
al pie de la letra habría movido la fecha que `/accesibilidad` publica bajo «WCAG 2.2 AA
cumplido». No se movió, y la razón de fondo es la que dejó la regla como está ahora: **la fecha
no estaba caducada, porque nada de lo que cubre había cambiado** —el diff de la tanda sobre
`app/` y `components/` era **solo comentarios**—. Un disparador que mira al evento equivocado
es el punto 1 de `BRAND.md` §Cómo se escribe una regla; aquí el evento no es «ha corrido el
censo» sino «se ha vuelto a revisar lo que la frase afirma».

**Los dos validadores de Schema.org no son intercambiables**, y conviene saberlo el día que
una página estrene tipo: el **Schema Markup Validator** cubre los tipos **no** elegibles para
rich results (`Person`, `ProfilePage`), y la **Rich Results Test**, los elegibles
(`BreadcrumbList`). En ES y EN los dos. Ver `DECISIONS.md` D14/D15.

**Lo que revisa `close-session`**, que antes estaba enumerado en la convención: `PRD-Live.md`,
`PRD-Historical.md`, `DECISIONS.md`, `README.md`, el tablero de Notion y, si aplica,
`CLAUDE.md` / `BRAND.md`. La lista vive en la propia skill, que es quien la ejecuta.

## La Definition of Done

**Es una tabla porque un gate que depende de acordarse no es un gate.** Cuatro fallaron por esa
vía antes de que existiera la tabla, y cada uno tiene su entrada: **D54**, **D60** y **D63**.

**El disparo de `/prototype` cuando la medición contradice al ojo lo escribió el interlineado
del artículo** (2026-08-25): tres revisiones lo dieron por bueno y Francisco seguía viéndolo
mal. El fallo era el **alcance** de la medición, no su ojo. Es el punto 8 de `BRAND.md`
§Cómo medir.

**La fila de las figuras arrastra un caso propio** (P68.56): el `/prototype` de una figura se
miraba solo a escritorio, y el rótulo que allí se leía se pintaba ilegible a 360. De ahí que la
DoD exija verlo a 360 y no solo en grande.

**La columna B nace fuera del sprint, en su bloque de V3**, y eso es lo que hace que un
hallazgo de pulido no reabra una sección ya enviada: se tarea y sale cuando le toque.

## Lo que el bucle de medición predica

El bucle medir→aprender no es higiene de proceso: **es lo que la propia web predica**. El
titular del Hero es «Del discovery al dato», y un sitio que argumenta eso y no mide lo que
hace se contradice a sí mismo. Por eso el check de medición es un paso del cierre de etapa y
no una buena intención.

## El kicker no repite el breadcrumb

*(2026-08-29, P59.5.)* La regla de `CLAUDE.md` decía solo que **el kicker de una sección no
repite su título**, y pasó por delante de un caso que no cubría: `/contacto` se leía
«Inicio / Contacto» y, 220px debajo, **«CONTACTO»** otra vez, antes de «Hablemos». No repetía
su titular —el titular era otro—, así que la regla escrita la dejaba pasar; lo que repetía era
el elemento que tenía justo encima.

**Que fuera un caso y no un descuido lo dice el resto del sitio:** de las siete páginas con
kicker, las otras seis lo usan para decir algo que el titular no dice —«Legal», «Compromiso»,
«Identidad de marca», «Fundamentos de diseño», «Quién hay detrás», «El "Making of"»—. Una sola
se salía, y salió en una revisión de diseño que ni siquiera revisa copy.

**Y la elección enseña por qué la regla necesita las dos mitades.** Francisco propuso dos
salidas, «Conectemos» y «Aquí estoy». La primera no repite el breadcrumb, pero comparte forma
verbal exacta con el titular y significa casi lo mismo: `CONECTEMOS / Hablemos` son dos
invitaciones apiladas. O sea que arreglaba la mitad nueva de la regla incumpliendo la vieja.
Se quedó **«Aquí estoy»**, que no repite ninguna de las dos y añade lo que el titular no dice.
La regla vive completa en `CLAUDE.md` §i18n.

## El sello que se puso sobre una foto — 2026-08-30

**La convención:** el `SELLO_GENERAL` se pone **después** de crear las tareas del propio
`sprint-review`, y sobre un volcado nuevo.

**El caso.** Al cerrar «Voz», el orden fue: volcar el tablero, medir «General», sellar **18**, y
después crear las dos tareas que el `sprint-review` había producido. El número real al cerrar
era **20**, así que el 18 **no existió en ningún momento** — ni antes ni después de nada.

Lo que lo hace peor que un despiste es adónde iba: ese sello es contra lo que el siguiente cierre
compara. Con 18 sellado, un cierre que midiera 20 habría publicado **+2 de crecimiento sin que
nada hubiera crecido**, y el guardián del embalse habría dado un ámbar falso sobre un sprint
limpio. Un metro mal calibrado inventa hallazgos igual que uno roto.

**La causa, que es la parte reutilizable:** el volcado del tablero (`scripts/.tablero.json`) es
una **foto**, no una consulta. Nada en él avisa de que se tomó hace diez minutos y de que la
sesión ha escrito en el tablero desde entonces. El mismo archivo que hace posible medir el
tablero fuera de CI es el que permite medirlo contra un pasado.

**Y por qué la regla es de ORDEN y no de «re-volcar por si acaso»:** re-volcar por si acaso es
una nota que se olvida. El orden es comprobable —las tareas del review existen o no existen— y
cae en el único momento del ciclo en que alguien está mirando el tablero de todos modos.

*(La familia a la que pertenece, «el indicador sin fuente», está en el catálogo de
`method-review`; el mismo cierre encontró su hermana mayor: el neto que se sella no se puede
descomponer, porque el tablero no guarda historia de cambios de `Etapa`.)*

## La retirada en lote — 2026-08-31

**La regla:** al abrir una etapa se retira **en lote y antes de añadir nada**, en los tres
sitios donde este método solo tiene techo. Durante el sprint no se negocia.

**Lo que la escribió fue una nota de Francisco, no una medición.** El décimo `method-review`
medía el andamiaje —`verificación ÷ producto` acababa de cruzar a rojo, 0,49 → 0,554— y su
nota, escrita sin ver ese análisis, apuntaba a otro sitio: *«No me preocupa tanto el
presupuesto porque al final del sprint siempre acaba ajustado, me preocupa más el tiempo y
esfuerzo que dedicamos a esto, ya que recurrentemente estemos valorando si la frase está
duplicada, si tenemos que concretarla para que quede, si para añadir una frase hay que ver qué
podemos quitar»*.

**No converge el órgano, converge la enfermedad.** El método no tenía **ninguna** retirada
programada —`grep` verificado: cero— y todo lo que existía para frenar el crecimiento era un
techo. Un techo dispara la retirada **cuando ya se cruzó**, así que el sistema equilibra en
«techo menos épsilon» y **cada edición paga peaje**. Medido sobre el registro: **31 de 236
commits (13 %)** desde el 15 de agosto tuvieron que hablar del presupuesto, con frases como
«corregido SIN añadir palabras» o «20.486, holgura 14» dentro del propio mensaje. Tres órganos
con la misma causa: `scripts/` crecía por adición, `General` no bajaba de 18 en cuatro cierres,
y los documentos vivían pegados al techo.

**El noveno disparo ya había recetado «una retirada programada» y nadie la construyó.** Lo que
añadió el décimo es la FORMA, y sale entera de la nota: **en lote, una vez, al abrir**. Eso es
lo que convierte una deliberación repetida en un momento.

### El caso se demostró solo, que es por lo que la regla existe

Al guardar ese hallazgo en el catálogo de `method-review`, `check:contexto` se puso en **−576**.
Comprimí la entrada a un tercio y siguió en rojo, −360. **Y la cifra que importaba no era esa:
era el +14 de holgura de partida** — con catorce palabras, cualquier entrada rompe el techo,
mientras el paso 6 de esa misma skill dice que el catálogo *«es lo único que tiene que crecer»*.
Dos reglas del método en contradicción directa.

**El candidato correcto a retirar no era el bloque más grande: era el DUPLICADO.** El relato de
los diez disparos —unas 1.900 palabras— ya vivía en `PRD-Historical.md` con sus informes
enlazados, así que la skill que audita el método estaba incumpliendo la regla 5 de `BRAND.md`
(*«si ya está en otro sitio, aquí va el puntero, nunca la copia»*). Bajó al histórico y quedaron
la tabla de familias y las quince reglas que dejaron:

    method-review    3.428 → 3.233 palabras   (con la entrada del disparo DENTRO)
    suma de skills   20.486 → 20.291          holgura +14 → +209

La skill quedó **más pequeña que antes del disparo, con el disparo dentro**. Primera vez que un
indicador de esa tabla mejora **retirando** en vez de recortando.

### Y lo que esta regla NO permite hacer

Escribir la regla en `CLAUDE.md` costó 125 palabras y solo se pagaron 20 —la cláusula sobre los
sprints «Método», que era una excepción histórica—, así que el documento quedó a **28 palabras
del techo**. No se fabricó una retirada a destiempo para cuadrarlo, y eso es deliberado: **una
retirada reactiva es exactamente la patología que esta regla corrige.** La primera aplicación
de verdad es la apertura siguiente, y esas 28 palabras son la razón de que no se pueda saltar.
