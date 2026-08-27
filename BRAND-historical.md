# Sistema de marca — registro histórico

> **Por qué existe este archivo.** `BRAND.md` es el documento de reglas que se
> `@`-importa en **cada arranque de sesión**, y la mitad de su peso era arqueología:
> párrafos fechados de «esto falló antes». Aquí viven esos párrafos; en `BRAND.md`
> queda solo la regla en presente. Misma separación que `PRD-Live.md` ↔
> `PRD-Historical.md` (D28), y por el mismo motivo: **el coste de una sesión lo domina
> lo que se precarga.**
>
> **Se consulta a demanda (Read/Grep), NUNCA se `@`-importa.**
>
> **Qué NO está aquí: ninguna regla viva.** Al partir se revisó entrada por entrada, y
> lo que era regla —y no historia— se subió a `BRAND.md` en presente antes de mover el
> párrafo. Si al leer algo de aquí te parece que enuncia una regla que `BRAND.md` no
> tiene, eso es un fallo del split y hay que corregirlo allí, no aplicarla desde aquí.
> El riesgo es real y ya cobró su pieza: el drift de cuatro días de §Jerarquía de hover
> fue exactamente **un párrafo histórico contradiciendo al vigente**.
>
> **Cuándo leerlo.** Antes de cambiar una regla de `BRAND.md` — casi todas se
> escribieron corrigiendo algo, y aquí está qué se probó y por qué se descartó. Ahorra
> repetir un experimento que ya salió mal.

Partido el **2026-08-09** (P37.685).

---

<!-- ÍNDICE · lo genera `npm run indices`; no se edita a mano -->
- [Color — regla de las dos capas](#color--regla-de-las-dos-capas)
- [Jerarquía de hover en botones y CTA](#jerarquía-de-hover-en-botones-y-cta)
- [Etiquetas](#etiquetas)
- [Cuándo una acción lleva icono](#cuándo-una-acción-lleva-icono)
- [Ningún control se escribe a mano](#ningún-control-se-escribe-a-mano)
- [Accesibilidad](#accesibilidad)
- [Iconos propios](#iconos-propios)
- [El atenuado sensible a la superficie](#el-atenuado-sensible-a-la-superficie)
- [Tablas](#tablas)
- [El morado de los fondos invertidos](#el-morado-de-los-fondos-invertidos)
- [La regla del control sobre imagen prometía de más (2026-08-18)](#la-regla-del-control-sobre-imagen-prometía-de-más-2026-08-18)
- [El censo de contraste se rompió dos veces, y la segunda destapó un par real (2026-08-17 → 18)](#el-censo-de-contraste-se-rompió-dos-veces-y-la-segunda-destapó-un-par-real-2026-08-17-→-18)
- [El censo midió 15,32 lo que la pantalla pintaba a 5,97 (2026-08-27)](#el-censo-midió-1532-lo-que-la-pantalla-pintaba-a-597-2026-08-27)
- [Cómo se escribe una regla](#cómo-se-escribe-una-regla)
- [El morado como gráfico, y la tercera vez del mismo peldaño (2026-08-17)](#el-morado-como-gráfico-y-la-tercera-vez-del-mismo-peldaño-2026-08-17)
- [Un control sobre una imagen no puede fijar su color (2026-08-17)](#un-control-sobre-una-imagen-no-puede-fijar-su-color-2026-08-17)
- [El morado de la barra de progreso, con los papeles cambiados (2026-08-21)](#el-morado-de-la-barra-de-progreso-con-los-papeles-cambiados-2026-08-21)
- [La pasada completa, y las tres veces que el «sin excepciones» fue falso (2026-08-18 → 23)](#la-pasada-completa-y-las-tres-veces-que-el-sin-excepciones-fue-falso-2026-08-18-→-23)
- [El enlace de contenido invertido (2026-08-23 → 25)](#el-enlace-de-contenido-invertido-2026-08-23-→-25)
- [La pasada de retirada del 2026-08-22, y qué se fue de `BRAND.md`](#la-pasada-de-retirada-del-2026-08-22-y-qué-se-fue-de-brandmd)
- [La tarjeta salió en negrita con la clase correcta puesta](#la-tarjeta-salió-en-negrita-con-la-clase-correcta-puesta)
- [El contorno de un control: 1,21:1 desde V1, y el metro que no existía (2026-08-23)](#el-contorno-de-un-control-1211-desde-v1-y-el-metro-que-no-existía-2026-08-23)
- [El interlineado que sobrevivió a tres medidas, y por qué la medición aprobaba (2026-08-25)](#el-interlineado-que-sobrevivió-a-tres-medidas-y-por-qué-la-medición-aprobaba-2026-08-25)
- [La variante que dimensiona una fila, usada en una pila (2026-08-25)](#la-variante-que-dimensiona-una-fila-usada-en-una-pila-2026-08-25)
- [El hover de la tarjeta pulsable, y por qué no se arregló con luminancia (2026-08-25)](#el-hover-de-la-tarjeta-pulsable-y-por-qué-no-se-arregló-con-luminancia-2026-08-25)
- [Las dos excepciones que salieron](#las-dos-excepciones-que-salieron)
- [El velo que no declara superficie, y por qué la regla prometía de más (2026-08-27)](#el-velo-que-no-declara-superficie-y-por-qué-la-regla-prometía-de-más-2026-08-27)
<!-- FIN ÍNDICE -->

## Color — regla de las dos capas

**Matizado 2026-07-21 — el chrome no lleva cian.** La redacción anterior decía «botones,
enlaces, foco y estados activos usan `primary`», sin distinguir. Producía un breadcrumb con
«Inicio» en cian (#0B7C7C) justo debajo de un nav que ya usaba `foreground` (#21262B) para
«Descargar CV» — dos elementos de chrome contiguos con criterios distintos, y **el que se
salía era el que seguía la regla al pie de la letra**.

**Matizado 2026-08-04 (P37.55) — el enlace de contenido no es cian en reposo.** La regla
decía antes «texto en `primary` siempre». Se sustituyó tras prototipar variantes en un Claude
Artifact (con capturas de referencia de Francisco) y compararlas en vivo, en los dos temas:
se prefirió reservar el cian para el momento de interacción en vez de tenerlo como color de
texto permanente. H1 reutiliza el par de contraste ya verificado AAA de «texto sobre botón»
en vez de inventar uno nuevo. Queda **en reserva** una segunda variante («G»: un garabato
circular dibujado a mano alrededor de la palabra en hover, con el subrayado de reposo
retrayéndose hacia el punto donde nace el trazo) para un uso puntual de énfasis — no es el
estándar de todos los links de contenido.

**Ampliada 2026-08-08 (P37.5987) — el email visible de Accesibilidad entra en la excepción de
`ContactSecondary`.** Pasa a ser un `mailto:` —antes era texto plano— por el mismo motivo y
sin criterio nuevo: está a 15px del CTA sólido, que es exactamente la situación que la
excepción describe. Lo que cambió no fue la regla sino el alcance. **La lección es de
método:** el comentario que justificaba el texto plano explicaba por qué la dirección *se
muestra*, no por qué *no era accionable* — respondía a otra pregunta, y la revisión lo dio por
cerrado sin notarlo.

**Ampliado 2026-08-09 (P37.656) — el chrome secundario se aclara al interactuar.** El hover
pinta una pastilla de `--muted` debajo del texto, así que un enlace en `muted-foreground` caía
a 6,44 claro / 5,56 oscuro **justo en hover** — el caso que prohíbe D30, el mismo que había
aparecido en la etiqueta neutra un rato antes. Subir el texto a `foreground` en el mismo gesto
en que aparece la pastilla lo lleva a 12,47 / 12,04 sin tocar el reposo. Cuatro de los siete
usos ya lo hacían —el nav y el botón de preferencias—; el footer y el breadcrumb no, y
**nadie podía ver la diferencia porque el par solo existe mientras el cursor está encima**.

**Añadido 2026-08-04 (P37.57) — los controles de chrome solo icono no tenían ningún estado
hover.** Eran lo único del chrome que no respondía al cursor.

---

## Jerarquía de hover en botones y CTA

**Corregido 2026-08-04 (P37.596) — el hover del sólido.** La regla decía «Hover =
`bg-primary/90`», y el CTA insignia del sitio no la cumplía: usaba el `color-mix`. **El
incumplidor tenía razón.** `/90` *baja* el contraste del texto sobre el botón, mientras que
mezclar hacia `--foreground` lo *sube* en ambos temas (en claro oscurece bajo texto hueso; en
oscuro aclara bajo texto carbón). Medido: 7,93 → 8,64 en claro y 8,36 → 8,92 en oscuro. Se
corrigió la regla, no el botón.

> **Lo que este error enseña sobre los documentos, no sobre el botón.** La regla correcta ya
> estaba escrita desde el 2026-08-03 en `DECISIONS.md` **D30**, que dice textualmente que el
> hover del sólido *no* se hace con `bg-primary/90`. O sea: durante un día `BRAND.md` y
> `DECISIONS.md` **afirmaban lo contrario el uno del otro**, y el código seguía a uno de los
> dos. No fue un fallo de criterio sino de **propagación**: la decisión se registró donde se
> tomó y nadie cruzó los cuatro documentos de reglas. Es el primer chequeo que hace hoy la
> revisión de diseño, antes de mirar un solo componente.

**Fijado 2026-08-04 en tres pasadas — los controles con estado.** En **P37.59** se detectó que
los toggles del Design System no tenían hover y que ponerles el relleno los volvía
indistinguibles del estado activo; la regla se escribió mirando solo `aria-pressed`, y por eso
las pestañas del Toolkit (`aria-selected`) se quedaron fuera del sistema, sin hover en la
seleccionada y con `secondary` en la inactiva. En **P37.592**, al meterlas, la fila pasó de un
cian a cuatro y se comía la sección en oscuro → nace `toggle-neutral`. Y acto seguido se vio
que los **tabs de dispositivo** seguían en cian por arrastre: P37.59 los había agrupado con el
toggle de rejilla porque ambos usan `aria-pressed`, cuando uno es un interruptor y el otro un
segmentado. **La primera redacción del criterio («¿quién es el protagonista?») falló al
segundo caso que le tocó**; por eso el criterio vigente mira la forma, que se comprueba de un
vistazo.

**P37.593 — la bolita del switch.** Era `bg-white` fijo y fallaba el 3:1 de componente en dos
de las cuatro combinaciones (1,22:1 en claro-apagado, 2,03:1 en oscuro-encendido), y **ningún
token que conmute con el tema lo arreglaba**. De ahí sale la regla de «el color se toma del
fondo»: la pieza es el `foreground` de su propio carril.

---

## Etiquetas

**Fijado 2026-08-09 (P37.655), midiendo las ocho definiciones** que había a mano en seis
archivos —cinco anchos de padding, tres cuerpos, cuatro alturas, dos pesos, tres de ellas
conviviendo en la misma página—. **Lo revelador no es el drift mecánico** sino que la peor
medida de las ocho era la pastilla con la que el Design System marca «AAA» en su tabla de
contraste: llevaba desde su publicación ilustrando lo contrario de lo que dice. Ni axe ni el
typecheck pueden verlo, porque el par solo existe al **componer dos `color-mix`** en el
navegador.

Las cifras de entonces, para no repetir el experimento:

- **Neutra.** Era `bg-muted text-muted-foreground` → 6,44 / 5,56. Es el caso exacto que
  prohíbe D30, y se arregla con la fórmula de `--contact-dim`: mezclar el texto un 85% hacia
  el propio fondo → 8,17 / 9,17.
- **Teñida.** Llevaba `text-primary` sobre un velo del propio cian → 6,07 / 5,46, y **no hay
  alfa que lo salve**: es el techo asintótico de D30. El mejor caso posible (velo al 10% con
  el texto mezclado un 12%) se queda en 7,30 claro pero **6,62 oscuro**. Con `--foreground`:
  10,63 / 10,02.

**Decidido 2026-08-09 — cuál de los dos teñidos toca.** La duda venía de que «Split/Flat» y
«Conmuta/Fijo» parecían el mismo papel por ser los dos binarios, y llevaban colores distintos
dentro de la misma página. No lo son: uno describe **cómo se comporta un token** y el otro
nombra **una variante del logo**. Es la lección `CARD`/`PANEL` de D36 —antes de unificar lo
que se parece, mirar si significa cosas distintas— y aquí la respuesta fue que sí, así que no
se movió ninguna pastilla. Los dos tonos están en AAA (morado 11,75 / 11,59, cian 11,23 /
10,02), o sea que la elección fue **de significado, nunca de contraste**.

---

## Cuándo una acción lleva icono

**Fijado 2026-08-08 (P37.5988).** P37.592 unificó en `action.tsx` relleno, borde, radio, hover
y suelo táctil, **pero el icono se quedó fuera de la variante** y cada punto de uso decidía por
su cuenta si ponía uno, cuál, a qué tamaño y de qué lado. Resultado: el mismo «Descargar CV»
pelado en el nav y con icono en Trayectoria y en contacto; dentro del **mismo panel** del Brand
Kit, el chip de SVG con icono y los de PNG sin él; y `size-[15px]`, `size-[17px]` y
`size-[18px]` para el mismo glifo repartidos por cinco archivos.

El más revelador: el empujón de 2px vivía en una clase llamada `.contact-cta`, que se describía
a sí misma como «propia de este CTA y de ningún otro» — así que **la demo de esa misma variante
en el Design System enseñaba un botón que no existía en el sitio**.

---

## Ningún control se escribe a mano

**La auditoría de 2026-08-04** encontró **seis** definiciones distintas de «botón base» en seis
archivos, dos radios, cuatro hovers para la misma variante y el suelo táctil de 44px reescrito
catorce veces —del que el footer se había salido sin que nadie se enterara—, mientras
`components/ui/button.tsx` llevaba desde el principio en el repo **con cero usos**.

El motivo de fondo: los **enlaces** son coherentes porque hicieron el recorrido completo
—regla → clase CSS → sección publicada en el Design System → uso—. Los **botones** se quedaron
en el primer paso, y había que acordarse de ellos.

**Actualizada 2026-08-08 (P37.63) la excepción del switch.** La redacción anterior la dejaba
colgando de una decisión abierta: «sale en cuanto P37.63 fije de dónde vienen los widgets con
estado». Se fijó —D6 reescrita— y el veredicto fue que **este switch no se toca**: está bien
hecho (`input[type=checkbox][role=switch]` real, con label asociada, 0 violaciones de axe) y la
regla nueva no reescribe lo que funciona.

Lo que **no** era excepción es su color. Anotarlo importa porque el hallazgo que abrió esto fue
justo esa confusión: el comentario del componente justificaba el **color** y se leyó como si
justificara la **excepción**, que es otra pregunta.

---

## Accesibilidad

**Ajustado 2026-07-22 — el cian claro.** Era `#0B7C7C`, que daba **4,53:1** como texto sobre el
fondo: pasaba AA por 0,03. Aprobado raspado, y cualquier retoque futuro del cian o del fondo lo
tumbaba sin que nadie se enterase (como botón estaba aún más justo, 4,81:1). Al comparar las
opciones se vio que llegar a AAA costaba un oscurecimiento **visualmente indistinguible**, así
que quedarse en AA era dejar margen sobre la mesa por nada.

**Corregido 2026-08-04 (P37.598) — aquel ajuste no llegó a AAA, y la web llevaba trece días
publicando que sí.** El cian de julio se pintaba como `#005E5F` —el hex documentado *era el
correcto*— pero eso da **6,86:1 como texto**, por debajo del umbral AAA de 7. La cifra
publicada, 7,01:1, **no era alcanzable con ese color**: se calculó mal en su momento y viajó
desde aquí a la página de Accesibilidad, al Design System y al Brand Kit. *(La de «texto sobre
botón» sí estaba bien en D30, que decía 7,28:1 — el 7,44 de `BRAND.md` era el equivocado.)* Se
corrigió bajando el token a `oklch(0.41 0.0886 194.82)` → `#005859`, 7,47:1 como texto y 7,93:1
sobre botón. El mismo argumento de julio, ahora sí verificado.

**Afinado 2026-08-04 (P37.5985).** Aquel gate publicó 7,43 y 7,88 para este mismo token;
medido de nuevo, lo que el navegador pinta son 7,47 y 7,93 (y el hover del sólido 8,64 / 8,92,
no 8,59 / 8,93). Son centésimas y ningún veredicto AAA cambia, pero **es el segundo documento
seguido en que una cifra publicada no coincide con la medida**.

**Resuelta 2026-08-04 (P37.5985) la última que faltaba — el hover del `toggle-primary`
apagado.** Texto `primary` sobre un velo del propio `primary` al 10% daba **6,35 claro / 6,98
oscuro**: AA holgado, pero no AAA. Bajar el alfa del velo no lo arregla, porque tiene **techo
asintótico**: pintar cian sobre cian no puede subir el contraste del cian, y el máximo sin velo
es 7,47. Tampoco lo arregla un velo neutro (`muted`), que era la vía que parecía más
prometedora sobre el papel y **al medirla resultó ser la peor** —6,76 / 6,57, falla en los dos
temas—: cian sobre gris contrasta menos que cian sobre el fondo. Lo que sí funciona es mover el
**texto** en vez del velo: 12% hacia `--foreground`, con el velo al 8% → 7,21 / 7,80.

**2026-08-09 — los tres pares que faltaban en el censo.** No eran nuevos: existían desde
siempre y **nadie los había contado como pares del sistema**, así que el «todos en AAA» llevaba
tiempo siendo falso sin que ninguna de las dos auditorías anteriores lo viera. Daban 6,44 /
5,56 las etiquetas neutras, 6,07 / 5,46 las teñidas y 6,44 / 5,56 el hover del footer y el
breadcrumb. El motivo es de forma, no de criterio, y los tres fallan por la misma razón: **un
par que solo aparece al componer un velo, o una pastilla de hover, sobre la superficie de
debajo no está en ninguna lista de tokens.** Los dos primeros ni siquiera se ven en una
captura; el tercero solo existe mientras el cursor está encima.

**2026-08-09 (P37.66) — el censo sale de `BRAND.md`.** La lista de cifras que vivía en
§Accesibilidad era la **cuarta copia** de unos números que solo se pueden saber midiendo (los
dos diccionarios, este documento y `DECISIONS.md`), y ya se había demostrado dos veces que las
cuatro divergen. Pasa a `lib/design-values.ts`, de donde leen las páginas que lo publican
(D38).

---

## Iconos propios

**Fijado 2026-08-08 (P37.5989), al redibujar el de LinkedIn.** El original venía de lucide y
tenía sus mismos atributos, pero metía **cinco carriles de 4 unidades en las 20 del área
útil**: cada contraforma medía 2, o sea 1,5px a 18px. En el footer se leía como una mancha
sólida al lado del sol y la luna. La «in» no cabe contorneada a este grosor —una barra legible
pide 8 de ancho y no caben tres—, así que se dibuja con el trazo: `M4 4h.01` · `M4 10v11` ·
`M12 21v-7a4 4 0 0 1 8 0v7`, con huecos de 6 (punto↔asta) y 8 (i↔n y contraforma de la n).

> **Sobre el metro, que es la parte reutilizable.** El primer candidato a norma fue la
> **densidad de tinta** (longitud del trazo × grosor sobre el artboard): el icono roto salía el
> más pesado de todos —36,3% frente a la banda de 14–32% de los lucide del sitio—, así que
> parecía explicado. Al validarlo contra un caso que ya damos por bueno, **se cayó**: sobre su
> propia caja, `mail` pinta 45,8% y el icono roto 45,2%, y `mail` se lee perfecto. La tinta
> describe el síntoma y sirve de sospecha; lo que decide es el **hueco más estrecho**.

**Corregido 2026-08-08, en el primer disparo del skill `design-review`.** La regla «si hay más
de dos iconos propios, publicarlos en el Brand Kit» llevaba cuatro días sin dispararse
**teniendo siete**, porque su condición se comprobaba leyendo `icons.tsx` —donde había uno— en
vez de contando los que hay. En ese mismo disparo aparecieron **seis glifos dibujados a mano
que lucide sí trae** (`check` —duplicado byte a byte en dos páginas—, `download`, `moon`,
`menu`, `arrow-right`, `x`), y dos de ellos eran copias de los iconos reales del nav usadas en
la demo que documenta ese mismo patrón: la demo podía divergir del nav sin que nadie se
enterara.

## El atenuado sensible a la superficie

**2026-08-09 (P37.6565) — por qué la regla pasó del punto de uso al token.** D30 se escribió
el 2026-08-03 y era correcta: un atenuado calibrado contra `--background` no se reusa sobre
otra superficie. Lo que falló fue **quién tenía que aplicarla**. La regla vivía en una clase,
`.contact-dim`, que había que escribir en el punto de uso — así que protegía exactamente a los
sitios donde alguien se acordó. El sitio tiene **141 usos de `text-muted-foreground`**, y la
superficie más común que no es `--background` —`--card`— nunca la recibió: el par daba **6,40:1
en oscuro**, por debajo de AAA, en las seis páginas.

La forma del fallo es la de siempre en este documento: *una regla que hay que recordar es una
regla que se incumple*. La corrección no fue medir mejor ni escribir la regla más claro, fue
**quitarla del punto de uso**: `text-muted-foreground` compila a `var(--surface-dim)` y cada
superficie redefine ese token. Un `<div class="bg-card">` nuevo trae el atenuado correcto sin
que nadie lo pida.

**Lo que se probó y se descartó: un porcentaje por superficie.** La alternativa era apuntar a
*paridad de ratio* —que el atenuado diera ~7,5 sobre cualquier fondo, para que pesara igual en
todas partes— y salía: 20% de `--foreground` sobre `--card`, 35% sobre `--muted`. Se descartó
por dos motivos. Uno, son **cuatro constantes** (superficie × tema) que hay que re-derivar cada
vez que se mueva un token. Dos, y el que decidió: el 85% hacia el propio fondo **ya era la
fórmula publicada** por la franja de contacto y por la etiqueta neutra, así que la paridad de
ratio habría metido una segunda regla que se parece a la primera — justo lo que produce el
drift que este documento persigue. El coste aceptado, con los ojos abiertos, es que el
atenuado dentro de una tarjeta pesa más que fuera (9,14 frente a 7,10 en claro).

**El fallo de disparador, otra vez.** La regla enganchada a la **clase** no ve las superficies
que un elemento se pinta a sí mismo con un `color-mix` inline. Cuatro velos escritos a mano
—el chip numerado de «Cómo trabajo», la fila cebra de tipografía, la sección del esqueleto y el
panel de tokens invertido— eran esa misma superficie sin llevar su utilidad, y se quedaron
fuera con 6,62–6,80; el invertido, con **4,33 en oscuro, por debajo de AA**. De ahí
`data-surface`. Es el mismo error que ya se había cobrado el inventario de iconos (se leía
`icons.tsx` teniendo el sitio siete glifos repartidos) y el censo de pares (se leía
`globals.css`, donde los pares compuestos no existen): **la condición miraba a un sitio y la
cosa ocurría en otro**.

## Tablas

**2026-08-09 (P37.658) — la cebra que se borró al medirla, y es la mejor lección de la tanda.**
La tarea preguntaba lo que manda D36: ¿la cebra y el filete significan cosas distintas, o es
una tabla haciendo algo que las otras no? La hipótesis de partida —«la cebra ayuda cuando la
fila es alta y hay muchas columnas»— **no sobrevivió al inventario**: la «Tabla de uso» del
Brand Kit tiene cinco columnas y no la lleva.

Así que se buscó un eje mejor, y se encontró uno bueno: **la forma de la fila**. Una fila de
una línea de celdas se separa bien con un filete; una fila que es un bloque que se envuelve
—espécimen grande a la izquierda, rejilla de metadatos a la derecha— no, porque entre dos filas
altas hay más distancia que entre las dos mitades de una misma fila. Bajo esa lectura la cebra
se quedaba, y se le dio también a la tabla de Cabeceras, que tiene la misma forma.

**Y entonces Francisco la miró en pantalla y no le cuadró, así que se midió.** El velo daba un
salto de **ΔL\* 1,02 en claro** y 2,02 en oscuro, contra los **3,89 / 9,04** de la pastilla de
hover, que es el escalón que este documento usa como referencia de «esto se ve»
(§Accesibilidad, punto 4 del método). La banda **no estaba agrupando filas** —su única
justificación—: ponía un tinte por debajo del umbral, y por eso se leía como que algo no
cuadraba en vez de como estructura. Se borró de las dos.

> **La lección: un argumento de diseño bien construido sigue siendo una hipótesis hasta que se
> mide.** El de la forma de la fila era impecable en su razonamiento y falso en su premisa —daba
> por hecho que la banda se veía—. Ninguna de las dos hipótesis, ni la de las columnas ni la de
> la forma, se cayó por discutirla mejor: las dos se cayeron con un número.

**Lo que la cebra estaba tapando.** Al quitarla se vio que la tabla de tipografía era la única
de las seis apoyada en el fondo de la página: su contenedor era `PANEL` copiado a mano y sin el
`bg-card`. El velo de las filas pares **fingía la superficie que faltaba**, así que el drift no
lo introdujo quitar la cebra — llevaba ahí desde siempre, escondido detrás de ella.

**Y una sexta tabla que el inventario no contó.** Se hizo mirando el Design System y el Brand
Kit, porque son las páginas que documentan el sistema. La que faltaba —la de la política de
cookies, con una **cuarta** definición de cabecera y sus `Th`/`Td` locales— estaba en la página
que nadie asocia con diseño. Al migrarla apareció además un fallo de la capa recién escrita: su
padding lateral usaba `--page-x` (40px), heredado de las tablas a ancho de página, y dentro de
una columna de lectura de 42rem esos 80px se comían casi un cuarto de la tabla. **La capa nueva
había dejado esa tabla peor que como estaba**, y solo se vio comparándola con producción.

## El morado de los fondos invertidos

**2026-08-10 (P37.657).** `brand-purple-accent` se publicó desde el principio con una salvedad
—«cumple solo como texto grande (≥3:1) sobre fondos invertidos»— y era la única grieta en el
«todos los pares en AAA, sin excepciones». Al ir a cerrarla se vio que **la salvedad no era del
morado**: las secciones invertidas se pintan sobre `--foreground`, que salta de carbón a hueso
con el tema, y contra esas dos superficies a la vez **ningún color fijo puede pasar de
3,71:1** (la media geométrica de sus contrastes). El valor que teníamos daba 3,96 y 3,49, media
geométrica 3,72: estaba **en el óptimo**. Se probó lo obvio primero —cambiarlo por el morado
estándar— y era peor: 2,81 sobre tarjeta clara.

Lo que lo desbloqueó no fue elegir mejor el color, sino dejar de exigirle que fuera uno solo.
El token conmuta con el tema y sube a **7,04/7,21**. **El cálculo completo, los dos call sites
que usaban el token fuera de su regla y la lección de método sobre los umbrales del censo están
en `DECISIONS.md` D41** — aquí no se copian, que es la regla 5 de «Cómo se escribe una regla».

## La regla del control sobre imagen prometía de más (2026-08-18)

**La regla está en `BRAND.md` §Un control sobre una imagen.** Aquí, la corrección: qué se midió
para descubrir que afirmaba más de lo que el componente da, y por qué la palanca obvia no valía.

**Lo que se cayó.** La regla decía «siempre hay un borde que pasa 3:1 aunque cambie cuál». Con un
metro más estricto —el **peor de 144 ángulos** del perímetro del disco, en vez de unos pocos
puntos— el mejor de los dos bordes EXTERNOS da **2,82–2,91 en reposo**, por debajo de 3:1 y en
las cuatro combinaciones de página y tema. Lo que sí se sostiene es el borde INTERNO (7,93 claro
/ 8,36 oscuro), porque son dos tokens del sistema y detrás no hay póster que valga.

**Y la palanca obvia era contraproducente por construcción**, que es la parte reutilizable. Subir
el velo acerca el póster a `--background`; eso **separa** al disco (`--primary`, lejos del fondo)
y **acerca** al anillo (`--primary-foreground`, que *es* prácticamente el fondo). Los dos bordes
tiran en direcciones opuestas. A 0,55 pasan tres combinaciones (3,69 / 3,97 / 3,00) y la cuarta
se queda en 2,92, además de lavar el póster. *Un velo no puede separar a la vez dos colores que
están en lados opuestos del fondo.*

**Cómo se resolvió: corrigiendo la AFIRMACIÓN, no el componente.** WCAG 1.4.11 pide que el
componente se **distinga**, no que cada punto de su contorno pase 3:1, y con un borde interno a
7,93 y un disco relleno de 64px se distingue. No había un incumplimiento: había una regla que
afirmaba de más. *Es el desenlace que conviene recordar la próxima vez que un barrido exhaustivo
tumbe una frase publicada: a veces lo que sobra es la frase.*

**De paso cayó la sospecha sobre el hover.** Apagar el velo del todo no empeora nada: lo mejora
un poco (2,84 / 2,87 / 2,93 / 3,04, todos por encima de su propio reposo), porque quitar el velo
aleja el póster del anillo. El estado que la decisión original no llegó a medir resultó ser el
bueno.

## El censo de contraste se rompió dos veces, y la segunda destapó un par real (2026-08-17 → 18)

**La regla está en `BRAND.md` §Cómo se hace el censo de pares.** Aquí, los dos fallos.

**El segundo, que es el instructivo.** `hoverDeclarations()` decidía si una regla era de grupo
con `if (rule.cssRules)`, y **desde que Chrome soporta CSS Nesting toda regla normal expone
`cssRules`** —vacío—, así que la condición era siempre cierta y el selector nunca llegaba a
comprobarse: el censo encontraba **0** reglas con `:hover` donde hay **21**.

**Era la segunda vez que esa misma función fallaba por lo mismo.** Ya se había arreglado una vez
porque un bucle plano se saltaba las utilidades `hover:` que Tailwind envuelve en `@media`, y se
corrigió el síntoma con un test de «esto es una regla de grupo» que el navegador invalidó
después. La corrección buena es que **no es o-grupo-o-selector**: con nesting una regla puede
tener las dos cosas, así que se evalúa el selector si lo tiene **y** se baja si tiene hijas de
verdad (`cssRules.length > 0`).

**La lección: un metro que devuelve una lista vacía parece un aprobado.** El censo publica ahora
cuántas reglas `:hover` ha indexado y cuántos pares ha medido con ellas, y con cero lo dice en
vez de callarse. Era la tercera vez que este proyecto se encontraba un metro descalibrado
—medidor fuera de gamut, umbral por tamaño de texto, y esto—, y las tres se descubrieron igual:
**midiendo un caso cuyo resultado ya se conocía**.

**Y no era teórico.** Con los hover dentro apareció un incumplimiento real que llevaba escondido
detrás del fallo: la dirección de email de Accesibilidad daba **6,42 claro / 5,59 oscuro** en
hover —AA, no AAA— porque pisaba el color a mano en vez de usar el `tone: "muted"` de la
variante. Era el quinto uso del mismo fallo, y sobrevivió a tres auditorías porque el par solo
existe mientras el cursor está encima.

## El censo midió 15,32 lo que la pantalla pintaba a 5,97 (2026-08-27)

**La tercera rotura del censo, y la primera que sale con forma de sobresaliente.** Las dos
anteriores devolvían listas vacías o cortas. Esta devolvió una cifra concreta, alta y falsa.

El ordinal de la banda de bloque (`ui/block-opener.tsx`, D125) llevaba `opacity-70`. El censo
lo puntuó con **15,32** —el anclaje, la mejor cifra del sitio— porque lee
`getComputedStyle(el).color` y de la opacidad solo mira si vale 0. El píxel pintado daba
**5,97 en oscuro**, por debajo del 7 que WCAG pide a AAA en texto de 12,8px.

**Lo que hace este caso distinto de los dos anteriores:** aquellos se destaparon porque el
resultado era sospechosamente vacío. Este no tenía nada de sospechoso — era el mejor par de la
página. Lo destapó una revisión de diseño mirando la pantalla, no el informe.

**Por eso la regla que faltaba no era del metro.** El punto 8 de §Cómo medir ya decía «un clon
del DOM, un `getComputedStyle` o el JSX no son la página», y describe este fallo con
precisión literal. La regla existía, tenía tres semanas y se incumplió igual. Lo que faltaba era
la regla de UI: **el atenuado de un texto no se elige, ni por color ni por opacidad** (D127).

**Y una nota sobre el «sin excepciones» de §Accesibilidad:** esta es otra vez en que la frase
«todos los pares que el sitio pinta están en AAA» fue falsa mientras se publicaba. Por eso el
recuento salió de esa línea: un número que caduca cada vez que ocurre lo que describe no es un
dato, es una promesa de tener que editarlo.

## Cómo se escribe una regla

**2026-08-16 (P47.5) — la regla 1 gana un segundo eje: el momento.** Nació de tres casos que
eran todos del mismo tipo —el disparador miraba a un **sitio** y la cosa ocurría en otro:
`icons.tsx` frente a los siete glifos repartidos, `globals.css` frente a los pares que solo
existen al componer, y la clase frente a las superficies pintadas con un `color-mix` inline.

Lo que apareció al cambiar el método de verificación es el mismo fallo en el **eje del
tiempo**. El gate de accesibilidad se disparaba una vez, **al cerrar** una página. Para siete
de sus ocho puntos eso está bien; para el alto de una banda dimensionada por `vw`, no —**al
cerrar ya no es un ajuste, es un rediseño**, y ese es exactamente el precio que se pagó con
D50: el arreglo llegó desde producción y desde un lector con otra pantalla. Por eso el gate
pasa a tener dos disparos y el primero es *mientras se dibuja*.

**Lo que hace que merezca ampliar la regla en vez de anotarlo:** un disparador tardío es
**invisible en la revisión**, igual que uno mal situado. Nadie lee un checklist y piensa
«esto llega tarde» — se lee y se cumple, y el hallazgo aparece igualmente, solo que cuando
arreglarlo cuesta diez veces más. Es el mismo motivo por el que la regla 1 existía ya: no es
que la regla estuviera mal escrita, es que **se cumplía y aun así no servía**.

El detalle de qué se cambió y por qué —incluidas las otras tres cosas que la frase vieja tenía
mal, y solo una era la herramienta— está en **`DECISIONS.md` D52**; aquí no se copia (regla 5).

---

## El morado como gráfico, y la tercera vez del mismo peldaño (2026-08-17)

**La regla nueva está en `BRAND.md` §El morado decorativo no vale como elemento gráfico.** Aquí,
lo que costó descubrirla y por qué merece estar escrita.

**Cómo apareció.** El primer artefacto del deep-dive es un diagrama de estados, y §Color deja
entrar ahí los tokens de marca sin discusión: la lista dice «ilustración, gráficos». Así que se
dibujó con el reparto que la marca manda —**el cian lleva, el morado apoya**— y se dejó escrito
en el componente que ese reparto era «exactamente el que manda la marca». Lo era. Y aun así el
gate lo tumbó: **2,65 contra `--background` y 2,81 contra `--card` en tema claro**, por debajo
del 3:1 que WCAG 1.4.11 pide a un gráfico que hay que entender.

**La lección de método, que es la que vale para la próxima:** *la marca manda el reparto, no el
contraste.* Dos reglas del documento pueden ser ciertas a la vez y aun así no componerse —«el
morado es decorativo y apoya» + «los gráficos pueden llevar color de marca» no implica «el
morado puede llevar información en un gráfico»—. La composición hay que medirla, igual que se
mide un par que solo existe al superponer un velo.

**Y el número no era nuevo.** El 2,81 es *exactamente* el que D41 midió el 2026-08-10 al retirar
el morado de los rótulos de la escalera del Brand Kit. O sea que el mismo hallazgo llegó dos
veces por dos puertas distintas —una vez como texto pequeño sobre tarjeta, otra como trazo de un
diagrama— porque la primera se anotó como decisión de aquel caso y no como propiedad del color.
Ahora está escrita como lo segundo.

**La salida es la misma de D41, y por eso se escribe la regla en vez de la excepción: el peldaño
que no llega se atenúa, no se tiñe.** Va por tres —el rótulo de la escalera split→flat, el
atenuado de las tarjetas y ahora el arco de vuelta del diagrama—, y en las tres el resultado
fue mejor que el original: `--muted-foreground` se recalcula por superficie (D39), así que no
hay que elegirlo.

**Lo que NO se perdió al quitar el color**, y conviene decirlo porque es lo que hace barata la
regla: los dos caminos del diagrama ya se distinguían por el **trazo** —continuo contra
discontinuo— y por su **etiqueta**. El punto 6 del checklist se cumplía sin el color, así que
retirarlo no costó ni una unidad de información. *Cuando quitar un color no cuesta nada,
probablemente ese color no estaba diciendo nada.*

El detalle técnico —qué mide el gate, cómo se sanea el SVG y por qué el artefacto no se
redibuja— está en **`DECISIONS.md` D54**; aquí no se copia (regla 5).

## Un control sobre una imagen no puede fijar su color (2026-08-17)

**El caso.** Los deep-dive de INDYA y TheTool incrustan un vídeo con facade: un póster con un
disco de play encima. El disco es `--primary` con su `--primary-foreground` dentro, que es el uso
correcto del cian —reproducir es una acción, no decoración—. Y sobre el póster de TheTool **no se
veía**: su teal de marca es casi el cian del sitio.

**Medido sobre los píxeles que el navegador pinta: 2,81 en oscuro y 2,59 en claro.** Por debajo
del **3:1 que WCAG 1.4.11 pide a un componente de interfaz**. Nada de lo que había lo veía: axe
no evalúa contraste de gráficos, el typecheck no ve colores y `gate:html` compara marcado, no
píxeles. Se vio mirando la página.

**Lo primero que se probó, y por qué no valía.** Un velo negro sobre el póster. Arregla oscuro
—oscurece el teal y el cian claro despega— y **empeora claro**: en tema claro `--primary` es un
cian oscuro (`#005859`), así que oscurecer el póster lo acerca en vez de alejarlo. De 1,45 bajaba
a 1,05. Es exactamente D41 otra vez: **un valor fijo no puede servir a dos superficies opuestas**,
solo que aquí la superficie es una imagen y no un token.

**Lo que sí funciona: el velo es del FONDO.** `--background` oscurece en tema oscuro y aclara en
tema claro, así que **aleja la imagen del control en los dos**. Misma familia que `--surface-dim`
(D39) y que la bolita del switch (§Controles con dos fondos): la pieza se define contra su propio
carril, no contra lo que le toque detrás.

**La opacidad se midió, no se eligió.** Barrido sobre el peor póster:

| velo | oscuro | claro | |
|---|---|---|---|
| 0,25 | 3,05 | 2,85 | falla |
| 0,30 | 3,23 | 3,00 | justo en el umbral, sin holgura |
| **0,35** | **3,50** | **3,22** | el elegido |
| 0,40 | 3,76 | 3,44 | lava el póster de más |

**Y aun así el velo solo no basta**, porque el póster siguiente puede ser cualquier cosa. De ahí
el **control de dos tonos**: relleno `--primary` + anillo `--primary-foreground`. Con los dos,
siempre hay un borde que pasa aunque cambie cuál — en INDYA/oscuro lo salva **el anillo (3,06)** y
no el disco (2,73), porque su póster es un tono piel/madera de luminancia media, justo donde el
cian claro del tema oscuro se le acerca. El borde interno anillo/disco mide **8,36 / 7,93
siempre**, porque son dos tokens del sistema.

**Las dos veces que el metro estuvo mal, que es la parte que más enseña.** *(Regla 3: valida el
metro antes de creerte el hallazgo — aquí aplicada al revés, porque el hallazgo era real y lo
malo eran las cifras.)*

1. **El modelo aritmético daba 3,56 donde la pantalla daba 2,81.** Componía el velo sobre un teal
   muestreado en otro punto del póster, más oscuro que el de la zona del disco. *Un modelo del
   color no es una medida del color.* Las cifras publicadas salen de los píxeles pintados y se
   **sustituyeron** en todos los sitios que las citaban, no se anotaron al pie (regla 6).
2. **El primer muestreo del anillo caía sobre el triángulo** del play y devolvía
   `anillo/disco = 1,01` — un número imposible que delataba el fallo. Dos causas: el glifo va
   centrado y desplazado 3px a la derecha, y `getBoundingClientRect` **no incluye el
   `box-shadow`**, así que el radio del anillo no se puede calcular desde la caja. Se corrigió
   muestreando en polares a 225° y **detectando el anillo por barrido radial**. La señal de que
   quedó calibrado: el anillo sale exactamente `--primary-foreground` en los dos temas.

La regla en presente está en **`BRAND.md` §Un control sobre una imagen**; el detalle técnico del
componente —facade, CSP, consentimiento— en **`DECISIONS.md` D55**. Aquí no se copian (regla 5).

## El morado de la barra de progreso, con los papeles cambiados (2026-08-21)

`--progress-ink` (P60, «Cómo se ha creado esta página») es el segundo caso —tras
`brand-purple-accent`— donde el morado decorativo tiene que leerse como UI y un
color fijo no llega. La diferencia con aquel: la barra de progreso vive sobre
`--background` DIRECTAMENTE, no sobre una banda invertida, así que el papel de
cada tema se cambia. `brand-purple-accent` pinta `0.78` en claro (fondo carbón
de la banda) y `0.45` en oscuro (fondo hueso); `--progress-ink` pinta al revés:
`0.45` en claro (el fondo de página en claro ES hueso) y `0.78` en oscuro (el
fondo de página en oscuro ES carbón). Mismo mecanismo, mismo par de valores,
superficie de referencia invertida entre los dos tokens.

La regla en presente está en **`BRAND.md` §Color**.

**Generalizado el mismo día (P60 tanda 2/3):** el numeral ilustrado de `SectionCover` vive
sobre la misma superficie (`--background` directo) que la barra, así que se probó ahí antes de
inventar un token nuevo. Medido con un `<canvas>` (método de `BRAND.md` §Cómo medir sin
equivocarse), no asumido por analogía: **7,21:1 en claro / 7,83:1 en oscuro**, AAA en los dos —
de hecho por encima del propio umbral AAA de texto normal (7:1), no solo del de texto grande
(4,5:1) que le tocaba. La regla de alcance pasó de «solo para esa barra» a «cualquier
texto/gráfico grande directamente sobre `--background`»; sigue sin valer sobre una superficie
compuesta (tarjeta, velo, banda invertida), que ya tiene su propio token calculado contra SU
fondo.

## La pasada completa, y las tres veces que el «sin excepciones» fue falso (2026-08-18 → 23)

Contexto de la regla de `BRAND.md` §Accesibilidad, que hoy dice «todos los pares en AAA, sin
excepciones» y remite a `npm run censo`. La afirmación es vieja; lo que cambió es qué la sostiene.

**La excepción que dejó de serlo (2026-08-10).** La última salvedad viva era
`brand-purple-accent`, y desapareció al hacerlo conmutar con el tema (§Color). El aprendizaje no
era del morado: era que **ningún color fijo sirve a dos superficies opuestas**.

**La primera pasada del 2026-08-18 se corrió sobre 8 de las doce páginas.** Preguntarse por las
cuatro que faltaban es lo que destapó **D61**: el atenuado no se recalculaba al cambiar de
superficie *por hover*, así que una tarjeta que se aclaraba con el cursor cambiaba de fondo sin
recalcular su gris. *Un metro bien calibrado que no se pasa por todo el sitio sigue siendo un
metro que no ha mirado.*

**Y la segunda se quedó vieja sin que nada avisara (2026-08-22).** La pasada del 18 cubrió las
doce que había. Tres días después el sitio tenía **trece** —«Cómo se ha creado esta página», que
se publicó un día después de `LAST_A11Y_REVIEW`— y el copy siguió diciendo «AAA en las doce
páginas». Nada mintió: simplemente, un procedimiento que solo existe como **hábito** no cubre lo
que se añade después de la última vez que alguien se acordó. De ahí `npm run censo`, que lee las
páginas de `PAGE_SLUGS` en vez de una lista escrita, y `PAGE_COUNT`, que hace que la cifra
publicada no se escriba (D85).

**Lo que se encontró al automatizarla.** Nada bajo AAA en 380 pares — pero sí un falso positivo
del propio medidor: `overImage()` marcaba «texto sobre foto» por solape de rectángulos contra
cualquier imagen del documento, sin mirar el apilamiento, y el diálogo de consentimiento —`fixed`,
con su `bg-card` opaco, encima del hero— salía marcado en tres páginas. **22 de los 26 pares que
mandaba mirar a ojo no tenían imagen debajo.** Una lista de revisión manual inflada de falsos
positivos es una lista que nadie lee: la tercera forma, después del metro descalibrado y del
umbral mal aplicado, de que un medidor deje de servir sin dar error.

**Y la TERCERA vez, que es de otra familia (2026-08-23).** Las dos anteriores fueron pares mal
medidos: el metro estaba descalibrado o el umbral mal aplicado, y en cuanto se arregló el
instrumento el par apareció. Esta no. Esta vez **el par nunca estuvo en el campo de visión del
metro**.

Diseñando el primer estado de error del sitio —el del formulario de `/contacto`, P66— se midió
`--destructive`, un token que shadcn trae por defecto y que **lleva en el repositorio desde el
principio sin un solo uso**:

| Par | Ratio | Veredicto |
| --- | --- | --- |
| `--destructive` sobre `--background`, **claro** | **4,31:1** | **No llega ni a AA** (4,5) |
| `--destructive` sobre `--background`, oscuro | 5,86:1 | AA sí, AAA (7) no |
| `--destructive` sobre `--card`, claro | 4,57:1 | AA raspado, AAA no |
| `--destructive` sobre `--card`, oscuro | 5,27:1 | AA sí, AAA no |

*(Metro validado antes de creerse el hallazgo, como manda la regla 3: los dos anclajes se
reprodujeron **exactos** —13,79 en claro y 15,32 en oscuro—, así que la cifra es del color y no
del método.)*

**Por qué `npm run censo` no podía haberlo cazado, y por qué eso NO es un fallo suyo.** El censo
recorre el **DOM de las páginas servidas**, que es justo lo que lo hace bueno: encuentra los pares
que solo existen al **componer** —un velo `color-mix` sobre la superficie de debajo, una pastilla
de hover— y que ninguna lectura de `globals.css` puede encontrar por muy cuidadosa que sea. Ese
acierto tiene un reverso exacto: **un token que existe y no se pinta en ninguna parte le es
invisible.** El censo mide todo lo que se usa, y nada de lo que no.

**Así que es una familia nueva, y conviene nombrarla porque el catálogo de §Cómo se escribe una
regla no la tenía.** No es un disparador que mira al lugar equivocado (regla 1) ni un metro
descalibrado (regla 3): es un **hueco de cobertura**. El instrumento funciona perfectamente
dentro de su alcance, y el alcance no incluye lo que todavía no se usa. La versión de «afirma
cuánto has mirado» que faltaba aquí no es cuántos pares midió —eso ya lo publica—, sino **qué
tokens de color no ha medido nunca**.

**Y por eso la frase de `BRAND.md` cambió de sujeto**, no de tono: donde decía «todos los pares
del sistema» ahora dice «todos los pares que el sitio **pinta**». No es una cautela defensiva; es
la descripción honesta de hasta dónde llega el metro que la respalda.

**Lo que se hizo mientras tanto.** El estado de error del prototipo lo esquiva entero: el
**mensaje va en `--foreground`** (13,79 / 15,32) y `--destructive` se queda como marca **no
textual** —el icono y el filete—, donde 4,31 supera de sobra el 3:1 que WCAG 1.4.11 pide a un
componente, y de paso el error deja de estar codificado solo por color (punto 6 del checklist).
**Eso resuelve el caso, no el token**, y arreglarlo entra en el desarrollo de `/contacto` (P67)
por decisión de Francisco: o se recalibra `--destructive` conmutándolo por tema —el patrón de
`--brand-purple-accent` y `--progress-ink`— o se escribe la regla de que el rojo no es color de
texto. Hoy no está escrita en ninguna parte, que es medio motivo de que esto ocurriera.

## El enlace de contenido invertido (2026-08-23 → 25)

Visto en pantalla durante P66, poniendo los canales de contacto sobre una banda invertida:
**desaparecieron**. Solo quedó flotando el subrayado cian sobre el fondo.

La causa es de una línea: `.link-content` fija `color: var(--foreground)`, y en una superficie
invertida —`bg-foreground text-background`, el gesto de «Más allá del PM» y de la portada de
«Cómo se ha creado»— **`--foreground` es el fondo**. El enlace se pinta del color de la banda.

**Lo que hace interesante el caso es la asimetría con la capa de chrome**, que sí lo tiene
resuelto desde P60 con `tone: "inverted"`, y con el porqué escrito: `muted` rompe dos veces sobre
una banda, y en hover sube a `--foreground`, que ahí es texto invisible. O sea que el problema
estaba **diagnosticado y resuelto en una capa y sin tocar en la otra**.

No fue descuido: fue que el caso no había ocurrido. Es la regla 1 de §Cómo se escribe una regla
leída del revés — un disparador no puede fallar si nunca llega a dispararse. Y es la razón de que
esto se quedara como deuda latente en vez de arreglarse en caliente: no había ni un enlace de
contenido sobre fondo invertido en todo el sitio.

### Y al arreglarlo (2026-08-25, P70.18), el modificador era la respuesta equivocada

La ficha proponía `.link-content--inverted`, que es lo que haría la capa de chrome. **No sirve
aquí, y la diferencia no es de estilo: es de quién sabe la respuesta.** Una variante de chrome se
elige al escribir el componente, y quien la escribe está mirando la banda. Un enlace de contenido
vive dentro de la **prosa del diccionario**, y quien redacta esa frase no sabe —ni tiene por qué
saber— sobre qué fondo va a caer el párrafo. Un modificador ahí es una regla que hay que recordar
en el sitio donde menos información hay, que es la forma segura de que se incumpla.

Así que va como `--surface-dim` (D39), `--chrome-hover-bg` y `--control-edge` (D97): **lo resuelve
la superficie**. Una banda que ya se declara `data-surface="inverted"` —porque lo necesita para el
atenuado y para la pastilla de hover— arregla también sus enlaces, sin tocar el copy y sin que
nadie se acuerde.

**Y los colores no hubo que elegirlos.** Los tres son los del otro tema: texto en `--background`
(el primer plano de esa superficie), acento en `--primary-on-inverted` (el cian del otro tema, que
ya existía) y, bajo el relleno del hover, un `--primary-foreground-on-inverted` que es el
`--primary-foreground` del otro tema. Eso hace que **el par de hover no necesite medición nueva**:
son exactamente los dos colores del par «texto sobre botón» que el censo ya da por bueno —7,93:1
en claro, 8,36:1 en oscuro—, intercambiados. Es el mismo argumento con el que
`--brand-purple-accent` dejó de ser fijo: un solo valor para las dos superficies topa con un techo
que no depende del tono.

Se publica en §08 del Design System, y no como quinta tarjeta de su rejilla: con cuatro por fila,
la quinta se quedaría sola. Va a lo ancho, que además es como aparece de verdad.

## La pasada de retirada del 2026-08-22, y qué se fue de `BRAND.md`

**Por qué hubo que hacerla.** `BRAND.md` se partió el 2026-08-09 y el corte ganó 1.033
palabras. Diez días después el archivo estaba **por encima del punto de partida**: 4.626 antes
de partirlo, 3.593 al partirlo, 4.998 el 19 de agosto. La partición compró tiempo; lo que no
existía era el hábito de retirar. Familia «añadir sin retirar», y con un matiz que importa: el
mecanismo para retirar ya existía desde el 2026-08-19 (paso 1 bis de `close-session` +
`check:contexto`). Lo que no había ocurrido nunca es pasarlo por este archivo. **No faltaba el
portador: la deuda era anterior al portador.**

**Qué bajó, y dónde vive ahora.** Casi todo estaba ya contado aquí, así que la operación fue
comprobar la cobertura y borrar arriba, no mover:

| Lo retirado de `BRAND.md` | Dónde estaba ya |
|---|---|
| Las cifras de `--brand-purple-accent` (3,71 fijo · 7,04 / 7,21 conmutando) | §El morado de los fondos invertidos |
| La medición del atenuado en hover de D61 (9,14 · 7,79 / 9,01 · 8,17 / 9,17) | §El atenuado sensible a la superficie |
| El barrido del botón de play: 2,81 / 2,59, el borde interno a 7,93 / 8,36 y los 144 ángulos del perímetro | §Un control sobre una imagen · §La regla del control sobre imagen prometía de más |
| Que la pastilla neutra escribe `text-muted-foreground` «desde el 2026-08-09» | §Etiquetas |
| La variante «G» aparcada de los enlaces de contenido | §Jerarquía de hover |
| El 12% del texto en el hover de `toggle-primary` | §Jerarquía de hover |

**Y lo que no estaba en ningún sitio, que es lo que este párrafo existe para conservar:**

- El **cian primario en hexadecimal** (`#005859` claro / `#3FC9C4` oscuro) estaba escrito como
  bullet de §Accesibilidad. Se va porque el propio documento dice dos párrafos más arriba que
  «el censo con las cifras vive en `lib/design-values.ts`, no aquí» (D38) y porque §Modo oscuro
  ya prohíbe hardcodear hex. Es la misma familia que el hallazgo del 2026-08-21: un documento
  publicando una cifra que su propio bullet prohíbe.
- Dos verificaciones de los **iconos propios**: que `user` ocupa 16×20 sin verse pequeño (era
  el ejemplo de «no hay que llenar el artboard») y que **al 400% todos los dibujos se ven
  bien** (resultado de la pasada del 2026-08-08, no una instrucción).

**Resultado.** `BRAND.md` 4.764 → 4.516 palabras. Con la bajada del índice de decisiones
(D88), el contexto de arranque queda en **11.976** y por primera vez cabe en el objetivo de
12.000 que se fijó el 2026-08-19.

**La lección, que no es la del tamaño.** Lo que se retiró no era relleno: era **narrativa
fechada de mediciones que ya se cuentan aquí**. Un documento que se declara «en presente» y
acumula doce fechas no es que esté mal escrito; es que le falta el momento de bajarlas. Ese
momento existe y es `close-session`, pero solo se dispara si alguien mira el archivo — y por
eso el número lo vigila `check:contexto` y no la disciplina.

## La tarjeta salió en negrita con la clase correcta puesta

*(2026-08-23, P67.)* La variante `card` nació para los dos canales de `/contacto`, y su
clase incluye `font-normal` porque la base de `actionVariants` asume un control en línea
con etiqueta de una palabra: `justify-center`, `whitespace-nowrap`, `font-semibold`. Con la
clase puesta, el correo de la tarjeta se pintó en **600**.

El motivo es que **`cva` concatena, no fusiona**. Las dos clases llegan al atributo
`class` y ahí no decide el orden en que se escribieron, decide el ORDEN DEL CSS GENERADO,
que Tailwind ordena canónicamente por valor: `font-normal` (400) se emite antes que
`font-semibold` (600), así que gana el segundo. `cn` es `twMerge` y sí resuelve el
conflicto quedándose con la última, que es la de la variante.

Lo reutilizable no es el dato de Tailwind: es que **una variante que deshace su propia base
no es autosuficiente**, y que esto se vio en pantalla y no leyendo el código, con la clase
correcta escrita. Es el punto 5 de §Cómo medir sin equivocarse con otro disfraz — «verifica
la clase, no solo el color»— aplicado al peso tipográfico.

## El contorno de un control: 1,21:1 desde V1, y el metro que no existía (2026-08-23)

Lo encontró la `design-review` del cierre del sprint «Footer y contacto», midiendo el campo
del formulario recién publicado. El campo daba **1,29:1** contra su panel en claro y **1,23**
en oscuro, con un umbral de 3:1 (WCAG 1.4.11) y sin relleno propio: el borde era **lo único**
que decía que ahí se escribe.

Al medir el resto de controles con borde, el campo resultó ser el más leve:

| Control | Borde vs fondo (claro / oscuro) | Relleno vs fondo |
|---|---|---|
| `input` · `textarea` | 1,29 / 1,23 | — |
| Toggle de tema, GitHub y LinkedIn del pie (`icon`) | 1,21 / 1,37 | 1,06 / 1,11 |
| Tarjeta pulsable (cierre de página, índice de trayectoria, canales) | 1,21 / 1,36 | 1,06 / 1,11 |
| Enlace de salto (`outline-neutral`) | 1,21 / 1,36 | 1,00 |
| Lo bordeado en `primary` | 7,47 | — |

**El toggle de tema llevaba así desde V1.** Nada de esto era nuevo; lo nuevo era que alguien
lo midiera.

### Por qué no lo vio nadie, que es la parte reutilizable

La cadena de medición terminaba donde no había nadie: `check:marco` **delega** el contraste
en `viewport-verifier`, `viewport-verifier` corre axe y dispara el censo, **axe no implementa
1.4.11** —está en su lista de comprobaciones manuales— y el censo medía pares de texto. Tres
eslabones, ninguno mintiendo, y un agujero al final. `grep` de «1.4.11» en `scripts/`
devolvía cero mientras `/accesibilidad` publicaba que «todo texto y **todo control** se
comprueba con cifra».

Y **el nombre ayudó a esconderlo**: «censo de pares de contraste» suena exhaustivo. Si se
hubiera llamado «censo de pares de TEXTO», el hueco habría sido visible el día que se
escribió, y esa frase no se habría podido redactar. Es §Cómo se escribe una regla nº1 —el
disparador que mira al sitio equivocado— aplicado al **nombre** de un instrumento.

Fue además **la segunda vez en el mismo sprint**: doce días antes, `--destructive` no llegaba
ni a AA y «el censo no podía haberlo visto». Aquella vez se arregló el caso y se escribió una
regla; no se tocó el metro. Documentar el punto ciego de un instrumento no lo cierra.

### Por qué se parte el token en vez de subir `--border`

`--border` y `--input` tenían **el mismo valor** en los dos temas, y ese valor servía dos
decisiones con requisitos distintos: el filete decorativo (sin umbral) y el contorno de un
control (3:1). Subir `--border` habría endurecido cada hairline del sitio para arreglar los
controles. Es §Cómo se escribe una regla nº4 al revés: la regla avisa de no unificar dos
valores que se parecen sin mirar si significan cosas distintas, y aquí estaban unificados de
nacimiento.

`--input` se queda declarado —es de la base de shadcn— pero **ya no lo consume nadie**.
Nombrarlo como si gobernara los campos fue parte de cómo el borde real pasó año y medio sin
que nadie lo mirara.

### El barrido de mezcla, y por qué conmuta con el tema

`--control-edge` se deriva de la superficie, igual que `--surface-dim`. El porcentaje mínimo
para llegar a 3:1, medido sobre el píxel pintado:

| Superficie | Mínimo en claro | Mínimo en oscuro |
|---|---|---|
| `--background` | 50% | 35% |
| `--card` | 50% | 40% |
| `--muted` | 55% | 40% |

De ahí que **la mezcla conmute con el tema**: un porcentaje fijo no llega a las dos a la vez,
igual que ya pasa con `--primary-on-inverted` y `progress-ink`. Se fijó en **60% claro / 45%
oscuro** —un escalón por encima del mínimo, para que un retoque de paleta no lo tumbe—, que
da 4,00 · 4,08 · 3,85 en claro y 4,11 · 3,96 · 3,74 en oscuro.

Se compararon en pantalla 55, 60 y 70 sobre el formulario servido: a partir de 55 el cambio
es casi indistinguible entre candidatos, y el salto que de verdad se ve es el de 1,21 a 3,x —
los campos pasan de insinuarse a **parecer campos**. No engorda el diseño; lo que hacía el
valor viejo era esconderlo.

## El interlineado que sobrevivió a tres medidas, y por qué la medición aprobaba (2026-08-25)

*(El caso que escribió el punto 8 de `BRAND.md` §Cómo medir sin equivocarse.)*

**Lo que pasó.** El artículo se pintaba en producción con una separación entre párrafos
que Francisco señaló **tres veces** mientras se construía. Las tres se midió. Las tres se
dio por correcto. Lo encontró, ya cerrado el sprint, un `/prototype` renderizado al
trabajar P68.493 —el cierre del artículo como monolito de párrafos—: era un bug real.

**Por qué la medición aprobó, que es la parte reutilizable.** D81 dejó escrito su método
con estas palabras:

> «Verificado en pantalla —clonando el DOM servido a ancho de móvil real— en los dos casos
> que sí podían envolver a varias líneas.»

Las dos mitades de esa frase son el fallo, y las dos parecen rigor:

1. **«Clonando el DOM servido» no es mirar la página.** Un clon reproduce los nodos y los
   estilos computados que se le pidan, no el resultado compuesto: el ritmo entre bloques
   sale de márgenes que colapsan, de `:first-child`, del contenedor que no viajó en el
   clon. Se midió un objeto parecido a la página.
2. **«Los dos casos que podían envolver» era una muestra, y no la que dolía.** Se eligió
   por dónde el interlineado podía comprimir texto —una preocupación legítima— mientras el
   síntoma que se señalaba estaba en la separación ENTRE párrafos. El alcance declarado
   nunca contuvo el defecto.

**Y declarar el alcance es lo que lo blindó.** Un informe que dice qué ha mirado se lee
como más riguroso que uno que no lo dice, así que la frase de D81 funcionó como aval
justo donde estaba el fallo. Es la misma forma que el punto 3 de §Cómo se escribe una
regla ataca en los hallazgos —valida el metro—, en el lado del aprobado, que nadie estaba
validando.

**El caso hermano, el mismo día.** Siete diagramas del artículo pintaban sus rótulos entre
5,1 y 6,6px en móvil, y el texto que los describía se leía perfecto. Otra vez: lo que se
miraba no era lo que estaba roto. Ahí el remedio fue un gate (`check:figuras`, P68.59),
construido **después** y con el hallazgo llegando tarde y en bloque — la firma de «la
pieza que nace fuera de la capa».

**La asimetría que explica las dos.** Para accesibilidad el proyecto tiene 20 pasos de CI
y un agente con matriz de viewports y dos disparos. Para lo visual y tipográfico tiene
**un gate manual** —`design-review`— que se dispara «antes de un release visual», o sea al
final. El punto 8 no cierra esa asimetría; solo impide que el aprobado se dé por bueno
cuando contradice a alguien que está mirando.


## La variante que dimensiona una fila, usada en una pila (2026-08-25)

P70.15 sacó a la variante `card` las dos tarjetas que se pulsan enteras y estaban escritas a
mano — el cierre de página y el índice de Trayectoria—. La tarea daba eso por mecánico y no lo
era: **`size="card"` está dimensionado para una FILA**, icono + etiqueta, que es el caso para
el que nació. Las dos tarjetas son **pilas**.

Lo que trae de más, y qué se ve si no se neutraliza:

- **`items-center` de la base.** En un contenedor `flex-col` eso es el eje transversal: el
  contenido deja de estirarse y **se encoge al centro**. El rótulo, el titular y la fila de
  rol dejarían de ocupar el ancho de la tarjeta.
- **`gap-[0.75rem]` del tamaño.** En una pila **separa las tres partes 12px** que hoy no
  existen, y encima del margen que ya llevan escrito.

Ninguno de los dos da error, ninguno lo ve el typecheck, y `gate:html` los habría enseñado
como dos clases más en un atributo que ya cambiaba entero — o sea, escondidos entre las
catorce que la variante añade de verdad. Se cazaron leyendo qué hace cada clase añadida
ANTES de aceptar el diff, que es la única forma: la lista de clases nuevas es corta y la de
sus efectos, no.

**El resto de lo que añade la variante sí es inerte, y también hubo que comprobarlo uno a
uno:** las flechas ya declaraban `size-[18px]`, los logos son `<img>` y no `<svg>`, todos los
textos hijos declaran su tamaño —así que el `text-[0.9rem]` heredado no llega a nadie—, el
subrayado de `globals.css` es de `.link-content` y no de un `<a>` pelado, y `min-h-[44px]`,
`w-full`, `text-left`, `font-normal` y `whitespace-normal` son el valor por defecto en su
contexto. Lo único que cambia de verdad es el `focus-visible:bg-muted`, que era la tarea.

**La lección, que es por qué esto está escrito y no solo arreglado:** una variante no es
neutral respecto a la FORMA del contenido que envuelve. Al llevar un caso a la capa, la
pregunta no es «¿existe la variante?» sino «¿la variante asume una disposición que este caso
no tiene?». Al tercer caso apilado, la respuesta deja de ser neutralizar y pasa a ser un
`size` propio.

## El hover de la tarjeta pulsable, y por qué no se arregló con luminancia (2026-08-25)

Lo levantó `design-review` el 2026-08-23, con el metro validado contra los anclajes de siempre:
la tarjeta `card` pisa **6,25 de ΔL\*** en claro y **4,70 en oscuro**, contra los **9,04** que
pisa cualquier otro hover del sistema. La asimetría tiene causa y no es un error: en oscuro la
tarjeta parte de `--card` (L\* 14,87) y no de `--background` (10,52), así que el salto hasta
`--muted` (19,56) es la mitad de recorrido.

**No se arregló en caliente porque no es un incumplimiento.** No hay umbral de WCAG para la
perceptibilidad de un hover: el 9,04 es una referencia interna. Y toca todas las tarjetas
pulsables del sitio a la vez.

### Lo que descartó subir el relleno: no hay un porcentaje que sirva a los dos temas

Se midió antes de descartarlo, y el barrido es la parte que conviene no repetir. Mezclando
`--muted` hacia `--foreground`:

| Mezcla | ΔL\* claro | ΔL\* oscuro |
|---|---|---|
| Hoy (`--muted` puro) | 6,25 | 4,70 |
| 95% + `--foreground` | 9,75 | **9,22** |
| 92% + `--foreground` | 11,85 | 11,86 |
| `--border` | 9,79 | 6,91 |
| *Referencia del sitio* | *3,89* | *9,04* |

El 95% deja el oscuro clavado en la referencia **y el claro en 9,75, que es dos veces y media
la suya**. Para resolverlo con luminancia habría que hacer conmutar la mezcla con el tema, como
`--primary-on-inverted` y `--brand-purple-accent`. Se puede, y es la respuesta equivocada: el
claro **no tenía ningún problema** —6,25 ya está por encima de su referencia—, así que la
conmutación existiría solo para no estropear lo que ya estaba bien. Eso es un mando nuevo para
sostener una decisión, no una decisión.

### La afordancia que faltaba se añadió en otro eje

Contorno a `--primary` en hover, con el relleno neutro donde estaba. Tres cosas se ganan de
golpe: la señal **no depende del contraste del fondo**, no toca ningún par de texto, y el
estado deja de estar codificado solo por un cambio de tono. Es el mismo cian de acción que ya
usa `outline-primary`, y aquí no compite con nada porque el relleno sigue siendo `muted`.

**Solo en hover, y la asimetría con `focus-visible` es deliberada.** El foco ya trae el anillo
de `--ring` —que ES `--primary`— a 2px de offset, así que un borde cian por dentro dibujaría
dos líneas cianas concéntricas separadas por un hueco: se lee como un defecto, no como una
señal. El teclado no se queda corto, porque conserva el `focus-visible:bg-muted` que P70.15 le
devolvió, y encima el anillo.

**Y lo decidió el ojo, no la tabla**, que es lo que la propia ficha pedía: «puede que a esa
luminancia se vea de sobra y el número engañe». Las tres opciones se pusieron en pantalla con
los tokens reales y un botón que las forzaba todas a hover a la vez, para poder compararlas sin
pasar el cursor. Es el punto 8 de §Cómo medir: cuando alguien que está mirando la página
contradice a la medición, la primera hipótesis es el alcance de la medición.

## Las dos excepciones que salieron

*(2026-08-26, P70.38 · D121)*

La lista de «ningún control se escribe a mano» tuvo **cuatro** excepciones vivas entre el
2026-08-25 y el 2026-08-26. Dos de ellas se escribieron con **condición de salida explícita**,
y las dos la cumplieron el mismo día, al llevar el índice del artículo a las tres páginas
hermanas:

- **La celda de índice** decía «sale cuando la capa tenga el caso *celda pulsable*». Lo tiene:
  `indexCellVariants`, en `ui/section-index.tsx`. Sigue sin ser `actionVariants({variant:"card"})`
  y por el motivo que ya daba la excepción — una tarjeta dibuja su propia caja y la celda vive
  dentro de una cuadrícula que ya cierra sus filetes—, pero lo que comparte con la tarjeta
  (pastilla `muted` en hover, el mismo estado en foco, el objetivo táctil por altura) ya sale
  de un solo sitio.
- **El riel de secciones** decía «sale a `chrome.tsx`». Salió — a `railPillVariants`, en
  `ui/section-index-islands.tsx` — **pero no allí**.

Y esa es la parte que merece quedar escrita, porque es una lección sobre **cómo se redacta una
condición de salida**, no sobre el riel.

`chromeLinkVariants` gobierna el **ancla**: sus tres `shape` describen el contenedor del
enlace. En el riel el ancla no tiene aspecto ninguno — es un cuadrado transparente de 44×44,
el objetivo táctil, y nada más. Todo lo que se ve (el círculo, su expansión en hover, el
estado activo) vive en un `<span>` interior, y ninguna `shape` de chrome puede describir una
pieza *dentro* del enlace. La nota de 2026-08-22 apuntó al archivo vecino más plausible sin
haber mirado la estructura.

**Una condición de salida acierta el CUÁNDO mucho mejor que el DÓNDE.** El «cuándo» se deduce
del problema —hay una sola copia, o falta un caso en la capa— y envejece bien; el «dónde» es
una predicción sobre un refactor que todavía no se ha hecho, y envejece mal. Lo que la
excepción pedía de verdad era que la píldora dejara de ser una cadena inline de veinte clases
con un ternario dentro; eso se cumplió. Que el destino fuera otro archivo no es incumplimiento.

**Corolario para la próxima:** al escribir una excepción, la condición se redacta sobre el
estado del sistema («cuando exista el caso X», «cuando aparezca el segundo call site»), no
sobre el destino del código. Si aun así se quiere dejar dicho a dónde parece que va, se marca
como conjetura y no como compromiso.

## El velo que no declara superficie, y por qué la regla prometía de más (2026-08-27)

**La regla, tal y como estaba escrita.** §El atenuado lo pone la superficie decía, sin
excepción, que un bloque que se pinta su PROPIA superficie con un `color-mix` **tiene que**
declarar a qué familia pertenece. Nació de un caso real y bien medido: cuatro pares de
contraste se escaparon porque un velo escrito a mano no llevaba `data-surface` y la capa no
podía verlo.

**Dónde falló.** P70.44 sacó a la capa la marca de verificación del checklist, que estaba
escrita tres veces (`ui/check-pill.tsx`). La pieza es una pastilla teñida con
`color-mix(in oklch, var(--primary), transparent 86%)`, así que cae de lleno en el supuesto
de la regla. La ficha de la tarea, siguiendo la regla al pie de la letra, pedía declararle
`data-surface` al sacarla.

**Y era el arreglo equivocado.** El velo es un **86% transparente**: lo que manda debajo sigue
siendo la superficie de la que cuelga, y esa ya se hereda bien. Las tres copias viven sobre
fondos distintos —`bg-card` en las dos listas de puntos, `bg-background` en el collage del hero
de `/accesibilidad`—, así que **cualquier familia que se declarase en la pieza sería la
equivocada en dos de los tres usos**. Declararla no habría corregido nada: habría introducido
el fallo que la regla existe para evitar, y encima de forma estática y difícil de ver.

**Lo que distingue un caso del otro no es «pintarse su propia superficie», es cuánto tapa.**
Un velo opaco sustituye la superficie y hay que declararlo; uno casi transparente la deja
pasar y no debe. El corte no se ha fijado en un número porque no hace falta: la pregunta es
si el texto de dentro se lee contra el velo o contra lo que hay debajo, y eso se mide.

**Corolario, que es la parte reutilizable.** Una regla nacida de un caso concreto tiende a
escribirse con el alcance de ese caso y a leerse con alcance universal. Aquí el caso original
eran velos opacos y la regla se redactó como si cubriera todos. Es la misma forma que
§La regla del control sobre imagen prometía de más: **la regla no estaba mal, prometía de
más**, y la corrección no es una excepción al margen sino apretar el enunciado.
