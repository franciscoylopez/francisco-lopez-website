# Marca — apéndice de logo y firma (referencia a demanda)

> **No se `@`-importa.** Es la referencia exhaustiva del logo y del efecto split (firma).
> Las **reglas siempre activas** de marca (color de dos capas, tipografía, tokens,
> accesibilidad, modo oscuro) viven en `BRAND.md`, que sí se carga cada sesión. Consulta
> este archivo **solo al tocar el logo, la firma split o los assets de marca**.

## Split RGB (firma de marca)

Efecto reservado al logo / monograma, no a la UI general.
- Colores del split: `brand-cyan-split` (#16BDBD) + `brand-purple-split` (#9B87F5) sobre la forma principal.
- Requiere trazo grueso; a tamaño pequeño usa el logo plano de fallback, sin split.
- No lo apliques a texto fino ni a iconos.

## Logo

Componente: `components/ui/logo.tsx` → `<Logo />`.

### Variantes

- **`split`** (por defecto): firma de marca — tres círculos superpuestos (cian, morado, contorno principal) en ligero desplazamiento. Reservada para tamaños donde el trazo se distinga con claridad; a tamaño pequeño el split se empasta visualmente y debe usarse `flat` en su lugar.
- **`flat`**: símbolo monocromo (círculo + base), sin split. Es el fallback seguro para tamaños pequeños o contextos de bajo contraste.

### Props

- `variant`: `"split" | "flat"` (default `"split"`).
- `showWordmark`: `boolean` (default `false`) — añade "Francisco López" en Bricolage junto al símbolo, en lockup horizontal.
- `forceColor`: `"theme" | "white" | "black"` (default `"theme"`) — `"theme"` hereda `var(--foreground)` y cambia solo con claro/oscuro; `"white"`/`"black"` fuerzan monocromía absoluta (incluida la variante `split`, que pierde el efecto split si el color está forzado, porque un split a un solo color no tiene sentido).
- `className`: para tamaño/estilo desde el consumidor.

### Color y temas

El logo hereda claro/oscuro automáticamente: usa los tokens `var(--foreground)`, `var(--brand-cyan-split)` (#16BDBD) y `var(--brand-purple-split)` (#9B87F5), que ya conmutan entre `:root` y `.dark` en `globals.css`. No requiere lógica de tema en el propio componente.

### Tabla de uso (cerrada 2026-07-21)

Todos los tamaños son **altura visible del símbolo** (borde superior del círculo → borde inferior de la base), no altura de la caja SVG. El `viewBox` está recortado a `"30 16 60 72"` precisamente para que ambas coincidan: antes era `"0 0 120 120"` y el símbolo solo ocupaba el 58% de la altura, así que cualquier `h-10` renderizaba 23px en vez de 40 e infradimensionaba el logo un ~42% sin avisar.

| Contexto | Variante | Símbolo | Wordmark | Barra |
|---|---|---|---|---|
| Nav — al cargar | `split` | 48px | sí, ~22px (ver abajo) | 80px |
| Nav — con scroll | `flat` | 28px | no | 64px |
| Footer | `flat` | 32px | no | — |
| Brand Kit (hero de página) | `split` | ≥120px | opcional | — |
| OG image / redes | `split` | ≥200px | sí | — |
| Favicon | `flat` | 32px / 16px | no | — |


**El «sí» del wordmark del nav tiene DOS ventanas donde no aplica, y las dos salen del mismo sitio.** El wordmark son 168px que no encogen, así que cuando la fila del nav no cabe, es la única palanca: ni el gutter ni el hueco recuperan lo que falta, y encoger o recortar el texto está prohibido por la regla 6 de aquí abajo. Se suelta el wordmark y se queda el símbolo, que es la firma.

| Ventana | Desde | Por qué |
|---|---|---|
| `< 360px` | 2026-08-22 | El nav pide 349px exactos: 20 de gutter + 217 de logo + 16 de hueco + 96 del grupo derecho. Por debajo, el sitio entero scrollea en horizontal. El corte se pone en 359 para caer por debajo del iPhone SE (375) y de los Android de 360. |
| `768–1023px` | 2026-09-04 (P72.505) | Con el cuarto enlace del nav la fila mide 730px de contenido y a 768 desborda 48: el toggle de tema se sale de la pantalla. |

*La segunda se decidió viendo las tres salidas medidas con los cuatro enlaces puestos: colapsar el menú en `lg` deja la franja 768–1023 sin «Descargar CV», que es uno de los tres puntos de descarga medidos; acortar la etiqueta a «CV» cabe con 25px de margen; soltar el wordmark cabe con 38, los mismos que hoy. Francisco eligió soltar el wordmark.*

**Y no es una excepción, es la regla del propio nav aplicada dos veces:** esta barra ya suelta el wordmark al hacer scroll, y el footer no lo lleva nunca. Lo que la tabla llama «sí» es «sí cuando cabe».

### Reglas de uso

1. **Umbral split → flat: 48px.** Por debajo, siempre `flat`. El desplazamiento de las capas de color es el 5,1% de la altura del símbolo, así que a 48px el creciente mide ~2,5px — suficiente para leerse como capa de color deliberada. A 32px baja a 1,6px y se convierte en fleco sucio; a 24px desaparece.

   *Por qué 48 y no 64 (corregido 2026-07-21, el mismo día):* la primera medición, sobre una escalera de 24→128px con todos los tamaños en el mismo golpe de vista, situó el corte en 64px. Al probarlo en el nav real resultó demasiado conservador: **la escalera es un juicio comparativo y el uso real es aislado.** Puesto en una barra, sin las versiones grandes al lado para compararlo, el split a 48px se lee sin problema. Lección de método: valida los umbrales perceptivos en el contexto donde van a vivir, no solo en una rejilla de calibración.

   Matiz que sí cambia con el tamaño: a 64px+ el split se lee como *tres círculos superpuestos*; a 48px se lee como *un halo de color deliberado*. Para el nav, la segunda lectura basta. Para una pieza donde la firma sea el asunto (Brand Kit, OG image), usa tamaños donde se aprecie la construcción.
2. **Tamaño mínimo del componente: 24px.** El trazo es el 8,6% de la altura: a 24px son 2,1px y aguanta; a 15px son 1,3px y el antialiasing lo lava a gris pese a llevar el color correcto. El favicon de 16px necesita **asset propio con el trazo engordado**, no el componente reescalado.
3. **Sin contenedor circular.** El símbolo ya *es* un círculo; anidarlo en otro lo convierte en una diana y lo encoge al ~35% de su huella.
4. **El logo nunca mide menos que los iconos de UI contiguos.** Si comparte fila con un icono de 18px, el logo va por encima de esa cifra.
5. **Proporción entre símbolo y wordmark.** Depende de si van compuestos o bloqueados:

   - **Compuestos en UI** (nav, cabeceras): el wordmark va al **40-45%** de la altura del símbolo. Aquí el símbolo es el ancla permanente y el nombre es contexto — de hecho el nav lo suelta al hacer scroll. Es la regla que faltaba y la causa real de que un logo de 64px se percibiera "demasiado grande": el símbolo creció y el texto no, dejando la composición al 29%, así que el logo parecía flotar solo en vez de leerse con el nombre como una unidad.
   - **Lockup cerrado** (assets del kit, portadas, redes, firma de email): el wordmark va al **~60%**. Aquí leer el nombre *es* el objetivo, y el asset se usa a 200px o más, donde un 44% lo deja demasiado pequeño para funcionar como titular.

   Si cambia el tamaño del símbolo, el wordmark cambia con él en los dos casos. Lo que cambia entre ellos es la proporción, no el hecho de escalar juntos.

   **Y desde el 2026-08-23 el componente la CUMPLE, en vez de solo enunciarla.** `logo.tsx`
   dimensiona su wordmark con `RATIO_WORDMARK` (0,45) sobre la altura del símbolo, que se le
   pasa en `symbolPx` — y el tipo lo hace **obligatorio** cuando hay wordmark. Antes era un
   `text-lg` congelado que no escalaba con nada: a su único uso le salía un **56,3%**, y era
   además el único de los siete wordmarks del sitio a peso 400 y sin tracking. Se derivó y no
   se dedujo por una razón medida: `container-type: size` + `cqh` sí lo calcularía solo, pero
   la contención aplica a los dos ejes y **colapsa el lockup a ancho cero** con el texto
   pintándose fuera. Cifras y el barrido de los siete, en `DECISIONS.md` **D94**.

   **El nav y el Brand Kit siguen escribiendo el suyo a mano**, con su propio par de números.
   Están dentro de la banda —45,8% y 42,7%—, así que no incumplen; lo que hay es tres sitios
   que saben la misma proporción. El nav además **anima** la suya (regla 6), así que
   unificarlos no es un reemplazo mecánico.

   *Matizado 2026-07-21, el mismo día que se escribió:* la primera redacción daba un solo rango (40-45%) para todo, generalizando de un caso — el del nav. Al reconstruir el kit se vio que su lockup iba al 60% y, enfrentados los dos, el 44% dejaba el nombre en pie de foto. El nav no es un lockup: son dos elementos sueltos en una fila que se componen y se descomponen. El del kit sí, en el sentido literal de que las proporciones van bloqueadas dentro de un asset cerrado. La proporción sigue al trabajo, y el trabajo sigue al tamaño.
6. **Transición del nav.** Al hacer scroll, el símbolo escala de forma continua (48→28px) y el wordmark se desvanece **en opacidad manteniendo su ancho completo**: nunca se anima el `max-width`, porque recorta glifos a mitad de letra y se lee como un bug de truncado. El hueco del layout se colapsa después. La opacidad de las capas de color **decae más rápido que la escala: extinguidas antes de que el símbolo baje del umbral del split**, para que la transición no renderice nunca el estado ambiguo donde el split parece un error de registro.
   *Cambiado 2026-09-03 (`DECISIONS.md` D188):* aquí ponía que **símbolo y barra** escalaban, y la barra iba de 80 a 64px. Ya no: animar su `min-height` repinta a cada paso una franja opaca, sticky y de ancho completo, y se midió lo que costaba. Lo que importa para la marca es que la compactación **no se fue con ella**: la cuentan el símbolo y el wordmark, que son las dos piezas que se miran. Se pagan 16px menos de above the fold mientras se scrollea. Las cifras, el reparto y lo descartado, en D188.

7. **`prefers-reduced-motion`:** salto seco entre los dos estados del nav, sin interpolar.

### Dónde respira la marca

El `split` es la firma y solo existe a partir de 48px, así que aparece en **sitios contados** —momentos de marca deliberados—, no en cualquier parte. Hoy son dos, ambos above the fold: (1) el **nav al cargar** la página (al hacer scroll se comprime a `flat` y desaparece hasta que se vuelve arriba), y (2) el **"0" del "404"** en la página de error 404, donde el split "florece" en la carga con una animación CSS (el número *es* la firma; ver `DECISIONS.md` D25). El matiz de la regla no es "una sola vez", sino "solo donde es un gesto consciente": por eso el nav *y* el "0" pueden convivir en el 404 sin que sea repetición.

Se evaluó y **se descartó** duplicarlo en el footer (2026-07-21): un `split` de 64px ahí dejaba el logo flotando con ~246px de vacío a su derecha, desconectaba el copyright y rompía la fila única de baja densidad. Además, si el nav ya abre con la firma, cerrar con ella es repetición, no refuerzo.
