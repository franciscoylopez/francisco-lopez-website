---
name: deep-dive-page
description: >
  Montar la página de deep-dive de una experiencia nueva en /trayectoria/[slug] —
  o rehacer una de las cinco que ya existen. Invócalo cuando Francisco diga cosas
  como "añade el deep-dive de X", "monta la página de la experiencia Y", "quiero
  contar Z por dentro" o "esta experiencia necesita su caso". Recorre la decisión
  de si merece página, el orden contenido→código, los archivos que se tocan, el
  presupuesto de palabras medido, la letra pequeña de artefactos/capturas/vídeo y
  los gates de cierre. No sirve para editar el COPY de una página ya montada: eso
  es una edición normal del diccionario.
---

# Deep-dive de una experiencia — playbook

Extraído **de** las cinco que ya existen (Emendu, KUOTIP, INDYA, Freepik,
TheTool), no antes de escribirlas. Lo que sigue es lo que de verdad se repitió;
lo que parecía plantilla y no lo era está marcado como tal.

---

## 0 · Antes de nada: ¿esta experiencia tiene página?

**No es una decisión de alcance, es de contenido, y se ha equivocado una vez.**
PICKASO parecía candidata —es producto, tiene métricas, tiene años— y no tiene
página: es el primer capítulo de la historia de TheTool, no una historia
separable. Se descubrió **escribiéndola**: al redactar TheTool, PICKASO ya
estaba dentro.

La pregunta, entonces, es: **¿esto se sostiene solo, o es un capítulo de otra?**
Si hay dudas, se escribe el borrador de la vecina primero y se mira si la
absorbe.

Si no tiene página → `slug: null` en `content/experiences.ts` y aquí se acaba.
Sus bullets van al CV y su frase a Trayectoria, nada más. **Sin `deep` en sus
bullets y sin `reporting`**: el guardián comprueba justo esa equivalencia y falla
si sobra.

---

## 1 · El orden: contenido primero, y no es una preferencia

La narrativa la escribe Francisco y es el cuello de botella real. **El código de
esta página son veinte minutos; el texto son horas.** Montar el andamiaje con
copy de relleno produce una página que hay que revisar dos veces.

Orden: decidir si tiene página → escribir el ES → revisar el EN contra el ES
(D20, no traducción literal) → montar.

---

## 2 · Lo que el build YA garantiza — no lo verifiques a mano

Esto es la mitad del valor de esta skill: **lo de esta tabla no hace falta
comprobarlo, porque rompe solo.** Verificarlo a mano es trabajo que no compra
nada. *(Y va sin recuento a propósito: la lista crece, y un número escrito aquí
envejecería mal.)*

| Lo que se te puede olvidar | Qué lo caza | Cuándo |
|---|---|---|
| Registrar el diccionario de un slug nuevo | `Record<ExperienceSlug, …>` en `dictionaries.ts` | typecheck |
| Una clave que está en `es` y no en `en` | `cargador<T>` con el tipo explícito (D11) | typecheck |
| El nombre de empresa mal escrito entre registro, CV y diccionario | `experienceOf` / `matchFact` **lanzan** (D44/D22) | build |
| Un bullet sin su gemelo, cobertura ES≠EN, una cifra que solo existe en una longitud | `npm run check:experiencias` (D57) | CI |
| La página nueva fuera del sitemap, del gate de HTML, de `/llms.txt` o de su tarjeta OG | Las cuatro derivan del registro, y lo que piden por experiencia va en `Record<ExperienceSlug, …>` (D59/D72) | typecheck |
| Que el registro y el disco dejen de decir lo mismo | `npm run check:rutas` contrasta los dos y sus consumidoras (D72) | CI |

Lo que **nada** caza, y por eso ocupa el resto de este documento: el presupuesto,
qué va en cada sección, la política de artefactos y el gate de accesibilidad.

---

## 3 · Los archivos, en orden de dependencia

1. **`content/experiences.ts`** — `{ company, slug, logo, desde, hasta }`. El
   `slug` es neutro al idioma y va en minúsculas. **`desde`/`hasta` son las fechas
   ISO del periodo** y no son opcionales: de ahí salen los `<time>`, y
   `periodPartsOf` rompe el build si su año no aparece en el `period` del copy.
   `hasta: null` es «sigue en curso», no «falta el dato».
2. **`content/experience-copy/es.ts` y `en.ts`** — `role`, `period`, `sector`,
   `reporting: { deep, cv }`, `short` (la frase de Trayectoria) y `bullets`
   (`{ cv, deep }`). **Los `deep` son «En un minuto»**: no se escriben en el
   diccionario de la página (D57).
3. **`app/[lang]/dictionaries/{es,en}/trayectoria/<slug>.json`** — la narrativa.
   Su forma es la interfaz `DeepDiveDict` de `app/[lang]/dictionaries.ts`, que se
   declara explícita **y no con `typeof`** a propósito: son cinco archivos que
   comparten forma, y con `typeof` la fijaría el primero que se escribió (D53).
4. **`app/[lang]/dictionaries.ts`** — una entrada en `experienceDicts`.
5. **`public/logos/companies/<name>-light.png` y `-dark.png`** — monocromo, los
   dos temas.
6. **`app/[lang]/dictionaries/{es,en}/home.json`** — la fila de Trayectoria, que
   lleva **solo `company`**; rol, periodo y descripción salen del registro.
7. **`content/cv/content.{es,en}.ts`** — si le toca papel en el CV. Ahí solo se
   decide *a qué experiencias se le da*: los bullets ya están en el registro.

**Lo que NO hay que tocar, y conviene saberlo para no perder el tiempo
buscándolo:** el índice `/trayectoria`, el paso a la experiencia vecina,
`generateStaticParams`, el sitemap, el gate de HTML, `/llms.txt` y la tarjeta OG
**derivan del registro** y recogen la página nueva solos (D44/D59/D72).

Lo único que dos de esas superficies siguen pidiendo es un dato **por experiencia**
—su fecha en `lib/page-modified.ts` y su diccionario en `app/llms.txt/route.ts`—, y
ninguno se puede olvidar: los dos van en un `Record<ExperienceSlug, …>` que **no
compila** incompleto.

---

## 4 · Las cinco secciones, y qué de esto NO es plantilla

La forma está en `PRD-Historical.md` §42. Aquí solo lo que se aprendió
ejecutándola cinco veces.

**Datos · En un minuto · La historia · El caso (opcional) · Aprendizajes.**

- **Datos** — en el diccionario queda **solo `tamano`**. Rol, periodo, sector y
  reporting suben al registro, porque se pintan también en Trayectoria o en el
  CV, y mientras se escribían aparte KUOTIP terminaba en noviembre en la home y
  en diciembre en su página (D58).
- **La historia** — sus subapartados son **libres** y esto es deliberado: una
  experiencia de tres meses y una de cinco años y medio no pueden llevar los
  mismos epígrafes sin que la corta salga medio vacía. Lo que las homogeneiza es
  el marco y la longitud, **no los títulos**. Entre 3 y 4 bloques en las cinco.
- **El caso** — opcional, «donde hay historia de verdad». Freepik y KUOTIP no lo
  llevan y **esa ausencia es del formato, no un hueco por rellenar**.
- **Aprendizajes** — 3 sin caso, 4 con caso, en las cinco. No estaba escrito en
  ningún sitio: es lo que salió, y sirve de vara.

> **La correlación que sí es plantilla:** el caso trae consigo los resultados y
> el cuarto aprendizaje — se cumple en las cinco. Si estás escribiendo un caso y
> te salen tres aprendizajes, mira si el caso lo es de verdad.

**`cierre` es un corte de CONTENIDO, no de maquetación** (D53). Los párrafos que
salen del grid y corren a ancho de página son los que vienen DESPUÉS de haber
enumerado lo que la imagen ilustra — no «el último párrafo». Sin ese corte, la
captura se centra contra un texto que ya no habla de ella.

---

## 5 · El presupuesto, con su metro

```bash
npx tsx .claude/skills/deep-dive-page/medir.ts
```

Imprime las páginas publicadas con su cuenta de prosa —narrativa +
aprendizajes; **sin** «En un minuto» (es la versión larga de los bullets del CV,
contarla sería contar dos veces lo mismo), **sin** el artefacto (su
`description` es la alternativa textual, y penalizarla sería el incentivo al
revés) y **sin** títulos ni rótulos—.

**Se usa como vara, no como techo.** La pregunta no es «¿cabe en N palabras?»
sino «¿esta página se lee como las de su familia?». Una que se salga del rango
de su grupo se lee como otra cosa, y eso es lo único que hay que juzgar.

> **Cabo abierto, dicho aquí para que no se dé por cerrado:** el presupuesto que
> publica `PRD-Historical.md` §42 —«700-900 palabras, 1.200 con caso»— **no dice
> contra qué se mide**, y con este metro ninguna de las dos familias cae dentro
> de su rango. No es un incumplimiento de las páginas: es un número sin unidad.
> Hasta que se cierre, manda el rango medido.

---

## 6 · Artefacto, captura y vídeo — cuál toca y con qué letra pequeña

**No los lleva una página por tener el hueco.** Hoy: Emendu artefacto, KUOTIP
captura, INDYA y TheTool vídeo, Freepik nada. Decidir que una no lleva **también
cierra el hueco**.

- **Artefacto** (D54). Se **enseña, no se recrea**: es el render REAL, no un
  redibujo con nuestros tokens —eso cumplía la letra de la política e incumplía
  su espíritu—. Uno por página como techo. Va **inline y no como `<img>`**,
  porque una imagen no ve las variables CSS. **No se traduce**: se enseña como se
  entregó, y traducirlo lo convertiría en una recreación; lo que va en los dos
  idiomas es su título, su pie y la prosa alternativa. Sin proveedores ni
  importes. El dibujo vive en `content/artefactos/` y se regenera con
  **`npm run artefacto`**, nunca a mano — que es como se publicó una vez sin
  sanear. Y su `viewBox` es de las pocas cosas de un SVG **que no se pueden
  verificar sin VERLO**.
- **Captura de producto** (D53). Va **AL LADO** del párrafo, no debajo: un
  artefacto se LEE y una captura se RECONOCE. Su `alt` se traduce; el `src`, no.
- **Vídeo de terceros** (D55). Entra solo si es **prueba y no resumen** —un
  vídeo-resumen compite con «En un minuto», que es la pieza diseñada para ese
  trabajo exacto—. Y con sus cuatro piezas, ninguna opcional: **facade** (sin
  iframe en el DOM hasta pulsar), **póster auto-hospedado** en `public/img/`
  (tirar de `i.ytimg.com` haría la petición que el facade evita), `frame-src` a
  `youtube-nocookie` en la CSP, y sección propia en la política de cookies. **El
  clic es el gate de consentimiento**, que es más estricto que gatearlo por
  categoría.

---

## 7 · Los gates de cierre

> **Esto NO sustituye a la Definition of Done** (`CLAUDE.md` §Definition of Done, escrita
> el 2026-08-19): una página nueva pasa su columna A entera. Lo de aquí abajo es lo que la
> DoD **no** puede saber porque es específico del deep-dive — las tres longitudes, el CV y
> los dos disparos del gate por el hero. Si los dos textos discreparan alguna vez, manda la
> DoD y esto se corrige.

1. **`npm run check:experiencias`** — las tres longitudes cuadran.
2. **`npm run check:cv`** — y si falla, `npm run cv`: tocar un bullet o un hecho
   cambia también el PDF, que es un artefacto commiteado y no se regenera solo.
3. **`npm run check:marco`** (D75) — **es el criterio de cierre de página nueva, y
   está en CI**. Sobre el HTML **prerenderizado** de todas las variantes mira axe
   estructural, el **enlace de salto** que axe no ve, un solo `h1` y la jerarquía,
   el breadcrumb, que la metadata derivada **llegó** y que los `@id` del JSON-LD
   **resuelven** — cosa que ningún validador externo hace. Con esto, los puntos 4,
   5 y 8 del checklist dejan de comprobarse a mano.
4. **`npm run check:agentes`** (D159) — también es cierre de página nueva, y se
   olvida porque no habla de la página sino de lo que el sitio PROMETE sobre
   ella: que `llms.txt` la nombre y que exista su markdown. Salen del registro,
   así que lo único que hay que hacer es **`npm run md` tras el build**.
5. **Gate de accesibilidad (D52)** con el subagente `viewport-verifier`, sobre el
   sitio servido. **No se conduce a mano.** Y **son dos disparos**, no uno: si la
   página lleva hero o banda dimensionada por `vw`, uno **mientras se dibuja**
   —al cerrar, el alto ya no es un ajuste sino un rediseño (D50/D56)— y otro al
   cerrar. Precondición: `agent-browser` con el **sandbox de Bash desactivado**;
   un comando que cuelga es ese síntoma, así que no se reintenta igual.
6. **Los tres que necesitan el sitio SERVIDO van juntos**, y su secuencia entera
   —incluida la línea base que hay que guardar antes de tocar nada— la lleva la
   skill `gates-de-servidor`: `gate:html` (solo si has tocado algo COMPARTIDO;
   para una página nueva no hay línea base contra la que compararla, su valor está
   en demostrar que el resto no se ha movido), **`npm run censo`** (D85) y
   **`npm run psi`** (D49). Del censo **no hay que acordarse**: si la página
   introduce un par de color, una superficie o una animación nuevos, CI lo dice
   por su nombre (D90).
7. **Lo que sigue a mano, y es poco:** el punto **6** del checklist —nada
   codificado solo por color—, que no tiene forma automática.

**La apertura ocupa el pliegue** (D56): el bloque de apertura termina siempre a
la misma altura porque es tipográfico, así que lo que sobra crece solo con el
ALTO de la ventana y por ahí asomaba la segunda sección. Lo resuelve
`md:min-h-[calc(100svh-5rem)]` — `min-h` y no `h`, porque en ventana baja no
puede recortar. Y ojo a la trampa que trae: al volver flex el padre, `mx-auto`
pasa a ser margen del eje transversal y **desactiva el `stretch`**, sin un solo
error de compilación.

---

## 8 · El tablero

Antes de tocar código, la tarea a **En progreso**; al cerrar, a **Listo**. Si el
trabajo destapa algo adyacente, **se tarea y se señala** — no se construye de
más.
