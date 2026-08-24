---
name: gates-de-servidor
description: Los tres gates que necesitan el sitio SERVIDO y por eso no están en CI — `gate:html` (el HTML no cambia en un refactor), `npm run censo` (contraste de todas las páginas × dos temas) y `npm run psi` (la nota de PageSpeed). Encapsula la secuencia entera, incluida la línea base que hay que guardar ANTES de tocar nada. Invócalo antes de empezar un refactor que se diga transparente, al cerrar un cambio que toque colores o superficies, o cuando Francisco diga «pasa los gates», «guarda la línea base» o «mide esto servido». Solo corre cuando se le invoca: levanta un servidor y escribe archivos.
disable-model-invocation: true
---

# Los tres gates que necesitan un servidor delante

> **Por qué esto es una skill y no un hook.** P47.4 ató a un evento de editor los dos gates
> que se podían atar. Estos tres no: necesitan el sitio **servido**, y el primero necesita
> además una **línea base guardada ANTES del refactor**. No existe evento que signifique «voy
> a empezar a refactorizar», así que el disparador tiene que ser un momento, y el momento lo
> decide una persona (D51). Lo que no se puede atar a un evento, al menos se ata a **un**
> comando en vez de a siete.

> **Tiene efectos: levanta un servidor y escribe archivos** (la línea base del HTML y el sello
> del censo). Por eso solo corre invocada.

## Las dos cosas que hay que saber antes de nada

1. **La línea base y la comprobación tienen que salir del MISMO modo.** `next dev` y
   `next start` emiten HTML distinto, así que una base guardada en dev y comparada en prod da
   un diff que no significa nada. Si vas a mirar el resultado en producción, guarda en
   producción.
2. **`gate:html` no es un veredicto, es media respuesta.** Diff vacío = el refactor fue
   transparente **por construcción**, y ahí termina el trabajo. Diff no vacío **no** significa
   que esté mal: significa que hay que abrir la página y mirar si el cambio era el que
   buscabas. El gate no tiene criterio propio a propósito, y esa es su fuerza.
3. **Y NO VE LO QUE NO SE SIRVE** *(2026-08-24, P68.57)*. Una isla que solo se pinta en cliente
   —el riel de secciones del artículo devuelve `null` hasta que su observer confirma una
   sección— **nunca está en el HTML servido**, así que un diff vacío no dice absolutamente nada
   sobre ella. No es un fallo del gate: es su alcance. Si lo que tocaste vive solo en cliente,
   el gate no es la comprobación — hay que medirlo en el navegador.

4. **UN SERVIDOR VIEJO EN EL PUERTO CONVIERTE ESTE GATE EN UN VERDE FALSO** *(2026-08-24,
   P68.59)*. Si el 3000 ya está ocupado, `npm start` muere con `EADDRINUSE` **en silencio**,
   el servidor de antes sigue respondiendo 200, y el gate compara ese build consigo mismo. No
   es que la cifra salga parecida: es que imprime *«Sin cambios en el HTML de las 28 variantes.
   El refactor es transparente»* sobre un cambio que reescribía siete diagramas. Lo destapó que
   el resultado fuera **imposible**, no el gate. Y `pkill` no lo mata en Windows.

## Paso 1 · Levanta el sitio

```bash
npm run build
npm start            # en otra terminal; queda en :3000
```

**Antes de seguir, dos comprobaciones de dos segundos**, que son las que cierran el punto 4:

```bash
grep -c EADDRINUSE <log-de-npm-start>   # si sale ≥1, lo que responde NO es tu build
```

```powershell
# Y si hay que matarlo, por puerto y en PowerShell — `pkill` no sirve aquí:
Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue |
  Select-Object -ExpandProperty OwningProcess -Unique |
  ForEach-Object { Stop-Process -Id $_ -Force }
```

Cuando el gate compara **dos builds** (guardar la base en una rama y comparar en otra), añade
la comprobación que de verdad lo prueba: **busca en cada lado una marca que solo exista ahí**
—una clase, una frase— y confirma que aparece donde toca. Es «valida el metro contra un caso
ya publicado» (`BRAND.md` §Cómo medir, 1) aplicado al servidor.

Si el 3000 está ocupado por otra cosa, usa otro puerto y pásalo a los tres:
`npx next start -p 3100` y `BASE_URL=http://localhost:3100` delante de cada comando.

## Paso 2 · La línea base, ANTES de tocar nada

Solo si lo que viene es un **refactor que se dice transparente** (mover markup, partir un
archivo, extraer un helper). Si el cambio quiere cambiar la página, sáltate el gate: no aplica.

```bash
npm run gate:html -- save
```

Guarda el HTML servido de **todas las variantes** (las páginas del registro × dos idiomas, derivadas de
`lib/routes.ts`, no escritas a mano). Si esto no se hace antes, ya no se puede hacer: no hay
forma de reconstruir el «antes».

## Paso 3 · Haz el trabajo

Y vuelve aquí.

## Paso 4 · Los tres gates

```bash
npm run gate:html    # ¿cambió el HTML? Ver arriba: vacío = cerrado
npm run censo        # contraste de todas las páginas × 2 temas, con el sitio servido
npm run psi -- --registro   # la nota de PageSpeed — CONTRA PRODUCCIÓN, no contra local
```

- **`gate:html`** compara contra la base del paso 2. Si sale diff y el cambio era intencionado,
  vuelve a guardar la base y sigue; si no lo era, abre la página.
- **`censo`** falla si aparece **un solo par por debajo de AAA** o **un solo contorno de
  control por debajo del 3:1** de WCAG 1.4.11 (D97), y valida su propio metro en
  cada corrida (los anclajes sin cian, 13,79 y 15,32, que tienen que salir exactos). Al pasar
  en verde **sella** lo que había —tokens de color, superficies y animaciones—, y ese sello es
  lo que `check:palette` compara en cada PR (D90). Lo que **no** juzga es el texto sobre foto:
  esos pares salen listados aparte y se miden sobre el píxel pintado.
- **`psi`** no se mide en local y no es un gate de CI: su variabilidad daría rojos falsos.

## Paso 5 · Lo que deja detrás

- Si el censo pasó y **esta era la pasada buena**, actualiza `LAST_A11Y_REVIEW` en
  `lib/design-values.ts` — es la fecha que publica `/accesibilidad`. El **recuento de páginas**
  no se toca: sale de `PAGE_COUNT`.
- El sello del censo (`scripts/censo/censo.huella`) **se commitea**: es lo que hace que un
  token o una superficie nuevos salgan en rojo en el PR siguiente.
- La línea base de `gate:html` **no**: es un archivo de trabajo de un refactor concreto.

## Lo que esta skill NO cubre

El pliegue, el objetivo táctil y el orden de lectura, que son de `viewport-verifier` y
necesitan viewports (D52). Y la expresión de marca, que es `design-review`.
