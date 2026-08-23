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
- D6 · ¿shadcn lo trae? → no se escribe (regla hacia delante); `@base-ui/react` fuera hasta el primer componente
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
- D64 · Una apertura homogénea no la decide el anclaje: la deciden los altos
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

## D6 · ¿shadcn lo trae? → no se escribe (regla hacia delante); `@base-ui/react` fuera hasta el primer componente — 2026-07-24, **reescrita 2026-08-08 (P37.63)**
**Decisión.** Para **widgets con estado, foco atrapado o portal** —diálogo, popover, tooltip,
combobox, menú, tabs, scroll-area— la regla es la simétrica de la de iconos («¿lucide lo trae? →
no se dibuja»): **¿shadcn lo trae? → no se escribe.** Se trae con `npx shadcn@latest add
<componente>` (estilo `base-nova`, ya configurado en `components.json`), se le aplican **nuestros**
tokens, y si acaba siendo pieza del sistema se publica en el Design System. Es el **paso 3 de la
«Regla de construcción»** de `CLAUDE.md`, que es donde vive la cascada completa; aquí queda el
porqué y el estado de la dependencia.

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

## D43 · Toda página y toda sección abren igual: el ordinal va dentro del eyebrow — 2026-08-10

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
contenedor, la captura mide 1.280px y se lee entera —es lo que hace el artefacto de Emendu, que
incluso scrollea antes que encogerse—. Pero **un artefacto hay que LEERLO nodo a nodo y una
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
la caja y gana un 42% sin tocar nada más. Si las etiquetas de flecha (10px) se quedan cortas, la
palanca **no es escalar el dibujo**: es renderizarlo con una tipografía mayor —Mermaid recalcula
el layout y las cajas crecen con ella—, que es distinto de cambiar la fuente **después** del
render, lo que este mismo ADR prohíbe.

De paso, la región que scrollea pasa a ser **operable con teclado** (`tabIndex` + nombre
accesible). Solo scrollea en móvil, pero ahí quien navega con teclado no llegaba a lo que queda
fuera (WCAG 2.1.1). Hueco preexistente que el experimento del 1:1 hizo evidente.

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

## D64 · Una apertura homogénea no la decide el anclaje: la deciden los altos

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
resuelve. Cada diagrama de `como-se-ha-creado-diagrams.tsx` gana un prop `lang` y un objeto
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

**Lo que queda abierto.** `check:marco` no distingue un tipo elegible para rich results de uno que
no lo es, así que no puede avisar de que una referencia que cruza de página va a degradarse. Hoy no
hay caso vivo. Está tareado, **sin prejuzgar la forma**: puede que lo correcto no sea un guardián
más sino la regla escrita donde ya está el porqué, en `lib/structured-data.ts`.

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
