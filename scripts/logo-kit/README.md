# Kit de logo descargable

Genera los assets que la página **Brand Kit** ofrece en descarga, en
`public/logo-kit/`.

```bash
npm run kit:logo
```

Salida: 12 SVG, 36 PNG transparentes y 7 favicons (6 PNG + `favicon.ico`).

## Por qué existe este script

El kit original (`francisco-lopez-logo-kit/`) se dibujó a mano, aparte del
componente `components/ui/logo.tsx`. Los dos derivaron, y al auditarlo el
2026-07-21 aparecieron tres fallos que solo se explican por eso:

- Todos los SVG llevaban `viewBox="0 0 120 120"` cuando el símbolo solo ocupa
  `31 17 58 70` — el 58% del alto. Quien pusiera `height: 40px` obtenía un
  símbolo de 23px. Es el mismo error que el componente arrastró hasta ese día.
- El favicon de 16px era el de 32px reescalado, sin compensar el trazo. Medido:
  8,2% de cobertura de tinta a 16px frente a 8,1% a 32px, idénticos. A ese
  tamaño el trazo cae a ~1,4px y el antialiasing lo lava a gris.
- El `LEEME.md` documentaba reglas anteriores a la tabla de uso del logo.

Generar el kit desde `geometry.mjs`, que replica el componente, es lo que impide
que vuelva a pasar. **Si cambia la geometría del logo, se cambia en los dos
sitios y se reconstruye el kit.**

## Convenciones

**Recorte.** Todos los SVG van recortados exactamente a la tinta: la caja no
miente sobre el tamaño. El split es 6 unidades más ancho y 2 más alto que el
plano porque las capas de color sobresalen del círculo principal, así que a
igual `height` el split se ve un 3% mayor. Es correcto: ese es su tamaño real.

**Dimensionado de los PNG.** El símbolo se dimensiona por **altura**
(`simbolo-…-512.png` mide 512px de alto), que es la medida con la que `BRAND.md`
expresa todas sus reglas. El lockup por **ancho**, su dimensión natural: a 512px
de alto mediría 3400 de ancho.

**Favicons.** Única excepción al recorte: van en lienzo cuadrado —lo exige el
formato— con el símbolo centrado al 87,5% del alto. El de 16px lleva el trazo
engordado de 6 a 10 unidades; a partir de 32px no hace falta.

**Nombres.** Todo el kit nombra la **tinta**, no el fondo: `tintaOscura` va
sobre fondos claros y `tintaClara` sobre oscuros. Los SVG llevaban hasta el
2026-08-28 la convención heredada del kit original (`claro`/`oscuro`, por el tema
al que sirven), que era la OPUESTA a la de los PNG de la misma pieza: se unificó
en P50.96, y con eso desapareció el campo `png` de `VARIANTS` y la mitad de la
sección de nombres del `LEEME.txt` del ZIP. Los favicon son la excepción y se
quedan en `claro`/`oscuro`: ahí el sufijo no es un fondo sino el
`prefers-color-scheme` con el que el navegador los elige.

**Colores fijos.** Los SVG llevan hex, no tokens CSS, para que sean portables
fuera de la web. La versión con tokens que conmutan es el componente.

## El lockup va al 60%, y es correcto

El wordmark del lockup mide el **60% de la altura del símbolo**. La primera
redacción de la regla 5 de `BRAND.md` pedía 40-45% para todo, y al reconstruir
el kit pareció una incoherencia. No lo era: **la regla estaba
sobregeneralizada**, no el asset.

Enfrentados los dos a 80px de alto, el 44% deja el nombre en pie de foto. El nav
no es un lockup —son dos elementos sueltos en una fila, que además se
descomponen al hacer scroll— mientras que este sí lo es, con las proporciones
bloqueadas dentro de un asset cerrado que se usa a 200px o más y donde leer el
nombre es el objetivo.

Regla 5 matizada en consecuencia (2026-07-21): 40-45% compuestos en UI, ~60%
lockup cerrado.

## Reproducibilidad: los SVG sí, los binarios no

*(Medido el 2026-08-28 al cerrar P50.96, escrito el 2026-08-30.)* Regenerar el kit
entero sobre la caja de hoy da esto:

| | resultado |
|---|---|
| 12 SVG | **idénticos byte a byte** |
| 43 binarios (42 PNG + `favicon.ico`) | **15 distintos** de los que hay en `main` |

Y no es un fallo: los SVG salen de `geometry.mjs` como texto, así que son
deterministas por construcción; los binarios los rasteriza **sharp**, y ahí el
byte depende de la versión nativa de libvips y libpng que npm haya resuelto en la
máquina que lo corrió, no del código del repo.

**La consecuencia, que es lo que hay que saber al volver:** los PNG y el `.ico` de
`public/logo-kit/` son **artefactos versionados**, no la salida reproducible de un
comando. Este script es la **receta**, no el contrato. Quien clone el repo y lo
ejecute obtendrá un diff en unos cuantos binarios sin haber cambiado nada, y **ese
diff no se commitea**: se revierte, como se hizo en el PR #203.

Se descartó pinnear `sharp` a versión exacta. Reduciría la deriva y no la
eliminaría —el binario nativo varía por plataforma—, así que compra una sensación
de cierre que no es verdad.

**Lo que sí se hizo, porque es el fallo que duele:** `npm run check:kit` ya no
cuadra solo nombres. Abre los 43 binarios y comprueba que cada uno es del formato
que dice su extensión, que mide lo que su nombre promete y que **tiene tinta**. Un
PNG en blanco es un archivo perfectamente válido, se ve perfectamente bien desde la
página, y se descarga roto. Lo que el check **no** promete es que el dibujo sea el
correcto: para eso habría que rasterizar el SVG dentro del guardián, y eso vuelve a
meter ahí la misma cadena nativa que esta sección acaba de declarar no determinista.
