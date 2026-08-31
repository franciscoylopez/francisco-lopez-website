# GATES — el contrato de lo que no ve un compilador

> **Vive solo en el repo, y se consulta A DEMANDA: nunca se `@`-importa.** Aquí está el
> CONTRATO de cada gate —qué garantiza, qué deja fuera y dónde corre—; el **porqué** lo lleva
> su entrada de `DECISIONS.md`, por el índice de su cabecera (D88).
>
> **Cuándo se abre: cuando un check sale rojo diciendo su nombre**, o cuando hay que decidir si
> un gate nuevo hace falta. No hace falta para *aplicar* ninguna regla — eso lo llevan
> `CLAUDE.md` y `BRAND.md`, que sí están siempre en contexto. Esa asimetría es justo la razón
> de que esta tabla dejara de precargarse: era la sección más pesada del arranque (992 palabras,
> el 8 % del presupuesto) y el propio `PRD-Live` la describía como algo que *«no se lee hasta
> que un check sale rojo»*. El porqué fechado, en `DECISIONS.md` D163.
>
> **La tabla no se lee entera: se busca la fila.** Una fila por gate, ordenada por nada en
> particular; el `grep` es por el nombre del comando.

## Cómo se verifica lo que no ve un compilador

| Gate | Qué garantiza, y qué deja fuera | Dónde | Porqué |
|---|---|---|---|
| **Gate de accesibilidad** | `agent-browser` conducido por el subagente `viewport-verifier`: viewports × temas + `reduced-motion`. Se dispara **dos veces**, y la primera mientras se dibuja | a mano | D50/D52 |
| **Pasada con NVDA** | Lo que **no incumple ninguna regla** y por tanto ningún motor automático puede señalar. Sobre el sitio entero, no por página; lo que encuentra se publica en `/accesibilidad` | a mano | D73 |
| `check:marco` | El criterio de cierre de página nueva, sobre el HTML **prerenderizado** de las 28 variantes: axe estructural, enlace de salto, un `h1` que ABRE el documento y jerarquía, breadcrumb, que la metadata derivada llegó, que el `?card=` de cada variante resuelve a su propia tarjeta, que los `@id` del JSON-LD resuelven **dos veces** —contra el sitio entero y dentro de cada página (D87)—, y que la metadata y el marcado dicen lo mismo del mismo contenido: `og:type=article` ⇔ un solo `<article>`, en los dos sentidos. **Fuera:** contraste y objetivo táctil, que se heredan y necesitan pintar | CI | D75/D87 |
| `md:verificar` | Que el markdown commiteado de las 28 variantes siga siendo el que emite la página, reconvirtiendo el prerender, **y en los dos sentidos**: un `.md` que no corresponda a ninguna variante sobra, y la negociación lo seguiría sirviendo. **Fuera:** que el markdown sea bonito | CI | D158 |
| `check:agentes` | Lo que el sitio le **promete** a un agente, comprobado **donde ocurre**: `llms.txt` y el markdown de las 28, en el artefacto; la negociación, el `Vary` y el 404 con salida, ejecutando `proxy()`; `robots()` en sus **dos** entornos, porque el que se construye en CI es el de no producción; y las **cabeceras** y los **alias**, probando rutas de ejemplo contra la regex ya compilada de `routes-manifest.json`, que es la que el servidor usa de verdad — `Vary: Accept` solo donde se negocia, seguridad en todas, y las once rutas que un agente adivina con su 307 a un destino que existe; y el **catálogo ARD**, otra vez sobre el artefacto: el modelo de entrada del conformance (URN anclado al dominio, nombre, tipo de medio, exactamente uno de `url` o `data`, y de 2 a 5 `representativeQueries`), que cada `url` que anuncia **resuelva contra el disco**, y que sus **dos rutas** —`ard.json` y `ai-catalog.json`— sirvan el mismo cuerpo byte a byte. El `rel="ard"` de las 28 páginas lo mira `check:marco`, que es quien tiene el HTML. **Fuera:** la nota de ningún escáner, lo primero y a propósito, y el estado HTTP del 404 en HTML, que se mira por estructura (ningún catch-all) y no pidiendo la URL, y el tipo de medio que el servidor devuelve de verdad para cada entrada del catálogo, que necesita una petición | CI | D159, D165 |
| `check:figuras` | El rótulo **pintado** de toda figura con lienzo escalado, sobre el prerender: dentro de un `viewBox` el `font-size` computado no dice el tamaño real. **Fuera:** por debajo de 360, que es suelo del rótulo y no del sitio | CI | D114/D124 |
| `check:marcas` | Que los nombres propios lleguen al HTML con `translate="no"`, recorriendo los nodos de TEXTO de las 28 variantes. **Fuera:** el `<head>`, los atributos y el interior de un `<svg>` | CI | D116 |
| `npm test` | La lógica que no necesita navegador, y **cuáles son lo dice `tests/`**: enumerarlas aquí ya caducó una vez. Hoy, el formulario (medido sobre lo que nodemailer **emite**), las reglas del tablero, el criterio de `check:enlaces` y la geometría del `sizes` del artículo. **Fuera:** todo lo que necesite pintar | CI | D101/D107/D141 |
| `gate:html` | El HTML servido de las 28 variantes antes y después de un refactor: diff vacío = transparente por construcción | a mano | D42/D45 |
| `check:articulo` | Que ninguna sección del artículo dependa de una fuente que se movió, **nombrando la sección** en el PR que la mueve; `articulo:novedades` dice qué líneas. Sella aparte el copy, contra `ARTICLE_UPDATED`, que es el `dateModified` que ve Google | CI | D84/D103/D110 |
| `check:accesibilidad` | Lo mismo para `/accesibilidad`: sus cinco bloques con fuente declarada, y que las dos cifras del arnés que publica cuadren con los casos que hay. **Fuera:** lo que es MEDICIÓN y no archivo (los pares sobre foto, el desbordamiento bajo 320) | CI | D140 |
| `check:og` | Que las 8 tarjetas OG digan lo que su página, en los dos idiomas, salvo lo declarado distinto **con su motivo** — y que lo declarado siga siéndolo. **Fuera:** el dibujo | CI | D142 |
| `censo` | **Dos pases** sobre las páginas del registro × dos temas: los pares de TEXTO (1.4.3/1.4.6) y el **contorno de cada control** (1.4.11, 3:1), que axe no implementa. Enciende los reveals antes de medir, porque lo que no ha entrado está a `opacity: 0`. Deja sello, y `check:palette` lo compara en cada PR | a mano | D85/D97/D90/D146 |
| `check:enlaces` | Que las URLs externas del sitio sigan respondiendo, sacadas del disco y no de una lista. **Fuera de su juicio:** el 403 y el 999, escudo antibot y no enlace muerto | a mano | D141 |
| `pliegue` | Que las aperturas que comparten pliegue midan lo mismo —grupo y `h1`— a 1920×1080; entra la que lo tenga, detectado en el DOM. **Fuera:** que no desborde, que es `viewport-verifier` | a mano | D144 |
| `psi -- --registro` | La nota de PageSpeed de las páginas del registro contra producción, como **mediana de tres tomas** deduplicadas por análisis: con una sola muestra el min/max sellaba ruido. **No sella** un par que se quedó en un análisis. **Nunca gate de CI:** su variabilidad daría rojos falsos | a mano | D49/D99/D145 |
| `check:kit` | Que `lib/logo-kit.ts` y `public/logo-kit/` cuadren **en los dos sentidos**, y que los 43 binarios tengan el formato, la medida y la tinta que promete su nombre. **Fuera:** el ZIP, que se hace en el build, y que el DIBUJO sea el correcto | CI | D119 |
| `check:tablero` | Que `Prioridad` siga siendo un orden —números únicos, estados de ejecución dentro del sprint, `Área` en todas—, sobre un volcado del tablero, y que el embalse transversal no crezca contra el sello del cierre anterior. **Fuera:** si el CUPO se cumplió, que el esquema del tablero no permite ver | a mano | D107/D138 |
| `agentes:sellar` | La nota de preparación agéntica de `ora.ai` contra producción, para que el artículo la publique en vez de teclearla. **Se niega a sellar un informe de CACHÉ** (`servedFromCache`), incompleto o de otro destino: sin `force` el POST devuelve el guardado con pinta de pasada nueva. **Nunca gate de CI:** la nota es de un tercero y D157 dice que no es criterio de aceptación de este proyecto | a mano | D157/D166/D167 |
