# PRD Live — Web personal de Francisco López

> **Spec viva: qué es el producto hoy y qué tiene que cumplir.** Present-tense,
> estado actual. El **registro completo de decisiones y su porqué** (secciones
> fechadas, debates, cosas revertidas) vive en **[PRD-Historical.md](./PRD-Historical.md)**.
> Convenciones de código → `CLAUDE.md` · decisiones técnicas → `DECISIONS.md` ·
> sistema de marca → `BRAND.md` (su porqué fechado → `BRAND-historical.md`) ·
> overview/stack → `README.md`.

## 1. Propósito

Web personal de **Francisco López**, Senior Product Manager (10+ años en SaaS B2B y
B2C, con un exit: TheTool → AppRadar). **Objetivo: facilitar el cambio de trabajo**
demostrando criterio de Producto, SaaS, UX, mentalidad builder, IA aplicada y Growth.
La propia web es la **prueba de criterio técnico y de diseño** — no un CV en HTML.

## 2. Audiencia — dos velocidades de lectura

| Perfil | Cómo lee | Qué necesita |
|---|---|---|
| HR / Recruiter | Escaneo 5-10s | Rol, seniority, stack |
| CEO / CPO / VP Product | Lectura profunda | Outcomes, criterio de producto |

El **above the fold pasa el filtro de RRHH**; al hacer scroll, el contenido
profundiza para perfiles de Producto.

**ICP de empresa objetivo:** SaaS con product-market fit, con función de producto real
(PM/Product Designer o founder con peso en producto), IA integrada en el día a día,
remoto o híbrido fuerte, en España.

## 3. Posicionamiento y narrativa

En orden: **1) Senior Product Manager · 2) Cofundador con exit · 3) ADN Growth.**
**Reveal gradual**: el exit/founder no aparece en el Hero; se descubre al hacer scroll.
Hitos, justo debajo del Hero, es la red de seguridad para el lector rápido.

## 4. Estado actual — en producción (`franciscolopez.es`)

**Doce páginas por idioma**, en ES (raíz `/`) y EN (`/en`):

- **Home**, una sola página con las diez secciones de abajo.
- **Sobre mí**, **Brand Kit**, **Design System**, **Accesibilidad** y **Política de cookies**.
- **El deep-dive por experiencia**: el índice `/trayectoria` y las cinco páginas de
  `/trayectoria/[slug]` (Emendu, KUOTIP, INDYA, Freepik y TheTool). Doce por idioma son
  las **24 variantes** que usan `gate:html`, el sitemap y el recorrido de `design-review`.

Y con ellas: **CV en PDF bilingüe** descargable con identidad de marca y generado por
código · **SEO técnico y Open Graph** por página · **medición** (GA4/GTM con
consentimiento RGPD) · **dominio propio** · **páginas 404/500 de marca e i18n** ·
**cabeceras de seguridad** (nosniff, X-Frame-Options, Referrer-Policy,
Permissions-Policy, HSTS y CSP «A+ barato»).

La apertura de **Sobre mí es un vídeo**: se reproduce una vez y se queda en su último
fotograma; con `prefers-reduced-motion` se sirve una imagen quieta y el vídeo **no se
descarga** (D65).

### Estructura de la home (orden actual)

1. **Nav sticky** — logo (split→flat al scroll), Descargar CV, Sobre mí, toggle
   claro/oscuro; en móvil CV y Sobre mí colapsan tras menú.
2. **Hero** — foto, headline "Del discovery al dato", subheadline; sin CTA propio.
3. **Hitos** — 5 reconocimientos, cronológico descendente; chip "Exit" en el de TheTool.
4. **Cómo trabajo** — 6 etapas: Discovery → UX → Prototipado → Desarrollo → Lanzamiento → Analítica.
5. **Más allá del PM** — banda de manifiesto (founder + growth), fondo de marca invertido.
6. **Trayectoria** — bloque Producto + bloque Experiencia previa (Marketing & Growth); logos reales monocromo; el rol enlaza al deep-dive; CTA Descargar CV.
7. **Toolkit** — 4 categorías (Usuarios / Gestión y Documentación / Diseño y prototipado / Desarrollo) en pestañas, logos reales monocromo.
8. **Formación** — Producto + Marketing.
9. **Franja-CTA de cierre** — banda de fondo propio con copy de posicionamiento al ICP;
   el email es la acción destacada (único botón sólido del sitio) y teléfono, LinkedIn y
   CV la acompañan como canales de apoyo.
10. **Footer** — Brand Kit, Design System, Accesibilidad, Cookies, LinkedIn, repositorio.

### Tres cosas que el sitio hace y no se ven mirándolo

- **Las páginas que documentan el sistema no pueden mentir.** El Design System lo publica
  en catorce secciones y el Brand Kit en seis, las dos con **las piezas reales del sitio
  como demo**: si una variante cambia, la página cambia con ella. Y no leen sus valores
  del diccionario, sino de `lib/design-values.ts` (D38), fuente única de lo que el sitio
  publica sobre sí mismo — tokens de layout, breakpoints y el censo de pares de contraste
  medidos. El diccionario se queda solo con el copy.
- **Las tres superficies de contacto son un solo patrón** (franja de la home, cierre de
  Sobre mí y «reportar una barrera» de Accesibilidad): mismo componente, mismos datos y
  misma jerarquía, de modo que Sobre mí resuelve el contacto en su propia página en vez de
  devolver al usuario a la home (D29).
- **Una página no se escribe: se compone.** `pageMetadata` deriva canonical, los tres
  `hreflang`, OG y Twitter de una sola fuente, y `<PageShell>` pone JSON-LD, nav, isla de
  motion, el `<main>` y footer (D45/D46). Las doce se **prerenderizan** por locale y el
  diccionario está **partido por página** (D48). Es lo que hace que una página nueva nazca
  con el `hreflang` correcto, con enlace de salto y estática, sin que nadie se acuerde.

## 5. Sistema (criterios de aceptación, no aspiraciones)

### Stack y arquitectura

Next 16 (App Router), TypeScript `strict`, Tailwind v4 y capa de componentes propia.
**shadcn/ui está configurado y sin usar**: entra solo para widgets con estado, foco
atrapado o portal, y hacia delante (D6). i18n nativo `app/[lang]`, diccionario tipado,
cero strings hardcodeados. Detalle en `README.md` y `DECISIONS.md`.

### Marca

Regla de dos capas (cian = único color de acción; morado decorativo con cuentagotas),
tipografía Bricolage/Inter, logo con split. Detalle en `BRAND.md`.

### Capa de componentes — siete piezas

| Pieza | Qué resuelve |
|---|---|
| `ui/action.tsx` | El control **con caja**: botón, chip, toggle, pestaña, control de icono |
| `ui/chrome.tsx` | El **enlace de la carpintería**: nav, menú móvil, breadcrumb, footer, canales de contacto |
| `ui/badge.tsx` | El **rótulo que no se pulsa** («Exit», «AAA», «13,79:1») |
| `ui/heading.tsx` | El par **eyebrow + titular** |
| `ui/table.tsx` | La **rejilla de filas y celdas**: marcado de tabla real si son datos, divs si son especímenes |
| `ui/stat-row.tsx` | La **fila de cifras** que resume una apertura |
| `ui/layout.ts` | Cajas y ritmos comunes (`WRAP`, `SECTION`, `PROSE`, `CARD`, `PANEL`, `PAIR`, `HERO_ROW`, `LEAD_GAP`) |

Encima de las siete, la **capa de página**: `lib/page-meta.ts` y
`components/site/page-shell.tsx` (D45/D46).

Cuál toca se decide con dos preguntas — **¿se pulsa?** y, si sí, **¿tiene caja propia?** —
no por parecido: un chip que solo rotula no es un botón pequeño, y un enlace de nav
tampoco. **Ninguno se escribe con clases sueltas**: si un caso no encaja en una variante,
se crea la variante; la excepción se documenta con fecha. Es lo que hace que un cambio de
hover, de radio, del objetivo táctil o del icono de una acción llegue a todo el sitio a la
vez. Los iconos son de **lucide**; los que lucide no trae (LinkedIn y GitHub) se dibujan a
mano con la regla de autoría de iconos propios. Detalle en `BRAND.md` y en
`DECISIONS.md` D6/D35/D36/D40/D43/D64.

**Y toda página y toda sección abren igual**: el ordinal dentro del eyebrow, el titular
como afirmación y entradilla debajo, con el hueco puesto por la capa (D43).

### El atenuado lo resuelve la superficie, no el punto de uso

`text-muted-foreground` no significa «este gris»: significa «el atenuado del fondo donde
caiga este texto». Cada superficie redefine `--surface-dim` mezclando el texto un 85%
hacia su propio fondo, incluidas las que cambian por **estado** (`hover:`,
`focus-visible:`). Un bloque que se pinta su propia superficie declara su familia con
`data-surface`. Es lo que hace que **la accesibilidad se herede** y que una tarjeta nueva
nazca bien sin pedirlo (D30/D39/D61).

### No funcionales

| Criterio | Umbral | Estado |
|---|---|---|
| PageSpeed / Lighthouse | >90 escritorio y móvil | **100 escritorio · 94-96 móvil** (`npm run psi`, D49) |
| Accesibilidad | AA de suelo, AAA objetivo | **Cero pares bajo AAA** en las doce páginas × 2 temas, en reposo y en hover; **0 violaciones de axe** |
| SEO + JSON-LD por página | Criterio de cierre, no extra | Cumplido en las doce |

Las cifras de contraste se miden **sobre el color que el navegador pinta**, recorriendo el
DOM de la página servida y no leyendo `globals.css` — un par que solo existe al componer un
velo, o solo mientras el cursor está encima, no aparece en ningún inventario de tokens. El
método y sus siete trampas, en `BRAND.md` §Accesibilidad; el censo, en
`scripts/design-review/contrast-census.js`; las cifras publicadas, en
`lib/design-values.ts` (D38).

Del LCP móvil, el ~81% es retraso de renderizado: ahí queda margen, no incumplimiento.

### Cómo se verifica lo que no ve un compilador

- **Gate de accesibilidad**: `agent-browser` conducido por el subagente
  `viewport-verifier`, con matriz de cuatro viewports × dos temas + `reduced-motion`.
  **Se dispara dos veces**, y la primera no es al cerrar: si la sección lleva banda o hero
  dimensionado por `vw`, también *mientras se dibuja*, porque el eje que falta no es el
  tema sino el **alto** (D50/D52). El **enlace de salto** de WCAG 2.4.1 sigue a mano:
  axe no lo detecta (D46).
- **`npm run gate:html`**: compara el HTML servido de las 24 variantes antes y después de
  un refactor. Diff vacío = transparente por construcción. Es el gate que más ha cazado
  y no está en CI (D42/D45).
- **`npm run psi`**: la nota de PageSpeed contra producción, a demanda y nunca como gate
  de CI, porque su variabilidad daría rojos falsos (D49).

### Calidad y seguridad

CI en cada PR con **doce pasos**: formato, typecheck, lint, paleta, experiencias, CV al
día, raya, artefacto, contexto, skills, decisiones y build. Todos comparten una regla de
método: **buscan la AUSENCIA, no el patrón**, y **afirman cuánto han mirado** — un metro
que devuelve lista vacía parece un aprobado, y este proyecto se lo ha encontrado cinco
veces (D38/D57/D60/D63).

`main` **la protege el servidor y no la disciplina**: sin push directo, sin merge con CI
en rojo, sin bypass de admin, y solo `squash` o `rebase` (D68). Escaneo de dependencias
con Dependabot. Cabeceras de seguridad servidas, con la CSP en allowlist mínima: base +
GTM/GA4, Clarity (D32) y `youtube-nocookie` (D55). Se mantiene `'unsafe-inline'`; la CSP
estricta con nonces va con la IA conversacional (V4), o antes si Contacto ampliada
incorpora un endpoint externo.

El **repositorio es público** desde el 2026-08-19, con `LICENSE` explícito («público para
consulta, no código abierto») y enlace en el footer.

### Revisiones recurrentes

| Skill | Qué mira | Cuándo |
|---|---|---|
| `sprint-review` | Técnica: código, deuda, drift docs↔código, y el **check de medición** | Al cerrar etapa, automático |
| `design-review` | Diseño: cumplimiento del sistema + expresión de marca, **en pantalla** | Manual, antes de un release visual |
| `close-session` | Documentación, altas **y retiradas** | Al cerrar sesión |

## 6. CV en PDF

Bilingüe (ES/EN), 2 páginas, ATS (texto seleccionable), con identidad de marca.
**Generado por código desde fuente única**: los hechos (roles, fechas, formación,
toolkit) se leen del diccionario i18n; el CV solo autora el texto rico. Se regenera con
`npm run cv`. Detalle técnico en `DECISIONS.md` D22; flujo de actualización en el skill
`update-cv`.

## 7. Métricas de éxito

- **Primaria**: clics en contacto (`mailto:` / `tel:`) — proxy de intención (no hay
  formulario en V1).
- **Secundarias**: clics en Descargar CV (3 puntos: nav, CTA de Trayectoria, Contacto) y
  profundidad de scroll.
- **Herramienta**: GA4 (captura scroll y descarga de fábrica).

## 8. Datos del candidato

- **Francisco Javier López Martínez** — Senior Product Manager, SaaS B2B / B2C
- Email: `franciscojavier.lopezmartinez@gmail.com` · Teléfono: 629 832 720
- LinkedIn: `linkedin.com/in/franciscolopez1975` · Valencia

## 9. Alcance por versión

> El detalle ejecutable —orden, dependencias y tamaños— vive en el tablero de tareas;
> aquí solo qué entra en cada release y qué queda fuera. El porqué de cada decisión, en
> **[PRD-Historical.md](./PRD-Historical.md)**.

### V2 — en curso

Tres sprints de valor para el visitante, en el orden que fijan las dependencias. **El
primero está entregado**; entre él y el segundo se han intercalado dos bloques cortos.

| # | Sprint | Estado |
|---|---|---|
| 1 | **Deep-dive por experiencia** — cinco páginas y su índice | **En producción** |
| — | *Sprint Lite* — 404 de los deep-dive, la raya fuera del copy, retrato nuevo, vídeo de Sobre mí, aperturas homogéneas, repo público | **En producción** |
| — | *Método* — el andamiaje del propio método antes de un sprint de contenido | **Entregado** |
| 2 | **«Cómo se ha creado esta página»** | **En curso** |
| 3 | **Footer estructurado y Contacto ampliada** | Después |

**Sprint 2 — «Cómo se ha creado esta página».** Una página con estructura y metadata de
artículo (`TechArticle`) contando el proceso: marca, stack, sistema de componentes,
accesibilidad, metodología, revisiones y medición. **No es un blog** y no habrá índice de
artículos ni feed. Es la pieza que enseña el *proceso* donde el resto del sitio enseña el
*resultado*, y por eso habla a los tres perfiles a la vez (producto, técnico, UX/UI).

**Sprint 3 — Footer y Contacto ampliada.** El footer va el último **porque necesita que
existan las secciones que crean los dos sprints anteriores**. De Contacto ampliada, lo
primero es definir qué añade sobre la franja compartida de D29: si la respuesta es «nada»,
la conclusión legítima es reforzar la franja y no construir la página.

**Traducción a EN**: la arquitectura i18n ya está; se traduce a medida que se añade
contenido, revisando el EN contra el ES y no al revés (D20).

**Qué NO lleva deep-dive, y no es por alcance:** las dos entradas de Marketing & Growth
(diluirían el orden del posicionamiento de §3) y **PICKASO**, que es el primer capítulo de
la historia de TheTool y no una experiencia con historia separable.

### V3 — deuda y mejoras por bloque

Sin fecha ni compromiso de release conjunto: entran en el sprint que las toque o cuando
dejen de poder esperar. Agrupadas por dónde viven — *General* (higiene de validadores,
dependencias, `qlty`, tests cuando aparezca la primera lógica de negocio real), *Home*
(gesto-firma de marca, presencia del morado, kicker del Hero, `WebSite` en JSON-LD),
*Brand Kit*, *Design System* (copy-to-clipboard de tokens, simulador de foco) y
*Accesibilidad*.

### V4 — IA conversacional

**«Pregúntale a mi carrera»** — sin definir: modelo, arquitectura, datos, coste y UX.
Arrastra la CSP estricta con nonces (§5).

**Su corpus tiene un límite fijado antes de que exista el agente: lo que no va por escrito
en el sitio, tampoco va aquí.** Un agente público publica igual que una página, y además
responde sin Francisco delante y en frases que no puede revisar, así que no sirve como
papelera de lo que se cuenta en una entrevista y no en abierto (motivos de salida,
problemas internos, límites de un equipo). **V4 absorbe profundidad sobre lo que ya es
público, no discreción.**

### Fuera de alcance, sin versión asignada

**Marca externa**: firma de email, header de LinkedIn, rediseño de assets.
