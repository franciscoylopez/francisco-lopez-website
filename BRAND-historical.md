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
- [Color — regla de las dos capas](#color-regla-de-las-dos-capas)
- [Jerarquía de hover en botones y CTA](#jerarquía-de-hover-en-botones-y-cta)
- [Etiquetas](#etiquetas)
- [Cuándo una acción lleva icono](#cuándo-una-acción-lleva-icono)
- [Ningún control se escribe a mano](#ningún-control-se-escribe-a-mano)
- [Accesibilidad](#accesibilidad)
- [Iconos propios](#iconos-propios)
- [El atenuado sensible a la superficie](#el-atenuado-sensible-a-la-superficie)
- [Tablas](#tablas)
- [El morado de los fondos invertidos](#el-morado-de-los-fondos-invertidos)
- [Cómo se escribe una regla](#cómo-se-escribe-una-regla)
- [El morado como gráfico, y la tercera vez del mismo peldaño (2026-08-17)](#el-morado-como-gráfico-y-la-tercera-vez-del-mismo-peldaño-2026-08-17)
- [Un control sobre una imagen no puede fijar su color (2026-08-17)](#un-control-sobre-una-imagen-no-puede-fijar-su-color-2026-08-17)
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
