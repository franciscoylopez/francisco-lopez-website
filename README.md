<div align="center">

![Del discovery al dato](.github/assets/banner.png)

**Web personal de Francisco López, Senior Product Manager.**
La propia web es la prueba de criterio técnico y de diseño: rápida, accesible, bilingüe y con un sistema de marca propio.

[![Sitio en producción](https://img.shields.io/badge/en_producción-franciscolopez.es-005859?style=for-the-badge)](https://franciscolopez.es)
[![CI](https://github.com/franciscoylopez/francisco-lopez-website/actions/workflows/ci.yml/badge.svg)](https://github.com/franciscoylopez/francisco-lopez-website/actions/workflows/ci.yml)

![Next.js 16](https://img.shields.io/badge/Next.js-16-000?logo=nextdotjs&logoColor=white)
![TypeScript strict](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![Tailwind v4](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)
![WCAG AAA](https://img.shields.io/badge/WCAG-AAA_en_ambos_temas-16BDBD)
![PageSpeed](https://img.shields.io/badge/PageSpeed-100_escritorio_·_94--96_móvil-9B87F5)

[Ver el sitio](https://franciscolopez.es) · [Design System](https://franciscolopez.es/design-system) · [Brand Kit](https://franciscolopez.es/brand-kit) · [Accesibilidad](https://franciscolopez.es/accesibilidad) · [Un deep-dive](https://franciscolopez.es/trayectoria/emendu)

</div>

---

## El sitio

Doce páginas por idioma, en español (raíz `/`) e inglés (`/en`). Tema claro y oscuro, `system` por defecto.

| Claro | Oscuro |
| :---: | :---: |
| ![Home en tema claro](.github/assets/home-light.png) | ![Home en tema oscuro](.github/assets/home-dark.png) |

## Qué tiene de interesante

No es un portfolio con un `README` de portfolio. Lo que hay debajo son unas cuantas decisiones que se sostienen solas, cada una con su registro fechado en [`DECISIONS.md`](./DECISIONS.md):

| | Decisión | Por qué está aquí |
| :-- | :-- | :-- |
| **Un dato, un sitio** | De una experiencia, la frase de la portada, el bullet del CV y su gemelo del deep-dive son **el mismo elemento de un array** | Vivían en tres archivos y habían divergido ocho veces. Una fecha equivocada no falla donde se escribe: falla en los seis sitios que la leen · `D57` · `D58` |
| **La accesibilidad se hereda** | `text-muted-foreground` no significa «este gris», significa «el atenuado del fondo donde caiga este texto» | Cada superficie recalcula su propio contraste. 141 usos heredaron el arreglo sin tocar un solo call site, y una tarjeta nueva nace bien sin pedirlo · `D39` · `D61` |
| **Nada se escribe a mano** | Siete piezas resuelven todo lo accionable, los rótulos, las cabeceras, las tablas y las cajas | Si un caso no encaja en una variante, se crea la variante. Es lo que hace que un cambio de hover llegue a las doce páginas a la vez · `D36` |
| **Los guardianes buscan la ausencia** | Los checks de CI no comprueban que las copias conocidas cuadren: comprueban que **no queda ninguna** | Un metro que solo valida lo que ya conoce aprueba sobre lista vacía. Y cada uno **afirma cuánto ha mirado** · `D38` · `D54` · `D63` |
| **El refactor se demuestra** | `npm run gate:html` compara el HTML servido de las 24 variantes antes y después | Diff vacío = transparente por construcción, no por revisión. Es lo que más ha cazado, y se valida rompiéndolo · `D42` · `D45` |
| **Un artefacto se enseña** | El diagrama del deep-dive es el render **real** de su Mermaid original, saneado y en línea | Redibujarlo con los tokens del sitio cumplía la letra de la regla e incumplía su espíritu. En línea, y no como imagen, para que conmute con el tema · `D54` |
| **El alto también es un eje** | El gate de accesibilidad se dispara dos veces: *mientras se dibuja* una banda y *al cerrar* | Un 1920 con el escalado de Windows al 150% es un viewport de 1280×618. No lo vio ninguna auditoría porque ninguna miraba una combinación que el desarrollador no tiene delante · `D50` · `D52` |
| **Un vídeo entra con facade** | Hasta que alguien pulsa no hay iframe, ni JS de terceros, ni una petición a Google | El clic es más estricto que gatearlo por categoría: quien acepta todas las cookies tampoco carga YouTube sin pulsar · `D55` |

## Stack

- **Next.js 16** (App Router, Turbopack) · **TypeScript** (`strict`) · **Tailwind CSS v4**
- **Capa de componentes propia, en siete piezas** — `action` (todo lo accionable) · `chrome` (enlaces de navegación) · `badge` (rótulos que no se pulsan) · `heading` (eyebrow + titular) · `table` · `stat-row` · `layout`. **shadcn/ui** está configurado (estilo `base-nova`) y **sin usar**: entra solo para widgets con estado, foco atrapado o portal, y hacia delante (`D6`, `D36`)
- **lucide-react** para iconos; los que lucide no trae se dibujan a mano con su propia regla de autoría, para que no se distingan de los de la librería
- **next-themes** (claro/oscuro, `system` por defecto) · **Vercel** (`main` = producción)

## Características

<details>
<summary><b>i18n, SEO y contenido generado</b></summary>

- **i18n ES/EN** desde la primera línea: español sin prefijo (`/`), inglés en `/en`, diccionarios tipados y cero strings hardcodeados. El diccionario está **partido por página** (`D48`): los tipos salen del ES y una clave que falte en EN rompe el build.
- **SEO técnico**: metadata + `canonical` + `hreflang` por página, `robots.txt` y `sitemap.xml` (gateados por entorno) y datos estructurados JSON-LD (`ProfilePage`/`Person` en la home, `BreadcrumbList` en páginas internas, `WebPage` en el deep-dive).
- **Qué páginas tiene el sitio no se escribe en ningún sitio**: las páginas del deep-dive, el índice, el sitemap, `llms.txt` y las tarjetas OG **derivan** de `content/experiences.ts` (`D44`, `D59`). Estaba escrito a mano en tres sitios.
- **`llms.txt`**: resumen curado para LLMs y agentes, generado desde el diccionario y los datos de contacto.
- **Imágenes Open Graph** de marca generadas al vuelo (`/api/og`, `next/og`).

</details>

<details>
<summary><b>Deep-dive por experiencia</b></summary>

El índice `/trayectoria` y cinco páginas en `/trayectoria/[slug]`, con una plantilla única — Datos · En un minuto · La historia · El caso (opcional) · Aprendizajes — y un presupuesto de 700-900 palabras, 1.200 con caso. La homogeneidad la dan el marco y la longitud, no los títulos: dentro de «La historia» los subapartados son libres, para que una experiencia de tres meses no salga con secciones medio vacías al lado de una de cinco años y medio.

Los **artefactos son documentos reales**, no recreaciones (`D53`, `D54`). Y hay una **línea de discreción**: lo que se cuenta en una entrevista no se escribe en una página pública, y eso acota también el corpus del agente conversacional antes de que exista.

</details>

<details>
<summary><b>Accesibilidad</b></summary>

- **Todos los pares de color del sistema en WCAG AAA**, en ambos temas, **en reposo y en hover, sin excepciones** — verificado sobre las doce páginas × dos temas, con el metro validado en las 24 corridas.
- El censo de contraste se hace **recorriendo el DOM de la página servida**, no leyendo el CSS: un par que solo existe al componer un velo, o una pastilla de hover, no aparece en ningún inventario de tokens.
- **Enlace de salto** (WCAG 2.4.1, nivel A), que axe no detecta y por eso se comprueba a mano (`D46`).
- `prefers-reduced-motion` respetado en toda animación. Con motion reducido, el vídeo de apertura de «Sobre mí» **ni siquiera se descarga** (`D65`).
- El método completo, y los tres metros que este proyecto se ha encontrado descalibrados, en [`BRAND.md`](./BRAND.md) §Accesibilidad.

</details>

<details>
<summary><b>Rendimiento, medición y seguridad</b></summary>

- **PageSpeed 100 (escritorio) / 94-96 (móvil)**, CLS 0. Server Components por defecto, responsive en CSS y JS de cliente solo en las islas interactivas.
- **Analítica y consentimiento**: Google Tag Manager + GA4 y **Microsoft Clarity**, con **Consent Mode v2** y banner de consentimiento granular (RGPD), con página propia de política de cookies. Todo gateado a producción **y** a consentimiento: nada mide sin él.
- **CV en PDF bilingüe** (ES/EN) generado por código, con identidad de marca y texto seleccionable (ATS).
- **Cabeceras de seguridad**: nosniff, X-Frame-Options, Referrer-Policy, Permissions-Policy, HSTS y **CSP** «A+ barato», con allowlist mínima por origen exacto.
- **Páginas de error 404 y 500** con marca e i18n: el 404 convierte el «0» en el círculo del split, que florece al cargar (CSS, seguro con motion reducido).

</details>

## Que no se rompa

Ocho pasos de CI en cada PR ([GitHub Actions](./.github/workflows/ci.yml)), y `main` protegida por ruleset: no hay push directo, y un PR no mergea con CI en rojo.

| Paso | Qué impide |
| :-- | :-- |
| `format:check` · `typecheck` · `lint` | Lo de siempre. Nada que no compile entra en `main` |
| `check:palette` | Que quede **ninguna** copia de un valor de token fuera de su fuente. Busca valores, no patrones (`D38`) |
| `check:experiencias` | Que las tres longitudes de una experiencia se descuadren: misma cobertura en ES y EN, y ninguna cifra en una y no en la otra (`D57`) |
| `check:cv` | Que los PDFs commiteados se queden viejos. Sella la **huella de las entradas**, no bytes: el PDF no es determinista (`D60`) |
| `check:raya` | Que vuelva la raya (`—`) al copy servido, con sus dos excepciones (`D63`) |
| `check:artefacto` | Que el SVG commiteado se quede viejo. Sella el **par fuente→producto**, que es más fuerte que sellar entradas: aquí sí se pudo, porque el artefacto **es** determinista (`D70`) |
| `check:contexto` | Que el contexto de arranque crezca sin techo. D28 escribió el régimen y no le puso cifra: creció un 113% en diez días (`D69`) |
| `check:skills` | Que una skill nombre archivos o comandos que ya no existen. Se **siguen** en vez de leerse, así que su drift se ejecuta (`D60`) |
| `check:indices` | Que un índice deje de ser el derivado de sus cabeceras. Los tres se generan con `npm run indices` (`D69`) |
| `build` | — |

Y fuera de CI, dos: **`npm run check:guardianes`** pasa a cada guardián un caso malo conocido que tiene que rechazar —lo que se hacía como hábito («validado rompiéndolo») convertido en comando (`D70`)—, y el que más ha cazado, **`npm run gate:html`**, compara el HTML servido de las doce páginas × dos idiomas antes y después de un refactor. Ahí vive lo que nadie revisa: un `hreflang` mal copiado no lo ve el typecheck, ni el linter, ni axe.

## Arrancar

```bash
npm install
npm run dev        # http://localhost:3000
```

<details>
<summary><b>Todos los scripts</b></summary>

```bash
npm run build      # build de producción
npm run start      # sirve el build de producción
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
npm run format     # Prettier

# Guardianes (los mismos que corre CI)
npm run check:palette       # la paleta del código contra la de globals.css, y que no
                            # quede ninguna copia de un token fuera de su fuente (D38)
npm run check:experiencias  # que las TRES longitudes de cada experiencia cuadren (D57)
npm run check:cv            # que los PDFs commiteados correspondan a su fuente (D60)
npm run check:raya          # que no vuelva la raya (—) al copy servido (D63)

# Generadores
npm run cv         # regenera el CV en PDF (ES + EN) → public/cv/ y actualiza su sello
npm run artefacto  # re-renderiza el diagrama de Emendu desde su .mmd (D54)

# Medición
npm run gate:html -- save   # instantánea del HTML de las 12 páginas × 2 idiomas
npm run gate:html           # …y comprueba que un refactor no lo cambió (D42, D45)
npm run psi -- <url>        # PageSpeed sobre el Preview o producción (D49)
```

> **`npm run artefacto`** usa `@mermaid-js/mermaid-cli`, que necesita un navegador.
> `scripts/mermaid-puppeteer.json` declara `channel: "chrome"`, o sea **el Chrome que ya
> tengas instalado**: no se descarga ningún Chromium. El render es local — el diagrama no
> sale a ningún servidor — y **determinista**, así que regenerar sin cambiar el `.mmd` no
> ensucia el diff.

> **`npm run psi`** necesita una **URL pública** (el Preview de Vercel o producción, nunca
> localhost) y una clave gratuita de la API en `PSI_API_KEY` — ver [`.env.example`](./.env.example).
> Imprime la nota, las métricas, el **desglose del LCP por fases** y los avisos que no pasan.
> La primera línea es la **huella del despliegue**: si no cambió tras un push, estás midiendo
> el build anterior.

> El **gate de HTML** necesita el sitio servido (`npm run build && npm start`), y la línea
> base y la comprobación tienen que salir del mismo modo: dev y prod emiten HTML distinto.
> `BASE_URL` cambia el puerto.

> **Lighthouse/PageSpeed** se mide contra el build de producción, nunca contra `next dev`.

</details>

## Estructura

<details>
<summary><b>Mapa del repositorio</b></summary>

```
app/[lang]/            Rutas por locale (home, sobre-mi, trayectoria + trayectoria/[slug], brand-kit,
                       design-system, accesibilidad, cookies) + layout y error boundary
app/[lang]/dictionaries/{es,en}/  Diccionario PARTIDO POR PÁGINA (D48): common + una rama por página.
                       Cada página carga la suya; los tipos salen del ES y una clave que falte en EN
                       rompe el build
app/api/og/            Generación de imágenes OG (ImageResponse)
app/{robots,sitemap}   Metadata routes (robots.txt, sitemap.xml)
app/llms.txt/          Route handler: /llms.txt generado desde el diccionario i18n
app/global-*           404/500 de marca e i18n (global-not-found, global-error)

components/ui/         Primitivas SIN conocimiento del contenido: action.tsx (todo lo accionable),
                       chrome.tsx (enlaces de navegación), badge.tsx (rótulos que no se pulsan),
                       heading.tsx (eyebrow + titular), table.tsx (DataTable/TR/TD para datos,
                       SPECIMEN_ROW para especímenes), stat-row.tsx (la fila de cifras de una
                       apertura, D64), layout.ts (WRAP/SECTION/PROSE/CARD/PANEL/PAIR/HERO_ROW),
                       logo, icons (los que lucide no trae), rich (markup inline del copy),
                       info-card, video-embed (facade: sin iframe hasta el clic, D55)
components/site/       Piezas que SÍ saben de este sitio: page-shell.tsx (el marco común de toda
                       página: JSON-LD, nav, isla de motion, el <main> y footer, D45/D46),
                       skip-link.tsx (WCAG 2.4.1 nivel A), bloques (nav, footer, breadcrumb,
                       banner de cookies…) y secciones de página (hero, hitos, toolkit…)
components/site/{design-system,brand-kit}/  Los dos showcase, UN ARCHIVO POR SECCIÓN (D42)
components/analytics/  GTM + Consent Mode (init)

content/               Contenido y datos que NO son copy del diccionario: cv/ (lo exclusivo del papel)
                       y experiences.ts (logo y slug por experiencia, unidos por `company`, D44)
content/experience-copy/  De una experiencia, TODO lo que se cuenta en más de una superficie.
                       Home, CV, deep-dive y llms.txt leen de aquí (D57, D58)
content/artefactos/    El `.mmd` es la FUENTE del dibujo y el `.svg` de al lado su render saneado:
                       se regenera, no se edita (D54)

lib/                   i18n (fuente única de ruta↔locale), page-meta (D45), site (SITE_URL),
                       contact, analítica, consentimiento, datos estructurados, design-values
                       (fuente única de lo que el sitio publica sobre sí mismo, D38) y utils
proxy.ts               Enrutado de locale (Next 16 renombra middleware → proxy)
public/                Assets: logo-kit, cv, img, og, video, favicons
design/                Fuente fiel del diseño (export de Claude Design) — referencia, no se despliega
brand-assets/          Piezas de marca fuera de la web — no se despliega

scripts/logo-kit/      Generación del kit de logo desde su geometría
scripts/cv/            Generador del CV en PDF (react-pdf) + facts.ts
scripts/check-*.ts         Los guardianes de CI. Todos comparten dos reglas de método:
                           buscan la AUSENCIA (no el patrón) y afirman cuánto han mirado
scripts/indices.ts         Genera los tres índices derivados de sus cabeceras (D69)
scripts/check-guardianes.ts  Un caso malo conocido por guardián. Fuera de CI: muta
                           archivos, así que exige árbol limpio y restaura (D70)
scripts/design-review/     Censo de pares de contraste del DOM servido
scripts/psi.ts             PageSpeed desde la terminal, con desglose del LCP (D49)
scripts/page-html-diff.ts  Gate de refactor: el HTML servido de las 12 páginas no puede cambiar
scripts/artefacto-svg.ts   Traductor del export de Mermaid al SVG que el sitio sirve. Aborta si
                           queda UN solo color literal: busca la ausencia (D54)

.github/workflows/     CI, doce pasos en cada PR
.github/dependabot.yml Escaneo de dependencias: PRs semanales (npm + github-actions)
.claude/skills/        Skills del proyecto (update-cv, close-session, sprint-review, design-review,
                       deep-dive-page)
.claude/agents/        Subagentes: viewport-verifier (mide una página servida con agent-browser;
                       mide y reporta, no edita, D52)
```

</details>

## Documentación

El «porqué» vive en documentos dedicados, y están partidos por una regla: **las reglas activas se leen siempre; la historia y el detalle exhaustivo, a demanda.**

| Documento | Qué contiene |
| :-- | :-- |
| [PRD-Live.md](./PRD-Live.md) | Spec viva: qué es el producto hoy y qué tiene que cumplir |
| [PRD-Historical.md](./PRD-Historical.md) | Registro fechado de decisiones de producto, diseño y alcance |
| [DECISIONS.md](./DECISIONS.md) | Decisiones técnicas del build (ADR-lite), numeradas y fechadas |
| [BRAND.md](./BRAND.md) | Sistema de marca: reglas siempre activas (color, tipografía, tokens, a11y) |
| [BRAND-historical.md](./BRAND-historical.md) | El porqué fechado de esas reglas: qué se probó y qué falló antes |
| [BRAND-logo.md](./BRAND-logo.md) | Enciclopedia del logo y la firma split |
| [CLAUDE.md](./CLAUDE.md) | Convenciones de código (i18n, tokens, a11y, SEO) y la regla de construcción |
| [LICENSE](./LICENSE) | Público para consulta, no código abierto: todos los derechos reservados |
| [AGENTS.md](./AGENTS.md) | Aviso: este Next tiene breaking changes; leer los docs del paquete antes de tocar APIs |

## Despliegue

Vercel, con **previews por rama y por PR**, y `main` = producción ([franciscolopez.es](https://franciscolopez.es)).
Flujo: ramas cortas → PR → merge (squash si trae un commit, rebase si trae varios) → tag `vX.Y.Z` por release.

---

<div align="center">

**Francisco López** · Senior Product Manager
[franciscolopez.es](https://franciscolopez.es) · [LinkedIn](https://linkedin.com/in/franciscolopez1975)

<sub>Repositorio <b>público para consulta</b>, no de código abierto: <a href="./LICENSE">todos los derechos reservados</a>.<br>
El código está a la vista para que se pueda examinar. ¿Quieres reutilizar algo? Escribe.</sub>

</div>
