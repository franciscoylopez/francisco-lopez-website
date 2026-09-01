---
name: method-review
description: >
  Revisión crítica de CÓMO SE TRABAJA, con mirada de técnico externo que ve el método por
  primera vez: los gates y su proporción manual/automática, el presupuesto de contexto, los
  guardianes y si saben fallar, el drift de docs y skills, el bucle de medición, el tablero y
  las herramientas. Se dispara ENTRE SPRINTS — después de `sprint-review`, que cierra el
  anterior, y ANTES de abrir el siguiente— para que el andamiaje esté puesto antes de que
  existan las cosas que tiene que sostener. No es una revisión del codebase (eso es
  `sprint-review`) ni del diseño (`design-review`): su objeto es el método.
---

# Revisión de metodología — entre sprints

Un técnico que **acaba de ver este método por primera vez** lo audita buscando margen. La
primera vez fue el 2026-08-19 y salió con nueve hallazgos. Lo que sigue es ese recorrido, con
lo que aprendió al ejecutarse.

> **Y aquí mismo, la primera lección de su propio catálogo** *(corregido en el cuarto disparo,
> 2026-08-23)*. Esta línea presumía «una reducción del 35% del contexto de arranque»; el total
> `@`-importado había bajado un **3,2%**. El 35% era un archivo, y se leía como si fuera el
> arranque entero. **Si esta skill se lo hizo a sí misma, no des por buena ninguna cifra en
> prosa de las que vas a leer: reprodúcela.**

## Cuándo

**En el hueco entre dos sprints**, que es el único momento en que cambiar cómo se trabaja no
interrumpe nada:

```
etapa cerrada → sprint-review (el codebase) → check de medición → METHOD-REVIEW → abrir el siguiente sprint
```

**Por qué ahí y no al cerrar.** El andamiaje hay que ponerlo **antes** de que existan las
cosas que tiene que sostener. El primer disparo lo demostró: iba delante de un sprint que
añade una entidad nueva con componentes propios, y la Definition of Done y el filtro mecánico
de interfaz entraron a tiempo de aplicarse a lo que estaba por construir. Al cerrar habrían
llegado para auditar, no para prevenir — que es la misma lección que D50/D52 sacaron del gate
de accesibilidad.

**Y no es «una cosa más que recordar»**, que era la objeción obvia: la dispara `sprint-review`
al terminar, y el ritual de cierre de etapa de `CLAUDE.md` la nombra como paso 4. Si acaba
dependiendo de que alguien se acuerde, ha fallado por la misma razón que este método lleva
todo `DECISIONS.md` corrigiendo.

## Los tres principios, y el primero manda sobre todo lo demás

1. **Mide el repositorio; no leas los documentos.** Casi todos los hallazgos del primer
   disparo salieron de un comando, no de una lectura: el presupuesto de contexto había subido
   un 113% mientras los tres documentos que lo gobiernan seguían describiéndolo como
   controlado. **Un hallazgo sin cifra es una opinión.**
2. **Busca FAMILIAS, no bugs.** El valor no está en encontrar un guardián flojo: está en ver
   que es la quinta aparición de la misma forma. El catálogo de familias conocidas está más
   abajo y es lo que hace esta revisión barata la segunda vez.
3. **Calibra con lo que está bien.** Antes de listar nada, mide algo que se sabe sano (`any`
   en el código, vulnerabilidades, estado del tablero). Sin eso, el informe parece un
   suspenso y se lee como ruido. El primer disparo abrió con «el código no es el problema de
   este proyecto», y era verdad.

Y una regla de honestidad que se ganó midiendo: **espera que algunas conclusiones cambien al
ejecutarlas.** Tres de las nueve del primer disparo se cayeron —un guardián que sí tenía su
guarda, un eje del tablero que no estaba degenerando, y un método que salió al revés del que
se iba a copiar—. **Eso no es un fallo de la revisión: es la revisión funcionando.** Anótalas
como corrección explícita, en el informe y en la tarea.

## Antes de medir: pide las notas de Francisco

**Pregúntale qué lleva anotado y NO lo leas hasta tener tu propio análisis.** El primer
disparo se hizo así a petición suya —«te paso mis notas, sin leer lo que me has pasado para no
tener sesgo»— y fue lo que dio la señal más fuerte del informe: **tres hallazgos convergieron
desde direcciones distintas**, y esos fueron los de más confianza. Los que solo aparecían en
un lado necesitaron verificación extra, y ahí es donde se cayeron los tres.

## El barrido — nueve medidas, todas con comando

Los comandos son el punto de partida, no la lista cerrada. **Publica siempre la cifra, aunque
esté bien**: un «esto está sano» medido vale tanto como un hallazgo.

### 1 · Presupuesto de contexto y su trayectoria

```bash
npm run check:contexto
# y la curva, que es lo que un techo no ve:
for d in <fechas>; do sha=$(git rev-list -1 --before="$d" HEAD); \
  for f in CLAUDE.md AGENTS.md BRAND.md PRD-Live.md; do git show "$sha:$f" | wc -w; done; done
```

El techo avisa el día que se cruza; **la curva avisa antes**. Compara con el cierre anterior:
si subió sin que entrara una regla nueva de verdad, se añadió donde tocaba sustituir.

### 2 · La proporción entre gates automáticos y manuales — y si PASAN

Cuenta los pasos de `.github/workflows/ci.yml` y enumera los que dependen de acordarse
(`gate:html`, `psi`, el censo, `viewport-verifier`, las tres skills de revisión, la revisión
EN↔ES, los generadores). **La proporción es el hallazgo**: en el primer disparo eran 8 contra
9, y los manuales habían fallado cuatro veces documentadas.

**Y luego mide si los automáticos pasan, que es la mitad que faltaba** *(añadida en el 11.º
disparo, donde el hallazgo de más impacto lo trajo Francisco porque esta skill no podía verlo)*:

```bash
gh run list --workflow=CI --limit 80 --json conclusion,headBranch,databaseId
gh run view <id> --json jobs -q '[.jobs[].steps[]|select(.conclusion=="failure")|.name]'
```

Verde ≤ 5 % de runs en rojo, rojo ≥ 15 %. **Y agrupa por PASO y por RAMA**: varios fallos en la
misma rama en minutos no son *flakiness*, son empujar y ver qué dice CI. Si el paso que falla
tiene un regenerador, lo que falta no es una herramienta — es el disparador.

### 3 · Los guardianes, en tres preguntas

```bash
npm run check:guardianes     # ¿rechazan su caso malo? ¿ha caducado algún caso?
grep -L "process.exit(1)" scripts/check-*.ts
```

- ¿**Afirman cuánto han mirado**, y contando de verdad —no derivándolo de sus propias
  constantes, que es la forma fina del fallo—?
- ¿**Fallan al mirar cero**?
- ¿Hay **artefactos commiteados** derivados de una fuente **sin guardián**? Es la familia D60
  y ya ha aparecido dos veces: `find . -name "*.huella"` frente a lo que se genera.

### 4 · Los documentos que dicen ser present-tense

```bash
for f in PRD-Live.md BRAND.md; do echo "$f: $(grep -oE '2026-[0-9]{2}-[0-9]{2}' $f | wc -l) fechas"; done
```

Una fecha en un documento en presente es historia que no se ha bajado. **Y mira si un
documento está duplicando su propio histórico**: en el primer disparo, tres bloques de
`BRAND.md` repetían lo que `BRAND-historical.md` ya contaba entero.

### 5 · Listas escritas a mano que podrían derivarse

El patrón que D59 eliminó tres veces y que vuelve. Índices, tablas de páginas, enumeraciones
de pasos en el nombre de un job, recuentos en prosa. **Si una lista describe algo que existe
en otro sitio, se deriva.**

### 6 · Las skills, que caducan peor que los `.md`

```bash
npm run check:skills   # la parte mecánica: rutas y comandos
```

Lo mecánico ya está cubierto; lo que hay que mirar a mano es lo demás: **¿alguna skill
describe un mundo que ya no existe? ¿alguna no se ha disparado nunca?** Una skill sin estrenar
es la de más riesgo, porque nadie ha comprobado que lo que dice siga siendo verdad. Y comprueba
si algo creado en el último sprint debería estar enganchado en una skill y no lo está.

### 7 · El bucle de medición

```bash
grep -c "GA4\|Clarity" *.md          # cuántas veces se habla de medir
# Busca el NOMBRE del evento, no la palabra «porque»: la redacción varía y el
# patrón de «porque…» dio 0 con el bucle cerrado (noveno disparo).
grep -icE "contact_submit|contact_click|file_download|n=[12]" DECISIONS.md PRD-Historical.md PRD-Live.md
```

Si la segunda cifra es cero, el bucle no se ha cerrado nunca. **Y si un scorecard está a cero,
la primera hipótesis es el instrumento, no la audiencia** — el primer disparo encontró un
dashboard cuya tarea se cerró sobre la predicción de que los datos llegarían en 24-48 horas, y
dieciséis días después seguían vacíos.

### 8 · El tablero

Distribución por `Etapa` y por `Estado`. **¿Algún eje ha dejado de discriminar?** Ya degeneró
una vez (16 de 20 en «Optimización»). Pero **mira las tareas una a una antes de concluir**: la
segunda vez, 17 de 20 eran genuinamente transversales y lo que faltaba no era redistribuir
sino escribir el criterio.

**Y no te quedes en la clasificación, que es lo que falló al concluir eso: mide también el
DRENAJE.** Cuántas entran en un bloque y cuántas salen. `General` pasó de 20 a 28 con el
criterio ya escrito, porque clasificar bien una tarea no la mueve — la regla de movimiento
(«cambia de `Etapa` al sprint que la toca») funciona para bloques de página y **no puede**
funcionar para un bloque transversal, al que ningún sprint toca. Un bloque cuyo único
desagüe es inventar un sprint de método es el hallazgo, no su tamaño.

### 9 · Herramientas y dependencias

Canal real (`npm view <pkg> dist-tags`), anclaje, `npm audit`, y **cuánto tarda un bump en
entrar**. Y para cualquier herramienta externa, el criterio de D51: entra por **el trabajo que
resuelve**, no por lo buena que sea.

## El catálogo de familias — lo que este proyecto produce de verdad

Cada hallazgo nuevo se intenta encajar aquí antes de tratarlo como singular. Si encaja, ya
sabes el remedio; si no encaja, es una familia nueva y **se añade a esta lista**.

| Familia | Cómo se reconoce | Instancias |
| :-- | :-- | :-- |
| **La reducción que fue una mudanza** | Una métrica mejora porque el coste se movió al cubo que **nadie mide**. Firma: la cifra celebrada describe *una parte* y se lee como si describiera *el todo* | **1** |
| **El metro que declara su alcance, y su alcance no incluye el síntoma** | Una verificación que **aprueba**, dice qué ha mirado —y por eso convence— y lo que ha mirado no es donde está el defecto que una persona está señalando | **3** |
| **El metro que aprueba sobre lista vacía** | Un verificador que no encuentra nada y calla, o que cuenta sus propias constantes | 6 · **0 vivas** |
| **La misma cosa escrita en dos sitios** | Un espejo, un índice a mano, una cifra copiada (D38, D59) | 6 |
| **El artefacto commiteado que se queda viejo** | Una copia derivada de una fuente, sin nada que las ate (D60) | 3 |
| **La regla sin portador** | Declarada en un documento y sin sitio donde se trabaje | **9** |
| **La cifra apuntada que caduca** | Un número en prosa que envejece sin avisar (D67) | 5 |
| **Arreglar la mitad que se abre** | Un arreglo real que resuelve el lado que PRODUCE el problema y deja intacto el que lo CONSUME | **6** |
| **La pieza que nace fuera de la capa** | Algo creado fuera de la cascada pierde en silencio lo que la cascada garantizaba, y nada lo detecta porque los guardianes miran el RESULTADO y no la PROCEDENCIA | **3** |
| **El arreglo que se quedó en su archivo** | Un defecto de familia conocida se corrige **donde se encontró**, la regla se escribe, y sus hermanos siguen vivos en archivos vecinos porque nadie los buscó. Firma: el mismo repo contiene la lección escrita **y** su incumplimiento, a un directorio de distancia | **3** |
| **El marcador escrito donde no se ve** | El estado en el cuerpo y no en la cabecera que llega al índice | 1 |
| **El umbral que persigue al dato** | Un techo que se reescribe para seguir a lo que mide, así que nunca se incumple y nunca obliga. Firma: cambia más a menudo que la cosa medida, y su distancia al dato es constante | **2** |
| **El dato que persigue al techo** | El techo **no** se mueve y la medida vive pegada a él, porque retirar solo se dispara al cruzarlo. Firma: el objetivo no se ha cumplido **nunca** | **1** |
| **Añadir sin retirar** | Algo del método crece porque **nada programa la retirada**: solo hay techo, y retirar es siempre una reacción al rojo. Nació mirando documentos (D69) y el décimo disparo la encontró en tres órganos a la vez | **4** |

> **El RELATO de cada disparo —qué encontró, con quién convergió y qué se cerró— vive en
> `PRD-Historical.md`, con su informe enlazado.** Aquí solo la tabla de arriba y las reglas que
> dejaron, porque son lo único que se vuelve a usar.

**Las reglas que dejaron los diez disparos.** Sin fecha y sin autor a propósito: quien las lee
las va a aplicar, no a datar.

*Sobre el catálogo*

- **Actualizar la tabla es el último paso del disparo, y es el que se olvida.**
- **Una familia nueva se da de alta por el REMEDIO, no por el síntoma.** Dos hallazgos que se
  parecen y se arreglan distinto son dos familias; dos que se arreglan igual, una.
- **Un disparo cabe en un párrafo.** El detalle va al informe.

*Sobre los indicadores*

- **Un aviso sin umbral se olvida**, así que se vuelve fila de la tabla con su verde y su rojo.
- **Al añadir un indicador se escribe con qué comando se saca.** Si no lo tiene, no entra: una
  fila que no se puede medir da sensación de cobertura y no cubre nada.
- **Un indicador cuya definición no es copiable no es reproducible** — reconstruirlo dio tres
  cifras sobre el mismo árbol. Y **al heredar una tabla se auditan también las filas viejas**.
- **Un objetivo que no se ha cumplido nunca no está gobernando nada.** Se decide el objetivo o
  se decide qué baja a un histórico; **el techo no se toca**.
- **Mide el DRENAJE, no solo la clasificación** (paso 8). Clasificar bien una tarea no la mueve.
- **La asimetría entre lo automático y lo visual se mide cada vez, y no se escribe la cifra.**

*Sobre medir*

- **Antes de publicar un cero, búscalo con otras palabras y en otro sitio.** Un `grep` que
  devuelve cero es un aprobado, y esta skill ya publicó dos falsos.
- **Al medir sobre `git log`, el registro es el COMMIT**: `RS` en el separador, nunca `grep -c`.
- **Un comando publicado aquí también caduca.**
- **Lo que se apunta como hipótesis se escribe como hipótesis.** Una sospecha dada por causa
  envejece igual de mal que una cifra, y redirige la investigación.
- **El sello se pone DESPUÉS de crear las tareas del propio `sprint-review`, sobre un volcado
  NUEVO.** Un volcado es una foto, no una consulta.

*Sobre qué preguntar*

- **Cuando el techo de algo lleve dos ciclos sin dejar trabajar, la pregunta ya no es cuánto
  recortar: es qué gobierna el número.**

**Los umbrales vigentes, para el cierre siguiente** *(hoy = 2026-09-01, tras «Distribución»)*:

| Indicador | Hoy | Verde | Rojo | Comando |
| :-- | :-- | :-- | :-- | :-- |
| **Runs de CI en rojo** | **18 %** (14/80) 🔴 | ≤ 5 % | ≥ 15 % | `gh run list --workflow=CI --json conclusion` |
| Variación neta de `General` por sprint | **+3** (20 → 23) 🟡 | ≤ 0 | ≥ +4 | `SELLO_GENERAL` de `check-tablero.ts` |
| Veces que se movió un techo en el ciclo | **0** de 3 🟢 | 0 | ≥ 2 | `check:contexto` (última sección) |
| Margen del presupuesto de contexto | **14** 🔴 | ≥ 400 | < 100 | `check:contexto` |
| Suma de skills a demanda | **holgura 62** 🟡 | ≤ techo | > techo | `check:contexto` |
| Verificación ÷ producto | **0,571** 🔴 | ≤ 0,45 | > 0,55 | ver la operación exacta abajo |
| % Infra del sprint que cierra | **0 %** (0/13) 🟢 | ≤ 35 % | ≥ 50 % | tablero, `GROUP BY Área` |
| Verificación ÷ producto DEL SPRINT | **1,56 : 1** 🟡 | ≤ 1,5 | ≥ 3 | `git diff --shortstat <base> HEAD -- <área>` |
| Hallazgos de `design-review` cuya regla ya existía | *sexto ciclo sin disparar* ⚪ | ≤ 1 | ≥ 3 | `design-review` |

*El margen de contexto entró en rojo profundo sin que ningún sprint lo gastara: **lo gastó el
cierre anterior**, con las 105 palabras de la regla que ordena retirar, y la apertura que esa
regla manda retiró cero. Es la fila que hay que mirar primero el disparo que viene.*

*Las dos filas de `check:contexto` van en su vara, que **descuenta los bloques de código**. La
suma de skills no lleva cifra a propósito: la mueve esta misma skill al escribirse.*

**La operación exacta de «verificación ÷ producto»**, porque sin ella la fila no es
reproducible — se descubrió al reconstruirla, y tres definiciones razonables daban 0,47, 0,52 y
0,62 sobre el mismo árbol. Solo archivos **rastreados**, que si no entra `scripts/.poda/`:

```bash
n(){ git ls-files "$@" | grep -E '\.(ts|tsx|js|mjs)$' | xargs wc -l | tail -1 | awk '{print $1}'; }
echo "scripts=$(n scripts) producto=$(( $(n app) + $(n components) + $(n lib) + $(n content) ))"
```

*Numerador: `scripts/` sola. Denominador: app + components + lib + content. `tests/` queda
FUERA del numerador a propósito — un test prueba el producto, un guardián vigila el método.*

**Las dos filas del sprint se miden AL CERRAR**, sobre el que cierra, con su commit base y
`HEAD`. Sustituyeron a «sprint de método abierto en el ciclo», que leía el NOMBRE: «Drenaje»
no se llamaba de método y lo fue.

## La salida

1. **Un informe publicado como Artifact**, no un volcado en la terminal: Francisco lo lee
   antes de decidir y luego lo consulta. Veredicto en una frase → lo que está bien (calibra) →
   hallazgos por severidad, cada uno **con su cifra y su comando** → las convergencias con sus
   notas, marcadas → un plan con la forma de cada arreglo.
2. **La forma de cada arreglo se decide con el criterio de D51**, y esto evita la mitad de las
   discusiones: *si se dispara en un evento y no requiere criterio, es un script en CI; si
   requiere criterio y se dispara en un momento, es una skill; si no es ninguna de las dos, no
   era una regla — era una nota.*
3. **Propón antes de crear**, y **consulta el tablero primero**: en el primer disparo, cinco
   de los once puntos del plan ya estaban tareados por revisiones anteriores. La salida no es
   una lista de tareas nuevas, es un bloque ensamblado con las que ya existen.
4. **Un sprint de método propio es el último recurso, no el formato por defecto** *(desde el
   cuarto disparo)*. Las dos primeras veces se abrió uno —*Método* y *Método II*, 24 tareas,
   las mismas que costó la página del sprint que las generó— y eso es justo lo que el cupo de
   `General` existe para evitar. El orden correcto: **la regla o la edición de documento se
   hace ahora**, en la misma sesión; **el arreglo con código va al sprint que ya toca esos
   archivos**; y solo lo que no encaje en ninguno de los dos cae en `General`, dentro del cupo.
   Un sprint propio se abre únicamente si lo acordado no cabe en esas tres vías.
5. **Antes de dar por abierto el sprint siguiente, comprueba su tarea de contenido.** Si sigue
   en `Sin empezar`, el sprint abre bloqueado y esa es su primera tarea. Este es el hueco donde
   se comprueba porque es el último momento antes de abrir.
6. **Actualiza este catálogo.** Es lo único de esta skill que tiene que crecer.

## Dos cosas que NO hace

- **No revisa el codebase.** Calidad de código, deuda, escalabilidad y resiliencia son de
  `sprint-review`, que se dispara justo antes. Si al medir el método aparece un hallazgo de
  código, se anota y se le pasa; no se persigue aquí.
- **No revisa el diseño.** Eso es `design-review`, y su filtro mecánico previo
  (`/web-design-guidelines`). El objeto de esta skill es **cómo se trabaja**.

Y una tentación concreta que hay que resistir: al medir el método salen incumplimientos
sabrosos del sitio. **Anótalos y sigue.** Esta revisión mide el metro, no la pared.
