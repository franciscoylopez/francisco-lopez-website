# DECISIONS — Registro de decisiones técnicas (V1 build)

> **Vive solo en el repo (sin espejo en Notion).** Es la fuente de verdad de las
> decisiones técnicas. *(El espejo de Notion se retiró el 2026-07-30: en Notion solo se
> mantiene el `PRD-Live.md` para comprobación cómoda; DECISIONS y el PRD histórico viven
> solo como `.md` en el repo.)*
>
> Alcance: decisiones **técnicas/de implementación** de la fase de desarrollo. El
> **estado** de producto/diseño/alcance vive en `PRD-Live.md` y su **registro histórico**
> en `PRD-Historical.md`. Las **convenciones**
> que aplican en adelante están en `CLAUDE.md`. El "por qué" de cada trozo de código
> vive en los mensajes de commit/PR; el progreso por tarea, en Notion.
>
> Formato ADR-lite: cada entrada es Decisión + Contexto/porqué + fecha. Estado por
> defecto: **Aceptada**. Si una se revierte, no se borra: se marca *Revertida* y se
> enlaza la que la sustituye.

---

## D1 · El diseño se traduce, no se copia — 2026-07-24

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

## D20 · Revisión de copy ES↔EN — `es.json` fuente de verdad, EN no literal — 2026-07-28
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
- **La CSP estricta (nonces) sigue diferida a V3** con la IA conversacional, sin cambios.

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

## D30 · Texto atenuado sobre fondos que no son `--background` — 2026-08-03

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
