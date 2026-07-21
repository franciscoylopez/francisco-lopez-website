# Kit de logo descargable

Genera los assets que la página **Brand Kit** ofrece en descarga, en
`public/logo-kit/`.

```bash
node scripts/logo-kit/build.js
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

Generar el kit desde `geometry.js`, que replica el componente, es lo que impide
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

**Nombres.** El sufijo de los PNG nombra la **tinta**, no el fondo:
`tintaOscura` va sobre fondos claros y `tintaClara` sobre oscuros. Los SVG usan
`claro`/`oscuro` por el tema al que sirven, que es la convención heredada del
kit original.

**Colores fijos.** Los SVG llevan hex, no tokens CSS, para que sean portables
fuera de la web. La versión con tokens que conmutan es el componente.

## Pendiente de decisión

El lockup tiene el wordmark al **60% de la altura del símbolo**, y la regla 5 de
`BRAND.md` pide 40-45%. Se detectó al reconstruir el kit y **no se ha tocado**:
cambiarlo altera un asset que ya está en uso, y decidir si el lockup suelto
puede ser más protagonista del texto que el lockup del nav es una decisión de
marca, no una corrección técnica.
