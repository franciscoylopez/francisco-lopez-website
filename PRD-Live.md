# PRD Live — Web personal de Francisco López

> **Spec viva: qué es el producto hoy y qué tiene que cumplir.** Present-tense,
> estado actual. El **registro completo de decisiones y su porqué** (secciones
> fechadas, debates, cosas revertidas) vive en **[PRD-Historical.md](./PRD-Historical.md)**.
> Convenciones de código → `CLAUDE.md` · decisiones técnicas → `DECISIONS.md` ·
> sistema de marca → `BRAND.md` · overview/stack → `README.md`.

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

V1 lanzada. En vivo:
- **Home** (una sola página), en **ES (raíz `/`) y EN (`/en`)**.
- Páginas propias: **Sobre mí**, **Brand Kit**, **Design System**, **Accesibilidad**,
  **Política de cookies**.
- **CV en PDF bilingüe** (ES/EN) descargable, con identidad de marca, generado por código.
- **SEO técnico + Open Graph** por página, **medición** (GA4/GTM + consentimiento RGPD),
  **dominio propio**.
- **Páginas de error 404/500 con marca e i18n** (el 404 con el "0" del split animado) y
  **cabeceras de seguridad** (nosniff, X-Frame-Options, Referrer-Policy, Permissions-Policy,
  HSTS y CSP «A+ barato»).

### Estructura de la home (orden actual)

1. **Nav sticky** — logo (split→flat al scroll), Descargar CV, Sobre mí, toggle
   claro/oscuro; en móvil CV y Sobre mí colapsan tras menú.
2. **Hero** — foto, headline "Del discovery al dato", subheadline; sin CTA propio.
3. **Hitos** — 5 reconocimientos, cronológico descendente; chip "Exit" en el de TheTool.
4. **Cómo trabajo** — 6 etapas: Discovery → UX → Prototipado → Desarrollo → Lanzamiento → Analítica.
5. **Más allá del PM** — banda de manifiesto (founder + growth), fondo de marca invertido.
6. **Trayectoria** — bloque Producto + bloque Experiencia previa (Marketing & Growth); logos reales monocromo; CTA Descargar CV.
7. **Toolkit** — 4 categorías (Usuarios / Gestión y Documentación / Diseño y prototipado / Desarrollo) en pestañas, logos reales monocromo.
8. **Formación** — Producto + Marketing.
9. **Contacto** — email, teléfono, LinkedIn, CV (todos enlaces clicables).
10. **Footer** — Brand Kit, Design System, Accesibilidad, Cookies, LinkedIn.

Páginas fuera de la home llevan breadcrumb y enlaces entre hermanas.

## 5. Sistema (criterios de aceptación, no aspiraciones)

- **Stack / arquitectura**: Next 16 (App Router), TypeScript `strict`, Tailwind v4, shadcn/ui.
  i18n nativo `app/[lang]`, diccionario tipado, cero strings hardcodeados. Detalle en
  `README.md` y `DECISIONS.md`.
- **Marca**: regla de dos capas (cian = único color de acción; morado decorativo con
  cuentagotas), tipografía Bricolage/Inter, logo con split. Detalle en `BRAND.md`.
- **No funcionales**: PageSpeed/Lighthouse **>90 desktop y móvil**; accesibilidad **AA
  de suelo, AAA objetivo** (el sistema de color entero está en AAA); **SEO + JSON-LD por
  página** como criterio de cierre.
- **Medición**: GA4/GTM gateado a producción y a consentimiento. Métricas de éxito →
  §7.
- **Calidad / seguridad**: CI (GitHub Actions) que corre typecheck + lint + build en cada
  PR (nada que no compile entra en `main`); **escaneo de dependencias automatizado
  (Dependabot)**; cabeceras de seguridad servidas (nosniff, X-Frame-Options, Referrer-Policy,
  Permissions-Policy, HSTS **y CSP «A+ barato»**: directivas base + allowlist GTM/GA4,
  manteniendo `'unsafe-inline'`; la CSP estricta con nonces va con la IA conversacional de
  V3). Detalle en `DECISIONS.md`.

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

## 9. Fuera del alcance actual (V2+)

- **Deep-dive por experiencia** (comparte fuente de contenido con el CV).
- **Contacto ampliada**.
- **Traducción de contenido nuevo a EN** (la arquitectura i18n ya está; la traducción se
  hace a medida que se añade contenido).
- **IA conversacional** "Pregúntale a mi carrera" (V3).
- **Optimización continua**: Microsoft Clarity (cualitativo), más métricas, marca externa
  (firma de email, header de LinkedIn), rediseño de assets.

Las mejoras técnicas pendientes (tests automatizados, CSP estricta con nonces, etc.)
viven en el tablero de tareas; el porqué de cada decisión de producto, en **[PRD-Historical.md](./PRD-Historical.md)**.
