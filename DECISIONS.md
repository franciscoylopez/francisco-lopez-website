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
**Decisión.** `--muted-foreground` (y cualquier atenuado calibrado contra `--background`) **no
se usa sobre una banda o tarjeta de color**. Sobre un fondo distinto hay que **recalcular**, y
el patrón por defecto es **mezclar el texto con el propio fondo** en vez de tirar del token:

```css
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

**La escalera completa, cerrada el 2026-08-09 (P37.65 y P37.655).** La capa de componentes
no era `action.tsx` + `layout.ts`: eran los dos primeros peldaños de cuatro, y los otros dos
se descubrieron por el mismo síntoma —la misma decisión escrita a mano N veces—.

| Capa | Archivo | Qué gobierna | Cuántas copias sustituyó |
|---|---|---|---|
| Acción | `action.tsx` | el control **con caja** | 6 definiciones de «botón base» |
| Chrome | `chrome.tsx` | el enlace de la **carpintería** | 14 call sites con métricas a mano |
| Etiqueta | `badge.tsx` | el rótulo que **no se pulsa** | 8 pastillas en 6 archivos |
| Cabecera | `heading.tsx` | eyebrow + titular | eyebrow ×14, título ×7, 6 huecos |
| Layout | `layout.ts` | cajas y ritmos | `WRAP` ×18, `SECTION` ×8 |

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
