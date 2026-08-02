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

## D6 · shadcn ya integrado; componentes donde aporten a11y — 2026-07-24
**Decisión.** shadcn está integrado (estilo base-nova, primitivas `@base-ui/react`, iconos lucide);
**no** hay que reimportarlo. Usar sus componentes donde ganan accesibilidad (Tabs para el Toolkit y
el control de dispositivo del Design System; Button para CTAs); el resto de secciones, a medida con
tokens. OK a reducir estilos inline a favor de componentes shadcn donde sea óptimo.
**Iconos:** genéricos → `lucide-react`; logos de marca → PNG en `public/logos/**` (pares light/dark)
con `next/image` + swap por tema; logo propio → `components/ui/logo.tsx`.

**Contexto.** El diseño es a medida y apenas consume la librería; forzarlo por shadcn no aporta.
Pero Tabs/segmented controls a mano son un foco de bugs de accesibilidad (teclado, ARIA) — ahí
base-ui lo da gratis y empuja el objetivo AA/AAA.

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
