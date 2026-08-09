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
9. **Franja-CTA de cierre** — banda de fondo propio con copy de posicionamiento al ICP;
   el email es la acción destacada (único botón sólido del sitio) y teléfono, LinkedIn y
   CV la acompañan como canales de apoyo.
10. **Footer** — Brand Kit, Design System, Accesibilidad, Cookies, LinkedIn.

Páginas fuera de la home llevan breadcrumb y enlaces entre hermanas. El **Design System**
documenta el sistema en doce secciones; desde el 2026-08-04 publica **«Botones y acciones»**
y desde el 2026-08-09 **«Etiquetas»**, las dos con las piezas reales del sitio como demo —
si una variante cambia, la página cambia con ella y no puede mentir.

**Las tres superficies de contacto comparten un solo patrón** (franja de la home, cierre
de Sobre mí y «reportar una barrera» de Accesibilidad): mismo componente, mismos datos y
misma jerarquía, de modo que Sobre mí resuelve el contacto en la propia página en vez de
devolver al usuario a la home. Detalle en `DECISIONS.md` D29.

## 5. Sistema (criterios de aceptación, no aspiraciones)

- **Stack / arquitectura**: Next 16 (App Router), TypeScript `strict`, Tailwind v4, capa de
  componentes propia. **shadcn/ui está configurado y sin usar**: entra solo para widgets con
  estado, foco atrapado o portal, y hacia delante (D6). i18n nativo `app/[lang]`, diccionario
  tipado, cero strings hardcodeados. Detalle en `README.md` y `DECISIONS.md`.
- **Marca**: regla de dos capas (cian = único color de acción; morado decorativo con
  cuentagotas), tipografía Bricolage/Inter, logo con split. Detalle en `BRAND.md`.
- **Capa de componentes — cuatro capas**: todo elemento accionable —botón, chip, toggle,
  pestaña, control de icono— sale de `components/ui/action.tsx`; el **rótulo que no se
  pulsa** (la pastilla de «Exit», «AAA», «13,79:1») de `components/ui/badge.tsx`; el par
  **eyebrow + titular** de `components/ui/heading.tsx`; y las cajas y ritmos comunes de
  `components/ui/layout.ts`. Entre acción y etiqueta decide una sola pregunta —**¿se
  pulsa?**—, porque sin pulsación no hay estado, hover, foco ni suelo táctil, y media base
  de la variante de acción no significaría nada. **Ninguno se escribe con clases sueltas**: si un caso no
  encaja en una variante, se crea la variante; la excepción se documenta con fecha. Es
  lo que hace que un cambio de hover, de radio, del objetivo táctil, del icono que lleva
  una acción o del fondo de reposo de un control solo-icono llegue a todo el sitio a la
  vez. Los iconos son de **lucide**; los que lucide no trae —hoy LinkedIn— se dibujan a
  mano siguiendo la **regla de autoría de iconos propios**, para que un icono del sitio
  no se distinga de uno de la librería. Los **widgets con estado, foco atrapado o portal**
  (diálogo, popover, tabs) se traen de shadcn en vez de escribirse —misma forma que la regla
  de iconos—, pero **hacia delante**: los que hoy están a mano funcionan, tienen 0 violaciones
  de axe y no se reescriben. Detalle en `BRAND.md` y `DECISIONS.md` D6/D35/D36.
- **No funcionales**: PageSpeed/Lighthouse **>90 desktop y móvil**; accesibilidad **AA
  de suelo, AAA objetivo**; **SEO + JSON-LD por página** como criterio de cierre.
  Estado verificado el 2026-08-04: **todos los pares de color del sistema están en AAA en
  ambos temas, en reposo y en hover, sin excepciones** —la última que quedaba, el hover del
  toggle apagado, se resolvió subiéndolo de 6,35/6,98 a 7,21/7,80 sin apagar la señal visual
  del hover— y **0 violaciones de axe** en las seis páginas, en claro y oscuro, incluido el
  diálogo de consentimiento. Las cifras publicadas se miden sobre el color que el
  navegador pinta; el método está en `BRAND.md` §Accesibilidad. **Re-verificadas el
  2026-08-08** con un medidor independiente que reproduce al céntimo los ocho pares
  publicados en los dos temas — las cifras que el sitio publica son fiables; lo que
  quedaba desactualizado eran dos párrafos del propio `BRAND.md`, ya corregidos.
  **Ampliado el 2026-08-09 (P37.655): el censo de pares tenía dos huecos**, los de la
  pastilla —6,44/5,56 la neutra y 6,07/5,46 la teñida—, que ninguna de las dos auditorías
  anteriores vio porque **un par que solo existe al componer un velo sobre la superficie de
  debajo no aparece en ningún inventario de tokens**: se encuentra recorriendo el DOM, no
  leyendo `globals.css`. Corregidos a **8,17/9,17 y 10,63/10,02** y publicados en la tabla
  del Design System, que ahora lista **diez** pares. Sigue habiendo **0 violaciones de axe**
  en home, Design System y Accesibilidad, ES y EN, claro y oscuro; **queda una en Brand Kit**
  —`brand-purple-accent` como texto pequeño sobre `--card` en la escalera del logo, 3,69:1—
  que es preexistente, ajena a la capa de etiqueta y está tareada aparte.
- **Medición**: GA4/GTM + Microsoft Clarity (cualitativo: heatmaps y grabaciones de
  sesión), ambos gateados a producción y a consentimiento (Consent Mode v2). Métricas
  de éxito → §7.
- **Calidad / seguridad**: CI (GitHub Actions) que corre typecheck + lint + build en cada
  PR (nada que no compile entra en `main`); **escaneo de dependencias automatizado
  (Dependabot)**; cabeceras de seguridad servidas (nosniff, X-Frame-Options, Referrer-Policy,
  Permissions-Policy, HSTS **y CSP «A+ barato»**: directivas base + allowlist GTM/GA4,
  manteniendo `'unsafe-inline'`; la CSP estricta con nonces va con la IA conversacional de
  V3). Detalle en `DECISIONS.md`.
- **Revisiones recurrentes**: dos skills con mirada externa, para que la mejora no dependa
  de acordarse — `sprint-review` (técnica, al cerrar etapa) y **`design-review`** (diseño:
  cumplimiento del sistema + expresión de marca, verificando **en pantalla** y no solo en el
  código; de disparo manual hasta validarla). La segunda nace de que cuatro incumplimientos
  reales sobrevivieron a una auditoría por fallos de método, no de criterio, y su primer
  disparo (2026-08-08) encontró seis cosas que ni axe ni el typecheck pueden ver.

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
- **Optimización continua**: más métricas, marca externa (firma de email, header de
  LinkedIn), rediseño de assets.

Las mejoras técnicas pendientes (tests automatizados, CSP estricta con nonces, etc.)
viven en el tablero de tareas; el porqué de cada decisión de producto, en **[PRD-Historical.md](./PRD-Historical.md)**.
