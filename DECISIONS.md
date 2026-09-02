# DECISIONS — Registro de decisiones técnicas (V1 build)

> **Vive solo en el repo.** Es la fuente de verdad de las decisiones técnicas.
> *(Ningún documento tiene ya espejo en Notion: el de DECISIONS y el del PRD histórico se
> retiraron el 2026-07-30, y el de `PRD-Live.md` el 2026-08-19. En Notion vive el tablero
> de tareas y nada más.)*
>
> Alcance: decisiones **técnicas/de implementación** de la fase de desarrollo. El
> **estado** de producto/diseño/alcance vive en `PRD-Live.md` y su **registro histórico**
> en `PRD-Historical.md`. Las **convenciones**
> que aplican en adelante están en `CLAUDE.md`. El "por qué" de cada trozo de código
> vive en los mensajes de commit/PR; el progreso por tarea, en Notion.
>
> Formato ADR-lite: cada entrada es Decisión + Contexto/porqué + fecha. Estado por
> defecto: **Aceptada**.
>
> **Nada se borra nunca, y el estado va EN LA CABECERA.** Lo primero, porque el valor de
> este archivo es el experimento fallido: casi todas las reglas del proyecto nacieron
> corrigiendo algo, y saber qué se probó y por qué se descartó es lo que ahorra repetirlo.
> Lo segundo, porque desde el 2026-08-19 el índice de aquí abajo **se deriva de estas
> cabeceras** (`npm run indices`): una marca escrita en el cuerpo no la ve nadie hasta
> haber abierto la entrada, que es justo lo que la marca existe para evitar. Le pasaba a
> D30, marcada desde el 2026-08-09 y sin que se notara.
>
> Tres palabras, y significan cosas distintas:
>
> | Marca | Qué dice | Ejemplo |
> |---|---|---|
> | **(superado …)** | Ya no aplica. No la sigas | D1 |
> | **(generalizada por Dxx)** | Sigue siendo cierta; lo que cambia es **quién la aplica** | D30 |
> | **(revertida por Dxx)** | Se probó, se deshizo, y la que la deshace explica por qué | — |
>
> La distinción entre las dos primeras no es cosmética: D30 sigue vigente y marcarla como
> superada haría que se saltara una regla que se cumple todos los días.

---

<!-- ÍNDICE · lo genera `npm run indices`; no se edita a mano -->
- D1 (superado en V2+) · El diseño se traduce, no se copia
- D2 · i18n nativo con `app/[lang]`, ES sin prefijo + `/en`
- D3 · Next 16 usa `proxy.ts`, no `middleware.ts`
- D4 · Fuente única de tokens = `app/globals.css`; `brand-globals.css` deprecado
- D5 · Dark mode = `system` por defecto + toggle
- D6 · Plataforma primero, shadcn donde la plataforma no llega; `@base-ui/react` fuera hasta el primer componente
- D7 · Responsive en CSS, no en JS; Server Components por defecto
- D8 · Objetivos no funcionales: PageSpeed >90, desktop+mobile, AA→AAA
- D9 · Alcance de V1 = home + Brand Kit + Design System + SEO/OG + medición + dominio
- D10 · Política de documentación de la fase de desarrollo
- D11 · Andamiaje de calidad del build
- D12 · Branching y releases
- D13 · Entornos y staging = Vercel Previews
- D14 · Imágenes OG generadas con ImageResponse bajo `/api/og`
- D15 · SITE_URL estable en producción (`VERCEL_PROJECT_PRODUCTION_URL`)
- D16 · V1 en producción
- D17 · Analítica cargada con `next/script`, gateada a producción, consent-ready
- D18 · Página de política de cookies como documento vivo
- D19 · Optimización post-lanzamiento: analítica diferida + SEO afinado
- D20 · Revisión de copy ES↔EN: el diccionario ES es la fuente de verdad, el EN no es literal
- D21 · Enlaces entre páginas hermanas con componente compartido
- D22 · CV en PDF generado desde el diccionario (react-pdf, ATS)
- D23 · Copy con énfasis inline en el diccionario vía render de markup ligero
- D24 · Página de Accesibilidad: declaración pública verificada, no autoevaluación
- D25 · Páginas 404/error de marca con `global-not-found` + `global-error` (root layout dinámico)
- D26 · Cabeceras de seguridad Fase 1; CSP «A+ barato» (Fase 2) implementada, estricta diferida
- D27 · Higiene de dependencias: sharp override, shadcn a devDeps, Dependabot
- D28 · Arquitectura de contexto: reglas `@`-importadas vs referencia a demanda
- D29 · Superficie de contacto unificada: dato, patrón y jerarquía
- D30 (generalizada por D39) · Texto atenuado sobre fondos que no son `--background`
- D31 · Tracking de clics mailto/tel vía dataLayer (P30)
- D32 · CSP con allowlist para Microsoft Clarity; `c.bing.com` fuera a propósito (P37)
- D33 · `/llms.txt` — un solo archivo, en español, generado desde el diccionario (P37.5)
- D34 · Clases de componente en `globals.css` van sin `@layer` en este proyecto (Tailwind v4)
- D35 · Los dos extremos de una `transition` van en la misma regla que la declara
- D36 · Capa de componentes: variantes de acción y primitivas de layout
- D37 · Endurecimiento del workflow de CI, y qué audita de verdad este repo
- D38 · Fuente única de los valores publicados: `lib/design-values.ts`
- D39 · El atenuado lo resuelve la superficie, no el punto de uso
- D40 · Capa de tabla: `components/ui/table.tsx`
- D41 · Un color fijo no puede servir a dos superficies opuestas: `--brand-purple-accent` conmuta
- D42 · Los showcase se parten por sección, y el gate del refactor es un diff de HTML
- D43 · Toda página y toda sección abren igual: el ordinal va dentro del eyebrow
- D44 · Lo que de una experiencia no es copy vive en `content/`, y la unión es por nombre
- D45 · El andamiaje de página sale de un helper, no de seis copias
- D46 · El enlace de salto, y el `<main>` sube al shell
- D47 · Lo que ya está en pantalla no se anima: el LCP no lo paga el reveal
- D48 · El diccionario se parte por página, conservando el guardián de tipos
- D49 · El número de rendimiento se mide desde la terminal, y a demanda
- D50 · Una banda dimensionada por `vw` no cabe necesariamente sobre el pliegue
- D51 · Una herramienta externa entra por el trabajo que resuelve, no por lo buena que sea
- D52 · El gate de accesibilidad deja de dispararse una sola vez, y el eje que le faltaba era el alto
- D53 · La plantilla del deep-dive: una forma para cinco páginas, y el tipo como guardián
- D54 · Un artefacto se enseña, no se recrea: el diagrama real, saneado y en línea
- D55 · Un vídeo de terceros entra con facade, y el clic es el gate
- D56 · La apertura ocupa el pliegue, y `mx-auto` deja de significar lo que significaba
- D57 · Las tres longitudes de una experiencia son un solo dato
- D58 · El deep-dive es la fuente de los hechos de una experiencia
- D59 (completado por D72) · El SEO del deep-dive, y las tres listas de páginas escritas a mano
- D60 · Una fuente única evita dos verdades; no mantiene al día una copia impresa
- D61 · Una superficie también cambia por ESTADO, y el atenuado no se enteraba
- D62 · El 404 de una ruta que CASA no lo cubre `global-not-found`
- D63 · La raya no era un reemplazo, eran tres familias — y su guardián
- D64 · Una apertura homogénea no la decide el anclaje: la deciden los altos — **ampliada 2026-08-26 (P70.29, P70.35): la invariante sube a la capa**
- D65 · Un vídeo de apertura no es una foto que se mueve
- D66 · Un asset tiene más consumidores de los que se ven
- D67 · El ruido conocido de los validadores se documenta por MECANISMO, no por cifra
- D68 · El repositorio es público, y a `main` la protege el servidor y no la disciplina
- D69 · El régimen de contexto de D28 gana cifra y guardián, y aparece la operación que faltaba: retirar
- D70 · La capa que verifica no estaba verificada, y su modo de fallo es una luz verde
- D71 · «No hay datos» no distingue entre cero filas y mal configurado
- D72 · Una sola fuente de qué páginas tiene el sitio, y olvidarlas no compila
- D73 · Un lector de pantalla encuentra lo que ningún escáner puede, y un escáner encuentra lo que no existe
- D74 · Un compromiso no caduca y una medición sí: fuera de su fuente se publica el umbral
- D75 · Lo que verifica una página no es su código, es el HTML que emite
- D76 · Una capa nueva para texto largo, y el control que le faltaba al chrome sobre banda invertida
- D77 · Un bug que ya estaba comentado tres veces, y el diagrama pasa a vivir donde vive la cita
- D78 · El dato en vivo se vuelve un bloque más, y el pie deja de tener dos estilos
- D79 · Un prototipo: una dirección ganó
- D80 · Un flotado sin `mt` se alinea con su texto, y el marco se ajusta al contenido
- D81 · Foto en la apertura, evidencia citada en vivo, y una prueba descartada
- D82 · El design-review de P60 encuentra ocho fallos reales, y dos patrones que se repiten
- D83 · Una sección que documenta una capa nueva no puede ser una caja con las piezas dentro
- D84 · El artículo describe un proyecto que se mueve, y nadie le avisaba
- D85 · La pasada de contraste deja de hacerse a mano, y el medidor tenía un falso positivo
- D86 · El informe de qlty baja al repo, y de sus hallazgos dos eran míos
- D87 · Google no cruza de página, y por eso una referencia `@id` no basta en un tipo elegible
- D88 · El único índice que se precargaba baja a su cabecera, y era el único que crecía solo
- D89 · El inventario de `components/ui/` se deriva del disco, y una pieza nueva sin publicar sale en rojo
- D90 · Lo que el censo midió se sella, y CI puede ponerse en rojo sin abrir un navegador
- D91 · Un backlog transversal no lo drena ningún sprint, y el carril de contenido se barría con el resto
- D92 · Quién cierra los PR de Dependabot, y por qué la allowlist no son «las de desarrollo»
- D93 · El sitio scrolleaba en horizontal por debajo de 349px, y el culpable no era el que decía la tarea
- D94 · El wordmark del logo escalaba con nada, y el arreglo elegante colapsaba la caja
- D95 · El formulario de contacto sale por el SMTP de la propia cuenta, y por eso la CSP no se tocó
- D96 · El disparador de la CSP estricta no se cumplió, y conviene decirlo en vez de dejarlo caducar
- D97 · El contorno de un control no es el filete de una caja, y hasta hoy no lo medía nadie
- D98 · Tres instrumentos sanos midiendo la mitad de su objeto, y el filtro barato que iba después del caro
- D99 · La auditoría de rendimiento recorre el registro, y un ahorro estimado no es un ahorro
- D100 · `space-y` de Tailwind v4 va dentro de `:where()`, así que cualquier hijo con `m-0` lo anula
- D101 · El arnés de tests entra cuando aparece la lógica, y se mide sobre lo que el código EMITE
- D102 · «Dato en vivo» era una promesa, no un mecanismo: la cifra se deriva o se sella, nunca se teclea
- D103 · El ruido de `check:articulo` no eran los falsos positivos, era tener que ir a leer
- D104 · El censo mide dónde está pintada la caja, no quién recibe el clic — y la pasada se desplaza antes de medir
- D105 · El presupuesto de contexto vigila también las skills, y con techo POR ENTRADA
- D106 · El umbral de una figura es su propio lienzo, y quien lo vigila lee el prerender, no el navegador
- D107 · El tablero tiene guardián, y la E/S fuera de CI no deja al criterio sin red
- D108 · El desglose por fases del LCP no es una propiedad de la página: es una muestra
- D109 · La lista de excepciones deja de escribirse de memoria: la marca va en el punto de uso
- D110 · La fecha que ve Google se escribe a mano, y lo que la sostiene es un sello aparte
- D111 · Lo que el lector de pantalla cambió en el marco de toda página
- D112 · Un guardián que hashea una carpeta se estrecha en silencio cuando un archivo se va
- D113 · La premisa de una capa caduca cuando aparece el segundo consumidor
- D114 · El lienzo de un diagrama es la única cifra que declara, y la capa deriva el resto
- D115 · El suelo de ancho del sitio es 320, y 280 queda fuera con su motivo escrito
- D116 · Los nombres propios no se marcan en el copy: los marca la capa que lo pinta
- D117 · Un vocabulario de dos valores no puede distinguir la deuda del criterio
- D118 · El `srcset` de `next/image` no baja de `deviceSizes[0]` cuando el `sizes` lleva un `vw`
- D119 · Una descarga que conmuta con el tema está adivinando, y la mitad de sus anclas no existe
- D120 · El primer `popover` del repositorio, y la etiqueta que no es un widget
- D121 · El índice de una página con paradas deja de ser «de artículo», y dos excepciones cumplen su condición de salida
- D122 · El ordinal de una sección deja de escribirse: lo pone el orden de la página
- D123 · El riel va donde la página se LEE; el índice y el cierre, donde se consulta
- D124 · El suelo de 360 deja de ser el comentario de un script y pasa a ser una decisión de producto
- D125 · Una banda no se tiñe sobre una sección que ya existe: se inserta
- D126 · El pliegue es un problema de ALTO, y su andamiaje solo razonaba por ancho
- D127 · El atenuado de un texto no se escribe con `opacity`, y el censo no sabía verlo
- D128 · El contrato de un gate se publica; su porqué se consulta
- D129 · El presupuesto gana su tercera mitad: techo a la SUMA de las skills
- D130 · El porqué de las convenciones se parte, y el arranque cabe en el objetivo sin mudanza
- D131 · El filete era el tercero de la familia y el único sin tratamiento por superficie
- D132 · El equilibrado de línea y el destello del toque bajan a la capa
- D133 · El filete de la banda invertida es uno solo, y el ordinal no toma color
- D134 · El nodo WebSite existe, y con él el isPartOf que el código esperaba
- D135 · El listón de una entrada baja a la capa, y la demo que lo publicaba deja de tener cifras propias
- D136 · `prefers-reduced-motion` retira lo que desplaza, no lo que se funde
- D137 · El gesto de marca son dos piezas, y una manda sobre la otra
- D138 · El cupo de `General` no se puede comprobar, y lo que sí se mide es el embalse
- D139 · Un trinquete cuyo trinquete se mueve es un termómetro que se repinta
- D140 · La página de accesibilidad tiene el guardián del artículo, y el aparato sale a un sitio compartido
- D141 · El 404 de un enlace saliente lo sirve un tercero, así que no sale en ningún gate
- D142 · La tarjeta OG repetía el copy de la página y nadie las comparaba
- D143 · Un PR dice ahora qué secciones publicadas toca, y distingue el copy de la dependencia
- D144 · La invariante del pliegue se rompió tres veces y siempre la vio un ojo
- D145 · Los dos gates de servidor mentían de la misma forma: uno callando y el otro con una sola muestra
- D146 · Lo que aún no ha entrado está a `opacity: 0`, y axe no lo mira
- D147 · El andamiaje es el 30% del código y no lo lintaba nadie
- D148 · Tres scripts por encima del umbral de complejidad, y lo que de verdad lo baja
- D149 · El guardián de contadores en prosa se DESCARTA, y el ruido está medido
- D150 · El `preconnect` a GTM se DESCARTA, y quien lo dice es Lighthouse
- D151 · ESLint 10 lo bloquea upstream, y por el camino apareció un override caducado
- D152 · TypeScript 7 ya pasa, y quien lo bloquea es el mismo tipo de peer que a ESLint
- D153 · Lo que decide una métrica no vive dentro de un efecto
- D154 · El suelo de la densidad tiene dos palancas, y la que faltaba es teñir sin gastar bloque
- D155 · Una señal fija que no distingue es decoración con forma de aviso
- D156 · La invariante del pliegue pasa a sostenerse por construcción, y el corte está escrito
- D157 · La nota de un escáner agéntico no es un criterio de aceptación, y su hallazgo más ruidoso no reproduce
- D158 · El markdown para agentes sale del `<main>` prerenderizado, y es un artefacto commiteado con guardián
- D159 · El guardián propio en vez del escáner ajeno: `check:agentes`
- D160 · Content Signals: la frase del `LICENSE`, dicha para una máquina
- D161 · Cuatro huecos que vio un escáner ajeno, y el que no se tapa
- D162 · El barrido de huérfanos se queda en `logo-kit`, y eso se decide en vez de heredarse
- D163 · La sección más pesada del arranque era la que nadie lee hasta que algo sale rojo
- D164 · El aviso ya estaba puesto y gritó cinco veces: el hueco no era decirlo, era leerlo
- D165 · El informe del escáner era una API, y con ella un suspenso se descarta con cifra
- D166 · La causa era la profundidad, y el catálogo que un descarte mal fundado había tumbado
- D167 · Publicar la nota de un escáner sin convertirla en un criterio, y el sello que la sostiene
- D168 · La primaria se lee como índice relativo, y ese párrafo es lo que desbloquea el lanzamiento
- D169 · El contador que da el denominador, y la excepción que hubo que escribir en un documento legal
- D170 · Una excepción a la postura propia, no a la norma: Vercel Web Analytics carga sin consentimiento
- D171 · El generador de carruseles entra al repo, y su guardián pasa de uno a tres criterios
- D172 · Las once «sin indexar» de Search Console son cero páginas, y el «nada» se escribe once veces
- D173 · Un recuento no vive donde ningún gate puede leerlo, y esta regla ya se había escrito para media superficie
- D174 · Un hook de cierre que sale 0 le habla a la persona, y quien commitea es el modelo
- D175 · La regla que ordena retirar entró como una adición, y no tenía quién la comprobara
<!-- FIN ÍNDICE -->

## D1 (superado en V2+) · El diseño se traduce, no se copia — 2026-07-24

> **Superado para la fase V2+ (2026-08-01).** Este flujo aplicó a la V1, cuando **no
> existía sistema** y había que explorar el lenguaje visual desde cero en Claude Design.
> Ya no aplica: el sistema de diseño vive en el repo (tokens en `globals.css`, la página
> **Design System**, y componentes compartidos), es **más rico que el mockup** y es ahora
> la fuente de diseño. **Las secciones nuevas se diseñan en código** (Claude Code, iterando
> en navegador), reusando el sistema. Claude Design queda como **cuaderno de bocetos
> desechable** para movimientos visuales *nuevos* (gesto-firma, franja-CTA, layouts
> novedosos), **nunca como fuente viva** — mantenerlo en paralelo reintroduce la divergencia
> que D1/D4/D19 combaten. La decisión original se conserva abajo como registro.
>
> **Y la copia del repo se borra el 2026-08-25 (P68.695).** `design/web-personal.dc.html`
> llevaba sin tocarse desde el 26 de julio y **ya afirmaba algo falso**: su línea 317 seguía
> diciendo «Feb 2024 — Nov 2024» para KUOTIP, la fecha que el sitio corrigió el 16 de agosto.
> Un artefacto congelado que nadie mantiene no es una referencia: es la divergencia de arriba,
> versionada y en un repositorio público. **No se pierde nada**: el archivo sigue en Claude
> Design (proyecto «New Website»), que es donde D1 dice que vive, y git conserva la copia.
> Lo que queda en el árbol son los dos comentarios que lo citaban como origen, ahora sin ruta.

**Decisión.** El diseño de V1 (home + Brand Kit + Design System, con nav/footer/breadcrumb
compartidos) vive en Claude Design, proyecto "New Website", archivo `Web personal.dc.html`.
Es la fuente fiel de lo aprobado y se **traduce** a Next, no se reproduce de memoria desde el PRD.

**Contexto.** El `.dc.html` es HTML con estilos inline + plantillas reactivas de Claude Design
(`sc-if`/`sc-for`, `{{ }}`) y toda la lógica de estado/responsive/motion en un `<script>` DCLogic.
Se importa vía el MCP `claude_design`. Todo el contenido (casos, proceso, trayectoria, toolkit,
tokens, checklist) vive como datos en ese script → va al diccionario i18n.

## D2 · i18n nativo con `app/[lang]`, ES sin prefijo + `/en` — 2026-07-24
**Decisión.** Arquitectura i18n desde la primera línea (requisito Must): árbol `app/[lang]/`,
patrón nativo de Next 16 (dictionaries server-only, `await params`, `generateStaticParams`).
**Español sin prefijo** (raíz `/`), **inglés en `/en`**. `defaultLocale = es`, prefijo *as-needed*:
`/` sirve ES sin redirect, `/es` no existe (si entra → `/`). `hreflang` + `canonical` emparejando
`/` ↔ `/en`. Cero strings hardcodeados (todo vía diccionario). La **traducción** del contenido a
inglés es aparte y llega en V2; la **arquitectura** no se pospone.

**Contexto.** Target principal = España, así que el idioma primario va en la raíz (URLs limpias
para el 90% del tráfico). Sin librería (más perf que `next-intl`, cero dependencia). Reconvertir
i18n después sería rehacer.

## D3 · Next 16 usa `proxy.ts`, no `middleware.ts` — 2026-07-24
**Decisión.** El enrutado de locale se hace en `proxy.ts` (`export function proxy`), no en
`middleware.ts`.

**Contexto.** Next 16 renombró el archivo; el propio doc de i18n del paquete usa `proxy`.
Confirmado leyendo `node_modules/next/dist/docs/` (AGENTS.md avisa de que este Next tiene
breaking changes respecto al conocido).

**Su matcher es un CATCH-ALL, y eso convierte cualquier ruta nueva de primer nivel en un 404
(2026-08-23).** El matcher excluye `_next`, `api` y las rutas con extensión de archivo, y
reescribe **todo lo demás** a `/{defaultLocale}/…`. O sea que una carpeta nueva bajo `app/` que
NO cuelgue de `app/[lang]/` —una superficie de prototipo, un panel interno, lo que sea— se
reescribe a `/es/loquesea`, que no existe, y devuelve 404 **sin ningún error de compilación ni
aviso**. El síntoma no apunta a su causa: parece que la ruta está mal escrita.

Se descubrió montando la superficie de `/prototype` para P66, que vive fuera de `app/[lang]/` a
propósito —ahí la vigilan `check:rutas` y el `PageSlug` que exige `pageMetadata`, así que una
ruta de andamiaje no compilaría—. La salida es una palabra en el lookahead del matcher, y
conviene saber que hace falta antes de perder un ciclo buscándola: **es la única línea de
producción que un prototipo necesita, y se va con él.**

## D4 · Fuente única de tokens = `app/globals.css`; `brand-globals.css` deprecado — 2026-07-24
**Decisión.** `app/globals.css` (la que importa la app) es la **única** fuente de tokens.
`brand-globals.css` **no se borra** (decisión de Francisco): se marca DEPRECADO en su cabecera y
se consolida todo en `app/globals.css`. Faltan por trasladar los 5 tokens de layout
(`--container` 1360px, `--page-x`, `--gutter`, `--measure` 42rem, `--section-y`).

**Contexto.** Había dos archivos con los mismos tokens; el segundo estaba huérfano. Una fuente
duplicada acaba divergiendo (ya causó bugs en la fase de diseño). Ningún archivo del repo
referencia "brand-globals" en su contenido; las menciones en texto estaban solo en 2 notas de
Notion, ya corregidas. Divergencia a reconciliar (manda el repo): el diseño aclara `--brand-purple`
en `.dark` y usa los `brand-*-soft` en hex; el repo los mantiene.

**Completado (2026-08-02).** Consolidación cerrada, y la decisión original quedó **superada en
dos puntos** (el texto de arriba se conserva como registro):
- **Los 5 tokens de layout ya están en `app/globals.css`** (`--container` 1360px, `--measure`
  42rem, `--section-y`, `--page-x`, `--gutter`); no falta nada por trasladar.
- **`brand-globals.css` sí se borró**, no se mantuvo como DEPRECADO: era huérfano y sin
  referencias, así que se eliminó en el **PR #26** («eliminar brand-globals.css (deprecado,
  huérfano)»). `app/globals.css` es hoy la única fuente de tokens, sin archivo espejo.

## D5 · Dark mode = `system` por defecto + toggle — 2026-07-24
**Decisión.** `next-themes` con `defaultTheme="system"` (respeta el SO) + toggle que sobreescribe.
Añadir `color-scheme` en `:root` y `<meta name="theme-color">` por esquema.

**Contexto.** Se delega al usuario qué versión quiere ver — para eso se construyen las dos, no por
aparentar. La base ya evita el flash (`attribute="class"` + `suppressHydrationWarning`). El swap de
logos claro/oscuro se hace por CSS puro (sin JS, sin parpadeo).

## D6 · Plataforma primero, shadcn donde la plataforma no llega; `@base-ui/react` fuera hasta el primer componente — 2026-07-24, **reescrita 2026-08-08 (P37.63) y 2026-08-24 (P68.66)**
**Decisión.** Para **widgets con estado, foco atrapado o portal** —diálogo, popover, tooltip,
combobox, menú, tabs, scroll-area— siguen sin escribirse a mano el teclado, el ARIA y la gestión
de foco. Lo que cambia el 2026-08-24 es **de dónde salen, y en qué orden se pregunta**:

1. **¿Lo trae la plataforma?** Diálogo modal (`<dialog>` + `showModal()`), popover no modal
   (atributo `popover`) y el posicionamiento contra un ancla (`anchor-name` / `position-area`).
   Los tres dan foco, `Esc`, capa superior y light-dismiss sin dependencia y sin JS que mantener.
2. **Si no, ¿lo trae shadcn?** Lo que **no** tiene equivalente nativo —combobox, autocompletado,
   date picker— se trae con `npx shadcn@latest add <componente>` (estilo `base-nova`, ya
   configurado en `components.json`), se le aplican **nuestros** tokens, y si acaba siendo pieza
   del sistema se publica en el Design System.
3. **Escribirlo a mano sigue siendo el último recurso, no el primero.** «Plataforma primero» no
   es permiso para reimplementar un combobox: es el paso que antes no se preguntaba.

Es el **paso 3 de la «Regla de construcción»** de `CLAUDE.md`, que es donde vive la cascada
completa; aquí queda el porqué y el estado de la dependencia.

**Por qué se invierte el orden, con las dos cifras que lo deciden.**

- **La plataforma alcanzó a la librería en lo único que se le compraba.** D6 ya acotaba la regla
  «a lo que de verdad compra algo: teclado, ARIA y gestión de foco». Para diálogo y popover eso
  ya no hay que comprarlo: la **Popover API** es Baseline *newly available* desde **enero de
  2025**, y lo único que le faltaba —posicionar contra un ancla— lo cubre **CSS anchor
  positioning**, Baseline *newly available* desde **enero de 2026**. Y este sitio no lo está
  suponiendo: su `<dialog>` nativo de consentimiento lleva desde V1 atrapando el foco y dando
  `Esc` de fábrica, con 0 violaciones de axe.
- **Y el coste de adoptarla se midió en un caso real.** P67 trajo el `field` de shadcn para
  comprobarlo y hubo que reescribir **cuatro de cuatro** propiedades: `h-8` contra el suelo de
  44px del checklist, `outline-none` con anillo propio de 3px contra el mecanismo único de foco
  del sitio, valores fuera de la disciplina de tokens, y una dependencia nueva de frontend para
  un `<input>`. «Adoptarlo era reescribirle todas las clases y quedarse con el nombre del archivo
  más una dependencia» (`components/ui/field.tsx`). Esa prueba **no** invalida la regla —un
  `<input>` no es un widget con foco atrapado, así que el disparador ni llegó a activarse— pero
  sí mide lo que cuesta el encaje, y ese coste es el mismo para cualquier componente suyo: el
  desajuste es con el sistema de diseño, no con el elemento.
- Juntas dicen lo mismo: **cuando lo que se compra es solo comportamiento, y el navegador ya lo
  regala, la dependencia deja de pagarse sola.** Donde no lo regala, se sigue pagando sin
  discutir.

**Lo que NO cambia.** La dependencia sigue necesitando `/pick-ui-library` antes de entrar (solo
la dispara Francisco). Y la nota de «newly available» va con su letra pequeña: Baseline *newly*
significa las versiones actuales, no el parque entero — un widget que se apoye en anchor
positioning necesita degradar con `@supports`, igual que cualquier otra cosa recién llegada.

- **Aplica hacia delante, no hacia atrás.** Los widgets que hoy están a mano se quedan: el
  `<dialog>` nativo del consentimiento (`showModal()` atrapa el foco y da ESC de fábrica), su
  switch (`input[type=checkbox][role=switch]` real, con label asociada) y las pestañas del Toolkit
  y los tabs de dispositivo del Design System (roving `tabIndex`, `aria-selected`/`aria-pressed`).
  **No hay deuda de accesibilidad ahí** —0 violaciones de axe en las seis páginas, diálogo
  incluido—, así que reescribirlos sería cambiar código que funciona por cumplir una regla. El
  próximo widget de este tipo, en cambio, se trae; la IA conversacional de V3 (popover, tooltip,
  combobox, scroll-area) es el primer cliente previsible.
- **`@base-ui/react` sale de `dependencies`.** Estaba declarado con **cero imports en todo el
  repo**: una dependencia de producción que no se usaba. Verificado quitándolo: `npm run build`
  compila y las 19 páginas se generan igual. Vuelve —y esa vez como dependencia de verdad— con el
  primer `shadcn add`, que lo instala solo porque `base-nova` monta sobre Base UI. **No confundir
  con el CSS:** `app/globals.css` hace `@import "shadcn/tailwind.css"`, que viene del paquete
  **`shadcn`** (CLI, en devDependencies por D27) y no necesita el runtime de Base UI.

**Iconos:** genéricos → `lucide-react`; logos de marca → PNG en `public/logos/**` (pares
light/dark) con `next/image` + swap por tema; logo propio → `components/ui/logo.tsx`. Los glifos
que lucide no exporta se dibujan siguiendo la regla de autoría de `BRAND.md` §Iconos propios.

**Qué decía antes y por qué se cambia.** La redacción de julio afirmaba que «shadcn está integrado
y no hay que reimportarlo», y planificaba usar su Tabs para el Toolkit y su Button para los CTAs.
Ninguna de las tres cosas era cierta el 2026-08-08: **shadcn no se usa en absoluto**
—`components/ui/` tiene `action.tsx` y `logo.tsx`, ninguno suyo; el `button.tsx` que sí llegó a
existir se borró en P37.592 con cero usos; las pestañas y el diálogo acabaron escritos a mano—. La
decisión describía una intención, no un estado, y el documento la leía como estado. Es el mismo
defecto de forma que las cifras de contraste de `BRAND.md`: la regla no fallaba, fallaba que
afirmaba algo que nadie volvió a comprobar.

**Contexto.** El diseño es a medida y apenas consume la librería, así que la regla se acota a lo
que de verdad compra algo: teclado, ARIA y gestión de foco, que son caros de escribir bien y
baratos de romper sin enterarse. Fuera de ese perímetro —cualquier cosa sin estado ni foco
atrapado— manda la capa propia (D36) y shadcn no entra. Acotarla también evita el fallo contrario:
D6 aplicada en bloque habría obligado a reescribir tres widgets correctos para satisfacer un
documento.

## D7 · Responsive en CSS, no en JS; Server Components por defecto — 2026-07-24
**Decisión.** El responsive del diseño (hecho con JS `matchMedia` a 640/768px + swaps de estilo
inline) se reimplementa con **media queries CSS/Tailwind**. Server Components por defecto; `"use client"`
solo en islas: nav (scroll+tema+menú), reveals (IntersectionObserver), contadores, tabs de Toolkit,
preview de dispositivo del Design System.

**Contexto.** JS para responsive rompe SSR, mete CLS y penaliza PageSpeed. Menos JS de cliente = mejor
Core Web Vitals. Es la palanca principal del objetivo >90.

## D8 · Objetivos no funcionales: PageSpeed >90, desktop+mobile, AA→AAA — 2026-07-24
**Decisión.** Criterios de aceptación del build: PageSpeed/Lighthouse **>90**; desktop **y** mobile
ambos optimizados; accesibilidad **AA** de suelo, empujar a **AAA** siempre que se pueda (el sistema
de color ya está en AAA). Verificación con navegador real (Lighthouse + axe) en claro y oscuro,
sección a sección.

**Contexto.** El propio sitio es la prueba de criterio técnico (PRD §1); no son aspiraciones.

## D9 · Alcance de V1 = home + Brand Kit + Design System + SEO/OG + medición + dominio — 2026-07-24
**Decisión.** El primer lanzamiento (= V1) lleva la home completa, Brand Kit, Design System, SEO/OG,
medición (GA4/GTM + consentimiento) y dominio propio. **Sobre mí y Accesibilidad NO entran en V1 →
van a V2** (PRD §22 revierte §18). Sin esquema V1.0/V1.1: lanzamiento = V1, todo lo diferido = V2.

**Contexto.** Sobre mí y Accesibilidad son las únicas piezas bloqueadas por contenido sin escribir;
se sacan para no retrasar el lanzamiento.

## D10 · Política de documentación de la fase de desarrollo — 2026-07-24
**Decisión.** Producto/diseño/alcance → **estado** en `PRD-Live.md` (spec viva, `@`-importada
en cada sesión; único doc con espejo en Notion) + **histórico** en `PRD-Historical.md` (solo repo).
Técnica transversal → este `DECISIONS.md` (fuente de verdad, **solo repo**; espejo de Notion
retirado el 2026-07-30). Convenciones que aplican en adelante →
`CLAUDE.md`. `README.md` → entrada/overview del repo (qué es, stack, arranque, estructura, mapa de
docs), **mantenido al día conforme evoluciona el proyecto** (no es un one-off del lanzamiento).
"Por qué" del código → mensajes de commit/PR. Progreso por tarea → notas de Notion.

**Contexto.** El PRD se `@`-importa en `CLAUDE.md`, así que se carga entero cada sesión; meterle
decisiones de dev (más numerosas y de menor vida útil) encarece todas las sesiones para siempre y
mezcla el *qué/por qué* de producto con el *cómo* de implementación.

## D11 · Andamiaje de calidad del build — 2026-07-24
**Decisión.** (a) Rama `feat/build-v1` para todo el build. (b) Diccionario i18n **tipado** +
`noUncheckedIndexedAccess: true`, para que "cero strings hardcodeados" sea error de compilación.
(c) `prettier-plugin-tailwindcss` para orden consistente de clases. (d) `@next/bundle-analyzer`
(devDep) para vigilar peso del JS, se añade en el Setup. (e) Verificación por página con
`claude-in-chrome` (Lighthouse desktop+mobile + axe) en ambos temas. (f) **Sin** suite de tests en
V1 (sobre-ingeniería para el corte de lanzamiento; el QA real es visual + Lighthouse + axe +
responsive manual).

**Contexto.** Proporcionado a "lanzar V1 ASAP": herramientas que garantizan limpieza/perf/a11y sin
frenar el lanzamiento. ESLint (`core-web-vitals` + `typescript`) ya cubre reglas de jsx-a11y y de
rendimiento; `strict` ya está activo.

## D12 · Branching y releases — 2026-07-24
**Decisión.** Trunk-based con ramas cortas → PR → `main`. Naming `<tipo>/<scope-en-kebab>` con tipos
alineados a Conventional Commits: `feat/`, `fix/`, `perf/`, `a11y/`, `refactor/`, `chore/`, `docs/`,
`seo/` (kebab-case, en inglés, cortas; ej. `feat/nav-sticky`, `perf/hero-lcp`). Pre-deploy:
`feat/build-v1` se mantiene como rama de integración del andamiaje (aceptable porque `main` aún no
está en producción). **Al conectar Vercel, trocear por bloque** (`feat/setup-i18n`, `feat/nav`, …)
→ PR → preview → merge. Post-launch: `main` = producción protegida, ramas cortas siempre, y **tags
de release** `vX.Y.Z` en cada deploy para tener puntos de retorno.

**Contexto.** Dev en solitario + Vercel: Gitflow (develop/release/hotfix) es sobre-ingeniería;
las ramas largas son anti-patrón (merges big-bang, drift, revisión imposible). El rigor de ramas
cortas importa sobre todo **después** del primer deploy, cuando `main` = producción.

**Ampliada 2026-08-09 (P37.685) — cómo se integra cada PR, que estaba en la práctica y no escrito.**
`main` es **lineal**: no hay merge commits desde el PR #18. Lo que decide el método es cuántos
commits trae la rama, no su tamaño:

- **PR de un commit** → **squash**, que deja el `(#N)` en el asunto y lo enlaza con su PR.
- **PR de varios commits** → **rebase**. Cada commit de una tanda es una tarea con su porqué
  escrito; aplastarlos convertiría veinte razonamientos en un párrafo. La ola 2 entró así, con
  sus 21 commits (`v1.5.0`).

**Por qué no merge commit.** Con un solo desarrollador la burbuja no informa de nada —no hubo dos
líneas de trabajo que reconciliar— y rompe la lectura lineal de `git log`, que aquí se usa como
registro real de en qué orden pasaron las cosas.


## D13 · Entornos y staging = Vercel Previews — 2026-07-24
**Decisión.** No hay entorno de staging pesado separado. Los **Vercel Preview Deployments** (uno por
rama/PR, build idéntico a producción) son el staging de facto. **Conectar Vercel temprano** (previews
en `.vercel.app`) para QA continuo de perf/OG/analítica durante todo el build — el deploy "oficial" +
dominio siguen en Sprint 3. **Lighthouse se mide contra build de producción** (el preview de Vercel o
`next build && next start`), **nunca `next dev`** (dev mode da cifras engañosas). La **analítica se
gatea por entorno** (`VERCEL_ENV === 'production'`) o propiedad GA4 aparte, para no ensuciar los datos
de producción con tráfico de dev/preview.

**Contexto.** Portfolio solo-dev: un staging persistente sería sobre-ingeniería, pero hay
validaciones que no se pueden hacer en local — consentimiento/cookies/GA4 (dominios y cookies
reales), OG cards (los scrapers necesitan URL pública), y el número real de Lighthouse sobre infra
desplegada. Los previews cubren las tres gratis.

**Realizado 2026-07-27.** Vercel conectado al repo (proyecto `francisco-lopez-website`, cuenta
personal Hobby): previews automáticos por push. `main` = producción (hoy el starter de Next hasta
que se mergee `feat/build-v1`); la home se revisa en el preview de la rama. **Protección de
deployments (Vercel Authentication) desactivada** para que los previews sean públicos — necesario
para medir con PageSpeed Insights y para que los scrapers de OG los lean; es un portfolio público,
sin nada sensible en el preview. `SITE_URL` (metadataBase/OG/canonical) resuelve
`NEXT_PUBLIC_SITE_URL` → `https://$VERCEL_URL` → `localhost`, para URLs absolutas en cada preview sin
configurar nada a mano. **Lighthouse — cómo:** PSI sin API key topa la cuota diaria (429); se corre
en local contra el preview (o `next start`) con `CHROME_PATH='C:\Program Files\Google\Chrome\Application\chrome.exe'`
(el error de `chrome-launcher` al cerrar es ruido; el audit completa y escribe el JSON). **QA de la
home V1 (P13):** Lighthouse desktop 100/100/100, mobile Perf 93 / A11y 100 / BP 100; axe 0
violaciones en claro y oscuro; CLS 0; LCP mobile 3,1s (foto del Hero, a vigilar). El SEO 66 es
artefacto del preview (Vercel lo marca `noindex`) + tarea de SEO técnico pendiente, no un defecto.

## D14 · Imágenes OG generadas con ImageResponse bajo `/api/og` — 2026-07-27
**Decisión.** Las Open Graph (1200×630) se generan por código con `ImageResponse` (`next/og`,
Satori) en una **route handler** `app/api/og/route.tsx`, parametrizada por
`?card=<home|brand-kit|design-system>&lang=<es|en>`. Cada página referencia la suya en su metadata
(`openGraph.images` + `twitter.images`). Fuentes reales en `assets/fonts/*.woff` (Bricolage 600,
Inter 400/600) leídas con `fs`; el logo split como SVG data-URI. `next.config.ts` →
`outputFileTracingIncludes` para `/api/og` (fuentes + foto), porque el tracing no detecta el
`readFileSync(join(process.cwd(), …))` y en Vercel faltarían los assets en el bundle serverless.

**Contexto — por qué route handler y no el file-convention `opengraph-image.tsx`.** El
`opengraph-image` vive dentro del segmento `[lang]` y su URL (`/es/opengraph-image`) choca con el
rewrite de locale de `proxy.ts` (que redirige `/es/*`). `/api/*` está EXCLUIDO del matcher del
proxy → se sirve directo, sin colisión ni doble `og:image`. La home es tarjeta compuesta (foto +
nombre + rol, dos paneles); Brand Kit/Design System, plantilla de marca (split + wordmark + título
+ kicker + flancos pastel). El preview "OG image · redes" del Brand Kit usa la imagen REAL
(`<img src="/api/og?…">`), no un mockup, para que no pueda divergir del formato servido.

**Convención derivada (2026-07-27).** El SEO y el marcado de datos estructurados (JSON-LD Schema.org)
por página pasan a ser **criterio de cierre de cada página nueva**, al mismo nivel que performance,
accesibilidad y responsive. La regla vive en `CLAUDE.md` (convenciones del build), junto a sus
hermanas. Pendiente de completar el marcado existente: ver la tarea "Enriquecer datos estructurados
(Schema.org / JSON-LD)" — `BreadcrumbList` en páginas internas + enriquecer `Person`/`ProfilePage`.

## D15 · SITE_URL estable en producción (`VERCEL_PROJECT_PRODUCTION_URL`) — 2026-07-27
**Decisión.** En `lib/site.ts`, precedencia de la URL base: `NEXT_PUBLIC_SITE_URL` → en producción
`VERCEL_PROJECT_PRODUCTION_URL` (URL/dominio ESTABLE de producción) → `VERCEL_URL` (efímera,
correcta para previews) → `localhost`. Fuente única de `metadataBase`, canonical, OG, sitemap y
robots. Reemplaza al fallback simple a `VERCEL_URL` de D13.

**Contexto.** `VERCEL_URL` es la URL única de CADA deployment (cambia en cada deploy). Al lanzar,
canonical/OG/sitemap/robots apuntaban a `francisco-lopez-website-<hash>.vercel.app` — malo para SEO
(canónico cambiante por release). `VERCEL_PROJECT_PRODUCTION_URL` es estable y **Vercel la asigna al
dominio propio en cuanto se conecta**, así que al añadir el dominio el canónico lo sigue solo, sin
tocar código ni env vars. Hotfix post-lanzamiento (PR #2).

## D16 · V1 en producción — 2026-07-27 (registro)
**Hecho.** `feat/build-v1` → `main` (PR #1, `423173c`) + hotfix SITE_URL (PR #2, `f474130`).
Producción en `https://francisco-lopez-website.vercel.app`, tag **`v1.0.0`**. QA en prod: rutas
ES/EN 200, `/es`→`/`, robots `Allow`, OG serverless 200; Lighthouse mobile Perf 98 / A11y 100 / BP
100 / SEO 100, axe 0 violaciones. `main` = producción: en adelante ramas cortas → PR → merge (D12).
**`gh` CLI instalado y autenticado** → PRs se crean/mergean desde la sesión. Siguiente: dominio
propio **franciscolopez.es** (GoDaddy, comprado 2026-07-27) → DNS/SSL en Vercel; al asignarlo, D15
hace que canonical/OG/sitemap pasen al dominio automáticamente (sin cambios de código).

## D17 · Analítica cargada con `next/script`, gateada a producción, consent-ready — 2026-07-28
**Decisión.** Google Tag Manager (P21) se instala con `next/script` (estrategia
`afterInteractive`, la que el doc de Next recomienda para tag managers), en un client
component `components/analytics/google-tag-manager.tsx`, renderizado una vez en el
layout de `[lang]`. **Sin `@next/third-parties`** (dependencia innecesaria: el snippet
es trivial y así se controla el orden de carga para el consent mode de P22). GTM es el
contenedor único de GA4 (P24) y de los eventos de clic mailto/tel/CV (P25) — no se mete
gtag directo.

**Gate de entorno (D13).** El contenedor solo se carga si `VERCEL_ENV === "production"`
**y** `NEXT_PUBLIC_GTM_ID` está definida (`lib/site.ts` → `GTM_ID`; el layout omite el
componente si es `undefined`). Así dev y preview no emiten analítica y no ensucian los
datos. La var es `NEXT_PUBLIC_*` porque el ID se inyecta en cliente; no es secreto.
Documentada en `.env.example` (nuevo; `.gitignore` excepciona `!.env.example`).

> **Matizado 2026-08-04 (P37.5975): este gate manda sobre la analítica, no sobre la UI
> de consentimiento.** El `<ConsentBanner>` colgaba del mismo `GTM_ID`, y el efecto
> era que el banner, el diálogo de preferencias, sus cuatro botones y el switch —una
> superficie de interfaz entera— **solo existían en producción**: no se podían revisar
> ni en dev ni en preview, es decir, solo *después* de publicarlos. Se destapó al
> arreglar la bolita del switch (P37.593), que fallaba el 3:1 de componente en dos de
> las cuatro combinaciones y hubo que verificar inyectando el markup a mano en otra
> página, porque el componente real no era observable en ningún entorno revisable.
> Ahora la UI se monta en todos los entornos y el contenedor sigue gateado. Montarla
> fuera de producción no emite nada: sin GTM, `applyConsent` empuja al `dataLayer` que
> nadie lee y `saveConsent` escribe en `localStorage`. **La regla que queda: gatear lo
> que se mide, nunca lo que se dibuja** — si una interfaz solo existe en producción, su
> primera revisión llega tarde por definición.

**Consentimiento (frontera con P22).** El contenedor GTM por sí solo NO deja cookies
—solo lo hacen los tags que dispara (GA4)—, así que instalarlo ahora es conforme aunque
el banner no exista todavía. El Consent Mode v2 (default `denied` + update al aceptar) y
el banner llegan en P22, ANTES de añadir el tag de GA4 (P24), que es lo que escribiría
cookies. Orden del tablero (21→22→…→24) coherente con esto.

**Pendiente de Francisco para activarlo:** crear la cuenta/contenedor GTM (GTM-XXXXXXX) y
añadir `NEXT_PUBLIC_GTM_ID` al entorno **Production** de Vercel. Hasta entonces el código
es inerte (no-op) en todos los entornos. Verificación en vivo tras el deploy con la var
puesta: GTM Preview/Tag Assistant + inspección de red a `googletagmanager.com/gtm.js`.

## D18 · Página de política de cookies como documento vivo — 2026-07-28
**Decisión.** La política de cookies (P23) es una página propia i18n en `/cookies`
(`app/[lang]/cookies/`, componente `cookies-policy.tsx`), con la misma estructura de
página interna que Brand Kit / Design System (Nav + Footer + Breadcrumb compartidos,
RevealRoot). Cumple el criterio de cierre de SEO: `BreadcrumbList` JSON-LD + metadata
por locale + tarjeta OG propia (`card=cookies` en `/api/og`). El footer enlaza
**"Cookies" → la página** (no abre el diálogo); el botón "Gestionar preferencias" de
la propia página reabre el centro de preferencias (dispara `OPEN_CONSENT_EVENT`).

**Mantenimiento (criterio de cierre, NO opcional).** La tabla de la página documenta
lo que carga la web HOY: `flm-consent` (localStorage), contenedor GTM y, bajo
consentimiento, Google Analytics (`_ga`/`_ga_*`). **Al añadir cualquier herramienta
nueva que use cookies o almacenamiento** —Microsoft Clarity está previsto (Could/V2)—
hay que **añadir su fila a la tabla y actualizar la fecha `updated`** del diccionario
(ES y EN). Marcado con un comentario MANTENIMIENTO en `cookies-policy.tsx`.

**Banner (ajuste 2026-07-28).** A petición de Francisco, el banner deja de ocupar el
ancho completo: card compacto anclado abajo a la izquierda (`max-w-[40rem]`), con los
botones apilados. El resto del comportamiento de P22 (D17) no cambia.

**Frontera con GA4 (P24).** La política ya lista Google Analytics como herramienta de
la categoría Analíticas (es la razón de todo el aparato de consentimiento). GA4 se
cablea en P24; hasta entonces, aceptar Analíticas fija el consentimiento pero no hay
tag que escriba cookies. Conviene desplegar P24 cerca para que la política sea
literal, o desplegar P22+P23+P24 juntas.

## D19 · Optimización post-lanzamiento: analítica diferida + SEO afinado — 2026-07-28
**Decisión.** Tras medir producción con GTM+GA4 ya cargando:
- **GTM pasa de `afterInteractive` a `lazyOnload`** (supersede la estrategia de D17).
  GTM+GA4 (~143 KiB) en la ventana interactiva subían el TBT móvil a ~390 ms y
  bajaban PageSpeed a 88. Con `lazyOnload` (carga en tiempo ocioso) el TBT baja a
  120-260 ms y el Perf vuelve a >90. GTM sigue cargando (verificado: contenedor
  inicializado, `gtm.js`/`dom`/`load`) y el consentimiento NO se afecta: el default
  denegado lo fija `consent-init` (script inline) en el parseo, antes que GTM. La
  medición (page_view/scroll/clics) ocurre igual tras la interactividad.
- **El sitemap incluye `/cookies`** (faltaba; el array de rutas se había quedado en
  3). Con sus alternates hreflang es/en; `priority` 0.3 (legal).
- **El enlace de política del banner deja de ser "Más información"** (texto genérico
  que Lighthouse marca como `link-text`) → "Consulta la política de cookies" /
  "Read the cookie policy". Descriptivo: recupera SEO 100 y mejora la accesibilidad.

**Contexto — GA4 en producción (registro).** GA4 (`G-MEG5BP629K`, propiedad propia
bajo la cuenta "Francisco López", NO la de la agencia) se configuró como Etiqueta de
Google dentro de GTM (Initialization - All Pages) y se publicó. Consent Mode
verificado en vivo: sin consentimiento 0 cookies `_ga`; con consentimiento, hits
`gcs=G111` e ingesta confirmada en Tiempo real (page_view/scroll/user_engagement/
file_download). GA4 ↔ Search Console vinculado. La medición mejorada ya captura
scroll y descarga de CV de fábrica → cubre dos métricas de éxito del PRD §9.

**Resultado.** Producción: Desktop 100/100/100/100; Móvil Perf 91-94 / A11y 100 /
BP 100 / SEO 100. Cumple el objetivo D8 (>90 desktop+móvil). Tags v1.0.1 → v1.0.4.

## D20 · Revisión de copy ES↔EN: el diccionario ES es la fuente de verdad, el EN no es literal — 2026-07-28
**Decisión.** El copy se revisa en dos capas: (1) los textos ES son correctos y
comunican, (2) el EN tiene sentido, no es traducción literal ni redundante.
**`es.json` es la fuente de verdad**; el `en.json` se revisa contra él, no al revés.
Regla de redacción derivada: el `kicker`/`eyebrow` de una sección **no repite su
título** (fijada también en `CLAUDE.md`).

**Contexto.** La web ya estaba traducida a EN (inglés real, hecho en el build de
Brand Kit/Design System, no placeholder), así que la tarea P29 dejó de ser
"investigar la traducción" y pasó a ser una pasada de revisión de todo el copy. Se
detectaron y corrigieron 2 redundancias `kicker`/título (PR #17): Design System
`Sistema de diseño`→`Fundamentos de diseño` (EN `Design system`→`Design foundations`)
y Trayectoria eyebrow `Career`→`Journey` (el título `Career` se mantiene).

**Registro / pendiente.** La revisión completa del copy ES vive en la página de
Notion «Textos ES — revisión de copy» (dentro de *New Website*): tabla por
página/bloque con una columna «Texto nuevo» para que Francisco marque cambios.
Cuando la rellene → aplicar a `es.json` → re-traducir los EN afectados → deploy.
Tarea P29 (i18n) en **Blocked** a la espera de ese input. La **traducción de
contenido nuevo** a EN sigue siendo V2 (D2); esto es solo la revisión de lo ya escrito.

## D21 · Enlaces entre páginas hermanas con componente compartido — 2026-07-29
**Decisión.** Las tres páginas secundarias del sistema (Brand Kit, Design System y
la futura Accesibilidad) son **hermanas**: cada una enlaza a las **otras dos** desde
la **misma ubicación** (cierre del `<main>`, antes del footer) y con el **mismo
formato**, vía un componente compartido `components/site/related-pages.tsx`
(dict-driven, bloque `related` en i18n — divisor + eyebrow "Del mismo sistema" +
rejilla de 2 tarjetas). Sustituye a los avisos ad-hoc previos, incoherentes entre sí:
Brand Kit tenía una caja de prosa (solo → Design System, sin enlace real) y Design
System dos tarjetas "Aquí / Página de Accesibilidad" a media página (bloque 08, solo
→ Accesibilidad). **Accesibilidad**, aún no construida, aparece como tarjeta
"Próximamente" apagada y sin enlace; al crearla se le da su ruta en el array `PAGES`
del componente y renderiza `<RelatedPages current="accesibilidad">` (anotado en su
tarea de dev). El matiz de alcance que hacían las tarjetas boundary de Design System
(criterio interno **aquí** vs declaración pública en la **futura** página de
Accesibilidad) se conserva condensado en una frase del `lead` de su sección de
Accesibilidad (opción 1: sin duplicar navegación).

**Sin datos estructurados para "related" (evaluado y descartado).** No se añade JSON-LD
(`WebPage.relatedLink`, `SiteNavigationElement`, `ItemList`): ninguno es elegible para
rich results, el descubrimiento ya lo dan los `<a href>` reales dentro del
`<nav aria-labelledby>`, y añadirlo iría contra la regla de "solo el marcado que
corresponde por tipo" (D14). La señal correcta es HTML semántico, ya presente.

**Contexto.** Mismo principio de fuente única que el resto del sistema (D1/D4): un
componente y un bloque de diccionario, no copias por página — que es justo lo que
había divergido en las menciones anteriores.

**Realizado 2026-08-02.** La página de **Accesibilidad ya existe**: su ruta entra en el
array `PAGES` de `related-pages.tsx` (`accesibilidad → /accesibilidad`) y renderiza
`<RelatedPages current="accesibilidad">`. Con ello **las tres hermanas se enlazan entre
sí** y se retira el tile «Próximamente». El matiz de alcance (criterio interno del Design
System vs declaración pública) se materializa en la propia página de Accesibilidad (D24).

## D22 · CV en PDF generado desde el diccionario (react-pdf, ATS) — 2026-07-29
**Decisión.** El CV con identidad propia (tarea V2) se **genera por código desde una
sola fuente**, no se diseña a mano: contenido del diccionario i18n (bloque `cv` nuevo)
+ tokens/fuentes de marca → PDF. Mismo principio de fuente única que D1/D4.
- **Motor: `@react-pdf/renderer`** — PDF con **texto real seleccionable** (ATS-friendly),
  fuentes propias (Bricolage/Inter woff), control de paginación A4. **Explícitamente NO**
  Satori/`ImageResponse` (D14): eso produce raster, inservible para un CV que un ATS
  debe parsear.
- **Layout:** cabecera de marca (lockup + foto + nombre/rol/contacto) + **cuerpo a una
  columna**, ATS-maximizado (sin sidebar; orden de lectura = orden del árbol de
  componentes). **2 páginas.** Online-only → libertad de color de marca.
- **Ejecución:** script de build/local que genera y **commitea** `public/cv/…-es.pdf` y
  `…-en.pdf` (el botón Descargar CV ya apunta ahí; el sufijo `-es` ya dejaba sitio al
  `-en`). Bilingüe. No ruta on-demand (evita Chromium serverless).
- **Foto:** `Fran_Avatar.png` (cuadrada, coherente con el Hero) procesada con `sharp` a
  **rectángulo de esquinas redondeadas**.

**Modelo de contenido.** Los **hechos** (fechas, empresas, roles, formación, contacto)
se **reusan** del diccionario; el **texto rico del CV** (summary + bullets con
métricas/keywords ATS, más detallado que la web —deliberadamente escueta—) vive en un
**bloque `cv`** bilingüe nuevo. Fuente del contenido: el CV de Google Docs (más rico que
el sitio) reconciliado con los hechos del sitio. **El mismo bloque `cv` es el origen del
deep-dive por experiencia** (gap del PRD §4/§7/§15, ahora con tareas de diseño y
desarrollo V2/Could): CV y deep-dive son dos presentaciones del mismo contenido.

**Tooling.** Instalado **poppler** (`winget install oschwartz10612.Poppler`) para que el
Read de PDFs del entorno funcione (rasteriza páginas con `pdftoppm`); requiere reiniciar
la sesión para que el PATH surta efecto.

**Contexto.** El CV es el entregable más ligado al propósito del sitio (facilitar el
cambio de trabajo, PRD §1/§2). Se decidió construirlo ya —sin esperar al deep-dive—
autorando el contenido rico una vez, estructurado para reutilizarse: no es trabajo
temporal, es el origen del deep-dive.

**Realizado 2026-07-30.** CV bilingüe (ES + EN) generado y en el repo:
`public/cv/francisco-lopez-cv-es.pdf` y `…-en.pdf`, **2 páginas cada uno**, texto
seleccionable (ATS, verificado con `pdftotext`), enlaces funcionales embebidos
(`mailto`/`tel`/web/LinkedIn). Generador `scripts/cv/generate.tsx` (`@react-pdf/renderer`
+ `tsx`, devDeps), multi-locale: recorre ES/EN y escribe ambos PDFs. Marca aplicada:
lockup logo split en color + nombre en una línea, fondo hueso de marca `#F7F3EC`
(evaluado vs blanco: coherente con el sistema, tinta a 13,79:1 AAA, la foto oscura
resalta; online-only, sin requisito de impresión), cian como único acento, chip "Exit"
en morado (único uso), avatar redondeado (`sharp` desde `Fran/Fotos/Francisco-Lopez-Avatar.png`
→ `assets/cv/francisco-avatar-rounded.png`). Fuentes de marca woff (Bricolage 600, Inter
400/600) vía `Font.register`; la flecha "→" se evitó (fuera del subset) usando lenguaje
natural.

**Refinamiento sobre la ubicación del contenido.** El texto rico vive en
`scripts/cv/content.{es,en}.ts` (forma compartida en `types.ts`; **ES fuente de verdad,
EN revisado contra el ES no literal, D20**), *no* en el bloque `cv` del diccionario i18n
todavía. Motivo: el único consumidor hoy es el generador offline (co-ubicado en
`scripts/cv/`); meterlo en el diccionario runtime cargaría ~8 KB por render del sitio sin
consumidor. **El pliegue al diccionario se hace cuando exista el deep-dive por experiencia**
(V2/Could) —su consumidor runtime—, que es lo que justifica esa ubicación. Sigue siendo
fuente única (un módulo por locale) y sigue siendo el origen del deep-dive.

**Cableado por locale.** `lib/i18n/config.ts` → `cvPath(lang)`
(`/cv/francisco-lopez-cv-${lang}.pdf`), **fuente única de la ruta** (client/edge-safe, sin
`server-only`). El **Nav (menú) deriva su propio enlace** del `lang` que ya recibe, así que
las páginas ya **no** le pasan `cvHref`; solo el `home` referencia `cvPath`, para los otros
dos puntos del CV que no son el menú (CTA de Trayectoria y Contacto). Reemplaza al `CV_HREF`
fijo a `-es` que estaba **duplicado como string en las 4 páginas** (home, brand-kit,
design-system, cookies) —justo el riesgo de divergencia que se evita al centralizarlo—.

**Ajustes de contenido validados (2026-07-30).** Cabecera → Senior Product Manager;
TheTool → "Cofounder & Product"; Searchmedia → Increnta; Sesame HR nombrado; ARPU fuera
de INDYA (sin cifra); reporting por rol como línea de meta (Emendu: miembro del equipo de
liderazgo —Dirección, Operaciones, Tech & Finanzas—; KUOTIP: cofundador junto a CEO y CTO;
INDYA: CPO y cofundador; Freepik: Head of Product; TheTool: 1 de 4 socios; PICKASO sin
línea, no aportada); CTO→Tech Lead unificado en Emendu; hub de tools de Emendu con métrica
(−38% tiempo de gestión operativa); Habilidades y Toolkit en bloques separados; Toolkit =
categorías + nombres del sitio (§8.4), sin descripción.

**Escalabilidad — single-source de hechos + tooling (2026-07-30).** Para que un
futuro cambio de carrera (nuevo trabajo, toolkit, formación) no obligue a recordar
especificaciones ni a duplicar datos, se separó el CV en dos capas:
- **Hechos** (periodos, roles, formación, toolkit) → **se leen del diccionario i18n**
  (`scripts/cv/facts.ts`), no se autoran en el CV. El CV **EN hereda los hechos ya
  traducidos** de `en.json` (periodos "Present", formación en inglés…). Con esto web y
  CV no pueden divergir en los hechos. Efecto colateral (buscado): el CV EN se alineó a
  la web en dos strings que tenía distintos (ESIC "Commercial Management & Marketing",
  "Design & prototyping"). El join CV↔diccionario es por `company` (por prefijo, cubre
  "Ontecnia (Malavida…)"); si no encuentra match, **lanza error** en generación (mejor
  fallar que un CV incoherente).
- **Texto rico** (summary, bullets, métricas, reporting, context, skills, milestones,
  ui, contacto) → sigue autorado en `scripts/cv/content.{es,en}.ts` (ES fuente, EN no
  literal). Es lo irreducible del CV y el origen del deep-dive. *(Reemplaza el
  "refinamiento" anterior: ya no es todo el contenido el que está fuera del diccionario,
  solo lo rico; los hechos ya están single-sourced.)*
- **Guard de 2 páginas**: `generate.tsx` cuenta páginas y avisa con ⚠ si algún CV supera
  2 (objetivo PRD §25; 3 se acepta con OK explícito). Deja de depender de la memoria.
- **`npm run cv`** regenera ambos PDFs.
- **Skill `update-cv`** (`.claude/skills/update-cv/SKILL.md`): playbook completo del
  flujo (qué editar según el cambio → regenerar → verificar 2 págs → entregar PDF →
  commit/PR/deploy). Es el punto de entrada para no tener que dar especificaciones
  dentro de un año.

**El texto rico se muda a `content/cv/` — 2026-08-10.** Llegó el consumidor runtime que
el «refinamiento» de arriba estaba esperando (el deep-dive por experiencia, primer sprint
de V2) y **la respuesta no es la que aquel párrafo daba**: no se pliega al diccionario.
`content.{es,en}.ts` y `types.ts` pasan de `scripts/cv/` a **`content/cv/`**; `facts.ts` y
`generate.tsx` se quedan en `scripts/` y leen de la nueva ubicación.

- **Por qué salir de `scripts/`:** `app/` no puede importar de ahí. `scripts/` es
  herramienta de build (se ejecuta con `tsx`, lee del disco con `node:fs`, escribe PDFs);
  el contenido rico, en cambio, es **contenido de la app** desde el momento en que una
  página lo renderiza. Co-ubicarlo con su único consumidor era correcto mientras ese
  consumidor fuera offline; con dos consumidores de naturaleza distinta, la ubicación la
  manda el dato, no la herramienta.
- **Por qué NO al diccionario**, que era el plan escrito: el diccionario se quedó **solo
  con el copy de la interfaz** al fijarse D38, y su carga es todo-o-nada (el `import()`
  dinámico de `dictionaries.ts` trae el JSON entero, no la rama que se usa). Meter ahí
  ~8 KB de texto rico lo pagarían las páginas que no lo usan — el mismo motivo que lo
  mantuvo fuera en julio, que no ha cambiado por tener consumidor.
- **Lo que no se toca:** `company` sigue siendo la clave de unión con el diccionario y el
  join sigue lanzando error si no encuentra match. El PDF regenerado sale byte a byte del
  mismo tamaño (470.463 / 469.412) — solo cambia la fecha de creación que embebe
  `@react-pdf/renderer`, así que los PDF del repo no se recommitean.

## D23 · Copy con énfasis inline en el diccionario vía render de markup ligero — 2026-08-01
**Decisión.** El copy que necesita **negrita, cursiva o enlaces embebidos** sigue viviendo
como **strings en el diccionario i18n** (no como JSX hardcodeado ni HTML), con una
convención de markup mínima —`**negrita**`, `*cursiva*`, `[texto](url)`— que un pequeño
render (`Rich`, hoy en `components/site/sobre-mi.tsx`) parsea a nodos React. Enlaces
`http(s)` → `target="_blank" rel="noopener noreferrer"`; los enlaces de contenido en cian
(`primary`, regla de BRAND). Plano, sin anidamiento, que es lo que la página necesita.

**Contexto.** «Sobre mí» pide énfasis tipográfico y un enlace al *Libro rojo de la
publicidad* dentro de la prosa. Meter ese formato como JSX rompería "cero strings
hardcodeados" (D11) —el texto dejaría de estar en el diccionario, fuente de verdad ES→EN—,
y guardar HTML en el JSON abriría la puerta a inyección y a `dangerouslySetInnerHTML`. El
markup ligero mantiene el copy en el diccionario, tipado y revisable ES↔EN (D20), y el
render controla el estilo. Si otra sección lo necesita, se promueve `Rich` a un módulo
compartido (`lib/` o `components/site/`); hoy vive co-ubicado con su único consumidor.

**Promovido 2026-08-02.** `Rich` se movió a `components/site/rich.tsx` (módulo compartido)
*—y de ahí a `components/ui/rich.tsx` el 2026-08-09, al fijarse la frontera `ui/`↔`site/`
de D36: no sabe nada del contenido, solo renderiza el markup que le pasen—*
al aparecer un segundo contexto que lo pedía. Curiosidad: la página de Accesibilidad, que
motivó la promoción, acabó **sin** usarlo (su rediseño a tarjetas no lleva markup inline),
así que hoy `sobre-mi.tsx` sigue siendo el único consumidor — pero el helper ya vive en su
sitio para el siguiente que lo necesite, sin duplicar.

## D24 · Página de Accesibilidad: declaración pública verificada, no autoevaluación — 2026-08-02
**Decisión.** La página de Accesibilidad es la **declaración pública de conformidad** del
sitio, y **solo declara lo que está medido**: WCAG 2.2 **AA cumplido** + sistema de color
en **AAA** (con cifras de contraste reales), las 8 medidas del checklist con su criterio
WCAG, las herramientas de verificación (axe/Lighthouse) y el canal para **reportar una
barrera**. La cifra/fecha de conformidad se fija **tras el QA de accesibilidad**, nunca de
memoria. Es el contrapunto público del criterio interno de la sección 08 del Design System
(la frontera que anticipaba D21). Visualmente es **hermana** de Brand Kit / Design System
(hero + fila de datos, secciones numeradas, encabezado a la izquierda y contenido a ancho
completo), no una página de prosa a media columna (D21/D1: reusar el sistema).

**Metodología de verificación (estándar del proyecto, afinado).** El gate de a11y es
**axe-core en claro y oscuro** + **Lighthouse** sobre **build de producción** (D8/D11/D13),
no sobre `next dev`. Registrado a raíz de esta sesión:
- **axe es la autoridad**; WAVE sirve como *spot-check* complementario (aporta señales que
  axe no da, p. ej. «empty form label»), pero sus avisos se reconcilian contra axe, no se
  aplican a ciegas.
- **WCAG Checker (wcag-checker-app) descartado**: en una web JS-heavy capturó la página de
  error de Next (`__next_error__`) y reportó fallos de esa página, no del sitio. No fiable
  para SPAs/SSR; no se usa.
- **El `is-crawlable` de Lighthouse baja el SEO fuera de producción** (robots pone `noindex`
  en preview/local por D13); es artefacto conocido, en producción da 100. No confundir con
  un defecto.

**Contexto.** El propósito del sitio es demostrar criterio (PRD §1): una página de
accesibilidad que declara AA sin haberlo verificado sería justo lo contrario. La disciplina
—medir en ambos temas, reconciliar herramientas, declarar solo lo verificado— es el
contenido de la página tanto como el texto.

## D25 · Páginas 404/error de marca con `global-not-found` + `global-error` (root layout dinámico) — 2026-08-02
**Decisión.** El 404 y el error boundary de marca se sirven con las convenciones
**globales** de Next —`app/global-not-found.tsx` (flag `experimental.globalNotFound`)
y `app/global-error.tsx`—, no solo con `not-found.tsx`/`error.tsx` anidados bajo
`[lang]`. Ambas globales son **autónomas**: definen su propio `<html>/<body>`, importan
`globals.css` y las fuentes (`next/font`), y fijan el tema con un script inline mínimo
(réplica del ThemeProvider, que aquí no corre). El copy vive en un módulo tipado propio
`lib/i18n/system-messages.ts` (ES fuente + EN, precedente D22), consumido por un shell
presentacional puro `components/site/system-message.tsx` reutilizable en servidor y
cliente. El proxy fija una cabecera `x-locale` que lee `not-found.tsx`/`global-not-found`
(server, sin `params`); el error boundary (cliente) deduce el locale con `usePathname`.
Se mantienen además `app/[lang]/not-found.tsx` y `app/[lang]/error.tsx` (usa el prop
`unstable_retry`, v16.2) para `notFound()`/errores de cliente dentro del layout con tema.

**Contexto — por qué las globales y no solo las anidadas.** El root layout de este sitio
es un **segmento dinámico de nivel superior** (`app/[lang]/layout.tsx`); no hay
`app/layout.tsx`. La propia doc de Next (`not-found.md`, `error.md`) señala este caso
como aquel en el que **no se puede componer un 404/500 consistente** con
`layout.js`+`not-found.js`/`error.js` anidados, y recomienda `global-not-found` /
`global-error`. Verificado empíricamente: una URL desconocida o un throw en SSR se
renderizaban con el shell por defecto de Next (`<html id="__next_error__">`, sin marca)
pese a existir los archivos anidados. Con las globales, el 404 se sirve **con marca en el
propio SSR** (notFound controlado) y el 500 **se recupera a la versión de marca al
hidratar** (un throw durante el streaming SSR emite el fallback por defecto y el error
boundary de cliente toma el relevo). QA: axe 0 violaciones en claro y oscuro (404 y
error), 404 real (HTTP 404) en ES y EN, `<html lang>` correcto por locale.

**Nota.** Carpetas con prefijo `_` son privadas en Next (excluidas del enrutado): un
nombre de ruta de prueba como `__boom` da 404 por convención, no por bug. Detalle menor
pendiente: en `global-error` el `<title>` no siempre sustituye al del documento previo
(cosmético, ruta de 500 poco frecuente).

**Rediseño del 404 con marca (2026-08-02, asimétrico 404 vs error).** Tras verlo,
Francisco pidió darle protagonismo de marca al 404 (no al error). El `global-not-found`
deja de ser minimalista y pasa a ser una página SANA con **Nav + Footer** (salidas
reales, toggle de tema e idioma) envueltos en `ThemeProvider` —que además sustituye al
script de tema manual y hace funcionar el toggle—. El hero es el propio **"404"**: los
dos "4" en Bricolage y el **"0" convertido en el círculo con split** (anillos
cian/morado + aro base, SIN la barra: no es el logo, es el número), con `role="img"
aria-label="404"`. El split **"florece"** al cargar con un keyframe CSS puro
(`split-bloom` sobre `.split-zero > g`, globals.css), no rAF: se descartó la primera
versión con `requestAnimationFrame` porque un tab en segundo plano lo pausa —además CSS
es lo correcto para una animación de entrada— y respeta `prefers-reduced-motion` (split
ya visible, sin interpolar). Componentes: `components/site/split-404.tsx`. La **pantalla
de error (500) se queda minimalista** (SystemMessage, sin Nav/Footer): es una pantalla
de recuperación que no debe depender de la maquinaria que puede haber fallado —la
asimetría es deliberada—. Se evaluó y se **mantuvo el doble split** (Nav + "0") en el
404: poner el logo del Nav en flat solo para esta página era sobreingeniería. QA: axe 0
violaciones claro/oscuro, HTTP 404 real ES/EN. El `[lang]/not-found.tsx` anidado (solo
salta con `notFound()` explícito, hoy inexistente) queda como fallback minimalista.

### Ese fallback costaba el sitio entero en estático — se borra (2026-08-10)

**El párrafo de arriba ya lo decía sin saber lo que costaba:** el `not-found` anidado
«solo salta con `notFound()` explícito, hoy inexistente». Lo que no decía es que, para
saber el locale, leía `headers()` —la única vía documentada, porque
**`not-found` no acepta props**— y **eso volvía dinámico TODO el segmento `[lang]`**. Las
seis páginas del sitio salían como **ƒ (server-rendered on demand)** en el build, teniendo
`generateStaticParams` y sin usar ninguna API dinámica ellas mismas.

Se borra `app/[lang]/not-found.tsx`. Lo captura `global-not-found`, que según la doc «maneja
cualquier URL no coincidente de toda la aplicación» — y que además es **la 404 buena**: la del
hero con el «0» del split, Nav y Footer, frente al `SystemMessage` mínimo que se quedaba
detrás. O sea que la página que se pierde era la peor de las dos.

**Lo verificado, en este orden:**

1. **Causa aislada:** quitando solo la llamada a `headers()`, las seis rutas pasan de `ƒ` a
   `●` prerenderizadas por locale. No es una hipótesis, es un build.
2. **Nada se rompe:** `/ruta-inexistente` y `/en/ruta-inexistente` siguen devolviendo **HTTP
   404** con `<html lang>` correcto, el titular en su idioma, el enlace de salto de D46 y la
   404 rica con Nav y Footer.
3. **Y el HTML mejora.** El gate de D45 comparando el build estático contra el dinámico da un
   solo cambio, y a favor: **24 `<link rel="preload" as="font">` que el dinámico no emitía**,
   dos por página. Estático deja a Next resolver las fuentes en build.

**Lo que queda como riesgo aceptado:** un `notFound()` lanzado desde dentro de `[lang]` —hoy
solo el guardián defensivo `if (!isLocale(lang))`, inalcanzable porque el proxy reescribe
cualquier prefijo desconocido— caería en el 404 por defecto de Next en vez de en el de marca.
Cambiar eso costaba el estático de las seis páginas, que es lo que se estaba pagando.

**Y de paso corrige el argumento de la tarea que lo destapó (P46, partir el diccionario):** con
las páginas prerenderizadas, parsear el diccionario entero pasa a ser un coste de **build**, no
de arranque en frío. A P46 le quedan sus razones buenas —el contenido se multiplica con las
siete páginas del deep-dive y editar copy en 1.580 líneas invita a conflictos—, que no son de
rendimiento.

## D26 · Cabeceras de seguridad Fase 1; CSP «A+ barato» (Fase 2) implementada, estricta diferida — 2026-08-02
**Decisión.** `next.config.ts` sirve, en todas las rutas (`/:path*`), un conjunto de
cabeceras de seguridad **triviales y sin riesgo** (Fase 1): `X-Content-Type-Options:
nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`,
`Permissions-Policy: camera=(), microphone=(), geolocation=()` y `Strict-Transport-
Security: max-age=63072000; includeSubDomains`. El **HSTS va sin `preload`** a propósito:
entrar en la lista de preload es difícil de revertir; se puede añadir más adelante.

**La CSP (Content-Security-Policy) se difiere**, en dos escalones:
- **«A+ barato»** (tarea propia, baja prioridad P37.9): allowlist de orígenes conocidos +
  las directivas gratis y sin riesgo (`object-src 'none'`, `base-uri 'self'`,
  `form-action 'self'`, `frame-ancestors 'none'`), manteniendo `'unsafe-inline'` en
  `script-src`. Sube securityheaders.com de **A** a **A+** con protección real de bajo
  coste, pero el `script-src` sigue flojo (honesto: eso es más insignia que protección).
- **CSP estricta** (nonces por request, sin `'unsafe-inline'`): protección de XSS de
  verdad, pero fuerza render dinámico (peaje de perf sobre el estático/SSG) y arriesga
  romper GTM/GA4 + los scripts inline (consent-init, JSON-LD). Se retoma **cuando exista
  contenido dinámico/con input**, en particular la IA conversacional de V3.

**Contexto.** El beneficio *práctico* de la CSP hoy es casi nulo: portfolio estático, sin
auth, sin formularios, sin input no confiable al DOM (el único `dangerouslySetInnerHTML`
es JSON-LD con datos estáticos del diccionario) → no hay vector de XSS. La Fase 1 es el
hueco más barato de cerrar y coherente con el argumento de rigor (PRD §1); la CSP estricta
sería sobreingeniería para el estado actual. Decisión de alcance tomada con Francisco tras
ver que securityheaders.com daba **A** con el único aviso siendo la CSP ausente.

**Implementada la Fase 2 «A+ barato» (2026-08-02, P37.9).** La CSP ya se **sirve en
producción** (`next.config.ts`): las cuatro directivas gratis y sin riesgo (`object-src
'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'none'`) + allowlist de
GTM/GA4 en `script-src`/`connect-src`/`img-src`/`frame-src`, manteniendo `'unsafe-inline'`
en `script-src` (sigue siendo insignia, no protección de XSS fuerte). Detalles de
implementación:
- **Solo en builds de producción** (`process.env.NODE_ENV === "production"`, que incluye el
  preview de Vercel). En `next dev` se **omite**: el HMR usa `eval` y `'unsafe-eval'` no
  debe entrar en la política real. Ventaja: el preview de Vercel sí la sirve, así que los
  recursos propios del sitio se verifican contra la CSP antes del merge.
- **Rollout enforce + verificación en prod** (acordado con Francisco, resuelve el «a debatir»
  de Report-Only): GTM/GA4 solo cargan en producción, así que su allowlist no se puede probar
  en el preview. Se desplegó enforcing con el allowlist documentado de Google y se verificó
  **en vivo**: cabecera servida, `gtm.js`/`gtag/js` cargan (200), el beacon de GA4 sale con
  `gcs=G111` (consentimiento) y la consola queda **sin ninguna violación CSP** en home y
  página interna (local + preview + prod).
- **La CSP estricta (nonces) sigue diferida a V4** con la IA conversacional, o antes si
  Contacto ampliada incorpora un endpoint externo. *(Decía «V3» hasta el 2026-08-22: la
  versión se movió en `PRD-Live.md` §5 y aquí no, así que la misma decisión estaba fechada
  en dos versiones distintas en tres sitios. La fecha la fija el PRD, que es donde vive el
  alcance por versión; aquí y en `next.config.ts` va el puntero.)*

**La cifra de arriba (A+) ya no es cierta (comprobado en vivo, 2026-08-22).** Escrito el
artículo «Cómo se ha creado esta página» (P60), volver a medir securityheaders.com dio **A**,
capado por el mismo aviso de `unsafe-inline` que esta entrada ya documentaba como conocido —no
es una regresión de código, es que el criterio de scoring de la herramienta cambió entre
2026-08-02 y hoy. El artículo cita en su lugar el HTTP Observatory de Mozilla (B+, 80/100,
pierde exactamente los 20 puntos de la política de contenido), con enlace a la comprobación en
vivo en vez de una cifra escrita. El hueco real sigue siendo el mismo que esta entrada ya
señalaba —`unsafe-inline` en `script-src`— y ahora tiene tarea propia, máxima prioridad del
sprint «Footer y contacto» (P64.5), en vez de quedar diferido sin fecha a «cuando haga falta».

**Definida P64.5, y el resultado es que la condición de disparo no ha cambiado
(2026-08-23).** La tarea entró como «Necesita definición» con una pregunta concreta —¿el
render dinámico afectaría a algunas rutas o a las 26 variantes?— y con el supuesto de que
lo que faltaba era estimar. Medido sobre el build real y sobre la fuente del propio
validador, lo que faltaba era saber que **no hay media tinta**: o las 26 dinámicas, o
ninguna.

- **Son las 26, y no por reparto de rutas.** Las trece páginas × dos locales llevan las
  mismas tres familias de script inline: el init de tema de next-themes, `consent-init` y
  el **payload RSC de Next**. Ninguna puede quedarse estática bajo la política estricta,
  porque su HTML ya prerenderizado contiene inline scripts que necesitarían el nonce. La
  doc del paquete (`01-app/02-guides/content-security-policy.md`, Next 16.3.1) lo dice sin
  matices: *«all pages must be dynamically rendered»*, SSG e ISR desactivados, sin caché de
  CDN, PPR incompatible.
- **Los hashes no son la puerta de atrás.** `es.html` tiene **7 scripts inline y 5 son el
  payload RSC** (`self.__next_f.push`, ~65 KB), con contenido distinto por página y por
  build. `headers()` de `next.config.ts` se evalúa **antes** de que ese HTML exista, así
  que un hash de build es imposible por construcción, no por esfuerzo. (Build en dos
  pasadas escribiendo `vercel.json`: considerado y descartado por fragilidad — cualquier
  cambio de copy invalidaría los hashes de la pasada anterior.)
  **Medido el 2026-08-24, y es peor que frágil: no hace falta ni cambiar el copy.** Dos
  builds seguidos del mismo commit, sin tocar una coma, y **0 de 28 variantes** repiten sus
  firmas: dentro de esos scripts van los nombres de chunk que el compilador renombra en
  cada pasada. En `en/cookies.html` sobreviven 3 de 4 hashes y el cuarto no, que es el que
  lleva el manifiesto dentro. Y una firma que no coincide no degrada, **bloquea** el script.
  Por tamaño sí cabía (126 hashes únicos, 809 B en la peor ruta), así que el camino no lo
  cierra el coste: lo cierra que el HTML de Next no sea reproducible.
- **`experimental.sri` tampoco cierra el hueco.** Existe en 16.3.1 y pone `integrity` en
  los scripts con `src` (12 en la home), pero **SRI no aplica a inline**: `'unsafe-inline'`
  se queda y la nota no se mueve. Sirve para otra cosa, no para esto.
- **El premio sí es el A+ limpio.** Leído el grader del HTTP Observatory en su fuente
  (`mdn-http-observatory`, `src/grader/charts.js`): `csp-implemented-with-unsafe-inline`
  vale **−20** —que es exactamente el 80/100 medido— y
  `csp-implemented-with-unsafe-inline-in-style-src-only` vale **0**. Es decir: **los 1169
  atributos `style=` inline del sitio NO capan la nota**. Con nonce en `script-src`, el
  techo es 100 = A+, aunque `style-src` conserve `'unsafe-inline'`. Se anota porque la
  hipótesis de partida era la contraria y habría hecho descartar la tarea por un motivo
  falso (regla 3 de `BRAND.md` §Cómo se escribe una regla: valida el metro antes de
  creerte el hallazgo).

**Lo que decide, entonces, no es la viabilidad sino el otro platillo.** `PRD-Live.md` §5
exige PageSpeed **>90 en móvil como criterio de aceptación** y hoy va 94-96: de cuatro a
seis puntos de margen para absorber el TTFB de renderizar en cada request lo que hoy sirve
la CDN. Y el beneficio de seguridad sigue siendo el que esta entrada declaró en 2026-08-02:
ningún `dangerouslySetInnerHTML` recibe entrada no confiable (JSON-LD propio, SVG propio,
`consent-init` propio), sin auth, sin formularios, sin contenido de usuario.

**Y hay una trampa de medición que conviene saber antes de intentarlo:** el peaje de
rendimiento y la rotura de GTM **solo se pueden medir en producción**. La analítica está
capada a producción (D13) y `npm run psi` corre contra producción, así que el preview no
puede contestar ninguna de las dos. La sonda correcta, si algún día se quiere el número
sin arriesgar el sitio, es servir la política estricta como **`Report-Only` junto a la
enforced actual**: el render dinámico se paga igual —o sea, `psi` mide el peaje de verdad—
mientras nada se rompe.

**Decisión (Francisco, 2026-08-23): no se ejecuta todavía; queda bloqueada por P65.** No es
un aplazamiento nuevo: es **el disparador que esta entrada y `PRD-Live.md` §5 ya habían
fijado** —«o antes si Contacto ampliada incorpora un endpoint externo»— y P65 está a un
puesto de distancia. Si la investigación de Contacto concluye que hay formulario con
endpoint, la CSP estricta deja de ser insignia y se resuelve **dentro de P67**, no aparte;
si concluye que no, se va con la IA conversacional de V4. Por eso P64.5 se renumera detrás
de P65 en el tablero: estaba por delante de la tarea que la desbloquea.

**Reafirmada el 2026-08-24, y cambia el MOTIVO, no la decisión (P68.496).** Hasta hoy estaba
aplazada porque su disparador no ocurrió (Contacto no trajo endpoint externo, D95); ahora lo
está por **coste medido**, que es mucho más difícil de reabrir dentro de un mes. Con el
camino de hashes cerrado arriba, solo queda el nonce, y el nonce cuesta el prerenderizado de
las catorce páginas. Un −20 que mide una **ausencia** (la política no previene XSS por
construcción) no vale la nota de velocidad que sostiene ese prerenderizado, en un sitio sin
sesión cuya única entrada ajena ya llega saneada. **Lo que V4 hereda de aquí:** la CSP
estricta de la IA conversacional trae render dinámico dentro, y eso se planifica, no se
descubre.

## D27 · Higiene de dependencias: sharp override, shadcn a devDeps, Dependabot — 2026-08-02
**Decisión.** Cierre de la deuda de dependencias de la etapa Cimientos (P30.5 + P37.72),
más el escaneo automatizado que la mantiene a raya:
- **sharp forzado a `^0.35.3` con `overrides` en `package.json`.** Los CVEs de libvips
  (CVE-2026-33327/33328/35590/35591, *high*) se parchean en sharp 0.35.0+. sharp entra como
  dependencia **opcional de Next**, y todas las `next@16.2.x` (incl. la última) declaran
  `sharp ^0.34.5` = `>=0.34.5 <0.35.0` → la propia rama vulnerable; un bump de Next no basta.
  El `overrides` fuerza el sharp parcheado en todo el árbol sin subir Next. **Revisar el
  override al subir a un Next que ya traiga sharp ≥0.35** (16.3+), para no dejar un pin
  manual olvidado. Binding nativo (Windows) verificado tras el bump.
- **shadcn movido de `dependencies` a `devDependencies`** (no se pudo *quitar*, la otra
  opción de la tarea). Aunque el paquete `shadcn` es un CLI que no se importa en JS, **sí se
  usa en build**: `app/globals.css` hace `@import "shadcn/tailwind.css"` (keyframes +
  `@custom-variant` de los componentes base-ui). Eliminarlo rompe el build; su sitio correcto
  es devDependencies —como `tailwindcss`/`@tailwindcss/postcss`/`typescript`, que Vercel ya
  instala al construir—. Efecto: saca su cadena transitiva (`@modelcontextprotocol/sdk`,
  `@hono/node-server`, `fast-uri`) del árbol de **producción** (`npm audit --omit=dev` más
  limpio).
- **Dependabot** (`.github/dependabot.yml`) como escaneo de dependencias automatizado: PRs
  semanales para **npm** + **github-actions**, ecosistema Next agrupado, prefijos alineados a
  Conventional Commits (D12). Requiere activar *Dependabot alerts* + *security updates* en los
  ajustes del repo (toggle de GitHub; los *version updates* los habilita el yml). Sustituye a
  "acordarse de correr `npm audit`".

**Alcance / lo que queda.** Se parcheó **solo sharp** de los *high* (decisión de Francisco).
Los HIGH propios de **Next** (SSRF/DoS/bypass de proxy con locale) + **postcss** se aplazaron:
los recogerá Dependabot con el bump de Next (ya empezó a abrir PRs por su cuenta). `brace-
expansion` (high, dev-only, toolchain de ESLint) también queda para Dependabot.

**Contexto.** Coherente con el argumento de rigor del sitio (PRD §1) sin sobre-parchear: el
riesgo *práctico* de sharp hoy es bajo (solo procesa imágenes propias, cero input no
confiable), pero es un *high* barato de cerrar, y el escaneo automatizado evita que la deuda
de deps vuelva a acumularse en silencio.

## D28 · Arquitectura de contexto: reglas `@`-importadas vs referencia a demanda — 2026-08-03
**Decisión.** Para bajar el coste de tokens por sesión, `CLAUDE.md` solo `@`-importa las
**reglas activas**; el registro histórico y el detalle enciclopédico se consultan **a
demanda** (Read/Grep):
- **`DECISIONS.md` se de-importa** de `CLAUDE.md` (era `@`-importado). En su lugar, `CLAUDE.md`
  lleva un **índice de una línea por D-entry** (~400 tok en vez de ~11.800) que preserva la
  señal «esta decisión existe» para saber cuándo hacerle `grep`. Convención: antes de tocar un
  subsistema con ADR, `grep`/Read de su D-entry. `DECISIONS.md` no cambia de contenido; sigue
  siendo la fuente de verdad en el repo. **Al añadir una D-entry nueva, añadir su línea al
  índice de `CLAUDE.md`.**
- **`BRAND.md` se parte**: el core de reglas (dos capas de color, tipografía, tokens, a11y,
  modo oscuro, regla mínima del split) sigue `@`-importado; la **enciclopedia del logo** (tabla
  de uso, umbrales, proporciones, transición del nav, rationale fechado) pasa a **`BRAND-logo.md`**
  (nuevo, no importado, consultado al tocar el logo).
- **Tabla de modelo por tarea** en `CLAUDE.md` (Opus = criterio/diseño; Sonnet = mecánico/docs/
  tablero; Haiku = trivial) + convención de avisar a nivel de bloque, no de micro-tarea.
- **Higiene de sesión** documentada: lecturas dirigidas (`offset`/`limit`, `grep` del D-número),
  una sesión por bloque + `/clear` entre tareas, concisión por defecto, disciplina de alcance.

**Contexto.** Medido: los docs `@`-importados sumaban ~19.300 tok fijos por sesión, con
`DECISIONS.md` (~11.800, append-only) como el 60% y creciendo sin límite — el mismo coste que
**D10** evitó para el PRD, reintroducido en otro archivo. `PRD-Historical.md` (~30.800 tok) ya
hacía lo correcto (no importado). El coste se paga al arrancar cada sesión y al llenar la
ventana de contexto (dispara antes la summarización). El recorte lleva el fijo a ~6.000 tok
**sin perder reglas activas** (las reglas viven en `CLAUDE.md`/`BRAND.md`/`PRD-Live.md`; solo la
*historia/detalle* se mueve a demanda).

**Descartado (evaluado con Francisco).** Indexación MCP (CodeGraph/GitNexus/Obsidian) —
resuelve un problema de código grande que este repo no tiene; Grep/Glob + memoria ya son
indexación-lite. Caveman (estilo telegráfico) — se adopta el principio de concisión, no la
herramienta. Ponytail (gating de alcance) — ya existe como convención (memoria + plan mode).
Las tres son la versión pesada de algo cuya versión ligera ya está en el flujo; añadirlas sería
sobreingeniería a esta escala.

**Tercera aplicación, 2026-08-09 (P37.685): `BRAND.md` → `BRAND.md` + `BRAND-historical.md`.**
Mismo corte que el PRD, y por el mismo motivo. `BRAND.md` era el documento más pesado de los
`@`-importados —**5.954 palabras**, más que `CLAUDE.md` y `PRD-Live.md` juntos— y **la mitad era
arqueología**: diecisiete párrafos fechados de «esto falló antes». Queda en **3.530** (−41%) y el
total precargado en cada arranque baja de ~11.400 a **~9.000** (−21%).

**El riesgo del corte, y cómo se mitigó.** Partir un reglamento puede dejar **una regla viva solo
en el histórico** — y este proyecto ya sufrió la versión simétrica: el drift de cuatro días de
§Jerarquía de hover fue exactamente *un párrafo histórico contradiciendo al vigente*. Se revisó
entrada por entrada y se **subieron a presente** cinco reglas que estaban enterradas en prosa
fechada (la excepción viva de `ContactSecondary`, la del switch con su condición de salida, el
chrome que se aclara al interactuar, el criterio de los dos teñidos y la fórmula del 85% de la
etiqueta neutra). Además se comprobó **mecánicamente**: se extrajeron del documento viejo todas
las frases normativas no fechadas y se buscaron en el nuevo.

**Regla que queda para el siguiente corte de este tipo:** el histórico abre declarando que **no
contiene ninguna regla viva**, y que si algo de allí parece enunciar una que el documento vigente
no tiene, eso es un fallo del corte que se arregla en el vigente — nunca una regla que se aplique
desde el archivo.

**Y un efecto colateral que justifica el corte por sí solo:** al recorrer el documento entero
aparecieron dos defectos estructurales que llevaban meses invisibles porque nadie lo leía de
principio a fin — el **ítem 2 de la regla de dos capas estaba cien líneas por debajo del ítem 1**,
detrás de cuatro secciones de nivel 2, y el método de medición iba numerado 1-4-5-2-3-6.

### Addendum 2026-08-25 — el techo sube por primera vez, y esta entrada no lo cuenta

D69 le puso cifra y guardián a este régimen, y el trinquete se apretó **cinco veces**. El
2026-08-25 **subió**: 12.200 → 12.700, decisión de Francisco en el quinto `method-review`.

**El motivo, en una línea:** el propio guardián define la *holgura de trabajo* —unas 240
palabras, cinco o seis reglas— como la magnitud que hay que sostener, y quedaban **dos**.
Apretar más no era una opción que existiera; las dos reglas que esa misma revisión mandó
escribir cuestan 157 palabras y no habrían cabido.

**El historial completo del techo, con el porqué de cada valor, vive en
`scripts/check-contexto.ts` y solo ahí** — es donde no puede caducar sin que falle algo, y
copiarlo aquí sería la segunda verdad que este proyecto ha cerrado ya por cinco puertas.
Lo que sí queda escrito aquí, porque es de régimen y no de cifra: **la subida es interina y
está atada a P68.5905**, que busca el dato de coste que ninguno de los seis valores del techo
ha tenido nunca. Ninguno salió de medir qué cuesta este contexto; todos, de cuánto ocupa.


## D29 · Superficie de contacto unificada: dato, patrón y jerarquía — 2026-08-03
**Decisión.** El contacto deja de ser tres implementaciones que se parecían y pasa a ser
**una**, en tres capas:
- **Dato → `lib/contact.ts`.** Fuente única de email, teléfono (`tel:` + display) y LinkedIn
  (url + display). Antes el email estaba hardcodeado en 4 sitios, el teléfono en 2 y LinkedIn
  en 4 — y `lib/site.ts` ya exportaba `LINKEDIN_URL`, pero footer y contacto lo **ignoraban
  redefiniéndolo**. Misma disciplina que los tokens (D4) y `cvPath` (D22). `LINKEDIN_URL` se
  muda de `lib/site.ts` a `lib/contact.ts`.
- **Patrón → `components/site/contact-actions.tsx`.** Un componente compartido para las tres
  superficies: la franja de cierre de la home, el cierre de Sobre mí y el «reportar una
  barrera» de Accesibilidad. Antes divergían: lista de 4 filas / enlace a `/#contacto` /
  outline con el email entero dentro del botón.
- **Jerarquía → el email es el único botón SÓLIDO del sitio**, un escalón por encima del
  outline de Descargar CV (Trayectoria). Los clics de contacto son la métrica primaria
  (PRD §7) y hasta ahora nada señalaba cuál era *la* acción: la lista de filas trataba email
  y CV como iguales.

**Consecuencias.** (1) El tracking de clics se cablea en **un** punto y no en tres — por eso
esta tarea se hizo ANTES que la instrumentación, no después. (2) `Sobre mí` deja de mandar al
usuario de vuelta a `/#contacto`: la acción vive en la propia página. (3) La dirección de
email bajo el botón se muestra **solo en Accesibilidad** (`showAddress`): junto a un botón que
ya dice «Escríbeme» es redundante, y donde hay teléfono y LinkedIn al lado tampoco hace de
plan B; en Accesibilidad el bloque *es* el canal de reporte y no hay otro camino.

**Copy.** El diccionario gana `emailCta` y `cvCta`; se retiran `emailLabel`, `cvLabel` y
`cvValue`, que morían con la lista de filas.

## D30 (generalizada por D39) · Texto atenuado sobre fondos que no son `--background` — 2026-08-03

> **GENERALIZADA POR [D39](#d39--el-atenuado-lo-resuelve-la-superficie-no-el-punto-de-uso--2026-08-09) (2026-08-09).** La regla de aquí es correcta y sigue vigente;
> lo que cambia es **quién la aplica**. Dejó de escribirse en el punto de uso —el
> `--contact-dim` de abajo ya no existe— y la resuelve el token `--surface-dim`, que cada
> superficie redefine. Motivo: esta decisión nunca llegó a `--card`, la superficie
> no-`--background` más común del sitio, y ahí el par daba 6,40:1 en oscuro. **Una regla que
> hay que acordarse de aplicar es una regla que se incumple.**

**Decisión.** `--muted-foreground` (y cualquier atenuado calibrado contra `--background`) **no
se usa sobre una banda o tarjeta de color**. Sobre un fondo distinto hay que **recalcular**, y
el patrón por defecto es **mezclar el texto con el propio fondo** en vez de tirar del token:

```css
/* Forma original (2026-08-03). Hoy la escribe la superficie, no el call site — D39. */
:root            { --contact-dim: var(--muted-foreground); }
.contact-band    { --contact-dim: color-mix(in srgb, var(--foreground) 85%, var(--muted)); }
```

**Por qué.** `--muted-foreground` está afinado contra `--background` (AAA: 7,10:1 claro /
7,12:1 oscuro). Sobre la franja de contacto (fondo `--muted`) cae a **6,44:1 / 5,56:1** — AA
suelto, en contra de lo que afirma `BRAND.md` y de lo que **publica** la página de
Accesibilidad. No es cosa del color de banda elegido: con `card` tampoco se salva (6,37:1 en
oscuro). Al 85% de mezcla con la banda da **8,17:1 / 9,17:1**, AAA en ambos temas; al 80% ya se
quedaba en 6,99:1 en claro.

**Regla general que generaliza.** Es el mismo fallo que el de los pasteles: **un valor fijo
sobre un fondo cuyo color efectivo cambia con el tema**. Al construir cualquier banda:
1. Un solo nivel de atenuado; la jerarquía la hace el **tamaño/peso**, no el color.
2. Medir **componiendo el alfa sobre el fondo real** (un `color-mix` con `transparent` produce
   alfa: leerlo sin componer da una cifra falsa y optimista).
3. Medir con **carga limpia por tema**. Conmutar el tema en caliente da falsos positivos: las
   transiciones de `background-color` dejan texto de un tema sobre fondo del otro.
4. No dejar el margen justo. El umbral no es el objetivo (ver el cian de 2026-07-22).

**Estados interactivos.** El hover del botón sólido **no** se hace con `opacity` ni
`bg-primary/90`, que bajan el contraste al mezclar con el fondo. Se mezcla hacia
`--foreground`, que en ambos temas se aleja de `--primary-foreground` (en claro oscurece bajo
texto hueso, en oscuro aclara bajo texto carbón): el contraste **sube** (7,93→8,64 claro,
8,36→8,92 oscuro — cifras del cian corregido en P37.598 y re-medidas en P37.5985; el 7,28
original de esta entrada era correcto para el cian de entonces, y resultó ser **la única cifra
publicada del cian que sí cuadraba con lo que se pintaba**: el 7,44 de `BRAND.md` era el
equivocado).

**La mezcla del 12% se generaliza (P37.5985).** El mismo gesto resuelve el hover del
`toggle-primary` apagado, que era la última excepción AAA del sistema (6,35 claro / 6,98
oscuro): allí el cian no está en el relleno sino en el **texto**, así que lo que se mezcla es
el texto, y con el velo al 8% da **7,21 / 7,80**. La lección que generaliza no es el número
sino la dirección: cuando un par no llega, **mover el elemento que lleva el cian hacia
`--foreground`** sube el contraste en los dos temas a la vez, mientras que retocar el alfa del
velo tiene techo asintótico — un velo del propio color nunca puede subir el contraste de ese
color. Corolario que se cumplió al medir: el velo **neutro** (`muted`), que parecía la vía
natural, es la peor de todas (6,76 / 6,57).

**Aplicado retroactivamente.** La regla destapó un fallo **preexistente** en la banda de «Más
allá del PM»: eyebrow al 58% → **4,07:1 en oscuro**, por debajo de AA. Corregido al 80%
(9,24:1 / 8,31:1) en la misma sesión, porque contradecía dos afirmaciones públicas del sitio.

## D31 · Tracking de clics mailto/tel vía dataLayer (P30) — 2026-08-03
**Decisión.** `lib/analytics.ts` (nuevo) expone `trackContactClick("email"|"phone")`, que
empuja `{event:"contact_click", contact_method}` al `dataLayer` — un objeto plano, no el
patrón `gtag(...)`/`arguments` de `consent.ts` (D17), porque esto es un evento de negocio
propio, no una llamada a la API de Consent Mode que gtag.js sepa interpretar. Cableado en los
dos anchors compartidos de `contact-actions.tsx` (D29): `mailto:` en `EmailCta`, `tel:` en
`ContactSecondary`. Como D29 ya unificó las tres superficies en ese componente, la
instrumentación vive en un solo sitio. La descarga de CV no necesitó código: GA4 ya la captura
de fábrica como `file_download` (D19).

**Consecuencia arquitectónica.** `contact-actions.tsx` pasa a `"use client"` — dejó de ser
un Server Component puro porque ahora tiene interactividad real (el `onClick` de tracking),
mismo criterio que ya aplicaba a `nav.tsx` (D7: islas donde hace falta, no en todo lo demás).

**Aprendizaje operativo — dónde se puede probar con GTM Vista previa.** El contenedor de GTM
solo se carga si `VERCEL_ENV === "production"` (D13/D17): **nunca** en local ni en un preview
de Vercel. La Vista previa/Debug de GTM depende de que el contenedor esté inyectado en la
página, así que **solo funciona contra producción** — probarla contra un preview de rama no
sirve (el contenedor ni siquiera está ahí) y no es un fallo de configuración. Es seguro probar
en vivo sin afectar datos reales: la Vista previa inyecta el workspace en *borrador* solo en la
sesión del navegador conectado, y no escribe en GA4 con normalidad hasta publicar el contenedor.

**Verificación.** PR #66 (merge a `main`) → confirmado en `franciscolopez.es` que el `dataLayer`
recibe el evento y `window.google_tag_manager` existe. GTM: variable `DLV - contact_method`,
activador `CE - contact_click` (Custom Event), etiqueta `GA4 Event - contact_click`, publicada.
GA4: dimensión personalizada `Contact method` (ámbito Evento, parámetro `contact_method`)
creada. Verificado con hits reales en DebugView antes de dar la tarea por cerrada.

## D32 · CSP con allowlist para Microsoft Clarity; `c.bing.com` fuera a propósito (P37) — 2026-08-03
**Decisión.** La CSP «A+ barato» (D26) amplía su allowlist con `https://www.clarity.ms` y
`https://*.clarity.ms` en **tres** directivas — `script-src` (el tag), `connect-src`
(las llamadas de la sesión) e **`img-src`** (el beacon `c.gif`) — porque Clarity, a
diferencia de GA4, usa las tres vías a la vez. El primer intento solo cubrió
script-src/connect-src (PR #68) y PageSpeed siguió marcando aviso; el beacon de imagen
necesitó un segundo PR (#69). Mismo patrón que GA4/GTM en D26, sin introducir dominios
nuevos de riesgo (`*.clarity.ms` es tan amplio como ya lo era `*.google-analytics.com`).

**`c.bing.com` (Microsoft Ads/UET) queda deliberadamente fuera del allowlist.** Clarity
trae una integración nativa con Microsoft Advertising que, si está activada en el
proyecto (clarity.microsoft.com → Configuración), dispara un píxel a `c.bing.com/c.gif`
sin que exista ninguna etiqueta de Bing en GTM — confirmado revisando el listado de
etiquetas del contenedor (solo GA4, el evento de contacto y Clarity). Francisco no
quería ese tracking cruzado con publicidad y desactivó la integración en el propio
dashboard de Clarity, no en GTM ni en el repo. La CSP se deja bloqueando `c.bing.com`
a propósito: si la integración se reactivase por error (p. ej. al reconectar el
proyecto), el bloqueo lo delata de inmediato en PageSpeed en vez de pasar desapercibido.

**El bug real no estaba en la CSP.** Con la CSP corregida, una prueba en vivo (borrar
`localStorage` de consentimiento y recargar) mostró que Clarity se disparaba igual con
`analytics_storage: denied` — el Consent Mode v2 del código (D17) es correcto, pero la
etiqueta "Microsoft Clarity - Official" en GTM tenía su **Configuración de
consentimiento (BETA)** en "Sin establecer". Se corrige en GTM (no en el repo): exigir
`analytics_storage` granted como comprobación adicional. Verificado de nuevo en vivo:
denegado → cero peticiones a Clarity; concedido → carga con `200`. Queda como
recordatorio operativo: una integración añadida vía GTM puede tener su propio gate de
consentimiento *independiente* del Consent Mode global, y hay que revisarlo por
etiqueta, no asumir que heredarlo es automático.

**Verificación.** PR #68 + #69 (CSP) y PR #70 (documentación de cookies) mergeados a
`main`. Confirmado en `franciscolopez.es`: sin violaciones de CSP, Clarity gateado a
consentimiento, PageSpeed Prácticas recomendadas en 100.

## D33 · `/llms.txt` — un solo archivo, en español, generado desde el diccionario (P37.5) — 2026-08-03
**Decisión.** Se implementa `app/llms.txt/route.ts` (Route Handler, patrón `app/rss.xml/route.ts`
de la propia documentación de Next: carpeta con punto literal en el nombre → sirve en
`/llms.txt`). El `proxy.ts` ya excluye cualquier ruta con extensión de archivo (D3), así
que no necesita gating de locale ni tocar el matcher. `export const dynamic =
"force-static"` porque el contenido no depende de la request — se prerenderiza en build,
igual que `sitemap.ts`.

**Un solo archivo, no uno por locale.** llms.txt (convención emergente de llmstxt.org, no
un estándar ratificado) no tiene mecanismo de negociación de idioma como el hreflang del
sitemap. Un único `/llms.txt` en español —el locale por defecto sin prefijo (D2)— con
enlaces `(EN)` a la versión inglesa de cada página evita la complejidad de rutas
por-locale para una convención de adopción incierta.

**Generado desde la fuente, no copiado a mano.** El contenido (títulos/descripciones de
página, párrafo de posicionamiento, trayectoria de producto, contacto) se lee
directamente de `es.json` (incluido `contacto.intro`, el mismo texto de cierre que usa
la franja-CTA de la home — ver D29), `lib/contact.ts`, `lib/site.ts` y
`lib/i18n/config.ts` (`cvPath`) — la única prosa propia del archivo es el conector del
exit de TheTool. Así el archivo no puede divergir del contenido real de la web sin que
también cambie la propia web (mismo objetivo que motivó la tarea: evitar una copia a
mano que se desincroniza). Ajustado en revisión: la primera versión parafraseaba el
posicionamiento en vez de reutilizar `contacto.intro` — dos redacciones del mismo mensaje
que podían divergir con el tiempo.

**Alcance.** Solo la trayectoria de Producto (no Marketing & Growth ni Formación) y los
hitos se resumen como el hecho del exit, no la tabla completa — es un resumen curado
para LLMs, no un volcado del CV; el CV en PDF (enlazado) cubre el detalle completo.

## D34 · Clases de componente en `globals.css` van sin `@layer` en este proyecto (Tailwind v4) — 2026-08-04

**Decisión.** Las clases CSS reutilizables que se añaden a mano en `app/globals.css`
(`.contact-cta`, `.link-content`, `.link-chrome`…) se escriben **sin** envolver en
`@layer components { }`. Van como reglas normales, igual que `.contact-cta` ya hacía
antes de esta decisión — ese era el precedente correcto, no una excepción.

**Contexto.** Al construir `.link-content`/`.link-chrome` para P37.55 se probó primero
envolverlas en `@layer components`, razonando que así una utilidad de Tailwind en el
mismo elemento (p. ej. `px-[0.85rem]` del nav) ganaría en caso de conflicto de padding,
en vez de que la clase de componente pisara la utilidad sin querer. El resultado real
fue el opuesto y más grave: Tailwind v4, en el `@import "tailwindcss"` de este proyecto,
no registra un layer `components` — así que `@layer components { }` creaba un layer
nuevo de **menor prioridad que todo lo demás**, y ninguna propiedad de `.link-content`
se aplicaba, ni siquiera las que no conflictuaban con ninguna utilidad (`background-image`,
`text-decoration`, `border-radius`…). El bug era silencioso: sin error de build, sin
warning — se confirmó con `getComputedStyle` en el navegador (`textDecorationLine: "none"`
pese a que la clase sí estaba en el DOM).

**Regla derivada.** Escribir las clases de componente sin `@layer`, y si una clase nueva
necesita ceder una propiedad concreta (como el padding) a la utilidad que ya trae cada
caller, **no declarar esa propiedad en la clase compartida** — dejar que cada sitio de
uso la aporte por su cuenta (así se resolvió para `.link-chrome`: no lleva
padding/margin propio, cada componente que la usa trae el suyo). Cascada explícita por
ausencia de la propiedad, no por capas.

## D35 · Los dos extremos de una `transition` van en la misma regla que la declara — 2026-08-04

**Decisión.** Si una clase de `globals.css` declara `transition: <prop>` y define el
valor de `<prop>` en `:hover`/`:focus-visible`, **el valor de reposo también tiene que
salir de esa misma clase** — no de una utilidad de Tailwind puesta en el mismo elemento.
Cuando el valor de reposo depende del fondo sobre el que vive el control, se pasa por
variable con fallback (`background-color: var(--icon-chrome-bg, var(--card))`), no por
una utilidad `bg-*`.

**Contexto.** Al construir `.icon-chrome` (P37.57) los controles solo-icono llevaban
`bg-card` (utilidad) para el reposo y `.icon-chrome:hover` para la pastilla, con
`transition: background-color 0.18s` en la clase. El hover **no llegaba nunca**: el
elemento se quedaba clavado en `--card`, también pasados 600 ms.

**Diagnóstico — y el descarte de la hipótesis equivocada.** El primer diagnóstico fue
que la utilidad `bg-card` (capa `utilities`) le ganaba a la clase sin capa, y así se
escribió en el comentario del CSS y en el mensaje de commit. **Es falso**, y se
comprobó en el navegador aislando las variables:

| Caso | Reposo | Hover | Transición | Resultado |
|---|---|---|---|---|
| A | `bg-card` (utilidad) | color literal, sin capa | no | **funciona** |
| B | `bg-card` (utilidad) | `var(--chrome-hover-bg)`, sin capa | no | **funciona** |
| C | `bg-card` (utilidad) | color literal, sin capa | sí | **falla** |

A y B descartan la cascada (una clase sin `@layer` sí gana a las utilidades — **D34 se
sostiene**) y descartan que el problema fuera usar una `var()`. C aísla la transición
como única causa. La prueba definitiva: con el elemento en hover y clavado en el color
de reposo, poner `transition: none` por JS **sin mover el ratón** lo salta al color de
hover al instante — es decir, la cascada siempre se resolvió bien; lo que no ocurría
era la transición.

**Regla derivada.** Al añadir una clase con `transition`, comprobar que el valor de
reposo de esa propiedad lo declara la propia clase. Es el mismo tipo de fallo silencioso
que D34 (sin error de build ni warning, solo un estado que no se aplica) y se detecta
igual: midiendo con `getComputedStyle` en el navegador, no leyendo el CSS. Complementa a
D34: aquella dice *dónde* declarar; esta, *qué* hay que declarar junto.

**Corolario — el defecto de un fallback es el caso común, no el neutro (2026-08-08,
P37.5989).** La primera versión de esta regla puso **`transparent`** como fallback y dejó
que **cada** caller escribiera `[--icon-chrome-bg:var(--card)]`. Seis lo escribieron y el
séptimo —el LinkedIn del footer— se olvidó: se quedó sin caja en reposo, en los dos temas,
y así estuvo tres semanas hasta que Francisco lo vio comparándolo con el toggle del nav.
El fallback `transparent` **no lo usaba nadie a propósito**; era solo la trampa donde caía
el que no se acordaba. Ahora el defecto es `--card` —el caso común, un control que se
apoya en `--background`— y en el punto de uso no se escribe nada; solo escribe algo la
excepción real: el cierre del diálogo de consentimiento, que vive sobre un card y pasa
`--background`.

La regla generalizable: **el valor por defecto de una variable con fallback tiene que ser
el caso mayoritario, no el valor neutro.** El neutro parece la opción prudente porque no
impone nada, pero convierte el caso normal en algo que hay que recordar — y multiplica por
N las oportunidades de olvidarlo. Es la misma tesis que sostiene D36 y `BRAND.md`
(«ningún control se escribe a mano»), aplicada al defecto de una variable CSS en vez de a
una cadena de clases. Lo delator estaba **dos líneas más abajo en el mismo archivo**: el
comentario que celebra que el suelo táctil de 44px del footer «ya no depende de que nadie
se acuerde» (P37.595). Mismo elemento, mismo fallo, la lección aplicada a una propiedad y
no a la de al lado.

---

## D36 · Capa de componentes: variantes de acción y primitivas de layout — 2026-08-04

**Contexto.** La auditoría de diseño previa a construir secciones nuevas (P37.591) buscaba
incoherencias de CTA y encontró la causa: entre los tokens de `globals.css` y las páginas
**no había capa de componentes**. `components/ui/button.tsx` (shadcn) llevaba en el repo
desde el principio con **cero usos**, y cada botón era una cadena de Tailwind escrita a
mano donde vivía. Resultado medido: **seis** definiciones distintas de «botón base» en
seis archivos, dos radios para la misma cosa (8px y 10px), **cuatro** hovers para la
variante «sólido» —incluido «ninguno», en las pestañas del Toolkit—, el suelo táctil de
44px reescrito catorce veces (con el footer fuera, a 40px, en todas las páginas), `WRAP`
duplicado idéntico en **dieciocho** sitios y `SECTION` en ocho.

**Decisión.** Dos archivos, y todo control pasa por ellos:

- **`components/ui/action.tsx`** — un `cva` con siete variantes (`solid`,
  `outline-primary`, `outline-neutral`, `ghost`, `toggle-primary`, `toggle-neutral`,
  `icon`) y cuatro tamaños. El suelo de 44px y el radio único de acción viven **dentro**
  del componente. El foco **no** se declara ahí: lo pone la regla global
  `:focus-visible`, y ninguna variante la sobrescribe (había tres mecanismos de foco
  compitiendo). Se exporta el `cva` y no un componente `<Action>` a propósito: la mitad
  de los call sites son `<a>` y la otra mitad `<button>`, y un wrapper con
  `render`/`asChild` añadiría indirección sin quitar ninguna decisión de encima.
- **`components/ui/layout.ts`** — `WRAP`, `SECTION`, `PROSE`, `CARD`, `PANEL`, `PAIR`,
  `DIALOG_ACTIONS`. *(Nació en `components/site/`; se movió a `ui/` el 2026-08-09 con la
  frontera de abajo.)*

**Ampliado 2026-08-04 (P37.5986): `DIALOG_ACTIONS`, y el motivo por el que hace falta.**
Migrar el botón a la variante cambió sus métricas —de `px-4` a `px-[1.35rem]`, 33,6px más
por fila de tres— y **nadie volvió a mirar los contenedores que agrupan botones**. En el
diálogo de consentimiento la fila pasó a necesitar 496px con 462px disponibles, así que
«Guardar preferencias» caía sola a una segunda línea alineada a la derecha: se leía como un
desajuste en el primer elemento que ve un visitante. La lección que generaliza es que **una
capa de componentes no cubre las composiciones**: al cambiar el tamaño de una pieza hay que
re-verificar los grupos que la contienen, y el sitio donde eso se arregla es la capa de
layout, no el call site. `DIALOG_ACTIONS` apila las acciones a ancho completo en vez de
encogerlas para que quepan, porque la fila solo cabría por poco y **solo en algunos
idiomas** (los labels EN son más cortos que los ES): un layout que depende del largo del
texto se rompe con el siguiente cambio de copy sin avisar.

Se borra `components/ui/button.tsx`: sin usos, con un cuarto mecanismo de foco y un
hover (`bg-primary/90` → en realidad `/80`) que contradecía la regla.

**Las reglas visuales que esto fija** (el porqué de cada variante) viven en `BRAND.md`,
no aquí: hover del sólido con `color-mix`, las dos variantes de control con estado y la
regla de que ningún control se escribe a mano.

**Dos hallazgos del refactor que valen más que el refactor.**

1. **«Mismo nombre, valores distintos» no es lo mismo que «cadena repetida».** La
   auditoría reportó «tres `CARD` con dos radios» como incoherencia. Mirando los usos,
   eran **dos cajas distintas y una no sabía que lo era**: `CARD` (radio lg, 10px) es el
   bloque de contenido *dentro* de una sección; `PANEL` (radio xl, 14px,
   `overflow-hidden`) es el contenedor de showcase que *enmarca* una demostración. El
   radio mayor no es decoración sino **jerarquía de anidamiento** — un panel contiene
   tarjetas, su esquina tiene que ser más abierta. `brand-kit` usaba el panel llamándolo
   `CARD`, y ese nombre equivocado era justo lo que hacía parecer que el sistema se
   contradecía. **Unificar los valores habría roto la jerarquía**: lo que faltaba era un
   nombre, no una corrección.
2. **Agrupar por atributo ARIA agrupa por accidente.** P37.59 metió el toggle de rejilla
   y los tabs de dispositivo en la misma regla porque ambos usan `aria-pressed` — pero
   uno es un interruptor suelto y el otro un segmentado de alternativas, y quieren
   tratamientos distintos. A la vez dejó fuera las pestañas del Toolkit por usar
   `aria-selected`. El criterio útil resultó ser la **forma** del control, no su marcado.

**Regla derivada.** Antes de escribir una cadena de clases en un elemento interactivo o
en una caja de layout, mirar si ya existe la variante. Si no existe, se crea. Si el caso
es una excepción, la decide Francisco y se documenta con fecha en `BRAND.md`. La señal de
que el sistema se está rompiendo no es que algo se vea mal: es que la misma decisión
aparece escrita en dos sitios.

**Ampliado 2026-08-09 (P37.64): dónde vive cada pieza — la frontera `ui/` ↔ `site/`.**
La capa existía pero no su domicilio: `components/site/` tenía 29 archivos y `ui/` dos, y
`site/` mezclaba **tres niveles** —primitivas sin conocimiento del contenido, bloques
reutilizables y secciones de página—, de modo que el nombre del directorio ya no decía
nada sobre lo que había dentro. `layout.ts` era el caso flagrante: tan primitivo como
`action.tsx` y con dieciséis importadores, pero archivado junto a `hero.tsx`.

El criterio es **una sola pregunta: ¿la pieza sabe algo de ESTE sitio?** —su copy, sus
rutas, sus datos, sus secciones—.

- **No lo sabe → `components/ui/`.** Se llevaría a otro proyecto con solo los tokens.
  Hoy: `action.tsx`, `badge.tsx`, `chrome.tsx`, `heading.tsx`, `layout.ts`, `logo.tsx`,
  `icons.tsx`, `rich.tsx`, `info-card.tsx`.
- **Lo sabe → `components/site/`.** Bloques reutilizables (`nav`, `footer`, `breadcrumb`,
  `contact-actions`, `related-pages`, `system-message`) y secciones de página (`hero`,
  `hitos`, `toolkit`, `trayectoria`…).

Los casos que **parecen** primitivas y no lo son, porque enseñan dónde cae la línea:
`brand-logo-box.tsx` hardcodea `/logos/${name}-{light,dark}.png` —sabe dónde viven los
assets de este sitio—; `reveal-root.tsx` implementa las convenciones `data-reveal` y
`data-count` **de este sitio**; `split-404.tsx` es la ilustración de una página concreta.
Ninguno se mueve. `json-ld.tsx` es el caso raro que se queda por otro motivo: no sabe nada
del contenido, pero tampoco emite UI, y `ui/` es la capa **visual** —meterlo ahí volvería
a hacer que el nombre del directorio no signifique nada, que es justo el problema que esto
resuelve.

**Convención de import que se sigue de la frontera:** entre directorios, ruta absoluta
(`@/components/ui/layout`); dentro del mismo directorio, relativa (`./layout`). Antes
convivían las dos formas para el mismo fichero.

**La escalera completa, cerrada el 2026-08-09 (P37.65, P37.655 y P37.658).** La capa de
componentes no era `action.tsx` + `layout.ts`: eran los dos primeros peldaños de **seis**, y
los demás se descubrieron todos por el mismo síntoma —la misma decisión escrita a mano N
veces—.

| Capa | Archivo | Qué gobierna | Cuántas copias sustituyó |
|---|---|---|---|
| Acción | `action.tsx` | el control **con caja** | 6 definiciones de «botón base» |
| Chrome | `chrome.tsx` | el enlace de la **carpintería** | 14 call sites con métricas a mano |
| Etiqueta | `badge.tsx` | el rótulo que **no se pulsa** | 8 pastillas en 6 archivos |
| Cabecera | `heading.tsx` | eyebrow + titular | eyebrow ×14, título ×7, 6 huecos |
| Tabla | `table.tsx` | la rejilla de **filas y celdas** | 4 cabeceras y 6 paddings de fila |
| Layout | `layout.ts` | cajas y ritmos | `WRAP` ×18, `SECTION` ×8 |

*(La sexta, `table.tsx`, se añadió el 2026-08-09 — **D40**. Llegó la última porque su
síntoma vivía repartido entre tres páginas, una de ellas la política de cookies, que nadie
mira cuando audita el sistema de diseño.)*

**Dónde cae cada pieza se decide con DOS preguntas, no por parecido.**

**1. ¿Se pulsa?** Si no → `badge.tsx`. La etiqueta se parece mucho a un chip —caja pequeña,
radio pleno, texto corto— y por eso la tentación era meterla en `action.tsx` como una variante
más. No lo es: sin pulsación no hay estado, ni hover, ni anillo de foco, ni suelo táctil, o
sea que **media base de la variante de acción no significaría nada** y la mitad de las
variantes tendrían que ignorarla. Es la lección `CARD`/`PANEL` de esta misma entrada aplicada
al revés: allí faltaba un **nombre** para dos cosas que se creían una; aquí sobra el
**parecido** entre dos cosas que nunca fueron la misma.

**2. Si se pulsa, ¿tiene caja propia?** Sí → `action.tsx`. No → `chrome.tsx`. La base de
`action.tsx` describe un control con caja: `justify-center`, `font-semibold`, `rounded-md` y
padding sacado de la escala de tamaño. Un enlace de chrome es texto dentro de la carpintería
de navegación: en reposo no tiene caja —la pastilla solo aparece al interactuar—, su peso es
500, y en dos de sus tres formas **el padding va cancelado por márgenes negativos** para no
empujar la línea en la que vive. Eso no es un matiz de un botón, es lo contrario.

El control de chrome **solo icono** confirma la regla en vez de contradecirla: se queda en
`action.tsx` (`variant: "icon"`) porque sí tiene caja —borde, `--card` en reposo, 44×44—. La
frontera no es el sitio donde vive el control, es su forma.

*Por qué no se metió el chrome en `action.tsx`, que era la otra opción evaluada:* obligaba a
sacar `font-semibold` de la base —que las siete variantes de caja tendrían que volver a
declarar, o cargarlo el eje `size`, dejando fuera a los nueve call sites que hoy se apoyan en
`size: "md"` por defecto— o a confiar en que una clase sin `@layer` gane a la utilidad (D34).
Las dos hacen más frágil el archivo que gobierna **todos** los botones del sitio para alojar a
una familia que `BRAND.md` trata como distinta desde el principio («contenido vs chrome»).

Dentro de `badge.tsx`, el mismo criterio separa variante de drift: **`kind`** (versalitas /
prosa / monoespaciada) significa algo y se queda; los cuatro altos, los cinco paddings y los
tres cuerpos no significaban nada y se unifican en la moda de cada grupo —así ninguna
pastilla del sitio se mueve más de 1px—. La **regla de color** que sale de ahí (el velo es la
señal, el texto siempre `--foreground`) vive en `BRAND.md`, no aquí, como todas las visuales.

## D37 · Endurecimiento del workflow de CI, y qué audita de verdad este repo — 2026-08-09

**Contexto.** P37.6305 iba de cerrar seis alertas de Dependabot. Las tres dependencias
—`nanoid`, `js-yaml`, `hono`— resultaron ser transitivas y con las versiones parcheadas
dentro del rango semver que ya declaraban sus padres, así que se cerraron con un `npm
update` del lockfile: **sin `overrides` y sin tocar `package.json`**, que es el desenlace
que D27 dejaba como plan A. Lo que importa no es eso, sino lo que apareció al despachar
de paso el bump de `actions/checkout` y `actions/setup-node`.

**Al meter `.github/workflows/ci.yml` en el diff, el check de qlty pasó de «No blocking
issues» a «2 blocking issues, including 2 vulnerabilities».** Los dos hallazgos eran de
**zizmor** y **llevaban ahí desde que existe el fichero**:

- `zizmor/excessive-permissions` — el workflow no declaraba `permissions`, así que su
  `GITHUB_TOKEN` heredaba el permiso por defecto del repositorio, que puede ser de
  **escritura**, para un job que solo lee el repo (ni publica, ni comenta, ni releasea).
- `zizmor/artipacked` — `actions/checkout` deja el token en `.git/config` para que los
  pasos siguientes puedan usarlo. Ninguno lo necesita aquí, y ese fichero viaja dentro de
  cualquier artefacto que se suba desde el workspace.

**Decisión.** Los dos se cierran en el workflow —`permissions: contents: read` a nivel de
workflow y `persist-credentials: false` en el checkout— y las acciones quedan **fijadas
por SHA de commit** con el tag en un comentario al lado (`@3d3c42e… # v7.0.1`). Un tag es
un puntero movible: `@v7` significa «lo que su dueño diga hoy». Dependabot mantiene el
hash al día y reescribe el comentario, así que el pinning no cuesta mantenimiento.

**El hallazgo que vale más que los hallazgos: un check de PR solo mira lo que el PR toca.**
Estas dos vulnerabilidades no las descubrió una auditoría ni un escaneo programado —las
destapó que alguien editara el fichero **por un motivo que no tenía nada que ver**. De ahí
se sigue algo incómodo: **todo fichero que lleve tiempo sin tocarse puede tener hallazgos
latentes**, y su probabilidad de salir a la luz no depende de su riesgo sino de la
casualidad de que se edite. Es la misma forma que el cian superado del `ThemePreview`
(P37.6605) y que la regla de iconos propios cuyo disparador miraba al fichero equivocado
(`BRAND.md` §Iconos propios): **no falla el criterio, falla que nada lo comprueba donde
la cosa ocurre**. La contramedida no es acordarse: es que algo mire el repo entero de
forma periódica, no solo el diff.

**Qué audita este repo, que hasta ahora no estaba escrito en ninguna parte.** Qlty corre
siete plugins: `actionlint`, `eslint` (fijado a 9.39.5), `osv-scanner`, `prettier`
(3.9.6), `ripgrep` (modo comentario), `trufflehog` y `zizmor`; con `[smells] mode =
"comment"`. **Su `qlty.toml` vive en Qlty Cloud y no está versionado en el repo**, de modo
que la configuración de lo que nos analiza es invisible desde el código y se desincroniza
sin avisar — subir eslint a 10 en `package.json` dejaría dos sitios en desacuerdo y uno de
ellos no se ve. Es la misma forma de problema que P37.66 (valores copiados que divergen),
aquí aplicada a la config del análisis. Traerlo al repo está tareado aparte; el propio
fichero lo recomienda («We recommend you to commit this file to your repository»).

**Nota de método, porque el camino fue malo.** Se descartaron dos hipótesis con datos
—`npm audit` a 0, y las **749** dependencias del lockfile consultadas una a una contra la
API de OSV, cero hallazgos— y la tercera (`unpinned-uses`) se dio por buena **sin leerla**,
porque la página de issues de qlty se quedaba cargando. Se fijaron las acciones por SHA y
el contador no se movió; el hallazgo real solo apareció al abrir la página en el navegador.
**Una hipótesis que sobrevive por descarte sigue siendo una hipótesis**, y «las otras dos
no eran» no es evidencia de la tercera. El pinning se quedó igualmente porque es correcto
por su cuenta, pero se llegó a él por el camino equivocado.

---

## D38 · Fuente única de los valores publicados: `lib/design-values.ts` — 2026-08-09

**Contexto.** Design System y Brand Kit se venden como el reflejo del código, y no leían
del código: leían de `es.json` y `en.json`. Cada cifra de contraste vivía en **cuatro**
sitios —los dos diccionarios, `BRAND.md` y este archivo— y ninguno de los cuatro se puede
verificar sin volver a medir. El reparto ya había fallado dos veces del mismo modo: el
sitio publicó **trece días** un 7,01:1 que ningún color podía dar (P37.598), y `BRAND.md`
pasó **cuatro días** contradiciéndose a sí mismo sobre el hover del sólido (P37.5985), con
las páginas publicando la cifra correcta y el reglamento la vieja. En ambos casos la causa
fue la misma y no fue de criterio: **acordarse de propagar no es una solución, es la
ausencia de una.**

**Decisión — el reparto en tres, que es lo que hay que recordar:**

| Fuente | Qué manda | Dónde |
|---|---|---|
| **Ejecutable** | El valor que el navegador pinta | `globals.css` + la capa de componentes (`action` · `chrome` · `badge` · `heading` · `layout`) |
| **Publicada** | Lo que las páginas afirman sobre ella | **`lib/design-values.ts`** |
| **Del porqué** | Por qué el valor es ese | `BRAND.md` — **nunca** el valor |

El diccionario, a partir de aquí, **solo lleva copy**.

**La línea de corte es literal, y por eso es aplicable sin criterio:** sale del diccionario
lo que no tiene texto que traducir. Si una entrada de `es.json` y su gemela de `en.json`
son carácter por carácter la misma, no es copy — es un valor con dos copias. Eso se llevó
al módulo los cinco tokens de layout, los breakpoints, la escala de espaciado, el censo de
pares medidos y los campos técnicos de la rejilla de color del Brand Kit (`token`, `hex`,
`sample`, `swap`). Se quedan los nombres, las notas, los rótulos de columna y la prosa.

**Tres cosas dejan de escribirse a mano, y las tres importan por el mismo motivo:**

- **El separador decimal.** Era, literalmente, la razón por la que las cifras vivían en el
  diccionario: coma en español, punto en inglés. Ahora la cifra es un `number` y el
  separador lo pone `Intl.NumberFormat` en el render. **La precisión va con el dato, no
  con el formateador**: «7,10» dice que se midió a la centésima y salió cero, y «10,5» que
  se midió a la décima; dejar que `Intl` recorte el cero pierde información y rellenarlo
  inventa un decimal que nadie midió.
- **El nivel WCAG.** `AAA`/`AA` es una función del número y del tamaño de texto —la misma
  para todos los pares—, así que se deriva. Tenerlo escrito al lado del número solo abre la
  puerta a que un día no coincidan. Efecto visible: la fila de `brand-purple-accent`, que
  llevaba la celda de nivel **vacía**, ahora publica `AA-large` en los dos temas.
- **Las cifras que la prosa cita para argumentar**, vía `{par.tema}` en el copy. Con una
  excepción deliberada: las cifras **históricas** («se quedaba en 6,44:1») se quedan
  escritas, porque describen un estado que ya no existe y por tanto no pueden
  desincronizarse de nada. Son parte de la frase, no un dato.

**Lo que el refactor destapó, que es el argumento entero en una línea:** el Brand Kit
publicaba **13,8:1** para exactamente el mismo par que la tabla del Design System publicaba
como **13,79:1**, en la misma web, a dos secciones de distancia. Ninguna de las dos estaba
mal medida; simplemente eran dos copias, y dos copias divergen. Es el mismo defecto de
forma que D37 registra para el `qlty.toml` no versionado y que `BRAND.md` §Iconos propios
registra para la regla cuyo disparador miraba al fichero equivocado: **no falla el
criterio, falla que nada lo comprueba donde la cosa ocurre.**

**Método de verificación del propio refactor**, que conviene reusar en el siguiente de este
tipo: se levantó el sitio construido y se compararon las **19 cifras de la tabla y los
nueve pies de muestra** en ES y EN contra lo publicado antes. Todo tenía que salir carácter
por carácter igual salvo las correcciones buscadas. Un diff de la página servida prueba
más que leer el diff del código —es la misma idea que el gate de P37.69.

**Ampliada 2026-08-09 (P37.6605) — las copias que SÍ son legítimas, y qué las vigila.**
Dos consumidores no pueden pedir el color con `var(--…)`: el **mock de tema** del Design
System pinta las dos paletas a la vez y las CSS vars solo dan la del tema activo, y las
**imágenes OG** las genera Satori, que no lee CSS vars ni resuelve `oklch`. Ahí la copia es
inevitable. Lo que no lo era es que **cada uno tuviera la suya**: el mock llevaba nueve
valores por tema, las OG ocho y el pie de cada tarjeta tres más, y de esos **cinco habían
divergido** —el cian claro del mock seguía en el valor anterior a P37.598, y las OG y los
pies citaban un atenuado y dos bordes de una generación previa de la paleta—.

La forma de la solución, que es lo reutilizable: **una sola copia, en el módulo, con el
mismo texto `oklch` que el CSS**, y el hex que necesita Satori **derivado** por código
(`oklchToHex`) en vez de escrito. Así no queda ni un hex a mano en todo el repo, y el único
sitio donde puede haber deriva es un fichero de veinticuatro líneas.

**Y sobre todo: un guardián que mira el invariante donde ocurre.** `npm run check:palette`
corre en CI antes del build y compara los 24 tokens del módulo con `globals.css` carácter a
carácter, verifica que la conversión reproduce lo que pinta Chrome (16 valores medidos, con
tolerancia de un paso de 8 bits porque uno cae justo en el filo del redondeo) y falla si se
añade un token que nadie ha medido. Se validó **inyectando el bug original**: lo caza. Sin
eso, el registro de esta decisión sería otra nota que hay que recordar — que es exactamente
lo que D37 identificó como el patrón de fondo de este repo.

**El detalle que más enseña no es el cian.** Dos de los hexes equivocados eran **texto**: el
pie que cita `bg … · card … · border …` bajo cada tarjeta del mock. Vivían en el
diccionario, con los mismos seis caracteres en ES y en EN —o sea que la prueba literal de
arriba ya decía que no eran copy— y **los destapó una captura de pantalla tomada para otra
cosa**, no una auditoría. Nadie los contaba como copias de un token porque son texto, no
color, y ninguna herramienta compara un párrafo con el píxel que tiene al lado. La lección
práctica: **al inventariar copias de un valor, buscar también las que están escritas en
prosa**, no solo las que pintan.

### Ampliación 2026-08-10 (P37.659): el guardián pasa de «las copias conocidas coinciden» a «no hay copias»

El guardián verificaba que las copias que **ya conocía** seguían cuadrando. No verificaba que
no apareciesen **nuevas**, y habían aparecido dos sin que nada las viera: el `themeColor` de
`app/[lang]/layout.tsx` (Next exige un literal, no admite `var(--background)`) y el plato mono
del Brand Kit (`bg-[#191D21]`). Las dos, `--background` escrito a mano. Ahora se derivan de
`paletteHex()`.

**Y faltaban tres tokens en la paleta del módulo**, o sea fuera del alcance del guardián por
completo: `--brand-cyan` y `--brand-purple-accent` —los dos **conmutan**, así que van a
`PALETTE`— y `--brand-purple`, que no conmuta y va a `BRAND_PALETTE`. Que el acento morado
estuviera fuera es especialmente feo: D41 acababa de cambiarle los dos valores y nada lo
vigilaba.

**La decisión de diseño que hace que esto funcione: se buscan VALORES, no patrones.** Un grep
de `#rrggbb` con lista de excepciones era lo obvio y es lo que falla: habría marcado el blanco
y el negro puros del logo mono y, peor, `#CFEFEE` / `#E6E0FB` — los «colores desviados» que el
Brand Kit enseña **a propósito** como ejemplo de lo que no hay que hacer. Una lista de
excepciones que crece con cada ilustración acaba siendo un `// disable` de facto. La pregunta
correcta es la exacta: **¿este literal vale lo mismo que un token?** Si vale, es una copia,
esté donde esté; si no, no es asunto del guardián. La lista de permitidos queda en **dos**
archivos, cada uno con su motivo: el propio `check-palette.ts` (es su tabla de referencia) y
`lib/design-values.ts` (publica los hexes **como texto** en las tablas del sitio).

Los comentarios se descartan antes de buscar: un hex citado en una explicación —y este repo
está lleno de ellas— no es una copia viva.

**Un tercer sitio se destapó al encender el guardián: el generador del CV**, con seis copias.
No estaba en el alcance de la tarea y es el caso que más lo justifica, porque **ya había
divergido una vez**: su comentario decía literalmente «`cyan: "#005859"` — *(P37.598: era
#005E5F)*», o sea que cuando se corrigió el token hubo que acordarse de propagarlo a mano.
Ahora deriva los seis; los tres que **no** son tokens (`purpleAccent`, `muted`, `border`) se
quedan escritos, porque están calibrados sobre el papel y no sobre las superficies de la web.
Verificado que los seis derivados son idénticos carácter a carácter a los literales que
sustituyen, y que los dos PDFs siguen saliendo a 2 páginas.

**Validado disparándolo**: se inyectó una copia falsa de `--foreground` en `mas-alla.tsx` y el
guardián la cazó, nombrando además los **dos** tokens que comparten ese hex (`--foreground` en
claro es `--card` en oscuro) — un mensaje que señala un token plausible pero equivocado es la
peor clase de aviso.

---

## D39 · El atenuado lo resuelve la superficie, no el punto de uso — 2026-08-09

**Decisión.** `text-muted-foreground` deja de significar «este color» y pasa a significar
**«el atenuado del fondo donde caiga este texto»**. Lo resuelve un token, `--surface-dim`,
que la utilidad lee a través de `@theme inline`, y que cada superficie redefine con la
fórmula de D30 —el texto mezclado un **85% hacia el fondo que tiene debajo**—:

| Superficie | Cómo se declara | Claro | Oscuro |
|---|---|---|---|
| `--background` | `:root`, `.bg-background`, `[data-surface="page"]` | 7,10 | 7,12 |
| `--card` / `--popover` | `.bg-card`, `.bg-popover`, `[data-surface="card"]` | 9,14 | 10,32 |
| `--muted` / `--secondary` / `--accent` | sus utilidades, `[data-surface="muted"]` | 8,17 | 9,17 |
| invertida (fondo `--foreground`) | `[data-surface="inverted"]` | 10,32 | 9,89 |

**Contexto.** D30 existía desde el 2026-08-03 y era correcta, pero **nunca se aplicó a
`--card`**, que es la superficie no-`--background` más común del sitio: 11 elementos solo en
la home y al menos uno en cada una de las seis páginas. El par daba **6,40:1 en oscuro** —
falla AAA— y sobre `--muted` 5,59. La asimetría es la parte que hay que entender: `--card` es
más claro que `--background` en los DOS temas, así que en claro se aleja del texto oscuro (el
contraste sube) y en oscuro se acerca al texto claro (baja). La misma jerarquía de
superficies ayuda en un tema y estorba en el otro, y por eso no existe un token fijo que
sirva para las dos.

La regla ya estaba resuelta **dos veces por separado** —`--contact-dim` para la franja de
contacto (P37.55) y un `color-mix` escrito a mano dentro de la etiqueta neutra (P37.655)—,
las dos con la misma fórmula y ninguna cubriendo `--card`.

**Por qué en el token y no en una clase.** `.contact-dim` había que escribirla en el punto de
uso, así que **solo protegía a quien se acordaba**, y el sitio tiene 141 usos de
`text-muted-foreground`. Con el token, la utilidad de siempre resuelve al color correcto por
el mero hecho de estar dentro de la superficie, y una tarjeta nueva nace bien sin pedirlo.
Es la forma concreta que toma aquí el objetivo del bloque: **que la accesibilidad se herede**.

**Detalle de cascada que hay que saber para tocarlo.** `@theme inline` sustituye el token al
compilar, así que `text-muted-foreground` compila a `color: var(--surface-dim)` y basta con
redefinir esa variable en la superficie. **Redefinir `--muted-foreground` NO funcionaría**: el
valor de una custom property se hereda ya sustituido, así que el descendiente vería el que se
resolvió en `:root`.

**`data-surface`, y por qué hizo falta.** La regla enganchada a la CLASE no ve las superficies
que un elemento **se pinta a sí mismo**. Cuatro velos translúcidos escritos a mano —el chip
numerado de «Cómo trabajo», la fila cebra de tipografía, la sección del esqueleto y el panel
de tokens invertido— son la misma superficie sin llevar su utilidad, y se quedaban fuera con
6,62–6,80 (el invertido, con **4,33 en oscuro, por debajo de AA**). El atributo declara a qué
**familia** pertenece lo que ese elemento se pinta. Es el fallo de disparador de `BRAND.md`
§Cómo se escribe una regla, cobrándose otra pieza: la condición miraba a la clase y la cosa
ocurría en el estilo inline.

**Consecuencias, las tres por consumir la fuente única.** Se retiran `--contact-dim` y
`.contact-dim`; la etiqueta `neutral` deja su `color-mix` propio y usa `text-muted-foreground`
(mismo píxel); y `eyebrowVariants` **pierde el eje `tone`**, porque `muted` y `band` pasaron a
pintar igual y dos nombres para una sola cosa es como empieza el drift. La sección del Design
System que documentaba ese eje enseña ahora el mecanismo que lo sustituye: el mismo rótulo,
sin prop, sobre dos fondos distintos.

**Por qué no se eligió un porcentaje por superficie.** Se calculó: apuntar a paridad de ratio
(~7,5 en todas) exige cuatro constantes distintas, una por superficie y tema, y cada una hay
que re-derivarla si cambia un token. El 85% es **relativo**, así que se ajusta solo al tema
—en claro oscurece, en oscuro aclara— y es además la fórmula que ya publicaban la franja de
contacto y la etiqueta neutra: adoptarla deja **una** regla en el sistema en vez de dos que
se parecen. El coste aceptado es que el atenuado dentro de una tarjeta pesa más que fuera.

**Estado.** Aplicado en las seis páginas. Censo del DOM sin ningún par bajo AAA en home,
Sobre mí, Design System, Accesibilidad y Cookies, en claro y oscuro. Las cifras publicadas
viven en `lib/design-values.ts` (D38): `mutedForeground`, `mutedOnCard`, `badgeNeutral` y
`mutedOnInverted`, y la tabla del Design System pasa a publicar **trece** pares.

---

## D40 · Capa de tabla: `components/ui/table.tsx` — 2026-08-09

**Decisión.** Ninguna tabla se maqueta en el punto de uso. `DataTable` + `TR` + `TD` para las
tablas de **datos** —marcado real, con `caption`, `th scope="col"`, `th scope="row"` y
`colgroup`— y `SPECIMEN_ROW` para las de **espécimen**, que se quedan en divs. **Un solo
separador de fila en el sistema: el filete.** Un solo padding: **un gutter** —medio por lado
entre columnas, uno entero contra el borde del panel—.

**Contexto.** Sexta capa, y la última que quedaba con la forma que tuvieron el botón, el
chrome, la etiqueta y la cabecera: **seis** tablas con **cuatro** definiciones distintas de
fila de cabecera divergiendo en siete propiedades (layout, gap, padding lateral, padding
vertical, tracking, peso y fondo), seis paddings de fila distintos y la plantilla de columnas
escrita **dos veces por tabla** —cabecera y fila— y mantenida a mano para que coincidiera.

**El inventario contó cinco, y eso es en sí el argumento de la capa.** Se hizo mirando el
Design System y el Brand Kit, porque son las páginas que documentan el sistema; la sexta —la
de la política de cookies, con su cuarta cabecera y sus `Th`/`Td` locales— estaba en la
página que nadie asocia con diseño.

**Por qué marcado real y no divs con grid.** No es cosmética: la de «Contraste medido» son
trece filas por tres columnas de datos numéricos, y en divs un lector de pantalla no asocia
celda con columna —se oye «13,79:1 AAA 15,32:1 AAA» sin saber cuál es el tema claro y cuál el
oscuro—. **axe no lo marca**, porque un div no es una tabla rota: simplemente no es una tabla,
y eso ninguna herramienta puede echarlo de menos. Las de espécimen se quedan en divs **a
propósito**: cada metadato ya trae su etiqueta al lado (`TypeMeta`), así que son pares
etiqueta-valor y no celdas que dependan de una cabecera para significar algo.

**La pregunta de D36, que era condición de la tarea: ¿cebra y filete significan cosas
distintas?** La hipótesis de partida —«la cebra ayuda cuando la fila es alta y hay muchas
columnas»— no sobrevive al inventario: la «Tabla de uso» tiene cinco columnas y no la lleva.
Se probó un eje mejor —la FORMA de la fila, un renglón de celdas frente a un bloque que se
envuelve—, y bajo esa lectura la cebra se quedaba y se le daba también a Cabeceras.

**Y entonces se midió, y la respuesta se dio la vuelta.** El velo daba un salto de **ΔL\* 1,02
en claro** y 2,02 en oscuro, contra los **3,89 / 9,04** de la pastilla de hover, que es el
escalón que este proyecto usa como referencia de «esto se ve» (`BRAND.md` §Cómo medir, punto
4). La banda no agrupaba filas —su única justificación—: ponía un tinte **por debajo del
umbral**, y por eso se leía como que algo no cuadraba en vez de como estructura. Subirla habría
exigido construirla sobre `--muted`: superficie nueva, atenuado recalculado y par nuevo en el
censo, para hacer un trabajo que el filete ya hacía.

> **La lección, que es lo reutilizable: un argumento de diseño bien construido sigue siendo
> una hipótesis hasta que se mide.** El de la forma de la fila era correcto en su
> razonamiento y falso en su premisa —daba por hecho que la banda se veía—.

**Dos cosas que solo se vieron en pantalla, ninguna detectada por herramienta:**

1. `<th>` viene en **negrita y centrado** de la hoja del navegador, y al pasar a marcado real
   eso se coló en las notas de cada fila, que ya tenían su peso decidido. Lo neutraliza la
   capa: la semántica la elige `head`, el aspecto lo pone la variante.
2. El padding lateral usaba `--page-x` (40px) en los extremos, heredado de las tablas con
   rejilla del Design System, donde no se nota porque ocupan el ancho de página. Dentro de
   `PROSE` (42rem) esos 80px se comían casi un cuarto de la tabla de cookies y su columna de
   finalidad partía las frases en **dos palabras por línea** — peor que la tabla vieja, que
   llevaba `px-4`. De ahí el gutter. `DataTable` recupera además el `minWidth` que la tabla
   vieja tenía (`min-w-[34rem]`) y se había perdido al migrarla.

**Publicado** como sección **(12) «Tablas»** del Design System, con la tabla de datos
demostrada por una tabla real (Regla de construcción de `CLAUDE.md`). Accesibilidad pasa a
(13) y Esqueleto a (14).

---

## D41 · Un color fijo no puede servir a dos superficies opuestas: `--brand-purple-accent` conmuta — 2026-08-10

**Decisión.** `--brand-purple-accent` pasa a tener **dos valores, uno por tema**
(`oklch(0.78 0.16 290)` en claro, `oklch(0.45 0.16 290)` en oscuro) y sube de 3,96/3,49 a
**7,04/7,21** — AAA de texto normal, sin la salvedad «solo texto grande» que arrastraba desde
que existe. Es el único token de la **capa de marca** que conmuta, y es correcto que lo haga.

**El porqué, que es aritmética y no criterio.** El token vive sobre las secciones de fondo
invertido, cuyo fondo **es** `--foreground`. Ese fondo salta de carbón (luminancia relativa
**0,019**) a hueso (**0,899**) al cambiar de tema, así que un color fijo tiene que servir a
las dos superficies a la vez. Eso acota el techo de forma exacta:

> el mejor contraste que un color fijo puede dar contra ambas es
> **√((0,899+0,05)/(0,019+0,05)) = √13,79 = 3,71:1**, la media geométrica de los dos.

AAA-large (4,5) exigiría una luminancia **≥0,2598 y ≤0,1610 simultáneamente**: ventana vacía.
Y no es cosa del morado —**ningún color de ningún tono** lo cumple—. El valor anterior,
`oklch(0.62 0.16 290)` fijo, daba 3,96 y 3,49: media geométrica 3,72, o sea **estaba en el
óptimo**. No se eligió mal; se eligió lo mejor de un problema sin solución, y la salvedad
publicada durante meses describía el techo, no el color.

**Lo que hace que esto sea una decisión y no un ajuste:** el patrón ya existía en el repo.
`--primary-on-inverted` (P37.598) resolvió exactamente este problema para el cian —«es,
literalmente, el cian del OTRO tema»— y su comentario en `globals.css` llevaba desde entonces
llamando a `--brand-purple-accent` **«hermano, que existe por esta misma razón»**. Los dos
hermanos tomaron caminos distintos: el cian conmutó y funcionó, el morado se quedó fijo y topó
con el techo. Generaliza a una regla: **cuando una pieza se apoya en una superficie que
conmuta, el color se deriva de la superficie; fijarlo es aceptar un techo.** Misma familia que
D30/D39 (el atenuado lo resuelve la superficie) y que la bolita del switch (P37.593).

**Dos call sites cayeron con el cambio, los dos por la misma razón: usaban el token fuera de
su regla**, sobre `--card` en vez de sobre fondo invertido. Mientras el token era fijo la
infracción no se veía —los dos morados se parecían—; al conmutar, el mismo código habría
dejado el elemento invisible sobre la tarjeta.

1. **El rótulo de la escalera del logo** (Brand Kit), a 10,88px: era el fallo de AA que abrió
   P37.657 (3,70/3,96). No se arregla con otro morado —el estándar da **2,81** en claro—:
   ningún morado de esta marca es texto pequeño sobre una tarjeta clara. Pasa a
   `text-muted-foreground` (**9,14/10,32**, heredado de D39 sin par nuevo). El peldaño que no
   sirve se **atenúa**, no se tiñe; y la distinción no queda codificada por color, porque cada
   estado lleva su propia palabra.
2. **El filete y el icono del `Callout` morado** del Brand Kit: pasan a `--brand-purple`, que
   es lo que la propia regla manda fuera de fondos invertidos. Habrían quedado en 2,07/1,91.

**Y un tercer sitio mejoró solo:** la muestra de color del Brand Kit pinta su «Aa» con
`--foreground`, o sea **la superficie donde el token vive de verdad**, así que el espécimen
demuestra exactamente el par que la tabla publica (7,04/7,21) en vez del 3,49 que enseñaba
antes con un primer plano elegido para la muestra.

**Lección de método (la cuarta de la misma familia): un umbral mal aplicado inventa hallazgos
igual que un metro mal calibrado.** El censo marca como «bajo AAA» todo lo que no llega a 7:1,
sin mirar el tamaño del texto. Por eso el PRD publicó «cuatro pares incumpliendo en la escalera
del logo» cuando era **uno**: los otros tres eran los «Aa» de las muestras, de 24px y peso 600
—texto grande, donde AAA es 4,5—, y dos de ellos (5,21 y 6,57) **cumplían de sobra**. Ninguno
estaba siquiera en la escalera.

**Corregido el mismo día en P37.6595:** `scripts/design-review/contrast-census.js` lee ya el
tamaño y el peso de cada texto y aplica el umbral que le toca (≥24px, o ≥18,66px con peso
≥700 → AAA 4,5 / AA 3), así que su `bajoAAA` volvió a ser una lista de incumplimientos. Tres
consecuencias que no son cosméticas: el **umbral entra en la clave de deduplicación** —si no,
un texto grande enmascara a uno pequeño de los mismos colores, que es el que puede fallar—;
el censo **se ordena por holgura contra su propio umbral** y no por ratio, porque con umbrales
mixtos la cifra más baja ya no señala al peor par (7,10 a 13,6px aprieta más que 5,21 a 24px);
y los pares sobre imagen dejan de llevar veredicto, porque su `ratio` nunca fue una medición.
De paso, el congelado de transiciones se extrae a `window.freezeMotion()` para poder usarlo
antes de un `axe.run()` — medido: **7 violaciones fantasma sin él, 0 con él**, misma página.

**Verificación.** Censo del DOM con el metro validado contra sus anclajes (13,79 claro / 15,32
oscuro, exactos) en home y Brand Kit: ningún par bajo AAA con el umbral que le toca a cada uno.
0 violaciones de axe en home, Brand Kit y Design System, ES y EN, claro y oscuro. **Ojo al
medir con axe: hay que congelar las transiciones igual que hace el censo** — sin eso, conmutar
el tema y lanzar axe da siete violaciones fantasma (`#005859` sobre `#191d21`) que son el
tema a medio interpolar, exactamente el fallo que el censo documenta y que axe no evita.

## D42 · Los showcase se parten por sección, y el gate del refactor es un diff de HTML — 2026-08-10

**Decisión.** `design-system.tsx` (1.512 líneas) y `brand-kit.tsx` (1.280) dejan de ser archivos
y pasan a ser **carpetas con un archivo por sección** —`index.tsx` con el orden, `NN-nombre.tsx`
por sección, `shared.tsx` con lo poco que cruza—. Ninguno de los 29 archivos resultantes pasa de
391 líneas, y el mayor es la sección del logotipo, que ya era 299 dentro del monolito.

**El dato que lo decidió, medido antes de tocar código:** de los 13 subcomponentes auxiliares
que tenían entre las dos páginas, **9 se usaban en una sola sección**. La sección ya era la
unidad natural de agrupación; solo que no estaba escrita así. Por eso `Stat`, `ThemeCard`,
`NavGlyph`, `ContrastBadge`, `VariantCard`, `Lockup`, `UsageKV`, `TypeCard`, `BrowserMockup` y
`ErrorVisual` viajan con su sección, y en `shared.tsx` queda solo lo que de verdad se comparte
(`SectionHead` y `TypeMeta` en uno; los tres rótulos, los chips de descarga, `Glyph`, `Dl`,
`DlThemed` y `Callout` en el otro).

**Descartado «secciones como datos + renderer»**, que era la alternativa real y no una de paja.
Los cuerpos **no comparten forma**: van de 21 a 299 líneas sin patrón común, así que cada `Body`
acabaría siendo un componente por sección igualmente —no ahorra archivos, añade una capa—, el
envoltorio que factoriza son cuatro líneas y la numeración ya viene del diccionario. Sería la
opción correcta si las secciones fueran homogéneas; medido, no lo son. Y tiene un riesgo de
forma: «secciones como datos» empuja a meter el markup dentro del array, y el monolito vuelve
con otro nombre.

**Descartada también la extracción parcial** (solo las cuatro secciones grandes): dejaría los
monolitos en ~950 y ~700 y crea **asimetría**, que es peor de mantener que cualquiera de las dos
formas consistentes — dónde vive una sección dependería de si era grande el día del refactor.

### El gate: `scripts/page-html-diff.ts`

**Un refactor que mueve 2.800 líneas de markup necesita una prueba de que no cambió nada, y unas
aserciones elegidas a mano solo comprueban lo que a alguien se le ocurrió comprobar.** El gate
captura el **HTML servido**, lo normaliza y lo compara: `npm run gate:html -- save` antes,
`npm run gate:html` después. Diff vacío = correcto **por construcción**, sin re-disparar
`design-review`. *(Nació cubriendo las cuatro variantes de los dos showcase, con el nombre
`showcase-html-diff.ts` y el comando `gate:showcase`; **D45 lo amplía a las doce** —las seis
páginas × ES/EN— y lo renombra, porque el andamiaje que refactoriza es de todas.)*

Tres decisiones de normalización, y ninguna es cosmética:

1. **Los `<script>` se van enteros.** Llevan la carga de React Server Components, que codifica el
   árbol de módulos: cambia al partir un archivo aunque el DOM sea idéntico. Es justo el cambio
   que el gate no debe vigilar.
2. **Los assets de `/_next` se anonimizan**: su hash cambia con el orden de los archivos fuente.
3. **El salto de línea se mete SOLO donde dos etiquetas ya iban pegadas** (`><`). Es una
   partición sin pérdida: el espacio entre elementos inline —el que decide si dos palabras salen
   juntas— se conserva y entra en la comparación. Colapsarlo escondería el fallo típico de mover
   JSX de sitio.

**El gate se validó disparándolo antes de fiarse de él:** con una mutación de un solo carácter
en una clase (`gap-4` → `gap-5`) sale con código 1 y señala la línea exacta. Un gate que no
puede fallar no es un gate.

Esto es además la **semilla del arnés de tests** (P37.75), y la razón de no haberlo metido en
esta ola: para este trabajo, un snapshot total es más fuerte que unas aserciones elegidas.

### El límite de «diff vacío = correcto», que se aprendió al día siguiente

**El gate solo garantiza lo que garantiza: que el HTML no cambió.** En el momento en que el
cambio ES intencionado, el diff deja de ser un veredicto y pasa a ser una lista que hay que
leer — y leerla no es lo mismo que entenderla. **D43** es el contraejemplo, y ocurrió en el
commit siguiente: al sustituir la cabecera numerada desapareció del diff la línea del
`<div class="mb-4 …">` que envolvía al `SectionHead`. Se dio por buena, porque **un envoltorio
que se borra es exactamente lo que ese refactor debía hacer** — y con él se fue el hueco de
16px entre el titular y su entradilla, en 19 secciones. Lo cazó medirlo en pantalla, no el
diff que lo contenía.

Así que la propiedad es más estrecha de lo que suena: **diff vacío = correcto; diff no vacío =
hay que mirar la página**. No hay lectura de diff que sustituya eso.

**Lo que este commit NO hace, a propósito:** unificar las tres formas de cabecera numerada que
tienen Design System, Accesibilidad y Brand Kit. Cambiar el rótulo **es** un cambio de copy —el
eyebrow no puede repetir el título—, así que va en P37.695, commit aparte y misma rama. Mezclarlo
aquí habría costado la propiedad que hace barato este refactor: diff vacío = correcto.

### La excepción: `design-system-islands.tsx` no es una sección, es la frontera de cliente

*(Escrito el 2026-08-28, P50.86. La excepción existía desde el refactor y no estaba en ninguna
parte, así que quien llegara después la leía como deriva de este mismo commit en vez de como una
decisión.)*

**«Un archivo por sección» ordena el markup, no la frontera `"use client"`.** Las **cuatro
piezas interactivas** del Design System —el toggle de rejilla y las pestañas de dispositivo
(§01), la demo de reveal (§05) y el simulador de foco (§07)— viven juntas en
`components/site/design-system-islands.tsx`, fuera de la carpeta.

**El motivo es que la frontera se paga por archivo, no por componente.** Repartirlas a sus
`NN-*.tsx` convertiría **tres archivos de sección en Client Components enteros**, y con ellos
todo el markup servidor que hoy los acompaña. Aquí la unidad natural no es la sección: es «lo que
necesita JavaScript», que es exactamente lo que dice D7 —**JS solo en islas**—. Las dos reglas no
chocan; gobiernan ejes distintos.

**Si alguna vez se prefiere coherencia estricta, el precio se MIDE antes:** mover cada isla a su
sección y comparar el JS de cliente servido, no razonarlo. Y el mismo criterio decide al revés —
una isla nueva va a este archivo, no a su sección.

**Y una lección de contador, cazada al escribir esto:** el comentario de `index.tsx` decía «tres
islas interactivas» habiendo cuatro desde que apareció `FocusSimulator`. La cifra se ha quitado
en vez de actualizarse, que es lo que argumenta D149: un contador que se puede borrar no
necesita quien lo vigile.

## D43 · Toda página y toda sección abren igual: el ordinal va dentro del eyebrow — 2026-08-10

> **AMPLIADA el 2026-08-25 por D111.** El ordinal sigue viviendo en el eyebrow, y desde
> esa fecha entra ADEMÁS en el nombre accesible del titular: navegar con `H` salta el eyebrow
> y se llevaba solo la afirmación. No se pinta dos veces.

**Decisión.** Las **19 secciones numeradas** del Design System y de Accesibilidad pasan a abrir
como el resto del sitio: `SectionHeader` con **rótulo + titular**, el ordinal dentro del rótulo
(`01 — Rejilla`) y el titular convertido en una **afirmación** (`Ancha para maquetar, estrecha
para leer`). El Brand Kit ya tenía esa estructura y conserva su copy; lo que cambia allí es el
aspecto del rótulo.

**El hallazgo, que era mayor de lo que parecía.** No eran tres formas de numerar: eran **cuatro
copias privadas** de la cabecera numerada —`design-system/shared.tsx`, `accesibilidad.tsx`,
`brand-kit/shared.tsx` y una cuarta dentro de `design-system-islands.tsx`, la más fácil de
perder de vista porque la sección 01 dibuja la suya ahí para que el toggle de rejilla quepa en
la misma fila—. Dos de las cuatro **escribían a mano las clases de `section-sm`** en vez de usar
la variante, así que un cambio en `titleVariants` no las habría alcanzado.

**Y la diferencia no era de formato, era de qué dice cada slot.** El Design System ponía el
*tema* en el titular («Rejilla de página») y solo el ordinal en el rótulo; el Brand Kit ponía
ordinal + tema en el rótulo y una *afirmación* en el titular. La segunda forma **es el
`SectionHeader` del sitio**: el mismo par con el que abren la home y los cuatro heros. Las otras
dos se habían inventado un slot de número monoespaciado que no existe en ningún otro sitio — y
el remate es que el Design System **publica en su sección (11)** que «toda página y toda sección
abren igual» mientras abría sus catorce de otra manera. La página que publica la regla era la
que la incumplía, misma forma que D41.

**Por eso es una tarea de contenido y no un refactor:** al subir el tema al rótulo, el titular
queda vacío y hay que escribirlo. Son 19 titulares × 2 idiomas. **Pero casi ninguno es nuevo**:
la afirmación ya estaba escrita en la entradilla, en primera posición, y lo que se hace es
promoverla; la entradilla se queda con la elaboración. En doce de las diecinueve el cambio es
exactamente ese corte.

**Las entradillas, que es lo que lo cierra.** El Brand Kit tenía las suyas **6 de 6**, y eso era
parte de por qué se leía como un sistema; el Design System iba 12/14 y a Accesibilidad la
propuesta inicial le quitaba una. Ahora **las 19 llevan entradilla**, y las tres que faltaban se
resolvieron con material que ya existía: la de Breakpoints estaba escrita **al pie** de la
sección (una nota a lo que ya habías leído, en vez de la frase que te prepara para leerlo) y
sube a su sitio; Movimiento —la única sección del sitio sin prosa de ningún tipo— estrena una
que presenta su tabla de duraciones; y la de Límites era **una sola frase** que era justo el
mejor titular de la página, así que sube y se escribe otra debajo.

**Un detalle que solo se ve mirando la página.** Al morir `SectionHead` se fue con él el `mb-4`
de su envoltorio, y el titular quedó **pegado a la entradilla: 0px** donde había 16. El diff de
HTML lo enseñaba —la línea del `<div class="mb-4 …">` desaparecía— y aun así pasó por bueno,
porque un envoltorio que se borra es exactamente lo que un refactor de este tipo debe hacer.
Lo cazó medirlo en pantalla. Restaurado a 16 en las 19.

> **RESUELTO el 2026-08-10 (P45): `LEAD_GAP`.** El hueco lo pone la capa, como ya hacía
> `EYEBROW_GAP` con el de rótulo→titular y por el mismo argumento. Las entradillas entran por el
> slot `children` —que estaba documentado y no usaba nadie— y el hueco sale del `size`. Va como
> margen **inferior del titular** y no superior de la entradilla: así cada elemento carga el
> hueco hacia el de abajo, igual que `EYEBROW_GAP`, y el slot no necesita envoltorio — ni un
> nodo nuevo en el DOM de páginas ya publicadas.
>
> **Y no eran 19 `mt-4`, eran 32 huecos escritos a mano — pero solo CUATRO decisiones.** Al
> medirlos apareció que **el hueco ya seguía al tamaño y nadie se había dado cuenta**: `page`
> 24px en los tres heros, `page-sm` 16px en Cookies, `section` **22,4px en los diez sitios que
> lo usan** (las seis secciones del Brand Kit *y las cuatro de la home*, que este diagnóstico no
> había contado) y `section-sm` 16px en las dieciocho del Design System y Accesibilidad.
>
> **El `1.4rem` del Brand Kit, que era el sospechoso principal, resultó ser el valor correcto de
> otro tamaño.** Por eso NO se normaliza a `mb-5`, que era la tentación: no es un paso de la
> escala de Tailwind, pero es la moda de su grupo —diez de diez— y bajarlo a 20px movería diez
> sitios publicados a cambio de una cifra redonda. Lo que esta tarea arregla es que estuviera
> escrito diez veces, no cuánto mide. Tercera vez que aplica la lección `CARD`/`PANEL` de D36
> —*antes de unificar dos valores que se parecen, mirar si significan cosas distintas*— y la
> primera en que el que significaba otra cosa era el que más pinta de error tenía.
>
> **Gate:** las doce variantes cambian **solo** `mt-4→mb-4`, `mt-6→mb-6` y
> `mt-[1.4rem]→mb-[1.4rem]`, comprobado emparejando cada línea del diff por su texto sin clases:
> **cero líneas con el texto cambiado y ningún otro cambio de clase**. O sea, una traducción 1:1
> del margen — **no se mueve un píxel**.
>
> **Lo que queda fuera, con su motivo:** la sección 14 del Design System (el esqueleto navegable)
> tiene su `SectionHeader` dentro de un envoltorio flex con `mb-10`, así que su entradilla **no
> es hermana del titular** y su `mt-4` no es esta relación. Meterla por el slot la metería
> dentro de la fila flex. Es el único call site que sigue escribiendo el hueco a mano.
>
> **Y el «drift» de los `mb` de las entradillas (`mb-10` ×10, `mb-8`, `mb-6`) no es drift.** Es
> la relación de abajo —entradilla→contenido— y depende de qué venga después: la de la sección 13
> lleva `mb-6` porque le sigue un `<h3>` con su propio `mt-8`, y la de Accesibilidad `mb-8`
> porque le siguen rejillas de tarjetas. Se miró antes de tocar, que era la pregunta.

## D44 · Lo que de una experiencia no es copy vive en `content/`, y la unión es por nombre — 2026-08-10

**Decisión.** Los datos de una experiencia que **no son copy** —hoy su **logo** y el **slug** de
su página— viven en **`content/experiences.ts`**, no en el diccionario i18n ni dentro del TSX que
los pinta. La unión entre las tres fuentes que hoy describen una experiencia es **por `company`**,
la clave que el CV ya usaba (D22), y **por prefijo** para absorber la forma de display del
diccionario («Ontecnia (Malavida, Lecturalia, BonViveur…)»). Si una fila no encuentra su
experiencia, **se lanza**.

**Las tres fuentes, y por qué son tres y no una:**

| Fuente | Qué guarda | Por qué ahí |
|---|---|---|
| `app/[lang]/dictionaries/{es,en}.json` | periodo, rol, empresa, descripción | Es copy, y es lo único que el diccionario guarda desde D38 |
| `content/cv/content.{es,en}.ts` | el texto rico (bullets con métricas, `context`, `reporting`) | Autorado, más detallado que la web, y origen del deep-dive (D22) |
| `content/experiences.ts` | logo y slug | No es copy ni es texto: no se traduce, así que no puede vivir por locale |

**El problema que corrige.** Los logos eran **tres arrays posicionales dentro de
`components/site/trayectoria.tsx`**, mapeados **por índice** contra los arrays del diccionario.
Añadir una experiencia, reordenar dos o borrar una desalineaba los logos **en silencio**: sin
error de compilación, sin nada que lo detectara, y con el fallo visible solo para quien conociera
los logos de memoria. Es el mismo olor que D38 resolvió para los tokens —**un valor que vive
fuera de su fuente**—, y se corrige igual: el logo pasa a ser un campo del dato y la fila lo pide
por su nombre.

**Por qué el slug no se deriva del nombre.** `slugify("Ontecnia (Malavida, Lecturalia,
BonViveur…)")` no da nada usable, y el slug es una **URL pública**: una regla de derivación que
un día produzca otra cadena rompe enlaces sin avisar. Se escribe, y es `null` en las dos entradas
de Marketing & Growth, que no tienen página propia a propósito (PRD §3).

**Por qué lanza en vez de no pintar nada.** Es la lección de `matchFact` (D22): romper la build
es mejor que servir el logo de otra empresa. **Verificado disparándolo** —añadida una fila con
una empresa sin registrar, la home devuelve 500 nombrando la empresa que falta—, que es la regla
de `BRAND.md` §Cómo se escribe una regla: un guardián que nadie ha visto saltar no se sabe si
salta.

**Gate del cambio.** El HTML servido de la home (ES y EN) es **idéntico** antes y después, con
las normalizaciones de D42. Y el invariante nuevo se comprobó **al revés que el gate**:
reordenando a mano dos experiencias del diccionario en cada bloque, los logos siguen a su
empresa. La home no estaba todavía en el gate —la metió D45 el mismo día—, así que esta
verificación se hizo con un snapshot equivalente hecho a mano.

## D45 · El andamiaje de página sale de un helper, no de seis copias — 2026-08-10

**Decisión.** La **metadata** de página la construye `lib/page-meta.ts` → `pageMetadata({lang,
slug, meta, ogCard?, ogType?})`, y el **marco** (JSON-LD, nav, isla de motion y footer) lo pone
`components/site/page-shell.tsx` → `<PageShell>`. El emparejamiento **ruta↔locale** lo resuelve
`pagePath(lang, slug)` en `lib/i18n/config.ts`, fuente única de la que salen el canonical, los
tres `hreflang` y el enlace del logo al inicio.

**El problema.** Las cinco `page.tsx` internas **y el layout** repetían el mismo bloque
—`LangParams`, `generateStaticParams`, el doble `isLocale`+`notFound`, el doble `getDictionary`,
el ternario `lang === "es" ? "/x" : "/en/x"`, `alternates.languages` con sus tres claves, el
`openGraph` entero, un `twitter` que lo duplica campo a campo, el `homeHref`, el `breadcrumbLd` y
el marco `JsonLd`/`Nav`/`RevealRoot`/`Footer`—. Las variables reales eran **cuatro**: slug, rama
del diccionario, tarjeta OG y `type`. Mismo diagnóstico que D43 («eran cuatro copias privadas de
la cabecera numerada») **una capa más arriba**: se refactorizó la capa de componentes y la de
página se quedó escribiéndose a mano.

**Por qué ahora y no cuando se detectó.** El deep-dive añade siete páginas. Y lo que se rompe en
ese bloque **no lo caza nada**: un `hreflang` mal copiado, un `canonical` apuntando al slug de
otra página o un `x-default` olvidado no los ve el typecheck, ni el linter, ni axe. Solo Google,
tarde. Es deuda con un multiplicador a punto de aplicarse.

**Lo que NO se unificó, a propósito:**

- **`generateStaticParams` y el `await params` + `isLocale`** se quedan en cada página. Son la
  frontera con el framework: esconderlos detrás de una fábrica ahorra cuatro líneas y a cambio
  hace que una `page.tsx` deje de parecerse a una `page.tsx` de Next. Y un error ahí **falla
  ruidosamente**, que es justo lo contrario del caso que motiva esta decisión.
- **`metadataBase` e `icons`** siguen en el layout: se heredan en todo el sitio y no son de
  página. El layout compone —`{...pageMetadata(…), metadataBase, icons}`— en vez de repetir.
- **El `<main>`** sigue en cada componente de contenido. Moverlo al shell es la decisión de P43
  (el skip link), no de esta.

**PageShell tiene dos modos y el tipo obliga a elegir uno** (unión discriminada): con `crumb` es
una página interna —el `BreadcrumbList` se **deriva** y el logo del nav navega a la home— y con
`jsonLd` es la home, que trae el suyo y deja al logo su `#top`. Es la diferencia real entre las
dos, y ahora está en el tipo en vez de en la memoria de quien copie el archivo.

### El gate se amplía a las doce variantes, y se valida rompiéndolo

`scripts/showcase-html-diff.ts` pasa a `scripts/page-html-diff.ts` y `npm run gate:showcase` a
**`npm run gate:html`**: cubría los dos showcase porque era el refactor que había delante, y lo
que este toca es el andamiaje **común**, así que el gate tiene que ver lo común. Doce variantes =
seis páginas × dos idiomas. Y hay una razón de fondo para que el nombre cambiara: lo que un
helper de metadata rompe **no está en el `<body>`** sino en el `<head>`, que este snapshot ya
comparaba entero sin que nadie lo hubiera aprovechado.

**Resultado: diff vacío en las doce, en modo producción** (línea base con el árbol anterior,
comprobación con el nuevo, mismo `npm run build && npm start`).

**Y el gate se validó disparándolo** (`BRAND.md` §Cómo se escribe una regla): borrando la línea
del `x-default` de `pageMetadata`, el diff señala **las doce páginas a la vez**. Las dos mitades
de la prueba importan — que salga vacío dice que el refactor es transparente; que una sola
mutación rompa las doce dice que **ahora hay de verdad una sola fuente**, que era el objetivo.

## D46 · El enlace de salto, y el `<main>` sube al shell — 2026-08-10

**Decisión.** Toda página del sitio abre con un **enlace de salto** (`components/site/skip-link.tsx`)
como **primer hijo del `<body>`**, y el `<main>` —con `id="main"` y `tabIndex={-1}`— lo pone
**`PageShell`**, no cada componente de contenido. Cierra WCAG 2.4.1 «Bypass Blocks», **nivel A**,
que era el único incumplimiento de ese nivel que tenía el sitio.

**Por qué no lo vio ninguna auditoría, que es la parte que importa.** **axe no lo detecta.** Su
regla `bypass` se da por satisfecha si la página tiene landmarks o encabezados, y este sitio
tiene los dos: el informe salía en verde con el fallo dentro. Las tres auditorías anteriores
—dos de contraste y una de diseño— leyeron ese verde. Es la cuarta vez que el proyecto se
tropieza con lo mismo por el otro lado: **un medidor que da verde no prueba que no falte nada**,
igual que un metro mal calibrado inventa hallazgos (D41) y que un censo leído del CSS no ve los
pares que solo existen al componer (D39). Aquí el silencio no era ausencia de problema, era
ausencia de pregunta. Lo encontró un validador externo genérico, no la herramienta especializada.

**El `<main>` sube a `PageShell` (extiende D45).** Estaba escrito cinco veces en los componentes
de contenido —con un `id="top"` que no era destino de nada— y una sexta en la home. Sube porque:

- **El `<main>` es marco, no contenido.** Es la misma frontera que ya separaba `PageShell` de lo
  que va dentro.
- **Y sobre todo: el enlace de salto necesita destino en TODA página.** Puesto en el shell, una
  página nueva nace con él — y hay siete a punto de entrar (el deep-dive). Es la forma concreta
  del objetivo que el PRD §5 lleva escrito desde D39: *que la accesibilidad se herede*, no que
  se recuerde.
- Las dos superficies que no pasan por el shell —`SystemMessage` (404/error) y el 404 global—
  ponen el suyo, y las tres importan `MAIN_ID` de un sitio: el id y el `href` que lo apunta son
  dos extremos que solo funcionan juntos.

**`id="top"` se retira de los cinco `<main>`.** Un elemento no puede llevar dos ids, y `top` no
era destino de nada: los diez enlaces demo de `08-enlaces` y `09-botones` lo usan como href
inocuo y ahora resuelven a la parte superior del documento, que es el comportamiento que
anuncian. **El `id="top"` de la home no se toca**: lo lleva la sección del hero y es lo que hace
que el logo del nav suba en vez de navegar.

**Fuera de pantalla con `translate`, no con `sr-only`.** El patrón canónico
—`sr-only focus:not-sr-only`— depende de qué utilidad de `position` gana en el CSS generado, y
eso **no se puede leer en el código**: si `not-sr-only` (static) sale después de `absolute`, el
enlace aparece en el sitio equivocado y nadie se entera hasta que alguien tabula. Un `translate`
es determinista. Sin transición a propósito: así no hay nada que anular con
`prefers-reduced-motion`.

**El aspecto sale de `outline-neutral`** (Regla de construcción): es un control de utilidad, y
el sólido está reservado al CTA de contacto. El anillo lo pone la regla global `:focus-visible`.

### Cómo se verificó, y el error de método que apareció al hacerlo

- **Las 14 rutas servidas** —seis páginas × dos idiomas, más los dos 404— tienen el enlace como
  **primer elemento focalizable**, un solo `<main>`, con `id="main"` y `tabindex="-1"`.
- **En pantalla, en los dos temas:** al recibir foco el enlace entra a (12, 12), mide **178×44**
  (suelo táctil) y lleva el anillo de **2px** del sistema. Activarlo deja el foco en
  `MAIN#main` — comprobado, no deducido.
- **El gate de HTML (D45) enseña exactamente tres cambios y ninguno más**: `+<main id="main"
  tabindex="-1">` ×12, `-<main id="top">` ×10 y `-<main>` ×2, y el enlace ×12. Lo demás que sale
  en el diff son los `useId` de las pestañas del Toolkit, que se desplazan porque el árbol tiene
  un nodo nuevo.

> **El error de método, que merece quedar escrito:** las tres primeras medidas dieron «el enlace
> no aparece al recibir foco» y «no tiene anillo». Era falso: **`:focus` no casa si la ventana
> del navegador no tiene el foco del sistema**, y la automatización la deja sin él. El
> `getBoundingClientRect` decía −56 y el `outline-style` decía `none` con el CSS perfecto. Un
> clic real en la página antes de medir, y las tres cifras cambiaron. *Valida el metro antes de
> creerte el hallazgo* — esta vez el hallazgo falso era un fallo, no un acierto.

**Lo que este trabajo NO cierra, y hay que decidir:** el checklist de accesibilidad que el sitio
**publica** tiene ocho puntos y **ninguno es el bypass**. Por eso nadie lo echó de menos: la
regla no miraba donde ocurre la cosa (`BRAND.md` §Cómo se escribe una regla, punto 1). Añadirlo
toca `CLAUDE.md` **y** copy publicado en ES y EN del Design System, así que se propone como
tarea aparte en vez de colarlo aquí.

## D47 · Lo que ya está en pantalla no se anima: el LCP no lo paga el reveal — 2026-08-10

**Decisión.** `RevealRoot` marca como mostrados (`data-shown`) los `[data-reveal]` que están en
el primer pliegue **antes** de encender la clase `reveal-on`. Efecto: el contenido del primer
pliegue **no hace fade-up** — se queda como lo pintó el servidor— y todo lo demás sigue
revelándose al llegar a él.

**El orden es la corrección entera.** Como estaba, el HTML llegaba con el contenido visible, se
descargaba y ejecutaba el JS, hidrataba, y **entonces `reveal-on` ocultaba lo que ya estaba
pintado** para devolverlo con una transición de 600 ms. El LCP se registra en el primer frame
con opacidad > 0, así que la métrica principal de rendimiento la estaba pagando una animación
decorativa.

**El diagnóstico, con las cifras del desglose de PageSpeed:** TTFB 120 ms + retraso de carga
280 ms + carga del recurso 50 ms + **retraso de renderizado 2.090 ms**. El 80% del LCP no era
red. Medido en local sobre el build de producción, el mismo patrón, más marcado: imagen
descargada a los 99 ms, **LCP a los 4.032 ms**.

### El aviso de `fetchPriority` era LEGÍTIMO, y eso se descubrió tarde

La primera versión de esta decisión —y la nota de la tarea que la originó— decían que el aviso
de PageSpeed apuntaba al sitio equivocado, porque «la imagen ya lo tiene todo: `priority`, que
emite `fetchpriority=high`, `loading=eager` y el `preload`». **Eso es cierto en Next 15 y falso
en Next 16**, que es el que corre aquí. Se vio al mirar el HTML **servido** del Preview después
de desplegar el arreglo del reveal y comprobar que el aviso seguía ahí:

- El `<img>` salía **sin `fetchpriority` y sin `loading`**. Lo único que `priority` producía era
  el `<link rel="preload" as="image">`.
- La doc que el propio repo lleva en `node_modules/next/dist/docs` lo dice sin rodeos: desde la
  v16 **`priority` está deprecado** en favor de `preload`, y *«en la mayoría de los casos
  deberías usar `loading="eager"` o `fetchPriority="high"` en vez de `preload`»*.

Así que eran **dos defectos y no uno**: el retraso de renderizado (2.090 ms, el que dominaba) y
un atributo que el framework dejó de poner cuando nadie miraba. Los dos hero del sitio —home y
Sobre mí, que son el LCP de sus páginas— pasan a declarar `fetchPriority="high"` y
`loading="eager"` explícitamente; el `preload` se sigue emitiendo.

**La lección es la de `AGENTS.md`, y esta vez costó una afirmación equivocada:** *this is NOT
the Next.js you know*. Lo que un prop hacía en la versión anterior no es lo que hace en esta, y
la comprobación correcta no era leer el JSX —donde `priority` estaba puesto— sino **leer el HTML
que sale por el cable**. Mismo patrón que D39 y D46: *la regla que mira al sitio equivocado no
detecta nada*.

**Se arregla el patrón, no el caso.** La alternativa era quitarle `data-reveal` al hero, que
arregla la home y deja el problema en cada página con contenido en el primer pliegue — y hay
**34 elementos con `data-reveal`** solo en la home. Con esto, cualquier página nueva nace bien.

**El coste, que es visible y por eso se decide y no se cuela:** el primer pliegue ya no entra
con animación. No hay forma de evitarlo —un elemento que empieza en `opacity: 0` retrasa el LCP
por definición—, y además es lo que la regla decía desde el principio: *«una vez al **entrar** en
viewport»* (PRD §21). Lo que ya estaba ahí al cargar no ha entrado.

**Verificado:** en la home, de los 34 `[data-reveal]`, los **4 del primer pliegue** quedan
marcados antes de encender la clase y su opacidad computada es **1** —incluida la imagen del
LCP—; los otros 30 siguen en manos del `IntersectionObserver`.

**MEDIDO el 2026-08-10 sobre el Preview, ya con `npm run psi` (D49):**

| | antes | después |
|---|---|---|
| Retraso de renderizado (móvil) | **2.090 ms** | **~1.090 ms** |
| LCP móvil | — | 2,6–3,0 s · nota **94–96**/100 |
| LCP escritorio | — | 0,7 s · nota **100**/100 · render delay 235 ms |

**El arreglo se llevó por delante la mitad del problema, no el problema entero.** El retraso de
renderizado sigue siendo el **81% del LCP en móvil**, así que queda un segundo largo que no lo
causaba el reveal — y que hay que perseguir aparte, con los avisos que el propio informe deja
señalados (`Render-blocking requests`, `Forced reflow`, `Legacy JavaScript`). Lo que sí cierra
esta decisión es que **la parte que el reveal pagaba ya no se paga**, y que el aviso de
`fetchpriority` (`lcp-discovery-insight`) pasa a **puntuar 1**.

*Nota de método, y es la razón de no meter esto en CI (D49): dos ejecuciones seguidas dieron
96/94 y 2,6/3,0 s. La variabilidad de PSI es de ese orden.*

> **Lo que NO se pudo medir aquí, y hace falta decirlo:** la pestaña que conduce la
> automatización corre con `visibilityState: "hidden"`, y con la página oculta el navegador **no
> emite entradas de LCP, congela `requestAnimationFrame` y no dispara `IntersectionObserver`**.
> Se comprobó que el problema es del entorno y no del cambio creando **un IO nuevo con las
> mismas opciones**: tampoco dispara. O sea que el reveal al scrollear no se ha podido ejercitar
> aquí, y la cifra de LCP tiene que salir de **PageSpeed contra el Preview**, móvil y escritorio.
> Es la tercera vez en dos días que una medida por este canal sale falsa por el estado de la
> ventana (D46 fue la del `:focus`): **el metro tiene un modo de fallo conocido y hay que
> comprobarlo antes de creerse la lectura.**

## D48 · El diccionario se parte por página, conservando el guardián de tipos — 2026-08-10

**Decisión.** `app/[lang]/dictionaries/{es,en}.json` —un único archivo de 1.580 líneas y 76 KB
por locale— pasa a ser **una carpeta por locale con siete archivos**: `common.json` (lo que
necesita toda página: metadata, nav, footer, breadcrumb, related, consentimiento y contacto),
`home.json` y uno por cada página propia. Cada página carga **su rama y la común**, no el resto.

**El reparto, medido antes de partir.** `designSystem` era el **44%** del archivo y `brandKit`
el **17%**: el **61% del diccionario eran las dos páginas showcase**, las que menos visitas
tienen. La home usaba ~9 KB de los 59,5 que parseaba.

**Lo que esto NO arregla, y hay que decirlo porque la tarea lo daba por hecho.** Nada de esto
llegaba al cliente: el módulo es `server-only` y a los componentes de cliente solo se les pasa
la rama que renderizan. Y desde que las seis páginas se prerenderizan (D25, el mismo día),
parsear de más es un coste de **build**. Las razones que quedan son las buenas, pero no son de
rendimiento: **el deep-dive añade siete páginas de contenido**, y editar copy en un archivo de
1.580 líneas es una invitación al conflicto.

**La restricción que no se negocia — y que decidió la forma.** Los tipos se derivan del JSON
**español** y cada cargador se anota con ese tipo, así que si `en` pierde una clave que `es`
tiene, **el build falla** (D11). El helper `cargador<T>` recibe el tipo **explícito** y no lo
infiere a propósito: inferirlo de los dos cargadores daría la **unión** de ambos, y una unión no
falla cuando a `en` le falta algo — que es justo lo único que este módulo tiene que garantizar.
**Verificado disparándolo:** borrando `nav.skipToContent` de `en/common.json`, el typecheck
falla y **nombra la clave que falta**.

**La forma es lo que hace que el cambio no se note fuera del módulo.** Los archivos de página
guardan su rama **desenvuelta** —`brand-kit.json` *es* el objeto `brandKit`— y el tipo
`Dictionary` se recompone en `dictionaries.ts` como la intersección de todas. Así los **25
componentes** tipados con `Dictionary["designSystem"]["tablas"]` y compañía **no cambian ni una
línea**: lo que se parte es la **carga**, no la forma.

**Dos consumidores fuera de las páginas, y los dos siguen bien:**

- **`/llms.txt`** habla de todas las páginas, así que es el único sitio que sigue necesitando el
  diccionario entero. Se recompone ahí con siete imports estáticos, y es barato: la ruta es
  estática, o sea que corre en build una sola vez.
- **El generador del CV** (`scripts/cv/facts.ts`) leía el JSON del locale **desde disco**. Los
  hechos que usa —trayectoria, formación, toolkit— viven ahora en `home.json`. Es la clase de
  rotura que un typecheck no ve, porque la ruta es una cadena.

**Gate:** el HTML servido de las **doce variantes es idéntico**, `/llms.txt` sale **byte a byte
igual** (3.836 bytes) y los dos PDF del CV se regeneran con el mismo tamaño exacto.

## D49 · El número de rendimiento se mide desde la terminal, y a demanda — 2026-08-10

**Decisión.** `npm run psi -- <url>` (script `scripts/psi.ts`) consulta la API de PageSpeed
Insights sobre una URL **pública** —el Preview de Vercel o producción— y imprime lo que se
mira: la nota, las métricas, **el desglose del LCP por fases** y los avisos que no pasan. La
clave de la API vive en `PSI_API_KEY` dentro de `.env.local`; sin ella la API devuelve 429 casi
siempre.

**Por qué existe.** Arreglar el LCP del hero (D47) costó tres idas y vueltas para una sola
cifra —diagnóstico en local, PageSpeed a mano sobre el Preview, resultado de vuelta— y **la
primera vuelta midió un despliegue que aún no tenía el arreglo dentro**, así que la conclusión
fue falsa. Y en local no se puede medir: la pestaña que conduce la automatización corre con
`visibilityState: "hidden"` y el navegador no emite entradas de LCP con la página oculta.

**El desglose del LCP es la razón de fondo, no un adorno.** En D47 el aviso que la herramienta
destacaba —`fetchpriority`— era legítimo pero pequeño; el problema de verdad, 2.090 ms de
«retraso de renderizado», estaba en el desglose. Un script que imprimiera solo la nota habría
ocultado exactamente lo que hacía falta ver.

**Y contra qué despliegue se mide, que es la otra mitad.** El script imprime una **huella**: el
hash de los assets de `/_next/static` que sirve la página. Si no cambia tras un push, se está
midiendo el build anterior. Se eligió así, y **no** una cabecera con el SHA del commit, porque
el sitio mantiene una postura deliberada sobre lo que publica en sus cabeceras (D26) y una
huella contesta la pregunta operativa sin revelar nada.

**A demanda, NO como gate de CI — y es una decisión, no una omisión.** PSI mide desde
infraestructura de Google con variabilidad alta entre ejecuciones: como puerta de un PR daría
rojos falsos, y un gate en el que no se confía se acaba ignorando o desactivando, que es peor
que no tenerlo. El número entra en la conversación cuando se toca algo de rendimiento.

## D50 · Una banda dimensionada por `vw` no cabe necesariamente sobre el pliegue — 2026-08-15

**Decisión.** La foto de apertura de «Sobre mí» mide
`clamp(15rem, min(48vw, 100svh - 14rem), 41rem)`. El segundo término del `min` es el que
faltaba: **el alto disponible**, no el ancho.

**El problema, que no se ve en una pantalla de escritorio grande.** Dimensionar una banda
solo por `vw` ignora que el alto del viewport varía de forma independiente — y el escalado
de Windows lo mueve **sin tocar la resolución física**. Un 1920 al 125% da 1536×~740 de
viewport CSS; al 150%, 1280×~618. En los tres casos el `clamp` topaba en 41rem = 656px, así
que la banda medía lo mismo y en los dos últimos se salía por abajo: la cita-firma, que vive
sobre la foto, quedaba partida por el borde de la ventana.

**Por qué un `svh` proporcional no vale y sí uno con offset fijo.** El elemento no empieza
arriba del viewport: la cabecera y el breadcrumb le comen **12,5rem constantes**. Un `68svh`
—que fue el primer intento— aplica un descuento proporcional a un estorbo que es fijo, así
que sobra alto en pantallas altas y falta en las bajas. `100svh - 14rem` (12,5 de andamiaje
+ 1,5 de aire) descuenta lo que de verdad hay delante. Se usa `svh` y no `vh`/`dvh`: es el
viewport pequeño, estable, sin reflow al recoger la barra del navegador.

**Y al acortarse hay que elegir por dónde recorta.** Un solo `object-position` no puede
preservar cabeza y pies a la vez: anclado abajo, la altura de portátil decapitaba. Se ancla
**arriba** (`object-[68%_0%]`) y la fuente se recorta 84px por su parte superior —exactamente
el aire que sobraba a ancho máximo—, de modo que en pantalla grande no cambia nada y lo que
se pierde al acortar son los pies.

**La aritmética que fija los dos números del `clamp`.** El sujeto ocupa las filas 66→844 de
las 857 de la fuente, así que la figura entera pide **0,505 × el ancho**. El ancho máximo de
contenido es 1280px (`--container` 1360 menos el gutter), o sea 646px, y el tope de 41rem =
656px los cubre. El `46vw` inicial se quedaba hasta **21px corto** entre 900 y 1426px de
viewport —recortaba los zapatos—; `48vw` cubre el rango entero y no alarga nada en pantalla
baja, porque ahí manda el término `svh`.

**El scrim, con las paradas topadas en px.** `min(60%, 13rem)` y `min(100%, 22rem)` en vez de
porcentajes puros: así el velo cubre la cita y poco más, mida lo que mida la banda, en vez de
estirarse con ella.

**El par de contraste no existe en ningún token, así que se mide sobre el píxel compuesto.**
Texto blanco sobre foto + gradiente, en todo el rango de alturas (656→394) y en móvil:
**5,44** la cita (38,4px w600 → texto grande, AAA 4,5), **7,28** el subtítulo (19,2px w400 →
texto normal, AAA 7) y **8,96** la cita del móvil. Metro validado con dos métodos
independientes sobre el mismo caso, como pide `BRAND.md` §Cómo medir sin equivocarse: un
script en Node sobre la fuente da 5,47/7,32 y un `<canvas>` del propio navegador sobre la
variante que sirve `next/image`, 5,58/7,37.

**Dónde vuelve a aplicar.** En los hero de las **seis** páginas del deep-dive —cinco
experiencias y su índice; eran siete hasta que PICKASO se quedó sin página el 2026-08-16, ver
`content/experiences.ts`—. Es el mismo patrón —imagen grande de apertura con texto encima— y el
mismo error está a un `clamp` de distancia.

## D51 · Una herramienta externa entra por el trabajo que resuelve, no por lo buena que sea — 2026-08-16

**Decisión.** Se evaluaron **32 plugins y skills** de terceros (Vercel, Anthropic, Emil
Kowalski, GreenSock, HeyGen, Remotion y otros) contra el trabajo que tiene por delante el
proyecto. Entran **cuatro**; seis quedan aparcadas con caso de uso; **veintidós se
descartan**. La adopción que importa es `agent-browser`, y la parte reutilizable de todo
esto es el criterio, no la lista.

**El criterio, en cuatro preguntas.** Ninguna es «¿es buena?»:

1. **¿Qué trabajo abierto resuelve?** Si no se puede nombrar el trabajo, no entra. Se
   levantó un mapa de siete trabajos (ver, widgets, ilustraciones, motion, auditoría,
   contenido, disparar los gates) y cada candidata se puntuó contra uno.
2. **¿Hay algo propio que ya lo haga mejor?** Este proyecto llega con cuatro gates
   (`gate:html`, `check:palette`, `psi`, `contrast-census`), cuatro skills y un régimen de
   contexto documentado. La mayoría de candidatas resuelven problemas que aquí no existen.
3. **¿Cuánto cuesta en cada arranque, y añade una segunda fuente de reglas?** Es D28
   aplicado a las herramientas.
4. **¿Se puede validar disparándola?** Nada entra sin reproducir antes un resultado que ya
   damos por bueno.

**El patrón que salió repetido en tres bloques independientes, y que es la conclusión
transferible:** *lo que encaja en este proyecto es de **cero JS de cliente** y **se ata a un
evento**; lo que peor encaja **añade cliente** o **añade una segunda fuente de reglas**.*
No se buscó — apareció tres veces por separado, así que sirve de heurística de entrada para
la próxima candidata.

Los tres descartes que mejor lo ilustran, porque los tres eran tentadores:

- **`code-simplifier`** duplica el `/simplify` que Claude Code ya trae **y** codifica el
  `CLAUDE.md` de Anthropic —preferir `function`, módulos ES con extensiones, evitar
  `try/catch`—. Que aquí ya se use `export function` 78 veces frente a 5 arrow es
  coincidencia, no alineación. Segunda fuente de convenciones: es la regla 5 de `BRAND.md`
  en versión ejecutable.
- **`claude-mem`** auto-captura la sesión e **inyecta contexto en SessionStart**, que es
  exactamente lo que D28 combate: reglas precargadas, historia a demanda. Va en dirección
  contraria a la arquitectura, no es que sea peor.
- **`headroom`** ataca la preocupación nº1 del proyecto —la economía de tokens— pero su
  ganancia real para agentes de código es **15-20%** (el 60-95% es para JSON, que aquí casi
  no hay), reescribe lo que llega al modelo e instala Serena a scope de usuario. Y el
  problema **ya se resolvió mejor y sin pérdida**: partir `BRAND.md` (5.954→3.530 palabras),
  disciplina de `@`-import y diccionario por página son victorias estructurales; esto es un
  parche con pérdida sobre algo arreglado en el origen.

**La adopción: `agent-browser` (`vercel-labs/agent-browser`, v0.34.0).** CLI nativo en Rust
que conduce **su propio Chrome por CDP**. No sustituye a `claude-in-chrome` —eso sigue para
lo que necesita el navegador con sesión—; sustituye la parte de **medir y capturar**, que es
donde `claude-in-chrome` falla: en una pestaña oculta no funcionan `:focus`, LCP, rAF ni
IntersectionObserver.

Lo que desbloquea, comando a comando:

| Comando | Qué resuelve |
|---|---|
| `set viewport 1536 740` | **D50 reproducible**: el escalado de Windows al 125% y 150%, sin depender de la pantalla que uno tenga delante |
| `set media dark` · `light reduced-motion` | Puntos 1, 2, 6 y 7 del checklist en ambos temas **y** con motion reducido |
| `a11y --tags wcag2a,wcag2aa` | axe-core nativo; hoy es un paso manual por página × idioma × tema |
| `vitals --json` | LCP/CLS/TTFB/FCP/INP + hidratación, con la pestaña en primer plano |
| `snapshot -i` | Árbol de accesibilidad con refs, para verificar el orden de lectura |

**Validado disparándolo, como exige el criterio 4.** Dos resultados ya conocidos,
reproducidos el 2026-08-16: la home da **0 violaciones** (axe-core 4.12.1, 25 passes, 0
incomplete), y la aritmética de D50 cuadra — la fórmula predice `min(48vw, 100svh−14rem)` =
**516px** a 1536×740 y la banda mide **514**. Si no hubiera reproducido lo conocido, el fallo
sería del metro y no del sitio; es el punto 1 de `BRAND.md` §Cómo medir sin equivocarse.

**Límite conocido, y su forma de trabajo.** ~~La **navegación inicial** no funciona dentro del
sandbox de la sesión: el CLI llega a la red, pero el Chrome que lanza como subproceso no.
Todo lo demás sí, porque opera sobre una página ya cargada en el daemon. El flujo real es
**abrir la URL una vez desde la terminal** (`!agent-browser open <url>`) y conducir desde
ahí.~~

**CORREGIDO el 2026-08-17.** El diagnóstico de arriba era el correcto para el síntoma
observado y **equivocado en su alcance**, y la diferencia importa porque el remedio que
publicaba —abrir la URL desde la terminal— es más caro y no hace falta. Lo que no funciona
bajo el sandbox no es la navegación inicial: es **cualquier comando que tenga que hablar con
el daemon**. Medido en la sesión del 2026-08-17: con el sandbox activo, `agent-browser eval`
se cuelga igual que `open`, y se cuelga **incluso con una página ya cargada** —justo el caso
que la versión anterior daba por bueno—. Con el sandbox de la herramienta Bash desactivado
funciona **todo**, `open` incluido.

Por qué se vio así la primera vez: se probó `open` (falló), se abrió la URL desde la terminal
(funcionó) y se condujo desde ahí (funcionó). Las tres observaciones son ciertas y encajan con
la conclusión errónea, porque **el paso que las separa —conducir con el sandbox activo— nunca
se dio**: al abrir desde la terminal, la sesión seguía conduciendo desde fuera. Es la regla 3
de `BRAND.md` aplicada a un límite en vez de a un hallazgo: *el metro se valida reproduciendo
el caso que ya das por bueno*, y aquí el caso «ya bueno» no se reprodujo nunca dentro del
sandbox.

**El flujo real, entonces:** conducir `agent-browser` con el sandbox desactivado, sin
precondición de terminal y sin límite sobre qué comandos valen. `Bash(agent-browser *)` está
en el allowlist de `.claude/settings.local.json`. **Y el síntoma sigue siendo el mismo, solo
cambia la causa: un comando de `agent-browser` que cuelga es el sandbox, no el daemon — no se
reintenta, se desactiva.**

**Lo que habilita y aún no se ha hecho.** `gate:html` caza drift de marcado; el **visual** no
lo caza nada. Capturas a viewport fijo × dos temas extienden ese patrón a lo que se ve. Idea,
no compromiso.

**Las otras tres adopciones.** `claude-code-setup` (oficial, solo lectura: analiza el repo y
propone hooks — interesa porque los cuatro gates hoy se disparan porque alguien se acuerda,
que es la regla 2 de `BRAND.md`); `typescript-lsp` (go-to-definition y diagnósticos reales
sobre un repo `strict`); y las **skills de motion de Emil Kowalski**, de las que la que
importa es `review-animations`: diez reglas mecánicas con `STANDARDS.md` de curvas y
duraciones que **ya coinciden con las del proyecto** —solo `transform`/`opacity`, `ease-out`
al entrar, <300 ms— así que no traen doctrina ajena, ponen **cifras** a lo que `BRAND.md`
afirma sin ellas. Y traen un matiz mejor que el actual: `prefers-reduced-motion` significa
*más suave, no cero* —conservar opacidad y color, quitar el desplazamiento—, donde hoy el
sitio lo trata como interruptor.

**Dónde se instala cada cosa, que no es obvio y se comprobó.** `.claude/skills/` **está
rastreado por git** en este repo (las cuatro skills propias están commiteadas), así que una
skill de terceros instalada a nivel proyecto deja archivos sin rastrear dentro de un
directorio rastreado y acaba colándose en un commit. Las de terceros van **globales**
(`~/.claude/skills/`, bandera `-g`); las del proyecto siguen en el repo. Los plugins no son
archivos: se listan con `claude plugin list`. Y `agent-browser` no es ni skill ni plugin,
es un binario global de npm.

**Lo que NO se decidió aquí.** El cambio del método de verificación en `CLAUDE.md` —que hoy
dice «Lighthouse + axe con `claude-in-chrome`»— es su propia tarea, en el sprint del
deep-dive y **por delante del diseño**: no es solo para verificar las siete páginas nuevas,
es para diseñarlas, porque D50 vuelve en sus hero y el alto hay que comprobarlo mientras se
dibuja. *(Hecho el mismo día en **D52**, que además encontró que la frase vieja tenía cuatro
cosas mal y solo una era la herramienta.)* Y la técnica de motion elegida para las ilustraciones —`animation-timeline: view()`
en CSS, cero JS de hilo principal y mejora progresiva por diseño— **no se registra todavía
como decisión porque no está validada**: primero se prueba sobre una ilustración.

### Ampliado el 2026-08-18: el primer descarte MEDIDO, y no fue por el precio

`graphify` (Graphify-Labs) era la candidata para cruzar los nueve documentos de gobierno, las 60
D-entries y las secciones numeradas del PRD: convierte código y documentación en un grafo
consultable. Se instaló entera —`winget install astral-sh.uv` → `uv tool install graphifyy` →
`graphify install`, con la skill en **global** porque `.claude/skills/` está rastreado por git— y
se disparó sobre el repo. **Se descarta.**

**La razón que se ve primero es el coste, y es la menos interesante.** El pase semántico se llevó
el límite de gasto mensual por delante dos veces; los chunks que terminaron consumieron ~155-160k
tokens **cada uno**. La parte barata de la herramienta —AST local con tree-sitter, determinista, sin
LLM— **solo cubre el código**, y lo que aquí había que mirar eran los documentos: 326.000 palabras
de prosa. El perfil de coste no es incidental, es lo que la herramienta *es* sobre este corpus.

**La razón que decide es otra, y la dio la propia herramienta en un aviso: «30 source files
produced zero nodes».** Eran los diccionarios JSON de i18n. O sea que el grafo **no ve el copy** —
y D57, D58 y D60, las tres familias de drift reales y recientes de este proyecto, son todas de
copy duplicado entre diccionario, registro y CV. Habría estado ciega justo donde más ha fallado el
repo. Eso no lo dice ninguna comparativa: se sabe **disparándola**, que es la regla de siempre.

**Lo que sí dejó, y se queda escrito porque vale más que el descarte:**

- **La quinta aparición del metro que aprueba sobre lista vacía**, esta vez dentro de nuestro
  propio tooling: `prettier --check "scripts/**"` responde «All matched files use Prettier code
  style!» sobre **cero** archivos, porque aplica `.prettierignore` también a las rutas explícitas.
  Solo con `--ignore-path /dev/null` salen los diez sin formatear.
- **La extracción paralela falla en Windows** (multiprocessing + `<stdin>`) y cae a secuencial. Se
  recupera sola y lo avisa, pero es fricción que ninguna documentación de la herramienta anticipa.
- **Tres de cinco subagentes murieron al ESCRIBIR su JSON**, dejando basura parcial en disco —un
  array pelado, sin esquema y con el nombre de archivo equivocado— que el glob del merge habría
  recogido y que habría roto el paso siguiente sin avisar.

**Y una decisión de método que se sostuvo bajo presión: no se construyó el grafo con lo que había.**
Faltaban `DECISIONS.md` entero, las skills y los PDFs. Un grafo así habría contestado «no encuentro
drift» **por ausencia de datos**, no por ausencia de drift — y el criterio de éxito era justamente
«¿encuentra un drift real que el grep no había encontrado?». Juzgar la herramienta con el metro a
medio montar invalida el veredicto en las dos direcciones.

*Si algún día se reabre, la vía es `GEMINI_API_KEY` (`pip install 'graphifyy[gemini]'`), que saca
el pase semántico del presupuesto de Claude. No merece la pena hasta que el corpus deje de ser
mayoritariamente prosa, o hasta que la herramienta sepa leer los diccionarios.*

## D52 · El gate de accesibilidad deja de dispararse una sola vez, y el eje que le faltaba era el alto — 2026-08-16

**Decisión.** El método de verificación de `CLAUDE.md` §Checklist de accesibilidad —«Verificación
real por página con la skill `claude-in-chrome`: Lighthouse (desktop + mobile) + axe, en claro y
oscuro»— se sustituye por **`agent-browser` conducido por el subagente `viewport-verifier`**
(`.claude/agents/viewport-verifier.md`). Es la mitad de documento de lo que D51 dejó
explícitamente fuera; la mitad de herramienta se hizo en el commit `2db3984`.

**Por qué se cambia, que no es «hay una herramienta nueva» —criterio 1 de D51: qué trabajo
resuelve.** La frase vieja tenía cuatro cosas mal, y solo una es la herramienta:

1. **Medía en una pestaña oculta.** `:focus`, el LCP, `rAF` y el `IntersectionObserver` no
   funcionan ahí, así que media docena de los puntos del checklist se estaban comprobando con
   un metro que no puede leerlos.
2. **Su único eje era el tema.** «En claro y oscuro» nombra el color y no dice nada del
   viewport — y el hueco que llegó a producción (D50) era una combinación de **ancho y alto**
   que el desarrollador no tiene delante: el ancho es el de siempre y lo que cambia es el alto.
3. **Confundía dos medidas en una palabra.** «Lighthouse» era a la vez la **nota** de PageSpeed
   (criterio de aceptación >90, que se mide contra producción con `npm run psi`, D49) y el
   **axe** que trae dentro. Separarlas es lo que impide que adoptar `vitals` —que da métricas,
   no nota— rebaje el criterio sin que nadie lo note.
4. **Se disparaba una vez, al cerrar.** La lección de D50 es que el alto de una banda
   dimensionada por `vw` hay que comprobarlo **mientras se dibuja**: al cerrar ya es un
   rediseño, no un ajuste.

**Lo que cambia de forma, no solo de herramienta: el gate pasa a tener dos disparos.** Uno
**mientras se dibuja** —solo si la sección lleva banda o hero por `vw`— y otro **al cerrar**.
Es la regla 1 de `BRAND.md` §Cómo se escribe una regla aplicada al momento en vez de al lugar:
un disparador que llega tarde no es una regla, es una nota.

**Por qué lo conduce un subagente y no el hilo principal.** El deep-dive son cinco páginas más
el índice × 2 idiomas × 2 temas × 4 viewports: a mano no se sostiene, y el volcado de axe y de
los snapshots comido por la sesión padre es justo lo que D28 evita. `viewport-verifier` mide y
reporta —no edita, no decide si un hallazgo merece tarea— y devuelve un informe corto.

**Lo que NO cambia, y conviene que se lea:**

- **Los 8 puntos publicados**, que son los que el propio Design System del sitio publica. El
  método de verificarlos cambia; la lista, no.
- **La rebaja de «la accesibilidad se hereda»** (`CLAUDE.md`): con todo saliendo de piezas
  existentes solo se verifican los cuatro puntos que dependen del contenido.
- **La nota de PageSpeed sigue saliendo de `npm run psi`** contra producción, a demanda y no
  como gate de CI (D49).

**Lo que queda a mano porque ninguna herramienta lo ve.** El **enlace de salto** de WCAG 2.4.1:
la regla `bypass` de axe se da por satisfecha con landmarks o encabezados y este sitio los tiene,
así que el único incumplimiento de nivel A que ha tenido el sitio sobrevivió a tres auditorías
(D46). El método nuevo no puede quedarse en «correr axe» — se comprueba a mano que el enlace
existe y que su destino está en la página.

**`claude-in-chrome` no se retira.** Sigue siendo la herramienta de lo que necesita el navegador
**con sesión**: el diálogo de consentimiento con su `localStorage`, una Preview autenticada. La
Fase 3 de `design-review` está escrita sobre eso y se queda como está — con la nota de que su
advertencia («el navegador es el de Francisco, no un entorno de pruebas») es precisamente lo que
`agent-browser` no tiene, porque conduce su propio Chrome con perfil limpio. Migrar esa fase es
su propia tarea, no esta.

*Migrada el mismo día (P47.8), y no en V3 como se había propuesto: `design-review` se dispara
**antes** de construir secciones nuevas, así que corría **sobre** el diseño del deep-dive con el
metro retirado. La Fase 3 pasa a **llamar** a `viewport-verifier` para el barrido medible y se
queda solo con los estados a mano y el criterio de diseño; el aviso sobre el perfil de Francisco
queda reducido a su única excepción real (`--profile Default` para una Preview protegida). Tres
cosas que salieron al hacerlo:*

- *El **`incomplete` de axe**: `viewport-verifier` mandaba no volcarlo, y es exactamente donde
  se escondía un par a **4,33:1 en oscuro** mientras el informe decía «0 violaciones» —axe no
  resuelve `color-mix()` y se abstiene—. Corregido: ahora se reporta con sus selectores. Mismo
  fallo de forma que todo lo demás de esta tanda, esta vez **dentro de la herramienta**.*
- *`hover`, `focus` y `press Tab` **existen de verdad** y la pestaña está en primer plano, así
  que los estados se pueden provocar en lugar de leerse del CSS. Eso **puede** hacer innecesaria
  la regla 2 del censo; queda escrito como hipótesis a comprobar contra un par publicado, no
  como cambio de método.*
- *No hay comando de **zoom**, y `set viewport` no lo sustituye (da reflow, no escalado de
  texto). Es el único estado del recorrido que sigue necesitando un navegador de verdad, y está
  escrito como tal en vez de darse por cubierto.*

**Límite conocido, heredado de D51 — y corregido con él el 2026-08-17.** No es la navegación
inicial: es que **ningún comando de `agent-browser` habla con el daemon bajo el sandbox de
Bash**, ni siquiera con la página ya cargada. Se conduce con el sandbox desactivado y sin
precondición de terminal. El síntoma no cambia —un comando que cuelga es eso y **no se
reintenta**—, cambia el remedio: se desactiva el sandbox, no se abre la URL desde fuera. Ver
D51, «Límite conocido».

---

## D53 · La plantilla del deep-dive: una forma para cinco páginas, y el tipo como guardián — 2026-08-17

**Contexto.** P48 monta la plantilla única de `/trayectoria/[slug]`. No son cinco diseños: es
una forma que renderiza cinco contenidos, porque la homogeneidad de la serie la dan el marco y
la longitud y no los títulos (PRD-Historical §42). Eso obliga a decidir dónde vive el contenido
y quién garantiza que las cinco tienen la misma forma.

**Decisión.**

**El contenido va al diccionario, partido por experiencia** (`dictionaries/{es,en}/trayectoria/`),
más una rama `comun.json` con lo que comparten: los rótulos de las cinco secciones y los cinco
campos de Datos. Es copy de página, así que le toca la regla de cero strings hardcodeados; el
dibujo de un artefacto no, y por eso vive fuera (D54).

**Y su tipo es una INTERFAZ EXPLÍCITA, no `typeof` del JSON español.** Es la única rama del
diccionario que lo hace, y la razón es concreta: aquí no hay un archivo por página sino **cinco
archivos que tienen que compartir forma**. Con `typeof emendu.json`, la forma la fijaría la
primera experiencia que se escribió y las otras cuatro cuadrarían por casualidad. Con la
interfaz declarada, `caso` y `resultados` son opcionales **porque el formato dice que lo son**
—«El caso» solo aparece donde hay historia de verdad— y no porque a un archivo le falten.
Sigue haciendo el trabajo de siempre: los cargadores se anotan con ella, así que **una clave que
falte en `en` rompe el build** (D11). Comprobado rompiéndolo.

**El registro de diccionarios va tecleado por `ExperienceSlug`**, y para eso `EXPERIENCES` pasa
de `: Experience[]` a **`as const satisfies readonly Experience[]`**: la anotación clásica
borraba los literales, así que `slug` valía `string` y cualquier cadena pasaba por slug válido.
Con la unión real, registrar el diccionario de una experiencia que no existe es un error de
tipos. Nació `Partial` —mientras solo estaban escritas dos— y dejó de serlo al entrar las cinco:
ahora **añadir una experiencia con `slug` y olvidar su diccionario rompe el build**, que es lo
que impide que la sexta se quede fuera de `generateStaticParams` y del sitemap sin que nadie se
entere. Es el modo de fallo que D44 mata en los logos, una capa más arriba.

**Tres piezas del sistema crecen, ninguna se copia:**

- **`heading.tsx` estrena el tamaño `sub` y `level: 3`.** «La historia» es la primera sección
  del sitio con jerarquía de tres niveles —sus subapartados son libres y cambian de una
  experiencia a otra—, y no podían ser `section-sm` (que abre una sección) ni un `<p>` en
  negrita (que no es un encabezado y rompería el punto 4 del checklist). El nivel es semántica
  y el tamaño es aspecto: separarlos es lo que permite que el `<h3>` de «Resultados» se vea
  pequeño sin dejar de encabezar.
- **`PageShell` gana `parents`**, para el primer breadcrumb de tres niveles del sitio
  (Inicio › Trayectoria › Empresa). Va en el shell y no en la página porque el breadcrumb
  **visible** y el `BreadcrumbList` son dos listas distintas escritas en dos sitios: derivando
  una de la otra no pueden divergir, y un ancestro olvidado en el JSON-LD no lo ve nadie.
- **`ui/page-closer.tsx`** sube el cierre de página entero —sección, rótulo y rejilla de
  tarjetas— desde `site/related-pages.tsx`, al aparecer el segundo caso: el paso a la
  experiencia anterior y siguiente. Sube **entero** y no solo la tarjeta porque lo que no puede
  divergir es el **formato** del cierre: el ritmo vertical propio, el filete y el hueco del
  rótulo. Si solo subiera la tarjeta, el segundo caso volvería a decidir esas tres cosas por su
  cuenta — que es como empezó el drift de las cabeceras (D43).

**La flecha del cierre apunta a donde va, y su posición también.** En la tarjeta de «experiencia
anterior» la flecha mira a la izquierda **y va delante del nombre**: una flecha que apunta a la
izquierda pegada al borde derecho no dice nada. Lo que se lee como «anterior» es el conjunto de
dirección y posición —el patrón de paginación de siempre—, y con las dos tarjetas juntas no hace
falta leer el rótulo para saber cuál es cuál.

**Lo que el gate de HTML cazó, y por qué importa.** El refactor de `related-pages` salió
transparente a la primera, pero al añadir la dirección de la flecha compuse una clase con
`cn()` — y `cn` concatena en tiempo de ejecución, así que `justify-between` se fue al final de
la cadena. Pinta idéntico y es **otro HTML** en las tres páginas del sistema. `npm run gate:html`
lo marcó al instante. Se arregla escribiendo la cadena entera en cada rama, que además es lo que
Tailwind necesita: escanea el código como texto plano y una clase compuesta por interpolación no
se genera, **sin dar error** (punto 5 del método de `BRAND.md`). *Un gate sin criterio propio es
justo el que no te deja decidir por tu cuenta que un cambio «da igual».*

**Lo que NO se duplica.** El cierre enseña el rol y el periodo de las vecinas, y esos salen de
la **misma rama del diccionario que los pinta en Trayectoria**, unidos por `company`. Escribirlos
en el diccionario del deep-dive habría sido la cuarta copia del mismo hecho — justo lo que P48.5
está abierta para arreglar.

### Ampliación (2026-08-17) — el bloque de historia aprende a llevar media, y el corte es de contenido

Al montar KUOTIP e INDYA, el bloque de «La historia» gana **tres campos opcionales**: `imagen`
(captura de producto), `video` (clip de terceros, D55) y `cierre`. Ninguna experiencia los lleva
por omisión, que es lo que mantiene la plantilla única.

**`imagen` va AL LADO del texto y no debajo, y el criterio no es de gusto.** Debajo, a ancho de
contenedor, la captura mide 1.280px y se lee entera —el artefacto de Emendu va debajo por lo mismo, solo que él
scrollea antes que encogerse, y desde P55.5 lo hace también en escritorio (D54)—. Pero **un artefacto hay que LEERLO nodo a nodo y una
captura de producto hay que RECONOCERLA**: a 544px se pierde la letra pequeña del dashboard y
siguen legibles el nombre, la navegación y las tres cifras grandes, que es lo que la imagen viene
a decir. Y decide el contexto: va pegada al párrafo que afirma que las reseñas «seguían
pareciendo de hace veinte años», así que al lado la afirmación y su prueba se leen a la vez.

**`cierre` es la parte reutilizable.** Saca del grid los párrafos que corren a ancho de página por
debajo de la media, y el corte es **explícito y no «el último párrafo»** porque no es una regla de
maquetación sino **de contenido**: `paras` es lo que la imagen ilustra —las tres piezas— y `cierre`
es lo que viene DESPUÉS de haberlas enumerado. Sin ese corte, la columna de texto se alarga por
debajo de la imagen y centrarla en vertical deja de significar nada. Mismo vocabulario que
`caso.cierre`, que hace exactamente esto detrás del artefacto y de los resultados.

**El orden del DOM es texto → media en los dos breakpoints**, así que el orden de lectura no
depende del grid (punto 4 del checklist). El detalle en morado —panel `-soft` desplazado por
detrás del marco, `aria-hidden`, retirado en móvil— es el gesto que ya enmarca las fotos de Sobre
mí, y es morado y no cian porque **el cian es el color de acción y ahí no hay nada que pulsar**.

---

## D54 · Un artefacto se enseña, no se recrea: el diagrama real, saneado y en línea — 2026-08-17

**Contexto.** El deep-dive publica artefactos, y la política del formato ya decía qué son:
**reales, no ilustraciones del método**; uno por página como techo; sin proveedores ni importes;
SVG en línea; nunca una captura de Notion.

**Lo que se probó primero y se descartó.** Se dibujó a mano un diagrama de estados con los
tokens del sitio: seis cajas, tipografía de la casa, colores de marca, conmutando con el tema.
Quedaba bien y **estaba mal**. Francisco lo dijo en una frase que es el criterio entero: *«si un
CPO ve esto, no ve mi trabajo»*. Un redibujo cumple la letra de la política —SVG, pocos nodos—
y **incumple su espíritu**: es exactamente una ilustración del método. El artefacto real —el
diagrama de estados del módulo MDM que Francisco escribió para el equipo de desarrollo dentro de
un product spec— tiene dieciséis estados en cinco grupos, y su valor está en que es el
entregable, no en que sea bonito.

**Decisión: se publica el render REAL de Mermaid, saneado por un traductor.**

- **`content/artefactos/<nombre>.mmd` es la fuente de verdad del dibujo**; el `.svg` de al lado
  es su render. Si el diagrama cambia, se regenera — el artefacto no se edita. Mismo patrón que
  el CV (D22) y los valores publicados (D38).
- **El render lo hace `mermaid.live`, a mano, y no hay tubería.** Meter
  `@mermaid-js/mermaid-cli` en devDependencies arrastra Puppeteer y su Chromium (~150 MB) para
  **un** diagrama: el criterio de D51 dice que una herramienta entra por el trabajo que resuelve.
  Y `mermaid.live` renderiza **en el navegador**, con el diagrama en el fragmento de la URL, así
  que un documento interno no se sube a ningún servidor — que sí habría pasado con
  `mermaid.ink`.
- **`scripts/artefacto-svg.ts` traduce el export**, y las tres cosas que quita no son
  cosméticas: (1) un `<?xml-stylesheet?>` a **cdnjs**, que la CSP no permite y sería la primera
  petición a un tercero de esa página; (2) la **paleta en hex fijo**, que no conmutaría con el
  tema —remapeada a tokens—; (3) el **estado de pan/zoom del editor**, cocido en una `matrix()`
  y sin `viewBox`, o sea el dibujo donde el editor lo dejó.
- **Va INLINE y no como `<img src>`**, y es por lo mismo del punto 2: un SVG servido como imagen
  es un documento aparte y no ve las variables CSS de la página, así que se quedaría con los
  colores cocidos. En línea, cada `var(--brand-cyan)` resuelve contra los tokens. Se lee del
  disco en build (`lib/artefacto.ts`), que en páginas estáticas ocurre una vez.
- **El morado se quedó fuera del dibujo**, y no por gusto: `--brand-purple` da **2,65 contra
  `--background` y 2,81 contra `--card` en tema claro**, por debajo del 3:1 que WCAG 1.4.11 pide
  a un gráfico que hay que entender. Es la misma cifra que D41 ya había medido en los rótulos del
  Brand Kit. El cian sí llega (7,47 / 8,36).
- **El artefacto NO se traduce.** En la página inglesa sale el diagrama en español, como se
  entregó. Traducir un documento real lo convierte en una recreación. Lo que sí va en los dos
  idiomas es su título, su pie y la alternativa en prosa.
- **La alternativa textual no describe el dibujo: lo CUENTA.** El `<svg>` va `aria-hidden`
  —un lector de pantalla no puede seguir flechas— y delante va la secuencia en prosa,
  visualmente oculta.

**El techo de ocho nodos se rompe a propósito.** La política lo fijó **antes de que nadie
hubiera visto un artefacto real**, y protegía la legibilidad; a un mapa de módulo lo que lo hace
legible es **estar agrupado**, no tener pocos nodos. Es la regla 1 de `BRAND.md` otra vez: un
disparador que mira al sitio equivocado.

**Y los dos fallos del traductor, que son la misma lección dos veces.** Ninguno dio error; los
dos se vieron en pantalla:

1. **La caja salía corta y el panel recortaba 586px** —la última banda entera—. El cálculo leía
   cada `rect` como si sus coordenadas fueran absolutas, y en Mermaid **solo lo son las de los
   clusters**: las de los nodos van centradas en el origen dentro de un `<g transform="translate(cx,cy)">`.
   Un nodo en y=1.400 se contabilizaba como si estuviera en y=-22. Ahora se acumulan los
   `translate` de los grupos que envuelven cada forma. No protestó nada porque el SVG lleva
   `overflow:visible`: pintaba fuera de su caja y el `overflow-hidden` del panel lo cortaba.
2. **Las etiquetas salían cortadas** («MODULO_RENTING_ACTI», «CONFIRMACIC») porque el traductor
   cambiaba la tipografía a la del sitio. **Mermaid calcula el ancho de cada caja midiendo el
   texto con su propia fuente**, y esos anchos vienen cocidos en el SVG: cambiar la fuente
   después mueve las métricas y deja el texto sin sitio.

*Las dos son la misma que el redibujo, en pequeño: **tocar un artefacto para que combine mejor
con la página acaba estropeando el artefacto.** Está escrito en el script para que no vuelva.*

**Coste asumido y medido.** La página de Emendu pasa a **229 KB de HTML**, de los que ~62 son el
SVG. No toca el LCP —cuyo elemento es el h1, 284 ms— porque el diagrama está muy por debajo del
pliegue, pero es un salto real y queda tareado medirlo con `npm run psi` (D49) antes de cerrar.

**Lo que queda abierto, y es de Francisco.** El SVG publicado lleva el estado `BAJA_NINJONE`: se
exportó del diagrama original y no del sanitizado que hay en el `.mmd`, donde ese estado se llama
`BAJA_PROVEEDOR_MDM`. Francisco lo revisó y decidió que entra igual —el nombre está mal escrito y
no es el del proveedor—, así que la sanitización queda como pendiente de reexport y no como
bloqueo.

### Ampliación (2026-08-17) — el traductor tenía huecos, y la lista de conocidos falla en silencio

El punto 3 de arriba decía que la paleta en hex fijo «se remapea a tokens». **Era cierto para los
hex largos de Mermaid y falso para el resto.** Al mirar el diagrama servido en **tema oscuro** —no
al leer el código— aparecían **cinco rectángulos blancos**: los cuerpos de los clusters. En el
archivo publicado quedaban **17 declaraciones de color literal**: `fill:#333` en forma corta (la
tabla mapeaba solo `#333333`), tres `fill:white`, dos `fill:black`, cuatro `rgba(232,232,232,.8)`
de las pastillas de arista y hasta un `color:red`, que es con el que Mermaid marca una etiqueta
que no ha sabido resolver.

No lo cazó nada de lo que había: **ni el typecheck, ni el linter, ni `gate:html`** —el HTML era
idéntico; el que estaba mal era el color— **ni el gate de accesibilidad**, porque el texto sobre
los slabs se leía sin problema. Lo que fallaba no era el contraste: era que el modo oscuro, que
es obligatorio, no se aplicaba.

**Lo que se corrige, y el criterio de cada mapeo:**

- **`white` → `var(--card)`, no `var(--background)`.** El «blanco» de Mermaid es su **lienzo**, y
  aquí el lienzo es el panel que envuelve al diagrama, que se pinta `bg-card`. Lo que Mermaid
  deja en blanco —cuerpo del cluster, hueco del estado final, estado compuesto— son **huecos**,
  no superficies nuevas. El relleno de NODO se queda en `--background`, un peldaño por debajo del
  panel en los dos temas, que es lo que hace que la caja se vea.
- **`rgba(232,232,232,.8)` → `var(--muted)`, no `--card`.** Esa pastilla existe para tapar la
  flecha que pasa por detrás del texto; fundida con el lienzo dejaría de hacer su único trabajo.
- **`black`, `red`, `#333` → `var(--foreground)`**; y las `filter:drop-shadow(… rgba(185,185,185) …)`
  del tema `neo` se retiran igual que ya se retiraban las del atributo — hoy están inertes, pero
  un artefacto que use `neo` las heredaría.

**Y la parte que importa: el guardián.** Ampliar la tabla arregla este archivo y no el siguiente.
Una **lista de colores conocidos falla en silencio**, que es exactamente lo que pasó. Así que el
script ya no comprueba que los conocidos cuadren, sino que **no queda NINGÚN literal**: cualquier
`fill`/`stroke`/`color`/`background-color`/`flood-color`/`stop-color` cuyo valor no sea
`var(--…)`, `none`, `transparent` o `currentColor` **aborta la generación** con la lista y no
escribe el archivo. Es el mismo giro que D38 le dio al guardián de la paleta: **buscar la
ausencia, no comprobar las copias conocidas.**

*Validado disparándolo* (la regla 3 de `BRAND.md`): con `fill:#ff00aa` y `color:rebeccapurple`
inyectados, sale con código 1, los lista y no escribe. También caza un remapeo a medias — con
`#9370DBff` deja `var(--brand-cyan)ff`, que tampoco pasa el permitido.

**Consecuencia operativa que conviene saber:** el **export crudo de `mermaid.live` no está en el
repo**, solo su resultado. La regeneración se hizo pasando el propio SVG saneado por el traductor,
que es idempotente para los pasos ya aplicados (mismo `viewBox`, diff de una línea dentro del
`<style>`). Funciona, pero deja la entrada del traductor sin versionar: **queda por decidir si el
export crudo debe guardarse** cuando llegue el segundo artefacto.

### Ampliado el 2026-08-18 · el render deja de ser manual, y el `viewBox` no se puede verificar sin verlo

**Esto revierte lo que este mismo ADR argumentaba, y el matiz importa: el criterio de D51 no
cambia — lo que era falso es el supuesto.** La cabecera del `.mmd` decía que no había script
porque «es UN diagrama, una vez» y porque `@mermaid-js/mermaid-cli` arrastra Puppeteer y su
Chromium. **No fue una vez.** El SVG publicado se había exportado del diagrama **sin sanear**, así
que llevaba el estado `BAJA_NINJONE` —el nombre del proveedor de MDM, que el product spec declara
invisible para el cliente final— mientras la fuente `.mmd` sí estaba saneada. Es exactamente el
error que se cuela por un paso manual. Ahora: **`npm run artefacto`**.

- **No se descarga ningún Chromium.** `scripts/mermaid-puppeteer.json` declara
  `channel: "chrome"`, o sea el Chrome ya instalado. Se llegó ahí porque npm bloqueó el
  `postinstall` de Puppeteer; el bloqueo resultó ser mejor solución que aprobarlo.
- **El render sigue siendo LOCAL**, que era la condición real que hacía válido mermaid.live
  frente a mermaid.ink: el diagrama no sale a ningún servidor. Y es **determinista** — dos
  ejecuciones dan el mismo byte, así que regenerar no ensucia el diff.

**EL FALLO QUE ESTO DESTAPÓ, y es el que generaliza: `cajaDelGrafo` estaba pisando un `viewBox`
mejor que el suyo.** Esa función existe porque el export de mermaid.live **no traía `viewBox`** y
había que deducirlo. El de `mermaid-cli` sí lo trae, y es autoritativo: lo calcula Mermaid, que es
quien ha colocado cada nodo. Recalcularlo encima daba **3.070×2.692 frente a 2.192×1.742** —un 40%
más ancho y un 55% más alto que el dibujo—, así que el grafo ocupaba **dos tercios de su propio
lienzo**: en la página, un diagrama al 40% de escala con la mitad del panel vacía. Ahora se usa el
propio cuando lo hay y el cálculo queda de respaldo.

**No lo cazó nada automático** —el SVG era válido, los colores estaban en tokens y el guardián de
literales pasaba— **sino mirar la página**. Es la misma familia que el resto de metros de este
repo, con un límite nuevo que conviene recordar: *el `viewBox` es de las pocas cosas de un SVG que
no se pueden verificar sin verlo*, porque nada de lo que se puede comprobar en el archivo cambia
cuando está mal.

**Y el tamaño en la página NO era un fallo, era una decisión sin tomar.** El contenedor decía en
su comentario que el diagrama «scrollea dentro de su panel en vez de encogerse hasta ser
ilegible» y hacía lo contrario: con `w-full` y un mínimo de 46rem solo scrollaba por debajo de
736px. Se probaron las dos **viéndolas servidas** (Francisco): a 1:1 con scroll horizontal el
texto se lee pero el diagrama **se sale**, y en una pantalla normal solo entra la mitad — *una
máquina de estados que no se ve entera deja de contar lo que vino a contar, que es la forma del
proceso, no cada etiqueta*. Se queda **a ancho de panel**, que con el `viewBox` ya corregido llena
la caja y gana un 42% sin tocar nada más. **Ese mínimo pasó a 96rem el 2026-08-29** y con él el
diagrama dejó de entrar entero en escritorio: ver el addendum al final de esta entrada, donde
está el porqué y lo que cuesta.

**Y aquí decía que la palanca, si las etiquetas se quedaban cortas, era «renderizarlo con una
tipografía mayor». ERA FALSO, y no un matiz: se hizo, se midió y se descartó** (2026-08-29,
P55.5). Funciona en la cifra y recoloca el grafo entero, que es justo lo que este párrafo dice
que no se puede perder. Lo que sigue siendo cierto es la mitad negativa: **no se escala el dibujo
después del render**, que es lo que este ADR prohíbe. La palanca buena está en el addendum.
*(Y el «(10px)» que llevaba esta frase también era falso: los 44 rótulos son de 16 unidades; los
`font-size:10px` de la hoja son selectores del renderer v1, que este diagrama no usa.)*

De paso, la región que scrollea pasa a ser **operable con teclado** (`tabIndex` + nombre
accesible). Entonces solo scrollaba en móvil, pero ahí quien navega con teclado no llegaba a lo
que queda fuera (WCAG 2.1.1). Hueco preexistente que el experimento del 1:1 hizo evidente, y que
desde el addendum importa el doble: hoy scrollea también en escritorio.

### El mínimo pasa de 46 a 96rem, y la palanca que este ADR nombraba no valía — 2026-08-29 (P55.5)

**Por qué había que tocar algo.** `check:figuras` (D124) pide **11px pintados a 360**, y un rótulo
dentro de un `viewBox` se pinta a `unidades × (ancho pintado / ancho del viewBox)`. Con 16 unidades
en un lienzo de 2.192 anclado a 736px, salían **5,4px**. Y este lienzo no se encoge con el hueco
—lo ancla su `min-w`—, así que solo tenía dos palancas.

**La palanca A, re-renderizar: medida y rechazada.** A 56 unidades el rótulo llega a 11,3px, y la
ganancia es real pero viene del salto de línea (el lienzo crece de alto, que no entra en la
escala): 16u → 5,4px · 24u → 7,3 · 32u → 9,0 · 40u → 10,3 · 48u → 10,9 · 52u → 11,1 · 56u → 11,3 ·
64u → 11,5. Se rechazó por **cuatro defectos que solo se ven mirando la página**, y los cuatro los
señaló Francisco:

1. **Recoloca el grafo.** Mismos 22 nodos, 22 aristas, 20 etiquetas y 5 clusters —comprobado nodo a
   nodo, no entra ni sale ninguno—, pero dagre vuelve a correr y los pone en otro sitio. *En una
   máquina de estados la colocación es parte de lo que se cuenta*, que es el mismo argumento con el
   que este ADR eligió el ancho de panel.
2. **Los cinco títulos de cluster quedan tapados por un nodo** (71/57/33/17/0% del rótulo cubierto).
   Es un fallo de Mermaid, no del sitio: `roundedWithTitle` **resta** el alto del título del alto
   del cluster en vez de sumarlo, así que los hijos se meten en su banda. **No tiene ajuste** —
   `state.nodeSpacing`, `state.rankSpacing`, `state.padding` y `wrappingWidth` devuelven un SVG
   byte a byte idéntico, porque `state.*` es config del renderer v1 y esto es `stateDiagram-v2`— y
   **no hay tamaño intermedio limpio**: aparece en cuanto la tipografía pasa de 16 y crece
   monótonamente.
3. **El rótulo se leía tan grande como la prosa**: 17,6px a 1.280 contra los 17px del cuerpo del
   deep-dive. Una figura no puede rotular como su propio texto.
4. **El lienzo pasaba a 3.652×6.146**, o sea 1.935px de alto en escritorio, con huecos vacíos a
   los lados.

**La palanca B, ensanchar el mínimo: es la que se queda.** `min-w` de 46rem a **96rem** (1.536px):
`16 × 1536 / 2192` = **11,21px**, con el dibujo intacto y **constante en los cuatro viewports**
—antes iba de 5,4 a 8,4 según el ancho—. De paso resuelve el defecto 3 al revés: el rótulo pasa a
leerse por debajo del cuerpo.

**Lo que cuesta, dicho entero, porque contradice en parte la decisión del 2026-08-18:** el
diagrama **ya no entra en el panel en escritorio** (1,3 pantallas a 1.280, 1,2 a 1.920) y en móvil
pide 4,8 pantallas de desplazamiento en vez de 2,6. Se acepta porque a 5,4px no se leía en ninguna
de las dos, y porque el argumento original —«una máquina de estados que no se ve entera deja de
contar la forma del proceso»— se sostiene mejor con B que con A: B conserva la forma, A la
cambiaba.

**Y `check:figuras` deja de mirar hacia otro lado.** Los lienzos anclados por `min-w` estaban
«medidos y no juzgados» desde el 2026-08-24 porque no se sabía si tenían arreglo. Ahora se juzgan
como el resto: 38 lienzos y 420 rótulos, ninguno por debajo del suelo. Se siguen listando aparte
solo porque su salida es otra, y ahora está escrita: **la palanca es su `min-w`, no el dibujo**.

---

## D55 · Un vídeo de terceros entra con facade, y el clic es el gate — 2026-08-17

**Contexto.** §43 decidió primero que el vídeo vive fuera del sitio, y al día siguiente se afinó:
**un vídeo sí puede ir dentro si es PRUEBA y no resumen.** Un vídeo-resumen del deep-dive
*sustituye* la lectura y compite con «En un minuto», que es la pieza diseñada para ese trabajo
exacto; un clip de terceros dentro de la narración hace lo contrario — es evidencia, dura
segundos y no sustituye a nada. **Lo que decide no es el formato, es qué trabajo hace el vídeo en
la página.** Con ese criterio entran dos: la entrada de Pau Gasol en el accionariado de INDYA y
el vídeo de producto de TheTool.

**Decisión: `components/ui/video-embed.tsx`, con facade y sin nada de terceros hasta el clic.**

- **Facade.** Hasta que alguien pulsa **no hay iframe en el DOM**, ni JS de YouTube, ni una sola
  petición a Google. Verificado sobre el HTML servido de las dos páginas: cero `<iframe>`; la
  única aparición de «youtube» es el texto del pie. El reproductor son cientos de KB antes de que
  nadie decida verlo; con el facade se pagan ~40 KB de póster y nada más.
- **El póster se auto-hospeda.** Tirar del thumbnail de `i.ytimg.com` haría **justo la petición a
  un tercero que el facade viene a evitar**, y encima obligaría a ampliar `img-src`. Se descarga
  una vez, se convierte a WebP y se versiona en `public/img/`.
- **CSP: `frame-src` suma `https://www.youtube-nocookie.com`.** Es **la segunda ampliación de la
  CSP desde Clarity** (D32) y con su mismo criterio: el origen exacto que hace falta, nunca el
  comodín. Y es `-nocookie` y no `youtube.com` por una diferencia que no es cosmética: el dominio
  normal escribe cookies publicitarias en cuanto se pinta el iframe.
- **El clic ES el gate de consentimiento**, y no se cuelga de una categoría de `lib/consent.ts`.
  Antes del clic no hay nada que consentir —ningún almacenamiento, ninguna petición—, y el clic
  es un acto explícito e informado porque el pie dice qué va a pasar al pulsar. **Es más estricto
  que gatearlo por categoría, no menos: quien acepte todas las cookies tampoco carga YouTube sin
  pulsar.**
- **Línea en la política de cookies** (D18): sección propia, **fuera de la tabla**. No tiene
  nombre, ni proveedor activo, ni duración mientras nadie lo reproduzca, así que meterlo en la
  rejilla obligaría a inventarse las tres columnas.
- **`title` en el iframe** —es lo único que un lector de pantalla tiene para saber qué hay dentro
  del marco— y `aria-label` en el botón. El póster va con `alt=""` porque el botón ya está
  nombrado: repetirlo lo anunciaría dos veces.

**Y el fallo que solo se veía mirándolo: el disco de play desaparecía.** El póster de TheTool es
el teal de su marca, casi el cian del sitio. Medido sobre píxeles pintados, el disco daba **2,81
en oscuro y 2,59 en claro** contra él — por debajo del **3:1 que WCAG 1.4.11 pide a un
componente**. No lo ve axe (no evalúa contraste de gráficos), no lo ve el typecheck y no lo ve
`gate:html`.

*Un control de color FIJO sobre un fondo ARBITRARIO no puede garantizar el umbral.* Es D41 otra
vez, pero con el fondo fuera del sistema de tokens: ahí no hay un token que ajustar. Se resuelve
con **dos piezas, y ninguna sobra**:

1. **Velo sobre el póster, de `--background` y nunca negro.** Un velo negro arregla oscuro y
   **empeora claro** (1,45 → 1,05), porque acerca el póster al cian oscuro del tema claro. El del
   fondo sirve porque **oscurece en oscuro y aclara en claro**: aleja el póster del disco en los
   dos temas. El **0,35 está medido, no elegido** — 0,25 falla en claro (2,85) y 0,30 se queda
   justo en 3,00, sin holgura.
2. **Anillo de `--primary-foreground` en el disco**, porque el velo solo no cubre cualquier
   póster. Con el control de **dos tonos** siempre hay un borde que pasa, aunque cambie cuál:

   | página | tema | disco/póster | anillo/póster | anillo/disco |
   |---|---|---|---|---|
   | TheTool | oscuro | **3,50** | 2,39 | 8,36 |
   | TheTool | claro | **3,22** | 2,46 | 7,93 |
   | INDYA | oscuro | 2,73 | **3,06** | 8,36 |
   | INDYA | claro | **3,97** | 2,00 | 7,93 |

   El de INDYA en oscuro **lo salva el anillo y no el disco**: su póster es un tono piel/madera de
   luminancia media, justo la zona donde el cian claro del tema oscuro se le acerca. Ese caso es
   la razón de que el anillo exista. El borde interno anillo/disco es **8,36 / 7,93 siempre**,
   porque es un par de tokens del sistema y no depende de lo que haya detrás. La regla en presente
   está en `BRAND.md` §Un control sobre una imagen; el porqué fechado, en `BRAND-historical.md`.

**Dos lecciones de método, las dos de la misma familia.** *(Regla 3 de `BRAND.md`: valida el
metro antes de creerte el hallazgo.)*

1. **El modelo aritmético daba 3,56 donde la pantalla daba 2,81.** El modelo partía de un teal
   muestreado en otro punto del póster. Las cifras publicadas son las de los píxeles pintados, y
   **sustituidas**, no anotadas al pie (regla 6).
2. **El primer muestreo del anillo caía sobre el triángulo** y daba `anillo/disco = 1,01`, que es
   imposible. Se corrigió muestreando en polares a 225° —fuera del glifo, que va centrado y 3px a
   la derecha— y **detectando el anillo por barrido radial** en vez de a un radio fijo, porque
   `getBoundingClientRect` **no incluye el `box-shadow`**. La señal de que el metro quedó
   calibrado: el anillo sale exactamente `--primary-foreground` en los dos temas.

**El póster de TheTool venía con bandas de letterbox**, y se recortaron **midiendo filas y no a
ojo**: el fotograma útil es 640×336 (1,9:1), no 16:9. Un recorte «de 60px» dejaba 12px de negro
arriba y abajo.

**Coste de contenido que se asume.** El póster de INDYA lleva «PAU GASOL SE UNE A INDYA» quemado
en español, y el vídeo también lo es. En la página inglesa el `title` lo avisa, pero el fotograma
seguirá en español — coherente con la regla del artefacto (se enseña como se entregó, D54).

**AVISO FECHADO (2026-08-17, gate de cierre de P48): la promesa de arriba depende del metro, y
con un metro más estricto no se sostiene.** Las cifras de la tabla se muestrean en puntos
concretos del perímetro (225° y sus vecinos). Volviendo a medir con el **peor de 144 ángulos**
—barriendo el perímetro entero— ningún borde externo llega a 3:1 en ninguna de las dos páginas:
anillo↔póster **1,49 claro / 1,66 oscuro** en INDYA y **1,00 / 2,02** en TheTool; disco↔póster
**2,46 / 1,83** y **2,84 / 1,08**. Lo que sí se reproduce exacto es el borde **interno**:
**7,93 / 8,36**, porque es un par de tokens y no depende del póster.

No es que una medición desmienta a la otra: **miden cosas distintas**, y la pregunta abierta es
cuál es la autoritativa. WCAG 1.4.11 no exige que pase cada punto del contorno, sino que el
componente **se distinga** —y con un borde interno a 7,93 se distingue—, así que probablemente no
hay incumplimiento; lo que hay es una regla publicada que promete «siempre pasa uno de los dos
bordes» y describe una garantía que el componente no da en el peor punto.

Y aparece un estado que esta decisión no midió: **en `:hover` el velo se apaga entero**
(`.video-facade:hover::after { opacity: 0 }`), así que el momento en que el fondo es más hostil
es justo el que el 0,35 no cubre. **Tarea abierta P50.35**, con las tres decisiones en orden
—corregir la afirmación, corregir el componente, o recalibrar contra el peor póster y los dos
estados—. *Nota de geometría para quien la retome: en hover el disco escala 1,08, así que
muestrear con el radio de reposo cae DENTRO del disco y devuelve `disco↔anillo = 1,00` — el mismo
fallo que la lección 2 de arriba, en su segunda visita.*

### RESUELTO (2026-08-18, P50.35): se corrige la AFIRMACIÓN, y el componente no se toca

Se barrieron los **144 ángulos del perímetro** en las dos páginas × los dos temas × los dos
estados, componiendo el póster real en un `<canvas>` y aplicando el velo por cálculo, con el
radio de muestreo corregido por el `scale(1.08)` del hover. La cifra que contesta a la pregunta
publicada —«¿pasa al menos uno de los dos bordes en cada punto?»— es el **peor, sobre los 144
ángulos, del mejor de los dos bordes**:

| | reposo (velo 0,35) | hover (velo 0) | velo 0,55 |
|---|---|---|---|
| INDYA claro | 2,82 | 2,84 | 3,69 |
| TheTool claro | 2,86 | 2,87 | 3,97 |
| INDYA oscuro | 2,90 | 2,93 | 3,00 |
| TheTool oscuro | 2,91 | **3,04** | **2,92** |

**Tres conclusiones, y ninguna era la esperada.**

**1 · Subir el velo no es la palanca: es contraproducente por construcción.** El velo acerca el
póster a `--background`, lo que separa al **disco** (`--primary`, lejos del fondo) y **acerca**
al **anillo** (`--primary-foreground`, que *es* prácticamente el fondo). Los dos bordes tiran en
direcciones opuestas, así que no existe una opacidad que gane: a 0,55 pasan tres combinaciones y
la cuarta se queda en 2,92 —y además lava el póster—. *Un velo no puede separar a la vez dos
colores que están en lados opuestos del fondo.* Es la misma familia que D41 (un color fijo contra
dos superficies opuestas), vista desde el otro lado: aquí lo fijo es el fondo y lo opuesto son
los dos tonos del control.

**2 · El estado que no se había medido resultó ser el BUENO.** Se sospechaba que apagar el velo
en hover era el agujero; medido, el hover sale **mejor** que su propio reposo en las cuatro
(2,84 · 2,87 · 2,93 · 3,04), justamente porque quitar el velo aleja el póster del anillo. No hay
nada que arreglar ahí. *La sospecha razonable resultó ir en la dirección contraria, y solo se
supo midiendo el estado entero en vez de razonar sobre él.*

**3 · No hay incumplimiento, hay una frase que prometía de más.** WCAG 1.4.11 pide que el
componente **se distinga**, no que cada punto de su contorno pase 3:1; con el borde interno a
**7,93 / 8,36** —invariante, porque son dos tokens— y un disco relleno de 64px, se distingue. Así
que **el componente se queda como está** y lo que se corrige es la regla: `BRAND.md` §Un control
sobre una imagen deja de prometer «siempre pasa uno de los dos bordes» y publica lo que de verdad
garantiza, con el 2,82–2,91 escrito.

**Lección de método, que es la que se lleva esta entrada:** *no basta con elegir entre corregir
la afirmación o el componente — hay que medir si el componente PUEDE cumplirla.* Aquí las dos
palancas propuestas por la tarea (subir el velo, no apagarlo en hover) resultaron ser una
contraproducente y la otra innecesaria, y eso no se sabía al escribirla.

---

## D56 · La apertura ocupa el pliegue, y `mx-auto` deja de significar lo que significaba — 2026-08-17

**Contexto.** Revisando las cinco páginas del deep-dive servidas, en cuanto la ventana pasa de
unos 700px de alto asomaban por debajo de la apertura el rótulo de «01 — En un minuto» y su primer
bullet. La primera vista dejaba de ser una portada para ser portada más principio de otra sección
— «exceso de texto», en la lectura de Francisco, y tenía razón: el problema no era el contenido,
era que dos unidades de lectura compartían pliegue.

**La aritmética, que es la mitad del porqué.** El bloque de apertura del deep-dive termina
**siempre en 537px**: es tipográfico —eyebrow, h1 a dos líneas con `max-w-[20ch]`, y el `<dl>` de
Datos— y no depende del ancho. Así que lo que sobra crece con el alto de la ventana y solo con
él: **203px a 1536×740, 543 a 1920×1080 y 903 a 2560×1440**. Es el mismo eje de D50 —el **alto**,
no el ancho— llegando por la puerta contraria: allí faltaba sitio, aquí sobra.

**La decisión.** `md:min-h-[calc(100svh-5rem)]` en el contenedor de la apertura, con el grupo
titular+datos centrado (`my-auto`) en el hueco que deja el breadcrumb.

- **La constante no es nueva.** `5rem` y el guard `md:` son los que ya usa el hero de la home
  (`components/site/hero.tsx`), que es el precedente del que sale esto. Inventar otra habría
  puesto dos alturas de nav en el código, que es el olor de D38.
- **Es `min-h` y no `h`, y eso es lo que lo hace seguro.** En una ventana baja —1280×618, que es
  un 1920 con el escalado de Windows al 150%— el contenido natural ya no cabe, la regla no aplica
  y por tanto **no puede recortar nada**. D50 al revés: allí un alto proporcional se comía el
  contenido; aquí solo puede añadir aire por debajo. Verificado: margen real de 43-54px en las
  cinco páginas a 1280×618.
- **Centrado y no anclado abajo, y esto se decidió viéndolo.** El primer montaje anclaba los Datos
  al borde inferior (`mt-auto`). Sobre el papel era mejor —conserva la composición del portátil y
  el aire crece entre titular y datos—; en pantalla, a 1920×1080 deja **~550px de vacío seguido**
  que no se lee como una portada que respira sino como un agujero. Centrado, ese aire se reparte
  arriba y abajo del grupo y la composición aguanta de 618 a 1440px de alto.

**Y la trampa, que es la parte reutilizable.** Al volver **flex** el contenedor, el `mx-auto` del
`WRAP` **cambia de significado**: deja de ser «centra una caja de ancho completo» y pasa a ser un
margen automático del eje transversal, que **por especificación desactiva el `stretch`**. Sin
estirado, la caja se encoge a su contenido —**1.138px medidos a 1.530 de ventana, en vez de
1.360**— y `mx-auto` la centra ahí, desalineada del nav, que sigue en 85. Se arregla declarando
`w-full`, para que vuelva a mandar el `max-w` del propio `WRAP`.

Lo que hay que llevarse no es el `w-full`: es que **una regla de layout puede cambiar de
significado por el contexto de su padre sin dar un solo error de compilación**, y por tanto no se
detecta leyendo el diff. Lo vio Francisco mirando la página, con el breadcrumb desplazado 111px.
Es el punto 5 de `BRAND.md` §Cómo medir sin equivocarse —«verifica la clase, no solo el color»—
aplicado a la maquetación.

**De paso, dos secciones cambian de ancho.** «En un minuto» y «Aprendizajes» pasan a `PROSE`. El
cuerpo del deep-dive va a ancho de contenedor por decisión anterior, pero estas dos no son cuerpo:
son la **entrada** y el **cierre**, que es el tratamiento que aquella decisión ya les reservaba. Y
son **listas**: a 1.280px la viñeta y el final de línea quedan demasiado lejos para que la lista
se lea como lista. La prosa aguanta el ancho porque tiene líneas seguidas que arrastran la vista;
un párrafo por punto, no.

**Verificado con el gate (D52) en su segundo disparo**: la segunda sección arranca justo bajo el
borde en 1920×1080, 1536×740 y 1280×618, sin recortar nada; nav y contenido alineados en los
cuatro viewports; `PROSE` no desborda a 390px; **0 violaciones de axe** en home y las cinco
páginas, en los dos temas. **Pendiente de llevarlo a Brand Kit, Design System, Accesibilidad y
Cookies** (tarea P59.5) — y ahí no se aplica a ciegas: sus aperturas son de alto **variable**,
así que hay que medir cada una.

---

## D57 · Las tres longitudes de una experiencia son un solo dato — 2026-08-17

**El problema, y no era hipotético.** De una experiencia se cuenta **lo mismo en tres
longitudes**: la frase de la fila de Trayectoria en la home, el bullet del CV y su gemelo largo
de «En un minuto» en el deep-dive. Hasta hoy vivían en **tres archivos sin relación** —
`dictionaries/{es,en}/home.json`, `content/cv/content.{es,en}.ts` y
`dictionaries/{es,en}/trayectoria/<slug>.json`—, seis strings por experiencia contando idiomas, y
**nada en el build los ataba**: ni el typecheck, ni el linter, ni `gate:html`.

Al derivarlas las cinco aparecieron **ocho divergencias reales**:

- **Siete cifras que solo existían en el deep-dive** — `+13% de conversión` y `+5% de ARPU`
  (INDYA), `75%` (Freepik), `23% → 90%`, `0 → +50 clientes` y `7 semanas de producto` (Emendu),
  `7 meses antes que el mercado` (TheTool).
- **Una que solo existía en el CV**: el `38%` del hub de Emendu. La regla 1 del formato de
  deep-dive dice que esto funciona **en las dos direcciones** y **nunca se había ejecutado en
  esa**; ahora el deep-dive la adopta.
- **Una cobertura descuadrada**: KUOTIP tenía **3** bullets en el CV y **4** en su página.
- **Una divergencia de HECHO**, que es la que ninguna comparación de cifras habría cazado: el CV
  decía «**construí** el MVP con una UI visual moderna» y el deep-dive «**definí** el MVP **junto
  al product designer**». No es la misma afirmación.

**La pieza: el emparejamiento deja de ser convención y pasa a ser estructura.** En
`content/experience-copy/` el bullet corto y el largo son **el mismo elemento del array**
(`{ cv, deep }`), así que no se puede escribir uno sin su pareja porque son el mismo objeto. Es
el giro de **D44** aplicado al copy — la unión deja de ser posicional entre dos listas y pasa a
ser un campo del dato — y el de **D38** aplicado a las cifras: se busca la **ausencia**, no el
patrón. `ExperienceCopyMap` es un `Record` sobre la **unión** de empresas registradas, así que
añadir una experiencia sin copy no compila (mismo mecanismo que `DeepDiveDict`, D53).

**Dónde vive, y por qué en `content/` y no en el diccionario.** El precedente ya estaba escrito:
el comentario de `content/cv/types.ts` dice que el CV vive en `content/` y no en `scripts/`
*«porque el texto rico del CV es también el origen del deep-dive»*, y `trayectoria.tsx` ya componía
cada fila mezclando diccionario + `experienceOf()`. Añadir la descripción a ese lado es lo que la
fila **ya hacía con el logo**. El diccionario se queda con lo que es copy de **una** página: el
título de la sección, sí; sus bullets, no.

**Cuatro consumidores, ninguno con copia**: `components/site/trayectoria.tsx`,
`components/site/deep-dive.tsx` (que gana `lang` y `slug`), `scripts/cv/generate.tsx` — donde
`AuthoredJob` pierde `bullets` y `Job` los recibe en la fusión, igual que ya recibía rol y
periodo— y **`app/llms.txt/route.ts`, que no estaba en el inventario y lo encontró el typecheck**.

**El guardián** (`npm run check:experiencias`, en CI) comprueba lo que la estructura no puede:
misma cobertura en ES y EN; versión larga **exactamente** en quien tiene página (`slug !== null`,
así que PICKASO está excluida **a propósito** y no por olvido); ninguna cifra en una longitud que
falte en la otra; y que la frase de la home no cite una cifra que ningún bullet respalda. Compara
**solo cifras con forma de métrica** (porcentajes y magnitudes con sufijo), porque el bullet largo
lleva legítimamente números que el corto no —«fase 1», «de 20 a 150 empleados»— y compararlos
todos lo convertiría en ruido.

**Se validó disparándolo, y cazó algo de verdad**: el script one-off que generó el registro
emparejaba mal INDYA y TheTool —buscaba `company:` desde el principio del archivo y daba con los
`milestones`, que repiten los mismos nombres—, así que las dos se llevaron los bullets de Emendu.
Después se rompieron los cuatro modos de fallo a mano y los cuatro dispararon. **Y afirma cuánto
ha mirado** —8 experiencias · 62 bullets · 50 pares de cifras— **fallando si es cero**: es la
lección de los tres metros descalibrados de este repo (el medidor fuera de gamut, el umbral por
tamaño de texto y las reglas `:hover` del censo), *una lista vacía parece un aprobado*.

**El CV vuelve a caber en 2 páginas, y las dos palancas evidentes no servían.** Los bullets
derivados lo mandaban a 3. Medido, no supuesto:

- **Quitar «Habilidades» no devuelve nada** (sigue en 3): estaba en la **cola que desborda**, no
  en la presión. Habilidades y Toolkit caían las dos en la página 3; quitar la primera solo deja a
  la segunda sola allí.
- **Recortar prosa tampoco** (sigue en 3): cada empleo se renderiza con `wrap={false}`, así que el
  bloque **salta entero o no salta**. Se recortaron las cinco experiencias sin perder una sola
  cifra y la página 2 pasó de 71 a 70 fragmentos de texto.
- **Lo que sí cabe es margen ENTRE bloques con el interlineado INTACTO** —decisión de Francisco, y
  el criterio correcto: el interlineado es legibilidad, el margen entre bloques es solo aire—:
  entre bullets `1,4 → 0,8`, entre empleos `4,5 → 3,5`, entre filas de Habilidades/Toolkit `3 → 2`.
  Bajar el interlineado a 1,34 o a 1,32 **sin tocar nada más no cabía**: se podía tocar y no servía
  de nada. Y el umbral es abrupto —`1,0 / 3,8` no cabe y `0,8 / 3,5` sí—, que es el `wrap={false}`
  otra vez: por eso todo fallaba de golpe en vez de acercarse.

**El gate como prueba, con el matiz que importa.** `gate:html` se amplía a **22 variantes** (entran
las cinco del deep-dive × dos idiomas, que son justo las que cambian; estaba tareado en P49 y se
adelanta porque hacía falta aquí). **No sale vacío, y no debía**: este refactor mueve copy *y* lo
corrige a la vez. Lo que prueba es que **solo cambia lo previsto** — 18 de las 22 idénticas byte a
byte, y las 4 que cambian son exactamente las cinco frases de Trayectoria y el `38%` de Emendu.

**Lo que NO resuelve, dicho para que no se dé por cubierto.** `datos.rol`, `datos.periodo`,
`datos.sector` y `datos.reporting` del deep-dive siguen siendo copias a mano de hechos que ya
tienen fuente (el diccionario y el CV), y al compararlos aparecieron **cuatro divergencias más**,
una de ellas una **fecha**: KUOTIP termina en **noviembre** según el diccionario y en **diciembre**
según su deep-dive. Son de hecho, no de longitud, así que las decide Francisco y no un refactor
(tarea **P48.55**). Y el guardián tampoco puede ver que dos textos **digan** lo mismo: «construí»
y «definí junto al product designer» tienen las mismas cifras (ninguna) y afirman cosas distintas.
Eso lo ve una persona — y por eso las dos versiones se editan **una al lado de la otra**.

---

## D58 · El deep-dive es la fuente de los hechos de una experiencia — 2026-08-17

**Ampliación de D57, y con una regla nueva que la decide: cuando dos superficies discrepan sobre
un hecho de una experiencia, gana el deep-dive** (Francisco, 2026-08-17). Su contenido se autora
en Notion y de ahí baja al diccionario; las otras dos superficies —la fila de Trayectoria y el
CV— son derivadas, no fuentes.

**La auditoría se hizo contra el original, no contra el repo.** Los `Datos` de las cinco páginas
se compararon **una a una con sus páginas de Notion**, y las cinco coinciden. O sea que las cuatro
divergencias no estaban en el deep-dive: estaban en las otras dos superficies, y el arreglo es
propagar desde él.

| Hecho | Decía la copia | Dice el deep-dive (y Notion) |
|---|---|---|
| **KUOTIP, periodo** | `Feb 2024 — Nov 2024` (home) | **`Feb 2024 — Dic 2024`** |
| **KUOTIP, sector** | `SaaS B2B · IA / Reviews` (CV) | **`Customer Reviews`** |
| **KUOTIP, reporting** | `Cofundador · junto a la CEO y el CTO` (CV) | **`Cofundador, 1 de 3 socios`** |
| **INDYA, reporting** | `Reporté al CPO y cofundador` (CV) | **`CPO / CTO`** |

**La fecha no era cosmética: se servía mal en seis sitios.** Lo midió `gate:html` — la fila de
Trayectoria en los dos idiomas y las tarjetas de «siguiente experiencia» de **Emendu** y de
**INDYA**, que son las vecinas que enlazan a KUOTIP, también en los dos idiomas. Mientras tanto la
propia página de KUOTIP publicaba la buena. **Un dato duplicado no falla donde se escribe: falla
donde se lee**, y por eso el recuento no es «una fecha mal» sino seis.

**Los cuatro hechos suben al registro** (`content/experience-copy/`), junto a las tres longitudes
del copy que ya guardaba:

- **`role`** y **`period`** — se pintaban en Trayectoria, en los Datos y en el CV. `period` se
  localiza («Actualidad»/«Present»), así que va en el registro por idioma y no en
  `content/experiences.ts`, que es el registro **sin idioma** (logo y slug, D44).
- **`sector`** — era `datos.sector` y el `context` del CV **a la vez**. En las tres experiencias
  sin página guarda lo que el CV llamaba `context`, que no siempre es un sector («Malavida.com»):
  es el mismo campo con un solo consumidor.
- **`reporting`** — a **dos longitudes**, `{ deep, cv }`, exactamente el mismo patrón que los
  bullets y por la misma razón.

**Lo que queda en cada sitio, que es la parte que enseña si el corte está bien hecho:**

- El **diccionario del deep-dive** se queda con `datos: { tamano }` — el único de los cinco que no
  publica nadie más.
- Las **filas de Trayectoria** en `home.json` se quedan con **`company` y nada más**, que además
  es su etiqueta: el diccionario la lleva en forma de display («Ontecnia (Malavida…)») y el
  registro en forma corta, unidas por prefijo.
- **`AuthoredJob`** del CV se queda en **un solo campo**. No es un residuo: es la señal de que la
  experiencia se cuenta en un sitio y lo que el CV aporta de ella es su **presencia y su orden**.
- Y la página de deep-dive **deja de cargar `getHome`**: el rol y el periodo de las vecinas los da
  el registro, así que se ahorra ese parseo en build. El comentario que justificaba esa carga
  —«evita una cuarta copia del mismo hecho»— describía el problema con precisión; lo que no podía
  hacer era resolverlo.

**El guardián gana tres comprobaciones**, validadas rompiéndolas: `role` y `period` presentes;
`reporting.deep` **⟺** la experiencia tiene página; y **el rol no puede diferir entre idiomas** —
los roles de este sitio no se traducen («Product Manager», «Cofounder & Product»), así que una
diferencia ahí es una errata, no una traducción. El **periodo no se compara entre idiomas**, que
ese sí se localiza.

**Verificado con `gate:html`: 16 de las 22 variantes idénticas byte a byte.** Las seis que cambian
son las cinco frases de Trayectoria y el `38%` de Emendu (de D57) más las seis apariciones de la
fecha corregida. Mover cuatro campos fuera de los **diez** diccionarios del deep-dive salió
**transparente**: ninguna de sus páginas cambió un byte.

---

## D59 (completado por D72) · El SEO del deep-dive, y las tres listas de páginas escritas a mano — 2026-08-18

**Contexto.** Las seis páginas nuevas activan el criterio de cierre de `CLAUDE.md` («SEO y datos
estructurados por página, no un extra»). Al ir a cumplirlo apareció que el mismo dato —**qué
páginas tiene este sitio**— estaba escrito a mano en **tres** sitios, y no lo detectaba nada:
una lista incompleta no es un error de compilación.

### Sitemap

- **Las seis del deep-dive se DERIVAN** de `EXPERIENCES` filtrando `slug !== null`, la misma
  fuente que las páginas y que `generateStaticParams` (D44). Y ya no es hipotético: la lista
  acaba de cambiar de seis a cinco con PICKASO.
- **El inglés gana entradas propias.** Antes `/en/…` solo existía como `alternates.languages` de
  la entrada española: el hreflang funcionaba, pero la recomendación de Google es que **cada
  versión sea su propia `<url>` y liste todas las alternativas, incluida ella misma**. De 6 a 24.
  De paso el `x-default` entra también aquí — lo emitía el `<head>` y no el sitemap, y que digan
  cosas distintas es de lo que ninguna herramienta del repo ve.
- **`lastModified` deja de ser `new Date()`**, que marcaba TODAS las páginas como modificadas en
  cada despliegue. Google dice explícitamente que ignora el `lastmod` cuando lo detecta poco
  fiable, así que la señal no era ruidosa: **se estaba tirando**. Ahora es una fecha declarada por
  página, sembrada del historial real.

  **Por qué DECLARADA y no derivada del git**, que era lo obvio: **Vercel clona en superficial**,
  así que `git log -1 -- <archivo>` devuelve vacío para todo lo que no se haya tocado en los
  últimos commits. *Una fecha derivada de un historial que no está no es derivada: es un hueco.*
  El riesgo de que se queden viejas se acota donde se puede — las del deep-dive van en un
  `Record<ExperienceSlug, …>`, así que **añadir una experiencia sin darle fecha no compila**.

### JSON-LD

`experiencePageLd` es **`WebPage` y no `Article`**, decidido con Francisco. `Article` daba
elegibilidad para rich results, pero marcar cinco páginas de carrera como artículos le dice a un
rastreador que esto es un blog —y el PRD §9 es explícito en que no lo es— y pide un
`datePublished` que en una página que cuenta cinco años no significa nada.

Lo que sí aporta: ata cada página a su empresa (`about`) y **al `Person` de la home por `@id`**,
que es lo que permite a Google unir las seis en una entidad en vez de leer seis personas que se
llaman igual.

**No lleva `isPartOf`, y la ausencia es deliberada.** Se escribió apuntando a
`${SITE_URL}/#website` y se retiró al ver que **ese nodo no existe** (el `WebSite` es backlog de
V3). Una referencia `@id` colgante **valida igual** —un validador de esquema no resuelve
referencias— y no significa nada. *Un identificador que ningún nodo declara es peor que no
ponerlo: pasa el control y miente.*

El `BreadcrumbList` de tres niveles ya estaba (lo trajo P48 con `parents`), así que de la tarea
solo quedaba el tipo. `PageShell` gana `extraLd`: un segundo `<script>` y no un `@graph`, porque
son dos afirmaciones independientes y porque fundirlos cambiaría el marcado de las dieciocho
variantes que no lo usan.

### La tarjeta OG, y un fallo que solo se ve renderizando

Las seis pasaban una card desconocida y caían en la de la home: compartir un deep-dive en
LinkedIn —el canal del ICP— enseñaba el sitio y no el caso. Ahora `/api/og` la compone con el
**mismo rótulo y el mismo titular que pinta la página**, leídos de su diccionario.

Y al renderizarla apareció **un fallo preexistente**: el titular montaba sobre los flancos
pastel, y **la «s» de «Política de cookies» ya lo hacía en la tarjeta que está en producción**.
Con rótulos de una palabra el problema no existía; con frases es constante. El tope va en la
columna (800px, calculado contra la geometría de los flancos: su borde izquierdo cae en 944 y la
rotación de 8° saca las esquinas hasta ~923) y vale para las once tarjetas. *Ninguna cifra lo
dice: hay que mirar la imagen.*

### `llms.txt`

No conocía el deep-dive: su lista de páginas no tenía el índice y su sección de trayectoria
nombraba las cinco experiencias **sin URL** aunque sus páginas ya existieran, así que un modelo
que lo leyera no podía descubrir el contenido más profundo del sitio. Ahora cada una enlaza si —y
solo si— tiene `slug`, y añade su titular.

### Verificación

**Schema Markup Validator apuntado al Preview** (la página real, no un snippet pegado): 0 errores
y 0 avisos en el índice, dos deep-dives y sus tres equivalentes en EN, reconociendo
`WebPage` + `BreadcrumbList`.

**La Rich Results Test no se puede correr contra un Preview**, y ahora se sabe por qué
(comprobado, no supuesto): el Preview sirve `X-Robots-Tag: noindex` **y** un `robots.txt` con
`Disallow: /`. La RRT respeta robots.txt, así que reportaría «URL no disponible» sin llegar a
leer los datos estructurados. **Va contra producción después del merge.**

### Y el peso no era el problema (P50.3)

El artefacto inline pone la página de Emendu en 223 KB de HTML, y la tarea nació temiendo que
fuera «el salto de peso más grande del sitio». Medido con `npm run psi` contra el Preview: **no
lo es** —Design System pesa 341 KB y Brand Kit 302, ambos en producción desde hace semanas— y
**el peso del HTML no predice la nota**: el índice pesa un tercio que Emendu (74 KB) y saca
prácticamente lo mismo.

| | HTML | móvil | escritorio | LCP móvil |
|---|---|---|---|---|
| Design System | 341 KB | 94 | 100 | 3,0 s |
| Emendu | 223 KB | 94 | 100 | 3,0 s |
| Home | 203 KB | 97 | 100 | 2,6 s |
| Índice | 74 KB | 95 | 100 | 2,9 s |

Lo que fija la nota móvil es el **retraso de renderizado**: en Emendu el TTFB son 6 ms (0% del
LCP) y el render delay 1.564 ms (100%), el mismo perfil que D47 diagnosticó en la home. **No se
toca el artefacto**: ni carga diferida ni optimización del SVG, que eran las dos palancas
preparadas por si no cumplía.

---

## D60 · Una fuente única evita dos verdades; no mantiene al día una copia impresa — 2026-08-18

**El hueco.** D57 y D58 dejaron los hechos y los bullets de una experiencia con fuente única, así
que la web y el CV **no pueden decir cosas distintas… mientras el PDF se regenere**. Pero el PDF
es un **artefacto commiteado**: al corregir el sector de KUOTIP en `content/experience-copy/`,
los dos PDFs de `public/cv/` se quedaron viejos **en silencio**, y no lo vio nada — ni el
typecheck, ni el linter, ni `gate:html`, ni `check:experiencias`.

Es una familia de fallo distinta a la de D38/D44/D57. Allí el problema era **dos escrituras del
mismo hecho**; aquí hay una sola escritura y el problema es la **copia derivada que no se
recalcula**. La fuente única no cubre el último eslabón cuando ese eslabón es un binario que
alguien tiene que acordarse de regenerar.

**El método se eligió midiendo: el PDF NO es determinista.** Regenerarlo sin cambiar nada da otro
hash —react-pdf sella fecha e ids en la salida—, así que comparar bytes está descartado. Lo que
se sella es la **huella de las ENTRADAS**: el objeto ya resuelto que se le pasa al render, los
dos idiomas. `npm run cv` escribe `public/cv/cv.huella`; `npm run check:cv` la recalcula y falla
si no coincide. En CI.

Para eso `assemble()` y `mergeJob()` salen de `generate.tsx` a `scripts/cv/assemble.ts`: los
necesitan **dos** consumidores, y dejarlos dentro del `.tsx` obligaba al guardián a importar
react-pdf y arrancar un render solo para saber qué datos entran.

**Validado rompiéndolo**, no leyéndolo: cambiando una palabra del sector sin regenerar, el gate
imprime qué ha cambiado y sale con **código 1** —comprobado aparte, porque un mensaje de error
con salida 0 es un gate decorativo—. Y afirma cuánto ha mirado.

**Lo que NO cubre, dicho para que no se dé por cubierto:** un cambio de **estilos** en
`generate.tsx`. Cambia el PDF y no cambia la huella. Es deliberado — hashear el fuente del
generador haría fallar el gate por un comentario, y quien toca los márgenes está mirando el PDF
de todas formas. Lo que se protege es el camino silencioso: tocar el contenido en otro archivo y
no acordarse del CV.

### El tercer hueco NO es mecanizable, y se descartó midiendo antes de construirlo

La idea era atar la **narrativa** del deep-dive a los bullets: si cambia una cifra en «La
historia», que salte. Medido sobre las cinco páginas, **INDYA tiene 5 de 5 cifras de bullet sin
respaldo en su narrativa** — y no es drift, es el formato funcionando: sus bullets llevan las
cifras de crecimiento y su caso va de los marcados, que son otras. Ese gate habría dado **cinco
falsos positivos en una sola página**.

*Un gate ruidoso es peor que ninguno: el primero se ignora y arrastra consigo a los que sí
funcionan.* Lo que cubre ese hueco sigue siendo la regla humana —las dos versiones se editan una
al lado de la otra— y que el deep-dive sea la fuente (D58).

### Y la lección que se llevó la sesión: las skills caducan peor que los `.md`

Lo detectó Francisco preguntando si `update-cv` seguía al día. No lo estaba: en **un solo día**,
D57 y D58 dejaron **nueve** afirmaciones falsas dentro de esa skill — una de ellas peligrosa
(«retocar un bullet del CV no afecta a la web», que desde D57 es exactamente al revés). Y
`design-review` seguía recorriendo «las seis páginas» cuando ya eran doce.

**Una skill es documentación EJECUTABLE**: un párrafo desactualizado se lee con escepticismo; una
skill se **sigue**. Por eso `close-session` gana el paso de comprobar si la sesión ha movido algo
que una skill *describe*, con el comando mecánico que valida rutas y comandos — validado
disparándolo sobre las cinco. Y la misma caducidad afecta a las **cabeceras de los módulos**:
`scripts/cv/facts.ts` seguía anunciando que leía «periodos y roles» del diccionario meses después
de dejar de hacerlo.

### Tercera instancia (2026-08-19): un PNG con cifras dentro

La social preview del repo decía «doce páginas bilingües, WCAG AAA en ambos temas y **ocho
guardianes en CI**». Los tres datos eran ciertos el día que se generó, y el tercero estaba a una
línea de YAML de dejar de serlo. Misma familia que el PDF: una **copia impresa** de datos que
viven en otro sitio.

**Pero aquí la salida de D60 no está disponible.** Al CV se le pudo poner guardián porque el
consumidor del artefacto es el repo. La social preview la sirve GitHub desde *Settings*, y **no
acepta una URL**: exige un fichero subido a mano, así que tampoco vale generarla como el OG del
sitio (D14). Un guardián podría avisar de que la cifra cambió, pero no puede actualizar lo que
GitHub enseña.

**Cuando no se puede automatizar la copia, se quita el dato.** El claim pasa a ser cualitativo
—«web personal bilingüe, con el sistema de diseño y la accesibilidad publicados en el propio
sitio»— y las cifras se quedan donde ya estaban vivas: `README.md` y `PRD-Live.md`, que se editan
en el mismo PR que las cambia. *Un dato que no puede tener guardián no es un dato: es una
promesa.*

Queda dentro «Next.js 16», a sabiendas: una major es un acto deliberado y visible, no un contador
que se mueve solo.

## D61 · Una superficie también cambia por ESTADO, y el atenuado no se enteraba — 2026-08-18

**El hueco.** D39 hizo que el atenuado lo resolviera la superficie y no el punto de uso, y su
promesa —«una tarjeta nueva nace bien sin pedirlo»— se cumplía en los **dos ejes que el bloque de
`globals.css` miraba**: la clase (`.bg-card`, `.bg-muted`) y el atributo (`data-surface`). Faltaba
un tercero, y es el que este sitio tiene peor cubierto por construcción: **el estado**.

`hover:bg-muted` no compila a `.bg-muted`. Compila a `.hover\:bg-muted:hover`, y además dentro de
`@media (hover: hover)` — **otro selector**. Así que una tarjeta que se aclara al pasar el cursor
cambiaba de fondo sin recalcular su atenuado: el texto se quedaba con el valor derivado de
`--card` encima de un fondo que ya era `--muted`.

**Medido antes de tocar nada**, en el rótulo de la tarjeta de cierre (`components/ui/page-closer.tsx`,
que es el cierre de **las doce páginas**) y en las tarjetas del índice de Trayectoria:

| Estado | Claro | Oscuro |
|---|---|---|
| Reposo (`mutedOnCard`, correcto) | 9,14 | 10,32 |
| **Hover, como estaba** | **7,79** | **9,01** |
| Hover, como debía (`mutedOnMuted`) | 8,17 | 9,17 |

**No llegaba a incumplimiento, y por eso importa decirlo bien: lo que fallaba no era el color,
era el MECANISMO.** AAA aguantaba por 0,79 en claro — la holgura de hover más fina del sitio —,
pero fallaba en el eje que **solo existe mientras el cursor está encima**, que es el punto ciego
histórico de este proyecto: es el mismo sitio donde se escondió el quinto uso de `tone: "muted"`
(la dirección de email de Accesibilidad, D55/P50.36) y el mismo que el censo no vio durante meses
por su bug de CSS Nesting.

**Se arregla en la capa, no en los dos call sites, y no es preferencia:** `data-surface` es
**estático** y no puede describir una superficie que cambia con el estado, así que declararlo en
la tarjeta no habría servido. La regla nueva vive en `app/globals.css`, junto a las otras cuatro.
Se cubre también `focus-visible:bg-muted` —el mismo cambio de superficie por la otra puerta, que
usan `outline-neutral` y `ghost` de `action.tsx`— aunque hoy ningún control con ese estado lleve
texto atenuado: es la misma decisión, y dejarla a medias es cómo vuelve el fallo.

**De paso era un par número 14 que ninguna página publicaba** — la regla 4 del censo dice que si
el DOM tiene más pares que la tabla, la tabla está incompleta. Aquí la conclusión es mejor que
añadir una fila: **arreglar la causa colapsa el par en `mutedOnMuted`, que ya está publicado**. Se
arregla la capa y desaparece la fila que si no habría que mantener.

**Verificado remidiendo sobre producción**, no sobre local: 8,17 claro / 9,17 oscuro, que es
exactamente el valor predicho antes del cambio. El censo pasa de indexar 21 reglas `:hover` a 23.

**Cómo se encontró, que es la parte reutilizable.** No lo encontró el censo corriendo como
siempre: lo encontró `design-review` preguntándose **por qué `BRAND.md` publicaba «8 páginas × 2
temas»** cuando el sitio tiene doce. Al correr las seis que faltaban apareció el par. *Un metro
bien calibrado que no se pasa por todo el sitio sigue siendo un metro que no ha mirado.*

---

## D62 · El 404 de una ruta que CASA no lo cubre `global-not-found`

**Fecha:** 2026-08-19 · **Contexto:** Sprint Lite, P51 · **Estado:** aplicada

Diez rutas del sitio —los cinco deep-dive × dos idiomas— servían en producción el «404 · This
page could not be found» **por defecto de Next**: Times New Roman, sin nav, sin footer, sin el
«0» del split, y con el `<title>` de la home. Lo reportó Francisco con una captura de
`franciscolopez.es/trayectoria/kuotipsemrush`.

**La causa no es un fallo de `global-not-found`, es su contrato.** La doc de Next es explícita
(`node_modules/next/dist/docs/.../file-conventions/not-found.md`): «used when a requested URL
doesn't match any route at all». Y `/trayectoria/loquesea` **sí casa** — el segmento `[slug]`
acepta cualquier valor. Así que la página se renderizaba, llamaba a `notFound()`, y Next buscaba
el boundary `not-found.js` más cercano… que no existe desde que **D25** borró el anidado, porque
su `headers()` volvía dinámico todo `[lang]`.

**El arreglo es mover el rechazo al ENRUTADO:** `export const dynamicParams = false` en la ruta.
Con eso un slug que no salga de `generateStaticParams` se rechaza antes de renderizar, que es
justo el caso que `global-not-found` sí cubre. Los cinco slugs ya salían de ahí, así que no se
pierde ninguna página ni deja de prerenderizarse (las doce siguen `●`).

**Lo que hay que llevarse, porque vuelve con cualquier ruta dinámica nueva:** un segmento
dinámico casa con TODO, así que «tengo un 404 global» y «mis rutas dinámicas devuelven mi 404»
son dos afirmaciones distintas. Si algún día hace falta una ruta cuyos valores no se conozcan en
build, `dynamicParams = false` no sirve y reaparece la tensión de D25.

**Y un falso hallazgo que casi se publica.** En local, `/trayectoria/EMENDU` —un slug real con
otras mayúsculas— devolvía **200 con la página de Emendu**, lo que parecía una URL duplicada. Es
el sistema de archivos de **Windows**, que es insensible a mayúsculas: `next start` encontraba el
`emendu.html` prerenderizado. Verificado en la Preview (Linux): da 404 con el 404 de marca, igual
que el resto. *El entorno de medida también inventa hallazgos.*

---

## D63 · La raya no era un reemplazo, eran tres familias — y su guardián

**Fecha:** 2026-08-19 · **Contexto:** Sprint Lite, P52 y P52.5 · **Estado:** aplicada

Francisco: la raya doble (`—`) es una señal visual de que el texto lo ha escrito una IA, y además
casi nunca dice nada que no diga un signo más corto. Había **357** en el copy servido (174 ES +
183 EN) más las de `content/experience-copy/`, que alimentan también el CV.

**Tratarlo como un buscar-y-reemplazar habría estropeado la voz.** Al clasificarlas salieron
tres familias con tratamiento distinto y una cuarta intocable:

1. **~90 parentéticos** (`—texto—`): la señal de verdad. Se **reescriben** con comas, con
   paréntesis cuando el inciso ya lleva comas dentro (si no, se confunde con la enumeración), o
   partiendo la frase.
2. **~208 incisos y separadores**: dos puntos cuando lo que sigue explica lo anterior, coma
   cuando solo continúa, punto cuando ya era otra frase, y `·` **solo** cuando de verdad separa
   dos etiquetas (`Nav · al cargar`).
3. **8 rangos de fecha**: aquí el `·` elegido **no vale**, y se vio al aplicarlo — ya es el
   separador de campos, así que `2019 · 2026 · 5 hitos` son tres campos donde había dos. Guion
   con espacios.
4. **Se quedan** los 50 ordinales de cabecera (`01 — Rejilla`, convención de D43) y 10 celdas
   con la raya sola, que es el signo tipográfico de «no aplica» en una tabla de datos.

**El inglés no era traducir el arreglo.** Tenía **nueve rayas más** que el español y, en cinco
sitios, había derivado a la raya donde su gemelo español ya usaba `:` o `;` (tres titulares del
Design System y dos notas). Se alinean con el ES, que es la fuente (D20).

**El guardián, `npm run check:raya`, octavo paso de CI.** Mismo giro que la paleta y las
experiencias: **busca la AUSENCIA**, no el patrón. Recorre el árbol del diccionario —así una rama
nueva entra sola— y los literales de `content/experience-copy`, saltándose los comentarios, que
son código. **No mira los `.md` del repo a propósito:** es una regla del copy que se sirve, no
del estilo de escribir documentación.

**Y afirma cuánto ha mirado** («30 archivos · 2.588 cadenas · 60 rayas permitidas»), porque un
guardián que no encuentra nada y calla parece un aprobado. Ese 60 es 50 + 10, exactamente lo que
contó el inventario por otro camino: el metro coincide con una medición independiente.

**Dos trampas de método que cazó la propia validación** (y que valen para el próximo guardián):

- La primera lectura de los códigos de salida usaba `$?` **detrás de un pipe**, o sea el de
  `tail`: los seis casos decían 0 y parecía que el guardián no detectaba nada. El check estaba
  bien; el que medía mal era yo.
- El caso «diccionario movido de sitio» salía con código 1 pero **por un stack trace de ENOENT**.
  Ahora comprueba las rutas antes de recorrer nada y distingue «no hay rayas» de «me he quedado
  ciego», que es la diferencia que importa.

**Coda: el guardián nuevo cayó en un punto ciego del propio tooling.** `scripts/check-raya.ts`
estaba sin formatear y `format:check` decía que todo bien, porque `.prettierignore` excluye
`scripts/`. Lo cazó **qlty**, que genera su config y sí lo mira. Es la quinta aparición del metro
que aprueba sobre lista vacía (P71.5) y la primera en que el punto ciego se traga un archivo
escrito ese mismo día. De paso, su botón «Run Formatter» reformateó **`CLAUDE.md` y
`PRD-Live.md`**, que están excluidos a propósito: qlty no lee nuestro `.prettierignore`, y
mientras su config viva solo en su nube no hay dónde escribir la exclusión (P73).

---

## D64 · Una apertura homogénea no la decide el anclaje: la deciden los altos — **ampliada 2026-08-26 (P70.29, P70.35): la invariante sube a la capa**

**Fecha:** 2026-08-19 · **Contexto:** Sprint Lite, P54, P54.2 y P54.3 · **Estado:** aplicada

Sale de P48: en cuanto la ventana pasa de cierto alto, el rótulo de la segunda sección asomaba
por debajo de la apertura y la primera vista dejaba de ser una portada. El tratamiento del
deep-dive —`md:min-h-[calc(100svh-5rem)]`, la misma constante que el hero de la home, y `min-h`
y no `h` para que en ventana baja no recorte (D50 al revés)— sube a **Brand Kit, Design System y
Accesibilidad**. Medido antes: a 1920×1080 dejaban 283, 227 y 234px de hueco; a 2560×1440, entre
587 y 643.

**Pero el pliegue era la parte fácil. La homogeneidad costó tres pasadas**, y las tres las abrió
Francisco comparando las páginas **abiertas seguidas** —que es el caso que ninguna medición de
una sola página detecta—. Sus tres reportes eran ciertos y **ninguno era lo que yo supuse**:

1. **El eyebrow a distinta altura no lo causaba el `my-auto`** que acababa de añadir, aunque esa
   fue mi primera hipótesis y anclar arriba «lo mejoró». Lo causaba el **`items-center` de la
   fila**: su alto lo fija el hijo más alto, así que cuando la **ilustración** es más alta que la
   columna de texto empuja el texto hacia abajo (27px en Accesibilidad, 11 en Design System, 0 en
   Brand Kit, la única que se veía bien). **Venía de antes de P54.** Arreglo: `self-start` en la
   columna de texto, que ancla el texto sin descentrar la ilustración.
2. **La fila de datos a distinta altura era lo mismo un nivel más arriba:** mientras la
   ilustración mande, es ella la que decide dónde cae la fila. Brand Kit «ajustaba» porque su
   composición (207) es más baja que su texto (272). Arreglo en tres partes: **Accesibilidad
   320→240** (tenía **68px de hueco muerto** entre dos piezas), **Design System 320→272** (aquí
   no había hueco, así que compactar fue solaparlas más) y **`HERO_ROW`** en
   `components/ui/layout.ts` con `md:min-h-[19rem]`, porque esa clase estaba escrita **tres
   veces** y el `min-h` no podía ser tres constantes que pueden divergir.
   Instrucción textual de Francisco, que es la parte reutilizable: *«no se trataría de hacer las
   imágenes más pequeñas sino de compactar los diferentes elementos»*.
3. **Y al final el grupo va CENTRADO**, como `/trayectoria`. Se pudo porque la causa estaba
   resuelta: centrar reparte el sobrante, así que solo es seguro cuando los tres grupos miden lo
   mismo. **La lección: si un anclaje «arregla» una inconsistencia, probablemente esté tapando la
   causa.**

**Resultado medido, las tres idénticas:** 2560×1440 eyebrow 531 y datos 907→991 · 1920×1080
eyebrow 351 y datos 727→811 · 1536×740 eyebrow 225 y datos 601→686. Y la entradilla del Design
System baja a cuatro líneas con la redacción que dio Francisco, igualándola a Accesibilidad.

---

**AMPLIACIÓN 2026-08-26 — se rompió dos veces más, y la segunda no era una regresión.** Las dos
las abrió Francisco igual que las tres de arriba: con las páginas en pestañas y cambiando entre
ellas. Ninguna herramienta las miró.

4. **Accesibilidad ganó un párrafo** —la fecha de última revisión, colgada de la fila de
   cifras— y con él **44px de grupo**. Centrar reparte el sobrante arriba y abajo, así que su
   `h1` subió exactamente **la mitad**: 22px. Medido a 1920×1080, grupo/`h1`: Brand Kit 461/390,
   Design System 461/390, **Accesibilidad 505/368**. Arreglo: la fecha baja a encabezar §01
   Conformidad, que es la sección que fecha (P70.29).
5. **Contacto no llegaba a esa altura por ESTRUCTURA**, que es un caso distinto: no usa
   `HERO_ROW` ni tiene fila de cifras, así que su grupo medía **297** y su `h1` caía a **464**
   contra los 390 de las otras tres. Aquí compactar —el arreglo de los tres episodios
   anteriores— no servía: no sobraba alto, **faltaba**. Lo que hacía falta era un **suelo**
   (P70.35).

**La invariante deja de depender de que alguien se acuerde.** `FOLD_CRUMB` y `FOLD_GROUP`, en
`components/ui/layout.ts`, al lado de `HERO_ROW` —que resuelve la misma condición una capa más
abajo, para la fila—. El grupo declara `my-auto md:min-h-[29rem]`: 29rem son **tres píxeles por
encima** de los 461 que las tres del sistema miden por su cuenta, así que no recorta a ninguna y
le da a Contacto lo que le falta. El sobrante cae **debajo** del contenido, que es aire de
pliegue que ya estaba ahí. Y de paso se une la otra divergencia, que era copia a mano: el hueco
del breadcrumb estaba escrito `clamp(3rem,6vw,4.5rem)` en tres sitios y `clamp(2.5rem,5vw,3.5rem)`
en el cuarto.

**Una trampa que solo se ve MIRANDO, no midiendo.** El grupo de Contacto es un `grid`, y un grid
con `min-height` y filas automáticas **reparte el sobrante entre las filas** (`align-content`
vale `normal`, que ahí se comporta como `stretch`): los 167px que le faltaban se metieron entre
el titular y su entradilla y las separaron un dedo. **La cifra salía perfecta y la página estaba
peor.** Lo cierra `content-start`. Es el punto 8 de `BRAND.md` §Cómo medir en su forma inversa:
la medición aprobaba y el ojo no.

**Medido después**, grupo/`h1`: las **cuatro** en 464/389 a 1920, 265 a 1280 y 269 a 1024.

**Lo que queda fuera, dicho para que no parezca olvido.** Por debajo de 1024 las tres hermanas
desbordan el pliegue y se anclan arriba (`h1` a 237) mientras Contacto todavía cabe y se centra
(271). Es la misma razón por la que el alto es `min-h` y no `h`: la regla no debe recortar.
Igualarlo ahí exigiría rellenar Contacto con aire arbitrario o dejar de centrar, y centrar es lo
que pidió Francisco. **Y el deep-dive y «Cómo se ha creado» no usan estas constantes**: comparten
el andamiaje del pliegue pero no esta familia — sus aperturas son tipográficas, de alto
constante, y cada una tiene su hueco razonado en su archivo.

**Y sigue sin vigilarlo nadie.** Cinco episodios, cinco veces detectado a ojo. Está tareado.

**La trampa del `mx-auto` no mordió, y se comprobó midiéndola**, no confiando en el `w-full`: al
volver flex el contenedor, el `mx-auto` de `WRAP` pasa a ser margen del eje transversal y
desactiva el `stretch`. Con el ancho declarado, el WRAP mide 1.360 y su borde queda a 40px del
enlace del nav —el `--page-x`— en los cuatro viewports.

**El cuerpo de Cookies sale de la media columna**, que era la última página con todo dentro de
`PROSE` (42rem, lo que Francisco describió como «está toda al 50%»). El sitio ya había contestado
esto dos veces —Sobre mí el 2026-08-16 y el deep-dive en D53— y la respuesta estaba escrita: la
media columna es el tratamiento de las **entradas y los cierres**, no del cuerpo. Medido: los
párrafos del deep-dive van a 1.280px (119-151 car/línea) y los de cookies iban a 672. Ahora
apertura 672 · cuerpo 1280 · Contacto 672, que son exactamente los dos bloques que él señaló.
El `minWidth` de su tabla **no cae pero su motivo sí**: ya no hace falta por los 42rem, hace
falta en móvil (medido a 390px: 572 y scrollea), y los dos comentarios que lo justificaban con la
razón vieja se corrigen en vez de dejarlos mintiendo.

**Cookies NO lleva el tratamiento de pliegue, y se decidió con la medida:** su encabezado son
252px de contenido —sin ilustración ni fila de datos—, así que estirarlo a los 1.000 del pliegue
dejaría **539px de aire**, más del doble de lo que hay dentro; las otras cuatro llevan ~600 y
~300. Y es un documento que se **consulta**: retrasar la tabla una pantalla es cambiar su trabajo
por simetría. Queda escrito en el propio componente para que no se lea como un olvido.

**Y un fallo que llevaba meses y que solo se ve mirando:** en esa página, `[&_p]:m-0` compila a un
selector de **descendiente** (`.clase p`, especificidad 0-1-1) que le gana a `.mt-4` (0-1-0), así
que **dos márgenes computaban 0px sin dar un solo error de compilación** — el botón de
preferencias pegado a su texto y la nota de la tabla a 1px de ella. Es el punto 5 de `BRAND.md`
§Cómo medir, y el arreglo es la regla que `CLAUDE.md` ya pide: **que el espaciado lo ponga el
layout** (`flex flex-col gap-5`), no márgenes por elemento. Verificado que el patrón solo existía
ahí, así que no hay auditoría pendiente.

**Séptima pieza de la capa: `components/ui/stat-row.tsx`.** La fila de cifras de la apertura
estaba escrita **dos veces** con firmas distintas —`accesibilidad.tsx` y `design-system/hero.tsx`,
la primera un subconjunto de la segunda—, así que la tercera copia para el Brand Kit era justo lo
que la Regla de construcción manda no hacer. Va en `ui/` y no en `site/` porque no sabe nada de
este sitio (frontera de D36). **Su ancho mínimo de columna lo decidió la pantalla contra mi
argumento:** razoné 13rem por la etiqueta más larga y al verlo a 900px resultó que con 13rem la
fila de cuatro se parte en 3+1 y deja un dato **huérfano**, mientras con 11rem entran los cuatro y
solo se parte una etiqueta en dos líneas.

---

## D65 · Un vídeo de apertura no es una foto que se mueve

**Fecha:** 2026-08-19 · **Contexto:** Sprint Lite, P53.5 · **Estado:** aplicada

La apertura de Sobre mí pasa de foto a vídeo (10s: sala vacía, entra por la derecha, cruza y se
apoya en la pared). La tarea daba por hecho que era una versión animada de la foto y que el
póster podía ser la webp existente. **Las dos cosas eran falsas**, y lo dijo la medición:

- **No termina en la foto anterior.** Al final la figura queda en x=50% ocupando el 19% del
  ancho; en la foto estaba en x=69% y el 24%. Misma pose, encuadre distinto — así que no puede
  «entregarle el relevo», y el respaldo quieto es **su último fotograma**.
- **No puede llevar `loop`.** Saltaría de él apoyado a la sala vacía y volvería a entrar en
  bucle, que se lee como un fallo. Se reproduce una vez y se queda en el último fotograma.
- **No puede anclarse arriba como la foto** (que venía recortada 84px justo para eso). El vídeo es
  16:9 y la banda 1,951, y su figura es más pequeña: ocupa el 71% del alto del cuadro contra el
  87% de la foto. En 1280×618 la banda mide 394px y solo caben el 55% del alto del vídeo, así que
  **a esa altura no cabe entera con ningún anclaje**. Es aritmética. Anclada al 18%, lo que se
  pierde es suelo y piernas y nunca la cabeza.

**El error que solo salió midiendo:** el primer montaje llevaba `autoPlay` + `preload="none"` y un
comentario afirmando que así no se descargaba el vídeo con motion reducido. **Es falso** — el
navegador ignora ese `preload` cuando hay autoplay, incluso con el elemento en `display:none`—,
así que quien pide menos movimiento se bajaba 362 KB para ver una imagen de 17 KB. Se quita el
`autoPlay` y lo arranca un script inline gateado por la media query, la misma forma que el tema y
el consentimiento: **cero JS de cliente de React**. Medido después: 0 KB de webm con motion
reducido, 362 sin ella.

**El scrim mejora, y su cifra estaba medida contra los píxeles de la FOTO** (5,44 en la cita /
7,28 en el subtítulo). Sobre el peor de seis fotogramas muestreados, midiendo el fondo **sin el
texto**: 6,27 y 10,85, con umbrales 4,5 y 7. Dos notas de método por el camino: la primera
medición dio 1,04 porque el recorte caía sobre el **banner de cookies** —se vio *mirando* el
recorte, no leyendo la cifra— y la segunda dio 1,00 porque medía el propio texto blanco contra
blanco.

**Gate (D52):** 0 violaciones de axe y 41 comprobaciones OK en claro, oscuro y motion reducido; la
única «incompleta» es el par sobre vídeo, que axe no puede resolver por construcción. **LCP = el
póster de 12,3 KB, CLS 0** — el vídeo no es el LCP, que era el riesgo. Sin JS no hay vídeo, así
que el `<noscript>` sirve el fotograma final. La CSP no se toca: el vídeo es auto-hospedado y
`media-src` cae en `default-src 'self'`.

**ADDENDUM (2026-08-29, P64.5) · El póster es el LCP, y un `poster` no acepta `fetchpriority`.**
La línea de arriba sigue siendo cierta —el `.webm` no es el LCP— y por eso mismo la auditoría
«Descubrimiento de solicitudes de LCP» fallaba una de sus tres comprobaciones: el **elemento**
LCP es el `<video>`, lo que pinta es su `poster`, y el atributo `poster` no admite
`fetchpriority`. No hay forma de marcarlo prioritario desde el propio elemento.

Se marca desde la cabeza, con `ReactDOM.preload("/img/francisco-sobre-mi-poster.webp", { as:
"image", fetchPriority: "high", media: "(prefers-reduced-motion: no-preference)" })`. **Va en el
componente que pinta el vídeo, no en la capa de página** (D45/D46): lo que hay que precargar lo
decide quién lo pinta, no el marco — y React lo iza al `<head>` él solo, así que la capa no
necesita una vía nueva para esto. Medido: el póster pasa a pedirse con prioridad **High**, y el
`.webm` **sigue sin pedirse** con motion reducido.

**Y una corrección al razonamiento con el que se tareó, que importa porque es un ahorro que no
existe:** el `media` **no evita la descarga** del póster para quien pide menos movimiento.
Chrome pide el `poster` de un `<video>` esté el elemento oculto o no, así que esos ~12 KB se
bajan igual; lo que el `media` evita es **priorizar lo que no se pinta**. Está escrito también
al lado del código, para que nadie le atribuya el ahorro.

**Y EL FOTOGRAMA QUIETO DEJA DE PEDIR PRIORIDAD ALTA ESTANDO OCULTO** *(2026-08-30)*. Iba con
`fetchPriority="high"` **para todo el mundo** aunque solo se pinta con motion reducido, así que
casi todos los visitantes se bajaban 7,2 KB en `display:none` **con prioridad High**,
compitiendo con el póster, que es el LCP de su rama. Se retira el atributo.

`loading="eager"` **se queda**, y es la mitad que sí hace falta: sin él `next/image` lo marca
`lazy` y quien pide menos movimiento —para quien esta imagen SÍ es el LCP— se lo encontraría
diferido. `next/image` no admite `media`, así que quien tiene que distinguir las dos ramas es
el navegador, que sabe cuál se está pintando; el JSX no.

**Y no se cambia un incumplimiento por otro, que era el riesgo real de tocarlo.** Medido con
Lighthouse sobre el build de producción, en las dos ramas —la de motion reducido forzada con
`--force-prefers-reduced-motion`—:

| | antes | después |
|---|---|---|
| Quieto, sin preferencia (oculto) | High | **Low** |
| Póster, sin preferencia (LCP) | High | High |
| `prioritize-lcp-image` con motion reducido | 1 | **1** |

O sea que en la rama donde esa imagen SÍ es el LCP, Lighthouse sigue sin ver nada que ganar
priorizándola: con el póster fuera de la competición, esa página no tiene con qué competir.

**Lo que esa misma medición dejó a la vista y no tiene arreglo:** con motion reducido el póster
se sigue bajando —13,8 KB, prioridad Medium— y **no se pinta nunca**. Es el `poster` del
`<video>`, no el preload, y por eso el `media` de arriba no lo evita.

---

## D66 · Un asset tiene más consumidores de los que se ven

**Fecha:** 2026-08-19 · **Contexto:** Sprint Lite, P53 · **Estado:** aplicada

Retrato nuevo en la home, con el encuadre decidido viendo las tres opciones **al tamaño al que se
sirven** y dentro del marco real de la tarjeta. Pesa menos que el anterior (28,7 KB contra 33,8)
aunque suba la calidad, porque el fondo nuevo es oscuro y liso.

**Cambiar «la foto del hero» no es cambiar un archivo: son tres consumidores**, y el tercero no se
ve mirando la página. Además del `<Image>` del hero, la usan la **tarjeta OG** (`/api/og` la lee y
la compone) y el **JSON-LD** (`image` del `Person`, en `lib/structured-data.ts`). Al renombrar el
asset, ese tercero apuntaba a un 404 **sin que nada lo notara** — lo cazó un `grep` del nombre
viejo después de renombrar. Y ahí está el argumento a favor de renombrar en vez de reutilizar el
nombre: si lo hubiera reutilizado, la referencia habría seguido «funcionando» apuntando a otra
foto.

**Y del archivo de la tarjeta OG se servía la mitad.** Medía 1200×630, pero `/api/og` lo mete en
una caja de **600×630** —la mitad izquierda de la tarjeta— con `objectFit: cover`, así que solo se
veían los 600 centrales: el 50% del archivo no se servía nunca y su nombre anunciaba un tamaño
que no era el de uso. Verificado **renderizando el endpoint**, no leyendo el código. Pasa a
`og-home-600x630.jpg`, que es la caja de verdad.

---

## D67 · El ruido conocido de los validadores se documenta por MECANISMO, no por cifra — 2026-08-19

**Contexto.** De un lote de ~11 hallazgos de validadores externos, **seis eran falsos positivos o
cosas ajenas al proyecto**. Sin dejarlo escrito, cada auditoría los vuelve a levantar y vuelve a
costar medio día descartarlos — y ya había pasado **dos veces** con el mismo punto (las imágenes
sin `alt`). Esta entrada es el sitio al que apuntar cuando alguien traiga la captura de un SEO
tool.

**Y la decisión de forma la impuso el propio trabajo de verificarlo.** Al comprobar los seis
puntos contra el sitio de hoy, **todas las cifras que la tarea traía apuntadas estaban
desfasadas**: las 79 reglas `@property` son **69**; «las 7 imágenes del sitio» son **142**; y la
relación texto/HTML ya no cae en la banda que se anotó. Ninguna conclusión cambió, pero **un
documento con cifras viejas parece equivocado justo cuando hace falta que sea creíble**. Así que
se documenta el **mecanismo** —por qué el aviso aparece y por qué es ruido— y **el comando para
recontar**, nunca el número como afirmación. Es la misma familia de D60: una copia derivada que
nadie recalcula.

### Los cuatro que son ruido

**1. Validador CSS del W3C: las reglas `@property`.** Marca cada una como «la regla-arroba
`@property` no está implementada», y además avisa de que no evalúa los custom properties «due to
their dynamic nature». `@property` es **spec de CSS (Houdini)**, soportada en todos los
navegadores modernos; el validador del W3C no la implementa. Es **output normal de Tailwind v4**:
de las 69 servidas hoy, **61 son `--tw-*`** generadas por el framework y 8 son del proyecto
(`--scroll-fade-*`, `--shimmer-*`). Falso positivo al 100%.
Recuento: `curl -s <hoja>.css | grep -o '@property' | wc -l` — **y la hoja cuelga de
`/_next/static/chunks/`, no de `/css/`**; un patrón que apunte a `/css/` devuelve **cero**, que es
el falso aprobado contra el que avisa `BRAND.md` §Cómo se escribe una regla.

**2. La barra final de los void elements.** La emite el serializador de `react-dom/server` y en
JSX **no se puede escribir de otra forma** (`<input>` sin cerrar es error de sintaxis). En el
propio validador es nivel **INFO, no error**. La parte del aviso que sí sería peligrosa —atributos
sin comillas— **no aplica**: medido sobre la home servida, **1.392 atributos con comillas dobles y
0 sin ellas**. *(Cuidado al recontarlo: un patrón ingenuo da 58 «sin comillas» porque cuenta la
barra de cierre y los `=` dentro de URLs y `srcset`. Las 4 coincidencias de un patrón estricto son
JavaScript dentro de scripts inline.)*

**3. Relación texto-HTML baja (Semrush).** **Descartado.** Google no usa esa métrica. Y el
diagnóstico, aunque aritméticamente correcto, no describe un defecto: las páginas con el ratio más
bajo son la **home** y el **índice de trayectoria**, que son una portada y cinco tarjetas; el
**Brand Kit** son decenas de anclas de descarga. Es lo que esas páginas *son*. Lo único accionable
que salió de ahí es **P85** (reducir las anclas del Brand Kit), y **por UX, no por SEO**.

**4. Assets de Vercel.** «Uncompressed Asset» (`challenge.v2.min.js`) y «Resource Load Failed 403»
son del **challenge de seguridad de Vercel**, no del proyecto: cero coincidencias en el código y
cero referencias en el HTML que sirve nuestro build.

### El quinto es el que ya se reabrió dos veces

**Imágenes sin `alt` y enlaces sin `title`.** Falso positivo, y conviene saber por qué son **dos
afirmaciones distintas**:

- **`alt`**: verificado sobre **las 24 variantes servidas** (12 páginas × 2 idiomas), **142
  `<img>` y CERO sin atributo `alt`**. Los 54 que llevan `alt=""` son **decorativos a propósito**
  —logos de empresa, herramienta y formación, que van pegados a su nombre en texto, y los dos
  pósters de vídeo, cuyo botón ya lleva el nombre accesible—. Un logo con `alt` repetiría al
  lector de pantalla lo que acaba de leer.
- **`title`**: **no es requisito de WCAG y es un antipatrón** — no llega ni al teclado ni al
  táctil, y duplicaría un texto de enlace que ya es descriptivo. Medido: **502 `<a>`, 0 con
  `title` y 0 sin nombre accesible**. Los enlaces solo-icono lo resuelven con `aria-label`.

Recuento: recorrer `scripts/.html-actual/*.html` tras un `npm run gate:html -- save`. **Sobre las
24, no sobre la home** — es la lección de D61.

### Y el sexto es REAL, solo que ya estaba decidido

**`'unsafe-inline'` en `script-src` y `style-src`.** No es ruido: es una debilidad conocida y
**aceptada**, pospuesta en **D26**. Con Next 16 los nonces exigen pasar por `proxy.ts` en cada
request, lo que vuelve dinámicas todas las rutas y empeora el TTFB — se cambiaría una nota de
informe por un coste real de rendimiento. **Condición de revisión:** cuando entre un formulario
con endpoint externo (P67), o cuando llegue la IA conversacional de la V4.

### Cómo repetir la comprobación

| Validador | Dónde | Qué marca de esto |
| --- | --- | --- |
| CSS del W3C | `jigsaw.w3.org/css-validator/` | 1 |
| HTML del W3C | `validator.w3.org/nu/` | 2 |
| Semrush Site Audit | su panel | 3, 4 |

**Regla de uso: antes de tarear un hallazgo de un validador externo, se comprueba contra el código
o contra el HTML servido.** De once, seis no lo sobrevivieron. Es `BRAND.md` §Cómo se escribe una
regla, punto 3 —«valida el metro antes de creerte el hallazgo»— aplicado a metros que no son
nuestros.

---

## D68 · El repositorio es público, y a `main` la protege el servidor y no la disciplina — 2026-08-19

**Contexto.** GitHub avisó de que la rama principal no estaba protegida, y al ir a configurarlo
los dos caminos —`branches/main/protection` y `rulesets`— devolvían **403 con el mismo mensaje**:
«Upgrade to GitHub Pro or make this repository public». En plan Free, un repo **privado** no
admite ni protección de rama ni rulesets. Así que la tarea no era configurar: **era decidir**, y
la decisión —hacerlo público— es irreversible en la práctica, porque queda cacheado y clonado.

**El paso previo no se salta: auditar el historial ENTERO, no el árbol de trabajo.** Sobre los 293
commits: **cero** claves fuertes (`sk-`, `ghp_`, `AKIA`, `AIza`, PEM, `xox`, Bearer), cero
asignaciones tipo `SECRET=`/`API_KEY=`, ningún `.env` commiteado —solo `.env.example`, plantilla
íntegra— y **el CI no usa ni un secret**, así que funciona igual en público (y Actions es gratis
ahí). Los IDs de **GTM y Clarity**, que era lo que había que mirar por ser lo que más se parece a
una credencial sin serlo, **ni siquiera están en el repo**: viven en variables de Vercel.

**Y el riesgo real no era el que la tarea anticipaba: era editorial.** Publicar el repo publica
`PRD-Historical.md`, y ese documento **registraba lo que se había decidido no contar en el
sitio** — o sea, lo republicaba. Tres pasajes, redactados antes de cambiar la visibilidad. La
regla que queda: **un documento que registra qué se retiró por discreción lo vuelve a publicar**,
y es la línea de discreción de §42 aplicada al propio repositorio. *(El texto viejo sigue en el
historial: purgarlo exigía reescribir los 293 commits y romper los PRs abiertos, y se decidió que
tres párrafos de un doc de proceso no lo justifican. La alternativa se evaluó, no se ignoró.)*

**La protección, y por qué cada regla es la que es.** Ruleset «main protegida» sobre
`~DEFAULT_BRANCH`: `pull_request` con **0 aprobaciones requeridas** —Francisco trabaja solo y no
puede aprobar su propio PR; pedir 1 bloquearía el repo entero, y el PR obligatorio ya impide el
push directo, que es lo que importa—, `required_status_checks` con **`calidad y build`**,
`deletion` y `non_fast_forward`. `allowed_merge_methods` = **squash y rebase**, que es **D12
escrita en el servidor** en vez de en un documento. **Sin bypass de admin**
(`current_user_can_bypass: "never"`).

**Validado disparándolo, no leyendo el panel:** un push directo a `main` con un commit real —no
`--dry-run`— sale rechazado con `GH013` citando las dos reglas por su nombre, y `main` no se
mueve; un PR con CI en rojo da `BLOCKED` con `mergeable=MERGEABLE`, o sea bloqueado **solo** por
la regla; y Vercel siguió desplegando tras el cambio de visibilidad.

**La contrapartida, que hay que saber antes de necesitarla:** sin bypass, un arreglo de emergencia
en `main` pasa por **editar el ruleset**, no por forzar el push. Y hay un efecto de segundo orden
que sí mordió: los PRs abiertos de antes llevaban el **nombre viejo** del job de CI, así que
ninguno tenía el check requerido y **las cinco actualizaciones de Dependabot quedaron bloqueadas**
hasta rebasarlas. *Cambiar el nombre de un check requerido invalida en silencio todo PR abierto.*

**Y con el repo público llegan tres piezas que antes no tenían sentido.** El **README** deja de
ser documentación interna y pasa a ser portada —era buena para quien ya estaba dentro y mala para
quien llega: 172 líneas sin una imagen y el mapa del repo en un muro de 60—. El **`LICENSE`** hace
explícito lo que por defecto ya era: **público para consulta, no código abierto**, enumerando lo
que más se copia (marca y kit, textos ES/EN, fotos, vídeo y CV) porque un aviso genérico no
protege lo que nadie identifica como protegible. Y el **enlace al repo en el footer**, que antes
habría dado un 404 al que lo pulsara, trae el **segundo icono propio** —lucide retiró `Github` en
la v1.24 por marca registrada, el supuesto que `BRAND.md` §Iconos propios nombra— y mete el repo
en el **`sameAs`** del JSON-LD, que es el consumidor que no se ve mirando la página (D66).

---

## D69 · El régimen de contexto de D28 gana cifra y guardián, y aparece la operación que faltaba: retirar — 2026-08-19

**Contexto.** Un análisis de metodología con mirada externa, pedido antes de abrir el sprint
«Cómo se ha creado», midió el peso de lo que se `@`-importa en cada arranque de sesión:
**9.275 palabras el 9 de agosto —el día del corte de `BRAND.md` que fijó el régimen— y 19.805
el 19. Un +113% en diez días**, sin que nada lo viera. El corte compró 2.400 palabras y el
crecimiento se las comió en cuatro días.

D28 escribió el régimen —reglas precargadas, historia a demanda— y **no le puso ni cifra ni
guardián**. O sea que se cumplió exactamente lo que dura la memoria de quien lo escribió. Es
«una regla que hay que recordar es una regla que se incumple» aplicada a la regla que gobierna
las reglas.

**El diagnóstico de fondo, que explica bastante más que este archivo.** Este método tiene una
operación de **añadir** excepcional —cada fallo se convierte en regla, cada regla en guardián,
cada guardián en párrafo, sesenta y ocho veces— y **no tenía operación de retirar**. El
contraste que lo prueba: los documentos eran el único artefacto del repositorio sin
compactación. El diccionario se partió (D48), los showcase se partieron (D42), `BRAND.md` se
partió una vez y duró cuatro días. Y la asimetría tenía un sitio concreto: **`close-session`
preguntaba qué documento hay que actualizar y nunca qué documento se puede colapsar.**

**Decisión — cuatro piezas, y ninguna es «escribir menos».**

1. **`npm run check:contexto`, en CI.** Techo sobre las palabras de los cuatro `@`-importados,
   con el desglose por archivo y la distancia a un objetivo declarado. **Nace en verde a
   propósito y actúa de trinquete**: un gate que nace en rojo se acaba subiendo hasta que no
   significa nada. Empezó en 16.000 y el mismo día bajó a 13.500; el historial del techo vive
   en el propio script, porque *aflojarlo es la forma que tendría esto de morir*.
2. **`PRD-Live.md` vuelve a ser present-tense**: 6.859 → 2.520 palabras y 40 fechas → 1. Sus
   §5 y §9 eran el 84% del documento y casi todo era narrativa de cómo se llegó a un estado,
   no el estado. Lo retirado va íntegro a `PRD-Historical.md` §52.
3. **Los índices se derivan, no se escriben** (`npm run indices`, `check:indices` en CI). El de
   decisiones pasó de **3.610 a 924 palabras** al decidirse que solo ENRUTA: para contestar
   «¿cuál necesito?» basta el título, y quien te lleva a una entrada es el comentario del
   archivo en el que estás —42 de las 68 se citan desde el código—, no el índice. Y
   `PRD-Historical.md` y `BRAND-historical.md` ganan índice **en su propia cabecera**: eran
   46.000 palabras y 52 secciones sin navegación de ninguna clase, así que «a demanda»
   significaba grepear a ciegas o cargarlo entero.
4. **`close-session` gana el paso 1 bis**: tres preguntas de retirada con «no» explícito
   obligatorio, y una propuesta de cierre con dos columnas —altas y bajas—. Una segunda
   columna siempre vacía es la señal de que se ha contestado por inercia.

**El control correcto para un archivo no es un techo, es un índice.** Un archivo debe crecer:
para eso es un archivo, y ponerle límite solo conseguiría que se deje de escribir el porqué,
que es lo que hace bueno a este proyecto. 46.000 palabras sin índice son inservibles; 200.000
con un índice bueno están bien. Por eso el techo va solo sobre lo `@`-importado y los históricos
solo ganan navegación.

**Consecuencia de método que hay que respetar:** el índice no tiene texto propio. Si un título
no basta para saber si abrir una sección, **se arregla la cabecera**, nunca el índice. Es lo
único que impide que los dos títulos divierjan, y es el mismo movimiento que D59 hizo con el
sitemap, `llms.txt` y las tarjetas OG.

**El sistema se estrenó contra sí mismo el mismo día**, que es la mejor prueba de que muerde:
meter la Definition of Done en `CLAUDE.md` disparó `check:contexto` (16.003 contra 16.000), y
se pagó **retirando** narrativa fechada de las reglas del tablero. Primera vez que este método
compacta por obligación y no por criterio.

**Y sobre borrar lo desfasado, que era la duda razonable: no.** Auditadas las 68 cabeceras, lo
declarado obsoleto son **237 palabras de 41.694, el 0,6%**. No hay volumen que ganar, y el valor
de este archivo es el experimento fallido — el mismo día, D51 evitó reconsiderar `graphify`
por la razón equivocada y D60 obligó a medir si el artefacto era determinista en vez de copiar
el método del CV. Lo que sí había era **información de estado escrita donde no se ve**: D30
estaba marcada como generalizada por D39 desde el 9 de agosto y la marca vivía en el cuerpo. El
estado gana hueco propio en la cabecera y viaja al índice, con **tres** palabras que significan
cosas distintas —superado, generalizada por, revertida por—, porque D30 sigue vigente y
marcarla como superada haría que se saltara una regla que se cumple todos los días.

**Resultado:** 19.805 → 12.915 palabras de contexto de arranque (-35%), con techo, trinquete y
la operación inversa escrita en la skill que se dispara sola.

---

## D70 · La capa que verifica no estaba verificada, y su modo de fallo es una luz verde — 2026-08-19

**Contexto.** El proyecto tiene ~1.900 líneas de guardianes en `scripts/` y cero tests. Eso no
sería grave en sí; lo grave es **cómo fallan**: en verde. El censo de contraste se rompió **dos
veces en silencio** —primero un bucle plano que se saltaba las utilidades `hover:` envueltas en
`@media`, después CSS Nesting haciendo que `if (rule.cssRules)` fuese siempre cierto, con lo que
encontraba 0 reglas `:hover` donde hay 21—. Las dos se descubrieron igual: midiendo un caso cuyo
resultado ya se conocía.

Y Qlty lo estaba diciendo desde otro sitio: sus **cinco peores archivos, los cinco en F**, no
eran código de la web sino `contrast-census.js` (el que se ha roto dos veces), dos registros de
contenido y dos guardianes.

**Decisión — cuatro piezas.**

1. **`npm run check:guardianes`**: por cada guardián, un **caso malo conocido que tiene que
   rechazar**. Eso ya se hacía —cada guardián se «validó rompiéndolo» el día que se escribió—
   pero como **hábito**, y un hábito se olvida y no deja rastro. Detecta dos cosas, y la segunda
   es la que lo hace útil a un año vista: que un guardián pierda los dientes, y que **el caso
   malo caduque** (si la mutación ya no cambia el archivo, lo dice en vez de aprobar).
   **Nace fuera de CI**: muta archivos rastreados, y un job que escribe en el árbol de trabajo
   sale caro el día que se interrumpe. Se niega a arrancar con el árbol sucio, restaura en
   `finally` y comprueba al final que no ha dejado nada movido. *(Entró en CI el 2026-08-19,
   P54.96 — ver la corrección al final de esta entrada.)*
2. **La guarda de cero, completada.** `check:experiencias` y `check:raya` ya fallaban al mirar
   cero. `check:palette` no: publicaba «30 tokens, 18 conversiones», cifras derivadas de sus
   **propias constantes**, que salen idénticas aunque el barrido no abra un solo archivo. *Una
   cifra tranquilizadora sobre cero trabajo es la forma más difícil de detectar de este fallo,
   porque el metro sí afirma cuánto ha mirado: solo que afirma lo que no ha mirado.*
3. **`check:artefacto`**, y el método salió al revés que en el CV **por haberlo medido**. D60
   sella las ENTRADAS del CV porque el PDF no es determinista; el artefacto sí lo es (mismo
   sha256 byte a byte al regenerar), así que se sella el **par fuente→producto**, que es
   estrictamente más fuerte: cubre además lo que el gate del CV deja fuera a propósito, un
   cambio en el saneador. El sello lo escribe `npm run artefacto`, de modo que regenerar y
   sellar no se pueden separar.
4. **`check:skills`**, porque D60 dejó escrito que **las skills caducan peor que los `.md`**: un
   párrafo desactualizado se lee con escepticismo, una skill se **sigue**. Comprueba la parte
   mecánica —que existan las rutas y los `npm run` que nombra— y dice explícitamente lo que no
   comprueba: que el procedimiento siga teniendo sentido.

**Y `scripts/` sale de `.prettierignore`**, que era la quinta aparición de la misma familia y la
más fina: no solo dejaba 3.000 líneas fuera del gate de formato, sino que hacía que
`prettier --check "scripts/**"` contestara **«All matched files use Prettier code style!» sobre
cero archivos**, porque prettier aplica el ignore también a las rutas explícitas. El aviso estaba
escrito en el propio archivo que lo causaba, y decía «10 archivos»: eran 13.

**Sobre Qlty: el informe pedía lectura, no obediencia.** `qlty.toml` baja al repo —vivía solo en
su nube, o sea una segunda fuente de verdad fuera del control de versiones— y excluye **por lo
que un archivo ES**, nunca por lo que puntúa: `en.ts` y `es.ts` son tablas de datos sin una sola
función, penalizadas por la duplicación estructural ES↔EN que `check:experiencias` existe para
GARANTIZAR. Lo que **no** se silencia es `contrast-census.js`, que era señal buena.

**Estado:** CI pasa de 8 a 12 pasos. Los cinco guardianes nuevos o tocados se validaron
rompiéndolos, y `check:guardianes` se validó neutralizando `check:raya` a propósito.

**Corregido el 2026-08-19 en P54.96: `check:guardianes` entra en CI**, y CI pasa a trece pasos.
El argumento para dejarlo fuera —que muta archivos rastreados y un job que escribe en el árbol
de trabajo sale caro si se interrumpe— vale para un árbol con trabajo dentro, no para un runner
que se tira al terminar. Y el precio de dejarlo fuera era **exactamente el modo de fallo que esta
decisión describe**: el verificador de los verificadores solo corría si alguien se acordaba, o sea
que el único guardián sin disparador automático era el que vigila a los otros ocho. Un guardián
que se puede olvidar no es un guardián: es una nota (regla 1 de «Cómo se escribe una regla» en
`BRAND.md` — un disparador que mira al momento equivocado). Medido en el runner: **2 s**, sobre
un job de 59 s que domina el build.

## D71 · «No hay datos» no distingue entre cero filas y mal configurado — 2026-08-19

**El hueco.** El dashboard de métricas llevaba **16 días** con dos de sus tres scorecards en «No
hay datos», y la conclusión que se dio por buena —dos veces— fue que faltaba configurar la
medición. Era falso. El tag de GA4, su trigger y la dimensión personalizada estaban publicados
desde el 2026-08-03; **la medición llevaba 16 días funcionando y lo roto era el instrumento que
la mira**.

Los dos tiles vacíos tenían el mismo filtro: `Incluir · Nombre del evento · Igual que (=) · «»`,
con el **valor vacío**. Filtra por «nombre igual a nada» → cero filas, para siempre, sin error en
ninguna parte. El único tile que funcionaba era el único cuyo filtro vive a nivel de **fuente de
datos** en vez de gráfico. Es el modo de fallo de D63/D70 en su versión más barata de producir:
*un metro que devuelve lista vacía parece un aprobado*, y aquí ni siquiera devolvía lista vacía —
devolvía la frase «No hay datos», que es indistinguible de «nadie ha hecho clic».

**Las cifras reales**, que son la referencia del cierre siguiente (GA4, 22 jul - 18 ago 2026):
contacto **9** · CV **6** · scroll **56**.

### Cómo se verifica la medición sin creerse el panel

Tres técnicas, y las tres salieron de que las dos hipótesis previas eran erróneas:

1. **El contenedor de GTM se audita sin entrar en su UI.** `curl` de
   `googletagmanager.com/gtm.js?id=GTM-XXXXXXX` devuelve el JSON publicado: `macros`, `tags`,
   `predicates` y `rules`. Ahí se lee si el tag existe, con qué parámetros y con qué trigger, en
   dos minutos y sin sesión. Es la forma barata de no volver a suponer.
2. **La verificación en vivo desde el equipo de Francisco NO puede pasar por Realtime ni por los
   informes.** El filtro de datos «Internal Traffic» está en Excluir/Activo —deliberado desde
   P30.9, para que las pruebas no ensucien el análisis— y descarta esos hits **antes de la
   ingesta**. Disparar dos eventos y ver Realtime a 0 no prueba nada. Se lee el hit saliente en
   la pestaña de red (`…/g/collect?…&en=contact_click&ep.contact_method=email`), o se pone el
   filtro en «Prueba» un rato.
3. **Ante un scorecard a cero, la primera hipótesis es el instrumento, no la audiencia** — y la
   segunda es el **filtro** del propio scorecard, no la instrumentación aguas arriba. Aquí las
   dos veces se saltó directo a la tercera.

**Lo que esto le añade al punto 12 de `sprint-review`**, que se escribió el mismo día y sin nada
que leer: ya tiene sus tres cifras de referencia, y su pregunta 4 («¿sigue midiendo bien el
instrumento?») tiene ahora un procedimiento en vez de una intuición.

### Cierre del sprint 2 — 2026-08-22: el procedimiento se estrenó y el instrumento aprobó

Los tres marcadores daban **9 · 6 · 56**, *exactamente* lo de arriba. Tres días después, con una
ventana de 28 días que se ha movido, tres cifras clavadas es la firma de un panel congelado — así
que se contrastó contra GA4 en vez de creérselo, que es lo que este D-entry existe para exigir.
**El panel reproduce GA4 al dígito** (25 jul - 21 ago 2026): `scroll` 56 / 4 usuarios ·
`contact_click` 9 / 2 usuarios · `file_download` 6 / 2 usuarios · total 489 eventos, 37 usuarios,
166 `page_view`. **Primera vez que la pregunta 4 se cierra sobre una verificación y no sobre una
predicción.**

Lo que sí deja abierto es **a quién** cuenta: 4,5 clics de contacto y 3,0 descargas por persona
son el patrón de quien **audita** el sitio probando sus tres puntos de descarga, no el de quien
quiere contactar. El filtro de tráfico interno es por IP, así que cualquier dispositivo fuera de
ella entra como visita real — y **con n=2 un usuario contaminado se lleva la métrica primaria
entera**. Tareado aparte.

**Y el hallazgo que ninguna de las cuatro preguntas pedía, pero que sale de mirarlas juntas:** con
37 usuarios en 28 días, la métrica primaria del PRD §7 tiene un tamaño muestral de dos personas.
No es una señal débil, es una métrica que **no puede discriminar nada**, así que la respuesta a la
pregunta 3 («¿cambia esto una prioridad?») es *no*, y el motivo no es que los datos digan que todo
va bien: es que no dicen nada. El tablero tenía 51 tareas abiertas y ninguna sobre distribución.
También tareado.

### Cierre del sprint 3 — 2026-08-23: la pregunta 3 tiene su primer «sí», y no lo dieron los números

Los tres marcadores: `contact_click` **9** · `file_download` **6** · `scroll` **60**. Contra el
cierre anterior (9 · 6 · 56), **dos clavados y uno movido**, y ese movimiento es lo que cierra la
pregunta 4: un panel congelado habría dado las tres idénticas, así que el +4 de scroll prueba que
la ventana avanza y que 9 y 6 son ceros reales, no un instrumento muerto. Verificado además que
`/contacto` sirve el formulario en producción.

**La pregunta 2 no se puede contestar, y conviene escribirlo para que el próximo cierre no lea
estas cifras como estancamiento:** entre este cierre y el anterior ha pasado **un día**. Una
ventana de 28 días que avanza 1/28 no produce lectura nueva. *Dos cierres consecutivos separados
por un día son un cierre, y el segundo solo puede verificar el instrumento.*

**Y la pregunta 3 tiene su primer «sí» en cinco cierres, que no salió de los números sino de
mirar qué se acababa de construir:** el sprint que entregó el formulario **cerró sin conectar su
propia métrica**. `trackContactSubmit` empuja `contact_submit` al `dataLayer` y ahí se queda —
falta el trigger de Custom Event, su tag de GA4 y marcarlo como evento clave, que es la mitad que
vive fuera del repo (D71). La métrica primaria del PRD §7 **no la cuenta nadie hoy**. Estaba
tareado en `General` con prioridad 80,5, por debajo de veinte `Could` de V3; repriorizado a 68,49
dentro del sprint siguiente.

**Distribución: «no», y escrito.** P69.9 (37 usuarios en 28 días, n=2) sigue sin sprint **por
decisión de Francisco**, no por descuido: agosto está parado en contratación en España, y el plan
es lanzar «Cómo se ha creado esta página» en **septiembre** y medir desde ahí. Eso convierte el
artículo en el vehículo de distribución —y a P68.49 en prerrequisito del lanzamiento—. Se anota
aquí y en la propia tarea porque un «no» silencioso vuelve como descuido en el cierre siguiente.

### Cierre del sprint 4 — 2026-08-25: la métrica primaria registra su primer evento, y la portada no sirve para verlo

**Los tres marcadores, y el panel vuelve a reproducir GA4 al dígito:** `contact_click` **9** ·
`file_download` **6** · `scroll` **62**, idénticos en Looker y en el informe de eventos de GA4
(28 jul - 24 ago 2026; 550 eventos, 46 usuarios, 181 `page_view`). Contra el cierre anterior
(9 · 6 · 60): **dos clavados y scroll +2**. Han pasado **dos días**, o sea 2/28 de ventana, así
que la pregunta 2 vuelve a no tener respuesta y era lo previsto — es literalmente la lección que
dejó escrita el cierre anterior.

**La pregunta 4 se cierra sobre una verificación por segunda vez, y esta es la que importaba:
`contact_submit` = 1 evento, 1 usuario**, dentro de la ventana 18-25 ago, o sea **posterior al
cableado del 24**. Es el primer registro de la métrica primaria del PRD §7 desde que existe. La
cadena `dataLayer` → trigger de Custom Event → tag de GA4 está verificada **de punta a punta con
un evento real**, no con la predicción de que lo estaría. `form_start` = 1 en la misma ventana,
así que el par abandono/finalización también funciona.

**El discriminador que lo prueba, y conviene guardarlo porque es reutilizable:** el hub de
eventos tiene dos pestañas, «Eventos clave» y «Eventos recientes», y la segunda lista **solo lo
que ha llegado en 28 días**. `purchase` —evento clave que no ha disparado nunca— aparece en la
primera y **no** en la segunda; `contact_submit` aparece en las dos. Eso separa «configurado» de
«ha llegado dato» sin depender de un recuento que puede estar procesándose.

**Y el hallazgo que ninguna de las cuatro preguntas pedía: la portada de GA4 dice «Eventos clave:
0» mientras el informe dice 1.** No es una contradicción — la marca de evento clave **no es
retroactiva**, cosa que el propio PRD §7 ya advertía. Pero sí significa que **ese cero no sirve
para vigilar esta métrica**, y que quien mire la portada leerá «nadie ha escrito» donde el dato
dice «la cadena funciona». Es la forma exacta del fallo de P31: un instrumento que parece
completo porque lo que falta no aparece en él. Refuerza P68.592 (cuarto scorecard), abierta en
este mismo cierre.

**Pregunta 3, «¿cambia una prioridad?»: no cambia el orden, pero confirma dos que ya estaban.**
P68.592 pasa de propuesta a hecho por lo de arriba. Y P69.91 sigue viva con la misma firma que en
el cierre anterior: **9 clics de contacto entre 2 usuarios (4,5 por persona) y 6 descargas entre
2 (3,0)** es el patrón de quien audita el sitio, no el de quien quiere contactar.

**Distribución, «no» por segunda vez y por la misma razón escrita.** 46 usuarios en 28 días, y el
24 y el 25 de agosto el tráfico es **cero**. Con eso ninguna métrica de conversión puede
discriminar nada, y no es un problema que arregle el tablero: agosto está parado y el plan sigue
siendo lanzar el artículo en septiembre y medir desde ahí. Lo que sí cambia es que **ahora habrá
con qué medirlo**, que es lo que este cierre añade sobre el anterior.

### El cuarto scorecard existe, y la cifra de partida queda escrita (2026-08-25, P70.05)

El panel publicaba tres scorecards y ninguno era la métrica primaria, así que **cada cierre de
etapa iba a leer tres secundarias y dar la primaria por no observada**, indefinidamente y sin que
nada avisara. Ya está el cuarto: «Envíos del formulario (últimos 28 días)».

**La cifra de partida**, 28 días hasta el 24-08, para que el cierre siguiente tenga contra qué leer:

| Scorecard | Evento | Valor |
|---|---|---|
| Clics de contacto | `contact_click` | 9 |
| Descargas de CV | `file_download` | 6 |
| Profundidad de scroll | `scroll` | 62 |
| **Envíos del formulario** | **`contact_submit`** | **1** |

**El filtro se comprobó, que es lo que esta entrada existe para no volver a saltarse.** Y de paso
salió que **los tres filtros que había NO eran iguales**: «Clics de contacto» y «Scroll profundo»
son de una cláusula (`Nombre del evento` = valor) y «Descargas de CV» es **compuesto, de dos**. El
nuevo se **duplicó del de una cláusula** en vez de escribirse, para heredar la estructura exacta.

**Verificado contra una fuente independiente, en dos puntos.** Sin filtro, el scorecard da **550**,
que es exactamente el total de eventos que GA4 reporta para esos mismos 28 días: la fuente y el
periodo cuadran. Con el filtro puesto, da **1**, que es exactamente lo que GA4 cuenta de
`contact_submit`. No hace falta el envío de prueba que pedía la tarea: **el evento real ya existe**
—se registró al conectar la cadena el 24-08—, así que el cero ambiguo del que avisaba («nadie ha
escrito» contra «el trigger no dispara») no llega a existir.

**Lo que sigue sin servir es la portada de GA4**, por lo dicho arriba: su «Eventos clave: 0» no es
retroactivo y seguirá diciendo cero para lo anterior a la marca. La cifra que vale es la del panel.

## D72 · Una sola fuente de qué páginas tiene el sitio, y olvidarlas no compila — 2026-08-19

**El hueco.** El mismo dato —qué páginas hay— estaba escrito **a mano en cuatro sitios**:
`app/sitemap.ts`, `scripts/page-html-diff.ts`, `app/llms.txt/route.ts` y la unión `Card` de
`app/api/og/route.tsx`. Y no había red debajo: `pageMetadata` aceptaba `slug?: string` libre, así
que el typecheck tampoco obligaba a registrar nada.

**La cuarta la encontró `/code-review` revisando el PR de esta misma decisión**, y merece
quedarse escrito: la tarea hablaba de tres listas, el trabajo cerró tres, y la reseña encontró
que quedaba una. Es literalmente lo que D59 hizo un día antes —arreglar la mitad y creer que
estaban las dos—, evitado esta vez porque algo ajeno al que escribió el código fue a contar.

**Ninguna de las cuatro falla de forma visible**, que es lo que las hacía peligrosas juntas: la
página no existe para Google, el gate de HTML deja de cubrirla **en silencio** —y es, según el
PRD, el gate que más ha cazado—, no aparece en el índice para modelos, y se publica con la
tarjeta OG de la home, cosa que solo ve quien comparta el enlace. «Una lista incompleta no
es un error de compilación» son las palabras de **D59**, que nombró esto el 2026-08-18 y arregló
solo la mitad: las páginas del deep-dive pasaron a derivarse de `EXPERIENCES` y las estáticas se
quedaron copiadas en las tres listas.

**Decisión — tres piezas, y la primera es la que más se puede malinterpretar.**

1. **`lib/routes.ts` es la lista.** Las estáticas **siguen siendo una constante escrita a mano**,
   y no por comodidad: ninguna de las tres consumidoras puede leer el sistema de archivos —dos
   corren dentro del bundle—, así que no hay forma de derivarlas en tiempo de ejecución. Lo que
   cambia es que ahora hay **una** en vez de tres, y que tiene dos guardianes encima. Las del
   deep-dive no se escriben en ninguna parte: salen de `EXPERIENCES`, la fuente de
   `generateStaticParams` (D44).
2. **`npm run check:rutas`, en CI.** Contrasta el registro con `app/[lang]/**/page.tsx` —el único
   sitio donde una página existe de verdad— **en los dos sentidos**, y comprueba además que las
   tres consumidoras sigan leyendo de ahí: el tipo impide olvidar una página, no impide que
   alguien vuelva a escribir una lista a mano al lado. Un segmento dinámico que no sepa expandir
   **lo dice** en vez de ignorarlo, porque un dinámico sin expandir son páginas que nadie está
   contando.
3. **`pageMetadata` pide `PageSlug`**, la unión derivada del registro. Añadir una página sin
   registrarla deja de ser un hallazgo de auditoría y pasa a ser un **error del compilador**. En
   la ruta del deep-dive el estrechamiento lo hace un guardián de tipo (`isExperienceSlug`) y no
   un `as`: afirmarlo habría sido volver al problema con otra forma.
4. **Y las tres superficies que necesitan un dato POR PÁGINA lo piden con un `Record` completo**:
   la fecha y la prioridad del sitemap, el título de `/llms.txt` y la tarjeta OG. Medido
   registrando una página falsa: **tres errores de compilación**, uno por cada cosa que hay que
   rellenar. El compilador pasó de no decir nada a llevarte de la mano por lo que falta.

   Lo que **no** se ha tocado es la cadena `cardParam === …` que `/api/og` usa en tiempo de
   ejecución: sigue escrita a mano. Es deliberado —cambiarla mueve lógica del endpoint y habría
   que reverificar las doce tarjetas— y no es el agujero, porque el `Record` incompleto ya
   detiene la compilación antes de llegar ahí.

**Validado rompiéndolo por las cuatro puntas**, que es la regla del proyecto: quitar «cookies»
del registro → código 1 nombrándola; añadir una fantasma → código 1 nombrándola; quitarle a
`sitemap.ts` el import del registro → código 1 nombrando el archivo y qué se rompe; y
`const SLUG = "cookies-nueva"` → `error TS2322: Type '"cookies-nueva"' is not assignable to type
'PageSlug'`. Afirma cuánto ha mirado —12 rutas en disco · 12 en el registro · 3 consumidoras— y
falla al mirar cero, y separa las dos mitades de lo que compara: **7 estáticas contrastadas
contra el disco · 5 del deep-dive derivadas · 4 consumidoras**. Las cinco del deep-dive salen de
la misma constante en los dos lados, así que contarlas como comparación sería contar de más.

**Y la transparencia se midió, no se afirmó:** la salida de `sitemap()` y el texto entero de
`/llms.txt` son **byte a byte idénticos** antes y después del refactor, y `npm run gate:html`
da **cero cambios en las 24 variantes**.

**De paso, el gate tenía un rojo que no dependía del cambio, y por eso se documenta por
MECANISMO** (D67). El `<meta name="next-size-adjust">` que emite `next/font` cambia de POSICIÓN
dentro del `<head>` entre builds del mismo commit. Se comprobó como se comprueban estas cosas
aquí: capturando la línea base en `main`, **reconstruyendo `main`** y comparándolo contra sí
mismo — una sola de las 24 variantes (`/en/trayectoria/freepik`), siempre esa, y sin una línea de
código de por medio. Ahora la etiqueta se normaliza fuera: su contenido está vacío y nunca ha
dicho nada, y un gate que da un rojo falso deja de leerse, que es el modo de fallo de D70 por la
otra puerta.

**Estado:** CI pasa de doce a **catorce** pasos (`check:rutas` y `check:guardianes`, este último
por P54.96). Los guardianes con caso malo pasan de siete a **nueve**: `check:experiencias`
—descubierto, y el que sostiene una exclusión de `.qlty/qlty.toml`— y `check:rutas`, que entra
con el suyo desde el primer día.

### Enmienda (2026-08-25, P70.03): derivó el tipo y dejó suelto el despacho

**Esta entrada se quedó a medias, y el hueco vivió en producción un sprint entero.** El
tipo `Card` de `/api/og` se derivó de este registro, así que registrar una página sin copy
de tarjeta dejó de compilar. Pero **quien elige qué tarjeta pintar no era el tipo**: era una
cadena de seis `cardParam === "…"` escrita a mano dentro del handler. Cuando entró
`/contacto`, el compilador exigió su entrada en la tabla de copy y nadie tocó el `if`.

Resultado, medido byte a byte sobre el build servido: **1 de 14 páginas publicaba la tarjeta
de la home**, con el md5 idéntico en ES y EN, y era justo la del embudo. Un enlace a
`/contacto` pegado en LinkedIn salía con «Del discovery al dato».

**La lección es sobre el ALCANCE de una derivación, no sobre el olvido.** Derivar el tipo
cierra la autoría —qué se puede escribir— y no cierra el despacho —qué se elige en tiempo
de ejecución—. Son dos preguntas y esta entrada solo contestó la primera. Ahora las dos
salen de `OG_CARDS` y `resolveOgCard` en `lib/routes.ts`, y **al guardián lo llama el mismo
`resolveOgCard` que usa el handler**: `check:marco` comprueba sobre el HTML servido que el
`?card=` de cada variante resuelve a la suya, y afirma cuántos ha resuelto (28). Su caso
malo entra en `check:guardianes` y no es inventado: es este fallo.

## D73 · Un lector de pantalla encuentra lo que ningún escáner puede, y un escáner encuentra lo que no existe — 2026-08-20

**El hueco.** La sección 03 de `/accesibilidad` listaba cuatro herramientas —axe-core,
Lighthouse, contraste medido, teclado y foco— y **ninguna era una tecnología asistiva**. El
sitio afirmaba «cualquier persona, con ratón, teclado o lector de pantalla», sin haber pasado
nunca un lector de pantalla.

**La regla que lo gobierna, y por la que la ejecución fue tarea propia y anterior al
contenido:** escribir «probado con NVDA» sin haberlo probado convierte el activo —credibilidad
técnica verificable— en un pasivo. O se prueba, o no se publica.

**Cuándo se dispara.** No al cerrar una página: eso ya lo cubre `viewport-verifier` (D52). La
pasada con lector de pantalla es de **sitio entero**, y su periodicidad la marca el cambio de
superficie, no el calendario. Al cerrarla se actualiza `LAST_A11Y_REVIEW` en
`lib/design-values.ts`, que es la fecha que la página publica.

### Los cuatro defectos, y por qué ninguna herramienta podía verlos

Ninguno **incumple una regla WCAG**, y ahí está el asunto: axe no tiene nada que decir sobre
ellos porque no hay criterio que violen.

1. **`Esc` no cierra el menú móvil.** Cero manejadores en `nav.tsx`. No es trampa de teclado
   (se tabula fuera), pero es expectativa universal de cualquier desplegable.
2. **El panel del menú va después del botón de tema en el DOM**, así que al abrirlo el primer
   `Tab` lleva al toggle claro/oscuro y no a los enlaces.
3. **El cambio de tema es mudo**, y la causa resultó más ancha que el síntoma: **no hay una
   sola live region en todo el sitio**, el botón nunca refleja el estado y no lleva
   `aria-pressed`.
4. **El aviso de consentimiento es lo último del DOM y no se anuncia.** Quien ve se lo
   encuentra sobre el Hero al cargar; quien usa lector recorre las diez secciones de la home y
   el pie antes de enterarse de que existe. No es una banda decorativa: es un mecanismo de
   consentimiento con peso legal.

Tareados en P87.51-P87.55, y **publicados en la propia página** (§04, «Ser honesto también es
accesibilidad»): una página que dice qué encontró sostiene mejor el argumento que un 100/100
pelado.

### El contraste, el mismo día: un escáner externo, 3 de 3 falsos positivos

Un informe comercial (93/100 de riesgo, 3 hallazgos revelados y 11 tras un plan de pago) dio:

| Su afirmación | Qué dijo la medición |
|---|---|
| «Elementos ocultos reciben foco», 20 instancias | **Falso positivo.** 34 paradas de `Tab`: cero con el foco en algo invisible |
| «Región con scroll sin acceso de teclado», 2 | **No reproduce.** Diez páginas a 390px: una sola región con scroll, y ya tiene `tabindex="0"` |
| «Contenido fuera de landmark», 10 | **Por diseño.** Es el enlace de salto, que tiene que ir antes del `banner`, y el anunciador de rutas de Next |

**EL MECANISMO QUE LO EXPLICA, que es lo reutilizable: un escáner lee el DOM INICIAL; un
lector de pantalla recorre el DOM VIVO.** Por eso el escáner contó como «oculto pero
focusable» cada elemento que espera su reveal bajo el pliegue —20 instancias en 5 páginas
encaja exactamente con eso— y por eso no vio ninguno de los cuatro defectos reales, que solo
existen mientras alguien interactúa.

Es D67 confirmado por segunda vez, y ahora con la simetría completa: **el ruido de los
validadores externos es real, y el silencio de los automáticos también.**

### Dos trampas de método que costaron rato, documentadas por mecanismo (D67)

- **Una hipótesis mía se cayó al medirla, y menos mal que se midió antes de tarear.** Di por
  roto el enlace de salto («el foco no se mueve, falta `tabindex="-1"`») a partir de un
  informe de oído ambiguo. `document.activeElement` devolvió `MAIN id=main tabindex=-1`: la
  pieza que sospechaba que faltaba, estaba.
- **Un servidor viejo falseó una verificación.** El `mailto:` salía sin asunto porque un
  `next start` de dos horas antes seguía ocupando el puerto: `TaskStop` mata el envoltorio y
  no el proceso, así que el servidor nuevo nunca llegó a escuchar y se estaba leyendo el build
  anterior. Se detectó comparando la hora de arranque del PID con la del build. Familia «el
  metro que responde no es el metro que está midiendo».

### Lo que la pasada NO cubre, dicho para que no se dé por cubierto

**Solo NVDA 2026.1.1 sobre Chrome.** Ni VoiceOver, ni JAWS, ni Firefox, y NVDA se comporta
distinto según el motor. La página lo dice con esas palabras y añade que ampliarlo está en el
plan. La herramienta queda instalada como copia portable, no como instalación.

## D74 · Un compromiso no caduca y una medición sí: fuera de su fuente se publica el umbral — 2026-08-20

**Decisión.** Cuando un artefacto que vive **fuera del alcance del generador** tiene que
hablar de un resultado del proyecto, publica el **umbral comprometido**, nunca la medición
del día, y enlaza a donde vive la cifra.

**Contexto — el caso que D38 y D60 no cubrían.** D38 puso los valores publicados en una
fuente única, y D60 dejó dicho que una fuente única evita dos verdades **mientras genera**:
el día que una copia impresa se queda quieta, vuelven a ser dos. Pero quedaba un caso sin
regla, y es justo el que más se lee desde fuera: los artefactos a los que el generador no
llega. El README de GitHub, una tarjeta social, un perfil de LinkedIn, el copy de un
artículo. Ahí no hay fuente que consultar en tiempo de build, así que la pregunta no es «¿de
dónde lo leo?» sino **«¿qué se puede escribir a mano sin que envejezca solo?»**.

**La respuesta: la regla, no el resultado.** «AA de suelo y AAA de objetivo» es una decisión
del proyecto y sigue siendo cierta mientras el proyecto la mantenga. «AAA en ambos temas» es
una medición, y deja de serlo en cuanto entre un par de color nuevo. Lo mismo con «>90 en
escritorio y móvil» (D8) frente a «100 escritorio · 94-96 móvil», que además cambia con cada
despliegue y con la máquina que mide.

**Aplicado a:**

- **Los dos badges del README** (2026-08-20). `WCAG · AAA en ambos temas` → `WCAG · AA suelo
  · AAA objetivo`; `PageSpeed · 100 escritorio · 94-96 móvil` → `PageSpeed · >90 escritorio
  y móvil`. Quien quiera la cifra del día la tiene en `/accesibilidad` y en `npm run psi`.
- **La social preview**, que dejó de contar cosas por este mismo motivo el 2026-08-19: *las
  cifras caducan, la imagen no*.
- **El copy de «Cómo se ha creado esta página»**: publica umbrales y enlaza a las páginas que
  ya publican su cifra. Es lo que resuelve el «remate de resultados» que quedó abierto en P58
  (`PRD-Historical.md` §53).

**Lo que NO cubre.** Las páginas del sitio siguen leyendo de `lib/design-values.ts` (D38):
ahí hay generador, y ahí la cifra exacta **es** el producto: una página de accesibilidad que
publicara umbrales en vez de mediciones no estaría declarando nada. Esta regla es solo para
lo que queda fuera de ese alcance.

**Su pariente.** D67 dice lo mismo para el ruido de los validadores: se documenta por
**mecanismo, no por cifra**, porque «la puntuación era 87» obliga a rediscutirlo al mes
siguiente con otra puntuación. D74 lo generaliza a todo lo que se publica fuera de la fuente.

**Cabo abierto del mismo tipo, dicho para que no se dé por cerrado:** el README también
afirma «Doce páginas por idioma». Hoy es cierto y serán **trece** al publicar «Cómo se ha
creado». Es un recuento escrito a mano, de la misma familia que los badges, y con una
diferencia: este sí tiene fuente (`lib/routes.ts`, D72), así que su arreglo natural no es el
umbral sino generarlo.


## D75 · Lo que verifica una página no es su código, es el HTML que emite — 2026-08-20

**Decisión.** `npm run check:marco` (`scripts/check-marco.ts`) entra en CI justo detrás de
`Build` y comprueba, sobre las **24 variantes prerenderizadas**, lo que quedaba del criterio
de cierre de página: **axe** sobre lo estructural, el **enlace de salto**, el marco
accesible que pone quien escribe la página, que la **derivación de metadata llegó**, y que
las referencias **`@id`** del JSON-LD resuelven. Con él, CI pasa de catorce pasos a
**quince**, y `check:guardianes` se mueve al final porque ahora necesita el build.

**Contexto.** El criterio de cierre de `CLAUDE.md` —los 8 puntos de accesibilidad, el enlace
de salto, el SEO y su JSON-LD— se cumplía **a mano y por página**, o sea dependía de
acordarse. Es literalmente el patrón que `BRAND.md` §Cómo se escribe una regla nombra como
el que produce drift.

**Por qué esto y no «axe y Lighthouse en CI», que era como estaba planteado en 2026-08-10.**
Porque entre medias se hizo D45 y D72, y **media lista dejó de poder romperse**: `pageMetadata`
deriva canonical, los tres `hreflang`, OG y Twitter; `PageShell` pone el `<main>`, el enlace de
salto y el breadcrumb; `check:rutas` cubre el registro. Automatizar eso habría sido automatizar
la comprobación de algo que ya es imposible de romper. Y el mismo argumento, una vuelta más
allá, es el que deja **contraste y objetivo táctil FUERA**: son los puntos que se **heredan**
de la capa de componentes (`CLAUDE.md` §Qué compra esto), y los cubre `viewport-verifier` en
navegador de verdad (D52). Lo que este gate mira es justo lo que **no** se hereda.

**Las tres cosas que sí puede romper una página nueva, que son las que mira:**

1. **Lo que pone quien la escribe** — puntos 4, 5 y 8 del checklist: un solo `h1` y jerarquía
   sin saltos, breadcrumb con `aria-current`, alternativas textuales. Más todo lo estructural
   de axe (47 reglas evaluadas: `link-name`, `button-name`, `aria-*`, `region`, `list`,
   `heading-order`…).
2. **Que la derivación LLEGÓ.** Los helpers son **opt-in**: una página que se escriba su
   metadata a mano compila igual, y el canonical de otra página o la tarjeta OG del otro
   idioma solo los ve quien comparte el enlace, después de compartirlo.
3. **El enlace de salto**, que **axe no detecta** —su regla `bypass` se conforma con los
   landmarks— y cuya ausencia fue el único incumplimiento de nivel A que ha tenido el sitio
   (D46).

**Y una que ningún validador externo hace: resolver los `@id`.** El Schema Markup Validator y
la Rich Results Test validan **cada bloque por separado**, así que un identificador colgando
les sale verde. Está dicho desde antes en `lib/structured-data.ts`, en el párrafo que explica
por qué `isPartOf` no está: «un identificador que ningún nodo declara. Valida igual […] y no
significa nada». Ahora se comprueba de verdad, y **contra todo el sitio**: el `Person` lo
declara solo la home y lo referencian los cinco deep-dive, así que la comprobación no puede
ser por página.

**De dónde sale el HTML: del build, no de un servidor.** Las doce páginas × dos idiomas se
prerenderizan (D45), así que el gate lee `.next/server/app/**.html` y cuesta ~37 s sin
navegador ni `npm start`. Eso es lo que decide que corra **en cada PR** en vez de ser un
nightly, que era la tercera opción sobre la mesa. El precio: depende de una ruta interna de
Next, así que si un día cambia, el guardián **no encuentra los archivos y lo dice** — la
única salida que no vale es seguir en verde mirando cero variantes.

**El caso malo vive en el HTML, no en el código, y es el primero así.** `check:guardianes` le
pasa a este guardián una home sin enlace de salto mutando `.next/server/app/es.html`. Romper
el componente en su lugar habría exigido reconstruir —dos minutos por caso— y sobre todo
habría probado otra cosa: que el build propaga el cambio, no que el detector sabe verlo. Como
consecuencia, `check:guardianes` deja de correr antes del build y pasa a ser el último paso;
y un caso sin material no se salta en silencio, se cuenta como fallo, que es lo contrario de
lo que ese script existe para combatir (D70).

**Validado rompiéndolo, con diez casos malos** antes de darlo por bueno: sin enlace de salto,
sin `h1`, JSON-LD inválido, sin `@context`, canonical de otra página, `hreflang` mal apuntado,
tarjeta OG del otro idioma, `img` sin `alt`, y un `@id` que nadie declara. Los diez rojos.
Dos de los primeros intentos salieron «no lo ve» y **el fallo era de la mutación, no del
guardián** —un espacio de más en el JSON seguía siendo JSON válido; la página elegida no tenía
imágenes—, que es la trampa 3 de `BRAND.md` §Cómo medir: valida el metro antes de creerte el
hallazgo, y también antes de creerte el hueco.

**Lo que sigue fuera, dicho para que no se dé por cubierto.** Contraste, objetivo táctil, foco
visible y `reduced-motion` (necesitan pintar y tema → `viewport-verifier`, D52) · lo que no
incumple ninguna regla —un `Esc` que no cierra, un cambio de tema que no se anuncia— que es la
pasada con lector de pantalla (D73) · el punto 6, «nada codificado solo por color», que no
tiene forma automática · y la nota de PageSpeed, que sigue siendo `npm run psi` a demanda
porque su variabilidad daría rojos falsos (D49).

## D76 · Una capa nueva para texto largo, y el control que le faltaba al chrome sobre banda invertida — 2026-08-21

> **CORREGIDA EN UNA PIEZA el 2026-08-25 por D113.** La capa son SIETE, no ocho:
> `LiveStat` salió a `ui/live-stat.tsx` cuando `/accesibilidad` quiso publicar una cifra
> derivada. Su premisa —«un formato que hoy solo tiene una página»— nunca fue cierta para
> esa pieza; lo era para las otras siete, y ahí D76 sigue en pie.
>
> **Y EN TRES MÁS el 2026-08-26 por D121.** La capa son CUATRO: el índice, el riel y el
> cierre de bloque salieron a `ui/section-index*.tsx` al entrar en las tres páginas
> hermanas. Segunda vez que ocurre lo mismo, y eso ya no es un caso sino un patrón: **la
> premisa de D76 no se rompe de golpe, se rompe pieza a pieza**, y lo que la rompe siempre
> es una SEGUNDA página queriendo algo que se escribió para una. Lo que queda dentro
> —firma, portada de capítulo, cita, franja de repo, diagrama, prosa y la barra de
> progreso— sí es de texto largo, y ahí D76 sigue entero.

**El problema.** «Cómo se ha creado esta página» (P60) es la primera página del sitio con
~6.000 palabras de prosa continua, y las siete piezas del sistema (D36) no cubren ese caso:
ninguna resuelve un índice navegable con tiempo por sección, una portada de capítulo, una cita
que para la lectura, un dato que no se escribe a mano, o una transición entre paradas. Escribir
eso a mano en `components/site/como-se-ha-creado.tsx` habría sido la primera excepción a la
Regla de construcción del proyecto entero.

**La capa: `ui/article.tsx` + `ui/article-islands.tsx`, ocho piezas.** Servidor —`ByLine`,
`ArticleIndex`, `SectionCover`, `Pullquote`/`Pull`, `LiveStat`, `RepoStrip`, `ChapterNav`,
`DiagramPanel`— y tres islas de cliente —`ReadingProgress`, `SectionRail`, `ShareActions`—,
mismo patrón `design-system.tsx`/`design-system-islands.tsx` que ya separa server de cliente
en el resto del sitio (D7). Publicada en el Design System (sección 15) antes de cerrar la
tarea, como pide la Regla de construcción.

**No es una octava pieza del núcleo de D36.** Las siete de esa decisión resuelven lo que usa
TODO el sitio —un botón, un enlace de nav, una etiqueta—; esta resuelve un FORMATO, el de
texto largo con paradas, que hoy solo tiene una página. Encima de las siete no habría sido
cierto: viven AL LADO. Decidido con Francisco el 2026-08-21, para no repetir el error que D36
mismo corrigió una vez —tratar como núcleo transversal algo que en realidad era un caso.

**Las citas viven DENTRO del cuerpo, no en un campo aparte.** Primer diseño: `pullquote`/`pull`
como propiedades sueltas de la sección, renderizadas después de toda la prosa. Con la sección
servida delante, se leían apiladas al final junto al diagrama, el dato-en-vivo y la franja de
enlace — mucho peso gráfico junto, poco durante la lectura. Se movieron al array `body` como
un bloque más (`{ type: "quote", style, side }`), en el punto exacto del párrafo que las
origina, y pasaron a **flotar** (`float: left/right`) para que el texto siga alrededor. Es la
misma lección de D57 aplicada a un tipo de dato nuevo: el sitio del dato en la estructura
importa tanto como el dato.

**El chrome no tenía variante para banda invertida, y hacía falta interactivo por primera
vez.** `mas-alla.tsx` (D41) ya probaba que un texto sobre `bg-foreground` necesita su propio
cálculo de contraste, pero nunca había puesto un `<nav>` de breadcrumb ni un `<button>` encima.
Al hacerlo aquí, dos piezas compartidas fallaron con el mismo patrón que D41 ya había nombrado
una vez y que no se había generalizado:

- `Breadcrumb` pintaba el nivel actual en `text-foreground`, que sobre una banda con
  `bg-foreground` **es el color de fondo de la propia banda** — texto invisible, no un fallo de
  contraste que un metro detecte, sino un texto que no existe visualmente.
- `chromeLinkVariants({ tone: "muted" })` sube a `text-foreground` en **hover**, mismo problema
  un gesto más tarde.

Las dos ganaron una variante —`Breadcrumb({ inverted })` y `chromeLinkVariants({ tone:
"inverted" })`— que resuelve en reposo con `text-muted-foreground` (correcto porque el ancestro
lleva `data-surface="inverted"`, D39) y en hover/foco sube a `text-background`, el mismo
«tinta llena» que ya usa el resto del texto de la banda. Reutilizable la próxima vez que
alguien ponga chrome interactivo sobre una banda invertida, que hasta esta tarea nadie había
hecho.

**El botón «Compartir»/«Copiar enlace» no podía reusar `outline-neutral` tal cual**, por el
mismo motivo que BRAND.md §Un control sobre una imagen ya había nombrado para un caso distinto:
el color no puede fijarse, tiene que derivarse del fondo real. `outline-neutral` es
`bg-background text-foreground` — sobre la banda pintaba un rectángulo claro flotando encima de
un fondo oscuro, legible pero visualmente roto. `ShareActions` ganó un prop `onInverted` que
sustituye ese trío por uno derivado de `--background`/`--foreground`, sin tocar la variante
compartida (que sigue sirviendo a todo lo demás sin cambios).

**Verificado con `viewport-verifier` antes y después.** La primera pasada (24 combinaciones,
ES/EN) encontró los tres huecos de arriba con cifras: el riel de navegación (otro elemento con
el mismo problema, resuelto dándole su propia superficie opaca en vez de heredar tono) a
1,9-2,2:1, el numeral decorativo de cada portada a 1,63:1 en claro y prácticamente 0 en oscuro,
y el borde del botón `onInverted` a 2,1-3:1 — los tres por debajo de sus umbrales. Corregidos y
no re-verificados con una segunda pasada automatizada completa; queda pendiente antes de cerrar
la tarea.

## D77 · Un bug que ya estaba comentado tres veces, y el diagrama pasa a vivir donde vive la cita — 2026-08-21

**El problema, otra vez.** La apertura de «Cómo se ha creado esta página» centraba TODO el
bloque —incluido el breadcrumb— en ANCHO, no solo en alto. Es el mismo bug que ya rompió Brand
Kit y Design System antes de esta tarea: `WRAP` (`mx-auto max-w-[...]`) dentro de un contenedor
`flex flex-col` deja de estirarse a lo ancho —`mx-auto` desactiva el `stretch` del eje
transversal por especificación— y la caja se encoge a su contenido, desplazándose al centro.
El mecanismo ya estaba explicado en un comentario de `brand-kit/hero.tsx`. No sirvió: el
comentario vive donde el código ya está bien, no donde alguien va a escribirlo mal la próxima
vez. **Una regla que hay que recordar es una regla que se incumple** (D60, y la propia cita de
cierre del artículo que este bug afecta) — la tercera repetición es la prueba. El arreglo es el
de siempre (`${WRAP} flex w-full flex-1 flex-col`, breadcrumb anclado arriba, `my-auto` solo en
el grupo inferior); lo que cambia aquí es solo dejarlo escrito una vez, en un sitio que un
`grep` de "flex flex-col" + "WRAP" pueda encontrar antes de reescribirlo mal.

**El diagrama se mueve dentro del `body`, como ya hizo la cita en D76.** Los seis diagramas de
D76 vivían en un registro aparte (`DIAGRAMS`, id de sección → componente) y se pintaban SIEMPRE
después de toda la prosa de la sección, nunca junto al párrafo que los explica — el mismo
defecto que D76 ya había corregido para las citas (viste texto apilado al final, poco durante la
lectura) pero que no se generalizó al construir el diagrama. `ArticleBlock` gana un tercer tipo
flotante, `{ type: "diagram", id, caption }`, con el mismo mecanismo de `float` que la cita; el
registro `DIAGRAMS` pasa de `id → componente` a un prop que recibe `ArticleProse`, para que siga
siendo site-specific (D36) sin que la pieza genérica sepa dibujar nada. Encontrado al revisar
las once secciones para la tanda 2 de feedback: no era solo el diagrama de apertura, eran los
seis.

**El texto DENTRO de un SVG también es copy, y por eso también hay que traducirlo.** Verificando
la versión EN de la página tras mover los diagramas, la mitad de cada uno seguía en español —
«selección · 5-10s», «se usa», «busca ausencia»—, hardcodeado en el componente igual que el pie
ya se había hardcodeado antes de D76. Mismo bug, una capa más adentro, encontrado por la misma
disciplina que D20 pide: mirar la página en el otro idioma, no asumir que el componente ya lo
resuelve. Cada diagrama de `como-se-ha-creado-diagrams/` gana un prop `lang` y un objeto
`{ es, en }` con su propio texto; `ArticleProse` no lo sabe, solo lo recibe ya resuelto desde
`como-se-ha-creado.tsx`, que es quien conoce el locale de la página. La misma pasada encontró un
segundo caso idéntico fuera del SVG: el «N de M» de `ChapterNav` llevaba la palabra «de» escrita
a mano en vez de leer `sectionMeta.of` del diccionario, que ya existía y ya se usaba correctamente
dos líneas más arriba en el mismo archivo.

**Lo que compra esto, dicho una vez:** los tres hallazgos son la misma familia de error —un
valor correcto que vive en dos sitios y solo se actualizó en uno—, y los tres se encontraron
verificando la página SERVIDA en los dos temas y los dos idiomas, no leyendo el código. Es
D75 aplicado de nuevo: lo que hay que comprobar es el HTML que la página emite.

## D78 · El dato en vivo se vuelve un bloque más, y el pie deja de tener dos estilos — 2026-08-21

**El «dato en vivo» pasa de campo aparte a bloque del cuerpo.** `LiveStat` se enganchaba a la
sección por un campo propio (`s.liveStat`) y se pintaba SIEMPRE al final, después de toda la
prosa — el mismo defecto que D76/D77 ya habían corregido para la cita y el diagrama, pero que
no se generalizó al construirlo. Con el feedback de la tanda 3 pidiendo un dato en vivo dentro
de «Lo que encuentra: lo que existe» (s09) en vez de al final, se le aplicó la misma cura:
`ArticleBlock` gana `{ type: "livestat" }` y `ArticleProse` lo resuelve donde el diccionario lo
ancle. El `href` («design-system», «github»…) sigue resolviéndose fuera de la pieza genérica
—`resolveLiveStatHref`, prop que aporta el llamador, mismo patrón que `diagrams` (D36)— y el
«ejemplo real» de un dato (los `Badge` de s05) sigue siendo un registro id→nodo aparte.

**`RepoStrip` pasa a `tone: "chrome"` por defecto, en las once secciones.** La versión de D77
solo lo aplicaba al cierre, razonando que ahí ocupaba el sitio de `ChapterNav`. El feedback
señaló la grieta: en las OTRAS diez secciones, la franja «ENLACE ·» (subrayada, tono contenido)
vive pegada justo encima de «Índice · Siguiente» (pastilla, tono chrome) — dos estilos de
enlace en el mismo pie de sección, y esa inconsistencia importaba más que la distinción de
origen que la motivó. `tone: "content"` se queda como opción de la pieza por si algún día la
franja cae de verdad en medio de un párrafo; hoy ningún call site la usa.

**Compartir gana un dock flotante, y la lógica de compartir se saca a un hook.** Los botones de
compartir/copiar solo vivían en la apertura; quien ya había bajado a leer no tenía forma de
compartir sin volver arriba. `FloatingShare` es la pareja del `SectionRail` ya existente —mismo
breakpoint (`xl:`), mismo lado opuesto, misma regla de aparición (desde el capítulo 01, para no
duplicar los botones que la apertura ya muestra)—, con las mismas 44px de objetivo táctil que el
resto del chrome solo-icono. La lógica de `navigator.share` con fallback a copiar, que antes
vivía solo dentro de `ShareActions`, se extrajo a `useShareLink` para que el dock la reutilizara
sin copiarla: dos call sites de la misma lógica de estado no se copian, se comparten.

## D79 · Un prototipo: una dirección ganó — 2026-08-21

**Contexto.** La tanda 3 de feedback pedía animar los diagramas de nodos/líneas, rehacer el de
la cascada («muy mejorable») y fusionar los dos gráficos de «Qué revisa una IA» en uno. Las tres
son decisiones de diseño, no fixes mecánicos, así que en vez de decidir a ciegas se construyó un
artefacto con tres variantes por cada pregunta —comparadas en vivo, con los tokens reales— y
Francisco eligió mirándolas, no describiéndolas (mismo método que D1 ya dejó escrito).

**Las tres preguntas y lo que ganó:**

- **Cómo se anima un diagrama de nodos/líneas** (puntos 4-5): tres direcciones —«Ensamblaje»
  (construcción literal: el origen nace, las piezas se despliegan, las líneas se lanzan),
  «Cascada» (fundido en cadena sin dibujar líneas, el más barato) y «Realce» (la figura entera
  visible desde el principio, atenuada, con un barrido secuencial que la lleva a opacidad
  plena)—. Ganó **Realce**: el lector nunca espera para ver la figura completa, y es la única de
  las tres que no depende de que el observador se quede mirando la animación para entender el
  diagrama — si se pierde el barrido, la figura ya estaba toda ahí.
- **El diagrama de la cascada** (punto 5 bis): «Escalera descendente» ganó a «Raíl horizontal» y
  «Pipeline numerado» porque es la única que hace visible en la FORMA lo que el texto ya decía
  —la mayoría de casos se resuelven en la primera pregunta—, con el indentado decreciente y un
  «si no» explícito entre preguntas.
- **Los quince pasos de CI** (punto 11): «Agrupado por rol» ganó a «Cadena compacta» y «Riel
  vertical» porque el lector entiende la FORMA del pipeline (código → contenido → guardianes →
  cierre) sin memorizar quince nombres sueltos. Es una agrupación editorial —no texto que ya
  existiera en el artículo—, así que los cuatro rótulos de grupo (Código, Copy y contenido,
  Guardianes del repo, Build y marco) quedan documentados aquí como lo que son: una lectura
  propuesta, no un hecho citado.

**Implementación de «Realce», la regla que queda para todo diagrama de este estilo.** Cada
pieza interna de un diagrama —no el marco, que sigue con el `data-reveal` normal de
`DiagramPanel`— lleva la clase `.rlz` y una variable `--i` con su orden NARRATIVO (el origen
primero, lo que depende de él después; nunca la posición en el DOM). La CSS vive en
`app/globals.css`, junto al resto de la capa de motion (`RevealRoot`/`reveal-on`), y reutiliza
el MISMO disparador: cuando el `[data-reveal]` del `<figure>` padre gana `data-shown`, sus
`.rlz` pasan de opacidad 0,34 a opacidad 1, cada una con `transition-delay: calc(var(--i) *
130ms)`. Sin `.reveal-on` —sin JS, o `prefers-reduced-motion`— cada `.rlz` es opacidad 1 desde
el primer render: el barrido es un extra sobre el fade-up existente, nunca la única vía de ver
el diagrama completo, y no hace falta tocar `RevealRoot.tsx` para nada de esto.

**Dos diagramas más se redibujaron para servir de demo real, no de maqueta.** El de «Dos
lectores, dos velocidades» y el del stack son los que Francisco vio animarse en el prototipo, así
que llevan el orden narrativo exacto que se validó ahí (cabecera → panel → capa morada → texto,
para el primero; núcleo → líneas → nodos → etiquetas → leyenda, para el segundo). Los otros dos
diagramas de nodos/líneas del artículo (consentimiento, capas de verificación) heredan la misma
regla por coherencia, aunque no se prototiparon en detalle — es la misma «regla, no una
animación por diagrama» que ya pedía D67 en otro contexto.

**El diagrama de los 15 pasos absorbe al dato en vivo que tenía al lado** (extiende D78): con el
diagrama mostrando ya los quince nombres reales, «Quince pasos en cada PR» —el `livestat` que
vivía junto a él— pasó a ser el mismo dato dos veces. Se retira el bloque, no se sustituye.

## D80 · Un flotado sin `mt` se alinea con su texto, y el marco se ajusta al contenido — 2026-08-22

**Contexto.** Cerrado el ciclo de tandas numeradas de P59/P60, la última ronda de ajuste fino
—colocar imágenes, centrar citas, ajustar diagramas— se hizo con Francisco dando feedback
directo en el chat sobre la página servida, sin abrir Notion. Es un cambio de canal, no de
método: sigue siendo «revisado en pantalla antes de comitear» (regla ya escrita en P60), solo
que el registro de cada punto vive en la conversación y no en la Nota de la tarea.

**`DiagramPanel` gana un tercer `side`: `"center"`.** Hasta ahora un diagrama o imagen sin
`side` ocupaba el ancho COMPLETO de la columna de prosa, aunque su contenido —una captura, un
grupo de píldoras— fuera mucho más estrecho: el marco quedaba con aire vacío a los lados que no
aportaba nada. `"center"` no flota (a diferencia de `"left"`/`"right"`) y limita el marco a un
70% centrado (`mx-auto w-full sm:w-[70%]`), dejando que el `max-w` propio del contenido decida
el tamaño real dentro de ese marco más ajustado. Se aplicó a las capturas nuevas (tablero
MoSCoW en s02, panel de Qlty en s07) y a los diagramas SVG que no necesitan correr junto a un
párrafo concreto (las cuatro píldoras de color en s03, el de consentimiento en s07, el de capas
de verificación en s08, el de los quince pasos de CI en s09).

**Un flotado (`side: "left"`/`"right"`) no lleva `mt`: ya lo pone el `space-y` del párrafo.**
`DiagramPanel` sumaba `my-[1.5rem]` a TODOS los `side`, pero un elemento flotado ya hereda el
margen superior del ritmo vertical del contenedor (`space-y` de `ArticleProse`) — sumarle
encima su propio `mt` lo dejaba empezando más abajo que el texto con el que corre en paralelo,
y esa misma diferencia se acumulaba abajo: el flotado sobresalía más de lo necesario por debajo
del último párrafo. Detectado con el diagrama del stack en s04 (el más alto de los flotados,
donde el desajuste se veía a simple vista) y corregido en el componente compartido: `mb` se
queda para todos, `mt` solo para los que no flotan (`"center"` y sin `side`).

**Una cita se centra respecto a su lista partiéndola en dos, no moviendo la cita.** Patrón que
ya existía en s01 (P60) y que esta tanda repitió dos veces más (s07, s09): cuando una cita
flotada (`Pull`/`Pullquote`) cae justo DESPUÉS de una lista larga, el float sube hasta el final
de la lista y queda pegado al fondo en vez de centrado. La lista se parte en dos bloques `ul` con
la cita entre medias, en el punto que mejor reparte la altura — no hay forma de centrar un
flotado contra contenido de altura dinámica con solo CSS, así que el punto de corte se decide
midiendo (`getBoundingClientRect`) sobre la página servida, no a ojo.

## D81 · Foto en la apertura, evidencia citada en vivo, y una prueba descartada — 2026-08-22

**Contexto.** Última sesión antes de cerrar P60: ajuste fino en chat (mismo canal que D80),
sobre la página ya servida. Cinco piezas, agrupadas aquí por llegar en la misma sesión.

**La Apertura, nueva sección antes del índice.** Bloque de prosa de entrada, fuera del
recorrido numerado —sin ordinal, no cuenta en `indexItems`, no aparece en el riel ni en
`ChapterNav`— pero sus palabras sí entran en el recuento total (`articleWordCount` ya tenía el
parámetro `extra` pensado para esto). Ancho de media columna (`--measure`, ~42rem): a cuatro
frases cortas, la columna completa de prosa dejaba líneas larguísimas para tan poco texto.
Titular propio con `SectionHeader` (`level={2}`, `size="section"`): sigue habiendo un solo
`h1` real, el del hero, pero en el mismo tamaño que separaba las once secciones numeradas — la
única cabecera del artículo que no abre una parada del recorrido, y el tamaño lo dice antes que
el texto.

**El `ByLine` gana foto real.** Hasta ahora era iniciales sobre `--muted` siempre
(`ui/article.tsx`). Gana `photoSrc`/`photoAlt` opcionales: con foto, `next/image` `fill` dentro
de un círculo `overflow-hidden`; sin ella, sigue el comportamiento de siempre. La foto de este
artículo es un recorte cabeza-hombros de la foto de portada de la home
(`public/img/francisco-como-se-ha-creado-byline-1x1.webp`), cuadrado, cara centrada.

**Tres huecos de contenido, cada uno citando una fuente externa en vivo, no una cifra escrita
de memoria.** (1) Accesibilidad: un párrafo nuevo antes del `livestat` de contraste, sobre por
qué el sitio sigue EN 301 549 sin que la Ley Europea de Accesibilidad obligue a una web
personal. (2) Rendimiento: nuevo `livestat` («RENDIMIENTO · PAGESPEED», fuente `npm run psi`)
enlazando al informe de PageSpeed Insights en vivo — deliberadamente SIN el rótulo «DATO EN
VIVO» que sí llevan Contraste/Piezas del sistema, porque D49 ya estableció que esta cifra se
mide a demanda y nunca es un valor de build. (3) Seguridad: el párrafo de la CSP nombra y
enlaza el HTTP Observatory de Mozilla (B+, 80/100, pierde exactamente los 20 puntos de
`unsafe-inline` en `script-src`) — sustituye la frase anterior, que citaba de memoria «sube la
nota del analizador de A a A+» sin nombrar la herramienta. Esa cifra resultó estar
desactualizada: ver el addendum de D26.

`resolveLiveStatHref` (`como-se-ha-creado.tsx`) gana un tercer caso: además del slug relativo y
el literal `"github"`, ahora pasa tal cual cualquier `href` que empiece por `http`, para el
enlace externo del `livestat` de PageSpeed.

**Escala `LEADING` (`heading.tsx`): `prose`/`lead`/`meta`.** Nace de una auditoría pedida por
Francisco sobre el interlineado del artículo: la mitad de sus elementos de texto llevaba un
valor elegido a mano sin relación entre sí, y la otra mitad no declaraba ninguno, heredando el
`1.5` del preflight de Tailwind por accidente — un valor que nadie había decidido, no una
elección. Verificado en pantalla —clonando el DOM servido a ancho de móvil real— en los dos
casos que sí podían envolver a varias líneas (`RepoStrip`, la celda más larga del índice) antes
de aplicar el valor más apretado (`meta`, 1,3): en ninguno de los dos se lee comprimido. Las
citas (`Pullquote`/`Pull`) se quedan fuera de la escala a propósito: no son cuerpo ni metadato,
es una convención tipográfica distinta, ahora documentada en el propio componente en vez de sin
explicar.

**Probado y descartado: foto de fondo en la banda de apertura.** A petición explícita de
Francisco («probablemente se descarte»), se montaron cuatro variantes —color, color con velo,
blanco y negro, blanco y negro con velo— de un contact sheet de 18 poses como fondo de la banda
invertida. Ninguna se sostuvo: color y B/N sin velo rompían la legibilidad del breadcrumb y la
entradilla (a ojo ya fallaban, sin necesidad de medir contraste); color con velo ocultaba tanto
la foto que dejaba de aportar nada; B/N con velo era la única legible, pero habría sido la
PRIMERA banda invertida del sitio con foto —todas las demás (Brand Kit, Design System,
Accesibilidad) son color plano—, una decisión de sistema y no solo de esta página. Revertido
por completo: el componente, la constante de variante y la imagen de `public/img/` — nada
quedó en el árbol.

## D82 · El design-review de P60 encuentra ocho fallos reales, y dos patrones que se repiten — 2026-08-22

**Contexto.** Primera vez que `/design-review` se dispara sobre una página recién cerrada (P60)
en vez de sobre el sitio agregado: barrido de código (fork) + verificación en pantalla
(`viewport-verifier` + `agent-browser` dirigido) + expresión de marca. Ocho hallazgos
verificados, tareados (60.1-60.8) y resueltos en la misma sesión; dos regresiones más, cazadas
por Francisco viendo la página servida tras el primer arreglo.

**Los ocho hallazgos, en una línea cada uno.** (1) Hover del breadcrumb sobre banda invertida,
1,11:1 — `--chrome-hover-bg` sin override para `[data-surface="inverted"]`. (2) Dos diagramas
nuevos usaban `brand-purple-soft` como relleno informativo, 1,3-1,7:1 en claro — `BRAND.md` ya
prohibía esto; el cian pasa a llevar la información, un borde `stroke-primary` delimita la
forma. (3) `SectionRail` (el TOC flotante): objetivo táctil 24×24, no 44×44. (4) El riel y el
dock de compartir precedían al `h1` en el DOM — `fixed` no implica «antes» visualmente, pero sí
en el orden de tabulación. (5) Ningún `<section id>` con ancla tenía `scroll-margin-top` bajo el
nav sticky. (6) El Design System (§15) publicaba 6 de las 11 piezas de la familia de artículo.
(7) El TOC se escribió a mano fuera de `chrome.tsx` — excepción documentada con fecha, mismo
patrón que el switch de consentimiento. (8) `LiveStat` no abría en pestaña nueva sus enlaces
externos, a diferencia de `RepoStrip`.

**Patrón 1 — Contener un `fixed` dentro de una demo del Design System.** `SectionRail`,
`FloatingShare` y `ReadingProgress` son `fixed` a la VENTANA por diseño, correcto en la página
real. Para demostrarlos en el Design System sin que invadan el resto de la página, el
contenedor de la demo lleva `[transform:translateZ(0)]`: cualquier `transform`/`filter`/
`perspective` en un ancestro crea un *containing block* nuevo para sus descendientes `fixed`,
así que se posicionan relativos AL PANEL, no al viewport. Mismo componente, mismo
comportamiento, contenido.

**Patrón 2 — Un flex item que debe desbordar necesita `shrink-0` explícito.** Al separar el
objetivo táctil (44×44) del aspecto visual del pill de `SectionRail`, el pill pasó a ser flex
item de un nuevo `<a>` flex. `flex-shrink: 1` es el valor por defecto, así que el pill se
encogía a los 44px del padre en cada hover en vez de crecer hasta `max-w-64` —
`overflow: visible` en el padre **no** evita el shrink, que ocurre en el propio cálculo del
layout flex, antes de pintar—. Y por separado: `justify-center` en el padre hace que el
crecimiento empuje hacia los dos lados, así que un elemento que vive cerca de un borde (aquí, el
borde izquierdo de la ventana) se sale de la pantalla por la mitad izquierda del crecimiento —
`justify-start` para que crezca en una sola dirección.

**El footer no se propaga solo.** Su lista de enlaces (`footer.tsx`) es manual, no deriva de
`lib/routes.ts`: P60 no se añadió sola. Insertado a petición de Francisco, con label propio del
footer («El Making of» / «The Making Of») distinto del título real de la página, y primero en
el orden.

**`check:contexto` en rojo por primera vez desde que existe.** La excepción del TOC (patrón 1
de arriba, escrita en `BRAND.md`) empujó el contexto de arranque de 13500 a 13598 palabras. Se
resolvió retirando, no subiendo el techo: la sección más pesada de `BRAND.md` (523 palabras,
«Un control sobre una imagen») repetía en el documento en presente el barrido completo que ya
vive en `BRAND-historical.md` — se dejó la regla y el «qué garantiza y qué no», el resto ya
tenía puntero. 13345 palabras, mismo contenido.

---

## D83 · Una sección que documenta una capa nueva no puede ser una caja con las piezas dentro — 2026-08-22

**Contexto.** P60.9 nació como una tarea de una línea: el espécimen de «Artículo largo»
(Design System §15) mostraba la meta-línea en el formato viejo («Capítulo 05 de 11 · 3 min de
lectura») mientras la página real usaba el corto desde la tanda 3 de P60 («5 de 11 · 3 min»).
Al abrirla, Francisco añadió lo que se ve al mirar la sección: las **trece** piezas de la capa
de artículo estaban dentro de un solo `PANEL`, apiladas, con una única entradilla para todas y
sin explicación por pieza.

**El diagnóstico no era estético, era estructural.** Las otras catorce secciones de la página
tienen una anatomía fija: `SectionHeader` → subapartados con `h3` + entradilla cuando hacen
falta → **rejilla de tarjetas espécimen**, y cada tarjeta es la demo real arriba sobre
`--background` y su ficha abajo sobre `--card` (rótulo · nombre en monoespaciada · qué resuelve
· la letra pequeña tras un filete discontinuo). §15 no seguía ninguna de las dos. Y era **la
sección que menos se lo podía permitir**: las otras catorce documentan cosas que ya se conocen
—botones, etiquetas, tablas—; §15 es la única que documenta una capa que nadie ha visto antes,
así que es justo la que no puede enseñar trece piezas sin decir qué es cada una.

**El eje del corte: dónde vive la pieza, no qué tipo de pieza es.** La partición obvia era
servidor / islas de cliente, y es la mala: describe cómo está construido el código, no lo que
el lector puede comprobar. El eje que sí sirve es **dónde aparece la pieza dentro del
artículo**, porque se verifica abriendo `/como-se-ha-creado` al lado. Cinco subapartados: la
portada del artículo (`ByLine`, `ShareActions`, `ArticleIndex`) · la apertura de cada parada
(`SectionCover`) · lo que flota junto al texto (`Pullquote`, `Pull`, `DiagramPanel`,
`LiveStat`) · el pie de cada parada (`RepoStrip`, `ChapterNav`) · lo que no se va con el scroll
(`ReadingProgress`, `SectionRail`, `FloatingShare`). Las tres últimas comparten una sola demo
—la caja con `translateZ(0)` del patrón 1 de **D82**— y llevan ficha sin espécimen propio:
separarlas en tres cajas serían tres veces la misma caja vacía.

**`SpecimenCard` y `GroupHead` suben a `design-system/shared.tsx`.** La anatomía de la tarjeta
estaba escrita **a mano e idéntica en 08, 09, 10 y 11**, y §15 iba a ser la quinta copia. Su
sitio es ese archivo por lo que dice su propia cabecera: *lo único de esta página que se usa en
más de una sección*. **Las cuatro que la tienen inline NO se migraron aquí, a propósito**: es un
refactor mecánico sobre secciones publicadas y su gate es un `gate:html` con diff vacío (D42),
así que meterlo de rebote habría mezclado un cambio visual intencionado con uno que tiene que
ser invisible. Tareado aparte (bloque Design System, P87.85), con dos diferencias reales que
comprobar antes de unificar —el ancho de rejilla difiere entre 08/09 (19rem) y 10 (15rem), y 11
tiene una tarjeta sin rótulo—: es la regla 4 de `BRAND.md` §Cómo se escribe una regla aquí,
mirar si dos valores parecidos significan cosas distintas antes de unificarlos.

**`SectionCover` gana `level`.** En la página real su titular *es* el `h2` que abre una
sección; anidado bajo el `h2` de §15 y el `h3` de su subapartado tiene que ser `h4`. Defecto
`2`, así que la página real no cambia ni un byte de HTML. Mismo criterio que
`SectionHeader.level` (D43): la semántica del DOM no la decide cuánto mide el texto.

**Tres fallos más que solo aparecieron EN PANTALLA, y solo ya con la estructura nueva.** Es la
parte que conviene no olvidar, porque los tres estaban en el código anterior y ninguna lectura
del JSX los había encontrado. (1) El espécimen de `RepoStrip` pegaba el texto al enlace sin
espacio («…y D73DECISIONS.md»): el espaciado de esa franja vive **dentro de los strings** de
`parts` —así lo escribe la página real— y el demo no lo llevaba. (2) La ficha de `ArticleIndex`
se rotulaba «ÍNDICE» justo debajo de un demo que ya dice «ÍNDICE» en su eyebrow. (3) `RepoStrip`
y `ChapterNav` abren las dos con `border-t` y `mt-[2.5rem]`, así que sueltas dentro de una caja
se leían como un filete huérfano flotando sobre un hueco vacío; con la última línea del cuerpo
encima, ese mismo hueco es lo que el margen significa. **Una pieza de PIE se demuestra con algo
delante**, o su propio margen parece un error de maquetación.

## D84 · El artículo describe un proyecto que se mueve, y nadie le avisaba — 2026-08-22

**Contexto.** «Cómo se ha creado esta página» (P60) cuenta el estado del proyecto: la marca, el
stack, las cabeceras servidas, las cifras de CI, por qué no hay formulario de contacto. Todo eso
sigue cambiando. La pregunta que abrió la sesión era de método —¿revisión antes de subir, skill
propio, bloque de `sprint-review`?— y la respuesta salió de mirar primero **si el artículo ya
había derivado**. Había derivado dos veces.

**Hallazgo 1: 27 de 38 permalinks apuntaban al párrafo equivocado.** Cada sección cierra con la
franja `ENLACE ·`, y cada decisión citada era un permalink a la línea exacta de su cabecera:
`{ "label": "D29", "path": "DECISIONS.md", "line": 844 }`. Esa línea estaba **escrita a mano en
el diccionario**, o sea una segunda verdad sobre un hecho que ya vive aquí — la familia de D38 y
D60. El commit `b1fd354` insertó diez líneas dentro de D26 (`@@ -747,6 +747,16 @@`, el addendum
que retiraba la cifra A+ de securityheaders) y con eso las 24 decisiones de D27 en adelante
pasaron a apuntar diez líneas arriba. **Nada se rompió**: el enlace sigue abriendo el archivo, en
otro sitio. Ningún check podía verlo porque no había nada que comparar.

**Hallazgo 2: una cifra contable ya era falsa.** «AAA en las doce páginas», cuando son trece por
idioma desde que existe el propio artículo — que es la decimotercera y llegó un día después de
`LAST_A11Y_REVIEW`.

**El diagnóstico, que es lo que decide la forma de la solución.** No es un problema, son tres
clases, y solo una necesita criterio:

| Clase | Ejemplo | Quién puede detectarla |
|---|---|---|
| **A · Cita rota** | los 38 `#L…` | una máquina, trivialmente |
| **B · Cifra desfasada** | «doce páginas», «quince pasos», «siete piezas» | una máquina, si sabe de dónde sale la cifra |
| **C · Afirmación que se vuelve falsa** | «No hay formulario de contacto», «B+, 80 sobre 100» | solo una persona leyendo el diff |

Meter las tres en el mismo mecanismo era el error. **A no necesita revisión: necesita dejar de
ser una segunda copia.**

**Qué se descartó, y por qué.** Un **bloque en `sprint-review`** dispara al cerrar etapa, así que
el artículo pasaría semanas mintiendo en producción y las citas de clase A se rompen entre
commits, no entre sprints — es el fallo de disparador que nombra `BRAND.md` §Cómo se escribe una
regla, «una condición que se comprueba en el momento equivocado no es una regla». Una **revisión
genérica antes de subir** no tiene señal de qué mirar: releería 63 KB de prosa cada deploy y se
saltaría a la tercera vez. Un **skill manual** depende de acordarse, que es el modo de fallo
contra el que van las otras 83 entradas de este archivo.

**Capa 1 — la línea se deriva, no se guarda.** `lib/decisions.ts` indexa las cabeceras `## D<n>`
y `components/site/como-se-ha-creado.tsx` inyecta el ancla al pasar las `parts` a `RepoStrip`.
`components/ui/article.tsx` no se entera: sigue recibiendo un `line` opcional y sin saber nada de
este sitio (D36). Los 38 `line` salen de los dos diccionarios. Verificado sobre el HTML
prerenderizado: **38 de 38 correctas en ES y en EN**, donde antes 27 estaban mal. La clase A
desaparece en vez de quedar vigilada.

**Capa 2 — `check:articulo`, un sello por sección.** Cada una de las once declara de qué depende
en `content/articulo/dependencias.ts` (no es copy, así que no va al diccionario, D44), y el sello
guarda el hash de esas fuentes. Cuando una se mueve, CI sale rojo **nombrando la sección**, en el
PR que la mueve. No dice que el texto sea falso: dice que hay que mirarlo, y ofrece las dos
salidas —`npm run articulo:sellar` si sigue siendo cierto, corregir ES y EN si no—.

**La granularidad es la decisión de diseño, no un detalle.** `DECISIONS.md` cambia en casi cada
sesión: hashearlo entero daría rojo siempre y a la tercera nadie lo leería. Por eso se depende de
la **entrada** (`DECISIONS.md#D26`) y de la **sección** de un `.md`, y de un directorio se hashea
la **lista de archivos**, no su contenido — lo que el artículo afirma de `components/ui/` es
cuántas piezas hay. Comprobado en las dos direcciones: añadir un D84 al final es verde; tocar D26
enciende la §07, y tocar `PRD-Live.md#7` enciende la §01 y la §11, que son exactamente las tres
secciones que van a invalidar la CSP estricta (P64.5) y Contacto ampliada.

**`--seal` vive dentro del mismo script**, no aparte: las tres comprobaciones previas —las citas
resuelven, ninguna guarda su línea, toda sección declara dependencias— son **precondición** de
sellar. Sellar sobre una declaración rota congelaría el fallo. Mismo acoplamiento que
`npm run artefacto`.

**Y el guardián falsificó el artículo al nacer.** Entrar en CI convierte los «quince pasos» de la
§09 en dieciséis, así que el primer rojo de `check:articulo` lo provocó su propio paso de CI. Se
actualizaron la §09 (diagrama, `ariaLabel` y pie, ES y EN) y las tres copias vivas de la cifra
(`PRD-Live.md`, `CLAUDE.md`, `README.md`); las de este archivo no, porque fechan lo que era
cierto entonces.

**Lo que NO cubre, dicho para que no se dé por cubierto.** Que el párrafo diga la verdad: detecta
que la fuente se movió, no que la prosa se haya vuelto falsa. Y `package.json` queda fuera a
propósito —el artículo nombra «Next 16» y «Tailwind v4», pero Dependabot toca ese archivo cada
semana y meterlo convertiría el guardián en ruido, que es peor que no tenerlo—.

**Capa 3, tareada y no construida** (P68.5): el skill que, disparado por un rojo de la capa 2,
lee el diff de la dependencia y propone el texto ES y EN. Se diseña después de cerrar «Footer y
contacto», cuando haya dos o tres casos reales delante en vez de un caso imaginado.

**Y una decisión de contenido que queda abierta.** El artículo mezcla dos tiempos verbales y no
los distingue: «No hay formulario de contacto» es **estado** y caduca; «Me quedé con el enlace»
es **decisión fechada** y no caduca nunca. Es la partición que ya tienen `PRD-Live`/
`PRD-Historical` y `BRAND`/`BRAND-historical`, y el artículo es el único documento del proyecto
sin ella. Si se hace explícita, la clase C encoge mucho: un formulario no falsificaría la §01, la
continuaría. Francisco decide al escribir el primer caso real, no antes.

## D85 · La pasada de contraste deja de hacerse a mano, y el medidor tenía un falso positivo — 2026-08-22

**Contexto.** Al cerrar D84 salió el primer hallazgo del mecanismo nuevo: el sitio publicaba «AAA
en las doce páginas» teniendo trece. Francisco lo zanjó en una línea —«asegurémonos de que todas
las páginas están en AAA, eso no lo debemos perder nunca»—, y ese *nunca* es lo que decide la
forma de la respuesta: no bastaba con medir y corregir la cifra.

**Por qué se perdió, que no fue descuido.** La pasada completa se conducía **a mano**, llamada a
llamada del navegador, y por eso se había hecho entera dos veces. Entre una y otra el sitio ganó
una página —el propio artículo, publicado un día después de `LAST_A11Y_REVIEW`— y nada lo notó.
Un procedimiento que solo existe como hábito no cubre lo que se añade después de la última vez
que alguien se acordó.

**`npm run censo`.** El recorrido pasa a ser un comando: lee las páginas de `PAGE_SLUGS` (D72),
las abre servidas × los dos temas, inyecta `contrast-census.js` y falla si aparece un par bajo
AAA. **La lista no se escribe en el script**, así que una página nueva entra en el censo por el
mismo mecanismo que ya la mete en el sitemap, en `gate:html` y en `/llms.txt`.

Con guarda de cero en las tres dimensiones que ya han fallado en silencio aquí: el **metro**
contra los anclajes sin cian (13,79 / 15,32, exactos), las **reglas `:hover` indexadas** (cero es
el fallo que el censo tuvo dos veces, y su síntoma era un aprobado) y el **tema pintado** contra
el que se pidió — un `set media` que no llega mediría la misma página dos veces y lo llamaría
cobertura.

**Fuera de CI, como `psi` (D49)**, y por el mismo motivo: necesita navegador y servidor. La mitad
de los pares de este sitio no existen hasta que el navegador **compone** un `color-mix`.

**Resultado: 26 corridas, 380 pares, metro validado en las 26, cero bajo AA y cero bajo AAA.**

**Y midiendo apareció un falso positivo del medidor.** `overImage()` decidía «texto sobre foto»
por **solape de rectángulos contra cualquier `<img>`/`<video>` del documento**, sin mirar el
apilamiento. El diálogo de consentimiento es `fixed`, cae encima de la foto del hero y pinta su
propio `bg-card` **opaco**: salía marcado «sin medir» en tres páginas. Con eso, **22 de los 26
pares que el censo mandaba revisar a ojo no tenían ninguna imagen debajo** — y una lista de
revisión manual inflada con falsos positivos es una lista que nadie lee, que es la misma forma de
fallo que el resto de ese archivo combate.

La pregunta correcta es si hay una imagen pintada **entre el texto y el primer fondo opaco de su
cadena**: en cuanto un ancestro pinta opaco, lo de detrás no se ve. Ahora el recorrido busca media
**dentro de cada ancestro** y el fondo opaco devuelve `false` en vez de romper el bucle y seguir
preguntando. Validado en las dos direcciones, que es lo que exige tocar un metro: el titular de
Sobre mí **sigue** marcado (verdadero positivo, la foto es un hermano posicionado) y el diálogo
**deja** de estarlo. `sinMedir` baja de 26 a 4 y los pares medidos suben de 376 a 380.

**Los cuatro que quedan sí son texto sobre la foto**, y se miden aparte porque ninguna herramienta
compone una fotografía: se toma el píxel pintado bajo la caja del texto, con el texto oculto, y se
puntúa el **peor** de todos. Titular (38,4px, grande, umbral 4,5): **7,23**. Entradilla (19,2px,
normal, umbral 7): **11,02**. Repetido a 1440, 768 y 390 de ancho, por si el texto sube a la zona
donde el degradado se debilita: el peor de las tres anchuras es **7,23**. AAA con holgura.

**Y la cifra de páginas deja de escribirse.** `PAGE_COUNT` sale de `PAGE_SLUGS` y `fillPages()`
sustituye `{paginas}` en el copy, con el cardinal en palabras para no romper la voz del sitio
—mismo mecanismo que `fillDate` y `fillRatios` (D38)—. Lo usaban dos páginas, el artículo y el
Design System, en los dos idiomas. De paso caen las otras seis copias de «doce» que ya eran falsas
—`lib/routes.ts`, `check-marco.ts`, `page-html-diff.ts`, `related-pages.tsx`, `PRD-Live.md` y
`README.md`—, con el código contando veintiséis variantes mientras los comentarios decían
veinticuatro.

**Lo que sigue sin cubrir, dicho para que no se dé por cubierto.** Lo que hay detrás de una
interacción —pestañas sin abrir, diálogos sin invocar— no está en el DOM cuando el censo mira. Y
el censo mide **colores**, que no dependen del ancho; el pliegue y el objetivo táctil siguen
siendo de `viewport-verifier` (D52).

## D86 · El informe de qlty baja al repo, y de sus hallazgos dos eran míos — 2026-08-22

**El hueco.** `qlty check` aparece en el PR como **commit status**, no como check run, así que su
salida no está en la API de GitHub: solo el texto «N blocking issues» y un enlace que pide login.
Sin comentario de PR ni anotaciones. Se podía ver **el número y no la causa** — y el número subió
6 → 7 → 9 en tres tandas, todas de código propio.

Es la misma crítica que ya está escrita en la cabecera de `.qlty/qlty.toml`: la configuración
*«vivía únicamente en la web de Qlty, que es una segunda fuente de verdad fuera del control de
versiones»*. La config se bajó al repo el 2026-08-19; el informe se quedó arriba. **Una métrica que
no se puede leer donde se trabaja no informa: solo puntúa.**

**Se instala el CLI** (`qlty.sh/install.ps1`, v0.642 en `~/.qlty/bin`). `qlty smells --upstream main`
reproduce en local exactamente lo que cuenta el PR, y con eso el hallazgo deja de ser una cifra.

**Qué había, separando lo de hoy de lo que ya venía de P60:**

| Hallazgo | Origen | Qué se hizo |
|---|---|---|
| `articulo/huella.ts:114` — anidamiento nivel 5 | D84 | **Arreglado.** Un ternario doble dentro de dos bucles pasa a `porQueNoResuelve()`. Además se lee mejor: la frase va a informe |
| `contrast-census.js` — `overImage` complejidad 22 | D85 | **Arreglado.** El solape y el barrido de media salen a `solapan()` y `tapaMedia()` |
| `check-articulo.ts` — complejidad total 61 | D84 | **Se queda**, y es una decisión, no una omisión |
| `contrast-census.js` — `contrastCensus` 110 / 26 returns | anterior | **Se queda**, ya estaba decidido |
| og/route, diagramas ×4, `article-islands`, `article.tsx`, `check-marco` | P60 | No son de esta sesión |

**Por qué `check:articulo` se queda en 61.** Sus tres hermanos miden 81 (`check:marco`), 68
(`check:experiencias`) y 62 (`check:palette`): **61 es la forma normal de un guardián en este repo,
y la más baja de las cuatro.** Un guardián es un script lineal de comprobaciones independientes;
partirlo por bajar un número lo haría más difícil de leer, que es lo contrario de lo que la métrica
persigue. Si algún día molesta, se arreglan los cuatro con el mismo criterio o ninguno.

**Y `contrast-census.js` tampoco se excluye**, porque su propia config ya lo dejó dicho: *«su peor
archivo es justo el que se ha roto dos veces en silencio. Eso NO se silencia aquí — se arregla, y lo
cubre `npm run check:guardianes`»*. Es un cierre de 500 líneas **por necesidad**: se inyecta en la
página y define `window.contrastCensus`, así que no puede importar nada. Partirlo rompería la razón
por la que existe.

**Tocar el medidor obliga a revalidarlo, y se hizo.** El refactor de `overImage` es mecánico, pero
mecánico no es transparente hasta que se mide: mismos tres casos en los dos temas —el titular de
Sobre mí sigue marcado, el diálogo de consentimiento sigue sin estarlo— y la pasada completa vuelve
a dar **26 corridas, 380 pares, cero bajo AA y cero bajo AAA**, idéntica a la de antes.

**Y lo destapó el guardián de D84**: tocar `contrast-census.js` puso la §08 en rojo, que es la
sección del artículo que habla del censo. Primera vez que el mecanismo salta por un cambio que no
lo buscaba.

**Lo que queda abierto.** El CLI cierra la lectura para quien tenga el repo delante, no para el PR:
el detalle sigue sin llegar a GitHub. Si algún día molesta, la salida es que la App de qlty comente
en el PR, no volver a mirar el panel.

## D87 · Google no cruza de página, y por eso una referencia `@id` no basta en un tipo elegible — 2026-08-22

**El síntoma.** La Rich Results Test sobre «Cómo se ha creado esta página», en producción y en los
dos idiomas: **sin errores** —la elegibilidad nunca estuvo en riesgo— y **siete avisos**. Salían de
tres huecos, los tres en `techArticleLd`, y el primero es el que enseña algo.

**Uno · `author` llegaba como un `Thing` anónimo.** El JSON-LD referencia al `Person` por `@id` en
vez de repetirlo, que es lo correcto y lo que permite a Google unir las trece páginas en una sola
entidad (D14). Pero **la RRT evalúa una página aislada**: ve un identificador que esa página no
declara, no va a buscarlo a la home y lo degrada.

Lo interesante es que **`npm run check:marco` daba verde sobre exactamente lo mismo**, y no está
mal: resuelve los `@id` **contra todo el sitio**, que es la única comprobación de este repo que
ningún validador externo hace (D75). Los dos metros son correctos y miden cosas distintas. Es el
patrón de D84 y D86 otra vez, y ya van tres: **un verificador propio y uno externo con modelos
distintos, y la afirmación publicada apoyada solo en el nuestro.** La lección no es desconfiar del
propio, es saber de qué no habla.

**La salida no es repetir el `Person`.** Esa copia se evitó a propósito y el argumento sigue en pie:
sería la sexta de los mismos datos en un sitio que acaba de retirar tres (D57/D58). Se le dan a
`author` los dos campos que Google necesita para pintarlo —`name` y `url`, con `@type: Person`—
**junto** al `@id`, que sigue haciendo su trabajo. Dos campos, no una entidad.

Y solo ahí: `experiencePageLd` usa la misma referencia pelada y **se queda como está**, porque
`WebPage` no es elegible para rich results y allí no cuesta nada.

**Dos · las fechas eran cuatro avisos y un solo hueco.** Google avisa **dos veces por fecha**
—«el valor de fecha y hora no es válido» y «falta la zona horaria»— cuando le llega solo el día.
La hora **se compone al emitir el JSON-LD y no se guarda** en `lib/design-values.ts`: la misma
constante alimenta el copy que lee una persona, formateado con `Intl`, y ahí una hora inventada se
vería. Y **el desfase se deriva de `Europe/Madrid`, no se escribe**: `+02:00` es correcto en agosto
y falso en enero, así que un literal habría dejado la primera fecha de invierno mal por una hora sin
que nadie lo mirara. Comprobado en las dos estaciones.

**Tres · faltaba `image`**, que es la miniatura del resultado. Es la tarjeta OG que la página ya
genera, no un asset nuevo — y al extraerla a `ogImagePath` deja de estar escrita dos veces, una en
la metadata y otra aquí (D66).

**Resultado, medido contra producción tras el merge:** ES y EN, dos elementos válidos cada una y
**cero avisos**. En Preview no se puede comprobar —sirve `noindex` y la RRT respeta robots—, y la
RRT pide sesión de Google, así que se conduce con `claude-in-chrome` y no con `agent-browser`. Es
justo el caso para el que `claude-in-chrome` no se retiró.

**Lo que quedaba abierto se cerró el 2026-08-30 (P66), y no por donde parecía.** La salida
evidente era enseñarle a `check:marco` qué tipos son elegibles para rich results —`Article` y
familia, `Product`, `FAQPage`…— y avisar cuando uno de ellos referencia fuera de su página. Se
descartó: es **otra lista que se queda vieja**, mantenida a mano contra un catálogo que decide
Google, y este repo ya tiene medida la vida útil de una lista escrita a mano.

Lo que entró es una invariante **posicional**, que no necesita saber de tipos: *toda referencia
cuyo `@id` no se declara en su PROPIA página lleva `name` y `url`, salvo lo declarado en
`REFERENCIAS_QUE_CRUZAN` con su motivo*. Es el patrón de `check:og` (D142), y como allí se mide
**en las dos direcciones**: una excepción declarada que ya no ocurre también sale roja, porque
una lista cuya razón de ser es vaciarse acumula entradas muertas que tapan el caso siguiente.

Hoy son **cinco cruces declarados** y los cinco comparten motivo: tres en las páginas del
deep-dive (`isPartOf`, `author`, `mainEntity`, que son `WebPage`) y dos en `/contacto`
(`isPartOf`, `mainEntity`, que es `ContactPage`). Ninguno de los dos tipos es elegible, así que
ningún validador externo evalúa esas páginas aisladas.

**Y lo que NO mira, escrito para no prometer de más:** si el tipo es elegible. Una referencia
declarada aquí en un tipo que MAÑANA pase a serlo seguiría en verde. Es el precio exacto de no
mantener el catálogo, y se paga a sabiendas — por eso el motivo de cada entrada **nombra su
tipo**: el día que cambie, lo que hay que releer está escrito al lado.

**La regla no sustituyó al guardián, y esa era la tercera opción.** El porqué ya estaba escrito
largo en `lib/structured-data.ts` y aun así el hueco existió: una regla que hay que recordar es
una regla que se incumple (`BRAND.md` §Cómo se escribe una regla, 2). El texto se queda donde
está —es donde se lee al escribir el JSON-LD— y ahora hay algo que lo comprueba.

## D88 · El único índice que se precargaba baja a su cabecera, y era el único que crecía solo — 2026-08-22

**Decisión.** El índice de este archivo deja de vivir dentro de `CLAUDE.md` y pasa a la
**cabecera de `DECISIONS.md`**, que es donde ya vivían los de `PRD-Historical.md` y
`BRAND-historical.md` (D69). En `CLAUDE.md` queda el puntero y la instrucción de lectura:
un `Read` limitado a las primeras ~130 líneas. El generador y su guardián no cambian de
método, solo de destino, y de paso dejan de tener dos caminos: un único bloque
`ÍNDICE`/`FIN ÍNDICE` y una sola función de escritura para los tres.

**El número.** El contexto de arranque iba de 4.120 palabras el 30 de julio a **13.470 el
22 de agosto**, con el techo en 13.500: **30 palabras de margen**, +227 % en 23 días.

**Por qué no valía retirar, que es la operación que D69 añadió.** Se probó: el
method-review del 19 de agosto recortó 437 palabras. En tres días volvieron 386, y no por
indisciplina — fue un sprint normal. Retirar compra tiempo contra lo que se escribe de más;
no contra lo que crece por construcción.

**Por qué no valía subir el techo.** El índice pesaba **1.296 palabras** —el 22 % de
`CLAUDE.md` y el **9,6 % del presupuesto entero**— y crecía a 2,8 decisiones al día, unas
42 palabras diarias. Cada línea estaba legítimamente ahí. **No era deuda: era masa**, y un
trinquete no defiende de la masa; solo obliga a recortar en otro sitio lo que esta añade.

**El argumento que se retira.** Lo que puso el índice en contexto fue que *«se lo gana:
buena parte de sus entradas se citan desde el código»*. Eso justifica **tener** el índice
—y sigue siendo cierto—, pero no justifica **precargarlo** en cada arranque de cada sesión,
incluidas las que no tocan ninguna decisión.

**Resultado, medido:** 13.494 → **12.224**, de 1.494 palabras por encima del objetivo de
12.000 a 224. El techo baja de 13.500 a 12.500, que es lo que D69 manda hacer con él.

## D89 · El inventario de `components/ui/` se deriva del disco, y una pieza nueva sin publicar sale en rojo — 2026-08-22

**El hueco.** El paso 1 de la «Regla de construcción» de `CLAUDE.md` es «¿existe ya la
pieza?», y se contesta leyendo una lista. Esa lista estaba escrita a mano en **cinco sitios y
ninguno acertaba**:

| Dónde | Qué decía |
|---|---|
| `design-review/SKILL.md` (×2) | «las **cinco** capas de `components/ui/`» … sobre una tabla de **seis** filas |
| `PRD-Live.md` §5 | «Capa de componentes — **siete** piezas» |
| `README.md` | «capa de componentes propia, en **siete** piezas» |
| `CLAUDE.md`, cascada paso 1 | nombraba **diez** |
| `ls components/ui/` | **quince** |

Dos piezas no salían en **ningún** inventario: `page-closer.tsx` (el cierre de las trece
páginas, que D61 usa como caso de medición) y `video-embed.tsx` (la facade de vídeo de D55).
Es la regla 1 de `BRAND.md` —un disparador que mira al lugar equivocado— aplicada justo a la
regla que gobierna todo lo que se construye: se manda mirar una lista, y la lista no es el
sitio donde están las piezas.

Y la deriva **crecía sola**: el 19 de agosto había trece archivos, el 22 quince (el sprint 2
añadió `article.tsx` y `article-islands.tsx`) y las cinco menciones seguían diciendo lo mismo.

**Las tres cifras no se unifican, porque no eran la misma mal contada.** Es la regla 4 de
`BRAND.md`: antes de juntar dos valores que se parecen, mirar si significan cosas distintas.
Siete es el **núcleo** del sistema; dos son la **capa de artículo largo**, que D76 dejó fuera
del núcleo a propósito; el resto son **primitivas**. Lo que faltaba no era un número común: era
el **nombre de cada grupo** y que el recuento saliera del disco.

**Decisión.** Cada archivo declara su propia línea, en su primera línea:

```
// @pieza <grupo> · <publicación> · <una frase>
```

`npm run indices` deriva de ahí `components/ui/README.md` —el cuarto índice, y el único que
indexa una carpeta en vez de prosa— y `npm run check:indices` lo comprueba en cada PR. Las
cinco menciones **citan ese README en vez de repetirlo**; en `CLAUDE.md` y en `PRD-Live.md` eso
además devuelve 61 palabras al presupuesto de contexto.

**Y la parte que no es un índice: la publicación se comprueba de verdad.** Que una pieza diga
publicarse en una sección no prueba nada, así que el check abre la sección declarada y exige
que **importe la pieza** — el Design System y el Brand Kit enseñan las piezas reales como demo
(§«Tres cosas que el sitio hace y no se ven mirándolo»), y una sección que describe una pieza
sin usarla puede divergir sin que nadie se entere. La resolución baja **un nivel de
indirección**, porque el Brand Kit enseña el logo real pero lo importa a través de
`brand-kit/shared.tsx`: sin eso, un falso «esa sección no publica esa pieza».

**Las cinco sin publicar quedan en una lista con motivo** (`SIN_PUBLICAR`), no en el silencio.
Una pieza que declare `pendiente` sin estar en ella **falla**, así que un archivo nuevo obliga
a decidir: se publica, o se escribe por qué no y eso queda en el diff. El check imprime cuántas
son y cuáles, cada vez.

**La deuda que esto destapó, y que es la razón de que la lista no esté vacía:**
`stat-row.tsx` es del **núcleo**, nació en P54.3 el 2026-08-19 y **nunca se publicó** en el
Design System, pese a que la «Regla de construcción» manda publicarlo antes de dar la tarea por
hecha. Llevaba tres días siendo una de las siete piezas del sistema sin sección propia y no lo
vio nadie, porque no había quién lo mirara. Ahora lo mira CI y sale por su nombre en cada PR.

## D90 · Lo que el censo midió se sella, y CI puede ponerse en rojo sin abrir un navegador — 2026-08-22

**El hueco, que es el más caro de «la regla sin portador».** La Definition of Done dice que la
accesibilidad heredada **solo se vuelve a medir** si el trabajo introduce (a) un par de color
nuevo, (b) un fondo que no sea `--background` o (c) una animación propia. La regla es correcta.
El problema es que **leerla es trabajo humano**: «Cómo se ha creado esta página» cumplió **las
tres ramas a la vez** y no la leyó nadie. Resultado medido: **cuatro de los ocho hallazgos** del
`design-review` de P60 tenían su regla escrita *antes de empezar* — el hover del breadcrumb a
1,11:1 (la rama del fondo), el morado como relleno informativo, el riel a 24px y el índice
fuera de `chrome.tsx`. Es la regla 2 de `BRAND.md` cobrándose la pieza más cara.

**Las dos salidas obvias no valen.** *Fallar el PR* no puede: el censo necesita navegador y
servidor, y por eso está fuera de CI (D85); un gate que no puede correr no puede bloquear. Y
*avisar* tampoco: esto nació **precisamente** de que nadie leyó una condición, así que un aviso
más es la misma trampa con otro nombre.

**La tercera vía, que este repo ya usa dos veces: se sella lo que ENTRA** (D60 con el CV, D84
con el artículo). **Medir necesita pintar; saber que hay que medir, no.** `npm run censo`, al
terminar en verde, escribe `scripts/censo/censo.huella` con el hash de lo que había cuando
midió, y `npm run check:palette` lo compara en cada PR. Si aparece un token de color, una
superficie o una animación que el censo no vio, **CI se pone rojo y lo nombra**.

**Qué se sella son exactamente las tres ramas de la condición:**

| Rama de la DoD | Qué entra en el hash |
|---|---|
| Un par de color nuevo | los `--x: valor` **de color** de `:root` y `.dark` (un radio nuevo no manda a medir contraste) |
| Un fondo que no sea `--background` | los valores de `data-surface` usados en el código **y** los selectores que redefinen `--surface-dim` |
| Una animación propia | los `@keyframes` declarados |

Los selectores de `--surface-dim` entran porque son los que hacen que una superficie **exista
para la capa** (D39), y porque incluyen los de **estado** (D61) — que es justo la puerta por la
que se coló el caso de P60: `hover:bg-muted` no compila al mismo selector que `.bg-muted`.

**Por qué vive dentro de `check:palette` y no en un paso propio.** La pregunta que hace es de
paleta —qué colores y qué superficies hay—, y un paso diecisiete movería la cifra de pasos de
CI que publican el artículo, el PRD y el README por un control que cabe donde ya se miran los
colores. El guardián estrena su caso malo: un `@keyframes` de mentira en `globals.css` tiene
que ponerlo en rojo.

**Lo que NO promete, dicho para que no se dé por cubierto.** No dice que el sitio cumpla: dice
que **lo que el censo midió sigue siendo lo que hay**. Un bloque que se pinta su propia
superficie sin declarar `data-surface` no aparece en el hash — pero ese caso ya lo prohíbe
`BRAND.md`, y lo que este sello añade es que saltárselo tenga consecuencias visibles en el PR
siguiente en vez de dentro de dos sprints.

---

## D91 · Un backlog transversal no lo drena ningún sprint, y el carril de contenido se barría con el resto — 2026-08-22

**Contexto.** Cuarto disparo de `method-review`, en el hueco entre Método II y «Footer y
contacto». El aviso lo trajo Francisco desde el tiempo invertido —«no podemos dedicar más
tiempo a arreglar que a crear»— y el barrido lo confirmó desde los contadores del tablero, sin
haber leído su nota. **Segunda vez que las dos direcciones convergen y segunda vez que ese es
el hallazgo de más confianza.**

**Lo medido.** Del ciclo del sprint 2 —*Método* (17 tareas) + *Cómo se ha creado* (24) +
*Método II* (7)— **la mitad exacta fue andamiaje**. `DECISIONS.md` pasó de 23.910 a 58.681
palabras (+145%) mientras el sitio pasaba de doce a trece páginas (+8%); de 156 commits desde
el 12-08, 38 son de valor (`feat`/`content`/`copy`) y 98 de `docs`/`fix`. Y `General` acumula
**28 tareas abiertas con 1 archivada en toda su vida**, 16 de ellas creadas en cuatro días por
las revisiones.

**La causa, que no es falta de disciplina.** La regla de movimiento del tablero —«una tarea de
deuda nace en su bloque y cambia de `Etapa` al sprint cuando se compromete, porque desbloquea
algo de ese sprint o porque toca los mismos archivos»— **funciona para bloques de página y no
puede funcionar para `General`**, que es transversal por definición: ningún sprint de página lo
toca nunca. No tiene tirador. Por eso su único desagüe histórico ha sido inventar un sprint de
método, dos veces, con un coste igual al de construir la página que lo generó.

Esto **corrige el diagnóstico del segundo disparo**, que midió el mismo eje, revisó las tareas
una a una y concluyó que no estaba degenerando: que 17 de 20 eran genuinamente transversales y
lo que faltaba era escribir el criterio. El criterio se escribió y el cubo pasó de 20 a 28.
**Clasificar bien una tarea no la mueve.** Lo que hay que medir de un bloque no es su
composición sino su **drenaje**.

**Decisión 1 — `General` se drena por CUPO.** Cada sprint arrastra 3-4 tareas de `General`
—las que no piden criterio, por `Prioridad`— dentro del propio sprint, y **una revisión no
cierra dejando en `General` más tareas nuevas de las que ese cupo va a sacar**. Si las deja, la
revisión no ha terminado: falta decidir qué se retira. Es la operación «retirar» de D69
aplicada al tablero en vez de a los documentos.

Y en la salida de `method-review`, **un sprint de método propio pasa a ser el último recurso**:
primero la regla o la edición de documento, que se hace en la misma sesión; luego el arreglo
con código, al sprint que ya toca esos archivos; y solo lo que no encaje en ninguna de las dos
cae en `General`, dentro del cupo.

**Decisión 2 — el barrido de cierre no toca el carril de contenido.** `CLAUDE.md` declara dos
carriles: el build avanza una etapa cada vez y el contenido que solo escribe Francisco corre
por delante para desbloquear las secciones futuras. Estaba declarado y **no se había disparado
nunca**: el tablero tenía cero tareas en `To-Do` y la definición de Contacto ampliada llevaba
doce días en `Sin empezar` con su sprint a punto de abrir.

La causa es mecánica y estaba **dentro del mismo documento**: la regla de columnas dice que
`To-Do` está reservado al sprint activo «sin excepción», y veinte líneas más abajo la sección
de carriles crea justo esa excepción. Al cerrar un sprint ganó la regla absoluta y el carril se
barrió con el resto. El sprint 3 iba a abrir bloqueado por su propia premisa.

Arreglado en las tres puertas por las que pasa: `CLAUDE.md` (el barrido excluye el carril),
`sprint-review` (el archivado tampoco lo toca) y `method-review` (**antes de dar por abierto un
sprint, se comprueba que su tarea de contenido no siga sin empezar**) — el hueco entre sprints
es el último momento en que esa comprobación llega a tiempo, que es el mismo argumento de D50.

**Los dos umbrales, para que el aviso no dependa de la memoria.** Al cerrar «Footer y
contacto»: hallazgos del `design-review` cuya regla ya estaba escrita antes de empezar —hoy
**4 de 8** (D82), verde ≤1, rojo ≥3— y proporción de tareas de método sobre el ciclo —hoy
**50%**, verde ≤25%—. El primero es el que decide: Método II construyó portadores
(`check:indices`, el sello de `check:palette`, la plantilla de publicación, `check:marco`), y
si funcionan el sprint 3 tiene que salir con menos hallazgos. Si sale con los mismos, el
problema no era la falta de portadores y toca replantear cómo se revisa.

**Lo que NO se hizo, y es la parte que importa.** No se abrió un «Método III». Habría sido la
respuesta equivocada a un informe sobre sprints de método: de los cinco hallazgos, tres son
ediciones de regla hechas en el acto, uno entra en el sprint que ya toca ese archivo y solo el
último cae en `General`, con el cupo encima. Y las 191 palabras que las reglas nuevas añadieron
al contexto de arranque se compensaron **retirando 174 de duplicación** —entre ellas una que
`CLAUDE.md` y `BRAND.md` decían casi palabra por palabra, pagándola dos veces en cada arranque.

---

## D92 · Quién cierra los PR de Dependabot, y por qué la allowlist no son «las de desarrollo» — 2026-08-22

**Decisión.** Automerge **acotado** para los bumps de Dependabot: `.github/workflows/dependabot-automerge.yml`
lee los metadatos del PR y, si el bump no puede cambiar lo que el sitio sirve, activa
`gh pr merge --auto --squash`. El resto recibe la etiqueta `revisar a mano` y **un comentario
que dice exactamente qué le falta**. Primera tarea del cupo de `General` que estrena D91.

**El problema era la mitad que faltaba.** El `cooldown` de `dependabot.yml` (D68) controla
cuántos PR se abren y cuándo; nada controlaba quién los cierra. Con `semver-patch-days: 0` la
cola se repone cada lunes, así que el estado estable era cuatro PR abiertos con los dieciséis
checks en verde — que es como estuvieron tres días. Familia «arreglar la mitad que se abre».

**Por qué el criterio es «¿puede cambiar lo que el sitio sirve?» y no la severidad del bump.**
Porque es lo que **CI no puede ver**. Los dieciséis pasos compilan, tipan y validan
estructura, pero ninguno abre la página pintada: `gate:html` está fuera de CI a propósito
(D42/D45) porque necesita el sitio servido. Un cambio de comportamiento en el render pasaría
el gate entero. Es el mismo argumento con el que se escribió el `cooldown`, aplicado a la otra
mitad.

**La regla obvia era falsa, y ahí está lo que merece recordarse.** «Las `devDependencies` son
seguras» parece evidente y en este repo no lo es: **`tailwindcss` y `@tailwindcss/postcss` son
`devDependencies` y generan la hoja de estilos que se sirve**. Se descubrió comprobando el
`package.json` en vez de darlo por hecho, después de haber presentado esa regla como la opción
recomendada.

Y la corrección no fue añadir dos excepciones: fue **cambiar la forma de la lista**. Una
denylist falla **abierta** —una dependencia nueva que llegue al build no estaría en ella y se
mergearía sola—, así que la lista dice qué **sí**, y lo desconocido espera. Mismo criterio que
la CSP en allowlist mínima (D26), y misma consecuencia deseada: el modo de fallo es un PR de
más esperando, nunca un cambio de render entrando solo.

Entran `@types/*` (se borran al compilar, por definición no emiten nada), el ecosistema
`github_actions` (mueve el CI, no el sitio) y siete herramientas nombradas una a una. **Queda
fuera `@react-pdf/renderer` aunque sea de desarrollo**: cambia el PDF del CV en la próxima
regeneración, y `check:cv` sella las **entradas**, así que una regresión de maquetación pasaría
sin que el guardián dijera nada.

**Sobre `pull_request_target`, que es el disparador peligroso.** Es el único que permite que un
PR de Dependabot se mergee solo: desde 2023 los eventos `pull_request` de Dependabot reciben un
token de solo lectura. Es seguro aquí **por una razón concreta y escrita en el propio archivo**:
el workflow no hace checkout de la rama del PR ni ejecuta una línea de su código — solo lee
metadatos y llama a `gh`. El día que necesite el código del PR, ese comentario deja de ser
cierto y hay que cambiar el disparador.

**El triaje se validó antes de creerlo**, con diez casos de resultado conocido: `github_actions`
y `@types/*` en verde, `tailwindcss`, `typescript` y `@react-pdf/renderer` en rojo, un PR
agrupado con un solo paquete desconocido en rojo entero, y la lista vacía en rojo. Y **publica
sobre qué opinó, no solo su veredicto**: un triaje que no dice qué miró parece un aprobado
cuando no vio nada.

**Requisito de repositorio.** `allow_auto_merge` estaba en `false` y se activó. `--auto` no se
salta ningún gate: espera a que la protección de `main` (D68) dé por buenos todos los checks y
entonces hace `squash`. Un PR en rojo se queda abierto, que es lo correcto.

---

## D93 · El sitio scrolleaba en horizontal por debajo de 349px, y el culpable no era el que decía la tarea — 2026-08-22

**Contexto.** Dos tareas del cupo del sprint 3 (P65.5 y P65.6) describían el mismo síntoma desde
dos sitios: por debajo de 360px el sitio entero se movía de lado. Sus notas mandaban **medir cuál
de los dos elementos forzaba el ancho mínimo antes de tocar nada**. Bien mandado: los dos
diagnósticos apuntados estaban equivocados, cada uno de una forma distinta.

**Lo medido, sobre el sitio servido.** El nav pide **349px exactos** y no cede:

```
20 (gutter) + 217 (logo) + 16 (hueco) + 96 (grupo derecho) = 349
```

**El grupo derecho no era el culpable.** La tarea decía «el grupo derecho —EN + toggle + hamburguesa—
necesita 349px». Pide **96**. Quien manda es el **logo**: 217px, de los cuales **168 son un wordmark
que nunca encoge**. Y eso decide el arreglo, porque apretar el gutter y el hueco recupera 24 de los
29 que faltan a 320px: no llega. La única palanca que cabe es **soltar el wordmark**.

**Decisión 1 — el wordmark se suelta por debajo de 359px** (`max-[359px]:hidden` en `nav.tsx`). No es
una excepción inventada: el nav **ya lo suelta al hacer scroll** y el footer no lo lleva nunca
(`BRAND-logo.md` §Tabla de uso). Dejarlo encoger o truncarse lo prohíbe la regla 6 de ese mismo
documento —recorta glifos a mitad de letra y se lee como un bug—, así que la alternativa estaba
cerrada antes de empezar. **El símbolo se queda**, de modo que el momento de marca del split
(§Dónde respira la marca) sobrevive intacto. 359 y no 348 para tener margen real: el corte cae por
debajo del iPhone SE (375) y de los Android de 360.

**Decisión 2 — el email en prosa gana su punto de ruptura.** La otra tarea culpaba al email «de 29
caracteres sin punto de ruptura» en `contact-actions.tsx`. **Ahí no desborda**: el texto ocupa
20..296 dentro de una columna 20..300, y ya llevaba `break-all`. Lo que se sale son los 9,6px de
padding de su pastilla de chrome, a cada lado — invisible en reposo, porque esa pastilla solo se
pinta en hover.

Pero el fallo que describía **sí existe, en otro sitio**: en la **política de cookies** el mismo
email se pinta en **prosa**, sin ninguna protección, y sus 40 caracteres fuerzan el párrafo a 320
dentro de una columna de 280. Eran 20px de scroll en toda la página, y seguían ahí después de
arreglar el nav. Se resuelve con **`<wbr>` después de la arroba** y no con `break-all`: parte por el
separador natural en vez de por cualquier sitio, que dejaba «…@gmai / l.com» partiendo el dominio.

**Decisión 3 — 320 entra en la matriz del `viewport-verifier`.** Este fallo vivió meses en las trece
páginas porque **el viewport más estrecho del instrumento era 390**: estaba justo debajo del suelo
del metro. Y con él entra la comprobación que ningún otro paso hace —`scrollWidth > innerWidth`—,
porque un desbordamiento horizontal no lo caza axe ni lo ve la aritmética del pliegue: solo se ve
preguntándolo.

**Dos trampas del método, que cuestan una pista falsa cada una y por eso quedan escritas en el
agente.** Al buscar al infractor hay que **descartar `<col>` y `<colgroup>`** —no son cajas pintadas
y su rectángulo abarca la tabla entera— y **descartar lo que vive dentro de un contenedor con
`overflow-x` propio**, que scrollea ahí y no extiende el documento. La tabla de cookies daba las dos
señales a la vez y estaba perfectamente montada.

**Y una tercera, que ya es vieja: el servidor de al lado.** Dos veces en la misma sesión una
medición dio el resultado contrario al real porque el `next start` nuevo no había arrancado —el
puerto seguía ocupado por uno viejo— y se estaba midiendo un build anterior. Primero con
`x-powered-by` (D92) y después con esta clase. **Antes de creerse una medida, comprobar que el HTML
servido contiene el cambio**; es el punto 5 de `BRAND.md` §Cómo medir sin equivocarse, aplicado al
servidor en vez de a la clase.

**Estado, con su límite dicho.** A **320 y 360 las trece páginas están limpias**, en ES y EN. A
**280** —la pantalla exterior del Galaxy Fold— quedan tres con desbordamientos de 5 a 29px, y son
**otro problema**: no es carpintería de ancho fijo sino **palabras largas contra una columna de
240** (el `h1` «Accesibilidad» pide 269px él solo). Eso es la escala tipográfica en el extremo
estrecho, se tarea aparte y no se resuelve con esta decisión.

---

## D94 · El wordmark del logo escalaba con nada, y el arreglo elegante colapsaba la caja — 2026-08-23

**Contexto.** El footer estrena el lockup con nombre (P68) y es el **primer uso de
`showWordmark` en producción**: el nav y el Brand Kit dibujan el suyo a mano. Francisco vio,
comparando footer y Brand Kit, que «el texto no está proporcionado». Lo estaba, pero al revés
de lo que sugería el ojo.

**Lo medido, sobre el sitio servido — los siete wordmarks del sitio.**

```
nav                              22px / 48px = 45,8 %   peso 600
lockup del Brand Kit (×2)      25,6px / 60px = 42,7 %   peso 600
firma de email                 18,4px / 40px = 46,0 %   peso 600
ejemplo «mal» de usos incorrectos 12px / 48px = 25,0 %  peso 600  ← a propósito
componente (`showWordmark`)      18px / 32px = 56,3 %   peso 400  ← el único fuera
```

El del componente era **el más grande**, no el más pequeño, y era **el único a peso 400 y sin
tracking**. Eso es lo que el ojo leía como «más ancho»: le faltaba **cuerpo**, no tamaño. Un
`text-lg` congelado que no escalaba con el símbolo, contra la regla 5 de `BRAND-logo.md` — «si
cambia el tamaño del símbolo, el wordmark cambia con él».

**Decisión.** El tamaño sale de la altura del símbolo por `RATIO_WORDMARK` (0,45, la banda
40-45% que la regla fija para el lockup **compuesto en UI**), más `font-semibold` y el tracking
que llevan los otros seis. Medido después: 14,4px, peso 600, **45,0%**.

**El intento descartado, que es la parte que merece quedar escrita.** `container-type: size` +
`font-size: 45cqh` derivaba la cifra **sin pasar ningún número**, que era claramente la
solución mejor: el wordmark se mediría contra la altura real del lockup y no habría constante
que mantener. Se implementó, y colapsó:

```
lockup: 40..40 (w=0 h=32)   containerType=size
texto:  79..188 (w=110)     → se sale 148px
```

`container-type: size` aplica contención en **los dos ejes**, así que el elemento deja de
medirse por su contenido: con `inline-flex` y sin ancho explícito, el lockup se fue a **ancho
cero** con el texto pintándose fuera. **Se veía bien y la caja medía nada** — el modo de fallo
peor, porque una captura no lo habría enseñado. Lo destapó medir la caja además del texto, y no
por casualidad: es la misma sospecha de `BRAND.md` §Cómo medir sin equivocarse 5 («verifica la
clase, no solo el color»), aplicada al `getBoundingClientRect` del padre.

**Por eso el número se pasa**, y el tipo lo hace obligatorio: `showWordmark: true` exige
`symbolPx`, y sin wordmark no se puede pasar. Un componente no puede leer una clase de Tailwind,
así que la alternativa era deducirlo o confiar en un default — y un default silencioso es
exactamente cómo nació el 56,3%.

**Lo que sigue abierto y no se toca aquí.** El nav y el Brand Kit continúan escribiendo su
wordmark a mano con su propio par de números. Están **dentro de la banda**, así que no hay
incumplimiento; lo que hay es tres sitios que saben la misma proporción. Unificarlos es
posible ahora que el componente la implementa, pero el nav además **anima** la suya con el
scroll (regla 6), así que no es un reemplazo mecánico.

---

## D95 · El formulario de contacto sale por el SMTP de la propia cuenta, y por eso la CSP no se tocó — 2026-08-23

**Contexto.** P67 estrena la primera superficie del sitio que RECIBE algo escrito por otra
persona. La tarea dejó tres cosas por decidir antes de escribir código: dónde aterriza el
envío, cómo se para el spam sin CAPTCHA, y qué había que abrir en la CSP.

**Decisión 1 — el transporte: SMTP de Google con contraseña de aplicación**, no un proveedor
transaccional. Los dos candidatos costaban cero y ninguno pedía DNS, así que lo que decidió
fue otra cosa: un proveedor externo es un **encargado del tratamiento nuevo**, con su
transferencia internacional, y habría que declararlo en el bloque del artículo 13 que P66.5
acababa de publicar, donde hoy pone que «la única empresa que interviene es Google». El coste
del externo era permanente y legal; el del SMTP es operativo (una contraseña de aplicación que
Francisco genera, y un envío algo más lento desde serverless). `From` es la dirección real y
`Reply-To` el visitante: mandar `From: visitante@…` desde aquí falla SPF y DKIM a la vez, que
es el patrón exacto del spoofing.

**Decisión 2 — el envío es una Server Action, no un endpoint externo. Y eso es lo que hizo que
la CSP no cambiara.** El POST sale al MISMO ORIGEN, así que `form-action 'self'` y
`connect-src 'self'`, que ya estaban, lo permiten. El disparador escrito de D26 y de
`PRD-Live.md` §5 era literalmente «o antes si Contacto ampliada incorpora un endpoint
externo»: **no se ha cumplido**, así que la CSP estricta con nonces no está forzada por esta
tarea. Lo que sí ha cambiado es el otro platillo, y conviene no confundirlos: el argumento de
P67.1 para no hacerla decía «sin formularios, sin contenido de usuario», y esa frase ya no es
cierta. La decisión se toma en su tarea, con ese matiz, no aquí.

Y de regalo: con la acción en `action={…}` el formulario **funciona sin JavaScript**. Todo lo
de cliente —validar al salir de un campo, mover el foco al primer error, el estado «enviando»—
es comodidad encima de eso, nunca el mecanismo.

**Decisión 3 — anti-spam sin CAPTCHA**, porque un CAPTCHA es una barrera de accesibilidad y
este sitio publica una declaración de conformidad. Tres capas, y las tres con su límite
escrito: campo trampa que ninguna persona ve (se contesta «enviado» y no se envía nada, porque
decirle a un bot que lo has detectado solo le enseña a evitarlo), filtro de velocidad con el
sello puesto AL MONTAR —la página es estática, así que calcularlo al renderizar daría la hora
del build— y tope por IP **en memoria del proceso**, que en serverless no es un límite duro
sino un tope al envío repetido desde una instancia.

**Lo que se validó en el servidor y no en el cliente.** La validación vive en un módulo puro
que usan los dos lados, y **devuelve códigos, no mensajes**: las palabras las pone el
diccionario de la página, en ES y en EN. Es donde se olvida el i18n de un formulario, y donde
media página acabaría hablando español en `/en/contacto`.

---

## D96 · El disparador de la CSP estricta no se cumplió, y conviene decirlo en vez de dejarlo caducar — 2026-08-23

**D26 y `PRD-Live.md` §5 dejaron escrito cuándo tocaría la CSP estricta con nonces:** con la
IA conversacional de V4, «o antes si Contacto ampliada incorpora un endpoint externo». Un
disparador explícito, que es lo que este método pide para no depender de acordarse.

**Contacto ampliada llegó (P67) y NO incorporó endpoint externo.** El envío es una Server
Action del mismo origen, así que `form-action 'self'` y `connect-src 'self'` bastaron y
`next.config.ts` no se tocó (D95). El disparador no se ha cumplido, y esa es la respuesta.

**Lo que sí cambió, y por qué no basta.** El argumento que sostenía la espera decía «sin auth,
sin formularios, sin contenido de usuario». La tercera parte ya no es cierta. Pero la razón por
la que eso importaba sí lo sigue siendo: **el sitio no RENDERIZA nada de lo que llega**. El
mensaje viaja a un buzón de correo, en texto plano, y ninguna página lo pinta. La superficie de
inyección que la CSP estricta protege sigue sin existir.

**Contra un coste que no ha bajado:** las 28 variantes pasarían a render dinámico —sin SSG, sin
ISR, sin caché de CDN, según la doc de Next— contra los 4-6 puntos de margen que hoy separan el
PageSpeed móvil (94-96) del criterio de aceptación de `PRD-Live.md` §5. El premio medido es la
nota: `csp-implemented-with-unsafe-inline` vale −20 en el grader del HTTP Observatory, así que
con nonce el techo es 100 = A+.

**Decisión (Francisco, 2026-08-23): no se ejecuta, y la tarea se reescribe con estos hechos en
vez de dejarla apuntando a una condición que ya se resolvió.** Vuelve a V4, atada a la IA
conversacional, que sí traerá contenido generado y renderizado.

**Y la lección de método, que es lo reutilizable:** un disparador escrito puede cumplirse **o
descartarse**, y descartarse también es un resultado que hay que anotar. Sin esta entrada, la
tarea se habría quedado en el tablero apuntando a un evento que ya ocurrió y no la disparó, que
es la forma más silenciosa que tiene una condición de caducar.

## D97 · El contorno de un control no es el filete de una caja, y hasta hoy no lo medía nadie — 2026-08-23

**Contexto.** La `design-review` del cierre del sprint «Footer y contacto» midió el campo del
formulario recién publicado: **1,29:1** de borde contra su panel en claro, **1,23** en oscuro,
contra el 3:1 que WCAG 1.4.11 pide a la información visual que identifica un componente. El
campo no tiene relleno propio, así que el borde era lo único que lo señalaba como campo. Al
barrer el resto de controles con borde, el campo resultó el **más leve**: el toggle de tema,
los dos iconos del pie, el enlace de salto y las tarjetas pulsables estaban en **1,21 / 1,36**,
y llevaban así **desde V1**.

**Por qué no lo vio ningún gate.** `check:marco` delega el contraste en `viewport-verifier`;
`viewport-verifier` corre axe y dispara el censo; **axe-core no implementa 1.4.11** (lo lista
como comprobación manual); y el censo medía **pares de texto**. Ningún eslabón mentía y el
resultado era silencio. `grep` de «1.4.11» en `scripts/` devolvía cero mientras
`/accesibilidad` publicaba que «todo texto y todo control se comprueba con cifra».

**Decisión 1 — el censo crece a dos pases.** `contrast-census.js` mantiene el pase de texto y
añade uno de **contorno de control**: por cada elemento interactivo que dibuja caja (borde o
relleno propio) mide borde-vs-fondo y relleno-vs-fondo, y **basta con que uno llegue a 3:1** —
un botón sólido no necesita borde. Quedan fuera, a propósito y para no inventar hallazgos: lo
no interactivo, los enlaces de texto sin caja (su afordancia es el texto, y eso es 1.4.3), los
deshabilitados (WCAG los exime), el hover (el control ya era reconocible antes del cursor) y
lo que cae sobre imagen. `npm run censo` falla nombrando el control, y **afirma cuántos ha
indexado**: un cero es el pase sin correr, no un aprobado.

**Decisión 2 — se parte el token, no se sube `--border`.** `--border` y `--input` tenían el
mismo valor y servían dos decisiones con umbrales distintos: el filete decorativo (sin umbral)
y el contorno de un control (3:1). Nace **`--control-edge`**, derivado de la superficie igual
que `--surface-dim` (D39) y con la misma cobertura de cambios de superficie por estado (D61).
La mezcla **conmuta con el tema** —60% claro / 45% oscuro— porque un porcentaje fijo no llega
a `--background`, `--card` y `--muted` a la vez; mismo patrón que `--primary-on-inverted`.
Subir `--border` habría endurecido cada hairline del sitio para arreglar los controles.

**Dónde se aplica.** En la VARIANTE, nunca en el call site: `outline-neutral`, `icon` y `card`
de `action.tsx`, el `CONTROL` de `field.tsx`, y las dos tarjetas pulsables que todavía viven
fuera de la capa (`ui/page-closer.tsx` y `site/trayectoria-indice.tsx`). Lo bordeado en
`primary` no lo necesita: ya va a 7,47.

**Lo que esto deja escrito para la próxima.** Es la cuarta vez que un metro de este proyecto
falla en silencio, y la primera en que el fallo es que **el metro no existía**. Las tres
anteriores fueron instrumentos rotos; esta fue un hueco con forma de instrumento. Y el nombre
ayudó: «censo de pares de contraste» suena exhaustivo — si hubiera dicho «de TEXTO», el hueco
se habría visto el día que se escribió. Fue además la **segunda vez en el mismo sprint** que
el censo no podía ver algo (D-entry de `--destructive`, doce días antes): aquella vez se
arregló el caso y se escribió una regla, no se tocó el metro.

**Addendum 2026-08-28 (P50.92) — la regla invertida estaba calibrada al revés, y no se notó
porque no tenía ocupante.** `[data-surface="inverted"]` construye el contorno desde
`--background`, que es su primer plano, pero usaba `--control-edge-mix`, el número calibrado
contra el fondo del PROPIO tema. En una banda invertida el fondo es el del OTRO, así que el
número que sirve es el otro: medido sobre el píxel pintado, el 45% de oscuro daba **2,78:1**
contra la banda —por debajo del 3:1 de 1.4.11— y el 60% de claro daba 5,89, holgado pero más
duro que el ~4 que busca el resto de la familia. Nace `--control-edge-mix-inverted` (45% claro
/ 60% oscuro, 3,96 y 4,30), con la misma forma que `--border-mix-inverted`.

**Y por qué el censo no lo cazó, siendo un pase que existe desde esta misma decisión:** el
único control que vive hoy sobre una banda invertida —el compartir de la apertura del
artículo, `ShareActions`— **se pintaba el borde a mano** (`border-background/70`, escrito en
P60, un día antes de que existiera `--control-edge`). El censo medía el borde que el elemento
pinta, y ese estaba bien. La regla de la capa era la que estaba mal, y no había nadie que la
ejecutara. Es la variante «regla sin ocupante» del metro que devuelve lista vacía: aquí lo que
devolvía vacío no era el metro sino el CONJUNTO MEDIDO. Al devolver el borde a la capa, la
regla invertida tiene por fin su primer ocupante y entra en el censo.

## D98 · Tres instrumentos sanos midiendo la mitad de su objeto, y el filtro barato que iba después del caro — 2026-08-23

**El hallazgo del cuarto `method-review`, y lo que lo hace distinto de los tres anteriores.** No
encontró ningún gate roto. Encontró **tres gates sanos midiendo un objeto más pequeño que el que
dicen cubrir**, y por eso ninguno se puso rojo nunca: no fallaron, miraron a otro sitio.

**1 · El presupuesto de contexto vigila la mitad que no crece.** Medido sobre el historial:

| fecha | `@`-importados (vigilado) | skills (sin vigilar) |
|---|---|---|
| 2026-08-08 | 9.188 | 5.982 |
| 2026-08-19 | 13.084 | **16.261** |
| 2026-08-23 | 12.356 | 19.938 |

El cruce ocurre el **19 de agosto, el día del PRIMER `method-review`**: ese día lo vigilado bajó
437 palabras y lo no vigilado subió 6.816. Los dos disparos juntos **retiraron 1.463 de la mitad
que se cuenta y depositaron 10.493 en la mitad que no**. `design-review` sola son 6.152 palabras,
la mitad del presupuesto entero. Es «arreglar la mitad que se abre» aplicado al propio método, y
es la quinta instancia de esa familia. Tareado en P68.67.

**2 · `Prioridad` dejó de ser un orden de ejecución.** El orden real del sprint 3, sacado de los
commits, fue `64.6 · 64.7 · 65.5 · 65.6 · 67.5 · 68 · 64.5 · 65 · 66.5 · 67`: **P64.5 se ejecutó
la séptima, después de P68**, y hubo cuatro saltos contra una regla de tablero que dice literalmente
«no se salta una tarea de prioridad menor». Además, dos tareas distintas compartían la prioridad
exacta 69,93. **El tablero es la única fuente de verdad del proyecto sin guardián** — los 16 pasos
de CI miran el repo y ninguno mira dónde vive el orden de ejecución. Tareado en P68.685.

Y el síntoma que se nota antes que la causa: **`Blocked` está haciendo el trabajo que debería
hacer `Prioridad`**. Si el número codifica el orden, bloquear es excepcional; si no lo codifica,
hay que marcar a mano lo que el número debería decir, y se acaba con más tareas bloqueadas que en
marcha.

**3 · El hook de formato no ve las ediciones por Bash.** Casa `Edit|Write|MultiEdit`; el modo
automático edita con `sed`/heredoc por **Bash**, y los generadores escriben por Node. **No falla:
no se le llama**, y no deja rastro. Es una piel nueva del metro que aprueba sobre lista vacía —
las seis instancias anteriores devolvían una lista vacía; esta ni siquiera corre. De 30 runs de
CI, 2 en rojo: uno era `check:articulo` funcionando (D84) y el otro fue `Format` con tres `.tsx`,
que es la clase entera de rojo que ese hook existe para eliminar. Tareado en P68.455.

### Lo que sí se arregló el mismo día

- **El filtro barato va ANTES del caro.** `design-review` gana un **Paso 0**:
  `/web-design-guidelines`. Estaba escrito en la columna A de la DoD —«**antes** de
  `design-review`»— desde que se escribió, y **no tenía portador**. La cifra que lo justifica: de
  los cinco hallazgos del `design-review` del sprint 3, **dos eran huecos de medición genuinos**
  (D97 y el de `--destructive`) que ningún instrumento podía ver y cuya respuesta correcta fue
  extender el metro; **los otros tres eran mecánicos** —un filete varado entre 768 y 829px, nueve
  copias de la misma cadena y una excepción publicada en cuatro sitios— y los cazó a mano la
  revisión más cara del sistema.
- **`/security-review` gana disparador** en `CLAUDE.md`: toda tarea que añada una superficie que
  reciba input de un tercero. El sprint 3 estrenó la primera del sitio —formulario y SMTP— y no se
  disparó ni una vez; el `sprint-review` encontró después una inyección en la cabecera `Reply-To`.
- **El cuerpo de una tarea de Notion no sale en la consulta SQL**, que solo devuelve propiedades, y
  el cuerpo es donde vive el porqué medido. Convención escrita en `CLAUDE.md`.
- **`check-artefacto.ts` derivaba su «1 artefacto» de un literal.** Es la forma fina de fallar al
  afirmar cuánto has mirado —el número es correcto hasta que deja de serlo— y su hermano
  `check-cv-fresh.ts` ya llevaba el arreglo documentado en su línea 52.
- **La skill `method-review` se lo había hecho a sí misma.** Presumía «una reducción del 35% del
  contexto de arranque»; el total pasó de 13.521 a 13.084, o sea **−3,2%**. Lo que cayó un 42% fue
  `PRD-Live.md` sola, mientras `CLAUDE.md` (+452) y `BRAND.md` (+959) se comían el hueco el mismo
  día. La cifra describía un archivo y se leía como si describiera el arranque entero — dentro del
  documento que define cómo se cazan esas cifras.

### Y la demostración que se dio sola

Las dos reglas nuevas de `CLAUDE.md` **no cabían**: el presupuesto estaba en 12.356 de un techo de
12.400. Hubo que **retirar** antes la regla de `design-review`, que estaba escrita tres veces
—`CLAUDE.md`, `PRD-Live.md` §5 y la propia skill—. Quedó en 12.383: **17 palabras de margen**. La
tarea que anticipaba esa presión (P68.675) nació esa mañana diciendo «44 palabras» y la sufrió esa
misma tarde; sube a `Must`.

**La lección de método, que es lo único que hay que llevarse:** medir un instrumento incluye medir
su **alcance**, no solo su resultado. Los tres hallazgos de arriba no se habrían encontrado
preguntando si fallaban; se encontraron preguntando **sobre qué** pasaban.

## D99 · La auditoría de rendimiento recorre el registro, y un ahorro estimado no es un ahorro — 2026-08-24

**Decisión.** `npm run psi -- --registro` recorre las páginas de `PAGE_SLUGS` (D72) como hace
`censo` desde D85, en vez de medir una URL pasada por argumento. Y lo que imprime deja de ser
una lista de títulos: cada aviso lleva **gravedad** —el corte de Lighthouse, rojo por debajo de
0,5 y naranja por debajo de 0,9— y su ahorro estimado, y al final va **el agregado: qué aviso se
repite en cuántas páginas**. Amplía D49, no lo sustituye: el modo de una URL y el desglose del
LCP siguen siendo el instrumento cuando se persigue una cifra concreta.

**Por qué el modo registro.** Mientras la auditoría medía una URL, la cobertura dependía de
acordarse de cuál mirar, que es lo que `BRAND.md` §Cómo se escribe una regla nombra como fuente
del drift. Y ya había pasado: `PRD-Live.md` §5 publicaba «100 escritorio · 94-96 móvil», una
cifra escrita con doce páginas que dejó de ser cierta al añadir la trece y la catorce sin que
nada lo dijera.

**Por qué el agregado es el entregable.** Un aviso en catorce páginas se arregla una vez en la
capa; el mismo aviso en una es pulido de esa página. Sin esa tabla hay que leer catorce informes
y hacer la cuenta a ojo, que es como se acaba tratando como puntual algo que era transversal. La
primera pasada lo demostró: de los **seis rojos que se repiten, solo dos son nuestros**, y los
dos aparecen en una página cada uno. Los otros cuatro son de terceros (`gtm.js` y `gtag`, 135 de
los 181 KiB de «unused JavaScript»), del framework (`polyfill-module.js` de Next, cuyo fuente
entero mide 1.380 bytes pese a los «14 KiB de ahorro») o ya medidos y descartados.

### Un ahorro estimado no es un ahorro: es una hipótesis con unidades

Es la parte reutilizable, y salió de creerse una y comprobarla. La auditoría señalaba
«Render-blocking requests» en **14 de 14** páginas con ~580 ms estimados en móvil, y al abrir el
detalle los culpables eran exactamente nuestras dos hojas de estilo. El candidato era
`experimental.inlineCss`, que además es el caso que la doc de Next describe para activarlo: CSS
atómico y visitantes de primera vez, que aquí no es una suposición sino la definición del
visitante.

Medido **Preview contra Preview**, que es la única comparación limpia —producción va más rápida
que cualquier Preview, y compararlas habría dicho que el cambio empeoraba cinco puntos:

| home móvil | nota | LCP | FCP | render-blocking |
|---|---|---|---|---|
| Preview control (`<link>`) | 92 · 93 · 92 | 3,2 s | 1,2 s | «600 ms estimados» |
| Preview con `inlineCss` | 91 · 91 · 91 | **3,2 s** | 1,1 s | **pasa** |

El aviso desaparece, el FCP mejora 0,1 s y **el LCP no se mueve**, a cambio de que el HTML de
cada página pase de 17 a 32 KB en brotli y de que el CSS deje de cachearse entre páginas.
Revertido. Los 600 ms no existían: las dos hojas van al mismo origen por HTTP/2 y pesan 18 KB
comprimidas, así que llegaban en paralelo con el HTML y nunca fueron el cuello de botella.

### La varianza, que es lo que fija cómo se publica la cifra

En la misma noche, la home dio **72** en escritorio y veinte minutos después **100** —mismo
despliegue, misma URL—, y una de las 28 llamadas devolvió un 500 de Lighthouse que al repetirla
dio 100. Por eso el script **cuenta y nombra las llamadas que fallan**: una pasada incompleta no
puede leerse como una pasada limpia.

Y por eso `PRD-Live.md` §5 pasa a publicar **el umbral como criterio y el rango con su fecha
como estado** —móvil 95-99 · escritorio 97-100, medido el 2026-08-24— en vez de un número
suelto. Un número sin fecha afirma una estabilidad que PSI no tiene. Es también la cifra que le
faltaba a D49 para justificarse: `psi` sigue **fuera de CI** porque 28 puntos de diferencia en
la misma URL serían rojos falsos.

**Y la mitad que faltaba, cerrada el 2026-08-30 (P66.5).** «Publicar el rango con su fecha» dejó
la fuente única a medias: `content/psi/registro.json` la sella el script y el artículo la lee,
pero el `README.md` **tecleaba el rango a mano**, así que había dos sitios y solo uno se movía.
Ya no: el README cita la fuente y no la copia. Las cifras de este párrafo se quedan como están
porque son el registro de lo que se midió ese día, no una afirmación viva.

Re-sellado el **2026-08-30**, con «Voz» mergeado y contra producción: **móvil 93-99 · escritorio
97-100**, mediana de tres tomas, **84 llamadas y 84 análisis distintos** (ninguna deduplicación,
así que ningún par se selló con una sola muestra) y **cero llamadas fallidas**.

**Y la predicción que acompañaba a esta tarea era FALSA, que es lo que hay que anotar.** Estaba
escrito que con una sola toma el ruido de PSI es asimétrico hacia abajo, así que el mínimo salía
pesimista y lo más probable era que **subiera**. **Bajó dos puntos** en móvil (95 → 93). El
razonamiento tenía forma de causa y era una sospecha: el ruido de PSI no es asimétrico, es
**ancho** —esta misma corrida vio `/sobre-mi` en móvil dar 74, 96 y 97, y dos deep-dive con 22
puntos de recorrido—, y con un rango que es un min/max sobre catorce páginas, más muestras
**ensanchan** el rango tanto por abajo como por arriba. Lo que sí se sostiene es la única
afirmación que importaba: el >90 de `PRD-Live` §No funcionales no está en riesgo, ahora con un
método que el repo no ha retirado.

**Lo que queda abierto.** El retraso de renderizado del LCP móvil (P68.62) sigue sin causa
accionable: su premisa decía «~81% del LCP móvil», y midiendo la misma página del mismo
despliegue ese reparto va de 108 ms (43%) a 1.983 ms (83%). El elemento LCP es la foto del hero,
que ya pasa las tres comprobaciones de descubrimiento, así que lo que queda es trabajo de hilo
principal. La tarea vuelve a «necesita definición» en vez de cerrarse.

## D100 · `space-y` de Tailwind v4 va dentro de `:where()`, así que cualquier hijo con `m-0` lo anula — 2026-08-24

**El síntoma.** El último capítulo de «Cómo se ha creado esta página» se leía como un muro:
siete párrafos seguidos y pegados, sin más separación que el interlineado. `ArticleProse`
pide `space-y-[1.75rem]` desde P60, así que el código decía una cosa y la página pintaba
otra.

**La causa.** Tailwind v4 compila esa utilidad envuelta en `:where(…)`:

```css
:where(.space-y-\[1\.75rem\] > :not(:last-child)) { margin-block-end: 1.75rem }
```

`:where()` tiene especificidad **cero**, y el `m-0` del propio párrafo (0-1-0) la gana
**siempre**, sin que importe el orden en la hoja. En v3 el selector era
`> :not([hidden]) ~ :not([hidden])` (0-2-0) y ganaba él. El envoltorio es deliberado en v4
—existe para que la utilidad sea fácil de sobrescribir— y aquí lo sobrescribe justo lo que
no debía.

**Por qué pasó año y medio invisible.** Todos los demás bloques traen margen propio y con
`!`: el `h3` su `!mt-[2.5rem]`, la `ul` su `!my-[2.25rem]`, el marco del diagrama el suyo.
Ganan al `:where()` y su ritmo sí se pinta. **El párrafo era el único que dependía del
`space-y`**, y el cierre la única sección hecha solo de párrafos. En las otras once lo
tapaban los subtítulos, las listas y los diagramas.

**El arreglo, y por qué no es quitar el `m-0`.** `[&+p]:mt-[1.75rem]` en el párrafo, que
compila a `.clase + p` (0-1-1) y gana **por especificidad, no por orden**. Quitar el `m-0`
o retirar el `space-y` habría arreglado un ritmo rompiendo otro: el `space-y` **sí**
funciona para los hijos que no llevan `m-0`, y de él recibe su margen inferior el marco de
un diagrama.

**Cómo se encontró, que es la parte reutilizable.** Prototipando el ritmo con `/prototype`,
una de las variantes era «Hoy» como línea base. Francisco la comparó con producción y no
coincidían: la línea base reproducía lo que el código dice. Sin esa comparación, las cuatro
direcciones se habrían medido contra una quinta mejora y cualquiera habría «funcionado»,
tapando la causa. Es la regla 3 de `BRAND.md` §Cómo se escribe una regla aplicada a una
maqueta: **valida el metro contra algo que ya conoces antes de creerte el hallazgo**, y aquí
lo que había que validar era la propia línea base.

**Dónde puede volver a morder.** En cualquier `space-y-*` cuyos hijos lleven `m-0` u otra
utilidad de margen. Hoy hay tres en el repo y los otros dos están bien: el de la lista
(`space-y-[0.7rem]`) tiene hijos `li` sin margen propio, y el `space-y-2` de la apertura
también.

**Y va al artículo.** Es la tercera sorpresa de estrenar Tailwind v4 y comparte firma con
las dos que s04 ya contaba —«el error no da la cara»—, con el añadido de ser la única
descubierta **después** de publicar el capítulo que habla de ellas.

---

## D101 · El arnés de tests entra cuando aparece la lógica, y se mide sobre lo que el código EMITE — 2026-08-24

**La condición se había escrito antes, y por eso esto no es una decisión nueva sino una
condición cumpliéndose.** El PRD llevaba desde V3 diciendo «tests cuando aparezca la primera
lógica de negocio real», y el sitio pasó año y medio sin uno solo con razón: hay datos,
componentes de presentación y reglas, y las reglas ya las verifican los guardianes en cada
push. Un test que comprueba que un título renderiza un título es teatro caro de mantener.

Lo que cambió es que **el formulario de `/contacto` trajo la lógica**: valida entrada de un
tercero, compone una cabecera de correo y decide si un envío se acepta. Y no es teórico: el
`sprint-review` del 2026-08-23 encontró ahí **dos fallos que un test habría cazado** — la
inyección en `Reply-To` por concatenación (P68.47) y el sello caducado que contestaba
«enviado» a alguien cuyo mensaje se había tirado (P68.48). Dos bugs en la única superficie
que recibe algo escrito por otra persona, encontrados por revisión y no por el código.

**Runner: Vitest**, que es el que recomienda la guía de Next 16 (`node_modules/next/dist/docs/`).
Las alternativas se descartaron midiendo, no por gusto: `node:test` no habría costado ni una
dependencia, pero su `mock.module()` sigue tras `--experimental-test-module-mocks` en Node 22,
que es el de CI, y sin mocks solo se puede probar la validación pura — justo lo que no
motivaba la tarea. La tercera vía, inyectar dependencias en la Server Action, era tocar
código de producción para poder probarlo.

**Y se instala sin `jsdom`, sin `@testing-library` y sin `@vitejs/plugin-react`.** El alcance
no tiene ni un componente: montar un DOM falso para código que nunca toca el DOM es pagar un
árbol de dependencias por nada. `vite-tsconfig-paths`, que la guía de Next sigue
recomendando, **también sobra**: Vite ya resuelve los paths del tsconfig de forma nativa y lo
avisa él mismo por consola. Quedó **una** dependencia de desarrollo.

### Lo que hace estos tests distintos de una suite de cobertura

**Se mide sobre el mensaje que nodemailer EMITE, no sobre el objeto que se le pasa.** El bug
de P68.47 era exactamente que un objeto de aspecto razonable producía dos direcciones en la
cabecera; afirmar la forma del objeto habría vuelto a aprobarlo. El transporte SMTP se
sustituye por el `streamTransport` del propio nodemailer, que devuelve el RFC 822 completo en
un búfer sin abrir un socket: la codificación de cabeceras, el entrecomillado y el plegado
son los de verdad.

**Y el metro se validó contra el caso conocido antes de fiarse de él** (`BRAND.md` §Cómo
medir, regla 3): con `x>,<atacante@evil.com`, el `Reply-To` emitido es
`Marta Ruiz <"x , atacante"@evil.com>`, una sola dirección.

**Las 54 aserciones se validaron rompiendo el código.** Nueve mutaciones en `lib/mailer.ts`,
`lib/contact-form.ts` y la Server Action; las nueve salen rojas. La primera pasada dio
**ocho de nueve**, y el fallo es el interesante: el test del salto de línea en las cabeceras
seguía pasando con `header()` quitado, porque **quien defiende ahí es nodemailer**, que
codifica el CRLF en RFC 2047. El test afirmaba una propiedad cierta que se cumple sola. Se
reescribió para afirmar lo que `header()` sí cambia en el mensaje emitido (que el salto no
viaje **ni codificado**), y entonces mordió. *Es D70 otra vez: el modo de fallo de un test es
una luz verde.*

**Por eso el arnés entra en `check:guardianes` el mismo día que entra en CI**, con su caso
malo propio: la regresión de P68.47 literal. Un gate cuyo verde no se ha comprobado no es un
gate, y una suite que no prueba nada se parece demasiado a una suite verde.

### Dónde queda

**Paso 17 de CI, detrás de `Lint`**, con los que miran el código fuente y antes de los que
miran artefactos derivados. Entra en CI y no a demanda —al revés que `psi` o el censo—
porque no necesita navegador ni red y tarda menos de un segundo. Un test que no corre en cada
PR no es un guardián, es documentación.

**Y el recuento de pasos sigue escrito a mano en cinco sitios** (el diagrama de §s10, su pie
en los dos diccionarios, `PRD-Live.md`, `CLAUDE.md` y `README.md`). Quince, luego dieciséis,
ahora diecisiete. Derivarlo del propio `ci.yml` es **P68.495**, la tarea siguiente, y este
cambio es su cuarto caso medido.

---

## D102 · «Dato en vivo» era una promesa, no un mecanismo: la cifra se deriva o se sella, nunca se teclea — 2026-08-24

**El hallazgo, y quién lo encontró.** La pieza que el artículo usa para publicar una cifra
sobre el propio sitio se llama `livestat` y su etiqueta dice, literalmente, «dato en vivo».
Había tres, y **solo uno lo era**: el del contraste, que interpola `{paginas}` desde
`lib/design-values.ts`. Los otros dos eran números escritos a mano dentro de un `value`, y
los dos **ya mentían**: «siete piezas» con ocho en disco desde que existe `field.tsx`, y
«100 escritorio · 94-96 móvil» medido con doce páginas cuando ya había catorce.

No los encontró ningún guardián. Los encontró Francisco leyendo el artículo con calma. Y ese
es el punto: `check:articulo` (D84) gira entero alrededor de las dependencias **declaradas**,
y **un número tecleado dentro de un `value` no declara nada**. No es que el guardián fallara;
es que ese hueco quedaba fuera de su forma.

### Las tres cifras no se derivan igual, y esa es la parte reutilizable

- **Piezas del núcleo** y **pasos de CI** se leen del disco al construir (`lib/figures.ts`).
  La verdad está en `components/ui/` —cada archivo declara su grupo en su primera línea
  (D89)— y en `.github/workflows/ci.yml`. Añadir una pieza o un paso mueve la cifra sin que
  nadie se acuerde.
- **La nota de PageSpeed no se puede derivar**: medir necesita pintar y necesita producción
  (D49/D99). Así que **se sella**, como hace el censo: `npm run psi -- --registro` deja el
  rango de cada estrategia con su fecha en `content/psi/registro.json`, y el artículo lo lee
  de ahí. Un número medido sigue siendo un número medido, pero deja de poder envejecer en
  silencio, porque llega con su fecha pegada y el sitio la publica al lado.

**Y el sello se niega a escribir una pasada parcial.** Ni sobre un Preview, ni con una sola
estrategia, ni con un solo fallo: dice por qué no ha sellado y deja el sello anterior. Un
rango sacado de media auditoría se lee exactamente igual que uno bueno, que es el modo de
fallo de toda esta familia.

### Los pasos de CI: el recuento sale del workflow y el dibujo se compara con él

El pie de §s10 decía «los dieciséis pasos» y el diagrama dibujaba dieciséis pastillas, con la
cifra repetida además en el texto alternativo y en las dos etiquetas de la leyenda. Cinco
sitios, todos a mano, y en su vida han dicho lo mismo dos veces seguidas: fue quince, luego
dieciséis, y P68.494 la dejó en diecisiete.

Ahora el **recuento** sale de contar los pasos de `ci.yml` que invocan un script de npm —la
misma regla que usa una persona al leerlo, y por eso `Install dependencies` no cuenta—, la
**leyenda** sale de contar las propias pastillas, y los pasos dibujados salen a
`content/articulo/ci-steps.ts` para que `check:articulo` **compare el dibujo contra el
workflow**. Lo que no se deriva y por eso sigue escrito: el agrupado por rol y la categoría de
cada paso, que son editoriales. Y el nombre no se compara: el workflow los nombra en un idioma
y el diagrama se lee en dos.

### La parte que impide que vuelva a pasar

`check:articulo` gana dos comprobaciones, las dos de **ausencia** como el resto de la casa:

5. **Un `livestat` no puede tener el valor tecleado**: si la pieza promete «dato en vivo», su
   valor tiene que interpolar una cifra derivada. Y el token tiene que **existir**, que es la
   segunda mitad: `{psiMovil}` con una ele de más no rompe nada, se publica con las llaves
   puestas.
6. **El diagrama de CI dibuja tantos pasos como tiene el workflow.**

Y el guardián **afirma cuánto ha mirado**: seis datos en vivo, todos interpolados, y diecisiete
pasos dibujados. Los dos casos malos están en `check:guardianes`, y con ellos se validó que
muerden.

**Un detalle de implementación que sí importa: el relleno alcanza a TODA cadena del bloque**,
no solo al `value` de un `livestat`. Antes solo se rellenaba ahí, así que un `{pasosCI}` en el
pie de un diagrama se habría publicado con las llaves a la vista. Recorrer el bloque entero
cuesta lo mismo y quita una regla que había que recordar.

**Enmienda del mismo día, al cerrar la sesión.** Este párrafo decía que el recuento «sigue
escrito a mano en `PRD-Live.md`, `CLAUDE.md` y `README.md` porque no hay dónde interpolar», y
daba eso por inevitable. No lo era: **la respuesta correcta no era interpolarlo, era dejar de
escribirlo.** Un documento no necesita decir cuántos pasos tiene CI cuando `ci.yml` está a un
clic y el README ya los tabula; escribirlo solo crea un sitio más donde caducar, y ya había
caducado dos veces. Los tres se han quedado sin número. Es la misma regla que `close-session`
tenía escrita desde el 2026-08-23 y que esta entrada no aplicó: *ante un recuento obsoleto, la
pregunta no es cuál es el número correcto sino si esa frase necesita un número*.

---

## D103 · El ruido de `check:articulo` no eran los falsos positivos, era tener que ir a leer — 2026-08-24

**La hipótesis, escrita en la tarea y con un argumento razonable detrás.** `check:articulo`
(D84) sella **por archivo**, y «la dependencia declarada es más gruesa que la afirmación que
protege»: tocar un **comentario** de `ci.yml` enciende §s10, y cambiar el estado de un sprint en
`PRD-Live.md` §9 enciende §s12, que solo habla de las métricas del §7. De ahí la propuesta:
afinar la granularidad —sellar por sección de destino, ignorar comentarios— o aceptar el ruido.
Y la tarea decía, con razón, que **medirlo era más urgente que construir el skill**.

### La medición, y por qué cambió el diseño

Se reconstruyó el sello de cada sección **en cada uno de los últimos 60 commits**, sin hacer
checkout: leyendo cada dependencia con `git show <sha>:<ruta>` y aplicando el mismo recorte que
`huella.ts`. Después se clasificó cada encendido por la causa del cambio.

| | |
|---|---|
| Commits que encienden algo | 31 de 60 |
| Secciones encendidas | 57 |
| …por un cambio **sustantivo** | **53** |
| …por comentarios | 7 |
| …por el borde del recorte | 3 |
| Secciones encendidas **solo por ruido** | **8 de 57 (14%)** |

**La hipótesis no sobrevive: el 86% de los encendidos son cambios de verdad en la fuente.**
Afinar la granularidad no era donde estaba el coste. Y aun así, los siete disparos con veredicto
registrado terminaron **los siete en «sellar»**. Las dos cosas juntas dicen algo distinto de lo
que decía la tarea: **el problema no son los falsos positivos, es que «la fuente cambió» obliga a
abrir el archivo, buscar el cambio y juzgarlo.** El coste está en la lectura, no en el disparo.

### Qué se hace, entonces

1. **`npm run articulo:novedades`** — el informe. Por cada sección movida dice **qué
   dependencias cambiaron y qué líneas**, comparando contra el contenido que tenían en el commit
   donde se escribió el sello vigente (`git log -1 -- content/articulo/articulo.huella`). No
   reduce los disparos: los hace baratos. El rojo de `check:articulo` lo nombra, y
   `close-session` lo pone en su orden de trabajo.
   Fuera de CI, como `psi` y el censo: necesita historia de git y su salida es para una persona.
2. **Se mata el artefacto del borde del recorte**, que es la única de las dos causas mecánicas
   sin ninguna señal dentro: el recorte de una entrada de markdown llega hasta el titular
   siguiente, así que **arrastra el separador**, y por eso **añadir una decisión nueva cambiaba
   el recorte de la anterior**. Tres casos de tres, todos con la entrada citada sin tocar.
3. **Los comentarios NO se ignoran**, y es una decisión, no una omisión. En este repo el
   comentario es donde vive el porqué, y el artículo describe justo eso: los comentarios de
   `ci.yml` son documentación. El informe los **marca** —`[solo comentarios]`— y deja el juicio a
   quien lee, que es lo correcto cuando la señal existe pero es débil.

### El informe se validó a sí mismo en su primer disparo

La primera corrida real dio **11 secciones movidas y cero dependencias cambiadas**, que es
imposible… salvo que lo que haya cambiado sea el propio método de sellado, como acababa de pasar
con la poda del recorte. El script lleva escrita esa guarda y la disparó sola: *«el sello no
cuadra y ninguna dependencia parece haber cambiado; revisa el diff de `huella.ts` antes de sellar
a ciegas»*. Un informe que sale vacío se lee igual que uno que no tenía nada que contar, y ese es
el modo de fallo que este repo se ha encontrado cinco veces.

**Lo que queda abierto, y sigue abierto a propósito.** El artículo mezcla dos tiempos verbales
—«no hay formulario de contacto» es *estado* y caduca; «me quedé con el enlace» es *decisión
fechada* y no caduca— y es el único documento del proyecto sin la partición que ya tienen
`PRD-Live`/`PRD-Historical` y `BRAND`/`BRAND-historical`. Se decide al escribir el primer caso
real que la necesite; siete disparos después, ninguno la ha necesitado todavía.

## D104 · El censo mide dónde está pintada la caja, no quién recibe el clic — y la pasada se desplaza antes de medir — 2026-08-24

**Dos huecos independientes, y cada uno bastaba para producir el mismo cero.** D97 añadió al
censo el segundo pase, el de WCAG 1.4.11: el contorno de un control tiene que llegar a 3:1
porque es lo que permite reconocerlo *como* control. Ese pase publicaba «cero contornos bajo
el 3:1» y era cierto de lo que miraba. Lo que miraba era menos de lo que parecía.

### El primero: el criterio de caja

Un elemento entraba en el pase si casaba `CONTROL_SEL` **y dibujaba su propia caja** —algún
lado con borde, o `background-color` con alfa—. El riel de secciones del artículo dibuja su
píldora en un `<span>` HIJO, así que el `<a>` se descartaba por no tener caja y el `<span>` no
se miraba por no casar el selector. **Doce controles invisibles**, y once de ellos con el borde
a **1,21:1 en claro y 1,36 en oscuro** contra un umbral de 3 — la misma cifra que D97 acababa de
corregir en la capa de componentes, y que aquí se había quedado fuera porque el riel es la
excepción viva de `BRAND.md` que no compone `chromeLinkVariants`.

Ahora, cuando el control no dibuja nada, se mide **el mayor descendiente que sí dibuje**. Y
**sin umbral de área**, que es la parte que se decidió midiendo en vez de eligiendo: sobre seis
páginas servidas, la puerta nueva sin umbral deja entrar exactamente los doce del riel y ni un
falso positivo. Ocupan el **0,30** del área de su control, así que un umbral del 50% los habría
perdido y 0/10/25% dan el mismo resultado. Un número que no cambia nada solo añade algo que se
puede desajustar.

### El segundo: la pasada no se desplazaba

`censo.ts` hacía `open`, `set media`, inyectar y medir. **Sin scroll.** Así que toda isla que
solo monta al desplazarse —el riel es el caso— no estaba en el DOM cuando se la iba a medir.
Arreglar solo el criterio no habría cambiado nada en la corrida de verdad: habría seguido
saliendo «cero» por el otro motivo. Desplazarse es **estrictamente aditivo** para la cobertura:
el censo recorre el DOM entero y su `esVisible` mira tamaño y visibilidad, no intersección con
el viewport, así que bajar no quita nada de la lista.

### Lo que se publica para que no vuelva a pasar en silencio

El informe dice ahora **cuántos controles entran por la puerta nueva** —«22 indexados (12 por
caja en un descendiente)»—, porque si mañana se rompe la búsqueda en descendientes el censo
volverá a decir «cero bajo 3:1» y eso vuelve a leerse como un aprobado. Es la sexta vez que este
proyecto se encuentra un metro que aprueba por no mirar (D38, D57, D60, D63, y las dos roturas
del propio censo).

Y los pares **sobre imagen** dejan de ser una cifra al pie y pasan a nombrarse uno a uno. Eran
2 y con el scroll son 16, y las dieciséis abstenciones son **correctas**: cuatro son el titular
de Sobre mí sobre el vídeo, y doce el nav —`sticky`, translúcido, con `backdrop-blur`— sobre lo
que le corre por debajo desde que la pasada se desplaza. Un texto sobre una foto no tiene un
color de fondo que componer. El fallo no era abstenerse: era esconderlo en un recuento que nadie
podía accionar.

## D105 · El presupuesto de contexto vigila también las skills, y con techo POR ENTRADA — 2026-08-24

**La mitad no vigilada pesaba 1,61× la vigilada.** D69 le puso techo, objetivo y guardián a los
cuatro `@`-importados, y este mes bajaron. `.claude/` no tenía ninguna de las tres cosas y se
comportó al revés: **19.884 palabras contra 11.957**, y desde el 08-08 un +233% frente al +34%
de lo vigilado. Las curvas se cruzaron el 2026-08-19, el día del primer `method-review`: ese día
lo vigilado bajó 437 palabras y lo no vigilado subió 6.816.

**Techo POR ENTRADA, no un total**, y no es un detalle de implementación: las nueve entradas no
se cargan nunca a la vez. Una skill se carga ENTERA al dispararse, de una en una y a mano, así
que lo que importa es cuánto cuesta **la más cara**, no cuánto suman todas. La suma se publica
etiquetada como lo que no es.

**El número sale de medir el ruido primero.** Barrido sobre las nueve entradas reales: a 4.500
lo cruza **una**, a 2.500 dos, a 2.000 tres y a 1.500 seis. El criterio escrito en la tarea era
que un techo cruzado por cuatro está mal puesto él, no las skills.

**Y nace en verde**, por la doctrina que el propio script ya tenía: un gate que nace en rojo se
sube hasta que no significa nada. `design-review` mide 6.290, así que el techo nace en 6.400 y el
objetivo —que solo avisa— la nombra en cada corrida. Su retirada es el próximo apretón.

La lista sale **del disco**, nunca de un array: una skill nueva entra en el presupuesto sin que
nadie se acuerde, igual que una página entra en el censo por `PAGE_SLUGS` (D72/D85). Lleva guarda
de cero y su caso malo en `check:guardianes`, que pasa de 17 a 18.

**Lo que este metro no ve, y queda escrito:** las skills de usuario (`~/.claude/skills/`) también
se cargan enteras y no están en el repositorio, así que CI no puede medirlas.

### El trinquete se aprieta por HOLGURA, no por número

El script tenía anotado que su próximo apretón del techo general era a 12.000. **No se hizo**: con
11.957 medidos dejaría 43 palabras de margen, que es exactamente el estado que originó la tarea
—el mismo día, una regla nueva de tres líneas no cupo y hubo que retirar antes para pagarla—. Un
techo que no deja escribir no produce compactación, produce el reflejo de subirlo. Lo que se
sostiene es la holgura: techo a **12.200** (~240 palabras, cinco o seis reglas) y objetivo nuevo
a **11.800**, porque un objetivo ya cumplido deja de tirar.

## D106 · El umbral de una figura es su propio lienzo, y quien lo vigila lee el prerender, no el navegador — 2026-08-24

**11px dentro de un `viewBox` no son 11 píxeles.** Son 11 unidades de dibujo, y lo que llega a
la pantalla es `font-size × (ancho pintado / ancho del viewBox)`. Los siete diagramas del
artículo pintaban su rótulo entre **5,0 y 8,2px a 360** desde que existen. No lo detectó nada
porque cae en el hueco de tres metros a la vez: `viewport-verifier` mira desbordamientos y un
texto pequeño no produce ninguno; axe da `incomplete` sobre `<text>` de SVG (D67) y no mide
tamaño; y el `font-size` **computado dice 11 en todos los viewports**, así que un guardián que
leyera el CSS no vería nada. La escala del `viewBox` no aparece en ninguna de las tres.

**La salida son dos lienzos por figura, no uno elástico** (elegida con `/prototype` entre cuatro
direcciones). Cada diagrama tiene una segunda disposición estrecha de 280 unidades y se conmuta
con una container query: sin JavaScript y sin dejar de ser Server Component. La finalista
—pintar a tamaño natural y desplazar— dejaba tres diagramas por debajo del suelo igual, porque
un rótulo de 9 unidades a escala 1:1 son 9px.

**EL UMBRAL ES EL `viewBox`, NO UN BREAKPOINT, y esa es la decisión de verdad.** Un dibujo de
620 unidades necesita 620px pintados para que su rótulo llegue a 11; uno de 380 necesita 380.
Con un umbral común quedaba un agujero que no se ve probando a 360/768/1536 a ancho completo:
una figura **flotada** (`sm:w-1/2`) en un viewport de 1024 tiene ~437px de contenido, así que
enseñaba el lienzo ancho y pintaba **8,3px**. Por eso el umbral viaja al lado del `viewBox` —de
donde sale— y por eso es container query: lo que decide es el ancho del **panel**, no el de la
ventana. Media columna a 1024 y columna entera a 360 son el mismo hueco.

**Y una container query mide la caja de CONTENIDO**, así que al umbral no se le suma el padding
del panel. Sumárselo —el primer intento— desplazaba los siete umbrales 48px y mandaba al dibujo
de móvil huecos donde el ancho cabía de sobra.

**No era solo de móvil, y esa parte no la pedía la tarea.** Cinco de los siete no llegaban a
11px **ni a 1536**: subrótulos de 9 unidades, un rol de nodo de 10,5, y tres figuras cuyo
`max-w` era **más estrecho que su propio lienzo** —una escala <1 permanente, que ningún viewport
puede arreglar—. De ahí la regla que queda: **el tope de un SVG nunca por debajo de su
`viewBox`**, y es la rotura que prueba el guardián.

**El guardián va en CI, no en el censo**, que es donde la tarea lo suponía por analogía («ya
abre navegador y ya recorre las páginas»). Dos razones, y la segunda pesa más que la primera:
no hace falta navegador —el `viewBox`, el tope, el umbral y el tamaño de cada rótulo están en
el HTML **prerenderizado**, así que son atributos y no resultados de layout—; y del censo habría
heredado **el eje equivocado**, porque mide color en un solo viewport a propósito (D85) y esto
es justo un problema de ancho. `npm run check:figuras` corre en cada PR y cuesta segundos.

**Qué juzga y qué solo nombra.** Un lienzo que **encoge** depende del hueco, y ese se juzga. Uno
que **se desplaza** a ancho fijo —anclado por `min-w` dentro de un `overflow-x-auto`— no: su
ancho no lo decide el hueco, así que la palanca no es estrecharlo sino re-renderizarlo, que en
el artefacto de Emendu (D54) significa otra tipografía de Mermaid y otro layout. Se mide, se
publica su cifra **en cada corrida** y no tumba el gate. Que salga por pantalla siempre es la
mitad de la decisión: sin eso sería un alcance recortado en silencio.

Lo encontró en su primera pasada, y es el argumento de que valía la pena: ese artefacto pinta
sus 44 rótulos a **5,4px**, peor que lo que se acababa de arreglar y desde antes.

**Fuera del contrato, dicho en voz alta:** por debajo de 360 no se juzga, porque el suelo de la
DoD es 360. A 320 los lienzos estrechos pintan 9,7px, y cerrarlo pediría lienzos de 244 unidades
en vez de 280.

**Validado contra el navegador antes de creérselo** (`BRAND.md` §Cómo medir, punto 1): predice
11,2px a 360 y 11,0 / 12,2 a 1280, que es exactamente lo que mide `agent-browser` sobre el sitio
servido. Si deja de cuadrar, el fallo es del script.

---

## D107 · El tablero tiene guardián, y la E/S fuera de CI no deja al criterio sin red — 2026-08-25

**Contexto.** El proyecto ha ido eliminando la segunda fuente de verdad en todas partes: D38
(valores publicados), D59 y D72 (qué páginas hay), D60 (artefactos commiteados). El tablero de
Notion era **lo último que quedaba sin red**, y encima es donde vive el orden en que se hace
todo. El sprint 3 lo demostró dos veces: dos tareas distintas con la prioridad exacta 69,93
—detectado a mano— y un orden de ejecución que se saltó cuatro veces una regla que dice
literalmente «no se salta una tarea de prioridad menor».

**Decisión.** `npm run check:tablero`, con **la E/S y el criterio separados a propósito**:

- **`scripts/tablero/reglas.ts`** es una función pura sobre una lista de tareas. Sin red, sin
  credenciales, sin Notion. Cuatro reglas: prioridades únicas entre las abiertas, ninguna
  abierta sin `Prioridad` ni sin `Área`, los tres estados de ejecución solo en el sprint activo,
  y coherencia de orden entre sprints abiertos a la vez.
- **`scripts/check-tablero.ts`** es la E/S: lee el volcado, normaliza los nombres de propiedad
  de Notion e informa. Corre **fuera de CI**, como `censo` y `psi`, porque leer el tablero
  necesita el MCP de Notion y en un runner headless puede no estar autenticado.

**Por qué partido, que es lo único no obvio.** Un guardián que corre fuera de CI es un guardián
que solo corre si alguien se acuerda, y este repo tiene escrito que eso no es un guardián sino
una nota. La partición compra la mitad que sí se puede vigilar siempre: **las reglas las prueba
`npm test` en CI**, con un caso bueno que tiene que pasar y uno malo por regla que tiene que
rechazar, y `check:guardianes` muerde el criterio con la rotura que lo dejaría ciego al caso que
lo motivó (`grupo.length > 1` → `> 2`, dos tareas con 69,93). Así que el comando puede vivir
fuera de CI sin que su criterio se pudra en silencio.

**Tres detalles que costaron una decisión cada uno.**

1. **El sprint activo no se declara: se deriva.** Una lista de sprints en el script sería otra
   fuente de verdad que puede diferir del tablero, que es justo lo que este guardián combate.
   Sale de dónde están las tareas en ejecución.
2. **El carril de contenido es una excepción explícita.** `CLAUDE.md` dice que el contenido que
   solo escribe Francisco corre **en paralelo y por delante**, para que un sprint no abra
   bloqueado. Sin esa excepción el guardián saldría rojo justo sobre lo que el tablero protege.
   Tiene su propio test.
3. **Un bloque no es una cola.** «Todo lo del sprint activo por delante de los bloques» no se
   puede pedir literalmente: un bloque es un backlog temático y su numeración se entrelaza con
   la del sprint a propósito, porque la deuda se numera donde aparece. La regla de orden solo
   compara **entre etapas que también tienen tareas en ejecución**, o sea entre sprints abiertos
   a la vez. Hoy es vacua, y ese es el estado correcto.

**El volcado no se versiona.** Vive en `scripts/.tablero.json`, ignorado por git: una foto del
tablero dentro del repo sería exactamente la segunda fuente de verdad que esto viene a evitar.
Y **su ausencia no pasa en silencio** —el comando sale con código 1 diciendo qué falta— ni su
vejez tampoco: por encima de doce horas se niega a juzgar, porque un verde sobre una foto vieja
afirma del tablero de hoy algo que no ha mirado.

**Lo que NO puede ver, y hay que saberlo antes de creerse un verde.** El primero de los dos
incumplimientos que lo motivaron —ejecutar P64.5 la séptima, después de P68— **no está en el
tablero**: está en el orden de los commits. Esto comprueba que los números *sean* un orden total
coherente, que es su condición previa, no que alguien lo haya seguido.

**Validado disparándolo, y encontró tres cosas a la primera:** dos pares de prioridades
duplicadas (80 y 81) y cuatro tareas abiertas sin `Área`. Corregidas en Notion el mismo día.

---

## D108 · El desglose por fases del LCP no es una propiedad de la página: es una muestra — 2026-08-25

**Contexto.** P68.62 nació de una cifra: «~81% del LCP móvil es retraso de renderizado». Sobre
ella se probó un candidato (`experimental.inlineCss`), que no movió el LCP y engordó el HTML de
17 a 32 KB en brotli. Antes de reabrirla se midió la premisa, que es lo que faltaba.

**La medición.** Cinco análisis genuinos del mismo despliegue (huella `5b2d0ba5c0ac`), misma URL,
en dos minutos:

| sello | nota | LCP | resource load delay | element render delay |
|---|---|---|---|---|
| 0:32:39 | 97 | 2,3 s | 1628 ms (78%) | **15 ms (1%)** |
| 0:33:22 | 96 | 2,7 s | 652 ms (59%) | **132 ms (12%)** |
| 0:33:41 | 81 | 2,7 s | 126 ms (6%) | **2058 ms (90%)** |
| 0:34:29 | 96 | 2,7 s | 76 ms (25%) | **201 ms (65%)** |
| 0:34:48 | 96 | 2,7 s | 131 ms (37%) | **154 ms (43%)** |

**Decisión.** **A este nivel de rendimiento, el TOTAL se persigue y el REPARTO no.** La mediana
del render delay es **154 ms**, no un segundo; su rango es de **137×** y su cuota del LCP va del
1% al 90%. El resource load delay hace exactamente lo mismo (1628 → 76 ms). Lo único estable en
las cinco es el total: LCP 2,3-2,7 s y nota 96-97, con un 81 aislado que degradó la corrida
entera y no una fase. Así que una tarea de rendimiento **no se abre sobre una fase del desglose**
salvo que su mediana, sobre varias corridas deduplicadas, se sostenga por encima de ese ruido.
Con un perfil de hilo principal sí; con el desglose de PageSpeed, no.

**Y la premisa original era n=1.** El 81% no era una cifra falsa: era **una muestra** de una
distribución que va de punta a punta, leída como si fuera una propiedad. Es la misma familia que
D41 (un umbral mal aplicado inventa hallazgos) trasladada al eje del tiempo: *una muestra tomada
por propiedad inventa trabajo*.

**LA TRAMPA DEL METRO, que casi firma el veredicto contrario.** La API de PageSpeed **devuelve
resultado cacheado**. De las primeras ocho corridas, **seis eran la misma respuesta byte a byte,
con el mismo sello de hora**. Una mediana sobre esas ocho habría dicho «78% de resource load
delay, estable» — un veredicto falso construido sobre una fila copiada seis veces, y encima con
la apariencia de rigor que da la n alta. **Se deduplica por la marca de tiempo del propio
informe**, que `npm run psi` ya imprime. Es la regla 3 de `BRAND.md` aplicada a una API: valida
el metro antes de creerte el hallazgo.

**Relación.** Amplía D49 y D99, que ya sacaron `psi` de CI por su variabilidad; esto dice **qué
parte** de su salida es la variable y por tanto cuál no puede fundar una tarea.

---

## D109 · La lista de excepciones deja de escribirse de memoria: la marca va en el punto de uso — 2026-08-25

**Contexto.** `BRAND.md` §Ningún control se escribe a mano lleva una lista de excepciones
vivas, y era **la única lista del repo que seguía escribiéndose de memoria**. Al derivarla del
disco por primera vez (P68.68) estaba mal por los dos lados: nombraba como excepción el control
sobre imagen del vídeo —que no lo es, sale de `.video-facade` en `globals.css`— y no mencionaba
la que sí lo era, la tarjeta que se pulsa entera, escrita a mano en **tres** sitios.

**Decisión.** `npm run check:excepciones`, en CI, con una marca en el punto de uso:

```
// @fuera-de-capa: <motivo en una línea> (<AAAA-MM-DD>)
```

Pegada al elemento o a la constante que le da las clases, y **sin exigir `//`**: dentro de JSX
no se puede, y la mitad de los sitios donde hace falta piden `{/* … */}`. Una convención que no
se puede escribir donde ocurre la cosa es la regla 1 de `BRAND.md` §Cómo se escribe una regla.

**Va en las dos direcciones**, como todos los guardianes de aquí: (1) todo control fuera de la
capa lleva marca, y (2) toda marca sale nombrada en `BRAND.md`. Con solo la primera, el
documento podría quedarse con excepciones fantasma; con solo la segunda, el código podría
llenarse de controles a mano sin que nadie lo notara.

**LA CALIBRACIÓN FUE EL TRABAJO, no el script.** La primera pasada devolvió 13 hallazgos y
solo cinco eran reales. Tres cortes, cada uno contra un criterio que ya estaba escrito:

1. **Un `<a>` sin decisión de aspecto no es un control escrito a mano.** El enlace del logo del
   nav es `inline-flex items-center no-underline`: no decide nada que la capa tenga que
   resolver. El corte —`hover:` `rounded-` `border` `bg-` `px-`— es el que ya usaba la Fase 1
   de `design-review`, no uno nuevo.
2. **Dos niveles de resolución de identificadores.** Los chips de descarga del Brand Kit son
   `cn(cls, …)` donde `cls` es un ternario entre dos constantes que son quienes llaman a la
   variante. Con un solo nivel salían como escritos a mano.
3. **Y los comentarios no cuentan.** `action.tsx` —el archivo de las variantes— salía como
   incumplidor porque su cabecera *menciona* `<button>`.

**Y el metro no se dio por bueno hasta que reprodujo sus anclajes**, que aquí son las dos
excepciones que `BRAND.md` ya listaba. No las veía **ninguna de las dos**, y por la misma razón:
**el elemento que recibe el clic y el que está pintado no son el mismo nodo**. El switch del
consentimiento pinta en un `<span>` hermano de un `<input class="peer sr-only">`; la píldora del
riel de artículo es un `<span>` dentro del `<a>`. Es **D104 otra vez** —el censo tuvo este mismo
problema con la caja de un hijo— y sin buscar en los descendientes, este guardián habría dado
verde sobre las dos únicas excepciones que el documento nombraba.

**Estado al escribirlo:** 80 controles, 71 salen de la capa, **6 marcados**. Cuatro son
excepciones de verdad; los otros dos son las tarjetas de P74.55, marcadas como **tareadas, no
exentas** — la marca dice qué son, no las absuelve.
## D110 · La fecha que ve Google se escribe a mano, y lo que la sostiene es un sello aparte — 2026-08-25

**Decisión.** `ARTICLE_UPDATED` —el `dateModified` del JSON-LD y el `lastmod` del sitemap—
**se sigue escribiendo a mano**, y lo que impide que se quede atrás es un guardián, no la
disciplina: `check:articulo` sella **el copy del artículo** aparte de sus sellos por sección,
y sale rojo si ese sello se mueve y la constante no.

**El problema medido.** La fecha pasó **doce commits congelada** en el 21 de agosto, entre
ellos un capítulo nuevo, los diagramas partidos por sección y el de CI rehecho. El artículo
se habría lanzado en septiembre anunciándole a Google que no se toca desde hace tres semanas,
justo cuando se quiere que lo reindexe. **No lo vio nadie porque el `ByLine` no pinta fecha**:
no hay forma humana de notarlo mirando la página, solo Google y tarde. Y la regla que lo
impedía estaba escrita **en el comentario de la propia constante**.

**La alternativa que se descartó, y por qué.** Derivarla del último commit que toca el
artículo nunca caduca, pero **cambia lo que la fecha significa**: pasaría de «cambio
sustantivo» a «último toque», y un arreglo de una coma movería el `dateModified`. Google
recomienda lo contrario. Se prefiere conservar el juicio y ponerle una red.

**Lo que hace que el guardián se lea en vez de apagarse: son dos preguntas distintas.** Las
dependencias por sección vigilan **el mundo que el artículo describe** —si se mueve
`DECISIONS.md#D72`, hay que RELEER el texto—; el sello del copy vigila **el texto mismo** —si
se mueve, cambió lo que lee un visitante—. Mezclarlas habría dado un rojo que salta cada vez
que se toca cualquier documento del repo, es decir, un rojo que nadie mira.

**Qué cuenta como contenido, dicho para que no se dé por cubierto:** los dos diccionarios y
las figuras. **No** la carpintería: centrar un riel o arreglar un hover no cambia una palabra
de lo que se lee. Una figura sí, porque un diagrama dice algo.

**Y la salida para lo no sustantivo no es una puerta trasera.** `npm run articulo:sellar` sin
tocar la fecha deja **una línea en el diff que alguien firma** en la revisión. La diferencia
con lo de antes es que ahora es una decisión y no un olvido.

**Validado disparándolo** (P54.9): con una palabra cambiada en el copy y la fecha quieta, CI
sale rojo con las dos salidas impresas; restaurada la palabra, verde. Su caso malo entra en
`check:guardianes`, y tampoco es inventado: es el estado real de esos doce commits. El
informe dice además **qué fecha ha comprobado**, que es la regla de esta casa desde D57.

## D111 · Lo que el lector de pantalla cambió en el marco de toda página — 2026-08-25

**Decisión.** Tres cambios en la carpintería que comparten las catorce páginas, salidos de la
pasada manual con NVDA (D73) y no de ninguna herramienta: **la barra de navegación es un
landmark con nombre**, **el aviso de consentimiento vive al principio del `<body>` y se anuncia
al aparecer**, y **el ordinal de sección entra en el nombre accesible del titular**. Ninguno de
los tres incumplía WCAG. Son decisiones, y por eso están aquí y no en un commit.

**Por qué juntos.** Los cinco hallazgos de la pasada eran de dos clases. Dos eran defectos con
arreglo obvio y sin decisión detrás —`Esc` no cerraba el menú móvil, el botón de tema no decía
en qué tema estabas— y se cierran en su mensaje de commit. Los otros tres cambian el marco que
hereda toda página, así que cambian el sitio entero: eso es lo que este archivo registra.

**1. La barra es navegación, y el comentario que decía lo contrario era el problema.**
`nav.tsx` justificaba el `<div>` así: «no es navegación de sitio, evita un segundo landmark de
navegación sin nombre único». El razonamiento tenía dos huecos, y es lo único que justifica
reabrir una decisión ya tomada. Primero, **`<nav aria-label>` da landmark y nombre único a la
vez**, así que la pega que evitaba no existía. Segundo, la premisa era falsa: el logo lleva a
Inicio y «Sobre mí» y «Contacto» llevan a sus páginas. En la práctica, quien pulsaba `D`
buscando la navegación **no la encontraba en la home**: el único «navegación» que sonaba era el
del pie, que además era **el único `<nav>` anónimo del sitio** (en una página interna convive
con «Ruta» y con «Del mismo sistema»).

El `<nav>` envuelve el logo, el grupo de controles y el panel del menú. **El toggle de tema
queda dentro sin ser navegación:** es el coste de que la barra sea un landmark en vez de dos, y
se paga a propósito.

**2. El consentimiento deja de ser lo último del documento, y se anuncia.** Su region salía
**después de `contentinfo`**: quien ve el aviso se lo encuentra sobre el contenido al cargar, y
quien usa lector recorría las diez secciones de la home y el pie entero antes de enterarse de
que existe. No hay criterio WCAG que obligue a anunciar un banner, pero **es un mecanismo de
consentimiento con peso legal** y la misma elección no puede presentarse de inmediato a unos y
de facto la última a otros.

Se hacen **las dos cosas, y no una**, porque arreglan mitades distintas: mover el nodo ordena la
lectura pero no avisa a quien ya está leyendo; anunciar avisa pero deja el aviso al final para
quien recorre la página. Y mover resultó **más barato de lo que la tarea suponía**: la franja
nace en un efecto (`localStorage` no existe en SSR), así que en el HTML prerenderizado solo se
mueven el `<dialog>` cerrado y un envoltorio vacío.

**La live region es el envoltorio, no la franja**, y esto es lo reutilizable: una live region
tiene que existir en el DOM **antes** de que le entre contenido, y la franja se inserta ya
poblada. La franja conserva su `role="region"` con nombre, porque anunciar y ser punto de
navegación son dos cosas distintas. Va **detrás del enlace de salto**, que sigue siendo el
primer elemento focalizable (D46, WCAG 2.4.1): con el aviso abierto, el segundo es su primer
botón, que es exactamente lo que ve quien mira la pantalla.

**3. El ordinal entra en el nombre accesible del titular, y D43 sigue en pie.** D43 fija que el
ordinal va **dentro del eyebrow**, y el eyebrow es un `<p>` anterior al titular. Navegar con `H`
—que es como se recorre una página larga con lector— salta de encabezado en encabezado y **se
lleva solo el titular**: se oye «WCAG 2.2 AA cumplido, con el contraste medido» y el «01» no
suena nunca. No era un defecto: el titular solo es una afirmación completa, que es la intención
de D43. Lo que estaba en duda era si el ordinal es decoración o orientación, y quien lo ha oído
dice que orienta. Así que entra en el **nombre**, no en la pantalla.

**Se deriva del eyebrow, no se pide por prop.** El formato ya existe y es uno solo (`NN —
Etiqueta`) en las tres familias numeradas: las dieciséis secciones del Design System, las seis
del Brand Kit y las cinco de Accesibilidad. Pedirlo por prop obligaría a **escribir el número
otra vez en treinta call sites**, que es la copia que la capa de cabecera existe para evitar.
La portada de sección del artículo es la excepción y no por caso especial: **ya recibe el
ordinal suelto**, así que usa el que tiene en vez de deducirlo.

**Y va sin la raya**, no por la regla del copy —que mira el texto servido— sino porque **aquí se
oye**: el anuncio de ese signo depende del nivel de puntuación configurado en el lector. El
punto no lo pronuncia ninguno y sí produce la pausa que separa el ordinal del titular.

**Lo que esto no cierra.** La comprobación **de oído** con NVDA, que es la única capa capaz de
juzgar si los tres cambios suenan como se pretendía y que ningún gate puede sustituir. Y la
página que publica los hallazgos: su nota decía que los cuatro detalles estaban «anotados y
pendientes», y esa frase se corrige en el mismo lote, porque una página que documenta el sistema
no puede quedarse contando un estado que el propio lote acaba de cambiar (D84).

## D112 · Un guardián que hashea una carpeta se estrecha en silencio cuando un archivo se va — 2026-08-25

**Decisión.** Lo que el sello del copy del artículo vigila **se nombra archivo a archivo cuando
sale de su carpeta**, y no se da por cubierto por la ruta antigua. En concreto, `shared.tsx`
—el rótulo y el conmutador de lienzos de los diagramas— vive desde hoy en
`components/site/diagrams/` y entra en `FUENTES_DEL_COPY` por su nombre.

**Cómo apareció.** `/accesibilidad` estrenó diagrama (P70.101) y con él una segunda página que
dibuja. `shared.tsx` colgaba de `como-se-ha-creado-diagrams/`, así que la alternativa a moverlo
era que **la página de accesibilidad importara de la del artículo**. Se movió, ocho imports
cambiaron de línea, y el HTML del artículo salió **idéntico byte a byte salvo el build ID**.
Un refactor limpio.

**Y el refactor limpio rompió una vigilancia sin que nada saliera en rojo por el motivo bueno.**
`FUENTES_DEL_COPY` (D110) hashea **la carpeta** de figuras, no una lista de archivos. Al salir
`shared.tsx`, el sello dejó de verlo: a partir de ahí, cambiar `LBL` de 11px a 12px habría
redibujado **las ocho figuras del artículo** sin mover el `dateModified` que ve Google. CI sí
salió rojo, pero por el hash de la carpeta cambiando —el síntoma correcto por la razón
equivocada—, y la salida cómoda era resellar y seguir.

**La forma del fallo, que es lo reutilizable.** Un guardián que se define por CONTINENTE
—una carpeta, un glob, un prefijo— hereda el alcance de una decisión de organización que nadie
tomó pensando en él. Mover un archivo es la operación más inocente que existe y aquí recortó
una promesa a Google. Es la familia de D57/D60/D63 vista del revés: allí el peligro era un metro
que devuelve lista vacía, y aquí es un metro que **sigue devolviendo una lista, más corta**.

**Lo que no se hizo, y por qué.** Sellar la carpeta nueva entera habría sido más cómodo y está
mal: dentro vive el diagrama de `/accesibilidad`, que no es copy del artículo, y movería su
`dateModified` sin que cambiara una palabra de lo que se lee. La precisión del alcance es justo
lo que hace que el guardián se mire en vez de apagarse (D110).

**Lo que queda abierto.** Nada obliga todavía a que un archivo que sale de una carpeta vigilada
se declare en su nueva ruta: esta vez lo cazó estar mirando. La red que lo haría automático es
la de P68.705 (el guardián de `/accesibilidad`) generalizada, o una comprobación de que toda
fuente del sello existe y ninguna figura queda fuera de él.

## D113 · La premisa de una capa caduca cuando aparece el segundo consumidor — 2026-08-25

**Decisión.** `LiveStat` sale de la capa de artículo a `components/ui/live-stat.tsx`, como
**primitiva** y no como pieza de núcleo. Las otras siete de D76 se quedan donde están.

**Por qué solo esa.** D76 dejó la capa de artículo fuera del núcleo con un argumento que era
bueno: resolvía «un FORMATO, el de texto largo con paradas, que hoy solo tiene una página». Y
seis de sus piezas lo cumplen sin discusión — portada de capítulo, cita que para la lectura,
índice con tiempo por sección, transición entre paradas, la regleta de enlace al repo, el marco
de un diagrama. `LiveStat` no: lo que resuelve es **«esta cifra no se escribe a mano, se enlaza
a quien la publica»**, que es D38 con forma de bloque y no tiene nada que ver con el largo del
texto. Estaba en esa capa **por vecindad**, porque el artículo fue quien la necesitó primero.

**Lo que lo puso en evidencia fue un segundo consumidor.** La sección de herencia de
`/accesibilidad` (P70.101) afirma que los controles salen de una capa común, y quería enseñar
cuántas piezas tiene el sistema sin teclear el número. La alternativa a mover la pieza era que
**una página que no es el artículo importara de `ui/article.tsx`**, y eso no es un detalle de
importación: es la página de accesibilidad declarando que depende del formato de texto largo.

**Y NO ES NÚCLEO, aunque la tarea lo dijera.** El vocabulario de `components/ui/README.md` tiene
tres grupos y no son la misma cifra mal contada: el **núcleo** son los ocho EJES del sistema —el
control, el enlace de nav, la etiqueta, la cabecera, el campo, la tabla, la fila de cifras y las
cajas—, la **capa de artículo** es un formato, y las **primitivas** son bloques sueltos.
`LiveStat` es lo tercero, del mismo grupo que `info-card.tsx`. Subirlo al núcleo habría hecho
nueve una cifra que significa otra cosa, y `PRD-Live.md` la publica. **La mudanza no cambia su
rango: cambia de qué depende.**

**La forma del error, que es lo reutilizable.** La premisa de una capa —«esto solo lo usa X»—
es un hecho sobre el presente, no una propiedad de la pieza, y **caduca en silencio**: nada
falla el día que deja de ser cierta. Lo único que la revisa es que aparezca un segundo
consumidor y alguien se pregunte por qué tiene que importar de casa ajena. Es la misma familia
que D112, de ayer mismo: allí un guardián heredó el alcance de una carpeta, aquí una pieza
heredó el alcance de su vecina.

**Validado con el gate que existe para esto.** `npm run gate:html -- save` con el árbol limpio,
la extracción, y `npm run gate:html` después: **sin cambios en el HTML de las 28 variantes**.
Conviene decir cómo NO se comprueba, porque costó un rodeo: comparar a mano los `.html`
prerenderizados da 26 de 26 distintos, porque extraer un módulo mueve los identificadores del
payload RSC. Eso es exactamente el ruido que el gate normaliza y el motivo por el que existe.

## D114 · El lienzo de un diagrama es la única cifra que declara, y la capa deriva el resto — 2026-08-25

**Decisión.** `DosLienzos` (`components/site/diagrams/shared.tsx`) construye los dos `<svg>` de
un diagrama. Un diagrama declara **el ancho de su lienzo ancho una sola vez**, y de una tabla
salen su tope (`max-w-[Npx]`) y el umbral de la container query que conmuta al dibujo estrecho
(el lienzo +10). El lienzo estrecho —280 unidades, tope 300— es constante de la capa y ningún
diagrama lo escribe. El `aria-label` también se pasa una vez, y la capa lo pone en los dos.

**El problema no era el rótulo pequeño: era que el mismo número vivía en tres sitios.** Cada
diagrama lo escribía en su `viewBox`, en su `max-w-[Npx]` y, con un +10, en el `umbral` que
pasaba a `DosLienzos`. Tres copias sin nada que las atara, así que la pregunta no era si iban a
desviarse sino cuándo. Ya lo habían hecho tres veces por tres caminos distintos, y la tercera
seguía viva al escribir esto: `s07` tenía lienzo de 560 con tope de 620, copiado de otro
diagrama, así que pintaba esa figura un 10% más grande de como está dibujada. **Ningún gate
podía verlo**, porque `check:figuras` mide a 360, donde manda el otro lienzo.

**Y ese es el argumento de fondo: un gate mide DESPUÉS, una capa impide ANTES.** `check:figuras`
nació en P68.59 midiendo el rótulo pintado, y siguió siendo la única red durante dos sprints:
había algo que avisaba cuando el rótulo ya no se leía y nada que garantizara que se leyera. Con
la tabla, un ancho que no esté en ella es un **error de compilación**, no un rótulo de 5px en
producción. El gate sigue en CI y pasa de red a confirmación.

**Las clases de la tabla son literales, y no es estilo.** Tailwind escanea el código como texto
plano: una clase construida por interpolación no se genera y el elemento se queda sin regla, sin
error de compilación (`BRAND.md` §Cómo medir, punto 5). Por eso la tabla escribe cada clase
entera en vez de componerla con el número.

**Dónde vive un diagrama, que es la otra mitad.** En la carpeta de su página mientras solo esa
página lo use, y **se muda a `components/site/diagrams/` en cuanto haya una segunda**. Es la
misma pregunta que separa `ui/` de `site/`. Lo disparó `/accesibilidad` queriendo reusar el
diagrama de capas de verificación del artículo (P70.104): repetirlo habría dado dos dibujos del
mismo sitio contando lo mismo con cifras distintas.

**Y al mudarlo hay que nombrarlo en `FUENTES_DEL_COPY`** (`scripts/articulo/huella.ts`). El
sello del copy hashea la CARPETA del artículo, así que sacar un archivo de ahí lo saca del hash
sin que nada proteste: la figura podría cambiar y el `dateModified` que el sitio le promete a
Google quedarse quieto. Es **D112 otra vez**, el mismo fallo que tuvo `shared.tsx` el mismo día
y unas horas antes. Se comprueba disparándolo: con el sello en verde, se toca la figura movida y
`check:articulo` tiene que salir rojo.

**Validado con `gate:html`,** línea base capturada del estado anterior. El diff sobre las 28
variantes es exactamente las tres desviaciones que el refactor existe para quitar y nada más:
cuatro `@max-[545px]` → `@max-[550px]` (los dos lienzos de 540, que llevaban +5 en vez de +10) y
dos `max-w-[620px]` → `max-w-[560px]` (el de `s07`). `check:figuras` después: 36 lienzos, 332
rótulos, ninguno por debajo de 11px.

**Lo que la capa NO cubre, y conviene no prometerlo.** Un lienzo de ancho fijo que se desplaza en
horizontal —el artefacto de Emendu— no lo arregla ningún umbral, y `check:figuras` ya declara que
se abstiene ahí. Ese caso pide re-renderizar el dibujo, no ajustar una cifra.

---

## D115 · El suelo de ancho del sitio es 320, y 280 queda fuera con su motivo escrito — 2026-08-25

**Contexto.** Cerrar D93 dejó una pregunta abierta que se tareó aparte (P70.13) en vez de alargar
aquella tarea, y con razón: **no es el mismo problema**. Lo que D93 arregló era **carpintería de
ancho fijo** —el nav pedía 349px pasara lo que pasara— y la palanca fue soltar una pieza. Lo que
queda no tiene ninguna pieza de ancho fijo detrás.

**Lo medido, sobre el sitio servido (2026-08-22).** A **320 y a 360 las páginas están limpias en
ES y EN**. A **280px** —la pantalla exterior del Galaxy Fold plegado— quedaban tres:

```
/cookies         +29px   DIV clientW=240 scrollW=289   «preferencias»
/accesibilidad    +9px   H1  clientW=240 scrollW=269   «Accesibilidad»
/en               +5px   DIV clientW=240 scrollW=246   «(01)EmenduStrategic»
```

**Y ahí no hay nada que soltar: son palabras que no caben.** El `h1` «Accesibilidad» son trece
caracteres que a tamaño de display piden 269px él solo, contra una columna de 240. Así que la
única palanca es **la escala tipográfica por debajo de 320**, y eso es una decisión de diseño.

**Decisión — 280 queda fuera del contrato, y el suelo del sitio es 320.** Tres razones, en orden
de peso:

1. **A quién dejaría fuera.** 280 es la pantalla **exterior** de un Galaxy Fold plegado, que es un
   modo de uso de vistazo, no de lectura. Los iPhone modernos empiezan en 375 y el SE de 1.ª y
   2.ª generación es 320 — **ese ya está cubierto y medido limpio**.
2. **Lo que costaría cada palanca, que es más de lo que arregla.** `hyphens: auto` es una línea y
   partiría «Ac-ce-si-bi-li-dad» en español de verdad (el `lang` ya lo pone el locale), pero
   afecta a **todo el sitio en todos los anchos**, no solo por debajo de 320: cambiaría el ritmo
   de párrafo de las catorce páginas para arreglar tres desbordes en un ancho que nadie pide. Un
   escalón más en el `clamp()` de los titulares es más control y menos efecto colateral, pero
   añade un breakpoint que hay que mantener y es una decisión con varias direcciones posibles
   —o sea, `/prototype` antes de escribir nada—.
3. **Coincide con el suelo que el proyecto ya tenía escrito en otro sitio.** El punto 11 de la
   Definition of Done mide el rótulo de una figura **a 360**, y `check:figuras` ya declara en voz
   alta que por debajo de eso no juzga. Esta entrada no inventa un umbral: le pone número y
   motivo al que ya se estaba aplicando.

**La matriz del `viewport-verifier` se queda en 320** y no gana un ancho más. Añadir 280 sería
declarar un contrato que esta misma decisión dice que no se persigue, y un gate que mide algo que
nadie va a arreglar solo produce ruido que hay que ignorar en cada corrida — que es cómo un
informe deja de leerse.

**Qué reabriría esto**, dicho para que no haga falta volver a razonarlo: **tráfico medido** en esa
franja. Hoy la decisión se toma sobre catálogo de dispositivos, no sobre GA4, porque con la
audiencia actual (§Métricas) ese corte no tendría ni una sesión con la que decidir. Si algún día
la tiene, la palanca a evaluar es el `clamp()`, no `hyphens`: el efecto colateral acotado vale
más que la línea barata.

**Esta es la forma de cierre que la propia tarea contemplaba** —«puede que la respuesta legítima
sea descartarla con su motivo escrito»— y no un recorte de alcance silencioso, que es lo que
`BRAND.md` §Cómo se escribe una regla nombra como antipatrón: lo que no se persigue se dice.

---

## D116 · Los nombres propios no se marcan en el copy: los marca la capa que lo pinta — 2026-08-25

**Contexto.** El sitio tiene **216 apariciones de marcas propias** repartidas entre veinte
diccionarios y siete componentes —TheTool, Emendu, INDYA, Freepik, PICKASO, KUOTIP,
AppRadar…— y **cero** `translate="no"` en todo el repo. Chrome le ofrece al visitante traducir
la página, y en una web **bilingüe** eso ocurre de verdad: alguien abre `/en` y el navegador le
propone el español. El traductor no distingue un nombre propio de una palabra, así que
«TheTool» se convierte en «La Herramienta», «AppRadar» en «Radar de aplicaciones» y «Miss
Conversion» en «Señorita Conversión». El argumento entero del sitio son esos nombres: un
recruiter que busque «TheTool» en la página traducida no lo encuentra.

**Las dos opciones obvias, y por qué ninguna.**

- **Un token en el markup del diccionario** (`{{TheTool}}`, que `Rich` aprendería a
  renderizar). Son **~130 ediciones de copy** entre ES y EN, y deja el problema abierto por el
  lado que importa: **el copy que se escriba mañana nace sin el token**, y nada lo detecta.
- **`translate="no"` en contenedores enteros.** Una línea por bloque, pero `translate` **se
  hereda**: apaga la traducción de toda la prosa de ese bloque, no solo del nombre. En una web
  cuyo argumento son esos textos, deja al visitante sin traducir justo los párrafos que quiere
  leer. Es cambiar un fallo por otro peor.

**Decisión — el copy no se toca; lo marca la capa que lo pinta.**
`components/ui/marcas.tsx` declara **una vez** qué cadenas son nombres propios y envuelve cada
aparición en `<span translate="no">`. Es la misma forma que este repo ya usa para el atenuado
(D39) y para el contorno de un control (D97): **no se elige en el punto de uso, lo resuelve la
capa**.

**Y los nombres de empresa salen de `EXPERIENCES`, no de una lista nueva.** Ese registro ya es
la fuente única de qué experiencias existen —su logo y su slug se unen por `company`—, así que
una experiencia nueva entra aquí sola. Un segundo listado se habría desincronizado igual que se
desincronizaban los logos antes de que ese registro existiera. Los ocho que no están en ningún
registro (quien compró TheTool, la formación y las agencias de Marketing & Growth) se escriben
con su motivo al lado: no son experiencias, no hay dato del que derivarlos, y **un registro de
una sola columna para ocho cadenas sería peor**.

**Dónde se engancha, que es lo que convierte 216 sitios en seis.** Dos puntos de paso que ya
existían:

- **`Rich`** (D23), en sus **cuatro** salidas y no solo en el texto llano: un «TheTool» en
  negrita o dentro de la etiqueta de un enlace es igual de traducible, y es justo donde se
  habría escapado. Cubre la prosa del diccionario de los cinco deep-dives, Sobre mí, Cookies,
  Accesibilidad y el artículo.
- **`SectionHeader`** (D43), por donde pasa **toda cabecera del sitio** — el `h1` de cada
  página y cada titular de sección.

Lo demás son los nombres que vienen de un **dato** y no de la prosa: hitos, la fila de
Trayectoria, su índice, formación, el cierre de página, el breadcrumb y el espécimen
tipográfico del Design System. **Cero ediciones de diccionario.**

**Y como no se elige en el punto de uso, hay que vigilar que LLEGA: `npm run check:marcas`.**
Los dos helpers son **opt-in**: una página que pinte un nombre sin pasar por ellos compila
igual, pasa el typecheck y publica el nombre suelto. El guardián recorre el HTML
**prerenderizado** de las 28 variantes y, por cada nodo de TEXTO donde encuentra un nombre,
exige un ancestro con `translate="no"`. **Busca la ausencia, no el patrón** —contar cuántos
`translate` hay sube en verde mientras el que falta sigue faltando— y publica cuántas variantes
ha leído y cuántas apariciones ha inspeccionado. Va en CI detrás del build, con `check:marco` y
`check:figuras`, porque todo lo que necesita está en el prerender: un atributo heredado y un
nodo de texto, sin layout que resolver ni color que pintar.

**No es ceremonia: encontró tres call sites que la lista escrita a mano no tenía** —el
breadcrumb, el cierre de página y el índice de Trayectoria—. Hoy: **168 apariciones de 16
nombres, todas marcadas**, en 28 variantes.

**Lo que queda fuera del contrato, dicho en cada corrida en vez de callado:**

- **El `<head>`.** El `<title>` y la `description` llevan nombres y Chrome también los traduce,
  pero ahí no cabe un `<span>`: son texto plano por contrato. No es un descuido, es que el
  arreglo no existe en esa capa.
- **Los atributos** (`alt`, `aria-label`). Mismo motivo.
- **El texto dentro de un `<svg>`** — seis apariciones, nombradas una a una. `translate` es un
  atributo global de **HTML** y SVG no lo define, así que marcarlo ahí sería escribir algo que
  el navegador no promete respetar.

Callar cualquiera de los tres sería el alcance recortado en silencio que `BRAND.md` §Cómo se
escribe una regla nombra como antipatrón: un informe que no dice qué no mira se lee como
cobertura.

**El caso malo del meta-guardián caducó el mismo día, y también es la decisión.** El de
`check:excepciones` mordía `page-closer.tsx` quitándole su marca `@fuera-de-capa`; P70.15 sacó
esa tarjeta a la variante `card`, el archivo se quedó sin marca que quitar, y la mutación pasó
a **no mutar nada** — o sea, a puntuar como verde. Lo cazó `check:guardianes` en CI, en el
mismo PR que lo rompió, que es exactamente para lo que existe (D70). La lección, escrita en el
propio caso: **al elegir el archivo de un caso malo, prefiere el que NO está tareado para
moverse.**

## D117 · Un vocabulario de dos valores no puede distinguir la deuda del criterio — 2026-08-26

**El hueco.** D89 hizo que cada pieza de `components/ui/` declarara dónde se publica, en una
línea de su propia cabecera, y que `check:indices` lo comprobara contra la sección. El campo
admitía **dos** valores: una ruta bajo `components/site/`, o el literal `pendiente`.

Con dos valores no había forma de decir «esta pieza **no** se publica, y este es el motivo».
`rich.tsx` —el render de markup del diccionario— no tiene aspecto propio que enseñar, y
`marcas.tsx` no pinta nada en absoluto: envuelve nombres propios en un atributo invisible, así
que una sección del Design System que la enseñara mostraría un texto idéntico al de al lado.
Las dos iban a salir como deuda **para siempre**, o había que escribirles una sección falsa
para que el contador quedara a cero.

Eso último es el fallo de verdad, y no es de vocabulario: **es el metro mandando sobre el
criterio en vez de al revés.** Un contador que solo puede bajar publicando empuja a publicar.

**La decisión.** Un tercer valor, `interna`, y el recuento que los separa: *«N publicadas · N
internas · N pendientes»*. `pendiente` vuelve a significar UNA sola cosa —deuda: se va a
publicar y todavía no— e `interna` significa una decisión tomada. La condición que decide cuál
toca es la misma que la del Design System entero: **la página enseña las piezas reales como
demo**, así que una pieza que no pinta nada no tiene demo posible.

**Y el motivo pasa a ser un DATO, no un comentario.** Las dos listas
(`SIN_PUBLICAR`, `INTERNAS`) son `Record<archivo, motivo>` en vez de arrays, por dos razones
que se refuerzan:

- **Se deriva al inventario.** Quien contesta el paso 1 de la «Regla de construcción» lee en
  `components/ui/README.md` por qué esa pieza no tiene sección, sin abrir `scripts/indices.ts`.
- **Muere una duplicación.** El array llevaba encima un bloque de comentario que repetía la
  lista con sus motivos, y ya era la misma cosa escrita dos veces dentro del mismo archivo —
  exactamente lo que avisa la regla 5 de `BRAND.md` §Cómo se escribe una regla.

`check:indices` exige el motivo en los dos casos y comprueba las dos direcciones: una pieza que
declara `pendiente` o `interna` sin estar en su lista falla, y una entrada de lista cuya pieza
ya no lo declara también. Añadir una línea sigue siendo un acto visible en el diff, que es lo
que nunca fue «se me olvidó publicarla».

**Lo que se llevó por delante.** `SIN_PUBLICAR` quedó **vacía**, y eso es el estado bueno y no
un metro roto: la guarda de cero de `check:indices` mira los ARCHIVOS de la carpeta, que nunca
son cero. Las tres que sí lo merecían se publicaron el mismo día —`video-embed` en §18,
`info-card` y `page-closer` en §17—, así que el sitio pasa de dieciséis secciones de Design
System a dieciocho.

**Lo que se decidió NO arreglar, y queda por escrito.** `live-stat.tsx` es una **primitiva** y
se demuestra dentro de §15, que se llama «Artículo largo». Grupo y sección de publicación son
**ejes independientes**: el grupo dice de qué capa es la pieza; la publicación, dónde se la ve
funcionando. Forzarlos a concordar movería especímenes buenos a secciones donde no ilustran
nada. Está escrito en la cabecera de `scripts/indices.ts`, que es donde se lee al tocarlo.

## D118 · El `srcset` de `next/image` no baja de `deviceSizes[0]` cuando el `sizes` lleva un `vw` — 2026-08-26

**El síntoma.** `psi --registro` marcaba «Improve image delivery» en dos páginas, y las dos
fotos de «Sobre mí» se servían a **640px dentro de una caja de 382**. El `sizes` de esas fotos
ya declaraba `384px` para escritorio, así que la explicación obvia —«falta el `sizes`»— era
falsa. Leerlo no bastaba: hubo que mirar el `srcset` servido, y **empezaba en 640w**. No es que
el navegador eligiera mal; es que **el candidato correcto no existía**.

**La causa, que está en el propio `next/image`.** Cuando el `sizes` contiene ALGÚN valor en
`vw` —el de estas fotos lleva `100vw` para el móvil—, `getWidths()` descarta del `srcset` todo
candidato por debajo de `deviceSizes[0] × el vw más pequeño`. Con el reparto por defecto eso
son **640**, y ahí se quedan fuera los `imageSizes` enteros: se concatenan, pero caen dentro
del mismo filtro. O sea que `imageSizes` **no** es la palanca aunque su documentación sugiera
lo contrario; la palanca es bajar el suelo de `deviceSizes`.

**La decisión.** `deviceSizes: [384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840]`, con
`imageSizes` recortado a `[32, 48, 64, 96, 128, 256]` para respetar el invariante que pide la
doc (todos menores que el menor `deviceSize`). **No quita ningún ancho: solo añade uno por
debajo**, así que ninguna imagen del sitio puede empeorar — como mucho, pedir menos. Verificado
en home, deep-dive y artículo: los logos siguen en `w=48` y el hero en 640 para su caja de 433.

**Medido**, a 1440 y DPR 1:

| | antes | después |
|---|---|---|
| `francisco-reposteria-4x5` | 640w · 44.248 B | 384w · 20.572 B |
| `francisco-montana-4x5` | 640w · 36.464 B | 384w · 19.874 B |

**39,3 KiB**, contra los 21 que estimaba la tarea.

**LA MITAD MÓVIL, CERRADA EL 2026-08-29 — y la premisa con la que se tareó era falsa.** Esta
entrada decía que en móvil el navegador pide ~1080w «para esa misma caja (412 CSS px × DPR
2,625)». El móvil de referencia de Lighthouse es 412×823 con **DPR 1,75**, no 2,625, y se lee en
`configSettings.screenEmulation` de su propio informe. Con la cifra buena el navegador no pide
1080: pide **750** para una caja que necesita **645**, o sea 25,7% de píxeles de más y 13,6 KiB.

Y las causas eran dos, no una:

- **El `sizes` declaraba más de lo que se pinta.** Decía `100vw`, pero la caja vive dentro de
  `WRAP`: a 412px de viewport se pinta a **369**, no a 412, porque el gutter es `--page-x`
  —`clamp(1.25rem, 5vw, 2.5rem)`— a los dos lados. Pasa a `(max-width: 767px) 90vw, 384px`.
- **El reparto no tiene nada entre 640 y 750.** Esa caja mide 384 CSS px como mucho
  (`max-w-[24rem]`), y en el móvil de referencia son **672 píxeles reales exactos**. Se añade el
  672 — el mismo lever de arriba un peldaño más arriba, con la misma garantía de que solo añade.

**Y el `sizes` por sí solo no movía la aguja**, que es lo que hace falta saber para no volver a
intentarlo: 412 × 1,75 = 721 y 369 × 1,75 = 649 **caen los dos entre 640 y 750**, así que el
navegador se bajaba 750 en los dos casos. Hacía falta el peldaño. *Un `sizes` correcto no
arregla lo que la escalera no puede servir.*

| | antes (w=750) | después (w=672) |
|---|---|---|
| `francisco-reposteria-4x5` | 52.926 B | **47.096 B** |
| `francisco-montana-4x5` | 43.856 B | 38.310 B |

`uses-responsive-images` pasa de **0,5 · 13,6 KiB** a **1 · sin ahorro**. Reparto final:
`[384, 640, 672, 750, 828, 1080, 1200, 1920, 2048, 3840]`.

**Y el metro no fue `psi`, que corre contra producción y solo da la nota:** fue **Lighthouse por
`npx` contra el build servido en local**, con `--only-audits` y leyendo `details.items` —`url`,
`totalBytes`, `wastedBytes`, el `boundingRect` pintado—. Lanza su propio Chrome con perfil
nuevo, así que **no arrastra la caché de imágenes**, que es justo la trampa del párrafo de
abajo.

**La trampa de medirlo, que costó una lectura falsa.** Chrome **nunca baja a un candidato más
pequeño si ya tiene uno grande en caché**, y `location.reload(true)` no lo evita: está obsoleto
y se ignora. Con la pestaña caliente, el arreglo parecía no hacer nada. Solo cerrando el
navegador entero se ve el `384w`. Es «valida el metro antes de creerte el hallazgo»
(`BRAND.md` §Cómo medir, 3) aplicado a la caché.

## D119 · Una descarga que conmuta con el tema está adivinando, y la mitad de sus anclas no existe — 2026-08-26

**El síntoma, y por qué nadie lo vio en año y medio.** El Brand Kit ofrecía **49 anclas de
descarga** en una página, y de ellas **20 estaban siempre en `display:none`**. La causa era
`DlThemed`, en `components/site/brand-kit/shared.tsx`: para dar la tinta correcta sin JS
dibujaba **dos** `<a>` por descarga, uno con `dark:hidden` y otro con `hidden dark:inline-flex`.
Elegante en apariencia y roto en el fondo, porque **la tinta la decidía el tema del sitio**.

Un ancla en `display:none` no se pulsa, no recibe foco y **no está en el árbol de
accesibilidad**. Así que para bajarte el logo de tinta oscura estando en tema oscuro había que
**cambiar el tema de la web**, y nada lo decía. La ficha de la tarea llevaba meses planteada
como un problema de densidad («49 chips es demasiado»); el defecto de verdad apareció al
**medirlo sobre la página servida**, contando anclas alcanzables en vez de leer el JSX.

Y son cosas independientes: **se puede leer en oscuro y estar montando un dossier en blanco**.
El sitio estaba infiriendo una preferencia de salida a partir de una preferencia de lectura.

**Lo que se descartó, que es donde está el aprendizaje.** La reparación evidente era que
`DlThemed` dejara de duplicar el nodo. No se puede: **estas no son ilustraciones que se pintan
en la página, son archivos que se descargan**. `currentColor` no sirve —un SVG con
`currentColor` abierto fuera de la página se pinta negro; verificado con `diff`, los dos
archivos difieren exactamente en un hex— y **el CSS no puede cambiar un `href`**. Las salidas
eran una isla que leyera el tema en el clic, que cambia 20 descargas estáticas por 20 que
dependen de JS y rompe el «guardar enlace como», o dejar de conmutar.

Y hay un corolario que decide el diseño entero: **cualquier descarga individual reintroduce la
pregunta de la tinta, sin excepción parcial**. Se estudió dejar un escape solo para el SVG, que
es la pieza canónica y pesa 383 bytes, y no vale: el SVG también tiene dos tintas.

**La decisión: la tarjeta da la pieza canónica, el kit da las variaciones.** Un SVG suelto por
tarjeta que **anuncia su tinta** («El SVG suelto va en tinta oscura»), y los tres tamaños de
PNG y la segunda tinta dentro de un ZIP con todo. De **49 anclas a 8**, todas alcanzables, en
cualquier tema, sin JS. Sigue habiendo un valor por defecto, pero deja de ser un secreto: la
diferencia entera entre esto y lo anterior es que ahora **se dice**.

De paso caen cuatro anclas que eran **URLs repetidas**: el panel de OG en `05-aplicaciones.tsx`
volvía a ofrecer el SVG y el PNG 1024 del lockup split que ya ofrecía su tarjeta en la 02.

**El ZIP se genera en el BUILD y no se commitea.** `app/api/kit/route.ts` con
`dynamic = "force-static"`: Next lo ejecuta una vez al construir leyendo `public/logo-kit/` y
sirve el resultado como asset estático. La propiedad que se compra es la que importa: **no
puede quedarse viejo por construcción**. Nada de binario de 642 KB en git recommiteado entero
en cada cambio, ningún `npm run` que recordar, y **ningún guardián para una desincronización
que aquí no puede ocurrir**. Va bajo `/api/` porque el matcher de `proxy.ts` excluye ese
prefijo; fuera de él habría que tocar el proxy.

El contenedor lo escribe `lib/zip.ts`, 90 líneas, **sin dependencia nueva**: Node ya trae
`deflateRawSync` y `crc32`, y lo único que falta son tres estructuras de campos fijos. Es
**determinista** (marcas de tiempo fijas a 1980-01-01), así que el mismo contenido da siempre
los mismos bytes y cualquier comparación posterior significa algo. No hace ZIP64 y **falla en
vez de escribir un archivo corrupto** si alguna vez se acerca a sus límites.

**Y lo que sí necesita guardián es el REGISTRO, no el ZIP.** `lib/logo-kit.ts` declara dos
listas —lo que la página publica y lo que viaja en el kit sin tarjeta— y `npm run check:kit`
las contrasta contra el disco en los dos sentidos. Es lo que convierte en rojo el caso que
originó los huérfanos: **nadie los metió a propósito, simplemente nunca hubo nada que los
contara**. El guardián se estrenó cazando el ZIP ad-hoc del prototipo, que se habría metido
dentro de sí mismo.

**Los diez huérfanos.** Al sumar el kit apareció que `public/logo-kit/` tiene **55 archivos y la
página publicaba 45**: los ocho `lockup-mono-*`, con cero referencias en todo el código desde
que existen, y el par `favicon-*-48.png`, que duplica los de la raíz que usa el layout. Se
decidió que **viajan en el kit sin tarjeta propia**, y ahora están **declarados** en
`SOLO_EN_EL_KIT` con su motivo, que es la diferencia entre una decisión y un descuido.

**Lo que quedaba pendiente, y se cerró el 2026-08-28 (P50.96).** El **renombrado de los
assets**: en disco los SVG se nombraban por TEMA (`-claro`/`-oscuro`) y los PNG por TINTA
(`tintaOscura`/`tintaClara`), y eran **opuestos** (`simbolo-split-claro.svg` llevaba tinta
oscura). Ahora **todo el kit se nombra por tinta**, que es la propiedad DEL ARCHIVO: «claro» y
«oscuro» describen el contexto donde se coloca, y por eso se invertían. El argumento ya estaba
escrito en el generador para los PNG —«un asset transparente se pone sobre el fondo que sea»—;
lo que faltaba era aplicárselo a la otra familia.

**Y lo que se llevó por delante mide lo que costaba la convención que mentía:** `svgDe()` y
`pngDe()` colapsan en un solo `nombreDe()`, el campo `png` de `VARIANTS` desaparece —era el
que traducía— y la sección de nombres del `LEEME.txt` del ZIP encoge a la mitad en los dos
idiomas, porque ya no tiene que avisar de que las dos convenciones se leen al revés.

**Los favicon se quedan en `-claro`/`-oscuro`, y eso es una decisión, no un resto.** Ahí el
sufijo no nombra un fondo sobre el que alguien coloca el asset: nombra el
`prefers-color-scheme` con el que el navegador lo elige (`app/[lang]/layout.tsx` los declara
con esa `media`). El nombre que sirve es el de la consulta que lo selecciona, así que
renombrarlos rompería la única correspondencia clara que hay.

**Un hallazgo lateral que tardó dos días en tener tarea: el generador no reproduce sus propios
PNG byte a byte.** Al reconstruir el kit para comprobar que el generador escribe los nombres
nuevos, los 12 SVG salieron idénticos y **15 de los 43 binarios cambiaron** —distinta versión
de sharp/libvips que la del día que se generaron—. Se revirtieron para no meter ruido en el
commit del renombrado.

**No es un fallo del kit y no se ha «arreglado»: se ha ESCRITO** *(2026-08-30, P85.2)*. Los SVG
salen de `geometry.js` como texto y son deterministas por construcción; los binarios los
rasteriza una cadena nativa cuyo byte depende de la máquina, no del repo. Así que los PNG y el
`.ico` son **artefactos versionados**, el generador es la **receta y no el contrato**, y quien
clone el repo y lo ejecute obtendrá un diff que **no se commitea**. Está en
`scripts/logo-kit/README.md` §Reproducibilidad, que es donde se lee al volver. Se descartó
pinnear `sharp` a versión exacta: reduce la deriva sin eliminarla —el binario nativo varía por
plataforma— y compra una sensación de cierre que no es verdad.

**Lo que sí cambió es lo que `check:kit` PROMETE.** Cuadraba nombres, y un PNG en blanco,
truncado o regenerado al tamaño equivocado los cuadra igual de bien: es un archivo válido, se
ve perfectamente bien desde la página y se descarga roto. Ahora **abre los 43 binarios** y
comprueba tres cosas del archivo y no de su nombre — que sea del formato que dice su extensión,
que mida lo que su nombre promete, y que tenga **tinta**. Lo tercero necesita decodificar de
verdad: se inflan los IDAT, se deshacen los cinco filtros de PNG y se suma el canal alfa, con
`node:zlib` y sin dependencia nueva. **Qué mide el número del nombre lo dice el REGISTRO**
(`medidaDeclarada`, en `lib/logo-kit.ts`), porque no significa lo mismo en las tres familias:
alto en el símbolo, ancho en el lockup, lado en el favicon. Y un PNG cuyo nombre no case con
ninguna es rojo, no verde: un hueco del metro no es un aprobado.

**Lo que NO promete, escrito para no prometer de más:** que el dibujo sea el correcto. Un PNG
del tamaño justo, con tinta y con el logo de otra versión pasa. Cazarlo exigiría rasterizar el
SVG dentro del guardián, que es volver a meter ahí la cadena nativa que el párrafo anterior
acaba de declarar no determinista.

**El metro, validado rompiéndolo** (2026-08-30), sobre archivos reales y restaurando el árbol:
un PNG válido de 425×512 enteramente transparente, uno truncado al 60%, uno sustituido por el
de 256 y un `.ico` recortado. Los cuatro salen rojos nombrando el archivo. Y **el ancla que
valida el decodificador** es el favicon de 16px, que lleva el trazo engordado de 6 a 10 unidades
a propósito: tiene que salir **28,1% de tinta frente al 17,9% del de 32**. Si los dos salieran
iguales, el que está mal es el decodificador.

**Y una medición que no se hizo.** Esto **borra una capacidad que existía**: hasta hoy se podía
bajar exactamente el PNG 512 en tinta clara. GA4 captura descargas de fábrica, así que el
`file_download` de `/brand-kit` diría si alguien lo hacía alguna vez. No se consultó antes de
decidir. Si el dato dijera que sí, la respuesta no es volver a las 49 anclas: es que a esa
pieza le falta tarjeta.

---

## D120 · El primer `popover` del repositorio, y la etiqueta que no es un widget — 2026-08-26

**Fecha:** 2026-08-26 · **Contexto:** tanda 6, P70.36 · **Estado:** aceptada

**Qué lo abrió, que no era un problema técnico.** El Brand Kit publica nueve muestras de color
y cinco de ellas **conmutan con el tema**, así que imprimen dos hexes. Un solo botón copiaba el
del tema activo sin decirlo. P70.30 razonó que copias el color que estás viendo y se limitó a
**etiquetar** cuál se llevaba el botón: es falso en un Brand Kit, donde los dos valores son
legítimos y el tema en el que estás no debe decidir cuál puedes copiar. **El otro hex quedaba
inalcanzable, y eso no lo arregla un rótulo.** Lo vio Francisco en pantalla.

**La decisión, y es el primer ejercicio real de D6.** Elegir cuál se copia pide un menú, o sea
un widget con estado, foco y capa superior. La cascada de D6 se contestó **en su primera
pregunta**: el atributo `popover` da capa superior, cierre con `Esc`, cierre al pulsar fuera y
devolución del foco al disparador, sin una línea de JS ni una dependencia. No hubo que bajar a
shadcn. Verificado sobre la página servida, no supuesto: `Esc` cierra y el foco vuelve al botón
que lo abrió.

**El posicionamiento también es de plataforma, y su degradación se acepta a propósito.**
`anchor-name` en el disparador y `position-anchor` en el menú, con `position-try-fallbacks:
flip-block` para voltearse cuando abajo no cabe —que en la última fila de la rejilla de color es
el caso normal—. En un navegador sin anclaje CSS, un popover sin posicionar **se centra en la
pantalla**: pierde la relación espacial con su botón y **sigue funcionando entero**, porque el
comportamiento no depende de dónde caiga. Se descartó un fallback de JS que lo colocara en el
evento `toggle`: obligaría a cerrar en el scroll y a mantener dos caminos, uno de ellos
imposible de probar aquí. La clase vive en `globals.css` (`.copy-menu`), que es tan capa como
una variante.

**Y lo que la práctica añade a D6, que es la parte transferible: una etiqueta no es un widget.**
La confirmación («#F7F3EC Copiado») es un `<span>` absoluto — no atrapa foco, no se cierra, no
se navega. **No entra en la cascada**, y meterla en la capa superior para que `position-try` le
eligiera lado sería pagar un widget por un margen. Su colocación es una prop, `confirmPlacement`.
La cascada de D6 aplica a **widgets**; confundir «flota sobre el contenido» con «es un widget»
llevaría a envolver en popover cualquier tooltip decorativo del sitio.

**El precio de esa decisión, y hay que saberlo: la etiqueta no se coloca sola, así que se
recorta.** Va absoluta, y un contenedor con `overflow-hidden` la corta cuando en esa dirección
no hay sitio. Ha pasado **dos veces en dos días**:

| Dónde | Se salía por | Arreglo |
|---|---|---|
| Tarjeta de color del Brand Kit (13rem, `overflow-hidden`) | la derecha — «#F7F3EC Copiado» son ~110px sobre un control pegado al borde | anclarla a ese borde: crece hacia dentro |
| Cabecera del panel de tokens del Design System | arriba — esa barra mide poco más que el botón | `confirmPlacement="below"` |

**Es el patrón del que avisa `BRAND.md` §Cómo medir, punto 8:** las dos veces la cifra salía
bien y la pantalla estaba mal. La primera la cazó el prototipo de `/prototype`; la segunda, el
ojo de Francisco. Ninguna la habría encontrado leyendo el código.

**Lo que se SIMPLIFICA, que es lo mejor de la decisión.** `CopyButton` pierde el par
`{ light, dark }` y con él toda la maquinaria de resolver el tema **en el clic** leyendo
`document.documentElement.classList` —que existía porque quien pinta la tarjeta es un Server
Component y no sabe en qué tema está el navegador—. Con la elección explícita ya no hay nada que
adivinar. El par se queda en `CopyChoice`, y sirve para nombrar las opciones, no para adivinarlas.

**Cómo se eligió.** Cinco direcciones en `/prototype` sobre las dos superficies reales, con los
tokens de `globals.css`. Ganó el menú en línea. **Y una medición cambió la decisión:** apilar los
dos hexes **no cuesta alto**, porque el control de 44px ya fija la altura de la fila, así que las
dos formas del menú dan tarjetas de 314px (contra 358 con dos controles o con la fila pulsable, y
346 con un segmentado). El renglón no se eligió por espacio sino porque los dos valores se
comparan de un vistazo. Coste asumido: los rótulos «claro» y «oscuro» salen de la tarjeta y viven
solo en el menú.

**Y el guardián hizo su trabajo.** `check:excepciones` salió rojo: el ítem del menú estaba
escrito con clases sueltas. No lleva marca de excepción — se compone de `ghost` con `cn()`, como
la variante `card`, así que la pastilla del hover, el foco y el suelo de 44px los sigue poniendo
la capa.

---

## D121 · El índice de una página con paradas deja de ser «de artículo», y dos excepciones cumplen su condición de salida — 2026-08-26

**El disparador.** Francisco planteó llevar el índice, el riel lateral y el cierre de bloque
del artículo a las tres páginas hermanas, con una condición: *«si no vale para las tres, no se
implementa en ninguna»*. La decisión se tomó **midiendo el sitio servido**, no leyendo el
código, y está entera en la tarea P70.38. El resumen: Design System 31,1 pantallas, Brand Kit
12,6 y Accesibilidad 11,0 — la 2.ª, 3.ª y 4.ª página más altas del sitio, y con el artículo
(36,8) las únicas cuatro por encima de diez. Ninguna tenía **ni una** ancla de sección.

**Lo que la medición corrigió.** La duda estaba puesta en el Brand Kit, y por palabras tenía
fundamento: 1.350, la mitad que Accesibilidad. Por **alto** es la tercera del sitio, porque
está hecha de assets. *Contar palabras en una página de especímenes mide la cosa que no es* —
que es la misma familia de error que D50 (el eje que faltaba era el alto) y que el censo de
contraste (leer el CSS en vez del DOM).

**La consecuencia en la capa.** En cuanto son cuatro páginas, la premisa literal de D76
—«resuelve un FORMATO que hoy solo tiene UNA página»— deja de ser cierta para esas tres
piezas. Salen a `ui/section-index.tsx` (servidor: `SectionIndex`, `SectionCloser`) y
`ui/section-index-islands.tsx` (cliente: `SectionRail`), en el grupo **primitiva**, no en el
núcleo: el núcleo de D36 es lo que usa todo el sitio, y esto lo usan cuatro páginas de
catorce. Su hermana de peldaño es `page-closer.tsx` — una cierra la página, esta la indexa.

**`minutes` se convierte en `meta?: ReactNode`, y ese es el cambio que hace la pieza
reutilizable.** `ArticleIndex` exigía un número de minutos y pintaba «≈4 min»; eso solo es
verdad donde la sección es prosa. Publicar un tiempo de lectura calculado sobre especímenes
habría sido inventarse una cifra, que es contra lo que existe D38. Como slot libre, la pieza
deja de saber qué significa el dato y cada página decide qué pone o si no pone nada.

**`ReadingProgress` NO se vino, y decirlo es parte de la decisión.** Mide cuánto texto queda
por leer; en una página de consulta —a la que se llega buscando una sección concreta— esa
cifra no significa nada. Que dos piezas vecinas se muevan no arrastra a la tercera.

**Dos excepciones de `BRAND.md` cumplen su condición de salida, y quedan dos.** La celda del
índice («sale cuando la capa tenga el caso celda pulsable») es ahora `indexCellVariants`; la
píldora del riel es `railPillVariants`. La del riel decía «sale a `chrome.tsx`» **y no acabó
allí**: `chromeLinkVariants` gobierna el ancla, y en el riel el ancla es solo el objetivo
táctil de 44×44 — el aspecto entero vive en un `<span>` interior que ninguna `shape` de chrome
puede describir. De ahí la regla que deja esto: **una condición de salida acierta el CUÁNDO
mucho mejor que el DÓNDE**, y lo que la excepción pedía era que dejara de ser una cadena
inline, no que aterrizara en un archivo concreto.

**El gate que lo respalda.** `npm run gate:html` sobre las 28 variantes: **diff vacío**. Mover
tres piezas de archivo, renombrarlas y cambiar la forma de un prop no altera ni un byte del
HTML servido. Y la línea base se tomó del build anterior con su `BUILD_ID` comprobado en los
dos lados (`pq8wDgOR…` contra `ySeDeFLK…`), que es la trampa de la que ya se avisó: un
servidor viejo que no muere certifica `main` contra `main`.

**Lo que queda pendiente a propósito.** La publicación sigue declarada en §12 del Design
System, que ya demuestra las tres piezas con especímenes que P70.33 compuso a propósito.
**Se mueve a §10 en P70.39**, no antes: es la tarea que pone un índice real en la propia
página del Design System, y a partir de ahí la mejor demo posible no es un espécimen sino el
índice vivo de la página, tres secciones más arriba. Es la promesa de «las piezas reales del
sitio como demo» llevada a su límite.

## D122 · El ordinal de una sección deja de escribirse: lo pone el orden de la página — 2026-08-26

**El disparador.** Las tareas P70.39, P70.40 y P70.41 pedían escribir un `indexLabel` nuevo
por sección, ES y EN, en las tres páginas del sistema: 52 cadenas. No hizo falta ninguna. El
rótulo corto **ya existía** dentro del campo que pinta el eyebrow —`num: "01 — Rejilla y
medidas"`— pegado a un ordinal que `SectionIndex` necesita **suelto** para el numeral grande
de su celda, y `SectionRail` para la pastilla. Estaba escrito; no era direccionable.

**Lo que se hace.** `num` sale del diccionario. Queda `indexLabel` con el rótulo corto, y el
número lo pone la **posición** en un registro por página:

```ts
const ORDEN = ["rejilla", "ritmo", …] as const;   // la única fuente del recorrido
const paradas = ORDEN.map((clave, i) => {
  const ordinal = String(i + 1).padStart(2, "0");
  return { clave, id: `s${ordinal}`, ordinal, label: t[clave].indexLabel };
});
```

De ahí salen tres cosas que antes se escribían por separado: el **ancla** (`s01`…`sNN`), el
**ordinal**, y la **posición** que anuncia el cierre de bloque («7 de 12»).

**Qué cierra, que es el motivo.** Antes el ordinal vivía en tres sitios —el diccionario ES, el
EN, y el banner de comentario de cada archivo de sección— y los tres podían decir cosas
distintas. **Decían cosas distintas**: al hacer esto, nueve de los doce banners del Design
System seguían declarando el ordinal ANTERIOR al reorden de P70.34, y `09-formulario.tsx`
anunciaba «(16) FORMULARIO». Ahora reordenar una página no puede dejar el índice diciendo
«07» donde la cabecera dice «08». Es la misma puerta que D72 cerró con la lista de páginas y
D38 con los valores publicados.

Y la corrección de los banners fue **retirar el número**, no actualizarlo: el nombre del
archivo ya lo lleva. *La corrección de un recuento caducado es dejar de escribirlo.*

**El detalle que hace esto transparente, y que no es cosmético.** El eyebrow se recompone con
una **plantilla** —`` `${ordinal} — ${label}` ``—, nunca con dos nodos JSX adyacentes: React
los separa con `<!-- -->`, y el rótulo que hoy sirve el sitio es una sola cadena. Comprobado
en el prerender de ES y EN: **las 26 cabeceras salen byte a byte como antes**. Sin eso, un
cambio de fuente única habría movido el HTML de las tres páginas.

**Y el marco va por NOMBRE, no por posición.** Lo que cada sección recibe es un solo prop
—`SeccionMarco`: su ancla, su eyebrow ya compuesto y su cierre ya montado— indexado por clave:
`marco={marcos.botones}`, no `marco(6)`. Insertar una sección en medio no puede desalinear a
las demás. El tipo vive en `components/ui/section-index.tsx`, con las piezas que describe,
porque lo usan tres páginas.

**Lo que queda pendiente y está tareado.** El bloque que deriva `paradas` y `marcos` está
escrito **tres veces** —26 líneas idénticas, medidas por `qlty` en la PR #193— porque cada
página tiene su `ORDEN` y su rama del diccionario. Es la Regla de construcción aplicada a la
capa de página, y sube a un constructor de la capa en su propia tarea; su gate será
`gate:html` con diff vacío, porque el refactor se declara transparente.

## D123 · El riel va donde la página se LEE; el índice y el cierre, donde se consulta — 2026-08-26

**El disparador.** D121 llevó las tres piezas —índice, riel y cierre de bloque— a Design
System, Brand Kit y Accesibilidad. Tres tandas después, con las tres páginas en producción y
mirándolas en pantalla grande, Francisco lo dijo: *«solo encaja bien en Design System; en
Brand Kit y Accesibilidad no acaba de aportar»*. El riel sale de las tres. El índice y el
cierre se quedan.

**La regla, que es lo reutilizable:**

> El riel va donde la página se **lee**. El índice y el cierre de bloque, donde la página se
> **consulta**.

Con eso, una página larga futura hereda el riel sola y una de referencia no, sin que nadie
tenga que acordarse. Queda escrita en la cabecera de `section-index-islands.tsx`, que es donde
la leerá quien vaya a usar la pieza.

**No es gusto: es el eje que D121 ya había usado y que se aplicó a dos de las tres piezas.**
D121 dejó fuera `ReadingProgress` con este argumento textual — «mide cuánto texto queda por
LEER, y en una página de consulta eso no significa nada». El riel es de la misma familia: un
indicador permanente de posición dentro de una lectura lineal. Se vino por inercia. A una
página de referencia se llega buscando una sección, se salta una vez desde el índice y se
lee; no se recorre.

**Y solo cuadra en una franja estrecha de anchos, que es lo que lo hizo evidente.** Medido: a
2560px el riel acaba en x=72 y el texto empieza en 640 — **568px de vacío**, porque va pegado
al borde de la VENTANA y no al contenido. Por debajo de 1536 pasa lo contrario: no tiene canal
y se mete encima, que es lo que **se comió los clics** de los tres «Descargar SVG» del Brand
Kit (medido con `elementFromPoint`; no era solape visual, era el riel recibiendo el punto, y
axe no lo ve porque no evalúa qué elemento recibe el clic).

**El coste, que es real.** El Design System pierde algo: doce secciones son largas y ahí el
riel funcionaba. Lo asumible es que el **recorrido** no se pierde —cada sección conserva su
cierre con «7 de 12 · Índice · Siguiente: 08»—, así que se recorre entera sin volver a subir.
Se pierde el indicador siempre visible, no la navegación. Y tenía que ser en las tres: dejarlo
solo en el Design System rompería el «si lo hacemos, lo hacemos en las tres» con el que se
abrió la tanda.

**El corolario: la publicación sigue al CONSUMIDOR, no al archivo.** Con un solo consumidor,
la línea `@pieza` del riel vuelve de §10 a §12, con las otras dos islas fijas
(`ReadingProgress`, `FloatingShare`). El reparto queda: **§10** las piezas que usa cualquier
página con paradas; **§12** lo que es del artículo y solo suyo. Lo que **no** se hace es
devolver el archivo a la capa de artículo: la pieza está escrita genérica —recibe su
`ariaLabel` y no sabe nada del artículo— y moverla sería ruido. **Cambia dónde se publica, no
dónde vive.**

**Lo que la premisa de D76 gana con esto.** D121 escribió que la capa de artículo «se vacía
por su propio criterio: cuando una segunda página quiere una de sus piezas, esa pieza sale».
Cierto, y le faltaba la otra mitad: **la premisa también se comprueba al revés**. El riel
salió, se probó en tres páginas y volvió. Que una pieza sirva a cuatro páginas no la convierte
en general; lo que la hace general es que su motivo valga en las cuatro.

## D124 · El suelo de 360 deja de ser el comentario de un script y pasa a ser una decisión de producto — 2026-08-26

**Contexto.** `check-figuras.ts` lleva escrito en su cabecera, desde que existe, que **por
debajo de 360 no juzga**, y que a 320 los lienzos estrechos del artículo pintan **9,7px**. Lo
mide, lo declara fuera de contrato y lo **imprime en cada corrida** en vez de callárselo — que
es la mitad correcta de la decisión. La otra mitad no existía: el propio comentario decía que
cerrarlo «es decisión de producto, no de este script», y esa decisión **no la tenía pendiente
nadie**. No había tarea, así que llevaba semanas siendo una decisión implícita escondida en el
único sitio donde nadie la va a leer.

Se abrió tarea (P70.46) cuando `viewport-verifier` lo reprodujo sobre los **dos diagramas
nuevos de `/accesibilidad`**: 9,66px a 320, 11,24px a 360, 11,79px a 390, en ES y EN. Lo que
cambió no fue el hecho sino el **tamaño del conjunto afectado**: la tanda 6 añadió dos figuras
más al mismo lienzo de 280.

**Lo que NO era.** No hay incumplimiento. El punto 11 de la columna A de la DoD pide **11px
pintados a 360** y ahí dan 11,24. El gate está en verde y lo ha estado siempre.

**Las tres salidas, y por qué la elegida.**

| Salida | Qué costaba | Por qué no |
|---|---|---|
| Bajar los lienzos estrechos de **280 a 244 unidades** | Recalcular el layout de cada figura afectada | Es rehacer dibujos que hoy cumplen, para ganar un viewport al que el sitio no le promete nada |
| Bajar el **suelo del contrato a 320** en la DoD y en `check:figuras` | Rojo inmediato en CI | Es estrictamente **más** exigente, así que arrastra la fila de arriba como trabajo obligatorio. Solo tiene sentido si ya se ha decidido rehacer los lienzos |
| **Declarar 360 como suelo** y escribirlo donde se lea | Cuatro documentos | — |

**Decisión (Francisco, 2026-08-26): 360 es el suelo del rótulo de figura, y se declara.**

Y la parte que importa que quede exacta, porque es fácil leerla de más: **esto no dice que el
sitio empiece en 360**. El sitio se maqueta y se verifica por debajo — D93 lo bajó a 320 sin
scroll horizontal y P70.13 cerró las tres páginas que aún desbordaban a 280. Lo que se declara
es más estrecho: **el tamaño PINTADO del rótulo de una figura solo se promete de 360 en
adelante.** Entre 280 y 360 la página funciona, se lee y no desborda; lo que no se garantiza es
que el texto dentro de un lienzo escalado llegue a 11px.

**Dónde queda escrito**, que es la decisión entera y no un adorno: el punto 11 de la DoD en
`CLAUDE.md`, el párrafo de `check:figuras` en `PRD-Live.md` §Cómo se verifica, y la cabecera de
`scripts/check-figuras.ts`, que deja de pedir una decisión que ya está tomada y pasa a apuntar
aquí. Es la regla 1 de `BRAND.md` §Cómo se escribe una regla aplicada a una decisión: **su
disparador miraba al lugar equivocado** — el único sitio donde estaba escrita era el archivo que
nadie abre hasta que se rompe.

**La condición de reapertura, que es lo que impide que esto sea un cierre en falso.** Se vuelve
a mirar si el suelo real de viewport del sitio baja por debajo de 360 **como compromiso**, o si
una figura aparece en un hueco más estrecho que los 284px que `ANCHO_MINIMO` asume. Lo segundo
lo delata el propio informe, que publica esa cifra en cada corrida.

## D125 · Una banda no se tiñe sobre una sección que ya existe: se inserta — 2026-08-27

**El problema, medido antes de tocar nada.** Las tres páginas del sistema sumaban **60,3
pantallas de 900px con el 0% de su alto en banda**: ni un solo cambio de fondo a ancho
completo en Design System (33,8), Brand Kit (13,9) y Accesibilidad (12,6). Lo único que salía
en el conteo era el header sticky de 81px, que es cromo. La referencia: la home dedica el
**17%** de su alto a banda y el artículo el **2,7%**.

Y un dato que conviene no perder: la ficha contaba 54,7 pantallas. El Design System pasó de 18
secciones a 12 en la tanda 6 y **aun así creció**, porque la tanda 7 le añadió índice y cierre.
**El trabajo de orientación alargó el tramo plano**, que es justo lo que la ficha avisaba de no
confundir: el índice y el riel resuelven ORIENTACIÓN, no RITMO.

**Las tres direcciones, probadas sobre la página real con `/prototype`.**

| Dirección | Veredicto |
|---|---|
| Teñir bloques con `bg-muted` | Funciona, y destapa que `--border` está calibrado solo contra `--background`: sobre la banda el contorno de una tarjeta cae de **1,29 a 1,10**. Deuda de capa, tareada aparte. **Su motivo caducó y la dirección volvió: D154** |
| Dar superficie al cierre de sección | La más barata y la más fiel a D123. Se quedó a un paso |
| **Insertar una banda invertida por bloque** | **Elegida** |

**Y el hallazgo que vale para la próxima vez: invertir una sección existente era IMPOSIBLE, y
la tarea lo pedía literalmente.** Estas secciones son **galerías**: dentro hay tarjetas
`bg-card`, tablas y especímenes que dan por hecho el fondo de página. Teñir una entera no
habría enseñado la dirección, habría enseñado una sección rota. La banda de la home no es
contenido invertido: es un **manifiesto**, o sea tipo sola. Traducida bien, la dirección era
**insertar** la banda, no teñir lo que ya hay — y eso la convierte en una pieza
(`ui/block-opener.tsx`), no en una variante de sección.

**Lo que resuelve de paso.** El orden de las doce dejó de ser cronológico en P70.34 y pasó a
`fundamentos → piezas → composición → excepción`, pero esa jerarquía **solo existía en un
comentario**: doce secciones seguidas, todas con el mismo filete, no dicen dónde acaba una
familia. Ahora se ve, y la banda lista qué lleva dentro con los rótulos **reales** del índice,
así que también sirve para orientarse — que es lo que una página de consulta necesita (D123).

**LA REGLA DE DENSIDAD, que es lo que decide si esto escala.** Lo que fija cada cuánto cambia
el fondo es el número de **BLOQUES, no el de secciones**. **Si una página pide más de un bloque
cada ~6 pantallas, lo que sobra son bloques, no banda**: partir el Brand Kit en tres daría una
cada 4,6 y la página se leería a golpes.

> **Enmendado el 2026-08-29 por D154, en las dos mitades.** La regla escrita aquí solo tenía
> **techo**, y un techo sin suelo deja pasar el caso que esta decisión nació a corregir: el
> Design System encadenaba **14,1 pantallas** entre dos bandas. Y las cifras que este párrafo
> publicaba —8,9 en Design System, 7,4 en Brand Kit, 6,8 en Accesibilidad— eran **medias**, que
> es justo lo que no puede detectar un reparto malo. **Se sustituyen por el peor tramo de cada
> página**, medido a 1440×900 sobre el sitio servido con los reveals encendidos: Design System
> `1,9 · 6,9 · 6,8 · 7,5 · 7,8 · 4,4` (peor **7,8**), Brand Kit `1,7 · 7,8 · 5,1` (peor **7,8**),
> Accesibilidad `1,8 · 5,8 · 4,9` (peor **5,8**). El suelo y su segunda palanca, en **D154**.

**Dos detalles que costaron y no se re-derivan.** Hubo un rótulo de rango encima de cada banda
(«Secciones 05 a 08») y salió: la lista de abajo ya lleva los ordinales, así que decía dos
veces lo mismo con menos información. Y la lista va en **texto, no en enlaces**: sobre banda
invertida `.link-content` no tiene contraparte —hallazgo de P66, todavía abierto—, así que
enlazar ahí pediría antes esa variante.

**Coste asumido.** Accesibilidad no está partida en un archivo por sección como sus hermanas,
así que sus dos bandas van insertadas a mano en el JSX en vez de salir de un bucle. Tareado.

## D126 · El pliegue es un problema de ALTO, y su andamiaje solo razonaba por ancho — 2026-08-27

**El síntoma.** A **1280×618** —el escalado de Windows al 150%, viewport de la matriz de D50—
las tres páginas del sistema cortaban su fila de cifras dejando **17px visibles de 84,6
(20,1%)**, idéntico al píxel en las tres. Una franja de 17px sobre 85 no se lee como «hay más
abajo»: se lee como un error de renderizado.

**Lo que NO era, y hubo que medir las CUATRO páginas para saberlo.** No es recorte (`min-h`,
no `h`: nada se oculta, solo hace falta scroll). No es la regresión de P70.35, cuyo suelo añadió
3px sobre los 461 que las tres medían solas. No incumple D50, que compara la alineación ENTRE
hermanas y seguía perfecta. Y no era de ninguna de las tres páginas: **«Cómo se ha creado» no
lo tenía porque usa otro caparazón**, y eso fue lo que lo delató.

**La decisión.** Compactar por **alto**. Todo el andamiaje del pliegue razonaba por ancho
—`clamp(…,6vw,…)`, `md:`— y el pliegue es un problema de alto. Por debajo de **700px** de
viewport, el hueco del breadcrumb y el de la fila bajan de 72 a 32 cada uno.

**Se descartó empujar la fila hasta que cayera entera debajo**, y el motivo es la parte
reutilizable: **un offset fijo no arregla un corte, lo traslada a otro viewport**. Solo un
umbral sobre el eje que causa el problema lo cierra.

700 y no 686 —donde la fila justo dejaba de caber— para que el punto de conmutación no sea el
mismo píxel que el síntoma.

**Medido después, y por el `margin` COMPUTADO, no por la posición** —que es lo único que
distingue «el override gana» de «algo más lo movió»—: la fila queda en 521→605,6, entera, con
12,4px de margen; 32px a 618 de alto y 72px a 900. Y `h1` en 224,5 con grupo de 464 **en las
CUATRO**, Contacto incluida. Esa última línea era el riesgo real de meter un eje nuevo aquí:
**el grupo pierde 40px de golpe, y si una sola de las cuatro no los perdiera se descuadrarían
todas** — que es exactamente la invariante que D50 protege.

**El `@media` va escrito entero en los dos archivos y no interpolado a una constante**:
Tailwind escanea el código como texto plano, así que una clase compuesta no se genera y se
queda sin estilo SIN dar error de compilación (`BRAND.md` §Cómo medir, punto 5).

## D127 · El atenuado de un texto no se escribe con `opacity`, y el censo no sabía verlo — 2026-08-27

**El síntoma, y lo raro es que era un aprobado.** El ordinal de la lista de paradas de
`ui/block-opener.tsx` (la banda de D125) nacía con `opacity-70`. Corriendo el propio script
del censo sobre `/accesibilidad` en oscuro, ese elemento salía puntuado así:

```
15.32  12.8px  AAA   span.font-mono.text-[0.8rem].tabular-nums
```

**15,32 es el anclaje** —la mejor cifra que este sitio puede dar, la del texto principal en
oscuro—. La pantalla pintaba **5,97**. A 12,8px el umbral AAA es 7, así que `PRD-Live.md`
publicaba «cero pares bajo AAA en las catorce × 2 temas» con uno debajo.

No es que el metro se quedara corto: **señalaba como mejor par de la página el peor.**

**La causa.** `scripts/design-review/contrast-census.js` lee el color con
`getComputedStyle(el).color` y lo único que hace con la opacidad es descartar el elemento si
vale exactamente 0 (líneas 279 y 519). **Nunca compone por la opacidad del elemento ni por la
de sus ancestros.** Un `opacity` sobre texto es, para él, invisible.

**La regla que ya existía y aun así se incumplió.** `BRAND.md` §Cómo medir sin equivocarse,
punto 8, lleva desde el 2026-08-25 diciendo: *«Corolario: se mira la página servida — un clon
del DOM, un `getComputedStyle` o el JSX no son la página.»* Eso describe este fallo con
precisión literal. **Es su tercera instancia**, no una regla nueva — y por eso lo que se añade
a `BRAND.md` no es el corolario otra vez, sino la regla de UI que faltaba.

**La decisión, y es de mecanismo, no de color.** El atenuado sale de la capa
(`text-muted-foreground`), que lo resuelve la superficie (D39). La entradilla de esa **misma
banda**, doce líneas más arriba, ya lo hacía bien: dos mecanismos para el mismo trabajo en un
componente de 40 líneas era la señal de drift, antes que la cifra.

Medido después, con el motion congelado y el metro revalidado en cada corrida (13,79 claro /
15,32 oscuro, exactos):

| | Antes (`opacity-70`) | Después (`text-muted-foreground`) | Umbral AAA a 12,8px |
|---|---|---|---|
| Claro | 7,52 | **10,32** | 7 |
| Oscuro | **5,97** | **9,89** | 7 |

Y la jerarquía que buscaba el `opacity` se mantiene: la etiqueta de al lado sigue en 13,79 /
15,32, así que el ordinal recede igual, ahora medido en vez de elegido a ojo.

**Se descartó añadir un segundo escalón de `--surface-dim`** para conservar el tono exacto de
antes: sería un token con un solo call site, que es indirección y no fuente única.

**El alcance era exactamente uno.** De los ocho `opacity-*` del repositorio, siete son barras
de esqueleto en `accesibilidad.tsx` y `design-system/hero.tsx` —ilustración, exenta— y **este
era el único que llevaba texto**. Así que hoy el censo no tiene ningún caso que fallar, y ese
es justamente el problema: el próximo volverá a ser invisible. **El agujero del guardián va
aparte** (P68.7115), porque su modo de fallo es un tick verde.

**La confirmación fina:** tras el arreglo el censo pasó de **408 a 414 pares**, y esos seis son
3 páginas × 2 temas — el ordinal dejó de ser un duplicado de `--background` y pasó a ser un par
propio. Un arreglo que no hubiera cambiado nada habría dejado el recuento igual.

## D128 · El contrato de un gate se publica; su porqué se consulta — 2026-08-27

**El encargo era encontrar el archivo culpable, y no hay ninguno.** El techo del presupuesto
de contexto subió a 12.700 el 2026-08-25 sin una medida detrás, y P68.5905 pedía la revisión
manual que lo convirtiera en dato. Medido sobre 29 commits de documentación (23 → 27 de
agosto), en palabras y con el contador de `check:contexto`:

| archivo | tocado en | churn | neto | tamaño |
|---|---|---|---|---|
| `PRD-Live.md` | 21/29 | 934 | +176 | 3.186 |
| `CLAUDE.md` | 13/29 | 609 | +149 | 4.693 |
| `BRAND.md` | 10/29 | 817 | +107 | 4.724 |
| `AGENTS.md` | 0/29 | 0 | 0 | 95 |

**+432 palabras netas en cinco días, repartidas casi a partes iguales entre tres archivos.**
Eso es lo que explica por qué las dos pasadas de retirada anteriores —Método II (−1.026) y
P68.675 (−440)— se las comió el sprint siguiente: no estaban tapando una fuga localizada,
estaban barriendo lluvia fina. Una tercera pasada del mismo tipo habría dado el mismo
resultado, y por eso lo que cambia es el régimen y no la cifra.

**La hipótesis con la que empecé era falsa, y comprobarla es la mitad útil del trabajo.**
Supuse que `BRAND.md` guardaba inline el porqué *estructural* de sus variantes —§Jerarquía de
hover y sus siete subsecciones suman 1.629 palabras, y el propio archivo las etiqueta como
«explica **por qué** cada variante es como es»—. Contrastado contra `BRAND-historical.md`
§El hover de la tarjeta pulsable: la regla en `BRAND.md` son 151 palabras de regla + una
cláusula de porqué + puntero, y las 400 de barrido de mezcla y descartes están en el
histórico. **El corte del 2026-08-09 funcionó**, y por eso el movimiento que P68.5908 propone
para `CLAUDE.md` es el correcto.

**Dónde sí estaba escrito dos veces.** `PRD-Live.md` §Cómo se verifica lo que no ve un
compilador: **769 palabras, el 24 % del archivo**, describiendo once gates — y cada bullet
**ya citaba su entrada de `DECISIONS.md`** (D42/D45, D49/D99, D50/D52, D73, D75, D84/D103/D110,
D85/D97/D90, D101/D107, D114/D124, D116, D119). El porqué estaba en los dos sitios.

**La decisión.** Esa sección pasa a **tabla de contrato**: por gate, qué garantiza, **qué deja
fuera**, dónde corre y el puntero a su D-entry. Lo que se retira es el porqué —qué falló para
que existiera, qué se descartó, qué caza en la práctica—, que se consulta a demanda por el
índice de cabecera de `DECISIONS.md` (D88). El criterio de corte: **el catálogo de aquí no se
lee hasta que un check sale rojo, y entonces el check dice su nombre.**

La columna «qué deja fuera» no es adorno: es la mitad del contrato que un guardián nunca
declara solo, y la que evita darlo por más ancho de lo que es (contraste y objetivo táctil
fuera de `check:marco`, el suelo de 360 fuera de `check:figuras`, el `<head>` fuera de
`check:marcas`, el ZIP fuera de `check:kit`).

**Lo que NO se toca, con su motivo.**

- **La regla de la raya** (`CLAUDE.md`, ~200 palabras) la comprueba `check:raya` en CI, así
  que parecía candidata. No lo es: el guardián caza la infracción **después** de escribirla, y
  la enumeración de sustitutos es lo que evita escribirla. Un guardián reactivo no releva a
  una regla de redacción.
- **El bloque del tablero de Notion** (`CLAUDE.md`, 1.488 palabras, el 32 % del archivo) se
  consulta en tres momentos y ninguno es escribir código. Sacarlo a un doc a demanda es la
  partición más grande disponible y se descarta **hoy**: el arranque de sesión sí toca el
  tablero, y mover 1.488 palabras a un destino sin techo es la «reducción que fue una mudanza»
  que el sexto `method-review` acaba de nombrar.

**El resultado, y es honesto decir que se quedó corto de la proyección.** La sección baja de
**769 a 542** palabras, no a las ~280 estimadas: al escribir la tabla resultó que más de la
mitad de esas 769 era contrato, no porqué. El arranque baja de **12.698 a 12.454**, y la
holgura pasa de **2 a 246 palabras** — por encima de las 240 que el propio guardián define
como la magnitud que hay que sostener, por primera vez desde que el techo subió.

## D129 · El presupuesto gana su tercera mitad: techo a la SUMA de las skills — 2026-08-27

**El hallazgo, y es de los que solo aparecen mirando las dos direcciones a la vez.** El sexto
`method-review` midió el corpus de instrucciones entre el 19 y el 27 de agosto:

| Fecha | Docs `@`-importados | Skills a demanda | Corpus total |
|---|---|---|---|
| 2026-08-19 | 18.098 | 13.311 | 31.409 |
| 2026-08-27 | 12.689 | 20.616 | 33.305 |
| *variación* | **−30 %** | **+55 %** | **+6 %** |

Se celebró una reducción del 30 % en el lado medido mientras el lado sin medir absorbía el
coste **y algo más**. Es una familia de fallo propia y ya tiene nombre: **«la reducción que fue
una mudanza»**.

**La causa estaba escrita en la salida del propio guardián.** `check:contexto` ponía techo
**total** a los cuatro documentos, techo **por entrada** a las skills y **ninguno al conjunto**,
y lo decía en cada corrida: *«suma (NO es un presupuesto: no se cargan a la vez)»*. Era cierto y
no era toda la verdad. Un trinquete asimétrico hace que **mover una regla de un documento a una
skill salga gratis**, y esa gratuidad es lo que produjo el trasvase. El argumento de la
concurrencia además se cae en la práctica: un cierre de etapa encadena `sprint-review` →
`method-review` → `close-session` en la misma sesión, encima de los cuatro documentos.

**La decisión: `TECHO_SUMA = 20.500`, y falla.** Nace en verde, por la misma razón que los otros
dos techos: uno que nace en rojo se sube hasta que no significa nada. Se sella contra la suma de
**después** de la propia tarea —20.262, no las 20.203 de antes—, porque actualizar la tabla de
umbrales de `method-review` es parte de ella. Holgura resultante **238**, que es exactamente la
magnitud de trabajo que este archivo ya defiende para los documentos (240): las tres mitades del
presupuesto quedan igual de apretadas.

**Sin objetivo, y es deliberado.** Los otros dos presupuestos llevan techo + objetivo porque su
objetivo sale de una historia medida. Para la suma de skills esa curva no existe todavía: poner
un objetivo hoy sería elegir un número y llamarlo medida, que es justo lo que D128 acaba de
corregir. Se sella y se mide; el objetivo se pone cuando haya curva.

**El caso malo tuvo que diseñarse para no cruzar el techo de al lado.** `check:guardianes` gana
su caso para este control, y engordar la skill más grande no habría servido: habría reventado el
techo **por entrada** y el guardián saldría rojo por el control equivocado, dejando este sin
probar — el modo de fallo que ese archivo entero existe para cazar. El caso rellena
`sprint-review` hasta **~3.900** palabras, por debajo del techo (4.600) y del objetivo (4.500)
por entrada, y sube la suma a 22.697. Verificado: sale por la rama de la suma, con código 1. El
relleno se calcula desde el tamaño real del archivo, así que si algún día esa skill ya midiera
más, el relleno sale cero y el caso falla **ruidosamente** en vez de aprobar.

**Y una trampa de método que conviene no repetir: dos corpus medidos con dos varas distintas.**
El informe decía 20.616 donde el guardián dice 20.203. No es drift ni una medida vieja:
`check:contexto` **descuenta los bloques de código** y el informe no. Comprobado — 20.688
contando el código, 20.203 sin él, 485 palabras de diferencia en las nueve entradas. El número
que gobierna es el del guardián, que es la misma vara con la que se miden los documentos.

## D130 · El porqué de las convenciones se parte, y el arranque cabe en el objetivo sin mudanza — 2026-08-27

**El movimiento estaba probado en este repo y `CLAUDE.md` nunca lo recibió.** `BRAND.md`
partió su porqué fechado a `BRAND-historical.md` el 2026-08-09 (P37.685) y funcionó: la regla
quedó en presente, el relato a demanda. D128 lo comprobó midiendo —151 palabras de regla más
puntero en `BRAND.md` contra 400 de barrido en el histórico— y `CLAUDE.md` seguía mezclando
las dos cosas en sus 4.693.

La aritmética que lo justifica: **una regla enunciada más puntero cuesta ~15 palabras; con su
historia dentro, ~150.**

**Qué se ha movido, y el criterio.** Nace `CLAUDE-historical.md` (a demanda, con índice
derivado por `npm run indices`, nunca `@`-importado), con seis secciones que espejan las de
`CLAUDE.md`. Dentro va el caso que escribió cada regla: que `General` llegó a acumular el 80 %
del tablero con «Optimización», que la lista de piezas estaba escrita a mano en cinco sitios y
ninguno acertaba, que el capítulo doce metió el riel debajo del nav, que el mismo radio estaba
escrito de tres formas, que cuatro gates fallaron por depender de acordarse (D54, D60, D63),
que el interlineado del artículo sobrevivió a tres mediciones.

**El corte no fue solo extraer relato: la mitad del ahorro salió de duplicación.** El
inventario de gates estaba en `CLAUDE.md`, en la DoD y en `PRD-Live`; el «shippear vs. pulir»
estaba en §Metodología y en la Columna B; el «se publica en el Design System» estaba en la
Regla de construcción y en la fila 1 de la DoD. Y **dos listas estaban caducadas** —los sprints
y bloques concretos, y el reparto V2/V3/V4—, así que ahora apuntan al tablero y a `PRD-Live`
§9 en vez de enumerarse.

**La trampa que el split tiene que evitar, y que `BRAND.md` ya pagó una vez.** Si el puntero no
se lee, la regla se vuelve a discutir desde cero. `BRAND.md` lo resolvió escribiendo **cuándo**
hay que abrir el histórico, no solo que existe, y aquí se copia esa frase a los dos sitios: a
la cabecera del histórico y a §Régimen de docs. La formulación es **«antes de CAMBIAR una
regla, no antes de aplicarla»** — aplicarlas no necesita el relato; discutirlas, sí.

**El resultado, y por qué esta vez no es una mudanza.** El arranque baja de 12.454 a
**11.794**: por debajo del objetivo de 11.800, que solo se había alcanzado una vez y no se
sostuvo. Lo que hace que la bajada sea real y no un traslado es que las dos salidas están
tapadas — el histórico **no se `@`-importa**, y la suma de skills **ya tiene techo** desde D129
(20.500), que era justo el agujero por el que se fue el 30 % anterior.

**Y el trinquete vuelve a apretar, como su propia entrada prometía.** La subida a 12.700 del
2026-08-25 quedó atada a que apareciera un dato de coste; apareció (D128), así que el techo baja
a **12.300** y el objetivo al siguiente peldaño de su escalera, **11.600**. La holgura que se
deja es **506**, no 240: es lo que el propio guardián pedía sin poder pagarlo, porque 500
palabras son media docena de sesiones escribiendo reglas en vez de un cuarto de sprint
retirándolas.

| | Antes | Después |
|---|---|---|
| `CLAUDE.md` | 4.693 | **4.033** |
| `PRD-Live.md` | 3.186 | **2.942** |
| Arranque total | 12.698 | **11.794** |
| Techo · objetivo | 12.700 · 11.800 | **12.300 · 11.600** |
| Holgura de trabajo | 2 | **506** |

## D131 · El filete era el tercero de la familia y el único sin tratamiento por superficie — 2026-08-27

**La familia son tres y solo dos estaban hechas.** `--surface-dim` se recalcula contra la
superficie donde cae el texto desde **D39**; `--control-edge`, contra la que rodea al control,
desde **D97**. `--border` —el filete decorativo: divisores, hairlines, el borde de una tarjeta
que no se pulsa— seguía definido **una sola vez por tema**, calibrado contra `--background` y
solo contra él. Medido sobre el píxel pintado, con el metro validado contra el ancla de siempre:

| Superficie | claro | oscuro |
|---|---|---|
| página (referencia) | 1,21 | 1,36 |
| tarjeta | 1,29 | 1,23 |
| `muted` | 1,10 | 1,07 |
| **banda invertida** | **11,35** | **11,23** |

**La invertida es el hallazgo, y no estaba en la tarea.** Sin regla, un elemento con
`border-border` dentro de una banda hereda el filete de la PÁGINA: un hairline casi blanco
sobre carbón, o casi negro sobre hueso — **ocho veces la referencia**. No es que se difumine:
grita. Hoy no tiene ni un ocupante (medido: cero en las ocho páginas), así que era deuda
latente, pero era la que más lejos estaba. Y desde D125 el sitio tiene nueve bandas invertidas,
o sea que el caso dejó de ser hipotético hace un día.

**Y no era latente en tarjeta, que es donde la ficha decía que no afectaba a nada.** 249
elementos de las ocho páginas dibujan su `border-border` **dentro** de una superficie de
tarjeta. En claro iban un pelo más marcados que la referencia (1,29 frente a 1,21) y en oscuro
**un tercio menos** (1,23 frente a 1,36). Eso último es una debilidad real, ya enviada, que
nadie había mirado.

**La forma la decide el precedente, no el gusto.** Los dos hermanos resuelven esto distinto y
por un motivo: `--surface-dim` conserva su valor de autor en `:root` (`var(--muted-foreground)`)
y solo mezcla en las demás superficies, mientras que `--control-edge` mezcla también en `:root`
porque **nació sin valor previo**. `--border` tiene valor de autor, así que va por el primer
camino: se renombra a `--border-base`, `--border` lo consume tal cual en `:root`, y la mezcla
entra solo donde el fondo deja de ser el de la página. **Ni un filete de página se mueve.**

**El 11% sale de un barrido, y el objetivo no es un umbral.** Un filete decorativo no tiene
ninguno: lo que hay que reproducir es la referencia de su propio tema. Del 8% al 20%, sobre las
dos superficies y los dos temas, el 11% es el único que deja las cuatro cifras dentro de ±0,03
—y del lado de arriba a propósito, porque el modo de fallo que esto arregla es un filete que se
borra. **La mezcla NO conmuta con el tema**, al revés que `--control-edge-mix` (60/45), y eso es
un resultado: la referencia ya conmuta sola, porque es el propio `--border-base` contra el fondo
de cada tema. La **invertida** sí necesita su número —7% claro, 15% oscuro— y en direcciones
opuestas, porque los dos `--foreground` no son simétricos en luminancia.

Verificado sobre el sitio servido, inyectando una caja `border-border` en cada superficie y
leyendo su borde pintado:

| Superficie | claro | oscuro |
|---|---|---|
| página | 1,21 → **1,21** | 1,36 → **1,36** |
| tarjeta | 1,29 → **1,23** | 1,23 → **1,39** |
| `muted` | 1,10 → **1,22** | 1,07 → **1,38** |
| invertida | 11,35 → **1,22** | 11,23 → **1,35** |

**Se cubren las dos puertas de D61**, igual que sus hermanos: `hover:bg-muted` no compila a
`.bg-muted`, así que el eje de ESTADO va aparte o el arreglo se escapa por donde ya se escapó
una vez.

**El guardián hizo su trabajo en el momento.** El hook de paleta saltó en la primera edición
—`lib/design-values.ts` seguía publicando `--border` con el valor autorado— y volvió a saltar
pidiendo el censo, porque las superficies pasaron de 16 a 19. Es la condición de re-medir de la
DoD leída por una máquina (D90), y esta vez no hubo que acordarse de nada.

**Censo tras el cambio:** 391 pares de texto y 272 contornos, metro validado en las 28 corridas,
cero bajo AA, cero bajo AAA y cero por debajo del 3:1. Los dos recuentos son **idénticos** a los
de antes del cambio, que es lo que debía pasar: un filete decorativo no es un par de texto ni el
contorno de un control.

## D132 · El equilibrado de línea y el destello del toque bajan a la capa — 2026-08-27

**Dos reglas de la guía de interfaz sin portador, las dos en `globals.css`.** `text-wrap:
balance` reparte las líneas de un titular para que la última no quede huérfana;
`-webkit-tap-highlight-color` decide de qué color destella un control al tocarlo en un
teléfono.

**La tarea decía «0 hits en todo el proyecto» y era falso**, así que se descarta por escrito:
hay **29 usos** de `text-balance` / `text-pretty` en 20 archivos, y `components/ui/heading.tsx`
ya nombraba `text-balance` como override legítimo del call site. El `design-review` grepeó la
propiedad CSS (`text-wrap`) y lo que hay escrito son las utilidades de Tailwind, que compilan
a ella. **El defecto medido sí era real y reproduce exacto.**

**Medido A/B sobre la MISMA página servida** —mismo DOM, mismas fuentes, forzando `text-wrap`
a `wrap` y a `balance` sobre los mismos nodos—, `/accesibilidad` a 390px, última línea como %
de la más larga:

| Titular | antes | después |
|---|---|---|
| «Cinco cosas que no incumplían…» (h3) | **13 %** | 100 % |
| «Dos diagramas que se miden…» (h3) | **18 %** | 96 % |
| «El marco lo pone la página…» (h3) | **20 %** | 100 % |
| «Dónde no llega, y cómo decirlo» (h2) | **30 %** | 98 % |
| «Qué cumple, y cómo se prueba» (h2) | **31 %** | 100 % |

**12 de 16 mejoran, 4 no cambian, ninguno empeora.** Y los peores no eran los dos `h2` que
encontró la tarea: eran los **h3**, que se le escaparon enteros.

**LA FILA 5 DE LA DoD, CONTESTADA CON UNA MEDIDA Y NO CON UN CRITERIO.** 93 titulares en
cuatro páginas: **cero cambian de alto**. `balance` reparte dentro del mismo número de
líneas, así que no hay pliegue que recalcular ni layout shift que temer.

**En cuerpo va `pretty`, que es otra propiedad y no la misma con otro nombre.** `balance`
iguala TODAS las líneas de un bloque corto y los navegadores lo ignoran por encima de cuatro
o seis; `pretty` deja el párrafo como está y solo impide la palabra suelta al final. Viudas
(última línea < 25 %): home 7→1, `/accesibilidad` 15→9, el artículo 48→30. Un solo bloque de
338 crece una línea, y es un párrafo en flujo.

**VA SOBRE EL ELEMENTO Y NO SOBRE `titleVariants`**, que era la otra opción: no todos los
titulares del sitio pasan por la capa de cabecera —los de `system-message`,
`global-not-found` y las bandas los escriben sus bloques—. El selector `h1..h4` ya existía en
`globals.css` para la familia tipográfica, así que el equilibrado entra por la misma puerta.

**Y POR QUÉ ESTO NO PODÍA VIVIR EN EL PUNTO DE USO**, que es la parte reutilizable: el defecto
solo salía en una de las tres páginas hermanas, con el MISMO componente. Lo que divergía era
el **registro del copy** — Design System y Brand Kit le dan sintagmas cortos que nunca rompen;
Accesibilidad, oraciones con coma. Una propiedad que hace falta o no según lo que alguien
escriba en el diccionario no se puede recordar en cada call site.

**El destello del toque se DECLARA, no se apaga.** Apagarlo con `transparent` era la otra
respuesta y es peor: en un teléfono el hover no existe, así que el destello es la ÚNICA
confirmación de que el toque se ha registrado. Se tiñe de `--primary` al 18 % y conmuta con el
tema solo porque el token ya lo hace. Sin umbral WCAG que cumplir: es transitorio y no
delimita el control.

**Lo que deja detrás, medido y tareado (P68.753):** con la regla en la capa, **165 de las 172
utilidades del call site dicen lo mismo que ella**. Las **7 que sobreviven son un hallazgo, no
un resto** — un párrafo o una cita que pide `balance` porque **se lee como titular sin ser un
encabezado**: la subheadline del Hero, la apertura de Sobre mí y las cinco citas del artículo.

## D133 · El filete de la banda invertida es uno solo, y el ordinal no toma color — 2026-08-27

**La pregunta era si la banda de bloque (D125) debía tomar el acento morado**, y la tarea
ofrecía dos salidas: teñir el ordinal de cada parada, o dejarla cromáticamente muda. **Ganó
una tercera que no estaba escrita** (Francisco, 2026-08-27): reusar el **filete morado** que
la banda-manifiesto de la home ya lleva entre su titular y su bajada.

**POR QUÉ EL ORDINAL ERA LA RESPUESTA EQUIVOCADA**, medido sobre el píxel pintado y con el
metro validado en la misma corrida —la etiqueta de la banda da **13,79 / 15,32**, que son
exactamente los dos anclajes de `BRAND.md`:

| Color del ordinal (12,8px · AAA = 7) | claro | oscuro |
|---|---|---|
| Hoy (`text-muted-foreground`) | **10,32** | **9,89** |
| `--brand-purple-accent` | **7,04** | **7,21** |
| `--brand-purple` estándar | 5,21 | 2,65 ✗ |

1. **Pasa AAA por cuatro centésimas** en claro, en la superficie invertida más repetida del
   sitio. Cualquier retoque futuro del token lo tumba.
2. **Le quita contraste**: 10,32 → 7,04.
3. **Le daría al morado un segundo significado en páginas donde ya tiene uno.** El punto de
   6px del índice de sección marca «estás en la sección N de N» y sale **catorce veces** en
   `/design-system`. Enumerar y «estás aquí» no pueden ser el mismo color en la misma página.
4. **D127 es del día anterior** y movió ese mismo ordinal de un `opacity-70` elegido a mano a
   la capa. Teñirlo devolvería un color a mano al mismo texto veinticuatro horas después.

**El filete no tiene ninguno de esos problemas** y sí resuelve lo que la tarea quería: va
`aria-hidden`, no lleva información y no delimita ningún control, así que cae en «detalles» de
`BRAND.md` §Color y **no tiene umbral que cumplir**.

**SALE A LA CAPA AL APARECER EL SEGUNDO CALL SITE:** `.band-rule` en `globals.css` con la
geometría (2px × 3,5rem, `--brand-purple-accent`). Escribirlo dos veces se cargaría el motivo
del cambio, que es justamente que las dos bandas se lean como la misma familia.

**LO QUE LA CLASE NO DECLARA ES EL MARGEN, y no es olvido.** El ritmo vertical es una
propiedad del bloque que lo aloja: el manifiesto abre con un titular de hasta 3,75rem y
respira más; la banda de bloque abre con uno de 3rem y es mobiliario de orientación. Es la
regla 4 de `BRAND.md` — dos valores que se parecen y significan cosas distintas no se
unifican. Va además **sin `@layer`**, así que un margen ahí ganaría a cualquier `my-*` del
call site sin avisar.

La banda pasa de 386 a 420px de alto; la regla de densidad de `block-opener` no se mueve. Y
**se publica sola**: §10 del Design System monta el `BlockOpener` real, no una recreación.

## D134 · El nodo WebSite existe, y con él el isPartOf que el código esperaba — 2026-08-27

**La tarea estaba caducada y se descarta por escrito.** Decía que `lib/structured-data.ts`
tenía «SOLO dos constructores» y que `WebPage` no estaba en las internas: hay **cinco** y
`WebPage` está ahí desde P50. **Pero el hallazgo sale reforzado**, porque el propio código
llevaba meses declarando su condición de salida:

> `experiencePageLd`, desde P50: *«NO LLEVA `isPartOf`, y la ausencia es deliberada: el nodo
> `WebSite` no existe todavía, así que apuntar a `#website` sería una referencia `@id`
> COLGANDO — valida igual, porque un validador de esquema no resuelve referencias, y no
> significa nada. Se añade el día que exista el nodo, no antes.»*

El nodo se declara **entero y solo en la home** (`profilePageLd`); lo referencian las siete
páginas con nodo propio: el artículo, Contacto y los cinco deep-dive.

**DOS FORMAS DE REFERENCIARLO, Y CUÁL TOCA LO DECIDE LA ELEGIBILIDAD PARA RICH RESULTS** — la
misma regla que `techArticleLd` ya había escrito para su `author`. La Rich Results Test evalúa
una página **aislada**: en un tipo elegible (`TechArticle`) degradaría la referencia a `Thing`
anónimo y avisaría, así que ahí va con `@type`, `name` y `url`; en los que no lo son
(`WebPage`, `ContactPage`) basta el `@id` pelado.

**`inLanguage` LISTA LOS DOS IDIOMAS Y NO EL DE LA PÁGINA**, que es la parte que no es obvia.
El `@id` es uno solo para las veintiocho variantes, así que si la home ES dijera `es` y la EN
dijera `en`, **el mismo nodo afirmaría dos cosas distintas según por dónde se entre**. Lo
cierto del SITIO —y no de la página que lo declara— es que está en los dos; la página ya
declara el suyo aparte.

**NO LLEVA `potentialAction: SearchAction`**: es el campo que pinta la caja de búsqueda de
Google y este sitio no tiene buscador interno. Declararlo sería afirmar una capacidad
inexistente, que es el mismo criterio por el que el deep-dive no es `Article`.

**El metro se movió con el cambio, que es como se comprueba que lo ve:** `check:marco` pasa de
**3 `@id` declarados y 1 referenciado** a **4 y 2**.

**Cierre con el Schema Markup Validator sobre el preview**, las seis páginas con nodo propio
en ES y EN: **cero errores** en home, artículo y deep-dive. El validador reconstruye
`ProfilePage → isPartOf → WebSite` con su `@id`, `name`, `url`, los dos `inLanguage` y el
`author` apuntando al `Person`.

**Y dos cosas medidas que conviene no redescubrir:**

- **El aviso de `/contacto` es un falso positivo y es PREEXISTENTE**, idéntico en producción,
  que no lleva `isPartOf`. Es el vocabulario reducido de Google (SPORE) marcando
  `UNKNOWN_FIELD contactPoint / ContactPage` con `isSevere: false`; en Schema.org
  `contactPoint` es válido en cualquier `CreativeWork`. Queda documentado **junto a
  `contactPageLd`**, porque si no la siguiente pasada lo levanta como hallazgo nuevo — ya pasó
  con seis de once.
- **La referencia `@id` pelada sale como `CreativeWork`** en vez de `WebSite`. Cero errores y
  cero avisos, así que se queda; pero el «no cuesta nada» que esta regla heredó queda más
  preciso: **no cuesta un aviso, cuesta que un lector AISLADO vea un tipo genérico**. Para el
  rastreador que recorre el sitio entero —que es quien une las entidades— el `@id` hace su
  trabajo igual.

## D135 · El listón de una entrada baja a la capa, y la demo que lo publicaba deja de tener cifras propias — 2026-08-27

**El reveal duraba 600 ms con la curva *standard* de Material —que es ease-in-**out**— y esa
curva estaba escrita a mano en siete sitios.** Ninguno de los siete era un descuido: cada uno
se copió del de al lado, que es como se propaga un valor que no tiene nombre. Ahora lo tiene:
`--ease-entrance` (`cubic-bezier(0, 0, .2, 1)`) y `--duration-entrance` (`.28s`), en `:root`,
mismo patrón que `--surface-dim` (D39) o `--control-edge` (D97) — **no se elige la curva de una
entrada en el punto de uso**.

**La duración es el TECHO de la entrada, no su valor obligatorio.** Los 280 ms son para el
recorrido más largo que hace el sitio (el fade-up de 14px); el chip EXIT se queda en sus
250 ms, y el enlace de contenido baja a 220. Lo que no puede una entrada es ir por encima.

**Qué cambió, medido sobre el sitio servido** (`getComputedStyle` con el build de producción):

| Pieza | Antes | Ahora |
|---|---|---|
| `[data-reveal]` | 600 ms · ease-in-out | **280 ms · ease-out** |
| Chip EXIT | 250 ms · ease-in-out · retardo 280 ms | 250 ms · **ease-out** · retardo `var(--duration-entrance)` |
| Barrido `.rlz` de los diagramas | 320 ms · ease-in-out | **280 ms · ease-out** |
| Banner de consentimiento | 400 ms · ease-in-out | **280 ms · ease-out** |
| `.link-content` | 220 + 300 + 80 = **380 ms** · `ease` | 160 + 220 + 60 = **280 ms** · ease-out |

El retardo del chip **es** ahora la duración del reveal, no un número que coincidía con ella:
así «entra tras el reveal de su fila» sigue significando lo mismo si la entrada vuelve a
cambiar.

**Y una entrada se queda por encima del listón, con motivo escrito:** el `split-bloom` del 404,
0,9 s. No es una entrada de contenido sino el gesto de marca de una página de error, donde no
compite con nada porque no hay nada más que leer; su curva ya era ease-out (easeOutQuint), así
que nunca fue parte del problema.

### La séptima declaración estaba en la página que publica la regla

La ficha hablaba de seis. Había **siete**: la demo de scroll-reveal del Design System se
dibujaba con una transición inline propia. Y con ella, **tres fuentes y tres respuestas para
las mismas dos cifras** — la página publicaba «600 ms» y «subida de 12px», `globals.css` decía
600 ms y 14px, y la demo, `.5s` y 12px — en la página cuyo trabajo entero es no poder mentir.

**La demo ya no describe el reveal: lo usa.** Sus piezas son `[data-reveal]` normales y el
botón «Repetir» solo les quita y les devuelve `data-shown`; la duración, la curva y el
recorrido los pone la capa. La tabla publicada pasa a 280 ms y a la curva nueva, y el bullet
del recorrido a los 14px reales.

**De paso arregla un incumplimiento del punto 7 del checklist que ningún gate podía ver:** con
`prefers-reduced-motion` el estilo inline animaba igual, porque no preguntaba. La regla vive en
`.reveal-on`, que el island de motion **no** añade con reduced-motion, así que ahora el botón
deja las piezas quietas. Medido: `.reveal-on` ausente y opacidad 1 antes del clic, a los 40 ms
y a los 240 ms.

**Y el primer intento de rebobinado estaba mal, lo cual solo se supo mirándolo.** Quitar
`data-shown` con la transición puesta arranca un fundido *hacia fuera*: al devolver el atributo
un frame después, el elemento sigue casi opaco y no hay recorrido que ver. La medición fue
`opacidad 1 → 1 → 1`, un botón que no hacía nada y compilaba perfecto. Hay que rebobinar **sin
transición** y solo entonces devolverla — que es, exactamente, lo que hacía el código inline
que se retiró.

### El relleno del enlace se queda repintando, y eso es una decisión

`background-size` no es propiedad de compositor. La alternativa —un pseudoelemento con
`transform: scaleY()`— **no puede dar este gesto**: un enlace de contenido parte a mitad de
párrafo, y lo que hace que el relleno crezca por separado en cada línea es
`box-decoration-break: clone`, que es de fondo y de borde, no de hijos; un `::before` absoluto
se dibujaría una sola vez sobre la caja entera. El gesto es de marca (`BRAND.md` §Enlaces) y el
repintado es de un renglón en hover, no de una sección.

### La mejora doble que la ficha esperaba no existe, y es una buena noticia

La ficha daba por probable que bajar la duración mejorase el LCP, porque este mismo reveal se
comió 2.090 ms de *element render delay* en su día. **Ya no puede: D47 cortó el vínculo, no la
duración.** Desde entonces lo que está en el primer pliegue se marca `data-shown` **antes** de
encender `reveal-on`, así que nunca llega a ocultarse. Comprobado sobre el build servido: los
**4** `[data-reveal]` del primer pliegue de la home están todos marcados y en opacidad 1, y el
elemento LCP es la foto del hero.

Así que este cambio es de sensación, no de métrica. La nota de PageSpeed se vuelve a sellar
tras el deploy por el registro (`npm run psi -- --registro`), no porque se espere movimiento.

### El cierre lo puso `/review-animations` y lo decidió un banco, no un argumento

La revisión de motion aprobó el cambio y dejó siete afinados. **Los tres perceptuales no se
razonaron: se montaron.** Un banco con las tres candidatas en columnas **sincronizadas** —en
secuencia no se distinguen— con los tokens reales, los dos temas, un interruptor de
reduced-motion y cámara lenta ×1/×3/×5, porque a 280 ms una curva no se juzga a ojo.

| Decisión | Candidatas | Elegida |
|---|---|---|
| Curva de entrada | `(0, 0, .2, 1)` · `(0.23, 1, 0.32, 1)` · `(0.22, 1, 0.36, 1)` | **`(0, 0, .2, 1)`, la que ya estaba** |
| Hover de `.link-content` | 280 · 200 · 160 ms | **200 ms** (160 de relleno + 40 de retardo del color) |
| Escalonado de un grupo | 60 · 80 · 90 ms | **80 ms** |

**La curva se queda donde estaba, y eso NO es «no se hizo nada».** La revisión pedía una
ease-out más fuerte citando el catálogo, y el catálogo tiene razón en abstracto: `(0.22, 1,
0.36, 1)` decelera mucho más. Vista sobre el bloque real y a la vez que las otras dos, la
fuerte se lee como un frenazo en un recorrido de 14px, que es un desplazamiento demasiado
corto para que una curva agresiva tenga dónde expresarse. **El valor no cambia; lo que cambia
es su estado: pasa de heredado a elegido**, y esa es toda la diferencia entre una decisión y
una omisión. Si vuelve a aparecer, ya está contestada.

**Los otros dos sí se movieron, y los dos en la misma dirección: menos.** El enlace baja a 200
porque no compite por «no pasarse de 300» sino por quitarse de en medio: es un hover de
contenido, y la tabla de frecuencia del catálogo pone eso en «decenas de veces al día», donde
la instrucción no es acortar sino desaparecer. Y el escalonado entra en la banda 30-80 por el
extremo lento, que es donde un grupo de tres o cuatro piezas todavía se lee como grupo.

**Y el color del enlace vuelve a `ease`.** Solo el relleno *entra*; el color del texto y el del
subrayado nada más cambian de valor, y para eso la curva de entrada no aporta. Es la tabla de
decisión del catálogo aplicada por partes en vez de a la declaración entera.

### La puerta del hover, que no era perceptual y estaba desde antes

`.link-content:hover` no tenía `@media (hover: hover) and (pointer: fine)`, así que en táctil el
tap disparaba un hover falso **y se quedaba pegado**: al volver atrás, el enlace seguía relleno
de cian. Se cierra aquí y en su contraparte invertida.

**`:focus-visible` se saca de la puerta**, que es la parte que hay que no olvidar: es la misma
pintura por la vía del teclado y no depende del tipo de puntero. Meterlo dentro habría cambiado
un defecto táctil por uno de accesibilidad.

**El resto de la familia sigue sin puerta** —`.link-chrome`, `.icon-chrome`, `.video-facade`—
y queda señalado, no hecho: son de otra tarea y su hover es una pastilla neutra, mucho menos
llamativa que una inversión de color.

## D136 · `prefers-reduced-motion` retira lo que desplaza, no lo que se funde — 2026-08-27

**La regla, en una línea: se va el `translate` y el `scale`; la opacidad y el color se
quedan.** Lo que molesta a quien activa ese ajuste es el vestíbulo, no que algo aparezca.
Y una animación **mixta se parte** en vez de apagarse entera.

Hasta hoy el sitio tenía un interruptor: siete bloques de `@media (prefers-reduced-motion:
reduce)` que ponían `transition: none` o `animation: none`. Cumplía —el catálogo de motion
no obliga a atenuar—, pero apagaba de paso **dos fundidos puros y tres cambios de color**,
que no tienen nada que retirar.

### El bloque que la ficha citaba no casaba con nada

La tarea abría citando el override del reveal. **Ese selector estaba muerto**, y no se ve
leyéndolo: `RevealRoot` hace `if (reduce) return` **antes** de añadir `reveal-on`, así que
con movimiento reducido la clase no existe y `.reveal-on [data-reveal]` no encuentra nada.

Medido sobre el sitio servido con reduced-motion activo: **0** elementos con `.reveal-on`,
**0** coincidencias de la regla, **34** `[data-reveal]` en opacidad 1 y sin transición. La
protección la daba el island; el CSS solo la repetía, y repetirla hacía creer que el reveal
se apagaba ahí.

**EL REVEAL ES EL ÚNICO FUNDIDO QUE NO SE CONSERVA, y el motivo no es el LCP.** Esta entrada
decía primero otra cosa —que atenuarlo obligaría a poner `opacity: 0` en 34 elementos y
reabriría el mecanismo que costó 2.090 ms (D47)— y **`/review-animations` lo tumbó en el acto**:
el orden de D47 marca el primer pliegue como `data-shown` ANTES de encender la clase, y eso
protege al elemento LCP **de todo el mundo**, no solo de quien no ha activado el ajuste. Serían
los **30** de debajo del pliegue, exactamente los mismos que ya lo hacen en el camino normal, y
ninguno toca la métrica. *(Queda escrito porque es la cuarta vez que este proyecto le da a una
excepción un motivo más sólido del que tiene; el motivo malo es el hallazgo.)*

**El motivo real: es el único efecto ACOPLADO AL SCROLL.** WCAG 2.3.3 habla justamente de la
animación que dispara la interacción, y ahí está la línea que separa este caso de los otros:
los fundidos que sí se conservan ocurren **una vez y no los pide nadie** —el «0» del 404 y el
banner entran al cargar— o duran lo que un gesto —los de hover—. Este se repite **treinta
veces** mientras alguien baja por la página, y a quien ha pedido menos movimiento eso es
exactamente lo que le sobra. Se borra el selector muerto y se queda escrito el porqué; el
`scroll-behavior: auto` sigue, que era lo único que ese bloque apagaba de verdad.

### El reparto, pieza por pieza

| Pieza | Qué anima | Con movimiento reducido |
|---|---|---|
| Scroll-reveal | opacidad + `translateY(14px)` | **Sigue apagado**, y por el motivo de arriba |
| `.split-zero > g` (el «0» del 404) | solo opacidad | **Corre, y en 0,2 s** en vez de 0,9 |
| `.video-facade::after` (velo) | solo opacidad | **Corre** |
| `.link-chrome` · `.icon-chrome` | solo `background-color` | **Corre** |
| `.link-content` | relleno + color + subrayado | **Corre** |
| `.consent-enter` | opacidad + `translateY(12px)` | **Se parte**: `consent-in-quiet`, fundido sin recorrido |
| `.video-play` | `scale(1.08)` | Apagado |
| Pastilla de `CopyButton` | solo opacidad | **Corre** |
| Cabecera del 404 | fundido + deslizamiento | **Se parte**: `motion-reduce:slide-in-from-bottom-0` |

**Y «más suave» también es «más corto», que es la otra mitad de la regla.** El florecer del 404
se conservaba entero: **900 ms** de fundido para quien ha pedido menos movimiento. Ahí «se
queda» no puede significar «se queda igual», porque lo que para el resto es un gesto de marca,
para quien activa el ajuste es una espera. Bajo movimiento reducido corre en **0,2 s y sin
retardo**, sobreescribiendo solo esas dos longhands. La regla completa son tres cosas y no dos:
**fuera lo que desplaza, dentro el fundido, y el fundido más corto.**

**El banner se parte cambiando solo `animation-name`**, no la abreviada: la duración, la
curva y el `both` los sigue poniendo la declaración de arriba, así que no puede acabar con
dos ritmos distintos según el ajuste del visitante.

**La cabecera del 404 se parte sin apagar nada**: `slide-in-from-bottom-0` compila a
`--tw-enter-translate-y: calc(0*100%)`, así que el recorrido se anula y el fundido sigue.
Es mejor que `animate-none` porque no hay que mantener una segunda animación.

### `.link-content` es todo o nada, y eso hay que saberlo antes de intentarlo

La tentación es apagar solo el relleno —que es lo único que «se mueve»— y dejar el color.
**No se puede:** si el relleno cian salta instantáneo y el color del texto tarda sus 160 ms,
hay una ventana con `--foreground` sobre `--primary` —gris oscuro sobre cian oscuro en tema
claro— que es ilegible. Los dos extremos de la transición pertenecen a la misma regla (D35)
y aquí además **al mismo umbral**. Como no hay desplazamiento en ninguna de las tres
propiedades, «todo» es la respuesta correcta.

### Lo que esto le cuesta al censo

Pasa de **2 animaciones selladas a 3**, porque `consent-in-quiet` es una más. El sello lo
detecta y `check:palette` lo exige, así que la pasada completa entró en la tarea en vez de
quedar pendiente: **28 corridas, 414 pares de texto y 300 contornos, metro validado en las
28, cero bajo AAA y cero por debajo del 3:1.** `LAST_A11Y_REVIEW` ya estaba en la fecha de
hoy y no se toca.

## D137 · El gesto de marca son dos piezas, y una manda sobre la otra — 2026-08-27

**La firma es el punto de «Del discovery al dato.», que cae y se asienta. La textura es
«Estratos», el filete que crece bajo el año en Hitos.** No son dos gestos: son uno y su
acompañamiento, y decirlo importa porque **dos firmas compitiendo serían peor que ninguna**.
P81 pedía UN momento memorable, no un repertorio.

Que la firma acabara siendo el punto no estaba en ninguna de las tres direcciones que se
prototiparon: **lo propuso Francisco al ver la primera ronda**, y es mejor respuesta que las
tres. Está en el titular, en el primer pliegue, es lo primero que se ve, y **ya existía**: no
es un elemento inventado para tener un gesto.

### Se eligieron viéndolas, y lo descartado es la mitad del valor

Dos rondas de `/prototype`, las dos con los tokens reales, los dos temas y el interruptor de
movimiento reducido.

**Ronda 1 — la textura.** Tres direcciones sobre secciones distintas: «Recorrido» (el camino
de las seis etapas, con el bucle que el copy ya nombra), «Estratos» (el tiempo en Hitos) y
«Registro» (la forma del split traída al contenido).

**«Registro» se descarta, y el motivo es de la DIRECCIÓN, no de la ejecución.** Se llegó a
montar sobre el sitio real para verlo servido. Cada fila tiene su propio progreso, así que a
media pantalla siempre hay tres o cuatro en fases distintas, y esa mezcla no es un instante de
paso: **es el estado permanente**, visible ya al cargar. Ahí está la diferencia con «Estratos»,
que tiene exactamente la misma mezcla y no molesta: *un filete a medio dibujar se lee como «en
progreso»; un símbolo del split a medio registrar se lee como un error de impresión*, porque
desalineado es justo la señal de que algo está mal calibrado. **El estado de reposo del gesto
era un estado que parece roto.** Y no se arregla afinando: acortar el recorrido lo saca de
pantalla, y gobernar las seis desde un solo reloj mueve el problema de sitio.

**Ronda 2 — la firma.** Cuatro formas de aterrizar, cada una con un eje distinto: «Caída»
(gravedad), «Deriva» (inercia), «Sello» (impacto) y «Cursor» (confirmación). Gana **Caída**.

### Lo que la firma tiene de particular

**El punto se separa en el COMPONENTE, no en el diccionario.** Para animarlo necesita ser su
propio elemento, y la tentación es quitarle el punto al copy. No: el diccionario es la fuente
de verdad y una frase sin su punto **dice algo que no es**. La separación es de presentación y
vive donde se pinta. Vale para los dos idiomas sin condicionales —los dos titulares terminan
igual— y si algún día uno no lleva punto se pinta entero y no hay gesto.

**Dos curvas, y esa es la dirección elegida.** La bajada **acelera**
(`cubic-bezier(.55,0,1,.45)`), que es lo que hace la gravedad; un ease-out ahí leería como
frenada, no como caída. El asentamiento sí decelera. El rebote es **0,20**, elegido barriendo
el 0,1–0,3 que el catálogo de motion da por sobrio.

**Dura 420 ms, por encima del listón de 300, y es la segunda excepción escrita** —la otra es el
florecer del 404 (D135)—. Misma coartada y medida igual: ocurre **una vez, al cargar**, es el
único gesto del sitio que existe para ser recordado, y no compite con nada porque el titular ya
está pintado.

**El titular no nace invisible, que era la restricción dura.** Solo se anima el `span` del
punto; el `h1` está en opacidad 1 desde el primer frame, y el elemento LCP de la home es la
foto. Y el punto ocupa su hueco desde el principio —`inline-block` con la línea base explícita,
y solo `transform`/`opacity`—, así que **no hay CLS**: medido sobre el sitio servido, la caja
del `h1` y la posición del subtítulo no se mueven ni un píxel en cuatro muestreos durante la
animación.

### El morado, que era la pregunta abierta, y ya no lo es

La tinta es **`--progress-ink`**, el morado calibrado para texto grande sobre `--background`.
Un punto es un detalle tipográfico y no un gráfico que haya que entender, así que §Color deja
entrar el morado; pero **es texto**, así que había que medirlo antes de darlo por bueno.

Medido sobre el píxel pintado y **con el metro validado primero contra los anclajes de
`BRAND.md`** (13,79 claro y 15,32 oscuro, reproducidos exactos): **7,21 en claro y 7,83 en
oscuro**. Eso es AAA por el umbral **estricto** de texto pequeño, no solo por el de texto
grande que le tocaría a 80px. No hay debate.

**Y el censo lo confirma solo:** pasa de **414 pares a 416**. Los dos que aparecen son
exactamente el punto en cada tema. 28 corridas, metro validado en las 28, cero bajo AAA.

### Lo que `/review-animations` encontró, y que no se veía mirando la página

**El estado por defecto de un gesto de scroll no es su estado final.** `--rp` se registró con
`initial-value: 1` porque parecía lo sensato —«si el navegador no puede animarlo, que enseñe el
final»— y es correcto **para una animación que va a correr**. En un motor sin
`animation-timeline` la animación no existe, y ahí el estado final deja de ser un final: es un
adorno permanente. Firefox pintaba **los cinco años con su filete cian a la vez y para
siempre**, más los índices oscurecidos: un diseño que nadie aprobó, invisible desde Chrome, y
contradiciendo por escrito lo que el propio comentario del bloque prometía.

Son dos cambios y van juntos: el valor por defecto pasa a **0**, y **todo lo que pinta se mete
dentro del `@supports`**, no solo la animación. Lo segundo es la mitad que se olvida: con las
reglas de dibujo fuera, el navegador sin soporte las aplica igual y solo se queda sin el
movimiento. Comprobado sobre el CSS compilado —que es donde se ve, no en el fuente—: no queda
ni una regla de `.hito-anio` fuera del bloque.

**La regla que sale de aquí:** en mejora progresiva, el estado sin soporte se elige mirando la
página de ANTES, no el fotograma final de la animación. Se pierde el adorno; no se gana otro.

**Y dos de calidad, aplicadas a la vez.** El comentario de la caída explicaba la curva pero no
decía contra qué regla iba: `cubic-bezier(.55,0,1,.45)` es un `ease-in`, que el catálogo
prohíbe en UI, y una excepción que no nombra la regla que rompe no es una excepción escrita
sino una preferencia con buena prosa. Y el índice de cada fila cambiaba de color con el scroll:
`color` no es propiedad de compositor, repintaba en cinco filas por frame, y no decía nada que
el filete no dijera ya. Retirado.

### Un hallazgo de método que costó dos intentos

**El censo no cabe en una llamada de primer plano** —28 corridas con navegador se comen los 600
segundos— **y en segundo plano solo arranca con el sandbox desactivado**. Sin él muere en dos
segundos con `0xC0000142` al lanzar Chrome, que es un fallo de arranque de proceso y no del
script.

Y el primer diagnóstico fue falso: se anotó «no cabe en el reloj» cuando la segunda pasada
había fallado en dos segundos. **Una sospecha no es una causa**, y la diferencia entre las
llamadas que funcionaron y la que no era el sandbox, que ya estaba escrito para `agent-browser`
y no se había heredado a lo que conduce el navegador por debajo.

---

## D138 · El cupo de `General` no se puede comprobar, y lo que sí se mide es el embalse — 2026-08-28

**Contexto.** `CLAUDE.md` drena la deuda transversal por **cupo**: «cada sprint arrastra 3-4
tareas de `General`», y «una revisión no cierra dejando en `General` más tareas nuevas de las
que ese cupo va a sacar». La escribió el cuarto `method-review` después de medir el bloque; un
sprint más tarde, `General` había ganado **6 netas** y estaba en 34 abiertas contra 2 cerradas
en toda su vida, 2,6× el siguiente bloque. El quinto `method-review` lo volvió a encontrar.

**El hallazgo no es el tamaño: es que la regla no tenía instrumento.** Cuando una tarea se mueve
de `General` a un sprint **pierde de qué bloque venía** —`Etapa` es una sola propiedad, y
`CLAUDE.md` acepta ese coste por escrito antes que añadir una séptima—, así que es literalmente
**imposible saber si el cupo se cumplió alguna vez**. Una regla sin instrumento es una nota, y
esta la escribió la propia revisión que existe para cazar ese patrón.

**Decisión.** No una propiedad nueva: la vía ya estaba rechazada y el argumento sigue siendo
bueno. Se mide **el neto**, que es lo máximo que el esquema permite.

- **La regla, en `scripts/tablero/reglas.ts`** — `medirGeneral()` cuenta las abiertas del bloque
  transversal y las resta del sello anterior. Es la quinta regla del guardián, y **su hallazgo
  `general-no-drena` sale por la misma puerta que los otros cuatro**: `check:tablero` en rojo.
- **El umbral, acordado con Francisco el 2026-08-25** — **verde ≤ 0** · **ámbar +1 a +3**, que
  se dice y no falla, porque una tarea nueva no significa que el cupo se haya saltado · **rojo
  ≥ +4**.
- **El sello es una constante fechada en `check-tablero.ts`**, no un archivo de estado. Es un
  número que solo cambia al cerrar una etapa: un almacén sería la segunda fuente de verdad para
  un dato que se toca tres veces al mes. Mismo régimen que el techo de `check:contexto`. **Se
  actualiza al CERRAR**, nunca al pasar por aquí — si se refrescara solo, la variación sería
  siempre 0 y el guardián no diría nada, que es el verde falso de siempre.
- **Y publica la cifra aunque esté verde.** El informe imprime el tamaño y la variación en cada
  corrida, no solo cuando falla: es la regla de este repo de que un metro afirme cuánto ha
  mirado.

**El sello nace bajo a propósito, y conviene que quede escrito.** La ficha midió 34 abiertas.
Entre que se escribió y que se implementó, el sprint «Drenaje» **comprometió 16 tareas de
`General`** y el bloque bajó a **18**, que es el cupo funcionando a lo grande. El primer sello
es 18 y no 34: el próximo cierre se mide contra un suelo honesto y no contra el máximo
histórico, aunque eso haga más probable que el primer veredicto sea ámbar.

**Lo que NO puede hacer, y hay que saberlo antes de creerse un verde.** No dice si el cupo se
respetó — solo si el embalse sube o baja. Es menos de lo que la regla pedía. **Si el neto sale
rojo dos cierres seguidos, la conversación ya no es sobre el cupo: es sobre si `General` debe
existir tal como está.**

**Validado disparándolo.** Cuatro casos nuevos en `npm test` —el sano con sello al día, el
descenso que es verde y no ámbar, la tarea suelta que es ámbar, y las cuatro que son rojas— más
el borde que deja pasar 3. Y su caso malo entra en `check:guardianes`: subir `VARIACION_ROJA` de
4 a 400 deja el guardián **imprimiendo su línea y sin rechazar nada**, que es exactamente la
forma en que este tipo de gate se muere. Comprobado que muerde: 1 de 20 tests en rojo con la
mutación puesta, 20 verdes al restaurarla.

---

## D139 · Un trinquete cuyo trinquete se mueve es un termómetro que se repinta — 2026-08-28

**Contexto.** `check:contexto` (D69) puso techo al contexto de arranque y funcionó: el arranque
bajó de 19.805 palabras a ~12.000. Lo que no vigilaba nadie es **el techo**. En nueve días tuvo
**siete valores, en las dos direcciones** —16.000 → 13.500 → 12.500 → 12.400 → 12.200 → **12.700**
→ 12.300—, y el margen **nunca pasó de 442 ni bajó de 5**.

**La medición que lo cierra.** El sprint «Home» hizo la primera retirada real desde el 22 de
agosto: **−651 palabras** al partir el porqué de `CLAUDE.md` a su histórico. **El margen pasó de
246 a 253.** Retirar 651 compró **7**, porque el techo bajó 400 en el mismo commit. El techo de la
suma de skills tiene la misma firma: nació el 27-08 en 20.500 sobre 20.296, o sea **ya tocando**.

Es familia propia en el catálogo de `method-review` —**«el umbral que persigue al dato»**— y se
separa de «la cifra apuntada que caduca» **por el remedio**: aquella es un número que envejece
porque nadie lo toca; esta es un número que se actualiza *demasiado bien*.

**Decisión, en dos piezas que solo funcionan juntas.**

1. **El techo se DERIVA de su historial, que pasa a ser DATO.** `HISTORIAL_TECHO`,
   `HISTORIAL_TECHO_SKILL` y `HISTORIAL_TECHO_SUMA` son arrays de `{fecha, valor, motivo}`, y
   `TECHO = vigente(HISTORIAL_TECHO)`. **No se puede mover un techo sin añadir una entrada, y una
   entrada exige `motivo`: lo pide el tipo.** De paso desaparece la duplicación que tenía el
   archivo —la lista en prosa arriba, el valor abajo—, que es exactamente cómo una de las dos
   mitades acaba diciendo otra cosa.
2. **Se cuentan los movimientos del ciclo en curso**, contra `CICLO_ABIERTO`, y se publican en
   cada corrida con su motivo: **verde 0 · ámbar 1** —el trinquete apretando, que es su trabajo—
   **· rojo ≥ 2**, que ya no es apretar sino perseguir al dato. Se cuenta **por techo**: dos
   movimientos del mismo en un ciclo es la firma; dos de techos distintos puede ser un ciclo que
   compactó en dos frentes.

**Por qué en el repo y no en `git log`.** La alternativa era arqueología de commits sobre la
constante. Sale peor: depende de la profundidad del `fetch` en CI, no puede exigir un motivo, y
convierte en implícito lo que aquí es un campo obligatorio. Criterio de D51 igualmente cumplido —
se dispara en un evento y no requiere criterio—, pero sin depender del historial de git.

**Y el criterio de cierre se cumplió sin tocar el techo, que era la mitad difícil.** El margen
pasó de **253 a 405** (12.047 → 11.895 sobre el mismo 12.300) **retirando copias, no reglas** — y
además **añadiendo dos**, la del cupo (D138) y la de los dos sellos de apertura y cierre:

| Qué se retiró | Dónde estaba repetido |
|---|---|
| La descripción del gate de accesibilidad | `CLAUDE.md` **y** la tabla de contrato de `PRD-Live` (D128) |
| El reparto de los 9 puntos del checklist | En prosa **y** en la tabla de la DoD |
| El porqué de cada excepción de control | `BRAND.md`, `BRAND-historical.md` **y** la marca `@fuera-de-capa` que imprime `check:excepciones` |
| El historial de los tres techos | El comentario **y** —ahora— el dato |

Es la **primera vez que el margen sube solo por trabajo del dato**, que es justo lo que la regla
nueva existe para forzar.

**Lo que NO puede ver.** Si es el **objetivo** el que persigue al dato en vez del techo, esto no
lo mira: el objetivo no falla, solo tira, y un objetivo que se relaja se nota en que la distancia
no baja. Se vigila lo que muerde.

**El sello es ritual de apertura, y está escrito donde se hace.** `CICLO_ABIERTO` se actualiza al
**abrir** una etapa, igual que `SELLO_GENERAL` (D138) se actualiza al **cerrarla**. Los dos están
en `CLAUDE.md` §Gestión de etapas, uno a cada lado del cruce.

**Validado disparándolo.** Caso malo en `check:guardianes`: retrasar `CICLO_ABIERTO` a 2026-08-01
mete los siete movimientos reales dentro de la ventana. Sale rojo nombrando los dos techos
afectados y con código 1; restaurado, verde. Se muerde la apertura del ciclo y no el historial a
propósito: inventar un movimiento que no ocurrió vale menos que contar los que sí.

---

## D140 · La página de accesibilidad tiene el guardián del artículo, y el aparato sale a un sitio compartido — 2026-08-28

**Contexto.** D84 le dio al artículo un guardián de caducidad: cada sección declara de qué
depende, se sella, y cuando una fuente se mueve CI sale rojo **nombrando la sección**, en el PR
que la mueve. `/accesibilidad` publica exactamente el mismo tipo de frase —qué mide cada gate,
cuántos guardianes hay, qué cubre el censo de contornos, qué encontró la pasada con NVDA, qué
queda pendiente— y **no tenía nada**. Por eso «aún no hay formulario de contacto» sobrevivió
tres días al sprint que construyó el formulario, y se encontró **de casualidad, leyendo la
página**.

Y P70.02 subió la apuesta: la página pasó de 5.399 a 12.066 caracteres y de cinco secciones a
siete, casi todo afirmaciones comprobables sobre el propio repo.

**Lo que se encontró antes de escribir una línea.** La página decía «son **catorce**
comprobaciones y **veintitrés** errores fingidos». Contados: **quince y veintisiete**. Las dos
cifras llevaban caducadas desde que alguien añadió un caso, porque **nada las ataba al
inventario**. La tarea nació de una frase caducada y encontró otras dos vivas.

**Decisión, en tres piezas.**

1. **El aparato sale a `scripts/dependencias/huella.ts`.** La resolución de las tres formas de
   dependencia —archivo, `archivo.md#fragmento`, `directorio/`— y el hasheo por bloque dejan de
   ser del artículo y pasan a ser compartidos. Copiarlos habría dejado **dos metros midiendo
   distinto**; es la Regla de construcción de `CLAUDE.md` aplicada a `scripts/`. El artículo los
   re-exporta, así que ningún importador cambió.
2. **`check:accesibilidad`**, con su `--seal`, sobre los **cinco bloques que afirman algo
   verificable** (`conformance`, `measures`, `verify`, `blindspot`, `limits`). Fuera quedan
   `hero`, `indice`, `term` y `report` —rótulo, navegación, definición y un correo: no hay
   fuente que se mueva debajo— e `inheritance`, que el componente ya deriva. Meterlos daría
   rojos que no significan nada, y a la tercera vez nadie lee el rojo.
3. **Las dos cifras del arnés dejan de escribirse a mano.** `GUARDIAN_COUNT` y
   `GUARDIAN_CASE_COUNT` viven en `lib/design-values.ts`, el copy interpola
   `{comprobaciones}` / `{fingidos}` con `cardinal()` —como ya hacía con `{paginas}`— y el
   guardián **contrasta el valor publicado contra `scripts/guardianes/casos.ts`** en cada PR.

**Por qué SELLADAS y no derivadas, que es la única elección no obvia.** `PAGE_COUNT` sale de
`PAGE_SLUGS` porque ese registro ya está en el bundle. El inventario de casos malos vive en
`scripts/`, y traérselo al navegador para contar dos números enviaría a cada visitante una
treintena de mutaciones de archivos que nunca va a ejecutar. Así que el valor se escribe una vez
y el guardián lo mantiene honesto: **D38 con el guardián puesto donde la derivación no llega.**
Para poder contarlas sin arrancar la maquinaria, `CASOS` salió a `scripts/guardianes/casos.ts`
—misma partición que `scripts/tablero/reglas.ts`: el dato aparte de la E/S—.

**Por qué es OTRO guardián y no una fila de `check:articulo`.** Dos documentos con dos ritmos:
el artículo describe cómo se construyó el sitio y se mueve con la arquitectura; esta página
describe lo que el sitio **cumple hoy** y se mueve con una medición. Un solo sello los mezclaría
y haría que retocar el artículo pidiera releer los límites. El aparato sí es el mismo, y por eso
está compartido.

**El susto que dejó una regla.** Al mover el hasheo se copió su separador como un **espacio**, y
el original era un **byte NUL**. Consecuencia: los doce sellos del artículo cambiaban, y
re-sellar habría congelado la mentira sin que nadie lo notara — el guardián habría seguido
saliendo verde midiendo otra cosa. Se cazó porque el número de secciones movidas pasó de 4 a 12
sin motivo. **Lo que lo escondió tiene nombre:** el byte NUL hacía que `grep` tratase el archivo
como **binario** y lo dejara fuera de toda búsqueda de texto, así que el separador era invisible
a la herramienta con la que se lee este repo. Ahora va como escape (`\0`), que compila al mismo
carácter y deja el archivo legible.

> **Regla que sale de aquí, y va al catálogo de método:** al mover una función que alimenta un
> HASH, la prueba no es que compile — es que el hash **no cambie** sobre el mismo árbol. Un
> sello es un metro cuyo fallo es un verde.

**Lo que NO cubre, dicho para que no se dé por cubierto.** Las cifras sin fuente en el repo:
«tres páginas se desbordan por debajo de 320» y «dieciséis pares sobre fotografía» son
**mediciones**, no archivos, y no hay nada que sellar debajo. Están atadas a las tareas que las
cerrarán, y ese día habrá que venir a mano. Y que el párrafo diga la verdad lo decide una
persona; esto existe para que sepa cuándo mirar.

**Validado disparándolo**, con dos casos malos en `check:guardianes`: mover `lib/figures.ts`
—fuente de los «Límites», donde la página dice que dos diagramas se miden y no se juzgan— y
publicar un recuento de casos que ya no es el que hay. Y afirma cuánto ha mirado en cada
corrida: cinco bloques, trece dependencias, dos cifras.

---

## D141 · El 404 de un enlace saliente lo sirve un tercero, así que no sale en ningún gate — 2026-08-28

**Contexto.** P70.105 le añadió cinco enlaces externos a `/accesibilidad` —WCAG, axe-core,
Lighthouse, NV Access, The A11Y Project—. Se comprobaron **a mano** al cerrarla, y esa es
exactamente la forma de fallo que nombra `BRAND.md` §Cómo se escribe una regla, punto 2: *una
regla que hay que recordar es una regla que se incumple*. La propia ficha de aquella tarea lo
señaló como riesgo antes de ejecutarla.

**Y duele más aquí que en otro sitio.** El 404 de un enlace saliente **lo sirve un tercero**: no
aparece en `check:marco`, ni en `gate:html`, ni en el build. No lo ve nadie hasta que lo
encuentra un lector. Y la página donde primero pasaría es la que presume de no mentir.

**El recuento, que era lo primero que pedía la tarea.** No eran siete: el barrido sobre `app/`,
`components/`, `content/` y `lib/` encuentra **23 enlaces externos** en 181 archivos, más 7
descartados. Los siete de `/accesibilidad` eran la punta.

**Decisión.** `npm run check:enlaces`, con **la E/S y el criterio separados**, igual que
`check:tablero` (D107):

- **`scripts/enlaces/reglas.ts`** — funciones puras sobre texto: qué es una URL, qué no es un
  enlace, qué cuenta como muerto, qué redirección merece informe. Sin red. Las prueba `npm test`
  en CI, con caso bueno y caso malo por regla.
- **`scripts/check-enlaces.ts`** — el barrido y las peticiones. Corre **fuera de CI**: sale a la
  red, y un servidor ajeno caído cinco minutos pondría un PR en rojo sin que nada de este repo
  esté mal. Es el argumento de D49/D99 para `psi`, aplicado igual.

**La lista sale del DISCO, no de una lista escrita**, que es lo que hace que un enlace nuevo
entre en la comprobación sin que nadie se acuerde (misma forma que `PAGE_SLUGS` en D72). Y cada
descarte **se imprime con su motivo**: un metro que descarta en silencio miente igual que uno que
no mira.

**Dónde se equivoca un metro así, que es la parte que costó pensar.**

| Respuesta | Veredicto | Por qué |
|---|---|---|
| 404 · 410 · 500–599 | **muerto** | El enlace no lleva a ninguna parte |
| DNS sin resolver · tiempo agotado | **muerto** | Las dos formas en que un dominio muere de verdad |
| 401 · 403 · 405 | **no concluyente** | Varios sitios los devuelven a quien no parece un navegador |
| < 100 o ≥ 600 | **no concluyente** | No es HTTP: es un escudo antibot |

**Y el primer falso positivo lo dio él solo, en su primera corrida:** puntuó como caído el perfil
de LinkedIn, que responde **999** — el escudo antibot de LinkedIn—, porque la regla decía
`status >= 500`. Es el punto 7 de `BRAND.md` §Cómo medir con otra ropa: **un umbral mal aplicado
inventa hallazgos igual que un metro mal calibrado**. Se corrigió antes de escribir nada más, y
el caso está en `npm test` con su nombre.

Se mitiga además por el lado de la petición: **User-Agent de navegador, redirecciones seguidas, y
`HEAD` con reintento en `GET`** porque hay servidores que solo rechazan el `HEAD`.

**Una redirección no falla, pero se informa — y solo si cambia de HOST o de RUTA.** Las que solo
añaden idioma o parámetros de seguimiento no dicen nada (`developer.chrome.com` devuelve `?hl=`
según quién pregunte) y llenarían la salida de ruido, que es cómo un informe deja de leerse. Una
redirección real sí importa: es el 404 de mañana, cuando el tercero deje de mantenerla.

**Estado en la primera corrida:** 23 enlaces, **ninguno caído**, 3 no concluyentes (LinkedIn,
securityheaders y w3.org, los tres con escudo antibot y los tres verificados a ojo) y 2
redirecciones reales.

**Lo que NO puede ver, dicho para que no se dé por cubierto:** que la página de destino siga
diciendo lo que el texto del enlace promete. Detecta que la URL responde, no que sea la misma
página. Un dominio caducado y recomprado devuelve 200 tan campante.

---

## D142 · La tarjeta OG repetía el copy de la página y nadie las comparaba — 2026-08-28

**Contexto.** `app/api/og/route.tsx` llevaba una constante `COPY` con dieciséis cadenas (8
tarjetas × 2 idiomas) que repetían texto ya escrito en los diccionarios. Los dos guardianes que
tocan esa ruta miran otra cosa: `check:marco` (D75) comprueba que el `?card=` de cada variante
resuelve a **su** tarjeta, y `check:rutas` (D72) que la unión `OgCard` cuadra con el registro de
páginas. **Ninguno mira el texto de dentro.**

**No es hipotético.** Al afilar el kicker del Hero (P83), cambiar una cadena resultaron ser
**tres sitios**: `es/home.json`, `en/home.json` y ese literal. El tercero no lo señaló ningún
check — apareció por un `grep` hecho a mano antes de tocar nada. Y es la familia que este repo ya
cerró dos veces, **D60** (una fuente única no mantiene al día una copia impresa) y **D72** (qué
páginas hay estaba escrito a mano en cuatro sitios): era la última instancia abierta.

**La premisa de la tarea era falsa, y en la dirección que amplía el arreglo.** Decía que tres
tarjetas —`cookies`, `contacto` y `sobre-mi`— no tenían de dónde leer, así que no se podían
comparar. Sí lo tienen: `title` y `kicker`, **sueltos en la raíz** en vez de bajo `hero`. Con eso,
**las dieciséis parejas son comparables** y el guardián hace 32 comparaciones en vez de las 10
que la ficha daba por alcanzables.

**Decisión.** `COPY` sale de la ruta a `content/og/copy.ts` —dato aparte de quien lo ejecuta,
misma partición que `scripts/tablero/reglas.ts` y `scripts/guardianes/casos.ts`, y aquí además
necesaria para que el guardián lo lea sin importar `next/og`— y `npm run check:og` lo compara en
CI con tres reglas:

1. **Lo que no está declarado como distinto, tiene que coincidir.**
2. **Una divergencia declarada tiene que seguir divergiendo.** Si vuelve a coincidir, sale rojo:
   una excepción que ya no muerde es una nota caducada haciéndose pasar por regla — la lección
   que `check:guardianes` se llevó dos veces con sus casos malos.
3. **La clave del diccionario tiene que existir**, por su ruta EXACTA.

**Por qué se declara y no se deriva.** Derivarlo obligaría a la ruta OG a importar ocho
diccionarios de página × dos idiomas para sacar dos cadenas de cada uno, y esa ruta se sirve en
frío. (El motivo que daba la ficha —«tres no tienen de dónde leer»— era el falso.)

**La ruta se declara, no se adivina, y esto es lo que más se acercó a un verde falso.** Hay
**tres formas vivas** de guardar el par: `hero.title`, `hero.headline` (la home) y la clave suelta
en la raíz. Un `??` encadenado buscando en las tres habría **dado verde sobre una clave que ya no
existe**, que es exactamente el modo de fallo que este guardián viene a cerrar. Con la ruta
declarada, una reestructuración del copy sale roja diciendo qué ruta ya no resuelve.

**La única divergencia viva, ahora con motivo escrito:** el kicker de «Cómo se ha creado esta
página» dice `Making-of` en la tarjeta y «El «Making of» de franciscolopez.es» en la página,
porque el largo no cabe en 1200px. Antes eso era indistinguible de un descuido; ahora está
declarado, y **el propio guardián exige que siga siendo distinto**.

**Por qué merece gate propio y no una fila de `check:marco`:** aquél mide el HTML prerenderizado
y necesita el build; esto compara dos ficheros de datos y corre con los guardianes baratos. Y el
coste de que falle es alto para lo barato que es: la tarjeta OG es la primera impresión del
tráfico que llega por recomendación, y el único texto del sitio que no mira nadie.

**Validado disparándolo**, con su caso malo en `check:guardianes`: se toca el titular en
`es/home.json` —la dirección en que ocurre de verdad, porque el copy se edita donde se lee— y el
guardián nombra la tarjeta, el idioma y el campo.

---

## D143 · Un PR dice ahora qué secciones publicadas toca, y distingue el copy de la dependencia — 2026-08-28

**Lo que pidió Francisco**, con sus palabras: «necesito que cuando se cambie algo automáticamente
en el artículo o en otra sección se me avise de forma explícita antes de subir, algo como *esta
PR modifica Artículo secciones 1, 2, 6 añadiendo/modificando X, Y, Z*, para poder revisarlo».

**El hueco era de PORTADOR, no de herramienta.** Las dos piezas existían y ninguna llegaba:
`articulo:novedades` dice qué líneas se movieron pero **no está en CI**, así que solo lo ve quien
lo lanza a mano; `check:articulo` sí está en CI, pero **en verde solo dice «el sello cuadra»** y
no nombra ninguna sección. El 2026-08-27 se re-selló §s09 por un cambio de fecha y CI pasó a
verde sin nombrarla: que Francisco se enterara dependió de que se le contara en prosa, que es
justo lo que pide que deje de depender de una persona.

**Y `articulo:novedades` no valía tal cual, por un motivo que costó verlo.** Aquel compara contra
el **sello vigente**, y para cuando el PR llega a CI su autor ya ha re-sellado: no queda
diferencia que contar. La pregunta de un PR es otra —**qué cambia respecto a `main`**— y se
contesta comparando las dos puntas, no contra el sello.

**Decisión.** `npm run novedades` (`scripts/novedades-pr.ts`), paso de CI en los PR por el
criterio de D51 —se dispara en un evento y no requiere criterio—, con cuatro elecciones que son
las que deciden si sirve:

1. **Distingue copy de dependencia.** *Cambió el copy* → hay que leerlo, es texto que verá un
   visitante. *Se movió el sello* → casi nunca: los permalinks a `DECISIONS.md` se desplazan
   solos con cada entrada nueva, y el 2026-08-27 eso movió 82 líneas de HTML sin cambiar una
   palabra.
2. **Sale en el RESUMEN del job** (`$GITHUB_STEP_SUMMARY`), que es donde se lee un PR, no
   enterrado en un log de cuatrocientas líneas. Fuera de CI escribe por pantalla y sirve igual
   antes de abrir el PR.
3. **Nunca falla.** Informa; no juzga. Un aviso que puede poner un PR en rojo se acaba
   silenciando, y aquí lo que hace falta es que se lea.
4. **Y no se calla cuando no ha podido comparar.** Si la base no resuelve, lo dice en el propio
   resumen. Una salida vacía se leería como «no cambia nada», que es el verde falso de siempre.

**El alcance se decidió, no se supuso.** La ficha dejaba abierto si se extendía más allá del
artículo. La respuesta la había dado P50.73 dos tareas antes: `/accesibilidad` ya tiene sellos por
bloque, así que entra. Son **dos superficies**, y añadir una tercera es añadir su fila.

**Y el paso enseñó algo del metro de al lado.** Escrito como `run: npm run novedades -- "${{ ...
}}"`, el recuento de pasos de CI que el artículo dibuja **no lo veía**: su patrón busca `run: npm
run <script>` a final de línea, y con argumentos dejaba de casar. Pasarlo por `env:` lo arregla y
además quita un `${{ }}` interpolado dentro de una línea de comando, que es el vector de
inyección clásico de Actions. **Las dos cosas se arreglan con el mismo cambio**, y sin él el
diagrama habría dibujado 23 pasos habiendo 24.

**No lleva caso malo en `check:guardianes`, y es deliberado:** no es un guardián. Su modo de
fallo no es dar verde sobre algo roto, sino callarse — y contra eso está la guarda del punto 4,
que es lo que sí se puede comprobar.

---

## D144 · La invariante del pliegue se rompió tres veces y siempre la vio un ojo — 2026-08-28

**La invariante.** Brand Kit, Design System, Accesibilidad y Contacto comparten
`md:min-h-[calc(100svh-5rem)]` y centran su grupo de apertura con `my-auto`. **Centrar reparte el
sobrante arriba y abajo, así que solo es seguro mientras los grupos midan lo mismo.** Está
escrito con esas palabras en `components/ui/layout.ts`.

**Y aun así se rompió tres veces, y las tres las encontró Francisco cambiando de pestaña:**
grupos a 428/484/477; Accesibilidad a 505 contra 461 al ganar un párrafo de fecha (P70.29); y
Contacto a 297 por estructura, que se cerró con un SUELO de 29rem y no compactando (P70.35). Una
regla escrita, tres incumplimientos y cero guardianes: es el punto 1 de `BRAND.md` §Cómo se
escribe una regla —la condición hay que comprobarla **donde la cosa ocurre**, y aquí ocurre en
píxeles pintados.

**Decisión.** `npm run pliegue`, **fuera de CI** junto al censo y a `psi` porque necesita
navegador y servidor delante. Mide a **1920×1080** el alto del grupo y la posición del `h1` de
cada apertura, y falla si se separan más de **8px**.

**Cuatro elecciones, y ninguna es obvia.**

- **Quién entra no se escribe.** Se recorren las páginas del registro (`PAGE_SLUGS`, D72) y entra
  la que **tenga grupo de pliegue, detectado en el DOM**. Una apertura nueva entra sola; una que
  deje de usarlo, sale sola. Las diez que no lo tienen se **cuentan y se nombran**, no se saltan.
- **Se busca por el TEXTO del atributo `class`, no con un selector CSS.** Las utilidades de
  Tailwind llevan corchetes y dos puntos (`md:min-h-[29rem]`), que en un selector hay que
  escapar, y el escapado mal puesto ya rompió cuatro comprobadores de este repo en una sola
  tarea. Leer el atributo como texto no tiene escapado que equivocar.
- **La tolerancia sale de medir el ruido**, no de elegirla: las cuatro miden hoy **464 y 389
  exactos**, y las tres regresiones reales fueron de 44, 56 y 164 px. 8 las caza todas sin saltar
  por un redondeo subpíxel.
- **El viewport es 1920×1080 a propósito.** Es donde `md:` aplica y donde el sobrante del
  centrado es mayor. El eje estrecho —1280×618— es de `viewport-verifier` (D52), y mide otra
  cosa: que la apertura no **desborde**. Aquí se mide que las cuatro **coincidan**.

**Validado reproduciendo la regresión, no inventándola.** Se reinyectó en el DOM el párrafo de
fecha que causó P70.29 y el metro devolvió **505 / 368** — las cifras exactas que quedaron
escritas en `layout.ts` el día de aquella regresión. Contra los 464/389 de las otras tres, son 41
y 21 px de separación: rojo con holgura sobre la tolerancia de 8.

**Y de paso, el conductor del navegador dejó de estar escrito dos veces.** La resolución del
binario de `agent-browser` —con su rodeo por la CVE-2024-27980 en Windows— y el desenvuelto doble
del JSON que devuelve `eval` los había escrito el censo. Ahora viven en
`scripts/navegador/agent-browser.ts` y los comparten los dos: dos conductores se arreglan por
separado el día que el binario cambie de sitio.

**Un cuelgue que cuesta una hora si no está escrito:** `set viewport` **sin ninguna página
abierta se queda esperando**, no falla. Se abre primero y solo entonces se fija el tamaño.

**DESDE D156 (2026-08-29) YA NO ES EL ÚNICO GUARDIÁN, y solo para tres de las cuatro.** Brand
Kit, Design System y Accesibilidad salen de una pieza compartida y no pueden divergir: este gate
pasa ahí a red de seguridad. **Contacto sigue dependiendo solo de él** — no entra en el bloque,
y el porqué está en D156.

**Lo que NO cubre:** las aperturas que comparten el andamiaje del pliegue pero no esta familia
—el deep-dive, «Cómo se ha creado» y la home—. Sus aperturas son tipográficas, de alto constante,
no se comparan de un vistazo con estas cuatro y cada una tiene su hueco razonado en su archivo.
Esa exclusión no está escrita en el guardián: **sale sola**, porque no llevan `FOLD_GROUP`.


## D145 · Los dos gates de servidor mentían de la misma forma: uno callando y el otro con una sola muestra — 2026-08-28

Son dos fallos distintos y la misma familia — **un metro que no dice lo que está haciendo**—,
así que se arreglan juntos.

### 1 · El censo se colgaba en silencio, y la causa no era el navegador

**El síntoma:** catorce minutos sin una línea. Sin forma de distinguir «va lento» de «está
muerto» más que sondeando `agent-browser eval "location.href"` cada veinte segundos.

**La causa, medida:** `execFileSync` **sin `input` deja `stdio[0]` en `inherit`**, así que el
hijo se queda con el `stdin` del padre; en una shell no interactiva —el harness en segundo
plano, CI— ese `stdin` no se cierra nunca y una de las seis llamadas por corrida espera para
siempre. Se sospechó primero de 38 Chrome de `agent-browser` y **esa sospecha era falsa**: con
el navegador despejado se colgó dos veces más, 13 y 10 minutos, con **0,1 s de CPU acumulada** y
cero procesos hijo. *Una sospecha no es una causa.*

**Decisión.** `ab()` pasa `input` **siempre**, aunque sea la cadena vacía, y lleva **tope de
reloj** (`AB_TIMEOUT_MS`, 120 s por llamada) que traduce el SIGTERM a un mensaje con el comando
que no respondió. El `< /dev/null` que se usaba de parche **se retira**: no valía, porque en
segundo plano no manda el shell desde el que se lanza.

**Y progreso, que es la otra mitad.** El censo ya imprimía una línea por corrida; lo que no
decía era **por dónde iba**. Ahora lleva `[14/28]` delante. Con 28 corridas, eso es la
diferencia entre esperar y matar el proceso.

### 2 · `psi --registro` sellaba un rango sacado de una sola muestra

**El sello publica el min/max de las catorce páginas, y el artículo lo lee (D102).** Con una
toma por página, **la peor toma manda sobre el rango entero**. Medido el mismo día, contra
producción y sin tocar nada entre medias: `/design-system` dio **76** en el barrido y **98 y
99** al re-medirla; `/como-se-ha-creado`, **81** y luego **89 y 99**. El barrido iba a sellar
«76-100 escritorio» cuando `PRD-Live` §No funcionales afirma «>90 en las catorce». *El sitio
habría publicado un número que contradice su propio criterio de aceptación, por ruido.*

**Decisión: tres tomas y la MEDIANA.** No la media, porque el ruido de PSI es asimétrico hacia
abajo —la media de 76, 98 y 99 da 91, que no es ninguna de las tres— y no el mejor de tres,
porque en un dato que se publica es peor pasarse de optimista. Con un número **par** de valores
se coge el bajo de los dos centrales, por lo mismo: promediar inventaría una nota que la página
no ha sacado nunca.

**Tres elecciones que no son obvias:**

- **Las tomas van por FUERA del recorrido.** Medir una página tres veces seguidas devuelve tres
  veces el mismo análisis cacheado, que es la primera trampa de D108: *una n alta sobre filas
  repetidas da la apariencia de rigor y el veredicto contrario*. Dando una vuelta entera al
  registro entre toma y toma, cada página se remide varios minutos después. **Funcionó a la
  primera y con holgura: 28 llamadas → 28 análisis distintos, el 100%.**
- **Se deduplica por el sello del ANÁLISIS**, el «(medido …)» que ya se imprimía al lado de la
  nota, no por el de la llamada. Y lo que se guarda es la **medición** cuya nota es la mediana,
  no la cifra suelta: sus avisos y su desglose tienen que venir de la misma corrida.
- **Un par que se queda en un solo análisis distinto NO sella**, y se dice cuál. Es la regla que
  ya tenía la función —«no sella una pasada parcial»— llevada a su forma correcta: *una pasada
  completa medida una vez es tan parcial como una pasada a medias*. La caché de la API expira,
  así que el remedio es repetir un rato después, no bajar el listón.

**Y afirma cuánto ha muestreado**, no solo qué encontró: tomas, llamadas, análisis distintos y
**los tres pares que más se movieron**. Esa tabla es la evidencia de por qué esto existe —
`/brand-kit` dio **89 y 100** sobre el mismo despliegue, con minutos de diferencia.

**Lo que NO se ha comprobado, dicho para que no se dé por comprobado:** el criterio que abría la
tarea era «un barrido repetido dos veces da el mismo rango ±2». Eso son 168 llamadas y más de
una hora de API, desproporcionado para lo que aporta sobre lo ya medido. Se validó con un
barrido real de **dos tomas × 14 páginas en escritorio**, que es donde se leen las tres cosas
que importan: el 100% de análisis distintos, la dispersión real, y que la negativa a sellar
salta.

**Coste aceptado:** el barrido pasa de 28 llamadas a 84 y de varios minutos a bastantes más.
`--tomas=1` existe para tantear sobre un Preview, y **no sella**, a propósito.


## D146 · Lo que aún no ha entrado está a `opacity: 0`, y axe no lo mira — 2026-08-28

**El síntoma, que parecía ruido.** Verificando `/accesibilidad`, la primera llamada a axe tras
abrir la página devolvía **1 elemento** en `incomplete`; repitiendo la misma medición sin
recargar, **43**. Se apuntó como rareza de la herramienta. No lo era, y detrás había **dos**
cosas distintas.

**Causa 1 · el reveal.** `.reveal-on [data-reveal]` sin `[data-shown]` es `opacity: 0`, y **axe
excluye del contraste todo elemento con un ancestro invisible**. Con la página recién abierta
solo han entrado los reveals de la primera pantalla, así que la pasada mide una fracción de la
página. Reproducido en `/accesibilidad`: **8 de 29** reveals encendidos → axe da **2 nodos**;
con los 29 encendidos → **44**.

**Y no se arregla haciendo scroll.** Bajar al 50% y esperar 900 ms —lo que ya hacía el censo
para montar islas— encendió **9 de 29**: el `IntersectionObserver` solo dispara lo que cruza en
ese momento. Son dos problemas distintos, montar y encender, y el scroll solo resuelve el
primero.

**Causa 2 · el «1» no era un elemento.** `counts.incomplete` cuenta **reglas**, no nodos: vale 1
con dos nodos y vale 1 con cuarenta y cuatro, porque todos son de `color-contrast`. El «1 de
43» del enunciado eran dos pasadas leyendo dos campos distintos. *Un informe que dice «1
incompleto» se lee como «casi limpio»; uno que dice 44 se mira.*

**Decisión.** `window.mostrarReveals()`, en `contrast-census.js` al lado de `freezeMotion` —
misma familia: poner la página en su estado final antes de medirla—. Enciende todos los
`[data-reveal]`, **devuelve cuántos ha tenido que encender** y no se revierte, porque encendido
es el estado real de la página y no un apaño para la foto. `contrastCensus()` lo llama de
entrada, y el `viewport-verifier` lo tiene como precondición de la primera pasada de axe, junto
al congelado.

**Al censo también le faltaba, y estaba medido antes de decirlo.** Su `esVisible` mira la
`opacity` del propio elemento y no la de sus ancestros, así que perdía menos que axe pero
perdía: `/accesibilidad` daba **16 pares** en frío y **17** con los reveals encendidos. El
sello del censo se rehizo con el número correcto.

**Y lo dice.** Cada corrida publica «29 reveals · 28 encendidos para medir», por lo mismo que
publica las reglas `:hover` indexadas: sin la cifra, una pasada sobre media página se lee igual
que una sobre la página entera. Es el modo de fallo de la casa por sexta vez (D38, D57, D60,
D63, D85).

**Lo que NO era:** un falso negativo de `violations`. Esas salieron **0 de forma estable** en
las cuatro combinaciones tema × locale. Afecta a `incomplete`, que es donde axe archiva lo que
no sabe resolver — `color-mix()`, gradientes y SVG.


## D147 · El andamiaje es el 30% del código y no lo lintaba nadie — 2026-08-28

**El hueco, con la medida correcta.** `eslint.config.mjs` ignoraba **`scripts/**` entero** —no
los `.js`: todo—, y `tsconfig.json` tiene `allowJs` **sin** `checkJs`. Resultado en dos niveles:
los **39 `.ts`** los typechea `tsc` y no los linta nadie; los **8 no-TS** (1.235 líneas) no los
mira ninguno de los dos. En total **8.446 líneas, el 30% del repo** — más que `lib/` (2.063) y
`app/` (3.178) juntos.

**Y el ignore tenía razón.** Decía «usa `require()` y APIs de Node, no es código de Next», y es
verdad: la config de Next sobre un CommonJS de Node da errores que no son errores. **La
respuesta no era levantarlo, era darle a esa mitad su propia config.**

**Decisión: dos programas, dos configs.** `scripts/` se linta con **`@eslint/js` recomendado +
`typescript-eslint`**, no con la de Next, y **partido por entorno**, porque ahí abajo no hay uno
solo:

| Qué | Globales | Módulos |
|---|---|---|
| `scripts/**/*.ts` · gates, guardianes, generadores | Node | ESM |
| `scripts/**/*.mjs` · hooks del harness | Node | ESM |
| `scripts/logo-kit/`, `scripts/logos/` | Node + CommonJS | `require()` |
| `scripts/design-review/*.js` · el censo | **navegador** | script inyectado |

El censo es el caso que justifica la tabla: **no es código de Node**, se evalúa dentro de la
página, así que sus globales son `window` y `document`. Es además el archivo peor puntuado por
qlty y el que se ha roto en silencio dos veces (D70).

**Fuera queda `scripts/.poda/`**, que son recortes generados para medir y se regeneran enteros.

**Lo que encontró la primera pasada, y era el argumento entero:** 22 errores reales. Un tipo
importado y sin usar en `articulo/huella.ts` —justo la clase de aviso que el sprint anterior
dejó pasar—, seis backticks escapados de más dentro de cadenas con comillas dobles, y dos
regex con espacios contados a ojo en los casos de los guardianes.

### Y un guardián, porque el ignore es UNA LÍNEA

El agujero se abrió con una línea y se cierra con otra: **vuelve a abrirse igual de fácil, y su
modo de fallo es un `npm run lint` en verde que no ha mirado nada.** Así que `check:guardianes`
gana un caso —una variable sin usar dentro de `scripts/censo.ts`— que **solo puede saltar si
`scripts/` sigue dentro del alcance**. Es el mismo razonamiento que el resto del arnés: lo que
se comprueba no es qué encontró, es cuánto miró.

### Lo que se descartó, con su medida

El enunciado proponía tres escalones y **el primero y el tercero no se hacen**: `// @ts-check`
en `contrast-census.js`.

`tsc` **no ve `scripts/**/*.js` en absoluto** —el `include` de `tsconfig.json` solo lista `.ts`,
`.tsx` y `.mts`—, así que el `@ts-check` sin más no habría hecho nada; es una regla cuyo
disparador mira al sitio equivocado. Se probó de verdad, metiendo
`scripts/design-review/*.js` en el `include`: **63 errores**, todos `implicit any` y nulos
estrictos de un archivo de navegador sin tipos, en un archivo de 720 líneas cuya propia cabecera
dice «no lo reescribas». Anotarlo entero para silenciarlos sería el rewrite que la cabecera
prohíbe, a cambio de cero hallazgos.

**Lo que ese archivo necesita ya lo tiene**, y son dos redes distintas: el lint que acaba de
ganar, y `check:guardianes`, que le pasa un caso malo conocido y comprueba que lo rechaza —
cobertura de comportamiento, que es la correcta para un metro.


## D148 · Tres scripts por encima del umbral de complejidad, y lo que de verdad lo baja — 2026-08-28

**Los tres, medidos con qlty en local antes de tocar nada:** `check-palette.ts` **63**,
`contrast-census.js` **165** (con su función principal en 164 y 30 retornos), `psi.ts` **122**.
Ninguno es código de la web: los tres son andamiaje, y los tres estaban por encima del umbral
por el mismo motivo — **cantidad, no enredo**. Cada comprobación estaba justificada y comentada;
lo que sobraba era que todas vivieran en el mismo archivo.

**La lección, que ya estaba medida y ahorró repetir el experimento.** En el PR #166 se intentó
bajar el censo extrayendo su segundo pase a una función **anidada**: quedó en 155 igual, porque
**qlty suma la complejidad de las anidadas al padre**, y se revirtió para no meter indirección a
cambio de nada. Así que la regla es: **lo que parte el conteo de un ARCHIVO es el módulo; lo que
parte el de una FUNCIÓN es dejar de estar dentro de otra.** Son dos cosas distintas y hacen
falta las dos.

**Qué salió, y el resultado:**

| Archivo | Antes | Después | Qué se sacó |
|---|---|---|---|
| `check-palette.ts` | 63 | **25** | `palette/pintados.ts` (la tabla del navegador + su cobertura) y `palette/copias.ts` (el barrido del repo) |
| `psi.ts` | 122 | **40** | `psi/medicion.ts`, `psi/muestreo.ts`, `psi/informe.ts` y `psi/sello.ts` — los cuatro dominios que tenía dentro |
| `contrast-census.js` | 165 | **165** | los helpers de color y el pase de contornos suben a nivel superior: la función principal cae de **164 a 40** y pierde el aviso de 30 retornos |

**La complejidad no se ha escondido, se ha REPARTIDO**, y eso se dice porque la diferencia
importa: el total de la familia de la paleta pasa de 63 a 64. Lo que cambia es que ninguna pieza
cruza el umbral y cada archivo contesta una sola pregunta.

**Y `contrast-census.js` se queda en 165 a propósito, porque NO PUEDE ser un módulo.** Se
inyecta verbatim en la página y se evalúa allí; la CSP del sitio no permite `unsafe-eval` y el
archivo también se pega a mano en una consola. Partirlo en dos archivos inyectados es posible y
no se hace: añadiría un orden de inyección que se puede equivocar a un guion cuya cabecera dice
«no lo reescribas» tras tres reescrituras. Lo que sí se ha arreglado es lo que **sí** se podía —
una función de 550 líneas y 30 retornos— y eso era el problema de lectura de verdad.

**Un aviso nuevo que se acepta a sabiendas:** `porQueNo()` en `psi/sello.ts` sale marcada por
«muchos retornos» (7). Son cláusulas de guarda, y sustituyen a una cadena de seis ternarios
anidados que qlty marcaba por complejidad **y** por anidamiento a cinco niveles. Cambiar tres
avisos por uno que describe la forma correcta del código es un buen cambio; el aviso se queda
sin silenciar, porque la regla de `.qlty/qlty.toml` es excluir por lo que un archivo **es**,
nunca por lo que puntúa.

**Cómo se validó que no se ha roto nada:**

- **La paleta**: misma salida exacta — 30 tokens, 18 conversiones, 175 archivos, 17 hex.
- **`psi`**: un barrido real contra producción, que ejercita la llamada, el muestreo, el informe
  y la negativa a sellar.
- **El censo**: la condición que su ficha exigía, **las mismas cifras antes y después**. Medido
  sobre `/accesibilidad` servida: 17 pares, 8 controles con caja y 6 contornos, 34 reglas
  `:hover`, metro validado, cero bajo AAA y cero bajo 3:1. Idénticas.


## D149 · El guardián de contadores en prosa se DESCARTA, y el ruido está medido — 2026-08-28

**La idea era razonable:** en tres días caducaron cuatro contadores —`design-review` recorría
«las seis páginas» cuando ya eran doce, `PRD-Live` y `README` se contradecían consigo mismos—,
así que se propuso un guardián que buscara afirmaciones de conteo en los `.md` y las contrastara
con su fuente derivada.

**Y la tarea traía su propia condición, que es lo que la salva de haberse construido:** *el
primer paso no es construirlo, es MEDIR EL RUIDO*. Se ha medido.

### La medición

Un detector de un solo uso —cifra en palabra o en dígito seguida de uno de los 25 sustantivos
que este repo cuenta— sobre todos los `.md`:

| | |
|---|---|
| Coincidencias totales | **625** |
| En documentos **históricos** (registro fechado: una cifra vieja ahí es CORRECTA) | 331 |
| En documentos **vivos** | **294** |

Y sobre los vivos, clasificando a mano las dos familias que un guardián podría atar a una fuente
derivada:

- **`páginas`, que es el mejor caso posible** —tiene fuente (`PAGE_COUNT`) y es el sustantivo
  que originó la tarea—: **13 apariciones vivas, y solo 3 hablan del conjunto de páginas del
  sitio.** Las otras diez son las **2 páginas del CV en PDF**, las **5 del deep-dive**, las
  **3 del sistema**, una narración histórica dentro de un documento vivo («durante meses, las
  trece páginas…») y una referencia **fechada** en el `viewport-verifier`. **77% de falsos
  positivos.**
- **`guardianes`, `comprobaciones`, `piezas`, `decisiones`, `entradas`, `pasos`, `índices` y
  `skills`: catorce apariciones vivas y NINGUNA cuenta un conjunto derivable.** Son «las cuatro
  piezas del facade», «un núcleo de ocho piezas» (un subconjunto deliberado, no el inventario de
  24), «dos comprobaciones de dos segundos», «tres pasos hasta el lanzamiento».

**Total: 3 candidatos reales sobre 27 — un 89% de falsos positivos.** Y los tres están
correctos hoy. *Un gate ruidoso es peor que ninguno*, que es el criterio con el que se abrió.

### Por qué no hay forma de afinarlo

El detector no falla por poco vocabulario: **falla porque «catorce páginas» y «dos páginas» son
sintácticamente idénticas y hablan de conjuntos distintos**, y porque una cifra dentro de una
frase fechada o de una narración histórica es correcta precisamente por ser vieja. Distinguirlas
pide entender la frase, no reconocerla.

### Lo que hace innecesario el guardián

**Donde la cifra se PUBLICA ya está derivada, y eso es lo que importaba.** `/accesibilidad` y el
artículo interpolan `{paginas}`, `{comprobaciones}` y `{fingidos}`; `pasosDeCI()` cuenta los
pasos leyendo el workflow; `check:accesibilidad` compara `GUARDIAN_COUNT` contra el disco — y lo
hizo en esta misma tanda, parando el commit que subía los guardianes de 17 a 18 sin mover la
cifra. Lo que queda en prosa son los `.md`, que no los lee ningún visitante y sí un `grep`.

**Y la mitad barata que la propia tarea encontró: un contador que se puede borrar no necesita
guardián.** Las tres instancias de `ci.yml` se arreglaron **borrando** el contador, no
actualizándolo, y el argumento estaba escrito treinta líneas más abajo en el mismo archivo. Esa
es la regla que queda viva: **antes de escribir una cifra en prosa, preguntarse si la frase
funciona sin ella.** `method-review` ya lo tiene escrito con su propia cicatriz: *«cuando esta
línea decía "20 pasos" ya eran 21»*.

**El solape con P68.5 también está medido, y es real:** el sello de `check:articulo` es por
ARCHIVO, así que un cambio de comentario en `contrast-census.js` encendió §s09 tres veces en
esta tanda sin que ninguna afirmación del artículo se moviera. Ese ruido sí tiene arreglo posible
—sellar por contenido sustantivo y no por archivo— y se queda en su tarea.

---

## D150 · El `preconnect` a GTM se DESCARTA, y quien lo dice es Lighthouse — 2026-08-28

**La guía de Vercel pide `preconnect` a los dominios de assets, y este sitio no tiene ni uno**
(cero `preconnect`, cero `dns-prefetch`). El único dominio de tercero que se pide al cargar es
`www.googletagmanager.com`; el resto son enlaces de salida, que no se piden hasta que alguien los
pulsa.

### La medición, y la trampa que casi la invalida

`npm run psi` sobre la home de producción **no lista ningún aviso de preconnect**, y eso
*parecía* el aprobado. No lo era: **Lighthouse 13 ya no tiene auditoría `uses-rel-preconnect`**
—de las 47 del informe, cero mencionan preconnect en su clave—, así que la ausencia del aviso no
decía nada. Es el fallo de método de `BRAND.md` §Cómo se escribe una regla, punto 3, encontrado a
tiempo: *un metro que devuelve lista vacía parece un aprobado*.

Donde vive hoy el veredicto es dentro de `network-dependency-tree-insight`, y ahí es explícito.
Igual en las dos estrategias:

```
Preconnected origins  → no origins were preconnected
Preconnect candidates → No additional origins are good candidates for preconnecting
```

### Por qué el sitio no tiene candidatos

Porque **GTM entra a propósito tarde**. La estrategia es `lazyOnload` desde P26.5, y el timing
medido lo confirma: en escritorio `gtm.js` se pide a **843 ms** con el LCP en **500 ms** — la
petición ocurre *después* del elemento que puntúa. Un `preconnect` adelantaría una conexión TLS a
la ventana crítica para un recurso que no la necesita, y en móvil el LCP ya está dominado por el
`resource load delay` del hero (1592 ms, 63% del desglose), que es D59 y no tiene nada que ver
con la red hacia terceros.

La cadena crítica que sí sale en rojo son **dos CSS del propio sitio** (la más larga, 2366 ms).
Ese es otro hallazgo, y no se arregla preconectando a Google.

### Y la parte que hay que conservar: a `youtube-nocookie` NO se le hace

La misma guía pediría preconectar al dominio del vídeo, y sería **exactamente la petición que el
facade existe para evitar** (D55): sin iframe en el DOM hasta que alguien pulsa, y sin una sola
petición a Google antes de eso. **Una regla general puede contradecir una decisión ya tomada;
gana la decisión.**

**Estado: descartada, no pendiente.** Se reabre solo si aparece un tercero que se pida *dentro*
de la ventana del LCP — y entonces lo dirá «Preconnect candidates», que es donde hay que mirar.

---

## D151 · ESLint 10 lo bloquea upstream, y por el camino apareció un override caducado — 2026-08-28

**El PR de Dependabot llevaba desde el 2026-08-24 en rojo**, y la ficha lo atribuía a una
incompatibilidad entre dependencias transitivas que el bump automático no arrastra, diciendo
explícitamente que *no era culpa de nuestra config*. **Se intentó a mano y esa premisa era falsa
en su primera mitad y cierta en la segunda.**

### Lo que de verdad rompía: un override nuestro, congelado en el mundo de ESLint 9

El crash reproducido en local es el mismo del CI:

```
TypeError: (0 , brace_expansion_1.expand) is not a function
    at braceExpand (node_modules/minimatch/dist/commonjs/index.js:157)
    at doMatch (node_modules/@eslint/config-array/dist/cjs/index.cjs:422)
```

Y la causa está en `package.json`, no en el lockfile de Dependabot. El commit `6bd2fd6`
(2026-08-03, dos alertas High de Dependabot) fijó overrides **anidados por línea mayor de
minimatch**:

```json
"eslint":                                { "minimatch": { "brace-expansion": "^1.1.17" } },
"@typescript-eslint/typescript-estree":  { "minimatch": { "brace-expansion": "^5.0.8"  } }
```

Con ESLint 9 el `minimatch` de debajo era el **3.x**, que usa la API v1 (`module.exports` es la
función). ESLint 10 trae `@eslint/config-array` con **`minimatch@10.2.6`**, que pide
`brace-expansion@^5` y llama a `expand` como named export — y el override se lo forzaba a 1.x.

**La lección de método: un override anidado por línea mayor caduca cuando la línea mayor cambia,
y no falla en la subida que lo escribe, sino en la SIGUIENTE.** Once meses invisible, y visible
solo al intentar el salto que rompía.

**Se ha retirado, y no hacía falta ya:** hoy npm resuelve `brace-expansion@5.0.9` en la raíz y
`1.1.18` bajo el `minimatch@3.x` de `eslint-config-next` — las dos parcheadas. `npm audit` sigue
en **0 vulnerabilidades** sin él. El de `typescript-estree` se queda: ese sí describe su árbol.

### Lo que sí bloquea, y no es nuestro

Quitado el override, ESLint 10 avanza y choca con el muro real:

```
TypeError: Error while loading rule 'react/display-name':
  contextOrFilename.getFilename is not a function
    at detectReactVersion (eslint-config-next/node_modules/eslint-plugin-react/…/version.js:85)
```

`context.getFilename()` se eliminó en ESLint 10. **Tres de los plugins que `eslint-config-next`
arrastra declaran, en su última versión publicada, un peer máximo de `eslint ^9`:**

| Plugin | Última versión | Peer de `eslint` |
|---|---|---|
| `eslint-plugin-react` | 7.37.5 | `… \|\| ^9.7` |
| `eslint-plugin-import` | 2.32.0 | `… \|\| ^9` |
| `eslint-plugin-jsx-a11y` | 6.10.2 | `… \|\| ^9` |

`eslint-config-next@16.3.3` declara `eslint: ">=9.0.0"`, que es permisivo y **miente sobre su
propio árbol**. No hay nada que resolver a mano: hasta que upstream publique, la subida no
existe.

### Qué se conserva del intento

Además de retirar el override, el intento destapó que **`eslint.config.mjs` importaba tres
paquetes que nunca estuvieron en `package.json`** — `@eslint/js`, `globals` y `typescript-eslint`
funcionaban por *hoisting* de las dependencias de `eslint-config-next`. En ESLint 9 el config
carga igual; en 10 falló con `ERR_MODULE_NOT_FOUND` uno tras otro. **Se declaran**: importar
directamente lo que otro paquete instala para sí es una dependencia real escrita en ningún sitio.

### Cómo se sabrá que ya se puede

**No se pone un `ignore` en `dependabot.yml` a propósito.** El PR semanal en rojo *es* el
detector: el día que sus checks salgan verdes, upstream lo soporta y la subida es un merge. Un
`ignore` apagaría justo la señal que queremos.

---

## D152 · TypeScript 7 ya pasa, y quien lo bloquea es el mismo tipo de peer que a ESLint — 2026-08-28

Hermana de **D151**, y por el mismo motivo por el que sus dos fichas se escribieron juntas: los
dos son saltos que el bump automático no puede hacer. El veredicto también es el mismo, pero
aquí **la mitad cara está medida y sale a favor**.

### Lo que bloquea

`typescript-eslint@8.68.0`, la última publicada, declara `peer typescript: ">=4.8.4 <6.1.0"`.
No entran ni la 6 ni la 7, y su canary (`8.68.1-alpha.6`) sigue en la misma línea. `npm install
-D typescript@7` **falla con ERESOLVE**, no con un aviso.

**Y falla ahora porque D151 lo hizo visible.** Mientras `typescript-eslint` venía por *hoisting*
de `eslint-config-next`, npm resolvía el peer en silencio; declarado como dependencia real, el
conflicto es un error de instalación. Es el argumento de aquella decisión, cobrado el mismo día.

### Lo que ya no hay que averiguar

Medido con un `tsc` suelto contra nuestro propio `tsconfig.json`, sin tocar el árbol:

| | TS 5.9.3 | TS 7.0.2 |
|---|---|---|
| Errores de diagnóstico | 0 | **0** |
| `tsc --noEmit`, tomas estabilizadas | 3100 · 3139 ms | **1724 · 1776 ms** |

**Cero errores nuevos y un 43% menos de tiempo.** La reescritura en Go no pide tocar una línea de
este repo: el salto es un cambio de versión el día que el peer lo permita, y no la tarde de yak
con riesgo de build rojo que la ficha temía. Lo que sí queda anotado es que la ganancia es real y
está en el paso más caro de CI.

### Cómo se sabrá que ya se puede

Igual que en D151, y por la misma razón: **sin `ignore` en `dependabot.yml`**. Cuando
`typescript-eslint` publique una versión que admita `typescript >=7`, la subida es un
`npm install` y estas dos fichas se cierran juntas.

## D153 · Lo que decide una métrica no vive dentro de un efecto — 2026-08-29

**Decisión.** La condición que decide si un evento de analítica se dispara vive en un módulo
puro con nombre propio —`cuentaComoEnvio`, en `lib/contact-form.ts`—, no como una comparación
escrita dentro del `useEffect` que lo dispara.

**El defecto que lo escribió.** `contact_submit`, la métrica primaria del PRD §7, se disparaba
con `state.status === "sent"`. D71 había dejado garantizado el transporte y nadie había mirado
la otra mitad: **ese estado tiene tres causas y solo una manda correo.** Las otras dos son los
filtros que callan a propósito —el honeypot y el suelo de 3 s— y devuelven «enviado» para no
enseñarle a un bot que lo han cazado. El silencio hacia el bot es correcto; propagarlo a la
analítica no. Y el camino de los 3 s no es teórico: lo recorre una persona que pega los tres
campos y pulsa.

**Por qué es una decisión y no un arreglo.** El arreglo cabía en una línea dentro del efecto, y
ahí la regla no habría tenido **ni tests ni caso malo**: `tests/` no monta React, así que una
comparación dentro de un `useEffect` no la mira nadie, y `check:guardianes` no tiene nada que
mutar. Sacándola a `lib/` la misma regla pasa a tener las dos cosas, y el caso malo —dejarla
sin mirar `contabiliza`— pone `npm test` en rojo. Es la forma de D101 aplicada a la medición:
**se prueba lo que el código emite, no las instrucciones que se le dan.**

**El estado lleva la marca, no el componente.** `ContactState` gana `contabiliza?: false` y lo
devuelven solo las dos ramas que callan. La UI pinta exactamente lo mismo en los tres casos, así
que un bot no aprende nada: lo único que cambia es el `dataLayer`, y un bot de honeypot no lo
lee. Un bot que ejecutara JS *y* comparara el `dataLayer` para detectar que lo han cazado está
muy por encima del modelo de amenaza de un formulario de portfolio.

**Lo que esto NO arregla, y se midió el mismo día.** Que la primaria cuente solo lo que envía
correo no la hace completa: sigue contando únicamente a quien acepta cookies, porque sin
consentimiento no carga GTM. Con tres envíos de spam entregados y cero eventos, la diferencia
medida es 1 contado contra 4 entregados. Eso es de otra tarea y de otra causa; aquí se anota
para que nadie lea esta entrada como si cerrara la medición del formulario entera.

## D154 · El suelo de la densidad tiene dos palancas, y la que faltaba es teñir sin gastar bloque — 2026-08-29

**El hueco, y por qué la regla no podía verlo.** D125 dejó escrito el techo —«más de un bloque
cada ~6 pantallas, lo que sobra son bloques»— y no escribió el suelo. Sin él, la regla vigilaba
el exceso y **dejaba pasar el caso que D125 nació a corregir**: el Design System encadenaba
**14,1 pantallas seguidas sin un solo cambio de fondo** entre la banda de «Fundamentos» y la de
«Piezas». Más que la página entera del Brand Kit (15,4) y que Accesibilidad completa (13,4). El
tramo más plano del sitio medía lo que una hermana entera.

Y no se veía porque **la cifra publicada era una media**. D125 decía «8,9 pantallas en Design
System», que es el promedio de `1,9 · 14,1 · 7,5 · 7,8 · 4,4`. *Una media no puede detectar un
reparto malo, porque repartir mal es exactamente lo que una media promedia.* Se sustituye por el
**peor tramo**, que es lo que la regla necesita ver. (Las otras dos cifras tampoco cuadraban con
la medición: 7,4 y 6,8 contra 7,8 y 5,8.)

### La primera versión metía otra banda, y la tumbó mirarla

Se implementó partiendo «Fundamentos» en dos bloques, con banda nueva, título y entradilla. Lo
descartó Francisco viendo la página, y el argumento no es de gusto: **la banda significa «empieza
otra familia», y entre §02 y §03 no empieza ninguna.** Comprar ritmo con una banda ahí es
comprarlo diciendo algo falso. Y hay un coste de segundo orden: cinco bandas en una página hacen
que ninguna signifique gran cosa, así que la banda inicial pierde valor pagando el ritmo de la
mitad de abajo.

**La palanca correcta era la que D125 había descartado**, y sus dos peros habían caducado:

- El filete de una tarjeta sobre superficie teñida caía de 1,29 a 1,10 → **lo cerró D131**,
  que recalcula `--border` por superficie.
- «Las galerías dan por hecho el fondo de página» → **falso al medirlo, y en dirección
  contraria**: una tarjeta se separa **mejor** sobre muted que sobre el fondo de página en tema
  claro, ΔL\* **6,25 contra 2,35**; en oscuro 4,70 contra 4,34. Verificado además en pantalla,
  dentro del tramo, en los dos temas.

Lo que sigue en pie de D125 y esto no contradice: **la banda se inserta, no se tiñe una sección
para fabricarla.** Aquí no se fabrica ninguna banda — se cambia el fondo y nada más.

### Dos palancas para dos preguntas, y es lo que deshace una contradicción

La regla a medias no solo era incompleta: **con la banda como única herramienta, el suelo
empujaba contra el techo.** Romper un tramo largo costaba un bloque, así que una página que
creciera acabaría chocando con «no más de un bloque cada ~6 pantallas». Las dos mitades se
contradecían.

`tinteDesde` lo deshace porque **cambia el fondo sin gastar bloque**. Cuál toca no lo decide la
longitud, lo decide el contenido:

| Pregunta | Palanca |
|---|---|
| ¿Empieza otra familia? | Banda (`BlockOpener`) |
| ¿Sigue la misma y se hace larga? | Tinte (`tinteDesde`) |

Y la regla queda con sus dos mitades: **techo**, más de un bloque cada ~6 pantallas se lee a
golpes; **suelo**, un tramo por encima de ~10 pantallas sin cambio de fondo pide romperse.

### Dónde cae el corte lo decidió la medición, y la intuición falló

El corte por **familia** —las tres decisiones de medida contra las dos que no se miden en
píxeles, o sea desde §04— dejaba el tramo malo en **10,9**, porque el peso no está repartido.
Medido por sección, en pantallas de 900px:

| §01 Rejilla | §02 Ritmo | §03 Tipografía | §04 Claroscuro | §05 Movimiento |
|---|---|---|---|---|
| **5,88** | 1,01 | **3,99** | 1,61 | 1,22 |

De las cuatro particiones posibles, solo una deja las dos mitades bajo el techo y sobre el suelo:

| Corte | Primera | Segunda | Peor |
|---|---|---|---|
| tras §01 | 5,88 | 7,83 | 7,83 |
| **tras §02** | **6,89** | **6,82** | **6,89** |
| tras §03 *(por familia)* | 10,88 | 2,83 | 10,88 |
| tras §04 | 12,49 | 1,22 | 12,49 |

**Y el corte NO coincide con la frontera de familia, a propósito.** Con un tinte eso es legítimo
y con una banda no lo sería: **el tinte no tiene titular que pudiera mentir.** Es la diferencia
que justifica que sean dos palancas y no una con variante de color.

### Lo que hay que saber al usarlo

- **La clase es `bg-muted`, no un `data-surface`.** La utilidad ya dispara la maquinaria de
  superficie de `globals.css` —atenuado (D39), filete (D131) y contorno de control (D97)—;
  `data-surface` es para lo que se pinta su propia superficie con un `color-mix`.
- **El salto es callado y asimétrico**, y conviene tenerlo en cifra antes de usarlo en una página
  nueva: fondo ↔ muted da **1,105 · ΔL\* 3,89** en claro y **1,272 · ΔL\* 9,04** en oscuro,
  frente a los 13,79 · 81,1 y 15,32 · 85,45 de la banda. En claro lo que hace legible el borde no
  es el color: es que la sección de debajo ya trae su filete superior (`SECTION`).
  *El metro se validó solo: esas dos cifras son exactamente las que `BRAND.md` publica para la
  pastilla de hover.*
- **`tinteDesde` revienta el prerender** si nombra una parada que no está en el bloque, en vez de
  no teñir nada. Un tinte que desaparece en silencio al renombrar una clave es indistinguible de
  un tinte que nadie pidió, y este repo lleva seis metros caídos así.

**Verificado.** Censo completo en verde tras el cambio: 427 pares de texto y 328 contornos, cero
bajo AAA y cero por debajo del 3:1 de WCAG 1.4.11, metro validado en las 28 corridas. Aparecen
**3 pares nuevos** —los que compone el tramo teñido— y los tres pasan. `censo.huella` se re-sella
con la misma huella (58 · 19 · 6); `LAST_A11Y_REVIEW` **no** se mueve, porque faltan las dos
pasadas manuales (D38).

**Dónde vive esto.** `components/ui/block-opener.tsx` (la palanca y las cifras) y
`components/site/design-system/index.tsx` (el reparto y el porqué del corte). Enmienda **D125**;
la maquinaria de superficie es **D39**/**D97**/**D131**.

## D155 · Una señal fija que no distingue es decoración con forma de aviso — 2026-08-29

**El caso.** A 1280×618 —el portátil de 15" con escalado de Windows que D50 obliga a mirar— el
riel de doce paradas mide **598px de contenido en 514 de hueco**. La aritmética cuadra exacta:
`618 − 80 (top-[5rem]) − 24 (bottom-6)` por un lado, `12 × 44 + 11 × 6,4` por el otro.

**Y nada estaba roto**, que es la mitad que conviene tener escrita: el `overflow-y: auto` recorta
sin derramarse sobre el texto, el teclado llega porque el navegador auto-desplaza el contenedor al
enfocar el último enlace (`scrollTop` 0 → 84), y el `my-auto` centra mientras cabe y empieza a
desplazarse cuando no, que es lo que P68.57 fue a arreglar. Lo que faltaba era la **afordancia**:
`[scrollbar-width:none]` oculta la barra a propósito, así que con el ratón no había ninguna señal
de que abajo hubiera más.

**Por qué desvanecido y no barra.** La barra vive en el borde derecho del `nav`, que mide `w-64`
porque la píldora se ensancha en hover. O sea a 256px del riel y flotando sobre la columna de
texto: **señalaría en el sitio equivocado.** El desvanecido señala donde está el corte.

### La parte reutilizable, que no es del riel

**Cada borde se mide por separado.** Un desvanecido fijo arriba y abajo teñiría el primer y el
último círculo aun cuando no esconden nada: sería *decoración con forma de aviso*, y el coste no
es estético — un aviso que está siempre encendido deja de informar, igual que una lista vacía
parece un aprobado. Aquí el de arriba solo existe si `scrollTop > 0` y el de abajo solo si queda
contenido, así que en las páginas donde el riel cabe entero no se pinta ninguno. Verificado sobre
el sitio servido: a 1280×618 la máscara es la de abajo sin desplazar y la de arriba al llegar al
final; a 1440×900 el riel no desborda y la máscara es `none`.

**Y no toca ningún par de contraste**, que es lo que permite meter una máscara en una pieza de un
sitio que promete AAA: la fila de una parada mide 44px y la píldora 24, así que sobran 10 por
arriba y 10 por abajo. Con el degradado en 14px, lo único que llega a atenuarse es una píldora
**que ya está cortada por el borde**, que es exactamente la que hay que anunciar.

**Dos detalles de implementación que no se re-derivan.** La dependencia del efecto es el NÚMERO
de paradas y no `items`: el riel no se pinta mientras `active` es `null`, así que la primera vez
que el efecto corre el `nav` todavía no existe y no habría nada que medir. Y las cuatro máscaras
se escriben **enteras**, no compuestas por interpolación — la trampa del punto 5 de `BRAND.md`
§Cómo medir: una clase construida con plantilla no la genera Tailwind y el elemento se queda sin
regla **sin error de compilación**.

**Y una premisa de ficha que estaba caducada:** la tarea decía que esto lo pisan «el Design System
(12) y el artículo (12)». **P70.415 retiró el riel de las tres páginas del sistema**, así que hoy
su único consumidor es `/como-se-ha-creado`. Ahí se verificó.

**Dónde vive.** `components/ui/section-index-islands.tsx`.

## D156 · La invariante del pliegue pasa a sostenerse por construcción, y el corte está escrito — 2026-08-29

**Qué cambia respecto a D144.** Allí la invariante —los grupos de apertura tienen que medir lo
mismo, porque `my-auto` reparte el sobrante arriba y abajo— la sostenía **un gate por medición y
nada más**, y llevaba tres incumplimientos, los tres vistos por un ojo. Ahora las tres aperturas
del sistema (Brand Kit, Design System, Accesibilidad) salen de **una sola pieza**,
`components/site/system-page-opening.tsx`: no pueden divergir porque son la misma. `npm run
pliegue` sigue corriendo, pero pasa a ser **red de seguridad**. Es la regla 2 de `BRAND.md`
§Cómo se escribe una regla — lo que impide el drift es el recorrido completo, no la disciplina.

**Contacto sigue dependiendo solo del gate**, y eso no es un olvido: ver el descarte de abajo.

**Qué sube y qué baja.** Sube el esqueleto entero: la sección de pliegue, `WRAP`, el breadcrumb,
`FOLD_GROUP`, `HERO_ROW`, la columna de texto con su `self-start` y la `StatRow`. Bajan por
props las tres cosas que de verdad varían: el copy, las cifras y **la composición decorativa,
que entra por `children`**. Los tres `hero.tsx` pasan de 154, 184 y 308 líneas a 126, 148 y 232,
y lo que les queda es su ilustración y sus datos.

**El descarte, que es la parte que hay que leer antes de "mejorarlo".** `contacto-pagina.tsx`
**no entra**, comprobado contra el disco y no supuesto (regla 4 de `BRAND.md`): usa el mismo
`FOLD_GROUP`, pero su grupo es un **grid con `content-start`** —con su porqué escrito al lado—,
no usa `HERO_ROW` y no tiene fila de cifras. Es otra cosa que se parece, no la misma con un
mando. El bloque sirve a tres y está bien.

**HASTA AQUÍ Y NO MÁS ALLÁ, y por eso está escrito y no solo hecho.** Después de esto `qlty`
sigue viendo **79 de masa** entre `brand-kit/index.tsx` y `design-system/index.tsx`, y ahí se
paró a propósito. Lo que queda parecido a esa altura ya no es una decisión escrita dos veces: es
la **FORMA** de la página —firma, `return`, hero, índice, bloques, páginas relacionadas—, o sea
el hecho de que las tres hermanas son la misma clase de página. Factorizarlo pediría un
envoltorio que se tragara justo lo que esos archivos existen para enseñar: **el orden de la
página, legible de un vistazo**.

> **El corte, entonces: sube lo que tiene una invariante que proteger; no sube lo que solo
> comparte silueta.** Es la regla 4 de `BRAND.md` aplicada al revés — antes de unificar dos
> cosas que se parecen, mira si significan cosas distintas; aquí lo que se repite es el
> significado, no la decisión.

**Lo que permite afirmar que no se movió un píxel:** `npm run gate:html` con **diff vacío en las
28 variantes** (D42/D45), con la línea base tomada de `main` construido y servido, el servidor
viejo matado y el puerto verificado libre antes de levantar el de la rama —que es la trampa que
ya hizo mentir a este gate una vez—. Y `npm run pliegue` en verde después: las cuatro aperturas
siguen midiendo 464px de grupo y 389px de `h1`.

**LO QUE JUNTAR LAS TRES DEJÓ A LA VISTA, corregido el 2026-08-30 en un cambio aparte.** Brand
Kit servía la entradilla a `clamp(1,0625rem…1,25rem)` contra el `clamp(1,05rem…1,2rem)` de sus
dos hermanas —y de Contacto, que comparte pliegue sin compartir bloque—, sin nada escrito que lo
justificara. **No se unificó dentro del refactor**, y eso no era pereza: mover píxeles habría
roto lo único que ese cambio promete, que es el diff vacío. Se hizo después, y ahí el tamaño
**subió a la capa** (D34): un valor que tienen que compartir tres páginas no se escribe tres
veces. El punto de uso conserva solo la MEDIDA —`leadMeasure`, `max-w-[46ch]`—, que sí es
decisión de copy porque las tres entradillas son de largo distinto.

*Es el patrón de esta entrada aplicado a sí misma: un refactor transparente no arregla de paso
lo que encuentra, lo deja escrito y lo arregla en su propio cambio, donde se puede medir.*

---

## D157 · La nota de un escáner agéntico no es un criterio de aceptación, y su hallazgo más ruidoso no reproduce — 2026-08-30

**Decisión.** Los dos escáneres que abrieron el sprint «Agentes» —**`is-agentic.com`** (Vercel /
Ora API, 75/100) e **`isitagentready.com`** (20/100)— quedan registrados como **entrada de
descubrimiento y nunca como metro**. Ninguna de sus dos notas es un umbral de este proyecto, y
esto se escribe *antes* de construir nada del sprint porque el proyecto ya sabe cómo acaba lo
contrario: *de 11 hallazgos de un auditor externo, 6 eran falsos positivos, y lo descartado hay
que documentarlo o vuelve*.

### Los dos falsos positivos, con el comando que los tumba

Medidos contra **producción**, no contra local, el 2026-08-30:

| Su hallazgo | Comando | Lo que devuelve |
|---|---|---|
| «Content without JavaScript: asegura un `h1` y 500+ caracteres en el HTML crudo» | `curl -s https://franciscolopez.es/ \| grep -o '<h1' \| wc -l` | **1** |
| — la misma, en su mitad de caracteres | ver el bloque de abajo | **6.497 caracteres de prosa**, 13 veces su umbral |
| «Agent-friendly 404s: nunca un 200 con tu app shell» | `curl -s -o /dev/null -w "%{http_code}" https://franciscolopez.es/no-existe-xyz` | **404**, y **404** también en `/en/…` |

El conteo de caracteres, que es el que necesita el bloque propio:

```bash
curl -s https://franciscolopez.es/ | node -e "
let h='';process.stdin.on('data',d=>h+=d).on('end',()=>{
  const t = h.replace(/<(script|style)[\s\S]*?<\/\1>/gi,' ')
             .replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
  console.log(t.length);
});"
```

### Y el metro de este mismo descarte estuvo mal la primera vez

La ficha de la tarea tumbaba el primer hallazgo con **«~77.500 caracteres de texto»**. Es
**77.180**, y **no son texto**: salen de contar como prosa el `self.__next_f.push(...)` que Next
inlinea dentro de un `<script>` con el payload RSC. Quitando `script` y `style` —que es lo que
hace el comando de arriba— quedan **6.497**, y el resto de la página cuadra con esa cifra: 75
`p`, 7 `h2` y 10 `h3` en las mismas 218 KB.

**El veredicto no cambia y la cifra sí**, y por eso se escribe: 6.497 sigue siendo 13 veces el
umbral de 500, así que el hallazgo sigue siendo falso. Pero es la regla 3 de `BRAND.md`
—*valida el metro antes de creerte el hallazgo*— apareciendo **dentro de la tarea que existe para
validar el metro de otro**. Un `replace(/<[^>]+>/g)` sin quitar antes los `<script>` es
exactamente el error que comete un escáner que promete leer «el HTML crudo», y aquí se cometió al
refutarlo.

### Los doce checks que NO aplican, y el criterio que lo decide

El 20/100 del segundo escáner es la cifra que más impresiona y la que menos dice: **12 de sus
checks miden superficies que este sitio no tiene**.

| Familia | Checks | Por qué no aplica |
|---|---|---|
| `API, Auth, MCP & Skill Discovery` | API Catalog · OAuth/OIDC · OAuth Protected Resource · `auth.md` · MCP Server Card · Agent Skills index · WebMCP · DNS-AID · Web Bot Auth | El sitio **no tiene API, ni autenticación, ni servidor MCP**. Un 0/9 aquí es la respuesta correcta |
| Comercio agéntico | x402 · MPP · UCP · ACP | **No hay nada que vender**. Un portfolio no tiene checkout |

> **El criterio, que es lo reutilizable: un check de superficie agéntica aplica si el sitio TIENE
> esa superficie.** Publicar un `api-catalog` sin API no es estar preparado para agentes: es
> mentir en un formato que un agente sabe leer, y encima con la firma de un estándar.

Y hay una segunda razón para no engancharlos a la rutina, que es el criterio de D51 en su otra
mitad: **sus checks son estándares emergentes en borrador**, así que un metro que no controlamos
puede ponerse rojo o verde por algo que aquí no se ha decidido. Lo que va a CI es un guardián
propio (P68), y vigila las invariantes que este sprint adopte, no la nota de nadie.

### Lo que sí queda en pie, que es de dónde sale el sprint

De los dos informes juntos sobreviven **tres** huecos reales, y los tres están tareados:

- **La negociación de markdown** (P67.2), el **único que señalan los dos a la vez** y el único que
  cambia lo que un agente puede *hacer* con el sitio. Hoy: `Accept: text/markdown` devuelve
  `text/html`, y el `Vary` que sirve Next (`rsc, next-router-state-tree, …`) **no incluye
  `Accept`**.
- **El *when-to-use* de `llms.txt`** (P67.4). El archivo describe **quién es**; no dice **cuándo
  traer esta fuente a una conversación**.
- **Las señales de contenido en `robots.txt`** (P67.8), que hoy dice `Allow: /` y nada más.

### Y la media frase del 404, que se DESCARTA con motivo

La segunda mitad del hallazgo del 404 —*que el cuerpo apunte al sitemap o a `llms.txt`*— es
literalmente cierta y aun así no se hace. El 404 servido **no es un app shell vacío**: trae el nav
y el footer completos, o sea **nueve enlaces reales del sitio** y un «Volver al inicio», que es
justo lo que su hallazgo pide que exista. Lo que falta es un puntero a un artefacto de máquina, y
`/llms.txt` ya está anunciado donde un agente lo busca —`robots.txt` y el `Sitemap`—, así que
enlazarlo desde una página que lee una persona sería **publicar un artefacto de máquina en una
superficie humana** para satisfacer un check.

*Lo que sí se queda es la mitad que vale, y como invariante en vez de como nota:* **`check:agentes`
comprueba que una ruta inexistente devuelve 404 de verdad** (P68). El falso positivo, convertido
en la comprobación que sí protege algo.

**Estado:** Aceptada. La entrada se cierra con el sprint; si alguna de las tres tareas cambia de
alcance, es aquí donde se anota por qué.

---

## D158 · El markdown para agentes sale del `<main>` prerenderizado, y es un artefacto commiteado con guardián — 2026-08-30

**Decisión.** Cada página se sirve también en markdown. El texto sale del **`<main>` del HTML
prerenderizado**, se genera con `npm run md` como **artefacto commiteado** en `public/md/`, y se
llega a él por **dos vías**: la URL explícita `/md/<locale>/<pagina>.md` —que es la estable— y la
**negociación por `Accept: text/markdown`**, que resuelve el proxy. Medido: la home pasa de
**216.323 a 6.585 bytes**, 33 veces menos, y las **28 variantes** responden.

**De dónde sale el texto: del HTML, no del diccionario.** Las tres razones están en la ficha de
P67.2 y dos ya eran reglas: **D38** sacó del diccionario todo valor publicado, así que un
compositor de diccionario sería *estructuralmente incapaz* de contener las cifras que varias
páginas existen para publicar (el diccionario de la home pesa ~440 palabras y la página emite 75
`p`, 7 `h2` y 10 `h3`); sería un **segundo renderizador** de lo mismo, la familia mejor
documentada de este proyecto; y **D75** ya decidió que la verdad de una página es el HTML que
emite. Se ancla en `<main>` porque es exactamente el contenido y porque «un solo `main` por
página» **ya lo vigila `check:marco`**: es la diferencia entre elegir un selector y elegir uno que
alguien ya defiende.

**Y artefacto commiteado, no ruta dinámica, por una condición que no se negocia:** leer `Accept`
dentro de una página la haría dinámica, y que las 28 variantes sigan prerenderizándose es criterio
de aceptación (D48). El proxy corre antes y reescribe a un archivo estático, así que la
negociación no le cuesta el prerender a nadie. La contrapartida —un artefacto commiteado se queda
viejo— es la familia D60, y por eso **`md:verificar` nace en CI el mismo día**, no cuatro después
como `check:kit`. En su primera corrida ya cazó dos variantes.

### El conversor es propio, y su regla es fallar en voz alta

`turndown` ante una etiqueta que no conoce la tira en silencio y deja un agujero que nadie ve. Con
un `<main>` que emite un conjunto pequeño y conocido de elementos —porque todo sale de la capa—,
la lista puede ser un **contrato**: lo que no está, **rompe el build nombrando la etiqueta y su
contexto**. Es «afirma cuánto has mirado» aplicado a un conversor. Y las reglas viven aparte de la
E/S (`convertir.ts` ↔ `extraer.ts`, misma partición que `tablero/reglas.ts`), con **16 casos en
`npm test`**, caso malo incluido.

### Dos elementos pegados sin texto en medio estaban separados por CSS

Es el hallazgo reutilizable, y salió del prerender, no de un ejemplo. El HTML no dice qué
separaba la hoja de estilos, así que un conversor por etiquetas pega los rótulos:

| Dónde | Lo que salía | Lo que sale |
|---|---|---|
| El enlace de correo de `/contacto` | `Correofranciscojavier.lopezmartinez@gmail.com` | `Correo · franciscojavier…` |
| La cabecera de Hitos, tres `<span>` hermanos | `NombreImpactoAño` | `Nombre · Impacto · Año` |

**La señal es «elemento inmediatamente después de elemento», y en prosa no se dispara por
construcción:** React emite el espacio entre palabras como nodo de TEXTO, así que entre un
`<strong>` y lo que sigue siempre hay uno. El separador es el `·` que `CLAUDE.md` reserva justo
para separar dos etiquetas. Los dos casos son test.

### El `Vary` no llega a la página prerenderizada, y eso cambia lo que se promete

Se puso `Vary: Accept` en el proxy, no llegó; se puso además en `next.config.ts`, tampoco. Medido
contra `next start` el 2026-08-30:

| Ruta | `Vary` servido |
|---|---|
| `/md/es.md` y `/robots.txt` | `Accept` **sí** llega (en `robots.txt` salen las dos cabeceras) |
| `/` y `/en/sobre-mi` | solo el de Next: `rsc, next-router-state-tree, …, Accept-Encoding` |

La diferencia es el camino: una página servida del prerender (`x-nextjs-cache: HIT`,
`x-nextjs-prerender: 1`) lleva el `Vary` que escribe Next, y **ni el proxy ni `headers()` pueden
añadirle nada**.

> **Así que el contrato no se apoya en esa cabecera.** La vía estable es la **URL explícita**, que
> `llms.txt` anuncia; la negociación por `Accept` es la comodidad que piden los dos escáneres, y
> detrás de una caché compartida que ya tenga guardado el HTML puede no llegar. **Está dicho así
> en `llms.txt`, en vez de prometer de más** — que es el fallo que `BRAND.md` ya se anotó cuando
> la regla del control sobre imagen prometía un contorno entero.

### Lo que cuesta, dicho antes de que lo diga nadie

- **Las páginas muy visuales dan un markdown más delgado que su página.** Es correcto, no un
  defecto: lo que un agente puede usar de una rejilla de muestras de color *es* el texto.
- **Lo que no entra se cuenta y se nombra en cada corrida:** 228 `svg` (ilustraciones), 96
  controles —de los que **sí entra su etiqueta**, porque dice qué ofrece la página— y 460
  elementos marcados `aria-hidden`. Un alcance recortado en silencio se lee como cobertura.
- **Una fila de Hitos sale como bloques sueltos** («(01)», «Emendu», «2026»), porque en el DOM son
  `div` hermanos y ahí no hay señal que distinguir. Se deja: la ficha puso fuera de alcance que el
  markdown sea bonito, y adivinar qué `div` es una fila es justo la clase de listeza que hace
  divergir un conversor de su página.

### Y el coste que no estaba previsto: cada entrada de aquí caduca el markdown del artículo

Lo encontró CI en la primera corrida del guardián, y la causa no era ninguna de las dos que se
plantearon primero. El artículo enlaza sus fuentes con **enlaces profundos que llevan número de
línea** (`DECISIONS.md?plain=1#L1165`), calculados en el build. Y el índice de la cabecera de este
archivo **lo genera `npm run indices` con una línea por entrada**, así que **una D nueva empuja una
línea a todas las de debajo**: D157 y D158 movieron **22 enlaces** entre las dos variantes del
artículo.

> **Consecuencia, dicha entera: casi todo PR de este proyecto añade una entrada aquí, así que casi
> todo PR deja el markdown del artículo viejo.** El guardián lo caza y el arreglo es un comando
> (`npm run build && npm run md`), pero es fricción recurrente y no se descubre leyendo el diseño.

**No se arregla quitando los números de línea**, que son lo que hace que el enlace caiga en la
entrada y no en un archivo de 9.000 líneas. Y no se arregla generando en el build, que es la
opción que D48 ya cerró. Se acepta, y lo que la hace aceptable es que **el fallo es ruidoso**: sale
en CI nombrando la variante, no en producción.

*Es, además, la confirmación de por qué el guardián tenía que nacer el mismo día que el artefacto:
si hubiera entrado en la tanda 5, entre medias habrían pasado tres tandas con el markdown diciendo
lo de antes y nadie mirándolo.*

### Addendum *(2026-08-30)* · Los 391 separadores, y por qué se arregló la premisa y no la regla

El conversor mete un `·` entre dos elementos pegados para recuperar una separación que hacía el
CSS, y dejó escrito que **«en prosa no se dispara, porque React emite el espacio entre palabras
como nodo de TEXTO»**. La premisa era falsa en este sitio: `ui/rich.tsx` y `ui/article.tsx`
envolvían **cada tramo de texto plano** en un `<span>` que solo llevaba la `key` —sin clase, sin
semántica, sin efecto visual—, así que en prosa lo NORMAL era «elemento pegado a elemento».
Medido sobre lo commiteado: **391 « · » colocados justo antes de un signo de puntuación** en las
28 variantes. El artículo servía `no quería un CV en HTML, · **quería una prueba de criterio** · :
en producto`.

**Se arregló la premisa.** Los dos envoltorios pasan a `Fragment`: el texto plano vuelve a ser un
nodo de TEXTO y los 391 desaparecen **por construcción**, no por una regla nueva que haya que
mantener. Cero cambios visuales, comprobado además que ningún selector de `globals.css` apuntaba a
esos `span`.

**Y el disparo que se añadió es estrecho, porque lo ancho se probó y rompía.** El caso espejo —el
chip «Exit» detrás de un nodo de texto separado por `ml-2`, que salía `AppRadar.Exit`— pedía
disparar también sin adyacencia de elementos. La primera versión disparaba siempre que faltara el
espacio, y **medida sobre las 28 variantes inventaba separadores nuevos**: `+ · 28%` en la cifra
de Hitos y `palabras · · ·` en la cabecera del artículo. Atado a un **final de frase**, el diff
sobre las 28 es exactamente las dos líneas del chip y nada más.

#### Lo reutilizable: tres metros validados contra casos que no existen, el mismo día

Es el patrón que `BRAND.md` §Cómo medir nombra en su punto 1, y esta sesión lo produjo **tres
veces**, las tres en cosas escritas ese mismo día:

| Metro | Contra qué se validó | Qué no veía |
|---|---|---|
| El test de «no se dispara en prosa» | `<p><em>a</em> y <em>b</em></p>`, escrito a mano | La forma real, `<span>…</span><strong>…</strong>`, que el sitio sí emite |
| Dos de las nueve comprobaciones de `check:agentes` | `includes` de la URL | Que la home es prefijo de todas y `/trayectoria` de `/trayectoria/emendu`, así que aprobaban siempre |
| El caso malo de `ai-train` en el arnés | Un `sed`, que sustituye una vez **por línea** | Que `String.replace` cambia la primera del ARCHIVO, y era la del comentario |

**La forma del fallo es siempre la misma: el caso de prueba se escribe a mano y se parece a lo
real sin serlo.** Los tres pasaban en verde. El primero lo destapó una revisión con IA, el segundo
también, y el tercero CI. Ninguno lo habría destapado mirar el código, porque los tres estaban
*bien* leídos: lo que fallaba era contra qué se comparaban.

*(Y una cuarta del mismo día, de otra familia: el sello de `/accesibilidad` se puso **antes** del
último cambio tres veces seguidas. Esa sí la cazó su guardián las tres.)*


### Addendum (2026-08-31) · `q=0` es un «NO», y el proxy lo leía como un «sí»

RFC 9110 §12.5.1 le da al peso cero un significado explícito: *«este tipo no es aceptable»*. Así
que `Accept: text/markdown;q=0` pide **lo contrario** que `text/markdown` — y `quiereMarkdown()`
miraba solo el token, de modo que las dos cabeceras hacían lo mismo. Encontrado leyendo, no
midiendo: ningún cliente de los que hoy visitan el sitio manda `q=0`.

**No se implementa un negociador de contenido, y por eso el arreglo cabe en ocho líneas.** Aquí
no hay preferencia entre tipos que resolver: o se pide markdown por su nombre, o se sirve el
HTML. Lo único que se añade es leer el peso **de ese token**. El orden de preferencia entre
tipos sigue sin existir, a propósito.

**Un peso mal escrito NO cuenta como rechazo, y la asimetría es deliberada.** La misma sección
manda ignorar el parámetro que no se entiende, y los dos errores no cuestan igual: tratar
`q=abc` como un «no» **apagaría el canal entero** por un cliente que escribe mal la cabecera,
que sale mucho más caro que servirle markdown a quien lo pidió raro. Solo un `q=0` válido
rechaza.

**Con guardián, porque el caso no aparece en producción.** Un arreglo que ningún cliente ejerce
se deshace solo y no lo nota nadie, así que `check:agentes` lleva el caso y se comprobó que
**muerde**: con el `quiereMarkdown()` anterior da 5 fallos y sale con código 1. Las ocho formas,
medidas sobre `proxy()`:

| `Accept` | Sirve |
|---|---|
| `text/markdown` | `/md/es/sobre-mi.md` |
| `text/markdown;q=0` · `;q=0.000` · `; q=0` | HTML |
| `text/markdown;q=0.1` | `/md/es/sobre-mi.md` |
| `text/markdown;q=abc` | `/md/es/sobre-mi.md` |
| `text/html,text/markdown;q=0,*/*` | HTML |
| el `Accept` de un navegador | HTML |

### Addendum (2026-08-31) · lo que esta entrada prometía de menos

D158 escribió, y `next.config.ts` con ella, que detrás de una caché compartida la negociación
por `Accept` **«puede no llegar»**. Medido contra producción en el cierre de «Agentes», llega —
y es segura en los dos sentidos. Sobre `/trayectoria`: HTML `PRERENDER` → `HIT` (86.859 B),
markdown `MISS` → `HIT` (1.846 B), y el HTML siguiente vuelve a ser HTML. **Ninguna dirección
envenena a la otra.**

No cambia el contrato —la vía estable sigue siendo la URL explícita `/md/<locale>/<pagina>.md`,
y prometer de menos es el lado bueno en el que equivocarse—, pero se anota porque **un documento
que promete de menos también es drift**, y este proyecto ya tiene escrito el caso contrario
(D162, la regla que prometía de más).

### Addendum *(2026-09-02)* · Revisado el precio, y se acepta: la fricción es mecánica, acotada y ya no viaja a CI

Arriba se escribió «se acepta, y lo que la hace aceptable es que el fallo es ruidoso». Eso era una
predicción el día que se decidió. **Esto es la revisión después de haberlo pagado**, que es la única
forma honesta de saber si el precio era bueno.

**Lo que costó, medido sobre `ci.yml` al cerrar «Agentes»:** de los **5 CI en rojo de todo el
sprint**, **4 fueron «Markdown al día»** (runs `33382110066`, `33375346772`, `33335239930` y el del
cierre de sesión) y el quinto fue «Artículo al día», o sea la otra mitad de la misma familia.
**Ningún otro gate se puso rojo en todo el sprint.** A 7-10 min por run, son ~25 min de ida y vuelta
por vez, más el `npm run build && npm run md` local de cada una.

**Y el diff de la última trae la medición exacta:** el commit de cierre añadió dos addenda aquí, y
el markdown regenerado cambió **4 líneas, las 4 permalinks, 0 palabras de copy** — D160
`L9856 → L9902` y D166 `L10413 → L10459`, las dos **+46**, que es exactamente el largo de los
addenda. **El desplazamiento es constante y solo alcanza a las D posteriores a la inserción.** No
hay nada que juzgar en el arreglo: es aritmética.

**Las dos vías de escape siguen cerradas**, y por los motivos de arriba: quitar los números de línea
deja el enlace cayendo en un archivo de 10.000 líneas, y generar en el build lo cerró D48. La
tercera —anclas estables en vez de líneas— existe, pero **paga con D88**: el índice en la cabecera
es lo que permite abrir este archivo con un `Read` de 130 líneas, y moverlo o congelarlo para que
deje de crecer encarece cada consulta a cambio de ahorrar un comando.

**Lo que sí cambió el precio es otra cosa, y por eso esto se cierra aceptando en vez de arreglando:
el fallo ya no se descubre en CI.** `md:anclas` (2026-09-02) comprueba las 90 anclas de decisión en
milisegundos y sin build, y corre en el cierre de turno. El caso dominante —siete de los catorce
rojos de tres días— se ve ahora **antes de empujar**. La fricción no se ha eliminado; ha dejado de
costar veinticinco minutos para costar un comando.

**Decisión: se acepta, revisada con la cifra delante.** Si vuelve a mirarse, el disparador no es el
número de rojos —ese ya bajó— sino que el arreglo deje de ser mecánico: el día que regenerar el
markdown cambie una palabra de copy y no solo un permalink, esto es otra cosa.

### Addendum *(2026-09-02)* · La cifra de bytes que publicaba esto se derivó, y pasó a ser una banda

Aquí se selló «la portada baja de 216 KB a 6,6 KB», y el artículo lo publicaba tecleado en el
diccionario, en los dos idiomas. **Un día después ya era falso**: medido contra producción el
2026-08-31, 221.678 B de HTML y 6.925 B de markdown. No fue un descuido — el HTML de la portada
crece con cada párrafo de copy y el markdown crece menos, así que **la divergencia es
estructural**.

Y era la única cifra de su párrafo con ese trato: la nota de preparación agéntica que va al lado
sale de `content/agentes/registro.json` con `agentes:sellar` detrás. Dos cifras vecinas, dos
tratos. **Ningún gate podía verlo**, y esa es la parte reutilizable: `check:articulo` sella
*dependencias que se mueven*, no *valores medidos que derivan*, así que un número tecleado dentro
de un `text` no declara nada y envejece en silencio. Es D38 en el último sitio donde no se
aplicaba.

**Se sella al final de `npm run md`** (`content/md/registro.json`), que es quien conoce los dos
archivos: el prerender de la portada ES y el `.md` que acaba de escribir. Medirlo en otro sitio
sería un segundo módulo que sabe lo mismo. Y se lee en la vuelta siguiente, por `lib/figures.ts`,
como el sello de PSI y el de agentes: **el HTML de la portada no existe cuando el build corre,
porque lo está emitiendo ese mismo build**.

**Lo que la página publica es una BANDA, no los dos bytes**, y esa es la decisión de fondo. Un
valor exacto derivado no mentiría, pero cambiaría en casi todo PR y arrastraría con él el `.md`
commiteado del artículo: compraría exactitud pagando con la fricción del addendum anterior. La
banda —el múltiplo de cinco por debajo del ratio— es cierta en las dos puntas del rango de hoy
(31,6× en el build local, 32,0× en producción) y **solo se mueve cuando la afirmación deja de ser
cierta**. Por eso el sello solo se reescribe entonces: los dos tamaños que lleva dentro son la
evidencia de la última vez que cambió, no una cifra publicable.

`md --verificar` comprueba la banda en cada corrida y sale rojo nombrándola si se movió. El drift
de bytes lo imprime, no lo suspende: suspenderlo pondría en rojo todo PR de copy, que es
exactamente lo que esta forma existe para no hacer.

## D159 · El guardián propio en vez del escáner ajeno: `check:agentes` — 2026-08-30

**Decisión.** Lo que este sitio le promete a un agente lo vigila un guardián **nuestro** en CI
—`npm run check:agentes`— y **no** la nota de ninguno de los dos escáneres públicos que abrieron
el sprint. Vigila exactamente las invariantes que este sprint adoptó, y ninguna más.

**La pregunta que lo abrió fue si había un plugin o una skill para meter esos escáneres en la
rutina, y la respuesta honesta es que no debería haberla**, por dos razones que este repo ya
tenía medidas. **Su nota mezcla lo que aplica con lo que no:** un 20/100 donde doce de los checks
son de superficies que el sitio no tiene no es una señal, es ruido con forma de nota, y
perseguirla lleva a publicar un `api-catalog` sin API — que es justo lo que P67 descartó tras
verificar los hallazgos uno a uno. **Y un metro que no controlamos cambia sin avisar:** sus
checks son estándares emergentes en borrador, así que el día que uno se mueva el gate se pone
rojo o verde por algo que no hemos decidido. Un escáner es **descubrimiento** —se pasa cuando se
quiere mirar—; la rutina es esto. Es el criterio de **D51**: si se dispara en un evento y no
requiere criterio, es un script en CI.

### Lo reutilizable: mira en tres sitios distintos porque la promesa ocurre en tres sitios

Es la regla 1 de `BRAND.md` §Cómo se escribe una regla —la condición se comprueba **donde** la
cosa ocurre— aplicada a un solo guardián, y mezclarlas habría sido el fallo:

| Qué promete | Dónde se comprueba | Por qué no vale el prerender |
|---|---|---|
| `llms.txt` nombra las catorce y trae sus dos secciones | El **artefacto** del build | Es un archivo, no una página |
| Markdown a quien lo pide, HTML a un navegador, `Vary: Accept` en ambos | **Ejecutando `proxy()`** | Una cabecera no está en el HTML: el prerender no sabe con qué `Vary` se sirvió |
| `robots.txt` abre en producción y cierra fuera (D13) | **Ejecutando `robots()`** en los dos entornos | El robots que se construye en CI es el de **no** producción: leerlo daría por bueno un `Disallow: /` |

**El caso de `robots` es el que más enseña.** Un guardián que leyera el artefacto habría
certificado exactamente lo contrario de lo que cree, y en verde. Y comprueba **los dos** entornos
a propósito: el día que este gate diera rojo, la salida fácil sería quitarle a `robots()` su gateo
por entorno y dejar todo abierto, y entonces un preview de rama se indexaría.

### Lo que deja fuera, y lo dice

La nota de ningún escáner, lo primero. Y **el estado HTTP real**: que una ruta inexistente
devuelva 404 se comprueba por **estructura** —que no aparezca un segmento catch-all, que es lo
que de verdad convierte los 404 de un sitio en 200 vacíos— y no haciendo la petición, que
necesitaría servidor. Es un proxy honesto del modo de fallo, no la medición, y va escrito en la
cabecera del script y en la fila de `PRD-Live`.

Nace con **tres casos malos en `check:guardianes` el mismo día**, uno por cada una de las tres
fuentes, y no cuatro días después como `check:kit`. Los seis que se le probaron al escribirlo
—incluido el `includes` que le serviría markdown a un navegador— los rechaza todos.

## D160 · Content Signals: la frase del `LICENSE`, dicha para una máquina — 2026-08-30

**Decisión.** `robots.txt` declara, sobre el comodín,
`Content-Signal: ai-train=no, search=yes, ai-input=yes`.

**`search=yes` y `ai-input=yes` no son permisividad: son el objetivo del sitio.** Su trabajo es
que lo encuentren, y cada vez más ese encuentro pasa por un asistente que lee para responder a
alguien **ahora**, citando la fuente. Decir que no ahí sería cerrarle la puerta al canal que el
sprint «Agentes» existe para abrir.

**`ai-train=no` porque ya estaba dicho.** El `LICENSE` del repositorio —«público para consulta,
no código abierto»— nombra explícitamente los textos del sitio y `content/` entre lo que no se
licencia para obras derivadas. **Un `ai-train=yes` al lado de esa licencia sería una contradicción
publicada.** No es una postura sobre la IA: es la misma frase, en un formato que una máquina puede
leer. Y la distinción que hace coherentes a las tres es esa: `ai-input` es *leer para responder
citando*; `ai-train` es *quedarse el contenido*.

**Es una preferencia, no un control de acceso**, igual que el resto de `robots.txt`. No la hace
cumplir nadie. Se pone porque es coherente, no porque impida nada, y eso se escribe aquí para no
vender de más.

### Lo que NO lleva, y es decisión

**Reglas por bot con nombre** (`GPTBot`, `Google-Extended`…). Sería una lista escrita a mano contra
un catálogo que cambia solo, o sea la familia D60: se queda vieja en silencio. Sobre el comodín
dice lo mismo sin lista que mantener. El día que haya que bloquear a uno en concreto, será por un
motivo específico y con fecha.

### Dos cosas de implementación que no eran obvias

**No hace falta cambiar la ruta por un handler propio.** `MetadataRoute.Robots` de esta versión de
Next tiene un campo `other` para directivas no estándar, que emite verbatim dentro del grupo de su
`User-Agent`. La suposición contraria —que un tipo cerrado obligaba a bajar a un `route.ts`— era
justo lo que `AGENTS.md` avisa: esta no es la versión de Next que uno recuerda.

**El guardián comprueba las tres por su VALOR DECIDIDO, no leyendo el que haya puesto `robots()`.**
Comparar una cosa consigo misma aprueba siempre. `check:agentes` lleva las tres escritas con su
porqué, y de las tres la que de verdad vigila es `ai-train`: es la única que alguien podría
cambiar por parecer más abierto, y la contradicción viviría en un `robots.txt`, que es un archivo
que nadie vuelve a leer después de escribirlo. Su caso malo entra en `check:guardianes` el mismo
día (D159).

## D161 · Cuatro huecos que vio un escáner ajeno, y el que no se tapa — 2026-08-30

**Contexto.** D157 fijó que la nota de un escáner agéntico no es un criterio de aceptación, y
sigue en pie. Lo que esta entrada añade es la otra mitad: **un escáner que mira desde fuera ve
cosas que ningún guardián de aquí puede ver**, y esas sí se arreglan. La segunda pasada, tras
mergear el sprint, subió de 75 a 87 con los doce puntos saliendo de una sola casilla (el
`Vary: Accept` de D158). De lo que quedaba, tres hallazgos eran ciertos y uno tenía la premisa
caducada.

**El `h1` no era el primer encabezado, y era invisible por construcción.** El diálogo de
consentimiento vive en el layout y se renderiza cerrado pero presente, por delante del `<main>`
desde P70.08, así que su título en `h2` encabezaba las 28 variantes. Los tres guardianes lo daban
por bueno y **ninguno estaba roto**: `check:marco` pide *un solo* `h1` no vacío y se cumplía;
`heading-order` de axe mira saltos hacia abajo (h2 → h4) y h2 → h1 baja de nivel, que es legal;
NVDA no lo señala porque el diálogo tiene su nombre accesible correcto. Es la regla 1 de
`BRAND.md` §Cómo se escribe una regla aplicada al metro: **el hueco entre dos reglas correctas no
lo cubre ninguna de las dos.** Arreglo: el título pasa a `p` con `aria-labelledby`, que es de
donde un lector toma el nombre; y la regla que faltaba —el `h1` abre el documento— entra en
`check:marco` con su caso malo.

**El 404 no hablaba markdown, que es la mitad de D158 que no se vio.** La negociación cubría las
páginas que existen; una ruta que no existe reescribía a un `.md` que tampoco, así que el agente
recibía 27 KB de HTML donde pidió texto. El estado HTTP siempre fue correcto. Ahora el proxy
responde 404 con un cuerpo corto que apunta a `/llms.txt`, al sitemap y al inicio, y **la página
404 en HTML publica esos mismos dos destinos**: las dos puertas del mismo error tienen que decir
lo mismo, o lo que un agente encuentra depende de qué cabecera mandó.

**Las rutas que un agente adivina.** `/about`, `/privacy` y `/contact` daban 404 porque los slugs
son españoles en los dos idiomas. Diez redirecciones 307 en `next.config.ts` —no páginas, no
entran en el sitemap—, con `permanent: false` a propósito: un 308 se cachea para siempre y estos
alias son una comodidad reversible.

### Lo que NO se hace, que es la parte que evita repetir la discusión

**El `Organization` no se rellena.** El escáner pide `contactPoint` y `address` en el nodo
`Organization`, y el único de la home es el `worksFor` de Francisco, o sea **su empleador**.
Rellenarlo es publicar datos de un tercero o fingir que los propios son suyos, y contradice lo que
el propio `llms.txt` afirma: «no es una agencia ni un estudio». Se acepta el 50 % de ese check.
Lo que sí entra es `contactPoint` en el `Person`, que ya tenía email, teléfono y dirección: la
premisa del hallazgo estaba caducada y comprobarlo costó un `grep`.

**El ratio de contenido tampoco, y con cifra.** El escáner pide ≥5 % de texto sobre el HTML; la
home da **2,9 %**, porque **73 de sus 220 KB (33 %) son `<script>`**: el payload RSC del App
Router. La métrica mide el envoltorio, no el contenido, y el problema real que intenta detectar
—que un cliente sin JS no encuentre texto— **este sitio ya lo resuelve por otra puerta**: la home
en markdown son 6,6 KB contra 216 (D158). Las palancas que quedan empeorarían el sitio para las
personas a cambio de un punto. Mismo criterio que el `api-catalog` sin API de D159. **Si el
hallazgo vuelve: está medido y descartado, no sin mirar.**

**Y una hipótesis marcada como tal.** El escáner no encuentra la sección «cuándo usar» de
`llms.txt`, que existe entera desde P67.4. Lo único medido es que su título está en español; que
busque la cadena inglesa es *probable* y **no está comprobado**. Va con alias bilingüe en el
encabezado y tarea propia con las cuatro opciones ordenadas, porque una sospecha escrita como
causa redirige la siguiente investigación.

### La tercera pasada, y la predicción que falló — 2026-08-30

**75 → 87 → 96**, esta última con los cuatro arreglos en producción. Essential 76,2/80 · seis de
siete. Pasaron «Agent-friendly 404s» —*«the strongest 404 contract»*—, «Trust anchor pages»
—*«All trust anchor pages verified: About, Contact, Privacy»*— y «Agent instruction», que era la
hipótesis: *«When-to-use guidance found in llms.txt»*. Con una sola variable cambiada en ese
archivo, así que la sospecha pasa a causa y las opciones B, C y D se quedan sin usar.

**Y una predicción escrita antes de mirar que salió MAL, que es la que enseña algo.** «Content
without JavaScript» tenía que subir del 67 % al arreglar el `h2`, y **no se movió ni un punto**:
el 67 % lo fijaba el ratio de contenido, solo. Lo que cambió es el texto del hallazgo, que ya
solo se queja del 4,4 %.

**El arreglo seguía siendo correcto, y esa es la moraleja.** Era un defecto real en las 28
variantes que tres guardianes daban por bueno, y ahora tiene regla y caso malo. Que un escáner no
lo puntúe no lo convierte en un no-defecto — es exactamente la distinción de D157 entre arreglar
el sitio y perseguir una nota. **La cifra de un escáner no valida un arreglo ni lo invalida: solo
dice qué mide él.** Escribir la predicción antes de mirar es lo que permite verlo; sin ella, el
salto de doce puntos se habría atribuido a los cuatro cambios por igual.

## D162 · El barrido de huérfanos se queda en `logo-kit`, y eso se decide en vez de heredarse — 2026-08-30

**El hecho, y era pequeño.** En `public/` seguían los cinco SVG que trae `create-next-app`
—`file`, `globe`, `next`, `vercel`, `window`— con **cero referencias** en todo el repositorio,
no solo en `app/`, `components/`, `lib/` y `content/`. Se borran, y no puede romper nada:
`check:marco` corre sobre el prerender de las 28 variantes, así que un 404 saldría. Con eso,
`public/` deja de tener un solo archivo suelto en su raíz que no sea un favicon.

**Lo que lo hizo hallazgo y no limpieza.** La regla que declara este caso rojo **ya existe y ya
tiene portador**: es el barrido de `check:kit` (D119), que compara el disco contra lo declarado
en `lib/logo-kit.ts` **en los dos sentidos** y considera un archivo huérfano exactamente igual
que uno declarado y ausente. Pero corre **solo dentro de `public/logo-kit/`**. El resto de
`public/` —`img`, `og`, `video`, `cv`, `logos`, `email-signature`, `md`, los seis favicons— no lo
cuenta nadie. Familia «la regla sin portador»: declarada, con remedio conocido y aplicada a una
fracción de su alcance. Es la misma forma que D112, donde un guardián que hashea una carpeta se
estrechaba en silencio al irse un archivo.

**Y la decisión es NO generalizarlo.** No por coste de implementación —la forma está escrita y
sería copiar `check:kit`—, sino porque **el barrido de `logo-kit` funciona por una propiedad que
las demás carpetas no tienen: todo lo que hay dentro está declarado en un registro**. `logo-kit`
existe para que `lib/logo-kit.ts` lo enumere; ahí la lista es la fuente y el disco es la copia.
En el resto de `public/` la relación es la contraria: los favicons los consume el navegador por
convención y no los nombra ningún registro, `robots` y `sitemap` los genera Next, y el markdown
de `public/md/` ya tiene su propio guardián en los dos sentidos (`md:verificar`, D158). Un
barrido general sería **casi todo allowlist**, y una allowlist que cubre casi todo el alcance no
distingue: aprueba por omisión, que es justo el fallo que este repositorio lleva seis veces
encontrando. Añadiría además un guardián más al presupuesto de contexto, con el problema que
mide P68.7405 y D163.

**El criterio de salida, para que la próxima revisión no lo levante otra vez.** Se generaliza el
día que aparezca en `public/` una segunda carpeta **enumerada por un registro del repo** —la
misma condición que cumple `logo-kit`—, y entonces lo que se escribe no es un barrido general
sino el segundo caso del mismo patrón. Mientras la respuesta sea «hay una sola», generalizar es
inventar indirección, y es la regla de D113 aplicada a un guardián en vez de a una capa.

## D163 · La sección más pesada del arranque era la que nadie lee hasta que algo sale rojo — 2026-08-30

**El dato, y no era el que decía la ficha.** P68.7405 nació el 2026-08-30 diciendo «quedan 13
palabras de margen», que se lee como un accidente de una tanda. El octavo `method-review` midió
la **curva** y el diagnóstico cambió de forma: 13.084 el 19 de agosto, 12.058 tras la primera
poda, 12.695 tres días después, 12.698, 12.251 tras la segunda poda, 12.287 hoy. **La banda vive
entre 12.058 y 12.698, y el objetivo declarado de 11.600 no se había alcanzado NUNCA** en toda la
vida del techo. Dos podas reales, las dos funcionaron, y las dos acabaron rozando el techo otra
vez.

**La familia, que es lo que lo hace una decisión y no una limpieza.** No es «el umbral que
persigue al dato» del catálogo, porque **ese techo no se ha movido nunca** —0 de 3 en el ciclo,
verificado por el propio `check:contexto`—. Es su imagen especular, y el `method-review` la dio
de alta con nombre: **el dato que persigue al techo**. El techo aguanta y es el dato el que se le
pega, porque **la operación de retirar solo se dispara cuando se cruza**. El sistema equilibra en
«techo menos épsilon» de forma permanente, y un indicador que siempre está al 99,9 % no distingue
sano de a-punto-de-romperse. Se vivió dos veces en una sola tanda: la nota nueva de
`design-review` dejó la skill en 4.716 con techo 4.600, y después dos filas de la tabla de gates
subieron el arranque a 12.335. Las dos veces se comprimió, las dos veces funcionó, y las dos
veces el resultado fue volver a rozar.

**El candidato estructural tenía cifra y se hizo más gordo mientras se discutía.** La sección
«Cómo se verifica lo que no ve un compilador» de `PRD-Live.md` medía **824 palabras** cuando se
escribió la ficha y **992** al ejecutarla dos días después: creció 168 con las filas de
`check:agentes` y `md:verificar` del propio sprint. El **8 % del presupuesto**, y la sección que
**el propio `PRD-Live` describía así**: *«este no se lee hasta que un check sale rojo diciendo su
nombre»*. Es la definición literal de contenido a demanda viviendo en el presupuesto que se
precarga siempre — la misma forma que D88 encontró en el índice de `DECISIONS.md`, que era el
único componente que crecía por construcción.

**Qué se hizo.** La tabla baja a **`GATES.md`**, a demanda y nunca `@`-importada, con la
condición de apertura escrita en su cabecera: se abre cuando un check sale rojo diciendo su
nombre, o cuando hay que decidir si un gate nuevo hace falta, y **nunca para aplicar una regla**
—eso lo llevan `CLAUDE.md` y `BRAND.md`, que sí están siempre en contexto—. En `PRD-Live` queda
el puntero y **lo que sí es criterio de producto**: que una parte de los gates corra a mano no es
deuda, es alcance, y esa frontera se decide gate a gate. `12.289 → 11.455`.

**Y con eso el objetivo deja de ser discutible, que era la otra mitad de la ficha.** La ficha
ofrecía como salida decidir que 11.600 estaba mal, con el argumento de que un objetivo que no se
cumple nunca no gobierna nada. **No estaba mal: estaba esperando a que se retirara algo
estructural.** Alcanzado (11.455), lo que corresponde no es discutirlo sino lo que ya estaba
escrito en `check-contexto.ts`: el objetivo baja un escalón de 200 —**11.400**, la misma cadencia
que 12.000 → 11.800 → 11.600— porque un objetivo cumplido deja de tirar, y el techo **aprieta a
11.700** dejando los ~245 de holgura que la regla de D139 fija como magnitud a sostener. Un
movimiento por techo es el trinquete apretando; el segundo ya no.

**Lo que NO se hizo, y hay que decirlo porque la familia sigue abierta.** El `method-review`
proponía además convertir la **retirada en un paso del ciclo**, en el momento de abrir sprint
donde ya se sella `CICLO_ABIERTO`. Francisco lo dejó fuera. Así que esto cierra **una instancia**,
no la familia: mientras retirar siga siendo una reacción al rojo, el equilibrio vuelve a ser el
rojo, y lo único que ha cambiado es desde dónde se sube. El propio `check:contexto` lo tiene
escrito en su cabecera —*«si el objetivo persigue al dato en vez del techo, esto no lo mira»*—, y
sigue sin mirarlo.

**Una nota sobre el coste de mover una sección, que resultó ser la prueba de que el arnés
funciona.** Moverla puso en rojo `check:accesibilidad` y `check:articulo`: las dos declaran esa
sección como fuente, la primera en su bloque §verify y la segunda en tres de sus doce secciones.
Ninguna de las dos copias había dejado de ser cierta —cambió dónde vive la tabla, no lo que
dice—, así que se re-selló; pero **el aviso llegó sin que nadie se acordara de que existía la
dependencia**, que es exactamente lo que D84 y D140 existen para producir. Cinco punteros más se
actualizaron a mano (`CLAUDE.md` ×2, `BRAND.md`, `README.md` y la declaración de
`content/accesibilidad/dependencias.ts`); ninguno de ellos tiene guardián, y esa asimetría es
deuda que no se tarea aquí porque el ratio no la justifica todavía.

### Addendum *(2026-09-02, P72.08)* · La cabecera prometía una fila por gate, y la tabla nunca la cumplió

Al mover la tabla aquí se le escribió una cabecera que la tabla heredada no cumplía: **«una fila
por gate»**, con 19 filas contra 22 gates propios de `ci.yml` y otros dos manuales nacidos
después. **Catorce sin fila, `check:guardianes` incluido** — el meta-gate, el único cuyo modo de
fallo es una luz verde y cuyo contrato (muta archivos rastreados, exige árbol limpio, va el
último porque muerde el HTML del build) es justo el que nadie recuerda de memoria.

**El hueco se heredó de `PRD-Live` §5; lo nuevo era la promesa.** Y eso cambia el arreglo: no era
«se olvidaron catorce al mover», era que al mover se escribió algo que la tabla nunca había
cumplido.

**Lo que duele no es la deuda de catorce filas, es cómo se lee el vacío.** Este documento se abre
«cuando un check sale rojo diciendo su nombre», así que para esos catorce el `grep` devolvía
**vacío**, y vacío se lee como «no hay contrato escrito para esto»: el modo de fallo que este
repo tiene nombrado desde D38/D57/D60/D63, *un metro que devuelve lista vacía parece un
aprobado*.

**Se corrige la PROMESA y no la tabla:** una fila por gate **cuyo contrato no es evidente por su
nombre**, y la cabecera dice explícitamente que un `grep` vacío significa «el nombre lo dice
todo». La enumeración completa se remite a `ci.yml` y a los `scripts` de `package.json`, que es
donde no puede mentir. Completar la tabla habría devuelto la sección al tamaño que motivó esta
decisión, y `check:skills` contrastando filas contra `ci.yml` solo tiene sentido si la promesa es
«una por gate» — que ya no lo es.

**Y se escriben las cuatro que sí la necesitaban:** `check:palette` (hace dos preguntas y la
segunda no la dice el nombre), `check:guardianes`, `consentimiento` (distingue «cero» de «sin
almacén», y el entorno va dentro de la clave) y el caso malo del carrusel (el único guardián del
repo que no entra en `check:guardianes`).

**El mismo defecto estaba en el `README`**, con su propia tabla de pasos de CI: le faltaban
**dos**, `md:verificar` y `novedades`, y los dos son **regeneradores** —rehacen un artefacto y
exigen diff vacío—, o sea la categoría que no encajaba en su columna «Qué impide». Se completan y
la tabla nombra la categoría. *(La ficha decía tres e incluía `npm run md`; no es un paso de
`ci.yml`, solo se nombra en un comentario.)*

## D164 · El aviso ya estaba puesto y gritó cinco veces: el hueco no era decirlo, era leerlo — 2026-08-30

**La ficha proponía dos mitades y una ya estaba hecha.** El `sprint-review` de cierre de «Voz»
encontró tres PR abiertos, dos de Dependabot con 8 días —#152 (grupo `next`, CI verde) y #154
(ESLint 10, en rojo y ya tareado como salto manual en P68.77)—, **los dos obsoletos al
encontrarlos**: ESLint iba por 10.9.1 y `next` por 16.3.3, así que el PR que esperaba ya no era
el bump que había que hacer. Y proponía **B** («que el propio workflow diga por qué no se
mergea, porque hoy ese motivo se queda en el log del job, que no lee nadie») más **A** (un paso
del ritual de cierre que mire la cola).

**B estaba implementada desde el 2026-08-22 y había funcionado.** El paso «Decir qué le falta al
que no entra» de `dependabot-automerge.yml` entró en el mismo commit que el automerge acotado
(P64.6), y #152 lo demuestra: etiqueta `revisar a mano` puesta y el motivo escrito en el PR, con
la lista de paquetes y los tres pasos de `gate:html`. La premisa de la ficha estaba **caducada**,
y comprobarlo costó un `gh pr view`.

**Lo que sí apareció al comprobarlo es peor y más útil: el aviso se había publicado CINCO
veces.** Dependabot reescribe la rama cada vez que aparece una versión nueva, y cada push
volvía a disparar el paso. Cinco comentarios idénticos en un PR que nadie estaba leyendo — y con
un detalle que los hacía activamente falsos: **el motivo visible arriba era el del PRIMER bump**,
no el del que había en la rama. Un aviso que se repite no avisa más: avisa peor, porque enseña a
no leerlo. Se arregla con `--edit-last`: un solo comentario, siempre con los paquetes de ahora.

**Y eso vuelve la conclusión de la ficha más fuerte de lo que ella sabía.** Decía «es un problema
de atención, no de detección», y descartaba por eso la opción C (un guardián con umbral de
antigüedad, con el coste de contexto que mide D163). El PR **gritó cinco veces y nadie
escuchaba**: no falta señal, falta un momento en que alguien mire. Ese momento es el **cierre de
etapa**, que ya mira el tablero y la medición, y ahí queda escrito con su criterio: **el PR que
no se mergee en el cierre se CIERRA**, y Dependabot reabre el vigente en su siguiente pasada. La
regla no es «revisar la cola» sino «vaciarla», porque revisar uno podrido es trabajo tirado y era
justo lo que había pasado dos veces.

**Se cerró #152 con eso**, sin criterio sobre el bump y por antigüedad, dejando la cola a cero.
El automerge acotado sigue sin tocarse: su allowlist es correcta y su argumento —que CI no puede
ver un cambio de render, porque `gate:html` está fuera a propósito (D42/D45)— sigue en pie. El
hueco estaba **después** de su veredicto, y era el único sitio donde no había nadie.

**Lo que queda abierto, y no se tarea.** El paso del ritual es un párrafo en `CLAUDE.md`, así que
depende de que el cierre se ejecute; entre cierres puede pasar más de una semana y un PR puede
pudrirse igual. Es la misma forma que D163 dejó abierta —una operación que solo se dispara en un
momento concreto— y el remedio conocido (C, el umbral de antigüedad) se descarta hoy por su coste
de contexto, no porque no funcionara. Se revisa el día que la cola vuelva a acumular dos PR entre
dos cierres consecutivos: ese es el dato que convertiría el descarte en un error.

## D165 · El informe del escáner era una API, y con ella un suspenso se descarta con cifra — 2026-08-31

**Decisión.** La tanda 6 de «Agentes» cierra cinco huecos, y el que cambia el método es el
último: **el informe de los dos escáneres se lee por API, en JSON, no por captura recortada**.
`is-agentic.com` publica su `openapi.json` y un `GET /api/v1/report?url=…` de solo lectura; y la
página de ora (`ora.ai/score/<dominio>`) trae el payload completo embebido. De ahí salen **125
checks y 294 puntos** con su `id`, su `status`, su cifra y su `details`, en un comando.

> **Esto retira una regla escrita.** Hasta hoy el método decía que *«el detalle de ora solo sale
> de la captura recortada»*, y con él una tarea de medición costaba abrir Chrome, buscar el check
> a ojo y transcribir su frase. Leer 125 `details` a ojo no es que sea caro: es que **no se hace**,
> y por eso los tres hallazgos nuevos de abajo llevaban dos pasadas invisibles.

### La brecha 96 ↔ 67 tiene número, y es el denominador

`is-agentic` declara **16 checks elegibles** (essential 7 + recommended 9). Ora puntúa los mismos
**dentro de 125**, y **52 de 294 puntos** salen de superficies que este sitio no tiene: MCP, API
REST/GraphQL, OAuth, SDK, CLI, sandbox, pricing, comercio agéntico. Es D157 medido en vez de
argumentado: *un check de superficie agéntica aplica si el sitio TIENE esa superficie*.

### «Schema type breadth» 0/2 — DESCARTADO, con la cifra que lo descarta (P68.749)

La ficha planteó que la primera hipótesis fuera **el alcance del escáner**, no el sitio. Se
confirma, y con tres pruebas del propio informe:

| Del informe | Qué dice |
|---|---|
| `json-ld` ✓ 4/4 | «Rich JSON-LD identity: Person … **(1 block(s))**» |
| `schema-type-breadth` ✗ 0/2 | «No extended schema types found» — y su recomendación pide, literalmente, **`BreadcrumbList`** |
| `markdown-frontmatter` ✗ | «Frontmatter **on /** …» |

**Un bloque.** El sitio emite JSON-LD en las 28 variantes y, contadas sobre el HTML
prerenderizado, **once `@type` distintos**: 26 `BreadcrumbList`, 12 `Organization`, 10 `WebPage`,
más `TechArticle`, `ContactPage`, `ProfilePage`, `WebSite`, `Person`, `ContactPoint`,
`PostalAddress` y 62 `ListItem`. El escáner **sí visita varias páginas** —otros checks del mismo
informe dicen «6 measured pages», «6 checked pages», «5 sampled pages»—, pero **el JSON-LD lo lee
solo de la home**. Y encima pide un tipo que las trece internas ya publican.

Así que el hallazgo es **cierto de la home sola y falso del sitio**, y no se toca nada: los dos
únicos tipos que serían verdad —`Occupation` y `EducationalOccupationalCredential`— se añadirían
justo en la página que el escáner mira, que es la definición de perseguir una nota. *Si vuelve:
está medido y descartado, no sin mirar.*

Es `BRAND.md` §Cómo medir punto 8 en su otra dirección: ahí se valida el **aprobado**, aquí el
**suspenso**. Un informe que declara su alcance —«5 sampled pages»— parece riguroso justo cuando
el alcance es el fallo.

### `sameAs` llevaba un repositorio, y el campo que lo recoge no era el que parecía (P68.747)

El `sameAs` del `Person` es «quién es esta persona en otros sitios», y la segunda URL era el
**repositorio** de este sitio: una obra, no una identidad. Pasa a `github.com/franciscoylopez`, el
perfil.

**El repo baja al nodo `WebSite`, que es de quien es** — y ahí la ficha proponía `codeRepository`,
que es la propiedad que uno escribiría porque dice literalmente «el repositorio de esto».
**Medido contra Schema.org antes de escribirlo: su `domainIncludes` es solo `SoftwareSourceCode`.**
En un `WebSite` sería marcado inválido publicado para aprobar una casilla. Va como **`isBasedOn`**
—dominio `CreativeWork`, `URL` en el rango, definición oficial *«un recurso del que esta obra se
deriva»*—, y no envuelto en un nodo `SoftwareSourceCode` propio, que costaría un tipo más que
mantener para colgar una URL que el pie ya publica con un enlace visible.

> **La regla, que es la parte reutilizable: el nombre de una propiedad no dice su dominio.**
> `codeRepository` en un `WebSite` se lee perfecto y no existe. Cuesta un `fetch` a schema.org.

**Y la hipótesis sigue siendo hipótesis.** Que ora suspenda `json-ld-entity-linking` POR ESTO está
sin comprobar, y el rescaneo no aísla la variable porque en la misma tanda entra `/agents.md`. Si
el check se mueve no se le podrá atribuir a uno solo; si **no** se mueve, eso sí es informativo.

### `Vary: Accept` caía sobre todo, y ningún gate podía verlo (P68.742)

Las cabeceras de seguridad y la de negociación iban en la **misma** regla de `headers()`,
`/:path*`. Una caché compartida keyea por el `Vary`, y el `Accept` de un asset varía por familia
de navegador: cada tarjeta OG, cada PDF del CV y cada fuente pasaba a tener **una copia guardada
por familia** en vez de una.

**No es incorrección, es coste**, y por eso llevaba un sprint sin verse: no rompe nada, no sale en
ningún informe, y solo se paga en una caché que no es nuestra. Medido con `curl -I` antes y
después, sobre las cinco familias:

| Ruta | Antes | Después |
|---|---|---|
| tarjeta OG · PDF del CV · `.woff2` | `Vary: Accept` | sin `Vary` |
| `/md/es.md` | `Accept, Accept-Encoding` | `Accept-Encoding` |
| `/robots.txt`, `/llms.txt`, `/favicon.ico` | `Accept` + la de Next | solo la de Next |
| `/`, `/sobre-mi`, `/en/sobre-mi` y una ruta inexistente, con `Accept: text/markdown` | `Accept` | **igual** |

**La última fila es el hallazgo:** el `Vary` de las respuestas negociadas no lo ponía esta
configuración, lo pone `conVary()` dentro del proxy. Por eso acotar la regla no le quita nada a la
negociación. La cabecera se recorta a la misma silueta que el `matcher` del proxy —fuera `_next`,
`api` y toda ruta con extensión—, porque donde el proxy no corre no hay dos cuerpos posibles.

### `/agents.md`, y los diez alias de D161 que no miraba nadie (P68.748)

Un escáner prueba tres rutas para encontrar la documentación para agentes de un sitio:
`/agents.md`, `/.well-known/agent-skills` y `/skills.sh`. **Entra una**, con un 307 a `/llms.txt`;
las otras dos son índices de skills ejecutables y aquí no hay ninguna — publicarlas sería el
`api-catalog` sin API de D157. Consecuencia aceptada por escrito: el check se queda en 1/2 como
mucho, y en 0/2 si exige las tres.

**Lo que apareció al hacerlo es el hallazgo:** los diez alias de D161 se comprobaron a mano el día
que se escribieron y **se quedaron sin guardián**, que es el punto 2 de `BRAND.md` §Cómo se
escribe una regla en directo. Ahora `check:agentes` prueba **las once rutas contra la regex
compilada de `routes-manifest.json`**: que redirijan, a dónde, con **307** —un 308 se cachea para
siempre y estos alias son reversibles— y que el destino sea una página del registro o `/llms.txt`.

### El manifiesto compilado es una entrada de guardián que no se estaba usando

Las dos comprobaciones nuevas de `check:agentes` —cabeceras y alias— leen
**`.next/routes-manifest.json`**, que trae la **regex ya compilada** de cada regla: la que el
servidor usa de verdad para decidir qué cabecera pone y a dónde redirige. Leer el `source` de
`next.config.ts` habría sido opinar sobre una cadena, y comparar la configuración consigo misma
aprueba siempre. Es la regla 1 de `BRAND.md` —la condición se comprueba donde la cosa ocurre—
aplicada a un archivo que llevaba dos sprints ahí sin que nadie lo abriera.

### El markdown ya dice de qué habla y de cuándo es (P68.746)

El frontmatter de las 28 variantes tenía tres campos y ahora tiene cinco. `description` sale del
`<meta name="description">` del prerender —el mismo texto del `<head>` y de la tarjeta OG—, y
`last-updated` de **`lib/page-modified.ts`**, donde se mudan las fechas que vivían dentro de
`app/sitemap.ts`: el sitemap ya publicaba esa misma respuesta a esa misma pregunta, así que una
segunda tabla habría sido D60 en su forma más tonta. `url` pasa a `canonical`, que es el nombre
por el que un lector lo busca; se puede renombrar porque el campo tenía un día de vida (D158) y
ningún consumidor.

**Y el git se descartó con motivo, que era la trampa de la ficha:** el `.md` se genera ANTES del
commit que lo movió, así que `md:verificar` recalcularía una fecha distinta a la guardada y CI se
quedaría rojo en cada PR de contenido. Más el motivo que ya estaba en `sitemap.ts`: Vercel clona
en superficial.

**Hubo que citar el YAML**, y no era previsible: las descripciones de este sitio llevan dos puntos
y espacio —«Del discovery al dato: investigo…»—, que en un escalar plano parten la línea en clave
y valor. Comprobado que las 28 parsean con los cinco campos.

### Lo que este informe encontró y NO se toca hoy

Tres hallazgos ciertos que salieron del volcado de los 125 checks, y que no son de esta tanda. Se
anotan aquí para que no vuelvan como novedad:

- **`markdown-link-alternate` 0/1** — ninguna página anuncia su gemelo en markdown con
  `<link rel="alternate" type="text/markdown">`. Es la forma estándar de decir lo que D158
  construyó, y hoy solo se anuncia en prosa dentro de `llms.txt`.
- **`markdown-url-fallback` 0/2** — la home no responde al sufijo `.md` (`/index.md`). Nuestra vía
  estable es `/md/<locale>/<pagina>.md`, que es una decisión, no un olvido; pero el sufijo es la
  convención que prueba un agente primero.
- **`wikipedia-presence`** dice «could not be verified - try rescanning», o sea que su 0/4 puede
  ser ruido del escáner y no un dato.

**Y uno que se queda como está, con su motivo ya escrito:** `org-schema-completeness` sigue en 1/2
pidiendo `contactPoint` y `address` en el nodo `Organization`, que aquí es el **empleador** de
Francisco. Rellenarlo sería publicar datos de Emendu que no son nuestros (D161).

### Addendum *(2026-08-31)* · El rescaneo, con las predicciones escritas antes de mirar

Medido contra **producción** tras el merge de la tanda, y con el escaneo lanzado de verdad —no
leyendo el informe guardado— por `POST https://ora.ai/api/scan` con `{"url": "…"}`.

> **Dos avisos de método, porque los dos hacen mentir al metro.** El CLI
> (`npx is-agentic <dominio> --json`) y el `GET /api/v1/report` **NO lanzan escaneo**: devuelven
> el último guardado, y con él se compararía el sitio de ayer consigo mismo. Y el `scannedAt` del
> payload **no es la hora del escaneo**: siguió diciendo la de la pasada anterior en un informe
> que ya veía `/agents.md`, que llevaba minutos existiendo.

**67 → 69.** Los dos puntos son exactamente los de un check, y por eso la atribución es limpia
aunque en la tanda entraran cinco cosas:

| Check | Predicción escrita antes | Qué pasó |
|---|---|---|
| `agent-discovery-file` 0/2 | «parcial o nada: entra 1 de las 3 rutas» | **Pasada de largo.** ✓ **2/2** — «Agent discovery file found at /agents.md». Una de las tres basta |
| `schema-type-breadth` 0/2 | «no se mueve, es el control» | **Acertada.** Sigue 0/2, palabra por palabra |
| `content-no-js` 2/3 | «no se mueve, descartado en D157» | **Acertada.** Sigue 2/3, con la misma cifra |
| `json-ld-entity-linking` 0/2 | «debería moverse» | **FALLADA.** Sigue 0/2, con el texto idéntico |
| `markdown-frontmatter` 0/1 | «debe pasar, los tres campos están» | **FALLADA**, y el texto del hallazgo cambió entero |

**Y eso deja la hipótesis de P68.747 refutada, pero NO por lo que se escribió primero.** El
`sameAs` lleva ya dos perfiles, uno de ellos `github.com/franciscoylopez`, que es el dominio
exacto que el subtítulo del check dice mirar — y no se movió ni un punto.

> **Aquí este párrafo decía que la causa superviviente era «pide varias de {Wikipedia, Wikidata,
> GitHub}, y de esas este sitio no tiene ni tendrá las dos primeras». Es FALSO, y se sustituye en
> vez de anotarse al pie** *(2026-08-31, mismo día; el control lo trajo Francisco)*. Se escribió
> razonando sobre el subtítulo del check en vez de midiendo contra un caso que pasa, que es
> exactamente lo que `BRAND.md` §Cómo medir manda hacer antes de creerse un hallazgo — y lo que
> D157 y D161 llevan dos sprints diciendo sobre estos escáneres.

**Lo que dicen tres controles medidos**, y el tercero es el que importa porque es un sitio
personal con la misma entidad que el nuestro:

| Sitio | `json-ld-entity-linking` | Dónde vive su `sameAs` |
|---|---|---|
| `urvagandhi.tech` — personal, `Person` | **2/2** · «github.com, linkedin.com» | nodo `Person` de **primer nivel** en un `@graph` |
| `stripe.com` | **2/2** · cinco dominios | nodo `Organization` **raíz**, y con **un solo bloque** |
| `franciscolopez.es` | **0/2** · lista **vacía** | `ProfilePage` → `mainEntity` → `Person` → `sameAs` |

**Urva pasa con nuestros dos dominios exactos**, así que no es Wikipedia, no es Wikidata y no es
la cantidad; y Stripe pasa con un bloque, así que tampoco es el número de bloques. **El check
enumera los dominios que encuentra, y en el nuestro la lista sale vacía** —se ve el hueco del
template en el doble espacio de «JSON-LD  - agents»—. No dice «1 de 3»: dice cero. No está
leyendo nuestro nodo.

La única diferencia estructural que queda es **dónde vive el `sameAs`: en un nodo de primer nivel
o enterrado bajo `mainEntity`**. Eso es P68.751, y va con su predicción escrita. *El arreglo de
P68.747 sigue siendo correcto por su propio motivo* —un repositorio no identifica a una persona—,
que es la distinción de D161 y no depende de ninguna de estas mediciones.

**La otra fallada es la más útil, y hubo que verificarla contra producción antes de creérsela.**
El hallazgo pasó de «Frontmatter **on /** carries a title but none of description / canonical /
last-updated» a «**None of the 1 served markdown doc** opens with a `---` frontmatter block». O
sea que dejó de mirar la página negociada y mira **`/llms.txt`**, que no lleva frontmatter y no
lo lleva por diseño: el formato empieza por su `h1`.

Que el sitio sí lo sirve lo dicen tres cosas, y una es del propio informe:

```bash
$ curl -s -H "Accept: text/markdown" https://franciscolopez.es/ | head -6
---
canonical: https://franciscolopez.es/
lang: es
title: Del discovery al dato.
description: "Senior Product Manager con más de 10 años en SaaS B2B y B2C, y un exit …"
last-updated: 2026-08-17
```

…lo mismo por la URL directa `/md/es.md`, y **su propio `markdown-negotiation-vary`, que pasa
1/1** diciendo «Canonical URL serves text/markdown and text/html via Accept negotiation with
`Vary: Accept`». El informe se contradice consigo mismo, igual que `json-ld` ✓ 4/4 («…and
**sameAs**/jobTitle») contradice a `json-ld-entity-linking` ✗ 0/2 («No sameAs entity linking»).

> **La regla que ya estaba escrita, confirmada por segunda vez en el mismo sprint:** *la cifra de
> un escáner no valida un arreglo ni lo invalida, solo dice qué mide él.* La primera fue el `h2`
> por delante del `h1`, que era un defecto real y no movió un punto. Esta es la simétrica: un
> arreglo real, correcto y verificable con `curl`, que no mueve un punto **porque el check cambió
> de objetivo entre dos pasadas**. Un metro de terceros que se mueve solo es justo el segundo
> argumento por el que `check:agentes` existe (D159).

**Lo que NO se hace, y se escribe para que no se reabra:** poner frontmatter a `/llms.txt` para
aprobar esa casilla. `llms.txt` no es una página, es el índice del sitio, y su formato empieza por
el `h1` — anteponerle un bloque `---` lo saca de su propia convención para contentar a un check
que hace dos días miraba otra cosa. Si alguna vez se hace, será porque el formato lo adopte, no
porque lo pida un escáner.

**Y el `Vary` acotado no rompió la negociación**, que era el riesgo real de P68.742: sus dos
checks, `markdown-negotiation` y `markdown-negotiation-vary`, siguen en verde.

**El Schema Markup Validator, el mismo comando que dio la línea base:** producción antes,
1 objeto · 0 errores · 0 avisos; producción después, **1 objeto · 0 errores · 0 avisos**. El
`isBasedOn` del nodo `WebSite` no introduce ni un aviso.

### Addendum 2 *(2026-08-31)* · Tres controles externos, y una premisa mía que no aguantó

El addendum de arriba se escribió midiendo **solo este sitio**, y eso alcanza para ver que un
check no se movió, no para saber por qué. Escanear sitios que **sí pasan** cuesta un `POST` y
cambia tres conclusiones. Es la validación del metro de `BRAND.md` §Cómo medir, aplicada al
suspenso en vez de al hallazgo.

#### `schema-type-breadth` — el descarte se refuerza, y ahora no depende de nuestro alcance

| Sitio | Resultado |
|---|---|
| `stripe.com` | **0/2**, con `Organization` completo y `sameAs` a cinco dominios |
| `urvagandhi.tech` (personal, `Person`, como el nuestro) | **0/2**, mismo texto |
| `vercel.com` | **1/2**, y solo por publicar `Service` |

Su lista es literal —`FAQPage`, `Service`, `Product`, `AggregateRating`, `BreadcrumbList`— y aquí
no hay FAQ, ni servicios, ni nada que vender, ni reseñas, y la home no lleva miga de pan porque es
la home. **Que Stripe también falle es lo que cierra el asunto:** no es que a este sitio le falte
superficie, es que el check pide un catálogo que ni Stripe publica.

#### `json-ld-entity-linking` — la causa está arriba, sustituida

Lo que la tumbó es el mismo barrido: `urvagandhi.tech` pasa 2/2 con **nuestros dos dominios
exactos**. Ver el párrafo corregido del addendum anterior y **P68.751**.

#### El catálogo ARD: mi premisa estaba mal, y sale de leer un ejemplo real

El triaje del sprint lo descartó como *«el `api-catalog` sin API de D159»*, y eso salió de leer
**la descripción del check** —«One catalog that tells agents everything you offer them: MCP
servers, APIs, agents, and skills»— y no la especificación ni un catálogo servido. **El de Vercel,
que es quien pasa el check con 4/4 entradas, tiene dos que son contenido puro**: una
`text/markdown` de documentación y un índice `application/json`. Y el modelo de entrada que se
valida es `identifier` + `displayName` + media type + exactamente uno de `url` o `data`: nada
exige API.

> **Así que el criterio de D157 no lo tumba: lo aprueba.** *Un check de superficie agéntica aplica
> si el sitio TIENE esa superficie* — y `/llms.txt`, el canal markdown y el sitemap existen y se
> sirven. Publicar un índice de recursos que están ahí no es lo mismo que publicar un catálogo de
> APIs que no están. **La distinción no se ve leyendo el nombre del check.** Es P68.752.

**Y el `api-catalog` de la RFC 9727 sigue fuera, que es otra cosa y por eso D157 no cambia**: ese
sí es literalmente un catálogo de API, y aquí no hay API.

#### La lección de método, que es la que se repite

Las tres correcciones salen del mismo gesto —**escanear un sitio que pasa y mirar en qué se
diferencia**— y ninguna se habría visto razonando sobre el texto del check, que es lo que se hizo
las tres veces. Con la API de escaneo cuesta un comando; sin ella costaba abrir el navegador, y
por eso no se hacía.

## D166 · La causa era la profundidad, y el catálogo que un descarte mal fundado había tumbado — 2026-08-31

**Decisión.** La tanda 7 de «Agentes» entra con dos cambios y un método corregido. El JSON-LD de
la home pasa a **`@graph`** —`ProfilePage`, `WebSite` y `Person` como nodos hermanos enlazados
por `@id`, en vez de un árbol de tres niveles— y el sitio publica un **catálogo ARD** en
`/.well-known/ard.json`, con su gemela en `/.well-known/ai-catalog.json` y un `rel="ard"` en las
28 variantes. **Producción: 69 → 78 en ora, grade C → B.**

### La causa del `sameAs` era la profundidad, y ahora está demostrada

`json-ld-entity-linking` pasa de **0/2** a **2/2**, «Strong entity linking via sameAs:
linkedin.com, github.com». **El `sameAs` no cambió ni un carácter**: lo único que cambió es que el
`Person` dejó de colgar de `mainEntity` y pasó a ser nodo de primer nivel.

Eso cierra un hilo de tres pasos que conviene dejar entero, porque cada paso corrigió al
anterior. P68.747 arregló el `sameAs` por su propio motivo —un repositorio no identifica a una
persona— y el escáner no se movió, que es D161: *la cifra de un escáner no valida un arreglo ni lo
invalida.* D165 escribió entonces una causa superviviente **razonando sobre el subtítulo del
check**, y era falsa. El control que Francisco trajo la tumbó: `urvagandhi.tech`, sitio personal
con entidad `Person`, pasa 2/2 **con nuestros dos dominios exactos**, y su `sameAs` vive en un
nodo de primer nivel de un `@graph`.

**Un control no valida un arreglo, pero sí valida una CAUSA.** Es la mitad que le faltaba a D161,
y es lo que separa esta corrección de las dos anteriores: no se dedujo del texto del check, se
midió contra un sitio que pasa.

**Y la forma nueva es la correcta por sí sola**, que es el orden en que hay que leer esto: en un
`@graph` cada entidad es un nodo con identidad propia y las relaciones van por `@id`, que es lo
que este archivo ya hacía **entre** páginas desde P50. Medido en vez de supuesto: el Schema Markup
Validator devuelve **el mismo árbol** para las dos formas —la anidada contra producción, la de
`@graph` contra el build—, **1 objeto · 0 errores · 0 avisos** a los dos lados. Lo único que
cambia es el `@id` propio del `ProfilePage`.

> **Y destapó un hueco en `check:marco`.** `recorrerIds` se saltaba toda clave que empieza por
> `@` —correcto para `@context` y `@type`, que son metadatos— y con ella **`@graph`, que contiene
> nodos**. Habría dejado de ver los `@id` que la home DECLARA y habría acusado de referencia
> colgada a las trece páginas que los apuntan: un rojo cuya causa está en el guardián, que es la
> peor clase. Se recorre a mano, con el motivo al lado.

### El catálogo ARD: un descarte que salió de leer la descripción del check

El triaje lo había tumbado como «el `api-catalog` sin API de D159». Ese descarte estaba **mal
fundado**, y se dice porque el error es de método, no de criterio: salió de leer la **descripción**
del check —«MCP servers, APIs, agents, and skills»— en vez de la especificación o un catálogo
real. El de Vercel, que pasa 4/4, tiene **dos de sus cuatro entradas en contenido puro** (un `.md`
de documentación y un índice JSON), y el modelo de entrada que valida el conformance es
`identifier` + `displayName` + tipo de medio + **exactamente uno** de `url` o `data`. Nada exige
una API.

Así que el criterio de D157 —*un check de superficie agéntica aplica si el sitio TIENE esa
superficie*— **aquí se cumple**. Entran seis entradas, todas servidas hoy: `/llms.txt`,
`/sitemap.xml`, el canal markdown y el CV en PDF, los dos últimos derivados de `locales`.

**Y la mitad del trabajo es lo que NO entra:** nada de MCP, agentes, skills ni API, porque no
existen; ni `trustManifest`, porque la especificación solo exige `trustManifest.identity` y aquí
no hay ninguna identidad criptográfica que declarar; ni las 28 páginas, que serían la tercera
copia de la lista que cerró D72 — para eso están las dos entradas de índice.

**Dos rutas, un solo documento.** `/.well-known/ai-catalog.json` no es «la ruta vieja de ARD»: es
el mecanismo de descubrimiento del **AI Catalog Standard**, de donde sale el formato que este
sitio emite —`specVersion`, `host`, `entries`— y contra cuyo modelo valida el conformance. ARD
hereda ese formato y le pone ruta nueva. El cuerpo lo compone `respuestaDelCatalogo()` una sola
vez, y `check:agentes` **compara los dos artefactos byte a byte**: no hay dos documentos, hay dos
puertas.

**El `rel="ard"` va en el layout y no en `pageMetadata`**, porque la Metadata API de Next no sabe
emitir un `rel` arbitrario (`alternates` solo genera `rel="alternate"`). Es un `<link>` en el
árbol y **quien lo iza al `<head>` es React** — y esa izada es justo lo que no se puede dar por
hecho, así que `check:marco` lo comprueba en las 28: que esté, que esté en el `<head>`, que apunte
al catálogo y que sea uno.

### Las cinco predicciones, escritas antes de mirar

| Check | Antes | Después | Predicción |
|---|---|---|---|
| `json-ld-entity-linking` | fail 0/2 | **pass 2/2** · enumera `linkedin.com, github.com` | Acertada, dominios incluidos |
| `ard-catalog` | fail 0/1 | **pass 1/1** · «6/6 entries» | Acertada |
| `ard-entries-valid` | na 0/2 | **pass 2/2** | Acertada |
| `ai-catalog-published` | na 0/1 | **pass 1/1** | Acertada tras ampliar el alcance |
| `ard-trust-manifest` | na 0/2 | **fail 0/2** | Acertada: sigue en 0 a propósito |

Controles quietos, como estaba escrito: `json-ld` 4/4, `schema-type-breadth` 0/2, `content-no-js`
2/3, `markdown-negotiation-vary` 1/1, `agent-discovery-file` 2/2. **is-agentic no se mueve y sigue
en 96:** los checks de ARD no están entre sus 16 elegibles.

**Los nueve puntos no son los seis brutos**, y decirlo evita prometer de más la próxima vez: en
bruto fue 51/66 → 57/69. El salto sale de que estos checks viven en **Discovery, la capa con el
denominador más pequeño** (2/6 → 6/9, del 33 % al 67 %), más los 2 de Access (35/41 → 37/41). Un
punto en Discovery vale mucho más que uno en Usability.

> **Y de esa aritmética sale un dato reutilizable: un bonus SUSPENDIDO no cuesta nada.** Los 2 de
> `ard-trust-manifest` no entraron en el denominador al fallar, mientras que los de
> `ard-entries-valid` sí entraron al pasar. Así que un check bonus en rojo no es deuda: es una
> casilla que no se ha querido rellenar.

### La trampa del método, que casi hizo publicar lo contrario

**`POST https://ora.ai/api/scan` no escanea sin `force: true`.** Devuelve el informe GUARDADO, con
`analysisStatus: complete` y su `durationMs`, o sea con toda la pinta de una pasada nueva. La
primera lectura tras el deploy dio **69 y «No /.well-known/ard.json»** con la ruta ya sirviendo
200 en producción, comprobado con `curl`: una tanda de nueve puntos parecía no haber movido nada.
`refresh: true` no hace nada; el que fuerza es `force`.

Lo cazó la regla que D165 ya había escrito: **mirar un `details` que solo pueda ser nuevo, nunca
el `scannedAt`**. Es la tercera vez en dos días que un metro de terceros miente sobre su propia
frescura, y la primera en que la regla escrita lo detiene antes de publicar la cifra.

### Lo que queda mejorable, y qué se hace con cada cosa

**`org-schema-completeness` 1/2 — ya descartado en D161, sin novedad.** El único `Organization`
de la home es el `worksFor`, o sea Emendu. Rellenarle `contactPoint` y `address` es publicar
datos de un tercero o hacer pasar los propios por suyos. Quitar el nodo daría 0/2, peor.

**`schema-type-breadth` 0/2 — descartado dos veces, y el descarte se sostiene.** Su lista es
literal (`FAQPage`, `Service`, `Product`, `AggregateRating`, `BreadcrumbList`) y `stripe.com`
también saca 0/2. Aparte, y **separado del check a propósito**: la home publica a la vista cinco
hitos con año, la trayectoria y la formación, y el nodo `Person` no los marca. `award`,
`hasOccupation` y `alumniOf` son las propiedades exactas de Schema.org para eso y serían ciertas.
Está tareado **por su propio mérito**, con el motivo escrito de que probablemente no mueva esta
casilla — `Occupation` no está en su lista.

**`a2a-agent-card` — no se publica, y esta es su primera vez por escrito.** Pide un
`/.well-known/agent-card.json` que describa «las capacidades, skills y endpoint de contacto de tu
agente». **Aquí no hay agente.** Es el mismo caso que `/.well-known/agent-skills` y `/skills.sh`,
que P68.748 ya rechazó, y el mismo criterio que tumbó el `api-catalog` sin API: mentir en un
formato que una máquina sabe leer. Además es **bonus**, así que por la aritmética de arriba
**cuesta cero**.

**Su condición de salida está fijada y no es una fecha: es V4.** El día que exista «Pregúntale a
mi carrera», la tarjeta A2A deja de ser una afirmación falsa y pasa a ser la superficie de
descubrimiento que ese agente necesita — publicada, no inventada. Queda anotado en la ficha de esa
tarea para que llegue con el trabajo y no dependa de que alguien se acuerde. *Si el hallazgo
vuelve antes: está medido y descartado, no sin mirar.*

---

## D167 · Publicar la nota de un escáner sin convertirla en un criterio, y el sello que la sostiene — 2026-08-31

**Decisión.** El artículo gana el apartado **«Preparada para SEO y GEO»** dentro de §s08, que
reencuadra el que había sobre el número de rendimiento en vez de añadirse a él, y publica la nota
de `ora.ai` en una tarjeta de dato en vivo sellada por **`npm run agentes:sellar`**.

**El hueco no era el sprint, era el SEO.** Ninguna de las once secciones del artículo hablaba de
indexación, datos estructurados ni metadata, que son criterio de cierre (DoD fila 6) y criterio de
aceptación (`PRD-Live` §No funcionales). Así que esto no es un anexo de novedades: es tapar un
hueco que ya estaba, y el GEO es su otra mitad. Ese orden importa porque es lo que hace que la
sección no se lea como una nota de versión.

### El conflicto con D157, y por qué la forma de la tarjeta no bastaba

D157 dice que la nota de un escáner agéntico **no** es un criterio de aceptación de este proyecto,
y la de PageSpeed **sí** lo es. Dos tarjetas idénticas, una debajo de otra, las igualan.

La primera salida fue publicar las **dos** notas del mismo motor —97 en `is-agentic`, 78 en ora—
porque una tarjeta con dos cifras que se contradicen no se puede leer como un umbral aprobado. Se
descarta: **el lector no tiene por qué reconstruir un argumento de denominadores para entender una
tarjeta.** Lo que queda es más simple y dice lo mismo: **una sola nota, con lo que mide al lado**
—125 comprobaciones, de las que 60 marca el propio informe como no aplicables— y la frase de D157
cerrando el párrafo, *«es una foto de dónde está el sitio, no un objetivo que me haya puesto»*.

**Y no se publica el 97.** Es la cifra favorable del mismo escaneo, y este artículo no elige
marcador en ningún otro sitio. La brecha sigue documentada en D165, que es donde se explica.

### `servedFromCache` retira una regla que era un hábito

D165 dejó escrito que para saber si un informe es fresco había que **mirar un `details` que solo
pudiera ser nuevo**, porque el `scannedAt` del payload no es la hora del escaneo. Es una regla
correcta y es una regla que hay que recordar, o sea la familia que `BRAND.md` §Cómo se escribe una
regla nombra entera.

Leyendo el payload entero aparece el campo que la sustituye: **`servedFromCache`**, con
`resultAgeSeconds` al lado. El sello se niega a escribir con él puesto, y de paso comprueba el
destino, `analysisStatus`, `pendingChecks` y que haya al menos una comprobación. Es el mismo
reparto de `scripts/psi/sello.ts`: **no sella una pasada parcial**, dice por qué y deja el sello
anterior. La regla manual se queda para la lectura a mano; para la cifra que se publica, ya no
hace falta acordarse.

> **Sigue haciendo falta `force: true`.** Sin él el POST no escanea y devuelve el informe
> guardado; `refresh` no hace nada. Eso no lo arregla ningún campo: va escrito en el script.

### El hueco de D102 tenía una segunda puerta: el `ReactNode`

D102 cerró la cifra tecleada dentro del `value` de un `livestat`. Las **pastillas** de esa misma
tarjeta salen de `LIVESTAT_EXTRAS`, que es un `Record<string, ReactNode>` en el componente, y ahí
`check:articulo` no puede mirar: no es copy, es JSX. Las tres de la tarjeta de PageSpeed están
escritas a mano y no pasa nada, porque son las otras categorías de Lighthouse y llevan clavadas en
100 desde que existen; las de esta se mueven en cada pasada.

Así que **derivan del sello**, no del componente. Y el grado baja del `value` a una pastilla, que
es lo que deja el dato de arriba en una sola cifra, como en PageSpeed.

### Lo que se recortó, medido en navegador

La cabecera de la tarjeta se partía en dos líneas: el `label` era «Preparación para agentes ·
ora.ai». **Se recorta el texto en vez de ensanchar la caja**, porque `live-stat.tsx` lo comparten
cuatro tarjetas de dos páginas y ensancharla por un caso las mueve todas. Con «Agentes · ora.ai»:
113 px de rótulo + 293 px de fuente = 406 de los 504 disponibles a 1440, en una línea.

**A 360 px se sigue partiendo, y no se toca:** le pasa igual a la de PageSpeed (170 + 221 en 280
disponibles) y a las otras dos, así que es comportamiento del componente y no de esta tarjeta.
Arreglarlo es un cambio en la pieza que afecta a las cuatro, y va tareado aparte.

**Estado:** Aceptada.

## D168 · La primaria se lee como índice relativo, y ese párrafo es lo que desbloquea el lanzamiento — 2026-08-31

**Decisión.** `contact_submit` y todo lo que GA4 mide en este sitio se leen como **índice
relativo** —comparable consigo mismo mientras la puerta del consentimiento no cambie— y **nunca
como volumen absoluto**. La fracción de visitas que la analítica ve se desconoce, y **el
lanzamiento de «Distribución» no espera a conocerla**.

**Es la opción 3 de tres, y va primera precisamente porque no mide nada.** Las otras dos sí dan
denominador: un contador propio de consentimiento —el único que da la fracción— y Vercel Web
Analytics. Las dos siguen en pie y las dos cuestan más que esto: la primera es superficie nueva
que recibe una petición de un tercero, así que dispara `/security-review` por la DoD; la segunda
no es una decisión técnica sino de postura, y está escrita en su tarea. Lo que compra este
párrafo es que **dejan de ser prerrequisito y pasan a ser mejora**.

### El 0 % no es un fallo de configuración

GTM marca el contenedor como «Calidad: Urgente» por una tasa de consentimiento del 0 % detectada
en varios territorios, incluidos los de fuera del EEE. Es la consecuencia directa de D13/D17:
este sitio **exige consentimiento a todo el mundo**, no solo al Espacio Económico Europeo, y
hasta que alguien acepta no carga ni el gestor de etiquetas, ni la analítica, ni el mapa de
calor. Google lo mide como anomalía porque le interesa el dato, no porque esté roto.

Lo que sí es cierto, y es lo que obliga a escribir esto: **la analítica ve una fracción de las
visitas y no se sabe cuál.** Los 45 usuarios de la última ventana medida (GA4, 3-30 ago) no son el tráfico;
son el tráfico que consiente.

### Por qué el orden importa: el pico es irrepetible

Sin denominador, lo que se mide en el pico del lanzamiento es **volumen × tasa de
consentimiento**, convolucionado y sin poder separarlo. Un pico se puede repetir; **el primer
lanzamiento tras un año callado, no**. Esperar al contador para no perder ese dato es cambiar un
dato imperfecto por ninguno, porque el sprint no arranca mientras tanto.

### Lo que se pierde al aceptarlo, escrito para no descubrirlo después

- **El volumen absoluto en el sitio** y el embudo **clic → lectura** para quien no consiente.
- **Y una comparación que parece legítima y no lo es: antes del lanzamiento contra después.** Un
  índice relativo solo es comparable si la puerta no se mueve, y un lanzamiento **cambia la
  mezcla de tráfico** —una audiencia que llega de LinkedIn no tiene por qué aceptar en la misma
  proporción que la que llega de búsqueda—. Así que la serie es comparable **entre posts de la
  misma ventana**, y el salto pre/post arrastra un cambio de mezcla sin cuantificar. Escrito como
  hipótesis porque es una hipótesis: nadie ha medido esa diferencia, y no se puede hasta que
  entre el contador.

**Lo que NO se pierde, y es la mitad de la que depende el sprint:** la distribución se mide
entera y sin consentimiento, porque la da LinkedIn —impresiones, clics y engagement por post, que
es dato de LinkedIn sobre LinkedIn—. El criterio de éxito de «Distribución» es alcance y visitas
cualificadas, no `contact_submit`, así que **la mitad que este párrafo degrada no es la que
juzga el sprint**.

### Lo que este párrafo NO arregla

La muestra. La primaria vale **1** en 28 días, y un índice relativo con n=1 sigue sin poder
discriminar nada. Aceptarlo no convierte el dato en útil: **quita el bloqueo para ir a buscar la
muestra**, que es lo que el sprint entero existe para hacer.

### Condición de salida

Cuando entre el contador de consentimiento, el índice **gana escala y deja de ser solo relativo**;
esta entrada no se supera, se completa. Y si cambia el diálogo o la política de consentimiento,
**la serie se parte ahí y hay que decirlo**, por la misma razón por la que los filtros de GA4 no
son retroactivos (D71).

**Estado:** Aceptada.

## D169 · El contador que da el denominador, y la excepción que hubo que escribir en un documento legal — 2026-08-31

**Decisión.** El sitio cuenta tres enteros —**visto**, **aceptado**, **rechazado**— con una
Server Action del mismo origen y un `INCR` contra **Upstash Redis por su API REST**, sin paquete
nuevo. Con eso, la fracción que D168 daba por desconocida pasa a medirse, y se lee con
`npm run consentimiento`.

**Se puede contar sin consentimiento porque no mide a nadie.** El diálogo se pinta siempre —esa
es la premisa que hace posible la medición— y lo único que sale del navegador es cuál de tres
cosas ocurrió. Ni IP, ni user-agent, ni identificador, ni marca de tiempo por suceso. Un contador
agregado no es un tratamiento de datos personales, así que esto **no hereda** el límite de D168:
lo levanta.

### Las dos decisiones que hacen que la cifra signifique algo, y las dos tienen test

- **«Aceptado» es `analytics === true`, no «pulsó Aceptar todo».** Quien abre las preferencias y
  concede solo analíticas acepta a efectos del denominador, porque su visita **sí** la ve GA4, que
  es lo único que la fracción describe. Es D153 otra vez: allí el «enviado» tenía tres causas y
  solo una mandaba correo, y creer que eran la misma cosa dejaba la métrica inflada.
- **«Visto» se cuenta una vez por navegador, no por pintado.** Por pintado el denominador serían
  páginas vistas contra un numerador que ocurre una sola vez, y la tasa saldría arbitrariamente
  baja: la cifra sería impecable y estaría midiendo otra cosa. Es el umbral mal aplicado de
  `BRAND.md` §Cómo medir, punto 7, en su versión de denominador.

**Y un tercero que apareció al cablearlo:** reabrir el centro de preferencias desde el pie vuelve
a llamar a `decide`, así que un cambio de opinión sumaba una decisión más contra un «visto» que
solo contó una vez, y `aceptado + rechazado` podía **superar** al denominador. Solo cuenta la
primera decisión, y se comprueba leyendo el registro que ya existe **antes** de guardar, sin marca
nueva. Lo encontró el cableado, no un test: el test vino después.

### Upstash por REST y sin paquete

`INCR` es atómico, que es exactamente lo que un JSON leído-modificado-escrito no puede dar sin
perder escrituras concurrentes. Se llegó a considerar Vercel Blob por no meter proveedor —y su
argumento era bueno: las pérdidas sesgarían numerador y denominador por igual, así que el **ratio**
sobreviviría—, pero un contador que pierde cuentas es un instrumento que hay que explicar cada vez
que se lee. Y se llama con `fetch` en vez de con `@upstash/redis`: son cuatro líneas contra once
dependencias de producción (D27).

**Los runtime logs quedaron descartados por un dato, no por gusto:** el plan es *hobby*, donde se
retienen alrededor de una hora. No aguantan una ventana de lanzamiento.

### La superficie nueva se lee como pública, porque lo es

Una Server Action es un POST que puede invocar cualquiera, así que lo que la protege no es que
solo la llame nuestro componente: **enum cerrado** validado contra la lista, **no devuelve nada**
—ni el contador ni si escribió, así que no sirve de oráculo— y límite de frecuencia más bajo que
el del formulario, porque aquí el peor caso no es una bandeja llena sino una **medición falsa que
se usaría para decidir**. Lo que ese límite no puede —serverless, instancia fría, actor
distribuido— va escrito al lado del código, con su señal de detección: una tasa que se mueve sin
que se mueva el tráfico.

**El `/security-review` de la DoD se pasó y salió limpio**, con el matiz de que el envenenamiento
del contador no es reportable ahí por caer en sus exclusiones. No es un no-problema: es un riesgo
de **integridad del dato**, asumido y escrito.

### Lo que obligó a tocar un documento legal, que es la parte que casi se queda fuera

La primera redacción de la nota para `/cookies` decía «un contador agregado **en nuestro propio
servidor**, **sin tu IP**». Las dos mitades eran falsas: el contador lo lleva **Upstash**, que es
un tercero, y la Server Action **recibe** la IP —como cualquier petición HTTP— y la usa en memoria
una hora para el límite de frecuencia. Lo cierto es que **no se guarda**, que no es lo mismo que
«no se usa».

Es la familia de `BRAND.md` §La regla del control sobre imagen prometía de más, y aquí habría
salido cara: es la página que enumera a Google como encargado y publica su transferencia
internacional. **El sitio entero se apoya en que esa página dice la verdad literal.**

Lo que entra, entonces, no es una frase: es **una fila de tabla y un bloque, en dos idiomas**. La
fila, porque `flm-consent-seen` es almacenamiento en el dispositivo y esa tabla existe para
enumerarlo; el bloque, justo **después de la base legal** y no al final entre los terceros, porque
es lo único que ocurre *antes* de que el visitante decida y su sitio es donde acaba de leer que
nada se carga sin su permiso. Y `LAST_COOKIES_UPDATE` se mueve, que es lo que D18 le pide a un
documento vivo.

### La clave lleva el entorno dentro, y eso corrige una premisa que duró tres horas

Este D-entry se escribió diciendo que en local y en Preview *no hay almacén y no debe haberlo*.
**Falso al conectar la integración:** el Marketplace reparte las credenciales de Upstash a
**Production y Preview**, así que cada despliegue de vista previa habría escrito en el mismo
contador que producción. El denominador que esto existe para dar lo habría inflado el propio
trabajo de construirlo, y el PR que lo construye genera una vista previa por empujón.

La clave pasa a ser `flm:consent:<VERCEL_ENV>:<suceso>`. **Se resuelve en el código y no borrando
la variable en Vercel** por dos razones: la integración puede volver a inyectarla al sincronizar,
y una configuración de panel no la revisa nadie en un PR. Y separar es mejor que apagar Preview,
porque deja **verificar la cadena entera antes de mergear** — que es justo lo que le faltaba a
esto para estar comprobado de verdad, en vez de comprobado de que no rompe.

El lector toma `--entorno=`, y **por defecto `production`**, nunca la suma: un total que mezclara
las pruebas con las visitas reales sería el dato envenenado que la separación evita.

**Verificado el 2026-08-31 contra el almacén real**, ejercitando el camino del código y no la API:
`almacenConfigurado` cierto, `INCR` y `MGET` de ida y vuelta, y —la mitad que importa— el espacio
`local` en 1 con **producción todavía en 0**.

**Cómo se encontró, que es lo reutilizable:** no lo vio ningún gate, porque ninguno puede verlo.
Salió de mirar `vercel env ls` al conectar la integración, o sea de comprobar la premisa **en el
sitio donde de verdad vive** en vez de en el comentario donde estaba escrita. Es la regla 1 de
`BRAND.md` §Cómo se escribe una regla —el disparador que mira al lugar equivocado— aplicada a un
supuesto sobre infraestructura.

### Verificado en producción, y con ello el matiz que decide qué significa la cifra

El 2026-08-31, con las tres opciones desplegadas: **Vercel Web Analytics registra** (1 visitante,
4 páginas, las cuatro de la propia comprobación) y **el contador se queda en 0**. Las dos cosas
son correctas a la vez, y entenderlo es lo que da el matiz:

**Este contador solo ve a los visitantes NUEVOS.** A quien ya decidió no se le vuelve a pintar el
diálogo, así que no suma en `visto`; D170 sí lo cuenta. **No son el mismo denominador y no se
dividen el uno por el otro sin decirlo.** El navegador de la comprobación ya tenía decisión
guardada: por eso 0, y por eso 0 es el resultado correcto.

No es un defecto. Para lo que este contador existe —leer el pico de un lanzamiento, que es
tráfico que llega por primera vez— la población correcta es exactamente esa. Lo que había que
arreglar era el enunciado: la tasa es **de cada cien visitantes NUEVOS, cuántos aceptan**, y así
se dice ahora en `SALVEDAD_TASA` y en la salida de `npm run consentimiento`.

**Y cómo se encontró, que vuelve a no ser un gate:** de leer un 0 y preguntarse por qué, en vez
de darlo por «todavía no ha entrado nadie». El mismo cero habría sido compatible con las dos
explicaciones, y solo una era cierta.

**Estado:** Aceptada.

## D170 · Una excepción a la postura propia, no a la norma: Vercel Web Analytics carga sin consentimiento — 2026-08-31

**Decisión.** El sitio monta **Vercel Web Analytics** en el layout, **fuera del gate de
consentimiento** y dentro del de producción. Es lo único de este sitio que mide sin preguntar, y
esa es la decisión entera: **detrás del consentimiento no aportaría nada sobre GA4** —mismo
denominador, mismo sesgo— y no habría razón para tenerlo.

**Lo que compra, y que D169 no puede dar:** el **volumen absoluto** y el **embudo clic → lectura**
de quien no consiente. El contador de D169 solo sabe del diálogo: cuánta gente lo vio y qué
eligió. No sabe cuántas páginas leyó nadie.

### La pregunta era de postura y estaba escrita como tal

La ficha de P68.61 lo dejó dicho: *«la decisión de la 1 no es ¿lo instalo? sino ¿mi postura de
consentimiento admite una excepción, y la escribo?»*. La respuesta es **sí, y se escribe**.

Y hay que decirlo en el orden incómodo: **este sitio exige consentimiento a todo el mundo por
decisión propia, más estricta que la norma** (D13/D17), y esto no lo pide. La ley no lo exige
—sin cookies ni almacenamiento en el equipo, el art. 22.2 de la LSSI no aplica, y la base es el
interés legítimo del art. 6.1.f del RGPD—, así que **es una excepción al criterio propio, no a la
norma**. Esa frase va literal en `/cookies`, con el «presume de pedir permiso a todo el mundo, y
esto no lo pide» delante y la vía de oposición detrás.

**El derecho de oposición no se inventa una vía nueva:** la página ya lo ofrece por escrito en
«Qué derechos tienes». Se enlaza a él en vez de añadir un cuarto control al diálogo, que sería
UI nueva para un caso que el documento ya cubre.

### Lo que casi entra mal: recortar la cadena de consulta entera

La primera versión de `beforeSend` tiraba la query completa. Parecía lo prudente y **habría
costado la mitad del motivo de tener esto**: los UTM de los posts del lanzamiento son
precisamente la separación por post que esta herramienta puede dar para *todo* el tráfico y GA4
solo para el que consiente. Y no son un dato personal: son la etiqueta de una campaña.

Lo que entra es una **allowlist** de los cinco `utm_*`, misma forma que la CSP de este sitio.
Garantiza la otra mitad: **nada que no esté en la lista llega a medirse**, venga de donde venga.
El fragmento se borra también, porque aquí son anclas de sección y a qué apartado saltó alguien
no hace falta para contar una visita.

**Y `beforeSend` obliga a una isla de cliente**, no por estilo: es una función, y una función no
cruza de un Server Component a uno de cliente. Por eso existe `components/analytics/web-analytics.tsx`.

### La CSP no cambia, y eso es un hecho comprobable, no un supuesto

El script se sirve de `/_vercel/insights/script.js` y la baliza va a `/_vercel/insights/view`:
**mismo origen**, así que `script-src 'self'` y `connect-src 'self'` ya lo cubren. Es la primera
herramienta de medición de este sitio que no abre un dominio en la allowlist — GTM, GA4 y Clarity
abrieron los suyos. Queda por **verificar en producción** que ninguna directiva salta, porque un
supuesto sobre infraestructura es exactamente lo que falló en D169.

### Gate de producción, y por el motivo de D169 y no por simetría

Fuera de producción el endpoint no existe, así que montarlo solo dejaría peticiones fallidas en
la consola de quien desarrolla. Y en Preview, si existiera, contaría las visitas de revisar un PR
como tráfico — el mismo envenenamiento que el contador acabó de resolver con el entorno dentro de
la clave.

### Tres frases del sitio que esto vuelve imprecisas, y qué se hizo con cada una

- **`/cookies` §Terceros** decía «la analítica la proporcionan Google y Microsoft». Pasa a «la
  analítica **que requiere tu consentimiento**», y la otra queda cubierta por su propio bloque.
- **`/cookies` §Lo que se mide antes de que decidas** se escribió el mismo día para el contador y
  se titulaba «lo único que cuento antes de que decidas». Ya no es *lo único*: se reescribe para
  las dos en vez de añadir un segundo bloque de excepción al lado.
- **El `lead` de `/cookies` y `whatBody`** dicen «ninguna cookie de analítica sin tu
  consentimiento». **Sobreviven en lectura literal y se dejan**: Vercel Web Analytics no usa
  cookies. Se anota porque es la misma familia que §s12 del artículo, y esa clase de frase
  aguanta una vez y no dos.

### Dos cosas que confirmó Francisco, y una que medí mal

**La vía de oposición es solo la escrita** *(Francisco, 2026-08-31)*. No entra un cuarto control
en el diálogo de preferencias: quien no quiera que se le cuente escribe, y se le deja de contar.
La página ya ofrece ese derecho y lo que se hace es enlazarlo, así que **el mecanismo existe
antes que la promesa** y no al revés. Y el copy de `/cookies`, revisado y aprobado por él.

**Y el gate de producción NO es por lo que este D-entry decía.** Se escribió que fuera de
producción el endpoint no existe. Medido el mismo día: **el Preview de la rama sirve
`/_vercel/insights/script.js` con 200** y producción daba 404, porque lo inyecta el despliegue y
el de producción era anterior a activar la herramienta. Es el tercer supuesto sobre
infraestructura que este sprint escribe primero y comprueba después, y los tres han salido
falsos: las credenciales en Preview (D169), este, y el propio 404 leído como «no está activado»
cuando lo que faltaba era desplegar.

Los motivos que sí sostienen el gate son otros dos, y el segundo manda: en Preview el tráfico
somos nosotros revisando un PR —Vercel separa por entorno, así que es ruido y no
envenenamiento—, y sobre todo **la cuota del plan *hobby*: 2.500 eventos al mes**, que es lo
único con lo que hay que medir el lanzamiento.

**La contrapartida, dicha porque contradice al hermano:** para el contador se eligió *separar* en
vez de apagar, precisamente para poder verificar antes de mergear. Aquí se apaga, así que **esto
se verifica DESPUÉS del merge**, contra producción, y hasta entonces no está comprobado que
funcione. Se acepta por la cuota, no por descuido.

**Estado:** Aceptada.

---

## D171 · El generador de carruseles entra al repo, y su guardián pasa de uno a tres criterios — 2026-09-01

**Contexto.** Las tres piezas de carrusel de la serie de LinkedIn (R1, R2, R3) se montaron con un
generador que vivía en el Escritorio, con una carpeta `fuente/` por pieza. Dentro de cada una,
tres archivos: `slides.mjs` (el contenido), `plantilla.mjs` (el aspecto) y `render.mjs`. Los dos
últimos se copiaban de una pieza a la siguiente.

Es decir: **el aspecto de la marca fuera del dominio —los tokens del tema oscuro, las dos
tipografías y el monograma con split— no estaba en git, y se propagaba copiando.** `PRD-Live` §4
llama a esos carruseles «la cuarta superficie, y la más fuerte» precisamente porque llevan el
sistema entero; el sistema entero estaba en tres copias sin versionar.

**La premisa de la ficha era que ya no hacía falta.** P68.655 avisaba de que el carrusel se agota
en la primera tanda, así que con R3 escrito el generador no tenía más usos previstos, y proponía
decidir si mudarlo entero o salvar solo la plantilla. **Decisión de Francisco (2026-09-01): se
muda entero**, porque no hay más piezas previstas pero puede haberlas.

**Qué entra y qué no.** Entran `plantilla.mjs` y `render.mjs`, en `scripts/carrusel/`, que es lo
reutilizable. **No entra el contenido**: el `slides.mjs` de cada pieza vive con la pieza, fuera
del repo, igual que su artículo. Por eso el comando recibe una ruta —`npm run carrusel -- <ruta a
slides.mjs>`— en vez de tener las piezas dentro. Es la misma partición que ya usa
`check:tablero`: el criterio en el repo, el dato fuera (`D107`).

De paso desaparece la variable `REPO=`: la plantilla deduce la raíz de su propia ruta, que es
algo que solo podía hacer una vez dentro.

### El guardián miraba una cosa de tres, y las otras dos ya habían dado verde sobre PNG rotos

La versión anterior comparaba `scrollHeight` con `clientHeight` del bloque. Eso solo ve un modo
de fallo, y los otros dos ya habían ocurrido:

1. **El bloque desborda su caja** — lo que ya miraba.
2. **El bloque empuja la firma fuera del pie.** Con una tabla de seis filas el bloque no
   desbordaba: *crecía*, y el pie se salía de la lámina, que tiene `overflow:hidden`. Salida:
   «Sin desbordes en 10 láminas», y el PNG cortado por abajo.
3. **Dos celdas se pisan en horizontal.** Las columnas 2 y 3 de `tabla` son pistas fijas de
   140px: dos cabeceras largas se solapan y el alto no se entera.

Es el modo de fallo que este proyecto ya se había encontrado cinco veces —un metro que devuelve
lista vacía parece un aprobado—, aquí por sexta. Así que el guardián nuevo **afirma cuántas
láminas y cuántos pares de celdas ha mirado**, y **se validó disparándolo**: un `slides.mjs` de
caso malo con las dos láminas que rompían, y hasta que no las cazó las dos no se dio por bueno.

**Y ese caso malo queda en el repo, no en un temporal:** `scripts/carrusel/caso-malo.mjs`, que
tiene que salir 1. No entra en `check:guardianes` porque este generador no es un gate de CI
—necesita navegador y la ruta de una pieza—, así que se dispara a mano; pero existir por escrito
es lo que permite volver a comprobar que el guardián no se ha quedado ciego.

**Y la primera versión del criterio 3 no las cazaba.** Comparaba las cajas de los *elementos*, y
una celda de pista fija mide sus 140px pase lo que pase: el texto que no cabe se pinta fuera sin
mover la caja. `scrollWidth` tampoco sirve, porque va en `text-align:right` y el derrame va hacia
la izquierda, que es el lado de inicio y el que `scrollWidth` ignora. Lo que sí sirve es medir la
caja del **texto** con un `Range`, y por **líneas** y no por envolvente: un texto que parte en dos
dentro de su celda es correcto, y la envolvente daría un falso positivo con la anchura entera.

**Tercera trampa, de operación, arreglada de camino:** `node render.mjs | head` mataba el proceso
por `SIGPIPE` tras la primera lámina y dejaba las otras nueve viejas, con el comando en verde.
Ahora el proceso ignora `EPIPE` en su salida.

### La comprobación de transparencia no puede ser el PNG

Se quiso demostrar que el generador mudado produce lo mismo, con el patrón de `gate:html` (`D42`,
`D45`): comparar la salida antes y después. **Comparando los PNG byte a byte, 18 de 21
coincidían y 3 no.** Antes de creerse la regresión se validó el metro, que es la regla 3 de
`BRAND.md`: dos corridas seguidas **del mismo generador sobre el mismo contenido** ya dan un PNG
distinto. **El render no es determinista byte a byte**, así que comparar hashes de PNG no puede
ser la comprobación, ni aquí ni en un gate futuro.

Lo que sí es determinista es el HTML que produce la plantilla, y ahí la comprobación sale
limpia: **idéntico en las dos piezas** (141.408 y 140.367 bytes, fuentes en base64 incluidas).
Esa es la prueba de que la mudanza es transparente.

### `puppeteer` era una dependencia transitiva, y ahora está declarada

El generador lo resolvía con `createRequire` contra el `package.json` del repo, donde llegaba
como dependencia transitiva de `@mermaid-js/mermaid-cli`. Un script del repo que depende de algo
que nadie declaró se rompe el día que otro paquete cambia su árbol. Queda como `devDependency`
explícita, en la versión que ya estaba instalada, y con eso entra además en el radar de
Dependabot.

**Lo que esto NO resuelve, y hay que saberlo:** el guardián cubre los tres modos de fallo
conocidos, no «que la lámina esté bien». Se siguen mirando los PNG.

**Estado:** Aceptada.

## D172 · Las once «sin indexar» de Search Console son cero páginas, y el «nada» se escribe once veces — 2026-09-02

**El encargo, y por qué no se podía contestar de memoria.** Search Console listaba once URL sin
indexar repartidas en tres motivos, más un vídeo sin indexar en su informe aparte, y la pregunta
era la correcta: ¿se reindexa, se bloquea por `robots.txt`, o no se hace nada? Las URL concretas
solo existían en cuatro capturas, así que lo primero fue sacar la lista exacta del panel. Las
cuatro tablas venían completas —las cuatro decían «1-N de N»— y el panel del día lo confirmó:
**tres motivos, 3 + 2 + 6 = 11, y un vídeo.** No había una cuarta categoría escondida.

**El hallazgo de verdad no estaba en la lista de fallos, sino en la de aciertos.** Las 29
indexadas se comprobaron una a una: son **las 28 variantes canónicas** —las catorce páginas por
los dos idiomas— más el PDF del CV en EN. La cobertura es del 100%, y eso es lo que convierte
las once en lo que son: **ninguna de las once es una página.** Son tres redirecciones de
canonicalización y ocho assets.

| # | URL | Categoría | Decisión | Motivo |
|---|---|---|---|---|
| 1 | `https://www.franciscolopez.es/` | Redirección | nada | www → apex |
| 2 | `http://franciscolopez.es/` | Redirección | nada | http → https |
| 3 | `http://www.franciscolopez.es/` | Redirección | nada | las dos a la vez |
| 4 | `/_next/static/media/017d9bea…41rroleoq1br7.woff2` | 404 | nada | fuente de un build viejo |
| 5 | `http://franciscolopez.es/index.htm` | 404 | nada | nunca existió, y nada enlaza ahí |
| 6 | `/_next/static/immutable/media/017d9bea…woff2` | Rastreada | nada | fuente viva |
| 7 | `/_next/static/immutable/media/83afe278…woff2` | Rastreada | nada | fuente viva |
| 8 | `/favicon.ico?favicon.0_iexrdy4sj8d.ico` | Rastreada | nada | favicon con el hash de un build |
| 9 | `/favicon.ico?favicon.379anfkyqyzgy.ico` | Rastreada | nada | ídem, otro build |
| 10 | `/logo-kit/favicon/favicon.ico` | Rastreada | nada | descarga real del Brand Kit |
| 11 | `/video/francisco-sobre-mi-apertura.webm` | Rastreada | nada | el mismo asset que el informe de vídeos |
| 12 | el mismo `.webm`, en `/sobre-mi` | Vídeo | nada | «no está en una página de visualización», y es cierto |

**Tres cosas se verificaron en vez de suponerse, y una tumbó la hipótesis de la ficha.**

- **El 404 de `index.htm` no viene de fuera.** El informe de Enlaces da **un enlace externo en
  todo el sitio**, desde `findit.co.in` a la home. No hay nada que redirigir: redirigir un 404
  sin inbound es inventar una ruta para que no la pida nadie.
- **El 404 de la `.woff2` es la definición de un asset inmutable.** Cambió el segmento
  (`_next/static/media` → `_next/static/immutable/media`) y con él el hash. Una URL inmutable
  cambia en cada build **por diseño**; que la vieja dé 404 es el comportamiento, no el fallo.
- **La ficha suponía que las redirecciones eran los once alias que un agente adivina**
  (`/about`, `/privacy`, `/contact`… de la config). **No lo son, y además esos alias no aparecen
  en Search Console en absoluto.** Igual de importante: tampoco aparecen `/md/<locale>/<pagina>.md`
  ni `/.well-known/ard.json`, que era la otra cosa que la ficha temía ver en «rastreadas sin
  indexar» (D158, D166). Google no los rastrea. **No había nada que proteger ahí**, y el descarte
  se escribe porque una preocupación sin comprobar vuelve.

**Por qué `robots.txt` no se toca, que era una de las tres opciones del encargo.** En los ocho
assets bloquear sería **peor que no hacer nada**, y no por conservadurismo: `_next/static/`
bloqueado le rompe el renderizado a Google —necesita las fuentes y el CSS para ver la página que
sí indexa— y `/favicon.ico` bloqueado le quita el favicon a los resultados de búsqueda. Es la
forma de D41: el arreglo que mejora la columna del informe y empeora la cosa que el informe
mide. Y además `robots.txt` es una superficie con decisión escrita encima (D160), así que
tocarla por un ámbar cosmético habría costado más de lo que resuelve.

**El único caso con dos respuestas defendibles era el vídeo, y se elige la de coste cero.** El
`.webm` de `/sobre-mi` va con `aria-hidden`, `tabIndex={-1}`, sin `controls` y sin título: es
**cómo abre la página**, no contenido (D65). Google lo rastrea, ve que `/sobre-mi` no es una
página de visualización y no lo indexa — que es exactamente lo correcto. Se consideraron y se
descartan dos alternativas:

- **`VideoObject` + hacerla página de visualización.** Rechazada: contradice el `aria-hidden` del
  propio elemento —marcarlo como contenido es afirmar lo contrario de lo que el DOM declara— y
  mandaría a quien buscara a un clip decorativo de apertura.
- **`X-Robots-Tag: noindex` sobre `/video/*`.** Defendible y barata (cuatro líneas en
  `next.config.ts`): convertiría «Google decidió no indexarlo» en «lo decidimos nosotros»,
  declarado y legible por una máquina, que es el criterio del `Content-Signal` de D160. Se
  descarta porque **no cambia ningún resultado**: el vídeo ya no se indexa. Compraría una fila
  verde en un panel a cambio de una regla más que mantener, y este repositorio ya tiene escrito
  que un criterio de aceptación no lo pone la nota de un panel ajeno (D157, D167).

**Consecuencia aceptada por escrito, que es la parte que hace que esto no se reabra.** El panel
se queda **en 11 sin indexar y 1 vídeo sin indexar, indefinidamente**, y ninguna de las doce
filas es un defecto. Mismo trato que el 1/2 de `/skills.sh` y el 50% del nodo `Organization`
(D161): cuando la respuesta correcta deja el marcador en ámbar, lo que se corrige es la lectura
del marcador, no el sitio. **Si alguien vuelve a abrir Search Console y ve estas doce, la
respuesta está aquí y es «nada», una por una** — y el criterio de salida es concreto: se vuelve a
mirar el día que aparezca en «sin indexar» una URL que **sea una página**, o el día que el
recuento de indexadas baje de las 28 variantes.

**Estado:** Aceptada.

## D173 · Un recuento no vive donde ningún gate puede leerlo, y esta regla ya se había escrito para media superficie — 2026-09-02

**El hecho.** El «About» del repositorio público decía «**Doce** páginas bilingües, WCAG AAA en
ambos temas y **ocho** guardianes en CI». Son **catorce** (`PAGE_COUNT`) y **veintidós**
(`new Set(CASOS.map(c => c.guardian)).size`, con 50 casos malos). Quien llega desde LinkedIn lee
esas cifras antes que el código.

**Lo que lo convierte en decisión y no en una edición de dos números: la decisión ya estaba
tomada, y para esta frase exacta.** El 2026-08-19, el commit `198e206` la retiró de
`social-preview.png` —«la social preview deja de contar cosas: las cifras caducan, la imagen
no»— citando D60: *«una fuente única evita dos verdades; no mantiene al día una copia
impresa»*. El barrido cubrió la imagen y **no cubrió el About**, que dice lo mismo y se edita
con una llamada a la API. Media superficie hecha, media olvidada.

**Y aquel commit predijo el tamaño del error.** Escribió: «el tercero ya estaba a una línea de
YAML de dejar de serlo: `check:guardianes` existe en `package.json` y no está en `ci.yml`, así
que en cuanto se cablee son nueve». Dos semanas después son veintidós. La cifra no se quedó a
uno de distancia: se fue a catorce. **La ficha de esta tarea, escrita el 2026-09-01, decía
veintiuno** — se equivocó en el mismo sentido y en menos de un día, porque el guardián número
veintidós entró esa noche. Es la prueba más limpia que va a dar este repositorio de por qué la
cifra no puede estar ahí.

**La regla, que es lo reutilizable — y no es «nada de números».** La línea la marca **quién
puede leer la superficie**: `PAGE_COUNT` y `GUARDIAN_COUNT` están vivos porque un gate del repo
los deriva o los sella, pero **ningún gate puede leer el About de GitHub**. Así que ahí solo
aguanta lo que no cambia por su cuenta:

| Se queda | Por qué | Se va | Por qué |
|---|---|---|---|
| «bilingüe» | estructural, no cambia | «Doce páginas» | cambia al añadir una página |
| «Next.js 16, TypeScript, Tailwind v4» | un salto de mayor es un acto deliberado y visible | «ocho guardianes en CI» | cambió catorce veces en dos semanas |
| «WCAG AAA en ambos temas» | es una **política**, no un recuento, y `censo` + `check:palette` impiden que se vuelva falsa en silencio | | |

O sea: **un RECUENTO cambia cada sprint y no puede vivir fuera del alcance de un gate; una
POLÍTICA no cambia nunca y además está vigilada puertas adentro.** El About queda: «El código de
franciscolopez.es: web personal bilingüe de un Senior Product Manager. Next.js 16, TypeScript y
Tailwind v4, WCAG AAA en ambos temas, con el sistema de diseño y la accesibilidad publicados en
el propio sitio». Las dos últimas cláusulas **apuntan a la fuente viva** en vez de copiarla, que
es D38 aplicado a una superficie que no puede derivar nada.

**Por qué NO el guardián que compare el About por API**, que era la otra salida sobre la mesa.
Metería una llamada de red en CI, y eso ya está decidido en contra por D141: `check:enlaces` y
`psi` viven fuera de CI porque un servidor ajeno caído cinco minutos da un rojo que no es
nuestro. Y sería un guardián para sostener un dato que **no hace falta publicar**: se paga
mantenimiento por conservar el modo de fallo. Quitar la cifra no lo vigila, lo **elimina**, que
es más barato y no puede fallar.

**La otra mitad del barrido: las capturas del README eran una copia impresa igual.**
`home-light.png` y `home-dark.png` eran del 2026-08-19 y enseñaban un sitio que ya no existe,
con **tres** derivas en dos semanas: el kicker decía «UX · SaaS · IA aplicada» y hoy es «UX ·
SaaS · IA · Builder»; el nav **no llevaba «Contacto»**, que se construyó el 23; y al titular le
faltaba **el punto de marca en morado** (D137, del 27). Regeneradas contra producción a 1440×900
en los dos temas, con el consentimiento presembrado para que la franja no salga en la foto.

**Y aquí la regla es otra, porque una captura ES una copia por naturaleza y no se puede
desinventar.** No se puede quitar «la cifra» de una foto del sitio: la foto entera es el dato.
Así que lo que se escribe es **cuándo se regenera**: cuando cambie algo que se vea en el pliegue
de la home — el nav, el titular, el kicker o el gesto de marca. Las tres derivas de esta vez
fueron exactamente esas cuatro cosas, así que el criterio no es teórico. No lleva gate: pesarían
más un navegador y una captura en CI que las dos veces al año que esto se mueve, y ese reparto
—manual por coste, con el motivo escrito— es el que `PRD-Live.md` §5 declara aceptable.

**El resto de superficies públicas se barrió y estaba limpio**, que también se escribe para que
no se vuelvan a mirar: la social preview **subida** a GitHub es ya la sin cifras (mismos bytes
que el fichero del repo, comprobado), los once *topics* no llevan ninguna, la bio del perfil
tampoco, y el `LICENSE` y `robots.txt` no publican recuentos. No hay plantillas de issue ni de
PR. En el `README`, la prosa ya decía «Catorce páginas» y **los guardianes se listan en una
tabla en vez de contarse**, que es la forma correcta: una fila de más es visible en el diff, un
número de más no.

**Estado:** Aceptada.

## D174 · Un hook de cierre que sale 0 le habla a la persona, y quien commitea es el modelo — 2026-09-02

**El hecho, y lo caro que fue.** `regeneradores-stop.mjs` (P72.01) se construyó para que un
artefacto derivado que se queda atrás se vea **al cerrar el turno** y no diez minutos después en
CI. **Las dos primeras tareas hechas después de construirlo —P72.03 y P72.04— se fueron a CI en
rojo por `md:verificar`, que es exactamente el fallo que evita.** Con el hook registrado, el
fallo presente y el aviso emitiéndose sin error.

**La causa no era el hook: era el destinatario.** El contrato de un hook de `Stop` reparte por
código de salida, y lo dice el propio menú de `/hooks`:

| Salida | Quién lo ve |
|---|---|
| `0` | **nadie** — stdout y stderr no se muestran |
| `2` | **el modelo**, por stderr, y la conversación continúa |
| otros | solo la persona |

Los dos hooks de cierre —este y `format-stop.mjs`, anterior— emitían por
`console.log(JSON.stringify({systemMessage}))` **con exit 0**. O sea que el aviso llegaba como
mucho a la persona. **Y la persona no es quien actúa:** quien edita, commitea y empuja es el
modelo. Un guardián que funciona perfectamente y habla hacia el lado equivocado es
indistinguible de uno que no existe, que es la familia de fallo que este repositorio lleva
encontrando desde D38 — solo que aquí lo mudo no era el metro, era el altavoz.

**La red ya estaba tendida para el exit 2 y no se entregó.** Los dos ficheros llevaban
`if (evento?.stop_hook_active) process.exit(0)`, y esa guarda **solo hace falta si el hook
bloquea alguna vez**. Estaba puesta la protección contra el bucle de un mecanismo que se envió
sin usar.

**La decisión: bloquear una vez, y solo una.** Cuando hay rojo, el aviso sale por **stderr** con
**exit 2**; en la segunda llamada, `stop_hook_active` lo hace salir 0 y el turno cierra. El coste
máximo es un turno de más. El que se estaba pagando era un viaje de diez minutos a CI, dos veces
seguidas.

**Y `format-stop.mjs` cambia también, donde además importa más:** ese hook **reescribe
archivos**. Si Prettier toca algo después de que el modelo haya commiteado, el árbol deja de
coincidir con el commit, y un aviso que el modelo no ve no puede corregir un commit que el modelo
acaba de hacer.

**Lo que esto revisa de P72.01, y conviene decirlo entero.** Aquella tarea escribió que «los dos
se validaron rompiéndolos», y es verdad: se rompieron los **scripts** y se comprobó que salían
rojos. Lo que no se disparó fue **el hook dentro de una sesión**, que es donde vivía el defecto.
Es la regla de validar un método ejecutándolo sobre el caso real, aplicada un escalón más
arriba: no basta con que el guardián detecte, tiene que **llegar**. Aquí se validaron los cinco
estados —árbol limpio, rojo, guarda de bucle, con reescritura y sin ella— antes de commitear.

**Lo que sigue fuera, y no cambia:** ninguno de los dos arregla nada por su cuenta. Dicen qué
está rojo y con qué comando se resuelve. Sellar sin mirar congelaría el fallo (P72.01), y un
`npm run build && npm run md` de 46 segundos no cabe en un cierre de turno.

**Estado:** Aceptada.

## D175 · La regla que ordena retirar entró como una adición, y no tenía quién la comprobara — 2026-09-02

**Contexto.** `CLAUDE.md` dice desde el 2026-08-31 que **abrir una etapa empieza retirando, en
lote y antes de añadir nada**. La regla existía y nada la portaba. Medido commit a commit:

| Commit | Suma de los 4 `@`-importados | Margen (techo 11.700) |
|---|---|---|
| `6592278` · durante «Agentes» | 11.567 | **133** |
| `76710b3` · **cierre de «Agentes»** | 11.683 | **17** |
| `45208a7` · **apertura de «Distribución»** | 11.683 | **17** |
| `1bc642f` · el 2026-09-01 | 11.690 | **10** |

Todo el sprint «Distribución» sumó **+7 palabras**: el margen no se lo comió el sprint, ya estaba
en 17 cuando abrió. Y las 105 que se lo comieron en el cierre anterior son, literalmente, **la
propia regla que ordena retirar**, entrada como adición sobre un margen de 133. La apertura que
ella misma manda dejó el total exactamente donde estaba.

**Decisión.** Una cuarta mitad en `check:contexto` que compara el corpus **antes y después de la
retirada de apertura**, con `SELLO_CICLO`. No mide el techo —el techo sigue siendo el techo y no
se toca— sino **la dirección del ciclo**.

**Por qué un guardián y no una nota.** Es la forma de D51: se dispara **en un momento** (la
apertura) y detectarlo no requiere criterio. *Elegir* qué se retira sí, y eso lo sigue haciendo
una persona; el guardián solo comprueba que se haya retirado, y su mensaje recuerda que el
candidato no es el bloque más grande sino el **duplicado**.

**Por qué los dos números se miden a mano.** Como `SELLO_GENERAL` y `CICLO_ABIERTO`, y por el
mismo motivo escrito allí: **si se refrescaran solos, la variación saldría siempre 0 y el
guardián no diría nada** — el umbral que persigue al dato. Lo que impide que se queden viejos es
una comprobación de frescura: el sello lleva la fecha del ciclo abierto y tiene que coincidir con
`CICLO_ABIERTO`, así que **no se puede abrir un ciclo sin volver a medir, y no se puede medir sin
enterarse**. Ahí están los dientes; el resto es aritmética.

**Los documentos suspenden y las skills solo avisan.** La regla de `CLAUDE.md` nombra tres
sitios —el conjunto `@`-importado, `General` y `scripts/`— y las skills no están entre ellos. Se
vigilan porque el mismo mecanismo las alcanza, pero convertirlas en rojo sería **inventar la
regla desde el guardián** en vez de portarla. Y el ámbar ya dice algo cierto en su primera
corrida: la apertura de «Higiene» retiró de los documentos (**−7**) y **añadió 42 palabras en las
skills**, en el propio `method-review` que audita el método.

**La deriva del ciclo en curso se publica y no suspende.** `CLAUDE.md` dice que durante el sprint
no se negocia: si algo no cabe, entra, y lo paga la apertura siguiente. Un guardián que
suspendiera a mitad de sprint estaría contradiciendo la regla que porta.

**Lo que no puede ver, dicho para que no se dé por cubierto:** si los dos números son los de
verdad. Salen de medir en el cruce; esto comprueba que se han vuelto a medir y qué dicen.

**Con dos casos malos en `check:guardianes`**, uno por mitad, y los dos **por forma y no por
valor** —que es la lección del caso que nació caducando aquí mismo—: copiar `antes` sobre
`despues` (la apertura que no retira) y desfasar la fecha del sello (el sello que mide contra un
ciclo que ya no es). Comprobado que los dos muerden y que el árbol limpio pasa.

**Estado:** Aceptada.
