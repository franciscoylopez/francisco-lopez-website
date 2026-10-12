# El censo de contraste de una página SERVIDA (P37.68)

**DOS PASES, y conviene saberlo antes de leer nada más:**

1. **Pares de TEXTO sobre fondo** — WCAG 1.4.3 / 1.4.6, con umbral por tamaño y
   con los estados incluidos. Es el pase original y ocupa casi todo el guion.
2. **Contornos de CONTROL** — WCAG 1.4.11, que no es contraste de texto sino
   «¿se reconoce esto como un control?». Añadido el 2026-08-23; su porqué está
   entero junto al código, en `05-contornos.js`.

Esto se llamaba «censo de pares de contraste», y ese nombre es parte de cómo el
pase 2 tardó año y medio en existir: sonaba exhaustivo. Si hubiera dicho «pares
de TEXTO», el hueco habría sido visible el día que se escribió.

## Cómo se usa

Define `window.contrastCensus()`, que se llama sobre la página ya cargada y
devuelve el censo. **No vale `eval()`**: la CSP del sitio no permite
`unsafe-eval`, y eso está bien.

**Se inyecta CONCATENADO y en el orden de los números** — lo compone
`scripts/design-review/guion.ts`, que es de donde lo toman los tres conductores.
Los `const` de cada pieza viven en el ámbito del guion entero, así que inyectarlas
como archivos separados NO funcionaría: un `<script>` por pieza no comparte
ámbito con el siguiente. Para pegarlo a mano en la consola, el equivalente es
`cat scripts/design-review/censo/*.js`.

**PARA EL SITIO ENTERO NO SE CONDUCE A MANO:** `npm run censo` (D85) lo inyecta
en las páginas de `lib/routes.ts` × los dos temas y falla si algún par baja de
AAA. Nació porque la pasada completa era un hábito, y por eso se saltó la
decimotercera página. Esto de aquí es el metro; aquel es el recorrido.

No es código de Node y no puede serlo: la mitad de los pares de este sitio **no
existen hasta que el navegador compone** un `color-mix` sobre la superficie que
tiene debajo, así que solo se ven en el DOM pintado. Se expone como función y no
como IIFE para poder llamarlo dos veces sin recargar — conmutar el tema y volver
a medir es la mitad del trabajo.

## Las piezas, en el orden en que se concatenan

| Pieza | Qué trae |
|---|---|
| `01-motion.js` | Congelar el motion y encender los reveals: sin esto se mide a medio camino |
| `02-color.js` | La aritmética de color — recorte de gamut, composición alfa, luminancia y ratio |
| `03-fondo.js` | Qué hay DEBAJO de un elemento: relleno efectivo, apilado y «¿cae sobre una imagen?» |
| `04-dom.js` | Qué elementos cuentan: pintan texto, su etiqueta, sus reglas `:hover` y su umbral por tamaño |
| `05-contornos.js` | El pase 2 — WCAG 1.4.11 |
| `06-pares.js` | El pase 1 — `window.contrastCensus()` |
| `07-imagen.js` | La plomería de la medición sobre foto: caja de las letras, `fixed` que tapan, ocultar y mostrar |
| `08-pares-imagen.js` | `window.paresSobreImagen()`, la mitad in-page de lo que mide `npm run censo:imagen` |

Era **un archivo de 1.117 líneas** hasta P72.195 *(2026-09-02)*. Se partió por sus
propios pases; lo que garantizó que la partición no cambió nada fue el inventario
sellado de `scripts/censo/inventario.json`, que compara pareja a pareja contra la
corrida anterior.

## Por qué existe

Las auditorías de 2026-08-04 y 2026-08-08 dieron por bueno un «todos los pares en
AAA, sin excepciones» que era falso: se les escaparon tres —la etiqueta neutra
(6,44/5,56), la teñida (6,07/5,46) y el hover del chrome secundario
(6,44/5,56)—. Los tres por la MISMA razón, y no fue descuido: un censo hecho
leyendo `globals.css` no puede encontrar un par que solo aparece al componer un
velo o una pastilla de hover, porque no hay ningún token con ese nombre. Y el
tercero, además, solo existe mientras el cursor está encima.

De ahí las **TRES reglas** que este guion implementa y que son el punto entero:
**el censo se recorre por el DOM**, **incluye los estados** y **cada par se
puntúa contra el umbral que le toca por su tamaño de texto** (P37.6595).

Se escribió tres veces a mano (P37.655, P37.656 y P37.6605) antes de quedarse
aquí. Que el trabajo deje algo detrás es más barato que volver a escribirlo.
