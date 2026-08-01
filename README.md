# Francisco López — Web personal

Portfolio y CV en línea de **Francisco López**, Senior Product Manager. La propia
web actúa como prueba de criterio técnico y de diseño: rápida, accesible, bilingüe
y con un sistema de marca propio.

🔗 **En producción:** https://franciscolopez.es

## Stack

- **Next.js 16** (App Router, Turbopack) · **TypeScript** (`strict`)
- **Tailwind CSS v4** + **shadcn/ui** (base-ui) · **lucide-react**
- **next-themes** (claro/oscuro, `system` por defecto)
- Desplegado en **Vercel** (`main` = producción)

## Características

- **i18n ES/EN** desde la primera línea: español sin prefijo (`/`), inglés en
  `/en`, diccionarios tipados y cero strings hardcodeados.
- **Modo claro/oscuro** con tokens OKLCH; todo el sistema de color en **WCAG AAA**.
- **SEO técnico**: metadata + `canonical` + `hreflang` por página, `robots.txt` y
  `sitemap.xml` (gateados por entorno) y datos estructurados JSON-LD
  (`ProfilePage`/`Person` en la home, `BreadcrumbList` en páginas internas).
- **Imágenes Open Graph** de marca generadas al vuelo (`/api/og`, `next/og`).
- **Analítica y consentimiento**: Google Tag Manager + GA4 con **Consent Mode v2**
  y banner de consentimiento granular (RGPD), con página propia de **política de
  cookies**. Toda la analítica va gateada a producción; nada mide sin consentimiento.
- **Rendimiento**: PageSpeed 100 (desktop) / >90 (móvil), CLS 0. Server Components
  por defecto y responsive en CSS (JS de cliente solo en las islas interactivas).
- **CV en PDF bilingüe** (ES/EN) generado por código con identidad de marca y texto
  seleccionable (ATS). Los hechos (roles, fechas, formación, toolkit) se leen del
  diccionario i18n; el CV solo autora el texto rico. `npm run cv` regenera ambos.

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
app/[lang]/            Rutas por locale (home, brand-kit, design-system, cookies) + layout y diccionarios
app/api/og/            Generación de imágenes OG (ImageResponse)
app/{robots,sitemap}   Metadata routes (robots.txt, sitemap.xml)
components/site/        Secciones de la web (nav, hero, footer, breadcrumb, banner de cookies, páginas…)
components/analytics/   GTM + Consent Mode (init) — gateado a producción
components/ui/          Primitivas (logo, button)
lib/                   i18n, site (SITE_URL), consentimiento, datos estructurados y utils
proxy.ts               Enrutado de locale (Next 16 renombra middleware → proxy)
public/                Assets: logo-kit, cv, img, og, favicons
design/                Fuente fiel del diseño (export de Claude Design) — referencia, no se despliega
scripts/logo-kit/      Generación del kit de logo desde su geometría
scripts/cv/            Generador del CV en PDF (react-pdf); hechos del diccionario + texto rico autorado
brand-assets/          Piezas de marca fuera de la web (firma de email, header de LinkedIn) — no se despliega
.claude/skills/        Skills del proyecto (update-cv, close-session, sprint-review)
```

## Documentación

El "porqué" del proyecto vive en documentos dedicados:

- **[PRD-Live.md](./PRD-Live.md)** — spec viva: qué es el producto hoy y qué cumple.
- **[PRD-Historical.md](./PRD-Historical.md)** — registro histórico de decisiones de producto/diseño/alcance (el "por qué").
- **[DECISIONS.md](./DECISIONS.md)** — decisiones técnicas del build (ADR-lite).
- **[BRAND.md](./BRAND.md)** — sistema de marca (color, tipografía, logo).
- **[CLAUDE.md](./CLAUDE.md)** — convenciones de código (i18n, tokens, a11y, SEO).
- **[AGENTS.md](./AGENTS.md)** — aviso: este Next tiene breaking changes; leer los
  docs del paquete antes de tocar APIs.

## Despliegue

Vercel, con **previews por rama/PR** y `main` = producción (`franciscolopez.es`).
Flujo: ramas cortas → PR → merge; tag `vX.Y.Z` por release.
