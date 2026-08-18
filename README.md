# Francisco López — Web personal

Portfolio y CV en línea de **Francisco López**, Senior Product Manager. La propia
web actúa como prueba de criterio técnico y de diseño: rápida, accesible, bilingüe
y con un sistema de marca propio.

🔗 **En producción:** https://franciscolopez.es

## Stack

- **Next.js 16** (App Router, Turbopack) · **TypeScript** (`strict`)
- **Tailwind CSS v4** · **lucide-react** · capa de componentes propia en seis piezas
  (`action` · `chrome` · `badge` · `heading` · `table` · `layout`), con **shadcn/ui**
  configurado (estilo `base-nova`) para los widgets con estado que vengan — ver
  `DECISIONS.md` D6 y D36
- **next-themes** (claro/oscuro, `system` por defecto)
- Desplegado en **Vercel** (`main` = producción)

## Características

- **i18n ES/EN** desde la primera línea: español sin prefijo (`/`), inglés en
  `/en`, diccionarios tipados y cero strings hardcodeados.
- **Modo claro/oscuro** con tokens OKLCH; todo el sistema de color en **WCAG AAA**.
- **SEO técnico**: metadata + `canonical` + `hreflang` por página, `robots.txt` y
  `sitemap.xml` (gateados por entorno) y datos estructurados JSON-LD
  (`ProfilePage`/`Person` en la home, `BreadcrumbList` en páginas internas).
- **`llms.txt`**: resumen curado para LLMs/agentes IA, generado desde el diccionario
  i18n y los datos de contacto (sin copia a mano que pueda divergir).
- **Imágenes Open Graph** de marca generadas al vuelo (`/api/og`, `next/og`).
- **Analítica y consentimiento**: Google Tag Manager + GA4 y **Microsoft Clarity**
  (cualitativo: heatmaps, grabaciones) con **Consent Mode v2** y banner de
  consentimiento granular (RGPD), con página propia de **política de cookies**. Toda
  la analítica va gateada a producción y a consentimiento; nada mide sin él.
  Tracking de clics de contacto (mailto/tel) vía `dataLayer`; descarga de CV y scroll
  ya los captura GA4 de fábrica.
- **Rendimiento**: PageSpeed 100 (desktop) / >90 (móvil), CLS 0. Server Components
  por defecto y responsive en CSS (JS de cliente solo en las islas interactivas).
- **CV en PDF bilingüe** (ES/EN) generado por código con identidad de marca y texto
  seleccionable (ATS). **De una experiencia, todo lo que se cuenta —rol, periodo, sector,
  reporting, la frase de la home y los bullets— vive en `content/experience-copy/`** (D57/D58);
  la formación y el toolkit siguen viniendo del diccionario, y el CV solo aporta lo suyo
  (summary, hitos, skills) y decide a qué experiencias da papel. `npm run cv` regenera ambos
  PDFs y su sello; `npm run check:cv` comprueba en CI que los commiteados correspondan a la
  fuente (D60).
- **Deep-dive por experiencia**: el índice `/trayectoria` y cinco páginas en
  `/trayectoria/[slug]`, con una plantilla única —Datos · En un minuto · La historia · El caso ·
  Aprendizajes— y el contenido en el diccionario partido por experiencia. Cuáles existen no se
  escribe en ningún sitio: las páginas, el índice, el sitemap y `llms.txt` **derivan** de
  `content/experiences.ts` filtrando `slug !== null` (D44/D59). Los **artefactos son documentos
  reales**, no recreaciones: el diagrama de estados se publica renderizado desde su Mermaid
  original y saneado, en línea para que conmute con el tema (D53/D54).
- **Páginas de error 404 y 500** con marca e i18n: el 404 con el "0" del número
  convertido en el círculo del split, que "florece" al cargar (CSS, reduced-motion safe).
- **Seguridad y calidad**: cabeceras de seguridad (nosniff, X-Frame-Options,
  Referrer-Policy, Permissions-Policy, HSTS y **CSP** «A+ barato»), **escaneo de
  dependencias** automatizado (**Dependabot**) y **CI** en cada PR (GitHub Actions:
  typecheck + lint + build) — nada que no compile entra en `main`.

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:3000
```

Otros scripts:

```bash
npm run build      # build de producción
npm run start      # sirve el build de producción
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
npm run format     # Prettier
npm run check:palette  # la paleta del código contra la de globals.css, y que no
                       # quede ninguna copia de un token fuera de su fuente (D38)
npm run check:experiencias  # que las TRES longitudes de cada experiencia cuadren:
                            # misma cobertura en ES y EN, versión larga solo donde
                            # hay deep-dive, y ninguna cifra en una y no en la otra (D57)
npm run check:cv   # que los PDFs commiteados correspondan a la fuente: sella la
                   # HUELLA DE LAS ENTRADAS, no bytes — el PDF no es determinista (D60)
npm run cv         # regenera el CV en PDF (ES + EN) → public/cv/ y actualiza su sello
npm run artefacto  # re-renderiza el diagrama de Emendu desde su .mmd (D54)
npm run gate:html -- save   # instantánea del HTML de las 12 páginas × 2 idiomas (24 variantes)
npm run gate:html           # …y comprueba que un refactor no lo cambió (D42, D45)
npm run psi -- <url>        # PageSpeed sobre el Preview o producción, móvil y escritorio (D49)
```

> **`npm run artefacto`** usa `@mermaid-js/mermaid-cli`, que necesita un navegador.
> `scripts/mermaid-puppeteer.json` declara `channel: "chrome"`, o sea **el Chrome que ya
> tengas instalado**: no se descarga ningún Chromium. El render es local —el diagrama no
> sale a ningún servidor— y **determinista**, así que regenerar sin cambiar el `.mmd` no
> ensucia el diff.

> **`npm run psi`** necesita una **URL pública** (el Preview de Vercel o producción, nunca
> localhost) y una clave gratuita de la API en `PSI_API_KEY` — ver `.env.example` para cómo
> obtenerla. Imprime la nota, las métricas, el **desglose del LCP por fases** y los avisos que
> no pasan. La primera línea es la **huella del despliegue**: si no cambió tras un push, estás
> midiendo el build anterior.

> El **gate de HTML** necesita el sitio servido (`npm run build && npm start`),
> y la línea base y la comprobación tienen que salir del mismo modo — dev y prod
> emiten HTML distinto. `BASE_URL` cambia el puerto.

> **Lighthouse/PageSpeed** se mide contra el build de producción
> (`next build && next start` o el preview de Vercel), nunca contra `next dev`.

## Estructura

```
app/[lang]/            Rutas por locale (home, sobre-mi, trayectoria + trayectoria/[slug], brand-kit, design-system, accesibilidad, cookies) + layout y error boundary
app/[lang]/dictionaries/{es,en}/  Diccionario PARTIDO POR PÁGINA (D48): common + una rama por página. Cada página carga la suya; los tipos salen del ES y una clave que falte en EN rompe el build
app/api/og/            Generación de imágenes OG (ImageResponse)
app/{robots,sitemap}   Metadata routes (robots.txt, sitemap.xml)
app/llms.txt/          Route handler: /llms.txt generado desde el diccionario i18n
app/global-*           404/500 de marca e i18n (global-not-found, global-error): root layout dinámico → convenciones globales de Next
.github/workflows/     CI (GitHub Actions): format + typecheck + lint + paleta + build en cada PR
.github/dependabot.yml  Escaneo de dependencias: PRs semanales (npm + github-actions)
components/ui/          Primitivas SIN conocimiento del contenido: action.tsx (todo lo accionable), chrome.tsx (enlaces de navegación), badge.tsx (rótulos que no se pulsan), heading.tsx (par eyebrow + titular), table.tsx (DataTable/TR/TD para datos, SPECIMEN_ROW para especímenes), layout.ts (WRAP/SECTION/PROSE/CARD/PANEL/PAIR), logo, icons (los que lucide no trae), rich (markup inline del copy), info-card, video-embed (vídeo de terceros con facade: sin iframe hasta el clic — D55) — ver BRAND.md y DECISIONS D36/D40
components/site/        Piezas que SÍ saben de este sitio: page-shell.tsx (el marco común de toda página: JSON-LD, nav, isla de motion, el <main> y footer — D45/D46), skip-link.tsx (enlace de salto, WCAG 2.4.1 nivel A), bloques (nav, footer, breadcrumb, banner de cookies…) y secciones de página (hero, hitos, toolkit…)
components/site/{design-system,brand-kit}/  Los dos showcase, UN ARCHIVO POR SECCIÓN: index.tsx (el orden), NN-nombre.tsx (cada sección con sus subcomponentes) y shared.tsx (lo que cruza) — D42
components/analytics/   GTM + Consent Mode (init) — el contenedor va gateado a producción; la UI de consentimiento se monta en todos los entornos
content/               Contenido y datos de la app que NO son copy del diccionario: cv/ (lo exclusivo del papel — resumen, hitos, habilidades; D22) y experiences.ts (logo y slug por experiencia, unidos por `company`, D44)
content/experience-copy/  De una experiencia, TODO lo que se cuenta en más de una superficie: la frase de Trayectoria, el bullet del CV y su gemelo de «En un minuto» —los dos últimos, el MISMO elemento del array— más rol, periodo, sector y reporting. Home, CV, deep-dive y llms.txt leen de aquí (D57, D58)
content/artefactos/    Los artefactos del deep-dive: el `.mmd` es la FUENTE del dibujo y el `.svg` de al lado su render saneado — se regenera, no se edita (D54)
lib/                   i18n (locales + pagePath, la fuente única de ruta↔locale), page-meta (metadata de página: canonical, hreflang, OG y Twitter derivados — D45), site (SITE_URL), contact (email/tel/LinkedIn), analítica (tracking de clics), consentimiento, datos estructurados, design-values (fuente única de lo que el sitio publica sobre sí mismo: tokens, breakpoints y contraste medido — D38) y utils
proxy.ts               Enrutado de locale (Next 16 renombra middleware → proxy)
public/                Assets: logo-kit, cv, img, og, favicons
design/                Fuente fiel del diseño (export de Claude Design) — referencia, no se despliega
scripts/logo-kit/      Generación del kit de logo desde su geometría
scripts/cv/            Generador del CV en PDF (react-pdf) + facts.ts (hechos leídos del diccionario); el texto rico vive en content/cv/
scripts/check-palette.ts  Guardián de CI: la paleta de lib/design-values.ts contra la de globals.css,
                          y ningún hex de token copiado fuera de su fuente (D38)
scripts/design-review/  Censo de pares de contraste del DOM servido (lo usa el skill design-review)
scripts/psi.ts         PageSpeed Insights desde la terminal: nota, métricas, desglose del LCP
                       y huella del despliegue medido (D49)
scripts/page-html-diff.ts  Gate de refactor: el HTML servido de las 12 páginas (ES/EN) no
                           puede cambiar. Semilla del arnés de tests (D42, ampliado en D45,
                           y a las doce con el deep-dive en D59)
scripts/artefacto-svg.ts   Traductor del export de mermaid.live al SVG que el sitio sirve:
                           le quita la hoja de estilos externa (que la CSP no permite), el
                           pan/zoom del editor y la paleta fija, y calcula el viewBox real.
                           Aborta si queda UN solo color literal: el guardián busca la
                           ausencia, no comprueba las copias conocidas (D54)
brand-assets/          Piezas de marca fuera de la web (firma de email, header de LinkedIn) — no se despliega
.claude/skills/        Skills del proyecto (update-cv, close-session, sprint-review, design-review)
.claude/agents/        Subagentes del proyecto: viewport-verifier (mide una página servida con
                       agent-browser — axe por tema, la aritmética del pliegue de D50 y los
                       vitals; mide y reporta, no edita) — D52
```

## Documentación

El "porqué" del proyecto vive en documentos dedicados:

- **[PRD-Live.md](./PRD-Live.md)** — spec viva: qué es el producto hoy y qué cumple.
- **[PRD-Historical.md](./PRD-Historical.md)** — registro histórico de decisiones de producto/diseño/alcance (el "por qué").
- **[DECISIONS.md](./DECISIONS.md)** — decisiones técnicas del build (ADR-lite).
- **[BRAND.md](./BRAND.md)** — sistema de marca: reglas siempre activas (color, tipografía, tokens, a11y).
- **[BRAND-historical.md](./BRAND-historical.md)** — el porqué fechado de las reglas de marca: qué se probó y qué falló antes de que quedaran escritas así (referencia a demanda).
- **[BRAND-logo.md](./BRAND-logo.md)** — apéndice de marca: enciclopedia del logo y la firma split (referencia a demanda).
- **[CLAUDE.md](./CLAUDE.md)** — convenciones de código (i18n, tokens, a11y, SEO).
- **[AGENTS.md](./AGENTS.md)** — aviso: este Next tiene breaking changes; leer los
  docs del paquete antes de tocar APIs.

## Despliegue

Vercel, con **previews por rama/PR** y `main` = producción (`franciscolopez.es`).
Flujo: ramas cortas → PR → merge; tag `vX.Y.Z` por release. Cada PR pasa por **CI**
(GitHub Actions): typecheck + lint + build.
