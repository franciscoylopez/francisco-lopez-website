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

Un técnico que **acaba de ver este método por primera vez** lo audita buscando margen. Se
hizo la primera vez el 2026-08-19, antes del sprint «Cómo se ha creado», y salió con nueve
hallazgos, dieciséis tareas y una reducción del 35% del contexto de arranque. Lo que sigue es
ese recorrido, con lo que aprendió al ejecutarse.

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
sesenta y nueve decisiones corrigiendo.

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

### 2 · La proporción entre gates automáticos y manuales

Cuenta los pasos de `.github/workflows/ci.yml` y enumera los que dependen de acordarse
(`gate:html`, `psi`, el censo, `viewport-verifier`, las tres skills de revisión, la revisión
EN↔ES, los generadores). **La proporción es el hallazgo**: en el primer disparo eran 8 contra
9, y los manuales habían fallado cuatro veces documentadas.

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
grep -inE "porque (los datos|GA4|el dato)" *.md   # cuántas veces se DECIDIÓ con un dato
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
| **El metro que aprueba sobre lista vacía** | Un verificador que no encuentra nada y calla, o que cuenta sus propias constantes | 6 |
| **La misma cosa escrita en dos sitios** | Un espejo, un índice a mano, una cifra copiada (D38, D59) | 6 |
| **El artefacto commiteado que se queda viejo** | Una copia derivada de una fuente, sin nada que las ate (D60) | 3 |
| **La regla sin portador** | Declarada en un documento y sin sitio donde se trabaje | **7** |
| **La cifra apuntada que caduca** | Un número en prosa que envejece sin avisar (D67) | 4 |
| **Arreglar la mitad que se abre** | Un arreglo real que resuelve el lado que PRODUCE el problema y deja intacto el que lo CONSUME | **4** |
| **La pieza que nace fuera de la capa** | Algo creado fuera de la cascada pierde en silencio lo que la cascada garantizaba, y nada lo detecta porque los guardianes miran el RESULTADO y no la PROCEDENCIA | **2** |
| **El marcador escrito donde no se ve** | El estado en el cuerpo y no en la cabecera que llega al índice | 1 |
| **Añadir sin retirar** | Un documento que crece porque nada pregunta qué sobra (D69) | el marco |

*Segundo disparo, 2026-08-19: nace «arreglar la mitad que se abre» —el* cooldown *de
Dependabot controló cuántos PR se abren y no quién los cierra; D59 derivó el sitemap del
deep-dive dejando las páginas estáticas a mano en tres listas—. Y la lección sobre esta
tabla: **actualizarla es el último paso del disparo y es el que se olvida.***

*Tercer disparo, 2026-08-22: **«la regla sin portador» pasa de 3 instancias a 6 y se
convierte en la familia dominante.** Las tres nuevas salieron del mismo sprint: cuatro de
los ocho hallazgos del `design-review` tenían la regla ya escrita antes de empezar (el
fondo invertido, el morado como gráfico, los 44px, la cascada de construcción); la regla
de publicar en el Design System no tiene disparador **ni plantilla**; y la condición de
re-medir de la DoD se cumplió por sus tres vías a la vez y nadie la leyó, porque leerla es
trabajo humano.*

*Y la familia nueva es **«la pieza que nace fuera de la capa»**, que se separó de la
anterior por el REMEDIO y no por el síntoma: la regla sin portador necesita un
**disparador**; esta necesita un **guardián de frontera** —algo que note que apareció un
archivo en `components/ui/` y le exija lo que la capa exige—. Sus dos instancias:
`components/ui/article-islands.tsx`, que perdió los 44px, el hover y el foco al escribirse
fuera de `components/ui/chrome.tsx`, y la sección 15 del Design System, que perdió la
estructura de las otras
catorce. **Ojo al medirla: su firma es que el hallazgo aparece tarde y en plural** —ocho
tareas de golpe en una revisión final, no una en cada PR.*

*Cuarto disparo, 2026-08-22 (el mismo día que el tercero, tras Método II): **«arreglar la
mitad que se abre» alcanza al propio método, y esa es la instancia 4.** Las revisiones
producen hallazgos mejor que nunca y nada los saca: `General` acumula 28 abiertas con 1
archivada en toda su vida, y su único desagüe histórico ha sido abrir un sprint de método
—dos veces, 24 tareas, exactamente las mismas que costó construir la página del sprint—.
El aviso lo trajo Francisco desde el tiempo invertido y el barrido lo confirmó desde los
contadores del tablero: **segunda vez que las dos direcciones convergen y segunda vez que
ese es el hallazgo de más confianza.***

*Y dos cosas que este disparo deja como método, no como hallazgo:*

- ***Un aviso sin umbral se olvida.** Cuando Francisco pide anotar algo «como aviso, no como
  accionable», el trabajo de la revisión es convertirlo en una cifra con verde y rojo para el
  próximo cierre. Aquí fueron dos: hallazgos del `design-review` cuya regla ya existía (4 de 8
  hoy · verde ≤1 · rojo ≥3) y proporción de tareas de método sobre el ciclo (50% hoy · verde
  ≤25%). Sin eso, dentro de un mes vuelve a ser una conversación de sensación.*
- ***Mide el drenaje, no solo la clasificación*** *(ver el paso 8, corregido). Es lo que se le
  escapó al segundo disparo mirando el mismo eje.*

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
