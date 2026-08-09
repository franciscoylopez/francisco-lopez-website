# Francisco López — Web personal

Portfolio y CV en línea de **Francisco López**, Senior Product Manager. La propia
web actúa como prueba de criterio técnico y de diseño: rápida, accesible, bilingüe
y con un sistema de marca propio.

🔗 **En producción:** https://franciscolopez.es

## Stack

- **Next.js 16** (App Router, Turbopack) · **TypeScript** (`strict`)
- **Tailwind CSS v4** · **lucide-react** · capa de componentes propia
  (`components/ui/action.tsx` + `layout.ts`), con **shadcn/ui** configurado
  (estilo `base-nova`) para los widgets con estado que vengan — ver `DECISIONS.md` D6
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
  seleccionable (ATS). Los hechos (roles, fechas, formación, toolkit) se leen del
  diccionario i18n; el CV solo autora el texto rico. `npm run cv` regenera ambos.
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
npm run cv         # regenera el CV en PDF (ES + EN) → public/cv/
```

> **Lighthouse/PageSpeed** se mide contra el build de producción
> (`next build && next start` o el preview de Vercel), nunca contra `next dev`.

## Estructura

```
app/[lang]/            Rutas por locale (home, sobre-mi, brand-kit, design-system, accesibilidad, cookies) + layout, diccionarios, not-found/error
app/api/og/            Generación de imágenes OG (ImageResponse)
app/{robots,sitemap}   Metadata routes (robots.txt, sitemap.xml)
app/llms.txt/          Route handler: /llms.txt generado desde el diccionario i18n
app/global-*           404/500 de marca e i18n (global-not-found, global-error): root layout dinámico → convenciones globales de Next
.github/workflows/     CI (GitHub Actions): typecheck + lint + build en cada PR
.github/dependabot.yml  Escaneo de dependencias: PRs semanales (npm + github-actions)
components/ui/          Primitivas SIN conocimiento del contenido: action.tsx (todo lo accionable), chrome.tsx (enlaces de navegación), badge.tsx (rótulos que no se pulsan), heading.tsx (par eyebrow + titular), layout.ts (WRAP/SECTION/PROSE/CARD/PANEL/PAIR), logo, icons (los que lucide no trae), rich (markup inline del copy), info-card — ver BRAND.md y DECISIONS D36
components/site/        Piezas que SÍ saben de este sitio: bloques (nav, footer, breadcrumb, banner de cookies…) y secciones de página (hero, hitos, toolkit…)
components/analytics/   GTM + Consent Mode (init) — el contenedor va gateado a producción; la UI de consentimiento se monta en todos los entornos
lib/                   i18n, site (SITE_URL), contact (email/tel/LinkedIn), analítica (tracking de clics), consentimiento, datos estructurados, design-values (fuente única de lo que el sitio publica sobre sí mismo: tokens, breakpoints y contraste medido — D38) y utils
proxy.ts               Enrutado de locale (Next 16 renombra middleware → proxy)
public/                Assets: logo-kit, cv, img, og, favicons
design/                Fuente fiel del diseño (export de Claude Design) — referencia, no se despliega
scripts/logo-kit/      Generación del kit de logo desde su geometría
scripts/cv/            Generador del CV en PDF (react-pdf); hechos del diccionario + texto rico autorado
brand-assets/          Piezas de marca fuera de la web (firma de email, header de LinkedIn) — no se despliega
.claude/skills/        Skills del proyecto (update-cv, close-session, sprint-review, design-review)
```

## Documentación

El "porqué" del proyecto vive en documentos dedicados:

- **[PRD-Live.md](./PRD-Live.md)** — spec viva: qué es el producto hoy y qué cumple.
- **[PRD-Historical.md](./PRD-Historical.md)** — registro histórico de decisiones de producto/diseño/alcance (el "por qué").
- **[DECISIONS.md](./DECISIONS.md)** — decisiones técnicas del build (ADR-lite).
- **[BRAND.md](./BRAND.md)** — sistema de marca: reglas siempre activas (color, tipografía, tokens, a11y).
- **[BRAND-logo.md](./BRAND-logo.md)** — apéndice de marca: enciclopedia del logo y la firma split (referencia a demanda).
- **[CLAUDE.md](./CLAUDE.md)** — convenciones de código (i18n, tokens, a11y, SEO).
- **[AGENTS.md](./AGENTS.md)** — aviso: este Next tiene breaking changes; leer los
  docs del paquete antes de tocar APIs.

## Despliegue

Vercel, con **previews por rama/PR** y `main` = producción (`franciscolopez.es`).
Flujo: ramas cortas → PR → merge; tag `vX.Y.Z` por release. Cada PR pasa por **CI**
(GitHub Actions): typecheck + lint + build.
